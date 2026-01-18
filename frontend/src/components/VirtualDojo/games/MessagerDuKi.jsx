/**
 * 🌊 LE MESSAGER DU KI
 * 
 * Jeu de gestion du stress et de l'équilibre
 * L'enfant contrôle un avatar qui traverse le dojo
 * S'il va trop vite, il perd l'équilibre
 * Il doit respirer et garder sa posture
 * 
 * AVEC VOIX TTS DE MAÎTRE TANAKA
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Heart, Wind, X, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useTanakaVoice, TANAKA_GAME_MESSAGES } from '@/hooks/useTanakaVoice';

// Personnage ninja simplifié en SVG
const NinjaAvatar = ({ x, y, balance, isBreathing }) => (
  <motion.g
    animate={{ x, y }}
    transition={{ type: "spring", stiffness: 100, damping: 15 }}
  >
    {/* Corps du ninja */}
    <motion.ellipse
      cx={0}
      cy={0}
      rx={18}
      ry={25}
      fill="#1e293b"
      animate={{ 
        rotate: balance > 60 ? 0 : balance > 40 ? [-5, 5] : [-10, 10],
        scale: isBreathing ? [1, 1.05, 1] : 1
      }}
      transition={{ 
        rotate: { repeat: Infinity, duration: balance > 60 ? 0 : 0.3 },
        scale: { repeat: Infinity, duration: 2 }
      }}
    />
    {/* Tête */}
    <circle cx={0} cy={-30} r={14} fill="#fbbf24" />
    {/* Bandeau */}
    <rect x={-16} y={-35} width={32} height={6} fill="#ef4444" rx={2} />
    {/* Yeux */}
    <circle cx={-5} cy={-30} r={2} fill="#1e293b" />
    <circle cx={5} cy={-30} r={2} fill="#1e293b" />
    {/* Sourire */}
    <path d="M -5,-24 Q 0,-21 5,-24" stroke="#1e293b" strokeWidth={2} fill="none" />
    {/* Aura Ki si bon équilibre */}
    {balance > 70 && (
      <motion.circle
        cx={0}
        cy={-5}
        r={35}
        fill="none"
        stroke="#22d3ee"
        strokeWidth={2}
        animate={{ 
          r: [35, 45, 35],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    )}
  </motion.g>
);

// Obstacle (tension/conflit)
const Obstacle = ({ x, y, type }) => {
  const obstacles = {
    anger: { emoji: '😠', color: '#ef4444' },
    fear: { emoji: '😨', color: '#8b5cf6' },
    rush: { emoji: '⚡', color: '#f59e0b' },
    noise: { emoji: '📢', color: '#ec4899' }
  };
  const ob = obstacles[type] || obstacles.anger;
  
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      <circle cx={x} cy={y} r={20} fill={ob.color} opacity={0.3} />
      <text x={x} y={y + 8} textAnchor="middle" fontSize={24}>{ob.emoji}</text>
    </motion.g>
  );
};

// Porte de sortie (arrivée)
const ExitGate = ({ x, y }) => (
  <g>
    <rect x={x - 25} y={y - 40} width={50} height={80} fill="#059669" opacity={0.3} rx={5} />
    <text x={x} y={y - 15} textAnchor="middle" fontSize={32}>🚪</text>
    <text x={x} y={y + 20} textAnchor="middle" fill="#10b981" fontSize={12} fontWeight="bold">SORTIE</text>
  </g>
);

