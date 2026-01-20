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
        className="text-center mb-3"
      >
        <h2 className="text-xl md:text-2xl font-black text-white mb-1">
          Choisis ton mode pour commencer !
        </h2>
        <p className="text-slate-400 text-xs">Tu pourras changer à tout moment 🥋</p>
      </motion.div>

      {/* Mode Cards - Réduites de 40% au total */}
      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-3 md:gap-4">
        
        {/* CARTE GAUCHE — Jeune Samouraï */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleModeClick('enfant')}
          className="group relative overflow-hidden rounded-xl transition-all duration-300"
          style={{
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.5), inset 0 0 0 2px rgba(255, 215, 0, 0.8)'
          }}
          data-testid="mode-jeune-samourai"
        >
          {/* Image du personnage 3D - Réduit de 15% */}
          <div className="relative aspect-[4/5] w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-amber-400 via-orange-400 to-amber-500">
            <div className="relative w-[85%] h-[85%]">
              <Image
                src="/images/modes/enfant.png"
                alt="Jeune Samouraï"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Section jaune/dorée du bas */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-500 via-amber-500 to-amber-500/95 pt-2 pb-2 px-2">
            <h3 className="text-lg md:text-xl font-black text-white drop-shadow-md text-center">
              Jeune Samouraï
            </h3>
            <p className="text-amber-100 text-[10px] font-medium text-center mb-1.5">
              Moins de 14 ans
            </p>
            <div className="flex justify-center gap-1.5">
              <div className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center shadow">
                <span className="text-xs">🎮</span>
              </div>
              <div className="w-6 h-6 bg-amber-600 rounded-md flex items-center justify-center shadow">
                <span className="text-xs">🏆</span>
              </div>
              <div className="w-6 h-6 bg-teal-500 rounded-md flex items-center justify-center shadow">
                <span className="text-xs">🐉</span>
              </div>
            </div>
          </div>
        </motion.button>

        {/* CARTE DROITE — Samouraï Confirmé */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleModeClick('adulte')}
          className="group relative overflow-hidden rounded-xl transition-all duration-300"
          style={{
            boxShadow: '0 0 12px rgba(100, 116, 139, 0.4), inset 0 0 0 2px rgba(148, 163, 184, 0.5)'
          }}
          data-testid="mode-samourai-confirme"
        >
          {/* Image du couple 3D */}
          <div className="relative aspect-[4/5] w-full">
            <Image
              src="/images/modes/adultes.png"
              alt="Samouraï Confirmé"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Section du bas */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-700 via-slate-700 to-slate-700/95 pt-2 pb-2 px-2">
            <h3 className="text-lg md:text-xl font-black text-white drop-shadow-md text-center">
              Samouraï Confirmé
            </h3>
            <p className="text-slate-300 text-[10px] font-medium text-center mb-1.5">
              Plus de 14 ans
            </p>
            <div className="flex justify-center gap-1.5">
              <div className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center shadow">
                <span className="text-xs">📊</span>
              </div>
              <div className="w-6 h-6 bg-pink-500 rounded-md flex items-center justify-center shadow">
                <span className="text-xs">🎯</span>
              </div>
              <div className="w-6 h-6 bg-amber-600 rounded-md flex items-center justify-center shadow">
                <span className="text-xs">📜</span>
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
        className="flex items-center justify-center gap-2 mt-3 text-slate-500 text-xs"
      >
        <Lock className="w-3 h-3" />
        <span>Aucune donnée personnelle n&apos;est collectée. Ton choix est enregistré uniquement sur ton appareil.</span>
      </motion.div>
    </div>
  );
}
