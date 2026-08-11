from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.domain import (
    InfrastructureResource, SecurityRule, SecurityFinding, AuditLog, User
)
from app.schemas.schemas import SecurityFindingOut
from app.api.auth import get_current_user

router = APIRouter(prefix="/security", tags=["Security Engine"])

RULE_DEFINITIONS = [
    {
        "code": "RULE-01",
        "name": "Publicly Accessible Resource",
        "description": "Resource is configured with direct public network access.",
        "severity": "CRITICAL",
        "rule_type": "NETWORK_SECURITY",
        "evaluator": lambda r: r.is_publicly_accessible
    },
    {
        "code": "RULE-02",
        "name": "Unencrypted Storage / Data",
        "description": "Resource does not have encryption at rest enabled.",
        "severity": "HIGH",
        "rule_type": "DATA_PROTECTION",
        "evaluator": lambda r: not r.is_encrypted
    },
    {
        "code": "RULE-03",
        "name": "Public SSH Endpoint",
        "description": "SSH access port is open to the public internet.",
        "severity": "HIGH",
        "rule_type": "ACCESS_CONTROL",
        "evaluator": lambda r: r.ssh_public
    },
    {
        "code": "RULE-04",
        "name": "Excessive Administrator Privileges",
        "description": "Resource permissions configured with full admin level privileges.",
        "severity": "HIGH",
        "rule_type": "IDENTITY_SECURITY",
        "evaluator": lambda r: r.permission_level == "ADMIN"
    },
    {
        "code": "RULE-05",
        "name": "Disallow Missing Data Backup",
        "description": "Automated resource backup is disabled.",
        "severity": "MEDIUM",
        "rule_type": "RECOVERY_COMPLIANCE",
        "evaluator": lambda r: not r.is_backup_enabled
    },
    {
        "code": "RULE-06",
        "name": "Outdated Software Version",
        "description": "Resource is running a software release lower than minimum policy.",
        "severity": "MEDIUM",
        "rule_type": "VULNERABILITY_MGMT",
        "evaluator": lambda r: r.software_version < r.min_supported_version
    }
]

@router.post("/scan")
def run_security_scan(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Initialize default rules if not existing
    for rdef in RULE_DEFINITIONS:
        existing = db.query(SecurityRule).filter(SecurityRule.rule_code == rdef["code"]).first()
        if not existing:
            rule_obj = SecurityRule(
                rule_code=rdef["code"],
                name=rdef["name"],
                description=rdef["description"],
                severity=rdef["severity"],
                rule_type=rdef["rule_type"],
                is_active=True
            )
            db.add(rule_obj)
    db.commit()

    resources = db.query(InfrastructureResource).all()
    rules = db.query(SecurityRule).filter(SecurityRule.is_active == True).all()

    new_findings_count = 0

    for res in resources:
        for rdef in RULE_DEFINITIONS:
            rule_obj = next((r for r in rules if r.rule_code == rdef["code"]), None)
            if not rule_obj:
                continue

            is_violation = rdef["evaluator"](res)
            existing_finding = db.query(SecurityFinding).filter(
                SecurityFinding.resource_id == res.id,
                SecurityFinding.rule_id == rule_obj.id,
                SecurityFinding.status != "RESOLVED"
            ).first()

            if is_violation and not existing_finding:
                finding = SecurityFinding(
                    finding_code=f"SEC-{1000 + res.id * 10 + rule_obj.id}",
                    rule_id=rule_obj.id,
                    resource_id=res.id,
                    title=f"{rule_obj.name}: {res.name}",
                    description=f"{res.name} violated rule '{rule_obj.name}'. {rule_obj.description}",
                    severity=rule_obj.severity,
                    status="OPEN",
                    risk_explanation=f"Potential threat vector on {res.name} ({res.resource_type}) exposing security vulnerability.",
                    remediation_steps=f"Update security policies for {res.name} to comply with {rule_obj.name} rules."
                )
                db.add(finding)
                new_findings_count += 1
            elif not is_violation and existing_finding:
                existing_finding.status = "RESOLVED"

    # Audit log entry
    audit = AuditLog(
        user_id=current_user.id,
        user_email=current_user.email,
        action="RUN_SECURITY_SCAN",
        resource_target="ALL_RESOURCES"
    )
    db.add(audit)
    db.commit()

    return {
        "status": "success",
        "message": f"Security scan completed. Identified {new_findings_count} new security finding(s)."
    }

@router.get("/findings", response_model=List[SecurityFindingOut])
def get_findings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    findings = db.query(SecurityFinding).all()
    res_list = []
    for f in findings:
        res_list.append({
            "id": f.id,
            "finding_code": f.finding_code,
            "resource_id": f.resource_id,
            "resource_name": f.resource.name if f.resource else None,
            "title": f.title,
            "description": f.description,
            "severity": f.severity,
            "status": f.status,
            "risk_explanation": f.risk_explanation,
            "remediation_steps": f.remediation_steps,
            "created_at": f.created_at
        })
    return res_list

@router.put("/findings/{finding_id}")
def update_finding_status(finding_id: int, status_str: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    finding = db.query(SecurityFinding).filter(SecurityFinding.id == finding_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Security finding not found")
    finding.status = status_str.upper()
    db.commit()
    return {"message": "Finding status updated successfully", "status": finding.status}

@router.get("/score")
def get_security_score(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    open_findings = db.query(SecurityFinding).filter(SecurityFinding.status.in_(["OPEN", "INVESTIGATING"])).all()
    
    crit = sum(1 for f in open_findings if f.severity == "CRITICAL")
    high = sum(1 for f in open_findings if f.severity == "HIGH")
    med = sum(1 for f in open_findings if f.severity == "MEDIUM")
    low = sum(1 for f in open_findings if f.severity == "LOW")

    deductions = (crit * 40) + (high * 25) + (med * 15) + (low * 5)
    score = max(0, 100 - deductions)

    return {
        "security_score": score,
        "critical_count": crit,
        "high_count": high,
        "medium_count": med,
        "low_count": low,
        "total_open_findings": len(open_findings)
    }
