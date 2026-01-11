import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { AIKIDO_CHARACTERS } from '@/constants/aikidoCharacters';

/**
 * NotFoundPage - Page 404 avec personnage confus
 */
const NotFoundPage = ({ onGoHome, onGoBack }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      {/* Personnage confus */}
      <img 
        src={AIKIDO_CHARACTERS.ENFANT_CONFUS}
        alt="Page non trouvée"
        className="w-48 h-48 sm:w-64 sm:h-64 object-contain mb-6"
      />
      
      {/* Texte */}
      <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
        404
      </h1>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-300 mb-2">
        Oups ! Cette page n'existe pas
      </h2>
      <p className="text-slate-400 max-w-md mb-6">
        On dirait que tu t'es perdu sur le tatami... 🥋
        <br />
        Cette technique n'est pas encore au programme !
      </p>
      
      {/* Boutons */}
      <div className="flex flex-wrap gap-3 justify-center">
        {onGoBack && (
          <Button
            onClick={onGoBack}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>
        )}
        {onGoHome && (
          <Button
            onClick={onGoHome}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Accueil
          </Button>
        )}
      </div>
      
      {/* Kanji décoratifs */}
      <div className="mt-8 text-6xl opacity-10 font-serif" style={{ fontFamily: "'Noto Serif JP', serif" }}>
        迷子
      </div>
      <p className="text-xs text-slate-600 mt-1">maigo - perdu</p>
    </div>
  );
};

export default NotFoundPage;
