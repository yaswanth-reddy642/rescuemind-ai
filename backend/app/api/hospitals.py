from fastapi import APIRouter, Query
from typing import Optional, List, Dict, Any

router = APIRouter(prefix="/api/hospitals", tags=["Hospitals & Emergency Finder"])

SAMPLE_HOSPITALS = [
    {
        "id": "hosp_1",
        "name": "St. Jude Trauma Center & Emergency Hospital",
        "type": "Level 1 Trauma Center",
        "distance_km": 1.2,
        "eta_minutes": 4,
        "er_wait_time": "5 mins",
        "phone": "+1-800-555-0199",
        "address": "450 Medical Heights Center, Suite 100",
        "lat": 37.7749,
        "lng": -122.4194,
        "available_ambulances": 3,
        "iculated_beds": 12,
        "heliport": True
    },
    {
        "id": "hosp_2",
        "name": "Metro General Emergency & Heart Institute",
        "type": "Cardiac & General ER",
        "distance_km": 2.8,
        "eta_minutes": 8,
        "er_wait_time": "12 mins",
        "phone": "+1-800-555-0244",
        "address": "890 Central Health Blvd",
        "lat": 37.7833,
        "lng": -122.4167,
        "available_ambulances": 5,
        "iculated_beds": 8,
        "heliport": False
    },
    {
        "id": "hosp_3",
        "name": "City Urgent Medical Response Facility",
        "type": "Urgent Care & Rapid Triage",
        "distance_km": 4.1,
        "eta_minutes": 11,
        "er_wait_time": "18 mins",
        "phone": "+1-800-555-0811",
        "address": "1200 Rescue Parkway",
        "lat": 37.7650,
        "lng": -122.4250,
        "available_ambulances": 2,
        "iculated_beds": 4,
        "heliport": False
    },
    {
        "id": "hosp_4",
        "name": "Red Cross Disaster Relief Center",
        "type": "Mass Casualty Emergency Unit",
        "distance_km": 5.5,
        "eta_minutes": 14,
        "er_wait_time": "0 mins (Direct Admission)",
        "phone": "+1-800-555-9110",
        "address": "300 Relief Way Sector 4",
        "lat": 37.7580,
        "lng": -122.4300,
        "available_ambulances": 8,
        "iculated_beds": 25,
        "heliport": True
    }
]

@router.get("/nearby")
async def get_nearby_hospitals(
    lat: Optional[float] = Query(37.7749, description="User latitude"),
    lng: Optional[float] = Query(-122.4194, description="User longitude"),
    radius_km: float = Query(10.0, description="Search radius in kilometers")
):
    # Adjust coordinates relative to input lat/lng for realistic map positioning
    hospitals = []
    for idx, h in enumerate(SAMPLE_HOSPITALS):
        item = h.copy()
        item["lat"] = lat + (0.01 * (idx + 1) * (1 if idx % 2 == 0 else -1))
        item["lng"] = lng + (0.012 * (idx + 1) * (1 if idx % 2 == 1 else -1))
        hospitals.append(item)

    return {
        "success": True,
        "user_location": {"lat": lat, "lng": lng},
        "total_found": len(hospitals),
        "hospitals": hospitals,
        "emergency_hotlines": [
            {"label": "National Emergency Dispatch", "number": "911 / 112"},
            {"label": "Ambulance Direct Hotline", "number": "+1-800-555-0199"},
            {"label": "Poison Control Helpline", "number": "+1-800-222-1222"},
            {"label": "Disaster Relief Coordination", "number": "+1-800-621-3362"}
        ]
    }
