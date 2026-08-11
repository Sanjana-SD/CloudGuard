# CloudGuard – Enterprise Cloud Migration & SecOps Platform

> **Simple Explanation**: CloudGuard is a centralized platform that simulates an enterprise cloud migration environment and provides security monitoring throughout the migration process. It helps organizations identify migration risks, track application migration, detect security misconfigurations, monitor suspicious activities, and manage security incidents from a single dashboard.

---

## System Architecture

```
                    React Frontend (Vite + Tailwind CSS)
                                   |
                                REST API
                                   |
                            FastAPI Backend
                                   |
       ┌───────────────────────────┼───────────────────────────┐
       ↓                           ↓                           ↓
 Application & Migration    Security Scanner &      Incident Management &
     Tracker Module            Threat Engine              Audit Logs
       │                           │                           │
       └───────────────────────────┼───────────────────────────┘
                                   ↓
                         AI Security Assistant
                                   |
                        PostgreSQL / Database
```

---

## Member Responsibilities

* **Member 1 (Frontend & UI/UX)**: React setup, Vite, Tailwind CSS, Dark glassmorphism design, Recharts dashboards, Applications, Migration, Security, and Incident UI pages.
* **Member 2 (Backend & Database)**: FastAPI server, PostgreSQL schema & SQLAlchemy ORM, JWT Authentication (`/api/auth`), RBAC authorization, CRUD endpoints, and OpenAPI docs.
* **Member 3 (Security Engine)**: Rule-based Security Scanner (6 core rules), Risk scoring algorithm ($0-100$), Threat event processor (Impossible Travel, Data Exfiltration, Brute Force), and Alert generation.
* **Member 4 (AI + System Integration)**: AI Security Assistant endpoints, Seed script (`database/seed.py`), E2E integration, setup guide, and viva presentation story.

---

## Local Setup & Quick Start

### 1. Database & Seed Data
Initialize the database and populate sample data (ABC Financial Services):

```bash
python database/seed.py
```

### 2. Backend Server
Navigate to `backend`, install dependencies, and launch FastAPI:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

FastAPI interactive Swagger docs will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend Web Client
Navigate to `frontend`, install dependencies, and launch dev server:

```bash
cd frontend
npm install
npm run dev
```

CloudGuard Web UI will be live at: [http://localhost:5173](http://localhost:5173)

---

## Demo Credentials

* **Admin**: `admin@abc.com` | Password: `password123`
* **Security Analyst**: `analyst@abc.com` | Password: `password123`
* **Viewer**: `viewer@abc.com` | Password: `password123`
