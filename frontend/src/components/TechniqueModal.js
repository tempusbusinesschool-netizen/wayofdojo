import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, BookOpen, Flame } from "lucide-react";
import { MASTERY_LEVELS } from "@/constants";

function TechniqueModal({ technique, kyuName, kyuColor, isOpen, onClose, onUpdateMastery, onPractice }) {
  if (!technique) return null;
  
  const mastery = MASTERY_LEVELS[technique.mastery_level] || MASTERY_LEVELS.not_started;
  const hasImage = technique.image_url && technique.image_url.length > 0;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge style={{ backgroundColor: kyuColor }} className="text-white text-xs">
              {kyuName}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-white">
            {technique.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {hasImage && (
            <div className="rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
              <img 
                src={technique.image_url} 
                alt={technique.name}
                className="w-full h-auto max-h-64 object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
          
          {technique.description && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-300 text-sm leading-relaxed">{technique.description}</p>
            </div>
          )}
          
          {technique.key_points && technique.key_points.length > 0 && (
            <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-800/50">
              <h4 className="text-cyan-400 font-semibold text-sm mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Points clés d&apos;exécution
              </h4>
              <ul className="space-y-1.5">
                {technique.key_points.map((point, idx) => (
                  <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {technique.practice_tips && technique.practice_tips.length > 0 && (
            <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-800/50">
              <h4 className="text-emerald-400 font-semibold text-sm mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Conseils de pratique
              </h4>
              <ul className="space-y-1.5">
                {technique.practice_tips.map((tip, idx) => (
                  <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h4 className="text-white font-semibold text-sm mb-3">Niveau de maîtrise</h4>
            <Select 
              value={technique.mastery_level || "not_started"} 
              onValueChange={(value) => onUpdateMastery(technique.id, value)}
            >
              <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {Object.entries(MASTERY_LEVELS).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {config.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {technique.practice_count || 0} session(s) enregistrée(s)
              </span>
              <Button 
                size="sm" 
                onClick={() => onPractice(technique.id)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <Flame className="w-4 h-4 mr-1" />
                +1 Session
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TechniqueModal;
