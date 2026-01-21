'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Home, BookOpen, Swords, 
  Target, Activity, Shield, Wind,
  ChevronDown, ChevronUp, Play, Info,
  Loader2, Sparkles, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import MaitreTanaka from '@/components/MaitreTanaka';
import { TechniqueCelebration } from '@/components/animations';

// Import des données migrées
import { 
  UKEMI, UKEMI_STATS,
  KANSETSU_WAZA, KANSETSU_WAZA_STATS,
  TAI_SABAKI, TAI_SABAKI_STATS,
  TECHNIQUES_JO, JO_STATISTICS,
  TECHNIQUES_TANTO, TANTO_STATISTICS,
  TECHNIQUES_BOKKEN, BOKKEN_STATISTICS,
  Mouvement, TechniqueArme
} from '@/data/aikido';

// Types
type MasteryLevel = 'not_started' | 'learning' | 'practicing' | 'mastered';

interface CategoryConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  data: (Mouvement | TechniqueArme)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stats: any;
  description: string;
  categoryType: 'mouvement' | 'arme';
}

// Configuration des niveaux de maîtrise
const MASTERY_LEVELS: { id: MasteryLevel; label: string; emoji: string; color: string; bg: string; xp: number }[] = [
  { id: 'not_started', label: 'Non démarré', emoji: '⬜', color: 'text-slate-400', bg: 'bg-slate-700/50', xp: 0 },
  { id: 'learning', label: 'En apprentissage', emoji: '📖', color: 'text-blue-400', bg: 'bg-blue-500/20', xp: 5 },
  { id: 'practicing', label: 'En pratique', emoji: '🔄', color: 'text-amber-400', bg: 'bg-amber-500/20', xp: 15 },
  { id: 'mastered', label: 'Maîtrisé', emoji: '✅', color: 'text-emerald-400', bg: 'bg-emerald-500/20', xp: 30 },
];

// Configuration des catégories
const CATEGORIES: CategoryConfig[] = [
  { 
    id: 'ukemi', 
    label: 'Ukemi (Chutes)', 
    icon: Activity, 
    color: 'from-cyan-500 to-cyan-700',
    data: UKEMI,
    stats: UKEMI_STATS,
    description: 'Les techniques de chute essentielles pour recevoir les projections en sécurité',
    categoryType: 'mouvement'
  },
  { 
    id: 'tai_sabaki', 
    label: 'Tai Sabaki (Déplacements)', 
    icon: Wind, 
    color: 'from-purple-500 to-purple-700',
    data: TAI_SABAKI,
    stats: TAI_SABAKI_STATS,
    description: 'Les mouvements du corps pour esquiver, entrer et rediriger',
    categoryType: 'mouvement'
  },
  { 
    id: 'kansetsu_waza', 
    label: 'Kansetsu Waza (Techniques)', 
    icon: Target, 
    color: 'from-emerald-500 to-emerald-700',
    data: KANSETSU_WAZA,
    stats: KANSETSU_WAZA_STATS,
    description: 'Les techniques articulaires et projections fondamentales',
    categoryType: 'mouvement'
  },
  { 
    id: 'jo', 
    label: 'Jo (Bâton)', 
    icon: Swords, 
    color: 'from-amber-500 to-amber-700',
    data: TECHNIQUES_JO,
    stats: JO_STATISTICS,
    description: 'Les techniques au bâton de 128 cm : suburi, kata, kumijo',
    categoryType: 'arme'
  },
  { 
    id: 'tanto', 
    label: 'Tanto Dori (Couteau)', 
    icon: Shield, 
    color: 'from-red-500 to-red-700',
    data: TECHNIQUES_TANTO,
    stats: TANTO_STATISTICS,
    description: 'Les défenses contre attaque au couteau',
    categoryType: 'arme'
  },
  { 
    id: 'bokken', 
    label: 'Bokken (Sabre)', 
    icon: Swords, 
    color: 'from-slate-500 to-slate-700',
    data: TECHNIQUES_BOKKEN,
    stats: BOKKEN_STATISTICS,
    description: 'Les techniques au sabre de bois : suburi, kumitachi, tachi dori',
    categoryType: 'arme'
  },
];

