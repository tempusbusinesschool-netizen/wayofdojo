/**
 * 🔐 SESSION TIMEOUT HOOK
 * 
 * Gère l'expiration automatique des sessions admin/dojo
 * - Timeout après 30 minutes d'inactivité
 * - Avertissement 5 minutes avant expiration
 * - Réinitialisation à chaque activité utilisateur
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

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
  const callbacksRef = useRef({ onTimeout, onWarning });
  const isActiveRef = useRef(isActive);
  const mountedRef = useRef(false);

  // Track mounted state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Keep callbacks ref updated in an effect
  useEffect(() => {
    callbacksRef.current = { onTimeout, onWarning };
  }, [onTimeout, onWarning]);

  // Track isActive changes
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
      warningRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  // Setup timers function
  const setupTimers = useCallback(() => {
    if (!mountedRef.current) return;
    
    cleanup();
    
    lastActivityRef.current = Date.now();
    setShowWarning(false);
    setRemainingTime(timeout);

    // Set warning timer (5 min before timeout)
    warningRef.current = setTimeout(() => {
      if (!mountedRef.current || !isActiveRef.current) return;
      
      setShowWarning(true);
      if (callbacksRef.current.onWarning) {
        callbacksRef.current.onWarning();
      }
      
      // Start countdown
      let remaining = warningBefore;
      setRemainingTime(remaining);
      
      countdownRef.current = setInterval(() => {
        if (!mountedRef.current) {
          clearInterval(countdownRef.current);
          return;
        }
        remaining -= 1000;
        setRemainingTime(Math.max(0, remaining));
        
        if (remaining <= 0 && countdownRef.current) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
      }, 1000);
    }, timeout - warningBefore);

    // Set timeout timer
    timeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      
      cleanup();
      setShowWarning(false);
      setRemainingTime(0);
      if (callbacksRef.current.onTimeout) {
        callbacksRef.current.onTimeout();
      }
    }, timeout);
  }, [timeout, warningBefore, cleanup]);

  // Reset when becoming inactive - using a separate state to track
  const [wasActive, setWasActive] = useState(isActive);
  
  // Handle isActive changes via derived state pattern
  if (isActive !== wasActive) {
    setWasActive(isActive);
    if (!isActive) {
      cleanup();
      if (showWarning) {
        setShowWarning(false);
      }
    }
  }

  // Effect for setting up event listeners only
  useEffect(() => {
    if (!isActive) {
      return;
    }

    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      // Throttle: only reset if more than 1 second since last activity
      const now = Date.now();
      if (now - lastActivityRef.current > 1000) {
        setupTimers();
      }
    };

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial setup
    setupTimers();

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      cleanup();
    };
  }, [isActive, setupTimers, cleanup]);

  // Formater le temps restant
  const remainingTimeFormatted = useMemo(() => {
    const ms = remainingTime;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [remainingTime]);

  return {
    showWarning,
    remainingTime,
    remainingTimeFormatted,
    extendSession: setupTimers
  };
}

export default useSessionTimeout;
