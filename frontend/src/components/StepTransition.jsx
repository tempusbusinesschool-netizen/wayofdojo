import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

/**
 * StepTransition - Animation de sphère entre les étapes du parcours
 * Avec explosion de confettis ! 🎉
 */
const StepTransition = ({ 
  isVisible, 
  stepNumber, 
  stepTitle, 
  stepEmoji,
  userName,
  onComplete 
}) => {
  const [stage, setStage] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState(200);

  // Gérer le redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Lancer les confettis immédiatement
      setShowConfetti(true);
      setConfettiPieces(250);

      // Stage 0: Initial appearance
      const timer1 = setTimeout(() => setStage(1), 400);  // Message étape
      const timer2 = setTimeout(() => setStage(2), 1200); // Félicitations
      
      // Réduire progressivement les confettis
      const timerConfetti = setTimeout(() => setConfettiPieces(50), 1000);
      const timerConfettiEnd = setTimeout(() => setConfettiPieces(0), 1800);
      
      const timer3 = setTimeout(() => {
        setStage(3);
        setShowConfetti(false);
        if (onComplete) onComplete();
      }, 2000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timerConfetti);
        clearTimeout(timerConfettiEnd);
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
          {/* 🎉 CONFETTIS ! */}
          {showConfetti && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              numberOfPieces={confettiPieces}
              recycle={false}
              gravity={0.3}
              initialVelocityX={15}
              initialVelocityY={30}
              colors={[
                '#10B981', // emerald
                '#14B8A6', // teal
                '#F59E0B', // amber
                '#EC4899', // pink
                '#8B5CF6', // violet
                '#06B6D4', // cyan
                '#EF4444', // red
                '#FBBF24', // yellow
              ]}
              confettiSource={{
                x: windowSize.width / 2,
                y: windowSize.height / 3,
                w: 10,
                h: 10
              }}
            />
          )}

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
            {/* Animated sphere with step number */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative mx-auto mb-8"
            >
              {/* Outer glow */}
              <div className="absolute inset-0 w-40 h-40 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 blur-xl opacity-50" />
              
              {/* Main sphere */}
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
                {/* Inner content */}
                <div className="text-center">
                  <span className="text-5xl mb-1 block">{stepEmoji}</span>
                  <span className="text-white font-black text-2xl">Étape {stepNumber}</span>
                </div>

                {/* Rotating ring */}
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
                    Complétée ! ✨
                  </p>
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
                    🎉 Bravo {userName} ! Étape suivante...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress dots - 6 étapes */}
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StepTransition;
