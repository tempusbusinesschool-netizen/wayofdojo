'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Target, ChevronDown, ChevronRight,
  BookOpen, HelpCircle, CheckCircle2, MessageCircle
} from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AdultSidebar } from '@/components/adult-layout/AdultSidebar';
import { AdultHeader } from '@/components/adult-layout/AdultHeader';
import { getGradesKyu, getGradesDan, type ProgrammeGrade } from '@/data/aikido/grades/passages-de-grades';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PAGE CEINTURES — REFONTE UX/UI MODE ADULTE
 * Design exact selon le visuel de référence fourni
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Configuration des onglets internes
const TABS = [
  { id: 'parcours', label: 'Mon parcours' },
  { id: 'kyu', label: 'Grades Kyu' },
  { id: 'dan', label: 'Grades Dan' },
  { id: 'comprendre', label: 'Comprendre les grades' },
];

// Mapping des images de ceintures
const BELT_IMAGES: Record<string, string> = {
  '6e_kyu': '/images/belts/white-6kyu.png',
  '5e_kyu': '/images/belts/yellow-5kyu.png',
  '4e_kyu': '/images/belts/orange-4kyu.png',
  '3e_kyu': '/images/belts/green-3kyu.png',
  '2e_kyu': '/images/belts/blue-2kyu.png',
  '1er_kyu': '/images/belts/brown-1kyu.png',
  '1er_dan': '/images/belts/black-dan.png',
  '2e_dan': '/images/belts/black-dan.png',
  '3e_dan': '/images/belts/black-dan.png',
  '4e_dan': '/images/belts/black-dan.png',
};

