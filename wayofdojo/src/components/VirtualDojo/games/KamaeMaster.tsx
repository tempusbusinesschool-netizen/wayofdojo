/**
 * ⚔️ KAMAE MASTER - Timing du Kamae
 * Clique quand le curseur passe dans la zone verte
 */

'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import { useGameSounds } from '@/services/gameSoundService';

interface Props {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (m: string) => void;
}

const KamaeMaster: React.FC<Props> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const { play, playSuccess } = useGameSounds();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [state, setState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [pos, setPos] = useState(0);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [perfect, setPerfect] = useState(0);
  const dirRef = useRef(1);
  const speedRef = useRef(2);

  const speakT = useCallback((m: string) => { if (tanakaSpeak) tanakaSpeak(m); if (soundEnabled) speak(m); }, [tanakaSpeak, soundEnabled, speak]);

  useEffect(() => {
    if (state !== 'playing') return;
    const interval = setInterval(() => {
      setPos((p) => {
        let next = p + dirRef.current * speedRef.current;
        if (next >= 100) { next = 100; dirRef.current = -1; }
        if (next <= 0) { next = 0; dirRef.current = 1; }
        return next;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [state]);

  const start = () => {
    setState('playing'); setRound(1); setScore(0); setPerfect(0); setPos(0);
    dirRef.current = 1; speedRef.current = 2;
    play('start');
    speakT("Clique quand la barre entre dans la zone verte !");
  };

  const targetLow = 40; const targetHigh = 60; const perfectLow = 47; const perfectHigh = 53;

  const handleClick = () => {
    if (state !== 'playing') return;
    let earned = 0;
    if (pos >= perfectLow && pos <= perfectHigh) { earned = 50; setPerfect((p) => p + 1); playSuccess('high'); }
    else if (pos >= targetLow && pos <= targetHigh) { earned = 25; playSuccess('medium'); }
    else { play('fail'); }
    setScore((s) => s + earned);
    if (round >= 8) {
      setState('finished');
      const kiEarned = 25 + perfect * 5;
      if (perfect >= 5) { playSuccess('high'); speakT(`Timing exceptionnel ${userName} !`); }
      else { play('end'); speakT("Le timing est un art, continue !"); }
      setTimeout(() => onComplete(score + earned, kiEarned), 2500);
      return;
    }
    setRound((r) => r + 1);
    speedRef.current = Math.min(6, 2 + round * 0.4);
  };

  return (
    <div className="relative min-h-[400px]" data-testid="kamae-master-game">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4"><span className="text-3xl">⚔️</span><div><h3 className="text-white font-bold">Kamae Master</h3><p className="text-slate-400 text-sm">Timing du garde</p></div></div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">{soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-red-400" />}</button>
          <button onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600"><X className="w-4 h-4 text-white" /></button>
        </div>
      </div>

      {state === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">⚔️</span>
          <h2 className="text-2xl font-bold text-white mb-4">Kamae Master</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">Clique quand le curseur passe dans la zone verte. Zone dorée = timing parfait !</p>
          <Button onClick={start} className="bg-gradient-to-r from-red-500 to-orange-600" data-testid="start-kamae-btn">Commencer</Button>
        </motion.div>
      )}

      {state === 'playing' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="text-white">Coup {round}/8 • Parfaits : {perfect}</div>
            <div className="bg-slate-800 px-4 py-1 rounded-full"><span className="text-amber-400 font-bold">⭐ {score}</span></div>
          </div>
          <div className="relative w-full h-24 bg-slate-800 rounded-2xl border-2 border-slate-600 mb-6 overflow-hidden">
            <div className="absolute top-0 h-full bg-emerald-500/30" style={{ left: `${targetLow}%`, width: `${targetHigh - targetLow}%` }} />
            <div className="absolute top-0 h-full bg-amber-400/60" style={{ left: `${perfectLow}%`, width: `${perfectHigh - perfectLow}%` }} />
            <div className="absolute top-0 h-full w-1 bg-white shadow-lg" style={{ left: `${pos}%` }} />
          </div>
          <Button onClick={handleClick} className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-xl py-6" data-testid="kamae-strike-btn">⚔️ FRAPPE !</Button>
        </div>
      )}

      {state === 'finished' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">{perfect >= 5 ? '🏆' : '💪'}</span>
          <h2 className="text-2xl font-bold text-white mb-2">{perfect} timing{perfect > 1 ? 's' : ''} parfait{perfect > 1 ? 's' : ''}</h2>
          <p className="text-amber-400 text-xl mb-4">Score : {score} pts</p>
        </motion.div>
      )}
    </div>
  );
};

export default KamaeMaster;
