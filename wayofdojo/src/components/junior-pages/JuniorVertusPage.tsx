'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Star, X, CheckCircle } from 'lucide-react';
import { JuniorPageLayout } from '@/components/layouts/JuniorPageLayout';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * JuniorVertusPage - Les 7 Vertus du Bushido version enfantine
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const VERTUS = [
  {
    id: 'respect',
    name: 'Respect',
    kanji: '礼',
    romaji: 'Rei',
    color: 'from-red-500 to-red-600',
    emoji: '🙇',
    animal: '🦁',
    shortDesc: 'Être poli et gentil avec tout le monde !',
    fullDesc: `Le respect, c'est comme un super-pouvoir ! 

Quand tu salues ton sensei en entrant dans le dojo, quand tu dis "merci" et "s'il te plaît", quand tu écoutes les autres sans les interrompre... Tu montres que tu es un vrai samouraï !

Le lion est l'animal du respect car il est le roi des animaux, mais il protège sa famille et traite les autres avec dignité.`,
    examples: ['Saluer en entrant dans le dojo', 'Écouter quand quelqu\'un parle', 'Dire merci à son partenaire'],
    challenge: 'Dis "merci" à 3 personnes aujourd\'hui !',
  },
  {
    id: 'courage',
    name: 'Courage',
    kanji: '勇',
    romaji: 'Yū',
    color: 'from-orange-500 to-orange-600',
    emoji: '💪',
    animal: '🐯',
    shortDesc: 'Oser essayer même si on a un peu peur !',
    fullDesc: `Le courage, ce n'est pas de ne jamais avoir peur. C'est d'essayer quand même ! 

Quand tu fais une chute pour la première fois, quand tu essaies une technique difficile, quand tu poses une question au sensei... Tu deviens plus fort à chaque fois !

Le tigre est l'animal du courage car il avance toujours, même face aux difficultés.`,
    examples: ['Essayer une nouvelle technique', 'Faire une chute sans hésiter', 'Poser une question au sensei'],
    challenge: 'Essaie quelque chose de nouveau aujourd\'hui !',
  },
  {
    id: 'maitrise',
    name: 'Maîtrise',
    kanji: '克',
    romaji: 'Koku',
    color: 'from-yellow-500 to-amber-600',
    emoji: '🎯',
    animal: '🦅',
    shortDesc: 'S\'entraîner pour devenir meilleur !',
    fullDesc: `La maîtrise, c'est comme apprendre à faire du vélo. Au début c'est difficile, mais si tu répètes encore et encore, un jour ça devient facile ! 

Les vrais samouraïs s'entraînent tous les jours, pas pour être les meilleurs, mais pour être meilleurs qu'hier.

L'aigle est l'animal de la maîtrise car il vole avec précision et ne rate jamais sa cible.`,
    examples: ['Répéter une technique 10 fois', 'Rester concentré pendant tout le cours', 'Ne pas abandonner quand c\'est dur'],
    challenge: 'Répète 10 fois ta technique préférée !',
  },
  {
    id: 'humilite',
    name: 'Humilité',
    kanji: '謙',
    romaji: 'Ken',
    color: 'from-green-500 to-emerald-600',
    emoji: '🌱',
    animal: '🐢',
    shortDesc: 'Savoir qu\'on peut toujours apprendre !',
    fullDesc: `L'humilité, c'est accepter qu'on ne sait pas tout. Même les plus grands maîtres continuent d'apprendre ! 

Quand quelqu'un te corrige, dis "merci" car il t'aide à progresser. Ne te vante pas quand tu réussis, et ne te moque pas de ceux qui ont du mal.

La tortue est l'animal de l'humilité car elle avance doucement mais sûrement, sans se presser ni se vanter.`,
    examples: ['Accepter les conseils du sensei', 'Féliciter un camarade qui réussit', 'Reconnaître ses erreurs'],
    challenge: 'Félicite un camarade pour quelque chose qu\'il fait bien !',
  },
  {
    id: 'bienveillance',
    name: 'Bienveillance',
    kanji: '仁',
    romaji: 'Jin',
    color: 'from-blue-500 to-cyan-600',
    emoji: '💙',
    animal: '🐻',
    shortDesc: 'Être gentil et aider les autres !',
    fullDesc: `La bienveillance, c'est avoir un grand cœur ! 

Quand tu aides un ami qui a du mal, quand tu fais attention à ne pas faire mal à ton partenaire, quand tu partages ton goûter... Tu montres que tu es un samouraï au cœur d'or.

L'ours est l'animal de la bienveillance car il protège sa famille et partage sa nourriture avec les autres.`,
    examples: ['Aider un débutant', 'Encourager un camarade', 'Prêter son matériel'],
    challenge: 'Aide quelqu\'un qui en a besoin aujourd\'hui !',
  },
  {
    id: 'attention',
    name: 'Attention',
    kanji: '注',
    romaji: 'Chū',
    color: 'from-indigo-500 to-violet-600',
    emoji: '👀',
    animal: '🦉',
    shortDesc: 'Bien regarder et bien écouter !',
    fullDesc: `L'attention, c'est comme avoir des super-yeux et des super-oreilles ! 

Quand tu regardes bien ce que fait le sensei, tu apprends plus vite. Quand tu écoutes les consignes, tu fais moins d'erreurs. Les ninjas sont toujours attentifs à tout ce qui se passe autour d'eux !

La chouette est l'animal de l'attention car elle voit et entend tout, même la nuit.`,
    examples: ['Regarder le sensei montrer la technique', 'Écouter les consignes', 'Rester concentré sans bavarder'],
    challenge: 'Pendant 5 minutes, écoute sans parler !',
  },
  {
    id: 'responsabilite',
    name: 'Responsabilité',
    kanji: '責',
    romaji: 'Seki',
    color: 'from-purple-500 to-pink-600',
    emoji: '⭐',
    animal: '🐺',
    shortDesc: 'Faire ce qu\'on doit faire !',
    fullDesc: `La responsabilité, c'est être digne de confiance ! 

Quand tu ranges ton keikogi tout seul, quand tu arrives à l'heure, quand tu aides à ranger le tatami... Tu montres que tu es un grand samouraï sur qui on peut compter !

Le loup est l'animal de la responsabilité car il prend soin de sa meute et fait toujours sa part du travail.`,
    examples: ['Ranger ses affaires après le cours', 'Arriver à l\'heure', 'Prendre soin du matériel'],
    challenge: 'Range ta chambre sans qu\'on te le demande !',
  },
];

