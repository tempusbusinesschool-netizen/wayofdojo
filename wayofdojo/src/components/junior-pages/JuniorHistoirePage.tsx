'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Book, ChevronRight, X } from 'lucide-react';
import { JuniorPageLayout } from '@/components/layouts/JuniorPageLayout';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * JuniorHistoirePage - Histoire de l'Aïkido version enfantine
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const HISTOIRE_CHAPTERS = [
  {
    id: 'osensei',
    title: 'Le Grand Maître O\'Sensei',
    emoji: '👴',
    color: 'from-amber-500 to-orange-600',
    shortDesc: 'L\'homme qui a créé l\'Aïkido !',
    fullContent: `Il était une fois au Japon, un petit garçon nommé Morihei Ueshiba. Il était souvent malade et pas très fort. Alors il a décidé de devenir le plus fort possible en apprenant les arts martiaux !

Après des années d'entraînement, il est devenu un maître incroyable. Mais un jour, il a compris quelque chose de très important : la vraie force, ce n'est pas de battre les autres. C'est de protéger tout le monde, même ses adversaires !

C'est comme ça qu'il a inventé l'Aïkido en 1942. On l'appelle "O'Sensei" qui veut dire "Grand Professeur" en japonais.`,
    funFact: '🎂 O\'Sensei est né le 14 décembre 1883 et a vécu jusqu\'à 85 ans !',
  },
  {
    id: 'aikido_name',
    title: 'Que veut dire Aïkido ?',
    emoji: '📝',
    color: 'from-blue-500 to-cyan-600',
    shortDesc: 'Le secret du nom magique !',
    fullContent: `Le mot "Aïkido" est composé de 3 mots japonais magiques :

合 (Aï) = Harmonie, être en accord
C'est comme quand tu chantes en chœur avec tes amis - tout le monde est ensemble !

気 (Ki) = Énergie, la force de vie
C'est l'énergie qui est en toi et tout autour de toi, comme le vent ou l'électricité !

道 (Do) = Le chemin, la voie
C'est comme un sentier que tu suis pour devenir meilleur chaque jour.

Donc l'Aïkido, c'est "Le chemin de l'harmonie avec l'énergie" ! Cool, non ? 😎`,
    funFact: '🎌 En japonais, on écrit Aïkido comme ça : 合気道',
  },
  {
    id: 'japan',
    title: 'Le Pays du Soleil Levant',
    emoji: '🗾',
    color: 'from-red-500 to-rose-600',
    shortDesc: 'Le Japon, berceau de l\'Aïkido !',
    fullContent: `L'Aïkido vient du Japon, un pays composé de plein d'îles au milieu de l'océan Pacifique !

Au Japon, il y a des choses incroyables :
🏯 Des châteaux magnifiques
🌸 Des cerisiers en fleurs au printemps
🗻 Le Mont Fuji, une montagne qui ressemble à un volcan
🍣 Des sushis délicieux

Les Japonais ont inventé plein d'arts martiaux : le Judo, le Karaté, le Kendo avec des sabres... et bien sûr l'Aïkido !

Dans les dojos japonais, on respecte beaucoup les traditions et on apprend le respect dès le premier jour.`,
    funFact: '🌅 On appelle le Japon "Le Pays du Soleil Levant" car il est à l\'Est !',
  },
  {
    id: 'dojo',
    title: 'Le Dojo, notre maison',
    emoji: '🏠',
    color: 'from-green-500 to-emerald-600',
    shortDesc: 'Un endroit spécial pour s\'entraîner !',
    fullContent: `Le dojo, c'est l'endroit où on pratique l'Aïkido. Le mot veut dire "Le lieu de la Voie" en japonais.

Quand tu entres dans un dojo, tu fais un salut (Rei) pour montrer ton respect. C'est comme dire "Bonjour et merci de m'accueillir" !

Dans le dojo, il y a :
🥋 Le tatami : le sol souple où on peut tomber sans se faire mal
🖼️ Le kamiza : le mur d'honneur avec souvent une photo d'O'Sensei
👘 Les keikogi : les vêtements blancs qu'on porte

Le dojo, c'est un endroit sacré où on laisse ses soucis dehors et on se concentre sur l'entraînement !`,
    funFact: '🚪 On enlève toujours ses chaussures avant d\'entrer sur le tatami !',
  },
  {
    id: 'samurai',
    title: 'Les Samouraïs',
    emoji: '⚔️',
    color: 'from-purple-500 to-violet-600',
    shortDesc: 'Les guerriers légendaires !',
    fullContent: `Les samouraïs étaient des guerriers japonais super courageux qui vivaient il y a très longtemps !

Ils portaient de belles armures et savaient utiliser :
🗡️ Le katana (le sabre long)
⚔️ Le wakizashi (le sabre court)
🏹 L'arc et les flèches

Mais le plus important, c'est qu'ils suivaient un code d'honneur appelé le Bushido. Ce code leur apprenait à être :
- Courageux mais jamais méchants
- Forts mais toujours gentils
- Fiers mais jamais orgueilleux

L'Aïkido s'inspire de l'esprit des samouraïs. Quand tu pratiques, tu deviens un petit samouraï moderne ! 🥷`,
    funFact: '🎎 Les samouraïs aimaient aussi l\'art, la poésie et la cérémonie du thé !',
  },
];

