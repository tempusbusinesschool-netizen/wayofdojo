'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Home, BookOpen, Swords, 
  Target, Activity, Shield, Wind,
  ChevronDown, ChevronUp, Play, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import MaitreTanaka from '@/components/MaitreTanaka';

// Import des données migrées
import { 
  UKEMI, UKEMI_STATS,
  KANSETSU_WAZA, KANSETSU_WAZA_STATS,
  TAI_SABAKI, TAI_SABAKI_STATS,
  TECHNIQUES_JO, JO_STATISTICS,
  TECHNIQUES_TANTO, TANTO_STATISTICS,
  TECHNIQUES_BOKKEN, BOKKEN_STATISTICS,
  AIKIDO_GLOBAL_STATS,
  Mouvement, TechniqueArme
} from '@/data/aikido';

// Configuration des catégories
const CATEGORIES = [
  { 
    id: 'ukemi', 
    label: 'Ukemi (Chutes)', 
    icon: Activity, 
    color: 'from-cyan-500 to-cyan-700',
    data: UKEMI,
    stats: UKEMI_STATS,
    description: 'Les techniques de chute essentielles pour recevoir les projections en sécurité'
  },
  { 
    id: 'tai_sabaki', 
    label: 'Tai Sabaki (Déplacements)', 
    icon: Wind, 
    color: 'from-purple-500 to-purple-700',
    data: TAI_SABAKI,
    stats: TAI_SABAKI_STATS,
    description: 'Les mouvements du corps pour esquiver, entrer et rediriger'
  },
  { 
    id: 'kansetsu_waza', 
    label: 'Kansetsu Waza (Techniques)', 
    icon: Target, 
    color: 'from-emerald-500 to-emerald-700',
    data: KANSETSU_WAZA,
    stats: KANSETSU_WAZA_STATS,
    description: 'Les techniques articulaires et projections fondamentales'
  },
  { 
    id: 'jo', 
    label: 'Jo (Bâton)', 
    icon: Swords, 
    color: 'from-amber-500 to-amber-700',
    data: TECHNIQUES_JO,
    stats: JO_STATISTICS,
    description: 'Les techniques au bâton de 128 cm : suburi, kata, kumijo'
  },
  { 
    id: 'tanto', 
    label: 'Tanto Dori (Couteau)', 
    icon: Shield, 
    color: 'from-red-500 to-red-700',
    data: TECHNIQUES_TANTO,
    stats: TANTO_STATISTICS,
    description: 'Les défenses contre attaque au couteau'
  },
  { 
    id: 'bokken', 
    label: 'Bokken (Sabre)', 
    icon: Swords, 
    color: 'from-slate-500 to-slate-700',
    data: TECHNIQUES_BOKKEN,
    stats: BOKKEN_STATISTICS,
    description: 'Les techniques au sabre de bois : suburi, kumitachi, tachi dori'
  },
];

// Niveaux avec couleurs
const NIVEAU_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  '6e_kyu': { bg: 'bg-gray-200', text: 'text-gray-800', label: '6e Kyu' },
  '5e_kyu': { bg: 'bg-yellow-400', text: 'text-yellow-900', label: '5e Kyu' },
  '4e_kyu': { bg: 'bg-orange-400', text: 'text-orange-900', label: '4e Kyu' },
  '3e_kyu': { bg: 'bg-green-500', text: 'text-white', label: '3e Kyu' },
  '2e_kyu': { bg: 'bg-blue-500', text: 'text-white', label: '2e Kyu' },
  '1er_kyu': { bg: 'bg-amber-700', text: 'text-white', label: '1er Kyu' },
  'shodan': { bg: 'bg-slate-900', text: 'text-white', label: 'Shodan' },
  'nidan': { bg: 'bg-slate-800', text: 'text-white', label: 'Nidan' },
  'sandan': { bg: 'bg-slate-700', text: 'text-white', label: 'Sandan' },
};

