'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Filter, Play, ChevronRight, BookOpen, Award, Target, Swords, Hand, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AikidoWireframe from '@/components/animations/AikidoWireframe';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PAGE TECHNIQUES D'AÏKIDO — 206+ MOUVEMENTS
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Catégories de techniques
const CATEGORIES = [
  { id: 'all', name: 'Toutes', icon: '🥋', count: 206 },
  { id: 'immobilisations', name: 'Immobilisations', icon: '🔒', count: 25 },
  { id: 'projections', name: 'Projections', icon: '🌀', count: 35 },
  { id: 'deplacements', name: 'Déplacements', icon: '👣', count: 12 },
  { id: 'ukemi', name: 'Ukemi (Chutes)', icon: '🤸', count: 8 },
  { id: 'armes', name: 'Armes', icon: '⚔️', count: 45 },
  { id: 'attaques', name: 'Attaques', icon: '👊', count: 18 },
];

// Techniques principales avec animations
const TECHNIQUES = [
  {
    id: 'ikkyo',
    name: 'Ikkyo',
    kanji: '一教',
    meaning: 'Premier Principe',
    category: 'immobilisations',
    grade: '6e Kyu',
    gradeColor: '#FFFFFF',
    animation: 'ikkyo' as const,
    description: "Première technique d'immobilisation. Contrôle du bras en amenant le partenaire au sol.",
    keyPoints: ['Contrôle du coude', 'Direction vers le bas', 'Garder le centre'],
    variations: ['Omote (extérieur)', 'Ura (intérieur)'],
  },
  {
    id: 'nikyo',
    name: 'Nikyo',
    kanji: '二教',
    meaning: 'Deuxième Principe',
    category: 'immobilisations',
    grade: '5e Kyu',
    gradeColor: '#FBBF24',
    animation: 'ikkyo' as const,
    description: "Immobilisation par torsion du poignet. Technique douloureuse mais contrôlée.",
    keyPoints: ['Torsion du poignet', 'Point de pression', 'Contrôle respiratoire'],
    variations: ['Omote', 'Ura'],
  },
  {
    id: 'shiho_nage',
    name: 'Shiho Nage',
    kanji: '四方投げ',
    meaning: 'Projection 4 Directions',
    category: 'projections',
    grade: '5e Kyu',
    gradeColor: '#FBBF24',
    animation: 'shiho_nage' as const,
    description: "Projection dans les quatre directions. Technique fondamentale de projection.",
    keyPoints: ['Saisie du poignet', 'Rotation des hanches', 'Extension du bras'],
    variations: ['Omote', 'Ura'],
  },
  {
    id: 'irimi_nage',
    name: 'Irimi Nage',
    kanji: '入り身投げ',
    meaning: 'Projection d\'Entrée',
    category: 'projections',
    grade: '4e Kyu',
    gradeColor: '#F97316',
    animation: 'irimi' as const,
    description: "Projection par entrée directe. Le pratiquant entre dans l'attaque.",
    keyPoints: ['Entrée décisive', 'Contrôle de la tête', 'Projection fluide'],
    variations: ['Direct', 'Avec tenkan'],
  },
  {
    id: 'kote_gaeshi',
    name: 'Kote Gaeshi',
    kanji: '小手返し',
    meaning: 'Retournement du Poignet',
    category: 'projections',
    grade: '3e Kyu',
    gradeColor: '#22C55E',
    animation: 'tenkan' as const,
    description: "Projection par retournement du poignet vers l'extérieur.",
    keyPoints: ['Saisie en coupe', 'Rotation externe', 'Contrôle au sol'],
    variations: ['Standard', 'Contre tsuki'],
  },
  {
    id: 'kaiten_nage',
    name: 'Kaiten Nage',
    kanji: '回転投げ',
    meaning: 'Projection Rotative',
    category: 'projections',
    grade: '2e Kyu',
    gradeColor: '#3B82F6',
    animation: 'tenkan' as const,
    description: "Projection par rotation du corps du partenaire.",
    keyPoints: ['Rotation complète', 'Contrôle de la tête', 'Direction spirale'],
    variations: ['Uchi (intérieur)', 'Soto (extérieur)'],
  },
  {
    id: 'tenkan',
    name: 'Tenkan',
    kanji: '転換',
    meaning: 'Pivot 180°',
    category: 'deplacements',
    grade: '6e Kyu',
    gradeColor: '#FFFFFF',
    animation: 'tenkan' as const,
    description: "Déplacement fondamental de pivot sur place de 180 degrés.",
    keyPoints: ['Pivot sur pied avant', 'Garder le centre', 'Mouvement fluide'],
    variations: ['Simple', 'Avec irimi'],
  },
  {
    id: 'irimi',
    name: 'Irimi',
    kanji: '入り身',
    meaning: 'Entrée Directe',
    category: 'deplacements',
    grade: '6e Kyu',
    gradeColor: '#FFFFFF',
    animation: 'irimi' as const,
    description: "Entrée directe vers le partenaire, mouvement d'avancée.",
    keyPoints: ['Pas décisif', 'Ligne centrale', 'Timing précis'],
    variations: ['Omote', 'Ura'],
  },
  {
    id: 'mae_ukemi',
    name: 'Mae Ukemi',
    kanji: '前受身',
    meaning: 'Chute Avant',
    category: 'ukemi',
    grade: '6e Kyu',
    gradeColor: '#FFFFFF',
    animation: 'ukemi' as const,
    description: "Roulade avant fondamentale pour absorber les projections.",
    keyPoints: ['Tête rentrée', 'Épaule arrondie', 'Rouler en diagonale'],
    variations: ['Lente', 'Rapide', 'Haute'],
  },
  {
    id: 'kokyu_ho',
    name: 'Kokyu Ho',
    kanji: '呼吸法',
    meaning: 'Méthode de Respiration',
    category: 'immobilisations',
    grade: '6e Kyu',
    gradeColor: '#FFFFFF',
    animation: 'kokyu' as const,
    description: "Exercice de respiration et de centrage pratiqué à genoux.",
    keyPoints: ['Respiration profonde', 'Extension du ki', 'Stabilité du centre'],
    variations: ['Suwari waza', 'Debout'],
  },
];

