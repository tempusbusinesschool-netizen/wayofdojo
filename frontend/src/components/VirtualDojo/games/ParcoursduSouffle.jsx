/**
 * 💨 PARCOURS DU SOUFFLE
 * 
 * Jeu de respiration consciente
 * L'avatar avance uniquement si le joueur respire au bon rythme
 * Inspire par le nez, expire par la bouche
 * 
 * AVEC VOIX TTS DE MAÎTRE TANAKA
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Wind, X, RotateCcw, ArrowUp, Volume2, VolumeX } from 'lucide-react';
import { useTanakaVoice, TANAKA_GAME_MESSAGES } from '@/hooks/useTanakaVoice';

const ParcoursduSouffle = ({ userName, onComplete, onExit, tanakaSpeak }) => {
  // Hook pour la voix TTS de Tanaka
  const { speak, speaking, stopSpeaking } = useTanakaVoice();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const [gameState, setGameState] = useState('intro'); // intro, playing, success
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState(0); // 0-100 (progression)
  const [breathPhase, setBreathPhase] = useState('idle'); // idle, inhale, hold, exhale
  const [breathProgress, setBreathProgress] = useState(0);
  const [perfectBreaths, setPerfectBreaths] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isHoldingBreath, setIsHoldingBreath] = useState(false);
  
  const breathTimerRef = useRef(null);
  const targetPhaseRef = useRef('inhale');
  
  // Fonction pour faire parler Tanaka avec TTS
  const speakTanaka = useCallback((message, displayMessage = null) => {
    if (tanakaSpeak) {
      tanakaSpeak(displayMessage || message);
    }
    if (voiceEnabled) {
      speak(message);
    }
  }, [voiceEnabled, speak, tanakaSpeak]);

  // Configuration des temps de respiration (en ms)
  const BREATH_CONFIG = {
    inhale: 3000,  // 3 secondes pour inspirer
    hold: 1500,    // 1.5 secondes de rétention
    exhale: 4000,  // 4 secondes pour expirer
    pause: 1000    // 1 seconde de pause
  };

  const TOTAL_DISTANCE = 100;
  const CHECKPOINT_INTERVAL = 20;

  // Boucle de respiration cible
  useEffect(() => {
    if (gameState !== 'playing') return;

    const breathCycle = () => {
      const phases = ['inhale', 'hold', 'exhale', 'pause'];
      let currentIndex = 0;

      const runPhase = () => {
        if (gameState !== 'playing') return;
        
        const phase = phases[currentIndex];
        targetPhaseRef.current = phase;
        
        const duration = BREATH_CONFIG[phase];
        
        breathTimerRef.current = setTimeout(() => {
          currentIndex = (currentIndex + 1) % phases.length;
          runPhase();
        }, duration);
      };

      runPhase();
    };

    breathCycle();

    return () => {
      if (breathTimerRef.current) {
        clearTimeout(breathTimerRef.current);
      }
    };
  }, [gameState]);

  // Gérer l'entrée du joueur
  const handleBreathInput = useCallback((action) => {
    if (gameState !== 'playing') return;

    const targetPhase = targetPhaseRef.current;
    
    if (action === 'inhale' && targetPhase === 'inhale') {
      setBreathPhase('inhale');
      setCombo(prev => prev + 1);
      setPosition(prev => {
        const newPos = Math.min(100, prev + 2 + combo * 0.5);
        return newPos;
      });
      setScore(prev => prev + 10 + combo * 2);
      
      if (combo > 0 && combo % 5 === 0) {
        tanakaSpeak(`Excellent ! ${combo} respirations parfaites d'affilée ! Continue ainsi !`);
      }
    } else if (action === 'exhale' && targetPhase === 'exhale') {
      setBreathPhase('exhale');
      setCombo(prev => prev + 1);
      setPosition(prev => {
        const newPos = Math.min(100, prev + 2 + combo * 0.5);
        return newPos;
      });
      setScore(prev => prev + 10 + combo * 2);
    } else if (action === 'hold' && targetPhase === 'hold') {
      setBreathPhase('hold');
      setScore(prev => prev + 5);
    } else {
      // Mauvais timing
      setCombo(0);
      setBreathPhase('wrong');
      setTimeout(() => setBreathPhase('idle'), 500);
    }
  }, [gameState, combo, tanakaSpeak]);

  // Vérifier la victoire
  useEffect(() => {
    if (position >= 100 && gameState === 'playing') {
      setGameState('success');
      const finalScore = score + perfectBreaths * 50;
      setScore(finalScore);
      tanakaSpeak(`Magnifique ${userName || 'ninja'} ! Tu as maîtrisé le parcours du souffle ! Ta respiration est celle d'un vrai aikidoka !`);
    }
  }, [position, gameState, score, perfectBreaths, userName, tanakaSpeak]);

  // Contrôles clavier
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'z') {
        handleBreathInput('inhale');
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        handleBreathInput('exhale');
      } else if (e.key === ' ') {
        handleBreathInput('hold');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleBreathInput]);

  const startGame = () => {
    setGameState('playing');
    setPosition(0);
    setScore(0);
    setCombo(0);
    setPerfectBreaths(0);
    setBreathPhase('idle');
    tanakaSpeak("Suis le rythme de respiration. Flèche HAUT pour inspirer, ESPACE pour retenir, Flèche BAS pour expirer.");
  };

  const restartGame = () => {
    setGameState('intro');
    setPosition(0);
    setScore(0);
  };

  // Couleur de la phase de respiration cible
  const getPhaseColor = () => {
    switch(targetPhaseRef.current) {
      case 'inhale': return 'from-cyan-500 to-blue-500';
      case 'hold': return 'from-amber-500 to-yellow-500';
      case 'exhale': return 'from-pink-500 to-rose-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getPhaseLabel = () => {
    switch(targetPhaseRef.current) {
      case 'inhale': return '⬆️ INSPIRE';
      case 'hold': return '⏸️ RETIENS';
      case 'exhale': return '⬇️ EXPIRE';
      default: return '⏳ PAUSE';
    }
  };

  return (
    <div className="relative">
      {/* Écran d'intro */}
      <AnimatePresence>
        {gameState === 'intro' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <motion.span 
              className="text-6xl block mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              💨
            </motion.span>
            <h2 className="text-2xl font-bold text-white mb-4">Parcours du Souffle</h2>
            <p className="text-slate-300 mb-6 max-w-md mx-auto">
              Ton avatar avance quand tu respires au bon rythme.
              <br/><br/>
              <strong>🎮 Contrôles :</strong>
              <br/>⬆️ Flèche Haut = Inspirer
              <br/>ESPACE = Retenir
              <br/>⬇️ Flèche Bas = Expirer
              <br/><br/>
              <em className="text-cyan-400">Suis l'indicateur visuel !</em>
            </p>
            <Button 
              onClick={startGame}
              className="bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold px-8 py-3"
            >
              Commencer
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zone de jeu */}
      {gameState === 'playing' && (
        <div className="space-y-4">
          {/* Header avec score et combo */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-white">
                <span className="text-slate-400 text-sm">Score</span>
                <p className="text-xl font-bold">{score}</p>
              </div>
              {combo > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-amber-500/20 px-3 py-1 rounded-full"
                >
                  <span className="text-amber-400 font-bold">🔥 x{combo}</span>
                </motion.div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onExit} className="text-slate-400">
              <X className="w-4 h-4 mr-1" /> Quitter
            </Button>
          </div>

          {/* Indicateur de phase de respiration */}
          <motion.div 
            key={targetPhaseRef.current}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`bg-gradient-to-r ${getPhaseColor()} rounded-2xl p-6 text-center`}
          >
            <motion.p 
              className="text-white text-3xl font-bold"
              animate={{ 
                scale: targetPhaseRef.current === 'hold' ? 1 : [1, 1.1, 1]
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              {getPhaseLabel()}
            </motion.p>
            
            {/* Animation visuelle du souffle */}
            <motion.div 
              className="mt-4 mx-auto w-24 h-24 rounded-full border-4 border-white/50 flex items-center justify-center"
              animate={{
                scale: targetPhaseRef.current === 'inhale' ? [1, 1.5] :
                       targetPhaseRef.current === 'exhale' ? [1.5, 1] :
                       1.25,
                borderColor: breathPhase === 'wrong' ? '#ef4444' : 'rgba(255,255,255,0.5)'
              }}
              transition={{ 
                duration: targetPhaseRef.current === 'inhale' ? 3 :
                          targetPhaseRef.current === 'exhale' ? 4 : 0.5 
              }}
            >
              <span className="text-4xl">
                {breathPhase === 'wrong' ? '❌' : '🧘'}
              </span>
            </motion.div>
          </motion.div>

          {/* Parcours visuel */}
          <div className="relative bg-slate-800/50 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-2 text-center">Progression du parcours</p>
            
            {/* Barre de progression */}
            <div className="relative h-16 bg-slate-700 rounded-full overflow-hidden">
              {/* Checkpoints */}
              {[20, 40, 60, 80].map((cp) => (
                <div 
                  key={cp} 
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-500"
                  style={{ left: `${cp}%` }}
                />
              ))}
              
              {/* Barre de progression */}
              <motion.div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                animate={{ width: `${position}%` }}
              />
              
              {/* Avatar sur le parcours */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-4xl"
                animate={{ left: `${position}%` }}
              >
                🧘
              </motion.div>
              
              {/* Arrivée */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-3xl">
                🏆
              </div>
            </div>
            
            <p className="text-center text-white mt-2 font-bold">{Math.round(position)}%</p>
          </div>

          {/* Boutons tactiles */}
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-8"
              onMouseDown={() => handleBreathInput('inhale')}
              onTouchStart={() => handleBreathInput('inhale')}
            >
              <ArrowUp className="w-5 h-5 mr-2" />
              Inspirer
            </Button>
            <Button
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8"
              onMouseDown={() => handleBreathInput('hold')}
              onTouchStart={() => handleBreathInput('hold')}
            >
              ⏸️ Retenir
            </Button>
            <Button
              size="lg"
              className="bg-pink-600 hover:bg-pink-700 text-white px-8"
              onMouseDown={() => handleBreathInput('exhale')}
              onTouchStart={() => handleBreathInput('exhale')}
            >
              ⬇️ Expirer
            </Button>
          </div>
        </div>
      )}

      {/* Écran de victoire */}
      <AnimatePresence>
        {gameState === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.span 
              className="text-7xl block mb-4"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 1 }}
            >
              🎊
            </motion.span>
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">Souffle Maîtrisé !</h2>
            <p className="text-slate-300 mb-4">Ta respiration est harmonieuse et puissante !</p>
            
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6 inline-block">
              <p className="text-amber-400 text-3xl font-bold">{score} points</p>
              <p className="text-cyan-400">+{Math.round(score / 10)} Ki</p>
              {combo > 5 && (
                <p className="text-pink-400 text-sm mt-1">🔥 Meilleur combo : x{combo}</p>
              )}
            </div>
            
            <div className="flex justify-center gap-4">
              <Button onClick={restartGame} variant="outline" className="text-white border-white/30">
                <RotateCcw className="w-4 h-4 mr-2" /> Rejouer
              </Button>
              <Button 
                onClick={() => onComplete(score, Math.round(score / 10))}
                className="bg-gradient-to-r from-emerald-500 to-teal-600"
              >
                Terminer
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParcoursduSouffle;
