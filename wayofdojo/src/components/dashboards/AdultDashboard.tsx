'use client';

import { AdultJourneyWidget } from '@/components/adult-journey';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AdultDashboard - Dashboard pour les "Samouraï Confirmé" (adultes 14+ ans)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Mode adulte avec le Voyage de Musashi et les missions de réflexion
 */

interface AdultDashboardProps {
  xp: number;
  completedMissions: string[];
  onMissionComplete: (missionId: string, xpEarned: number) => void;
}

export const AdultDashboard: React.FC<AdultDashboardProps> = ({
  xp,
  completedMissions,
  onMissionComplete,
}) => {
  return (
    <div data-testid="adult-dashboard">
      <AdultJourneyWidget
        xp={xp}
        completedMissions={completedMissions}
        onMissionComplete={onMissionComplete}
      />
    </div>
  );
};

export default AdultDashboard;
