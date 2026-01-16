import React from 'react';

/**
 * Template C : "Village Dojo" - Layout asymétrique japonais
 */
const VisitorTemplatePreviewC = () => {
  return (
    <div className="p-4 bg-gradient-to-br from-rose-950/50 via-slate-900 to-indigo-950/50 rounded-3xl border-2 border-rose-500/30 relative overflow-hidden">
      {/* Fond japonais */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px),
                           repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px)`
        }} />
      </div>

      {/* Montagne Fuji en fond */}
      <div className="absolute bottom-0 right-0 opacity-10">
        <svg width="300" height="200" viewBox="0 0 300 200">
          <polygon points="150,20 280,180 20,180" fill="white" />
          <polygon points="150,20 180,60 120,60" fill="#e0f2fe" />
        </svg>
      </div>

      {/* Titre */}
      <div className="text-center mb-4 relative z-10">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-rose-400">
          🏯 Village du Dojo Ninja 🏯
        </h2>
        <p className="text-rose-300/70 text-sm">Explore chaque bâtiment du village !</p>
      </div>

      {/* Layout asymétrique style Bento */}
      <div className="relative z-10 grid grid-cols-4 gap-3 auto-rows-[100px]">
        
        {/* Bloc 1 - GRAND (Profil) - 2x2 */}
        <div className="col-span-2 row-span-2 relative rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 border-4 border-amber-400/50 shadow-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all">
          <div className="absolute top-2 left-2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center border-4 border-amber-600 shadow-lg z-10">
            <span className="text-amber-900 font-black text-xl">1</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <span className="text-6xl mb-2 group-hover:scale-110 transition-transform">🥷</span>
            <h3 className="text-white font-black text-xl">Mon Profil Ninja</h3>
            <p className="text-white/70 text-sm">Ta carte d'identité secrète</p>
            <div className="flex gap-2 mt-2">
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs text-white">🦁 Animal</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs text-white">⭐ 125 XP</span>
            </div>
          </div>
          {/* Torii gate decoration */}
          <div className="absolute top-2 right-2 text-3xl opacity-30">⛩️</div>
        </div>

        {/* Bloc 2 - Medium */}
        <div className="col-span-1 row-span-1 relative rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 border-2 border-cyan-300/50 shadow-xl overflow-hidden group cursor-pointer hover:scale-105 transition-all">
          <div className="absolute top-1 left-1 w-7 h-7 bg-cyan-300 rounded-full flex items-center justify-center shadow z-10">
            <span className="text-cyan-900 font-black">2</span>
          </div>
          <div className="h-full flex flex-col items-center justify-center">
            <span className="text-3xl group-hover:scale-110 transition-transform">🥋</span>
            <h3 className="text-white font-bold text-sm">206+ Techniques</h3>
          </div>
        </div>

        {/* Bloc 3 */}
        <div className="col-span-1 row-span-1 relative rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 border-2 border-pink-300/50 shadow-xl overflow-hidden group cursor-pointer hover:scale-105 transition-all">
          <div className="absolute top-1 left-1 w-7 h-7 bg-pink-300 rounded-full flex items-center justify-center shadow z-10">
            <span className="text-pink-900 font-black">3</span>
          </div>
          <div className="h-full flex flex-col items-center justify-center">
            <span className="text-3xl group-hover:scale-110 transition-transform">🎯</span>
            <h3 className="text-white font-bold text-sm">Défis</h3>
          </div>
        </div>

        {/* Bloc 4 - Large horizontal */}
        <div className="col-span-2 row-span-1 relative rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 border-2 border-amber-300/50 shadow-xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all">
          <div className="absolute top-1 left-1 w-7 h-7 bg-amber-300 rounded-full flex items-center justify-center shadow z-10">
            <span className="text-amber-900 font-black">4</span>
          </div>
          <div className="h-full flex items-center justify-center gap-4 px-4">
            <span className="text-4xl group-hover:scale-110 transition-transform">☯️</span>
            <div>
              <h3 className="text-white font-bold">Les 7 Vertus Magiques</h3>
              <div className="flex gap-1 mt-1">
                <span>🦁</span><span>🐯</span><span>🐢</span><span>🐘</span><span>🐼</span><span>🦉</span><span>🦅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bloc 5 */}
        <div className="col-span-1 row-span-1 relative rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 border-2 border-slate-400/50 shadow-xl overflow-hidden group cursor-pointer hover:scale-105 transition-all">
          <div className="absolute top-1 left-1 w-7 h-7 bg-slate-300 rounded-full flex items-center justify-center shadow z-10">
            <span className="text-slate-900 font-black">5</span>
          </div>
          <div className="h-full flex flex-col items-center justify-center">
            <span className="text-3xl group-hover:scale-110 transition-transform">🎖️</span>
            <h3 className="text-white font-bold text-sm">Ceintures</h3>
            <div className="flex gap-0.5 mt-1">
              <span className="w-3 h-3 bg-white rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
              <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Bloc 6 */}
        <div className="col-span-1 row-span-1 relative rounded-xl bg-gradient-to-br from-amber-600 to-yellow-700 border-2 border-amber-400/50 shadow-xl overflow-hidden group cursor-pointer hover:scale-105 transition-all">
          <div className="absolute top-1 left-1 w-7 h-7 bg-amber-300 rounded-full flex items-center justify-center shadow z-10">
            <span className="text-amber-900 font-black">6</span>
          </div>
          <div className="h-full flex flex-col items-center justify-center">
            <span className="text-3xl group-hover:scale-110 transition-transform">📜</span>
            <h3 className="text-white font-bold text-sm">Histoire</h3>
          </div>
        </div>

        {/* Bloc 7 */}
        <div className="col-span-1 row-span-1 relative rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 border-2 border-yellow-300/50 shadow-xl overflow-hidden group cursor-pointer hover:scale-105 transition-all">
          <div className="absolute top-1 left-1 w-7 h-7 bg-yellow-300 rounded-full flex items-center justify-center shadow z-10">
            <span className="text-yellow-900 font-black">7</span>
          </div>
          <div className="h-full flex flex-col items-center justify-center">
            <span className="text-3xl group-hover:scale-110 transition-transform">🏆</span>
            <h3 className="text-white font-bold text-sm">Trophées</h3>
          </div>
        </div>

        {/* Bloc 8 - Large */}
        <div className="col-span-2 row-span-1 relative rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 border-2 border-emerald-300/50 shadow-xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all">
          <div className="absolute top-1 left-1 w-7 h-7 bg-emerald-300 rounded-full flex items-center justify-center shadow z-10">
            <span className="text-emerald-900 font-black">8</span>
          </div>
          <div className="h-full flex items-center justify-center gap-4">
            <span className="text-4xl group-hover:scale-110 transition-transform">👨‍👩‍👧</span>
            <div>
              <h3 className="text-white font-bold">Espace Parents</h3>
              <p className="text-white/70 text-xs">Suivez la progression de votre ninja</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personnages ninja animés */}
      <div className="absolute bottom-2 left-8 text-2xl animate-bounce" style={{ animationDelay: '0s' }}>🥷</div>
      <div className="absolute bottom-2 right-8 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🥷</div>
      
      {/* Cerisiers */}
      <div className="absolute top-16 left-2 text-2xl opacity-40">🌸</div>
      <div className="absolute top-20 right-2 text-2xl opacity-40">🌸</div>
    </div>
  );
};

export default VisitorTemplatePreviewC;
