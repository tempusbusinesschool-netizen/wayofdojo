import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { BookOpen, Plus, Edit2, Trash2, Save, X, Calendar } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

// Mood options
const MOODS = [
  { emoji: "😊", label: "Content" },
  { emoji: "🧘", label: "Serein" },
  { emoji: "💪", label: "Motivé" },
  { emoji: "🤔", label: "Réfléchi" },
  { emoji: "😓", label: "Fatigué" },
  { emoji: "🌟", label: "Inspiré" },
  { emoji: "🙏", label: "Reconnaissant" },
  { emoji: "🔥", label: "Déterminé" }
];

function JournalPanel({ isOpen, onClose, isAuthenticated }) {
  const [entries, setEntries] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [newContent, setNewContent] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchEntries();
    }
  }, [isOpen, isAuthenticated]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/auth/journal`);
      setEntries(response.data.entries || []);
      setTotalEntries(response.data.total_entries || 0);
    } catch (error) {
      console.error("Error fetching journal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEntry = async () => {
    if (!newContent.trim()) {
      toast.error("Écris quelque chose avant de sauvegarder !");
      return;
    }

    setSaving(true);
    try {
      if (editingEntry) {
        // Update existing entry
        await axios.put(`${API}/auth/journal/${editingEntry.id}`, {
          content: newContent,
          mood: selectedMood
        });
        toast.success("Réflexion mise à jour ✏️");
      } else {
        // Create new entry
        await axios.post(`${API}/auth/journal`, {
          content: newContent,
          mood: selectedMood
        });
        toast.success("Réflexion enregistrée 📝");
      }
      
      // Reset form and refresh
      setNewContent("");
      setSelectedMood(null);
      setShowNewEntry(false);
      setEditingEntry(null);
      fetchEntries();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!window.confirm("Supprimer cette réflexion ?")) return;
    
    try {
      await axios.delete(`${API}/auth/journal/${entryId}`);
      toast.success("Réflexion supprimée");
      fetchEntries();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setNewContent(entry.content);
    setSelectedMood(entry.mood);
    setShowNewEntry(true);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setNewContent("");
    setSelectedMood(null);
    setShowNewEntry(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-pink-500/40 text-white max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-pink-500/20 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent">
              Mon Journal Privé
            </span>
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {totalEntries} réflexion{totalEntries > 1 ? 's' : ''} personnelle{totalEntries > 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 pr-2">
          {!isAuthenticated ? (
            <div className="text-center py-12">
              <p className="text-6xl mb-4">🔒</p>
              <p className="text-slate-400">Connecte-toi pour accéder à ton journal</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Chargement...</p>
            </div>
          ) : (
            <>
              {/* New Entry Button or Form */}
              {!showNewEntry ? (
                <Button
                  onClick={() => setShowNewEntry(true)}
                  className="w-full mb-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold py-3"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Nouvelle réflexion
                </Button>
              ) : (
                <div className="mb-6 p-4 bg-pink-900/30 rounded-xl border border-pink-500/30">
                  <h4 className="font-bold text-pink-300 mb-3 flex items-center gap-2">
                    {editingEntry ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {editingEntry ? "Modifier la réflexion" : "Nouvelle réflexion"}
                  </h4>
                  
                  {/* Mood selector */}
                  <div className="mb-3">
                    <p className="text-xs text-slate-400 mb-2">Comment te sens-tu ?</p>
                    <div className="flex flex-wrap gap-2">
                      {MOODS.map((mood) => (
                        <button
                          key={mood.emoji}
                          onClick={() => setSelectedMood(selectedMood === mood.emoji ? null : mood.emoji)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            selectedMood === mood.emoji
                              ? 'bg-pink-500 text-white scale-110'
                              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {mood.emoji} {mood.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Content textarea */}
                  <Textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Écris tes pensées, tes réflexions sur ta pratique..."
                    className="w-full min-h-[150px] bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 mb-3"
                  />
                  
                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveEntry}
                      disabled={saving || !newContent.trim()}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="ghost"
                      className="text-slate-400 hover:text-slate-300"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                </div>
              )}

              {/* Entries List */}
              {entries.length === 0 && !showNewEntry ? (
                <div className="text-center py-12">
                  <p className="text-6xl mb-4">📔</p>
                  <p className="text-slate-300 font-semibold mb-2">Ton journal est vide</p>
                  <p className="text-slate-400 text-sm">
                    Commence à écrire tes réflexions<br/>sur ta pratique de l'Aïkido
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-pink-500/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {entry.mood && <span className="text-2xl">{entry.mood}</span>}
                          <div className="flex items-center text-xs text-slate-400">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(entry.created_at)}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="p-1.5 text-slate-400 hover:text-pink-400 hover:bg-pink-900/30 rounded transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-900/30 rounded transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-200 whitespace-pre-wrap text-sm leading-relaxed">
                        {entry.content}
                      </p>
                      {entry.updated_at && (
                        <p className="text-xs text-slate-500 mt-2 italic">
                          Modifié le {formatDate(entry.updated_at)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-pink-500/20 pt-4 mt-2">
          <p className="text-center text-xs text-slate-500 italic">
            🔐 Tes réflexions sont privées et visibles uniquement par toi
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default JournalPanel;
