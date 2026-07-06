'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, MapPin, User, Clock, ExternalLink, Search, 
  Filter, ChevronDown, RefreshCw, Star, Euro, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdultSidebar } from '@/components/adult-layout/AdultSidebar';
import { AdultHeader } from '@/components/adult-layout/AdultHeader';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PAGE STAGES D'AÏKIDO EN FRANCE
 * Affiche les stages à venir avec dates, lieux et enseignants
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface Stage {
  id: string;
  title: string;
  teacher: string;
  teacherGrade?: string;
  date: string;
  dateEnd?: string;
  location: string;
  city: string;
  region: string;
  description?: string;
  level?: string;
  price?: string;
  federation?: string;
  url?: string;
  isHighlight?: boolean;
}

// Données des stages (à mettre à jour régulièrement)
const STAGES_DATA: Stage[] = [
  {
    id: '1',
    title: 'Stage National FFAB',
    teacher: 'Christian Tissier',
    teacherGrade: '8e Dan',
    date: '2026-01-18',
    dateEnd: '2026-01-19',
    location: 'Palais des Sports',
    city: 'Paris',
    region: 'Île-de-France',
    description: 'Stage national ouvert à tous les pratiquants FFAB',
    level: 'Tous niveaux',
    price: '45€',
    federation: 'FFAB',
    url: 'https://www.ffabaikido.fr',
    isHighlight: true,
  },
  {
    id: '2',
    title: 'Stage Régional Aïkido',
    teacher: 'Bruno Gonzalez',
    teacherGrade: '7e Dan',
    date: '2026-01-25',
    location: 'Dojo Municipal',
    city: 'Lyon',
    region: 'Auvergne-Rhône-Alpes',
    description: 'Travail sur les fondamentaux et applications',
    level: 'À partir du 5e Kyu',
    price: '30€',
    federation: 'FFAAA',
  },
  {
    id: '3',
    title: 'Week-end Aïkido & Armes',
    teacher: 'Pascal Guillemin',
    teacherGrade: '6e Dan',
    date: '2026-02-01',
    dateEnd: '2026-02-02',
    location: 'Gymnase Jean Jaurès',
    city: 'Toulouse',
    region: 'Occitanie',
    description: 'Travail approfondi Jo et Bokken',
    level: 'À partir du 3e Kyu',
    price: '50€',
    federation: 'FFAB',
  },
  {
    id: '4',
    title: 'Stage de Printemps',
    teacher: 'Franck Noël',
    teacherGrade: '7e Dan',
    date: '2026-02-08',
    dateEnd: '2026-02-09',
    location: 'Complexe Sportif',
    city: 'Bordeaux',
    region: 'Nouvelle-Aquitaine',
    description: 'Stage ouvert, thème: Irimi et Awase',
    level: 'Tous niveaux',
    price: '40€',
    federation: 'FFAAA',
  },
  {
    id: '5',
    title: 'Stage International',
    teacher: 'Yasuno Masatoshi',
    teacherGrade: '8e Dan Aïkikaï',
    date: '2026-02-15',
    dateEnd: '2026-02-16',
    location: 'Halle des Sports',
    city: 'Strasbourg',
    region: 'Grand Est',
    description: 'Stage exceptionnel avec Maître Yasuno',
    level: 'À partir du 4e Kyu',
    price: '70€',
    federation: 'Aïkikaï',
    isHighlight: true,
  },
  {
    id: '6',
    title: 'Stage Technique Avancée',
    teacher: 'Marc Bachraty',
    teacherGrade: '6e Dan',
    date: '2026-02-22',
    location: 'Dojo Central',
    city: 'Marseille',
    region: 'Provence-Alpes-Côte d\'Azur',
    description: 'Kaeshi Waza et variations',
    level: 'À partir du 2e Kyu',
    price: '35€',
    federation: 'FFAB',
  },
  {
    id: '7',
    title: 'Stage Féminin National',
    teacher: 'Valérie Benedetti',
    teacherGrade: '5e Dan',
    date: '2026-03-01',
    location: 'Centre Sportif',
    city: 'Nantes',
    region: 'Pays de la Loire',
    description: 'Stage réservé aux pratiquantes',
    level: 'Tous niveaux',
    price: '25€',
    federation: 'FFAB',
  },
  {
    id: '8',
    title: 'Stage de Pâques',
    teacher: 'Luc Bouchareu',
    teacherGrade: '6e Dan',
    date: '2026-03-08',
    dateEnd: '2026-03-09',
    location: 'Palais des Sports',
    city: 'Lille',
    region: 'Hauts-de-France',
    description: 'Travail Tachi Waza et Suwari Waza',
    level: 'Tous niveaux',
    price: '45€',
    federation: 'FFAAA',
  },
  {
    id: '9',
    title: 'Stage Préparation Grades',
    teacher: 'Philippe Gouttard',
    teacherGrade: '6e Dan',
    date: '2026-03-15',
    location: 'Dojo Municipal',
    city: 'Rennes',
    region: 'Bretagne',
    description: 'Préparation aux passages de grades Kyu et Dan',
    level: 'Candidats aux grades',
    price: '30€',
    federation: 'FFAB',
  },
  {
    id: '10',
    title: 'Stage Été International',
    teacher: 'Miyamoto Tsuruzo',
    teacherGrade: '7e Dan Hombu',
    date: '2026-07-20',
    dateEnd: '2026-07-26',
    location: 'Centre de vacances',
    city: 'Lesneven',
    region: 'Bretagne',
    description: 'Stage d\'été avec hébergement possible',
    level: 'Tous niveaux',
    price: '180€ (stage seul)',
    federation: 'FFAB',
    isHighlight: true,
  },
];

