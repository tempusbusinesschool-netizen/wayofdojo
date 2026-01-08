import React, { useState } from 'react';
import { ArrowLeft, Calendar, CheckCircle, Flame, Trophy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Page 3 - ENTRAÎNE-TOI : Pratique au dojo
 * Version Enfant
 */
const EntrainePage = ({ onBack, isAuthenticated, onOpenAuth }) => {
  
  const [todayChecked, setTodayChecked] = useState(false);

  // Jours de la semaine avec présence
  const weekDays = [
    { day: 'Lun', date: '6', present: true },
    { day: 'Mar', date: '7', present: false },
    { day: 'Mer', date: '8', present: true },
    { day: 'Jeu', date: '9', present: false },
    { day: 'Ven', date: '10', present: true },
    { day: 'Sam', date: '11', present: false },
    { day: 'Dim', date: '12', present: false, isToday: true },
  ];

  // Stats d'entraînement
  const stats = {
    streak: 3,
    thisMonth: 8,
    total: 24,
  };

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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-4">
            <span className="text-4xl">💪</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Entraîne-toi au dojo !
          </h1>
          <p className="text-slate-400 text-lg">
            Chaque entraînement te rend plus fort 🔥
          </p>
        </div>

        {!isAuthenticated ? (
          /* Non connecté */
          <div className="bg-slate-800/50 rounded-3xl p-8 text-center border border-slate-700">
            <div className="text-6xl mb-4">🥋</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Connecte-toi pour suivre tes entraînements !
            </h2>
            <Button
              onClick={onOpenAuth}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-8 py-4 rounded-xl text-lg"
            >
              🚀 Me connecter
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Bouton "J'étais au cours aujourd'hui" */}
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-3xl p-6 sm:p-8 border border-amber-500/30">
              <div className="text-center">
                <p className="text-amber-400 font-medium mb-4">Aujourd'hui - Dimanche 12 Janvier</p>
                
                {!todayChecked ? (
                  <Button
                    onClick={() => setTodayChecked(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-8 py-6 rounded-2xl text-xl shadow-lg shadow-amber-500/30"
                  >
                    <CheckCircle className="w-6 h-6 mr-2" />
                    J'étais au cours aujourd'hui !
                  </Button>
                ) : (
                  <div className="inline-flex items-center gap-3 bg-emerald-500/20 text-emerald-400 px-6 py-4 rounded-2xl">
                    <CheckCircle className="w-8 h-8" />
                    <span className="text-xl font-bold">Bravo ! Entraînement validé 🎉</span>
                  </div>
                )}
              </div>
            </div>

            {/* Calendrier de la semaine */}
            <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Cette semaine</h2>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      text-center p-3 rounded-xl transition-all
                      ${day.isToday ? 'ring-2 ring-amber-500' : ''}
                      ${day.present || (day.isToday && todayChecked)
                        ? 'bg-gradient-to-b from-emerald-500 to-emerald-600' 
                        : 'bg-slate-700/50'}
                    `}
                  >
                    <p className={`text-xs font-medium ${day.present || (day.isToday && todayChecked) ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {day.day}
                    </p>
                    <p className={`text-lg font-bold ${day.present || (day.isToday && todayChecked) ? 'text-white' : 'text-slate-400'}`}>
                      {day.date}
                    </p>
                    {(day.present || (day.isToday && todayChecked)) && (
                      <CheckCircle className="w-4 h-4 text-white mx-auto mt-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-4 text-center border border-orange-500/30">
                <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{stats.streak}</p>
                <p className="text-orange-400 text-sm">Jours d'affilée</p>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl p-4 text-center border border-cyan-500/30">
                <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{stats.thisMonth}</p>
                <p className="text-cyan-400 text-sm">Ce mois-ci</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-4 text-center border border-purple-500/30">
                <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{stats.total}</p>
                <p className="text-purple-400 text-sm">Total</p>
              </div>
            </div>

            {/* Message d'encouragement */}
            <div className="text-center p-4 bg-slate-800/30 rounded-xl">
              <p className="text-slate-400">
                🔥 Continue comme ça ! Tu es sur la bonne voie pour devenir un vrai Ninja !
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntrainePage;
