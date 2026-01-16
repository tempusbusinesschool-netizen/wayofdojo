import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Check, Lock, Star, BookOpen, Trophy, X } from 'lucide-react';
import { TECHNIQUES_BY_KYU, KYU_ORDER, getTechniqueCountByKyu } from '@/constants/techniquesByKyu';

// Image de Maître Tanaka
const TANAKA_IMAGE = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face";

/**
 * TechniquesByKyuCards - Fiches des techniques par niveau de ceinture
 * 
 * Affiche les techniques organisées par Kyu sous forme de fiches interactives.
 * Les techniques doivent être maîtrisées une par une pour progresser.
 */
const TechniquesByKyuCards = ({ 
  isOpen, 
  onClose,
  userName = '',
  userKyu = '6e_kyu', // Kyu actuel de l'utilisateur
  masteredTechniques = [] // Liste des IDs de techniques maîtrisées
}) => {
  const [selectedKyu, setSelectedKyu] = useState(userKyu);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [localMastered, setLocalMastered] = useState(masteredTechniques);

  // Charger les techniques maîtrisées depuis le localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aikido_mastered_techniques');
    if (saved) {
      setLocalMastered(JSON.parse(saved));
    }
  }, []);

  // Sauvegarder quand on maîtrise une technique
  const handleMasterTechnique = (techId) => {
    if (!localMastered.includes(techId)) {
      const newMastered = [...localMastered, techId];
      setLocalMastered(newMastered);
      localStorage.setItem('aikido_mastered_techniques', JSON.stringify(newMastered));
    }
    setSelectedTechnique(null);
  };

  // Calculer la progression pour un Kyu
  const getKyuProgress = (kyuId) => {
    const kyu = TECHNIQUES_BY_KYU[kyuId];
    if (!kyu) return { mastered: 0, total: 0, percent: 0 };
    
    let total = 0;
    let mastered = 0;
    
    kyu.categories.forEach(cat => {
      cat.techniques.forEach(tech => {
        total++;
        if (localMastered.includes(tech.id)) mastered++;
      });
    });
    
    return {
      mastered,
      total,
      percent: total > 0 ? Math.round((mastered / total) * 100) : 0
    };
  };

  // Vérifier si un Kyu est débloqué (le précédent doit être à 100%)
  const isKyuUnlocked = (kyuId) => {
    const index = KYU_ORDER.indexOf(kyuId);
    if (index === 0) return true; // 6e Kyu toujours débloqué
    
    const previousKyu = KYU_ORDER[index - 1];
    const progress = getKyuProgress(previousKyu);
    return progress.percent >= 80; // Débloquer si 80% du Kyu précédent est maîtrisé
  };

  const currentKyuData = TECHNIQUES_BY_KYU[selectedKyu];

  // Messages de Tanaka selon le contexte
  const getTanakaMessage = () => {
    const progress = getKyuProgress(selectedKyu);
    if (progress.percent === 0) {
      return `${userName || 'Jeune ninja'}, voici les techniques du ${currentKyuData?.name}. Commence par les bases et progresse à ton rythme ! 🥋`;
    } else if (progress.percent < 50) {
      return `Tu as déjà maîtrisé ${progress.mastered} techniques ! Continue comme ça, tu progresses bien ! 💪`;
    } else if (progress.percent < 100) {
      return `Excellent ${userName || 'ninja'} ! Plus que ${progress.total - progress.mastered} techniques et tu maîtrises ce niveau ! 🌟`;
    } else {
      return `Bravo ! Tu as maîtrisé toutes les techniques du ${currentKyuData?.name} ! Prêt pour le niveau suivant ? 🏆`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-500/30 p-0 overflow-hidden">
        
        {/* Header avec Tanaka */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-3 border-b border-cyan-500/30">
          <div className="flex items-start gap-3">
            <motion.div 
              className="flex-shrink-0"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400 shadow-lg">
                <img 
                  src={TANAKA_IMAGE} 
                  alt="Maître Tanaka"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2306B6D4" width="100" height="100"/><text x="50" y="60" text-anchor="middle" font-size="40">🥋</text></svg>';
                  }}
                />
              </div>
            </motion.div>
            
            <div className="flex-1">
              <motion.div 
                key={selectedKyu}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-2"
              >
                <p className="text-white/90 text-sm">{getTanakaMessage()}</p>
                <p className="text-cyan-400 text-[10px] mt-1 font-semibold">— Maître Tanaka</p>
              </motion.div>
            </div>

            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Titre */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Programme Technique par Kyu
            </h2>
            <div className="text-cyan-200 text-sm">
              {localMastered.length} techniques maîtrisées
            </div>
          </div>
        </div>

        {/* Navigation des Kyu (fiches) */}
        <div className="p-3 bg-slate-800/50 border-b border-slate-700">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {KYU_ORDER.map((kyuId) => {
              const kyu = TECHNIQUES_BY_KYU[kyuId];
              const progress = getKyuProgress(kyuId);
              const unlocked = isKyuUnlocked(kyuId);
              const isSelected = selectedKyu === kyuId;
              
              return (
                <button
                  key={kyuId}
                  onClick={() => unlocked && setSelectedKyu(kyuId)}
                  disabled={!unlocked}
                  className={`
                    relative flex-shrink-0 p-2 rounded-xl transition-all min-w-[100px]
                    ${isSelected 
                      ? `bg-gradient-to-br ${kyu.gradient} shadow-lg scale-105` 
                      : unlocked 
                        ? 'bg-slate-700 hover:bg-slate-600' 
                        : 'bg-slate-800 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  {!unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                      <Lock className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                  
                  <div className="text-center">
                    <span className="text-2xl">{kyu.emoji}</span>
                    <p className={`text-xs font-bold mt-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {kyu.name}
                    </p>
                    
                    {/* Barre de progression */}
                    <div className="mt-1 h-1 bg-black/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white/80 rounded-full transition-all"
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                    <p className={`text-[9px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                      {progress.mastered}/{progress.total}
                    </p>
                  </div>

                  {progress.percent === 100 && (
                    <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5">
                      <Trophy className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu du Kyu sélectionné */}
        <div className="p-4 overflow-y-auto max-h-[400px]">
          {currentKyuData && (
            <motion.div
              key={selectedKyu}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Info du Kyu */}
              <div className={`p-3 rounded-xl bg-gradient-to-r ${currentKyuData.gradient} text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{currentKyuData.belt}</h3>
                    <p className="text-white/80 text-sm">{currentKyuData.description}</p>
                  </div>
                  <span className="text-4xl">{currentKyuData.emoji}</span>
                </div>
              </div>

              {/* Catégories et techniques */}
              {currentKyuData.categories.map((category, catIdx) => (
                <div key={catIdx} className="bg-slate-800/50 rounded-xl p-3">
                  <h4 className="text-white font-bold text-sm flex items-center gap-2 mb-3">
                    <span className="text-lg">{category.icon}</span>
                    {category.name}
                    <span className="text-slate-500 text-xs ml-auto">
                      {category.techniques.filter(t => localMastered.includes(t.id)).length}/{category.techniques.length}
                    </span>
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {category.techniques.map((technique) => {
                      const isMastered = localMastered.includes(technique.id);
                      
                      return (
                        <button
                          key={technique.id}
                          onClick={() => setSelectedTechnique(technique)}
                          className={`
                            relative p-2 rounded-lg text-left transition-all
                            ${isMastered 
                              ? 'bg-emerald-500/20 border border-emerald-500/50' 
                              : 'bg-slate-700/50 border border-slate-600 hover:border-cyan-500/50'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2">
                            {isMastered ? (
                              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                                <span className="text-slate-400 text-xs">{technique.difficulty}</span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium text-sm truncate ${isMastered ? 'text-emerald-300' : 'text-white'}`}>
                                {technique.name}
                              </p>
                              <p className="text-slate-400 text-[10px] truncate">{technique.description}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          </div>

                          {/* Étoiles de difficulté */}
                          <div className="flex gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-2.5 h-2.5 ${i < technique.difficulty ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                              />
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Modal détail technique */}
        <AnimatePresence>
          {selectedTechnique && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedTechnique(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-800 rounded-2xl p-4 max-w-sm w-full border-2 border-cyan-500/30"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-4">
                  <span className="text-4xl mb-2 block">🥋</span>
                  <h3 className="text-xl font-bold text-white">{selectedTechnique.name}</h3>
                  <p className="text-slate-400 text-sm">{selectedTechnique.description}</p>
                  
                  {/* Étoiles de difficulté */}
                  <div className="flex justify-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < selectedTechnique.difficulty ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                      />
                    ))}
                  </div>
                  <p className="text-slate-500 text-xs mt-1">Difficulté : {selectedTechnique.difficulty}/5</p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
                  <p className="text-cyan-400 text-sm font-medium mb-1">💡 Conseil de Maître Tanaka :</p>
                  <p className="text-white/80 text-xs">
                    Pratique cette technique lentement au début. La précision est plus importante que la vitesse !
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTechnique(null)}
                    className="flex-1 text-slate-400"
                  >
                    Fermer
                  </Button>
                  
                  {!localMastered.includes(selectedTechnique.id) && (
                    <Button
                      onClick={() => handleMasterTechnique(selectedTechnique.id)}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Maîtrisé !
                    </Button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default TechniquesByKyuCards;
