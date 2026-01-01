import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UserPlus, Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/**
 * Formulaire d'ajout d'adhérent RGPD-compliant
 * 
 * Champs obligatoires :
 * - Identité (prénom/nom OU pseudonyme)
 * - Statut (actif/inactif)
 * - Dojo (automatique)
 * - Date d'inscription (automatique)
 * 
 * Champs optionnels :
 * - Email (pour notifications)
 * - Commentaire interne
 * 
 * Champs INTERDITS :
 * - Date de naissance ❌
 * - Adresse ❌
 * - Téléphone ❌
 */
function DojoMemberForm({ onSuccess, onCancel, dojoId, dojoName }) {
  const [formData, setFormData] = useState({
    display_name: '', // Prénom Nom ou Pseudonyme
    use_pseudonym: false,
    pseudonym: '',
    first_name: '',
    last_name: '',
    status: 'active',
    email: '',
    internal_note: '',
    dojo_id: dojoId || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.use_pseudonym && !formData.pseudonym.trim()) {
      toast.error("Veuillez entrer un pseudonyme");
      return;
    }
    
    if (!formData.use_pseudonym && (!formData.first_name.trim() || !formData.last_name.trim())) {
      toast.error("Veuillez entrer le prénom et le nom");
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        display_name: formData.use_pseudonym 
          ? formData.pseudonym 
          : `${formData.first_name} ${formData.last_name}`,
        dojo_id: dojoId
      };
      
      await axios.post(`${API}/dojo-members`, payload);
      toast.success("Adhérent ajouté avec succès !");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header RGPD */}
      <div className="p-3 rounded-lg bg-orange-900/30 border border-orange-700">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-orange-400" />
          Ajouter un adhérent
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Formulaire simplifié conforme RGPD
        </p>
      </div>

      {/* Dojo automatique */}
      <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
        <Label className="text-slate-400 text-xs uppercase">Dojo (automatique)</Label>
        <p className="text-white font-medium">{dojoName || 'Non défini'}</p>
      </div>

      {/* Identité */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 font-semibold">Identité *</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Utiliser un pseudonyme</span>
            <Switch
              checked={formData.use_pseudonym}
              onCheckedChange={(checked) => handleChange('use_pseudonym', checked)}
            />
          </div>
        </div>
        
        {formData.use_pseudonym ? (
          <div>
            <Label className="text-slate-300">Pseudonyme *</Label>
            <Input
              value={formData.pseudonym}
              onChange={(e) => handleChange('pseudonym', e.target.value)}
              placeholder="Ex: NinjaAikido42"
              className="bg-slate-700 border-slate-600 text-white"
            />
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Option RGPD-friendly recommandée
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Prénom *</Label>
              <Input
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                placeholder="Prénom"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-300">Nom *</Label>
              <Input
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                placeholder="Nom"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Statut */}
      <div>
        <Label className="text-slate-300 font-semibold">Statut *</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => handleChange('status', value)}
        >
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
            <SelectValue placeholder="Sélectionner le statut" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="active" className="text-white hover:bg-slate-700">
              ✅ Actif
            </SelectItem>
            <SelectItem value="inactive" className="text-white hover:bg-slate-700">
              ⏸️ Inactif / Suspendu
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Champs optionnels */}
      <div className="space-y-4 pt-4 border-t border-slate-700">
        <p className="text-sm text-slate-500 font-medium">Champs optionnels</p>
        
        <div>
          <Label className="text-slate-300">Email (optionnel)</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="email@exemple.com"
            className="bg-slate-700 border-slate-600 text-white"
          />
          <p className="text-xs text-slate-500 mt-1">
            Utile uniquement pour les notifications
          </p>
        </div>
        
        <div>
          <Label className="text-slate-300">Commentaire interne (optionnel)</Label>
          <Textarea
            value={formData.internal_note}
            onChange={(e) => handleChange('internal_note', e.target.value)}
            placeholder="Ex: Adhérent débutant, présent 2x/semaine..."
            className="bg-slate-700 border-slate-600 text-white"
            rows={2}
          />
          <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Ne pas utiliser pour évaluer le niveau technique
          </p>
        </div>
      </div>

      {/* Rappel RGPD */}
      <div className="p-3 bg-emerald-900/20 rounded-lg border border-emerald-700/30">
        <p className="text-emerald-400 text-xs flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span>
            <strong>Conformité RGPD :</strong> Nous ne collectons pas la date de naissance, 
            l'adresse postale, ni le numéro de téléphone.
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-orange-600 hover:bg-orange-500"
        >
          {loading ? "Enregistrement..." : "Ajouter l'adhérent"}
        </Button>
      </div>
    </form>
  );
}

export default DojoMemberForm;
