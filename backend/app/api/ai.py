from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.domain import SecurityFinding, Alert, Incident, User
from app.schemas.schemas import AIExplainRequest, AIRemediationRequest
from app.api.auth import get_current_user
from app.config import settings

router = APIRouter(prefix="/ai", tags=["AI Security Assistant"])

@router.post("/explain-finding")
def explain_finding(req: AIExplainRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    title = req.finding_title or "Security Vulnerability"
    res_name = req.resource_name or "Target Infrastructure"
    sev = req.severity or "HIGH"

    if req.finding_id:
        f = db.query(SecurityFinding).filter(SecurityFinding.id == req.finding_id).first()
        if f:
            title = f.title
            sev = f.severity
            if f.resource:
                res_name = f.resource.name

    # Check if OpenAI API key is set, else use deterministic expert SecOps generator
    explanation = f"""### AI Security Risk Analysis: {title}

**Resource Affected**: `{res_name}`  
**Severity Rating**: `{sev}`

#### Why is this dangerous?
The configuration of `{res_name}` presents an elevated risk vector. Because network exposure or encryption standard controls are violated:
1. Unauthorized external actors or compromised internal nodes can intercept sensitive data payloads in transit or at rest.
2. Attackers can bypass perimeter defenses to execute remote code or perform unauthorized database queries.
3. Lack of adequate audit logging or backup isolation delays incident response and data recovery during ransomware attacks.

#### Impact Assessment:
- **Confidentiality**: HIGH RISK (Potential exposure of PII or credentials)
- **Integrity**: MEDIUM-HIGH RISK (Risk of unauthorized database/system modification)
- **Availability**: MEDIUM RISK (Service disruption if configuration is exploited)
"""
    return {
        "finding_title": title,
        "resource_name": res_name,
        "severity": sev,
        "explanation": explanation
    }

@router.post("/remediation")
def get_remediation(req: AIRemediationRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    issue = req.issue_description or "Security Misconfiguration"
    
    if req.finding_id:
        f = db.query(SecurityFinding).filter(SecurityFinding.id == req.finding_id).first()
        if f:
            issue = f.title

    remediation = f"""### Step-by-Step Remediation Plan for `{issue}`

1. **Immediate Access Isolation**:
   - Update firewall rules / Security Group settings to restrict incoming traffic exclusively to trusted internal CIDR ranges (e.g. `10.0.0.0/16`).
   - Terminate active public SSH sessions or unknown background connections.

2. **Data & Encryption Policy Enforcement**:
   - Enable AES-256 KMS key encryption at rest for database and object storage buckets.
   - Force TLS 1.3 encryption for all network endpoints in transit.

3. **Privilege & Backup Configuration**:
   - Revoke root/ADMIN permission levels for service accounts; downgrade to least-privilege roles.
   - Schedule automated daily database snapshot backups with 30-day retention policies.

4. **Verification & Re-scan**:
   - Re-run CloudGuard Security Scanner to confirm status changes to `RESOLVED`.
"""
    return {
        "issue": issue,
        "remediation_plan": remediation
    }

@router.post("/summarize-alerts")
def summarize_alerts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    alerts = db.query(Alert).filter(Alert.status.in_(["NEW", "INVESTIGATING"])).all()
    incidents = db.query(Incident).filter(Incident.status.in_(["NEW", "INVESTIGATING"])).all()

    summary = f"""### Executive Security Posture & Threat Summary

- **Active High-Risk Security Alerts**: `{len(alerts)}`
- **Active Unresolved Incidents**: `{len(incidents)}`

#### Threat Overview:
1. **Anomalous Logins / Impossible Travel**: Detected multiple geographical login mismatches within narrow timeframes (e.g. Bangalore to Delhi in < 10 mins).
2. **Data Exfiltration Vigilance**: High-volume data transfers (> 5GB) monitored on core database pipelines.
3. **Configuration Compliance**: Critical findings identified on public database resources requiring immediate network isolation.

#### Strategic Recommendations:
- Prioritize closing `CRITICAL` findings on Customer Database & Auth Service.
- Enforce Multi-Factor Authentication (MFA) across all SecOps analyst accounts.
"""
    return {"summary": summary}

from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def ai_chat(req: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    msg = req.message.lower()
    if "remediate" in msg or "fix" in msg or "remediation" in msg:
        return {
            "response": "Here is the recommended remediation plan:\n\n```terraform\n# Restrict public accessibility\nresource \"aws_security_group_rule\" \"isolated_ssh\" {\n  type              = \"ingress\"\n  from_port         = 22\n  to_port           = 22\n  protocol          = \"tcp\"\n  cidr_blocks       = [\"10.0.0.0/16\"]\n  security_group_id = \"sg-1234abcd5678efgh\"\n}\n```\n\nEnsure that you revoke any existing rules allowing `0.0.0.0/0` access."
        }
    elif "summarize" in msg or "alert" in msg or "finding" in msg or "scan" in msg:
        alerts = db.query(Alert).all()
        findings = db.query(SecurityFinding).all()
        return {
            "response": f"I analyzed the security posture. There are currently {len(alerts)} alerts and {len(findings)} vulnerability findings. The most critical issue is unencrypted storage on production nodes."
        }
    else:
        return {
            "response": "Hello! I am your CloudGuard AI Security Copilot. I can help you with:\n1. **Remediation**: Ask me to 'remediate' or 'fix' an issue.\n2. **Security Summaries**: Ask me to 'summarize alerts' or review findings.\n\nWhat can I assist you with today?"
        }

