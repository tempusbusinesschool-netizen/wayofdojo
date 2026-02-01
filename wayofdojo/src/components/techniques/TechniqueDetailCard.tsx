'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronUp, Info, AlertTriangle, 
  CheckCircle2, XCircle, Play, BookOpen, ExternalLink, Youtube
} from 'lucide-react';
import type { Mouvement } from '@/data/aikido/types';
import { CATEGORIES_MOUVEMENTS } from '@/data/aikido/techniques-by-grade';
import { getVideoLinks, type TechniqueVideos } from '@/data/aikido/video-links';

interface TechniqueDetailCardProps {
  technique: Mouvement;
  compact?: boolean;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TechniqueDetailCard - Carte détaillée d'une technique ou mouvement
 * ═══════════════════════════════════════════════════════════════════════════════
 */
export const TechniqueDetailCard: React.FC<TechniqueDetailCardProps> = ({ 
  technique, 
  compact = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Récupérer les liens vidéo pour cette technique
  const videoLinks = getVideoLinks(technique.id);
  
  const categoryInfo = CATEGORIES_MOUVEMENTS[technique.categorie] || {
    label: technique.categorie,
    emoji: '📚',
    color: 'from-slate-500 to-slate-600'
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        data-testid={`technique-${technique.id}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{categoryInfo.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{technique.nom}</span>
              {technique.nom_japonais && (
                <span className="text-amber-400 text-xs">{technique.nom_japonais}</span>
              )}
              {videoLinks && (
                <Youtube className="w-3.5 h-3.5 text-red-500" />
              )}
            </div>
            {technique.traduction && (
              <p className="text-slate-400 text-xs truncate">{technique.traduction}</p>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-3">
                {technique.description && (
                  <p className="text-slate-300 text-xs leading-relaxed">{technique.description}</p>
                )}
                
                {technique.points_cles && technique.points_cles.length > 0 && (
                  <div>
                    <p className="text-emerald-400 text-xs font-bold mb-1">Points clés :</p>
                    <ul className="space-y-1">
                      {technique.points_cles.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {technique.erreurs_communes && technique.erreurs_communes.length > 0 && (
                  <div>
                    <p className="text-rose-400 text-xs font-bold mb-1">Erreurs à éviter :</p>
                    <ul className="space-y-1">
                      {technique.erreurs_communes.map((erreur, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <XCircle className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                          {erreur}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Liens vidéo YouTube */}
                {videoLinks && (
                  <div className="pt-2">
                    <a
                      href={videoLinks.primary.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg border border-red-500/30 transition-colors group"
                    >
                      <Youtube className="w-4 h-4 text-red-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">
                          {videoLinks.primary.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {videoLinks.primary.channel}
                          {videoLinks.primary.duration && ` • ${videoLinks.primary.duration}`}
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                    </a>
                    
                    {videoLinks.alternatives && videoLinks.alternatives.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-slate-500">Autres vidéos :</p>
                        {videoLinks.alternatives.map((alt, idx) => (
                          <a
                            key={idx}
                            href={alt.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 px-2 py-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-xs text-slate-300 hover:text-white"
                          >
                            <Play className="w-3 h-3 text-slate-400" />
                            <span className="truncate flex-1">{alt.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Version complète (non-compact)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden"
      data-testid={`technique-full-${technique.id}`}
    >
      {/* Header */}
      <div 
        className={`bg-gradient-to-r ${categoryInfo.color} p-4 cursor-pointer`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{categoryInfo.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{technique.nom}</h3>
                {technique.nom_japonais && (
                  <span className="text-white/70 text-sm">({technique.nom_japonais})</span>
                )}
              </div>
              {technique.traduction && (
                <p className="text-white/60 text-sm">{technique.traduction}</p>
              )}
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-white/70" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/70" />
          )}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Description */}
              {technique.description && (
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-sm leading-relaxed">{technique.description}</p>
                </div>
              )}

              {/* Principe */}
              {technique.principe && (
                <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/30">
                  <p className="text-amber-300 text-sm">
                    <strong>Principe :</strong> {technique.principe}
                  </p>
                </div>
              )}

              {/* Variantes */}
              {technique.variantes && technique.variantes.length > 0 && (
                <div>
                  <p className="text-purple-400 text-sm font-bold mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Variantes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {technique.variantes.map((variante, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30"
                      >
                        {variante}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Points clés */}
              {technique.points_cles && technique.points_cles.length > 0 && (
                <div>
                  <p className="text-emerald-400 text-sm font-bold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Points clés
                  </p>
                  <ul className="grid gap-2">
                    {technique.points_cles.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300 bg-emerald-500/10 rounded-lg px-3 py-2 border border-emerald-500/20">
                        <span className="text-emerald-400 font-bold">{idx + 1}.</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Erreurs communes */}
              {technique.erreurs_communes && technique.erreurs_communes.length > 0 && (
                <div>
                  <p className="text-rose-400 text-sm font-bold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Erreurs à éviter
                  </p>
                  <ul className="space-y-2">
                    {technique.erreurs_communes.map((erreur, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        {erreur}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Précautions */}
              {technique.precautions && (
                <div className="bg-rose-500/10 rounded-xl p-3 border border-rose-500/30 flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  <p className="text-rose-300 text-sm">{technique.precautions}</p>
                </div>
              )}

              {/* Articulations (si applicable) */}
              {technique.articulations && technique.articulations.length > 0 && (
                <div>
                  <p className="text-cyan-400 text-sm font-bold mb-2">Articulations impliquées</p>
                  <div className="flex flex-wrap gap-2">
                    {technique.articulations.map((art, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30"
                      >
                        {art}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bouton vidéo */}
              {technique.video?.placeholder && (
                <button 
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl text-white font-medium flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                  disabled
                >
                  <Play className="w-4 h-4" /> Voir la démonstration (bientôt disponible)
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TechniqueDetailCard;
