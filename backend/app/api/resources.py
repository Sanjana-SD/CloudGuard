from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.domain import InfrastructureResource, Organization, User
from app.schemas.schemas import ResourceCreate, ResourceOut
from app.api.auth import get_current_user

router = APIRouter(prefix="/resources", tags=["Infrastructure Resources"])

@router.get("", response_model=List[ResourceOut])
def list_resources(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(InfrastructureResource).all()

@router.post("", response_model=ResourceOut)
def create_resource(res_in: ResourceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    org = db.query(Organization).first()
    org_id = org.id if org else 1

    new_res = InfrastructureResource(
        name=res_in.name,
        resource_type=res_in.resource_type.upper(),
        environment=res_in.environment,
        status=res_in.status,
        is_encrypted=res_in.is_encrypted,
        is_publicly_accessible=res_in.is_publicly_accessible,
        is_backup_enabled=res_in.is_backup_enabled,
        ssh_public=res_in.ssh_public,
        permission_level=res_in.permission_level,
        software_version=res_in.software_version,
        min_supported_version=res_in.min_supported_version,
        app_id=res_in.app_id,
        org_id=org_id
    )
    db.add(new_res)
    db.commit()
    db.refresh(new_res)
    return new_res

@router.get("/{res_id}", response_model=ResourceOut)
def get_resource(res_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    res = db.query(InfrastructureResource).filter(InfrastructureResource.id == res_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    return res

@router.put("/{res_id}", response_model=ResourceOut)
def update_resource(res_id: int, res_in: ResourceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    res = db.query(InfrastructureResource).filter(InfrastructureResource.id == res_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")

    res.name = res_in.name
    res.resource_type = res_in.resource_type.upper()
    res.environment = res_in.environment
    res.status = res_in.status
    res.is_encrypted = res_in.is_encrypted
    res.is_publicly_accessible = res_in.is_publicly_accessible
    res.is_backup_enabled = res_in.is_backup_enabled
    res.ssh_public = res_in.ssh_public
    res.permission_level = res_in.permission_level
    res.software_version = res_in.software_version
    res.min_supported_version = res_in.min_supported_version
    res.app_id = res_in.app_id

    db.commit()
    db.refresh(res)
    return res

@router.delete("/{res_id}")
def delete_resource(res_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    res = db.query(InfrastructureResource).filter(InfrastructureResource.id == res_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    db.delete(res)
    db.commit()
    return {"message": "Resource deleted successfully"}
