import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, KeyRound, Building2, Shield, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { SUPER_ADMIN_PASSWORD, ADMIN_DOJO_PASSWORD } from "@/constants";

function AdminLoginDialog({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState('choice'); // 'choice', 'admin', 'espace_dojo'
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setStep('choice');
    setPassword('');
    setError('');
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      if (step === 'admin' && password === SUPER_ADMIN_PASSWORD) {
        sessionStorage.setItem('aikido_admin', 'admin');
        toast.success("🛡️ Connexion Admin réussie");
        onSuccess('admin');
        handleClose();
      } else if (step === 'espace_dojo' && password === ADMIN_DOJO_PASSWORD) {
        sessionStorage.setItem('aikido_admin', 'espace_dojo');
        toast.success("🏯 Connexion Espace Dojo réussie");
        onSuccess('espace_dojo');
        handleClose();
      } else {
        setError('Mot de passe incorrect');
        toast.error("Mot de passe incorrect");
      }
      setLoading(false);
    }, 500);
  };

  const renderChoice = () => (
    <div className="space-y-4">
      <div className="text-center py-2">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <p className="text-slate-400 text-sm">
          Sélectionnez votre espace de gestion
        </p>
      </div>
      
      {/* Admin Option (Plateforme) */}
      <button
        onClick={() => setStep('admin')}
        className="w-full p-4 rounded-lg border-2 border-slate-700 hover:border-cyan-500 bg-slate-800/50 hover:bg-slate-800 transition-all group text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">
              🛡️ Admin
            </h3>
            <p className="text-sm text-slate-400">
              Gestion plateforme & dojos
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Cadre • Contrôle • Conformité
            </p>
          </div>
        </div>
      </button>
      
      {/* Espace Dojo Option */}
      <button
        onClick={() => setStep('espace_dojo')}
        className="w-full p-4 rounded-lg border-2 border-slate-700 hover:border-orange-500 bg-slate-800/50 hover:bg-slate-800 transition-all group text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors">
              🏯 Espace Dojo
            </h3>
            <p className="text-sm text-slate-400">
              Gestion du club & adhérents
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Gestion humaine • Locale
            </p>
          </div>
        </div>
      </button>
      
      <Button
        variant="ghost"
        onClick={handleClose}
        className="w-full text-slate-400 hover:text-white"
      >
        Annuler
      </Button>
    </div>
  );

  const renderPasswordForm = () => {
    const isAdmin = step === 'admin';
    const title = isAdmin ? "Admin" : "Espace Dojo";
    const subtitle = isAdmin 
      ? "Gestion plateforme, dojos & conformité" 
      : "Gestion du club et des adhérents";
    const gradientFrom = isAdmin ? "from-cyan-500" : "from-orange-500";
    const gradientTo = isAdmin ? "to-blue-600" : "to-red-600";
    const buttonBg = isAdmin ? "bg-cyan-600 hover:bg-cyan-500" : "bg-orange-600 hover:bg-orange-500";
    const icon = isAdmin ? <Shield className="w-8 h-8 text-white" /> : <Building2 className="w-8 h-8 text-white" />;
    const emoji = isAdmin ? "🛡️" : "🏯";

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <button
          type="button"
          onClick={() => { setStep('choice'); setPassword(''); setError(''); }}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
        
        <div className="text-center py-2">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center`}>
            {icon}
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            {emoji} {title}
          </h3>
          <p className="text-slate-400 text-sm">
            {subtitle}
          </p>
        </div>
        
        <div>
          <Label className="text-slate-300">Mot de passe</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez le mot de passe"
            className="bg-slate-700 border-slate-600 text-white"
            autoFocus
          />
          {error && (
            <p className="text-red-400 text-sm mt-1">{error}</p>
          )}
        </div>
        
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={loading || !password}
            className={`flex-1 ${buttonBg}`}
          >
            {loading ? "Vérification..." : "Se connecter"}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            Espace de Gestion
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Accédez à votre espace dédié
          </DialogDescription>
        </DialogHeader>
        
        {step === 'choice' ? renderChoice() : renderPasswordForm()}
      </DialogContent>
    </Dialog>
  );
}

export default AdminLoginDialog;
