/**
 * 🎊 STEP TRANSITION - Animation de transition entre étapes
 * 
 * Animation spectaculaire avec confettis lors des accomplissements.
 * 
 * Migré depuis AIKIDO@GAME
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ActionType = 'step_complete' | 'profile_created' | 'technique_learned' | 'game_won' | 'challenge_done' | 'badge_earned' | 'dojo_entered';

interface StepTransitionProps {
  isVisible: boolean;
  stepNumber?: number;
  stepTitle: string;
  stepEmoji: string;
  userName?: string;
  actionType?: ActionType;
  customMessage?: string | null;
  xpEarned?: number;
  onComplete?: () => void;
}

const StepTransition: React.FC<StepTransitionProps> = ({ 
  isVisible, 
  stepNumber = 1, 
  stepTitle, 
  stepEmoji,
  userName = '',
  actionType = 'step_complete',
  customMessage = null,
  xpEarned = 0,
  onComplete 
}) => {
  const [stage, setStage] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showConfetti, setShowConfetti] = useState(false);

  // 🔊 Son "KAI" - Cri martial avec Web Audio API
  const playKaiSound = async () => {
    try {
      // Créer l'AudioContext
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      
      // IMPORTANT: Résumer l'AudioContext si suspendu (requis par les navigateurs modernes)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      const now = audioContext.currentTime;
      
      // === SON PRINCIPAL "KAI" - Attaque percutante ===
      const osc1 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();
      const filter1 = audioContext.createBiquadFilter();
      
      osc1.connect(filter1);
      filter1.connect(gain1);
      gain1.connect(audioContext.destination);
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(150, now);
      osc1.frequency.exponentialRampToValueAtTime(600, now + 0.08);
      osc1.frequency.exponentialRampToValueAtTime(300, now + 0.25);
      
      filter1.type = 'lowpass';
      filter1.frequency.setValueAtTime(3000, now);
      filter1.frequency.exponentialRampToValueAtTime(800, now + 0.25);
      
      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.exponentialRampToValueAtTime(0.7, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      
      osc1.start(now);
      osc1.stop(now + 0.4);
      
      // === SON SECONDAIRE - Sub bass impact ===
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(80, now);
      osc2.frequency.exponentialRampToValueAtTime(40, now + 0.3);
      
      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.exponentialRampToValueAtTime(0.5, now + 0.01);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      osc2.start(now);
      osc2.stop(now + 0.5);
      
      // === RÉSONANCE - Echo martial ===
      const osc3 = audioContext.createOscillator();
      const gain3 = audioContext.createGain();
      
      osc3.connect(gain3);
      gain3.connect(audioContext.destination);
      
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(400, now + 0.1);
      osc3.frequency.exponentialRampToValueAtTime(200, now + 0.5);
      
      gain3.gain.setValueAtTime(0.001, now + 0.1);
      gain3.gain.exponentialRampToValueAtTime(0.25, now + 0.12);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      
      osc3.start(now + 0.1);
      osc3.stop(now + 0.7);
      
      console.log('🔊 KAI sound played! AudioContext state:', audioContext.state);
    } catch (error) {
      console.error('❌ Audio error:', error);
    }
  };

  // Messages adaptés selon le type d'action
  const getActionMessages = () => {
    const messages: Record<ActionType, { status: string; congrats: string }> = {
      step_complete: {
        status: "Complétée ! ✨",
        congrats: `🎉 Bravo ${userName} ! Étape suivante...`
      },
      profile_created: {
        status: "Profil créé ! 🥋",
        congrats: `🎊 Bienvenue ${userName} ! Ton aventure commence...`
      },
      technique_learned: {
        status: "Technique découverte ! 📚",
        congrats: `💪 Continue ${userName} ! La maîtrise s'approche...`
      },
      game_won: {
        status: "Victoire ! 🏆",
        congrats: `🌟 Excellent ${userName} ! Tu progresses vite !`
      },
      challenge_done: {
        status: "Défi relevé ! ⚡",
        congrats: `🔥 Super ${userName} ! Un pas de plus vers la maîtrise !`
      },
      badge_earned: {
        status: "Badge obtenu ! 🏅",
        congrats: `✨ Félicitations ${userName} ! Tu mérites cette récompense !`
      },
      dojo_entered: {
        status: "Dojo ouvert ! 🏯",
        congrats: `🥷 ${userName}, le Dojo Virtuel t'attend !`
      }
    };
    
    return messages[actionType] || messages.step_complete;
  };

  const actionMessages = getActionMessages();

  // Déclencher les confettis
  const triggerConfetti = async () => {
    try {
      const confetti = (await import('canvas-confetti')).default;
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.4 },
        colors: ['#10B981', '#14B8A6', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4']
      });
    } catch {
      console.log('Confetti not available');
    }
  };

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      triggerConfetti();
      
      // 🔊 Jouer le son "KAI" au début de l'animation
      setTimeout(() => playKaiSound(), 100);

      const timer1 = setTimeout(() => setStage(1), 400);
      const timer2 = setTimeout(() => setStage(2), 1200);
      const timer3 = setTimeout(() => {
        setStage(3);
        setShowConfetti(false);
        if (onComplete) onComplete();
      }, 2500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      setStage(0);
      setShowConfetti(false);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        >
          {/* Background animated circles */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 4, opacity: 0.1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 3, opacity: 0.15 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2, opacity: 0.2 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
            />
          </div>

          {/* Main content */}
          <div className="relative z-10 text-center px-6">
            {/* Animated sphere */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative mx-auto mb-8"
            >
              <div className="absolute inset-0 w-40 h-40 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 blur-xl opacity-50" />
              
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(16, 185, 129, 0.5)",
                    "0 0 40px rgba(16, 185, 129, 0.8)",
                    "0 0 20px rgba(16, 185, 129, 0.5)"
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center border-4 border-white/30"
              >
                <div className="text-center">
                  <span className="text-5xl mb-1 block">{stepEmoji}</span>
                  {stepNumber && (
                    <span className="text-white font-black text-2xl">Étape {stepNumber}</span>
                  )}
                </div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-8px] rounded-full border-2 border-dashed border-white/30"
                />
              </motion.div>

              {/* Sparkles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.cos(i * 60 * Math.PI / 180) * 80,
                    y: Math.sin(i * 60 * Math.PI / 180) * 80,
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    repeatDelay: 0.5
                  }}
                  className="absolute top-1/2 left-1/2 w-3 h-3 bg-amber-400 rounded-full"
                  style={{ marginLeft: -6, marginTop: -6 }}
                />
              ))}
            </motion.div>

            {/* Text content */}
            <AnimatePresence mode="wait">
              {stage >= 1 && (
                <motion.div
                  key="step-name"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4"
                >
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    {stepTitle}
                  </h2>
                  <p className="text-emerald-400 text-xl">
                    {customMessage || actionMessages.status}
                  </p>
                  {xpEarned > 0 && (
                    <motion.p 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-amber-400 text-lg font-bold mt-2"
                    >
                      +{xpEarned} XP
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {stage >= 2 && (
                <motion.div
                  key="congrats"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6"
                >
                  <p className="text-amber-400 text-lg font-semibold">
                    {actionMessages.congrats}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress dots */}
            {stepNumber && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center gap-2 mt-8"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className={`w-3 h-3 rounded-full ${
                      i < stepNumber 
                        ? 'bg-emerald-500' 
                        : i === stepNumber - 1
                          ? 'bg-amber-500 animate-pulse' 
                          : 'bg-slate-600'
                    }`}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StepTransition;
