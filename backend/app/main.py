from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.config import settings
from app.database.session import engine, Base
from app.api import (
    auth, applications, resources, migrations, security, events, alerts, incidents, dashboard, ai, audit
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cloudguard.main")

# Auto-create tables if they don't exist yet
Base.metadata.create_all(bind=engine)

# Seed demo data on first boot (idempotent; no-op if already seeded)
try:
    from seed import seed
    seed()
except Exception as e:
    logger.warning(f"Auto-seed skipped: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise Cloud Migration & SecOps Platform Simulation API",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Setup for local Vite React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(applications.router, prefix=settings.API_V1_STR)
app.include_router(resources.router, prefix=settings.API_V1_STR)
app.include_router(migrations.router, prefix=settings.API_V1_STR)
app.include_router(security.router, prefix=settings.API_V1_STR)
app.include_router(events.router, prefix=settings.API_V1_STR)
app.include_router(alerts.router, prefix=settings.API_V1_STR)
app.include_router(incidents.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(audit.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "documentation": "/docs"
    }
