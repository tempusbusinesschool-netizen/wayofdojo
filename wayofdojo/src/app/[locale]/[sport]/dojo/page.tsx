'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Swords, LogOut, Settings, BookOpen, Target,
  Calendar, Award, MessageCircle, Shield,
  Flame, CheckCircle2, Circle, Sparkles
} from 'lucide-react';
import UserDashboardBlocks from '@/components/UserDashboardBlocks';
import MaitreTanaka from '@/components/MaitreTanaka';
import DailyChallengeWidget from '@/components/DailyChallengeWidget';
import { AdultJourneyWidget } from '@/components/adult-journey';
import { aikidoConfig } from '@/config/sports/aikido.config';
import { VIRTUES_GAMIFICATION } from '@/constants/virtuesGamification';
import apiService from '@/services/api.service';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  profile: 'jeune_samourai' | 'samourai_confirme';
  sport: string;
  grade: string;
  gamification: {
    xp: number;
    level: number;
    streak: number;
    badges: string[];
    completedTechniques: string[];
    completedChallenges?: string[];
    virtuesProgress?: Record<string, number>;
  };
}

interface GamificationProgress {
  xp: { total: number; toNextLevel: { current: number; required: number; progress: number } };
  level: number;
  streak: { current: number; status: string };
  badges: { unlocked: number; total: number };
  challenges: { completed: number; list: string[] };
  title: { emoji: string; title: string } | null;
}

