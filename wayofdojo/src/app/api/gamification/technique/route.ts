/**
 * 🎮 GAMIFICATION - TECHNIQUE PROGRESS
 * Marque une technique comme découverte/pratiquée/maîtrisée
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

type TechniqueStatus = 'discovered' | 'learning' | 'practicing' | 'mastered';

const STATUS_XP: Record<TechniqueStatus, number> = {
  discovered: XP_CONFIG.technique_discovered,
  learning: XP_CONFIG.technique_learning,
  practicing: XP_CONFIG.technique_practicing,
  mastered: XP_CONFIG.technique_mastered,
};

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  
  if ('error' in authResult) {
    return authResult.error;
  }

  try {
    await dbConnect();

    const body = await request.json();
    const { techniqueId, status, kyuId } = body;

    if (!techniqueId || !status) {
      return NextResponse.json(
        { error: 'techniqueId et status requis' },
        { status: 400 }
      );
    }

    if (!['discovered', 'learning', 'practicing', 'mastered'].includes(status)) {
      return NextResponse.json(
        { error: 'Status invalide. Valeurs acceptées: discovered, learning, practicing, mastered' },
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
        techniqueProgress: {},
      };
    }

    // Initialize technique progress tracking
    if (!user.gamification.techniqueProgress) {
      user.gamification.techniqueProgress = {};
    }

    // Get current status of technique
    const currentStatus = user.gamification.techniqueProgress[techniqueId];
    const statusOrder: TechniqueStatus[] = ['discovered', 'learning', 'practicing', 'mastered'];
    const currentIndex = currentStatus ? statusOrder.indexOf(currentStatus as TechniqueStatus) : -1;
    const newIndex = statusOrder.indexOf(status as TechniqueStatus);

    // Check if this is a progression (can't go backwards)
    if (newIndex <= currentIndex) {
      return NextResponse.json({
        success: false,
        error: 'Cette technique a déjà atteint ou dépassé ce niveau',
        currentStatus,
      });
    }

    const oldXp = user.gamification.xp || 0;
    const oldLevel = user.gamification.level || 1;

    // Calculate XP to award (only the difference if progressing)
    let xpToAward = STATUS_XP[status as TechniqueStatus];
    if (currentStatus) {
      xpToAward = STATUS_XP[status as TechniqueStatus] - STATUS_XP[currentStatus as TechniqueStatus];
    }

    // Update technique progress
    user.gamification.techniqueProgress[techniqueId] = status;

    // If mastered, add to completed techniques
    if (status === 'mastered' && !user.gamification.completedTechniques?.includes(techniqueId)) {
      user.gamification.completedTechniques = [
        ...(user.gamification.completedTechniques || []),
        techniqueId
      ];
      user.gamification.totalTechniquesCompleted = 
        (user.gamification.totalTechniquesCompleted || 0) + 1;
    }

    // Add XP
    const newXp = oldXp + xpToAward;
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
    
    if (streakUpdated) {
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
      technique: {
        id: techniqueId,
        previousStatus: currentStatus || null,
        newStatus: status,
        kyuId: kyuId || null,
        xpEarned: xpToAward,
      },
      xp: {
        added: xpToAward,
        total: newXp,
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
      stats: {
        totalTechniquesCompleted: user.gamification.totalTechniquesCompleted,
      },
    });
  } catch (error) {
    console.error('Technique progress error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
