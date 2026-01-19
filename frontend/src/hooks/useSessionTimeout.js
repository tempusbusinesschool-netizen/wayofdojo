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
  const [state, setState] = useState({
    showWarning: false,
    remainingTime: timeout
  });
  
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);
  const countdownRef = useRef(null);
  const lastActivityRef = useRef(0);
  const callbacksRef = useRef({ onTimeout, onWarning });

  // Keep callbacks ref updated in an effect
  useEffect(() => {
    callbacksRef.current = { onTimeout, onWarning };
  }, [onTimeout, onWarning]);

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

  // Setup timers function - called from event handler, not directly in effect
  const setupTimers = useCallback(() => {
    cleanup();
    
    lastActivityRef.current = Date.now();
    setState({ showWarning: false, remainingTime: timeout });

    // Set warning timer (5 min before timeout)
    warningRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, showWarning: true }));
      if (callbacksRef.current.onWarning) {
        callbacksRef.current.onWarning();
      }
      
      // Start countdown
      let remaining = warningBefore;
      setState(prev => ({ ...prev, remainingTime: remaining }));
      
      countdownRef.current = setInterval(() => {
        remaining -= 1000;
        setState(prev => ({ ...prev, remainingTime: Math.max(0, remaining) }));
        
        if (remaining <= 0) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
        }
      }, 1000);
    }, timeout - warningBefore);

    // Set timeout timer
    timeoutRef.current = setTimeout(() => {
      cleanup();
      setState({ showWarning: false, remainingTime: 0 });
      if (callbacksRef.current.onTimeout) {
        callbacksRef.current.onTimeout();
      }
    }, timeout);
  }, [timeout, warningBefore, cleanup]);

  // Effect for setting up event listeners only
  useEffect(() => {
    if (!isActive) {
      cleanup();
      // Use callback form to avoid lint warning
      setState(prev => prev.showWarning ? { showWarning: false, remainingTime: timeout } : prev);
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

    // Initial setup via a microtask to avoid direct setState in effect
    Promise.resolve().then(() => {
      if (isActive) {
        setupTimers();
      }
    });

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      cleanup();
    };
  }, [isActive, setupTimers, cleanup, timeout]);

  // Formater le temps restant
  const remainingTimeFormatted = useMemo(() => {
    const ms = state.remainingTime;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [state.remainingTime]);

  return {
    showWarning: state.showWarning,
    remainingTime: state.remainingTime,
    remainingTimeFormatted,
    extendSession: setupTimers
  };
}

export default useSessionTimeout;
