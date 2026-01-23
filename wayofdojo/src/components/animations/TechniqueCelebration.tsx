/**
 * 🎉 TECHNIQUE CELEBRATION - Animation de célébration
 * 
 * Déclenché quand un utilisateur maîtrise une technique.
 * Utilise canvas-confetti pour les confettis.
 * 
 * Migré depuis AIKIDO@GAME
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TechniqueCelebrationProps {
  isVisible: boolean;
  techniqueName: string;
  xpEarned?: number;
  onComplete?: () => void;
}

const TechniqueCelebration: React.FC<TechniqueCelebrationProps> = ({ 
  isVisible, 
  techniqueName,
  xpEarned = 0,
  onComplete 
}) => {
  const confettiTriggered = useRef(false);

  // Sons de célébration (utilise Web Audio API)
  const playSound = async () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      
      // IMPORTANT: Résumer l'AudioContext si suspendu
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      const now = audioContext.currentTime;
      
      // Séquence de notes pour un effet "victoire" (Do, Mi, Sol, Do aigu)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      
      notes.forEach((freq, index) => {
        // Oscillateur principal
        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        
        osc1.connect(gain1);
        gain1.connect(audioContext.destination);
        
        osc1.type = 'sine';
        osc1.frequency.value = freq;
        
        const startTime = now + (index * 0.18);
        
        gain1.gain.setValueAtTime(0.001, startTime);
        gain1.gain.exponentialRampToValueAtTime(0.5, startTime + 0.02);
        gain1.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);
        
        osc1.start(startTime);
        osc1.stop(startTime + 0.5);
        
        // Harmonique pour richesse sonore
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        
        osc2.type = 'triangle';
        osc2.frequency.value = freq * 2;
        
        gain2.gain.setValueAtTime(0.001, startTime);
        gain2.gain.exponentialRampToValueAtTime(0.2, startTime + 0.02);
        gain2.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        
        osc2.start(startTime);
        osc2.stop(startTime + 0.45);
      });
      
      console.log('🎵 Victory sound played! AudioContext state:', audioContext.state);
    } catch (error) {
      console.error('❌ Audio error:', error);
    }
  };

  // Effet confettis avec canvas-confetti dynamique
  const triggerConfetti = async () => {
    if (confettiTriggered.current) return;
    confettiTriggered.current = true;

    try {
      const confetti = (await import('canvas-confetti')).default;
      
      // Confettis centraux - explosion principale
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
      });

      // Confettis des côtés
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#FFD700', '#FF6B6B', '#4ECDC4']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#45B7D1', '#96CEB4', '#FFEAA7']
        });
      }, 200);

      // Pluie d'étoiles
      setTimeout(() => {
        confetti({
          particleCount: 30,
          spread: 100,
          origin: { y: 0 },
          gravity: 0.5,
          shapes: ['star'],
          colors: ['#FFD700', '#FFA500']
        });
      }, 400);
    } catch {
      console.log('Confetti not available');
    }
  };

  useEffect(() => {
    if (isVisible) {
      confettiTriggered.current = false;
      
      // Déclencher le son et les confettis
      setTimeout(() => {
        playSound();
        triggerConfetti();
      }, 300);

      // Fermer automatiquement après 3.5 secondes
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 3500);

      return () => clearTimeout(timer);
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onComplete}
        >
          {/* Cercles de lumière en arrière-plan */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 3, opacity: 0.2 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2.5, opacity: 0.15 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
            />
          </div>

          {/* Contenu principal */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative z-10 text-center px-8 py-10 rounded-3xl bg-gradient-to-br from-slate-900/95 via-emerald-900/90 to-slate-900/95 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/30 max-w-md mx-4"
          >
            {/* Trophée animé */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-8xl mb-4"
            >
              🏆
            </motion.div>

            {/* Titre */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 mb-2"
            >
              TECHNIQUE MAÎTRISÉE !
            </motion.h2>

            {/* Nom de la technique */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-2"
            >
              <span className="text-xl text-white font-bold">{techniqueName}</span>
            </motion.div>

            {/* XP gagné */}
            {xpEarned > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="text-amber-400 text-2xl font-black mb-4"
              >
                +{xpEarned} XP
              </motion.div>
            )}

            {/* Message de félicitations */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-emerald-300 text-lg mb-6"
            >
              🥋 Bravo ! Tu as atteint la maîtrise ! 🥋
            </motion.p>

            {/* Étoiles décoratives */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex justify-center gap-2"
            >
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1 + i * 0.1, type: "spring" }}
                  className="text-2xl"
                >
                  ⭐
                </motion.span>
              ))}
            </motion.div>

            {/* Bouton fermer */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              onClick={onComplete}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-full shadow-lg shadow-emerald-500/30 transform hover:scale-105 transition-all"
            >
              Continuer 🚀
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TechniqueCelebration;
