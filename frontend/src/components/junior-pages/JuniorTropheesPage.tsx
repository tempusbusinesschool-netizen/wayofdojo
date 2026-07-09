'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Lock, CheckCircle, Sparkles } from 'lucide-react';
import { JuniorPageLayout } from '@/components/layouts/JuniorPageLayout';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * JuniorTropheesPage - Collection de badges ludique pour enfants
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Configuration des badges/trophées
const BADGES = [
  // Débutant
  { id: 'premier_pas', name: 'Premier Pas', emoji: '👣', category: 'débutant', description: 'Tu as fait ton premier cours !', xp: 10, unlockCondition: 'Terminer le premier cours' },
  { id: 'salut_parfait', name: 'Salut Parfait', emoji: '🙇', category: 'débutant', description: 'Tu maîtrises le salut du dojo !', xp: 15, unlockCondition: 'Apprendre Rei correctement' },
  { id: 'chuteur', name: 'Maître Chuteur', emoji: '🤸', category: 'débutant', description: 'Tu sais tomber sans te faire mal !', xp: 25, unlockCondition: 'Maîtriser Mae et Ushiro Ukemi' },
  
  // Régularité
  { id: 'assidu_3', name: 'Régulier', emoji: '📅', category: 'régularité', description: '3 jours de suite au dojo !', xp: 20, unlockCondition: 'Série de 3 jours' },
  { id: 'assidu_7', name: 'Super Régulier', emoji: '🔥', category: 'régularité', description: 'Une semaine complète !', xp: 50, unlockCondition: 'Série de 7 jours' },
  { id: 'assidu_30', name: 'Champion de l\'assiduité', emoji: '💎', category: 'régularité', description: 'Un mois entier !', xp: 200, unlockCondition: 'Série de 30 jours' },
  
  // Techniques
  { id: 'tech_5', name: 'Apprenti', emoji: '📚', category: 'techniques', description: '5 techniques apprises !', xp: 30, unlockCondition: 'Apprendre 5 techniques' },
  { id: 'tech_10', name: 'Étudiant Sérieux', emoji: '🎓', category: 'techniques', description: '10 techniques maîtrisées !', xp: 75, unlockCondition: 'Maîtriser 10 techniques' },
  { id: 'tech_25', name: 'Expert Junior', emoji: '🥷', category: 'techniques', description: '25 techniques ! Impressionnant !', xp: 150, unlockCondition: 'Maîtriser 25 techniques' },
  
  // Vertus
  { id: 'vertu_1', name: 'Vertueux Débutant', emoji: '⭐', category: 'vertus', description: 'Tu pratiques une vertu du Bushido !', xp: 25, unlockCondition: 'Pratiquer 1 vertu' },
  { id: 'vertu_3', name: 'Sage Apprenti', emoji: '🌟', category: 'vertus', description: '3 vertus en progression !', xp: 60, unlockCondition: 'Pratiquer 3 vertus' },
  { id: 'vertu_7', name: 'Maître des Vertus', emoji: '✨', category: 'vertus', description: 'Tu connais toutes les vertus !', xp: 200, unlockCondition: 'Maîtriser les 7 vertus' },
  
  // Spéciaux
  { id: 'explorateur', name: 'Explorateur', emoji: '🗺️', category: 'spécial', description: 'Tu as visité toutes les sections !', xp: 40, unlockCondition: 'Visiter toutes les pages' },
  { id: 'sensei_ami', name: 'Ami du Sensei', emoji: '🎭', category: 'spécial', description: 'Tanaka t\'a donné 10 conseils !', xp: 50, unlockCondition: 'Écouter 10 messages de Tanaka' },
  { id: 'ninja', name: 'Ninja Silencieux', emoji: '🥷', category: 'spécial', description: 'Tu as fini un jeu du Dojo Virtuel !', xp: 35, unlockCondition: 'Compléter un mini-jeu' },
  { id: 'dragon', name: 'Souffle du Dragon', emoji: '🐉', category: 'spécial', description: 'Tu as fait 5 exercices de respiration !', xp: 45, unlockCondition: '5 exercices Zen' },
];

const CATEGORIES = [
  { id: 'all', label: 'Tous', emoji: '🏆' },
  { id: 'débutant', label: 'Débutant', emoji: '🌱' },
  { id: 'régularité', label: 'Régularité', emoji: '🔥' },
  { id: 'techniques', label: 'Techniques', emoji: '🥋' },
  { id: 'vertus', label: 'Vertus', emoji: '⭐' },
  { id: 'spécial', label: 'Spéciaux', emoji: '✨' },
];

interface JuniorTropheesPageProps {
  userName?: string;
  userXp?: number;
  userLevel?: number;
  userStreak?: number;
  unlockedBadges?: string[];
}

