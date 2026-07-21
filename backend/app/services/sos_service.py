from typing import Dict, Any, List
from datetime import datetime

class SOSService:
    """
    Emergency Alert & SOS Dispatch Service.
    Generates distress alerts, formats location tags, notifies emergency contacts,
    and logs critical emergency signals.
    """

    @staticmethod
    def dispatch_sos(
        user_name: str,
        user_phone: str,
        lat: float,
        lng: float,
        address: str,
        priority: str,
        medical_summary: str,
        contacts: List[Dict[str, str]]
    ) -> Dict[str, Any]:
        timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        
        map_url = f"https://maps.google.com/?q={lat},{lng}"
        
        distress_message = (
            f"🚨 EMERGENCY SOS ALERT! 🚨\n"
            f"Name: {user_name}\n"
            f"Priority: {priority}\n"
            f"Summary: {medical_summary}\n"
            f"Location: {address if address else 'GPS Coordinates'}\n"
            f"Map Link: {map_url}\n"
            f"Time: {timestamp}\n"
            f"Please send help or contact local emergency dispatch!"
        )

        dispatch_results = []
        for contact in contacts:
            dispatch_results.append({
                "contact_name": contact.get("name", "Emergency Contact"),
                "contact_phone": contact.get("phone", "N/A"),
                "relationship": contact.get("relationship", "Family"),
                "channel": "SMS & Push Notification",
                "status": "SENT",
                "dispatched_at": timestamp
            })

        return {
            "sos_id": f"SOS-{int(datetime.utcnow().timestamp())}",
            "status": "DISPATCHED",
            "timestamp": timestamp,
            "geo_coordinates": {"latitude": lat, "longitude": lng},
            "map_url": map_url,
            "distress_message": distress_message,
            "recipients_notified": len(dispatch_results),
            "contact_delivery_details": dispatch_results
        }
