'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, BarChart3,
  TrendingUp, Crown, Activity, Search,
  ChevronRight, Flame, Star, Globe,
  Plus, Trash2, MapPin, UserPlus, ChevronDown, ChevronUp,
  Mail, Eye, EyeOff, X,
  Download, CheckCircle2, RefreshCw, Filter, MoreVertical,
  Tent, Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import apiService from '@/services/api.service';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ThemeProvider, useTheme } from '@/components/admin/ThemeProvider';
import { 
  StatCard, 
  TopUsersTable, 
  PageHeader
} from '@/components/admin/AdminWidgets';
import {
  UserGrowthChart,
  ActivityChart,
  XPProgressChart,
  DistributionPieChart
} from '@/components/admin/AdminCharts';
import { cn } from '@/lib/utils';

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

interface ClubInfo {
  admin_id: string;
  admin_email: string;
  admin_name: string;
  dojo: {
    id: string;
    name: string;
    city?: string;
    address?: string;
  };
  members_count: number;
  created_at: string;
}

type TabType = 'dashboard' | 'users' | 'dojos' | 'clubs' | 'annuaire' | 'settings';

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

function AdminPageContent() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { theme } = useTheme();

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
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

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

  // États Clubs inscrits
  const [clubs, setClubs] = useState<ClubInfo[]>([]);
  const [clubSearchQuery, setClubSearchQuery] = useState('');

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
      const response = await fetch('/api/dojos', { method: 'GET' });
      const data = await response.json();
      setDojos(data.dojos || data || []);
    } catch (error) {
      console.error('Error fetching dojos:', error);
    }
  };

  const fetchClubs = async () => {
    try {
      const token = localStorage.getItem('wayofdojo_token');
      const response = await fetch('/api/admin/clubs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setClubs(data.clubs || []);
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
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
      if (response.success) {
        toast.success('Rôle mis à jour');
        await loadUsers(searchQuery);
      }
    } catch (error) {
      console.error('Role change error:', error);
      toast.error('Erreur lors du changement de rôle');
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
      const response = await fetch('/api/dojos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dojo: formData,
          auth: { super_admin_password: '123456' }
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Erreur lors de la création');
      }
      toast.success('Dojo créé avec succès !');
      await fetchDojos();
      resetDojoForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création');
    }
  };

  const handleDeleteDojo = async (dojoId: string, dojoName: string) => {
    if (!window.confirm(`Supprimer le dojo "${dojoName}" ?`)) return;

    try {
      const response = await fetch(`/api/dojos/${dojoId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ super_admin_password: '123456' })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Erreur lors de la suppression');
      }
      toast.success('Dojo supprimé');
      setDojos(dojos.filter(d => d.id !== dojoId));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression');
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

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
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

  // ═══════════════════════════════════════════════════════════════════════════
  // LOADING & AUTH CHECK
  // ═══════════════════════════════════════════════════════════════════════════

  if (loading) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center transition-colors",
        theme === 'dark' ? "bg-slate-950" : "bg-slate-100"
      )}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!authorized) return null;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div 
      className={cn(
        "min-h-screen transition-colors duration-300",
        theme === 'dark' ? "bg-slate-950" : "bg-slate-100"
      )} 
      data-testid="admin-page"
    >
      {/* Sidebar */}
      <AdminSidebar
        currentUser={currentUser}
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
      />

      {/* Main Content Area */}
      <main className={cn(
        "min-h-screen transition-all duration-300",
        "lg:ml-64 p-6 lg:p-8"
      )}>
        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* TAB: DASHBOARD */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'dashboard' && stats && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="space-y-8"
            data-testid="admin-dashboard"
          >
            <PageHeader 
              title="Tableau de Bord"
              subtitle="Vue d'ensemble de votre plateforme"
              theme={theme}
              actions={
                <Button 
                  onClick={() => Promise.all([loadStats(), loadUsers(), fetchDojos(), fetchClubs()])} 
                  variant="outline"
                  className={cn(
                    "transition-colors",
                    theme === 'dark' 
                      ? "border-slate-700 text-slate-300 hover:bg-slate-800" 
                      : "border-slate-300 text-slate-700 hover:bg-slate-100"
                  )}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualiser
                </Button>
              }
            />

            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                label="Total Utilisateurs"
                value={stats.totalUsers}
                icon={<Users className="w-5 h-5" />}
                variant="violet"
                trend={{ value: 12, positive: true }}
                theme={theme}
              />
              <StatCard
                label="Nouveaux (7j)"
                value={`+${stats.newUsersThisWeek}`}
                icon={<TrendingUp className="w-5 h-5" />}
                variant="emerald"
                theme={theme}
              />
              <StatCard
                label="Actifs (7j)"
                value={stats.activeUsers}
                icon={<Activity className="w-5 h-5" />}
                variant="blue"
                theme={theme}
              />
              <StatCard
                label="Dojos"
                value={dojos.length}
                icon={<Tent className="w-5 h-5" />}
                variant="amber"
                theme={theme}
              />
            </div>

            {/* Charts Row - Interactive Recharts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserGrowthChart theme={theme} />
              <ActivityChart theme={theme} />
            </div>

            {/* Charts & Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Users */}
              <div className="lg:col-span-2">
                <TopUsersTable
                  theme={theme}
                  users={stats.topUsersByXp.map(u => ({
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    xp: u.xp,
                    level: u.level,
                    grade: u.grade
                  }))}
                />
              </div>

              {/* Distribution */}
              <div className="space-y-6">
                <DistributionPieChart
                  title="🎭 Répartition Profils"
                  subtitle="Par type de pratiquant"
                  theme={theme}
                  data={[
                    { name: 'Samouraï Confirmé', value: stats.usersByProfile.samourai_confirme || 0, color: '#8b5cf6' },
                    { name: 'Jeune Samouraï', value: stats.usersByProfile.jeune_samourai || 0, color: '#f59e0b' },
                  ]}
                />
              </div>
            </div>

            {/* XP Progress + Subscription Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <XPProgressChart theme={theme} />
              <DistributionPieChart
                title="💳 Abonnements"
                subtitle="Par type de plan"
                theme={theme}
                data={Object.entries(stats.usersBySubscription).map(([key, value], i) => ({
                  name: key.replace('_', ' '),
                  value: value as number,
                  color: ['#10b981', '#3b82f6', '#ec4899', '#f59e0b'][i % 4]
                }))}
              />
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* TAB: USERS */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'users' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="space-y-6"
            data-testid="admin-users"
          >
            <PageHeader 
              title="Utilisateurs"
              subtitle={`${users.length} utilisateur(s) enregistré(s)`}
              theme={theme}
              actions={
                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              }
            />

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={cn(
                  "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
                  theme === 'dark' ? "text-slate-500" : "text-slate-400"
                )} />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className={cn(
                    "pl-10 transition-colors",
                    theme === 'dark' 
                      ? "bg-slate-900 border-slate-800 text-slate-100 focus:border-amber-500" 
                      : "bg-white border-slate-200 text-slate-900 focus:border-amber-500"
                  )}
                  data-testid="user-search-input"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSearch} 
                  className={cn(
                    "transition-colors",
                    theme === 'dark' 
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-200" 
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  )}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher
                </Button>
                <Button variant="outline" className={cn(
                  "transition-colors",
                  theme === 'dark' 
                    ? "border-slate-800 text-slate-400" 
                    : "border-slate-300 text-slate-600"
                )}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
              {selectedUsers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl"
                >
                  <span className="text-amber-400 font-medium">
                    {selectedUsers.length} utilisateur(s) sélectionné(s)
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedUsers([])} className={cn(
                      "transition-colors",
                      theme === 'dark' ? "border-slate-700 text-slate-300" : "border-slate-300 text-slate-700"
                    )}>
                      Annuler
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-500">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Data Table */}
            <div className={cn(
              "rounded-xl overflow-hidden transition-colors",
              theme === 'dark' 
                ? "bg-slate-900 border border-slate-800" 
                : "bg-white border border-slate-200 shadow-sm"
            )}>
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="users-table">
                  <thead className={cn(
                    "backdrop-blur sticky top-0",
                    theme === 'dark' ? "bg-slate-900/95" : "bg-slate-50/95"
                  )}>
                    <tr className={cn("border-b", theme === 'dark' ? "border-slate-800" : "border-slate-200")}>
                      <th className="w-10 px-4 py-3">
                        <input 
                          type="checkbox" 
                          className={cn(
                            "rounded",
                            theme === 'dark' ? "border-slate-600 bg-slate-800" : "border-slate-300 bg-white"
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers(users.map(u => u.id));
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                        />
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Utilisateur</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rôle</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Grade</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stats</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={cn("divide-y", theme === 'dark' ? "divide-slate-800/50" : "divide-slate-100")}>
                    {users.map((user) => (
                      <tr 
                        key={user.id} 
                        className={cn(
                          "transition-colors",
                          theme === 'dark' ? "hover:bg-slate-800/30" : "hover:bg-slate-50",
                          selectedUsers.includes(user.id) && "bg-amber-500/5"
                        )}
                        data-testid={`user-row-${user.id}`}
                      >
                        <td className="px-4 py-4">
                          <input 
                            type="checkbox" 
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                            className={cn(
                              "rounded",
                              theme === 'dark' ? "border-slate-600 bg-slate-800" : "border-slate-300 bg-white"
                            )}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-200">{user.firstName} {user.lastName}</p>
                              <p className="text-sm text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-semibold text-white",
                            roleColors[user.role] || 'bg-slate-600'
                          )}>
                            {roleLabels[user.role] || user.role}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-slate-300">{user.grade}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-amber-400 flex items-center gap-1">
                              <Star className="w-3.5 h-3.5" />
                              {user.gamification?.xp || 0}
                            </span>
                            <span className="text-orange-400 flex items-center gap-1">
                              <Flame className="w-3.5 h-3.5" />
                              {user.gamification?.streak || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-1.5 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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
              
              {/* Pagination */}
              <div className={cn(
                "flex items-center justify-between px-4 py-3 border-t",
                theme === 'dark' ? "border-slate-800" : "border-slate-200"
              )}>
                <p className={cn("text-sm", theme === 'dark' ? "text-slate-500" : "text-slate-500")}>
                  Affichage de {users.length} utilisateur(s)
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled className={cn(
                    theme === 'dark' ? "border-slate-700 text-slate-500" : "border-slate-300 text-slate-400"
                  )}>
                    Précédent
                  </Button>
                  <Button size="sm" variant="outline" disabled className={cn(
                    theme === 'dark' ? "border-slate-700 text-slate-500" : "border-slate-300 text-slate-400"
                  )}>
                    Suivant
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* TAB: DOJOS */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'dojos' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="space-y-6"
            data-testid="admin-dojos"
          >
            <PageHeader 
              title="Gestion des Dojos"
              subtitle={`${dojos.length} dojo(s) • ${totalDojoMembers} adhérent(s)`}
              theme={theme}
              actions={
                <Button 
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Dojo
                </Button>
              }
            />

            {/* Stats Mini */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Dojos" value={dojos.length} icon={<Tent className="w-5 h-5" />} variant="amber" theme={theme} />
              <StatCard label="Adhérents" value={totalDojoMembers} icon={<Users className="w-5 h-5" />} variant="emerald" theme={theme} />
              <StatCard label="Moyenne/Dojo" value={dojos.length > 0 ? Math.round(totalDojoMembers / dojos.length) : 0} icon={<BarChart3 className="w-5 h-5" />} variant="blue" theme={theme} />
            </div>

            {/* Create Form */}
            <AnimatePresence>
              {showCreateForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className={cn(
                    "border-amber-500/30",
                    theme === 'dark' ? "bg-slate-900" : "bg-amber-50/50"
                  )}>
                    <CardHeader>
                      <CardTitle className="text-amber-500 flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Créer un nouveau dojo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={cn("text-sm mb-1 block", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>Nom du dojo *</label>
                          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Aikido Paris" className={cn(theme === 'dark' ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-300 text-slate-900")} />
                        </div>
                        <div>
                          <label className={cn("text-sm mb-1 block", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>Ville</label>
                          <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Paris" className="bg-slate-950 border-slate-800 text-white" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Adresse</label>
                        <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="123 rue de l'Aïkido" className="bg-slate-950 border-slate-800 text-white" />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Description</label>
                        <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description du dojo..." className="bg-slate-950 border-slate-800 text-white min-h-[80px]" />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Mot de passe Admin *</label>
                        <Input type="password" value={formData.admin_password} onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })} placeholder="Mot de passe pour les admins" className="bg-slate-950 border-slate-800 text-white" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button onClick={handleCreateDojo} className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold">
                          <Plus className="w-4 h-4 mr-2" />Créer le dojo
                        </Button>
                        <Button onClick={resetDojoForm} variant="ghost" className="text-slate-400">Annuler</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dojos Grid */}
            {dojos.length === 0 ? (
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="text-center py-16">
                  <Tent className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-300 font-semibold text-lg mb-2">Aucun dojo</p>
                  <p className="text-slate-500">Créez votre premier dojo pour commencer</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {dojos.map((dojo) => (
                  <motion.div 
                    key={dojo.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    data-testid={`dojo-card-${dojo.id}`}
                  >
                    <Card className={cn(
                      "overflow-hidden transition-all",
                      dojo.is_default 
                        ? "bg-gradient-to-br from-amber-900/20 to-orange-900/10 border-amber-500/40" 
                        : "bg-slate-900 border-slate-800 hover:border-slate-700"
                    )}>
                      <div className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                              dojo.is_default 
                                ? "bg-gradient-to-br from-amber-500 to-orange-600" 
                                : "bg-gradient-to-br from-slate-700 to-slate-800"
                            )}>
                              <Tent className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-lg font-bold text-slate-100">{dojo.name}</h3>
                                {dojo.is_default && <Badge className="bg-amber-500 text-white text-xs">Par défaut</Badge>}
                              </div>
                              {dojo.city && (
                                <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                                  <MapPin className="w-3.5 h-3.5" />{dojo.city}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-3">
                                <span className="text-amber-400 flex items-center gap-1 text-sm font-medium">
                                  <Users className="w-4 h-4" />
                                  {dojo.members_count || 0} adhérent{(dojo.members_count || 0) > 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => toggleDojoExpand(dojo.id)} 
                              variant="ghost" 
                              size="icon"
                              className="text-slate-400 hover:text-slate-100"
                            >
                              {expandedDojo === dojo.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-slate-400 hover:text-slate-100"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {expandedDojo === dojo.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-slate-800"
                          >
                            <div className="p-5 bg-slate-950/50 space-y-4">
                              {/* Actions */}
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => { 
                                    if (showAddMember === dojo.id) setShowAddMember(null); 
                                    else { setShowAddMember(dojo.id); resetMemberForm(); } 
                                  }} 
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-500"
                                >
                                  <UserPlus className="w-4 h-4 mr-1" />Ajouter adhérent
                                </Button>
                                {!dojo.is_default && (
                                  <Button 
                                    onClick={() => handleDeleteDojo(dojo.id, dojo.name)} 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-red-500/50 text-red-400 hover:bg-red-900/30"
                                  >
                                    <Trash2 className="w-4 h-4 mr-1" />Supprimer
                                  </Button>
                                )}
                              </div>

                              {/* Add Member Form */}
                              <AnimatePresence>
                                {showAddMember === dojo.id && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 bg-emerald-900/20 rounded-xl border border-emerald-500/30"
                                  >
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="font-bold text-emerald-300 flex items-center gap-2">
                                        <UserPlus className="w-4 h-4" />Nouvel adhérent
                                      </h4>
                                      <button onClick={() => setShowAddMember(null)} className="text-slate-400 hover:text-white">
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                      <Input value={memberFormData.first_name} onChange={(e) => setMemberFormData({ ...memberFormData, first_name: e.target.value })} placeholder="Prénom *" className="bg-slate-950 border-slate-800 text-white text-sm" />
                                      <Input value={memberFormData.last_name} onChange={(e) => setMemberFormData({ ...memberFormData, last_name: e.target.value })} placeholder="Nom *" className="bg-slate-950 border-slate-800 text-white text-sm" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                      <Input type="email" value={memberFormData.email} onChange={(e) => setMemberFormData({ ...memberFormData, email: e.target.value })} placeholder="Email *" className="bg-slate-950 border-slate-800 text-white text-sm" />
                                      <select value={memberFormData.belt} onChange={(e) => setMemberFormData({ ...memberFormData, belt: e.target.value })} className="h-10 px-3 bg-slate-950 border border-slate-800 rounded-md text-white text-sm">
                                        {BELT_OPTIONS.map(belt => <option key={belt.value} value={belt.value}>{belt.label}</option>)}
                                      </select>
                                    </div>
                                    <div className="flex gap-2 mb-3">
                                      <Input 
                                        type={showPassword ? 'text' : 'password'} 
                                        value={memberFormData.password} 
                                        onChange={(e) => setMemberFormData({ ...memberFormData, password: e.target.value })} 
                                        placeholder="Mot de passe *" 
                                        className="bg-slate-950 border-slate-800 text-white text-sm flex-1" 
                                      />
                                      <Button type="button" onClick={() => setShowPassword(!showPassword)} variant="ghost" size="icon" className="text-slate-400">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                      </Button>
                                      <Button type="button" onClick={generatePassword} variant="outline" size="icon" className="border-slate-700">
                                        <RefreshCw className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    <Button onClick={() => handleCreateMember(dojo.id)} className="w-full bg-emerald-600 hover:bg-emerald-500" size="sm">
                                      <UserPlus className="w-4 h-4 mr-2" />Créer l&apos;adhérent
                                    </Button>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Members List */}
                              <div>
                                <h4 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                                  <Users className="w-4 h-4" />Membres ({dojoMembers[dojo.id]?.length || 0})
                                </h4>
                                {!dojoMembers[dojo.id] ? (
                                  <div className="text-center py-4">
                                    <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                  </div>
                                ) : dojoMembers[dojo.id].length === 0 ? (
                                  <p className="text-slate-500 text-center py-4 text-sm">Aucun membre inscrit</p>
                                ) : (
                                  <div className="grid grid-cols-1 gap-2">
                                    {dojoMembers[dojo.id].slice(0, 5).map((member) => (
                                      <div key={member.id} className="flex items-center gap-3 p-2 bg-slate-900/50 rounded-lg">
                                        <div 
                                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" 
                                          style={{ 
                                            backgroundColor: BELT_OPTIONS.find(b => b.value === member.belt)?.color || '#666', 
                                            color: member.belt?.includes('Kyu') && !member.belt?.includes('1er') ? '#000' : '#fff' 
                                          }}
                                        >
                                          {member.first_name?.[0]}{member.last_name?.[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-slate-200 text-sm font-medium truncate">{member.first_name} {member.last_name}</p>
                                          <p className="text-slate-500 text-xs truncate">{member.belt || '6e Kyu'}</p>
                                        </div>
                                      </div>
                                    ))}
                                    {dojoMembers[dojo.id].length > 5 && (
                                      <p className="text-slate-500 text-xs text-center py-2">
                                        +{dojoMembers[dojo.id].length - 5} autres membres
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
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
        {/* TAB: CLUBS INSCRITS */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'clubs' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="space-y-6"
            data-testid="admin-clubs"
            onAnimationStart={() => fetchClubs()}
          >
            <PageHeader 
              title="Clubs Inscrits"
              subtitle={`${clubs.length} club(s) enregistré(s) sur la plateforme`}
              theme={theme}
              actions={
                <Button 
                  onClick={fetchClubs} 
                  variant="outline"
                  className={cn(
                    "transition-colors",
                    theme === 'dark' 
                      ? "border-slate-700 text-slate-300 hover:bg-slate-800" 
                      : "border-slate-300 text-slate-700 hover:bg-slate-100"
                  )}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualiser
                </Button>
              }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard
                label="Clubs Inscrits"
                value={clubs.length}
                icon={<Building2 className="w-5 h-5" />}
                variant="amber"
                theme={theme}
              />
              <StatCard
                label="Total Adhérents"
                value={clubs.reduce((acc, c) => acc + (c.members_count || 0), 0)}
                icon={<Users className="w-5 h-5" />}
                variant="violet"
                theme={theme}
              />
              <StatCard
                label="Moy. Adhérents/Club"
                value={clubs.length > 0 ? Math.round(clubs.reduce((acc, c) => acc + (c.members_count || 0), 0) / clubs.length) : 0}
                icon={<BarChart3 className="w-5 h-5" />}
                variant="blue"
                theme={theme}
              />
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Rechercher un club..."
                value={clubSearchQuery}
                onChange={(e) => setClubSearchQuery(e.target.value)}
                className={cn(
                  "pl-10",
                  theme === 'dark' 
                    ? "bg-slate-800/50 border-slate-700 text-white" 
                    : "bg-white border-slate-300"
                )}
                data-testid="club-search-input"
              />
            </div>

            {/* Clubs List */}
            {clubs.length === 0 ? (
              <Card className={cn(
                "border",
                theme === 'dark' ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"
              )}>
                <CardContent className="py-12 text-center">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-slate-600 opacity-50" />
                  <p className={theme === 'dark' ? "text-slate-400" : "text-slate-600"}>
                    Aucun club inscrit pour le moment
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {clubs
                  .filter(club => {
                    if (!clubSearchQuery) return true;
                    const search = clubSearchQuery.toLowerCase();
                    return (
                      club.dojo?.name?.toLowerCase().includes(search) ||
                      club.dojo?.city?.toLowerCase().includes(search) ||
                      club.admin_email?.toLowerCase().includes(search) ||
                      club.admin_name?.toLowerCase().includes(search)
                    );
                  })
                  .map((club) => (
                  <motion.div
                    key={club.admin_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className={cn(
                      "border transition-all hover:shadow-lg",
                      theme === 'dark' 
                        ? "bg-slate-900/50 border-slate-800 hover:border-amber-500/30" 
                        : "bg-white border-slate-200 hover:border-amber-500/50"
                    )}>
                      <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h3 className={cn(
                                "text-lg font-bold",
                                theme === 'dark' ? "text-white" : "text-slate-900"
                              )}>
                                {club.dojo?.name || 'Club sans nom'}
                              </h3>
                              {club.dojo?.city && (
                                <p className={cn(
                                  "text-sm flex items-center gap-1 mt-0.5",
                                  theme === 'dark' ? "text-slate-400" : "text-slate-600"
                                )}>
                                  <MapPin className="w-3.5 h-3.5" />
                                  {club.dojo.city}
                                  {club.dojo.address && ` - ${club.dojo.address}`}
                                </p>
                              )}
                              <div className="flex items-center gap-3 mt-2 text-sm">
                                <span className={cn(
                                  "flex items-center gap-1",
                                  theme === 'dark' ? "text-slate-500" : "text-slate-500"
                                )}>
                                  <Mail className="w-3.5 h-3.5" />
                                  {club.admin_email}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-amber-500 font-bold text-xl">
                                {club.members_count || 0}
                              </p>
                              <p className={cn(
                                "text-xs",
                                theme === 'dark' ? "text-slate-500" : "text-slate-600"
                              )}>
                                adhérent{(club.members_count || 0) > 1 ? 's' : ''}
                              </p>
                            </div>
                            <Badge className={cn(
                              "px-3 py-1",
                              theme === 'dark' 
                                ? "bg-emerald-500/20 text-emerald-400" 
                                : "bg-emerald-100 text-emerald-700"
                            )}>
                              Actif
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
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
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="space-y-6"
            data-testid="admin-annuaire"
          >
            <PageHeader 
              title="Annuaire FFAAA"
              subtitle="Clubs d'Aïkido affiliés en France"
              theme={theme}
            />

            {/* Region Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => setAnnuaireRegion('all')}
                className={cn(
                  "transition-all",
                  annuaireRegion === 'all' 
                    ? "bg-amber-500 text-slate-950" 
                    : theme === 'dark' 
                      ? "bg-slate-800 text-slate-400 hover:bg-slate-700" 
                      : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                )}
              >
                Toutes ({CLUBS_AIKIDO_FRANCE.length})
              </Button>
              {Object.entries(REGIONS_FRANCE).map(([key, region]) => {
                const count = regionStats[key]?.count || 0;
                if (count === 0) return null;
                return (
                  <Button
                    key={key}
                    size="sm"
                    onClick={() => setAnnuaireRegion(annuaireRegion === key ? 'all' : key)}
                    className={cn(
                      "transition-all",
                      annuaireRegion === key 
                        ? "bg-amber-500 text-slate-950" 
                        : theme === 'dark' 
                          ? "bg-slate-800 text-slate-400 hover:bg-slate-700" 
                          : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    )}
                  >
                    {region.emoji} {count}
                  </Button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", theme === 'dark' ? "text-slate-500" : "text-slate-400")} />
              <Input 
                value={annuaireSearch} 
                onChange={(e) => setAnnuaireSearch(e.target.value)} 
                placeholder="Rechercher un club par nom ou ville..." 
                className="pl-10 bg-slate-900 border-slate-800 text-white" 
              />
            </div>

            <p className="text-slate-400 text-sm">{filteredClubs.length} club(s) trouvé(s)</p>

            {/* Clubs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClubs.map(club => {
                const region = REGIONS_FRANCE[club.region];
                const isSelected = selectedClubs.includes(club.id);
                return (
                  <div 
                    key={club.id} 
                    onClick={() => toggleClubSelection(club.id)} 
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-all",
                      isSelected 
                        ? "bg-amber-500/10 border-amber-500/50 ring-2 ring-amber-500/30" 
                        : "bg-slate-900 border-slate-800 hover:border-slate-700"
                    )}
                    data-testid={`club-card-${club.id}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                          <h4 className="text-slate-100 font-medium truncate">{club.name}</h4>
                        </div>
                        <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />{club.city}
                        </p>
                        {club.address && <p className="text-slate-500 text-xs mt-1 truncate">{club.address}</p>}
                      </div>
                      <Badge variant="outline" className="text-xs flex-shrink-0 border-slate-700 text-slate-400">
                        {region?.emoji} {club.federation}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Import Bar */}
            <AnimatePresence>
              {selectedClubs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="sticky bottom-4 p-4 bg-slate-900/95 backdrop-blur-xl border border-amber-500/30 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-300 font-medium">{selectedClubs.length} club(s) sélectionné(s)</span>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setSelectedClubs([])} variant="outline" size="sm" className="border-slate-700 text-slate-300">
                      Annuler
                    </Button>
                    <Button 
                      onClick={() => { 
                        toast.success(`${selectedClubs.length} club(s) importé(s) !`); 
                        setSelectedClubs([]); 
                      }} 
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold" 
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />Importer
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* TAB: SETTINGS */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="space-y-6"
            data-testid="admin-settings"
          >
            <PageHeader 
              title="Paramètres"
              subtitle="Configuration de la plateforme"
              theme={theme}
            />

            {/* Settings Accordion */}
            <div className="space-y-4">
              {[
                { id: 'i18n', icon: Globe, title: 'Internationalisation', desc: 'Gérer les traductions et les langues supportées', color: 'blue' },
                { id: 'subscription', icon: Crown, title: 'Abonnements', desc: 'Configuration des plans Stripe et tarification', color: 'violet' },
                { id: 'gamification', icon: Star, title: 'Gamification', desc: 'Configurer les points XP, badges et défis', color: 'amber' },
                { id: 'notifications', icon: Mail, title: 'Notifications', desc: 'Emails automatiques et webhooks', color: 'emerald' },
                { id: 'security', icon: Shield, title: 'Sécurité', desc: 'Sessions, 2FA et journaux d\'activité', color: 'red' },
              ].map((section) => (
                <Card key={section.id} className={cn(
                  "transition-colors",
                  theme === 'dark' 
                    ? "bg-slate-900 border-slate-800 hover:border-slate-700" 
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                )}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                        section.color === 'blue' && "bg-blue-500/20 text-blue-500",
                        section.color === 'violet' && "bg-violet-500/20 text-violet-500",
                        section.color === 'amber' && "bg-amber-500/20 text-amber-500",
                        section.color === 'emerald' && "bg-emerald-500/20 text-emerald-500",
                        section.color === 'red' && "bg-red-500/20 text-red-500",
                      )}>
                        <section.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className={cn(
                          "text-lg font-semibold",
                          theme === 'dark' ? "text-slate-100" : "text-slate-900"
                        )}>{section.title}</h3>
                        <p className={cn(
                          "text-sm mt-1",
                          theme === 'dark' ? "text-slate-400" : "text-slate-500"
                        )}>{section.desc}</p>
                      </div>
                      <Button variant="outline" size="sm" disabled className={cn(
                        theme === 'dark' ? "border-slate-700 text-slate-500" : "border-slate-300 text-slate-400"
                      )}>
                        <ChevronRight className="w-4 h-4 mr-1" />
                        Bientôt
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

// Export with ThemeProvider wrapper
export default function AdminPage() {
  return (
    <ThemeProvider>
      <AdminPageContent />
    </ThemeProvider>
  );
}
