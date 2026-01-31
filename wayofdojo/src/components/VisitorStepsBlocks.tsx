'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, X } from 'lucide-react';
import { Button } from './ui/button';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VisitorStepsBlocks - LES 8 BLOCS DU PARCOURS AIKIDO@GAME
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Structure EXACTE de l'ancienne version :
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

interface VisitorStepsBlocksProps {
  mode?: 'enfant' | 'adulte';
  onSignupClick?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DONNÉES RÉELLES DE L'APPLICATION
// ═══════════════════════════════════════════════════════════════════════════════

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
  { name: "Samouraï Ponctuel", xp: 10, emoji: "⏰", desc: "Arrive à l'heure au cours" },
  { name: "Parole du Samouraï", xp: 15, emoji: "🗣️", desc: "Compte en japonais" },
];

// Vraies 7 Vertus avec animaux gardiens
const realVirtues = [
  { name: "Respect", kanji: "礼", romaji: "Rei", emoji: "🙏", animal: "🦁", animalName: "Lion Noble", color: "from-yellow-400 to-amber-500" },
  { name: "Courage", kanji: "勇", romaji: "Yūki", emoji: "💪", animal: "🐯", animalName: "Tigre Brave", color: "from-orange-400 to-red-500" },
  { name: "Maîtrise", kanji: "克", romaji: "Koku", emoji: "🧘", animal: "🐢", animalName: "Tortue Zen", color: "from-green-400 to-emerald-500" },
  { name: "Humilité", kanji: "謙", romaji: "Ken", emoji: "🌱", animal: "🐰", animalName: "Lapin Humble", color: "from-violet-400 to-purple-500" },
  { name: "Bienveillance", kanji: "仁", romaji: "Jin", emoji: "💝", animal: "🐼", animalName: "Panda Gentil", color: "from-pink-400 to-rose-500" },
  { name: "Attention", kanji: "注", romaji: "Chū", emoji: "👁️", animal: "🦉", animalName: "Hibou Vigilant", color: "from-cyan-400 to-blue-500" },
  { name: "Responsabilité", kanji: "責", romaji: "Seki", emoji: "⚖️", animal: "🦅", animalName: "Aigle Royal", color: "from-teal-400 to-cyan-500" },
];

// Vraies ceintures
const realBelts = [
  { name: "Blanche", grade: "6e Kyu", color: "bg-white border-2 border-slate-300", emoji: "⚪", techniques: 15, animal: "🪲", message: "Bienvenue sur le chemin de l'Aïkido" },
  { name: "Jaune", grade: "5e Kyu", color: "bg-yellow-400", emoji: "🟡", techniques: 20, animal: "🪲", message: "Comme le soleil levant, tu commences à briller" },
  { name: "Orange", grade: "4e Kyu", color: "bg-orange-500", emoji: "🟠", techniques: 25, animal: "🐯", message: "Comme la flamme, tu gagnes en intensité" },
  { name: "Verte", grade: "3e Kyu", color: "bg-green-500", emoji: "🟢", techniques: 30, animal: "🐢", message: "Comme l'arbre, tes racines deviennent profondes" },
  { name: "Bleue", grade: "2e Kyu", color: "bg-blue-500", emoji: "🔵", techniques: 35, animal: "🐬", message: "Comme le ciel infini, tes possibilités sont sans limites" },
  { name: "Marron", grade: "1er Kyu", color: "bg-amber-700", emoji: "🟤", techniques: 40, animal: "🦅", message: "Comme la montagne, tu es solide et stable" },
  { name: "Noire", grade: "Shodan", color: "bg-slate-900", emoji: "⚫", techniques: 50, animal: "🐉", message: "Ce n'est pas la fin, mais un nouveau commencement" },
];

// Vrais badges/trophées
const realTrophies = [
  { name: "Premier Salut", emoji: "🙇", desc: "Ton 1er salut sincère", level: "Bronze" },
  { name: "10 Techniques", emoji: "🎯", desc: "Maîtrise 10 techniques", level: "Argent" },
  { name: "Semaine Parfaite", emoji: "🔥", desc: "7 jours d'affilée", level: "Or" },
  { name: "Gardien du Tatami", emoji: "🛡️", desc: "Aide 10 fois au rangement", level: "Bronze" },
  { name: "Lion Noble", emoji: "🦁", desc: "Niveau 5 en Respect", level: "Légendaire" },
  { name: "Maître des Chutes", emoji: "🔄", desc: "100 ukemi réussis", level: "Argent" },
];

