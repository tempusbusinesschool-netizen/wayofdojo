'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Swords, ArrowLeft, HelpCircle } from 'lucide-react';
import VirtualDojo from '@/components/VirtualDojo';
import { TanakaWelcome, TANAKA_MESSAGES } from '@/components/TanakaWelcome';

export default function DojoVirtuelPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const [user, setUser] = useState<{ firstName: string; gamification: { level: number; xp: number } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [dojoOpen] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('wayofdojo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push(`/${locale}/${sport}/login`);
    }
    setLoading(false);
  }, [locale, sport, router]);

  const handleGameComplete = (gameId: string, score: number, ki: number) => {
    console.log(`Game ${gameId} completed: ${score} points, ${ki} Ki`);
  };

  // Fermer le dojo et retourner à la page précédente
  const handleCloseDojo = () => {
    router.push(`/${locale}/${sport}/dojo`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950">
      {/* Message d'accueil Tanaka */}
      <TanakaWelcome
        sectionId="dojo-virtuel"
        sectionTitle={TANAKA_MESSAGES['dojo-virtuel'].title}
        message={TANAKA_MESSAGES['dojo-virtuel'].message}
        emoji={TANAKA_MESSAGES['dojo-virtuel'].emoji}
        variant="full"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-amber-900/90 to-orange-900/90 border-b border-amber-500/20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/${sport}/dojo`}>
              <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Swords className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white">Dojo Virtuel</span>
                <p className="text-xs text-amber-300">10 mini-jeux</p>
              </div>
            </div>
          </div>
          <Link href={`/${locale}/aikido/guide`}>
            <Button variant="ghost" size="sm" className="text-amber-300 hover:text-amber-200" data-testid="header-guide-link" title="Guide & Questions">
              <HelpCircle className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Guide</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Le VirtualDojo s'ouvre automatiquement - la fermeture redirige vers /dojo */}
      </main>

      {/* Virtual Dojo Dialog */}
      <VirtualDojo
        isOpen={dojoOpen}
        onClose={handleCloseDojo}
        userName={user.firstName}
        userLevel={user.gamification?.level || 0}
        userKi={user.gamification?.xp || 0}
        onGameComplete={handleGameComplete}
      />
    </div>
  );
}
