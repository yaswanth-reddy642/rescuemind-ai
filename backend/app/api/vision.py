from fastapi import APIRouter, UploadFile, File, HTTPException, Status
from app.services.vision_engine import VisionEngine

router = APIRouter(prefix="/api/vision", tags=["Vision Analysis"])

@router.post("/analyze")
async def analyze_injury_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=Status.HTTP_400_BAD_REQUEST,
            detail="File provided must be a valid image format (JPEG, PNG, WEBP)."
        )
    
    try:
        contents = await file.read()
        analysis = VisionEngine.analyze_image_bytes(contents)
        return {"success": True, "filename": file.filename, "data": analysis}
    except Exception as e:
        raise HTTPException(
            status_code=Status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Vision processing error: {str(e)}"
        )
