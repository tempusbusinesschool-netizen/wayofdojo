/**
 * 🔊 TTS API - Text to Speech pour Maître Tanaka
 * Proxy vers le backend FastAPI pour générer l'audio ElevenLabs
 */

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8001';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const backendResponse = await fetch(`${BACKEND_URL}/api/voice-agent/tts`, {
      method: 'POST',
      body: formData,
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('TTS Backend error:', errorText);
      return NextResponse.json(
        { error: 'Erreur du serveur TTS', details: errorText },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('TTS proxy error:', error);
    return NextResponse.json(
      { error: 'Erreur de connexion au serveur TTS', details: String(error) },
      { status: 500 }
    );
  }
}
