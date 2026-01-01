import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle2, Lock } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

// 7 Vertues with their details
const VIRTUES_CONFIG = {
  jin: {
    name: "Bienveillance",
    kanji: "仁",
    romaji: "JIN",
    emoji: "💝",
    color: "#3B82F6",
    bgGradient: "from-blue-600 to-blue-800"
  },
  gi: {
    name: "Justice / Honneur",
    kanji: "義",
    romaji: "GI",
    emoji: "⚖️",
    color: "#8B5CF6",
    bgGradient: "from-violet-600 to-violet-800"
  },
  rei: {
    name: "Courtoisie",
    kanji: "礼",
    romaji: "REI",
    emoji: "🙏",
    color: "#FCD34D",
    bgGradient: "from-yellow-500 to-amber-600"
  },
  chi: {
    name: "Sagesse",
    kanji: "智",
    romaji: "CHI",
    emoji: "🧘",
    color: "#22C55E",
    bgGradient: "from-green-600 to-green-800"
  },
  shin: {
    name: "Sincérité",
    kanji: "誠",
    romaji: "SHIN",
    emoji: "💎",
    color: "#EC4899",
    bgGradient: "from-pink-600 to-pink-800"
  },
  chu: {
    name: "Loyauté",
    kanji: "忠",
    romaji: "CHU",
    emoji: "🛡️",
    color: "#F97316",
    bgGradient: "from-orange-500 to-orange-700"
  },
  ko: {
    name: "Respect des fondements",
    kanji: "孝",
    romaji: "KŌ",
    emoji: "🌳",
    color: "#14B8A6",
    bgGradient: "from-teal-600 to-teal-800"
  }
};

