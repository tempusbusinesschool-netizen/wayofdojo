'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Circle, Wind, Hand, Shield, Sword, Target, Zap, Lock, CheckCircle2,
  Star, Trophy, BookOpen, ChevronDown, Eye, Play, Filter, Search,
  Sparkles, Award, TrendingUp
} from 'lucide-react';
import type { Mouvement } from '@/data/aikido/types';
import { CATEGORIES_MOUVEMENTS } from '@/data/aikido/techniques-by-grade';
import { TechniqueDetailCard } from './TechniqueDetailCard';

interface TechniqueLibraryProps {
  techniques: Record<string, Mouvement[]>;
  totalCount: number;
  userGrade?: string;
  masteredTechniques?: string[];
}

// Mapping des catégories vers icônes
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'ukemi_base': <Circle className="w-4 h-4" />,
  'ukemi_avance': <Circle className="w-4 h-4" />,
  'tai_sabaki': <Wind className="w-4 h-4" />,
  'deplacement_base': <Wind className="w-4 h-4" />,
  'nage_waza': <Hand className="w-4 h-4" />,
  'osae_waza': <Shield className="w-4 h-4" />,
  'jo_suburi': <Sword className="w-4 h-4" />,
  'jo_kata': <Sword className="w-4 h-4" />,
  'bokken_suburi': <Sword className="w-4 h-4" />,
  'bokken_kata': <Sword className="w-4 h-4" />,
  'tanto_dori': <Target className="w-4 h-4" />,
  'atemi_base': <Zap className="w-4 h-4" />,
  'default': <BookOpen className="w-4 h-4" />
};

// XP par niveau de technique
const XP_BY_LEVEL: Record<string, number> = {
  '6e_kyu': 10,
  '5e_kyu': 15,
  '4e_kyu': 20,
  '3e_kyu': 30,
  '2e_kyu': 40,
  '1er_kyu': 50,
  'shodan': 75,
  'nidan': 100,
  'sandan': 150,
  'yondan': 200,
};

// Filtres disponibles
const FILTER_GROUPS = [
  { id: 'all', label: 'Tout', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'ukemi', label: 'Ukemi', icon: <Circle className="w-4 h-4" /> },
  { id: 'deplacement', label: 'Déplacements', icon: <Wind className="w-4 h-4" /> },
  { id: 'nage', label: 'Projections', icon: <Hand className="w-4 h-4" /> },
  { id: 'osae', label: 'Immobilisations', icon: <Shield className="w-4 h-4" /> },
  { id: 'armes', label: 'Armes', icon: <Sword className="w-4 h-4" /> },
];

