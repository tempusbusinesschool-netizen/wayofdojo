import React, { useState } from "react";
import TechniqueCard from "./TechniqueCard";

// Category styling with emojis and colors
const CATEGORY_STYLES = {
  'SUWARIWAZA': { emoji: '🧎', color: 'from-purple-500 to-violet-600', label: 'Techniques à genoux' },
  'TACHIWAZA': { emoji: '🧍', color: 'from-blue-500 to-cyan-600', label: 'Techniques debout' },
  'HANMI HANDACHI': { emoji: '🤸', color: 'from-orange-500 to-red-600', label: 'Tori à genoux, Uke debout' },
  'HANMIHANDACHI': { emoji: '🤸', color: 'from-orange-500 to-red-600', label: 'Tori à genoux, Uke debout' },
  'USHIRO WAZA': { emoji: '🔄', color: 'from-pink-500 to-rose-600', label: 'Attaques arrière' },
  'GÉNÉRAL': { emoji: '📚', color: 'from-slate-500 to-slate-600', label: 'Techniques générales' },
  'BOKKEN': { emoji: '⚔️', color: 'from-amber-500 to-yellow-600', label: 'Sabre en bois' },
  'JO': { emoji: '🥢', color: 'from-green-500 to-emerald-600', label: 'Bâton' },
  'TANTO': { emoji: '🗡️', color: 'from-red-500 to-rose-600', label: 'Couteau' },
};

// Belt equivalences for KYU grades
const BELT_EQUIVALENCES = {
  '6e KYU': { belt: 'Blanche', emoji: '⚪', color: '#E5E7EB' },
  '5e KYU': { belt: 'Jaune', emoji: '🟡', color: '#FCD34D' },
  '4e KYU': { belt: 'Orange', emoji: '🟠', color: '#FB923C' },
  '3e KYU': { belt: 'Verte', emoji: '🟢', color: '#22C55E' },
  '2e KYU': { belt: 'Bleue', emoji: '🔵', color: '#3B82F6' },
  '1er KYU': { belt: 'Marron', emoji: '🟤', color: '#92400E' },
  'SHODAN': { belt: 'Noire', emoji: '⚫', color: '#1F2937' },
  'NIDAN': { belt: 'Noire', emoji: '⚫', color: '#1F2937' },
  'SANDAN': { belt: 'Noire', emoji: '⚫', color: '#1F2937' },
  'YONDAN': { belt: 'Noire', emoji: '⚫', color: '#1F2937' },
};

// Helper to find belt equivalence
const getBeltEquivalence = (kyuName) => {
  for (const [key, value] of Object.entries(BELT_EQUIVALENCES)) {
    if (kyuName.toUpperCase().includes(key)) {
      return value;
    }
  }
  return null;
};

function GradeSection({ kyu, onViewTechnique, onUpdateMastery, onPractice, isFiltered, originalCount }) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const masteredCount = kyu.techniques.filter(t => t.mastery_level === 'mastered').length;
  const inProgressCount = kyu.techniques.filter(t => t.mastery_level === 'learning' || t.mastery_level === 'practiced').length;
  const progressPercent = kyu.techniques.length > 0 
    ? Math.round((masteredCount / kyu.techniques.length) * 100) 
    : 0;
  
  // Get belt equivalence for this grade
  const beltInfo = getBeltEquivalence(kyu.name);
  
  const groupedTechniques = {};
  kyu.techniques.forEach(tech => {
    const match = tech.description?.match(/^(SUWARIWAZA|TACHIWAZA|HANMI HANDACHI|USHIRO WAZA|HANMIHANDACHI|GÉNÉRAL|BOKKEN|JO|TANTO)/i);
    const category = match ? match[1].toUpperCase() : 'GÉNÉRAL';
    if (!groupedTechniques[category]) groupedTechniques[category] = [];
    groupedTechniques[category].push(tech);
  });
  
  return (
    <div className="mb-8">
      {/* Header with fun gradient */}
      <div 
        className="sticky top-16 z-10 bg-gradient-to-r from-slate-900/98 via-slate-800/98 to-slate-900/98 backdrop-blur-sm border-b-2 border-slate-700 py-4 px-4 -mx-4 mb-6 cursor-pointer rounded-t-xl"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Colorful grade indicator */}
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110"
              style={{ backgroundColor: beltInfo?.color || kyu.color }}
            >
              <span className="text-2xl font-bold text-white drop-shadow-lg">
                {beltInfo?.emoji || (kyu.name.includes('KYU') ? kyu.name.match(/\d+/)?.[0] || '?' : 
                 kyu.name.includes('DAN') || kyu.name.includes('SHODAN') ? '段' : '🥋')}
              </span>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                {kyu.name}
                {progressPercent === 100 && <span className="text-xl animate-bounce">🎉</span>}
              </h2>
              <p className="text-sm text-slate-400">
                {isFiltered ? (
                  <span className="text-cyan-400">{kyu.techniques.length} / {originalCount} techniques affichées</span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>{kyu.techniques.length} techniques</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-emerald-400">{masteredCount} 🏆</span>
                    {inProgressCount > 0 && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="text-amber-400">{inProgressCount} 📖</span>
                      </>
                    )}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Progress percentage badge */}
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold
              ${progressPercent === 100 
                ? 'bg-emerald-500/30 text-emerald-300' 
                : progressPercent > 50 
                  ? 'bg-blue-500/30 text-blue-300'
                  : progressPercent > 0
                    ? 'bg-amber-500/30 text-amber-300'
                    : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              {progressPercent === 100 ? '✨ Complété !' : `${progressPercent}%`}
            </div>
            <svg 
              className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {/* Animated progress bar */}
        <div className="mt-3 w-full h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progressPercent}%`, backgroundColor: kyu.color }}
          >
            {progressPercent > 0 && (
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
            )}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="space-y-8">
          {Object.entries(groupedTechniques).map(([category, techniques]) => {
            const categoryStyle = CATEGORY_STYLES[category] || CATEGORY_STYLES['GÉNÉRAL'];
            const categoryMastered = techniques.filter(t => t.mastery_level === 'mastered').length;
            
            return (
              <div key={category}>
                {Object.keys(groupedTechniques).length > 1 && (
                  <div className={`mb-4 p-3 rounded-xl bg-gradient-to-r ${categoryStyle.color} shadow-lg`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{categoryStyle.emoji}</span>
                        <div>
                          <h3 className="text-white font-bold text-sm md:text-base uppercase tracking-wide">
                            {category}
                          </h3>
                          <p className="text-white/70 text-xs">{categoryStyle.label}</p>
                        </div>
                      </div>
                      <div className="text-white/90 text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                        {categoryMastered}/{techniques.length} 🏆
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {techniques.map((technique) => (
                    <TechniqueCard
                      key={technique.id}
                      technique={technique}
                      onView={onViewTechnique}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GradeSection;
