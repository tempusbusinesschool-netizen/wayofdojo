import React, { useEffect, useState, useCallback } from "react";
import "@/App.css";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster, toast } from "sonner";
import { Plus, Trash2, Edit2, Target, Award, Circle, Play, BookOpen, Eye, Star, Zap, Users } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Illustrations SVG noir et blanc pour chaque technique d'Aïkido
const AikidoIllustrations = {
  // Ikkyo - Première immobilisation (contrôle du coude)
  ikkyo: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Tori (celui qui fait la technique) */}
        <circle cx="30" cy="25" r="8" fill="currentColor" opacity="0.1"/>
        <line x1="30" y1="33" x2="30" y2="55"/>
        <line x1="30" y1="40" x2="50" y2="35"/>
        <line x1="30" y1="40" x2="15" y2="50"/>
        <line x1="30" y1="55" x2="20" y2="75"/>
        <line x1="30" y1="55" x2="40" y2="75"/>
        {/* Uke (celui qui reçoit) - au sol */}
        <circle cx="70" cy="60" r="7" fill="currentColor" opacity="0.1"/>
        <path d="M70 67 Q75 80 85 85"/>
        <line x1="70" y1="67" x2="55" y2="75"/>
        <line x1="55" y1="75" x2="50" y2="35"/>
        {/* Flèche direction */}
        <path d="M50 30 L55 25 L50 20" strokeWidth="1.5"/>
      </g>
    </svg>
  ),
  
  // Nikyo - Deuxième immobilisation (torsion du poignet)
  nikyo: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="35" cy="25" r="8" fill="currentColor" opacity="0.1"/>
        <line x1="35" y1="33" x2="35" y2="55"/>
        <line x1="35" y1="42" x2="55" y2="38"/>
        <line x1="35" y1="42" x2="20" y2="48"/>
        <line x1="35" y1="55" x2="25" y2="75"/>
        <line x1="35" y1="55" x2="45" y2="75"/>
        {/* Uke agenouillé */}
        <circle cx="65" cy="50" r="7" fill="currentColor" opacity="0.1"/>
        <line x1="65" y1="57" x2="65" y2="70"/>
        <line x1="55" y1="38" x2="65" y2="57"/>
        <path d="M65 70 Q70 80 75 82"/>
        {/* Spirale poignet */}
        <path d="M55 38 Q58 35 55 32" strokeWidth="1.5"/>
      </g>
    </svg>
  ),
  
  // Sankyo - Troisième immobilisation
  sankyo: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="40" cy="28" r="8" fill="currentColor" opacity="0.1"/>
        <line x1="40" y1="36" x2="40" y2="58"/>
        <line x1="40" y1="44" x2="60" y2="40"/>
        <line x1="40" y1="44" x2="25" y2="52"/>
        <line x1="40" y1="58" x2="30" y2="78"/>
        <line x1="40" y1="58" x2="50" y2="78"/>
        {/* Uke plié */}
        <circle cx="70" cy="55" r="7" fill="currentColor" opacity="0.1"/>
        <path d="M70 62 Q75 75 70 85"/>
        <line x1="60" y1="40" x2="70" y2="55"/>
        {/* Rotation */}
        <path d="M60 35 A8 8 0 0 1 65 42" strokeWidth="1.5"/>
      </g>
    </svg>
  ),
  
  // Shiho nage - Projection quatre directions
  shiho_nage: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Tori debout, bras levés */}
        <circle cx="35" cy="22" r="8" fill="currentColor" opacity="0.1"/>
        <line x1="35" y1="30" x2="35" y2="55"/>
        <line x1="35" y1="38" x2="55" y2="25"/>
        <line x1="35" y1="38" x2="20" y2="45"/>
        <line x1="35" y1="55" x2="25" y2="78"/>
        <line x1="35" y1="55" x2="45" y2="78"/>
        {/* Uke en chute arrière */}
        <circle cx="68" cy="45" r="7" fill="currentColor" opacity="0.1"/>
        <path d="M68 52 Q80 65 85 80"/>
        <line x1="55" y1="25" x2="68" y2="45"/>
        <line x1="68" y1="52" x2="60" y2="65"/>
        {/* Flèches quatre directions */}
        <path d="M75 20 L80 15 M80 15 L85 20 M80 15 L80 10" strokeWidth="1"/>
      </g>
    </svg>
  ),
  
  // Irimi nage - Projection en entrant
  irimi_nage: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Tori entrant */}
        <circle cx="30" cy="30" r="8" fill="currentColor" opacity="0.1"/>
        <line x1="30" y1="38" x2="30" y2="60"/>
        <line x1="30" y1="45" x2="50" y2="35"/>
        <line x1="30" y1="45" x2="15" y2="50"/>
        <line x1="30" y1="60" x2="22" y2="80"/>
        <line x1="30" y1="60" x2="38" y2="80"/>
        {/* Uke projeté en arrière */}
        <circle cx="60" cy="40" r="7" fill="currentColor" opacity="0.1"/>
        <path d="M60 47 Q70 60 80 75"/>
        <line x1="50" y1="35" x2="55" y2="40"/>
        <line x1="60" y1="47" x2="50" y2="55"/>
        {/* Mouvement entrant */}
        <path d="M40 30 L48 28" strokeWidth="1.5" markerEnd="url(#arrow)"/>
      </g>
    </svg>
  ),
  
  // Kote gaeshi - Retournement du poignet
  kote_gaeshi: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Tori */}
        <circle cx="30" cy="35" r="8" fill="currentColor" opacity="0.1"/>
        <line x1="30" y1="43" x2="30" y2="65"/>
        <line x1="30" y1="50" x2="50" y2="45"/>
        <line x1="30" y1="50" x2="15" y2="55"/>
        <line x1="30" y1="65" x2="22" y2="85"/>
        <line x1="30" y1="65" x2="38" y2="85"/>
        {/* Uke en rotation/chute */}
        <circle cx="65" cy="50" r="7" fill="currentColor" opacity="0.1"/>
        <path d="M65 57 Q75 70 70 85"/>
        <line x1="50" y1="45" x2="58" y2="50"/>
        <line x1="65" y1="57" x2="80" y2="60"/>
        {/* Spirale poignet */}
        <circle cx="54" cy="45" r="6" strokeWidth="1" strokeDasharray="2,2"/>
      </g>
    </svg>
  ),
  
  // Kaiten nage - Projection rotative
  kaiten_nage: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="35" cy="30" r="8" fill="currentColor" opacity="0.1"/>
        <line x1="35" y1="38" x2="35" y2="60"/>
        <line x1="35" y1="45" x2="55" y2="40"/>
        <line x1="35" y1="45" x2="20" y2="50"/>
        <line x1="35" y1="60" x2="27" y2="80"/>
        <line x1="35" y1="60" x2="43" y2="80"/>
        {/* Uke en rotation avant */}
        <circle cx="65" cy="55" r="7" fill="currentColor" opacity="0.1"/>
        <path d="M65 62 Q55 75 50 85"/>
        <line x1="55" y1="40" x2="60" y2="55"/>
        {/* Arc de rotation */}
        <path d="M70 45 A15 15 0 0 1 55 65" strokeWidth="1" strokeDasharray="3,2"/>
      </g>
    </svg>
  ),
  
  // Tenchi nage - Projection ciel-terre
  tenchi_nage: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Tori bras écartés haut/bas */}
        <circle cx="40" cy="30" r="8" fill="currentColor" opacity="0.1"/>
        <line x1="40" y1="38" x2="40" y2="60"/>
        <line x1="40" y1="45" x2="60" y2="25"/>
        <line x1="40" y1="45" x2="25" y2="60"/>
        <line x1="40" y1="60" x2="32" y2="80"/>
        <line x1="40" y1="60" x2="48" y2="80"/>
        {/* Uke déséquilibré */}
        <circle cx="70" cy="45" r="7" fill="currentColor" opacity="0.1"/>
        <path d="M70 52 Q80 65 85 80"/>
        {/* Flèches ciel/terre */}
        <path d="M62 20 L60 15" strokeWidth="1.5"/>
        <path d="M23 65 L20 70" strokeWidth="1.5"/>
      </g>
    </svg>
  ),
  
  // Ukemi - Chutes
  ukemi: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Personne en roulade */}
        <circle cx="45" cy="40" r="8" fill="currentColor" opacity="0.1"/>
        <path d="M45 48 Q55 55 60 65"/>
        <path d="M45 48 Q35 55 30 65"/>
        <line x1="60" y1="65" x2="70" y2="75"/>
        <line x1="30" y1="65" x2="25" y2="55"/>
        {/* Arc de roulade */}
        <path d="M30 35 Q45 20 65 35 Q80 50 75 70" strokeWidth="1" strokeDasharray="3,2"/>
        {/* Sol */}
        <line x1="15" y1="85" x2="85" y2="85" strokeWidth="1"/>
      </g>
    </svg>
  ),
  
  // Suwari waza - Techniques à genoux
  suwari: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Tori à genoux */}
        <circle cx="30" cy="40" r="7" fill="currentColor" opacity="0.1"/>
        <line x1="30" y1="47" x2="30" y2="60"/>
        <line x1="30" y1="52" x2="45" y2="48"/>
        <line x1="30" y1="52" x2="18" y2="55"/>
        <path d="M30 60 Q25 70 20 75"/>
        <path d="M30 60 Q35 70 40 75"/>
        {/* Uke à genoux */}
        <circle cx="60" cy="45" r="6" fill="currentColor" opacity="0.1"/>
        <line x1="60" y1="51" x2="60" y2="62"/>
        <line x1="45" y1="48" x2="55" y2="50"/>
        <path d="M60 62 Q55 72 50 77"/>
        <path d="M60 62 Q65 72 70 77"/>
        {/* Sol tatami */}
        <line x1="10" y1="80" x2="90" y2="80" strokeWidth="1"/>
      </g>
    </svg>
  ),
  
  // Ushiro waza - Attaques par l'arrière
  ushiro: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Tori de face */}
        <circle cx="45" cy="30" r="8" fill="currentColor" opacity="0.1"/>
        <line x1="45" y1="38" x2="45" y2="60"/>
        <line x1="45" y1="45" x2="60" y2="50"/>
        <line x1="45" y1="45" x2="30" y2="50"/>
        <line x1="45" y1="60" x2="37" y2="80"/>
        <line x1="45" y1="60" x2="53" y2="80"/>
        {/* Uke derrière */}
        <circle cx="65" cy="35" r="6" fill="currentColor" opacity="0.1" strokeDasharray="2,2"/>
        <line x1="65" y1="41" x2="65" y2="55" strokeDasharray="2,2"/>
        <line x1="60" y1="50" x2="65" y2="48"/>
        {/* Flèche arrière */}
        <path d="M75 35 L80 35 L77 40" strokeWidth="1"/>
      </g>
    </svg>
  ),
  
  // Bokken - Sabre en bois
  bokken: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Personne avec bokken levé */}
        <circle cx="40" cy="25" r="8" fill="currentColor" opacity="0.1"/>
        <line x1="40" y1="33" x2="40" y2="58"/>
        <line x1="40" y1="40" x2="55" y2="20"/>
        <line x1="40" y1="40" x2="25" y2="45"/>
        <line x1="40" y1="58" x2="32" y2="80"/>
        <line x1="40" y1="58" x2="48" y2="80"/>
        {/* Bokken */}
        <line x1="55" y1="20" x2="75" y2="8" strokeWidth="3"/>
        <line x1="52" y1="22" x2="55" y2="20" strokeWidth="4"/>
      </g>
    </svg>
  ),
  
  // Jo - Bâton
  jo: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Personne avec jo */}
        <circle cx="45" cy="28" r="8" fill="currentColor" opacity="0.1"/>
        <line x1="45" y1="36" x2="45" y2="60"/>
        <line x1="45" y1="43" x2="60" y2="38"/>
        <line x1="45" y1="43" x2="30" y2="48"/>
        <line x1="45" y1="60" x2="37" y2="82"/>
        <line x1="45" y1="60" x2="53" y2="82"/>
        {/* Jo (bâton long) */}
        <line x1="20" y1="65" x2="80" y2="25" strokeWidth="3"/>
      </g>
    </svg>
  ),
  
  // Randori - Combat libre
  randori: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Tori central */}
        <circle cx="50" cy="35" r="7" fill="currentColor" opacity="0.1"/>
        <line x1="50" y1="42" x2="50" y2="60"/>
        <line x1="50" y1="48" x2="65" y2="45"/>
        <line x1="50" y1="48" x2="35" y2="45"/>
        <line x1="50" y1="60" x2="43" y2="78"/>
        <line x1="50" y1="60" x2="57" y2="78"/>
        {/* Attaquants multiples */}
        <circle cx="25" cy="40" r="5" fill="currentColor" opacity="0.05"/>
        <circle cx="75" cy="40" r="5" fill="currentColor" opacity="0.05"/>
        <circle cx="50" cy="15" r="5" fill="currentColor" opacity="0.05"/>
        {/* Flèches d'attaque */}
        <path d="M30 42 L38 44" strokeWidth="1"/>
        <path d="M70 42 L62 44" strokeWidth="1"/>
      </g>
    </svg>
  ),
  
  // Base / Déplacements
  base: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Deux personnes face à face */}
        <circle cx="30" cy="35" r="7" fill="currentColor" opacity="0.1"/>
        <line x1="30" y1="42" x2="30" y2="60"/>
        <line x1="30" y1="48" x2="42" y2="45"/>
        <line x1="30" y1="48" x2="18" y2="50"/>
        <line x1="30" y1="60" x2="24" y2="78"/>
        <line x1="30" y1="60" x2="36" y2="78"/>
        
        <circle cx="70" cy="35" r="7" fill="currentColor" opacity="0.1"/>
        <line x1="70" y1="42" x2="70" y2="60"/>
        <line x1="70" y1="48" x2="58" y2="45"/>
        <line x1="70" y1="48" x2="82" y2="50"/>
        <line x1="70" y1="60" x2="64" y2="78"/>
        <line x1="70" y1="60" x2="76" y2="78"/>
        {/* Connexion */}
        <line x1="42" y1="45" x2="58" y2="45" strokeDasharray="3,2"/>
      </g>
    </svg>
  ),
  
  // Générique
  generic: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Personne en garde */}
        <circle cx="50" cy="25" r="9" fill="currentColor" opacity="0.1"/>
        <line x1="50" y1="34" x2="50" y2="58"/>
        <line x1="50" y1="42" x2="68" y2="38"/>
        <line x1="50" y1="42" x2="32" y2="46"/>
        <line x1="50" y1="58" x2="40" y2="82"/>
        <line x1="50" y1="58" x2="60" y2="82"/>
        {/* Cercle harmonie */}
        <circle cx="50" cy="50" r="35" strokeWidth="1" strokeDasharray="4,3" opacity="0.3"/>
      </g>
    </svg>
  )
};

