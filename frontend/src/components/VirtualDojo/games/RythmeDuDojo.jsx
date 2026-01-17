/**
 * 🥁 RYTHME DU DOJO - Tempo & Fluidité
 * 
 * Jeu de rythme où l'enfant doit taper au bon moment
 * pour accompagner les mouvements du dojo
 * Développe: Rythme, Timing, Fluidité
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX, Music, Zap } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';

// Configuration du jeu
const BEAT_INTERVAL = 800; // ms entre chaque beat
const HIT_WINDOW = 200; // ms de tolérance pour un hit parfait
const GOOD_WINDOW = 400; // ms de tolérance pour un bon hit
const TOTAL_BEATS = 32; // Nombre de beats dans la chanson
const LANES = ['left', 'center', 'right'];

// Patterns de beats (simplifiés pour enfants)
const BEAT_PATTERNS = [
  { lane: 'center', beat: 1 },
  { lane: 'center', beat: 2 },
  { lane: 'left', beat: 3 },
  { lane: 'right', beat: 4 },
  { lane: 'center', beat: 5 },
  { lane: 'center', beat: 6 },
  { lane: 'left', beat: 7 },
  { lane: 'left', beat: 8 },
  { lane: 'right', beat: 9 },
  { lane: 'right', beat: 10 },
  { lane: 'center', beat: 11 },
  { lane: 'center', beat: 12 },
  { lane: 'left', beat: 13 },
  { lane: 'center', beat: 14 },
  { lane: 'right', beat: 15 },
  { lane: 'center', beat: 16 },
  { lane: 'center', beat: 17 },
  { lane: 'left', beat: 18 },
  { lane: 'right', beat: 19 },
  { lane: 'left', beat: 20 },
  { lane: 'center', beat: 21 },
  { lane: 'right', beat: 22 },
  { lane: 'center', beat: 23 },
  { lane: 'center', beat: 24 },
  { lane: 'left', beat: 25 },
  { lane: 'left', beat: 26 },
  { lane: 'right', beat: 27 },
  { lane: 'right', beat: 28 },
  { lane: 'center', beat: 29 },
  { lane: 'left', beat: 30 },
  { lane: 'right', beat: 31 },
  { lane: 'center', beat: 32 },
];

const RythmeDuDojo = ({ userName, onComplete, onExit, tanakaSpeak }) => {
  const { speak, speaking } = useTanakaVoice();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameState, setGameState] = useState('intro');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [activeNotes, setActiveNotes] = useState([]);
  const [hitEffects, setHitEffects] = useState([]);
  const [lastHit, setLastHit] = useState(null); // 'perfect', 'good', 'miss'
  const [perfectCount, setPerfectCount] = useState(0);
  const [goodCount, setGoodCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const gameStartTime = useRef(0);
  const notesRef = useRef([]);

  // Parler avec Tanaka
  const tanakaVoice = useCallback((message) => {
    if (soundEnabled) {
      speak(message);
    }
    if (tanakaSpeak) {
      tanakaSpeak(message);
    }
  }, [soundEnabled, speak, tanakaSpeak]);

  // Démarrer le jeu
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCurrentBeat(0);
    setPerfectCount(0);
    setGoodCount(0);
    setMissCount(0);
    setActiveNotes([]);
    setHitEffects([]);
    gameStartTime.current = Date.now();
    notesRef.current = BEAT_PATTERNS.map(p => ({ ...p, time: p.beat * BEAT_INTERVAL, hit: false }));
    tanakaVoice("L'Aïkido a son propre rythme. Tape au bon moment pour suivre le tempo du dojo !");
  };

  // Boucle de jeu
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      const elapsed = Date.now() - gameStartTime.current;
      const beat = Math.floor(elapsed / BEAT_INTERVAL);
      setCurrentBeat(beat);

      // Ajouter les notes qui arrivent
      const upcomingNotes = notesRef.current.filter(
        n => !n.hit && n.time > elapsed - 500 && n.time < elapsed + 2000
      );
      setActiveNotes(upcomingNotes);

      // Vérifier les notes manquées
      notesRef.current.forEach(note => {
        if (!note.hit && note.time < elapsed - GOOD_WINDOW) {
          note.hit = true;
          setMissCount(m => m + 1);
          setCombo(0);
          setLastHit('miss');
          setTimeout(() => setLastHit(null), 300);
        }
      });

      // Fin du jeu
      if (beat >= TOTAL_BEATS + 2) {
        endGame();
      }
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameState]);

  // Gérer les touches
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e) => {
      let lane = null;
      if (e.key === 'ArrowLeft' || e.key === 'q') lane = 'left';
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === ' ') lane = 'center';
      if (e.key === 'ArrowRight' || e.key === 'd') lane = 'right';

      if (!lane) return;

      const elapsed = Date.now() - gameStartTime.current;
      
      // Trouver la note la plus proche dans cette lane
      const note = notesRef.current.find(
        n => !n.hit && n.lane === lane && Math.abs(n.time - elapsed) < GOOD_WINDOW
      );

      if (note) {
        const diff = Math.abs(note.time - elapsed);
        note.hit = true;

        if (diff < HIT_WINDOW) {
          // Perfect !
          setScore(s => s + 100 * (combo + 1));
          setCombo(c => {
            const newCombo = c + 1;
            setMaxCombo(m => Math.max(m, newCombo));
            return newCombo;
          });
          setPerfectCount(p => p + 1);
          setLastHit('perfect');
          addHitEffect(lane, 'perfect');
        } else {
          // Good
          setScore(s => s + 50 * (combo + 1));
          setCombo(c => {
            const newCombo = c + 1;
            setMaxCombo(m => Math.max(m, newCombo));
            return newCombo;
          });
          setGoodCount(g => g + 1);
          setLastHit('good');
          addHitEffect(lane, 'good');
        }
      } else {
        // Miss (mauvaise lane ou trop loin)
        setCombo(0);
        setLastHit('miss');
        addHitEffect(lane, 'miss');
      }

      setTimeout(() => setLastHit(null), 200);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, combo]);

  // Ajouter un effet de hit
  const addHitEffect = (lane, type) => {
    const id = Date.now();
    setHitEffects(prev => [...prev, { id, lane, type }]);
    setTimeout(() => {
      setHitEffects(prev => prev.filter(e => e.id !== id));
    }, 300);
  };

  // Fin du jeu
  const endGame = () => {
    setGameState('finished');
    const accuracy = Math.round(((perfectCount + goodCount) / BEAT_PATTERNS.length) * 100);
    const finalScore = score + (maxCombo * 10);
    const kiEarned = Math.floor(finalScore / 50);

    if (accuracy >= 90) {
      tanakaVoice("Extraordinaire ! Tu as le rythme d'un vrai maître ! Ton timing est parfait !");
    } else if (accuracy >= 70) {
      tanakaVoice("Bien joué ! Tu ressens le rythme du dojo. Continue de pratiquer !");
    } else {
      tanakaVoice("Le rythme demande de la pratique. Ne te décourage pas, réessaie !");
    }

    setTimeout(() => onComplete(finalScore, kiEarned), 3000);
  };

  // Position X de chaque lane
  const getLaneX = (lane) => {
    switch (lane) {
      case 'left': return 150;
      case 'center': return 275;
      case 'right': return 400;
      default: return 275;
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>
          <div className="text-white">
            <span className="text-2xl font-bold text-violet-400">{score}</span>
            <span className="text-slate-400 ml-2">points</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full ${
            combo > 10 ? 'bg-amber-500/40' : combo > 5 ? 'bg-purple-500/30' : 'bg-slate-700'
          }`}>
            <span className={`font-bold ${
              combo > 10 ? 'text-amber-400' : combo > 5 ? 'text-purple-400' : 'text-slate-300'
            }`}>
              🔥 {combo}x
            </span>
          </div>
          {/* Barre de progression */}
          <div className="w-32 h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
              animate={{ width: `${(currentBeat / TOTAL_BEATS) * 100}%` }}
            />
          </div>
        </div>
        
        <button onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Zone de jeu */}
      <div 
        className="relative bg-gradient-to-b from-violet-900/50 to-slate-900 rounded-2xl overflow-hidden border-2 border-violet-500/30"
        style={{ width: 550, height: 400 }}
      >
        {gameState === 'intro' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20"
          >
            <span className="text-6xl mb-4">🥁</span>
            <h2 className="text-2xl font-bold text-white mb-2">Rythme du Dojo</h2>
            <p className="text-slate-300 text-center mb-4 max-w-md px-4">
              Tape au bon moment quand les notes atteignent la zone de frappe !
            </p>
            <div className="flex gap-6 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-1">←</div>
                <span className="text-slate-400 text-xs">Gauche</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-1">↓</div>
                <span className="text-slate-400 text-xs">Centre</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-1">→</div>
                <span className="text-slate-400 text-xs">Droite</span>
              </div>
            </div>
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:opacity-90 text-white font-bold px-8 py-3"
            >
              <Music className="w-5 h-5 mr-2" />
              Commencer !
            </Button>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20"
          >
            <span className="text-6xl mb-4">👏</span>
            <h2 className="text-3xl font-bold text-white mb-2">Bravo ! Tu as terminé cette étape 👏</h2>
            <p className="text-slate-300 mb-4">Tu peux continuer ou rejouer pour t'entraîner encore.</p>
            <div className="flex gap-6 mb-4 text-center">
              <div>
                <p className="text-emerald-400 text-2xl font-bold">{perfectCount}</p>
                <p className="text-slate-400 text-sm">Perfect</p>
              </div>
              <div>
                <p className="text-amber-400 text-2xl font-bold">{goodCount}</p>
                <p className="text-slate-400 text-sm">Good</p>
              </div>
            </div>
            <p className="text-slate-300 mb-2">Max Combo: {maxCombo}x</p>
            <p className="text-4xl font-bold text-violet-400 mb-2">{score} points</p>
            <p className="text-cyan-400 mb-4">+{Math.floor(score / 50)} Ki</p>
            <div className="flex gap-3">
              <Button onClick={restartGame} variant="outline" className="text-white border-white/30">
                <RotateCcw className="w-4 h-4 mr-2" /> Rejouer cette étape
              </Button>
              <Button 
                onClick={() => onComplete(score, Math.floor(score / 50))}
                className="bg-gradient-to-r from-emerald-500 to-teal-600"
              >
                Continuer
              </Button>
            </div>
            <p className="text-slate-500 text-xs mt-3">Tu peux recommencer pour t'entraîner encore.</p>
          </motion.div>
        )}

        {/* Piste de jeu */}
        {gameState === 'playing' && (
          <svg width={550} height={400}>
            {/* Lignes de lane */}
            {LANES.map(lane => (
              <line
                key={lane}
                x1={getLaneX(lane)}
                y1={0}
                x2={getLaneX(lane)}
                y2={400}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={2}
              />
            ))}

            {/* Zone de frappe */}
            <rect
              x={100}
              y={320}
              width={350}
              height={60}
              fill="rgba(139, 92, 246, 0.2)"
              stroke="rgba(139, 92, 246, 0.5)"
              strokeWidth={2}
              rx={10}
            />

            {/* Cercles de frappe */}
            {LANES.map(lane => (
              <g key={`target-${lane}`}>
                <circle
                  cx={getLaneX(lane)}
                  cy={350}
                  r={30}
                  fill="rgba(139, 92, 246, 0.3)"
                  stroke="rgba(139, 92, 246, 0.8)"
                  strokeWidth={3}
                />
                {/* Effets de hit */}
                {hitEffects
                  .filter(e => e.lane === lane)
                  .map(effect => (
                    <motion.circle
                      key={effect.id}
                      cx={getLaneX(lane)}
                      cy={350}
                      initial={{ r: 30, opacity: 1 }}
                      animate={{ r: 60, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      fill="none"
                      stroke={
                        effect.type === 'perfect' ? '#22c55e' :
                        effect.type === 'good' ? '#f59e0b' :
                        '#ef4444'
                      }
                      strokeWidth={4}
                    />
                  ))
                }
              </g>
            ))}

            {/* Notes qui descendent */}
            {activeNotes.map((note, idx) => {
              const elapsed = Date.now() - gameStartTime.current;
              const progress = (note.time - elapsed) / 2000; // 2 secondes pour traverser
              const y = 350 - (progress * 400);

              if (y < -50 || y > 400) return null;

              return (
                <motion.g key={`note-${note.beat}-${note.lane}`}>
                  <circle
                    cx={getLaneX(note.lane)}
                    cy={y}
                    r={25}
                    fill="url(#noteGradient)"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                  <text
                    x={getLaneX(note.lane)}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize={20}
                  >
                    🥋
                  </text>
                </motion.g>
              );
            })}

            {/* Gradient pour les notes */}
            <defs>
              <radialGradient id="noteGradient">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#7c3aed" />
              </radialGradient>
            </defs>
          </svg>
        )}

        {/* Feedback de hit */}
        <AnimatePresence>
          {lastHit && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-full font-bold text-xl ${
                lastHit === 'perfect' ? 'bg-emerald-500 text-white' :
                lastHit === 'good' ? 'bg-amber-500 text-white' :
                'bg-red-500 text-white'
              }`}
            >
              {lastHit === 'perfect' ? '✨ PERFECT!' :
               lastHit === 'good' ? '👍 GOOD!' :
               '❌ MISS'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      {gameState === 'playing' && (
        <div className="mt-4 flex gap-8 text-center">
          <div className="text-slate-400 text-sm">
            <span className="text-white">← Q</span> Gauche
          </div>
          <div className="text-slate-400 text-sm">
            <span className="text-white">↓ S Espace</span> Centre
          </div>
          <div className="text-slate-400 text-sm">
            <span className="text-white">→ D</span> Droite
          </div>
        </div>
      )}
    </div>
  );
};

export default RythmeDuDojo;
