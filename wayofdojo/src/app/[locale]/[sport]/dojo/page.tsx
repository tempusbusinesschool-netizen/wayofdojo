'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Swords, LogOut, Settings, BookOpen, Target,
  Calendar, Award, Users, MessageCircle
} from 'lucide-react';
import UserDashboardBlocks from '@/components/UserDashboardBlocks';
import MaitreTanaka from '@/components/MaitreTanaka';
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

  // Build belt config
  const currentBelt = {
    grade: currentGrade?.displayName || '6e KYU',
    name: currentGrade?.name || 'Ceinture Blanche',
    color: currentGrade?.color || '#FFFFFF',
    gradient: 'from-slate-200 to-white',
    animalSpirit: '🐣',
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
      emoji: '📚'
    },
    { 
      icon: Target, 
      label: 'Progression', 
      href: `/${locale}/${sport}/progression`,
      color: 'from-emerald-500 to-green-600',
      shadow: 'shadow-emerald-500/30',
      emoji: '🎯'
    },
    { 
      icon: Calendar, 
      label: 'Stages', 
      href: `/${locale}/${sport}/stages`,
      color: 'from-cyan-500 to-blue-600',
      shadow: 'shadow-cyan-500/30',
      emoji: '📅'
    },
    { 
      icon: Award, 
      label: 'Badges', 
      href: `/${locale}/${sport}/badges`,
      color: 'from-violet-500 to-purple-600',
      shadow: 'shadow-violet-500/30',
      emoji: '🏆'
    },
  ];

  // Daily challenges
  const dailyChallenges = [
    { id: 1, title: '🙇 Salut Parfait', desc: 'Faire un salut sincère', xp: 10, completed: false },
    { id: 2, title: '🧹 Gardien du Tatami', desc: 'Aider à ranger', xp: 15, completed: false },
    { id: 3, title: '👂 Oreilles Attentives', desc: 'Écouter le sensei', xp: 10, completed: true },
    { id: 4, title: '⏰ Ninja Ponctuel', desc: 'Arriver à l\'heure', xp: 5, completed: true },
  ];

  return (
    <div className={`min-h-screen ${isJeuneNinja 
      ? 'bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950' 
      : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${
        isJeuneNinja 
          ? 'bg-gradient-to-r from-amber-900/90 to-orange-900/90 border-amber-500/20' 
          : 'bg-gradient-to-r from-violet-900/90 to-purple-900/90 border-violet-500/20'
      }`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
              isJeuneNinja 
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30' 
                : 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/30'
            }`}>
              <Swords className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">WayofDojo</span>
              <p className={`text-xs ${isJeuneNinja ? 'text-amber-300' : 'text-violet-300'}`}>
                {isJeuneNinja ? 'Mode Jeune Ninja 🥷' : 'Mode Ninja Confirmé'}
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
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
        <UserDashboardBlocks
          userName={user.firstName}
          statistics={{
            overall_progress: Math.min(100, user.gamification.completedTechniques.length * 5),
            mastered_techniques: user.gamification.completedTechniques.length,
            practiced_techniques: Math.floor(user.gamification.completedTechniques.length * 1.5),
            in_progress_techniques: 3,
          }}
          currentBelt={currentBelt}
          totalPoints={user.gamification.xp}
          xp={user.gamification.xp}
          level={user.gamification.level}
          streak={user.gamification.streak}
        />

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            {isJeuneNinja ? '🎯 Que veux-tu faire ?' : 'Actions rapides'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Link key={action.label} href={action.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`bg-gradient-to-br ${action.color} rounded-2xl p-5 shadow-xl ${action.shadow} cursor-pointer`}
                >
                  <div className="text-4xl mb-3">{action.emoji}</div>
                  <h3 className="text-lg font-bold text-white">{action.label}</h3>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Daily Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🔥 Défis du jour
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {dailyChallenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-2xl border transition-all ${
                  challenge.completed
                    ? 'bg-emerald-500/20 border-emerald-500/50'
                    : isJeuneNinja 
                      ? 'bg-amber-900/30 border-amber-700/50 hover:border-amber-500/50' 
                      : 'bg-slate-800/50 border-slate-700 hover:border-violet-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-bold ${challenge.completed ? 'text-emerald-400' : 'text-white'}`}>
                      {challenge.title}
                    </h3>
                    <p className="text-sm text-slate-400">{challenge.desc}</p>
                  </div>
                  <div className={`text-lg font-black ${challenge.completed ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {challenge.completed ? '✓' : `+${challenge.xp} XP`}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 7 Virtues of Budo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">🎭 Les 7 Vertus du Budo</h2>
          <div className="grid grid-cols-7 gap-2">
            {aikidoConfig.gamification.virtues.map((virtue) => (
              <motion.div
                key={virtue.id}
                whileHover={{ scale: 1.1, y: -5 }}
                className={`text-center p-3 rounded-xl border ${
                  isJeuneNinja 
                    ? 'bg-amber-900/30 border-amber-700/50' 
                    : 'bg-slate-800/50 border-slate-700'
                } hover:border-violet-500/50 cursor-pointer transition-all`}
              >
                <div className="text-2xl mb-1">{virtue.icon}</div>
                <p className="text-xs font-semibold text-white">{virtue.name}</p>
                <p className="text-[10px] text-slate-400">{virtue.translation}</p>
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
        ] : [
          `Bienvenue ${user.firstName}.`,
          "Votre progression est enregistrée.",
          "Consultez vos techniques et défis.",
          "La voie du Budo est longue mais gratifiante.",
        ]}
      />
    </div>
  );
}