// Fonction pour trouver la bonne illustration selon le nom de la technique
const getIllustrationForTechnique = (techniqueName) => {
  const name = techniqueName.toLowerCase();
  
  // Immobilisations
  if (name.includes("ikkyo")) return AikidoIllustrations.ikkyo;
  if (name.includes("nikyo")) return AikidoIllustrations.nikyo;
  if (name.includes("sankyo")) return AikidoIllustrations.sankyo;
  if (name.includes("yonkyo")) return AikidoIllustrations.nikyo;
  if (name.includes("gokyo")) return AikidoIllustrations.ikkyo;
  
  // Projections
  if (name.includes("shiho") || name.includes("shihonage")) return AikidoIllustrations.shiho_nage;
  if (name.includes("irimi") && name.includes("nage")) return AikidoIllustrations.irimi_nage;
  if (name.includes("kote") || name.includes("kotegaeshi")) return AikidoIllustrations.kote_gaeshi;
  if (name.includes("kaiten")) return AikidoIllustrations.kaiten_nage;
  if (name.includes("tenchi")) return AikidoIllustrations.tenchi_nage;
  if (name.includes("koshi")) return AikidoIllustrations.kaiten_nage;
  if (name.includes("kokyu") && name.includes("nage")) return AikidoIllustrations.irimi_nage;
  if (name.includes("sumi")) return AikidoIllustrations.kaiten_nage;
  
  // Chutes
  if (name.includes("ukemi") || name.includes("chute")) return AikidoIllustrations.ukemi;
  
  // Suwariwaza
  if (name.includes("suwari") || name.includes("seiza")) return AikidoIllustrations.suwari;
  
  // Ushirowaza
  if (name.includes("ushiro")) return AikidoIllustrations.ushiro;
  
  // Armes
  if (name.includes("bokken") || name.includes("ken") || name.includes("tachi") || name.includes("kumitachi") || name.includes("suburi bokken")) return AikidoIllustrations.bokken;
  if (name.includes("jo") || name.includes("bâton") || name.includes("suburi jo")) return AikidoIllustrations.jo;
  if (name.includes("tanto") || name.includes("tanken") || name.includes("couteau")) return AikidoIllustrations.bokken;
  
  // Autres
  if (name.includes("randori") || name.includes("jiyu")) return AikidoIllustrations.randori;
  if (name.includes("hanmi handachi")) return AikidoIllustrations.suwari;
  if (name.includes("tai no henko") || name.includes("déplacement") || name.includes("tenkan")) return AikidoIllustrations.base;
  if (name.includes("kokyu ho") || name.includes("kokyu")) return AikidoIllustrations.base;
  if (name.includes("morote")) return AikidoIllustrations.base;
  
  return AikidoIllustrations.generic;
};

