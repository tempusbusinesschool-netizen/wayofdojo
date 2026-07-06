'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Target, ChevronDown,
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
 * Utilise l'image de progression fournie par l'utilisateur (ceintures-progression.png)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const TABS = [
  { id: 'parcours', label: 'Mon parcours' },
  { id: 'kyu', label: 'Grades Kyu' },
  { id: 'dan', label: 'Grades Dan' },
  { id: 'comprendre', label: 'Comprendre les grades' },
];

// Mapping des grades vers les images de ceintures (fond #06101f intégré)
const BELT_IMAGES: Record<string, { image: string; name: string }> = {
  '6e_kyu': { image: '/images/belts/6e-kyu-white.png?v=5', name: 'blanche' },
  '5e_kyu': { image: '/images/belts/5e-kyu-yellow.png?v=5', name: 'jaune' },
  '4e_kyu': { image: '/images/belts/4e-kyu-orange.png?v=5', name: 'orange' },
  '3e_kyu': { image: '/images/belts/3e-kyu-green.png?v=5', name: 'verte' },
  '2e_kyu': { image: '/images/belts/2e-kyu-blue.png?v=5', name: 'bleue' },
  '1er_kyu': { image: '/images/belts/1er-kyu-brown.png?v=5', name: 'marron' },
  // Grades Dan
  'shodan': { image: '/images/belts/1er-dan-black.png?v=5', name: 'noire' },
  'nidan': { image: '/images/belts/1er-dan-black.png?v=5', name: 'noire' },
  'sandan': { image: '/images/belts/1er-dan-black.png?v=5', name: 'noire' },
  'yondan': { image: '/images/belts/1er-dan-black.png?v=5', name: 'noire' },
  // Fallback IDs
  '1er_dan': { image: '/images/belts/1er-dan-black.png?v=5', name: 'noire' },
  '2e_dan': { image: '/images/belts/1er-dan-black.png?v=5', name: 'noire' },
  '3e_dan': { image: '/images/belts/1er-dan-black.png?v=5', name: 'noire' },
  '4e_dan': { image: '/images/belts/1er-dan-black.png?v=5', name: 'noire' },
};

// Composant d'image de ceinture - fond intégré dans l'image
const BeltImage = ({ gradeId, isActive = false, size = 'md' }: { gradeId: string; isActive?: boolean; size?: 'sm' | 'md' | 'lg' }) => {
  // Debug: log gradeId
  console.log('BeltImage gradeId:', gradeId, 'found in BELT_IMAGES:', !!BELT_IMAGES[gradeId]);
  
  // Fallback vers la ceinture noire pour les grades Dan inconnus
  const defaultBelt = gradeId?.includes('dan') || gradeId === 'shodan' || gradeId === 'nidan' || gradeId === 'sandan' || gradeId === 'yondan'
    ? BELT_IMAGES['shodan'] 
    : BELT_IMAGES['6e_kyu'];
  const beltInfo = BELT_IMAGES[gradeId] || defaultBelt;
  
  const sizes = {
    sm: 64,
    md: 80,
    lg: 96
  };
  const imgSize = sizes[size];
  
  return (
    <div 
      className={`relative ${isActive ? 'ring-2 ring-orange-500 rounded-xl' : ''}`}
      style={{ width: imgSize, height: imgSize }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beltInfo.image}
        alt={`Ceinture ${beltInfo.name}`}
        width={imgSize}
        height={imgSize}
        className="object-contain rounded-xl"
      />
    </div>
  );
};

