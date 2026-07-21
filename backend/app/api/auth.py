from fastapi import APIRouter, HTTPException, Status
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
import jwt
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/auth", tags=["Authentication & User Profile"])

SECRET_KEY = "rescuemind-emergency-jwt-secret-key-production"
ALGORITHM = "HS256"

class EmailLoginRequest(BaseModel):
    email: EmailStr
    password: str

class GoogleLoginRequest(BaseModel):
    id_token: str

class EmergencyContactItem(BaseModel):
    id: Optional[str] = None
    name: str
    phone: str
    relationship: str
    email: Optional[str] = None

class ProfileUpdateRequest(BaseModel):
    full_name: str
    phone: str
    blood_group: str
    allergies: str
    chronic_conditions: str
    emergency_contacts: List[EmergencyContactItem]

def create_jwt_token(user_data: dict) -> str:
    payload = user_data.copy()
    payload.update({"exp": datetime.utcnow() + timedelta(days=7)})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login/email")
async def login_email(request: EmailLoginRequest):
    token = create_jwt_token({"sub": request.email, "role": "responder"})
    return {
        "success": True,
        "token": token,
        "user": {
            "email": request.email,
            "full_name": "Dr. Alex Vance",
            "blood_group": "O+",
            "phone": "+1-555-0199",
            "allergies": "Penicillin",
            "chronic_conditions": "Asthma",
            "emergency_contacts": [
                {"id": "1", "name": "Sarah Vance", "phone": "+1-555-0122", "relationship": "Spouse"},
                {"id": "2", "name": "Marcus Vance", "phone": "+1-555-0188", "relationship": "Brother"}
            ]
        }
    }

@router.post("/login/google")
async def login_google(request: GoogleLoginRequest):
    token = create_jwt_token({"sub": "google-user@rescuemind.ai", "provider": "google"})
    return {
        "success": True,
        "token": token,
        "user": {
            "email": "user.google@rescuemind.ai",
            "full_name": "Emergency User (Google Auth)",
            "blood_group": "A+",
            "phone": "+1-555-0789",
            "allergies": "None",
            "chronic_conditions": "None",
            "emergency_contacts": [
                {"id": "1", "name": "Primary Dispatch Contact", "phone": "+1-800-555-0199", "relationship": "Doctor"}
            ]
        }
    }

@router.post("/profile/update")
async def update_profile(request: ProfileUpdateRequest):
    return {
        "success": True,
        "message": "User profile and emergency contacts updated successfully.",
        "user": request.model_dump()
    }
