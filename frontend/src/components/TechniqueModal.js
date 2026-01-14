import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Star, Lock } from "lucide-react";
import { MASTERY_LEVELS } from "@/constants";
import { toast } from "sonner";
import TechniqueCelebration from "./TechniqueCelebration";

function TechniqueModal({ technique, kyuName, kyuColor, isOpen, onClose, onUpdateMastery, onPractice, isAuthenticated }) {
  // État pour l'animation de célébration
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationTechnique, setCelebrationTechnique] = useState('');

  if (!technique) return null;
  
  const mastery = MASTERY_LEVELS[technique.mastery_level] || MASTERY_LEVELS.not_started;
  const hasImage = technique.image_url && technique.image_url.length > 0;
  const isMastered = technique.mastery_level === 'mastered';
  const isLearning = technique.mastery_level === 'learning';
  const isPracticed = technique.mastery_level === 'practiced';
  
  // Fun encouragement messages
  const getEncouragement = () => {
    if (isMastered) return { emoji: "🏆", text: "Bravo Champion ! Tu maîtrises cette technique !", color: "text-emerald-300" };
    if (isPracticed) return { emoji: "🎯", text: "Super ! Continue à t'entraîner !", color: "text-blue-300" };
    if (isLearning) return { emoji: "📖", text: "Tu es sur la bonne voie !", color: "text-amber-300" };
    return { emoji: "🌟", text: "Prêt à découvrir cette technique ?", color: "text-purple-300" };
  };
  
  const encouragement = getEncouragement();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl border-2 text-white max-h-[90vh] overflow-y-auto
        ${isMastered 
          ? 'bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-900 border-emerald-500/50' 
          : isPracticed 
            ? 'bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 border-blue-500/50'
            : isLearning
              ? 'bg-gradient-to-br from-amber-900 via-orange-900 to-amber-900 border-amber-500/50'
              : 'bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 border-purple-500/50'
        }`}
      >
        {/* Sparkles for mastered */}
        {isMastered && (
          <div className="absolute top-4 right-12 animate-pulse">
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
        )}
        
        <DialogHeader>
          {/* Grade badge - fun style */}
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg flex items-center gap-1"
              style={{ backgroundColor: kyuColor }}
            >
              <span>🥋</span>
              {kyuName}
            </div>
            {/* Status badge */}
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1
              ${isMastered 
                ? 'bg-emerald-500/30 text-emerald-300' 
                : isPracticed 
                  ? 'bg-blue-500/30 text-blue-300'
                  : isLearning
                    ? 'bg-amber-500/30 text-amber-300'
                    : 'bg-slate-700/50 text-slate-300'
              }`}
            >
              <span>{mastery.emoji}</span>
              {mastery.label}
            </div>
          </div>
          
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            {technique.name}
            {isMastered && <span className="animate-bounce">🏆</span>}
          </DialogTitle>
          
          {/* Encouragement message */}
          <div className={`mt-2 flex items-center gap-2 ${encouragement.color}`}>
            <span className="text-2xl">{encouragement.emoji}</span>
            <span className="text-sm font-medium">{encouragement.text}</span>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Image with fun border */}
          {hasImage && (
            <div className={`rounded-2xl overflow-hidden border-4 shadow-xl
              ${isMastered 
                ? 'border-emerald-500/50 shadow-emerald-500/20' 
                : isPracticed 
                  ? 'border-blue-500/50 shadow-blue-500/20'
                  : isLearning
                    ? 'border-amber-500/50 shadow-amber-500/20'
                    : 'border-purple-500/50 shadow-purple-500/20'
              }`}
            >
              <img 
                src={technique.image_url} 
                alt={technique.name}
                className="w-full h-auto max-h-64 object-contain bg-slate-800"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
          
          {/* Description - kid friendly */}
          {technique.description && (
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📝</span>
                <h4 className="text-white font-bold">C'est quoi cette technique ?</h4>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{technique.description}</p>
            </div>
          )}
          
          {/* Key points - fun style */}
          {technique.key_points && technique.key_points.length > 0 && (
            <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-2xl p-4 border border-cyan-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🎯</span>
                <h4 className="text-cyan-300 font-bold">Les secrets de cette technique</h4>
              </div>
              <ul className="space-y-2">
                {technique.key_points.map((point, idx) => (
                  <li key={idx} className="text-slate-200 text-sm flex items-start gap-2 bg-slate-800/40 rounded-lg p-2">
                    <span className="text-lg">💡</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Practice tips - fun style */}
          {technique.practice_tips && technique.practice_tips.length > 0 && (
            <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-2xl p-4 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🥋</span>
                <h4 className="text-emerald-300 font-bold">Conseils du Sensei</h4>
              </div>
              <ul className="space-y-2">
                {technique.practice_tips.map((tip, idx) => (
                  <li key={idx} className="text-slate-200 text-sm flex items-start gap-2 bg-slate-800/40 rounded-lg p-2">
                    <span className="text-lg">⭐</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Progress section - gamified */}
          <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-2xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🎮</span>
              <h4 className="text-purple-300 font-bold">Ta progression</h4>
            </div>
            
            {/* Mastery level selector - fun buttons */}
            <div className="mb-4">
              <p className="text-xs text-slate-400 mb-2">Où en es-tu ?</p>
              <Select 
                value={technique.mastery_level || "not_started"} 
                onValueChange={(value) => {
                  if (!isAuthenticated) {
                    toast.error("🔒 Inscrivez-vous pour suivre votre progression");
                    return;
                  }
                  onUpdateMastery(technique.id, value);
                  onClose();
                }}
                disabled={!isAuthenticated}
              >
                <SelectTrigger className={`w-full border-2 text-white font-medium
                  ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}
                  ${isMastered 
                    ? 'bg-emerald-800/50 border-emerald-500/50' 
                    : isPracticed 
                      ? 'bg-blue-800/50 border-blue-500/50'
                      : isLearning
                        ? 'bg-amber-800/50 border-amber-500/50'
                        : 'bg-slate-800/50 border-slate-600'
                  }`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {Object.entries(MASTERY_LEVELS).map(([key, config]) => (
                    <SelectItem key={key} value={key} className="text-white hover:bg-slate-700 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{config.emoji}</span>
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Sessions counter - fun style */}
            <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-white font-bold text-lg">{technique.practice_count || 0}</p>
                  <p className="text-slate-400 text-xs">séance{(technique.practice_count || 0) !== 1 ? 's' : ''} au dojo</p>
                </div>
              </div>
              
              <Button 
                size="lg" 
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error("🔒 Inscrivez-vous pour enregistrer votre pratique");
                    return;
                  }
                  onPractice(technique.id);
                  onClose();
                }}
                className={`bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold px-6 rounded-xl shadow-lg shadow-green-500/30 transform hover:scale-105 transition-all ${!isAuthenticated ? 'opacity-50' : ''}`}
              >
                {!isAuthenticated && <Lock className="w-4 h-4 mr-2" />}
                <Star className="w-5 h-5 mr-2" />
                J'ai pratiqué ! ✨
              </Button>
            </div>
            
            {/* Motivational message based on practice count */}
            {technique.practice_count > 0 && (
              <div className="mt-3 text-center">
                <p className="text-sm">
                  {technique.practice_count >= 10 ? (
                    <span className="text-yellow-300">🌟 Wahou ! Tu es un vrai guerrier ! 🌟</span>
                  ) : technique.practice_count >= 5 ? (
                    <span className="text-green-300">💪 Super régulier ! Continue comme ça !</span>
                  ) : technique.practice_count >= 3 ? (
                    <span className="text-blue-300">🚀 Tu progresses bien !</span>
                  ) : (
                    <span className="text-purple-300">🎯 Beau début ! Le chemin continue...</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TechniqueModal;
