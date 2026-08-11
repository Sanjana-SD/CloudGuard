"""
CloudGuard Backend – Comprehensive Test Suite
Tests authentication, resource CRUD, security rules, threat detection & incident management.
"""
import sys
import os

# Ensure we run from backend directory
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database.session import Base, get_db

# ─────────────────────────────────────────────
# Test Database Setup (in-memory SQLite)
# ─────────────────────────────────────────────
SQLALCHEMY_TEST_URL = "sqlite:///./cloudguard_test.db"
test_engine = create_engine(SQLALCHEMY_TEST_URL, connect_args={"check_same_thread": False})
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

Base.metadata.create_all(bind=test_engine)

def override_get_db():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

# ─────────────────────────────────────────────
# Fixtures & Helpers
# ─────────────────────────────────────────────
ADMIN_CREDS = {"email": "testadmin@abc.com", "password": "testpassword123", "full_name": "Test Admin", "role": "ADMIN"}
ANALYST_CREDS = {"email": "testanalyst@abc.com", "password": "testpassword123", "full_name": "Test Analyst", "role": "SECURITY_ANALYST"}

@pytest.fixture(scope="module")
def admin_token():
    client.post("/api/auth/register", json=ADMIN_CREDS)
    res = client.post("/api/auth/login", json={"email": ADMIN_CREDS["email"], "password": ADMIN_CREDS["password"]})
    assert res.status_code == 200
    return res.json()["access_token"]

@pytest.fixture(scope="module")
def analyst_token():
    client.post("/api/auth/register", json=ANALYST_CREDS)
    res = client.post("/api/auth/login", json={"email": ANALYST_CREDS["email"], "password": ANALYST_CREDS["password"]})
    assert res.status_code == 200
    return res.json()["access_token"]

