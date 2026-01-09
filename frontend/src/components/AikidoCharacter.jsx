import React from 'react';
import { AIKIDO_CHARACTERS, getCharacterForContext } from '@/constants/aikidoCharacters';

/**
 * AikidoCharacter - Composant pour afficher les personnages 3D
 * Utilisable partout dans l'application pour une cohérence visuelle
 */
const AikidoCharacter = ({ 
  context = 'welcome', // Type de contexte (success, error, empty, etc.)
  character = null, // URL directe d'un personnage spécifique
  size = 'md', // xs, sm, md, lg, xl
  className = '',
  animate = false, // Animation bounce/pulse
  alt = 'Personnage Aikido'
}) => {
  // Déterminer l'image à afficher
  const imageSrc = character || getCharacterForContext(context);
  
  // Tailles prédéfinies
  const sizes = {
    xs: 'w-12 h-12',
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
    '2xl': 'w-80 h-80',
    full: 'w-full h-auto max-w-xs'
  };
  
  // Animation
  const animationClass = animate 
    ? context === 'success' || context === 'celebration' 
      ? 'animate-bounce' 
      : 'animate-pulse'
    : '';

  return (
    <img 
      src={imageSrc}
      alt={alt}
      className={`object-contain ${sizes[size] || sizes.md} ${animationClass} ${className}`}
      loading="lazy"
    />
  );
};

/**
 * CharacterCard - Carte avec personnage et message
 * Parfait pour les états vides, erreurs, succès
 */
export const CharacterCard = ({
  context = 'empty',
  title,
  message,
  action,
  onAction,
  character = null,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-6 sm:p-8 text-center ${className}`}>
      <AikidoCharacter 
        context={context}
        character={character}
        size="lg"
        animate={context === 'success' || context === 'celebration'}
      />
      {title && (
        <h3 className="text-lg sm:text-xl font-bold text-white mt-4 mb-2">
          {title}
        </h3>
      )}
      {message && (
        <p className="text-slate-400 text-sm sm:text-base max-w-sm">
          {message}
        </p>
      )}
      {action && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 
            hover:from-orange-400 hover:to-amber-400 text-white font-bold rounded-xl
            transition-all duration-300 hover:scale-105"
        >
          {action}
        </button>
      )}
    </div>
  );
};

/**
 * CharacterToast - Contenu pour les notifications toast avec personnage
 */
export const CharacterToastContent = ({
  context = 'success',
  title,
  message,
  xp = null
}) => {
  return (
    <div className="flex items-center gap-3">
      <AikidoCharacter 
        context={context}
        size="sm"
        animate={context === 'success'}
      />
      <div>
        <p className="font-bold text-slate-900">{title}</p>
        {message && <p className="text-xs text-slate-600">{message}</p>}
        {xp && <p className="text-xs font-bold text-amber-600">+{xp} XP</p>}
      </div>
    </div>
  );
};

export default AikidoCharacter;
