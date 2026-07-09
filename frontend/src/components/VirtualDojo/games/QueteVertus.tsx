/**
 * 🛡️ QUÊTE DES 7 VERTUS - Valeurs du Budo
 * 
 * Collecter les 7 vertus en résolvant des énigmes morales
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX, CheckCircle2 } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import { useGameSounds } from '@/services/gameSoundService';

interface Virtue {
  id: string;
  name: string;
  kanji: string;
  emoji: string;
  question: string;
  answers: Array<{ id: string; text: string; isCorrect: boolean; feedback: string }>;
}

const VIRTUES: Virtue[] = [
  {
    id: 'respect',
    name: 'Respect',
    kanji: '礼',
    emoji: '🙏',
    question: "Au dojo, pourquoi saluons-nous avant d'entrer sur le tatami ?",
    answers: [
      { id: 'a', text: "Pour montrer qu'on est poli", isCorrect: false, feedback: "C'est vrai en partie, mais le salut va plus loin." },
      { id: 'b', text: "Pour honorer le lieu d'apprentissage et ceux qui y pratiquent", isCorrect: true, feedback: "Excellent ! Le salut exprime notre gratitude envers le dojo et tous ceux qui transmettent la connaissance." },
      { id: 'c', text: "Parce que c'est obligatoire", isCorrect: false, feedback: "Ce n'est pas qu'une règle. Le salut a une signification profonde." }
    ]
  },
  {
    id: 'courage',
    name: 'Courage',
    kanji: '勇',
    emoji: '🦁',
    question: "Vous avez peur de tomber pendant une technique. Que fait un vrai courageux ?",
    answers: [
      { id: 'a', text: "Il refuse de faire la technique", isCorrect: false, feedback: "Éviter sa peur ne la fait pas disparaître." },
      { id: 'b', text: "Il reconnaît sa peur et demande de l'aide pour progresser", isCorrect: true, feedback: "Félicitations ! Le vrai courage, c'est affronter ses peurs avec humilité et demander de l'aide." },
      { id: 'c', text: "Il fonce sans réfléchir", isCorrect: false, feedback: "C'est de l'imprudence, pas du courage !" }
    ]
  },
  {
    id: 'maitrise',
    name: 'Maîtrise',
    kanji: '支配',
    emoji: '🎯',
    question: "Comment devient-on vraiment maître d'une technique ?",
    answers: [
      { id: 'a', text: "En la faisant une seule fois parfaitement", isCorrect: false, feedback: "Une fois ne suffit pas. La maîtrise demande de la répétition." },
      { id: 'b', text: "En la pratiquant des milliers de fois jusqu'à ce qu'elle devienne naturelle", isCorrect: true, feedback: "Exactement ! Comme dit le proverbe : 'Pratique dix mille fois, et la technique devient naturelle.'" },
      { id: 'c', text: "En regardant des vidéos", isCorrect: false, feedback: "Regardezr aide, mais rien ne remplace la pratique." }
    ]
  },
  {
    id: 'humilite',
    name: 'Humilité',
    kanji: '謙遜',
    emoji: '🌱',
    question: "Un débutant vous demande de l'aide. Que fais-tu ?",
    answers: [
      { id: 'a', text: "Tu lui montres que tu es meilleur", isCorrect: false, feedback: "Ce n'est pas de l'humilité, c'est de l'orgueil." },
      { id: 'b', text: "Tu l'aides avec patience, en vous rappelant que tu étais débutant aussi", isCorrect: true, feedback: "Parfait ! L'humilité nous rappelle que nous avons tous été débutants et que nous avons tous encore à apprendre." },
      { id: 'c', text: "Tu l'ignores car ce n'est pas votre rôle", isCorrect: false, feedback: "Aider les autres fait partie de l'esprit du dojo." }
    ]
  },
  {
    id: 'bienveillance',
    name: 'Bienveillance',
    kanji: '仁',
    emoji: '💗',
    question: "Votre partenaire d'entraînement fait mal une technique. Que fais-tu ?",
    answers: [
      { id: 'a', text: "Tu vous moques de lui", isCorrect: false, feedback: "Se moquer blesse et ne fait progresser personne." },
      { id: 'b', text: "Tu l'encourages et lui proposes de recommencer ensemble", isCorrect: true, feedback: "Magnifique ! La bienveillance crée un environnement où chacun peut progresser sans crainte." },
      { id: 'c', text: "Tu changes de partenaire", isCorrect: false, feedback: "Abandonner quelqu'un n'est pas bienveillant." }
    ]
  },
  {
    id: 'attention',
    name: 'Attention',
    kanji: '注意',
    emoji: '👁️',
    question: "Pendant le cours, le sensei explique. Que fais-tu ?",
    answers: [
      { id: 'a', text: "Tu parles avec votre voisin", isCorrect: false, feedback: "Parler pendant une explication manque de respect et tu ravos des informations importantes." },
      { id: 'b', text: "Tu écouvos et observes attentivement chaque détail", isCorrect: true, feedback: "Excellent ! L'attention totale est la clé de l'apprentissage. Un bon aikidoka observe tout." },
      { id: 'c', text: "Tu penses à autre chose", isCorrect: false, feedback: "L'esprit absent rate beaucoup d'informations précieuses." }
    ]
  },
  {
    id: 'responsabilite',
    name: 'Responsabilité',
    kanji: '責任',
    emoji: '⚖️',
    question: "Après le cours, le tatami doit être rangé. Que fais-tu ?",
    answers: [
      { id: 'a', text: "Tu pars vite pour éviter le rangement", isCorrect: false, feedback: "Éviter ses responsabilités n'est pas digne d'un pratiquant." },
      { id: 'b', text: "Tu participes au rangement car c'est la responsabilité de tous", isCorrect: true, feedback: "Parfait ! Prendre soin du dojo est une responsabilité partagée qui renforce l'esprit de groupe." },
      { id: 'c', text: "Tu regardes les autres faire", isCorrect: false, feedback: "Ne pas participer quand on peut le faire, c'est manquer de responsabilité." }
    ]
  }
];

interface QueteVertusProps {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (message: string) => void;
}

const QueteVertus: React.FC<QueteVertusProps> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const { play, playSuccess } = useGameSounds();
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'feedback' | 'finished'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [collectedVirtues, setCollectedVirtues] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const speakTanaka = useCallback((message: string) => {
    if (tanakaSpeak) tanakaSpeak(message);
    if (soundEnabled) speak(message);
  }, [soundEnabled, speak, tanakaSpeak]);

  const startGame = () => {
    setGameState('playing');
    setCurrentIndex(0);
    setScore(0);
    setCollectedVirtues([]);
    play('start');
    speakTanaka("Découvre les 7 vertus du Budo en répondant aux questions.");
  };

  const handleAnswer = (answerId: string) => {
    const virtue = VIRTUES[currentIndex];
    const answer = virtue.answers.find(a => a.id === answerId);
    
    if (!answer) return;
    
    setSelectedAnswer(answerId);
    setFeedback(answer.feedback);
    
    if (answer.isCorrect) {
      setScore(prev => prev + 50);
      setCollectedVirtues(prev => [...prev, virtue.id]);
      playSuccess('medium');
    } else {
      play('fail');
    }
    
    setGameState('feedback');
  };

  const nextVirtue = () => {
    setSelectedAnswer(null);
    setFeedback('');
    
    if (currentIndex + 1 >= VIRTUES.length) {
      endGame();
    } else {
      setCurrentIndex(prev => prev + 1);
      setGameState('playing');
    }
  };

  const endGame = () => {
    setGameState('finished');
    const finalScore = score + (collectedVirtues.length * 20);
    const kiEarned = 40 + Math.floor(finalScore / 20);
    
    if (collectedVirtues.length >= 6) {
      playSuccess('high');
      speakTanaka(`Bravo ${userName} ! Vous avez collecté presque touvos les vertus !`);
    } else {
      play('end');
      speakTanaka("Vous progressez sur le chemin des vertus !");
    }
    
    setTimeout(() => onComplete(finalScore, kiEarned), 2500);
  };

  const currentVirtue = VIRTUES[currentIndex];

  return (
    <div className="relative min-h-[400px]" data-testid="quete-vertus-game">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <span className="text-3xl">🛡️</span>
          <div>
            <h3 className="text-white font-bold">Quête des 7 Vertus</h3>
            <p className="text-slate-400 text-sm">Les valeurs du Budo</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>
          <button onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Intro */}
      {gameState === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
          <span className="text-6xl block mb-4">🛡️</span>
          <h2 className="text-2xl font-bold text-white mb-4">Quête des 7 Vertus</h2>
          <p className="text-slate-300 mb-4 max-w-md mx-auto">
            Le Budo repose sur 7 vertus fondamentales. Découvre-les en répondant à des questions 
            sur la vie au dojo et les valeurs de l'Aïkido.
          </p>
          
          {/* Virtues preview */}
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {VIRTUES.map(v => (
              <span key={v.id} className="bg-slate-700 px-3 py-1 rounded-full text-sm">
                {v.emoji} {v.name}
              </span>
            ))}
          </div>
          
          <Button onClick={startGame} className="bg-gradient-to-r from-slate-600 to-slate-800" data-testid="start-quete-btn">
            Commencer la quête
          </Button>
        </motion.div>
      )}

      {/* Game */}
      {(gameState === 'playing' || gameState === 'feedback') && currentVirtue && (
        <div>
          {/* Progress & collected virtues */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-1">
              {VIRTUES.map((v, i) => (
                <div 
                  key={v.id}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    collectedVirtues.includes(v.id)
                      ? 'bg-emerald-600'
                      : i === currentIndex
                        ? 'bg-amber-600'
                        : 'bg-slate-700'
                  }`}
                >
                  {collectedVirtues.includes(v.id) ? <CheckCircle2 className="w-4 h-4" /> : v.emoji}
                </div>
              ))}
            </div>
            <div className="bg-slate-800 px-4 py-1 rounded-full">
              <span className="text-amber-400 font-bold">⭐ {score}</span>
            </div>
          </div>

          {/* Current virtue card */}
          <motion.div
            key={currentVirtue.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-2xl p-5 mb-4"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">{currentVirtue.emoji}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{currentVirtue.name}</h3>
                <p className="text-slate-400 text-lg">{currentVirtue.kanji}</p>
              </div>
            </div>
            <p className="text-white">{currentVirtue.question}</p>
          </motion.div>

          {/* Answers */}
          <div className="space-y-2">
            {currentVirtue.answers.map((answer, idx) => {
              const isSelected = selectedAnswer === answer.id;
              const showResult = gameState === 'feedback';
              
              return (
                <motion.button
                  key={answer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => gameState === 'playing' && handleAnswer(answer.id)}
                  disabled={gameState === 'feedback'}
                  className={`w-full p-3 rounded-xl text-left transition-all text-sm ${
                    showResult
                      ? isSelected
                        ? answer.isCorrect
                          ? 'bg-emerald-600 border-2 border-emerald-400'
                          : 'bg-red-600/50 border-2 border-red-400'
                        : answer.isCorrect
                          ? 'bg-emerald-600/30 border border-emerald-500/50'
                          : 'bg-slate-700/50'
                      : 'bg-slate-700 hover:bg-slate-600 cursor-pointer'
                  }`}
                >
                  <p className="text-white">{answer.text}</p>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          {gameState === 'feedback' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <div className="bg-slate-900 rounded-xl p-3 mb-4">
                <p className="text-slate-300 text-sm italic">💭 {feedback}</p>
              </div>
              <Button onClick={nextVirtue} className="w-full bg-gradient-to-r from-slate-600 to-slate-800">
                {currentIndex + 1 >= VIRTUES.length ? 'Terminer la quête' : 'Vertu suivante'}
              </Button>
            </motion.div>
          )}
        </div>
      )}

      {/* Finished */}
      {gameState === 'finished' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
          <span className="text-6xl block mb-4">{collectedVirtues.length >= 6 ? '🏆' : '🛡️'}</span>
          <h2 className="text-2xl font-bold text-white mb-2">
            {collectedVirtues.length >= 6 ? 'Maître des Vertus !' : 'Quête terminée !'}
          </h2>
          <p className="text-amber-400 text-xl mb-4">Score : {score + (collectedVirtues.length * 20)} points</p>
          
          {/* Collected virtues */}
          <div className="flex justify-center gap-2 flex-wrap mb-4">
            {VIRTUES.map(v => (
              <span 
                key={v.id}
                className={`px-3 py-1 rounded-full text-sm ${
                  collectedVirtues.includes(v.id)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {v.emoji} {v.name}
              </span>
            ))}
          </div>
          
          <p className="text-slate-400">{collectedVirtues.length}/7 vertus collectées</p>
        </motion.div>
      )}
    </div>
  );
};

export default QueteVertus;
