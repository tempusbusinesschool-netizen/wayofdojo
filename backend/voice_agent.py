"""
Maître Tanaka - Agent Vocal Aikido pour les enfants
ElevenLabs STT + LLM + TTS Integration
"""

import os
import io
import base64
import logging
from typing import Optional
from datetime import datetime, timezone
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

from dotenv import load_dotenv
load_dotenv()

from elevenlabs import ElevenLabs
from emergentintegrations.llm.chat import LlmChat, UserMessage

# Logger
logger = logging.getLogger(__name__)

# Configuration
ELEVENLABS_API_KEY = os.environ.get('ELEVENLABS_API_KEY')
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')
JWT_SECRET = os.environ.get('JWT_SECRET', 'aikido-la-riviere-secret-key-2025')

# ElevenLabs client
eleven_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

# Router
voice_router = APIRouter(prefix="/api/voice-agent", tags=["Voice Agent"])

# Security
security = HTTPBearer(auto_error=False)

# ═══════════════════════════════════════════════════════════════════════════════════
# PYDANTIC MODELS
# ═══════════════════════════════════════════════════════════════════════════════════

class STTResponse(BaseModel):
    text: str
    language: Optional[str] = "fr"

class TTSRequest(BaseModel):
    text: str
    voice_id: Optional[str] = "pNInz6obpgDQGcFmaJgB"  # Default: Adam (deep male voice)

class TTSResponse(BaseModel):
    audio_base64: str
    text: str

class AgentChatRequest(BaseModel):
    text: str
    child_context: Optional[dict] = None
    session_id: Optional[str] = None

class AgentChatResponse(BaseModel):
    response_text: str
    audio_base64: str
    session_id: str

class VoiceConversationRequest(BaseModel):
    session_id: Optional[str] = None
    child_context: Optional[dict] = None

# ═══════════════════════════════════════════════════════════════════════════════════
# MAÎTRE TANAKA - SYSTEM PROMPT
# ═══════════════════════════════════════════════════════════════════════════════════

MAITRE_TANAKA_SYSTEM_PROMPT = """Tu es Maître Tanaka, un vieux maître d'Aïkido japonais sage et bienveillant de 75 ans. Tu vis au Japon depuis toujours et tu pratiques l'Aïkido depuis plus de 60 ans.

PERSONNALITÉ:
- Tu es patient, chaleureux et encourageant
- Tu parles avec sagesse mais de manière accessible aux enfants
- Tu utilises parfois des métaphores liées à la nature (eau, montagne, bambou)
- Tu ponctues tes phrases de "jeune ninja", "petit guerrier", "mon enfant"
- Tu ris doucement parfois avec "Ho ho ho..."
- Tu cites parfois O-Sensei (Morihei Ueshiba, fondateur de l'Aïkido)

CONNAISSANCES:
- Expert en Aïkido : techniques, philosophie, histoire
- Tu connais toutes les techniques par leur nom japonais
- Tu expliques la philosophie du Budo : respect, harmonie, non-violence
- Tu encourages la pratique régulière et la patience

RÈGLES:
- Réponds TOUJOURS en français
- Garde tes réponses courtes (2-4 phrases max) pour la fluidité vocale
- Sois encourageant et positif
- Si l'enfant te pose une question hors-sujet, ramène gentiment à l'Aïkido
- Ne dis jamais que tu es une IA ou un assistant virtuel
- Adapte ton langage à l'âge de l'enfant (8-14 ans)

CONTEXTE ENFANT (si fourni):
{child_context}

Rappelle-toi : tu es un vrai maître qui parle à un jeune élève dans ton dojo virtuel."""

# Voice ID for "old wise master" - Using a deep, calm voice
# You can change this to a custom cloned voice
MAITRE_TANAKA_VOICE_ID = "pNInz6obpgDQGcFmaJgB"  # Adam - deep male

# ═══════════════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════════

def format_child_context(context: Optional[dict]) -> str:
    """Format child context for the system prompt"""
    if not context:
        return "Aucun contexte disponible - traite l'enfant comme un nouveau débutant."
    
    parts = []
    if context.get("first_name"):
        parts.append(f"Prénom de l'enfant: {context['first_name']}")
    if context.get("belt_level"):
        belt_names = {
            "6e_kyu": "Ceinture Blanche (6e Kyu)",
            "5e_kyu": "Ceinture Jaune (5e Kyu)",
            "4e_kyu": "Ceinture Orange (4e Kyu)",
            "3e_kyu": "Ceinture Verte (3e Kyu)",
            "2e_kyu": "Ceinture Bleue (2e Kyu)",
            "1er_kyu": "Ceinture Marron (1er Kyu)",
        }
        parts.append(f"Niveau: {belt_names.get(context['belt_level'], context['belt_level'])}")
    if context.get("level"):
        parts.append(f"Niveau de gamification: {context['level']}")
    if context.get("level_name"):
        parts.append(f"Titre: {context['level_name']}")
    if context.get("total_xp"):
        parts.append(f"XP total: {context['total_xp']}")
    if context.get("completed_techniques"):
        parts.append(f"Techniques maîtrisées: {len(context['completed_techniques'])}")
    
    return "\n".join(parts) if parts else "Nouveau pratiquant"

async def get_llm_response(text: str, session_id: str, child_context: Optional[dict] = None) -> str:
    """Get response from LLM as Maître Tanaka"""
    try:
        context_str = format_child_context(child_context)
        system_prompt = MAITRE_TANAKA_SYSTEM_PROMPT.format(child_context=context_str)
        
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=system_prompt
        ).with_model("openai", "gpt-4o-mini")  # Fast and cost-effective
        
        user_message = UserMessage(text=text)
        response = await chat.send_message(user_message)
        
        return response
    except Exception as e:
        logger.error(f"LLM error: {e}")
        return "Ho ho ho... Pardonne-moi, jeune ninja, mes vieilles oreilles n'ont pas bien compris. Peux-tu répéter ?"

