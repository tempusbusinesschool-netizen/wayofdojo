/**
 * 🎯 TECHNIQUES SECTION VIEWER
 * 
 * Composant générique pour afficher les techniques dans les différentes
 * sections du dashboard admin (Armes, Mouvements, etc.)
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ChevronDown, ChevronRight, 
  Play, Video, Image, BookOpen, AlertCircle,
  Award, Target, Zap, Users
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Mapping des couleurs par catégorie
const categoryColors = {
  jo: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400', badge: 'bg-orange-500' },
  bokken: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', badge: 'bg-red-500' },
  tanto: { bg: 'bg-rose-500/20', border: 'border-rose-500/50', text: 'text-rose-400', badge: 'bg-rose-500' },
  tai_sabaki: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', text: 'text-cyan-400', badge: 'bg-cyan-500' },
  ukemi: { bg: 'bg-sky-500/20', border: 'border-sky-500/50', text: 'text-sky-400', badge: 'bg-sky-500' },
  kamae: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', badge: 'bg-emerald-500' },
  atemi: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', badge: 'bg-red-500' },
  kokyu_waza: { bg: 'bg-violet-500/20', border: 'border-violet-500/50', text: 'text-violet-400', badge: 'bg-violet-500' },
  kansetsu_waza: { bg: 'bg-rose-500/20', border: 'border-rose-500/50', text: 'text-rose-400', badge: 'bg-rose-500' },
  suwariwaza: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', badge: 'bg-amber-500' },
  hanmi_handachi: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400', badge: 'bg-orange-500' },
  default: { bg: 'bg-slate-500/20', border: 'border-slate-500/50', text: 'text-slate-400', badge: 'bg-slate-500' }
};

// Mapping des niveaux en français
const niveauLabels = {
  '6e_kyu': '6ème Kyu',
  '5e_kyu': '5ème Kyu',
  '4e_kyu': '4ème Kyu',
  '3e_kyu': '3ème Kyu',
  '2e_kyu': '2ème Kyu',
  '1er_kyu': '1er Kyu',
  'shodan': '1er Dan',
  'nidan': '2ème Dan',
  'sandan': '3ème Dan',
  'yondan': '4ème Dan'
};

/**
 * Carte individuelle pour une technique
 */
