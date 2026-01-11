import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

/**
 * VertusPage - Les 7 vertus du Hakama (version adulte)
 * Kanji: 徳 (vertu, morale)
 */
const VertusPage = ({ onBack }) => {
  const vertus = [
    {
      kanji: '仁',
      name: 'Jin',
      french: 'Bienveillance',
      desc: 'La bonté envers autrui, la compassion et l\'empathie. Traiter chaque partenaire avec respect.',
      color: 'from-rose-500 to-pink-600'
    },
    {
      kanji: '義',
      name: 'Gi',
      french: 'Honneur / Droiture',
      desc: 'Agir avec intégrité, faire ce qui est juste même quand personne ne regarde.',
      color: 'from-violet-500 to-purple-600'
    },
    {
      kanji: '礼',
      name: 'Rei',
      french: 'Courtoisie',
      desc: 'Le respect des règles, des traditions et des autres pratiquants. Le salut sincère.',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      kanji: '智',
      name: 'Chi',
      french: 'Sagesse',
      desc: 'La capacité de discernement, apprendre de ses erreurs et progresser continuellement.',
      color: 'from-amber-500 to-orange-600'
    },
    {
      kanji: '信',
      name: 'Shin',
      french: 'Sincérité',
      desc: 'L\'authenticité dans la pratique, la confiance mutuelle entre partenaires.',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      kanji: '忠',
      name: 'Chu',
      french: 'Loyauté',
      desc: 'La fidélité envers son dojo, son enseignant et les principes de l\'Aikido.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      kanji: '孝',
      name: 'Ko',
      french: 'Piété',
      desc: 'Le respect des anciens, la gratitude envers ceux qui transmettent leur savoir.',
      color: 'from-slate-500 to-slate-600'
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Précédent
        </Button>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700">
        <div className="absolute top-4 right-4 text-8xl text-slate-700/30 font-serif">徳</div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-3xl">
              ☯️
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Les 7 Vertus du Hakama</h1>
              <p className="text-slate-400">Philosophie de l'Aikido</p>
            </div>
          </div>

          <p className="text-lg text-slate-300 max-w-2xl">
            Les sept plis du hakama représentent les sept vertus du Bushido que tout pratiquant 
            d'Aikido s'efforce d'incarner, sur et en dehors du tatami.
          </p>
        </div>
      </div>

      {/* Les 7 Vertus */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vertus.map((vertu, index) => (
          <Card 
            key={index} 
            className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all hover:scale-[1.02]"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${vertu.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-3xl text-white font-bold" style={{ fontFamily: "'Noto Serif JP', serif" }}>
                    {vertu.kanji}
                  </span>
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="font-bold text-white text-lg">{vertu.name}</h3>
                    <span className="text-slate-400 text-sm">({vertu.french})</span>
                  </div>
                  <p className="text-sm text-slate-400">{vertu.desc}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Citation */}
      <Card className="bg-gradient-to-r from-violet-900/30 to-purple-900/30 border-violet-700/50">
        <CardContent className="p-8 text-center">
          <p className="text-xl text-slate-300 italic mb-4">
            "L'Aikido n'est pas l'art de combattre avec l'ennemi ; c'est l'art de devenir un avec l'univers."
          </p>
          <p className="text-violet-400 font-semibold">— Morihei Ueshiba, O-Sensei</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VertusPage;
