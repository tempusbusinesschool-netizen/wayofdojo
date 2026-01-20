'use client';

import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { Lock } from 'lucide-react';
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
      {/* Titre */}
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

      {/* Mode Cards - Réduites de 20% */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4 md:gap-5">
        
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* CARTE GAUCHE — Jeune Samouraï */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleModeClick('enfant')}
          className="group relative overflow-hidden rounded-[1.25rem] transition-all duration-300"
          style={{
            boxShadow: '0 0 25px rgba(255, 215, 0, 0.5), inset 0 0 0 2px rgba(255, 215, 0, 0.8)'
          }}
          data-testid="mode-jeune-samourai"
        >
          {/* Image du personnage 3D avec fond intégré */}
          <div className="relative aspect-[4/5] w-full">
            <Image
              src="/images/modes/enfant.png"
              alt="Jeune Samouraï"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Section jaune/dorée du bas - UI overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-500 via-amber-500 to-amber-500/95 pt-3 pb-3 px-3">
            {/* Titre */}
            <h3 className="text-xl md:text-2xl font-black text-white drop-shadow-md text-center">
              Jeune Samouraï
            </h3>
            
            {/* Sous-titre */}
            <p className="text-amber-100 text-xs font-medium text-center mb-2">
              Moins de 14 ans
            </p>

            {/* 3 Icônes ludiques */}
            <div className="flex justify-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-sm">🎮</span>
              </div>
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-sm">🏆</span>
              </div>
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-sm">🐉</span>
              </div>
            </div>
          </div>
        </motion.button>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* CARTE DROITE — Samouraï Confirmé */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleModeClick('adulte')}
          className="group relative overflow-hidden rounded-[1.25rem] transition-all duration-300"
          style={{
            boxShadow: '0 0 15px rgba(100, 116, 139, 0.4), inset 0 0 0 2px rgba(148, 163, 184, 0.5)'
          }}
          data-testid="mode-samourai-confirme"
        >
          {/* Image du couple 3D avec fond intégré */}
          <div className="relative aspect-[4/5] w-full">
            <Image
              src="/images/modes/adultes.png"
              alt="Samouraï Confirmé"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Section du bas - UI overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-700 via-slate-700 to-slate-700/95 pt-3 pb-3 px-3">
            {/* Titre */}
            <h3 className="text-xl md:text-2xl font-black text-white drop-shadow-md text-center">
              Samouraï Confirmé
            </h3>
            
            {/* Sous-titre */}
            <p className="text-slate-300 text-xs font-medium text-center mb-2">
              Plus de 14 ans
            </p>

            {/* 3 Icônes analytiques */}
            <div className="flex justify-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-sm">📊</span>
              </div>
              <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-sm">🎯</span>
              </div>
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-sm">📜</span>
              </div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Message de confidentialité */}
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
