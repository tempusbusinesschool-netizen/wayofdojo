import React from 'react';
import { ArrowLeft, Star, TrendingUp, Zap, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Page 5 - PROGRESSE : Gagner XP et monter de niveau
 * Version Enfant
 */
const ProgressePage = ({ onBack, isAuthenticated, onOpenAuth }) => {
  
  // Stats de progression
  const progression = {
    level: 3,
    levelName: 'Apprenti Ninja',
    xp: 450,
    xpToNext: 600,
    totalXp: 1250,
    streak: 5,
  };

  // Dernières récompenses
  const recentRewards = [
    { id: 1, type: 'xp', amount: 50, reason: 'Entraînement complété', time: 'Il y a 2h', icon: '⭐' },
    { id: 2, type: 'xp', amount: 100, reason: 'Technique validée', time: 'Hier', icon: '✅' },
    { id: 3, type: 'xp', amount: 25, reason: 'Défi quotidien', time: 'Hier', icon: '🎯' },
    { id: 4, type: 'badge', name: 'Assidu', reason: '5 jours d\'affilée', time: 'Il y a 3j', icon: '🔥' },
  ];

  // Niveaux
  const levels = [
    { level: 1, name: 'Petit Scarabée', xp: 0 },
    { level: 2, name: 'Jeune Poussin', xp: 200 },
    { level: 3, name: 'Apprenti Ninja', xp: 500, current: true },
    { level: 4, name: 'Ninja Agile', xp: 1000 },
    { level: 5, name: 'Ninja Rapide', xp: 2000 },
    { level: 6, name: 'Super Ninja', xp: 4000 },
    { level: 7, name: 'Maître Ninja', xp: 8000 },
  ];

  const progressPercent = ((progression.xp - 500) / (600 - 500)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour à l'accueil</span>
        </button>

        {/* Titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 mb-4">
            <span className="text-4xl">🌟</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Ta progression !
          </h1>
          <p className="text-slate-400 text-lg">
            Gagne des XP et monte de niveau ⬆️
          </p>
        </div>

        {!isAuthenticated ? (
          /* Non connecté */
          <div className="bg-slate-800/50 rounded-3xl p-8 text-center border border-slate-700">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Connecte-toi pour voir ta progression !
            </h2>
            <Button
              onClick={onOpenAuth}
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white font-bold px-8 py-4 rounded-xl text-lg"
            >
              🚀 Me connecter
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Niveau actuel */}
            <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-3xl p-6 sm:p-8 border border-violet-500/30">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Badge de niveau */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
                    <span className="text-4xl font-bold text-white">{progression.level}</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-900" />
                  </div>
                </div>
                
                {/* Infos */}
                <div className="text-center sm:text-left flex-1">
                  <p className="text-violet-400 font-medium">Niveau {progression.level}</p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{progression.levelName}</h2>
                  
                  {/* Barre de progression */}
                  <div className="w-full bg-slate-700 rounded-full h-4 mb-2">
                    <div 
                      className="h-4 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-slate-400 text-sm">
                    {progression.xp} / {progression.xpToNext} XP pour le niveau suivant
                  </p>
                </div>
              </div>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-2xl p-4 text-center border border-slate-700">
                <Zap className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{progression.totalXp}</p>
                <p className="text-slate-400 text-xs">XP Total</p>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-4 text-center border border-slate-700">
                <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{progression.streak}</p>
                <p className="text-slate-400 text-xs">Jours d'affilée</p>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-4 text-center border border-slate-700">
                <Target className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-slate-400 text-xs">Défis réussis</p>
              </div>
            </div>

            {/* Dernières récompenses */}
            <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-bold text-white">Dernières récompenses</h2>
              </div>
              
              <div className="space-y-3">
                {recentRewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-xl"
                  >
                    <span className="text-2xl">{reward.icon}</span>
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {reward.type === 'xp' ? `+${reward.amount} XP` : reward.name}
                      </p>
                      <p className="text-slate-400 text-sm">{reward.reason}</p>
                    </div>
                    <span className="text-slate-500 text-sm">{reward.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Échelle des niveaux */}
            <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">🏆 Échelle des niveaux</h2>
              <div className="space-y-2">
                {levels.map((lvl) => (
                  <div
                    key={lvl.level}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl transition-all
                      ${lvl.current 
                        ? 'bg-violet-500/20 border border-violet-500/50' 
                        : lvl.level < progression.level 
                          ? 'bg-emerald-500/10 opacity-60' 
                          : 'bg-slate-700/30 opacity-40'}
                    `}
                  >
                    <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                      {lvl.level}
                    </span>
                    <span className={`font-medium ${lvl.current ? 'text-violet-400' : 'text-slate-400'}`}>
                      {lvl.name}
                    </span>
                    <span className="text-slate-500 text-sm ml-auto">{lvl.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressePage;
