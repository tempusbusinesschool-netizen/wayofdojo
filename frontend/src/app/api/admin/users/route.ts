/**
 * 🛡️ ADMIN USERS API
 * Gestion des utilisateurs par les administrateurs
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, UserRole } from '@/lib/auth-middleware';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models/user.model';

// GET - Liste des utilisateurs
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request, ['admin', 'super_admin']);
  
  if ('error' in authResult) {
    return authResult.error;
  }

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') as UserRole | null;

    const query: Record<string, unknown> = {};
    
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) {
      query.role = role;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || 'user',
        profile: user.profile,
        sport: user.sport,
        grade: user.grade,
        subscriptionStatus: user.subscriptionStatus,
        gamification: user.gamification,
        createdAt: user.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour le rôle d'un utilisateur
export async function PATCH(request: NextRequest) {
  const authResult = await requireAuth(request, ['admin', 'super_admin']);
  
  if ('error' in authResult) {
    return authResult.error;
  }

  try {
    await dbConnect();

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'userId et role requis' },
        { status: 400 }
      );
    }

    // Vérifier que le rôle est valide
    const validRoles: UserRole[] = ['user', 'club_admin', 'admin', 'super_admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Rôle invalide' },
        { status: 400 }
      );
    }

    // Seul super_admin peut créer d'autres super_admin
    if (role === 'super_admin' && authResult.user.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Seul un super admin peut créer d\'autres super admins' },
        { status: 403 }
      );
    }

    const user = await User.findByIdAndUpdate(
      userId,
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
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Update user role error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