// Composant illustration SVG noir et blanc
const TechniqueIllustration = ({ technique, size = 100 }) => {
  const Illustration = getIllustrationForTechnique(technique);
  
  return (
    <div 
      className="relative rounded-xl overflow-hidden bg-white flex items-center justify-center p-2 text-gray-700"
      style={{ width: size, height: size }}
    >
      <Illustration />
    </div>
  );
};

// Mastery levels
const MASTERY_LEVELS = {
  not_started: { label: "Non démarré", color: "bg-slate-100 text-slate-600 border-slate-300", icon: Circle, progress: 0, emoji: "⚪" },
  learning: { label: "En apprentissage", color: "bg-blue-100 text-blue-700 border-blue-300", icon: BookOpen, progress: 33, emoji: "📖" },
  practiced: { label: "Pratiqué", color: "bg-amber-100 text-amber-700 border-amber-300", icon: Target, progress: 66, emoji: "🎯" },
  mastered: { label: "Maîtrisé", color: "bg-emerald-100 text-emerald-700 border-emerald-300", icon: Award, progress: 100, emoji: "🏆" }
};

// Kyu colors - traditional belt colors
const KYU_COLORS = [
  { value: "#ffffff", label: "Blanc (6e kyu)", textColor: "#374151" },
  { value: "#fbbf24", label: "Jaune (5e kyu)", textColor: "#92400e" },
  { value: "#f97316", label: "Orange (4e kyu)", textColor: "#ffffff" },
  { value: "#22c55e", label: "Vert (3e kyu)", textColor: "#ffffff" },
  { value: "#3b82f6", label: "Bleu (2e kyu)", textColor: "#ffffff" },
  { value: "#7c3aed", label: "Violet (1er kyu)", textColor: "#ffffff" },
  { value: "#1f2937", label: "Noir (Dan)", textColor: "#ffffff" }
];

