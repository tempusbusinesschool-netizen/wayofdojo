/**
 * 🥋 IKKYO ANIMATION - Animation vectorielle SVG/CSS
 * 
 * Démonstration de la technique Ikkyo (一教) - Première immobilisation
 * Animation fluide montrant les 3 phases :
 * 1. Entrée (Irimi) - Esquive et contact
 * 2. Contrôle (Osae) - Guidage vers le sol
 * 3. Immobilisation (Osae Waza) - Position finale
 * 
 * ⚠️ Cette animation est un aide-mémoire visuel.
 * L'apprentissage réel se fait au dojo avec un enseignant qualifié.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Couleurs des personnages
const COLORS = {
  tori: '#10b981', // Vert emerald - celui qui fait la technique
  uke: '#f59e0b',  // Orange amber - celui qui reçoit
  tatami: '#1e293b',
  accent: '#06b6d4'
};

/**
 * Composant Personnage SVG animé
 */
const AnimatedFigure = ({ 
  color, 
  position, 
  rotation = 0, 
  armAngle = 0, 
  legSpread = 0,
  bent = false,
  lying = false,
  scale = 1,
  label
}) => {
  const baseX = position.x;
  const baseY = position.y;
  
  return (
    <motion.g
      initial={false}
      animate={{
        x: baseX,
        y: baseY,
        rotate: rotation,
        scale: scale
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Corps */}
      {lying ? (
        // Position allongée (Uke immobilisé)
        <>
          {/* Torse horizontal */}
          <motion.ellipse
            cx="0"
            cy="0"
            rx="25"
            ry="12"
            fill={color}
            opacity="0.9"
            animate={{ rx: 25, ry: 12 }}
            transition={{ duration: 0.5 }}
          />
          {/* Tête */}
          <motion.circle
            cx="-30"
            cy="0"
            r="10"
            fill={color}
            animate={{ cx: -30 }}
            transition={{ duration: 0.5 }}
          />
          {/* Bras étendu (contrôlé) */}
          <motion.line
            x1="20"
            y1="0"
            x2="55"
            y2="-10"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Jambes */}
          <motion.line x1="15" y1="8" x2="40" y2="15" stroke={color} strokeWidth="5" strokeLinecap="round" />
          <motion.line x1="15" y1="-8" x2="40" y2="-15" stroke={color} strokeWidth="5" strokeLinecap="round" />
        </>
      ) : (
        // Position debout/penchée
        <>
          {/* Tête */}
          <motion.circle
            cx="0"
            cy={bent ? -35 : -50}
            r="12"
            fill={color}
            animate={{ cy: bent ? -35 : -50 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Torse */}
          <motion.line
            x1="0"
            y1={bent ? -25 : -38}
            x2="0"
            y2={bent ? 5 : 0}
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            animate={{ 
              y1: bent ? -25 : -38,
              y2: bent ? 5 : 0
            }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Bras gauche */}
          <motion.line
            x1="0"
            y1={bent ? -20 : -30}
            x2={-20 + armAngle * 0.3}
            y2={bent ? -5 + armAngle * 0.2 : -15 + armAngle * 0.3}
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            animate={{
              x2: -20 + armAngle * 0.3,
              y2: bent ? -5 + armAngle * 0.2 : -15 + armAngle * 0.3
            }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Bras droit */}
          <motion.line
            x1="0"
            y1={bent ? -20 : -30}
            x2={20 - armAngle * 0.3}
            y2={bent ? -5 + armAngle * 0.2 : -15 + armAngle * 0.3}
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            animate={{
              x2: 20 - armAngle * 0.3,
              y2: bent ? -5 + armAngle * 0.2 : -15 + armAngle * 0.3
            }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Jambe gauche */}
          <motion.line
            x1="0"
            y1={bent ? 5 : 0}
            x2={-12 - legSpread}
            y2="35"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            animate={{ x2: -12 - legSpread }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Jambe droite */}
          <motion.line
            x1="0"
            y1={bent ? 5 : 0}
            x2={12 + legSpread}
            y2="35"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            animate={{ x2: 12 + legSpread }}
            transition={{ duration: 0.5 }}
          />
        </>
      )}
      
      {/* Label */}
      {label && (
        <text
          x="0"
          y={lying ? 30 : 55}
          textAnchor="middle"
          fill={color}
          fontSize="12"
          fontWeight="bold"
        >
          {label}
        </text>
      )}
    </motion.g>
  );
};

/**
 * Flèche de direction animée
 */
const DirectionArrow = ({ from, to, color = COLORS.accent, label }) => (
  <g>
    <motion.line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={color}
      strokeWidth="2"
      strokeDasharray="5,5"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.7 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    />
    <motion.polygon
      points={`${to.x},${to.y} ${to.x - 8},${to.y - 4} ${to.x - 8},${to.y + 4}`}
      fill={color}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      transform={`rotate(${Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI}, ${to.x}, ${to.y})`}
    />
    {label && (
      <motion.text
        x={(from.x + to.x) / 2}
        y={(from.y + to.y) / 2 - 10}
        fill={color}
        fontSize="10"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {label}
      </motion.text>
    )}
  </g>
);

/**
 * Cercle de mouvement (représente le cercle de l'Aïkido)
 */
const MovementCircle = ({ cx, cy, r, show }) => (
  <motion.circle
    cx={cx}
    cy={cy}
    r={r}
    fill="none"
    stroke={COLORS.accent}
    strokeWidth="1.5"
    strokeDasharray="4,4"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: show ? 0.4 : 0, 
      scale: show ? 1 : 0,
      rotate: 360
    }}
    transition={{ 
      opacity: { duration: 0.3 },
      scale: { duration: 0.3 },
      rotate: { duration: 8, repeat: Infinity, ease: "linear" }
    }}
  />
);

