'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, ChevronLeft, ChevronRight,
  Swords, Search,
  ArrowLeft, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import MaitreTanaka from '@/components/MaitreTanaka';
import TECHNIQUES_BY_KYU, { KYU_ORDER, getTechniquesByKyu, TOTAL_TECHNIQUES } from '@/constants/techniquesByKyu';

// Configuration des ceintures
const BELT_CONFIG: Record<string, { label: string; emoji: string; gradient: string; textColor: string }> = {
  '6e_kyu': { label: 'Blanche', emoji: '⚪', gradient: 'from-gray-200 to-gray-400', textColor: 'text-slate-800' },
  '5e_kyu': { label: 'Jaune', emoji: '🟡', gradient: 'from-yellow-400 to-amber-500', textColor: 'text-slate-900' },
  '4e_kyu': { label: 'Orange', emoji: '🟠', gradient: 'from-orange-400 to-orange-600', textColor: 'text-white' },
  '3e_kyu': { label: 'Verte', emoji: '🟢', gradient: 'from-green-500 to-emerald-600', textColor: 'text-white' },
  '2e_kyu': { label: 'Bleue', emoji: '🔵', gradient: 'from-blue-500 to-blue-700', textColor: 'text-white' },
  '1er_kyu': { label: 'Marron', emoji: '🟤', gradient: 'from-amber-700 to-amber-900', textColor: 'text-white' },
};

