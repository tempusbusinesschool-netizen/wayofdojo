/**
 * 📅 STAGE MODEL
 * Modèle MongoDB pour les stages et séminaires
 */

import mongoose, { Schema, Document } from 'mongoose';

export type StageLevel = 'tous' | 'debutant' | 'intermediaire' | 'avance';
export type StageStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export interface IStage extends Document {
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  city: string;
  country: string;
  sensei: string;
  senseiTitle?: string;
  senseiImage?: string;
  level: StageLevel;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  currency: string;
  image?: string;
  tags: string[];
  isFeatured: boolean;
  status: StageStatus;
  sport: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StageSchema = new Schema<IStage>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, default: 'France' },
    sensei: { type: String, required: true },
    senseiTitle: { type: String },
    senseiImage: { type: String },
    level: {
      type: String,
      enum: ['tous', 'debutant', 'intermediaire', 'avance'],
      default: 'tous'
    },
    maxParticipants: { type: Number, required: true, default: 50 },
    currentParticipants: { type: Number, default: 0 },
    price: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'EUR' },
    image: { type: String },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['draft', 'published', 'cancelled', 'completed'],
      default: 'draft'
    },
    sport: { type: String, default: 'aikido' },
    createdBy: { type: String },
  },
  {
    timestamps: true,
  }
);

// Index for searching
StageSchema.index({ title: 'text', city: 'text', sensei: 'text' });
StageSchema.index({ date: 1, status: 1 });
StageSchema.index({ sport: 1, status: 1 });

export const Stage = mongoose.models.Stage || mongoose.model<IStage>('Stage', StageSchema);
export default Stage;
