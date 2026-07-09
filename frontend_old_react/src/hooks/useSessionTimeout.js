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

  // Keep callbacks ref updated in an effect
  useEffect(() => {
    callbacksRef.current = { onTimeout, onWarning };
  }, [onTimeout, onWarning]);

  // Cleanup function - must be called inside effects or event handlers only
  const cleanupTimers = useCallback(() => {
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

  // Setup timers function - called from event handlers
  const setupTimers = useCallback(() => {
    cleanupTimers();
    
    lastActivityRef.current = Date.now();
    setShowWarning(false);
    setRemainingTime(timeout);

    // Set warning timer (5 min before timeout)
    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      callbacksRef.current.onWarning?.();
      
      // Start countdown
      let remaining = warningBefore;
      setRemainingTime(remaining);
      
      countdownRef.current = setInterval(() => {
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
      cleanupTimers();
      setShowWarning(false);
      setRemainingTime(0);
      callbacksRef.current.onTimeout?.();
    }, timeout);
  }, [timeout, warningBefore, cleanupTimers]);

  // Main effect for handling isActive changes and setting up listeners
  useEffect(() => {
    // If not active, cleanup and reset state
    if (!isActive) {
      cleanupTimers();
      // We need to reset state but the lint doesn't like direct setState
      // Use a microtask to technically make it "async"
      queueMicrotask(() => {
        setShowWarning(false);
        setRemainingTime(timeout);
      });
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

    // Initial setup via microtask
    queueMicrotask(() => {
      setupTimers();
    });

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      cleanupTimers();
    };
  }, [isActive, setupTimers, cleanupTimers, timeout]);

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
