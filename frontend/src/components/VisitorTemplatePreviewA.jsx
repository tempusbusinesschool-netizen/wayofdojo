import React from 'react';

/**
 * Template A : "Carte au Trésor" - Chemin d'aventure
 */
const VisitorTemplatePreviewA = () => {
  const blocks = [
    { id: 1, emoji: '🥷', title: 'Mon Profil Ninja', color: 'from-violet-500 to-purple-600' },
    { id: 2, emoji: '🥋', title: '206+ Techniques', color: 'from-cyan-500 to-blue-600' },
    { id: 3, emoji: '🎯', title: 'Défis Quotidiens', color: 'from-pink-500 to-rose-600' },
    { id: 4, emoji: '☯️', title: 'Les 7 Vertus', color: 'from-amber-500 to-orange-600' },
    { id: 5, emoji: '🎖️', title: 'Les Ceintures', color: 'from-slate-500 to-slate-700' },
    { id: 6, emoji: '📜', title: 'Histoire', color: 'from-amber-600 to-yellow-700' },
    { id: 7, emoji: '🏆', title: 'Trophées', color: 'from-yellow-500 to-amber-600' },
    { id: 8, emoji: '👨‍👩‍👧', title: 'Espace Parents', color: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="p-4 bg-gradient-to-br from-amber-900/40 via-orange-900/30 to-yellow-900/40 rounded-3xl border-4 border-amber-600/50 relative overflow-hidden">
      {/* Fond parchemin */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.344 0L13.858 8.485 15.272 9.9l9.9-9.9h-2.828zM32 0l-3.486 3.485 1.415 1.414L searching 0h2.828zM0 5.373l.828-.83 1.415 1.415L0 8.2V5.374zm0 5.656l.828-.829 1.415 1.415L0 13.857v-2.83zm0 5.657l.828-.828 1.415 1.414L0 19.514v-2.828zm0 5.657l.828-.828 1.415 1.414L0 25.172v-2.83zm0 5.657l.828-.828 1.415 1.415L0 30.828v-2.83z' fill='%23ffffff' fill-opacity='0.4'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Titre */}
      <div className="text-center mb-6 relative">
        <h2 className="text-2xl font-black text-amber-300 drop-shadow-lg" style={{ fontFamily: 'serif' }}>
          🗺️ Carte de l'Aventure Ninja 🗺️
        </h2>
        <p className="text-amber-200/70 text-sm">Explore chaque île pour découvrir tes pouvoirs !</p>
      </div>

      {/* Chemin SVG de connexion */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ top: '80px' }}>
        <path 
          d="M 120 80 Q 200 120 300 80 Q 400 40 500 100 Q 600 160 700 100 Q 800 40 900 100 Q 1000 160 1100 80"
          stroke="rgba(251, 191, 36, 0.4)" 
          strokeWidth="8" 
          fill="none"
          strokeDasharray="20 10"
          strokeLinecap="round"
        />
      </svg>

      {/* Grille en zigzag */}
      <div className="relative z-10 space-y-4">
        {/* Ligne 1 */}
        <div className="flex justify-around">
          {blocks.slice(0, 4).map((block, i) => (
            <div 
              key={block.id}
              className={`
                relative w-36 h-36 rounded-2xl bg-gradient-to-br ${block.color}
                border-4 border-amber-400/60 shadow-xl
                transform hover:scale-110 hover:rotate-2 transition-all duration-300 cursor-pointer
                ${i % 2 === 0 ? 'mt-0' : 'mt-8'}
              `}
              style={{
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.2)'
              }}
            >
              {/* Numéro île */}
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center border-4 border-amber-600 shadow-lg">
                <span className="text-amber-900 font-black text-lg">{block.id}</span>
              </div>
              
              {/* Contenu */}
              <div className="h-full flex flex-col items-center justify-center p-3 text-center">
                <span className="text-4xl mb-2 drop-shadow-lg">{block.emoji}</span>
                <h3 className="text-white font-bold text-sm leading-tight drop-shadow">{block.title}</h3>
              </div>

              {/* Drapeau */}
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🚩</div>
            </div>
          ))}
        </div>

        {/* Ligne 2 */}
        <div className="flex justify-around">
          {blocks.slice(4, 8).map((block, i) => (
            <div 
              key={block.id}
              className={`
                relative w-36 h-36 rounded-2xl bg-gradient-to-br ${block.color}
                border-4 border-amber-400/60 shadow-xl
                transform hover:scale-110 hover:-rotate-2 transition-all duration-300 cursor-pointer
                ${i % 2 === 0 ? 'mt-8' : 'mt-0'}
              `}
              style={{
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.2)'
              }}
            >
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center border-4 border-amber-600 shadow-lg">
                <span className="text-amber-900 font-black text-lg">{block.id}</span>
              </div>
              
              <div className="h-full flex flex-col items-center justify-center p-3 text-center">
                <span className="text-4xl mb-2 drop-shadow-lg">{block.emoji}</span>
                <h3 className="text-white font-bold text-sm leading-tight drop-shadow">{block.title}</h3>
              </div>

              <div className="absolute -top-2 -right-2 text-2xl animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>🚩</div>
            </div>
          ))}
        </div>
      </div>

      {/* Décors */}
      <div className="absolute bottom-4 left-4 text-4xl opacity-60">🌴</div>
      <div className="absolute bottom-4 right-4 text-4xl opacity-60">⛵</div>
      <div className="absolute top-20 right-8 text-3xl opacity-40">🦜</div>
    </div>
  );
};

export default VisitorTemplatePreviewA;
