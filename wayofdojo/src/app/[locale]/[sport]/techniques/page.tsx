'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, Search, ChevronDown, ChevronRight, Eye, X,
  Home, HelpCircle, CheckCircle2, BookMarked, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdultSidebar } from '@/components/adult-layout/AdultSidebar';
import { AdultHeader } from '@/components/adult-layout/AdultHeader';
import TECHNIQUES_BY_KYU, { KYU_ORDER, getTechniquesByKyu, ExtendedTechnique } from '@/constants/techniquesByKyu';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * WAYOFDOJO — REFONTE PAGE TECHNIQUES ADULTES
 * Route : /fr/aikido/techniques
 * 
 * Structure obligatoire :
 * 1. Header de page
 * 2. Carte "Mon niveau actuel"
 * 3. Barre d'actions et recherche
 * 4. Bloc "À travailler maintenant"
 * 5. Bloc "Ma pratique"
 * 6. Bloc "Explorer les techniques"
 * 7. Conseil compact de Tanaka
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Mapping des images de techniques
const TECHNIQUE_IMAGES: Record<string, string> = {
  // ═══════════════════════════════════════════════════════════════
  // UKEMI (Chutes)
  // ═══════════════════════════════════════════════════════════════
  'mae_ukemi': '/images/techniques/mae-ukemi.png',
  'mae_ukemi_debout': '/images/techniques/mae-ukemi.png',
  'ushiro_ukemi': '/images/techniques/ushiro-ukemi.png',
  'yoko_ukemi': '/images/techniques/yoko-ukemi.png',
  
  // ═══════════════════════════════════════════════════════════════
  // TAI SABAKI (Déplacements)
  // ═══════════════════════════════════════════════════════════════
  'irimi': '/images/techniques/irimi.png',
  'tenkan': '/images/techniques/tenkan.png',
  'irimi_tenkan': '/images/techniques/irimi-tenkan.png',
  
  // ═══════════════════════════════════════════════════════════════
  // KAMAE (Postures)
  // ═══════════════════════════════════════════════════════════════
  'ai_hanmi': '/images/techniques/hanmi-no-kamae.png',
  'gyaku_hanmi': '/images/techniques/hanmi-no-kamae.png',
  'seiza': '/images/techniques/seiza.png',
  'kamae': '/images/techniques/kamae.png',
  'hanmi_kamae': '/images/techniques/hanmi-no-kamae.png',
  
  // ═══════════════════════════════════════════════════════════════
  // ATEMI (Attaques/Frappes)
  // ═══════════════════════════════════════════════════════════════
  'shomen_uchi': '/images/techniques/shomen-uchi.png',
  'yokomen_uchi': '/images/techniques/yokomen-uchi.png',
  'chudan_tsuki': '/images/techniques/chudan-tsuki.png',
  'jodan_tsuki': '/images/techniques/jodan-tsuki.png',
  'mae_geri': '/images/techniques/mae-geri.png',
  
  // ═══════════════════════════════════════════════════════════════
  // SAISIES (Grabs)
  // ═══════════════════════════════════════════════════════════════
  'katate_dori': '/images/techniques/katate-dori.png',
  'ai_hanmi_katate_dori': '/images/techniques/ai-hanmi-katate-dori.png',
  'gyaku_hanmi_katate_dori': '/images/techniques/gyaku-hanmi-katate-dori.png',
  'ryote_dori': '/images/techniques/ryote-dori.png',
  'kata_dori': '/images/techniques/kata-dori.png',
  'mune_dori': '/images/techniques/mune-dori.png',
  'ushiro_ryote_dori': '/images/techniques/ushiro-ryote-dori.png',
  
  // ═══════════════════════════════════════════════════════════════
  // IKKYO (1ère technique)
  // ═══════════════════════════════════════════════════════════════
  'ikkyo_omote': '/images/techniques/ikkyo-omote.png',
  'ikkyo_ura': '/images/techniques/ikkyo-ura.png',
  'suwari_ikkyo': '/images/techniques/suwari-waza-ikkyo.png',
  'ushiro_ryote_ikkyo': '/images/techniques/immobilisation-ikkyo.png',
  
  // ═══════════════════════════════════════════════════════════════
  // NIKKYO (2e technique)
  // ═══════════════════════════════════════════════════════════════
  'nikyo_omote': '/images/techniques/nikkyo-omote.png',
  'nikyo_ura': '/images/techniques/nikkyo-ura.png',
  'suwari_nikyo': '/images/techniques/nikkyo-omote.png',
  
  // ═══════════════════════════════════════════════════════════════
  // SANKYO (3e technique)
  // ═══════════════════════════════════════════════════════════════
  'sankyo_omote': '/images/techniques/sankyo-omote.png',
  'sankyo_ura': '/images/techniques/sankyo-ura.png',
  'suwari_sankyo': '/images/techniques/immobilisation-sankyo.png',
  
  // ═══════════════════════════════════════════════════════════════
  // YONKYO (4e technique)
  // ═══════════════════════════════════════════════════════════════
  'yonkyo_omote': '/images/techniques/yonkyo-omote.png',
  'yonkyo_ura': '/images/techniques/yonkyo-ura.png',
  'suwari_yonkyo': '/images/techniques/immobilisation-yonkyo.png',
  
  // ═══════════════════════════════════════════════════════════════
  // GOKYO (5e technique)
  // ═══════════════════════════════════════════════════════════════
  'gokyo': '/images/techniques/gokkyo-omote.png',
  'gokyo_omote': '/images/techniques/gokkyo-omote.png',
  'gokyo_ura': '/images/techniques/gokkyo-ura.png',
  'suwari_gokyo': '/images/techniques/immobilisation-gokkyo.png',
  
  // ═══════════════════════════════════════════════════════════════
  // SHIHO NAGE
  // ═══════════════════════════════════════════════════════════════
  'shiho_nage_omote': '/images/techniques/shiho-nage.png',
  'shiho_nage_ura': '/images/techniques/shiho-nage-ura.png',
  'ushiro_ryote_shiho': '/images/techniques/shiho-nage-ura.png',
  'hanmi_shiho': '/images/techniques/shiho-nage.png',
  
  // ═══════════════════════════════════════════════════════════════
  // IRIMI NAGE
  // ═══════════════════════════════════════════════════════════════
  'irimi_nage': '/images/techniques/irimi-nage.png',
  'suwari_irimi': '/images/techniques/irimi-nage-ura.png',
  'hanmi_irimi': '/images/techniques/irimi-nage-ura.png',
  
  // ═══════════════════════════════════════════════════════════════
  // KOTE GAESHI
  // ═══════════════════════════════════════════════════════════════
  'kote_gaeshi': '/images/techniques/kote-gaeshi.png',
  'kote_gaeshi_ura': '/images/techniques/kote-gaeshi-ura.png',
  
  // ═══════════════════════════════════════════════════════════════
  // KAITEN NAGE
  // ═══════════════════════════════════════════════════════════════
  'kaiten_nage_uchi': '/images/techniques/kaiten-nage-ura.png',
  'kaiten_nage_soto': '/images/techniques/kaiten-nage-ura.png',
  'hanmi_kaiten': '/images/techniques/kaiten-nage-ura.png',
  
  // ═══════════════════════════════════════════════════════════════
  // KOKYU
  // ═══════════════════════════════════════════════════════════════
  'kokyu_ho': '/images/techniques/kokyu-ho.png',
  'kokyu_nage_1': '/images/techniques/kokyu-nage-ura.png',
  'kokyu_nage_2': '/images/techniques/kokyu-nage-ura.png',
  
  // ═══════════════════════════════════════════════════════════════
  // SHIKKO
  // ═══════════════════════════════════════════════════════════════
  'shikko': '/images/techniques/shikko.png',
  
  // ═══════════════════════════════════════════════════════════════
  // SUWARI WAZA (Techniques à genoux)
  // ═══════════════════════════════════════════════════════════════
  'suwari_waza_ikkyo': '/images/techniques/suwari-waza-ikkyo.png',
  'suwari_waza_nikyo': '/images/techniques/suwari-waza-nikkyo.png',
  'suwari_waza_irimi': '/images/techniques/suwari-waza-irimi-nage.png',
  
  // ═══════════════════════════════════════════════════════════════
  // PROJECTIONS AVANCÉES
  // ═══════════════════════════════════════════════════════════════
  'tenchi_nage': '/images/techniques/tenchi-nage.png',
  'koshi_nage': '/images/techniques/koshi-nage.png',
  'aiki_otoshi': '/images/techniques/aiki-otoshi.png',
  'sumi_otoshi': '/images/techniques/sumi-otoshi.png',
  
  // ═══════════════════════════════════════════════════════════════
  // ARMES (Bukiwaza)
  // ═══════════════════════════════════════════════════════════════
  // Jo (Bâton)
  'jo_suburi': '/images/techniques/jo-suburi.png',
  'jo_awase': '/images/techniques/jo-suburi.png',
  'jo_kata': '/images/techniques/jo-suburi.png',
  'jo_dori': '/images/techniques/jo-suburi.png',
  
  // Bokken (Sabre)
  'bokken_suburi': '/images/techniques/bokken-suburi.png',
  'bokken_awase': '/images/techniques/bokken-suburi.png',
  'ken_tai_jo': '/images/techniques/bokken-suburi.png',
  'kumitachi': '/images/techniques/bokken-suburi.png',
  
  // Tanto (Couteau)
  'tanto_dori': '/images/techniques/tanto-dori.png',
  'tanto_tsuki': '/images/techniques/tanto-dori.png',
  'tanto_yokomen': '/images/techniques/tanto-dori.png',
  
  // ═══════════════════════════════════════════════════════════════
  // TRAVAIL LIBRE
  // ═══════════════════════════════════════════════════════════════
  'jiyu_waza': '/images/techniques/jiyu-waza.png',
  'randori': '/images/techniques/jiyu-waza-2.png',
  
  // ═══════════════════════════════════════════════════════════════
  // AUTRES
  // ═══════════════════════════════════════════════════════════════
  'ushiro_kubi_shime': '/images/techniques/ushiro-kubi-shime.png',
  'tsuki': '/images/techniques/tsuki.png',
};

