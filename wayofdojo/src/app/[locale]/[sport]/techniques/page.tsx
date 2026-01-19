'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Swords, Search, ChevronLeft, Check, Lock, 
  BookOpen, Filter, ArrowRight
} from 'lucide-react';
import { aikidoConfig } from '@/config/sports/aikido.config';
import { AIKIDO_TECHNIQUES, getTechniquesByGrade } from '@/config/sports/aikido-techniques';

export default function TechniquesPage() {
  const params = useParams();
  const t = useTranslations();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [completedTechniques, setCompletedTechniques] = useState<string[]>([]);
  const [userGrade, setUserGrade] = useState('6e_kyu');

  useEffect(() => {
    const storedUser = localStorage.getItem('wayofdojo_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserGrade(user.grade || '6e_kyu');
      setCompletedTechniques(user.gamification?.completedTechniques || []);
    }
  }, []);

  const allGrades = [...aikidoConfig.grades.kyu];
  const userGradeIndex = allGrades.findIndex(g => g.id === userGrade);

  const filteredTechniques = AIKIDO_TECHNIQUES.filter(technique => {
    const matchesGrade = !selectedGrade || technique.grade === selectedGrade;
    const matchesCategory = !selectedCategory || technique.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      technique.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      technique.nameJp.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesCategory && matchesSearch;
  });

  const isGradeAccessible = (gradeId: string) => {
    const gradeIndex = allGrades.findIndex(g => g.id === gradeId);
    return gradeIndex <= userGradeIndex;
  };

  const toggleTechniqueComplete = (techniqueId: string) => {
    setCompletedTechniques(prev => {
      const newCompleted = prev.includes(techniqueId)
        ? prev.filter(id => id !== techniqueId)
        : [...prev, techniqueId];
      
      // Save to localStorage
      const storedUser = localStorage.getItem('wayofdojo_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.gamification.completedTechniques = newCompleted;
        localStorage.setItem('wayofdojo_user', JSON.stringify(user));
      }
      
      return newCompleted;
    });
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
              <BookOpen className="w-5 h-5 text-amber-400" />
              {t('navigation.techniques')}
            </h1>
          </div>
          <span className="text-sm text-slate-400">
            {filteredTechniques.length} technique{filteredTechniques.length > 1 ? 's' : ''}
          </span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher une technique..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Grade Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedGrade === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedGrade(null)}
            >
              Tous
            </Button>
            {allGrades.map((grade) => {
              const accessible = isGradeAccessible(grade.id);
              const techniqueCount = getTechniquesByGrade(grade.id).length;
              return (
                <Button
                  key={grade.id}
                  variant={selectedGrade === grade.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => accessible && setSelectedGrade(grade.id)}
                  disabled={!accessible}
                  className="gap-1"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: grade.color,
                      border: grade.color === '#FFFFFF' ? '1px solid #64748b' : 'none'
                    }}
                  />
                  {grade.displayName}
                  <span className="text-xs opacity-70">({techniqueCount})</span>
                  {!accessible && <Lock className="w-3 h-3 ml-1" />}
                </Button>
              );
            })}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              <Filter className="w-3 h-3 mr-1" />
              Toutes catégories
            </Button>
            {aikidoConfig.categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Techniques List */}
        <div className="grid gap-4">
          {filteredTechniques.map((technique, index) => {
            const grade = allGrades.find(g => g.id === technique.grade);
            const isCompleted = completedTechniques.includes(technique.id);
            const isAccessible = isGradeAccessible(technique.grade);

            return (
              <motion.div
                key={technique.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className={`transition-all ${
                  isCompleted ? 'border-emerald-500/50 bg-emerald-500/5' : 
                  !isAccessible ? 'opacity-50' : 'hover:border-amber-500/50'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Completion Toggle */}
                      <button
                        onClick={() => isAccessible && toggleTechniqueComplete(technique.id)}
                        disabled={!isAccessible}
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                          isCompleted 
                            ? 'bg-emerald-500 text-white' 
                            : isAccessible 
                              ? 'bg-slate-700 hover:bg-slate-600 text-slate-400'
                              : 'bg-slate-800 text-slate-600'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : !isAccessible ? (
                          <Lock className="w-3 h-3" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-500" />
                        )}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                            {technique.nameJp}
                          </h3>
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ 
                              backgroundColor: grade?.color,
                              border: grade?.color === '#FFFFFF' ? '1px solid #64748b' : 'none'
                            }}
                            title={grade?.displayName}
                          />
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{technique.name}</p>
                        <p className="text-xs text-slate-500">{technique.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">
                            {technique.attack}
                          </span>
                          {technique.execution !== 'both' && (
                            <span className="px-2 py-1 bg-amber-500/20 rounded text-xs text-amber-400">
                              {technique.execution}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      {isAccessible && (
                        <Button variant="ghost" size="sm" className="flex-shrink-0">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredTechniques.length === 0 && (
          <div className="text-center py-12">
            <Swords className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Aucune technique trouvée</p>
          </div>
        )}

        {/* Progress Summary */}
        <Card className="mt-8 bg-slate-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Progression</p>
                <p className="text-2xl font-bold text-white">
                  {completedTechniques.length} / {AIKIDO_TECHNIQUES.filter(t => isGradeAccessible(t.grade)).length}
                </p>
              </div>
              <div className="w-24 h-24 relative">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-slate-700"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(completedTechniques.length / AIKIDO_TECHNIQUES.filter(t => isGradeAccessible(t.grade)).length) * 251.2} 251.2`}
                    className="text-emerald-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-emerald-400">
                    {Math.round((completedTechniques.length / AIKIDO_TECHNIQUES.filter(t => isGradeAccessible(t.grade)).length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
