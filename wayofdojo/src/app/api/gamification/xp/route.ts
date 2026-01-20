/**
 * 🎮 GAMIFICATION - ADD XP
 * Ajoute des XP à l'utilisateur et recalcule le niveau
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models/user.model';
import { 
  calculateLevel, 
  xpToNextLevel, 
  checkNewBadges,
  getCurrentTitle,
  XP_CONFIG,
  shouldResetStreak,
  isNewDayForStreak
} from '@/lib/gamification.service';

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  
  if ('error' in authResult) {
    return authResult.error;
  }

  try {
    await dbConnect();

    const body = await request.json();
    const { amount, reason } = body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Montant XP invalide' },
        { status: 400 }
      );
    }

    // Get current user
    const user = await User.findById(authResult.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Initialize gamification if not exists
    if (!user.gamification) {
      user.gamification = {
        xp: 0,
        level: 1,
        streak: 0,
        lastActivity: new Date(),
        badges: [],
        completedTechniques: [],
        completedChallenges: [],
        virtuesProgress: {},
        totalChallengesCompleted: 0,
        totalTechniquesCompleted: 0,
        loginDays: 0,
      };
    }

    const oldXp = user.gamification.xp || 0;
    const oldLevel = user.gamification.level || 1;

    // Add XP
    const newXp = oldXp + amount;
    const newLevel = calculateLevel(newXp);
    const levelUp = newLevel > oldLevel;

    // Update streak
    let streakUpdated = false;
    if (shouldResetStreak(user.gamification.lastActivity)) {
      user.gamification.streak = 1;
      streakUpdated = true;
    } else if (isNewDayForStreak(user.gamification.lastActivity)) {
      user.gamification.streak = (user.gamification.streak || 0) + 1;
      streakUpdated = true;
    }

    // Update user stats
    user.gamification.xp = newXp;
    user.gamification.level = newLevel;
    user.gamification.lastActivity = new Date();
    
    if (streakUpdated && user.gamification.loginDays !== undefined) {
      user.gamification.loginDays = (user.gamification.loginDays || 0) + 1;
    }

    // Check for new badges
    const userStats = {
      xp: newXp,
      level: newLevel,
      streak: user.gamification.streak || 0,
      completedTechniques: user.gamification.completedTechniques || [],
      completedChallenges: user.gamification.completedChallenges || [],
      virtuesProgress: user.gamification.virtuesProgress || {},
      totalChallengesCompleted: user.gamification.totalChallengesCompleted || 0,
      totalTechniquesCompleted: user.gamification.totalTechniquesCompleted || 0,
      loginDays: user.gamification.loginDays || 0,
    };

    const newBadges = checkNewBadges(user.gamification.badges || [], userStats);
    
    // Add newly unlocked badges
    if (newBadges.length > 0) {
      const badgeIds = newBadges.map(b => b.badgeId);
      user.gamification.badges = [...(user.gamification.badges || []), ...badgeIds];
    }

    // Save user
    await user.save();

    // Get current title
    const currentTitle = getCurrentTitle(newXp);
    const xpProgress = xpToNextLevel(newXp);

    return NextResponse.json({
      success: true,
      xp: {
        added: amount,
        total: newXp,
        reason: reason || 'manual',
      },
      level: {
        current: newLevel,
        levelUp,
        progress: xpProgress,
      },
      streak: {
        current: user.gamification.streak,
        updated: streakUpdated,
      },
      badges: {
        newlyUnlocked: newBadges,
        total: user.gamification.badges?.length || 0,
      },
      title: currentTitle,
    });
  } catch (error) {
    console.error('Add XP error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
