'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VertusSection - Les 7 vertus du Budo avec icônes EXACTES du visuel de référence
 * Style: Icônes en outline noir sur fonds colorés
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface VertusSectionProps {
  locale: string;
  sport: string;
}

// Icône Torii Gate pour Respect
const ToriiIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    {/* Piliers verticaux */}
    <line x1="12" y1="16" x2="12" y2="40" />
    <line x1="36" y1="16" x2="36" y2="40" />
    {/* Barre horizontale basse */}
    <line x1="8" y1="24" x2="40" y2="24" />
    {/* Barre horizontale haute avec courbe */}
    <path d="M6 16 Q24 12 42 16" />
    {/* Petits pieds */}
    <line x1="8" y1="40" x2="16" y2="40" />
    <line x1="32" y1="40" x2="40" y2="40" />
  </svg>
);

// Icône Montagne avec soleil pour Courage
const MountainSunIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    {/* Montagne */}
    <path d="M8 38 L24 14 L40 38 Z" />
    {/* Rayons de soleil derrière */}
    <line x1="24" y1="8" x2="24" y2="12" />
    <line x1="16" y1="10" x2="18" y2="13" />
    <line x1="32" y1="10" x2="30" y2="13" />
    <line x1="12" y1="14" x2="15" y2="16" />
    <line x1="36" y1="14" x2="33" y2="16" />
  </svg>
);

// Icône Fleur de cerisier pour Honnêteté
const CherryBlossomIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    {/* 4 pétales */}
    <path d="M24 8 C28 12 28 18 24 22 C20 18 20 12 24 8" />
    <path d="M24 40 C28 36 28 30 24 26 C20 30 20 36 24 40" />
    <path d="M8 24 C12 28 18 28 22 24 C18 20 12 20 8 24" />
    <path d="M40 24 C36 28 30 28 26 24 C30 20 36 20 40 24" />
    {/* Centre */}
    <circle cx="24" cy="24" r="3" />
  </svg>
);

// Icône Bambou pour Humilité
const BambooIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    {/* Tige principale */}
    <line x1="24" y1="8" x2="24" y2="40" />
    {/* Noeuds */}
    <line x1="20" y1="14" x2="28" y2="14" />
    <line x1="20" y1="24" x2="28" y2="24" />
    <line x1="20" y1="34" x2="28" y2="34" />
    {/* Feuilles */}
    <path d="M28 12 C34 10 38 14 36 18" />
    <path d="M20 22 C14 20 10 24 12 28" />
    <path d="M28 32 C34 30 38 34 36 38" />
  </svg>
);

// Icône Vague pour Contrôle de soi
const WaveIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    {/* Vague principale */}
    <path d="M4 28 C10 20 16 20 22 28 C28 36 34 36 44 28" />
    {/* Petite vague en dessous */}
    <path d="M8 34 C12 30 16 30 20 34 C24 38 28 38 36 34" />
    {/* Éclaboussure */}
    <path d="M22 24 C24 22 26 22 28 24" />
  </svg>
);

// Icône Deux figures pour Amitié
const FriendsIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    {/* Première personne */}
    <circle cx="16" cy="14" r="5" />
    <path d="M8 38 L8 28 C8 24 12 22 16 22 C20 22 24 24 24 28 L24 38" />
    {/* Deuxième personne */}
    <circle cx="32" cy="14" r="5" />
    <path d="M24 38 L24 28 C24 24 28 22 32 22 C36 22 40 24 40 28 L40 38" />
  </svg>
);

// Icône Montagne avec étoile pour Persévérance
const PerseveranceIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    {/* Chaîne de montagnes */}
    <path d="M4 40 L14 24 L20 32 L24 12 L28 32 L34 24 L44 40 Z" />
    {/* Étoile au sommet */}
    <circle cx="24" cy="8" r="2" fill="currentColor" />
    {/* Petits rayons */}
    <line x1="24" y1="4" x2="24" y2="2" />
    <line x1="20" y1="6" x2="18" y2="4" />
    <line x1="28" y1="6" x2="30" y2="4" />
  </svg>
);

const VERTUS = [
  { 
    id: 'respect', 
    name: 'Respect', 
    bgColor: 'bg-red-500',
    Icon: ToriiIcon 
  },
  { 
    id: 'courage', 
    name: 'Courage', 
    bgColor: 'bg-orange-500',
    Icon: MountainSunIcon 
  },
  { 
    id: 'honnetete', 
    name: 'Honnêteté', 
    bgColor: 'bg-yellow-400',
    Icon: CherryBlossomIcon 
  },
  { 
    id: 'humilite', 
    name: 'Humilité', 
    bgColor: 'bg-green-500',
    Icon: BambooIcon 
  },
  { 
    id: 'controle', 
    name: 'Contrôle de soi', 
    bgColor: 'bg-cyan-500',
    Icon: WaveIcon 
  },
  { 
    id: 'amitie', 
    name: 'Amitié', 
    bgColor: 'bg-blue-400',
    Icon: FriendsIcon 
  },
  { 
    id: 'perseverance', 
    name: 'Persévérance', 
    bgColor: 'bg-purple-600',
    Icon: PerseveranceIcon 
  },
];

export const VertusSection: React.FC<VertusSectionProps> = ({
  locale,
  sport,
}) => {
  return (
    <section data-testid="vertus-section" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Les 7 vertus du Budo</h3>
        <Link 
          href={`/${locale}/${sport}/vertus`}
          className="text-orange-400 hover:text-orange-300 text-sm flex items-center gap-1"
        >
          Découvrir
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {VERTUS.map((vertu, index) => {
          const IconComponent = vertu.Icon;
          return (
            <motion.div
              key={vertu.id}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.06, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/${locale}/${sport}/vertus`}>
                <div 
                  className={`
                    aspect-square rounded-2xl ${vertu.bgColor} 
                    p-3 flex flex-col items-center justify-center text-center 
                    transition-all duration-200 
                    shadow-lg hover:shadow-xl
                  `}
                  data-testid={`vertu-${vertu.id}`}
                >
                  {/* Icône en noir/outline */}
                  <div className="text-black/80 mb-2">
                    <IconComponent />
                  </div>
                  {/* Nom de la vertu */}
                  <span className="text-[9px] lg:text-[11px] text-white font-semibold leading-tight drop-shadow-md">
                    {vertu.name}
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default VertusSection;
