import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, ChevronLeft, Check, Sparkles, User, Camera, Target } from 'lucide-react';

// Image de Maître Tanaka
const TANAKA_IMAGE = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face";

/**
 * ProfileOnboarding - Formulaire d'onboarding pour l'étape 1 "Commence"
 * Avec Maître Tanaka comme guide dynamique !
 * 
 * 3 étapes :
 * 1. Choisir son avatar/photo
 * 2. Sélectionner son animal gardien parmi les 7
 * 3. Définir un objectif personnel
 */
const ProfileOnboarding = ({ 
  isOpen, 
  onClose, 
  onComplete,
  userName = '',
  currentAvatar = null,
  currentAnimal = null,
  currentObjective = ''
}) => {
  const [step, setStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || 'ninja_1');
  const [selectedAnimal, setSelectedAnimal] = useState(currentAnimal || null);
  const [objective, setObjective] = useState(currentObjective || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Messages de Maître Tanaka pour chaque étape
  const tanakaMessages = {
    1: `Bienvenue ${userName || 'jeune ninja'} ! 🥋 Choisis d'abord ton avatar, celui qui te représente le mieux sur le tatami !`,
    2: `Excellent choix ! Maintenant, choisis ton Animal Gardien. Chaque animal représente une vertu du Budo qui te guidera dans ton apprentissage.`,
    3: `Parfait ! 🎯 Dernière étape : fixe-toi un objectif. Qu'est-ce qui te motive à pratiquer l'Aïkido ?`
  };

  // Avatars disponibles
  const avatars = [
    { id: 'ninja_1', emoji: '🥷', label: 'Ninja Classique' },
    { id: 'ninja_2', emoji: '👦', label: 'Garçon' },
    { id: 'ninja_3', emoji: '👧', label: 'Fille' },
    { id: 'ninja_4', emoji: '🧒', label: 'Enfant' },
    { id: 'ninja_5', emoji: '👤', label: 'Silhouette' },
    { id: 'ninja_6', emoji: '🦸', label: 'Super Héros' },
    { id: 'ninja_7', emoji: '🦹', label: 'Super Héroïne' },
    { id: 'ninja_8', emoji: '🧙', label: 'Sage' },
  ];

  // Les 7 animaux gardiens liés aux vertus
  const animals = [
    { 
      id: 'lion', 
      emoji: '🦁', 
      name: 'Lion Noble', 
      virtue: 'Respect',
      virtueKanji: '礼',
      description: 'Le Lion t\'apprend à respecter les autres et à être digne.',
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500'
    },
    { 
      id: 'tiger', 
      emoji: '🐯', 
      name: 'Tigre Brave', 
      virtue: 'Courage',
      virtueKanji: '勇',
      description: 'Le Tigre te donne la force d\'affronter tes peurs.',
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500'
    },
    { 
      id: 'turtle', 
      emoji: '🐢', 
      name: 'Tortue Sage', 
      virtue: 'Maîtrise',
      virtueKanji: '克',
      description: 'La Tortue t\'enseigne la patience et le contrôle de soi.',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500'
    },
    { 
      id: 'elephant', 
      emoji: '🐘', 
      name: 'Éléphant Sage', 
      virtue: 'Humilité',
      virtueKanji: '謙',
      description: 'L\'Éléphant te rappelle de rester humble malgré ta force.',
      color: 'from-violet-400 to-purple-500',
      bgColor: 'bg-violet-500/20',
      borderColor: 'border-violet-500'
    },
    { 
      id: 'panda', 
      emoji: '🐼', 
      name: 'Panda Doux', 
      virtue: 'Bienveillance',
      virtueKanji: '仁',
      description: 'Le Panda t\'apprend à être gentil et à aider les autres.',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500'
    },
    { 
      id: 'owl', 
      emoji: '🦉', 
      name: 'Hibou Vigilant', 
      virtue: 'Attention',
      virtueKanji: '注',
      description: 'Le Hibou t\'aide à rester concentré et observateur.',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500'
    },
    { 
      id: 'eagle', 
      emoji: '🦅', 
      name: 'Aigle Fier', 
      virtue: 'Responsabilité',
      virtueKanji: '責',
      description: 'L\'Aigle te guide pour prendre tes responsabilités.',
      color: 'from-teal-400 to-cyan-500',
      bgColor: 'bg-teal-500/20',
      borderColor: 'border-teal-500'
    },
  ];

  // Objectifs suggérés
  const suggestedObjectives = [
    '🥋 Obtenir ma ceinture jaune',
    '💪 M\'entraîner 2 fois par semaine',
    '🎯 Maîtriser 10 techniques',
    '🧘 Apprendre à mieux me concentrer',
    '👫 Me faire des amis au dojo',
    '🏆 Participer à une démonstration',
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!selectedAnimal || !objective.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Appeler le callback avec les données du profil
      if (onComplete) {
        await onComplete({
          avatar: selectedAvatar,
          guardianAnimal: selectedAnimal,
          objective: objective.trim()
        });
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedAvatar !== null;
      case 2: return selectedAnimal !== null;
      case 3: return objective.trim().length > 0;
      default: return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-emerald-500/30 p-0 overflow-hidden max-h-[85vh] overflow-y-auto">
        
        {/* 🥋 MAÎTRE TANAKA - Guide dynamique (compact) */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-2 sm:p-3 border-b border-emerald-500/30">
          <div className="flex items-start gap-2 sm:gap-3">
            {/* Avatar de Tanaka (plus petit) */}
            <motion.div 
              className="relative flex-shrink-0"
              animate={{ 
                y: [0, -2, 0],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-emerald-400 shadow-lg shadow-emerald-500/30">
                <img 
                  src={TANAKA_IMAGE} 
                  alt="Maître Tanaka"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2310B981" width="100" height="100"/><text x="50" y="60" text-anchor="middle" font-size="40">🥋</text></svg>';
                  }}
                />
              </div>
              {/* Badge parlant */}
              <motion.div 
                className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-xs">💬</span>
              </motion.div>
            </motion.div>
            
            {/* Bulle de dialogue de Tanaka (plus compacte) */}
            <div className="flex-1 relative">
              <div className="absolute -left-2 top-2 w-0 h-0 border-t-6 border-t-transparent border-r-6 border-r-emerald-500/20 border-b-6 border-b-transparent"></div>
              <motion.div 
                key={step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-2 sm:p-3"
              >
                <p className="text-white/90 text-xs sm:text-sm font-medium">
                  {tanakaMessages[step]}
                </p>
                <p className="text-emerald-400 text-[10px] mt-1 font-semibold">— Maître Tanaka</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Header avec progression (compact) */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-2 sm:p-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Créer mon Profil Ninja
            </h2>
            <span className="text-emerald-200 text-xs">Étape {step}/3</span>
          </div>
          
          {/* Barre de progression */}
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div 
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          
          {/* Labels des étapes */}
          <div className="flex justify-between mt-1.5 text-[10px] text-emerald-200">
            <span className={step >= 1 ? 'text-white font-semibold' : ''}>Avatar</span>
            <span className={step >= 2 ? 'text-white font-semibold' : ''}>Animal</span>
            <span className={step >= 3 ? 'text-white font-semibold' : ''}>Objectif</span>
          </div>
        </div>

        {/* Contenu des étapes (plus compact) */}
        <div className="p-3 sm:p-4 min-h-[280px] max-h-[350px] overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* ÉTAPE 1 : Choix de l'avatar */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <div className="text-center mb-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 mb-2">
                    <Camera className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">Choisis ton Avatar</h3>
                  <p className="text-slate-400 text-xs">Sélectionne l'image qui te représente !</p>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={`
                        relative p-2 rounded-lg transition-all duration-200
                        flex flex-col items-center justify-center gap-1
                        ${selectedAvatar === avatar.id 
                          ? 'bg-emerald-500/30 border-2 border-emerald-400 scale-105 shadow-lg shadow-emerald-500/20' 
                          : 'bg-slate-700/50 border-2 border-transparent hover:border-slate-500 hover:bg-slate-700'
                        }
                      `}
                    >
                      <span className="text-2xl">{avatar.emoji}</span>
                      <span className="text-[9px] text-slate-300">{avatar.label}</span>
                      {selectedAvatar === avatar.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center"
                        >
                          <Check className="w-2.5 h-2.5 text-white" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Aperçu (compact) */}
                <div className="mt-3 flex justify-center">
                  <div className="bg-slate-800 rounded-xl p-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl border-2 border-white/20">
                      {avatars.find(a => a.id === selectedAvatar)?.emoji}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{userName || 'Ninja'}</p>
                      <p className="text-emerald-400 text-xs">Apprenti Ninja</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ÉTAPE 2 : Choix de l'animal gardien */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 mb-3">
                    <span className="text-4xl">🐾</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Choisis ton Animal Gardien</h3>
                  <p className="text-slate-400 text-sm">Chaque animal représente une vertu qui te guidera !</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[280px] overflow-y-auto pr-2">
                  {animals.map((animal) => (
                    <button
                      key={animal.id}
                      onClick={() => setSelectedAnimal(animal.id)}
                      className={`
                        relative p-3 rounded-xl transition-all duration-200 text-left
                        ${selectedAnimal === animal.id 
                          ? `${animal.bgColor} border-2 ${animal.borderColor} scale-[1.02] shadow-lg` 
                          : 'bg-slate-700/50 border-2 border-transparent hover:border-slate-500'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl">{animal.emoji}</span>
                        <div>
                          <p className="text-white font-bold text-sm">{animal.name}</p>
                          <p className="text-xs text-slate-400">{animal.virtue}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2">{animal.description}</p>
                      
                      {selectedAnimal === animal.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Aperçu de l'animal sélectionné */}
                {selectedAnimal && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 rounded-xl ${animals.find(a => a.id === selectedAnimal)?.bgColor} border ${animals.find(a => a.id === selectedAnimal)?.borderColor}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-5xl">{animals.find(a => a.id === selectedAnimal)?.emoji}</span>
                      <div>
                        <p className="text-white font-bold">{animals.find(a => a.id === selectedAnimal)?.name}</p>
                        <p className="text-white/80 text-sm">Vertu : {animals.find(a => a.id === selectedAnimal)?.virtue}</p>
                        <p className="text-white/60 text-xs mt-1">{animals.find(a => a.id === selectedAnimal)?.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ÉTAPE 3 : Définir un objectif */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/20 mb-3">
                    <Target className="w-8 h-8 text-violet-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Définis ton Objectif</h3>
                  <p className="text-slate-400 text-sm">Quel est ton rêve en Aïkido ? Écris-le ici !</p>
                </div>

                {/* Suggestions rapides */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {suggestedObjectives.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setObjective(suggestion)}
                      className={`
                        px-3 py-1.5 rounded-full text-xs transition-all
                        ${objective === suggestion 
                          ? 'bg-violet-500 text-white' 
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }
                      `}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                {/* Champ texte pour objectif personnalisé */}
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Ou écris ton propre objectif :
                  </label>
                  <Textarea
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="Ex: Je veux devenir ceinture noire et aider les autres à apprendre..."
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 min-h-[100px]"
                    maxLength={200}
                  />
                  <p className="text-slate-500 text-xs mt-1 text-right">{objective.length}/200</p>
                </div>

                {/* Récapitulatif */}
                {objective && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30"
                  >
                    <h4 className="text-emerald-400 font-bold text-sm mb-3">📋 Récapitulatif de ton profil</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-3xl">{avatars.find(a => a.id === selectedAvatar)?.emoji}</span>
                        <span className="text-[10px] text-slate-400">Avatar</span>
                      </div>
                      <div className="text-2xl">+</div>
                      <div className="flex flex-col items-center">
                        <span className="text-3xl">{animals.find(a => a.id === selectedAnimal)?.emoji}</span>
                        <span className="text-[10px] text-slate-400">Gardien</span>
                      </div>
                      <div className="text-2xl">+</div>
                      <div className="flex-1 bg-slate-800/50 rounded-lg p-2">
                        <p className="text-white text-xs line-clamp-2">{objective}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer avec boutons de navigation */}
        <div className="bg-slate-800/50 p-4 border-t border-slate-700 flex justify-between">
          <Button
            variant="ghost"
            onClick={step === 1 ? onClose : handlePrev}
            className="text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {step === 1 ? 'Annuler' : 'Retour'}
          </Button>

          {step < 3 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!canProceed() || isSubmitting}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Création...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Créer mon profil !
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileOnboarding;
