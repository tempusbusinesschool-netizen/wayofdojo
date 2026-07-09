import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Building2, Plus, Edit2, Trash2, Users, MapPin, Shield, 
  UserPlus, ChevronDown, ChevronUp, Mail, Phone, Calendar,
  Award, Eye, EyeOff, RefreshCw
} from "lucide-react";

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

function DojoManagement({ isOpen, onClose }) {
  const [dojos, setDojos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDojo, setEditingDojo] = useState(null);
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

  useEffect(() => {
    if (isOpen) {
      fetchDojos();
    }
  }, [isOpen]);

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
    if (!superAdminPassword) {
      toast.error("Mot de passe Super Admin requis");
      return;
    }

    try {
      const response = await axios.post(`${API}/dojos`, {
        dojo: formData,
        auth: { super_admin_password: superAdminPassword }
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
    setEditingDojo(null);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-blue-500/40 text-white max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-blue-500/20 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-300 to-indigo-400 bg-clip-text text-transparent">
              Gestion des Dojos
            </span>
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {dojos.length} dojo{dojos.length > 1 ? 's' : ''} • Gérez vos clubs et adhérents
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 pr-2">
          {/* Super Admin Password */}
          <div className="mb-4 p-3 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 font-semibold text-sm">Authentification Super Admin</span>
            </div>
            <Input
              type="password"
              value={superAdminPassword}
              onChange={(e) => setSuperAdminPassword(e.target.value)}
              placeholder="Mot de passe Super Admin"
              className="bg-slate-800/50 border-yellow-500/30 text-white"
            />
          </div>

          {/* Create/Edit Form */}
          {showCreateForm ? (
            <div className="mb-6 p-4 bg-blue-900/30 rounded-xl border border-blue-500/30">
              <h4 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {editingDojo ? "Modifier le dojo" : "Nouveau dojo"}
              </h4>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Nom du dojo *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Aikido Paris"
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Ville</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Paris"
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="text-xs text-slate-400 mb-1 block">Adresse</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="123 rue de l'Aïkido"
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
              
              <div className="mb-3">
                <label className="text-xs text-slate-400 mb-1 block">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Description du dojo..."
                  className="bg-slate-800/50 border-slate-600 text-white min-h-[60px]"
                />
              </div>
              
              <div className="mb-4">
                <label className="text-xs text-slate-400 mb-1 block">Mot de passe Admin du dojo *</label>
                <Input
                  type="password"
                  value={formData.admin_password}
                  onChange={(e) => setFormData({...formData, admin_password: e.target.value})}
                  placeholder="Mot de passe pour les admins du dojo"
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
                <p className="text-xs text-slate-500 mt-1">Ce mot de passe sera utilisé par les admins du dojo</p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateDojo}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400"
                >
                  {editingDojo ? "Mettre à jour" : "Créer le dojo"}
                </Button>
                <Button onClick={resetForm} variant="ghost" className="text-slate-400">
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowCreateForm(true)}
              className="w-full mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-bold py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Créer un nouveau dojo
            </Button>
          )}

          {/* Dojos List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Chargement...</p>
            </div>
          ) : dojos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-6xl mb-4">🏢</p>
              <p className="text-slate-300 font-semibold mb-2">Aucun dojo</p>
              <p className="text-slate-400 text-sm">Créez votre premier dojo</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dojos.map((dojo) => (
                <div
                  key={dojo.id}
                  className={`rounded-xl border transition-all ${
                    dojo.is_default
                      ? 'bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border-amber-500/50'
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-blue-500/30'
                  }`}
                >
                  {/* Dojo Header */}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          dojo.is_default 
                            ? 'bg-gradient-to-br from-amber-500 to-yellow-500' 
                            : 'bg-gradient-to-br from-blue-500 to-indigo-500'
                        }`}>
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-white">{dojo.name}</h4>
                            {dojo.is_default && (
                              <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
                                Par défaut
                              </span>
                            )}
                          </div>
                          {dojo.city && (
                            <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {dojo.city}
                            </p>
                          )}
                          {dojo.description && (
                            <p className="text-slate-500 text-xs mt-1">{dojo.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs">
                            <span className="text-blue-400 flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {dojo.members_count || 0} membre{(dojo.members_count || 0) > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        {/* Bouton Ajouter Adhérent */}
                        <button
                          onClick={() => {
                            if (showAddMember === dojo.id) {
                              setShowAddMember(null);
                            } else {
                              setShowAddMember(dojo.id);
                              resetMemberForm();
                            }
                          }}
                          className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/30 rounded-lg transition-all flex items-center gap-1"
                          title="Ajouter un adhérent"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span className="text-xs hidden sm:inline">Adhérent</span>
                        </button>
                        
                        {/* Bouton Voir membres */}
                        <button
                          onClick={() => toggleDojoExpand(dojo.id)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-lg transition-all"
                          title="Voir les membres"
                        >
                          {expandedDojo === dojo.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        
                        {!dojo.is_default && (
                          <button
                            onClick={() => handleDeleteDojo(dojo.id, dojo.name)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-all"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Formulaire Création Adhérent */}
                  {showAddMember === dojo.id && (
                    <div className="px-4 pb-4">
                      <div className="p-4 bg-emerald-900/30 rounded-xl border border-emerald-500/30">
                        <h5 className="font-bold text-emerald-300 mb-3 flex items-center gap-2">
                          <UserPlus className="w-4 h-4" />
                          Nouvel adhérent pour {dojo.name}
                        </h5>
                        
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="text-xs text-slate-400 mb-1 block">Prénom *</label>
                            <Input
                              value={memberFormData.first_name}
                              onChange={(e) => setMemberFormData({...memberFormData, first_name: e.target.value})}
                              placeholder="Jean"
                              className="bg-slate-800/50 border-slate-600 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-slate-400 mb-1 block">Nom *</label>
                            <Input
                              value={memberFormData.last_name}
                              onChange={(e) => setMemberFormData({...memberFormData, last_name: e.target.value})}
                              placeholder="Dupont"
                              className="bg-slate-800/50 border-slate-600 text-white"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="text-xs text-slate-400 mb-1 block flex items-center gap-1">
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
                            <label className="text-xs text-slate-400 mb-1 block flex items-center gap-1">
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
                        
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="text-xs text-slate-400 mb-1 block flex items-center gap-1">
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
                            <label className="text-xs text-slate-400 mb-1 block flex items-center gap-1">
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
                          <label className="text-xs text-slate-400 mb-1 block">Mot de passe *</label>
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
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
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
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleCreateMember(dojo.id, dojo.name)}
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Créer l'adhérent
                          </Button>
                          <Button 
                            onClick={() => setShowAddMember(null)} 
                            variant="ghost" 
                            className="text-slate-400"
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Liste des membres */}
                  {expandedDojo === dojo.id && (
                    <div className="px-4 pb-4">
                      <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                        <h5 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Membres du dojo ({dojoMembers[dojo.id]?.length || 0})
                        </h5>
                        
                        {!dojoMembers[dojo.id] ? (
                          <div className="text-center py-4">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          </div>
                        ) : dojoMembers[dojo.id].length === 0 ? (
                          <p className="text-slate-500 text-sm text-center py-4">Aucun membre</p>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {dojoMembers[dojo.id].map((member) => (
                              <div 
                                key={member.id} 
                                className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div 
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                    style={{ 
                                      backgroundColor: BELT_OPTIONS.find(b => b.value === member.belt)?.color || '#666',
                                      color: member.belt?.includes('Kyu') && !member.belt?.includes('1er') ? '#000' : '#fff'
                                    }}
                                  >
                                    {member.first_name?.[0]}{member.last_name?.[0]}
                                  </div>
                                  <div>
                                    <p className="text-white text-sm font-medium">
                                      {member.first_name} {member.last_name}
                                    </p>
                                    <p className="text-slate-500 text-xs">{member.email}</p>
                                  </div>
                                </div>
                                <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                                  {member.belt || '6e Kyu'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-blue-500/20 pt-4 mt-2">
          <p className="text-center text-xs text-slate-500 italic">
            🔐 Seul le Super Admin peut créer et gérer les dojos
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DojoManagement;
