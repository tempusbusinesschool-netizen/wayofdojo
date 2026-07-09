'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Home, Flame, Trophy, Medal } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * JuniorPageLayout - Layout coloré et ludique pour les pages du mode enfant
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Style: Gaming RPG avec fond orange/ambre dégradé
 */

interface JuniorPageLayoutProps {
  children: ReactNode;
  locale: string;
  sport: string;
  title: string;
  subtitle?: string;
  emoji?: string;
  showBackButton?: boolean;
  userName?: string;
  userXp?: number;
  userLevel?: number;
  userStreak?: number;
}

export const JuniorPageLayout: React.FC<JuniorPageLayoutProps> = ({
  children,
  locale,
  sport,
  title,
  subtitle,
  emoji = '🎮',
  showBackButton = true,
  userName: _userName = 'Samouraï',
  userXp = 0,
  userLevel = 1,
  userStreak = 0,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 relative overflow-hidden">
      {/* Motifs décoratifs en arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-9xl">🏯</div>
        <div className="absolute top-1/4 right-10 text-8xl">⛩️</div>
        <div className="absolute bottom-20 left-1/4 text-7xl">🎋</div>
        <div className="absolute bottom-10 right-1/3 text-8xl">🌸</div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Navigation */}
            <div className="flex items-center gap-4">
              {showBackButton && (
                <Link 
                  href={`/${locale}/${sport}/dojo`}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">Retour</span>
                </Link>
              )}
              <Link href={`/${locale}/${sport}/dojo`} className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block">
                  <h1 className="text-white font-bold">WayofDojo</h1>
                  <p className="text-white/60 text-xs">Mode Jeune Samouraï 🥷</p>
                </div>
              </Link>
            </div>

            {/* Right: User Stats */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                <Flame className="w-4 h-4 text-orange-300" />
                <span className="text-white text-sm font-bold">{userStreak}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                <Trophy className="w-4 h-4 text-yellow-300" />
                <span className="text-white text-sm font-bold">Nv.{userLevel}</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                <Medal className="w-4 h-4 text-amber-300" />
                <span className="text-white text-sm font-bold">{userXp} XP</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page Title */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-6 pb-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <span className="text-5xl mb-2 block">{emoji}</span>
          <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/80 mt-2 text-lg">{subtitle}</p>
          )}
        </motion.div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Floating Tanaka Button */}
      <Link 
        href={`/${locale}/${sport}/dojo`}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-xl flex items-center justify-center border-4 border-white/30"
        >
          <span className="text-2xl">🏠</span>
        </motion.div>
      </Link>
    </div>
  );
};

export default JuniorPageLayout;
