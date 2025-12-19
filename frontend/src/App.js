import { useEffect, useState, useCallback } from "react";
import "@/App.css";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster, toast } from "sonner";
import { Plus, Trash2, Edit2, Target, Award, Circle, Play, BookOpen, Eye, Star, Zap } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Dynamic SVG Illustrations for techniques
const AikidoIllustrations = {
  ikkyo: ({ color = "#f97316", size = 120 }) => (
    <svg viewBox="0 0 200 200" width={size} height={size} className="drop-shadow-lg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#fff", stopOpacity: 0.8 }} />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill={`${color}20`} stroke={color} strokeWidth="3"/>
      {/* Standing figure */}
      <circle cx="70" cy="50" r="12" fill={color} />
      <path d="M70 62 L70 100 M70 75 L50 95 M70 75 L90 60 M70 100 L55 130 M70 100 L85 130" 
            stroke={color} strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Kneeling figure */}
      <circle cx="130" cy="80" r="10" fill="#3b82f6" />
      <path d="M130 90 L130 110 M130 95 L145 105 M130 95 L115 100 M130 110 L120 130 M130 110 L140 125" 
            stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Motion lines */}
      <path d="M85 55 Q100 45 115 55" stroke={color} strokeWidth="2" fill="none" strokeDasharray="4,4">
        <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1s" repeatCount="indefinite"/>
      </path>
    </svg>
  ),
  nikyo: ({ color = "#eab308", size = 120 }) => (
    <svg viewBox="0 0 200 200" width={size} height={size} className="drop-shadow-lg">
      <circle cx="100" cy="100" r="90" fill={`${color}20`} stroke={color} strokeWidth="3"/>
      {/* Tori */}
      <circle cx="80" cy="55" r="12" fill={color} />
      <path d="M80 67 L80 105 M80 80 L60 70 M80 80 L100 75 M80 105 L65 135 M80 105 L95 135" 
            stroke={color} strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Uke with wrist lock */}
      <circle cx="120" cy="85" r="10" fill="#ec4899" />
      <path d="M120 95 L120 115 M120 100 L105 90 M120 115 L110 140 M120 115 L130 135" 
            stroke="#ec4899" strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Wrist connection */}
      <ellipse cx="100" cy="78" rx="15" ry="8" fill="none" stroke={color} strokeWidth="2">
        <animate attributeName="rx" values="15;18;15" dur="1.5s" repeatCount="indefinite"/>
      </ellipse>
    </svg>
  ),
  sankyo: ({ color = "#22c55e", size = 120 }) => (
    <svg viewBox="0 0 200 200" width={size} height={size} className="drop-shadow-lg">
      <circle cx="100" cy="100" r="90" fill={`${color}20`} stroke={color} strokeWidth="3"/>
      {/* Spiral motion */}
      <path d="M100 40 Q140 60 130 100 Q120 140 80 130 Q40 120 60 80" 
            fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
        <animate attributeName="stroke-dasharray" values="0,300;300,0" dur="2s" repeatCount="indefinite"/>
      </path>
      {/* Tori */}
      <circle cx="90" cy="60" r="12" fill={color} />
      <path d="M90 72 L90 110 M90 85 L70 75 M90 85 L110 80 M90 110 L75 140 M90 110 L105 140" 
            stroke={color} strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Uke */}
      <circle cx="115" cy="100" r="10" fill="#8b5cf6" />
      <path d="M115 110 L115 130 M115 115 L130 125 M115 130 L105 150 M115 130 L125 145" 
            stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  tenchinage: ({ color = "#3b82f6", size = 120 }) => (
    <svg viewBox="0 0 200 200" width={size} height={size} className="drop-shadow-lg">
      <circle cx="100" cy="100" r="90" fill={`${color}20`} stroke={color} strokeWidth="3"/>
      {/* Heaven arrow */}
      <path d="M100 30 L100 70" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round">
        <animate attributeName="y1" values="30;25;30" dur="1s" repeatCount="indefinite"/>
      </path>
      <polygon points="100,20 90,35 110,35" fill="#f59e0b">
        <animate attributeName="points" values="100,20 90,35 110,35;100,15 90,30 110,30;100,20 90,35 110,35" dur="1s" repeatCount="indefinite"/>
      </polygon>
      {/* Earth arrow */}
      <path d="M100 130 L100 170" stroke="#22c55e" strokeWidth="4" strokeLinecap="round">
        <animate attributeName="y2" values="170;175;170" dur="1s" repeatCount="indefinite"/>
      </path>
      <polygon points="100,180 90,165 110,165" fill="#22c55e">
        <animate attributeName="points" values="100,180 90,165 110,165;100,185 90,170 110,170;100,180 90,165 110,165" dur="1s" repeatCount="indefinite"/>
      </polygon>
      {/* Center figure */}
      <circle cx="100" cy="85" r="12" fill={color} />
      <path d="M100 97 L100 125 M100 105 L80 90 M100 105 L120 90" 
            stroke={color} strokeWidth="4" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  yokomen: ({ color = "#8b5cf6", size = 120 }) => (
    <svg viewBox="0 0 200 200" width={size} height={size} className="drop-shadow-lg">
      <circle cx="100" cy="100" r="90" fill={`${color}20`} stroke={color} strokeWidth="3"/>
      {/* Diagonal strike line */}
      <path d="M40 40 Q100 80 160 40" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round">
        <animate attributeName="d" values="M40 40 Q100 80 160 40;M40 50 Q100 70 160 50;M40 40 Q100 80 160 40" dur="1.5s" repeatCount="indefinite"/>
      </path>
      {/* Attacker */}
      <circle cx="60" cy="70" r="12" fill="#ef4444" />
      <path d="M60 82 L60 115 M60 90 L45 80 M60 90 L80 70 M60 115 L50 145 M60 115 L70 145" 
            stroke="#ef4444" strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Defender */}
      <circle cx="130" cy="80" r="12" fill={color} />
      <path d="M130 92 L130 125 M130 100 L115 90 M130 100 L145 95 M130 125 L120 150 M130 125 L140 150" 
            stroke={color} strokeWidth="4" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  shomen: ({ color = "#14b8a6", size = 120 }) => (
    <svg viewBox="0 0 200 200" width={size} height={size} className="drop-shadow-lg">
      <circle cx="100" cy="100" r="90" fill={`${color}20`} stroke={color} strokeWidth="3"/>
      {/* Vertical strike */}
      <path d="M100 20 L100 60" stroke="#ef4444" strokeWidth="4" strokeLinecap="round">
        <animate attributeName="y2" values="60;70;60" dur="0.8s" repeatCount="indefinite"/>
      </path>
      <polygon points="100,15 92,30 108,30" fill="#ef4444"/>
      {/* Attacker */}
      <circle cx="100" cy="75" r="12" fill="#ef4444" />
      <path d="M100 87 L100 120 M100 95 L85 85 M100 95 L115 85 M100 120 L90 145 M100 120 L110 145" 
            stroke="#ef4444" strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Block motion */}
      <path d="M70 90 Q100 70 130 90" fill="none" stroke={color} strokeWidth="3" strokeDasharray="5,5">
        <animate attributeName="stroke-dashoffset" from="10" to="0" dur="0.5s" repeatCount="indefinite"/>
      </path>
    </svg>
  ),
  default: ({ color = "#6366f1", size = 120 }) => (
    <svg viewBox="0 0 200 200" width={size} height={size} className="drop-shadow-lg">
      <circle cx="100" cy="100" r="90" fill={`${color}20`} stroke={color} strokeWidth="3"/>
      {/* Aikido symbol */}
      <circle cx="100" cy="100" r="40" fill="none" stroke={color} strokeWidth="4"/>
      <path d="M100 60 L100 140 M60 100 L140 100" stroke={color} strokeWidth="3"/>
      <circle cx="100" cy="100" r="15" fill={color}/>
      {/* Rotating decoration */}
      <g>
        <circle cx="100" cy="50" r="5" fill={color}>
          <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="4s" repeatCount="indefinite"/>
        </circle>
      </g>
    </svg>
  )
};

