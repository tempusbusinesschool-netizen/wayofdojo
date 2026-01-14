import React from 'react';
import { Lock } from 'lucide-react';

/**
 * VisitorStepsBlocks - Blocs d'accueil pour les visiteurs NON CONNECTÉS
 * 
 * NOUVELLE LOGIQUE (demandée par utilisateur):
 * - NON CONNECTÉ : Affiche les 8 BLOCS de présentation du contenu (Bienvenue, Mon Profil, Les Défis, etc.)
 *   → Cela montre ce que l'utilisateur va découvrir une fois inscrit
 * 
 * - CONNECTÉ : Utilise JourneyPath.jsx (6 blocs numérotés + Tanaka animé)
 *   → Cela guide l'utilisateur étape par étape dans son parcours
 */
const VisitorStepsBlocks = ({ mode = 'enfant', onStepClick }) => {
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // 8 BLOCS DE PRÉSENTATION DU CONTENU - Pour les visiteurs NON connectés
  // Montre ce que l'application propose (aperçu du "Votre parcours")
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const contentBlocks = [
    {
      id: 1,
      slug: 'bienvenue',
      title: 'Bienvenue !',
      subtitle: 'Rencontre Maître Tanaka',
      emoji: '👋',
      gradient: 'from-emerald-500 to-teal-600',
      shadowColor: 'shadow-emerald-500/40',
      unlocked: true
    },
    {
      id: 2,
      slug: 'profil',
      title: 'Mon Profil',
      subtitle: 'Ta carte de ninja',
      emoji: '🥷',
      gradient: 'from-violet-500 to-purple-600',
      shadowColor: 'shadow-violet-500/40',
      unlocked: true
    },
    {
      id: 3,
      slug: 'defis',
      title: 'Les Défis',
      subtitle: 'Relève les défis quotidiens',
      emoji: '🎯',
      gradient: 'from-pink-500 to-rose-600',
      shadowColor: 'shadow-pink-500/40',
      unlocked: true
    },
    {
      id: 4,
      slug: 'vertus',
      title: 'Les 7 Vertus',
      subtitle: 'Les super-pouvoirs du ninja',
      emoji: '☯️',
      gradient: 'from-amber-500 to-orange-600',
      shadowColor: 'shadow-amber-500/40',
      unlocked: true
    },
    {
      id: 5,
      slug: 'techniques',
      title: 'Les Techniques',
      subtitle: 'Apprends les mouvements',
      emoji: '🥋',
      gradient: 'from-cyan-500 to-blue-600',
      shadowColor: 'shadow-cyan-500/40',
      unlocked: false
    },
    {
      id: 6,
      slug: 'ceintures',
      title: 'Les Ceintures',
      subtitle: 'Ta progression de grade',
      emoji: '🎖️',
      gradient: 'from-slate-500 to-slate-700',
      shadowColor: 'shadow-slate-500/40',
      unlocked: false
    },
    {
      id: 7,
      slug: 'histoire',
      title: "L'Histoire",
      subtitle: "Les origines de l'Aïkido",
      emoji: '📜',
      gradient: 'from-amber-600 to-yellow-700',
      shadowColor: 'shadow-amber-600/40',
      unlocked: false
    },
    {
      id: 8,
      slug: 'trophees',
      title: 'Mes Trophées',
      subtitle: 'Badges et récompenses',
      emoji: '🏆',
      gradient: 'from-yellow-500 to-amber-600',
      shadowColor: 'shadow-yellow-500/40',
      unlocked: false
    }
  ];

  const isEnfant = mode === 'enfant';

  return (
    <div className="mb-8" data-testid="visitor-steps-blocks">
      {/* ═══════════════════════════════════════════════════════════════════════════════
          TITRE DE SECTION - 8 blocs de présentation du contenu
      ═══════════════════════════════════════════════════════════════════════════════ */}
      <div className="text-center mb-6">
        {isEnfant ? (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              🎮 Ton Parcours Ninja en 8 étapes ! 🎮
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Découvre tout ce qui t'attend ! 🥷
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Votre parcours Aikido
            </h2>
            <p className="text-slate-400 text-sm">
              Découvrez le contenu de votre formation
            </p>
          </>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════════
          GRILLE DES 8 BLOCS - Présentation du contenu (aperçu)
          - 4 premiers blocs colorés (débloqués visuellement)
          - 4 derniers blocs sombres avec cadenas (verrouillés)
      ═══════════════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {contentBlocks.map((block) => (
          <button
            key={block.id}
            onClick={() => {
              // Ouvre le dialogue d'inscription
              const event = new CustomEvent('openAuthDialog');
              window.dispatchEvent(event);
            }}
            data-testid={`visitor-block-${block.slug}`}
            className={`
              relative group
              aspect-square
              rounded-2xl sm:rounded-3xl
              p-3 sm:p-4
              flex flex-col items-center justify-center
              transition-all duration-300
              overflow-hidden
              ${block.unlocked 
                ? `bg-gradient-to-br ${block.gradient} shadow-xl ${block.shadowColor} border-2 border-white/20 hover:border-white/40 hover:scale-105 hover:-translate-y-2 cursor-pointer`
                : 'bg-slate-800/50 border-2 border-slate-700 cursor-pointer hover:bg-slate-800/70'
              }
            `}
          >
            {/* Numéro d'étape - GROS NUMÉRO */}
            <div className={`absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
              ${block.unlocked ? 'bg-white/20' : 'bg-slate-700'}`}
            >
              <span className={`text-lg sm:text-xl font-black ${block.unlocked ? 'text-white' : 'text-slate-500'}`}>
                {block.id}
              </span>
            </div>

            {/* Icône de verrouillage pour les blocs non débloqués */}
            {!block.unlocked && (
              <div className="absolute top-2 right-2 bg-slate-600 rounded-full p-1">
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
            )}

            {/* Emoji principal */}
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

            {/* Effet de brillance au hover (blocs débloqués) */}
            {block.unlocked && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            )}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════════
          BARRE DE PROGRESSION VISUELLE
      ═══════════════════════════════════════════════════════════════════════════════ */}
      <div className="mt-6 px-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-slate-400 text-xs">Progression du parcours</span>
          <span className="text-amber-400 text-xs font-bold">0 / 8 étapes</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 rounded-full"
            style={{ width: '0%' }}
          />
        </div>
      </div>

      {/* Message d'encouragement */}
      <p className={`text-center mt-4 ${isEnfant ? 'text-slate-400 text-sm' : 'text-slate-500 text-xs'}`}>
        {isEnfant 
          ? '🔓 Inscris-toi pour débloquer ton parcours !'
          : 'Inscrivez-vous pour commencer votre progression'
        }
      </p>

      {/* ═══════════════════════════════════════════════════════════════════════════════
          BOUTON CALL-TO-ACTION - Créer son compte
      ═══════════════════════════════════════════════════════════════════════════════ */}
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
                <span className="text-2xl sm:text-3xl">🥷</span>
                <span>Créer mon compte Ninja</span>
                <span className="text-2xl sm:text-3xl">🚀</span>
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
