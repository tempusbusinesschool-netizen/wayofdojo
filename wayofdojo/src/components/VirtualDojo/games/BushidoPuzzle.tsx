/**
 * 🛡️ BUSHIDO PUZZLE - Énigmes des Vertus
 * Trouve la vertu correspondant à la description
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import { useGameSounds } from '@/services/gameSoundService';

const VIRTUES = [
  { name: 'Gi 義', label: 'Rectitude / Justice', clue: 'La vertu qui vous fait toujours agir selon ce qui est juste, même quand personne ne regarde.' },
  { name: 'Yū 勇', label: 'Courage', clue: 'La force intérieure qui vous permet d\'affronter vos peurs et de faire ce qui doit être fait.' },
  { name: 'Jin 仁', label: 'Bienveillance', clue: 'La compassion envers autrui, aider ceux qui en ont besoin sans rien attendre en retour.' },
  { name: 'Rei 礼', label: 'Respect', clue: 'Se manifeste par le salut, la politesse et la considération envers chaque personne.' },
  { name: 'Makoto 誠', label: 'Sincérité', clue: 'Être authentique, honnête, dire ce que tu penses et penser ce que tu dis.' },
  { name: 'Meiyo 名誉', label: 'Honneur', clue: 'Le sens moral qui vous pousse à protéger la valeur de votre parole et de vos actions.' },
  { name: 'Chūgi 忠義', label: 'Loyauté', clue: 'La fidélité envers vos maîtres, vos amis et vos engagements.' },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

interface Props {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (m: string) => void;
}

const BushidoPuzzle: React.FC<Props> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const { play, playSuccess } = useGameSounds();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [state, setState] = useState<'intro' | 'playing' | 'feedback' | 'finished'>('intro');
  const [order, setOrder] = useState<typeof VIRTUES>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);

  const speakT = useCallback((m: string) => { if (tanakaSpeak) tanakaSpeak(m); if (soundEnabled) speak(m); }, [tanakaSpeak, soundEnabled, speak]);

  const start = () => {
    setOrder(shuffle(VIRTUES).slice(0, 5));
    setState('playing'); setIdx(0); setScore(0); setCorrect(0);
    play('start');
    speakT("Lis l'énigme et choisis la bonne vertu.");
  };

  const current = order[idx];
  // options is computed but used via choicePool state which is populated in useEffect
  const _options = order.length ? shuffle([current, ...shuffle(VIRTUES.filter(v => v.name !== current.name)).slice(0, 3)]) : [];

  const [choicePool, setChoicePool] = useState<typeof VIRTUES>([]);
  React.useEffect(() => {
    if (state === 'playing' && current) setChoicePool(shuffle([current, ...shuffle(VIRTUES.filter(v => v.name !== current.name)).slice(0, 3)]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, state]);

  const choose = (name: string) => {
    setSelected(name);
    if (name === current.name) { setScore((s) => s + 20); setCorrect((c) => c + 1); playSuccess('medium'); }
    else { play('fail'); }
    setState('feedback');
  };

  const next = () => {
    if (idx + 1 >= order.length) {
      setState('finished');
      const kiEarned = 25 + correct * 5;
      if (correct >= 4) { playSuccess('high'); speakT(`Bravo ${userName} ! Vous connaissez bien les vertus !`); }
      else { play('end'); speakT("Continuez à explorer le Bushido !"); }
      setTimeout(() => onComplete(score, kiEarned), 2500);
    } else {
      setSelected(null); setIdx((i) => i + 1); setState('playing');
    }
  };

  return (
    <div className="relative min-h-[400px]" data-testid="bushido-puzzle-game">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4"><span className="text-3xl">🛡️</span><div><h3 className="text-white font-bold">Bushido Puzzle</h3><p className="text-slate-400 text-sm">Énigmes des vertus</p></div></div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">{soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-red-400" />}</button>
          <button onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600"><X className="w-4 h-4 text-white" /></button>
        </div>
      </div>

      {state === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">🛡️</span>
          <h2 className="text-2xl font-bold text-white mb-4">Bushido Puzzle</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">5 énigmes pour découvrir les 7 vertus du Budo. Choisis la bonne réponse !</p>
          <Button onClick={start} className="bg-gradient-to-r from-slate-500 to-slate-700" data-testid="start-bushido-btn">Commencer</Button>
        </motion.div>
      )}

      {(state === 'playing' || state === 'feedback') && current && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-white">Énigme {idx + 1}/{order.length}</div>
            <div className="bg-slate-800 px-4 py-1 rounded-full"><span className="text-amber-400 font-bold">⭐ {score}</span></div>
          </div>
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 rounded-2xl p-6 mb-4">
            <p className="text-white text-base italic">« {current.clue} »</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            {choicePool.map((v) => {
              const isSel = selected === v.name;
              const showRes = state === 'feedback';
              return (
                <motion.button key={v.name} whileHover={{ scale: 1.02 }} onClick={() => state === 'playing' && choose(v.name)} disabled={state === 'feedback'}
                  className={`p-4 rounded-xl text-left transition-all ${showRes ? (isSel ? (v.name === current.name ? 'bg-emerald-600 border-2 border-emerald-400' : 'bg-red-600/50 border-2 border-red-400') : v.name === current.name ? 'bg-emerald-600/30 border border-emerald-500/50' : 'bg-slate-700/50') : 'bg-slate-700 hover:bg-slate-600'}`}
                  data-testid={`bushido-choice-${v.name.split(' ')[0]}`}>
                  <div className="text-white font-bold text-lg">{v.name}</div>
                  <div className="text-slate-300 text-sm">{v.label}</div>
                </motion.button>
              );
            })}
          </div>
          {state === 'feedback' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
              <Button onClick={next} className="w-full bg-gradient-to-r from-slate-500 to-slate-700">{idx + 1 >= order.length ? 'Voir le résultat' : 'Énigme suivante'}</Button>
            </motion.div>
          )}
        </div>
      )}

      {state === 'finished' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">{correct >= 4 ? '🏆' : '💪'}</span>
          <h2 className="text-2xl font-bold text-white mb-2">{correct >= 4 ? 'Sage guerrier !' : 'Bien joué !'}</h2>
          <p className="text-amber-400 text-xl mb-4">Score : {score} pts</p>
          <p className="text-slate-400">{correct}/{order.length} vertus trouvées</p>
        </motion.div>
      )}
    </div>
  );
};

export default BushidoPuzzle;
