import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Target, Trophy, BookOpen, Users, Zap } from 'lucide-react';

/**
 * VARIANTE A - Style "Cartes Flottantes"
 * Design moderne avec cartes glassmorphism sur une ligne
 */
export const VisitorBlocksVariantA = ({ onOpenAuth, onOpenLogin }) => {
  const blocks = [
    { 
      emoji: "🎯", 
      title: "206 Techniques", 
      subtitle: "À découvrir",
      gradient: "from-violet-600 to-purple-600",
      glow: "shadow-violet-500/30"
    },
    { 
      emoji: "🥋", 
      title: "10 Grades", 
      subtitle: "À conquérir",
      gradient: "from-cyan-600 to-blue-600",
      glow: "shadow-cyan-500/30"
    },
    { 
      emoji: "☯️", 
      title: "7 Vertus", 
      subtitle: "À maîtriser",
      gradient: "from-amber-500 to-orange-600",
      glow: "shadow-amber-500/30"
    },
    { 
      emoji: "🏆", 
      title: "50+ Badges", 
      subtitle: "À débloquer",
      gradient: "from-emerald-600 to-green-600",
      glow: "shadow-emerald-500/30"
    },
    { 
      emoji: "🔥", 
      title: "Défis", 
      subtitle: "Quotidiens",
      gradient: "from-rose-600 to-pink-600",
      glow: "shadow-rose-500/30"
    }
  ];

  return (
    <div className="space-y-6" data-testid="visitor-blocks-variant-a">
      {/* Titre */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          🌟 Ton Aventure Ninja t'attend !
        </h2>
        <p className="text-slate-400">Rejoins des centaines de pratiquants</p>
      </div>

      {/* Blocs en ligne */}
      <div className="flex flex-wrap justify-center gap-4">
        {blocks.map((block, idx) => (
          <div 
            key={idx}
            className={`
              relative overflow-hidden rounded-2xl p-5 min-w-[140px]
              bg-gradient-to-br ${block.gradient}
              shadow-xl ${block.glow}
              transform hover:scale-110 hover:-translate-y-2 transition-all duration-300
              cursor-pointer group
            `}
          >
            {/* Effet brillant au hover */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
            
            <div className="relative text-center">
              <span className="text-4xl block mb-2 group-hover:animate-bounce">{block.emoji}</span>
              <p className="text-white font-bold text-lg">{block.title}</p>
              <p className="text-white/70 text-xs">{block.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton CTA */}
      <div className="text-center">
        <Button
          onClick={onOpenAuth}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-xl shadow-amber-500/30 animate-pulse"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Commence ton aventure !
        </Button>
      </div>
    </div>
  );
};

/**
 * VARIANTE B - Style "Bande Défilante"
 * Design horizontal continu avec icônes et stats
 */
export const VisitorBlocksVariantB = ({ onOpenAuth, onOpenLogin }) => {
  const stats = [
    { icon: "📚", value: "206", label: "Techniques", color: "text-violet-400" },
    { icon: "🥋", value: "10", label: "Grades", color: "text-cyan-400" },
    { icon: "☯️", value: "7", label: "Vertus", color: "text-amber-400" },
    { icon: "🏆", value: "50+", label: "Badges", color: "text-emerald-400" },
    { icon: "🔥", value: "∞", label: "Défis", color: "text-rose-400" },
    { icon: "🎯", value: "100%", label: "Fun", color: "text-pink-400" }
  ];

  return (
    <div className="space-y-6" data-testid="visitor-blocks-variant-b">
      {/* Bande de stats horizontale */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 border border-slate-700 p-1">
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-3 px-4">
          {stats.map((stat, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center min-w-[80px] group cursor-pointer">
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300">{stat.icon}</span>
                <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
                <span className="text-slate-500 text-xs">{stat.label}</span>
              </div>
              {idx < stats.length - 1 && (
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-600 to-transparent" />
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Effet de lueur */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
      </div>

      {/* Message + CTA */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-violet-900/30 to-cyan-900/30 rounded-2xl p-6 border border-violet-500/30">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            🥷 Prêt à devenir un vrai Ninja ?
          </h3>
          <p className="text-slate-400 text-sm">Inscris-toi et commence à gagner des points dès maintenant !</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onOpenAuth}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold px-6 shadow-lg"
          >
            <Zap className="w-4 h-4 mr-2" />
            S'inscrire
          </Button>
          <Button
            onClick={onOpenLogin}
            variant="outline"
            className="border-violet-500 text-violet-400 hover:bg-violet-500/20"
          >
            Connexion
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * VARIANTE C - Style "Cartes Empilées 3D"
 * Design avec effet de profondeur et animation
 */
export const VisitorBlocksVariantC = ({ onOpenAuth, onOpenLogin }) => {
  const features = [
    { 
      emoji: "🎯", 
      title: "Techniques", 
      value: "206",
      desc: "techniques d'Aïkido",
      bg: "bg-gradient-to-br from-violet-600/80 to-violet-800/80",
      border: "border-violet-500/50"
    },
    { 
      emoji: "🥋", 
      title: "Grades", 
      value: "10",
      desc: "niveaux à atteindre",
      bg: "bg-gradient-to-br from-cyan-600/80 to-cyan-800/80",
      border: "border-cyan-500/50"
    },
    { 
      emoji: "☯️", 
      title: "Vertus", 
      value: "7",
      desc: "vertus magiques",
      bg: "bg-gradient-to-br from-amber-600/80 to-amber-800/80",
      border: "border-amber-500/50"
    },
    { 
      emoji: "🏆", 
      title: "Trophées", 
      value: "50+",
      desc: "badges à débloquer",
      bg: "bg-gradient-to-br from-emerald-600/80 to-emerald-800/80",
      border: "border-emerald-500/50"
    },
    { 
      emoji: "🔥", 
      title: "Défis", 
      value: "∞",
      desc: "challenges quotidiens",
      bg: "bg-gradient-to-br from-rose-600/80 to-rose-800/80",
      border: "border-rose-500/50"
    }
  ];

  return (
    <div className="space-y-6" data-testid="visitor-blocks-variant-c">
      {/* Grille de cartes avec effet 3D */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {features.map((feature, idx) => (
          <div 
            key={idx}
            className={`
              relative rounded-2xl p-4 ${feature.bg} ${feature.border}
              border backdrop-blur-sm
              transform hover:rotate-2 hover:scale-105 transition-all duration-300
              cursor-pointer group
              shadow-xl hover:shadow-2xl
            `}
            style={{
              transform: `perspective(1000px) rotateY(${(idx - 2) * 3}deg)`,
            }}
          >
            {/* Badge numéro */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-slate-900 font-black text-sm">{idx + 1}</span>
            </div>
            
            <div className="text-center">
              <span className="text-4xl block mb-2 group-hover:animate-bounce">{feature.emoji}</span>
              <p className="text-white font-black text-2xl">{feature.value}</p>
              <p className="text-white font-semibold text-sm">{feature.title}</p>
              <p className="text-white/60 text-xs mt-1">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Barre de progression fictive */}
      <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-bold">🚀 Ta progression potentielle</span>
          <span className="text-amber-400 font-bold">0% → 100%</span>
        </div>
        <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 via-cyan-500 to-amber-500 rounded-full animate-pulse"
            style={{ width: '15%' }}
          />
        </div>
        <p className="text-center text-slate-400 text-sm mt-3">
          ✨ Inscris-toi pour débloquer ton potentiel !
        </p>
        
        <div className="flex justify-center gap-3 mt-4">
          <Button
            onClick={onOpenAuth}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-8 shadow-xl shadow-amber-500/30"
          >
            <Target className="w-5 h-5 mr-2" />
            Commencer maintenant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default { VisitorBlocksVariantA, VisitorBlocksVariantB, VisitorBlocksVariantC };
