/**
 * 🥋 PAGE DES 96 COMBINAISONS TECHNIQUES D'AÏKIDO
 * 
 * Affiche la liste complète des combinaisons du programme technique
 * Structure: Phase 1 (Entrée) → Phase 2 (Technique) → Phase 3 (Final)
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown, ChevronUp, Filter, Search, 
  Shield, Zap, ArrowLeft, BookOpen 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMBINAISONS_VALIDES } from '@/constants/aikidoCombinaisons';

// Mapping des noms lisibles
const ATTAQUE_NAMES = {
  'ai_hanmi_katate_dori': 'Ai Hanmi Katate Dori',
  'gyaku_hanmi_katate_dori': 'Gyaku Hanmi Katate Dori',
  'katate_dori': 'Katate Dori',
  'ryote_dori': 'Ryote Dori',
  'kata_dori': 'Kata Dori',
  'mune_dori': 'Mune Dori',
  'kata_dori_men_uchi': 'Kata Dori Men Uchi',
  'shomen_uchi': 'Shomen Uchi',
  'yokomen_uchi': 'Yokomen Uchi',
  'chudan_tsuki': 'Chudan Tsuki',
  'jodan_tsuki': 'Jodan Tsuki',
  'ushiro_ryote_dori': 'Ushiro Ryote Dori',
  'ushiro_kubi_shime': 'Ushiro Kubi Shime',
  'tanto_dori': 'Tanto Dori',
  'mae_geri': 'Mae Geri'
};

const TECHNIQUE_NAMES = {
  'ikkyo': 'Ikkyo',
  'nikyo': 'Nikyo',
  'sankyo': 'Sankyo',
  'yonkyo': 'Yonkyo',
  'gokyo': 'Gokyo',
  'shiho_nage': 'Shiho Nage',
  'irimi_nage': 'Irimi Nage',
  'kote_gaeshi': 'Kote Gaeshi',
  'kaiten_nage': 'Kaiten Nage',
  'tenchi_nage': 'Tenchi Nage',
  'koshi_nage': 'Koshi Nage',
  'kokyu_nage': 'Kokyu Nage',
  'sumi_otoshi': 'Sumi Otoshi',
  'aiki_otoshi': 'Aiki Otoshi'
};

const DEPLACEMENT_NAMES = {
  'irimi': 'Irimi',
  'tenkan': 'Tenkan',
  'irimi_tenkan': 'Irimi Tenkan'
};

const FINAL_NAMES = {
  'ikkyo_osae': 'Ikkyo Osae',
  'nikyo_osae': 'Nikyo Osae',
  'sankyo_osae': 'Sankyo Osae',
  'yonkyo_osae': 'Yonkyo Osae',
  'gokyo_osae': 'Gokyo Osae',
  'kote_gaeshi_osae': 'Kote Gaeshi Osae',
  'shiho_nage_osae': 'Shiho Nage Osae',
  'mae_ukemi': 'Mae Ukemi',
  'ushiro_ukemi': 'Ushiro Ukemi',
  'yoko_ukemi': 'Yoko Ukemi',
  'tobi_ukemi': 'Tobi Ukemi',
  'kaiten_ukemi': 'Kaiten Ukemi'
};

const KYU_COLORS = {
  '6e_kyu': { bg: 'bg-white', text: 'text-slate-800', border: 'border-slate-300', label: '6e Kyu' },
  '5e_kyu': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-400', label: '5e Kyu' },
  '4e_kyu': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-400', label: '4e Kyu' },
  '3e_kyu': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500', label: '3e Kyu' },
  '2e_kyu': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500', label: '2e Kyu' },
  '1er_kyu': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-500', label: '1er Kyu' }
};

const CombinaisonsPage = ({ onBack, embedded = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKyu, setSelectedKyu] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [expandedGroups, setExpandedGroups] = useState({});

  // Grouper les combinaisons par attaque
  const groupedCombinaisons = useMemo(() => {
    const groups = {};
    COMBINAISONS_VALIDES.forEach((combo, index) => {
      const attaque = combo.phase1.attaque;
      if (!groups[attaque]) {
        groups[attaque] = [];
      }
      groups[attaque].push({ ...combo, index: index + 1 });
    });
    return groups;
  }, []);

  // Filtrer les combinaisons
  const filteredGroups = useMemo(() => {
    const filtered = {};
    
    Object.entries(groupedCombinaisons).forEach(([attaque, combos]) => {
      const filteredCombos = combos.filter(combo => {
        // Filtre par niveau
        if (selectedKyu !== 'all' && combo.kyu !== selectedKyu) return false;
        
        // Filtre par type
        if (selectedType !== 'all' && combo.phase3.type !== selectedType) return false;
        
        // Filtre par recherche
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const attaqueName = ATTAQUE_NAMES[combo.phase1.attaque]?.toLowerCase() || '';
          const techniqueName = TECHNIQUE_NAMES[combo.phase2.technique]?.toLowerCase() || '';
          const direction = combo.phase2.direction?.toLowerCase() || '';
          
          if (!attaqueName.includes(searchLower) && 
              !techniqueName.includes(searchLower) && 
              !direction.includes(searchLower)) {
            return false;
          }
        }
        
        return true;
      });
      
      if (filteredCombos.length > 0) {
        filtered[attaque] = filteredCombos;
      }
    });
    
    return filtered;
  }, [groupedCombinaisons, selectedKyu, selectedType, searchTerm]);

  // Compter les résultats filtrés
  const totalFiltered = Object.values(filteredGroups).flat().length;

  // Toggle groupe
  const toggleGroup = (attaque) => {
    setExpandedGroups(prev => ({
      ...prev,
      [attaque]: !prev[attaque]
    }));
  };

  // Expand/Collapse all
  const expandAll = () => {
    const allExpanded = {};
    Object.keys(filteredGroups).forEach(key => {
      allExpanded[key] = true;
    });
    setExpandedGroups(allExpanded);
  };

  const collapseAll = () => {
    setExpandedGroups({});
  };

  return (
    <div className={embedded ? "" : "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"}>
      {/* Header - Masqué en mode embedded */}
      {!embedded && (
        <header className="bg-slate-800/80 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-amber-400" />
                    Programme Technique
                  </h1>
                  <p className="text-slate-400 text-sm">
                    {totalFiltered} combinaison{totalFiltered > 1 ? 's' : ''} sur 96
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Filtres */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Recherche */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher une technique..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Filtre par niveau */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedKyu}
                onChange={(e) => setSelectedKyu(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Tous les niveaux</option>
                <option value="6e_kyu">6e Kyu</option>
                <option value="5e_kyu">5e Kyu</option>
                <option value="4e_kyu">4e Kyu</option>
                <option value="3e_kyu">3e Kyu</option>
                <option value="2e_kyu">2e Kyu</option>
                <option value="1er_kyu">1er Kyu</option>
              </select>
            </div>

            {/* Filtre par type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Tous les types</option>
              <option value="immobilisation">Immobilisations</option>
              <option value="chute">Projections</option>
            </select>

            {/* Boutons expand/collapse */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={expandAll}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Tout déplier
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={collapseAll}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Tout replier
              </Button>
            </div>
          </div>
        </div>

        {/* Liste des combinaisons groupées */}
        <div className="space-y-4">
          {Object.entries(filteredGroups).map(([attaque, combos]) => (
            <motion.div
              key={attaque}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
            >
              {/* Header du groupe */}
              <button
                onClick={() => toggleGroup(attaque)}
                className="w-full px-4 py-3 flex items-center justify-between bg-slate-700/50 hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🥋</span>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-white">
                      {ATTAQUE_NAMES[attaque] || attaque}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {combos.length} combinaison{combos.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                {expandedGroups[attaque] ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {/* Contenu du groupe */}
              {expandedGroups[attaque] && (
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-700">
                          <th className="text-left py-2 px-2 font-medium">N°</th>
                          <th className="text-left py-2 px-2 font-medium">Niveau</th>
                          <th className="text-left py-2 px-2 font-medium">Déplacement</th>
                          <th className="text-left py-2 px-2 font-medium">Technique</th>
                          <th className="text-left py-2 px-2 font-medium">Final</th>
                          <th className="text-left py-2 px-2 font-medium">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {combos.map((combo) => {
                          const kyuStyle = KYU_COLORS[combo.kyu] || KYU_COLORS['6e_kyu'];
                          const techniqueName = TECHNIQUE_NAMES[combo.phase2.technique] || combo.phase2.technique;
                          const direction = combo.phase2.direction ? ` ${combo.phase2.direction.charAt(0).toUpperCase() + combo.phase2.direction.slice(1)}` : '';
                          const variant = combo.phase2.variant ? ` (${combo.phase2.variant})` : '';
                          
                          return (
                            <tr 
                              key={combo.id} 
                              className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                            >
                              <td className="py-3 px-2 text-slate-500 font-mono">
                                {combo.index}
                              </td>
                              <td className="py-3 px-2">
                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${kyuStyle.bg} ${kyuStyle.text} border ${kyuStyle.border}`}>
                                  {kyuStyle.label}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-cyan-400 font-medium">
                                {DEPLACEMENT_NAMES[combo.phase1.deplacement] || combo.phase1.deplacement}
                              </td>
                              <td className="py-3 px-2 text-white font-medium">
                                {techniqueName}{direction}{variant}
                              </td>
                              <td className="py-3 px-2 text-slate-300">
                                {FINAL_NAMES[combo.phase3.final] || combo.phase3.final}
                              </td>
                              <td className="py-3 px-2">
                                {combo.phase3.type === 'immobilisation' ? (
                                  <span className="flex items-center gap-1 text-amber-400">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-xs">Osae</span>
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-blue-400">
                                    <Zap className="w-4 h-4" />
                                    <span className="text-xs">Nage</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Aucun résultat */}
        {totalFiltered === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">Aucune combinaison trouvée</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setSelectedKyu('all');
                setSelectedType('all');
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}

        {/* Légende */}
        <div className="mt-8 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">📚 Légende</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Niveaux (Kyu)</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(KYU_COLORS).map(([kyu, style]) => (
                  <span key={kyu} className={`px-2 py-1 rounded text-xs font-medium ${style.bg} ${style.text} border ${style.border}`}>
                    {style.label}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Types de finition</h4>
              <div className="flex gap-4">
                <span className="flex items-center gap-2 text-amber-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Osae (Immobilisation)</span>
                </span>
                <span className="flex items-center gap-2 text-blue-400">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Nage (Projection)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinaisonsPage;
