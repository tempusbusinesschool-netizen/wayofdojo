'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { StatCard } from '@/components/admin/AdminWidgets';
import { 
  Building2, Users, Settings, LogOut, 
  UserPlus, Trash2, Edit2, Mail, Phone, MapPin,
  TrendingUp, Award, Clock,
  Save, X, Search
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface ClubAdmin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface Dojo {
  id: string;
  name: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  description?: string;
}

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  belt: string;
  joinDate: string;
  subscriptionPaid: boolean;
  isActive: boolean;
}

export default function ClubDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string || 'fr';
  
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<ClubAdmin | null>(null);
  const [dojo, setDojo] = useState<Dojo | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingDojo, setEditingDojo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    belt: '6e_kyu',
    subscriptionPaid: false
  });
  
  // Edit member state
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  
  const [dojoForm, setDojoForm] = useState<Dojo | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    newThisMonth: 0,
    avgAttendance: 0
  });

  // Belt options
  const beltOptions = [
    { value: '6e_kyu', label: '6e Kyu (Blanc)' },
    { value: '5e_kyu', label: '5e Kyu (Jaune)' },
    { value: '4e_kyu', label: '4e Kyu (Orange)' },
    { value: '3e_kyu', label: '3e Kyu (Vert)' },
    { value: '2e_kyu', label: '2e Kyu (Bleu)' },
    { value: '1er_kyu', label: '1er Kyu (Marron)' },
    { value: '1er_dan', label: '1er Dan' },
    { value: '2e_dan', label: '2e Dan' },
    { value: '3e_dan', label: '3e Dan' },
    { value: '4e_dan', label: '4e Dan' },
    { value: '5e_dan', label: '5e Dan' },
  ];

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('club_token');
    const dojoData = localStorage.getItem('club_dojo');
    
    if (!token || !dojoData) {
      router.push(`/${locale}/club-login`);
      return;
    }
    
    try {
      const parsedDojo = JSON.parse(dojoData);
      setDojo(parsedDojo);
      setDojoForm(parsedDojo);
      
      // Decode token to get admin info
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      setAdmin({
        id: tokenPayload.admin_id,
        email: tokenPayload.email,
        firstName: 'Admin',
        lastName: ''
      });
      
      // Fetch members
      fetchMembers(parsedDojo.id, token);
    } catch (error) {
      console.error('Error parsing auth data:', error);
      router.push(`/${locale}/club-login`);
    }
  }, [locale, router]);

  const fetchMembers = async (dojoId: string, token: string) => {
    try {
      const response = await fetch(`/api/club/members?dojo_id=${dojoId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
        
        // Calculate stats
        const total = data.members?.length || 0;
        const active = data.members?.filter((m: Member) => m.isActive).length || 0;
        setStats({
          totalMembers: total,
          activeMembers: active,
          newThisMonth: Math.floor(total * 0.1), // Placeholder
          avgAttendance: 75 // Placeholder
        });
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('club_token');
    localStorage.removeItem('club_dojo');
    router.push(`/${locale}/club-login`);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('club_token');
    
    try {
      const response = await fetch('/api/club/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: newMember.firstName,
          lastName: newMember.lastName,
          email: newMember.email,
          phone: newMember.phone,
          birthDate: newMember.birthDate,
          belt: newMember.belt,
          subscriptionPaid: newMember.subscriptionPaid,
          dojoId: dojo?.id
        })
      });
      
      if (response.ok) {
        toast.success('Membre ajouté avec succès');
        setShowAddMember(false);
        setNewMember({ firstName: '', lastName: '', email: '', phone: '', birthDate: '', belt: '6e_kyu', subscriptionPaid: false });
        if (dojo && token) fetchMembers(dojo.id, token);
      } else {
        const data = await response.json();
        toast.error(data.detail || 'Erreur lors de l\'ajout');
      }
    } catch {
      toast.error('Erreur lors de l\'ajout du membre');
    }
  };

  const handleUpdateDojo = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('club_token');
    
    if (!dojoForm) return;
    
    try {
      const response = await fetch(`/api/club/dojo/${dojo?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dojoForm)
      });
      
      if (response.ok) {
        const data = await response.json();
        setDojo(data.dojo);
        localStorage.setItem('club_dojo', JSON.stringify(data.dojo));
        setEditingDojo(false);
        toast.success('Informations mises à jour');
      } else {
        const data = await response.json();
        toast.error(data.detail || 'Erreur lors de la mise à jour');
      }
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    
    const token = localStorage.getItem('club_token');
    
    try {
      const response = await fetch(`/api/club/members/${editingMember.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: editingMember.firstName,
          lastName: editingMember.lastName,
          email: editingMember.email,
          phone: editingMember.phone,
          birthDate: editingMember.birthDate,
          belt: editingMember.belt,
          subscriptionPaid: editingMember.subscriptionPaid,
          isActive: editingMember.isActive
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success('Membre mis à jour');
        setEditingMember(null);
        // Update local state
        setMembers(members.map(m => m.id === editingMember.id ? data.member : m));
      } else {
        const data = await response.json();
        toast.error(data.detail || 'Erreur lors de la mise à jour');
      }
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) return;
    
    const token = localStorage.getItem('club_token');
    
    try {
      const response = await fetch(`/api/club/members/${memberId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast.success('Membre supprimé');
        setMembers(members.filter(m => m.id !== memberId));
      }
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Filter members
  const filteredMembers = members.filter(m => 
    m.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="w-8 h-8 text-amber-500" />
              <div>
                <h1 className="text-xl font-bold text-white">{dojo?.name}</h1>
                <p className="text-sm text-slate-400">{dojo?.city}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400 hidden md:block">
                {admin?.email}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-slate-400 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700 p-1">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Tableau de bord
            </TabsTrigger>
            <TabsTrigger 
              value="members"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Membres
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                label="Total Membres"
                value={stats.totalMembers}
                icon={<Users className="w-5 h-5" />}
                variant="amber"
                theme="dark"
              />
              <StatCard
                label="Membres Actifs"
                value={stats.activeMembers}
                icon={<Award className="w-5 h-5" />}
                variant="emerald"
                theme="dark"
              />
              <StatCard
                label="Nouveaux ce mois"
                value={stats.newThisMonth}
                icon={<UserPlus className="w-5 h-5" />}
                variant="blue"
                theme="dark"
              />
              <StatCard
                label="Présence moyenne"
                value={`${stats.avgAttendance}%`}
                icon={<Clock className="w-5 h-5" />}
                variant="violet"
                theme="dark"
              />
            </div>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => { setActiveTab('members'); setShowAddMember(true); }}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Ajouter un membre
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab('members')}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Voir tous les membres
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab('settings')}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres du dojo
                </Button>
              </CardContent>
            </Card>

            {/* Recent Members */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Derniers membres inscrits</CardTitle>
              </CardHeader>
              <CardContent>
                {members.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun membre inscrit pour le moment</p>
                    <Button 
                      onClick={() => { setActiveTab('members'); setShowAddMember(true); }}
                      className="mt-4 bg-amber-500 hover:bg-amber-600"
                    >
                      Ajouter votre premier membre
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {members.slice(0, 5).map((member) => (
                      <div 
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <span className="text-amber-500 font-semibold">
                              {member.firstName[0]}{member.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {member.firstName} {member.lastName}
                            </p>
                            <p className="text-sm text-slate-400">{member.email}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300">
                          {beltOptions.find(b => b.value === member.belt)?.label || member.belt}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            {/* Header with search and add button */}
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher un membre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
              <Button 
                onClick={() => setShowAddMember(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Ajouter un membre
              </Button>
            </div>

            {/* Add Member Form */}
            <AnimatePresence>
              {showAddMember && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Nouveau membre</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowAddMember(false)}
                          className="text-slate-400"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300">Prénom *</Label>
                          <Input
                            value={newMember.firstName}
                            onChange={(e) => setNewMember({...newMember, firstName: e.target.value})}
                            required
                            placeholder="Jean"
                            className="bg-slate-700/50 border-slate-600 text-white"
                            data-testid="member-firstname-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">Nom *</Label>
                          <Input
                            value={newMember.lastName}
                            onChange={(e) => setNewMember({...newMember, lastName: e.target.value})}
                            required
                            placeholder="Dupont"
                            className="bg-slate-700/50 border-slate-600 text-white"
                            data-testid="member-lastname-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">Email *</Label>
                          <Input
                            type="email"
                            value={newMember.email}
                            onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                            required
                            placeholder="jean.dupont@email.com"
                            className="bg-slate-700/50 border-slate-600 text-white"
                            data-testid="member-email-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">Téléphone</Label>
                          <Input
                            type="tel"
                            value={newMember.phone}
                            onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                            placeholder="06 12 34 56 78"
                            className="bg-slate-700/50 border-slate-600 text-white"
                            data-testid="member-phone-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">Date de naissance</Label>
                          <Input
                            type="date"
                            value={newMember.birthDate}
                            onChange={(e) => setNewMember({...newMember, birthDate: e.target.value})}
                            className="bg-slate-700/50 border-slate-600 text-white"
                            data-testid="member-birthdate-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">Grade</Label>
                          <select
                            value={newMember.belt}
                            onChange={(e) => setNewMember({...newMember, belt: e.target.value})}
                            className="w-full h-10 px-3 bg-slate-700/50 border border-slate-600 rounded-md text-white"
                            data-testid="member-belt-select"
                          >
                            {beltOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2 flex items-end">
                          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-slate-700/30 border border-slate-600 w-full">
                            <input
                              type="checkbox"
                              checked={newMember.subscriptionPaid}
                              onChange={(e) => setNewMember({...newMember, subscriptionPaid: e.target.checked})}
                              className="w-5 h-5 rounded border-slate-600 text-amber-500 focus:ring-amber-500"
                              data-testid="member-subscription-checkbox"
                            />
                            <span className="text-slate-300">Cotisation payée</span>
                          </label>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-2 border-t border-slate-700">
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={() => setShowAddMember(false)}
                            className="border-slate-600 text-slate-300"
                          >
                            Annuler
                          </Button>
                          <Button type="submit" className="bg-amber-500 hover:bg-amber-600" data-testid="member-submit-btn">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Ajouter
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit Member Modal */}
            <AnimatePresence>
              {editingMember && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setEditingMember(null)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-2xl"
                  >
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">Modifier le membre</CardTitle>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingMember(null)}
                            className="text-slate-400"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleUpdateMember} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-300">Prénom *</Label>
                            <Input
                              value={editingMember.firstName}
                              onChange={(e) => setEditingMember({...editingMember, firstName: e.target.value})}
                              required
                              className="bg-slate-700/50 border-slate-600 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-300">Nom *</Label>
                            <Input
                              value={editingMember.lastName}
                              onChange={(e) => setEditingMember({...editingMember, lastName: e.target.value})}
                              required
                              className="bg-slate-700/50 border-slate-600 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-300">Email *</Label>
                            <Input
                              type="email"
                              value={editingMember.email}
                              onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                              required
                              className="bg-slate-700/50 border-slate-600 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-300">Téléphone</Label>
                            <Input
                              type="tel"
                              value={editingMember.phone || ''}
                              onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})}
                              className="bg-slate-700/50 border-slate-600 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-300">Date de naissance</Label>
                            <Input
                              type="date"
                              value={editingMember.birthDate || ''}
                              onChange={(e) => setEditingMember({...editingMember, birthDate: e.target.value})}
                              className="bg-slate-700/50 border-slate-600 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-300">Grade</Label>
                            <select
                              value={editingMember.belt}
                              onChange={(e) => setEditingMember({...editingMember, belt: e.target.value})}
                              className="w-full h-10 px-3 bg-slate-700/50 border border-slate-600 rounded-md text-white"
                            >
                              {beltOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2 flex items-end">
                            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-slate-700/30 border border-slate-600 w-full">
                              <input
                                type="checkbox"
                                checked={editingMember.subscriptionPaid}
                                onChange={(e) => setEditingMember({...editingMember, subscriptionPaid: e.target.checked})}
                                className="w-5 h-5 rounded border-slate-600 text-amber-500 focus:ring-amber-500"
                              />
                              <span className="text-slate-300">Cotisation payée</span>
                            </label>
                          </div>
                          <div className="space-y-2 flex items-end">
                            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-slate-700/30 border border-slate-600 w-full">
                              <input
                                type="checkbox"
                                checked={editingMember.isActive}
                                onChange={(e) => setEditingMember({...editingMember, isActive: e.target.checked})}
                                className="w-5 h-5 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
                              />
                              <span className="text-slate-300">Membre actif</span>
                            </label>
                          </div>
                          <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-slate-700">
                            <Button 
                              type="button"
                              variant="outline"
                              onClick={() => setEditingMember(null)}
                              className="border-slate-600 text-slate-300"
                            >
                              Annuler
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                              <Save className="w-4 h-4 mr-2" />
                              Enregistrer
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Members List */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-0">
                {filteredMembers.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Aucun membre trouvé</p>
                    {searchTerm && (
                      <p className="text-sm mt-2">Essayez une autre recherche</p>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-700">
                    {filteredMembers.map((member) => (
                      <div 
                        key={member.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-slate-700/30 transition-colors gap-4"
                        data-testid={`member-row-${member.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">
                              {member.firstName?.[0]}{member.lastName?.[0]}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-medium">
                              {member.firstName} {member.lastName}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {member.email}
                              </span>
                              {member.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {member.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 flex-wrap justify-end">
                          {/* Grade Badge */}
                          <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300">
                            {beltOptions.find(b => b.value === member.belt)?.label || member.belt}
                          </span>
                          
                          {/* Subscription Status */}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            member.subscriptionPaid 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {member.subscriptionPaid ? '✓ Cotisation payée' : '✗ Non payée'}
                          </span>
                          
                          {/* Actions */}
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-slate-400 hover:text-amber-400"
                              onClick={() => setEditingMember(member)}
                              data-testid={`edit-member-${member.id}`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-slate-400 hover:text-red-400"
                              onClick={() => handleDeleteMember(member.id)}
                              data-testid={`delete-member-${member.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Informations du Dojo</CardTitle>
                    <CardDescription className="text-slate-400">
                      Gérez les informations de votre club
                    </CardDescription>
                  </div>
                  {!editingDojo && (
                    <Button 
                      variant="outline"
                      onClick={() => setEditingDojo(true)}
                      className="border-slate-600 text-slate-300"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editingDojo ? (
                  <form onSubmit={handleUpdateDojo} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Nom du Dojo</Label>
                        <Input
                          value={dojoForm?.name || ''}
                          onChange={(e) => setDojoForm(prev => prev ? {...prev, name: e.target.value} : null)}
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Ville</Label>
                        <Input
                          value={dojoForm?.city || ''}
                          onChange={(e) => setDojoForm(prev => prev ? {...prev, city: e.target.value} : null)}
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-slate-300">Adresse</Label>
                        <Input
                          value={dojoForm?.address || ''}
                          onChange={(e) => setDojoForm(prev => prev ? {...prev, address: e.target.value} : null)}
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Email</Label>
                        <Input
                          type="email"
                          value={dojoForm?.email || ''}
                          onChange={(e) => setDojoForm(prev => prev ? {...prev, email: e.target.value} : null)}
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Téléphone</Label>
                        <Input
                          value={dojoForm?.phone || ''}
                          onChange={(e) => setDojoForm(prev => prev ? {...prev, phone: e.target.value} : null)}
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => { setEditingDojo(false); setDojoForm(dojo); }}
                        className="border-slate-600 text-slate-300"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                        <Save className="w-4 h-4 mr-2" />
                        Enregistrer
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-slate-300">
                        <Building2 className="w-5 h-5 text-amber-500" />
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Nom du Dojo</p>
                          <p className="text-white">{dojo?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-slate-300">
                        <MapPin className="w-5 h-5 text-amber-500" />
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Adresse</p>
                          <p className="text-white">{dojo?.address || 'Non renseignée'}</p>
                          <p className="text-slate-400">{dojo?.city}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-slate-300">
                        <Mail className="w-5 h-5 text-amber-500" />
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Email</p>
                          <p className="text-white">{dojo?.email || 'Non renseigné'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-slate-300">
                        <Phone className="w-5 h-5 text-amber-500" />
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Téléphone</p>
                          <p className="text-white">{dojo?.phone || 'Non renseigné'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-red-950/20 border-red-900/50">
              <CardHeader>
                <CardTitle className="text-red-400">Zone de danger</CardTitle>
                <CardDescription className="text-red-300/70">
                  Actions irréversibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline"
                  className="border-red-700 text-red-400 hover:bg-red-950/50"
                  onClick={() => toast.error('Contactez le support pour supprimer votre club')}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer le club
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <Link href={`/${locale}`} className="hover:text-amber-500 transition-colors">
            ← Retour à Way of Dojo
          </Link>
        </div>
      </footer>
    </div>
  );
}
