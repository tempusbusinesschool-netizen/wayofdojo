'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { 
  Search, X, Star, CheckCircle, Sparkles
} from 'lucide-react';
import { JuniorPageLayout } from '@/components/layouts/JuniorPageLayout';
import { KYU_ORDER, getTechniquesByKyu, ExtendedTechnique } from '@/constants/techniquesByKyu';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * JuniorTechniquesPage - Version enfantine et ludique de la page Techniques
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Configuration des ceintures version enfant
const BELT_CONFIG_JUNIOR: Record<string, { label: string; color: string; gradient: string; emoji: string }> = {
  '6e_kyu': { label: '6e Kyu', color: 'bg-white', gradient: 'from-slate-100 to-white', emoji: '⬜' },
  '5e_kyu': { label: '5e Kyu', color: 'bg-yellow-400', gradient: 'from-yellow-400 to-amber-400', emoji: '💛' },
  '4e_kyu': { label: '4e Kyu', color: 'bg-orange-500', gradient: 'from-orange-400 to-orange-600', emoji: '🧡' },
  '3e_kyu': { label: '3e Kyu', color: 'bg-green-500', gradient: 'from-green-400 to-green-600', emoji: '💚' },
  '2e_kyu': { label: '2e Kyu', color: 'bg-blue-500', gradient: 'from-blue-400 to-blue-600', emoji: '💙' },
  '1er_kyu': { label: '1er Kyu', color: 'bg-amber-700', gradient: 'from-amber-600 to-amber-800', emoji: '🤎' },
  '1er_dan': { label: '1er Dan', color: 'bg-slate-900', gradient: 'from-slate-800 to-black', emoji: '🖤' },
};

// Catégories simplifiées pour enfants
const CATEGORIES_JUNIOR = [
  { id: 'all', label: 'Toutes', emoji: '🌟' },
  { id: 'ukemi', label: 'Chutes', emoji: '🤸' },
  { id: 'tai_sabaki', label: 'Déplacements', emoji: '🏃' },
  { id: 'nage_waza', label: 'Projections', emoji: '💫' },
  { id: 'osae_waza', label: 'Immobilisations', emoji: '🔒' },
  { id: 'buki_waza', label: 'Armes', emoji: '⚔️' },
];

interface JuniorTechniquesPageProps {
  userName?: string;
  userXp?: number;
  userLevel?: number;
  userStreak?: number;
  userCurrentKyu?: string;
  completedTechniques?: string[];
}

