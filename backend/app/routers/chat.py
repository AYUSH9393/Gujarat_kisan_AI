# backend/app/routers/chat.py
# Updated with proper language handling

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Configure with correct model
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('models/gemini-2.5-flash')

class QuestionRequest(BaseModel):
    question: str
    language: str = "auto"  # auto, gujarati, english

class AnswerResponse(BaseModel):
    answer: str
    question: str
    language: str

@router.post("/ask", response_model=AnswerResponse)
async def ask_question(request: QuestionRequest):
    """
    Handle farmer's questions and return AI-generated answers
    Language detection: Responds in the same language as the question
    """
    try:
        # Create language-specific system prompt
        if request.language == "gujarati":
            language_instruction = """
            IMPORTANT: The farmer asked in GUJARATI language.
            You MUST respond ONLY in GUJARATI (ગુજરાતી).
            Do NOT use English in your response.
            """
        elif request.language == "english":
            language_instruction = """
            IMPORTANT: The farmer asked in ENGLISH language.
            You MUST respond ONLY in ENGLISH.
            Do NOT use Gujarati in your response.
            """
        else:
            language_instruction = """
            Detect the language of the question and respond in the SAME language.
            If question is in Gujarati, respond in Gujarati.
            If question is in English, respond in English.
            """
        
        system_prompt = f"""{language_instruction}

You are an expert agricultural assistant for Gujarat, India.

Your expertise:
- Gujarat crops: Cotton (કપાસ), Groundnut (મગફળી), Wheat (ઘઉં), Bajra (બાજરી), Castor (એરંડા), Cumin (જીરું)
- Crop diseases and pest management
- Market prices and trends from Gujarat mandis
- Weather-based farming advice
- Government schemes for Gujarat farmers (PM-KISAN, Soil Health Card, etc.)
- Organic farming and sustainable practices
- Irrigation and water management

Guidelines:
- Be practical and give actionable advice
- Use simple, farmer-friendly language
- Provide step-by-step solutions when needed
- Include local Gujarat context (monsoon timing, soil types, etc.)
- If you don't know something, say so honestly
- Focus on affordable and accessible solutions

REMEMBER: Match the language of your response to the question's language!
"""
        
        # Combine system prompt with user question
        full_prompt = f"{system_prompt}\n\nFarmer's Question: {request.question}\n\nYour Answer:"
        
        # Generate response
        response = model.generate_content(full_prompt)
        
        # Return structured response
        return AnswerResponse(
            answer=response.text,
            question=request.question,
            language=request.language
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")

@router.get("/health")
async def health_check():
    """Check if AI service is working"""
    try:
        test_response = model.generate_content("Hello")
        return {
            "status": "healthy",
            "ai_service": "connected",
            "model": "gemini-2.5-flash"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }