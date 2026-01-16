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
 */
export const TANAKA_GAME_MESSAGES = {
  // Messages généraux
  welcome_dojo: "Bienvenue dans le Dojo Virtuel, jeune ninja ! Ici, tu vas t'entraîner avec des jeux qui développeront tes compétences.",
  
  // Messages pour le Messager du Ki
  messager_intro: "Jeune ninja, le Ki est l'énergie qui nous anime. Utilise les flèches pour te déplacer. Appuie sur espace pour respirer et restaurer ton équilibre. Si tu vas trop vite, tu perdras l'équilibre !",
  messager_start: "C'est parti ! Traverse le dojo sans perdre ton équilibre.",
  messager_breathing: "Bien ! La respiration est la clé. Continue à respirer calmement.",
  messager_obstacle: "Attention ! Tu as touché un obstacle. Reste calme et continue.",
  messager_success: "Magnifique ! Tu as traversé le dojo avec calme et maîtrise ! Ton Ki est puissant !",
  messager_fail: "Tu as perdu l'équilibre, petit ninja. Rappelle-toi : la patience est la clé. Respire et réessaie !",
  
  // Messages pour le Parcours du Souffle
  souffle_intro: "La respiration est la clé de tout, petit guerrier. Ton avatar n'avancera que si tu respires correctement. Inspire par le nez, expire par la bouche.",
  souffle_start: "Suis le rythme de respiration. Flèche haut pour inspirer, espace pour retenir, flèche bas pour expirer.",
  souffle_inhale: "Inspire profondément...",
  souffle_hold: "Retiens ton souffle...",
  souffle_exhale: "Expire doucement...",
  souffle_combo: "Excellent ! Tu as trouvé le rythme parfait !",
  souffle_success: "Magnifique ! Tu as maîtrisé le parcours du souffle ! Ta respiration est celle d'un vrai aikidoka !",
  
  // Messages pour le Sensei Invisible
  sensei_intro: "Ferme les yeux, jeune ninja. Je vais te guider uniquement avec ma voix. Fais confiance à tes autres sens.",
  sensei_start: "Écoute bien mes instructions. Salue, tourne, avance... Tu dois suivre exactement ce que je dis.",
  sensei_correct: "Bien joué ! Tu as bien écouté.",
  sensei_wrong: "Ce n'était pas la bonne action. Concentre-toi et écoute bien.",
  sensei_success: "Extraordinaire ! Tu as suivi toutes mes instructions parfaitement ! Ton écoute est remarquable !",
  sensei_fail: "Tu as fait trop d'erreurs, petit ninja. L'écoute demande de la concentration. Réessaie !",
  
  // Messages pour le Réflexe Pacifique
  reflexe_intro: "L'Aïkido nous apprend à ne pas réagir avec colère ou peur. Tu vas voir des situations difficiles. Prends le temps de réfléchir avant de répondre.",
  reflexe_start: "Face à chaque situation, choisis la réponse la plus sage. Tu as quinze secondes !",
  reflexe_correct: "Excellent choix ! C'est la voie de la sagesse.",
  reflexe_wrong: "Ce n'était pas la meilleure réponse, mais tu apprendras.",
  reflexe_timeout: "Le temps est écoulé ! En situation réelle, il faut parfois décider vite, mais avec sagesse.",
  reflexe_success: "Tu as fait preuve d'une grande sagesse ! L'Aïkido t'enseigne bien.",
  
  // Messages d'encouragement généraux
  encourage_1: "Continue ainsi, petit guerrier !",
  encourage_2: "Tu progresses bien !",
  encourage_3: "N'abandonne pas, tu y es presque !",
  encourage_4: "Comme le bambou, plie mais ne romps pas !",
  
  // Messages de félicitations
  congrats_ki: "Tu gagnes des points de Ki ! Ton énergie intérieure grandit !",
  congrats_badge: "Un nouveau badge ! Chaque badge raconte une partie de ton histoire.",
  congrats_game: "Bravo ! Tu as terminé ce jeu avec brio !"
};

export default useTanakaVoice;