interface JuniorHistoirePageProps {
  userName?: string;
  userXp?: number;
  userLevel?: number;
  userStreak?: number;
}

export const JuniorHistoirePage: React.FC<JuniorHistoirePageProps> = ({
  userName = 'Jeune Samouraï',
  userXp = 0,
  userLevel = 1,
  userStreak = 0,
}) => {
  const params = useParams();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const [selectedChapter, setSelectedChapter] = useState<typeof HISTOIRE_CHAPTERS[0] | null>(null);
  const [readChapters, setReadChapters] = useState<string[]>([]);

  const handleReadChapter = (chapter: typeof HISTOIRE_CHAPTERS[0]) => {
    setSelectedChapter(chapter);
    if (!readChapters.includes(chapter.id)) {
      setReadChapters([...readChapters, chapter.id]);
    }
  };

  return (
    <JuniorPageLayout
      locale={locale}
      sport={sport}
      title="L'Histoire de l'Aïkido"
      subtitle="Découvre les origines de ton art martial ! 📜"
      emoji="📖"
      userName={userName}
      userXp={userXp}
      userLevel={userLevel}
      userStreak={userStreak}
    >
      {/* Progression de lecture */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 mb-6 border border-white/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Book className="w-5 h-5" />
            Chapitres lus
          </h3>
          <span className="text-yellow-400 font-bold">{readChapters.length}/{HISTOIRE_CHAPTERS.length}</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(readChapters.length / HISTOIRE_CHAPTERS.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
          />
        </div>
        <p className="text-center text-white/60 text-sm mt-2">
          {readChapters.length === HISTOIRE_CHAPTERS.length 
            ? '🎉 Tu connais toute l\'histoire ! Tu es un expert !' 
            : 'Lis tous les chapitres pour devenir un expert !'}
        </p>
      </div>

      {/* Liste des chapitres */}
      <div className="space-y-4">
        {HISTOIRE_CHAPTERS.map((chapter, index) => {
          const isRead = readChapters.includes(chapter.id);
          
          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              onClick={() => handleReadChapter(chapter)}
              className={`relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                isRead
                  ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-2 border-green-400/50'
                  : 'bg-white/10 hover:bg-white/20 border border-white/10'
              }`}
            >
              {/* Numéro de chapitre */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${chapter.color} flex items-center justify-center shadow-lg shrink-0`}>
                <span className="text-2xl">{chapter.emoji}</span>
              </div>

              {/* Contenu */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white/50 text-sm">Chapitre {index + 1}</span>
                  {isRead && (
                    <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                      ✓ LU
                    </span>
                  )}
                </div>
                <h4 className="text-white font-bold text-lg">{chapter.title}</h4>
                <p className="text-white/70 text-sm">{chapter.shortDesc}</p>
              </div>

              <ChevronRight className="w-5 h-5 text-white/50" />
            </motion.div>
          );
        })}
      </div>

      {/* Modal chapitre */}
      <AnimatePresence>
        {selectedChapter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedChapter(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto border border-white/20 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedChapter.color} flex items-center justify-center shadow-lg`}>
                  <span className="text-4xl">{selectedChapter.emoji}</span>
                </div>
                <button
                  onClick={() => setSelectedChapter(null)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">{selectedChapter.title}</h3>

              {/* Contenu */}
              <div className="text-white/80 leading-relaxed whitespace-pre-line mb-6">
                {selectedChapter.fullContent}
              </div>

              {/* Fun fact */}
              <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4 mb-6">
                <h4 className="text-yellow-400 font-bold text-sm mb-2">💡 Le savais-tu ?</h4>
                <p className="text-white/80 text-sm">{selectedChapter.funFact}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedChapter(null)}
                className={`w-full py-3 bg-gradient-to-r ${selectedChapter.color} rounded-xl text-white font-bold`}
              >
                Super intéressant ! 🌟
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </JuniorPageLayout>
  );
};

export default JuniorHistoirePage;
