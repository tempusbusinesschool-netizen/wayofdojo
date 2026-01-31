/**
 * API pour mettre à jour le profil utilisateur (prénom)
 * Utilisé quand Tanaka demande le prénom lors de l'introduction
 */

import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/wayofdojo';
const DB_NAME = 'wayofdojo';

export async function POST(request: NextRequest) {
  let client: MongoClient | null = null;
  
  try {
    // Get auth token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    
    // Parse request body
    const body = await request.json();
    const { firstName } = body;
    
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Prénom requis' }, { status: 400 });
    }
    
    // Connect to MongoDB
    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    
    // Find user by token (stored in sessions or decode JWT)
    // For simplicity, we'll decode the token payload (base64url)
    let userId: string;
    try {
      const base64Payload = token.split('.')[1];
      // Handle base64url encoding (replace - with + and _ with /)
      const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
      // Add padding if needed
      const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
      const payload = JSON.parse(Buffer.from(padded, 'base64').toString('utf-8'));
      userId = payload.userId || payload.sub || payload.id;
      console.log('Decoded userId:', userId);
    } catch (e) {
      console.error('Token decode error:', e);
      return NextResponse.json({ success: false, error: 'Token invalide' }, { status: 401 });
    }
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Utilisateur non trouvé' }, { status: 401 });
    }
    
    // Update user's firstName
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          firstName: firstName.trim(),
          updatedAt: new Date()
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Utilisateur non trouvé' }, { status: 404 });
    }
    
    // Return success
    return NextResponse.json({ 
      success: true, 
      message: 'Prénom mis à jour',
      firstName: firstName.trim()
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
