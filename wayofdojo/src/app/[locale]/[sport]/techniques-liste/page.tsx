'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Filter, Play, ChevronRight, BookOpen, Award, Target, Users, Mic } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AikidoWireframe from '@/components/animations/AikidoWireframe';
import TanakaVoiceSearch from '@/components/voice/TanakaVoiceSearch';

// Import des données migrées
import { UKEMI, TAI_SABAKI, KANSETSU_WAZA, KAMAE, AIKIDO_GLOBAL_STATS } from '@/data/aikido';
import { SUWARIWAZA } from '@/data/aikido/mouvements/suwariwaza';
import { ATEMI } from '@/data/aikido/mouvements/atemi';
import { HANMI_HANDACHI } from '@/data/aikido/mouvements/hanmi-handachi';
import { KOKYU_WAZA } from '@/data/aikido/mouvements/kokyu-waza';
import { TECHNIQUES_JO } from '@/data/aikido/armes/jo';
import { TECHNIQUES_TANTO } from '@/data/aikido/armes/tanto';
import { TECHNIQUES_BOKKEN } from '@/data/aikido/armes/bokken';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PAGE TECHNIQUES D'AÏKIDO — DONNÉES RÉELLES MIGRÉES
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Catégories de techniques avec vraies statistiques
const CATEGORIES = [
  { id: 'all', name: 'Toutes', icon: '🥋', color: '#F59E0B' },
  { id: 'ukemi', name: 'Ukemi (Chutes)', icon: '🤸', color: '#3B82F6' },
  { id: 'tai_sabaki', name: 'Tai Sabaki', icon: '👣', color: '#10B981' },
  { id: 'kamae', name: 'Kamae (Postures)', icon: '🧘', color: '#8B5CF6' },
  { id: 'kansetsu', name: 'Kansetsu Waza', icon: '🔒', color: '#EF4444' },
  { id: 'suwariwaza', name: 'Suwariwaza', icon: '🪷', color: '#EC4899' },
  { id: 'atemi', name: 'Atemi', icon: '👊', color: '#F97316' },
  { id: 'hanmi_handachi', name: 'Hanmi Handachi', icon: '⬆️', color: '#06B6D4' },
  { id: 'kokyu', name: 'Kokyu Waza', icon: '💨', color: '#84CC16' },
  { id: 'jo', name: 'Jo (Bâton)', icon: '🥢', color: '#A855F7' },
  { id: 'tanto', name: 'Tanto (Couteau)', icon: '🗡️', color: '#DC2626' },
  { id: 'bokken', name: 'Bokken (Sabre)', icon: '⚔️', color: '#0EA5E9' },
];

// Transformer les données importées en format unifié
const transformTechnique = (tech: {
  id: string;
  nom: string;
  nom_japonais?: string;
  traduction?: string;
  description?: string;
  niveau?: string;
  points_cles?: string[];
  erreurs_communes?: string[];
  categorie?: string;
}, category: string) => ({
  id: tech.id,
  name: tech.nom.split(' ')[0] || tech.nom,
  fullName: tech.nom,
  kanji: tech.nom_japonais || '',
  meaning: tech.traduction || tech.nom,
  category,
  grade: tech.niveau || '6e_kyu',
  description: tech.description || '',
  keyPoints: tech.points_cles || [],
  errors: tech.erreurs_communes || [],
  subCategory: tech.categorie || '',
});

