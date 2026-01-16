import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { setTanakaEventCallback } from '@/hooks/useGamification';

/**
 * TanakaEventContext - Manages Maître Tanaka's reactions to gamification events
 * Plays pre-recorded audio and shows visual notifications
 */

// Image paths for different events
const TANAKA_IMAGES = {
  default: '/images/tanaka/portrait.png',
  congratulating: '/images/tanaka/congratulating.png',
  teaching: '/images/tanaka/teaching.png',
  meditation: '/images/tanaka/meditation.png',
  thinking: '/images/tanaka/thinking.png',
  bowing: '/images/tanaka/bowing.png',
  pointing: '/images/tanaka/pointing.png',
  thumbs_up: '/images/tanaka/thumbs_up.png'
};

// Audio paths for different events
const TANAKA_AUDIO = {
  // Challenges
  challenge_complete: '/audio/tanaka/challenge_complete.mp3',
  challenge_first: '/audio/tanaka/challenge_first.mp3',
  challenge_hard: '/audio/tanaka/challenge_hard.mp3',
  
  // Belts
  belt_white: '/audio/tanaka/belt_white.mp3',
  belt_yellow: '/audio/tanaka/belt_yellow.mp3',
  belt_orange: '/audio/tanaka/belt_orange.mp3',
  belt_green: '/audio/tanaka/belt_green.mp3',
  belt_blue: '/audio/tanaka/belt_blue.mp3',
  belt_brown: '/audio/tanaka/belt_brown.mp3',
  belt_black: '/audio/tanaka/belt_black.mp3',
  
  // Streaks
  streak_3: '/audio/tanaka/streak_3.mp3',
  streak_7: '/audio/tanaka/streak_7.mp3',
  streak_14: '/audio/tanaka/streak_14.mp3',
  streak_14: '/audio/tanaka/streak_14.mp3',
  
  // Progress
  xp_gained: '/audio/tanaka/xp_gained.mp3',
  level_up: '/audio/tanaka/level_up.mp3',
  technique_mastered: '/audio/tanaka/technique_mastered.mp3',
  badge_earned: '/audio/tanaka/badge_earned.mp3',
  
  // Encouragements
  encourage_practice: '/audio/tanaka/encourage_practice.mp3',
  encourage_patience: '/audio/tanaka/encourage_patience.mp3',
  encourage_comeback: '/audio/tanaka/encourage_comeback.mp3',
  fail_encourage: '/audio/tanaka/fail_encourage.mp3',
  
  // Greetings
  welcome: '/audio/tanaka/welcome.mp3',
  hello_morning: '/audio/tanaka/hello_morning.mp3',
  hello_afternoon: '/audio/tanaka/hello_afternoon.mp3',
  goodbye: '/audio/tanaka/goodbye.mp3'
};

// Event configurations
const EVENT_CONFIG = {
  challenge_complete: {
    audio: 'challenge_complete',
    image: 'congratulating',
    title: '🎉 Défi Accompli !',
    duration: 5000
  },
  challenge_first: {
    audio: 'challenge_first',
    image: 'thumbs_up',
    title: '⭐ Premier Défi !',
    duration: 5000
  },
  belt_earned: {
    audio: null, // Will be set dynamically based on belt
    image: 'congratulating',
    title: '🥋 Nouvelle Ceinture !',
    duration: 6000
  },
  streak_milestone: {
    audio: null, // Will be set dynamically based on streak
    image: 'thumbs_up',
    title: '🔥 Série de Pratique !',
    duration: 5000
  },
  level_up: {
    audio: 'level_up',
    image: 'congratulating',
    title: '⬆️ Niveau Supérieur !',
    duration: 5000
  },
  xp_gained: {
    audio: 'xp_gained',
    image: 'pointing',
    title: '✨ XP Gagné !',
    duration: 3000
  },
  technique_mastered: {
    audio: 'technique_mastered',
    image: 'teaching',
    title: '🎯 Technique Maîtrisée !',
    duration: 5000
  },
  badge_earned: {
    audio: 'badge_earned',
    image: 'thumbs_up',
    title: '🏅 Nouveau Badge !',
    duration: 4000
  },
  welcome_back: {
    audio: 'encourage_comeback',
    image: 'bowing',
    title: '👋 Bon Retour !',
    duration: 4000
  }
};

// Belt mapping
const BELT_AUDIO_MAP = {
  '6e_kyu': 'belt_white',
  '5e_kyu': 'belt_yellow',
  '4e_kyu': 'belt_orange',
  '3e_kyu': 'belt_green',
  '2e_kyu': 'belt_blue',
  '1er_kyu': 'belt_brown',
  'shodan': 'belt_black'
};

// Streak thresholds
const getStreakAudio = (days) => {
  if (days >= 14) return 'streak_14';
  if (days >= 14) return 'streak_14';
  if (days >= 7) return 'streak_7';
  if (days >= 3) return 'streak_3';
  return null;
};

const TanakaEventContext = createContext(null);

export const useTanakaEvent = () => {
  const context = useContext(TanakaEventContext);
  if (!context) {
    throw new Error('useTanakaEvent must be used within TanakaEventProvider');
  }
  return context;
};

