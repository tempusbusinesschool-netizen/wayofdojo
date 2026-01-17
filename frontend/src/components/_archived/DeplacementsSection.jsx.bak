import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DEPLACEMENTS_DATA } from '@/constants';

/**
 * DeplacementsSection - Section des déplacements d'Aikido
 * Affichage ludique des directions et des techniques de déplacement
 */
const DeplacementsSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-purple-900/40 via-fuchsia-900/40 to-pink-900/40 rounded-xl border border-fuchsia-500/30 overflow-hidden">
      {/* Header cliquable */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center">
            <span className="text-2xl">🦶</span>
          </div>
          <div>
            <h4 className="font-bold text-fuchsia-300 text-lg">{DEPLACEMENTS_DATA.title}</h4>
            <p className="text-slate-400 text-sm">😊 Apprends à bouger comme un vrai ninja ! 🥷</p>
          </div>
        </div>
        <div className={`p-2 rounded-full bg-white/20 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Contenu dépliable */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-top-2">
          {/* Introduction ludique */}
          <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-xl p-4 border border-indigo-500/30">
            <p className="text-indigo-300 text-sm flex items-center gap-2">
              <span className="text-xl">🏯</span>
              <span><strong>Le secret des maîtres</strong></span>
            </p>
            <p className="text-slate-300 text-xs mt-2">
              Savoir bien se déplacer, c&apos;est le super-pouvoir des aïkidokas ! C&apos;est comme apprendre une danse secrète qui te rend plus fort et plus agile ! 💪
            </p>
          </div>

          {/* 4 Directions */}
          <div>
            <h5 className="font-bold text-cyan-300 mb-2 flex items-center gap-2">
              <span className="text-lg">🧭</span> Les 4 directions magiques ✨
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {DEPLACEMENTS_DATA.directions.items.map((dir, idx) => (
                <div 
                  key={idx}
                  className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-3 text-center transform hover:scale-105 transition-all cursor-pointer shadow-md"
                >
                  <div className="text-2xl mb-1">
                    {dir.name === 'mae' && '⬆️'}
                    {dir.name === 'ushiro' && '⬇️'}
                    {dir.name === 'migi' && '➡️'}
                    {dir.name === 'hidari' && '⬅️'}
                  </div>
                  <p className="font-bold text-white text-sm uppercase">{dir.name}</p>
                  <p className="text-cyan-100 text-xs">{dir.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Les 3 pas essentiels */}
          <div>
            <h5 className="font-bold text-pink-300 mb-2 flex items-center gap-2">
              <span className="text-lg">👟</span> {DEPLACEMENTS_DATA.troisPas.title} ⭐
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {DEPLACEMENTS_DATA.troisPas.pas.map((pas, idx) => {
                const gradients = [
                  'from-green-500 to-emerald-600',
                  'from-blue-500 to-cyan-600',
                  'from-purple-500 to-pink-600'
                ];
                const emojis = ['🚶', '🏃', '🌀'];
                const shadows = [
                  'shadow-green-500/30',
                  'shadow-blue-500/30',
                  'shadow-purple-500/30'
                ];
                
                return (
                  <div 
                    key={idx}
                    className={`bg-gradient-to-br ${gradients[idx]} rounded-xl p-4 text-center shadow-lg ${shadows[idx]} hover:scale-105 transition-all cursor-pointer`}
                  >
                    <div className="text-3xl mb-2">{emojis[idx]}</div>
                    <h5 className="text-white font-bold">{pas.name}</h5>
                    <p className="text-white/80 text-xs mt-1 line-clamp-2">
                      {pas.description.split('.')[0]}.
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Irimi / Tenkan */}
          <div className="grid grid-cols-2 gap-3">
            {/* Irimi */}
            <div className="bg-gradient-to-br from-green-500/80 to-emerald-600/80 rounded-lg p-4 text-center hover:scale-105 transition-all cursor-pointer">
              <span className="text-3xl">🚀</span>
              <p className="font-bold text-white mt-2">入身 IRIMI</p>
              <p className="text-green-100 text-xs">Entrer directement</p>
            </div>
            {/* Tenkan */}
            <div className="bg-gradient-to-br from-purple-500/80 to-violet-600/80 rounded-lg p-4 text-center hover:scale-105 transition-all cursor-pointer">
              <span className="text-3xl">🔄</span>
              <p className="font-bold text-white mt-2">転換 TENKAN</p>
              <p className="text-purple-100 text-xs">Pivoter / Tourner</p>
            </div>
          </div>

          {/* Astuce ninja */}
          <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 rounded-xl p-3 border border-amber-500/30">
            <p className="text-amber-300 text-sm flex items-center gap-2">
              <span className="text-xl">🐱</span>
              <span><strong>Astuce ninja :</strong> Pose toujours la pointe du pied en premier, comme un chat silencieux !</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeplacementsSection;
