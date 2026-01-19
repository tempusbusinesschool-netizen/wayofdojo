/**
 * 🔐 SESSION TIMEOUT HOOK
 * 
 * Gère l'expiration automatique des sessions admin/dojo
 * - Timeout après 30 minutes d'inactivité
 * - Avertissement 5 minutes avant expiration
 * - Réinitialisation à chaque activité utilisateur
 */

import { useEffect, useRef, useState, useCallback } from 'react';

const DEFAULT_TIMEOUT = 30 * 60 * 1000; // 30 minutes en ms
const WARNING_BEFORE = 5 * 60 * 1000;   // Avertissement 5 min avant

export function useSessionTimeout({
  isActive = false,
  timeout = DEFAULT_TIMEOUT,
  warningBefore = WARNING_BEFORE,
  onTimeout,
  onWarning
}) {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(timeout);
  
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);
  const countdownRef = useRef(null);
  const lastActivityRef = useRef(0);
  const isActiveRef = useRef(isActive);

  // Keep isActiveRef in sync
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  // Réinitialiser les timers
  const resetTimers = useCallback(() => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);
    setRemainingTime(timeout);

    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    if (!isActiveRef.current) return;

    // Set warning timer (5 min before timeout)
    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      if (onWarning) onWarning();
      
      // Start countdown
      let remaining = warningBefore;
      setRemainingTime(remaining);
      
      countdownRef.current = setInterval(() => {
        remaining -= 1000;
        setRemainingTime(Math.max(0, remaining));
        
        if (remaining <= 0) {
          clearInterval(countdownRef.current);
        }
      }, 1000);
    }, timeout - warningBefore);

    // Set timeout timer
    timeoutRef.current = setTimeout(() => {
      setShowWarning(false);
      if (onTimeout) onTimeout();
    }, timeout);
  }, [timeout, warningBefore, onTimeout, onWarning]);

  // Setup and cleanup effect
  useEffect(() => {
    // Cleanup function
    const cleanup = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };

    if (!isActive) {
      cleanup();
      return;
    }

    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      // Throttle: only reset if more than 1 second since last activity
      if (Date.now() - lastActivityRef.current > 1000) {
        resetTimers();
      }
    };

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial timer setup
    resetTimers();

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      cleanup();
    };
  }, [isActive, resetTimers]);

  // Reset warning when isActive becomes false
  useEffect(() => {
    if (!isActive) {
      setShowWarning(false);
    }
  }, [isActive]);

  // Formater le temps restant
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    showWarning,
    remainingTime,
    remainingTimeFormatted: formatTime(remainingTime),
    extendSession: resetTimers
  };
}

export default useSessionTimeout;
