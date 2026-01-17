/**
 * 🥋 ANIMATIONS TECHNIQUES - Zone Enfants
 * 
 * Illustrations animées des techniques d'Aïkido
 * Style : Silhouettes simplifiées, mouvement fluide
 * Usage : Mémoire visuelle, rappel de ce qui a été vu au dojo
 * 
 * ⚠️ Ces animations ne remplacent pas l'enseignement au dojo.
 * Elles servent uniquement de support de mémorisation.
 */

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Composant générique pour afficher une animation de technique
 */
export const TechniqueAnimation = ({ 
  type = 'tai_sabaki',
  size = 'md',
  autoPlay = true,
  showLabel = true 
}) => {
  const sizes = {
    sm: { width: 120, height: 120 },
    md: { width: 180, height: 180 },
    lg: { width: 240, height: 240 }
  };

  const { width, height } = sizes[size] || sizes.md;

  const animations = {
    tai_sabaki: <TaiSabakiAnimation width={width} height={height} autoPlay={autoPlay} />,
    irimi: <IrimiAnimation width={width} height={height} autoPlay={autoPlay} />,
    tenkan: <TenkanAnimation width={width} height={height} autoPlay={autoPlay} />,
  };

  const labels = {
    tai_sabaki: 'Tai Sabaki (体捌き)',
    irimi: 'Irimi (入身)',
    tenkan: 'Tenkan (転換)',
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
        {animations[type] || animations.tai_sabaki}
      </div>
      {showLabel && (
        <p className="text-slate-400 text-sm mt-2 font-medium">{labels[type]}</p>
      )}
    </div>
  );
};

/**
 * TAI SABAKI - Déplacement du corps (pivot)
 * Mouvement fondamental : rotation du corps pour esquiver
 */
const TaiSabakiAnimation = ({ width, height, autoPlay }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 200 200"
      className="overflow-visible"
    >
      {/* Cercle de référence (tatami) */}
      <circle 
        cx="100" 
        cy="100" 
        r="80" 
        fill="none" 
        stroke="#475569" 
        strokeWidth="1" 
        strokeDasharray="4 4"
        opacity="0.5"
      />
      
      {/* Flèche directionnelle */}
      <motion.path
        d="M 100 40 A 60 60 0 0 1 160 100"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={autoPlay ? { 
          pathLength: [0, 1, 1, 0],
          opacity: [0, 1, 1, 0]
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.4, 0.8, 1]
        }}
      />
      
      {/* Pointe de flèche */}
      <motion.polygon
        points="160,100 150,90 150,110"
        fill="#f59e0b"
        initial={{ opacity: 0 }}
        animate={autoPlay ? { 
          opacity: [0, 1, 1, 0]
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.4, 0.8, 1]
        }}
      />

      {/* Silhouette - Position initiale */}
      <motion.g
        initial={{ opacity: 1 }}
        animate={autoPlay ? {
          opacity: [1, 0.3, 0.3, 1],
          rotate: [0, 0, 0, 0]
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transformOrigin: '100px 100px' }}
      >
        {/* Tête */}
        <circle cx="100" cy="55" r="12" fill="#94a3b8" />
        {/* Corps */}
        <ellipse cx="100" cy="90" rx="15" ry="25" fill="#64748b" />
        {/* Bras gauche */}
        <line x1="85" y1="80" x2="65" y2="95" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
        {/* Bras droit */}
        <line x1="115" y1="80" x2="135" y2="95" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
        {/* Jambe gauche */}
        <line x1="92" y1="115" x2="85" y2="150" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />
        {/* Jambe droite */}
        <line x1="108" y1="115" x2="115" y2="150" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />
        {/* Pieds */}
        <ellipse cx="85" cy="155" rx="8" ry="5" fill="#475569" />
        <ellipse cx="115" cy="155" rx="8" ry="5" fill="#475569" />
      </motion.g>

      {/* Silhouette - Position pivotée */}
      <motion.g
        initial={{ opacity: 0, rotate: 0 }}
        animate={autoPlay ? {
          opacity: [0, 1, 1, 0],
          rotate: [0, 90, 90, 90]
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.4, 0.8, 1]
        }}
        style={{ transformOrigin: '100px 100px' }}
      >
        {/* Tête */}
        <circle cx="100" cy="55" r="12" fill="#22d3ee" />
        {/* Corps */}
        <ellipse cx="100" cy="90" rx="15" ry="25" fill="#0891b2" />
        {/* Bras gauche */}
        <line x1="85" y1="80" x2="65" y2="95" stroke="#0891b2" strokeWidth="6" strokeLinecap="round" />
        {/* Bras droit */}
        <line x1="115" y1="80" x2="135" y2="95" stroke="#0891b2" strokeWidth="6" strokeLinecap="round" />
        {/* Jambe gauche */}
        <line x1="92" y1="115" x2="85" y2="150" stroke="#0891b2" strokeWidth="7" strokeLinecap="round" />
        {/* Jambe droite */}
        <line x1="108" y1="115" x2="115" y2="150" stroke="#0891b2" strokeWidth="7" strokeLinecap="round" />
        {/* Pieds */}
        <ellipse cx="85" cy="155" rx="8" ry="5" fill="#0e7490" />
        <ellipse cx="115" cy="155" rx="8" ry="5" fill="#0e7490" />
      </motion.g>

      {/* Point de pivot central */}
      <motion.circle
        cx="100"
        cy="100"
        r="5"
        fill="#f59e0b"
        initial={{ scale: 0 }}
        animate={autoPlay ? { scale: [0, 1.2, 1, 0] } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </svg>
  );
};

