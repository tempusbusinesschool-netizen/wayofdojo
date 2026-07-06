'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VertusSection - Les 7 vertus du Budo selon le visuel de référence EXACT
 * 
 * Couleurs selon le modèle fourni :
 * - Respect : Rouge (Torii gate)
 * - Courage : Orange (Montagne)
 * - Honnêteté : Jaune (Fleur de cerisier)
 * - Humilité : Vert (Bambou)
 * - Contrôle : Cyan (Vagues)
 * - Amitié : Bleu clair (Deux personnages)
 * - Persévérance : Violet (Montagne avec nuage)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface VertusSectionProps {
  locale: string;
  sport: string;
}

// Icônes SVG pour chaque vertu
const ToriiIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M4 4h16v2H4V4zm-2 4h20v2h-2v10h-2V10h-4v10h-4V10H6v10H4V10H2V8z"/>
  </svg>
);

const MountainIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z"/>
  </svg>
);

const FlowerIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M12 2a4 4 0 0 0-4 4c0 1.1.45 2.1 1.17 2.83L12 12l2.83-3.17A4 4 0 0 0 16 6a4 4 0 0 0-4-4z"/>
    <path d="M5.17 8.83A4 4 0 0 0 2 12a4 4 0 0 0 4 4c1.1 0 2.1-.45 2.83-1.17L12 12l-3.17-2.83A4 4 0 0 0 6 8a4 4 0 0 0-.83.83z"/>
    <path d="M18.83 8.83A4 4 0 0 1 22 12a4 4 0 0 1-4 4c-1.1 0-2.1-.45-2.83-1.17L12 12l3.17-2.83c.73-.72 1.73-1.17 2.83-1.17z"/>
    <path d="M12 22a4 4 0 0 0 4-4c0-1.1-.45-2.1-1.17-2.83L12 12l-2.83 3.17A4 4 0 0 0 8 18a4 4 0 0 0 4 4z"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const BambooIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M7 2v2h2V2H7zm0 4v6h2V6H7zm0 8v6h2v-6H7zm8-12v2h2V2h-2zm0 4v6h2V6h-2zm0 8v6h2v-6h-2z"/>
    <path d="M6 4h4v2H6V4zm0 8h4v2H6v-2zm8-8h4v2h-4V4zm0 8h4v2h-4v-2z" opacity="0.5"/>
  </svg>
);

const WavesIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0v3c-2-2-4-2-6 0s-4 2-6 0-4-2-6 0v-3z"/>
    <path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0v3c-2-2-4-2-6 0s-4 2-6 0-4-2-6 0v-3z" opacity="0.5"/>
  </svg>
);

const FriendsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <circle cx="9" cy="7" r="3"/>
    <circle cx="15" cy="7" r="3"/>
    <path d="M9 12c-3 0-6 1.5-6 4v2h12v-2c0-2.5-3-4-6-4z"/>
    <path d="M15 12c-.5 0-1 .05-1.5.14C14.5 13.1 15 14.5 15 16v2h6v-2c0-2.5-3-4-6-4z"/>
  </svg>
);

const PerseveranceIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z"/>
    <ellipse cx="12" cy="6" rx="6" ry="2" opacity="0.4"/>
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
    Icon: MountainIcon 
  },
  { 
    id: 'honnetete', 
    name: 'Honnêteté', 
    bgColor: 'bg-yellow-400',
    Icon: FlowerIcon 
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
    Icon: WavesIcon 
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
    bgColor: 'bg-purple-500',
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

      <div className="grid grid-cols-7 gap-2">
        {VERTUS.map((vertu, index) => {
          const IconComponent = vertu.Icon;
          return (
            <motion.div
              key={vertu.id}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.06, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/${locale}/${sport}/vertus`}>
                <div 
                  className={`
                    aspect-square rounded-xl ${vertu.bgColor} 
                    p-2 flex flex-col items-center justify-center text-center 
                    transition-all duration-200 
                    shadow-lg hover:shadow-xl
                  `}
                  data-testid={`vertu-${vertu.id}`}
                >
                  <div className="text-white mb-1">
                    <IconComponent />
                  </div>
                  <span className="text-[8px] lg:text-[10px] text-white font-medium leading-tight">
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
