"""
🥋 Maître Tanaka - Agent Vocal Conversationnel
OpenAI Whisper (STT) + GPT-4o (LLM) + ElevenLabs "Adam" TTS (same voice as pre-recorded phrases)
Utilise Emergent LLM Key pour Whisper+GPT et ELEVENLABS_API_KEY pour la voix
"""

import os
import base64
import logging
import uuid
import tempfile
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from dotenv import load_dotenv

load_dotenv()

# Logger
logger = logging.getLogger(__name__)

# Configuration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')
ELEVENLABS_API_KEY = os.environ.get('ELEVENLABS_API_KEY')
# Voice ID "Adam" - deep male voice - MUST match generate_tanaka_phrases.py for consistency
TANAKA_VOICE_ID = "pNInz6obpgDQGcFmaJgB"

# Router - prefix /api/voice-agent pour le routing K8s
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
        from emergentintegrations.llm.openai import OpenAISpeechToText
        
        stt = OpenAISpeechToText(api_key=EMERGENT_LLM_KEY)
        
        # Save to temp file
        suffix = ".webm" if "webm" in filename.lower() else ".mp3"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            temp_file.write(audio_bytes)
            temp_path = temp_file.name
        
        try:
            # Transcribe using the library
            with open(temp_path, 'rb') as audio_file:
                result = await stt.transcribe(
                    file=audio_file,
                    model="whisper-1",
                    language="fr",
                    response_format="json"
                )
            
            # Extract text from result
            if hasattr(result, 'text'):
                return result.text
            elif isinstance(result, dict) and 'text' in result:
                return result['text']
            else:
                return str(result)
        finally:
            # Cleanup temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)
            
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
    """
    Generate speech using ElevenLabs 'Adam' voice — the SAME voice used to
    generate the pre-recorded MP3 phrases (welcome.mp3, etc.), ensuring the
    user hears a consistent 'wise old sage' voice across the whole app.
    """
    if not ELEVENLABS_API_KEY:
        raise HTTPException(status_code=500, detail="ELEVENLABS_API_KEY missing")
    try:
        from elevenlabs import ElevenLabs

        client = ElevenLabs(api_key=ELEVENLABS_API_KEY)
        audio_generator = client.text_to_speech.convert(
            text=text,
            voice_id=TANAKA_VOICE_ID,
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128",
            voice_settings={
                "stability": 0.6,
                "similarity_boost": 0.8,
                "style": 0.3,
                "use_speaker_boost": True,
            },
        )

        audio_bytes = b""
        for chunk in audio_generator:
            if chunk:
                audio_bytes += chunk

        return audio_bytes

    except HTTPException:
        raise
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
        "capabilities": ["whisper-stt", "gpt-4o-chat", "elevenlabs-tts-adam"],
        "version": "2.0.0",
        "key_configured": bool(EMERGENT_LLM_KEY)
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
        if not EMERGENT_LLM_KEY:
            raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY non configurée")
        
        # Generate session ID if not provided
        if not session_id:
            session_id = str(uuid.uuid4())
        
        user_message = ""
        
        # 1. Handle audio input
        if audio and audio.size and audio.size > 0:
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
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY non configurée")
    
    if not session_id:
        session_id = str(uuid.uuid4())
    
    assistant_message = await generate_response_with_gpt(text, session_id, child_first_name)
    
    return {
        "success": True,
        "userMessage": text,
        "assistantMessage": assistant_message,
        "sessionId": session_id
    }


# ═══════════════════════════════════════════════════════════════════════════════════
# TEST VOIX TANAKA - ÉCHANTILLONS
# ═══════════════════════════════════════════════════════════════════════════════════

# Phrase de test pour Maître Tanaka
TANAKA_TEST_PHRASE = "Bienvenue, jeune samouraï ! Je suis Maître Tanaka, ton guide sur la voie de l'Aïkido. Gambatte ! Ensemble, nous allons découvrir les secrets du Budo."

AVAILABLE_VOICES = [
    {"id": "alloy", "name": "Alloy", "description": "Neutre, équilibrée"},
    {"id": "ash", "name": "Ash", "description": "Claire, articulée"},
    {"id": "coral", "name": "Coral", "description": "Chaleureuse, amicale"},
    {"id": "echo", "name": "Echo", "description": "Douce, calme"},
    {"id": "fable", "name": "Fable", "description": "Expressive, conteuse"},
    {"id": "nova", "name": "Nova", "description": "Énergique, dynamique"},
    {"id": "onyx", "name": "Onyx", "description": "Profonde, autoritaire", "recommended": True},
    {"id": "sage", "name": "Sage", "description": "Sage, mesurée", "recommended": True},
    {"id": "shimmer", "name": "Shimmer", "description": "Brillante, joyeuse"},
]


@voice_router_openai.get("/voices")
async def list_voices():
    """Liste des voix disponibles pour Tanaka"""
    return {
        "voices": AVAILABLE_VOICES,
        "testPhrase": TANAKA_TEST_PHRASE,
        "recommendation": "onyx ou sage pour un sensei",
        "currentVoice": "onyx"
    }


@voice_router_openai.post("/tts")
async def text_to_speech(
    text: str = Form(...)
):
    """
    Simple TTS endpoint - génère un audio pour un texte donné
    Utilise la voix ElevenLabs "Adam" (même voix que Maître Tanaka)
    """
    if not ELEVENLABS_API_KEY:
        raise HTTPException(status_code=500, detail="ELEVENLABS_API_KEY manquante")
    
    try:
        audio_bytes = await generate_speech_with_tts(text)
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        
        return {
            "success": True,
            "text": text,
            "audioBase64": audio_base64,
            "audioFormat": "mp3"
        }
    except Exception as e:
        logger.error(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur TTS: {str(e)}")


@voice_router_openai.post("/test-voice")
async def test_voice(
    voice: str = Form("onyx"),
    text: Optional[str] = Form(None),
    speed: float = Form(0.95)
):
    """
    Génère un échantillon audio avec une voix spécifique
    Pour tester quelle voix convient le mieux à Tanaka
    """
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY non configurée")
    
    # Valider la voix
    valid_voices = [v["id"] for v in AVAILABLE_VOICES]
    if voice not in valid_voices:
        raise HTTPException(status_code=400, detail=f"Voix invalide. Choix: {valid_voices}")
    
    # Utiliser la phrase de test par défaut si non fournie
    test_text = text or TANAKA_TEST_PHRASE
    
    try:
        from emergentintegrations.llm.openai import OpenAITextToSpeech
        
        tts = OpenAITextToSpeech(api_key=EMERGENT_LLM_KEY)
        
        # Générer l'audio avec la voix demandée
        audio_bytes = await tts.generate_speech(
            text=test_text,
            model="tts-1",
            voice=voice,
            speed=speed,
            response_format="mp3"
        )
        
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        
        voice_info = next((v for v in AVAILABLE_VOICES if v["id"] == voice), None)
        
        return {
            "success": True,
            "voice": voice,
            "voiceName": voice_info["name"] if voice_info else voice,
            "voiceDescription": voice_info["description"] if voice_info else "",
            "text": test_text,
            "speed": speed,
            "audioBase64": audio_base64,
            "audioFormat": "mp3"
        }
        
    except Exception as e:
        logger.error(f"Test voice error: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur de génération audio: {str(e)}")
