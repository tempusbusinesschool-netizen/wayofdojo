import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'wayofdojo-secret-key-2024';

interface JWTPayload {
  userId: string;
  email: string;
}

// GET - Fetch adult journey progress
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('wayofdojo_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    const { db } = await connectToDatabase();
    
    const user = await db.collection('users').findOne(
      { email: decoded.email },
      { projection: { _id: 0, 'progress.adultJourney': 1, 'gamification.xp': 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      adultJourney: user.progress?.adultJourney || {
        completedMissions: [],
        journalEntries: [],
        lastCity: 'miyamoto',
        startedAt: null
      },
      xp: user.gamification?.xp || 0
    });
  } catch (error) {
    console.error('Error fetching adult journey:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Complete a mission
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('wayofdojo_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    const { missionId, xpReward, choiceId, cityId } = await request.json();

    if (!missionId) {
      return NextResponse.json({ error: 'ID de mission requis' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    // Check if mission already completed
    const user = await db.collection('users').findOne(
      { email: decoded.email },
      { projection: { _id: 0, 'progress.adultJourney': 1, 'gamification': 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const currentMissions = user.progress?.adultJourney?.completedMissions || [];
    
    if (currentMissions.includes(missionId)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Mission déjà complétée' 
      });
    }

    // Update user progress
    const currentXp = user.gamification?.xp || 0;
    const newXp = currentXp + (xpReward || 0);
    const newLevel = Math.floor(newXp / 100) + 1;

    await db.collection('users').updateOne(
      { email: decoded.email },
      {
        $push: { 
          'progress.adultJourney.completedMissions': missionId 
        },
        $set: {
          'progress.adultJourney.lastCity': cityId || 'miyamoto',
          'progress.adultJourney.lastMissionAt': new Date().toISOString(),
          'gamification.xp': newXp,
          'gamification.level': newLevel
        },
        $setOnInsert: {
          'progress.adultJourney.startedAt': new Date().toISOString()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      xp: {
        added: xpReward || 0,
        total: newXp
      },
      level: {
        current: newLevel,
        levelUp: newLevel > (user.gamification?.level || 1)
      },
      completedMissions: [...currentMissions, missionId]
    });
  } catch (error) {
    console.error('Error completing mission:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
