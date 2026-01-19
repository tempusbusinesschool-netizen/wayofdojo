'use client';

import React from 'react';
import { Sparkles, Target, Trophy, Download, Calendar, Flame, Star, Award } from 'lucide-react';

interface Statistics {
  overall_progress?: number;
  mastered_techniques?: number;
  practiced_techniques?: number;
  in_progress_techniques?: number;
}

interface Belt {
  name?: string;
  grade?: string;
  gradient?: string;
  bgColor?: string;
  animalSpirit?: string;
  nextGrade?: string;
}

interface UserDashboardBlocksProps {
  userName?: string;
  statistics?: Statistics;
  currentBelt?: Belt;
  totalPoints?: number;
  xp?: number;
  level?: number;
  streak?: number;
  onOpenTimeline?: () => void;
  onOpenJournal?: () => void;
  onDownloadPDF?: () => void;
  onDownloadCSV?: () => void;
  onNavigateToSection?: (sectionId: string) => void;
}

/**
 * UserDashboardBlocks - Présentation en cartes flottantes pour utilisateur connecté
 * Version améliorée avec design unifié et navigation vers les sections
 */
export const UserDashboardBlocks: React.FC<UserDashboardBlocksProps> = ({ 
  userName = "Ninja",
  statistics = {},
  currentBelt = {},
  totalPoints = 0,
  xp = 0,
  level = 1,
  streak = 0,
  onOpenTimeline,
  onOpenJournal,
  onDownloadPDF,
  onDownloadCSV,
  onNavigateToSection
}) => {
  const progressPercent = statistics.overall_progress || 0;
  const masteredCount = statistics.mastered_techniques || 0;
  const practicedCount = statistics.practiced_techniques || 0;
  const inProgressCount = statistics.in_progress_techniques || 0;

  const handleSectionClick = (sectionId: string) => {
    if (onNavigateToSection) {
      onNavigateToSection(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="space-y-6" data-testid="user-dashboard-blocks">
      
      {/* CARTE PRINCIPALE */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl border border-slate-700 shadow-2xl">
        
        {/* Décoration de fond */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-violet-500/10 to-pink-500/10 rounded-full blur-3xl" />
        
        <div className="relative p-6">
          
          {/* Header - Bienvenue + Ceinture + Progression */}
          <div className="flex flex-col lg:flex-row items-center gap-6 mb-6">
            
            {/* Avatar + Ceinture */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${currentBelt?.gradient || 'from-slate-600 to-slate-700'} flex items-center justify-center shadow-xl border-2 border-white/20`}>
                  <span className="text-4xl">{currentBelt?.animalSpirit || '🥋'}</span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-900 px-2 py-0.5 rounded-full text-xs font-black">
                  {currentBelt?.grade || '6e KYU'}
                </div>
              </div>
              
              <div>
                <p className="text-slate-400 text-sm">Bienvenue,</p>
                <h1 className="text-2xl md:text-3xl font-black text-white">
                  {userName} <span className="text-2xl">🥷</span>
                </h1>
                <p className="text-emerald-400 font-semibold text-sm flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${currentBelt?.bgColor || 'bg-white'}`}></span>
                  {currentBelt?.name || 'Ceinture Blanche'}
                </p>
              </div>
            </div>
            
            {/* Barre de progression circulaire */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-slate-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#progressGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${progressPercent * 3.52} 352`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">{progressPercent}%</span>
                  <span className="text-slate-400 text-xs">Progression</span>
                </div>
                <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1.5 shadow-lg animate-pulse">
                  <Flame className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Séparateur */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-6" />

          {/* Stats en ligne */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Stat 1 - Progression */}
            <button
              onClick={() => handleSectionClick('section-techniques-maitrisees')}
              className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 rounded-2xl p-4 border border-emerald-500/30 text-center group hover:scale-105 transition-transform cursor-pointer hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:animate-bounce">
                <Trophy className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-emerald-400">{masteredCount}</p>
              <p className="text-slate-400 text-xs">Progression</p>
            </button>
            
            {/* Stat 2 - Techniques enseignées */}
            <button
              onClick={() => handleSectionClick('section-techniques-dojo')}
              className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 rounded-2xl p-4 border border-cyan-500/30 text-center group hover:scale-105 transition-transform cursor-pointer hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-cyan-500/20 flex items-center justify-center group-hover:animate-bounce">
                <Target className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="text-3xl font-black text-cyan-400">{practicedCount}</p>
              <p className="text-slate-400 text-xs">Techniques enseignées</p>
            </button>
            
            {/* Stat 3 - En cours */}
            <button
              onClick={() => handleSectionClick('section-techniques-encours')}
              className="bg-gradient-to-br from-violet-600/20 to-violet-800/20 rounded-2xl p-4 border border-violet-500/30 text-center group hover:scale-105 transition-transform cursor-pointer hover:border-violet-400/50 hover:shadow-lg hover:shadow-violet-500/20"
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-violet-500/20 flex items-center justify-center group-hover:animate-bounce">
                <Sparkles className="w-6 h-6 text-violet-400" />
              </div>
              <p className="text-3xl font-black text-violet-400">{inProgressCount}</p>
              <p className="text-slate-400 text-xs">En cours</p>
            </button>
            
            {/* Stat 4 - Points */}
            <button
              onClick={() => handleSectionClick('section-points')}
              className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 rounded-2xl p-4 border border-amber-500/30 text-center group hover:scale-105 transition-transform cursor-pointer hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-500/20"
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-amber-500/20 flex items-center justify-center group-hover:animate-bounce">
                <Star className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-3xl font-black text-amber-400">{totalPoints}</p>
              <p className="text-slate-400 text-xs">Points</p>
            </button>
          </div>

          {/* Barre de progression vers prochain grade */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                Prochain grade
              </span>
              <span className="text-cyan-400 font-bold text-sm">{progressPercent}%</span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.max(3, progressPercent)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-slate-500">
              <span>{currentBelt?.grade || '6e KYU'}</span>
              <span>{currentBelt?.nextGrade || '5e KYU'}</span>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={onOpenTimeline}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-violet-500/20 h-auto py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Calendar className="w-4 h-4" />
              Timeline
            </button>
            <button
              onClick={onOpenJournal}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold shadow-lg shadow-pink-500/20 h-auto py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Journal
            </button>
            <button
              onClick={onDownloadPDF}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20 h-auto py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={onDownloadCSV}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold shadow-lg shadow-emerald-500/20 h-auto py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboardBlocks;
