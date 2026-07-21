import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.triage_engine import TriageEngine
from app.services.vision_engine import VisionEngine
from app.services.audio_engine import AudioEngine
import numpy as np
from PIL import Image
import io

def test_triage_critical():
    result = TriageEngine.evaluate(
        age=45,
        gender="Male",
        symptoms=["chest pain", "dizziness"],
        injury_type="Head Injury",
        pulse=145,
        breathing_rate=34,
        consciousness="unresponsive",
        bleeding_level="arterial"
    )
    assert result["priority"] == "RED"
    assert result["survival_risk_percent"] > 60.0
    assert result["ambulance_required"] is True
    assert len(result["reasoning_factors"]) > 0

def test_triage_minor():
    result = TriageEngine.evaluate(
        age=25,
        gender="Female",
        symptoms=["minor scrape"],
        injury_type="Abrasion",
        pulse=72,
        breathing_rate=16,
        consciousness="alert",
        bleeding_level="mild"
    )
    assert result["priority"] == "GREEN"
    assert result["survival_risk_percent"] < 20.0

def test_vision_engine_synthetic_image():
    # Create synthetic RGB image with red box for bleeding test
    img_np = np.zeros((300, 300, 3), dtype=np.uint8)
    img_np[50:150, 50:150] = [255, 0, 0] # Red box
    
    pil_img = Image.fromarray(img_np)
    buf = io.BytesIO()
    pil_img.save(buf, format="JPEG")
    
    result = VisionEngine.analyze_image_bytes(buf.getvalue())
    
    assert "primary_injury" in result
    assert "annotated_image_url" in result
    assert result["annotated_image_url"].startswith("data:image/jpeg;base64,")

def test_audio_engine_symptom_extraction():
    result = AudioEngine.process_speech("Help! Patient is choking and has severe chest pain, pulse is 130")
    assert "choking" in result["extracted_symptoms"]
    assert "chest pain" in result["extracted_symptoms"]
    assert result["detected_pulse"] == 130
    assert result["urgency_level"] == "CRITICAL"
