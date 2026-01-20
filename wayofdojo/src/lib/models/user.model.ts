/**
 * 🔐 USER MODEL - MongoDB Schema
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'club_admin' | 'admin' | 'super_admin';
  profile: 'jeune_ninja' | 'ninja_confirme';
  sport: string;
  grade: string;
  locale: string;
  subscriptionStatus: 'free' | 'trial' | 'active' | 'cancelled' | 'lifetime_free';
  subscriptionPlan?: string;
  clubId?: string;
  gamification: {
    xp: number;
    level: number;
    streak: number;
    lastActivity: Date;
    badges: string[];
    completedTechniques: string[];
    virtuesProgress: Record<string, number>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'club_admin', 'admin', 'super_admin'],
      default: 'user'
    },
    profile: { 
      type: String, 
      enum: ['jeune_ninja', 'ninja_confirme'], 
      default: 'ninja_confirme' 
    },
    sport: { type: String, default: 'aikido' },
    grade: { type: String, default: '6e_kyu' },
    locale: { type: String, default: 'fr' },
    subscriptionStatus: { 
      type: String, 
      enum: ['free', 'trial', 'active', 'cancelled', 'lifetime_free'],
      default: 'free' 
    },
    subscriptionPlan: { type: String },
    clubId: { type: String },
    gamification: {
      xp: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
      streak: { type: Number, default: 0 },
      lastActivity: { type: Date, default: Date.now },
      badges: { type: [String], default: [] },
      completedTechniques: { type: [String], default: [] },
      virtuesProgress: { type: Map, of: Number, default: {} },
    },
  },
  { timestamps: true }
);

// Prevent model recompilation in development
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
