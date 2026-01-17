import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Award, Heart, Sparkles, GraduationCap } from 'lucide-react';
import VirtuesSection from './VirtuesSection';
import { AIKIDO_BELTS } from '@/constants/aikidoBelts';

/**
 * ProgressionDialog - Étape 5 "Progresse"
 * 
 * Contient deux onglets :
 * 1. Ma Ceinture - Sélection et progression de grade
 * 2. Mes Qualités - Les 7 vertus du Budō
 */
const ProgressionDialog = ({
  isOpen,
  onClose,
  // Props pour la ceinture
  currentBelt = 'white',
  onBeltChange,
  // Props pour les vertus
  statistics = {},
  virtueData = [],
  userId = null,
  isAuthenticated = false,
  onRefreshData = null
}) => {
  // Onglet actif : 'ceinture' ou 'qualites'
  const [activeTab, setActiveTab] = useState('ceinture');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-violet-500/30 text-white max-h-[90vh] overflow-hidden p-0">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
              <Star className="w-6 h-6 text-amber-300" />
              Progresse - Étape 5
            </DialogTitle>
            <DialogDescription className="text-violet-200">
              Suis ta progression et développe tes qualités de ninja !
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Onglets de navigation */}
        <div className="flex border-b border-slate-700 bg-slate-800/30">
          <button
            onClick={() => setActiveTab('ceinture')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'ceinture'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
            }`}
            data-testid="tab-ceinture"
          >
            <GraduationCap className="w-4 h-4" />
            Ma Ceinture
          </button>
          <button
            onClick={() => setActiveTab('qualites')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'qualites'
                ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
            }`}
            data-testid="tab-qualites"
          >
            <Heart className="w-4 h-4" />
            Mes Qualités
          </button>
        </div>

        {/* Contenu selon l'onglet actif */}
        <div className="overflow-y-auto max-h-[60vh] p-4">
          <AnimatePresence mode="wait">
            {activeTab === 'ceinture' ? (
              /* ═══════════════════════════════════════════════════════════════════════════════════ */
              /* ONGLET MA CEINTURE */
              /* ═══════════════════════════════════════════════════════════════════════════════════ */
              <motion.div
                key="ceinture"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-amber-400 flex items-center justify-center gap-2">
                    🥋 Choisis ta Ceinture
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Clique sur ta ceinture actuelle pour enregistrer ton grade
                  </p>
                </div>

                <div className="space-y-3">
                  {Object.entries(AIKIDO_BELTS).map(([key, belt]) => {
                    const isCurrentBelt = currentBelt === key;
                    const isPassed = belt.order < (AIKIDO_BELTS[currentBelt]?.order || 0);
                    const beltPoints = (belt.order + 1) * 10;
                    
                    return (
                      <div 
                        key={key}
                        onClick={() => onBeltChange?.(key)}
                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer hover:scale-[1.02] hover:shadow-lg ${
                          isCurrentBelt 
                            ? 'border-amber-500 bg-amber-900/30 ring-2 ring-amber-500/50' 
                            : isPassed 
                              ? 'border-emerald-500/50 bg-emerald-900/20 hover:border-emerald-400' 
                              : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{belt.emoji}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-white">{belt.name}</p>
                              {isCurrentBelt && (
                                <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                                  ✓ Actuelle
                                </span>
                              )}
                              {isPassed && !isCurrentBelt && (
                                <span className="text-xs text-emerald-400">✓ Passée</span>
                              )}
                            </div>
                            <p className="text-slate-400 text-xs">{belt.grade}</p>
                            {belt.symbolicRole && (
                              <p className="text-purple-300 text-xs mt-1">
                                🎭 Rôle disponible : {belt.symbolicRole.name}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded-lg text-xs font-bold">
                              +{beltPoints} pts
                            </div>
                            {!isCurrentBelt && (
                              <span className="text-slate-500 text-[10px]">Sélectionner →</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mt-4">
                  <p className="text-sm text-slate-300 text-center">
                    🎌 <strong>Rappel :</strong> Indique ta ceinture actuelle obtenue au dojo.
                    <br />Ta progression sera sauvegardée automatiquement.
                  </p>
                </div>
              </motion.div>
            ) : (
              /* ═══════════════════════════════════════════════════════════════════════════════════ */
              /* ONGLET MES QUALITÉS - Les 7 vertus du Budō */
              /* ═══════════════════════════════════════════════════════════════════════════════════ */
              <motion.div
                key="qualites"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-purple-400 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Les Super-Pouvoirs Ninja
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Développe les 7 vertus du Budō et gagne des points !
                  </p>
                </div>

                <VirtuesSection
                  statistics={statistics}
                  virtueData={virtueData}
                  userId={userId}
                  isAuthenticated={isAuthenticated}
                  onRefreshStats={onRefreshData}
                  compact={true}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressionDialog;
