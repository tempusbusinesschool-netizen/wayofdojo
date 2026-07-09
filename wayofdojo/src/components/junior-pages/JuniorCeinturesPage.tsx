'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Star, Lock, ChevronRight, Award } from 'lucide-react';
import { JuniorPageLayout } from '@/components/layouts/JuniorPageLayout';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * JuniorCeinturesPage - Version enfantine de la progression des ceintures
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Configuration des ceintures
const BELTS = [
  { 
    id: '6e_kyu', 
    label: '6e Kyu', 
    color: 'white', 
    gradient: 'from-slate-100 to-white',
    emoji: '⬜',
    animal: '🐣',
    title: 'Petit Poussin',
    description: 'Tu fais tes premiers pas sur le tatami !',
    requirements: ['Salut (Rei)', 'Chute avant (Mae Ukemi)', 'Position de base (Kamae)'],
    xpRequired: 0,
  },
  { 
    id: '5e_kyu', 
    label: '5e Kyu', 
    color: 'yellow', 
    gradient: 'from-yellow-400 to-amber-400',
    emoji: '💛',
    animal: '🐥',
    title: 'Jeune Caneton',
    description: 'Tu commences à maîtriser les bases !',
    requirements: ['Ikkyo Omote/Ura', 'Irimi Tenkan', 'Chute arrière (Ushiro Ukemi)'],
    xpRequired: 500,
  },
  { 
    id: '4e_kyu', 
    label: '4e Kyu', 
    color: 'orange', 
    gradient: 'from-orange-400 to-orange-600',
    emoji: '🧡',
    animal: '🦊',
    title: 'Renard Rusé',
    description: 'Tu deviens plus agile et malin !',
    requirements: ['Nikkyo', 'Shiho Nage', 'Kokyu Nage'],
    xpRequired: 1200,
  },
  { 
    id: '3e_kyu', 
    label: '3e Kyu', 
    color: 'green', 
    gradient: 'from-green-400 to-green-600',
    emoji: '💚',
    animal: '🐢',
    title: 'Tortue Sage',
    description: 'La patience te rend plus fort !',
    requirements: ['Sankyo', 'Kote Gaeshi', 'Techniques à genoux'],
    xpRequired: 2000,
  },
  { 
    id: '2e_kyu', 
    label: '2e Kyu', 
    color: 'blue', 
    gradient: 'from-blue-400 to-blue-600',
    emoji: '💙',
    animal: '🐬',
    title: 'Dauphin Gracieux',
    description: 'Tes mouvements sont fluides comme l\'eau !',
    requirements: ['Yonkyo', 'Irimi Nage', 'Techniques avec armes'],
    xpRequired: 3000,
  },
  { 
    id: '1er_kyu', 
    label: '1er Kyu', 
    color: 'brown', 
    gradient: 'from-amber-600 to-amber-800',
    emoji: '🤎',
    animal: '🦅',
    title: 'Aigle Vigilant',
    description: 'Tu vois tout et tu comprends l\'harmonie !',
    requirements: ['Gokyo', 'Toutes les immobilisations', 'Randori'],
    xpRequired: 4500,
  },
  { 
    id: '1er_dan', 
    label: '1er Dan', 
    color: 'black', 
    gradient: 'from-slate-800 to-black',
    emoji: '🖤',
    animal: '🐉',
    title: 'Dragon Légendaire',
    description: 'Tu es devenu un vrai Samouraï !',
    requirements: ['Maîtrise complète', 'Hakama', 'Enseigner aux autres'],
    xpRequired: 6000,
  },
];

interface JuniorCeinturesPageProps {
  userName?: string;
  userXp?: number;
  userLevel?: number;
  userStreak?: number;
  userCurrentKyu?: string;
}

