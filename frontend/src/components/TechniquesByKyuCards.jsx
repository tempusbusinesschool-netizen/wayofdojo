/**
 * 🥋 MES TECHNIQUES - Version 3.0 - Ceintures Visibles
 * 
 * Interface enfant "Mes techniques" / "voir les techniques"
 * Design avec ceintures colorées bien visibles, navigation claire
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, X, ChevronRight, ChevronLeft, Lock, Trophy, Star,
  CheckCircle2, Target, AlertCircle, Swords, Sparkles, Eye
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Configuration des ceintures par couleur hex
const getBeltConfig = (color, name) => {
  const colorMap = {
    '#FFFFFF': { label: 'Blanche', emoji: '⚪', gradient: 'from-gray-100 to-gray-300', textClass: 'text-gray-800' },
    '#fbbf24': { label: 'Jaune', emoji: '🟡', gradient: 'from-yellow-400 to-amber-500', textClass: 'text-yellow-900' },
    '#f97316': { label: 'Orange', emoji: '🟠', gradient: 'from-orange-400 to-orange-600', textClass: 'text-orange-900' },
    '#22c55e': { label: 'Verte', emoji: '🟢', gradient: 'from-green-400 to-emerald-600', textClass: 'text-green-900' },
    '#3b82f6': { label: 'Bleue', emoji: '🔵', gradient: 'from-blue-400 to-blue-600', textClass: 'text-blue-900' },
    '#92400e': { label: 'Marron', emoji: '🟤', gradient: 'from-amber-700 to-amber-900', textClass: 'text-amber-100' },
    '#000000': { label: 'Noire', emoji: '⚫', gradient: 'from-gray-800 to-black', textClass: 'text-white' }
  };
  
  // Trouver la couleur la plus proche
  const lowerColor = color?.toLowerCase();
  const match = Object.entries(colorMap).find(([hex]) => hex.toLowerCase() === lowerColor);
  
  if (match) return match[1];
  
  // Fallback basé sur le nom
  if (name?.includes('5')) return colorMap['#fbbf24'];
  if (name?.includes('4')) return colorMap['#f97316'];
  if (name?.includes('3')) return colorMap['#22c55e'];
  if (name?.includes('2')) return colorMap['#3b82f6'];
  if (name?.includes('1')) return colorMap['#92400e'];
  
  return colorMap['#FFFFFF'];
};

// Niveaux de maîtrise
const MASTERY_LEVELS = [
  { id: 'not_started', label: 'À découvrir', emoji: '⭕', color: 'text-slate-400', bg: 'bg-slate-700/50', border: 'border-slate-600' },
  { id: 'learning', label: "J'apprends", emoji: '📖', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/50' },
  { id: 'practiced', label: 'Je pratique', emoji: '🥋', color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/50' },
  { id: 'mastered', label: 'Je maîtrise !', emoji: '⭐', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/50' }
];

/**
 * Composant Ceinture visuelle
 */
const BeltVisual = ({ color, size = 'md', showKnot = true }) => {
  const sizes = {
    sm: { width: 60, height: 12, knot: 8 },
    md: { width: 100, height: 18, knot: 12 },
    lg: { width: 140, height: 24, knot: 16 }
  };
  const s = sizes[size];
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: s.width, height: s.height * 2 }}>
      {/* Ceinture principale */}
      <div 
        className="absolute rounded-full shadow-lg"
        style={{ 
          width: s.width, 
          height: s.height, 
          backgroundColor: color || '#FFFFFF',
          border: color === '#FFFFFF' ? '2px solid #e5e7eb' : 'none',
          boxShadow: `0 4px 12px ${color}40`
        }}
      />
      {/* Noeud */}
      {showKnot && (
        <div 
          className="absolute rounded-full z-10 shadow-md"
          style={{ 
            width: s.knot, 
            height: s.knot * 1.5, 
            backgroundColor: color || '#FFFFFF',
            border: color === '#FFFFFF' ? '2px solid #d1d5db' : 'none',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        />
      )}
    </div>
  );
};

/**
 * Carte de grade dans le sélecteur
 */