export const TechniqueLibrary: React.FC<TechniqueLibraryProps> = ({
  techniques,
  totalCount,
  userGrade = '6e_kyu',
  masteredTechniques = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTechnique, setExpandedTechnique] = useState<string | null>(null);

  // Calculer les stats de progression
  const stats = useMemo(() => {
    const total = totalCount;
    const mastered = masteredTechniques.length;
    const percentage = Math.round((mastered / total) * 100);
    const totalXP = Object.values(techniques).flat().reduce((acc, t) => {
      return acc + (XP_BY_LEVEL[t.niveau] || 10);
    }, 0);
    const earnedXP = masteredTechniques.reduce((acc, id) => {
      const tech = Object.values(techniques).flat().find(t => t.id === id);
      return acc + (tech ? (XP_BY_LEVEL[tech.niveau] || 10) : 0);
    }, 0);
    
    return { total, mastered, percentage, totalXP, earnedXP };
  }, [techniques, totalCount, masteredTechniques]);

  // Filtrer les techniques
  const filteredTechniques = useMemo(() => {
    let filtered = { ...techniques };
    
    // Filtre par groupe
    if (activeFilter !== 'all') {
      filtered = Object.fromEntries(
        Object.entries(techniques).filter(([category]) => {
          if (activeFilter === 'ukemi') return category.includes('ukemi');
          if (activeFilter === 'deplacement') return category.includes('deplacement') || category.includes('tai_sabaki') || category.includes('kamae');
          if (activeFilter === 'nage') return category.includes('nage');
          if (activeFilter === 'osae') return category.includes('osae') || category.includes('kansetsu');
          if (activeFilter === 'armes') return category.includes('jo') || category.includes('bokken') || category.includes('tanto');
          return true;
        })
      );
    }
    
    // Filtre par recherche
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = Object.fromEntries(
        Object.entries(filtered).map(([cat, techs]) => [
          cat,
          techs.filter(t => 
            t.nom.toLowerCase().includes(q) ||
            t.nom_japonais?.toLowerCase().includes(q) ||
            t.traduction?.toLowerCase().includes(q)
          )
        ]).filter(([, techs]) => techs.length > 0)
      );
    }
    
    return filtered;
  }, [techniques, activeFilter, searchQuery]);

  const filteredCount = Object.values(filteredTechniques).flat().length;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
      {/* Background avec texture */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1646910862975-4870af1e1ec3?crop=entropy&cs=srgb&fm=jpg&q=85")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Header de la bibliothèque */}
      <div 
        className="relative bg-gradient-to-r from-slate-900 via-slate-900/95 to-cyan-900/30 p-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        data-testid="technique-library-header"
      >
        <div className="flex items-center justify-between">
          {/* Titre et stats */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                Bibliothèque des Techniques
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-sm text-slate-400">
                {stats.mastered}/{stats.total} techniques maîtrisées
              </p>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="flex items-center gap-6">
            {/* Compteur total */}
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 font-mono">{totalCount}</div>
              <div className="text-xs text-slate-500 uppercase">Techniques</div>
            </div>
            
            {/* Barre XP */}
            <div className="w-32 hidden sm:block">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-amber-400 font-mono flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {stats.earnedXP} XP
                </span>
                <span className="text-slate-500">{stats.totalXP} XP</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.earnedXP / stats.totalXP) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Bouton expand */}
            <div className={`w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Barre de progression des catégories */}
        {!isExpanded && (
          <div className="mt-4 flex gap-1">
            {FILTER_GROUPS.slice(1).map((group, idx) => (
              <div 
                key={group.id}
                className="flex-1 h-1 rounded-full bg-slate-700/50"
                title={group.label}
              >
                <motion.div 
                  className={`h-full rounded-full ${
                    idx === 0 ? 'bg-blue-500' :
                    idx === 1 ? 'bg-emerald-500' :
                    idx === 2 ? 'bg-rose-500' :
                    idx === 3 ? 'bg-amber-500' :
                    'bg-purple-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.random() * 60 + 20}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contenu expandable */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative overflow-hidden"
          >
            {/* Console de filtres */}
            <div className="bg-slate-950/80 backdrop-blur-xl border-y border-white/5 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Filtres par catégorie */}
                <div className="flex flex-wrap gap-2">
                  {FILTER_GROUPS.map((group) => (
                    <button
                      key={group.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilter(group.id);
                      }}
                      data-testid={`filter-${group.id}`}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeFilter === group.id
                          ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                          : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {group.icon}
                      {group.label}
                    </button>
                  ))}
                </div>

                {/* Barre de recherche */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Rechercher une technique..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    data-testid="technique-search"
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-full text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Résultats */}
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  <span className="text-cyan-400 font-bold">{filteredCount}</span> techniques trouvées
                </span>
                <div className="flex items-center gap-2 text-slate-500">
                  <Filter className="w-4 h-4" />
                  {activeFilter !== 'all' && (
                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                      {FILTER_GROUPS.find(f => f.id === activeFilter)?.label}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Grille des techniques */}
            <div className="p-4 bg-gradient-to-b from-slate-900/50 to-slate-950/80 max-h-[600px] overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                {Object.entries(filteredTechniques).map(([category, techs], catIdx) => {
                  const catInfo = CATEGORIES_MOUVEMENTS[category] || {
                    label: category,
                    emoji: '📚',
                    color: 'from-slate-500 to-slate-600'
                  };
                  const icon = CATEGORY_ICONS[category] || CATEGORY_ICONS.default;

                  return (
                    <motion.div 
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: catIdx * 0.05 }}
                      className="space-y-3"
                    >
                      {/* Header de catégorie */}
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${catInfo.color} flex items-center justify-center`}>
                          {icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                            {catInfo.label}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">{techs.length} techniques</span>
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${catInfo.color} rounded-full`}
                              style={{ width: `${Math.min(100, techs.length * 5)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Grille des techniques */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {techs.map((technique, techIdx) => {
                          const isMastered = masteredTechniques.includes(technique.id);
                          const xpValue = XP_BY_LEVEL[technique.niveau] || 10;
                          const isCurrentExpanded = expandedTechnique === technique.id;

                          return (
                            <motion.div
                              key={technique.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: techIdx * 0.02 }}
                              data-testid={`lib-technique-${technique.id}`}
                            >
                              {/* Carte technique */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedTechnique(isCurrentExpanded ? null : technique.id);
                                }}
                                className={`relative overflow-hidden rounded-xl border cursor-pointer transition-all duration-300 ${
                                  isMastered 
                                    ? 'bg-gradient-to-br from-emerald-900/30 to-emerald-950/50 border-emerald-500/30 hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                                    : 'bg-slate-900/80 border-slate-700/50 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                                } ${isCurrentExpanded ? 'ring-2 ring-cyan-500' : ''}`}
                              >
                                <div className="p-3">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-white truncate">
                                          {technique.nom}
                                        </span>
                                        {isMastered && (
                                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        )}
                                      </div>
                                      {technique.nom_japonais && (
                                        <p className="text-xs text-amber-400/80 truncate">
                                          {technique.nom_japonais}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                      <Zap className="w-3 h-3" />
                                      {xpValue}
                                    </div>
                                  </div>
                                  
                                  {/* Niveau */}
                                  <div className="mt-2 flex items-center justify-between">
                                    <span className="text-xs text-slate-500 uppercase">
                                      {technique.niveau?.replace('_', ' ')}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isCurrentExpanded ? 'rotate-180' : ''}`} />
                                  </div>
                                </div>

                                {/* Détails expandables */}
                                <AnimatePresence>
                                  {isCurrentExpanded && (
                                    <motion.div
                                      initial={{ height: 0 }}
                                      animate={{ height: 'auto' }}
                                      exit={{ height: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="p-3 pt-0 border-t border-slate-700/50 space-y-2">
                                        {technique.description && (
                                          <p className="text-xs text-slate-300 leading-relaxed">
                                            {technique.description}
                                          </p>
                                        )}
                                        
                                        {technique.points_cles && technique.points_cles.length > 0 && (
                                          <div>
                                            <p className="text-xs font-bold text-emerald-400 mb-1">Points clés :</p>
                                            <ul className="space-y-1">
                                              {technique.points_cles.slice(0, 3).map((point, idx) => (
                                                <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                                                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
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
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Footer avec stats */}
            <div className="bg-slate-950/90 backdrop-blur-xl border-t border-white/5 p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Trophy className="w-4 h-4" />
                    <span>{stats.mastered} maîtrisées</span>
                  </div>
                  <div className="flex items-center gap-2 text-cyan-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>{stats.percentage}% de progression</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-amber-400 font-mono">
                  <Award className="w-4 h-4" />
                  <span>{stats.earnedXP} / {stats.totalXP} XP</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Style pour la scrollbar personnalisée */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
};

export default TechniqueLibrary;
