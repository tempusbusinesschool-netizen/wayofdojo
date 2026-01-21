'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, BarChart3, Settings, LogOut, Home,
  TrendingUp, UserCheck, Crown, Activity, Search,
  ChevronRight, Flame, Star, Building2, Globe,
  Plus, Trash2, MapPin, UserPlus, ChevronDown, ChevronUp,
  Mail, Phone, Calendar, Award, Eye, EyeOff, X,
  Download, CheckCircle2, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import apiService from '@/services/api.service';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

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
  dojo_id?: string;
}

interface Dojo {
  id: string;
  name: string;
  city?: string;
  address?: string;
  description?: string;
  members_count?: number;
  is_default?: boolean;
}

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  belt?: string;
}

type TabType = 'dashboard' | 'users' | 'dojos' | 'annuaire' | 'settings';

// ═══════════════════════════════════════════════════════════════════════════
// DONNÉES STATIQUES
// ═══════════════════════════════════════════════════════════════════════════

const REGIONS_FRANCE: Record<string, { name: string; emoji: string }> = {
  idf: { name: 'Île-de-France', emoji: '🗼' },
  ara: { name: 'Auvergne-Rhône-Alpes', emoji: '⛰️' },
  bfc: { name: 'Bourgogne-Franche-Comté', emoji: '🍇' },
  bretagne: { name: 'Bretagne', emoji: '⚓' },
  cvl: { name: 'Centre-Val de Loire', emoji: '🏰' },
  corse: { name: 'Corse', emoji: '🏝️' },
  grand_est: { name: 'Grand Est', emoji: '🏛️' },
  hdf: { name: 'Hauts-de-France', emoji: '🏭' },
  normandie: { name: 'Normandie', emoji: '🍎' },
  nouvelle_aquitaine: { name: 'Nouvelle-Aquitaine', emoji: '🍷' },
  occitanie: { name: 'Occitanie', emoji: '☀️' },
  pdl: { name: 'Pays de la Loire', emoji: '🌊' },
  paca: { name: 'Provence-Alpes-Côte d\'Azur', emoji: '🌴' },
};

const CLUBS_AIKIDO_FRANCE = [
  { id: 'aspp-paris', name: 'A.S.P.P. Aïkibudo', city: 'Paris 5e', region: 'idf', address: '4 rue des Arènes, 75005 Paris', federation: 'FFAAA' },
  { id: 'ifa-alesia', name: 'Institut Français d\'Aïkido - Dojo Alésia', city: 'Paris 14e', region: 'idf', address: '3 Villa d\'Orléans, 75014 Paris', federation: 'FFAAA' },
  { id: 'dokan-rennes', name: 'Association Dokan Rennes', city: 'Rennes', region: 'bretagne', address: '8 passage du Couëdic', federation: 'FFAAA' },
  { id: 'aikido-lyon', name: 'Aïkido Club de Lyon', city: 'Lyon', region: 'ara', federation: 'FFAAA' },
  { id: 'aikido-marseille', name: 'Aïkido Marseille', city: 'Marseille', region: 'paca', federation: 'FFAAA' },
  { id: 'aikido-bordeaux', name: 'Aïkido Bordeaux', city: 'Bordeaux', region: 'nouvelle_aquitaine', federation: 'FFAAA' },
  { id: 'aikido-toulouse', name: 'Aïkido Toulouse', city: 'Toulouse', region: 'occitanie', federation: 'FFAAA' },
  { id: 'aikido-nantes', name: 'Aïkido Nantes', city: 'Nantes', region: 'pdl', federation: 'FFAAA' },
  { id: 'aikido-nice', name: 'Aïkido Nice', city: 'Nice', region: 'paca', federation: 'FFAAA' },
  { id: 'aikido-strasbourg', name: 'Aïkido Strasbourg', city: 'Strasbourg', region: 'grand_est', federation: 'FFAAA' },
];