/**
 * Définition des phases de Ikkyo
 */
const IKKYO_PHASES = [
  {
    id: 1,
    name: "Position initiale",
    japanese: "Kamae",
    description: "Tori et Uke face à face en garde (Ai Hanmi)",
    tip: "Garde naturelle, centre stable, regard vers le partenaire",
    tori: { x: 120, y: 180, rotation: 0, armAngle: 0, legSpread: 5, bent: false },
    uke: { x: 280, y: 180, rotation: 180, armAngle: 0, legSpread: 5, bent: false },
    showCircle: false,
    arrows: []
  },
  {
    id: 2,
    name: "Attaque Shomen",
    japanese: "Shomen Uchi",
    description: "Uke attaque avec une frappe verticale à la tête",
    tip: "Uke lève le bras pour frapper, Tori se prépare à entrer",
    tori: { x: 130, y: 180, rotation: 0, armAngle: 20, legSpread: 8, bent: false },
    uke: { x: 270, y: 175, rotation: 180, armAngle: -40, legSpread: 5, bent: false },
    showCircle: false,
    arrows: [{ from: { x: 270, y: 130 }, to: { x: 200, y: 150 }, label: "Shomen" }]
  },
  {
    id: 3,
    name: "Entrée Irimi",
    japanese: "Irimi",
    description: "Tori entre sur le côté, évite l'attaque et contacte le bras",
    tip: "Entrer à 45°, jamais face à l'attaque. Contact au coude de Uke.",
    tori: { x: 200, y: 170, rotation: -30, armAngle: 30, legSpread: 12, bent: false },
    uke: { x: 250, y: 175, rotation: 160, armAngle: -20, legSpread: 8, bent: false },
    showCircle: true,
    arrows: [{ from: { x: 140, y: 180 }, to: { x: 190, y: 165 }, label: "Irimi" }]
  },
  {
    id: 4,
    name: "Contrôle du coude",
    japanese: "Hiji Osae",
    description: "Tori contrôle le coude et guide Uke vers le bas",
    tip: "Main sur le coude, l'autre sur le poignet. Mouvement en spirale.",
    tori: { x: 210, y: 165, rotation: -45, armAngle: 40, legSpread: 15, bent: true },
    uke: { x: 240, y: 185, rotation: 140, armAngle: 10, legSpread: 10, bent: true },
    showCircle: true,
    arrows: [{ from: { x: 240, y: 160 }, to: { x: 230, y: 200 }, label: "Osae" }]
  },
  {
    id: 5,
    name: "Guidage au sol",
    japanese: "Undo",
    description: "Tori continue le mouvement circulaire vers le sol",
    tip: "Garde le coude de Uke plié, guide en cercle vers le tatami.",
    tori: { x: 200, y: 160, rotation: -60, armAngle: 50, legSpread: 18, bent: true },
    uke: { x: 250, y: 200, rotation: 100, armAngle: 20, legSpread: 5, bent: true, scale: 0.9 },
    showCircle: true,
    arrows: []
  },
  {
    id: 6,
    name: "Immobilisation",
    japanese: "Osae Waza",
    description: "Uke est face au sol, bras étendu et contrôlé par Tori",
    tip: "Genou près de l'aisselle de Uke, contrôle poignet et coude.",
    tori: { x: 180, y: 170, rotation: -30, armAngle: 30, legSpread: 20, bent: true },
    uke: { x: 240, y: 220, rotation: 0, lying: true },
    showCircle: false,
    arrows: []
  }
];

/**
 * Composant principal - Animation Ikkyo
 */
