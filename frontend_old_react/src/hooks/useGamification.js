import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Tanaka event callback (will be set from context)
let tanakaEventCallback = null;

export const setTanakaEventCallback = (callback) => {
  tanakaEventCallback = callback;
};

/**
 * useGamification - Hook pour gérer les données de gamification
 * Gère les défis quotidiens, stats utilisateur, et complétion de défis
 */
export const useGamification = (userId, isAuthenticated) => {
  const [challenges, setChallenges] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les défis quotidiens
  const fetchDailyChallenges = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/gamification/daily-challenges`);
      setChallenges(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching daily challenges:', err);
      setError(err.message);
      return [];
    }
  }, []);

  // Récupérer les stats de l'utilisateur
  const fetchUserStats = useCallback(async () => {
    if (!userId || !isAuthenticated) {
      setUserStats(null);
      return null;
    }

    try {
      const response = await axios.get(`${API}/gamification/stats/${userId}`);
      setUserStats(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching user stats:', err);
      // Créer des stats par défaut si pas trouvées
      if (err.response?.status === 404) {
        const defaultStats = {
          user_id: userId,
          total_xp: 0,
          level: 1,
          level_name: "Petit Scarabée",
          streak_days: 0,
          badges: [],
          completed_challenges: [],
          pending_validations: [],
          attendance_count: 0
        };
        setUserStats(defaultStats);
        return defaultStats;
      }
      setError(err.message);
      return null;
    }
  }, [userId, isAuthenticated]);

  // Compléter un défi
  const completeChallenge = useCallback(async (challenge) => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }

    try {
      const response = await axios.post(`${API}/gamification/challenge/complete`, {
        challenge_id: challenge.id,
        challenge_type: challenge.type || 'daily',
        challenge_name: challenge.name || challenge.title,
        xp_reward: challenge.xp_reward || challenge.points,
        needs_parent_validation: challenge.needs_parent_validation || false
      });

      // Rafraîchir les stats après complétion
      const newStats = await fetchUserStats();
      
      // 🥋 Trigger Tanaka event for challenge completion
      if (tanakaEventCallback) {
        const isFirst = !userStats?.completed_challenges || userStats.completed_challenges.length === 0;
        const isHard = (challenge.xp_reward || challenge.points) >= 50;
        tanakaEventCallback('challenge_complete', {
          challengeName: challenge.name || challenge.title,
          isFirst,
          isHard
        });
        
        // Check for level up
        if (newStats && userStats && newStats.level > userStats.level) {
          setTimeout(() => {
            tanakaEventCallback('level_up', {
              level: newStats.level,
              levelName: newStats.level_name
            });
          }, 3000); // Delay to not overlap with challenge audio
        }
        
        // Check for streak milestone
        if (newStats && [3, 7, 14, 30].includes(newStats.streak_days)) {
          setTimeout(() => {
            tanakaEventCallback('streak_milestone', {
              days: newStats.streak_days
            });
          }, 6000); // Additional delay
        }
      }
      
      return response.data;
    } catch (err) {
      console.error('Error completing challenge:', err);
      throw err;
    }
  }, [isAuthenticated, fetchUserStats, userStats]);

  // Marquer la présence
  const markAttendance = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }

    try {
      const response = await axios.post(`${API}/gamification/attendance`);
      
      // Rafraîchir les stats
      await fetchUserStats();
      
      return response.data;
    } catch (err) {
      console.error('Error marking attendance:', err);
      throw err;
    }
  }, [isAuthenticated, fetchUserStats]);

  // Récupérer le classement
  const fetchLeaderboard = useCallback(async (limit = 10) => {
    try {
      const response = await axios.get(`${API}/gamification/leaderboard`, {
        params: { limit }
      });
      return response.data;
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      return [];
    }
  }, []);

  // Vérifier si un défi est déjà complété aujourd'hui
  const isChallengeCompletedToday = useCallback((challengeId) => {
    if (!userStats?.completed_challenges) return false;
    
    const today = new Date().toISOString().split('T')[0];
    return userStats.completed_challenges.some(
      c => c.challenge_id === challengeId && c.completed_date === today
    );
  }, [userStats]);

  // Vérifier si un défi est en attente de validation
  const isChallengePending = useCallback((challengeId) => {
    if (!userStats?.pending_validations) return false;
    
    return userStats.pending_validations.some(
      c => c.challenge_id === challengeId && c.status === 'pending'
    );
  }, [userStats]);

  // Obtenir les défis complétés aujourd'hui
  const getCompletedTodayIds = useCallback(() => {
    if (!userStats?.completed_challenges) return [];
    
    const today = new Date().toISOString().split('T')[0];
    return userStats.completed_challenges
      .filter(c => c.completed_date === today)
      .map(c => c.challenge_id);
  }, [userStats]);

  // Calculer les points du jour
  const getTodayPoints = useCallback(() => {
    if (!userStats?.completed_challenges) return 0;
    
    const today = new Date().toISOString().split('T')[0];
    return userStats.completed_challenges
      .filter(c => c.completed_date === today && c.status === 'validated')
      .reduce((sum, c) => sum + (c.xp_reward || 0), 0);
  }, [userStats]);

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchDailyChallenges(),
          fetchUserStats()
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchDailyChallenges, fetchUserStats]);

  return {
    // Données
    challenges,
    userStats,
    loading,
    error,
    
    // Actions
    completeChallenge,
    markAttendance,
    fetchLeaderboard,
    refreshStats: fetchUserStats,
    refreshChallenges: fetchDailyChallenges,
    
    // Helpers
    isChallengeCompletedToday,
    isChallengePending,
    getCompletedTodayIds,
    getTodayPoints
  };
};

export default useGamification;
