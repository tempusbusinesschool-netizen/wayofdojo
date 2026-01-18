/**
 * 🎓 PASSAGES DE GRADES VIEWER
 * 
 * Composant pour visualiser le programme officiel FFAAA des passages de grades
 * en Aïkido, du 6e Kyu (débutant) au 1er Kyu.
 * 
 * Utilise l'API backend pour récupérer les données officielles.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Clock, Target, AlertCircle, BookOpen,
  ChevronDown, ChevronRight, CheckCircle2, Circle,
  Swords, Users, GraduationCap, Star, Shield,
  FileText, Timer, Zap, Info, Loader2, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Mapping des couleurs de ceinture
const BELT_COLORS = {
  '#FFFFFF': { name: 'Blanche', textColor: '#000', borderColor: '#e5e7eb' },
  '#FFEB3B': { name: 'Jaune', textColor: '#000', borderColor: '#FFEB3B' },
  '#FF9800': { name: 'Orange', textColor: '#fff', borderColor: '#FF9800' },
  '#4CAF50': { name: 'Verte', textColor: '#fff', borderColor: '#4CAF50' },
  '#2196F3': { name: 'Bleue', textColor: '#fff', borderColor: '#2196F3' },
  '#795548': { name: 'Marron', textColor: '#fff', borderColor: '#795548' },
  '#000000': { name: 'Noire', textColor: '#fff', borderColor: '#000000' }
};

// Mapping des catégories avec icônes et couleurs
const CATEGORY_INFO = {
  tachi_waza: { label: 'Tachi Waza', color: 'text-amber-400', bg: 'bg-amber-500/20', icon: '🧍' },
  suwari_waza: { label: 'Suwari Waza', color: 'text-cyan-400', bg: 'bg-cyan-500/20', icon: '🧎' },
  hanmi_handachi: { label: 'Hanmi Handachi', color: 'text-violet-400', bg: 'bg-violet-500/20', icon: '⚔️' },
  ushiro_waza: { label: 'Ushiro Waza', color: 'text-rose-400', bg: 'bg-rose-500/20', icon: '↩️' },
  tanto_dori: { label: 'Tanto Dori', color: 'text-red-400', bg: 'bg-red-500/20', icon: '🗡️' },
  jo_dori: { label: 'Jo Dori', color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: '🥢' },
  tachi_dori: { label: 'Tachi Dori', color: 'text-orange-400', bg: 'bg-orange-500/20', icon: '⚔️' },
  jiyu_waza: { label: 'Jiyu Waza', color: 'text-purple-400', bg: 'bg-purple-500/20', icon: '🌀' }
};

/**
 * Carte détaillée pour une technique/mouvement
 */
