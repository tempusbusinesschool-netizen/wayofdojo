import React from 'react';

/**
 * Template B : "Constellation Ninja" - Étoiles cosmiques
 */
const VisitorTemplatePreviewB = () => {
  const blocks = [
    { id: 1, emoji: '🥷', title: 'Mon Profil', color: 'from-violet-500 to-purple-600', angle: 0 },
    { id: 2, emoji: '🥋', title: 'Techniques', color: 'from-cyan-500 to-blue-600', angle: 45 },
    { id: 3, emoji: '🎯', title: 'Défis', color: 'from-pink-500 to-rose-600', angle: 90 },
    { id: 4, emoji: '☯️', title: 'Vertus', color: 'from-amber-500 to-orange-600', angle: 135 },
    { id: 5, emoji: '🎖️', title: 'Ceintures', color: 'from-emerald-500 to-teal-600', angle: 180 },
    { id: 6, emoji: '📜', title: 'Histoire', color: 'from-amber-600 to-yellow-700', angle: 225 },
    { id: 7, emoji: '🏆', title: 'Trophées', color: 'from-yellow-500 to-amber-600', angle: 270 },
    { id: 8, emoji: '👨‍👩‍👧', title: 'Parents', color: 'from-rose-500 to-pink-600', angle: 315 },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 rounded-3xl border-2 border-purple-500/30 relative overflow-hidden min-h-[500px]">
      {/* Étoiles de fond */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      {/* Nébuleuse */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl" />

      {/* Titre */}
      <div className="text-center mb-4 relative z-10">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
          ✨ Constellation du Ninja ✨
        </h2>
        <p className="text-purple-300/70 text-sm">Chaque étoile cache un pouvoir magique !</p>
      </div>

      {/* Centre - Avatar Ninja */}
      <div className="relative mx-auto" style={{ width: '400px', height: '400px' }}>
        {/* Cercle central */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-4 border-amber-300 flex items-center justify-center shadow-2xl shadow-amber-500/50 animate-pulse">
            <span className="text-5xl">🥷</span>
          </div>
          <p className="text-center text-amber-300 font-bold text-sm mt-2">TOI</p>
        </div>

        {/* Lignes de connexion */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
          {blocks.map((block) => {
            const centerX = 200;
            const centerY = 200;
            const radius = 150;
            const rad = (block.angle * Math.PI) / 180;
            const x = centerX + radius * Math.cos(rad);
            const y = centerY + radius * Math.sin(rad);
            return (
              <line
                key={block.id}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="url(#starGradient)"
                strokeWidth="2"
                opacity="0.5"
              />
            );
          })}
          <defs>
            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>

        {/* Étoiles/Blocs en cercle */}
        {blocks.map((block) => {
          const radius = 150;
          const rad = (block.angle * Math.PI) / 180;
          const x = 200 + radius * Math.cos(rad) - 45;
          const y = 200 + radius * Math.sin(rad) - 45;
          
          return (
            <div
              key={block.id}
              className={`
                absolute w-[90px] h-[90px] rounded-xl bg-gradient-to-br ${block.color}
                border-2 border-white/30 shadow-lg cursor-pointer
                transform hover:scale-125 transition-all duration-300
                flex flex-col items-center justify-center
                hover:shadow-xl hover:shadow-purple-500/50
              `}
              style={{
                left: `${x}px`,
                top: `${y}px`,
              }}
            >
              {/* Numéro */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-purple-600 font-black text-xs">{block.id}</span>
              </div>
              
              {/* Effet brillance */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/20" />
              
              <span className="text-2xl mb-1 relative z-10">{block.emoji}</span>
              <h3 className="text-white font-bold text-[10px] text-center relative z-10">{block.title}</h3>
              
              {/* Étoile scintillante */}
              <div className="absolute -top-1 -left-1 text-yellow-300 text-sm animate-ping">✦</div>
            </div>
          );
        })}
      </div>

      {/* Décorations */}
      <div className="absolute bottom-4 left-4 text-2xl opacity-60">🌙</div>
      <div className="absolute bottom-4 right-4 text-2xl opacity-60">🚀</div>
    </div>
  );
};

export default VisitorTemplatePreviewB;