// Configuration des ceintures
const BELT_CONFIG: Record<string, { label: string; color: string; image: string; description: string }> = {
  '6e_kyu': { label: '6e Kyu', color: '#FFFFFF', image: '/images/belts/6e-kyu-white.png', description: 'Ceinture blanche' },
  '5e_kyu': { label: '5e Kyu', color: '#EAB308', image: '/images/belts/5e-kyu-yellow.png', description: 'Ceinture jaune' },
  '4e_kyu': { label: '4e Kyu', color: '#F97316', image: '/images/belts/4e-kyu-orange.png', description: 'Ceinture orange' },
  '3e_kyu': { label: '3e Kyu', color: '#22C55E', image: '/images/belts/3e-kyu-green.png', description: 'Ceinture verte' },
  '2e_kyu': { label: '2e Kyu', color: '#3B82F6', image: '/images/belts/2e-kyu-blue.png', description: 'Ceinture bleue' },
  '1er_kyu': { label: '1er Kyu', color: '#92400E', image: '/images/belts/1er-kyu-brown.png', description: 'Ceinture marron' },
};

// Niveaux de maîtrise (statuts existants)
const MASTERY_LEVELS = [
  { id: 'all', label: 'Tous', color: 'text-white' },
  { id: 'not_started', label: 'À découvrir', color: 'text-slate-400' },
  { id: 'learning', label: "J'apprends", color: 'text-amber-400' },
  { id: 'practiced', label: 'Je pratique', color: 'text-cyan-400' },
  { id: 'mastered', label: 'Maîtrisé', color: 'text-emerald-400' }
];

