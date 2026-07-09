/**
 * 🎤 Hook pour la voix de Maître Tanaka
 * 
 * Utilise l'API ElevenLabs via le backend pour générer
 * la voix de Maître Tanaka dans les jeux
 */

import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Hook personnalisé pour faire parler Maître Tanaka
 * 
 * @returns {Object} { speak, speaking, stopSpeaking, error }
 */
export const useTanakaVoice = () => {
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  const queueRef = useRef([]);
  const processingRef = useRef(false);

  /**
   * Arrêter la lecture audio en cours
   */
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    queueRef.current = [];
    processingRef.current = false;
    setSpeaking(false);
  }, []);

  /**
   * Traiter la file d'attente des messages
   */
  const processQueue = useCallback(async () => {
    if (processingRef.current || queueRef.current.length === 0) {
      return;
    }

    processingRef.current = true;
    const { text, onStart, onEnd } = queueRef.current.shift();

    try {
      setSpeaking(true);
      setError(null);
      
      if (onStart) onStart();

      // Appel à l'API TTS
      const response = await axios.post(`${API_URL}/api/voice-agent/tts`, {
        text: text
      });

      const { audio_base64 } = response.data;

      // Créer et jouer l'audio
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audio_base64), c => c.charCodeAt(0))],
        { type: 'audio/mpeg' }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.onended = () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        setSpeaking(false);
        processingRef.current = false;
        if (onEnd) onEnd();
        
        // Traiter le prochain message dans la file
        if (queueRef.current.length > 0) {
          processQueue();
        }
      };

      audioRef.current.onerror = (e) => {
        console.error('Audio playback error:', e);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        setSpeaking(false);
        processingRef.current = false;
        setError('Erreur de lecture audio');
        if (onEnd) onEnd();
        
        // Continuer avec la file même en cas d'erreur
        if (queueRef.current.length > 0) {
          processQueue();
        }
      };

      await audioRef.current.play();
      
    } catch (err) {
      console.error('TTS API error:', err);
      setError(err.message || 'Erreur de synthèse vocale');
      setSpeaking(false);
      processingRef.current = false;
      if (onEnd) onEnd();
      
      // Continuer avec la file même en cas d'erreur
      if (queueRef.current.length > 0) {
        processQueue();
      }
    }
  }, []);

  /**
   * Faire parler Maître Tanaka
   * 
   * @param {string} text - Le texte à prononcer
   * @param {Object} options - Options { onStart, onEnd, immediate }
   */
  const speak = useCallback((text, options = {}) => {
    const { onStart, onEnd, immediate = false } = options;

    if (immediate) {
      // Arrêter tout et parler immédiatement
      stopSpeaking();
      queueRef.current = [];
    }

    // Ajouter à la file d'attente
    queueRef.current.push({ text, onStart, onEnd });
    
    // Démarrer le traitement si pas en cours
    if (!processingRef.current) {
      processQueue();
    }
  }, [stopSpeaking, processQueue]);

  /**
   * Vider la file d'attente sans arrêter la lecture en cours
   */
  const clearQueue = useCallback(() => {
    queueRef.current = [];
  }, []);

  return {
    speak,
    speaking,
    stopSpeaking,
    clearQueue,
    error
  };
};

/**
 * Messages prédéfinis pour les jeux du Dojo Virtuel
 * Conformes au Lexique TANAKA validé
 */
export const TANAKA_GAME_MESSAGES = {
  // ACCUEIL (ACC)
  welcome_dojo: "Bienvenue dans le Dojo Virtuel ! Ici, tu apprends en jouant.",
  
  // GUIDANCE (GUI)
  messager_intro: "Utilise les flèches pour te déplacer. Appuie sur espace pour respirer.",
  messager_start: "C'est à toi.",
  souffle_intro: "Suis le rythme de respiration avec les flèches.",
  souffle_start: "C'est à toi.",
  sensei_intro: "Écoute bien les instructions et suis-les.",
  sensei_start: "C'est à toi.",
  reflexe_intro: "Lis bien les situations, puis choisis.",
  reflexe_start: "C'est à toi.",
  
  // ENCOURAGEMENT (ENC)
  messager_breathing: "Continue comme ça !",
  messager_obstacle: "Tu peux recommencer, c'est comme ça qu'on progresse.",
  souffle_inhale: "Inspire...",
  souffle_hold: "Retiens...",
  souffle_exhale: "Expire...",
  souffle_combo: "Bien joué !",
  sensei_correct: "Bien joué !",
  sensei_wrong: "Continue comme ça !",
  reflexe_correct: "Bien joué !",
  reflexe_wrong: "Tu peux recommencer, c'est comme ça qu'on progresse.",
  reflexe_timeout: "Tu peux recommencer, c'est comme ça qu'on progresse.",
  encourage_1: "Continue comme ça !",
  encourage_2: "Tu fais des efforts, ça se voit.",
  encourage_3: "Tu peux recommencer, c'est comme ça qu'on progresse.",
  
  // FÉLICITATION (FEL)
  messager_success: "Bravo, tu as terminé cette étape !",
  messager_fail: "Tu peux recommencer, c'est comme ça qu'on progresse.",
  souffle_success: "Bravo, tu as terminé cette étape !",
  sensei_success: "Bravo, tu as terminé cette étape !",
  sensei_fail: "Tu peux recommencer, c'est comme ça qu'on progresse.",
  reflexe_success: "Bravo, tu as terminé cette étape !",
  congrats_ki: "Bien joué !",
  congrats_badge: "Bien joué !",
  congrats_game: "Bien joué !"
};

export default useTanakaVoice;
