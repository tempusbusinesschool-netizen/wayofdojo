import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginTransition = ({ isVisible, userName, destination, onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (isVisible) {
      // Stage 0: Initial appearance
      const timer1 = setTimeout(() => setStage(1), 500);  // Welcome message
      const timer2 = setTimeout(() => setStage(2), 1500); // Redirecting
      const timer3 = setTimeout(() => {
        setStage(3);
        if (onComplete) onComplete();
      }, 2500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      setStage(0);
    }
  }, [isVisible, onComplete]);

  const getDestinationText = () => {
    switch (destination) {
      case 'dashboard':
        return 'votre espace personnel';
      case 'dojo':
        return 'votre espace club';
      case 'enseignant':
        return 'l\'espace enseignant';
      case 'tarification':
        return 'les offres d\'abonnement';
      default:
        return 'votre espace';
    }
  };

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
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 3, opacity: 0.05 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-8">
            {/* Logo animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                duration: 0.8 
              }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
                <span className="text-4xl">☯️</span>
              </div>
            </motion.div>

            {/* Welcome text */}
            <AnimatePresence mode="wait">
              {stage >= 1 && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Bienvenue{userName ? `, ${userName}` : ''} ! 
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="inline-block ml-2"
                    >
                      👋
                    </motion.span>
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Redirecting text */}
            <AnimatePresence mode="wait">
              {stage >= 2 && (
                <motion.div
                  key="redirect"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6"
                >
                  <p className="text-xl text-slate-300">
                    Redirection vers {getDestinationText()}...
                  </p>
                  
                  {/* Loading dots */}
                  <div className="flex justify-center gap-2 mt-6">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1, 0] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                        className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              className="mt-10 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 rounded-full max-w-xs mx-auto"
            />
          </div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 text-sm"
          >
            Aikido@Game
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginTransition;
