import React from 'react';

/**
 * AgeSelector - Écran de sélection du mode (Enfant/Adulte)
 * Stocke le choix en localStorage pour personnaliser l'expérience
 * 100% RGPD-compatible : aucune donnée envoyée au serveur
 */
const AgeSelector = ({ onSelect }) => {
  const handleSelect = (mode) => {
    localStorage.setItem('ninja-aikido-mode', mode);
    if (onSelect) {
      onSelect(mode);
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Titre principal */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          🥋 Bienvenue sur <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">NINJA-AIKIDO</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 mb-2">
          Choisis ton mode pour commencer l'aventure !
        </p>
        <p className="text-sm text-slate-500">
          Tu pourras changer à tout moment ⚙️
        </p>
      </div>

      {/* Les 2 gros boutons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        
        {/* Bouton ENFANT */}
        <button
          onClick={() => handleSelect('enfant')}
          data-testid="mode-enfant-btn"
          className="group relative overflow-hidden rounded-3xl p-8 sm:p-10
            bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500
            hover:from-pink-400 hover:via-purple-400 hover:to-indigo-400
            transform hover:scale-105 hover:-translate-y-2
            transition-all duration-300 ease-out
            shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60
            border-4 border-white/20 hover:border-white/40"
        >
          {/* Étoiles décoratives */}
          <div className="absolute top-4 right-4 text-2xl animate-pulse">✨</div>
          <div className="absolute bottom-4 left-4 text-2xl animate-bounce">⭐</div>
          <div className="absolute top-1/2 right-6 text-xl animate-ping">🌟</div>
          
          {/* Contenu */}
          <div className="relative z-10 text-center">
            <div className="text-6xl sm:text-7xl mb-4 group-hover:scale-110 transition-transform">
              🧒
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Je suis un Jeune Ninja
            </h2>
            <p className="text-white/80 text-sm sm:text-base">
              Moins de 14 ans
            </p>
            <div className="mt-4 flex justify-center gap-2 text-2xl">
              <span>🎮</span>
              <span>🏆</span>
              <span>🐉</span>
            </div>
          </div>
          
          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
            -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>

        {/* Bouton ADULTE */}
        <button
          onClick={() => handleSelect('adulte')}
          data-testid="mode-adulte-btn"
          className="group relative overflow-hidden rounded-3xl p-8 sm:p-10
            bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900
            hover:from-slate-600 hover:via-slate-700 hover:to-slate-800
            transform hover:scale-105 hover:-translate-y-2
            transition-all duration-300 ease-out
            shadow-2xl shadow-slate-900/60 hover:shadow-slate-700/60
            border-4 border-amber-500/30 hover:border-amber-400/50"
        >
          {/* Symboles décoratifs */}
          <div className="absolute top-4 right-4 text-2xl text-amber-400/60">☯️</div>
          <div className="absolute bottom-4 left-4 text-2xl text-amber-400/60">🥋</div>
          
          {/* Contenu */}
          <div className="relative z-10 text-center">
            <div className="text-6xl sm:text-7xl mb-4 group-hover:scale-110 transition-transform">
              🧑
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Je suis un Ninja Confirmé
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Plus de 14 ans
            </p>
            <div className="mt-4 flex justify-center gap-2 text-2xl">
              <span>📊</span>
              <span>🎯</span>
              <span>📜</span>
            </div>
          </div>
          
          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent 
            -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>
      </div>

      {/* Note RGPD */}
      <p className="mt-8 text-xs text-slate-500 text-center max-w-md">
        🔒 Aucune donnée personnelle n'est collectée. Ton choix est enregistré uniquement sur ton appareil.
      </p>
    </div>
  );
};

export default AgeSelector;
