'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, LogIn, UserPlus, LogOut, User, Lock, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VisitorStepsBlocks from '@/components/VisitorStepsBlocks';
import ChooseMode from '@/components/ChooseMode';
import TanakaAnimatedLogo from '@/components/animations/TanakaAnimatedLogo';

// Image de Maître Tanaka pour le logo
const TANAKA_IMAGE = "/images/tanaka/portrait.png";

// Les 7 vertus du Budo pour l'affichage
const BUDO_VIRTUES = [
  { kanji: '義', romaji: 'Gi', name: 'Rectitude', color: '#3B82F6' },
  { kanji: '勇', romaji: 'Yū', name: 'Courage', color: '#EF4444' },
  { kanji: '仁', romaji: 'Jin', name: 'Bienveillance', color: '#EC4899' },
  { kanji: '礼', romaji: 'Rei', name: 'Respect', color: '#F59E0B' },
  { kanji: '誠', romaji: 'Makoto', name: 'Sincérité', color: '#06B6D4' },
  { kanji: '名誉', romaji: 'Meiyo', name: 'Honneur', color: '#8B5CF6' },
  { kanji: '忠義', romaji: 'Chūgi', name: 'Loyauté', color: '#10B981' },
];

// Logo Tanaka statique (sans animation flottante - réservée aux connectés)
const TanakaLogo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
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
            <TanakaLogo size="lg" />
          </motion.div>
          <p className="text-white font-bold mt-4">Way of Dojo</p>
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
              <TanakaLogo size="md" />
              <div className="flex flex-col">
                <p className="text-sm text-amber-400 font-bold group-hover:text-amber-300 transition-colors">Maître Tanaka</p>
                <p className="text-xs text-slate-400">Way of Dojo</p>
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
                  <Link href={`/${locale}/admin`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Espace Gestion
                    </Button>
                  </Link>
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
                      <Link href={`/${locale}/admin`}>
                        <Button
                          variant="ghost"
                          onClick={() => setShowMobileMenu(false)}
                          className="justify-start text-slate-400 w-full"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Espace Gestion
                        </Button>
                      </Link>
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

      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Fond animé */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-slate-900 to-slate-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-4"
          >
            {/* Badge APP INTERACTIVE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 px-4 py-2 rounded-full mb-3"
            >
              <span className="text-emerald-300 text-xs md:text-sm font-bold">🎯 APP INTERACTIVE ! POSE TES QUESTIONS À TANAKA !</span>
            </motion.div>

            {/* Titre principal - Descendu pour harmonie */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight mt-4">
              Deviens un vrai{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Samouraï !
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto mb-5">
              Apprends l&apos;Aïkido en t&apos;amusant avec Maître Tanaka. 
              <span className="text-white font-semibold"> + 214 techniques officielles du 6ᵉ kyu au 3ᵉ dan à maîtriser</span>, 
              apprendre leurs noms et les pratiquer avec ton sensei au Dojo ! 
              <span className="text-amber-400 font-semibold"> Comprendre les valeurs du Budo</span> 
              {' '}et plein de défis à relever tout au long de l&apos;année !
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                onClick={() => router.push(`/${locale}/aikido/register`)}
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 text-white font-bold text-lg px-8 py-6 rounded-2xl shadow-xl shadow-amber-500/30 transform hover:scale-105 transition-all"
                data-testid="hero-cta-register"
              >
                🥋 Commencer l&apos;aventure 🚀
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
      {/* CHOIX DU MODE - ChooseMode - Remonté pour plus d'ergonomie */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-2 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ChooseMode />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* SECTION BUDO - Les 7 vertus avec Tanaka inactif */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-violet-900/30 to-purple-900/20 rounded-3xl p-6 md:p-8 border border-violet-700/30 relative overflow-hidden"
        >
          {/* Fond décoratif */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
            {/* Tanaka Animation - INACTIF (pas de clic, juste visuel) */}
            <div className="flex-shrink-0">
              <div className="relative">
                <TanakaAnimatedLogo
                  size="lg"
                  variant="breathing"
                  isActive={false}
                  showAura={true}
                />
                {/* Badge "Inscris-toi" */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -bottom-2 -right-2 bg-amber-500 text-amber-950 text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                >
                  Inscris-toi !
                </motion.div>
              </div>
            </div>

            {/* Contenu Budo */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Le <span className="text-violet-400">Budo</span> 武道
                </h2>
                <span className="text-3xl md:text-4xl">☯️</span>
              </div>
              
              <p className="text-slate-300 mb-6 max-w-xl">
                Le <strong className="text-violet-300">Bushidō</strong> (武士道), la &quot;Voie du Guerrier&quot;, 
                repose sur <strong className="text-amber-400">7 vertus fondamentales</strong> qui guident 
                chaque pratiquant vers l&apos;excellence martiale et spirituelle.
              </p>

              {/* Les 7 vertus en grille */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 md:gap-3">
                {BUDO_VIRTUES.map((virtue, idx) => (
                  <motion.div
                    key={virtue.romaji}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + idx * 0.05 }}
                    className="flex flex-col items-center p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/30 transition-colors"
                  >
                    <span 
                      className="text-2xl md:text-3xl font-bold"
                      style={{ color: virtue.color }}
                    >
                      {virtue.kanji}
                    </span>
                    <span className="text-[10px] md:text-xs text-slate-400 mt-1">{virtue.romaji}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6"
              >
                <Button
                  onClick={() => router.push(`/${locale}/aikido/register`)}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold px-6"
                >
                  🥋 Découvrir les 7 vertus avec Tanaka
                </Button>
              </motion.div>
            </div>
          </div>
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
              <TanakaLogo size="sm" />
              <div>
                <p className="text-amber-400 font-bold">Maître Tanaka</p>
                <p className="text-slate-500 text-xs">Way of Dojo</p>
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

    </div>
  );
}
