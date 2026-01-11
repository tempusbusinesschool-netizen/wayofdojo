import React, { useState } from 'react';
import { 
  Heart, Mail, Lock, Eye, EyeOff, User, Phone,
  ChevronRight, AlertCircle, CheckCircle, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const ParentLoginDialog = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState('login'); // login or register
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }
    
    if (mode === 'register') {
      if (!formData.first_name) newErrors.first_name = 'Prénom requis';
      if (!formData.last_name) newErrors.last_name = 'Nom requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const endpoint = mode === 'login' ? '/parents/login' : '/parents/register';
      const body = mode === 'login' 
        ? { email: formData.email, password: formData.password }
        : formData;
      
      const response = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Une erreur est survenue');
      }
      
      // Store token
      localStorage.setItem('parent_token', data.token);
      localStorage.setItem('parent_info', JSON.stringify(data.parent));
      
      toast.success(mode === 'login' 
        ? `Bienvenue ${data.parent.first_name} !` 
        : 'Compte créé avec succès !'
      );
      
      if (onSuccess) onSuccess(data);
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone: ''
    });
    setErrors({});
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                {mode === 'login' ? 'Connexion Parent' : 'Inscription Parent'}
              </DialogTitle>
              <p className="text-sm text-slate-400">
                {mode === 'login' 
                  ? 'Accédez à l\'espace de suivi de vos enfants'
                  : 'Créez votre compte pour suivre vos enfants'
                }
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-400">Prénom *</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    className={`pl-10 bg-slate-700 border-slate-600 text-white ${errors.first_name ? 'border-red-500' : ''}`}
                    placeholder="Jean"
                  />
                </div>
                {errors.first_name && (
                  <p className="text-red-400 text-xs mt-1">{errors.first_name}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm text-slate-400">Nom *</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    className={`pl-10 bg-slate-700 border-slate-600 text-white ${errors.last_name ? 'border-red-500' : ''}`}
                    placeholder="Dupont"
                  />
                </div>
                {errors.last_name && (
                  <p className="text-red-400 text-xs mt-1">{errors.last_name}</p>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-slate-400">Email *</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`pl-10 bg-slate-700 border-slate-600 text-white ${errors.email ? 'border-red-500' : ''}`}
                placeholder="parent@email.fr"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-slate-400">Mot de passe *</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={`pl-10 pr-10 bg-slate-700 border-slate-600 text-white ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-sm text-slate-400">Téléphone (optionnel)</label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 py-5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {mode === 'login' ? 'Connexion...' : 'Inscription...'}
              </>
            ) : (
              <>
                {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <div className="text-center pt-4 border-t border-slate-700">
            <p className="text-slate-400 text-sm">
              {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
              <button
                type="button"
                onClick={switchMode}
                className="ml-2 text-purple-400 hover:text-purple-300 font-medium"
              >
                {mode === 'login' ? 'S\'inscrire' : 'Se connecter'}
              </button>
            </p>
          </div>
        </form>

        <div className="mt-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <p className="text-sm text-purple-300">
            <strong>💡 Comment ça marche ?</strong>
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Après inscription, contactez l'enseignant du dojo de votre enfant pour lier son compte 
            au vôtre. Vous pourrez ensuite suivre ses observations et messages.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParentLoginDialog;
