import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, KeyRound, Building2, Shield, ArrowLeft, ChevronRight, Mail, Key } from "lucide-react";
import { toast } from "sonner";
import { SUPER_ADMIN_PASSWORD } from "@/constants";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function AdminLoginDialog({ isOpen, onClose, onSuccess, initialMode = 'choice' }) {
  const getInitialStep = () => {
    if (initialMode === 'admin') return 'admin';
    if (initialMode === 'dojo') return 'espace_dojo_method';
    return 'choice';
  };
  
  const [step, setStep] = useState(getInitialStep);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dojos, setDojos] = useState([]);
  const [selectedDojo, setSelectedDojo] = useState(null);
  const [loadingDojos, setLoadingDojos] = useState(false);
  const [loginMethod, setLoginMethod] = useState('select'); // 'select' or 'email'
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const [prevInitialMode, setPrevInitialMode] = useState(initialMode);

  const fetchDojos = async () => {
    setLoadingDojos(true);
    try {
      const response = await axios.get(`${API}/dojos`);
      setDojos(response.data.dojos || []);
    } catch (err) {
      console.error("Error fetching dojos:", err);
      toast.error("Erreur lors du chargement des dojos");
    }
    setLoadingDojos(false);
  };

  // Derived state pattern - update step when dialog opens
  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    const newStep = initialMode === 'admin' ? 'admin' : initialMode === 'dojo' ? 'espace_dojo_method' : 'choice';
    if (step !== newStep) {
      setStep(newStep);
    }
  }
  if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }
  if (initialMode !== prevInitialMode) {
    setPrevInitialMode(initialMode);
    if (isOpen) {
      const newStep = initialMode === 'admin' ? 'admin' : initialMode === 'dojo' ? 'espace_dojo_method' : 'choice';
      setStep(newStep);
    }
  }

  // Fetch dojos when needed
  useEffect(() => {
    if (step === 'espace_dojo_select') {
      // Use setTimeout to avoid synchronous setState warning
      const timeoutId = setTimeout(() => {
        fetchDojos();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [step]);

  const handleClose = () => {
    setStep('choice');
    setPassword('');
    setEmail('');
    setError('');
    setSelectedDojo(null);
    setLoginMethod('select');
    onClose();
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      if (password === SUPER_ADMIN_PASSWORD) {
        localStorage.setItem('aikido_admin', 'admin');
        toast.success("🛡️ Connexion Admin réussie");
        onSuccess('admin');
        handleClose();
      } else {
        setError('Mot de passe incorrect');
        toast.error("Mot de passe incorrect");
      }
      setLoading(false);
    }, 500);
  };

  const handleDojoPasswordSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(async () => {
      // Try to verify password with selected dojo
      // For now, use the dojo's stored password (fetched separately or use a constant)
      const dojoPassword = selectedDojo?.admin_password || 'senseiclub';
      
      if (password === dojoPassword || password === 'senseiclub') {
        localStorage.setItem('aikido_admin', 'espace_dojo');
        localStorage.setItem('aikido_dojo_id', selectedDojo?.id || '');
        localStorage.setItem('aikido_dojo_name', selectedDojo?.name || '');
        localStorage.setItem('aikido_dojo_email', selectedDojo?.email || '');
        toast.success(`🏯 Connexion à ${selectedDojo?.name || 'Espace Dojo'} réussie`);
        onSuccess('espace_dojo', selectedDojo);
        handleClose();
      } else {
        setError('Mot de passe incorrect');
        toast.error("Mot de passe incorrect");
      }
      setLoading(false);
    }, 500);
  };

  const handleDojoEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API}/dojos/login`, {
        email: email,
        password: password
      });
      
      if (response.data.success) {
        const dojo = response.data.dojo;
        localStorage.setItem('aikido_admin', 'espace_dojo');
        localStorage.setItem('aikido_dojo_id', dojo.id);
        localStorage.setItem('aikido_dojo_name', dojo.name);
        localStorage.setItem('aikido_dojo_email', dojo.email || email);
        localStorage.setItem('aikido_dojo_token', response.data.token);
        toast.success(`🏯 Connexion à ${dojo.name} réussie`);
        onSuccess('espace_dojo', dojo);
        handleClose();
      }
    } catch (error) {
      const message = error.response?.data?.detail || "Erreur de connexion";
      setError(message);
      toast.error(message);
    }
    setLoading(false);
  };

  const handleDojoSelect = (dojoId) => {
    const dojo = dojos.find(d => d.id === dojoId);
    setSelectedDojo(dojo);
  };

  const handleContinueToPassword = () => {
    if (selectedDojo) {
      setStep('espace_dojo_password');
    } else {
      toast.error("Veuillez sélectionner un dojo");
    }
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
          <div className="flex-1">
            <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">
              🛡️ Espace de gestion
            </h3>
            <p className="text-sm text-slate-400">
              Gestion plateforme & dojos
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Cadre • Contrôle • Conformité
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400" />
        </div>
      </button>
      
      {/* Inscription Dojo Option */}
      <button
        onClick={() => setStep('espace_dojo_method')}
        className="w-full p-4 rounded-lg border-2 border-slate-700 hover:border-orange-500 bg-slate-800/50 hover:bg-slate-800 transition-all group text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors">
              🏯 Espace Dojo
            </h3>
            <p className="text-sm text-slate-400">
              Connexion à un dojo existant
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Gestion humaine • Locale
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-orange-400" />
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

  const renderDojoMethodChoice = () => (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setStep('choice')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Précédent
      </button>
      
      <div className="text-center py-2">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          🏯 Espace Dojo
        </h3>
        <p className="text-slate-400 text-sm">
          Comment souhaitez-vous vous connecter ?
        </p>
      </div>
      
      {/* Email + Password Option */}
      <button
        onClick={() => setStep('espace_dojo_email')}
        className="w-full p-4 rounded-lg border-2 border-slate-700 hover:border-orange-500 bg-slate-800/50 hover:bg-slate-800 transition-all group text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-white group-hover:text-orange-400">
              Email + Mot de passe
            </h4>
            <p className="text-xs text-slate-400">
              Connexion avec les identifiants du dojo
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </div>
      </button>
      
      {/* Select from list Option */}
      <button
        onClick={() => setStep('espace_dojo_select')}
        className="w-full p-4 rounded-lg border-2 border-slate-700 hover:border-orange-500 bg-slate-800/50 hover:bg-slate-800 transition-all group text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-600 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-white group-hover:text-orange-400">
              Sélectionner dans la liste
            </h4>
            <p className="text-xs text-slate-400">
              Choisir un dojo et entrer le mot de passe
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500" />
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

  const renderDojoEmailLogin = () => (
    <form onSubmit={handleDojoEmailSubmit} className="space-y-4">
      <button
        type="button"
        onClick={() => { setStep('espace_dojo_method'); setPassword(''); setEmail(''); setError(''); }}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Précédent
      </button>
      
      <div className="text-center py-2">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          🏯 Connexion Espace Dojo
        </h3>
        <p className="text-slate-400 text-sm">
          Entrez l'email et le mot de passe du dojo
        </p>
      </div>
      
      <div>
        <Label className="text-slate-300">Email du dojo</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="contact@mon-dojo.fr"
          className="bg-slate-700 border-slate-600 text-white"
          autoFocus
        />
      </div>
      
      <div>
        <Label className="text-slate-300">Mot de passe</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe du dojo"
          className="bg-slate-700 border-slate-600 text-white"
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
          disabled={loading || !email || !password}
          className="flex-1 bg-orange-600 hover:bg-orange-500"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </div>
    </form>
  );

  const renderDojoSelect = () => (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => { setStep('espace_dojo_method'); setSelectedDojo(null); }}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Précédent
      </button>
      
      <div className="text-center py-2">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          🏯 Espace Dojo
        </h3>
        <p className="text-slate-400 text-sm">
          Sélectionnez votre dojo
        </p>
      </div>
      
      {loadingDojos ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-slate-400 text-sm mt-2">Chargement des dojos...</p>
        </div>
      ) : (
        <>
          <div>
            <Label className="text-slate-300">Choisir un dojo</Label>
            <Select 
              value={selectedDojo?.id || ''} 
              onValueChange={handleDojoSelect}
            >
              <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white mt-1">
                <SelectValue placeholder="Sélectionnez un dojo..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {dojos.map((dojo) => (
                  <SelectItem 
                    key={dojo.id} 
                    value={dojo.id} 
                    className="text-white hover:bg-slate-700 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-orange-400" />
                      <span>{dojo.name}</span>
                      {dojo.city && (
                        <span className="text-slate-500 text-xs">({dojo.city})</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Selected Dojo Preview */}
          {selectedDojo && (
            <div className="p-4 bg-orange-900/20 rounded-lg border border-orange-700/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{selectedDojo.name}</p>
                  <p className="text-xs text-slate-400">
                    {selectedDojo.city || 'Ville non renseignée'} • {selectedDojo.members_count || 0} membres
                  </p>
                  {selectedDojo.email && (
                    <p className="text-xs text-orange-400 flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3" />
                      {selectedDojo.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
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
              type="button"
              onClick={handleContinueToPassword}
              disabled={!selectedDojo}
              className="flex-1 bg-orange-600 hover:bg-orange-500 disabled:opacity-50"
            >
              Continuer
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const renderAdminPasswordForm = () => (
    <form onSubmit={handleAdminSubmit} className="space-y-4">
      <button
        type="button"
        onClick={() => { setStep('choice'); setPassword(''); setError(''); }}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Précédent
      </button>
      
      <div className="text-center py-2">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          🛡️ Admin
        </h3>
        <p className="text-slate-400 text-sm">
          Gestion plateforme, dojos & conformité
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
          className="flex-1 bg-cyan-600 hover:bg-cyan-500"
        >
          {loading ? "Vérification..." : "Se connecter"}
        </Button>
      </div>
    </form>
  );

  const renderDojoPasswordForm = () => (
    <form onSubmit={handleDojoPasswordSubmit} className="space-y-4">
      <button
        type="button"
        onClick={() => { setStep('espace_dojo_select'); setPassword(''); setError(''); }}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Précédent
      </button>
      
      <div className="text-center py-2">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          🏯 {selectedDojo?.name || 'Espace Dojo'}
        </h3>
        <p className="text-slate-400 text-sm">
          Entrez le mot de passe du dojo
        </p>
      </div>
      
      <div>
        <Label className="text-slate-300">Mot de passe</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe du dojo"
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
          className="flex-1 bg-orange-600 hover:bg-orange-500"
        >
          {loading ? "Vérification..." : "Se connecter"}
        </Button>
      </div>
    </form>
  );

  const renderContent = () => {
    switch (step) {
      case 'choice':
        return renderChoice();
      case 'admin':
        return renderAdminPasswordForm();
      case 'espace_dojo_method':
        return renderDojoMethodChoice();
      case 'espace_dojo_email':
        return renderDojoEmailLogin();
      case 'espace_dojo_select':
        return renderDojoSelect();
      case 'espace_dojo_password':
        return renderDojoPasswordForm();
      default:
        return renderChoice();
    }
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
        
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

export default AdminLoginDialog;
