/**
 * 🕊️ ORIGAMI MASTER - Pliage de la Grue
 * Suis l'ordre des étapes pour plier ton origami
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX, Check } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import { useGameSounds } from '@/services/gameSoundService';

const STEPS = [
  { id: 1, label: 'Plier en diagonale', icon: '⬜', desc: 'Forme un triangle' },
  { id: 2, label: 'Plier l\'autre diagonale', icon: '🔺', desc: 'Forme un plus petit triangle' },
  { id: 3, label: 'Écraser en losange', icon: '🔶', desc: 'Aplatis le papier' },
  { id: 4, label: 'Rabattre les côtés', icon: '📐', desc: 'Vers le centre' },
  { id: 5, label: 'Plier la pointe', icon: '📎', desc: 'Vers le haut' },
  { id: 6, label: 'Ouvrir les ailes', icon: '🦋', desc: 'Séparer les couches' },
  { id: 7, label: 'Terminer la grue', icon: '🕊️', desc: 'Ta grue est prête !' },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

interface Props {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (m: string) => void;
}

const OrigamiMaster: React.FC<Props> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const { play, playSuccess } = useGameSounds();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [state, setState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [pool, setPool] = useState<typeof STEPS>([]);
  const [done, setDone] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);

  const speakT = useCallback((m: string) => { if (tanakaSpeak) tanakaSpeak(m); if (soundEnabled) speak(m); }, [tanakaSpeak, soundEnabled, speak]);

  const start = () => {
    setPool(shuffle(STEPS));
    setState('playing'); setDone([]); setErrors(0);
    play('start');
    speakT("Retrouve l'ordre correct pour plier la grue.");
  };

  const tryStep = (id: number) => {
    const nextExpected = done.length + 1;
    if (id === nextExpected) {
      const newDone = [...done, id];
      setDone(newDone);
      playSuccess('medium');
      if (newDone.length === STEPS.length) {
        setState('finished');
        const finalScore = 100 - errors * 8;
        const kiEarned = 30 + Math.max(0, 20 - errors * 3);
        if (errors <= 1) { playSuccess('high'); speakT(`Magnifique grue ${userName} ! Symbole de paix.`); }
        else { play('end'); speakT("La patience est la mère de la sagesse."); }
        setTimeout(() => onComplete(Math.max(20, finalScore), kiEarned), 2500);
      }
    } else {
      setWrong(id); setErrors((e) => e + 1); play('fail');
      setTimeout(() => setWrong(null), 500);
    }
  };

  return (
    <div className="relative min-h-[400px]" data-testid="origami-master-game">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4"><span className="text-3xl">🕊️</span><div><h3 className="text-white font-bold">Origami Master</h3><p className="text-slate-400 text-sm">Pliage de la grue</p></div></div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">{soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-red-400" />}</button>
          <button onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600"><X className="w-4 h-4 text-white" /></button>
        </div>
      </div>

      {state === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">🕊️</span>
          <h2 className="text-2xl font-bold text-white mb-4">Origami Master</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">Clique sur les 7 étapes dans le bon ordre pour plier une grue en papier.</p>
          <Button onClick={start} className="bg-gradient-to-r from-emerald-500 to-teal-600" data-testid="start-origami-btn">Commencer</Button>
        </motion.div>
      )}

      {state === 'playing' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-white">Étape {done.length + 1}/{STEPS.length}</div>
            <div className="bg-slate-800 px-4 py-1 rounded-full"><span className="text-red-400 text-sm">✗ {errors}</span></div>
          </div>
          <div className="mb-4 flex justify-center gap-1">
            {STEPS.map((s) => (
              <div key={s.id} className={`w-8 h-1.5 rounded-full ${done.includes(s.id) ? 'bg-emerald-500' : 'bg-slate-700'}`} />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {pool.map((s) => {
              const isDone = done.includes(s.id);
              const isWrong = wrong === s.id;
              return (
                <motion.button key={s.id} whileHover={!isDone ? { scale: 1.03 } : {}} onClick={() => !isDone && tryStep(s.id)} disabled={isDone}
                  className={`p-4 rounded-xl transition-all text-center ${isDone ? 'bg-emerald-700/40 opacity-40 cursor-not-allowed' : isWrong ? 'bg-red-600' : 'bg-slate-700 hover:bg-slate-600 cursor-pointer'}`}
                  data-testid={`origami-step-${s.id}`}>
                  <div className="text-4xl mb-2">{s.icon}</div>
                  <div className="text-white font-semibold text-sm">{s.label}</div>
                  <div className="text-slate-400 text-xs mt-1">{s.desc}</div>
                  {isDone && <Check className="w-4 h-4 text-emerald-400 mx-auto mt-2" />}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {state === 'finished' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">{errors <= 1 ? '🏆' : '🕊️'}</span>
          <h2 className="text-2xl font-bold text-white mb-2">{errors <= 1 ? 'Grue parfaite !' : 'Bien joué !'}</h2>
          <p className="text-amber-400 text-xl mb-4">{errors} erreur{errors > 1 ? 's' : ''}</p>
        </motion.div>
      )}
    </div>
  );
};

export default OrigamiMaster;
