'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AikidoWireframe — ANIMATION FIL DE FER POUR MOUVEMENTS D'AÏKIDO
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Animation stylisée d'un pratiquant d'Aïkido en fil de fer (wireframe)
 * Les mouvements sont fluides et représentent les techniques fondamentales.
 * 
 * Mouvements disponibles:
 * - "irimi" : Entrée directe
 * - "tenkan" : Pivot 180°
 * - "shiho_nage" : Projection 4 directions
 * - "ikkyo" : Premier principe
 * - "kokyu" : Respiration/centrage
 * - "ukemi" : Chute roulée
 */

interface AikidoWireframeProps {
  movement?: 'irimi' | 'tenkan' | 'shiho_nage' | 'ikkyo' | 'kokyu' | 'ukemi' | 'idle';
  size?: number;
  color?: string;
  strokeWidth?: number;
  loop?: boolean;
  speed?: number;
  showGround?: boolean;
  className?: string;
}

// Points du corps pour le personnage fil de fer
const BODY_POINTS = {
  head: { x: 100, y: 30, r: 15 },
  neck: { x: 100, y: 45 },
  shoulder_left: { x: 80, y: 55 },
  shoulder_right: { x: 120, y: 55 },
  chest: { x: 100, y: 55 },
  hip: { x: 100, y: 90 },
  hip_left: { x: 90, y: 90 },
  hip_right: { x: 110, y: 90 },
  knee_left: { x: 85, y: 130 },
  knee_right: { x: 115, y: 130 },
  foot_left: { x: 80, y: 170 },
  foot_right: { x: 120, y: 170 },
  elbow_left: { x: 60, y: 75 },
  elbow_right: { x: 140, y: 75 },
  hand_left: { x: 50, y: 95 },
  hand_right: { x: 150, y: 95 },
};

