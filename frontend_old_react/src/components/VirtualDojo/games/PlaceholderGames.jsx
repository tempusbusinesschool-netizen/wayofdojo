/**
 * Placeholder components for remaining games
 * These will be fully implemented in future iterations
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Composant générique pour les jeux en développement
const GamePlaceholder = ({ name, emoji, description, onExit }) => (
  <div className="text-center py-12">
    <motion.span 
      className="text-7xl block mb-4"
      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
      transition={{ repeat: Infinity, duration: 3 }}
    >
      {emoji}
    </motion.span>
    <h2 className="text-2xl font-bold text-white mb-4">{name}</h2>
    <p className="text-slate-300 mb-6 max-w-md mx-auto">{description}</p>
    <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 mb-6 max-w-sm mx-auto">
      <p className="text-amber-400 text-sm">
        🚧 Ce jeu sera disponible dans la prochaine mise à jour !
      </p>
    </div>
    <Button onClick={onExit} variant="outline" className="text-white border-white/30">
      Retour au Dojo
    </Button>
  </div>
);

// 🎯 Gardien de l'Espace (Ma-ai)
export const GardienEspace = ({ userName, onComplete, onExit, tanakaSpeak }) => (
  <GamePlaceholder
    name="Gardien de l'Espace"
    emoji="🎯"
    description="Maintiens la distance parfaite avec les autres pratiquants. Apprends le Ma-ai, l'art de la distance juste en Aïkido."
    onExit={onExit}
  />
);

// 🪞 Miroir d'Harmonie
export const MiroirHarmonie = ({ userName, onComplete, onExit, tanakaSpeak }) => (
  <GamePlaceholder
    name="Miroir d'Harmonie"
    emoji="🪞"
    description="Reproduis les mouvements de Maître Tanaka comme un miroir parfait. Développe ton observation et ta coordination."
    onExit={onExit}
  />
);

// ⚖️ Chemin de l'Équilibre
export const CheminEquilibre = ({ userName, onComplete, onExit, tanakaSpeak }) => (
  <GamePlaceholder
    name="Chemin de l'Équilibre"
    emoji="⚖️"
    description="Garde ton avatar en équilibre sur un chemin étroit. Trouve ton centre, le Hara, source de ta force intérieure."
    onExit={onExit}
  />
);

// 🎴 Memory du Sensei
export const MemorySensei = ({ userName, onComplete, onExit, tanakaSpeak }) => (
  <GamePlaceholder
    name="Memory du Sensei"
    emoji="🎴"
    description="Associe les techniques d'Aïkido avec leurs noms japonais. Entraîne ta mémoire et apprends le vocabulaire du Budo."
    onExit={onExit}
  />
);

// 🥁 Rythme du Dojo
export const RythmeDuDojo = ({ userName, onComplete, onExit, tanakaSpeak }) => (
  <GamePlaceholder
    name="Rythme du Dojo"
    emoji="🥁"
    description="Tape au bon rythme pour accompagner les mouvements du dojo. L'Aïkido a son propre tempo, apprends à le ressentir."
    onExit={onExit}
  />
);

// 🛡️ Quête des 7 Vertus
export const QueteVertus = ({ userName, onComplete, onExit, tanakaSpeak }) => (
  <GamePlaceholder
    name="Quête des 7 Vertus"
    emoji="🛡️"
    description="Collecte les 7 vertus du Budo en résolvant des énigmes morales : Respect, Courage, Maîtrise, Humilité, Bienveillance, Attention, Responsabilité."
    onExit={onExit}
  />
);

export default {
  GardienEspace,
  MiroirHarmonie,
  CheminEquilibre,
  MemorySensei,
  RythmeDuDojo,
  QueteVertus
};
