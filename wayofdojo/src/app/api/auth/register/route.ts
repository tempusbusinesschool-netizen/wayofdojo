/**
 * 🔐 REGISTER API ROUTE
 */

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models/user.model';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Debug: Check environment variable
    const mongoUri = process.env.MONGODB_URI;
    console.log('MONGODB_URI exists:', !!mongoUri);
    console.log('MONGODB_URI starts with:', mongoUri?.substring(0, 20));
    
    await dbConnect();
    
    const body = await request.json();
    const { email, password, firstName, lastName, profile, sport, grade, locale } = body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cet email' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      profile: profile || 'ninja_confirme',
      sport: sport || 'aikido',
      grade: grade || '6e_kyu',
      locale: locale || 'fr',
      subscriptionStatus: 'free',
      gamification: {
        xp: 0,
        level: 1,
        streak: 0,
        lastActivity: new Date(),
        badges: ['first_steps'],
        completedTechniques: [],
        virtuesProgress: {},
      },
    });

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || 'user',
        profile: user.profile,
        sport: user.sport,
        grade: user.grade,
        locale: user.locale,
        subscriptionStatus: user.subscriptionStatus,
        gamification: user.gamification,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' },
      { status: 500 }
    );
  }
}
