import React from 'react';

/**
 * VisitorStepsBlocks - Blocs d'accueil pour les visiteurs non connectés
 * Affiche 6 blocs colorés présentant les étapes du jeu
 * Version ENFANT ou ADULTE selon le mode choisi
 */
const VisitorStepsBlocks = ({ mode = 'enfant', onStepClick }) => {
  
  // Blocs version ENFANT - Option C : Étapes du jeu (gamification claire)
  const stepsEnfant = [
    {
      id: 'commence',
      emoji: '🚀',
      title: 'Commence',
      description: 'Crée ton profil Ninja',
      gradient: 'from-emerald-500 to-teal-600',
      shadowColor: 'shadow-emerald-500/40',
      decorEmoji: '✨'
    },
    {
      id: 'apprends',
      emoji: '📚',
      title: 'Apprends',
      description: 'Découvre les techniques',
      gradient: 'from-cyan-500 to-blue-600',
      shadowColor: 'shadow-cyan-500/40',
      decorEmoji: '🥋'
    },
    {
      id: 'entraine',
      emoji: '💪',
      title: 'Entraîne-toi',
      description: 'Pratique au dojo',
      gradient: 'from-amber-400 to-orange-500',
      shadowColor: 'shadow-amber-500/40',
      decorEmoji: '🔥'
    },
    {
      id: 'valide',
      emoji: '✅',
      title: 'Valide',
      description: 'Fais valider par tes parents',
      gradient: 'from-pink-500 to-rose-600',
      shadowColor: 'shadow-pink-500/40',
      decorEmoji: '👨‍👩‍👧'
    },
    {
      id: 'progresse',
      emoji: '🌟',
      title: 'Progresse',
      description: 'Gagne XP et monte de niveau',
      gradient: 'from-violet-500 to-purple-600',
      shadowColor: 'shadow-violet-500/40',
      decorEmoji: '⬆️'
    },
    {
      id: 'maitrise',
      emoji: '👑',
      title: 'Maîtrise',
      description: 'Deviens un vrai Ninja !',
      gradient: 'from-red-500 to-orange-600',
      shadowColor: 'shadow-red-500/40',
      decorEmoji: '🐉'
    }
  ];

  // Blocs version ADULTE (sobre, technique, professionnel) avec Kanji
  const stepsAdulte = [
    {
      id: 'inscription',
      emoji: '📝',
      kanji: '登',
      kanjiMeaning: 'Inscription',
      title: 'Inscription',
      description: 'Créez votre compte',
      gradient: 'from-slate-600 to-slate-700',
      shadowColor: 'shadow-slate-600/40',
      accentColor: 'border-emerald-500/50'
    },
    {
      id: 'programme',
      emoji: '🥋',
      kanji: '技',
      kanjiMeaning: 'Technique',
      title: 'Programme',
      description: 'Techniques par grade',
      gradient: 'from-slate-600 to-slate-700',
      shadowColor: 'shadow-slate-600/40',
      accentColor: 'border-cyan-500/50'
    },
    {
      id: 'progression',
      emoji: '📊',
      kanji: '進',
      kanjiMeaning: 'Progression',
      title: 'Progression',
      description: 'Suivez votre parcours',
      gradient: 'from-slate-600 to-slate-700',
      shadowColor: 'shadow-slate-600/40',
      accentColor: 'border-amber-500/50'
    },
    {
      id: 'vertus',
      emoji: '☯️',
      kanji: '徳',
      kanjiMeaning: 'Vertu',
      title: 'Les 7 Vertus',
      description: 'Philosophie de l\'Aikido',
      gradient: 'from-slate-600 to-slate-700',
      shadowColor: 'shadow-slate-600/40',
      accentColor: 'border-violet-500/50'
    },
    {
      id: 'objectifs',
      emoji: '🎯',
      kanji: '目',
      kanjiMeaning: 'Objectif',
      title: 'Objectifs',
      description: 'Défis quotidiens',
      gradient: 'from-slate-600 to-slate-700',
      shadowColor: 'shadow-slate-600/40',
      accentColor: 'border-pink-500/50'
    },
    {
      id: 'certifications',
      emoji: '📜',
      kanji: '証',
      kanjiMeaning: 'Certificat',
      title: 'Certifications',
      description: 'Validez vos acquis',
      gradient: 'from-slate-600 to-slate-700',
      shadowColor: 'shadow-slate-600/40',
      accentColor: 'border-orange-500/50'
    }
  ];

  const steps = mode === 'enfant' ? stepsEnfant : stepsAdulte;
  const isEnfant = mode === 'enfant';

  return (
    <div className="mb-8" data-testid="visitor-steps-blocks">
      {/* Titre de section */}
      <div className="text-center mb-6">
        {isEnfant ? (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              🎮 Ton Parcours Ninja en 6 étapes ! 🎮
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Suis ce chemin pour devenir un vrai Maître ! 🥷
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Votre parcours Aikido
            </h2>
            <p className="text-slate-400 text-sm">
              Découvrez les étapes de votre progression
            </p>
          </>
        )}
      </div>

      {/* Grille des blocs */}
      <div className={`grid gap-3 sm:gap-4 ${
        isEnfant 
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' 
          : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
      }`}>
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => onStepClick && onStepClick(step.id)}
            data-testid={`visitor-step-${step.id}`}
            className={`
              relative group
              ${isEnfant ? 'aspect-square' : 'aspect-[4/3] sm:aspect-square'}
              rounded-2xl sm:rounded-3xl
              p-3 sm:p-4
              flex flex-col items-center justify-center
              transition-all duration-300
              hover:scale-105 hover:-translate-y-2
              cursor-pointer
              overflow-hidden
              ${isEnfant 
                ? `bg-gradient-to-br ${step.gradient} shadow-xl ${step.shadowColor} border-2 border-white/20 hover:border-white/40`
                : `bg-gradient-to-br ${step.gradient} shadow-lg ${step.shadowColor} border-l-4 ${step.accentColor}`
              }
            `}
          >
            {/* Numéro d'étape */}
            <div className={`absolute top-2 left-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center
              ${isEnfant ? 'bg-white/20' : 'bg-black/20'}`}
            >
              <span className="text-white text-xs sm:text-sm font-bold">{index + 1}</span>
            </div>

            {/* Emoji décoratif (version enfant) */}
            {isEnfant && step.decorEmoji && (
              <div className="absolute top-2 right-2 text-lg opacity-60 group-hover:opacity-100 transition-opacity">
                {step.decorEmoji}
              </div>
            )}

            {/* Emoji principal */}
            <span className={`mb-1 sm:mb-2 group-hover:scale-110 transition-transform
              ${isEnfant ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}`}
            >
              {step.emoji}
            </span>

            {/* Titre */}
            <span className={`text-white font-bold text-center leading-tight
              ${isEnfant ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm'}`}
            >
              {step.title}
            </span>

            {/* Description */}
            <span className={`text-center mt-0.5 sm:mt-1
              ${isEnfant ? 'text-white/70 text-[10px] sm:text-xs' : 'text-slate-400 text-[10px] sm:text-xs'}`}
            >
              {step.description}
            </span>

            {/* Effet de brillance au hover (version enfant) */}
            {isEnfant && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            )}
          </button>
        ))}
      </div>

      {/* Flèche de progression (version enfant) */}
      {isEnfant && (
        <div className="hidden lg:flex items-center justify-center mt-4 px-8">
          <div className="flex-1 h-2 bg-gradient-to-r from-emerald-500 via-pink-500 via-amber-500 via-violet-500 via-cyan-500 to-red-500 rounded-full opacity-60" />
        </div>
      )}

      {/* Message d'encouragement */}
      <p className={`text-center mt-4 ${isEnfant ? 'text-slate-400 text-sm' : 'text-slate-500 text-xs'}`}>
        {isEnfant 
          ? '👆 Clique sur une étape pour en savoir plus !'
          : 'Inscrivez-vous gratuitement pour commencer'
        }
      </p>

      {/* BOUTON CALL-TO-ACTION - Commencer l'aventure */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <button
          onClick={() => {
            const event = new CustomEvent('openAuthDialog');
            window.dispatchEvent(event);
          }}
          data-testid="cta-start-adventure"
          className={`
            group relative overflow-hidden
            px-8 sm:px-12 py-4 sm:py-5
            rounded-2xl sm:rounded-3xl
            font-bold text-lg sm:text-xl
            transform hover:scale-105 hover:-translate-y-1
            transition-all duration-300
            ${isEnfant 
              ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 text-slate-900 shadow-xl shadow-amber-500/40 hover:shadow-amber-500/60'
              : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50'
            }
          `}
        >
          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
            -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          
          <span className="relative flex items-center gap-2 sm:gap-3">
            {isEnfant ? (
              <>
                <span className="text-2xl sm:text-3xl">🚀</span>
                <span>Commencer l'aventure !</span>
                <span className="text-2xl sm:text-3xl">🥷</span>
              </>
            ) : (
              <>
                <span className="text-xl sm:text-2xl">📝</span>
                <span>Créer mon compte</span>
              </>
            )}
          </span>
        </button>

        {/* Sous-texte */}
        <p className={`text-center ${isEnfant ? 'text-slate-500 text-xs' : 'text-slate-600 text-xs'}`}>
          {isEnfant 
            ? '✨ C\'est gratuit et ça prend 30 secondes !'
            : 'Inscription gratuite • Sans engagement'
          }
        </p>
      </div>
    </div>
  );
};

export default VisitorStepsBlocks;
