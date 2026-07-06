'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Check, X } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AdultSidebar } from '@/components/adult-layout/AdultSidebar';
import { AdultHeader } from '@/components/adult-layout/AdultHeader';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PAGE LES 7 VERTUS DU BUSHIDO — VERSION ADULTE PREMIUM
 * Design: Kanji japonais élégants, fond bleu nuit, style premium
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Les 7 Vertus avec style adulte
const BUSHIDO_VIRTUES = [
  {
    id: 'gi',
    name: 'Rectitude',
    kanji: '義',
    romaji: 'Gi',
    meaning: 'Justice, Droiture',
    description: "La capacité de prendre la bonne décision avec discernement, sans hésitation. C'est l'intégrité morale qui guide nos actions.",
    application: "En Aïkido, Gi se manifeste dans l'exécution juste et précise des techniques, sans excès ni défaut.",
    bgGradient: 'from-red-600 to-red-800',
    textColor: 'text-red-400',
  },
  {
    id: 'yu',
    name: 'Courage',
    kanji: '勇',
    romaji: 'Yū',
    meaning: 'Bravoure, Héroïsme',
    description: "Le courage n'est pas l'absence de peur, mais la capacité d'agir malgré elle. C'est oser faire ce qui est juste.",
    application: "En Aïkido, le courage nous permet d'entrer dans l'attaque (irimi) au lieu de fuir, de faire face à nos limites.",
    bgGradient: 'from-orange-500 to-orange-700',
    textColor: 'text-orange-400',
  },
  {
    id: 'jin',
    name: 'Bienveillance',
    kanji: '仁',
    romaji: 'Jin',
    meaning: 'Compassion, Humanité',
    description: "La sympathie et l'amour inconditionnel pour l'humanité. C'est la capacité de se mettre à la place de l'autre.",
    application: "En Aïkido, Jin nous enseigne à respecter notre partenaire, à ne pas chercher à blesser mais à neutraliser.",
    bgGradient: 'from-amber-500 to-amber-700',
    textColor: 'text-amber-400',
  },
  {
    id: 'rei',
    name: 'Respect',
    kanji: '礼',
    romaji: 'Rei',
    meaning: 'Politesse, Étiquette',
    description: "Le respect n'est pas une marque de faiblesse mais de force intérieure. C'est reconnaître la valeur de chaque être.",
    application: "En Aïkido, le salut (rei) ouvre et ferme chaque pratique, marquant le respect mutuel entre partenaires.",
    bgGradient: 'from-emerald-500 to-emerald-700',
    textColor: 'text-emerald-400',
  },
  {
    id: 'makoto',
    name: 'Sincérité',
    kanji: '誠',
    romaji: 'Makoto',
    meaning: 'Honnêteté, Vérité',
    description: "La sincérité implique de vivre en accord avec ses paroles et ses actes. C'est l'authenticité absolue.",
    application: "En Aïkido, chaque technique doit être exécutée avec une intention sincère, sans tromperie ni artifice.",
    bgGradient: 'from-cyan-500 to-cyan-700',
    textColor: 'text-cyan-400',
  },
  {
    id: 'meiyo',
    name: 'Honneur',
    kanji: '名誉',
    romaji: 'Meiyo',
    meaning: 'Dignité, Gloire',
    description: "L'honneur est le reflet de notre intégrité. Il se construit par nos actions et se perd par nos manquements.",
    application: "En Aïkido, l'honneur nous pousse à donner le meilleur de nous-mêmes et à reconnaître nos erreurs.",
    bgGradient: 'from-blue-500 to-blue-700',
    textColor: 'text-blue-400',
  },
  {
    id: 'chugi',
    name: 'Loyauté',
    kanji: '忠義',
    romaji: 'Chūgi',
    meaning: 'Fidélité, Dévouement',
    description: "La loyauté est l'engagement envers ceux qui nous font confiance. C'est tenir ses promesses envers et contre tout.",
    application: "En Aïkido, la loyauté envers notre sensei et notre dojo renforce notre progression sur la Voie.",
    bgGradient: 'from-purple-600 to-purple-800',
    textColor: 'text-purple-400',
  },
];

