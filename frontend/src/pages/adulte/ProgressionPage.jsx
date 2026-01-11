import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, Target, Award, Calendar, Lock } from 'lucide-react';

/**
 * ProgressionPage - Suivi de progression (version adulte)
 * Kanji: 進 (avancer, progresser)
 */
const ProgressionPage = ({ onBack, isAuthenticated, onOpenAuth }) => {
  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Tableau de bord personnel',
      desc: 'Visualisez votre progression globale avec des statistiques détaillées',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Techniques maîtrisées',
      desc: 'Suivez chaque technique : non vue, en apprentissage, maîtrisée',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Historique d\'entraînement',
      desc: 'Gardez trace de toutes vos sessions de pratique',
      color: 'from-violet-500 to-purple-600'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Badges et récompenses',
      desc: 'Débloquez des badges en atteignant vos objectifs',
      color: 'from-amber-500 to-orange-600'
    },
  ];

  // Exemple de progression (données mockées pour visiteur)
  const mockProgress = [
    { grade: '6ème Kyu', progress: 100, color: 'bg-slate-400' },
    { grade: '5ème Kyu', progress: 75, color: 'bg-amber-400' },
    { grade: '4ème Kyu', progress: 30, color: 'bg-orange-400' },
    { grade: '3ème Kyu', progress: 0, color: 'bg-green-400' },
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
          Précédent
        </Button>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700">
        <div className="absolute top-4 right-4 text-8xl text-slate-700/30 font-serif">進</div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Progression</h1>
              <p className="text-slate-400">Suivez votre parcours</p>
            </div>
          </div>

          <p className="text-lg text-slate-300 max-w-2xl">
            Votre progression est personnelle et confidentielle. Elle n'est visible que par vous 
            et vous permet de mesurer votre évolution dans la pratique de l'Aikido.
          </p>
        </div>
      </div>

      {/* Aperçu de progression (mock) */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Aperçu de progression</h3>
          <div className="space-y-4">
            {mockProgress.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">{item.grade}</span>
                  <span className="text-slate-400">{item.progress}%</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {!isAuthenticated && (
            <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-600 text-center">
              <p className="text-slate-400 text-sm mb-3">Ceci est un exemple. Connectez-vous pour voir votre vraie progression.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}>
                {feature.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      {!isAuthenticated && (
        <Card className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-700/50">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-amber-400" />
              <p className="text-slate-300">Créez votre compte pour commencer à suivre votre progression</p>
            </div>
            <Button
              onClick={onOpenAuth}
              className="bg-amber-600 hover:bg-amber-500 text-white"
            >
              Commencer maintenant
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressionPage;
