'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Swords, LogOut, Settings, MessageCircle, Shield, Sparkles
} from 'lucide-react';
import { JuniorDashboard } from '@/components/dashboards/JuniorDashboard';
import { AdultDashboard } from '@/components/dashboards/AdultDashboard';
import TanakaAnimatedLogo from '@/components/animations/TanakaAnimatedLogo';
import MaitreTanaka from '@/components/MaitreTanaka';
import { aikidoConfig } from '@/config/sports/aikido.config';
import apiService from '@/services/api.service';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DojoPage - Page principale du dojo pour les utilisateurs connectés
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Structure refactorisée :
 * - JuniorDashboard : Pour les "Jeune Samouraï" (enfants < 14 ans)
 * - AdultDashboard : Pour les "Samouraï Confirmé" (adultes 14+ ans)
 */

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

  // Complete a challenge (for junior mode)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCompleteChallenge = async (challengeId: string, virtueId: string, _xpReward: number) => {
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

  // Navigation handler for JuniorDashboard
  const handleNavigate = (path: string) => {
    router.push(path);
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

  // Use gamification data if available
  const currentXp = gamificationData?.xp.total ?? user.gamification.xp ?? 0;
  const currentLevel = gamificationData?.level ?? user.gamification.level ?? 1;
  const currentStreak = gamificationData?.streak.current ?? user.gamification.streak ?? 0;

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
          {/* Mobile: Sphère Tanaka "Parle-moi" */}
          <div className="md:hidden flex items-center gap-2">
            <TanakaAnimatedLogo
              size="sm"
              variant="breathing"
              isActive={true}
              showAura={true}
              onClick={() => {
                // Ouvrir Maître Tanaka en modal ou scroll vers lui
                const tanakaEl = document.querySelector('[data-testid="maitre-tanaka"]');
                if (tanakaEl) {
                  tanakaEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
            <span className={`text-sm font-bold ${isJeuneSamourai ? 'text-amber-300' : 'text-violet-300'}`}>
              Parle-moi !
            </span>
          </div>

          {/* Desktop: Logo classique */}
          <Link href={`/${locale}`} className="hidden md:flex items-center gap-3">
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
              data-testid="logout-btn"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* ADULT MODE: Samouraï Confirmé */}
        {!isJeuneSamourai && (
          <AdultDashboard
            xp={currentXp}
            completedMissions={adultCompletedMissions}
            onMissionComplete={handleAdultMissionComplete}
            userName={user.firstName}
            currentGrade={currentGrade?.displayName || '2e Kyu'}
          />
        )}

        {/* JUNIOR MODE: Jeune Samouraï */}
        {isJeuneSamourai && (
          <JuniorDashboard
            user={user}
            locale={locale}
            sport={sport}
            currentXp={currentXp}
            currentLevel={currentLevel}
            currentStreak={currentStreak}
            currentBelt={currentBelt}
            completedChallenges={completedChallenges}
            processingChallenge={processingChallenge}
            onCompleteChallenge={handleCompleteChallenge}
            onNavigate={handleNavigate}
          />
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
