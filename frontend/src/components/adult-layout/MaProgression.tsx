'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MaProgression - Utilise l'image EXACTE fournie par l'utilisateur
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface MaProgressionProps {
  xp: number;
  maxXp?: number;
  xpGainedThisWeek?: number;
  currentGrade: string;
  locale: string;
  sport: string;
}

export const MaProgression: React.FC<MaProgressionProps> = ({
  locale,
  sport,
}) => {
  return (
    <section data-testid="ma-progression" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-xl">🥋</span>
          <h3 className="text-lg font-semibold text-white">Ma progression de ceinture</h3>
        </div>
        <Link 
          href={`/${locale}/${sport}/ceintures`}
          className="text-orange-400 hover:text-orange-300 text-sm flex items-center gap-1"
        >
          Voir le programme
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Image exacte fournie par l'utilisateur */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden"
      >
        <Image
          src="/images/belts/ceintures-progression.png"
          alt="Ma progression de ceinture"
          width={1200}
          height={400}
          className="w-full h-auto rounded-2xl"
          priority
        />
      </motion.div>
    </section>
  );
};

export default MaProgression;
