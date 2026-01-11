import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  GraduationCap, Users, MessageSquare, FileText, LogOut, Send, 
  Plus, Search, ChevronRight, Clock, User, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * EnseignantDashboard - Dashboard principal pour les enseignants
 * Permet de gérer les observations et messages aux élèves/parents
 */
const EnseignantDashboard = ({ enseignant, token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [observations, setObservations] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showObservationDialog, setShowObservationDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Charger les membres du dojo (élèves)
      const membersRes = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/dojo-members?dojo_id=${enseignant.dojo_id}`
      );
      const membersData = await membersRes.json();
      
      // Charger aussi les utilisateurs du dojo
      const usersRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users`);
      const usersData = await usersRes.json();
      
      // Combiner les deux sources
      const allStudents = [
        ...(membersData.members || []).map(m => ({ ...m, type: 'dojo_member' })),
        ...(usersData.users || []).filter(u => u.dojo_id === enseignant.dojo_id).map(u => ({ 
          ...u, 
          type: 'user',
          display_name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email
        }))
      ];
      setStudents(allStudents);

      // Charger les observations du dojo
      const obsRes = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/observations/dojo/${enseignant.dojo_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const obsData = await obsRes.json();
      setObservations(obsData.observations || []);

      // Charger les messages envoyés
      const msgRes = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/messages/sent`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const msgData = await msgRes.json();
      setSentMessages(msgData.messages || []);

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('enseignant_token');
    localStorage.removeItem('enseignant_info');
    onLogout();
  };

  const filteredStudents = students.filter(s => 
    (s.display_name || s.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryLabel = (category) => {
    const labels = {
      general: 'Général',
      technique: 'Technique',
      comportement: 'Comportement',
      progression: 'Progression'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: 'bg-slate-500',
      technique: 'bg-blue-500',
      comportement: 'bg-purple-500',
      progression: 'bg-emerald-500'
    };
    return colors[category] || 'bg-slate-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Espace Enseignant</h1>
              <p className="text-sm text-slate-400">
                {enseignant.first_name} {enseignant.last_name} • {enseignant.dojo_name}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-slate-400 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{students.length}</p>
                <p className="text-sm text-slate-400">Élèves</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{observations.length}</p>
                <p className="text-sm text-slate-400">Observations</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{sentMessages.length}</p>
                <p className="text-sm text-slate-400">Messages envoyés</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'students' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('students')}
            className={activeTab === 'students' ? 'bg-amber-500 text-white' : 'text-slate-400'}
          >
            <Users className="w-4 h-4 mr-2" />
            Élèves
          </Button>
          <Button
            variant={activeTab === 'observations' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('observations')}
            className={activeTab === 'observations' ? 'bg-amber-500 text-white' : 'text-slate-400'}
          >
            <FileText className="w-4 h-4 mr-2" />
            Observations
          </Button>
          <Button
            variant={activeTab === 'messages' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('messages')}
            className={activeTab === 'messages' ? 'bg-amber-500 text-white' : 'text-slate-400'}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Rechercher un élève..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            {/* Students List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <Card 
                  key={student.id} 
                  className="bg-slate-800 border-slate-700 hover:border-amber-500/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{student.display_name || student.email}</p>
                          <p className="text-xs text-slate-400">
                            {student.type === 'user' ? 'Compte utilisateur' : 'Membre dojo'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                    
                    {/* Quick actions */}
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(student);
                          setShowObservationDialog(true);
                        }}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Observation
                      </Button>
                      {student.type === 'user' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(student);
                            setShowMessageDialog(true);
                          }}
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Message
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun élève trouvé</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'observations' && (
          <div className="space-y-4">
            {observations.map((obs) => (
              <Card key={obs.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs text-white ${getCategoryColor(obs.category)}`}>
                        {getCategoryLabel(obs.category)}
                      </span>
                      <span className="text-white font-medium">{obs.student_name}</span>
                    </div>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(obs.created_at)}
                    </span>
                  </div>
                  <p className="text-slate-300">{obs.content}</p>
                </CardContent>
              </Card>
            ))}

            {observations.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucune observation pour le moment</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            {sentMessages.map((msg) => (
              <Card key={msg.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-white font-medium">{msg.subject}</p>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">{msg.content}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {msg.is_read ? '✓ Lu' : '• Non lu'}
                  </p>
                </CardContent>
              </Card>
            ))}

            {sentMessages.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun message envoyé</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Observation Dialog */}
      <ObservationDialog
        isOpen={showObservationDialog}
        onClose={() => {
          setShowObservationDialog(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        token={token}
        onSuccess={() => {
          loadData();
          setShowObservationDialog(false);
          setSelectedStudent(null);
        }}
      />

      {/* Message Dialog */}
      <MessageDialog
        isOpen={showMessageDialog}
        onClose={() => {
          setShowMessageDialog(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        token={token}
        onSuccess={() => {
          loadData();
          setShowMessageDialog(false);
          setSelectedStudent(null);
        }}
      />
    </div>
  );
};


// Dialog pour créer une observation
const ObservationDialog = ({ isOpen, onClose, student, token, onSuccess }) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!student || !content.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/observations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          student_id: student.id,
          student_type: student.type,
          content: content.trim(),
          category
        })
      });

      if (response.ok) {
        toast.success('Observation ajoutée');
        setContent('');
        setCategory('general');
        onSuccess();
      } else {
        const data = await response.json();
        toast.error(data.detail || 'Erreur lors de l\'ajout');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Nouvelle observation
          </DialogTitle>
        </DialogHeader>

        {student && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="bg-slate-800 rounded-lg p-3">
              <p className="text-sm text-slate-400">Élève</p>
              <p className="text-white font-medium">{student.display_name || student.email}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Catégorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="general">Général</SelectItem>
                  <SelectItem value="technique">Technique</SelectItem>
                  <SelectItem value="comportement">Comportement</SelectItem>
                  <SelectItem value="progression">Progression</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Observation</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Décrivez votre observation..."
                className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose} className="text-slate-400">
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading || !content.trim()}
                className="bg-emerald-600 hover:bg-emerald-500"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};


// Dialog pour envoyer un message
const MessageDialog = ({ isOpen, onClose, student, token, onSuccess }) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!student || !subject.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipient_id: student.id,
          subject: subject.trim(),
          content: content.trim()
        })
      });

      if (response.ok) {
        toast.success('Message envoyé');
        setSubject('');
        setContent('');
        onSuccess();
      } else {
        const data = await response.json();
        toast.error(data.detail || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-purple-400" />
            Nouveau message
          </DialogTitle>
        </DialogHeader>

        {student && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="bg-slate-800 rounded-lg p-3">
              <p className="text-sm text-slate-400">Destinataire</p>
              <p className="text-white font-medium">{student.display_name || student.email}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Sujet</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Sujet du message..."
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Message</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Votre message..."
                className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose} className="text-slate-400">
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading || !subject.trim() || !content.trim()}
                className="bg-purple-600 hover:bg-purple-500"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Envoyer'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EnseignantDashboard;
