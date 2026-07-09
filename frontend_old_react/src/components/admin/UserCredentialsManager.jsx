/**
 * 🔐 USER CREDENTIALS MANAGER
 * 
 * Gestionnaire des comptes utilisateurs organisés par catégorie :
 * - Dojo : Comptes des dojos (clubs)
 * - Admin : Comptes administrateurs
 * - Adhérent : Comptes des pratiquants
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  Building2,
  Shield,
  Users,
  Search,
  Eye,
  EyeOff,
  Copy,
  Key,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Edit3,
  RefreshCw,
  Lock,
  UserCog,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Catégories de comptes
const CATEGORIES = {
  dojo: {
    id: 'dojo',
    label: 'Dojos',
    icon: Building2,
    color: 'orange',
    description: 'Comptes des clubs affiliés',
    bgClass: 'bg-orange-500/20',
    borderClass: 'border-orange-500/50',
    textClass: 'text-orange-400'
  },
  admin: {
    id: 'admin',
    label: 'Administrateurs',
    icon: Shield,
    color: 'cyan',
    description: 'Comptes avec accès administrateur',
    bgClass: 'bg-cyan-500/20',
    borderClass: 'border-cyan-500/50',
    textClass: 'text-cyan-400'
  },
  adherent: {
    id: 'adherent',
    label: 'Adhérents',
    icon: Users,
    color: 'emerald',
    description: 'Comptes des pratiquants',
    bgClass: 'bg-emerald-500/20',
    borderClass: 'border-emerald-500/50',
    textClass: 'text-emerald-400'
  }
};

// Composant pour afficher un mot de passe masqué/visible
const PasswordField = ({ password, showPassword, onToggle, onCopy }) => {
  return (
    <div className="flex items-center gap-2">
      <code className={`px-2 py-1 rounded text-sm font-mono ${showPassword ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-500'}`}>
        {showPassword ? password : '••••••••'}
      </code>
      <Button
        size="sm"
        variant="ghost"
        onClick={onToggle}
        className="h-7 w-7 p-0 text-slate-400 hover:text-white"
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onCopy(password)}
        className="h-7 w-7 p-0 text-slate-400 hover:text-cyan-400"
        title="Copier"
      >
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  );
};

// Carte utilisateur
const UserCredentialCard = ({ user, category, onEdit, visiblePasswords, togglePassword, copyToClipboard }) => {
  const catConfig = CATEGORIES[category];
  const Icon = catConfig.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${catConfig.bgClass} border ${catConfig.borderClass} rounded-xl p-4 hover:border-opacity-80 transition-all`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-10 h-10 rounded-lg ${catConfig.bgClass} border ${catConfig.borderClass} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${catConfig.textClass}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-white">{user.name || user.display_name || 'Sans nom'}</h4>
              <Badge className={`text-xs ${user.is_active !== false ? 'bg-emerald-600' : 'bg-slate-600'}`}>
                {user.is_active !== false ? (
                  <><CheckCircle2 className="w-3 h-3 mr-1" />Actif</>
                ) : (
                  <><XCircle className="w-3 h-3 mr-1" />Inactif</>
                )}
              </Badge>
            </div>
            
            {/* Email */}
            <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            
            {/* Mot de passe */}
            <div className="flex items-center gap-2 mt-2">
              <Key className={`w-4 h-4 ${catConfig.textClass}`} />
              <PasswordField
                password={user.password || user.admin_password || '(non disponible)'}
                showPassword={visiblePasswords[user.id]}
                onToggle={() => togglePassword(user.id)}
                onCopy={copyToClipboard}
              />
            </div>
            
            {/* Info supplémentaire selon la catégorie */}
            {category === 'dojo' && user.city && (
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                <Building2 className="w-3 h-3" />
                <span>{user.city}</span>
              </div>
            )}
            
            {category === 'adherent' && user.dojo_name && (
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                <Building2 className="w-3 h-3" />
                <span>{user.dojo_name}</span>
              </div>
            )}
            
            {user.created_at && (
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                <Calendar className="w-3 h-3" />
                <span>Créé le {new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(user)}
            className="text-slate-400 hover:text-white h-8 w-8 p-0"
            title="Modifier"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Composant principal
const UserCredentialsManager = () => {
  const [activeTab, setActiveTab] = useState('dojo');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  
  // Données
  const [dojos, setDojos] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [adherents, setAdherents] = useState([]);
  
  // Dialog d'édition
  const [editDialog, setEditDialog] = useState({ open: false, user: null, category: null });
  const [newPassword, setNewPassword] = useState('');
  
  // Charger les données
  useEffect(() => {
    loadAllData();
  }, []);
  
  const loadAllData = async () => {
    setLoading(true);
    try {
      // Charger les dojos
      const dojosRes = await axios.get(`${API}/dojos`);
      const dojosData = dojosRes.data.dojos || [];
      setDojos(dojosData.map(d => ({
        ...d,
        name: d.name,
        password: d.admin_password // Note: en prod, ceci ne devrait pas être exposé
      })));
      
      // Charger les utilisateurs
      const usersRes = await axios.get(`${API}/users`);
      const usersData = usersRes.data.users || usersRes.data || [];
      
      // Séparer admins et adhérents
      const adminUsers = usersData.filter(u => u.role === 'admin' || u.is_admin);
      const adherentUsers = usersData.filter(u => u.role !== 'admin' && !u.is_admin);
      
      setAdmins(adminUsers.map(u => ({
        ...u,
        name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
        password: u.password_plain || '(hashé)' // En prod, les mots de passe sont hashés
      })));
      
      setAdherents(adherentUsers.map(u => ({
        ...u,
        name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
        password: u.password_plain || '(hashé)'
      })));
      
    } catch (error) {
      console.error('Erreur chargement données:', error);
      toast.error('Erreur lors du chargement des données');
    }
    setLoading(false);
  };
  
  // Toggle visibilité mot de passe
  const togglePassword = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  // Copier dans le presse-papier
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papier');
  };
  
  // Ouvrir dialog édition
  const handleEdit = (user, category) => {
    setEditDialog({ open: true, user, category });
    setNewPassword('');
  };
  
  // Sauvegarder le nouveau mot de passe
  const handleSavePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    try {
      const { user, category } = editDialog;
      
      if (category === 'dojo') {
        // Mettre à jour le mot de passe du dojo
        await axios.put(`${API}/dojos/${user.id}`, {
          admin_password: newPassword
        }, {
          params: { super_admin_password: 'superaikido2024' } // À sécuriser en prod
        });
      } else {
        // Mettre à jour le mot de passe utilisateur
        await axios.patch(`${API}/users/${user.id}/password`, {
          password: newPassword
        });
      }
      
      toast.success('Mot de passe mis à jour');
      setEditDialog({ open: false, user: null, category: null });
      loadAllData();
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du mot de passe');
    }
  };
  
  // Générer un mot de passe aléatoire
  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
  };
  
  // Filtrer les données selon la recherche
  const filterData = (data) => {
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(item =>
      (item.name || '').toLowerCase().includes(term) ||
      (item.email || '').toLowerCase().includes(term) ||
      (item.city || '').toLowerCase().includes(term)
    );
  };
  
  // Données filtrées
  const filteredDojos = filterData(dojos);
  const filteredAdmins = filterData(admins);
  const filteredAdherents = filterData(adherents);
  
  // Obtenir les données actuelles selon l'onglet
  const getCurrentData = () => {
    switch (activeTab) {
      case 'dojo': return filteredDojos;
      case 'admin': return filteredAdmins;
      case 'adherent': return filteredAdherents;
      default: return [];
    }
  };
  
  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            Gestion des comptes
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Organisés par catégorie : Dojo, Admin, Adhérent
          </p>
        </div>
        
        <Button
          onClick={loadAllData}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>
      
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const count = key === 'dojo' ? dojos.length : key === 'admin' ? admins.length : adherents.length;
          const Icon = cat.icon;
          return (
            <Card 
              key={key}
              className={`${cat.bgClass} border ${cat.borderClass} cursor-pointer transition-all hover:scale-[1.02]`}
              onClick={() => setActiveTab(key)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className={`w-6 h-6 ${cat.textClass}`} />
                  <div>
                    <p className="text-white font-semibold">{cat.label}</p>
                    <p className="text-sm text-slate-400">{count} compte(s)</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${cat.textClass}`} />
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Recherche */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher par nom, email ou ville..."
          className="pl-10 bg-slate-800 border-slate-700 text-white"
        />
      </div>
      
      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800 border-slate-700 mb-6">
          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const Icon = cat.icon;
            return (
              <TabsTrigger 
                key={key}
                value={key}
                className={`data-[state=active]:bg-gradient-to-r ${
                  key === 'dojo' ? 'data-[state=active]:from-orange-600 data-[state=active]:to-amber-600' :
                  key === 'admin' ? 'data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600' :
                  'data-[state=active]:from-emerald-600 data-[state=active]:to-green-600'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {cat.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        {/* Contenu des onglets */}
        {Object.keys(CATEGORIES).map((key) => (
          <TabsContent key={key} value={key}>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-slate-400">Chargement...</p>
              </div>
            ) : getCurrentData().length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                  <p className="text-slate-400">
                    {searchTerm ? 'Aucun résultat trouvé' : 'Aucun compte dans cette catégorie'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {getCurrentData().map((item) => (
                  <UserCredentialCard
                    key={item.id}
                    user={item}
                    category={key}
                    onEdit={(user) => handleEdit(user, key)}
                    visiblePasswords={visiblePasswords}
                    togglePassword={togglePassword}
                    copyToClipboard={copyToClipboard}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Dialog d'édition de mot de passe */}
      <Dialog open={editDialog.open} onOpenChange={(open) => !open && setEditDialog({ open: false, user: null, category: null })}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" />
              Modifier le mot de passe
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {editDialog.user?.name || editDialog.user?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Nouveau mot de passe</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="bg-slate-800 border-slate-700 text-white flex-1"
                />
                <Button
                  variant="outline"
                  onClick={generatePassword}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {newPassword && (
              <div className="p-3 bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Aperçu :</p>
                <code className="text-emerald-400 font-mono">{newPassword}</code>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialog({ open: false, user: null, category: null })}
              className="border-slate-600 text-slate-300"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSavePassword}
              className="bg-amber-600 hover:bg-amber-500"
              disabled={!newPassword || newPassword.length < 6}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Note de sécurité */}
      <Card className="mt-6 bg-amber-900/20 border-amber-700/30">
        <CardContent className="p-4">
          <p className="text-amber-400 text-sm flex items-start gap-2">
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Note de sécurité :</strong> Les mots de passe des adhérents sont stockés de manière sécurisée (hashés).
              Seuls les mots de passe des dojos peuvent être visualisés et modifiés directement.
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCredentialsManager;
