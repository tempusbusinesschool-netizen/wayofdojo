import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target, Award, Circle, ChevronDown, ChevronUp, Swords, MapPin, Footprints, Sparkles } from "lucide-react";
import { DEPLACEMENTS_DATA } from "@/constants";

function DeplacementsSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Fun emoji decorations for directions
  const directionEmojis = {
    "mae": "⬆️",
    "ushiro": "⬇️", 
    "migi": "➡️",
    "hidari": "⬅️"
  };

  // Fun colors for the three steps
  const stepColors = [
    { bg: "from-green-500 to-emerald-600", shadow: "shadow-green-500/40", emoji: "🚶" },
    { bg: "from-blue-500 to-cyan-600", shadow: "shadow-blue-500/40", emoji: "🏃" },
    { bg: "from-purple-500 to-pink-600", shadow: "shadow-purple-500/40", emoji: "🌀" }
  ];

  return (
    <Card className="mb-6 bg-gradient-to-br from-indigo-900/60 via-purple-900/60 to-pink-900/60 border-2 border-purple-500/40 overflow-hidden">
      <CardHeader 
        className="cursor-pointer hover:bg-purple-800/30 transition-all duration-300 rounded-t-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Fun animated icon */}
            <div className="relative">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg shadow-orange-500/40 transform hover:scale-110 transition-transform">
                <span className="text-3xl">🦶</span>
              </div>
              <div className="absolute -top-1 -right-1 text-xl animate-bounce">✨</div>
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                {DEPLACEMENTS_DATA.title} 
                <span className="text-2xl animate-pulse">👣</span>
              </CardTitle>
              <CardDescription className="text-purple-300 text-sm md:text-base">
                🎯 Apprends à bouger comme un vrai ninja ! 🥷
              </CardDescription>
            </div>
          </div>
          <div className={`p-2 rounded-full bg-purple-600/50 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6 pt-2">
          {/* Fun introduction box */}
          <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 rounded-2xl p-4 border-2 border-amber-500/30">
            <div className="flex items-start gap-3">
              <span className="text-3xl">📖</span>
              <div>
                <h4 className="text-amber-400 font-bold mb-2">Le secret des maîtres 🏯</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Savoir bien se déplacer, c&apos;est le super-pouvoir des aïkidokas ! 
                  C&apos;est comme apprendre une danse secrète qui te rend plus fort et plus agile ! 💪
                </p>
              </div>
            </div>
          </div>

          {/* Directions - Fun grid */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🧭</span>
              Les 4 directions magiques
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DEPLACEMENTS_DATA.directions.items.map((dir, idx) => (
                <div 
                  key={idx} 
                  className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-xl p-4 text-center transform hover:scale-105 hover:-rotate-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/30"
                >
                  <div className="text-3xl mb-2">{directionEmojis[dir.name] || "🔵"}</div>
                  <p className="text-white font-bold text-lg uppercase">{dir.name}</p>
                  <p className="text-cyan-200 text-xs">{dir.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The three essential steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-2xl">👟</span>
              Les 3 pas magiques du ninja
              <span className="text-xl animate-bounce">⭐</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DEPLACEMENTS_DATA.troisPas.pas.map((pas, idx) => (
                <div 
                  key={idx}
                  className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br ${stepColors[idx].bg} ${stepColors[idx].shadow} shadow-lg transform hover:scale-105 transition-all cursor-pointer`}
                >
                  {/* Floating emoji */}
                  <div className="absolute top-2 right-2 text-3xl opacity-50 animate-pulse">
                    {stepColors[idx].emoji}
                  </div>
                  
                  {/* Step number */}
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-3">
                    <span className="text-white font-bold text-xl">{idx + 1}</span>
                  </div>
                  
                  <h4 className="text-white font-bold text-lg mb-2">{pas.name}</h4>
                  <p className="text-white/80 text-xs leading-relaxed line-clamp-3">
                    {pas.name === "Ayumi ashi" && "Le pas naturel, comme quand tu marches normalement ! 🚶"}
                    {pas.name === "Okuri ashi / Tsugi ashi" && "Le pas chassé, comme si tes pieds étaient reliés par un élastique ! 🏃"}
                    {pas.name === "Tenkan" && "Le pivot magique pour tourner comme une toupie ! 🌀"}
                    {!["Ayumi ashi", "Okuri ashi / Tsugi ashi", "Tenkan"].includes(pas.name) && "Un pas secret à maîtriser ! ✨"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Fun pose du pied section */}
          <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 rounded-2xl p-4 border-2 border-pink-500/30">
            <div className="flex items-start gap-3">
              <div className="text-4xl">🦶</div>
              <div>
                <h4 className="text-pink-400 font-bold mb-2 flex items-center gap-2">
                  Comment poser ton pied ? 
                  <span className="text-sm bg-pink-500 text-white px-2 py-0.5 rounded-full">Astuce ninja</span>
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  🎯 <strong className="text-pink-300">La pointe d&apos;abord !</strong> Comme un chat qui marche en silence... 🐱
                  <br/>
                  Garde toujours ton talon légèrement levé pour être prêt à bondir ! 🦘
                </p>
              </div>
            </div>
          </div>

          {/* Motivational footer */}
          <div className="text-center py-4">
            <p className="text-purple-300 text-sm mb-2">
              🌟 Entraîne-toi chaque jour et tu deviendras un maître du déplacement ! 🌟
            </p>
            <div className="flex justify-center gap-2 text-2xl">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🥋</span>
              <span className="animate-bounce" style={{ animationDelay: '100ms' }}>👣</span>
              <span className="animate-bounce" style={{ animationDelay: '200ms' }}>🎯</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>⭐</span>
              <span className="animate-bounce" style={{ animationDelay: '400ms' }}>🏆</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default DeplacementsSection;
