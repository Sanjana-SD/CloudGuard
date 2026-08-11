import sys
import os
import datetime

# Add backend to python path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.database.session import engine, SessionLocal, Base
from app.models.domain import (
    Organization, User, Application, InfrastructureResource, MigrationProject,
    MigrationTask, SecurityRule, SecurityFinding, SecurityEvent, Alert, Incident,
    IncidentNote, AuditLog
)
from app.api.auth import get_password_hash

def seed_database():
    print("[+] Initializing CloudGuard Enterprise database schema & seed data...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Organization
        org = db.query(Organization).filter(Organization.name == "ABC Financial Services").first()
        if not org:
            org = Organization(name="ABC Financial Services", domain="abc-financial.com")
            db.add(org)
            db.commit()
            db.refresh(org)
            print("  [+] Created Organization: ABC Financial Services")

        # 2. Users
        pwd_hash = get_password_hash("password123")
        users_data = [
            {"email": "admin@abc.com", "full_name": "Sarah Connor", "role": "ADMIN"},
            {"email": "analyst@abc.com", "full_name": "Alex Rivera", "role": "SECURITY_ANALYST"},
            {"email": "viewer@abc.com", "full_name": "John Doe", "role": "VIEWER"}
        ]
        for u in users_data:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                user = User(
                    email=u["email"],
                    hashed_password=pwd_hash,
                    full_name=u["full_name"],
                    role=u["role"],
                    org_id=org.id
                )
                db.add(user)
        db.commit()
        print("  [+] Created Default Users (admin@abc.com, analyst@abc.com, viewer@abc.com - Password: password123)")

        # 3. Applications
        apps_data = [
            {
                "name": "Customer Portal",
                "description": "Primary Web Portal for customer banking transactions",
                "owner": "Web Team",
                "department": "Digital Banking",
                "technology_stack": "React + Node.js",
                "current_env": "On-Premise",
                "target_env": "Cloud",
                "migration_status": "IN_PROGRESS",
                "migration_risk": "MEDIUM"
            },
            {
                "name": "Payment API",
                "description": "Payment processing gateway interface",
                "owner": "FinTech Core",
                "department": "Payments",
                "technology_stack": "Java Spring Boot",
                "current_env": "On-Premise",
                "target_env": "Cloud",
                "migration_status": "TESTING",
                "migration_risk": "HIGH"
            },
            {
                "name": "HR Portal",
                "description": "Internal employee directory and payroll service",
                "owner": "HR Ops",
                "department": "Human Resources",
                "technology_stack": "Python Django",
                "current_env": "On-Premise",
                "target_env": "Cloud",
                "migration_status": "MIGRATED",
                "migration_risk": "LOW"
            },
            {
                "name": "Authentication Service",
                "description": "OAuth2 & SAML Single Sign-On Authority",
                "owner": "SecOps Team",
                "department": "Cybersecurity",
                "technology_stack": "Go Microservice",
                "current_env": "On-Premise",
                "target_env": "Cloud",
                "migration_status": "MIGRATED",
                "migration_risk": "HIGH"
            },
            {
                "name": "Customer Database",
                "description": "Core relational DB holding customer accounts & transactions",
                "owner": "DBA Team",
                "department": "Infrastructure",
                "technology_stack": "PostgreSQL 14",
                "current_env": "On-Premise",
                "target_env": "Cloud",
                "migration_status": "PLANNED",
                "migration_risk": "CRITICAL"
            },
            {
                "name": "Document Management System",
                "description": "Archival storage for loan contracts and verification records",
                "owner": "Records Dept",
                "department": "Legal & Compliance",
                "technology_stack": "C# .NET Core",
                "current_env": "On-Premise",
                "target_env": "Cloud",
                "migration_status": "NOT_STARTED",
                "migration_risk": "MEDIUM"
            }
        ]

        app_objects = {}
        for app_info in apps_data:
            existing = db.query(Application).filter(Application.name == app_info["name"]).first()
            if not existing:
                app_obj = Application(org_id=org.id, **app_info)
                db.add(app_obj)
                db.commit()
                db.refresh(app_obj)
                app_objects[app_info["name"]] = app_obj
            else:
                app_objects[app_info["name"]] = existing
        print("  [+] Seeded Enterprise Applications")

        # 4. Infrastructure Resources
        res_data = [
            {
                "name": "customer-server",
                "resource_type": "SERVER",
                "environment": "Production",
                "status": "Running",
                "is_encrypted": True,
                "is_publicly_accessible": False,
                "is_backup_enabled": True,
                "ssh_public": False,
                "permission_level": "STANDARD",
                "software_version": "2.1.0",
                "min_supported_version": "2.0.0",
                "app_name": "Customer Portal"
            },
            {
                "name": "payment-server",
                "resource_type": "SERVER",
                "environment": "Production",
                "status": "Running",
                "is_encrypted": True,
                "is_publicly_accessible": False,
                "is_backup_enabled": True,
                "ssh_public": False,
                "permission_level": "ADMIN",  # Rule violation
                "software_version": "2.0.0",
                "min_supported_version": "2.0.0",
                "app_name": "Payment API"
            },
            {
                "name": "customer-db",
                "resource_type": "DATABASE",
                "environment": "Production",
                "status": "Running",
                "is_encrypted": False,  # Rule violation (HIGH)
                "is_publicly_accessible": True,  # Rule violation (CRITICAL)
                "is_backup_enabled": False,  # Rule violation (MEDIUM)
                "ssh_public": False,
                "permission_level": "ADMIN",
                "software_version": "1.5.0",
                "min_supported_version": "2.0.0",  # Rule violation (MEDIUM)
                "app_name": "Customer Database"
            },
            {
                "name": "hr-server",
                "resource_type": "SERVER",
                "environment": "Production",
                "status": "Running",
                "is_encrypted": True,
                "is_publicly_accessible": False,
                "is_backup_enabled": True,
                "ssh_public": False,
                "permission_level": "STANDARD",
                "software_version": "2.2.0",
                "min_supported_version": "2.0.0",
                "app_name": "HR Portal"
            },
            {
                "name": "auth-service",
                "resource_type": "API",
                "environment": "Production",
                "status": "Running",
                "is_encrypted": True,
                "is_publicly_accessible": False,
                "is_backup_enabled": True,
                "ssh_public": True,  # Rule violation (HIGH)
                "permission_level": "STANDARD",
                "software_version": "2.0.0",
                "min_supported_version": "2.0.0",
                "app_name": "Authentication Service"
            },
            {
                "name": "document-storage",
                "resource_type": "STORAGE",
                "environment": "Production",
                "status": "Running",
                "is_encrypted": False,  # Rule violation
                "is_publicly_accessible": True,  # Rule violation
                "is_backup_enabled": False,
                "ssh_public": False,
                "permission_level": "STANDARD",
                "software_version": "1.0.0",
                "min_supported_version": "2.0.0",
                "app_name": "Document Management System"
            }
        ]

        res_objects = {}
        for rinfo in res_data:
            app_name = rinfo.pop("app_name")
            app_obj = app_objects.get(app_name)
            existing = db.query(InfrastructureResource).filter(InfrastructureResource.name == rinfo["name"]).first()
            if not existing:
                res_obj = InfrastructureResource(
                    org_id=org.id,
                    app_id=app_obj.id if app_obj else None,
                    **rinfo
                )
                db.add(res_obj)
                db.commit()
                db.refresh(res_obj)
                res_objects[rinfo["name"]] = res_obj
            else:
                res_objects[rinfo["name"]] = existing
        print("  [+] Seeded Infrastructure Resources")

        # 5. Migration Project & Tasks
        proj = db.query(MigrationProject).filter(MigrationProject.name == "ABC Financial Services Cloud Migration").first()
        if not proj:
            proj = MigrationProject(
                name="ABC Financial Services Cloud Migration",
                org_id=org.id,
                target_completion_date=datetime.datetime.utcnow() + datetime.timedelta(days=90),
                status="IN_PROGRESS",
                progress_percentage=76.0
            )
            db.add(proj)
            db.commit()
            db.refresh(proj)

            tasks = [
                {"title": "Dependency Analysis", "status": "COMPLETED", "order": 1},
                {"title": "Security Assessment & Compliance Check", "status": "COMPLETED", "order": 2},
                {"title": "Cloud Architecture Design", "status": "COMPLETED", "order": 3},
                {"title": "Data Validation & Schema Migration", "status": "COMPLETED", "order": 4},
                {"title": "Customer Database Replication", "status": "IN_PROGRESS", "order": 5},
                {"title": "Final Cutover & Switchboard Routing", "status": "PENDING", "order": 6}
            ]
            for t in tasks:
                task_obj = MigrationTask(
                    project_id=proj.id,
                    title=t["title"],
                    status=t["status"],
                    order_index=t["order"]
                )
                db.add(task_obj)
            db.commit()
            print("  [+] Seeded Migration Project & Tasks (Progress: 76%)")

        # 6. Security Rules & Initial Findings
        rule_defs = [
            ("RULE-01", "Publicly Accessible Resource", "Resource exposed directly to public internet", "CRITICAL", "NETWORK_SECURITY"),
            ("RULE-02", "Unencrypted Storage / Data", "Data at rest is not encrypted with KMS", "HIGH", "DATA_PROTECTION"),
            ("RULE-03", "Public SSH Endpoint", "SSH management port open publicly", "HIGH", "ACCESS_CONTROL"),
            ("RULE-04", "Excessive Administrative Privileges", "Resource permissions level set to ADMIN", "HIGH", "IDENTITY_SECURITY"),
            ("RULE-05", "Missing Backup Configuration", "Automated daily backup disabled", "MEDIUM", "RECOVERY_COMPLIANCE"),
            ("RULE-06", "Outdated Software Version", "Running software below minimum supported patch level", "MEDIUM", "VULNERABILITY_MGMT")
        ]

        rule_objs = {}
        for code, name, desc, sev, rtype in rule_defs:
            r_obj = db.query(SecurityRule).filter(SecurityRule.rule_code == code).first()
            if not r_obj:
                r_obj = SecurityRule(rule_code=code, name=name, description=desc, severity=sev, rule_type=rtype, is_active=True)
                db.add(r_obj)
                db.commit()
                db.refresh(r_obj)
            rule_objs[code] = r_obj

        # Initial Findings for customer-db & document-storage
        cust_db_res = res_objects.get("customer-db")
        if cust_db_res:
            findings_data = [
                ("SEC-1001", "RULE-01", cust_db_res.id, "Public Database Access", "Customer Database is publicly accessible on port 5432.", "CRITICAL", "Unauthorized external users can access sensitive financial records."),
                ("SEC-1002", "RULE-02", cust_db_res.id, "Unencrypted Database", "Customer Database storage is unencrypted.", "HIGH", "Data leakage risk if raw storage drives are breached."),
                ("SEC-1003", "RULE-04", res_objects["payment-server"].id, "Excessive Privileges on Payment API", "Payment API has unnecessary administrator privileges.", "HIGH", "Risk of privilege escalation."),
                ("SEC-1004", "RULE-05", cust_db_res.id, "Missing Database Backup", "Database backup is disabled.", "MEDIUM", "Catastrophic data loss risk in event of hardware failure.")
            ]
            for fcode, rcode, resid, ftitle, fdesc, fsev, frisk in findings_data:
                existing_f = db.query(SecurityFinding).filter(SecurityFinding.finding_code == fcode).first()
                if not existing_f:
                    f_obj = SecurityFinding(
                        finding_code=fcode,
                        rule_id=rule_objs[rcode].id,
                        resource_id=resid,
                        title=ftitle,
                        description=fdesc,
                        severity=fsev,
                        status="OPEN",
                        risk_explanation=frisk,
                        remediation_steps="Restrict public access, enable KMS encryption, and update permissions."
                    )
                    db.add(f_obj)
            db.commit()

        # 7. Security Events & Alert Simulation (Impossible Travel Example)
        now = datetime.datetime.utcnow()
        evt1 = SecurityEvent(
            event_type="LOGIN_SUCCESS",
            user_email="admin@abc.com",
            location="Bangalore, India",
            ip_address="106.51.24.12",
            timestamp=now - datetime.timedelta(minutes=4),
            details="User admin@abc.com logged in successfully via Web Console."
        )
        evt2 = SecurityEvent(
            event_type="IMPOSSIBLE_TRAVEL",
            user_email="admin@abc.com",
            location="Frankfurt, Germany",
            ip_address="185.220.101.5",
            timestamp=now,
            details="User admin@abc.com logged in 4 minutes after Bangalore login."
        )
        db.add(evt1)
        db.add(evt2)
        db.commit()
        db.refresh(evt2)

        # Alert
        alert1 = db.query(Alert).filter(Alert.alert_type == "IMPOSSIBLE_TRAVEL").first()
        if not alert1:
            alert1 = Alert(
                alert_code="ALT-1001",
                event_id=evt2.id,
                alert_type="IMPOSSIBLE_TRAVEL",
                severity="HIGH",
                title="IMPOSSIBLE TRAVEL DETECTED",
                description="User admin@abc.com logged in from Bangalore and Frankfurt within 4 minutes.",
                status="INVESTIGATING",
                recommended_action="Contact user admin@abc.com to verify identity and force credential reset."
            )
            db.add(alert1)
            db.commit()
            db.refresh(alert1)

        # 8. Incident
        analyst = db.query(User).filter(User.email == "analyst@abc.com").first()
        inc = db.query(Incident).filter(Incident.incident_code == "INC-1001").first()
        if not inc:
            inc = Incident(
                incident_code="INC-1001",
                alert_id=alert1.id,
                title="Possible Account Compromise: admin@abc.com",
                severity="HIGH",
                status="INVESTIGATING",
                assigned_to_user_id=analyst.id if analyst else None
            )
            db.add(inc)
            db.commit()
            db.refresh(inc)

            note = IncidentNote(
                incident_id=inc.id,
                author_id=analyst.id if analyst else 1,
                note="Initiated geographic IP lookup and reached out to user via secondary channel."
            )
            db.add(note)
            db.commit()
            print("  [+] Seeded Security Events, Alerts & Incident INC-1001")

        print("[SUCCESS] Database seeding complete! CloudGuard is fully populated and ready for demonstration.")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
