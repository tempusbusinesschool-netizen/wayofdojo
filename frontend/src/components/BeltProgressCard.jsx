import React, { useState } from 'react';
import { Sparkles, Star, Trophy, Zap } from 'lucide-react';
import { getNextBelt } from '@/constants/aikidoBelts';

/**
 * BeltProgressCard - Affichage ludique et coloré du parcours Aïkido
 * Adapté pour les enfants avec des animations et des encouragements
 */
const BeltProgressCard = ({ currentBelt, totalPoints = 0, onBeltClick }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const nextBelt = getNextBelt(currentBelt);
  
  // Calculer la progression vers le prochain grade
  const pointsForNext = nextBelt ? nextBelt.points - currentBelt.points : 0;
  const currentProgress = nextBelt ? totalPoints - currentBelt.points : 0;
  const progressPercent = nextBelt ? Math.min(100, (currentProgress / pointsForNext) * 100) : 100;

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
    if (onBeltClick) onBeltClick();
  };

  return (
    <div className="mb-6 relative overflow-hidden">
      {/* Étoiles décoratives animées */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-400 animate-pulse"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${15 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.3}s`,
              fontSize: `${12 + (i % 3) * 4}px`
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Carte principale */}
      <div 
        className={`relative p-5 md:p-8 rounded-3xl border-4 cursor-pointer transform transition-all duration-500 hover:scale-[1.02] ${isAnimating ? 'animate-bounce' : ''}`}
        style={{
          background: `linear-gradient(135deg, 
            rgba(99, 102, 241, 0.3) 0%, 
            rgba(168, 85, 247, 0.4) 25%, 
            rgba(236, 72, 153, 0.3) 50%, 
            rgba(251, 146, 60, 0.3) 75%, 
            rgba(250, 204, 21, 0.3) 100%)`,
          borderColor: currentBelt.color,
          boxShadow: `0 0 30px ${currentBelt.color}40, 0 0 60px ${currentBelt.color}20`
        }}
        onClick={handleClick}
      >
        {/* Badge animal esprit */}
        <div className="absolute -top-3 -right-3 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white transform rotate-12 hover:rotate-0 transition-transform">
          <span className="text-3xl md:text-4xl">{currentBelt.animalSpirit}</span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Cercle de la ceinture avec animation */}
          <div className="relative">
            {/* Cercle extérieur animé */}
            <div 
              className="absolute inset-0 rounded-full animate-spin-slow"
              style={{
                background: `conic-gradient(${currentBelt.color}, transparent, ${currentBelt.color})`,
                filter: 'blur(8px)',
                transform: 'scale(1.2)'
              }}
            />
            
            {/* Cercle principal */}
            <div 
              className={`relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br ${currentBelt.gradient} flex items-center justify-center shadow-2xl border-4 border-white/50 transform hover:rotate-12 transition-transform`}
            >
              <span className="text-6xl md:text-7xl drop-shadow-lg">{currentBelt.emoji}</span>
              
              {/* Étoiles qui tournent */}
              <div className="absolute inset-0 animate-spin-slow">
                <Star className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
            </div>

            {/* Points scintillants */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-1 rounded-full shadow-lg border-2 border-white">
              <span className="text-sm md:text-base font-bold text-white flex items-center gap-1">
                <Zap className="w-4 h-4" />
                {totalPoints} pts
              </span>
            </div>
          </div>

          {/* Informations et message */}
          <div className="flex-1 text-center md:text-left space-y-3">
            {/* Titre avec le nom de l'animal */}
            <div className="space-y-1">
              <h3 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
                🥋 Mon Parcours Ninja !
              </h3>
              <p className="text-lg md:text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                <span className="text-2xl">{currentBelt.animalSpirit}</span>
                {currentBelt.animalName}
              </p>
            </div>

            {/* Nom et grade de la ceinture */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 inline-block">
              <p className="text-xl md:text-2xl font-bold text-white">
                {currentBelt.emoji} {currentBelt.name}
              </p>
              <p className="text-amber-300 font-semibold text-sm md:text-base">
                {currentBelt.grade}
              </p>
            </div>

            {/* Message d'encouragement */}
            <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl p-4 border border-white/20">
              <p className="text-white font-medium text-base md:text-lg flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                {currentBelt.funMessage}
              </p>
              <p className="text-cyan-300 text-sm mt-2 italic">
                "{currentBelt.encouragement}"
              </p>
            </div>

            {/* Barre de progression vers le prochain grade */}
            {nextBelt && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80 font-medium">
                    Prochain objectif: <span className="text-amber-400">{nextBelt.emoji} {nextBelt.name}</span>
                  </span>
                  <span className="text-white font-bold">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div className="h-4 bg-black/30 rounded-full overflow-hidden border-2 border-white/20">
                  <div 
                    className="h-full rounded-full relative overflow-hidden transition-all duration-1000"
                    style={{ 
                      width: `${Math.max(progressPercent, 5)}%`,
                      background: `linear-gradient(90deg, ${currentBelt.color}, ${nextBelt.color})`
                    }}
                  >
                    {/* Animation de brillance */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                  </div>
                </div>
                <p className="text-center text-xs text-white/60">
                  Plus que <span className="text-yellow-400 font-bold">{pointsForNext - currentProgress}</span> points pour devenir {nextBelt.animalName} !
                </p>
              </div>
            )}

            {/* Badge de niveau si ceinture noire */}
            {!nextBelt && (
              <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400">
                <Trophy className="w-6 h-6" />
                <span className="font-bold text-lg">Maître Ninja ! Tu as atteint le sommet ! 🏆</span>
              </div>
            )}
          </div>
        </div>

        {/* Message cliquable */}
        <p className="text-center text-white/60 text-xs mt-4 animate-pulse">
          👆 Clique pour voir tous les grades !
        </p>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default BeltProgressCard;
