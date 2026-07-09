'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, HelpCircle, BookOpen, Award, Users, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type FaqItem = {
  q: string;
  a: string;
};

type FaqSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  items: FaqItem[];
};

const FAQ_SECTIONS: FaqSection[] = [
  {
    id: 'demarrage',
    title: 'Démarrage & Inscription',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'from-emerald-500 to-teal-500',
    items: [
      {
        q: "Qu'est-ce que WayofDojo ?",
        a: "WayofDojo est une plateforme interactive et gamifiée qui accompagne les pratiquants d'Aïkido dans leur progression, du 6e Kyu jusqu'au 4e Dan. Elle propose une bibliothèque de 207+ techniques, un suivi personnalisé de vos grades, des quêtes quotidiennes, et un mascot vocal (Maître Tanaka) pour vous guider.",
      },
      {
        q: "Comment m'inscrire ?",
        a: "Cliquez sur « Inscription » en haut à droite. L'inscription est gratuite. Vous choisissez ensuite votre profil (Jeune Samouraï pour les juniors, Samouraï Adulte pour les adultes) et votre grade actuel.",
      },
      {
        q: "Y a-t-il une différence entre le parcours Junior et Adulte ?",
        a: "Oui. Le parcours Junior est plus visuel et ludique (RPG, quêtes, badges), tandis que le parcours Adulte inclut également le Voyage de Musashi, des missions de réflexion et un contenu philosophique enrichi.",
      },
      {
        q: "L'accès est-il payant ?",
        a: "L'inscription et l'accès à l'essentiel des fonctionnalités sont gratuits. Certaines fonctionnalités premium (contenus enrichis, statistiques avancées) pourront être proposées ultérieurement.",
      },
    ],
  },
  {
    id: 'grades',
    title: 'Grades & Progression',
    icon: <Award className="w-5 h-5" />,
    color: 'from-amber-500 to-orange-500',
    items: [
      {
        q: "Comment fonctionne la progression des grades ?",
        a: "L'Aïkido suit une progression officielle en Kyu (6e Kyu → 1er Kyu, ceintures colorées) puis en Dan (1er Dan → 4e Dan, ceinture noire). Chaque grade a un programme technique précis que vous retrouverez dans la section « Ceintures ».",
      },
      {
        q: "Où trouver les techniques par grade ?",
        a: "Dans le menu « Ceintures » de votre Dojo. Chaque grade affiche les techniques requises, classées par attaque (Katate Dori, Shomen Uchi, etc.), avec les variantes Omote et Ura détaillées.",
      },
      {
        q: "Y a-t-il des vidéos pour chaque technique ?",
        a: "Oui. Chaque fiche technique intègre des liens vidéo YouTube pointant vers des tutoriels sélectionnés pour illustrer le mouvement.",
      },
      {
        q: "Comment marquer une technique comme maîtrisée ?",
        a: "Dans la page « Mouvements » ou dans la fiche détaillée d'une technique, cochez la case « maîtrisée ». Cela met à jour votre progression et débloque de l'XP.",
      },
    ],
  },
  {
    id: 'tanaka',
    title: 'Maître Tanaka & Voix',
    icon: <MessageCircle className="w-5 h-5" />,
    color: 'from-violet-500 to-fuchsia-500',
    items: [
      {
        q: "Qui est Maître Tanaka ?",
        a: "Maître Tanaka est votre guide virtuel dans WayofDojo. C'est un mascot animé, alimenté par une IA (GPT-4o), qui répond à vos questions sur l'Aïkido, les techniques, la philosophie et votre progression.",
      },
      {
        q: "Comment parler à Maître Tanaka ?",
        a: "Cliquez sur le bouton flottant « Parle-moi ! » en bas à droite. Une fenêtre s'ouvre : vous pouvez soit taper votre question, soit appuyer sur le micro pour lui parler directement. Il vous répondra à l'oral (voix « onyx ») et à l'écrit.",
      },
      {
        q: "Je n'entends pas la voix de Maître Tanaka, que faire ?",
        a: "Vérifiez que : 1) votre navigateur autorise l'autoplay audio (un clic utilisateur est parfois requis), 2) votre volume système/onglet n'est pas coupé, 3) vous avez autorisé l'accès au micro si vous parlez. Si le problème persiste, essayez de rafraîchir la page (Ctrl+Shift+R).",
      },
      {
        q: "Dans quelles langues Maître Tanaka répond-il ?",
        a: "Actuellement en français. D'autres langues pourront être ajoutées prochainement.",
      },
    ],
  },
  {
    id: 'vertus',
    title: 'Vertus du Budo & Gamification',
    icon: <Users className="w-5 h-5" />,
    color: 'from-cyan-500 to-blue-500',
    items: [
      {
        q: "Quelles sont les 7 vertus du Budo ?",
        a: "義 Gi (Rectitude), 勇 Yū (Courage), 仁 Jin (Bienveillance), 礼 Rei (Respect), 誠 Makoto (Sincérité), 名誉 Meiyo (Honneur), 忠義 Chūgi (Loyauté). Ces valeurs sont au cœur de la pratique et rythment votre progression sur WayofDojo.",
      },
      {
        q: "Comment gagner de l'XP et monter en niveau ?",
        a: "Vous gagnez de l'XP en : validant des techniques, complétant des quêtes quotidiennes, réussissant des quiz, remplissant votre carnet de bord, et en atteignant des jalons de progression.",
      },
      {
        q: "À quoi servent les badges et trophées ?",
        a: "Les badges récompensent des accomplissements précis (ex : maîtriser tous les mouvements de base, atteindre un nouveau grade). Les trophées valorisent des étapes majeures. Retrouvez-les dans la section « Trophées ».",
      },
    ],
  },
  {
    id: 'compte',
    title: 'Compte & Confidentialité',
    icon: <HelpCircle className="w-5 h-5" />,
    color: 'from-slate-500 to-slate-700',
    items: [
      {
        q: "Comment modifier mon profil ?",
        a: "Rendez-vous dans « Profil » depuis votre Dojo. Vous pouvez y modifier votre prénom, votre grade, votre profil (Junior/Adulte) et vos préférences.",
      },
      {
        q: "Comment supprimer mon compte ?",
        a: "Vous pouvez demander la suppression de votre compte à tout moment via la section « Profil ». Toutes vos données personnelles seront effacées conformément au RGPD.",
      },
      {
        q: "Mes données sont-elles sécurisées ?",
        a: "Oui. Vos mots de passe sont chiffrés (bcrypt), vos données sont hébergées sur MongoDB, et nous ne partageons aucune information avec des tiers sans votre consentement.",
      },
    ],
  },
];

