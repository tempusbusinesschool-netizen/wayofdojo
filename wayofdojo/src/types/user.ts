/**
 * 👤 USER TYPES
 * Types pour les utilisateurs et profils
 */

export type UserRole = 'practitioner' | 'club_admin' | 'platform_admin';
export type UserProfile = 'jeune_ninja' | 'ninja_confirme';
export type SubscriptionStatus = 'free' | 'trial' | 'active' | 'cancelled' | 'lifetime_free';

export interface UserGamification {
  xp: number;
  level: number;
  streak: number;
  lastActivity: Date;
  badges: string[];
  completedTechniques: string[];
  virtuesProgress: Record<string, number>;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profile: UserProfile;
  role: UserRole;
  sport: string;
  grade: string;
  locale: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan?: string;
  clubId?: string;
  gamification: UserGamification;
  createdAt: Date;
  updatedAt: Date;
}

export interface Club {
  id: string;
  name: string;
  email: string;
  city: string;
  address?: string;
  phone?: string;
  website?: string;
  sport: string;
  federation?: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan?: string;
  adminIds: string[];
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClubMember {
  id: string;
  clubId: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  birthDate?: Date;
  memberSince: Date;
  licenseNumber?: string;
  cotisationStatus: 'paid' | 'pending' | 'overdue';
  documents: {
    medicalCertificate?: { url: string; expiresAt: Date };
    license?: { url: string; season: string };
  };
}
