/**
 * 🎮 GAMIFICATION SERVICE
 * Logique centrale pour XP, niveaux, badges et streaks
 */

import { VIRTUES_GAMIFICATION, GLOBAL_TROPHIES, SPECIAL_TITLES } from '@/constants/virtuesGamification';

// XP Configuration
export const XP_CONFIG = {
  // Défis quotidiens
  challenge_complete: 10,
  challenge_bonus: 5, // Bonus si tous les défis du jour sont complétés
  
  // Techniques
  technique_discovered: 5,
  technique_learning: 10,
  technique_practicing: 15,
  technique_mastered: 25,
  
  // Activité
  daily_login: 5,
  streak_bonus_7: 20,
  streak_bonus_30: 50,
  streak_bonus_100: 100,
  
  // Vertus
  virtue_progress_10: 10,
  virtue_progress_50: 25,
  virtue_progress_100: 50,
  
  // Stages
  stage_registered: 15,
  stage_attended: 30,
};

// Level calculation
export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function xpForLevel(level: number): number {
  return (level - 1) * 100;
}

export function xpToNextLevel(xp: number): { current: number; required: number; progress: number } {
  const currentLevel = calculateLevel(xp);
  const xpForCurrentLevel = xpForLevel(currentLevel);
  const xpForNextLevel = xpForLevel(currentLevel + 1);
  const current = xp - xpForCurrentLevel;
  const required = xpForNextLevel - xpForCurrentLevel;
  
  return {
    current,
    required,
    progress: Math.round((current / required) * 100),
  };
}

// Badge eligibility check
export interface BadgeCheckResult {
  badgeId: string;
  name: string;
  emoji: string;
  virtue: string;
  unlocked: boolean;
  condition: string;
}

export function checkBadgeEligibility(
  badgeCondition: string,
  userStats: {
    xp: number;
    level: number;
    streak: number;
    completedTechniques: string[];
    completedChallenges: string[];
    virtuesProgress: Record<string, number>;
    totalChallengesCompleted: number;
    totalTechniquesCompleted: number;
    loginDays: number;
  }
): boolean {
  const condition = badgeCondition.toLowerCase();
  
  // XP based
  if (condition.includes('xp_')) {
    const xpRequired = parseInt(condition.split('xp_')[1]) || 0;
    return userStats.xp >= xpRequired;
  }
  
  // Level based
  if (condition.includes('level_')) {
    const levelRequired = parseInt(condition.split('level_')[1]) || 0;
    return userStats.level >= levelRequired;
  }
  
  // Streak based
  if (condition.includes('streak_')) {
    const streakRequired = parseInt(condition.split('streak_')[1]) || 0;
    return userStats.streak >= streakRequired;
  }
  
  // Techniques based
  if (condition.includes('techniques_')) {
    const techRequired = parseInt(condition.split('techniques_')[1]) || 0;
    return userStats.totalTechniquesCompleted >= techRequired;
  }
  
  // Challenges based
  if (condition.includes('challenges_')) {
    const challengesRequired = parseInt(condition.split('challenges_')[1]) || 0;
    return userStats.totalChallengesCompleted >= challengesRequired;
  }
  
  // Virtue progress based
  if (condition.includes('virtue_')) {
    const parts = condition.split('_');
    const virtueId = parts[1];
    const progressRequired = parseInt(parts[2]) || 0;
    return (userStats.virtuesProgress[virtueId] || 0) >= progressRequired;
  }
  
  // Login days
  if (condition.includes('login_days_')) {
    const daysRequired = parseInt(condition.split('login_days_')[1]) || 0;
    return userStats.loginDays >= daysRequired;
  }
  
  // First time achievements
  if (condition === 'first_challenge') {
    return userStats.totalChallengesCompleted >= 1;
  }
  if (condition === 'first_technique') {
    return userStats.totalTechniquesCompleted >= 1;
  }
  if (condition === 'first_login') {
    return userStats.loginDays >= 1;
  }
  
  // Default - not met
  return false;
}

