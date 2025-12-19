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

// Default GIF for techniques without specific images
const DEFAULT_GIF = "https://media.tenor.com/P22Z3iyIhQAAAAAM/aikido-master.gif";

// Realistic Aikido GIF illustration component with fallback
const TechniqueIllustration = ({ technique, imageUrl, size = 100 }) => {
  const [imgSrc, setImgSrc] = React.useState(imageUrl || DEFAULT_GIF);
  const [hasError, setHasError] = React.useState(false);
  
  React.useEffect(() => {
    setImgSrc(imageUrl || DEFAULT_GIF);
    setHasError(false);
  }, [imageUrl]);
  
  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(DEFAULT_GIF);
    }
  };
  
  return (
    <div 
      className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner"
      style={{ width: size, height: size }}
    >
      <img
        src={imgSrc}
        alt={technique}
        className="w-full h-full object-cover"
        onError={handleError}
        loading="lazy"
      />
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
          {/* Illustration GIF */}
          <div className="flex justify-center p-6 rounded-xl" style={{ backgroundColor: beltColor.bg }}>
            <TechniqueIllustration technique={technique.name} imageUrl={technique.image_url} size={180} />
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
                              {/* Illustration GIF */}
                              <div className="flex justify-center py-2 mb-2 rounded-lg" style={{ backgroundColor: `${beltColor.bg}` }}>
                                <TechniqueIllustration technique={technique.name} imageUrl={technique.image_url} size={80} />
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
