import React from 'react';
import { Lock } from 'lucide-react';

/**
 * VisitorStepsBlocks - Blocs d'accueil pour les visiteurs NON CONNECTÉS
 * 
 * DEUX TEMPLATES DISTINCTS:
 * - MODE ENFANT (Jeune Ninja) : Coloré, ludique, emojis, gamifié
 * - MODE ADULTE (Ninja Confirmé) : Sobre, professionnel, Kanji japonais
 */
const VisitorStepsBlocks = ({ mode = 'enfant', onStepClick }) => {
  
  const isEnfant = mode === 'enfant';

  // ═══════════════════════════════════════════════════════════════════════════════
  // BLOCS VERSION ENFANT - Colorés et ludiques
  // ═══════════════════════════════════════════════════════════════════════════════
  const blocksEnfant = [
    {
      id: 1, slug: 'bienvenue', title: 'Bienvenue !', subtitle: 'Rencontre Maître Tanaka',
      emoji: '👋', gradient: 'from-emerald-500 to-teal-600', shadowColor: 'shadow-emerald-500/40', unlocked: true
    },
    {
      id: 2, slug: 'profil', title: 'Mon Profil', subtitle: 'Ta carte de ninja',
      emoji: '🥷', gradient: 'from-violet-500 to-purple-600', shadowColor: 'shadow-violet-500/40', unlocked: true
    },
    {
      id: 3, slug: 'defis', title: 'Les Défis', subtitle: 'Relève les défis quotidiens',
      emoji: '🎯', gradient: 'from-pink-500 to-rose-600', shadowColor: 'shadow-pink-500/40', unlocked: true
    },
    {
      id: 4, slug: 'vertus', title: 'Les 7 Vertus', subtitle: 'Les super-pouvoirs du ninja',
      emoji: '☯️', gradient: 'from-amber-500 to-orange-600', shadowColor: 'shadow-amber-500/40', unlocked: true
    },
    {
      id: 5, slug: 'techniques', title: 'Les Techniques', subtitle: 'Apprends les mouvements',
      emoji: '🥋', gradient: 'from-cyan-500 to-blue-600', shadowColor: 'shadow-cyan-500/40', unlocked: false
    },
    {
      id: 6, slug: 'ceintures', title: 'Les Ceintures', subtitle: 'Ta progression de grade',
      emoji: '🎖️', gradient: 'from-slate-500 to-slate-700', shadowColor: 'shadow-slate-500/40', unlocked: false
    },
    {
      id: 7, slug: 'histoire', title: "L'Histoire", subtitle: "Les origines de l'Aïkido",
      emoji: '📜', gradient: 'from-amber-600 to-yellow-700', shadowColor: 'shadow-amber-600/40', unlocked: false
    },
    {
      id: 8, slug: 'trophees', title: 'Mes Trophées', subtitle: 'Badges et récompenses',
      emoji: '🏆', gradient: 'from-yellow-500 to-amber-600', shadowColor: 'shadow-yellow-500/40', unlocked: false
    }
  ];

  // ═══════════════════════════════════════════════════════════════════════════════
  // BLOCS VERSION ADULTE - Sobres avec Kanji japonais
  // ═══════════════════════════════════════════════════════════════════════════════
  const blocksAdulte = [
    {
      id: 1, slug: 'inscription', title: 'Inscription', subtitle: 'Créez votre compte',
      kanji: '登', kanjiMeaning: 'Monter', accentColor: 'border-l-emerald-500', unlocked: true
    },
    {
      id: 2, slug: 'programme', title: 'Programme', subtitle: '206+ techniques par grade',
      kanji: '技', kanjiMeaning: 'Technique', accentColor: 'border-l-cyan-500', unlocked: true
    },
    {
      id: 3, slug: 'progression', title: 'Progression', subtitle: 'Suivez votre parcours',
      kanji: '進', kanjiMeaning: 'Avancer', accentColor: 'border-l-amber-500', unlocked: true
    },
    {
      id: 4, slug: 'vertus', title: 'Les 7 Vertus', subtitle: 'Philosophie du Budo',
      kanji: '徳', kanjiMeaning: 'Vertu', accentColor: 'border-l-violet-500', unlocked: true
    },
    {
      id: 5, slug: 'grades', title: 'Grades', subtitle: 'Du 6e Kyu au 4e Dan',
      kanji: '段', kanjiMeaning: 'Grade', accentColor: 'border-l-blue-500', unlocked: false
    },
    {
      id: 6, slug: 'objectifs', title: 'Objectifs', subtitle: 'Défis personnalisés',
      kanji: '目', kanjiMeaning: 'Objectif', accentColor: 'border-l-pink-500', unlocked: false
    },
    {
      id: 7, slug: 'histoire', title: 'Histoire', subtitle: "O'Sensei & traditions",
      kanji: '歴', kanjiMeaning: 'Histoire', accentColor: 'border-l-orange-500', unlocked: false
    },
    {
      id: 8, slug: 'certifications', title: 'Certifications', subtitle: 'Validez vos acquis',
      kanji: '証', kanjiMeaning: 'Certificat', accentColor: 'border-l-red-500', unlocked: false
    }
  ];

  const blocks = isEnfant ? blocksEnfant : blocksAdulte;

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDU VERSION ENFANT - Coloré et ludique
  // ═══════════════════════════════════════════════════════════════════════════════
  if (isEnfant) {
    return (
      <div className="mb-4" data-testid="visitor-steps-blocks-enfant">
        {/* Titre */}
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
            🎮 Ton Parcours Ninja en 8 étapes ! 🎮
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Découvre tout ce qui t'attend ! 🥷
          </p>
        </div>

        {/* Grille des 8 blocs colorés */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {blocksEnfant.map((block) => (
            <button
              key={block.id}
              onClick={() => {
                const event = new CustomEvent('openAuthDialog');
                window.dispatchEvent(event);
              }}
              data-testid={`visitor-block-${block.slug}`}
              className={`
                relative group aspect-square rounded-2xl sm:rounded-3xl p-3 sm:p-4
                flex flex-col items-center justify-center transition-all duration-300 overflow-hidden
                ${block.unlocked 
                  ? `bg-gradient-to-br ${block.gradient} shadow-xl ${block.shadowColor} border-2 border-white/20 hover:border-white/40 hover:scale-105 hover:-translate-y-2 cursor-pointer`
                  : 'bg-slate-800/50 border-2 border-slate-700 cursor-pointer hover:bg-slate-800/70'
                }
              `}
            >
              {/* Numéro */}
              <div className={`absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                ${block.unlocked ? 'bg-white/20' : 'bg-slate-700'}`}>
                <span className={`text-lg sm:text-xl font-black ${block.unlocked ? 'text-white' : 'text-slate-500'}`}>
                  {block.id}
                </span>
              </div>

              {/* Cadenas */}
              {!block.unlocked && (
                <div className="absolute top-2 right-2 bg-slate-600 rounded-full p-1">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
              )}

              {/* Emoji */}
              <span className={`mb-1 sm:mb-2 group-hover:scale-110 transition-transform text-4xl sm:text-5xl ${
                !block.unlocked ? 'grayscale opacity-50' : ''
              }`}>
                {block.emoji}
              </span>

              {/* Titre */}
              <span className={`font-bold text-center leading-tight text-xs sm:text-sm ${
                block.unlocked ? 'text-white' : 'text-slate-500'
              }`}>
                {block.title}
              </span>

              {/* Sous-titre */}
              <span className={`text-center mt-0.5 sm:mt-1 text-[10px] sm:text-xs ${
                block.unlocked ? 'text-white/70' : 'text-slate-600'
              }`}>
                {block.subtitle}
              </span>

              {/* Effet brillance */}
              {block.unlocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                  -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              )}
            </button>
          ))}
        </div>

        {/* Barre de progression */}
        <div className="mt-4 px-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-slate-400 text-xs">Progression du parcours</span>
            <span className="text-amber-400 text-xs font-bold">0 / 8 étapes</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 rounded-full" style={{ width: '0%' }} />
          </div>
        </div>

        {/* Message */}
        <p className="text-center mt-3 text-slate-400 text-sm">
          🔓 Inscris-toi pour débloquer ton parcours !
        </p>

        {/* CTA */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={() => {
              const event = new CustomEvent('openAuthDialog');
              window.dispatchEvent(event);
            }}
            data-testid="cta-start-adventure"
            className="group relative overflow-hidden px-8 sm:px-12 py-4 rounded-2xl font-bold text-lg
              bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 text-slate-900 
              shadow-xl shadow-amber-500/40 hover:shadow-amber-500/60
              transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
              -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative flex items-center gap-3">
              <span className="text-2xl">🥷</span>
              <span>Créer mon compte Ninja</span>
              <span className="text-2xl">🚀</span>
            </span>
          </button>
          <p className="text-slate-500 text-xs">✨ C'est gratuit et ça prend 30 secondes !</p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDU VERSION ADULTE - Sobre et professionnel avec Kanji
  // ═══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="mb-4" data-testid="visitor-steps-blocks-adulte">
      {/* En-tête sobre */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-1">
          Votre parcours Aikido
        </h2>
        <p className="text-slate-400 text-sm">
          Programme complet du 6e Kyu au 4e Dan
        </p>
      </div>

      {/* Grille des 8 blocs sobres avec Kanji */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {blocksAdulte.map((block) => (
          <button
            key={block.id}
            onClick={() => {
              const event = new CustomEvent('openAuthDialog');
              window.dispatchEvent(event);
            }}
            data-testid={`visitor-block-${block.slug}`}
            className={`
              relative group
              aspect-[4/3] sm:aspect-square
              rounded-xl
              p-4
              flex flex-col items-center justify-center
              transition-all duration-300
              border-l-4 ${block.accentColor}
              ${block.unlocked 
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg hover:shadow-xl hover:from-slate-700 hover:to-slate-800 cursor-pointer'
                : 'bg-slate-900/50 opacity-60 cursor-pointer hover:opacity-80'
              }
            `}
          >
            {/* Numéro discret */}
            <div className={`absolute top-2 left-3 text-xs font-medium ${block.unlocked ? 'text-slate-500' : 'text-slate-600'}`}>
              {block.id.toString().padStart(2, '0')}
            </div>

            {/* Cadenas */}
            {!block.unlocked && (
              <div className="absolute top-2 right-2">
                <Lock className="w-4 h-4 text-slate-600" />
              </div>
            )}

            {/* Kanji central */}
            <span 
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 transition-transform group-hover:scale-110 ${
                block.unlocked ? 'text-white/90' : 'text-slate-600'
              }`}
              style={{ fontFamily: "'Noto Serif JP', serif" }}
            >
              {block.kanji}
            </span>

            {/* Titre */}
            <span className={`font-semibold text-center text-sm ${
              block.unlocked ? 'text-white' : 'text-slate-500'
            }`}>
              {block.title}
            </span>

            {/* Sous-titre */}
            <span className={`text-center text-[10px] sm:text-xs mt-1 ${
              block.unlocked ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {block.subtitle}
            </span>

            {/* Signification du Kanji */}
            <span className={`absolute bottom-2 text-[9px] italic ${
              block.unlocked ? 'text-slate-500' : 'text-slate-700'
            }`}>
              {block.kanjiMeaning}
            </span>
          </button>
        ))}
      </div>

      {/* Statistiques sobres */}
      <div className="mt-6 grid grid-cols-3 gap-4 px-4">
        <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="text-2xl font-bold text-cyan-400">206+</div>
          <div className="text-xs text-slate-400">Techniques</div>
        </div>
        <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="text-2xl font-bold text-amber-400">10</div>
          <div className="text-xs text-slate-400">Grades (6 Kyu + 4 Dan)</div>
        </div>
        <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="text-2xl font-bold text-violet-400">84</div>
          <div className="text-xs text-slate-400">Défis</div>
        </div>
      </div>

      {/* Citation philosophique */}
      <div className="mt-6 text-center px-4">
        <p className="text-slate-400 text-sm italic border-l-2 border-amber-500/50 pl-4 py-2 bg-slate-800/30 rounded-r-lg">
          "L'Aïkido n'est pas seulement un sport, c'est un <span className="text-amber-400 font-semibold">Budo</span> — la Voie du guerrier."
        </p>
      </div>

      {/* CTA sobre */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <button
          onClick={() => {
            const event = new CustomEvent('openAuthDialog');
            window.dispatchEvent(event);
          }}
          data-testid="cta-start-adventure-adulte"
          className="group relative overflow-hidden px-8 py-3 rounded-xl font-semibold
            bg-gradient-to-r from-slate-700 to-slate-800 text-white border border-slate-600
            shadow-lg hover:shadow-xl hover:border-cyan-500/50
            transform hover:scale-[1.02] transition-all duration-300"
        >
          <span className="relative flex items-center gap-2">
            <span>Créer mon compte gratuitement</span>
            <span className="text-cyan-400">→</span>
          </span>
        </button>
        
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">✓ 30 jours offerts</span>
          <span className="flex items-center gap-1">✓ Sans publicité</span>
          <span className="flex items-center gap-1">🔒 Conforme RGPD</span>
        </div>
      </div>
    </div>
  );
};

export default VisitorStepsBlocks;
