import React, { useState } from 'react';
import { 
  Sparkles, Trophy, Star, Zap, ChevronRight, Target, 
  Calendar, Award, Flame, Gift, Lock, CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  VIRTUES_GAMIFICATION, 
  GLOBAL_TROPHIES,
  SPECIAL_TITLES,
  calculateLevel, 
  getXpToNextLevel, 
  getAnimalEvolution,
  calculateTotalXp,
  getSpecialTitle
} from '@/constants/virtuesGamification';

/**
 * AnimalEvolutionCard - Affiche l'animal gardien et son évolution
 */
const AnimalEvolutionCard = ({ virtue, level, xp }) => {
  const evolution = getAnimalEvolution(virtue.id, level);
  const nextEvolution = getAnimalEvolution(virtue.id, level + 1);
  
  return (
    <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-4 border border-slate-700/50">
      <div className="flex items-center gap-4">
        {/* Animal actuel */}
        <div className="relative">
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${virtue.gradient} flex items-center justify-center shadow-lg`}>
            <span className="text-4xl">{evolution?.emoji || virtue.animal.base}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-900 rounded-full px-2 py-0.5 text-xs font-bold">
            Niv.{level}
          </div>
        </div>
        
        {/* Infos */}
        <div className="flex-1">
          <h4 className="font-bold text-white">{evolution?.name || virtue.animal.name}</h4>
          <p className="text-sm text-slate-400">{evolution?.description}</p>
          
          {/* Prochaine évolution */}
          {nextEvolution && (
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span>Prochaine évolution:</span>
              <span className="text-lg">{nextEvolution.emoji}</span>
              <span className="text-amber-400">{nextEvolution.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * ChallengeCard - Carte de défi
 */
const ChallengeCard = ({ challenge, isCompleted, onComplete, type = "daily" }) => {
  const bgColor = isCompleted 
    ? "bg-emerald-900/30 border-emerald-500/50" 
    : "bg-slate-800/50 border-slate-700/50 hover:border-amber-500/50";
  
  return (
    <div 
      className={`relative rounded-xl p-3 border transition-all cursor-pointer ${bgColor}`}
      onClick={() => !isCompleted && onComplete?.(challenge)}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{challenge.emoji}</div>
        <div className="flex-1">
          <h5 className="font-semibold text-white text-sm">{challenge.name}</h5>
          <p className="text-xs text-slate-400">{challenge.description}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${type === 'weekly' ? 'bg-purple-500/30 text-purple-300' : 'bg-amber-500/30 text-amber-300'}`}>
            +{challenge.xp} XP
          </span>
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Lock className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * BadgeCard - Carte de badge
 */
const BadgeCard = ({ badge, isUnlocked }) => {
  return (
    <div 
      className={`relative rounded-xl p-3 text-center transition-all ${
        isUnlocked 
          ? 'bg-gradient-to-br from-amber-900/40 to-yellow-900/40 border border-amber-500/50' 
          : 'bg-slate-800/30 border border-slate-700/30 opacity-50 grayscale'
      }`}
    >
      <div className="text-3xl mb-1">{badge.emoji}</div>
      <h5 className="font-semibold text-white text-xs">{badge.name}</h5>
      <p className="text-[10px] text-slate-400 mt-1">{badge.description}</p>
      {isUnlocked && (
        <div className="absolute -top-1 -right-1 text-sm">✅</div>
      )}
    </div>
  );
};

/**
 * VirtueProgressCard - Carte de progression d'une vertu
 */
const VirtueProgressCard = ({ virtueId, virtueData, xp = 0, onClick }) => {
  const currentLevel = calculateLevel(xp, virtueId);
  const { progress, isMaxLevel } = getXpToNextLevel(xp, virtueId);
  const evolution = getAnimalEvolution(virtueId, currentLevel.level);
  
  return (
    <div 
      className={`relative overflow-hidden rounded-2xl cursor-pointer transform transition-all hover:scale-105 hover:-translate-y-1`}
      onClick={() => onClick?.(virtueId)}
    >
      {/* Fond avec gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${virtueData.gradient} opacity-90`} />
      
      {/* Badge niveau */}
      <div className="absolute top-2 right-2 bg-black/30 rounded-full px-2 py-0.5 text-xs font-bold text-white">
        Niv.{currentLevel.level}
      </div>
      
      {/* Badge animal */}
      <div className="absolute -top-1 -left-1 w-10 h-10 bg-white/30 rounded-full flex items-center justify-center text-xl shadow-lg">
        {evolution?.emoji || virtueData.animal.base}
      </div>
      
      {/* Contenu */}
      <div className="relative p-4 pt-8">
        {/* Emoji principal */}
        <div className="text-center mb-2">
          <span className="text-4xl">{virtueData.emoji}</span>
        </div>
        
        {/* Nom et Kanji */}
        <div className="text-center">
          <h4 className="font-bold text-white text-sm">{virtueData.name}</h4>
          <span className="text-white/70 text-lg font-bold">{virtueData.kanji}</span>
        </div>
        
        {/* Barre de progression */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-white/80 mb-1">
            <span>{currentLevel.name}</span>
            <span>{xp} XP</span>
          </div>
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/80 rounded-full transition-all duration-1000"
              style={{ width: `${isMaxLevel ? 100 : progress}%` }}
            />
          </div>
        </div>
        
        {/* Titre actuel */}
        <div className="text-center mt-2">
          <span className="text-white font-medium text-xs bg-white/20 px-2 py-0.5 rounded-full">
            {currentLevel.badge} {currentLevel.title}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * VirtueDetailPanel - Panneau de détail d'une vertu
 */
const VirtueDetailPanel = ({ virtueId, xp = 0, completedChallenges = [], unlockedBadges = [], onClose, onCompleteChallenge }) => {
  const virtueData = VIRTUES_GAMIFICATION[virtueId];
  const currentLevel = calculateLevel(xp, virtueId);
  const { needed, progress, isMaxLevel } = getXpToNextLevel(xp, virtueId);
  
  if (!virtueData) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className={`relative p-6 bg-gradient-to-r ${virtueData.gradient}`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl"
          >
            ✕
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-6xl">{virtueData.emoji}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">{virtueData.name}</h2>
              <p className="text-white/80">{virtueData.kanji} - {virtueData.romaji}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="bg-black/30 px-3 py-1 rounded-full text-sm font-bold text-white">
                  Niveau {currentLevel.level} - {currentLevel.name}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm text-white">
                  {xp} XP
                </span>
              </div>
            </div>
          </div>
          
          {/* Barre de progression vers prochain niveau */}
          {!isMaxLevel && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-white/80 mb-1">
                <span>Prochain niveau: {virtueData.levels[currentLevel.level]?.name}</span>
                <span>Encore {needed} XP</span>
              </div>
              <Progress value={progress} className="h-3 bg-black/30" />
            </div>
          )}
        </div>
        
        {/* Corps */}
        <div className="p-6 space-y-6">
          {/* Animal Gardien */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">{virtueData.animal.base}</span>
              Mon Animal Gardien
            </h3>
            <AnimalEvolutionCard virtue={virtueData} level={currentLevel.level} xp={xp} />
          </div>
          
          {/* Défis Quotidiens */}
          <div>
            <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Défis du Jour
            </h3>
            <div className="space-y-2">
              {virtueData.dailyChallenges.map((challenge) => (
                <ChallengeCard 
                  key={challenge.id}
                  challenge={challenge}
                  isCompleted={completedChallenges.includes(challenge.id)}
                  onComplete={onCompleteChallenge}
                  type="daily"
                />
              ))}
            </div>
          </div>
          
          {/* Défis Hebdomadaires */}
          <div>
            <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Défis de la Semaine
            </h3>
            <div className="space-y-2">
              {virtueData.weeklyChallenges.map((challenge) => (
                <ChallengeCard 
                  key={challenge.id}
                  challenge={challenge}
                  isCompleted={completedChallenges.includes(challenge.id)}
                  onComplete={onCompleteChallenge}
                  type="weekly"
                />
              ))}
            </div>
          </div>
          
          {/* Badges */}
          <div>
            <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Badges à Débloquer
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {virtueData.badges.map((badge) => (
                <BadgeCard 
                  key={badge.id}
                  badge={badge}
                  isUnlocked={unlockedBadges.includes(badge.id)}
                />
              ))}
            </div>
          </div>
          
          {/* Niveaux */}
          <div>
            <h3 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Progression des Niveaux
            </h3>
            <div className="space-y-2">
              {virtueData.levels.map((level) => (
                <div 
                  key={level.level}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    currentLevel.level >= level.level 
                      ? 'bg-emerald-900/30 border border-emerald-500/50' 
                      : 'bg-slate-800/30 border border-slate-700/30 opacity-50'
                  }`}
                >
                  <div className="text-2xl">{level.badge}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">Niveau {level.level} - {level.name}</p>
                    <p className="text-xs text-slate-400">{level.title}</p>
                  </div>
                  <div className="text-sm text-amber-400 font-bold">{level.xpRequired} XP</div>
                  {currentLevel.level >= level.level && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * VirtuesGamification - Composant principal de gamification des vertus
 */
const VirtuesGamification = ({ 
  virtueXpMap = {}, 
  completedChallenges = [], 
  unlockedBadges = [],
  onCompleteChallenge,
  onOpenVirtueDetail
}) => {
  const [selectedVirtue, setSelectedVirtue] = useState(null);
  
  // Calculs globaux
  const totalXp = calculateTotalXp(virtueXpMap);
  const specialTitle = getSpecialTitle(totalXp, virtueXpMap);
  
  // Stats
  const virtuesList = Object.entries(VIRTUES_GAMIFICATION);
  const totalBadges = unlockedBadges.length;
  const totalChallenges = completedChallenges.length;
  
  // Streak (simulé pour l'exemple)
  const currentStreak = 3;
  
  const handleVirtueClick = (virtueId) => {
    setSelectedVirtue(virtueId);
    onOpenVirtueDetail?.(virtueId);
  };
  
  const handleCloseDetail = () => {
    setSelectedVirtue(null);
  };

  return (
    <div className="space-y-6" data-testid="virtues-gamification">
      {/* Header avec titre spécial */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600/30 to-orange-600/30 rounded-full px-6 py-3 border border-amber-500/30">
          <span className="text-4xl">{specialTitle?.emoji || "🥋"}</span>
          <div>
            <h3 className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400">
              {specialTitle?.title || "Jeune Ninja"}
            </h3>
            <p className="text-amber-300 text-sm">{totalXp} XP Total</p>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-amber-900/40 to-yellow-900/40 rounded-xl p-4 text-center border border-amber-500/30">
          <Zap className="w-6 h-6 text-amber-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-amber-300">{totalXp}</p>
          <p className="text-xs text-slate-400">XP Total</p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 rounded-xl p-4 text-center border border-purple-500/30">
          <Award className="w-6 h-6 text-purple-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-purple-300">{totalBadges}</p>
          <p className="text-xs text-slate-400">Badges</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 rounded-xl p-4 text-center border border-emerald-500/30">
          <Target className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-emerald-300">{totalChallenges}</p>
          <p className="text-xs text-slate-400">Défis</p>
        </div>
        <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-xl p-4 text-center border border-orange-500/30">
          <Flame className="w-6 h-6 text-orange-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-orange-300">{currentStreak}</p>
          <p className="text-xs text-slate-400">Jours 🔥</p>
        </div>
      </div>

      {/* Grille des 7 Vertus */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-violet-300 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            🌟 Les 7 Vertus Magiques
          </h4>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {virtuesList.map(([virtueId, virtueData]) => (
            <VirtueProgressCard 
              key={virtueId}
              virtueId={virtueId}
              virtueData={virtueData}
              xp={virtueXpMap[virtueId] || 0}
              onClick={handleVirtueClick}
            />
          ))}
        </div>
      </div>

      {/* Trophées Globaux */}
      <div className="bg-gradient-to-br from-amber-900/30 via-yellow-900/30 to-orange-900/30 rounded-2xl p-5 border-2 border-amber-500/40">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            🏆 Trophées Légendaires
          </h4>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {GLOBAL_TROPHIES.slice(0, 5).map((trophy) => (
            <div 
              key={trophy.id}
              className={`relative rounded-xl p-3 text-center transition-all ${
                unlockedBadges.includes(trophy.id)
                  ? 'bg-gradient-to-br from-amber-800/50 to-yellow-800/50 border border-amber-400/50'
                  : 'bg-slate-800/30 border border-slate-700/30 opacity-40 grayscale'
              }`}
            >
              <div className="text-3xl mb-1">{trophy.emoji}</div>
              <h5 className="font-semibold text-white text-xs">{trophy.name}</h5>
              <p className="text-[10px] text-amber-400 mt-1">+{trophy.xpBonus} XP</p>
            </div>
          ))}
        </div>
      </div>

      {/* Message d'encouragement */}
      <div className="text-center bg-gradient-to-r from-violet-600/20 via-pink-600/20 to-amber-600/20 rounded-xl p-4 border border-violet-500/20">
        <p className="text-violet-300 font-medium">
          🎯 Continue à relever des défis pour faire évoluer tes animaux gardiens !
        </p>
        <p className="text-slate-400 text-sm mt-1">
          Chaque vertu te rapproche de devenir un vrai Maître Ninja ! 🥷✨
        </p>
      </div>

      {/* Panel de détail */}
      {selectedVirtue && (
        <VirtueDetailPanel
          virtueId={selectedVirtue}
          xp={virtueXpMap[selectedVirtue] || 0}
          completedChallenges={completedChallenges}
          unlockedBadges={unlockedBadges}
          onClose={handleCloseDetail}
          onCompleteChallenge={onCompleteChallenge}
        />
      )}
    </div>
  );
};

export default VirtuesGamification;