// Régions de France
const REGIONS = [
  'Toutes les régions',
  'Île-de-France',
  'Auvergne-Rhône-Alpes',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Hauts-de-France',
  'Provence-Alpes-Côte d\'Azur',
  'Grand Est',
  'Pays de la Loire',
  'Bretagne',
  'Normandie',
  'Bourgogne-Franche-Comté',
  'Centre-Val de Loire',
  'Corse',
];

const FEDERATIONS = ['Toutes', 'FFAB', 'FFAAA', 'Aïkikaï'];

export default function StagesFrancePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'fr';
  const sport = (params?.sport as string) || 'aikido';
  
  const [stages, setStages] = useState<Stage[]>(STAGES_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Toutes les régions');
  const [selectedFederation, setSelectedFederation] = useState('Toutes');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Filtrer les stages
  const filteredStages = stages.filter(stage => {
    const matchesSearch = searchQuery === '' || 
      stage.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stage.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stage.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = selectedRegion === 'Toutes les régions' || 
      stage.region === selectedRegion;
    
    const matchesFederation = selectedFederation === 'Toutes' || 
      stage.federation === selectedFederation;
    
    // Ne montrer que les stages à venir
    const stageDate = new Date(stage.date);
    const isUpcoming = stageDate >= new Date();
    
    return matchesSearch && matchesRegion && matchesFederation && isUpcoming;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Formater la date
  const formatDate = (dateStr: string, dateEndStr?: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    
    if (dateEndStr) {
      const dateEnd = new Date(dateEndStr);
      if (date.getMonth() === dateEnd.getMonth()) {
        return `${date.getDate()} - ${dateEnd.toLocaleDateString('fr-FR', options)}`;
      }
      return `${date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} - ${dateEnd.toLocaleDateString('fr-FR', options)}`;
    }
    
    return date.toLocaleDateString('fr-FR', options);
  };

  // Simuler une mise à jour
  const refreshStages = async () => {
    setIsLoading(true);
    // Simulation d'une requête API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wayofdojo_token');
      window.location.href = `/${locale}`;
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
          
          {/* Header de page */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Calendar className="w-7 h-7 text-orange-400" />
                Stages d'Aïkido en France
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Retrouvez les prochains stages et séminaires près de chez vous
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={refreshStages}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>
          </div>

          {/* Info mise à jour */}
          <div className="bg-[#0d1628] rounded-xl p-4 border border-slate-800 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-white font-medium">{filteredStages.length} stages à venir</p>
                <p className="text-slate-500 text-xs">
                  Dernière mise à jour : {lastUpdate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <p className="text-slate-500 text-xs hidden sm:block">
              Sources : FFAB, FFAAA, Aïkikaï de France
            </p>
          </div>

          {/* Filtres */}
          <div className="bg-[#0d1628] rounded-xl p-4 border border-slate-800 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Recherche */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Rechercher un stage, enseignant, ville..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              {/* Filtre région */}
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {REGIONS.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              
              {/* Filtre fédération */}
              <select
                value={selectedFederation}
                onChange={(e) => setSelectedFederation(e.target.value)}
                className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {FEDERATIONS.map(fed => (
                  <option key={fed} value={fed}>{fed}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Liste des stages */}
          <div className="space-y-4">
            {filteredStages.length === 0 ? (
              <div className="bg-[#0d1628] rounded-xl p-8 border border-slate-800 text-center">
                <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Aucun stage trouvé avec ces critères</p>
                <p className="text-slate-500 text-sm mt-1">Essayez de modifier vos filtres</p>
              </div>
            ) : (
              filteredStages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-[#0d1628] rounded-xl border overflow-hidden ${
                    stage.isHighlight ? 'border-orange-500/50' : 'border-slate-800'
                  } hover:border-orange-500/30 transition-colors`}
                >
                  {stage.isHighlight && (
                    <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-1 flex items-center gap-2">
                      <Star className="w-4 h-4 text-white" />
                      <span className="text-white text-xs font-semibold">Stage à ne pas manquer</span>
                    </div>
                  )}
                  
                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Date */}
                      <div className="lg:w-32 shrink-0">
                        <div className="bg-orange-500/10 rounded-lg p-3 text-center">
                          <p className="text-orange-400 text-2xl font-bold">
                            {new Date(stage.date).getDate()}
                          </p>
                          <p className="text-orange-400 text-sm capitalize">
                            {new Date(stage.date).toLocaleDateString('fr-FR', { month: 'short' })}
                          </p>
                          <p className="text-slate-500 text-xs">
                            {new Date(stage.date).getFullYear()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Contenu principal */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white mb-1">{stage.title}</h3>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mb-3">
                          <span className="flex items-center gap-1.5 text-amber-400">
                            <User className="w-4 h-4" />
                            {stage.teacher}
                            {stage.teacherGrade && (
                              <span className="text-slate-500">({stage.teacherGrade})</span>
                            )}
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <MapPin className="w-4 h-4" />
                            {stage.city} ({stage.region})
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="w-4 h-4" />
                            {formatDate(stage.date, stage.dateEnd)}
                          </span>
                        </div>
                        
                        {stage.description && (
                          <p className="text-slate-400 text-sm mb-3">{stage.description}</p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-2">
                          {stage.level && (
                            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-lg border border-cyan-500/30">
                              <Users className="w-3 h-3 inline mr-1" />
                              {stage.level}
                            </span>
                          )}
                          {stage.price && (
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg border border-emerald-500/30">
                              <Euro className="w-3 h-3 inline mr-1" />
                              {stage.price}
                            </span>
                          )}
                          {stage.federation && (
                            <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-lg">
                              {stage.federation}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex lg:flex-col gap-2 shrink-0">
                        {stage.url && (
                          <a
                            href={stage.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Plus d'infos
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Section sources */}
          <div className="mt-8 bg-[#0d1628] rounded-xl p-5 border border-slate-800">
            <h3 className="text-white font-semibold mb-3">Sources des informations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a href="https://www.ffabaikido.fr" target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-sm">FFAB</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">FFAB</p>
                  <p className="text-slate-500 text-xs">Fédération Française d'Aïkido et de Budo</p>
                </div>
              </a>
              <a href="https://www.aikido.com.fr" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 font-bold text-xs">FFAAA</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">FFAAA</p>
                  <p className="text-slate-500 text-xs">Fédération Française d'Aïkido Aïkibudo</p>
                </div>
              </a>
              <a href="https://www.aikikai.fr" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <span className="text-amber-400 font-bold text-xs">合</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Aïkikaï de France</p>
                  <p className="text-slate-500 text-xs">Association culturelle</p>
                </div>
              </a>
            </div>
            <p className="text-slate-500 text-xs mt-4">
              Les informations sont collectées depuis les sites officiels des fédérations. 
              Vérifiez toujours les détails sur le site source avant de vous inscrire.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
