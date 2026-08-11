"""
CloudGuard – Database Seeder
Populates the database with realistic demo data for ABC Financial Services.
Run from the backend directory:
    python seed.py
"""
import sys
import os
import datetime
import logging

# ── Make sure we can import from app package ──────────────────────────────
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cloudguard.seed")

from app.database.session import engine, Base, SessionLocal
from app.models.domain import (
    Organization, User, Application, InfrastructureResource,
    MigrationProject, MigrationTask, SecurityRule, SecurityFinding,
    SecurityEvent, Alert, Incident, IncidentNote, AuditLog
)
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # ── Idempotency: skip if already seeded ─────────────────────────
        if db.query(Organization).first():
            logger.info("Database already seeded. Skipping.")
            return

        logger.info("Seeding CloudGuard database with demo data...")

        # ── 1. Organization ──────────────────────────────────────────────
        org = Organization(
            name="ABC Financial Services",
            domain="abc-financial.com"
        )
        db.add(org)
        db.flush()

        # ── 2. Users ─────────────────────────────────────────────────────
        admin = User(
            email="admin@cloudguard.io",
            hashed_password=pwd_context.hash("admin123"),
            full_name="Sarah Connor",
            role="ADMIN",
            org_id=org.id
        )
        analyst = User(
            email="analyst@cloudguard.io",
            hashed_password=pwd_context.hash("analyst123"),
            full_name="Alex Rivera",
            role="SECURITY_ANALYST",
            org_id=org.id
        )
        viewer = User(
            email="viewer@cloudguard.io",
            hashed_password=pwd_context.hash("viewer123"),
            full_name="Jordan Lee",
            role="VIEWER",
            org_id=org.id
        )
        db.add_all([admin, analyst, viewer])
        db.flush()

        # ── 3. Applications ───────────────────────────────────────────────
        apps_data = [
            {
                "name": "Core Banking System",
                "description": "Primary transaction processing engine for retail and corporate banking operations.",
                "owner": "Banking Ops Team",
                "department": "Core Banking",
                "technology_stack": "Java EE + Oracle DB",
                "current_env": "On-Premise",
                "target_env": "Cloud",
                "migration_status": "IN_PROGRESS",
                "migration_risk": "HIGH"
            },
            {
                "name": "Customer Onboarding Portal",
                "description": "Digital KYC and account opening platform for retail customers.",
                "owner": "Digital Team",
                "department": "Retail Banking",
                "technology_stack": "React + Node.js + MongoDB",
                "current_env": "On-Premise",
                "target_env": "Cloud",
                "migration_status": "TESTING",
                "migration_risk": "MEDIUM"
            },
            {
                "name": "Risk Calculation Engine",
                "description": "Real-time risk scoring and portfolio exposure analysis system.",
                "owner": "Risk Management",
                "department": "Compliance",
                "technology_stack": "Python + PostgreSQL",
                "current_env": "On-Premise",
                "target_env": "Cloud",
                "migration_status": "MIGRATED",
                "migration_risk": "CRITICAL"
            },
            {
                "name": "Payments Gateway API",
                "description": "Payment instruction routing and settlement coordination hub.",
                "owner": "Payments Team",
                "department": "Transaction Services",
                "technology_stack": "Go + Redis + PostgreSQL",
                "current_env": "On-Premise",
                "target_env": "Cloud",
                "migration_status": "MIGRATED",
                "migration_risk": "HIGH"
            },
            {
                "name": "Regulatory Reporting Suite",
                "description": "Automated compliance report generation for RBI/SEBI regulatory submissions.",
                "owner": "Compliance Team",
                "department": "Legal & Compliance",
                "technology_stack": "Python + SQL Server",
                "current_env": "On-Premise",
                "target_env": "Cloud",
                "migration_status": "PLANNED",
                "migration_risk": "MEDIUM"
            },
            {
                "name": "HR & Payroll System",
                "description": "Employee lifecycle management, payroll processing, and benefits administration.",
                "owner": "HR Department",
                "department": "Human Resources",
                "technology_stack": "SAP HRIS",
                "current_env": "On-Premise",
                "target_env": "Cloud",
                "migration_status": "NOT_STARTED",
                "migration_risk": "LOW"
            }
        ]

        apps = []
        for a in apps_data:
            app = Application(org_id=org.id, **a)
            db.add(app)
            apps.append(app)
        db.flush()

        # ── 4. Infrastructure Resources ───────────────────────────────────
        resources_data = [
            {
                "name": "core-banking-db-prod",
                "resource_type": "DATABASE",
                "environment": "Production",
                "status": "Running",
                "is_encrypted": True,
                "is_publicly_accessible": True,   # ← RULE-01 violation (CRITICAL)
                "is_backup_enabled": True,
                "ssh_public": False,
                "permission_level": "STANDARD",
                "software_version": "1.8.0",
                "min_supported_version": "2.0.0", # ← RULE-06 violation (MEDIUM)
                "app_id": apps[0].id
            },
            {
                "name": "onboarding-api-server",
                "resource_type": "SERVER",
                "environment": "Production",
                "status": "Running",
                "is_encrypted": False,             # ← RULE-02 violation (HIGH)
                "is_publicly_accessible": False,
                "is_backup_enabled": True,
                "ssh_public": True,               # ← RULE-03 violation (HIGH)
                "permission_level": "STANDARD",
                "software_version": "2.1.0",
                "min_supported_version": "2.0.0",
                "app_id": apps[1].id
            },
            {
                "name": "risk-analytics-db",
                "resource_type": "DATABASE",
                "environment": "Production",
                "status": "Running",
                "is_encrypted": True,
                "is_publicly_accessible": False,
                "is_backup_enabled": False,        # ← RULE-05 violation (MEDIUM)
                "ssh_public": False,
                "permission_level": "ADMIN",      # ← RULE-04 violation (HIGH)
                "software_version": "3.0.1",
                "min_supported_version": "2.0.0",
                "app_id": apps[2].id
            },
            {
                "name": "payments-gateway-api",
                "resource_type": "API",
                "environment": "Production",
                "status": "Running",
                "is_encrypted": True,
                "is_publicly_accessible": False,
                "is_backup_enabled": True,
                "ssh_public": False,
                "permission_level": "STANDARD",
                "software_version": "5.2.0",
                "min_supported_version": "4.0.0",
                "app_id": apps[3].id
            },
            {
                "name": "regulatory-storage-bucket",
                "resource_type": "STORAGE",
                "environment": "Staging",
                "status": "Running",
                "is_encrypted": False,             # ← RULE-02 violation (HIGH)
                "is_publicly_accessible": False,
                "is_backup_enabled": True,
                "ssh_public": False,
                "permission_level": "STANDARD",
                "software_version": "1.0.0",
                "min_supported_version": "2.0.0", # ← RULE-06 violation (MEDIUM)
                "app_id": apps[4].id
            },
            {
                "name": "hr-load-balancer",
                "resource_type": "LOAD_BALANCER",
                "environment": "Development",
                "status": "Stopped",
                "is_encrypted": True,
                "is_publicly_accessible": False,
                "is_backup_enabled": True,
                "ssh_public": False,
                "permission_level": "STANDARD",
                "software_version": "2.5.0",
                "min_supported_version": "2.0.0",
                "app_id": apps[5].id
            }
        ]

        resources = []
        for r in resources_data:
            res = InfrastructureResource(org_id=org.id, **r)
            db.add(res)
            resources.append(res)
        db.flush()

        # ── 5. Security Rules ─────────────────────────────────────────────
        rules_data = [
            {
                "rule_code": "RULE-01",
                "name": "Publicly Accessible Resource",
                "description": "Resource is exposed to the public internet without network restrictions.",
                "severity": "CRITICAL",
                "rule_type": "NETWORK_SECURITY"
            },
            {
                "rule_code": "RULE-02",
                "name": "Unencrypted Data at Rest",
                "description": "Data stored without encryption, violating data protection standards.",
                "severity": "HIGH",
                "rule_type": "DATA_PROTECTION"
            },
            {
                "rule_code": "RULE-03",
                "name": "Public SSH Endpoint Exposed",
                "description": "SSH port exposed to public internet enabling brute force attacks.",
                "severity": "HIGH",
                "rule_type": "ACCESS_CONTROL"
            },
            {
                "rule_code": "RULE-04",
                "name": "Excessive Administrative Privileges",
                "description": "Resource running with admin permission level violating least-privilege principle.",
                "severity": "HIGH",
                "rule_type": "IDENTITY_SECURITY"
            },
            {
                "rule_code": "RULE-05",
                "name": "Missing Backup Configuration",
                "description": "No automated backup configured. Data loss risk if system failure occurs.",
                "severity": "MEDIUM",
                "rule_type": "RECOVERY_COMPLIANCE"
            },
            {
                "rule_code": "RULE-06",
                "name": "Outdated Software Version",
                "description": "Software version below minimum supported, contains known CVEs.",
                "severity": "MEDIUM",
                "rule_type": "VULNERABILITY_MGMT"
            }
        ]
        rules = {}
        for r in rules_data:
            rule = SecurityRule(**r)
            db.add(rule)
            rules[r["rule_code"]] = rule
        db.flush()

        # ── 6. Security Findings (pre-scanned) ────────────────────────────
        findings_data = [
            {
                "finding_code": "FND-001",
                "rule_id": rules["RULE-01"].id,
                "resource_id": resources[0].id,
                "title": "Core Banking DB Publicly Accessible",
                "description": "core-banking-db-prod is exposed to the public internet without IP restrictions.",
                "severity": "CRITICAL",
                "status": "OPEN",
                "risk_explanation": "Public database access allows attackers to probe and potentially exploit the database directly.",
                "remediation_steps": "Disable public network access. Restrict to internal VPC CIDR. Enable firewall rules."
            },
            {
                "finding_code": "FND-002",
                "rule_id": rules["RULE-06"].id,
                "resource_id": resources[0].id,
                "title": "Core Banking DB Running Outdated Version",
                "description": "core-banking-db-prod v1.8.0 is below minimum supported version v2.0.0.",
                "severity": "MEDIUM",
                "status": "OPEN",
                "risk_explanation": "Outdated database engine contains known CVEs that attackers actively exploit.",
                "remediation_steps": "Schedule emergency patch window. Upgrade to v2.0.0 or higher."
            },
            {
                "finding_code": "FND-003",
                "rule_id": rules["RULE-02"].id,
                "resource_id": resources[1].id,
                "title": "Onboarding API Server Data Unencrypted",
                "description": "onboarding-api-server stores customer KYC data without encryption.",
                "severity": "HIGH",
                "status": "OPEN",
                "risk_explanation": "Unencrypted PII data on disk violates GDPR/PDP regulations and risks data breach.",
                "remediation_steps": "Enable AES-256 encryption at rest. Enforce TLS 1.3 for all connections."
            },
            {
                "finding_code": "FND-004",
                "rule_id": rules["RULE-03"].id,
                "resource_id": resources[1].id,
                "title": "SSH Port Publicly Exposed on API Server",
                "description": "onboarding-api-server has SSH port open to 0.0.0.0/0.",
                "severity": "HIGH",
                "status": "INVESTIGATING",
                "risk_explanation": "Open SSH exposes admin access to brute force and credential stuffing from external IPs.",
                "remediation_steps": "Restrict SSH to VPN IP range. Disable password auth. Use SSH key pairs only."
            },
            {
                "finding_code": "FND-005",
                "rule_id": rules["RULE-04"].id,
                "resource_id": resources[2].id,
                "title": "Risk Analytics DB Running as ADMIN",
                "description": "risk-analytics-db service account has admin-level permissions.",
                "severity": "HIGH",
                "status": "OPEN",
                "risk_explanation": "Admin-privileged services risk privilege escalation — one compromised process gains full access.",
                "remediation_steps": "Create a dedicated read-write service account with least privilege. Revoke admin role."
            },
            {
                "finding_code": "FND-006",
                "rule_id": rules["RULE-05"].id,
                "resource_id": resources[2].id,
                "title": "No Backup Configured on Risk Database",
                "description": "risk-analytics-db has no automated backup policy configured.",
                "severity": "MEDIUM",
                "status": "OPEN",
                "risk_explanation": "Without backup, a single storage failure causes permanent loss of risk calculation data.",
                "remediation_steps": "Configure daily automated snapshots with 30-day retention. Test restore monthly."
            },
            {
                "finding_code": "FND-007",
                "rule_id": rules["RULE-02"].id,
                "resource_id": resources[4].id,
                "title": "Regulatory Storage Bucket Unencrypted",
                "description": "regulatory-storage-bucket stores compliance documents without encryption.",
                "severity": "HIGH",
                "status": "OPEN",
                "risk_explanation": "Unencrypted regulatory documents violate RBI data security guidelines.",
                "remediation_steps": "Enable server-side encryption with KMS-managed keys."
            },
            {
                "finding_code": "FND-008",
                "rule_id": rules["RULE-06"].id,
                "resource_id": resources[4].id,
                "title": "Regulatory Storage Running Outdated Version",
                "description": "regulatory-storage-bucket v1.0.0 is below minimum v2.0.0.",
                "severity": "MEDIUM",
                "status": "RESOLVED",
                "risk_explanation": "Outdated storage software contains known vulnerabilities.",
                "remediation_steps": "Upgrade storage software to v2.0.0 during next maintenance window."
            }
        ]

        for f in findings_data:
            finding = SecurityFinding(**f)
            db.add(finding)
        db.flush()

        # ── 7. Migration Project ──────────────────────────────────────────
        project = MigrationProject(
            name="ABC Financial Cloud Transformation 2025",
            org_id=org.id,
            target_completion_date=datetime.datetime(2025, 12, 31),
            status="IN_PROGRESS",
            progress_percentage=0.0
        )
        db.add(project)
        db.flush()

        tasks_data = [
            ("Phase 1: Infrastructure Assessment & Inventory", "COMPLETED"),
            ("Phase 2: Network Architecture Design", "COMPLETED"),
            ("Phase 3: Security & Compliance Review", "COMPLETED"),
            ("Phase 4: Payments Gateway Migration", "COMPLETED"),
            ("Phase 5: Risk Analytics Engine Migration", "COMPLETED"),
            ("Phase 6: Core Banking POC Deployment", "COMPLETED"),
            ("Phase 7: Customer Portal UAT Testing", "COMPLETED"),
            ("Phase 8: Core Banking Full Migration", "IN_PROGRESS"),
            ("Phase 9: Regulatory Reporting Migration", "PENDING"),
            ("Phase 10: HR & Payroll System Migration", "PENDING"),
            ("Phase 11: End-to-End Cutover & DNS Migration", "PENDING"),
            ("Phase 12: Legacy Decommissioning & Cleanup", "PENDING"),
        ]

        completed_count = 0
        for title, status in tasks_data:
            completed_at = datetime.datetime.utcnow() - datetime.timedelta(days=30) if status == "COMPLETED" else None
            task = MigrationTask(
                project_id=project.id,
                title=title,
                status=status,
                order_index=tasks_data.index((title, status)),
                completed_at=completed_at
            )
            db.add(task)
            if status == "COMPLETED":
                completed_count += 1

        db.flush()
        project.progress_percentage = round((completed_count / len(tasks_data)) * 100.0, 1)

        # ── 8. Security Events ────────────────────────────────────────────
        now = datetime.datetime.utcnow()
        events_data = [
            {
                "event_type": "LOGIN_FAILURE",
                "user_email": "unknown@external.com",
                "location": "Moscow, Russia",
                "ip_address": "45.33.32.156",
                "timestamp": now - datetime.timedelta(hours=2)
            },
            {
                "event_type": "LOGIN_FAILURE",
                "user_email": "unknown@external.com",
                "location": "Moscow, Russia",
                "ip_address": "45.33.32.156",
                "timestamp": now - datetime.timedelta(hours=2, minutes=1)
            },
            {
                "event_type": "LOGIN_FAILURE",
                "user_email": "unknown@external.com",
                "location": "Moscow, Russia",
                "ip_address": "45.33.32.156",
                "timestamp": now - datetime.timedelta(hours=2, minutes=2)
            },
            {
                "event_type": "LOGIN_FAILURE",
                "user_email": "unknown@external.com",
                "location": "Moscow, Russia",
                "ip_address": "45.33.32.156",
                "timestamp": now - datetime.timedelta(hours=2, minutes=3)
            },
            {
                "event_type": "LOGIN_FAILURE",
                "user_email": "unknown@external.com",
                "location": "Moscow, Russia",
                "ip_address": "45.33.32.156",
                "timestamp": now - datetime.timedelta(hours=2, minutes=4)
            },
            {
                "event_type": "LARGE_DATA_TRANSFER",
                "user_email": "contractor@abc-financial.com",
                "location": "Singapore",
                "ip_address": "103.6.172.12",
                "data_size_mb": 18432.0,
                "timestamp": now - datetime.timedelta(hours=5)
            },
            {
                "event_type": "LOGIN_SUCCESS",
                "user_email": "admin@cloudguard.io",
                "location": "Mumbai, India",
                "ip_address": "106.51.24.100",
                "timestamp": now - datetime.timedelta(minutes=30)
            },
            {
                "event_type": "NEW_LOCATION_LOGIN",
                "user_email": "admin@cloudguard.io",
                "location": "Frankfurt, Germany",
                "ip_address": "185.220.101.50",
                "timestamp": now - datetime.timedelta(minutes=25)
            }
        ]

        ev_objs = []
        for e in events_data:
            ev = SecurityEvent(**e)
            db.add(ev)
            ev_objs.append(ev)
        db.flush()

        # ── 9. Alerts ─────────────────────────────────────────────────────
        alerts_data = [
            {
                "alert_code": "ALT-1001",
                "event_id": ev_objs[4].id,
                "alert_type": "BRUTE_FORCE_SUSPICION",
                "severity": "HIGH",
                "title": "Brute Force Attack Suspected on Admin Account",
                "description": "5 consecutive login failures from 45.33.32.156 targeting unknown@external.com within 4 minutes.",
                "status": "NEW",
                "recommended_action": "Block IP 45.33.32.156 at firewall. Force password reset. Review access logs."
            },
            {
                "alert_code": "ALT-1002",
                "event_id": ev_objs[5].id,
                "alert_type": "POSSIBLE_DATA_EXFILTRATION",
                "severity": "CRITICAL",
                "title": "Suspected Data Exfiltration Detected",
                "description": "18,432 MB (18 GB) data transfer from contractor account to Singapore endpoint. Exceeds 5 GB threshold.",
                "status": "INVESTIGATING",
                "recommended_action": "Immediately suspend contractor session. Freeze data transfer rules. Initiate forensic investigation."
            },
            {
                "alert_code": "ALT-1003",
                "event_id": ev_objs[7].id,
                "alert_type": "IMPOSSIBLE_TRAVEL",
                "severity": "HIGH",
                "title": "Impossible Travel Detected for admin@cloudguard.io",
                "description": "User admin@cloudguard.io logged in from Mumbai, India and Frankfurt, Germany within 5 minutes. Physical travel is impossible.",
                "status": "NEW",
                "recommended_action": "Verify user identity immediately. Invalidate all active sessions. Reset credentials."
            },
            {
                "alert_code": "ALT-1004",
                "event_id": None,
                "alert_type": "CONFIG_DRIFT",
                "severity": "MEDIUM",
                "title": "Security Configuration Drift Detected",
                "description": "core-banking-db-prod public access setting was modified outside the approved change window.",
                "status": "ACKNOWLEDGED",
                "recommended_action": "Review change management logs. Revert unauthorized configuration change."
            },
            {
                "alert_code": "ALT-1005",
                "event_id": None,
                "alert_type": "POLICY_VIOLATION",
                "severity": "MEDIUM",
                "title": "SSH Key Policy Violation",
                "description": "onboarding-api-server SSH port opened to 0.0.0.0/0 violating network security policy.",
                "status": "RESOLVED",
                "recommended_action": "Restrict SSH firewall rule to VPN CIDR 10.0.0.0/16."
            }
        ]

        alert_objs = []
        for a in alerts_data:
            alert = Alert(**a)
            db.add(alert)
            alert_objs.append(alert)
        db.flush()

        # ── 10. Incidents ─────────────────────────────────────────────────
        incidents_data = [
            {
                "incident_code": "INC-1001",
                "alert_id": alert_objs[1].id,
                "title": "Critical Data Exfiltration Incident – Contractor Account",
                "severity": "CRITICAL",
                "status": "INVESTIGATING",
                "assigned_to_user_id": analyst.id
            },
            {
                "incident_code": "INC-1002",
                "alert_id": alert_objs[0].id,
                "title": "Brute Force Attack on Admin Portal",
                "severity": "HIGH",
                "status": "INVESTIGATING",
                "assigned_to_user_id": analyst.id
            },
            {
                "incident_code": "INC-1003",
                "alert_id": alert_objs[2].id,
                "title": "Impossible Travel – Admin Account Compromise Suspected",
                "severity": "HIGH",
                "status": "NEW",
                "assigned_to_user_id": admin.id
            }
        ]

        inc_objs = []
        for i in incidents_data:
            inc = Incident(**i)
            db.add(inc)
            inc_objs.append(inc)
        db.flush()

        # ── 11. Incident Notes ────────────────────────────────────────────
        notes_data = [
            {
                "incident_id": inc_objs[0].id,
                "author_id": analyst.id,
                "note": "Reviewed SIEM logs. Confirmed 18 GB data egress to Singapore IP 103.6.172.12. Contractor's VPN session active at time of transfer.",
                "created_at": now - datetime.timedelta(hours=3)
            },
            {
                "incident_id": inc_objs[0].id,
                "author_id": analyst.id,
                "note": "Suspended contractor account. Coordinating with legal team for further investigation. Preservation notice issued.",
                "created_at": now - datetime.timedelta(hours=2)
            },
            {
                "incident_id": inc_objs[1].id,
                "author_id": analyst.id,
                "note": "Source IP 45.33.32.156 blocked at perimeter firewall. No successful logins confirmed. Attack contained.",
                "created_at": now - datetime.timedelta(hours=1, minutes=30)
            }
        ]

        for n in notes_data:
            note = IncidentNote(**n)
            db.add(note)

        # ── 12. Audit Logs ────────────────────────────────────────────────
        audit_data = [
            {"user_id": admin.id, "user_email": admin.email, "action": "USER_LOGIN", "resource_target": "System", "timestamp": now - datetime.timedelta(minutes=30)},
            {"user_id": analyst.id, "user_email": analyst.email, "action": "SECURITY_SCAN_RUN", "resource_target": "All Resources", "timestamp": now - datetime.timedelta(hours=1)},
            {"user_id": analyst.id, "user_email": analyst.email, "action": "INCIDENT_CREATED", "resource_target": "INC-1001", "timestamp": now - datetime.timedelta(hours=2)},
            {"user_id": admin.id, "user_email": admin.email, "action": "RESOURCE_PROVISIONED", "resource_target": "payments-gateway-api", "timestamp": now - datetime.timedelta(days=1)},
            {"user_id": analyst.id, "user_email": analyst.email, "action": "ALERT_ACKNOWLEDGED", "resource_target": "ALT-1004", "timestamp": now - datetime.timedelta(hours=4)},
            {"user_id": admin.id, "user_email": admin.email, "action": "APPLICATION_REGISTERED", "resource_target": "Core Banking System", "timestamp": now - datetime.timedelta(days=5)},
            {"user_id": admin.id, "user_email": admin.email, "action": "MIGRATION_TASK_COMPLETED", "resource_target": "Phase 4: Payments Gateway Migration", "timestamp": now - datetime.timedelta(days=3)},
            {"user_id": analyst.id, "user_email": analyst.email, "action": "FINDING_RESOLVED", "resource_target": "FND-008", "timestamp": now - datetime.timedelta(hours=6)},
        ]

        for al in audit_data:
            audit = AuditLog(**al)
            db.add(audit)

        db.commit()

        logger.info("=" * 60)
        logger.info("✅ CloudGuard database seeded successfully!")
        logger.info("=" * 60)
        logger.info("Demo Credentials:")
        logger.info("  Admin:    admin@cloudguard.io    / admin123")
        logger.info("  Analyst:  analyst@cloudguard.io  / analyst123")
        logger.info("  Viewer:   viewer@cloudguard.io   / viewer123")
        logger.info("=" * 60)

    except Exception as e:
        db.rollback()
        logger.error(f"❌ Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
