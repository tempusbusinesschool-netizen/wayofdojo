import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AIKIDO_CHARACTERS } from '@/constants/aikidoCharacters';
import { ArrowRight, Star, Target, Trophy } from 'lucide-react';

/**
 * WelcomeDialog - Dialog de bienvenue pour les nouveaux utilisateurs
 */
const WelcomeDialog = ({ isOpen, onClose, userName = "Ninja" }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-orange-500/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-black text-white">
            Bienvenue sur Aikido@Game !
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-4">
          {/* Personnage qui salue */}
          <img 
            src={AIKIDO_CHARACTERS.ENFANT_SALUT}
            alt="Bienvenue"
            className="w-40 h-40 mx-auto object-contain mb-4"
          />
          
          <p className="text-slate-300 text-lg mb-4">
            Salut <strong className="text-orange-400">{userName}</strong> ! 🥋
          </p>
          
          <p className="text-slate-400 text-sm mb-6">
            Prêt(e) à commencer ton parcours Aikido ? Voici ce qui t'attend :
          </p>
          
          {/* Features */}
          <div className="space-y-3 text-left mb-6">
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
              <Star className="w-6 h-6 text-amber-400" />
              <div>
                <p className="text-white font-semibold text-sm">Gagne des XP</p>
                <p className="text-slate-400 text-xs">Complete des défis quotidiens</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
              <Target className="w-6 h-6 text-cyan-400" />
              <div>
                <p className="text-white font-semibold text-sm">Progresse</p>
                <p className="text-slate-400 text-xs">Monte de niveau et débloque des badges</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
              <Trophy className="w-6 h-6 text-purple-400" />
              <div>
                <p className="text-white font-semibold text-sm">Deviens un maître</p>
                <p className="text-slate-400 text-xs">Atteins la ceinture noire virtuelle</p>
              </div>
            </div>
          </div>
          
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold py-3"
          >
            C'est parti !
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * WelcomeBanner - Bannière de bienvenue inline
 */
export const WelcomeBanner = ({ userName = "Ninja", onDismiss }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 rounded-2xl p-4 sm:p-6 mb-6 shadow-xl">
      {/* Personnage */}
      <div className="absolute -right-4 -bottom-4 sm:right-4 sm:bottom-0 opacity-30 sm:opacity-100">
        <img 
          src={AIKIDO_CHARACTERS.ENFANT_CELEBRATION}
          alt="Bienvenue"
          className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
        />
      </div>
      
      <div className="relative z-10 pr-16 sm:pr-40">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
          🎉 Bienvenue {userName} !
        </h3>
        <p className="text-white/80 text-sm">
          Votre progression est automatiquement sauvegardée. Complétez des défis pour gagner des XP !
        </p>
        
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="absolute top-2 right-2 text-white/60 hover:text-white text-xl"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default WelcomeDialog;
