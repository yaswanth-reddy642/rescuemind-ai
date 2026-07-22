from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional
from app.services.triage_engine import TriageEngine

router = APIRouter(prefix="/api/triage", tags=["Triage"])

class TriageRequest(BaseModel):
    age: int = Field(..., ge=0, le=120, description="Patient age in years")
    gender: str = Field(..., description="Gender: Male, Female, Other")
    symptoms: List[str] = Field(default=[], description="List of presented symptoms")
    injury_type: str = Field(default="None", description="Primary physical injury type")
    pulse: int = Field(..., ge=0, le=250, description="Pulse rate in beats per minute")
    breathing_rate: int = Field(..., ge=0, le=80, description="Breathing rate in breaths per minute")
    consciousness: str = Field(..., description="Consciousness level: alert, voice, pain, unresponsive")
    bleeding_level: str = Field(..., description="Bleeding level: none, mild, moderate, severe, arterial")

@router.post("/assess")
async def assess_emergency(request: TriageRequest):
    try:
        result = TriageEngine.evaluate(
            age=request.age,
            gender=request.gender,
            symptoms=request.symptoms,
            injury_type=request.injury_type,
            pulse=request.pulse,
            breathing_rate=request.breathing_rate,
            consciousness=request.consciousness,
            bleeding_level=request.bleeding_level
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Triage evaluation error: {str(e)}"
        )
