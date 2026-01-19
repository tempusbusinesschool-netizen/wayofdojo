'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Swords, LogIn, UserPlus } from 'lucide-react';
import MaitreTanaka from '@/components/MaitreTanaka';
import NinjaJourney from '@/components/NinjaJourney';
import VisitorStepsBlocks from '@/components/VisitorStepsBlocks';

export default function LandingPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string || 'fr';
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('wayofdojo_user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleStepClick = (step: number) => {
    if (step === 1) {
      router.push(`/${locale}/aikido/register`);
    } else if (isLoggedIn) {
      router.push(`/${locale}/aikido/dojo`);
    } else {
      router.push(`/${locale}/aikido/register`);
    }
  };

  const handleGoToDojo = () => {
    router.push(`/${locale}/aikido/dojo`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-violet-900/90 via-purple-900/90 to-violet-900/90 backdrop-blur-md border-b border-violet-500/20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Swords className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-white">WayofDojo</span>
              <p className="text-xs text-violet-300">L&apos;Aïkido, c&apos;est du jeu !</p>
            </div>
          </Link>

          {/* Tagline Center */}
          <div className="hidden lg:block text-center">
            <p className="text-white font-semibold">
              Deviens un vrai Ninja ! <span className="text-amber-400">🥷</span>
            </p>
            <p className="text-violet-300 text-sm">Apprends l&apos;Aikido en t&apos;amusant</p>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Button 
                onClick={handleGoToDojo}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold shadow-lg shadow-amber-500/30"
              >
                Mon Dojo 🥋
              </Button>
            ) : (
              <>
                <Link href={`/${locale}/aikido/login`}>
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    <LogIn className="w-4 h-4 mr-2" />
                    {t('common.login')}
                  </Button>
                </Link>
                <Link href={`/${locale}/aikido/register`}>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold shadow-lg shadow-amber-500/30">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Créer mon compte Ninja
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12">
        {/* Hero Section with Journey */}
        <section className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              Bienvenue sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">WayofDojo</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              La plateforme gamifiée pour progresser en arts martiaux.
              <br />
              <span className="text-amber-400">Transforme ton entraînement en aventure !</span>
            </p>
          </motion.div>

          {/* 6 Steps Journey */}
          <NinjaJourney onStepClick={handleStepClick} currentStep={0} />
        </section>

        {/* Aperçu du contenu pour visiteurs */}
        <section className="container mx-auto px-4 py-8">
          <VisitorStepsBlocks 
            mode="enfant" 
            onSignupClick={() => router.push(`/${locale}/aikido/register`)}
          />
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-center text-white mb-12"
          >
            Pourquoi choisir WayofDojo ? 🎯
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                emoji: '🎮',
                title: 'Gamification',
                desc: 'XP, badges, défis quotidiens et niveaux',
                color: 'from-emerald-500/20 to-emerald-600/10',
                border: 'border-emerald-500/30',
              },
              {
                emoji: '📊',
                title: 'Suivi complet',
                desc: '206+ techniques documentées par grade',
                color: 'from-cyan-500/20 to-cyan-600/10',
                border: 'border-cyan-500/30',
              },
              {
                emoji: '🥷',
                title: '2 Modes',
                desc: 'Jeune Ninja (enfants) et Ninja Confirmé (adultes)',
                color: 'from-amber-500/20 to-amber-600/10',
                border: 'border-amber-500/30',
              },
              {
                emoji: '🏆',
                title: '7 Vertus',
                desc: 'Développe les vertus du Budo',
                color: 'from-violet-500/20 to-violet-600/10',
                border: 'border-violet-500/30',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-gradient-to-br ${feature.color} rounded-2xl p-6 border ${feature.border} hover:scale-105 transition-transform`}
              >
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-violet-600/20 rounded-3xl p-8 md:p-12 text-center border border-violet-500/30"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Prêt à devenir un Ninja ? 🥷
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Rejoins des milliers de pratiquants qui transforment leur entraînement en aventure.
              Inscription gratuite, commence dès maintenant !
            </p>
            <Link href={`/${locale}/aikido/register`}>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-lg px-8 py-6 shadow-xl shadow-amber-500/30"
              >
                Créer mon compte Ninja gratuitement 🚀
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-white">WayofDojo</span>
              <span className="text-slate-500 text-sm">© 2026</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
              <Link href="#" className="hover:text-white">{t('footer.legalMentions')}</Link>
              <Link href="#" className="hover:text-white">{t('footer.cgu')}</Link>
              <Link href="#" className="hover:text-white">{t('footer.cgv')}</Link>
              <Link href="#" className="hover:text-white">{t('footer.privacy')}</Link>
              <Link href="#" className="hover:text-white">{t('footer.contact')}</Link>
            </nav>
          </div>
        </div>
      </footer>

      {/* Maître Tanaka Assistant */}
      <MaitreTanaka 
        messages={[
          "Bienvenue sur WayofDojo ! 🥋",
          "Je suis Maître Tanaka, ton guide.",
          "Clique sur une étape pour commencer !",
          "L'Aïkido, c'est du jeu ! 🎮",
          "Le respect est la première vertu.",
        ]}
      />
    </div>
  );
}