/**
 * IRIMI - Entrée directe
 * Mouvement d'avancée vers le partenaire
 */
const IrimiAnimation = ({ width, height, autoPlay }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 200 200"
      className="overflow-visible"
    >
      {/* Ligne directionnelle */}
      <line 
        x1="100" y1="180" x2="100" y2="40" 
        stroke="#475569" 
        strokeWidth="1" 
        strokeDasharray="4 4"
        opacity="0.5"
      />

      {/* Flèche de direction */}
      <motion.path
        d="M 100 160 L 100 60"
        fill="none"
        stroke="#10b981"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={autoPlay ? { pathLength: [0, 1, 1, 0] } : {}}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.4, 0.7, 1]
        }}
      />

      {/* Pointe de flèche */}
      <motion.polygon
        points="100,50 90,70 110,70"
        fill="#10b981"
        initial={{ opacity: 0 }}
        animate={autoPlay ? { opacity: [0, 1, 1, 0] } : {}}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.4, 0.7, 1]
        }}
      />

      {/* Silhouette en mouvement */}
      <motion.g
        initial={{ y: 0 }}
        animate={autoPlay ? { y: [0, -80, -80, 0] } : {}}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.4, 0.7, 1]
        }}
      >
        {/* Tête */}
        <motion.circle 
          cx="100" cy="130" r="12" 
          fill="#94a3b8"
          animate={autoPlay ? { fill: ['#94a3b8', '#10b981', '#10b981', '#94a3b8'] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.4, 0.7, 1] }}
        />
        {/* Corps */}
        <motion.ellipse 
          cx="100" cy="160" rx="14" ry="20" 
          fill="#64748b"
          animate={autoPlay ? { fill: ['#64748b', '#059669', '#059669', '#64748b'] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.4, 0.7, 1] }}
        />
        {/* Bras - position d'entrée */}
        <motion.line 
          x1="86" y1="155" x2="70" y2="140" 
          stroke="#64748b" 
          strokeWidth="6" 
          strokeLinecap="round"
          animate={autoPlay ? { 
            stroke: ['#64748b', '#059669', '#059669', '#64748b'],
            x2: [70, 75, 75, 70],
            y2: [140, 130, 130, 140]
          } : {}}
          transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.4, 0.7, 1] }}
        />
        <motion.line 
          x1="114" y1="155" x2="130" y2="140" 
          stroke="#64748b" 
          strokeWidth="6" 
          strokeLinecap="round"
          animate={autoPlay ? { 
            stroke: ['#64748b', '#059669', '#059669', '#64748b'],
            x2: [130, 125, 125, 130],
            y2: [140, 130, 130, 140]
          } : {}}
          transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.4, 0.7, 1] }}
        />
      </motion.g>
    </svg>
  );
};

/**
 * TENKAN - Rotation/pivot arrière
 * Mouvement de rotation pour rediriger l'énergie
 */
const TenkanAnimation = ({ width, height, autoPlay }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 200 200"
      className="overflow-visible"
    >
      {/* Arc de rotation */}
      <path 
        d="M 60 100 A 40 40 0 1 1 140 100" 
        fill="none" 
        stroke="#475569" 
        strokeWidth="1" 
        strokeDasharray="4 4"
        opacity="0.5"
      />

      {/* Flèche de rotation */}
      <motion.path
        d="M 60 100 A 40 40 0 1 1 140 100"
        fill="none"
        stroke="#a855f7"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={autoPlay ? { pathLength: [0, 1, 1, 0] } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 0.8, 1]
        }}
      />

      {/* Position de départ (grisée) */}
      <motion.g
        initial={{ opacity: 1 }}
        animate={autoPlay ? { opacity: [1, 0.2, 0.2, 1] } : {}}
        transition={{ duration: 3, repeat: Infinity, times: [0, 0.3, 0.8, 1] }}
      >
        <circle cx="60" cy="100" r="10" fill="#94a3b8" />
        <ellipse cx="60" cy="125" rx="12" ry="18" fill="#64748b" />
      </motion.g>

      {/* Silhouette en rotation */}
      <motion.g
        initial={{ rotate: 0, opacity: 0 }}
        animate={autoPlay ? { 
          rotate: [0, 180, 180, 0],
          opacity: [0, 1, 1, 0]
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 0.8, 1]
        }}
        style={{ transformOrigin: '100px 100px' }}
      >
        {/* Tête */}
        <circle cx="60" cy="100" r="10" fill="#a855f7" />
        {/* Corps */}
        <ellipse cx="60" cy="125" rx="12" ry="18" fill="#9333ea" />
        {/* Bras avant */}
        <line x1="72" y1="115" x2="90" y2="105" stroke="#9333ea" strokeWidth="5" strokeLinecap="round" />
      </motion.g>

      {/* Point de pivot */}
      <motion.circle
        cx="100"
        cy="100"
        r="6"
        fill="#a855f7"
        initial={{ scale: 0 }}
        animate={autoPlay ? { scale: [0, 1.3, 1, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity, times: [0, 0.3, 0.8, 1] }}
      />

      {/* Position finale */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={autoPlay ? { opacity: [0, 0, 1, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity, times: [0, 0.4, 0.8, 1] }}
      >
        <circle cx="140" cy="100" r="10" fill="#a855f7" />
        <ellipse cx="140" cy="125" rx="12" ry="18" fill="#9333ea" />
        <line x1="128" y1="115" x2="110" y2="105" stroke="#9333ea" strokeWidth="5" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
};

export default TechniqueAnimation;
