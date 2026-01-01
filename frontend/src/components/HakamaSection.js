import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Shield, 
  Sparkles, 
  Target, 
  Users, 
  Flame, 
  Crown,
  ChevronDown,
  ChevronUp,
  BookOpen
} from "lucide-react";

// Les Sept Plis du Hakama - Les Vertus du Bushido
const HAKAMA_FOLDS = [
  {
    id: 1,
    name: "Jin",
    kanji: "仁",
    french: "Bienveillance",
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
    icon: Heart,
    emoji: "💗",
    description: "La bonté et la compassion envers tous les êtres. Le guerrier protège les faibles et aide ceux qui souffrent.",
    inPractice: "Sur le tatami, Jin se manifeste par l'attention portée à son partenaire, en adaptant sa pratique à son niveau et en veillant à sa sécurité.",
    quote: "Le véritable guerrier n'est pas celui qui vainc, mais celui qui transforme l'ennemi en ami."
  },
  {
    id: 2,
    name: "Gi",
    kanji: "義",
    french: "Droiture / Justice",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    icon: Shield,
    emoji: "⚖️",
    description: "L'intégrité morale et le sens de la justice. Faire ce qui est juste, même quand personne ne regarde.",
    inPractice: "Respecter les règles du dojo, être honnête dans sa pratique, ne pas tricher sur les techniques.",
    quote: "La rectitude est le pouvoir de décider selon la raison, sans hésitation."
  },
  {
    id: 3,
    name: "Rei",
    kanji: "礼",
    french: "Respect / Étiquette",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    icon: Sparkles,
    emoji: "🙏",
    description: "Le respect envers soi-même, les autres et la tradition. Les saluts et l'étiquette sont l'expression de ce respect.",
    inPractice: "Saluer en entrant sur le tatami, respecter le sensei et les anciens, prendre soin du matériel.",
    quote: "Sans Rei, la connaissance et la technique ne sont que des armes dangereuses."
  },
  {
    id: 4,
    name: "Chi",
    kanji: "智",
    french: "Sagesse",
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    icon: BookOpen,
    emoji: "📚",
    description: "La sagesse née de l'expérience et de la réflexion. Savoir quand agir et quand s'abstenir.",
    inPractice: "Comprendre le sens des techniques, pas seulement leur forme. Apprendre de ses erreurs.",
    quote: "La sagesse commence dans l'émerveillement."
  },
  {
    id: 5,
    name: "Shin",
    kanji: "信",
    french: "Sincérité",
    color: "from-cyan-500 to-teal-600",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    icon: Target,
    emoji: "💎",
    description: "L'authenticité et la parole donnée. Être vrai dans ses intentions et ses actes.",
    inPractice: "Pratiquer avec intention sincère, honorer ses engagements envers le dojo et ses partenaires.",
    quote: "Quand on dit quelque chose, c'est fait. Quand on promet, c'est tenu."
  },
  {
    id: 6,
    name: "Chu",
    kanji: "忠",
    french: "Loyauté",
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    icon: Users,
    emoji: "🤝",
    description: "La fidélité envers son maître, son école et ses compagnons de pratique.",
    inPractice: "Soutenir son dojo, aider les nouveaux élèves, maintenir l'esprit de groupe.",
    quote: "La loyauté ne peut être esquissée, elle doit être gravée."
  },
  {
    id: 7,
    name: "Ko",
    kanji: "孝",
    french: "Piété filiale",
    color: "from-red-500 to-rose-600",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    icon: Crown,
    emoji: "👨‍👩‍👧‍👦",
    description: "Le respect et la gratitude envers ses parents et ses ancêtres spirituels (les maîtres qui nous ont précédés).",
    inPractice: "Honorer la transmission de l'Aïkido, respecter l'héritage du fondateur O-Sensei Morihei Ueshiba.",
    quote: "Nous sommes les héritiers de ceux qui nous ont précédés."
  }
];

