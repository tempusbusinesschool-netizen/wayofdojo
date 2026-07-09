import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import ForgotPasswordDialog from "./ForgotPasswordDialog";

function LoginDialog({ isOpen, onClose }) {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      toast.success("Connexion réussie !");
      onClose();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLoginEmail("");
    setLoginPassword("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
            <LogIn className="w-5 h-5 text-cyan-400" />
            Se connecter
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-center">
            Connectez-vous pour accéder à votre compte
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <div>
            <Label className="text-slate-300">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
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
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500"
          >
            {loading ? "Connexion..." : "Se connecter"}
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
          Pas encore de compte ? Cliquez sur "S'inscrire gratuitement" pour en créer un.
        </p>
        
        {/* Forgot Password Dialog */}
        <ForgotPasswordDialog 
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
          userType="user"
        />
      </DialogContent>
    </Dialog>
  );
}

export default LoginDialog;
