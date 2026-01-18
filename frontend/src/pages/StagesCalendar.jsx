/**
 * 📅 CALENDRIER DES STAGES FFAAA 2026
 * 
 * Calendrier complet des stages et séminaires d'Aïkido
 * sous l'égide de la FFAAA en France métropolitaine et à La Réunion
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, User, Clock, Award, ExternalLink,
  ChevronLeft, ChevronRight, Filter, Search, Building2,
  Star, Users, CalendarDays, GraduationCap, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Types de stages
const STAGE_TYPES = {
  module: { label: 'Stage Module', color: 'bg-cyan-500', textColor: 'text-cyan-400', icon: '📘' },
  jeunes: { label: 'Stage Jeunes', color: 'bg-amber-500', textColor: 'text-amber-400', icon: '🌟' },
  interfederal: { label: 'Interfédéral', color: 'bg-purple-500', textColor: 'text-purple-400', icon: '🤝' },
  preparation_dan: { label: 'Préparation Dan', color: 'bg-red-500', textColor: 'text-red-400', icon: '🎯' },
  examen: { label: 'Examen', color: 'bg-emerald-500', textColor: 'text-emerald-400', icon: '📜' },
  seminaire: { label: 'Séminaire CTN', color: 'bg-rose-500', textColor: 'text-rose-400', icon: '🏆' },
  ssbe: { label: 'Stage SSBE', color: 'bg-orange-500', textColor: 'text-orange-400', icon: '🥋' },
  ligue: { label: 'Stage de Ligue', color: 'bg-blue-500', textColor: 'text-blue-400', icon: '🏛️' },
  regional: { label: 'Stage Régional', color: 'bg-indigo-500', textColor: 'text-indigo-400', icon: '📍' }
};

// Régions
const REGIONS = {
  idf: { label: 'Île-de-France', emoji: '🗼' },
  bretagne: { label: 'Bretagne', emoji: '⚓' },
  grand_est: { label: 'Grand-Est', emoji: '🏰' },
  nouvelle_aquitaine: { label: 'Nouvelle-Aquitaine', emoji: '🍷' },
  pays_loire: { label: 'Pays de la Loire', emoji: '🌊' },
  occitanie: { label: 'Occitanie', emoji: '☀️' },
  reunion: { label: 'La Réunion', emoji: '🌴' }
};

// Données des stages FFAAA 2026
const STAGES_2026 = [
  // JANVIER 2026
  {
    id: '1',
    title: 'Stage Module',
    type: 'module',
    startDate: '2026-01-09',
    endDate: '2026-01-11',
    location: 'Rennes',
    region: 'bretagne',
    instructors: ['F. Si Moussa', 'L. Sanselme'],
    description: 'Stage module de 3 jours en Bretagne',
    validant: true,
    federation: 'FFAAA'
  },
  {
    id: '2',
    title: 'Stage Inter-Disciplines',
    type: 'interfederal',
    startDate: '2026-01-18',
    endDate: '2026-01-18',
    location: 'Île-de-France',
    region: 'idf',
    instructors: ['Plusieurs experts'],
    description: 'Stage inter-disciplines FFAAA',
    validant: true,
    federation: 'FFAAA'
  },
  {
    id: '3',
    title: 'Stage Fédéral Jeunes',
    type: 'jeunes',
    startDate: '2026-01-25',
    endDate: '2026-01-25',
    location: 'Mulhouse',
    region: 'grand_est',
    instructors: ['À préciser'],
    description: 'Stage fédéral dédié aux jeunes pratiquants',
    validant: false,
    federation: 'FFAAA'
  },
  {
    id: '4',
    title: 'Stage de Ligue - La Réunion',
    type: 'ligue',
    startDate: '2026-01-31',
    endDate: '2026-01-31',
    location: 'Saint-Pierre - Dojo Casabona',
    region: 'reunion',
    instructors: ['Nicolas Sanchez', 'Yanis Hoarau', 'Jacques Mussard'],
    description: 'Stage de ligue LRFFAAA de 15h00 à 17h15 au dojo Casabona',
    time: '15:00 - 17:15',
    validant: true,
    federation: 'LRFFAAA'
  },
  {
    id: '5',
    title: 'Stage Ligue - Yoko Okamoto',
    type: 'ligue',
    startDate: '2026-01-31',
    endDate: '2026-01-31',
    location: 'Île-de-France',
    region: 'idf',
    instructors: ['Yoko Okamoto (7e Dan Shihan)'],
    description: 'Stage exceptionnel avec Yoko Okamoto, 7e Dan Shihan',
    validant: true,
    federation: 'FFAAA IDF',
    highlight: true
  },
  
  // FÉVRIER 2026
  {
    id: '6',
    title: 'Stage Module',
    type: 'module',
    startDate: '2026-01-31',
    endDate: '2026-02-01',
    location: 'Montreuil',
    region: 'idf',
    instructors: ['L. Boudet', 'L. Sanselme'],
    description: 'Stage module de 2 jours en Île-de-France',
    validant: true,
    federation: 'FFAAA'
  },
  {
    id: '7',
    title: 'Stage Module',
    type: 'module',
    startDate: '2026-02-07',
    endDate: '2026-02-07',
    location: 'Cestas',
    region: 'nouvelle_aquitaine',
    instructors: ['P. Léon', 'L. Sanselme'],
    description: 'Stage module en Nouvelle-Aquitaine',
    validant: true,
    federation: 'FFAAA'
  },
  
  // MARS 2026
  {
    id: '8',
    title: 'Préparation 5e Dan',
    type: 'preparation_dan',
    startDate: '2026-03-07',
    endDate: '2026-03-08',
    location: 'Fontenay-sous-Bois',
    region: 'idf',
    instructors: ['À préciser'],
    description: 'Stage de préparation au 5e Dan',
    validant: true,
    federation: 'FFAAA'
  },
  {
    id: '9',
    title: 'Stage Interfédéral',
    type: 'interfederal',
    startDate: '2026-03-21',
    endDate: '2026-03-22',
    location: 'Nouvelle-Aquitaine',
    region: 'nouvelle_aquitaine',
    instructors: ['R. Dalessandro', 'P. Léon'],
    description: 'Stage interfédéral en Nouvelle-Aquitaine',
    validant: true,
    federation: 'FFAAA'
  },
  
  // AVRIL 2026
  {
    id: '10',
    title: 'Stage Module',
    type: 'module',
    startDate: '2026-04-11',
    endDate: '2026-04-12',
    location: 'Strasbourg',
    region: 'grand_est',
    instructors: ['F. Croizé', 'L. Sanselme'],
    description: 'Stage module Ligue Grand-Est',
    validant: true,
    federation: 'FFAAA LGE'
  },
  {
    id: '11',
    title: 'Stage SSBE',
    type: 'ssbe',
    startDate: '2026-04-25',
    endDate: '2026-04-26',
    location: 'Nantes',
    region: 'pays_loire',
    instructors: ['À préciser'],
    description: 'Stage Section Sportive et Bien-Être FFAAA',
    validant: true,
    federation: 'FFAAA'
  },
  
  // JUIN 2026
  {
    id: '12',
    title: 'Stage Marc Bachraty',
    type: 'regional',
    startDate: '2026-06-07',
    endDate: '2026-06-07',
    location: 'Clamart',
    region: 'idf',
    instructors: ['Marc Bachraty'],
    description: 'Stage avec Marc Bachraty à Clamart',
    validant: true,
    federation: 'FFAAA IDF'
  },
  {
    id: '13',
    title: 'Séminaire CTN',
    type: 'seminaire',
    startDate: '2026-06-10',
    endDate: '2026-06-12',
    location: 'À préciser',
    region: 'idf',
    instructors: ['Comité Technique National'],
    description: 'Séminaire du Comité Technique National FFAAA',
    validant: true,
    federation: 'FFAAA',
    highlight: true
  },
  {
    id: '14',
    title: 'Examen 3e & 4e Dan (Métropole)',
    type: 'examen',
    startDate: '2026-06-13',
    endDate: '2026-06-14',
    location: 'À préciser',
    region: 'idf',
    instructors: ['Jury FFAAA'],
    description: 'Examens officiels 3e et 4e Dan métropole',
    validant: false,
    federation: 'FFAAA',
    highlight: true
  },
  {
    id: '15',
    title: 'Examen 5e Dan',
    type: 'examen',
    startDate: '2026-06-14',
    endDate: '2026-06-14',
    location: 'Île-de-France',
    region: 'idf',
    instructors: ['Jury FFAAA'],
    description: 'Examen officiel 5e Dan',
    validant: false,
    federation: 'FFAAA',
    highlight: true
  },
  {
    id: '16',
    title: 'Stage Marc Bachraty',
    type: 'regional',
    startDate: '2026-06-21',
    endDate: '2026-06-21',
    location: 'Clamart',
    region: 'idf',
    instructors: ['Marc Bachraty'],
    description: 'Stage avec Marc Bachraty à Clamart',
    validant: true,
    federation: 'FFAAA IDF'
  },
  
  // JUILLET 2026
  {
    id: '17',
    title: 'Stage d\'été - Ruoms',
    type: 'regional',
    startDate: '2026-07-25',
    endDate: '2026-07-31',
    location: 'Ruoms (Ardèche)',
    region: 'nouvelle_aquitaine',
    instructors: ['Dominique Rascle'],
    description: 'Stage d\'été d\'une semaine en Ardèche avec Dominique Rascle',
    validant: true,
    federation: 'FFAAA',
    highlight: true
  }
];

// Mois en français
const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

/**
 * Carte de stage
 */
