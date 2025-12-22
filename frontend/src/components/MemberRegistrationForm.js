import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Baby, User, UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import SignaturePad from "./SignaturePad";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function MemberRegistrationForm({ onSuccess, onCancel, registrationType = 'child' }) {
  const isChildRegistration = registrationType === 'child';
  
  const [formData, setFormData] = useState({
    parent_first_name: '',
    parent_last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    emergency_contact: '',
    is_adult_member: !isChildRegistration,
    children: [],
    reglement_accepted: false,
    signature_data: null
  });
  const [loading, setLoading] = useState(false);
  const [newChild, setNewChild] = useState({ first_name: '', last_name: '', birth_date: '' });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addChild = () => {
    if (newChild.first_name && newChild.last_name) {
      setFormData(prev => ({
        ...prev,
        children: [...prev.children, { ...newChild, id: `child-${Date.now()}`, status: 'pending' }]
      }));
      setNewChild({ first_name: '', last_name: '', birth_date: '' });
    }
  };

  const removeChild = (index) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.reglement_accepted) {
      toast.error("Veuillez accepter le règlement intérieur");
      return;
    }
    
    if (!formData.signature_data) {
      toast.error("Veuillez signer le formulaire");
      return;
    }
    
    if (isChildRegistration && formData.children.length === 0) {
      toast.error("Veuillez ajouter au moins un enfant");
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${API}/members`, formData);
      toast.success("Inscription enregistrée avec succès !");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={`p-3 rounded-lg ${isChildRegistration ? 'bg-purple-900/30 border border-purple-700' : 'bg-cyan-900/30 border border-cyan-700'}`}>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          {isChildRegistration ? (
            <>
              <Baby className="w-5 h-5 text-purple-400" />
              Inscription Enfant
            </>
          ) : (
            <>
              <User className="w-5 h-5 text-cyan-400" />
              Inscription Adulte
            </>
          )}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {isChildRegistration 
            ? "Formulaire d'inscription pour un ou plusieurs enfants"
            : "Formulaire d'inscription pour un adulte pratiquant"
          }
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-400" />
          {isChildRegistration ? "Informations du responsable légal" : "Informations de l'adhérent"}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Prénom *</Label>
            <Input
              value={formData.parent_first_name}
              onChange={(e) => handleChange('parent_first_name', e.target.value)}
              required
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-300">Nom *</Label>
            <Input
              value={formData.parent_last_name}
              onChange={(e) => handleChange('parent_last_name', e.target.value)}
              required
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Email *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-300">Téléphone *</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>
        
        <div>
          <Label className="text-slate-300">Adresse</Label>
          <Input
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Ville</Label>
            <Input
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-300">Code postal</Label>
            <Input
              value={formData.postal_code}
              onChange={(e) => handleChange('postal_code', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>
        
        <div>
          <Label className="text-slate-300">Numéro d&apos;urgence *</Label>
          <Input
            type="tel"
            value={formData.emergency_contact}
            onChange={(e) => handleChange('emergency_contact', e.target.value)}
            placeholder="Numéro à contacter en cas d'urgence"
            required
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>
      
      {isChildRegistration && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Baby className="w-5 h-5 text-purple-400" />
            Enfant(s) à inscrire *
          </h3>
          
          {formData.children.length > 0 && (
            <div className="space-y-2">
              {formData.children.map((child, idx) => (
                <div key={idx} className="flex items-center justify-between bg-purple-900/30 border border-purple-700 p-3 rounded-lg">
                  <span className="text-white flex items-center gap-2">
                    <Baby className="w-4 h-4 text-purple-400" />
                    {child.first_name} {child.last_name}
                    {child.birth_date && ` (né(e) le ${new Date(child.birth_date).toLocaleDateString('fr-FR')})`}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeChild(idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <div className="bg-slate-700/50 p-4 rounded-lg space-y-3">
            <p className="text-sm text-slate-400 mb-2">Ajouter un enfant :</p>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Prénom de l'enfant"
                value={newChild.first_name}
                onChange={(e) => setNewChild(prev => ({ ...prev, first_name: e.target.value }))}
                className="bg-slate-600 border-slate-500 text-white"
              />
              <Input
                placeholder="Nom de l'enfant"
                value={newChild.last_name}
                onChange={(e) => setNewChild(prev => ({ ...prev, last_name: e.target.value }))}
                className="bg-slate-600 border-slate-500 text-white"
              />
            </div>
            <div className="flex gap-3">
              <Input
                type="date"
                placeholder="Date de naissance"
                value={newChild.birth_date}
                onChange={(e) => setNewChild(prev => ({ ...prev, birth_date: e.target.value }))}
                className="bg-slate-600 border-slate-500 text-white flex-1"
              />
              <Button
                type="button"
                onClick={addChild}
                disabled={!newChild.first_name || !newChild.last_name}
                className="bg-purple-600 hover:bg-purple-500"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-4 border-t border-slate-700 pt-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="accept_reglement"
            checked={formData.reglement_accepted}
            onCheckedChange={(checked) => handleChange('reglement_accepted', checked)}
          />
          <Label htmlFor="accept_reglement" className="text-slate-300 cursor-pointer">
            J&apos;ai lu et j&apos;accepte le règlement intérieur du club *
          </Label>
        </div>
        
        <SignaturePad
          label="Signature de l'adhérent ou du représentant légal *"
          onSignatureChange={(sig) => handleChange('signature_data', sig)}
        />
      </div>
      
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
          className="flex-1 bg-emerald-600 hover:bg-emerald-500"
        >
          {loading ? "Enregistrement..." : "Valider l'inscription"}
        </Button>
      </div>
    </form>
  );
}

export default MemberRegistrationForm;
