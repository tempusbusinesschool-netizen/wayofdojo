'use client';

import { motion } from 'framer-motion';

/**
 * SpiralConnector - Animation spirale décorative entre les blocs
 * ⚠️ COMPOSANT VERROUILLÉ - Animation spirale du parcours
 */

interface SpiralConnectorProps {
  variant?: 'default' | 'glow' | 'dashed';
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SpiralConnector: React.FC<SpiralConnectorProps> = ({
  variant = 'default',
  color = 'amber',
  size = 'md',
  className = ''
}) => {
  const sizeConfig = {
    sm: { width: 40, height: 30 },
    md: { width: 60, height: 40 },
    lg: { width: 80, height: 50 }
  };

  const { width, height } = sizeConfig[size];

  // Couleurs selon le thème
  const colorMap: Record<string, string> = {
    amber: '#f59e0b',
    emerald: '#10b981',
    cyan: '#06b6d4',
    purple: '#a855f7',
    orange: '#f97316',
    pink: '#ec4899'
  };

  const strokeColor = colorMap[color] || color;

  return (
    <div className={`flex items-center justify-center py-2 ${className}`}>
      <motion.svg
        width={width}
        height={height}
        viewBox="0 0 60 40"
        fill="none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Spirale principale animée */}
        <motion.path
          d="M5 20 Q15 5, 30 20 T55 20"
          stroke={strokeColor}
          strokeWidth={variant === 'dashed' ? 2 : 3}
          strokeLinecap="round"
          strokeDasharray={variant === 'dashed' ? '5,5' : 'none'}
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ 
            duration: 1.5, 
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 1
          }}
        />
        
        {/* Deuxième spirale (décalée) */}
        <motion.path
          d="M5 25 Q20 10, 35 25 T55 25"
          stroke={strokeColor}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          opacity={0.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ 
            duration: 1.5, 
            ease: "easeInOut",
            delay: 0.3,
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 1
          }}
        />

        {/* Points lumineux qui suivent la spirale */}
        <motion.circle
          r="3"
          fill={strokeColor}
          initial={{ cx: 5, cy: 20 }}
          animate={{ 
            cx: [5, 30, 55],
            cy: [20, 10, 20]
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.5
          }}
        />

        {/* Effet de glow (si variant glow) */}
        {variant === 'glow' && (
          <motion.circle
            r="5"
            fill={strokeColor}
            opacity={0.3}
            initial={{ cx: 5, cy: 20 }}
            animate={{ 
              cx: [5, 30, 55],
              cy: [20, 10, 20],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0.5
            }}
          />
        )}
      </motion.svg>
    </div>
  );
};

/**
 * SpiralDivider - Diviseur avec spirale pour séparer les sections
 */
export const SpiralDivider: React.FC<{ color?: string; className?: string }> = ({ 
  color = 'amber',
  className = '' 
}) => {
  const colorMap: Record<string, string> = {
    amber: 'from-amber-500/0 via-amber-500/50 to-amber-500/0',
    emerald: 'from-emerald-500/0 via-emerald-500/50 to-emerald-500/0',
    cyan: 'from-cyan-500/0 via-cyan-500/50 to-cyan-500/0',
    purple: 'from-purple-500/0 via-purple-500/50 to-purple-500/0'
  };

  return (
    <div className={`flex items-center gap-2 py-3 ${className}`}>
      <div className={`flex-1 h-px bg-gradient-to-r ${colorMap[color] || colorMap.amber}`} />
      <SpiralConnector color={color} size="sm" variant="glow" />
      <div className={`flex-1 h-px bg-gradient-to-r ${colorMap[color] || colorMap.amber}`} />
    </div>
  );
};

export default SpiralConnector;
