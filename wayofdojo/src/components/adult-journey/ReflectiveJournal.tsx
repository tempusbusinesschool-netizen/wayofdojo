'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, PenLine, Calendar, Sparkles, 
  X, Save, Trash2, ChevronDown, TrendingUp, Award, Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JournalEntry {
  id: string;
  cityId: string;
  missionId?: string;
  content: string;
  createdAt: string;
  mood?: 'positive' | 'neutral' | 'challenging';
  tags?: string[];
}

interface ReflectiveJournalProps {
  entries: JournalEntry[];
  currentCityId: string;
  currentMissionId?: string;
  onAddEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => Promise<void>;
  onDeleteEntry?: (entryId: string) => Promise<void>;
}

const MOOD_OPTIONS = [
  { id: 'positive', emoji: '😊', label: 'Positif', color: 'bg-emerald-500' },
  { id: 'neutral', emoji: '😐', label: 'Neutre', color: 'bg-slate-500' },
  { id: 'challenging', emoji: '💪', label: 'Challengeant', color: 'bg-amber-500' },
];

const TAG_SUGGESTIONS = [
  'discipline', 'technique', 'respiration', 'centrage', 'patience',
  'stratégie', 'leadership', 'calme', 'décision', 'transmission'
];

// Calculate journal statistics
function useJournalStats(entries: JournalEntry[]) {
  return useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    
    const thisMonth = entries.filter(e => new Date(e.createdAt) >= startOfMonth);
    const thisWeek = entries.filter(e => new Date(e.createdAt) >= startOfWeek);
    
    // Calculate streak (consecutive days with entries)
    const sortedByDate = [...entries].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const entry of sortedByDate) {
      const entryDate = new Date(entry.createdAt);
      entryDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streak++;
        currentDate = entryDate;
      } else {
        break;
      }
    }

    // Mood distribution
    const moodCounts = entries.reduce((acc, e) => {
      if (e.mood) acc[e.mood] = (acc[e.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Most used tags
    const tagCounts = entries.reduce((acc, e) => {
      e.tags?.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag);

    return {
      total: entries.length,
      thisMonth: thisMonth.length,
      thisWeek: thisWeek.length,
      xpEarned: entries.length * 5,
      xpThisMonth: thisMonth.length * 5,
      streak,
      moodCounts,
      topTags,
      averageLength: entries.length > 0 
        ? Math.round(entries.reduce((sum, e) => sum + e.content.length, 0) / entries.length)
        : 0
    };
  }, [entries]);
}

export function ReflectiveJournal({
  entries,
  currentCityId,
  currentMissionId,
  onAddEntry,
  onDeleteEntry
}: ReflectiveJournalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<'positive' | 'neutral' | 'challenging' | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Calculate statistics
  const stats = useJournalStats(entries);

  // Filtrer les entrées pour la ville actuelle
  const cityEntries = entries.filter(e => e.cityId === currentCityId);

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      await onAddEntry({
        cityId: currentCityId,
        missionId: currentMissionId,
        content: content.trim(),
        mood: selectedMood || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined
      });

      // Reset form
      setContent('');
      setSelectedMood(null);
      setSelectedTags([]);
      setIsWriting(false);

      // Show XP animation
      setShowXpAnimation(true);
      setTimeout(() => setShowXpAnimation(false), 2000);
    } catch (error) {
      console.error('Failed to save journal entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 via-slate-900/50 to-purple-900/20 overflow-hidden"
    >
      {/* Header */}
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold flex items-center gap-2">
              Journal de Réflexion
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                +5 XP / entrée
              </span>
            </h3>
            <p className="text-slate-400 text-xs">
              {cityEntries.length} réflexion{cityEntries.length !== 1 ? 's' : ''} pour cette étape
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </div>

      {/* XP Animation */}
      <AnimatePresence>
        {showXpAnimation && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -30, scale: 1 }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            <div className="text-amber-400 text-4xl font-black flex items-center gap-2">
              <Sparkles className="w-8 h-8" />
              +5 XP
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 pt-0 space-y-4">
              {/* Statistics Banner */}
              {entries.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-purple-500/10 border border-purple-500/20"
                >
                  {/* Toggle Stats */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowStats(!showStats); }}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white font-semibold text-sm">
                          {stats.thisMonth > 0 
                            ? `Tu as écrit ${stats.thisMonth} réflexion${stats.thisMonth > 1 ? 's' : ''} ce mois-ci`
                            : 'Commence à écrire tes réflexions !'}
                        </p>
                        <p className="text-purple-400 text-xs">
                          +{stats.xpThisMonth} XP gagnés par l&apos;introspection
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showStats ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Detailed Stats */}
                  <AnimatePresence>
                    {showStats && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-4 border-t border-purple-500/20">
                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                            <div className="text-center p-3 rounded-lg bg-slate-800/50">
                              <div className="text-2xl font-black text-white">{stats.total}</div>
                              <div className="text-xs text-slate-400">Total</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-slate-800/50">
                              <div className="text-2xl font-black text-amber-400">{stats.xpEarned}</div>
                              <div className="text-xs text-slate-400">XP gagnés</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-slate-800/50">
                              <div className="text-2xl font-black text-orange-400 flex items-center justify-center gap-1">
                                <Flame className="w-5 h-5" />
                                {stats.streak}
                              </div>
                              <div className="text-xs text-slate-400">Jours de suite</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-slate-800/50">
                              <div className="text-2xl font-black text-purple-400">{stats.thisWeek}</div>
                              <div className="text-xs text-slate-400">Cette semaine</div>
                            </div>
                          </div>

                          {/* Mood Distribution */}
                          {Object.keys(stats.moodCounts).length > 0 && (
                            <div className="mb-4">
                              <p className="text-xs text-slate-400 mb-2">Répartition des humeurs</p>
                              <div className="flex gap-2">
                                {MOOD_OPTIONS.map(mood => {
                                  const count = stats.moodCounts[mood.id] || 0;
                                  const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                                  return (
                                    <div key={mood.id} className="flex-1">
                                      <div className="flex items-center justify-between text-xs mb-1">
                                        <span>{mood.emoji}</span>
                                        <span className="text-slate-400">{percentage}%</span>
                                      </div>
                                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${percentage}%` }}
                                          className={`h-full rounded-full ${mood.color}`}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Top Tags */}
                          {stats.topTags.length > 0 && (
                            <div>
                              <p className="text-xs text-slate-400 mb-2">Thèmes favoris</p>
                              <div className="flex gap-2">
                                {stats.topTags.map((tag, i) => (
                                  <span 
                                    key={tag}
                                    className={`px-3 py-1 rounded-full text-xs ${
                                      i === 0 
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                                        : 'bg-slate-700/50 text-slate-400'
                                    }`}
                                  >
                                    {i === 0 && <Award className="w-3 h-3 inline mr-1" />}
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Encouragement message */}
                          <div className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <p className="text-purple-300 text-xs italic">
                              {stats.streak >= 7 
                                ? `🔥 Incroyable ! ${stats.streak} jours de réflexion consécutifs. Tu incarnes la discipline du Budō.`
                                : stats.streak >= 3 
                                  ? `✨ Belle série ! Continue d'écrire pour renforcer ta pratique.`
                                  : stats.total >= 10 
                                    ? `📝 ${stats.total} réflexions écrites. L'introspection forge le guerrier.`
                                    : `🌱 Chaque réflexion est une graine de sagesse. Continue !`}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Write New Entry Button */}
              {!isWriting && (
                <Button
                  onClick={() => setIsWriting(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white"
                >
                  <PenLine className="w-4 h-4 mr-2" />
                  Écrire une réflexion
                </Button>
              )}

              {/* Writing Form */}
              <AnimatePresence>
                {isWriting && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-4"
                  >
                    {/* Textarea */}
                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">
                        Qu&apos;as-tu appris ou ressenti ?
                      </label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Prends un moment pour réfléchir à ton expérience..."
                        className="w-full h-32 p-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                      />
                    </div>

                    {/* Mood Selection */}
                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">
                        Comment te sens-tu ?
                      </label>
                      <div className="flex gap-2">
                        {MOOD_OPTIONS.map((mood) => (
                          <button
                            key={mood.id}
                            onClick={() => setSelectedMood(mood.id as 'positive' | 'neutral' | 'challenging')}
                            className={`flex-1 p-3 rounded-lg border transition-all ${
                              selectedMood === mood.id
                                ? 'border-purple-500 bg-purple-500/20'
                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                            }`}
                          >
                            <span className="text-2xl block mb-1">{mood.emoji}</span>
                            <span className="text-xs text-slate-400">{mood.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">
                        Thèmes (optionnel)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {TAG_SUGGESTIONS.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1 rounded-full text-xs transition-all ${
                              selectedTags.includes(tag)
                                ? 'bg-purple-500 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsWriting(false)}
                        className="flex-1 border-slate-600 text-slate-400 hover:bg-slate-800"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Annuler
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={!content.trim() || isSaving}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        {isSaving ? 'Enregistrement...' : 'Enregistrer (+5 XP)'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Past Entries */}
              {cityEntries.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm text-slate-400 font-medium">
                    Mes réflexions
                  </h4>
                  {cityEntries.map((entry, index) => {
                    const mood = MOOD_OPTIONS.find(m => m.id === entry.mood);
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-white text-sm leading-relaxed">
                              {entry.content}
                            </p>
                            <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(entry.createdAt)}
                              </span>
                              {mood && (
                                <span className="flex items-center gap-1">
                                  {mood.emoji} {mood.label}
                                </span>
                              )}
                            </div>
                            {entry.tags && entry.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {entry.tags.map(tag => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 text-xs"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {onDeleteEntry && (
                            <button
                              onClick={() => onDeleteEntry(entry.id)}
                              className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Empty State */}
              {cityEntries.length === 0 && !isWriting && (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-slate-400 text-sm">
                    Aucune réflexion pour cette étape.
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    Écris tes pensées et gagne +5 XP !
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ReflectiveJournal;