// Animations pour chaque mouvement
const MOVEMENT_KEYFRAMES = {
  idle: [
    { ...BODY_POINTS },
    {
      ...BODY_POINTS,
      head: { x: 100, y: 28, r: 15 },
      hand_left: { x: 52, y: 93 },
      hand_right: { x: 148, y: 93 },
    },
    { ...BODY_POINTS },
  ],
  
  irimi: [
    { ...BODY_POINTS },
    {
      ...BODY_POINTS,
      head: { x: 115, y: 28, r: 15 },
      chest: { x: 115, y: 53 },
      hip: { x: 110, y: 88 },
      foot_left: { x: 100, y: 170 },
      foot_right: { x: 140, y: 165 },
      hand_left: { x: 85, y: 60 },
      hand_right: { x: 160, y: 70 },
      elbow_left: { x: 75, y: 55 },
      elbow_right: { x: 145, y: 60 },
    },
    {
      ...BODY_POINTS,
      head: { x: 130, y: 30, r: 15 },
      chest: { x: 130, y: 55 },
      hip: { x: 125, y: 90 },
      foot_left: { x: 115, y: 170 },
      foot_right: { x: 155, y: 165 },
      hand_left: { x: 100, y: 55 },
      hand_right: { x: 175, y: 65 },
    },
    { ...BODY_POINTS },
  ],
  
  tenkan: [
    { ...BODY_POINTS },
    {
      ...BODY_POINTS,
      head: { x: 95, y: 30, r: 15 },
      chest: { x: 95, y: 55 },
      shoulder_left: { x: 85, y: 55 },
      shoulder_right: { x: 105, y: 55 },
      hip: { x: 95, y: 90 },
      foot_left: { x: 75, y: 165 },
      foot_right: { x: 110, y: 175 },
      hand_left: { x: 45, y: 80 },
      hand_right: { x: 130, y: 100 },
    },
    {
      ...BODY_POINTS,
      head: { x: 85, y: 32, r: 15 },
      chest: { x: 85, y: 57 },
      shoulder_left: { x: 95, y: 55 },
      shoulder_right: { x: 75, y: 55 },
      hip: { x: 85, y: 92 },
      foot_left: { x: 65, y: 160 },
      foot_right: { x: 95, y: 175 },
      hand_left: { x: 40, y: 70 },
      hand_right: { x: 110, y: 110 },
    },
    { ...BODY_POINTS },
  ],
  
  shiho_nage: [
    { ...BODY_POINTS },
    {
      ...BODY_POINTS,
      head: { x: 100, y: 32, r: 15 },
      hand_left: { x: 80, y: 30 },
      hand_right: { x: 120, y: 30 },
      elbow_left: { x: 75, y: 50 },
      elbow_right: { x: 125, y: 50 },
      knee_left: { x: 80, y: 135 },
      knee_right: { x: 120, y: 125 },
    },
    {
      ...BODY_POINTS,
      head: { x: 105, y: 35, r: 15 },
      chest: { x: 105, y: 58 },
      hand_left: { x: 60, y: 20 },
      hand_right: { x: 140, y: 40 },
      elbow_left: { x: 70, y: 40 },
      elbow_right: { x: 130, y: 55 },
      hip: { x: 105, y: 93 },
      knee_left: { x: 75, y: 140 },
    },
    {
      ...BODY_POINTS,
      head: { x: 110, y: 38, r: 15 },
      chest: { x: 110, y: 60 },
      hand_left: { x: 50, y: 35 },
      hand_right: { x: 160, y: 60 },
      elbow_left: { x: 65, y: 50 },
      elbow_right: { x: 140, y: 60 },
    },
    { ...BODY_POINTS },
  ],
  
  ikkyo: [
    { ...BODY_POINTS },
    {
      ...BODY_POINTS,
      hand_left: { x: 70, y: 50 },
      hand_right: { x: 140, y: 60 },
      elbow_left: { x: 65, y: 65 },
      elbow_right: { x: 135, y: 70 },
      knee_left: { x: 90, y: 125 },
      foot_left: { x: 90, y: 170 },
    },
    {
      ...BODY_POINTS,
      head: { x: 105, y: 32, r: 15 },
      chest: { x: 105, y: 57 },
      hand_left: { x: 60, y: 40 },
      hand_right: { x: 150, y: 50 },
      elbow_left: { x: 55, y: 55 },
      elbow_right: { x: 140, y: 60 },
      hip: { x: 105, y: 92 },
    },
    {
      ...BODY_POINTS,
      head: { x: 108, y: 35, r: 15 },
      chest: { x: 108, y: 60 },
      hand_left: { x: 55, y: 50 },
      hand_right: { x: 160, y: 40 },
    },
    { ...BODY_POINTS },
  ],
  
  kokyu: [
    { ...BODY_POINTS },
    {
      ...BODY_POINTS,
      head: { x: 100, y: 25, r: 16 },
      chest: { x: 100, y: 52 },
      hand_left: { x: 55, y: 85 },
      hand_right: { x: 145, y: 85 },
      elbow_left: { x: 65, y: 70 },
      elbow_right: { x: 135, y: 70 },
    },
    {
      ...BODY_POINTS,
      head: { x: 100, y: 28, r: 15 },
      chest: { x: 100, y: 55 },
      hand_left: { x: 60, y: 75 },
      hand_right: { x: 140, y: 75 },
      elbow_left: { x: 70, y: 65 },
      elbow_right: { x: 130, y: 65 },
    },
    { ...BODY_POINTS },
  ],
  
  ukemi: [
    { ...BODY_POINTS },
    {
      ...BODY_POINTS,
      head: { x: 90, y: 40, r: 15 },
      chest: { x: 90, y: 65 },
      hip: { x: 95, y: 100 },
      hand_left: { x: 60, y: 80 },
      hand_right: { x: 120, y: 70 },
      knee_left: { x: 75, y: 120 },
      foot_left: { x: 65, y: 155 },
    },
    {
      ...BODY_POINTS,
      head: { x: 75, y: 60, r: 15 },
      chest: { x: 80, y: 80 },
      hip: { x: 90, y: 110 },
      hand_left: { x: 50, y: 100 },
      hand_right: { x: 110, y: 85 },
      knee_left: { x: 70, y: 130 },
      knee_right: { x: 105, y: 140 },
      foot_left: { x: 60, y: 160 },
      foot_right: { x: 115, y: 170 },
    },
    {
      ...BODY_POINTS,
      head: { x: 70, y: 90, r: 15 },
      chest: { x: 80, y: 105 },
      hip: { x: 100, y: 120 },
      shoulder_left: { x: 65, y: 100 },
      shoulder_right: { x: 95, y: 110 },
      hand_left: { x: 45, y: 120 },
      hand_right: { x: 130, y: 100 },
      knee_left: { x: 80, y: 145 },
      foot_left: { x: 70, y: 170 },
    },
    { ...BODY_POINTS },
  ],
};

