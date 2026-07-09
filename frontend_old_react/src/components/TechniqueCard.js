import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Sparkles } from "lucide-react";
import { MASTERY_LEVELS } from "@/constants";

function TechniqueCard({ technique, onView }) {
  const mastery = MASTERY_LEVELS[technique.mastery_level] || MASTERY_LEVELS.not_started;
  const MasteryIcon = mastery.icon;
  const isMastered = technique.mastery_level === 'mastered';
  const isLearning = technique.mastery_level === 'learning';
  const isPracticed = technique.mastery_level === 'practiced';
  const isStarted = isLearning || isPracticed || isMastered;
  
  return (
    <Card className={`group relative overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer
      ${isMastered 
        ? 'bg-gradient-to-br from-emerald-900/80 to-green-900/80 border-emerald-500/50 hover:border-emerald-400 shadow-lg shadow-emerald-500/20' 
        : isPracticed 
          ? 'bg-gradient-to-br from-blue-900/80 to-indigo-900/80 border-blue-500/50 hover:border-blue-400 shadow-lg shadow-blue-500/20'
          : isLearning
            ? 'bg-gradient-to-br from-amber-900/80 to-orange-900/80 border-amber-500/50 hover:border-amber-400 shadow-lg shadow-amber-500/20'
            : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
      }`}
      onClick={() => onView(technique)}
    >
      {/* Sparkle effect for mastered */}
      {isMastered && (
        <div className="absolute top-1 right-1">
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
        </div>
      )}
      
      <CardContent className="p-3 md:p-4">
        <div className="flex items-start gap-3">
          {/* Emoji badge */}
          <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl
            ${isMastered 
              ? 'bg-emerald-500/30 animate-bounce' 
              : isPracticed 
                ? 'bg-blue-500/30' 
                : isLearning
                  ? 'bg-amber-500/30'
                  : 'bg-slate-700/50'
            }`}
          >
            {mastery.emoji}
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Technique name */}
            <h4 className={`font-bold text-sm leading-tight mb-1.5 line-clamp-2
              ${isMastered ? 'text-emerald-100' : isPracticed ? 'text-blue-100' : isLearning ? 'text-amber-100' : 'text-white'}
            `}>
              {technique.name}
            </h4>
            
            {/* Status badge */}
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium
              ${isMastered 
                ? 'bg-emerald-500/30 text-emerald-300' 
                : isPracticed 
                  ? 'bg-blue-500/30 text-blue-300' 
                  : isLearning
                    ? 'bg-amber-500/30 text-amber-300'
                    : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              <MasteryIcon className="w-3 h-3" />
              {mastery.label}
            </div>
            
            {/* Practice count */}
            {technique.practice_count > 0 && (
              <div className="mt-2 flex items-center gap-1">
                <span className="text-lg">🔥</span>
                <span className={`text-xs font-medium ${isStarted ? 'text-white/80' : 'text-slate-400'}`}>
                  {technique.practice_count} {technique.practice_count === 1 ? 'séance' : 'séances'}
                </span>
              </div>
            )}
          </div>
          
          {/* View button */}
          <Button 
            size="sm" 
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onView(technique);
            }}
            className={`flex-shrink-0 rounded-full w-8 h-8 p-0
              ${isMastered 
                ? 'text-emerald-300 hover:text-white hover:bg-emerald-600' 
                : isPracticed 
                  ? 'text-blue-300 hover:text-white hover:bg-blue-600' 
                  : isLearning
                    ? 'text-amber-300 hover:text-white hover:bg-amber-600'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default TechniqueCard;