function VirtueActionsPanel({ isOpen, onClose, isAuthenticated, onPointsUpdate }) {
  const [virtues, setVirtues] = useState(null);
  const [userVirtueData, setUserVirtueData] = useState(null);
  const [selectedVirtue, setSelectedVirtue] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Calculate which actions have been completed this month
  const actionsCompletedThisMonth = useMemo(() => {
    if (!userVirtueData?.actions) return new Set();
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const completedIds = new Set();
    userVirtueData.actions.forEach(action => {
      const loggedAt = new Date(action.logged_at);
      if (loggedAt.getMonth() === currentMonth && loggedAt.getFullYear() === currentYear) {
        completedIds.add(action.action_id);
      }
    });
    
    return completedIds;
  }, [userVirtueData]);

  // Get total actions completed this month
  const totalActionsThisMonth = actionsCompletedThisMonth.size;

  // Fetch virtue reference data
  useEffect(() => {
    const fetchVirtues = async () => {
      try {
        const response = await axios.get(`${API}/virtues`);
        setVirtues(response.data);
      } catch (error) {
        console.error("Error fetching virtues:", error);
      }
    };
    
    if (isOpen) {
      fetchVirtues();
      if (isAuthenticated) {
        fetchUserVirtueData();
      }
    }
  }, [isOpen, isAuthenticated]);

  const fetchUserVirtueData = async () => {
    try {
      const response = await axios.get(`${API}/auth/virtue-actions`);
      setUserVirtueData(response.data);
    } catch (error) {
      console.error("Error fetching user virtue data:", error);
    }
  };

  const handleLogAction = async () => {
    if (!selectedVirtue || !selectedAction) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/auth/virtue-actions`, {
        virtue_id: selectedVirtue.id,
        action_id: selectedAction.id,
        action_type: selectedAction.type,
        note: note || null
      });
      
      toast.success(response.data.message);
      setSelectedAction(null);
      setNote("");
      fetchUserVirtueData();
      if (onPointsUpdate) onPointsUpdate();
    } catch (error) {
      console.error("Error logging action:", error);
      toast.error("Erreur lors de l'enregistrement de l'action");
    } finally {
      setLoading(false);
    }
  };

  const getTotalPoints = (virtueId) => {
    if (!userVirtueData?.totals?.[virtueId]) return 0;
    return userVirtueData.totals[virtueId].total_points;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-amber-400">
            🎯 Actions par Vertu
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Enregistre tes actions pour développer les 7 vertus de l'Aïkido
          </DialogDescription>
        </DialogHeader>

        {/* Points Summary */}
        {isAuthenticated && userVirtueData && (
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 rounded-xl border border-purple-500/30 mb-4">
            <div className="flex flex-wrap justify-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-400">{userVirtueData.total_pv}</p>
                <p className="text-xs text-slate-400">Points Individuels (PV)</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-400">{userVirtueData.total_pc}</p>
                <p className="text-xs text-slate-400">Points Collectifs (PC)</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">
                  {userVirtueData.total_points}
                </p>
                <p className="text-xs text-slate-400">Total Points Vertu</p>
              </div>
            </div>
            {/* Monthly progress indicator */}
            <div className="mt-3 pt-3 border-t border-purple-500/20 text-center">
              <p className="text-xs text-slate-300">
                🗓️ Ce mois-ci : <span className="text-emerald-400 font-bold">{totalActionsThisMonth}</span> action{totalActionsThisMonth > 1 ? 's' : ''} validée{totalActionsThisMonth > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Not authenticated message */}
        {!isAuthenticated && (
          <div className="bg-amber-900/30 p-4 rounded-xl border border-amber-500/30 mb-4 text-center">
            <p className="text-amber-300">
              💡 Connecte-toi pour enregistrer tes actions et gagner des points de vertu !
            </p>
          </div>
        )}

        {/* Virtues Grid */}
        {virtues && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(virtues).map(([virtueId, virtue]) => {
              const config = VIRTUES_CONFIG[virtueId] || {};
              const isSelected = selectedVirtue?.id === virtueId;
              const points = getTotalPoints(virtueId);
              
              return (
                <div
                  key={virtueId}
                  className={`rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[1.02]' 
                      : 'border-slate-700 hover:border-slate-500'
                  }`}
                  onClick={() => setSelectedVirtue(isSelected ? null : { id: virtueId, ...virtue })}
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${config.bgGradient || 'from-slate-700 to-slate-800'} p-3`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{config.emoji}</span>
                        <div>
                          <p className="font-bold text-white text-sm">{config.kanji} {config.romaji}</p>
                          <p className="text-white/80 text-xs">{virtue.name}</p>
                        </div>
                      </div>
                      <div className="bg-white/20 px-2 py-1 rounded-full">
                        <p className="text-white font-bold text-sm">10 pts</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions (shown when selected) */}
                  {isSelected && (
                    <div className="bg-slate-800 p-3 space-y-3">
                      {/* Individual Actions */}
                      <div>
                        <p className="text-amber-400 text-xs font-semibold mb-2">🧑 Actions Individuelles (PV)</p>
                        <div className="space-y-1">
                          {virtue.individual_actions.map((action) => {
                            const isCompletedThisMonth = actionsCompletedThisMonth.has(action.id);
                            const isSelected = selectedAction?.id === action.id;
                            
                            return (
                              <button
                                key={action.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isCompletedThisMonth) {
                                    setSelectedAction({ ...action, type: "individual" });
                                  }
                                }}
                                disabled={!isAuthenticated || isCompletedThisMonth}
                                className={`w-full text-left p-2 rounded-lg text-xs transition-all ${
                                  isCompletedThisMonth
                                    ? 'bg-emerald-900/30 border border-emerald-500/50 cursor-default'
                                    : isSelected
                                      ? 'bg-amber-600/50 border border-amber-500'
                                      : 'bg-slate-700/50 hover:bg-slate-700 border border-transparent'
                                } ${!isAuthenticated && !isCompletedThisMonth ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    {isCompletedThisMonth && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                                    <span className={isCompletedThisMonth ? 'text-emerald-300' : 'text-slate-200'}>
                                      {action.name}
                                    </span>
                                  </div>
                                  {isCompletedThisMonth ? (
                                    <span className="text-emerald-400 font-bold text-[10px]">✓ Ce mois</span>
                                  ) : (
                                    <span className="text-amber-400 font-bold">+{action.points} PV</span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Collective Actions */}
                      <div>
                        <p className="text-cyan-400 text-xs font-semibold mb-2">👥 Actions Collectives (PC)</p>
                        <div className="space-y-1">
                          {virtue.collective_actions.map((action) => {
                            const isCompletedThisMonth = actionsCompletedThisMonth.has(action.id);
                            const isSelectedAction = selectedAction?.id === action.id;
                            
                            return (
                              <button
                                key={action.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isCompletedThisMonth) {
                                    setSelectedAction({ ...action, type: "collective" });
                                  }
                                }}
                                disabled={!isAuthenticated || isCompletedThisMonth}
                                className={`w-full text-left p-2 rounded-lg text-xs transition-all ${
                                  isCompletedThisMonth
                                    ? 'bg-emerald-900/30 border border-emerald-500/50 cursor-default'
                                    : isSelectedAction
                                      ? 'bg-cyan-600/50 border border-cyan-500'
                                      : 'bg-slate-700/50 hover:bg-slate-700 border border-transparent'
                                } ${!isAuthenticated && !isCompletedThisMonth ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    {isCompletedThisMonth && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                                    <span className={isCompletedThisMonth ? 'text-emerald-300' : 'text-slate-200'}>
                                      {action.name}
                                    </span>
                                  </div>
                                  {isCompletedThisMonth ? (
                                    <span className="text-emerald-400 font-bold text-[10px]">✓ Ce mois</span>
                                  ) : (
                                    <span className="text-cyan-400 font-bold">+{action.points} PC</span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Action confirmation */}
        {selectedAction && isAuthenticated && (
          <div className="mt-4 p-4 bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl border border-amber-500/30">
            <h4 className="text-amber-400 font-bold mb-2">
              ✅ Valider l'action : {selectedAction.name}
            </h4>
            <p className="text-slate-300 text-sm mb-3">
              Points : <span className={selectedAction.type === "individual" ? "text-amber-400" : "text-cyan-400"}>
                +{selectedAction.points} {selectedAction.type === "individual" ? "PV" : "PC"}
              </span>
            </p>
            
            <Textarea
              placeholder="Note personnelle (optionnel)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white mb-3 text-sm"
              rows={2}
            />
            
            <div className="flex gap-2">
              <Button
                onClick={handleLogAction}
                disabled={loading}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold"
              >
                {loading ? "Enregistrement..." : "🎯 Valider l'action"}
              </Button>
              <Button
                onClick={() => setSelectedAction(null)}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Annuler
              </Button>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-1">Légende :</p>
          <p><span className="text-amber-400">PV</span> = Points Vertu Individuels • <span className="text-cyan-400">PC</span> = Points Collectifs</p>
          <p className="mt-1"><span className="text-emerald-400">✓</span> = Action déjà validée ce mois-ci (limite : 1 fois/mois par action)</p>
          <p className="mt-1 italic">Ces actions reflètent ton engagement personnel dans les valeurs de l'Aïkido.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VirtueActionsPanel;
