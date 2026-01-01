import React, { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Building2, User, Mail, Lock, MapPin, Phone } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

function DojoRegistrationDialog({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Dojo info, 2: Admin info
  const [formData, setFormData] = useState({
    // Dojo info
    dojo_name: "",
    dojo_address: "",
    dojo_city: "",
    dojo_phone: "",
    dojo_description: "",
    // Admin info
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: ""
  });
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async () => {
    // Validation
    if (step === 1) {
      if (!formData.dojo_name || !formData.dojo_city) {
        toast.error("Nom du dojo et ville requis");
        return;
      }
      setStep(2);
      return;
    }
    
    // Step 2 validation
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
      toast.error("Tous les champs sont requis");
      return;
    }
    
    if (formData.password !== formData.confirm_password) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API}/auth/register-dojo`, {
        dojo_name: formData.dojo_name,
        dojo_address: formData.dojo_address,
        dojo_city: formData.dojo_city,
        dojo_phone: formData.dojo_phone,
        dojo_description: formData.dojo_description,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password
      });
      
      toast.success("🏯 Dojo créé avec succès ! Connectez-vous pour continuer.");
      onSuccess(response.data);
      onClose();
    } catch (error) {
      console.error("Dojo registration error:", error);
      toast.error(error.response?.data?.detail || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-500/40 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Inscription Dojo / Club
            </span>
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {step === 1 ? "Étape 1/2 : Informations du dojo" : "Étape 2/2 : Compte administrateur"}
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress bar */}
        <div className="flex gap-2 mb-4">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-cyan-500' : 'bg-slate-700'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-cyan-500' : 'bg-slate-700'}`} />
        </div>
        
        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Nom du dojo / club *</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  name="dojo_name"
                  value={formData.dojo_name}
                  onChange={handleChange}
                  placeholder="Aikido Paris Centre"
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Ville *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    name="dojo_city"
                    value={formData.dojo_city}
                    onChange={handleChange}
                    placeholder="Paris"
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    name="dojo_phone"
                    value={formData.dojo_phone}
                    onChange={handleChange}
                    placeholder="01 23 45 67 89"
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Adresse</label>
              <Input
                name="dojo_address"
                value={formData.dojo_address}
                onChange={handleChange}
                placeholder="123 rue de l'Aïkido"
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
            
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Description</label>
              <Textarea
                name="dojo_description"
                value={formData.dojo_description}
                onChange={handleChange}
                placeholder="Présentez votre dojo en quelques mots..."
                className="bg-slate-800/50 border-slate-600 text-white min-h-[80px]"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Prénom *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Jean"
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Nom *</label>
                <Input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Dupont"
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@dojo.fr"
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Mot de passe *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Confirmer le mot de passe *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  name="confirm_password"
                  type="password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-3 mt-6">
          {step === 2 && (
            <Button
              variant="ghost"
              onClick={() => setStep(1)}
              className="text-slate-400 hover:text-white"
            >
              ← Retour
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Création...
              </span>
            ) : step === 1 ? (
              "Continuer →"
            ) : (
              "🏯 Créer mon espace Dojo"
            )}
          </Button>
        </div>
        
        {/* Info */}
        <p className="text-center text-xs text-slate-500 mt-4">
          En créant votre espace Dojo, vous bénéficiez de 10 jours d'essai gratuit.
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default DojoRegistrationDialog;
