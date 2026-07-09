import React from 'react';
import { Button } from '@/components/ui/button';
import { AIKIDO_CHARACTERS, getCharacterForContext } from '@/constants/aikidoCharacters';

/**
 * EmptyState - Composant pour les états vides avec personnage
 */
const EmptyState = ({ 
  context = 'empty', // empty, no_data, no_challenges, no_badges, etc.
  title = "Rien à afficher",
  message = "Il n'y a pas encore de données ici.",
  actionLabel = null,
  onAction = null,
  character = null,
  size = 'md' // sm, md, lg
}) => {
  const sizes = {
    sm: {
      container: 'py-6',
      image: 'w-20 h-20',
      title: 'text-base',
      message: 'text-xs'
    },
    md: {
      container: 'py-8',
      image: 'w-32 h-32',
      title: 'text-lg',
      message: 'text-sm'
    },
    lg: {
      container: 'py-12',
      image: 'w-48 h-48',
      title: 'text-xl',
      message: 'text-base'
    }
  };
  
  const s = sizes[size] || sizes.md;
  const imageSrc = character || getCharacterForContext(context);

  return (
    <div className={`flex flex-col items-center justify-center text-center ${s.container}`}>
      <img 
        src={imageSrc}
        alt={title}
        className={`${s.image} object-contain mb-4`}
      />
      
      <h3 className={`font-bold text-white mb-2 ${s.title}`}>
        {title}
      </h3>
      
      <p className={`text-slate-400 max-w-sm mb-4 ${s.message}`}>
        {message}
      </p>
      
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// Presets communs
export const EmptyNoChallenges = ({ onAction }) => (
  <EmptyState
    context="empty"
    title="Tous les défis sont complétés ! 🎉"
    message="Reviens demain pour de nouveaux défis à relever."
    character={AIKIDO_CHARACTERS.ENFANT_CELEBRATION}
  />
);

export const EmptyNoBadges = ({ onAction }) => (
  <EmptyState
    context="empty"
    title="Pas encore de badges"
    message="Complete des défis pour débloquer tes premiers badges !"
    actionLabel="Voir les défis"
    onAction={onAction}
    character={AIKIDO_CHARACTERS.ENFANT_MEDITATION}
  />
);

export const EmptyNoData = ({ title, message }) => (
  <EmptyState
    context="no_data"
    title={title || "Aucune donnée"}
    message={message || "Il n'y a pas encore de données à afficher."}
    character={AIKIDO_CHARACTERS.ENFANT_MEDITATION}
  />
);

export const EmptyNoChildren = ({ onAction }) => (
  <EmptyState
    context="empty"
    title="Aucun enfant lié"
    message="Liez le compte de votre enfant pour suivre sa progression."
    actionLabel="Lier un enfant"
    onAction={onAction}
    character={AIKIDO_CHARACTERS.ENFANT_MEDITATION}
  />
);

export const EmptyError = ({ message, onRetry }) => (
  <EmptyState
    context="error"
    title="Oups ! Une erreur s'est produite"
    message={message || "Quelque chose n'a pas fonctionné. Réessaie !"}
    actionLabel="Réessayer"
    onAction={onRetry}
    character={AIKIDO_CHARACTERS.ENFANT_CONFUS}
  />
);

export default EmptyState;
