import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ChevronDown, ChevronUp, Lock, Loader2 } from 'lucide-react';

/**
 * ProgrammePage - Programme technique par grade (version adulte)
 * Kanji: 技 (technique, art)
 */
const ProgrammePage = ({ onBack, isAuthenticated, onOpenAuth }) => {
  const [expandedGrade, setExpandedGrade] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mapping des grades pour l'affichage
  const gradeDisplayInfo = {
    '5e KYU': { belt: 'Ceinture Jaune', color: 'from-amber-400 to-yellow-500', emoji: '🟡', duration: '~6 mois' },
    '4e KYU': { belt: 'Ceinture Orange', color: 'from-orange-400 to-orange-500', emoji: '🟠', duration: '~6 mois' },
    '3e KYU': { belt: 'Ceinture Verte', color: 'from-green-400 to-emerald-500', emoji: '🟢', duration: '~1 an' },
    '2e KYU': { belt: 'Ceinture Bleue', color: 'from-blue-400 to-blue-500', emoji: '🔵', duration: '~1 an' },
    '1er KYU': { belt: 'Ceinture Marron', color: 'from-amber-700 to-amber-800', emoji: '🟤', duration: '~1 an' },
    'SHODAN (1er Dan)': { belt: '1er Dan - Ceinture Noire', color: 'from-slate-900 to-black', emoji: '⚫', duration: '~3-4 ans' },
    'NIDAN (2e Dan)': { belt: '2ème Dan', color: 'from-slate-800 to-slate-900', emoji: '⚫', duration: '~2 ans après Shodan' },
    'SANDAN (3e Dan)': { belt: '3ème Dan', color: 'from-slate-700 to-slate-800', emoji: '⚫', duration: '~3 ans après Nidan' },
    'YONDAN (4e Dan)': { belt: '4ème Dan', color: 'from-slate-600 to-slate-700', emoji: '⚫', duration: '~4 ans après Sandan' },
    'BOKKEN (Aïkiken)': { belt: 'Travail au sabre', color: 'from-amber-600 to-amber-800', emoji: '⚔️', duration: 'Transversal' },
  };

  // Récupérer les données depuis l'API
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/kyu-levels`);
        if (response.ok) {
          const data = await response.json();
          const sortedGrades = data.sort((a, b) => b.order - a.order);
          setGrades(sortedGrades);
        }
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  const getGradeInfo = (gradeName) => {
    return gradeDisplayInfo[gradeName] || {
      belt: gradeName,
      color: 'from-slate-400 to-slate-500',
      emoji: '⚪',
      duration: ''
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </Button>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700">
        <div className="absolute top-4 right-4 text-8xl text-slate-700/30 font-serif">技</div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl">
              🥋
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Programme Technique</h1>
              <p className="text-slate-400">Progression par grade</p>
            </div>
          </div>

          <p className="text-lg text-slate-300 max-w-2xl">
            Le programme technique d'Aikido est structuré en grades (kyu), du 6ème kyu (débutant) 
            jusqu'au 1er kyu, avant le passage au grade Dan (ceinture noire).
          </p>
        </div>
      </div>

      {/* Grades */}
      <div className="space-y-4">
        {grades.map((grade) => {
          const gradeInfo = getGradeInfo(grade.name);
          
          return (
            <Card 
              key={grade.id} 
              className="bg-slate-800/50 border-slate-700 overflow-hidden"
            >
              <button
                onClick={() => setExpandedGrade(expandedGrade === grade.id ? null : grade.id)}
                className="w-full"
              >
                <CardHeader className="flex flex-row items-center justify-between p-4 hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradeInfo.color} flex items-center justify-center text-2xl`}>
                      {gradeInfo.emoji}
                    </div>
                    <div className="text-left">
                      <CardTitle className="text-white text-lg">{grade.name}</CardTitle>
                      <p className="text-slate-400 text-sm">{gradeInfo.belt} • {gradeInfo.duration}</p>
                    </div>
                  </div>
                  {expandedGrade === grade.id ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </CardHeader>
              </button>
              
              {expandedGrade === grade.id && (
                <CardContent className="p-4 pt-0 border-t border-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    {grade.techniques?.map((tech, idx) => (
                      <div 
                        key={idx}
                        className="p-3 bg-slate-900/50 rounded-lg border border-slate-700"
                      >
                        <p className="font-medium text-white">{tech.name}</p>
                        <p className="text-sm text-slate-400">{tech.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* CTA */}
      {!isAuthenticated && (
        <Card className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-700/50">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-cyan-400" />
              <p className="text-slate-300">Connectez-vous pour suivre votre progression dans chaque grade</p>
            </div>
            <Button
              onClick={onOpenAuth}
              className="bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              S'inscrire gratuitement
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgrammePage;
