'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Map } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Composants existants
import { AdultJourneyWidget, AdultTutorialBlocks } from '@/components/adult-journey';
import { 
  ADULT_JOURNEY_CITIES, 
  getRankByXp, 
  calculateProgress 
} from '@/data/musashi/journey';

// Nouveaux composants
import { TanakaHero } from '@/components/adult-layout/TanakaHero';
import { ProfileCard, TanakaCompactCard } from '@/components/adult-layout/ProfileCard';
import { QueFaireAujourdhui } from '@/components/adult-layout/QueFaireAujourdhui';
import { NotificationsColumn } from '@/components/adult-layout/NotificationsColumn';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AdultDashboard - Dashboard refait pour "Samouraï Confirmé"
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * ORDRE DES SECTIONS (cahier des charges) :
 * 1. Hero Maître Tanaka
 * 2. Parcours Miyamoto
 * 3. Que faire aujourd'hui ?
 * 4. Parcours en 8 étapes
 * 5. Ma progression Aïkido
 * 6. Les 7 vertus du Budo
 * 
 * LAYOUT :
 * - Colonne profil (gauche) : 240px
 * - Colonne centrale : flexible
 * - Colonne notifications (droite) : 310px
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

// Les 7 vertus du Budo
const VERTUS = [
  { id: 'gi', name: 'Gi', kanji: '義', meaning: 'Rectitude', color: 'from-blue-500 to-blue-700' },
  { id: 'yu', name: 'Yū', kanji: '勇', meaning: 'Courage', color: 'from-orange-500 to-red-600' },
  { id: 'jin', name: 'Jin', kanji: '仁', meaning: 'Bienveillance', color: 'from-pink-500 to-rose-600' },
  { id: 'rei', name: 'Rei', kanji: '礼', meaning: 'Respect', color: 'from-amber-500 to-yellow-600' },
  { id: 'makoto', name: 'Makoto', kanji: '誠', meaning: 'Sincérité', color: 'from-cyan-500 to-blue-600' },
  { id: 'meiyo', name: 'Meiyo', kanji: '名誉', meaning: 'Honneur', color: 'from-purple-500 to-violet-600' },
  { id: 'chugi', name: 'Chūgi', kanji: '忠義', meaning: 'Loyauté', color: 'from-emerald-500 to-green-600' },
];

// Progression des ceintures
const BELTS = [
  { grade: '6e Kyu', name: 'Blanche', color: 'bg-white', active: true },
  { grade: '5e Kyu', name: 'Jaune', color: 'bg-yellow-400', active: false },
  { grade: '4e Kyu', name: 'Orange', color: 'bg-orange-500', active: false },
  { grade: '3e Kyu', name: 'Verte', color: 'bg-green-500', active: false },
  { grade: '2e Kyu', name: 'Bleue', color: 'bg-blue-500', active: false },
  { grade: '1er Kyu', name: 'Marron', color: 'bg-amber-700', active: false },
  { grade: '1er Dan', name: 'Noire', color: 'bg-slate-900', active: false },
];

