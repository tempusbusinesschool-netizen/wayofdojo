'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Award, Calendar, Clock, TrendingUp, Settings, LogOut, Edit3, Star, Target, Flame, Trophy, ChevronRight, HelpCircle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TanakaWelcome, TANAKA_MESSAGES } from '@/components/TanakaWelcome';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PAGE PROFIL UTILISATEUR
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Données simulées du profil
const MOCK_USER = {
  name: 'Thomas Durand',
  email: 'thomas@wayofdojo.com',
  avatar: null,
  joinDate: '2024-03-15',
  currentGrade: '2e Kyu',
  gradeColor: '#3B82F6',
  gradeKanji: '二級',
  xp: 2450,
  xpToNext: 3000,
  dojo: 'Aïkido Paris Centre',
  sensei: 'Marc Lefebvre',
  stats: {
    totalSessions: 156,
    totalHours: 312,
    currentStreak: 12,
    longestStreak: 34,
    techniquesLearned: 89,
    challengesCompleted: 45,
  },
  badges: [
    { id: 'first-rei', name: 'Premier Salut', emoji: '🙇', level: 'bronze', date: '2024-03-15' },
    { id: 'week-streak', name: 'Semaine d\'Or', emoji: '🔥', level: 'gold', date: '2024-06-20' },
    { id: 'centurion', name: 'Centurion', emoji: '💯', level: 'silver', date: '2024-09-10' },
    { id: 'ukemi-master', name: 'Maître Ukemi', emoji: '🌀', level: 'gold', date: '2024-11-05' },
  ],
  recentActivity: [
    { type: 'technique', name: 'Shiho Nage Ura', date: '2025-01-24', xp: 30 },
    { type: 'challenge', name: 'Défi Méditation', date: '2025-01-23', xp: 20 },
    { type: 'session', name: 'Entraînement au dojo', date: '2025-01-22', xp: 50 },
    { type: 'grade', name: 'Passage 2e Kyu réussi', date: '2025-01-15', xp: 500 },
  ],
};

// Ceintures pour la progression
const BELTS = [
  { grade: '6e Kyu', name: 'Blanche', color: '#FFFFFF', border: true },
  { grade: '5e Kyu', name: 'Jaune', color: '#FBBF24' },
  { grade: '4e Kyu', name: 'Orange', color: '#F97316' },
  { grade: '3e Kyu', name: 'Verte', color: '#22C55E' },
  { grade: '2e Kyu', name: 'Bleue', color: '#3B82F6' },
  { grade: '1er Kyu', name: 'Marron', color: '#92400E' },
  { grade: 'Shodan', name: 'Noire', color: '#1F2937' },
];