export default function TechniquesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);

  const filteredTechniques = TECHNIQUES.filter(tech => {
    const matchesCategory = selectedCategory === 'all' || tech.category === selectedCategory;
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tech.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tech.kanji.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const selectedTechData = TECHNIQUES.find(t => t.id === selectedTechnique);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              🥋 Les Techniques
            </h1>
            <p className="text-sm text-slate-400">206+ mouvements à maîtriser</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        
        {/* Barre de recherche */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              placeholder="Rechercher une technique..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
        </div>

        {/* Catégories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="text-sm font-medium">{cat.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                selectedCategory === cat.id ? 'bg-amber-500' : 'bg-slate-700'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Animation demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Play className="w-5 h-5 text-amber-400" />
              Animation Fil de Fer
            </h3>
            <span className="text-slate-500 text-sm">Visualisez les mouvements</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {['irimi', 'tenkan', 'shiho_nage', 'ikkyo', 'kokyu', 'ukemi'].map((movement) => (
              <div key={movement} className="text-center">
                <AikidoWireframe 
                  movement={movement as 'irimi' | 'tenkan' | 'shiho_nage' | 'ikkyo' | 'kokyu' | 'ukemi'} 
                  size={120}
                  color="#E5A823"
                  speed={0.8}
                />
                <p className="text-xs text-slate-400 mt-2 capitalize">{movement.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Grille des techniques */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTechniques.map((technique, index) => (
            <motion.div
              key={technique.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedTechnique(technique.id)}
              className="bg-slate-900/50 rounded-2xl p-5 border border-slate-700/50 hover:border-amber-600/30 cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-amber-400">{technique.kanji}</span>
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ 
                        backgroundColor: `${technique.gradeColor}20`,
                        color: technique.gradeColor === '#FFFFFF' ? '#94a3b8' : technique.gradeColor,
                        border: technique.gradeColor === '#FFFFFF' ? '1px solid #475569' : 'none'
                      }}
                    >
                      {technique.grade}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg">{technique.name}</h3>
                  <p className="text-slate-400 text-sm">{technique.meaning}</p>
                </div>
                <div className="w-16 h-16">
                  <AikidoWireframe 
                    movement={technique.animation} 
                    size={64}
                    color="#E5A823"
                    strokeWidth={2}
                    showGround={false}
                  />
                </div>
              </div>
              
              <p className="text-slate-500 text-sm line-clamp-2 mb-3">{technique.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className={`px-2 py-1 rounded-full ${
                    technique.category === 'immobilisations' ? 'bg-blue-500/20 text-blue-400' :
                    technique.category === 'projections' ? 'bg-purple-500/20 text-purple-400' :
                    technique.category === 'deplacements' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {CATEGORIES.find(c => c.id === technique.category)?.name}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal détail technique */}
        <AnimatePresence>
          {selectedTechData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedTechnique(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto"
              >
                {/* Header avec animation */}
                <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/30 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24">
                        <AikidoWireframe 
                          movement={selectedTechData.animation} 
                          size={96}
                          color="#E5A823"
                          speed={0.6}
                        />
                      </div>
                      <div>
                        <div className="text-4xl font-bold text-amber-400 mb-1">{selectedTechData.kanji}</div>
                        <h3 className="text-xl font-bold text-white">{selectedTechData.name}</h3>
                        <p className="text-amber-200/80">{selectedTechData.meaning}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTechnique(null)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6 space-y-6">
                  <div className="flex gap-3">
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: `${selectedTechData.gradeColor}20`,
                        color: selectedTechData.gradeColor === '#FFFFFF' ? '#94a3b8' : selectedTechData.gradeColor,
                        border: selectedTechData.gradeColor === '#FFFFFF' ? '1px solid #475569' : 'none'
                      }}
                    >
                      {selectedTechData.grade}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-700 text-slate-300">
                      {CATEGORIES.find(c => c.id === selectedTechData.category)?.name}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Description
                    </h4>
                    <p className="text-slate-300">{selectedTechData.description}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Points clés
                    </h4>
                    <ul className="space-y-2">
                      {selectedTechData.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <span className="text-amber-400 text-xs font-bold">{idx + 1}</span>
                          </div>
                          <span className="text-slate-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Variations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTechData.variations.map((variation, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm">
                          {variation}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <Button
                      onClick={() => setSelectedTechnique(null)}
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
                    >
                      Pratiquer cette technique
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <div className="text-center py-8">
          <p className="text-slate-500 mb-4">
            Découvrez les {206 - filteredTechniques.length} autres techniques dans le programme complet
          </p>
          <Button
            onClick={() => router.push('/fr/aikido/progression')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
          >
            <Award className="w-4 h-4 mr-2" />
            Voir ma progression
          </Button>
        </div>
      </div>
    </div>
  );
}
