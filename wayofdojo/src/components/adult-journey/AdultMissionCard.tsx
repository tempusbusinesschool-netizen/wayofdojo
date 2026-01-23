'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, Swords, Brain, Heart, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Mission, MissionType } from '@/data/musashi/journey';

interface AdultMissionCardProps {
  mission: Mission;
  cityColor: string;
  onComplete?: (missionId: string, choiceId?: string) => void;
  isLocked?: boolean;
}

const missionTypeConfig: Record<MissionType, { icon: React.ComponentType<{ className?: string }>; label: string; color: string }> = {
  technique: { icon: Swords, label: 'Technique', color: 'from-blue-500 to-blue-700' },
  strategie: { icon: Brain, label: 'Stratégie', color: 'from-amber-500 to-amber-700' },
  interieure: { icon: Heart, label: 'Intérieure', color: 'from-purple-500 to-purple-700' },
};

export function AdultMissionCard({ mission, cityColor, onComplete, isLocked = false }: AdultMissionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(mission.completed || false);

  const config = missionTypeConfig[mission.type];
  const Icon = config.icon;

  const handleChoiceSelect = (choiceId: string) => {
    if (isCompleted || isLocked) return;
    setSelectedChoice(choiceId);
    setShowFeedback(true);
  };

  const handleComplete = () => {
    if (isLocked) return;
    setIsCompleted(true);
    onComplete?.(mission.id, selectedChoice || undefined);
  };

  const selectedChoiceData = mission.choices?.find(c => c.id === selectedChoice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border overflow-hidden transition-all ${
        isCompleted 
          ? 'bg-emerald-900/20 border-emerald-500/30' 
          : isLocked
            ? 'bg-slate-900/50 border-slate-700/30 opacity-50'
            : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
      }`}
    >
      {/* Header */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => !isLocked && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${config.color} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${config.color} text-white font-medium`}>
                {config.label}
              </span>
              {isCompleted && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Complété
                </span>
              )}
            </div>
            <h3 className={`font-bold text-lg ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
              {mission.title}
            </h3>
            <p className="text-slate-500 text-xs">{mission.titleJp}</p>
            <p className="text-slate-400 text-sm mt-1 line-clamp-2">{mission.description}</p>
          </div>

          {/* Meta */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 text-slate-400 text-sm">
              <Clock className="w-4 h-4" />
              {mission.duration} min
            </div>
            <div className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isCompleted ? '✓' : `+${mission.xpReward} XP`}
            </div>
            <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && !isLocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-slate-700/50">
              {/* Scenario */}
              {mission.scenario && (
                <div className="mb-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                  <p className="text-sm text-slate-500 mb-1">Scénario :</p>
                  <p className="text-white italic">{mission.scenario}</p>
                </div>
              )}

              {/* Choices */}
              {mission.choices && mission.choices.length > 0 && (
                <div className="space-y-3 mb-4">
                  <p className="text-sm text-slate-400 font-medium">Que choisis-tu ?</p>
                  {mission.choices.map((choice) => {
                    const isSelected = selectedChoice === choice.id;
                    const showResult = showFeedback && isSelected;
                    
                    return (
                      <motion.div
                        key={choice.id}
                        whileHover={{ scale: isCompleted ? 1 : 1.02 }}
                        whileTap={{ scale: isCompleted ? 1 : 0.98 }}
                        onClick={() => !isCompleted && handleChoiceSelect(choice.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isCompleted && !isSelected
                            ? 'opacity-50 bg-slate-800/30 border-slate-700/30'
                            : showResult
                              ? choice.isCorrect
                                ? 'bg-emerald-500/20 border-emerald-500/50'
                                : 'bg-red-500/20 border-red-500/50'
                              : isSelected
                                ? `bg-gradient-to-r ${cityColor}/20 border-white/30`
                                : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            showResult
                              ? choice.isCorrect
                                ? 'bg-emerald-500 text-white'
                                : 'bg-red-500 text-white'
                              : isSelected
                                ? 'bg-white text-slate-900'
                                : 'bg-slate-700 text-white'
                          }`}>
                            {showResult ? (choice.isCorrect ? '✓' : '✗') : choice.id.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${showResult ? (choice.isCorrect ? 'text-emerald-400' : 'text-red-400') : 'text-white'}`}>
                              {choice.text}
                            </p>
                            {showResult && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-sm mt-2 ${choice.isCorrect ? 'text-emerald-300' : 'text-red-300'}`}
                              >
                                {choice.feedback}
                              </motion.p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* For interior missions without choices */}
              {mission.type === 'interieure' && !mission.choices && (
                <div className="mb-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <p className="text-purple-300 text-sm">
                    🧘 Cette mission est une pratique intérieure. Prends le temps de la méditation ou de la réflexion.
                  </p>
                </div>
              )}

              {/* Complete Button */}
              {!isCompleted && (
                <Button
                  onClick={handleComplete}
                  disabled={mission.choices && !selectedChoice}
                  className={`w-full py-3 bg-gradient-to-r ${config.color} hover:opacity-90 text-white font-bold`}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {mission.choices 
                    ? selectedChoice 
                      ? 'Valider ma réponse' 
                      : 'Sélectionne une réponse'
                    : 'Marquer comme terminé'
                  }
                </Button>
              )}

              {isCompleted && (
                <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-emerald-400 font-bold flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    Mission accomplie ! +{mission.xpReward} XP
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AdultMissionCard;