export default function TechniquesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);

  // Combiner toutes les techniques
  const allTechniques = useMemo(() => {
    const techniques = [
      ...UKEMI.map(t => transformTechnique(t, 'ukemi')),
      ...TAI_SABAKI.map(t => transformTechnique(t, 'tai_sabaki')),
      ...KAMAE.map(t => transformTechnique(t, 'kamae')),
      ...KANSETSU_WAZA.map(t => transformTechnique(t, 'kansetsu')),
      ...SUWARIWAZA.map(t => transformTechnique(t, 'suwariwaza')),
      ...ATEMI.map(t => transformTechnique(t, 'atemi')),
      ...HANMI_HANDACHI.map(t => transformTechnique(t, 'hanmi_handachi')),
      ...KOKYU_WAZA.map(t => transformTechnique(t, 'kokyu')),
      ...TECHNIQUES_JO.map(t => transformTechnique(t, 'jo')),
      ...TECHNIQUES_TANTO.map(t => transformTechnique(t, 'tanto')),
      ...TECHNIQUES_BOKKEN.map(t => transformTechnique(t, 'bokken')),
    ];
    return techniques;
  }, []);

  // Calculer les comptages par catégorie
  const categoriesWithCount = useMemo(() => {
    return CATEGORIES.map(cat => ({
      ...cat,
      count: cat.id === 'all' 
        ? allTechniques.length 
        : allTechniques.filter(t => t.category === cat.id).length
    }));
  }, [allTechniques]);

  // Filtrer les techniques
  const filteredTechniques = useMemo(() => {
    return allTechniques.filter(tech => {
      const matchesCategory = selectedCategory === 'all' || tech.category === selectedCategory;
      const matchesSearch = 
        tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.kanji.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [allTechniques, selectedCategory, searchQuery]);

  const selectedTechData = allTechniques.find(t => t.id === selectedTechnique);
  const categoryInfo = CATEGORIES.find(c => c.id === selectedTechData?.category);

  // Grade color mapping
  const getGradeColor = (grade: string) => {
    const gradeColors: Record<string, string> = {
      '6e_kyu': '#FFFFFF',
      '5e_kyu': '#FBBF24',
      '4e_kyu': '#F97316',
      '3e_kyu': '#22C55E',
      '2e_kyu': '#3B82F6',
      '1er_kyu': '#8B4513',
      'shodan': '#000000',
      'nidan': '#000000',
      'sandan': '#000000',
    };
    return gradeColors[grade] || '#94A3B8';
  };

  const formatGrade = (grade: string) => {
    return grade.replace('_', ' ').replace('e ', 'e ').replace('er ', 'er ');
  };

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
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              🥋 Les Techniques
            </h1>
            <p className="text-sm text-slate-400">
              {AIKIDO_GLOBAL_STATS.total_general} mouvements à maîtriser
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        
        {/* Stats globales */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50">
            <div className="text-2xl font-bold text-amber-400">{AIKIDO_GLOBAL_STATS.mouvements.total}</div>
            <div className="text-xs text-slate-400">Mouvements</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50">
            <div className="text-2xl font-bold text-purple-400">{AIKIDO_GLOBAL_STATS.armes.total}</div>
            <div className="text-xs text-slate-400">Techniques d'armes</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50">
            <div className="text-2xl font-bold text-emerald-400">{AIKIDO_GLOBAL_STATS.grades_dan}</div>
            <div className="text-xs text-slate-400">Techniques Dan</div>
          </div>
        </motion.div>

        {/* Barre de recherche */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              placeholder="Rechercher une technique... (nom, kanji, traduction)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              data-testid="search-input"
            />
          </div>
          <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
        </div>

        {/* Catégories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categoriesWithCount.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              data-testid={`category-${cat.id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              style={{
                backgroundColor: selectedCategory === cat.id ? cat.color : undefined,
              }}
            >
              <span>{cat.icon}</span>
              <span className="text-sm font-medium">{cat.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                selectedCategory === cat.id ? 'bg-white/20' : 'bg-slate-700'
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
                  size={100}
                  color="#E5A823"
                  speed={0.8}
                />
                <p className="text-xs text-slate-400 mt-2 capitalize">{movement.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Résultats */}
        <div className="flex items-center justify-between">
          <p className="text-slate-400 text-sm">
            {filteredTechniques.length} technique{filteredTechniques.length > 1 ? 's' : ''} trouvée{filteredTechniques.length > 1 ? 's' : ''}
          </p>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs text-amber-400 hover:text-amber-300"
            >
              Effacer la recherche
            </button>
          )}
        </div>

        {/* Grille des techniques */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTechniques.slice(0, 30).map((technique, index) => {
            const catInfo = CATEGORIES.find(c => c.id === technique.category);
            const gradeColor = getGradeColor(technique.grade);
            
            return (
              <motion.div
                key={technique.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedTechnique(technique.id)}
                data-testid={`technique-card-${technique.id}`}
                className="bg-slate-900/50 rounded-2xl p-5 border border-slate-700/50 hover:border-amber-600/30 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {technique.kanji && (
                        <span className="text-xl font-bold text-amber-400">{technique.kanji}</span>
                      )}
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ 
                          backgroundColor: `${gradeColor}20`,
                          color: gradeColor === '#FFFFFF' ? '#94a3b8' : gradeColor,
                          border: gradeColor === '#FFFFFF' ? '1px solid #475569' : 'none'
                        }}
                      >
                        {formatGrade(technique.grade)}
                      </span>
                    </div>
                    <h3 className="font-bold text-base truncate">{technique.name}</h3>
                    <p className="text-slate-400 text-sm truncate">{technique.meaning}</p>
                  </div>
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${catInfo?.color}20` }}
                  >
                    <span className="text-lg">{catInfo?.icon}</span>
                  </div>
                </div>
                
                {technique.description && (
                  <p className="text-slate-500 text-sm line-clamp-2 mb-3">{technique.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${catInfo?.color}20`,
                      color: catInfo?.color 
                    }}
                  >
                    {catInfo?.name}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Pagination info */}
        {filteredTechniques.length > 30 && (
          <div className="text-center py-4">
            <p className="text-slate-500 text-sm mb-3">
              Affichage de 30 sur {filteredTechniques.length} techniques
            </p>
            <Button
              variant="outline"
              className="border-slate-700 hover:bg-slate-800"
            >
              Voir plus de techniques
            </Button>
          </div>
        )}

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
                {/* Header avec couleur de catégorie */}
                <div 
                  className="p-6"
                  style={{ 
                    background: `linear-gradient(135deg, ${categoryInfo?.color}40, ${categoryInfo?.color}20)` 
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                        style={{ backgroundColor: `${categoryInfo?.color}30` }}
                      >
                        {categoryInfo?.icon}
                      </div>
                      <div>
                        {selectedTechData.kanji && (
                          <div className="text-3xl font-bold text-white mb-1">{selectedTechData.kanji}</div>
                        )}
                        <h3 className="text-xl font-bold text-white">{selectedTechData.fullName}</h3>
                        <p className="text-white/80">{selectedTechData.meaning}</p>
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
                  <div className="flex gap-3 flex-wrap">
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: `${getGradeColor(selectedTechData.grade)}20`,
                        color: getGradeColor(selectedTechData.grade) === '#FFFFFF' ? '#94a3b8' : getGradeColor(selectedTechData.grade),
                        border: getGradeColor(selectedTechData.grade) === '#FFFFFF' ? '1px solid #475569' : 'none'
                      }}
                    >
                      {formatGrade(selectedTechData.grade)}
                    </span>
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: `${categoryInfo?.color}20`,
                        color: categoryInfo?.color 
                      }}
                    >
                      {categoryInfo?.name}
                    </span>
                    {selectedTechData.subCategory && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-700 text-slate-300">
                        {selectedTechData.subCategory}
                      </span>
                    )}
                  </div>

                  {selectedTechData.description && (
                    <div>
                      <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Description
                      </h4>
                      <p className="text-slate-300 leading-relaxed">{selectedTechData.description}</p>
                    </div>
                  )}

                  {selectedTechData.keyPoints.length > 0 && (
                    <div>
                      <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Points clés
                      </h4>
                      <ul className="space-y-2">
                        {selectedTechData.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: `${categoryInfo?.color}20` }}
                            >
                              <span style={{ color: categoryInfo?.color }} className="text-xs font-bold">{idx + 1}</span>
                            </div>
                            <span className="text-slate-300">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedTechData.errors.length > 0 && (
                    <div>
                      <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Erreurs communes à éviter
                      </h4>
                      <ul className="space-y-2">
                        {selectedTechData.errors.map((error, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-red-400 text-xs">⚠</span>
                            </div>
                            <span className="text-slate-400">{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-700 flex gap-3">
                    <Button
                      onClick={() => setSelectedTechnique(null)}
                      className="flex-1"
                      style={{ 
                        background: `linear-gradient(135deg, ${categoryInfo?.color}, ${categoryInfo?.color}CC)` 
                      }}
                    >
                      Pratiquer cette technique
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTechnique(null)}
                      className="border-slate-600 hover:bg-slate-800"
                    >
                      Fermer
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
            Explorez le programme complet des passages de grades
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button
              onClick={() => router.push('/fr/aikido/ceintures')}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
            >
              <Award className="w-4 h-4 mr-2" />
              Programme des grades
            </Button>
            <Button
              onClick={() => router.push('/fr/aikido/progression')}
              variant="outline"
              className="border-slate-600 hover:bg-slate-800"
            >
              Ma progression
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