export const JuniorTropheesPage: React.FC<JuniorTropheesPageProps> = ({
  userName = 'Jeune Samouraï',
  userXp = 0,
  userLevel = 1,
  userStreak = 0,
  unlockedBadges = ['premier_pas', 'salut_parfait'],
}) => {
  const params = useParams();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState<typeof BADGES[0] | null>(null);

  // Filtrer les badges
  const filteredBadges = selectedCategory === 'all' 
    ? BADGES 
    : BADGES.filter(b => b.category === selectedCategory);

  // Stats
  const totalUnlocked = unlockedBadges.length;
  const totalBadges = BADGES.length;
  const totalXpFromBadges = BADGES
    .filter(b => unlockedBadges.includes(b.id))
    .reduce((sum, b) => sum + b.xp, 0);

  return (
    <JuniorPageLayout
      locale={locale}
      sport={sport}
      title="Mes Trophées"
      subtitle="Collectionne tous les badges de samouraï ! 🏆"
      emoji="🏆"
      userName={userName}
      userXp={userXp}
      userLevel={userLevel}
      userStreak={userStreak}
    >
      {/* Stats globales */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-500/80 to-amber-600/80 backdrop-blur-xl rounded-2xl p-4 text-center border border-yellow-400/30">
          <span className="text-3xl">🏆</span>
          <p className="text-3xl font-black text-white">{totalUnlocked}</p>
          <p className="text-white/70 text-sm">Badges obtenus</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/80 to-pink-600/80 backdrop-blur-xl rounded-2xl p-4 text-center border border-purple-400/30">
          <span className="text-3xl">🎯</span>
          <p className="text-3xl font-black text-white">{totalBadges - totalUnlocked}</p>
          <p className="text-white/70 text-sm">À débloquer</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500/80 to-blue-600/80 backdrop-blur-xl rounded-2xl p-4 text-center border border-cyan-400/30">
          <span className="text-3xl">⚡</span>
          <p className="text-3xl font-black text-white">{totalXpFromBadges}</p>
          <p className="text-white/70 text-sm">XP gagnés</p>
        </div>
      </div>

      {/* Barre de progression globale */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 mb-6 border border-white/20">
        <div className="flex justify-between mb-2">
          <span className="text-white font-bold">Collection complète</span>
          <span className="text-yellow-400 font-bold">{totalUnlocked}/{totalBadges}</span>
        </div>
        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(totalUnlocked / totalBadges) * 100}%` }}
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
          />
        </div>
        <p className="text-center text-white/60 text-sm mt-2">
          {totalUnlocked === totalBadges 
            ? '🎉 FÉLICITATIONS ! Tu as TOUS les badges !' 
            : `Continue comme ça, champion ! Plus que ${totalBadges - totalUnlocked} badges à débloquer !`}
        </p>
      </div>

      {/* Filtres catégories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              selectedCategory === cat.id
                ? 'bg-yellow-400 text-slate-900 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {cat.emoji} {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Grille de badges */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredBadges.map((badge, index) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: isUnlocked ? 1.1 : 1.02, y: isUnlocked ? -5 : 0 }}
              onClick={() => setSelectedBadge(badge)}
              className={`relative rounded-2xl p-4 cursor-pointer transition-all text-center ${
                isUnlocked 
                  ? 'bg-gradient-to-br from-yellow-500/30 to-amber-500/30 border-2 border-yellow-400/50 shadow-xl' 
                  : 'bg-slate-800/50 border border-slate-700/50'
              }`}
            >
              {/* Badge débloqué indicator */}
              {isUnlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10"
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                </motion.div>
              )}

              {/* Emoji */}
              <div className={`text-4xl mb-2 ${!isUnlocked && 'grayscale opacity-50'}`}>
                {isUnlocked ? badge.emoji : '🔒'}
              </div>

              {/* Nom */}
              <p className={`font-bold text-xs truncate ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                {badge.name}
              </p>

              {/* XP */}
              <div className={`flex items-center justify-center gap-1 mt-1 ${isUnlocked ? 'text-yellow-400' : 'text-slate-600'}`}>
                <Sparkles className="w-3 h-3" />
                <span className="text-xs font-bold">+{badge.xp} XP</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal détail badge */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-3xl p-6 max-w-sm w-full border shadow-2xl ${
                unlockedBadges.includes(selectedBadge.id)
                  ? 'bg-gradient-to-br from-yellow-900/90 to-amber-900/90 border-yellow-500/50'
                  : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50'
              }`}
            >
              {/* Emoji géant */}
              <div className="text-center mb-4">
                <span className={`text-7xl ${!unlockedBadges.includes(selectedBadge.id) && 'grayscale'}`}>
                  {selectedBadge.emoji}
                </span>
              </div>

              {/* Nom et statut */}
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-white">{selectedBadge.name}</h3>
                {unlockedBadges.includes(selectedBadge.id) ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/30 text-green-400 rounded-full text-sm font-bold mt-2">
                    <CheckCircle className="w-4 h-4" />
                    DÉBLOQUÉ !
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-700/50 text-slate-400 rounded-full text-sm font-bold mt-2">
                    <Lock className="w-4 h-4" />
                    VERROUILLÉ
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-white/80 text-center mb-4">{selectedBadge.description}</p>

              {/* Comment débloquer */}
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                  🎯 Comment l'obtenir ?
                </h4>
                <p className="text-white/70 text-sm">{selectedBadge.unlockCondition}</p>
              </div>

              {/* XP */}
              <div className="flex items-center justify-center gap-2 p-3 bg-yellow-500/20 rounded-xl mb-4">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-bold text-lg">+{selectedBadge.xp} XP</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedBadge(null)}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white font-bold"
              >
                {unlockedBadges.includes(selectedBadge.id) ? 'Super ! 🎉' : 'Je vais l\'avoir ! 💪'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </JuniorPageLayout>
  );
};

export default JuniorTropheesPage;
