/**
 * 🎓 PASSAGES DE GRADES VIEWER - Version 2.0
 * 
 * Programme officiel FFAAA avec:
 * - Onglets Kyu / Dan
 * - Page dédiée par grade
 * - Tableau structuré par attaque/technique
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Clock, Target, AlertCircle, BookOpen,
  ChevronDown, ChevronRight, CheckCircle2, Circle,
  Swords, Users, GraduationCap, Star, Shield,
  Timer, Info, Loader2, RefreshCw, ArrowLeft,
  Table, List, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Mapping des couleurs de ceinture
const BELT_INFO = {
  '#FFFFFF': { name: 'Blanche', textColor: '#000', bgLight: 'bg-gray-100' },
  '#FFEB3B': { name: 'Jaune', textColor: '#000', bgLight: 'bg-yellow-100' },
  '#FF9800': { name: 'Orange', textColor: '#fff', bgLight: 'bg-orange-100' },
  '#4CAF50': { name: 'Verte', textColor: '#fff', bgLight: 'bg-green-100' },
  '#2196F3': { name: 'Bleue', textColor: '#fff', bgLight: 'bg-blue-100' },
  '#795548': { name: 'Marron', textColor: '#fff', bgLight: 'bg-amber-100' },
  '#000000': { name: 'Noire', textColor: '#fff', bgLight: 'bg-slate-800' }
};

// Mapping des catégories
const CATEGORY_LABELS = {
  tachi_waza: { label: 'Tachi Waza (Debout)', color: 'bg-amber-500/20 text-amber-400' },
  suwari_waza: { label: 'Suwari Waza (À genoux)', color: 'bg-cyan-500/20 text-cyan-400' },
  hanmi_handachi: { label: 'Hanmi Handachi (Semi-debout)', color: 'bg-violet-500/20 text-violet-400' },
  ushiro_waza: { label: 'Ushiro Waza (Arrière)', color: 'bg-rose-500/20 text-rose-400' },
  tanto_dori: { label: 'Tanto Dori (Couteau)', color: 'bg-red-500/20 text-red-400' },
  jo_dori: { label: 'Jo Dori (Bâton)', color: 'bg-emerald-500/20 text-emerald-400' },
  tachi_dori: { label: 'Tachi Dori (Sabre)', color: 'bg-orange-500/20 text-orange-400' },
  jiyu_waza: { label: 'Jiyu Waza (Libre)', color: 'bg-purple-500/20 text-purple-400' },
  bukiwaza: { label: 'Bukiwaza (Armes)', color: 'bg-slate-500/20 text-slate-400' },
  randori: { label: 'Randori (Multiple)', color: 'bg-pink-500/20 text-pink-400' }
};

/**
 * Composant Badge de Ceinture
 */
