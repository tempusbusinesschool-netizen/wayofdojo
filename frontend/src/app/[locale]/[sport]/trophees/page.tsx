'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Lock, Sparkles, Medal, Award, Crown, Target, Users } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TanakaWelcome, TANAKA_MESSAGES } from '@/components/TanakaWelcome';
import { JuniorTropheesPage } from '@/components/junior-pages';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PAGE MES TROPHÉES — BADGES ET ACCOMPLISSEMENTS
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Catégories de trophées
const TROPHY_CATEGORIES = [
  { id: 'all', name: 'Tous', icon: Trophy },
  { id: 'practice', name: 'Pratique', icon: Target },
  { id: 'progress', name: 'Progression', icon: Award },
  { id: 'community', name: 'Communauté', icon: Users },
  { id: 'special', name: 'Spécial', icon: Sparkles },
];

// Définition des trophées
const TROPHIES = [
  // Trophées de pratique
  {
    id: 'first-rei',
    name: 'Premier Salut',
    emoji: '🙇',
    description: 'Effectuer votre premier salut respectueux',
    category: 'practice',
    level: 'bronze',
    xp: 10,
    unlocked: true,
    unlockedDate: '2024-03-15',
    progress: 100,
  },
  {
    id: 'first-ukemi',
    name: 'Première Chute',
    emoji: '🤸',
    description: 'Réussir votre première ukemi (chute)',
    category: 'practice',
    level: 'bronze',
    xp: 20,
    unlocked: true,
    unlockedDate: '2024-03-20',
    progress: 100,
  },
  {
    id: 'week-streak',
    name: "Semaine d'Or",
    emoji: '🔥',
    description: '7 jours consécutifs de pratique',
    category: 'practice',
    level: 'gold',
    xp: 100,
    unlocked: true,
    unlockedDate: '2024-06-20',
    progress: 100,
  },
  {
    id: 'month-streak',
    name: 'Mois de Fer',
    emoji: '⚡',
    description: '30 jours consécutifs de pratique',
    category: 'practice',
    level: 'legendary',
    xp: 500,
    unlocked: false,
    progress: 40,
    progressText: '12/30 jours',
  },
  {
    id: 'centurion',
    name: 'Centurion',
    emoji: '💯',
    description: '100 techniques pratiquées',
    category: 'practice',
    level: 'silver',
    xp: 150,
    unlocked: true,
    unlockedDate: '2024-09-10',
    progress: 100,
  },
  {
    id: 'thousand-rep',
    name: 'Millionnaire',
    emoji: '🎯',
    description: '1000 répétitions de techniques',
    category: 'practice',
    level: 'legendary',
    xp: 1000,
    unlocked: false,
    progress: 67,
    progressText: '672/1000',
  },

  // Trophées de progression
  {
    id: 'first-grade',
    name: 'Premier Grade',
    emoji: '📜',
    description: 'Obtenir votre premier grade (6e Kyu)',
    category: 'progress',
    level: 'bronze',
    xp: 50,
    unlocked: true,
    unlockedDate: '2024-04-15',
    progress: 100,
  },
  {
    id: 'yellow-belt',
    name: 'Ceinture Jaune',
    emoji: '🥋',
    description: 'Atteindre le 5e Kyu',
    category: 'progress',
    level: 'silver',
    xp: 100,
    unlocked: true,
    unlockedDate: '2024-07-20',
    progress: 100,
  },
  {
    id: 'blue-belt',
    name: 'Ceinture Bleue',
    emoji: '🔵',
    description: 'Atteindre le 2e Kyu',
    category: 'progress',
    level: 'gold',
    xp: 300,
    unlocked: true,
    unlockedDate: '2025-01-15',
    progress: 100,
  },
  {
    id: 'shodan',
    name: 'Ceinture Noire',
    emoji: '⬛',
    description: 'Atteindre le grade de Shodan',
    category: 'progress',
    level: 'legendary',
    xp: 1000,
    unlocked: false,
    progress: 0,
    progressText: 'Prochain objectif',
  },
  {
    id: 'weapons-intro',
    name: "L'Armé",
    emoji: '⚔️',
    description: 'Commencer le travail aux armes',
    category: 'progress',
    level: 'silver',
    xp: 75,
    unlocked: true,
    unlockedDate: '2024-10-05',
    progress: 100,
  },
  {
    id: 'jo-master',
    name: 'Maître du Jo',
    emoji: '🪵',
    description: 'Maîtriser les 31 kata de Jo',
    category: 'progress',
    level: 'gold',
    xp: 250,
    unlocked: false,
    progress: 45,
    progressText: '14/31 kata',
  },

  // Trophées communauté
  {
    id: 'first-partner',
    name: 'Premier Partenaire',
    emoji: '🤝',
    description: 'Pratiquer avec 10 partenaires différents',
    category: 'community',
    level: 'bronze',
    xp: 30,
    unlocked: true,
    unlockedDate: '2024-05-10',
    progress: 100,
  },
  {
    id: 'helper',
    name: 'Guide Bienveillant',
    emoji: '🌟',
    description: 'Aider 5 débutants dans leur pratique',
    category: 'community',
    level: 'silver',
    xp: 100,
    unlocked: false,
    progress: 60,
    progressText: '3/5 aidés',
  },
  {
    id: 'dojo-regular',
    name: 'Habitué du Dojo',
    emoji: '🏯',
    description: '50 séances dans votre dojo',
    category: 'community',
    level: 'gold',
    xp: 200,
    unlocked: true,
    unlockedDate: '2024-11-20',
    progress: 100,
  },
  {
    id: 'stage-hunter',
    name: 'Chasseur de Stages',
    emoji: '🎪',
    description: 'Participer à 5 stages internationaux',
    category: 'community',
    level: 'legendary',
    xp: 500,
    unlocked: false,
    progress: 20,
    progressText: '1/5 stages',
  },

  // Trophées spéciaux
  {
    id: 'bushido-master',
    name: 'Maître du Bushido',
    emoji: '☯️',
    description: 'Comprendre les 7 vertus du Bushido',
    category: 'special',
    level: 'gold',
    xp: 200,
    unlocked: false,
    progress: 86,
    progressText: '6/7 vertus',
  },
  {
    id: 'zen-mind',
    name: 'Esprit Zen',
    emoji: '🧘',
    description: '10 méditations complètes',
    category: 'special',
    level: 'silver',
    xp: 75,
    unlocked: true,
    unlockedDate: '2024-12-01',
    progress: 100,
  },
  {
    id: 'perfect-exam',
    name: 'Perfection',
    emoji: '💎',
    description: 'Score parfait à un examen de grade',
    category: 'special',
    level: 'legendary',
    xp: 300,
    unlocked: false,
    progress: 0,
    progressText: 'Pas encore obtenu',
  },
  {
    id: 'history-buff',
    name: "Gardien de l'Histoire",
    emoji: '📖',
    description: "Lire l'histoire complète de l'Aïkido",
    category: 'special',
    level: 'bronze',
    xp: 25,
    unlocked: true,
    unlockedDate: '2024-04-01',
    progress: 100,
  },
];

