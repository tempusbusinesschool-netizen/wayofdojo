'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, Loader2, X, Sparkles } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TANAKA VOICE SEARCH - Recherche vocale avec Maître Tanaka
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Fonctionnalités :
 * - Enregistrement audio via microphone
 * - Transcription avec Whisper (STT)
 * - Réponse vocale de Tanaka (TTS)
 * - Parsing intelligent des commandes
 */

interface TanakaVoiceSearchProps {
  onSearchResult?: (query: string, filters: VoiceSearchFilters) => void;
  onClose?: () => void;
  className?: string;
}

interface VoiceSearchFilters {
  grade?: string;
  category?: string;
  keyword?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

// Phrases de Tanaka pour différentes situations
const TANAKA_PHRASES = {
  listening: "Je t'écoute, jeune samouraï...",
  processing: "Laisse-moi réfléchir...",
  error: "Pardonne-moi, je n'ai pas bien compris. Peux-tu répéter ?",
  noResults: "Je ne trouve pas de technique correspondant à ta demande.",
  greeting: "Que souhaites-tu apprendre aujourd'hui ?",
};

export const TanakaVoiceSearch: React.FC<TanakaVoiceSearchProps> = ({
  onSearchResult,
  onClose,
  className = ''
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [tanakaResponse, setTanakaResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Parse la commande vocale pour extraire les filtres
  const parseVoiceCommand = useCallback((text: string): VoiceSearchFilters => {
    const lowerText = text.toLowerCase();
    const filters: VoiceSearchFilters = {};

    // Détecter le grade
    const gradePatterns = [
      { pattern: /6[eè]?\s*kyu|sixi[eè]me\s*kyu|ceinture\s*blanche/i, grade: '6e_kyu' },
      { pattern: /5[eè]?\s*kyu|cinqui[eè]me\s*kyu|ceinture\s*jaune/i, grade: '5e_kyu' },
      { pattern: /4[eè]?\s*kyu|quatri[eè]me\s*kyu|ceinture\s*orange/i, grade: '4e_kyu' },
      { pattern: /3[eè]?\s*kyu|troisi[eè]me\s*kyu|ceinture\s*verte/i, grade: '3e_kyu' },
      { pattern: /2[eè]?\s*kyu|deuxi[eè]me\s*kyu|ceinture\s*bleue/i, grade: '2e_kyu' },
      { pattern: /1[eè]r?\s*kyu|premi[eè]re?\s*kyu|ceinture\s*marron/i, grade: '1er_kyu' },
      { pattern: /shodan|ceinture\s*noire|dan/i, grade: 'shodan' },
    ];

    for (const { pattern, grade } of gradePatterns) {
      if (pattern.test(lowerText)) {
        filters.grade = grade;
        break;
      }
    }

    // Détecter la catégorie
    const categoryPatterns = [
      { pattern: /chute|ukemi|roulade/i, category: 'ukemi' },
      { pattern: /d[ée]placement|tai\s*sabaki|irimi|tenkan/i, category: 'tai_sabaki' },
      { pattern: /posture|kamae|garde/i, category: 'kamae' },
      { pattern: /articul|kansetsu|cl[ée]/i, category: 'kansetsu' },
      { pattern: /genoux|suwari|assis/i, category: 'suwariwaza' },
      { pattern: /frappe|atemi|coup/i, category: 'atemi' },
      { pattern: /hanmi|semi|debout/i, category: 'hanmi_handachi' },
      { pattern: /respir|kokyu|[ée]nergie/i, category: 'kokyu' },
      { pattern: /jo|b[aâ]ton/i, category: 'jo' },
      { pattern: /tanto|couteau/i, category: 'tanto' },
      { pattern: /bokken|sabre|ken/i, category: 'bokken' },
    ];

    for (const { pattern, category } of categoryPatterns) {
      if (pattern.test(lowerText)) {
        filters.category = category;
        break;
      }
    }

    // Extraire les mots-clés (noms de techniques)
    const techniqueKeywords = [
      'ikkyo', 'nikyo', 'sankyo', 'yonkyo', 'gokyo',
      'shiho nage', 'irimi nage', 'kote gaeshi', 'kaiten nage',
      'kokyu nage', 'tenchi nage', 'koshi nage',
      'mae ukemi', 'ushiro ukemi', 'yoko ukemi',
    ];

    for (const keyword of techniqueKeywords) {
      if (lowerText.includes(keyword)) {
        filters.keyword = keyword;
        break;
      }
    }

    // Si pas de mot-clé technique trouvé, utiliser le texte nettoyé
    if (!filters.keyword && !filters.grade && !filters.category) {
      // Nettoyer le texte pour en extraire un mot-clé de recherche
      const cleanText = lowerText
        .replace(/montre[- ]moi|explique[- ]moi|qu'est[- ]ce que|c'est quoi|tanaka|maître|sensei/gi, '')
        .replace(/les|la|le|des|du|de|un|une/gi, '')
        .trim();
      
      if (cleanText.length > 2) {
        filters.keyword = cleanText;
      }
    }

    return filters;
  }, []);

  // Démarrer l'enregistrement
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setTranscript('');
      setTanakaResponse(TANAKA_PHRASES.listening);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Arrêter le stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      mediaRecorder.start();
      setIsListening(true);
      
    } catch (err) {
      console.error('Microphone error:', err);
      setError("Impossible d'accéder au microphone. Vérifiez les permissions.");
    }
  }, []);

