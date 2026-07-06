'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * QueFaireAujourdhui - Selon le visuel de référence avec images
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface QueFaireAujourdhuiProps {
  locale: string;
  sport: string;
}

export const QueFaireAujourdhui: React.FC<QueFaireAujourdhuiProps> = ({
  locale,
  sport,
}) => {
  const cards = [
    {
      id: 'dojo-virtuel',
      title: 'Dojo virtuel',
      description: 'Entraîne-toi avec Maître Tanaka et progresse pas à pas.',
      href: `/${locale}/${sport}/dojo-virtuel`,
      gradient: 'from-violet-600/90 to-purple-800/90',
      bgImage: 'linear-gradient(135deg, #5b21b6 0%, #3b0764 100%)',
    },
    {
      id: 'technique-jour',
      title: 'Technique du jour',
      description: 'Ushiro Ukemi — La chute arrière',
      href: `/${locale}/${sport}/techniques`,
      gradient: 'from-amber-700/90 to-orange-900/90',
      bgImage: 'linear-gradient(135deg, #92400e 0%, #451a03 100%)',
    },
    {
      id: 'defi-jour',
      title: 'Défi / quête du jour',
      description: 'Réussis 10 chutes arrière parfaites.',
      href: `/${locale}/${sport}/dojo`,
      gradient: 'from-orange-500/90 to-amber-700/90',
      bgImage: 'linear-gradient(135deg, #c2410c 0%, #78350f 100%)',
    },
  ];

  return (
    <section data-testid="que-faire-aujourdhui" className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Que faire aujourd'hui ?</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={card.href}>
              <div 
                className="group relative overflow-hidden rounded-2xl h-[180px] transition-all hover:scale-[1.02] hover:shadow-xl"
                style={{ background: card.bgImage }}
                data-testid={`card-${card.id}`}
              >
                {/* Illustration/Icon en haut */}
                <div className="absolute top-4 left-4 right-4 h-[80px] bg-white/5 rounded-xl flex items-center justify-center">
                  {card.id === 'dojo-virtuel' && (
                    <div className="text-5xl opacity-80">🥋</div>
                  )}
                  {card.id === 'technique-jour' && (
                    <div className="text-5xl opacity-80">📚</div>
                  )}
                  {card.id === 'defi-jour' && (
                    <div className="text-5xl opacity-80">🎯</div>
                  )}
                </div>
                
                {/* Contenu texte */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-white font-bold mb-0.5">{card.title}</h4>
                  <p className="text-white/70 text-sm line-clamp-1">{card.description}</p>
                </div>
                
                {/* Bouton flèche */}
                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <ChevronRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default QueFaireAujourdhui;
