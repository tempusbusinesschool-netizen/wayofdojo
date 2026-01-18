/**
 * 🥋 MES TECHNIQUES - Version 4.0 - Layout Corrigé
 * Techniques bien visibles avec scroll correct
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, X, ChevronRight, ChevronLeft, Trophy, Star,
  CheckCircle2, Target, AlertCircle, Swords, Sparkles, Eye
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Configuration des ceintures
const getBeltConfig = (color, name) => {
  const colorMap = {
    '#FFFFFF': { label: 'Blanche', emoji: '⚪', bg: 'bg-gray-200', textDark: true },
    '#fbbf24': { label: 'Jaune', emoji: '🟡', bg: 'bg-yellow-400', textDark: true },
    '#f97316': { label: 'Orange', emoji: '🟠', bg: 'bg-orange-500', textDark: true },
    '#22c55e': { label: 'Verte', emoji: '🟢', bg: 'bg-green-500', textDark: false },
    '#3b82f6': { label: 'Bleue', emoji: '🔵', bg: 'bg-blue-500', textDark: false },
    '#92400e': { label: 'Marron', emoji: '🟤', bg: 'bg-amber-800', textDark: false },
    '#000000': { label: 'Noire', emoji: '⚫', bg: 'bg-black', textDark: false }
  };
  
  const lowerColor = color?.toLowerCase();
  const match = Object.entries(colorMap).find(([hex]) => hex.toLowerCase() === lowerColor);
  if (match) return match[1];
  
  // Fallback
  if (name?.includes('5')) return colorMap['#fbbf24'];
  if (name?.includes('4')) return colorMap['#f97316'];
  if (name?.includes('3')) return colorMap['#22c55e'];
  if (name?.includes('2')) return colorMap['#3b82f6'];
  if (name?.includes('1') && !name?.includes('Dan')) return colorMap['#92400e'];
  if (name?.includes('Dan') || name?.includes('SHODAN') || name?.includes('NIDAN')) return colorMap['#000000'];
  
  return colorMap['#FFFFFF'];
};

// Niveaux de maîtrise
const MASTERY_LEVELS = [
  { id: 'not_started', label: 'À découvrir', emoji: '⭕', color: 'text-slate-400', bg: 'bg-slate-700/50' },
  { id: 'learning', label: "J'apprends", emoji: '📖', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  { id: 'practiced', label: 'Je pratique', emoji: '🥋', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  { id: 'mastered', label: 'Maîtrisé !', emoji: '⭐', color: 'text-emerald-400', bg: 'bg-emerald-500/20' }
];

/**
 * Composant principal
 */
