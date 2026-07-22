from fastapi import APIRouter, HTTPException
from app.services.disaster_engine import DisasterEngine

router = APIRouter(prefix="/api/disaster", tags=["Disaster Response"])

@router.get("/protocol/{disaster_type}")
async def get_disaster_protocol(disaster_type: str):
    guide = DisasterEngine.get_guide(disaster_type)
    return {"success": True, "disaster": disaster_type, "data": guide}