// Histoire de l'Aïkido - O'Sensei
const historyContent = {
  osensei: {
    name: "Morihei Ueshiba",
    title: "O'Sensei (Grand Maître)",
    birth: "1883",
    death: "1969",
    quote: "L'Aïkido n'est pas une technique pour combattre et vaincre l'ennemi. C'est une voie pour réconcilier le monde et faire de l'humanité une seule famille.",
    facts: [
      "Né au Japon à Tanabe",
      "A étudié de nombreux arts martiaux",
      "A créé l'Aïkido en 1942",
      "Signifie 'Voie de l'harmonie des énergies'"
    ]
  }
};

// Messages de Maître Tanaka pour l'introduction
const tanakaWelcome = {
  greeting: "Bienvenue dans mon dojo virtuel, jeune ninja !",
  intro: "Je suis Maître Tanaka, ton guide sur la Voie de l'Aïkido.",
  explanation: "Ensemble, nous allons découvrir les secrets des arts martiaux japonais. Tu vas apprendre des techniques, développer les 7 vertus du Budo, et progresser vers ta prochaine ceinture !",
  invitation: "Es-tu prêt à commencer ton aventure ?"
};

export const VisitorStepsBlocks: React.FC<VisitorStepsBlocksProps> = ({ 
  mode = 'enfant', 
  onSignupClick 
}) => {
  const isEnfant = mode === 'enfant';
  const [previewBlock, setPreviewBlock] = useState<number | null>(null);
  const [tanakaAnimating, setTanakaAnimating] = useState(false);

  // Animation de Tanaka
  useEffect(() => {
    const interval = setInterval(() => {
      setTanakaAnimating(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSignupClick = () => {
    setPreviewBlock(null);
    if (onSignupClick) {
      onSignupClick();
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // LES 8 BLOCS DU PARCOURS - ORDRE EXACT
  // ═══════════════════════════════════════════════════════════════════════════════
  const blocks = [
    // ══════════════════════════════════════════════════════════════════════════
    // BLOC 1 : 👋 BIENVENUE - Introduction avec Maître Tanaka
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: 1,
      emoji: '👋',
      title: 'Bienvenue',
      subtitle: 'Rencontre Maître Tanaka',
      gradient: 'from-emerald-500 to-teal-600',
      shadowColor: 'shadow-emerald-500/40',
      destination: 'Tableau de bord',
      previewContent: (
        <div className="space-y-4">
          {/* Avatar Tanaka */}
          <div className="flex justify-center">
            <motion.div
              animate={{ 
                y: tanakaAnimating ? [-5, 5, -5] : 0,
                rotate: tanakaAnimating ? [-2, 2, -2] : 0
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl border-4 border-amber-500/50">
                {/* Image officielle de Tanaka - VERROUILLÉE */}
                <img 
                  src="/images/tanaka/portrait.png" 
                  alt="Maître Tanaka" 
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </motion.div>
          </div>
          
          {/* Message de bienvenue */}
          <div className="bg-white/10 rounded-2xl p-4 text-center">
            <p className="text-white font-bold text-lg mb-2">{tanakaWelcome.greeting}</p>
            <p className="text-emerald-200 text-sm">{tanakaWelcome.intro}</p>
          </div>
          
          {/* Citation */}
          <div className="bg-emerald-600/30 rounded-xl p-3 border border-emerald-400/30">
            <p className="text-white text-sm italic text-center">
              &quot;{tanakaWelcome.explanation}&quot;
            </p>
          </div>
          
          <p className="text-center text-emerald-200 font-semibold">
            {tanakaWelcome.invitation}
          </p>
        </div>
      )
    },

    // ══════════════════════════════════════════════════════════════════════════
    // BLOC 2 : 🥷 MON PROFIL - Voir sa ceinture et stats
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: 2,
      emoji: '🥷',
      title: 'Mon Profil',
      subtitle: 'Ceinture & statistiques',
      gradient: 'from-violet-500 to-purple-600',
      shadowColor: 'shadow-violet-500/40',
      destination: 'Section Profil',
      previewContent: (
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-violet-600/30 rounded-xl p-3">
            <div className="text-5xl">🥷</div>
            <div>
              <p className="text-white font-bold text-lg">Apprenti Ninja</p>
              <p className="text-violet-200 text-sm">125 XP • Ceinture Blanche</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-3xl">🦁</p>
              <p className="text-white text-xs">Animal</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-amber-400">🔥 7</p>
              <p className="text-white text-xs">Série</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-cyan-400">Lv.3</p>
              <p className="text-white text-xs">Niveau</p>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-2">
            <div className="flex justify-between text-xs text-violet-200 mb-1">
              <span>Progression vers 5e Kyu</span>
              <span>65%</span>
            </div>
            <div className="h-2 bg-violet-900 rounded-full overflow-hidden">
              <div className="h-full w-[65%] bg-gradient-to-r from-violet-400 to-purple-400 rounded-full" />
            </div>
          </div>
        </div>
      )
    },

    // ══════════════════════════════════════════════════════════════════════════
    // BLOC 3 : 🎯 LES DÉFIS - Défis quotidiens
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: 3,
      emoji: '🎯',
      title: 'Les Défis',
      subtitle: 'Défis quotidiens',
      gradient: 'from-pink-500 to-rose-600',
      shadowColor: 'shadow-pink-500/40',
      destination: 'Section Défis/Points',
      previewContent: (
        <div className="space-y-2">
          {realChallenges.slice(0, 4).map((challenge, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between bg-white/10 rounded-xl p-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{challenge.emoji}</span>
                <div>
                  <p className="text-white font-bold text-sm">{challenge.name}</p>
                  <p className="text-pink-200 text-[10px]">{challenge.desc}</p>
                </div>
              </div>
              <span className="bg-amber-500 text-slate-900 text-xs px-2 py-1 rounded-full font-bold">
                +{challenge.xp} XP
              </span>
            </motion.div>
          ))}
          <p className="text-center text-pink-200 text-xs mt-2">
            + Le Dojo Virtuel avec 10 mini-jeux ! 🎮
          </p>
        </div>
      )
    },

    // ══════════════════════════════════════════════════════════════════════════
    // BLOC 4 : ☯️ LES 7 VERTUS - Valeurs du ninja
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: 4,
      emoji: '☯️',
      title: 'Les 7 Vertus',
      subtitle: 'Valeurs du Budo',
      gradient: 'from-amber-500 to-orange-600',
      shadowColor: 'shadow-amber-500/40',
      destination: 'Section Vertus',
      previewContent: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {realVirtues.slice(0, 6).map((virtue, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${virtue.color} rounded-xl p-2.5 text-center`}
              >
                <div className="flex justify-center gap-1 text-xl">
                  <span>{virtue.emoji}</span>
                  <span>{virtue.animal}</span>
                </div>
                <p className="text-white text-xs font-bold mt-1">{virtue.name}</p>
                <p className="text-white/70 text-[10px]">{virtue.kanji}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-amber-600/30 rounded-xl p-2 text-center">
            <p className="text-amber-200 text-xs">
              Chaque vertu a son <strong>animal gardien</strong> qui évolue ! 🌟
            </p>
            <p className="text-white text-[10px] mt-1">
              5 niveaux d&apos;évolution par animal
            </p>
          </div>
        </div>
      )
    },

    // ══════════════════════════════════════════════════════════════════════════
    // BLOC 5 : 🥋 LES TECHNIQUES - Mouvements d'Aïkido
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: 5,
      emoji: '🥋',
      title: 'Les Techniques',
      subtitle: '206+ mouvements',
      gradient: 'from-cyan-500 to-blue-600',
      shadowColor: 'shadow-cyan-500/40',
      destination: 'Section Entraînement',
      previewContent: (
        <div className="space-y-2">
          {realTechniques.slice(0, 4).map((tech, i) => (
            <div key={i} className="flex items-center justify-between bg-white/10 rounded-xl p-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{tech.emoji}</span>
                <div>
                  <span className="text-white font-bold text-sm">{tech.name}</span>
                  <p className="text-cyan-200 text-[10px]">{tech.desc}</p>
                </div>
              </div>
              <span className="text-cyan-300 text-xs bg-cyan-500/20 px-2 py-1 rounded-full">
                {tech.grade}
              </span>
            </div>
          ))}
          <div className="bg-cyan-600/30 rounded-xl p-2 mt-2">
            <p className="text-center text-cyan-200 text-xs">
              <strong>206+</strong> techniques à découvrir !
            </p>
            <p className="text-center text-white text-[10px]">
              Jo • Bokken • Tanto • Mains nues
            </p>
          </div>
        </div>
      )
    },

    // ══════════════════════════════════════════════════════════════════════════
    // BLOC 6 : 🎖️ LES CEINTURES - Progression de grade
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: 6,
      emoji: '🎖️',
      title: 'Les Ceintures',
      subtitle: 'Progression de grade',
      gradient: 'from-slate-500 to-slate-700',
      shadowColor: 'shadow-slate-500/40',
      destination: 'Dialogue Ceintures',
      previewContent: (
        <div className="space-y-2">
          {realBelts.map((belt, i) => (
            <div key={i} className="flex items-center justify-between bg-white/10 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full ${belt.color}`}></span>
                <div>
                  <span className="text-white font-medium text-sm">{belt.name}</span>
                  <span className="text-slate-400 text-xs ml-2">{belt.grade}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg">{belt.animal}</span>
                <span className="text-slate-300 text-xs">{belt.techniques} tech.</span>
              </div>
            </div>
          ))}
        </div>
      )
    },

    // ══════════════════════════════════════════════════════════════════════════
    // BLOC 7 : 📜 L'HISTOIRE - O'Sensei et l'Aïkido
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: 7,
      emoji: '📜',
      title: "L'Histoire",
      subtitle: "O'Sensei & l'Aïkido",
      gradient: 'from-amber-600 to-yellow-600',
      shadowColor: 'shadow-amber-600/40',
      destination: 'Section Histoire',
      previewContent: (
        <div className="space-y-3">
          {/* Portrait O'Sensei */}
          <div className="flex items-center gap-3 bg-amber-600/30 rounded-xl p-3">
            <div className="text-5xl">🥋</div>
            <div>
              <p className="text-white font-bold">{historyContent.osensei.name}</p>
              <p className="text-amber-200 text-sm">{historyContent.osensei.title}</p>
              <p className="text-amber-300 text-xs">{historyContent.osensei.birth} - {historyContent.osensei.death}</p>
            </div>
          </div>
          
          {/* Citation */}
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-white text-sm italic text-center">
              &quot;{historyContent.osensei.quote.substring(0, 100)}...&quot;
            </p>
          </div>
          
          {/* Facts */}
          <div className="grid grid-cols-2 gap-2">
            {historyContent.osensei.facts.slice(0, 4).map((fact, i) => (
              <div key={i} className="bg-amber-500/20 rounded-lg p-2 text-center">
                <p className="text-amber-100 text-[10px]">{fact}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },

    // ══════════════════════════════════════════════════════════════════════════
    // BLOC 8 : 🏆 MES TROPHÉES - Badges à collectionner
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: 8,
      emoji: '🏆',
      title: 'Mes Trophées',
      subtitle: 'Badges à collectionner',
      gradient: 'from-yellow-500 to-amber-600',
      shadowColor: 'shadow-yellow-500/40',
      destination: 'Dialogue Trophées',
      previewContent: (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {realTrophies.slice(0, 6).map((trophy, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-white/10 rounded-xl p-2 text-center"
              >
                <span className="text-3xl">{trophy.emoji}</span>
                <p className="text-white text-[10px] font-bold mt-1">{trophy.name}</p>
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
            <p className="text-yellow-200 text-xs">
              <strong>50+ badges</strong> à débloquer !
            </p>
            <p className="text-white text-[10px]">
              Bronze • Argent • Or • Légendaire
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Titre de la section */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          {isEnfant ? '🎯 Ton Parcours Ninja' : '🥋 Votre Parcours'}
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Découvre les 8 étapes de ton aventure
        </p>
      </div>

      {/* Grille des 8 blocs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {blocks.map((block, index) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPreviewBlock(block.id)}
            className={`
              relative group rounded-2xl p-4 sm:p-5 min-h-[150px] sm:min-h-[170px] overflow-hidden cursor-pointer
              bg-gradient-to-br ${block.gradient} ${block.shadowColor} shadow-lg
              border-2 border-white/20 hover:border-white/50 transition-all
            `}
          >
            {/* Numéro du bloc */}
            <div className="absolute top-2 left-2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <span className="text-lg sm:text-xl font-black text-white">{block.id}</span>
            </div>

            {/* Icône "voir" au survol */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye className="w-5 h-5 text-white/70" />
            </div>

            {/* Contenu */}
            <div className="mt-10 sm:mt-11">
              <span className="text-4xl sm:text-5xl">{block.emoji}</span>
              <h3 className="font-black text-white text-base sm:text-lg mt-2 leading-tight">
                {block.title}
              </h3>
              <p className="text-white/70 text-xs sm:text-sm mt-0.5">
                {block.subtitle}
              </p>
            </div>

            {/* Effet brillance au survol */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.div>
        ))}
      </div>

      {/* Dialogue de prévisualisation (Modal personnalisé) */}
      <AnimatePresence>
        {previewBlock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setPreviewBlock(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
            >
              {(() => {
                const block = blocks.find(b => b.id === previewBlock);
                if (!block) return null;
                
                return (
                  <>
                    {/* Header du dialogue */}
                    <div className={`bg-gradient-to-br ${block.gradient} p-4 sm:p-5`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
                            <span className="text-xl font-black text-white">{block.id}</span>
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                              <span className="text-2xl">{block.emoji}</span>
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

                    {/* Contenu du dialogue */}
                    <div className="p-4 sm:p-5">
                      {block.previewContent}

                      {/* Bouton d'inscription */}
                      <div className="mt-5 pt-4 border-t border-slate-700">
                        <Button
                          onClick={handleSignupClick}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3 rounded-xl"
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          {isEnfant ? 'Créer mon compte Ninja !' : 'Commencer mon parcours'}
                        </Button>
                        <p className="text-center text-slate-500 text-xs mt-2">
                          Inscription gratuite • Accès immédiat
                        </p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indication de progression */}
      <div className="text-center">
        <p className="text-slate-500 text-sm">
          Clique sur un bloc pour découvrir son contenu
        </p>
      </div>
    </div>
  );
};

export default VisitorStepsBlocks;
