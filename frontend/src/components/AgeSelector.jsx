import React, { useState, useEffect } from 'react';
import { AIKIDO_CHARACTERS } from '@/constants/aikidoCharacters';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL || '';

// Images des personnages 3D cartoon style Pixar en tenue d'Aikido
const JEUNE_NINJA_IMG = AIKIDO_CHARACTERS.JEUNE_NINJA;
const NINJA_CONFIRME_IMG = AIKIDO_CHARACTERS.NINJA_CONFIRME;
const HOMME_IMG = AIKIDO_CHARACTERS.HOMME_SEUL;
const FEMME_IMG = AIKIDO_CHARACTERS.FEMME_SEULE;
const ENFANT_SALUT_IMG = AIKIDO_CHARACTERS.ENFANT_SALUT;

/**
 * AgeSelector - Écran de sélection du mode (Enfant/Adulte)
 * Stocke le choix en localStorage pour personnaliser l'expérience
 * 100% RGPD-compatible : aucune donnée envoyée au serveur
 */
const AgeSelector = ({ onSelect }) => {
  const [stats, setStats] = useState({ 
    total_techniques: 200, 
    grades_label: "6 Kyu + 1 Dan",
    total_grades: 7,
    total_challenges: 84
  });

  useEffect(() => {
    // Récupérer les statistiques publiques depuis l'API
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API}/api/public-stats`);
        setStats(response.data);
      } catch (error) {
        console.log("Using default stats");
      }
    };
    fetchStats();
  }, []);

  const handleSelect = (mode) => {
    localStorage.setItem('ninja-aikido-mode', mode);
    if (onSelect) {
      onSelect(mode);
    }
  };

  return (
    <div className="px-4 py-6 sm:py-8">
      {/* VARIANTE D - Hero Banner COMPLET avec statistiques 200+ techniques, personnages et CTA */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8 shadow-2xl border-2 border-orange-400/60">
        
        {/* Personnage Femme à gauche */}
        <div className="absolute left-0 bottom-0 hidden xl:block z-20 pointer-events-none overflow-hidden rounded-bl-3xl">
          <img 
            src={FEMME_IMG} 
            alt="Sensei Femme" 
            className="h-56 object-cover object-top"
            style={{
              maskImage: 'linear-gradient(to right, black 50%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, black 50%, transparent 100%)'
            }}
          />
        </div>
        
        {/* Personnage Homme à droite */}
        <div className="absolute right-0 bottom-0 hidden xl:block z-20 pointer-events-none overflow-hidden rounded-br-3xl">
          <img 
            src={HOMME_IMG} 
            alt="Sensei Homme" 
            className="h-56 object-cover object-top"
            style={{
              maskImage: 'linear-gradient(to left, black 50%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, black 50%, transparent 100%)'
            }}
          />
        </div>
        
        {/* Idéogrammes japonais en arrière-plan transparent */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.06] pointer-events-none select-none">
          <div 
            className="absolute inset-0 text-white font-serif whitespace-nowrap"
            style={{ 
              fontFamily: "'Noto Serif JP', serif",
              fontSize: '4rem',
              lineHeight: '1.2',
              letterSpacing: '0.5rem'
            }}
          >
            <div className="absolute top-0 left-0 transform -rotate-12">
              合気道 武道 氣 和 心 道 技 礼 仁 義 忠 信 勇 徳 
            </div>
            <div className="absolute bottom-16 right-10 transform rotate-12">
              合気道 武道 氣 和 心 道 技 礼 仁 義
            </div>
          </div>
        </div>
        
        <div className="relative z-10">
          {/* Badge */}
          <div className="text-center mb-4">
            <span className="inline-block px-4 py-1.5 bg-amber-400 text-slate-900 rounded-full text-xs font-bold shadow-lg">
              🥋 La 1ère app européenne de gamification à la pratique de l'Aikido
            </span>
          </div>
          
          {/* Titre principal */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white text-center mb-4">
            Aikido@Game
          </h1>
          
          {/* Sous-titre */}
          <p className="text-lg sm:text-xl text-white/90 text-center max-w-2xl mx-auto mb-6">
            <strong>Transformez votre pratique en aventure.</strong>
            <span className="block text-white/70 mt-1">
              Progressez, relevez des défis, atteignez vos objectifs.
            </span>
          </p>
          
          {/* STATISTIQUES DYNAMIQUES depuis la base de données */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-6">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <p className="text-2xl sm:text-3xl font-black text-amber-300">{stats.total_techniques}+</p>
              <p className="text-white/80 text-xs sm:text-sm font-medium">Techniques</p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <p className="text-2xl sm:text-3xl font-black text-white">{stats.total_grades || 7}</p>
              <p className="text-white/80 text-xs sm:text-sm font-medium">{stats.grades_label || "Grades"}</p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <p className="text-2xl sm:text-3xl font-black text-cyan-300">{stats.total_challenges || 84}</p>
              <p className="text-white/80 text-xs sm:text-sm font-medium">Défis</p>
            </div>
          </div>
          
          {/* EXPLICATION DU BUDO - Section éducative */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10 mb-6 max-w-3xl mx-auto">
            <div className="text-center mb-4">
              <span className="text-3xl sm:text-4xl">🥋</span>
              <h3 className="text-lg sm:text-xl font-bold text-amber-300 mt-2">
                Budō (武道) - La Voie Martiale
              </h3>
              <p className="text-white/70 text-xs sm:text-sm mt-1">
                L'Aïkido n'est pas un sport, c'est un <strong className="text-white">Budo</strong>
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {/* Colonne Budo */}
              <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/30">
                <p className="font-bold text-amber-300 mb-2 flex items-center gap-2">
                  <span>☯️</span> Budō - Voie de vie
                </p>
                <ul className="text-white/80 text-xs space-y-1">
                  <li>• Développement personnel et moral</li>
                  <li>• Maîtrise de soi, discipline, respect</li>
                  <li>• Victoire sur soi-même</li>
                  <li>• Chemin de progression à long terme</li>
                </ul>
              </div>
              
              {/* Colonne Sport */}
              <div className="bg-slate-500/10 rounded-xl p-3 border border-slate-500/30">
                <p className="font-bold text-slate-400 mb-2 flex items-center gap-2">
                  <span>🥊</span> Sport de combat
                </p>
                <ul className="text-white/50 text-xs space-y-1">
                  <li>• Performance sportive</li>
                  <li>• Gagner selon des règles</li>
                  <li>• Victoire sur l'adversaire</li>
                  <li>• Résultats mesurables</li>
                </ul>
              </div>
            </div>
            
            <p className="text-center text-white/60 text-xs mt-4 italic">
              "La voie (道) est un chemin de vie autant que physique"
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <button 
              onClick={() => handleSelect('enfant')}
              className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-lg shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
            >
              🥷 Mode Jeune Ninja
            </button>
            <button 
              onClick={() => handleSelect('adulte')}
              className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-lg border-2 border-white/40 backdrop-blur-sm transition-all hover:scale-105"
            >
              🎯 Mode Confirmé
            </button>
          </div>
          
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-xs border border-white/20">
              ✓ 100% Gratuit
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-xs border border-white/20">
              ✓ Sans publicité
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-xs border border-white/20">
              🔒 Conforme RGPD
            </span>
          </div>
        </div>
      </div>

      {/* Section de sélection */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Choisis ton mode pour commencer !
        </h2>
        <p className="text-sm text-slate-400">
          Tu pourras changer à tout moment 🥋
        </p>
      </div>

      {/* Les 2 gros boutons avec images IA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
        
        {/* Bouton ENFANT */}
        <button
          onClick={() => handleSelect('enfant')}
          data-testid="mode-enfant-btn"
          className="group relative overflow-hidden rounded-2xl sm:rounded-3xl
            bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500
            hover:from-orange-400 hover:via-amber-400 hover:to-yellow-400
            transform hover:scale-[1.02] sm:hover:scale-105
            transition-all duration-300 ease-out
            shadow-xl shadow-orange-500/40 hover:shadow-orange-500/60
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
            <div className="absolute inset-0 bg-gradient-to-t from-orange-900/90 via-orange-900/30 to-transparent" />
            
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
