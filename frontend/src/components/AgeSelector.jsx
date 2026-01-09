import React from 'react';

// Images des personnages 3D cartoon style Pixar en tenue d'Aikido
const JEUNE_NINJA_IMG = "https://static.prod-images.emergentagent.com/jobs/0861cc2c-f338-47d7-8ee3-39d115cba3cc/images/7a1daf46a57ead9f272f2abfa021b9093277cf586a19a7ccea9471f4461c19ae.png";
const NINJA_CONFIRME_IMG = "https://static.prod-images.emergentagent.com/jobs/0861cc2c-f338-47d7-8ee3-39d115cba3cc/images/11511822157d76c591ac8107c5dc1cd0fbe68fdec64747472c56fa176ae705d0.png";

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
    <div className="px-4 py-6 sm:py-8">
      {/* Hero Banner Bleu - Identique aux autres pages */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 rounded-3xl p-6 sm:p-8 md:p-10 mb-6 sm:mb-8 shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-4 text-5xl sm:text-7xl">🥋</div>
          <div className="absolute bottom-2 right-4 text-5xl sm:text-7xl">☯️</div>
        </div>
        
        <div className="relative text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 sm:mb-3">
            🥋 Aikido@Game
          </h1>
          <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto">
            Votre parcours Aikido interactif et ludique
          </p>
        </div>
      </div>

      {/* Section de sélection */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Choisis ton mode pour commencer !
        </h2>
        <p className="text-sm text-slate-400">
          Tu pourras changer à tout moment ⚙️
        </p>
      </div>

      {/* Les 2 gros boutons avec images IA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
        
        {/* Bouton ENFANT */}
        <button
          onClick={() => handleSelect('enfant')}
          data-testid="mode-enfant-btn"
          className="group relative overflow-hidden rounded-2xl sm:rounded-3xl
            bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500
            hover:from-pink-400 hover:via-purple-400 hover:to-indigo-400
            transform hover:scale-[1.02] sm:hover:scale-105
            transition-all duration-300 ease-out
            shadow-xl shadow-purple-500/40 hover:shadow-purple-500/60
            border-2 border-white/20 hover:border-white/40"
        >
          {/* Image Agent IA */}
          <div className="relative">
            <img 
              src={JEUNE_NINJA_IMG} 
              alt="Jeune Ninja - Agent IA"
              className="w-full h-48 sm:h-56 md:h-64 object-cover object-top"
            />
            {/* Overlay gradient pour lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/30 to-transparent" />
            
            {/* Étoiles décoratives */}
            <div className="absolute top-3 right-3 text-xl sm:text-2xl animate-pulse">✨</div>
            <div className="absolute top-3 left-3 text-xl sm:text-2xl">⭐</div>
          </div>
          
          {/* Contenu texte */}
          <div className="relative z-10 p-4 sm:p-5 -mt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
              Jeune Ninja
            </h2>
            <p className="text-white/80 text-sm mb-2">
              Moins de 14 ans
            </p>
            <div className="flex justify-center gap-2 text-xl">
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
          className="group relative overflow-hidden rounded-2xl sm:rounded-3xl
            bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900
            hover:from-slate-600 hover:via-slate-700 hover:to-slate-800
            transform hover:scale-[1.02] sm:hover:scale-105
            transition-all duration-300 ease-out
            shadow-xl shadow-slate-900/60 hover:shadow-slate-700/60
            border-2 border-amber-500/30 hover:border-amber-400/50"
        >
          {/* Image Agent IA */}
          <div className="relative">
            <img 
              src={NINJA_CONFIRME_IMG} 
              alt="Ninja Confirmé - Agent IA"
              className="w-full h-48 sm:h-56 md:h-64 object-cover object-top"
            />
            {/* Overlay gradient pour lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
            
            {/* Symboles décoratifs */}
            <div className="absolute top-3 right-3 text-xl sm:text-2xl text-amber-400/80">☯️</div>
            <div className="absolute top-3 left-3 text-xl sm:text-2xl text-amber-400/80">🥋</div>
          </div>
          
          {/* Contenu texte */}
          <div className="relative z-10 p-4 sm:p-5 -mt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
              Ninja Confirmé
            </h2>
            <p className="text-slate-400 text-sm mb-2">
              Plus de 14 ans
            </p>
            <div className="flex justify-center gap-2 text-xl">
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
      <p className="mt-6 text-xs text-slate-500 text-center max-w-md mx-auto">
        🔒 Aucune donnée personnelle n'est collectée. Ton choix est enregistré uniquement sur ton appareil.
      </p>
    </div>
  );
};

export default AgeSelector;
