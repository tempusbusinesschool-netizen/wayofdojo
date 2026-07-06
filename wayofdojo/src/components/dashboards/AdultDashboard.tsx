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
 * ORDRE STRICT DES SECTIONS (selon visuel) :
 * 1. Hero Maître Tanaka
 * 2. Que faire aujourd'hui ?
 * 3. Ma progression (timeline ceintures)
 * 4. Les 7 vertus du Budo
 * 
 * LAYOUT 3 COLONNES :
 * - Colonne profil (gauche) : 260px
 * - Colonne centrale : flexible
 * - Colonne notifications (droite) : 300px
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
    // Navigation vers la prochaine étape ou techniques
    if (typeof window !== 'undefined') {
      window.location.href = `/${locale}/${sport}/techniques`;
    }
  };

  return (
    <div data-testid="adult-dashboard" className="min-h-screen bg-[#06101f]">
      {/* Layout principal avec 3 colonnes sur desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] gap-5 p-5">
        
        {/* ═══════════════════════════════════════════════════════════════
            COLONNE GAUCHE : Profil
            ═══════════════════════════════════════════════════════════════ */}
        <aside className="space-y-4 order-2 lg:order-1">
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
        </aside>

        {/* ═══════════════════════════════════════════════════════════════
            COLONNE CENTRALE : Contenu principal
            ═══════════════════════════════════════════════════════════════ */}
        <main className="space-y-6 order-1 lg:order-2">
          
          {/* 1. HERO MAÎTRE TANAKA */}
          <TanakaHero 
            userName={userName}
            onContinue={handleContinueProgression}
          />

          {/* 2. QUE FAIRE AUJOURD'HUI ? */}
          <QueFaireAujourdhui locale={locale} sport={sport} />

          {/* 3. MA PROGRESSION (Timeline ceintures) */}
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
            COLONNE DROITE : Notifications
            ═══════════════════════════════════════════════════════════════ */}
        <aside className="order-3">
          <NotificationsColumn locale={locale} sport={sport} />
        </aside>
      </div>
    </div>
  );
};

export default AdultDashboard;
