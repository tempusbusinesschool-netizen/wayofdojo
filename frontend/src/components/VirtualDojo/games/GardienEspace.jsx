/**
 * 🎯 GARDIEN DE L'ESPACE - Maîtrise du Ma-ai
 * 
 * L'enfant doit maintenir la distance parfaite avec des partenaires virtuels
 * Trop près = danger, trop loin = inefficace
 * Développe: Distance, Anticipation, Positionnement
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, X, RotateCcw, Volume2, VolumeX, Target } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PERFECT_DISTANCE = 80; // Distance idéale
const DANGER_CLOSE = 40; // Trop près
const TOO_FAR = 140; // Trop loin
const GAME_DURATION = 60; // secondes

const GardienEspace = ({ userName, onComplete, onExit, tanakaSpeak }) => {
  const { speak, speaking, stopSpeaking } = useTanakaVoice();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameState, setGameState] = useState('intro'); // intro, playing, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [playerPos, setPlayerPos] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
  const [partners, setPartners] = useState([]);
  const [perfectStreak, setPerfectStreak] = useState(0);
  const [feedback, setFeedback] = useState('');
  const gameRef = useRef(null);
  const keysPressed = useRef({});

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
    setTimeLeft(GAME_DURATION);
    setPerfectStreak(0);
    setPlayerPos({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
    initPartners();
    tanakaVoice("C'est parti ! Maintiens la distance parfaite avec tes partenaires. Ni trop près, ni trop loin !");
  };

  // Initialiser les partenaires
  const initPartners = () => {
    const newPartners = [
      { id: 1, x: 150, y: 150, vx: 1.5, vy: 0.5, emoji: '🥋' },
      { id: 2, x: 450, y: 250, vx: -1, vy: 1, emoji: '👤' },
      { id: 3, x: 300, y: 350, vx: 0.5, vy: -1.5, emoji: '🧑' },
    ];
    setPartners(newPartners);
  };

  // Gestion des touches
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
    };
    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Boucle de jeu
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      // Mouvement du joueur
      setPlayerPos(prev => {
        let newX = prev.x;
        let newY = prev.y;
        const speed = 4;

        if (keysPressed.current['ArrowUp'] || keysPressed.current['z']) newY -= speed;
        if (keysPressed.current['ArrowDown'] || keysPressed.current['s']) newY += speed;
        if (keysPressed.current['ArrowLeft'] || keysPressed.current['q']) newX -= speed;
        if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) newX += speed;

        // Limites
        newX = Math.max(30, Math.min(GAME_WIDTH - 30, newX));
        newY = Math.max(30, Math.min(GAME_HEIGHT - 30, newY));

        return { x: newX, y: newY };
      });

      // Mouvement des partenaires
      setPartners(prev => prev.map(p => {
        let newX = p.x + p.vx;
        let newY = p.y + p.vy;
        let newVx = p.vx;
        let newVy = p.vy;

        // Rebond sur les bords
        if (newX < 30 || newX > GAME_WIDTH - 30) newVx = -newVx;
        if (newY < 30 || newY > GAME_HEIGHT - 30) newVy = -newVy;

        return { ...p, x: newX, y: newY, vx: newVx, vy: newVy };
      }));
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameState]);

  // Calculer le score en fonction des distances
  useEffect(() => {
    if (gameState !== 'playing') return;

    const scoreInterval = setInterval(() => {
      let allPerfect = true;
      let anyDanger = false;

      partners.forEach(partner => {
        const distance = Math.sqrt(
          Math.pow(playerPos.x - partner.x, 2) + 
          Math.pow(playerPos.y - partner.y, 2)
        );

        if (distance < DANGER_CLOSE) {
          anyDanger = true;
          allPerfect = false;
        } else if (distance > TOO_FAR) {
          allPerfect = false;
        } else if (distance >= PERFECT_DISTANCE - 20 && distance <= PERFECT_DISTANCE + 20) {
          // Distance parfaite !
        } else {
          allPerfect = false;
        }
      });

      if (anyDanger) {
        setFeedback('⚠️ Trop près ! Danger !');
        setPerfectStreak(0);
      } else if (allPerfect) {
        setScore(s => s + 10);
        setPerfectStreak(s => s + 1);
        setFeedback('✨ Distance parfaite !');
      } else {
        setFeedback('📏 Ajuste ta position...');
        setPerfectStreak(0);
      }
    }, 500);

    return () => clearInterval(scoreInterval);
  }, [gameState, playerPos, partners]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Fin du jeu
  const endGame = () => {
    setGameState('finished');
    const finalScore = score;
    const kiEarned = Math.floor(score / 10);
    
    if (finalScore >= 300) {
      tanakaVoice("Extraordinaire ! Tu maîtrises parfaitement le Ma-ai ! La distance juste n'a plus de secret pour toi !");
    } else if (finalScore >= 150) {
      tanakaVoice("Bien joué ! Tu commences à sentir la bonne distance. Continue de pratiquer !");
    } else {
      tanakaVoice("N'abandonne pas ! Le Ma-ai demande de la pratique. Réessaie, tu vas progresser !");
    }

    setTimeout(() => onComplete(finalScore, kiEarned), 3000);
  };

  // Calculer la couleur de la zone autour du joueur
  const getDistanceColor = (distance) => {
    if (distance < DANGER_CLOSE) return 'rgba(239, 68, 68, 0.3)'; // Rouge
    if (distance < PERFECT_DISTANCE - 20) return 'rgba(251, 191, 36, 0.3)'; // Orange
    if (distance <= PERFECT_DISTANCE + 20) return 'rgba(34, 197, 94, 0.3)'; // Vert
    if (distance < TOO_FAR) return 'rgba(251, 191, 36, 0.3)'; // Orange
    return 'rgba(148, 163, 184, 0.2)'; // Gris
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
            <span className="text-2xl font-bold text-cyan-400">{score}</span>
            <span className="text-slate-400 ml-2">points</span>
          </div>
        </div>
        
        {gameState === 'playing' && (
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/20 px-3 py-1 rounded-full">
              <span className="text-emerald-400 font-bold">🔥 x{perfectStreak}</span>
            </div>
            <div className="bg-amber-500/20 px-4 py-2 rounded-full">
              <span className="text-amber-400 font-bold text-xl">⏱️ {timeLeft}s</span>
            </div>
          </div>
        )}
        
        <button
          onClick={onExit}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Zone de jeu */}
      <div 
        ref={gameRef}
        className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border-2 border-emerald-500/30"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        tabIndex={0}
      >
        {gameState === 'intro' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20"
          >
            <span className="text-6xl mb-4">🎯</span>
            <h2 className="text-2xl font-bold text-white mb-2">Gardien de l'Espace</h2>
            <p className="text-slate-300 text-center mb-4 max-w-md px-4">
              Maintiens la distance parfaite avec tes partenaires.<br/>
              <span className="text-emerald-400">Vert = parfait</span> • 
              <span className="text-amber-400"> Orange = ajuste</span> • 
              <span className="text-red-400"> Rouge = danger !</span>
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Utilise les flèches ↑↓←→ ou ZQSD pour te déplacer
            </p>
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white font-bold px-8 py-3"
            >
              <Target className="w-5 h-5 mr-2" />
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
            <p className="text-4xl font-bold text-emerald-400 mb-2">{score} points</p>
            <p className="text-cyan-400 mb-4">+{Math.floor(score / 10)} Ki</p>
            <div className="flex gap-3">
              <Button onClick={restartGame} variant="outline" className="text-white border-white/30">
                <RotateCcw className="w-4 h-4 mr-2" /> Rejouer cette étape
              </Button>
              <Button 
                onClick={() => onComplete(score, Math.floor(score / 10))}
                className="bg-gradient-to-r from-emerald-500 to-teal-600"
              >
                Continuer
              </Button>
            </div>
            <p className="text-slate-500 text-xs mt-3">Tu peux recommencer pour t'entraîner encore.</p>
          </motion.div>
        )}

        {/* Zones de distance pour chaque partenaire */}
        {gameState === 'playing' && partners.map(partner => {
          const distance = Math.sqrt(
            Math.pow(playerPos.x - partner.x, 2) + 
            Math.pow(playerPos.y - partner.y, 2)
          );
          return (
            <motion.circle
              key={`zone-${partner.id}`}
              cx={partner.x}
              cy={partner.y}
              r={PERFECT_DISTANCE}
              fill="none"
              stroke={getDistanceColor(distance).replace('0.3', '0.5')}
              strokeWidth={2}
              strokeDasharray="5,5"
              style={{ position: 'absolute', pointerEvents: 'none' }}
            />
          );
        })}

        {/* SVG pour les éléments du jeu */}
        <svg width={GAME_WIDTH} height={GAME_HEIGHT} className="absolute inset-0">
          {/* Cercles de distance idéale */}
          {gameState === 'playing' && partners.map(partner => (
            <g key={`partner-zone-${partner.id}`}>
              <circle
                cx={partner.x}
                cy={partner.y}
                r={PERFECT_DISTANCE}
                fill="none"
                stroke="rgba(34, 197, 94, 0.3)"
                strokeWidth={20}
                strokeDasharray="5,5"
              />
              <circle
                cx={partner.x}
                cy={partner.y}
                r={DANGER_CLOSE}
                fill="rgba(239, 68, 68, 0.2)"
              />
            </g>
          ))}

          {/* Partenaires */}
          {partners.map(partner => (
            <motion.g
              key={partner.id}
              animate={{ x: partner.x, y: partner.y }}
              transition={{ type: "tween", duration: 0.016 }}
            >
              <circle r={25} fill="#334155" />
              <text 
                textAnchor="middle" 
                dominantBaseline="central" 
                fontSize={24}
              >
                {partner.emoji}
              </text>
            </motion.g>
          ))}

          {/* Joueur */}
          <motion.g
            animate={{ x: playerPos.x, y: playerPos.y }}
            transition={{ type: "tween", duration: 0.016 }}
          >
            <circle r={20} fill="#22d3ee" />
            <text 
              textAnchor="middle" 
              dominantBaseline="central" 
              fontSize={20}
            >
              🥷
            </text>
            {/* Aura */}
            <motion.circle
              r={30}
              fill="none"
              stroke="#22d3ee"
              strokeWidth={2}
              animate={{ r: [30, 35, 30], opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </motion.g>
        </svg>

        {/* Feedback */}
        {gameState === 'playing' && feedback && (
          <motion.div
            key={feedback}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full"
          >
            <span className="text-white font-bold">{feedback}</span>
          </motion.div>
        )}
      </div>

      {/* Instructions */}
      {gameState === 'playing' && (
        <div className="mt-4 text-center">
          <p className="text-slate-400 text-sm">
            Utilise les <span className="text-white">flèches</span> ou <span className="text-white">ZQSD</span> pour te déplacer
          </p>
        </div>
      )}
    </div>
  );
};

export default GardienEspace;
