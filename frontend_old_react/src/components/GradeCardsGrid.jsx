import React from 'react';

// Styles pour chaque grade
const GRADE_STYLES = {
  '5e KYU': { emoji: '🟡', gradient: 'from-yellow-400 to-yellow-600', glow: 'shadow-yellow-500/40', rank: 'Débutant', belt: 'Jaune', animal: '🐥' },
  '4e KYU': { emoji: '🟠', gradient: 'from-orange-400 to-orange-600', glow: 'shadow-orange-500/40', rank: 'Apprenti', belt: 'Orange', animal: '🐯' },
  '3e KYU': { emoji: '🟢', gradient: 'from-green-500 to-green-700', glow: 'shadow-green-500/40', rank: 'Avancé', belt: 'Verte', animal: '🐢' },
  '2e KYU': { emoji: '🔵', gradient: 'from-blue-500 to-blue-700', glow: 'shadow-blue-500/40', rank: 'Expert', belt: 'Bleue', animal: '🐬' },
  '1er KYU': { emoji: '🟤', gradient: 'from-amber-700 to-amber-900', glow: 'shadow-amber-500/40', rank: 'Pré-Dan', belt: 'Marron', animal: '🦅' },
  'SHODAN': { emoji: '⚫', gradient: 'from-slate-700 to-slate-900', glow: 'shadow-slate-500/40', rank: '1er Dan', belt: 'Noire', animal: '🐉' },
  'NIDAN': { emoji: '⚫', gradient: 'from-slate-600 to-slate-800', glow: 'shadow-slate-500/40', rank: '2e Dan', belt: 'Noire', animal: '🐉' },
  'SANDAN': { emoji: '⚫', gradient: 'from-slate-600 to-slate-800', glow: 'shadow-slate-500/40', rank: '3e Dan', belt: 'Noire', animal: '🐉' },
  'YONDAN': { emoji: '⚫', gradient: 'from-slate-600 to-slate-800', glow: 'shadow-slate-500/40', rank: '4e Dan', belt: 'Noire', animal: '🐉' },
  'BOKKEN': { emoji: '⚔️', gradient: 'from-cyan-500 to-blue-600', glow: 'shadow-cyan-500/40', rank: 'Sabre', belt: null, animal: '🗡️' },
  'Déplacements': { emoji: '🦶', gradient: 'from-pink-500 to-fuchsia-600', glow: 'shadow-pink-500/40', rank: 'Bases', belt: null, animal: '🐱' },
};

const DEFAULT_STYLE = { 
  emoji: '✨', 
  gradient: 'from-indigo-500 to-purple-600', 
  glow: 'shadow-indigo-500/40',
  rank: 'Grade',
  belt: null,
  animal: '⭐'
};

/**
 * GradeCard - Carte individuelle pour un grade
 */
const GradeCard = ({ level, onClick }) => {
  const styleKey = Object.keys(GRADE_STYLES).find(key => level.name.includes(key));
  const style = styleKey ? GRADE_STYLES[styleKey] : DEFAULT_STYLE;
  
  const isComplete = level.progress_percentage === 100;
  const isStarted = level.progress_percentage > 0;

  return (
    <div 
      className={`relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${style.glow} shadow-lg`}
      onClick={() => onClick && onClick(level.name)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-90`} />
      
      {/* Badge de complétion */}
      {isComplete && (
        <div className="absolute top-2 right-2 text-2xl animate-pulse">🎉</div>
      )}
      
      {/* Animal badge */}
      <div className="absolute top-2 left-2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">
        {style.animal}
      </div>
      
      <div className="relative p-3 md:p-4 pt-10">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl md:text-3xl ${isComplete ? 'animate-bounce' : ''}`}>
            {style.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <h4 className="font-bold text-white text-sm md:text-base truncate pr-2">
                {level.name}
                {style.belt && (
                  <span className="ml-2 text-xs font-normal opacity-90">
                    (Ceinture {style.belt})
                  </span>
                )}
              </h4>
              <span className="text-white/80 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
                {style.rank}
              </span>
            </div>
            
            {/* Barre de progression */}
            <div className="mt-2 h-3 md:h-4 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-white/80 to-white/60 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${Math.max(level.progress_percentage, 2)}%` }}
              >
                {level.progress_percentage > 10 && (
                  <div className="absolute inset-0 bg-white/30 animate-pulse" />
                )}
              </div>
            </div>
            
            {/* Statut */}
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-white/90 font-medium">
                {isComplete ? '✅ Complété !' : isStarted ? '🚀 En cours...' : '💤 À débloquer'}
              </span>
              <span className="text-white font-bold bg-white/20 px-2 py-0.5 rounded-full">
                {level.mastered}/{level.total} • {level.progress_percentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * GradeCardsGrid - Grille des grades avec toutes les cartes
 */
const GradeCardsGrid = ({ techniquesByLevel = [], onGradeClick }) => {
  if (!techniquesByLevel || techniquesByLevel.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>📚 Aucune donnée de grade disponible</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-cyan-300 mb-4 flex items-center gap-2">
        📋 Tous les grades
        <span className="text-xs bg-cyan-500/20 px-2 py-1 rounded-full">
          {techniquesByLevel.length} niveaux
        </span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {techniquesByLevel.map((level, index) => (
          <GradeCard 
            key={index} 
            level={level} 
            onClick={onGradeClick}
          />
        ))}
      </div>
    </div>
  );
};

export default GradeCardsGrid;
