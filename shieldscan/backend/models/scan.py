from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict, Any

class ScanRequest(BaseModel):
    url: HttpUrl

class Issue(BaseModel):
    title: str
    impact: str
    difficulty: str  # "Easy", "Medium", "Advanced"
    score_impact: int
    category: str
    details: Optional[Dict[str, Any]] = None
    fix_title: Optional[str] = None # blurred out unless paid
    fix_snippet: Optional[str] = None # The exact copy-paste fix

class ScanResult(BaseModel):
    id: Optional[int] = None
    url: str
    score: int
    grade: str # A, B, C, D, F
    issues: List[Issue]
    ai_summary: str
    ssl_status: Dict[str, Any]
    headers_status: Dict[str, Any]
    blacklist_status: Dict[str, Any]
    mcp_exposed: bool
    cors_vulnerable: bool
    exposure_status: Optional[Dict[str, Any]] = None
    dmarc_status: Optional[Dict[str, Any]] = None
