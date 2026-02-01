'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Swords, ArrowLeft } from 'lucide-react';
import VirtualDojo from '@/components/VirtualDojo';
import { TanakaWelcome, TANAKA_MESSAGES } from '@/components/TanakaWelcome';

export default function DojoVirtuelPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const [user, setUser] = useState<{ firstName: string; gamification: { level: number; xp: number } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [dojoOpen, setDojoOpen] = useState(true);

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
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Info card when dialog is closed */}
        {!dojoOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-amber-500/30 text-center">
              <span className="text-6xl block mb-4">🏯</span>
              <h1 className="text-3xl font-bold text-white mb-4">Dojo Virtuel</h1>
              <p className="text-slate-300 mb-6">
                Entraîne-toi avec 10 mini-jeux éducatifs guidés par Maître Tanaka. 
                Développe ta concentration, ta respiration et les valeurs du Budo !
              </p>
              <Button 
                onClick={() => setDojoOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold px-8 py-3"
                data-testid="open-dojo-btn"
              >
                🎮 Ouvrir le Dojo Virtuel
              </Button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Virtual Dojo Dialog */}
      <VirtualDojo
        isOpen={dojoOpen}
        onClose={() => setDojoOpen(false)}
        userName={user.firstName}
        userLevel={user.gamification?.level || 0}
        userKi={user.gamification?.xp || 0}
        onGameComplete={handleGameComplete}
      />
    </div>
  );
}