const MessagerDuKi = ({ userName, onComplete, onExit, tanakaSpeak }) => {
  // Hook pour la voix TTS de Tanaka
  const { speak, speaking, stopSpeaking } = useTanakaVoice();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  // États du jeu
  const [gameState, setGameState] = useState('intro'); // intro, playing, success, fail
  const [score, setScore] = useState(0);
  const [balance, setBalance] = useState(100); // Équilibre 0-100
  const [breathCycle, setBreathCycle] = useState(0); // 0-100 pour le cycle de respiration
  const [isBreathing, setIsBreathing] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 400 });
  const [obstacles, setObstacles] = useState([]);
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(0); // Vitesse actuelle
  
  const gameRef = useRef(null);
  const animationRef = useRef(null);
  const lastMoveTime = useRef(Date.now());

  // Configuration
  const GAME_WIDTH = 600;
  const GAME_HEIGHT = 450;
  const EXIT_Y = 50;
  const MOVE_STEP = 8;
  const BALANCE_DRAIN_FAST = 2;
  const BALANCE_DRAIN_SLOW = 0.3;
  const BALANCE_RESTORE = 1.5;
  
  // Fonction pour faire parler Tanaka avec TTS
  const speakTanaka = useCallback((message, displayMessage = null) => {
    // Afficher le message dans l'UI
    if (tanakaSpeak) {
      tanakaSpeak(displayMessage || message);
    }
    // Jouer le TTS si activé
    if (voiceEnabled) {
      speak(message);
    }
  }, [voiceEnabled, speak, tanakaSpeak]);

  // Initialiser les obstacles
  useEffect(() => {
    if (gameState === 'playing') {
      const types = ['anger', 'fear', 'rush', 'noise'];
      const newObstacles = [];
      
      // Générer des obstacles selon le niveau
      for (let i = 0; i < 5 + level * 2; i++) {
        newObstacles.push({
          id: i,
          x: 50 + Math.random() * (GAME_WIDTH - 100),
          y: 100 + Math.random() * 280,
          type: types[Math.floor(Math.random() * types.length)]
        });
      }
      setObstacles(newObstacles);
    }
  }, [gameState, level]);

  // Boucle de jeu principale
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      const now = Date.now();
      const delta = now - lastMoveTime.current;
      
      // Drainer l'équilibre selon la vitesse
      setBalance(prev => {
        let newBalance = prev;
        
        if (speed > 3) {
          newBalance -= BALANCE_DRAIN_FAST * (delta / 100);
        } else if (speed > 0) {
          newBalance -= BALANCE_DRAIN_SLOW * (delta / 100);
        }
        
        // Restaurer si respiration active
        if (isBreathing && speed === 0) {
          newBalance += BALANCE_RESTORE * (delta / 100);
        }
        
        return Math.min(100, Math.max(0, newBalance));
      });
      
      // Réduire la vitesse progressivement
      setSpeed(prev => Math.max(0, prev - 0.1));
      
      lastMoveTime.current = now;
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, speed, isBreathing]);

  // Vérifier la victoire/défaite
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    // Victoire si atteint la sortie
    if (position.y <= EXIT_Y + 30) {
      setGameState('success');
      const finalScore = Math.round(balance * level * 10);
      setScore(finalScore);
      speakTanaka(
        TANAKA_GAME_MESSAGES.messager_success,
        "Bravo, tu as terminé cette étape !"
      );
    }
    
    // Défaite si équilibre à 0
    if (balance <= 0) {
      setGameState('fail');
      speakTanaka(
        TANAKA_GAME_MESSAGES.messager_fail,
        `Continue comme ça, ${userName || 'ninja'}. Rappelle-toi : la patience est la clé. Respire et recommence !`
      );
    }
  }, [position.y, balance, gameState, level, userName, speakTanaka]);

  // Collision avec obstacles
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    obstacles.forEach(ob => {
      const distance = Math.sqrt(
        Math.pow(position.x - ob.x, 2) + Math.pow(position.y - ob.y, 2)
      );
      
      if (distance < 35) {
        setBalance(prev => Math.max(0, prev - 15));
        setObstacles(current => current.filter(o => o.id !== ob.id));
        speakTanaka(TANAKA_GAME_MESSAGES.messager_obstacle);
      }
    });
  }, [position, obstacles, gameState, speakTanaka]);

  // Contrôles clavier
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      let dx = 0, dy = 0;
      
      switch(key) {
        case 'arrowup':
        case 'z':
        case 'w':
          dy = -MOVE_STEP;
          break;
        case 'arrowdown':
        case 's':
          dy = MOVE_STEP;
          break;
        case 'arrowleft':
        case 'q':
        case 'a':
          dx = -MOVE_STEP;
          break;
        case 'arrowright':
        case 'd':
          dx = MOVE_STEP;
          break;
        case ' ':
          setIsBreathing(true);
          return;
        default:
          return;
      }
      
      e.preventDefault();
      setSpeed(prev => Math.min(10, prev + 2));
      setPosition(prev => ({
        x: Math.max(30, Math.min(GAME_WIDTH - 30, prev.x + dx)),
        y: Math.max(30, Math.min(GAME_HEIGHT - 30, prev.y + dy))
      }));
    };

    const handleKeyUp = (e) => {
      if (e.key === ' ') {
        setIsBreathing(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Démarrer le jeu
  const startGame = () => {
    setGameState('playing');
    setBalance(100);
    setPosition({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 60 });
    setSpeed(0);
    setScore(0);
    speakTanaka(TANAKA_GAME_MESSAGES.messager_start);
  };

  // Recommencer
  const restartGame = () => {
    stopSpeaking(); // Arrêter la voix TTS
    setGameState('intro');
    setBalance(100);
    setPosition({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 60 });
    setSpeed(0);
    setScore(0);
  };
  
  // Quitter le jeu
  const handleExit = () => {
    stopSpeaking(); // Arrêter la voix TTS
    onExit();
  };

  // Couleur de la jauge d'équilibre
  const getBalanceColor = () => {
    if (balance > 70) return '#22c55e';
    if (balance > 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="relative" ref={gameRef}>
      {/* Écran d'intro */}
      <AnimatePresence>
        {gameState === 'intro' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <span className="text-6xl block mb-4">🌊</span>
            <h2 className="text-2xl font-bold text-white mb-4">Le Messager du Ki</h2>
            <p className="text-slate-300 mb-6 max-w-md mx-auto">
              Traverse le dojo sans perdre ton équilibre. 
              <br/>Si tu vas trop vite, tu vacilleras !
              <br/><br/>
              <strong>🎮 Contrôles :</strong>
              <br/>Flèches ou ZQSD pour te déplacer
              <br/>ESPACE pour respirer et te calmer
            </p>
            <Button 
              onClick={startGame}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-3"
            >
              Commencer
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zone de jeu */}
      {gameState === 'playing' && (
        <div className="relative">
          {/* Jauges */}
          <div className="flex justify-between items-center mb-3">
            {/* Équilibre */}
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">⚖️ Équilibre</span>
              <div className="w-32 h-4 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: getBalanceColor() }}
                  animate={{ width: `${balance}%` }}
                />
              </div>
              <span className="text-white text-sm font-bold">{Math.round(balance)}%</span>
            </div>
            
            {/* Indicateur de respiration + Bouton voix */}
            <div className="flex items-center gap-3">
              {isBreathing && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex items-center gap-1 text-cyan-400"
                >
                  <Wind className="w-5 h-5" />
                  <span className="text-sm">Respiration...</span>
                </motion.div>
              )}
              
              {/* Bouton voix TTS */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={voiceEnabled ? "text-cyan-400" : "text-slate-500"}
                title={voiceEnabled ? "Désactiver la voix" : "Activer la voix"}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>
            
            {/* Bouton quitter */}
            <Button variant="ghost" size="sm" onClick={handleExit} className="text-slate-400">
              <X className="w-4 h-4 mr-1" /> Quitter
            </Button>
          </div>

          {/* Canvas du jeu */}
          <svg 
            width={GAME_WIDTH} 
            height={GAME_HEIGHT} 
            className="bg-gradient-to-b from-amber-900/30 to-slate-800 rounded-xl border border-amber-500/30 mx-auto"
          >
            {/* Sol du dojo (tatami) */}
            <defs>
              <pattern id="tatami" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect width="40" height="40" fill="#78716c" />
                <rect x="0" y="0" width="20" height="40" fill="#8b8279" />
              </pattern>
            </defs>
            <rect width={GAME_WIDTH} height={GAME_HEIGHT} fill="url(#tatami)" opacity={0.3} />
            
            {/* Sortie */}
            <ExitGate x={GAME_WIDTH / 2} y={EXIT_Y} />
            
            {/* Obstacles */}
            <AnimatePresence>
              {obstacles.map(ob => (
                <Obstacle key={ob.id} {...ob} />
              ))}
            </AnimatePresence>
            
            {/* Avatar du joueur */}
            <NinjaAvatar 
              x={position.x} 
              y={position.y} 
              balance={balance}
              isBreathing={isBreathing}
            />
            
            {/* Départ */}
            <text x={GAME_WIDTH / 2} y={GAME_HEIGHT - 15} textAnchor="middle" fill="#94a3b8" fontSize={12}>
              DÉPART
            </text>
          </svg>

          {/* Contrôles tactiles (mobile) */}
          <div className="flex justify-center gap-4 mt-4 md:hidden">
            <div className="grid grid-cols-3 gap-1">
              <div></div>
              <Button 
                size="sm" 
                className="bg-slate-700"
                onTouchStart={() => setPosition(p => ({ ...p, y: Math.max(30, p.y - MOVE_STEP) }))}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
              <div></div>
              <Button 
                size="sm" 
                className="bg-slate-700"
                onTouchStart={() => setPosition(p => ({ ...p, x: Math.max(30, p.x - MOVE_STEP) }))}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                className="bg-cyan-600"
                onTouchStart={() => setIsBreathing(true)}
                onTouchEnd={() => setIsBreathing(false)}
              >
                <Wind className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                className="bg-slate-700"
                onTouchStart={() => setPosition(p => ({ ...p, x: Math.min(GAME_WIDTH - 30, p.x + MOVE_STEP) }))}
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
              <div></div>
              <Button 
                size="sm" 
                className="bg-slate-700"
                onTouchStart={() => setPosition(p => ({ ...p, y: Math.min(GAME_HEIGHT - 30, p.y + MOVE_STEP) }))}
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
            </div>
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
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: 3, duration: 0.5 }}
            >
              👏
            </motion.span>
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">Bravo ! Tu as terminé cette étape 👏</h2>
            <p className="text-slate-300 mb-4">Tu peux continuer ou rejouer pour t'entraîner encore.</p>
            
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6 inline-block">
              <p className="text-amber-400 text-3xl font-bold">{score} points</p>
              <p className="text-cyan-400">+{Math.round(score / 10)} Ki</p>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button onClick={restartGame} variant="outline" className="text-white border-white/30">
                <RotateCcw className="w-4 h-4 mr-2" /> Rejouer cette étape
              </Button>
              <Button 
                onClick={() => onComplete(score, Math.round(score / 10))}
                className="bg-gradient-to-r from-emerald-500 to-teal-600"
              >
                Continuer
              </Button>
            </div>
            <p className="text-slate-500 text-xs mt-3">Tu peux recommencer pour t'entraîner encore.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Écran de fin - Tu peux recommencer */}
      <AnimatePresence>
        {gameState === 'fail' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <span className="text-6xl block mb-4">💪</span>
            <h2 className="text-2xl font-bold text-amber-400 mb-2">Continue comme ça !</h2>
            <p className="text-slate-300 mb-6">
              Tu peux recommencer pour t'entraîner encore.<br/>
              <em className="text-cyan-400">"Chaque essai te fait progresser"</em>
            </p>
            
            <div className="flex justify-center gap-4">
              <Button onClick={restartGame} className="bg-gradient-to-r from-cyan-500 to-blue-600">
                <RotateCcw className="w-4 h-4 mr-2" /> Rejouer cette étape
              </Button>
              <Button onClick={onExit} variant="outline" className="text-white border-white/30">
                Quitter
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessagerDuKi;
