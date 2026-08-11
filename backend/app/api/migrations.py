from typing import List
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.domain import MigrationProject, MigrationTask, Organization, User
from app.schemas.schemas import ProjectCreate, ProjectOut, TaskCreate, TaskOut
from app.api.auth import get_current_user

router = APIRouter(prefix="/migrations", tags=["Migration Projects"])

def update_project_progress(project_id: int, db: Session):
    project = db.query(MigrationProject).filter(MigrationProject.id == project_id).first()
    if not project:
        return
    tasks = db.query(MigrationTask).filter(MigrationTask.project_id == project_id).all()
    if not tasks:
        project.progress_percentage = 0.0
    else:
        completed = sum(1 for t in tasks if t.status == "COMPLETED")
        project.progress_percentage = round((completed / len(tasks)) * 100.0, 1)
    db.commit()

@router.get("", response_model=List[ProjectOut])
def list_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(MigrationProject).all()

@router.post("", response_model=ProjectOut)
def create_project(proj_in: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    org = db.query(Organization).first()
    org_id = org.id if org else 1

    new_proj = MigrationProject(
        name=proj_in.name,
        org_id=org_id,
        target_completion_date=proj_in.target_completion_date,
        status=proj_in.status or "IN_PROGRESS",
        progress_percentage=0.0
    )
    db.add(new_proj)
    db.commit()
    db.refresh(new_proj)
    return new_proj

@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    proj = db.query(MigrationProject).filter(MigrationProject.id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Migration project not found")
    return proj

@router.post("/tasks", response_model=TaskOut)
def create_task(task_in: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_task = MigrationTask(
        project_id=task_in.project_id,
        app_id=task_in.app_id,
        title=task_in.title,
        description=task_in.description,
        status=task_in.status or "PENDING",
        order_index=task_in.order_index or 0
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    update_project_progress(task_in.project_id, db)
    return new_task

@router.put("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, status_str: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(MigrationTask).filter(MigrationTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Migration task not found")
    
    task.status = status_str.upper()
    if task.status == "COMPLETED":
        task.completed_at = datetime.datetime.utcnow()
    
    db.commit()
    db.refresh(task)

    update_project_progress(task.project_id, db)
    return task