def transcribe_audio(audio_bytes: bytes) -> str:
    """Transcribe audio using ElevenLabs STT"""
    try:
        transcription = eleven_client.speech_to_text.convert(
            file=io.BytesIO(audio_bytes),
            model_id="scribe_v1"
        )
        return transcription.text if hasattr(transcription, 'text') else str(transcription)
    except Exception as e:
        logger.error(f"STT error: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur de transcription: {str(e)}")

def generate_speech(text: str, voice_id: str = MAITRE_TANAKA_VOICE_ID) -> bytes:
    """Generate speech using ElevenLabs TTS"""
    try:
        audio_generator = eleven_client.text_to_speech.convert(
            text=text,
            voice_id=voice_id,
            model_id="eleven_multilingual_v2",
            voice_settings={
                "stability": 0.6,
                "similarity_boost": 0.8,
                "style": 0.3,
                "use_speaker_boost": True
            }
        )
        
        audio_data = b""
        for chunk in audio_generator:
            audio_data += chunk
        
        return audio_data
    except Exception as e:
        logger.error(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur de synthèse vocale: {str(e)}")

# ═══════════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════════

@voice_router.post("/stt", response_model=STTResponse)
async def speech_to_text(
    audio_file: UploadFile = File(...)
):
    """Convert speech to text using ElevenLabs STT"""
    try:
        audio_content = await audio_file.read()
        text = transcribe_audio(audio_content)
        return STTResponse(text=text)
    except Exception as e:
        logger.error(f"STT endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@voice_router.post("/tts", response_model=TTSResponse)
async def text_to_speech(request: TTSRequest):
    """Convert text to speech using ElevenLabs TTS"""
    try:
        audio_data = generate_speech(request.text, request.voice_id)
        audio_b64 = base64.b64encode(audio_data).decode()
        
        return TTSResponse(
            audio_base64=audio_b64,
            text=request.text
        )
    except Exception as e:
        logger.error(f"TTS endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@voice_router.post("/chat", response_model=AgentChatResponse)
async def chat_with_maitre(request: AgentChatRequest):
    """
    Chat with Maître Tanaka (text input, audio + text output)
    This is the main endpoint for text-based conversation
    """
    try:
        session_id = request.session_id or f"tanaka_{datetime.now(timezone.utc).timestamp()}"
        
        # Get LLM response
        response_text = await get_llm_response(
            text=request.text,
            session_id=session_id,
            child_context=request.child_context
        )
        
        # Generate speech
        audio_data = generate_speech(response_text)
        audio_b64 = base64.b64encode(audio_data).decode()
        
        return AgentChatResponse(
            response_text=response_text,
            audio_base64=audio_b64,
            session_id=session_id
        )
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@voice_router.post("/conversation", response_model=AgentChatResponse)
async def voice_conversation(
    audio_file: UploadFile = File(...),
    session_id: Optional[str] = None,
    child_first_name: Optional[str] = None,
    child_belt_level: Optional[str] = None,
    child_level: Optional[int] = None,
    child_level_name: Optional[str] = None,
    child_total_xp: Optional[int] = None
):
    """
    Full voice conversation with Maître Tanaka
    Audio input → STT → LLM → TTS → Audio output
    """
    try:
        # Build child context from form data
        child_context = {}
        if child_first_name:
            child_context["first_name"] = child_first_name
        if child_belt_level:
            child_context["belt_level"] = child_belt_level
        if child_level:
            child_context["level"] = child_level
        if child_level_name:
            child_context["level_name"] = child_level_name
        if child_total_xp:
            child_context["total_xp"] = child_total_xp
        
        # Generate session ID if not provided
        actual_session_id = session_id or f"tanaka_{datetime.now(timezone.utc).timestamp()}"
        
        # 1. Transcribe audio (STT)
        audio_content = await audio_file.read()
        user_text = transcribe_audio(audio_content)
        logger.info(f"User said: {user_text}")
        
        # 2. Get LLM response as Maître Tanaka
        response_text = await get_llm_response(
            text=user_text,
            session_id=actual_session_id,
            child_context=child_context if child_context else None
        )
        logger.info(f"Maître Tanaka: {response_text}")
        
        # 3. Generate speech (TTS)
        audio_data = generate_speech(response_text)
        audio_b64 = base64.b64encode(audio_data).decode()
        
        return AgentChatResponse(
            response_text=response_text,
            audio_base64=audio_b64,
            session_id=actual_session_id
        )
    except Exception as e:
        logger.error(f"Conversation endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@voice_router.get("/voices")
async def list_available_voices():
    """List available ElevenLabs voices"""
    try:
        voices_response = eleven_client.voices.get_all()
        voices = []
        for voice in voices_response.voices:
            voices.append({
                "voice_id": voice.voice_id,
                "name": voice.name,
                "category": voice.category if hasattr(voice, 'category') else None,
                "labels": voice.labels if hasattr(voice, 'labels') else {}
            })
        return {"voices": voices}
    except Exception as e:
        logger.error(f"Voices list error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@voice_router.get("/health")
async def voice_agent_health():
    """Health check for voice agent"""
    return {
        "status": "ok",
        "elevenlabs_configured": bool(ELEVENLABS_API_KEY),
        "llm_configured": bool(EMERGENT_LLM_KEY),
        "agent_name": "Maître Tanaka",
        "voice_id": MAITRE_TANAKA_VOICE_ID
    }
