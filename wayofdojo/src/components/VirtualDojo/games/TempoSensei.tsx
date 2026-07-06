/**
 * 🎵 TEMPO SENSEI - Simon des Techniques
 * Reproduis la séquence de mouvements du Sensei
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import { useGameSounds } from '@/services/gameSoundService';

const MOVES = [
  { id: 0, label: 'Ikkyo', color: 'from-red-500 to-rose-600', emoji: '🔴' },
  { id: 1, label: 'Nikkyo', color: 'from-blue-500 to-cyan-600', emoji: '🔵' },
  { id: 2, label: 'Sankyo', color: 'from-emerald-500 to-teal-600', emoji: '🟢' },
  { id: 3, label: 'Yonkyo', color: 'from-amber-500 to-orange-600', emoji: '🟡' },
];

interface Props {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (m: string) => void;
}

const TempoSensei: React.FC<Props> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const { play, playSuccess } = useGameSounds();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [state, setState] = useState<'intro' | 'watching' | 'playing' | 'finished'>('intro');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSeq, setUserSeq] = useState<number[]>([]);
  const [flashing, setFlashing] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const speakT = useCallback((m: string) => { if (tanakaSpeak) tanakaSpeak(m); if (soundEnabled) speak(m); }, [tanakaSpeak, soundEnabled, speak]);

  const playSequence = async (seq: number[]) => {
    setState('watching');
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setFlashing(seq[i]);
      play('start');
      await new Promise(r => setTimeout(r, 500));
      setFlashing(null);
    }
    setUserSeq([]);
    setState('playing');
  };

  const start = () => {
    const first = [Math.floor(Math.random() * 4)];
    setSequence(first); setUserSeq([]); setRound(1); setScore(0);
    speakT("Regardez bien la séquence, puis répète-la.");
    setTimeout(() => playSequence(first), 800);
  };

  const handleTap = (id: number) => {
    if (state !== 'playing') return;
    const nextSeq = [...userSeq, id];
    setUserSeq(nextSeq);
    playSuccess('low');
    if (nextSeq[nextSeq.length - 1] !== sequence[nextSeq.length - 1]) {
      play('fail');
      setState('finished');
      const kiEarned = 15 + round * 3;
      speakT(`Bien joué ${userName} ! Vous avez tenu ${round - 1} tour${round - 1 > 1 ? 's' : ''}.`);
      setTimeout(() => onComplete(score, kiEarned), 2500);
      return;
    }
    if (nextSeq.length === sequence.length) {
      setScore((s) => s + round * 20);
      playSuccess('high');
      if (round >= 8) {
        setState('finished');
        const kiEarned = 40 + round * 3;
        speakT(`Impressionnant ${userName} ! Votre mémoire est exceptionnelle !`);
        setTimeout(() => onComplete(score + round * 20, kiEarned), 2500);
        return;
      }
      const newSeq = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSeq); setRound(round + 1);
      setTimeout(() => playSequence(newSeq), 700);
    }
  };

  return (
    <div className="relative min-h-[400px]" data-testid="tempo-sensei-game">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4"><span className="text-3xl">🎵</span><div><h3 className="text-white font-bold">Tempo Sensei</h3><p className="text-slate-400 text-sm">Simon des techniques</p></div></div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">{soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-red-400" />}</button>
          <button onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600"><X className="w-4 h-4 text-white" /></button>
        </div>
      </div>

      {state === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">🎵</span>
          <h2 className="text-2xl font-bold text-white mb-4">Tempo Sensei</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">Le Sensei enchaîne des techniques. Regardez bien la séquence puis reproduis-la !</p>
          <Button onClick={start} className="bg-gradient-to-r from-violet-500 to-purple-600" data-testid="start-tempo-btn">Commencer</Button>
        </motion.div>
      )}

      {(state === 'watching' || state === 'playing') && (
        <div className="text-center">
          <div className="flex justify-between items-center mb-4">
            <div className="text-white">Tour {round} • {state === 'watching' ? 'Regardez…' : 'À vous !'}</div>
            <div className="bg-slate-800 px-4 py-1 rounded-full"><span className="text-amber-400 font-bold">⭐ {score}</span></div>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {MOVES.map((m) => (
              <motion.button key={m.id} onClick={() => handleTap(m.id)} disabled={state !== 'playing'}
                animate={{ scale: flashing === m.id ? 1.15 : 1, opacity: flashing === m.id ? 1 : 0.85 }}
                className={`aspect-square rounded-2xl bg-gradient-to-br ${m.color} shadow-lg text-white text-3xl flex flex-col items-center justify-center gap-1 ${state === 'playing' ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}`}
                data-testid={`tempo-btn-${m.id}`}>
                <span className="text-4xl">{m.emoji}</span>
                <span className="text-sm font-bold">{m.label}</span>
              </motion.button>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {sequence.map((_, i) => (<div key={i} className={`w-2 h-2 rounded-full ${i < userSeq.length ? 'bg-emerald-400' : 'bg-slate-600'}`} />))}
          </div>
        </div>
      )}

      {state === 'finished' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">{round >= 5 ? '🏆' : '💪'}</span>
          <h2 className="text-2xl font-bold text-white mb-2">Tour {round - 1} atteint</h2>
          <p className="text-amber-400 text-xl mb-4">Score : {score} pts</p>
        </motion.div>
      )}
    </div>
  );
};

export default TempoSensei;