export default function DojoPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVirtue, setSelectedVirtue] = useState<string | null>(null);
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [gamificationData, setGamificationData] = useState<GamificationProgress | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [processingChallenge, setProcessingChallenge] = useState<string | null>(null);
  const [adultCompletedMissions, setAdultCompletedMissions] = useState<string[]>([]);

  // Load gamification progress
  const loadProgress = useCallback(async () => {
    try {
      const data = await apiService.getProgress() as { success: boolean; progress: GamificationProgress };
      if (data.success) {
        setGamificationData(data.progress);
        setCompletedChallenges(data.progress.challenges.list || []);
        
        // Update local user data
        const storedUser = localStorage.getItem('wayofdojo_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.gamification = {
            ...userData.gamification,
            xp: data.progress.xp.total,
            level: data.progress.level,
            streak: data.progress.streak.current,
          };
          localStorage.setItem('wayofdojo_user', JSON.stringify(userData));
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  }, []);

  // Load adult journey progress
  const loadAdultJourney = useCallback(async () => {
    try {
      const response = await fetch('/next-api/gamification/adult-journey', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setAdultCompletedMissions(data.adultJourney?.completedMissions || []);
      }
    } catch (error) {
      console.error('Failed to load adult journey:', error);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('wayofdojo_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      loadProgress();
      // Load adult journey for adult users
      if (userData.profile === 'samourai_confirme') {
        loadAdultJourney();
      }
    } else {
      router.push(`/${locale}/${sport}/login`);
    }
    setLoading(false);
  }, [locale, sport, router, loadProgress, loadAdultJourney]);

  // Handle adult mission completion
  const handleAdultMissionComplete = async (missionId: string, xpEarned: number) => {
    try {
      const response = await fetch('/next-api/gamification/adult-journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ missionId, xpReward: xpEarned })
      });
      const data = await response.json();
      if (data.success) {
        setAdultCompletedMissions(data.completedMissions);
        setXpGained(xpEarned);
        setShowXpAnimation(true);
        setTimeout(() => setShowXpAnimation(false), 2500);
        // Reload progress to update XP
        loadProgress();
      }
    } catch (error) {
      console.error('Failed to complete mission:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('wayofdojo_token');
    localStorage.removeItem('wayofdojo_user');
    router.push(`/${locale}`);
  };

  // Complete a challenge
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCompleteChallenge = async (challengeId: string, virtueId: string, xpReward: number) => {
    if (completedChallenges.includes(challengeId) || processingChallenge) return;
    
    setProcessingChallenge(challengeId);
    
    try {
      const data = await apiService.completeChallenge(challengeId, virtueId) as {
        success: boolean;
        xp: { added: number; total: number };
        level: { current: number; levelUp: boolean };
        badges: { newlyUnlocked: Array<{ name: string; emoji: string }> };
      };
      
      if (data.success) {
        // Show XP animation
        setXpGained(data.xp.added);
        setShowXpAnimation(true);
        setTimeout(() => setShowXpAnimation(false), 2500);
        
        // Update completed challenges
        setCompletedChallenges(prev => [...prev, challengeId]);
        
        // Reload progress
        await loadProgress();
        
        // Show level up notification if applicable
        if (data.level.levelUp) {
          alert(`🎉 Niveau ${data.level.current} atteint !`);
        }
        
        // Show new badges
        if (data.badges.newlyUnlocked.length > 0) {
          const badgeNames = data.badges.newlyUnlocked.map(b => `${b.emoji} ${b.name}`).join(', ');
          alert(`🏆 Nouveau badge débloqué : ${badgeNames}`);
        }
      }
    } catch (error) {
      console.error('Failed to complete challenge:', error);
    } finally {
      setProcessingChallenge(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) return null;

  const currentGrade = [...aikidoConfig.grades.kyu, ...aikidoConfig.grades.dan].find(
    (g) => g.id === user.grade
  );

  const isJeuneSamourai = user.profile === 'jeune_samourai';
  const isAdmin = user.role === 'admin' || user.role === 'super_admin';

  // Build belt config
  const currentBelt = {
    grade: currentGrade?.displayName || '6e KYU',
    name: currentGrade?.name || 'Ceinture Blanche',
    color: currentGrade?.color || '#FFFFFF',
    gradient: 'from-slate-200 to-white',
    animalSpirit: isJeuneSamourai ? '🐣' : '🥋',
    nextGrade: '5e KYU',
  };

  // Quick actions
  const quickActions = [
    { 
      icon: BookOpen, 
      label: 'Techniques', 
      href: `/${locale}/${sport}/techniques`,
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/30',
      emoji: '📚',
      description: '64 techniques'
    },
    { 
      icon: Swords, 
      label: 'Mouvements', 
      href: `/${locale}/${sport}/mouvements`,
      color: 'from-rose-500 to-pink-600',
      shadow: 'shadow-rose-500/30',
      emoji: '⚔️',
      description: 'Armes & Mouvements'
    },
    { 
      icon: Target, 
      label: 'Progression', 
      href: `/${locale}/${sport}/progression`,
      color: 'from-emerald-500 to-green-600',
      shadow: 'shadow-emerald-500/30',
      emoji: '🎯',
      description: 'Ton parcours'
    },
    { 
      icon: Calendar, 
      label: 'Stages', 
      href: `/${locale}/${sport}/stages`,
      color: 'from-cyan-500 to-blue-600',
      shadow: 'shadow-cyan-500/30',
      emoji: '📅',
      description: '6 stages'
    },
    { 
      icon: Award, 
      label: 'Badges', 
      href: `/${locale}/${sport}/badges`,
      color: 'from-violet-500 to-purple-600',
      shadow: 'shadow-violet-500/30',
      emoji: '🏆',
      description: `${user.gamification.badges?.length || 0} obtenus`
    },
  ];

  // Daily challenges from virtues (select a few from each virtue)
  const dailyChallenges = [
    // Respect
    { id: 'respect_salut', title: '🙇 Salut Parfait', desc: 'Faire un salut sincère', xp: 10, virtue: 'respect' },
    // Courage
    { id: 'courage_chute', title: '🌪️ Maître des Chutes', desc: 'Tomber sans crainte', xp: 15, virtue: 'courage' },
    // Attention
    { id: 'attention_ecoute', title: '👂 Oreilles Attentives', desc: 'Écouter le sensei', xp: 10, virtue: 'attention' },
    // Responsabilité
    { id: 'responsabilite_rangement', title: '🧹 Gardien du Tatami', desc: 'Aider à ranger', xp: 15, virtue: 'responsabilite' },
    // Maîtrise
    { id: 'maitrise_repetition', title: '💪 Technique du Jour', desc: 'Répéter une technique', xp: 20, virtue: 'maitrise' },
    // Bienveillance
    { id: 'bienveillance_aide', title: '🤝 Bon Partenaire', desc: 'Aider un débutant', xp: 15, virtue: 'bienveillance' },
  ].map(c => ({
    ...c,
    completed: completedChallenges.includes(c.id),
  }));

  const completedCount = dailyChallenges.filter(c => c.completed).length;
  const totalXpToday = dailyChallenges.filter(c => c.completed).reduce((sum, c) => sum + c.xp, 0);

  // Use gamification data if available
  const currentXp = gamificationData?.xp.total ?? user.gamification.xp ?? 0;
  const currentLevel = gamificationData?.level ?? user.gamification.level ?? 1;
  const currentStreak = gamificationData?.streak.current ?? user.gamification.streak ?? 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const badgesUnlocked = gamificationData?.badges.unlocked ?? user.gamification.badges?.length ?? 0;

  // Weekly stats
  const weeklyStats = {
    trainings: 3,
    techniques: gamificationData?.challenges.completed ?? 0,
    xpGained: currentXp,
    streakDays: currentStreak,
  };

  // Virtue progress from gamification data
  const virtueProgress = user.gamification.virtuesProgress || {};

  return (
    <div className={`min-h-screen ${isJeuneSamourai 
      ? 'bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950' 
      : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
    }`}>
      {/* XP Animation Overlay */}
      <AnimatePresence>
        {showXpAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: -50 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="text-4xl font-black text-amber-400 flex items-center gap-2">
              <Sparkles className="w-8 h-8" />
              +{xpGained} XP
              <Sparkles className="w-8 h-8" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${
        isJeuneSamourai 
          ? 'bg-gradient-to-r from-amber-900/90 to-orange-900/90 border-amber-500/20' 
          : 'bg-gradient-to-r from-violet-900/90 to-purple-900/90 border-violet-500/20'
      }`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                isJeuneSamourai 
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30' 
                  : 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/30'
              }`}
            >
              <Swords className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <span className="text-lg font-bold text-white">WayofDojo</span>
              <p className={`text-xs ${isJeuneSamourai ? 'text-amber-300' : 'text-violet-300'}`}>
                {isJeuneSamourai ? 'Mode Jeune Samouraï 🥷' : 'Mode Samouraï Confirmé'}
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            {/* Admin Link */}
            {isAdmin && (
              <Link href={`/${locale}/admin`}>
                <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10">
                  <Shield className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <Settings className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* ADULT MODE: Samouraï Confirmé - Voyage Musashi */}
        {!isJeuneSamourai && (
          <AdultJourneyWidget
            xp={currentXp}
            completedMissions={adultCompletedMissions}
            onMissionComplete={handleAdultMissionComplete}
          />
        )}

        {/* JUNIOR MODE: Jeune Samouraï - Layout en 8 blocs numérotés style aikido@game */}
        {isJeuneSamourai && (
          <div className="space-y-6">
            
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* BLOC PROFIL - Style carte principale */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <UserDashboardBlocks
                userName={user.firstName}
                statistics={{
                  overall_progress: Math.min(100, (currentXp / 10) || 0),
                  mastered_techniques: user.gamification.completedTechniques?.length || 0,
                  practiced_techniques: Math.floor((user.gamification.completedTechniques?.length || 0) * 1.5),
                  in_progress_techniques: completedCount,
                }}
                currentBelt={currentBelt}
                totalPoints={currentXp}
                xp={currentXp}
                level={currentLevel}
                streak={currentStreak}
              />
            </motion.div>

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* 8 BLOCS NUMÉROTÉS - Style aikido@game */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              
              {/* BLOC 1 - Techniques */}
              <Link href={`/${locale}/${sport}/techniques`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="relative group rounded-2xl p-4 sm:p-5 min-h-[160px] sm:min-h-[180px] overflow-hidden cursor-pointer
                    bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/40
                    border-2 border-white/20 hover:border-white/50"
                >
                  {/* Numéro */}
                  <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-xl sm:text-2xl font-black text-white">1</span>
                  </div>
                  {/* Contenu */}
                  <div className="mt-10 sm:mt-12">
                    <span className="text-4xl sm:text-5xl">🥋</span>
                    <h3 className="font-black text-white text-lg sm:text-xl mt-2">Techniques</h3>
                    <p className="text-white/80 text-xs sm:text-sm">206+ techniques</p>
                  </div>
                  {/* Effet brillance */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </motion.div>
              </Link>

              {/* BLOC 2 - Défis du jour */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="relative group rounded-2xl p-4 sm:p-5 min-h-[160px] sm:min-h-[180px] overflow-hidden cursor-pointer
                  bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/40
                  border-2 border-white/20 hover:border-white/50"
              >
                {/* Numéro */}
                <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-white">2</span>
                </div>
                {/* Contenu */}
                <div className="mt-10 sm:mt-12">
                  <span className="text-4xl sm:text-5xl">🎯</span>
                  <h3 className="font-black text-white text-lg sm:text-xl mt-2">Défis du jour</h3>
                  <p className="text-white/80 text-xs sm:text-sm">{completedCount}/6 complétés</p>
                  <div className="flex gap-1 mt-2">
                    {dailyChallenges.slice(0, 3).map((c, i) => (
                      <span key={i} className={`w-3 h-3 rounded-full ${c.completed ? 'bg-white' : 'bg-white/30'}`} />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* BLOC 3 - Les 7 Vertus */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => setSelectedVirtue(selectedVirtue ? null : 'respect')}
                className="relative group rounded-2xl p-4 sm:p-5 min-h-[160px] sm:min-h-[180px] overflow-hidden cursor-pointer
                  bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/40
                  border-2 border-white/20 hover:border-white/50"
              >
                {/* Numéro */}
                <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-white">3</span>
                </div>
                {/* Contenu */}
                <div className="mt-10 sm:mt-12">
                  <span className="text-4xl sm:text-5xl">☯️</span>
                  <h3 className="font-black text-white text-lg sm:text-xl mt-2">7 Vertus</h3>
                  <div className="flex gap-1 mt-2">
                    {Object.values(VIRTUES_GAMIFICATION).slice(0, 5).map((v, i) => (
                      <span key={i} className="text-lg">{v.emoji}</span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* BLOC 4 - Mouvements */}
              <Link href={`/${locale}/${sport}/mouvements`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="relative group rounded-2xl p-4 sm:p-5 min-h-[160px] sm:min-h-[180px] overflow-hidden cursor-pointer
                    bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/40
                    border-2 border-white/20 hover:border-white/50"
                >
                  {/* Numéro */}
                  <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-xl sm:text-2xl font-black text-white">4</span>
                  </div>
                  {/* Contenu */}
                  <div className="mt-10 sm:mt-12">
                    <span className="text-4xl sm:text-5xl">⚔️</span>
                    <h3 className="font-black text-white text-lg sm:text-xl mt-2">Mouvements</h3>
                    <p className="text-white/80 text-xs sm:text-sm">Armes & Ukemi</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </motion.div>
              </Link>

              {/* BLOC 5 - Ceintures */}
              <Link href={`/${locale}/${sport}/progression`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="relative group rounded-2xl p-4 sm:p-5 min-h-[160px] sm:min-h-[180px] overflow-hidden cursor-pointer
                    bg-gradient-to-br from-slate-500 to-slate-700 shadow-lg shadow-slate-500/40
                    border-2 border-white/20 hover:border-white/50"
                >
                  {/* Numéro */}
                  <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-xl sm:text-2xl font-black text-white">5</span>
                  </div>
                  {/* Contenu */}
                  <div className="mt-10 sm:mt-12">
                    <span className="text-4xl sm:text-5xl">🎖️</span>
                    <h3 className="font-black text-white text-lg sm:text-xl mt-2">Ceintures</h3>
                    <div className="flex gap-1 mt-2">
                      {['bg-white', 'bg-yellow-400', 'bg-orange-500', 'bg-green-500', 'bg-blue-500', 'bg-amber-700', 'bg-slate-900'].map((c, i) => (
                        <span key={i} className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${c} border border-white/30`} />
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </motion.div>
              </Link>

              {/* BLOC 6 - Stages */}
              <Link href={`/${locale}/${sport}/stages`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="relative group rounded-2xl p-4 sm:p-5 min-h-[160px] sm:min-h-[180px] overflow-hidden cursor-pointer
                    bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/40
                    border-2 border-white/20 hover:border-white/50"
                >
                  {/* Numéro */}
                  <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-xl sm:text-2xl font-black text-white">6</span>
                  </div>
                  {/* Contenu */}
                  <div className="mt-10 sm:mt-12">
                    <span className="text-4xl sm:text-5xl">📅</span>
                    <h3 className="font-black text-white text-lg sm:text-xl mt-2">Stages</h3>
                    <p className="text-white/80 text-xs sm:text-sm">6 stages à venir</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </motion.div>
              </Link>

              {/* BLOC 7 - Badges & Trophées */}
              <Link href={`/${locale}/${sport}/badges`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="relative group rounded-2xl p-4 sm:p-5 min-h-[160px] sm:min-h-[180px] overflow-hidden cursor-pointer
                    bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg shadow-yellow-500/40
                    border-2 border-white/20 hover:border-white/50"
                >
                  {/* Numéro */}
                  <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-xl sm:text-2xl font-black text-white">7</span>
                  </div>
                  {/* Contenu */}
                  <div className="mt-10 sm:mt-12">
                    <span className="text-4xl sm:text-5xl">🏆</span>
                    <h3 className="font-black text-white text-lg sm:text-xl mt-2">Trophées</h3>
                    <p className="text-white/80 text-xs sm:text-sm">{user.gamification.badges?.length || 0} badges</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </motion.div>
              </Link>

              {/* BLOC 8 - Stats de la semaine */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="relative group rounded-2xl p-4 sm:p-5 min-h-[160px] sm:min-h-[180px] overflow-hidden
                  bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/40
                  border-2 border-white/20"
              >
                {/* Numéro */}
                <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-white">8</span>
                </div>
                {/* Contenu */}
                <div className="mt-10 sm:mt-12">
                  <span className="text-4xl sm:text-5xl">📊</span>
                  <h3 className="font-black text-white text-lg sm:text-xl mt-2">Cette semaine</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-center">
                      <p className="text-xl font-black text-white">{weeklyStats.trainings}</p>
                      <p className="text-white/70 text-[10px]">Entraîn.</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-white flex items-center justify-center gap-1">
                        <Flame className="w-4 h-4" />{currentStreak}
                      </p>
                      <p className="text-white/70 text-[10px]">Jours</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* SECTION DÉFIS DU JOUR - Détaillée */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-5 sm:p-6 border border-pink-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  🎯 Défi du jour
                </h2>
                <span className="text-sm text-slate-400 bg-slate-700 px-3 py-1 rounded-full">
                  +{totalXpToday} XP gagnés
                </span>
              </div>
              <DailyChallengeWidget locale={locale} sport={sport} />
            </motion.div>

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* SECTION MINI-DÉFIS DU BUDO */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-5 sm:p-6 border border-rose-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  🔥 Mini-défis du Budo
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400 bg-slate-700 px-3 py-1 rounded-full">
                    {completedCount}/{dailyChallenges.length} complétés
                  </span>
                  <span className="text-sm font-bold text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full">
                    +{totalXpToday} XP
                  </span>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="h-3 bg-slate-700 rounded-full mb-5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / dailyChallenges.length) * 100}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full"
                />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dailyChallenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => !challenge.completed && !processingChallenge && handleCompleteChallenge(challenge.id, challenge.virtue, challenge.xp)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      challenge.completed
                        ? 'bg-emerald-500/20 border-emerald-500/50'
                        : processingChallenge === challenge.id
                          ? 'bg-amber-500/20 border-amber-500/50 animate-pulse'
                          : 'bg-slate-800/50 border-slate-700 hover:border-amber-500/50 hover:bg-amber-900/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {challenge.completed ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          </motion.div>
                        ) : (
                          <Circle className="w-6 h-6 text-slate-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold ${challenge.completed ? 'text-emerald-400' : 'text-white'}`}>
                          {challenge.title}
                        </h3>
                        <p className="text-sm text-slate-400">{challenge.desc}</p>
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            VIRTUES_GAMIFICATION[challenge.virtue]?.bgColor || 'bg-slate-700'
                          } ${VIRTUES_GAMIFICATION[challenge.virtue]?.borderColor || 'border-slate-600'} border`}>
                            {VIRTUES_GAMIFICATION[challenge.virtue]?.emoji} {VIRTUES_GAMIFICATION[challenge.virtue]?.name}
                          </span>
                        </div>
                      </div>
                      <div className={`text-xl font-black ${challenge.completed ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {challenge.completed ? '✓' : `+${challenge.xp}`}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* SECTION 7 VERTUS DU BUDO */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-5 sm:p-6 border border-amber-500/30"
            >
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                🎭 Les 7 Vertus du Budo
              </h2>
              <p className="text-sm text-slate-400 mb-5">
                Clique sur une vertu pour en apprendre plus
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {Object.values(VIRTUES_GAMIFICATION).map((virtue, index) => {
                  const progress = virtueProgress[virtue.id] || 0;
                  return (
                    <motion.div
                      key={virtue.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      onClick={() => setSelectedVirtue(selectedVirtue === virtue.id ? null : virtue.id)}
                      className={`text-center p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedVirtue === virtue.id
                          ? `bg-gradient-to-br ${virtue.gradient} border-white/30 shadow-lg`
                          : 'bg-slate-800/50 border-slate-700 hover:border-violet-500/50'
                      }`}
                    >
                      <motion.div 
                        className="text-4xl mb-2"
                        animate={{ rotate: selectedVirtue === virtue.id ? [0, 10, -10, 0] : 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {virtue.emoji}
                      </motion.div>
                      <p className="text-sm font-bold text-white">{virtue.name}</p>
                      <p className="text-xs text-slate-400">{virtue.kanji}</p>
                      
                      {/* Progress bar */}
                      <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: 0.75 + index * 0.1 }}
                          className={`h-full rounded-full bg-gradient-to-r ${virtue.gradient}`}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{progress}%</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Expanded Virtue Details */}
              <AnimatePresence>
                {selectedVirtue && VIRTUES_GAMIFICATION[selectedVirtue] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-5"
                  >
                    <div className={`p-5 rounded-2xl border bg-gradient-to-br ${VIRTUES_GAMIFICATION[selectedVirtue].gradient}/20 ${VIRTUES_GAMIFICATION[selectedVirtue].borderColor}`}>
                      <div className="flex items-start gap-4">
                        <div className="text-6xl">
                          {VIRTUES_GAMIFICATION[selectedVirtue].animal.evolutions[0].emoji}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            {VIRTUES_GAMIFICATION[selectedVirtue].name}
                            <span className="text-sm font-normal text-slate-400">
                              ({VIRTUES_GAMIFICATION[selectedVirtue].kanji} - {VIRTUES_GAMIFICATION[selectedVirtue].romaji})
                            </span>
                          </h3>
                          <p className="text-slate-300 mt-2">
                            {VIRTUES_GAMIFICATION[selectedVirtue].messages[1]}
                          </p>
                          
                          {/* Daily challenges for this virtue */}
                          <div className="mt-4">
                            <p className="text-sm font-semibold text-white mb-2">Défis disponibles :</p>
                            <div className="flex flex-wrap gap-2">
                              {VIRTUES_GAMIFICATION[selectedVirtue].dailyChallenges.slice(0, 3).map((challenge) => (
                                <span 
                                  key={challenge.id}
                                  className="text-xs px-3 py-1.5 bg-white/10 rounded-full text-white"
                                >
                                  {challenge.emoji} {challenge.name} (+{challenge.xp} XP)
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        )}
      </main>

      {/* Maître Tanaka - Only for Junior mode */}
      {isJeuneSamourai && (
      <MaitreTanaka 
        isJeuneSamourai={isJeuneSamourai}
        messages={[
          `Super ${user.firstName} ! Tu as ${user.gamification.xp} XP ! 🌟`,
          "Continue comme ça, tu progresses bien !",
          "N'oublie pas tes défis du jour !",
          "Le respect est la première vertu du Samouraï.",
          "Entraîne-toi dur et tu deviendras Maître !",
          `Tu as une série de ${user.gamification.streak || 0} jours ! 🔥`,
        ]}
      />
      )}
    </div>
  );
}
