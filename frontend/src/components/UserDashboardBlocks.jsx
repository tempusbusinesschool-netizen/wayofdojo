import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Target, Trophy, Download, Calendar, Flame } from 'lucide-react';

/**
 * UserDashboardBlocks - Présentation en cartes flottantes pour utilisateur connecté
 * Affiche les vraies statistiques de l'utilisateur
 */
const UserDashboardBlocks = ({ 
  userName = "Ninja",
  statistics = {},
  currentBelt = {},
  totalPoints = 0,
  onOpenTimeline,
  onOpenJournal,
  onDownloadPDF,
  onDownloadCSV
}) => {
  // Données des cartes avec les vraies stats de l'utilisateur
  const userBlocks = [
    { 
      emoji: currentBelt?.emoji || "⚪", 
      title: currentBelt?.name || "Ceinture Blanche", 
      subtitle: currentBelt?.grade || "Débutant",
      gradient: "from-amber-500 to-yellow-600",
      glow: "shadow-amber-500/30",
      value: null
    },
    { 
      emoji: "🏆", 
      title: `${statistics.mastered_techniques || 0}`, 
      subtitle: "Maîtrisées",
      gradient: "from-emerald-600 to-green-600",
      glow: "shadow-emerald-500/30",
      value: "techniques"
    },
    { 
      emoji: "🎯", 
      title: `${statistics.practiced_techniques || 0}`, 
      subtitle: "Pratiquées",
      gradient: "from-cyan-600 to-blue-600",
      glow: "shadow-cyan-500/30",
      value: "techniques"
    },
    { 
      emoji: "📖", 
      title: `${statistics.in_progress_techniques || 0}`, 
      subtitle: "En cours",
      gradient: "from-violet-600 to-purple-600",
      glow: "shadow-violet-500/30",
      value: "techniques"
    },
    { 
      emoji: "⭐", 
      title: `${totalPoints}`, 
      subtitle: "Points",
      gradient: "from-rose-600 to-pink-600",
      glow: "shadow-rose-500/30",
      value: "pts"
    }
  ];

  // Calcul de la progression
  const progressPercent = statistics.overall_progress || 0;

  return (
    <div className="space-y-6" data-testid="user-dashboard-blocks">
      {/* Header de bienvenue */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-4 text-8xl">🥷</div>
          <div className="absolute bottom-2 left-4 text-6xl">☯️</div>
        </div>
        
        <div className="relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Message de bienvenue */}
            <div className="text-center md:text-left">
              <p className="text-emerald-200 text-sm mb-1">Bienvenue dans ton espace,</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1">
                {userName} ! 🎌
              </h1>
              <p className="text-white/80 text-sm">
                Continue ton parcours ninja et deviens maître !
              </p>
            </div>
            
            {/* Badge progression circulaire */}
            <div className="relative">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-black text-white">{progressPercent}%</p>
                  <p className="text-emerald-100 text-xs">Progression</p>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 text-2xl animate-bounce">🔥</div>
            </div>
          </div>
        </div>
      </div>

      {/* Titre section stats */}
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
          📊 Ton Tableau de Bord
        </h2>
        <p className="text-slate-400 text-sm">Tes statistiques en temps réel</p>
      </div>

      {/* Cartes flottantes avec stats utilisateur */}
      <div className="flex flex-wrap justify-center gap-4">
        {userBlocks.map((block, idx) => (
          <div 
            key={idx}
            className={`
              relative overflow-hidden rounded-2xl p-5 min-w-[130px] max-w-[160px]
              bg-gradient-to-br ${block.gradient}
              shadow-xl ${block.glow}
              transform hover:scale-110 hover:-translate-y-2 transition-all duration-300
              cursor-pointer group
            `}
          >
            {/* Effet brillant au hover */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
            
            {/* Numéro de position */}
            <div className="absolute top-2 right-2 w-6 h-6 bg-black/20 rounded-full flex items-center justify-center">
              <span className="text-white/80 text-xs font-bold">{idx + 1}</span>
            </div>
            
            <div className="relative text-center">
              <span className="text-4xl block mb-2 group-hover:animate-bounce">{block.emoji}</span>
              <p className="text-white font-black text-xl">{block.title}</p>
              <p className="text-white/70 text-xs">{block.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Barre de progression globale */}
      <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Progression vers le prochain grade
          </span>
          <span className="text-cyan-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>{currentBelt?.grade || "Débutant"}</span>
          <span>Prochain niveau</span>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          onClick={onOpenTimeline}
          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-violet-500/30 h-auto py-3"
        >
          <div className="flex flex-col items-center gap-1">
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Timeline</span>
          </div>
        </Button>
        <Button
          onClick={onOpenJournal}
          className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold shadow-lg shadow-pink-500/30 h-auto py-3"
        >
          <div className="flex flex-col items-center gap-1">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs">Journal</span>
          </div>
        </Button>
        <Button
          onClick={onDownloadPDF}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/30 h-auto py-3"
        >
          <div className="flex flex-col items-center gap-1">
            <Download className="w-5 h-5" />
            <span className="text-xs">PDF</span>
          </div>
        </Button>
        <Button
          onClick={onDownloadCSV}
          className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold shadow-lg shadow-emerald-500/30 h-auto py-3"
        >
          <div className="flex flex-col items-center gap-1">
            <Download className="w-5 h-5" />
            <span className="text-xs">CSV</span>
          </div>
        </Button>
      </div>

      {/* Message motivation */}
      <div className="text-center bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-red-600/20 rounded-xl p-4 border border-amber-500/30">
        <p className="text-amber-300 font-medium">
          🔥 Continue comme ça {userName} !
        </p>
        <p className="text-slate-400 text-sm mt-1">
          Chaque entraînement te rapproche de ton prochain grade ! 🥋✨
        </p>
      </div>
    </div>
  );
};

export default UserDashboardBlocks;
