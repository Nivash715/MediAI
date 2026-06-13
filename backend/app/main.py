from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .core.config import settings
from .routes import auth, medicines, pharmacies, orders, symptoms, prescriptions, health_records, consultations, delivery, instantdb
from .database.instantdb import db_mode
import os, logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mediai")

app = FastAPI(
    title=f"{settings.APP_NAME} API",
    description="AI-powered healthcare and medicine delivery platform",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(medicines.router)
app.include_router(pharmacies.router)
app.include_router(orders.router)
app.include_router(symptoms.router)
app.include_router(prescriptions.router)
app.include_router(health_records.router)
app.include_router(consultations.router)
app.include_router(delivery.router)
app.include_router(instantdb.router)


@app.on_event("startup")
async def startup():
    logger.info(f"MediAI started — database: {db_mode()}")


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "app": settings.APP_NAME, "db": db_mode()}
