from typing import List
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.domain import Incident, IncidentNote, User, Alert
from app.schemas.schemas import IncidentCreate, IncidentOut, IncidentNoteCreate, IncidentNoteOut
from app.api.auth import get_current_user

router = APIRouter(prefix="/incidents", tags=["Incident Management"])

@router.get("", response_model=List[IncidentOut])
def list_incidents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    incidents = db.query(Incident).order_by(Incident.created_at.desc()).all()
    out = []
    for inc in incidents:
        notes_out = []
        for n in inc.notes:
            notes_out.append({
                "id": n.id,
                "incident_id": n.incident_id,
                "author_id": n.author_id,
                "author_name": n.author.full_name if n.author else "Analyst",
                "note": n.note,
                "created_at": n.created_at
            })
        out.append({
            "id": inc.id,
            "incident_code": inc.incident_code,
            "alert_id": inc.alert_id,
            "title": inc.title,
            "severity": inc.severity,
            "status": inc.status,
            "assigned_to_user_id": inc.assigned_to_user_id,
            "assigned_to_name": inc.assigned_user.full_name if inc.assigned_user else "Unassigned",
            "created_at": inc.created_at,
            "updated_at": inc.updated_at,
            "notes": notes_out
        })
    return out

@router.post("", response_model=IncidentOut)
def create_incident(inc_in: IncidentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    count = db.query(Incident).count() + 1001
    inc_code = f"INC-{count}"

    new_inc = Incident(
        incident_code=inc_code,
        alert_id=inc_in.alert_id,
        title=inc_in.title,
        severity=inc_in.severity.upper(),
        status="INVESTIGATING",
        assigned_to_user_id=inc_in.assigned_to_user_id or current_user.id
    )
    db.add(new_inc)

    if inc_in.alert_id:
        alert = db.query(Alert).filter(Alert.id == inc_in.alert_id).first()
        if alert:
            alert.status = "INVESTIGATING"

    db.commit()
    db.refresh(new_inc)

    return {
        "id": new_inc.id,
        "incident_code": new_inc.incident_code,
        "alert_id": new_inc.alert_id,
        "title": new_inc.title,
        "severity": new_inc.severity,
        "status": new_inc.status,
        "assigned_to_user_id": new_inc.assigned_to_user_id,
        "assigned_to_name": current_user.full_name,
        "created_at": new_inc.created_at,
        "updated_at": new_inc.updated_at,
        "notes": []
    }

@router.put("/{incident_id}")
def update_incident(incident_id: int, status_str: str, severity_str: str = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")

    inc.status = status_str.upper()
    if severity_str:
        inc.severity = severity_str.upper()
    inc.updated_at = datetime.datetime.utcnow()

    db.commit()
    return {"message": "Incident updated successfully", "status": inc.status}

@router.post("/{incident_id}/notes", response_model=IncidentNoteOut)
def add_note(incident_id: int, note_in: IncidentNoteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")

    new_note = IncidentNote(
        incident_id=incident_id,
        author_id=current_user.id,
        note=note_in.note
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return {
        "id": new_note.id,
        "incident_id": new_note.incident_id,
        "author_id": new_note.author_id,
        "author_name": current_user.full_name,
        "note": new_note.note,
        "created_at": new_note.created_at
    }