export const AikidoWireframe: React.FC<AikidoWireframeProps> = ({
  movement = 'idle',
  size = 200,
  color = '#E5A823',
  strokeWidth = 2.5,
  loop = true,
  speed = 1,
  showGround = true,
  className = '',
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const frames = MOVEMENT_KEYFRAMES[movement] || MOVEMENT_KEYFRAMES.idle;
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const animate = () => {
      interval = setInterval(() => {
        setCurrentFrame((prev) => {
          const next = prev + 1;
          if (next >= frames.length) {
            return loop ? 0 : prev;
          }
          return next;
        });
      }, 800 / speed);
    };
    
    animate();
    return () => clearInterval(interval);
  }, [frames.length, loop, speed, movement]);

  const frame = frames[currentFrame] || frames[0];

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className="overflow-visible"
      >
        {/* Effet de lueur */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Sol */}
        {showGround && (
          <motion.line
            x1="30"
            y1="180"
            x2="170"
            y2="180"
            stroke={color}
            strokeWidth={1}
            strokeOpacity={0.3}
            strokeDasharray="5,5"
          />
        )}

        {/* Ombre */}
        <motion.ellipse
          cx={frame.hip?.x || 100}
          cy="178"
          rx="25"
          ry="5"
          fill={color}
          fillOpacity={0.15}
          animate={{
            cx: frame.hip?.x || 100,
            rx: movement === 'ukemi' ? 35 : 25,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Corps - Torse */}
        <motion.line
          stroke="url(#wireGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#glow)"
          animate={{
            x1: frame.chest?.x || 100,
            y1: frame.chest?.y || 55,
            x2: frame.hip?.x || 100,
            y2: frame.hip?.y || 90,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Cou */}
        <motion.line
          stroke="url(#wireGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#glow)"
          animate={{
            x1: frame.head?.x || 100,
            y1: (frame.head?.y || 30) + (frame.head?.r || 15),
            x2: frame.chest?.x || 100,
            y2: frame.chest?.y || 55,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Épaules */}
        <motion.line
          stroke="url(#wireGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#glow)"
          animate={{
            x1: frame.shoulder_left?.x || 80,
            y1: frame.shoulder_left?.y || 55,
            x2: frame.shoulder_right?.x || 120,
            y2: frame.shoulder_right?.y || 55,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Bras gauche - épaule à coude */}
        <motion.line
          stroke="url(#wireGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#glow)"
          animate={{
            x1: frame.shoulder_left?.x || 80,
            y1: frame.shoulder_left?.y || 55,
            x2: frame.elbow_left?.x || 60,
            y2: frame.elbow_left?.y || 75,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Bras gauche - coude à main */}
        <motion.line
          stroke="url(#wireGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#glow)"
          animate={{
            x1: frame.elbow_left?.x || 60,
            y1: frame.elbow_left?.y || 75,
            x2: frame.hand_left?.x || 50,
            y2: frame.hand_left?.y || 95,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Bras droit - épaule à coude */}
        <motion.line
          stroke="url(#wireGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#glow)"
          animate={{
            x1: frame.shoulder_right?.x || 120,
            y1: frame.shoulder_right?.y || 55,
            x2: frame.elbow_right?.x || 140,
            y2: frame.elbow_right?.y || 75,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Bras droit - coude à main */}
        <motion.line
          stroke="url(#wireGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#glow)"
          animate={{
            x1: frame.elbow_right?.x || 140,
            y1: frame.elbow_right?.y || 75,
            x2: frame.hand_right?.x || 150,
            y2: frame.hand_right?.y || 95,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Hanches */}
        <motion.line
          stroke="url(#wireGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#glow)"
          animate={{
            x1: frame.hip_left?.x || 90,
            y1: frame.hip_left?.y || 90,
            x2: frame.hip_right?.x || 110,
            y2: frame.hip_right?.y || 90,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Jambe gauche - hanche à genou */}
        <motion.line
          stroke="url(#wireGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#glow)"
          animate={{
            x1: frame.hip_left?.x || 90,
            y1: frame.hip_left?.y || 90,
            x2: frame.knee_left?.x || 85,
            y2: frame.knee_left?.y || 130,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Jambe gauche - genou à pied */}
        <motion.line
          stroke="url(#wireGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#glow)"
          animate={{
            x1: frame.knee_left?.x || 85,
            y1: frame.knee_left?.y || 130,
            x2: frame.foot_left?.x || 80,
            y2: frame.foot_left?.y || 170,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Jambe droite - hanche à genou */}
        <motion.line
          stroke="url(#wireGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#glow)"
          animate={{
            x1: frame.hip_right?.x || 110,
            y1: frame.hip_right?.y || 90,
            x2: frame.knee_right?.x || 115,
            y2: frame.knee_right?.y || 130,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Jambe droite - genou à pied */}
        <motion.line
          stroke="url(#wireGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#glow)"
          animate={{
            x1: frame.knee_right?.x || 115,
            y1: frame.knee_right?.y || 130,
            x2: frame.foot_right?.x || 120,
            y2: frame.foot_right?.y || 170,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Tête */}
        <motion.circle
          fill="none"
          stroke="url(#wireGradient)"
          strokeWidth={strokeWidth}
          filter="url(#glow)"
          animate={{
            cx: frame.head?.x || 100,
            cy: frame.head?.y || 30,
            r: frame.head?.r || 15,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Points d'articulation - mains */}
        <motion.circle
          fill={color}
          r={4}
          filter="url(#glow)"
          animate={{
            cx: frame.hand_left?.x || 50,
            cy: frame.hand_left?.y || 95,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        <motion.circle
          fill={color}
          r={4}
          filter="url(#glow)"
          animate={{
            cx: frame.hand_right?.x || 150,
            cy: frame.hand_right?.y || 95,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Points d'articulation - pieds */}
        <motion.circle
          fill={color}
          r={3}
          filter="url(#glow)"
          animate={{
            cx: frame.foot_left?.x || 80,
            cy: frame.foot_left?.y || 170,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        <motion.circle
          fill={color}
          r={3}
          filter="url(#glow)"
          animate={{
            cx: frame.foot_right?.x || 120,
            cy: frame.foot_right?.y || 170,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </svg>

      {/* Indicateur de mouvement */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-center">
        <span style={{ color }} className="font-mono uppercase tracking-wider opacity-60">
          {movement !== 'idle' ? movement.replace('_', ' ') : ''}
        </span>
      </div>
    </div>
  );
};

export default AikidoWireframe;