export default function ProfilPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'fr';
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'badges'>('overview');
  const user = MOCK_USER;

  const currentBeltIndex = BELTS.findIndex(b => b.grade === user.currentGrade);
  const progressPercent = (user.xp / user.xpToNext) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Message d'accueil Tanaka */}
      <TanakaWelcome
        sectionId="profil"
        sectionTitle={TANAKA_MESSAGES['profil'].title}
        message={TANAKA_MESSAGES['profil'].message}
        emoji={TANAKA_MESSAGES['profil'].emoji}
        variant="full"
      />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
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
                🥷 Mon Profil
              </h1>
              <p className="text-sm text-slate-400">Ceinture & statistiques</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/${locale}/aikido/guide`}>
              <Button variant="ghost" size="sm" className="text-amber-300 hover:text-amber-200" data-testid="header-guide-link" title="Guide & Questions">
                <HelpCircle className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Guide</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="hover:bg-slate-800">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Carte profil principale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl p-6 border border-slate-700/50 overflow-hidden"
        >
          {/* Fond décoratif */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-4xl border-4 border-slate-600">
                {user.avatar || '🥋'}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors">
                <Edit3 className="w-4 h-4" />
              </button>
              {/* Badge grade */}
              <div 
                className="absolute -top-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2 border-slate-900"
                style={{ backgroundColor: user.gradeColor }}
              >
                {user.gradeKanji}
              </div>
            </div>

            {/* Infos */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
              <p className="text-slate-400 mb-4">{user.email}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-full text-sm">
                  <Award className="w-4 h-4 text-blue-400" />
                  <span style={{ color: user.gradeColor }}>{user.currentGrade}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-full text-sm">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Membre depuis {new Date(user.joinDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Barre XP */}
              <div className="bg-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Progression vers {BELTS[currentBeltIndex + 1]?.name || 'la maîtrise'}</span>
                  <span className="text-blue-400 font-bold">{user.xp} / {user.xpToNext} XP</span>
                </div>
                <div className="h-3 bg-slate-600 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${user.gradeColor}, ${BELTS[currentBeltIndex + 1]?.color || user.gradeColor})` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl">
          {[
            { id: 'overview', label: 'Aperçu', icon: User },
            { id: 'stats', label: 'Statistiques', icon: TrendingUp },
            { id: 'badges', label: 'Badges', icon: Trophy },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'stats' | 'badges')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu des tabs */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Stats rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Flame, label: 'Série actuelle', value: `${user.stats.currentStreak} jours`, color: 'text-orange-400' },
                { icon: Clock, label: 'Heures totales', value: `${user.stats.totalHours}h`, color: 'text-blue-400' },
                { icon: Target, label: 'Techniques', value: user.stats.techniquesLearned, color: 'text-emerald-400' },
                { icon: Star, label: 'Défis', value: user.stats.challengesCompleted, color: 'text-amber-400' },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-slate-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Activité récente */}
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                Activité récente
              </h3>
              <div className="space-y-3">
                {user.recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        activity.type === 'technique' ? 'bg-blue-500/20' :
                        activity.type === 'challenge' ? 'bg-amber-500/20' :
                        activity.type === 'session' ? 'bg-emerald-500/20' :
                        'bg-purple-500/20'
                      }`}>
                        {activity.type === 'technique' ? '🥋' :
                         activity.type === 'challenge' ? '🎯' :
                         activity.type === 'session' ? '💪' : '🏆'}
                      </div>
                      <div>
                        <div className="font-medium">{activity.name}</div>
                        <div className="text-slate-500 text-sm">{new Date(activity.date).toLocaleDateString('fr-FR')}</div>
                      </div>
                    </div>
                    <div className="text-emerald-400 font-bold">+{activity.xp} XP</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dojo */}
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="font-bold text-lg mb-4">Mon Dojo</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-2xl">
                    🏯
                  </div>
                  <div>
                    <div className="font-bold">{user.dojo}</div>
                    <div className="text-slate-500 text-sm">Sensei: {user.sensei}</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Progression des ceintures */}
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="font-bold text-lg mb-6">Ma Progression</h3>
              <div className="space-y-4">
                {BELTS.map((belt, idx) => {
                  const isCurrentOrPast = idx <= currentBeltIndex;
                  const isCurrent = idx === currentBeltIndex;
                  
                  return (
                    <div key={belt.grade} className="flex items-center gap-4">
                      <div 
                        className={`w-12 h-4 rounded-sm ${belt.border ? 'border border-slate-400' : ''} ${
                          isCurrentOrPast ? '' : 'opacity-30'
                        }`}
                        style={{ backgroundColor: belt.color }}
                      />
                      <div className={`flex-1 ${isCurrentOrPast ? 'text-white' : 'text-slate-500'}`}>
                        <span className="font-medium">{belt.grade}</span>
                        <span className="text-slate-500 ml-2">({belt.name})</span>
                      </div>
                      {isCurrent && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                          Actuel
                        </span>
                      )}
                      {isCurrentOrPast && !isCurrent && (
                        <span className="text-emerald-400">✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Statistiques détaillées */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                <h4 className="font-bold mb-4">Pratique</h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sessions totales</span>
                    <span className="font-bold">{user.stats.totalSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Heures de pratique</span>
                    <span className="font-bold">{user.stats.totalHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Moyenne/session</span>
                    <span className="font-bold">{Math.round(user.stats.totalHours / user.stats.totalSessions * 60)} min</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                <h4 className="font-bold mb-4">Régularité</h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Série actuelle</span>
                    <span className="font-bold text-orange-400">{user.stats.currentStreak} jours 🔥</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Meilleure série</span>
                    <span className="font-bold">{user.stats.longestStreak} jours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Défis complétés</span>
                    <span className="font-bold">{user.stats.challengesCompleted}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'badges' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {user.badges.map((badge) => (
                <div 
                  key={badge.id}
                  className={`rounded-2xl p-5 text-center border ${
                    badge.level === 'gold' ? 'bg-amber-900/20 border-amber-600/30' :
                    badge.level === 'silver' ? 'bg-slate-700/30 border-slate-500/30' :
                    'bg-orange-900/20 border-orange-700/30'
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.emoji}</div>
                  <div className="font-bold text-sm">{badge.name}</div>
                  <div className={`text-xs mt-1 ${
                    badge.level === 'gold' ? 'text-amber-400' :
                    badge.level === 'silver' ? 'text-slate-400' :
                    'text-orange-400'
                  }`}>
                    {badge.level.charAt(0).toUpperCase() + badge.level.slice(1)}
                  </div>
                  <div className="text-slate-500 text-xs mt-2">
                    {new Date(badge.date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center text-slate-500 py-8">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Continuez à pratiquer pour débloquer plus de badges !</p>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-8">
          <Button
            onClick={() => router.push('/fr/aikido/dojo')}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
          >
            Retour au Dojo
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-red-600/30 text-red-400 hover:bg-red-600/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  );
}
