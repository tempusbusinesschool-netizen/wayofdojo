/**
 * 🥁 RYTHME DU DOJO - Tempo & fluidité
 * 
 * Taper au bon rythme pour accompagner les mouvements
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';

interface RythmeDuDojoProps {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (message: string) => void;
}

const BEATS_PER_ROUND = 16;
const TOTAL_ROUNDS = 3;

const RythmeDuDojo: React.FC<RythmeDuDojoProps> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [beatIndex, setBeatIndex] = useState(0);
  const [targetBeat, setTargetBeat] = useState(false);
  const [playerHit, setPlayerHit] = useState(false);
  const [lastResult, setLastResult] = useState<'perfect' | 'good' | 'miss' | null>(null);
  const [combo, setCombo] = useState(0);
  const [bpm, setBpm] = useState(80);

  const speakTanaka = useCallback((message: string) => {
    if (tanakaSpeak) tanakaSpeak(message);
    if (voiceEnabled) speak(message);
  }, [voiceEnabled, speak, tanakaSpeak]);

  // Beat pattern
  useEffect(() => {
    if (gameState !== 'playing') return;

    const beatInterval = 60000 / bpm;
    
    const interval = setInterval(() => {
      setBeatIndex(prev => {
        const newIndex = (prev + 1) % BEATS_PER_ROUND;
        
        // Target beats on 1, 5, 9, 13 (quarters)
        setTargetBeat([0, 4, 8, 12].includes(newIndex));
        
        // Reset player hit on new beat
        setPlayerHit(false);
        
        // Check if round complete
        if (newIndex === 0) {
          if (round < TOTAL_ROUNDS) {
            setRound(r => r + 1);
            setBpm(prev => prev + 10); // Speed up
          } else {
            endGame();
          }
        }
        
        return newIndex;
      });
    }, beatInterval);

    return () => clearInterval(interval);
  }, [gameState, bpm, round]);

  // Keyboard input
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleHit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, targetBeat, playerHit]);

  const handleHit = () => {
    if (playerHit) return; // Already hit this beat
    
    setPlayerHit(true);
    
    if (targetBeat) {
      // Perfect hit
      setScore(prev => prev + 20 * (combo + 1));
      setCombo(prev => prev + 1);
      setLastResult('perfect');
      
      if (combo > 0 && combo % 4 === 0) {
        speakTanaka("Bien joué !");
      }
    } else if ([1, 3, 5, 7, 9, 11, 13, 15].includes(beatIndex)) {
      // Good timing (off-beat is acceptable)
      setScore(prev => prev + 5);
      setLastResult('good');
    } else {
      // Miss
      setCombo(0);
      setLastResult('miss');
    }
    
    setTimeout(() => setLastResult(null), 200);
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setRound(1);
    setBeatIndex(0);
    setCombo(0);
    setBpm(80);
    speakTanaka("Tape en rythme sur les temps forts !");
  };

  const endGame = () => {
    setGameState('finished');
    const finalScore = score;
    const kiEarned = 20 + Math.floor(finalScore / 40);
    
    if (score >= 300) {
      speakTanaka(`Bravo ${userName} ! Tu as le rythme du dojo !`);
    } else {
      speakTanaka("Continue à t'entraîner au rythme !");
    }
    
    setTimeout(() => onComplete(finalScore, kiEarned), 2500);
  };

  return (
    <div className="relative min-h-[400px]" data-testid="rythme-dojo-game">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <span className="text-3xl">🥁</span>
          <div>
            <h3 className="text-white font-bold">Rythme du Dojo</h3>
            <p className="text-slate-400 text-sm">Tape en rythme</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>
          <button onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Intro */}
      {gameState === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">🥁</span>
          <h2 className="text-2xl font-bold text-white mb-4">Rythme du Dojo</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">
            L'Aïkido a son propre rythme. Tape ESPACE ou ENTRÉE sur les temps forts 
            (quand le cercle passe sur la cible). Le tempo accélère à chaque round !
          </p>
          <Button onClick={startGame} className="bg-gradient-to-r from-violet-500 to-purple-600" data-testid="start-rythme-btn">
            Commencer
          </Button>
        </motion.div>
      )}

      {/* Game */}
      {gameState === 'playing' && (
        <div>
          {/* Stats */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-white">
              Round {round}/{TOTAL_ROUNDS} • {bpm} BPM
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-full">
              <span className="text-amber-400 font-bold">⭐ {score}</span>
            </div>
            {combo > 2 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 rounded-full">
                <span className="text-white font-bold">🔥 x{combo}</span>
              </motion.div>
            )}
          </div>

          {/* Rhythm visualization */}
          <div className="relative h-48 bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden">
            {/* Beat track */}
            <div className="absolute w-full h-16 flex items-center justify-around px-8">
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: beatIndex === i ? 1.3 : 1,
                    backgroundColor: [0, 4, 8, 12].includes(i) 
                      ? beatIndex === i ? '#f59e0b' : '#6b7280'
                      : '#374151'
                  }}
                  className="w-3 h-3 rounded-full"
                />
              ))}
            </div>

            {/* Target zone */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <motion.div
                animate={{
                  scale: targetBeat ? [1, 1.2, 1] : 1,
                  borderColor: targetBeat ? '#f59e0b' : '#4b5563'
                }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 rounded-full border-4 flex items-center justify-center"
              >
                <span className="text-2xl">{targetBeat ? '🥁' : '○'}</span>
              </motion.div>
            </div>

            {/* Result feedback */}
            {lastResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4"
              >
                <span className={`text-2xl font-bold ${
                  lastResult === 'perfect' ? 'text-amber-400' : 
                  lastResult === 'good' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {lastResult === 'perfect' ? '✨ PARFAIT !' : 
                   lastResult === 'good' ? '👍 Bien' : '❌'}
                </span>
              </motion.div>
            )}
          </div>

          {/* Hit button */}
          <div className="mt-6 text-center">
            <Button
              onClick={handleHit}
              className={`w-32 h-32 rounded-full text-4xl transition-all ${
                playerHit 
                  ? 'bg-amber-600 scale-95' 
                  : 'bg-gradient-to-br from-violet-500 to-purple-600 hover:scale-105'
              }`}
            >
              🥁
            </Button>
            <p className="text-slate-400 text-sm mt-3">ESPACE ou clique pour taper</p>
          </div>
        </div>
      )}

      {/* Finished */}
      {gameState === 'finished' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">{score >= 300 ? '🏆' : '🥁'}</span>
          <h2 className="text-2xl font-bold text-white mb-2">
            {score >= 300 ? 'Maître du rythme !' : 'Bien joué !'}
          </h2>
          <p className="text-amber-400 text-xl mb-4">Score : {score} points</p>
          <p className="text-slate-400">Tu as complété {TOTAL_ROUNDS} rounds !</p>
        </motion.div>
      )}
    </div>
  );
};

export default RythmeDuDojo;
