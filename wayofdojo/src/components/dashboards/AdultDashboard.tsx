'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, Compass, ChevronRight, Star, Scroll } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdultJourneyWidget, AdultTutorialBlocks } from '@/components/adult-journey';
import { 
  ADULT_JOURNEY_CITIES, 
  ADULT_RANKS, 
  getRankByXp, 
  calculateProgress 
} from '@/data/musashi/journey';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AdultDashboard - Dashboard pour les "Samouraï Confirmé" (adultes 14+ ans)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * NOUVELLE STRUCTURE avec Parcours Miyamoto en vedette :
 * 1. En-tête avec rang et stats rapides
 * 2. PARCOURS MIYAMOTO (carte + progression) - VEDETTE
 * 3. Les 8 blocs du parcours tutoriel
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
  const [completedBlocks, setCompletedBlocks] = useState<number[]>([]);
  const [showJourneyExpanded, setShowJourneyExpanded] = useState(false);

  // Calculer le rang et la progression
  const currentRank = getRankByXp(xp);
  const nextRank = ADULT_RANKS[ADULT_RANKS.findIndex(r => r.id === currentRank.id) + 1];
  const journeyProgress = calculateProgress(completedMissions);
  
  // Trouver la ville actuelle
  const currentCity = ADULT_JOURNEY_CITIES.find(city => {
    const cityMissions = city.missions.filter(m => completedMissions.includes(m.id)).length;
    return cityMissions < city.missions.length;
  }) || ADULT_JOURNEY_CITIES[0];

  // Nombre de villes complétées
  const completedCities = ADULT_JOURNEY_CITIES.filter(city => {
    const done = city.missions.filter(m => completedMissions.includes(m.id)).length;
    return done === city.missions.length;
  }).length;

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
      dashboard: '/fr/aikido/dojo',
      profil: '/fr/aikido/profil',
      defis: '/fr/aikido/defis',
      vertus: '/fr/aikido/vertus',
      techniques: '/fr/aikido/techniques',
      progression: '/fr/aikido/ceintures',
      histoire: '/fr/aikido/histoire',
      trophees: '/fr/aikido/trophees',
    };
    
    if (routes[destination] && typeof window !== 'undefined') {
      window.location.href = routes[destination];
    }
  };

  return (
    <div data-testid="adult-dashboard" className="space-y-6">
      
      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1: PARCOURS MIYAMOTO - EN VEDETTE
          ═══════════════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-violet-950/50 to-slate-900 border border-violet-500/30"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500 rounded-full blur-3xl" />
        </div>

        <div className="relative p-6 lg:p-8">
          {/* Header du parcours */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center text-4xl lg:text-5xl shadow-2xl"
                style={{ 
                  background: `linear-gradient(135deg, ${currentRank.color}40, ${currentRank.color}20)`,
                  boxShadow: `0 0 40px ${currentRank.color}30`
                }}
              >
                {currentRank.icon}
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl lg:text-3xl font-black text-white">{currentRank.name}</h2>
                  <span className="text-lg text-slate-400">{currentRank.nameJp}</span>
                </div>
                <p className="text-slate-400 text-sm">{currentRank.description}</p>
                {currentRank.kyu && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                    {currentRank.kyu}
                  </span>
                )}
              </div>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <Star className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <div className="text-xl font-black text-amber-400">{xp}</div>
                <div className="text-xs text-slate-500">XP</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <Compass className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <div className="text-xl font-black text-emerald-400">{journeyProgress}%</div>
                <div className="text-xs text-slate-500">Voyage</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <Scroll className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <div className="text-xl font-black text-cyan-400">{completedMissions.length}</div>
                <div className="text-xs text-slate-500">Missions</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <Map className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <div className="text-xl font-black text-purple-400">{completedCities}/9</div>
                <div className="text-xs text-slate-500">Villes</div>
              </div>
            </div>
          </div>

          {/* Barre de progression vers le prochain rang */}
          {nextRank && (
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Progression vers <span className="text-white font-medium">{nextRank.name}</span></span>
                <span className="text-amber-400 font-medium">{xp} / {nextRank.minXp} XP</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(((xp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100, 100)}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-amber-500"
                />
              </div>
            </div>
          )}

          {/* Ville actuelle - Mise en avant */}
          <div 
            className={`p-4 lg:p-5 rounded-2xl bg-gradient-to-r ${currentCity.gradient}/20 border border-white/10 mb-4`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center text-3xl lg:text-4xl bg-gradient-to-br ${currentCity.gradient} shadow-lg`}>
                {currentCity.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl lg:text-2xl font-bold text-white">{currentCity.name}</h3>
                  <span className="text-slate-400">{currentCity.nameJp}</span>
                  <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs font-medium">
                    Niveau {currentCity.level}
                  </span>
                </div>
                <p className="text-amber-400 text-sm font-medium">{currentCity.theme} • {currentCity.themeJp}</p>
                <p className="text-slate-400 text-xs mt-1 hidden lg:block">{currentCity.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {currentCity.missions.filter(m => completedMissions.includes(m.id)).length}/{currentCity.missions.length}
                </div>
                <div className="text-xs text-slate-500">missions</div>
              </div>
            </div>
          </div>

          {/* Bouton pour ouvrir le parcours complet */}
          <Button
            onClick={() => setShowJourneyExpanded(!showJourneyExpanded)}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-violet-500/25"
            data-testid="expand-journey-btn"
          >
            <Map className="w-5 h-5 mr-2" />
            {showJourneyExpanded ? 'Réduire le Parcours' : 'Explorer le Parcours Miyamoto'}
            <ChevronRight className={`w-5 h-5 ml-2 transition-transform ${showJourneyExpanded ? 'rotate-90' : ''}`} />
          </Button>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2: PARCOURS MIYAMOTO ÉTENDU (si ouvert)
          ═══════════════════════════════════════════════════════════════════════ */}
      {showJourneyExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AdultJourneyWidget
            xp={xp}
            completedMissions={completedMissions}
            onMissionComplete={onMissionComplete}
          />
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3: LES 8 BLOCS DU PARCOURS TUTORIEL
          ═══════════════════════════════════════════════════════════════════════ */}
      <AdultTutorialBlocks
        userName={userName}
        currentGrade={currentGrade}
        xp={xp}
        completedBlocks={completedBlocks}
        onBlockComplete={handleBlockComplete}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default AdultDashboard;