// Niveaux de maîtrise
const MASTERY_LEVELS = [
  { id: 'not_started', label: 'À découvrir', emoji: '⭕', color: 'text-slate-400', bg: 'bg-slate-700/50' },
  { id: 'learning', label: "J'apprends", emoji: '📖', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  { id: 'practiced', label: 'Je pratique', emoji: '🥋', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  { id: 'mastered', label: 'Maîtrisé !', emoji: '⭐', color: 'text-emerald-400', bg: 'bg-emerald-500/20' }
];

export default function TechniquesPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string || 'fr';
  const sport = params.sport as string || 'aikido';
  
  const [selectedKyu, setSelectedKyu] = useState<string>('6e_kyu');
  const [searchQuery, setSearchQuery] = useState('');
  const [masteryFilter, setMasteryFilter] = useState<string | null>(null);
  const [masteryLevels, setMasteryLevels] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wayofdojo_mastery');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // Récupérer les techniques du kyu sélectionné
  const currentKyuData = TECHNIQUES_BY_KYU[selectedKyu];
  const techniques = useMemo(() => getTechniquesByKyu(selectedKyu), [selectedKyu]);
  const beltConfig = BELT_CONFIG[selectedKyu];

  // Filtrer les techniques
  const filteredTechniques = useMemo(() => {
    let filtered = techniques;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) || 
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      );
    }
    
    if (masteryFilter) {
      filtered = filtered.filter(t => 
        (masteryLevels[t.id] || 'not_started') === masteryFilter
      );
    }
    
    return filtered;
  }, [techniques, searchQuery, masteryFilter, masteryLevels]);

  // Stats
  const stats = useMemo(() => {
    const total = techniques.length;
    const mastered = techniques.filter(t => masteryLevels[t.id] === 'mastered').length;
    const practiced = techniques.filter(t => masteryLevels[t.id] === 'practiced').length;
    const learning = techniques.filter(t => masteryLevels[t.id] === 'learning').length;
    return { total, mastered, practiced, learning, percent: total > 0 ? Math.round((mastered / total) * 100) : 0 };
  }, [techniques, masteryLevels]);

  // Changer la maîtrise
  const handleMasteryChange = (techniqueId: string, level: string) => {
    const newLevels = { ...masteryLevels, [techniqueId]: level };
    setMasteryLevels(newLevels);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wayofdojo_mastery', JSON.stringify(newLevels));
    }
  };

  // Navigation entre les kyus
  const currentKyuIndex = KYU_ORDER.indexOf(selectedKyu);
  const canGoPrev = currentKyuIndex > 0;
  const canGoNext = currentKyuIndex < KYU_ORDER.length - 1;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div className="h-6 w-px bg-slate-700" />
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h1 className="text-lg font-bold text-white">Techniques</h1>
              </div>
            </div>
            <Link href={`/${locale}/${sport}/dojo`}>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Home className="w-4 h-4 mr-2" />
                Mon Dojo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats globales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                📚 Bibliothèque des Techniques
              </h2>
              <p className="text-slate-400">
                {TOTAL_TECHNIQUES} techniques à découvrir • Du 6e Kyu au 1er Kyu
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-400">{Object.values(masteryLevels).filter(l => l === 'mastered').length}</p>
                <p className="text-slate-400 text-xs">Maîtrisées</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-400">{Object.values(masteryLevels).filter(l => l === 'practiced').length}</p>
                <p className="text-slate-400 text-xs">Pratiquées</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-400">{Object.values(masteryLevels).filter(l => l === 'learning').length}</p>
                <p className="text-slate-400 text-xs">En cours</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sélecteur de Kyu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => canGoPrev && setSelectedKyu(KYU_ORDER[currentKyuIndex - 1])}
              disabled={!canGoPrev}
              className="text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className={`flex-1 mx-4 bg-gradient-to-r ${beltConfig.gradient} rounded-2xl p-4 text-center`}>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">{beltConfig.emoji}</span>
                <div>
                  <h3 className={`text-xl font-bold ${beltConfig.textColor}`}>
                    {currentKyuData.name} - {currentKyuData.belt}
                  </h3>
                  <p className={`text-sm ${beltConfig.textColor} opacity-80`}>
                    {currentKyuData.description}
                  </p>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="mt-3">
                <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.percent}%` }}
                    className="h-full bg-white/80 rounded-full"
                  />
                </div>
                <p className={`text-xs mt-1 ${beltConfig.textColor} opacity-70`}>
                  {stats.mastered}/{stats.total} maîtrisées ({stats.percent}%)
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => canGoNext && setSelectedKyu(KYU_ORDER[currentKyuIndex + 1])}
              disabled={!canGoNext}
              className="text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Navigation rapide des Kyus */}
          <div className="flex justify-center gap-2">
            {KYU_ORDER.map((kyu) => (
              <button
                key={kyu}
                onClick={() => setSelectedKyu(kyu)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                  selectedKyu === kyu 
                    ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-950' 
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                {BELT_CONFIG[kyu].emoji}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Barre de recherche et filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher une technique..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div className="flex gap-2">
            {MASTERY_LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => setMasteryFilter(masteryFilter === level.id ? null : level.id)}
                className={`px-3 py-2 rounded-xl text-sm flex items-center gap-1 transition-all ${
                  masteryFilter === level.id
                    ? `${level.bg} ${level.color} ring-2 ring-white/30`
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <span>{level.emoji}</span>
                <span className="hidden sm:inline">{level.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Liste des techniques par catégorie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {currentKyuData.categories.map((category, catIndex) => {
            const categoryTechniques = filteredTechniques.filter(t => t.category === category.name);
            if (categoryTechniques.length === 0) return null;
            
            return (
              <div key={category.name} className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                <h4 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  {category.name}
                  <span className="ml-auto text-sm text-slate-400">
                    {categoryTechniques.filter(t => masteryLevels[t.id] === 'mastered').length}/{categoryTechniques.length}
                  </span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryTechniques.map((technique, techIndex) => {
                    const mastery = masteryLevels[technique.id] || 'not_started';
                    const masteryConfig = MASTERY_LEVELS.find(l => l.id === mastery)!;
                    
                    return (
                      <motion.div
                        key={technique.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: catIndex * 0.05 + techIndex * 0.02 }}
                        className={`relative p-4 rounded-xl border transition-all hover:scale-[1.02] ${masteryConfig.bg} ${
                          mastery === 'mastered' 
                            ? 'border-emerald-500/50' 
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        {/* Badge de maîtrise */}
                        <div className="absolute -top-2 -right-2 bg-slate-900 rounded-full p-1">
                          <span className="text-lg">{masteryConfig.emoji}</span>
                        </div>
                        
                        <h5 className="font-bold text-white mb-1">{technique.name}</h5>
                        <p className="text-slate-400 text-xs mb-3">{technique.description}</p>
                        
                        {/* Boutons de maîtrise */}
                        <div className="flex gap-1">
                          {MASTERY_LEVELS.map((level) => (
                            <button
                              key={level.id}
                              onClick={() => handleMasteryChange(technique.id, level.id)}
                              className={`flex-1 py-1 rounded text-xs transition-all ${
                                mastery === level.id
                                  ? `${level.bg} ${level.color}`
                                  : 'bg-slate-700/50 text-slate-500 hover:bg-slate-700'
                              }`}
                              title={level.label}
                            >
                              {level.emoji}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Message si aucune technique */}
        {filteredTechniques.length === 0 && (
          <div className="text-center py-12">
            <Swords className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Aucune technique trouvée</p>
            <Button
              variant="ghost"
              onClick={() => { setSearchQuery(''); setMasteryFilter(null); }}
              className="mt-4 text-cyan-400"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>

      {/* Maître Tanaka */}
      <MaitreTanaka 
        isVisible={true}
        messages={[
          "Les techniques sont le cœur de l'Aïkido. Pratique chaque jour !",
          "N'oublie pas : la répétition est la mère de la maîtrise.",
        ]}
      />
    </div>
  );
}
