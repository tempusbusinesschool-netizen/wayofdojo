'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Brain, Users, Shield, Zap, Wind, Target, Smile } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdultSidebar } from '@/components/adult-layout/AdultSidebar';
import { AdultHeader } from '@/components/adult-layout/AdultHeader';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Bienfaits de l'Aïkido - Physiques et Psychologiques
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
}

const physicalBenefits: Benefit[] = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Condition physique globale',
    description: 'L\'Aïkido sollicite l\'ensemble du corps de manière harmonieuse.',
    details: [
      'Renforcement musculaire profond (gainage, posture)',
      'Amélioration de l\'endurance cardiovasculaire',
      'Développement de la force fonctionnelle',
      'Travail complet sans impact traumatisant pour les articulations',
    ],
  },
  {
    icon: <Wind className="w-6 h-6" />,
    title: 'Souplesse et mobilité',
    description: 'Les mouvements circulaires développent une souplesse naturelle.',
    details: [
      'Assouplissement des hanches et du bassin',
      'Mobilité articulaire accrue (épaules, poignets)',
      'Étirements dynamiques intégrés à la pratique',
      'Prévention des raideurs liées à la sédentarité',
    ],
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Coordination et équilibre',
    description: 'Chaque technique nécessite une synchronisation corps-esprit.',
    details: [
      'Amélioration de la proprioception',
      'Renforcement de l\'équilibre statique et dynamique',
      'Coordination des mouvements complexes',
      'Développement des réflexes et de la réactivité',
    ],
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Chutes et protection du corps',
    description: 'Apprendre à chuter protège dans la vie quotidienne.',
    details: [
      'Techniques de chute (ukemi) applicables partout',
      'Réduction du risque de blessure en cas de chute accidentelle',
      'Confiance dans le mouvement et la prise de risque mesurée',
      'Particulièrement bénéfique pour les personnes âgées',
    ],
  },
];

const psychologicalBenefits: Benefit[] = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'Gestion du stress',
    description: 'La pratique régulière apaise le mental et régule les émotions.',
    details: [
      'Respiration consciente et apaisante',
      'Évacuation des tensions accumulées',
      'État méditatif pendant la pratique',
      'Meilleure gestion des situations de pression au quotidien',
    ],
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Confiance en soi',
    description: 'Progresser en Aïkido renforce l\'estime personnelle.',
    details: [
      'Sentiment de compétence face aux défis',
      'Assurance dans les interactions sociales',
      'Capacité à rester calme face à l\'agressivité',
      'Affirmation de soi sans agressivité',
    ],
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Relations interpersonnelles',
    description: 'L\'Aïkido enseigne le respect et la coopération.',
    details: [
      'Pratique avec des partenaires de tous niveaux',
      'Développement de l\'empathie et de l\'écoute',
      'Apprentissage du respect mutuel',
      'Création de liens sociaux forts au sein du dojo',
    ],
  },
  {
    icon: <Smile className="w-6 h-6" />,
    title: 'Développement personnel',
    description: 'Un chemin de croissance qui dure toute la vie.',
    details: [
      'Philosophie de non-violence applicable au quotidien',
      'Patience et persévérance face aux difficultés',
      'Humilité et acceptation de ses limites',
      'Recherche constante d\'amélioration (Kaizen)',
    ],
  },
];

const testimonials = [
  {
    quote: "L'Aïkido m'a appris à transformer un conflit en opportunité de connexion.",
    author: "Marie, 45 ans, 3e Dan",
  },
  {
    quote: "Depuis que je pratique, je dors mieux et je gère beaucoup mieux la pression au travail.",
    author: "Thomas, 32 ans, 2e Kyu",
  },
  {
    quote: "À 60 ans, l'Aïkido m'a redonné confiance en mon corps et en mes capacités.",
    author: "Jean-Pierre, 60 ans, 1er Kyu",
  },
];

export default function BienfaitsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const handleLogout = () => {
    localStorage.removeItem('wayofdojo_token');
    localStorage.removeItem('wayofdojo_user');
    window.location.href = `/${locale}`;
  };

  return (
    <div className="min-h-screen bg-[#06101f]">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <AdultSidebar 
          locale={locale}
          sport={sport}
          onLogout={handleLogout}
        />
      </div>

      {/* Header */}
      <AdultHeader
        locale={locale}
        sport={sport}
        userName=""
        showMenuButton={true}
      />

      {/* Contenu principal */}
      <div className="lg:ml-[260px] pt-[60px]">
        <div className="max-w-5xl mx-auto p-6 space-y-10">
          
          {/* Retour */}
          <Link 
            href={`/${locale}/${sport}/dojo`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Dojo
          </Link>

          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Les bienfaits de l'<span className="text-orange-400">Aïkido</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Un art martial complet pour le corps et l'esprit
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl p-8 text-center"
          >
            <p className="text-lg text-slate-300 leading-relaxed">
              L'Aïkido est bien plus qu'un simple sport ou une méthode de self-défense. 
              C'est une <strong className="text-orange-400">discipline holistique</strong> qui développe 
              simultanément les capacités physiques, mentales et relationnelles. 
              Accessible à tous les âges et toutes les conditions physiques, 
              l'Aïkido offre des bénéfices durables pour la santé et le bien-être.
            </p>
          </motion.div>

          {/* Bienfaits Physiques */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Bienfaits physiques</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {physicalBenefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-[#0a1628] border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                      {benefit.icon}
                    </div>
                    <h3 className="text-white font-bold text-lg">{benefit.title}</h3>
                  </div>
                  <p className="text-slate-400 mb-4">{benefit.description}</p>
                  <ul className="space-y-2">
                    {benefit.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
                        <span className="text-green-400 mt-1">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Bienfaits Psychologiques */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Bienfaits psychologiques</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {psychologicalBenefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-[#0a1628] border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                      {benefit.icon}
                    </div>
                    <h3 className="text-white font-bold text-lg">{benefit.title}</h3>
                  </div>
                  <p className="text-slate-400 mb-4">{benefit.description}</p>
                  <ul className="space-y-2">
                    {benefit.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
                        <span className="text-purple-400 mt-1">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Témoignages */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white text-center">Ce qu'en disent les pratiquants</h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="bg-[#0a1628] border border-white/10 rounded-2xl p-6 text-center"
                >
                  <p className="text-white italic mb-4">« {testimonial.quote} »</p>
                  <p className="text-orange-400 text-sm font-medium">{testimonial.author}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Call to action */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
            className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-2xl p-8 text-center space-y-4"
          >
            <h2 className="text-2xl font-bold text-white">Prêt à découvrir ces bienfaits ?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              La meilleure façon de comprendre les bienfaits de l'Aïkido est de les expérimenter soi-même. 
              Chaque cours est une opportunité de progresser, tant sur le plan technique que personnel.
            </p>
            <Link 
              href={`/${locale}/${sport}/techniques`}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Explorer les techniques
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
