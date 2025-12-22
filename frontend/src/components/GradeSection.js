import React, { useState } from "react";
import TechniqueCard from "./TechniqueCard";

function GradeSection({ kyu, onViewTechnique, onUpdateMastery, onPractice, isFiltered, originalCount }) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const masteredCount = kyu.techniques.filter(t => t.mastery_level === 'mastered').length;
  const progressPercent = kyu.techniques.length > 0 
    ? Math.round((masteredCount / kyu.techniques.length) * 100) 
    : 0;
  
  const groupedTechniques = {};
  kyu.techniques.forEach(tech => {
    const match = tech.description?.match(/^(SUWARIWAZA|TACHIWAZA|HANMI HANDACHI|USHIRO WAZA|HANMIHANDACHI|GÉNÉRAL)/i);
    const category = match ? match[1].toUpperCase() : 'GÉNÉRAL';
    if (!groupedTechniques[category]) groupedTechniques[category] = [];
    groupedTechniques[category].push(tech);
  });
  
  return (
    <div className="mb-8">
      <div 
        className="sticky top-16 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 py-4 px-4 -mx-4 mb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-12 rounded-full" style={{ backgroundColor: kyu.color }} />
            <div>
              <h2 className="text-xl font-bold text-white">{kyu.name}</h2>
              <p className="text-sm text-slate-400">
                {isFiltered ? (
                  <span>{kyu.techniques.length} / {originalCount} techniques affichées</span>
                ) : (
                  <span>{kyu.techniques.length} techniques • {progressPercent}% maîtrisé</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 text-xs">
              <span className="px-2 py-1 rounded bg-emerald-900/50 text-emerald-400">
                {masteredCount} maîtrisées
              </span>
            </div>
            <svg 
              className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div className="mt-2 w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%`, backgroundColor: kyu.color }}
          />
        </div>
      </div>
      
      {isExpanded && (
        <div className="space-y-6">
          {Object.entries(groupedTechniques).map(([category, techniques]) => (
            <div key={category}>
              {Object.keys(groupedTechniques).length > 1 && (
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
                  {category}
                </h3>
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
          ))}
        </div>
      )}
    </div>
  );
}

export default GradeSection;
