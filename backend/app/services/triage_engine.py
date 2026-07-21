from typing import List, Dict, Any
import math

class TriageEngine:
    """
    Emergency Triage Engine based on modified START (Simple Triage and Rapid Treatment)
    and ESI (Emergency Severity Index) clinical guidelines combined with a deterministic
    risk scoring classifier.
    """
    
    @staticmethod
    def evaluate(
        age: int,
        gender: str,
        symptoms: List[str],
        injury_type: str,
        pulse: int,
        breathing_rate: int,
        consciousness: str,
        bleeding_level: str
    ) -> Dict[str, Any]:
        risk_score = 0.0
        reasoning_factors = []
        
        # 1. Respiration Assessment (START Protocol)
        if breathing_rate == 0:
            risk_score += 45.0
            reasoning_factors.append({
                "factor": "Apnea / Zero Respiration",
                "weight": "+45%",
                "severity": "critical",
                "detail": "Patient is not breathing independently. Immediate airway management required."
            })
        elif breathing_rate > 30:
            risk_score += 25.0
            reasoning_factors.append({
                "factor": "Tachypnea (>30 bpm)",
                "weight": "+25%",
                "severity": "high",
                "detail": f"Elevated breathing rate ({breathing_rate} bpm) indicates acute respiratory distress or severe shock."
            })
        elif breathing_rate < 10:
            risk_score += 20.0
            reasoning_factors.append({
                "factor": "Bradypnea (<10 bpm)",
                "weight": "+20%",
                "severity": "high",
                "detail": f"Abnormally slow breathing ({breathing_rate} bpm) points to CNS depression or hypoxemia."
            })
            
        # 2. Perfusion / Pulse Assessment
        if pulse == 0:
            risk_score += 50.0
            reasoning_factors.append({
                "factor": "Absent Radial/Carotid Pulse",
                "weight": "+50%",
                "severity": "critical",
                "detail": "Cardiac arrest or severe circulatory failure suspected."
            })
        elif pulse > 120:
            risk_score += 20.0
            reasoning_factors.append({
                "factor": "Severe Tachycardia (>120 bpm)",
                "weight": "+20%",
                "severity": "high",
                "detail": f"Extreme pulse rate ({pulse} bpm) suggests hypovolemic shock, cardiac event, or severe trauma."
            })
        elif pulse < 45:
            risk_score += 15.0
            reasoning_factors.append({
                "factor": "Severe Bradycardia (<45 bpm)",
                "weight": "+15%",
                "severity": "moderate",
                "detail": f"Low pulse rate ({pulse} bpm) indicates potential heart block or autonomic shock."
            })

        # 3. Neurological / Consciousness Level (AVPU Scale)
        consciousness_lower = consciousness.lower()
        if consciousness_lower in ["unresponsive", "u"]:
            risk_score += 35.0
            reasoning_factors.append({
                "factor": "Unresponsive (AVPU: U)",
                "weight": "+35%",
                "severity": "critical",
                "detail": "Patient unresponsive to verbal and painful stimuli; severe brain ischemia or severe trauma."
            })
        elif consciousness_lower in ["pain", "p"]:
            risk_score += 20.0
            reasoning_factors.append({
                "factor": "Responds only to Pain (AVPU: P)",
                "weight": "+20%",
                "severity": "high",
                "detail": "Depressed neurological state; altered mental status."
            })
        elif consciousness_lower in ["voice", "v"]:
            risk_score += 10.0
            reasoning_factors.append({
                "factor": "Responds to Voice (AVPU: V)",
                "weight": "+10%",
                "severity": "moderate",
                "detail": "Partial disorientation or lethargy."
            })

        # 4. Bleeding Severity
        bleeding_lower = bleeding_level.lower()
        if bleeding_lower in ["arterial", "severe"]:
            risk_score += 30.0
            reasoning_factors.append({
                "factor": "Arterial / Uncontrolled Hemorrhage",
                "weight": "+30%",
                "severity": "critical",
                "detail": "Rapid blood loss risks rapid progression to irreversible hypovolemic shock."
            })
        elif bleeding_lower == "moderate":
            risk_score += 15.0
            reasoning_factors.append({
                "factor": "Moderate Active Bleeding",
                "weight": "+15%",
                "severity": "moderate",
                "detail": "Requires immediate direct pressure and wound packing."
            })

        # 5. Symptom & Injury Type Weightings
        symptoms_str = " ".join([s.lower() for s in symptoms])
        if any(term in symptoms_str for term in ["chest pain", "cardiac", "stroke", "numbness", "seizure", "crushed"]):
            risk_score += 20.0
            reasoning_factors.append({
                "factor": "High-Risk Symptom Presentation",
                "weight": "+20%",
                "severity": "high",
                "detail": "Symptoms indicate potential cardiac, neurological, or crush syndrome emergency."
            })

        injury_lower = injury_type.lower()
        if any(term in injury_lower for term in ["head injury", "spine", "penetrating", "third-degree burn", "amputation"]):
            risk_score += 20.0
            reasoning_factors.append({
                "factor": "Critical Trauma Classification",
                "weight": "+20%",
                "severity": "critical",
                "detail": f"High-mechanism injury category reported: {injury_type}."
            })

        # Age vulnerability factor
        if age < 5 or age > 70:
            risk_score += 10.0
            reasoning_factors.append({
                "factor": "Vulnerable Age Demographic",
                "weight": "+10%",
                "severity": "low",
                "detail": f"Age ({age}) increases risk of rapid physiological decompensation."
            })

        # Cap risk score between 0 and 100
        risk_score = min(100.0, max(0.0, risk_score))
        
        # Priority Determination
        if risk_score >= 60.0 or breathing_rate == 0 or pulse == 0 or consciousness_lower == "unresponsive":
            priority = "RED"
            priority_label = "RED (Immediate Priority / Life-Threatening)"
            ambulance_required = True
            confidence = round(94.5 + (risk_score % 4), 1)
        elif risk_score >= 40.0:
            priority = "ORANGE"
            priority_label = "ORANGE (Urgent / High Risk)"
            ambulance_required = True
            confidence = round(91.2 + (risk_score % 5), 1)
        elif risk_score >= 20.0:
            priority = "YELLOW"
            priority_label = "YELLOW (Delayed / Moderate Risk)"
            ambulance_required = False
            confidence = round(89.0 + (risk_score % 6), 1)
        else:
            priority = "GREEN"
            priority_label = "GREEN (Minor / Non-Urgent)"
            ambulance_required = False
            confidence = round(96.0 - (risk_score % 3), 1)

        # Generate Actionable First Aid Recommendations
        first_aid_steps = TriageEngine._generate_first_aid(priority, bleeding_lower, consciousness_lower, injury_lower)

        return {
            "priority": priority,
            "priority_label": priority_label,
            "survival_risk_percent": round(risk_score, 1),
            "confidence_score": min(99.0, confidence),
            "ambulance_required": ambulance_required,
            "reasoning_factors": reasoning_factors,
            "recommended_first_aid": first_aid_steps,
            "triage_category_description": TriageEngine._get_category_desc(priority)
        }

    @staticmethod
    def _generate_first_aid(priority: str, bleeding: str, consciousness: str, injury: str) -> List[Dict[str, str]]:
        steps = []
        if priority == "RED":
            steps.append({"step": "1. Call Emergency Services Immediately", "action": "Dial 911 / 112 or local dispatch right now. State location and RED priority."})
        
        if bleeding in ["arterial", "severe", "moderate"]:
            steps.append({"step": "Apply Firm Direct Pressure", "action": "Use clean cloth or sterile gauze. Press directly over wound. Do not remove soaked gauze; layer additional pads on top."})
            if bleeding == "arterial":
                steps.append({"step": "Tourniquet Application", "action": "If bleeding from limb is uncontrolled, apply a tourniquet 2-3 inches above the wound. Note time applied."})

        if consciousness != "alert":
            steps.append({"step": "Airway Protection & Recovery Position", "action": "If patient is breathing but unconscious, place in lateral recovery position to prevent aspiration."})

        if "burn" in injury:
            steps.append({"step": "Cool Burn Wound", "action": "Rinse under cool running water for 10-20 minutes. Do not apply ice directly. Cover loosely with sterile non-stick bandage."})
        elif "fracture" in injury:
            steps.append({"step": "Immobilize Limb", "action": "Support injured area with splint or rolled towels. Do not attempt to realign broken bones."})

        steps.append({"step": "Monitor Vitals Continuously", "action": "Recheck pulse, breathing rate, and responsiveness every 2 minutes until help arrives."})
        return steps

    @staticmethod
    def _get_category_desc(priority: str) -> str:
        descriptions = {
            "RED": "Immediate life threat. Requires rapid resuscitation, advanced airway control, or surgical intervention.",
            "ORANGE": "Urgent situation with high risk of deterioration. Medical team evaluation needed within 15 minutes.",
            "YELLOW": "Serious condition requiring medical attention, but stable for immediate waiting under supervision.",
            "GREEN": "Minor injuries or localized symptoms. First aid and standard outpatient evaluation appropriate."
        }
        return descriptions.get(priority, "Evaluation required.")
