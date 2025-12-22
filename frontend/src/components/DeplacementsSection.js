import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target, Award, Circle, ChevronDown, ChevronUp, Swords, MapPin } from "lucide-react";
import { DEPLACEMENTS_DATA } from "@/constants";

function DeplacementsSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
      <CardHeader 
        className="cursor-pointer hover:bg-slate-800/50 transition-colors rounded-t-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">{DEPLACEMENTS_DATA.title}</CardTitle>
              <CardDescription className="text-slate-400">{DEPLACEMENTS_DATA.subtitle}</CardDescription>
            </div>
          </div>
          <div className="text-slate-400">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {DEPLACEMENTS_DATA.introduction}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Swords className="w-5 h-5 text-orange-400" />
              {DEPLACEMENTS_DATA.principaux.title}
            </h3>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                {DEPLACEMENTS_DATA.principaux.intro}
              </p>
              <ul className="space-y-1 ml-4 mb-3">
                {DEPLACEMENTS_DATA.principaux.points.map((point, idx) => (
                  <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    {point}
                  </li>
                ))}
              </ul>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                {DEPLACEMENTS_DATA.principaux.conclusion}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-400" />
              {DEPLACEMENTS_DATA.directions.title}
            </h3>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-300 text-sm mb-3">{DEPLACEMENTS_DATA.directions.intro}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                {DEPLACEMENTS_DATA.directions.items.map((dir, idx) => (
                  <div key={idx} className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <p className="text-orange-400 font-semibold text-lg">{dir.name}</p>
                    <p className="text-slate-400 text-xs">{dir.description}</p>
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-sm italic">{DEPLACEMENTS_DATA.directions.conclusion}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Circle className="w-5 h-5 text-orange-400" />
              {DEPLACEMENTS_DATA.posePied.title}
            </h3>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {DEPLACEMENTS_DATA.posePied.content}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-400" />
              {DEPLACEMENTS_DATA.troisPas.title}
            </h3>
            <div className="space-y-3">
              {DEPLACEMENTS_DATA.troisPas.pas.map((pas, idx) => (
                <Card key={idx} className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <h4 className="text-orange-400 font-semibold mb-2">{pas.name}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                      {pas.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default DeplacementsSection;
