/**
 * 🎯 DAILY CHALLENGES API - Système de défis quotidiens
 * 
 * GET: Récupérer le défi du jour
 * POST: Marquer un défi comme complété
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
} from '@/lib/gamification.service';

// Types de défis
type ChallengeType = 'discover' | 'practice' | 'master' | 'explore' | 'review';

interface DailyChallenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  emoji: string;
  category: string;
  target: number;
  xpReward: number;
  bonusXp: number; // Bonus streak
}

// Configuration des défis par type
const CHALLENGE_TEMPLATES: Record<ChallengeType, { titles: string[]; descriptions: string[]; emoji: string; baseXp: number }> = {
  discover: {
    titles: ['Explorateur', 'Découverte', 'Nouveau Horizon'],
    descriptions: ['Découvre {target} nouvelles techniques de {category}', 'Explore {target} techniques inconnues en {category}'],
    emoji: '🔍',
    baseXp: 15,
  },
  practice: {
    titles: ['Entraînement', 'Pratique', 'Répétition'],
    descriptions: ['Passe {target} techniques en mode "En pratique"', 'Travaille sur {target} techniques de {category}'],
    emoji: '🔄',
    baseXp: 20,
  },
  master: {
    titles: ['Maîtrise', 'Perfection', 'Excellence'],
    descriptions: ['Maîtrise {target} technique(s) de {category}', 'Atteins la maîtrise sur {target} mouvement(s)'],
    emoji: '✅',
    baseXp: 40,
  },
  explore: {
    titles: ['Exploration', 'Voyage', 'Aventure'],
    descriptions: ['Visite la catégorie {category}', 'Découvre le monde de {category}'],
    emoji: '🗺️',
    baseXp: 10,
  },
  review: {
    titles: ['Révision', 'Rappel', 'Mémoire'],
    descriptions: ['Revois {target} techniques déjà apprises', 'Rafraîchis ta mémoire sur {target} mouvements'],
    emoji: '📚',
    baseXp: 25,
  },
};

// Catégories disponibles
const CATEGORIES = ['Ukemi', 'Tai Sabaki', 'Kansetsu Waza', 'Jo', 'Tanto', 'Bokken'];
const CATEGORY_IDS = ['ukemi', 'tai_sabaki', 'kansetsu_waza', 'jo', 'tanto', 'bokken'];

// Générer le défi du jour basé sur la date
function generateDailyChallenge(userId: string, date: Date): DailyChallenge {
  // Utiliser la date et l'userId pour générer un défi pseudo-aléatoire mais déterministe
  const dateStr = date.toISOString().split('T')[0];
  const seed = hashCode(dateStr + userId);
  
  // Sélectionner le type de défi
  const challengeTypes: ChallengeType[] = ['discover', 'practice', 'master', 'explore', 'review'];
  const typeIndex = Math.abs(seed) % challengeTypes.length;
  const type = challengeTypes[typeIndex];
  
  // Sélectionner la catégorie
  const catIndex = Math.abs(seed >> 3) % CATEGORIES.length;
  const category = CATEGORIES[catIndex];
  const categoryId = CATEGORY_IDS[catIndex];
  
  // Définir la cible
  let target = 1;
  if (type === 'discover') target = 2 + (Math.abs(seed >> 5) % 3); // 2-4
  else if (type === 'practice') target = 2 + (Math.abs(seed >> 7) % 4); // 2-5
  else if (type === 'master') target = 1;
  else if (type === 'review') target = 3 + (Math.abs(seed >> 9) % 5); // 3-7
  
  const template = CHALLENGE_TEMPLATES[type];
  const titleIndex = Math.abs(seed >> 11) % template.titles.length;
  const descIndex = Math.abs(seed >> 13) % template.descriptions.length;
  
  // Vérifier si c'est le weekend (bonus double XP)
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const baseXp = template.baseXp * (type === 'master' ? target : 1);
  const weekendBonus = isWeekend ? baseXp : 0;
  
  return {
    id: `daily_${dateStr}_${userId.slice(-6)}`,
    type,
    title: template.titles[titleIndex],
    description: template.descriptions[descIndex]
      .replace('{target}', target.toString())
      .replace('{category}', category),
    emoji: template.emoji,
    category: categoryId,
    target,
    xpReward: baseXp,
    bonusXp: weekendBonus,
  };
}

// Fonction de hash simple pour générer des nombres pseudo-aléatoires déterministes
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

// GET - Récupérer le défi du jour
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Générer le défi du jour
    const challenge = generateDailyChallenge(authResult.user.id, today);
    
    // Vérifier si le défi a déjà été complété aujourd'hui
    const completedChallenges = user.gamification?.completedChallenges || [];
    const isCompleted = completedChallenges.includes(challenge.id);
    
    // Calculer le progrès actuel vers le défi
    const techniqueProgress = user.gamification?.techniqueProgress || {};
    let currentProgress = 0;
    
    // Calculer le progrès selon le type de défi
    const prefix = ['ukemi', 'tai_sabaki', 'kansetsu_waza'].includes(challenge.category) ? 'mvt_' : 'arme_';
    
    if (challenge.type === 'master') {
      // Compter les techniques maîtrisées dans la catégorie
      for (const [key, value] of Object.entries(techniqueProgress)) {
        if (key.startsWith(prefix) && value === 'mastered') {
          currentProgress++;
        }
      }
    } else if (challenge.type === 'practice') {
      // Compter les techniques en pratique
      for (const [key, value] of Object.entries(techniqueProgress)) {
        if (key.startsWith(prefix) && (value === 'practicing' || value === 'mastered')) {
          currentProgress++;
        }
      }
    } else if (challenge.type === 'discover' || challenge.type === 'review') {
      // Compter les techniques découvertes (learning ou plus)
      for (const [key, value] of Object.entries(techniqueProgress)) {
        if (key.startsWith(prefix) && value) {
          currentProgress++;
        }
      }
    }
    
    // Calculer le bonus de streak
    const streak = user.gamification?.streak || 0;
    const streakBonus = Math.min(streak * 0.1, 0.5); // Max 50% bonus
    const streakBonusXp = Math.floor(challenge.xpReward * streakBonus);
    
    // Historique des défis récents
    const recentChallenges = completedChallenges
      .filter((c: string) => c.startsWith('daily_'))
      .slice(-7)
      .length;

    return NextResponse.json({
      success: true,
      challenge: {
        ...challenge,
        streakBonusXp,
        totalXp: challenge.xpReward + challenge.bonusXp + streakBonusXp,
      },
      progress: {
        current: Math.min(currentProgress, challenge.target),
        target: challenge.target,
        percentage: Math.min(100, Math.round((currentProgress / challenge.target) * 100)),
        isCompleted,
      },
      streak: {
        current: streak,
        bonusPercentage: Math.round(streakBonus * 100),
        recentCompleted: recentChallenges,
      },
      isWeekend: today.getDay() === 0 || today.getDay() === 6,
    });
  } catch (error) {
    console.error('Get daily challenge error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Compléter le défi du jour
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Générer le défi du jour
    const challenge = generateDailyChallenge(authResult.user.id, today);
    
    // Vérifier si déjà complété
    const completedChallenges = user.gamification?.completedChallenges || [];
    if (completedChallenges.includes(challenge.id)) {
      return NextResponse.json({
        success: false,
        error: 'Défi déjà complété aujourd\'hui',
        alreadyCompleted: true,
      });
    }
    
    // Vérifier si le progrès est suffisant
    const techniqueProgress = user.gamification?.techniqueProgress || {};
    let currentProgress = 0;
    const prefix = ['ukemi', 'tai_sabaki', 'kansetsu_waza'].includes(challenge.category) ? 'mvt_' : 'arme_';
    
    if (challenge.type === 'master') {
      for (const [key, value] of Object.entries(techniqueProgress)) {
        if (key.startsWith(prefix) && value === 'mastered') {
          currentProgress++;
        }
      }
    } else if (challenge.type === 'practice') {
      for (const [key, value] of Object.entries(techniqueProgress)) {
        if (key.startsWith(prefix) && (value === 'practicing' || value === 'mastered')) {
          currentProgress++;
        }
      }
    } else if (challenge.type === 'discover' || challenge.type === 'review' || challenge.type === 'explore') {
      for (const [key, value] of Object.entries(techniqueProgress)) {
        if (key.startsWith(prefix) && value) {
          currentProgress++;
        }
      }
    }
    
    if (currentProgress < challenge.target && challenge.type !== 'explore') {
      return NextResponse.json({
        success: false,
        error: `Progrès insuffisant: ${currentProgress}/${challenge.target}`,
        currentProgress,
        target: challenge.target,
      });
    }
    
    // Calculer les XP à attribuer
    const streak = user.gamification?.streak || 0;
    const streakBonus = Math.min(streak * 0.1, 0.5);
    const streakBonusXp = Math.floor(challenge.xpReward * streakBonus);
    const totalXp = challenge.xpReward + challenge.bonusXp + streakBonusXp;
    
    // Mettre à jour l'utilisateur
    const oldXp = user.gamification?.xp || 0;
    const oldLevel = user.gamification?.level || 1;
    const newXp = oldXp + totalXp;
    const newLevel = calculateLevel(newXp);
    const levelUp = newLevel > oldLevel;
    
    // Ajouter le défi aux complétés
    user.gamification.completedChallenges = [...completedChallenges, challenge.id];
    user.gamification.totalChallengesCompleted = (user.gamification.totalChallengesCompleted || 0) + 1;
    user.gamification.xp = newXp;
    user.gamification.level = newLevel;
    user.gamification.lastActivity = new Date();
    
    // Vérifier les nouveaux badges
    const userStats = {
      xp: newXp,
      level: newLevel,
      streak: streak,
      completedTechniques: user.gamification.completedTechniques || [],
      completedChallenges: user.gamification.completedChallenges,
      virtuesProgress: user.gamification.virtuesProgress || {},
      totalChallengesCompleted: user.gamification.totalChallengesCompleted,
      totalTechniquesCompleted: user.gamification.totalTechniquesCompleted || 0,
      loginDays: user.gamification.loginDays || 0,
    };

    const newBadges = checkNewBadges(user.gamification.badges || [], userStats);
    
    if (newBadges.length > 0) {
      const badgeIds = newBadges.map(b => b.badgeId);
      user.gamification.badges = [...(user.gamification.badges || []), ...badgeIds];
    }
    
    user.markModified('gamification');
    await user.save();
    
    const xpProgress = xpToNextLevel(newXp);
    const currentTitle = getCurrentTitle(newXp);

    return NextResponse.json({
      success: true,
      challenge: {
        id: challenge.id,
        title: challenge.title,
        completed: true,
      },
      rewards: {
        baseXp: challenge.xpReward,
        weekendBonus: challenge.bonusXp,
        streakBonus: streakBonusXp,
        totalXp,
      },
      xp: {
        previous: oldXp,
        current: newXp,
        gained: totalXp,
      },
      level: {
        current: newLevel,
        levelUp,
        progress: xpProgress,
      },
      badges: {
        newlyUnlocked: newBadges,
        total: user.gamification.badges?.length || 0,
      },
      title: currentTitle,
      streak: {
        current: streak,
        bonusPercentage: Math.round(streakBonus * 100),
      },
    });
  } catch (error) {
    console.error('Complete daily challenge error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
