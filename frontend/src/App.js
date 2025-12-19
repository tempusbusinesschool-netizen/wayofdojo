import { useEffect, useState, useCallback } from "react";
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
import { getAikidoAnimation } from "@/components/AikidoAnimations";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Use the animated illustrations from AikidoAnimations component
const TechniqueIllustration = ({ technique, size = 100 }) => {
  return getAikidoAnimation(technique, size);
};

// Legacy static illustration (fallback)
const StaticIllustration = ({ technique, color = "#3b82f6", size = 100 }) => {
  const name = technique.toLowerCase();
  
  // Determine which illustration to show based on technique name
  if (name.includes('ikkyo')) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id={`grad-ikkyo-${color.replace('#','')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.6"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,2" opacity="0.3"/>
        {/* Tori - standing figure controlling */}
        <circle cx="35" cy="25" r="8" fill={`url(#grad-ikkyo-${color.replace('#','')})`}/>
        <path d="M35 33 L35 55 M35 40 L25 50 M35 40 L50 35 M35 55 L28 75 M35 55 L42 75" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* Uke - person being controlled downward */}
        <circle cx="60" cy="45" r="7" fill="#64748b"/>
        <path d="M60 52 L65 70 M60 55 L55 48 M65 70 L58 82 M65 70 L72 80" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        {/* Control direction arrow */}
        <path d="M50 38 Q60 50 65 65" stroke={color} strokeWidth="1.5" fill="none" strokeDasharray="3,3" opacity="0.6">
          <animate attributeName="stroke-dashoffset" from="6" to="0" dur="1s" repeatCount="indefinite"/>
        </path>
      </svg>
    );
  }
  
  if (name.includes('nikyo')) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,2" opacity="0.3"/>
        {/* Tori applying wrist lock */}
        <circle cx="40" cy="28" r="8" fill={color}/>
        <path d="M40 36 L40 58 M40 42 L28 52 M40 42 L55 42 M40 58 L32 78 M40 58 L48 78" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* Uke receiving nikyo */}
        <circle cx="62" cy="50" r="7" fill="#64748b"/>
        <path d="M62 57 L58 75 M62 52 L72 48 M58 75 L52 85 M58 75 L65 82" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        {/* Wrist lock indicator */}
        <ellipse cx="55" cy="44" rx="8" ry="5" fill="none" stroke={color} strokeWidth="2" opacity="0.7">
          <animate attributeName="rx" values="8;10;8" dur="1.5s" repeatCount="indefinite"/>
        </ellipse>
      </svg>
    );
  }
  
  if (name.includes('sankyo')) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,2" opacity="0.3"/>
        {/* Spiral motion */}
        <path d="M50 25 Q70 35 65 50 Q60 65 45 60 Q30 55 35 45" fill="none" stroke={color} strokeWidth="2" opacity="0.4">
          <animate attributeName="stroke-dasharray" values="0,200;100,100" dur="2s" repeatCount="indefinite"/>
        </path>
        {/* Tori */}
        <circle cx="38" cy="30" r="8" fill={color}/>
        <path d="M38 38 L38 58 M38 45 L28 55 M38 45 L52 40 M38 58 L30 78 M38 58 L46 78" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* Uke twisted */}
        <circle cx="58" cy="55" r="7" fill="#64748b"/>
        <path d="M58 62 L55 78 M58 58 L68 52 M55 78 L48 85 M55 78 L62 85" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg>
    );
  }
  
  if (name.includes('yonkyo')) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,2" opacity="0.3"/>
        {/* Tori applying pressure point */}
        <circle cx="38" cy="28" r="8" fill={color}/>
        <path d="M38 36 L38 58 M38 42 L26 50 M38 42 L52 38 M38 58 L30 78 M38 58 L46 78" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* Uke */}
        <circle cx="60" cy="52" r="7" fill="#64748b"/>
        <path d="M60 59 L58 76 M60 55 L70 50 M58 76 L52 85 M58 76 L65 83" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        {/* Pressure point indicator */}
        <circle cx="52" cy="40" r="4" fill={color} opacity="0.6">
          <animate attributeName="r" values="4;6;4" dur="1s" repeatCount="indefinite"/>
        </circle>
      </svg>
    );
  }
  
  if (name.includes('gokyo')) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,2" opacity="0.3"/>
        {/* Weapon disarm scenario */}
        <circle cx="35" cy="30" r="8" fill={color}/>
        <path d="M35 38 L35 58 M35 45 L25 55 M35 45 L48 40 M35 58 L28 78 M35 58 L42 78" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* Tanto/knife */}
        <rect x="55" y="35" width="18" height="4" rx="1" fill="#94a3b8" transform="rotate(30 64 37)"/>
        {/* Uke with weapon */}
        <circle cx="65" cy="50" r="7" fill="#64748b"/>
        <path d="M65 57 L62 75 M65 53 L75 48" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg>
    );
  }
  
  if (name.includes('shihonage') || name.includes('shiho')) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,2" opacity="0.3"/>
        {/* Four direction arrows */}
        <path d="M50 15 L50 25 M50 75 L50 85 M15 50 L25 50 M75 50 L85 50" stroke={color} strokeWidth="1.5" opacity="0.4"/>
        <polygon points="50,10 45,20 55,20" fill={color} opacity="0.4"/>
        <polygon points="50,90 45,80 55,80" fill={color} opacity="0.4"/>
        {/* Tori throwing */}
        <circle cx="42" cy="35" r="8" fill={color}/>
        <path d="M42 43 L42 60 M42 48 L32 55 M42 48 L55 45 M42 60 L35 78 M42 60 L50 78" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* Uke being thrown */}
        <circle cx="62" cy="58" r="7" fill="#64748b"/>
        <path d="M62 65 L68 80 M62 60 L55 52 M68 80 L75 85" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg>
    );
  }
  
  if (name.includes('kotegaeshi') || name.includes('kote')) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,2" opacity="0.3"/>
        {/* Wrist turn indicator */}
        <path d="M45 45 Q55 40 60 50 Q55 60 45 55" fill="none" stroke={color} strokeWidth="2" opacity="0.5">
          <animate attributeName="stroke-dasharray" values="0,50;50,0" dur="1.5s" repeatCount="indefinite"/>
        </path>
        {/* Tori */}
        <circle cx="35" cy="32" r="8" fill={color}/>
        <path d="M35 40 L35 60 M35 47 L25 55 M35 47 L50 45 M35 60 L28 78 M35 60 L42 78" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* Uke falling backward */}
        <circle cx="65" cy="55" r="7" fill="#64748b"/>
        <path d="M65 62 L70 78 M65 58 L58 52 M70 78 L78 82" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg>
    );
  }
  
  if (name.includes('irimi')) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,2" opacity="0.3"/>
        {/* Entry movement arrow */}
        <path d="M25 70 Q40 50 55 35" stroke={color} strokeWidth="2" fill="none" opacity="0.5">
          <animate attributeName="stroke-dashoffset" from="50" to="0" dur="1s" repeatCount="indefinite"/>
        </path>
        <polygon points="58,32 48,38 52,42" fill={color} opacity="0.5"/>
        {/* Tori entering */}
        <circle cx="45" cy="40" r="8" fill={color}/>
        <path d="M45 48 L45 65 M45 52 L35 60 M45 52 L58 48 M45 65 L38 82 M45 65 L52 82" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* Uke */}
        <circle cx="62" cy="35" r="7" fill="#64748b"/>
        <path d="M62 42 L60 58 M62 45 L72 42" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg>
    );
  }
  
  if (name.includes('koshi')) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,2" opacity="0.3"/>
        {/* Tori - hip throw position */}
        <circle cx="40" cy="35" r="8" fill={color}/>
        <path d="M40 43 L40 60 M40 50 L30 58 M40 50 L55 52 M40 60 L32 78 M40 60 L48 78" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* Uke being thrown over hip */}
        <circle cx="55" cy="48" r="7" fill="#64748b"/>
        <path d="M55 55 L65 72 M58 50 L48 45" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        {/* Arc trajectory */}
        <path d="M55 48 Q70 35 75 55" stroke="#64748b" strokeWidth="1" fill="none" strokeDasharray="3,3" opacity="0.5"/>
      </svg>
    );
  }
  
  if (name.includes('kokyu')) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,2" opacity="0.3"/>
        {/* Breath/energy flow */}
        <path d="M30 50 Q50 30 70 50 Q50 70 30 50" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4">
          <animate attributeName="stroke-dasharray" values="0,200;100,100" dur="2s" repeatCount="indefinite"/>
        </path>
        {/* Tori */}
        <circle cx="40" cy="38" r="8" fill={color}/>
        <path d="M40 46 L40 65 M40 52 L30 60 M40 52 L55 50 M40 65 L32 82 M40 65 L48 82" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* Uke */}
        <circle cx="62" cy="52" r="7" fill="#64748b"/>
        <path d="M62 59 L65 75 M62 55 L72 50" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg>
    );
  }
  
  if (name.includes('kaiten')) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,2" opacity="0.3"/>
        {/* Rotation indicator */}
        <path d="M50 20 A30 30 0 0 1 80 50" fill="none" stroke={color} strokeWidth="2" opacity="0.4">
          <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="3s" repeatCount="indefinite"/>
        </path>
        {/* Tori rotating */}
        <circle cx="40" cy="35" r="8" fill={color}/>
        <path d="M40 43 L40 62 M40 50 L28 58 M40 50 L55 48 M40 62 L32 80 M40 62 L48 80" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* Uke */}
        <circle cx="60" cy="55" r="7" fill="#64748b"/>
        <path d="M60 62 L65 78 M60 58 L52 52" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg>
    );
  }
  
  if (name.includes('tenchi') || name.includes('heaven')) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,2" opacity="0.3"/>
        {/* Heaven arrow up */}
        <path d="M30 30 L30 15" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
        <polygon points="30,10 25,20 35,20" fill="#f59e0b"/>
        {/* Earth arrow down */}
        <path d="M70 70 L70 85" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
        <polygon points="70,90 65,80 75,80" fill="#22c55e"/>
        {/* Tori in center */}
        <circle cx="50" cy="45" r="8" fill={color}/>
        <path d="M50 53 L50 68 M50 58 L40 65 M50 58 L60 65 M50 68 L42 85 M50 68 L58 85" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
      </svg>
    );
  }

  if (name.includes('ushiro')) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,2" opacity="0.3"/>
        {/* Rear attack indicator */}
        <path d="M75 50 L60 50" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" opacity="0.6">
          <animate attributeName="stroke-dashoffset" from="8" to="0" dur="0.5s" repeatCount="indefinite"/>
        </path>
        {/* Tori - front */}
        <circle cx="40" cy="40" r="8" fill={color}/>
        <path d="M40 48 L40 65 M40 55 L30 62 M40 55 L50 60 M40 65 L32 82 M40 65 L48 82" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* Uke - behind */}
        <circle cx="65" cy="45" r="7" fill="#64748b"/>
        <path d="M65 52 L62 68 M65 48 L72 42" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg>
    );
  }
  
  // Default aikido symbol
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,2" opacity="0.3"/>
      <circle cx="50" cy="50" r="25" fill="none" stroke={color} strokeWidth="2"/>
      <circle cx="50" cy="50" r="8" fill={color}/>
      <path d="M50 25 L50 75 M25 50 L75 50" stroke={color} strokeWidth="2" opacity="0.5"/>
    </svg>
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

