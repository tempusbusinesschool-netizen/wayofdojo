'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, LogIn, UserPlus, LogOut, User, Sparkles, Lock, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MaitreTanaka from '@/components/MaitreTanaka';
import NinjaJourney from '@/components/NinjaJourney';
import VisitorStepsBlocks from '@/components/VisitorStepsBlocks';

// Image de Maître Tanaka pour le logo animé
const TANAKA_IMAGE = "/images/tanaka/portrait.png";

// Logo animé Tanaka (cercle orange flottant)
const TanakaAnimatedLogo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 overflow-hidden border-2 border-amber-300/50`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={TANAKA_IMAGE} 
        alt="Maître Tanaka" 
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          if (target.parentElement) {
            target.parentElement.innerHTML = '<span class="text-white text-xl">🥋</span>';
          }
        }}
      />
    </motion.div>
  );
};

export default function HomePage() {
  const params = useParams();
  const locale = params.locale as string || 'fr';
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userName, setUserName] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('wayofdojo_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setIsLoggedIn(true);
        setUserName(userData.first_name || '');
        // Redirection automatique vers le dojo si déjà connecté
        router.push(`/${locale}/aikido/dojo`);
      } catch {
        setIsLoggedIn(false);
      }
    }
    setCheckingAuth(false);
  }, [locale, router]);

  const handleStepClick = (_stepId: number) => {
    // Si l'utilisateur clique sur une étape, on l'invite à s'inscrire
    if (!isLoggedIn) {
      router.push(`/${locale}/aikido/register`);
    } else {
      router.push(`/${locale}/aikido/dojo`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('wayofdojo_user');
    localStorage.removeItem('wayofdojo_token');
    setIsLoggedIn(false);
    setUserName('');
  };

  // Afficher un écran de chargement pendant la vérification d'authentification
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <TanakaAnimatedLogo size="lg" />
          </motion.div>
          <p className="text-white font-bold mt-4">Aikido@Game</p>
          <p className="text-slate-400 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* HEADER - Style identique à l'ancien projet */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            
            {/* Logo + Titre */}
            <Link 
              href={`/${locale}`} 
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity group"
            >
              <TanakaAnimatedLogo size="md" />
              <div className="text-left">
                <p className="text-xs sm:text-sm text-amber-400 font-medium group-hover:text-amber-300 transition-colors">Aikido@Game</p>
                <p className="text-sm sm:text-lg text-white font-bold group-hover:text-slate-200 transition-colors hidden sm:block">Votre parcours</p>
              </div>
            </Link>

            {/* Navigation Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 text-sm font-medium">Bienvenue {userName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/${locale}/aikido/dojo`)}
                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20"
                  >
                    <Swords className="w-4 h-4 mr-2" />
                    Mon Dojo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-white hover:bg-slate-700"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  {/* Boutons d'accès */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/${locale}/aikido/login`)}
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Connexion
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => router.push(`/${locale}/aikido/register`)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Inscription
                  </Button>
                  
                  {/* Séparateur */}
                  <div className="w-px h-6 bg-slate-700 mx-1" />
                  
                  {/* Bouton Espace Gestion (Admin/Dojo) */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white hover:bg-slate-700"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Espace Gestion
                  </Button>
                </>
              )}
            </div>

            {/* Menu Mobile */}
            <div className="md:hidden flex items-center gap-2">
              {!isLoggedIn && (
                <Button
                  size="sm"
                  onClick={() => router.push(`/${locale}/aikido/register`)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs px-3"
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-slate-400 hover:text-white"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Menu Mobile Dropdown */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-3 pt-3 border-t border-slate-800"
              >
                <div className="flex flex-col gap-2">
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/30 px-3 py-2 rounded-lg">
                        <User className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300 text-sm">Bienvenue {userName}</span>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => { router.push(`/${locale}/aikido/dojo`); setShowMobileMenu(false); }}
                        className="justify-start text-cyan-400"
                      >
                        <Swords className="w-4 h-4 mr-2" />
                        Mon Dojo
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => { handleLogout(); setShowMobileMenu(false); }}
                        className="justify-start text-slate-400"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => { router.push(`/${locale}/aikido/login`); setShowMobileMenu(false); }}
                        className="justify-start text-slate-300"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Connexion
                      </Button>
                      <Button
                        onClick={() => { router.push(`/${locale}/aikido/register`); setShowMobileMenu(false); }}
                        className="justify-start bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Inscription gratuite
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowMobileMenu(false)}
                        className="justify-start text-slate-400"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Espace Gestion
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION - Titre principal avec animation */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Fond animé */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-slate-900 to-slate-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 px-4 py-2 rounded-full mb-4"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">L&apos;Aïkido, c&apos;est du jeu !</span>
            </motion.div>

            {/* Titre principal */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              Deviens un vrai{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Ninja !
              </span>{' '}
              🥷
            </h1>

            <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-6">
              Apprends l&apos;Aïkido en t&apos;amusant avec Maître Tanaka. 
              <span className="text-white font-semibold"> 206+ techniques</span>, 
              <span className="text-amber-400 font-semibold"> 7 vertus magiques</span>, 
              et plein de défis à relever !
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                onClick={() => router.push(`/${locale}/aikido/register`)}
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 text-white font-bold text-lg px-8 py-6 rounded-2xl shadow-xl shadow-amber-500/30 transform hover:scale-105 transition-all"
                data-testid="hero-cta-register"
              >
                <span className="text-2xl mr-2">🥷</span>
                Commencer l&apos;aventure
                <span className="text-2xl ml-2">🚀</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push(`/${locale}/aikido/login`)}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white font-semibold px-8 py-6 rounded-2xl"
              >
                <LogIn className="w-5 h-5 mr-2" />
                J&apos;ai déjà un compte
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* PARCOURS EN 6 ÉTAPES - NinjaJourney */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <NinjaJourney onStepClick={handleStepClick} currentStep={0} />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* 8 BLOCS DE PRÉVISUALISATION - VisitorStepsBlocks */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <VisitorStepsBlocks 
            mode="enfant" 
            onSignupClick={() => router.push(`/${locale}/aikido/register`)}
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-slate-900/50 border-t border-slate-800 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <TanakaAnimatedLogo size="sm" />
              <div>
                <p className="text-amber-400 font-bold">Aikido@Game</p>
                <p className="text-slate-500 text-xs">L&apos;Aïkido, c&apos;est du jeu !</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500 text-sm">
              <Link href="#" className="hover:text-white transition-colors">CGU</Link>
              <Link href="#" className="hover:text-white transition-colors">CGV</Link>
              <Link href="#" className="hover:text-white transition-colors">Mentions légales</Link>
              <Link href="#" className="hover:text-white transition-colors">RGPD</Link>
            </div>
            
            <p className="text-slate-600 text-xs">
              © 2025 WayofDojo - Tous droits réservés
            </p>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* MAÎTRE TANAKA FLOTTANT */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <MaitreTanaka 
        isVisible={true}
        isJeuneNinja={true}
        messages={[
          "Bienvenue jeune Ninja ! Je suis Maître Tanaka, ton guide sur la Voie de l'Aïkido.",
          "Inscris-toi pour commencer ton aventure et découvrir les secrets des grands maîtres !",
          "Chaque vertu t'aidera à devenir un vrai guerrier pacifique.",
        ]}
      />
    </div>
  );
}
