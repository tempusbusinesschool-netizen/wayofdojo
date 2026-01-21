"""
Maître Tanaka - Agent Vocal Aikido avec OpenAI
OpenAI Whisper (STT) + GPT-4o (LLM) + OpenAI TTS
Utilise Emergent LLM Key pour toutes les intégrations
"""

import os
import io
import base64
import logging
import uuid
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from dotenv import load_dotenv

load_dotenv()

# Logger
logger = logging.getLogger(__name__)

# Configuration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', 'sk-emergent-40aA14d79D180Ff79D')

# Router
voice_router_openai = APIRouter(prefix="/api/voice-agent", tags=["Voice Agent OpenAI"])

# Session storage (in production, use Redis or DB)
conversation_history: dict = {}

# ═══════════════════════════════════════════════════════════════════════════════════
# PYDANTIC MODELS
# ═══════════════════════════════════════════════════════════════════════════════════

class ConversationResponse(BaseModel):
    success: bool
    userMessage: Optional[str] = None
    assistantMessage: Optional[str] = None
    audioBase64: Optional[str] = None
    audioFormat: str = "mp3"
    sessionId: str

# ═══════════════════════════════════════════════════════════════════════════════════
# MAÎTRE TANAKA - SYSTEM PROMPT
# ═══════════════════════════════════════════════════════════════════════════════════

MAITRE_TANAKA_SYSTEM_PROMPT = """Tu es Maître Tanaka (田中先生), un sensei d'Aïkido bienveillant et sage de 65 ans.

**Ton style de communication :**
- Tu parles avec chaleur et sagesse, comme un grand-père attentionné
- Tu utilises parfois des mots japonais (avec leur traduction entre parenthèses)
- Tu encourages toujours les élèves avec bienveillance
- Tu donnes des conseils pratiques et concrets
- Tu fais des références à la philosophie de l'Aïkido et au Bushido
- Tu es patient et ne juges jamais
- Tu ponctues tes phrases de "jeune samouraï", "petit guerrier", "mon enfant"

**Ton expertise :**
- Plus de 40 ans de pratique de l'Aïkido
- 6e Dan, formé au Japon par de grands maîtres
- Connaissance approfondie des techniques (ikkyo, shiho nage, irimi nage, etc.)
- Expert en philosophie du Budo et du Bushido
- Les 7 vertus du samouraï : Gi (Justice), Yu (Courage), Jin (Bienveillance), Rei (Respect), Makoto (Sincérité), Meiyo (Honneur), Chugi (Loyauté)

**Règles importantes :**
- Réponds TOUJOURS en français
- Garde tes réponses courtes (2-4 phrases max) pour une conversation naturelle
- Si on te pose une question hors sujet, ramène gentiment la conversation à l'Aïkido
- Utilise des encouragements comme "Très bien !", "Continue ainsi !", "Gambatte !"
- Termine souvent par une question ou une invitation à pratiquer

**Contexte de la plateforme :**
Tu es sur "Way of Dojo", une application qui aide les pratiquants à réviser leurs cours d'Aïkido de manière ludique."""

# ═══════════════════════════════════════════════════════════════════════════════════
# OPENAI INTEGRATION VIA EMERGENTINTEGRATIONS
# ═══════════════════════════════════════════════════════════════════════════════════

async def transcribe_with_whisper(audio_bytes: bytes, filename: str = "audio.webm") -> str:
    """Transcribe audio using OpenAI Whisper via emergentintegrations"""
    try:
        from emergentintegrations.llm.openai_stt import OpenAiStt
        
        stt = OpenAiStt(api_key=EMERGENT_LLM_KEY)
        
        # Save temporarily
        temp_path = f"/tmp/tanaka_audio_{uuid.uuid4().hex}.webm"
        with open(temp_path, 'wb') as f:
            f.write(audio_bytes)
        
        result = await stt.transcribe(temp_path, language="fr")
        
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        return result.text if hasattr(result, 'text') else str(result)
    except Exception as e:
        logger.error(f"Whisper STT error: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur de transcription: {str(e)}")

