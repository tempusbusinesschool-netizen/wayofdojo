'use client';

import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { Lock, Gamepad2, Trophy, BarChart3, Target, ScrollText } from 'lucide-react';
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

      {/* Mode Cards - Reproduction FIDÈLE de l'original */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4 md:gap-6">
        
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* CARTE JEUNE SAMOURAÏ - Reproduction fidèle */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleModeClick('enfant')}
          className="group relative overflow-hidden rounded-[2rem] transition-all duration-300"
          style={{
            boxShadow: '0 0 25px rgba(255, 193, 7, 0.5), inset 0 0 0 3px rgba(255, 215, 0, 0.9)'
          }}
          data-testid="mode-jeune-samourai"
        >
          {/* Background orange avec particules */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600" />
          
          {/* Particules brillantes */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-200 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 60}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Grande étoile en haut à gauche */}
          <motion.div
            className="absolute top-4 left-4 z-10"
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-4xl drop-shadow-lg filter brightness-125">⭐</span>
          </motion.div>

          {/* Étoiles scintillantes en haut à droite */}
          <div className="absolute top-4 right-6 z-10">
            <motion.span
              className="text-xl text-yellow-300 drop-shadow-lg"
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ✦
            </motion.span>
          </div>
          <div className="absolute top-10 right-3 z-10">
            <motion.span
              className="text-2xl text-yellow-200 drop-shadow-lg"
              animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              ✦
            </motion.span>
          </div>

          {/* Contenu */}
          <div className="relative z-10">
            {/* Image du personnage enfant */}
            <div className="relative h-52 md:h-60 flex items-center justify-center pt-6">
              <Image
                src="/images/modes/enfant.png"
                alt="Jeune Samouraï"
                width={180}
                height={230}
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>

            {/* Section jaune du bas - Identique à l'original */}
            <div 
              className="relative bg-gradient-to-b from-yellow-400 to-amber-400 pt-4 pb-4 px-4"
              style={{
                boxShadow: '0 -15px 40px rgba(255, 215, 0, 0.6)'
              }}
            >
              {/* Titre */}
              <h3 className="text-2xl md:text-3xl font-black text-white drop-shadow-md text-center">
                Jeune Samouraï
              </h3>
              
              {/* Sous-titre */}
              <p className="text-yellow-100/90 text-sm font-medium text-center mb-3">
                Moins de 14 ans
              </p>

              {/* 3 Icônes carrées colorées - Identiques à l'original */}
              <div className="flex justify-center gap-2 mb-3">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-lg">🐉</span>
                </div>
              </div>

              {/* Bouton Parle-moi avec avatar Tanaka */}
              <div className="flex justify-center items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/80 shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/images/tanaka/portrait.png" 
                    alt="Maître Tanaka"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg transition-colors">
                  Parle-moi !
                </span>
              </div>
            </div>
          </div>
        </motion.button>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* CARTE SAMOURAÏ CONFIRMÉ - Reproduction fidèle */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleModeClick('adulte')}
          className="group relative overflow-hidden rounded-[2rem] transition-all duration-300"
          style={{
            boxShadow: '0 0 20px rgba(148, 163, 184, 0.4), inset 0 0 0 3px rgba(203, 213, 225, 0.6)'
          }}
          data-testid="mode-samourai-confirme"
        >
          {/* Background sombre */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-700 via-slate-600 to-slate-700" />

          {/* Icône gi en haut à gauche */}
          <div className="absolute top-4 left-4 z-10 opacity-50">
            <span className="text-2xl">👘</span>
          </div>

          {/* Badge Yin Yang en haut à droite - Carré violet */}
          <div className="absolute top-4 right-4 z-20 w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-xl">☯️</span>
          </div>

          {/* Fleurs de cerisier - Plus visibles */}
          <div className="absolute top-0 right-0 w-full h-40 overflow-hidden z-0">
            <span className="absolute top-3 right-16 text-pink-400/50 text-lg">🌸</span>
            <span className="absolute top-8 right-6 text-pink-300/40 text-sm">🌸</span>
            <span className="absolute top-5 right-28 text-pink-400/30 text-xs">🌸</span>
            <span className="absolute top-12 right-36 text-pink-300/40">🌸</span>
            <span className="absolute top-7 left-16 text-pink-400/30 text-sm">🌸</span>
            <span className="absolute top-14 left-6 text-pink-300/20 text-xs">🌸</span>
          </div>

          {/* Contenu */}
          <div className="relative z-10">
            {/* Image du couple adulte */}
            <div className="relative h-52 md:h-60 flex items-center justify-center pt-8">
              <Image
                src="/images/modes/adultes.png"
                alt="Samouraï Confirmé"
                width={220}
                height={240}
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>

            {/* Section du bas - Gris foncé */}
            <div className="relative bg-slate-600/90 pt-4 pb-4 px-4">
              {/* Titre */}
              <h3 className="text-2xl md:text-3xl font-black text-white drop-shadow-md text-center">
                Samouraï Confirmé
              </h3>
              
              {/* Sous-titre */}
              <p className="text-slate-300 text-sm font-medium text-center mb-3">
                Plus de 14 ans
              </p>

              {/* 3 Icônes carrées colorées - Identiques à l'original */}
              <div className="flex justify-center gap-2">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ScrollText className="w-5 h-5 text-white" />
                </div>
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
