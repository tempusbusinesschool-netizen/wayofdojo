'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Shield, Users, BarChart3, Settings, LogOut, Home,
  TrendingUp, UserCheck, Crown, Activity, Search,
  ChevronRight, Flame, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import apiService from '@/services/api.service';

interface AdminStats {
  totalUsers: number;
  newUsersThisWeek: number;
  activeUsers: number;
  usersByRole: Record<string, number>;
  usersByProfile: Record<string, number>;
  usersBySubscription: Record<string, number>;
  usersByGrade: Array<{ grade: string; count: number }>;
  topUsersByXp: Array<{
    id: string;
    name: string;
    email: string;
    xp: number;
    level: number;
    grade: string;
  }>;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profile: string;
  grade: string;
  subscriptionStatus: string;
  gamification: {
    xp: number;
    level: number;
    streak: number;
  };
  createdAt: string;
}

type TabType = 'dashboard' | 'users' | 'settings';

export default function AdminPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<{ role: string; firstName: string } | null>(null);

  useEffect(() => {
    checkAdminAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAdminAccess = async () => {
    const token = localStorage.getItem('wayofdojo_token');
    if (!token) {
      router.push(`/${locale}/aikido/login`);
      return;
    }

    try {
      // Vérifier le rôle de l'utilisateur
      const userResponse = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!userResponse.ok) {
        router.push(`/${locale}/aikido/login`);
        return;
      }

      const userData = await userResponse.json();
      const userRole = userData.user.role;

      if (!['admin', 'super_admin'].includes(userRole)) {
        router.push(`/${locale}/aikido/dojo`);
        return;
      }

      setCurrentUser({ role: userRole, firstName: userData.user.firstName });
      setAuthorized(true);

      // Charger les stats
      await loadStats(token);
      await loadUsers(token);
    } catch (error) {
      console.error('Admin access check error:', error);
      router.push(`/${locale}/aikido/login`);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (token: string) => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Load stats error:', error);
    }
  };

  const loadUsers = async (token: string, search = '') => {
    try {
      const url = search 
        ? `/api/admin/users?search=${encodeURIComponent(search)}`
        : '/api/admin/users';
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Load users error:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const token = localStorage.getItem('wayofdojo_token');
    if (!token) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, role: newRole })
      });

      if (response.ok) {
        await loadUsers(token, searchQuery);
      }
    } catch (error) {
      console.error('Role change error:', error);
    }
  };

  const handleSearch = () => {
    const token = localStorage.getItem('wayofdojo_token');
    if (token) {
      loadUsers(token, searchQuery);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('wayofdojo_token');
    localStorage.removeItem('wayofdojo_user');
    router.push(`/${locale}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!authorized) return null;

  const roleColors: Record<string, string> = {
    user: 'bg-slate-600',
    club_admin: 'bg-blue-600',
    admin: 'bg-violet-600',
    super_admin: 'bg-amber-600'
  };

  const roleLabels: Record<string, string> = {
    user: 'Pratiquant',
    club_admin: 'Admin Club',
    admin: 'Admin',
    super_admin: 'Super Admin'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-violet-900/80 border-b border-violet-500/20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30"
            >
              <Shield className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <span className="text-lg font-bold text-white">Admin Panel</span>
              <p className="text-xs text-violet-300">
                {currentUser?.role === 'super_admin' ? '👑 Super Admin' : '🛡️ Administrateur'}
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <Link href={`/${locale}/aikido/dojo`}>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <Home className="w-4 h-4 mr-2" />
                Dojo
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'dashboard' as TabType, label: 'Dashboard', icon: BarChart3 },
            { id: 'users' as TabType, label: 'Utilisateurs', icon: Users },
            { id: 'settings' as TabType, label: 'Paramètres', icon: Settings },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id 
                ? 'bg-violet-600 hover:bg-violet-500 text-white' 
                : 'text-slate-300 hover:text-white hover:bg-white/10'
              }
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-2xl p-5 border border-violet-500/30"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-violet-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Total Utilisateurs</span>
                </div>
                <p className="text-3xl font-black text-white">{stats.totalUsers}</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 rounded-2xl p-5 border border-emerald-500/30"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Nouveaux (7j)</span>
                </div>
                <p className="text-3xl font-black text-emerald-400">+{stats.newUsersThisWeek}</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-2xl p-5 border border-cyan-500/30"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Actifs (7j)</span>
                </div>
                <p className="text-3xl font-black text-cyan-400">{stats.activeUsers}</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-2xl p-5 border border-amber-500/30"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Admins</span>
                </div>
                <p className="text-3xl font-black text-amber-400">
                  {(stats.usersByRole.admin || 0) + (stats.usersByRole.super_admin || 0)}
                </p>
              </motion.div>
            </div>

            {/* Top Users & Distribution */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Users by XP */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  Top 10 par XP
                </h3>
                <div className="space-y-3">
                  {stats.topUsersByXp.map((user, index) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-amber-500 text-slate-900' :
                          index === 1 ? 'bg-slate-400 text-slate-900' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-slate-600 text-white'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-white font-semibold text-sm">{user.name}</p>
                          <p className="text-slate-400 text-xs">Niv. {user.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-amber-400 font-bold">{user.xp} XP</p>
                        <p className="text-slate-500 text-xs">{user.grade}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Distribution by Profile */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-cyan-400" />
                  Distribution
                </h3>
                
                {/* Par profil */}
                <div className="mb-6">
                  <p className="text-slate-400 text-sm mb-3">Par profil</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm">🥷 Ninja Confirmé</span>
                      <span className="text-cyan-400 font-bold">{stats.usersByProfile.ninja_confirme || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm">🎒 Jeune Ninja</span>
                      <span className="text-amber-400 font-bold">{stats.usersByProfile.jeune_ninja || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Par abonnement */}
                <div className="mb-6">
                  <p className="text-slate-400 text-sm mb-3">Par abonnement</p>
                  <div className="space-y-2">
                    {Object.entries(stats.usersBySubscription).map(([status, count]) => (
                      <div key={status} className="flex justify-between items-center">
                        <span className="text-white text-sm capitalize">{status.replace('_', ' ')}</span>
                        <span className="text-violet-400 font-bold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Par grade */}
                <div>
                  <p className="text-slate-400 text-sm mb-3">Par grade</p>
                  <div className="grid grid-cols-2 gap-2">
                    {stats.usersByGrade.slice(0, 6).map((item) => (
                      <div key={item.grade} className="flex justify-between items-center bg-slate-700/50 rounded-lg px-3 py-2">
                        <span className="text-white text-xs">{item.grade}</span>
                        <span className="text-emerald-400 font-bold text-sm">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Search */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <Button onClick={handleSearch} className="bg-violet-600 hover:bg-violet-500">
                Rechercher
              </Button>
            </div>

            {/* Users Table */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="text-left px-4 py-3 text-slate-300 text-sm font-semibold">Utilisateur</th>
                      <th className="text-left px-4 py-3 text-slate-300 text-sm font-semibold">Rôle</th>
                      <th className="text-left px-4 py-3 text-slate-300 text-sm font-semibold">Grade</th>
                      <th className="text-left px-4 py-3 text-slate-300 text-sm font-semibold">Stats</th>
                      <th className="text-left px-4 py-3 text-slate-300 text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-white font-semibold">{user.firstName} {user.lastName}</p>
                            <p className="text-slate-400 text-sm">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${roleColors[user.role] || 'bg-slate-600'}`}>
                            {roleLabels[user.role] || user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-white">{user.grade}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-amber-400 flex items-center gap-1">
                              <Star className="w-3 h-3" /> {user.gamification?.xp || 0}
                            </span>
                            <span className="text-orange-400 flex items-center gap-1">
                              <Flame className="w-3 h-3" /> {user.gamification?.streak || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="bg-slate-700 text-white text-sm rounded-lg px-2 py-1 border border-slate-600"
                          >
                            <option value="user">Pratiquant</option>
                            <option value="club_admin">Admin Club</option>
                            <option value="admin">Admin</option>
                            {currentUser?.role === 'super_admin' && (
                              <option value="super_admin">Super Admin</option>
                            )}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
          >
            <h3 className="text-lg font-bold text-white mb-4">Paramètres</h3>
            <p className="text-slate-400">Les paramètres avancés seront disponibles prochainement.</p>
            
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-700/50 border border-slate-600">
                <h4 className="text-white font-semibold mb-2">🌍 Internationalisation</h4>
                <p className="text-slate-400 text-sm">Gérer les traductions et les langues supportées.</p>
                <Button variant="outline" size="sm" className="mt-3" disabled>
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Bientôt disponible
                </Button>
              </div>
              
              <div className="p-4 rounded-xl bg-slate-700/50 border border-slate-600">
                <h4 className="text-white font-semibold mb-2">💳 Abonnements</h4>
                <p className="text-slate-400 text-sm">Configuration des plans Stripe et tarification.</p>
                <Button variant="outline" size="sm" className="mt-3" disabled>
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Bientôt disponible
                </Button>
              </div>
              
              <div className="p-4 rounded-xl bg-slate-700/50 border border-slate-600">
                <h4 className="text-white font-semibold mb-2">🎮 Gamification</h4>
                <p className="text-slate-400 text-sm">Configurer les points XP, badges et défis.</p>
                <Button variant="outline" size="sm" className="mt-3" disabled>
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Bientôt disponible
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
