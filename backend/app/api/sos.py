from fastapi import APIRouter, HTTPException, Status
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from app.services.sos_service import SOSService

router = APIRouter(prefix="/api/sos", tags=["Emergency SOS"])

class SOSContact(BaseModel):
    name: str
    phone: str
    relationship: Optional[str] = "Family"

class SOSRequest(BaseModel):
    user_name: str = Field(default="Emergency Patient")
    user_phone: str = Field(default="+1-555-0100")
    lat: float = Field(default=37.7749)
    lng: float = Field(default=-122.4194)
    address: Optional[str] = "San Francisco Emergency Zone"
    priority: str = Field(default="RED")
    medical_summary: str = Field(default="Acute respiratory distress and severe hemorrhage reported.")
    contacts: List[SOSContact] = Field(default=[])

@router.post("/trigger")
async def trigger_emergency_sos(request: SOSRequest):
    try:
        contacts_dict = [c.model_dump() for c in request.contacts]
        if not contacts_dict:
            contacts_dict = [
                {"name": "Dr. Sarah Jenkins", "phone": "+1-800-555-0199", "relationship": "Primary Care Physician"},
                {"name": "Mark Miller", "phone": "+1-555-0144", "relationship": "Spouse / Emergency Contact"}
            ]

        result = SOSService.dispatch_sos(
            user_name=request.user_name,
            user_phone=request.user_phone,
            lat=request.lat,
            lng=request.lng,
            address=request.address,
            priority=request.priority,
            medical_summary=request.medical_summary,
            contacts=contacts_dict
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(
            status_code=Status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"SOS dispatch failure: {str(e)}"
        )
