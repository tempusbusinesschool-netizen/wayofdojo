'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Users, Filter, Search,
  ChevronLeft, ChevronRight, X, Star, User,
  CalendarDays, Grid3X3, List, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MaitreTanaka from '@/components/MaitreTanaka';

// Types
interface Stage {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  city: string;
  country: string;
  sensei: string;
  senseiTitle?: string;
  senseiImage?: string;
  level: 'tous' | 'debutant' | 'intermediaire' | 'avance';
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  currency: string;
  image?: string;
  tags: string[];
  isFeatured?: boolean;
}

// Données de démonstration
const MOCK_STAGES: Stage[] = [
  {
    id: '1',
    title: 'Stage National Printemps',
    description: 'Grand stage national sous la direction de Maître Yamada. Techniques fondamentales et avancées pour tous niveaux.',
    date: '2025-03-15',
    endDate: '2025-03-16',
    location: 'Gymnase Municipal de Paris',
    city: 'Paris',
    country: 'France',
    sensei: 'Maître Yamada',
    senseiTitle: '7e Dan Aikikai',
    level: 'tous',
    maxParticipants: 150,
    currentParticipants: 87,
    price: 45,
    currency: 'EUR',
    tags: ['national', 'fondamentaux', 'armes'],
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Stage Armes - Jo et Bokken',
    description: 'Approfondissement des techniques au Jo et au Bokken. Travail sur les kata et les applications.',
    date: '2025-02-22',
    location: 'Dojo Central Lyon',
    city: 'Lyon',
    country: 'France',
    sensei: 'Sensei Martin',
    senseiTitle: '5e Dan',
    level: 'intermediaire',
    maxParticipants: 40,
    currentParticipants: 28,
    price: 30,
    currency: 'EUR',
    tags: ['armes', 'jo', 'bokken'],
  },
  {
    id: '3',
    title: 'Stage Débutants - Premiers Pas',
    description: 'Stage d&apos;initiation pour les nouveaux pratiquants. Découverte des bases de l&apos;Aïkido.',
    date: '2025-02-08',
    location: 'Dojo du Soleil Levant',
    city: 'Marseille',
    country: 'France',
    sensei: 'Sensei Dubois',
    senseiTitle: '4e Dan',
    level: 'debutant',
    maxParticipants: 25,
    currentParticipants: 12,
    price: 20,
    currency: 'EUR',
    tags: ['initiation', 'debutant', 'bases'],
  },
  {
    id: '4',
    title: 'Stage International d\'Été',
    description: 'Stage international annuel avec des maîtres du monde entier. 5 jours intensifs de pratique.',
    date: '2025-07-14',
    endDate: '2025-07-19',
    location: 'Centre Sportif International',
    city: 'Nice',
    country: 'France',
    sensei: 'Maîtres Internationaux',
    senseiTitle: 'Multi-experts',
    level: 'tous',
    maxParticipants: 300,
    currentParticipants: 156,
    price: 180,
    currency: 'EUR',
    tags: ['international', 'été', 'intensif'],
    isFeatured: true,
  },
  {
    id: '5',
    title: 'Stage Technique Avancée',
    description: 'Techniques avancées et préparation aux grades Dan. Réservé aux 1er Kyu minimum.',
    date: '2025-04-05',
    endDate: '2025-04-06',
    location: 'Dojo Traditionnel',
    city: 'Bordeaux',
    country: 'France',
    sensei: 'Maître Tanaka',
    senseiTitle: '6e Dan Shihan',
    level: 'avance',
    maxParticipants: 30,
    currentParticipants: 22,
    price: 60,
    currency: 'EUR',
    tags: ['avance', 'dan', 'preparation'],
  },
  {
    id: '6',
    title: 'Stage Jeunes Ninjas',
    description: 'Stage ludique pour les enfants de 6 à 14 ans. Jeux, techniques adaptées et certificats.',
    date: '2025-02-15',
    location: 'Complexe Sportif des Enfants',
    city: 'Toulouse',
    country: 'France',
    sensei: 'Sensei Sophie',
    senseiTitle: '3e Dan',
    level: 'debutant',
    maxParticipants: 50,
    currentParticipants: 35,
    price: 15,
    currency: 'EUR',
    tags: ['enfants', 'ludique', 'jeunes'],
  },
];

type ViewMode = 'grid' | 'list' | 'calendar';
type LevelFilter = 'tous' | 'debutant' | 'intermediaire' | 'avance';

