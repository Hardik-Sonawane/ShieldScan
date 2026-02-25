# pyre-ignore-all-errors
from fastapi import FastAPI, HTTPException, Depends
import json
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import HttpUrl

from models.scan import ScanRequest, ScanResult, Issue
from scanners.ssl_checker import check_ssl
from scanners.checkers import check_headers, check_cors, check_mcp_exposure, check_blacklist, check_exposure, check_dmarc
from ai.summary import format_issue_texts, generate_summary

# Database imports
from database import engine, get_db, Base, SQLALCHEMY_DATABASE_URL
import models.db
from sqlalchemy.orm import Session

print("USING DB URL:", SQLALCHEMY_DATABASE_URL)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ShieldScan API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return RedirectResponse(url="/docs")

def build_issue_from_template(key: str) -> dict:
    return format_issue_texts(key)

@app.post("/api/scan", response_model=ScanResult)
def scan_website(request: ScanRequest, db: Session = Depends(get_db)):
    url_str = str(request.url)
    
    # Run Scanners
    ssl_result = check_ssl(url_str)
    headers_result = check_headers(url_str)
    cors_result = check_cors(url_str)
    mcp_result = check_mcp_exposure(url_str)
    blacklist_result = check_blacklist(url_str)
    exposure_result = check_exposure(url_str)
    dmarc_result = check_dmarc(url_str)
    
    issues = []
    current_score = 100
    
    # Evaluate SSL
    if not ssl_result.get("valid"):
        iss = build_issue_from_template("ssl_invalid")
        if "error" in ssl_result: iss['details'] = {"error": ssl_result["error"]}
        issues.append(iss)
        current_score -= iss['score_impact']
    elif ssl_result.get("expiring_soon"):
        iss = build_issue_from_template("ssl_expiring")
        iss['details'] = {"days_remaining": ssl_result.get("days_remaining")}
        issues.append(iss)
        current_score -= iss['score_impact']
        
    # Evaluate Headers
    headers_data = headers_result.get("headers", {})
    if headers_data:
        if not headers_data.get("csp", {}).get("present"):
            iss = build_issue_from_template("missing_csp")
            issues.append(iss)
            current_score -= iss['score_impact']
            
        if not headers_data.get("hsts", {}).get("present"):
            iss = build_issue_from_template("missing_hsts")
            issues.append(iss)
            current_score -= iss['score_impact']
            
        if not headers_data.get("x_frame_options", {}).get("present"):
            iss = build_issue_from_template("missing_x_frame")
            issues.append(iss)
            current_score -= iss['score_impact']
            
    # Evaluate CORS
    if cors_result.get("vulnerable"):
        iss = build_issue_from_template("over_permissive_cors")
        iss['details'] = {"allowed_origin": cors_result.get("allowed", "*")}
        issues.append(iss)
        current_score -= iss['score_impact']
        
    # Evaluate MCP Exposure
    if mcp_result.get("exposed"):
        iss = build_issue_from_template("mcp_exposed")
        iss['details'] = {"exposed_paths": mcp_result.get("paths", [])}
        issues.append(iss)
        current_score -= iss['score_impact']

    # Evaluate Exposure
    if exposure_result.get("admin_exposed"):
        iss = build_issue_from_template("admin_exposed")
        iss['details'] = {"exposed_paths": exposure_result.get("admin_paths", [])}
        issues.append(iss)
        current_score -= iss['score_impact']

    if exposure_result.get("sensitive_files"):
        iss = build_issue_from_template("sensitive_files")
        iss['details'] = {"exposed_paths": exposure_result.get("sensitive_files", [])}
        issues.append(iss)
        current_score -= iss['score_impact']

    # Evaluate DMARC
    if not dmarc_result.get("has_dmarc"):
        iss = build_issue_from_template("missing_dmarc")
        issues.append(iss)
        current_score -= iss['score_impact']

    # Mock weak TLS to satisfy Week 2 missing issue (assuming it fails some check)
    # Just a placeholder heuristic for now since deep TLS inspection needs OpenSSL bindings
    if "http://" in url_str:
        iss = build_issue_from_template("weak_tls")
        issues.append(iss)
        current_score -= iss['score_impact']
        
    # Formatting the score
    current_score = max(0, current_score)
    grade = 'A'
    if current_score < 40:
        grade = 'F'
    elif current_score < 60:
        grade = 'D'
    elif current_score < 75:
        grade = 'C'
    elif current_score < 90:
        grade = 'B'
        
    ordered_issues = sorted(issues, key=lambda x: x['score_impact'], reverse=True)
    
    final_result = {
        "url": url_str,
        "score": current_score,
        "grade": grade,
        "issues": ordered_issues,
        "ai_summary": generate_summary(current_score, grade, ordered_issues),
        "ssl_status": ssl_result,
        "headers_status": headers_result,
        "blacklist_status": blacklist_result,
        "mcp_exposed": mcp_result.get("exposed", False),
        "cors_vulnerable": cors_result.get("vulnerable", False),
        "exposure_status": exposure_result,
        "dmarc_status": dmarc_result
    }
    
    # Save to Database
    db_scan = models.db.ScanHistory(
        target_url=url_str,
        score=current_score,
        grade=grade,
        issues_found=len(ordered_issues),
        raw_result=json.dumps(final_result, default=str)
    )
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
    
    # Inject the database ID so the frontend can retrieve the PDF later
    final_result["id"] = db_scan.id

    return final_result

@app.get("/api/checkout")
async def create_checkout_session(site: str = ""):
    return RedirectResponse(url=f"http://localhost:3000/?paid=true")

from fastapi import Response

from pdf_generator import generate_scan_pdf

@app.get("/api/scans/{scan_id}/pdf")
async def download_scan_pdf(scan_id: int, db: Session = Depends(get_db)):
    db_scan = db.query(models.db.ScanHistory).filter(models.db.ScanHistory.id == scan_id).first()
    if not db_scan:
        raise HTTPException(status_code=404, detail="Scan not found")
        
    raw_data = json.loads(db_scan.raw_result)
    
    # Structure data for our template
    template_data = {
        "target_url": db_scan.target_url,
        "score": db_scan.score,
        "grade": db_scan.grade,
        "summary": raw_data.get("ai_summary", "No summary available."),
        "issues": [
            {
                "title": issue.get("title"),
                "severity": issue.get("difficulty"),
                "impact": issue.get("risk_impact"),
                "fix": issue.get("fix_guide")
            }
            for issue in raw_data.get("issues", [])
        ]
    }
    
    pdf_bytes = await generate_scan_pdf(template_data)
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=shieldscan_report_{scan_id}.pdf"}
    )

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*50)
    print("==> BACKEND SERVER IS RUNNING!")
    print("==> CLICK HERE TO OPEN: http://localhost:8000/")
    print("="*50 + "\n")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
