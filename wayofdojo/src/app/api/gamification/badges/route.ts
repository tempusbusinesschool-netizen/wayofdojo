/**
 * 🎮 GAMIFICATION - CHECK & UNLOCK BADGES
 * Vérifie et débloque tous les badges éligibles
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models/user.model';
import { 
  checkNewBadges,
  getAllBadgesWithStatus,
  getCurrentTitle
} from '@/lib/gamification.service';

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  
  if ('error' in authResult) {
    return authResult.error;
  }

  try {
    await dbConnect();

    const user = await User.findById(authResult.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const gamification = user.gamification || {
      xp: 0,
      level: 1,
      streak: 0,
      badges: [],
      completedTechniques: [],
      completedChallenges: [],
      virtuesProgress: {},
      totalChallengesCompleted: 0,
      totalTechniquesCompleted: 0,
      loginDays: 0,
    };

    // Build user stats
    const userStats = {
      xp: gamification.xp || 0,
      level: gamification.level || 1,
      streak: gamification.streak || 0,
      completedTechniques: gamification.completedTechniques || [],
      completedChallenges: gamification.completedChallenges || [],
      virtuesProgress: gamification.virtuesProgress || {},
      totalChallengesCompleted: gamification.totalChallengesCompleted || 0,
      totalTechniquesCompleted: gamification.totalTechniquesCompleted || 0,
      loginDays: gamification.loginDays || 0,
    };

    // Check for new badges
    const newBadges = checkNewBadges(gamification.badges || [], userStats);

    // Add newly unlocked badges
    if (newBadges.length > 0) {
      const badgeIds = newBadges.map(b => b.badgeId);
      user.gamification = {
        ...gamification,
        badges: [...(gamification.badges || []), ...badgeIds],
      };
      await user.save();
    }

    // Get all badges status
    const allBadges = getAllBadgesWithStatus(
      user.gamification?.badges || [],
      userStats
    );

    const currentTitle = getCurrentTitle(gamification.xp || 0);

    return NextResponse.json({
      success: true,
      newlyUnlocked: newBadges,
      totalUnlocked: (user.gamification?.badges || []).length,
      totalBadges: allBadges.length,
      allBadges,
      title: currentTitle,
    });
  } catch (error) {
    console.error('Check badges error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// GET - Get all badges with current unlock status
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  
  if ('error' in authResult) {
    return authResult.error;
  }

  try {
    await dbConnect();

    const user = await User.findById(authResult.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const gamification = user.gamification || {
      xp: 0,
      level: 1,
      streak: 0,
      badges: [],
      completedTechniques: [],
      completedChallenges: [],
      virtuesProgress: {},
      totalChallengesCompleted: 0,
      totalTechniquesCompleted: 0,
      loginDays: 0,
    };

    // Build user stats
    const userStats = {
      xp: gamification.xp || 0,
      level: gamification.level || 1,
      streak: gamification.streak || 0,
      completedTechniques: gamification.completedTechniques || [],
      completedChallenges: gamification.completedChallenges || [],
      virtuesProgress: gamification.virtuesProgress || {},
      totalChallengesCompleted: gamification.totalChallengesCompleted || 0,
      totalTechniquesCompleted: gamification.totalTechniquesCompleted || 0,
      loginDays: gamification.loginDays || 0,
    };

    // Get all badges status
    const allBadges = getAllBadgesWithStatus(
      gamification.badges || [],
      userStats
    );

    const unlockedCount = allBadges.filter(b => b.unlocked).length;

    return NextResponse.json({
      success: true,
      badges: {
        unlocked: unlockedCount,
        total: allBadges.length,
        list: allBadges,
      },
      earnedBadgeIds: gamification.badges || [],
    });
  } catch (error) {
    console.error('Get badges error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
