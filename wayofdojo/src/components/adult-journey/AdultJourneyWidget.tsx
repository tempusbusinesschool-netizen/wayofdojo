'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, ChevronRight, Scroll } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  ADULT_JOURNEY_CITIES, 
  ADULT_RANKS, 
  getRankByXp, 
  getNextRank,
  City,
  calculateProgress
} from '@/data/musashi/journey';
import { getDailyQuote } from '@/data/musashi/quotes';
import { MusashiQuoteCard } from './MusashiQuoteCard';
import { JapanMap } from './JapanMap';
import { AdultMissionCard } from './AdultMissionCard';
import { TanakaAdult } from './TanakaAdult';

interface AdultJourneyWidgetProps {
  xp: number;
  completedMissions: string[];
  onMissionComplete?: (missionId: string, xpEarned: number) => void;
}

export function AdultJourneyWidget({ 
  xp, 
  completedMissions, 
  onMissionComplete
}: AdultJourneyWidgetProps) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [tanakaMessage, setTanakaMessage] = useState('');
  // Initial Tanaka message
  const initialMessage = completedMissions.length === 0 
    ? 'Bienvenue sur la Voie du Budō. Ton voyage commence à Miyamoto, village natal de Musashi. Chaque étape forgera ton esprit.'
    : progress >= 100
      ? 'Tu as parcouru tout le chemin de Musashi. Tu es maintenant un Maître. La voie continue à travers ceux que tu inspires.'
      : currentCity.tanakaScript;

  const [tanakaMessage, setTanakaMessage] = useState(initialMessage);
  const [showTanaka, setShowTanaka] = useState(true);

  const currentRank = getRankByXp(xp);
  const nextRank = getNextRank(currentRank.id);
  const dailyQuote = getDailyQuote();

  useEffect(() => {
    // Update Tanaka message when city changes
    if (completedMissions.length === 0) {
      setTanakaMessage('Bienvenue sur la Voie du Budō. Ton voyage commence à Miyamoto, village natal de Musashi. Chaque étape forgera ton esprit.');
    } else if (progress >= 100) {
      setTanakaMessage('Tu as parcouru tout le chemin de Musashi. Tu es maintenant un Maître. La voie continue à travers ceux que tu inspires.');
    } else {
      setTanakaMessage(currentCity.tanakaScript);
    }
  }, [completedMissions.length, currentCity.id, progress]);

  const handleMissionComplete = (missionId: string) => {
    const mission = ADULT_JOURNEY_CITIES
      .flatMap(c => c.missions)
      .find(m => m.id === missionId);
    
    if (mission && onMissionComplete) {
      onMissionComplete(missionId, mission.xpReward);
    }
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setTanakaMessage(city.tanakaScript);
    setShowMap(false);
  };

  // Calculate XP progress to next rank
  const rankProgress = nextRank 
    ? Math.round(((xp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Header - Rank & Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Rank Badge */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="relative"
          >
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-2xl"
              style={{ 
                background: `linear-gradient(135deg, ${currentRank.color}40, ${currentRank.color}20)`,
                boxShadow: `0 0 40px ${currentRank.color}30`
              }}
            >
              {currentRank.icon}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-sm font-bold text-white">
              {ADULT_RANKS.findIndex(r => r.id === currentRank.id) + 1}
            </div>
          </motion.div>

          {/* Rank Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <h2 className="text-2xl font-black text-white">{currentRank.name}</h2>
              <span className="text-lg text-slate-500">{currentRank.nameJp}</span>
            </div>
            <p className="text-slate-400 text-sm">{currentRank.description}</p>
            {currentRank.kyu && (
              <p className="text-amber-400 text-xs mt-1">Grade : {currentRank.kyu}</p>
            )}
            
            {/* XP to next rank */}
            {nextRank && (
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Prochain rang : {nextRank.name}</span>
                  <span className="text-amber-400">{xp} / {nextRank.minXp} XP</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rankProgress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${currentRank.color}, ${nextRank.color})` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-xl bg-white/5">
              <div className="text-2xl font-black text-amber-400">{xp}</div>
              <div className="text-xs text-slate-500">XP Total</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5">
              <div className="text-2xl font-black text-emerald-400">{progress}%</div>
              <div className="text-xs text-slate-500">Voyage</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5">
              <div className="text-2xl font-black text-cyan-400">{completedMissions.length}</div>
              <div className="text-xs text-slate-500">Missions</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5">
              <div className="text-2xl font-black text-purple-400">
                {ADULT_JOURNEY_CITIES.filter(c => {
                  const done = c.missions.filter(m => completedMissions.includes(m.id)).length;
                  return done === c.missions.length;
                }).length}
              </div>
              <div className="text-xs text-slate-500">Villes</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Daily Musashi Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <Scroll className="w-5 h-5 text-amber-400" />
          Citation du jour
        </h3>
        <MusashiQuoteCard quote={dailyQuote} variant="featured" showChapter />
      </motion.div>

      {/* Journey Map Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Map className="w-5 h-5 text-cyan-400" />
            Voyage initiatique
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMap(!showMap)}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            {showMap ? 'Voir missions' : 'Voir carte'}
            <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showMap ? 'rotate-90' : ''}`} />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {showMap ? (
            <motion.div
              key="map"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <JapanMap
                completedMissions={completedMissions}
                onCitySelect={handleCitySelect}
                selectedCityId={selectedCity?.id}
              />
            </motion.div>
          ) : (
            <motion.div
              key="missions"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Current City Header */}
              <div 
                className={`p-4 rounded-xl bg-gradient-to-r ${(selectedCity || currentCity).gradient}/20 border border-slate-700`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl bg-gradient-to-br ${(selectedCity || currentCity).gradient}`}>
                    {(selectedCity || currentCity).icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xl font-bold text-white">{(selectedCity || currentCity).name}</h4>
                      <span className="text-slate-500">{(selectedCity || currentCity).nameJp}</span>
                    </div>
                    <p className="text-amber-400 text-sm">{(selectedCity || currentCity).theme}</p>
                    <p className="text-slate-400 text-xs mt-1">{(selectedCity || currentCity).description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">Niv. {(selectedCity || currentCity).level}</div>
                    <div className="text-xs text-slate-500">
                      {(selectedCity || currentCity).missions.filter(m => completedMissions.includes(m.id)).length}/{(selectedCity || currentCity).missions.length} missions
                    </div>
                  </div>
                </div>
              </div>

              {/* Missions List */}
              <div className="space-y-3">
                {(selectedCity || currentCity).missions.map((mission, index) => (
                  <AdultMissionCard
                    key={mission.id}
                    mission={{
                      ...mission,
                      completed: completedMissions.includes(mission.id)
                    }}
                    cityColor={(selectedCity || currentCity).gradient}
                    onComplete={handleMissionComplete}
                    isLocked={index > 0 && !completedMissions.includes((selectedCity || currentCity).missions[index - 1].id)}
                  />
                ))}
              </div>

              {/* City selector buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700">
                {ADULT_JOURNEY_CITIES.map(city => {
                  const prevCity = city.unlockRequirement?.previousCity 
                    ? ADULT_JOURNEY_CITIES.find(c => c.id === city.unlockRequirement?.previousCity)
                    : null;
                  const prevMissionsCount = prevCity 
                    ? prevCity.missions.filter(m => completedMissions.includes(m.id)).length 
                    : 0;
                  const isUnlocked = !city.unlockRequirement || 
                    (prevCity && prevMissionsCount >= (city.unlockRequirement?.missionsCompleted || 0));
                  
                  const cityProgress = city.missions.filter(m => completedMissions.includes(m.id)).length;
                  const isComplete = cityProgress === city.missions.length;
                  const isSelected = (selectedCity?.id || currentCity.id) === city.id;

                  return (
                    <motion.button
                      key={city.id}
                      whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                      whileTap={{ scale: isUnlocked ? 0.95 : 1 }}
                      onClick={() => isUnlocked && setSelectedCity(city)}
                      disabled={!isUnlocked}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-white text-slate-900'
                          : isComplete
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : isUnlocked
                              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      {isUnlocked ? city.icon : '🔒'} {city.name}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tanaka Adult Mentor */}
      <TanakaAdult
        message={tanakaMessage}
        isVisible={showTanaka}
        onClose={() => setShowTanaka(false)}
      />
    </div>
  );
}

export default AdultJourneyWidget;
