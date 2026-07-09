import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, Circle, Lock, Star, ChevronRight, ChevronLeft,
  Trophy, Flame, Target, Sparkles, Clock, PartyPopper, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { AIKIDO_CHARACTERS } from '@/constants/aikidoCharacters';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/**
 * ProgressionTunnel - Tunnel de progression horizontal ludique
 * Connecté au backend pour persister les défis complétés
 */
const ProgressionTunnel = ({ 
  currentBelt = {},
  statistics = {},
  virtueData = {},
  onCompleteChallenge,
  onRequestParentValidation,
  userName = "Ninja",
  userId = null,
  isAuthenticated = false,
  onRefreshStats
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [challenges, setChallenges] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [completedTodayIds, setCompletedTodayIds] = useState([]);
  const [pendingIds, setPendingIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null); // ID du défi en cours de complétion

  // Charger les défis quotidiens depuis le backend
  const fetchChallenges = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/gamification/daily-challenges`);
      // Transformer les données backend vers le format frontend
      const formattedChallenges = response.data.map((c, idx) => ({
        id: c.id,
        type: c.type === 'daily' ? (c.virtue ? 'vertu' : 'technique') : c.type,
        vertu: c.virtue,
        emoji: c.icon,
        kanji: getKanjiForVirtue(c.virtue),
        title: c.name,
        description: c.description,
        points: c.xp_reward,
        xp_reward: c.xp_reward,
        needs_parent_validation: c.needs_parent_validation,
        color: getColorForIndex(idx),
        animal: getAnimalForIndex(idx)
      }));
      setChallenges(formattedChallenges);
      return formattedChallenges;
    } catch (err) {
      console.error('Error fetching challenges:', err);
      // Fallback vers des défis par défaut si l'API échoue
      setChallenges(getDefaultChallenges());
      return getDefaultChallenges();
    }
  }, []);

  // Charger les stats utilisateur
  const fetchUserStats = useCallback(async () => {
    if (!userId || !isAuthenticated) {
      setUserStats(null);
      setCompletedTodayIds([]);
      setPendingIds([]);
      return;
    }

    try {
      const response = await axios.get(`${API}/gamification/stats/${userId}`);
      const stats = response.data;
      setUserStats(stats);

      // Extraire les défis complétés aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      const completedToday = (stats.completed_challenges || [])
        .filter(c => c.completed_date === today)
        .map(c => c.challenge_id);
      setCompletedTodayIds(completedToday);

      // Extraire les défis en attente de validation
      const pending = (stats.pending_validations || [])
        .filter(c => c.status === 'pending')
        .map(c => c.challenge_id);
      setPendingIds(pending);

    } catch (err) {
      console.error('Error fetching user stats:', err);
      setUserStats(null);
    }
  }, [userId, isAuthenticated]);

  // Charger les données au montage
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchChallenges(), fetchUserStats()]);
      setLoading(false);
    };
    loadData();
  }, [fetchChallenges, fetchUserStats]);

  // Compléter un défi
  const handleComplete = async (challenge) => {
    // Vérifier si déjà complété
    if (completedTodayIds.includes(challenge.id)) {
      toast.info("Tu as déjà validé ce défi aujourd'hui !");
      return;
    }

    // Vérifier si en attente
    if (pendingIds.includes(challenge.id)) {
      toast.info("Ce défi est en attente de validation par tes parents !");
      return;
    }

    // Si non authentifié, afficher un message
    if (!isAuthenticated) {
      toast.error(
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          <div>
            <p className="font-bold">Connexion requise</p>
            <p className="text-xs opacity-80">Connecte-toi pour sauvegarder ta progression</p>
          </div>
        </div>
      );
      return;
    }

    setCompleting(challenge.id);

    try {
      // Appeler le backend pour compléter le défi
      await axios.post(`${API}/gamification/challenge/complete`, {
        challenge_id: challenge.id,
        challenge_type: challenge.type || 'daily',
        challenge_name: challenge.title,
        xp_reward: challenge.points,
        needs_parent_validation: challenge.needs_parent_validation || false
      });

      // Afficher la notification de succès avec personnage
      if (challenge.needs_parent_validation) {
        // Ajouter aux pending
        setPendingIds(prev => [...prev, challenge.id]);
        toast.success(
          <div className="flex items-center gap-3">
            <img 
              src={AIKIDO_CHARACTERS.ENFANT_SALUT} 
              alt="En attente" 
              className="w-14 h-14 object-contain"
            />
            <div>
              <p className="font-bold text-slate-900">Bravo ! +{challenge.points} XP en attente</p>
              <p className="text-xs text-slate-600">En attente de validation parent 👨‍👩‍👧</p>
            </div>
          </div>
        );
        onRequestParentValidation?.(challenge);
      } else {
        // Ajouter aux complétés
        setCompletedTodayIds(prev => [...prev, challenge.id]);
        toast.success(
          <div className="flex items-center gap-3">
            <img 
              src={AIKIDO_CHARACTERS.ENFANT_CELEBRATION} 
              alt="Célébration" 
              className="w-14 h-14 object-contain animate-bounce"
            />
            <div>
              <p className="font-bold text-slate-900">Bravo ! +{challenge.points} XP gagnés !</p>
              <p className="text-xs text-slate-600">{challenge.title} validé ✅</p>
            </div>
          </div>
        );
        onCompleteChallenge?.(challenge);
      }

      // Rafraîchir les stats
      await fetchUserStats();
      onRefreshStats?.();

    } catch (err) {
      console.error('Error completing challenge:', err);
      
      if (err.response?.status === 400) {
        toast.info("Ce défi a déjà été complété aujourd'hui !");
        // Rafraîchir pour synchroniser l'état
        await fetchUserStats();
      } else {
        toast.error("Erreur lors de la validation du défi");
      }
    } finally {
      setCompleting(null);
    }
  };

  // Navigation dans le tunnel
  const goNext = () => {
    if (currentStep < challenges.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Calculs
  const currentChallenge = challenges[currentStep];
  const isCompleted = completedTodayIds.includes(currentChallenge?.id);
  const isPending = pendingIds.includes(currentChallenge?.id);
  const allCompleted = challenges.length > 0 && completedTodayIds.length >= challenges.length;

  const pointsToday = challenges.reduce((sum, c) => {
    if (completedTodayIds.includes(c.id)) {
      return sum + (c.points || 0);
    }
    return sum;
  }, 0);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <span className="ml-3 text-slate-400">Chargement des défis...</span>
      </div>
    );
  }

  // Si pas de défis
  if (challenges.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Aucun défi disponible pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="progression-tunnel">
      
      {/* 🎯 HEADER SIMPLIFIÉ ET CLAIR */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Décoration de fond */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative z-10">
          {/* Titre principal */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <span className="text-4xl">{currentBelt?.animalSpirit || "🥋"}</span>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">
                  Mes Défis du Jour
                </h2>
                <p className="text-white/80 text-sm">
                  Salut {userName} ! Voici tes missions pour aujourd&apos;hui 💪
                </p>
              </div>
            </div>
            
            {allCompleted && (
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl px-5 py-3 text-center animate-bounce shadow-lg">
                <PartyPopper className="w-8 h-8 text-white mx-auto mb-1" />
                <p className="text-white text-sm font-black">BRAVO !</p>
              </div>
            )}
          </div>
          
          {/* Barre de progression visuelle */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 text-sm font-medium">Ma progression du jour</span>
              <span className="text-white font-black text-lg">
                {completedTodayIds.length} / {challenges.length}
              </span>
            </div>
            <div className="h-4 bg-black/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 rounded-full transition-all duration-700 ease-out relative"
                style={{ width: `${(completedTodayIds.length / Math.max(challenges.length, 1)) * 100}%` }}
              >
                {completedTodayIds.length > 0 && (
                  <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/50 rounded-full animate-pulse" />
                )}
              </div>
            </div>
            
            {/* Stats en ligne */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-orange-500/30 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-300" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{pointsToday}</p>
                  <p className="text-white/60 text-xs">XP gagnés</p>
                </div>
              </div>
              
              {userStats && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/30 flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">{userStats.total_xp || 0}</p>
                    <p className="text-white/60 text-xs">XP total</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 📋 LISTE DES DÉFIS - Format carte simple */}
      <div className="grid gap-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 px-1">
          <Target className="w-5 h-5 text-purple-400" />
          Mes {challenges.length} défis à relever
        </h3>
        
        {challenges.map((challenge, idx) => {
          const isDone = completedTodayIds.includes(challenge.id);
          const isWaiting = pendingIds.includes(challenge.id);
          const isCurrent = idx === currentStep;
          
          return (
            <div
              key={challenge.id}
              onClick={() => setCurrentStep(idx)}
              className={`
                relative rounded-2xl p-4 cursor-pointer transition-all duration-300
                ${isDone 
                  ? 'bg-emerald-500/20 border-2 border-emerald-500/50' 
                  : isWaiting
                    ? 'bg-amber-500/20 border-2 border-amber-500/50'
                    : isCurrent
                      ? 'bg-purple-500/20 border-2 border-purple-500/50 ring-2 ring-purple-400/30'
                      : 'bg-slate-800/50 border-2 border-slate-700/50 hover:border-slate-600'
                }
              `}
            >
              <div className="flex items-center gap-4">
                {/* Icône du défi */}
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center text-2xl
                  ${isDone 
                    ? 'bg-emerald-500 text-white' 
                    : isWaiting
                      ? 'bg-amber-500'
                      : 'bg-slate-700'
                  }
                `}>
                  {isDone ? (
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  ) : isWaiting ? (
                    <Clock className="w-6 h-6 text-white animate-pulse" />
                  ) : (
                    <span>{challenge.emoji}</span>
                  )}
                </div>
                
                {/* Contenu du défi */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`
                      text-xs font-bold px-2 py-0.5 rounded-full
                      ${challenge.type === 'vertu' ? 'bg-purple-500/30 text-purple-300' : 'bg-cyan-500/30 text-cyan-300'}
                    `}>
                      {challenge.type === 'vertu' ? '☯️ Vertu' : '🥋 Technique'}
                    </span>
                    {challenge.needs_parent_validation && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-500/30 text-pink-300">
                        👨‍👩‍👧 Parent
                      </span>
                    )}
                  </div>
                  <h4 className={`font-bold text-base ${isDone ? 'text-emerald-300' : 'text-white'}`}>
                    {challenge.title}
                  </h4>
                  <p className="text-slate-400 text-sm line-clamp-1">
                    {challenge.description}
                  </p>
                </div>
                
                {/* Points XP */}
                <div className="text-center">
                  <div className={`
                    px-3 py-2 rounded-xl font-black
                    ${isDone 
                      ? 'bg-emerald-500/30 text-emerald-300' 
                      : 'bg-slate-700/50 text-amber-300'
                    }
                  `}>
                    <span className="text-lg">+{challenge.points}</span>
                    <p className="text-xs opacity-70">XP</p>
                  </div>
                </div>
              </div>
              
              {/* Statut du défi */}
              {isDone && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Validé !
                </div>
              )}
              {isWaiting && (
                <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <Clock className="w-3 h-3" />
                  En attente
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 🎮 CARTE DU DÉFI SÉLECTIONNÉ - Pour validation */}
      {currentChallenge && !completedTodayIds.includes(currentChallenge.id) && !pendingIds.includes(currentChallenge.id) && (
        <div className={`
          relative overflow-hidden rounded-3xl p-6 shadow-2xl
          bg-gradient-to-br ${currentChallenge.color}
        `}>
          {/* Fond décoratif */}
          <div className="absolute top-0 right-0 text-[150px] opacity-10 font-bold leading-none">
            {currentChallenge.kanji || currentChallenge.emoji}
          </div>
          
          <div className="relative z-10">
            {/* Header du défi */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <span className="text-4xl">{currentChallenge.emoji}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {currentChallenge.type === 'vertu' ? '☯️ Vertu' : '🥋 Technique'}
                    </span>
                    {currentChallenge.needs_parent_validation && (
                      <span className="bg-amber-500/50 text-white text-xs font-bold px-2 py-1 rounded-full">
                        👨‍👩‍👧 Validation parent
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-black text-white mt-1">
                    {currentChallenge.title}
                  </h3>
                </div>
              </div>
              
              <div className="text-center bg-white/20 backdrop-blur rounded-xl px-4 py-2">
                <span className="text-3xl font-black text-white">+{currentChallenge.points}</span>
                <p className="text-white/70 text-xs">XP</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/90 text-lg mb-6">
              {currentChallenge.description}
            </p>

            {/* Bouton d'action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goPrev}
                  disabled={currentStep === 0}
                  className="text-white/70 hover:text-white hover:bg-white/20"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <span className="text-white/70 text-sm">
                  {currentStep + 1} / {challenges.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goNext}
                  disabled={currentStep === challenges.length - 1}
                  className="text-white/70 hover:text-white hover:bg-white/20"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              <Button
                onClick={() => handleComplete(currentChallenge)}
                disabled={isCompleted || isPending || completing === currentChallenge.id}
                className={`
                  font-bold px-6 py-3 rounded-xl text-lg transition-all
                  ${isCompleted 
                    ? 'bg-emerald-500 text-white cursor-not-allowed' 
                    : isPending
                    ? 'bg-amber-500 text-white cursor-not-allowed'
                    : 'bg-white text-slate-900 hover:scale-105 hover:shadow-lg'
                  }
                `}
              >
                {completing === currentChallenge.id ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                ) : isPending ? (
                  <Clock className="w-5 h-5 mr-2" />
                ) : (
                  <Sparkles className="w-5 h-5 mr-2" />
                )}
                {isCompleted ? "Validé !" : isPending ? "En attente..." : "J'ai fait !"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Liste compacte des défis */}
      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          Tous les défis du jour
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {challenges.map((challenge, idx) => {
            const isDone = completedTodayIds.includes(challenge.id);
            const isWaiting = pendingIds.includes(challenge.id);
            
            return (
              <button
                key={challenge.id}
                onClick={() => setCurrentStep(idx)}
                className={`
                  flex items-center gap-3 p-3 rounded-xl transition-all
                  ${idx === currentStep 
                    ? 'bg-purple-600/30 border border-purple-500' 
                    : 'bg-slate-700/50 hover:bg-slate-700 border border-transparent'
                  }
                `}
              >
                <span className="text-xl">{challenge.emoji}</span>
                <div className="flex-1 text-left">
                  <p className={`text-sm font-bold ${isDone ? 'text-emerald-400' : isWaiting ? 'text-amber-400' : 'text-white'}`}>
                    {challenge.title}
                  </p>
                  <p className="text-xs text-slate-400">+{challenge.points} XP</p>
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isWaiting ? (
                  <Clock className="w-5 h-5 text-amber-400 animate-spin" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500" />
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
            : `💪 Allez ${userName} ! Plus que ${challenges.length - completedTodayIds.length} défi(s) pour aujourd'hui !`
          }
        </p>
        <p className="text-slate-400 text-sm mt-1">
          {allCompleted 
            ? "Reviens demain pour de nouveaux défis ! 🌟"
            : "Chaque défi te rapproche de ton prochain grade ! 🥋"
          }
        </p>
        
        {!isAuthenticated && (
          <p className="text-amber-400 text-xs mt-2 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Connecte-toi pour sauvegarder ta progression
          </p>
        )}
      </div>
    </div>
  );
};

// Helpers
const getKanjiForVirtue = (virtue) => {
  const kanjiMap = {
    'Respect': '礼',
    'Courage': '勇',
    'Bienveillance': '仁',
    'Honneur': '義',
    'Sagesse': '智',
    'Sincérité': '信',
    'Loyauté': '忠',
    'Attention': '心',
    'Agilité': '捷'
  };
  return kanjiMap[virtue] || '道';
};

const getColorForIndex = (idx) => {
  const colors = [
    'from-yellow-500 to-amber-500',
    'from-cyan-500 to-blue-500',
    'from-orange-500 to-red-500',
    'from-emerald-500 to-green-500',
    'from-pink-500 to-rose-500'
  ];
  return colors[idx % colors.length];
};

const getAnimalForIndex = (idx) => {
  const animals = ['🦁', '🐢', '🐯', '🐬', '🐼'];
  return animals[idx % animals.length];
};

const getDefaultChallenges = () => [
  {
    id: "salut",
    type: "vertu",
    vertu: "Respect",
    emoji: "🙏",
    kanji: "礼",
    title: "Salut Parfait",
    description: "Fais un salut sincère au début et à la fin du cours",
    points: 10,
    xp_reward: 10,
    needs_parent_validation: false,
    color: "from-yellow-500 to-amber-500",
    animal: "🦁"
  },
  {
    id: "tai_sabaki",
    type: "technique",
    emoji: "🦶",
    title: "Tai Sabaki",
    description: "Pratique un déplacement tai sabaki",
    points: 15,
    xp_reward: 15,
    needs_parent_validation: true,
    color: "from-cyan-500 to-blue-500",
    animal: "🐢"
  },
  {
    id: "ukemi_mae",
    type: "technique",
    emoji: "🔄",
    title: "Chute Avant",
    description: "Réalise 5 chutes avant (mae ukemi) correctes",
    points: 20,
    xp_reward: 20,
    needs_parent_validation: true,
    color: "from-orange-500 to-red-500",
    animal: "🐯"
  },
  {
    id: "aide",
    type: "vertu",
    vertu: "Bienveillance",
    emoji: "🤝",
    kanji: "仁",
    title: "Coup de Main",
    description: "Aide un camarade moins expérimenté",
    points: 25,
    xp_reward: 25,
    needs_parent_validation: false,
    color: "from-emerald-500 to-green-500",
    animal: "🐬"
  },
  {
    id: "attention",
    type: "vertu",
    vertu: "Attention",
    emoji: "✋",
    kanji: "心",
    title: "Main Levée",
    description: "Pose une question pendant le cours au dojo",
    points: 15,
    xp_reward: 15,
    needs_parent_validation: false,
    color: "from-pink-500 to-rose-500",
    animal: "🐼"
  }
];

export default ProgressionTunnel;