// Composant carte mouvement
function MouvementCard({ item, index }: { item: Mouvement; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const niveauConfig = NIVEAU_COLORS[item.niveau] || NIVEAU_COLORS['6e_kyu'];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-500 transition-all"
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-white">{item.nom}</h4>
              <span className={`px-2 py-0.5 rounded-full text-xs ${niveauConfig.bg} ${niveauConfig.text}`}>
                {niveauConfig.label}
              </span>
            </div>
            <p className="text-cyan-400 text-sm font-mono">{item.nom_japonais}</p>
            <p className="text-slate-500 text-xs italic">{item.traduction}</p>
          </div>
          <button className="text-slate-400 hover:text-white p-1">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
        
        <p className="text-slate-300 text-sm mt-2 line-clamp-2">{item.description}</p>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-700"
          >
            <div className="p-4 space-y-4">
              {/* Points clés */}
              {item.points_cles && item.points_cles.length > 0 && (
                <div>
                  <h5 className="text-emerald-400 text-sm font-semibold mb-2 flex items-center gap-1">
                    <Target className="w-4 h-4" /> Points clés
                  </h5>
                  <ul className="space-y-1">
                    {item.points_cles.map((point, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Erreurs communes */}
              {item.erreurs_communes && item.erreurs_communes.length > 0 && (
                <div>
                  <h5 className="text-red-400 text-sm font-semibold mb-2 flex items-center gap-1">
                    <Info className="w-4 h-4" /> Erreurs à éviter
                  </h5>
                  <ul className="space-y-1">
                    {item.erreurs_communes.map((erreur, i) => (
                      <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                        <span className="text-red-400">✗</span>
                        {erreur}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Applications */}
              {item.applications && item.applications.length > 0 && (
                <div>
                  <h5 className="text-amber-400 text-sm font-semibold mb-2">Applications</h5>
                  <div className="flex flex-wrap gap-2">
                    {item.applications.map((app, i) => (
                      <span key={i} className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Vidéo placeholder */}
              {item.video?.placeholder && (
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Play className="w-4 h-4" />
                  <span>Vidéo à venir</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Composant carte technique arme
function TechniqueArmeCard({ item, index }: { item: TechniqueArme; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const niveauConfig = NIVEAU_COLORS[item.niveau] || NIVEAU_COLORS['6e_kyu'];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-500 transition-all"
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-white">{item.nom}</h4>
              <span className={`px-2 py-0.5 rounded-full text-xs ${niveauConfig.bg} ${niveauConfig.text}`}>
                {niveauConfig.label}
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-1">{item.description}</p>
          </div>
          <button className="text-slate-400 hover:text-white p-1">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-700"
          >
            <div className="p-4 space-y-3">
              {/* Phases */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-700/50 rounded-lg p-2">
                  <p className="text-xs text-slate-500 mb-1">Phase 1</p>
                  <p className="text-cyan-400 text-sm font-mono">
                    {item.phase1.attaque || 'Solo'}
                  </p>
                  <p className="text-slate-400 text-xs">{item.phase1.deplacement}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-2">
                  <p className="text-xs text-slate-500 mb-1">Phase 2</p>
                  <p className="text-emerald-400 text-sm font-mono">{item.phase2.technique}</p>
                  {item.phase2.direction && (
                    <p className="text-slate-400 text-xs">{item.phase2.direction}</p>
                  )}
                </div>
                <div className="bg-slate-700/50 rounded-lg p-2">
                  <p className="text-xs text-slate-500 mb-1">Phase 3</p>
                  <p className="text-amber-400 text-sm font-mono">{item.phase3.final}</p>
                  <p className="text-slate-400 text-xs">{item.phase3.type}</p>
                </div>
              </div>
              
              {/* Points clés */}
              {item.points_cles && item.points_cles.length > 0 && (
                <div>
                  <h5 className="text-emerald-400 text-sm font-semibold mb-2">Points clés</h5>
                  <ul className="space-y-1">
                    {item.points_cles.map((point, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MouvementsPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string || 'fr';
  const sport = params.sport as string || 'aikido';
  
  const [selectedCategory, setSelectedCategory] = useState('ukemi');
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentCategory = CATEGORIES.find(c => c.id === selectedCategory)!;
  const Icon = currentCategory.icon;
  
  // Filtrer les données
  const filteredData = currentCategory.data.filter((item: Mouvement | TechniqueArme) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.nom.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      ('nom_japonais' in item && item.nom_japonais?.toLowerCase().includes(query))
    );
  });

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
                <h1 className="text-lg font-bold text-white">Mouvements & Armes</h1>
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
                📚 Bibliothèque Avancée
              </h2>
              <p className="text-slate-400">
                {AIKIDO_GLOBAL_STATS.total_general} éléments techniques • Mouvements, Armes & Grades Dan
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-400">{AIKIDO_GLOBAL_STATS.mouvements.total}</p>
                <p className="text-slate-400 text-xs">Mouvements</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-400">{AIKIDO_GLOBAL_STATS.armes.total}</p>
                <p className="text-slate-400 text-xs">Armes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{AIKIDO_GLOBAL_STATS.grades_dan}</p>
                <p className="text-slate-400 text-xs">Techniques Dan</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sélecteur de catégorie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => {
              const CatIcon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 rounded-xl border transition-all ${
                    isSelected
                      ? `bg-gradient-to-br ${cat.color} border-transparent text-white`
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <CatIcon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <p className="text-xs font-medium text-center">{cat.label.split(' ')[0]}</p>
                  <p className="text-xs text-center opacity-70">{cat.data.length}</p>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* En-tête de catégorie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`mb-6 bg-gradient-to-r ${currentCategory.color} rounded-2xl p-6`}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white">{currentCategory.label}</h3>
              <p className="text-white/80 text-sm">{currentCategory.description}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-white">{currentCategory.data.length}</p>
              <p className="text-white/70 text-sm">éléments</p>
            </div>
          </div>
        </motion.div>

        {/* Barre de recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </motion.div>

        {/* Liste des éléments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredData.map((item, index) => (
            'nom_japonais' in item ? (
              <MouvementCard key={item.id} item={item as Mouvement} index={index} />
            ) : (
              <TechniqueArmeCard key={item.id} item={item as TechniqueArme} index={index} />
            )
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Aucun élément trouvé</p>
            <Button
              variant="ghost"
              onClick={() => setSearchQuery('')}
              className="mt-4 text-cyan-400"
            >
              Réinitialiser la recherche
            </Button>
          </div>
        )}
      </div>

      {/* Maître Tanaka */}
      <MaitreTanaka 
        isVisible={true}
        messages={[
          "Les armes développent le Ma-ai, la distance juste.",
          "Chaque mouvement de base est un trésor à polir sans fin.",
        ]}
      />
    </div>
  );
}
