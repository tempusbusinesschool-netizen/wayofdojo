/**
 * 🔐 SESSION TIMEOUT WARNING DIALOG
 * 
 * Affiche un avertissement avant l'expiration de la session admin
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, LogOut, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

function SessionTimeoutWarning({ 
  isOpen, 
  remainingTime, 
  onExtend, 
  onLogout,
  adminType = 'admin'
}) {
  const isUrgent = remainingTime <= 60000; // Less than 1 minute

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-slate-900 border-amber-500/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-amber-400">
            <motion.div
              animate={{ scale: isUrgent ? [1, 1.2, 1] : 1 }}
              transition={{ repeat: isUrgent ? Infinity : 0, duration: 0.5 }}
            >
              <Clock className={`w-6 h-6 ${isUrgent ? 'text-red-400' : 'text-amber-400'}`} />
            </motion.div>
            Session {adminType === 'admin' ? 'Admin' : 'Dojo'} sur le point d&apos;expirer
          </DialogTitle>
          <DialogDescription className="text-slate-300 pt-2">
            Pour des raisons de sécurité, votre session sera automatiquement fermée après une période d&apos;inactivité.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Countdown display */}
          <div className={`text-center p-6 rounded-xl ${isUrgent ? 'bg-red-500/10 border border-red-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}>
            <p className="text-sm text-slate-400 mb-2">Temps restant</p>
            <motion.p 
              className={`text-4xl font-mono font-bold ${isUrgent ? 'text-red-400' : 'text-amber-400'}`}
              animate={{ scale: isUrgent ? [1, 1.05, 1] : 1 }}
              transition={{ repeat: isUrgent ? Infinity : 0, duration: 1 }}
            >
              {remainingTime}
            </motion.p>
          </div>

          {/* Info message */}
          <p className="text-sm text-slate-400 text-center mt-4">
            Cliquez sur &quot;Continuer&quot; pour prolonger votre session de 30 minutes.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onLogout}
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Se déconnecter
          </Button>
          <Button
            onClick={onExtend}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-black"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Continuer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SessionTimeoutWarning;
