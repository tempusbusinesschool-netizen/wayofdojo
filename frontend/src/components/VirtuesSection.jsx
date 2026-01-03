import React, { useState } from 'react';
import { Sparkles, Trophy, Star, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VirtuesGamification from './VirtuesGamification';
import { VIRTUES_GAMIFICATION } from '@/constants/virtuesGamification';

// Les 7 Vertus de l'Aikido avec design enfantin
const VIRTUES_DATA = [
  { 
    name: "Respect", 
    kanji: "礼", 
    emoji: "🙏", 
    color: "from-yellow-400 to-amber-500",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/40",
    animal: "🦁",
    animalName: "Lion Noble",
    message: "Salue avec le cœur !",
    description: "Respecter son sensei, ses partenaires et le dojo"
  },
  { 
    name: "Courage", 
    kanji: "勇", 
    emoji: "💪", 
    color: "from-orange-400 to-red-500",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500/40",
    animal: "🐯",
    animalName: "Tigre Brave",
    message: "N'aie jamais peur d'essayer !",
    description: "Oser essayer même quand c'est difficile"
  },
  { 
    name: "Maîtrise", 
    kanji: "克", 
    emoji: "🧘", 
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/40",
    animal: "🐢",
    animalName: "Tortue Zen",
    message: "Reste calme comme l'eau !",
    description: "Contrôler ses émotions et rester calme"
  },
  { 
    name: "Humilité", 
    kanji: "謙", 
    emoji: "🌱", 
    color: "from-violet-400 to-purple-500",
    bgColor: "bg-violet-500/20",
    borderColor: "border-violet-500/40",
    animal: "🐰",
    animalName: "Lapin Sage",
    message: "Apprends de tout le monde !",
    description: "Reconnaître qu'on peut toujours apprendre"
  },
  { 
    name: "Bienveillance", 
    kanji: "仁", 
    emoji: "💝", 
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-500/20",
    borderColor: "border-pink-500/40",
    animal: "🐼",
    animalName: "Panda Gentil",
    message: "Aide tes amis du dojo !",
    description: "Être gentil et aider les autres"
  },
  { 
    name: "Attention", 
    kanji: "注", 
    emoji: "👁️", 
    color: "from-cyan-400 to-blue-500",
    bgColor: "bg-cyan-500/20",
    borderColor: "border-cyan-500/40",
    animal: "🦉",
    animalName: "Hibou Vigilant",
    message: "Écoute et observe bien !",
    description: "Être attentif à ce qui se passe autour"
  },
  { 
    name: "Responsabilité", 
    kanji: "責", 
    emoji: "⚖️", 
    color: "from-teal-400 to-cyan-500",
    bgColor: "bg-teal-500/20",
    borderColor: "border-teal-500/40",
    animal: "🦅",
    animalName: "Aigle Responsable",
    message: "Assume tes choix !",
    description: "Être responsable de ses actions"
  }
];

/**
 * VirtueCard - Carte individuelle pour une vertu
 */
const VirtueCard = ({ virtue, points = 0, isUnlocked = false, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const progress = Math.min(100, points * 10); // 10 points = 100%
  
  return (
    <div 
      className={`relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 ${isHovered ? 'scale-105 -translate-y-1' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Fond avec gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${virtue.color} opacity-90`} />
      
      {/* Étoiles décoratives */}
      {isUnlocked && (
        <>
          <div className="absolute top-2 right-2 text-xl animate-pulse">✨</div>
          <div className="absolute bottom-2 left-2 text-sm animate-bounce" style={{ animationDelay: '0.3s' }}>⭐</div>
        </>
      )}
      
      {/* Badge animal */}
      <div className="absolute -top-1 -left-1 w-10 h-10 bg-white/30 rounded-full flex items-center justify-center text-xl shadow-lg">
        {virtue.animal}
      </div>
      
      {/* Contenu */}
      <div className="relative p-4 pt-8">
        {/* Emoji principal */}
        <div className="text-center mb-2">
          <span className={`text-4xl ${isUnlocked ? 'animate-bounce' : ''}`} style={{ animationDuration: '2s' }}>
            {virtue.emoji}
          </span>
        </div>
        
        {/* Nom et Kanji */}
        <div className="text-center">
          <h4 className="font-bold text-white text-sm">{virtue.name}</h4>
          <span className="text-white/70 text-lg font-bold">{virtue.kanji}</span>
        </div>
        
        {/* Message encourageant */}
        <p className="text-center text-white/90 text-xs mt-2 font-medium">
          {virtue.message}
        </p>
        
        {/* Barre de progression */}
        <div className="mt-3 h-2 bg-black/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white/80 rounded-full transition-all duration-1000"
            style={{ width: `${Math.max(5, progress)}%` }}
          />
        </div>
        
        {/* Points */}
        <div className="text-center mt-2">
          <span className="text-white font-bold text-xs bg-white/20 px-2 py-0.5 rounded-full">
            {points} pts
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * TrophyCard - Carte pour un trophée
 */
const TrophyCard = ({ trophy, isUnlocked = false }) => {
  const bgColors = [
    'from-purple-600 to-indigo-700',
    'from-pink-600 to-rose-700',
    'from-amber-600 to-orange-700',
    'from-cyan-600 to-blue-700',
    'from-emerald-600 to-green-700'
  ];
  const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
  
  return (
    <div 
      className={`relative overflow-hidden rounded-xl p-3 ${isUnlocked ? 'opacity-100' : 'opacity-40 grayscale'} transition-all hover:scale-105 cursor-pointer`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${randomBg}`} />
      <div className="relative text-center">
        <span className={`text-3xl ${isUnlocked ? 'animate-bounce' : ''}`} style={{ animationDuration: '3s' }}>
          {trophy.icon}
        </span>
        <p className="text-white text-xs font-medium mt-1 truncate">{trophy.name}</p>
        {isUnlocked && <div className="absolute -top-1 -right-1 text-sm">✅</div>}
      </div>
    </div>
  );
};

/**
 * VirtuesSection - Section complète des valeurs de l'Aikido (version ludique enfant)
 */
const VirtuesSection = ({ 
  virtueData = [], 
  totalPoints = 0,
  trophies = { unlocked: [], locked: [] },
  statistics = {},
  currentBelt = {},
  onOpenVirtueActions,
  onOpenVirtuesDialog,
  onOpenTrophiesDialog
}) => {
  // Calcul des points par vertu
  const virtuePoints = {};
  VIRTUES_DATA.forEach(v => {
    const found = virtueData.find(vd => vd.name === v.name);
    virtuePoints[v.name] = found ? found.value : 0;
  });

  // Points breakdown
  const points = {
    learning: statistics.in_progress_techniques || 0,
    practiced: statistics.practiced_techniques || 0,
    mastered: statistics.mastered_techniques || 0,
    belt: currentBelt?.points || 0,
    total: totalPoints
  };

  return (
    <div className="space-y-6">
      {/* Section Points Total - Design ludique */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-amber-900/50 border-2 border-purple-500/40">
        {/* Étoiles décoratives */}
        <div className="absolute top-3 right-3 text-2xl animate-pulse">⭐</div>
        <div className="absolute bottom-3 left-3 text-xl animate-bounce">✨</div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              🎯 Mes Points Ninja
            </h4>
            <p className="text-slate-400 text-sm">Plus tu pratiques, plus tu deviens fort !</p>
          </div>
          
          {/* Score Total */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/50 border-4 border-white/20">
                <div className="text-center">
                  <span className="text-3xl font-extrabold text-white">{points.total}</span>
                  <p className="text-white/80 text-xs font-bold">POINTS</p>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🏆</div>
            </div>
            
            <Button 
              onClick={onOpenVirtueActions}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold shadow-lg shadow-amber-500/30 animate-pulse"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Gagner des points !
            </Button>
          </div>
        </div>

        {/* Mini cartes de points */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="bg-amber-500/20 rounded-xl p-2 text-center border border-amber-500/30">
            <span className="text-2xl">📖</span>
            <p className="text-amber-300 font-bold text-lg">{points.learning}</p>
            <p className="text-slate-400 text-xs">En cours</p>
          </div>
          <div className="bg-blue-500/20 rounded-xl p-2 text-center border border-blue-500/30">
            <span className="text-2xl">🎯</span>
            <p className="text-blue-300 font-bold text-lg">{points.practiced}</p>
            <p className="text-slate-400 text-xs">Pratiquées</p>
          </div>
          <div className="bg-emerald-500/20 rounded-xl p-2 text-center border border-emerald-500/30">
            <span className="text-2xl">🏆</span>
            <p className="text-emerald-300 font-bold text-lg">{points.mastered}</p>
            <p className="text-slate-400 text-xs">Maîtrisées</p>
          </div>
          <div className="bg-purple-500/20 rounded-xl p-2 text-center border border-purple-500/30">
            <span className="text-2xl">{currentBelt?.emoji || '⚪'}</span>
            <p className="text-purple-300 font-bold text-lg">+{points.belt}</p>
            <p className="text-slate-400 text-xs">Ceinture</p>
          </div>
        </div>
      </div>

      {/* Grille des 7 Vertus */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-violet-300 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            🌟 Les 7 Vertus Magiques
          </h4>
          <Button 
            onClick={onOpenVirtuesDialog}
            variant="ghost"
            size="sm"
            className="text-violet-400 hover:text-violet-300 hover:bg-violet-900/30"
          >
            Voir tout <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {VIRTUES_DATA.map((virtue, idx) => (
            <VirtueCard 
              key={idx}
              virtue={virtue}
              points={virtuePoints[virtue.name] || 0}
              isUnlocked={virtuePoints[virtue.name] > 0}
              onClick={onOpenVirtuesDialog}
            />
          ))}
        </div>
      </div>

      {/* Section Trophées */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-amber-900/30 via-yellow-900/30 to-orange-900/30 border-2 border-amber-500/40">
        {/* Étoiles */}
        <div className="absolute top-2 right-4 text-xl animate-pulse">🌟</div>
        <div className="absolute bottom-2 left-4 text-lg animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
        
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            🏆 Mes Trophées ({trophies.unlocked?.length || 0})
          </h4>
          <Button 
            onClick={onOpenTrophiesDialog}
            variant="ghost"
            size="sm"
            className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/30"
          >
            Collection complète <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        {trophies.unlocked?.length === 0 ? (
          <div className="text-center py-6">
            <span className="text-5xl mb-3 block">🎁</span>
            <p className="text-amber-300 font-medium">Tes premiers trophées t'attendent !</p>
            <p className="text-slate-400 text-sm mt-1">Continue à pratiquer pour les débloquer 💪</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {trophies.unlocked?.slice(0, 6).map((trophy, idx) => (
              <TrophyCard key={idx} trophy={trophy} isUnlocked={true} />
            ))}
            {trophies.unlocked?.length > 6 && (
              <div 
                className="flex items-center justify-center rounded-xl bg-purple-600/30 border border-purple-500/40 cursor-pointer hover:bg-purple-600/50 transition-all"
                onClick={onOpenTrophiesDialog}
              >
                <span className="text-purple-300 text-sm font-bold">+{trophies.unlocked.length - 6}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message d'encouragement */}
      <div className="text-center bg-gradient-to-r from-violet-600/20 via-pink-600/20 to-amber-600/20 rounded-xl p-4 border border-violet-500/20">
        <p className="text-violet-300 font-medium">
          🌈 Chaque vertu que tu développes te rend plus fort !
        </p>
        <p className="text-slate-400 text-sm mt-1">
          Continue ton entraînement et deviens un vrai maître ninja ! 🥷✨
        </p>
      </div>
    </div>
  );
};

export default VirtuesSection;
