'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ChevronRight, Sparkles, Eye, X, Star, Trophy, Target, Heart, Zap } from 'lucide-react';

/**
 * VisitorStepsBlocks - Présentation du VRAI CONTENU pour visiteurs NON CONNECTÉS
 * 
 * OBJECTIF : Montrer le contenu RÉEL de l'application (aperçu) pour donner envie de s'inscrire
 * Les blocs affichent des VRAIES DONNÉES mais la gamification NE FONCTIONNE PAS
 * Cliquer ouvre un aperçu du contenu puis invite à s'inscrire
 */

interface Block {
  id: number;
  slug: string;
  emoji: string;
  title: string;
  subtitle: string;
  gradient: string;
  shadowColor: string;
  previewTitle: string;
  previewDescription: string;
  previewContent: React.ReactNode;
  stats?: { label: string; value: string }[];
}

interface VisitorStepsBlocksProps {
  mode?: 'enfant' | 'adulte';
  onSignupClick?: () => void;
}

export const VisitorStepsBlocks: React.FC<VisitorStepsBlocksProps> = ({ 
  mode = 'enfant', 
  onSignupClick 
}) => {
  const isEnfant = mode === 'enfant';
  const [previewBlock, setPreviewBlock] = useState<Block | null>(null);

  const handleSignupClick = () => {
    setPreviewBlock(null);
    if (onSignupClick) {
      onSignupClick();
    }
  };

  // Vraies techniques d'Aïkido
  const realTechniques = [
    { name: "Ikkyo", grade: "6e Kyu", emoji: "🥋", desc: "1ère immobilisation" },
    { name: "Shiho Nage", grade: "5e Kyu", emoji: "🌀", desc: "Projection 4 directions" },
    { name: "Irimi Nage", grade: "4e Kyu", emoji: "💨", desc: "Projection en entrant" },
    { name: "Kote Gaeshi", grade: "3e Kyu", emoji: "🔄", desc: "Retournement poignet" },
    { name: "Kaiten Nage", grade: "2e Kyu", emoji: "🌪️", desc: "Projection rotative" },
    { name: "Nikyo", grade: "6e Kyu", emoji: "✋", desc: "2ème immobilisation" },
  ];

  // Vrais défis quotidiens
  const realChallenges = [
    { name: "Salut Parfait", xp: 10, emoji: "🙇", desc: "Fais un salut sincère au dojo" },
    { name: "Gardien du Tatami", xp: 15, emoji: "🧹", desc: "Aide à ranger le tatami" },
    { name: "Première Chute", xp: 20, emoji: "🔄", desc: "Réussir 5 ukemi avant" },
    { name: "Ninja Ponctuel", xp: 10, emoji: "⏰", desc: "Arrive à l'heure au cours" },
    { name: "Parole du Ninja", xp: 15, emoji: "🗣️", desc: "Compte en japonais" },
  ];

  // Vraies 7 Vertus avec animaux
  const realVirtues = [
    { name: "Respect", kanji: "礼", emoji: "🙏", animal: "🦁", color: "from-yellow-400 to-amber-500", desc: "Le Lion Noble" },
    { name: "Courage", kanji: "勇", emoji: "💪", animal: "🐯", color: "from-orange-400 to-red-500", desc: "Le Tigre Brave" },
    { name: "Maîtrise", kanji: "克", emoji: "🧘", animal: "🐢", color: "from-green-400 to-emerald-500", desc: "La Tortue Sage" },
    { name: "Humilité", kanji: "謙", emoji: "🌱", animal: "🐰", color: "from-violet-400 to-purple-500", desc: "Le Lapin Humble" },
    { name: "Bienveillance", kanji: "仁", emoji: "💝", animal: "🐼", color: "from-pink-400 to-rose-500", desc: "Le Panda Gentil" },
    { name: "Attention", kanji: "注", emoji: "👁️", animal: "🦉", color: "from-cyan-400 to-blue-500", desc: "Le Hibou Vigilant" },
    { name: "Responsabilité", kanji: "責", emoji: "⚖️", animal: "🦅", color: "from-teal-400 to-cyan-500", desc: "L'Aigle Royal" },
  ];

  // Vraies ceintures
  const realBelts = [
    { name: "Blanche", grade: "6e Kyu", color: "bg-white border-2 border-slate-300", emoji: "⚪", techniques: 15 },
    { name: "Jaune", grade: "5e Kyu", color: "bg-yellow-400", emoji: "🟡", techniques: 20 },
    { name: "Orange", grade: "4e Kyu", color: "bg-orange-500", emoji: "🟠", techniques: 25 },
    { name: "Verte", grade: "3e Kyu", color: "bg-green-500", emoji: "🟢", techniques: 30 },
    { name: "Bleue", grade: "2e Kyu", color: "bg-blue-500", emoji: "🔵", techniques: 35 },
    { name: "Marron", grade: "1er Kyu", color: "bg-amber-700", emoji: "🟤", techniques: 40 },
    { name: "Noire", grade: "Shodan", color: "bg-slate-900", emoji: "⚫", techniques: 50 },
  ];

  // Vrais badges/trophées
  const realTrophies = [
    { name: "Premier Salut", emoji: "🙇", desc: "Ton 1er salut sincère", rarity: "Commun" },
    { name: "10 Techniques", emoji: "🎯", desc: "Maîtrise 10 techniques", rarity: "Rare" },
    { name: "Semaine Parfaite", emoji: "🔥", desc: "7 jours d'affilée", rarity: "Épique" },
    { name: "Gardien du Tatami", emoji: "🛡️", desc: "Aide 10 fois au rangement", rarity: "Rare" },
    { name: "Lion Noble", emoji: "🦁", desc: "Niveau 5 en Respect", rarity: "Légendaire" },
    { name: "Maître Zen", emoji: "🧘", desc: "100 défis complétés", rarity: "Légendaire" },
  ];

  // Blocs version enfant avec contenu de prévisualisation amélioré
  const blocksEnfant: Block[] = [
    {
      id: 1, slug: 'profil', emoji: '🥷', title: 'Mon Profil Ninja',
      subtitle: 'Ton identité de guerrier',
      gradient: 'from-violet-500 to-purple-600', shadowColor: 'shadow-violet-500/40',
      previewTitle: 'Ton Profil de Ninja',
      previewDescription: 'Personnalise ton avatar et suis ta progression !',
      stats: [{ label: 'Ninjas actifs', value: '2,847' }],
      previewContent: (
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg">
              🥷
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-lg">Ninja Apprenti</p>
              <p className="text-violet-200 text-sm">Niveau 5 • 450 XP</p>
              <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-3/5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-2xl">🦁</p>
              <p className="text-white text-xs mt-1">Animal</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-amber-400">7</p>
              <p className="text-white text-xs mt-1">Streak 🔥</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-2xl">🏆</p>
              <p className="text-white text-xs mt-1">12 Badges</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2, slug: 'techniques', emoji: '🥋', title: '206+ Techniques',
      subtitle: 'Tout le programme Aïkido',
      gradient: 'from-cyan-500 to-blue-600', shadowColor: 'shadow-cyan-500/40',
      previewTitle: 'Bibliothèque des Techniques',
      previewDescription: 'Plus de 206 techniques documentées par grade !',
      stats: [{ label: 'Techniques', value: '206+' }, { label: 'Vidéos', value: '150+' }],
      previewContent: (
        <div className="space-y-3">
          {realTechniques.slice(0, 5).map((tech, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between bg-white/10 rounded-xl p-3 hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tech.emoji}</span>
                <div>
                  <p className="text-white font-semibold">{tech.name}</p>
                  <p className="text-cyan-200 text-xs">{tech.desc}</p>
                </div>
              </div>
              <span className="bg-cyan-500/30 text-cyan-100 text-xs px-2 py-1 rounded-full">{tech.grade}</span>
            </motion.div>
          ))}
          <p className="text-center text-cyan-200 text-sm pt-2">+ 200 autres techniques à découvrir...</p>
        </div>
      )
    },
    {
      id: 3, slug: 'defis', emoji: '🎯', title: 'Défis Quotidiens',
      subtitle: 'Gagne des XP chaque jour',
      gradient: 'from-pink-500 to-rose-600', shadowColor: 'shadow-pink-500/40',
      previewTitle: 'Tes Défis du Jour',
      previewDescription: 'Complète des défis pour gagner XP et badges !',
      stats: [{ label: 'Défis dispo', value: '25+' }, { label: 'XP/jour max', value: '100' }],
      previewContent: (
        <div className="space-y-3">
          {realChallenges.map((challenge, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between bg-white/10 rounded-xl p-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                  {challenge.emoji}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{challenge.name}</p>
                  <p className="text-pink-200 text-xs">{challenge.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-500 text-slate-900 text-xs px-2 py-1 rounded-full font-bold">
                <Zap className="w-3 h-3" />
                +{challenge.xp}
              </div>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      id: 4, slug: 'vertus', emoji: '☯️', title: 'Les 7 Vertus',
      subtitle: 'Deviens un vrai guerrier',
      gradient: 'from-amber-500 to-orange-600', shadowColor: 'shadow-amber-500/40',
      previewTitle: 'Les 7 Vertus du Ninja',
      previewDescription: 'Chaque vertu a son animal gardien qui évolue !',
      stats: [{ label: 'Vertus', value: '7' }, { label: 'Niveaux/vertu', value: '5' }],
      previewContent: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {realVirtues.slice(0, 6).map((virtue, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`bg-gradient-to-br ${virtue.color} rounded-xl p-3 text-center hover:scale-105 transition-transform cursor-pointer`}
              >
                <div className="flex justify-center gap-1 text-xl mb-1">
                  <span>{virtue.emoji}</span>
                  <span>{virtue.animal}</span>
                </div>
                <p className="text-white font-bold text-sm">{virtue.name}</p>
                <p className="text-white/70 text-[10px]">{virtue.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-amber-200 text-xs">+ la vertu Responsabilité 🦅</p>
          </div>
        </div>
      )
    },
    {
      id: 5, slug: 'ceintures', emoji: '🎖️', title: 'Les Ceintures',
      subtitle: 'Ta progression visible',
      gradient: 'from-slate-600 to-slate-800', shadowColor: 'shadow-slate-500/40',
      previewTitle: 'Système de Grades',
      previewDescription: 'Du 6e Kyu (blanche) au Shodan (noire) !',
      stats: [{ label: 'Grades Kyu', value: '6' }, { label: 'Grades Dan', value: '10' }],
      previewContent: (
        <div className="space-y-2">
          {realBelts.map((belt, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between bg-white/10 rounded-lg p-2 hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full ${belt.color}`}></div>
                <div>
                  <span className="text-white font-medium">{belt.emoji} {belt.name}</span>
                  <span className="text-slate-400 text-xs ml-2">{belt.grade}</span>
                </div>
              </div>
              <span className="text-slate-300 text-xs">{belt.techniques} tech.</span>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      id: 6, slug: 'histoire', emoji: '📜', title: "L'Histoire",
      subtitle: 'Découvre O-Sensei',
      gradient: 'from-amber-600 to-yellow-700', shadowColor: 'shadow-amber-600/40',
      previewTitle: "L'Histoire de l'Aïkido",
      previewDescription: 'Découvre le fondateur et la philosophie !',
      stats: [{ label: 'Fondateur', value: 'O-Sensei' }, { label: 'Création', value: '1942' }],
      previewContent: (
        <div className="space-y-4">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-4xl mb-3 shadow-lg">
              👴🏻
            </div>
            <p className="text-amber-100 font-bold text-lg">Morihei Ueshiba</p>
            <p className="text-amber-200 text-sm">O-Sensei • 1883-1969</p>
            <p className="text-white/70 text-xs mt-2">Fondateur de l&apos;Aïkido</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-amber-100 text-sm italic text-center">
              &quot;La vraie victoire est la victoire sur soi-même&quot;
            </p>
            <p className="text-amber-200 text-xs text-center mt-1">- O-Sensei</p>
          </div>
        </div>
      )
    },
    {
      id: 7, slug: 'trophees', emoji: '🏆', title: 'Trophées',
      subtitle: 'Collectionne les badges',
      gradient: 'from-yellow-500 to-amber-600', shadowColor: 'shadow-yellow-500/40',
      previewTitle: 'Tes Trophées & Badges',
      previewDescription: 'Débloque des badges rares et légendaires !',
      stats: [{ label: 'Badges', value: '50+' }, { label: 'Trophées', value: '12' }],
      previewContent: (
        <div className="space-y-2">
          {realTrophies.map((trophy, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 bg-white/10 rounded-xl p-3 hover:bg-white/20 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/30 to-yellow-500/30 flex items-center justify-center text-2xl">
                {trophy.emoji}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{trophy.name}</p>
                <p className="text-amber-200 text-xs">{trophy.desc}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                trophy.rarity === 'Légendaire' ? 'bg-amber-500 text-slate-900' :
                trophy.rarity === 'Épique' ? 'bg-purple-500 text-white' :
                trophy.rarity === 'Rare' ? 'bg-blue-500 text-white' :
                'bg-slate-500 text-white'
              }`}>
                {trophy.rarity}
              </span>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      id: 8, slug: 'parents', emoji: '👨‍👩‍👧', title: 'Espace Parents',
      subtitle: 'Suivi et validation',
      gradient: 'from-emerald-500 to-teal-600', shadowColor: 'shadow-emerald-500/40',
      previewTitle: 'Espace Parents',
      previewDescription: 'Suivez et validez la progression de votre enfant !',
      stats: [{ label: 'Rapports', value: 'Hebdo' }, { label: 'Validation', value: 'Simple' }],
      previewContent: (
        <div className="space-y-4">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl">
                👶
              </div>
              <div>
                <p className="text-white font-bold">Lucas</p>
                <p className="text-emerald-200 text-sm">Ceinture Jaune • 5e Kyu</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-xl font-bold text-emerald-300">125</p>
                <p className="text-white/70 text-[10px]">XP cette semaine</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-xl font-bold text-amber-300">3</p>
                <p className="text-white/70 text-[10px]">Défis validés</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-xl font-bold text-cyan-300">7</p>
                <p className="text-white/70 text-[10px]">Jours streak</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-emerald-500 text-white font-semibold py-2 rounded-xl text-sm flex items-center justify-center gap-2">
              <Heart className="w-4 h-4" /> Valider
            </button>
            <button className="flex-1 bg-white/20 text-white font-semibold py-2 rounded-xl text-sm">
              Voir rapport
            </button>
          </div>
        </div>
      )
    }
  ];

  // Rendu version enfant
  if (isEnfant) {
    return (
      <div className="mb-4" data-testid="visitor-steps-blocks-enfant">
        {/* Titre */}
        <div className="text-center mb-6">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl sm:text-2xl font-bold text-white mb-2"
          >
            🎮 Découvre ce qui t&apos;attend ! 🎮
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-xs sm:text-sm"
          >
            Clique sur un bloc pour voir un aperçu 👀 • <span className="text-amber-400">Inscris-toi pour tout débloquer !</span>
          </motion.p>
        </div>

        {/* Grille des 8 blocs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {blocksEnfant.map((block, index) => (
            <motion.button
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setPreviewBlock(block)}
              data-testid={`visitor-block-${block.slug}`}
              className={`
                relative group rounded-2xl p-4 text-left
                transition-all duration-300 overflow-hidden
                bg-gradient-to-br ${block.gradient} shadow-lg ${block.shadowColor} 
                border-2 border-white/20 hover:border-white/50 hover:scale-[1.03] cursor-pointer
                min-h-[180px] sm:min-h-[200px]
              `}
            >
              {/* Numéro */}
              <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                <span className="text-lg sm:text-xl font-black text-white drop-shadow-lg">{block.id}</span>
              </div>

              {/* Badge Aperçu */}
              <div className="absolute top-2 right-2 bg-white/25 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 group-hover:bg-white/40 transition-colors">
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline">Aperçu</span>
              </div>

              {/* Contenu */}
              <div className="mt-10 sm:mt-12">
                <span className="text-4xl sm:text-5xl block mb-2">{block.emoji}</span>
                <h3 className="font-black text-white text-base sm:text-lg leading-tight drop-shadow-md">{block.title}</h3>
                <p className="text-white/70 text-xs mt-1 hidden sm:block">{block.subtitle}</p>
              </div>

              {/* Bouton Voir plus */}
              <div className="absolute bottom-3 right-3 bg-white/30 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <span>Voir</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* CTA inscription */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <button
            onClick={handleSignupClick}
            data-testid="cta-start-adventure"
            className="group relative overflow-hidden px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl
              bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 text-slate-900 
              shadow-xl shadow-amber-500/40 hover:shadow-amber-500/60
              transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
          >
            <span className="relative flex items-center gap-3">
              <span className="text-2xl">🥷</span>
              <span>Créer mon compte Ninja</span>
              <span className="text-2xl">🚀</span>
            </span>
          </button>
          <p className="text-slate-500 text-xs">✨ C&apos;est gratuit et ça prend 30 secondes !</p>
        </motion.div>

        {/* Modal d'aperçu animé */}
        <AnimatePresence>
          {previewBlock && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setPreviewBlock(null)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={`relative w-full max-w-md max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br ${previewBlock.gradient}`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 z-10 p-5 border-b border-white/20 bg-gradient-to-b from-black/20 to-transparent">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="text-5xl"
                      >
                        {previewBlock.emoji}
                      </motion.span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{previewBlock.previewTitle}</h3>
                        <p className="text-white/70 text-sm">{previewBlock.previewDescription}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setPreviewBlock(null)}
                      className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  
                  {/* Stats */}
                  {previewBlock.stats && (
                    <div className="flex gap-3 mt-4">
                      {previewBlock.stats.map((stat, i) => (
                        <div key={i} className="bg-white/10 rounded-lg px-3 py-1.5">
                          <span className="text-white font-bold">{stat.value}</span>
                          <span className="text-white/60 text-xs ml-1">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contenu scrollable */}
                <div className="p-5 overflow-y-auto max-h-[50vh]">
                  {previewBlock.previewContent}
                </div>

                {/* Footer CTA */}
                <div className="sticky bottom-0 p-5 bg-gradient-to-t from-black/40 to-transparent border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 flex items-center gap-2 text-white/80">
                      <Lock className="w-5 h-5" />
                      <span className="text-sm">Inscris-toi pour débloquer tout !</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSignupClick}
                      className="bg-white text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2 shadow-lg"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>S&apos;inscrire</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Version adulte (sobre)
  return (
    <div className="mb-4" data-testid="visitor-steps-blocks-adulte">
      <div className="text-center mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-1">
          Contenu de la plateforme
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Cliquez pour découvrir • <span className="text-cyan-400">Inscription gratuite</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <Target className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-cyan-400">206+</div>
          <div className="text-xs text-slate-400">Techniques</div>
        </div>
        <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-amber-400">10</div>
          <div className="text-xs text-slate-400">Grades</div>
        </div>
        <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <Star className="w-6 h-6 text-violet-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-violet-400">7</div>
          <div className="text-xs text-slate-400">Vertus</div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleSignupClick}
          data-testid="cta-start-adventure-adulte"
          className="group relative overflow-hidden px-8 py-3 rounded-xl font-semibold
            bg-gradient-to-r from-slate-700 to-slate-800 text-white border border-slate-600
            shadow-lg hover:shadow-xl hover:border-cyan-500/50
            transform hover:scale-[1.02] transition-all duration-300"
        >
          <span className="relative flex items-center gap-2">
            <span>Créer mon compte gratuitement</span>
            <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default VisitorStepsBlocks;
