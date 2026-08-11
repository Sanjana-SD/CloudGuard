from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.domain import AuditLog, User
from app.api.auth import get_current_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/audit-logs", tags=["Audit Logs"])

class AuditLogOut(BaseModel):
    id: int
    user_id: int
    user_email: str
    action: str
    resource_target: str
    timestamp: datetime
    ip_address: str

    class Config:
        from_attributes = True

@router.get("", response_model=List[AuditLogOut])
def get_audit_logs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()
    out = []
    for l in logs:
        out.append({
            "id": l.id,
            "user_id": l.user_id or 0,
            "user_email": l.user_email or "System",
            "action": l.action,
            "resource_target": l.resource_target or "N/A",
            "timestamp": l.timestamp,
            "ip_address": l.ip_address or "127.0.0.1"
        })
    return out
