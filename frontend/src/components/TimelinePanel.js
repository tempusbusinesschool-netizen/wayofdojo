import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, ChevronDown, ChevronUp } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

// Color mapping for event types
const EVENT_COLORS = {
  amber: "from-amber-600 to-yellow-600 border-amber-500/50",
  yellow: "from-yellow-600 to-amber-600 border-yellow-500/50",
  purple: "from-purple-600 to-indigo-600 border-purple-500/50",
  indigo: "from-indigo-600 to-blue-600 border-indigo-500/50",
  emerald: "from-emerald-600 to-green-600 border-emerald-500/50",
  blue: "from-blue-600 to-cyan-600 border-blue-500/50",
  pink: "from-pink-600 to-rose-600 border-pink-500/50"
};

const EVENT_BG_COLORS = {
  amber: "bg-amber-900/30 border-amber-500/30",
  yellow: "bg-yellow-900/30 border-yellow-500/30",
  purple: "bg-purple-900/30 border-purple-500/30",
  indigo: "bg-indigo-900/30 border-indigo-500/30",
  emerald: "bg-emerald-900/30 border-emerald-500/30",
  blue: "bg-blue-900/30 border-blue-500/30",
  pink: "bg-pink-900/30 border-pink-500/30"
};

function TimelinePanel({ isOpen, onClose, isAuthenticated }) {
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchTimeline();
    }
  }, [isOpen, isAuthenticated]);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/auth/timeline`);
      setTimeline(response.data);
    } catch (error) {
      console.error("Error fetching timeline:", error);
    } finally {
      setLoading(false);
    }
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

  const formatRelativeDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Aujourd'hui";
      if (diffDays === 1) return "Hier";
      if (diffDays < 7) return `Il y a ${diffDays} jours`;
      if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine(s)`;
      if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
      return `Il y a ${Math.floor(diffDays / 365)} an(s)`;
    } catch {
      return "";
    }
  };

  const displayedEvents = showAll 
    ? timeline?.events || [] 
    : (timeline?.events || []).slice(0, 10);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-500/40 text-white max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-amber-500/20 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
              Mon Parcours Aïkido
            </span>
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {timeline?.user_name && `${timeline.user_name} • `}
            {timeline?.total_events || 0} événement{(timeline?.total_events || 0) > 1 ? 's' : ''} dans ton parcours
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 pr-2">
          {!isAuthenticated ? (
            <div className="text-center py-12">
              <p className="text-6xl mb-4">🔒</p>
              <p className="text-slate-400">Connecte-toi pour voir ton parcours</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Chargement de ton parcours...</p>
            </div>
          ) : !timeline?.events?.length ? (
            <div className="text-center py-12">
              <p className="text-6xl mb-4">🌱</p>
              <p className="text-slate-300 font-semibold mb-2">Ton parcours commence ici !</p>
              <p className="text-slate-400 text-sm">
                Pratique des techniques, valide des actions de vertu,<br/>
                et regarde ton histoire s'écrire...
              </p>
            </div>
          ) : (
            <>
              {/* Timeline */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-purple-500 to-emerald-500"></div>
                
                {/* Events */}
                <div className="space-y-4">
                  {displayedEvents.map((event, index) => (
                    <div key={index} className="relative pl-16">
                      {/* Timeline dot */}
                      <div className={`absolute left-4 w-5 h-5 rounded-full bg-gradient-to-br ${EVENT_COLORS[event.color] || EVENT_COLORS.amber} border-2 shadow-lg`}></div>
                      
                      {/* Event card */}
                      <div className={`${EVENT_BG_COLORS[event.color] || EVENT_BG_COLORS.amber} rounded-xl p-4 border hover:scale-[1.02] transition-all`}>
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{event.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-bold text-white">{event.title}</h4>
                            <p className="text-slate-300 text-sm">{event.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                              <Calendar className="w-3 h-3" />
                              <span>{formatRelativeDate(event.date)}</span>
                              <span className="text-slate-600">•</span>
                              <span>{formatDate(event.date)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Show more/less button */}
              {timeline?.events?.length > 10 && (
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => setShowAll(!showAll)}
                    variant="ghost"
                    className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/30"
                  >
                    {showAll ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Voir moins
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Voir tout ({timeline.events.length} événements)
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-amber-500/20 pt-4 mt-2">
          <p className="text-center text-xs text-slate-500 italic">
            🎌 Chaque étape compte sur le chemin de l'Aïkido
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TimelinePanel;