const BELT_OPTIONS = [
  { value: '6e Kyu', label: '6e Kyu - Ceinture blanche', color: '#FFFFFF' },
  { value: '5e Kyu', label: '5e Kyu - Ceinture jaune', color: '#FFD700' },
  { value: '4e Kyu', label: '4e Kyu - Ceinture orange', color: '#FFA500' },
  { value: '3e Kyu', label: '3e Kyu - Ceinture verte', color: '#228B22' },
  { value: '2e Kyu', label: '2e Kyu - Ceinture bleue', color: '#1E90FF' },
  { value: '1er Kyu', label: '1er Kyu - Ceinture marron', color: '#8B4513' },
  { value: 'Shodan', label: 'Shodan - 1er Dan', color: '#000000' },
  { value: 'Nidan', label: 'Nidan - 2e Dan', color: '#000000' },
  { value: '3e Dan', label: '3e Dan', color: '#000000' },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export default function AdminPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  // États généraux
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentUser, setCurrentUser] = useState<{ role: string; firstName: string } | null>(null);

  // États Dashboard
  const [stats, setStats] = useState<AdminStats | null>(null);

  // États Users
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // États Dojos
  const [dojos, setDojos] = useState<Dojo[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedDojo, setExpandedDojo] = useState<string | null>(null);
  const [dojoMembers, setDojoMembers] = useState<Record<string, Member[]>>({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    admin_password: ''
  });

  // États Adhérents
  const [showAddMember, setShowAddMember] = useState<string | null>(null);
  const [memberFormData, setMemberFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    belt: '6e Kyu',
    birth_date: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // États Annuaire
  const [annuaireSearch, setAnnuaireSearch] = useState('');
  const [annuaireRegion, setAnnuaireRegion] = useState('all');
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);

  // Statistiques calculées
  const regionStats = useMemo(() => {
    const stats: Record<string, { count: number }> = {};
    CLUBS_AIKIDO_FRANCE.forEach(club => {
      if (!stats[club.region]) stats[club.region] = { count: 0 };
      stats[club.region].count++;
    });
    return stats;
  }, []);

  const filteredClubs = useMemo(() => {
    return CLUBS_AIKIDO_FRANCE.filter(club => {
      const matchesSearch = annuaireSearch === '' ||
        club.name.toLowerCase().includes(annuaireSearch.toLowerCase()) ||
        club.city.toLowerCase().includes(annuaireSearch.toLowerCase());
      const matchesRegion = annuaireRegion === 'all' || club.region === annuaireRegion;
      return matchesSearch && matchesRegion;
    });
  }, [annuaireSearch, annuaireRegion]);

  const totalDojoMembers = dojos.reduce((acc, d) => acc + (d.members_count || 0), 0);

  // ═══════════════════════════════════════════════════════════════════════════
  // EFFETS & FONCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

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
      const userData = await apiService.getCurrentUser() as { 
        success: boolean; 
        user: { role: string; firstName: string } 
      };
      const userRole = userData.user.role;

      if (!['admin', 'super_admin'].includes(userRole)) {
        router.push(`/${locale}/aikido/dojo`);
        return;
      }

      setCurrentUser({ role: userRole, firstName: userData.user.firstName });
      setAuthorized(true);

      await Promise.all([loadStats(), loadUsers(), fetchDojos()]);
    } catch (error) {
      console.error('Admin access check error:', error);
      router.push(`/${locale}/aikido/login`);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await apiService.getAdminStats() as { success: boolean; stats: AdminStats };
      if (data.success) setStats(data.stats);
    } catch (error) {
      console.error('Load stats error:', error);
    }
  };

  const loadUsers = async (search = '') => {
    try {
      const data = await apiService.getUsers({ search }) as { success: boolean; users: User[] };
      if (data.success) setUsers(data.users);
    } catch (error) {
      console.error('Load users error:', error);
    }
  };

  const fetchDojos = async () => {
    try {
      const response = await apiService.request('/dojos', { method: 'GET' }) as { dojos: Dojo[] };
      setDojos(response.dojos || []);
    } catch (error) {
      console.error('Error fetching dojos:', error);
    }
  };

  const fetchDojoMembers = async (dojoId: string) => {
    try {
      const response = await apiService.request('/users', { method: 'GET' }) as { users: Member[] };
      const members = (response.users || []).filter((u: Member & { dojo_id?: string }) => u.dojo_id === dojoId);
      setDojoMembers(prev => ({ ...prev, [dojoId]: members }));
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await apiService.updateUserRole(userId, newRole) as { success: boolean };
      if (response.success) await loadUsers(searchQuery);
    } catch (error) {
      console.error('Role change error:', error);
    }
  };

  const handleSearch = () => loadUsers(searchQuery);

  const handleLogout = () => {
    localStorage.removeItem('wayofdojo_token');
    localStorage.removeItem('wayofdojo_user');
    router.push(`/${locale}`);
  };

  const handleCreateDojo = async () => {
    if (!formData.name || !formData.admin_password) {
      toast.error('Nom et mot de passe admin requis');
      return;
    }

    try {
      await apiService.request('/dojos', {
        method: 'POST',
        body: JSON.stringify({
          dojo: formData,
          auth: { super_admin_password: '123456' }
        })
      });
      toast.success('Dojo créé avec succès !');
      await fetchDojos();
      resetDojoForm();
    } catch {
      toast.error('Erreur lors de la création');
    }
  };

  const handleDeleteDojo = async (dojoId: string, dojoName: string) => {
    if (!window.confirm(`Supprimer le dojo "${dojoName}" ?`)) return;

    try {
      await apiService.request(`/dojos/${dojoId}`, {
        method: 'DELETE',
        body: JSON.stringify({ super_admin_password: '123456' })
      });
      toast.success('Dojo supprimé');
      setDojos(dojos.filter(d => d.id !== dojoId));
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleCreateMember = async (dojoId: string) => {
    if (!memberFormData.first_name || !memberFormData.last_name || !memberFormData.email || !memberFormData.password) {
      toast.error('Prénom, nom, email et mot de passe requis');
      return;
    }

    try {
      await apiService.register({
        firstName: memberFormData.first_name,
        lastName: memberFormData.last_name,
        email: memberFormData.email,
        password: memberFormData.password,
        grade: memberFormData.belt,
      });
      toast.success(`Adhérent ${memberFormData.first_name} ${memberFormData.last_name} créé !`);
      resetMemberForm();
      setShowAddMember(null);
      fetchDojoMembers(dojoId);
      fetchDojos();
    } catch {
      toast.error('Erreur lors de la création');
    }
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setMemberFormData({ ...memberFormData, password });
  };

  const resetDojoForm = () => {
    setFormData({ name: '', description: '', address: '', city: '', admin_password: '' });
    setShowCreateForm(false);
  };

  const resetMemberForm = () => {
    setMemberFormData({
      first_name: '', last_name: '', email: '', phone: '',
      password: '', belt: '6e Kyu', birth_date: ''
    });
  };

  const toggleDojoExpand = (dojoId: string) => {
    if (expandedDojo === dojoId) {
      setExpandedDojo(null);
    } else {
      setExpandedDojo(dojoId);
      if (!dojoMembers[dojoId]) fetchDojoMembers(dojoId);
    }
  };

  const toggleClubSelection = (clubId: string) => {
    setSelectedClubs(prev =>
      prev.includes(clubId) ? prev.filter(id => id !== clubId) : [...prev, clubId]
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CONSTANTES UI
  // ═══════════════════════════════════════════════════════════════════════════

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

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: BarChart3, color: 'from-violet-500 to-purple-500' },
    { id: 'users' as TabType, label: 'Utilisateurs', icon: Users, color: 'from-cyan-500 to-blue-500' },
    { id: 'dojos' as TabType, label: `Dojos (${dojos.length})`, icon: Building2, color: 'from-orange-500 to-amber-500' },
    { id: 'annuaire' as TabType, label: 'Annuaire FFAAA', icon: Globe, color: 'from-emerald-500 to-green-500' },
    { id: 'settings' as TabType, label: 'Paramètres', icon: Settings, color: 'from-slate-500 to-slate-600' },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // LOADING & AUTH CHECK
  // ═══════════════════════════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

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
              <span className="text-lg font-bold text-white">Espace Administration</span>
              <p className="text-xs text-violet-300">
                {currentUser?.role === 'super_admin' ? '👑 Super Admin' : '🛡️ Administrateur'} • Cadre • Contrôle • Conformité
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <Button onClick={() => Promise.all([loadStats(), loadUsers(), fetchDojos()])} variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <RefreshCw className="w-4 h-4" />
            </Button>
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
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id 
                ? `bg-gradient-to-r ${tab.color} text-white shadow-lg` 
                : 'text-slate-300 hover:text-white hover:bg-white/10'
              }
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* TAB: DASHBOARD */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'dashboard' && stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-2xl p-5 border border-violet-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-violet-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Total Utilisateurs</span>
                </div>
                <p className="text-3xl font-black text-white">{stats.totalUsers}</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 rounded-2xl p-5 border border-emerald-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Nouveaux (7j)</span>
                </div>
                <p className="text-3xl font-black text-emerald-400">+{stats.newUsersThisWeek}</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-2xl p-5 border border-cyan-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Actifs (7j)</span>
                </div>
                <p className="text-3xl font-black text-cyan-400">{stats.activeUsers}</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-2xl p-5 border border-amber-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Dojos</span>
                </div>
                <p className="text-3xl font-black text-amber-400">{dojos.length}</p>
              </motion.div>
            </div>

            {/* Top Users & Distribution */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  Top 10 par XP
                </h3>
                <div className="space-y-3">
                  {stats.topUsersByXp.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-amber-500 text-slate-900' :
                          index === 1 ? 'bg-slate-400 text-slate-900' :
                          index === 2 ? 'bg-orange-600 text-white' : 'bg-slate-600 text-white'
                        }`}>{index + 1}</span>
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

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-cyan-400" />
                  Distribution
                </h3>
                
                <div className="mb-6">
                  <p className="text-slate-400 text-sm mb-3">Par profil</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm">🥷 Samouraï Confirmé</span>
                      <span className="text-cyan-400 font-bold">{stats.usersByProfile.samourai_confirme || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm">🎒 Jeune Samouraï</span>
                      <span className="text-amber-400 font-bold">{stats.usersByProfile.jeune_samourai || 0}</span>
                    </div>
                  </div>
                </div>

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

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* TAB: USERS */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
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
              <Button onClick={handleSearch} className="bg-violet-600 hover:bg-violet-500">Rechercher</Button>
            </div>

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
                        <td className="px-4 py-3"><span className="text-white">{user.grade}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-amber-400 flex items-center gap-1"><Star className="w-3 h-3" /> {user.gamification?.xp || 0}</span>
                            <span className="text-orange-400 flex items-center gap-1"><Flame className="w-3 h-3" /> {user.gamification?.streak || 0}</span>
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
                            {currentUser?.role === 'super_admin' && <option value="super_admin">Super Admin</option>}
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

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* TAB: DOJOS */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'dojos' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-orange-500/20 rounded-xl p-4 border border-orange-500/30 text-center">
                <p className="text-3xl font-black text-orange-400">{dojos.length}</p>
                <p className="text-slate-400 text-sm">Dojos</p>
              </div>
              <div className="bg-emerald-500/20 rounded-xl p-4 border border-emerald-500/30 text-center">
                <p className="text-3xl font-black text-emerald-400">{totalDojoMembers}</p>
                <p className="text-slate-400 text-sm">Adhérents</p>
              </div>
              <div className="bg-cyan-500/20 rounded-xl p-4 border border-cyan-500/30 text-center">
                <p className="text-3xl font-black text-cyan-400">{dojos.length > 0 ? Math.round(totalDojoMembers / dojos.length) : 0}</p>
                <p className="text-slate-400 text-sm">Moyenne/dojo</p>
              </div>
            </div>

            {/* Formulaire création */}
            <AnimatePresence>
              {showCreateForm ? (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <Card className="bg-blue-900/20 border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="text-blue-300 flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Créer un nouveau dojo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-slate-400 mb-1 block">Nom du dojo *</label>
                          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Aikido Paris" className="bg-slate-800/50 border-slate-600 text-white" />
                        </div>
                        <div>
                          <label className="text-sm text-slate-400 mb-1 block">Ville</label>
                          <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Paris" className="bg-slate-800/50 border-slate-600 text-white" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Adresse</label>
                        <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="123 rue de l'Aïkido" className="bg-slate-800/50 border-slate-600 text-white" />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Description</label>
                        <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description du dojo..." className="bg-slate-800/50 border-slate-600 text-white min-h-[80px]" />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Mot de passe Admin *</label>
                        <Input type="password" value={formData.admin_password} onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })} placeholder="Mot de passe pour les admins" className="bg-slate-800/50 border-slate-600 text-white" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button onClick={handleCreateDojo} className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500">
                          <Plus className="w-4 h-4 mr-2" />Créer le dojo
                        </Button>
                        <Button onClick={resetDojoForm} variant="ghost" className="text-slate-400">Annuler</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Button onClick={() => setShowCreateForm(true)} className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-4 text-lg">
                  <Plus className="w-5 h-5 mr-2" />Créer un nouveau dojo
                </Button>
              )}
            </AnimatePresence>

            {/* Liste des dojos */}
            {dojos.length === 0 ? (
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="text-center py-16">
                  <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-300 font-semibold text-lg mb-2">Aucun dojo</p>
                  <p className="text-slate-500">Créez votre premier dojo pour commencer</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {dojos.map((dojo) => (
                  <motion.div key={dojo.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className={`overflow-hidden border transition-all ${dojo.is_default ? 'bg-gradient-to-r from-amber-900/30 to-yellow-900/20 border-amber-500/50' : 'bg-slate-800/50 border-slate-700 hover:border-orange-500/30'}`}>
                      <div className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${dojo.is_default ? 'bg-gradient-to-br from-amber-500 to-yellow-500' : 'bg-gradient-to-br from-orange-500 to-red-500'}`}>
                              <Building2 className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xl font-bold text-white">{dojo.name}</h3>
                                {dojo.is_default && <Badge className="bg-amber-500 text-white">Par défaut</Badge>}
                              </div>
                              {dojo.city && <p className="text-slate-400 flex items-center gap-1 mt-1"><MapPin className="w-4 h-4" />{dojo.city}</p>}
                              {dojo.description && <p className="text-slate-500 text-sm mt-2">{dojo.description}</p>}
                              <div className="flex items-center gap-4 mt-3">
                                <span className="text-orange-400 flex items-center gap-1 font-medium">
                                  <Users className="w-4 h-4" />
                                  {dojo.members_count || 0} adhérent{(dojo.members_count || 0) > 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => { if (showAddMember === dojo.id) setShowAddMember(null); else { setShowAddMember(dojo.id); resetMemberForm(); } }} className="bg-emerald-600 hover:bg-emerald-500 text-white" size="sm">
                              <UserPlus className="w-4 h-4 mr-1" />Adhérent
                            </Button>
                            <Button onClick={() => toggleDojoExpand(dojo.id)} variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                              {expandedDojo === dojo.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                            {!dojo.is_default && (
                              <Button onClick={() => handleDeleteDojo(dojo.id, dojo.name)} variant="outline" size="sm" className="border-red-500/50 text-red-400 hover:bg-red-900/30">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Formulaire création adhérent */}
                      <AnimatePresence>
                        {showAddMember === dojo.id && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-emerald-500/30">
                            <div className="p-5 bg-emerald-900/20">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-emerald-300 flex items-center gap-2"><UserPlus className="w-5 h-5" />Nouvel adhérent pour {dojo.name}</h4>
                                <button onClick={() => setShowAddMember(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="text-sm text-slate-400 mb-1 block">Prénom *</label>
                                  <Input value={memberFormData.first_name} onChange={(e) => setMemberFormData({ ...memberFormData, first_name: e.target.value })} placeholder="Jean" className="bg-slate-800/50 border-slate-600 text-white" />
                                </div>
                                <div>
                                  <label className="text-sm text-slate-400 mb-1 block">Nom *</label>
                                  <Input value={memberFormData.last_name} onChange={(e) => setMemberFormData({ ...memberFormData, last_name: e.target.value })} placeholder="Dupont" className="bg-slate-800/50 border-slate-600 text-white" />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="text-sm text-slate-400 mb-1 block flex items-center gap-1"><Mail className="w-3 h-3" /> Email *</label>
                                  <Input type="email" value={memberFormData.email} onChange={(e) => setMemberFormData({ ...memberFormData, email: e.target.value })} placeholder="jean.dupont@email.com" className="bg-slate-800/50 border-slate-600 text-white" />
                                </div>
                                <div>
                                  <label className="text-sm text-slate-400 mb-1 block flex items-center gap-1"><Phone className="w-3 h-3" /> Téléphone</label>
                                  <Input value={memberFormData.phone} onChange={(e) => setMemberFormData({ ...memberFormData, phone: e.target.value })} placeholder="06 12 34 56 78" className="bg-slate-800/50 border-slate-600 text-white" />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="text-sm text-slate-400 mb-1 block flex items-center gap-1"><Award className="w-3 h-3" /> Grade</label>
                                  <select value={memberFormData.belt} onChange={(e) => setMemberFormData({ ...memberFormData, belt: e.target.value })} className="w-full h-10 px-3 bg-slate-800/50 border border-slate-600 rounded-md text-white">
                                    {BELT_OPTIONS.map(belt => <option key={belt.value} value={belt.value}>{belt.label}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label className="text-sm text-slate-400 mb-1 block flex items-center gap-1"><Calendar className="w-3 h-3" /> Date de naissance</label>
                                  <Input type="date" value={memberFormData.birth_date} onChange={(e) => setMemberFormData({ ...memberFormData, birth_date: e.target.value })} className="bg-slate-800/50 border-slate-600 text-white" />
                                </div>
                              </div>
                              <div className="mb-4">
                                <label className="text-sm text-slate-400 mb-1 block">Mot de passe *</label>
                                <div className="flex gap-2">
                                  <div className="relative flex-1">
                                    <Input type={showPassword ? 'text' : 'password'} value={memberFormData.password} onChange={(e) => setMemberFormData({ ...memberFormData, password: e.target.value })} placeholder="Mot de passe" className="bg-slate-800/50 border-slate-600 text-white pr-10" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                  </div>
                                  <Button type="button" onClick={generatePassword} variant="outline" className="border-slate-600 text-slate-300"><RefreshCw className="w-4 h-4" /></Button>
                                </div>
                              </div>
                              <Button onClick={() => handleCreateMember(dojo.id)} className="w-full bg-gradient-to-r from-emerald-500 to-green-500">
                                <UserPlus className="w-4 h-4 mr-2" />Créer l&apos;adhérent
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Liste membres */}
                      <AnimatePresence>
                        {expandedDojo === dojo.id && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-slate-600/50">
                            <div className="p-5 bg-slate-900/30">
                              <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4" />Membres du dojo ({dojoMembers[dojo.id]?.length || 0})
                              </h4>
                              {!dojoMembers[dojo.id] ? (
                                <div className="text-center py-6"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
                              ) : dojoMembers[dojo.id].length === 0 ? (
                                <p className="text-slate-500 text-center py-6">Aucun membre inscrit</p>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {dojoMembers[dojo.id].map((member) => (
                                    <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: BELT_OPTIONS.find(b => b.value === member.belt)?.color || '#666', color: member.belt?.includes('Kyu') && !member.belt?.includes('1er') ? '#000' : '#fff' }}>
                                        {member.first_name?.[0]}{member.last_name?.[0]}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{member.first_name} {member.last_name}</p>
                                        <p className="text-slate-500 text-xs truncate">{member.email}</p>
                                        <Badge className="mt-1 text-xs" variant="outline">{member.belt || '6e Kyu'}</Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* TAB: ANNUAIRE FFAAA */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'annuaire' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Stats régions */}
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2">
              {Object.entries(REGIONS_FRANCE).map(([key, region]) => {
                const count = regionStats[key]?.count || 0;
                if (count === 0) return null;
                return (
                  <button key={key} onClick={() => setAnnuaireRegion(annuaireRegion === key ? 'all' : key)} className={`p-2 rounded-lg text-center transition-all ${annuaireRegion === key ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                    <span className="text-lg">{region.emoji}</span>
                    <p className="text-xs font-medium truncate">{region.name.split(' ')[0]}</p>
                    <p className="text-xs opacity-70">{count}</p>
                  </button>
                );
              })}
            </div>

            {/* Recherche */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input value={annuaireSearch} onChange={(e) => setAnnuaireSearch(e.target.value)} placeholder="Rechercher un club par nom ou ville..." className="pl-10 bg-slate-800 border-slate-700 text-white" />
              </div>
              <select value={annuaireRegion} onChange={(e) => setAnnuaireRegion(e.target.value)} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                <option value="all">Toutes les régions ({CLUBS_AIKIDO_FRANCE.length})</option>
                {Object.entries(REGIONS_FRANCE).map(([key, region]) => {
                  const count = regionStats[key]?.count || 0;
                  return <option key={key} value={key}>{region.emoji} {region.name} ({count})</option>;
                })}
              </select>
            </div>

            <p className="text-slate-400 text-sm">{filteredClubs.length} club(s) trouvé(s)</p>

            {/* Liste clubs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredClubs.map(club => {
                const region = REGIONS_FRANCE[club.region];
                const isSelected = selectedClubs.includes(club.id);
                return (
                  <div key={club.id} onClick={() => toggleClubSelection(club.id)} className={`p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-blue-900/30 border-blue-500/50 ring-2 ring-blue-500/30' : 'bg-slate-800/50 border-slate-700 hover:border-blue-500/30'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                          <h4 className="text-white font-medium truncate">{club.name}</h4>
                        </div>
                        <p className="text-slate-400 text-sm flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{club.city}</p>
                        {club.address && <p className="text-slate-500 text-xs mt-1 truncate">{club.address}</p>}
                      </div>
                      <Badge variant="outline" className="text-xs flex-shrink-0">{region?.emoji} {club.federation}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions import */}
            {selectedClubs.length > 0 && (
              <div className="sticky bottom-4 p-4 bg-emerald-900/90 backdrop-blur-lg border border-emerald-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">{selectedClubs.length} club(s) sélectionné(s)</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setSelectedClubs([])} variant="outline" size="sm" className="border-slate-600 text-slate-300">Annuler</Button>
                  <Button onClick={() => { toast.success(`${selectedClubs.length} club(s) importé(s) !`); setSelectedClubs([]); }} className="bg-emerald-500 hover:bg-emerald-400" size="sm">
                    <Download className="w-4 h-4 mr-2" />Importer
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* TAB: SETTINGS */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Paramètres</h3>
            <p className="text-slate-400">Les paramètres avancés seront disponibles prochainement.</p>
            
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-700/50 border border-slate-600">
                <h4 className="text-white font-semibold mb-2">🌍 Internationalisation</h4>
                <p className="text-slate-400 text-sm">Gérer les traductions et les langues supportées.</p>
                <Button variant="outline" size="sm" className="mt-3" disabled><ChevronRight className="w-4 h-4 mr-2" />Bientôt disponible</Button>
              </div>
              
              <div className="p-4 rounded-xl bg-slate-700/50 border border-slate-600">
                <h4 className="text-white font-semibold mb-2">💳 Abonnements</h4>
                <p className="text-slate-400 text-sm">Configuration des plans Stripe et tarification.</p>
                <Button variant="outline" size="sm" className="mt-3" disabled><ChevronRight className="w-4 h-4 mr-2" />Bientôt disponible</Button>
              </div>
              
              <div className="p-4 rounded-xl bg-slate-700/50 border border-slate-600">
                <h4 className="text-white font-semibold mb-2">🎮 Gamification</h4>
                <p className="text-slate-400 text-sm">Configurer les points XP, badges et défis.</p>
                <Button variant="outline" size="sm" className="mt-3" disabled><ChevronRight className="w-4 h-4 mr-2" />Bientôt disponible</Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
