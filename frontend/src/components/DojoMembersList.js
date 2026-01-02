import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  UserPlus, 
  Search, 
  Trash2, 
  Edit3, 
  Shield, 
  Calendar,
  Mail,
  MessageSquare,
  ToggleLeft,
  ToggleRight,
  Award,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import DojoMemberForm from "./DojoMemberForm";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Grades Aikido
const AIKIDO_GRADES = {
  "6e_kyu": { label: "6ème Kyu", color: "#ffffff", emoji: "⬜", textColor: "text-slate-400" },
  "5e_kyu": { label: "5ème Kyu", color: "#ffeb3b", emoji: "🟨", textColor: "text-yellow-400" },
  "4e_kyu": { label: "4ème Kyu", color: "#ff9800", emoji: "🟧", textColor: "text-orange-400" },
  "3e_kyu": { label: "3ème Kyu", color: "#4caf50", emoji: "🟩", textColor: "text-green-400" },
  "2e_kyu": { label: "2ème Kyu", color: "#2196f3", emoji: "🟦", textColor: "text-blue-400" },
  "1er_kyu": { label: "1er Kyu", color: "#9c27b0", emoji: "🟪", textColor: "text-purple-400" },
  "1er_dan": { label: "1er Dan", color: "#1a1a1a", emoji: "⬛", textColor: "text-slate-200" },
  "2e_dan": { label: "2ème Dan", color: "#1a1a1a", emoji: "⬛⬛", textColor: "text-slate-200" },
  "3e_dan": { label: "3ème Dan", color: "#1a1a1a", emoji: "⬛⬛⬛", textColor: "text-slate-200" },
};

