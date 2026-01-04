import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, Circle, Lock, Star, ChevronRight, ChevronLeft,
  Trophy, Flame, Target, Sparkles, Clock, PartyPopper
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * ProgressionTunnel - Tunnel de progression horizontal ludique
 * Combine défis des 7 Vertus + Techniques d'Aikido
 */
const ProgressionTunnel = ({ 
  currentBelt = {},
  statistics = {},
  virtueData = {},
  onCompleteChallenge,
  onRequestParentValidation,
  userName = "Ninja"
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedToday, setCompletedToday] = useState([]);
  const [pendingValidation, setPendingValidation] = useState([]);

  // Défis du jour combinés (Vertus + Techniques)
  const dailyChallenges = [
    {
      id: "step1",
      type: "vertu",
      vertu: "Respect",
      emoji: "🙏",
      kanji: "礼",
      title: "Salut Parfait",
      description: "Fais un salut sincère au début et à la fin du cours",
      points: 10,
      color: "from-yellow-500 to-amber-500",
      animal: "🦁"
    },
    {
      id: "step2", 
      type: "technique",
      grade: "6e KYU",
      emoji: "🥋",
      title: "Tai Sabaki",
      description: "Pratique 5 fois le déplacement Tai Sabaki",
      points: 15,
      color: "from-cyan-500 to-blue-500",
      animal: "🐢"
    },
    {
      id: "step3",
      type: "vertu",
      vertu: "Courage",
      emoji: "💪",
      kanji: "勇",
      title: "Main Levée",
      description: "Pose une question au sensei pendant le cours",
      points: 10,
      color: "from-orange-500 to-red-500",
      animal: "🐯"
    },
    {
      id: "step4",
      type: "technique",
      grade: "6e KYU",
      emoji: "🌀",
      title: "Chute Avant",
      description: "Réalise 3 chutes avant (Mae Ukemi) sans hésiter",
      points: 15,
      color: "from-emerald-500 to-green-500",
      animal: "🐬"
    },
    {
      id: "step5",
      type: "vertu",
      vertu: "Bienveillance",
      emoji: "💝",
      kanji: "仁",
      title: "Coup de Main",
      description: "Aide un camarade pendant l'entraînement",
      points: 10,
      color: "from-pink-500 to-rose-500",
      animal: "🐼"
    }
  ];

  // Calcul des points du jour
  const pointsToday = completedToday.reduce((sum, id) => {
    const challenge = dailyChallenges.find(c => c.id === id);
    return sum + (challenge?.points || 0);
  }, 0);

  // Gestion de la validation
  const handleComplete = (challenge) => {
    if (completedToday.includes(challenge.id)) {
      toast.info("Tu as déjà validé ce défi !");
      return;
    }

    // Ajouter aux défis en attente de validation parentale
    setPendingValidation(prev => [...prev, challenge.id]);
    
    toast.success(
      <div className="flex items-center gap-2">
        <span className="text-2xl">{challenge.animal}</span>
        <div>
          <p className="font-bold">Bravo ! +{challenge.points} pts</p>
          <p className="text-xs opacity-80">En attente de validation parent</p>
        </div>
      </div>
    );

    // Simuler validation parentale automatique après 2s (à remplacer par vraie logique)
    setTimeout(() => {
      setCompletedToday(prev => [...prev, challenge.id]);
      setPendingValidation(prev => prev.filter(id => id !== challenge.id));
      
      toast.success(
        <div className="flex items-center gap-2">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-bold">Validé par les parents !</p>
            <p className="text-xs opacity-80">{challenge.title} confirmé</p>
          </div>
        </div>
      );

      onCompleteChallenge?.(challenge);
    }, 2000);
  };

  // Navigation dans le tunnel
  const goNext = () => {
    if (currentStep < dailyChallenges.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentChallenge = dailyChallenges[currentStep];
  const isCompleted = completedToday.includes(currentChallenge?.id);
  const isPending = pendingValidation.includes(currentChallenge?.id);
  const allCompleted = completedToday.length === dailyChallenges.length;

  return (
    <div className="space-y-6" data-testid="progression-tunnel">
      
      {/* Header du Tunnel */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-5xl animate-bounce">{currentBelt?.animalSpirit || "🥋"}</div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                🎯 Mon Parcours du Jour
              </h2>
              <p className="text-purple-200 text-sm">
                {completedToday.length}/{dailyChallenges.length} défis complétés
              </p>
            </div>
          </div>
          
          {/* Points du jour */}
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-center">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-300" />
                <span className="text-2xl font-black text-white">{pointsToday}</span>
              </div>
              <p className="text-purple-200 text-xs">Points du jour</p>
            </div>
            
            {allCompleted && (
              <div className="bg-amber-500 rounded-xl px-4 py-2 text-center animate-pulse">
                <PartyPopper className="w-6 h-6 text-white mx-auto" />
                <p className="text-white text-xs font-bold">PARFAIT !</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Horizontale */}
      <div className="relative">
        {/* Ligne de progression */}
        <div className="absolute top-8 left-0 right-0 h-2 bg-slate-700 rounded-full mx-12">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${(completedToday.length / dailyChallenges.length) * 100}%` }}
          />
        </div>

        {/* Points de la timeline */}
        <div className="flex justify-between items-start relative z-10 px-4">
          {dailyChallenges.map((challenge, idx) => {
            const isActive = idx === currentStep;
            const isDone = completedToday.includes(challenge.id);
            const isWaiting = pendingValidation.includes(challenge.id);
            
            return (
              <button
                key={challenge.id}
                onClick={() => setCurrentStep(idx)}
                className={`
                  flex flex-col items-center transition-all duration-300
                  ${isActive ? 'scale-125 -translate-y-2' : 'opacity-60 hover:opacity-100'}
                `}
              >
                {/* Icône du step */}
                <div className={`
                  w-14 h-14 rounded-full flex items-center justify-center text-2xl
                  border-4 transition-all shadow-lg
                  ${isDone 
                    ? 'bg-emerald-500 border-emerald-300 shadow-emerald-500/50' 
                    : isWaiting
                      ? 'bg-amber-500 border-amber-300 shadow-amber-500/50 animate-pulse'
                      : isActive 
                        ? `bg-gradient-to-br ${challenge.color} border-white shadow-purple-500/50` 
                        : 'bg-slate-700 border-slate-600'
                  }
                `}>
                  {isDone ? (
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  ) : isWaiting ? (
                    <Clock className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <span>{challenge.emoji}</span>
                  )}
                </div>
                
                {/* Label */}
                <span className={`
                  mt-2 text-xs font-bold text-center max-w-[60px] leading-tight
                  ${isActive ? 'text-white' : 'text-slate-400'}
                `}>
                  {challenge.type === 'vertu' ? challenge.vertu : challenge.title.split(' ')[0]}
                </span>
                
                {/* Points */}
                <span className={`
                  text-[10px] px-2 py-0.5 rounded-full mt-1
                  ${isDone 
                    ? 'bg-emerald-500/30 text-emerald-300' 
                    : 'bg-slate-700 text-slate-400'
                  }
                `}>
                  +{challenge.points} pts
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Carte du Défi Actuel */}
      <div className={`
        relative overflow-hidden rounded-2xl p-6
        bg-gradient-to-br ${currentChallenge.color}
        shadow-2xl transition-all duration-500
      `}>
        {/* Décoration */}
        <div className="absolute top-2 right-4 text-6xl opacity-20">{currentChallenge.animal}</div>
        <div className="absolute bottom-2 left-4 text-4xl opacity-20">{currentChallenge.emoji}</div>
        
        {/* Navigation */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={goPrev}
            disabled={currentStep === 0}
            className="rounded-full bg-white/20 hover:bg-white/40 text-white p-2"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={goNext}
            disabled={currentStep === dailyChallenges.length - 1}
            className="rounded-full bg-white/20 hover:bg-white/40 text-white p-2"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Contenu */}
        <div className="relative text-center px-8">
          {/* Badge type */}
          <div className="inline-flex items-center gap-2 bg-black/20 rounded-full px-3 py-1 mb-3">
            <span className="text-lg">{currentChallenge.type === 'vertu' ? '☯️' : '🥋'}</span>
            <span className="text-white/90 text-xs font-bold uppercase">
              {currentChallenge.type === 'vertu' 
                ? `Vertu: ${currentChallenge.vertu}` 
                : `Technique: ${currentChallenge.grade}`
              }
            </span>
            {currentChallenge.kanji && (
              <span className="text-white text-lg font-bold">{currentChallenge.kanji}</span>
            )}
          </div>

          {/* Titre et description */}
          <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
            {currentChallenge.emoji} {currentChallenge.title}
          </h3>
          <p className="text-white/90 text-base md:text-lg mb-4 max-w-md mx-auto">
            {currentChallenge.description}
          </p>

          {/* Points à gagner */}
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
            <Star className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-bold text-lg">+{currentChallenge.points} points</span>
          </div>

          {/* Bouton d'action */}
          {isCompleted ? (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                Défi Validé ! ✨
              </div>
              <p className="text-white/70 text-sm">Bravo {userName} !</p>
            </div>
          ) : isPending ? (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 animate-pulse">
                <Clock className="w-6 h-6 animate-spin" />
                En attente de validation parent...
              </div>
              <p className="text-white/70 text-sm">Tes parents vont confirmer</p>
            </div>
          ) : (
            <Button
              onClick={() => handleComplete(currentChallenge)}
              className="bg-white text-slate-900 hover:bg-white/90 font-black px-8 py-4 rounded-xl text-lg shadow-xl transform hover:scale-105 transition-all"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              J'ai fait ! 🎉
            </Button>
          )}
        </div>
      </div>

      {/* Résumé des défis */}
      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" />
          Défis du jour
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
          {dailyChallenges.map((challenge, idx) => {
            const isDone = completedToday.includes(challenge.id);
            const isWaiting = pendingValidation.includes(challenge.id);
            
            return (
              <button
                key={challenge.id}
                onClick={() => setCurrentStep(idx)}
                className={`
                  flex items-center gap-2 p-2 rounded-lg transition-all
                  ${isDone 
                    ? 'bg-emerald-600/30 border border-emerald-500/50' 
                    : isWaiting
                      ? 'bg-amber-600/30 border border-amber-500/50'
                      : 'bg-slate-700/50 border border-slate-600/50 hover:border-purple-500/50'
                  }
                `}
              >
                <span className="text-lg">{challenge.emoji}</span>
                <div className="flex-1 text-left">
                  <p className={`text-xs font-bold ${isDone ? 'text-emerald-300' : 'text-white'}`}>
                    {challenge.title.length > 12 ? challenge.title.slice(0, 12) + '...' : challenge.title}
                  </p>
                  <p className="text-[10px] text-slate-400">+{challenge.points} pts</p>
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isWaiting ? (
                  <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Message motivation */}
      <div className="text-center bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-amber-600/20 rounded-xl p-4 border border-purple-500/20">
        <p className="text-purple-300 font-medium">
          {allCompleted 
            ? `🎊 Fantastique ${userName} ! Tu as complété tous les défis du jour !`
            : `💪 Allez ${userName} ! Plus que ${dailyChallenges.length - completedToday.length} défi(s) pour aujourd'hui !`
          }
        </p>
        <p className="text-slate-400 text-sm mt-1">
          {allCompleted 
            ? "Reviens demain pour de nouveaux défis ! 🌟"
            : "Chaque défi te rapproche de ton prochain grade ! 🥋"
          }
        </p>
      </div>
    </div>
  );
};

export default ProgressionTunnel;
