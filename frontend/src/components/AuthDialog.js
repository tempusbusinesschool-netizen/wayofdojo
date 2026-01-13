import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

function AuthDialog({ isOpen, onClose, onSuccess }) {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Register form
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!registerFirstName || !registerLastName || !registerEmail || !registerPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (registerPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    setLoading(true);
    try {
      await register(registerFirstName, registerLastName, registerEmail, registerPassword);
      toast.success("Compte créé avec succès !");
      onClose();
      resetForms();
      // Déclencher l'animation de transition
      if (onSuccess) {
        onSuccess(registerFirstName);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail;
      if (errorMessage) {
        toast.error(errorMessage);
      } else if (error.message === "Network Error") {
        toast.error("Erreur de connexion au serveur");
      } else {
        toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setRegisterFirstName("");
    setRegisterLastName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            Créer un compte
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-center">
            Inscrivez-vous pour sauvegarder votre progression
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleRegister} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-300">Prénom</Label>
              <Input
                value={registerFirstName}
                onChange={(e) => setRegisterFirstName(e.target.value)}
                placeholder="Prénom"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-300">Nom</Label>
              <Input
                value={registerLastName}
                onChange={(e) => setRegisterLastName(e.target.value)}
                placeholder="Nom"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-slate-300">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="votre@email.com"
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-slate-300">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Min. 6 caractères"
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-slate-300">Confirmer le mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="password"
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </Button>
        </form>
        
        <p className="text-xs text-slate-500 text-center mt-4">
          En créant un compte, vous pourrez sauvegarder votre progression et la retrouver à chaque visite.
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default AuthDialog;
