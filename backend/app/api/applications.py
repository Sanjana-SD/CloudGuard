from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.domain import Application, Organization, User
from app.schemas.schemas import ApplicationCreate, ApplicationOut
from app.api.auth import get_current_user

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.get("", response_model=List[ApplicationOut])
def list_applications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    apps = db.query(Application).all()
    result = []
    for app in apps:
        app_dict = {
            "id": app.id,
            "name": app.name,
            "description": app.description,
            "owner": app.owner,
            "department": app.department,
            "technology_stack": app.technology_stack,
            "current_env": app.current_env,
            "target_env": app.target_env,
            "migration_status": app.migration_status,
            "migration_risk": app.migration_risk,
            "org_id": app.org_id,
            "created_at": app.created_at,
            "dependency_ids": [dep.id for dep in app.dependencies]
        }
        result.append(app_dict)
    return result

@router.post("", response_model=ApplicationOut)
def create_application(app_in: ApplicationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    org = db.query(Organization).first()
    org_id = org.id if org else 1

    new_app = Application(
        name=app_in.name,
        description=app_in.description,
        owner=app_in.owner,
        department=app_in.department,
        technology_stack=app_in.technology_stack,
        current_env=app_in.current_env,
        target_env=app_in.target_env,
        migration_status=app_in.migration_status or "NOT_STARTED",
        migration_risk=app_in.migration_risk or "LOW",
        org_id=org_id
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    if app_in.dependency_ids:
        deps = db.query(Application).filter(Application.id.in_(app_in.dependency_ids)).all()
        new_app.dependencies = deps
        db.commit()
        db.refresh(new_app)

    return {
        "id": new_app.id,
        "name": new_app.name,
        "description": new_app.description,
        "owner": new_app.owner,
        "department": new_app.department,
        "technology_stack": new_app.technology_stack,
        "current_env": new_app.current_env,
        "target_env": new_app.target_env,
        "migration_status": new_app.migration_status,
        "migration_risk": new_app.migration_risk,
        "org_id": new_app.org_id,
        "created_at": new_app.created_at,
        "dependency_ids": [dep.id for dep in new_app.dependencies]
    }

@router.get("/{app_id}", response_model=ApplicationOut)
def get_application(app_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return {
        "id": app.id,
        "name": app.name,
        "description": app.description,
        "owner": app.owner,
        "department": app.department,
        "technology_stack": app.technology_stack,
        "current_env": app.current_env,
        "target_env": app.target_env,
        "migration_status": app.migration_status,
        "migration_risk": app.migration_risk,
        "org_id": app.org_id,
        "created_at": app.created_at,
        "dependency_ids": [dep.id for dep in app.dependencies]
    }

@router.put("/{app_id}", response_model=ApplicationOut)
def update_application(app_id: int, app_in: ApplicationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    app.name = app_in.name
    app.description = app_in.description
    app.owner = app_in.owner
    app.department = app_in.department
    app.technology_stack = app_in.technology_stack
    app.current_env = app_in.current_env
    app.target_env = app_in.target_env
    if app_in.migration_status:
        app.migration_status = app_in.migration_status
    if app_in.migration_risk:
        app.migration_risk = app_in.migration_risk

    if app_in.dependency_ids is not None:
        deps = db.query(Application).filter(Application.id.in_(app_in.dependency_ids)).all()
        app.dependencies = deps

    db.commit()
    db.refresh(app)
    return {
        "id": app.id,
        "name": app.name,
        "description": app.description,
        "owner": app.owner,
        "department": app.department,
        "technology_stack": app.technology_stack,
        "current_env": app.current_env,
        "target_env": app.target_env,
        "migration_status": app.migration_status,
        "migration_risk": app.migration_risk,
        "org_id": app.org_id,
        "created_at": app.created_at,
        "dependency_ids": [dep.id for dep in app.dependencies]
    }

@router.delete("/{app_id}")
def delete_application(app_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(app)
    db.commit()
    return {"message": "Application deleted successfully"}
