'use client';

import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { Lock, Gamepad2, Trophy, Sparkles, Target, ScrollText, BarChart3 } from 'lucide-react';

interface ChooseModeProps {
  onModeSelect?: (mode: 'enfant' | 'adulte') => void;
}

export default function ChooseMode({ onModeSelect }: ChooseModeProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'fr';

  const handleModeClick = (mode: 'enfant' | 'adulte') => {
    // Save mode preference to localStorage
    localStorage.setItem('wayofdojo_mode', mode);
    
    if (onModeSelect) {
      onModeSelect(mode);
    }
    
    // Redirect to register page with mode
    router.push(`/${locale}/aikido/register?mode=${mode}`);
  };

  return (
    <div className="w-full py-8 px-4" data-testid="choose-mode">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
          Choisis ton mode pour commencer !
        </h2>
        <p className="text-slate-400">Tu pourras changer à tout moment 🥋</p>
      </motion.div>

      {/* Mode Cards */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8">
        {/* Jeune Samouraï Card */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleModeClick('enfant')}
          className="group relative overflow-hidden rounded-3xl border-2 border-amber-500/50 hover:border-amber-400 transition-all duration-300 shadow-xl hover:shadow-amber-500/30"
          data-testid="mode-jeune-samourai"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/90 via-orange-800/80 to-amber-950/90" />
          
          {/* Radial glow behind character */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 bg-gradient-radial from-amber-500/40 via-orange-400/20 to-transparent rounded-full blur-2xl" />
          </div>
          
          {/* AI Badge */}
          <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <span>Agent IA</span>
            <span>✨⭐</span>
          </div>

          {/* Content */}
          <div className="relative z-10 p-6">
            {/* Character Area with Emoji */}
            <div className="relative h-44 md:h-52 mb-4 flex items-center justify-center">
              {/* Stars decoration */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-2 left-8 text-amber-400 text-2xl drop-shadow-lg"
              >
                ⭐
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-6 right-10 text-amber-300 text-xl drop-shadow-lg"
              >
                ⭐
              </motion.div>
              
              {/* Main Character Emoji */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-8xl md:text-9xl drop-shadow-2xl"
              >
                🥷
              </motion.div>
            </div>

            {/* Title Section */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 -mx-2 shadow-lg">
              <h3 className="text-xl md:text-2xl font-black text-white mb-1">
                Jeune Samouraï
              </h3>
              <p className="text-amber-100 text-sm font-medium">
                Moins de 14 ans
              </p>

              {/* Icons */}
              <div className="flex justify-center gap-4 mt-3">
                <div className="w-10 h-10 bg-violet-600/90 rounded-xl flex items-center justify-center shadow-md">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-amber-600/90 rounded-xl flex items-center justify-center shadow-md">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-emerald-600/90 rounded-xl flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Tanaka hint */}
          <div className="absolute bottom-3 right-3 z-10 text-xs text-amber-200/80 flex items-center gap-1">
            <span>Maître Tanaka</span>
            <span className="bg-amber-500/30 px-2 py-0.5 rounded-full border border-amber-400/30">Parle-moi !</span>
          </div>
        </motion.button>

        {/* Samouraï Confirmé Card */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleModeClick('adulte')}
          className="group relative overflow-hidden rounded-3xl border-2 border-slate-500/50 hover:border-cyan-400/70 transition-all duration-300 shadow-xl hover:shadow-cyan-500/20"
          data-testid="mode-samourai-confirme"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/95 via-slate-700/90 to-slate-900/95" />
          
          {/* Radial glow behind character */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 bg-gradient-radial from-cyan-500/20 via-blue-400/10 to-transparent rounded-full blur-2xl" />
          </div>
          
          {/* AI Badge */}
          <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <span>Agent IA</span>
            <span>☯️🥋</span>
          </div>

          {/* Content */}
          <div className="relative z-10 p-6">
            {/* Character Area with Emoji */}
            <div className="relative h-44 md:h-52 mb-4 flex items-center justify-center">
              {/* Main Character Emojis - couple */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-end gap-2"
              >
                <span className="text-7xl md:text-8xl drop-shadow-2xl">🧑‍🦱</span>
                <span className="text-7xl md:text-8xl drop-shadow-2xl">👩</span>
              </motion.div>
            </div>

            {/* Title Section */}
            <div className="bg-gradient-to-r from-slate-600 to-slate-500 rounded-2xl p-4 -mx-2 shadow-lg">
              <h3 className="text-xl md:text-2xl font-black text-white mb-1">
                Samouraï Confirmé
              </h3>
              <p className="text-slate-200 text-sm font-medium">
                Plus de 14 ans
              </p>

              {/* Icons */}
              <div className="flex justify-center gap-4 mt-3">
                <div className="w-10 h-10 bg-cyan-600/90 rounded-xl flex items-center justify-center shadow-md">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-blue-600/90 rounded-xl flex items-center justify-center shadow-md">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-indigo-600/90 rounded-xl flex items-center justify-center shadow-md">
                  <ScrollText className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Privacy Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-center gap-2 mt-6 text-slate-500 text-sm"
      >
        <Lock className="w-4 h-4" />
        <span>Aucune donnée personnelle n&apos;est collectée. Ton choix est enregistré uniquement sur ton appareil.</span>
      </motion.div>
    </div>
  );
}