// Mapping catégories vers familles françaises
const CATEGORY_LABELS: Record<string, { label: string; description: string }> = {
  'Ukemi': { label: 'Ukemi — Chutes', description: 'Les techniques de chute' },
  'Tai Sabaki': { label: 'Tai Sabaki — Déplacements', description: 'Les déplacements fondamentaux' },
  'Techniques de base': { label: 'Techniques de base', description: 'Les immobilisations et projections' },
  'Postures': { label: 'Postures', description: 'Les positions fondamentales' },
  'Atemi': { label: 'Attaques — Frappes', description: 'Les frappes et attaques' },
  'Buki Waza (Armes)': { label: 'Buki Waza — Armes', description: 'Techniques avec Jo, Bokken et Tanto' },
  'Jo (Bâton)': { label: 'Jo — Bâton', description: 'Techniques au bâton de 128 cm' },
  'Bokken (Sabre)': { label: 'Bokken — Sabre', description: 'Techniques au sabre en bois' },
  'Tanto (Couteau)': { label: 'Tanto — Couteau', description: 'Défenses contre couteau' },
  'Ushiro Waza (Attaques arrière)': { label: 'Ushiro Waza — Attaques arrière', description: 'Défenses contre attaques par derrière' },
  'Hanmi Handachi': { label: 'Hanmi Handachi', description: 'Techniques avec Tori à genoux' },
  'Kokyu Nage': { label: 'Kokyu Nage — Projections respiratoires', description: 'Projections utilisant le souffle' },
  'Kaiten Nage': { label: 'Kaiten Nage — Projections rotatives', description: 'Projections en rotation' },
  'Techniques avancées': { label: 'Techniques avancées', description: 'Techniques de niveau supérieur' },
  'Jiyu Waza': { label: 'Jiyu Waza — Travail libre', description: 'Applications libres' },
};

