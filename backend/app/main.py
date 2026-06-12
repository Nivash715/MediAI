from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .core.config import settings
from .routes import auth, medicines, pharmacies, orders, symptoms, prescriptions, health_records, consultations, delivery, instantdb
import os

app = FastAPI(
    title=f"{settings.APP_NAME} API",
    description="AI-powered healthcare and medicine delivery platform — powered by InstantDB",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving (prescription uploads)
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Routers
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


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "app": settings.APP_NAME, "db": "InstantDB"}
