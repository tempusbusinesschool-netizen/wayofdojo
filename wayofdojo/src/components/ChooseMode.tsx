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

      {/* Mode Cards - Reproduction FIDÈLE de l'interface de référence */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4 md:gap-6">
        
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* CARTE GAUCHE — Jeune Samouraï (identique à la référence) */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleModeClick('enfant')}
          className="group relative overflow-hidden rounded-[1.5rem] transition-all duration-300"
          style={{
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 0 3px rgba(255, 215, 0, 0.9)'
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
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-500 via-amber-500 to-amber-500/95 pt-4 pb-4 px-4">
            {/* Titre */}
            <h3 className="text-2xl md:text-3xl font-black text-white drop-shadow-md text-center">
              Jeune Samouraï
            </h3>
            
            {/* Sous-titre */}
            <p className="text-amber-100 text-sm font-medium text-center mb-3">
              Moins de 14 ans
            </p>

            {/* 3 Icônes ludiques */}
            <div className="flex justify-center gap-2 mb-3">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg">🎮</span>
              </div>
              <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg">🏆</span>
              </div>
              <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg">🐉</span>
              </div>
            </div>

            {/* Badge "Parle-moi !" avec avatar Tanaka */}
            <div className="flex justify-center items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/80 shadow-lg bg-orange-500">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/tanaka/portrait.png" 
                  alt="Maître Tanaka"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                Parle-moi !
              </span>
            </div>
          </div>
        </motion.button>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* CARTE DROITE — Samouraï Confirmé (identique à la référence) */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleModeClick('adulte')}
          className="group relative overflow-hidden rounded-[1.5rem] transition-all duration-300"
          style={{
            boxShadow: '0 0 20px rgba(100, 116, 139, 0.4), inset 0 0 0 2px rgba(148, 163, 184, 0.5)'
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
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-700 via-slate-700 to-slate-700/95 pt-4 pb-4 px-4">
            {/* Titre */}
            <h3 className="text-2xl md:text-3xl font-black text-white drop-shadow-md text-center">
              Samouraï Confirmé
            </h3>
            
            {/* Sous-titre */}
            <p className="text-slate-300 text-sm font-medium text-center mb-3">
              Plus de 14 ans
            </p>

            {/* 3 Icônes analytiques */}
            <div className="flex justify-center gap-2">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg">📊</span>
              </div>
              <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg">🎯</span>
              </div>
              <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg">📜</span>
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
