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
import { Plus, Trash2, Edit2, Target, Award, Circle, Play, BookOpen, Eye, Sparkles, Star, Zap, Trophy } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Mastery level configuration with vibrant colors
const MASTERY_LEVELS = {
  not_started: { 
    label: "Non démarré", 
    color: "bg-slate-500/20 text-slate-300 border-slate-500/30", 
    bgGradient: "from-slate-600 to-slate-700",
    icon: Circle, 
    progress: 0,
    emoji: "⚪"
  },
  learning: { 
    label: "En apprentissage", 
    color: "bg-blue-500/20 text-blue-300 border-blue-500/30", 
    bgGradient: "from-blue-500 to-cyan-500",
    icon: BookOpen, 
    progress: 33,
    emoji: "📖"
  },
  practiced: { 
    label: "Pratiqué", 
    color: "bg-amber-500/20 text-amber-300 border-amber-500/30", 
    bgGradient: "from-amber-500 to-orange-500",
    icon: Target, 
    progress: 66,
    emoji: "🎯"
  },
  mastered: { 
    label: "Maîtrisé", 
    color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", 
    bgGradient: "from-emerald-500 to-green-500",
    icon: Award, 
    progress: 100,
    emoji: "🏆"
  }
};

// Kyu colors for visual hierarchy
const KYU_COLORS = [
  { value: "#f97316", label: "Orange", gradient: "from-orange-500 to-red-500" },
  { value: "#eab308", label: "Jaune", gradient: "from-yellow-400 to-amber-500" },
  { value: "#22c55e", label: "Vert", gradient: "from-green-500 to-emerald-500" },
  { value: "#3b82f6", label: "Bleu", gradient: "from-blue-500 to-indigo-500" },
  { value: "#8b5cf6", label: "Violet", gradient: "from-violet-500 to-purple-500" },
  { value: "#6366f1", label: "Indigo", gradient: "from-indigo-500 to-blue-600" },
  { value: "#ec4899", label: "Rose", gradient: "from-pink-500 to-rose-500" },
  { value: "#14b8a6", label: "Turquoise", gradient: "from-teal-500 to-cyan-500" }
];

