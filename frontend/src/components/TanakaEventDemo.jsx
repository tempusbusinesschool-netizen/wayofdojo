import React, { useState } from 'react';
import { useTanakaEvent } from '@/contexts/TanakaEventContext';
import { Button } from '@/components/ui/button';
import { 
  Trophy, Award, Flame, Star, Zap, 
  Target, Medal, ArrowUp, Sparkles 
} from 'lucide-react';

/**
 * TanakaEventDemo - Demo component to test Maître Tanaka's event reactions
 * Use this in development to test all event types
 */
const TanakaEventDemo = ({ isVisible = false }) => {
  const tanaka = useTanakaEvent();
  const [isOpen, setIsOpen] = useState(false);

  if (!isVisible) return null;

  const testEvents = [
    {
      label: 'Défi Complété',
      icon: Trophy,
      color: 'bg-green-600',
      action: () => tanaka.onChallengeComplete('Première Chute - Ukemi Mae', false, false)
    },
    {
      label: 'Premier Défi',
      icon: Star,
      color: 'bg-yellow-600',
      action: () => tanaka.onChallengeComplete('Mon Premier Pas', true, false)
    },
    {
      label: 'Défi Difficile',
      icon: Target,
      color: 'bg-red-600',
      action: () => tanaka.onChallengeComplete('Maître du Kokyu', false, true)
    },
    {
      label: 'Ceinture Jaune',
      icon: Award,
      color: 'bg-yellow-500',
      action: () => tanaka.onBeltEarned('5e_kyu', 'Ceinture Jaune')
    },
    {
      label: 'Ceinture Verte',
      icon: Award,
      color: 'bg-green-500',
      action: () => tanaka.onBeltEarned('3e_kyu', 'Ceinture Verte')
    },
    {
      label: 'Série 7 jours',
      icon: Flame,
      color: 'bg-orange-600',
      action: () => tanaka.onStreakMilestone(7)
    },
    {
      label: 'Série 30 jours',
      icon: Flame,
      color: 'bg-red-500',
      action: () => tanaka.onStreakMilestone(30)
    },
    {
      label: 'Level Up',
      icon: ArrowUp,
      color: 'bg-purple-600',
      action: () => tanaka.onLevelUp(5, 'Guerrier Éveillé')
    },
    {
      label: '+50 XP',
      icon: Zap,
      color: 'bg-cyan-600',
      action: () => tanaka.onXpGained(50)
    },
    {
      label: 'Technique Maîtrisée',
      icon: Sparkles,
      color: 'bg-indigo-600',
      action: () => tanaka.onTechniqueMastered('Ikkyo Omote')
    },
    {
      label: 'Badge Gagné',
      icon: Medal,
      color: 'bg-amber-600',
      action: () => tanaka.onBadgeEarned('Premier Kata')
    },
    {
      label: 'Bon Retour',
      icon: Star,
      color: 'bg-pink-600',
      action: () => tanaka.onWelcomeBack()
    }
  ];

  return (
    <div className="fixed bottom-24 right-6 z-40">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-purple-600 hover:bg-purple-500 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110"
        title="Tester les événements Tanaka"
      >
        🧪
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-bold text-sm">🥋 Test Événements Tanaka</h4>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
            {testEvents.map((event, idx) => {
              const Icon = event.icon;
              return (
                <button
                  key={idx}
                  onClick={event.action}
                  disabled={tanaka.isPlaying}
                  className={`${event.color} hover:opacity-90 text-white text-xs p-2 rounded-lg flex items-center gap-1 transition-all disabled:opacity-50`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="truncate">{event.label}</span>
                </button>
              );
            })}
          </div>
          
          <p className="text-xs text-slate-400 mt-2">
            {tanaka.isPlaying ? '🔊 Audio en cours...' : '✨ Cliquez pour tester'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TanakaEventDemo;
