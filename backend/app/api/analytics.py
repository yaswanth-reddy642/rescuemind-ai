from fastapi import APIRouter

router = APIRouter(prefix="/api/analytics", tags=["Analytics Dashboard"])

@router.get("/dashboard")
async def get_analytics_metrics():
    return {
        "success": True,
        "metrics": {
            "total_assessments": 1428,
            "critical_cases": 342,
            "urgent_cases": 489,
            "delayed_cases": 395,
            "minor_cases": 202,
            "avg_ai_confidence": 94.7,
            "avg_triage_time_sec": 3.2,
            "sos_dispatches": 89,
            "hospital_referrals": 812
        },
        "priority_distribution": [
            {"name": "RED (Immediate)", "value": 342, "color": "#EF4444"},
            {"name": "ORANGE (Urgent)", "value": 489, "color": "#F97316"},
            {"name": "YELLOW (Delayed)", "value": 395, "color": "#EAB308"},
            {"name": "GREEN (Minor)", "value": 202, "color": "#10B981"}
        ],
        "injury_distribution": [
            {"injury": "Hemorrhage / Bleeding", "count": 420},
            {"injury": "Fractures & Deformity", "count": 310},
            {"injury": "Thermal / Chemical Burns", "count": 250},
            {"injury": "Respiratory Distress", "count": 280},
            {"injury": "Head / Spinal Trauma", "count": 168}
        ],
        "monthly_trends": [
            {"month": "Jan", "total": 180, "critical": 42, "sos": 12},
            {"month": "Feb", "total": 210, "critical": 51, "sos": 15},
            {"month": "Mar", "total": 240, "critical": 58, "sos": 14},
            {"month": "Apr", "total": 195, "critical": 44, "sos": 11},
            {"month": "May", "total": 290, "critical": 72, "sos": 19},
            {"month": "Jun", "total": 313, "critical": 75, "sos": 18}
        ],
        "ai_performance": {
            "triage_accuracy": 96.2,
            "vision_detection_mAP": 92.4,
            "whisper_speech_wer": 4.1,
            "offline_onnx_latency_ms": 48
        }
    }