// Function to get illustration based on technique name
const getIllustration = (name, color, size) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('ikkyo')) return <AikidoIllustrations.ikkyo color={color} size={size} />;
  if (lowerName.includes('nikyo')) return <AikidoIllustrations.nikyo color={color} size={size} />;
  if (lowerName.includes('sankyo')) return <AikidoIllustrations.sankyo color={color} size={size} />;
  if (lowerName.includes('tenchinage')) return <AikidoIllustrations.tenchinage color={color} size={size} />;
  if (lowerName.includes('yokomen')) return <AikidoIllustrations.yokomen color={color} size={size} />;
  if (lowerName.includes('shomen')) return <AikidoIllustrations.shomen color={color} size={size} />;
  return <AikidoIllustrations.default color={color} size={size} />;
};

// Mastery level configuration
const MASTERY_LEVELS = {
  not_started: { label: "Non démarré", color: "bg-gray-100 text-gray-600 border-gray-300", icon: Circle, progress: 0, emoji: "⚪" },
  learning: { label: "En apprentissage", color: "bg-blue-100 text-blue-700 border-blue-300", icon: BookOpen, progress: 33, emoji: "📖" },
  practiced: { label: "Pratiqué", color: "bg-amber-100 text-amber-700 border-amber-300", icon: Target, progress: 66, emoji: "🎯" },
  mastered: { label: "Maîtrisé", color: "bg-green-100 text-green-700 border-green-300", icon: Award, progress: 100, emoji: "🏆" }
};

