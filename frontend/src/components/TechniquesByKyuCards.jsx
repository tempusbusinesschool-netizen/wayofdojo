/**
 * 🥋 MES TECHNIQUES - Version 2.0 Ergonomie Refaite
 * 
 * Interface enfant "Mes techniques" / "voir les techniques"
 * Design épuré, techniques bien visibles, navigation fluide
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, X, ChevronRight, ChevronLeft, Lock, Trophy, Star,
  CheckCircle2, Circle, Target, AlertCircle, Swords, Users,
  GraduationCap, Award, Sparkles, Eye, Play
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Configuration des couleurs par Kyu
const KYU_CONFIG = {
  '6e_kyu': { 
    name: '6e Kyu', 
    color: '#FFFFFF', 
    gradient: 'from-slate-200 to-slate-400',
    bgLight: 'bg-slate-100',
    textColor: 'text-slate-800',
    emoji: '⚪',
    label: 'Blanche'
  },
  '5e_kyu': { 
    name: '5e Kyu', 
    color: '#FCD34D', 
    gradient: 'from-yellow-400 to-amber-500',
    bgLight: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    emoji: '🟡',
    label: 'Jaune'
  },
  '4e_kyu': { 
    name: '4e Kyu', 
    color: '#FB923C', 
    gradient: 'from-orange-400 to-orange-600',
    bgLight: 'bg-orange-100',
    textColor: 'text-orange-800',
    emoji: '🟠',
    label: 'Orange'
  },
  '3e_kyu': { 
    name: '3e Kyu', 
    color: '#22C55E', 
    gradient: 'from-green-400 to-emerald-600',
    bgLight: 'bg-green-100',
    textColor: 'text-green-800',
    emoji: '🟢',
    label: 'Verte'
  },
  '2e_kyu': { 
    name: '2e Kyu', 
    color: '#3B82F6', 
    gradient: 'from-blue-400 to-blue-600',
    bgLight: 'bg-blue-100',
    textColor: 'text-blue-800',
    emoji: '🔵',
    label: 'Bleue'
  },
  '1er_kyu': { 
    name: '1er Kyu', 
    color: '#92400E', 
    gradient: 'from-amber-700 to-amber-900',
    bgLight: 'bg-amber-100',
    textColor: 'text-amber-900',
    emoji: '🟤',
    label: 'Marron'
  }
};

// Niveaux de maîtrise
const MASTERY_LEVELS = [
  { id: 'not_started', label: 'À découvrir', emoji: '⭕', color: 'text-slate-400', bg: 'bg-slate-700' },
  { id: 'learning', label: 'J\'apprends', emoji: '📖', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  { id: 'practiced', label: 'Je pratique', emoji: '🥋', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  { id: 'mastered', label: 'Je maîtrise', emoji: '⭐', color: 'text-emerald-400', bg: 'bg-emerald-500/20' }
];

/**
 * Carte de technique individuelle
 */
