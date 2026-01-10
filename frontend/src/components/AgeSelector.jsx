import React, { useState, useEffect } from 'react';
import { AIKIDO_CHARACTERS } from '@/constants/aikidoCharacters';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  const [showBudoDialog, setShowBudoDialog] = useState(false);

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
      {/* VARIANTE 2 - Design minimaliste avec grande typographie */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl mb-6 sm:mb-8 shadow-2xl">
        
        {/* Cercle décoratif en arrière-plan */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="relative p-8 sm:p-10 md:p-12">
          {/* Titre très grand */}
          <div className="text-center mb-8">
            <p className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-2">
              🥋 La 1ère app européenne de gamification Aikido
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight">
              Aikido<span className="text-amber-400">@</span>Game
            </h1>
            <p className="text-slate-400 text-lg sm:text-xl max-w-xl mx-auto">
              Votre parcours Aikido interactif et ludique
            </p>
          </div>
          
          {/* Statistiques avec séparateurs */}
          <div className="flex justify-center items-center gap-6 sm:gap-10 mb-8">
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-black text-amber-400">{stats.total_techniques}+</p>
              <p className="text-slate-500 text-sm mt-1">Techniques</p>
            </div>
            <div className="w-px h-16 bg-slate-700" />
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-black text-white">{stats.total_grades || 7}</p>
              <p className="text-slate-500 text-sm mt-1">{stats.grades_label || "Grades"}</p>
            </div>
            <div className="w-px h-16 bg-slate-700" />
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-black text-cyan-400">{stats.total_challenges || 84}</p>
              <p className="text-slate-500 text-sm mt-1">Défis</p>
            </div>
          </div>
          
          {/* Bouton Budo centré */}
          <div className="text-center mb-6">
            <button
              onClick={() => setShowBudoDialog(true)}
              className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 rounded-2xl text-white text-sm border border-amber-500/30 transition-all"
            >
              <span className="text-xl">☯️</span>
              <span>L'Aïkido n'est pas seulement un sport, c'est un <strong className="text-amber-400">Budo</strong> !</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
          
          {/* Trust badges en ligne */}
          <div className="flex justify-center gap-6 text-slate-500 text-xs">
            <span className="flex items-center gap-1"><span className="text-green-500">✓</span> 100% Gratuit</span>
            <span className="flex items-center gap-1"><span className="text-green-500">✓</span> Sans publicité</span>
            <span className="flex items-center gap-1"><span className="text-amber-500">🔒</span> Conforme RGPD</span>
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

      {/* Dialog Budo */}
      <Dialog open={showBudoDialog} onOpenChange={setShowBudoDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-amber-400 flex items-center gap-3">
              <span className="text-3xl">🥋</span>
              Budō (武道) - La Voie Martiale
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Introduction */}
            <div className="text-center">
              <p className="text-lg text-white/90">
                L'Aïkido n'est pas seulement un sport, c'est un <strong className="text-white">Art martial</strong>, mieux encore c'est un <strong className="text-amber-400">Budo</strong> !
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Le mot signifie littéralement « voie martiale »
              </p>
            </div>

            {/* Comparaison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Colonne Budo */}
              <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30">
                <h4 className="font-bold text-amber-300 mb-3 flex items-center gap-2 text-lg">
                  <span>☯️</span> Budō - Voie de vie
                </h4>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-white">Objectif principal</p>
                    <p className="text-white/70">Développement personnel et moral</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-white">Caractéristiques</p>
                    <ul className="text-white/70 space-y-1 mt-1">
                      <li>• Maîtrise de soi, discipline, respect</li>
                      <li>• Victoire sur soi-même</li>
                      <li>• Progression à long terme</li>
                      <li>• Code éthique (respect, humilité)</li>
                      <li>• Accent sur la forme, la posture, l'intention</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-white">Exemples</p>
                    <p className="text-white/70">Aïkido, Judo, Kendō, Karaté-dō, Kyūdō</p>
                  </div>
                </div>
              </div>
              
              {/* Colonne Sport */}
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                <h4 className="font-bold text-slate-400 mb-3 flex items-center gap-2 text-lg">
                  <span>🥊</span> Sports de combat
                </h4>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-slate-300">Objectif principal</p>
                    <p className="text-slate-400">Performance sportive, gagner un combat</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-slate-300">Caractéristiques</p>
                    <ul className="text-slate-400 space-y-1 mt-1">
                      <li>• Victoire sur l'adversaire</li>
                      <li>• Règlement sportif strict</li>
                      <li>• Résultat mesurable (points, KO)</li>
                      <li>• Performance & classement</li>
                      <li>• Moins de dimension philosophique</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-slate-300">Exemples</p>
                    <p className="text-slate-400">Boxe, MMA, Kickboxing, Lutte</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Résumé */}
            <div className="bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-white/10">
              <h4 className="font-bold text-white mb-3 text-center">⚖️ Résumé</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-amber-300">Budō</p>
                  <p className="text-white/70">Voie de développement personnel</p>
                  <p className="text-white/70">Tradition & philosophie</p>
                  <p className="text-white/70">Victoire sur soi-même</p>
                  <p className="text-white/70">Éthique centrale</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-400">Sport de combat</p>
                  <p className="text-slate-500">Discipline sportive</p>
                  <p className="text-slate-500">Performance & résultat</p>
                  <p className="text-slate-500">Victoire sur l'adversaire</p>
                  <p className="text-slate-500">Règles sportives</p>
                </div>
              </div>
            </div>

            {/* Citation finale */}
            <div className="text-center">
              <p className="text-lg text-amber-300 italic">
                👉 On parle de « voie », un chemin de vie autant que physique.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgeSelector;
