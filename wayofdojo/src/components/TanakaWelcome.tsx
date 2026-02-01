'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

// ⚠️ IMAGE OFFICIELLE DE TANAKA - VERROUILLÉE - NE JAMAIS CHANGER
const TANAKA_IMAGE = "/images/tanaka/portrait.png";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TanakaWelcome - Message d'accueil de Maître Tanaka pour chaque section
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Affiche un message personnalisé de Tanaka à l'ouverture de chaque page/section.
 * Le message peut être fermé et ne réapparaît pas pendant la session (localStorage).
 */

interface TanakaWelcomeProps {
  sectionId: string;           // ID unique pour localStorage (ex: 'techniques', 'dojo-virtuel')
  sectionTitle: string;        // Titre de la section (ex: 'Techniques', 'Dojo Virtuel')
  message: string;             // Message de Tanaka
  emoji?: string;              // Emoji optionnel pour la section
  onClose?: () => void;        // Callback optionnel à la fermeture
  autoClose?: number;          // Fermeture automatique après X secondes (optionnel)
  showOnce?: boolean;          // Afficher une seule fois par session (default: true)
  variant?: 'full' | 'compact' | 'banner'; // Style du message
}

export const TanakaWelcome: React.FC<TanakaWelcomeProps> = ({
  sectionId,
  sectionTitle,
  message,
  emoji = '🥋',
  onClose,
  autoClose,
  showOnce = true,
  variant = 'full',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  // Vérifier si le message a déjà été affiché
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storageKey = `tanaka_welcome_${sectionId}`;
      const shown = sessionStorage.getItem(storageKey);
      
      if (showOnce && shown === 'true') {
        setHasBeenShown(true);
        setIsVisible(false);
      } else {
        setIsVisible(true);
        if (showOnce) {
          sessionStorage.setItem(storageKey, 'true');
        }
      }
    }
  }, [sectionId, showOnce]);

  // Auto-fermeture
  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoClose * 1000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (hasBeenShown && showOnce) return null;

  // Variant: Banner (compact en haut de page)
  if (variant === 'banner') {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-2xl p-4 mb-6 relative overflow-hidden"
            data-testid={`tanaka-welcome-${sectionId}`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex items-center gap-4">
              <img 
                src={TANAKA_IMAGE}
                alt="Maître Tanaka"
                className="w-12 h-12 rounded-xl object-cover border-2 border-white/30 shadow-lg"
              />
              <div className="flex-1">
                <p className="text-amber-200 text-xs font-medium">Maître Tanaka • {sectionTitle}</p>
                <p className="text-white text-sm mt-0.5">&quot;{message}&quot;</p>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Fermer"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Variant: Compact (petit encart)
  if (variant === 'compact') {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/30 rounded-2xl p-4 mb-6"
            data-testid={`tanaka-welcome-${sectionId}`}
          >
            <div className="flex items-start gap-3">
              <img 
                src={TANAKA_IMAGE}
                alt="Maître Tanaka"
                className="w-10 h-10 rounded-lg object-cover border-2 border-amber-500/50"
              />
              <div className="flex-1 min-w-0">
                <p className="text-amber-400 text-xs font-medium">Maître Tanaka</p>
                <p className="text-white/90 text-sm mt-1">&quot;{message}&quot;</p>
              </div>
              <button 
                onClick={handleClose}
                className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Fermer"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Variant: Full (modal/overlay style)
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
          data-testid={`tanaka-welcome-${sectionId}`}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-amber-900/95 via-orange-900/95 to-amber-900/95 backdrop-blur-xl rounded-3xl p-6 max-w-md w-full border border-amber-500/30 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{emoji}</span>
                <span className="text-amber-300 font-bold">{sectionTitle}</span>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* Tanaka */}
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-xl" />
                <img 
                  src={TANAKA_IMAGE}
                  alt="Maître Tanaka"
                  className="relative w-24 h-24 rounded-2xl object-cover border-4 border-amber-500/50 shadow-xl"
                />
              </div>
              
              <h3 className="text-xl font-black text-amber-300 mt-4">Maître Tanaka</h3>
              <p className="text-amber-200/70 text-sm">Ton guide sur la Voie</p>
              
              {/* Message */}
              <div className="mt-4 bg-black/20 rounded-2xl p-4 border border-amber-500/20">
                <p className="text-white/90 text-base leading-relaxed">
                  &quot;{message}&quot;
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-5 w-full">
                <button
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Volume2 className="w-4 h-4" /> Écouter
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl text-white font-bold transition-colors"
                >
                  C&apos;est parti ! 🚀
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Messages prédéfinis de Tanaka pour chaque section
 */
export const TANAKA_MESSAGES = {
  'dojo-virtuel': {
    title: 'Dojo Virtuel',
    emoji: '🎮',
    message: "Bienvenue dans le Dojo Virtuel ! Ici, tu vas t'entraîner de façon ludique avec 11 mini-jeux conçus pour développer tes réflexes, ta concentration et ta connaissance du Budo. Amuse-toi bien, jeune Samouraï !"
  },
  'techniques': {
    title: 'Techniques',
    emoji: '📚',
    message: "Voici la bibliothèque des techniques ! Plus de 200 mouvements t'attendent. Chaque technique est un pas de plus vers la maîtrise. Prends ton temps pour les étudier, la patience est une vertu du Budo."
  },
  'techniques-liste': {
    title: 'Liste des Techniques',
    emoji: '📖',
    message: "Tu trouveras ici toutes les techniques classées par catégorie. Du plus simple au plus complexe, chaque mouvement a son importance. Rappelle-toi : la répétition est la mère de l'apprentissage !"
  },
  'trophees': {
    title: 'Trophées',
    emoji: '🏆',
    message: "Voici ta vitrine de récompenses ! Chaque badge représente un accomplissement sur ton chemin. Continue à t'entraîner et collectionne-les tous. La persévérance mène à la victoire !"
  },
  'vertus': {
    title: 'Les 7 Vertus du Budo',
    emoji: '🎭',
    message: "Les 7 Vertus du Budo sont le cœur de notre pratique. Respect, Courage, Maîtrise, Humilité, Bienveillance, Attention et Responsabilité. Cultive-les chaque jour, et tu deviendras un vrai guerrier de la paix."
  },
  'ceintures': {
    title: 'Ceintures',
    emoji: '🥋',
    message: "La progression par les ceintures symbolise ton évolution. Du blanc au noir, chaque grade marque une étape importante. Mais rappelle-toi : le vrai grade est dans le cœur, pas autour de la taille !"
  },
  'profil': {
    title: 'Mon Profil',
    emoji: '👤',
    message: "Voici ton espace personnel ! Tu peux y voir ta progression, tes statistiques et personnaliser ton parcours. Un bon samouraï connaît ses forces et travaille sur ses faiblesses."
  },
  'progression': {
    title: 'Ma Progression',
    emoji: '📈',
    message: "Observe ton évolution ! Chaque entraînement compte, chaque effort te rapproche de ton objectif. La progression n'est pas toujours linéaire, mais ne te décourage jamais."
  },
  'histoire': {
    title: 'Histoire de l\'Aïkido',
    emoji: '📜',
    message: "Découvre les origines de notre art ! Connaître l'histoire, c'est comprendre l'essence de ce que nous pratiquons. O'Sensei Ueshiba nous a légué un trésor, préservons-le avec respect."
  },
  'carnet': {
    title: 'Carnet de Dojo',
    emoji: '📓',
    message: "Ton carnet personnel ! Note tes entraînements, tes réflexions et tes objectifs. Un samouraï qui écrit est un samouraï qui progresse. La mémoire est fugace, l'encre est éternelle."
  },
  'stages': {
    title: 'Stages',
    emoji: '🏕️',
    message: "Les stages sont des moments privilégiés d'apprentissage intensif. Rencontre d'autres pratiquants, découvre de nouveaux maîtres. Chaque stage est une aventure qui te transformera !"
  },
};

export default TanakaWelcome;
