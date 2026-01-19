'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Swords, Users, Trophy, Globe, 
  ChevronRight, Sparkles, Shield, Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const t = useTranslations();

  const features = [
    {
      icon: Swords,
      title: 'Multi-Sports',
      description: 'Aikido, Judo, Karaté, Yoga et plus encore',
      color: 'amber',
    },
    {
      icon: Trophy,
      title: 'Gamification',
      description: 'XP, badges, défis et progression motivante',
      color: 'emerald',
    },
    {
      icon: Users,
      title: 'Gestion Club',
      description: 'CRM complet pour gérer votre dojo',
      color: 'cyan',
    },
    {
      icon: Globe,
      title: 'International',
      description: '30+ langues supportées',
      color: 'violet',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Swords className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">WayofDojo</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-slate-300 hover:text-white transition-colors">
              Fonctionnalités
            </Link>
            <Link href="#pricing" className="text-slate-300 hover:text-white transition-colors">
              Tarifs
            </Link>
            <Link href="#sports" className="text-slate-300 hover:text-white transition-colors">
              Sports
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/fr/aikido/login">
              <Button variant="ghost">{t('common.login')}</Button>
            </Link>
            <Link href="/fr/aikido/register">
              <Button variant="gradient">{t('common.register')}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Nouvelle plateforme internationale
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
              La Voie du Dojo
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10">
              Plateforme de gamification pour arts martiaux et sports à progression.
              <br />
              <span className="text-amber-400">Transformez votre pratique en aventure.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/fr/aikido/register">
                <Button size="xl" variant="gradient" className="gap-2">
                  Commencer gratuitement
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="xl" variant="outline" className="gap-2">
                  Découvrir
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {[
              { value: '10+', label: 'Sports supportés' },
              { value: '30+', label: 'Langues' },
              { value: '500+', label: 'Techniques' },
              { value: '∞', label: 'Possibilités' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-amber-400">{stat.value}</p>
                <p className="text-slate-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Une plateforme complète pour pratiquants, clubs et fédérations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:border-amber-500/50 transition-colors">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/20 flex items-center justify-center mb-4`}>
                      <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Profiles Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Deux profils, une aventure
            </h2>
            <p className="text-slate-400">
              {t('profiles.canChangeLater')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Jeune Ninja */}
            <Card className="overflow-hidden border-amber-500/30 hover:border-amber-500/50 transition-all group">
              <div className="h-48 bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                <Star className="w-24 h-24 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-amber-400">
                  {t('profiles.jeuneNinja')}
                </h3>
                <p className="text-slate-400 mb-4">
                  {t('profiles.jeuneNinjaDesc')}
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Interface ludique et colorée
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    Stickers et mini-jeux
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    Contrôle parental
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Ninja Confirmé */}
            <Card className="overflow-hidden border-cyan-500/30 hover:border-cyan-500/50 transition-all group">
              <div className="h-48 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                <Swords className="w-24 h-24 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-cyan-400">
                  {t('profiles.ninjaConfirme')}
                </h3>
                <p className="text-slate-400 mb-4">
                  {t('profiles.ninjaConfirmeDesc')}
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Interface sobre et professionnelle
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-cyan-400" />
                    Statistiques détaillées
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    Certifications officielles
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-amber-600/20 to-orange-600/20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à commencer votre voyage ?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de pratiquants qui transforment leur entraînement en aventure.
            7 jours d&apos;essai gratuit, sans engagement.
          </p>
          <Link href="/fr/aikido/register">
            <Button size="xl" variant="gradient" className="gap-2">
              Créer mon compte gratuit
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Swords className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">WayofDojo</span>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
              <Link href="#" className="hover:text-white">{t('footer.legalMentions')}</Link>
              <Link href="#" className="hover:text-white">{t('footer.cgu')}</Link>
              <Link href="#" className="hover:text-white">{t('footer.cgv')}</Link>
              <Link href="#" className="hover:text-white">{t('footer.privacy')}</Link>
              <Link href="#" className="hover:text-white">{t('footer.contact')}</Link>
            </nav>
            
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} WayofDojo
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
