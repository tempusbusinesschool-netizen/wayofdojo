'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, Search, ChevronDown, Star, Eye, X,
  Home, HelpCircle, CheckCircle2, BookMarked, Sparkles, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import MaitreTanaka from '@/components/MaitreTanaka';
import { AdultSidebar } from '@/components/adult-layout/AdultSidebar';
import { AdultHeader } from '@/components/adult-layout/AdultHeader';
import TECHNIQUES_BY_KYU, { KYU_ORDER, getTechniquesByKyu, ExtendedTechnique } from '@/constants/techniquesByKyu';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Page Techniques Adulte - Refonte UX complète
 * Shell adulte avec sidebar, fond bleu nuit, accent cyan
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Configuration des ceintures avec couleurs
const BELT_CONFIG: Record<string, { label: string; color: string; bgClass: string; borderClass: string }> = {
  '6e_kyu': { label: '6e Kyu', color: '#FFFFFF', bgClass: 'bg-white', borderClass: 'border-gray-300' },
  '5e_kyu': { label: '5e Kyu', color: '#EAB308', bgClass: 'bg-yellow-500', borderClass: 'border-yellow-500' },
  '4e_kyu': { label: '4e Kyu', color: '#F97316', bgClass: 'bg-orange-500', borderClass: 'border-orange-500' },
  '3e_kyu': { label: '3e Kyu', color: '#22C55E', bgClass: 'bg-green-500', borderClass: 'border-green-500' },
  '2e_kyu': { label: '2e Kyu', color: '#3B82F6', bgClass: 'bg-blue-500', borderClass: 'border-blue-500' },
  '1er_kyu': { label: '1er Kyu', color: '#92400E', bgClass: 'bg-amber-700', borderClass: 'border-amber-700' },
};

// Niveaux de maîtrise
const MASTERY_LEVELS = [
  { id: 'all', label: 'Tous', color: 'text-white', bg: 'bg-slate-700', activeBg: 'bg-cyan-600' },
  { id: 'not_started', label: 'À découvrir', color: 'text-slate-400', bg: 'bg-slate-800', activeBg: 'bg-slate-600' },
  { id: 'learning', label: "J'apprends", color: 'text-amber-400', bg: 'bg-slate-800', activeBg: 'bg-amber-600' },
  { id: 'practiced', label: 'Je pratique', color: 'text-cyan-400', bg: 'bg-slate-800', activeBg: 'bg-cyan-600' },
  { id: 'mastered', label: 'Maîtrisé', color: 'text-emerald-400', bg: 'bg-slate-800', activeBg: 'bg-emerald-600' }
];

// Icône de ceinture SVG
const BeltIcon = ({ color, size = 40 }: { color: string; size?: number }) => (
  <svg viewBox="0 0 70 90" width={size} height={size * 1.28} className="drop-shadow-md">
    <ellipse cx="35" cy="45" rx="32" ry="42" fill="#0c1929" stroke="#1e3a5f" strokeWidth="1.5" />
    <path d="M 22 25 C 22 18, 35 14, 35 14 C 35 14, 48 18, 48 25 L 46 34 C 40 31, 30 31, 24 34 Z" fill={color} stroke={color === '#FFFFFF' ? '#D1D5DB' : 'rgba(0,0,0,0.3)'} strokeWidth="1" />
    <rect x="29" y="32" width="12" height="10" rx="2" fill={color} stroke={color === '#FFFFFF' ? '#D1D5DB' : 'rgba(0,0,0,0.3)'} strokeWidth="1" />
    <path d="M 24 42 L 18 68 C 17 72, 20 75, 24 75 L 32 75 C 35 75, 35 72, 34 68 L 29 42 Z" fill={color} stroke={color === '#FFFFFF' ? '#D1D5DB' : 'rgba(0,0,0,0.3)'} strokeWidth="1" />
    <path d="M 41 42 L 36 68 C 35 72, 35 75, 38 75 L 46 75 C 50 75, 53 72, 52 68 L 46 42 Z" fill={color} stroke={color === '#FFFFFF' ? '#D1D5DB' : 'rgba(0,0,0,0.3)'} strokeWidth="1" />
  </svg>
);

