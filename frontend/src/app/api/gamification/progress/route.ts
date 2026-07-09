/**
 * 🎮 GAMIFICATION - GET PROGRESS
 * Récupère la progression complète de l'utilisateur
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models/user.model';
import { 
  xpToNextLevel, 
  getAllBadgesWithStatus,
  getCurrentTitle,
  shouldResetStreak,
  isNewDayForStreak,
  XP_CONFIG
} from '@/lib/gamification.service';

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

    // Initialize gamification if not exists
    const gamification = user.gamification || {
      xp: 0,
      level: 1,
      streak: 0,
      lastActivity: null,
      badges: [],
      completedTechniques: [],
      completedChallenges: [],
      virtuesProgress: {},
      totalChallengesCompleted: 0,
      totalTechniquesCompleted: 0,
      loginDays: 0,
      techniqueProgress: {},
    };

    // Check streak status
    let streakStatus = 'active';
    if (shouldResetStreak(gamification.lastActivity)) {
      streakStatus = 'lost';
    } else if (isNewDayForStreak(gamification.lastActivity)) {
      streakStatus = 'pending'; // Can be incremented today
    }

    // Get all badges with status
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

    const allBadges = getAllBadgesWithStatus(gamification.badges || [], userStats);
    const unlockedBadges = allBadges.filter(b => b.unlocked);
    const lockedBadges = allBadges.filter(b => !b.unlocked);

    // Get XP progress
    const xpProgress = xpToNextLevel(gamification.xp || 0);

    // Get current title
    const currentTitle = getCurrentTitle(gamification.xp || 0);

    return NextResponse.json({
      success: true,
      progress: {
        xp: {
          total: gamification.xp || 0,
          toNextLevel: xpProgress,
        },
        level: gamification.level || 1,
        streak: {
          current: gamification.streak || 0,
          status: streakStatus,
          lastActivity: gamification.lastActivity,
        },
        badges: {
          unlocked: unlockedBadges.length,
          total: allBadges.length,
          list: unlockedBadges,
          nextToUnlock: lockedBadges.slice(0, 3), // Show next 3 badges to unlock
        },
        virtues: gamification.virtuesProgress || {},
        techniques: {
          completed: gamification.totalTechniquesCompleted || 0,
          progress: gamification.techniqueProgress || {},
        },
        challenges: {
          completed: gamification.totalChallengesCompleted || 0,
          list: gamification.completedChallenges || [],
        },
        title: currentTitle,
        loginDays: gamification.loginDays || 0,
      },
      xpConfig: XP_CONFIG,
    });
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Record daily login and check streak
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

    let xpEarned = 0;
    let streakUpdated = false;
    let streakBonus = 0;

    // Check if streak needs reset or increment
    if (shouldResetStreak(user.gamification.lastActivity)) {
      user.gamification.streak = 1;
      streakUpdated = true;
      xpEarned += XP_CONFIG.daily_login;
    } else if (isNewDayForStreak(user.gamification.lastActivity)) {
      user.gamification.streak = (user.gamification.streak || 0) + 1;
      streakUpdated = true;
      xpEarned += XP_CONFIG.daily_login;
      
      // Check for streak bonuses
      const streak = user.gamification.streak;
      if (streak === 7) {
        streakBonus = XP_CONFIG.streak_bonus_7;
        xpEarned += streakBonus;
      } else if (streak === 30) {
        streakBonus = XP_CONFIG.streak_bonus_30;
        xpEarned += streakBonus;
      } else if (streak === 100) {
        streakBonus = XP_CONFIG.streak_bonus_100;
        xpEarned += streakBonus;
      }
    }

    // Update XP if earned
    if (xpEarned > 0) {
      user.gamification.xp = (user.gamification.xp || 0) + xpEarned;
      user.gamification.loginDays = (user.gamification.loginDays || 0) + 1;
    }

    // Update last activity
    user.gamification.lastActivity = new Date();

    // Check for new badges
    const userStats = {
      xp: user.gamification.xp || 0,
      level: user.gamification.level || 1,
      streak: user.gamification.streak || 0,
      completedTechniques: user.gamification.completedTechniques || [],
      completedChallenges: user.gamification.completedChallenges || [],
      virtuesProgress: user.gamification.virtuesProgress || {},
      totalChallengesCompleted: user.gamification.totalChallengesCompleted || 0,
      totalTechniquesCompleted: user.gamification.totalTechniquesCompleted || 0,
      loginDays: user.gamification.loginDays || 0,
    };

    const newBadges = streakUpdated ? 
      (await import('@/lib/gamification.service')).checkNewBadges(user.gamification.badges || [], userStats) 
      : [];

    // Add newly unlocked badges
    if (newBadges.length > 0) {
      const badgeIds = newBadges.map(b => b.badgeId);
      user.gamification.badges = [...(user.gamification.badges || []), ...badgeIds];
    }

    // Save user
    await user.save();

    return NextResponse.json({
      success: true,
      dailyLogin: {
        recorded: streakUpdated,
        xpEarned,
        streakBonus: streakBonus > 0 ? streakBonus : null,
      },
      streak: {
        current: user.gamification.streak,
        isNew: streakUpdated,
      },
      badges: {
        newlyUnlocked: newBadges,
      },
    });
  } catch (error) {
    console.error('Daily login error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
