import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Target, Calendar, Flame, Trophy, Lock } from 'lucide-react';

/**
 * ObjectifsPage - Défis et objectifs quotidiens (version adulte)
 * Kanji: 目 (œil, but, objectif)
 */
const ObjectifsPage = ({ onBack, isAuthenticated, onOpenAuth }) => {
  // Exemples de défis
  const dailyChallenges = [
    { id: 1, title: 'Pratiquer 10 minutes de Tai Sabaki', xp: 15, category: 'Technique', done: false },
    { id: 2, title: 'Méditer 5 minutes (Mokuso)', xp: 10, category: 'Esprit', done: true },
    { id: 3, title: 'Réviser une vertu du Hakama', xp: 10, category: 'Philosophie', done: false },
  ];

  const weeklyGoals = [
    { title: '3 sessions d\'entraînement', progress: 2, total: 3, icon: '🥋' },
    { title: '50 chutes (Ukemi)', progress: 35, total: 50, icon: '🔄' },
    { title: 'Apprendre 1 nouvelle technique', progress: 0, total: 1, icon: '📚' },
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
        <div className="absolute top-4 right-4 text-8xl text-slate-700/30 font-serif">目</div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Objectifs</h1>
              <p className="text-slate-400">Défis quotidiens et hebdomadaires</p>
            </div>
          </div>

          <p className="text-lg text-slate-300 max-w-2xl">
            Définissez vos objectifs personnels et relevez des défis quotidiens pour maintenir 
            une pratique régulière. Chaque défi accompli vous rapporte de l'XP.
          </p>
        </div>
      </div>

      {/* Défis du jour */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Flame className="w-6 h-6 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Défis du jour</h3>
          </div>
          
          <div className="space-y-3">
            {dailyChallenges.map((challenge) => (
              <div 
                key={challenge.id}
                className={`p-4 rounded-lg border transition-colors ${
                  challenge.done 
                    ? 'bg-emerald-900/20 border-emerald-700/50' 
                    : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      challenge.done 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : 'border-slate-600'
                    }`}>
                      {challenge.done && <span className="text-white text-sm">✓</span>}
                    </div>
                    <div>
                      <p className={`font-medium ${challenge.done ? 'text-emerald-300 line-through' : 'text-white'}`}>
                        {challenge.title}
                      </p>
                      <p className="text-xs text-slate-500">{challenge.category}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${challenge.done ? 'text-emerald-400' : 'text-amber-400'}`}>
                    +{challenge.xp} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {!isAuthenticated && (
            <p className="text-center text-slate-500 text-sm mt-4">
              Connectez-vous pour valider vos défis et gagner de l'XP
            </p>
          )}
        </CardContent>
      </Card>

      {/* Objectifs hebdomadaires */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Objectifs de la semaine</h3>
          </div>
          
          <div className="space-y-4">
            {weeklyGoals.map((goal, idx) => (
              <div key={idx} className="p-4 bg-slate-900/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{goal.icon}</span>
                    <span className="text-white font-medium">{goal.title}</span>
                  </div>
                  <span className="text-slate-400 text-sm">
                    {goal.progress}/{goal.total}
                  </span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${(goal.progress / goal.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Récompenses */}
      <Card className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-700/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h3 className="text-lg font-semibold text-white">Système de récompenses</h3>
          </div>
          <p className="text-slate-300 mb-4">
            Complétez vos défis pour gagner de l'XP, monter de niveau et débloquer des badges exclusifs.
          </p>
          <div className="flex flex-wrap gap-3">
            {['🔥 Série 7 jours', '🌟 Première technique', '🎯 100 défis', '👑 Niveau 10'].map((badge, idx) => (
              <span key={idx} className="px-3 py-1 bg-slate-800/80 rounded-full text-sm text-slate-400">
                {badge}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      {!isAuthenticated && (
        <Card className="bg-gradient-to-r from-pink-900/30 to-rose-900/30 border-pink-700/50">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-pink-400" />
              <p className="text-slate-300">Inscrivez-vous pour définir vos propres objectifs</p>
            </div>
            <Button
              onClick={onOpenAuth}
              className="bg-pink-600 hover:bg-pink-500 text-white"
            >
              Créer mon compte
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ObjectifsPage;