// Composant Accordéon de Grade
const GradeAccordion: React.FC<{
  grade: ProgrammeGrade;
  isExpanded: boolean;
  onToggle: () => void;
  isCurrent: boolean;
}> = ({ grade, isExpanded, onToggle, isCurrent }) => {
  const beltImage = BELT_IMAGES[grade.id] || '/images/belts/black-dan.png';
  
  return (
    <div className={`bg-[#0d1628] rounded-xl border transition-all ${
      isCurrent ? 'border-orange-500/50' : 'border-slate-800'
    }`}>
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-4 hover:bg-slate-800/30 transition-colors rounded-xl"
      >
        {/* Image de ceinture */}
        <div className="w-14 h-14 relative shrink-0">
          <Image
            src={beltImage}
            alt={`Ceinture ${grade.ceinture}`}
            fill
            className="object-contain"
          />
        </div>

        {/* Kanji + Info */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-bold text-amber-300">{grade.nom_japonais}</span>
            <span className="text-lg font-bold text-white">{grade.nom}</span>
            {isCurrent && (
              <span className="text-[10px] px-2 py-0.5 bg-orange-500 text-white rounded font-bold">
                Grade actuel
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400">Ceinture {grade.ceinture} · {grade.niveau}</p>
          <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {grade.duree_minimale}
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" /> {grade.heures_minimales}h min
            </span>
          </div>
        </div>

        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-slate-800 space-y-4">
              <p className="text-slate-300 text-sm">{grade.description}</p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Durée indicative</p>
                  <p className="text-white font-medium">{grade.duree_minimale}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Volume minimal</p>
                  <p className="text-white font-medium">{grade.heures_minimales}h</p>
                </div>
              </div>

              {grade.objectifs && grade.objectifs.length > 0 && (
                <div>
                  <p className="text-xs text-amber-400 font-bold uppercase mb-2">Objectifs</p>
                  <ul className="space-y-1">
                    {grade.objectifs.slice(0, 4).map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function CeinturesPage() {
  const params = useParams();
  const locale = params.locale as string || 'fr';
  const sport = params.sport as string || 'aikido';

  const [activeTab, setActiveTab] = useState<string>('parcours');
  const [expandedGrade, setExpandedGrade] = useState<string | null>(null);

  const gradesKyu = getGradesKyu();
  const gradesDan = getGradesDan();
  const allGrades = [...gradesKyu, ...gradesDan];

  // Grade actuel simulé
  const currentUserGrade = '6e_kyu';
  const currentGrade = gradesKyu.find(g => g.id === currentUserGrade) || gradesKyu[0];
  const currentGradeIndex = gradesKyu.findIndex(g => g.id === currentUserGrade);
  const nextGrade = currentGradeIndex < gradesKyu.length - 1 ? gradesKyu[currentGradeIndex + 1] : gradesDan[0];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wayofdojo_token');
      window.location.href = `/${locale}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#06101f]">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <AdultSidebar locale={locale} sport={sport} onLogout={handleLogout} />
      </div>

      {/* Header */}
      <AdultHeader
        locale={locale}
        sport={sport}
        userName="Bruno"
        notificationCount={3}
        showMenuButton={true}
      />

      {/* Contenu principal */}
      <div className="lg:ml-[260px] pt-[60px]">
        <div className="p-4 lg:p-6">

          {/* ═══════════════════════════════════════════════════════════════
              HEADER DE PAGE + ONGLETS
              ═══════════════════════════════════════════════════════════════ */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Les ceintures</h1>
              <p className="text-slate-400 text-sm">Programme de progression en Aïkido</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/${locale}/${sport}/guide`}>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <HelpCircle className="w-4 h-4 mr-1" />
                  Guide
                </Button>
              </Link>
            </div>
          </div>

          {/* Onglets */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-transparent text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              ONGLET MON PARCOURS
              ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'parcours' && (
            <div className="space-y-6">
              {/* Cartes Grade actuel + Prochain grade + Tanaka */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* VOTRE GRADE ACTUEL */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0d1628] rounded-2xl p-5 border border-orange-500/30 relative overflow-hidden"
                >
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">VOTRE GRADE ACTUEL</p>
                  
                  <div className="flex items-start gap-4">
                    {/* Kanji + Nom */}
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-4xl font-bold text-amber-300">{currentGrade.nom_japonais}</span>
                        <span className="text-xl font-bold text-white">{currentGrade.nom}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-white">Ceinture {currentGrade.ceinture}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-700 text-orange-400 rounded font-bold border border-orange-500/30">
                          Grade actuel
                        </span>
                      </div>
                      <p className="text-amber-400 text-sm mb-1">{currentGrade.niveau} —</p>
                      <p className="text-slate-400 text-sm">{currentGrade.description.slice(0, 100)}.</p>
                      
                      {/* Durées */}
                      <div className="flex gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>{currentGrade.duree_minimale}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Target className="w-4 h-4" />
                          <span>{currentGrade.heures_minimales}h minimum</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Image ceinture */}
                    <div className="w-28 h-28 relative shrink-0">
                      <Image
                        src={BELT_IMAGES[currentGrade.id]}
                        alt={`Ceinture ${currentGrade.ceinture}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>0 / 15 techniques maîtrisées</span>
                      <span>0%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full w-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                    </div>
                  </div>
                </motion.div>

                {/* PROCHAIN GRADE */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#0d1628] rounded-2xl p-5 border border-slate-800"
                >
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">PROCHAIN GRADE</p>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-bold text-amber-200">{nextGrade.nom_japonais}</span>
                        <span className="text-lg font-bold text-white">{nextGrade.nom}</span>
                      </div>
                      <p className="text-white mb-3">Ceinture {nextGrade.ceinture}</p>
                      <p className="text-amber-400/70 text-sm mb-1">{nextGrade.niveau} —</p>
                      <p className="text-slate-400 text-sm">{nextGrade.description.slice(0, 80)}.</p>
                      
                      <div className="flex gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>{nextGrade.duree_minimale}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Target className="w-4 h-4" />
                          <span>{nextGrade.heures_minimales}h minimum</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-24 h-24 relative shrink-0">
                      <Image
                        src={BELT_IMAGES[nextGrade.id]}
                        alt={`Ceinture ${nextGrade.ceinture}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* MAÎTRE TANAKA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#0d1628] rounded-2xl p-5 border border-slate-800 relative overflow-hidden"
                >
                  <h3 className="text-lg font-bold text-white mb-1">Maître Tanaka</h3>
                  <p className="text-orange-400 text-sm mb-4">Ton Sensei personnel</p>
                  
                  <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border-l-2 border-orange-500">
                    <p className="text-slate-300 text-sm italic">
                      &quot;Un grade n&apos;est pas une arrivée.
                      <br />
                      C&apos;est une étape qui vous invite à approfondir votre pratique.&quot;
                    </p>
                  </div>

                  {/* Image Tanaka */}
                  <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-xl overflow-hidden bg-slate-800 relative">
                      <Image
                        src="/images/tanaka/portrait.png"
                        alt="Maître Tanaka"
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Parle-moi !
                  </Button>
                </motion.div>
              </div>

              {/* ═══════════════════════════════════════════════════════════════
                  VOTRE CHEMIN EN AÏKIDO (Timeline)
                  ═══════════════════════════════════════════════════════════════ */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#0d1628] rounded-2xl p-5 border border-slate-800"
              >
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">VOTRE CHEMIN EN AÏKIDO</p>
                
                <div className="flex items-center gap-1 overflow-x-auto pb-2">
                  {allGrades.map((grade, index) => {
                    const isActive = grade.id === currentUserGrade;
                    const isPast = index < currentGradeIndex;
                    const isFuture = index > currentGradeIndex;
                    
                    return (
                      <React.Fragment key={grade.id}>
                        <div className="flex flex-col items-center shrink-0">
                          <div className={`relative w-14 h-14 ${isFuture ? 'opacity-40' : ''}`}>
                            {isActive && (
                              <div className="absolute -inset-1 bg-orange-500/30 rounded-full blur-md"></div>
                            )}
                            <Image
                              src={BELT_IMAGES[grade.id] || '/images/belts/black-dan.png'}
                              alt={grade.nom}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${
                            isActive ? 'text-orange-400' : 
                            isPast ? 'text-emerald-400' : 
                            'text-slate-500'
                          }`}>
                            {grade.nom}
                          </span>
                        </div>
                        
                        {index < allGrades.length - 1 && (
                          <ChevronRight className={`w-4 h-4 shrink-0 mx-1 ${
                            isPast ? 'text-emerald-500' : 
                            isActive ? 'text-orange-500' : 'text-slate-700'
                          }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </motion.div>

              {/* ═══════════════════════════════════════════════════════════════
                  STATS (avec fonds japonais)
                  ═══════════════════════════════════════════════════════════════ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative rounded-2xl overflow-hidden h-40"
                >
                  <Image
                    src="/images/backgrounds/japanese-sunset-dojo.jpg"
                    alt=""
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-4xl font-bold text-white">6</p>
                    <p className="text-lg font-bold text-white">Grades Kyu</p>
                    <p className="text-slate-300 text-sm">Du débutant au pratiquant avancé</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="relative rounded-2xl overflow-hidden h-40"
                >
                  <Image
                    src="/images/backgrounds/japanese-sunset-dojo.jpg"
                    alt=""
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-4xl font-bold text-white">4+</p>
                    <p className="text-lg font-bold text-white">Grades Dan</p>
                    <p className="text-slate-300 text-sm">Les grades de ceinture noire</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative rounded-2xl overflow-hidden h-40"
                >
                  <Image
                    src="/images/backgrounds/japanese-sunset-dojo.jpg"
                    alt=""
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-4xl font-bold text-white">3+ <span className="text-xl">ans</span></p>
                    <p className="text-lg font-bold text-white">Pour le grade de Shodan</p>
                    <p className="text-slate-300 text-sm">Temps indicatif moyen de pratique</p>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              ONGLET GRADES KYU
              ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'kyu' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <p className="text-slate-400 text-sm mb-4">Du 6e Kyu (débutant) au 1er Kyu (avancé)</p>
              {gradesKyu.map((grade) => (
                <GradeAccordion
                  key={grade.id}
                  grade={grade}
                  isExpanded={expandedGrade === grade.id}
                  onToggle={() => setExpandedGrade(expandedGrade === grade.id ? null : grade.id)}
                  isCurrent={grade.id === currentUserGrade}
                />
              ))}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              ONGLET GRADES DAN
              ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'dan' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <p className="text-slate-400 text-sm mb-4">Les grades de ceinture noire représentent la maîtrise technique et l&apos;engagement dans la voie.</p>
              {gradesDan.map((grade) => (
                <GradeAccordion
                  key={grade.id}
                  grade={grade}
                  isExpanded={expandedGrade === grade.id}
                  onToggle={() => setExpandedGrade(expandedGrade === grade.id ? null : grade.id)}
                  isCurrent={false}
                />
              ))}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              ONGLET COMPRENDRE LES GRADES
              ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'comprendre' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="bg-[#0d1628] rounded-xl p-5 border border-slate-800">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  Le système de grades en Aïkido
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  L&apos;Aïkido utilise un système de grades composé des Kyu (grades de couleur) et des Dan (grades de ceinture noire). 
                  Ce système permet de mesurer la progression technique et l&apos;engagement du pratiquant.
                </p>
              </div>

              <div className="bg-[#0d1628] rounded-xl p-5 border border-slate-800">
                <h3 className="font-bold text-white mb-3">Les grades Kyu</h3>
                <p className="text-slate-300 text-sm">
                  Du 6e Kyu au 1er Kyu, ces grades accompagnent le pratiquant de ses débuts jusqu&apos;à un niveau avancé. 
                  Chaque passage requiert un temps minimum de pratique et la démonstration de techniques spécifiques.
                </p>
              </div>

              <div className="bg-[#0d1628] rounded-xl p-5 border border-slate-800">
                <h3 className="font-bold text-white mb-3">Les grades Dan</h3>
                <p className="text-slate-300 text-sm">
                  À partir du 1er Dan (Shodan), le pratiquant porte la ceinture noire. 
                  Ces grades représentent non seulement la maîtrise technique mais aussi l&apos;engagement dans la voie martiale.
                </p>
              </div>

              <div className="bg-[#0d1628] rounded-xl p-5 border border-slate-800">
                <h3 className="font-bold text-white mb-3">Les durées indicatives</h3>
                <p className="text-slate-300 text-sm">
                  Les durées mentionnées sont des minimums indicatifs. La progression réelle dépend de l&apos;assiduité, 
                  de l&apos;engagement et des critères spécifiques de chaque dojo et enseignant.
                </p>
              </div>

              <p className="text-xs text-slate-500 text-center mt-6 italic">
                Les durées et contenus peuvent varier selon les dojos et enseignants.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