// Couleurs par niveau
const LEVEL_COLORS = {
  bronze: { bg: 'from-orange-900/30 to-orange-800/20', border: 'border-orange-600/30', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
  silver: { bg: 'from-slate-600/30 to-slate-500/20', border: 'border-slate-400/30', text: 'text-slate-300', glow: 'shadow-slate-400/20' },
  gold: { bg: 'from-amber-900/30 to-yellow-800/20', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/30' },
  legendary: { bg: 'from-purple-900/40 to-violet-800/30', border: 'border-purple-500/40', text: 'text-purple-300', glow: 'shadow-purple-500/30' },
};

export default function TropheesPage() {
  const router = useRouter();
  const params = useParams();
  const _locale = params?.locale as string || 'fr';
  const _sport = params?.sport as string || 'aikido';
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [_selectedTrophy, setSelectedTrophy] = useState<string | null>(null);
  
  // Détection du profil utilisateur
  const [userProfile, setUserProfile] = useState<'jeune_samourai' | 'samourai_confirme' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('wayofdojo_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserProfile(user.profile || 'samourai_confirme');
        } catch {
          setUserProfile('samourai_confirme');
        }
      } else {
        setUserProfile('samourai_confirme');
      }
      setIsLoading(false);
    }
  }, []);

  const filteredTrophies = TROPHIES.filter(t => 
    selectedCategory === 'all' || t.category === selectedCategory
  );

  const unlockedCount = TROPHIES.filter(t => t.unlocked).length;
  const totalXp = TROPHIES.filter(t => t.unlocked).reduce((acc, t) => acc + t.xp, 0);

  // Si profil enfant, afficher la version enfant
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#06101f] flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }
  
  if (userProfile === 'jeune_samourai') {
    return <JuniorTropheesPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Message d'accueil Tanaka */}
      <TanakaWelcome
        sectionId="trophees"
        sectionTitle={TANAKA_MESSAGES['trophees'].title}
        message={TANAKA_MESSAGES['trophees'].message}
        emoji={TANAKA_MESSAGES['trophees'].emoji}
        variant="full"
      />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              🏆 Mes Trophées
            </h1>
            <p className="text-sm text-slate-400">Badges à collectionner</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Statistiques globales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 rounded-2xl p-5 border border-amber-600/30">
            <Trophy className="w-8 h-8 text-amber-400 mb-2" />
            <div className="text-3xl font-bold">{unlockedCount}</div>
            <div className="text-slate-400 text-sm">Trophées débloqués</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-2xl p-5 border border-purple-600/30">
            <Sparkles className="w-8 h-8 text-purple-400 mb-2" />
            <div className="text-3xl font-bold">{totalXp}</div>
            <div className="text-slate-400 text-sm">XP gagnés</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-2xl p-5 border border-emerald-600/30">
            <Star className="w-8 h-8 text-emerald-400 mb-2" />
            <div className="text-3xl font-bold">{Math.round((unlockedCount / TROPHIES.length) * 100)}%</div>
            <div className="text-slate-400 text-sm">Complétion</div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-2xl p-5 border border-blue-600/30">
            <Crown className="w-8 h-8 text-blue-400 mb-2" />
            <div className="text-3xl font-bold">{TROPHIES.filter(t => t.level === 'legendary' && t.unlocked).length}</div>
            <div className="text-slate-400 text-sm">Légendaires</div>
          </div>
        </motion.div>

        {/* Catégories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {TROPHY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Grille des trophées */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTrophies.map((trophy, index) => {
            const colors = LEVEL_COLORS[trophy.level as keyof typeof LEVEL_COLORS];
            
            return (
              <motion.div
                key={trophy.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: trophy.unlocked ? 1.05 : 1 }}
                onClick={() => setSelectedTrophy(trophy.id)}
                className={`relative rounded-2xl p-5 cursor-pointer transition-all border ${
                  trophy.unlocked 
                    ? `bg-gradient-to-br ${colors.bg} ${colors.border} shadow-lg ${colors.glow}`
                    : 'bg-slate-900/50 border-slate-700/50 opacity-60'
                }`}
              >
                {/* Verrou pour trophées non débloqués */}
                {!trophy.unlocked && (
                  <div className="absolute top-2 right-2">
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                )}

                {/* Emoji/Icon */}
                <div className={`text-5xl mb-3 ${trophy.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {trophy.emoji}
                </div>

                {/* Nom et niveau */}
                <h3 className={`font-bold text-sm mb-1 ${trophy.unlocked ? 'text-white' : 'text-slate-500'}`}>
                  {trophy.name}
                </h3>
                <div className={`text-xs ${colors.text} uppercase tracking-wider mb-2`}>
                  {trophy.level}
                </div>

                {/* Barre de progression */}
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${trophy.progress}%` }}
                    transition={{ duration: 0.8, delay: index * 0.05 }}
                    className={`h-full rounded-full ${
                      trophy.unlocked 
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                        : 'bg-gradient-to-r from-slate-500 to-slate-400'
                    }`}
                  />
                </div>

                {/* Texte progression */}
                <div className="text-xs text-slate-500 mt-2">
                  {trophy.unlocked 
                    ? `Obtenu le ${new Date(trophy.unlockedDate!).toLocaleDateString('fr-FR')}`
                    : trophy.progressText || `${trophy.progress}%`
                  }
                </div>

                {/* XP */}
                <div className={`absolute bottom-3 right-3 text-xs font-bold ${colors.text}`}>
                  +{trophy.xp} XP
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Section inspiration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50 text-center"
        >
          <Medal className="w-16 h-16 mx-auto mb-4 text-amber-400" />
          <h3 className="text-xl font-bold mb-3">Continuez votre quête !</h3>
          <p className="text-slate-400 max-w-xl mx-auto mb-6">
            Chaque trophée représente une étape de votre progression sur la Voie. 
            Pratiquez régulièrement, explorez de nouvelles techniques, et débloquez 
            tous les accomplissements.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => router.push('/fr/aikido/dojo-virtuel')}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
            >
              <Target className="w-4 h-4 mr-2" />
              Dojo Virtuel
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/fr/aikido/dojo')}
              className="border-slate-600 hover:bg-slate-800"
            >
              Retour au Dojo
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
