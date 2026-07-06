'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TanakaHero - Bannière Hero avec paysage japonais selon le visuel de référence
 * Utilise l'image fournie par l'utilisateur (dojo japonais coucher de soleil)
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
      {/* Background avec l'image fournie par l'utilisateur */}
      <div className="absolute inset-0">
        <Image
          src="/images/backgrounds/japanese-sunset-dojo.jpg"
          alt="Paysage japonais au coucher de soleil"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay gradient pour lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
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
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-orange-500/50 shadow-xl shadow-orange-500/20">
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
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-yellow-200/90 text-sm font-medium">Ton Sensei personnel</span>
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
            className="text-white/80 text-sm mb-4 max-w-md italic"
          >
            &quot;La vraie victoire est la victoire sur soi-même.
            <br />
            Continuez votre chemin vers la maîtrise.&quot;
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
