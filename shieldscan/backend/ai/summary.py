# pyre-ignore-all-errors
import os
from typing import List, Dict, Any
import groq

def generate_summary(score: int, grade: str, issues: List[Dict[str, Any]]) -> str:
    """
    Hybrid AI Template for the WOW Moment.
    """
    critical_count = len([i for i in issues if i.get('difficulty') == 'Medium' or i.get('difficulty') == 'Advanced'])
    
    api_key = os.getenv("GROQ_API_KEY")
    if api_key and api_key != "your-api-key":
        try:
            client = groq.Groq(api_key=api_key)
            issues_text = "\n".join([f"- {i.get('title')}: {i.get('impact')}" for i in issues])
            prompt = f"You are a professional security analyst. The user's website has been scanned and received a score of {score}/100 and a grade of {grade}. The following issues were found:\n{issues_text}\nWrite a short, professional, and directly addressed 2-3 sentence executive summary of these security results. Make it sound helpful but urgent."
            
            message = client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return message.choices[0].message.content
        except Exception as e:
            print("Groq API Error:", e)

    # Fallback if no API key or API call failed
    summary = f"Your website scored a {score}/100 ({grade}). "
    
    if score >= 80:
        summary += "Your outer perimeter looks solid, though some minor issues remain."
    elif score >= 50:
        summary += f"We found {critical_count} critical issues that hackers could exploit. Fixing these will raise your score significantly."
    else:
        summary += f"Hackers see a vulnerable target. With {critical_count} critical issues openly exposed, you are heavily at risk of automated exploitation."
        
    return summary

def format_issue_texts(issue_key: str) -> dict:
    """
    Plain English Business Impact + Fix Difficulty + Exact Fix Snippet
    """
    templates = {
        "missing_csp": {
            "title": "Missing Content Security Policy",
            "impact": "This allows attackers to inject malicious scripts that steal your visitors' data.",
            "difficulty": "Easy",
            "score_impact": 15,
            "category": "Security Headers",
            "fix_title": "Add CSP Header",
            "fix_snippet": "add_header Content-Security-Policy \"default-src 'self'; script-src 'self' 'unsafe-inline';\"; # Nginx config snippet"
        },
        "missing_hsts": {
            "title": "Missing HTTP Strict Transport Security (HSTS)",
            "impact": "Attackers can intercept traffic by forcing users to use unencrypted HTTP connections.",
            "difficulty": "Easy",
            "score_impact": 10,
            "category": "Security Headers",
            "fix_title": "Configure HSTS",
            "fix_snippet": "add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always; # Nginx config snippet"
        },
        "ssl_expiring": {
            "title": "SSL Certificate Expiring Soon",
            "impact": "In 14 days your site will show a security warning and visitors will leave.",
            "difficulty": "Medium",
            "score_impact": 20,
            "category": "SSL and Encryption",
            "fix_title": "Renew SSL",
            "fix_snippet": "# Run certbot for Let's Encrypt\nsudo certbot renew --force-renewal"
        },
        "ssl_invalid": {
            "title": "Invalid SSL Certificate",
            "impact": "Browsers currently block users from visiting your site, throwing an 'Insecure' warning.",
            "difficulty": "Medium",
            "score_impact": 40,
            "category": "SSL and Encryption",
            "fix_title": "Install Valid SSL",
            "fix_snippet": "# Install certbot to issue certificates\nsudo apt install certbot python3-certbot-nginx\nsudo certbot --nginx -d yourdomain.com"
        },
        "admin_exposed": {
            "title": "Admin Panel Exposed",
            "impact": "Anyone can attempt to brute-force their way into your admin account.",
            "difficulty": "Medium",
            "score_impact": 30,
            "category": "Information Exposure",
            "fix_title": "Restrict Admin Access",
            "fix_snippet": "# Nginx: Restrict /admin to specific IPs\nlocation /admin {\n    allow 192.168.1.0/24;\n    deny all;\n}"
        },
        "sensitive_files": {
            "title": "Sensitive Files Exposed",
            "impact": "Hackers can read your .env file or config, stealing database passwords or API keys.",
            "difficulty": "Easy",
            "score_impact": 50,
            "category": "Information Exposure",
            "fix_title": "Block Dotfile Access",
            "fix_snippet": "# Nginx: Deny access to hidden files\nlocation ~ /\\. {\n    deny all;\n    access_log off;\n    log_not_found off;\n}"
        },
        "missing_dmarc": {
            "title": "Missing DMARC Record",
            "impact": "Attackers can send emails pretending to be you and scam your customers.",
            "difficulty": "Medium",
            "score_impact": 15,
            "category": "Email Security",
            "fix_title": "Add DMARC Record",
            "fix_snippet": "Type: TXT\nName: _dmarc.yourdomain.com\nValue: v=DMARC1; p=quarantine; rua=mailto:postmaster@yourdomain.com;"
        },
        "over_permissive_cors": {
            "title": "Over-permissive CORS",
            "impact": "Other websites can make requests to your site pretending to be your users.",
            "difficulty": "Easy",
            "score_impact": 20,
            "category": "Vibe Coding Audit",
            "fix_title": "Restrict CORS Origin",
            "fix_snippet": "// Express.js: Restrict CORS\napp.use(cors({\n  origin: ['https://yourfrontend.com']\n}));"
        },
        "mcp_exposed": {
            "title": "MCP Server Exposed",
            "impact": "Your AI agent connection is publicly visible and can be hijacked.",
            "difficulty": "Medium",
            "score_impact": 35,
            "category": "AI Security 2026",
            "fix_title": "Block Public MCP Access",
            "fix_snippet": "# Nginx: Deny access to MCP routes from outside\nlocation /mcp {\n    allow 127.0.0.1;\n    deny all;\n}"
        },
        "missing_x_frame": {
            "title": "Missing X-Frame-Options",
            "impact": "Attackers can trick users by embedding your site into a hidden iframe (Clickjacking).",
            "difficulty": "Easy",
            "score_impact": 10,
            "category": "Security Headers",
            "fix_title": "Add X-Frame-Options",
            "fix_snippet": "add_header X-Frame-Options \"SAMEORIGIN\" always; # Nginx config snippet"
        },
        "weak_tls": {
            "title": "Weak TLS Version Detected",
            "impact": "Older encryption standards allow attackers to decrypt traffic between users and your site.",
            "difficulty": "Medium",
            "score_impact": 15,
            "category": "SSL and Encryption",
            "fix_title": "Disable TLS 1.0/1.1",
            "fix_snippet": "# Nginx: Only allow TLS 1.2 and 1.3\nssl_protocols TLSv1.2 TLSv1.3;"
        }
    }
    
    return templates.get(issue_key, {
        "title": "Unknown Vulnerability",
        "impact": "This poses an undefined risk to your website.",
        "difficulty": "Medium",
        "score_impact": 5,
        "category": "General",
        "fix_title": "Review Access Logs",
        "fix_snippet": "Run a comprehensive audit or contact a security professional."
    })
