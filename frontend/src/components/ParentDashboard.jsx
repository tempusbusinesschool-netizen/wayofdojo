import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Users, UserPlus, CheckCircle2, XCircle, Clock, Star, 
  Flame, Trophy, ChevronRight, Loader2, AlertTriangle,
  Link2, Unlink, Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { AIKIDO_CHARACTERS } from '@/constants/aikidoCharacters';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/**
 * ParentDashboard - Tableau de bord parent pour gérer les enfants
 * et valider leurs défis quotidiens
 */
const ParentDashboard = ({ isAuthenticated, onRefreshData }) => {
  const [children, setChildren] = useState([]);
  const [pendingValidations, setPendingValidations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkEmail, setLinkEmail] = useState('');
  const [linking, setLinking] = useState(false);
  const [validating, setValidating] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);

  // Charger les enfants liés
  const fetchChildren = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await axios.get(`${API}/parent/children`);
      setChildren(response.data.children || []);
    } catch (err) {
      console.error('Error fetching children:', err);
      if (err.response?.status !== 401) {
        // User might not have children yet, that's ok
      }
    }
  }, [isAuthenticated]);

  // Charger les validations en attente
  const fetchPendingValidations = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await axios.get(`${API}/parent/pending-validations`);
      setPendingValidations(response.data.pending_validations || []);
    } catch (err) {
      console.error('Error fetching pending validations:', err);
    }
  }, [isAuthenticated]);

  // Charger les données au montage
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchChildren(), fetchPendingValidations()]);
      setLoading(false);
    };
    loadData();
  }, [fetchChildren, fetchPendingValidations]);

  // Lier un enfant
  const handleLinkChild = async () => {
    if (!linkEmail.trim()) {
      toast.error("Veuillez entrer l'email de l'enfant");
      return;
    }

    setLinking(true);
    try {
      const response = await axios.post(`${API}/parent/link-child`, {
        child_email: linkEmail.trim()
      });
      
      toast.success(
        <div className="flex items-center gap-2">
          <span className="text-2xl">👨‍👩‍👧</span>
          <span>{response.data.message}</span>
        </div>
      );
      
      setShowLinkDialog(false);
      setLinkEmail('');
      await fetchChildren();
      await fetchPendingValidations();
    } catch (err) {
      console.error('Error linking child:', err);
      toast.error(err.response?.data?.detail || "Erreur lors de la liaison");
    } finally {
      setLinking(false);
    }
  };

  // Délier un enfant
  const handleUnlinkChild = async (childId, childName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir délier ${childName} ?`)) {
      return;
    }

    try {
      await axios.delete(`${API}/parent/unlink-child/${childId}`);
      toast.success(`${childName} a été délié de votre compte`);
      await fetchChildren();
      await fetchPendingValidations();
    } catch (err) {
      console.error('Error unlinking child:', err);
      toast.error("Erreur lors de la suppression du lien");
    }
  };

  // Valider ou refuser un défi
  const handleValidation = async (childId, challengeId, approved, challengeName) => {
    setValidating(`${childId}-${challengeId}`);
    
    try {
      const response = await axios.post(`${API}/parent/validate/${childId}/${challengeId}`, {
        approved,
        comment: approved ? "Bravo !" : null
      });
      
      if (approved) {
        toast.success(
          <div className="flex items-center gap-3">
            <img 
              src={AIKIDO_CHARACTERS.ADULTES_VALIDATION} 
              alt="Validé" 
              className="w-16 h-16 object-contain"
            />
            <div>
              <p className="font-bold text-slate-900">{response.data.message}</p>
              <p className="text-xs text-slate-600">+{response.data.xp_awarded} XP accordés à votre enfant 🎉</p>
            </div>
          </div>
        );
      } else {
        toast.info(
          <div className="flex items-center gap-3">
            <img 
              src={AIKIDO_CHARACTERS.ENFANT_CONFUS} 
              alt="Refusé" 
              className="w-14 h-14 object-contain"
            />
            <span className="text-slate-900">Défi refusé pour {response.data.child_name}</span>
          </div>
        );
      }
      
      await fetchPendingValidations();
      await fetchChildren();
      onRefreshData?.();
    } catch (err) {
      console.error('Error validating challenge:', err);
      toast.error(err.response?.data?.detail || "Erreur lors de la validation");
    } finally {
      setValidating(null);
    }
  };

  // Belt info helper
  const getBeltInfo = (beltLevel) => {
    const belts = {
      "6e_kyu": { name: "Blanche", emoji: "⚪", color: "bg-slate-200" },
      "5e_kyu": { name: "Jaune", emoji: "🟡", color: "bg-yellow-400" },
      "4e_kyu": { name: "Orange", emoji: "🟠", color: "bg-orange-400" },
      "3e_kyu": { name: "Verte", emoji: "🟢", color: "bg-green-500" },
      "2e_kyu": { name: "Bleue", emoji: "🔵", color: "bg-blue-500" },
      "1er_kyu": { name: "Marron", emoji: "🟤", color: "bg-amber-700" },
      "shodan": { name: "Noire", emoji: "⚫", color: "bg-slate-900" }
    };
    return belts[beltLevel] || belts["6e_kyu"];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <span className="ml-3 text-slate-400">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="parent-dashboard">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Espace Parent</h2>
            <p className="text-slate-400 text-sm">Suivez et validez la progression de vos enfants</p>
          </div>
        </div>
        
        <Button
          onClick={() => setShowLinkDialog(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Lier un enfant
        </Button>
      </div>

      {/* Validations en attente */}
      {pendingValidations.length > 0 && (
        <Card className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
              Validations en attente ({pendingValidations.length})
            </CardTitle>
            <CardDescription className="text-amber-200/70">
              Ces défis nécessitent votre validation pour accorder les XP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingValidations.map((validation, idx) => (
                <div 
                  key={`${validation.child_id}-${validation.challenge_id}-${idx}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-800/50 rounded-xl border border-amber-700/30"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={AIKIDO_CHARACTERS.ENFANT_SALUT} 
                      alt="Enfant" 
                      className="w-12 h-12 object-contain rounded-full bg-amber-500/20"
                    />
                    <div>
                      <p className="font-semibold text-white">{validation.child_name}</p>
                      <p className="text-amber-300 text-sm">{validation.challenge_name}</p>
                      <p className="text-slate-400 text-xs">+{validation.xp_reward} XP</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      onClick={() => handleValidation(
                        validation.child_id, 
                        validation.challenge_id, 
                        true,
                        validation.challenge_name
                      )}
                      disabled={validating === `${validation.child_id}-${validation.challenge_id}`}
                      className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      {validating === `${validation.child_id}-${validation.challenge_id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Valider
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleValidation(
                        validation.child_id, 
                        validation.challenge_id, 
                        false,
                        validation.challenge_name
                      )}
                      disabled={validating === `${validation.child_id}-${validation.challenge_id}`}
                      variant="outline"
                      className="flex-1 sm:flex-initial border-red-600 text-red-400 hover:bg-red-900/30"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Refuser
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des enfants */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Mes enfants ({children.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {children.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p className="text-slate-400 mb-4">Aucun enfant lié à votre compte</p>
              <Button
                onClick={() => setShowLinkDialog(true)}
                variant="outline"
                className="border-purple-600 text-purple-400 hover:bg-purple-900/30"
              >
                <Link2 className="w-4 h-4 mr-2" />
                Lier le compte de votre enfant
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {children.map((child) => {
                const beltInfo = getBeltInfo(child.belt_level);
                const pendingCount = child.gamification.pending_validations?.length || 0;
                
                return (
                  <div 
                    key={child.id}
                    className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-purple-600/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xl">
                          {child.first_name[0]}{child.last_name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {child.first_name} {child.last_name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{beltInfo.emoji}</span>
                            <span className="text-slate-400 text-sm">Ceinture {beltInfo.name}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnlinkChild(child.id, child.first_name)}
                        className="text-slate-400 hover:text-red-400 hover:bg-red-900/20"
                        title="Délier cet enfant"
                      >
                        <Unlink className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Stats de l'enfant */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-amber-400" />
                          <span className="font-bold text-white">{child.gamification.total_xp}</span>
                        </div>
                        <p className="text-xs text-slate-400">XP</p>
                      </div>
                      <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-center gap-1">
                          <Trophy className="w-4 h-4 text-purple-400" />
                          <span className="font-bold text-white">Niv. {child.gamification.level}</span>
                        </div>
                        <p className="text-xs text-slate-400">{child.gamification.level_name}</p>
                      </div>
                      <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                        {pendingCount > 0 ? (
                          <>
                            <div className="flex items-center justify-center gap-1">
                              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                              <span className="font-bold text-amber-400">{pendingCount}</span>
                            </div>
                            <p className="text-xs text-amber-400">En attente</p>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span className="font-bold text-emerald-400">0</span>
                            </div>
                            <p className="text-xs text-slate-400">En attente</p>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedChild(child)}
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Voir les détails
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info RGPD */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-300 text-sm">
                <strong>Information RGPD :</strong> En tant que parent, vous avez accès aux données de progression 
                de vos enfants mineurs. Ces données sont strictement personnelles et ne sont jamais partagées 
                avec des tiers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog: Lier un enfant */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-400" />
              Lier un compte enfant
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Entrez l'adresse email du compte de votre enfant pour le lier à votre espace parent.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Email de l'enfant</label>
              <Input
                type="email"
                placeholder="enfant@exemple.fr"
                value={linkEmail}
                onChange={(e) => setLinkEmail(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-slate-400 text-xs">
                💡 <strong>Note :</strong> Votre enfant doit d'abord créer son propre compte sur Aikido@Game. 
                Une fois le compte créé, vous pourrez le lier ici avec son email.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLinkDialog(false)}
              className="border-slate-600 text-slate-300"
            >
              Annuler
            </Button>
            <Button
              onClick={handleLinkChild}
              disabled={linking || !linkEmail.trim()}
              className="bg-purple-600 hover:bg-purple-500 text-white"
            >
              {linking ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Link2 className="w-4 h-4 mr-2" />
              )}
              Lier le compte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Détails de l'enfant */}
      <Dialog open={!!selectedChild} onOpenChange={() => setSelectedChild(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <span className="text-2xl">{selectedChild?.first_name?.[0]}{selectedChild?.last_name?.[0]}</span>
              {selectedChild?.first_name} {selectedChild?.last_name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedChild && (
            <div className="space-y-4 py-4">
              {/* Stats détaillées */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                  <Star className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">{selectedChild.gamification.total_xp}</p>
                  <p className="text-xs text-slate-400">XP Total</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                  <Trophy className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">Niveau {selectedChild.gamification.level}</p>
                  <p className="text-xs text-slate-400">{selectedChild.gamification.level_name}</p>
                </div>
              </div>
              
              {/* Ceinture */}
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-slate-400 text-sm mb-2">Ceinture actuelle</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getBeltInfo(selectedChild.belt_level).emoji}</span>
                  <span className="text-lg text-white font-semibold">
                    Ceinture {getBeltInfo(selectedChild.belt_level).name}
                  </span>
                </div>
              </div>
              
              {/* Défis en attente */}
              {selectedChild.gamification.pending_validations?.length > 0 && (
                <div className="p-4 bg-amber-900/20 rounded-xl border border-amber-700/30">
                  <p className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Défis en attente de validation
                  </p>
                  <div className="space-y-2">
                    {selectedChild.gamification.pending_validations.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                        <span className="text-white text-sm">{p.challenge_name}</span>
                        <span className="text-amber-400 text-sm">+{p.xp_reward} XP</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button
              onClick={() => setSelectedChild(null)}
              className="bg-slate-700 hover:bg-slate-600 text-white"
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParentDashboard;