export default function TechniquesPage() {
  const params = useParams();
  const locale = params.locale as string || 'fr';
  const sport = params.sport as string || 'aikido';
  
  // État utilisateur
  const userCurrentKyu = '6e_kyu';
  const [selectedKyu, setSelectedKyu] = useState<string>(userCurrentKyu);
  const [searchQuery, setSearchQuery] = useState('');
  const [masteryFilter, setMasteryFilter] = useState<string>('all');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showAllTechniques, setShowAllTechniques] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState<ExtendedTechnique | null>(null);
  
  // Données persistées
  const [masteryLevels, setMasteryLevels] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wayofdojo_mastery');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // Données
  const currentKyuData = TECHNIQUES_BY_KYU[selectedKyu];
  const techniques = useMemo(() => getTechniquesByKyu(selectedKyu), [selectedKyu]);
  const beltConfig = BELT_CONFIG[selectedKyu];

  // Grouper par catégorie
  const techniquesByCategory = useMemo(() => {
    const grouped: Record<string, ExtendedTechnique[]> = {};
    techniques.forEach(t => {
      const cat = t.category || 'Autres';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(t);
    });
    return grouped;
  }, [techniques]);

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

  // Statistiques
  const stats = useMemo(() => {
    const total = techniques.length;
    const mastered = techniques.filter(t => masteryLevels[t.id] === 'mastered').length;
    const practiced = techniques.filter(t => masteryLevels[t.id] === 'practiced').length;
    const learning = techniques.filter(t => masteryLevels[t.id] === 'learning').length;
    return { total, mastered, practiced, learning };
  }, [techniques, masteryLevels]);

  // Techniques à travailler (prioritaires, max 3)
  const techniquesToWork = useMemo(() => {
    return techniques
      .filter(t => masteryLevels[t.id] !== 'mastered')
      .slice(0, 3);
  }, [techniques, masteryLevels]);

  // Handlers
  const handleMasteryChange = (techniqueId: string, level: string) => {
    const newLevels = { ...masteryLevels, [techniqueId]: level };
    setMasteryLevels(newLevels);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wayofdojo_mastery', JSON.stringify(newLevels));
    }
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(prev => prev === categoryName ? null : categoryName);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wayofdojo_token');
      window.location.href = `/${locale}`;
    }
  };

  const getMasteryBadge = (techniqueId: string) => {
    const level = masteryLevels[techniqueId] || 'not_started';
    return MASTERY_LEVELS.find(l => l.id === level);
  };

  const getMasteryBadgeStyle = (level: string) => {
    switch (level) {
      case 'mastered': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'practiced': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'learning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-700/50 text-slate-400 border-slate-600/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#06101f]">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <AdultSidebar locale={locale} sport={sport} onLogout={handleLogout} />
      </div>

      {/* Header */}
      <AdultHeader locale={locale} sport={sport} userName="Pratiquant" notificationCount={0} showMenuButton={true} />

      {/* Contenu principal */}
      <div className="lg:ml-[260px] pt-[60px]">
        <div className="p-4 lg:p-6 max-w-5xl mx-auto">
          
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
              <p className="text-slate-500 text-xs mt-1">Retrouvez les techniques de votre niveau et suivez votre progression.</p>
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
              2. CARTE "MON NIVEAU ACTUEL"
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0d1628] rounded-2xl p-5 border border-slate-800 mb-6"
          >
            <div className="flex items-center gap-5">
              {/* Image ceinture discrète */}
              <div className="shrink-0 relative w-16 h-20">
                <Image src={beltConfig.image} alt={beltConfig.label} fill className="object-contain opacity-90" />
              </div>
              
              {/* Infos grade */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white mb-0.5">
                  {currentKyuData.name} — {currentKyuData.belt}
                </h2>
                <p className="text-slate-400 text-sm mb-3">{currentKyuData.description}</p>
                
                {/* Barre de progression */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.total > 0 ? (stats.mastered / stats.total) * 100 : 0}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                    />
                  </div>
                  <span className="text-orange-400 font-semibold text-sm whitespace-nowrap">
                    {stats.mastered} / {stats.total} maîtrisées
                  </span>
                </div>
              </div>
            </div>

            {/* Sélecteur horizontal de ceintures */}
            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-800 overflow-x-auto pb-1 scrollbar-hide">
              {KYU_ORDER.map((kyu) => {
                const config = BELT_CONFIG[kyu];
                const isActive = selectedKyu === kyu;
                const isUserKyu = kyu === userCurrentKyu;
                
                return (
                  <button
                    key={kyu}
                    onClick={() => setSelectedKyu(kyu)}
                    data-testid={`belt-selector-${kyu}`}
                    className={`
                      relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap
                      ${isActive 
                        ? 'bg-orange-500/20 ring-2 ring-orange-500 text-orange-400' 
                        : 'bg-slate-800/50 hover:bg-slate-700/60 text-slate-400'
                      }
                    `}
                  >
                    <div className="relative w-6 h-8 shrink-0">
                      <Image src={config.image} alt={config.label} fill className="object-contain" />
                    </div>
                    <span className={`text-xs font-medium ${isActive ? 'text-orange-400' : 'text-slate-400'}`}>
                      {config.label}
                    </span>
                    {isUserKyu && !isActive && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════
              3. BARRE D'ACTIONS ET RECHERCHE
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            {/* Ligne principale */}
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              {/* Recherche */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Rechercher une technique..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="technique-search"
                  className="w-full pl-11 pr-4 py-2.5 bg-[#0d1628] border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              
              {/* Bouton voir toutes */}
              <Button
                onClick={() => setShowAllTechniques(!showAllTechniques)}
                variant="outline"
                size="sm"
                data-testid="view-all-btn"
                className={`border-slate-700 ${showAllTechniques ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showAllTechniques ? 'Vue par famille' : 'Voir toutes'}
              </Button>
            </div>

            {/* Filtres par statut */}
            <div className="flex flex-wrap gap-2">
              {MASTERY_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setMasteryFilter(level.id)}
                  data-testid={`filter-${level.id}`}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${masteryFilter === level.id
                      ? 'bg-cyan-600 text-white'
                      : 'bg-[#0d1628] text-slate-400 border border-slate-700 hover:border-slate-600'
                    }
                  `}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════
              4. BLOC "À TRAVAILLER MAINTENANT"
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-400" />
                À travailler maintenant
              </h2>
              <p className="text-slate-500 text-xs mt-1">Les bases utiles pour progresser à votre niveau.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {techniquesToWork.map((technique, index) => {
                const mastery = getMasteryBadge(technique.id);
                const hasImage = TECHNIQUE_IMAGES[technique.id];
                
                return (
                  <motion.div
                    key={technique.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="bg-[#0d1628] rounded-xl border border-slate-800 overflow-hidden hover:border-cyan-500/30 transition-all group"
                  >
                    {/* Image ou fond */}
                    <div className="relative h-32 bg-gradient-to-br from-slate-800 to-slate-900">
                      {hasImage ? (
                        <Image
                          src={hasImage}
                          alt={technique.name}
                          fill
                          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-slate-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1628] via-transparent to-transparent" />
                    </div>
                    
                    {/* Contenu */}
                    <div className="p-4">
                      <h3 className="font-bold text-white mb-1">{technique.name}</h3>
                      <p className="text-slate-400 text-sm mb-2">{technique.description}</p>
                      <p className="text-slate-500 text-xs mb-3">{technique.category} · {beltConfig.label}</p>
                      
                      {/* Badge statut */}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded border ${getMasteryBadgeStyle(mastery?.id || 'not_started')}`}>
                          {mastery?.label}
                        </span>
                        <button
                          onClick={() => setSelectedTechnique(technique)}
                          data-testid={`view-technique-${technique.id}`}
                          className="text-cyan-400 text-xs font-medium hover:text-cyan-300 flex items-center gap-1"
                        >
                          Voir la technique
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════
              5. BLOC "MA PRATIQUE"
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-[#0d1628] rounded-xl p-4 border border-slate-800 mb-6"
          >
            <h3 className="text-sm font-semibold text-white mb-3">Ma pratique</h3>
            <div className="flex items-center gap-6 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-400">{stats.mastered}</p>
                  <p className="text-slate-500 text-[10px]">Maîtrisées</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <BookMarked className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-cyan-400">{stats.practiced}</p>
                  <p className="text-slate-500 text-[10px]">Pratiquées</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-400">{stats.learning}</p>
                  <p className="text-slate-500 text-[10px]">En cours</p>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-xs">Continuez à pratiquer régulièrement au dojo.</p>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════
              6. BLOC "EXPLORER LES TECHNIQUES"
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white">Explorer les techniques</h2>
              <p className="text-slate-500 text-xs mt-1">Parcourez les techniques de votre niveau par famille.</p>
            </div>

            {showAllTechniques ? (
              /* Vue toutes les techniques */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTechniques.map((technique) => {
                  const mastery = getMasteryBadge(technique.id);
                  const hasImage = TECHNIQUE_IMAGES[technique.id];
                  
                  return (
                    <div
                      key={technique.id}
                      className="bg-[#0d1628] rounded-xl border border-slate-800 overflow-hidden hover:border-cyan-500/30 transition-all cursor-pointer"
                      onClick={() => setSelectedTechnique(technique)}
                    >
                      <div className="relative h-24 bg-gradient-to-br from-slate-800 to-slate-900">
                        {hasImage ? (
                          <Image src={hasImage} alt={technique.name} fill className="object-cover opacity-70" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-slate-700" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1628] via-transparent to-transparent" />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-white text-sm">{technique.name}</h3>
                        <p className="text-slate-400 text-xs mb-2">{technique.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-[10px]">{technique.category} · {beltConfig.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getMasteryBadgeStyle(mastery?.id || 'not_started')}`}>
                            {mastery?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Vue par famille (accordéon) */
              <div className="space-y-3">
                {Object.entries(techniquesByCategory).map(([category, categoryTechniques]) => {
                  const isExpanded = expandedCategory === category;
                  const categoryInfo = CATEGORY_LABELS[category] || { label: category, description: '' };
                  const masteredInCategory = categoryTechniques.filter(t => masteryLevels[t.id] === 'mastered').length;
                  
                  // Filtrer selon le filtre actif
                  const filteredCategoryTechniques = masteryFilter === 'all' 
                    ? categoryTechniques 
                    : categoryTechniques.filter(t => (masteryLevels[t.id] || 'not_started') === masteryFilter);
                  
                  if (filteredCategoryTechniques.length === 0 && masteryFilter !== 'all') return null;
                  
                  return (
                    <div key={category} className="bg-[#0d1628] rounded-xl border border-slate-800 overflow-hidden">
                      {/* En-tête accordéon */}
                      <button
                        onClick={() => toggleCategory(category)}
                        data-testid={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
                        className="w-full p-4 flex items-center gap-4 hover:bg-slate-800/30 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-white">{categoryInfo.label}</h3>
                          <p className="text-slate-500 text-xs">{categoryTechniques.length} techniques · {masteredInCategory} / {categoryTechniques.length} maîtrisées</p>
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
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {(masteryFilter === 'all' ? categoryTechniques : filteredCategoryTechniques).map((technique) => {
                                const mastery = getMasteryBadge(technique.id);
                                const hasImage = TECHNIQUE_IMAGES[technique.id];
                                
                                return (
                                  <div
                                    key={technique.id}
                                    onClick={() => setSelectedTechnique(technique)}
                                    className="bg-slate-800/50 rounded-lg p-3 hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-cyan-500/20"
                                  >
                                    {/* Mini image */}
                                    {hasImage && (
                                      <div className="relative h-16 rounded-lg overflow-hidden mb-2">
                                        <Image src={hasImage} alt={technique.name} fill className="object-cover" />
                                      </div>
                                    )}
                                    <h4 className="font-medium text-white text-sm">{technique.name}</h4>
                                    <p className="text-slate-400 text-xs mb-2">{technique.description}</p>
                                    <div className="flex items-center justify-between">
                                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getMasteryBadgeStyle(mastery?.id || 'not_started')}`}>
                                        {mastery?.label}
                                      </span>
                                      <span className="text-cyan-400 text-[10px] flex items-center gap-0.5">
                                        Voir <ChevronRight className="w-3 h-3" />
                                      </span>
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
              </div>
            )}
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════
              7. CONSEIL COMPACT DE TANAKA
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-[#0d1628] rounded-xl p-4 border border-slate-800 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
              <span className="text-2xl">🥋</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white mb-1">Conseil de Maître Tanaka</p>
              <p className="text-slate-400 text-sm italic">
                &quot;Commencez par les chutes : elles permettent de pratiquer avec confiance et sécurité.&quot;
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL DÉTAIL TECHNIQUE
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedTechnique && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setSelectedTechnique(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0d1628] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header modal */}
              <div className="relative">
                {TECHNIQUE_IMAGES[selectedTechnique.id] ? (
                  <div className="relative h-48">
                    <Image
                      src={TECHNIQUE_IMAGES[selectedTechnique.id]}
                      alt={selectedTechnique.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1628] via-[#0d1628]/50 to-transparent" />
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-br from-cyan-900/20 to-slate-900" />
                )}
                <button
                  onClick={() => setSelectedTechnique(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Contenu modal */}
              <div className="p-6 overflow-y-auto max-h-[50vh]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-cyan-400 text-xs font-medium uppercase tracking-wider">{selectedTechnique.category}</span>
                    <h2 className="text-2xl font-bold text-white mt-1">{selectedTechnique.name}</h2>
                    <p className="text-slate-400">{selectedTechnique.description}</p>
                    <p className="text-slate-500 text-sm mt-1">{beltConfig.label} · {beltConfig.description}</p>
                  </div>
                </div>

                {/* Statut de maîtrise */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-white mb-2">Mon statut</p>
                  <div className="flex flex-wrap gap-2">
                    {MASTERY_LEVELS.filter(l => l.id !== 'all').map((level) => {
                      const currentLevel = masteryLevels[selectedTechnique.id] || 'not_started';
                      const isActive = currentLevel === level.id;
                      
                      return (
                        <button
                          key={level.id}
                          onClick={() => handleMasteryChange(selectedTechnique.id, level.id)}
                          className={`
                            px-3 py-2 rounded-lg text-sm font-medium transition-all border
                            ${isActive 
                              ? getMasteryBadgeStyle(level.id) 
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                            }
                          `}
                        >
                          {level.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Points clés */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-white mb-3">Points clés</p>
                  <div className="space-y-2">
                    {[
                      "Gardez votre centre de gravité bas",
                      "Respirez calmement pendant l'exécution",
                      "Maintenez le contact visuel avec votre partenaire"
                    ].map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                        <p className="text-slate-300 text-sm">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Illustration complète si disponible */}
                {TECHNIQUE_IMAGES[selectedTechnique.id] && (
                  <div>
                    <p className="text-sm font-medium text-white mb-3">Illustration</p>
                    <div className="relative rounded-xl overflow-hidden bg-[#06101f]">
                      <Image
                        src={TECHNIQUE_IMAGES[selectedTechnique.id]}
                        alt={`${selectedTechnique.name} - Illustration`}
                        width={800}
                        height={600}
                        className="w-full h-auto rounded-xl"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