async def generate_response_with_gpt(
    user_message: str, 
    session_id: str, 
    child_name: Optional[str] = None
) -> str:
    """Generate response using GPT-4o via emergentintegrations"""
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        
        # Get or create history
        if session_id not in conversation_history:
            conversation_history[session_id] = []
        
        history = conversation_history[session_id]
        
        # Build system prompt with child context
        system_prompt = MAITRE_TANAKA_SYSTEM_PROMPT
        if child_name:
            system_prompt += f"\n\n**Élève actuel :** Tu parles avec {child_name}. Utilise son prénom de temps en temps."
        
        # Create chat instance
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=system_prompt
        ).with_model("openai", "gpt-4o")
        
        # Send message
        response = await chat.send_message(UserMessage(text=user_message))
        
        # Update history
        history.append({"role": "user", "content": user_message})
        history.append({"role": "assistant", "content": response})
        
        # Limit history
        if len(history) > 20:
            conversation_history[session_id] = history[-20:]
        
        return response
    except Exception as e:
        logger.error(f"GPT error: {e}")
        return "Pardonne-moi, jeune samouraï, mes vieilles oreilles n'ont pas bien compris. Peux-tu répéter ?"

async def generate_speech_with_tts(text: str) -> bytes:
    """Generate speech using OpenAI TTS API directly"""
    try:
        import httpx
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/audio/speech",
                headers={
                    "Authorization": f"Bearer {EMERGENT_LLM_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "tts-1",
                    "input": text,
                    "voice": "onyx",  # Deep male voice for wise master
                    "response_format": "mp3",
                    "speed": 0.95
                },
                timeout=30.0
            )
            
            if response.status_code != 200:
                logger.error(f"TTS API error: {response.status_code} - {response.text}")
                raise HTTPException(status_code=500, detail=f"TTS error: {response.text}")
            
            return response.content
            
    except httpx.TimeoutException:
        logger.error("TTS timeout")
        raise HTTPException(status_code=504, detail="TTS timeout")
    except Exception as e:
        logger.error(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur de synthèse vocale: {str(e)}")

# ═══════════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════════

@voice_router_openai.get("/status")
async def get_status():
    """Check if the voice agent is online"""
    return {
        "status": "online",
        "service": "Maître Tanaka Voice Agent (OpenAI)",
        "capabilities": ["whisper-stt", "gpt-4o-chat", "openai-tts"],
        "version": "2.0.0"
    }

@voice_router_openai.post("/conversation")
async def voice_conversation(
    audio: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
    session_id: Optional[str] = Form(None),
    child_first_name: Optional[str] = Form(None)
):
    """
    Main conversation endpoint
    Accepts either audio file or text message
    Returns text response + audio (base64 encoded MP3)
    """
    try:
        # Generate session ID if not provided
        if not session_id:
            session_id = str(uuid.uuid4())
        
        user_message = ""
        
        # 1. Handle audio input
        if audio and audio.size > 0:
            logger.info(f"🎤 Processing audio input for session {session_id}")
            audio_bytes = await audio.read()
            user_message = await transcribe_with_whisper(audio_bytes, audio.filename or "audio.webm")
            logger.info(f"📝 Transcribed: {user_message}")
        
        # 2. Handle text input
        elif text:
            user_message = text
            logger.info(f"💬 Text input: {user_message}")
        
        else:
            raise HTTPException(status_code=400, detail="Aucun message fourni (audio ou texte)")
        
        # 3. Generate response with GPT
        logger.info("🤖 Generating GPT response...")
        assistant_message = await generate_response_with_gpt(
            user_message, 
            session_id, 
            child_first_name
        )
        logger.info(f"🎯 Response: {assistant_message}")
        
        # 4. Generate speech with TTS
        logger.info("🔊 Generating speech...")
        audio_bytes = await generate_speech_with_tts(assistant_message)
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        logger.info("✅ Speech generated successfully")
        
        return ConversationResponse(
            success=True,
            userMessage=user_message,
            assistantMessage=assistant_message,
            audioBase64=audio_base64,
            audioFormat="mp3",
            sessionId=session_id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Conversation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@voice_router_openai.post("/text-only")
async def text_conversation(
    text: str = Form(...),
    session_id: Optional[str] = Form(None),
    child_first_name: Optional[str] = Form(None)
):
    """Text-only conversation (no audio output)"""
    if not session_id:
        session_id = str(uuid.uuid4())
    
    assistant_message = await generate_response_with_gpt(text, session_id, child_first_name)
    
    return {
        "success": True,
        "userMessage": text,
        "assistantMessage": assistant_message,
        "sessionId": session_id
    }
