from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.domain import Alert, User
from app.schemas.schemas import AlertOut
from app.api.auth import get_current_user

router = APIRouter(prefix="/alerts", tags=["Security Alerts"])

@router.get("", response_model=List[AlertOut])
def list_alerts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Alert).order_by(Alert.created_at.desc()).all()

@router.put("/{alert_id}")
def update_alert_status(alert_id: int, status_str: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = status_str.upper()
    db.commit()
    return {"message": "Alert status updated", "status": alert.status}