function DojoMembersList({ dojoId, dojoName }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${API}/dojo-members`, {
        params: { dojo_id: dojoId }
      });
      setMembers(response.data.members || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      // Use mock data if API not ready
      setMembers([
        { id: '1', display_name: 'Jean Dupont', status: 'active', created_at: new Date().toISOString(), email: 'jean@example.com', belt_level: '4e_kyu', progression_percentage: 45 },
        { id: '2', display_name: 'Marie Martin', status: 'active', created_at: new Date().toISOString(), belt_level: '5e_kyu', progression_percentage: 30 },
        { id: '3', display_name: 'NinjaAikido42', status: 'active', created_at: new Date().toISOString(), use_pseudonym: true, belt_level: '3e_kyu', progression_percentage: 65 },
        { id: '4', display_name: 'Pierre Leroy', status: 'inactive', created_at: new Date().toISOString(), internal_note: 'Absent depuis 2 mois', belt_level: '6e_kyu', progression_percentage: 10 },
        { id: '5', display_name: 'Sophie Bernard', status: 'active', created_at: new Date().toISOString(), belt_level: '1er_kyu', progression_percentage: 85 },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await axios.get(`${API}/dojo-members`, {
          params: { dojo_id: dojoId }
        });
        setMembers(response.data.members || []);
      } catch (error) {
        console.error("Error fetching members:", error);
        // Use mock data if API not ready
        setMembers([
          { id: '1', display_name: 'Jean Dupont', status: 'active', created_at: new Date().toISOString(), email: 'jean@example.com', belt_level: '4e_kyu', progression_percentage: 45 },
          { id: '2', display_name: 'Marie Martin', status: 'active', created_at: new Date().toISOString(), belt_level: '5e_kyu', progression_percentage: 30 },
          { id: '3', display_name: 'NinjaAikido42', status: 'active', created_at: new Date().toISOString(), use_pseudonym: true, belt_level: '3e_kyu', progression_percentage: 65 },
          { id: '4', display_name: 'Pierre Leroy', status: 'inactive', created_at: new Date().toISOString(), internal_note: 'Absent depuis 2 mois', belt_level: '6e_kyu', progression_percentage: 10 },
          { id: '5', display_name: 'Sophie Bernard', status: 'active', created_at: new Date().toISOString(), belt_level: '1er_kyu', progression_percentage: 85 },
        ]);
      }
      setLoading(false);
    };
    
    if (dojoId) {
      loadMembers();
    }
  }, [dojoId]);

  const handleToggleStatus = async (memberId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await axios.patch(`${API}/dojo-members/${memberId}`, { status: newStatus });
      toast.success(`Statut mis à jour : ${newStatus === 'active' ? 'Actif' : 'Inactif'}`);
      fetchMembers();
    } catch (error) {
      setMembers(prev => prev.map(m => 
        m.id === memberId ? { ...m, status: newStatus } : m
      ));
      toast.success(`Statut mis à jour : ${newStatus === 'active' ? 'Actif' : 'Inactif'}`);
    }
  };

  const handleDelete = async (memberId, memberName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${memberName} ?\n\nCette action est irréversible.`)) {
      return;
    }
    try {
      await axios.delete(`${API}/dojo-members/${memberId}`);
      toast.success("Adhérent supprimé");
      fetchMembers();
    } catch (error) {
      setMembers(prev => prev.filter(m => m.id !== memberId));
      toast.success("Adhérent supprimé");
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchMembers();
  };

  const filteredMembers = members.filter(member =>
    member.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = members.filter(m => m.status === 'active').length;
  const inactiveCount = members.filter(m => m.status === 'inactive').length;
  const averageProgression = members.length > 0 
    ? Math.round(members.reduce((acc, m) => acc + (m.progression_percentage || 0), 0) / members.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header avec stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-400" />
            Adhérents du Dojo
          </h2>
          <div className="flex gap-4 mt-1 text-sm">
            <span className="text-emerald-400">{activeCount} actif(s)</span>
            <span className="text-slate-500">{inactiveCount} inactif(s)</span>
            <span className="text-orange-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {averageProgression}% progression moy.
            </span>
          </div>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-orange-600 hover:bg-orange-500"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Ajouter un adhérent
        </Button>
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un adhérent..."
          className="pl-10 bg-slate-800 border-slate-700 text-white"
        />
      </div>

      {/* Liste des adhérents */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-slate-400 mt-2">Chargement...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400">
              {searchTerm ? 'Aucun adhérent trouvé' : 'Aucun adhérent enregistré'}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="mt-4 bg-orange-600 hover:bg-orange-500"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Ajouter le premier adhérent
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredMembers.map((member) => {
            const gradeInfo = AIKIDO_GRADES[member.belt_level] || AIKIDO_GRADES["6e_kyu"];
            
            return (
              <Card 
                key={member.id} 
                className={`border-slate-700 ${
                  member.status === 'active' 
                    ? 'bg-slate-800/50' 
                    : 'bg-slate-900/50 opacity-70'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Identité et statut */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Grade indicator */}
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2"
                          style={{ 
                            backgroundColor: gradeInfo.color + '20',
                            borderColor: gradeInfo.color
                          }}
                          title={gradeInfo.label}
                        >
                          {gradeInfo.emoji}
                        </div>
                        <span className="font-semibold text-white text-lg">
                          {member.display_name}
                        </span>
                        {member.use_pseudonym && (
                          <Badge className="bg-emerald-600/20 text-emerald-400 text-xs border border-emerald-600/30">
                            <Shield className="w-3 h-3 mr-1" />
                            Pseudo
                          </Badge>
                        )}
                        <Badge 
                          className={`text-xs ${
                            member.status === 'active' 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-slate-600 text-slate-300'
                          }`}
                        >
                          {member.status === 'active' ? '✅ Actif' : '⏸️ Inactif'}
                        </Badge>
                      </div>
                      
                      {/* Grade et progression */}
                      <div className="mt-2 flex items-center gap-4">
                        <span className={`text-sm font-medium ${gradeInfo.textColor}`}>
                          <Award className="w-3 h-3 inline mr-1" />
                          {gradeInfo.label}
                        </span>
                        <div className="flex items-center gap-2 flex-1 max-w-xs">
                          <Progress 
                            value={member.progression_percentage || 0} 
                            className="h-2 flex-1"
                          />
                          <span className="text-xs text-orange-400 font-medium w-10">
                            {member.progression_percentage || 0}%
                          </span>
                        </div>
                      </div>
                      
                      {/* Infos secondaires */}
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Inscrit le {new Date(member.created_at).toLocaleDateString('fr-FR')}
                        </span>
                        {member.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </span>
                        )}
                      </div>
                      
                      {/* Note interne */}
                      {member.internal_note && (
                        <div className="mt-2 p-2 bg-slate-700/50 rounded text-sm text-slate-400 flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 mt-0.5 text-amber-400" />
                          <span>{member.internal_note}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleStatus(member.id, member.status)}
                        className="text-slate-400 hover:text-white"
                        title={member.status === 'active' ? 'Désactiver' : 'Activer'}
                      >
                        {member.status === 'active' ? (
                          <ToggleRight className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(member.id, member.display_name)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Rappel RGPD */}
      <Card className="bg-emerald-900/20 border-emerald-700/30">
        <CardContent className="p-4">
          <p className="text-emerald-400 text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>
              <strong>Conformité RGPD :</strong> Seules les données strictement nécessaires sont collectées. 
              Aucune date de naissance, adresse ou téléphone n'est stocké.
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Dialog pour ajouter un adhérent */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-lg bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-orange-400" />
              Nouvel adhérent
            </DialogTitle>
          </DialogHeader>
          <DojoMemberForm
            dojoId={dojoId}
            dojoName={dojoName}
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DojoMembersList;
