import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { MASTERY_LEVELS } from "@/constants";

function TechniqueCard({ technique, onView }) {
  const mastery = MASTERY_LEVELS[technique.mastery_level] || MASTERY_LEVELS.not_started;
  const MasteryIcon = mastery.icon;
  
  return (
    <Card className="group bg-slate-800/50 border-slate-700 hover:border-slate-500 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white text-sm leading-tight mb-1 truncate">
              {technique.name}
            </h4>
            <div className="flex items-center gap-2">
              <Badge className={`${mastery.color} text-white text-xs px-2 py-0`}>
                <MasteryIcon className="w-3 h-3 mr-1" />
                {mastery.label}
              </Badge>
              {technique.practice_count > 0 && (
                <span className="text-xs text-slate-500">
                  {technique.practice_count} sessions
                </span>
              )}
            </div>
          </div>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onView(technique)}
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default TechniqueCard;
