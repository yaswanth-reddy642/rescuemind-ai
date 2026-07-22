from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from app.services.audio_engine import AudioEngine

router = APIRouter(prefix="/api/audio", tags=["Voice Emergency"])

class TextSpeechRequest(BaseModel):
    transcript: str

@router.post("/process-text")
async def process_transcript_text(request: TextSpeechRequest):
    try:
        result = AudioEngine.process_speech(request.transcript)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Speech processing error: {str(e)}"
        )

@router.post("/process-file")
async def process_audio_file(file: UploadFile = File(...), prompt_text: Optional[str] = Form(None)):
    try:
        contents = await file.read()
        # Simulated Whisper STT on uploaded audio stream
        transcript = prompt_text if prompt_text else "Patient reports severe chest pain and difficulty breathing after falling down stairs."
        result = AudioEngine.process_speech(transcript)
        return {"success": True, "audio_filename": file.filename, "data": result}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Audio file extraction error: {str(e)}"
        )