const TechniqueCard = ({ technique, index, mastery, isUnlocked, onClick }) => {
  const masteryInfo = MASTERY_LEVELS.find(l => l.id === mastery) || MASTERY_LEVELS[0];
  const isMastered = mastery === 'mastered';
  const isLearning = mastery === 'learning';
  const isPracticed = mastery === 'practiced';
  
  return (
    <motion.button
      onClick={() => isUnlocked && onClick(technique)}
      disabled={!isUnlocked}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      whileHover={isUnlocked ? { scale: 1.02, y: -2 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
      className={`
        relative w-full p-4 rounded-2xl text-left transition-all border-2
        ${isMastered 
          ? 'bg-gradient-to-br from-emerald-500/20 to-green-600/20 border-emerald-500/50 shadow-emerald-500/20' 
          : isPracticed
            ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-500/50 shadow-cyan-500/20'
            : isLearning
              ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-amber-500/50 shadow-amber-500/20'
              : isUnlocked
                ? 'bg-slate-800/50 border-slate-600/50 hover:border-cyan-500/50 hover:bg-slate-700/50'
                : 'bg-slate-900/30 border-slate-800/50 cursor-not-allowed opacity-50'
        }
        shadow-lg
      `}
      data-testid={`technique-card-${index}`}
    >
      {/* Cadenas si verrouillé */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl z-10 backdrop-blur-sm">
          <Lock className="w-8 h-8 text-slate-500" />
        </div>
      )}
      
      {/* Badge de maîtrise */}
      {isUnlocked && mastery !== 'not_started' && (
        <div className={`absolute -top-2 -right-2 ${masteryInfo.bg} px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg`}>
          <span>{masteryInfo.emoji}</span>
          <span className={masteryInfo.color}>{masteryInfo.label}</span>
        </div>
      )}
      
      <div className="flex items-start gap-4">
        {/* Numéro */}
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
          <h4 className="font-bold text-white text-base truncate">
            {technique.name}
          </h4>
          {technique.japanese_name && (
            <p className="text-slate-400 text-sm">{technique.japanese_name}</p>
          )}
          {technique.description && (
            <p className="text-slate-500 text-xs mt-1 line-clamp-2">{technique.description}</p>
          )}
        </div>
        
        {/* Flèche */}
        {isUnlocked && (
          <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
        )}
      </div>
    </motion.button>
  );
};

/**
 * Détail d'une technique (panneau latéral)
 */
const TechniqueDetail = ({ technique, mastery, onMasteryChange, onClose, userName }) => {
  const masteryInfo = MASTERY_LEVELS.find(l => l.id === mastery) || MASTERY_LEVELS[0];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="h-full flex flex-col bg-slate-800/95 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-between">
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h3 className="font-bold text-white text-lg">Détail Technique</h3>
        <div className="w-9" />
      </div>
      
      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Nom de la technique */}
        <div className="text-center p-6 bg-slate-900/50 rounded-2xl border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-2">{technique.name}</h2>
          {technique.japanese_name && (
            <p className="text-cyan-400 text-lg">{technique.japanese_name}</p>
          )}
        </div>
        
        {/* Niveau de maîtrise actuel */}
        <div className={`p-4 rounded-xl ${masteryInfo.bg} border border-slate-600`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{masteryInfo.emoji}</span>
            <div>
              <p className="text-xs text-slate-400">Mon niveau actuel</p>
              <p className={`font-bold text-lg ${masteryInfo.color}`}>{masteryInfo.label}</p>
            </div>
          </div>
        </div>
        
        {/* Description */}
        {technique.description && (
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
            <h4 className="text-sm font-semibold text-slate-400 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Description
            </h4>
            <p className="text-white text-sm leading-relaxed">{technique.description}</p>
          </div>
        )}
        
        {/* Points clés */}
        {technique.key_points && technique.key_points.length > 0 && (
          <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
            <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Points clés ({technique.key_points.length})
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
        
        {/* Changer le niveau de maîtrise */}
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
          <h4 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Comment te sens-tu sur cette technique ?
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {MASTERY_LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => onMasteryChange(technique.id, level.id)}
                className={`
                  p-3 rounded-xl text-center transition-all border-2
                  ${mastery === level.id 
                    ? `${level.bg} border-current ${level.color}` 
                    : 'bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-300'
                  }
                `}
              >
                <span className="text-2xl block mb-1">{level.emoji}</span>
                <span className="text-xs font-medium">{level.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Message d'encouragement */}
        <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
          <p className="text-center text-cyan-300 text-sm">
            🥋 Continue à t'entraîner au dojo, {userName || 'ninja'} ! 
            <br />
            <span className="text-xs text-slate-400">La pratique régulière est la clé du progrès.</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Navigation par grade (tabs horizontaux)
 */
const GradeNavigation = ({ grades, selectedIndex, onSelect, getMasteryStats }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-thin scrollbar-thumb-slate-600">
      {grades.map((grade, index) => {
        const config = KYU_CONFIG[grade.kyu_id] || KYU_CONFIG['6e_kyu'];
        const stats = getMasteryStats(index);
        const isSelected = selectedIndex === index;
        const isComplete = stats.percent === 100;
        
        return (
          <motion.button
            key={grade.id}
            onClick={() => onSelect(index)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative flex-shrink-0 p-3 rounded-2xl transition-all min-w-[110px]
              ${isSelected 
                ? `bg-gradient-to-br ${config.gradient} shadow-xl shadow-${config.color}/20` 
                : 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
              }
            `}
            data-testid={`grade-tab-${index}`}
          >
            {/* Badge complété */}
            {isComplete && (
              <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1 shadow-lg">
                <Trophy className="w-3 h-3 text-white" />
              </div>
            )}
            
            <div className="text-center">
              <span className="text-3xl block">{config.emoji}</span>
              <p className={`text-sm font-bold mt-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {config.name}
              </p>
              <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                {config.label}
              </p>
              
              {/* Barre de progression */}
              <div className="mt-2 h-1.5 bg-black/30 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full rounded-full ${isSelected ? 'bg-white' : 'bg-cyan-500'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.percent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className={`text-[10px] mt-1 ${isSelected ? 'text-white/70' : 'text-slate-500'}`}>
                {stats.mastered}/{stats.total} maîtrisées
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

/**
 * Composant principal - Mes Techniques
 */
const TechniquesByKyuCards = ({ 
  isOpen, 
  onClose,
  userName = '',
  userKyu = '6e_kyu',
  masteredTechniques = [],
  userId = null,
  isAuthenticated = false,
  onMasteryUpdate,
  currentBelt = null,
  totalPoints = 0,
  onBeltClick = null
}) => {
  // États
  const [kyuLevels, setKyuLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedKyuIndex, setSelectedKyuIndex] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [masteryLevels, setMasteryLevels] = useState({});
  const [savingMastery, setSavingMastery] = useState(null);

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchKyuLevels = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/kyu-levels`);
        if (!response.ok) throw new Error('Erreur de chargement');
        const data = await response.json();
        setKyuLevels(data);
        
        // Charger les niveaux de maîtrise sauvegardés
        const savedMastery = localStorage.getItem(`aikido-mastery-${userId || 'guest'}`);
        if (savedMastery) {
          setMasteryLevels(JSON.parse(savedMastery));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchKyuLevels();
    }
  }, [isOpen, userId]);

  // Calculer les stats de maîtrise pour un grade
  const getMasteryStats = (kyuIndex) => {
    const kyu = kyuLevels[kyuIndex];
    if (!kyu?.techniques) return { total: 0, mastered: 0, percent: 0 };
    
    const total = kyu.techniques.length;
    const mastered = kyu.techniques.filter(t => masteryLevels[t.id] === 'mastered').length;
    const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;
    
    return { total, mastered, percent };
  };

  // Gérer le changement de maîtrise
  const handleMasteryChange = async (techniqueId, newLevel) => {
    const newMasteryLevels = { ...masteryLevels, [techniqueId]: newLevel };
    setMasteryLevels(newMasteryLevels);
    
    // Sauvegarder localement
    localStorage.setItem(`aikido-mastery-${userId || 'guest'}`, JSON.stringify(newMasteryLevels));
    
    // Sauvegarder sur le serveur si authentifié
    if (isAuthenticated && userId) {
      try {
        setSavingMastery(techniqueId);
        await fetch(`${API_URL}/api/auth/progression/${techniqueId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mastery_level: newLevel })
        });
      } catch (err) {
        console.error('Erreur sauvegarde:', err);
      } finally {
        setSavingMastery(null);
      }
    }
    
    // Callback parent
    if (onMasteryUpdate) {
      onMasteryUpdate(techniqueId, newLevel);
    }
  };

  // Kyu actuel
  const currentKyu = kyuLevels[selectedKyuIndex];

  // Stats globales
  const globalStats = useMemo(() => {
    let total = 0;
    let mastered = 0;
    kyuLevels.forEach(kyu => {
      if (kyu.techniques) {
        total += kyu.techniques.length;
        mastered += kyu.techniques.filter(t => masteryLevels[t.id] === 'mastered').length;
      }
    });
    return { total, mastered, percent: total > 0 ? Math.round((mastered / total) * 100) : 0 };
  }, [kyuLevels, masteryLevels]);

  // Loading state
  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-slate-900 border-cyan-500/30 p-8">
          <VisuallyHidden>
            <DialogTitle>Chargement</DialogTitle>
          </VisuallyHidden>
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white text-lg">Chargement des techniques...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Error state
  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-slate-900 border-red-500/30 p-6">
          <VisuallyHidden>
            <DialogTitle>Erreur</DialogTitle>
          </VisuallyHidden>
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
        className="max-w-5xl h-[90vh] bg-slate-900 border-2 border-cyan-500/30 p-0 overflow-hidden flex flex-col"
        data-testid="techniques-dialog"
      >
        <VisuallyHidden>
          <DialogTitle>Mes Techniques</DialogTitle>
          <DialogDescription>Programme technique par grade</DialogDescription>
        </VisuallyHidden>
        
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* HEADER */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Swords className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mes Techniques</h1>
                <p className="text-cyan-100 text-sm">
                  {globalStats.mastered}/{globalStats.total} techniques maîtrisées ({globalStats.percent}%)
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              data-testid="close-techniques"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          
          {/* Barre de progression globale */}
          <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${globalStats.percent}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
        
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* CONTENU PRINCIPAL */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex overflow-hidden">
          {/* Liste des techniques (gauche) */}
          <div className={`flex-1 flex flex-col overflow-hidden transition-all ${selectedTechnique ? 'w-1/2' : 'w-full'}`}>
            {/* Navigation par grade */}
            <div className="p-4 bg-slate-800/50 border-b border-slate-700">
              <GradeNavigation 
                grades={kyuLevels}
                selectedIndex={selectedKyuIndex}
                onSelect={setSelectedKyuIndex}
                getMasteryStats={getMasteryStats}
              />
            </div>
            
            {/* En-tête du grade sélectionné */}
            {currentKyu && (
              <div className="p-4 bg-slate-800/30 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{KYU_CONFIG[currentKyu.kyu_id]?.emoji || '⚪'}</span>
                    <div>
                      <h2 className="text-xl font-bold text-white">{currentKyu.name}</h2>
                      <p className="text-slate-400 text-sm">
                        Ceinture {KYU_CONFIG[currentKyu.kyu_id]?.label || 'Blanche'} • {currentKyu.techniques?.length || 0} techniques
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-400">
                      {getMasteryStats(selectedKyuIndex).percent}%
                    </p>
                    <p className="text-xs text-slate-500">complété</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Liste des techniques */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" data-testid="techniques-list">
              {currentKyu?.techniques?.map((technique, index) => (
                <TechniqueCard
                  key={technique.id}
                  technique={technique}
                  index={index}
                  mastery={masteryLevels[technique.id] || 'not_started'}
                  isUnlocked={true}
                  onClick={setSelectedTechnique}
                />
              ))}
              
              {(!currentKyu?.techniques || currentKyu.techniques.length === 0) && (
                <div className="text-center py-12">
                  <Swords className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Aucune technique pour ce grade</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Panneau de détail (droite) */}
          <AnimatePresence>
            {selectedTechnique && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '50%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-l border-slate-700 overflow-hidden"
              >
                <TechniqueDetail
                  technique={selectedTechnique}
                  mastery={masteryLevels[selectedTechnique.id] || 'not_started'}
                  onMasteryChange={handleMasteryChange}
                  onClose={() => setSelectedTechnique(null)}
                  userName={userName}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* FOOTER */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <div className="p-3 bg-slate-800/50 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <p className="text-slate-400">
              🥋 Pratique régulièrement au dojo pour progresser !
            </p>
            <div className="flex items-center gap-2">
              {MASTERY_LEVELS.slice(1).map(level => (
                <div key={level.id} className="flex items-center gap-1 text-xs">
                  <span>{level.emoji}</span>
                  <span className={level.color}>{level.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TechniquesByKyuCards;