export default function TechniquesPage() {
  const params = useParams();
  const locale = params.locale as string || 'fr';
  const sport = params.sport as string || 'aikido';
  
  // État - par défaut sur la ceinture de l'utilisateur (simulé 6e_kyu pour l'instant)
  const userCurrentKyu = '6e_kyu'; // TODO: récupérer depuis le profil utilisateur
  const [selectedKyu, setSelectedKyu] = useState<string>(userCurrentKyu);
  const [searchQuery, setSearchQuery] = useState('');
  const [masteryFilter, setMasteryFilter] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [masteryLevels, setMasteryLevels] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wayofdojo_mastery');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  // État pour la technique sélectionnée (modal de détail)
  const [selectedTechnique, setSelectedTechnique] = useState<ExtendedTechnique | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wayofdojo_favorites');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // Données
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
    
    if (masteryFilter && masteryFilter !== 'all') {
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
    return { total, mastered, practiced, learning };
  }, [techniques, masteryLevels]);

  // Techniques à travailler (non maîtrisées, max 3)
  const techniquesToWork = useMemo(() => {
    return techniques
      .filter(t => masteryLevels[t.id] !== 'mastered')
      .slice(0, 3);
  }, [techniques, masteryLevels]);

  // Changer la maîtrise
  const handleMasteryChange = (techniqueId: string, level: string) => {
    const newLevels = { ...masteryLevels, [techniqueId]: level };
    setMasteryLevels(newLevels);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wayofdojo_mastery', JSON.stringify(newLevels));
    }
  };

  // Toggle catégorie
  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  // Logout handler
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wayofdojo_token');
      window.location.href = `/${locale}`;
    }
  };

  // Obtenir le badge de statut
  const getMasteryBadge = (techniqueId: string) => {
    const level = masteryLevels[techniqueId] || 'not_started';
    const config = MASTERY_LEVELS.find(l => l.id === level);
    return config;
  };

  // Toggle favori
  const toggleFavorite = (techniqueId: string) => {
    const newFavorites = { ...favorites, [techniqueId]: !favorites[techniqueId] };
    setFavorites(newFavorites);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wayofdojo_favorites', JSON.stringify(newFavorites));
    }
  };

  // Ouvrir le détail d'une technique
  const openTechniqueDetail = (technique: ExtendedTechnique) => {
    setSelectedTechnique(technique);
  };

  // Fermer le modal
  const closeTechniqueDetail = () => {
    setSelectedTechnique(null);
  };

  return (
    <div className="min-h-screen bg-[#06101f]">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <AdultSidebar 
          locale={locale}
          sport={sport}
          onLogout={handleLogout}
        />
      </div>

      {/* Header */}
      <AdultHeader
        locale={locale}
        sport={sport}
        userName="Pratiquant"
        notificationCount={0}
        showMenuButton={true}
      />

      {/* Contenu principal */}
      <div className="lg:ml-[260px] pt-[60px]">
        <div className="p-4 lg:p-6 max-w-6xl">
          
          {/* ═══════════════════════════════════════════════════════════════
              1. HEADER DE PAGE
              ═══════════════════════════════════════════════════════════════ */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <BookOpen className="w-6 h-6 text-cyan-400" />
                <h1 className="text-2xl font-bold text-white">Techniques</h1>
              </div>
              <p className="text-slate-400 text-sm">Bibliothèque des techniques d&apos;Aïkido</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/${locale}/${sport}/dojo`}>
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  <Home className="w-4 h-4 mr-2" />
                  Mon Dojo
                </Button>
              </Link>
              <Link href={`/${locale}/${sport}/guide`}>
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Guide
                </Button>
              </Link>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              2. CARTE MON GRADE ACTUEL
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0d1628] rounded-2xl p-6 border border-slate-800 mb-6"
          >
            <div className="flex items-center gap-6 mb-6">
              {/* Illustration ceinture */}
              <div className="shrink-0">
                <BeltIcon color={beltConfig.color} size={60} />
              </div>
              
              {/* Infos grade */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">
                  {currentKyuData.name} — {currentKyuData.belt}
                </h2>
                <p className="text-slate-400 text-sm mb-3">{currentKyuData.description}</p>
                
                {/* Barre de progression */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.total > 0 ? (stats.mastered / stats.total) * 100 : 0}%` }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                    />
                  </div>
                  <span className="text-cyan-400 font-semibold text-sm whitespace-nowrap">
                    {stats.mastered} / {stats.total} maîtrisées
                  </span>
                </div>
              </div>
            </div>

            {/* Sélecteur horizontal de ceintures */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-800">
              {KYU_ORDER.map((kyu) => {
                const config = BELT_CONFIG[kyu];
                const isActive = selectedKyu === kyu;
                const isUserKyu = kyu === userCurrentKyu;
                
                return (
                  <button
                    key={kyu}
                    onClick={() => setSelectedKyu(kyu)}
                    className={`
                      relative px-4 py-2 rounded-xl text-sm font-medium transition-all
                      ${isActive 
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }
                    `}
                  >
                    {config.label}
                    {isUserKyu && !isActive && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════
              3. STATISTIQUES
              ═══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0d1628] rounded-xl p-4 border border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-400">{stats.mastered}</p>
                  <p className="text-slate-400 text-xs">Maîtrisées</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-[#0d1628] rounded-xl p-4 border border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <BookMarked className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-cyan-400">{stats.practiced}</p>
                  <p className="text-slate-400 text-xs">Pratiquées</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0d1628] rounded-xl p-4 border border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-400">{stats.learning}</p>
                  <p className="text-slate-400 text-xs">En cours</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              4. RECHERCHE ET FILTRES
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-6"
          >
            {/* Barre de recherche */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Rechercher une technique..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#0d1628] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            {/* Filtres pastilles */}
            <div className="flex flex-wrap gap-2">
              {MASTERY_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setMasteryFilter(level.id)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all border
                    ${masteryFilter === level.id
                      ? `${level.activeBg} text-white border-transparent`
                      : `${level.bg} ${level.color} border-slate-700 hover:border-slate-600`
                    }
                  `}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════
              5. BLOC PRIORITAIRE "À TRAVAILLER MAINTENANT"
              ═══════════════════════════════════════════════════════════════ */}
          {techniquesToWork.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">À travailler maintenant</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {techniquesToWork.map((technique, index) => {
                  const masteryBadge = getMasteryBadge(technique.id);
                  
                  return (
                    <motion.div
                      key={technique.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + index * 0.05 }}
                      onClick={() => openTechniqueDetail(technique)}
                      className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-xl p-4 border border-orange-500/30 hover:border-orange-500/50 transition-all cursor-pointer hover:scale-[1.02]"
                    >
                      <h4 className="font-bold text-white mb-1">{technique.name}</h4>
                      <p className="text-slate-400 text-sm mb-2">{technique.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{technique.category}</span>
                        <span className={`text-xs px-2 py-1 rounded ${masteryBadge?.bg} ${masteryBadge?.color}`}>
                          {masteryBadge?.label}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              6. BIBLIOTHÈQUE PAR CATÉGORIES (ACCORDÉONS)
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            {currentKyuData.categories.map((category) => {
              const categoryTechniques = filteredTechniques.filter(t => t.category === category.name);
              const masteredCount = categoryTechniques.filter(t => masteryLevels[t.id] === 'mastered').length;
              const isExpanded = expandedCategories[category.name] ?? false;
              
              if (categoryTechniques.length === 0 && masteryFilter !== 'all') return null;
              
              return (
                <div key={category.name} className="bg-[#0d1628] rounded-xl border border-slate-800 overflow-hidden">
                  {/* Header accordéon */}
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div className="text-left">
                        <h4 className="font-semibold text-white">{category.name}</h4>
                        <p className="text-slate-500 text-xs">
                          {masteredCount} / {categoryTechniques.length} maîtrisées
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Contenu accordéon */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {categoryTechniques.map((technique) => {
                            const mastery = masteryLevels[technique.id] || 'not_started';
                            const masteryConfig = MASTERY_LEVELS.find(l => l.id === mastery);
                            
                            return (
                              <div
                                key={technique.id}
                                className={`
                                  relative p-4 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer
                                  ${mastery === 'mastered' 
                                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                                    : 'bg-slate-800/50 border-slate-700 hover:border-cyan-500/50'
                                  }
                                `}
                              >
                                {/* Zone cliquable principale */}
                                <div onClick={() => openTechniqueDetail(technique)}>
                                  {/* Nom et description */}
                                  <h5 className="font-bold text-white mb-1">{technique.name}</h5>
                                  <p className="text-slate-400 text-xs mb-3">{technique.description}</p>
                                  
                                  {/* Catégorie + Kyu */}
                                  <p className="text-slate-500 text-[10px] mb-3">{category.name} · {currentKyuData.name}</p>
                                </div>
                                
                                {/* Badge statut + Actions */}
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs px-2 py-1 rounded ${masteryConfig?.bg} ${masteryConfig?.color}`}>
                                    {masteryConfig?.label}
                                  </span>
                                  
                                  <div className="flex gap-1">
                                    {/* Bouton favori */}
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); toggleFavorite(technique.id); }}
                                      className={`p-1.5 rounded-lg hover:bg-slate-700 transition-colors ${
                                        favorites[technique.id] ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'
                                      }`}
                                    >
                                      <Star className={`w-4 h-4 ${favorites[technique.id] ? 'fill-amber-400' : ''}`} />
                                    </button>
                                    {/* Bouton voir */}
                                    <button 
                                      onClick={() => openTechniqueDetail(technique)}
                                      className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-cyan-400 transition-colors"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* Boutons de changement de maîtrise */}
                                <div className="mt-3 pt-3 border-t border-slate-700 flex gap-1">
                                  {MASTERY_LEVELS.filter(l => l.id !== 'all').map((level) => (
                                    <button
                                      key={level.id}
                                      onClick={(e) => { e.stopPropagation(); handleMasteryChange(technique.id, level.id); }}
                                      className={`
                                        flex-1 py-1.5 rounded text-[10px] font-medium transition-all
                                        ${mastery === level.id
                                          ? `${level.activeBg} text-white`
                                          : 'bg-slate-700/50 text-slate-500 hover:bg-slate-700 hover:text-white'
                                        }
                                      `}
                                      title={level.label}
                                    >
                                      {level.label.split(' ')[0]}
                                    </button>
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
              );
            })}
          </motion.div>

          {/* Message si aucune technique */}
          {filteredTechniques.length === 0 && (
            <div className="text-center py-12 bg-[#0d1628] rounded-xl border border-slate-800">
              <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">Aucune technique trouvée</p>
              <Button
                variant="ghost"
                onClick={() => { setSearchQuery(''); setMasteryFilter('all'); }}
                className="text-cyan-400"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Widget Tanaka */}
      <MaitreTanaka 
        isVisible={true}
        messages={[
          "Commence par les chutes : elles sont la base d'une pratique sereine.",
          "Les techniques sont le cœur de l'Aïkido. Pratique chaque jour !",
        ]}
      />

      {/* ═══════════════════════════════════════════════════════════════
          MODAL DÉTAIL TECHNIQUE
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedTechnique && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={closeTechniqueDetail}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#0d1628] rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header du modal */}
              <div className="relative p-6 border-b border-slate-700">
                <button
                  onClick={closeTechniqueDetail}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-1">{selectedTechnique.name}</h2>
                    <p className="text-slate-400">{selectedTechnique.description}</p>
                  </div>
                </div>
              </div>

              {/* Corps du modal */}
              <div className="p-6 space-y-6">
                {/* Informations générales */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-400 text-sm">Catégorie</span>
                    </div>
                    <p className="text-white font-medium">{selectedTechnique.category}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BookMarked className="w-4 h-4 text-amber-400" />
                      <span className="text-slate-400 text-sm">Niveau</span>
                    </div>
                    <p className="text-white font-medium">{selectedTechnique.kyu} - {selectedTechnique.belt}</p>
                  </div>
                </div>

                {/* Statut actuel */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Mon statut</h3>
                  <div className="flex gap-2">
                    {MASTERY_LEVELS.filter(l => l.id !== 'all').map((level) => {
                      const currentLevel = masteryLevels[selectedTechnique.id] || 'not_started';
                      const isActive = currentLevel === level.id;
                      
                      return (
                        <button
                          key={level.id}
                          onClick={() => handleMasteryChange(selectedTechnique.id, level.id)}
                          className={`
                            flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all border
                            ${isActive
                              ? `${level.activeBg} text-white border-transparent`
                              : `bg-slate-800 ${level.color} border-slate-700 hover:border-slate-600`
                            }
                          `}
                        >
                          {level.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description détaillée */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Description</h3>
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <p className="text-slate-300 leading-relaxed">
                      {selectedTechnique.description}
                      {selectedTechnique.type && (
                        <span className="block mt-2 text-sm text-slate-400">
                          Type: <span className="text-cyan-400">{selectedTechnique.type}</span>
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Points clés (simulé) */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Points clés</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Maintenir une posture stable et centrée</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Respirer calmement tout au long du mouvement</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Garder le regard dirigé vers l&apos;avant</span>
                    </li>
                  </ul>
                </div>

                {/* Image de démonstration */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Illustration</h3>
                  {selectedTechnique.id.includes('ikkyo') ? (
                    <div className="relative rounded-xl overflow-hidden">
                      <Image 
                        src="/images/techniques/ikkyo.png" 
                        alt="Ikkyo - Animation pédagogique" 
                        width={800}
                        height={600}
                        className="w-full h-auto rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden h-48">
                      <Image 
                        src="/images/backgrounds/japanese-sunset-dojo.jpg" 
                        alt="Illustration technique" 
                        fill 
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-sm font-medium">{selectedTechnique.name}</p>
                        <p className="text-slate-300 text-xs">{selectedTechnique.category}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer du modal */}
              <div className="p-6 border-t border-slate-700 flex items-center justify-between">
                <button
                  onClick={() => toggleFavorite(selectedTechnique.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                    favorites[selectedTechnique.id]
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-800 text-slate-400 hover:text-amber-400'
                  }`}
                >
                  <Star className={`w-5 h-5 ${favorites[selectedTechnique.id] ? 'fill-amber-400' : ''}`} />
                  {favorites[selectedTechnique.id] ? 'Dans mes favoris' : 'Ajouter aux favoris'}
                </button>
                
                <Button
                  onClick={closeTechniqueDetail}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white"
                >
                  Fermer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
