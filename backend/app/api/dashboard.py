from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.domain import (
    Application, InfrastructureResource, MigrationProject, MigrationTask,
    SecurityFinding, Alert, Incident, User
)
from app.schemas.schemas import DashboardSummary
from app.api.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Executive Dashboard"])

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_apps = db.query(Application).count()
    total_resources = db.query(InfrastructureResource).count()

    projects = db.query(MigrationProject).all()
    if projects:
        avg_progress = sum(p.progress_percentage for p in projects) / len(projects)
    else:
        avg_progress = 0.0

    open_findings = db.query(SecurityFinding).filter(SecurityFinding.status.in_(["OPEN", "INVESTIGATING"])).all()
    crit_count = sum(1 for f in open_findings if f.severity == "CRITICAL")
    high_count = sum(1 for f in open_findings if f.severity == "HIGH")
    med_count = sum(1 for f in open_findings if f.severity == "MEDIUM")
    low_count = sum(1 for f in open_findings if f.severity == "LOW")

    deductions = (crit_count * 40) + (high_count * 25) + (med_count * 15) + (low_count * 5)
    sec_score = max(0, 100 - deductions)

    active_alerts_count = db.query(Alert).filter(Alert.status.in_(["NEW", "INVESTIGATING"])).count()
    open_incidents_count = db.query(Incident).filter(Incident.status.in_(["NEW", "INVESTIGATING"])).count()

    return {
        "total_applications": total_apps,
        "total_resources": total_resources,
        "migration_progress": round(avg_progress, 1),
        "security_score": sec_score,
        "critical_findings": crit_count,
        "active_alerts": active_alerts_count,
        "open_incidents": open_incidents_count
    }
