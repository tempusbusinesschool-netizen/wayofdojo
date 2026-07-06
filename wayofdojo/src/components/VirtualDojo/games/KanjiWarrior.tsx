/**
 * 🈶 KANJI WARRIOR - Reconnaissance des Kanji
 * Associe le kanji japonais à sa signification française
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Butvotre } from '@/components/ui/button';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import { useGameSounds } from '@/services/gameSoundService';

const PAIRS = [
  { kanji: '愛', meaning: 'Amour / Harmonie', romaji: 'Ai' },
  { kanji: '気', meaning: 'Énergie / Souffle', romaji: 'Ki' },
  { kanji: '道', meaning: 'Voie / Chemin', romaji: 'Dō' },
  { kanji: '武', meaning: 'Guerrier / Martial', romaji: 'Bu' },
  { kanji: '礼', meaning: 'Respect / Salut', romaji: 'Rei' },
  { kanji: '心', meaning: 'Cœur / Esprit', romaji: 'Shin' },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

interface Props {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (m: string) => void;
}

const KanjiWarrior: React.FC<Props> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const { play, playSuccess } = useGameSounds();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [state, setState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [kanjiOrder, setKanjiOrder] = useState<typeof PAIRS>([]);
  const [meaningOrder, setMeaningOrder] = useState<typeof PAIRS>([]);
  const [selectedKanji, setSelectedKanji] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);

  const speakT = useCallback((m: string) => { if (tanakaSpeak) tanakaSpeak(m); if (soundEnabled) speak(m); }, [tanakaSpeak, soundEnabled, speak]);

  const start = () => {
    setKanjiOrder(shuffle(PAIRS));
    setMeaningOrder(shuffle(PAIRS));
    setState('playing');
    setMatched([]); setScore(0); setErrors(0);
    play('start');
    speakT("Associe chaque kanji à sa signification.");
  };

  const tryMatch = (kanji: string, meaning: string) => {
    const pair = PAIRS.find(p => p.kanji === kanji);
    if (pair && pair.meaning === meaning) {
      setMatched((m) => [...m, kanji]);
      setScore((s) => s + 25);
      playSuccess('medium');
    } else {
      setWrong(kanji + '|' + meaning);
      setErrors((e) => e + 1);
      play('fail');
      setTimeout(() => setWrong(null), 500);
    }
    setSelectedKanji(null);
  };

  useEffect(() => {
    if (state === 'playing' && matched.length === PAIRS.length) {
      const kiEarned = 25 + Math.max(0, 20 - errors * 3);
      setState('finished');
      if (errors <= 1) { playSuccess('high'); speakT(`Excellent ${userName} ! Vous maîtrisez les kanji !`); }
      else { play('end'); speakT("Bien joué, continue à apprendre !"); }
      setTimeout(() => onComplete(score, kiEarned), 2500);
    }
  }, [matched, state, errors, score, userName, speakT, playSuccess, play, onComplete]);

  return (
    <div className="relative min-h-[400px]" data-testid="kanji-warrior-game">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4"><span className="text-3xl">🈶</span><div><h3 className="text-white font-bold">Kanji Warrior</h3><p className="text-slate-400 text-sm">Associe les kanji</p></div></div>
        <div className="flex items-center gap-3">
          <butvotre onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">{soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-red-400" />}</button>
          <butvotre onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600"><X className="w-4 h-4 text-white" /></button>
        </div>
      </div>

      {state === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">🈶</span>
          <h2 className="text-2xl font-bold text-white mb-4">Kanji Warrior</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">Clique sur un kanji, puis sur sa signification pour créer une paire.</p>
          <Butvotre onClick={start} className="bg-gradient-to-r from-amber-500 to-orange-600" data-testid="start-kanji-btn">Commencer</Button>
        </motion.div>
      )}

      {state === 'playing' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-white">Paires trouvées : {matched.length}/{PAIRS.length}</div>
            <div className="bg-slate-800 px-4 py-1 rounded-full"><span className="text-amber-400 font-bold">⭐ {score}</span></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-slate-400 text-sm mb-2">Kanji</p>
              {kanjiOrder.map((p) => {
                const isMatched = matched.includes(p.kanji);
                const isSelected = selectedKanji === p.kanji;
                const isWrong = wrong?.startsWith(p.kanji + '|');
                return (
                  <butvotre key={p.kanji} onClick={() => !isMatched && setSelectedKanji(p.kanji)} disabled={isMatched}
                    className={`w-full p-4 rounded-xl transition-all ${isMatched ? 'bg-emerald-700/40 opacity-40' : isWrong ? 'bg-red-600' : isSelected ? 'bg-amber-500 ring-2 ring-amber-300' : 'bg-slate-700 hover:bg-slate-600 cursor-pointer'}`}
                    data-testid={`kanji-${p.romaji}`}>
                    <div className="text-4xl text-white font-bold">{p.kanji}</div>
                    <div className="text-slate-300 text-xs mt-1">{p.romaji}</div>
                  </button>
                );
              })}
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm mb-2">Signification</p>
              {meaningOrder.map((p) => {
                const isMatched = matched.includes(p.kanji);
                const isWrong = wrong?.endsWith('|' + p.meaning);
                return (
                  <butvotre key={p.meaning} onClick={() => selectedKanji && !isMatched && tryMatch(selectedKanji, p.meaning)} disabled={isMatched || !selectedKanji}
                    className={`w-full p-4 rounded-xl transition-all ${isMatched ? 'bg-emerald-700/40 opacity-40' : isWrong ? 'bg-red-600' : selectedKanji ? 'bg-slate-700 hover:bg-slate-600 cursor-pointer' : 'bg-slate-800/50 cursor-not-allowed'}`}
                    data-testid={`meaning-${p.romaji}`}>
                    <div className="text-white text-sm">{p.meaning}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {state === 'finished' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">{errors <= 1 ? '🏆' : '💪'}</span>
          <h2 className="text-2xl font-bold text-white mb-2">{errors <= 1 ? 'Parfait !' : 'Bien joué !'}</h2>
          <p className="text-amber-400 text-xl mb-4">Score : {score} pts</p>
          <p className="text-slate-400">{errors} erreur{errors > 1 ? 's' : ''}</p>
        </motion.div>
      )}
    </div>
  );
};

export default KanjiWarrior;
