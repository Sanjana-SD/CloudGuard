import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float, Table
)
from sqlalchemy.orm import relationship
from app.database.session import Base

# Many-to-Many self reference table for application dependencies
application_dependencies = Table(
    'application_dependencies',
    Base.metadata,
    Column('application_id', Integer, ForeignKey('applications.id'), primary_key=True),
    Column('depends_on_app_id', Integer, ForeignKey('applications.id'), primary_key=True)
)

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, unique=True)
    domain = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="organization", cascade="all, delete-orphan")
    resources = relationship("InfrastructureResource", back_populates="organization", cascade="all, delete-orphan")
    projects = relationship("MigrationProject", back_populates="organization", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    role = Column(String(50), default="VIEWER")  # ADMIN, SECURITY_ANALYST, VIEWER
    org_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="users")
    assigned_incidents = relationship("Incident", back_populates="assigned_user")
    incident_notes = relationship("IncidentNote", back_populates="author")
    audit_logs = relationship("AuditLog", back_populates="user")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    owner = Column(String(100), nullable=True)
    department = Column(String(100), nullable=True)
    technology_stack = Column(String(150), nullable=True)
    current_env = Column(String(50), default="On-Premise")  # On-Premise, Hybrid, Cloud
    target_env = Column(String(50), default="Cloud")
    migration_status = Column(String(50), default="NOT_STARTED")  # NOT_STARTED, ASSESSMENT, PLANNED, IN_PROGRESS, TESTING, MIGRATED, FAILED
    migration_risk = Column(String(50), default="LOW")  # LOW, MEDIUM, HIGH, CRITICAL
    org_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="applications")
    resources = relationship("InfrastructureResource", back_populates="application")
    migration_tasks = relationship("MigrationTask", back_populates="application")
    
    dependencies = relationship(
        "Application",
        secondary=application_dependencies,
        primaryjoin=id == application_dependencies.c.application_id,
        secondaryjoin=id == application_dependencies.c.depends_on_app_id,
        backref="dependent_apps"
    )


class MigrationProject(Base):
    __tablename__ = "migration_projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    org_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    target_completion_date = Column(DateTime, nullable=True)
    status = Column(String(50), default="IN_PROGRESS")
    progress_percentage = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="projects")
    tasks = relationship("MigrationTask", back_populates="project", cascade="all, delete-orphan")


class MigrationTask(Base):
    __tablename__ = "migration_tasks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("migration_projects.id"), nullable=False)
    app_id = Column(Integer, ForeignKey("applications.id"), nullable=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="PENDING")  # PENDING, IN_PROGRESS, COMPLETED, FAILED
    order_index = Column(Integer, default=0)
    completed_at = Column(DateTime, nullable=True)

    project = relationship("MigrationProject", back_populates="tasks")
    application = relationship("Application", back_populates="migration_tasks")


class InfrastructureResource(Base):
    __tablename__ = "infrastructure_resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    resource_type = Column(String(50), nullable=False)  # SERVER, DATABASE, STORAGE, API, LOAD_BALANCER
    environment = Column(String(50), default="Production")  # Production, Staging, Development
    status = Column(String(50), default="Running")  # Running, Stopped, Migrating
    is_encrypted = Column(Boolean, default=False)
    is_publicly_accessible = Column(Boolean, default=False)
    is_backup_enabled = Column(Boolean, default=True)
    ssh_public = Column(Boolean, default=False)
    permission_level = Column(String(50), default="STANDARD")  # STANDARD, ADMIN, READ_ONLY
    software_version = Column(String(50), default="1.0.0")
    min_supported_version = Column(String(50), default="2.0.0")
    
    app_id = Column(Integer, ForeignKey("applications.id"), nullable=True)
    org_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="resources")
    application = relationship("Application", back_populates="resources")
    findings = relationship("SecurityFinding", back_populates="resource", cascade="all, delete-orphan")
    events = relationship("SecurityEvent", back_populates="resource")


class SecurityRule(Base):
    __tablename__ = "security_rules"

    id = Column(Integer, primary_key=True, index=True)
    rule_code = Column(String(50), unique=True, nullable=False)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(50), nullable=False)  # CRITICAL, HIGH, MEDIUM, LOW
    rule_type = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True)

    findings = relationship("SecurityFinding", back_populates="rule")


class SecurityFinding(Base):
    __tablename__ = "security_findings"

    id = Column(Integer, primary_key=True, index=True)
    finding_code = Column(String(50), nullable=True)
    rule_id = Column(Integer, ForeignKey("security_rules.id"), nullable=True)
    resource_id = Column(Integer, ForeignKey("infrastructure_resources.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(50), nullable=False)  # CRITICAL, HIGH, MEDIUM, LOW
    status = Column(String(50), default="OPEN")  # OPEN, INVESTIGATING, RESOLVED, FALSE_POSITIVE
    risk_explanation = Column(Text, nullable=True)
    remediation_steps = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    rule = relationship("SecurityRule", back_populates="findings")
    resource = relationship("InfrastructureResource", back_populates="findings")


class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(100), nullable=False)  # LOGIN_SUCCESS, LOGIN_FAILURE, IMPOSSIBLE_TRAVEL, DATA_EXFILTRATION, BRUTE_FORCE
    user_email = Column(String(255), nullable=True)
    location = Column(String(150), nullable=True)
    ip_address = Column(String(50), nullable=True)
    data_size_mb = Column(Float, default=0.0)
    resource_id = Column(Integer, ForeignKey("infrastructure_resources.id"), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    details = Column(Text, nullable=True)

    resource = relationship("InfrastructureResource", back_populates="events")
    alerts = relationship("Alert", back_populates="event")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_code = Column(String(50), nullable=True)
    event_id = Column(Integer, ForeignKey("security_events.id"), nullable=True)
    alert_type = Column(String(100), nullable=False)
    severity = Column(String(50), nullable=False)  # CRITICAL, HIGH, MEDIUM, LOW
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="NEW")  # NEW, ACKNOWLEDGED, INVESTIGATING, RESOLVED
    recommended_action = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    event = relationship("SecurityEvent", back_populates="alerts")
    incident = relationship("Incident", back_populates="alert", uselist=False)


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_code = Column(String(50), unique=True, nullable=False)
    alert_id = Column(Integer, ForeignKey("alerts.id"), nullable=True)
    title = Column(String(200), nullable=False)
    severity = Column(String(50), nullable=False)
    status = Column(String(50), default="NEW")  # NEW, INVESTIGATING, MITIGATED, RESOLVED, CLOSED
    assigned_to_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    alert = relationship("Alert", back_populates="incident")
    assigned_user = relationship("User", back_populates="assigned_incidents")
    notes = relationship("IncidentNote", back_populates="incident", cascade="all, delete-orphan")


class IncidentNote(Base):
    __tablename__ = "incident_notes"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    note = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    incident = relationship("Incident", back_populates="notes")
    author = relationship("User", back_populates="incident_notes")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_email = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False)
    resource_target = Column(String(200), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    ip_address = Column(String(50), default="127.0.0.1")

    user = relationship("User", back_populates="audit_logs")
