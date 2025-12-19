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
import { Plus, Trash2, Edit2, Target, Award, CheckCircle2, Circle, Play, BookOpen } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Mastery level configuration
const MASTERY_LEVELS = {
  not_started: { label: "Non démarré", color: "bg-gray-200 text-gray-700", icon: Circle, progress: 0 },
  learning: { label: "En apprentissage", color: "bg-blue-100 text-blue-700", icon: BookOpen, progress: 33 },
  practiced: { label: "Pratiqué", color: "bg-yellow-100 text-yellow-700", icon: Target, progress: 66 },
  mastered: { label: "Maîtrisé", color: "bg-green-100 text-green-700", icon: Award, progress: 100 }
};

// Kyu colors for visual hierarchy
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

function App() {
  const [kyuLevels, setKyuLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKyu, setNewKyu] = useState({ name: "", order: "", color: "#6366f1" });
  const [newTechnique, setNewTechnique] = useState({ name: "", description: "" });
  const [selectedKyuId, setSelectedKyuId] = useState(null);
  const [editingTechnique, setEditingTechnique] = useState(null);
  const [kyuDialogOpen, setKyuDialogOpen] = useState(false);
  const [techniqueDialogOpen, setTechniqueDialogOpen] = useState(false);
  const [editTechniqueDialogOpen, setEditTechniqueDialogOpen] = useState(false);

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
      toast.success("Données initiales chargées");
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
        color: newKyu.color
      });
      setNewKyu({ name: "", order: "", color: "#6366f1" });
      setKyuDialogOpen(false);
      await fetchKyuLevels();
      toast.success("Niveau kyu créé avec succès");
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
      setNewTechnique({ name: "", description: "" });
      setTechniqueDialogOpen(false);
      await fetchKyuLevels();
      toast.success("Technique ajoutée avec succès");
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
      toast.success("Niveau de maîtrise mis à jour");
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
      toast.success("Session de pratique enregistrée !");
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
      toast.success("Technique mise à jour");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">合</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white" data-testid="app-title">Aikido Practice Tracker</h1>
                <p className="text-slate-400 text-sm">Suivi de progression des techniques</p>
              </div>
            </div>
            <div className="flex gap-2">
              {kyuLevels.length === 0 && (
                <Button onClick={seedData} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700" data-testid="seed-data-btn">
                  Charger données initiales
                </Button>
              )}
              <Dialog open={kyuDialogOpen} onOpenChange={setKyuDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700" data-testid="add-kyu-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter Kyu
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Ajouter un niveau Kyu</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Nom du niveau</Label>
                      <Input
                        placeholder="ex: 4e kyu"
                        value={newKyu.name}
                        onChange={(e) => setNewKyu({ ...newKyu, name: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
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
                        className="bg-slate-700 border-slate-600 text-white"
                        data-testid="kyu-order-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Couleur</Label>
                      <Select value={newKyu.color} onValueChange={(value) => setNewKyu({ ...newKyu, color: value })}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="kyu-color-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {KYU_COLORS.map((color) => (
                            <SelectItem key={color.value} value={color.value} className="text-white hover:bg-slate-600">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="border-slate-600 text-slate-300">Annuler</Button>
                    </DialogClose>
                    <Button onClick={handleCreateKyu} className="bg-red-600 hover:bg-red-700" data-testid="confirm-add-kyu-btn">Créer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {kyuLevels.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Aucun niveau kyu</h2>
            <p className="text-slate-400 mb-6">Commencez par charger les données initiales ou créez un nouveau niveau.</p>
          </div>
        ) : (
          <div className="space-y-6" data-testid="kyu-levels-container">
            {kyuLevels.map((kyu) => (
              <Card key={kyu.id} className="bg-slate-800/50 border-slate-700 overflow-hidden" data-testid={`kyu-card-${kyu.id}`}>
                {/* Kyu Level Header with Image */}
                {kyu.image_url && (
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={kyu.image_url} 
                      alt={kyu.name}
                      className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-transparent" />
                  </div>
                )}
                <CardHeader className={`border-b border-slate-700 ${kyu.image_url ? '-mt-16 relative z-10' : ''}`} style={{ borderLeftWidth: '4px', borderLeftColor: kyu.color }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg"
                        style={{ backgroundColor: kyu.color }}
                      >
                        {kyu.order}
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl" data-testid={`kyu-title-${kyu.id}`}>{kyu.name}</CardTitle>
                        <CardDescription className="text-slate-400">
                          {kyu.techniques?.length || 0} techniques
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-slate-400 text-sm">Progression globale</p>
                        <p className="text-white font-semibold">{calculateKyuProgress(kyu.techniques)}%</p>
                      </div>
                      <Progress value={calculateKyuProgress(kyu.techniques)} className="w-32 h-2" />
                      <Dialog open={techniqueDialogOpen && selectedKyuId === kyu.id} onOpenChange={(open) => {
                        setTechniqueDialogOpen(open);
                        if (open) setSelectedKyuId(kyu.id);
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700" data-testid={`add-technique-btn-${kyu.id}`}>
                            <Plus className="w-4 h-4 mr-1" />
                            Technique
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700">
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
                                className="bg-slate-700 border-slate-600 text-white"
                                data-testid="technique-name-input"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-slate-300">Description (optionnel)</Label>
                              <Textarea
                                placeholder="Description de la technique..."
                                value={newTechnique.description}
                                onChange={(e) => setNewTechnique({ ...newTechnique, description: e.target.value })}
                                className="bg-slate-700 border-slate-600 text-white"
                                data-testid="technique-description-input"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline" className="border-slate-600 text-slate-300">Annuler</Button>
                            </DialogClose>
                            <Button onClick={handleAddTechnique} className="bg-red-600 hover:bg-red-700" data-testid="confirm-add-technique-btn">Ajouter</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => handleDeleteKyu(kyu.id)}
                        data-testid={`delete-kyu-btn-${kyu.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {(!kyu.techniques || kyu.techniques.length === 0) ? (
                    <p className="text-slate-500 text-center py-8">Aucune technique dans ce niveau</p>
                  ) : (
                    <div className="grid gap-3">
                      {kyu.techniques.map((technique) => {
                        const mastery = MASTERY_LEVELS[technique.mastery_level] || MASTERY_LEVELS.not_started;
                        const MasteryIcon = mastery.icon;
                        return (
                          <div
                            key={technique.id}
                            className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between hover:bg-slate-700/70 transition-colors"
                            data-testid={`technique-card-${technique.id}`}
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${mastery.color}`}>
                                <MasteryIcon className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white font-medium" data-testid={`technique-name-${technique.id}`}>{technique.name}</h4>
                                {technique.description && (
                                  <p className="text-slate-400 text-sm mt-1">{technique.description}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2">
                                  <Badge variant="outline" className={mastery.color} data-testid={`technique-mastery-${technique.id}`}>
                                    {mastery.label}
                                  </Badge>
                                  <span className="text-slate-500 text-xs">
                                    {technique.practice_count} pratiques
                                  </span>
                                  {technique.last_practiced && (
                                    <span className="text-slate-500 text-xs">
                                      Dernière: {new Date(technique.last_practiced).toLocaleDateString('fr-FR')}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* Mastery Level Selector */}
                              <Select
                                value={technique.mastery_level}
                                onValueChange={(value) => handleUpdateMastery(kyu.id, technique.id, value)}
                              >
                                <SelectTrigger className="w-40 bg-slate-600 border-slate-500 text-white text-sm" data-testid={`mastery-select-${technique.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600">
                                  {Object.entries(MASTERY_LEVELS).map(([key, level]) => (
                                    <SelectItem key={key} value={key} className="text-white hover:bg-slate-600">
                                      <div className="flex items-center gap-2">
                                        <level.icon className="w-4 h-4" />
                                        {level.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {/* Practice Button */}
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handlePractice(kyu.id, technique.id)}
                                data-testid={`practice-btn-${technique.id}`}
                              >
                                <Play className="w-4 h-4 mr-1" />
                                Pratiquer
                              </Button>
                              {/* Edit Button */}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-slate-400 hover:text-white"
                                onClick={() => {
                                  setEditingTechnique({ ...technique, kyuId: kyu.id });
                                  setEditTechniqueDialogOpen(true);
                                }}
                                data-testid={`edit-technique-btn-${technique.id}`}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              {/* Delete Button */}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                onClick={() => handleDeleteTechnique(kyu.id, technique.id)}
                                data-testid={`delete-technique-btn-${technique.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Edit Technique Dialog */}
      <Dialog open={editTechniqueDialogOpen} onOpenChange={setEditTechniqueDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
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
                  className="bg-slate-700 border-slate-600 text-white"
                  data-testid="edit-technique-name-input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Description</Label>
                <Textarea
                  value={editingTechnique.description || ""}
                  onChange={(e) => setEditingTechnique({ ...editingTechnique, description: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  data-testid="edit-technique-description-input"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-slate-600 text-slate-300">Annuler</Button>
            </DialogClose>
            <Button onClick={handleUpdateTechnique} className="bg-red-600 hover:bg-red-700" data-testid="confirm-edit-technique-btn">Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-slate-800/30 border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-slate-500 text-sm">
            Aikido Practice Tracker - Suivez votre progression sur le chemin de l'harmonie
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
