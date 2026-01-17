/**
 * 👨‍🏫 ESPACE ENSEIGNANT - Suivi pédagogique
 * 
 * Permet aux enseignants de:
 * - Voir la progression des élèves (suivi pédagogique)
 * - Valider les TECHNIQUES OFFICIELLES d'Aïkido (grades au dojo)
 * - Envoyer des encouragements
 * - Configurer les jeux
 * 
 * ⚠️ IMPORTANT - RÈGLES DE VALIDATION:
 * - Jeux numériques: Validés par les PARENTS uniquement
 * - Exercices au dojo: AUTO-VALIDÉS par l'enfant
 * - Cet espace sert au SUIVI et aux ENCOURAGEMENTS
 * - Les techniques officielles sont validées AU DOJO par l'enseignant
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  X, Users, Award, TrendingUp, MessageCircle, Settings, 
  CheckCircle, Clock, Star, Trophy, Filter, Search,
  ChevronRight, Send, ThumbsUp
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const TeacherFollowUp = ({ onClose, teacherToken }) => {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Charger les élèves
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      // Simuler le chargement des données (à remplacer par un vrai appel API)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Données simulées
      const mockStudents = [
        { 
          id: '1', 
          name: 'Kenji Tanaka', 
          avatar: '🥷', 
          level: '6e_kyu',
          totalXp: 450, 
          gamesPlayed: 12,
          lastActive: '2025-01-16',
          pendingValidations: 2,
          techniquesValidated: 5,
          badges: ['first_step', 'streak_3'],
          recentGames: [
            { game: 'MessagerDuKi', score: 850, date: '2025-01-16' },
            { game: 'MemorySensei', score: 620, date: '2025-01-15' },
          ]
        },
        { 
          id: '2', 
          name: 'Yuki Sato', 
          avatar: '🐉', 
          level: '5e_kyu',
          totalXp: 1250, 
          gamesPlayed: 28,
          lastActive: '2025-01-15',
          pendingValidations: 0,
          techniquesValidated: 12,
          badges: ['first_step', 'streak_7', 'xp_500'],
          recentGames: [
            { game: 'QueteVertus', score: 520, date: '2025-01-15' },
          ]
        },
        { 
          id: '3', 
          name: 'Hana Yamamoto', 
          avatar: '🌸', 
          level: '6e_kyu',
          totalXp: 280, 
          gamesPlayed: 6,
          lastActive: '2025-01-14',
          pendingValidations: 3,
          techniquesValidated: 2,
          badges: ['first_step'],
          recentGames: []
        },
      ];
      
      setStudents(mockStudents);
    } catch (error) {
      console.error('Erreur chargement élèves:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les élèves
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || student.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  // Valider une technique
  const validateTechnique = async (studentId, techniqueId) => {
    // À implémenter avec l'API
    console.log('Validation technique:', studentId, techniqueId);
  };

  // Envoyer un message d'encouragement
  const sendEncouragement = async () => {
    if (!selectedStudent || !message.trim()) return;
    
    setSending(true);
    try {
      // À implémenter avec l'API
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessage('');
      // Afficher une notification de succès
    } catch (error) {
      console.error('Erreur envoi message:', error);
    } finally {
      setSending(false);
    }
  };

  // Obtenir la couleur du niveau
  const getLevelColor = (level) => {
    const colors = {
      '6e_kyu': 'bg-white text-slate-800',
      '5e_kyu': 'bg-yellow-400 text-slate-800',
      '4e_kyu': 'bg-orange-400 text-white',
      '3e_kyu': 'bg-green-500 text-white',
      '2e_kyu': 'bg-blue-500 text-white',
      '1er_kyu': 'bg-amber-700 text-white',
      'shodan': 'bg-black text-white',
    };
    return colors[level] || 'bg-slate-500 text-white';
  };

  // Obtenir le nom du niveau
  const getLevelName = (level) => {
    const names = {
      '6e_kyu': '6e Kyu (Blanche)',
      '5e_kyu': '5e Kyu (Jaune)',
      '4e_kyu': '4e Kyu (Orange)',
      '3e_kyu': '3e Kyu (Verte)',
      '2e_kyu': '2e Kyu (Bleue)',
      '1er_kyu': '1er Kyu (Marron)',
      'shodan': 'Shodan (Noire)',
    };
    return names[level] || level;
  };

  // Statistiques globales
  const stats = {
    totalStudents: students.length,
    activeToday: students.filter(s => s.lastActive === '2025-01-16').length,
    pendingValidations: students.reduce((sum, s) => sum + s.pendingValidations, 0),
    totalGamesPlayed: students.reduce((sum, s) => sum + s.gamesPlayed, 0),
  };

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl" style={{ width: 800, maxHeight: '90vh' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            👨‍🏫
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Espace Enseignant</h2>
            <p className="text-white/70 text-sm">Gestion du Dojo Virtuel</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-slate-800/50">
        <div className="bg-slate-700/50 rounded-xl p-3 text-center">
          <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
          <p className="text-xs text-slate-400">Élèves</p>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-3 text-center">
          <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">{stats.activeToday}</p>
          <p className="text-xs text-slate-400">Actifs aujourd'hui</p>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-3 text-center">
          <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">{stats.pendingValidations}</p>
          <p className="text-xs text-slate-400">À valider</p>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-3 text-center">
          <Trophy className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">{stats.totalGamesPlayed}</p>
          <p className="text-xs text-slate-400">Parties jouées</p>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex border-b border-slate-700">
        {[
          { id: 'students', label: 'Élèves', icon: Users },
          { id: 'validations', label: 'Validations', icon: CheckCircle },
          { id: 'messages', label: 'Messages', icon: MessageCircle },
          { id: 'settings', label: 'Paramètres', icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 transition-colors ${
              activeTab === tab.id
                ? 'bg-slate-700/50 text-white border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div className="p-4 overflow-y-auto" style={{ maxHeight: 400 }}>
        {/* Onglet Élèves */}
        {activeTab === 'students' && (
          <div>
            {/* Recherche et filtres */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un élève..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm"
                />
              </div>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
              >
                <option value="all">Tous les niveaux</option>
                <option value="6e_kyu">6e Kyu</option>
                <option value="5e_kyu">5e Kyu</option>
                <option value="4e_kyu">4e Kyu</option>
                <option value="3e_kyu">3e Kyu</option>
              </select>
            </div>

            {/* Liste des élèves */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto" />
                <p className="text-slate-400 mt-2">Chargement...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredStudents.map(student => (
                  <motion.div
                    key={student.id}
                    layout
                    className={`bg-slate-700/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-slate-700 ${
                      selectedStudent?.id === student.id ? 'ring-2 ring-indigo-500' : ''
                    }`}
                    onClick={() => setSelectedStudent(selectedStudent?.id === student.id ? null : student)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{student.avatar}</span>
                        <div>
                          <h3 className="text-white font-medium">{student.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(student.level)}`}>
                              {getLevelName(student.level)}
                            </span>
                            <span className="text-slate-400 text-xs">{student.totalXp} XP</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {student.pendingValidations > 0 && (
                          <div className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full text-xs">
                            {student.pendingValidations} à valider
                          </div>
                        )}
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${
                          selectedStudent?.id === student.id ? 'rotate-90' : ''
                        }`} />
                      </div>
                    </div>

                    {/* Détails de l'élève */}
                    <AnimatePresence>
                      {selectedStudent?.id === student.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-slate-600"
                        >
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-slate-800 rounded-lg p-3 text-center">
                              <p className="text-lg font-bold text-white">{student.gamesPlayed}</p>
                              <p className="text-xs text-slate-400">Parties jouées</p>
                            </div>
                            <div className="bg-slate-800 rounded-lg p-3 text-center">
                              <p className="text-lg font-bold text-white">{student.techniquesValidated}</p>
                              <p className="text-xs text-slate-400">Techniques validées</p>
                            </div>
                            <div className="bg-slate-800 rounded-lg p-3 text-center">
                              <p className="text-lg font-bold text-white">{student.badges.length}</p>
                              <p className="text-xs text-slate-400">Badges</p>
                            </div>
                          </div>

                          {/* Dernières parties */}
                          {student.recentGames.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-slate-300 mb-2">Dernières parties</h4>
                              <div className="space-y-1">
                                {student.recentGames.map((game, idx) => (
                                  <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-slate-400">{game.game}</span>
                                    <span className="text-white">{game.score} pts</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1 text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              Valider technique
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 text-xs">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Envoyer message
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs">
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Onglet Validations */}
        {activeTab === 'validations' && (
          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <h3 className="text-amber-400 font-medium mb-2">
                {stats.pendingValidations} techniques en attente de validation
              </h3>
              <p className="text-slate-400 text-sm">
                Les élèves ont demandé la validation de leurs techniques. Cliquez sur chaque élève pour voir les détails.
              </p>
            </div>

            {students.filter(s => s.pendingValidations > 0).map(student => (
              <div key={student.id} className="bg-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{student.avatar}</span>
                  <div>
                    <h4 className="text-white font-medium">{student.name}</h4>
                    <span className="text-amber-400 text-sm">{student.pendingValidations} techniques à valider</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Tout valider
                  </Button>
                  <Button size="sm" variant="outline">
                    Voir les détails
                  </Button>
                </div>
              </div>
            ))}

            {students.filter(s => s.pendingValidations > 0).length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <p className="text-slate-400">Aucune validation en attente !</p>
              </div>
            )}
          </div>
        )}

        {/* Onglet Messages */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-xl p-4">
              <h3 className="text-white font-medium mb-3">Envoyer un encouragement</h3>
              <select className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm mb-3">
                <option value="">Sélectionner un élève</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Écris ton message d'encouragement..."
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 text-sm resize-none"
                rows={3}
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-2">
                  {['🎉', '💪', '⭐', '🥋', '👏'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setMessage(m => m + emoji)}
                      className="w-8 h-8 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <Button 
                  onClick={sendEncouragement}
                  disabled={!message.trim() || sending}
                  className="bg-indigo-600 hover:bg-indigo-500"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer
                </Button>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4">
              <h3 className="text-white font-medium mb-3">Messages rapides</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { text: "Excellent travail ! Continue comme ça ! 🎉", emoji: "🎉" },
                  { text: "Belle progression cette semaine ! 💪", emoji: "💪" },
                  { text: "Ta technique s'améliore, bravo ! ⭐", emoji: "⭐" },
                  { text: "N'oublie pas de pratiquer les ukemis 🥋", emoji: "🥋" },
                ].map((quick, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMessage(quick.text)}
                    className="p-3 bg-slate-600 hover:bg-slate-500 rounded-lg text-left text-sm text-slate-300 transition-colors"
                  >
                    <span className="text-lg mr-2">{quick.emoji}</span>
                    {quick.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Onglet Paramètres */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-xl p-4">
              <h3 className="text-white font-medium mb-3">Configuration des jeux</h3>
              <div className="space-y-3">
                {[
                  { id: 'showHints', label: 'Afficher les indices', desc: 'Aide les enfants pendant les jeux' },
                  { id: 'soundEnabled', label: 'Voix de Tanaka', desc: 'Activer les encouragements vocaux' },
                  { id: 'adaptiveDifficulty', label: 'Difficulté adaptative', desc: 'Ajuste automatiquement le niveau' },
                ].map(setting => (
                  <div key={setting.id} className="flex items-center justify-between p-3 bg-slate-600 rounded-lg">
                    <div>
                      <p className="text-white text-sm font-medium">{setting.label}</p>
                      <p className="text-slate-400 text-xs">{setting.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4">
              <h3 className="text-white font-medium mb-3">Jeux disponibles</h3>
              <p className="text-slate-400 text-sm mb-3">Activez ou désactivez les jeux pour vos élèves</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Messager du Ki', emoji: '🌊' },
                  { name: 'Parcours du Souffle', emoji: '🌬️' },
                  { name: 'Memory Sensei', emoji: '🎴' },
                  { name: 'Quête des Vertus', emoji: '🛡️' },
                  { name: 'Rythme du Dojo', emoji: '🥁' },
                  { name: 'Chemin Équilibre', emoji: '⚖️' },
                ].map(game => (
                  <div key={game.name} className="flex items-center gap-2 p-2 bg-slate-600 rounded-lg">
                    <span>{game.emoji}</span>
                    <span className="text-white text-sm flex-1">{game.name}</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherFollowUp;