export const AdultDashboard: React.FC<AdultDashboardProps> = ({
  xp,
  completedMissions,
  onMissionComplete,
  userName = 'Pratiquant',
  currentGrade = '6e Kyu',
  streak = 0,
  badgesCount = 0,
  techniquesCount = 0,
  locale = 'fr',
  sport = 'aikido',
}) => {
  const [completedBlocks, setCompletedBlocks] = useState<number[]>([]);
  const [showJourneyExpanded, setShowJourneyExpanded] = useState(false);

  // Calculs
  const currentRank = getRankByXp(xp);
  const journeyProgress = calculateProgress(completedMissions);
  const currentCity = ADULT_JOURNEY_CITIES.find(city => {
    const cityMissions = city.missions.filter(m => completedMissions.includes(m.id)).length;
    return cityMissions < city.missions.length;
  }) || ADULT_JOURNEY_CITIES[0];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wayofdojo_adult_completed_blocks');
      if (saved) {
        setCompletedBlocks(JSON.parse(saved));
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
    const routes: Record<string, string> = {
      dashboard: `/${locale}/${sport}/dojo`,
      profil: `/${locale}/${sport}/profil`,
      defis: `/${locale}/${sport}/dojo`,
      vertus: `/${locale}/${sport}/vertus`,
      techniques: `/${locale}/${sport}/techniques`,
      progression: `/${locale}/${sport}/ceintures`,
      histoire: `/${locale}/${sport}/histoire`,
      trophees: `/${locale}/${sport}/trophees`,
    };
    
    if (routes[destination] && typeof window !== 'undefined') {
      window.location.href = routes[destination];
    }
  };

  const handleContinueProgression = () => {
    // Amène vers la première étape non terminée ou vers le Parcours Miyamoto
    if (showJourneyExpanded) {
      // Scroll vers le parcours
      document.getElementById('parcours-miyamoto')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setShowJourneyExpanded(true);
    }
  };

  return (
    <div data-testid="adult-dashboard" className="min-h-screen bg-[#06101f]">
      {/* Layout principal avec 3 colonnes sur desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_310px] gap-4 lg:gap-6 p-4 lg:p-6">
        
        {/* ═══════════════════════════════════════════════════════════════
            COLONNE GAUCHE : Profil + Tanaka
            ═══════════════════════════════════════════════════════════════ */}
        <aside className="space-y-4 order-2 lg:order-1">
          <ProfileCard
            userName={userName}
            xp={xp}
            streak={streak}
            badgesCount={badgesCount}
            techniquesCount={techniquesCount}
            locale={locale}
            sport={sport}
          />
          <TanakaCompactCard />
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

          {/* 2. PARCOURS MIYAMOTO */}
          <section id="parcours-miyamoto" data-testid="parcours-miyamoto-section">
            {/* En-tête compact du parcours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0d1b31] rounded-2xl border border-violet-500/20 overflow-hidden"
            >
              {/* Header avec rang et stats */}
              <div className="p-5 border-b border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600/30 to-purple-600/20 flex items-center justify-center text-3xl border border-violet-500/30">
                      {currentRank.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-white">{currentRank.name}</h2>
                        <span className="text-slate-500">{currentRank.nameJp}</span>
                      </div>
                      <p className="text-slate-400 text-sm">{currentRank.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 text-center">
                    <div className="px-3 py-2 rounded-lg bg-white/5">
                      <div className="text-amber-400 font-bold">{xp}</div>
                      <div className="text-[10px] text-slate-500">XP</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5">
                      <div className="text-emerald-400 font-bold">{journeyProgress}%</div>
                      <div className="text-[10px] text-slate-500">Voyage</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5">
                      <div className="text-cyan-400 font-bold">{completedMissions.length}</div>
                      <div className="text-[10px] text-slate-500">Missions</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ville actuelle */}
              <div className="p-4 bg-gradient-to-r from-slate-800/50 to-violet-900/20">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${currentCity.gradient}`}>
                    {currentCity.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{currentCity.name}</h3>
                      <span className="text-slate-500 text-sm">{currentCity.nameJp}</span>
                      <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs">
                        Niveau {currentCity.level}
                      </span>
                    </div>
                    <p className="text-amber-400 text-sm">{currentCity.theme}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">
                      {currentCity.missions.filter(m => completedMissions.includes(m.id)).length}/{currentCity.missions.length}
                    </div>
                    <div className="text-xs text-slate-500">missions</div>
                  </div>
                </div>
              </div>

              {/* Bouton pour voir le parcours complet */}
              <div className="p-4">
                <Button
                  onClick={() => setShowJourneyExpanded(!showJourneyExpanded)}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold py-3 rounded-xl"
                  data-testid="expand-journey-btn"
                >
                  <Map className="w-5 h-5 mr-2" />
                  {showJourneyExpanded ? 'Réduire le parcours' : 'Voir la carte du Japon'}
                  <ChevronRight className={`w-5 h-5 ml-2 transition-transform ${showJourneyExpanded ? 'rotate-90' : ''}`} />
                </Button>
              </div>
            </motion.div>

            {/* Parcours Miyamoto étendu */}
            {showJourneyExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <AdultJourneyWidget
                  xp={xp}
                  completedMissions={completedMissions}
                  onMissionComplete={onMissionComplete}
                />
              </motion.div>
            )}
          </section>

          {/* 3. QUE FAIRE AUJOURD'HUI ? */}
          <QueFaireAujourdhui locale={locale} sport={sport} />

          {/* 4. PARCOURS EN 8 ÉTAPES (compact) */}
          <section data-testid="parcours-8-etapes">
            <AdultTutorialBlocks
              userName={userName}
              currentGrade={currentGrade}
              xp={xp}
              completedBlocks={completedBlocks}
              onBlockComplete={handleBlockComplete}
              onNavigate={handleNavigate}
            />
          </section>

          {/* 5. MA PROGRESSION AÏKIDO */}
          <section data-testid="progression-aikido" className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Ma progression</h3>
            <div className="bg-[#0d1b31] rounded-2xl border border-white/10 p-5">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {BELTS.map((belt) => (
                  <div 
                    key={belt.grade}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                      belt.grade === currentGrade 
                        ? 'bg-orange-500/20 border border-orange-500/50' 
                        : 'bg-white/5'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${belt.color} border border-white/20`} />
                    <span className={`text-xs font-medium ${
                      belt.grade === currentGrade ? 'text-orange-400' : 'text-slate-400'
                    }`}>
                      {belt.grade}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Grade actuel</span>
                <span className="text-white font-semibold">{currentGrade}</span>
              </div>
              
              <div className="h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                  style={{ width: `${Math.min((xp / 500) * 100, 100)}%` }}
                />
              </div>
              
              <Link 
                href={`/${locale}/${sport}/ceintures`}
                className="block mt-4 text-center text-orange-400 hover:text-orange-300 text-sm"
              >
                Voir le programme complet →
              </Link>
            </div>
          </section>

          {/* 6. LES 7 VERTUS DU BUDO */}
          <section data-testid="vertus-budo" className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Les 7 vertus du Budo</h3>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {VERTUS.map((vertu) => (
                <Link 
                  key={vertu.id}
                  href={`/${locale}/${sport}/vertus`}
                  className="group"
                >
                  <div className={`aspect-square rounded-xl bg-gradient-to-br ${vertu.color} p-2 flex flex-col items-center justify-center text-center group-hover:scale-105 transition-transform`}>
                    <span className="text-2xl font-bold text-white/90">{vertu.kanji}</span>
                    <span className="text-[10px] text-white/70 mt-1 hidden sm:block">{vertu.meaning}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
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
