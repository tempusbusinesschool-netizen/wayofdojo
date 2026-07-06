'use client';

// Nouveaux composants selon le visuel
import { TanakaHero } from '@/components/adult-layout/TanakaHero';
import { ProfileCard } from '@/components/adult-layout/ProfileCard';
import { QueFaireAujourdhui } from '@/components/adult-layout/QueFaireAujourdhui';
import { NotificationsColumn } from '@/components/adult-layout/NotificationsColumn';
import { MaProgression } from '@/components/adult-layout/MaProgression';
import { VertusSection } from '@/components/adult-layout/VertusSection';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AdultDashboard - Dashboard refait selon le visuel de référence
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * LAYOUT 2 COLONNES (la sidebar principale est déjà gérée par la page parent) :
 * - Colonne centrale (gauche) : Contenu principal ALIGNÉ À GAUCHE
 * - Colonne notifications (droite) : 320px fixe
 * 
 * La carte Profil est intégrée DANS la sidebar principale (AdultSidebar)
 */

interface AdultDashboardProps {
  xp: number;
  completedMissions: string[];
  onMissionComplete: (missionId: string, xpEarned: number) => void;
  userName?: string;
  currentGrade?: string;
  streak?: number;
  badgesCount?: number;
  techniquesCount?: number;
  locale?: string;
  sport?: string;
}

export const AdultDashboard: React.FC<AdultDashboardProps> = ({
  xp,
  userName = 'Pratiquant',
  currentGrade = '6e Kyu',
  streak = 3,
  badgesCount = 2,
  techniquesCount = 1,
  locale = 'fr',
  sport = 'aikido',
}) => {
  const handleContinueProgression = () => {
    if (typeof window !== 'undefined') {
      window.location.href = `/${locale}/${sport}/techniques`;
    }
  };

  return (
    <div data-testid="adult-dashboard" className="min-h-screen bg-[#06101f]">
      {/* Layout 2 colonnes : Contenu principal + Notifications */}
      <div className="flex gap-4 p-4">
        
        {/* ═══════════════════════════════════════════════════════════════
            COLONNE GAUCHE : Profil (sticky)
            ═══════════════════════════════════════════════════════════════ */}
        <aside className="hidden xl:block w-[240px] shrink-0">
          <div className="sticky top-[80px]">
            <ProfileCard
              userName={userName}
              xp={xp}
              maxXp={400}
              streak={streak}
              badgesCount={badgesCount}
              techniquesCount={techniquesCount}
              locale={locale}
              sport={sport}
              currentGrade={currentGrade}
            />
          </div>
        </aside>

        {/* ═══════════════════════════════════════════════════════════════
            COLONNE CENTRALE : Contenu principal - ALIGNÉ À GAUCHE
            ═══════════════════════════════════════════════════════════════ */}
        <main className="flex-1 min-w-0 space-y-5">
          
          {/* 1. HERO MAÎTRE TANAKA */}
          <TanakaHero 
            userName={userName}
            onContinue={handleContinueProgression}
          />

          {/* 2. QUE FAIRE AUJOURD'HUI ? */}
          <QueFaireAujourdhui locale={locale} sport={sport} />

          {/* 3. MA PROGRESSION (Timeline ceintures) - ALIGNÉ À GAUCHE */}
          <MaProgression
            xp={xp}
            maxXp={400}
            xpGainedThisWeek={85}
            currentGrade={currentGrade}
            locale={locale}
            sport={sport}
          />

          {/* 4. LES 7 VERTUS DU BUDO */}
          <VertusSection locale={locale} sport={sport} />
        </main>

        {/* ═══════════════════════════════════════════════════════════════
            COLONNE DROITE : Notifications (fixe à droite)
            ═══════════════════════════════════════════════════════════════ */}
        <aside className="hidden lg:block w-[300px] shrink-0">
          <div className="sticky top-[80px]">
            <NotificationsColumn locale={locale} sport={sport} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdultDashboard;
