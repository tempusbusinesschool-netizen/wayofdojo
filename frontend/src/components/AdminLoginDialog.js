import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { ADMIN_PASSWORD } from "@/constants";

function AdminLoginDialog({ isOpen, onClose, onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('aikido_admin', 'true');
        toast.success("Connexion administrateur réussie");
        onSuccess();
        onClose();
        setPassword('');
      } else {
        setError('Mot de passe incorrect');
        toast.error("Mot de passe incorrect");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            Espace Administrateur
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <p className="text-slate-400 text-sm">
              Veuillez entrer le mot de passe administrateur pour accéder à la gestion des adhérents.
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
              onClick={onClose}
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
      </DialogContent>
    </Dialog>
  );
}

export default AdminLoginDialog;
