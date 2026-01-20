'use client';

import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { Lock, Gamepad2, Trophy, Sparkles, BarChart3, Target, ScrollText } from 'lucide-react';
import Image from 'next/image';

interface ChooseModeProps {
  onModeSelect?: (mode: 'enfant' | 'adulte') => void;
}

export default function ChooseMode({ onModeSelect }: ChooseModeProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'fr';

  const handleModeClick = (mode: 'enfant' | 'adulte') => {
    localStorage.setItem('wayofdojo_mode', mode);
    if (onModeSelect) {
      onModeSelect(mode);
    }
    router.push(`/${locale}/aikido/register?mode=${mode}`);
  };

  return (
    <div className="w-full py-2 px-4" data-testid="choose-mode">
      {/* Titre - Identique à l'original */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h2 className="text-2xl md:text-3xl font-black text-white mb-1">
          Choisis ton mode pour commencer !
        </h2>
        <p className="text-slate-400 text-sm">Tu pourras changer à tout moment 🥋</p>
      </motion.div>

      {/* Mode Cards - Design EXACT de Aikido@Game */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4 md:gap-6">
        
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* CARTE JEUNE NINJA - Design identique à l'original */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleModeClick('enfant')}
          className="group relative overflow-hidden rounded-3xl border-2 border-amber-500/60 hover:border-amber-400 transition-all duration-300 shadow-2xl hover:shadow-amber-500/30"
          data-testid="mode-jeune-samourai"
        >
          {/* Background - Dégradé identique à l'original */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-700/95 via-orange-600/90 to-amber-800/95" />
          
          {/* Glow effect */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-400/40 rounded-full blur-3xl" />
          
          {/* Badge Agent IA - Position identique */}
          <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
            <span>Jeune Samouraï - Agent IA</span>
            <span>✨⭐</span>
          </div>

          {/* Contenu */}
          <div className="relative z-10 p-4 pt-14">
            {/* Étoiles décoratives - Identiques à l'original */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-16 left-6 text-amber-300 text-2xl drop-shadow-lg"
            >
              ⭐
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              className="absolute top-20 right-8 text-amber-200 text-xl drop-shadow-lg"
            >
              ⭐
            </motion.div>

            {/* Image du personnage enfant - EXACTE */}
            <div className="relative h-48 md:h-56 flex items-center justify-center mb-2">
              <Image
                src="/images/modes/enfant.png"
                alt="Jeune Samouraï"
                width={220}
                height={280}
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>

            {/* Titre et sous-titre - Design identique */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 shadow-xl">
              <h3 className="text-xl md:text-2xl font-black text-white mb-0.5">
                Jeune Samouraï
              </h3>
              <p className="text-amber-100 text-sm font-medium mb-3">
                Moins de 14 ans
              </p>

              {/* 3 Icônes - Identiques à l'original */}
              <div className="flex justify-center gap-3">
                <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Maître Tanaka - Parle-moi ! - Position identique */}
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-400/50 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/tanaka/portrait.png" 
                alt="Maître Tanaka"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="bg-amber-500/40 text-amber-100 text-xs font-medium px-2 py-1 rounded-full border border-amber-400/40">
              Parle-moi !
            </span>
          </div>
        </motion.button>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* CARTE NINJA CONFIRMÉ - Design identique à l'original */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleModeClick('adulte')}
          className="group relative overflow-hidden rounded-3xl border-2 border-slate-500/60 hover:border-cyan-400/70 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/20"
          data-testid="mode-samourai-confirme"
        >
          {/* Background - Dégradé identique à l'original */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-700/95 via-slate-600/90 to-slate-800/95" />
          
          {/* Fleurs de cerisier - Identiques à l'original */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-30">
            <div className="absolute top-4 right-8 text-pink-300 text-lg">🌸</div>
            <div className="absolute top-12 right-4 text-pink-200 text-sm">🌸</div>
            <div className="absolute top-8 right-16 text-pink-300 text-xs">🌸</div>
          </div>
          <div className="absolute top-0 left-0 w-32 h-32 opacity-30">
            <div className="absolute top-6 left-6 text-pink-300 text-sm">🌸</div>
            <div className="absolute top-14 left-12 text-pink-200 text-xs">🌸</div>
          </div>
          
          {/* Badge Agent IA - Position identique */}
          <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
            <span>Samouraï Confirmé - Agent IA</span>
            <span>☯️🥋</span>
          </div>

          {/* Contenu */}
          <div className="relative z-10 p-4 pt-14">
            {/* Image du couple adulte - EXACTE */}
            <div className="relative h-48 md:h-56 flex items-center justify-center mb-2">
              <Image
                src="/images/modes/adultes.png"
                alt="Samouraï Confirmé"
                width={260}
                height={280}
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>

            {/* Titre et sous-titre - Design identique */}
            <div className="bg-gradient-to-r from-slate-600 to-slate-500 rounded-2xl p-4 shadow-xl">
              <h3 className="text-xl md:text-2xl font-black text-white mb-0.5">
                Samouraï Confirmé
              </h3>
              <p className="text-slate-200 text-sm font-medium mb-3">
                Plus de 14 ans
              </p>

              {/* 3 Icônes - Identiques à l'original */}
              <div className="flex justify-center gap-3">
                <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ScrollText className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Message de confidentialité - Identique à l'original */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-center gap-2 mt-4 text-slate-500 text-sm"
      >
        <Lock className="w-4 h-4" />
        <span>Aucune donnée personnelle n&apos;est collectée. Ton choix est enregistré uniquement sur ton appareil.</span>
      </motion.div>
    </div>
  );
}
