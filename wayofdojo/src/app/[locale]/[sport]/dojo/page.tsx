'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Swords, LogOut, Settings, BookOpen, Target,
  Calendar, Award, MessageCircle, Shield,
  TrendingUp, Flame, Trophy,
  CheckCircle2, Circle, Sparkles
} from 'lucide-react';
import UserDashboardBlocks from '@/components/UserDashboardBlocks';
import MaitreTanaka from '@/components/MaitreTanaka';
import { aikidoConfig } from '@/config/sports/aikido.config';
import { VIRTUES_GAMIFICATION } from '@/constants/virtuesGamification';
import apiService from '@/services/api.service';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  profile: 'jeune_ninja' | 'ninja_confirme';
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

  useEffect(() => {
    const storedUser = localStorage.getItem('wayofdojo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      loadProgress();
    } else {
      router.push(`/${locale}/${sport}/login`);
    }
    setLoading(false);
  }, [locale, sport, router, loadProgress]);

  const handleLogout = () => {
    localStorage.removeItem('wayofdojo_token');
    localStorage.removeItem('wayofdojo_user');
    router.push(`/${locale}`);
  };

  // Complete a challenge
  const handleCompleteChallenge = async (challengeId: string, virtueId: string, xp: number) => {
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

  const isJeuneNinja = user.profile === 'jeune_ninja';
  const isAdmin = user.role === 'admin' || user.role === 'super_admin';

  // Build belt config
  const currentBelt = {
    grade: currentGrade?.displayName || '6e KYU',
    name: currentGrade?.name || 'Ceinture Blanche',
    color: currentGrade?.color || '#FFFFFF',
    gradient: 'from-slate-200 to-white',
    animalSpirit: isJeuneNinja ? '🐣' : '🥋',
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

  // Daily challenges with animation states
  const dailyChallenges = [
    { id: 1, title: '🙇 Salut Parfait', desc: 'Faire un salut sincère', xp: 10, completed: false, virtue: 'respect' },
    { id: 2, title: '🧹 Gardien du Tatami', desc: 'Aider à ranger', xp: 15, completed: false, virtue: 'responsabilite' },
    { id: 3, title: '👂 Oreilles Attentives', desc: 'Écouter le sensei', xp: 10, completed: true, virtue: 'attention' },
    { id: 4, title: '⏰ Ninja Ponctuel', desc: 'Arriver à l\'heure', xp: 5, completed: true, virtue: 'respect' },
    { id: 5, title: '💪 Technique du Jour', desc: 'Pratiquer Ikkyo', xp: 20, completed: false, virtue: 'maitrise' },
    { id: 6, title: '🤝 Bon Partenaire', desc: 'Aider un débutant', xp: 15, completed: false, virtue: 'bienveillance' },
  ];

  const completedCount = dailyChallenges.filter(c => c.completed).length;
  const totalXpToday = dailyChallenges.filter(c => c.completed).reduce((sum, c) => sum + c.xp, 0);

  // Weekly stats
  const weeklyStats = {
    trainings: 3,
    techniques: 12,
    xpGained: 180,
    streakDays: user.gamification.streak || 0,
  };

  // Virtue progress (mock data for now)
  const virtueProgress = user.gamification.virtuesProgress || {
    respect: 45,
    courage: 30,
    maitrise: 60,
    humilite: 25,
    bienveillance: 55,
    attention: 40,
    responsabilite: 35,
  };

  return (
    <div className={`min-h-screen ${isJeuneNinja 
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
              +10 XP
              <Sparkles className="w-8 h-8" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${
        isJeuneNinja 
          ? 'bg-gradient-to-r from-amber-900/90 to-orange-900/90 border-amber-500/20' 
          : 'bg-gradient-to-r from-violet-900/90 to-purple-900/90 border-violet-500/20'
      }`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                isJeuneNinja 
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30' 
                  : 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/30'
              }`}
            >
              <Swords className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <span className="text-lg font-bold text-white">WayofDojo</span>
              <p className={`text-xs ${isJeuneNinja ? 'text-amber-300' : 'text-violet-300'}`}>
                {isJeuneNinja ? 'Mode Jeune Ninja 🥷' : 'Mode Ninja Confirmé'}
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

      <main className="container mx-auto px-4 py-8">
        {/* User Dashboard Blocks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <UserDashboardBlocks
            userName={user.firstName}
            statistics={{
              overall_progress: Math.min(100, user.gamification.completedTechniques?.length * 5 || 0),
              mastered_techniques: user.gamification.completedTechniques?.length || 0,
              practiced_techniques: Math.floor((user.gamification.completedTechniques?.length || 0) * 1.5),
              in_progress_techniques: 3,
            }}
            currentBelt={currentBelt}
            totalPoints={user.gamification.xp}
            xp={user.gamification.xp}
            level={user.gamification.level}
            streak={user.gamification.streak}
          />
        </motion.div>

        {/* Weekly Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6"
        >
          <div className={`rounded-2xl p-4 border ${
            isJeuneNinja 
              ? 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-500/30'
              : 'bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-violet-500/30'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Cette semaine
              </h3>
              <span className="text-xs text-slate-400">Du 13 au 19 Jan</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-2xl font-black text-cyan-400"
                >
                  {weeklyStats.trainings}
                </motion.div>
                <p className="text-xs text-slate-400">Entraînements</p>
              </div>
              <div className="text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="text-2xl font-black text-emerald-400"
                >
                  {weeklyStats.techniques}
                </motion.div>
                <p className="text-xs text-slate-400">Techniques</p>
              </div>
              <div className="text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="text-2xl font-black text-amber-400"
                >
                  +{weeklyStats.xpGained}
                </motion.div>
                <p className="text-xs text-slate-400">XP gagnés</p>
              </div>
              <div className="text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="text-2xl font-black text-orange-400 flex items-center justify-center gap-1"
                >
                  <Flame className="w-5 h-5" />
                  {weeklyStats.streakDays}
                </motion.div>
                <p className="text-xs text-slate-400">Jours de suite</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            {isJeuneNinja ? '🎯 Que veux-tu faire ?' : '⚡ Actions rapides'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Link key={action.label} href={action.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-gradient-to-br ${action.color} rounded-2xl p-5 shadow-xl ${action.shadow} cursor-pointer relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  <motion.div 
                    className="text-4xl mb-3"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  >
                    {action.emoji}
                  </motion.div>
                  <h3 className="text-lg font-bold text-white">{action.label}</h3>
                  <p className="text-xs text-white/70 mt-1">{action.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Daily Challenges - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🔥 Défis du jour
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">
                {completedCount}/{dailyChallenges.length} complétés
              </span>
              <span className="text-sm font-bold text-amber-400">
                +{totalXpToday} XP
              </span>
            </div>
          </div>
          
          {/* Progress bar for challenges */}
          <div className="h-2 bg-slate-700 rounded-full mb-4 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / dailyChallenges.length) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => !challenge.completed && handleCompleteChallenge(challenge.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  challenge.completed
                    ? 'bg-emerald-500/20 border-emerald-500/50'
                    : isJeuneNinja 
                      ? 'bg-amber-900/30 border-amber-700/50 hover:border-amber-500/50' 
                      : 'bg-slate-800/50 border-slate-700 hover:border-violet-500/50'
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
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      </motion.div>
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold ${challenge.completed ? 'text-emerald-400' : 'text-white'}`}>
                      {challenge.title}
                    </h3>
                    <p className="text-sm text-slate-400">{challenge.desc}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        VIRTUES_GAMIFICATION[challenge.virtue]?.bgColor || 'bg-slate-700'
                      } ${VIRTUES_GAMIFICATION[challenge.virtue]?.borderColor || 'border-slate-600'} border`}>
                        {VIRTUES_GAMIFICATION[challenge.virtue]?.emoji} {VIRTUES_GAMIFICATION[challenge.virtue]?.name}
                      </span>
                    </div>
                  </div>
                  <div className={`text-lg font-black ${challenge.completed ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {challenge.completed ? '✓' : `+${challenge.xp}`}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 7 Virtues of Budo - Enhanced with progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🎭 Les 7 Vertus du Budo
            <span className="text-sm font-normal text-slate-400 ml-2">
              Clique pour voir les détails
            </span>
          </h2>
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
                  className={`text-center p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedVirtue === virtue.id
                      ? `bg-gradient-to-br ${virtue.gradient} border-white/30`
                      : isJeuneNinja 
                        ? 'bg-amber-900/30 border-amber-700/50 hover:border-amber-500/50' 
                        : 'bg-slate-800/50 border-slate-700 hover:border-violet-500/50'
                  }`}
                >
                  <motion.div 
                    className="text-3xl mb-1"
                    animate={{ rotate: selectedVirtue === virtue.id ? [0, 10, -10, 0] : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {virtue.emoji}
                  </motion.div>
                  <p className={`text-xs font-bold ${selectedVirtue === virtue.id ? 'text-white' : 'text-white'}`}>
                    {virtue.name}
                  </p>
                  <p className={`text-[10px] ${selectedVirtue === virtue.id ? 'text-white/80' : 'text-slate-400'}`}>
                    {virtue.kanji}
                  </p>
                  
                  {/* Mini progress bar */}
                  <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      className={`h-full rounded-full bg-gradient-to-r ${virtue.gradient}`}
                    />
                  </div>
                  <p className={`text-[10px] mt-1 ${selectedVirtue === virtue.id ? 'text-white' : 'text-slate-500'}`}>
                    {progress}%
                  </p>
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
                className="overflow-hidden mt-4"
              >
                <div className={`p-5 rounded-2xl border bg-gradient-to-br ${VIRTUES_GAMIFICATION[selectedVirtue].gradient}/20 ${VIRTUES_GAMIFICATION[selectedVirtue].borderColor}`}>
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">
                      {VIRTUES_GAMIFICATION[selectedVirtue].animal.evolutions[0].emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {VIRTUES_GAMIFICATION[selectedVirtue].name}
                        <span className="text-sm font-normal text-slate-400">
                          ({VIRTUES_GAMIFICATION[selectedVirtue].kanji} - {VIRTUES_GAMIFICATION[selectedVirtue].romaji})
                        </span>
                      </h3>
                      <p className="text-slate-300 text-sm mt-1">
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

        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Derniers accomplissements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { title: 'Premier Pas', desc: 'Inscription complète', emoji: '🎉', date: 'Aujourd\'hui' },
              { title: 'Premiers XP', desc: '10 XP gagnés', emoji: '⭐', date: 'Aujourd\'hui' },
              { title: 'Curieux', desc: 'Page techniques visitée', emoji: '📚', date: 'Hier' },
              { title: 'Fidèle', desc: '3 jours consécutifs', emoji: '🔥', date: 'En cours' },
            ].map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-xl border ${
                  isJeuneNinja 
                    ? 'bg-amber-900/20 border-amber-700/30' 
                    : 'bg-slate-800/30 border-slate-700/50'
                }`}
              >
                <div className="text-3xl mb-2">{achievement.emoji}</div>
                <h4 className="font-bold text-white text-sm">{achievement.title}</h4>
                <p className="text-xs text-slate-400">{achievement.desc}</p>
                <p className="text-[10px] text-slate-500 mt-1">{achievement.date}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Maître Tanaka */}
      <MaitreTanaka 
        isJeuneNinja={isJeuneNinja}
        messages={isJeuneNinja ? [
          `Super ${user.firstName} ! Tu as ${user.gamification.xp} XP ! 🌟`,
          "Continue comme ça, tu progresses bien !",
          "N'oublie pas tes défis du jour !",
          "Le respect est la première vertu du Ninja.",
          "Entraîne-toi dur et tu deviendras Maître !",
          `Tu as une série de ${user.gamification.streak || 0} jours ! 🔥`,
        ] : [
          `Bienvenue ${user.firstName}.`,
          "Votre progression est enregistrée.",
          "Consultez vos techniques et défis.",
          "La voie du Budo est longue mais gratifiante.",
          "Chaque jour est une opportunité d'apprendre.",
        ]}
      />
    </div>
  );
}