const IkkyoAnimation = ({ autoPlay = false, showControls = true, size = 'lg' }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showInfo, setShowInfo] = useState(true);
  
  const phase = IKKYO_PHASES[currentPhase];
  
  // Dimensions selon la taille
  const dimensions = {
    sm: { width: 300, height: 250 },
    md: { width: 400, height: 320 },
    lg: { width: 500, height: 380 }
  };
  const { width, height } = dimensions[size] || dimensions.lg;
  
  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setTimeout(() => {
      setCurrentPhase(prev => (prev + 1) % IKKYO_PHASES.length);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [isPlaying, currentPhase]);
  
  const handlePrevious = () => {
    setIsPlaying(false);
    setCurrentPhase(prev => (prev - 1 + IKKYO_PHASES.length) % IKKYO_PHASES.length);
  };
  
  const handleNext = () => {
    setIsPlaying(false);
    setCurrentPhase(prev => (prev + 1) % IKKYO_PHASES.length);
  };
  
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentPhase(0);
  };
  
  return (
    <div className="flex flex-col items-center gap-4" data-testid="ikkyo-animation">
      {/* Titre */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <span className="text-2xl">一教</span>
          <span>Ikkyo</span>
        </h3>
        <p className="text-sm text-slate-400">Première immobilisation</p>
      </div>
      
      {/* Zone SVG */}
      <div 
        className="relative bg-slate-900/50 rounded-2xl border border-slate-700 overflow-hidden"
        style={{ width, height }}
      >
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          width={width} 
          height={height}
          className="select-none"
        >
          {/* Fond tatami */}
          <rect x="0" y="0" width={width} height={height} fill={COLORS.tatami} />
          
          {/* Lignes du tatami */}
          <g opacity="0.1">
            {[...Array(10)].map((_, i) => (
              <line 
                key={`h${i}`} 
                x1="0" 
                y1={i * (height / 10)} 
                x2={width} 
                y2={i * (height / 10)} 
                stroke="#fff" 
                strokeWidth="1"
              />
            ))}
            {[...Array(12)].map((_, i) => (
              <line 
                key={`v${i}`} 
                x1={i * (width / 12)} 
                y1="0" 
                x2={i * (width / 12)} 
                y2={height} 
                stroke="#fff" 
                strokeWidth="1"
              />
            ))}
          </g>
          
          {/* Cercle de mouvement */}
          <MovementCircle cx={220} cy={180} r={60} show={phase.showCircle} />
          
          {/* Flèches directionnelles */}
          {phase.arrows?.map((arrow, i) => (
            <DirectionArrow key={i} {...arrow} />
          ))}
          
          {/* Personnages */}
          <AnimatedFigure 
            color={COLORS.tori}
            position={phase.tori}
            rotation={phase.tori.rotation}
            armAngle={phase.tori.armAngle}
            legSpread={phase.tori.legSpread}
            bent={phase.tori.bent}
            label="Tori"
          />
          
          <AnimatedFigure 
            color={COLORS.uke}
            position={phase.uke}
            rotation={phase.uke.rotation}
            armAngle={phase.uke.armAngle}
            legSpread={phase.uke.legSpread}
            bent={phase.uke.bent}
            lying={phase.uke.lying}
            scale={phase.uke.scale || 1}
            label="Uke"
          />
          
          {/* Légende couleurs */}
          <g transform={`translate(${width - 80}, 20)`}>
            <circle cx="0" cy="0" r="6" fill={COLORS.tori} />
            <text x="12" y="4" fill="#fff" fontSize="10">Tori</text>
            <circle cx="0" cy="20" r="6" fill={COLORS.uke} />
            <text x="12" y="24" fill="#fff" fontSize="10">Uke</text>
          </g>
          
          {/* Indicateur de phase */}
          <g transform={`translate(20, ${height - 30})`}>
            {IKKYO_PHASES.map((_, i) => (
              <motion.circle
                key={i}
                cx={i * 18}
                cy="0"
                r="5"
                fill={i === currentPhase ? COLORS.accent : '#475569'}
                animate={{ scale: i === currentPhase ? 1.2 : 1 }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </g>
        </svg>
        
        {/* Badge phase */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
            {phase.id}/{IKKYO_PHASES.length} - {phase.name}
          </Badge>
        </div>
      </div>
      
      {/* Info phase */}
      <AnimatePresence mode="wait">
        {showInfo && (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center max-w-md"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-lg font-bold text-white">{phase.name}</span>
              <span className="text-slate-400">({phase.japanese})</span>
            </div>
            <p className="text-sm text-slate-300 mb-2">{phase.description}</p>
            <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2 text-left">
              <Info className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-emerald-300">{phase.tip}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Contrôles */}
      {showControls && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            className="border-slate-600 hover:bg-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`border-slate-600 ${isPlaying ? 'bg-cyan-500/20 border-cyan-500/50' : 'hover:bg-slate-700'}`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="border-slate-600 hover:bg-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            className="border-slate-600 hover:bg-slate-700"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInfo(!showInfo)}
            className={showInfo ? 'text-cyan-400' : 'text-slate-400'}
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default IkkyoAnimation;
