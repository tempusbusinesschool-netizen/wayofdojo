/**
 * 🛡️ ADMIN STATS API
 * Statistiques globales pour le dashboard admin
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models/user.model';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request, ['admin', 'super_admin']);
  
  if ('error' in authResult) {
    return authResult.error;
  }

  try {
    await dbConnect();

    // Statistiques des utilisateurs
    const totalUsers = await User.countDocuments();
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    const usersByProfile = await User.aggregate([
      { $group: { _id: '$profile', count: { $sum: 1 } } }
    ]);
    const usersBySubscription = await User.aggregate([
      { $group: { _id: '$subscriptionStatus', count: { $sum: 1 } } }
    ]);

    // Utilisateurs récents (7 derniers jours)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });

    // Utilisateurs actifs (dernière activité dans les 7 jours)
    const activeUsers = await User.countDocuments({
      'gamification.lastActivity': { $gte: oneWeekAgo }
    });

    // Top utilisateurs par XP
    const topUsersByXp = await User.find()
      .select('firstName lastName email gamification.xp gamification.level grade')
      .sort({ 'gamification.xp': -1 })
      .limit(10);

    // Distribution par grade
    const usersByGrade = await User.aggregate([
      { $group: { _id: '$grade', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        newUsersThisWeek,
        activeUsers,
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id || 'user'] = item.count;
          return acc;
        }, {} as Record<string, number>),
        usersByProfile: usersByProfile.reduce((acc, item) => {
          acc[item._id || 'ninja_confirme'] = item.count;
          return acc;
        }, {} as Record<string, number>),
        usersBySubscription: usersBySubscription.reduce((acc, item) => {
          acc[item._id || 'free'] = item.count;
          return acc;
        }, {} as Record<string, number>),
        usersByGrade: usersByGrade.map(item => ({
          grade: item._id || '6e_kyu',
          count: item.count
        })),
        topUsersByXp: topUsersByXp.map(user => ({
          id: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          xp: user.gamification?.xp || 0,
          level: user.gamification?.level || 1,
          grade: user.grade,
        })),
      },
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
