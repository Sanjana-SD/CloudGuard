from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Optional[str] = "VIEWER"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
    full_name: str
    email: str

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    org_id: Optional[int] = None
    created_at: datetime

    model_config = {"from_attributes": True}

# --- Application Schemas ---
class ApplicationBase(BaseModel):
    name: str
    description: Optional[str] = None
    owner: Optional[str] = None
    department: Optional[str] = None
    technology_stack: Optional[str] = None
    current_env: Optional[str] = "On-Premise"
    target_env: Optional[str] = "Cloud"
    migration_status: Optional[str] = "NOT_STARTED"
    migration_risk: Optional[str] = "LOW"

class ApplicationCreate(ApplicationBase):
    dependency_ids: Optional[List[int]] = []

class ApplicationOut(ApplicationBase):
    id: int
    org_id: int
    created_at: datetime
    dependency_ids: Optional[List[int]] = []

    model_config = {"from_attributes": True}

# --- Resource Schemas ---
class ResourceBase(BaseModel):
    name: str
    resource_type: str  # SERVER, DATABASE, STORAGE, API, LOAD_BALANCER
    environment: Optional[str] = "Production"
    status: Optional[str] = "Running"
    is_encrypted: Optional[bool] = False
    is_publicly_accessible: Optional[bool] = False
    is_backup_enabled: Optional[bool] = True
    ssh_public: Optional[bool] = False
    permission_level: Optional[str] = "STANDARD"
    software_version: Optional[str] = "1.0.0"
    min_supported_version: Optional[str] = "2.0.0"
    app_id: Optional[int] = None

class ResourceCreate(ResourceBase):
    pass

class ResourceOut(ResourceBase):
    id: int
    org_id: int
    created_at: datetime

    model_config = {"from_attributes": True}

# --- Migration Schemas ---
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "PENDING"
    order_index: Optional[int] = 0
    app_id: Optional[int] = None

class TaskCreate(TaskBase):
    project_id: int

class TaskOut(TaskBase):
    id: int
    project_id: int
    completed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

class ProjectBase(BaseModel):
    name: str
    target_completion_date: Optional[datetime] = None
    status: Optional[str] = "IN_PROGRESS"

class ProjectCreate(ProjectBase):
    pass

class ProjectOut(ProjectBase):
    id: int
    org_id: int
    progress_percentage: float
    created_at: datetime
    tasks: List[TaskOut] = []

    model_config = {"from_attributes": True}

# --- Security & Alert Schemas ---
class SecurityFindingOut(BaseModel):
    id: int
    finding_code: Optional[str]
    resource_id: int
    resource_name: Optional[str] = None
    title: str
    description: str
    severity: str
    status: str
    risk_explanation: Optional[str] = None
    remediation_steps: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}

class EventCreate(BaseModel):
    event_type: str
    user_email: Optional[str] = None
    location: Optional[str] = None
    ip_address: Optional[str] = None
    data_size_mb: Optional[float] = 0.0
    resource_id: Optional[int] = None
    details: Optional[str] = None

class EventOut(EventCreate):
    id: int
    timestamp: datetime

    model_config = {"from_attributes": True}

class AlertOut(BaseModel):
    id: int
    alert_code: Optional[str]
    alert_type: str
    severity: str
    title: str
    description: str
    status: str
    recommended_action: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}

# --- Incident Schemas ---
class IncidentNoteCreate(BaseModel):
    note: str

class IncidentNoteOut(BaseModel):
    id: int
    incident_id: int
    author_id: int
    author_name: Optional[str] = None
    note: str
    created_at: datetime

    model_config = {"from_attributes": True}

class IncidentCreate(BaseModel):
    alert_id: Optional[int] = None
    title: str
    severity: str
    assigned_to_user_id: Optional[int] = None

class IncidentOut(BaseModel):
    id: int
    incident_code: str
    alert_id: Optional[int]
    title: str
    severity: str
    status: str
    assigned_to_user_id: Optional[int]
    assigned_to_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    notes: List[IncidentNoteOut] = []

    model_config = {"from_attributes": True}

# --- Dashboard & AI Schemas ---
class DashboardSummary(BaseModel):
    total_applications: int
    total_resources: int
    migration_progress: float
    security_score: int
    critical_findings: int
    active_alerts: int
    open_incidents: int

class AIExplainRequest(BaseModel):
    finding_id: Optional[int] = None
    finding_title: Optional[str] = None
    resource_name: Optional[str] = None
    severity: Optional[str] = None

class AIRemediationRequest(BaseModel):
    finding_id: Optional[int] = None
    issue_description: Optional[str] = None
