/**
 * 🎯 HARA FOCUS - Concentration du Centre
 * Maintiens ton doigt sur le point d'énergie qui bouge
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
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

const HaraFocus: React.FC<Props> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const { play, playSuccess } = useGameSounds();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [state, setState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [focused, setFocused] = useState(false);
  const [timeHeld, setTimeHeld] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);

  const speakT = useCallback((m: string) => { if (tanakaSpeak) tanakaSpeak(m); if (soundEnabled) speak(m); }, [tanakaSpeak, soundEnabled, speak]);

  const start = () => {
    setState('playing'); setScore(0); setTimeHeld(0); setTimeLeft(25);
    play('start');
    speakT("Garde ton doigt sur le point de Ki qui bouge lentement.");
  };

  // Move target randomly
  useEffect(() => {
    if (state !== 'playing') return;
    const move = setInterval(() => {
      setPos({ x: 15 + Math.random() * 70, y: 15 + Math.random() * 70 });
    }, 2500);
    return () => clearInterval(move);
  }, [state]);

  // Timer
  useEffect(() => {
    if (state !== 'playing') return;
    if (timeLeft <= 0) { finish(); return; }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, timeLeft]);

  // Score while focused
  useEffect(() => {
    if (state !== 'playing' || !focused) return;
    const tick = setInterval(() => {
      setScore((s) => s + 2);
      setTimeHeld((t) => t + 0.1);
    }, 100);
    return () => clearInterval(tick);
  }, [state, focused]);

  const finish = () => {
    setState('finished');
    const kiEarned = 15 + Math.floor(score / 30);
    if (score >= 200) { playSuccess('high'); speakT(`Concentration parfaite ${userName} !`); }
    else { play('end'); speakT("Le Hara se cultive chaque jour."); }
    setTimeout(() => onComplete(score, kiEarned), 2500);
  };

  return (
    <div className="relative min-h-[400px]" data-testid="hara-focus-game">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4"><span className="text-3xl">🎯</span><div><h3 className="text-white font-bold">Hara Focus</h3><p className="text-slate-400 text-sm">Concentration du centre</p></div></div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">{soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-red-400" />}</button>
          <button onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600"><X className="w-4 h-4 text-white" /></button>
        </div>
      </div>

      {state === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">🎯</span>
          <h2 className="text-2xl font-bold text-white mb-4">Hara Focus</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">Garde ton curseur ou ton doigt sur le point d&apos;énergie. Il bouge toutes les 2,5 secondes.</p>
          <Button onClick={start} className="bg-gradient-to-r from-cyan-500 to-blue-600" data-testid="start-hara-btn">Commencer</Button>
        </motion.div>
      )}

      {state === 'playing' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-white">Focus : {timeHeld.toFixed(1)}s</div>
            <div className="flex gap-3">
              <div className="bg-slate-800 px-3 py-1 rounded-full"><span className="text-amber-400 font-bold">⭐ {score}</span></div>
              <div className="bg-slate-800 px-3 py-1 rounded-full"><span className="text-cyan-400 font-bold">⏱️ {timeLeft}s</span></div>
            </div>
          </div>
          <div className="relative w-full h-80 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl border-2 border-cyan-500/30 overflow-hidden cursor-none" data-testid="hara-arena">
            <motion.div
              animate={{ x: `${pos.x}%`, y: `${pos.y}%`, scale: focused ? [1, 1.15, 1] : 1 }}
              transition={{ x: { duration: 2 }, y: { duration: 2 }, scale: { duration: 0.6, repeat: focused ? Infinity : 0 } }}
              onMouseEnter={() => setFocused(true)}
              onMouseLeave={() => setFocused(false)}
              onTouchStart={() => setFocused(true)}
              onTouchEnd={() => setFocused(false)}
              className="absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: focused ? 'radial-gradient(circle, rgba(34,211,238,0.9), rgba(6,182,212,0.4))' : 'radial-gradient(circle, rgba(148,163,184,0.7), rgba(71,85,105,0.3))' }}>
              <span className="text-3xl">⚡</span>
            </motion.div>
            <div className="absolute bottom-2 left-0 right-0 text-center text-cyan-300 text-xs">Survole le point d&apos;énergie et maintiens</div>
          </div>
        </div>
      )}

      {state === 'finished' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">{score >= 200 ? '🏆' : '💪'}</span>
          <h2 className="text-2xl font-bold text-white mb-2">Score : {score} pts</h2>
          <p className="text-slate-400">{timeHeld.toFixed(1)} secondes concentré</p>
        </motion.div>
      )}
    </div>
  );
};

export default HaraFocus;
