'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle2, XCircle, ChevronRight, Award, 
  RotateCcw, Trophy, BookOpen, Clock, Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import type { QuizGrade } from '@/data/aikido/grades/quiz-grades';

// ⚠️ IMAGE OFFICIELLE DE TANAKA - VERROUILLÉE
const TANAKA_IMAGE = "/images/tanaka/portrait.png";

interface QuizModalProps {
  quiz: QuizGrade;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (score: number, passed: boolean) => void;
}

type QuizState = 'intro' | 'question' | 'feedback' | 'results';

const CATEGORY_COLORS: Record<string, string> = {
  vocabulaire: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  histoire: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  etiquette: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  techniques: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  philosophie: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const CATEGORY_LABELS: Record<string, string> = {
  vocabulaire: 'Vocabulaire',
  histoire: 'Histoire',
  etiquette: 'Étiquette',
  techniques: 'Techniques',
  philosophie: 'Philosophie',
};

export const QuizModal: React.FC<QuizModalProps> = ({
  quiz,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [state, setState] = useState<QuizState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; correct: boolean; points: number }[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  // Mélanger les questions une fois au début
  const shuffledQuestions = useMemo(() => {
    return [...quiz.questions].sort(() => Math.random() - 0.5);
  }, [quiz.questions]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const totalQuestions = shuffledQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Calcul du score
  const score = useMemo(() => {
    const totalPoints = answers.reduce((sum, a) => sum + (a.correct ? a.points : 0), 0);
    const maxPoints = shuffledQuestions.reduce((sum, q) => sum + q.points, 0);
    return Math.round((totalPoints / maxPoints) * 100);
  }, [answers, shuffledQuestions]);

  const passed = score >= quiz.passingScore;

  // Effet confetti pour réussite
  const triggerSuccessConfetti = useCallback(() => {
    const colors = ['#FFD700', '#FFA500', '#00FF00', '#00FFFF', '#FF69B4'];
    
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: colors,
    });

    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });
    }, 200);
  }, []);

  // Sélectionner une réponse
  const handleSelectAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // Déjà répondu
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    setAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      correct: isCorrect,
      points: currentQuestion.points,
    }]);
    
    setShowExplanation(true);
    setState('feedback');
  };

  // Passer à la question suivante
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setState('question');
    } else {
      // Quiz terminé
      setState('results');
      if (score >= quiz.passingScore) {
        triggerSuccessConfetti();
      }
      onComplete?.(score, passed);
    }
  };

  // Recommencer le quiz
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowExplanation(false);
    setState('intro');
  };

  // Fermer le quiz
  const handleClose = () => {
    handleRestart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-700 shadow-2xl"
          data-testid="quiz-modal"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{quiz.gradeName}</h2>
                <p className="text-amber-200 text-xs">Quiz de connaissances</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ÉCRAN INTRO */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {state === 'intro' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <img 
                  src={TANAKA_IMAGE}
                  alt="Maître Tanaka"
                  className="w-24 h-24 rounded-2xl object-cover mx-auto border-4 border-amber-500/30"
                />
                
                <div>
                  <h3 className="text-xl font-bold text-white">Prêt à tester tes connaissances ?</h3>
                  <p className="text-slate-400 mt-2">{quiz.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                    <Target className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                    <p className="text-white font-bold">{totalQuestions}</p>
                    <p className="text-slate-500 text-xs">Questions</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                    <Award className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                    <p className="text-white font-bold">{quiz.passingScore}%</p>
                    <p className="text-slate-500 text-xs">Pour réussir</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                    <Clock className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                    <p className="text-white font-bold">~5 min</p>
                    <p className="text-slate-500 text-xs">Durée</p>
                  </div>
                </div>

                <Button
                  onClick={() => setState('question')}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4"
                >
                  Commencer le quiz 🚀
                </Button>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ÉCRAN QUESTION */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {(state === 'question' || state === 'feedback') && currentQuestion && (
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Question {currentQuestionIndex + 1}/{totalQuestions}</span>
                    <span className={`px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[currentQuestion.category]}`}>
                      {CATEGORY_LABELS[currentQuestion.category]}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
                  <h3 className="text-lg font-bold text-white leading-relaxed">
                    {currentQuestion.question}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      currentQuestion.difficulty === 'facile' ? 'bg-emerald-500/20 text-emerald-400' :
                      currentQuestion.difficulty === 'moyen' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>
                      {currentQuestion.difficulty}
                    </span>
                    <span className="text-xs text-slate-500">+{currentQuestion.points} pts</span>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === currentQuestion.correctAnswer;
                    const showResult = state === 'feedback';
                    
                    let buttonStyle = 'border-slate-700 hover:border-slate-500 bg-slate-800/30';
                    if (showResult) {
                      if (isCorrect) {
                        buttonStyle = 'border-emerald-500 bg-emerald-500/20';
                      } else if (isSelected && !isCorrect) {
                        buttonStyle = 'border-rose-500 bg-rose-500/20';
                      }
                    } else if (isSelected) {
                      buttonStyle = 'border-amber-500 bg-amber-500/20';
                    }

                    return (
                      <motion.button
                        key={idx}
                        whileHover={!showResult ? { scale: 1.01 } : {}}
                        whileTap={!showResult ? { scale: 0.99 } : {}}
                        onClick={() => handleSelectAnswer(idx)}
                        disabled={showResult}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${buttonStyle}`}
                        data-testid={`quiz-option-${idx}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                            showResult && isCorrect ? 'bg-emerald-500 text-white' :
                            showResult && isSelected && !isCorrect ? 'bg-rose-500 text-white' :
                            'bg-slate-700 text-slate-300'
                          }`}>
                            {showResult ? (
                              isCorrect ? <CheckCircle2 className="w-5 h-5" /> : 
                              isSelected ? <XCircle className="w-5 h-5" /> : 
                              String.fromCharCode(65 + idx)
                            ) : String.fromCharCode(65 + idx)}
                          </span>
                          <span className={`flex-1 ${showResult && isCorrect ? 'text-emerald-400 font-medium' : 'text-white'}`}>
                            {option}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explication */}
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border ${
                      selectedAnswer === currentQuestion.correctAnswer
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-amber-500/10 border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img 
                        src={TANAKA_IMAGE}
                        alt="Tanaka"
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className={`text-sm font-bold ${
                          selectedAnswer === currentQuestion.correctAnswer ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {selectedAnswer === currentQuestion.correctAnswer ? '✓ Excellent !' : '✗ Pas tout à fait...'}
                        </p>
                        <p className="text-slate-300 text-sm mt-1">{currentQuestion.explanation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Bouton suivant */}
                {state === 'feedback' && (
                  <Button
                    onClick={handleNextQuestion}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4"
                  >
                    {currentQuestionIndex < totalQuestions - 1 ? (
                      <>Question suivante <ChevronRight className="w-5 h-5 ml-2" /></>
                    ) : (
                      <>Voir les résultats <Trophy className="w-5 h-5 ml-2" /></>
                    )}
                  </Button>
                )}
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ÉCRAN RÉSULTATS */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {state === 'results' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${
                  passed 
                    ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                    : 'bg-gradient-to-br from-amber-500 to-orange-600'
                }`}>
                  {passed ? (
                    <Trophy className="w-12 h-12 text-white" />
                  ) : (
                    <RotateCcw className="w-12 h-12 text-white" />
                  )}
                </div>

                <div>
                  <h3 className={`text-2xl font-black ${passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {passed ? '🎉 Félicitations !' : '💪 Continue tes efforts !'}
                  </h3>
                  <p className="text-slate-400 mt-2">
                    {passed 
                      ? 'Tu as validé les connaissances pour ce grade !'
                      : `Il te faut ${quiz.passingScore}% pour valider. Révise et réessaie !`
                    }
                  </p>
                </div>

                {/* Score */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <div className="text-5xl font-black text-white mb-2">
                    {score}%
                  </div>
                  <p className="text-slate-400">Score final</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/30">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                      <p className="text-emerald-400 font-bold">
                        {answers.filter(a => a.correct).length}
                      </p>
                      <p className="text-slate-500 text-xs">Bonnes réponses</p>
                    </div>
                    <div className="bg-rose-500/10 rounded-xl p-3 border border-rose-500/30">
                      <XCircle className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                      <p className="text-rose-400 font-bold">
                        {answers.filter(a => !a.correct).length}
                      </p>
                      <p className="text-slate-500 text-xs">Erreurs</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleRestart}
                    variant="outline"
                    className="flex-1 border-slate-600 hover:bg-slate-800"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" /> Recommencer
                  </Button>
                  <Button
                    onClick={handleClose}
                    className={`flex-1 ${
                      passed 
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                        : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    } text-white`}
                  >
                    {passed ? 'Continuer' : 'Réviser'}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuizModal;
