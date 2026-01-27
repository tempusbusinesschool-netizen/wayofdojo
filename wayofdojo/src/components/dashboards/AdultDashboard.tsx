'use client';

import { useState, useEffect } from 'react';
import { AdultJourneyWidget, AdultTutorialBlocks } from '@/components/adult-journey';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AdultDashboard - Dashboard pour les "Samouraï Confirmé" (adultes 14+ ans)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Mode adulte avec :
 * - Les 8 blocs du parcours tutoriel
 * - Le Voyage de Musashi et les missions de réflexion
 */

interface AdultDashboardProps {
  xp: number;
  completedMissions: string[];
  onMissionComplete: (missionId: string, xpEarned: number) => void;
  userName?: string;
  currentGrade?: string;
}

export const AdultDashboard: React.FC<AdultDashboardProps> = ({
  xp,
  completedMissions,
  onMissionComplete,
  userName = 'Pratiquant',
  currentGrade = '2e Kyu',
}) => {
  // Charger les blocs complétés depuis localStorage
  const [completedBlocks, setCompletedBlocks] = useState<number[]>([]);
  const [_showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wayofdojo_adult_completed_blocks');
      if (saved) {
        setCompletedBlocks(JSON.parse(saved));
      }
      // Vérifier si le tutoriel a été vu
      const tutorialSeen = localStorage.getItem('wayofdojo_adult_tutorial_seen');
      if (tutorialSeen) {
        setShowTutorial(false);
      }
    }
  }, []);

  const handleBlockComplete = (blockId: number) => {
    if (!completedBlocks.includes(blockId)) {
      const newCompleted = [...completedBlocks, blockId];
      setCompletedBlocks(newCompleted);
      if (typeof window !== 'undefined') {
        localStorage.setItem('wayofdojo_adult_completed_blocks', JSON.stringify(newCompleted));
      }
    }
  };

  const handleNavigate = (destination: string) => {
    // Navigation vers les différentes sections
    const routes: Record<string, string> = {
      dashboard: '/fr/aikido/dojo',
      profil: '/fr/aikido/profil',
      defis: '/fr/aikido/defis',
      vertus: '/fr/aikido/vertus',
      techniques: '/fr/aikido/techniques',
      progression: '/fr/aikido/progression',
      histoire: '/fr/aikido/histoire',
      trophees: '/fr/aikido/trophees',
    };
    
    if (routes[destination] && typeof window !== 'undefined') {
      window.location.href = routes[destination];
    }
  };

  return (
    <div data-testid="adult-dashboard" className="space-y-8">
      {/* Les 8 Blocs du Parcours Tutoriel */}
      <AdultTutorialBlocks
        userName={userName}
        currentGrade={currentGrade}
        xp={xp}
        completedBlocks={completedBlocks}
        onBlockComplete={handleBlockComplete}
        onNavigate={handleNavigate}
      />

      {/* Widget du Voyage de Musashi */}
      <AdultJourneyWidget
        xp={xp}
        completedMissions={completedMissions}
        onMissionComplete={onMissionComplete}
      />
    </div>
  );
};

export default AdultDashboard;
