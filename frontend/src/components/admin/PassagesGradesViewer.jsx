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
 * Tableau des techniques structuré par attaque - Version Accordéon Amélioré
 */
const TechniquesTable = ({ techniques }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const [allExpanded, setAllExpanded] = useState(false);
  
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
  
  // Calculer le total des techniques avec détails
  const techniquesWithDetails = useMemo(() => {
    return techniques.filter(t => t.points_cles?.length > 0 || t.erreurs_communes?.length > 0 || t.description).length;
  }, [techniques]);
  
  const toggleRow = (idx) => {
    setExpandedRows(prev => ({ ...prev, [idx]: !prev[idx] }));
  };
  
  const toggleGroup = (groupIdx) => {
    setExpandedGroups(prev => ({ ...prev, [groupIdx]: !prev[groupIdx] }));
  };
  
  // Tout ouvrir / Tout fermer
  const toggleAll = () => {
    if (allExpanded) {
      // Fermer tout
      setExpandedRows({});
      setExpandedGroups({});
      setAllExpanded(false);
    } else {
      // Ouvrir tous les groupes
      const newExpandedGroups = {};
      groupedByAttack.forEach((_, idx) => {
        newExpandedGroups[idx] = true;
      });
      
      // Ouvrir toutes les techniques avec détails
      const newExpandedRows = {};
      groupedByAttack.forEach((group, groupIdx) => {
        group.techniques.forEach((tech, techIdx) => {
          const hasDetails = tech.points_cles?.length > 0 || tech.erreurs_communes?.length > 0 || tech.description;
          if (hasDetails) {
            newExpandedRows[`${groupIdx}-${techIdx}`] = true;
          }
        });
      });
      
      setExpandedGroups(newExpandedGroups);
      setExpandedRows(newExpandedRows);
      setAllExpanded(true);
    }
  };
  
  // Compter le nombre d'éléments ouverts
  const expandedCount = Object.values(expandedRows).filter(Boolean).length + Object.values(expandedGroups).filter(Boolean).length;
  
  if (!techniques || techniques.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        Aucune technique spécifiée pour ce grade
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Barre de contrôle - Tout ouvrir/fermer */}
      <div className="flex items-center justify-between bg-slate-800/30 rounded-lg px-4 py-3 border border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Swords className="w-4 h-4 text-amber-400" />
            <span className="font-medium text-white">{techniques.length}</span> techniques
            <span className="text-slate-500">•</span>
            <span className="font-medium text-cyan-400">{groupedByAttack.length}</span> catégories
          </div>
          {techniquesWithDetails > 0 && (
            <>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-500">
                {techniquesWithDetails} avec détails
              </span>
            </>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAll}
          className={`
            transition-all duration-300 border-slate-600 
            ${allExpanded 
              ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-amber-500/50' 
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600 hover:text-white'
            }
          `}
        >
          {allExpanded ? (
            <>
              <ChevronDown className="w-4 h-4 mr-2 rotate-180 transition-transform" />
              Tout fermer
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2 transition-transform" />
              Tout ouvrir
            </>
          )}
          {expandedCount > 0 && (
            <Badge className="ml-2 bg-slate-600 text-white text-xs px-1.5 py-0">
              {expandedCount}
            </Badge>
          )}
        </Button>
      </div>
      
      {/* Groupes accordéon */}
      {groupedByAttack.map((group, groupIdx) => {
        const isGroupExpanded = expandedGroups[groupIdx] !== false; // Par défaut ouvert
        const obligatoireCount = group.techniques.filter(t => t.obligatoire !== false).length;
        const optionnelCount = group.techniques.length - obligatoireCount;
        
        return (
          <motion.div 
            key={groupIdx} 
            className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIdx * 0.05, duration: 0.3 }}
          >
            {/* Header du groupe d'attaque - Cliquable */}
            <button
              onClick={() => toggleGroup(groupIdx)}
              className="w-full bg-slate-700/50 px-4 py-3 flex items-center justify-between hover:bg-slate-700/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Swords className="w-5 h-5 text-amber-400" />
                </motion.div>
                <div className="text-left">
                  <h4 className="font-bold text-white">{group.attaque}</h4>
                  {group.attaque_japonais && (
                    <span className="text-xs text-slate-400">{group.attaque_japonais}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Compteurs détaillés */}
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {obligatoireCount}
                  </Badge>
                  {optionnelCount > 0 && (
                    <Badge className="bg-slate-600/50 text-slate-400 border-0 text-xs">
                      <Circle className="w-3 h-3 mr-1" />
                      {optionnelCount}
                    </Badge>
                  )}
                </div>
                
                <Badge className="bg-amber-500/20 text-amber-400 border-0">
                  {group.techniques.length} technique{group.techniques.length > 1 ? 's' : ''}
                </Badge>
                
                <motion.div
                  animate={{ rotate: isGroupExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                </motion.div>
              </div>
            </button>
            
            {/* Contenu du groupe avec animation fluide */}
            <AnimatePresence initial={false}>
              {isGroupExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: 'auto', 
                    opacity: 1,
                    transition: {
                      height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                      opacity: { duration: 0.25, delay: 0.1 }
                    }
                  }}
                  exit={{ 
                    height: 0, 
                    opacity: 0,
                    transition: {
                      height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                      opacity: { duration: 0.2 }
                    }
                  }}
                  className="overflow-hidden"
                >
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
                              <motion.tr 
                                className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-700/30' : ''}`}
                                onClick={() => hasDetails && toggleRow(rowKey)}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: techIdx * 0.03, duration: 0.2 }}
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
                                    <motion.div
                                      animate={{ rotate: isExpanded ? 180 : 0 }}
                                      transition={{ duration: 0.3, ease: "easeInOut" }}
                                      className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-600/50"
                                    >
                                      <ChevronDown className="w-4 h-4 text-slate-400" />
                                    </motion.div>
                                  )}
                                </td>
                              </motion.tr>
                              
                              {/* Ligne de détails expandée avec animation fluide */}
                              <AnimatePresence initial={false}>
                                {isExpanded && hasDetails && (
                                  <tr>
                                    <td colSpan={5} className="px-0">
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ 
                                          height: 'auto', 
                                          opacity: 1,
                                          transition: {
                                            height: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] },
                                            opacity: { duration: 0.25, delay: 0.1 }
                                          }
                                        }}
                                        exit={{ 
                                          height: 0, 
                                          opacity: 0,
                                          transition: {
                                            height: { duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] },
                                            opacity: { duration: 0.15 }
                                          }
                                        }}
                                        className="overflow-hidden"
                                      >
                                        <motion.div 
                                          className="px-4 py-4 bg-slate-900/50 border-b border-slate-700/50"
                                          initial={{ y: -10 }}
                                          animate={{ y: 0 }}
                                          transition={{ duration: 0.2, delay: 0.1 }}
                                        >
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {/* Description */}
                                            {tech.description && (
                                              <motion.div 
                                                className="lg:col-span-3"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.15 }}
                                              >
                                                <p className="text-sm text-slate-300 italic">{tech.description}</p>
                                              </motion.div>
                                            )}
                                            
                                            {/* Points clés */}
                                            {tech.points_cles && tech.points_cles.length > 0 && (
                                              <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 }}
                                              >
                                                <h6 className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1">
                                                  <Target className="w-3 h-3" />
                                                  Points clés ({tech.points_cles.length})
                                                </h6>
                                                <ul className="space-y-1">
                                                  {tech.points_cles.map((point, idx) => (
                                                    <motion.li 
                                                      key={idx} 
                                                      className="text-xs text-slate-300 flex items-start gap-2"
                                                      initial={{ opacity: 0, x: -5 }}
                                                      animate={{ opacity: 1, x: 0 }}
                                                      transition={{ delay: 0.25 + idx * 0.05 }}
                                                    >
                                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                                                      {point}
                                                    </motion.li>
                                                  ))}
                                                </ul>
                                              </motion.div>
                                            )}
                                            
                                            {/* Erreurs communes */}
                                            {tech.erreurs_communes && tech.erreurs_communes.length > 0 && (
                                              <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.25 }}
                                              >
                                                <h6 className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1">
                                                  <AlertCircle className="w-3 h-3" />
                                                  Erreurs à éviter ({tech.erreurs_communes.length})
                                                </h6>
                                                <ul className="space-y-1">
                                                  {tech.erreurs_communes.map((erreur, idx) => (
                                                    <motion.li 
                                                      key={idx} 
                                                      className="text-xs text-slate-300 flex items-start gap-2"
                                                      initial={{ opacity: 0, x: -5 }}
                                                      animate={{ opacity: 1, x: 0 }}
                                                      transition={{ delay: 0.3 + idx * 0.05 }}
                                                    >
                                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                                                      {erreur}
                                                    </motion.li>
                                                  ))}
                                                </ul>
                                              </motion.div>
                                            )}
                                          </div>
                                        </motion.div>
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
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
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
  // État pour les sections repliables - DOIT être au début du composant
  const [showObjectifs, setShowObjectifs] = useState(false);
  const [showCriteres, setShowCriteres] = useState(false);
  
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
      className="space-y-4"
      data-testid="grade-detail-page"
    >
      {/* Header compact avec navigation et infos essentielles */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center gap-4">
          {/* Bouton retour */}
          <Button onClick={onBack} variant="ghost" size="sm" className="border-slate-600 hover:bg-slate-700">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          {/* Badge ceinture */}
          <BeltBadge color={grade.couleur_ceinture} size="md" showStar={isDan} />
          
          {/* Titre et description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold text-white">{grade.nom}</h1>
              <span className="text-lg text-slate-400">{grade.nom_japonais}</span>
              <Badge className="bg-slate-700 text-slate-300 text-xs">
                Ceinture {beltInfo.name}
              </Badge>
            </div>
            <p className="text-slate-400 text-sm mt-1 line-clamp-1">{grade.description}</p>
          </div>
          
          {/* Stats rapides */}
          <div className="hidden md:flex items-center gap-2">
            <Badge className="bg-amber-500/20 text-amber-400 border-0">
              <Swords className="w-3 h-3 mr-1" />
              {grade.nb_techniques} techniques
            </Badge>
            {grade.nb_mouvements > 0 && (
              <Badge className="bg-cyan-500/20 text-cyan-400 border-0">
                <Users className="w-3 h-3 mr-1" />
                {grade.nb_mouvements} mvts
              </Badge>
            )}
            <Badge className="bg-violet-500/20 text-violet-400 border-0">
              <Timer className="w-3 h-3 mr-1" />
              {grade.heures_minimum}h
            </Badge>
          </div>
        </div>
        
        {/* Prérequis compact */}
        {grade.prerequis && (
          <div className="mt-3 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm">
            <span className="text-amber-400 font-medium">Prérequis : </span>
            <span className="text-amber-200">{grade.prerequis}</span>
          </div>
        )}
      </div>
      
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TECHNIQUES EN PREMIER - Section principale visible immédiatement */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <Card className="bg-slate-800/50 border-slate-700 border-2 border-amber-500/30">
        <CardHeader className="pb-2 bg-gradient-to-r from-amber-900/20 to-orange-900/20">
          <CardTitle className="text-xl text-amber-400 flex items-center gap-2">
            <Swords className="w-6 h-6" />
            Programme Technique - {grade.nb_techniques} Prises
          </CardTitle>
          <p className="text-slate-400 text-sm">
            Les techniques à maîtriser pour ce grade
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <TechniquesTable techniques={grade.techniques} />
        </CardContent>
      </Card>
      
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTIONS SECONDAIRES - Repliées par défaut */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      
      {/* Mouvements - Section repliable */}
      <MouvementsSection mouvements={grade.mouvements} />
      
      {/* Objectifs - Section repliable */}
      {grade.objectifs && grade.objectifs.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <button
              onClick={() => setShowObjectifs(!showObjectifs)}
              className="w-full flex items-center justify-between"
            >
              <CardTitle className="text-base text-emerald-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Objectifs du grade ({grade.objectifs.length})
              </CardTitle>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${showObjectifs ? 'rotate-180' : ''}`} />
            </button>
          </CardHeader>
          <AnimatePresence>
            {showObjectifs && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {grade.objectifs.map((obj, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white">{obj}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}
      
      {/* Critères d'évaluation - Section repliable */}
      {grade.criteres_evaluation && grade.criteres_evaluation.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <button
              onClick={() => setShowCriteres(!showCriteres)}
              className="w-full flex items-center justify-between"
            >
              <CardTitle className="text-base text-rose-400 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Critères d'évaluation ({grade.criteres_evaluation.length})
              </CardTitle>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${showCriteres ? 'rotate-180' : ''}`} />
            </button>
          </CardHeader>
          <AnimatePresence>
            {showCriteres && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent>
                  <div className="space-y-2">
                    {grade.criteres_evaluation.map((critere, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-sm">
                        <Shield className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white">{critere}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}
      
      {/* Durée examen - Compact */}
      {grade.duree_examen && (
        <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-lg p-4 border border-violet-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/30 flex items-center justify-center">
              <Timer className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Durée de l'examen</h4>
              <p className="text-violet-300">{grade.duree_examen}</p>
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
