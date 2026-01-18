/**
 * 🧘 TANAKA ANIMATED LOGO
 * 
 * Logo animé de Maître Tanaka pour le header
 * Alterne entre différentes poses avec des transitions fluides
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TANAKA_POSES = [
  { src: '/images/tanaka/portrait.png', alt: 'Tanaka Portrait' },
  { src: '/images/tanaka/teaching.png', alt: 'Tanaka Teaching' },
  { src: '/images/tanaka/bowing.png', alt: 'Tanaka Bowing' },
  { src: '/images/tanaka/meditation.png', alt: 'Tanaka Meditation' },
];

const TanakaAnimatedLogo = ({ size = 'md', className = '' }) => {
  const [currentPose, setCurrentPose] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Dimensions selon la taille
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12 sm:w-16 sm:h-16',
    lg: 'w-16 h-16 sm:w-20 sm:h-20'
  };
  
  // Changer de pose toutes les 4 secondes (ou plus vite si survolé)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPose(prev => (prev + 1) % TANAKA_POSES.length);
    }, isHovered ? 1500 : 4000);
    
    return () => clearInterval(interval);
  }, [isHovered]);
  
  return (
    <motion.div
      className={`relative ${sizes[size]} rounded-full overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {/* Cercle de fond doré animé */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600"
        animate={{ 
          rotate: 360,
          background: isHovered 
            ? 'linear-gradient(to bottom right, #fbbf24, #eab308, #f59e0b)' 
            : 'linear-gradient(to bottom right, #fbbf24, #eab308, #d97706)'
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          background: { duration: 0.3 }
        }}
      />
      
      {/* Cercle intérieur sombre */}
      <div className="absolute inset-0.5 sm:inset-1 rounded-full bg-slate-900 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentPose}
            src={TANAKA_POSES[currentPose].src}
            alt={TANAKA_POSES[currentPose].alt}
            className="w-full h-full object-cover object-top scale-125"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.25 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>
      </div>
      
      {/* Effet de brillance */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, transparent 100%)'
        }}
        animate={{
          opacity: isHovered ? 0.8 : 0.4
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Indicateur de parole (petit cercle qui pulse) */}
      <motion.div
        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-emerald-500 border-2 border-slate-900"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default TanakaAnimatedLogo;
