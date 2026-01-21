/**
 * 🎮 GAMIFICATION - MOUVEMENTS PROGRESS
 * Récupère et met à jour la progression des mouvements/armes
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

type MasteryLevel = 'not_started' | 'learning' | 'practicing' | 'mastered';

const MASTERY_XP: Record<MasteryLevel, number> = {
  not_started: 0,
  learning: XP_CONFIG.technique_discovered || 5,
  practicing: XP_CONFIG.technique_practicing || 15,
  mastered: XP_CONFIG.technique_mastered || 30,
};

// GET - Récupérer la progression des mouvements
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

    // Get movement progress from user's techniqueProgress
    const mouvementProgress = user.gamification?.techniqueProgress || {};
    
    // Filter only mouvement-related entries (prefixed with 'mvt_' or 'arme_')
    const filteredProgress: Record<string, string> = {};
    for (const [key, value] of Object.entries(mouvementProgress)) {
      if (key.startsWith('mvt_') || key.startsWith('arme_') || key.startsWith('dan_')) {
        filteredProgress[key] = value as string;
      }
    }

    // Calculate stats
    const stats = {
      total: Object.keys(filteredProgress).length,
      mastered: Object.values(filteredProgress).filter(v => v === 'mastered').length,
      practicing: Object.values(filteredProgress).filter(v => v === 'practicing').length,
      learning: Object.values(filteredProgress).filter(v => v === 'learning').length,
    };

    return NextResponse.json({
      success: true,
      progress: filteredProgress,
      stats,
    });
  } catch (error) {
    console.error('Get mouvement progress error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Mettre à jour la progression d'un mouvement
export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  
  if ('error' in authResult) {
    return authResult.error;
  }

  try {
    await dbConnect();

    const body = await request.json();
    const { mouvementId, status, category } = body;

    if (!mouvementId || !status) {
      return NextResponse.json(
        { error: 'mouvementId et status requis' },
        { status: 400 }
      );
    }

    if (!['not_started', 'learning', 'practicing', 'mastered'].includes(status)) {
      return NextResponse.json(
        { error: 'Status invalide. Valeurs acceptées: not_started, learning, practicing, mastered' },
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

    if (!user.gamification.techniqueProgress) {
      user.gamification.techniqueProgress = {};
    }

    // Create prefixed key based on category
    let prefixedId = mouvementId;
    if (category && !mouvementId.startsWith('mvt_') && !mouvementId.startsWith('arme_') && !mouvementId.startsWith('dan_')) {
      if (['ukemi', 'tai_sabaki', 'kansetsu_waza'].includes(category)) {
        prefixedId = `mvt_${mouvementId}`;
      } else if (['jo', 'tanto', 'bokken'].includes(category)) {
        prefixedId = `arme_${mouvementId}`;
      } else if (category === 'dan') {
        prefixedId = `dan_${mouvementId}`;
      }
    }

    // Get current status
    const currentStatus = user.gamification.techniqueProgress[prefixedId] as MasteryLevel | undefined;
    
    const oldXp = user.gamification.xp || 0;
    const oldLevel = user.gamification.level || 1;

    // Calculate XP difference
    let xpToAward = 0;
    const currentXp = currentStatus ? MASTERY_XP[currentStatus] : 0;
    const newXp = MASTERY_XP[status as MasteryLevel];
    xpToAward = newXp - currentXp;

    // Update progress (allow going back to not_started)
    if (status === 'not_started') {
      delete user.gamification.techniqueProgress[prefixedId];
    } else {
      user.gamification.techniqueProgress[prefixedId] = status;
    }

    // If mastered, add to completed techniques
    if (status === 'mastered' && !user.gamification.completedTechniques?.includes(prefixedId)) {
      user.gamification.completedTechniques = [
        ...(user.gamification.completedTechniques || []),
        prefixedId
      ];
      user.gamification.totalTechniquesCompleted = 
        (user.gamification.totalTechniquesCompleted || 0) + 1;
    } else if (status !== 'mastered' && user.gamification.completedTechniques?.includes(prefixedId)) {
      // Remove from completed if no longer mastered
      user.gamification.completedTechniques = user.gamification.completedTechniques.filter(
        (t: string) => t !== prefixedId
      );
      user.gamification.totalTechniquesCompleted = Math.max(
        0, 
        (user.gamification.totalTechniquesCompleted || 0) - 1
      );
    }

    // Only add XP if positive
    const finalXp = xpToAward > 0 ? oldXp + xpToAward : oldXp;
    const newLevel = calculateLevel(finalXp);
    const levelUp = newLevel > oldLevel;

    // Update streak
    let streakUpdated = false;
    if (xpToAward > 0) {
      if (shouldResetStreak(user.gamification.lastActivity)) {
        user.gamification.streak = 1;
        streakUpdated = true;
      } else if (isNewDayForStreak(user.gamification.lastActivity)) {
        user.gamification.streak = (user.gamification.streak || 0) + 1;
        streakUpdated = true;
      }
    }

    // Update user stats
    user.gamification.xp = finalXp;
    user.gamification.level = newLevel;
    user.gamification.lastActivity = new Date();
    
    if (streakUpdated) {
      user.gamification.loginDays = (user.gamification.loginDays || 0) + 1;
    }

    // Check for new badges
    const userStats = {
      xp: finalXp,
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
    
    if (newBadges.length > 0) {
      const badgeIds = newBadges.map(b => b.badgeId);
      user.gamification.badges = [...(user.gamification.badges || []), ...badgeIds];
    }

    // Mark the modified fields
    user.markModified('gamification.techniqueProgress');
    user.markModified('gamification.completedTechniques');
    
    // Save user
    await user.save();

    // Get current title
    const currentTitle = getCurrentTitle(finalXp);
    const xpProgress = xpToNextLevel(finalXp);

    // Calculate category stats
    const allProgress = user.gamification.techniqueProgress || {};
    const categoryStats: Record<string, { total: number; mastered: number; practicing: number; learning: number }> = {};
    
    for (const [key, value] of Object.entries(allProgress)) {
      let cat = 'other';
      if (key.startsWith('mvt_')) cat = 'mouvements';
      else if (key.startsWith('arme_')) cat = 'armes';
      else if (key.startsWith('dan_')) cat = 'dan';
      
      if (!categoryStats[cat]) {
        categoryStats[cat] = { total: 0, mastered: 0, practicing: 0, learning: 0 };
      }
      categoryStats[cat].total++;
      if (value === 'mastered') categoryStats[cat].mastered++;
      else if (value === 'practicing') categoryStats[cat].practicing++;
      else if (value === 'learning') categoryStats[cat].learning++;
    }

    return NextResponse.json({
      success: true,
      mouvement: {
        id: prefixedId,
        previousStatus: currentStatus || 'not_started',
        newStatus: status,
        category: category || null,
        xpEarned: xpToAward > 0 ? xpToAward : 0,
      },
      xp: {
        added: xpToAward > 0 ? xpToAward : 0,
        total: finalXp,
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
      categoryStats,
    });
  } catch (error) {
    console.error('Mouvement progress error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
