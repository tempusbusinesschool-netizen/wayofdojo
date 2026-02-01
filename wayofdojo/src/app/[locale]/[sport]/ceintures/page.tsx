'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Award, Clock, Target, ChevronDown, BookOpen, Scroll, Sword, Shield, Star, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TanakaWelcome, TANAKA_MESSAGES } from '@/components/TanakaWelcome';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PAGE LES CEINTURES — PROGRESSION DE GRADE (Style Médiéval)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Données complètes des grades
const GRADES = [
  {
    id: '6e_kyu',
    nom: '6e Kyu',
    kanji: '六級',
    ceinture: 'Blanche',
    couleur: '#FFFFFF',
    border: true,
    duree: '3 mois',
    heures: 40,
    description: 'Premier passage. Évaluation des bases fondamentales.',
    objectifs: [
      "Connaître l'étiquette du dojo (Reishiki)",
      "Maîtriser les chutes de base (Mae/Ushiro Ukemi)",
      "Exécuter les déplacements fondamentaux (Irimi, Tenkan)",
      "Réaliser les premières techniques simples"
    ],
    techniques: [
      { nom: 'Ikkyo Omote/Ura', attaque: 'Ai Hanmi Katate Dori' },
      { nom: 'Shiho Nage Omote/Ura', attaque: 'Ai Hanmi Katate Dori' },
      { nom: 'Irimi Nage', attaque: 'Gyaku Hanmi Katate Dori' },
      { nom: 'Kokyu Ho', attaque: 'Suwariwaza Ryote Dori' },
    ],
    unlocked: true,
    current: false,
  },
  {
    id: '5e_kyu',
    nom: '5e Kyu',
    kanji: '五級',
    ceinture: 'Jaune',
    couleur: '#FBBF24',
    duree: '3 mois',
    heures: 60,
    description: 'Consolidation des bases et introduction de nouvelles techniques.',
    objectifs: [
      "Améliorer la qualité des chutes",
      "Diversifier les attaques",
      "Approfondir les immobilisations",
      "Découvrir les projections"
    ],
    techniques: [
      { nom: 'Ikkyo/Nikyo', attaque: 'Shomen Uchi' },
      { nom: 'Kote Gaeshi', attaque: 'Shomen Uchi' },
      { nom: 'Irimi Nage', attaque: 'Shomen Uchi' },
      { nom: 'Tenchi Nage', attaque: 'Ryote Dori' },
    ],
    unlocked: true,
    current: false,
  },
  {
    id: '4e_kyu',
    nom: '4e Kyu',
    kanji: '四級',
    ceinture: 'Orange',
    couleur: '#F97316',
    duree: '3 mois',
    heures: 80,
    description: 'Élargissement du répertoire et amélioration de la fluidité.',
    objectifs: [
      "Maîtriser les 4 premiers principes (Ikkyo à Yonkyo)",
      "Diversifier les projections",
      "Améliorer la connexion avec le partenaire",
      "Commencer le travail Hanmi Handachi"
    ],
    techniques: [
      { nom: 'Sankyo Omote/Ura', attaque: 'Shomen Uchi' },
      { nom: 'Yonkyo Omote/Ura', attaque: 'Kata Dori' },
      { nom: 'Kaiten Nage', attaque: 'Chudan Tsuki' },
      { nom: 'Hanmi Handachi Shiho Nage', attaque: 'Katate Dori' },
    ],
    unlocked: true,
    current: false,
  },
  {
    id: '3e_kyu',
    nom: '3e Kyu',
    kanji: '三級',
    ceinture: 'Verte',
    couleur: '#22C55E',
    duree: '4 mois',
    heures: 100,
    description: 'Approfondissement et introduction du travail aux armes.',
    objectifs: [
      "Maîtriser Gokyo (5e principe)",
      "Introduction au Jo (bâton)",
      "Introduction au Bokken (sabre)",
      "Développer la fluidité des enchaînements"
    ],
    techniques: [
      { nom: 'Gokyo', attaque: 'Yokomen Uchi' },
      { nom: 'Jo Suburi 1-5', attaque: 'Armes' },
      { nom: 'Ken Suburi 1-4', attaque: 'Armes' },
      { nom: 'Ushiro Waza', attaque: 'Ushiro Ryote Dori' },
    ],
    unlocked: true,
    current: false,
  },
  {
    id: '2e_kyu',
    nom: '2e Kyu',
    kanji: '二級',
    ceinture: 'Bleue',
    couleur: '#3B82F6',
    duree: '6 mois',
    heures: 120,
    description: 'Niveau avancé. Préparation aux grades Dan.',
    objectifs: [
      "Tanto Dori (défense contre couteau)",
      "Approfondir le travail aux armes",
      "Suwariwaza complet",
      "Développer l'efficacité martiale"
    ],
    techniques: [
      { nom: 'Tanto Dori complet', attaque: 'Shomen/Yokomen/Tsuki' },
      { nom: 'Jo Suburi 6-13', attaque: 'Armes' },
      { nom: 'Kumijo 1-4', attaque: 'Armes' },
      { nom: 'Jiyu Waza', attaque: 'Attaques libres' },
    ],
    unlocked: true,
    current: true,
  },
  {
    id: '1er_kyu',
    nom: '1er Kyu',
    kanji: '一級',
    ceinture: 'Marron',
    couleur: '#92400E',
    duree: '6 mois',
    heures: 150,
    description: 'Dernière étape avant la ceinture noire.',
    objectifs: [
      "Maîtrise complète du programme Kyu",
      "Tachi Dori (défense contre sabre)",
      "Jo Dori complet",
      "Capacité pédagogique"
    ],
    techniques: [
      { nom: 'Tachi Dori', attaque: 'Shomen/Yokomen' },
      { nom: 'Jo Dori', attaque: 'Tsuki/Shomen' },
      { nom: 'Jo Nage', attaque: 'Projections avec bâton' },
      { nom: 'Randori', attaque: 'Multi-attaquants' },
    ],
    unlocked: false,
    current: false,
  },
  {
    id: 'shodan',
    nom: 'Shodan',
    kanji: '初段',
    ceinture: 'Noire',
    couleur: '#1F2937',
    duree: '1 an après 1er Kyu',
    heures: 200,
    description: "Le vrai début de l'apprentissage. 'Sho' signifie 'commencement'.",
    objectifs: [
      "Maîtrise complète du programme technique",
      "Compréhension profonde des principes",
      "Efficacité martiale",
      "Capacité d'enseigner aux débutants"
    ],
    techniques: [
      { nom: 'Ushiro Waza complet', attaque: 'Toutes attaques arrière' },
      { nom: 'Futari Dori', attaque: '2 attaquants' },
      { nom: 'Kaeshi Waza', attaque: 'Contre-techniques' },
      { nom: 'Takemusu Aiki', attaque: 'Création spontanée' },
    ],
    unlocked: false,
    current: false,
  },
];