// Technique Modal
const TechniqueModal = ({ technique, kyu, isOpen, onClose, onPractice, onUpdateMastery }) => {
  if (!technique) return null;
  const mastery = MASTERY_LEVELS[technique.mastery_level] || MASTERY_LEVELS.not_started;
  const beltColor = getBeltColor(kyu?.order || 6);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">{mastery.emoji}</span>
            {technique.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 py-3">
          {/* Illustration */}
          <div className="flex justify-center p-6 rounded-xl" style={{ backgroundColor: beltColor.bg }}>
            <TechniqueIllustration technique={technique.name} color={beltColor.text} size={150} />
          </div>
          
          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg p-3 border-2" style={{ borderColor: beltColor.border, backgroundColor: `${beltColor.bg}50` }}>
              <p className="text-xs text-gray-500 mb-1">Sessions</p>
              <p className="text-2xl font-bold" style={{ color: beltColor.text }}>{technique.practice_count}</p>
            </div>
            <div className="rounded-lg p-3 border-2" style={{ borderColor: beltColor.border, backgroundColor: `${beltColor.bg}50` }}>
              <p className="text-xs text-gray-500 mb-1">Niveau</p>
              <p className="text-2xl font-bold" style={{ color: beltColor.text }}>{kyu?.name}</p>
            </div>
          </div>
          
          {/* Description */}
          {technique.description && (
            <div className="bg-gray-50 rounded-lg p-4 border">
              <p className="text-sm text-gray-600">{technique.description}</p>
            </div>
          )}
          
          {/* Mastery selector */}
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(MASTERY_LEVELS).map(([key, level]) => (
              <button
                key={key}
                onClick={() => onUpdateMastery(key)}
                className={`p-2.5 rounded-lg border-2 flex items-center gap-2 transition-all ${
                  technique.mastery_level === key 
                    ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-xl">{level.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{level.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Fermer</Button></DialogClose>
          <Button onClick={onPractice} className="bg-emerald-500 hover:bg-emerald-600">
            <Play className="w-4 h-4 mr-1" /> Pratiquer
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">合</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Aikido Tracker</h1>
              <p className="text-xs text-gray-500">Programme officiel des grades</p>
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
      <main className="max-w-6xl mx-auto px-4 py-6">
        {kyuLevels.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-12 h-12 text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Bienvenue ! 🥋</h2>
            <p className="text-gray-500">Chargez les données du programme officiel</p>
          </div>
        ) : (
          <div className="space-y-6">
            {kyuLevels.map((kyu) => {
              const progress = calculateKyuProgress(kyu.techniques);
              const beltColor = getBeltColor(kyu.order);
              
              return (
                <Card key={kyu.id} className="overflow-hidden shadow-md border-0" style={{ borderLeft: `4px solid ${beltColor.border}` }}>
                  <CardHeader className="pb-3" style={{ backgroundColor: beltColor.bg }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg shadow" 
                             style={{ backgroundColor: beltColor.border, color: beltColor.text === "#ffffff" ? "#fff" : beltColor.text }}>
                          {kyu.order}
                        </div>
                        <div>
                          <CardTitle className="text-lg" style={{ color: beltColor.text }}>{kyu.name}</CardTitle>
                          <CardDescription style={{ color: `${beltColor.text}99` }}>
                            {kyu.techniques?.length || 0} techniques • {progress}% maîtrisé
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Progress bar */}
                        <div className="w-20 h-2 bg-white/50 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: beltColor.text }}></div>
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
                            <div key={technique.id} className="bg-slate-50 rounded-xl p-3 border hover:shadow-md transition-shadow group">
                              {/* Illustration */}
                              <div className="flex justify-center py-2 mb-2 rounded-lg" style={{ backgroundColor: `${beltColor.bg}` }}>
                                <TechniqueIllustration technique={technique.name} color={beltColor.text} size={70} />
                              </div>
                              
                              {/* Content */}
                              <h4 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2">{technique.name}</h4>
                              
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className={`${mastery.color} text-xs`}>
                                  {mastery.emoji} {mastery.label}
                                </Badge>
                                <span className="text-xs text-gray-400">{technique.practice_count} sess.</span>
                              </div>
                              
                              {/* Buttons */}
                              <div className="flex gap-1.5">
                                <Button size="sm" className="flex-1 h-8 text-xs bg-indigo-500 hover:bg-indigo-600" 
                                        onClick={() => setViewTechniqueData({ technique, kyu, isOpen: true })}>
                                  <Eye className="w-3 h-3 mr-1" /> Voir
                                </Button>
                                <Button size="sm" className="h-8 bg-emerald-500 hover:bg-emerald-600" onClick={() => handlePractice(kyu.id, technique.id)}>
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