  // Arrêter l'enregistrement
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setTanakaResponse(TANAKA_PHRASES.processing);
    }
  }, [isListening]);

  // Traiter l'audio enregistré
  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      // Envoyer au backend pour transcription + réponse Tanaka
      const response = await fetch(`${BACKEND_URL}/api/voice-agent/conversation`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Erreur de traitement');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTranscript(data.userMessage || '');
        setTanakaResponse(data.assistantMessage || '');
        
        // Jouer la réponse audio de Tanaka
        if (data.audioBase64) {
          playAudio(data.audioBase64);
        }
        
        // Parser la commande et déclencher la recherche
        if (data.userMessage && onSearchResult) {
          const filters = parseVoiceCommand(data.userMessage);
          onSearchResult(data.userMessage, filters);
        }
      } else {
        setTanakaResponse(TANAKA_PHRASES.error);
      }
      
    } catch (err) {
      console.error('Processing error:', err);
      setError("Erreur lors du traitement. Réessayez.");
      setTanakaResponse(TANAKA_PHRASES.error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Jouer l'audio de Tanaka
  const playAudio = (base64: string) => {
    const audio = new Audio(`data:audio/mp3;base64,${base64}`);
    audioRef.current = audio;
    
    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);
    
    audio.play().catch(console.error);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-amber-500/30 shadow-2xl shadow-amber-500/10 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isListening ? [0, 10, -10, 0] : 0 }}
            transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
            className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
          >
            <span className="text-2xl">🧙‍♂️</span>
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-lg">Maître Tanaka</h3>
            <p className="text-amber-100 text-sm">
              {isListening ? '🎤 Écoute en cours...' : isProcessing ? '🤔 Réflexion...' : '先生 • Sensei'}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Corps */}
      <div className="p-6 space-y-6">
        {/* Message de Tanaka */}
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              {isPlaying ? (
                <Volume2 className="w-5 h-5 text-amber-400 animate-pulse" />
              ) : (
                <Sparkles className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-white leading-relaxed">
                {tanakaResponse || TANAKA_PHRASES.greeting}
              </p>
            </div>
          </div>
        </div>

        {/* Transcription utilisateur */}
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-700/50 rounded-xl p-3 border border-slate-600"
          >
            <p className="text-slate-400 text-sm mb-1">Vous avez dit :</p>
            <p className="text-white italic">"{transcript}"</p>
          </motion.div>
        )}

        {/* Erreur */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 rounded-xl p-3 border border-red-500/30"
          >
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Bouton microphone */}
        <div className="flex flex-col items-center gap-4">
          <motion.button
            onClick={isListening ? stopRecording : startRecording}
            disabled={isProcessing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              w-20 h-20 rounded-full flex items-center justify-center
              transition-all shadow-lg
              ${isListening 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30 animate-pulse' 
                : isProcessing
                  ? 'bg-slate-600 cursor-not-allowed'
                  : 'bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-amber-500/30'
              }
            `}
            data-testid="voice-search-mic"
          >
            {isProcessing ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            ) : isListening ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </motion.button>
          
          <p className="text-slate-400 text-sm text-center">
            {isListening 
              ? 'Appuyez pour arrêter' 
              : isProcessing 
                ? 'Traitement en cours...'
                : 'Appuyez et parlez à Tanaka'
            }
          </p>
        </div>

        {/* Suggestions */}
        <div className="space-y-2">
          <p className="text-slate-500 text-xs uppercase tracking-wider">Exemples de commandes :</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Montre-moi les techniques de 5e Kyu",
              "Explique Ikkyo",
              "Quelles sont les chutes ?",
              "Techniques de sabre"
            ].map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(suggestion);
                  const filters = parseVoiceCommand(suggestion);
                  if (onSearchResult) {
                    onSearchResult(suggestion, filters);
                  }
                }}
                className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-full text-xs text-slate-300 hover:text-white transition-colors"
              >
                "{suggestion}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TanakaVoiceSearch;