def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ─────────────────────────────────────────────
# 1. AUTHENTICATION TESTS
# ─────────────────────────────────────────────
class TestAuthentication:
    def test_register_new_user_success(self):
        """New user can register with valid credentials."""
        import time
        unique_email = f"newuser_{int(time.time())}@test.com"
        res = client.post("/api/auth/register", json={
            "email": unique_email, "password": "pass12345",
            "full_name": "New User", "role": "VIEWER"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["email"] == unique_email
        assert data["role"] == "VIEWER"

    def test_register_duplicate_email_fails(self):
        """Duplicate email registration must be rejected."""
        client.post("/api/auth/register", json={
            "email": "dup@test.com", "password": "pass", "full_name": "Dup"
        })
        res = client.post("/api/auth/register", json={
            "email": "dup@test.com", "password": "pass2", "full_name": "Dup Again"
        })
        assert res.status_code == 400

    def test_login_valid_credentials_returns_token(self, admin_token):
        """Login with correct credentials returns JWT token."""
        assert admin_token is not None
        assert len(admin_token) > 20

    def test_login_wrong_password_fails(self):
        """Login with wrong password must return 400."""
        res = client.post("/api/auth/login", json={
            "email": ADMIN_CREDS["email"], "password": "wrong_password"
        })
        assert res.status_code == 400

    def test_get_me_authenticated(self, admin_token):
        """GET /auth/me returns current user when authenticated."""
        res = client.get("/api/auth/me", headers=auth_headers(admin_token))
        assert res.status_code == 200
        data = res.json()
        assert data["email"] == ADMIN_CREDS["email"]
        assert data["role"] == "ADMIN"

    def test_get_me_unauthenticated_fails(self):
        """GET /auth/me without token must return 401."""
        res = client.get("/api/auth/me")
        assert res.status_code == 401


# ─────────────────────────────────────────────
# 2. RESOURCE CRUD TESTS
# ─────────────────────────────────────────────
class TestResourceCRUD:
    def test_create_resource(self, admin_token):
        """ADMIN can create a new infrastructure resource."""
        res = client.post("/api/resources", headers=auth_headers(admin_token), json={
            "name": "test-db",
            "resource_type": "DATABASE",
            "environment": "Production",
            "status": "Running",
            "is_encrypted": False,
            "is_publicly_accessible": True,
            "is_backup_enabled": False,
            "ssh_public": False,
            "permission_level": "ADMIN",
            "software_version": "1.0.0",
            "min_supported_version": "2.0.0"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["name"] == "test-db"
        assert data["resource_type"] == "DATABASE"
        return data["id"]

    def test_list_resources(self, admin_token):
        """GET /resources returns list of resources."""
        res = client.get("/api/resources", headers=auth_headers(admin_token))
        assert res.status_code == 200
        assert isinstance(res.json(), list)

    def test_get_resource_by_id(self, admin_token):
        """GET /resources/{id} returns specific resource."""
        create_res = client.post("/api/resources", headers=auth_headers(admin_token), json={
            "name": "fetch-db", "resource_type": "SERVER", "environment": "Staging",
            "status": "Running", "is_encrypted": True, "is_publicly_accessible": False,
            "is_backup_enabled": True, "ssh_public": False, "permission_level": "STANDARD",
            "software_version": "2.5.0", "min_supported_version": "2.0.0"
        })
        res_id = create_res.json()["id"]
        res = client.get(f"/api/resources/{res_id}", headers=auth_headers(admin_token))
        assert res.status_code == 200
        assert res.json()["name"] == "fetch-db"

    def test_get_nonexistent_resource_returns_404(self, admin_token):
        """GET /resources/99999 returns 404 for missing resource."""
        res = client.get("/api/resources/99999", headers=auth_headers(admin_token))
        assert res.status_code == 404

    def test_delete_resource(self, admin_token):
        """DELETE /resources/{id} removes the resource."""
        create_res = client.post("/api/resources", headers=auth_headers(admin_token), json={
            "name": "delete-me", "resource_type": "STORAGE", "environment": "Development",
            "status": "Stopped", "is_encrypted": False, "is_publicly_accessible": False,
            "is_backup_enabled": False, "ssh_public": False, "permission_level": "STANDARD",
            "software_version": "1.0.0", "min_supported_version": "1.0.0"
        })
        res_id = create_res.json()["id"]
        del_res = client.delete(f"/api/resources/{res_id}", headers=auth_headers(admin_token))
        assert del_res.status_code == 200
        # Confirm deleted
        get_res = client.get(f"/api/resources/{res_id}", headers=auth_headers(admin_token))
        assert get_res.status_code == 404


# ─────────────────────────────────────────────
# 3. APPLICATION CRUD TESTS
# ─────────────────────────────────────────────
class TestApplicationCRUD:
    def test_create_application(self, admin_token):
        """Create a new application entry."""
        res = client.post("/api/applications", headers=auth_headers(admin_token), json={
            "name": "Test Portal",
            "description": "Test portal app",
            "owner": "Dev Team",
            "department": "Engineering",
            "technology_stack": "React + FastAPI",
            "current_env": "On-Premise",
            "target_env": "Cloud",
            "migration_status": "NOT_STARTED",
            "migration_risk": "LOW"
        })
        assert res.status_code == 200
        assert res.json()["name"] == "Test Portal"

    def test_list_applications(self, admin_token):
        """GET /applications returns a list."""
        res = client.get("/api/applications", headers=auth_headers(admin_token))
        assert res.status_code == 200
        assert isinstance(res.json(), list)

    def test_update_application_migration_status(self, admin_token):
        """Update application migration status."""
        create = client.post("/api/applications", headers=auth_headers(admin_token), json={
            "name": "Update Me App", "description": "Will be updated", "owner": "Ops",
            "department": "IT", "technology_stack": "Python", "current_env": "On-Premise",
            "target_env": "Cloud", "migration_status": "NOT_STARTED", "migration_risk": "MEDIUM"
        })
        app_id = create.json()["id"]
        update = client.put(f"/api/applications/{app_id}", headers=auth_headers(admin_token), json={
            "name": "Update Me App", "description": "Updated", "owner": "Ops",
            "department": "IT", "technology_stack": "Python", "current_env": "On-Premise",
            "target_env": "Cloud", "migration_status": "IN_PROGRESS", "migration_risk": "HIGH"
        })
        assert update.status_code == 200
        assert update.json()["migration_status"] == "IN_PROGRESS"


# ─────────────────────────────────────────────
# 4. SECURITY RULE ENGINE TESTS
# ─────────────────────────────────────────────
class TestSecurityRuleEngine:
    def test_public_database_generates_critical_finding(self, admin_token):
        """RULE-01: Public database must produce CRITICAL finding after scan."""
        # Create a public database resource
        client.post("/api/resources", headers=auth_headers(admin_token), json={
            "name": "rule-test-public-db", "resource_type": "DATABASE",
            "environment": "Production", "status": "Running",
            "is_encrypted": True, "is_publicly_accessible": True,  # <-- Trigger RULE-01
            "is_backup_enabled": True, "ssh_public": False,
            "permission_level": "STANDARD", "software_version": "2.0.0",
            "min_supported_version": "2.0.0"
        })
        # Run security scan
        scan_res = client.post("/api/security/scan", headers=auth_headers(admin_token))
        assert scan_res.status_code == 200

        # Get findings and verify CRITICAL finding for public access
        findings_res = client.get("/api/security/findings", headers=auth_headers(admin_token))
        findings = findings_res.json()
        critical = [f for f in findings if f["severity"] == "CRITICAL" and "rule-test-public-db" in f.get("resource_name", "")]
        assert len(critical) >= 1, "Public DB must trigger CRITICAL finding"

    def test_unencrypted_database_generates_high_finding(self, admin_token):
        """RULE-02: Unencrypted DB must produce HIGH finding."""
        client.post("/api/resources", headers=auth_headers(admin_token), json={
            "name": "rule-test-noenc-db", "resource_type": "DATABASE",
            "environment": "Production", "status": "Running",
            "is_encrypted": False,  # <-- Trigger RULE-02
            "is_publicly_accessible": False, "is_backup_enabled": True,
            "ssh_public": False, "permission_level": "STANDARD",
            "software_version": "2.0.0", "min_supported_version": "2.0.0"
        })
        scan_res = client.post("/api/security/scan", headers=auth_headers(admin_token))
        assert scan_res.status_code == 200

        findings_res = client.get("/api/security/findings", headers=auth_headers(admin_token))
        findings = findings_res.json()
        high = [f for f in findings if f["severity"] == "HIGH" and "rule-test-noenc-db" in f.get("resource_name", "")]
        assert len(high) >= 1, "Unencrypted DB must trigger HIGH finding"

    def test_missing_backup_generates_medium_finding(self, admin_token):
        """RULE-05: Missing backup must produce MEDIUM finding."""
        client.post("/api/resources", headers=auth_headers(admin_token), json={
            "name": "rule-test-nobackup", "resource_type": "DATABASE",
            "environment": "Production", "status": "Running",
            "is_encrypted": True, "is_publicly_accessible": False,
            "is_backup_enabled": False,  # <-- Trigger RULE-05
            "ssh_public": False, "permission_level": "STANDARD",
            "software_version": "2.0.0", "min_supported_version": "2.0.0"
        })
        scan_res = client.post("/api/security/scan", headers=auth_headers(admin_token))
        assert scan_res.status_code == 200

        findings_res = client.get("/api/security/findings", headers=auth_headers(admin_token))
        findings = findings_res.json()
        medium = [f for f in findings if f["severity"] == "MEDIUM" and "rule-test-nobackup" in f.get("resource_name", "")]
        assert len(medium) >= 1, "Missing backup must trigger MEDIUM finding"

    def test_outdated_version_generates_medium_finding(self, admin_token):
        """RULE-06: Outdated software version must produce MEDIUM finding."""
        client.post("/api/resources", headers=auth_headers(admin_token), json={
            "name": "rule-test-oldver", "resource_type": "SERVER",
            "environment": "Production", "status": "Running",
            "is_encrypted": True, "is_publicly_accessible": False,
            "is_backup_enabled": True, "ssh_public": False,
            "permission_level": "STANDARD",
            "software_version": "1.2.0",   # <-- Trigger RULE-06
            "min_supported_version": "2.0.0"
        })
        scan_res = client.post("/api/security/scan", headers=auth_headers(admin_token))
        assert scan_res.status_code == 200
        findings_res = client.get("/api/security/findings", headers=auth_headers(admin_token))
        findings = findings_res.json()
        medium = [f for f in findings if f["severity"] == "MEDIUM" and "rule-test-oldver" in f.get("resource_name", "")]
        assert len(medium) >= 1, "Outdated version must trigger MEDIUM finding"

    def test_secure_resource_generates_no_findings(self, admin_token):
        """A fully secured resource must not generate any findings."""
        client.post("/api/resources", headers=auth_headers(admin_token), json={
            "name": "rule-test-clean", "resource_type": "DATABASE",
            "environment": "Production", "status": "Running",
            "is_encrypted": True,          # Encrypted
            "is_publicly_accessible": False, # Private
            "is_backup_enabled": True,      # Backed up
            "ssh_public": False,            # SSH secured
            "permission_level": "STANDARD", # Least privilege
            "software_version": "2.5.0",   # Up to date
            "min_supported_version": "2.0.0"
        })
        client.post("/api/security/scan", headers=auth_headers(admin_token))
        findings_res = client.get("/api/security/findings", headers=auth_headers(admin_token))
        findings = findings_res.json()
        clean_findings = [f for f in findings if "rule-test-clean" in f.get("resource_name", "") and f["status"] != "RESOLVED"]
        assert len(clean_findings) == 0, "Fully compliant resource must have zero open findings"

    def test_security_score_decreases_with_critical_finding(self, admin_token):
        """Security score must be below 100 when critical findings exist."""
        client.post("/api/security/scan", headers=auth_headers(admin_token))
        score_res = client.get("/api/security/score", headers=auth_headers(admin_token))
        assert score_res.status_code == 200
        score = score_res.json()["security_score"]
        assert score < 100, "Score must reflect active critical findings"
        assert score >= 0, "Score must be non-negative"


# ─────────────────────────────────────────────
# 5. MIGRATION CALCULATION TESTS
# ─────────────────────────────────────────────
class TestMigrationCalculations:
    def test_create_migration_project(self, admin_token):
        """Create a new migration project."""
        res = client.post("/api/migrations", headers=auth_headers(admin_token), json={
            "name": "Test Migration Project",
            "status": "IN_PROGRESS"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["name"] == "Test Migration Project"
        assert data["progress_percentage"] == 0.0

    def test_progress_updates_when_tasks_completed(self, admin_token):
        """Progress percentage must update when migration tasks are completed."""
        proj_res = client.post("/api/migrations", headers=auth_headers(admin_token), json={
            "name": "Progress Test Project", "status": "IN_PROGRESS"
        })
        proj_id = proj_res.json()["id"]

        # Add 4 tasks
        task_ids = []
        for i in range(4):
            t = client.post("/api/migrations/tasks", headers=auth_headers(admin_token), json={
                "project_id": proj_id, "title": f"Task {i+1}", "status": "PENDING"
            })
            task_ids.append(t.json()["id"])

        # Complete 2 tasks
        for tid in task_ids[:2]:
            client.put(f"/api/migrations/tasks/{tid}?status_str=COMPLETED", headers=auth_headers(admin_token))

        # Verify progress is 50%
        proj = client.get(f"/api/migrations/{proj_id}", headers=auth_headers(admin_token))
        assert proj.json()["progress_percentage"] == 50.0

    def test_all_tasks_completed_gives_100_percent(self, admin_token):
        """All tasks completed must yield 100% progress."""
        proj_res = client.post("/api/migrations", headers=auth_headers(admin_token), json={
            "name": "Full Completion Project", "status": "IN_PROGRESS"
        })
        proj_id = proj_res.json()["id"]

        task_ids = []
        for i in range(3):
            t = client.post("/api/migrations/tasks", headers=auth_headers(admin_token), json={
                "project_id": proj_id, "title": f"Full Task {i+1}", "status": "PENDING"
            })
            task_ids.append(t.json()["id"])

        for tid in task_ids:
            client.put(f"/api/migrations/tasks/{tid}?status_str=COMPLETED", headers=auth_headers(admin_token))

        proj = client.get(f"/api/migrations/{proj_id}", headers=auth_headers(admin_token))
        assert proj.json()["progress_percentage"] == 100.0


# ─────────────────────────────────────────────
# 6. THREAT DETECTION TESTS
# ─────────────────────────────────────────────
class TestThreatDetection:
    def test_brute_force_detection_on_multiple_failures(self, admin_token):
        """5+ failed logins for same user must trigger BRUTE_FORCE_SUSPICION alert."""
        for _ in range(6):
            client.post("/api/events", headers=auth_headers(admin_token), json={
                "event_type": "LOGIN_FAILURE",
                "user_email": "bruteforce_victim@test.com",
                "location": "Moscow, Russia",
                "ip_address": "45.33.32.156"
            })

        alerts_res = client.get("/api/alerts", headers=auth_headers(admin_token))
        alerts = alerts_res.json()
        brute_alerts = [a for a in alerts if a["alert_type"] == "BRUTE_FORCE_SUSPICION"
                        and "bruteforce_victim@test.com" in a.get("description", "")]
        assert len(brute_alerts) >= 1, "Brute force must be detected after 5+ failures"

    def test_impossible_travel_detection(self, admin_token):
        """Login from two distant locations within 10 minutes must trigger IMPOSSIBLE_TRAVEL."""
        # First login from Bangalore
        client.post("/api/events", headers=auth_headers(admin_token), json={
            "event_type": "LOGIN_SUCCESS",
            "user_email": "traveler@test.com",
            "location": "Bangalore, India",
            "ip_address": "106.51.24.100"
        })
        # Immediately second login from Frankfurt (different location)
        client.post("/api/events", headers=auth_headers(admin_token), json={
            "event_type": "NEW_LOCATION_LOGIN",
            "user_email": "traveler@test.com",
            "location": "Frankfurt, Germany",
            "ip_address": "185.220.101.50"
        })

        alerts_res = client.get("/api/alerts", headers=auth_headers(admin_token))
        alerts = alerts_res.json()
        travel_alerts = [a for a in alerts if a["alert_type"] == "IMPOSSIBLE_TRAVEL"
                         and "traveler@test.com" in a.get("title", "")]
        assert len(travel_alerts) >= 1, "Impossible travel must be detected"

    def test_data_exfiltration_detection(self, admin_token):
        """Data transfer >= 5000 MB must trigger POSSIBLE_DATA_EXFILTRATION."""
        client.post("/api/events", headers=auth_headers(admin_token), json={
            "event_type": "LARGE_DATA_TRANSFER",
            "user_email": "exfiltrator@test.com",
            "location": "Singapore",
            "ip_address": "103.6.172.12",
            "data_size_mb": 18432.0  # 18 GB
        })

        alerts_res = client.get("/api/alerts", headers=auth_headers(admin_token))
        alerts = alerts_res.json()
        exfil_alerts = [a for a in alerts if a["alert_type"] == "POSSIBLE_DATA_EXFILTRATION"]
        assert len(exfil_alerts) >= 1, "Large data transfer must trigger exfiltration alert"

    def test_normal_login_no_alert(self, admin_token):
        """Normal single login should not generate impossible travel alert."""
        initial_alerts = client.get("/api/alerts", headers=auth_headers(admin_token)).json()
        initial_travel = [a for a in initial_alerts if a["alert_type"] == "IMPOSSIBLE_TRAVEL"
                          and "normal.user@test.com" in a.get("description", "")]

        client.post("/api/events", headers=auth_headers(admin_token), json={
            "event_type": "LOGIN_SUCCESS",
            "user_email": "normal.user@test.com",
            "location": "Mumbai, India",
            "ip_address": "49.44.50.110"
        })

        after_alerts = client.get("/api/alerts", headers=auth_headers(admin_token)).json()
        after_travel = [a for a in after_alerts if a["alert_type"] == "IMPOSSIBLE_TRAVEL"
                        and "normal.user@test.com" in a.get("description", "")]
        assert len(after_travel) == len(initial_travel), "Single login must not trigger travel alert"


# ─────────────────────────────────────────────
# 7. ALERT MANAGEMENT TESTS
# ─────────────────────────────────────────────
class TestAlertManagement:
    def test_list_alerts(self, admin_token):
        """GET /alerts returns list of alerts."""
        res = client.get("/api/alerts", headers=auth_headers(admin_token))
        assert res.status_code == 200
        assert isinstance(res.json(), list)

    def test_update_alert_status(self, admin_token):
        """Alert status can be updated to ACKNOWLEDGED."""
        alerts = client.get("/api/alerts", headers=auth_headers(admin_token)).json()
        if alerts:
            alert_id = alerts[0]["id"]
            res = client.put(f"/api/alerts/{alert_id}?status_str=ACKNOWLEDGED", headers=auth_headers(admin_token))
            assert res.status_code == 200
            assert res.json()["status"] == "ACKNOWLEDGED"


# ─────────────────────────────────────────────
# 8. INCIDENT MANAGEMENT TESTS
# ─────────────────────────────────────────────
class TestIncidentManagement:
    def test_create_incident(self, admin_token):
        """Create a new security incident."""
        res = client.post("/api/incidents", headers=auth_headers(admin_token), json={
            "title": "Test Incident: Suspicious Login Pattern",
            "severity": "HIGH"
        })
        assert res.status_code == 200
        data = res.json()
        assert "INC-" in data["incident_code"]
        assert data["status"] == "INVESTIGATING"

    def test_update_incident_status(self, admin_token):
        """Update incident status lifecycle."""
        inc = client.post("/api/incidents", headers=auth_headers(admin_token), json={
            "title": "Status Lifecycle Test", "severity": "MEDIUM"
        })
        inc_id = inc.json()["id"]

        res = client.put(f"/api/incidents/{inc_id}?status_str=RESOLVED", headers=auth_headers(admin_token))
        assert res.status_code == 200
        assert res.json()["status"] == "RESOLVED"

    def test_add_analyst_note_to_incident(self, admin_token):
        """Analyst notes can be added to an incident."""
        inc = client.post("/api/incidents", headers=auth_headers(admin_token), json={
            "title": "Incident With Notes", "severity": "LOW"
        })
        inc_id = inc.json()["id"]

        note_res = client.post(
            f"/api/incidents/{inc_id}/notes",
            headers=auth_headers(admin_token),
            json={"note": "Initial investigation note: verified user IP from logs"}
        )
        assert note_res.status_code == 200
        assert note_res.json()["note"] == "Initial investigation note: verified user IP from logs"

    def test_list_incidents(self, admin_token):
        """GET /incidents returns a list of incidents."""
        res = client.get("/api/incidents", headers=auth_headers(admin_token))
        assert res.status_code == 200
        assert isinstance(res.json(), list)


# ─────────────────────────────────────────────
# 9. DASHBOARD SUMMARY TESTS
# ─────────────────────────────────────────────
class TestDashboard:
    def test_dashboard_summary_returns_all_fields(self, admin_token):
        """GET /dashboard/summary returns all required metrics."""
        res = client.get("/api/dashboard/summary", headers=auth_headers(admin_token))
        assert res.status_code == 200
        data = res.json()
        assert "total_applications" in data
        assert "total_resources" in data
        assert "migration_progress" in data
        assert "security_score" in data
        assert "critical_findings" in data
        assert "active_alerts" in data
        assert "open_incidents" in data

    def test_security_score_is_valid_range(self, admin_token):
        """Security score must be between 0 and 100."""
        res = client.get("/api/dashboard/summary", headers=auth_headers(admin_token))
        score = res.json()["security_score"]
        assert 0 <= score <= 100

    def test_migration_progress_is_valid_range(self, admin_token):
        """Migration progress must be between 0 and 100."""
        res = client.get("/api/dashboard/summary", headers=auth_headers(admin_token))
        progress = res.json()["migration_progress"]
        assert 0 <= progress <= 100


# ─────────────────────────────────────────────
# 10. AI ASSISTANT TESTS
# ─────────────────────────────────────────────
class TestAIAssistant:
    def test_explain_finding_returns_explanation(self, admin_token):
        """POST /ai/explain-finding returns AI explanation."""
        res = client.post("/api/ai/explain-finding", headers=auth_headers(admin_token), json={
            "finding_title": "Public Database Access",
            "resource_name": "customer-db",
            "severity": "CRITICAL"
        })
        assert res.status_code == 200
        data = res.json()
        assert "explanation" in data
        assert len(data["explanation"]) > 50

    def test_remediation_returns_plan(self, admin_token):
        """POST /ai/remediation returns step-by-step plan."""
        res = client.post("/api/ai/remediation", headers=auth_headers(admin_token), json={
            "issue_description": "Unencrypted production database detected"
        })
        assert res.status_code == 200
        data = res.json()
        assert "remediation_plan" in data
        assert len(data["remediation_plan"]) > 50

    def test_summarize_alerts_returns_summary(self, admin_token):
        """POST /ai/summarize-alerts returns summary string."""
        res = client.post("/api/ai/summarize-alerts", headers=auth_headers(admin_token))
        assert res.status_code == 200
        assert "summary" in res.json()