export default function VertusPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'fr';
  const sport = (params?.sport as string) || 'aikido';
  const [selectedVirtue, setSelectedVirtue] = useState<typeof BUSHIDO_VIRTUES[0] | null>(null);
  const [completedVirtues, setCompletedVirtues] = useState<string[]>([]);

  const handleMarkComplete = (virtueId: string) => {
    setCompletedVirtues(prev => 
      prev.includes(virtueId) 
        ? prev.filter(v => v !== virtueId)
        : [...prev, virtueId]
    );
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wayofdojo_token');
      window.location.href = `/${locale}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#06101f]">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <AdultSidebar locale={locale} sport={sport} onLogout={handleLogout} />
      </div>

      {/* Header */}
      <AdultHeader locale={locale} sport={sport} userName="Pratiquant" notificationCount={0} showMenuButton={true} />

      {/* Contenu principal */}
      <div className="lg:ml-[260px] pt-[60px]">
        <div className="p-4 lg:p-6 max-w-5xl mx-auto">
          
          {/* Header de page */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="hover:bg-slate-800 text-slate-400"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-3xl">☯</span>
                  Les 7 Vertus du Bushido
                </h1>
                <p className="text-slate-400 text-sm">武士道 — Le code d'honneur des guerriers</p>
              </div>
            </div>
            <Link href={`/${locale}/${sport}/dojo`}>
              <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                Retour au Dojo
              </Button>
            </Link>
          </div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0d1628] rounded-2xl p-6 border border-slate-800 mb-6"
          >
            <p className="text-slate-300 leading-relaxed">
              Le <strong className="text-amber-400">Bushidō</strong> (武士道) est le code d'honneur des samouraïs, 
              un ensemble de valeurs morales qui guidaient la vie des guerriers japonais. 
              Ces sept vertus forment le pilier de l'éthique martiale et continuent d'inspirer 
              la pratique de l'Aïkido aujourd'hui.
            </p>
            
            {/* Barre de progression */}
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Progression</span>
                <span className="text-orange-400 font-bold">{completedVirtues.length} / 7 vertus explorées</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedVirtues.length / 7) * 100}%` }}
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Grille des 7 vertus avec Kanji */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
            {BUSHIDO_VIRTUES.map((virtue, index) => {
              const isCompleted = completedVirtues.includes(virtue.id);
              
              return (
                <motion.div
                  key={virtue.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedVirtue(virtue)}
                  className="cursor-pointer relative"
                >
                  <div 
                    className={`
                      aspect-square rounded-2xl bg-gradient-to-br ${virtue.bgGradient}
                      p-4 flex flex-col items-center justify-center text-center 
                      transition-all duration-200 
                      shadow-lg hover:shadow-xl border border-white/10
                      relative overflow-hidden
                      ${isCompleted ? 'ring-2 ring-emerald-500' : ''}
                    `}
                  >
                    {/* Badge complété */}
                    {isCompleted && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    {/* Cercle de fond subtil */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <div className="w-24 h-24 rounded-full bg-white"></div>
                    </div>
                    
                    {/* Kanji japonais */}
                    <span 
                      className="text-4xl lg:text-5xl font-bold text-white drop-shadow-lg relative z-10" 
                      style={{ fontFamily: "'Noto Serif JP', serif" }}
                    >
                      {virtue.kanji}
                    </span>
                    
                    {/* Nom romaji */}
                    <span className="text-xs text-white/90 font-semibold mt-2 relative z-10">
                      {virtue.romaji}
                    </span>
                    
                    {/* Signification */}
                    <span className="text-[10px] text-white/70 relative z-10">
                      {virtue.name}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Légende */}
          <div className="bg-[#0d1628] rounded-xl p-4 border border-slate-800 mb-6">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {BUSHIDO_VIRTUES.map((v) => (
                <span key={v.id} className="flex items-center gap-2">
                  <span className={`font-bold ${v.textColor}`}>{v.romaji}</span>
                  <span className="text-slate-500">—</span>
                  <span className="text-slate-400">{v.name}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Section conseil */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#0d1628] rounded-xl p-5 border border-slate-800 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
              <span className="text-2xl">🥋</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white mb-1">Le Bushidō dans votre pratique</p>
              <p className="text-slate-400 text-sm">
                Ces sept vertus ne sont pas de simples concepts historiques. Elles sont le fondement 
                d'une pratique martiale authentique. Chaque fois que vous entrez sur le tatami, 
                vous avez l'opportunité de cultiver ces qualités.
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Modal détail vertu */}
      <AnimatePresence>
        {selectedVirtue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedVirtue(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#0d1628] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Header coloré */}
              <div className={`p-6 bg-gradient-to-br ${selectedVirtue.bgGradient}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <span 
                        className="text-4xl font-bold text-white" 
                        style={{ fontFamily: "'Noto Serif JP', serif" }}
                      >
                        {selectedVirtue.kanji}
                      </span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{selectedVirtue.romaji}</div>
                      <div className="text-white/90">{selectedVirtue.name}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedVirtue(null)}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6 space-y-5">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Signification
                  </h3>
                  <p className="text-white font-medium">{selectedVirtue.meaning}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Description
                  </h3>
                  <p className="text-slate-300 leading-relaxed">{selectedVirtue.description}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Application en Aïkido
                  </h3>
                  <p className="text-slate-300 leading-relaxed">{selectedVirtue.application}</p>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-700 flex gap-3">
                  <Button
                    onClick={() => handleMarkComplete(selectedVirtue.id)}
                    className={`flex-1 ${
                      completedVirtues.includes(selectedVirtue.id)
                        ? 'bg-emerald-600 hover:bg-emerald-500'
                        : 'bg-orange-600 hover:bg-orange-500'
                    }`}
                  >
                    {completedVirtues.includes(selectedVirtue.id) ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Exploré
                      </>
                    ) : (
                      'Marquer comme exploré'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedVirtue(null)}
                    className="border-slate-600 hover:bg-slate-800 text-slate-300"
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