// Technique Detail Modal Component
const TechniqueModal = ({ technique, kyu, isOpen, onClose, onPractice, onUpdateMastery }) => {
  if (!technique) return null;
  
  const mastery = MASTERY_LEVELS[technique.mastery_level] || MASTERY_LEVELS.not_started;
  const MasteryIcon = mastery.icon;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">{mastery.emoji}</span>
            {technique.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Large Image */}
          {technique.image_url && (
            <div className="relative rounded-xl overflow-hidden group">
              <img 
                src={technique.image_url.replace('w=400', 'w=800')} 
                alt={technique.name}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <Badge 
                className={`absolute bottom-4 left-4 ${mastery.color} text-lg px-4 py-2`}
              >
                <MasteryIcon className="w-5 h-5 mr-2" />
                {mastery.label}
              </Badge>
            </div>
          )}
          
          {/* Description */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Description
            </h4>
            <p className="text-slate-300 leading-relaxed">
              {technique.description || "Aucune description disponible pour cette technique."}
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
              <div className="flex items-center gap-2 text-purple-300 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Sessions</span>
              </div>
              <p className="text-3xl font-bold text-white">{technique.practice_count}</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-4 border border-cyan-500/30">
              <div className="flex items-center gap-2 text-cyan-300 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">Niveau</span>
              </div>
              <p className="text-3xl font-bold text-white">{kyu?.name}</p>
            </div>
          </div>
          
          {/* Mastery Selector */}
          <div className="space-y-3">
            <Label className="text-white font-medium">Changer le niveau de maîtrise</Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(MASTERY_LEVELS).map(([key, level]) => (
                <button
                  key={key}
                  onClick={() => onUpdateMastery(key)}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 ${
                    technique.mastery_level === key 
                      ? `bg-gradient-to-r ${level.bgGradient} border-white/50 scale-105` 
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <span className="text-2xl">{level.emoji}</span>
                  <span className="text-white font-medium">{level.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="border-slate-600 text-slate-300">
              Fermer
            </Button>
          </DialogClose>
          <Button 
            onClick={onPractice}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold"
          >
            <Play className="w-4 h-4 mr-2" />
            Pratiquer maintenant
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

  // Fetch all kyu levels
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

  // Seed initial data
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

  // Create new kyu level
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
      toast.success("Niveau kyu créé avec succès ! 🥋");
    } catch (error) {
      console.error("Error creating kyu level:", error);
      toast.error("Erreur lors de la création");
    }
  };

  // Delete kyu level
  const handleDeleteKyu = async (kyuId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce niveau ?")) return;
    try {
      await axios.delete(`${API}/kyu-levels/${kyuId}`);
      await fetchKyuLevels();
      toast.success("Niveau kyu supprimé");
    } catch (error) {
      console.error("Error deleting kyu level:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  // Add technique to kyu level
  const handleAddTechnique = async () => {
    if (!newTechnique.name) {
      toast.error("Veuillez entrer un nom de technique");
      return;
    }
    try {
      await axios.post(`${API}/kyu-levels/${selectedKyuId}/techniques`, newTechnique);
      setNewTechnique({ name: "", description: "", image_url: "" });
      setTechniqueDialogOpen(false);
      await fetchKyuLevels();
      toast.success("Technique ajoutée ! ✨");
    } catch (error) {
      console.error("Error adding technique:", error);
      toast.error("Erreur lors de l'ajout");
    }
  };

  // Update technique mastery level
  const handleUpdateMastery = async (kyuId, techniqueId, newLevel) => {
    try {
      await axios.put(`${API}/kyu-levels/${kyuId}/techniques/${techniqueId}`, {
        mastery_level: newLevel
      });
      await fetchKyuLevels();
      toast.success(`Niveau mis à jour : ${MASTERY_LEVELS[newLevel].emoji} ${MASTERY_LEVELS[newLevel].label}`);
    } catch (error) {
      console.error("Error updating mastery:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  // Record practice session
  const handlePractice = async (kyuId, techniqueId) => {
    try {
      await axios.post(`${API}/kyu-levels/${kyuId}/techniques/${techniqueId}/practice`);
      await fetchKyuLevels();
      toast.success("Session enregistrée ! 💪 Continue comme ça !");
    } catch (error) {
      console.error("Error recording practice:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  // Delete technique
  const handleDeleteTechnique = async (kyuId, techniqueId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette technique ?")) return;
    try {
      await axios.delete(`${API}/kyu-levels/${kyuId}/techniques/${techniqueId}`);
      await fetchKyuLevels();
      toast.success("Technique supprimée");
    } catch (error) {
      console.error("Error deleting technique:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  // Update technique details
  const handleUpdateTechnique = async () => {
    if (!editingTechnique) return;
    try {
      await axios.put(
        `${API}/kyu-levels/${editingTechnique.kyuId}/techniques/${editingTechnique.id}`,
        {
          name: editingTechnique.name,
          description: editingTechnique.description
        }
      );
      setEditTechniqueDialogOpen(false);
      setEditingTechnique(null);
      await fetchKyuLevels();
      toast.success("Technique mise à jour ! ✅");
    } catch (error) {
      console.error("Error updating technique:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  // Calculate overall progress for a kyu level
  const calculateKyuProgress = (techniques) => {
    if (!techniques || techniques.length === 0) return 0;
    const totalProgress = techniques.reduce((sum, tech) => {
      return sum + (MASTERY_LEVELS[tech.mastery_level]?.progress || 0);
    }, 0);
    return Math.round(totalProgress / techniques.length);
  };

  // Open technique view modal
  const openTechniqueModal = (technique, kyu) => {
    setViewTechniqueData({ technique, kyu, isOpen: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      <Toaster position="top-right" richColors />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25 animate-pulse">
                  <span className="text-white font-bold text-2xl">合</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent" data-testid="app-title">
                  Aikido Tracker
                </h1>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  Suivez votre progression
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {kyuLevels.length === 0 && (
                <Button 
                  onClick={seedData} 
                  variant="outline" 
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400"
                  data-testid="seed-data-btn"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Charger données
                </Button>
              )}
              <Dialog open={kyuDialogOpen} onOpenChange={setKyuDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg shadow-red-500/25" data-testid="add-kyu-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter Kyu
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white text-xl flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                      Ajouter un niveau Kyu
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Nom du niveau</Label>
                      <Input
                        placeholder="ex: 4e kyu"
                        value={newKyu.name}
                        onChange={(e) => setNewKyu({ ...newKyu, name: e.target.value })}
                        className="bg-slate-800 border-slate-600 text-white focus:border-purple-500"
                        data-testid="kyu-name-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Ordre (numéro)</Label>
                      <Input
                        type="number"
                        placeholder="ex: 4"
                        value={newKyu.order}
                        onChange={(e) => setNewKyu({ ...newKyu, order: e.target.value })}
                        className="bg-slate-800 border-slate-600 text-white focus:border-purple-500"
                        data-testid="kyu-order-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Couleur</Label>
                      <Select value={newKyu.color} onValueChange={(value) => setNewKyu({ ...newKyu, color: value })}>
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white" data-testid="kyu-color-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {KYU_COLORS.map((color) => (
                            <SelectItem key={color.value} value={color.value} className="text-white hover:bg-slate-700">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${color.gradient}`} />
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">URL de l'image (optionnel)</Label>
                      <Input
                        placeholder="https://..."
                        value={newKyu.image_url}
                        onChange={(e) => setNewKyu({ ...newKyu, image_url: e.target.value })}
                        className="bg-slate-800 border-slate-600 text-white focus:border-purple-500"
                        data-testid="kyu-image-input"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="border-slate-600 text-slate-300">Annuler</Button>
                    </DialogClose>
                    <Button onClick={handleCreateKyu} className="bg-gradient-to-r from-green-500 to-emerald-500" data-testid="confirm-add-kyu-btn">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Créer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {kyuLevels.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/25 animate-bounce">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Bienvenue sur Aikido Tracker ! 🥋</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Commencez votre voyage en chargeant les données initiales ou créez votre premier niveau kyu.
            </p>
          </div>
        ) : (
          <div className="space-y-8" data-testid="kyu-levels-container">
            {kyuLevels.map((kyu) => {
              const progress = calculateKyuProgress(kyu.techniques);
              const colorConfig = KYU_COLORS.find(c => c.value === kyu.color) || KYU_COLORS[0];
              
              return (
                <Card key={kyu.id} className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 overflow-hidden hover:border-slate-600 transition-all duration-300" data-testid={`kyu-card-${kyu.id}`}>
                  {/* Kyu Level Header with Image */}
                  <div className="relative">
                    {kyu.image_url && (
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={kyu.image_url} 
                          alt={kyu.name}
                          className="w-full h-full object-cover opacity-30"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-r ${colorConfig.gradient} opacity-20`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                      </div>
                    )}
                    <CardHeader className={`${kyu.image_url ? 'absolute bottom-0 left-0 right-0' : ''} border-l-4`} style={{ borderLeftColor: kyu.color }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg bg-gradient-to-br ${colorConfig.gradient}`}
                            style={{ boxShadow: `0 10px 40px ${kyu.color}40` }}
                          >
                            {kyu.order}
                          </div>
                          <div>
                            <CardTitle className="text-white text-2xl font-bold" data-testid={`kyu-title-${kyu.id}`}>
                              {kyu.name}
                            </CardTitle>
                            <CardDescription className="text-slate-300 flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-400" />
                              {kyu.techniques?.length || 0} techniques
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {/* Progress Circle */}
                          <div className="relative w-16 h-16">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" className="text-slate-700" strokeWidth="4" />
                              <circle 
                                cx="32" cy="32" r="28" 
                                fill="none" 
                                stroke={kyu.color}
                                strokeWidth="4"
                                strokeDasharray={175.93}
                                strokeDashoffset={175.93 * (1 - progress / 100)}
                                strokeLinecap="round"
                                className="transition-all duration-500"
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
                              {progress}%
                            </span>
                          </div>
                          <Dialog open={techniqueDialogOpen && selectedKyuId === kyu.id} onOpenChange={(open) => {
                            setTechniqueDialogOpen(open);
                            if (open) setSelectedKyuId(kyu.id);
                          }}>
                            <DialogTrigger asChild>
                              <Button size="sm" className={`bg-gradient-to-r ${colorConfig.gradient} text-white shadow-lg`} data-testid={`add-technique-btn-${kyu.id}`}>
                                <Plus className="w-4 h-4 mr-1" />
                                Technique
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                              <DialogHeader>
                                <DialogTitle className="text-white">Ajouter une technique à {kyu.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label className="text-slate-300">Nom de la technique</Label>
                                  <Input
                                    placeholder="ex: Katate dori – yonkyo"
                                    value={newTechnique.name}
                                    onChange={(e) => setNewTechnique({ ...newTechnique, name: e.target.value })}
                                    className="bg-slate-800 border-slate-600 text-white"
                                    data-testid="technique-name-input"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-slate-300">Description (optionnel)</Label>
                                  <Textarea
                                    placeholder="Description de la technique..."
                                    value={newTechnique.description}
                                    onChange={(e) => setNewTechnique({ ...newTechnique, description: e.target.value })}
                                    className="bg-slate-800 border-slate-600 text-white"
                                    data-testid="technique-description-input"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-slate-300">URL de l'image (optionnel)</Label>
                                  <Input
                                    placeholder="https://..."
                                    value={newTechnique.image_url}
                                    onChange={(e) => setNewTechnique({ ...newTechnique, image_url: e.target.value })}
                                    className="bg-slate-800 border-slate-600 text-white"
                                    data-testid="technique-image-input"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline" className="border-slate-600 text-slate-300">Annuler</Button>
                                </DialogClose>
                                <Button onClick={handleAddTechnique} className={`bg-gradient-to-r ${colorConfig.gradient}`} data-testid="confirm-add-technique-btn">Ajouter</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            onClick={() => handleDeleteKyu(kyu.id)}
                            data-testid={`delete-kyu-btn-${kyu.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </div>
                  
                  <CardContent className="p-6">
                    {(!kyu.techniques || kyu.techniques.length === 0) ? (
                      <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                        <p className="text-slate-500">Aucune technique dans ce niveau</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {kyu.techniques.map((technique) => {
                          const mastery = MASTERY_LEVELS[technique.mastery_level] || MASTERY_LEVELS.not_started;
                          const MasteryIcon = mastery.icon;
                          
                          return (
                            <div
                              key={technique.id}
                              className="group bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
                              data-testid={`technique-card-${technique.id}`}
                            >
                              {/* Technique Image */}
                              <div className="relative h-36 overflow-hidden">
                                {technique.image_url ? (
                                  <img 
                                    src={technique.image_url} 
                                    alt={technique.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className={`w-full h-full bg-gradient-to-br ${colorConfig.gradient} opacity-30`} />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                                
                                {/* Mastery Badge */}
                                <div className="absolute top-3 right-3">
                                  <span className="text-2xl">{mastery.emoji}</span>
                                </div>
                                
                                {/* Practice Count */}
                                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                  <Badge className="bg-black/50 backdrop-blur-sm text-white border-0">
                                    <Zap className="w-3 h-3 mr-1 text-yellow-400" />
                                    {technique.practice_count} sessions
                                  </Badge>
                                </div>
                              </div>
                              
                              {/* Content */}
                              <div className="p-4 space-y-3">
                                <h4 className="text-white font-semibold line-clamp-2" data-testid={`technique-name-${technique.id}`}>
                                  {technique.name}
                                </h4>
                                
                                <Badge variant="outline" className={`${mastery.color} border`} data-testid={`technique-mastery-${technique.id}`}>
                                  <MasteryIcon className="w-3 h-3 mr-1" />
                                  {mastery.label}
                                </Badge>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                  {/* VOIR TECHNIQUE BUTTON */}
                                  <Button
                                    size="sm"
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
                                    onClick={() => openTechniqueModal(technique, kyu)}
                                    data-testid={`view-technique-btn-${technique.id}`}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Voir technique
                                  </Button>
                                  
                                  <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                    onClick={() => handlePractice(kyu.id, technique.id)}
                                    data-testid={`practice-btn-${technique.id}`}
                                  >
                                    <Play className="w-4 h-4" />
                                  </Button>
                                  
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-slate-400 hover:text-white hover:bg-slate-700"
                                    onClick={() => {
                                      setEditingTechnique({ ...technique, kyuId: kyu.id });
                                      setEditTechniqueDialogOpen(true);
                                    }}
                                    data-testid={`edit-technique-btn-${technique.id}`}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                    onClick={() => handleDeleteTechnique(kyu.id, technique.id)}
                                    data-testid={`delete-technique-btn-${technique.id}`}
                                  >
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

      {/* Technique View Modal */}
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
          // Update local state
          setViewTechniqueData(prev => ({
            ...prev,
            technique: { ...prev.technique, mastery_level: level }
          }));
        }}
      />

      {/* Edit Technique Dialog */}
      <Dialog open={editTechniqueDialogOpen} onOpenChange={setEditTechniqueDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier la technique</DialogTitle>
          </DialogHeader>
          {editingTechnique && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Nom de la technique</Label>
                <Input
                  value={editingTechnique.name}
                  onChange={(e) => setEditingTechnique({ ...editingTechnique, name: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white"
                  data-testid="edit-technique-name-input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Description</Label>
                <Textarea
                  value={editingTechnique.description || ""}
                  onChange={(e) => setEditingTechnique({ ...editingTechnique, description: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white"
                  data-testid="edit-technique-description-input"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-slate-600 text-slate-300">Annuler</Button>
            </DialogClose>
            <Button onClick={handleUpdateTechnique} className="bg-gradient-to-r from-green-500 to-emerald-500" data-testid="confirm-edit-technique-btn">
              <Sparkles className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-800 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-400 flex items-center justify-center gap-2">
              <span className="text-2xl">🥋</span>
              Aikido Tracker - Suivez votre progression sur le chemin de l'harmonie
              <span className="text-2xl">✨</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
