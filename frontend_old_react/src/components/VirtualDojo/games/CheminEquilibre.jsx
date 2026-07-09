/**
 * ⚖️ CHEMIN DE L'ÉQUILIBRE - Posture & Centre
 * 
 * L'enfant guide un avatar sur un chemin étroit
 * en maintenant son équilibre (gyroscope ou clavier)
 * Développe: Équilibre, Posture, Centre (Hara)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, X, RotateCcw, Volume2, VolumeX, Scale } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PATH_WIDTH = 60;
const AVATAR_SIZE = 30;
const GRAVITY = 0.15;
const MAX_TILT = 50;
const WIN_DISTANCE = 550;

const CheminEquilibre = ({ userName, onComplete, onExit, tanakaSpeak }) => {
  const { speak, speaking } = useTanakaVoice();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameState, setGameState] = useState('intro');
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [position, setPosition] = useState({ x: GAME_WIDTH / 2, tilt: 0 });
  const [velocity, setVelocity] = useState(0);
  const [isBalanced, setIsBalanced] = useState(true);
  const [fallenTimes, setFallenTimes] = useState(0);
  const [balanceStreak, setBalanceStreak] = useState(0);
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
    setDistance(0);
    setPosition({ x: GAME_WIDTH / 2, tilt: 0 });
    setVelocity(0);
    setFallenTimes(0);
    setBalanceStreak(0);
    setIsBalanced(true);
    tanakaVoice("Utilise les flèches gauche et droite pour garder l'équilibre.");
  };

  // Gestion des touches
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'q') keysPressed.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') keysPressed.current.right = true;
    };
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'q') keysPressed.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') keysPressed.current.right = false;
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
      setPosition(prev => {
        let newTilt = prev.tilt;
        let newVelocity = velocity;

        // Appliquer la gravité (le chemin penche aléatoirement)
        const pathTilt = Math.sin(distance / 50) * 0.5;
        newVelocity += GRAVITY * pathTilt;

        // Contrôle du joueur
        if (keysPressed.current.left) {
          newVelocity -= 0.3;
        }
        if (keysPressed.current.right) {
          newVelocity += 0.3;
        }

        // Friction
        newVelocity *= 0.95;

        // Appliquer la vélocité
        newTilt = prev.tilt + newVelocity;

        // Limites
        if (Math.abs(newTilt) > MAX_TILT) {
          // Tombé !
          handleFall();
          return { ...prev, tilt: 0 };
        }

        setVelocity(newVelocity);
        return { ...prev, tilt: newTilt };
      });

      // Avancer sur le chemin
      setDistance(d => {
        const newDist = d + 1;
        if (newDist >= WIN_DISTANCE) {
          endGame(true);
        }
        return newDist;
      });

      // Calculer le score en fonction de l'équilibre
      if (Math.abs(position.tilt) < 10) {
        setScore(s => s + 2);
        setBalanceStreak(b => b + 1);
        setIsBalanced(true);
      } else if (Math.abs(position.tilt) < 25) {
        setScore(s => s + 1);
        setIsBalanced(true);
      } else {
        setBalanceStreak(0);
        setIsBalanced(false);
      }
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameState, velocity, distance, position.tilt]);

  // Gérer une chute
  const handleFall = () => {
    setFallenTimes(f => f + 1);
    setVelocity(0);
    setBalanceStreak(0);
    
    if (fallenTimes >= 2) {
      endGame(false);
    } else {
      tanakaVoice("Continue comme ça !");
    }
  };

  // Fin du jeu
  const endGame = (success) => {
    setGameState('finished');
    const bonus = success ? 100 : 0;
    const finalScore = score + bonus;
    const kiEarned = Math.floor(finalScore / 20);

    if (success) {
      tanakaVoice("Bravo, tu as terminé cette étape !");
    } else {
      tanakaVoice("Tu peux recommencer, c'est comme ça qu'on progresse.");
    }

    setTimeout(() => onComplete(finalScore, kiEarned), 3000);
  };

  // Calculer la couleur de l'indicateur d'équilibre
  const getBalanceColor = () => {
    const absTilt = Math.abs(position.tilt);
    if (absTilt < 10) return 'from-emerald-500 to-green-600';
    if (absTilt < 25) return 'from-amber-500 to-yellow-600';
    return 'from-red-500 to-orange-600';
  };

  // Calculer la position du chemin (serpentin)
  const getPathOffset = (dist) => {
    return Math.sin(dist / 80) * 100;
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
            <span className="text-2xl font-bold text-amber-400">{score}</span>
            <span className="text-slate-400 ml-2">points</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Barre de progression */}
          <div className="w-32 h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-500"
              animate={{ width: `${(distance / WIN_DISTANCE) * 100}%` }}
            />
          </div>
          {/* Vies */}
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <span key={i} className={`text-xl ${i < 3 - fallenTimes ? '' : 'opacity-30'}`}>
                ❤️
              </span>
            ))}
          </div>
        </div>
        
        <button onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Zone de jeu */}
      <div 
        className="relative bg-gradient-to-b from-sky-900 to-slate-900 rounded-2xl overflow-hidden border-2 border-amber-500/30"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {gameState === 'intro' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20"
          >
            <span className="text-6xl mb-4">⚖️</span>
            <h2 className="text-2xl font-bold text-white mb-2">Chemin de l'Équilibre</h2>
            <p className="text-slate-300 text-center mb-6 max-w-md px-4">
              Guide ton avatar sur le chemin en maintenant l'équilibre.<br/>
              Trouve ton centre, le <span className="text-amber-400">Hara</span> !
            </p>
            <p className="text-slate-400 text-sm mb-4">
              ← → ou Q/D pour t'équilibrer
            </p>
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:opacity-90 text-white font-bold px-8 py-3"
            >
              <Scale className="w-5 h-5 mr-2" />
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
            <p className="text-4xl font-bold text-amber-400 mb-2">{score} points</p>
            <p className="text-cyan-400 mb-4">+{Math.floor(score / 20)} Ki</p>
            <div className="flex gap-3">
              <Button onClick={restartGame} variant="outline" className="text-white border-white/30">
                <RotateCcw className="w-4 h-4 mr-2" /> Rejouer cette étape
              </Button>
              <Button 
                onClick={() => onComplete(score, Math.floor(score / 20))}
                className="bg-gradient-to-r from-emerald-500 to-teal-600"
              >
                Continuer
              </Button>
            </div>
            <p className="text-slate-500 text-xs mt-3">Tu peux recommencer pour t'entraîner encore.</p>
          </motion.div>
        )}

        {/* Éléments visuels du jeu */}
        <svg width={GAME_WIDTH} height={GAME_HEIGHT}>
          {/* Ciel et montagnes de fond */}
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0c4a6e" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>
          <rect width={GAME_WIDTH} height={GAME_HEIGHT} fill="url(#skyGrad)" />
          
          {/* Montagnes */}
          <polygon points="0,300 100,200 200,300" fill="#334155" />
          <polygon points="150,300 300,150 450,300" fill="#475569" />
          <polygon points="400,300 550,220 700,300" fill="#334155" />

          {/* Chemin */}
          <motion.g
            animate={{ x: -getPathOffset(distance) }}
            transition={{ type: "tween", duration: 0.016 }}
          >
            {/* Ombre du chemin */}
            <rect
              x={(GAME_WIDTH - PATH_WIDTH) / 2 - 5}
              y={GAME_HEIGHT - 100 + 5}
              width={PATH_WIDTH + 10}
              height={20}
              rx={10}
              fill="rgba(0,0,0,0.3)"
            />
            {/* Chemin principal */}
            <rect
              x={(GAME_WIDTH - PATH_WIDTH) / 2}
              y={GAME_HEIGHT - 100}
              width={PATH_WIDTH}
              height={15}
              rx={7}
              fill="#78350f"
            />
            {/* Texture du chemin */}
            <rect
              x={(GAME_WIDTH - PATH_WIDTH) / 2 + 5}
              y={GAME_HEIGHT - 98}
              width={PATH_WIDTH - 10}
              height={11}
              rx={5}
              fill="#92400e"
            />
          </motion.g>

          {/* Avatar */}
          <motion.g
            animate={{ 
              x: GAME_WIDTH / 2,
              y: GAME_HEIGHT - 130,
              rotate: position.tilt
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Aura d'équilibre */}
            {isBalanced && (
              <motion.circle
                r={35}
                fill="none"
                stroke="#22d3ee"
                strokeWidth={2}
                animate={{ r: [35, 40, 35], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
            {/* Corps */}
            <ellipse rx={15} ry={20} fill="#fbbf24" />
            {/* Tête */}
            <circle cy={-25} r={12} fill="#fbbf24" />
            {/* Bandeau */}
            <rect x={-14} y={-30} width={28} height={5} fill="#ef4444" rx={2} />
            {/* Yeux */}
            <circle cx={-4} cy={-26} r={2} fill="#1e293b" />
            <circle cx={4} cy={-26} r={2} fill="#1e293b" />
            {/* Bras (s'étendent pour l'équilibre) */}
            <motion.rect
              x={-30}
              y={-5}
              width={20}
              height={6}
              rx={3}
              fill="#1e293b"
              animate={{ rotate: -position.tilt * 0.5 }}
              style={{ transformOrigin: '-10px 0' }}
            />
            <motion.rect
              x={10}
              y={-5}
              width={20}
              height={6}
              rx={3}
              fill="#1e293b"
              animate={{ rotate: position.tilt * 0.5 }}
              style={{ transformOrigin: '10px 0' }}
            />
          </motion.g>

          {/* Indicateur de distance */}
          <text x={GAME_WIDTH - 20} y={30} textAnchor="end" fill="white" fontSize={14}>
            {Math.floor((distance / WIN_DISTANCE) * 100)}%
          </text>
        </svg>

        {/* Indicateur d'équilibre */}
        {gameState === 'playing' && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48">
            <div className="bg-slate-800/80 rounded-full p-2">
              <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
                {/* Zone parfaite */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1/4 bg-emerald-500/30" />
                {/* Indicateur */}
                <motion.div
                  className={`absolute top-0 bottom-0 w-3 bg-gradient-to-b ${getBalanceColor()} rounded-full`}
                  animate={{ left: `${50 + position.tilt}%` }}
                  style={{ transform: 'translateX(-50%)' }}
                />
              </div>
            </div>
            <p className="text-center text-white text-xs mt-1">
              {isBalanced ? '✨ Équilibre parfait !' : '⚠️ Rééquilibre-toi !'}
            </p>
          </div>
        )}

        {/* Streak bonus */}
        {balanceStreak > 20 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 right-4 bg-emerald-500/80 px-3 py-1 rounded-full"
          >
            <span className="text-white font-bold">🔥 Streak x{Math.floor(balanceStreak / 10)}</span>
          </motion.div>
        )}
      </div>

      {/* Instructions */}
      {gameState === 'playing' && (
        <div className="mt-4 flex gap-8 text-center">
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-6 h-6 text-white bg-slate-700 rounded p-1" />
            <span className="text-slate-400">Pencher à gauche</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Pencher à droite</span>
            <ArrowRight className="w-6 h-6 text-white bg-slate-700 rounded p-1" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheminEquilibre;
