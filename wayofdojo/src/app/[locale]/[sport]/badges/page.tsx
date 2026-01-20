'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Award, Star, Lock, CheckCircle2,
  Sparkles, Trophy, Filter, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MaitreTanaka from '@/components/MaitreTanaka';
import { VIRTUES_GAMIFICATION, GLOBAL_TROPHIES, SPECIAL_TITLES, Badge as VirtueBadge } from '@/constants/virtuesGamification';

interface User {
  firstName: string;
  profile: string;
  gamification: {
    xp: number;
    level: number;
    badges: string[];
    virtuesProgress: Record<string, number>;
  };
}

interface BadgeWithCategory extends VirtueBadge {
  virtue: string;
  virtueName: string;
  virtueEmoji: string;
  virtueColor: string;
}

type BadgeCategory = 'all' | 'respect' | 'courage' | 'maitrise' | 'humilite' | 'bienveillance' | 'attention' | 'responsabilite' | 'global';

export default function BadgesPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<BadgeWithCategory | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('wayofdojo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push(`/${locale}/${sport}/login`);
    }
    setLoading(false);
  }, [locale, sport, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) return null;

  const isJeuneNinja = user.profile === 'jeune_ninja';
  const earnedBadges = user.gamification.badges || [];

  // Collect all badges from all virtues
  const allBadges: BadgeWithCategory[] = [];
  
  Object.values(VIRTUES_GAMIFICATION).forEach(virtue => {
    virtue.badges.forEach(badge => {
      allBadges.push({
        ...badge,
        virtue: virtue.id,
        virtueName: virtue.name,
        virtueEmoji: virtue.emoji,
        virtueColor: virtue.color,
      });
    });
  });

  // Add global trophies as badges
  GLOBAL_TROPHIES.forEach(trophy => {
    allBadges.push({
      id: trophy.id,
      name: trophy.name,
      description: trophy.description,
      emoji: trophy.emoji,
      condition: trophy.condition,
      virtue: 'global',
      virtueName: 'Trophées',
      virtueEmoji: '🏆',
      virtueColor: '#FCD34D',
    });
  });

  // Filter badges
  let filteredBadges = allBadges;
  
  if (selectedCategory !== 'all') {
    filteredBadges = filteredBadges.filter(b => b.virtue === selectedCategory);
  }
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredBadges = filteredBadges.filter(b => 
      b.name.toLowerCase().includes(query) ||
      b.description.toLowerCase().includes(query)
    );
  }

  // Count stats
  const totalBadges = allBadges.length;
  const earnedCount = allBadges.filter(b => earnedBadges.includes(b.id)).length;

  // Categories for filter
  const categories = [
    { id: 'all' as BadgeCategory, name: 'Tous', emoji: '🎯', count: allBadges.length },
    ...Object.values(VIRTUES_GAMIFICATION).map(v => ({
      id: v.id as BadgeCategory,
      name: v.name,
      emoji: v.emoji,
      count: v.badges.length,
    })),
    { id: 'global' as BadgeCategory, name: 'Trophées', emoji: '🏆', count: GLOBAL_TROPHIES.length },
  ];

  // Get current title
  const currentTitle = SPECIAL_TITLES.find(t => {
    const xpRequired = parseInt(t.condition.replace('total_xp_', '')) || 0;
    return user.gamification.xp >= xpRequired;
  }) || SPECIAL_TITLES[0];

  const nextTitle = SPECIAL_TITLES.find(t => {
    const xpRequired = parseInt(t.condition.replace('total_xp_', '')) || 0;
    return user.gamification.xp < xpRequired;
  });

  return (
    <div className={`min-h-screen ${isJeuneNinja 
      ? 'bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950' 
      : 'bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${
        isJeuneNinja 
          ? 'bg-amber-900/80 border-amber-500/20' 
          : 'bg-violet-900/80 border-violet-500/20'
      }`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/${locale}/${sport}/dojo`} className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                isJeuneNinja 
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30' 
                  : 'bg-gradient-to-br from-violet-400 to-purple-500 shadow-violet-500/30'
              }`}
            >
              <Award className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <span className="text-lg font-bold text-white">Mes Badges</span>
              <p className={`text-xs ${isJeuneNinja ? 'text-amber-300' : 'text-violet-300'}`}>
                Collection de {user.firstName}
              </p>
            </div>
          </Link>

          <Link href={`/${locale}/${sport}/dojo`}>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Retour
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-6 border mb-8 ${
            isJeuneNinja 
              ? 'bg-gradient-to-br from-amber-600/20 to-orange-600/20 border-amber-500/30' 
              : 'bg-gradient-to-br from-violet-600/20 to-purple-600/20 border-violet-500/30'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Current Title */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <div className="text-6xl mb-2">{currentTitle?.emoji}</div>
              <h2 className="text-xl font-bold text-white">{currentTitle?.title}</h2>
              {nextTitle && (
                <p className="text-slate-400 text-sm mt-1">
                  Prochain : {nextTitle.title} ({nextTitle.condition.replace('total_xp_', '')} XP)
                </p>
              )}
            </motion.div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-3xl font-black text-amber-400">{earnedCount}</div>
                <div className="text-xs text-slate-400">Badges obtenus</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-3xl font-black text-violet-400">{totalBadges}</div>
                <div className="text-xs text-slate-400">Total disponible</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-3xl font-black text-emerald-400">
                  {totalBadges > 0 ? Math.round((earnedCount / totalBadges) * 100) : 0}%
                </div>
                <div className="text-xs text-slate-400">Complété</div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Progression collection</span>
              <span className={isJeuneNinja ? 'text-amber-400' : 'text-violet-400'}>
                {earnedCount} / {totalBadges}
              </span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(earnedCount / totalBadges) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  isJeuneNinja 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                    : 'bg-gradient-to-r from-violet-500 to-purple-500'
                }`}
              />
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher un badge..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className={selectedCategory === cat.id 
                  ? (isJeuneNinja ? 'bg-amber-600' : 'bg-violet-600')
                  : 'border-slate-600 text-slate-300'
                }
              >
                <span className="mr-1">{cat.emoji}</span>
                {cat.name}
                <span className="ml-1 text-xs opacity-70">({cat.count})</span>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Badges Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {filteredBadges.map((badge, index) => {
            const isEarned = earnedBadges.includes(badge.id);
            
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => setSelectedBadge(badge)}
                className={`relative p-4 rounded-2xl border cursor-pointer transition-all ${
                  isEarned
                    ? 'bg-gradient-to-br from-amber-600/20 to-orange-600/20 border-amber-500/50'
                    : `${isJeuneNinja ? 'bg-amber-900/20 border-amber-700/30' : 'bg-slate-800/30 border-slate-700/50'} opacity-60`
                }`}
              >
                {/* Earned indicator */}
                {isEarned && (
                  <div className="absolute -top-2 -right-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 bg-slate-900 rounded-full" />
                    </motion.div>
                  </div>
                )}

                {/* Lock for non-earned */}
                {!isEarned && (
                  <div className="absolute top-2 right-2">
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                )}

                {/* Badge content */}
                <div className="text-center">
                  <motion.div 
                    className={`text-4xl mb-2 ${!isEarned && 'grayscale'}`}
                    animate={isEarned ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {badge.emoji}
                  </motion.div>
                  <h3 className={`font-bold text-sm ${isEarned ? 'text-white' : 'text-slate-500'}`}>
                    {badge.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xs">{badge.virtueEmoji}</span>
                    <span className={`text-xs ${isEarned ? 'text-slate-400' : 'text-slate-600'}`}>
                      {badge.virtueName}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty state */}
        {filteredBadges.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Aucun badge trouvé</h3>
            <p className="text-slate-400">Essaie une autre recherche ou catégorie</p>
          </motion.div>
        )}

        {/* Special Titles Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            Titres Spéciaux
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {SPECIAL_TITLES.map((title, index) => {
              const xpRequired = parseInt(title.condition.replace('total_xp_', '')) || 0;
              const isUnlocked = user.gamification.xp >= xpRequired;
              
              return (
                <motion.div
                  key={title.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className={`text-center p-3 rounded-xl border ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-600/20 to-orange-600/20 border-amber-500/50'
                      : 'bg-slate-800/30 border-slate-700/30 opacity-50'
                  }`}
                >
                  <div className={`text-3xl mb-1 ${!isUnlocked && 'grayscale'}`}>{title.emoji}</div>
                  <div className={`text-xs font-bold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                    {title.title}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {xpRequired > 0 ? `${xpRequired} XP` : 'Début'}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-3xl p-6 max-w-sm w-full border ${
                earnedBadges.includes(selectedBadge.id)
                  ? 'bg-gradient-to-br from-amber-900/90 to-orange-900/90 border-amber-500/50'
                  : 'bg-slate-900 border-slate-700'
              }`}
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-7xl mb-4"
                >
                  {selectedBadge.emoji}
                </motion.div>
                
                <h2 className="text-2xl font-black text-white mb-2">{selectedBadge.name}</h2>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl">{selectedBadge.virtueEmoji}</span>
                  <span className="text-slate-400">{selectedBadge.virtueName}</span>
                </div>
                
                <p className="text-slate-300 mb-6">{selectedBadge.description}</p>
                
                {earnedBadges.includes(selectedBadge.id) ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold">Badge obtenu !</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                    <div className="flex items-center justify-center gap-2 text-slate-400 mb-2">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm">Comment obtenir ce badge ?</span>
                    </div>
                    <p className="text-white text-sm">{selectedBadge.condition.replace(/_/g, ' ')}</p>
                  </div>
                )}
                
                <Button
                  onClick={() => setSelectedBadge(null)}
                  className="mt-6 w-full"
                  variant="outline"
                >
                  Fermer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Maître Tanaka */}
      <MaitreTanaka 
        isJeuneNinja={isJeuneNinja}
        messages={[
          `${user.firstName}, tu as ${earnedCount} badges !`,
          "Chaque badge représente un accomplissement.",
          "Continue à pratiquer pour en débloquer plus !",
          currentTitle ? `Tu es un ${currentTitle.title} !` : "Continue ton chemin !",
        ]}
      />
    </div>
  );
}
