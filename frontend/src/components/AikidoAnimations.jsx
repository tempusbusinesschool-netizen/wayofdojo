// Aikido Technique Animations - Professional Silhouette Style
// Black & White animated SVGs for each technique category

import React from 'react';

// Base animation wrapper with consistent styling
const AnimationWrapper = ({ children, size = 120, bgColor = "#f8fafc" }) => (
  <div 
    className="relative rounded-xl overflow-hidden flex items-center justify-center"
    style={{ width: size, height: size, backgroundColor: bgColor }}
  >
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// IKKYO - First Control (Arm pin)
// ═══════════════════════════════════════════════════════════════
export const IkkyoAnimation = ({ size = 120 }) => (
  <AnimationWrapper size={size}>
    <svg viewBox="0 0 100 100" width={size * 0.9} height={size * 0.9}>
      <defs>
        <filter id="shadow-ikkyo" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Background circle */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
      
      {/* TORI (black) - Controlling figure */}
      <g filter="url(#shadow-ikkyo)">
        {/* Head */}
        <circle cx="35" cy="25" r="8" fill="#1f2937">
          <animate attributeName="cy" values="25;23;25" dur="2s" repeatCount="indefinite"/>
        </circle>
        {/* Body */}
        <path d="M35 33 L35 55" stroke="#1f2937" strokeWidth="4" strokeLinecap="round">
          <animate attributeName="d" values="M35 33 L35 55;M35 31 L35 53;M35 33 L35 55" dur="2s" repeatCount="indefinite"/>
        </path>
        {/* Left arm - controlling */}
        <path d="M35 40 L22 50" stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M35 40 L22 50;M35 38 L20 48;M35 40 L22 50" dur="2s" repeatCount="indefinite"/>
        </path>
        {/* Right arm - pressing down on uke */}
        <path d="M35 40 L55 38" stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M35 40 L55 38;M35 38 L58 42;M35 40 L55 38" dur="2s" repeatCount="indefinite"/>
        </path>
        {/* Legs */}
        <path d="M35 55 L28 75" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M35 55 L42 75" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
      </g>
      
      {/* UKE (gray) - Being controlled, going down */}
      <g filter="url(#shadow-ikkyo)">
        {/* Head */}
        <circle cx="62" cy="45" r="7" fill="#64748b">
          <animate attributeName="cy" values="45;52;45" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="cx" values="62;65;62" dur="2s" repeatCount="indefinite"/>
        </circle>
        {/* Body - bending forward */}
        <path d="M62 52 L68 70" stroke="#64748b" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M62 52 L68 70;M65 59 L72 75;M62 52 L68 70" dur="2s" repeatCount="indefinite"/>
        </path>
        {/* Arms - being controlled */}
        <path d="M62 55 L55 45" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="d" values="M62 55 L55 45;M65 60 L58 48;M62 55 L55 45" dur="2s" repeatCount="indefinite"/>
        </path>
        {/* Legs */}
        <path d="M68 70 L60 85" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="d" values="M68 70 L60 85;M72 75 L65 88;M68 70 L60 85" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M68 70 L78 82" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="d" values="M68 70 L78 82;M72 75 L82 85;M68 70 L78 82" dur="2s" repeatCount="indefinite"/>
        </path>
      </g>
      
      {/* Control direction indicator */}
      <path d="M55 42 Q62 55 68 65" stroke="#1f2937" strokeWidth="1" fill="none" strokeDasharray="3,2" opacity="0.4">
        <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite"/>
      </path>
    </svg>
  </AnimationWrapper>
);

// ═══════════════════════════════════════════════════════════════
// NIKYO - Second Control (Wrist lock)
// ═══════════════════════════════════════════════════════════════
export const NikyoAnimation = ({ size = 120 }) => (
  <AnimationWrapper size={size}>
    <svg viewBox="0 0 100 100" width={size * 0.9} height={size * 0.9}>
      <defs>
        <filter id="shadow-nikyo" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
      
      {/* TORI */}
      <g filter="url(#shadow-nikyo)">
        <circle cx="38" cy="28" r="8" fill="#1f2937"/>
        <path d="M38 36 L38 58" stroke="#1f2937" strokeWidth="4" strokeLinecap="round"/>
        <path d="M38 43 L25 52" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        {/* Hands applying nikyo */}
        <path d="M38 43 L52 40" stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M38 43 L52 40;M38 43 L54 42;M38 43 L52 40" dur="1.5s" repeatCount="indefinite"/>
        </path>
        <path d="M38 58 L30 78" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M38 58 L46 78" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
      </g>
      
      {/* UKE - reacting to wrist pain */}
      <g filter="url(#shadow-nikyo)">
        <circle cx="60" cy="48" r="7" fill="#64748b">
          <animate attributeName="cy" values="48;52;48" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <path d="M60 55 L58 72" stroke="#64748b" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M60 55 L58 72;M60 59 L56 75;M60 55 L58 72" dur="1.5s" repeatCount="indefinite"/>
        </path>
        {/* Arm being locked */}
        <path d="M60 52 L52 42" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M58 72 L50 85" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M58 72 L68 82" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      
      {/* Wrist lock indicator - rotating */}
      <ellipse cx="52" cy="41" rx="6" ry="4" fill="none" stroke="#1f2937" strokeWidth="1.5" opacity="0.6">
        <animate attributeName="rx" values="6;8;6" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="ry" values="4;5;4" dur="1.5s" repeatCount="indefinite"/>
        <animateTransform attributeName="transform" type="rotate" values="0 52 41;15 52 41;0 52 41" dur="1.5s" repeatCount="indefinite"/>
      </ellipse>
      
      {/* Pain indicator */}
      <g opacity="0.5">
        <path d="M65 45 L68 42" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round">
          <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite"/>
        </path>
        <path d="M67 48 L71 47" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round">
          <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="0.2s"/>
        </path>
      </g>
    </svg>
  </AnimationWrapper>
);

// ═══════════════════════════════════════════════════════════════
// SANKYO - Third Control (Wrist twist outward)
// ═══════════════════════════════════════════════════════════════
export const SankyoAnimation = ({ size = 120 }) => (
  <AnimationWrapper size={size}>
    <svg viewBox="0 0 100 100" width={size * 0.9} height={size * 0.9}>
      <defs>
        <filter id="shadow-sankyo" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
      
      {/* Spiral motion indicator */}
      <path d="M50 25 Q70 35 65 50 Q60 65 45 60 Q30 55 38 42" fill="none" stroke="#1f2937" strokeWidth="1" opacity="0.3">
        <animate attributeName="stroke-dasharray" values="0,150;150,0" dur="3s" repeatCount="indefinite"/>
      </path>
      
      {/* TORI */}
      <g filter="url(#shadow-sankyo)">
        <circle cx="40" cy="30" r="8" fill="#1f2937">
          <animateTransform attributeName="transform" type="rotate" values="0 50 50;-5 50 50;0 50 50" dur="2s" repeatCount="indefinite"/>
        </circle>
        <path d="M40 38 L40 58" stroke="#1f2937" strokeWidth="4" strokeLinecap="round"/>
        <path d="M40 45 L28 54" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        {/* Arm twisting */}
        <path d="M40 45 L55 42" stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" values="0 40 45;-10 40 45;0 40 45" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M40 58 L32 78" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M40 58 L48 78" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
      </g>
      
      {/* UKE - twisting down */}
      <g filter="url(#shadow-sankyo)">
        <circle cx="60" cy="50" r="7" fill="#64748b">
          <animate attributeName="cx" values="60;62;60" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="cy" values="50;55;50" dur="2s" repeatCount="indefinite"/>
        </circle>
        <path d="M60 57 L62 75" stroke="#64748b" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M60 57 L62 75;M62 62 L65 78;M60 57 L62 75" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M60 52 L55 44" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M62 75 L55 88" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M62 75 L72 85" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
    </svg>
  </AnimationWrapper>
);

// ═══════════════════════════════════════════════════════════════
// SHIHONAGE - Four Direction Throw
// ═══════════════════════════════════════════════════════════════
export const ShihonageAnimation = ({ size = 120 }) => (
  <AnimationWrapper size={size}>
    <svg viewBox="0 0 100 100" width={size * 0.9} height={size * 0.9}>
      <defs>
        <filter id="shadow-shiho" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
      
      {/* Four direction arrows */}
      <g opacity="0.3">
        <path d="M50 10 L50 20" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="50,5 45,15 55,15" fill="#1f2937"/>
        <path d="M50 80 L50 90" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="50,95 45,85 55,85" fill="#1f2937"/>
        <path d="M10 50 L20 50" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="5,50 15,45 15,55" fill="#1f2937"/>
        <path d="M80 50 L90 50" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="95,50 85,45 85,55" fill="#1f2937"/>
      </g>
      
      {/* TORI - raising arm */}
      <g filter="url(#shadow-shiho)">
        <circle cx="42" cy="38" r="8" fill="#1f2937">
          <animate attributeName="cy" values="38;35;38" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <path d="M42 46 L42 62" stroke="#1f2937" strokeWidth="4" strokeLinecap="round"/>
        <path d="M42 50 L30 58" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        {/* Arm going up - shihonage motion */}
        <path d="M42 50 L55 35" stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M42 50 L55 35;M42 48 L58 28;M42 50 L55 35" dur="2.5s" repeatCount="indefinite"/>
        </path>
        <path d="M42 62 L35 80" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M42 62 L50 80" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
      </g>
      
      {/* UKE - being thrown backwards */}
      <g filter="url(#shadow-shiho)">
        <circle cx="60" cy="45" r="7" fill="#64748b">
          <animate attributeName="cx" values="60;65;60" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="cy" values="45;55;45" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        {/* Body rotating backwards */}
        <path d="M60 52 L68 68" stroke="#64748b" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M60 52 L68 68;M65 62 L75 75;M60 52 L68 68" dur="2.5s" repeatCount="indefinite"/>
        </path>
        {/* Arm being controlled */}
        <path d="M60 48 L55 38" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="d" values="M60 48 L55 38;M65 55 L58 32;M60 48 L55 38" dur="2.5s" repeatCount="indefinite"/>
        </path>
        <path d="M68 68 L62 82" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M68 68 L78 78" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      
      {/* Throw trajectory arc */}
      <path d="M55 35 Q70 40 75 60" stroke="#1f2937" strokeWidth="1" fill="none" strokeDasharray="4,3" opacity="0.4">
        <animate attributeName="stroke-dashoffset" from="14" to="0" dur="1s" repeatCount="indefinite"/>
      </path>
    </svg>
  </AnimationWrapper>
);

// ═══════════════════════════════════════════════════════════════
// IRIMINAGE - Entering Throw
// ═══════════════════════════════════════════════════════════════
export const IriminageAnimation = ({ size = 120 }) => (
  <AnimationWrapper size={size}>
    <svg viewBox="0 0 100 100" width={size * 0.9} height={size * 0.9}>
      <defs>
        <filter id="shadow-irimi" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
      
      {/* Entry arrow */}
      <path d="M20 70 Q35 50 50 40" stroke="#1f2937" strokeWidth="1.5" fill="none" strokeDasharray="4,3" opacity="0.4">
        <animate attributeName="stroke-dashoffset" from="14" to="0" dur="0.8s" repeatCount="indefinite"/>
      </path>
      <polygon points="52,38 45,42 48,48" fill="#1f2937" opacity="0.4"/>
      
      {/* TORI - entering behind */}
      <g filter="url(#shadow-irimi)">
        <circle cx="45" cy="40" r="8" fill="#1f2937">
          <animate attributeName="cx" values="45;48;45" dur="2s" repeatCount="indefinite"/>
        </circle>
        <path d="M45 48 L45 65" stroke="#1f2937" strokeWidth="4" strokeLinecap="round"/>
        {/* Arm wrapping around uke's neck */}
        <path d="M45 52 L58 42" stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M45 52 L58 42;M48 52 L62 40;M45 52 L58 42" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M45 52 L32 58" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M45 65 L38 82" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M45 65 L52 82" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
      </g>
      
      {/* UKE - falling backwards */}
      <g filter="url(#shadow-irimi)">
        <circle cx="62" cy="38" r="7" fill="#64748b">
          <animate attributeName="cy" values="38;48;38" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="cx" values="62;68;62" dur="2s" repeatCount="indefinite"/>
        </circle>
        <path d="M62 45 L70 65" stroke="#64748b" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M62 45 L70 65;M68 55 L78 72;M62 45 L70 65" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M62 42 L72 35" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M70 65 L65 80" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M70 65 L80 75" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
    </svg>
  </AnimationWrapper>
);

// ═══════════════════════════════════════════════════════════════
// KOTEGAESHI - Wrist Turn
// ═══════════════════════════════════════════════════════════════
export const KotegaeshiAnimation = ({ size = 120 }) => (
  <AnimationWrapper size={size}>
    <svg viewBox="0 0 100 100" width={size * 0.9} height={size * 0.9}>
      <defs>
        <filter id="shadow-kote" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
      
      {/* Wrist turn rotation indicator */}
      <path d="M48 42 Q58 38 62 48 Q58 58 48 54" fill="none" stroke="#1f2937" strokeWidth="1.5" opacity="0.4">
        <animateTransform attributeName="transform" type="rotate" values="0 55 48;-30 55 48;0 55 48" dur="1.5s" repeatCount="indefinite"/>
      </path>
      
      {/* TORI */}
      <g filter="url(#shadow-kote)">
        <circle cx="35" cy="35" r="8" fill="#1f2937"/>
        <path d="M35 43 L35 60" stroke="#1f2937" strokeWidth="4" strokeLinecap="round"/>
        <path d="M35 48 L22 55" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        {/* Both hands on uke's wrist - turning */}
        <path d="M35 48 L50 45" stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M35 48 L50 45;M35 48 L52 48;M35 48 L50 45" dur="1.5s" repeatCount="indefinite"/>
        </path>
        <path d="M35 60 L28 78" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M35 60 L42 78" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
      </g>
      
      {/* UKE - flipping from wrist turn */}
      <g filter="url(#shadow-kote)">
        <circle cx="62" cy="50" r="7" fill="#64748b">
          <animate attributeName="cy" values="50;60;50" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="cx" values="62;68;62" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        {/* Body rotating/flipping */}
        <path d="M62 57 L72 72" stroke="#64748b" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M62 57 L72 72;M68 67 L78 80;M62 57 L72 72" dur="1.5s" repeatCount="indefinite"/>
        </path>
        {/* Arm being turned */}
        <path d="M62 52 L52 46" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="d" values="M62 52 L52 46;M68 60 L54 50;M62 52 L52 46" dur="1.5s" repeatCount="indefinite"/>
        </path>
        <path d="M72 72 L68 88" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M72 72 L82 82" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
    </svg>
  </AnimationWrapper>
);

// ═══════════════════════════════════════════════════════════════
// KOSHINAGE - Hip Throw
// ═══════════════════════════════════════════════════════════════
export const KoshinageAnimation = ({ size = 120 }) => (
  <AnimationWrapper size={size}>
    <svg viewBox="0 0 100 100" width={size * 0.9} height={size * 0.9}>
      <defs>
        <filter id="shadow-koshi" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
      
      {/* TORI - bending for hip throw */}
      <g filter="url(#shadow-koshi)">
        <circle cx="42" cy="40" r="8" fill="#1f2937">
          <animate attributeName="cy" values="40;38;40" dur="2s" repeatCount="indefinite"/>
        </circle>
        {/* Body bending */}
        <path d="M42 48 L42 62" stroke="#1f2937" strokeWidth="4" strokeLinecap="round">
          <animate attributeName="d" values="M42 48 L42 62;M42 46 L44 60;M42 48 L42 62" dur="2s" repeatCount="indefinite"/>
        </path>
        {/* Arms - loading uke */}
        <path d="M42 52 L55 48" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M42 52 L30 55" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M42 62 L35 80" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M42 62 L50 80" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
      </g>
      
      {/* UKE - going over hip */}
      <g filter="url(#shadow-koshi)">
        <circle cx="55" cy="42" r="7" fill="#64748b">
          <animate attributeName="cx" values="55;62;55" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="cy" values="42;35;42" dur="2s" repeatCount="indefinite"/>
        </circle>
        {/* Body arcing over */}
        <path d="M55 49 L48 55" stroke="#64748b" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M55 49 L48 55;M62 42 L55 50;M55 49 L48 55" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M55 45 L65 42" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M48 55 L42 70" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M48 55 L58 68" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      
      {/* Arc trajectory */}
      <path d="M55 38 Q70 30 75 50" stroke="#64748b" strokeWidth="1" fill="none" strokeDasharray="3,2" opacity="0.3">
        <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite"/>
      </path>
    </svg>
  </AnimationWrapper>
);

// ═══════════════════════════════════════════════════════════════
// KOKYUNAGE - Breath Throw
// ═══════════════════════════════════════════════════════════════
export const KokyunageAnimation = ({ size = 120 }) => (
  <AnimationWrapper size={size}>
    <svg viewBox="0 0 100 100" width={size * 0.9} height={size * 0.9}>
      <defs>
        <filter id="shadow-kokyu" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
      
      {/* Ki/breath flow indicator */}
      <path d="M30 50 Q50 35 70 50" fill="none" stroke="#1f2937" strokeWidth="1" opacity="0.3">
        <animate attributeName="d" values="M30 50 Q50 35 70 50;M30 50 Q50 30 70 50;M30 50 Q50 35 70 50" dur="2s" repeatCount="indefinite"/>
      </path>
      <path d="M35 55 Q50 45 65 55" fill="none" stroke="#1f2937" strokeWidth="1" opacity="0.2">
        <animate attributeName="d" values="M35 55 Q50 45 65 55;M35 55 Q50 40 65 55;M35 55 Q50 45 65 55" dur="2s" repeatCount="indefinite" begin="0.3s"/>
      </path>
      
      {/* TORI - extending */}
      <g filter="url(#shadow-kokyu)">
        <circle cx="38" cy="40" r="8" fill="#1f2937"/>
        <path d="M38 48 L38 65" stroke="#1f2937" strokeWidth="4" strokeLinecap="round"/>
        {/* Arms extending forward */}
        <path d="M38 52 L55 45" stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M38 52 L55 45;M38 52 L58 42;M38 52 L55 45" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M38 52 L25 55" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M38 65 L30 82" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M38 65 L46 82" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
      </g>
      
      {/* UKE - being thrown by kokyu */}
      <g filter="url(#shadow-kokyu)">
        <circle cx="62" cy="45" r="7" fill="#64748b">
          <animate attributeName="cx" values="62;68;62" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="cy" values="45;52;45" dur="2s" repeatCount="indefinite"/>
        </circle>
        <path d="M62 52 L70 70" stroke="#64748b" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M62 52 L70 70;M68 59 L78 75;M62 52 L70 70" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M62 48 L55 42" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M70 70 L65 85" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M70 70 L80 80" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
    </svg>
  </AnimationWrapper>
);

// ═══════════════════════════════════════════════════════════════
// TENCHINAGE - Heaven & Earth Throw
// ═══════════════════════════════════════════════════════════════
export const TenchinageAnimation = ({ size = 120 }) => (
  <AnimationWrapper size={size}>
    <svg viewBox="0 0 100 100" width={size * 0.9} height={size * 0.9}>
      <defs>
        <filter id="shadow-tenchi" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
      
      {/* Heaven arrow - up */}
      <g>
        <path d="M30 35 L30 18" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="d" values="M30 35 L30 18;M30 32 L30 12;M30 35 L30 18" dur="2s" repeatCount="indefinite"/>
        </path>
        <polygon points="30,12 25,22 35,22" fill="#1f2937">
          <animate attributeName="points" values="30,12 25,22 35,22;30,8 25,18 35,18;30,12 25,22 35,22" dur="2s" repeatCount="indefinite"/>
        </polygon>
        <text x="22" y="10" fontSize="6" fill="#1f2937" opacity="0.5">天</text>
      </g>
      
      {/* Earth arrow - down */}
      <g>
        <path d="M70 65 L70 82" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="d" values="M70 65 L70 82;M70 68 L70 88;M70 65 L70 82" dur="2s" repeatCount="indefinite"/>
        </path>
        <polygon points="70,88 65,78 75,78" fill="#1f2937">
          <animate attributeName="points" values="70,88 65,78 75,78;70,92 65,82 75,82;70,88 65,78 75,78" dur="2s" repeatCount="indefinite"/>
        </polygon>
        <text x="75" y="92" fontSize="6" fill="#1f2937" opacity="0.5">地</text>
      </g>
      
      {/* TORI - center, arms splitting */}
      <g filter="url(#shadow-tenchi)">
        <circle cx="50" cy="45" r="8" fill="#1f2937"/>
        <path d="M50 53 L50 70" stroke="#1f2937" strokeWidth="4" strokeLinecap="round"/>
        {/* Heaven arm - up */}
        <path d="M50 50 L35 35" stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M50 50 L35 35;M50 50 L32 30;M50 50 L35 35" dur="2s" repeatCount="indefinite"/>
        </path>
        {/* Earth arm - down */}
        <path d="M50 55 L65 65" stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M50 55 L65 65;M50 55 L68 70;M50 55 L65 65" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M50 70 L42 85" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M50 70 L58 85" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
      </g>
      
      {/* UKE silhouette - falling */}
      <g filter="url(#shadow-tenchi)" opacity="0.6">
        <circle cx="58" cy="52" r="5" fill="#64748b">
          <animate attributeName="cy" values="52;58;52" dur="2s" repeatCount="indefinite"/>
        </circle>
        <path d="M58 57 L62 72" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
      </g>
    </svg>
  </AnimationWrapper>
);

// ═══════════════════════════════════════════════════════════════
// KAITENNAGE - Rotary Throw
// ═══════════════════════════════════════════════════════════════
export const KaitennageAnimation = ({ size = 120 }) => (
  <AnimationWrapper size={size}>
    <svg viewBox="0 0 100 100" width={size * 0.9} height={size * 0.9}>
      <defs>
        <filter id="shadow-kaiten" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
      
      {/* Rotation arc */}
      <path d="M35 30 A25 25 0 0 1 70 45" fill="none" stroke="#1f2937" strokeWidth="1.5" opacity="0.3">
        <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="3s" repeatCount="indefinite"/>
      </path>
      
      {/* TORI - pivoting */}
      <g filter="url(#shadow-kaiten)">
        <circle cx="40" cy="42" r="8" fill="#1f2937">
          <animateTransform attributeName="transform" type="rotate" values="0 50 50;-15 50 50;0 50 50" dur="2s" repeatCount="indefinite"/>
        </circle>
        <path d="M40 50 L40 65" stroke="#1f2937" strokeWidth="4" strokeLinecap="round"/>
        {/* Arm guiding rotation */}
        <path d="M40 52 L58 42" stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" values="0 40 52;-20 40 52;0 40 52" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M40 52 L28 58" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M40 65 L32 82" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M40 65 L48 82" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
      </g>
      
      {/* UKE - spinning/rotating */}
      <g filter="url(#shadow-kaiten)">
        <circle cx="62" cy="40" r="7" fill="#64748b">
          <animate attributeName="cx" values="62;58;62" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="cy" values="40;55;40" dur="2s" repeatCount="indefinite"/>
        </circle>
        <path d="M62 47 L60 65" stroke="#64748b" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M62 47 L60 65;M58 62 L55 78;M62 47 L60 65" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M62 43 L72 38" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M60 65 L52 78" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M60 65 L70 75" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
    </svg>
  </AnimationWrapper>
);

// ═══════════════════════════════════════════════════════════════
// SUWARIWAZA - Kneeling Technique
// ═══════════════════════════════════════════════════════════════
export const SuwariwazaAnimation = ({ size = 120 }) => (
  <AnimationWrapper size={size}>
    <svg viewBox="0 0 100 100" width={size * 0.9} height={size * 0.9}>
      <defs>
        <filter id="shadow-suwari" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
      
      {/* Ground line */}
      <line x1="15" y1="75" x2="85" y2="75" stroke="#cbd5e1" strokeWidth="1"/>
      
      {/* TORI - in seiza/kneeling */}
      <g filter="url(#shadow-suwari)">
        <circle cx="35" cy="50" r="8" fill="#1f2937">
          <animate attributeName="cy" values="50;48;50" dur="2s" repeatCount="indefinite"/>
        </circle>
        {/* Torso - kneeling position */}
        <path d="M35 58 L35 68" stroke="#1f2937" strokeWidth="4" strokeLinecap="round"/>
        {/* Arms */}
        <path d="M35 60 L48 55" stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M35 60 L48 55;M35 58 L50 52;M35 60 L48 55" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M35 60 L22 62" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        {/* Legs folded under (seiza) */}
        <path d="M35 68 L28 72 L35 75 L42 72 L35 68" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
      </g>
      
      {/* UKE - also kneeling, being controlled */}
      <g filter="url(#shadow-suwari)">
        <circle cx="60" cy="55" r="7" fill="#64748b">
          <animate attributeName="cy" values="55;60;55" dur="2s" repeatCount="indefinite"/>
        </circle>
        <path d="M60 62 L60 70" stroke="#64748b" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M60 62 L60 70;M60 67 L60 73;M60 62 L60 70" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M60 58 L50 55" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M60 70 L53 73 L60 75 L67 73 L60 70" stroke="#64748b" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      </g>
    </svg>
  </AnimationWrapper>
);

// ═══════════════════════════════════════════════════════════════
// USHIROWAZA - Rear Technique
// ═══════════════════════════════════════════════════════════════
export const UshirowazaAnimation = ({ size = 120 }) => (
  <AnimationWrapper size={size}>
    <svg viewBox="0 0 100 100" width={size * 0.9} height={size * 0.9}>
      <defs>
        <filter id="shadow-ushiro" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
      
      {/* Rear attack indicator */}
      <path d="M80 50 L65 50" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5">
        <animate attributeName="stroke-dashoffset" from="14" to="0" dur="0.6s" repeatCount="indefinite"/>
      </path>
      <polygon points="62,50 68,46 68,54" fill="#ef4444" opacity="0.5"/>
      
      {/* TORI - front, turning */}
      <g filter="url(#shadow-ushiro)">
        <circle cx="40" cy="42" r="8" fill="#1f2937">
          <animateTransform attributeName="transform" type="rotate" values="0 40 55;20 40 55;0 40 55" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <path d="M40 50 L40 68" stroke="#1f2937" strokeWidth="4" strokeLinecap="round"/>
        <path d="M40 55 L52 50" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M40 55 L28 58" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M40 68 L32 85" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M40 68 L48 85" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
      </g>
      
      {/* UKE - attacking from behind, being thrown */}
      <g filter="url(#shadow-ushiro)">
        <circle cx="62" cy="45" r="7" fill="#64748b">
          <animate attributeName="cx" values="62;55;62" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="cy" values="45;55;45" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <path d="M62 52 L58 70" stroke="#64748b" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M62 52 L58 70;M55 62 L50 78;M62 52 L58 70" dur="2.5s" repeatCount="indefinite"/>
        </path>
        {/* Arms grabbing from behind */}
        <path d="M62 48 L50 52" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M58 70 L50 82" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M58 70 L68 80" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
    </svg>
  </AnimationWrapper>
);

// ═══════════════════════════════════════════════════════════════
// BUKIWAZA - Weapons (Bokken)
// ═══════════════════════════════════════════════════════════════
export const BokkenAnimation = ({ size = 120 }) => (
  <AnimationWrapper size={size}>
    <svg viewBox="0 0 100 100" width={size * 0.9} height={size * 0.9}>
      <defs>
        <filter id="shadow-bokken" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
        <linearGradient id="bokken-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78350f"/>
          <stop offset="100%" stopColor="#a16207"/>
        </linearGradient>
      </defs>
      
      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
      
      {/* Cut trajectory */}
      <path d="M30 25 L70 75" stroke="#1f2937" strokeWidth="1" strokeDasharray="4,4" opacity="0.2">
        <animate attributeName="stroke-dashoffset" from="16" to="0" dur="0.8s" repeatCount="indefinite"/>
      </path>
      
      {/* TORI with bokken */}
      <g filter="url(#shadow-bokken)">
        <circle cx="50" cy="38" r="8" fill="#1f2937">
          <animate attributeName="cy" values="38;35;38" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <path d="M50 46 L50 65" stroke="#1f2937" strokeWidth="4" strokeLinecap="round"/>
        {/* Arms holding bokken */}
        <path d="M50 52 L38 48" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M50 52 L62 48" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M50 65 L42 82" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M50 65 L58 82" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        
        {/* BOKKEN */}
        <g>
          <rect x="35" y="20" width="30" height="3" rx="1" fill="url(#bokken-grad)" transform="rotate(-45 50 35)">
            <animateTransform attributeName="transform" type="rotate" values="-45 50 35;-80 50 35;-45 50 35" dur="1.5s" repeatCount="indefinite"/>
          </rect>
          {/* Tsuka (handle) */}
          <rect x="32" y="21" width="8" height="2.5" rx="0.5" fill="#1f2937" transform="rotate(-45 50 35)">
            <animateTransform attributeName="transform" type="rotate" values="-45 50 35;-80 50 35;-45 50 35" dur="1.5s" repeatCount="indefinite"/>
          </rect>
        </g>
      </g>
    </svg>
  </AnimationWrapper>
);

// ═══════════════════════════════════════════════════════════════
// BUKIWAZA - Weapons (Jo)
// ═══════════════════════════════════════════════════════════════
export const JoAnimation = ({ size = 120 }) => (
  <AnimationWrapper size={size}>
    <svg viewBox="0 0 100 100" width={size * 0.9} height={size * 0.9}>
      <defs>
        <filter id="shadow-jo" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
        <linearGradient id="jo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78350f"/>
          <stop offset="100%" stopColor="#92400e"/>
        </linearGradient>
      </defs>
      
      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
      
      {/* TORI with jo */}
      <g filter="url(#shadow-jo)">
        <circle cx="50" cy="40" r="8" fill="#1f2937"/>
        <path d="M50 48 L50 68" stroke="#1f2937" strokeWidth="4" strokeLinecap="round"/>
        {/* Arms holding jo */}
        <path d="M50 52 L35 55" stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M50 52 L35 55;M50 52 L32 52;M50 52 L35 55" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M50 58 L65 55" stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M50 58 L65 55;M50 58 L68 58;M50 58 L65 55" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M50 68 L42 85" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        <path d="M50 68 L58 85" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
        
        {/* JO (staff) */}
        <rect x="15" y="52" width="70" height="3" rx="1.5" fill="url(#jo-grad)">
          <animateTransform attributeName="transform" type="rotate" values="0 50 53;10 50 53;0 50 53" dur="2s" repeatCount="indefinite"/>
        </rect>
      </g>
    </svg>
  </AnimationWrapper>
);

// ═══════════════════════════════════════════════════════════════
// RANDORI - Free Practice (Multiple attackers)
// ═══════════════════════════════════════════════════════════════
export const RandoriAnimation = ({ size = 120 }) => (
  <AnimationWrapper size={size}>
    <svg viewBox="0 0 100 100" width={size * 0.9} height={size * 0.9}>
      <defs>
        <filter id="shadow-randori" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
      
      {/* TORI - center, moving */}
      <g filter="url(#shadow-randori)">
        <circle cx="50" cy="50" r="7" fill="#1f2937">
          <animate attributeName="cx" values="50;52;48;50" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="cy" values="50;48;52;50" dur="3s" repeatCount="indefinite"/>
        </circle>
        <path d="M50 57 L50 70" stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M50 60 L40 55" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="d" values="M50 60 L40 55;M52 58 L42 53;M48 62 L38 57;M50 60 L40 55" dur="3s" repeatCount="indefinite"/>
        </path>
        <path d="M50 60 L60 55" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="d" values="M50 60 L60 55;M52 58 L62 53;M48 62 L58 57;M50 60 L60 55" dur="3s" repeatCount="indefinite"/>
        </path>
        <path d="M50 70 L44 82" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M50 70 L56 82" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      
      {/* UKE 1 - attacking from left */}
      <g filter="url(#shadow-randori)" opacity="0.7">
        <circle cx="25" cy="45" r="5" fill="#64748b">
          <animate attributeName="cx" values="25;35;25" dur="3s" repeatCount="indefinite"/>
        </circle>
        <path d="M25 50 L25 62" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
      </g>
      
      {/* UKE 2 - attacking from right */}
      <g filter="url(#shadow-randori)" opacity="0.7">
        <circle cx="75" cy="50" r="5" fill="#64748b">
          <animate attributeName="cx" values="75;65;75" dur="3s" repeatCount="indefinite" begin="1s"/>
        </circle>
        <path d="M75 55 L75 67" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
      </g>
      
      {/* UKE 3 - behind */}
      <g filter="url(#shadow-randori)" opacity="0.7">
        <circle cx="50" cy="25" r="5" fill="#64748b">
          <animate attributeName="cy" values="25;32;25" dur="3s" repeatCount="indefinite" begin="0.5s"/>
        </circle>
        <path d="M50 30 L50 40" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
      </g>
      
      {/* Movement arrows */}
      <g opacity="0.3">
        <path d="M30 48 L40 50" stroke="#1f2937" strokeWidth="1" strokeDasharray="2,2">
          <animate attributeName="stroke-dashoffset" from="4" to="0" dur="0.5s" repeatCount="indefinite"/>
        </path>
        <path d="M70 52 L60 50" stroke="#1f2937" strokeWidth="1" strokeDasharray="2,2">
          <animate attributeName="stroke-dashoffset" from="4" to="0" dur="0.5s" repeatCount="indefinite"/>
        </path>
        <path d="M50 30 L50 42" stroke="#1f2937" strokeWidth="1" strokeDasharray="2,2">
          <animate attributeName="stroke-dashoffset" from="4" to="0" dur="0.5s" repeatCount="indefinite"/>
        </path>
      </g>
    </svg>
  </AnimationWrapper>
);

// ═══════════════════════════════════════════════════════════════
// UKEMI - Falling/Rolling
// ═══════════════════════════════════════════════════════════════
export const UkemiAnimation = ({ size = 120 }) => (
  <AnimationWrapper size={size}>
    <svg viewBox="0 0 100 100" width={size * 0.9} height={size * 0.9}>
      <defs>
        <filter id="shadow-ukemi" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
      
      {/* Ground */}
      <line x1="10" y1="80" x2="90" y2="80" stroke="#cbd5e1" strokeWidth="1"/>
      
      {/* Roll trajectory */}
      <path d="M25 60 Q50 30 75 60" fill="none" stroke="#1f2937" strokeWidth="1" strokeDasharray="4,3" opacity="0.3">
        <animate attributeName="stroke-dashoffset" from="14" to="0" dur="1s" repeatCount="indefinite"/>
      </path>
      
      {/* Rolling figure - animated through roll */}
      <g filter="url(#shadow-ukemi)">
        {/* Position 1 - starting */}
        <g opacity="0.3">
          <circle cx="25" cy="55" r="6" fill="#64748b"/>
          <path d="M25 61 L25 72" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        </g>
        
        {/* Position 2 - mid roll */}
        <g>
          <circle cx="50" cy="42" r="7" fill="#1f2937">
            <animate attributeName="cy" values="42;38;42" dur="1.5s" repeatCount="indefinite"/>
          </circle>
          {/* Tucked body */}
          <path d="M50 49 Q55 55 50 62" stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <animateTransform attributeName="transform" type="rotate" values="0 50 52;180 50 52;360 50 52" dur="1.5s" repeatCount="indefinite"/>
          </path>
          {/* Arms tucked */}
          <path d="M50 50 L42 48" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" values="0 50 52;180 50 52;360 50 52" dur="1.5s" repeatCount="indefinite"/>
          </path>
        </g>
        
        {/* Position 3 - landing */}
        <g opacity="0.3">
          <circle cx="75" cy="55" r="6" fill="#64748b"/>
          <path d="M75 61 L75 72" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
        </g>
      </g>
    </svg>
  </AnimationWrapper>
);

// ═══════════════════════════════════════════════════════════════
// DEFAULT - Generic Aikido symbol
// ═══════════════════════════════════════════════════════════════
export const DefaultAnimation = ({ size = 120 }) => (
  <AnimationWrapper size={size}>
    <svg viewBox="0 0 100 100" width={size * 0.9} height={size * 0.9}>
      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
      
      {/* Aikido circle symbol */}
      <circle cx="50" cy="50" r="30" fill="none" stroke="#1f2937" strokeWidth="2"/>
      <circle cx="50" cy="50" r="20" fill="none" stroke="#1f2937" strokeWidth="1.5" opacity="0.5"/>
      <circle cx="50" cy="50" r="8" fill="#1f2937"/>
      
      {/* Cross lines */}
      <path d="M50 20 L50 80" stroke="#1f2937" strokeWidth="1.5" opacity="0.4"/>
      <path d="M20 50 L80 50" stroke="#1f2937" strokeWidth="1.5" opacity="0.4"/>
      
      {/* Rotating element */}
      <circle cx="50" cy="25" r="4" fill="#1f2937" opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="4s" repeatCount="indefinite"/>
      </circle>
    </svg>
  </AnimationWrapper>
);

// ═══════════════════════════════════════════════════════════════
// Animation selector function
// ═══════════════════════════════════════════════════════════════
export const getAikidoAnimation = (techniqueName, size = 100) => {
  const name = techniqueName.toLowerCase();
  
  if (name.includes('ikkyo')) return <IkkyoAnimation size={size} />;
  if (name.includes('nikyo')) return <NikyoAnimation size={size} />;
  if (name.includes('sankyo')) return <SankyoAnimation size={size} />;
  if (name.includes('yonkyo')) return <IkkyoAnimation size={size} />; // Similar to ikkyo
  if (name.includes('gokyo')) return <IkkyoAnimation size={size} />; // Similar control
  if (name.includes('shiho') || name.includes('shihonage')) return <ShihonageAnimation size={size} />;
  if (name.includes('irimi')) return <IriminageAnimation size={size} />;
  if (name.includes('kote') || name.includes('kotegaeshi')) return <KotegaeshiAnimation size={size} />;
  if (name.includes('koshi') || name.includes('koshinage')) return <KoshinageAnimation size={size} />;
  if (name.includes('kokyu') && !name.includes('kokyunage')) return <KokyunageAnimation size={size} />;
  if (name.includes('kokyunage')) return <KokyunageAnimation size={size} />;
  if (name.includes('tenchi')) return <TenchinageAnimation size={size} />;
  if (name.includes('kaiten')) return <KaitennageAnimation size={size} />;
  if (name.includes('suwari')) return <SuwariwazaAnimation size={size} />;
  if (name.includes('ushiro')) return <UshirowazaAnimation size={size} />;
  if (name.includes('bokken') || name.includes('ken') || name.includes('tachi') || name.includes('suburi ken') || name.includes('kumitachi') || name.includes('aikiken')) return <BokkenAnimation size={size} />;
  if (name.includes('jo') || name.includes('aikijo')) return <JoAnimation size={size} />;
  if (name.includes('randori') || name.includes('jiyu') || name.includes('ninin')) return <RandoriAnimation size={size} />;
  if (name.includes('ukemi') || name.includes('chute')) return <UkemiAnimation size={size} />;
  if (name.includes('tai no henko') || name.includes('déplacement')) return <DefaultAnimation size={size} />;
  
  return <DefaultAnimation size={size} />;
};

export default getAikidoAnimation;
