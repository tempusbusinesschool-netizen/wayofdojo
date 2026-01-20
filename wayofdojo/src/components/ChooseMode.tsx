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
    // Save mode preference to localStorage
    localStorage.setItem('wayofdojo_mode', mode);
    
    if (onModeSelect) {
      onModeSelect(mode);
    }
    
    // Redirect to register page with mode
    router.push(`/${locale}/aikido/register?mode=${mode}`);
  };

  return (
    <div className="w-full py-2 px-4" data-testid="choose-mode">
      {/* Mode Cards - Images originales identiques à Aikido@Game - SANS titre supplémentaire car inclus dans les images */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-center items-stretch gap-4 md:gap-6">
        {/* Jeune Samouraï Card - Image originale exacte */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleModeClick('enfant')}
          className="relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20 flex-1"
          data-testid="mode-jeune-samourai"
        >
          <Image
            src="/images/modes/jeune-ninja-card.png"
            alt="Jeune Samouraï - Moins de 14 ans"
            width={500}
            height={650}
            className="object-contain w-full h-auto"
            priority
          />
        </motion.button>

        {/* Samouraï Confirmé Card - Image originale exacte */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleModeClick('adulte')}
          className="relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 flex-1"
          data-testid="mode-samourai-confirme"
        >
          <Image
            src="/images/modes/ninja-confirme-card.png"
            alt="Samouraï Confirmé - Plus de 14 ans"
            width={500}
            height={650}
            className="object-contain w-full h-auto"
            priority
          />
        </motion.button>
      </div>

      {/* Privacy Notice */}
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
