'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Building2, Users, Shield, Settings, RefreshCw,
  Plus, Trash2, MapPin, UserPlus, ChevronDown, ChevronUp,
  Mail, Phone, Calendar, Award, Eye, EyeOff, Search, X,
  Download, Globe, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import apiService from '@/services/api.service';

// ═══════════════════════════════════════════════════════════════════════════
// DONNÉES DES RÉGIONS ET CLUBS FFAAA
// ═══════════════════════════════════════════════════════════════════════════

const REGIONS_FRANCE: Record<string, { name: string; emoji: string; code: string }> = {
  idf: { name: 'Île-de-France', emoji: '🗼', code: '75-77-78-91-92-93-94-95' },
  ara: { name: 'Auvergne-Rhône-Alpes', emoji: '⛰️', code: '01-03-07-15-26-38-42-43-63-69-73-74' },
  bfc: { name: 'Bourgogne-Franche-Comté', emoji: '🍇', code: '21-25-39-58-70-71-89-90' },
  bretagne: { name: 'Bretagne', emoji: '⚓', code: '22-29-35-56' },
  cvl: { name: 'Centre-Val de Loire', emoji: '🏰', code: '18-28-36-37-41-45' },
  corse: { name: 'Corse', emoji: '🏝️', code: '2A-2B' },
  grand_est: { name: 'Grand Est', emoji: '🏛️', code: '08-10-51-52-54-55-57-67-68-88' },
  hdf: { name: 'Hauts-de-France', emoji: '🏭', code: '02-59-60-62-80' },
  normandie: { name: 'Normandie', emoji: '🍎', code: '14-27-50-61-76' },
  nouvelle_aquitaine: { name: 'Nouvelle-Aquitaine', emoji: '🍷', code: '16-17-19-23-24-33-40-47-64-79-86-87' },
  occitanie: { name: 'Occitanie', emoji: '☀️', code: '09-11-12-30-31-32-34-46-48-65-66-81-82' },
  pdl: { name: 'Pays de la Loire', emoji: '🌊', code: '44-49-53-72-85' },
  paca: { name: 'Provence-Alpes-Côte d\'Azur', emoji: '🌴', code: '04-05-06-13-83-84' },
  reunion: { name: 'La Réunion', emoji: '🌺', code: '974' },
  guadeloupe: { name: 'Guadeloupe', emoji: '🌸', code: '971' },
  martinique: { name: 'Martinique', emoji: '🌺', code: '972' },
  guyane: { name: 'Guyane', emoji: '🌳', code: '973' },
  mayotte: { name: 'Mayotte', emoji: '🐢', code: '976' },
};

// Échantillon de clubs (la liste complète serait importée)
const CLUBS_AIKIDO_FRANCE = [
  { id: 'aspp-paris', name: 'A.S.P.P. Aïkibudo', city: 'Paris 5e', region: 'idf', address: '4 rue des Arènes, 75005 Paris', email: 'contact@aspp.paris', federation: 'FFAAA' },
  { id: 'ifa-alesia', name: 'Institut Français d\'Aïkido - Dojo Alésia', city: 'Paris 14e', region: 'idf', address: '3 Villa d\'Orléans, 75014 Paris', phone: '06 01 86 94 64', email: 'aikiryu14@gmail.com', federation: 'FFAAA' },
  { id: 'dokan-rennes', name: 'Association Dokan Rennes', city: 'Rennes', region: 'bretagne', address: '8 passage du Couëdic', phone: '06 88 17 37 71', federation: 'FFAAA' },
  { id: 'aikido-lyon', name: 'Aïkido Club de Lyon', city: 'Lyon', region: 'ara', federation: 'FFAAA' },
  { id: 'aikido-marseille', name: 'Aïkido Marseille', city: 'Marseille', region: 'paca', federation: 'FFAAA' },
  { id: 'aikido-bordeaux', name: 'Aïkido Bordeaux', city: 'Bordeaux', region: 'nouvelle_aquitaine', federation: 'FFAAA' },
  { id: 'aikido-toulouse', name: 'Aïkido Toulouse', city: 'Toulouse', region: 'occitanie', federation: 'FFAAA' },
  { id: 'aikido-nantes', name: 'Aïkido Nantes', city: 'Nantes', region: 'pdl', federation: 'FFAAA' },
];

// Grades disponibles
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
  { value: '4e Dan', label: '4e Dan', color: '#000000' },
  { value: '5e Dan', label: '5e Dan', color: '#000000' }
];

