import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

/**
 * ForgotPasswordDialog - Dialog for password reset flow
 */
const ForgotPasswordDialog = ({ isOpen, onClose, userType = 'user' }) => {
  const [step, setStep] = useState('email'); // email, sent, reset, success
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userTypeLabels = {
    user: 'Adhérent',
    parent: 'Parent',
    enseignant: 'Enseignant'
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, user_type: userType })
      });

      const data = await response.json();
      
      if (response.ok) {
        setStep('sent');
        toast.success('Email envoyé !');
      } else {
        setError(data.detail || 'Erreur lors de l\'envoi');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword })
      });

      const data = await response.json();
      
      if (response.ok) {
        setStep('success');
        toast.success('Mot de passe réinitialisé !');
      } else {
        setError(data.detail || 'Erreur lors de la réinitialisation');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setToken('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-500" />
            Mot de passe oublié
          </DialogTitle>
        </DialogHeader>

        {/* Step: Email Input */}
        {step === 'email' && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <p className="text-slate-400 text-sm">
              Entrez l'adresse email de votre compte <strong className="text-amber-400">{userTypeLabels[userType]}</strong> pour recevoir un lien de réinitialisation.
            </p>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading || !email}
                className="flex-1 bg-amber-600 hover:bg-amber-500"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi...</>
                ) : (
                  'Envoyer le lien'
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Step: Email Sent */}
        {step === 'sent' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold">Email envoyé !</h3>
            <p className="text-slate-400 text-sm">
              Si un compte existe avec l'adresse <strong className="text-amber-400">{email}</strong>, vous recevrez un email avec les instructions de réinitialisation.
            </p>
            <p className="text-slate-500 text-xs">
              Vérifiez aussi vos spams si vous ne le trouvez pas.
            </p>
            
            <div className="pt-4 space-y-3">
              <p className="text-slate-400 text-sm">Vous avez reçu le code ? Entrez-le ci-dessous :</p>
              <Input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Collez votre token ici"
                className="bg-slate-800 border-slate-700 text-white text-center"
              />
              <Button
                onClick={() => token && setStep('reset')}
                disabled={!token}
                className="w-full bg-amber-600 hover:bg-amber-500"
              >
                Continuer
              </Button>
            </div>
            
            <Button
              variant="ghost"
              onClick={handleClose}
              className="text-slate-400"
            >
              Fermer
            </Button>
          </div>
        )}

        {/* Step: Reset Password */}
        {step === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-slate-400 text-sm">
              Entrez votre nouveau mot de passe.
            </p>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Nouveau mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="pl-10 pr-10 bg-slate-800 border-slate-700 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep('sent')}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="flex-1 bg-amber-600 hover:bg-amber-500"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Réinitialisation...</>
                ) : (
                  'Réinitialiser'
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-green-400">Mot de passe réinitialisé !</h3>
            <p className="text-slate-400 text-sm">
              Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
            </p>
            <Button
              onClick={handleClose}
              className="w-full bg-green-600 hover:bg-green-500"
            >
              Fermer et se connecter
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