const GradeCard = ({ grade, index, isSelected, stats, onClick }) => {
  const config = getBeltConfig(grade.color, grade.name);
  const isComplete = stats.percent === 100;
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative p-4 rounded-2xl transition-all min-w-[160px] border-2
        ${isSelected 
          ? `bg-gradient-to-br ${config.gradient} border-white/50 shadow-2xl` 
          : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
        }
      `}
    >
      {/* Badge complété */}
      {isComplete && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-amber-500 rounded-full p-1.5 shadow-lg"
        >
          <Trophy className="w-4 h-4 text-white" />
        </motion.div>
      )}
      
      <div className="flex flex-col items-center gap-2">
        {/* Ceinture visuelle */}
        <BeltVisual color={grade.color} size="md" />
        
        {/* Nom du grade */}
        <div className="text-center mt-1">
          <p className={`font-bold text-lg ${isSelected ? config.textClass : 'text-white'}`}>
            {grade.name}
          </p>
          <p className={`text-xs ${isSelected ? config.textClass + '/80' : 'text-slate-400'}`}>
            Ceinture {config.label}
          </p>
        </div>
        
        {/* Progression */}
        <div className="w-full mt-2">
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${isSelected ? 'bg-white/90' : 'bg-cyan-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${stats.percent}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
          </div>
          <p className={`text-xs mt-1 text-center ${isSelected ? config.textClass + '/80' : 'text-slate-500'}`}>
            {stats.mastered}/{stats.total} maîtrisées
          </p>
        </div>
      </div>
    </motion.button>
  );
};

/**
 * Carte de technique
 */
const TechniqueCard = ({ technique, index, mastery, onClick }) => {
  const masteryInfo = MASTERY_LEVELS.find(l => l.id === mastery) || MASTERY_LEVELS[0];
  const isMastered = mastery === 'mastered';
  const isLearning = mastery === 'learning';
  const isPracticed = mastery === 'practiced';
  
  return (
    <motion.button
      onClick={() => onClick(technique)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      whileHover={{ scale: 1.01, x: 4 }}
      className={`
        relative w-full p-4 rounded-xl text-left transition-all border-2 flex items-center gap-4
        ${masteryInfo.bg} ${masteryInfo.border}
        hover:shadow-lg
      `}
    >
      {/* Numéro/Statut */}
      <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0
        ${isMastered 
          ? 'bg-emerald-500 text-white' 
          : isPracticed
            ? 'bg-cyan-500 text-white'
            : isLearning
              ? 'bg-amber-500 text-white'
              : 'bg-slate-700 text-slate-300'
        }
      `}>
        {isMastered ? <Star className="w-6 h-6" /> : index + 1}
      </div>
      
      {/* Infos */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-bold text-white text-sm">{technique.name}</h4>
          <span className={`text-xs ${masteryInfo.color}`}>{masteryInfo.emoji} {masteryInfo.label}</span>
        </div>
        {technique.description && (
          <p className="text-slate-400 text-xs mt-1 line-clamp-1">{technique.description}</p>
        )}
      </div>
      
      {/* Action */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Eye className="w-4 h-4 text-slate-400" />
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>
    </motion.button>
  );
};

/**
 * Panneau de détail technique
 */
