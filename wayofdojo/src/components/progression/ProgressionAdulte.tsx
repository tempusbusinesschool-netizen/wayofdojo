'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronDown,
  Award, 
  Clock, 
  Target, 
  BookOpen,
  Swords,
  Shield,
  Flame,
  Star,
  Lock,
  CheckCircle2,
  Circle,
  Info
} from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ProgressionAdulte - Section "Ma Progression" version graphique adulte
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Affichage professionnel et élégant de tous les grades Aikido (Kyu + Dan)
 * avec timeline verticale, indicateurs de progression, et détails des grades.
 */

// Types
interface GradeData {
  id: string;
  nom: string;
  nom_japonais: string;
  kanji: string;
  couleur: string;
  couleurBg: string;
  couleurBorder: string;
  niveau: 'kyu' | 'dan';
  ordre: number;
  duree_minimale: string;
  heures_minimales?: number;
  description: string;
  techniques_cles: string[];
  competences: string[];
}

interface ProgressionAdulteProps {
  currentGrade?: string;
  progress?: number; // 0-100 pour le grade actuel
  techniquesValidees?: number;
  totalTechniques?: number;
  heuresEntrainement?: number;
}

// Données complètes des grades
const GRADES_COMPLETS: GradeData[] = [
  // GRADES KYU
  {
    id: '6e_kyu',
    nom: '6e Kyu',
    nom_japonais: 'Rokkyu',
    kanji: '六級',
    couleur: '#E5E7EB',
    couleurBg: 'bg-gray-100',
    couleurBorder: 'border-gray-300',
    niveau: 'kyu',
    ordre: 0,
    duree_minimale: '3 mois',
    heures_minimales: 40,
    description: 'Débutant - Les fondations. Apprentissage de l\'étiquette et des chutes de base.',
    techniques_cles: ['Mae Ukemi', 'Ushiro Ukemi', 'Ikkyo Omote/Ura', 'Shiho Nage', 'Kokyu Ho'],
    competences: ['Étiquette du dojo', 'Postures de base', 'Chutes simples', 'Déplacements fondamentaux']
  },
  {
    id: '5e_kyu',
    nom: '5e Kyu',
    nom_japonais: 'Gokyu',
    kanji: '五級',
    couleur: '#FCD34D',
    couleurBg: 'bg-yellow-100',
    couleurBorder: 'border-yellow-400',
    niveau: 'kyu',
    ordre: 1,
    duree_minimale: '3 mois',
    heures_minimales: 60,
    description: 'Débutant confirmé - Consolidation des bases et diversification des attaques.',
    techniques_cles: ['Irimi Nage', 'Kote Gaeshi', 'Nikyo', 'Tenchi Nage', 'Shikko'],
    competences: ['Fluidité des ukemi', 'Attaques Shomen/Yokomen', 'Connexion partenaire']
  },
  {
    id: '4e_kyu',
    nom: '4e Kyu',
    nom_japonais: 'Yonkyu',
    kanji: '四級',
    couleur: '#FB923C',
    couleurBg: 'bg-orange-100',
    couleurBorder: 'border-orange-400',
    niveau: 'kyu',
    ordre: 2,
    duree_minimale: '3 mois',
    heures_minimales: 80,
    description: 'Intermédiaire débutant - Maîtrise des 4 premiers principes (Ikkyo à Yonkyo).',
    techniques_cles: ['Sankyo', 'Yonkyo', 'Kaiten Nage', 'Ushiro Ryote Dori', 'Hanmi Handachi'],
    competences: ['Distinction Omote/Ura', 'Travail à genoux', 'Adaptabilité']
  },
  {
    id: '3e_kyu',
    nom: '3e Kyu',
    nom_japonais: 'Sankyu',
    kanji: '三級',
    couleur: '#22C55E',
    couleurBg: 'bg-green-100',
    couleurBorder: 'border-green-500',
    niveau: 'kyu',
    ordre: 3,
    duree_minimale: '4 mois',
    heures_minimales: 100,
    description: 'Intermédiaire - Introduction aux armes (Jo, Bokken) et approfondissement technique.',
    techniques_cles: ['Ken Suburi 1-4', 'Jo Suburi 1-10', 'Kumitachi', 'Tobi Ukemi', 'Chudan Tsuki'],
    competences: ['Bases des armes', 'Chute aérienne', 'Rôle d\'Uke de qualité']
  },
  {
    id: '2e_kyu',
    nom: '2e Kyu',
    nom_japonais: 'Nikyu',
    kanji: '二級',
    couleur: '#3B82F6',
    couleurBg: 'bg-blue-100',
    couleurBorder: 'border-blue-500',
    niveau: 'kyu',
    ordre: 4,
    duree_minimale: '4 mois',
    heures_minimales: 120,
    description: 'Intermédiaire avancé - Défenses contre couteau (Tanto Dori) et maîtrise de Gokyo.',
    techniques_cles: ['Gokyo', 'Tanto Dori', 'Jo Dori', '31 Jo Kata', 'Ken Suburi 1-7'],
    competences: ['Défense armes blanches', 'Kokyu développé', 'Expression personnelle']
  },
  {
    id: '1er_kyu',
    nom: '1er Kyu',
    nom_japonais: 'Ikkyu',
    kanji: '一級',
    couleur: '#92400E',
    couleurBg: 'bg-amber-100',
    couleurBorder: 'border-amber-700',
    niveau: 'kyu',
    ordre: 5,
    duree_minimale: '6 mois',
    heures_minimales: 150,
    description: 'Avancé (pré-Dan) - Préparation complète au Shodan. Maîtrise de l\'ensemble du programme.',
    techniques_cles: ['Tachi Dori', 'Jo Nage', 'Jiyu Waza', 'Randori', 'Toutes techniques Kyu'],
    competences: ['Maîtrise technique complète', 'Compréhension martiale', 'Capacité pédagogique']
  },
  // GRADES DAN
  {
    id: 'shodan',
    nom: 'Shodan',
    nom_japonais: '1er Dan',
    kanji: '初段',
    couleur: '#1F2937',
    couleurBg: 'bg-slate-900',
    couleurBorder: 'border-slate-700',
    niveau: 'dan',
    ordre: 6,
    duree_minimale: '1 an après 1er Kyu',
    heures_minimales: 200,
    description: 'Premier Dan - "Sho" signifie début. Le vrai apprentissage commence.',
    techniques_cles: ['Suwariwaza complet', 'Tanto Dori avancé', 'Jo Dori', 'Randori 2 adversaires', 'Gokyo complet'],
    competences: ['Fluidité des déplacements', 'Précision des immobilisations', 'Maîtrise des chutes', 'Enseignement débutants']
  },
  {
    id: 'nidan',
    nom: 'Nidan',
    nom_japonais: '2e Dan',
    kanji: '二段',
    couleur: '#1F2937',
    couleurBg: 'bg-slate-900',
    couleurBorder: 'border-amber-600',
    niveau: 'dan',
    ordre: 7,
    duree_minimale: '2 ans après Shodan',
    heures_minimales: 300,
    description: 'Deuxième Dan - Rapidité et puissance. Développement de la recherche personnelle.',
    techniques_cles: ['Henka Waza', 'Ushiro Waza complet', 'Futari Dori', 'Kaeshi Waza', 'Tachi Dori avancé'],
    competences: ['Vitesse d\'exécution', 'Puissance contrôlée', 'Adaptabilité', 'Zanshin']
  },
  {
    id: 'sandan',
    nom: 'Sandan',
    nom_japonais: '3e Dan',
    kanji: '三段',
    couleur: '#1F2937',
    couleurBg: 'bg-slate-900',
    couleurBorder: 'border-red-600',
    niveau: 'dan',
    ordre: 8,
    duree_minimale: '3 ans après Nidan',
    heures_minimales: 400,
    description: 'Troisième Dan - Compréhension du Kokyu Ryoku. Entrée dans la dimension spirituelle.',
    techniques_cles: ['Sannin Dori', 'Henka Waza libre', 'Oyo Waza', 'Tanto Randori', 'Kaeshi Waza avancé'],
    competences: ['Kokyu Ryoku', 'Timing parfait', 'Lecture de l\'intention', 'Formation ceintures noires']
  },
  {
    id: 'yondan',
    nom: 'Yondan',
    nom_japonais: '4e Dan',
    kanji: '四段',
    couleur: '#1F2937',
    couleurBg: 'bg-slate-900',
    couleurBorder: 'border-purple-600',
    niveau: 'dan',
    ordre: 9,
    duree_minimale: '4 ans après Sandan',
    heures_minimales: 500,
    description: 'Quatrième Dan - Stabilité du Ki. Takemusu Aiki - création spontanée de techniques.',
    techniques_cles: ['Ki no Nagare', 'Yonin Dori', 'Takemusu Aiki', 'Buki Waza synthèse', 'Randori libre'],
    competences: ['Stabilité énergétique', 'Harmonie dans le mouvement', 'Enseignement expert', 'Présence']
  },
  {
    id: 'godan',
    nom: 'Godan',
    nom_japonais: '5e Dan',
    kanji: '五段',
    couleur: '#1F2937',
    couleurBg: 'bg-slate-900',
    couleurBorder: 'border-emerald-500',
    niveau: 'dan',
    ordre: 10,
    duree_minimale: '5 ans après Yondan',
    description: 'Cinquième Dan - Aiki accompli. Expression personnelle de l\'Aïkido.',
    techniques_cles: ['Démonstration libre', 'Expression personnelle de l\'Aiki', 'Contribution à l\'art'],
    competences: ['Expression personnelle', 'Sagesse martiale', 'Leadership', 'Contribution au dojo']
  },
  {
    id: 'rokudan',
    nom: 'Rokudan',
    nom_japonais: '6e Dan',
    kanji: '六段',
    couleur: '#1F2937',
    couleurBg: 'bg-slate-900',
    couleurBorder: 'border-sky-400',
    niveau: 'dan',
    ordre: 11,
    duree_minimale: '6 ans après Godan',
    description: 'Sixième Dan - Maturité spirituelle. Incarnation des principes de l\'Aïkido.',
    techniques_cles: ['Démonstration de maîtrise', 'Transmission de la tradition'],
    competences: ['Incarnation des principes', 'Rayonnement', 'Transmission']
  },
  {
    id: 'nanadan',
    nom: 'Nanadan',
    nom_japonais: '7e Dan',
    kanji: '七段',
    couleur: '#1F2937',
    couleurBg: 'bg-slate-900',
    couleurBorder: 'border-rose-400',
    niveau: 'dan',
    ordre: 12,
    duree_minimale: '7 ans après Rokudan',
    description: 'Septième Dan - Niveau expert. Contribution significative au monde de l\'Aïkido.',
    techniques_cles: ['Libre expression de l\'Aiki', 'Transmission du savoir'],
    competences: ['Excellence technique et spirituelle', 'Contribution mondiale']
  }
];

