/**
 * 🎙️ VOICE AGENT API - Maître Tanaka Conversational AI
 * 
 * Cette API gère la conversation vocale avec Maître Tanaka :
 * 1. Reçoit l'audio de l'utilisateur (WebM/MP3)
 * 2. Transcrit avec OpenAI Whisper
 * 3. Génère une réponse avec GPT-4o
 * 4. Convertit en audio avec OpenAI TTS
 * 5. Retourne l'audio de réponse
 */

import { NextRequest, NextResponse } from 'next/server';

const EMERGENT_LLM_KEY = process.env.EMERGENT_LLM_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1';

// Personnalité de Maître Tanaka
const TANAKA_SYSTEM_PROMPT = `Tu es Maître Tanaka (田中先生), un sensei d'Aïkido bienveillant et sage de 65 ans.

**Ton style de communication :**
- Tu parles avec chaleur et sagesse, comme un grand-père attentionné
- Tu utilises parfois des mots japonais (avec leur traduction entre parenthèses)
- Tu encourages toujours les élèves avec bienveillance
- Tu donnes des conseils pratiques et concrets
- Tu fais des références à la philosophie de l'Aïkido et au Bushido
- Tu es patient et ne juges jamais

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
Tu es sur "Way of Dojo", une application qui aide les pratiquants à réviser leurs cours d'Aïkido de manière ludique.`;

// Stocker l'historique des conversations (en mémoire - à remplacer par DB en production)
const conversationHistory: Map<string, Array<{ role: string; content: string }>> = new Map();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    const textMessage = formData.get('text') as string | null;
    const sessionId = formData.get('session_id') as string || 'default';
    const childName = formData.get('child_first_name') as string || '';

    if (!EMERGENT_LLM_KEY) {
      return NextResponse.json(
        { error: 'Configuration manquante: EMERGENT_LLM_KEY' },
        { status: 500 }
      );
    }

    let userMessage = '';

    // 1. Si audio fourni, transcrire avec Whisper
    if (audioFile && audioFile.size > 0) {
      console.log('🎤 Transcribing audio with Whisper...');
      
      const whisperFormData = new FormData();
      whisperFormData.append('file', audioFile, 'audio.webm');
      whisperFormData.append('model', 'whisper-1');
      whisperFormData.append('language', 'fr');
      whisperFormData.append('response_format', 'json');

      const whisperResponse = await fetch(`${OPENAI_API_URL}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${EMERGENT_LLM_KEY}`,
        },
        body: whisperFormData,
      });

      if (!whisperResponse.ok) {
        const errorText = await whisperResponse.text();
        console.error('Whisper error:', errorText);
        return NextResponse.json(
          { error: 'Erreur de transcription audio', details: errorText },
          { status: 500 }
        );
      }

      const whisperData = await whisperResponse.json();
      userMessage = whisperData.text;
      console.log('📝 Transcription:', userMessage);
    } else if (textMessage) {
      userMessage = textMessage;
    } else {
      return NextResponse.json(
        { error: 'Aucun message fourni (audio ou texte)' },
        { status: 400 }
      );
    }

    // 2. Récupérer ou initialiser l'historique de conversation
    if (!conversationHistory.has(sessionId)) {
      conversationHistory.set(sessionId, []);
    }
    const history = conversationHistory.get(sessionId)!;

    // Ajouter le contexte de l'enfant si disponible
    let systemPrompt = TANAKA_SYSTEM_PROMPT;
    if (childName) {
      systemPrompt += `\n\n**Élève actuel :** Tu parles avec ${childName}. Utilise son prénom de temps en temps pour personnaliser l'échange.`;
    }

    // Construire les messages pour GPT
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10), // Garder les 10 derniers messages
      { role: 'user', content: userMessage }
    ];

    // 3. Générer la réponse avec GPT-4o
    console.log('🤖 Generating response with GPT-4o...');
    
    const gptResponse = await fetch(`${OPENAI_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${EMERGENT_LLM_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    if (!gptResponse.ok) {
      const errorText = await gptResponse.text();
      console.error('GPT error:', errorText);
      return NextResponse.json(
        { error: 'Erreur de génération de réponse', details: errorText },
        { status: 500 }
      );
    }

    const gptData = await gptResponse.json();
    const assistantMessage = gptData.choices[0]?.message?.content || 'Je n\'ai pas compris, peux-tu répéter ?';
    console.log('💬 Response:', assistantMessage);

    // Sauvegarder dans l'historique
    history.push({ role: 'user', content: userMessage });
    history.push({ role: 'assistant', content: assistantMessage });

    // Limiter l'historique à 20 messages
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    // 4. Convertir en audio avec TTS
    console.log('🔊 Generating speech with TTS...');
    
    const ttsResponse = await fetch(`${OPENAI_API_URL}/audio/speech`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${EMERGENT_LLM_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: assistantMessage,
        voice: 'onyx', // Voix grave et sage pour Tanaka
        response_format: 'mp3',
        speed: 0.95, // Légèrement plus lent pour plus de sagesse
      }),
    });

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error('TTS error:', errorText);
      // Retourner quand même le texte si TTS échoue
      return NextResponse.json({
        success: true,
        userMessage,
        assistantMessage,
        audioBase64: null,
        error: 'TTS unavailable'
      });
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    console.log('✅ Voice agent response complete');

    return NextResponse.json({
      success: true,
      userMessage,
      assistantMessage,
      audioBase64,
      audioFormat: 'mp3'
    });

  } catch (error) {
    console.error('Voice agent error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur', details: String(error) },
      { status: 500 }
    );
  }
}

// Endpoint GET pour tester que l'API est en ligne
export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Maître Tanaka Voice Agent',
    capabilities: ['whisper-stt', 'gpt-4o-chat', 'tts-speech'],
    version: '1.0.0'
  });
}
