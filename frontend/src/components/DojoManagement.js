import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Building2, Plus, Edit2, Trash2, Users, MapPin, Shield } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-blue-500/40 text-white max-h-[90vh] overflow-hidden flex flex-col">
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
            {dojos.length} dojo{dojos.length > 1 ? 's' : ''} • Super Admin uniquement
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
                  className={`p-4 rounded-xl border transition-all ${
                    dojo.is_default
                      ? 'bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border-amber-500/50'
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-blue-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        dojo.is_default 
                          ? 'bg-gradient-to-br from-amber-500 to-yellow-500' 
                          : 'bg-gradient-to-br from-blue-500 to-indigo-500'
                      }`}>
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
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
                    
                    {!dojo.is_default && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDeleteDojo(dojo.id, dojo.name)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-900/30 rounded transition-all"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
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
