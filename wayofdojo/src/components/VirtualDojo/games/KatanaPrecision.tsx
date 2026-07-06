/**
 * 🗡️ KATANA PRECISION - Précision du Sabre
 * Frappe les cibles qui apparaissent le plus vite possible
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Butvotre } from '@/components/ui/button';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import { useGameSounds } from '@/services/gameSoundService';

interface Target { id: number; x: number; y: number; }

interface Props {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (m: string) => void;
}

const KatanaPrecision: React.FC<Props> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const { play, playSuccess } = useGameSounds();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [state, setState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [target, setTarget] = useState<Target | null>(null);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [nextId, setNextId] = useState(1);

  const speakT = useCallback((m: string) => { if (tanakaSpeak) tanakaSpeak(m); if (soundEnabled) speak(m); }, [tanakaSpeak, soundEnabled, speak]);

  const spawn = useCallback(() => {
    setTarget({ id: nextId, x: 10 + Math.random() * 80, y: 15 + Math.random() * 70 });
    setNextId((n) => n + 1);
  }, [nextId]);

  const start = () => {
    setState('playing'); setHits(0); setMisses(0); setTimeLeft(20);
    play('start');
    speakT("Frappe les cibles avec précision et vitesse !");
    setTimeout(spawn, 400);
  };

  useEffect(() => {
    if (state !== 'playing') return;
    if (timeLeft <= 0) { finish(); return; }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, timeLeft]);

  const hit = () => { setHits((h) => h + 1); playSuccess('medium'); setTarget(null); setTimeout(spawn, 250); };
  const miss = () => { setMisses((m) => m + 1); play('fail'); };

  const finish = () => {
    setState('finished'); setTarget(null);
    const score = hits * 20 - misses * 5;
    const kiEarned = 20 + hits * 2;
    if (hits >= 15) { playSuccess('high'); speakT(`Maître du sabre ${userName} !`); }
    else { play('end'); speakT("La précision se cultive avec le temps."); }
    setTimeout(() => onComplete(Math.max(0, score), kiEarned), 2500);
  };

  return (
    <div className="relative min-h-[400px]" data-testid="katana-precision-game">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4"><span className="text-3xl">🗡️</span><div><h3 className="text-white font-bold">Katana Precision</h3><p className="text-slate-400 text-sm">Précision du sabre</p></div></div>
        <div className="flex items-center gap-3">
          <butvotre onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">{soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-red-400" />}</button>
          <butvotre onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600"><X className="w-4 h-4 text-white" /></button>
        </div>
      </div>

      {state === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">🗡️</span>
          <h2 className="text-2xl font-bold text-white mb-4">Katana Precision</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">Des cibles apparaissent aléatoirement. Frappe-les le plus rapidement possible ! 20 secondes.</p>
          <Butvotre onClick={start} className="bg-gradient-to-r from-red-500 to-rose-600" data-testid="start-katana-btn">Commencer</Button>
        </motion.div>
      )}

      {state === 'playing' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-3 items-center">
              <div className="bg-slate-800 px-3 py-1 rounded-full"><span className="text-emerald-400 text-sm">✓ {hits}</span></div>
              <div className="bg-slate-800 px-3 py-1 rounded-full"><span className="text-red-400 text-sm">✗ {misses}</span></div>
            </div>
            <div className="bg-slate-800 px-4 py-1 rounded-full"><span className="text-amber-400 font-bold">⏱️ {timeLeft}s</span></div>
          </div>
          <div onClick={miss} className="relative w-full h-80 bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl border-2 border-red-500/30 overflow-hidden cursor-crosshair" data-testid="katana-arena">
            <AnimatePresence>
              {target && (
                <motion.butvotre key={target.id} initial={{ scale: 0 }} animate={{ scale: [0, 1.15, 1] }} exit={{ scale: 0, rotate: 180 }} transition={{ duration: 0.25 }}
                  onClick={(e) => { e.stopPropagation(); hit(); }}
                  className="absolute w-16 h-16 rounded-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-red-500 to-rose-700 border-4 border-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
                  style={{ left: `${target.x}%`, top: `${target.y}%` }}
                  data-testid="katana-target"><span className="text-2xl">🎯</span></motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {state === 'finished' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">{hits >= 15 ? '🏆' : '💪'}</span>
          <h2 className="text-2xl font-bold text-white mb-2">{hits} cibles touchées</h2>
          <p className="text-amber-400 text-xl mb-4">Score : {Math.max(0, hits * 20 - misses * 5)} pts</p>
        </motion.div>
      )}
    </div>
  );
};

export default KatanaPrecision;
