'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TanakaHero - Bannière Hero avec paysage japonais selon le visuel de référence
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface TanakaHeroProps {
  userName: string;
  onContinue: () => void;
}

export const TanakaHero: React.FC<TanakaHeroProps> = ({
  userName: _userName,
  onContinue,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl h-[220px]"
      data-testid="tanaka-hero"
    >
      {/* Background avec paysage japonais coucher de soleil */}
      <div className="absolute inset-0">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a2e] via-[#2d1810] to-[#4a2000]" />
        
        {/* Soleil couchant */}
        <div className="absolute right-1/4 top-1/3 w-24 h-24 bg-gradient-to-b from-orange-400 via-orange-500 to-red-500 rounded-full blur-sm opacity-90" />
        
        {/* Silhouettes de montagnes */}
        <svg className="absolute bottom-0 w-full h-32 opacity-60" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,120 L100,70 L250,90 L400,50 L550,80 L700,40 L850,70 L1000,30 L1150,60 L1200,50 L1200,120 Z" fill="#1a0a1e"/>
        </svg>
        
        {/* Torii gate silhouette (gauche) */}
        <div className="absolute left-8 bottom-4 opacity-30">
          <svg width="60" height="80" viewBox="0 0 60 80" fill="#1a0a1e">
            <rect x="5" y="20" width="6" height="60"/>
            <rect x="49" y="20" width="6" height="60"/>
            <rect x="0" y="10" width="60" height="8"/>
            <rect x="2" y="22" width="56" height="4"/>
          </svg>
        </div>
        
        {/* Reflet sur l'eau */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-orange-500/10 to-transparent" />
      </div>

      {/* Contenu */}
      <div className="relative h-full flex items-center px-8">
        {/* Avatar Tanaka */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative shrink-0 mr-6"
        >
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden">
            <Image
              src="/images/tanaka/portrait.png"
              alt="Maître Tanaka"
              fill
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23334155" width="100" height="100"/><text x="50" y="60" text-anchor="middle" fill="%23f59e0b" font-size="40">🧘</text></svg>';
              }}
            />
          </div>
        </motion.div>

        {/* Texte */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mb-2"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-green-400 text-sm font-medium">Ton Sensei personnel</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white mb-3"
          >
            Maître Tanaka
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 text-sm mb-4 max-w-md"
          >
            "La vraie victoire est la victoire sur soi-même.
            <br />
            Continue ton chemin, jeune Samouraï !"
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={onContinue}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold px-6 py-2.5 rounded-full shadow-lg shadow-orange-500/30"
              data-testid="hero-continue-btn"
            >
              Continuer ma progression
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default TanakaHero;
