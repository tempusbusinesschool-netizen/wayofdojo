import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Play, CheckCircle, Lock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Page 2 - APPRENDS : Découverte des techniques
 * Version Enfant
 */
const ApprendsPage = ({ onBack, isAuthenticated, onOpenAuth }) => {
  
  const [selectedGrade, setSelectedGrade] = useState('6kyu');

  // Techniques par grade (simplifiées pour les enfants)
  const grades = [
    { 
      id: '6kyu', 
      name: 'Ceinture Blanche', 
      emoji: '⚪', 
      color: 'from-slate-400 to-slate-500',
      unlocked: true,
      techniques: [
        { id: 1, name: 'Tai Sabaki', desc: 'Apprends à te déplacer comme un ninja !', icon: '🦶', learned: false },
        { id: 2, name: 'Ukemi Mae', desc: 'La chute avant - roule comme une boule !', icon: '🔄', learned: false },
        { id: 3, name: 'Ukemi Ushiro', desc: 'La chute arrière - protège ta tête !', icon: '⬇️', learned: false },
        { id: 4, name: 'Seiza', desc: 'S\'asseoir comme un vrai samouraï', icon: '🧘', learned: true },
        { id: 5, name: 'Rei', desc: 'Le salut - montre ton respect', icon: '🙏', learned: true },
      ]
    },
    { 
      id: '5kyu', 
      name: 'Ceinture Jaune', 
      emoji: '🟡', 
      color: 'from-yellow-400 to-amber-500',
      unlocked: true,
      techniques: [
        { id: 6, name: 'Ikkyo', desc: 'La première technique - contrôle le bras !', icon: '💪', learned: false },
        { id: 7, name: 'Shiho Nage', desc: 'Projection dans les 4 directions', icon: '🌀', learned: false },
        { id: 8, name: 'Irimi Nage', desc: 'Entre et projette !', icon: '➡️', learned: false },
      ]
    },
    { 
      id: '4kyu', 
      name: 'Ceinture Orange', 
      emoji: '🟠', 
      color: 'from-orange-400 to-red-500',
      unlocked: false,
      techniques: [
        { id: 9, name: 'Nikyo', desc: 'Deuxième contrôle - fais attention au poignet !', icon: '✋', learned: false },
        { id: 10, name: 'Sankyo', desc: 'Troisième contrôle - la spirale magique', icon: '🌪️', learned: false },
      ]
    },
    { 
      id: '3kyu', 
      name: 'Ceinture Verte', 
      emoji: '🟢', 
      color: 'from-green-400 to-emerald-500',
      unlocked: false,
      techniques: [
        { id: 11, name: 'Yonkyo', desc: 'Quatrième contrôle - le point secret !', icon: '🎯', learned: false },
        { id: 12, name: 'Kote Gaeshi', desc: 'Retourne le poignet de ton adversaire', icon: '🔃', learned: false },
      ]
    },
    { 
      id: '2kyu', 
      name: 'Ceinture Bleue', 
      emoji: '🔵', 
      color: 'from-blue-400 to-blue-600',
      unlocked: false,
      techniques: [
        { id: 13, name: 'Kokyu Nage', desc: 'Projette avec ta respiration !', icon: '💨', learned: false },
        { id: 14, name: 'Kaiten Nage', desc: 'La roue qui tourne', icon: '🎡', learned: false },
      ]
    },
    { 
      id: '1kyu', 
      name: 'Ceinture Marron', 
      emoji: '🟤', 
      color: 'from-amber-700 to-amber-800',
      unlocked: false,
      techniques: [
        { id: 15, name: 'Jiyu Waza', desc: 'Techniques libres - sois créatif !', icon: '🎨', learned: false },
        { id: 16, name: 'Randori', desc: 'Combat contre plusieurs ninjas !', icon: '⚔️', learned: false },
      ]
    },
    // ═══════════════════════════════════════════════════════════════
    // GRADES DAN - Les Maîtres Ninjas ! 🥷
    // ═══════════════════════════════════════════════════════════════
    { 
      id: 'shodan', 
      name: '1er Dan - Ceinture Noire', 
      emoji: '⚫', 
      color: 'from-slate-900 to-black',
      unlocked: false,
      isDan: true,
      techniques: [
        { id: 17, name: 'Maître Débutant', desc: 'Tu deviens un vrai sensei !', icon: '🥷', learned: false },
        { id: 18, name: 'Randori 2 ninjas', desc: 'Affronte 2 adversaires à la fois !', icon: '👥', learned: false },
      ]
    },
    { 
      id: 'nidan', 
      name: '2ème Dan', 
      emoji: '⚫', 
      color: 'from-slate-800 to-slate-900',
      unlocked: false,
      isDan: true,
      techniques: [
        { id: 19, name: 'Maître Confirmé', desc: 'Tes techniques sont fluides comme l\'eau', icon: '🌊', learned: false },
      ]
    },
    { 
      id: 'sandan', 
      name: '3ème Dan', 
      emoji: '⚫', 
      color: 'from-slate-700 to-slate-800',
      unlocked: false,
      isDan: true,
      techniques: [
        { id: 20, name: 'Maître Expert', desc: 'Randori contre 3 ninjas !', icon: '👥👤', learned: false },
      ]
    },
    { 
      id: 'yondan', 
      name: '4ème Dan', 
      emoji: '⚫', 
      color: 'from-slate-600 to-slate-700',
      unlocked: false,
      isDan: true,
      techniques: [
        { id: 21, name: 'Grand Maître', desc: 'Tu maîtrises toutes les armes !', icon: '⚔️🗡️', learned: false },
      ]
    },
    { 
      id: 'bokken', 
      name: 'Sabre Bokken', 
      emoji: '⚔️', 
      color: 'from-amber-600 to-amber-800',
      unlocked: false,
      isWeapon: true,
      techniques: [
        { id: 22, name: 'Ken Suburi', desc: 'Les 7 coupes de base au sabre', icon: '🗡️', learned: false },
        { id: 23, name: 'Kamae', desc: 'Les gardes du samouraï', icon: '🛡️', learned: false },
      ]
    },
  ];

  const currentGrade = grades.find(g => g.id === selectedGrade);

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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-4">
            <span className="text-4xl">📚</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Apprends les techniques !
          </h1>
          <p className="text-slate-400 text-lg">
            Découvre les secrets des ninjas 🥷
          </p>
        </div>

        {/* Sélecteur de grade */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
          {grades.map((grade) => (
            <button
              key={grade.id}
              onClick={() => grade.unlocked && setSelectedGrade(grade.id)}
              disabled={!grade.unlocked}
              className={`
                flex-shrink-0 px-4 py-3 rounded-xl flex items-center gap-2 transition-all
                ${selectedGrade === grade.id 
                  ? `bg-gradient-to-r ${grade.color} text-white shadow-lg` 
                  : grade.unlocked 
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                    : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'}
              `}
            >
              <span className="text-xl">{grade.emoji}</span>
              <span className="font-medium whitespace-nowrap">{grade.name}</span>
              {!grade.unlocked && <Lock className="w-4 h-4" />}
            </button>
          ))}
        </div>

        {/* Liste des techniques */}
        <div className="space-y-4">
          {currentGrade?.techniques.map((technique) => (
            <div
              key={technique.id}
              className={`
                bg-slate-800/50 rounded-2xl p-4 sm:p-5 border transition-all hover:scale-[1.02]
                ${technique.learned ? 'border-emerald-500/50' : 'border-slate-700'}
              `}
            >
              <div className="flex items-center gap-4">
                {/* Icône */}
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center text-2xl
                  ${technique.learned 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500' 
                    : 'bg-slate-700'}
                `}>
                  {technique.icon}
                </div>
                
                {/* Infos */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{technique.name}</h3>
                    {technique.learned && (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{technique.desc}</p>
                </div>

                {/* Bouton */}
                <Button
                  variant="ghost"
                  className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                >
                  <Play className="w-5 h-5 mr-1" />
                  <span className="hidden sm:inline">Voir</span>
                  <ChevronRight className="w-4 h-4 sm:hidden" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Message d'encouragement */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-full text-cyan-400 text-sm">
            <BookOpen className="w-4 h-4" />
            <span>Tu as appris {currentGrade?.techniques.filter(t => t.learned).length || 0}/{currentGrade?.techniques.length || 0} techniques !</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprendsPage;
