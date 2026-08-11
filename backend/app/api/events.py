from typing import List
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.domain import SecurityEvent, Alert, User
from app.schemas.schemas import EventCreate, EventOut
from app.api.auth import get_current_user

router = APIRouter(prefix="/events", tags=["Security Events & Threat Detection"])

@router.get("", response_model=List[EventOut])
def list_events(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(SecurityEvent).order_by(SecurityEvent.timestamp.desc()).all()

@router.post("", response_model=EventOut)
def record_event(evt_in: EventCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_evt = SecurityEvent(
        event_type=evt_in.event_type.upper(),
        user_email=evt_in.user_email,
        location=evt_in.location,
        ip_address=evt_in.ip_address,
        data_size_mb=evt_in.data_size_mb or 0.0,
        resource_id=evt_in.resource_id,
        details=evt_in.details
    )
    db.add(new_evt)
    db.commit()
    db.refresh(new_evt)

    # Trigger threat detection rules based on event
    evaluate_threat_rules(new_evt, db)

    return new_evt

def evaluate_threat_rules(event: SecurityEvent, db: Session):
    # Rule 1: Impossible Travel Detection
    if event.event_type in ["LOGIN_SUCCESS", "NEW_LOCATION_LOGIN"] and event.user_email:
        recent_logins = db.query(SecurityEvent).filter(
            SecurityEvent.user_email == event.user_email,
            SecurityEvent.id != event.id,
            SecurityEvent.event_type.in_(["LOGIN_SUCCESS", "NEW_LOCATION_LOGIN"])
        ).order_by(SecurityEvent.timestamp.desc()).first()

        if recent_logins and recent_logins.location and event.location:
            time_diff_min = (event.timestamp - recent_logins.timestamp).total_seconds() / 60.0
            if recent_logins.location != event.location and time_diff_min <= 10.0:
                # Trigger Impossible Travel Alert
                alert = Alert(
                    alert_code=f"ALT-{1000 + event.id}",
                    event_id=event.id,
                    alert_type="IMPOSSIBLE_TRAVEL",
                    severity="HIGH",
                    title=f"Impossible Travel Detected for {event.user_email}",
                    description=f"User logged in from '{recent_logins.location}' and '{event.location}' within {int(time_diff_min)} minute(s).",
                    status="NEW",
                    recommended_action="Verify user identity immediately and review active sessions/reset credentials."
                )
                db.add(alert)

    # Rule 2: Possible Data Exfiltration
    if event.data_size_mb and event.data_size_mb >= 5000.0:  # > 5 GB transfer
        alert = Alert(
            alert_code=f"ALT-EXFIL-{event.id}",
            event_id=event.id,
            alert_type="POSSIBLE_DATA_EXFILTRATION",
            severity="CRITICAL",
            title=f"High Volume Data Transfer ({event.data_size_mb / 1024:.1f} GB)",
            description=f"User/Resource triggered abnormal transfer of {event.data_size_mb} MB to IP {event.ip_address}.",
            status="NEW",
            recommended_action="Isolate network port and inspect transferred payloads."
        )
        db.add(alert)

    # Rule 3: Brute Force Attempt
    if event.event_type == "LOGIN_FAILURE" and event.user_email:
        failed_count = db.query(SecurityEvent).filter(
            SecurityEvent.user_email == event.user_email,
            SecurityEvent.event_type == "LOGIN_FAILURE"
        ).count()

        if failed_count >= 5:
            alert = Alert(
                alert_code=f"ALT-BRUTE-{event.id}",
                event_id=event.id,
                alert_type="BRUTE_FORCE_SUSPICION",
                severity="HIGH",
                title=f"Brute Force Login Suspicion for {event.user_email}",
                description=f"Detected {failed_count} failed login attempts for account {event.user_email}.",
                status="NEW",
                recommended_action="Lock user account temporarily and enforce 2FA verification."
            )
            db.add(alert)

    db.commit()
