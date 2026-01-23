import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models/user.model';
import { verifyToken } from '@/lib/auth';

// GET - Fetch adult journey progress
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('wayofdojo_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    await dbConnect();
    
    const user = await User.findOne(
      { email: decoded.email },
      { 'progress.adultJourney': 1, 'gamification.xp': 1 }
    ).lean();

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Type assertion for the user object
    const userData = user as { progress?: { adultJourney?: { completedMissions?: string[] } }; gamification?: { xp?: number } };

    return NextResponse.json({
      success: true,
      adultJourney: userData.progress?.adultJourney || {
        completedMissions: [],
        journalEntries: [],
        lastCity: 'miyamoto',
        startedAt: null
      },
      xp: userData.gamification?.xp || 0
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
    const { missionId, xpReward, cityId } = await request.json();

    if (!missionId) {
      return NextResponse.json({ error: 'ID de mission requis' }, { status: 400 });
    }

    await dbConnect();
    
    // Check if mission already completed
    const user = await User.findOne(
      { email: decoded.email },
      { 'progress.adultJourney': 1, 'gamification': 1 }
    ).lean();

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Type assertion
    const userData = user as { 
      progress?: { adultJourney?: { completedMissions?: string[] } }; 
      gamification?: { xp?: number; level?: number } 
    };

    const currentMissions = userData.progress?.adultJourney?.completedMissions || [];
    
    if (currentMissions.includes(missionId)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Mission déjà complétée' 
      });
    }

    // Update user progress
    const currentXp = userData.gamification?.xp || 0;
    const newXp = currentXp + (xpReward || 0);
    const newLevel = Math.floor(newXp / 100) + 1;

    await User.updateOne(
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
        }
      }
    );

    return NextResponse.json({
      success: true,
      xp: {
        added: xpReward || 0,
        total: newXp
      },
      level: {
        current: newLevel,
        levelUp: newLevel > (userData.gamification?.level || 1)
      },
      completedMissions: [...currentMissions, missionId]
    });
  } catch (error) {
    console.error('Error completing mission:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
