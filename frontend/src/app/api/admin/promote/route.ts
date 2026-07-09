/**
 * 🛡️ PROMOTE TO ADMIN API
 * Route protégée pour promouvoir un utilisateur en admin
 * Utilise un secret pour la première création d'admin
 */

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models/user.model';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'wayofdojo-admin-2025';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, secret, role = 'admin' } = body;

    // Vérifier le secret
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Secret invalide' },
        { status: 403 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Vérifier que le rôle est valide
    const validRoles = ['admin', 'super_admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Rôle invalide. Utilisez "admin" ou "super_admin"' },
        { status: 400 }
      );
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Utilisateur ${user.email} promu en ${role}`,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Promote admin error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