export default function StagesPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const [stages] = useState<Stage[]>(MOCK_STAGES);
  const [filteredStages, setFilteredStages] = useState<Stage[]>(MOCK_STAGES);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('tous');
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const user = localStorage.getItem('wayofdojo_user');
    setIsLoggedIn(!!user);
  }, []);

  useEffect(() => {
    let result = stages;

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        stage =>
          stage.title.toLowerCase().includes(query) ||
          stage.city.toLowerCase().includes(query) ||
          stage.sensei.toLowerCase().includes(query)
      );
    }

    // Filtre par niveau
    if (levelFilter !== 'tous') {
      result = result.filter(stage => stage.level === levelFilter || stage.level === 'tous');
    }

    setFilteredStages(result);
  }, [stages, searchQuery, levelFilter]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      tous: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      debutant: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      intermediaire: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      avance: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    };
    return colors[level] || colors.tous;
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      tous: 'Tous niveaux',
      debutant: 'Débutant',
      intermediaire: 'Intermédiaire',
      avance: 'Avancé',
    };
    return labels[level] || level;
  };

  const getAvailabilityColor = (current: number, max: number) => {
    const ratio = current / max;
    if (ratio >= 0.9) return 'text-red-400';
    if (ratio >= 0.7) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const handleRegister = (stage: Stage) => {
    if (!isLoggedIn) {
      router.push(`/${locale}/${sport}/login?redirect=stages`);
      return;
    }
    // TODO: Implémenter l'inscription
    alert(`Inscription au stage "${stage.title}" - Fonctionnalité à venir !`);
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];
    
    // Ajouter les jours du mois précédent pour compléter la semaine
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = startPadding; i > 0; i--) {
      const d = new Date(year, month, 1 - i);
      days.push(d);
    }
    
    // Jours du mois actuel
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getStagesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredStages.filter(stage => {
      const stageDate = stage.date;
      const stageEndDate = stage.endDate || stage.date;
      return dateStr >= stageDate && dateStr <= stageEndDate;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-cyan-900/80 border-b border-cyan-500/20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/${locale}/${sport}/dojo`} className="flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30"
            >
              <Calendar className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <span className="text-lg font-bold text-white">Stages & Séminaires</span>
              <p className="text-xs text-cyan-300">Calendrier des événements</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link href={`/${locale}/${sport}/dojo`}>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Retour au Dojo
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            📅 Stages & Séminaires
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Découvrez les prochains stages d&apos;Aïkido et inscrivez-vous pour progresser avec les meilleurs senseis !
          </p>
        </motion.div>

        {/* Search & Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher un stage, une ville, un sensei..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900 border-slate-600 text-white"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-slate-900 rounded-xl p-1">
              {[
                { mode: 'grid' as ViewMode, icon: Grid3X3, label: 'Grille' },
                { mode: 'list' as ViewMode, icon: List, label: 'Liste' },
                { mode: 'calendar' as ViewMode, icon: CalendarDays, label: 'Calendrier' },
              ].map(({ mode, icon: Icon, label }) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode(mode)}
                  className={viewMode === mode ? 'bg-cyan-600' : 'text-slate-400 hover:text-white'}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline ml-2">{label}</span>
                </Button>
              ))}
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`border-slate-600 ${showFilters ? 'bg-cyan-600 text-white' : 'text-slate-300'}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-slate-700">
                  <p className="text-slate-400 text-sm mb-3">Niveau</p>
                  <div className="flex flex-wrap gap-2">
                    {(['tous', 'debutant', 'intermediaire', 'avance'] as LevelFilter[]).map((level) => (
                      <Button
                        key={level}
                        variant={levelFilter === level ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLevelFilter(level)}
                        className={levelFilter === level ? 'bg-cyan-600' : 'border-slate-600 text-slate-300'}
                      >
                        {getLevelLabel(level)}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Featured Stages */}
        {filteredStages.some(s => s.isFeatured) && viewMode !== 'calendar' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Stages à la Une
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {filteredStages.filter(s => s.isFeatured).map((stage) => (
                <motion.div
                  key={stage.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedStage(stage)}
                  className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-2xl p-5 border border-amber-500/30 cursor-pointer hover:border-amber-400/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs text-amber-400 font-semibold">⭐ À la Une</span>
                      <h3 className="text-xl font-bold text-white mt-1">{stage.title}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(stage.level)}`}>
                      {getLevelLabel(stage.level)}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-4 line-clamp-2">{stage.description}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      {formatDate(stage.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      {stage.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4 text-violet-400" />
                      {stage.sensei}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredStages.filter(s => !s.isFeatured).map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => setSelectedStage(stage)}
                className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700 cursor-pointer hover:border-cyan-500/50 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(stage.level)}`}>
                    {getLevelLabel(stage.level)}
                  </span>
                  <span className="text-lg font-bold text-white">{stage.price}€</span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">{stage.title}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{stage.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    {formatDate(stage.date)}
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    {stage.city}
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="w-4 h-4 text-violet-400" />
                    {stage.sensei}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span className={getAvailabilityColor(stage.currentParticipants, stage.maxParticipants)}>
                      {stage.currentParticipants}/{stage.maxParticipants} inscrits
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {filteredStages.map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                onClick={() => setSelectedStage(stage)}
                className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 cursor-pointer hover:border-cyan-500/50 transition-all flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-7 h-7 text-cyan-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold truncate">{stage.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getLevelColor(stage.level)}`}>
                      {getLevelLabel(stage.level)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(stage.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {stage.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {stage.sensei}
                    </span>
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold text-white">{stage.price}€</p>
                  <p className={`text-sm ${getAvailabilityColor(stage.currentParticipants, stage.maxParticipants)}`}>
                    {stage.maxParticipants - stage.currentParticipants} places
                  </p>
                </div>
                
                <ChevronRight className="w-5 h-5 text-slate-500 flex-shrink-0" />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
          >
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="text-slate-300 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h3 className="text-xl font-bold text-white">
                {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </h3>
              <Button
                variant="ghost"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="text-slate-300 hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day Headers */}
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                <div key={day} className="text-center text-slate-400 text-sm font-semibold py-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {getDaysInMonth(currentMonth).map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();
                const dayStages = getStagesForDate(date);
                
                return (
                  <div
                    key={index}
                    className={`min-h-[80px] p-1 rounded-lg border transition-colors ${
                      isCurrentMonth 
                        ? isToday 
                          ? 'bg-cyan-600/20 border-cyan-500/50' 
                          : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                        : 'bg-slate-900/30 border-slate-800'
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${
                      isCurrentMonth ? (isToday ? 'text-cyan-400' : 'text-white') : 'text-slate-600'
                    }`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayStages.slice(0, 2).map((stage) => (
                        <div
                          key={stage.id}
                          onClick={() => setSelectedStage(stage)}
                          className="text-xs px-1.5 py-0.5 rounded bg-cyan-600/30 text-cyan-300 truncate cursor-pointer hover:bg-cyan-600/50"
                        >
                          {stage.title.substring(0, 15)}...
                        </div>
                      ))}
                      {dayStages.length > 2 && (
                        <div className="text-xs text-slate-400 text-center">
                          +{dayStages.length - 2}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredStages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Aucun stage trouvé</h3>
            <p className="text-slate-400">Modifiez vos critères de recherche</p>
          </motion.div>
        )}
      </main>

      {/* Stage Detail Modal */}
      <AnimatePresence>
        {selectedStage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setSelectedStage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
            >
              {/* Modal Header */}
              <div className="relative p-6 bg-gradient-to-br from-cyan-600/30 to-blue-600/30 border-b border-slate-700">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStage(null)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
                
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(selectedStage.level)}`}>
                  {getLevelLabel(selectedStage.level)}
                </span>
                <h2 className="text-2xl font-black text-white mt-3">{selectedStage.title}</h2>
                
                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                  <span className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    {formatDate(selectedStage.date)}
                    {selectedStage.endDate && ` - ${formatDate(selectedStage.endDate)}`}
                  </span>
                  <span className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    {selectedStage.city}
                  </span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <p className="text-slate-300 mb-6">{selectedStage.description}</p>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <p className="text-slate-400 text-sm mb-1">Sensei</p>
                    <p className="text-white font-bold">{selectedStage.sensei}</p>
                    {selectedStage.senseiTitle && (
                      <p className="text-cyan-400 text-sm">{selectedStage.senseiTitle}</p>
                    )}
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <p className="text-slate-400 text-sm mb-1">Lieu</p>
                    <p className="text-white font-bold">{selectedStage.location}</p>
                    <p className="text-emerald-400 text-sm">{selectedStage.city}, {selectedStage.country}</p>
                  </div>
                </div>

                {/* Price & Availability */}
                <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-xl p-4 border border-cyan-500/30 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Prix</p>
                      <p className="text-3xl font-black text-white">{selectedStage.price}€</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-sm">Places disponibles</p>
                      <p className={`text-xl font-bold ${getAvailabilityColor(selectedStage.currentParticipants, selectedStage.maxParticipants)}`}>
                        {selectedStage.maxParticipants - selectedStage.currentParticipants} / {selectedStage.maxParticipants}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                      style={{ width: `${(selectedStage.currentParticipants / selectedStage.maxParticipants) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedStage.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleRegister(selectedStage)}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-6 text-lg rounded-xl"
                    disabled={selectedStage.currentParticipants >= selectedStage.maxParticipants}
                  >
                    {selectedStage.currentParticipants >= selectedStage.maxParticipants 
                      ? 'Complet' 
                      : "S'inscrire"
                    }
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Maître Tanaka */}
      <MaitreTanaka 
        isJeuneNinja={false}
        messages={[
          "Les stages sont une excellente opportunité de progresser !",
          "Chaque rencontre avec un nouveau sensei enrichit ta pratique.",
          "N'hésite pas à sortir de ta zone de confort.",
        ]}
      />
    </div>
  );
}
