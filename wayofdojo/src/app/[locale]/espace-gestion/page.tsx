'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function EspaceGestionPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const options = [
    {
      id: 'admin',
      title: 'Administration WayofDojo',
      description: 'Gérez la plateforme, les utilisateurs, les dojos et consultez les statistiques.',
      icon: Shield,
      color: 'from-violet-500 to-purple-600',
      href: `/${locale}/aikido/login?redirect=admin`,
      badge: 'Administrateurs',
      badgeColor: 'bg-violet-500/20 text-violet-300'
    },
    {
      id: 'club',
      title: 'Gestion de mon Club',
      description: 'Inscrivez votre club d\'Aïkido, gérez vos adhérents et suivez vos statistiques.',
      icon: Building2,
      color: 'from-amber-500 to-orange-600',
      href: `/${locale}/club-login`,
      badge: 'Clubs d\'Aïkido',
      badgeColor: 'bg-amber-500/20 text-amber-300'
    }
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/${locale}`)}
          className="text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au site
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Espace Gestion - TEST 2024
            </h1>
            <p className="text-slate-400 text-lg">
              Choisissez votre espace de gestion
            </p>
          </motion.div>

          {/* Options Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {options.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={option.href}>
                  <Card className="group bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-300 cursor-pointer overflow-hidden h-full">
                    <CardContent className="p-0">
                      {/* Icon Header */}
                      <div className={`bg-gradient-to-r ${option.color} p-8 flex justify-center`}>
                        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <option.icon className="w-10 h-10 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                            {option.title}
                          </h2>
                          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                        </div>
                        
                        <p className="text-slate-400 text-sm leading-relaxed">
                          {option.description}
                        </p>

                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${option.badgeColor}`}>
                          {option.badge}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-slate-500 text-sm mt-8"
          >
            Besoin d&apos;aide ? Contactez-nous à <span className="text-amber-500">contact@wayofdojo.fr</span>
          </motion.p>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-slate-600 text-sm">
          © 2024 WayofDojo - Tous droits réservés
        </p>
      </footer>
    </div>
  );
}
