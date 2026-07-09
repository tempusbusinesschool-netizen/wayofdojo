'use client';

import { useState, useEffect } from 'react';

export type UserProfile = 'jeune_samourai' | 'samourai_confirme';

interface UserData {
  profile: UserProfile;
  firstName?: string;
  lastName?: string;
  xp?: number;
  level?: number;
  streak?: number;
  grade?: string;
  badges?: string[];
  completedTechniques?: string[];
  virtuesProgress?: Record<string, number>;
}

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('wayofdojo_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserProfile(user.profile || 'samourai_confirme');
          setUserData({
            profile: user.profile || 'samourai_confirme',
            firstName: user.firstName,
            lastName: user.lastName,
            xp: user.gamification?.xp || 0,
            level: user.gamification?.level || 1,
            streak: user.gamification?.streak || 0,
            grade: user.grade || '6e_kyu',
            badges: user.gamification?.badges || [],
            completedTechniques: user.gamification?.completedTechniques || [],
            virtuesProgress: user.gamification?.virtuesProgress || {},
          });
        } catch {
          setUserProfile('samourai_confirme');
        }
      } else {
        setUserProfile('samourai_confirme');
      }
      setIsLoading(false);
    }
  }, []);

  return { userProfile, userData, isLoading };
}

export default useUserProfile;
