'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ChevronLeft, Calendar, MapPin, Users, Clock, 
  Search, Filter, Globe, Award, Check, X
} from 'lucide-react';
import { AIKIDO_STAGES, getUpcomingStages, formatPrice, isStageFull } from '@/config/sports/aikido-stages';

export default function StagesPage() {
  const params = useParams();
  const t = useTranslations();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const upcomingStages = getUpcomingStages();

  const filteredStages = upcomingStages.filter(stage => {
    const matchesSearch = !searchQuery || 
      stage.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stage.sensei.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stage.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !selectedLevel || stage.level === selectedLevel || stage.level === 'all';
    const matchesCountry = !selectedCountry || stage.country === selectedCountry;
    return matchesSearch && matchesLevel && matchesCountry;
  });

  const countries = [...new Set(AIKIDO_STAGES.map(s => s.country))];
  const levels = [
    { id: 'beginner', label: 'Débutant' },
    { id: 'intermediate', label: 'Intermédiaire' },
    { id: 'advanced', label: 'Avancé' },
    { id: 'all', label: 'Tous niveaux' },
  ];

  const formatDate = (dateStr: string, endDateStr?: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    };
    const formattedDate = date.toLocaleDateString('fr-FR', options);
    
    if (endDateStr) {
      const endDate = new Date(endDateStr);
      const endFormatted = endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      return `${formattedDate} - ${endFormatted}`;
    }
    return formattedDate;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-emerald-500/20 text-emerald-400';
      case 'intermediate': return 'bg-amber-500/20 text-amber-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-cyan-500/20 text-cyan-400';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return 'Tous niveaux';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/${sport}/dojo`}>
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Dojo
              </Button>
            </Link>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              {t('stages.title')}
            </h1>
          </div>
          <span className="text-sm text-slate-400">
            {filteredStages.length} stage{filteredStages.length > 1 ? 's' : ''} à venir
          </span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher un stage, un enseignant, une ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Level Filter */}
            <div className="flex gap-1">
              <Button
                variant={selectedLevel === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel(null)}
              >
                <Filter className="w-3 h-3 mr-1" />
                Niveaux
              </Button>
              {levels.map((level) => (
                <Button
                  key={level.id}
                  variant={selectedLevel === level.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedLevel(level.id)}
                >
                  {level.label}
                </Button>
              ))}
            </div>

            {/* Country Filter */}
            <div className="flex gap-1 ml-4">
              <Button
                variant={selectedCountry === null ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCountry(null)}
              >
                <Globe className="w-3 h-3 mr-1" />
                Pays
              </Button>
              {countries.map((country) => (
                <Button
                  key={country}
                  variant={selectedCountry === country ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCountry(country)}
                >
                  {country === 'France' ? '🇫🇷' : country === 'Japan' ? '🇯🇵' : '🌍'} {country}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Stages List */}
        <div className="grid gap-4">
          {filteredStages.map((stage, index) => {
            const full = isStageFull(stage);
            const spotsLeft = stage.maxParticipants 
              ? stage.maxParticipants - stage.currentParticipants 
              : null;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`overflow-hidden transition-all hover:border-cyan-500/50 ${
                  full ? 'opacity-75' : ''
                }`}>
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Date Section */}
                      <div className="bg-gradient-to-br from-cyan-600 to-blue-700 p-4 md:w-32 flex flex-col items-center justify-center text-white">
                        <span className="text-3xl font-bold">
                          {new Date(stage.date).getDate()}
                        </span>
                        <span className="text-sm uppercase">
                          {new Date(stage.date).toLocaleDateString('fr-FR', { month: 'short' })}
                        </span>
                        <span className="text-xs opacity-75">
                          {new Date(stage.date).getFullYear()}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-white">{stage.title}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${getLevelColor(stage.level)}`}>
                                {getLevelLabel(stage.level)}
                              </span>
                            </div>
                            <p className="text-amber-400 flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              {stage.sensei} - {stage.senseiGrade}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-white">
                              {formatPrice(stage.price, stage.currency)}
                            </p>
                            {stage.federation && (
                              <span className="text-xs text-slate-400">{stage.federation}</span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                          {stage.description}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(stage.date, stage.endDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {stage.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {stage.city}, {stage.country}
                          </span>
                          {spotsLeft !== null && (
                            <span className={`flex items-center gap-1 ${
                              full ? 'text-red-400' : spotsLeft < 10 ? 'text-amber-400' : 'text-emerald-400'
                            }`}>
                              <Users className="w-4 h-4" />
                              {full ? 'Complet' : `${spotsLeft} places restantes`}
                            </span>
                          )}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {stage.tags.slice(0, 4).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant={full ? 'outline' : 'gradient'}
                            size="sm"
                            disabled={full}
                            className="flex-1 md:flex-none"
                          >
                            {full ? (
                              <>
                                <X className="w-4 h-4 mr-1" />
                                Complet
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                {t('stages.register')}
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            Détails
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredStages.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Aucun stage trouvé</p>
            <p className="text-sm text-slate-500 mt-2">
              Essayez de modifier vos filtres
            </p>
          </div>
        )}

        {/* Summary Card */}
        <Card className="mt-8 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Ne manquez aucun stage !
                </h3>
                <p className="text-slate-400 text-sm">
                  Activez les notifications pour être averti des nouveaux stages dans votre région.
                </p>
              </div>
              <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10">
                Activer les alertes
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