const TechniqueDetailCard = ({ technique, isMovement = false }) => {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = technique.points_cles?.length > 0 || technique.erreurs_communes?.length > 0;
  
  return (
    <div className={`rounded-lg border ${technique.obligatoire !== false ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-700/30 border-slate-600/30'}`}>
      <button
        onClick={() => hasDetails && setExpanded(!expanded)}
        className={`w-full p-3 text-left ${hasDetails ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'}`}
        data-testid={`technique-card-${technique.id}`}
      >
        <div className="flex items-start gap-2">
          {technique.obligatoire !== false ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <Circle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-medium">{technique.nom}</span>
              {technique.nom_japonais && (
                <span className="text-slate-500 text-sm">({technique.nom_japonais})</span>
              )}
              {hasDetails && (
                <Badge variant="outline" className="text-xs bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                  <Info className="w-3 h-3 mr-1" />
                  Détails
                </Badge>
              )}
            </div>
            {technique.description && (
              <p className="text-sm text-slate-400 mt-1">{technique.description}</p>
            )}
          </div>
          {hasDetails && (
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`} />
          )}
        </div>
      </button>
      
      <AnimatePresence>
        {expanded && hasDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-600/30 overflow-hidden"
          >
            <div className="p-3 space-y-3">
              {/* Points clés */}
              {technique.points_cles && technique.points_cles.length > 0 && (
                <div>
                  <h6 className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Points clés
                  </h6>
                  <ul className="space-y-1">
                    {technique.points_cles.map((point, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Erreurs communes */}
              {technique.erreurs_communes && technique.erreurs_communes.length > 0 && (
                <div>
                  <h6 className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Erreurs à éviter
                  </h6>
                  <ul className="space-y-1">
                    {technique.erreurs_communes.map((erreur, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                        {erreur}
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
  );
};

/**
 * Carte pour un grade individuel dans la liste
 */
const GradeCard = ({ grade, isSelected, onSelect }) => {
  const beltInfo = BELT_COLORS[grade.couleur_ceinture] || BELT_COLORS['#FFFFFF'];
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(grade)}
      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
        isSelected 
          ? 'border-emerald-500 bg-emerald-500/10' 
          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
      }`}
      data-testid={`grade-card-${grade.id}`}
    >
      <div className="flex items-center gap-4">
        {/* Badge de ceinture */}
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
          style={{ 
            backgroundColor: grade.couleur_ceinture === '#FFFFFF' ? '#1e293b' : grade.couleur_ceinture,
            border: grade.couleur_ceinture === '#FFFFFF' ? '3px solid #e5e7eb' : 'none'
          }}
        >
          <Award className="w-6 h-6" style={{ color: beltInfo.textColor }} />
        </div>
        
        {/* Infos du grade */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-white">{grade.nom}</h4>
            <span className="text-slate-500 text-sm">({grade.nom_japonais})</span>
          </div>
          <p className="text-sm text-slate-400">Ceinture {beltInfo.name}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {grade.delai_minimum}
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <Target className="w-3 h-3" />
              {grade.nb_techniques} techniques
            </span>
          </div>
        </div>
        
        {/* Chevron */}
        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
      </div>
    </motion.button>
  );
};

/**
 * Section des mouvements requis
 */
const MouvementsSection = ({ mouvements }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!mouvements || mouvements.length === 0) return null;
  
  // Grouper par catégorie
  const grouped = mouvements.reduce((acc, m) => {
    const cat = m.categorie || 'autre';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(m);
    return acc;
  }, {});
  
  return (
    <div className="space-y-3">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <h4 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Mouvements fondamentaux ({mouvements.length})
        </h4>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-4"
          >
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h5 className="text-sm font-semibold text-cyan-300 mb-3 capitalize">
                  {cat.replace(/_/g, ' ')}
                </h5>
                <div className="space-y-2">
                  {items.map((m, idx) => (
                    <TechniqueDetailCard key={idx} technique={m} isMovement />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Section des techniques par attaque
 */
const TechniquesParAttaqueSection = ({ techniquesParAttaque }) => {
  const [expandedIdx, setExpandedIdx] = useState(null);
  
  if (!techniquesParAttaque || techniquesParAttaque.length === 0) return null;
  
  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
        <Swords className="w-5 h-5" />
        Techniques par attaque
      </h4>
      
      {techniquesParAttaque.map((group, idx) => (
        <div key={idx} className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
          <button
            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
            className="w-full p-4 flex items-start justify-between hover:bg-slate-700/50 transition-colors text-left"
            data-testid={`attaque-group-${idx}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Swords className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-white">{group.attaque}</span>
                  {group.attaque_japonais && (
                    <span className="text-slate-500 text-sm">({group.attaque_japonais})</span>
                  )}
                </div>
                <span className="text-xs text-slate-500">
                  {group.techniques?.length || 0} technique{(group.techniques?.length || 0) > 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/50">
                {group.techniques?.length || 0}
              </Badge>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedIdx === idx ? 'rotate-180' : ''}`} />
            </div>
          </button>
          
          <AnimatePresence>
            {expandedIdx === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-slate-700"
              >
                <div className="p-4 space-y-2">
                  {group.techniques?.map((tech, i) => (
                    <TechniqueDetailCard key={i} technique={tech} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

/**
 * Section des techniques par catégorie
 */
const TechniquesParCategorieSection = ({ techniquesParCategorie }) => {
  const [expandedCat, setExpandedCat] = useState(null);
  
  if (!techniquesParCategorie || Object.keys(techniquesParCategorie).length === 0) return null;
  
  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold text-violet-400 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Techniques par catégorie
      </h4>
      
      {Object.entries(techniquesParCategorie).map(([cat, techniques]) => {
        const catInfo = CATEGORY_INFO[cat] || { label: cat, color: 'text-slate-400', bg: 'bg-slate-500/20', icon: '📋' };
        
        return (
          <div key={cat} className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
            <button
              onClick={() => setExpandedCat(expandedCat === cat ? null : cat)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${catInfo.bg} flex items-center justify-center`}>
                  <span className="text-xl">{catInfo.icon}</span>
                </div>
                <div className="text-left">
                  <span className={`font-semibold ${catInfo.color}`}>{catInfo.label}</span>
                  <span className="text-xs text-slate-500 block">{techniques.length} technique{techniques.length > 1 ? 's' : ''}</span>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedCat === cat ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {expandedCat === cat && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-slate-700"
                >
                  <div className="p-4 space-y-2">
                    {techniques.map((tech, i) => (
                      <TechniqueDetailCard key={i} technique={tech} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Vue détaillée d'un grade
 */
const GradeDetailView = ({ gradeId }) => {
  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchGradeDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/grades/programme/${gradeId}`);
        if (!response.ok) throw new Error('Erreur lors du chargement');
        const data = await response.json();
        setGrade(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (gradeId) fetchGradeDetail();
  }, [gradeId]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }
  
  if (error || !grade) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400">{error || 'Grade non trouvé'}</p>
      </div>
    );
  }
  
  const beltInfo = BELT_COLORS[grade.couleur_ceinture] || BELT_COLORS['#FFFFFF'];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
      data-testid="grade-detail-view"
    >
      {/* Header avec infos du grade */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Badge ceinture grand */}
          <div 
            className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0"
            style={{ 
              backgroundColor: grade.couleur_ceinture === '#FFFFFF' ? '#1e293b' : grade.couleur_ceinture,
              border: grade.couleur_ceinture === '#FFFFFF' ? '4px solid #e5e7eb' : 'none'
            }}
          >
            <Award className="w-12 h-12" style={{ color: beltInfo.textColor }} />
          </div>
          
          {/* Infos principales */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">{grade.nom}</h2>
              <span className="text-xl text-slate-400">{grade.nom_japonais}</span>
            </div>
            {grade.description && (
              <p className="text-slate-300 mb-4">{grade.description}</p>
            )}
            
            {/* Stats */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: grade.couleur_ceinture }}></div>
                <span className="text-white font-medium">Ceinture {beltInfo.name}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-white">{grade.delai_minimum}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg">
                <Timer className="w-4 h-4 text-violet-400" />
                <span className="text-white">{grade.heures_minimum}h minimum</span>
              </div>
              <div className="flex items-center gap-2 bg-cyan-500/20 px-3 py-2 rounded-lg">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 font-medium">{grade.nb_mouvements} mouvements</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-2 rounded-lg">
                <Swords className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 font-medium">{grade.nb_techniques} techniques</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Prérequis */}
        {grade.prerequis && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <span className="text-amber-400 font-medium">Prérequis :</span>
            <span className="text-amber-200 ml-2">{grade.prerequis}</span>
          </div>
        )}
      </div>
      
      {/* Objectifs */}
      {grade.objectifs && grade.objectifs.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-emerald-400 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Objectifs du grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {grade.objectifs.map((obj, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">{obj}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Mouvements requis */}
      {grade.mouvements && grade.mouvements.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <MouvementsSection mouvements={grade.mouvements} />
          </CardContent>
        </Card>
      )}
      
      {/* Techniques par attaque */}
      {grade.techniques_par_attaque && grade.techniques_par_attaque.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <TechniquesParAttaqueSection techniquesParAttaque={grade.techniques_par_attaque} />
          </CardContent>
        </Card>
      )}
      
      {/* Techniques par catégorie */}
      {grade.techniques_par_categorie && Object.keys(grade.techniques_par_categorie).length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <TechniquesParCategorieSection techniquesParCategorie={grade.techniques_par_categorie} />
          </CardContent>
        </Card>
      )}
      
      {/* Critères d'évaluation */}
      {grade.criteres_evaluation && grade.criteres_evaluation.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-rose-400 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Critères d'évaluation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {grade.criteres_evaluation.map((critere, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">{critere}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Durée examen */}
      {grade.duree_examen && (
        <Card className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-violet-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-violet-500/30 flex items-center justify-center">
                <Timer className="w-8 h-8 text-violet-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white">Durée de l'examen</h4>
                <p className="text-violet-300">{grade.duree_examen}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

/**
 * Composant principal - Passages de Grades Viewer
 */
const PassagesGradesViewer = () => {
  const [grades, setGrades] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Charger la liste des grades
  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/grades/programme`);
        if (!response.ok) throw new Error('Erreur lors du chargement');
        const data = await response.json();
        setGrades(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGrades();
  }, []);
  
  const handleSelectGrade = (grade) => {
    setSelectedGradeId(grade.id);
  };
  
  const handleRefresh = () => {
    setSelectedGradeId(null);
    setError(null);
    setLoading(true);
    fetch(`${API_URL}/api/grades/programme`)
      .then(res => res.json())
      .then(data => setGrades(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };
  
  // Statistiques globales
  const stats = useMemo(() => {
    const totalTechniques = grades.reduce((acc, g) => acc + g.nb_techniques, 0);
    const totalMouvements = grades.reduce((acc, g) => acc + g.nb_mouvements, 0);
    return { totalTechniques, totalMouvements };
  }, [grades]);
  
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Chargement du programme FFAAA...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={handleRefresh} variant="outline" className="border-slate-600">
          <RefreshCw className="w-4 h-4 mr-2" />
          Réessayer
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-6" data-testid="passages-grades-viewer">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-emerald-400" />
            Passages de Grades - Programme FFAAA
          </h2>
          <p className="text-slate-400 mt-1">
            Programme officiel de la Fédération Française d'Aïkido • {grades.length} grades Kyu
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-2xl font-bold text-emerald-400">{grades.length}</span>
            <span className="text-slate-400 text-sm ml-2">grades</span>
          </div>
          <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-2xl font-bold text-amber-400">{stats.totalTechniques}</span>
            <span className="text-slate-400 text-sm ml-2">techniques</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des grades */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-lg font-semibold text-white mb-4">
            Grades Kyu (Mudansha)
          </h3>
          
          {grades.map((grade) => (
            <GradeCard
              key={grade.id}
              grade={grade}
              isSelected={selectedGradeId === grade.id}
              onSelect={handleSelectGrade}
            />
          ))}
          
          {/* Légende */}
          <div className="mt-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700">
            <h4 className="text-sm font-semibold text-slate-400 mb-3">Légende</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">Élément obligatoire</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-slate-500" />
                <span className="text-slate-300">Élément optionnel</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                  <Info className="w-3 h-3 mr-1" />
                  Détails
                </Badge>
                <span className="text-slate-300">Cliquer pour plus d'infos</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Détail du grade sélectionné */}
        <div className="lg:col-span-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          <AnimatePresence mode="wait">
            {selectedGradeId ? (
              <GradeDetailView key={selectedGradeId} gradeId={selectedGradeId} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center py-16">
                  <GraduationCap className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">
                    Sélectionnez un grade
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Cliquez sur un grade pour voir le programme détaillé avec toutes les techniques, 
                    mouvements, points clés et erreurs à éviter.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PassagesGradesViewer;
