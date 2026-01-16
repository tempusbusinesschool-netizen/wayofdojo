import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Users, Mail, Eye, ChevronRight, Calendar, User, 
  Bell, CheckCircle, Clock, Award, BookOpen, X,
  MessageSquare, AlertCircle, ChevronDown, LogOut,
  Heart, Star, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const ParentDashboard = ({ onLogout }) => {
  const [parent, setParent] = useState(null);
  const [children, setChildren] = useState([]);
  const [messages, setMessages] = useState([]);
  const [observations, setObservations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Use ref to prevent multiple API calls and track if data is already loaded
  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef(false);

  // Stable token reference - read once on mount
  const tokenRef = useRef(localStorage.getItem('parent_token'));

  // Load data only once on mount
  useEffect(() => {
    const token = tokenRef.current;
    
    // Guard: Don't load if already loading or already loaded
    if (!token || isLoadingRef.current || hasLoadedRef.current) {
      if (!token) setLoading(false);
      return;
    }
    
    isLoadingRef.current = true;
    loadDataOnce(token);
    
    // Cleanup function
    return () => {
      isLoadingRef.current = false;
    };
  }, []); // Empty dependency array - runs only once on mount

  const loadDataOnce = async (token) => {
    try {
      // Load parent profile and children
      const profileRes = await fetch(`${API}/parents/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setParent(profileData.parent);
        setChildren(profileData.children);
      } else if (profileRes.status === 401 || profileRes.status === 403) {
        // Token invalid - logout
        toast.error('Session expirée, veuillez vous reconnecter');
        onLogout?.();
        return;
      }

      // Load messages
      const messagesRes = await fetch(`${API}/parents/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setMessages(messagesData.messages);
        setUnreadCount(messagesData.unread_count);
      }

      // Load observations
      const obsRes = await fetch(`${API}/parents/observations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (obsRes.ok) {
        const obsData = await obsRes.json();
        setObservations(obsData.observations);
      }
      
      // Mark as successfully loaded
      hasLoadedRef.current = true;
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      const res = await fetch(`${API}/parents/messages/${messageId}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMessages(prev => prev.map(m => 
          m.id === messageId ? { ...m, read: true } : m
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const getBeltColor = (level) => {
    const colors = {
      '6e_kyu': 'bg-white text-slate-800',
      '5e_kyu': 'bg-yellow-400 text-slate-800',
      '4e_kyu': 'bg-orange-500 text-white',
      '3e_kyu': 'bg-green-500 text-white',
      '2e_kyu': 'bg-blue-500 text-white',
      '1er_kyu': 'bg-amber-800 text-white',
      'shodan': 'bg-black text-white',
    };
    return colors[level] || 'bg-slate-500 text-white';
  };

  const getBeltName = (level) => {
    const names = {
      '6e_kyu': '6e Kyu (Blanche)',
      '5e_kyu': '5e Kyu (Jaune)',
      '4e_kyu': '4e Kyu (Orange)',
      '3e_kyu': '3e Kyu (Verte)',
      '2e_kyu': '2e Kyu (Bleue)',
      '1er_kyu': '1er Kyu (Marron)',
      'shodan': '1er Dan (Noire)',
    };
    return names[level] || level;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'technique': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'comportement': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'progression': 'bg-green-500/20 text-green-400 border-green-500/30',
      'general': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    };
    return colors[category] || colors.general;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'technique': 'Technique',
      'comportement': 'Comportement',
      'progression': 'Progression',
      'general': 'Général',
    };
    return labels[category] || category;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Espace Parent</h1>
                <p className="text-sm text-slate-400">
                  Bienvenue, {parent?.first_name} {parent?.last_name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''} message{unreadCount > 1 ? 's' : ''}
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-slate-400 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: Users },
            { id: 'messages', label: 'Messages', icon: Mail, badge: unreadCount },
            { id: 'observations', label: 'Observations', icon: Eye },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id 
                  ? 'bg-purple-600 hover:bg-purple-500' 
                  : 'text-slate-400 hover:text-white'
                }
              >
                <TabIcon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.badge > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs">
                    {tab.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Mes enfants ({children.length})
              </h2>
              
              {children.length === 0 ? (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="py-8 text-center">
                    <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">Aucun enfant lié à votre compte</p>
                    <p className="text-sm text-slate-500 mt-2">
                      Contactez l'administration du dojo pour lier le compte de votre enfant
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {children.map((child) => (
                    <Card 
                      key={child.id} 
                      className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedChild(child)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold">
                              {child.first_name?.[0]}{child.last_name?.[0]}
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">
                                {child.first_name} {child.last_name}
                              </h3>
                              <p className="text-sm text-slate-400">{child.dojo_name}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getBeltColor(child.belt_level)}>
                            {getBeltName(child.belt_level)}
                          </Badge>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between text-sm">
                          <span className="text-slate-400">
                            {observations.filter(o => o.student_id === child.id).length} observation(s)
                          </span>
                          <ChevronRight className="w-4 h-4 text-purple-400" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Activité récente
              </h2>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="divide-y divide-slate-700">
                  {messages.slice(0, 3).map((message) => (
                    <div key={message.id} className="py-4 first:pt-6 last:pb-6">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          message.read ? 'bg-slate-700' : 'bg-purple-500/20'
                        }`}>
                          <Mail className={`w-5 h-5 ${message.read ? 'text-slate-400' : 'text-purple-400'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{message.sender_name}</span>
                            {!message.read && (
                              <Badge className="bg-purple-500 text-white text-xs">Nouveau</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mt-1">{message.subject}</p>
                          <p className="text-xs text-slate-500 mt-1">{formatDate(message.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {observations.slice(0, 3).map((obs) => (
                    <div key={obs.id} className="py-4 first:pt-6 last:pb-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Eye className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">
                              Observation de {obs.enseignant_name}
                            </span>
                            <Badge className={getCategoryColor(obs.category)}>
                              {getCategoryLabel(obs.category)}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400 mt-1 line-clamp-2">{obs.content}</p>
                          <p className="text-xs text-slate-500 mt-1">{formatDate(obs.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {messages.length === 0 && observations.length === 0 && (
                    <div className="py-8 text-center">
                      <Bell className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400">Aucune activité récente</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-400" />
              Messages ({messages.length})
            </h2>
            
            {messages.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="py-12 text-center">
                  <Mail className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">Aucun message</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Vous recevrez ici les messages des enseignants
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <Card 
                    key={message.id}
                    className={`bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors cursor-pointer ${
                      !message.read ? 'border-l-4 border-l-purple-500' : ''
                    }`}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.read) markAsRead(message.id);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            message.read ? 'bg-slate-700' : 'bg-purple-500/20'
                          }`}>
                            <Mail className={`w-5 h-5 ${message.read ? 'text-slate-400' : 'text-purple-400'}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">{message.sender_name}</span>
                              {!message.read && (
                                <Badge className="bg-purple-500 text-white text-xs">Nouveau</Badge>
                              )}
                            </div>
                            <h3 className="font-semibold text-white mt-1">{message.subject}</h3>
                            <p className="text-sm text-slate-400 mt-1 line-clamp-2">{message.content}</p>
                          </div>
                        </div>
                        <div className="text-right text-sm text-slate-500">
                          <p>{formatDate(message.created_at)}</p>
                          <p>{formatTime(message.created_at)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Observations Tab */}
        {activeTab === 'observations' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              Observations ({observations.length})
            </h2>
            
            {observations.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="py-12 text-center">
                  <Eye className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">Aucune observation</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Les enseignants ajouteront des observations sur la progression de vos enfants
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {observations.map((obs) => {
                  const child = children.find(c => c.id === obs.student_id);
                  return (
                    <Card 
                      key={obs.id}
                      className="bg-slate-800/50 border-slate-700"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                            <Eye className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getCategoryColor(obs.category)}>
                                {getCategoryLabel(obs.category)}
                              </Badge>
                              {child && (
                                <Badge className="bg-slate-700 text-slate-300">
                                  {child.first_name} {child.last_name}
                                </Badge>
                              )}
                            </div>
                            <p className="text-white">{obs.content}</p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {obs.enseignant_name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(obs.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-800 border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <CardHeader className="border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white">{selectedMessage.subject}</CardTitle>
                  <p className="text-sm text-slate-400 mt-1">
                    De: {selectedMessage.sender_name} • {formatDate(selectedMessage.created_at)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMessage(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
              <p className="text-slate-300 whitespace-pre-wrap">{selectedMessage.content}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Child Detail Modal */}
      {selectedChild && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-800 border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <CardHeader className="border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold">
                    {selectedChild.first_name?.[0]}{selectedChild.last_name?.[0]}
                  </div>
                  <div>
                    <CardTitle className="text-white">
                      {selectedChild.first_name} {selectedChild.last_name}
                    </CardTitle>
                    <p className="text-sm text-slate-400 mt-1">{selectedChild.dojo_name}</p>
                    <Badge className={`mt-2 ${getBeltColor(selectedChild.belt_level)}`}>
                      {getBeltName(selectedChild.belt_level)}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedChild(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                Dernières observations
              </h3>
              
              {observations.filter(o => o.student_id === selectedChild.id).length === 0 ? (
                <p className="text-slate-400 text-center py-8">Aucune observation pour le moment</p>
              ) : (
                <div className="space-y-3">
                  {observations
                    .filter(o => o.student_id === selectedChild.id)
                    .slice(0, 10)
                    .map((obs) => (
                      <div key={obs.id} className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getCategoryColor(obs.category)}>
                            {getCategoryLabel(obs.category)}
                          </Badge>
                          <span className="text-xs text-slate-500">{formatDate(obs.created_at)}</span>
                        </div>
                        <p className="text-slate-300">{obs.content}</p>
                        <p className="text-xs text-slate-500 mt-2">Par {obs.enseignant_name}</p>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