export const JuniorCeinturesPage: React.FC<JuniorCeinturesPageProps> = ({
  userName = 'Jeune Samouraï',
  userXp = 150,
  userLevel = 1,
  userStreak = 0,
  userCurrentKyu = '6e_kyu',
}) => {
  const params = useParams();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const [selectedBelt, setSelectedBelt] = useState<typeof BELTS[0] | null>(null);

  // Trouver l'index de la ceinture actuelle
  const currentBeltIndex = BELTS.findIndex(b => b.id === userCurrentKyu);

  return (
    <JuniorPageLayout
      locale={locale}
      sport={sport}
      title="Les Ceintures"
      subtitle="Progresse pour devenir un vrai Samouraï ! 🏆"
      emoji="🥋"
      userName={userName}
      userXp={userXp}
      userLevel={userLevel}
      userStreak={userStreak}
    >
      {/* Progression actuelle */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-white/20">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${BELTS[currentBeltIndex]?.gradient || BELTS[0].gradient} flex items-center justify-center shadow-xl`}>
            <span className="text-4xl">{BELTS[currentBeltIndex]?.animal || '🐣'}</span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">
              {BELTS[currentBeltIndex]?.title || 'Petit Poussin'}
            </h3>
            <p className="text-white/70">{BELTS[currentBeltIndex]?.label || '6e Kyu'}</p>
            <div className="flex items-center gap-2 mt-1">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-bold">{userXp} XP</span>
            </div>
          </div>
        </div>
        
        {/* Barre vers prochaine ceinture */}
        {currentBeltIndex < BELTS.length - 1 && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Prochaine ceinture :</span>
              <span className="text-yellow-400 font-bold">
                {BELTS[currentBeltIndex + 1]?.label} - {BELTS[currentBeltIndex + 1]?.xpRequired} XP
              </span>
            </div>
            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: `${Math.min(100, (userXp / (BELTS[currentBeltIndex + 1]?.xpRequired || 500)) * 100)}%` 
                }}
                className={`h-full bg-gradient-to-r ${BELTS[currentBeltIndex + 1]?.gradient || 'from-yellow-400 to-amber-400'} rounded-full`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Chemin des ceintures */}
      <div className="relative">
        {/* Ligne de connexion */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-white/20 rounded-full" />

        <div className="space-y-4">
          {BELTS.map((belt, index) => {
            const isUnlocked = index <= currentBeltIndex;
            const isCurrent = index === currentBeltIndex;
            const isNext = index === currentBeltIndex + 1;

            return (
              <motion.div
                key={belt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedBelt(belt)}
                className={`relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                  isCurrent 
                    ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-2 border-yellow-400/50 shadow-xl' 
                    : isUnlocked
                      ? 'bg-white/10 hover:bg-white/20 border border-white/10'
                      : 'bg-slate-800/50 border border-slate-700/50 opacity-60'
                }`}
              >
                {/* Point sur la timeline */}
                <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                  isUnlocked 
                    ? `bg-gradient-to-br ${belt.gradient}` 
                    : 'bg-slate-700'
                }`}>
                  {isUnlocked ? (
                    <span className="text-3xl">{belt.animal}</span>
                  ) : (
                    <Lock className="w-6 h-6 text-slate-500" />
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold text-lg ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                      {belt.label} - {belt.title}
                    </h4>
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                        TOI !
                      </span>
                    )}
                    {isNext && (
                      <span className="px-2 py-0.5 bg-orange-400/50 text-orange-200 text-xs font-bold rounded-full">
                        PROCHAIN
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${isUnlocked ? 'text-white/70' : 'text-slate-600'}`}>
                    {belt.description}
                  </p>
                  {!isUnlocked && (
                    <p className="text-orange-400 text-xs mt-1">
                      🔒 Débloque à {belt.xpRequired} XP
                    </p>
                  )}
                </div>

                <ChevronRight className={`w-5 h-5 ${isUnlocked ? 'text-white/50' : 'text-slate-600'}`} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal détail ceinture */}
      <AnimatePresence>
        {selectedBelt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedBelt(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-md w-full border border-white/20 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedBelt.gradient} flex items-center justify-center shadow-xl`}>
                  <span className="text-4xl">{selectedBelt.animal}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedBelt.label}</h3>
                  <p className="text-orange-400 font-medium">{selectedBelt.title}</p>
                </div>
              </div>

              <p className="text-white/80 mb-4">{selectedBelt.description}</p>

              {/* Prérequis */}
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  📋 Ce que tu dois apprendre :
                </h4>
                <ul className="space-y-2">
                  {selectedBelt.requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/70 text-sm">
                      <Star className="w-4 h-4 text-yellow-400" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* XP requis */}
              <div className="flex items-center justify-between p-3 bg-orange-500/20 rounded-xl mb-4">
                <span className="text-white/80">XP requis :</span>
                <span className="text-orange-400 font-bold text-lg">{selectedBelt.xpRequired} XP</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedBelt(null)}
                className={`w-full py-3 bg-gradient-to-r ${selectedBelt.gradient} rounded-xl text-white font-bold`}
              >
                C'est compris ! 👍
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </JuniorPageLayout>
  );
};

export default JuniorCeinturesPage;