// Accordéon pour les grades avec détails complets
const GradeAccordion: React.FC<{
  grade: ProgrammeGrade;
  isExpanded: boolean;
  onToggle: () => void;
  isCurrent: boolean;
}> = ({ grade, isExpanded, onToggle, isCurrent }) => {
  return (
    <div className={`bg-[#06101f] rounded-xl border transition-all ${isCurrent ? 'border-orange-500/50' : 'border-slate-800'}`}>
      <button onClick={onToggle} className="w-full p-4 flex items-center gap-4 hover:bg-slate-800/20 transition-colors rounded-xl">
        <BeltImage gradeId={grade.id} isActive={isCurrent} size="md" />
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-bold text-amber-300">{grade.nom_japonais}</span>
            <span className="text-lg font-bold text-white">{grade.nom}</span>
            {isCurrent && <span className="text-[10px] px-2 py-0.5 bg-orange-500 text-white rounded font-bold">Grade actuel</span>}
          </div>
          <p className="text-sm text-slate-400">Ceinture {grade.ceinture} · {grade.niveau}</p>
          <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {grade.duree_minimale}</span>
            <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {grade.heures_minimales}h min</span>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 pt-2 border-t border-slate-800 space-y-6">
              {/* Description */}
              <p className="text-slate-300 text-sm">{grade.description}</p>
              
              {/* Stats */}
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

              {/* Objectifs */}
              {grade.objectifs && grade.objectifs.length > 0 && (
                <div>
                  <p className="text-xs text-amber-400 font-bold uppercase mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Objectifs
                  </p>
                  <ul className="space-y-1">
                    {grade.objectifs.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mouvements requis */}
              {grade.mouvements_requis && grade.mouvements_requis.length > 0 && (
                <div>
                  <p className="text-xs text-cyan-400 font-bold uppercase mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Mouvements requis
                  </p>
                  <div className="space-y-4">
                    {grade.mouvements_requis.map((categorie, idx) => (
                      <div key={idx} className="bg-slate-800/30 rounded-lg p-3">
                        <p className="text-sm font-semibold text-cyan-300 mb-2">{categorie.categorie}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {categorie.elements.map((elem, elemIdx) => (
                            <div key={elemIdx} className="flex items-start gap-2 text-sm">
                              <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${elem.obligatoire ? 'bg-orange-500' : 'bg-slate-600'}`}></span>
                              <div>
                                <span className="text-white font-medium">{elem.nom}</span>
                                {elem.description && (
                                  <span className="text-slate-400 text-xs block">{elem.description}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Techniques requises */}
              {grade.techniques_requises && grade.techniques_requises.length > 0 && (
                <div>
                  <p className="text-xs text-emerald-400 font-bold uppercase mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Techniques requises par attaque
                  </p>
                  <div className="space-y-4">
                    {grade.techniques_requises.map((attaque, idx) => (
                      <div key={idx} className="bg-slate-800/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-emerald-300">{attaque.attaque}</span>
                          {attaque.attaque_jp && (
                            <span className="text-xs text-amber-400 font-medium">{attaque.attaque_jp}</span>
                          )}
                        </div>
                        {attaque.description && (
                          <p className="text-xs text-slate-400 mb-2">{attaque.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {attaque.techniques.map((tech, techIdx) => (
                            <div 
                              key={techIdx} 
                              className={`px-2 py-1 rounded text-xs ${tech.obligatoire ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700/50 text-slate-400'}`}
                            >
                              {tech.nom}
                              {tech.description && (
                                <span className="text-[10px] text-slate-400 ml-1">({tech.description})</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Critères d'évaluation */}
              {grade.criteres_evaluation && grade.criteres_evaluation.length > 0 && (
                <div>
                  <p className="text-xs text-purple-400 font-bold uppercase mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Critères d&apos;évaluation
                  </p>
                  <ul className="space-y-1">
                    {grade.criteres_evaluation.map((critere, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0"></span>
                        {critere}
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
      <div className="hidden lg:block">
        <AdultSidebar locale={locale} sport={sport} onLogout={handleLogout} />
      </div>

      <AdultHeader locale={locale} sport={sport} userName="Bruno" notificationCount={3} showMenuButton={true} />

      <div className="lg:ml-[260px] pt-[60px]">
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Les ceintures</h1>
              <p className="text-slate-400 text-sm">Programme de progression en Aïkido</p>
            </div>
            <Link href={`/${locale}/${sport}/guide`}>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <HelpCircle className="w-4 h-4 mr-1" />Guide
              </Button>
            </Link>
          </div>

          {/* Onglets */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id ? 'bg-orange-500 text-white' : 'bg-transparent text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ONGLET MON PARCOURS */}
          {activeTab === 'parcours' && (
            <div className="space-y-6">
              {/* Cartes Grade actuel + Prochain + Tanaka */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* GRADE ACTUEL */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0d1628] rounded-2xl p-5 border border-orange-500/30">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">VOTRE GRADE ACTUEL</p>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-4xl font-bold text-amber-300">{currentGrade.nom_japonais}</span>
                        <span className="text-xl font-bold text-white">{currentGrade.nom}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-white">Ceinture {currentGrade.ceinture}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-700 text-orange-400 rounded font-bold border border-orange-500/30">Grade actuel</span>
                      </div>
                      <p className="text-amber-400 text-sm mb-1">{currentGrade.niveau} —</p>
                      <p className="text-slate-400 text-sm">{currentGrade.description.slice(0, 100)}.</p>
                      <div className="flex gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400"><Clock className="w-4 h-4" />{currentGrade.duree_minimale}</div>
                        <div className="flex items-center gap-2 text-sm text-slate-400"><Target className="w-4 h-4" />{currentGrade.heures_minimales}h minimum</div>
                      </div>
                    </div>
                    <BeltImage gradeId={currentUserGrade} isActive={true} size="lg" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <div className="flex justify-between text-xs text-slate-500 mb-1"><span>0 / 15 techniques maîtrisées</span><span>0%</span></div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full w-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div></div>
                  </div>
                </motion.div>

                {/* PROCHAIN GRADE */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0d1628] rounded-2xl p-5 border border-slate-800">
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
                        <div className="flex items-center gap-2 text-sm text-slate-400"><Clock className="w-4 h-4" />{nextGrade.duree_minimale}</div>
                        <div className="flex items-center gap-2 text-sm text-slate-400"><Target className="w-4 h-4" />{nextGrade.heures_minimales}h minimum</div>
                      </div>
                    </div>
                    <BeltImage gradeId={nextGrade.id} size="lg" />
                  </div>
                </motion.div>

                {/* MAÎTRE TANAKA */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0d1628] rounded-2xl p-5 border border-slate-800">
                  <h3 className="text-lg font-bold text-white mb-1">Maître Tanaka</h3>
                  <p className="text-orange-400 text-sm mb-4">Ton Sensei personnel</p>
                  <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border-l-2 border-orange-500">
                    <p className="text-slate-300 text-sm italic">&quot;Un grade n&apos;est pas une arrivée.<br />C&apos;est une étape qui vous invite à approfondir votre pratique.&quot;</p>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-xl overflow-hidden bg-slate-800 relative">
                      <Image src="/images/tanaka/portrait.png" alt="Maître Tanaka" fill className="object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white"><MessageCircle className="w-4 h-4 mr-2" />Parle-moi !</Button>
                </motion.div>
              </div>

              {/* MA PROGRESSION DE CEINTURE - Image exacte comme sur le dojo */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative rounded-2xl overflow-hidden">
                <Image 
                  src="/images/belts/ceintures-progression.png" 
                  alt="Ma progression de ceinture" 
                  width={1200} 
                  height={400} 
                  className="w-full h-auto rounded-2xl" 
                  priority 
                />
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative rounded-2xl overflow-hidden h-40">
                  <Image src="/images/ceintures/castle-sunset.png" alt="Château japonais" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-4xl font-bold text-white">6</p>
                    <p className="text-lg font-bold text-white">Grades Kyu</p>
                    <p className="text-slate-300 text-sm">Du débutant au pratiquant avancé</p>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="relative rounded-2xl overflow-hidden h-40">
                  <Image src="/images/ceintures/fuji-sunset.png" alt="Mont Fuji au coucher de soleil" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-4xl font-bold text-white">4+</p>
                    <p className="text-lg font-bold text-white">Grades Dan</p>
                    <p className="text-slate-300 text-sm">Les grades de ceinture noire</p>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="relative rounded-2xl overflow-hidden h-40">
                  <Image src="/images/ceintures/street-sunset.png" alt="Rue japonaise traditionnelle" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-4xl font-bold text-white">3+ <span className="text-xl">ans</span></p>
                    <p className="text-lg font-bold text-white">Pour le grade de Shodan</p>
                    <p className="text-slate-300 text-sm">Temps indicatif moyen</p>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* ONGLET GRADES KYU */}
          {activeTab === 'kyu' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <p className="text-slate-400 text-sm mb-4">Du 6e Kyu (débutant) au 1er Kyu (avancé)</p>
              {gradesKyu.map((grade) => (
                <GradeAccordion key={grade.id} grade={grade} isExpanded={expandedGrade === grade.id} onToggle={() => setExpandedGrade(expandedGrade === grade.id ? null : grade.id)} isCurrent={grade.id === currentUserGrade} />
              ))}
            </motion.div>
          )}

          {/* ONGLET GRADES DAN */}
          {activeTab === 'dan' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <p className="text-slate-400 text-sm mb-4">Les grades de ceinture noire représentent la maîtrise technique et l&apos;engagement dans la voie.</p>
              {gradesDan.map((grade) => (
                <GradeAccordion key={grade.id} grade={grade} isExpanded={expandedGrade === grade.id} onToggle={() => setExpandedGrade(expandedGrade === grade.id ? null : grade.id)} isCurrent={false} />
              ))}
            </motion.div>
          )}

          {/* ONGLET COMPRENDRE */}
          {activeTab === 'comprendre' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="bg-[#0d1628] rounded-xl p-5 border border-slate-800">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5 text-amber-400" />Le système de grades en Aïkido</h3>
                <p className="text-slate-300 text-sm leading-relaxed">L&apos;Aïkido utilise un système de grades composé des Kyu (grades de couleur) et des Dan (grades de ceinture noire). Ce système permet de mesurer la progression technique et l&apos;engagement du pratiquant.</p>
              </div>
              <div className="bg-[#0d1628] rounded-xl p-5 border border-slate-800">
                <h3 className="font-bold text-white mb-3">Les grades Kyu</h3>
                <p className="text-slate-300 text-sm">Du 6e Kyu au 1er Kyu, ces grades accompagnent le pratiquant de ses débuts jusqu&apos;à un niveau avancé.</p>
              </div>
              <div className="bg-[#0d1628] rounded-xl p-5 border border-slate-800">
                <h3 className="font-bold text-white mb-3">Les grades Dan</h3>
                <p className="text-slate-300 text-sm">À partir du 1er Dan (Shodan), le pratiquant porte la ceinture noire.</p>
              </div>
              <div className="bg-[#0d1628] rounded-xl p-5 border border-slate-800">
                <h3 className="font-bold text-white mb-3">Les durées indicatives</h3>
                <p className="text-slate-300 text-sm">Les durées mentionnées sont des minimums indicatifs. La progression dépend de l&apos;assiduité et de l&apos;enseignant.</p>
              </div>
              <p className="text-xs text-slate-500 text-center mt-6 italic">Les durées et contenus peuvent varier selon les dojos et enseignants.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
