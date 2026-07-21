from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from app.api import triage, vision, audio, disaster, hospitals, sos, analytics, auth

app = FastAPI(
    title="RescueMind AI – Offline Emergency Triage & Disaster Response API",
    description="Production-grade AI Emergency Decision Engine, Injury Vision Analyzer, Speech Extractor, and SOS Dispatcher.",
    version="1.0.0"
)

# Enable CORS for frontend Vite & Vercel deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging & Response Time Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time-Sec"] = f"{process_time:.4f}"
    return response

# Include Routers
app.include_router(triage.router)
app.include_router(vision.router)
app.include_router(audio.router)
app.include_router(disaster.router)
app.include_router(hospitals.router)
app.include_router(sos.router)
app.include_router(analytics.router)
app.include_router(auth.router)

@app.get("/")
async def root():
    return {
        "app": "RescueMind AI",
        "status": "ONLINE",
        "description": "Offline Emergency Triage & Disaster Response Assistant API",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "ai_engines": {
            "triage_classifier": "active",
            "opencv_vision_analyzer": "active",
            "whisper_nlp": "active",
            "disaster_intelligence": "active"
        }
    }