// Get belt color for kyu level
const getBeltColor = (order) => {
  if (order >= 6) return { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" }; // White belt
  if (order === 5) return { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" }; // Yellow
  if (order === 4) return { bg: "#ffedd5", text: "#c2410c", border: "#fdba74" }; // Orange
  if (order === 3) return { bg: "#dcfce7", text: "#166534", border: "#86efac" }; // Green
  if (order === 2) return { bg: "#dbeafe", text: "#1e40af", border: "#93c5fd" }; // Blue
  if (order === 1) return { bg: "#ede9fe", text: "#5b21b6", border: "#c4b5fd" }; // Purple
  return { bg: "#1f2937", text: "#ffffff", border: "#374151" }; // Black (Dan)
};

// Technique Modal - Style traditionnel avec points clés et conseils
const TechniqueModal = ({ technique, kyu, isOpen, onClose, onPractice, onUpdateMastery }) => {
  if (!technique) return null;
  const mastery = MASTERY_LEVELS[technique.mastery_level] || MASTERY_LEVELS.not_started;
  const beltColor = getBeltColor(kyu?.order || 6);
  const isDan = kyu?.order <= 0;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-2xl overflow-hidden border-0 shadow-2xl modal-japanese max-h-[90vh] overflow-y-auto">
        {/* Header avec bande dorée */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600"></div>
        
        <DialogHeader className="pt-4 pb-2">
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-2xl">{mastery.emoji}</span>
            <span>{technique.name}</span>
          </DialogTitle>
          <p className="text-sm text-gray-500">{kyu?.name}</p>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {/* Illustration et Stats */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg border-2" style={{ borderColor: beltColor.border, backgroundColor: beltColor.bg }}>
                <TechniqueIllustration technique={technique.name} size={120} />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Sessions</p>
                  <p className="text-2xl font-bold text-gray-800">{technique.practice_count}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Niveau</p>
                  <p className="text-lg font-bold text-gray-800">{mastery.label}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          {technique.description && (
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-400">
              <p className="text-sm text-gray-700 leading-relaxed">{technique.description}</p>
            </div>
          )}
          
          {/* Points clés d'exécution */}
          {technique.key_points && technique.key_points.length > 0 && (
            <div className="info-section key-points">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Points clés d'exécution
              </h4>
              <ul className="space-y-1.5">
                {technique.key_points.map((point, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Conseils de pratique */}
          {technique.practice_tips && technique.practice_tips.length > 0 && (
            <div className="info-section practice-tips">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Conseils de pratique
              </h4>
              <ul className="space-y-1.5">
                {technique.practice_tips.map((tip, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Sélecteur de maîtrise */}
          <div className="divider-japanese"></div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(MASTERY_LEVELS).map(([key, level]) => {
              const isSelected = technique.mastery_level === key;
              return (
                <button
                  key={key}
                  onClick={() => onUpdateMastery(key)}
                  className={`p-3 rounded-lg border-2 flex items-center gap-2 transition-all ${
                    isSelected 
                      ? 'border-gray-800 bg-gray-800 text-white shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span className="text-xl">{level.emoji}</span>
                  <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>{level.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <DialogFooter className="gap-2 pt-2">
          <DialogClose asChild>
            <Button variant="outline">Fermer</Button>
          </DialogClose>
          <Button onClick={onPractice} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md">
            <Play className="w-4 h-4 mr-2" /> Pratiquer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function App() {
  const [kyuLevels, setKyuLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKyu, setNewKyu] = useState({ name: "", order: "", color: "#3b82f6" });
  const [newTechnique, setNewTechnique] = useState({ name: "", description: "" });
  const [selectedKyuId, setSelectedKyuId] = useState(null);
  const [editingTechnique, setEditingTechnique] = useState(null);
  const [kyuDialogOpen, setKyuDialogOpen] = useState(false);
  const [techniqueDialogOpen, setTechniqueDialogOpen] = useState(false);
  const [editTechniqueDialogOpen, setEditTechniqueDialogOpen] = useState(false);
  const [viewTechniqueData, setViewTechniqueData] = useState({ technique: null, kyu: null, isOpen: false });

  const fetchKyuLevels = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/kyu-levels`);
      setKyuLevels(response.data);
    } catch (error) {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  const seedData = async () => {
    try {
      await axios.post(`${API}/seed`);
      await fetchKyuLevels();
      toast.success("Données chargées ! 🎉");
    } catch (error) {
      toast.error("Erreur");
    }
  };

  useEffect(() => { fetchKyuLevels(); }, [fetchKyuLevels]);

  const handleCreateKyu = async () => {
    if (!newKyu.name || !newKyu.order) { toast.error("Remplir tous les champs"); return; }
    try {
      await axios.post(`${API}/kyu-levels`, { name: newKyu.name, order: parseInt(newKyu.order), color: newKyu.color });
      setNewKyu({ name: "", order: "", color: "#3b82f6" });
      setKyuDialogOpen(false);
      await fetchKyuLevels();
      toast.success("Niveau créé ! 🥋");
    } catch (error) { toast.error("Erreur"); }
  };

  const handleDeleteKyu = async (kyuId) => {
    if (!window.confirm("Supprimer ?")) return;
    try { await axios.delete(`${API}/kyu-levels/${kyuId}`); await fetchKyuLevels(); toast.success("Supprimé"); }
    catch (error) { toast.error("Erreur"); }
  };

  const handleAddTechnique = async () => {
    if (!newTechnique.name) { toast.error("Entrer un nom"); return; }
    try {
      await axios.post(`${API}/kyu-levels/${selectedKyuId}/techniques`, newTechnique);
      setNewTechnique({ name: "", description: "" });
      setTechniqueDialogOpen(false);
      await fetchKyuLevels();
      toast.success("Technique ajoutée ! ✨");
    } catch (error) { toast.error("Erreur"); }
  };

  const handleUpdateMastery = async (kyuId, techniqueId, newLevel) => {
    try {
      await axios.put(`${API}/kyu-levels/${kyuId}/techniques/${techniqueId}`, { mastery_level: newLevel });
      await fetchKyuLevels();
      toast.success(`${MASTERY_LEVELS[newLevel].emoji} ${MASTERY_LEVELS[newLevel].label}`);
    } catch (error) { toast.error("Erreur"); }
  };

  const handlePractice = async (kyuId, techniqueId) => {
    try {
      await axios.post(`${API}/kyu-levels/${kyuId}/techniques/${techniqueId}/practice`);
      await fetchKyuLevels();
      toast.success("Session enregistrée ! 💪");
    } catch (error) { toast.error("Erreur"); }
  };

  const handleDeleteTechnique = async (kyuId, techniqueId) => {
    if (!window.confirm("Supprimer ?")) return;
    try { await axios.delete(`${API}/kyu-levels/${kyuId}/techniques/${techniqueId}`); await fetchKyuLevels(); }
    catch (error) { toast.error("Erreur"); }
  };

  const handleUpdateTechnique = async () => {
    if (!editingTechnique) return;
    try {
      await axios.put(`${API}/kyu-levels/${editingTechnique.kyuId}/techniques/${editingTechnique.id}`, 
        { name: editingTechnique.name, description: editingTechnique.description });
      setEditTechniqueDialogOpen(false);
      setEditingTechnique(null);
      await fetchKyuLevels();
      toast.success("Mis à jour ! ✅");
    } catch (error) { toast.error("Erreur"); }
  };

  const calculateKyuProgress = (techniques) => {
    if (!techniques?.length) return 0;
    return Math.round(techniques.reduce((sum, t) => sum + (MASTERY_LEVELS[t.mastery_level]?.progress || 0), 0) / techniques.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen aikido-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-orange-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen aikido-bg">
      <Toaster position="top-right" richColors />
      
      {/* Header orange */}
      <header className="header-traditional sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg animate-glow">
              <span className="text-white font-bold text-2xl kanji-icon">合</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Aikido Tracker</h1>
              <p className="text-sm text-white/70">Programme officiel FFAAA</p>
            </div>
          </div>
          <div className="flex gap-2">
            {kyuLevels.length === 0 && (
              <Button onClick={seedData} variant="outline" size="sm">
                <Zap className="w-4 h-4 mr-1 text-amber-500" /> Charger données
              </Button>
            )}
            <Dialog open={kyuDialogOpen} onOpenChange={setKyuDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-red-500 to-orange-500">
                  <Plus className="w-4 h-4 mr-1" /> Niveau
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader><DialogTitle>Ajouter un niveau</DialogTitle></DialogHeader>
                <div className="space-y-3 py-3">
                  <div><Label>Nom</Label><Input placeholder="5e kyu" value={newKyu.name} onChange={(e) => setNewKyu({...newKyu, name: e.target.value})} /></div>
                  <div><Label>Ordre</Label><Input type="number" placeholder="5" value={newKyu.order} onChange={(e) => setNewKyu({...newKyu, order: e.target.value})} /></div>
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
                  <Button onClick={handleCreateKyu} className="bg-emerald-500">Créer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {kyuLevels.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-xl animate-glow">
              <span className="text-4xl text-white kanji-icon">合</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bienvenue sur Aikido Tracker</h2>
            <p className="text-gray-500 mb-6">Chargez les données du programme officiel FFAAA pour commencer</p>
            <Button onClick={seedData} className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-6 py-2 shadow-lg">
              <Zap className="w-4 h-4 mr-2" /> Charger les données
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {kyuLevels.map((kyu) => {
              const progress = calculateKyuProgress(kyu.techniques);
              const beltColor = getBeltColor(kyu.order);
              const isDan = kyu.order <= 0;
              
              return (
                <Card key={kyu.id} className="card-japanese overflow-hidden" style={{ '--belt-color': beltColor.border }}>
                  <CardHeader className="pb-3" style={{ backgroundColor: beltColor.bg }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg shadow ${isDan ? 'bg-gray-800 text-white' : ''}`}
                             style={!isDan ? { backgroundColor: beltColor.border, color: '#fff' } : {}}>
                          {isDan ? '段' : kyu.order}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold" style={{ color: isDan ? '#fff' : beltColor.text }}>
                            {kyu.name}
                          </CardTitle>
                          <CardDescription style={{ color: isDan ? 'rgba(255,255,255,0.7)' : `${beltColor.text}90` }}>
                            {kyu.techniques?.length || 0} techniques • {progress}% maîtrisé
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Progress bar */}
                        <div className="w-24 h-2 progress-traditional rounded">
                          <div className="progress-traditional-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <Dialog open={techniqueDialogOpen && selectedKyuId === kyu.id} onOpenChange={(open) => { setTechniqueDialogOpen(open); if (open) setSelectedKyuId(kyu.id); }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="bg-white/80">
                              <Plus className="w-3 h-3 mr-1" /> Tech.
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white">
                            <DialogHeader><DialogTitle>Ajouter à {kyu.name}</DialogTitle></DialogHeader>
                            <div className="space-y-3 py-3">
                              <div><Label>Technique</Label><Input placeholder="Shomenuchi ikkyo" value={newTechnique.name} onChange={(e) => setNewTechnique({...newTechnique, name: e.target.value})} /></div>
                              <div><Label>Description</Label><Textarea placeholder="Description..." value={newTechnique.description} onChange={(e) => setNewTechnique({...newTechnique, description: e.target.value})} /></div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
                              <Button onClick={handleAddTechnique} style={{ backgroundColor: beltColor.border }}>Ajouter</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-600" onClick={() => handleDeleteKyu(kyu.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 bg-white">
                    {!kyu.techniques?.length ? (
                      <p className="text-center py-8 text-gray-400">Aucune technique</p>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {kyu.techniques.map((technique) => {
                          const mastery = MASTERY_LEVELS[technique.mastery_level] || MASTERY_LEVELS.not_started;
                          
                          return (
                            <div key={technique.id} className="technique-card p-3 group">
                              {/* Illustration */}
                              <div className="flex justify-center py-2 mb-2 rounded-lg bg-gray-50 border">
                                <TechniqueIllustration technique={technique.name} size={70} />
                              </div>
                              
                              {/* Nom */}
                              <h4 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2">{technique.name}</h4>
                              
                              {/* Badge et sessions */}
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  technique.mastery_level === 'mastered' ? 'mastery-mastered' :
                                  technique.mastery_level === 'practiced' ? 'mastery-practiced' :
                                  technique.mastery_level === 'learning' ? 'mastery-learning' :
                                  'mastery-not-started'
                                }`}>
                                  {mastery.emoji} {mastery.label}
                                </span>
                                <span className="text-xs text-gray-400">{technique.practice_count} sess.</span>
                              </div>
                              
                              {/* Boutons */}
                              <div className="flex gap-1.5">
                                <Button size="sm" className="flex-1 h-8 text-xs bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-md" 
                                        onClick={() => setViewTechniqueData({ technique, kyu, isOpen: true })}>
                                  <Eye className="w-3 h-3 mr-1" /> Voir
                                </Button>
                                <Button size="sm" className="h-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md" onClick={() => handlePractice(kyu.id, technique.id)}>
                                  <Play className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 text-gray-400" onClick={() => { setEditingTechnique({...technique, kyuId: kyu.id}); setEditTechniqueDialogOpen(true); }}>
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 text-red-400" onClick={() => handleDeleteTechnique(kyu.id, technique.id)}>
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Modals */}
      <TechniqueModal
        technique={viewTechniqueData.technique}
        kyu={viewTechniqueData.kyu}
        isOpen={viewTechniqueData.isOpen}
        onClose={() => setViewTechniqueData({ technique: null, kyu: null, isOpen: false })}
        onPractice={() => { handlePractice(viewTechniqueData.kyu?.id, viewTechniqueData.technique?.id); setViewTechniqueData({ technique: null, kyu: null, isOpen: false }); }}
        onUpdateMastery={(level) => { handleUpdateMastery(viewTechniqueData.kyu?.id, viewTechniqueData.technique?.id, level); setViewTechniqueData(p => ({...p, technique: {...p.technique, mastery_level: level}})); }}
      />

      <Dialog open={editTechniqueDialogOpen} onOpenChange={setEditTechniqueDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader><DialogTitle>Modifier</DialogTitle></DialogHeader>
          {editingTechnique && (
            <div className="space-y-3 py-3">
              <div><Label>Nom</Label><Input value={editingTechnique.name} onChange={(e) => setEditingTechnique({...editingTechnique, name: e.target.value})} /></div>
              <div><Label>Description</Label><Textarea value={editingTechnique.description || ""} onChange={(e) => setEditingTechnique({...editingTechnique, description: e.target.value})} /></div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button onClick={handleUpdateTechnique} className="bg-emerald-500">Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-slate-100 border-t mt-8 py-4 text-center text-sm text-gray-500">
        🥋 Aikido Tracker - Programme officiel FAA
      </footer>
    </div>
  );
}

export default App;
