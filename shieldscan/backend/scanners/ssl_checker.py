import ssl
import socket
from datetime import datetime
from urllib.parse import urlparse

def check_ssl(url: str) -> dict:
    parsed_url = urlparse(url)
    hostname = parsed_url.hostname
    port = parsed_url.port or 443

    if not hostname:
        return {"valid": False, "error": "Invalid hostname"}

    context = ssl.create_default_context()
    try:
        with socket.create_connection((hostname, port), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                if not cert:
                    return {"valid": False, "error": "No certificate presented"}
                    
                not_after = cert.get('notAfter')
                if not_after:
                    expiry_date = datetime.strptime(str(not_after), '%b %d %H:%M:%S %Y %Z')
                    days_remaining = (expiry_date - datetime.utcnow()).days
                    
                    issuer_info = cert.get('issuer', [])
                    try:
                        issuer_name = dict(x[0] for x in issuer_info).get('organizationName', 'Unknown')
                    except Exception:
                        issuer_name = 'Unknown'
                        
                    return {
                        "valid": True,
                        "days_remaining": days_remaining,
                        "issuer": issuer_name,
                        "expiring_soon": days_remaining < 14
                    }
                return {"valid": False, "error": "Could not determine expiry"}
    except Exception as e:
        return {"valid": False, "error": str(e)}

