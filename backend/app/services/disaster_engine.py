from typing import Dict, Any, List

class DisasterEngine:
    """
    AI Disaster Response Engine providing crisis survival protocols,
    interactive step-by-step checklists, supply requirements, and offline survival tips.
    """

    DISASTER_DATA: Dict[str, Dict[str, Any]] = {
        "flood": {
            "title": "Flood Emergency Response Protocol",
            "hazard_level": "High - Rapid Inundation Risk",
            "immediate_actions": [
                "Move to higher ground or upper floor immediately. Avoid basements.",
                "Disconnect main electricity breaker switch and turn off gas valve.",
                "Do NOT walk, swim, or drive through moving floodwaters (6 inches of moving water can knock you down).",
                "Fill clean containers with drinking water before supply is contaminated."
            ],
            "checklist": [
                {"id": "fl_1", "item": "Store 1 gallon of drinking water per person per day", "category": "Water"},
                {"id": "fl_2", "item": "Non-perishable ready-to-eat canned goods (3-day supply)", "category": "Food"},
                {"id": "fl_3", "item": "Waterproof flashlight & battery power bank", "category": "Tools"},
                {"id": "fl_4", "item": "First aid kit with water-resistant dressing", "category": "Medical"},
                {"id": "fl_5", "item": "Important documents sealed in Ziploc bags", "category": "Documents"}
            ],
            "communication_tips": "Text instead of calling to keep network lines open for 911 dispatch."
        },
        "earthquake": {
            "title": "Earthquake Crisis Protocol",
            "hazard_level": "Critical - Structural Collapse & Aftershocks",
            "immediate_actions": [
                "DROP to your hands and knees.",
                "COVER your head and neck under a sturdy table or desk.",
                "HOLD ON until the shaking stops completely.",
                "Stay away from glass windows, exterior walls, and heavy overhead lighting."
            ],
            "checklist": [
                {"id": "eq_1", "item": "Sturdy closed-toe shoes near bedside", "category": "Gear"},
                {"id": "eq_2", "item": "Whistle for signaling search & rescue teams", "category": "Safety"},
                {"id": "eq_3", "item": "Heavy-duty work gloves for clearing debris", "category": "Tools"},
                {"id": "eq_4", "item": "Portable AM/FM radio receiver for disaster emergency broadcasts", "category": "Comms"},
                {"id": "eq_5", "item": "Prescription medications (7-day supply)", "category": "Medical"}
            ],
            "communication_tips": "If trapped, tap rhythmically on pipes or walls rather than shouting to conserve oxygen."
        },
        "fire": {
            "title": "Structure / Wildfire Survival Protocol",
            "hazard_level": "Immediate Life Threat - Smoke Inhalation Risk",
            "immediate_actions": [
                "Get low to the floor and crawl under smoke toward the nearest exit.",
                "Feel door handles with back of hand before opening; if hot, do NOT open.",
                "If clothes catch fire: STOP, DROP, and ROLL.",
                "Never re-enter a burning building for any reason."
            ],
            "checklist": [
                {"id": "fr_1", "item": "N95 / Smoke filtration respirator masks", "category": "PPE"},
                {"id": "fr_2", "item": "Flame-resistant emergency blanket", "category": "Safety"},
                {"id": "fr_3", "item": "Fire extinguisher (ABC Multi-purpose)", "category": "Tools"},
                {"id": "fr_4", "item": "Emergency escape ladder for upper floors", "category": "Hardware"},
                {"id": "fr_5", "item": "Emergency burn care hydrogel dressing", "category": "Medical"}
            ],
            "communication_tips": "Call emergency services once safely outside and clear of thermal hazards."
        },
        "cyclone": {
            "title": "Cyclone / Hurricane Defense Protocol",
            "hazard_level": "Severe - Extreme Wind & Storm Surge",
            "immediate_actions": [
                "Shelter in a small interior windowless room, bathroom, or closet on the lowest floor.",
                "Board up windows or close storm shutters tightly.",
                "Stay indoors during the 'eye of the storm' as destructive winds will resume abruptly from opposite direction.",
                "Keep clear of glass sliding doors and skylights."
            ],
            "checklist": [
                {"id": "cy_1", "item": "Window taping / Plywood coverings installed", "category": "Shelter"},
                {"id": "cy_2", "item": "Emergency solar generator / fully charged power station", "category": "Power"},
                {"id": "cy_3", "item": "Water purification tablets or bleach solution", "category": "Sanitation"},
                {"id": "cy_4", "item": "Emergency cash in small bills", "category": "Essentials"},
                {"id": "cy_5", "item": "Signal flares or high-lumen strobe light", "category": "Signaling"}
            ],
            "communication_tips": "Keep battery radio tuned to local emergency weather alerts."
        }
    }

    @staticmethod
    def get_guide(disaster_type: str) -> Dict[str, Any]:
        disaster_key = disaster_type.lower()
        if disaster_key in DisasterEngine.DISASTER_DATA:
            return DisasterEngine.DISASTER_DATA[disaster_key]
        else:
            return {
                "title": "General Disaster Response Protocol",
                "hazard_level": "Moderate",
                "immediate_actions": [
                    "Assess immediate surroundings for active hazards.",
                    "Establish contact with emergency services.",
                    "Follow local civil defense authority instructions."
                ],
                "checklist": [
                    {"id": "gen_1", "item": "Standard Emergency First Aid Kit", "category": "Medical"},
                    {"id": "gen_2", "item": "Flashlight & Batteries", "category": "Lighting"}
                ],
                "communication_tips": "Maintain emergency communication line active."
            }
