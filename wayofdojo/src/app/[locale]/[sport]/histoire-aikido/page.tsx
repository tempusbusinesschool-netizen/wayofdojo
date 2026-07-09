'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, User, BookOpen, Star } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdultSidebar } from '@/components/adult-layout/AdultSidebar';
import { AdultHeader } from '@/components/adult-layout/AdultHeader';
import { JuniorHistoirePage } from '@/components/junior-pages';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Histoire de l'Aïkido - Page dédiée à l'histoire et aux origines
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: '1883',
    title: 'Naissance de Morihei Ueshiba',
    description: 'Morihei Ueshiba, futur fondateur de l\'Aïkido, naît le 14 décembre à Tanabe, dans la préfecture de Wakayama au Japon. Enfant chétif, il se tournera vers les arts martiaux pour se renforcer.',
    icon: <User className="w-5 h-5" />,
  },
  {
    year: '1903-1915',
    title: 'Formation martiale intensive',
    description: 'Ueshiba étudie plusieurs arts martiaux traditionnels : le Judo Kito-ryu, le Jujutsu Daito-ryu sous Sokaku Takeda, le Kenjutsu (sabre), et le Sojutsu (lance). Ces disciplines formeront la base technique de l\'Aïkido.',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    year: '1919',
    title: 'Rencontre avec Onisaburo Deguchi',
    description: 'Cette rencontre spirituelle avec le leader de la religion Omoto-kyo transforme profondément Ueshiba. Il intègre une dimension spirituelle à sa pratique martiale, cherchant l\'harmonie plutôt que la destruction.',
    icon: <Star className="w-5 h-5" />,
  },
  {
    year: '1927',
    title: 'Installation à Tokyo',
    description: 'Ueshiba s\'installe à Tokyo et commence à enseigner son art, alors appelé "Aiki-Budo". Son dojo attire de nombreux élèves, dont des militaires et des aristocrates.',
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    year: '1942',
    title: 'Naissance officielle de l\'Aïkido',
    description: 'Le nom "Aïkido" (合気道 - La Voie de l\'Harmonie des Énergies) est officiellement adopté. Ce nom reflète la philosophie de non-violence et d\'harmonie développée par Ueshiba.',
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    year: '1948',
    title: 'Création de l\'Aïkikaï',
    description: 'L\'Aïkikaï Foundation est créée à Tokyo, devenant l\'organisation mondiale de référence pour l\'Aïkido. Le Hombu Dojo devient le centre mondial de l\'enseignement.',
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    year: '1969',
    title: 'Décès d\'O-Sensei',
    description: 'Morihei Ueshiba décède le 26 avril à l\'âge de 85 ans. Son fils Kisshomaru puis son petit-fils Moriteru lui succèdent à la tête de l\'Aïkikaï. Son héritage continue de se répandre dans le monde entier.',
    icon: <Star className="w-5 h-5" />,
  },
];

const principles = [
  {
    japanese: '合',
    romaji: 'Ai',
    meaning: 'Harmonie, Union',
    description: 'Représente l\'idée de fusion, d\'unification avec l\'énergie de l\'adversaire plutôt que de s\'y opposer.',
  },
  {
    japanese: '気',
    romaji: 'Ki',
    meaning: 'Énergie, Souffle vital',
    description: 'L\'énergie universelle qui anime toute chose. En Aïkido, on apprend à développer et harmoniser son Ki.',
  },
  {
    japanese: '道',
    romaji: 'Do',
    meaning: 'La Voie, Le Chemin',
    description: 'Plus qu\'une technique, l\'Aïkido est un chemin de développement personnel qui dure toute la vie.',
  },
];

export default function HistoireAikidoPage() {
  const params = useParams();
  const locale = params.locale as string;
  const sport = params.sport as string;

  // Détection du profil utilisateur
  const [userProfile, setUserProfile] = useState<'jeune_samourai' | 'samourai_confirme' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('wayofdojo_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserProfile(user.profile || 'samourai_confirme');
        } catch {
          setUserProfile('samourai_confirme');
        }
      } else {
        setUserProfile('samourai_confirme');
      }
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('wayofdojo_token');
    localStorage.removeItem('wayofdojo_user');
    window.location.href = `/${locale}`;
  };

  // Si profil enfant, afficher la version enfant
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#06101f] flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }
  
  if (userProfile === 'jeune_samourai') {
    return <JuniorHistoirePage />;
  }

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
              Histoire de l'<span className="text-orange-400">Aïkido</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              De la tradition martiale japonaise à un art de paix universel
            </p>
          </motion.div>

          {/* Citation O-Sensei */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl p-8 text-center"
          >
            <p className="text-2xl text-white italic font-light mb-4">
              « L'Aïkido n'est pas une technique pour combattre et vaincre un ennemi. 
              C'est une voie pour réconcilier le monde et faire de l'humanité une seule famille. »
            </p>
            <p className="text-orange-400 font-semibold">— Morihei Ueshiba, O-Sensei (Grand Maître)</p>
          </motion.div>

          {/* Signification du nom */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-orange-400">合気道</span>
              <span>— La signification du nom</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {principles.map((p, index) => (
                <motion.div
                  key={p.romaji}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-[#0a1628] border border-white/10 rounded-2xl p-6 text-center hover:border-orange-500/30 transition-colors"
                >
                  <div className="text-6xl font-bold text-orange-400 mb-2">{p.japanese}</div>
                  <div className="text-white font-semibold text-lg mb-1">{p.romaji}</div>
                  <div className="text-amber-400 text-sm mb-3">{p.meaning}</div>
                  <p className="text-slate-400 text-sm">{p.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Timeline */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Chronologie historique</h2>
            
            <div className="relative">
              {/* Ligne verticale */}
              <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-amber-500 to-orange-500/20" />
              
              <div className="space-y-8">
                {timelineEvents.map((event, index) => (
                  <motion.div
                    key={event.year}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="relative flex gap-6"
                  >
                    {/* Point sur la timeline */}
                    <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center text-orange-400 shrink-0 z-10">
                      {event.icon}
                    </div>
                    
                    {/* Contenu */}
                    <div className="flex-1 bg-[#0a1628] border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-colors">
                      <div className="text-orange-400 font-bold text-lg mb-1">{event.year}</div>
                      <h3 className="text-white font-semibold text-xl mb-2">{event.title}</h3>
                      <p className="text-slate-400">{event.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Section finale */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-[#0a1628] border border-white/10 rounded-2xl p-8 text-center space-y-4"
          >
            <h2 className="text-2xl font-bold text-white">L'Aïkido aujourd'hui</h2>
            <p className="text-slate-400 max-w-3xl mx-auto">
              Aujourd'hui, l'Aïkido est pratiqué par des millions de personnes dans plus de 140 pays. 
              Bien que différentes écoles et styles aient émergé, tous partagent les principes fondamentaux 
              légués par O-Sensei : la recherche de l'harmonie, le respect de l'autre, et le développement 
              personnel à travers la pratique martiale.
            </p>
            <div className="flex justify-center gap-6 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">140+</div>
                <div className="text-slate-500 text-sm">Pays</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">1.5M+</div>
                <div className="text-slate-500 text-sm">Pratiquants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">80+</div>
                <div className="text-slate-500 text-sm">Années d'histoire</div>
              </div>
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
}