interface JuniorVertusPageProps {
  userName?: string;
  userXp?: number;
  userLevel?: number;
  userStreak?: number;
  virtueProgress?: Record<string, number>;
}

export const JuniorVertusPage: React.FC<JuniorVertusPageProps> = ({
  userName = 'Jeune Samouraï',
  userXp = 0,
  userLevel = 1,
  userStreak = 0,
  virtueProgress = { respect: 3, courage: 2, bienveillance: 1 },
}) => {
  const params = useParams();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const [selectedVertu, setSelectedVertu] = useState<typeof VERTUS[0] | null>(null);

  // Calculer le total des niveaux
  const totalProgress = Object.values(virtueProgress).reduce((a, b) => a + b, 0);
  const maxProgress = VERTUS.length * 5; // Max level 5 pour chaque vertu

  return (
    <JuniorPageLayout
      locale={locale}
      sport={sport}
      title="Les 7 Vertus du Bushido"
      subtitle="Deviens un vrai samouraï de cœur ! 🎭"
      emoji="⭐"
      userName={userName}
      userXp={userXp}
      userLevel={userLevel}
      userStreak={userStreak}
    >
      {/* Progression globale */}
      <div className="bg-gradient-to-br from-purple-600/80 to-pink-600/80 backdrop-blur-xl rounded-3xl p-5 mb-6 border border-purple-400/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold flex items-center gap-2">
            🌟 Ton niveau de Samouraï
          </h3>
          <span className="text-yellow-400 font-bold">{totalProgress}/{maxProgress}</span>
        </div>
        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(totalProgress / maxProgress) * 100}%` }}
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
          />
        </div>
        <p className="text-center text-white/70 text-sm mt-2">
          {totalProgress < 10 
            ? '🌱 Tu commences ton chemin de samouraï !' 
            : totalProgress < 20 
              ? '💪 Tu progresses bien, continue !' 
              : '🏆 Tu es sur la voie du vrai samouraï !'}
        </p>
      </div>

      {/* Grille des vertus */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {VERTUS.map((vertu, index) => {
          const level = virtueProgress[vertu.id] || 0;
          
          return (
            <motion.div
              key={vertu.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => setSelectedVertu(vertu)}
              className={`relative bg-gradient-to-br ${vertu.color} rounded-2xl p-4 cursor-pointer shadow-xl text-center border-2 border-white/20`}
            >
              {/* Kanji */}
              <div className="text-5xl font-bold text-white/90 mb-1">{vertu.kanji}</div>
              
              {/* Animal */}
              <span className="text-2xl">{vertu.animal}</span>
              
              {/* Nom */}
              <h4 className="text-white font-bold mt-2">{vertu.name}</h4>
              
              {/* Barre de niveau */}
              <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(level / 5) * 100}%` }}
                  className="h-full bg-white rounded-full"
                />
              </div>
              <p className="text-white/70 text-xs mt-1">Niveau {level}/5</p>

              {/* Étoiles */}
              <div className="flex justify-center gap-0.5 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= level
                        ? 'text-yellow-300 fill-yellow-300'
                        : 'text-white/30'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal détail vertu */}
      <AnimatePresence>
        {selectedVertu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedVertu(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto border border-white/20 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedVertu.color} flex items-center justify-center shadow-xl`}>
                    <span className="text-4xl font-bold text-white">{selectedVertu.kanji}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedVertu.name}</h3>
                    <p className="text-white/60">{selectedVertu.romaji}</p>
                    <span className="text-3xl">{selectedVertu.animal}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVertu(null)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>

              {/* Description courte */}
              <div className={`bg-gradient-to-r ${selectedVertu.color} rounded-xl p-3 mb-4`}>
                <p className="text-white font-medium text-center">
                  {selectedVertu.emoji} {selectedVertu.shortDesc}
                </p>
              </div>

              {/* Description complète */}
              <p className="text-white/80 leading-relaxed whitespace-pre-line mb-4">
                {selectedVertu.fullDesc}
              </p>

              {/* Exemples */}
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <h4 className="text-white font-bold text-sm mb-2">📋 Comment pratiquer cette vertu ?</h4>
                <ul className="space-y-2">
                  {selectedVertu.examples.map((example, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/70 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Défi du jour */}
              <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4 mb-4">
                <h4 className="text-yellow-400 font-bold text-sm mb-2">🎯 Défi du jour</h4>
                <p className="text-white/80 text-sm">{selectedVertu.challenge}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedVertu(null)}
                className={`w-full py-3 bg-gradient-to-r ${selectedVertu.color} rounded-xl text-white font-bold`}
              >
                Je vais pratiquer ! 💪
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </JuniorPageLayout>
  );
};

export default JuniorVertusPage;