// Niveaux avec couleurs
const NIVEAU_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  '6e_kyu': { bg: 'bg-gray-200', text: 'text-gray-800', label: '6e Kyu' },
  '5e_kyu': { bg: 'bg-yellow-400', text: 'text-yellow-900', label: '5e Kyu' },
  '4e_kyu': { bg: 'bg-orange-400', text: 'text-orange-900', label: '4e Kyu' },
  '3e_kyu': { bg: 'bg-green-500', text: 'text-white', label: '3e Kyu' },
  '2e_kyu': { bg: 'bg-blue-500', text: 'text-white', label: '2e Kyu' },
  '1er_kyu': { bg: 'bg-amber-700', text: 'text-white', label: '1er Kyu' },
  'shodan': { bg: 'bg-slate-900', text: 'text-white', label: 'Shodan' },
  'nidan': { bg: 'bg-slate-800', text: 'text-white', label: 'Nidan' },
  'sandan': { bg: 'bg-slate-700', text: 'text-white', label: 'Sandan' },
};

// Composant carte mouvement avec progression
function MouvementCard({ 
  item, 
  index, 
  mastery, 
  onMasteryChange, 
  isUpdating,
  categoryType 
}: { 
  item: Mouvement; 
  index: number; 
  mastery: MasteryLevel;
  onMasteryChange: (id: string, level: MasteryLevel) => void;
  isUpdating: boolean;
  categoryType: 'mouvement' | 'arme';
}) {
  const [expanded, setExpanded] = useState(false);
  const niveauConfig = NIVEAU_COLORS[item.niveau] || NIVEAU_COLORS['6e_kyu'];
  const masteryConfig = MASTERY_LEVELS.find(l => l.id === mastery)!;
  
  const prefixedId = categoryType === 'mouvement' ? `mvt_${item.id}` : `arme_${item.id}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`relative bg-slate-800/50 rounded-xl border overflow-hidden hover:border-slate-500 transition-all ${
        mastery === 'mastered' 
          ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' 
          : 'border-slate-700'
      }`}
    >
      {/* Badge de maîtrise */}
      <div className="absolute -top-1 -right-1 z-10">
        <span className={`text-xl ${masteryConfig.color}`}>{masteryConfig.emoji}</span>
      </div>
      
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3 pr-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-white">{item.nom}</h4>
              <span className={`px-2 py-0.5 rounded-full text-xs ${niveauConfig.bg} ${niveauConfig.text}`}>
                {niveauConfig.label}
              </span>
            </div>
            <p className="text-cyan-400 text-sm font-mono">{item.nom_japonais}</p>
            <p className="text-slate-500 text-xs italic">{item.traduction}</p>
          </div>
          <button className="text-slate-400 hover:text-white p-1">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
        
        <p className="text-slate-300 text-sm mt-2 line-clamp-2">{item.description}</p>
        
        {/* Boutons de maîtrise */}
        <div className="flex gap-1 mt-3" onClick={(e) => e.stopPropagation()}>
          {MASTERY_LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => onMasteryChange(prefixedId, level.id)}
              disabled={isUpdating}
              className={`flex-1 py-1.5 rounded text-xs transition-all flex items-center justify-center gap-1 ${
                mastery === level.id
                  ? `${level.bg} ${level.color} ring-1 ring-current`
                  : 'bg-slate-700/50 text-slate-500 hover:bg-slate-700 hover:text-slate-300'
              } ${isUpdating ? 'opacity-50 cursor-wait' : ''}`}
              title={`${level.label} (+${level.xp} XP)`}
            >
              <span>{level.emoji}</span>
            </button>
          ))}
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-700"
          >
            <div className="p-4 space-y-4">
              {/* Points clés */}
              {item.points_cles && item.points_cles.length > 0 && (
                <div>
                  <h5 className="text-emerald-400 text-sm font-semibold mb-2 flex items-center gap-1">
                    <Target className="w-4 h-4" /> Points clés
                  </h5>
                  <ul className="space-y-1">
                    {item.points_cles.map((point, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Erreurs communes */}
              {item.erreurs_communes && item.erreurs_communes.length > 0 && (
                <div>
                  <h5 className="text-red-400 text-sm font-semibold mb-2 flex items-center gap-1">
                    <Info className="w-4 h-4" /> Erreurs à éviter
                  </h5>
                  <ul className="space-y-1">
                    {item.erreurs_communes.map((erreur, i) => (
                      <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                        <span className="text-red-400">✗</span>
                        {erreur}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Applications */}
              {item.applications && item.applications.length > 0 && (
                <div>
                  <h5 className="text-amber-400 text-sm font-semibold mb-2">Applications</h5>
                  <div className="flex flex-wrap gap-2">
                    {item.applications.map((app, i) => (
                      <span key={i} className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Vidéo placeholder */}
              {item.video?.placeholder && (
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Play className="w-4 h-4" />
                  <span>Vidéo à venir</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Composant carte technique arme avec progression
function TechniqueArmeCard({ 
  item, 
  index,
  mastery,
  onMasteryChange,
  isUpdating,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  categoryType
}: { 
  item: TechniqueArme; 
  index: number;
  mastery: MasteryLevel;
  onMasteryChange: (id: string, level: MasteryLevel) => void;
  isUpdating: boolean;
  categoryType: 'mouvement' | 'arme';
}) {
  const [expanded, setExpanded] = useState(false);
  const niveauConfig = NIVEAU_COLORS[item.niveau] || NIVEAU_COLORS['6e_kyu'];
  const masteryConfig = MASTERY_LEVELS.find(l => l.id === mastery)!;
  
  const prefixedId = `arme_${item.id}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`relative bg-slate-800/50 rounded-xl border overflow-hidden hover:border-slate-500 transition-all ${
        mastery === 'mastered' 
          ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' 
          : 'border-slate-700'
      }`}
    >
      {/* Badge de maîtrise */}
      <div className="absolute -top-1 -right-1 z-10">
        <span className={`text-xl ${masteryConfig.color}`}>{masteryConfig.emoji}</span>
      </div>
      
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3 pr-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-white">{item.nom}</h4>
              <span className={`px-2 py-0.5 rounded-full text-xs ${niveauConfig.bg} ${niveauConfig.text}`}>
                {niveauConfig.label}
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-1">{item.description}</p>
          </div>
          <button className="text-slate-400 hover:text-white p-1">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Boutons de maîtrise */}
        <div className="flex gap-1 mt-3" onClick={(e) => e.stopPropagation()}>
          {MASTERY_LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => onMasteryChange(prefixedId, level.id)}
              disabled={isUpdating}
              className={`flex-1 py-1.5 rounded text-xs transition-all flex items-center justify-center gap-1 ${
                mastery === level.id
                  ? `${level.bg} ${level.color} ring-1 ring-current`
                  : 'bg-slate-700/50 text-slate-500 hover:bg-slate-700 hover:text-slate-300'
              } ${isUpdating ? 'opacity-50 cursor-wait' : ''}`}
              title={`${level.label} (+${level.xp} XP)`}
            >
              <span>{level.emoji}</span>
            </button>
          ))}
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-700"
          >
            <div className="p-4 space-y-3">
              {/* Phases */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-700/50 rounded-lg p-2">
                  <p className="text-xs text-slate-500 mb-1">Phase 1</p>
                  <p className="text-cyan-400 text-sm font-mono">
                    {item.phase1.attaque || 'Solo'}
                  </p>
                  <p className="text-slate-400 text-xs">{item.phase1.deplacement}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-2">
                  <p className="text-xs text-slate-500 mb-1">Phase 2</p>
                  <p className="text-emerald-400 text-sm font-mono">{item.phase2.technique}</p>
                  {item.phase2.direction && (
                    <p className="text-slate-400 text-xs">{item.phase2.direction}</p>
                  )}
                </div>
                <div className="bg-slate-700/50 rounded-lg p-2">
                  <p className="text-xs text-slate-500 mb-1">Phase 3</p>
                  <p className="text-amber-400 text-sm font-mono">{item.phase3.final}</p>
                  <p className="text-slate-400 text-xs">{item.phase3.type}</p>
                </div>
              </div>
              
              {/* Points clés */}
              {item.points_cles && item.points_cles.length > 0 && (
                <div>
                  <h5 className="text-emerald-400 text-sm font-semibold mb-2">Points clés</h5>
                  <ul className="space-y-1">
                    {item.points_cles.map((point, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MouvementsPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string || 'fr';
  const sport = params.sport as string || 'aikido';
  
  const [selectedCategory, setSelectedCategory] = useState('ukemi');
  const [searchQuery, setSearchQuery] = useState('');
  const [masteryFilter, setMasteryFilter] = useState<MasteryLevel | null>(null);
  const [masteryLevels, setMasteryLevels] = useState<Record<string, MasteryLevel>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const currentCategory = CATEGORIES.find(c => c.id === selectedCategory)!;
  const Icon = currentCategory.icon;

  // Charger la progression depuis le backend
  const loadProgress = useCallback(async () => {
    const token = localStorage.getItem('wayofdojo_token');
    if (!token) {
      setIsLoading(false);
      setIsLoggedIn(false);
      // Load from localStorage as fallback
      const localProgress = localStorage.getItem('wayofdojo_mouvement_progress');
      if (localProgress) {
        setMasteryLevels(JSON.parse(localProgress));
      }
      return;
    }
    
    setIsLoggedIn(true);
    
    try {
      const response = await fetch('/api/gamification/mouvement', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMasteryLevels(data.progress || {});
        }
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
      // Fallback to localStorage
      const localProgress = localStorage.getItem('wayofdojo_mouvement_progress');
      if (localProgress) {
        setMasteryLevels(JSON.parse(localProgress));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Mettre à jour la maîtrise
  const handleMasteryChange = async (itemId: string, level: MasteryLevel) => {
    const previousLevel = masteryLevels[itemId] || 'not_started';
    if (previousLevel === level) return;
    
    setUpdatingId(itemId);
    
    // Optimistic update
    const newLevels = { ...masteryLevels };
    if (level === 'not_started') {
      delete newLevels[itemId];
    } else {
      newLevels[itemId] = level;
    }
    setMasteryLevels(newLevels);
    
    // Save to localStorage as backup
    localStorage.setItem('wayofdojo_mouvement_progress', JSON.stringify(newLevels));
    
    const token = localStorage.getItem('wayofdojo_token');
    if (!token) {
      setUpdatingId(null);
      return;
    }
    
    try {
      const response = await fetch('/api/gamification/mouvement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          mouvementId: itemId,
          status: level,
          category: selectedCategory,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.mouvement.xpEarned > 0) {
          setXpGained(data.mouvement.xpEarned);
          setShowXpAnimation(true);
          setTimeout(() => setShowXpAnimation(false), 2000);
        }
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
      // Revert on error
      setMasteryLevels({ ...masteryLevels, [itemId]: previousLevel });
    } finally {
      setUpdatingId(null);
    }
  };

  // Calculer les stats de progression par catégorie
  const getCategoryStats = (category: CategoryConfig) => {
    const prefix = category.categoryType === 'mouvement' ? 'mvt_' : 'arme_';
    let mastered = 0;
    let practicing = 0;
    let learning = 0;
    
    category.data.forEach(item => {
      const key = `${prefix}${item.id}`;
      const level = masteryLevels[key];
      if (level === 'mastered') mastered++;
      else if (level === 'practicing') practicing++;
      else if (level === 'learning') learning++;
    });
    
    return { mastered, practicing, learning, total: category.data.length };
  };

  // Calculer les stats globales
  const globalStats = CATEGORIES.reduce((acc, cat) => {
    const stats = getCategoryStats(cat);
    acc.mastered += stats.mastered;
    acc.practicing += stats.practicing;
    acc.learning += stats.learning;
    acc.total += stats.total;
    return acc;
  }, { mastered: 0, practicing: 0, learning: 0, total: 0 });

  const globalProgress = globalStats.total > 0 ? Math.round((globalStats.mastered / globalStats.total) * 100) : 0;
  const categoryStats = getCategoryStats(currentCategory);
  const categoryProgress = categoryStats.total > 0 ? Math.round((categoryStats.mastered / categoryStats.total) * 100) : 0;
  
  // Filtrer les données
  const filteredData = currentCategory.data.filter((item: Mouvement | TechniqueArme) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        item.nom.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        ('nom_japonais' in item && item.nom_japonais?.toLowerCase().includes(query))
      );
      if (!matchesSearch) return false;
    }
    
    // Mastery filter
    if (masteryFilter) {
      const prefix = currentCategory.categoryType === 'mouvement' ? 'mvt_' : 'arme_';
      const key = `${prefix}${item.id}`;
      const level = masteryLevels[key] || 'not_started';
      if (level !== masteryFilter) return false;
    }
    
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* XP Animation */}
      <AnimatePresence>
        {showXpAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: -30 }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed top-1/3 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="text-3xl font-black text-amber-400 flex items-center gap-2 bg-slate-900/90 px-4 py-2 rounded-full">
              <Sparkles className="w-6 h-6" />
              +{xpGained} XP
              <Sparkles className="w-6 h-6" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div className="h-6 w-px bg-slate-700" />
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h1 className="text-lg font-bold text-white">Mouvements & Armes</h1>
              </div>
            </div>
            <Link href={`/${locale}/${sport}/dojo`}>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Home className="w-4 h-4 mr-2" />
                Mon Dojo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats globales avec progression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                📚 Ma Progression
                {!isLoggedIn && (
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">
                    Connectez-vous pour sauvegarder
                  </span>
                )}
              </h2>
              <p className="text-slate-400 mb-3">
                {globalStats.mastered}/{globalStats.total} techniques maîtrisées
              </p>
              {/* Barre de progression globale */}
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${globalProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                />
              </div>
              <p className="text-emerald-400 text-sm mt-1 font-semibold">{globalProgress}% complété</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{globalStats.mastered}</p>
                <p className="text-slate-400 text-xs">Maîtrisées</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-400">{globalStats.practicing}</p>
                <p className="text-slate-400 text-xs">En pratique</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{globalStats.learning}</p>
                <p className="text-slate-400 text-xs">En cours</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-400">{globalStats.total - globalStats.mastered - globalStats.practicing - globalStats.learning}</p>
                <p className="text-slate-400 text-xs">À découvrir</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sélecteur de catégorie avec progression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => {
              const CatIcon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              const stats = getCategoryStats(cat);
              const progress = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 rounded-xl border transition-all relative overflow-hidden ${
                    isSelected
                      ? `bg-gradient-to-br ${cat.color} border-transparent text-white`
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {/* Mini progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/50">
                    <div 
                      className={`h-full ${isSelected ? 'bg-white/50' : 'bg-emerald-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  <CatIcon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <p className="text-xs font-medium text-center">{cat.label.split(' ')[0]}</p>
                  <p className="text-xs text-center opacity-70">
                    {stats.mastered}/{stats.total}
                  </p>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* En-tête de catégorie avec progression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`mb-6 bg-gradient-to-r ${currentCategory.color} rounded-2xl p-6`}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white">{currentCategory.label}</h3>
              <p className="text-white/80 text-sm">{currentCategory.description}</p>
              {/* Barre de progression catégorie */}
              <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${categoryProgress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-white">{categoryStats.mastered}/{categoryStats.total}</p>
              <p className="text-white/70 text-sm">maîtrisées</p>
            </div>
          </div>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 flex flex-col sm:flex-row gap-4"
        >
          {/* Recherche */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          {/* Filtres de maîtrise */}
          <div className="flex gap-2 items-center">
            <Filter className="w-5 h-5 text-slate-400" />
            {MASTERY_LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => setMasteryFilter(masteryFilter === level.id ? null : level.id)}
                className={`px-3 py-2 rounded-xl text-sm flex items-center gap-1 transition-all ${
                  masteryFilter === level.id
                    ? `${level.bg} ${level.color} ring-2 ring-white/30`
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <span>{level.emoji}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Liste des éléments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredData.map((item, index) => {
            const prefix = currentCategory.categoryType === 'mouvement' ? 'mvt_' : 'arme_';
            const key = `${prefix}${item.id}`;
            const mastery = masteryLevels[key] || 'not_started';
            
            return 'nom_japonais' in item ? (
              <MouvementCard 
                key={item.id} 
                item={item as Mouvement} 
                index={index}
                mastery={mastery}
                onMasteryChange={handleMasteryChange}
                isUpdating={updatingId === key}
                categoryType={currentCategory.categoryType}
              />
            ) : (
              <TechniqueArmeCard 
                key={item.id} 
                item={item as TechniqueArme} 
                index={index}
                mastery={mastery}
                onMasteryChange={handleMasteryChange}
                isUpdating={updatingId === key}
                categoryType={currentCategory.categoryType}
              />
            );
          })}
        </div>

        {/* Message si aucun résultat */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Aucun élément trouvé</p>
            <Button
              variant="ghost"
              onClick={() => { setSearchQuery(''); setMasteryFilter(null); }}
              className="mt-4 text-cyan-400"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>

      {/* Maître Tanaka */}
      <MaitreTanaka 
        isVisible={true}
        messages={[
          "La maîtrise vient avec la répétition. Pratique chaque jour !",
          "Les armes développent le Ma-ai, la distance juste.",
          `Tu as maîtrisé ${globalStats.mastered} techniques. Continue ainsi !`,
        ]}
      />
    </div>
  );
}
