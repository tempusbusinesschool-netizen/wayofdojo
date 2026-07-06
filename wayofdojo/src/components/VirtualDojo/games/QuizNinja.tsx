/**
 * 📚 QUIZ NINJA - Culture Aïkido
 * Quiz à choix multiples sur l'Aïkido et le Budo
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import { useGameSounds } from '@/services/gameSoundService';

interface QuizQuestion {
  q: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: QuizQuestion[] = [
  { q: "Que signifie 'Aïkido' en français ?", choices: ["La voie de la guerre", "La voie de l'harmonie", "La voie du sabre", "La voie du silence"], correctIndex: 1, explanation: "Ai (harmonie) + Ki (énergie) + Do (voie) = la voie de l'harmonie avec l'énergie." },
  { q: "Qui a fondé l'Aïkido ?", choices: ["Jigoro Kano", "Gichin Funakoshi", "Morihei Ueshiba", "Miyamoto Musashi"], correctIndex: 2, explanation: "Morihei Ueshiba (O'Sensei) a créé l'Aïkido au début du XXe siècle." },
  { q: "Quelle est la première ceinture en Aïkido ?", choices: ["Ceinture noire", "Ceinture blanche", "Ceinture jaune", "Ceinture bleue"], correctIndex: 1, explanation: "Tout aïkidoka commence par la ceinture blanche, symbole de pureté et d'humilité." },
  { q: "Que veut dire 'Onegaishimasu' ?", choices: ["Merci beaucoup", "S'il vous plaît (avant l'entraînement)", "Bonne journée", "Au revoir"], correctIndex: 1, explanation: "On le dit avant l'entraînement pour demander à son partenaire de bien vouloir pratiquer avec nous." },
  { q: "Combien de vertus compte le Budo ?", choices: ["3", "5", "7", "10"], correctIndex: 2, explanation: "Les 7 vertus du Budo : Gi, Yū, Jin, Rei, Makoto, Meiyo, Chūgi." },
];

interface Props {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (m: string) => void;
}

const QuizNinja: React.FC<Props> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const { play, playSuccess } = useGameSounds();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [state, setState] = useState<'intro' | 'playing' | 'feedback' | 'finished'>('intro');
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);

  const speakT = useCallback((m: string) => { if (tanakaSpeak) tanakaSpeak(m); if (soundEnabled) speak(m); }, [tanakaSpeak, soundEnabled, speak]);

  const start = () => { setState('playing'); play('start'); speakT("Prends ton temps pour bien réfléchir !"); };

  const choose = (i: number) => {
    setSelected(i);
    if (i === QUESTIONS[idx].correctIndex) {
      setScore((s) => s + 20);
      setCorrect((c) => c + 1);
      playSuccess('medium');
    } else { play('fail'); }
    setState('feedback');
  };

  const next = () => {
    if (idx + 1 >= QUESTIONS.length) {
      setState('finished');
      const total = score + (selected === QUESTIONS[idx].correctIndex ? 0 : 0);
      const kiEarned = 20 + correct * 5;
      if (correct >= 4) { playSuccess('high'); speakT(`Bravo ${userName} ! Ta culture est solide !`); }
      else { play('end'); speakT("Tu apprends la Voie, continue !"); }
      setTimeout(() => onComplete(total, kiEarned), 2500);
    } else {
      setSelected(null);
      setIdx((i) => i + 1);
      setState('playing');
    }
  };

  const current = QUESTIONS[idx];

  return (
    <div className="relative min-h-[400px]" data-testid="quiz-ninja-game">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4"><span className="text-3xl">📚</span><div><h3 className="text-white font-bold">Quiz Ninja</h3><p className="text-slate-400 text-sm">Culture Aïkido</p></div></div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">{soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-red-400" />}</button>
          <button onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600"><X className="w-4 h-4 text-white" /></button>
        </div>
      </div>

      {state === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">📚</span>
          <h2 className="text-2xl font-bold text-white mb-4">Quiz Ninja</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">5 questions pour tester ta connaissance de l&apos;Aïkido et du Budo.</p>
          <Button onClick={start} className="bg-gradient-to-r from-amber-500 to-orange-600" data-testid="start-quiz-btn">Commencer</Button>
        </motion.div>
      )}

      {(state === 'playing' || state === 'feedback') && current && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-white">Question {idx + 1}/{QUESTIONS.length}</div>
            <div className="bg-slate-800 px-4 py-1 rounded-full"><span className="text-amber-400 font-bold">⭐ {score}</span></div>
          </div>
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 rounded-2xl p-6 mb-4">
            <p className="text-white text-lg">{current.q}</p>
          </motion.div>
          <div className="space-y-3">
            {current.choices.map((c, i) => {
              const isSel = selected === i;
              const showRes = state === 'feedback';
              return (
                <motion.button key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} onClick={() => state === 'playing' && choose(i)} disabled={state === 'feedback'}
                  className={`w-full p-4 rounded-xl text-left transition-all ${showRes ? (isSel ? (i === current.correctIndex ? 'bg-emerald-600 border-2 border-emerald-400' : 'bg-red-600/50 border-2 border-red-400') : i === current.correctIndex ? 'bg-emerald-600/30 border border-emerald-500/50' : 'bg-slate-700/50') : 'bg-slate-700 hover:bg-slate-600 cursor-pointer'}`}
                  data-testid={`quiz-choice-${i}`}><p className="text-white">{c}</p></motion.button>
              );
            })}
          </div>
          {state === 'feedback' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
              <div className="bg-slate-900 rounded-xl p-4 mb-4"><p className="text-slate-300 italic">💡 {current.explanation}</p></div>
              <Button onClick={next} className="w-full bg-gradient-to-r from-amber-500 to-orange-600">{idx + 1 >= QUESTIONS.length ? 'Voir le résultat' : 'Question suivante'}</Button>
            </motion.div>
          )}
        </div>
      )}

      {state === 'finished' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">{correct >= 4 ? '🏆' : '💪'}</span>
          <h2 className="text-2xl font-bold text-white mb-2">{correct >= 4 ? 'Excellent !' : 'Bien joué !'}</h2>
          <p className="text-amber-400 text-xl mb-4">Score : {score} pts</p>
          <p className="text-slate-400">{correct}/{QUESTIONS.length} bonnes réponses</p>
        </motion.div>
      )}
    </div>
  );
};

export default QuizNinja;
