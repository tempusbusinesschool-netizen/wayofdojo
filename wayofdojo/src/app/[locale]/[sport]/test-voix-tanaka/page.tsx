'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, Volume2, Check, Loader2, Star, Mic } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PAGE DE TEST DES VOIX POUR MAÎTRE TANAKA
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface Voice {
  id: string;
  name: string;
  description: string;
  recommended?: boolean;
}

const VOICES: Voice[] = [
  { id: 'alloy', name: 'Alloy', description: 'Neutre, équilibrée' },
  { id: 'ash', name: 'Ash', description: 'Claire, articulée' },
  { id: 'coral', name: 'Coral', description: 'Chaleureuse, amicale' },
  { id: 'echo', name: 'Echo', description: 'Douce, calme' },
  { id: 'fable', name: 'Fable', description: 'Expressive, conteuse' },
  { id: 'nova', name: 'Nova', description: 'Énergique, dynamique' },
  { id: 'onyx', name: 'Onyx', description: 'Profonde, autoritaire', recommended: true },
  { id: 'sage', name: 'Sage', description: 'Sage, mesurée', recommended: true },
  { id: 'shimmer', name: 'Shimmer', description: 'Brillante, joyeuse' },
];

const TEST_PHRASE = "Bienvenue, jeune samouraï ! Je suis Maître Tanaka, ton guide sur la voie de l'Aïkido. Gambatte ! Ensemble, nous allons découvrir les secrets du Budo.";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export default function TestVoixTanakaPage() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [loadingVoice, setLoadingVoice] = useState<string | null>(null);
  const [audioCache, setAudioCache] = useState<Record<string, string>>({});
  const [speed, setSpeed] = useState([0.95]);
  const [customText, setCustomText] = useState('');
  const [confirmedVoice, setConfirmedVoice] = useState<string | null>(null);

  const playVoice = async (voiceId: string) => {
    // Si déjà en lecture, stopper
    if (playingVoice === voiceId && audioRef.current) {
      audioRef.current.pause();
      setPlayingVoice(null);
      return;
    }

    // Stopper l'audio en cours
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Vérifier le cache
    const cacheKey = `${voiceId}-${speed[0]}`;
    if (audioCache[cacheKey]) {
      playAudioBase64(audioCache[cacheKey], voiceId);
      return;
    }

    // Générer l'audio
    setLoadingVoice(voiceId);
    
    try {
      const formData = new FormData();
      formData.append('voice', voiceId);
      formData.append('speed', speed[0].toString());
      if (customText) {
        formData.append('text', customText);
      }

      const response = await fetch(`${BACKEND_URL}/api/voice-agent/test-voice`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur de génération audio');
      }

      const data = await response.json();
      
      if (data.success && data.audioBase64) {
        // Mettre en cache
        setAudioCache(prev => ({ ...prev, [cacheKey]: data.audioBase64 }));
        playAudioBase64(data.audioBase64, voiceId);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération de l\'audio. Vérifiez la connexion au serveur.');
    } finally {
      setLoadingVoice(null);
    }
  };

  const playAudioBase64 = (base64: string, voiceId: string) => {
    const audio = new Audio(`data:audio/mp3;base64,${base64}`);
    audioRef.current = audio;
    
    audio.onended = () => setPlayingVoice(null);
    audio.onerror = () => setPlayingVoice(null);
    
    audio.play();
    setPlayingVoice(voiceId);
  };

  const confirmVoice = (voiceId: string) => {
    setConfirmedVoice(voiceId);
    setSelectedVoice(voiceId);
  };

  const getVoiceColor = (voice: Voice) => {
    if (voice.recommended) return 'from-amber-600 to-orange-600';
    return 'from-slate-700 to-slate-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-slate-800"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              🎙️ Voix de Maître Tanaka
            </h1>
            <p className="text-sm text-slate-400">
              Choisissez la voix qui convient le mieux au Sensei
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center border-2 border-amber-500/30">
            <span className="text-5xl">🥋</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Testez les voix</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Écoutez chaque voix dire la même phrase pour choisir celle qui représente 
            le mieux Maître Tanaka, votre sensei virtuel.
          </p>
        </motion.div>

        {/* Phrase de test */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center gap-2 mb-3 text-amber-400">
            <Volume2 className="w-5 h-5" />
            <span className="font-semibold">Phrase de test</span>
          </div>
          <p className="text-slate-300 italic text-lg leading-relaxed">
            "{customText || TEST_PHRASE}"
          </p>
          <div className="mt-4">
            <textarea
              placeholder="Ou entrez votre propre texte à tester..."
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                setAudioCache({}); // Vider le cache
              }}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 placeholder:text-slate-600 resize-none"
              rows={2}
            />
          </div>
        </motion.div>

        {/* Vitesse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold">Vitesse de parole</span>
            <span className="text-amber-400 font-mono">{speed[0].toFixed(2)}x</span>
          </div>
          <Slider
            value={speed}
            onValueChange={(v) => {
              setSpeed(v);
              setAudioCache({}); // Vider le cache
            }}
            min={0.5}
            max={1.5}
            step={0.05}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>Lent (0.5x)</span>
            <span>Normal (1.0x)</span>
            <span>Rapide (1.5x)</span>
          </div>
        </motion.div>

        {/* Grille des voix */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg">9 voix disponibles</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
              ⭐ Recommandées pour un sensei
            </span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {VOICES.map((voice, index) => (
              <motion.div
                key={voice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className={`relative rounded-2xl overflow-hidden border transition-all ${
                  confirmedVoice === voice.id 
                    ? 'border-green-500 ring-2 ring-green-500/30' 
                    : voice.recommended 
                      ? 'border-amber-500/50' 
                      : 'border-slate-700/50'
                }`}
              >
                {/* Badge recommandé */}
                {voice.recommended && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="px-2 py-1 rounded-full bg-amber-500/90 text-xs font-bold text-black flex items-center gap-1">
                      <Star className="w-3 h-3" /> Recommandé
                    </span>
                  </div>
                )}
                
                {/* Badge confirmé */}
                {confirmedVoice === voice.id && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="px-2 py-1 rounded-full bg-green-500 text-xs font-bold text-black flex items-center gap-1">
                      <Check className="w-3 h-3" /> Choisi
                    </span>
                  </div>
                )}
                
                <div className={`p-5 bg-gradient-to-br ${getVoiceColor(voice)}`}>
                  <h4 className="text-xl font-bold mb-1">{voice.name}</h4>
                  <p className="text-sm text-slate-300/80 mb-4">{voice.description}</p>
                  
                  <div className="flex gap-2">
                    {/* Bouton Play */}
                    <Button
                      onClick={() => playVoice(voice.id)}
                      disabled={loadingVoice !== null && loadingVoice !== voice.id}
                      className={`flex-1 ${
                        playingVoice === voice.id 
                          ? 'bg-amber-600 hover:bg-amber-700' 
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                      data-testid={`play-${voice.id}`}
                    >
                      {loadingVoice === voice.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : playingVoice === voice.id ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Écouter
                        </>
                      )}
                    </Button>
                    
                    {/* Bouton Choisir */}
                    <Button
                      onClick={() => confirmVoice(voice.id)}
                      variant="outline"
                      className={`${
                        confirmedVoice === voice.id 
                          ? 'border-green-500 bg-green-500/20 text-green-400' 
                          : 'border-white/20 hover:bg-white/10'
                      }`}
                      data-testid={`confirm-${voice.id}`}
                    >
                      {confirmedVoice === voice.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        'Choisir'
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Confirmation finale */}
        <AnimatePresence>
          {confirmedVoice && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl p-6 border border-green-500/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    Voix sélectionnée : <span className="text-green-400">{VOICES.find(v => v.id === confirmedVoice)?.name}</span>
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Maître Tanaka utilisera cette voix pour communiquer avec vous.
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/fr/aikido/dojo')}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="confirm-final"
                >
                  Confirmer et continuer
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info */}
        <div className="text-center text-slate-500 text-sm py-4">
          <p>
            Les voix sont générées par OpenAI TTS. La voix choisie sera utilisée pour 
            toutes les interactions vocales avec Maître Tanaka.
          </p>
        </div>
      </div>
    </div>
  );
}