export const TanakaEventProvider = ({ children, enabled = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const audioRef = useRef(null);
  const timeoutRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Play audio file
  const playAudio = useCallback((audioKey) => {
    return new Promise((resolve, reject) => {
      const audioPath = TANAKA_AUDIO[audioKey];
      if (!audioPath) {
        resolve();
        return;
      }

      try {
        // Stop any current audio
        if (audioRef.current) {
          audioRef.current.pause();
        }

        const audio = new Audio(audioPath);
        audioRef.current = audio;

        audio.onended = () => {
          setIsPlaying(false);
          resolve();
        };

        audio.onerror = (e) => {
          console.error('Audio error:', e);
          setIsPlaying(false);
          resolve(); // Don't reject, just continue
        };

        setIsPlaying(true);
        audio.play().catch(e => {
          console.error('Play error:', e);
          setIsPlaying(false);
          resolve();
        });
      } catch (error) {
        console.error('Audio setup error:', error);
        resolve();
      }
    });
  }, []);

  // Show Tanaka notification toast
  const showTanakaToast = useCallback((config, message) => {
    const imagePath = TANAKA_IMAGES[config.image] || TANAKA_IMAGES.default;
    
    toast.custom((t) => (
      <div className="flex items-center gap-4 bg-gradient-to-r from-amber-900 to-orange-900 text-white p-4 rounded-xl shadow-2xl border border-amber-500/30 max-w-md animate-in slide-in-from-right">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 flex-shrink-0">
          <img 
            src={imagePath} 
            alt="Maître Tanaka" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="font-bold text-amber-300 text-sm">{config.title}</div>
          <p className="text-amber-100 text-sm mt-1">{message}</p>
          <p className="text-amber-400/70 text-xs mt-1 italic">- Maître Tanaka</p>
        </div>
      </div>
    ), {
      duration: config.duration || 5000,
      position: 'top-right'
    });
  }, []);

  // Trigger a Tanaka event
  const triggerEvent = useCallback(async (eventType, data = {}) => {
    if (!enabled) return;
    
    // Don't interrupt current event
    if (isPlaying) return;

    let config = { ...EVENT_CONFIG[eventType] };
    let message = '';
    let audioKey = config.audio;

    // Handle dynamic events
    switch (eventType) {
      case 'belt_earned':
        audioKey = BELT_AUDIO_MAP[data.beltLevel] || 'belt_white';
        message = data.message || `Félicitations pour ta nouvelle ceinture !`;
        break;
      
      case 'streak_milestone':
        audioKey = getStreakAudio(data.days);
        if (!audioKey) return; // Not a milestone
        message = data.message || `${data.days} jours de pratique consécutifs !`;
        break;
      
      case 'challenge_complete':
        if (data.isFirst) {
          config = EVENT_CONFIG.challenge_first;
          audioKey = 'challenge_first';
        } else if (data.isHard) {
          audioKey = 'challenge_hard';
        }
        message = data.message || `Tu as relevé le défi "${data.challengeName}" !`;
        break;
      
      case 'level_up':
        message = data.message || `Tu passes au niveau ${data.level} : ${data.levelName} !`;
        break;
      
      case 'xp_gained':
        message = data.message || `+${data.xp} XP gagnés !`;
        break;
      
      case 'technique_mastered':
        message = data.message || `Tu maîtrises maintenant ${data.techniqueName} !`;
        break;
      
      case 'badge_earned':
        message = data.message || `Tu as obtenu le badge "${data.badgeName}" !`;
        break;
      
      case 'welcome_back':
        message = data.message || `Content de te revoir, jeune ninja !`;
        break;
      
      default:
        message = data.message || 'Bien joué, jeune ninja !';
    }

    setCurrentEvent({ type: eventType, config, message });

    // Show toast
    showTanakaToast(config, message);

    // Play audio
    if (audioKey) {
      await playAudio(audioKey);
    }

    setCurrentEvent(null);
  }, [enabled, isPlaying, playAudio, showTanakaToast]);

  // Convenience methods for common events
  const onChallengeComplete = useCallback((challengeName, isFirst = false, isHard = false) => {
    triggerEvent('challenge_complete', { challengeName, isFirst, isHard });
  }, [triggerEvent]);

  const onBeltEarned = useCallback((beltLevel, beltName) => {
    triggerEvent('belt_earned', { beltLevel, message: `Félicitations pour ta ${beltName} !` });
  }, [triggerEvent]);

  const onStreakMilestone = useCallback((days) => {
    triggerEvent('streak_milestone', { days });
  }, [triggerEvent]);

  const onLevelUp = useCallback((level, levelName) => {
    triggerEvent('level_up', { level, levelName });
  }, [triggerEvent]);

  const onXpGained = useCallback((xp) => {
    triggerEvent('xp_gained', { xp });
  }, [triggerEvent]);

  const onTechniqueMastered = useCallback((techniqueName) => {
    triggerEvent('technique_mastered', { techniqueName });
  }, [triggerEvent]);

  const onBadgeEarned = useCallback((badgeName) => {
    triggerEvent('badge_earned', { badgeName });
  }, [triggerEvent]);

  const onWelcomeBack = useCallback(() => {
    triggerEvent('welcome_back', {});
  }, [triggerEvent]);

  // Stop current audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const value = {
    // State
    isPlaying,
    currentEvent,
    enabled,
    
    // Main trigger function
    triggerEvent,
    
    // Convenience methods
    onChallengeComplete,
    onBeltEarned,
    onStreakMilestone,
    onLevelUp,
    onXpGained,
    onTechniqueMastered,
    onBadgeEarned,
    onWelcomeBack,
    
    // Control
    stopAudio,
    
    // Assets
    images: TANAKA_IMAGES,
    audioFiles: TANAKA_AUDIO
  };

  // Register callback for gamification hook
  useEffect(() => {
    if (enabled) {
      setTanakaEventCallback(triggerEvent);
    }
    return () => {
      setTanakaEventCallback(null);
    };
  }, [enabled, triggerEvent]);

  return (
    <TanakaEventContext.Provider value={value}>
      {children}
    </TanakaEventContext.Provider>
  );
};

export default TanakaEventContext;
