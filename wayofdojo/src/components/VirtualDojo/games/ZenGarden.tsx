/**
 * 🌸 ZEN GARDEN - Jardin Zen
 * Place les pierres dans les zones sacrées pour créer l'harmonie
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import { useGameSounds } from '@/services/gameSoundService';

interface Zone { id: number; x: number; y: number; filled: boolean; }

interface Props {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (m: string) => void;
}

const ZenGarden: React.FC<Props> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const { play, playSuccess } = useGameSounds();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [state, setState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [zones, setZones] = useState<Zone[]>([]);
  const [stones, setStones] = useState(5);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const speakT = useCallback((m: string) => { if (tanakaSpeak) tanakaSpeak(m); if (soundEnabled) speak(m); }, [tanakaSpeak, soundEnabled, speak]);

  const generateZones = () => {
    const positions: Zone[] = [];
    for (let i = 0; i < 5; i++) {
      positions.push({ id: i, x: 10 + Math.random() * 80, y: 15 + Math.random() * 70, filled: false });
    }
    setZones(positions);
  };

  const start = () => {
    setState('playing'); setStones(5); setMisses(0); setTimeLeft(30);
    generateZones();
    play('start');
    speakT("Clique dans les cercles clairs pour placer une pierre.");
  };

  React.useEffect(() => {
    if (state !== 'playing') return;
    if (timeLeft <= 0) { finish(false); return; }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, timeLeft]);

  const handleGardenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (state !== 'playing' || stones <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const zoneHit = zones.find(z => !z.filled && Math.sqrt(Math.pow(z.x - x, 2) + Math.pow(z.y - y, 2)) < 8);
    if (zoneHit) {
      setZones((zs) => zs.map(z => z.id === zoneHit.id ? { ...z, filled: true } : z));
      setStones((s) => s - 1);
      playSuccess('low');
      if (zones.filter(z => !z.filled).length === 1) setTimeout(() => finish(true), 400);
    } else {
      setMisses((m) => m + 1);
      play('fail');
    }
  };

  const finish = (won: boolean) => {
    setState('finished');
    const filled = zones.filter(z => z.filled).length + (won ? 1 : 0);
    const finalScore = filled * 30 - misses * 5;
    const kiEarned = 20 + filled * 4;
    if (won) { playSuccess('high'); speakT(`Harmonie parfaite ${userName} ! Le jardin est en paix.`); }
    else { play('end'); speakT("Chaque pierre placée est un pas vers l'harmonie."); }
    setTimeout(() => onComplete(Math.max(0, finalScore), kiEarned), 2500);
  };

  return (
    <div className="relative min-h-[400px]" data-testid="zen-garden-game">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4"><span className="text-3xl">🌸</span><div><h3 className="text-white font-bold">Zen Garden</h3><p className="text-slate-400 text-sm">Harmonie du jardin</p></div></div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">{soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-red-400" />}</button>
          <button onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600"><X className="w-4 h-4 text-white" /></button>
        </div>
      </div>

      {state === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">🌸</span>
          <h2 className="text-2xl font-bold text-white mb-4">Zen Garden</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">Placez vos 5 pierres dans les zones sacrées du jardin. Précision et calme.</p>
          <Button onClick={start} className="bg-gradient-to-r from-pink-500 to-rose-600" data-testid="start-zen-btn">Commencer</Button>
        </motion.div>
      )}

      {state === 'playing' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-white">Pierres : {stones} • Erreurs : {misses}</div>
            <div className="bg-slate-800 px-4 py-1 rounded-full"><span className="text-amber-400 font-bold">⏱️ {timeLeft}s</span></div>
          </div>
          <div onClick={handleGardenClick} className="relative w-full h-80 bg-gradient-to-br from-amber-100/10 to-emerald-800/40 rounded-2xl border-2 border-amber-500/30 overflow-hidden cursor-crosshair" data-testid="zen-garden-area">
            {zones.map((z) => (
              <motion.div key={z.id} initial={{ scale: 0 }} animate={{ scale: 1 }} className={`absolute w-12 h-12 rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${z.filled ? 'bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-emerald-400 shadow-lg' : 'bg-amber-200/20 border-2 border-dashed border-amber-400/60'}`} style={{ left: `${z.x}%`, top: `${z.y}%` }}>
                {z.filled && <span className="text-2xl">🪨</span>}
              </motion.div>
            ))}
          </div>
          <p className="text-slate-400 text-xs text-center mt-3">Astuce : clique au centre des cercles pointillés</p>
        </div>
      )}

      {state === 'finished' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">{zones.every(z => z.filled) ? '🏆' : '🌸'}</span>
          <h2 className="text-2xl font-bold text-white mb-2">{zones.every(z => z.filled) ? 'Jardin harmonieux !' : 'Jardin en devenir'}</h2>
          <p className="text-amber-400 text-xl mb-4">{zones.filter(z => z.filled).length}/5 pierres placées</p>
        </motion.div>
      )}
    </div>
  );
};

export default ZenGarden;
