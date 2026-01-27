'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Eye, X, ChevronRight, Play,
  User, Target, Compass, BookOpen, Award, 
  Scroll, Trophy, Star, Flame, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AdultTutorialBlocks - LES 8 BLOCS DU PARCOURS ADULTE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Tutoriel interactif pour guider les utilisateurs adultes :
 * 
 * #   Bloc            But                                    Destination
 * 1   👋 Bienvenue    Introduction avec Maître Tanaka       Tableau de bord
 * 2   🥷 Mon Profil   Voir sa ceinture et stats             Section Profil
 * 3   🎯 Les Défis    Découvrir les défis quotidiens        Section Défis/Points
 * 4   ☯️ Les 7 Vertus Apprendre les valeurs du ninja        Section Vertus
 * 5   🥋 Les Techniques Voir les mouvements d'Aïkido        Section Entraînement
 * 6   🎖️ Les Ceintures Comprendre la progression de grade   Dialogue Ceintures
 * 7   📜 L'Histoire   Découvrir O'Sensei et l'Aïkido        Section Histoire
 * 8   🏆 Mes Trophées Voir les badges à collectionner       Dialogue Trophées
 */

interface AdultTutorialBlocksProps {
  userName?: string;
  currentGrade?: string;
  xp?: number;
  onNavigate?: (destination: string) => void;
  onBlockComplete?: (blockId: number) => void;
  completedBlocks?: number[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// DONNÉES DES 8 BLOCS
// ═══════════════════════════════════════════════════════════════════════════════

// Messages de Maître Tanaka
const TANAKA_WELCOME = {
  greeting: "Bienvenue sur la Voie du Budō, pratiquant.",
  intro: "Je suis Maître Tanaka, votre guide spirituel.",
  explanation: "Ce parcours vous accompagnera dans votre progression martiale et personnelle. L'Aïkido n'est pas seulement un art martial, c'est un chemin de vie.",
  invitation: "Êtes-vous prêt à commencer ce voyage ?"
};

// Les 7 Vertus du Bushido
const VIRTUES = [
  { name: "Gi", kanji: "義", meaning: "Rectitude", icon: "⚖️", color: "from-blue-500 to-blue-700" },
  { name: "Yū", kanji: "勇", meaning: "Courage", icon: "🦁", color: "from-orange-500 to-red-600" },
  { name: "Jin", kanji: "仁", meaning: "Bienveillance", icon: "💝", color: "from-pink-500 to-rose-600" },
  { name: "Rei", kanji: "礼", meaning: "Respect", icon: "🙏", color: "from-amber-500 to-yellow-600" },
  { name: "Makoto", kanji: "誠", meaning: "Sincérité", icon: "💎", color: "from-cyan-500 to-blue-600" },
  { name: "Meiyo", kanji: "名誉", meaning: "Honneur", icon: "👑", color: "from-purple-500 to-violet-600" },
  { name: "Chūgi", kanji: "忠義", meaning: "Loyauté", icon: "🛡️", color: "from-emerald-500 to-green-600" },
];

// Techniques principales
const TECHNIQUES = [
  { name: "Ikkyo", grade: "6e Kyu", desc: "Première immobilisation", emoji: "🥋" },
  { name: "Shiho Nage", grade: "5e Kyu", desc: "Projection 4 directions", emoji: "🌀" },
  { name: "Irimi Nage", grade: "4e Kyu", desc: "Projection en entrant", emoji: "💨" },
  { name: "Kote Gaeshi", grade: "3e Kyu", desc: "Retournement poignet", emoji: "🔄" },
  { name: "Kaiten Nage", grade: "2e Kyu", desc: "Projection rotative", emoji: "🌪️" },
];

// Ceintures
const BELTS = [
  { name: "Blanche", grade: "6e Kyu", color: "bg-white border-2 border-slate-300", kanji: "六級" },
  { name: "Jaune", grade: "5e Kyu", color: "bg-yellow-400", kanji: "五級" },
  { name: "Orange", grade: "4e Kyu", color: "bg-orange-500", kanji: "四級" },
  { name: "Verte", grade: "3e Kyu", color: "bg-green-500", kanji: "三級" },
  { name: "Bleue", grade: "2e Kyu", color: "bg-blue-500", kanji: "二級" },
  { name: "Marron", grade: "1er Kyu", color: "bg-amber-700", kanji: "一級" },
  { name: "Noire", grade: "Shodan+", color: "bg-slate-900", kanji: "初段" },
];

// Histoire
const HISTORY = {
  osensei: {
    name: "Morihei Ueshiba",
    title: "O'Sensei (Grand Maître)",
    birth: "1883",
    death: "1969",
    quote: "L'Aïkido n'est pas une technique pour combattre et vaincre l'ennemi. C'est une voie pour réconcilier le monde et faire de l'humanité une seule famille.",
    facts: [
      "Né à Tanabe, Japon",
      "A étudié de nombreux arts martiaux",
      "A créé l'Aïkido en 1942",
      "Signifie 'Voie de l'harmonie'"
    ]
  }
};

// Trophées
const TROPHIES = [
  { name: "Premier Salut", emoji: "🙇", level: "Bronze", desc: "Votre premier rei sincère" },
  { name: "Semaine d'Or", emoji: "🔥", level: "Or", desc: "7 jours consécutifs" },
  { name: "Centurion", emoji: "💯", level: "Argent", desc: "100 techniques pratiquées" },
  { name: "Maître Zen", emoji: "🧘", level: "Légendaire", desc: "10 méditations complètes" },
  { name: "Guide", emoji: "🌟", level: "Or", desc: "Aidez 5 débutants" },
  { name: "Perfection", emoji: "💎", level: "Légendaire", desc: "Score parfait à un examen" },
];

// Défis quotidiens adultes
const CHALLENGES = [
  { name: "Méditation Matinale", xp: 20, emoji: "🧘", desc: "5 min de calme intérieur" },
  { name: "Technique du Jour", xp: 30, emoji: "🥋", desc: "Pratiquer une technique 10x" },
  { name: "Citation Musashi", xp: 15, emoji: "📜", desc: "Réfléchir à une citation" },
  { name: "Journal de Bord", xp: 25, emoji: "📝", desc: "Noter vos réflexions" },
];

export const AdultTutorialBlocks: React.FC<AdultTutorialBlocksProps> = ({
  userName = 'Pratiquant',
  currentGrade = '2e Kyu',
  xp = 0,
  onNavigate,
  onBlockComplete,
  completedBlocks = []
}) => {
  const [previewBlock, setPreviewBlock] = useState<number | null>(null);
  const [tanakaAnimating, setTanakaAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTanakaAnimating(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleBlockAction = (blockId: number, destination: string) => {
    setPreviewBlock(null);
    if (onBlockComplete && !completedBlocks.includes(blockId)) {
      onBlockComplete(blockId);
    }
    if (onNavigate) {
      onNavigate(destination);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // LES 8 BLOCS DU PARCOURS
  // ═══════════════════════════════════════════════════════════════════════════════
  const blocks = [
    // BLOC 1: Bienvenue
    {
      id: 1,
      emoji: '👋',
      title: 'Bienvenue',
      subtitle: 'Rencontrez Maître Tanaka',
      gradient: 'from-emerald-600 to-teal-700',
      shadowColor: 'shadow-emerald-500/30',
      icon: Sparkles,
      destination: 'dashboard',
      previewContent: (
        <div className="space-y-4">
          <div className="flex justify-center">
            <motion.div
              animate={{ y: tanakaAnimating ? [-3, 3, -3] : 0 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-4xl shadow-xl"
            >
              🧙‍♂️
            </motion.div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-white font-semibold mb-2">{TANAKA_WELCOME.greeting}</p>
            <p className="text-emerald-200 text-sm">{TANAKA_WELCOME.intro}</p>
          </div>
          <div className="bg-emerald-600/30 rounded-xl p-3 border border-emerald-400/30">
            <p className="text-white text-sm italic text-center">
              "{TANAKA_WELCOME.explanation}"
            </p>
          </div>
          <p className="text-center text-emerald-200 font-medium text-sm">
            {TANAKA_WELCOME.invitation}
          </p>
        </div>
      )
    },

    // BLOC 2: Mon Profil
    {
      id: 2,
      emoji: '🥷',
      title: 'Mon Profil',
      subtitle: 'Ceinture & statistiques',
      gradient: 'from-violet-600 to-purple-700',
      shadowColor: 'shadow-violet-500/30',
      icon: User,
      destination: 'profil',
      previewContent: (
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-violet-600/30 rounded-xl p-3">
            <div className="text-4xl">🥷</div>
            <div>
              <p className="text-white font-bold">{userName}</p>
              <p className="text-violet-200 text-sm">{xp} XP • {currentGrade}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 rounded-xl p-2 text-center">
              <p className="text-2xl font-bold text-amber-400">{xp}</p>
              <p className="text-white text-xs">XP Total</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2 text-center">
              <p className="text-2xl">🔥</p>
              <p className="text-white text-xs">Série</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2 text-center">
              <p className="text-lg font-bold text-cyan-400">Lv.5</p>
              <p className="text-white text-xs">Niveau</p>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-2">
            <div className="flex justify-between text-xs text-violet-200 mb-1">
              <span>Progression</span>
              <span>68%</span>
            </div>
            <div className="h-2 bg-violet-900 rounded-full overflow-hidden">
              <div className="h-full w-[68%] bg-gradient-to-r from-violet-400 to-purple-400 rounded-full" />
            </div>
          </div>
        </div>
      )
    },

    // BLOC 3: Les Défis
    {
      id: 3,
      emoji: '🎯',
      title: 'Les Défis',
      subtitle: 'Missions quotidiennes',
      gradient: 'from-pink-600 to-rose-700',
      shadowColor: 'shadow-pink-500/30',
      icon: Target,
      destination: 'defis',
      previewContent: (
        <div className="space-y-2">
          {CHALLENGES.map((challenge, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between bg-white/10 rounded-xl p-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{challenge.emoji}</span>
                <div>
                  <p className="text-white font-medium text-sm">{challenge.name}</p>
                  <p className="text-pink-200 text-xs">{challenge.desc}</p>
                </div>
              </div>
              <span className="bg-amber-500 text-slate-900 text-xs px-2 py-1 rounded-full font-bold">
                +{challenge.xp} XP
              </span>
            </motion.div>
          ))}
        </div>
      )
    },

    // BLOC 4: Les 7 Vertus
    {
      id: 4,
      emoji: '☯️',
      title: 'Les 7 Vertus',
      subtitle: 'Valeurs du Bushido',
      gradient: 'from-amber-600 to-orange-700',
      shadowColor: 'shadow-amber-500/30',
      icon: Compass,
      destination: 'vertus',
      previewContent: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {VIRTUES.slice(0, 6).map((virtue, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.03 }}
                className={`bg-gradient-to-br ${virtue.color} rounded-xl p-2 text-center`}
              >
                <span className="text-xl">{virtue.icon}</span>
                <p className="text-white text-xs font-bold mt-1">{virtue.meaning}</p>
                <p className="text-white/70 text-[10px]">{virtue.kanji} • {virtue.name}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-amber-600/30 rounded-xl p-2 text-center">
            <p className="text-amber-100 text-xs">
              Les 7 vertus guident le chemin du guerrier 🥋
            </p>
          </div>
        </div>
      )
    },

    // BLOC 5: Les Techniques
    {
      id: 5,
      emoji: '🥋',
      title: 'Les Techniques',
      subtitle: '206+ mouvements',
      gradient: 'from-cyan-600 to-blue-700',
      shadowColor: 'shadow-cyan-500/30',
      icon: BookOpen,
      destination: 'techniques',
      previewContent: (
        <div className="space-y-2">
          {TECHNIQUES.map((tech, i) => (
            <div key={i} className="flex items-center justify-between bg-white/10 rounded-xl p-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{tech.emoji}</span>
                <div>
                  <span className="text-white font-medium text-sm">{tech.name}</span>
                  <p className="text-cyan-200 text-xs">{tech.desc}</p>
                </div>
              </div>
              <span className="text-cyan-300 text-xs bg-cyan-500/20 px-2 py-1 rounded-full">
                {tech.grade}
              </span>
            </div>
          ))}
          <div className="bg-cyan-600/30 rounded-xl p-2 text-center">
            <p className="text-cyan-100 text-xs">
              <strong>206+</strong> techniques • Jo • Bokken • Tanto
            </p>
          </div>
        </div>
      )
    },

    // BLOC 6: Les Ceintures
    {
      id: 6,
      emoji: '🎖️',
      title: 'Les Ceintures',
      subtitle: 'Progression de grade',
      gradient: 'from-slate-600 to-slate-800',
      shadowColor: 'shadow-slate-500/30',
      icon: Award,
      destination: 'progression',
      previewContent: (
        <div className="space-y-1.5">
          {BELTS.map((belt, i) => (
            <div key={i} className="flex items-center justify-between bg-white/10 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full ${belt.color}`}></span>
                <div>
                  <span className="text-white font-medium text-sm">{belt.name}</span>
                  <span className="text-slate-400 text-xs ml-2">{belt.grade}</span>
                </div>
              </div>
              <span className="text-slate-300 text-xs font-mono">{belt.kanji}</span>
            </div>
          ))}
        </div>
      )
    },

    // BLOC 7: L'Histoire
    {
      id: 7,
      emoji: '📜',
      title: "L'Histoire",
      subtitle: "O'Sensei & l'Aïkido",
      gradient: 'from-amber-700 to-yellow-700',
      shadowColor: 'shadow-amber-600/30',
      icon: Scroll,
      destination: 'histoire',
      previewContent: (
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-amber-600/30 rounded-xl p-3">
            <div className="text-4xl">🥋</div>
            <div>
              <p className="text-white font-bold text-sm">{HISTORY.osensei.name}</p>
              <p className="text-amber-200 text-xs">{HISTORY.osensei.title}</p>
              <p className="text-amber-300 text-xs">{HISTORY.osensei.birth} - {HISTORY.osensei.death}</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-white text-xs italic text-center">
              "{HISTORY.osensei.quote.substring(0, 120)}..."
            </p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {HISTORY.osensei.facts.map((fact, i) => (
              <div key={i} className="bg-amber-500/20 rounded-lg p-1.5 text-center">
                <p className="text-amber-100 text-[10px]">{fact}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },

    // BLOC 8: Mes Trophées
    {
      id: 8,
      emoji: '🏆',
      title: 'Mes Trophées',
      subtitle: 'Badges à collectionner',
      gradient: 'from-yellow-600 to-amber-700',
      shadowColor: 'shadow-yellow-500/30',
      icon: Trophy,
      destination: 'trophees',
      previewContent: (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {TROPHIES.map((trophy, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, rotate: 3 }}
                className="bg-white/10 rounded-xl p-2 text-center"
              >
                <span className="text-2xl">{trophy.emoji}</span>
                <p className="text-white text-[9px] font-bold mt-1">{trophy.name}</p>
                <p className={`text-[8px] mt-0.5 px-1 py-0.5 rounded-full ${
                  trophy.level === 'Légendaire' ? 'bg-purple-500 text-white' :
                  trophy.level === 'Or' ? 'bg-amber-500 text-slate-900' :
                  trophy.level === 'Argent' ? 'bg-slate-400 text-slate-900' :
                  'bg-amber-700 text-white'
                }`}>
                  {trophy.level}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="bg-yellow-600/30 rounded-xl p-2 text-center">
            <p className="text-yellow-100 text-xs">
              <strong>50+ badges</strong> • Bronze • Argent • Or • Légendaire
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6" data-testid="adult-tutorial-blocks">
      {/* Titre */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 flex items-center justify-center gap-2">
          <Shield className="w-5 h-5 text-amber-400" />
          Votre Parcours
        </h2>
        <p className="text-slate-400 text-sm">
          8 étapes pour maîtriser l'application
        </p>
      </div>

      {/* Barre de progression */}
      <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-medium flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            Progression du tutoriel
          </span>
          <span className="text-amber-400 font-bold text-sm">
            {completedBlocks.length} / 8
          </span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedBlocks.length / 8) * 100}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
          />
        </div>
        <div className="flex justify-between mt-2">
          {blocks.map((block) => (
            <div 
              key={block.id}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                completedBlocks.includes(block.id)
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-700 text-slate-500'
              }`}
            >
              {completedBlocks.includes(block.id) ? '✓' : block.id}
            </div>
          ))}
        </div>
      </div>

      {/* Grille des 8 blocs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {blocks.map((block, index) => {
          const isCompleted = completedBlocks.includes(block.id);
          
          return (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPreviewBlock(block.id)}
              className={`
                relative group rounded-2xl p-4 min-h-[130px] overflow-hidden cursor-pointer
                bg-gradient-to-br ${block.gradient} ${block.shadowColor} shadow-lg
                border-2 ${isCompleted ? 'border-emerald-400/50' : 'border-white/20'} 
                hover:border-white/50 transition-all
              `}
            >
              {/* Badge complété */}
              {isCompleted && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Star className="w-3 h-3 text-white" />
                </div>
              )}

              {/* Numéro */}
              <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-sm font-black text-white">{block.id}</span>
              </div>

              {/* Icône voir */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!isCompleted && <Eye className="w-4 h-4 text-white/70" />}
              </div>

              {/* Contenu */}
              <div className="mt-8">
                <span className="text-3xl">{block.emoji}</span>
                <h3 className="font-bold text-white text-sm mt-2 leading-tight">
                  {block.title}
                </h3>
                <p className="text-white/70 text-xs mt-0.5">
                  {block.subtitle}
                </p>
              </div>

              {/* Effet brillance */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.div>
          );
        })}
      </div>

      {/* Modal de prévisualisation */}
      <AnimatePresence>
        {previewBlock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setPreviewBlock(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              {(() => {
                const block = blocks.find(b => b.id === previewBlock);
                if (!block) return null;
                const isCompleted = completedBlocks.includes(block.id);
                
                return (
                  <>
                    {/* Header */}
                    <div className={`bg-gradient-to-br ${block.gradient} p-4`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-xl font-black text-white">{block.id}</span>
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                              <span className="text-xl">{block.emoji}</span>
                              {block.title}
                            </h3>
                            <p className="text-white/70 text-sm">{block.subtitle}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setPreviewBlock(null)}
                          className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="p-4">
                      {block.previewContent}

                      {/* Bouton d'action */}
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <Button
                          onClick={() => handleBlockAction(block.id, block.destination)}
                          className={`w-full font-bold py-3 rounded-xl ${
                            isCompleted 
                              ? 'bg-slate-700 hover:bg-slate-600 text-white'
                              : `bg-gradient-to-r ${block.gradient} hover:opacity-90 text-white`
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <Star className="w-4 h-4 mr-2" />
                              Revoir cette section
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Découvrir
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdultTutorialBlocks;
