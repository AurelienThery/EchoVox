from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx
import os
from .services.text_simplifier import TextSimplifier
from .services.pictogram_service import PictogramService

app = FastAPI(title="EchoVox Simplification Service")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
text_simplifier = TextSimplifier()
pictogram_service = PictogramService()


class SimplificationRequest(BaseModel):
    text: str
    locale: str = "en"


class SimplificationResponse(BaseModel):
    original_text: str
    simplified_text: str
    pictograms: List[dict]


class PictogramRequest(BaseModel):
    keywords: List[str]
    locale: str = "en"


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "python-simplification"}


@app.post("/simplify", response_model=SimplificationResponse)
async def simplify_text(request: SimplificationRequest):
    """
    Simplify text to FALC (Facile À Lire et à Comprendre) format
    and fetch corresponding pictograms from ARASAAC
    """
    try:
        # Simplify the text using LangChain
        simplified = await text_simplifier.simplify(request.text)
        
        # Extract keywords for pictograms
        keywords = await text_simplifier.extract_keywords(simplified)
        
        # Fetch pictograms from ARASAAC
        pictograms = await pictogram_service.fetch_pictograms(keywords, request.locale)
        
        return SimplificationResponse(
            original_text=request.text,
            simplified_text=simplified,
            pictograms=pictograms
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simplification failed: {str(e)}")


@app.post("/pictograms")
async def get_pictograms(request: PictogramRequest):
    """
    Fetch pictograms for given keywords from ARASAAC API
    """
    try:
        pictograms = await pictogram_service.fetch_pictograms(request.keywords, request.locale)
        return {"pictograms": pictograms}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch pictograms: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
