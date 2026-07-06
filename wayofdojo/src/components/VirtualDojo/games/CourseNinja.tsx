/**
 * 🏃 COURSE NINJA - Parcours d'Obstacles
 * Esquive les obstacles en tapant à gauche ou à droite
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import { useGameSounds } from '@/services/gameSoundService';

type Lane = 0 | 1 | 2;
interface Obstacle { id: number; lane: Lane; y: number; }

interface Props {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (m: string) => void;
}

const CourseNinja: React.FC<Props> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const { play, playSuccess } = useGameSounds();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [state, setState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [lane, setLane] = useState<Lane>(1);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [nextId, setNextId] = useState(1);

  const speakT = useCallback((m: string) => { if (tanakaSpeak) tanakaSpeak(m); if (soundEnabled) speak(m); }, [tanakaSpeak, soundEnabled, speak]);

  const start = () => {
    setState('playing'); setLane(1); setObstacles([]); setScore(0);
    play('start');
    speakT("Utilisez les flèches pour esquiver les obstacles !");
  };

  useEffect(() => {
    if (state !== 'playing') return;
    const move = setInterval(() => {
      setObstacles((obs) => {
        const moved = obs.map(o => ({ ...o, y: o.y + 4 })).filter(o => o.y < 110);
        // Collision detection
        const collision = moved.find(o => o.y >= 82 && o.y <= 92 && o.lane === lane);
        if (collision) {
          play('fail');
          finish();
        }
        return moved;
      });
      setScore((s) => s + 1);
    }, 60);
    const spawn = setInterval(() => {
      setObstacles((obs) => [...obs, { id: nextId, lane: Math.floor(Math.random() * 3) as Lane, y: 0 }]);
      setNextId((n) => n + 1);
    }, 900);
    return () => { clearInterval(move); clearInterval(spawn); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, lane, nextId]);

  useEffect(() => {
    if (state !== 'playing') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setLane((l) => Math.max(0, l - 1) as Lane);
      else if (e.key === 'ArrowRight') setLane((l) => Math.min(2, l + 1) as Lane);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [state]);

  const finish = () => {
    setState('finished');
    setObstacles([]);
    const kiEarned = 15 + Math.floor(score / 20);
    if (score >= 300) { playSuccess('high'); speakT(`Rapide comme le vent ${userName} !`); }
    else { play('end'); speakT("La rapidité vient avec la pratique."); }
    setTimeout(() => onComplete(score, kiEarned), 2500);
  };

  return (
    <div className="relative min-h-[400px]" data-testid="course-aikidoka-game">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4"><span className="text-3xl">🏃</span><div><h3 className="text-white font-bold">Course Ninja</h3><p className="text-slate-400 text-sm">Esquive les obstacles</p></div></div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">{soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-red-400" />}</button>
          <button onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600"><X className="w-4 h-4 text-white" /></button>
        </div>
      </div>

      {state === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">🏃</span>
          <h2 className="text-2xl font-bold text-white mb-4">Course Ninja</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">Utilisez les flèches ← → ou les boutons pour changer de voie et esquiver les obstacles.</p>
          <Button onClick={start} className="bg-gradient-to-r from-cyan-500 to-blue-600" data-testid="start-course-btn">Commencer</Button>
        </motion.div>
      )}

      {state === 'playing' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-white">Voie {lane + 1}/3</div>
            <div className="bg-slate-800 px-4 py-1 rounded-full"><span className="text-amber-400 font-bold">⭐ {score}</span></div>
          </div>
          <div className="relative w-full h-80 bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl border-2 border-cyan-500/30 overflow-hidden">
            {/* Lanes */}
            <div className="absolute inset-0 grid grid-cols-3">
              {[0, 1, 2].map(i => (<div key={i} className={`border-x border-cyan-500/20 ${lane === i ? 'bg-cyan-500/10' : ''}`} />))}
            </div>
            {/* Player */}
            <motion.div layout className="absolute bottom-2 w-14 h-14 -translate-x-1/2 flex items-center justify-center text-3xl bg-gradient-to-br from-amber-400 to-orange-600 rounded-full border-2 border-white shadow-xl" style={{ left: `${(lane * 33.33) + 16.67}%` }}>
              🥷
            </motion.div>
            {/* Obstacles */}
            <AnimatePresence>
              {obstacles.map((o) => (
                <motion.div key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute w-14 h-14 -translate-x-1/2 flex items-center justify-center text-2xl bg-red-500 rounded-lg border-2 border-red-300 shadow-lg"
                  style={{ left: `${(o.lane * 33.33) + 16.67}%`, top: `${o.y}%` }}>🌋</motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 md:hidden">
            <Button onClick={() => setLane((l) => Math.max(0, l - 1) as Lane)} className="bg-slate-700 py-4"><ArrowLeft className="w-6 h-6" /></Button>
            <Button onClick={() => setLane((l) => Math.min(2, l + 1) as Lane)} className="bg-slate-700 py-4"><ArrowRight className="w-6 h-6" /></Button>
          </div>
        </div>
      )}

      {state === 'finished' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">{score >= 300 ? '🏆' : '💪'}</span>
          <h2 className="text-2xl font-bold text-white mb-2">Score : {score} pts</h2>
          <p className="text-slate-400">Distance parcourue</p>
        </motion.div>
      )}
    </div>
  );
};

export default CourseNinja;
