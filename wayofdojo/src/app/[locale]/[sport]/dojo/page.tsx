'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Swords, Trophy, Flame, Star, BookOpen, Target,
  Calendar, Award, LogOut, Settings,
  Zap, TrendingUp, Medal
} from 'lucide-react';
import { aikidoConfig } from '@/config/sports/aikido.config';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profile: 'jeune_ninja' | 'ninja_confirme';
  sport: string;
  grade: string;
  gamification: {
    xp: number;
    level: number;
    streak: number;
    badges: string[];
    completedTechniques: string[];
  };
}

export default function DojoPage() {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem('wayofdojo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push(`/${locale}/${sport}/login`);
    }
    setLoading(false);
  }, [locale, sport, router]);

  const handleLogout = () => {
    localStorage.removeItem('wayofdojo_token');
    localStorage.removeItem('wayofdojo_user');
    router.push(`/${locale}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  const currentGrade = [...aikidoConfig.grades.kyu, ...aikidoConfig.grades.dan].find(
    (g) => g.id === user.grade
  );

  const xpProgress = (user.gamification.xp % 100) / 100 * 100;

  const isJeuneNinja = user.profile === 'jeune_ninja';

  const quickActions = [
    { icon: BookOpen, label: t('navigation.techniques'), href: `/${locale}/${sport}/techniques`, color: 'amber' },
    { icon: Target, label: t('navigation.progression'), href: `/${locale}/${sport}/progression`, color: 'emerald' },
    { icon: Calendar, label: t('navigation.stages'), href: `/${locale}/${sport}/stages`, color: 'cyan' },
    { icon: Award, label: t('navigation.badges'), href: `/${locale}/${sport}/badges`, color: 'violet' },
  ];

  const dailyChallenges = [
    { id: 1, title: 'Pratiquer 3 techniques Ikkyo', xp: 15, completed: false },
    { id: 2, title: 'Réviser les positions Kamae', xp: 10, completed: true },
    { id: 3, title: 'Méditer 5 minutes sur Rei', xp: 5, completed: false },
  ];

  return (
    <div className={`min-h-screen ${isJeuneNinja ? 'bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950' : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Swords className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white hidden sm:block">WayofDojo</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-400">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {isJeuneNinja ? `Salut ${user.firstName} ! 🥷` : `${t('common.welcome')}, ${user.firstName}`}
          </h1>
          <p className="text-slate-400">
            {isJeuneNinja 
              ? "Prêt pour une nouvelle aventure sur le tatami ?" 
              : "Bienvenue dans votre Dojo Virtuel"
            }
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className={isJeuneNinja ? 'bg-amber-900/30 border-amber-700/50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{user.gamification.xp}</p>
                    <p className="text-xs text-slate-400">{t('gamification.xp')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className={isJeuneNinja ? 'bg-amber-900/30 border-amber-700/50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{user.gamification.level}</p>
                    <p className="text-xs text-slate-400">{t('gamification.level')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className={isJeuneNinja ? 'bg-amber-900/30 border-amber-700/50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{user.gamification.streak}</p>
                    <p className="text-xs text-slate-400">{t('gamification.streak')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className={isJeuneNinja ? 'bg-amber-900/30 border-amber-700/50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <Medal className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{user.gamification.badges.length}</p>
                    <p className="text-xs text-slate-400">{t('navigation.badges')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Grade & Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className={isJeuneNinja ? 'bg-amber-900/30 border-amber-700/50' : ''}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center border-4"
                    style={{ 
                      backgroundColor: currentGrade?.color,
                      borderColor: currentGrade?.color === '#FFFFFF' ? '#475569' : currentGrade?.color 
                    }}
                  >
                    {currentGrade?.color === '#000000' && (
                      <span className="text-white font-bold text-xs">{currentGrade.order - 6}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{currentGrade?.displayName}</p>
                    <p className="text-sm text-slate-400">{currentGrade?.name}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Trophy className="w-4 h-4 mr-2" />
                  {t('navigation.progression')}
                </Button>
              </div>

              {/* XP Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Niveau {user.gamification.level}</span>
                  <span className="text-amber-400">{user.gamification.xp % 100} / 100 XP</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">
              {isJeuneNinja ? "🎯 Que veux-tu faire ?" : "Actions rapides"}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <Card className={`h-full hover:border-${action.color}-500/50 transition-colors cursor-pointer ${isJeuneNinja ? 'bg-amber-900/30 border-amber-700/50' : ''}`}>
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className={`w-12 h-12 rounded-xl bg-${action.color}-500/20 flex items-center justify-center mb-3`}>
                        <action.icon className={`w-6 h-6 text-${action.color}-400`} />
                      </div>
                      <p className="font-semibold text-white">{action.label}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Daily Challenges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">
              {isJeuneNinja ? "🔥 Défis du jour" : t('gamification.dailyChallenge')}
            </h2>
            <Card className={isJeuneNinja ? 'bg-amber-900/30 border-amber-700/50' : ''}>
              <CardContent className="p-4 space-y-3">
                {dailyChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className={`p-3 rounded-xl border transition-colors ${
                      challenge.completed
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-slate-800/50 border-slate-700 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          challenge.completed ? 'bg-emerald-500' : 'bg-slate-700'
                        }`}>
                          {challenge.completed ? (
                            <Star className="w-4 h-4 text-white" />
                          ) : (
                            <Target className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <p className={`text-sm ${challenge.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                          {challenge.title}
                        </p>
                      </div>
                      <span className={`text-sm font-semibold ${challenge.completed ? 'text-emerald-400' : 'text-amber-400'}`}>
                        +{challenge.xp} XP
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 7 Virtues */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">{t('gamification.virtues')}</h2>
          <div className="grid grid-cols-7 gap-2">
            {aikidoConfig.gamification.virtues.map((virtue, i) => (
              <Card key={virtue.id} className={`text-center ${isJeuneNinja ? 'bg-amber-900/30 border-amber-700/50' : ''}`}>
                <CardContent className="p-3">
                  <div className="text-2xl mb-1">{virtue.icon}</div>
                  <p className="text-xs font-semibold text-white">{virtue.name}</p>
                  <p className="text-[10px] text-slate-400">{virtue.translation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
