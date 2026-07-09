import React from 'react';

/**
 * Les 7 vertus du Hakama avec leurs couleurs et descriptions
 */
const HAKAMA_VIRTUES = [
  {
    kanji: "仁",
    romaji: "JIN",
    name: "Bienveillance",
    description: "Attention sincère portée à autrui, respect constant des autres.",
    colorClass: "from-red-900/40 to-red-800/40",
    borderClass: "border-red-500/30",
    textClass: "text-red-400"
  },
  {
    kanji: "義",
    romaji: "GI",
    name: "Justice, honneur",
    description: "Fidélité à la parole donnée et aux engagements pris.",
    colorClass: "from-blue-900/40 to-blue-800/40",
    borderClass: "border-blue-500/30",
    textClass: "text-blue-400"
  },
  {
    kanji: "礼",
    romaji: "REI",
    name: "Courtoisie",
    description: "Expression visible de l'estime portée à autrui.",
    colorClass: "from-purple-900/40 to-purple-800/40",
    borderClass: "border-purple-500/30",
    textClass: "text-purple-400"
  },
  {
    kanji: "智",
    romaji: "CHI",
    name: "Sagesse",
    description: "Discerner avec justesse, garder calme et lucidité.",
    colorClass: "from-green-900/40 to-green-800/40",
    borderClass: "border-green-500/30",
    textClass: "text-green-400"
  },
  {
    kanji: "信",
    romaji: "SHIN",
    name: "Sincérité",
    description: "Engagement total et constant, sans artifice.",
    colorClass: "from-yellow-900/40 to-yellow-800/40",
    borderClass: "border-yellow-500/30",
    textClass: "text-yellow-400"
  },
  {
    kanji: "忠",
    romaji: "CHU",
    name: "Loyauté",
    description: "Fidélité sincère à son école et son enseignement.",
    colorClass: "from-cyan-900/40 to-cyan-800/40",
    borderClass: "border-cyan-500/30",
    textClass: "text-cyan-400"
  },
  {
    kanji: "孝",
    romaji: "KŌ",
    name: "Piété, respect des fondements",
    description: "Respect profond des bases techniques, spirituelles et philosophiques des arts martiaux.",
    colorClass: "from-pink-900/40 to-pink-800/40",
    borderClass: "border-pink-500/30",
    textClass: "text-pink-400",
    fullWidth: true
  }
];

/**
 * VirtueCard - Carte pour une vertu du Hakama
 */
const VirtueCard = ({ virtue }) => (
  <div 
    className={`bg-gradient-to-r ${virtue.colorClass} p-3 rounded-lg border ${virtue.borderClass} ${virtue.fullWidth ? 'md:col-span-2' : ''}`}
    data-testid={`hakama-virtue-${virtue.romaji.toLowerCase()}`}
  >
    <p className={`font-bold ${virtue.textClass}`}>
      {virtue.kanji} {virtue.romaji} – {virtue.name}
    </p>
    <p className="text-xs text-slate-300">{virtue.description}</p>
  </div>
);

/**
 * HakamaHistory - Section Histoire de l'Aikido (Les Sept Plis du Hakama)
 * Affiche l'histoire de O Sensei et les 7 vertus du Hakama
 */
const HakamaHistory = () => {
  return (
    <div data-testid="hakama-history-section">
      {/* Header avec emoji et titre */}
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">📜</div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-amber-400">
            Histoire de l&apos;Aikido
          </h2>
          <p className="text-slate-400 text-sm">Les Sept Plis du Hakama et la sagesse de O Sensei</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* O Sensei Image */}
        <div className="flex flex-col items-center lg:items-start gap-3 lg:min-w-[200px]">
          <div className="relative">
            <div className="w-32 h-40 md:w-40 md:h-48 rounded-xl overflow-hidden border-4 border-amber-500/50 shadow-lg shadow-amber-500/20">
              <img 
                src="https://customer-assets.emergentagent.com/job_dojo-progress-1/artifacts/dz0s4slt_Sensei%20MoriHei%20Ueshiba.jpg" 
                alt="O Sensei - Morihei Ueshiba"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                data-testid="osensei-image"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
              O Sensei
            </div>
          </div>
          <p className="text-amber-400 font-semibold text-center">Morihei Ueshiba</p>
          <p className="text-slate-400 text-xs text-center">Fondateur de l&apos;Aïkido</p>
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            🥋 Les Sept Plis du Hakama
          </h3>
          
          <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed">
            <p>
              O Sensei enseignait que <span className="text-amber-400 font-semibold">« les sept plis du hakama symbolisent les sept vertus du budō »</span>. 
              Ces vertus, héritées de l&apos;éthique du samouraï d&apos;autrefois, constituent le socle moral du bushidō.
            </p>
            
            <p>
              Les <span className="text-cyan-400 font-semibold">budō</span> sont les arts martiaux japonais apparus entre le milieu du XIXᵉ et le milieu du XXᵉ siècle. 
              En japonais, <em>bu</em> signifie la guerre ou le combat, et <em>dō</em> la voie. Le budō désigne ainsi un chemin de formation globale, 
              à la fois physique, mentale et spirituelle.
            </p>

            <blockquote className="border-l-4 border-amber-500 pl-4 py-2 bg-slate-800/50 rounded-r-lg italic text-slate-200">
              « Les sept plis du hakama symbolisent les sept vertus du budō. Le hakama nous incite à refléter la vraie nature du bushidō. 
              L&apos;aïkido nous invite à polir sans cesse ces sept vertus traditionnelles dans notre pratique. »
              <footer className="text-amber-400 font-semibold mt-2 not-italic">— Morihei Ueshiba</footer>
            </blockquote>
          </div>

          {/* 7 Virtues Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3" data-testid="hakama-virtues-grid">
            {HAKAMA_VIRTUES.map((virtue, idx) => (
              <VirtueCard key={idx} virtue={virtue} />
            ))}
          </div>

          <p className="mt-4 text-xs text-slate-400 italic text-center">
            Un hakama est composé de sept plis : cinq à l&apos;avant et deux à l&apos;arrière. Chacun rappelle les valeurs que le pratiquant s&apos;efforce de cultiver sur la voie du budō.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HakamaHistory;
