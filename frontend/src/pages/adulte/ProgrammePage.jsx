import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ChevronDown, ChevronUp, Lock } from 'lucide-react';

/**
 * ProgrammePage - Programme technique par grade (version adulte)
 * Kanji: 技 (technique, art)
 */
const ProgrammePage = ({ onBack, isAuthenticated, onOpenAuth }) => {
  const [expandedGrade, setExpandedGrade] = useState(null);

  const grades = [
    {
      id: '6kyu',
      name: '6ème Kyu',
      belt: 'Ceinture Blanche',
      color: 'from-slate-400 to-slate-500',
      emoji: '⚪',
      duration: '~6 mois',
      techniques: [
        { name: 'Tai Sabaki', desc: 'Déplacements fondamentaux' },
        { name: 'Ukemi', desc: 'Chutes avant et arrière' },
        { name: 'Ikkyo Omote/Ura', desc: 'Première immobilisation' },
        { name: 'Shiho Nage', desc: 'Projection 4 directions' },
      ]
    },
    {
      id: '5kyu',
      name: '5ème Kyu',
      belt: 'Ceinture Jaune',
      color: 'from-amber-400 to-yellow-500',
      emoji: '🟡',
      duration: '~6 mois',
      techniques: [
        { name: 'Nikyo Omote/Ura', desc: 'Deuxième immobilisation' },
        { name: 'Irimi Nage', desc: 'Projection en entrant' },
        { name: 'Kote Gaeshi', desc: 'Retournement du poignet' },
        { name: 'Kokyu Ho', desc: 'Exercice de respiration' },
      ]
    },
    {
      id: '4kyu',
      name: '4ème Kyu',
      belt: 'Ceinture Orange',
      color: 'from-orange-400 to-orange-500',
      emoji: '🟠',
      duration: '~6 mois',
      techniques: [
        { name: 'Sankyo Omote/Ura', desc: 'Troisième immobilisation' },
        { name: 'Kaiten Nage', desc: 'Projection rotative' },
        { name: 'Tenchi Nage', desc: 'Projection ciel et terre' },
        { name: 'Suwari Waza', desc: 'Techniques à genoux' },
      ]
    },
    {
      id: '3kyu',
      name: '3ème Kyu',
      belt: 'Ceinture Verte',
      color: 'from-green-400 to-emerald-500',
      emoji: '🟢',
      duration: '~1 an',
      techniques: [
        { name: 'Yonkyo', desc: 'Quatrième immobilisation' },
        { name: 'Kokyu Nage', desc: 'Projections par la respiration' },
        { name: 'Hanmi Handachi', desc: 'Techniques mixtes' },
        { name: 'Tanto Dori', desc: 'Défense contre couteau' },
      ]
    },
    {
      id: '2kyu',
      name: '2ème Kyu',
      belt: 'Ceinture Bleue',
      color: 'from-blue-400 to-blue-500',
      emoji: '🔵',
      duration: '~1 an',
      techniques: [
        { name: 'Gokyo', desc: 'Cinquième immobilisation' },
        { name: 'Jiyu Waza', desc: 'Techniques libres' },
        { name: 'Jo Dori', desc: 'Défense contre bâton' },
        { name: 'Tachi Dori', desc: 'Défense contre sabre' },
      ]
    },
    {
      id: '1kyu',
      name: '1er Kyu',
      belt: 'Ceinture Marron',
      color: 'from-amber-700 to-amber-800',
      emoji: '🟤',
      duration: '~1 an',
      techniques: [
        { name: 'Kaeshi Waza', desc: 'Contre-techniques' },
        { name: 'Randori', desc: 'Attaques multiples' },
        { name: 'Buki Waza', desc: 'Travail aux armes' },
        { name: 'Préparation Shodan', desc: 'Révision complète' },
      ]
    },
  ];

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
        {grades.map((grade) => (
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
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grade.color} flex items-center justify-center text-2xl`}>
                    {grade.emoji}
                  </div>
                  <div className="text-left">
                    <CardTitle className="text-white text-lg">{grade.name}</CardTitle>
                    <p className="text-slate-400 text-sm">{grade.belt} • {grade.duration}</p>
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
                  {grade.techniques.map((tech, idx) => (
                    <div 
                      key={idx}
                      className="p-3 bg-slate-900/50 rounded-lg border border-slate-700"
                    >
                      <p className="font-medium text-white">{tech.name}</p>
                      <p className="text-sm text-slate-400">{tech.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
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
