'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronDown, X, Scroll, Swords, 
  Shield, Clock, Target, BookOpen, Award, Lock,
  CheckCircle2, Star, Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MedievalGradeCard - Carte détaillée style médiéval/parchemin japonais
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Affiche les grades avec :
 * - Style parchemin ancien
 * - Détails des techniques requises
 * - Progression visuelle
 * - Fiches techniques pour chaque grade
 */

interface TechniqueDetail {
  nom: string;
  description?: string;
  obligatoire?: boolean;
}

interface AttaqueSection {
  attaque: string;
  attaque_jp?: string;
  description?: string;
  techniques: TechniqueDetail[];
}

interface MouvementSection {
  categorie: string;
  elements: { nom: string; description?: string; obligatoire?: boolean }[];
}

interface GradeData {
  id: string;
  nom: string;
  nom_japonais: string;
  ceinture: string;
  couleur_ceinture: string;
  niveau: string;
  duree_minimale: string;
  heures_minimales?: number;
  description: string;
  objectifs?: string[];
  mouvements_requis?: MouvementSection[];
  techniques_requises?: AttaqueSection[];
  criteres_evaluation?: string[];
  techniques_specifiques?: { nom: string; description: string }[];
}

// Données complètes des grades
const GRADES_DATA: GradeData[] = [
  {
    id: "6e_kyu",
    nom: "6e Kyu",
    nom_japonais: "六級",
    ceinture: "Blanche",
    couleur_ceinture: "#FFFFFF",
    niveau: "Débutant",
    duree_minimale: "3 mois",
    heures_minimales: 40,
    description: "Premier passage de grade. Les fondations de l'Aïkido.",
    objectifs: [
      "Connaître l'étiquette du dojo",
      "Maîtriser les chutes de base",
      "Exécuter les déplacements fondamentaux"
    ],
    mouvements_requis: [
      {
        categorie: "Ukemi (Chutes)",
        elements: [
          { nom: "Mae Ukemi", description: "Chute avant roulée", obligatoire: true },
          { nom: "Ushiro Ukemi", description: "Chute arrière roulée", obligatoire: true }
        ]
      },
      {
        categorie: "Tai Sabaki",
        elements: [
          { nom: "Irimi", description: "Entrée directe", obligatoire: true },
          { nom: "Tenkan", description: "Pivot 180°", obligatoire: true }
        ]
      }
    ],
    techniques_requises: [
      {
        attaque: "Ai Hanmi Katate Dori",
        attaque_jp: "相半身片手取り",
        description: "Saisie du poignet",
        techniques: [
          { nom: "Ikkyo Omote", description: "1er principe - ouvert", obligatoire: true },
          { nom: "Ikkyo Ura", description: "1er principe - fermé", obligatoire: true },
          { nom: "Shiho Nage", description: "Projection 4 directions", obligatoire: true }
        ]
      }
    ],
    criteres_evaluation: ["Respect de l'étiquette", "Qualité des chutes", "Fluidité des déplacements"]
  },
  {
    id: "5e_kyu",
    nom: "5e Kyu",
    nom_japonais: "五級",
    ceinture: "Jaune",
    couleur_ceinture: "#FFD700",
    niveau: "Débutant confirmé",
    duree_minimale: "3 mois",
    heures_minimales: 60,
    description: "Consolidation des bases et diversification des attaques.",
    objectifs: ["Diversifier les attaques", "Approfondir les immobilisations", "Découvrir les projections"],
    mouvements_requis: [
      {
        categorie: "Ukemi",
        elements: [
          { nom: "Yoko Ukemi", description: "Chute latérale", obligatoire: true },
          { nom: "Koho Kaiten", description: "Roulade arrière", obligatoire: true }
        ]
      }
    ],
    techniques_requises: [
      {
        attaque: "Shomen Uchi",
        attaque_jp: "正面打ち",
        description: "Frappe verticale",
        techniques: [
          { nom: "Ikkyo Omote/Ura", obligatoire: true },
          { nom: "Irimi Nage", obligatoire: true },
          { nom: "Kote Gaeshi", obligatoire: true }
        ]
      },
      {
        attaque: "Ryote Dori",
        attaque_jp: "両手取り",
        techniques: [
          { nom: "Tenchi Nage", description: "Projection ciel-terre", obligatoire: true },
          { nom: "Kokyu Nage", obligatoire: true }
        ]
      }
    ],
    criteres_evaluation: ["Qualité des ukemi", "Compréhension Ikkyo/Nikyo", "Connexion partenaire"]
  },
  {
    id: "4e_kyu",
    nom: "4e Kyu",
    nom_japonais: "四級",
    ceinture: "Orange",
    couleur_ceinture: "#FF8C00",
    niveau: "Intermédiaire débutant",
    duree_minimale: "3 mois",
    heures_minimales: 80,
    description: "Maîtrise des 4 premiers principes (Ikkyo à Yonkyo).",
    objectifs: ["Maîtriser Ikkyo à Yonkyo", "Travail Hanmi Handachi", "Améliorer la connexion"],
    techniques_requises: [
      {
        attaque: "Yokomen Uchi",
        attaque_jp: "横面打ち",
        description: "Frappe latérale",
        techniques: [
          { nom: "Ikkyo à Yonkyo", obligatoire: true },
          { nom: "Shiho Nage", obligatoire: true },
          { nom: "Irimi Nage", obligatoire: true },
          { nom: "Kote Gaeshi", obligatoire: true }
        ]
      },
      {
        attaque: "Ushiro Ryote Dori",
        attaque_jp: "後ろ両手取り",
        description: "Saisie arrière",
        techniques: [
          { nom: "Ikkyo", obligatoire: true },
          { nom: "Kote Gaeshi", obligatoire: true },
          { nom: "Kokyu Nage", obligatoire: true }
        ]
      }
    ],
    criteres_evaluation: ["Distinction Omote/Ura", "Compréhension des 4 principes", "Fluidité"]
  },
  {
    id: "3e_kyu",
    nom: "3e Kyu",
    nom_japonais: "三級",
    ceinture: "Verte",
    couleur_ceinture: "#228B22",
    niveau: "Intermédiaire",
    duree_minimale: "4 mois",
    heures_minimales: 100,
    description: "Introduction aux armes (Jo, Bokken).",
    objectifs: ["Maîtriser Sankyo", "Découvrir les armes", "Tobi Ukemi"],
    mouvements_requis: [
      {
        categorie: "Armes - Ken",
        elements: [
          { nom: "Ken Suburi 1-4", obligatoire: true },
          { nom: "Kumitachi 1-2", obligatoire: true }
        ]
      },
      {
        categorie: "Armes - Jo",
        elements: [
          { nom: "Jo Suburi 1-10", obligatoire: true },
          { nom: "13 Jo Kata", obligatoire: false }
        ]
      }
    ],
    techniques_requises: [
      {
        attaque: "Chudan Tsuki",
        attaque_jp: "中段突き",
        techniques: [
          { nom: "Ikkyo à Sankyo", obligatoire: true },
          { nom: "Irimi Nage", obligatoire: true },
          { nom: "Kote Gaeshi", obligatoire: true }
        ]
      }
    ],
    criteres_evaluation: ["Maîtrise Sankyo", "Qualité Tobi Ukemi", "Bases armes acquises"]
  },
  {
    id: "2e_kyu",
    nom: "2e Kyu",
    nom_japonais: "二級",
    ceinture: "Bleue",
    couleur_ceinture: "#0000CD",
    niveau: "Intermédiaire avancé",
    duree_minimale: "4 mois",
    heures_minimales: 120,
    description: "Introduction du Tanto Dori et maîtrise de Yonkyo.",
    objectifs: ["Maîtriser Yonkyo", "Apprendre Tanto Dori", "Perfectionner les armes"],
    mouvements_requis: [
      {
        categorie: "Armes - Ken",
        elements: [
          { nom: "Ken Suburi 1-7", obligatoire: true },
          { nom: "Kumitachi 1-3", obligatoire: true }
        ]
      },
      {
        categorie: "Armes - Jo",
        elements: [
          { nom: "31 Jo Kata", obligatoire: true },
          { nom: "Kumijo 1-4", obligatoire: true }
        ]
      }
    ],
    techniques_requises: [
      {
        attaque: "Tanto Dori - Shomen",
        attaque_jp: "短刀取り正面打ち",
        description: "Défense couteau",
        techniques: [
          { nom: "Gokyo Omote/Ura", description: "5e principe", obligatoire: true },
          { nom: "Ikkyo à Yonkyo", obligatoire: true }
        ]
      },
      {
        attaque: "Tanto Dori - Tsuki",
        techniques: [
          { nom: "Kote Gaeshi", obligatoire: true },
          { nom: "Gokyo", obligatoire: true }
        ]
      }
    ],
    criteres_evaluation: ["Maîtrise 5 principes", "Qualité Tanto Dori", "Expression personnelle"]
  },
  {
    id: "1er_kyu",
    nom: "1er Kyu",
    nom_japonais: "一級",
    ceinture: "Marron",
    couleur_ceinture: "#8B4513",
    niveau: "Avancé (pré-Dan)",
    duree_minimale: "6 mois",
    heures_minimales: 150,
    description: "Préparation complète au Shodan.",
    objectifs: ["Maîtrise complète du programme", "Capacité pédagogique", "Pratique martiale"],
    techniques_requises: [
      {
        attaque: "Toutes attaques",
        techniques: [
          { nom: "Ikkyo à Gokyo", description: "Les 5 principes maîtrisés", obligatoire: true },
          { nom: "Toutes projections", obligatoire: true },
          { nom: "Jiyu Waza", description: "Techniques libres", obligatoire: true }
        ]
      },
      {
        attaque: "Tachi Dori",
        attaque_jp: "太刀取り",
        description: "Défense sabre",
        techniques: [
          { nom: "Ikkyo à Sankyo", obligatoire: true },
          { nom: "Shiho Nage", obligatoire: true },
          { nom: "Kote Gaeshi", obligatoire: true }
        ]
      }
    ],
    criteres_evaluation: ["Excellence technique", "Fluidité et puissance", "Attitude Yudansha"]
  },
  {
    id: "shodan",
    nom: "Shodan",
    nom_japonais: "初段",
    ceinture: "Noire",
    couleur_ceinture: "#000000",
    niveau: "1er Dan",
    duree_minimale: "1 an après 1er Kyu",
    heures_minimales: 200,
    description: "'Sho' = début. Le vrai apprentissage commence.",
    objectifs: ["Maîtrise complète", "Compréhension profonde", "Capacité d'enseignement"],
    techniques_specifiques: [
      { nom: "Ushiro Waza complet", description: "Toutes techniques arrière" },
      { nom: "Futari Dori", description: "Défense 2 attaquants" },
      { nom: "Kaeshi Waza", description: "Contre-techniques" },
      { nom: "Henka Waza", description: "Variations et enchaînements" }
    ],
    criteres_evaluation: ["Excellence technique", "Principes de l'Aïkido", "Capacité martiale", "Pédagogie"]
  },
  {
    id: "nidan",
    nom: "Nidan",
    nom_japonais: "二段",
    ceinture: "Noire",
    couleur_ceinture: "#000000",
    niveau: "2e Dan",
    duree_minimale: "2 ans après Shodan",
    heures_minimales: 300,
    description: "Expression personnelle et recherche approfondie.",
    techniques_specifiques: [
      { nom: "Kata Dori Menuchi", description: "Saisie épaule + frappe" },
      { nom: "Futari Dori avancé", description: "2 attaquants - variations" },
      { nom: "Kaeshi Waza avancé", description: "Contre-techniques complexes" }
    ]
  },
  {
    id: "sandan",
    nom: "Sandan",
    nom_japonais: "三段",
    ceinture: "Noire",
    couleur_ceinture: "#000000",
    niveau: "3e Dan",
    duree_minimale: "3 ans après Nidan",
    heures_minimales: 400,
    description: "Niveau enseignant confirmé.",
    techniques_specifiques: [
      { nom: "Sannin Dori", description: "3 attaquants" },
      { nom: "Henka Waza libre", description: "Enchaînements spontanés" },
      { nom: "Oyo Waza", description: "Applications martiales" },
      { nom: "Tanto Randori", description: "Défense libre couteau" }
    ]
  },
  {
    id: "yondan",
    nom: "Yondan",
    nom_japonais: "四段",
    ceinture: "Noire",
    couleur_ceinture: "#000000",
    niveau: "4e Dan",
    duree_minimale: "4 ans après Sandan",
    heures_minimales: 500,
    description: "Takemusu Aiki - création spontanée.",
    techniques_specifiques: [
      { nom: "Yonin Dori", description: "4+ attaquants" },
      { nom: "Takemusu Aiki", description: "Création spontanée" },
      { nom: "Ki no Nagare", description: "Flux continu" },
      { nom: "Kuden", description: "Enseignement oral - secrets" }
    ]
  }
];