// Get all badges with unlock status
export function getAllBadgesWithStatus(
  earnedBadges: string[],
  userStats: {
    xp: number;
    level: number;
    streak: number;
    completedTechniques: string[];
    completedChallenges: string[];
    virtuesProgress: Record<string, number>;
    totalChallengesCompleted: number;
    totalTechniquesCompleted: number;
    loginDays: number;
  }
): BadgeCheckResult[] {
  const results: BadgeCheckResult[] = [];
  
  // Virtue badges
  Object.values(VIRTUES_GAMIFICATION).forEach(virtue => {
    virtue.badges.forEach(badge => {
      results.push({
        badgeId: badge.id,
        name: badge.name,
        emoji: badge.emoji,
        virtue: virtue.id,
        unlocked: earnedBadges.includes(badge.id),
        condition: badge.condition,
      });
    });
  });
  
  // Global trophies
  GLOBAL_TROPHIES.forEach(trophy => {
    results.push({
      badgeId: trophy.id,
      name: trophy.name,
      emoji: trophy.emoji,
      virtue: 'global',
      unlocked: earnedBadges.includes(trophy.id),
      condition: trophy.condition,
    });
  });
  
  return results;
}

// Check for newly unlockable badges
export function checkNewBadges(
  earnedBadges: string[],
  userStats: {
    xp: number;
    level: number;
    streak: number;
    completedTechniques: string[];
    completedChallenges: string[];
    virtuesProgress: Record<string, number>;
    totalChallengesCompleted: number;
    totalTechniquesCompleted: number;
    loginDays: number;
  }
): BadgeCheckResult[] {
  const newBadges: BadgeCheckResult[] = [];
  
  // Check virtue badges
  Object.values(VIRTUES_GAMIFICATION).forEach(virtue => {
    virtue.badges.forEach(badge => {
      if (!earnedBadges.includes(badge.id)) {
        if (checkBadgeEligibility(badge.condition, userStats)) {
          newBadges.push({
            badgeId: badge.id,
            name: badge.name,
            emoji: badge.emoji,
            virtue: virtue.id,
            unlocked: true,
            condition: badge.condition,
          });
        }
      }
    });
  });
  
  // Check global trophies
  GLOBAL_TROPHIES.forEach(trophy => {
    if (!earnedBadges.includes(trophy.id)) {
      if (checkBadgeEligibility(trophy.condition, userStats)) {
        newBadges.push({
          badgeId: trophy.id,
          name: trophy.name,
          emoji: trophy.emoji,
          virtue: 'global',
          unlocked: true,
          condition: trophy.condition,
        });
      }
    }
  });
  
  return newBadges;
}

// Get current title based on XP
export function getCurrentTitle(xp: number): { id: string; title: string; emoji: string } | null {
  let currentTitle = null;
  
  for (const title of SPECIAL_TITLES) {
    const xpRequired = parseInt(title.condition.replace('total_xp_', '')) || 0;
    if (xp >= xpRequired) {
      currentTitle = {
        id: title.id,
        title: title.title,
        emoji: title.emoji,
      };
    }
  }
  
  return currentTitle;
}

// Calculate virtue progress based on completed challenges
export function calculateVirtueProgress(
  completedChallenges: string[],
  virtueId: string
): number {
  const virtue = VIRTUES_GAMIFICATION[virtueId];
  if (!virtue) return 0;
  
  const totalChallenges = virtue.dailyChallenges.length;
  const completedForVirtue = virtue.dailyChallenges.filter(
    c => completedChallenges.includes(c.id)
  ).length;
  
  return totalChallenges > 0 ? Math.round((completedForVirtue / totalChallenges) * 100) : 0;
}

// Check if streak should be reset (no activity in 24h)
export function shouldResetStreak(lastActivity: Date | null): boolean {
  if (!lastActivity) return true;
  
  const now = new Date();
  const lastActivityDate = new Date(lastActivity);
  const hoursSinceLastActivity = (now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60);
  
  return hoursSinceLastActivity > 36; // Grace period of 36 hours
}

// Check if it's a new day for streak increment
export function isNewDayForStreak(lastActivity: Date | null): boolean {
  if (!lastActivity) return true;
  
  const now = new Date();
  const lastActivityDate = new Date(lastActivity);
  
  // Compare dates (ignoring time)
  return now.toDateString() !== lastActivityDate.toDateString();
}