const StageCard = ({ stage, onClick }) => {
  const typeConfig = STAGE_TYPES[stage.type] || STAGE_TYPES.regional;
  const regionConfig = REGIONS[stage.region] || { label: stage.region, emoji: '📍' };
  
  const startDate = new Date(stage.startDate);
  const endDate = new Date(stage.endDate);
  const isMultiDay = stage.startDate !== stage.endDate;
  
  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onClick?.(stage)}
      className={`relative rounded-xl overflow-hidden border transition-all cursor-pointer ${
        stage.highlight 
          ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/50 shadow-lg shadow-amber-500/20' 
          : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
      }`}
    >
      {/* Badge highlight */}
      {stage.highlight && (
        <div className="absolute top-2 right-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
        </div>
      )}
      
      <div className="p-4">
        {/* Header avec type et date */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge className={`${typeConfig.color} text-white text-xs`}>
            {typeConfig.icon} {typeConfig.label}
          </Badge>
          <div className="text-right">
            <p className="text-white font-semibold text-sm">
              {formatDate(startDate)}
              {isMultiDay && ` - ${formatDate(endDate)}`}
            </p>
            <p className="text-slate-500 text-xs">2026</p>
          </div>
        </div>
        
        {/* Titre */}
        <h3 className="text-white font-bold text-lg mb-2">{stage.title}</h3>
        
        {/* Lieu */}
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span>{stage.location}</span>
          <span className="text-slate-600">•</span>
          <span>{regionConfig.emoji} {regionConfig.label}</span>
        </div>
        
        {/* Instructeurs */}
        {stage.instructors && stage.instructors.length > 0 && (
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <User className="w-4 h-4 flex-shrink-0" />
            <span>{stage.instructors.join(', ')}</span>
          </div>
        )}
        
        {/* Horaire si précisé */}
        {stage.time && (
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{stage.time}</span>
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
          <Badge variant="outline" className={`text-xs ${stage.validant ? 'border-emerald-500 text-emerald-400' : 'border-slate-600 text-slate-500'}`}>
            {stage.validant ? '✓ Validant grades' : 'Non validant'}
          </Badge>
          <span className="text-xs text-slate-500">{stage.federation}</span>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Composant principal du calendrier des stages
 */
const StagesCalendar = ({ embedded = false }) => {
  const [selectedMonth, setSelectedMonth] = useState(null); // null = tous
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState(null);
  
  // Filtrer les stages
  const filteredStages = useMemo(() => {
    return STAGES_2026.filter(stage => {
      const stageMonth = new Date(stage.startDate).getMonth();
      const matchesMonth = selectedMonth === null || stageMonth === selectedMonth;
      const matchesRegion = selectedRegion === 'all' || stage.region === selectedRegion;
      const matchesType = selectedType === 'all' || stage.type === selectedType;
      const matchesSearch = searchTerm === '' || 
        stage.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stage.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stage.instructors?.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesMonth && matchesRegion && matchesType && matchesSearch;
    });
  }, [selectedMonth, selectedRegion, selectedType, searchTerm]);
  
  // Grouper par mois
  const stagesByMonth = useMemo(() => {
    const grouped = {};
    filteredStages.forEach(stage => {
      const month = new Date(stage.startDate).getMonth();
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(stage);
    });
    return grouped;
  }, [filteredStages]);
  
  // Stats
  const totalStages = STAGES_2026.length;
  const reunionStages = STAGES_2026.filter(s => s.region === 'reunion').length;
  const validantStages = STAGES_2026.filter(s => s.validant).length;
  
  return (
    <div className={`${embedded ? '' : 'min-h-screen'} bg-slate-900`}>
      {/* Header */}
      <div className="p-6 bg-gradient-to-br from-orange-900/30 to-red-900/30 border-b border-orange-700/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Stages FFAAA 2026</h1>
              <p className="text-orange-300">France métropolitaine & La Réunion</p>
            </div>
          </div>
          
          {/* Stats rapides */}
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{totalStages}</p>
              <p className="text-xs text-slate-400">Stages</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">{validantStages}</p>
              <p className="text-xs text-slate-400">Validants</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">{reunionStages}</p>
              <p className="text-xs text-slate-400">Réunion</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filtres */}
      <div className="p-4 bg-slate-800/50 border-b border-slate-700">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Recherche */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un stage, lieu, instructeur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
          </div>
          
          {/* Filtre mois */}
          <select
            value={selectedMonth === null ? 'all' : selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value === 'all' ? null : parseInt(e.target.value))}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
          >
            <option value="all">Tous les mois</option>
            {MONTHS_FR.map((month, idx) => (
              <option key={idx} value={idx}>{month}</option>
            ))}
          </select>
          
          {/* Filtre région */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
          >
            <option value="all">Toutes les régions</option>
            {Object.entries(REGIONS).map(([key, config]) => (
              <option key={key} value={key}>{config.emoji} {config.label}</option>
            ))}
          </select>
          
          {/* Filtre type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
          >
            <option value="all">Tous les types</option>
            {Object.entries(STAGE_TYPES).map(([key, config]) => (
              <option key={key} value={key}>{config.icon} {config.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Légende types */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex flex-wrap gap-2">
          {Object.entries(STAGE_TYPES).map(([key, config]) => (
            <Badge 
              key={key} 
              className={`${config.color} text-white text-xs cursor-pointer transition-opacity ${selectedType !== 'all' && selectedType !== key ? 'opacity-50' : ''}`}
              onClick={() => setSelectedType(selectedType === key ? 'all' : key)}
            >
              {config.icon} {config.label}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Liste des stages par mois */}
      <div className="p-6">
        {filteredStages.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Aucun stage trouvé</p>
            <p className="text-slate-500 text-sm mt-2">
              Modifiez vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(stagesByMonth)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([month, stages]) => (
                <div key={month}>
                  {/* Titre du mois */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{MONTHS_FR[parseInt(month)]} 2026</h2>
                      <p className="text-slate-400 text-sm">{stages.length} stage(s)</p>
                    </div>
                  </div>
                  
                  {/* Grille des stages */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stages.map(stage => (
                      <StageCard 
                        key={stage.id} 
                        stage={stage}
                        onClick={setSelectedStage}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      
      {/* Note source */}
      <div className="p-4 bg-slate-800/30 border-t border-slate-700">
        <div className="flex items-start gap-3 text-sm text-slate-500">
          <Globe className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p><strong>Sources :</strong> Calendrier officiel FFAAA 2025-2026, LRFFAAA (La Réunion), Ligue IDF.</p>
            <p className="mt-1">Les dates et lieux peuvent être modifiés. Consultez le site officiel <a href="https://aikido.com.fr" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">aikido.com.fr</a> pour les informations à jour.</p>
          </div>
        </div>
      </div>
      
      {/* Modal détail stage */}
      <AnimatePresence>
        {selectedStage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedStage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-700 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`p-6 ${STAGE_TYPES[selectedStage.type]?.color || 'bg-orange-500'}`}>
                <Badge className="bg-white/20 text-white mb-2">
                  {STAGE_TYPES[selectedStage.type]?.icon} {STAGE_TYPES[selectedStage.type]?.label}
                </Badge>
                <h2 className="text-2xl font-bold text-white">{selectedStage.title}</h2>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  <span>
                    {new Date(selectedStage.startDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    {selectedStage.startDate !== selectedStage.endDate && (
                      <> - {new Date(selectedStage.endDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</>
                    )}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  <span>{selectedStage.location}</span>
                </div>
                
                {selectedStage.time && (
                  <div className="flex items-center gap-3 text-slate-300">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <span>{selectedStage.time}</span>
                  </div>
                )}
                
                <div className="flex items-start gap-3 text-slate-300">
                  <User className="w-5 h-5 text-orange-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Animateur(s)</p>
                    <p className="text-slate-400">{selectedStage.instructors?.join(', ') || 'À préciser'}</p>
                  </div>
                </div>
                
                <p className="text-slate-400">{selectedStage.description}</p>
                
                <div className="flex gap-2 pt-4">
                  <Badge className={selectedStage.validant ? 'bg-emerald-500' : 'bg-slate-600'}>
                    {selectedStage.validant ? '✓ Validant pour les grades' : 'Non validant'}
                  </Badge>
                  <Badge variant="outline" className="border-slate-600 text-slate-400">
                    {selectedStage.federation}
                  </Badge>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-4 bg-slate-900 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedStage(null)}>
                  Fermer
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Plus d'infos
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StagesCalendar;
