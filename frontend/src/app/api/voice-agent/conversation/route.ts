/**
 * 🎙️ VOICE AGENT API - Proxy vers Backend FastAPI
 * 
 * Cette route proxy les requêtes vers le backend Python
 * qui utilise emergentintegrations pour OpenAI Whisper, GPT-4o et TTS
 */

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8001';

export async function POST(request: NextRequest) {
  try {
    // Forward the request to FastAPI backend
    const formData = await request.formData();
    
    const backendResponse = await fetch(`${BACKEND_URL}/api/voice-agent/conversation`, {
      method: 'POST',
      body: formData,
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('Backend error:', errorText);
      return NextResponse.json(
        { error: 'Erreur du serveur Tanaka', details: errorText },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Voice agent proxy error:', error);
    return NextResponse.json(
      { error: 'Erreur de connexion au serveur', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const backendResponse = await fetch(`${BACKEND_URL}/api/voice-agent/status`);
    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({
      status: 'offline',
      error: String(error)
    });
  }
}
