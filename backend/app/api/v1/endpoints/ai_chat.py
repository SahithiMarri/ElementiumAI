from fastapi import APIRouter
from app.models.schemas import ChatRequest, ChatResponse
from app.core.config import settings
import google.generativeai as genai
import logging
import os

logger = logging.getLogger(__name__)
router = APIRouter()

# Fallbacks in case Gemini API is not configured or fails
FALLBACK_GUIDANCE = {
    "IDLE": "Welcome to Elementium AI Virtual Chemistry Lab. Click 'Start Experiment' to begin.",
    "SETUP_APPARATUS": "First, setup your apparatus: drag the burette stand to the workbench, attach the burette, and place the conical flask.",
    "PREPARE_SAMPLE": "Pick the pipette, click the Hard Water bottle, and transfer 25 mL into the conical flask.",
    "ADD_BUFFER": "Add 2 mL of ammonia buffer (pH 10) to the flask to maintain the alkaline pH necessary for the reaction.",
    "ADD_INDICATOR": "Add 2-3 drops of Eriochrome Black T (EBT) indicator. Notice the solution turning wine red due to Ca²⁺/Mg²⁺-EBT complex formation.",
    "FILL_BURETTE": "Fill the burette with 0.01M standard EDTA solution up to the zero mark.",
    "PERFORM_TITRATION": "Open the stopcock slowly to dispense EDTA drops. Click and hold the flask to swirl continuously until the wine red color turns into permanent pure blue.",
    "ENDPOINT_REACHED": "Endpoint achieved! All hardness ions are complexed with EDTA and free EBT has turned the solution sharp blue.",
    "COMPLETED": "Congratulations! You have completed the hardness estimation experiment successfully."
}

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(payload: ChatRequest):
    api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")
    
    if api_key:
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            prompt = f"""
You are the AI Laboratory Assistant for 'Elementium AI', an interactive virtual chemistry lab.
Current Experiment: {payload.experiment}
Current Student Step: {payload.step}
Student Context/Question: {payload.context or 'What should I do in this step and what is the chemistry principle?'}

Provide a brief, encouraging, and scientifically accurate response (maximum 2 to 3 sentences).
Explain what to do next and briefly mention why (reaction or chemical role).
"""
            response = model.generate_content(prompt)
            if response and response.text:
                return ChatResponse(
                    message=response.text.strip(),
                    step=payload.step,
                    type="guidance"
                )
        except Exception as e:
            logger.warning(f"Gemini API request failed: {e}. Using fallback.")
            
    # Return context-aware fallback
    fallback_text = FALLBACK_GUIDANCE.get(
        payload.step,
        "Follow the laboratory steps carefully and observe the color transitions in your flask."
    )
    if payload.context:
        fallback_text = f"Regarding your question: {fallback_text}"
        
    return ChatResponse(
        message=fallback_text,
        step=payload.step,
        type="guidance"
    )
