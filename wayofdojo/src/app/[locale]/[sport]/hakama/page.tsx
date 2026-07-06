'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdultSidebar } from '@/components/adult-layout/AdultSidebar';
import { AdultHeader } from '@/components/adult-layout/AdultHeader';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * L'Hakama et ses plis - Symbolisme et signification
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface HakamaFold {
  number: number;
  japanese: string;
  romaji: string;
  meaning: string;
  description: string;
  position: 'front' | 'back';
}

const hakamaFolds: HakamaFold[] = [
  {
    number: 1,
    japanese: '仁',
    romaji: 'Jin',
    meaning: 'Bienveillance',
    description: 'La bonté et la compassion envers tous les êtres. L\'aïkidoka doit cultiver un cœur généreux et attentionné.',
    position: 'front',
  },
  {
    number: 2,
    japanese: '義',
    romaji: 'Gi',
    meaning: 'Honneur / Justice',
    description: 'L\'intégrité morale et le sens du devoir. Agir avec droiture, même lorsque personne ne regarde.',
    position: 'front',
  },
  {
    number: 3,
    japanese: '礼',
    romaji: 'Rei',
    meaning: 'Courtoisie',
    description: 'Le respect et les bonnes manières. La politesse sincère qui vient du cœur et non de la forme.',
    position: 'front',
  },
  {
    number: 4,
    japanese: '智',
    romaji: 'Chi',
    meaning: 'Sagesse',
    description: 'La capacité de discernement et de jugement éclairé. Savoir quand agir et quand s\'abstenir.',
    position: 'front',
  },
  {
    number: 5,
    japanese: '信',
    romaji: 'Shin',
    meaning: 'Sincérité',
    description: 'L\'honnêteté et l\'authenticité dans toutes ses actions. Tenir ses engagements et être digne de confiance.',
    position: 'front',
  },
  {
    number: 6,
    japanese: '忠',
    romaji: 'Chu',
    meaning: 'Loyauté',
    description: 'La fidélité envers ses engagements, son dojo, son sensei et ses partenaires d\'entraînement.',
    position: 'back',
  },
  {
    number: 7,
    japanese: '孝',
    romaji: 'Ko',
    meaning: 'Piété filiale',
    description: 'Le respect envers ses parents, ses aînés et ses professeurs. Reconnaître ce que l\'on doit à ceux qui nous ont formés.',
    position: 'back',
  },
];

const wearingTips = [
  {
    title: 'Quand porter l\'hakama ?',
    content: 'Traditionnellement, l\'hakama se porte à partir du grade de 1er Kyu ou 1er Dan selon les dojos. Il symbolise le passage à un niveau de pratique plus avancé et une compréhension plus profonde de l\'Aïkido.',
  },
  {
    title: 'Comment le plier ?',
    content: 'Le pliage de l\'hakama est un rituel en soi. Chaque pli doit être soigneusement aligné, les cordons (himo) croisés de manière précise. Ce geste quotidien est une forme de méditation et de respect pour la pratique.',
  },
  {
    title: 'L\'entretien',
    content: 'L\'hakama traditionnel en coton ou en polyester doit être plié immédiatement après la pratique pour conserver ses plis. Un hakama bien entretenu témoigne du respect du pratiquant pour son art.',
  },
];

export default function HakamaPage() {
  const params = useParams();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const handleLogout = () => {
    localStorage.removeItem('wayofdojo_token');
    localStorage.removeItem('wayofdojo_user');
    window.location.href = `/${locale}`;
  };

  const frontFolds = hakamaFolds.filter(f => f.position === 'front');
  const backFolds = hakamaFolds.filter(f => f.position === 'back');

  return (
    <div className="min-h-screen bg-[#06101f]">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <AdultSidebar 
          locale={locale}
          sport={sport}
          onLogout={handleLogout}
        />
      </div>

      {/* Header */}
      <AdultHeader
        locale={locale}
        sport={sport}
        userName=""
        showMenuButton={true}
      />

      {/* Contenu principal */}
      <div className="lg:ml-[260px] pt-[60px]">
        <div className="max-w-5xl mx-auto p-6 space-y-10">
          
          {/* Retour */}
          <Link 
            href={`/${locale}/${sport}/dojo`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Dojo
          </Link>

          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              L'<span className="text-orange-400">Hakama</span> et ses plis
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Les 7 plis de l'hakama incarnent les vertus du Bushido
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-orange-400" />
              Qu'est-ce que l'hakama ?
            </h2>
            <p className="text-slate-300 leading-relaxed">
              L'hakama (袴) est un pantalon large traditionnel japonais porté par-dessus le keikogi. 
              Autrefois réservé aux samouraïs, il est aujourd'hui porté en Aïkido par les pratiquants 
              avancés. Ses <strong className="text-orange-400">sept plis</strong> — cinq devant et deux derrière — 
              représentent les vertus que chaque aïkidoka doit cultiver tout au long de sa vie.
            </p>
          </motion.div>

          {/* Les 5 plis avant */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">
              Les 5 plis avant <span className="text-slate-500 text-lg font-normal">(表 - Omote)</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {frontFolds.map((fold, index) => (
                <motion.div
                  key={fold.romaji}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-[#0a1628] border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-3xl font-bold text-orange-400">{fold.japanese}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-500">Pli {fold.number}</span>
                      </div>
                      <h3 className="text-white font-bold text-lg">{fold.romaji}</h3>
                      <p className="text-amber-400 text-sm mb-2">{fold.meaning}</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mt-4">{fold.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Les 2 plis arrière */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">
              Les 2 plis arrière <span className="text-slate-500 text-lg font-normal">(裏 - Ura)</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {backFolds.map((fold, index) => (
                <motion.div
                  key={fold.romaji}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-[#0a1628] border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-3xl font-bold text-amber-400">{fold.japanese}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-500">Pli {fold.number}</span>
                      </div>
                      <h3 className="text-white font-bold text-lg">{fold.romaji}</h3>
                      <p className="text-amber-400 text-sm mb-2">{fold.meaning}</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mt-4">{fold.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Conseils pratiques */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Conseils pratiques</h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              {wearingTips.map((tip, index) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="bg-[#0a1628] border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-orange-400 font-semibold mb-3">{tip.title}</h3>
                  <p className="text-slate-400 text-sm">{tip.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Citation finale */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="bg-[#0a1628] border border-white/10 rounded-2xl p-8 text-center"
          >
            <p className="text-xl text-white italic font-light mb-4">
              « Porter l'hakama, c'est porter sur soi le rappel constant des vertus 
              que nous devons incarner, sur le tatami comme dans la vie. »
            </p>
            <p className="text-slate-500">— Tradition du Budo</p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
