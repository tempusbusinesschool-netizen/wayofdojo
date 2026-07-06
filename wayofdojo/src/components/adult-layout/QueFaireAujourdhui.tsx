'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gamepad2, BookOpen, Target, ChevronRight } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * QueFaireAujourdhui - Bloc "Que faire aujourd'hui ?"
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * 3 cartes égales :
 * 1. Dojo virtuel (violet)
 * 2. Technique du jour (cyan)
 * 3. Défi du jour (orange)
 */

interface QueFaireAujourdhuiProps {
  locale: string;
  sport: string;
  techniqueDuJour?: {
    name: string;
    nameJp?: string;
    description: string;
  };
  defiDuJour?: {
    name: string;
    description: string;
    xp: number;
  };
}

const techniquesPossibles = [
  { name: 'Ushiro Ukemi', nameJp: '後ろ受身', description: 'La chute arrière' },
  { name: 'Mae Ukemi', nameJp: '前受身', description: 'La chute avant' },
  { name: 'Tai Sabaki', nameJp: '体捌き', description: 'Déplacement du corps' },
  { name: 'Ikkyo', nameJp: '一教', description: 'Première immobilisation' },
  { name: 'Shiho Nage', nameJp: '四方投げ', description: 'Projection des quatre directions' },
  { name: 'Irimi Nage', nameJp: '入身投げ', description: "Projection d'entrée" },
  { name: 'Kote Gaeshi', nameJp: '小手返', description: 'Retournement du poignet' },
];

const defisPossibles = [
  { name: 'Chutes parfaites', description: 'Réussis 10 chutes arrière parfaites', xp: 30 },
  { name: 'Méditation', description: '5 minutes de calme intérieur', xp: 20 },
  { name: 'Révision', description: 'Révise 3 techniques du 6e Kyu', xp: 25 },
  { name: 'Posture', description: 'Maintiens Seiza pendant 2 minutes', xp: 15 },
  { name: 'Respiration', description: 'Pratique la respiration abdominale', xp: 20 },
];

export const QueFaireAujourdhui: React.FC<QueFaireAujourdhuiProps> = ({
  locale,
  sport,
  techniqueDuJour,
  defiDuJour,
}) => {
  // Sélection basée sur le jour
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const technique = techniqueDuJour || techniquesPossibles[dayOfYear % techniquesPossibles.length];
  const defi = defiDuJour || defisPossibles[dayOfYear % defisPossibles.length];

  const cards = [
    {
      id: 'dojo-virtuel',
      icon: <Gamepad2 className="w-6 h-6" />,
      title: 'Dojo virtuel',
      description: 'Entraîne-toi avec Maître Tanaka et progresse pas à pas.',
      href: `/${locale}/${sport}/dojo-virtuel`,
      gradient: 'from-violet-600 to-purple-700',
      iconBg: 'bg-violet-500/20',
      iconColor: 'text-violet-400',
    },
    {
      id: 'technique-jour',
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Technique du jour',
      description: `${technique.name} — ${technique.description}`,
      href: `/${locale}/${sport}/techniques`,
      gradient: 'from-cyan-600 to-blue-700',
      iconBg: 'bg-cyan-500/20',
      iconColor: 'text-cyan-400',
    },
    {
      id: 'defi-jour',
      icon: <Target className="w-6 h-6" />,
      title: 'Défi du jour',
      description: `${defi.description} (+${defi.xp} XP)`,
      href: `/${locale}/${sport}/dojo`,
      gradient: 'from-orange-500 to-amber-600',
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-400',
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
                className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${card.gradient} p-5 h-full min-h-[140px] transition-all hover:scale-[1.02] hover:shadow-lg`}
                data-testid={`card-${card.id}`}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full blur-2xl" />
                </div>
                
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center mb-3 ${card.iconColor}`}>
                    {card.icon}
                  </div>
                  
                  <h4 className="text-white font-semibold mb-1">{card.title}</h4>
                  <p className="text-white/70 text-sm line-clamp-2">{card.description}</p>
                  
                  {/* Flèche */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
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