// Kyu colors
const KYU_COLORS = [
  { value: "#f97316", label: "Orange" },
  { value: "#eab308", label: "Jaune" },
  { value: "#22c55e", label: "Vert" },
  { value: "#3b82f6", label: "Bleu" },
  { value: "#8b5cf6", label: "Violet" },
  { value: "#6366f1", label: "Indigo" },
  { value: "#ec4899", label: "Rose" },
  { value: "#14b8a6", label: "Turquoise" }
];

// Technique Detail Modal
const TechniqueModal = ({ technique, kyu, isOpen, onClose, onPractice, onUpdateMastery }) => {
  if (!technique) return null;
  const mastery = MASTERY_LEVELS[technique.mastery_level] || MASTERY_LEVELS.not_started;
  const MasteryIcon = mastery.icon;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-2 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-3xl">{mastery.emoji}</span>
            {technique.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Illustration */}
          <div className="flex justify-center p-6 rounded-2xl" style={{ backgroundColor: `${kyu?.color}15` }}>
            {getIllustration(technique.name, kyu?.color || "#6366f1", 180)}
          </div>
          
          {/* Description */}
          <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-100">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Description
            </h4>
            <p className="text-gray-600 leading-relaxed">
              {technique.description || "Aucune description disponible pour cette technique."}
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-4 border-2" style={{ borderColor: kyu?.color, backgroundColor: `${kyu?.color}10` }}>
              <div className="flex items-center gap-2 mb-1" style={{ color: kyu?.color }}>
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Sessions</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">{technique.practice_count}</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-200">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">Niveau</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">{kyu?.name}</p>
            </div>
          </div>
          
          {/* Mastery Selector */}
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">Niveau de maîtrise</Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(MASTERY_LEVELS).map(([key, level]) => (
                <button
                  key={key}
                  onClick={() => onUpdateMastery(key)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                    technique.mastery_level === key 
                      ? 'border-indigo-500 bg-indigo-50 scale-105 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span className="text-2xl">{level.emoji}</span>
                  <span className="text-gray-700 font-medium">{level.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Fermer</Button>
          </DialogClose>
          <Button onClick={onPractice} className="bg-green-500 hover:bg-green-600 text-white">
            <Play className="w-4 h-4 mr-2" />
            Pratiquer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function App() {
  const [kyuLevels, setKyuLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKyu, setNewKyu] = useState({ name: "", order: "", color: "#6366f1", image_url: "" });
  const [newTechnique, setNewTechnique] = useState({ name: "", description: "", image_url: "" });
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
      console.error("Error fetching kyu levels:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  }, []);

  const seedData = async () => {
    try {
      await axios.post(`${API}/seed`);
      await fetchKyuLevels();
      toast.success("Données initiales chargées ! 🎉");
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  };

  useEffect(() => {
    fetchKyuLevels();
  }, [fetchKyuLevels]);

  const handleCreateKyu = async () => {
    if (!newKyu.name || !newKyu.order) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    try {
      await axios.post(`${API}/kyu-levels`, {
        name: newKyu.name,
        order: parseInt(newKyu.order),
        color: newKyu.color,
        image_url: newKyu.image_url || null
      });
      setNewKyu({ name: "", order: "", color: "#6366f1", image_url: "" });
      setKyuDialogOpen(false);
      await fetchKyuLevels();
      toast.success("Niveau kyu créé ! 🥋");
    } catch (error) {
      toast.error("Erreur lors de la création");
    }
  };

  const handleDeleteKyu = async (kyuId) => {
    if (!window.confirm("Supprimer ce niveau ?")) return;
    try {
      await axios.delete(`${API}/kyu-levels/${kyuId}`);
      await fetchKyuLevels();
      toast.success("Niveau supprimé");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleAddTechnique = async () => {
    if (!newTechnique.name) {
      toast.error("Veuillez entrer un nom");
      return;
    }
    try {
      await axios.post(`${API}/kyu-levels/${selectedKyuId}/techniques`, newTechnique);
      setNewTechnique({ name: "", description: "", image_url: "" });
      setTechniqueDialogOpen(false);
      await fetchKyuLevels();
      toast.success("Technique ajoutée ! ✨");
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const handleUpdateMastery = async (kyuId, techniqueId, newLevel) => {
    try {
      await axios.put(`${API}/kyu-levels/${kyuId}/techniques/${techniqueId}`, {
        mastery_level: newLevel
      });
      await fetchKyuLevels();
      toast.success(`${MASTERY_LEVELS[newLevel].emoji} ${MASTERY_LEVELS[newLevel].label}`);
    } catch (error) {
      toast.error("Erreur");
    }
  };

  const handlePractice = async (kyuId, techniqueId) => {
    try {
      await axios.post(`${API}/kyu-levels/${kyuId}/techniques/${techniqueId}/practice`);
      await fetchKyuLevels();
      toast.success("Session enregistrée ! 💪");
    } catch (error) {
      toast.error("Erreur");
    }
  };

  const handleDeleteTechnique = async (kyuId, techniqueId) => {
    if (!window.confirm("Supprimer cette technique ?")) return;
    try {
      await axios.delete(`${API}/kyu-levels/${kyuId}/techniques/${techniqueId}`);
      await fetchKyuLevels();
      toast.success("Technique supprimée");
    } catch (error) {
      toast.error("Erreur");
    }
  };

  const handleUpdateTechnique = async () => {
    if (!editingTechnique) return;
    try {
      await axios.put(
        `${API}/kyu-levels/${editingTechnique.kyuId}/techniques/${editingTechnique.id}`,
        { name: editingTechnique.name, description: editingTechnique.description }
      );
      setEditTechniqueDialogOpen(false);
      setEditingTechnique(null);
      await fetchKyuLevels();
      toast.success("Technique mise à jour ! ✅");
    } catch (error) {
      toast.error("Erreur");
    }
  };

  const calculateKyuProgress = (techniques) => {
    if (!techniques || techniques.length === 0) return 0;
    const totalProgress = techniques.reduce((sum, tech) => {
      return sum + (MASTERY_LEVELS[tech.mastery_level]?.progress || 0);
    }, 0);
    return Math.round(totalProgress / techniques.length);
  };

  const openTechniqueModal = (technique, kyu) => {
    setViewTechniqueData({ technique, kyu, isOpen: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-orange-50">
      <Toaster position="top-right" richColors />
      
      {/* Decorative background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-green-200 to-teal-200 rounded-full blur-3xl opacity-20"></div>
      </div>
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b-2 border-indigo-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform">
                  <span className="text-white font-bold text-2xl">合</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800" data-testid="app-title">
                  Aikido Tracker
                </h1>
                <p className="text-gray-500 text-sm">Suivi de progression 🥋</p>
              </div>
            </div>
            <div className="flex gap-3">
              {kyuLevels.length === 0 && (
                <Button onClick={seedData} variant="outline" className="border-2 border-indigo-200 hover:bg-indigo-50" data-testid="seed-data-btn">
                  <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                  Charger données
                </Button>
              )}
              <Dialog open={kyuDialogOpen} onOpenChange={setKyuDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg" data-testid="add-kyu-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter Kyu
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-gray-800">Ajouter un niveau Kyu</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Nom du niveau</Label>
                      <Input placeholder="ex: 4e kyu" value={newKyu.name} onChange={(e) => setNewKyu({ ...newKyu, name: e.target.value })} data-testid="kyu-name-input" />
                    </div>
                    <div className="space-y-2">
                      <Label>Ordre (numéro)</Label>
                      <Input type="number" placeholder="ex: 4" value={newKyu.order} onChange={(e) => setNewKyu({ ...newKyu, order: e.target.value })} data-testid="kyu-order-input" />
                    </div>
                    <div className="space-y-2">
                      <Label>Couleur</Label>
                      <Select value={newKyu.color} onValueChange={(value) => setNewKyu({ ...newKyu, color: value })}>
                        <SelectTrigger data-testid="kyu-color-select"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {KYU_COLORS.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color.value }} />
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
                    <Button onClick={handleCreateKyu} className="bg-green-500 hover:bg-green-600" data-testid="confirm-add-kyu-btn">Créer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {kyuLevels.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6">
              <AikidoIllustrations.default color="#6366f1" size={128} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Bienvenue ! 🥋</h2>
            <p className="text-gray-500 mb-6">Commencez par charger les données ou créez un niveau.</p>
          </div>
        ) : (
          <div className="space-y-8" data-testid="kyu-levels-container">
            {kyuLevels.map((kyu) => {
              const progress = calculateKyuProgress(kyu.techniques);
              
              return (
                <Card key={kyu.id} className="bg-white/80 backdrop-blur-sm border-2 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow" style={{ borderColor: `${kyu.color}40` }} data-testid={`kyu-card-${kyu.id}`}>
                  {/* Colored header band */}
                  <div className="h-2" style={{ backgroundColor: kyu.color }}></div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg" style={{ backgroundColor: kyu.color }}>
                          {kyu.order}
                        </div>
                        <div>
                          <CardTitle className="text-gray-800 text-2xl" data-testid={`kyu-title-${kyu.id}`}>{kyu.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {kyu.techniques?.length || 0} techniques
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* Progress bar */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Progression</p>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: kyu.color }}></div>
                            </div>
                            <span className="font-bold text-gray-800">{progress}%</span>
                          </div>
                        </div>
                        <Dialog open={techniqueDialogOpen && selectedKyuId === kyu.id} onOpenChange={(open) => { setTechniqueDialogOpen(open); if (open) setSelectedKyuId(kyu.id); }}>
                          <DialogTrigger asChild>
                            <Button size="sm" style={{ backgroundColor: kyu.color }} className="text-white hover:opacity-90" data-testid={`add-technique-btn-${kyu.id}`}>
                              <Plus className="w-4 h-4 mr-1" />
                              Technique
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white">
                            <DialogHeader><DialogTitle>Ajouter une technique à {kyu.name}</DialogTitle></DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Nom de la technique</Label>
                                <Input placeholder="ex: Katate dori – yonkyo" value={newTechnique.name} onChange={(e) => setNewTechnique({ ...newTechnique, name: e.target.value })} data-testid="technique-name-input" />
                              </div>
                              <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea placeholder="Description..." value={newTechnique.description} onChange={(e) => setNewTechnique({ ...newTechnique, description: e.target.value })} data-testid="technique-description-input" />
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
                              <Button onClick={handleAddTechnique} style={{ backgroundColor: kyu.color }} data-testid="confirm-add-technique-btn">Ajouter</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteKyu(kyu.id)} data-testid={`delete-kyu-btn-${kyu.id}`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {(!kyu.techniques || kyu.techniques.length === 0) ? (
                      <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400">Aucune technique</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {kyu.techniques.map((technique) => {
                          const mastery = MASTERY_LEVELS[technique.mastery_level] || MASTERY_LEVELS.not_started;
                          const MasteryIcon = mastery.icon;
                          
                          return (
                            <div key={technique.id} className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-lg transition-all group" data-testid={`technique-card-${technique.id}`}>
                              {/* Illustration */}
                              <div className="relative p-4 flex justify-center" style={{ backgroundColor: `${kyu.color}08` }}>
                                {getIllustration(technique.name, kyu.color, 100)}
                                <div className="absolute top-2 right-2">
                                  <span className="text-xl">{mastery.emoji}</span>
                                </div>
                                <div className="absolute bottom-2 left-2">
                                  <Badge variant="outline" className="bg-white/90 text-xs">
                                    <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                                    {technique.practice_count} sessions
                                  </Badge>
                                </div>
                              </div>
                              
                              {/* Content */}
                              <div className="p-4 space-y-3">
                                <h4 className="font-semibold text-gray-800 line-clamp-2" data-testid={`technique-name-${technique.id}`}>
                                  {technique.name}
                                </h4>
                                
                                <Badge variant="outline" className={`${mastery.color} border`} data-testid={`technique-mastery-${technique.id}`}>
                                  <MasteryIcon className="w-3 h-3 mr-1" />
                                  {mastery.label}
                                </Badge>
                                
                                {/* Buttons */}
                                <div className="flex gap-2 pt-2">
                                  <Button size="sm" className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white" onClick={() => openTechniqueModal(technique, kyu)} data-testid={`view-technique-btn-${technique.id}`}>
                                    <Eye className="w-4 h-4 mr-1" />
                                    Voir technique
                                  </Button>
                                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handlePractice(kyu.id, technique.id)} data-testid={`practice-btn-${technique.id}`}>
                                    <Play className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gray-600" onClick={() => { setEditingTechnique({ ...technique, kyuId: kyu.id }); setEditTechniqueDialogOpen(true); }} data-testid={`edit-technique-btn-${technique.id}`}>
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-600" onClick={() => handleDeleteTechnique(kyu.id, technique.id)} data-testid={`delete-technique-btn-${technique.id}`}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
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

      {/* Technique Modal */}
      <TechniqueModal
        technique={viewTechniqueData.technique}
        kyu={viewTechniqueData.kyu}
        isOpen={viewTechniqueData.isOpen}
        onClose={() => setViewTechniqueData({ technique: null, kyu: null, isOpen: false })}
        onPractice={() => {
          handlePractice(viewTechniqueData.kyu?.id, viewTechniqueData.technique?.id);
          setViewTechniqueData({ technique: null, kyu: null, isOpen: false });
        }}
        onUpdateMastery={(level) => {
          handleUpdateMastery(viewTechniqueData.kyu?.id, viewTechniqueData.technique?.id, level);
          setViewTechniqueData(prev => ({ ...prev, technique: { ...prev.technique, mastery_level: level } }));
        }}
      />

      {/* Edit Dialog */}
      <Dialog open={editTechniqueDialogOpen} onOpenChange={setEditTechniqueDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader><DialogTitle>Modifier la technique</DialogTitle></DialogHeader>
          {editingTechnique && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input value={editingTechnique.name} onChange={(e) => setEditingTechnique({ ...editingTechnique, name: e.target.value })} data-testid="edit-technique-name-input" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={editingTechnique.description || ""} onChange={(e) => setEditingTechnique({ ...editingTechnique, description: e.target.value })} data-testid="edit-technique-description-input" />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button onClick={handleUpdateTechnique} className="bg-green-500 hover:bg-green-600" data-testid="confirm-edit-technique-btn">Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-500 flex items-center justify-center gap-2">
            🥋 Aikido Tracker - Le chemin de l'harmonie ✨
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
