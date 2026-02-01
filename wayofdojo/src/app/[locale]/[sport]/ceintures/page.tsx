'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Award, Clock, Target, ChevronDown, ChevronUp, 
  Sword, Shield, Star, Lock, CheckCircle2, 
  Play, Users, Scroll, BookOpen
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TanakaWelcome, TANAKA_MESSAGES } from '@/components/TanakaWelcome';
import { getGradesKyu, getGradesDan, type ProgrammeGrade } from '@/data/aikido/grades/passages-de-grades';
import { getQuizByGrade } from '@/data/aikido/grades/quiz-grades';
import { getMouvementsByGradeGrouped, getAllMouvementsGrouped, getTotalMouvements, CATEGORIES_MOUVEMENTS } from '@/data/aikido/techniques-by-grade';
import QuizModal from '@/components/quiz/QuizModal';
import { TechniqueDetailCard } from '@/components/techniques/TechniqueDetailCard';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PAGE LES CEINTURES — PROGRAMME DE PROGRESSION
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * ⚠️ DONNÉES VERROUILLÉES - Programme officiel de progression
 * Source: /app/wayofdojo/src/data/aikido/grades/passages-de-grades.ts
 */

// Composant carte de grade
const GradeCard: React.FC<{
  grade: ProgrammeGrade;
  isExpanded: boolean;
  onToggle: () => void;
  isUnlocked: boolean;
  isCurrent: boolean;
  onStartQuiz: () => void;
  hasQuiz: boolean;
}> = ({ grade, isExpanded, onToggle, isUnlocked, isCurrent, onStartQuiz, hasQuiz }) => {
  const [showTechniquesDetail, setShowTechniquesDetail] = useState(false);
  const [expandedProgrammeTech, setExpandedProgrammeTech] = useState<string | null>(null);
  
  // Récupérer les techniques/mouvements pour ce grade (filtrées)
  const techniquesByCategory = useMemo(() => {
    return getMouvementsByGradeGrouped(grade.id);
  }, [grade.id]);
  
  // BIBLIOTHÈQUE COMPLÈTE - TOUTES les techniques
  const allTechniquesByCategory = useMemo(() => {
    return getAllMouvementsGrouped();
  }, []);
  
  const totalAllTechniques = getTotalMouvements();
  
  const totalTechniques = useMemo(() => {
    return Object.values(techniquesByCategory).flat().length;
  }, [techniquesByCategory]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${!isUnlocked ? 'opacity-60' : ''}`}
      data-testid={`grade-card-${grade.id}`}
    >
      {/* Badge "Actuel" */}
      {isCurrent && (
        <div className="absolute -top-3 left-4 z-10 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg">
          ⭐ Grade actuel
        </div>
      )}

      {/* Carte principale */}
      <div 
        className={`
          relative overflow-hidden rounded-2xl border-2 transition-all duration-300
          ${isCurrent 
            ? 'border-amber-500 shadow-lg shadow-amber-500/20 bg-gradient-to-br from-slate-800 to-amber-900/30' 
            : !isUnlocked 
              ? 'border-slate-700 bg-slate-900/50' 
              : 'border-slate-700 hover:border-slate-500 bg-gradient-to-br from-slate-800 to-slate-900'
          }
        `}
      >
        {/* Header cliquable */}
        <div 
          onClick={onToggle}
          className="p-4 sm:p-5 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            {/* Ceinture visuelle */}
            <div 
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shadow-lg relative"
              style={{ 
                background: grade.couleur_ceinture === '#FFFFFF' 
                  ? 'linear-gradient(135deg, #f8f8f8, #e0e0e0)' 
                  : `linear-gradient(135deg, ${grade.couleur_ceinture}, ${grade.couleur_ceinture}dd)`,
                border: grade.couleur_ceinture === '#FFFFFF' ? '2px solid #ccc' : 'none'
              }}
            >
              <span className="text-2xl sm:text-3xl font-bold" style={{ 
                color: grade.couleur_ceinture === '#FFFFFF' || grade.couleur_ceinture === '#FFD700' 
                  ? '#333' 
                  : '#fff' 
              }}>
                {grade.nom_japonais}
              </span>
              {!isUnlocked && (
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                {grade.nom}
                {isUnlocked && !isCurrent && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              </h3>
              <p className="text-slate-400 text-sm">
                Ceinture {grade.ceinture} • {grade.niveau}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {grade.duree_minimale}
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" /> {grade.heures_minimales}h min
                </span>
              </div>
            </div>

            {/* Toggle */}
            <div className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>
          </div>

          {/* Description courte */}
          <p className="mt-3 text-sm text-slate-300 line-clamp-2">
            {grade.description}
          </p>
        </div>

        {/* Contenu étendu */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 sm:px-5 pb-5 space-y-5 border-t border-slate-700/50 pt-5">
                
                {/* Objectifs */}
                <div>
                  <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Objectifs
                  </h4>
                  <ul className="space-y-2">
                    {grade.objectifs.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mouvements requis */}
                {grade.mouvements_requis && grade.mouvements_requis.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Mouvements requis
                    </h4>
                    <div className="grid gap-3">
                      {grade.mouvements_requis.map((cat, idx) => (
                        <div key={idx} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                          <h5 className="text-sm font-semibold text-white mb-2">{cat.categorie}</h5>
                          <div className="flex flex-wrap gap-2">
                            {cat.elements.map((elem, elemIdx) => (
                              <span 
                                key={elemIdx}
                                className={`text-xs px-2 py-1 rounded-lg ${
                                  elem.obligatoire 
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                                    : 'bg-slate-700 text-slate-400'
                                }`}
                                title={elem.description}
                              >
                                {elem.nom}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* PROGRAMME TECHNIQUE PAR ATTAQUE (Ikkyo, Shiho Nage, etc.) */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                {grade.techniques_requises && grade.techniques_requises.length > 0 && (
                  <div className="bg-gradient-to-br from-rose-900/40 to-pink-900/30 rounded-2xl p-4 border-2 border-rose-500/50 shadow-lg shadow-rose-500/10">
                    <h4 className="text-base font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      Programme technique par attaque
                      <span className="text-xs font-normal text-rose-300/70 ml-2">
                        ({grade.techniques_requises.reduce((acc, att) => acc + att.techniques.length, 0)} techniques)
                      </span>
                    </h4>
                    
                    <div className="space-y-4">
                      {grade.techniques_requises.map((attaque, idx) => (
                        <div key={idx} className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50">
                          {/* En-tête de l'attaque */}
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h5 className="text-sm font-bold text-white flex items-center gap-2">
                                <Target className="w-4 h-4 text-rose-400" />
                                {attaque.attaque}
                              </h5>
                              {attaque.attaque_jp && (
                                <span className="text-xs text-rose-400 ml-6">{attaque.attaque_jp}</span>
                              )}
                            </div>
                            <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-1 rounded-full">
                              {attaque.techniques.length} technique{attaque.techniques.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          
                          {attaque.description && (
                            <p className="text-xs text-slate-400 mb-3 ml-6">{attaque.description}</p>
                          )}
                          
                          {/* Liste des techniques - cliquables avec détails */}
                          <div className="space-y-2 ml-6">
                            {attaque.techniques.map((tech, techIdx) => {
                              const techKey = `${grade.id}-${idx}-${techIdx}`;
                              const isExpanded = expandedProgrammeTech === techKey;
                              
                              return (
                                <div key={techIdx}>
                                  <div 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedProgrammeTech(isExpanded ? null : techKey);
                                    }}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                                      tech.obligatoire 
                                        ? 'bg-rose-500/20 border border-rose-500/30 hover:bg-rose-500/30' 
                                        : 'bg-slate-700/50 border border-slate-600/30 hover:bg-slate-700'
                                    }`}
                                  >
                                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${
                                      tech.obligatoire ? 'text-rose-400' : 'text-slate-500'
                                    }`} />
                                    <div className="flex-1 min-w-0">
                                      <span className="text-sm font-medium text-white">{tech.nom}</span>
                                      {tech.description && (
                                        <p className="text-xs text-slate-400">{tech.description}</p>
                                      )}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                  </div>
                                  
                                  {/* Détails de la technique */}
                                  <AnimatePresence>
                                    {isExpanded && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="mt-2 p-3 bg-slate-800/80 rounded-lg border border-slate-600/50 space-y-3">
                                          {/* Points clés */}
                                          <div>
                                            <p className="text-xs font-bold text-emerald-400 mb-1">Points clés :</p>
                                            <ul className="space-y-1">
                                              {tech.nom.includes('Ikkyo') && (
                                                <>
                                                  <li className="flex items-start gap-2 text-xs text-slate-300">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                                    Contrôle du coude ET du poignet simultanément
                                                  </li>
                                                  <li className="flex items-start gap-2 text-xs text-slate-300">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                                    Couper vers le bas avec le poids du corps
                                                  </li>
                                                  <li className="flex items-start gap-2 text-xs text-slate-300">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                                    Garder le bras de Uke tendu
                                                  </li>
                                                </>
                                              )}
                                              {tech.nom.includes('Shiho Nage') && (
                                                <>
                                                  <li className="flex items-start gap-2 text-xs text-slate-300">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                                    Amener la main de Uke vers son épaule opposée
                                                  </li>
                                                  <li className="flex items-start gap-2 text-xs text-slate-300">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                                    Rotation des hanches pour projeter
                                                  </li>
                                                  <li className="flex items-start gap-2 text-xs text-slate-300">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                                    Couper vers le bas, pas vers l&apos;arrière
                                                  </li>
                                                </>
                                              )}
                                              {tech.nom.includes('Irimi Nage') && (
                                                <>
                                                  <li className="flex items-start gap-2 text-xs text-slate-300">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                                    Entrer profondément (irimi) dans l&apos;espace de Uke
                                                  </li>
                                                  <li className="flex items-start gap-2 text-xs text-slate-300">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                                    Contrôle de la nuque/tête, pas de la gorge
                                                  </li>
                                                  <li className="flex items-start gap-2 text-xs text-slate-300">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                                    Projection circulaire, pas linéaire
                                                  </li>
                                                </>
                                              )}
                                              {tech.nom.includes('Kokyu') && (
                                                <>
                                                  <li className="flex items-start gap-2 text-xs text-slate-300">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                                    Utiliser la respiration, pas la force musculaire
                                                  </li>
                                                  <li className="flex items-start gap-2 text-xs text-slate-300">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                                    Extension du Ki depuis le centre (hara)
                                                  </li>
                                                  <li className="flex items-start gap-2 text-xs text-slate-300">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                                    Mouvement fluide et continu
                                                  </li>
                                                </>
                                              )}
                                              {!tech.nom.includes('Ikkyo') && !tech.nom.includes('Shiho Nage') && !tech.nom.includes('Irimi Nage') && !tech.nom.includes('Kokyu') && (
                                                <li className="flex items-start gap-2 text-xs text-slate-300">
                                                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                                  Maintenir le centre et la connexion avec Uke
                                                </li>
                                              )}
                                            </ul>
                                          </div>
                                          
                                          {/* Variantes */}
                                          <div className="flex items-center gap-2 text-xs">
                                            <span className="text-slate-500">Variantes :</span>
                                            {tech.nom.includes('Omote') ? (
                                              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded">
                                                Version Omote (entrée directe)
                                              </span>
                                            ) : tech.nom.includes('Ura') ? (
                                              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                                                Version Ura (avec pivot)
                                              </span>
                                            ) : (
                                              <span className="px-2 py-0.5 bg-slate-500/20 text-slate-300 rounded">
                                                Forme de base
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* BIBLIOTHÈQUE DE TECHNIQUES - TOUTES LES TECHNIQUES */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                {totalAllTechniques > 0 && (
                  <div className="bg-gradient-to-br from-purple-900/40 to-violet-900/30 rounded-2xl p-4 border-2 border-purple-500/50 shadow-lg shadow-purple-500/10">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTechniquesDetail(!showTechniquesDetail);
                      }}
                    >
                      <h4 className="text-base font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                          <Sword className="w-4 h-4 text-white" />
                        </div>
                        Bibliothèque de techniques
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white bg-purple-600 px-3 py-1.5 rounded-full shadow-md">
                          {totalAllTechniques} techniques
                        </span>
                        <div className={`w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center transition-transform ${showTechniquesDetail ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-5 h-5 text-purple-300" />
                        </div>
                      </div>
                    </div>
                    
                    {!showTechniquesDetail && (
                      <p className="text-xs text-purple-300/70 mt-2 pl-10">
                        Cliquez pour explorer toutes les techniques avec explications détaillées et vidéos
                      </p>
                    )}

                    <AnimatePresence>
                      {showTechniquesDetail && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 space-y-4">
                            {Object.entries(allTechniquesByCategory).map(([category, techniques]) => {
                              const catInfo = CATEGORIES_MOUVEMENTS[category] || {
                                label: category,
                                emoji: '📚',
                                color: 'from-slate-500 to-slate-600'
                              };
                              
                              return (
                                <div key={category} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                                  <h5 className={`text-sm font-bold text-white mb-3 flex items-center gap-2`}>
                                    <span className="text-lg">{catInfo.emoji}</span>
                                    {catInfo.label}
                                    <span className="text-xs text-slate-500 font-normal">
                                      ({techniques.length})
                                    </span>
                                  </h5>
                                  <div className="space-y-2">
                                    {techniques.map((technique) => (
                                      <TechniqueDetailCard 
                                        key={technique.id} 
                                        technique={technique} 
                                        compact={true}
                                      />
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Critères d'évaluation */}
                {grade.criteres_evaluation && grade.criteres_evaluation.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4" /> Critères d&apos;évaluation
                    </h4>
                    <ul className="space-y-2">
                      {grade.criteres_evaluation.map((critere, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          {critere}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bouton vidéo */}
                {grade.video_complete && (
                  <div className="pt-2">
                    <Button
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                      disabled={!grade.video_complete.url}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Voir le passage ({grade.video_complete.duree})
                    </Button>
                    {!grade.video_complete.url && (
                      <p className="text-xs text-slate-500 text-center mt-2">Vidéo bientôt disponible</p>
                    )}
                  </div>
                )}

                {/* Bouton Quiz */}
                {hasQuiz && (
                  <div className="pt-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartQuiz();
                      }}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
                      data-testid={`quiz-button-${grade.id}`}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Tester mes connaissances 📝
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function CeinturesPage() {
  const router = useRouter();
  const [expandedGrade, setExpandedGrade] = useState<string | null>(null);
  const [showDan, setShowDan] = useState(false);
  const [selectedQuizGrade, setSelectedQuizGrade] = useState<string | null>(null);

  // Simuler le grade actuel de l'utilisateur (à remplacer par les vraies données)
  const currentUserGrade = '6e_kyu';
  const unlockedGrades = ['6e_kyu']; // Grades débloqués

  const toggleGrade = (gradeId: string) => {
    setExpandedGrade(expandedGrade === gradeId ? null : gradeId);
  };

  const gradesKyu = getGradesKyu();
  const gradesDan = getGradesDan();

  // Quiz du grade sélectionné
  const selectedQuiz = selectedQuizGrade ? getQuizByGrade(selectedQuizGrade) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Message d'accueil Tanaka */}
      <TanakaWelcome
        sectionId="ceintures"
        sectionTitle={TANAKA_MESSAGES['ceintures'].title}
        message={TANAKA_MESSAGES['ceintures'].message}
        emoji={TANAKA_MESSAGES['ceintures'].emoji}
        variant="full"
      />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-slate-800"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              🎖️ Les Ceintures
            </h1>
            <p className="text-sm text-slate-400">Programme de progression</p>
          </div>
          <div className="flex items-center gap-2">
            <Scroll className="w-5 h-5 text-amber-500" />
            <span className="text-sm text-amber-400 font-medium">
              {gradesKyu.length + gradesDan.length} grades
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Explication officielle */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl p-4 sm:p-5 border border-amber-500/30"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-300">Programme de Progression</h2>
              <p className="text-sm text-slate-300 mt-1">
                Le système de grades en Aïkido comprend 6 grades Kyu (débutant à avancé) 
                et des grades Dan (ceinture noire). Chaque passage requiert un temps minimum 
                de pratique et la maîtrise de techniques spécifiques.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50"
          >
            <div className="text-2xl font-bold text-cyan-400">6</div>
            <div className="text-xs text-slate-400">Grades Kyu</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50"
          >
            <div className="text-2xl font-bold text-purple-400">4+</div>
            <div className="text-xs text-slate-400">Grades Dan</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50"
          >
            <div className="text-2xl font-bold text-amber-400">3+ ans</div>
            <div className="text-xs text-slate-400">Pour Shodan</div>
          </motion.div>
        </div>

        {/* Section Kyu */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-sm">級</span>
            Grades Kyu
            <span className="text-xs text-slate-500 font-normal ml-2">Du 6e au 1er Kyu</span>
          </h2>
          
          <div className="space-y-4">
            {gradesKyu.map((grade, idx) => (
              <GradeCard
                key={grade.id}
                grade={grade}
                isExpanded={expandedGrade === grade.id}
                onToggle={() => toggleGrade(grade.id)}
                isUnlocked={unlockedGrades.includes(grade.id) || idx === 0}
                isCurrent={currentUserGrade === grade.id}
                hasQuiz={!!getQuizByGrade(grade.id)}
                onStartQuiz={() => setSelectedQuizGrade(grade.id)}
              />
            ))}
          </div>
        </div>

        {/* Toggle Dan */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowDan(!showDan)}
            className="border-slate-700 hover:bg-slate-800 text-slate-300"
          >
            {showDan ? 'Masquer' : 'Afficher'} les grades Dan
            {showDan ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        {/* Section Dan */}
        <AnimatePresence>
          {showDan && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-slate-900 to-black rounded-lg flex items-center justify-center text-sm border border-slate-600">段</span>
                Grades Dan
                <span className="text-xs text-slate-500 font-normal ml-2">Ceinture Noire</span>
              </h2>
              
              <div className="space-y-4">
                {gradesDan.map((grade) => (
                  <GradeCard
                    key={grade.id}
                    grade={grade}
                    isExpanded={expandedGrade === grade.id}
                    onToggle={() => toggleGrade(grade.id)}
                    isUnlocked={false}
                    isCurrent={false}
                    hasQuiz={false}
                    onStartQuiz={() => {}}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 text-center"
        >
          <p className="text-xs text-slate-500">
            Programme officiel de progression en Aïkido.
            Les durées et contenus peuvent varier selon les dojos et enseignants.
          </p>
        </motion.div>
      </div>

      {/* Modal Quiz */}
      {selectedQuiz && (
        <QuizModal
          quiz={selectedQuiz}
          isOpen={!!selectedQuizGrade}
          onClose={() => setSelectedQuizGrade(null)}
          onComplete={(score, passed) => {
            console.log(`Quiz terminé: ${score}% - ${passed ? 'Réussi' : 'Échoué'}`);
          }}
        />
      )}
    </div>
  );
}
