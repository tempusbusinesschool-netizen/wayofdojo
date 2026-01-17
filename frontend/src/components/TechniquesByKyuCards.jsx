import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Check, Lock, Star, BookOpen, Trophy, X, Lightbulb, Volume2, VolumeX, Filter, Layers, Circle, Loader2, PlayCircle, GraduationCap, Play } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { TechniqueSequenceDemo } from './animations/TechniqueSequenceAnimation';

// Niveaux de ressenti sur la pratique (appréciation symbolique, non évaluative)
const MASTERY_LEVELS = [
  { id: 'not_started', label: 'Pas encore vue', icon: Circle, color: 'text-slate-400', bg: 'bg-slate-700', emoji: '⚪' },
  { id: 'learning', label: 'En découverte', icon: PlayCircle, color: 'text-amber-400', bg: 'bg-amber-500/20', emoji: '🟡' },
  { id: 'practiced', label: 'Travaillée au dojo', icon: Star, color: 'text-cyan-400', bg: 'bg-cyan-500/20', emoji: '🔵' },
  { id: 'mastered', label: 'En confiance', icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-500/20', emoji: '🟢' },
];

const API = process.env.REACT_APP_BACKEND_URL + '/api';

// Image de Maître Tanaka
const TANAKA_IMAGE = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face";

/**
 * LES 8 CATÉGORIES DE TECHNIQUES D'AÏKIDO
 */
const TECHNIQUE_CATEGORIES = [
  { id: 'all', name: 'Toutes', emoji: '📋', color: 'slate' },
  { id: 'SUWARIWAZA', name: 'Suwariwaza', emoji: '🧎', color: 'amber', description: 'Techniques à genoux' },
  { id: 'TACHIWAZA', name: 'Tachiwaza', emoji: '🧍', color: 'cyan', description: 'Techniques debout' },
  { id: 'USHIRO WAZA', name: 'Ushiro Waza', emoji: '🔙', color: 'purple', description: 'Techniques arrière' },
  { id: 'HANMI HANDACHI WAZA', name: 'Hanmi Handachi', emoji: '⬇️', color: 'emerald', description: 'Tori à genoux, Uke debout' },
  { id: 'TANTO', name: 'Tanto Dori', emoji: '🔪', color: 'red', description: 'Défense contre couteau' },
  { id: 'JO', name: 'Jo Waza', emoji: '🪵', color: 'yellow', description: 'Techniques de bâton' },
  { id: 'BOKKEN', name: 'Tachi Dori', emoji: '⚔️', color: 'rose', description: 'Défense contre sabre' },
  { id: 'FUTARI', name: 'Futari Dori', emoji: '👥', color: 'indigo', description: 'Contre plusieurs adversaires' },
];

/**
 * Extraire la catégorie d'une technique depuis sa description
 */
const getTechniqueCategory = (technique) => {
  const desc = technique.description || '';
  for (const cat of TECHNIQUE_CATEGORIES) {
    if (cat.id !== 'all' && desc.includes(cat.id)) {
      return cat;
    }
  }
  return TECHNIQUE_CATEGORIES[0]; // 'all' par défaut
};

/**
 * TechniquesByKyuCards - Fiches des techniques par niveau de ceinture
 * 
 * FONCTIONNALITÉS :
 * - Charge les techniques depuis l'API avec description détaillée et key_points
 * - Maître Tanaka animé qui guide l'utilisateur avec messages personnalisés
 * - Progression séquentielle : techniques débloquées une par une
 * - Filtrage par catégorie (8 catégories d'Aïkido)
 * - Sélecteur de niveau de maîtrise connecté au backend
 * - Visuels attractifs par niveau de ceinture
 */
const TechniquesByKyuCards = ({ 
  isOpen, 
  onClose,
  userName = '',
  userKyu = '5e_kyu', // Kyu actuel de l'utilisateur
  masteredTechniques = [], // Liste des IDs de techniques maîtrisées
  userId = null,
  isAuthenticated = false,
  onMasteryUpdate // Callback pour mettre à jour les stats parentes
}) => {
  // État pour les données des Kyu depuis l'API
  const [kyuLevels, setKyuLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // État pour la navigation
  const [selectedKyuIndex, setSelectedKyuIndex] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [localMastered, setLocalMastered] = useState(masteredTechniques);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // État pour les niveaux de maîtrise (technique_id -> mastery_level)
  const [masteryLevels, setMasteryLevels] = useState({});
  const [savingMastery, setSavingMastery] = useState(null);
  
  // État pour Tanaka
  const [tanakaMessage, setTanakaMessage] = useState('');
  const [isTanakaSpeaking, setIsTanakaSpeaking] = useState(false);
  const [tanakaAnimating, setTanakaAnimating] = useState(true);
  
  // État pour la démo d'animation
  const [showAnimationDemo, setShowAnimationDemo] = useState(false);
  
  // Ref pour l'animation de Tanaka
  const tanakaSpeakTimeout = useRef(null);

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchKyuLevels = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/kyu-levels`);
        // Trier par order décroissant (5e KYU = débutant en premier)
        const sorted = response.data.sort((a, b) => b.order - a.order);
        setKyuLevels(sorted);
        
        // Message initial de Tanaka
        const displayName = userName || 'jeune ninja';
        const firstKyu = sorted[0];
        if (firstKyu) {
          setTanakaMessage(`${displayName}, voici les techniques du ${firstKyu.name}. Commence par les bases et progresse à ton rythme ! — Maître Tanaka 🥋`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur chargement kyu-levels:', err);
        setError('Impossible de charger les techniques');
        setLoading(false);
      }
    };
    
    if (isOpen) {
      fetchKyuLevels();
    }
  }, [isOpen, userName]);

  // Charger les techniques maîtrisées depuis le localStorage et le backend
  useEffect(() => {
    const loadMasteryData = async () => {
      // D'abord charger depuis localStorage
      const saved = localStorage.getItem('aikido_mastered_techniques');
      if (saved) {
        setLocalMastered(JSON.parse(saved));
      }
      
      // Charger les niveaux de maîtrise depuis localStorage
      const savedMastery = localStorage.getItem('aikido_mastery_levels');
      if (savedMastery) {
        setMasteryLevels(JSON.parse(savedMastery));
      }
      
      // Si authentifié, charger depuis le backend
      if (isAuthenticated && userId) {
        try {
          const response = await axios.get(`${API}/users/me/profile`);
          if (response.data && response.data.progression) {
            const backendMastery = {};
            const backendMastered = [];
            Object.entries(response.data.progression).forEach(([techId, data]) => {
              if (data.mastery_level) {
                backendMastery[techId] = data.mastery_level;
                if (data.mastery_level === 'mastered') {
                  backendMastered.push(techId);
                }
              }
            });
            setMasteryLevels(prev => ({ ...prev, ...backendMastery }));
            setLocalMastered(prev => [...new Set([...prev, ...backendMastered])]);
          }
        } catch (err) {
          console.error('Erreur chargement progression:', err);
        }
      }
    };
    
    loadMasteryData();
  }, [isAuthenticated, userId]);
  
  // Fonction pour mettre à jour le niveau de maîtrise d'une technique
  const updateMasteryLevel = async (techniqueId, newLevel) => {
    setSavingMastery(techniqueId);
    
    try {
      // Sauvegarder en local d'abord
      const newMasteryLevels = { ...masteryLevels, [techniqueId]: newLevel };
      setMasteryLevels(newMasteryLevels);
      localStorage.setItem('aikido_mastery_levels', JSON.stringify(newMasteryLevels));
      
      // Mettre à jour localMastered si nécessaire
      if (newLevel === 'mastered' && !localMastered.includes(techniqueId)) {
        const newMastered = [...localMastered, techniqueId];
        setLocalMastered(newMastered);
        localStorage.setItem('aikido_mastered_techniques', JSON.stringify(newMastered));
      } else if (newLevel !== 'mastered' && localMastered.includes(techniqueId)) {
        const newMastered = localMastered.filter(id => id !== techniqueId);
        setLocalMastered(newMastered);
        localStorage.setItem('aikido_mastered_techniques', JSON.stringify(newMastered));
      }
      
      // Si authentifié, synchroniser avec le backend
      if (isAuthenticated) {
        await axios.put(`${API}/auth/progression/${techniqueId}`, {
          technique_id: techniqueId,
          mastery_level: newLevel
        });
      }
      
      // Messages de Tanaka selon le niveau (vocabulaire non évaluatif)
      const levelInfo = MASTERY_LEVELS.find(l => l.id === newLevel);
      const messages = {
        'not_started': `D'accord ${userName || 'ninja'}, tu n'as pas encore vu cette technique au dojo. Ça viendra ! 🌱`,
        'learning': `Bien ${userName || 'ninja'} ! Tu découvres cette technique. Observe bien ton enseignant au dojo ! 👀`,
        'practiced': `Super ${userName || 'ninja'} ! Tu as travaillé cette technique au dojo. Continue à la pratiquer ! 💪`,
        'mastered': `Bravo ${userName || 'ninja'} ! 🎉 Tu te sens en confiance sur cette technique. Continue de t'entraîner au dojo pour progresser encore !`
      };
      
      setTanakaMessage(messages[newLevel] || `Niveau mis à jour : ${levelInfo?.label}`);
      setIsTanakaSpeaking(true);
      if (tanakaSpeakTimeout.current) clearTimeout(tanakaSpeakTimeout.current);
      tanakaSpeakTimeout.current = setTimeout(() => setIsTanakaSpeaking(false), 4000);
      
      toast.success(`${levelInfo?.emoji} Niveau de maîtrise mis à jour !`);
      
      // Notifier le parent si callback fourni
      if (onMasteryUpdate) {
        onMasteryUpdate(techniqueId, newLevel);
      }
      
    } catch (err) {
      console.error('Erreur mise à jour niveau:', err);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSavingMastery(null);
    }
  };
  
  // Mettre à jour le message de Tanaka quand on change de Kyu
  useEffect(() => {
    if (kyuLevels.length > 0 && selectedKyuIndex >= 0) {
      const currentKyu = kyuLevels[selectedKyuIndex];
      const displayName = userName || 'jeune ninja';
      const progress = getKyuProgress(selectedKyuIndex);
      
      if (progress.percent === 0) {
        setTanakaMessage(`${displayName}, voici les techniques du ${currentKyu.name}. Découvre-les au dojo avec ton enseignant ! — Maître Tanaka 🥋`);
      } else if (progress.percent < 50) {
        setTanakaMessage(`Tu te sens en confiance sur ${progress.mastered} technique${progress.mastered > 1 ? 's' : ''}. Continue à t'entraîner au dojo ! 💪 — Maître Tanaka`);
      } else if (progress.percent < 100) {
        setTanakaMessage(`Super ${displayName} ! Tu progresses bien dans ce niveau. N'oublie pas : c'est au dojo que tu apprends vraiment ! 🌟 — Maître Tanaka`);
      } else {
        setTanakaMessage(`${displayName}, tu te sens en confiance sur toutes les techniques de ce niveau ! Continue à les pratiquer au dojo. 🥋 — Maître Tanaka`);
      }
      
      // Animation de parole
      setIsTanakaSpeaking(true);
      if (tanakaSpeakTimeout.current) clearTimeout(tanakaSpeakTimeout.current);
      tanakaSpeakTimeout.current = setTimeout(() => setIsTanakaSpeaking(false), 3000);
    }
  }, [selectedKyuIndex, kyuLevels, userName, localMastered]);

  // Sauvegarder quand on maîtrise une technique
  const handleMasterTechnique = (techId) => {
    if (!localMastered.includes(techId)) {
      const newMastered = [...localMastered, techId];
      setLocalMastered(newMastered);
      localStorage.setItem('aikido_mastered_techniques', JSON.stringify(newMastered));
      
      // Message de Tanaka - vocabulaire non évaluatif
      setTanakaMessage(`${userName || 'Ninja'}, tu te sens en confiance sur cette technique. Continue à la pratiquer au dojo ! 🥋 — Maître Tanaka`);
      setIsTanakaSpeaking(true);
      if (tanakaSpeakTimeout.current) clearTimeout(tanakaSpeakTimeout.current);
      tanakaSpeakTimeout.current = setTimeout(() => setIsTanakaSpeaking(false), 4000);
    }
    setSelectedTechnique(null);
  };

  // Calculer la progression pour un Kyu
  const getKyuProgress = (kyuIndex) => {
    const kyu = kyuLevels[kyuIndex];
    if (!kyu || !kyu.techniques) return { mastered: 0, total: 0, percent: 0, learning: 0, practiced: 0 };
    
    const total = kyu.techniques.length;
    const mastered = kyu.techniques.filter(t => masteryLevels[t.id] === 'mastered').length;
    const practiced = kyu.techniques.filter(t => masteryLevels[t.id] === 'practiced').length;
    const learning = kyu.techniques.filter(t => masteryLevels[t.id] === 'learning').length;
    
    // Le pourcentage prend en compte les différents niveaux (mastered = 100%, practiced = 75%, learning = 25%)
    const weightedProgress = mastered * 100 + practiced * 75 + learning * 25;
    const maxProgress = total * 100;
    
    return {
      mastered,
      practiced,
      learning,
      total,
      percent: maxProgress > 0 ? Math.round(weightedProgress / maxProgress * 100) : 0
    };
  };

  // Vérifier si un Kyu est débloqué (le précédent doit être à 80%+)
  const isKyuUnlocked = (kyuIndex) => {
    if (kyuIndex === 0) return true; // Premier Kyu toujours débloqué
    
    const previousProgress = getKyuProgress(kyuIndex - 1);
    return previousProgress.percent >= 80;
  };

  // Vérifier si une technique est débloquée (progression séquentielle - au moins "practiced")
  const isTechniqueUnlocked = (techniqueIndex, kyuIndex) => {
    if (techniqueIndex === 0) return true; // Première technique toujours débloquée
    
    const kyu = kyuLevels[kyuIndex];
    if (!kyu || !kyu.techniques) return false;
    
    // La technique précédente doit être au moins "practiced" ou "mastered"
    const prevTechnique = kyu.techniques[techniqueIndex - 1];
    const prevMastery = masteryLevels[prevTechnique?.id];
    return prevMastery === 'mastered' || prevMastery === 'practiced';
  };

  // Obtenir la couleur du Kyu
  const getKyuColors = (kyu) => {
    const colorMap = {
      '#fbbf24': { gradient: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-500', text: 'text-yellow-900', emoji: '🟡' },
      '#fb923c': { gradient: 'from-orange-400 to-orange-600', bg: 'bg-orange-500', text: 'text-orange-900', emoji: '🟠' },
      '#22c55e': { gradient: 'from-green-400 to-green-600', bg: 'bg-green-500', text: 'text-green-900', emoji: '🟢' },
      '#3b82f6': { gradient: 'from-blue-400 to-blue-600', bg: 'bg-blue-500', text: 'text-blue-900', emoji: '🔵' },
      '#a855f7': { gradient: 'from-purple-400 to-purple-600', bg: 'bg-purple-500', text: 'text-purple-900', emoji: '🟣' },
      '#92400e': { gradient: 'from-amber-600 to-amber-800', bg: 'bg-amber-700', text: 'text-amber-100', emoji: '🟤' },
      '#1f2937': { gradient: 'from-slate-700 to-slate-900', bg: 'bg-slate-800', text: 'text-white', emoji: '⚫' },
    };
    const defaultColors = { gradient: 'from-gray-400 to-gray-600', bg: 'bg-gray-500', text: 'text-gray-900', emoji: '⚪' };
    return colorMap[kyu?.color?.toLowerCase()] || defaultColors;
  };

  const currentKyu = kyuLevels[selectedKyuIndex];
  const currentKyuColors = currentKyu ? getKyuColors(currentKyu) : {};

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-500/30 p-8">
          <VisuallyHidden>
            <DialogTitle>Chargement des techniques</DialogTitle>
          </VisuallyHidden>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg">Chargement des techniques...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-red-500/30 p-6">
          <VisuallyHidden>
            <DialogTitle>Erreur de chargement</DialogTitle>
          </VisuallyHidden>
          <div className="text-center">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <Button onClick={onClose} variant="outline" className="text-white border-white/30">
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-500/30 p-0 overflow-hidden" data-testid="techniques-kyu-dialog">
        <VisuallyHidden>
          <DialogTitle>Programme Technique - Tous les Grades</DialogTitle>
          <DialogDescription>Découvrez les techniques d&apos;Aïkido organisées par niveau de ceinture</DialogDescription>
        </VisuallyHidden>
        
        {/* 🥋 MAÎTRE TANAKA - Guide animé */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-3 border-b border-cyan-500/30">
          <div className="flex items-start gap-3">
            {/* Avatar de Tanaka avec animation */}
            <motion.div 
              className="relative flex-shrink-0"
              animate={tanakaAnimating ? { 
                y: [0, -3, 0],
                rotate: isTanakaSpeaking ? [0, -2, 2, 0] : 0
              } : {}}
              transition={{ 
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 0.3, repeat: isTanakaSpeaking ? Infinity : 0 }
              }}
            >
              <div className="w-14 h-14 rounded-full overflow-hidden border-3 border-cyan-400 shadow-lg shadow-cyan-500/30">
                <img 
                  src={TANAKA_IMAGE} 
                  alt="Maître Tanaka"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2306B6D4" width="100" height="100"/><text x="50" y="60" text-anchor="middle" font-size="40">🥋</text></svg>';
                  }}
                />
              </div>
              {/* Badge parlant animé */}
              <motion.div 
                className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full p-1"
                animate={isTanakaSpeaking ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.5, repeat: isTanakaSpeaking ? Infinity : 0 }}
              >
                <Volume2 className="w-3 h-3 text-white" />
              </motion.div>
            </motion.div>
            
            {/* Bulle de dialogue de Tanaka */}
            <div className="flex-1">
              <motion.div 
                key={tanakaMessage}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-3"
              >
                <p className="text-white/90 text-sm leading-relaxed">{tanakaMessage}</p>
              </motion.div>
            </div>

            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50 transition-colors"
              data-testid="close-techniques-dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Titre principal */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Programme Technique - Tous les Grades
            </h2>
            <div className="flex items-center gap-3">
              {/* Bouton démo animations */}
              <Button
                onClick={() => setShowAnimationDemo(true)}
                variant="outline"
                size="sm"
                className="border-cyan-400/50 text-cyan-200 hover:bg-cyan-500/20 text-xs"
                data-testid="animation-demo-btn"
              >
                <Play className="w-3 h-3 mr-1" />
                Voir les mouvements
              </Button>
              <div className="text-cyan-200 text-sm font-medium">
                {localMastered.length} en confiance
              </div>
            </div>
          </div>
        </div>

        {/* Navigation des Kyu (onglets) */}
        <div className="p-3 bg-slate-800/50 border-b border-slate-700">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-600">
            {kyuLevels.map((kyu, index) => {
              const colors = getKyuColors(kyu);
              const progress = getKyuProgress(index);
              const unlocked = isKyuUnlocked(index);
              const isSelected = selectedKyuIndex === index;
              
              return (
                <button
                  key={kyu.id}
                  onClick={() => unlocked && setSelectedKyuIndex(index)}
                  disabled={!unlocked}
                  data-testid={`kyu-tab-${index}`}
                  className={`
                    relative flex-shrink-0 p-2 rounded-xl transition-all min-w-[100px]
                    ${isSelected 
                      ? `bg-gradient-to-br ${colors.gradient} shadow-lg scale-105` 
                      : unlocked 
                        ? 'bg-slate-700 hover:bg-slate-600' 
                        : 'bg-slate-800 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  {!unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl z-10">
                      <Lock className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                  
                  <div className="text-center">
                    <span className="text-2xl">{colors.emoji}</span>
                    <p className={`text-xs font-bold mt-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {kyu.name}
                    </p>
                    
                    {/* Barre de progression */}
                    <div className="mt-1 h-1.5 bg-black/30 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-white/90 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.percent}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                      {progress.mastered}/{progress.total}
                    </p>
                  </div>

                  {progress.percent === 100 && (
                    <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1 shadow-lg">
                      <Trophy className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu du Kyu sélectionné - Liste des techniques */}
        <div className="p-4 overflow-y-auto max-h-[400px]" data-testid="techniques-list">
          {currentKyu && (
            <motion.div
              key={selectedKyuIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* En-tête du Kyu */}
              <div className={`p-4 rounded-xl bg-gradient-to-r ${currentKyuColors.gradient} text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xl">{currentKyu.name}</h3>
                    <p className="text-white/80 text-sm">
                      {currentKyu.techniques?.length || 0} techniques à maîtriser
                    </p>
                  </div>
                  <span className="text-5xl">{currentKyuColors.emoji}</span>
                </div>
              </div>

              {/* Filtre par catégorie de techniques */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 text-slate-400 text-sm">
                  <Filter className="w-4 h-4" />
                  <span>Filtrer :</span>
                </div>
                {TECHNIQUE_CATEGORIES.slice(0, 5).map(cat => {
                  const count = currentKyu.techniques?.filter(t => 
                    cat.id === 'all' || (t.description || '').includes(cat.id)
                  ).length || 0;
                  
                  if (cat.id !== 'all' && count === 0) return null;
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2 py-1 rounded-lg text-xs transition-all flex items-center gap-1 ${
                        selectedCategory === cat.id
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.name}</span>
                      <span className="bg-black/20 px-1 rounded">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Liste des techniques avec progression séquentielle */}
              <div className="space-y-3">
                {currentKyu.techniques?.filter(technique => 
                  selectedCategory === 'all' || (technique.description || '').includes(selectedCategory)
                ).map((technique, techIndex) => {
                  const currentMastery = masteryLevels[technique.id] || 'not_started';
                  const isMastered = currentMastery === 'mastered';
                  const isLearning = currentMastery === 'learning';
                  const isPracticed = currentMastery === 'practiced';
                  const isUnlocked = isTechniqueUnlocked(techIndex, selectedKyuIndex);
                  const isNextToLearn = isUnlocked && currentMastery === 'not_started';
                  const techCategory = getTechniqueCategory(technique);
                  const masteryInfo = MASTERY_LEVELS.find(l => l.id === currentMastery);
                  
                  return (
                    <motion.button
                      key={technique.id}
                      onClick={() => isUnlocked && setSelectedTechnique(technique)}
                      disabled={!isUnlocked}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: techIndex * 0.05 }}
                      data-testid={`technique-card-${techIndex}`}
                      className={`
                        relative w-full p-4 rounded-xl text-left transition-all
                        ${isMastered 
                          ? 'bg-emerald-500/20 border-2 border-emerald-500/50 hover:border-emerald-400' 
                          : isPracticed
                            ? 'bg-cyan-500/15 border-2 border-cyan-500/40 hover:border-cyan-400'
                            : isLearning
                              ? 'bg-amber-500/15 border-2 border-amber-500/40 hover:border-amber-400'
                              : isNextToLearn
                                ? 'bg-cyan-500/10 border-2 border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-500/20'
                                : isUnlocked
                                  ? 'bg-slate-700/50 border-2 border-slate-600 hover:border-slate-500'
                                  : 'bg-slate-800/30 border-2 border-slate-700/50 cursor-not-allowed opacity-60'
                        }
                      `}
                    >
                      {/* Badge de niveau de maîtrise */}
                      {isUnlocked && currentMastery !== 'not_started' && (
                        <div className={`absolute -top-2 -right-2 ${masteryInfo?.bg} ${masteryInfo?.color} text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1`}>
                          <span>{masteryInfo?.emoji}</span>
                          <span>{masteryInfo?.label}</span>
                        </div>
                      )}
                      
                      {/* Badge à apprendre */}
                      {isNextToLearn && (
                        <div className="absolute -top-2 -right-2 bg-cyan-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                          À apprendre !
                        </div>
                      )}
                      
                      {!isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl z-10">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Lock className="w-4 h-4" />
                            <span className="text-xs">Maîtrise la technique précédente</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        {/* Numéro / Statut avec indicateur de maîtrise */}
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-lg
                          ${isMastered 
                            ? 'bg-emerald-500 text-white' 
                            : isPracticed
                              ? 'bg-cyan-500 text-white'
                              : isLearning
                                ? 'bg-amber-500 text-white'
                                : isNextToLearn
                                  ? 'bg-cyan-500 text-white'
                                  : 'bg-slate-600 text-slate-300'
                          }
                        `}>
                          {isMastered ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            techIndex + 1
                          )}
                        </div>
                        
                        {/* Infos de la technique */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-bold text-base ${isMastered ? 'text-emerald-300' : 'text-white'}`}>
                              {technique.name}
                            </h4>
                            {/* Badge catégorie */}
                            <span className="text-xs bg-slate-700/70 text-slate-300 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <span>{techCategory.emoji}</span>
                              <span className="hidden sm:inline">{techCategory.name}</span>
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm line-clamp-2">
                            {technique.description}
                          </p>
                          
                          {/* Points clés (aperçu) */}
                          {technique.key_points && technique.key_points.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {technique.key_points.slice(0, 2).map((point, idx) => (
                                <span key={idx} className="text-[10px] bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded-full">
                                  {point.length > 25 ? point.substring(0, 25) + '...' : point}
                                </span>
                              ))}
                              {technique.key_points.length > 2 && (
                                <span className="text-[10px] text-cyan-400 px-1">
                                  +{technique.key_points.length - 2} points
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <ChevronRight className={`w-5 h-5 flex-shrink-0 ${isMastered ? 'text-emerald-400' : 'text-slate-500'}`} />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Modal détail d'une technique */}
        <AnimatePresence>
          {selectedTechnique && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedTechnique(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-800 rounded-2xl p-5 max-w-lg w-full border-2 border-cyan-500/30 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                data-testid="technique-detail-modal"
              >
                {/* En-tête avec catégorie */}
                <div className="text-center mb-4">
                  <span className="text-5xl mb-3 block">🥋</span>
                  <h3 className="text-xl font-bold text-white">{selectedTechnique.name}</h3>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-cyan-400 text-sm">{currentKyu?.name}</span>
                    <span className="text-slate-500">•</span>
                    <span className="bg-slate-700 px-2 py-0.5 rounded text-sm text-slate-300">
                      {getTechniqueCategory(selectedTechnique).emoji} {getTechniqueCategory(selectedTechnique).name}
                    </span>
                  </div>
                </div>

                {/* Description complète - FICHE PÉDAGOGIQUE */}
                <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                  <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    Fiche Pédagogique
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {selectedTechnique.description}
                  </p>
                </div>

                {/* Points clés d'exécution */}
                {selectedTechnique.key_points && selectedTechnique.key_points.length > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
                    <h4 className="text-amber-400 font-semibold text-sm mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Points clés d&apos;exécution
                    </h4>
                    <ul className="space-y-2">
                      {selectedTechnique.key_points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-white/90 text-sm">
                          <span className="text-amber-400 font-bold mt-0.5">{idx + 1}.</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Conseils de pratique */}
                {selectedTechnique.practice_tips && selectedTechnique.practice_tips.length > 0 && (
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-4">
                    <h4 className="text-cyan-400 font-semibold text-sm mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Conseils de Maître Tanaka
                    </h4>
                    <ul className="space-y-2">
                      {selectedTechnique.practice_tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-white/90 text-sm">
                          <span className="text-cyan-400">💡</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Statistiques de pratique */}
                <div className="flex gap-4 mb-5 text-center">
                  <div className="flex-1 bg-slate-700/30 rounded-lg p-3">
                    <p className="text-2xl font-bold text-white">{selectedTechnique.practice_count || 0}</p>
                    <p className="text-slate-400 text-xs">Séances</p>
                  </div>
                  <div className="flex-1 bg-slate-700/30 rounded-lg p-3">
                    <p className="text-lg font-bold text-white">
                      {selectedTechnique.last_practiced 
                        ? new Date(selectedTechnique.last_practiced).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                        : 'Jamais'
                      }
                    </p>
                    <p className="text-slate-400 text-xs">Dernière pratique</p>
                  </div>
                </div>

                {/* ⭐ SÉLECTEUR DE NIVEAU DE MAÎTRISE */}
                <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-xl p-4 mb-5 border border-slate-600/50">
                  <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-400" />
                    Mon ressenti sur ma pratique
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {MASTERY_LEVELS.map((level) => {
                      const isCurrentLevel = masteryLevels[selectedTechnique.id] === level.id || 
                        (!masteryLevels[selectedTechnique.id] && level.id === 'not_started');
                      const LevelIcon = level.icon;
                      const isSaving = savingMastery === selectedTechnique.id;
                      
                      return (
                        <button
                          key={level.id}
                          onClick={() => !isSaving && updateMasteryLevel(selectedTechnique.id, level.id)}
                          disabled={isSaving}
                          data-testid={`mastery-level-${level.id}`}
                          className={`
                            relative p-3 rounded-lg border-2 transition-all duration-200
                            flex items-center gap-2
                            ${isCurrentLevel 
                              ? `${level.bg} border-current ${level.color} ring-2 ring-offset-2 ring-offset-slate-800 ring-current` 
                              : 'bg-slate-700/30 border-slate-600/50 text-slate-400 hover:bg-slate-700/50 hover:border-slate-500'
                            }
                            ${isSaving ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                          `}
                        >
                          {isSaving && isCurrentLevel ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <LevelIcon className={`w-5 h-5 ${isCurrentLevel ? level.color : ''}`} />
                          )}
                          <div className="text-left flex-1">
                            <span className="text-sm font-medium block">{level.label}</span>
                            <span className="text-xl">{level.emoji}</span>
                          </div>
                          {isCurrentLevel && (
                            <Check className="w-4 h-4 absolute top-1 right-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Rappel explicite - appréciation symbolique */}
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <p className="text-amber-200 text-xs leading-relaxed text-center">
                      <strong>💡 Ce niveau reflète ton ressenti sur ta pratique.</strong><br/>
                      Il n'a pas de valeur officielle. Seul ton enseignant au dojo valide ta progression réelle.
                    </p>
                  </div>
                </div>

                {/* Bouton fermer uniquement */}
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTechnique(null)}
                    className="flex-1 text-slate-400 hover:text-white border border-slate-600"
                  >
                    Fermer
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>

      {/* Modal de démo des animations */}
      <TechniqueAnimationDemo 
        isOpen={showAnimationDemo} 
        onClose={() => setShowAnimationDemo(false)} 
      />
    </Dialog>
  );
};

export default TechniquesByKyuCards;
