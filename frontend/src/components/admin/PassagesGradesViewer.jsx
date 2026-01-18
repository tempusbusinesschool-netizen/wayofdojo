/**
 * 🎓 PASSAGES DE GRADES VIEWER
 * 
 * Composant pour visualiser le programme officiel des passages de grades
 * en Aïkido, du 6e Kyu (débutant) au 4e Dan (maître).
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Clock, Target, AlertCircle, BookOpen, Video,
  ChevronDown, ChevronRight, CheckCircle2, Circle,
  Swords, Users, GraduationCap, Star, Shield,
  Play, FileText, Timer, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Import des données
import { PASSAGES_DE_GRADES, getGradesKyu, getGradesDan, getNombreTechniquesGrade } from '@/constants/passagesGrades';

/**
 * Carte pour un grade individuel dans la liste
 */
const GradeCard = ({ grade, isSelected, onSelect }) => {
  const nombreTechniques = getNombreTechniquesGrade(grade.id);
  
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
          {grade.couleur_ceinture === '#000000' ? (
            <Star className="w-6 h-6 text-yellow-400" />
          ) : (
            <Award className="w-6 h-6" style={{ color: grade.couleur_ceinture === '#FFFFFF' ? '#000' : '#fff' }} />
          )}
        </div>
        
        {/* Infos du grade */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-white">{grade.nom}</h4>
            <span className="text-slate-500 text-sm">({grade.nom_japonais})</span>
          </div>
          <p className="text-sm text-slate-400">Ceinture {grade.ceinture} • {grade.niveau}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {grade.duree_minimale}
            </span>
            {nombreTechniques > 0 && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Target className="w-3 h-3" />
                {nombreTechniques} techniques
              </span>
            )}
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
  const [expandedCat, setExpandedCat] = useState(null);
  
  if (!mouvements || mouvements.length === 0) return null;
  
  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Mouvements fondamentaux requis
      </h4>
      
      {mouvements.map((cat, idx) => (
        <div key={idx} className="bg-slate-800/50 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedCat(expandedCat === idx ? null : idx)}
            className="w-full p-3 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
          >
            <span className="font-medium text-white">{cat.categorie}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">{cat.elements?.length || 0} éléments</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedCat === idx ? 'rotate-180' : ''}`} />
            </div>
          </button>
          
          <AnimatePresence>
            {expandedCat === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-slate-700"
              >
                <div className="p-3 space-y-2">
                  {cat.elements?.map((elem, i) => (
                    <div key={i} className="flex items-start gap-2">
                      {elem.obligatoire ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <span className="text-white font-medium">{elem.nom}</span>
                        {elem.description && (
                          <span className="text-slate-400 text-sm ml-2">— {elem.description}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {cat.video?.placeholder && (
                    <div className="mt-3 p-2 bg-violet-500/10 rounded-lg flex items-center gap-2">
                      <Play className="w-4 h-4 text-violet-400" />
                      <span className="text-sm text-violet-300">Vidéo : {cat.video.placeholder}</span>
                    </div>
                  )}
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
 * Section des techniques requises
 */
const TechniquesSection = ({ techniques }) => {
  const [expandedAttaque, setExpandedAttaque] = useState(null);
  
  if (!techniques || techniques.length === 0) return null;
  
  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
        <Swords className="w-5 h-5" />
        Techniques requises par attaque
      </h4>
      
      {techniques.map((attaque, idx) => (
        <div key={idx} className="bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700">
          <button
            onClick={() => setExpandedAttaque(expandedAttaque === idx ? null : idx)}
            className="w-full p-4 flex items-start justify-between hover:bg-slate-700/50 transition-colors text-left"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white">{attaque.attaque}</span>
                {attaque.attaque_jp && (
                  <span className="text-slate-500 text-sm">({attaque.attaque_jp})</span>
                )}
              </div>
              {attaque.description && (
                <p className="text-sm text-slate-400">{attaque.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/50">
                {attaque.techniques?.length || 0} techniques
              </Badge>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedAttaque === idx ? 'rotate-180' : ''}`} />
            </div>
          </button>
          
          <AnimatePresence>
            {expandedAttaque === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-slate-700"
              >
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {attaque.techniques?.map((tech, i) => (
                      <div 
                        key={i} 
                        className={`p-3 rounded-lg ${tech.obligatoire ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-slate-700/30'}`}
                      >
                        <div className="flex items-start gap-2">
                          {tech.obligatoire ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                          )}
                          <div>
                            <span className="text-white font-medium">{tech.nom}</span>
                            {tech.description && (
                              <p className="text-xs text-slate-400 mt-0.5">{tech.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {attaque.video?.placeholder && (
                    <div className="mt-3 p-2 bg-violet-500/10 rounded-lg flex items-center gap-2">
                      <Video className="w-4 h-4 text-violet-400" />
                      <span className="text-sm text-violet-300">{attaque.video.placeholder}</span>
                    </div>
                  )}
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
 * Vue détaillée d'un grade
 */
const GradeDetailView = ({ grade, onBack }) => {
  if (!grade) return null;
  
  const nombreTechniques = getNombreTechniquesGrade(grade.id);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
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
            {grade.couleur_ceinture === '#000000' ? (
              <div className="text-center">
                <Star className="w-8 h-8 text-yellow-400 mx-auto" />
                <span className="text-yellow-400 text-xs font-bold mt-1 block">DAN</span>
              </div>
            ) : (
              <Award className="w-12 h-12" style={{ color: grade.couleur_ceinture === '#FFFFFF' ? '#000' : '#fff' }} />
            )}
          </div>
          
          {/* Infos principales */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">{grade.nom}</h2>
              <span className="text-xl text-slate-400">{grade.nom_japonais}</span>
            </div>
            <p className="text-slate-300 mb-4">{grade.description}</p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: grade.couleur_ceinture }}></div>
                <span className="text-white font-medium">Ceinture {grade.ceinture}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-white">{grade.duree_minimale}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg">
                <Timer className="w-4 h-4 text-violet-400" />
                <span className="text-white">{grade.heures_minimales}h minimum</span>
              </div>
              {nombreTechniques > 0 && (
                <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-2 rounded-lg">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">{nombreTechniques} techniques</span>
                </div>
              )}
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
                <div key={idx} className="flex items-start gap-2 p-3 bg-slate-700/30 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">{obj}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Mouvements requis */}
      {grade.mouvements_requis && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <MouvementsSection mouvements={grade.mouvements_requis} />
          </CardContent>
        </Card>
      )}
      
      {/* Techniques requises */}
      {grade.techniques_requises && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <TechniquesSection techniques={grade.techniques_requises} />
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
      
      {/* Vidéo du passage complet */}
      {grade.video_complete && (
        <Card className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-violet-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-violet-500/30 flex items-center justify-center">
                <Play className="w-8 h-8 text-violet-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white">Vidéo du passage complet</h4>
                <p className="text-violet-300">Durée estimée : {grade.video_complete.duree}</p>
                <p className="text-sm text-violet-400/70 font-mono mt-1">{grade.video_complete.placeholder}</p>
              </div>
              <Button variant="outline" className="border-violet-500 text-violet-400 hover:bg-violet-500/20">
                <Video className="w-4 h-4 mr-2" />
                Voir
              </Button>
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
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [activeTab, setActiveTab] = useState('kyu'); // 'kyu' ou 'dan'
  
  const gradesKyu = getGradesKyu();
  const gradesDan = getGradesDan();
  
  const handleSelectGrade = (grade) => {
    setSelectedGrade(grade);
  };
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-emerald-400" />
            Passages de Grades
          </h2>
          <p className="text-slate-400 mt-1">Programme officiel de 6e Kyu à 4e Dan</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-2xl font-bold text-emerald-400">10</span>
            <span className="text-slate-400 text-sm ml-2">grades</span>
          </div>
        </div>
      </div>
      
      {/* Tabs Kyu / Dan */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'kyu' ? 'default' : 'outline'}
          onClick={() => { setActiveTab('kyu'); setSelectedGrade(null); }}
          className={activeTab === 'kyu' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-slate-600'}
        >
          <Award className="w-4 h-4 mr-2" />
          Grades Kyu (6)
        </Button>
        <Button
          variant={activeTab === 'dan' ? 'default' : 'outline'}
          onClick={() => { setActiveTab('dan'); setSelectedGrade(null); }}
          className={activeTab === 'dan' ? 'bg-amber-600 hover:bg-amber-700' : 'border-slate-600'}
        >
          <Star className="w-4 h-4 mr-2" />
          Grades Dan (4)
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des grades */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-lg font-semibold text-white mb-4">
            {activeTab === 'kyu' ? 'Grades Kyu (Mudansha)' : 'Grades Dan (Yudansha)'}
          </h3>
          
          {(activeTab === 'kyu' ? gradesKyu : gradesDan).map((grade) => (
            <GradeCard
              key={grade.id}
              grade={grade}
              isSelected={selectedGrade?.id === grade.id}
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
                <Video className="w-4 h-4 text-violet-400" />
                <span className="text-slate-300">Vidéo disponible</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Détail du grade sélectionné */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedGrade ? (
              <GradeDetailView 
                key={selectedGrade.id}
                grade={selectedGrade} 
                onBack={() => setSelectedGrade(null)}
              />
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
                  <p className="text-slate-500">
                    Cliquez sur un grade pour voir le programme détaillé
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
