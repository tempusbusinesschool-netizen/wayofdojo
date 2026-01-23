'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface TanakaAnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'glow' | 'breathing' | 'bounce';
  onClick?: () => void;
  isActive?: boolean;
  showAura?: boolean;
}

const sizeConfig = {
  sm: { container: 'w-12 h-12', text: 'text-2xl', aura: 'w-16 h-16' },
  md: { container: 'w-16 h-16', text: 'text-3xl', aura: 'w-20 h-20' },
  lg: { container: 'w-24 h-24', text: 'text-5xl', aura: 'w-32 h-32' },
  xl: { container: 'w-32 h-32', text: 'text-6xl', aura: 'w-40 h-40' },
};

export function TanakaAnimatedLogo({
  size = 'md',
  variant = 'default',
  onClick,
  isActive = false,
  showAura = true,
}: TanakaAnimatedLogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const config = sizeConfig[size];

  // Animation variants
  const containerVariants = {
    default: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: {
        rotate: {
          duration: 0.5,
          ease: 'easeInOut',
        },
      },
    },
    tap: {
      scale: 0.95,
    },
    active: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const glowVariants = {
    initial: {
      boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)',
    },
    animate: {
      boxShadow: [
        '0 0 20px rgba(245, 158, 11, 0.3)',
        '0 0 40px rgba(245, 158, 11, 0.6)',
        '0 0 60px rgba(245, 158, 11, 0.4)',
        '0 0 20px rgba(245, 158, 11, 0.3)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const breathingVariants = {
    animate: {
      scale: [1, 1.08, 1],
      opacity: [1, 0.9, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const bounceVariants = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const auraVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: [1, 1.3, 1],
      opacity: [0.5, 0, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeOut',
      },
    },
  };

  const sparkleVariants = {
    animate: (i: number) => ({
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      x: Math.cos((i * 60 * Math.PI) / 180) * 40,
      y: Math.sin((i * 60 * Math.PI) / 180) * 40,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        delay: i * 0.2,
        repeatDelay: 1,
      },
    }),
  };

  const getVariantAnimation = () => {
    switch (variant) {
      case 'glow':
        return glowVariants;
      case 'breathing':
        return breathingVariants;
      case 'bounce':
        return bounceVariants;
      default:
        return {};
    }
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Aura effect */}
      {showAura && (isActive || isHovered) && (
        <motion.div
          className={`absolute ${config.aura} rounded-full bg-gradient-to-r from-amber-500/30 to-orange-500/30`}
          variants={auraVariants}
          initial="initial"
          animate="animate"
        />
      )}

      {/* Sparkles */}
      {(isActive || isHovered) && (
        <>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-amber-400"
              custom={i}
              variants={sparkleVariants}
              animate="animate"
              style={{
                left: '50%',
                top: '50%',
                marginLeft: '-4px',
                marginTop: '-4px',
              }}
            />
          ))}
        </>
      )}

      {/* Main container */}
      <motion.div
        className={`relative ${config.container} rounded-full cursor-pointer overflow-hidden`}
        variants={containerVariants}
        initial="default"
        animate={isActive ? 'active' : 'default'}
        whileHover="hover"
        whileTap="tap"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Gradient background with animation */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600"
          variants={getVariantAnimation()}
          initial="initial"
          animate="animate"
        />

        {/* Inner glow */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-400/50 to-transparent" />

        {/* Rotating border */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.5) 10%, transparent 20%)',
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}

        {/* Tanaka emoji/icon */}
        <motion.div
          className={`absolute inset-0 flex items-center justify-center ${config.text}`}
          animate={
            isHovered
              ? {
                  scale: [1, 1.2, 1],
                  transition: { duration: 0.3 },
                }
              : {}
          }
        >
          🧙‍♂️
        </motion.div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
          }}
          animate={{
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Kanji decoration (optional for larger sizes) */}
      {(size === 'lg' || size === 'xl') && (
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-amber-400/60 text-sm font-bold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          先生
        </motion.div>
      )}
    </div>
  );
}

export default TanakaAnimatedLogo;