// Composant carte médiévale
const MedievalGradeCard: React.FC<{
  grade: typeof GRADES[0];
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ grade, isExpanded, onToggle }) => {
  const isLocked = !grade.unlocked;
  const isCurrent = grade.current;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${isLocked ? 'opacity-60' : ''}`}
    >
      {/* Carte style parchemin */}
      <div 
        onClick={onToggle}
        className={`
          relative cursor-pointer overflow-hidden
          rounded-xl border-2
          transition-all duration-300
          ${isCurrent 
            ? 'border-amber-500 shadow-lg shadow-amber-500/20' 
            : isLocked 
            ? 'border-slate-600' 
            : 'border-amber-800/50 hover:border-amber-600/50'
          }
        `}
        style={{
          background: isLocked 
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #451a03 0%, #78350f 25%, #92400e 50%, #78350f 75%, #451a03 100%)',
        }}
      >
        {/* Texture parchemin */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Bordure décorative */}
        <div className="absolute inset-2 border border-amber-700/30 rounded-lg pointer-events-none" />

        {/* Badge grade actuel */}
        {isCurrent && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-3 py-1 bg-amber-500 text-amber-950 text-xs font-bold rounded-full shadow-lg">
              GRADE ACTUEL
            </span>
          </div>
        )}

        {/* Verrou */}
        {isLocked && (
          <div className="absolute top-3 right-3 z-10">
            <Lock className="w-5 h-5 text-slate-500" />
          </div>
        )}

        <div className="relative p-6">
          {/* En-tête */}
          <div className="flex items-center gap-4 mb-4">
            {/* Ceinture visuelle */}
            <div className="relative">
              <div 
                className={`w-20 h-6 rounded-sm shadow-lg ${grade.border ? 'border-2 border-slate-400' : ''}`}
                style={{ 
                  backgroundColor: grade.couleur,
                  boxShadow: isLocked ? 'none' : `0 0 15px ${grade.couleur}40`
                }}
              />
              <div 
                className="absolute -bottom-1 left-1/2 w-6 h-3 -translate-x-1/2 rounded-b-sm"
                style={{ backgroundColor: grade.couleur, opacity: 0.7 }}
              />
            </div>

            {/* Nom et kanji */}
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-amber-100">{grade.nom}</h3>
                <span className="text-3xl text-amber-400 font-japanese">{grade.kanji}</span>
              </div>
              <p className="text-amber-200/70 text-sm">{grade.ceinture}</p>
            </div>

            {/* Chevron */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-6 h-6 text-amber-400/60" />
            </motion.div>
          </div>

          {/* Info rapide */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2 text-amber-200/80 text-sm">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{grade.duree}</span>
            </div>
            <div className="flex items-center gap-2 text-amber-200/80 text-sm">
              <Target className="w-4 h-4 text-amber-500" />
              <span>{grade.heures}h minimum</span>
            </div>
          </div>

          <p className="text-amber-100/70 text-sm italic">{grade.description}</p>

          {/* Contenu expansé */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-amber-700/30"
              >
                {/* Objectifs */}
                <div className="mb-6">
                  <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Scroll className="w-4 h-4" />
                    Objectifs
                  </h4>
                  <ul className="space-y-2">
                    {grade.objectifs.map((obj) => (
                      <li key={obj} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-amber-900/50 border border-amber-600/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Star className="w-3 h-3 text-amber-400" />
                        </div>
                        <span className="text-amber-100/80 text-sm">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Techniques requises */}
                <div>
                  <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sword className="w-4 h-4" />
                    Techniques Requises
                  </h4>
                  <div className="grid gap-2">
                    {grade.techniques.map((tech) => (
                      <div 
                        key={tech.nom}
                        className="flex items-center justify-between bg-amber-950/30 rounded-lg px-4 py-2 border border-amber-800/30"
                      >
                        <span className="text-amber-100 font-medium text-sm">{tech.nom}</span>
                        <span className="text-amber-400/60 text-xs">{tech.attaque}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                {!isLocked && (
                  <Button
                    className="w-full mt-6 bg-amber-700 hover:bg-amber-600 text-amber-100"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Voir le programme détaillé
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default function CeinturesPage() {
  const router = useRouter();
  const [expandedGrade, setExpandedGrade] = useState<string | null>('2e_kyu');

  const toggleGrade = (gradeId: string) => {
    setExpandedGrade(expandedGrade === gradeId ? null : gradeId);
  };

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
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              🎖️ Les Ceintures
            </h1>
            <p className="text-sm text-slate-400">Progression de grade</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900/30 border border-amber-700/30 rounded-full text-amber-400 text-sm mb-4">
            <Shield className="w-4 h-4" />
            <span>Votre chemin vers la maîtrise</span>
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            En Aïkido, la progression se mesure par les <strong className="text-amber-400">Kyu</strong> (grades élèves) 
            puis les <strong className="text-amber-400">Dan</strong> (grades maîtres). Chaque ceinture représente 
            une étape de votre évolution technique et spirituelle.
          </p>
        </motion.div>

        {/* Barre de progression visuelle */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">Ma progression</span>
            <span className="text-amber-400 font-bold">2e Kyu (Bleue)</span>
          </div>
          <div className="flex gap-1">
            {GRADES.map((grade) => (
              <div 
                key={grade.id}
                className={`h-3 flex-1 rounded-sm first:rounded-l-full last:rounded-r-full transition-all ${
                  grade.border ? 'border border-slate-400' : ''
                }`}
                style={{ 
                  backgroundColor: grade.unlocked ? grade.couleur : '#334155',
                  opacity: grade.unlocked ? 1 : 0.3,
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>6e Kyu</span>
            <span>Shodan</span>
          </div>
        </div>

        {/* Liste des grades */}
        <div className="space-y-4">
          {GRADES.map((grade) => (
            <MedievalGradeCard
              key={grade.id}
              grade={grade}
              isExpanded={expandedGrade === grade.id}
              onToggle={() => toggleGrade(grade.id)}
            />
          ))}
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900/30 rounded-xl p-6 border border-slate-700/50 text-center"
        >
          <Award className="w-12 h-12 mx-auto mb-4 text-amber-400" />
          <h3 className="font-bold text-lg mb-2">Au-delà du Shodan</h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Le Shodan (1er Dan) n'est pas une fin, mais un commencement. 
            Les grades Dan supérieurs (Nidan, Sandan, Yondan...) représentent 
            une vie dédiée à l'approfondissement de l'art.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
