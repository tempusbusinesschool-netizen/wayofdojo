/**
 * 🎴 MEMORY DU SENSEI - Mémoire visuelle
 * 
 * Jeu de memory avec les techniques d'Aïkido
 * Associer les images avec leurs noms japonais
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, RotateCcw, Volume2, VolumeX, Clock } from 'lucide-react';
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
  { id: 'tenchinage', name: 'Tenchi Nage', kanji: '天地投', emoji: '⬆️', desc: 'Projection ciel-terre' },
];

interface Card {
  id: string;
  name: string;
  kanji: string;
  emoji: string;
  desc: string;
  type: 'image' | 'name';
  pairId: string;
  cardId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

const GAME_DURATION = 120;

interface MemorySenseiProps {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (message: string) => void;
}

const MemorySensei: React.FC<MemorySenseiProps> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'success' | 'fail'>('intro');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [combo, setCombo] = useState(0);

  const tanakaVoice = useCallback((message: string) => {
    if (soundEnabled) speak(message);
    if (tanakaSpeak) tanakaSpeak(message);
  }, [soundEnabled, speak, tanakaSpeak]);

  const initializeCards = () => {
    const cardPairs = TECHNIQUE_CARDS.flatMap(tech => [
      { ...tech, type: 'image' as const, pairId: tech.id },
      { ...tech, type: 'name' as const, pairId: tech.id }
    ]);

    const shuffled = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, cardId: index, isFlipped: false, isMatched: false }));

    setCards(shuffled);
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setMoves(0);
    setTimeLeft(GAME_DURATION);
    setCombo(0);
    setMatchedPairs([]);
    setFlippedCards([]);
    initializeCards();
    tanakaVoice("Trouve les paires : image et nom japonais.");
  };

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

  const flipCard = (cardId: number) => {
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

  const checkMatch = (flipped: number[]) => {
    const [first, second] = flipped;
    const card1 = cards[first];
    const card2 = cards[second];

    if (card1.pairId === card2.pairId && card1.type !== card2.type) {
      setTimeout(() => {
        setMatchedPairs(prev => [...prev, card1.pairId]);
        setFlippedCards([]);
        setScore(s => s + (50 * (combo + 1)));
        setCombo(c => c + 1);

        if (combo > 0 && combo % 2 === 0) {
          tanakaVoice("Bien joué !");
        }

        if (matchedPairs.length + 1 >= TECHNIQUE_CARDS.length) {
          setTimeout(() => endGame(true), 500);
        }
      }, 500);
    } else {
      setTimeout(() => {
        setFlippedCards([]);
        setCombo(0);
      }, 1000);
    }
  };

  const endGame = (success: boolean) => {
    setGameState(success ? 'success' : 'fail');
    const finalScore = success ? score + (timeLeft * 2) : Math.floor(score / 2);
    const kiEarned = success ? 15 + Math.floor(finalScore / 50) : 5;
    
    if (success) {
      tanakaVoice(`Bravo ${userName} ! Tu as trouvé toutes les paires !`);
    } else {
      tanakaVoice("Le temps est écoulé. Essaie encore !");
    }
    
    setTimeout(() => {
      onComplete(finalScore, kiEarned);
    }, 2500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-[400px]" data-testid="memory-sensei-game">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <span className="text-3xl">🎴</span>
          <div>
            <h3 className="text-white font-bold">Memory du Sensei</h3>
            <p className="text-slate-400 text-sm">Associe les techniques à leurs noms</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>
          <button onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Intro Screen */}
      {gameState === 'intro' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <span className="text-6xl block mb-4">🎴</span>
          <h2 className="text-2xl font-bold text-white mb-4">Memory du Sensei</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">
            Retourne les cartes et associe chaque technique d'Aïkido avec son nom japonais. 
            Tu as {Math.floor(GAME_DURATION / 60)} minutes !
          </p>
          <Button onClick={startGame} className="bg-gradient-to-r from-red-500 to-rose-600" data-testid="start-memory-btn">
            Commencer
          </Button>
        </motion.div>
      )}

      {/* Game Board */}
      {gameState === 'playing' && (
        <div>
          {/* Stats */}
          <div className="flex justify-center gap-6 mb-4">
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className={`font-bold ${timeLeft < 30 ? 'text-red-400' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="bg-slate-800 px-3 py-1 rounded-full">
              <span className="text-amber-400 font-bold">⭐ {score}</span>
            </div>
            <div className="bg-slate-800 px-3 py-1 rounded-full">
              <span className="text-cyan-400 font-bold">🎯 {matchedPairs.length}/{TECHNIQUE_CARDS.length}</span>
            </div>
            {combo > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 rounded-full"
              >
                <span className="text-white font-bold">🔥 x{combo}</span>
              </motion.div>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto">
            {cards.map((card) => {
              const isFlipped = flippedCards.includes(card.cardId) || matchedPairs.includes(card.pairId);
              
              return (
                <motion.button
                  key={card.cardId}
                  onClick={() => flipCard(card.cardId)}
                  whileHover={{ scale: isFlipped ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    aspect-square rounded-xl p-2 transition-all
                    ${isFlipped 
                      ? matchedPairs.includes(card.pairId)
                        ? 'bg-emerald-600'
                        : 'bg-amber-600'
                      : 'bg-slate-700 hover:bg-slate-600 cursor-pointer'
                    }
                  `}
                  data-testid={`card-${card.cardId}`}
                >
                  <AnimatePresence mode="wait">
                    {isFlipped ? (
                      <motion.div
                        key="front"
                        initial={{ rotateY: 90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: 90 }}
                        className="h-full flex flex-col items-center justify-center"
                      >
                        {card.type === 'image' ? (
                          <>
                            <span className="text-2xl">{card.emoji}</span>
                            <span className="text-lg text-white">{card.kanji}</span>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-white text-center">{card.name}</span>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="back"
                        initial={{ rotateY: -90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: -90 }}
                        className="h-full flex items-center justify-center"
                      >
                        <span className="text-2xl">🥋</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Success Screen */}
      {gameState === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <span className="text-6xl block mb-4">🎉</span>
          <h2 className="text-2xl font-bold text-emerald-400 mb-2">Félicitations !</h2>
          <p className="text-white text-xl mb-4">Score : {score + (timeLeft * 2)} points</p>
          <p className="text-slate-400">Tu as trouvé toutes les paires en {moves} coups !</p>
        </motion.div>
      )}

      {/* Fail Screen */}
      {gameState === 'fail' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <span className="text-6xl block mb-4">⏰</span>
          <h2 className="text-2xl font-bold text-amber-400 mb-2">Temps écoulé !</h2>
          <p className="text-white text-xl mb-4">Score : {Math.floor(score / 2)} points</p>
          <p className="text-slate-400">Tu as trouvé {matchedPairs.length}/{TECHNIQUE_CARDS.length} paires.</p>
        </motion.div>
      )}
    </div>
  );
};

export default MemorySensei;