const TechniqueDetailPanel = ({ technique, mastery, onMasteryChange, onClose, userName }) => {
  const masteryInfo = MASTERY_LEVELS.find(l => l.id === mastery) || MASTERY_LEVELS[0];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="absolute inset-0 bg-slate-900/98 backdrop-blur-sm z-20 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center gap-3">
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex-1">
          <h3 className="font-bold text-white">{technique.name}</h3>
          <p className="text-cyan-100 text-xs">{technique.japanese_name || ''}</p>
        </div>
      </div>
      
      {/* Contenu */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Niveau actuel */}
        <div className={`p-4 rounded-xl ${masteryInfo.bg} border ${masteryInfo.border}`}>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{masteryInfo.emoji}</span>
            <div>
              <p className="text-xs text-slate-400">Mon niveau</p>
              <p className={`font-bold text-xl ${masteryInfo.color}`}>{masteryInfo.label}</p>
            </div>
          </div>
        </div>
        
        {/* Description */}
        {technique.description && (
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Description
            </h4>
            <p className="text-white text-sm">{technique.description}</p>
          </div>
        )}
        
        {/* Points clés */}
        {technique.key_points?.length > 0 && (
          <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
            <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" /> Points clés
            </h4>
            <ul className="space-y-2">
              {technique.key_points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Sélecteur de maîtrise */}
        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Comment tu te sens ?
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {MASTERY_LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => onMasteryChange(technique.id, level.id)}
                className={`
                  p-3 rounded-xl transition-all border-2
                  ${mastery === level.id 
                    ? `${level.bg} ${level.border} ring-2 ring-offset-2 ring-offset-slate-900 ring-current` 
                    : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                  }
                `}
              >
                <span className="text-2xl block">{level.emoji}</span>
                <span className={`text-xs font-medium ${mastery === level.id ? level.color : 'text-slate-400'}`}>
                  {level.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Message */}
        <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 text-center">
          <p className="text-purple-200 text-sm">
            🥋 Continue à t'entraîner {userName || 'ninja'} !
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Composant principal
 */
const TechniquesByKyuCards = ({ 
  isOpen, 
  onClose,
  userName = '',
  userKyu = '5e_kyu',
  masteredTechniques = [],
  userId = null,
  isAuthenticated = false,
  onMasteryUpdate,
  currentBelt = null,
  totalPoints = 0,
  onBeltClick = null
}) => {
  const [kyuLevels, setKyuLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedKyuIndex, setSelectedKyuIndex] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [masteryLevels, setMasteryLevels] = useState({});

  // Charger les données
  useEffect(() => {
    const fetchKyuLevels = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/kyu-levels`);
        if (!response.ok) throw new Error('Erreur de chargement');
        const data = await response.json();
        // Trier par order décroissant (5e kyu en premier)
        const sorted = data.sort((a, b) => b.order - a.order);
        setKyuLevels(sorted);
        
        const savedMastery = localStorage.getItem(`aikido-mastery-${userId || 'guest'}`);
        if (savedMastery) setMasteryLevels(JSON.parse(savedMastery));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) fetchKyuLevels();
  }, [isOpen, userId]);

  // Stats par grade
  const getMasteryStats = (kyuIndex) => {
    const kyu = kyuLevels[kyuIndex];
    if (!kyu?.techniques) return { total: 0, mastered: 0, percent: 0 };
    const total = kyu.techniques.length;
    const mastered = kyu.techniques.filter(t => masteryLevels[t.id] === 'mastered').length;
    return { total, mastered, percent: total > 0 ? Math.round((mastered / total) * 100) : 0 };
  };

  // Stats globales
  const globalStats = useMemo(() => {
    let total = 0, mastered = 0;
    kyuLevels.forEach(kyu => {
      if (kyu.techniques) {
        total += kyu.techniques.length;
        mastered += kyu.techniques.filter(t => masteryLevels[t.id] === 'mastered').length;
      }
    });
    return { total, mastered, percent: total > 0 ? Math.round((mastered / total) * 100) : 0 };
  }, [kyuLevels, masteryLevels]);

  // Changer maîtrise
  const handleMasteryChange = (techniqueId, newLevel) => {
    const newMasteryLevels = { ...masteryLevels, [techniqueId]: newLevel };
    setMasteryLevels(newMasteryLevels);
    localStorage.setItem(`aikido-mastery-${userId || 'guest'}`, JSON.stringify(newMasteryLevels));
    if (onMasteryUpdate) onMasteryUpdate(techniqueId, newLevel);
  };

  const currentKyu = kyuLevels[selectedKyuIndex];
  const currentConfig = currentKyu ? getBeltConfig(currentKyu.color, currentKyu.name) : null;

  // Loading
  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-slate-900 border-cyan-500/30 p-8">
          <VisuallyHidden><DialogTitle>Chargement</DialogTitle></VisuallyHidden>
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white text-lg">Chargement des techniques...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Error
  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-slate-900 border-red-500/30 p-6">
          <VisuallyHidden><DialogTitle>Erreur</DialogTitle></VisuallyHidden>
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={onClose} variant="outline">Fermer</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-6xl h-[92vh] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-cyan-500/30 p-0 overflow-hidden"
        data-testid="techniques-dialog"
      >
        <VisuallyHidden>
          <DialogTitle>Mes Techniques</DialogTitle>
          <DialogDescription>Programme technique par grade</DialogDescription>
        </VisuallyHidden>
        
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* HEADER AVEC STATS GLOBALES */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Swords className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Mes Techniques</h1>
                <p className="text-slate-400 text-sm">
                  {globalStats.mastered} / {globalStats.total} techniques maîtrisées
                </p>
              </div>
            </div>
            
            {/* Progression globale */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <p className="text-3xl font-bold text-cyan-400">{globalStats.percent}%</p>
                <p className="text-xs text-slate-500">progression totale</p>
              </div>
              <div className="w-24 h-24">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#334155" strokeWidth="8" />
                  <motion.circle 
                    cx="50" cy="50" r="40" fill="none" 
                    stroke="url(#progressGradient)" 
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 251.2" }}
                    animate={{ strokeDasharray: `${globalStats.percent * 2.512} 251.2` }}
                    transition={{ duration: 1 }}
                  />
                  <defs>
                    <linearGradient id="progressGradient">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-700/50 hover:bg-slate-600 transition-colors"
            >
              <X className="w-6 h-6 text-slate-300" />
            </button>
          </div>
        </div>
        
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* SÉLECTEUR DE GRADES AVEC CEINTURES */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <div className="p-4 bg-slate-800/30 border-b border-slate-700">
          <h2 className="text-sm font-medium text-slate-400 mb-3">Choisis ton grade :</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-600">
            {kyuLevels.map((grade, index) => (
              <GradeCard
                key={grade.id}
                grade={grade}
                index={index}
                isSelected={selectedKyuIndex === index}
                stats={getMasteryStats(index)}
                onClick={() => setSelectedKyuIndex(index)}
              />
            ))}
          </div>
        </div>
        
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* CONTENU : LISTE DES TECHNIQUES */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 overflow-hidden relative">
          {currentKyu && (
            <div className="h-full flex flex-col">
              {/* En-tête du grade */}
              <div className={`p-4 bg-gradient-to-r ${currentConfig?.gradient || 'from-slate-600 to-slate-700'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <BeltVisual color={currentKyu.color} size="lg" />
                    <div>
                      <h2 className={`text-2xl font-bold ${currentConfig?.textClass || 'text-white'}`}>
                        {currentKyu.name}
                      </h2>
                      <p className={`text-sm ${currentConfig?.textClass || 'text-white'} opacity-80`}>
                        {currentKyu.techniques?.length || 0} techniques • Ceinture {currentConfig?.label}
                      </p>
                    </div>
                  </div>
                  <div className={`text-right ${currentConfig?.textClass || 'text-white'}`}>
                    <p className="text-3xl font-bold">{getMasteryStats(selectedKyuIndex).percent}%</p>
                    <p className="text-xs opacity-80">complété</p>
                  </div>
                </div>
              </div>
              
              {/* Liste des techniques */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2" data-testid="techniques-list">
                {currentKyu.techniques?.map((technique, index) => (
                  <TechniqueCard
                    key={technique.id}
                    technique={technique}
                    index={index}
                    mastery={masteryLevels[technique.id] || 'not_started'}
                    onClick={setSelectedTechnique}
                  />
                ))}
                
                {(!currentKyu.techniques || currentKyu.techniques.length === 0) && (
                  <div className="text-center py-12">
                    <Swords className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Aucune technique pour ce grade</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Panneau de détail */}
          <AnimatePresence>
            {selectedTechnique && (
              <TechniqueDetailPanel
                technique={selectedTechnique}
                mastery={masteryLevels[selectedTechnique.id] || 'not_started'}
                onMasteryChange={handleMasteryChange}
                onClose={() => setSelectedTechnique(null)}
                userName={userName}
              />
            )}
          </AnimatePresence>
        </div>
        
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* FOOTER */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <div className="p-3 bg-slate-800/50 border-t border-slate-700 flex items-center justify-between text-xs">
          <p className="text-slate-400">🥋 Entraîne-toi régulièrement au dojo pour progresser !</p>
          <div className="flex items-center gap-3">
            {MASTERY_LEVELS.map(level => (
              <span key={level.id} className={`flex items-center gap-1 ${level.color}`}>
                {level.emoji} {level.label}
              </span>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TechniquesByKyuCards;