interface MedievalGradeCardProps {
  currentGrade?: string;
  onClose?: () => void;
  fullScreen?: boolean;
}

export const MedievalGradeCard: React.FC<MedievalGradeCardProps> = ({
  currentGrade = '2e_kyu',
  onClose,
  fullScreen = false
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeData | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const currentGradeIndex = GRADES_DATA.findIndex(g => g.id === currentGrade);

  const getGradeStatus = (index: number): 'completed' | 'current' | 'locked' => {
    if (index < currentGradeIndex) return 'completed';
    if (index === currentGradeIndex) return 'current';
    return 'locked';
  };

  const containerClass = fullScreen 
    ? "fixed inset-0 z-50 overflow-auto" 
    : "relative w-full";

  return (
    <div className={containerClass}>
      {/* Fond parchemin */}
      <div 
        className="min-h-full p-4 sm:p-6 md:p-8"
        style={{
          background: 'linear-gradient(135deg, #2d1f0f 0%, #3d2914 25%, #2a1810 50%, #3d2914 75%, #2d1f0f 100%)',
        }}
      >
        {/* Header médiéval */}
        <div className="max-w-4xl mx-auto">
          <div className="relative text-center mb-8 pb-6 border-b-2 border-amber-700/50">
            {/* Ornements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">⚔️</div>
            
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-0 right-0 p-2 text-amber-400/70 hover:text-amber-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}

            <h1 className="text-3xl sm:text-4xl font-black text-amber-100 mt-4 tracking-wider"
                style={{ fontFamily: 'serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              📜 Les Passages de Grade
            </h1>
            <p className="text-amber-400/80 mt-2 italic">
              Du 6e Kyu au 4e Dan - Le chemin du guerrier
            </p>
            
            {/* Ligne décorative */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-600" />
              <span className="text-amber-500">☯️</span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-600" />
            </div>
          </div>

          {/* Timeline des grades */}
          <div className="space-y-3">
            {GRADES_DATA.map((grade, index) => {
              const status = getGradeStatus(index);
              const isKyu = !['shodan', 'nidan', 'sandan', 'yondan'].includes(grade.id);
              
              return (
                <motion.div
                  key={grade.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedGrade(grade)}
                  className={`
                    relative cursor-pointer group
                    ${status === 'locked' ? 'opacity-60' : ''}
                  `}
                >
                  {/* Carte style parchemin */}
                  <div 
                    className={`
                      relative p-4 sm:p-5 rounded-lg border-2 transition-all duration-300
                      ${status === 'current' 
                        ? 'border-amber-500 shadow-lg shadow-amber-500/20' 
                        : status === 'completed'
                          ? 'border-amber-700/50 hover:border-amber-600/70'
                          : 'border-amber-900/30 hover:border-amber-800/50'
                      }
                    `}
                    style={{
                      background: status === 'current'
                        ? 'linear-gradient(135deg, rgba(120,80,30,0.4) 0%, rgba(80,50,20,0.5) 100%)'
                        : 'linear-gradient(135deg, rgba(60,40,20,0.3) 0%, rgba(40,25,10,0.4) 100%)',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Badge ceinture */}
                      <div 
                        className={`
                          w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center
                          border-4 flex-shrink-0 transition-transform group-hover:scale-105
                          ${isKyu ? '' : 'ring-2 ring-amber-600/50'}
                        `}
                        style={{ 
                          backgroundColor: grade.couleur_ceinture,
                          borderColor: status === 'current' ? '#f59e0b' : 
                                      status === 'completed' ? '#10b981' : '#4b5563',
                          boxShadow: status === 'current' ? '0 0 20px rgba(245,158,11,0.4)' : 'none'
                        }}
                      >
                        <span className={`text-lg sm:text-xl font-black ${
                          grade.couleur_ceinture === '#FFFFFF' ? 'text-slate-800' : 
                          grade.couleur_ceinture === '#FFD700' ? 'text-slate-800' : 'text-white'
                        }`}>
                          {grade.nom_japonais}
                        </span>
                      </div>

                      {/* Informations */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg sm:text-xl font-bold text-amber-100">
                            {grade.nom}
                          </h3>
                          <span className="text-amber-500/70 text-sm">({grade.niveau})</span>
                          {status === 'completed' && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          )}
                          {status === 'current' && (
                            <Star className="w-5 h-5 text-amber-400 animate-pulse" />
                          )}
                          {status === 'locked' && (
                            <Lock className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <p className="text-amber-300/70 text-sm mt-1 line-clamp-2">
                          {grade.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-amber-400/60">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {grade.duree_minimale}
                          </span>
                          {grade.heures_minimales && (
                            <span className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              {grade.heures_minimales}h
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Flèche */}
                      <ChevronRight className="w-5 h-5 text-amber-500/50 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                    </div>
                  </div>

                  {/* Ligne de connexion */}
                  {index < GRADES_DATA.length - 1 && (
                    <div className="absolute left-7 sm:left-8 top-full w-0.5 h-3 bg-amber-700/30" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal détails du grade */}
      <AnimatePresence>
        {selectedGrade && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedGrade(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border-2 border-amber-700/50"
              style={{
                background: 'linear-gradient(135deg, #2d1f0f 0%, #3d2914 50%, #2a1810 100%)',
              }}
            >
              {/* Header modal */}
              <div className="sticky top-0 z-10 p-4 sm:p-5 border-b border-amber-700/50"
                   style={{ background: 'linear-gradient(to bottom, rgba(45,31,15,0.98), rgba(45,31,15,0.95))' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center border-4 border-amber-600"
                      style={{ backgroundColor: selectedGrade.couleur_ceinture }}
                    >
                      <span className={`text-lg font-black ${
                        selectedGrade.couleur_ceinture === '#FFFFFF' || selectedGrade.couleur_ceinture === '#FFD700' 
                          ? 'text-slate-800' : 'text-white'
                      }`}>
                        {selectedGrade.nom_japonais}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-amber-100">
                        {selectedGrade.nom}
                      </h2>
                      <p className="text-amber-400/70 text-sm">
                        {selectedGrade.ceinture} • {selectedGrade.niveau}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedGrade(null)}
                    className="p-2 text-amber-400/70 hover:text-amber-400 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Contenu modal */}
              <div className="p-4 sm:p-5 space-y-5">
                {/* Description */}
                <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-800/30">
                  <p className="text-amber-200 italic">"{selectedGrade.description}"</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-amber-400/70">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedGrade.duree_minimale}
                    </span>
                    {selectedGrade.heures_minimales && (
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {selectedGrade.heures_minimales} heures min.
                      </span>
                    )}
                  </div>
                </div>

                {/* Objectifs */}
                {selectedGrade.objectifs && (
                  <div>
                    <button 
                      onClick={() => setExpandedSection(expandedSection === 'objectifs' ? null : 'objectifs')}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-amber-800/20 hover:bg-amber-800/30 transition-colors"
                    >
                      <span className="text-amber-100 font-semibold flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        Objectifs
                      </span>
                      <ChevronDown className={`w-5 h-5 text-amber-500 transition-transform ${expandedSection === 'objectifs' ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {expandedSection === 'objectifs' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <ul className="mt-2 ml-4 space-y-1">
                            {selectedGrade.objectifs.map((obj, i) => (
                              <li key={i} className="text-amber-200/80 text-sm flex items-start gap-2">
                                <span className="text-amber-500 mt-1">•</span>
                                {obj}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Mouvements requis */}
                {selectedGrade.mouvements_requis && (
                  <div>
                    <button 
                      onClick={() => setExpandedSection(expandedSection === 'mouvements' ? null : 'mouvements')}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-amber-800/20 hover:bg-amber-800/30 transition-colors"
                    >
                      <span className="text-amber-100 font-semibold flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        Mouvements requis
                      </span>
                      <ChevronDown className={`w-5 h-5 text-amber-500 transition-transform ${expandedSection === 'mouvements' ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {expandedSection === 'mouvements' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 space-y-3">
                            {selectedGrade.mouvements_requis.map((section, i) => (
                              <div key={i} className="ml-2 p-3 rounded-lg bg-amber-900/10 border border-amber-800/20">
                                <h4 className="text-amber-300 font-medium text-sm mb-2">{section.categorie}</h4>
                                <div className="space-y-1">
                                  {section.elements.map((elem, j) => (
                                    <div key={j} className="flex items-center justify-between text-sm">
                                      <span className="text-amber-200/80">{elem.nom}</span>
                                      {elem.description && (
                                        <span className="text-amber-500/60 text-xs">{elem.description}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Techniques requises */}
                {selectedGrade.techniques_requises && (
                  <div>
                    <button 
                      onClick={() => setExpandedSection(expandedSection === 'techniques' ? null : 'techniques')}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-amber-800/20 hover:bg-amber-800/30 transition-colors"
                    >
                      <span className="text-amber-100 font-semibold flex items-center gap-2">
                        <Swords className="w-5 h-5 text-red-500" />
                        Techniques requises
                      </span>
                      <ChevronDown className={`w-5 h-5 text-amber-500 transition-transform ${expandedSection === 'techniques' ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {expandedSection === 'techniques' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 space-y-3">
                            {selectedGrade.techniques_requises.map((attaque, i) => (
                              <div key={i} className="ml-2 p-3 rounded-lg bg-amber-900/10 border border-amber-800/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="text-amber-300 font-medium text-sm">{attaque.attaque}</h4>
                                  {attaque.attaque_jp && (
                                    <span className="text-amber-500/60 text-xs font-mono">{attaque.attaque_jp}</span>
                                  )}
                                </div>
                                {attaque.description && (
                                  <p className="text-amber-400/60 text-xs mb-2">{attaque.description}</p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                  {attaque.techniques.map((tech, j) => (
                                    <span 
                                      key={j}
                                      className="px-2 py-1 text-xs bg-amber-800/30 text-amber-200 rounded border border-amber-700/30"
                                    >
                                      {tech.nom}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Techniques spécifiques (Dan) */}
                {selectedGrade.techniques_specifiques && (
                  <div>
                    <button 
                      onClick={() => setExpandedSection(expandedSection === 'specifiques' ? null : 'specifiques')}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-amber-800/20 hover:bg-amber-800/30 transition-colors"
                    >
                      <span className="text-amber-100 font-semibold flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-500" />
                        Techniques spécifiques Dan
                      </span>
                      <ChevronDown className={`w-5 h-5 text-amber-500 transition-transform ${expandedSection === 'specifiques' ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {expandedSection === 'specifiques' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 space-y-2">
                            {selectedGrade.techniques_specifiques.map((tech, i) => (
                              <div key={i} className="ml-2 p-3 rounded-lg bg-amber-900/10 border border-amber-800/20">
                                <h4 className="text-amber-200 font-medium text-sm">{tech.nom}</h4>
                                <p className="text-amber-400/60 text-xs mt-1">{tech.description}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Critères d'évaluation */}
                {selectedGrade.criteres_evaluation && (
                  <div>
                    <button 
                      onClick={() => setExpandedSection(expandedSection === 'criteres' ? null : 'criteres')}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-amber-800/20 hover:bg-amber-800/30 transition-colors"
                    >
                      <span className="text-amber-100 font-semibold flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-cyan-500" />
                        Critères d'évaluation
                      </span>
                      <ChevronDown className={`w-5 h-5 text-amber-500 transition-transform ${expandedSection === 'criteres' ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {expandedSection === 'criteres' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <ul className="mt-2 ml-4 space-y-1">
                            {selectedGrade.criteres_evaluation.map((critere, i) => (
                              <li key={i} className="text-amber-200/80 text-sm flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                {critere}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 p-4 border-t border-amber-700/50"
                   style={{ background: 'linear-gradient(to top, rgba(45,31,15,0.98), rgba(45,31,15,0.95))' }}>
                <Button
                  onClick={() => setSelectedGrade(null)}
                  className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-semibold"
                >
                  <Scroll className="w-4 h-4 mr-2" />
                  Fermer le parchemin
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedievalGradeCard;
