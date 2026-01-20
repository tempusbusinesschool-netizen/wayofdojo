'use client';

import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { Lock, Gamepad2, Trophy, Sparkles, Target, ScrollText, BarChart3 } from 'lucide-react';
import Image from 'next/image';

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
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900/80 via-orange-800/60 to-amber-950/80 border-2 border-amber-500/50 hover:border-amber-400 transition-all duration-300 shadow-xl hover:shadow-amber-500/30"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* AI Badge */}
          <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <span>Agent IA</span>
            <span>✨⭐</span>
          </div>

          {/* Content */}
          <div className="relative p-6">
            {/* Character Image */}
            <div className="relative h-48 md:h-56 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-radial from-amber-400/30 to-transparent rounded-full blur-2xl" />
              <Image
                src="/images/modes/jeune-samourai.png"
                alt="Jeune Samouraï"
                width={200}
                height={200}
                className="relative z-10 object-contain max-h-full drop-shadow-2xl"
              />
              {/* Stars decoration */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-2 left-4 text-amber-400 text-xl"
              >
                ⭐
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-4 right-8 text-amber-300 text-lg"
              >
                ⭐
              </motion.div>
            </div>

            {/* Title Section */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 -mx-2">
              <h3 className="text-xl md:text-2xl font-black text-white mb-1">
                Jeune Samouraï
              </h3>
              <p className="text-amber-100 text-sm">
                Moins de 14 ans
              </p>

              {/* Icons */}
              <div className="flex justify-center gap-4 mt-3">
                <div className="w-10 h-10 bg-violet-600/80 rounded-xl flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-amber-600/80 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-emerald-600/80 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Tanaka hint */}
          <div className="absolute bottom-2 right-2 text-xs text-amber-300/60 flex items-center gap-1">
            <span>Maître Tanaka</span>
            <span className="bg-amber-500/20 px-2 py-0.5 rounded-full">Parle-moi !</span>
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
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/80 via-slate-700/60 to-slate-900/80 border-2 border-slate-500/50 hover:border-cyan-400/70 transition-all duration-300 shadow-xl hover:shadow-cyan-500/20"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* AI Badge */}
          <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <span>Agent IA</span>
            <span>☯️🥋</span>
          </div>

          {/* Content */}
          <div className="relative p-6">
            {/* Character Image */}
            <div className="relative h-48 md:h-56 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-radial from-cyan-400/20 to-transparent rounded-full blur-2xl" />
              <Image
                src="/images/modes/samourai-confirme.png"
                alt="Samouraï Confirmé"
                width={200}
                height={200}
                className="relative z-10 object-contain max-h-full drop-shadow-2xl"
              />
            </div>

            {/* Title Section */}
            <div className="bg-gradient-to-r from-slate-600 to-slate-500 rounded-2xl p-4 -mx-2">
              <h3 className="text-xl md:text-2xl font-black text-white mb-1">
                Samouraï Confirmé
              </h3>
              <p className="text-slate-200 text-sm">
                Plus de 14 ans
              </p>

              {/* Icons */}
              <div className="flex justify-center gap-4 mt-3">
                <div className="w-10 h-10 bg-cyan-600/80 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-blue-600/80 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-indigo-600/80 rounded-xl flex items-center justify-center">
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
