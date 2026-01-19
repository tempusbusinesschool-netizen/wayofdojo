'use client';

import React, { useState } from 'react';
import { Lock, ChevronRight, Sparkles, Eye, X } from 'lucide-react';

/**
 * VisitorStepsBlocks - Présentation du VRAI CONTENU pour visiteurs NON CONNECTÉS
 * 
 * OBJECTIF : Montrer le contenu RÉEL de l'application (aperçu) pour donner envie de s'inscrire
 * Les blocs affichent des VRAIES DONNÉES mais la gamification NE FONCTIONNE PAS
 * Cliquer ouvre un aperçu du contenu puis invite à s'inscrire
 */

interface Block {
  id: number;
  slug: string;
  emoji?: string;
  kanji?: string;
  kanjiMeaning?: string;
  title: string;
  gradient?: string;
  shadowColor?: string;
  accentColor?: string;
  previewContent: React.ReactNode;
}

interface VisitorStepsBlocksProps {
  mode?: 'enfant' | 'adulte';
  onSignupClick?: () => void;
}

export const VisitorStepsBlocks: React.FC<VisitorStepsBlocksProps> = ({ 
  mode = 'enfant', 
  onSignupClick 
}) => {
  const isEnfant = mode === 'enfant';
  const [previewBlock, setPreviewBlock] = useState<Block | null>(null);

  // Ouvrir le dialogue d'inscription
  const handleSignupClick = () => {
    if (onSignupClick) {
      onSignupClick();
    }
  };

  // Vraies techniques d'Aïkido
  const realTechniques = [
    { name: "Ikkyo", grade: "6e Kyu", emoji: "🥋" },
    { name: "Shiho Nage", grade: "5e Kyu", emoji: "🌀" },
    { name: "Irimi Nage", grade: "4e Kyu", emoji: "💨" },
    { name: "Kote Gaeshi", grade: "3e Kyu", emoji: "🔄" },
    { name: "Kaiten Nage", grade: "2e Kyu", emoji: "🌪️" },
    { name: "Nikyo", grade: "6e Kyu", emoji: "✋" },
  ];

  // Vrais défis quotidiens
  const realChallenges = [
    { name: "Salut Parfait", xp: 10, emoji: "🙇", desc: "Fais un salut sincère au dojo" },
    { name: "Gardien du Tatami", xp: 15, emoji: "🧹", desc: "Aide à ranger le tatami" },
    { name: "Première Chute", xp: 20, emoji: "🔄", desc: "Réussir 5 ukemi avant" },
    { name: "Ninja Ponctuel", xp: 10, emoji: "⏰", desc: "Arrive à l'heure au cours" },
  ];

  // Vraies 7 Vertus avec animaux
  const realVirtues = [
    { name: "Respect", kanji: "礼", emoji: "🙏", animal: "🦁", color: "from-yellow-400 to-amber-500" },
    { name: "Courage", kanji: "勇", emoji: "💪", animal: "🐯", color: "from-orange-400 to-red-500" },
    { name: "Maîtrise", kanji: "克", emoji: "🧘", animal: "🐢", color: "from-green-400 to-emerald-500" },
    { name: "Humilité", kanji: "謙", emoji: "🌱", animal: "🐘", color: "from-violet-400 to-purple-500" },
    { name: "Bienveillance", kanji: "仁", emoji: "💝", animal: "🐼", color: "from-blue-400 to-cyan-500" },
    { name: "Attention", kanji: "注", emoji: "👁️", animal: "🦉", color: "from-pink-400 to-rose-500" },
    { name: "Responsabilité", kanji: "責", emoji: "⚖️", animal: "🦅", color: "from-teal-400 to-cyan-500" },
  ];

  // Vraies ceintures
  const realBelts = [
    { name: "Blanche", grade: "6e Kyu", color: "bg-white", emoji: "⚪", techniques: 15 },
    { name: "Jaune", grade: "5e Kyu", color: "bg-yellow-400", emoji: "🟡", techniques: 20 },
    { name: "Orange", grade: "4e Kyu", color: "bg-orange-500", emoji: "🟠", techniques: 25 },
    { name: "Verte", grade: "3e Kyu", color: "bg-green-500", emoji: "🟢", techniques: 30 },
    { name: "Bleue", grade: "2e Kyu", color: "bg-blue-500", emoji: "🔵", techniques: 35 },
    { name: "Marron", grade: "1er Kyu", color: "bg-amber-700", emoji: "🟤", techniques: 40 },
    { name: "Noire", grade: "Shodan", color: "bg-slate-900", emoji: "⚫", techniques: 50 },
  ];

  // Vrais badges/trophées
  const realTrophies = [
    { name: "Premier Salut", emoji: "🙇", desc: "Ton 1er salut sincère" },
    { name: "10 Techniques", emoji: "🎯", desc: "Maîtrise 10 techniques" },
    { name: "Semaine Parfaite", emoji: "🔥", desc: "7 jours d'affilée" },
    { name: "Gardien du Tatami", emoji: "🛡️", desc: "Aide 10 fois au rangement" },
    { name: "Lion Noble", emoji: "🦁", desc: "Niveau 5 en Respect" },
  ];

  // Blocs version enfant
  const blocksEnfant: Block[] = [
    {
      id: 1, slug: 'profil', emoji: '🥷', title: 'Mon Profil Ninja',
      gradient: 'from-violet-500 to-purple-600', shadowColor: 'shadow-violet-500/40',
      previewContent: (
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-violet-600/30 rounded-lg p-3">
            <div className="text-4xl">🥷</div>
            <div>
              <p className="text-white font-bold">Niveau : Apprenti Ninja</p>
              <p className="text-violet-200 text-sm">125 XP • Ceinture Blanche</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <p className="text-2xl">🦁</p>
              <p className="text-white text-xs">Animal Gardien</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <p className="text-2xl">🔥 7</p>
              <p className="text-white text-xs">Jours d&apos;affilée</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2, slug: 'techniques', emoji: '🥋', title: '206+ Techniques',
      gradient: 'from-cyan-500 to-blue-600', shadowColor: 'shadow-cyan-500/40',
      previewContent: (
        <div className="space-y-2">
          {realTechniques.slice(0, 4).map((tech, i) => (
            <div key={i} className="flex items-center justify-between bg-white/10 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <span>{tech.emoji}</span>
                <span className="text-white font-medium text-sm">{tech.name}</span>
              </div>
              <span className="text-cyan-200 text-xs">{tech.grade}</span>
            </div>
          ))}
          <p className="text-center text-cyan-200 text-xs">+ 200 autres techniques...</p>
        </div>
      )
    },
    {
      id: 3, slug: 'defis', emoji: '🎯', title: 'Défis Quotidiens',
      gradient: 'from-pink-500 to-rose-600', shadowColor: 'shadow-pink-500/40',
      previewContent: (
        <div className="space-y-2">
          {realChallenges.map((challenge, i) => (
            <div key={i} className="flex items-center justify-between bg-white/10 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <span>{challenge.emoji}</span>
                <div>
                  <p className="text-white font-medium text-sm">{challenge.name}</p>
                  <p className="text-pink-200 text-[10px]">{challenge.desc}</p>
                </div>
              </div>
              <span className="bg-amber-500 text-slate-900 text-xs px-2 py-0.5 rounded-full font-bold">+{challenge.xp} XP</span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 4, slug: 'vertus', emoji: '☯️', title: 'Les 7 Vertus',
      gradient: 'from-amber-500 to-orange-600', shadowColor: 'shadow-amber-500/40',
      previewContent: (
        <div className="grid grid-cols-2 gap-2">
          {realVirtues.slice(0, 6).map((virtue, i) => (
            <div key={i} className={`bg-gradient-to-r ${virtue.color} rounded-lg p-2 text-center`}>
              <div className="flex justify-center gap-1 text-lg">
                <span>{virtue.emoji}</span>
                <span>{virtue.animal}</span>
              </div>
              <p className="text-white text-xs font-bold">{virtue.name}</p>
            </div>
          ))}
          <div className="col-span-2 text-center text-amber-200 text-xs">
            Chaque vertu a son animal gardien qui évolue ! 🌟
          </div>
        </div>
      )
    },
    {
      id: 5, slug: 'ceintures', emoji: '🎖️', title: 'Les Ceintures',
      gradient: 'from-slate-500 to-slate-700', shadowColor: 'shadow-slate-500/40',
      previewContent: (
        <div className="space-y-1.5">
          {realBelts.map((belt, i) => (
            <div key={i} className="flex items-center justify-between bg-white/10 rounded-lg p-1.5">
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full ${belt.color}`}></span>
                <span className="text-white text-sm">{belt.emoji} {belt.name}</span>
              </div>
              <span className="text-slate-300 text-xs">{belt.techniques} tech.</span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 6, slug: 'histoire', emoji: '📜', title: "Histoire de l'Aïkido",
      gradient: 'from-amber-600 to-yellow-700', shadowColor: 'shadow-amber-600/40',
      previewContent: (
        <div className="space-y-3">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-4xl mb-2">👴🏻</p>
            <p className="text-amber-200 font-bold">O&apos;Sensei Morihei Ueshiba</p>
            <p className="text-amber-100 text-xs">1883 - 1969</p>
            <p className="text-white/70 text-xs mt-2">Fondateur de l&apos;Aïkido</p>
          </div>
        </div>
      )
    },
    {
      id: 7, slug: 'trophees', emoji: '🏆', title: 'Trophées & Badges',
      gradient: 'from-yellow-500 to-amber-600', shadowColor: 'shadow-yellow-500/40',
      previewContent: (
        <div className="space-y-2">
          {realTrophies.map((trophy, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
              <span className="text-2xl">{trophy.emoji}</span>
              <div>
                <p className="text-white font-medium text-sm">{trophy.name}</p>
                <p className="text-amber-200 text-[10px]">{trophy.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 8, slug: 'parents', emoji: '👨‍👩‍👧', title: 'Espace Parents',
      gradient: 'from-emerald-500 to-teal-600', shadowColor: 'shadow-emerald-500/40',
      previewContent: (
        <div className="space-y-3">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">👶</span>
              <div>
                <p className="text-white font-bold">Progression de Lucas</p>
                <p className="text-emerald-200 text-sm">125 XP • 3 défis validés</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Rendu version enfant
  if (isEnfant) {
    return (
      <div className="mb-4" data-testid="visitor-steps-blocks-enfant">
        {/* Titre */}
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
            🎮 Découvre ce qui t&apos;attend ! 🎮
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Clique sur un bloc pour voir un aperçu 👀 • <span className="text-amber-400">Inscris-toi pour tout débloquer !</span>
          </p>
        </div>

        {/* Grille des 8 blocs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {blocksEnfant.map((block) => (
            <button
              key={block.id}
              onClick={() => setPreviewBlock(block)}
              data-testid={`visitor-block-${block.slug}`}
              className={`
                relative group rounded-xl sm:rounded-2xl p-3 sm:p-4 text-left
                transition-all duration-300 overflow-hidden
                bg-gradient-to-br ${block.gradient} shadow-lg ${block.shadowColor} 
                border-2 border-white/20 hover:border-white/50 hover:scale-[1.02] cursor-pointer
                min-h-[160px] sm:min-h-[200px]
              `}
            >
              {/* Numéro */}
              <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                <span className="text-lg sm:text-2xl font-black text-white drop-shadow-lg">{block.id}</span>
              </div>

              {/* Badge Aperçu */}
              <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-white/25 backdrop-blur-sm text-white text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1">
                <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="hidden sm:inline">Aperçu</span>
              </div>

              {/* Header */}
              <div className="flex items-center gap-2 sm:gap-3 mb-2 mt-6 sm:mt-8">
                <span className="text-3xl sm:text-4xl">{block.emoji}</span>
                <h3 className="font-black text-white text-sm sm:text-lg leading-tight drop-shadow-md">{block.title}</h3>
              </div>

              {/* Bouton Voir plus */}
              <div className="absolute bottom-2 right-2 bg-white/30 text-white text-[9px] sm:text-[10px] px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Voir</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>

        {/* CTA inscription */}
        <div className="mt-4 sm:mt-6 flex flex-col items-center gap-2 sm:gap-3">
          <button
            onClick={handleSignupClick}
            data-testid="cta-start-adventure"
            className="group relative overflow-hidden px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg
              bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 text-slate-900 
              shadow-xl shadow-amber-500/40 hover:shadow-amber-500/60
              transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
          >
            <span className="relative flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">🥷</span>
              <span>Créer mon compte Ninja</span>
              <span className="text-xl sm:text-2xl">🚀</span>
            </span>
          </button>
          <p className="text-slate-500 text-[10px] sm:text-xs">✨ C&apos;est gratuit et ça prend 30 secondes !</p>
        </div>

        {/* Modal d'aperçu */}
        {previewBlock && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewBlock(null)}
          >
            <div 
              className={`relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br ${previewBlock.gradient}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{previewBlock.emoji}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{previewBlock.title}</h3>
                      <p className="text-white/70 text-sm">Aperçu du contenu</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPreviewBlock(null)}
                    className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-4">
                {previewBlock.previewContent}
              </div>

              {/* Footer */}
              <div className="p-4 bg-black/20 border-t border-white/10">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Inscris-toi pour débloquer !</span>
                  </div>
                  <button
                    onClick={handleSignupClick}
                    className="bg-white text-slate-900 font-bold px-4 py-2 rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>S&apos;inscrire</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Version adulte (similaire mais sobre)
  return (
    <div className="mb-4" data-testid="visitor-steps-blocks-adulte">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-1">
          Contenu de la plateforme
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Cliquez pour découvrir un aperçu • <span className="text-cyan-400">Inscription gratuite</span>
        </p>
      </div>

      {/* Stats */}
      <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-4 px-2 sm:px-4">
        <div className="text-center p-2 sm:p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="text-xl sm:text-2xl font-bold text-cyan-400">206+</div>
          <div className="text-[10px] sm:text-xs text-slate-400">Techniques</div>
        </div>
        <div className="text-center p-2 sm:p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="text-xl sm:text-2xl font-bold text-amber-400">10</div>
          <div className="text-[10px] sm:text-xs text-slate-400">Grades</div>
        </div>
        <div className="text-center p-2 sm:p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="text-xl sm:text-2xl font-bold text-violet-400">7</div>
          <div className="text-[10px] sm:text-xs text-slate-400">Vertus</div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-4 sm:mt-6 flex flex-col items-center gap-2 sm:gap-3">
        <button
          onClick={handleSignupClick}
          data-testid="cta-start-adventure-adulte"
          className="group relative overflow-hidden px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold
            bg-gradient-to-r from-slate-700 to-slate-800 text-white border border-slate-600
            shadow-lg hover:shadow-xl hover:border-cyan-500/50
            transform hover:scale-[1.02] transition-all duration-300"
        >
          <span className="relative flex items-center gap-2">
            <span>Créer mon compte gratuitement</span>
            <span className="text-cyan-400">→</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default VisitorStepsBlocks;