const BeltBadge = ({ color, size = 'md', showStar = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28'
  };
  
  const beltInfo = BELT_INFO[color] || BELT_INFO['#FFFFFF'];
  const isDan = color === '#000000';
  
  return (
    <div 
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center shadow-lg relative`}
      style={{ 
        backgroundColor: color === '#FFFFFF' ? '#1e293b' : color,
        border: color === '#FFFFFF' ? '3px solid #e5e7eb' : 'none'
      }}
    >
      {isDan && showStar ? (
        <Star className={`${size === 'xl' ? 'w-12 h-12' : size === 'lg' ? 'w-8 h-8' : 'w-5 h-5'} text-yellow-400 fill-yellow-400`} />
      ) : (
        <Award className={`${size === 'xl' ? 'w-12 h-12' : size === 'lg' ? 'w-8 h-8' : 'w-5 h-5'}`} style={{ color: beltInfo.textColor }} />
      )}
    </div>
  );
};

/**
 * Carte de grade pour la liste
 */
const GradeListCard = ({ grade, onClick }) => {
  const beltInfo = BELT_INFO[grade.couleur_ceinture] || BELT_INFO['#FFFFFF'];
  const isDan = grade.type_grade === 'dan';
  
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full p-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 hover:border-slate-500 transition-all text-left group"
      data-testid={`grade-card-${grade.id}`}
    >
      <div className="flex items-center gap-4">
        <BeltBadge color={grade.couleur_ceinture} size="md" showStar={isDan} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-white text-lg">{grade.nom}</h4>
            <span className="text-slate-500 text-sm">({grade.nom_japonais})</span>
          </div>
          <p className="text-sm text-slate-400">Ceinture {beltInfo.name}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {grade.heures_minimum}h min
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <Target className="w-3 h-3" />
              {grade.nb_techniques} techniques
            </span>
            {grade.nb_mouvements > 0 && (
              <span className="text-xs text-cyan-400 flex items-center gap-1">
                <Users className="w-3 h-3" />
                {grade.nb_mouvements} mouvements
              </span>
            )}
          </div>
        </div>
        
        <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
      </div>
    </motion.button>
  );
};

/**
 * Tableau des techniques structuré par attaque
 */
const TechniquesTable = ({ techniques }) => {
  const [expandedRows, setExpandedRows] = useState({});
  
  // Grouper par attaque
  const groupedByAttack = useMemo(() => {
    const groups = {};
    techniques.forEach(t => {
      const key = t.attaque || 'Autre';
      if (!groups[key]) {
        groups[key] = {
          attaque: t.attaque,
          attaque_japonais: t.attaque_japonais,
          techniques: []
        };
      }
      groups[key].techniques.push(t);
    });
    return Object.values(groups);
  }, [techniques]);
  
  const toggleRow = (idx) => {
    setExpandedRows(prev => ({ ...prev, [idx]: !prev[idx] }));
  };
  
  if (!techniques || techniques.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        Aucune technique spécifiée pour ce grade
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {groupedByAttack.map((group, groupIdx) => (
        <div key={groupIdx} className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
          {/* Header du groupe d'attaque */}
          <div className="bg-slate-700/50 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Swords className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-white">{group.attaque}</h4>
                {group.attaque_japonais && (
                  <span className="text-xs text-slate-400">{group.attaque_japonais}</span>
                )}
              </div>
            </div>
            <Badge className="bg-amber-500/20 text-amber-400 border-0">
              {group.techniques.length} technique{group.techniques.length > 1 ? 's' : ''}
            </Badge>
          </div>
          
          {/* Table des techniques */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 text-xs text-slate-400 uppercase">
                  <th className="px-4 py-2 text-left w-8"></th>
                  <th className="px-4 py-2 text-left">Technique</th>
                  <th className="px-4 py-2 text-left hidden md:table-cell">Japonais</th>
                  <th className="px-4 py-2 text-left hidden lg:table-cell">Catégorie</th>
                  <th className="px-4 py-2 text-center w-20">Détails</th>
                </tr>
              </thead>
              <tbody>
                {group.techniques.map((tech, techIdx) => {
                  const rowKey = `${groupIdx}-${techIdx}`;
                  const isExpanded = expandedRows[rowKey];
                  const hasDetails = tech.points_cles?.length > 0 || tech.erreurs_communes?.length > 0 || tech.description;
                  const catInfo = CATEGORY_LABELS[tech.categorie] || { label: tech.categorie, color: 'bg-slate-500/20 text-slate-400' };
                  
                  return (
                    <React.Fragment key={techIdx}>
                      <tr 
                        className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${isExpanded ? 'bg-slate-700/30' : ''}`}
                      >
                        <td className="px-4 py-3">
                          {tech.obligatoire !== false ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-white font-medium">{tech.nom}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-slate-400 text-sm">{tech.nom_japonais || '-'}</span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <Badge className={`${catInfo.color} border-0 text-xs`}>
                            {catInfo.label.split(' ')[0]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {hasDetails && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRow(rowKey)}
                              className="h-8 w-8 p-0"
                            >
                              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </Button>
                          )}
                        </td>
                      </tr>
                      
                      {/* Ligne de détails expandée */}
                      <AnimatePresence>
                        {isExpanded && hasDetails && (
                          <tr>
                            <td colSpan={5} className="px-0">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 py-4 bg-slate-900/50 border-b border-slate-700/50">
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Description */}
                                    {tech.description && (
                                      <div className="lg:col-span-3">
                                        <p className="text-sm text-slate-300 italic">{tech.description}</p>
                                      </div>
                                    )}
                                    
                                    {/* Points clés */}
                                    {tech.points_cles && tech.points_cles.length > 0 && (
                                      <div>
                                        <h6 className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1">
                                          <Target className="w-3 h-3" />
                                          Points clés
                                        </h6>
                                        <ul className="space-y-1">
                                          {tech.points_cles.map((point, idx) => (
                                            <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                                              {point}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    
                                    {/* Erreurs communes */}
                                    {tech.erreurs_communes && tech.erreurs_communes.length > 0 && (
                                      <div>
                                        <h6 className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1">
                                          <AlertCircle className="w-3 h-3" />
                                          Erreurs à éviter
                                        </h6>
                                        <ul className="space-y-1">
                                          {tech.erreurs_communes.map((erreur, idx) => (
                                            <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                                              {erreur}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Section des mouvements
 */
const MouvementsSection = ({ mouvements }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!mouvements || mouvements.length === 0) return null;
  
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between"
        >
          <CardTitle className="text-lg text-cyan-400 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Mouvements fondamentaux ({mouvements.length})
          </CardTitle>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </CardHeader>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mouvements.map((m, idx) => (
                  <div key={idx} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-medium">{m.nom}</span>
                          {m.nom_japonais && (
                            <span className="text-slate-500 text-xs">({m.nom_japonais})</span>
                          )}
                        </div>
                        {m.description && (
                          <p className="text-xs text-slate-400 mt-1">{m.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

/**
 * Page dédiée pour un grade
 */
const GradeDetailPage = ({ gradeId, onBack }) => {
  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchGrade = async () => {
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
    
    if (gradeId) fetchGrade();
  }, [gradeId]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
      </div>
    );
  }
  
  if (error || !grade) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 mb-4">{error || 'Grade non trouvé'}</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
      </div>
    );
  }
  
  const beltInfo = BELT_INFO[grade.couleur_ceinture] || BELT_INFO['#FFFFFF'];
  const isDan = ['shodan', 'nidan', 'sandan', 'yondan'].includes(grade.id);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
      data-testid="grade-detail-page"
    >
      {/* Header avec navigation */}
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={onBack} variant="outline" size="sm" className="border-slate-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
      
      {/* En-tête du grade */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-800/80 to-slate-900 rounded-2xl p-6 md:p-8 border border-slate-700">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <BeltBadge color={grade.couleur_ceinture} size="xl" showStar={isDan} />
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{grade.nom}</h1>
              <span className="text-2xl text-slate-400">{grade.nom_japonais}</span>
            </div>
            
            <p className="text-slate-300 text-lg mb-4 max-w-2xl">{grade.description}</p>
            
            {/* Stats en badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: grade.couleur_ceinture, border: grade.couleur_ceinture === '#FFFFFF' ? '2px solid #e5e7eb' : 'none' }}></div>
                <span className="text-white font-medium">Ceinture {beltInfo.name}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-white">{grade.delai_minimum}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full">
                <Timer className="w-4 h-4 text-violet-400" />
                <span className="text-white">{grade.heures_minimum}h minimum</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full">
                <Swords className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 font-medium">{grade.nb_techniques} techniques</span>
              </div>
              {grade.nb_mouvements > 0 && (
                <div className="flex items-center gap-2 bg-cyan-500/20 px-4 py-2 rounded-full">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 font-medium">{grade.nb_mouvements} mouvements</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Prérequis */}
        {grade.prerequis && (
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <span className="text-amber-400 font-semibold">Prérequis : </span>
            <span className="text-amber-200">{grade.prerequis}</span>
          </div>
        )}
      </div>
      
      {/* Objectifs */}
      {grade.objectifs && grade.objectifs.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-400 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Objectifs du grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {grade.objectifs.map((obj, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">{obj}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Mouvements */}
      <MouvementsSection mouvements={grade.mouvements} />
      
      {/* Techniques - Tableau structuré */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg text-amber-400 flex items-center gap-2">
            <Table className="w-5 h-5" />
            Apprendre les différentes techniques en Aikido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TechniquesTable techniques={grade.techniques} />
        </CardContent>
      </Card>
      
      {/* Critères d'évaluation */}
      {grade.criteres_evaluation && grade.criteres_evaluation.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-rose-400 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Critères d'évaluation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {grade.criteres_evaluation.map((critere, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
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
        <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-xl p-6 border border-violet-500/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-violet-500/30 flex items-center justify-center">
              <Timer className="w-7 h-7 text-violet-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Durée de l'examen</h4>
              <p className="text-violet-300 text-lg">{grade.duree_examen}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/**
 * Composant principal - Passages de Grades Viewer
 */
const PassagesGradesViewer = () => {
  const [activeTab, setActiveTab] = useState('kyu');
  const [grades, setGrades] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Charger les grades selon l'onglet actif
  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/grades/programme?type=${activeTab}`);
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
  }, [activeTab]);
  
  // Calculer les stats
  const stats = useMemo(() => {
    return {
      totalGrades: grades.length,
      totalTechniques: grades.reduce((acc, g) => acc + g.nb_techniques, 0),
      totalMouvements: grades.reduce((acc, g) => acc + g.nb_mouvements, 0)
    };
  }, [grades]);
  
  const handleRefresh = () => {
    setSelectedGradeId(null);
    setError(null);
    setLoading(true);
    fetch(`${API_URL}/api/grades/programme?type=${activeTab}`)
      .then(res => res.json())
      .then(data => setGrades(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };
  
  // Si un grade est sélectionné, afficher la page dédiée
  if (selectedGradeId) {
    return (
      <div className="p-6">
        <GradeDetailPage 
          gradeId={selectedGradeId} 
          onBack={() => setSelectedGradeId(null)} 
        />
      </div>
    );
  }
  
  return (
    <div className="p-6" data-testid="passages-grades-viewer">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-emerald-400" />
            Passages de Grades
          </h2>
          <p className="text-slate-400 mt-1">
            Programme officiel FFAAA • {activeTab === 'kyu' ? 'Grades Kyu (Mudansha)' : 'Grades Dan (Yudansha)'}
          </p>
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-2xl font-bold text-emerald-400">{stats.totalGrades}</span>
            <span className="text-slate-400 text-sm ml-2">grades</span>
          </div>
          <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-2xl font-bold text-amber-400">{stats.totalTechniques}</span>
            <span className="text-slate-400 text-sm ml-2">techniques</span>
          </div>
        </div>
      </div>
      
      {/* Onglets Kyu / Dan */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'kyu' ? 'default' : 'outline'}
          onClick={() => { setActiveTab('kyu'); setSelectedGradeId(null); }}
          className={activeTab === 'kyu' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-slate-600 hover:bg-slate-700'}
          data-testid="tab-kyu"
        >
          <Award className="w-4 h-4 mr-2" />
          Grades Kyu (6)
        </Button>
        <Button
          variant={activeTab === 'dan' ? 'default' : 'outline'}
          onClick={() => { setActiveTab('dan'); setSelectedGradeId(null); }}
          className={activeTab === 'dan' ? 'bg-amber-600 hover:bg-amber-700' : 'border-slate-600 hover:bg-slate-700'}
          data-testid="tab-dan"
        >
          <Star className="w-4 h-4 mr-2" />
          Grades Dan (4)
        </Button>
      </div>
      
      {/* Contenu */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline" className="border-slate-600">
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {grades.map((grade) => (
            <GradeListCard
              key={grade.id}
              grade={grade}
              onClick={() => setSelectedGradeId(grade.id)}
            />
          ))}
        </div>
      )}
      
      {/* Légende */}
      <div className="mt-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 mb-3">Légende</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Obligatoire</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="w-4 h-4 text-slate-500" />
            <span className="text-slate-300">Optionnel</span>
          </div>
          <div className="flex items-center gap-2">
            <ChevronDown className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">Cliquer pour détails</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassagesGradesViewer;