export default function GuidePage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || 'fr';
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950">
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/${locale}`)}
            className="text-slate-300 hover:text-white"
            data-testid="guide-back-btn"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Accueil
          </Button>
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <BookOpen className="w-5 h-5" />
            <span className="hidden sm:inline">Guide & Questions</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 lg:py-12 max-w-4xl" data-testid="guide-page">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-4">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-semibold">Foire Aux Questions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            Guide &{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Tout ce qu&apos;il faut savoir pour bien démarrer sur WayofDojo, progresser dans votre pratique de l&apos;Aïkido et tirer le meilleur de Maître Tanaka.
          </p>
        </motion.div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {FAQ_SECTIONS.map((section, sIdx) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sIdx * 0.05 }}
              className="rounded-2xl bg-slate-900/50 border border-slate-800/70 overflow-hidden"
              data-testid={`guide-section-${section.id}`}
            >
              <div className={`bg-gradient-to-r ${section.color} px-5 py-4 flex items-center gap-3`}>
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white">
                  {section.icon}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">{section.title}</h2>
              </div>

              <div className="divide-y divide-slate-800/60">
                {section.items.map((item, i) => {
                  const key = `${section.id}-${i}`;
                  const isOpen = openItems.has(key);
                  return (
                    <div key={key}>
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full px-5 py-4 flex items-start justify-between gap-4 text-left hover:bg-slate-800/40 transition-colors"
                        data-testid={`guide-item-${section.id}-${i}`}
                      >
                        <span className="text-white font-medium text-sm sm:text-base flex-1">
                          {item.q}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform mt-0.5 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>

        {/* CTA Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 rounded-2xl bg-gradient-to-br from-purple-600/20 to-amber-500/20 border border-purple-500/30 p-6 sm:p-8 text-center"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Une autre question ?
          </h3>
          <p className="text-slate-300 mb-5 text-sm sm:text-base">
            Maître Tanaka est disponible 24h/24 pour répondre à toutes vos interrogations sur l&apos;Aïkido.
          </p>
          <Link href={`/${locale}/aikido/dojo`}>
            <Button
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold"
              data-testid="guide-cta-tanaka"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Poser ma question à Tanaka
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
