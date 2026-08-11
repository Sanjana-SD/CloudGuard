# CloudGuard REST API Reference

Base URL: `http://localhost:8000/api`

Interactive Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

All protected endpoints require `Authorization: Bearer <JWT_TOKEN>` header.

---

## Authentication

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "analyst@abc.com",
  "password": "password123",
  "full_name": "Alex Rivera",
  "role": "SECURITY_ANALYST"
}
```
**Response:** `200 OK` → User object

---

### POST /auth/login
Authenticate and receive a JWT access token.

**Request Body:**
```json
{
  "email": "admin@abc.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "access_token": "<JWT_TOKEN>",
  "token_type": "bearer",
  "role": "ADMIN",
  "user_id": 1,
  "full_name": "Sarah Connor",
  "email": "admin@abc.com"
}
```

---

### GET /auth/me
Returns authenticated user info from JWT token.

---

## Applications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/applications` | List all applications |
| `POST` | `/applications` | Create a new application |
| `GET` | `/applications/{id}` | Get application by ID |
| `PUT` | `/applications/{id}` | Update application |
| `DELETE` | `/applications/{id}` | Delete application |

**Create Application Request Body:**
```json
{
  "name": "Customer Portal",
  "description": "Primary web banking portal",
  "owner": "Web Team",
  "department": "Digital Banking",
  "technology_stack": "React + Node.js",
  "current_env": "On-Premise",
  "target_env": "Cloud",
  "migration_status": "IN_PROGRESS",
  "migration_risk": "MEDIUM",
  "dependency_ids": [2, 3]
}
```

---

## Infrastructure Resources

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/resources` | List all resources |
| `POST` | `/resources` | Provision a resource |
| `GET` | `/resources/{id}` | Get resource by ID |
| `PUT` | `/resources/{id}` | Update resource |
| `DELETE` | `/resources/{id}` | Delete resource |

**Migration Status Values:** `NOT_STARTED`, `ASSESSMENT`, `PLANNED`, `IN_PROGRESS`, `TESTING`, `MIGRATED`, `FAILED`

**Resource Type Values:** `SERVER`, `DATABASE`, `STORAGE`, `API`, `LOAD_BALANCER`

---

## Migration Projects

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/migrations` | List all migration projects |
| `POST` | `/migrations` | Create migration project |
| `GET` | `/migrations/{id}` | Get project with task list |
| `POST` | `/migrations/tasks` | Add task to project |
| `PUT` | `/migrations/tasks/{id}?status_str=COMPLETED` | Update task status |

---

## Security Engine

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/security/scan` | Run rule-based security scan |
| `GET` | `/security/findings` | List all security findings |
| `PUT` | `/security/findings/{id}?status_str=RESOLVED` | Update finding status |
| `GET` | `/security/score` | Get organization security score |

**Security Score Response:**
```json
{
  "security_score": 72,
  "critical_count": 4,
  "high_count": 8,
  "medium_count": 15,
  "low_count": 5,
  "total_open_findings": 32
}
```

---

## Security Events

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/events` | List all security events |
| `POST` | `/events` | Record a security event (auto-detects threats) |

**Event Types:** `LOGIN_SUCCESS`, `LOGIN_FAILURE`, `NEW_LOCATION_LOGIN`, `LARGE_DATA_TRANSFER`, `IMPOSSIBLE_TRAVEL`, `PRIVILEGE_CHANGE`

---

## Alerts

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/alerts` | List all alerts |
| `PUT` | `/alerts/{id}?status_str=ACKNOWLEDGED` | Update alert status |

**Alert Status Values:** `NEW`, `ACKNOWLEDGED`, `INVESTIGATING`, `RESOLVED`

---

## Incidents

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/incidents` | List all incidents |
| `POST` | `/incidents` | Create a new incident |
| `PUT` | `/incidents/{id}?status_str=RESOLVED` | Update incident status |
| `POST` | `/incidents/{id}/notes` | Add analyst note |

**Incident Status Values:** `NEW`, `INVESTIGATING`, `MITIGATED`, `RESOLVED`, `CLOSED`

---

## Dashboard

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard/summary` | Get all executive metrics |

**Response:**
```json
{
  "total_applications": 6,
  "total_resources": 6,
  "migration_progress": 76.0,
  "security_score": 72,
  "critical_findings": 4,
  "active_alerts": 5,
  "open_incidents": 3
}
```

---

## AI Security Assistant

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/ai/explain-finding` | Explain a security finding's risk |
| `POST` | `/ai/remediation` | Generate remediation steps |
| `POST` | `/ai/summarize-alerts` | Executive alert summary |

**Explain Finding Request:**
```json
{
  "finding_id": 1,
  "finding_title": "Public Database Access",
  "resource_name": "customer-db",
  "severity": "CRITICAL"
}
```

---

## Audit Logs

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/audit-logs` | Retrieve immutable audit trail |
