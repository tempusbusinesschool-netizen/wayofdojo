/**
 * 🎴 MEMORY DU SENSEI - Mémoire visuelle
 * 
 * Jeu de memory avec les techniques d'Aïkido
 * Associer les images avec leurs noms japonais
 * Développe: Mémoire, Concentration, Vocabulaire
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, RotateCcw, Volume2, VolumeX, Brain, Clock } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';

// Cartes du jeu (techniques d'Aïkido)
const TECHNIQUE_CARDS = [
  { id: 'ikkyo', name: 'Ikkyo', kanji: '一教', emoji: '1️⃣', desc: '1ère immobilisation' },
  { id: 'nikyo', name: 'Nikyo', kanji: '二教', emoji: '2️⃣', desc: '2e immobilisation' },
  { id: 'sankyo', name: 'Sankyo', kanji: '三教', emoji: '3️⃣', desc: '3e immobilisation' },
  { id: 'yonkyo', name: 'Yonkyo', kanji: '四教', emoji: '4️⃣', desc: '4e immobilisation' },
  { id: 'iriminage', name: 'Irimi Nage', kanji: '入身投', emoji: '🌀', desc: 'Projection en entrant' },
  { id: 'shihonage', name: 'Shiho Nage', kanji: '四方投', emoji: '🔄', desc: 'Projection 4 directions' },
  { id: 'kotegaeshi', name: 'Kote Gaeshi', kanji: '小手返', emoji: '🤚', desc: 'Retournement du poignet' },
  { id: 'tenchinage', name: 'Tenchi Nage', kanji: '天地投', emoji: '⬆️⬇️', desc: 'Projection ciel-terre' },
];

const GRID_SIZE = 4; // 4x4 = 16 cartes (8 paires)
const GAME_DURATION = 120; // secondes

const MemorySensei = ({ userName, onComplete, onExit, tanakaSpeak }) => {
  const { speak, speaking } = useTanakaVoice();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameState, setGameState] = useState('intro');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [combo, setCombo] = useState(0);
  const [lastMatch, setLastMatch] = useState(null);

  // Parler avec Tanaka
  const tanakaVoice = useCallback((message) => {
    if (soundEnabled) {
      speak(message);
    }
    if (tanakaSpeak) {
      tanakaSpeak(message);
    }
  }, [soundEnabled, speak, tanakaSpeak]);

  // Initialiser les cartes
  const initializeCards = () => {
    // Créer les paires (image + nom)
    const cardPairs = TECHNIQUE_CARDS.flatMap(tech => [
      { ...tech, type: 'image', pairId: tech.id },
      { ...tech, type: 'name', pairId: tech.id }
    ]);

    // Mélanger
    const shuffled = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, cardId: index, isFlipped: false, isMatched: false }));

    setCards(shuffled);
  };

  // Démarrer le jeu
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setMoves(0);
    setTimeLeft(GAME_DURATION);
    setCombo(0);
    setMatchedPairs([]);
    setFlippedCards([]);
    initializeCards();
    tanakaVoice("Un bon aikidoka connaît le nom de toutes les techniques ! Trouve les paires : image et nom japonais !");
  };

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Retourner une carte
  const flipCard = (cardId) => {
    if (gameState !== 'playing') return;
    if (flippedCards.length >= 2) return;
    if (flippedCards.includes(cardId)) return;
    if (matchedPairs.some(pair => cards[cardId].pairId === pair)) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      checkMatch(newFlipped);
    }
  };

  // Vérifier si c'est une paire
  const checkMatch = (flipped) => {
    const [first, second] = flipped;
    const card1 = cards[first];
    const card2 = cards[second];

    if (card1.pairId === card2.pairId && card1.type !== card2.type) {
      // Paire trouvée !
      setTimeout(() => {
        setMatchedPairs(prev => [...prev, card1.pairId]);
        setFlippedCards([]);
        setScore(s => s + (50 * (combo + 1)));
        setCombo(c => c + 1);
        setLastMatch(card1);

        // Message de Tanaka
        if (combo > 0 && combo % 2 === 0) {
          tanakaVoice(`${card1.name} ! Excellent ! Tu connais bien tes techniques !`);
        }

        // Vérifier si toutes les paires sont trouvées
        if (matchedPairs.length + 1 >= TECHNIQUE_CARDS.length) {
          setTimeout(() => endGame(true), 500);
        }
      }, 500);
    } else {
      // Pas une paire
      setTimeout(() => {
        setFlippedCards([]);
        setCombo(0);
      }, 1000);
    }
  };

  // Fin du jeu
  const endGame = (success) => {
    setGameState('finished');
    const timeBonus = success ? Math.floor(timeLeft * 2) : 0;
    const finalScore = score + timeBonus;
    const kiEarned = Math.floor(finalScore / 25);

    if (success) {
      tanakaVoice("Bravo ! Tu as retrouvé toutes les techniques ! Ta mémoire est excellente !");
    } else {
      tanakaVoice("Le temps est écoulé. Continue de pratiquer pour mieux mémoriser les techniques !");
    }

    setTimeout(() => onComplete(finalScore, kiEarned), 3000);
  };

  // Rendu d'une carte
  const renderCard = (card) => {
    const isFlipped = flippedCards.includes(card.cardId);
    const isMatched = matchedPairs.includes(card.pairId);

    return (
      <motion.div
        key={card.cardId}
        className={`
          relative aspect-square cursor-pointer
          ${isMatched ? 'opacity-50' : ''}
        `}
        onClick={() => !isFlipped && !isMatched && flipCard(card.cardId)}
        whileHover={!isFlipped && !isMatched ? { scale: 1.05 } : {}}
        whileTap={!isFlipped && !isMatched ? { scale: 0.95 } : {}}
      >
        <motion.div
          className="absolute inset-0 rounded-xl"
          initial={false}
          animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Face cachée */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center border-2 border-red-400"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-3xl">🥋</span>
          </div>

          {/* Face visible */}
          <div 
            className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center p-2 border-2 ${
              card.type === 'image' 
                ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-cyan-400' 
                : 'bg-gradient-to-br from-amber-600 to-orange-700 border-amber-400'
            }`}
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {card.type === 'image' ? (
              <>
                <span className="text-4xl mb-1">{card.emoji}</span>
                <span className="text-xs text-slate-400">{card.desc}</span>
              </>
            ) : (
              <>
                <span className="text-lg font-bold text-white">{card.name}</span>
                <span className="text-2xl">{card.kanji}</span>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
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
            <span className="text-2xl font-bold text-red-400">{score}</span>
            <span className="text-slate-400 ml-2">points</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {combo > 1 && (
            <div className="bg-emerald-500/20 px-3 py-1 rounded-full">
              <span className="text-emerald-400 font-bold">🔥 x{combo}</span>
            </div>
          )}
          <div className="bg-slate-700 px-3 py-1 rounded-full">
            <span className="text-slate-300">📊 {moves} coups</span>
          </div>
          <div className="bg-amber-500/20 px-4 py-2 rounded-full">
            <span className="text-amber-400 font-bold">⏱️ {timeLeft}s</span>
          </div>
        </div>
        
        <button onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Zone de jeu */}
      <div 
        className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border-2 border-red-500/30"
        style={{ width: 550, height: 450 }}
      >
        {gameState === 'intro' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 rounded-2xl"
          >
            <span className="text-6xl mb-4">🎴</span>
            <h2 className="text-2xl font-bold text-white mb-2">Memory du Sensei</h2>
            <p className="text-slate-300 text-center mb-4 max-w-md px-4">
              Associe chaque technique d'Aïkido avec son nom japonais !<br/>
              <span className="text-cyan-400">Images</span> ↔ <span className="text-amber-400">Noms</span>
            </p>
            <div className="flex flex-wrap gap-2 mb-6 justify-center max-w-sm">
              {TECHNIQUE_CARDS.slice(0, 4).map(t => (
                <div key={t.id} className="bg-slate-700 px-2 py-1 rounded text-xs text-white">
                  {t.emoji} {t.name}
                </div>
              ))}
            </div>
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-red-500 to-orange-600 hover:opacity-90 text-white font-bold px-8 py-3"
            >
              <Brain className="w-5 h-5 mr-2" />
              Commencer !
            </Button>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 rounded-2xl"
          >
            <span className="text-6xl mb-4">👏</span>
            <h2 className="text-3xl font-bold text-white mb-2">Bravo ! Tu as terminé cette étape 👏</h2>
            <p className="text-slate-300 mb-4">Tu peux continuer ou rejouer pour t'entraîner encore.</p>
            <p className="text-slate-400 mb-2">{matchedPairs.length}/{TECHNIQUE_CARDS.length} paires trouvées</p>
            <p className="text-4xl font-bold text-red-400 mb-2">{score} points</p>
            <p className="text-cyan-400 mb-4">+{Math.floor(score / 25)} Ki</p>
            <div className="flex gap-3">
              <Button onClick={restartGame} variant="outline" className="text-white border-white/30">
                <RotateCcw className="w-4 h-4 mr-2" /> Rejouer cette étape
              </Button>
              <Button 
                onClick={() => onComplete(score, Math.floor(score / 25))}
                className="bg-gradient-to-r from-emerald-500 to-teal-600"
              >
                Continuer
              </Button>
            </div>
            <p className="text-slate-500 text-xs mt-3">Tu peux recommencer pour t'entraîner encore.</p>
          </motion.div>
        )}

        {/* Grille de cartes */}
        {gameState === 'playing' && (
          <div className="grid grid-cols-4 gap-2 h-full">
            {cards.map(renderCard)}
          </div>
        )}

        {/* Indicateur de paires trouvées */}
        {gameState === 'playing' && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1">
            {TECHNIQUE_CARDS.map(t => (
              <div
                key={t.id}
                className={`w-3 h-3 rounded-full ${
                  matchedPairs.includes(t.id) ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        )}

        {/* Dernière paire trouvée */}
        <AnimatePresence>
          {lastMatch && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-emerald-500 px-4 py-2 rounded-full"
              onAnimationComplete={() => setTimeout(() => setLastMatch(null), 1000)}
            >
              <span className="text-white font-bold">✨ {lastMatch.name} ! +50</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      {gameState === 'playing' && (
        <div className="mt-4 text-center">
          <p className="text-slate-400 text-sm">
            Clique sur les cartes pour les retourner et trouve les paires !
          </p>
        </div>
      )}
    </div>
  );
};

export default MemorySensei;