function HakamaSection() {
  const [expandedFold, setExpandedFold] = useState(null);

  const toggleFold = (id) => {
    setExpandedFold(expandedFold === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl" />
        <CardHeader className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-4xl">👘</div>
            <div>
              <CardTitle className="text-2xl sm:text-3xl text-white">
                Les Sept Plis du Hakama
              </CardTitle>
              <CardDescription className="text-slate-400 text-base">
                袴の七つの襞 - Hakama no nanatsu no hida
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 text-base leading-relaxed">
              Le <strong className="text-white">hakama</strong> est le pantalon large traditionnel porté en Aïkido. 
              Ses <strong className="text-purple-400">sept plis</strong> représentent les sept vertus du <em>Bushido</em>, 
              le code d'honneur des samouraïs.
            </p>
            <p className="text-slate-400 text-sm mt-3">
              Ces vertus ne sont pas de simples concepts philosophiques — elles sont des guides pour la pratique 
              quotidienne, sur le tatami comme dans la vie.
            </p>
          </div>
          
          {/* Visual representation */}
          <div className="mt-6 flex justify-center">
            <div className="relative">
              <div className="flex gap-1">
                {HAKAMA_FOLDS.map((fold, index) => (
                  <div 
                    key={fold.id}
                    className={`w-8 h-24 sm:w-10 sm:h-32 rounded-t-lg bg-gradient-to-b ${fold.color} opacity-80 hover:opacity-100 transition-all cursor-pointer transform hover:scale-105`}
                    onClick={() => toggleFold(fold.id)}
                    title={`${fold.name} - ${fold.french}`}
                  >
                    <div className="text-center pt-2 text-white text-xs font-bold">
                      {fold.kanji}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-2 left-0 right-0 h-4 bg-slate-800 rounded-b-lg" />
            </div>
          </div>
          <p className="text-center text-slate-500 text-xs mt-4">
            Cliquez sur un pli pour découvrir sa vertu
          </p>
        </CardContent>
      </Card>

      {/* Les Sept Vertus */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          Les Sept Vertus
        </h2>
        
        <div className="grid gap-4">
          {HAKAMA_FOLDS.map((fold) => {
            const IconComponent = fold.icon;
            const isExpanded = expandedFold === fold.id;
            
            return (
              <Card 
                key={fold.id}
                className={`${fold.bgColor} ${fold.borderColor} border-2 transition-all duration-300 cursor-pointer hover:scale-[1.01]`}
                onClick={() => toggleFold(fold.id)}
              >
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${fold.color} flex items-center justify-center shadow-lg`}>
                        <span className="text-2xl">{fold.emoji}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-white">{fold.kanji}</span>
                          <Badge className={`bg-gradient-to-r ${fold.color} text-white border-0`}>
                            {fold.name}
                          </Badge>
                        </div>
                        <p className="text-lg font-semibold text-slate-200">{fold.french}</p>
                      </div>
                    </div>
                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                    </div>
                  </div>
                  
                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4 animate-in fade-in duration-300">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
                          Signification
                        </h4>
                        <p className="text-slate-300">{fold.description}</p>
                      </div>
                      
                      <div className={`${fold.bgColor} rounded-lg p-3 border ${fold.borderColor}`}>
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Dans la pratique
                        </h4>
                        <p className="text-slate-300">{fold.inPractice}</p>
                      </div>
                      
                      <blockquote className="border-l-4 border-slate-600 pl-4 italic text-slate-400">
                        "{fold.quote}"
                      </blockquote>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🥋</div>
            <div>
              <p className="text-slate-300 text-sm">
                <strong className="text-white">Note :</strong> Le port du hakama varie selon les dojos et les écoles. 
                Traditionnellement, il est porté à partir d'un certain grade (souvent à partir du 1er kyu ou du dan). 
                Certaines écoles permettent à tous de le porter dès le début.
              </p>
              <p className="text-slate-500 text-xs mt-2">
                À Aikido La Rivière, demandez à votre sensei pour connaître les pratiques du dojo.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default HakamaSection;
