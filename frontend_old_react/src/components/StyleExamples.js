import React from "react";

// Example A: Grille colorée (comme les grades)
export function ExampleGridColored() {
  const blocks = [
    { emoji: "🥷", title: "Ma Progression", subtitle: "Ninja", gradient: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/40" },
    { emoji: "👣", title: "Déplacements", subtitle: "Footwork", gradient: "from-pink-500 to-rose-600", shadow: "shadow-pink-500/40" },
    { emoji: "⚔️", title: "Techniques", subtitle: "206 moves", gradient: "from-cyan-500 to-blue-600", shadow: "shadow-cyan-500/40" },
    { emoji: "🎎", title: "7 Vertus", subtitle: "Hakama", gradient: "from-purple-500 to-indigo-600", shadow: "shadow-purple-500/40" },
    { emoji: "📓", title: "Journal", subtitle: "Personnel", gradient: "from-green-500 to-emerald-600", shadow: "shadow-green-500/40" },
    { emoji: "🏆", title: "Défis", subtitle: "Badges", gradient: "from-yellow-500 to-amber-600", shadow: "shadow-yellow-500/40" },
  ];

  return (
    <div className="p-6 bg-slate-900 rounded-2xl">
      <h2 className="text-white text-xl font-bold mb-4 text-center">Option A: Grille Colorée</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {blocks.map((block, idx) => (
          <div 
            key={idx}
            className={`bg-gradient-to-br ${block.gradient} rounded-xl p-4 text-center cursor-pointer transform hover:scale-105 transition-all ${block.shadow} shadow-lg`}
          >
            <div className="text-4xl mb-2">{block.emoji}</div>
            <p className="text-white font-bold">{block.title}</p>
            <p className="text-white/70 text-xs">{block.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example B: Cards avec icônes et descriptions
export function ExampleCards() {
  const blocks = [
    { emoji: "🥷", title: "Ma Progression Ninja", desc: "Suis ta progression du 5e KYU jusqu'au Dan. Visualise tes acquis et tes objectifs." },
    { emoji: "👣", title: "Les Déplacements", desc: "Apprends les pas fondamentaux : Ayumi ashi, Okuri ashi, Tenkan..." },
    { emoji: "⚔️", title: "Les Techniques", desc: "206 techniques à découvrir, pratiquer et maîtriser à ton rythme." },
    { emoji: "🎎", title: "Les 7 Vertus", desc: "Cultive les valeurs du Hakama : Gi, Yu, Jin, Rei, Makoto, Meiyo, Chugi." },
    { emoji: "📓", title: "Mon Journal", desc: "Ton carnet personnel pour noter tes réflexions et progrès." },
    { emoji: "🏆", title: "Défis & Badges", desc: "Gagne des points, débloque des badges et relève des défis !" },
  ];

  return (
    <div className="p-6 bg-slate-900 rounded-2xl">
      <h2 className="text-white text-xl font-bold mb-4 text-center">Option B: Cards Descriptives</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blocks.map((block, idx) => (
          <div 
            key={idx}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4 cursor-pointer hover:border-cyan-500 hover:bg-slate-700/50 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{block.emoji}</span>
              <h3 className="text-white font-bold">{block.title}</h3>
            </div>
            <p className="text-slate-400 text-sm">{block.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example C: Bento Grid (asymétrique moderne)
export function ExampleBento() {
  return (
    <div className="p-6 bg-slate-900 rounded-2xl">
      <h2 className="text-white text-xl font-bold mb-4 text-center">Option C: Bento Grid Moderne</h2>
      <div className="grid grid-cols-4 grid-rows-3 gap-3 h-[400px]">
        {/* Large block */}
        <div className="col-span-2 row-span-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 cursor-pointer hover:scale-[1.02] transition-all shadow-lg shadow-amber-500/30">
          <div className="text-5xl mb-3">🥷</div>
          <h3 className="text-white text-xl font-bold">Ma Progression Ninja</h3>
          <p className="text-white/70 text-sm mt-2">Du 5e KYU au Dan</p>
          <div className="mt-4 flex gap-2">
            <span className="bg-white/20 px-2 py-1 rounded-full text-white text-xs">9 grades</span>
            <span className="bg-white/20 px-2 py-1 rounded-full text-white text-xs">206 techniques</span>
          </div>
        </div>
        
        {/* Medium blocks */}
        <div className="col-span-2 row-span-1 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-4">
          <span className="text-4xl">⚔️</span>
          <div>
            <h3 className="text-white font-bold">Les Techniques</h3>
            <p className="text-white/70 text-xs">206 mouvements à maîtriser</p>
          </div>
        </div>
        
        <div className="col-span-1 row-span-1 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition-all shadow-lg shadow-pink-500/30 flex flex-col justify-center items-center">
          <span className="text-3xl">👣</span>
          <h3 className="text-white font-bold text-sm mt-1">Déplacements</h3>
        </div>
        
        <div className="col-span-1 row-span-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition-all shadow-lg shadow-purple-500/30 flex flex-col justify-center items-center">
          <span className="text-3xl">🎎</span>
          <h3 className="text-white font-bold text-sm mt-1">7 Vertus</h3>
        </div>
        
        {/* Bottom row */}
        <div className="col-span-1 row-span-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition-all shadow-lg shadow-green-500/30 flex flex-col justify-center items-center">
          <span className="text-3xl">📓</span>
          <h3 className="text-white font-bold text-sm mt-1">Journal</h3>
        </div>
        
        <div className="col-span-1 row-span-1 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition-all shadow-lg shadow-yellow-500/30 flex flex-col justify-center items-center">
          <span className="text-3xl">🏆</span>
          <h3 className="text-white font-bold text-sm mt-1">Défis</h3>
        </div>
      </div>
    </div>
  );
}

// Main demo component showing all 3 examples
function StyleExamples() {
  return (
    <div className="min-h-screen bg-slate-950 p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center text-white mb-8">
        🎨 Choisissez votre style préféré
      </h1>
      <ExampleGridColored />
      <ExampleCards />
      <ExampleBento />
    </div>
  );
}

export default StyleExamples;
