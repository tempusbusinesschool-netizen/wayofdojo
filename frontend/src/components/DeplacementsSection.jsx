import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DEPLACEMENTS_DATA } from '@/constants';

/**
 * DeplacementsSection - Section des déplacements d'Aikido
 * Affichage ludique des 4 directions et des techniques de déplacement
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
            <h4 className="font-bold text-fuchsia-300 text-lg">Les Déplacements</h4>
            <p className="text-slate-400 text-sm">Apprends à te déplacer comme un ninja !</p>
          </div>
        </div>
        <div className={`p-2 rounded-full bg-white/20 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Contenu dépliable */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-top-2">
          {/* 4 Directions */}
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
                <p className="font-bold text-white text-xs">{dir.japanese}</p>
                <p className="text-cyan-100 text-xs">{dir.french}</p>
              </div>
            ))}
          </div>

          {/* Tai Sabaki */}
          <div>
            <h5 className="font-bold text-pink-300 mb-2 flex items-center gap-2">
              <span className="text-lg">🔄</span> {DEPLACEMENTS_DATA.taiSabaki.title}
            </h5>
            <div className="grid grid-cols-2 gap-2">
              {DEPLACEMENTS_DATA.taiSabaki.items.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-gradient-to-br from-pink-500/80 to-rose-600/80 rounded-lg p-3 hover:from-pink-400 hover:to-rose-500 transition-all cursor-pointer"
                >
                  <p className="font-bold text-white text-sm">{item.japanese}</p>
                  <p className="text-pink-100 text-xs">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Irimi / Tenkan */}
          <div className="grid grid-cols-2 gap-3">
            {/* Irimi */}
            <div className="bg-gradient-to-br from-green-500/80 to-emerald-600/80 rounded-lg p-3 text-center">
              <span className="text-2xl">🚀</span>
              <p className="font-bold text-white mt-1">入身 IRIMI</p>
              <p className="text-green-100 text-xs">Entrer direct</p>
            </div>
            {/* Tenkan */}
            <div className="bg-gradient-to-br from-purple-500/80 to-violet-600/80 rounded-lg p-3 text-center">
              <span className="text-2xl">🔄</span>
              <p className="font-bold text-white mt-1">転換 TENKAN</p>
              <p className="text-purple-100 text-xs">Pivoter</p>
            </div>
          </div>

          {/* Ashi Sabaki */}
          <div>
            <h5 className="font-bold text-amber-300 mb-2 flex items-center gap-2">
              <span className="text-lg">👟</span> {DEPLACEMENTS_DATA.ashiSabaki.title}
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {DEPLACEMENTS_DATA.ashiSabaki.items.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-gradient-to-br from-amber-500/80 to-orange-600/80 rounded-lg p-2 hover:from-amber-400 hover:to-orange-500 transition-all cursor-pointer"
                >
                  <p className="font-bold text-white text-xs">{item.japanese}</p>
                  <p className="text-amber-100 text-xs truncate">{item.description}</p>
                </div>
              ))}
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
