import React from 'react';
import { AIKIDO_CHARACTERS } from '@/constants/aikidoCharacters';

/**
 * LoadingScreen - Écran de chargement avec personnage en méditation
 */
const LoadingScreen = ({ message = "Chargement en cours...", showCharacter = true }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[40vh]">
      {showCharacter && (
        <img 
          src={AIKIDO_CHARACTERS.ENFANT_MEDITATION}
          alt="Chargement"
          className="w-32 h-32 sm:w-40 sm:h-40 object-contain mb-4 animate-pulse"
        />
      )}
      
      {/* Spinner Aikido */}
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-orange-500/30 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 flex items-center justify-center text-2xl">
          ☯️
        </div>
      </div>
      
      <p className="text-slate-400 text-sm sm:text-base">{message}</p>
      
      {/* Message zen */}
      <p className="text-slate-600 text-xs mt-2 italic">
        "La patience est la clé de la maîtrise"
      </p>
    </div>
  );
};

/**
 * LoadingSpinner - Petit spinner pour les boutons et inline
 */
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  return (
    <div className={`${sizes[size]} ${className}`}>
      <div className="w-full h-full border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingScreen;
