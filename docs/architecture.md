# Architecture Documentation – CloudGuard Enterprise Cloud Migration & SecOps Platform

## System Overview

CloudGuard is a **cloud migration simulation and security operations platform**. It helps enterprises:
1. Assess and track the migration of on-premise applications to simulated cloud environments.
2. Monitor infrastructure for security misconfigurations using a rule-based engine.
3. Detect suspicious user behaviour through threat telemetry event processing.
4. Manage security incidents end-to-end with analyst collaboration.

---

## Architecture Diagram

```
                    React Frontend (Vite + Tailwind CSS + Recharts)
                                          │
                                       Axios HTTP (JWT Bearer)
                                          │
                                   FastAPI Backend (Uvicorn)
                                          │
       ┌──────────────────────────────────┼──────────────────────────────────┐
       ▼                                  ▼                                  ▼
 app/api/applications.py          app/api/security.py             app/api/incidents.py
 app/api/migrations.py            app/api/events.py               app/api/alerts.py
 (Application & Migration)        (Security Engine &              (Incident Lifecycle)
                                   Threat Detection)
       │                                  │                                  │
       └──────────────────────────────────┼──────────────────────────────────┘
                                          ▼
                                   app/api/ai.py
                              (AI Security Assistant)
                                          │
                          SQLAlchemy ORM (PostgreSQL / SQLite)
                                          │
                               cloudguard_db (14 Tables)
```

---

## Technology Stack

| Tier | Technology | Version | Role |
|---|---|---|---|
| Frontend Framework | React | 18.x | UI Component Model |
| Frontend Build | Vite | 5.x | Dev Server & Module Bundler |
| Frontend Styling | Tailwind CSS | 3.x | Utility-First CSS Framework |
| Frontend Charts | Recharts | 2.x | Data Visualisation |
| Frontend HTTP Client | Axios | 1.x | REST API Communication |
| Backend Framework | FastAPI | 0.109+ | REST API + OpenAPI Docs |
| ASGI Server | Uvicorn | 0.27+ | Async HTTP Server |
| ORM | SQLAlchemy | 2.0.x | Database Model Layer |
| Schema Validation | Pydantic v2 | 2.6+ | Input/Output Validation |
| Authentication | JWT (PyJWT) | 2.8+ | Stateless Token Auth |
| Password Hashing | Passlib (bcrypt) | 1.7.4 | Secure Credential Storage |
| Database | PostgreSQL | 14+ | Primary Persistent Store |
| Test DB Fallback | SQLite | Built-in | Zero-config Local Fallback |

---

## Data Flow

### Login Flow
```
Browser → POST /api/auth/login → FastAPI → SQLAlchemy → DB
       ← JWT Access Token ←
       → JWT stored in localStorage
       → Axios Interceptor attaches Bearer Token to all requests
```

### Security Scan Flow
```
Analyst clicks "Run Scan" → POST /api/security/scan
→ Fetch all InfrastructureResources from DB
→ Evaluate each resource against 6 SecurityRules in RULE_DEFINITIONS
→ For each violation: INSERT SecurityFinding
→ For resolved violations: UPDATE SecurityFinding.status = RESOLVED
→ Recalculate SecurityScore
→ Return scan summary
```

### Threat Detection Flow
```
Admin creates event → POST /api/events
→ INSERT SecurityEvent
→ evaluate_threat_rules() called automatically
    ├── IMPOSSIBLE_TRAVEL: Check last login location vs current. If Δt < 10 min and location ≠ → INSERT Alert
    ├── DATA_EXFILTRATION: If data_size_mb >= 5000 → INSERT Alert
    └── BRUTE_FORCE: If failed logins >= 5 for same user → INSERT Alert
→ Analyst escalates Alert → POST /api/incidents
→ Analyst investigates, adds notes → POST /api/incidents/{id}/notes
→ Analyst resolves → PUT /api/incidents/{id}?status_str=RESOLVED
```

---

## Module Descriptions

### `app/api/auth.py`
- JWT token generation and verification.
- bcrypt password hashing.
- OAuth2 Bearer token dependency for protected routes.
- Roles: `ADMIN`, `SECURITY_ANALYST`, `VIEWER`.

### `app/api/security.py` – Security Rule Engine
- **RULE-01**: `is_publicly_accessible == True` → CRITICAL
- **RULE-02**: `is_encrypted == False` → HIGH
- **RULE-03**: `ssh_public == True` → HIGH
- **RULE-04**: `permission_level == "ADMIN"` → HIGH
- **RULE-05**: `is_backup_enabled == False` → MEDIUM
- **RULE-06**: `software_version < min_supported_version` → MEDIUM
- Security Score Formula: `max(0, 100 - (CRITICAL*40 + HIGH*25 + MEDIUM*15 + LOW*5))`

### `app/api/events.py` – Threat Detection Engine
- **Impossible Travel**: Same user email with different locations within 10 minutes.
- **Data Exfiltration**: `data_size_mb >= 5000` in single transfer event.
- **Brute Force**: `5 or more LOGIN_FAILURE` events for same user email.

### `app/api/ai.py` – AI Security Assistant
- `POST /api/ai/explain-finding` – Risk explanation for a given security finding.
- `POST /api/ai/remediation` – Step-by-step remediation playbook generation.
- `POST /api/ai/summarize-alerts` – Executive security posture summary.
- Deterministic fallback templates ensure offline resilience without LLM API dependency.