const TechniqueCard = ({ technique, category, expanded, onToggle }) => {
  const colors = categoryColors[category] || categoryColors.default;
  const hasVideo = technique.video?.url || technique.video?.placeholder;
  const hasAnimation = technique.animation?.images?.some(img => img !== null);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${colors.bg} border ${colors.border} rounded-xl overflow-hidden hover:shadow-lg transition-all`}
    >
      {/* En-tête cliquable */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-4 text-left"
      >
        {/* Numéro ou ordre */}
        {technique.ordre && (
          <div className={`w-8 h-8 rounded-lg ${colors.badge} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white text-sm font-bold">{technique.ordre}</span>
          </div>
        )}
        
        {/* Contenu principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white font-semibold">{technique.nom}</h4>
            {technique.nom_japonais && (
              <span className="text-slate-500 text-sm">({technique.nom_japonais})</span>
            )}
          </div>
          
          {technique.traduction && (
            <p className="text-slate-400 text-sm italic mb-1">"{technique.traduction}"</p>
          )}
          
          <p className="text-slate-400 text-sm line-clamp-2">
            {technique.description}
          </p>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            {technique.niveau && (
              <span className="px-2 py-0.5 bg-slate-700/50 rounded text-xs text-slate-300">
                <Award className="w-3 h-3 inline mr-1" />
                {niveauLabels[technique.niveau] || technique.niveau}
              </span>
            )}
            {technique.categorie && (
              <span className={`px-2 py-0.5 rounded text-xs ${colors.text} bg-slate-700/50`}>
                {technique.categorie.replace(/_/g, ' ')}
              </span>
            )}
            {hasVideo && (
              <span className="px-2 py-0.5 bg-violet-500/20 rounded text-xs text-violet-400">
                <Video className="w-3 h-3 inline mr-1" />
                Vidéo
              </span>
            )}
          </div>
        </div>
        
        {/* Chevron */}
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Détails expandés */}
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
              {technique.points_cles && technique.points_cles.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Points clés
                  </h5>
                  <ul className="space-y-1">
                    {technique.points_cles.map((point, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Erreurs communes */}
              {technique.erreurs_communes && technique.erreurs_communes.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Erreurs à éviter
                  </h5>
                  <ul className="space-y-1">
                    {technique.erreurs_communes.map((erreur, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                        {erreur}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Phases techniques (pour les techniques avec phase1, phase2, phase3) */}
              {technique.phase1 && (
                <div>
                  <h5 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Structure technique
                  </h5>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                      <p className="text-xs text-slate-500 mb-1">Phase 1</p>
                      <p className="text-sm text-slate-300">
                        {technique.phase1.deplacement?.replace(/_/g, ' ') || '-'}
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                      <p className="text-xs text-slate-500 mb-1">Phase 2</p>
                      <p className="text-sm text-slate-300">
                        {technique.phase2.technique?.replace(/_/g, ' ') || '-'}
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                      <p className="text-xs text-slate-500 mb-1">Phase 3</p>
                      <p className="text-sm text-slate-300">
                        {technique.phase3.final?.replace(/_/g, ' ') || '-'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Placeholder vidéo */}
              {hasVideo && (
                <div className="bg-slate-800/50 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <Play className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Vidéo disponible</p>
                    <p className="text-xs text-slate-400 font-mono">
                      {technique.video?.placeholder || 'Emplacement réservé'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * Composant principal - Afficheur de section techniques
 */
const TechniquesSectionViewer = ({ 
  techniques = [], 
  category = 'default',
  title = 'Techniques',
  subtitle = '',
  icon: Icon = BookOpen
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  
  const colors = categoryColors[category] || categoryColors.default;
  
  // Extraire les niveaux uniques
  const levels = useMemo(() => {
    const uniqueLevels = [...new Set(techniques.map(t => t.niveau || t.level || t.kyu).filter(Boolean))];
    return uniqueLevels.sort((a, b) => {
      const order = ['6e_kyu', '5e_kyu', '4e_kyu', '3e_kyu', '2e_kyu', '1er_kyu', 'shodan', 'nidan', 'sandan', 'yondan'];
      return order.indexOf(a) - order.indexOf(b);
    });
  }, [techniques]);
  
  // Filtrer les techniques
  const filteredTechniques = useMemo(() => {
    return techniques.filter(t => {
      const matchesSearch = searchTerm === '' || 
        t.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.nom_japonais?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const level = t.niveau || t.level || t.kyu;
      const matchesLevel = selectedLevel === 'all' || level === selectedLevel;
      
      return matchesSearch && matchesLevel;
    });
  }, [techniques, searchTerm, selectedLevel]);
  
  // Grouper par catégorie si disponible
  const groupedTechniques = useMemo(() => {
    const groups = {};
    filteredTechniques.forEach(t => {
      const cat = t.categorie || 'Général';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(t);
    });
    return groups;
  }, [filteredTechniques]);
  
  const hasCategories = Object.keys(groupedTechniques).length > 1;
  
  return (
    <div className="p-6">
      {/* En-tête avec stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Icon className={`w-6 h-6 ${colors.text}`} />
            {title}
          </h3>
          {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl ${colors.bg} border ${colors.border}`}>
            <span className={`text-2xl font-bold ${colors.text}`}>{techniques.length}</span>
            <span className="text-slate-400 text-sm ml-2">techniques</span>
          </div>
        </div>
      </div>
      
      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Rechercher une technique..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white"
          />
        </div>
        
        {levels.length > 1 && (
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white"
          >
            <option value="all">Tous les niveaux</option>
            {levels.map(level => (
              <option key={level} value={level}>
                {niveauLabels[level] || level}
              </option>
            ))}
          </select>
        )}
      </div>
      
      {/* Résultats */}
      {filteredTechniques.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Aucune technique trouvée</p>
        </div>
      ) : hasCategories ? (
        // Affichage groupé par catégorie
        <div className="space-y-8">
          {Object.entries(groupedTechniques).map(([cat, techs]) => (
            <div key={cat}>
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${colors.badge}`}></span>
                {cat.replace(/_/g, ' ')}
                <span className="text-sm text-slate-500 font-normal">({techs.length})</span>
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {techs.map(technique => (
                  <TechniqueCard
                    key={technique.id}
                    technique={technique}
                    category={category}
                    expanded={expandedId === technique.id}
                    onToggle={() => setExpandedId(expandedId === technique.id ? null : technique.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Affichage simple en grille
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTechniques.map(technique => (
            <TechniqueCard
              key={technique.id}
              technique={technique}
              category={category}
              expanded={expandedId === technique.id}
              onToggle={() => setExpandedId(expandedId === technique.id ? null : technique.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TechniquesSectionViewer;
