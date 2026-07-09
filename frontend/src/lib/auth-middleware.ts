/**
 * 🔐 AUTH MIDDLEWARE
 * Middleware pour vérifier l'authentification et les rôles
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import dbConnect from './db';
import { User } from './models/user.model';

export type UserRole = 'user' | 'club_admin' | 'admin' | 'super_admin';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

/**
 * Vérifie le token JWT et retourne l'utilisateur
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return null;
  }

  try {
    await dbConnect();
    const user = await User.findById(decoded.userId).select('email role firstName lastName');
    
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role || 'user',
      firstName: user.firstName,
      lastName: user.lastName,
    };
  } catch {
    return null;
  }
}

/**
 * Vérifie si l'utilisateur a le rôle requis
 */
export function hasRole(user: AuthenticatedUser | null, requiredRoles: UserRole[]): boolean {
  if (!user) return false;
  
  // super_admin a accès à tout
  if (user.role === 'super_admin') return true;
  
  // admin a accès à tout sauf super_admin
  if (user.role === 'admin' && !requiredRoles.includes('super_admin')) return true;
  
  return requiredRoles.includes(user.role);
}

/**
 * Middleware pour protéger les routes API
 */
export async function requireAuth(
  request: NextRequest,
  requiredRoles?: UserRole[]
): Promise<{ user: AuthenticatedUser } | { error: NextResponse }> {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return {
      error: NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      ),
    };
  }

  if (requiredRoles && !hasRole(user, requiredRoles)) {
    return {
      error: NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      ),
    };
  }

  return { user };
}

/**
 * Hiérarchie des rôles pour l'affichage
 */
export const ROLE_HIERARCHY: Record<UserRole, { level: number; label: string; color: string }> = {
  user: { level: 1, label: 'Pratiquant', color: 'slate' },
  club_admin: { level: 2, label: 'Admin Club', color: 'blue' },
  admin: { level: 3, label: 'Administrateur', color: 'violet' },
  super_admin: { level: 4, label: 'Super Admin', color: 'amber' },
};