const TechniquesByKyuCards = ({ 
  isOpen, 
  onClose,
  userName = '',
  userId = null,
  isAuthenticated = false,
  onMasteryUpdate
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
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white">Chargement des techniques...</p>
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

  // Panneau de détail
  if (selectedTechnique) {
    const masteryInfo = MASTERY_LEVELS.find(l => l.id === (masteryLevels[selectedTechnique.id] || 'not_started')) || MASTERY_LEVELS[0];
    
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-slate-900 border-cyan-500/30 p-0 overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>{selectedTechnique.name}</DialogTitle>
            <DialogDescription>Détails de la technique</DialogDescription>
          </VisuallyHidden>
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center gap-3">
            <button
              onClick={() => setSelectedTechnique(null)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1">
              <h2 className="font-bold text-white text-lg">{selectedTechnique.name}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg bg-white/20 hover:bg-white/30">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          {/* Contenu */}
          <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
            {/* Niveau actuel */}
            <div className={`p-4 rounded-xl ${masteryInfo.bg} border border-slate-600`}>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{masteryInfo.emoji}</span>
                <div>
                  <p className="text-xs text-slate-400">Mon niveau</p>
                  <p className={`font-bold text-xl ${masteryInfo.color}`}>{masteryInfo.label}</p>
                </div>
              </div>
            </div>
            
            {/* Description */}
            {selectedTechnique.description && (
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Description
                </h4>
                <p className="text-white text-sm">{selectedTechnique.description}</p>
              </div>
            )}
            
            {/* Points clés */}
            {selectedTechnique.key_points?.length > 0 && (
              <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Points clés
                </h4>
                <ul className="space-y-2">
                  {selectedTechnique.key_points.map((point, idx) => (
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
                    onClick={() => handleMasteryChange(selectedTechnique.id, level.id)}
                    className={`p-3 rounded-xl transition-all border-2 ${
                      masteryLevels[selectedTechnique.id] === level.id 
                        ? `${level.bg} border-current ${level.color}` 
                        : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <span className="text-2xl block">{level.emoji}</span>
                    <span className="text-xs font-medium">{level.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-5xl max-h-[92vh] bg-slate-900 border-cyan-500/30 p-0 overflow-hidden"
        data-testid="techniques-dialog"
      >
        <VisuallyHidden>
          <DialogTitle>Mes Techniques</DialogTitle>
          <DialogDescription>Programme technique par grade</DialogDescription>
        </VisuallyHidden>
        
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* HEADER */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <div className="p-4 bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Swords className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-xl font-bold text-white">Mes Techniques</h1>
              <p className="text-cyan-100 text-sm">{kyuLevels.reduce((sum, k) => sum + (k.techniques?.length || 0), 0)} techniques au total</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/20 hover:bg-white/30">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* SÉLECTEUR DE GRADES - CEINTURES VISIBLES */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <div className="p-3 bg-slate-800/50 border-b border-slate-700">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {kyuLevels.map((grade, index) => {
              const config = getBeltConfig(grade.color, grade.name);
              const stats = getMasteryStats(index);
              const isSelected = selectedKyuIndex === index;
              
              return (
                <button
                  key={grade.id}
                  onClick={() => setSelectedKyuIndex(index)}
                  className={`flex-shrink-0 p-3 rounded-xl transition-all min-w-[120px] border-2 ${
                    isSelected 
                      ? 'border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/20' 
                      : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                  }`}
                >
                  {/* Ceinture visuelle */}
                  <div className="flex justify-center mb-2">
                    <div 
                      className={`w-16 h-4 rounded-full ${config.bg} shadow-md`}
                      style={{ 
                        border: grade.color === '#FFFFFF' ? '2px solid #d1d5db' : 'none',
                        boxShadow: `0 2px 8px ${grade.color}40`
                      }}
                    />
                  </div>
                  
                  <p className={`text-sm font-bold text-center ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                    {grade.name}
                  </p>
                  <p className="text-xs text-slate-400 text-center">{config.label}</p>
                  
                  {/* Progression */}
                  <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500 rounded-full transition-all"
                      style={{ width: `${stats.percent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 text-center mt-1">
                    {stats.mastered}/{stats.total}
                  </p>
                  
                  {stats.percent === 100 && (
                    <Trophy className="w-4 h-4 text-amber-400 mx-auto mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* EN-TÊTE DU GRADE SÉLECTIONNÉ */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {currentKyu && (
          <div className={`p-4 ${currentConfig?.bg || 'bg-slate-600'} ${currentConfig?.textDark ? 'text-slate-900' : 'text-white'}`}
               style={{ backgroundColor: currentKyu.color || '#64748b' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{currentConfig?.emoji}</div>
                <div>
                  <h2 className="text-2xl font-bold">{currentKyu.name}</h2>
                  <p className="opacity-80">
                    {currentKyu.techniques?.length || 0} techniques • Ceinture {currentConfig?.label}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{getMasteryStats(selectedKyuIndex).percent}%</p>
                <p className="text-sm opacity-80">complété</p>
              </div>
            </div>
          </div>
        )}
        
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* LISTE DES TECHNIQUES */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <div className="overflow-y-auto p-4 space-y-2" style={{ maxHeight: 'calc(92vh - 340px)' }}>
          {currentKyu?.techniques?.map((technique, index) => {
            const mastery = masteryLevels[technique.id] || 'not_started';
            const masteryInfo = MASTERY_LEVELS.find(l => l.id === mastery) || MASTERY_LEVELS[0];
            const isMastered = mastery === 'mastered';
            
            return (
              <motion.button
                key={technique.id}
                onClick={() => setSelectedTechnique(technique)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`w-full p-4 rounded-xl text-left transition-all border-2 flex items-center gap-4 hover:shadow-lg ${masteryInfo.bg} border-slate-700 hover:border-slate-500`}
              >
                {/* Numéro */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0 ${
                  isMastered ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                }`}>
                  {isMastered ? <Star className="w-5 h-5" /> : index + 1}
                </div>
                
                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-white text-sm">{technique.name}</h4>
                    <span className={`text-xs ${masteryInfo.color}`}>{masteryInfo.emoji}</span>
                  </div>
                  {technique.description && (
                    <p className="text-slate-400 text-xs mt-1 line-clamp-1">{technique.description}</p>
                  )}
                </div>
                
                {/* Action */}
                <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
              </motion.button>
            );
          })}
          
          {(!currentKyu?.techniques || currentKyu.techniques.length === 0) && (
            <div className="text-center py-12">
              <Swords className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Aucune technique pour ce grade</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TechniquesByKyuCards;