// Composant de la timeline
const GradeNode: React.FC<{
  grade: GradeData;
  status: 'completed' | 'current' | 'locked';
  progress?: number;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ grade, status, progress = 0, isExpanded, onToggle }) => {
  
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'current':
        return <Circle className="w-5 h-5 text-amber-400 animate-pulse" />;
      case 'locked':
        return <Lock className="w-5 h-5 text-slate-500" />;
    }
  };

  const getNodeStyle = () => {
    const base = 'relative transition-all duration-300';
    switch (status) {
      case 'completed':
        return `${base} opacity-100`;
      case 'current':
        return `${base} opacity-100`;
      case 'locked':
        return `${base} opacity-60`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={getNodeStyle()}
    >
      {/* Node principal */}
      <div
        onClick={onToggle}
        className={`
          relative flex items-center gap-4 p-4 rounded-xl cursor-pointer
          transition-all duration-300 group
          ${status === 'current' 
            ? 'bg-gradient-to-r from-slate-800/80 to-slate-700/50 border-2 border-amber-500/50 shadow-lg shadow-amber-500/10' 
            : status === 'completed'
              ? 'bg-slate-800/50 border border-slate-600/50 hover:bg-slate-700/50'
              : 'bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50'
          }
        `}
      >
        {/* Indicateur de ceinture */}
        <div 
          className={`
            w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0
            border-4 transition-all duration-300
            ${grade.niveau === 'dan' ? 'bg-slate-900' : ''}
          `}
          style={{ 
            backgroundColor: grade.niveau === 'kyu' ? grade.couleur : undefined,
            borderColor: grade.niveau === 'dan' ? grade.couleurBorder.replace('border-', '').replace('-', '') : grade.couleur
          }}
        >
          <span className={`text-lg font-bold ${grade.niveau === 'dan' ? 'text-white' : 'text-slate-800'}`}>
            {grade.kanji}
          </span>
        </div>

        {/* Informations du grade */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold ${status === 'locked' ? 'text-slate-400' : 'text-white'}`}>
              {grade.nom}
            </h3>
            <span className="text-slate-500 text-sm">({grade.nom_japonais})</span>
            {getStatusIcon()}
          </div>
          
          <p className={`text-sm ${status === 'locked' ? 'text-slate-500' : 'text-slate-400'} line-clamp-1`}>
            {grade.description}
          </p>

          {/* Barre de progression pour le grade actuel */}
          {status === 'current' && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-400">Progression</span>
                <span className="text-amber-400">{progress}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Indicateur d'expansion */}
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </div>

      {/* Détails expandés */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-2 ml-6 p-5 bg-slate-800/30 rounded-xl border border-slate-700/50">
              {/* Durée et heures */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-400">Durée min:</span>
                  <span className="text-white">{grade.duree_minimale}</span>
                </div>
                {grade.heures_minimales && (
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-400">Heures:</span>
                    <span className="text-white">{grade.heures_minimales}h</span>
                  </div>
                )}
              </div>

              {/* Techniques clés */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Swords className="w-4 h-4 text-red-400" />
                  Techniques clés
                </h4>
                <div className="flex flex-wrap gap-2">
                  {grade.techniques_cles.map((tech, _idx) => (
                    <span 
                      key={_idx}
                      className="px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded-md border border-slate-600/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compétences évaluées */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  Compétences évaluées
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {grade.competences.map((comp, idx) => (
                    <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                      <Star className="w-3 h-3 text-amber-400 mt-1 flex-shrink-0" />
                      {comp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Composant principal
export const ProgressionAdulte: React.FC<ProgressionAdulteProps> = ({
  currentGrade = '5e_kyu',
  progress = 45,
  techniquesValidees = 12,
  totalTechniques = 28,
  heuresEntrainement = 85
}) => {
  const [expandedGrade, setExpandedGrade] = useState<string | null>(currentGrade);
  const [showDanGrades, setShowDanGrades] = useState(false);

  // Séparer les grades Kyu et Dan
  const gradesKyu = useMemo(() => GRADES_COMPLETS.filter(g => g.niveau === 'kyu'), []);
  const gradesDan = useMemo(() => GRADES_COMPLETS.filter(g => g.niveau === 'dan'), []);

  // Trouver l'index du grade actuel
  const currentGradeIndex = useMemo(() => {
    return GRADES_COMPLETS.findIndex(g => g.id === currentGrade);
  }, [currentGrade]);

  const getGradeStatus = (grade: GradeData): 'completed' | 'current' | 'locked' => {
    if (grade.ordre < currentGradeIndex) return 'completed';
    if (grade.ordre === currentGradeIndex) return 'current';
    return 'locked';
  };

  const currentGradeData = GRADES_COMPLETS.find(g => g.id === currentGrade);

  return (
    <div className="space-y-6" data-testid="progression-adulte">
      {/* Header avec stats */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Grade actuel */}
          <div className="flex items-center gap-4">
            <div 
              className={`
                w-20 h-20 rounded-2xl flex items-center justify-center
                border-4 shadow-lg
                ${currentGradeData?.niveau === 'dan' ? 'bg-slate-900' : ''}
              `}
              style={{ 
                backgroundColor: currentGradeData?.niveau === 'kyu' ? currentGradeData?.couleur : undefined,
                borderColor: currentGradeData?.couleur,
                boxShadow: `0 0 30px ${currentGradeData?.couleur}40`
              }}
            >
              <span className={`text-2xl font-bold ${currentGradeData?.niveau === 'dan' ? 'text-white' : 'text-slate-800'}`}>
                {currentGradeData?.kanji}
              </span>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Grade actuel</p>
              <h2 className="text-2xl font-bold text-white">{currentGradeData?.nom}</h2>
              <p className="text-slate-500 text-sm">{currentGradeData?.nom_japonais}</p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-amber-400" />
                <span className="text-slate-400 text-xs">Progression</span>
              </div>
              <p className="text-2xl font-bold text-white">{progress}%</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Swords className="w-4 h-4 text-red-400" />
                <span className="text-slate-400 text-xs">Techniques</span>
              </div>
              <p className="text-2xl font-bold text-white">{techniquesValidees}/{totalTechniques}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-400 text-xs">Heures</span>
              </div>
              <p className="text-2xl font-bold text-white">{heuresEntrainement}h</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400 text-xs">Grades</span>
              </div>
              <p className="text-2xl font-bold text-white">{currentGradeIndex}/{GRADES_COMPLETS.length}</p>
            </div>
          </div>
        </div>

        {/* Barre de progression globale */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Progression vers le prochain grade</span>
            <span className="text-amber-400">{progress}%</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Timeline des grades Kyu */}
      <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Grades Kyu
          <span className="text-slate-500 text-sm font-normal">(Ceintures de couleur)</span>
        </h3>

        <div className="space-y-3">
          {gradesKyu.map((grade) => (
            <GradeNode
              key={grade.id}
              grade={grade}
              status={getGradeStatus(grade)}
              progress={grade.id === currentGrade ? progress : undefined}
              isExpanded={expandedGrade === grade.id}
              onToggle={() => setExpandedGrade(expandedGrade === grade.id ? null : grade.id)}
            />
          ))}
        </div>
      </div>

      {/* Timeline des grades Dan */}
      <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
        <button
          onClick={() => setShowDanGrades(!showDanGrades)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            Grades Dan
            <span className="text-slate-500 text-sm font-normal">(Ceintures noires)</span>
          </h3>
          <motion.div
            animate={{ rotate: showDanGrades ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {showDanGrades && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3">
                {gradesDan.map((grade) => (
                  <GradeNode
                    key={grade.id}
                    grade={grade}
                    status={getGradeStatus(grade)}
                    progress={grade.id === currentGrade ? progress : undefined}
                    isExpanded={expandedGrade === grade.id}
                    onToggle={() => setExpandedGrade(expandedGrade === grade.id ? null : grade.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showDanGrades && (
          <p className="mt-3 text-sm text-slate-500 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Cliquez pour voir les 7 grades Dan (Shodan à Nanadan)
          </p>
        )}
      </div>

      {/* Style pour l'animation shimmer */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default ProgressionAdulte;
