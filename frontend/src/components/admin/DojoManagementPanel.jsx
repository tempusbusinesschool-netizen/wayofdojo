/**
 * 🏢 DOJO MANAGEMENT PANEL
 * 
 * Panneau de gestion des dojos intégré directement dans l'admin
 * Fonctionnalités: Créer dojos, créer adhérents, voir membres, importer clubs FFAAA
 */

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Plus, Trash2, Users, MapPin, Shield, 
  UserPlus, ChevronDown, ChevronUp, Mail, Phone, Calendar,
  Award, Eye, EyeOff, RefreshCw, Search, X, Download, Globe,
  CheckCircle2, Filter, UserCog, GraduationCap
} from "lucide-react";
import CLUBS_AIKIDO_FRANCE, { REGIONS_FRANCE, getRegionStats } from "@/data/clubsAikidoFrance";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

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

function DojoManagementPanel() {
  const [activeTab, setActiveTab] = useState('mes-dojos');
  const [dojos, setDojos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [superAdminPassword, setSuperAdminPassword] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    admin_password: ""
  });
  
  // États pour la création d'adhérent
  const [expandedDojo, setExpandedDojo] = useState(null);
  const [showAddMember, setShowAddMember] = useState(null);
  const [memberFormData, setMemberFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    belt: "6e Kyu",
    birth_date: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [dojoMembers, setDojoMembers] = useState({});
  
  // États pour l'annuaire FFAAA
  const [annuaireSearch, setAnnuaireSearch] = useState('');
  const [annuaireRegion, setAnnuaireRegion] = useState('all');
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [importingClubs, setImportingClubs] = useState(false);
  
  // Statistiques des régions
  const regionStats = useMemo(() => getRegionStats(), []);
  
  // Filtrer les clubs de l'annuaire
  const filteredClubs = useMemo(() => {
    return CLUBS_AIKIDO_FRANCE.filter(club => {
      const matchesSearch = annuaireSearch === '' || 
        club.name.toLowerCase().includes(annuaireSearch.toLowerCase()) ||
        club.city.toLowerCase().includes(annuaireSearch.toLowerCase());
      const matchesRegion = annuaireRegion === 'all' || club.region === annuaireRegion;
      return matchesSearch && matchesRegion;
    });
  }, [annuaireSearch, annuaireRegion]);

  useEffect(() => {
    fetchDojos();
  }, []);

  const fetchDojos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/dojos`);
      setDojos(response.data.dojos || []);
    } catch (error) {
      console.error("Error fetching dojos:", error);
      toast.error("Erreur lors du chargement des dojos");
    } finally {
      setLoading(false);
    }
  };

  const fetchDojoMembers = async (dojoId) => {
    try {
      const response = await axios.get(`${API}/users`);
      const allUsers = response.data.users || response.data || [];
      const members = allUsers.filter(u => u.dojo_id === dojoId);
      setDojoMembers(prev => ({ ...prev, [dojoId]: members }));
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleCreateDojo = async () => {
    if (!formData.name || !formData.admin_password) {
      toast.error("Nom et mot de passe admin requis");
      return;
    }

    try {
      const response = await axios.post(`${API}/dojos`, {
        dojo: formData,
        auth: { super_admin_password: "123456" }
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        setDojos([...dojos, response.data.dojo]);
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur lors de la création");
    }
  };

  const handleDeleteDojo = async (dojoId, dojoName) => {
    if (!superAdminPassword) {
      toast.error("Entrez le mot de passe Super Admin");
      return;
    }
    
    if (!window.confirm(`Supprimer le dojo "${dojoName}" ? Les membres seront transférés au dojo par défaut.`)) {
      return;
    }

    try {
      const response = await axios.delete(`${API}/dojos/${dojoId}`, {
        data: { super_admin_password: superAdminPassword }
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        setDojos(dojos.filter(d => d.id !== dojoId));
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur lors de la suppression");
    }
  };

  const handleCreateMember = async (dojoId, dojoName) => {
    if (!memberFormData.first_name || !memberFormData.last_name || !memberFormData.email || !memberFormData.password) {
      toast.error("Prénom, nom, email et mot de passe requis");
      return;
    }

    try {
      const response = await axios.post(`${API}/users/register`, {
        first_name: memberFormData.first_name,
        last_name: memberFormData.last_name,
        email: memberFormData.email,
        password: memberFormData.password,
        phone: memberFormData.phone || undefined,
        belt: memberFormData.belt,
        birth_date: memberFormData.birth_date || undefined,
        dojo_id: dojoId,
        dojo_name: dojoName
      });
      
      if (response.data.user) {
        toast.success(`Adhérent ${memberFormData.first_name} ${memberFormData.last_name} créé avec succès !`);
        resetMemberForm();
        setShowAddMember(null);
        fetchDojoMembers(dojoId);
        fetchDojos(); // Refresh member count
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur lors de la création de l'adhérent");
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
    setFormData({
      name: "",
      description: "",
      address: "",
      city: "",
      admin_password: ""
    });
    setShowCreateForm(false);
  };

  const resetMemberForm = () => {
    setMemberFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      belt: "6e Kyu",
      birth_date: ""
    });
  };
  
  // Sélection/désélection d'un club pour import
  const toggleClubSelection = (clubId) => {
    setSelectedClubs(prev => 
      prev.includes(clubId) 
        ? prev.filter(id => id !== clubId)
        : [...prev, clubId]
    );
  };
  
  // Sélectionner tous les clubs filtrés
  const selectAllFiltered = () => {
    const filteredIds = filteredClubs.map(c => c.id);
    setSelectedClubs(prev => {
      const allSelected = filteredIds.every(id => prev.includes(id));
      if (allSelected) {
        return prev.filter(id => !filteredIds.includes(id));
      } else {
        return [...new Set([...prev, ...filteredIds])];
      }
    });
  };
  
  // Importer les clubs sélectionnés
  const handleImportClubs = async () => {
    if (selectedClubs.length === 0) {
      toast.error("Sélectionnez au moins un club à importer");
      return;
    }
    if (!superAdminPassword) {
      toast.error("Mot de passe Super Admin requis");
      return;
    }
    
    setImportingClubs(true);
    let imported = 0;
    let errors = 0;
    
    for (const clubId of selectedClubs) {
      const club = CLUBS_AIKIDO_FRANCE.find(c => c.id === clubId);
      if (!club) continue;
      
      // Vérifier si le club existe déjà
      const exists = dojos.some(d => d.id === club.id || d.name === club.name);
      if (exists) {
        errors++;
        continue;
      }
      
      try {
        await axios.post(`${API}/dojos`, {
          dojo: {
            id: club.id,
            name: club.name,
            city: club.city,
            address: club.address || '',
            description: `${club.federation} - ${REGIONS_FRANCE[club.region]?.name || club.region}${club.description ? ' - ' + club.description : ''}`,
            admin_password: '123456', // Mot de passe par défaut
            email: club.email || '',
            phone: club.phone || '',
            website: club.website || ''
          },
          auth: { super_admin_password: superAdminPassword }
        });
        imported++;
      } catch (error) {
        console.error(`Erreur import ${club.name}:`, error);
        errors++;
      }
    }
    
    setImportingClubs(false);
    setSelectedClubs([]);
    
    if (imported > 0) {
      toast.success(`${imported} club(s) importé(s) avec succès !`);
      fetchDojos();
    }
    if (errors > 0) {
      toast.warning(`${errors} club(s) ignoré(s) (déjà existants ou erreur)`);
    }
  };

  const toggleDojoExpand = (dojoId) => {
    if (expandedDojo === dojoId) {
      setExpandedDojo(null);
    } else {
      setExpandedDojo(dojoId);
      if (!dojoMembers[dojoId]) {
        fetchDojoMembers(dojoId);
      }
    }
  };

  // Stats
  const totalMembers = dojos.reduce((acc, d) => acc + (d.members_count || 0), 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Gestion des Dojos</h1>
            <p className="text-slate-400">
              {dojos.length} dojo(s) enregistré(s) • {totalMembers} adhérent(s) • {CLUBS_AIKIDO_FRANCE.length} clubs dans l'annuaire FFAAA
            </p>
          </div>
        </div>
        
        <Button
          onClick={fetchDojos}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Super Admin Password */}
      <Card className="mb-6 bg-amber-900/20 border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-amber-400" />
            <span className="text-amber-300 font-semibold">Authentification Super Admin</span>
          </div>
          <Input
            type="password"
            value={superAdminPassword}
            onChange={(e) => setSuperAdminPassword(e.target.value)}
            placeholder="Entrez le mot de passe Super Admin pour les actions sensibles"
            className="bg-slate-800/50 border-amber-500/30 text-white"
          />
          <p className="text-xs text-amber-400/70 mt-2">Requis pour créer/supprimer des dojos et importer des clubs</p>
        </CardContent>
      </Card>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-800 border-slate-700 mb-6 w-full justify-start">
          <TabsTrigger 
            value="mes-dojos"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-amber-600"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Mes Dojos ({dojos.length})
          </TabsTrigger>
          <TabsTrigger 
            value="annuaire"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600"
          >
            <Globe className="w-4 h-4 mr-2" />
            Annuaire FFAAA ({CLUBS_AIKIDO_FRANCE.length})
          </TabsTrigger>
        </TabsList>
        
        {/* Onglet Mes Dojos */}
        <TabsContent value="mes-dojos">
          {/* Create Dojo Button / Form */}
          <AnimatePresence>
            {showCreateForm ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="mb-6 bg-blue-900/20 border-blue-500/30">
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
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Aikido Paris"
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Ville</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="Paris"
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Adresse</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="123 rue de l'Aïkido"
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Description du dojo..."
                    className="bg-slate-800/50 border-slate-600 text-white min-h-[80px]"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Mot de passe Admin du dojo *</label>
                  <Input
                    type="password"
                    value={formData.admin_password}
                    onChange={(e) => setFormData({...formData, admin_password: e.target.value})}
                    placeholder="Mot de passe pour les admins du dojo"
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleCreateDojo}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400"
                  >
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
            className="w-full mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-bold py-4 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Créer un nouveau dojo
          </Button>
        )}
      </AnimatePresence>

      {/* Dojos List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement des dojos...</p>
        </div>
      ) : dojos.length === 0 ? (
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
            <motion.div
              key={dojo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className={`overflow-hidden border transition-all ${
                dojo.is_default
                  ? 'bg-gradient-to-r from-amber-900/30 to-yellow-900/20 border-amber-500/50'
                  : 'bg-slate-800/50 border-slate-700 hover:border-orange-500/30'
              }`}>
                {/* Dojo Header */}
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
                      {/* Bouton Ajouter Adhérent */}
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
                      
                      {/* Bouton Voir membres */}
                      <Button
                        onClick={() => toggleDojoExpand(dojo.id)}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        {expandedDojo === dojo.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
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
                
                {/* Formulaire Création Adhérent */}
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
                          <button
                            onClick={() => setShowAddMember(null)}
                            className="text-slate-400 hover:text-white"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="text-sm text-slate-400 mb-1 block">Prénom *</label>
                            <Input
                              value={memberFormData.first_name}
                              onChange={(e) => setMemberFormData({...memberFormData, first_name: e.target.value})}
                              placeholder="Jean"
                              className="bg-slate-800/50 border-slate-600 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-slate-400 mb-1 block">Nom *</label>
                            <Input
                              value={memberFormData.last_name}
                              onChange={(e) => setMemberFormData({...memberFormData, last_name: e.target.value})}
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
                              onChange={(e) => setMemberFormData({...memberFormData, email: e.target.value})}
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
                              onChange={(e) => setMemberFormData({...memberFormData, phone: e.target.value})}
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
                              onChange={(e) => setMemberFormData({...memberFormData, belt: e.target.value})}
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
                              onChange={(e) => setMemberFormData({...memberFormData, birth_date: e.target.value})}
                              className="bg-slate-800/50 border-slate-600 text-white"
                            />
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="text-sm text-slate-400 mb-1 block">Mot de passe *</label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Input
                                type={showPassword ? "text" : "password"}
                                value={memberFormData.password}
                                onChange={(e) => setMemberFormData({...memberFormData, password: e.target.value})}
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
                            <Button
                              type="button"
                              onClick={generatePassword}
                              variant="outline"
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                              title="Générer un mot de passe"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleCreateMember(dojo.id, dojo.name)}
                          className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Créer l'adhérent
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Liste des membres */}
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
                            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
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
        </TabsContent>
        
        {/* Onglet Annuaire FFAAA */}
        <TabsContent value="annuaire">
          {/* Stats rapides par région */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
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
          
          {/* DOM-TOM */}
          <div className="mb-6 p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-xl">
            <h3 className="text-cyan-300 font-semibold mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Outre-Mer
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(REGIONS_FRANCE).slice(14).map(([key, region]) => {
                const count = regionStats[key]?.count || 0;
                return (
                  <button
                    key={key}
                    onClick={() => setAnnuaireRegion(annuaireRegion === key ? 'all' : key)}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      annuaireRegion === key 
                        ? 'bg-cyan-500 text-white' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <span>{region.emoji}</span>
                    <span className="text-sm">{region.name}</span>
                    <Badge variant="outline" className="text-xs">{count}</Badge>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Recherche et filtres */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
          
          {/* Actions d'import */}
          {selectedClubs.length > 0 && (
            <div className="mb-4 p-4 bg-emerald-900/30 border border-emerald-500/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300 font-medium">{selectedClubs.length} club(s) sélectionné(s)</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedClubs([])}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleImportClubs}
                  disabled={importingClubs}
                  className="bg-emerald-500 hover:bg-emerald-400"
                  size="sm"
                >
                  {importingClubs ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Import...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Importer
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {/* Bouton tout sélectionner */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-400 text-sm">
              {filteredClubs.length} club(s) trouvé(s)
            </p>
            <Button
              onClick={selectAllFiltered}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300"
            >
              {filteredClubs.every(c => selectedClubs.includes(c.id)) ? 'Désélectionner tout' : 'Sélectionner tout'}
            </Button>
          </div>
          
          {/* Liste des clubs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto">
            {filteredClubs.map(club => {
              const region = REGIONS_FRANCE[club.region];
              const isSelected = selectedClubs.includes(club.id);
              const isAlreadyImported = dojos.some(d => d.id === club.id || d.name === club.name);
              
              return (
                <div
                  key={club.id}
                  onClick={() => !isAlreadyImported && toggleClubSelection(club.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isAlreadyImported
                      ? 'bg-slate-800/30 border-slate-700 opacity-50 cursor-not-allowed'
                      : isSelected
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
                      
                      {/* Téléphone et Email */}
                      {(club.phone || club.email) && (
                        <div className="mt-2 space-y-1">
                          {club.phone && (
                            <p className="text-cyan-400 text-xs flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <a 
                                href={`tel:${club.phone}`} 
                                onClick={(e) => e.stopPropagation()}
                                className="hover:underline"
                              >
                                {club.phone}
                              </a>
                            </p>
                          )}
                          {club.email && (
                            <p className="text-emerald-400 text-xs flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <a 
                                href={`mailto:${club.email}`} 
                                onClick={(e) => e.stopPropagation()}
                                className="hover:underline truncate"
                              >
                                {club.email}
                              </a>
                            </p>
                          )}
                        </div>
                      )}
                      
                      {/* Président */}
                      {club.president && (
                        <div className="mt-2">
                          <p className="text-amber-400 text-xs flex items-center gap-1">
                            <UserCog className="w-3 h-3" />
                            <span className="font-medium">Président:</span> {club.president}
                          </p>
                        </div>
                      )}
                      
                      {/* Enseignants */}
                      {club.instructors && club.instructors.length > 0 && (
                        <div className="mt-2">
                          <p className="text-purple-400 text-xs flex items-start gap-1">
                            <GraduationCap className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>
                              <span className="font-medium">Enseignants:</span>{' '}
                              {club.instructors.join(', ')}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-lg">{region?.emoji}</span>
                      {isAlreadyImported && (
                        <Badge className="mt-1 bg-emerald-600 text-xs">Importé</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                      {club.federation}
                    </Badge>
                    {club.website && (
                      <Badge variant="outline" className="text-xs border-cyan-600 text-cyan-400">
                        Web
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredClubs.length === 0 && (
            <div className="text-center py-12">
              <Globe className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Aucun club trouvé</p>
            </div>
          )}
          
          {/* Note source */}
          <div className="mt-6 p-4 bg-slate-800/30 rounded-xl">
            <p className="text-xs text-slate-500">
              <strong>Sources :</strong> FFAAA, FFAB, Ligues régionales. Données compilées à titre informatif.
              Pour des informations à jour, consultez <a href="https://aikido.com.fr" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">aikido.com.fr</a>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DojoManagementPanel;
