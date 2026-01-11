import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { GraduationCap, Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ForgotPasswordDialog from './ForgotPasswordDialog';

/**
 * EnseignantLoginDialog - Modal de connexion pour les enseignants
 */
const EnseignantLoginDialog = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/enseignants/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Stocker le token et les infos
        localStorage.setItem('enseignant_token', data.token);
        localStorage.setItem('enseignant_info', JSON.stringify(data.enseignant));
        
        toast.success(`Bienvenue ${data.enseignant.first_name} !`);
        onLoginSuccess(data.enseignant, data.token);
        onClose();
      } else {
        toast.error(data.detail || 'Identifiants incorrects');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-amber-400" />
            Espace Enseignant
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sensei@aikido.fr"
                className="pl-10 bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </Button>
          
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="w-full text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            Mot de passe oublié ?
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center mt-4">
          Accès réservé aux enseignants du dojo
        </p>
        
        {/* Forgot Password Dialog */}
        <ForgotPasswordDialog 
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
          userType="enseignant"
        />
      </DialogContent>
    </Dialog>
  );
};

export default EnseignantLoginDialog;