// Types
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

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export default function GestionPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string || 'fr';

  // États
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [activeSection, setActiveSection] = useState<'dojos' | 'users' | 'annuaire'>('dojos');
  
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

  // Statistiques des régions
  const regionStats = useMemo(() => {
    const stats: Record<string, { count: number }> = {};
    CLUBS_AIKIDO_FRANCE.forEach(club => {
      if (!stats[club.region]) stats[club.region] = { count: 0 };
      stats[club.region].count++;
    });
    return stats;
  }, []);

  // Filtrer les clubs
  const filteredClubs = useMemo(() => {
    return CLUBS_AIKIDO_FRANCE.filter(club => {
      const matchesSearch = annuaireSearch === '' ||
        club.name.toLowerCase().includes(annuaireSearch.toLowerCase()) ||
        club.city.toLowerCase().includes(annuaireSearch.toLowerCase());
      const matchesRegion = annuaireRegion === 'all' || club.region === annuaireRegion;
      return matchesSearch && matchesRegion;
    });
  }, [annuaireSearch, annuaireRegion]);

  // Vérification accès admin
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
      const userData = await apiService.getCurrentUser() as { user: { role: string } };
      if (!['admin', 'super_admin'].includes(userData.user.role)) {
        router.push(`/${locale}/aikido/dojo`);
        return;
      }
      setAuthorized(true);
      await fetchDojos();
    } catch {
      router.push(`/${locale}/aikido/login`);
    } finally {
      setLoading(false);
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
      resetForm();
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

  const handleCreateMember = async (dojoId: string, dojoName: string) => {
    if (!memberFormData.first_name || !memberFormData.last_name || !memberFormData.email || !memberFormData.password) {
      toast.error('Prénom, nom, email et mot de passe requis');
      return;
    }

    try {
      await apiService.register({
        first_name: memberFormData.first_name,
        last_name: memberFormData.last_name,
        email: memberFormData.email,
        password: memberFormData.password,
        phone: memberFormData.phone || undefined,
        belt: memberFormData.belt,
        dojo_id: dojoId,
        dojo_name: dojoName
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

  const resetForm = () => {
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
      if (!dojoMembers[dojoId]) {
        fetchDojoMembers(dojoId);
      }
    }
  };

  const toggleClubSelection = (clubId: string) => {
    setSelectedClubs(prev =>
      prev.includes(clubId)
        ? prev.filter(id => id !== clubId)
        : [...prev, clubId]
    );
  };

  const totalMembers = dojos.reduce((acc, d) => acc + (d.members_count || 0), 0);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white font-bold">Chargement...</p>
        </div>
      </div>
    );
  }

  // Non autorisé
  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="bg-red-900/30 border-red-500/50 max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Accès refusé</h2>
            <p className="text-slate-400 mb-4">Cette zone est réservée aux administrateurs.</p>
            <Button onClick={() => router.push(`/${locale}/aikido/dojo`)}>
              Retour au Dojo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link 
              href={`/${locale}/aikido/dojo`}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour au Dojo</span>
            </Link>
            <div className="flex items-center gap-3">
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                <Shield className="w-3 h-3 mr-1" />
                Espace Gestion
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-8 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-xl">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Espace de Gestion</h1>
                <p className="text-slate-400 text-sm">Cadre • Contrôle • Conformité</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-white font-bold">{dojos.length} dojo(s)</p>
                <p className="text-slate-400 text-sm">{totalMembers} adhérent(s)</p>
              </div>
              <Button onClick={fetchDojos} variant="outline" className="border-slate-600 text-slate-300">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="px-4 py-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveSection('dojos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeSection === 'dojos'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Building2 className="w-5 h-5" />
              Mes Dojos ({dojos.length})
            </button>
            <button
              onClick={() => setActiveSection('users')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeSection === 'users'
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              Adhérents ({totalMembers})
            </button>
            <button
              onClick={() => setActiveSection('annuaire')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeSection === 'annuaire'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Globe className="w-5 h-5" />
              Annuaire FFAAA ({CLUBS_AIKIDO_FRANCE.length})
            </button>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Section Dojos */}
        {activeSection === 'dojos' && (
          <div className="space-y-6">
            {/* Formulaire création */}
            <AnimatePresence>
              {showCreateForm ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
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
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Aikido Paris"
                            className="bg-slate-800/50 border-slate-600 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-400 mb-1 block">Ville</label>
                          <Input
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="Paris"
                            className="bg-slate-800/50 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Adresse</label>
                        <Input
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="123 rue de l'Aïkido"
                          className="bg-slate-800/50 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Description</label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Description du dojo..."
                          className="bg-slate-800/50 border-slate-600 text-white min-h-[80px]"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Mot de passe Admin *</label>
                        <Input
                          type="password"
                          value={formData.admin_password}
                          onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
                          placeholder="Mot de passe pour les admins"
                          className="bg-slate-800/50 border-slate-600 text-white"
                        />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button onClick={handleCreateDojo} className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500">
                          <Plus className="w-4 h-4 mr-2" />
                          Créer le dojo
                        </Button>
                        <Button onClick={resetForm} variant="ghost" className="text-slate-400">
                          Annuler
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-4 text-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Créer un nouveau dojo
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
                    <Card className={`overflow-hidden border transition-all ${
                      dojo.is_default
                        ? 'bg-gradient-to-r from-amber-900/30 to-yellow-900/20 border-amber-500/50'
                        : 'bg-slate-800/50 border-slate-700 hover:border-orange-500/30'
                    }`}>
                      <div className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                              dojo.is_default
                                ? 'bg-gradient-to-br from-amber-500 to-yellow-500'
                                : 'bg-gradient-to-br from-orange-500 to-red-500'
                            }`}>
                              <Building2 className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xl font-bold text-white">{dojo.name}</h3>
                                {dojo.is_default && (
                                  <Badge className="bg-amber-500 text-white">Par défaut</Badge>
                                )}
                              </div>
                              {dojo.city && (
                                <p className="text-slate-400 flex items-center gap-1 mt-1">
                                  <MapPin className="w-4 h-4" />
                                  {dojo.city}
                                </p>
                              )}
                              {dojo.description && (
                                <p className="text-slate-500 text-sm mt-2">{dojo.description}</p>
                              )}
                              <div className="flex items-center gap-4 mt-3">
                                <span className="text-orange-400 flex items-center gap-1 font-medium">
                                  <Users className="w-4 h-4" />
                                  {dojo.members_count || 0} adhérent{(dojo.members_count || 0) > 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                if (showAddMember === dojo.id) {
                                  setShowAddMember(null);
                                } else {
                                  setShowAddMember(dojo.id);
                                  resetMemberForm();
                                }
                              }}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white"
                              size="sm"
                            >
                              <UserPlus className="w-4 h-4 mr-1" />
                              Adhérent
                            </Button>
                            <Button
                              onClick={() => toggleDojoExpand(dojo.id)}
                              variant="outline"
                              size="sm"
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                              {expandedDojo === dojo.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                            {!dojo.is_default && (
                              <Button
                                onClick={() => handleDeleteDojo(dojo.id, dojo.name)}
                                variant="outline"
                                size="sm"
                                className="border-red-500/50 text-red-400 hover:bg-red-900/30"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Formulaire création adhérent */}
                      <AnimatePresence>
                        {showAddMember === dojo.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-emerald-500/30"
                          >
                            <div className="p-5 bg-emerald-900/20">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-emerald-300 flex items-center gap-2">
                                  <UserPlus className="w-5 h-5" />
                                  Nouvel adhérent pour {dojo.name}
                                </h4>
                                <button onClick={() => setShowAddMember(null)} className="text-slate-400 hover:text-white">
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="text-sm text-slate-400 mb-1 block">Prénom *</label>
                                  <Input
                                    value={memberFormData.first_name}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, first_name: e.target.value })}
                                    placeholder="Jean"
                                    className="bg-slate-800/50 border-slate-600 text-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm text-slate-400 mb-1 block">Nom *</label>
                                  <Input
                                    value={memberFormData.last_name}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, last_name: e.target.value })}
                                    placeholder="Dupont"
                                    className="bg-slate-800/50 border-slate-600 text-white"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="text-sm text-slate-400 mb-1 block flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> Email *
                                  </label>
                                  <Input
                                    type="email"
                                    value={memberFormData.email}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, email: e.target.value })}
                                    placeholder="jean.dupont@email.com"
                                    className="bg-slate-800/50 border-slate-600 text-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm text-slate-400 mb-1 block flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> Téléphone
                                  </label>
                                  <Input
                                    value={memberFormData.phone}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, phone: e.target.value })}
                                    placeholder="06 12 34 56 78"
                                    className="bg-slate-800/50 border-slate-600 text-white"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="text-sm text-slate-400 mb-1 block flex items-center gap-1">
                                    <Award className="w-3 h-3" /> Grade
                                  </label>
                                  <select
                                    value={memberFormData.belt}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, belt: e.target.value })}
                                    className="w-full h-10 px-3 bg-slate-800/50 border border-slate-600 rounded-md text-white"
                                  >
                                    {BELT_OPTIONS.map(belt => (
                                      <option key={belt.value} value={belt.value}>{belt.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="text-sm text-slate-400 mb-1 block flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Date de naissance
                                  </label>
                                  <Input
                                    type="date"
                                    value={memberFormData.birth_date}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, birth_date: e.target.value })}
                                    className="bg-slate-800/50 border-slate-600 text-white"
                                  />
                                </div>
                              </div>
                              <div className="mb-4">
                                <label className="text-sm text-slate-400 mb-1 block">Mot de passe *</label>
                                <div className="flex gap-2">
                                  <div className="relative flex-1">
                                    <Input
                                      type={showPassword ? 'text' : 'password'}
                                      value={memberFormData.password}
                                      onChange={(e) => setMemberFormData({ ...memberFormData, password: e.target.value })}
                                      placeholder="Mot de passe"
                                      className="bg-slate-800/50 border-slate-600 text-white pr-10"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >
                                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                  </div>
                                  <Button type="button" onClick={generatePassword} variant="outline" className="border-slate-600 text-slate-300">
                                    <RefreshCw className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleCreateMember(dojo.id, dojo.name)}
                                className="w-full bg-gradient-to-r from-emerald-500 to-green-500"
                              >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Créer l&apos;adhérent
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Liste membres */}
                      <AnimatePresence>
                        {expandedDojo === dojo.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-slate-600/50"
                          >
                            <div className="p-5 bg-slate-900/30">
                              <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Membres du dojo ({dojoMembers[dojo.id]?.length || 0})
                              </h4>
                              {!dojoMembers[dojo.id] ? (
                                <div className="text-center py-6">
                                  <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                </div>
                              ) : dojoMembers[dojo.id].length === 0 ? (
                                <p className="text-slate-500 text-center py-6">Aucun membre inscrit</p>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {dojoMembers[dojo.id].map((member) => (
                                    <div
                                      key={member.id}
                                      className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                                    >
                                      <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                                        style={{
                                          backgroundColor: BELT_OPTIONS.find(b => b.value === member.belt)?.color || '#666',
                                          color: member.belt?.includes('Kyu') && !member.belt?.includes('1er') ? '#000' : '#fff'
                                        }}
                                      >
                                        {member.first_name?.[0]}{member.last_name?.[0]}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">
                                          {member.first_name} {member.last_name}
                                        </p>
                                        <p className="text-slate-500 text-xs truncate">{member.email}</p>
                                        <Badge className="mt-1 text-xs" variant="outline">
                                          {member.belt || '6e Kyu'}
                                        </Badge>
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
          </div>
        )}

        {/* Section Adhérents */}
        {activeSection === 'users' && (
          <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gestion des Adhérents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4">
                Pour gérer les adhérents, sélectionnez un dojo dans l&apos;onglet &quot;Mes Dojos&quot; et utilisez les boutons &quot;Adhérent&quot; et la liste déroulante.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-black text-orange-400">{totalMembers}</p>
                  <p className="text-slate-400 text-sm">Total adhérents</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-black text-emerald-400">{dojos.length}</p>
                  <p className="text-slate-400 text-sm">Dojos actifs</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-black text-cyan-400">
                    {dojos.length > 0 ? Math.round(totalMembers / dojos.length) : 0}
                  </p>
                  <p className="text-slate-400 text-sm">Moyenne/dojo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section Annuaire FFAAA */}
        {activeSection === 'annuaire' && (
          <div className="space-y-6">
            {/* Stats régions */}
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2">
              {Object.entries(REGIONS_FRANCE).slice(0, 14).map(([key, region]) => {
                const count = regionStats[key]?.count || 0;
                if (count === 0) return null;
                return (
                  <button
                    key={key}
                    onClick={() => setAnnuaireRegion(annuaireRegion === key ? 'all' : key)}
                    className={`p-2 rounded-lg text-center transition-all ${
                      annuaireRegion === key
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
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
                <Input
                  value={annuaireSearch}
                  onChange={(e) => setAnnuaireSearch(e.target.value)}
                  placeholder="Rechercher un club par nom ou ville..."
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <select
                value={annuaireRegion}
                onChange={(e) => setAnnuaireRegion(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              >
                <option value="all">Toutes les régions ({CLUBS_AIKIDO_FRANCE.length})</option>
                {Object.entries(REGIONS_FRANCE).map(([key, region]) => {
                  const count = regionStats[key]?.count || 0;
                  return (
                    <option key={key} value={key}>
                      {region.emoji} {region.name} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Résultats */}
            <p className="text-slate-400 text-sm">{filteredClubs.length} club(s) trouvé(s)</p>

            {/* Liste clubs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredClubs.map(club => {
                const region = REGIONS_FRANCE[club.region];
                const isSelected = selectedClubs.includes(club.id);

                return (
                  <div
                    key={club.id}
                    onClick={() => toggleClubSelection(club.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-900/30 border-blue-500/50 ring-2 ring-blue-500/30'
                        : 'bg-slate-800/50 border-slate-700 hover:border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                          <h4 className="text-white font-medium truncate">{club.name}</h4>
                        </div>
                        <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {club.city}
                        </p>
                        {club.address && (
                          <p className="text-slate-500 text-xs mt-1 truncate">{club.address}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {region?.emoji} {club.federation}
                      </Badge>
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
                  <Button onClick={() => setSelectedClubs([])} variant="outline" size="sm" className="border-slate-600 text-slate-300">
                    Annuler
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success(`${selectedClubs.length} club(s) importé(s) !`);
                      setSelectedClubs([]);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Importer
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
