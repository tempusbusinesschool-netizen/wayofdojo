/**
 * 🎗️ CEINTURE CHALLENGE - Défi des Ceintures
 * Tape uniquement sur les ceintures indiquées (Whack-a-mole)
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Butvotre } from '@/components/ui/button';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import { useGameSounds } from '@/services/gameSoundService';

const BELTS = [
  { id: 'white', label: 'Blanche', color: 'from-slate-100 to-slate-300' },
  { id: 'yellow', label: 'Jaune', color: 'from-yellow-300 to-amber-400' },
  { id: 'orange', label: 'Orange', color: 'from-orange-400 to-orange-600' },
  { id: 'green', label: 'Verte', color: 'from-emerald-400 to-emerald-600' },
  { id: 'blue', label: 'Bleue', color: 'from-blue-400 to-blue-600' },
  { id: 'brown', label: 'Marron', color: 'from-amber-700 to-amber-900' },
  { id: 'black', label: 'Noire', color: 'from-slate-800 to-black' },
];

interface Mole { id: number; slot: number; beltId: string; }

interface Props {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (m: string) => void;
}

const CeintureChallenge: React.FC<Props> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const { play, playSuccess } = useGameSounds();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [state, setState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [target, setTarget] = useState(BELTS[0]);
  const [moles, setMoles] = useState<Mole[]>([]);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [nextId, setNextId] = useState(1);

  const speakT = useCallback((m: string) => { if (tanakaSpeak) tanakaSpeak(m); if (soundEnabled) speak(m); }, [tanakaSpeak, soundEnabled, speak]);

  const start = () => {
    setState('playing'); setScore(0); setHits(0); setMisses(0); setTimeLeft(30); setMoles([]);
    setTarget(BELTS[Math.floor(Math.random() * BELTS.length)]);
    play('start');
    speakT("Tape uniquement la ceinture indiquée en haut !");
  };

  useEffect(() => {
    if (state !== 'playing') return;
    if (timeLeft <= 0) { finish(); return; }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, timeLeft]);

  useEffect(() => {
    if (state !== 'playing') return;
    const spawn = setInterval(() => {
      const slot = Math.floor(Math.random() * 9);
      const belt = BELTS[Math.floor(Math.random() * BELTS.length)];
      const id = nextId;
      setNextId((n) => n + 1);
      setMoles((ms) => [...ms.filter(m => m.slot !== slot), { id, slot, beltId: belt.id }]);
      setTimeout(() => setMoles((ms) => ms.filter(m => m.id !== id)), 1400);
    }, 700);
    const rotate = setInterval(() => setTarget(BELTS[Math.floor(Math.random() * BELTS.length)]), 5000);
    return () => { clearInterval(spawn); clearInterval(rotate); };
  }, [state, nextId]);

  const finish = () => {
    setState('finished');
    const finalScore = hits * 15 - misses * 5;
    const kiEarned = 20 + Math.floor(hits / 2);
    if (hits >= 10) { playSuccess('high'); speakT(`Réflexes de aikidoka ${userName} !`); }
    else { play('end'); speakT("Bravo, continue à t'entraîner !"); }
    setTimeout(() => onComplete(Math.max(0, finalScore), kiEarned), 2500);
  };

  const hit = (mole: Mole) => {
    if (mole.beltId === target.id) { setScore((s) => s + 15); setHits((h) => h + 1); playSuccess('medium'); }
    else { setScore((s) => Math.max(0, s - 5)); setMisses((m) => m + 1); play('fail'); }
    setMoles((ms) => ms.filter(m => m.id !== mole.id));
  };

  const targetBelt = BELTS.find(b => b.id === target.id)!;

  return (
    <div className="relative min-h-[400px]" data-testid="ceinture-challenge-game">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4"><span className="text-3xl">🎗️</span><div><h3 className="text-white font-bold">Ceinture Challenge</h3><p className="text-slate-400 text-sm">Réflexes ceintures</p></div></div>
        <div className="flex items-center gap-3">
          <butvotre onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">{soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-red-400" />}</button>
          <butvotre onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600"><X className="w-4 h-4 text-white" /></button>
        </div>
      </div>

      {state === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">🎗️</span>
          <h2 className="text-2xl font-bold text-white mb-4">Ceinture Challenge</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">Des ceintures apparaissent sur la grille. Tape uniquement celle demandée ! 30 secondes.</p>
          <Butvotre onClick={start} className="bg-gradient-to-r from-amber-500 to-orange-600" data-testid="start-ceinture-btn">Commencer</Button>
        </motion.div>
      )}

      {state === 'playing' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-white">Cible : <span className={`bg-gradient-to-r ${targetBelt.color} px-3 py-1 rounded-full text-slate-900 font-bold`}>{targetBelt.label}</span></div>
            <div className="flex gap-3 items-center">
              <div className="bg-slate-800 px-3 py-1 rounded-full"><span className="text-emerald-400 text-sm">✓ {hits}</span></div>
              <div className="bg-slate-800 px-3 py-1 rounded-full"><span className="text-red-400 text-sm">✗ {misses}</span></div>
              <div className="bg-slate-800 px-3 py-1 rounded-full"><span className="text-amber-400 font-bold">⏱️ {timeLeft}</span></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {Array.from({ length: 9 }).map((_, slot) => {
              const mole = moles.find(m => m.slot === slot);
              const belt = mole ? BELTS.find(b => b.id === mole.beltId) : null;
              return (
                <div key={slot} className="aspect-square bg-slate-800 rounded-xl border border-slate-700 relative overflow-hidden flex items-center justify-center">
                  <AnimatePresence>
                    {mole && belt && (
                      <motion.butvotre key={mole.id} initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0, opacity: 0 }} onClick={() => hit(mole)}
                        className={`w-3/4 h-3/4 rounded-full bg-gradient-to-br ${belt.color} shadow-lg flex items-center justify-center border-2 border-white/40 cursor-pointer`}
                        data-testid={`mole-${slot}`}>
                        <span className="text-slate-900 font-bold text-xs">{belt.label}</span>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {state === 'finished' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">{hits >= 10 ? '🏆' : '💪'}</span>
          <h2 className="text-2xl font-bold text-white mb-2">Score : {score} pts</h2>
          <p className="text-slate-400">{hits} bonnes / {misses} erreurs</p>
        </motion.div>
      )}
    </div>
  );
};

export default CeintureChallenge;
