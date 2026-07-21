# RescueMind AI – Offline Emergency Triage & Disaster Response Assistant

RescueMind AI is a production-ready, AI-driven emergency decision engine and disaster response assistant. Built for hackathon demonstration and real-world emergency deployment, it provides instant clinical triage prediction, computer vision injury analysis, speech-to-text symptom extraction, interactive disaster survival protocols, hospital finder maps, emergency PDF intake report generation, and 1-click multi-contact SOS dispatching.

---

## Key Features & Modules

1. **AI Emergency Assessment Module**:
   - Multi-step clinical intake analyzing age, gender, pulse, respiration rate, consciousness (AVPU), bleeding severity, and symptoms.
   - Calculates **Emergency Priority (RED, ORANGE, YELLOW, GREEN)**, survival risk percentage, confidence score, and feature-importance explainable reasoning.

2. **Injury Image Analyzer**:
   - OpenCV & PyTorch computer vision engine for detecting burns, open wounds, active hemorrhage, fractures, and swelling.
   - Outputs annotated image overlays with bounding boxes, confidence tags, and targeted first aid instructions.

3. **Voice Emergency Assistant**:
   - Microphone voice recorder with audio visualizer, Whisper Speech-to-Text transcript processing, and automated symptom extraction.
   - Generates speech guidance with interactive text-to-speech audio playback.

4. **Disaster Survival Assistant**:
   - Actionable protocols and interactive checklists for **Flood, Earthquake, Fire, and Cyclone**.
   - Caches emergency steps locally for zero-connectivity scenarios.

5. **Offline AI ONNX Mode**:
   - Client-side ONNX/JS rule-engine fallback allowing core triage and emergency report generation to function completely offline without internet connection.

6. **Hospital & Emergency Trauma Finder**:
   - Geolocation-powered finder displaying nearby level-1 trauma hospitals, ER wait times, direct telephone hotlines, and turn-by-turn map directions.

7. **Emergency PDF Generator**:
   - Instant downloadable medical intake report formatted for paramedics with patient vitals, GPS coordinates, QR code, and AI assessment findings.

8. **SOS Alert Module**:
   - 1-click distress alert dispatching GPS coordinates and medical summary to saved emergency contacts via SMS / Push payload.

9. **Analytics Dashboard**:
   - Recharts-powered metrics displaying total triage volume, critical case proportions, AI confidence distributions, and 6-month emergency trends.

---

## Technology Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Recharts, jsPDF, Leaflet, ONNX Runtime Web, Lucide Icons
- **Backend**: FastAPI (Python), PyTorch, OpenCV, NumPy, Pydantic, PyJWT
- **Database / Auth**: Supabase / PostgreSQL schema included (`backend/app/db/schema.sql`)
- **Containerization**: Docker & Docker Compose

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- Docker & Docker Compose (Optional)

### Option 1: Running Locally

#### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
FastAPI documentation will be available at `http://localhost:8000/docs`.

#### 2. Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

### Option 2: Running with Docker Compose

```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

---

## Testing

Run backend pytest unit tests:
```bash
cd backend
pytest tests/
```
