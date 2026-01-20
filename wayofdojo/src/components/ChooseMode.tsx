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
      {/* Titre - Exactement comme l'original */}
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

      {/* Mode Cards - Images EXACTES de Aikido@Game */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6">
        
        {/* CARTE ENFANT - Image originale exacte */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleModeClick('enfant')}
          className="relative overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/30"
          data-testid="mode-jeune-samourai"
        >
          <Image
            src="/images/modes/enfant.png"
            alt="Jeune Samouraï - Moins de 14 ans"
            width={400}
            height={500}
            className="object-contain"
            priority
          />
        </motion.button>

        {/* CARTE ADULTES - Image originale exacte */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleModeClick('adulte')}
          className="relative overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/30"
          data-testid="mode-samourai-confirme"
        >
          <Image
            src="/images/modes/adultes.png"
            alt="Samouraï Confirmé - Plus de 14 ans"
            width={400}
            height={500}
            className="object-contain"
            priority
          />
        </motion.button>
      </div>

      {/* Message de confidentialité - Exactement comme l'original */}
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
