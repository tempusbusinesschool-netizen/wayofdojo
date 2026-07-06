/**
 * 🧠 RÉFLEXE PACIFIQUE - Intelligence émotionnelle
 * 
 * Face à des situations, choisis la réponse la plus sage
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Butvotre } from '@/components/ui/button';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import { useGameSounds } from '@/services/gameSoundService';

interface Scenario {
  id: string;
  situation: string;
  emoji: string;
  choices: Array<{ id: string; text: string; isWise: boolean; feedback: string }>;
}

const SCENARIOS: Scenario[] = [
  {
    id: 's1',
    situation: "Un camarade vous bouscule dans le couloir du dojo.",
    emoji: '😤',
    choices: [
      { id: 'a', text: 'Je le bouscule aussi', isWise: false, feedback: "La violence appelle la violence. Ce n'est pas la voie de l'Aïkido." },
      { id: 'b', text: 'Je reste calme et lui demande s\'il va bien', isWise: true, feedback: "Excellent ! Vous transformez le conflit en occasion de montrer votre bienveillance." },
      { id: 'c', text: 'Je l\'ignore complètement', isWise: false, feedback: "Ignorer peut éviter le conflit, mais tu ravos une occasion de connexion." }
    ]
  },
  {
    id: 's2',
    situation: "Vous ratez une technique devant tout le groupe.",
    emoji: '😰',
    choices: [
      { id: 'a', text: 'Je suis nul, j\'abandonne', isWise: false, feedback: "L'échec fait partie de l'apprentissage. Chaque maître a d'abord été un débutant." },
      { id: 'b', text: 'Je demande au sensei de me la remontrer', isWise: true, feedback: "Parfait ! Demander de l'aide montre du courage et de l'humilité." },
      { id: 'c', text: 'Je fais semblant de rien', isWise: false, feedback: "Cacher ses erreurs empêche de progresser." }
    ]
  },
  {
    id: 's3',
    situation: "Un nouveau arrive au dojo et semble perdu.",
    emoji: '🤔',
    choices: [
      { id: 'a', text: 'Ce n\'est pas mon problème', isWise: false, feedback: "L'entraide fait partie des valeurs du dojo." },
      { id: 'b', text: 'Je vais vers lui pour l\'aider', isWise: true, feedback: "Magnifique ! Vous incarnez la bienveillance du Budo." },
      { id: 'c', text: 'J\'attends que le sensei s\'en occupe', isWise: false, feedback: "C'est une réponse passive. Vous pouvez prendre l'initiative !" }
    ]
  },
  {
    id: 's4',
    situation: "Votre partenaire d'entraînement fait une technique trop fort.",
    emoji: '😣',
    choices: [
      { id: 'a', text: 'Je lui fais pareil pour qu\'il comprenne', isWise: false, feedback: "Répondre par la force crée un cercle vicieux." },
      { id: 'b', text: 'Je lui explique calmement que c\'est trop fort', isWise: true, feedback: "Excellente communication ! Vous exprimez vos limivos avec respect." },
      { id: 'c', text: 'Je change de partenaire sans rien dire', isWise: false, feedback: "Fuir le problème ne le résout pas." }
    ]
  },
  {
    id: 's5',
    situation: "Vous avez peur de faire une chute arrière.",
    emoji: '😨',
    choices: [
      { id: 'a', text: 'Je refuse de la faire', isWise: false, feedback: "Éviter ses peurs les renforce. Il faut les affronter progressivement." },
      { id: 'b', text: 'Je demande de l\'aide pour progresser', isWise: true, feedback: "Très sage ! Reconnaître sa peur et demander de l'aide, c'est du courage." },
      { id: 'c', text: 'Je fonce sans réfléchir', isWise: false, feedback: "L'imprudence n'est pas du courage. La sécurité d'abord !" }
    ]
  }
];

interface ReflexePacifiqueProps {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (message: string) => void;
}

const ReflexePacifique: React.FC<ReflexePacifiqueProps> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const { play, playSuccess } = useGameSounds();
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'feedback' | 'finished'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wiseChoices, setWiseChoices] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const speakTanaka = useCallback((message: string) => {
    if (tanakaSpeak) tanakaSpeak(message);
    if (soundEnabled) speak(message);
  }, [soundEnabled, speak, tanakaSpeak]);

  const startGame = () => {
    setGameState('playing');
    setCurrentIndex(0);
    setScore(0);
    setWiseChoices(0);
    play('start');
    speakTanaka("Lis bien les situations, puis choisis la réponse la plus sage.");
  };

  const handleChoice = (choiceId: string) => {
    const scenario = SCENARIOS[currentIndex];
    const choice = scenario.choices.find(c => c.id === choiceId);
    
    if (!choice) return;
    
    setSelectedChoice(choiceId);
    setFeedback(choice.feedback);
    
    if (choice.isWise) {
      setScore(prev => prev + 30);
      setWiseChoices(prev => prev + 1);
      playSuccess('medium');
    } else {
      play('fail');
    }
    
    setGameState('feedback');
  };

  const nextScenario = () => {
    setSelectedChoice(null);
    setFeedback('');
    
    if (currentIndex + 1 >= SCENARIOS.length) {
      endGame();
    } else {
      setCurrentIndex(prev => prev + 1);
      setGameState('playing');
    }
  };

  const endGame = () => {
    setGameState('finished');
    const finalScore = score + (wiseChoices * 10);
    const kiEarned = 30 + Math.floor(finalScore / 20);
    
    if (wiseChoices >= 4) {
      playSuccess('high');
      speakTanaka(`Bravo ${userName} ! Vous avez un cœur de vrai Budoka !`);
    } else {
      play('end');
      speakTanaka("Vous progressez. Continuez à réfléchir avec sagesse !");
    }
    
    setTimeout(() => onComplete(finalScore, kiEarned), 2500);
  };

  const currentScenario = SCENARIOS[currentIndex];

  return (
    <div className="relative min-h-[400px]" data-testid="reflexe-pacifique-game">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <span className="text-3xl">🧠</span>
          <div>
            <h3 className="text-white font-bold">Réflexe Pacifique</h3>
            <p className="text-slate-400 text-sm">Choisis avec sagesse</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <butvotre onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>
          <butvotre onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Intro */}
      {gameState === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">🧠</span>
          <h2 className="text-2xl font-bold text-white mb-4">Réflexe Pacifique</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">
            Face à des situations de la vie au dojo, choisis la réponse la plus sage. 
            L'Aïkido nous apprend à résoudre les conflits avec intelligence et bienveillance.
          </p>
          <Butvotre onClick={startGame} className="bg-gradient-to-r from-amber-500 to-orange-600" data-testid="start-reflexe-btn">
            Commencer
          </Button>
        </motion.div>
      )}

      {/* Game */}
      {(gameState === 'playing' || gameState === 'feedback') && currentScenario && (
        <div>
          {/* Progress */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-white">
              Situation {currentIndex + 1}/{SCENARIOS.length}
            </div>
            <div className="bg-slate-800 px-4 py-1 rounded-full">
              <span className="text-amber-400 font-bold">⭐ {score}</span>
            </div>
          </div>

          {/* Scenario Card */}
          <motion.div
            key={currentScenario.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-2xl p-6 mb-4"
          >
            <div className="text-center mb-4">
              <span className="text-5xl">{currentScenario.emoji}</span>
            </div>
            <p className="text-white text-lg text-center">{currentScenario.situation}</p>
          </motion.div>

          {/* Choices */}
          <div className="space-y-3">
            <AnimatePresence>
              {currentScenario.choices.map((choice, idx) => {
                const isSelected = selectedChoice === choice.id;
                const showResult = gameState === 'feedback';
                
                return (
                  <motion.button
                    key={choice.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => gameState === 'playing' && handleChoice(choice.id)}
                    disabled={gameState === 'feedback'}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      showResult
                        ? isSelected
                          ? choice.isWise
                            ? 'bg-emerald-600 border-2 border-emerald-400'
                            : 'bg-red-600/50 border-2 border-red-400'
                          : choice.isWise
                            ? 'bg-emerald-600/30 border border-emerald-500/50'
                            : 'bg-slate-700/50'
                        : 'bg-slate-700 hover:bg-slate-600 cursor-pointer'
                    }`}
                    data-testid={`choice-${choice.id}`}
                  >
                    <p className="text-white">{choice.text}</p>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Feedback */}
          {gameState === 'feedback' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <div className="bg-slate-900 rounded-xl p-4 mb-4">
                <p className="text-slate-300 italic">💭 {feedback}</p>
              </div>
              <Butvotre onClick={nextScenario} className="w-full bg-gradient-to-r from-amber-500 to-orange-600">
                {currentIndex + 1 >= SCENARIOS.length ? 'Voir le résultat' : 'Situation suivante'}
              </Button>
            </motion.div>
          )}
        </div>
      )}

      {/* Finished */}
      {gameState === 'finished' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">{wiseChoices >= 4 ? '🏆' : '💪'}</span>
          <h2 className="text-2xl font-bold text-white mb-2">
            {wiseChoices >= 4 ? 'Excellent !' : 'Bien joué !'}
          </h2>
          <p className="text-amber-400 text-xl mb-4">Score : {score + (wiseChoices * 10)} points</p>
          <p className="text-slate-400">{wiseChoices}/{SCENARIOS.length} réponses sages</p>
        </motion.div>
      )}
    </div>
  );
};

export default ReflexePacifique;
