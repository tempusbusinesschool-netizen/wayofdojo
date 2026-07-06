'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TanakaHero - Bannière Hero avec Maître Tanaka
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Grande bannière horizontale avec :
 * - Décor de dojo japonais
 * - Maître Tanaka
 * - Message de bienvenue
 * - CTA principal
 */

interface TanakaHeroProps {
  userName: string;
  onContinue: () => void;
}

export const TanakaHero: React.FC<TanakaHeroProps> = ({
  userName,
  onContinue,
}) => {
  // Citation du jour (rotation)
  const quotes = [
    "La vraie victoire est la victoire sur soi-même.",
    "Ne cherche pas à suivre les traces des sages ; cherche ce qu'ils cherchaient.",
    "Le but ultime de l'Aïkido est de recevoir une attaque et de la transformer en une danse de paix.",
    "L'Aïkido n'est pas pour corriger les autres, mais pour corriger ton propre esprit.",
    "La force d'un guerrier ne se mesure pas à ses victoires, mais à sa capacité à se relever.",
  ];
  
  const todayQuote = quotes[new Date().getDay() % quotes.length];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl lg:rounded-3xl"
      data-testid="tanaka-hero"
    >
      {/* Background avec gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b31] via-[#111f38] to-[#1a1033]">
        {/* Overlay avec pattern */}
        <div className="absolute inset-0 opacity-20">
          {/* Soleil couchant */}
          <div className="absolute top-4 right-1/4 w-32 h-32 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full blur-3xl opacity-40" />
          {/* Montagnes */}
          <svg className="absolute bottom-0 w-full h-32 opacity-30" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,120 L200,80 L400,100 L600,60 L800,90 L1000,50 L1200,80 L1200,120 Z" fill="#1e293b"/>
          </svg>
        </div>
        {/* Particules/étoiles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="relative flex flex-col lg:flex-row items-center p-6 lg:p-8 gap-6">
        {/* Avatar Tanaka */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative shrink-0"
        >
          <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-2xl overflow-hidden border-2 border-orange-500/30 shadow-xl shadow-orange-500/20">
            <Image
              src="/images/tanaka/portrait.png"
              alt="Maître Tanaka"
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback si l'image n'existe pas
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23334155" width="100" height="100"/><text x="50" y="60" text-anchor="middle" fill="%23f59e0b" font-size="40">🧘</text></svg>';
              }}
            />
          </div>
          {/* Halo */}
          <div className="absolute -inset-2 bg-gradient-to-br from-orange-500/20 to-amber-500/10 rounded-2xl blur-xl -z-10" />
        </motion.div>

        {/* Texte */}
        <div className="flex-1 text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-amber-400/80 text-sm font-medium mb-1"
          >
            Ton Sensei personnel
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl lg:text-3xl font-bold text-white mb-3"
          >
            Maître Tanaka
          </motion.h2>
          
          <motion.blockquote
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-300 text-sm lg:text-base italic mb-4 max-w-xl"
          >
            « {todayQuote} »
            <span className="block mt-2 text-slate-500 text-xs not-italic">
              Continue ton chemin, {userName}.
            </span>
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={onContinue}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:shadow-orange-500/40"
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