export const JuniorTechniquesPage: React.FC<JuniorTechniquesPageProps> = ({
  userName = 'Jeune Samouraï',
  userXp = 0,
  userLevel = 1,
  userStreak = 0,
  userCurrentKyu = '6e_kyu',
  completedTechniques = [],
}) => {
  const params = useParams();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const [selectedKyu, setSelectedKyu] = useState(userCurrentKyu);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnique, setSelectedTechnique] = useState<ExtendedTechnique | null>(null);

  // Obtenir les techniques pour le kyu sélectionné
  const techniques = getTechniquesByKyu(selectedKyu);

  // Filtrer les techniques
  const filteredTechniques = techniques.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (tech.description && tech.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || tech.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Compter les techniques maîtrisées
  const masteredCount = filteredTechniques.filter(t => completedTechniques.includes(t.id)).length;

  return (
    <JuniorPageLayout
      locale={locale}
      sport={sport}
      title="Mes Techniques"
      subtitle="Apprends les mouvements du samouraï ! 🥋"
      emoji="📚"
      userName={userName}
      userXp={userXp}
      userLevel={userLevel}
      userStreak={userStreak}
    >
      {/* Sélecteur de ceintures */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 mb-6 border border-white/20">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          🎯 Choisis ta ceinture
        </h3>
        <div className="flex flex-wrap gap-2">
          {KYU_ORDER.map((kyu) => {
            const config = BELT_CONFIG_JUNIOR[kyu];
            const isActive = selectedKyu === kyu;
            const isUserKyu = kyu === userCurrentKyu;
            
            return (
              <motion.button
                key={kyu}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedKyu(kyu)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  isActive 
                    ? `bg-gradient-to-r ${config.gradient} text-slate-900 shadow-lg` 
                    : 'bg-white/10 text-white hover:bg-white/20'
                } ${isUserKyu ? 'ring-2 ring-yellow-400' : ''}`}
              >
                <span>{config.emoji}</span>
                <span>{config.label}</span>
                {isUserKyu && <Star className="w-3 h-3 text-yellow-500" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Stats et recherche */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Progression */}
        <div className="bg-gradient-to-br from-purple-600/80 to-pink-600/80 backdrop-blur-xl rounded-3xl p-5 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Ta progression
            </h3>
            <span className="text-2xl font-black text-white">{masteredCount}/{filteredTechniques.length}</span>
          </div>
          <div className="h-4 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${filteredTechniques.length > 0 ? (masteredCount / filteredTechniques.length) * 100 : 0}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full"
            />
          </div>
          <p className="text-white/70 text-sm mt-2">
            {masteredCount === filteredTechniques.length 
              ? '🎉 Bravo ! Tu as tout maîtrisé !' 
              : `Continue comme ça, champion ! 💪`}
          </p>
        </div>

        {/* Recherche */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-white/20">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Recherche
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Cherche une technique..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Filtres catégories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES_JUNIOR.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              selectedCategory === cat.id
                ? 'bg-yellow-400 text-slate-900 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {cat.emoji} {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Grille de techniques */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTechniques.map((technique, index) => {
          const isMastered = completedTechniques.includes(technique.id);
          
          return (
            <motion.div
              key={technique.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -5 }}
              onClick={() => setSelectedTechnique(technique)}
              className={`relative bg-gradient-to-br ${
                isMastered 
                  ? 'from-green-500/80 to-emerald-600/80' 
                  : 'from-slate-700/80 to-slate-800/80'
              } backdrop-blur-xl rounded-2xl p-4 cursor-pointer border-2 ${
                isMastered ? 'border-green-400/50' : 'border-white/10'
              } shadow-xl`}
            >
              {/* Badge maîtrisé */}
              {isMastered && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Image placeholder */}
              <div className="relative w-full aspect-square bg-white/10 rounded-xl mb-3 overflow-hidden flex items-center justify-center">
                <span className="text-4xl">🥋</span>
              </div>

              {/* Nom */}
              <h4 className="text-white font-bold text-sm truncate">{technique.name}</h4>
              <p className="text-white/60 text-xs truncate">{technique.category}</p>

              {/* Niveau */}
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= (technique.difficulty || 1)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-white/20'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Message si aucune technique */}
      {filteredTechniques.length === 0 && (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🔍</span>
          <p className="text-white/80 text-lg">Aucune technique trouvée...</p>
          <p className="text-white/60 text-sm">Essaie une autre recherche !</p>
        </div>
      )}

      {/* Modal détail technique */}
      <AnimatePresence>
        {selectedTechnique && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedTechnique(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-lg w-full border border-white/20 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedTechnique.name}</h3>
                  <p className="text-orange-400 text-lg">{selectedTechnique.category}</p>
                </div>
                <button
                  onClick={() => setSelectedTechnique(null)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>

              {/* Image placeholder */}
              <div className="relative w-full aspect-video bg-white/10 rounded-2xl mb-4 overflow-hidden flex items-center justify-center">
                <span className="text-6xl">🥋</span>
              </div>

              {/* Description */}
              <p className="text-white/80 mb-4">
                {selectedTechnique.description || 'Pratique cette technique avec attention et concentration ! 🎯'}
              </p>

              {/* Catégorie */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                  {selectedTechnique.category || 'Technique'}
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= (selectedTechnique.difficulty || 1)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Bouton fermer */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTechnique(null)}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white font-bold"
              >
                J'ai compris ! 👍
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </JuniorPageLayout>
  );
};

export default JuniorTechniquesPage;
