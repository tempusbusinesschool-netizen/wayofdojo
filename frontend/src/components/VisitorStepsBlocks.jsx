import React from 'react';
import { Lock, Star, Target, Award, BookOpen, Trophy, Users, Swords, Heart } from 'lucide-react';

/**
 * VisitorStepsBlocks - Présentation du contenu pour visiteurs NON CONNECTÉS
 * 
 * OBJECTIF : Montrer ce que contient l'application pour donner envie de s'inscrire
 * Les blocs sont INFORMATIFS mais NE FONCTIONNENT PAS (pas de navigation)
 * Cliquer ouvre le dialogue d'inscription
 */
const VisitorStepsBlocks = ({ mode = 'enfant', onStepClick }) => {
  
  const isEnfant = mode === 'enfant';

  // Ouvrir le dialogue d'inscription quand on clique sur un bloc
  const handleBlockClick = () => {
    const event = new CustomEvent('openAuthDialog');
    window.dispatchEvent(event);
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // BLOCS VERSION ENFANT - Présentation colorée et détaillée du contenu
  // ═══════════════════════════════════════════════════════════════════════════════
  const blocksEnfant = [
    {
      id: 1, 
      slug: 'profil',
      emoji: '🥷',
      title: 'Mon Profil Ninja',
      content: 'Ta carte d\'identité de ninja avec ta ceinture, ton animal gardien et tes statistiques !',
      gradient: 'from-violet-500 to-purple-600',
      shadowColor: 'shadow-violet-500/40',
      details: ['Ceinture actuelle', 'Points XP', 'Animal gardien']
    },
    {
      id: 2, 
      slug: 'techniques',
      emoji: '🥋',
      title: '206+ Techniques',
      content: 'Toutes les techniques d\'Aïkido classées par grade : Ikkyo, Shiho Nage, Irimi Nage...',
      gradient: 'from-cyan-500 to-blue-600',
      shadowColor: 'shadow-cyan-500/40',
      details: ['Vidéos explicatives', 'Conseils du Sensei', 'Suivi progression']
    },
    {
      id: 3, 
      slug: 'defis',
      emoji: '🎯',
      title: 'Défis Quotidiens',
      content: 'Des missions chaque jour pour gagner des XP : pratiquer au dojo, réviser, méditer...',
      gradient: 'from-pink-500 to-rose-600',
      shadowColor: 'shadow-pink-500/40',
      details: ['Défis journaliers', 'Défis hebdo', 'Défis spéciaux']
    },
    {
      id: 4, 
      slug: 'vertus',
      emoji: '☯️',
      title: 'Les 7 Vertus',
      content: 'Respect, Courage, Maîtrise, Humilité, Bienveillance, Attention, Responsabilité !',
      gradient: 'from-amber-500 to-orange-600',
      shadowColor: 'shadow-amber-500/40',
      details: ['7 animaux gardiens', 'Évolution possible', 'Points de vertu']
    },
    {
      id: 5, 
      slug: 'ceintures',
      emoji: '🎖️',
      title: 'Les Ceintures',
      content: 'De la ceinture Blanche à la Noire : 6 Kyu + 4 Dan avec le programme de chaque grade.',
      gradient: 'from-slate-500 to-slate-700',
      shadowColor: 'shadow-slate-500/40',
      details: ['⚪🟡🟠🟢🔵🟤⚫', 'Programme par grade', 'Examens']
    },
    {
      id: 6, 
      slug: 'histoire',
      emoji: '📜',
      title: 'Histoire de l\'Aïkido',
      content: 'Découvre O\'Sensei Morihei Ueshiba, les origines et la philosophie de l\'Aïkido.',
      gradient: 'from-amber-600 to-yellow-700',
      shadowColor: 'shadow-amber-600/40',
      details: ['O\'Sensei', 'Le Hakama', 'Traditions']
    },
    {
      id: 7, 
      slug: 'trophees',
      emoji: '🏆',
      title: 'Trophées & Badges',
      content: 'Collectionne des badges en relevant des défis : Premier Cours, 10 Techniques, Assidu...',
      gradient: 'from-yellow-500 to-amber-600',
      shadowColor: 'shadow-yellow-500/40',
      details: ['50+ badges', 'Titres spéciaux', 'Classement']
    },
    {
      id: 8, 
      slug: 'parents',
      emoji: '👨‍👩‍👧',
      title: 'Espace Parents',
      content: 'Les parents peuvent suivre la progression de leur enfant et valider ses défis !',
      gradient: 'from-emerald-500 to-teal-600',
      shadowColor: 'shadow-emerald-500/40',
      details: ['Suivi enfant', 'Validation défis', 'Notifications']
    }
  ];

  // ═══════════════════════════════════════════════════════════════════════════════
  // BLOCS VERSION ADULTE - Présentation sobre et professionnelle
  // ═══════════════════════════════════════════════════════════════════════════════
  const blocksAdulte = [
    {
      id: 1, 
      slug: 'profil',
      kanji: '人',
      kanjiMeaning: 'Personne',
      title: 'Votre Profil',
      content: 'Espace personnel avec grade actuel, statistiques de progression et historique.',
      accentColor: 'border-l-emerald-500',
      details: ['Grade actuel', 'Heures de pratique', 'Statistiques']
    },
    {
      id: 2, 
      slug: 'programme',
      kanji: '技',
      kanjiMeaning: 'Technique',
      title: 'Programme Technique',
      content: '206+ techniques classées par grade : Tachi Waza, Suwari Waza, Ushiro Waza, Buki Waza.',
      accentColor: 'border-l-cyan-500',
      details: ['Nage Waza', 'Osae Waza', 'Buki Waza']
    },
    {
      id: 3, 
      slug: 'grades',
      kanji: '段',
      kanjiMeaning: 'Grade',
      title: 'Système de Grades',
      content: 'Programme officiel du 6e Kyu au 4e Dan avec les techniques requises pour chaque passage.',
      accentColor: 'border-l-amber-500',
      details: ['6 Kyu (couleurs)', '4 Dan (noirs)', 'Examens FFAAA']
    },
    {
      id: 4, 
      slug: 'vertus',
      kanji: '徳',
      kanjiMeaning: 'Vertu',
      title: 'Les 7 Vertus du Budo',
      content: 'Gi, Yu, Jin, Rei, Makoto, Meiyo, Chugi - Les piliers philosophiques de l\'Aïkido.',
      accentColor: 'border-l-violet-500',
      details: ['Philosophie', 'Application', 'Progression']
    },
    {
      id: 5, 
      slug: 'objectifs',
      kanji: '目',
      kanjiMeaning: 'Objectif',
      title: 'Objectifs & Défis',
      content: 'Définissez vos objectifs personnels et suivez votre progression avec des défis adaptés.',
      accentColor: 'border-l-pink-500',
      details: ['Défis quotidiens', 'Objectifs perso', 'Rappels']
    },
    {
      id: 6, 
      slug: 'histoire',
      kanji: '歴',
      kanjiMeaning: 'Histoire',
      title: 'Histoire & Traditions',
      content: 'O\'Sensei Morihei Ueshiba, origines de l\'Aïkido, signification du Hakama et étiquette.',
      accentColor: 'border-l-orange-500',
      details: ['O\'Sensei', 'Hakama', 'Reigi']
    },
    {
      id: 7, 
      slug: 'certifications',
      kanji: '証',
      kanjiMeaning: 'Certificat',
      title: 'Certifications',
      content: 'Validez vos acquis avec des certifications reconnues et un carnet de progression.',
      accentColor: 'border-l-red-500',
      details: ['Badges', 'Attestations', 'Export PDF']
    },
    {
      id: 8, 
      slug: 'communaute',
      kanji: '和',
      kanjiMeaning: 'Harmonie',
      title: 'Communauté',
      content: 'Rejoignez la communauté des pratiquants, partagez et progressez ensemble.',
      accentColor: 'border-l-blue-500',
      details: ['Multi-dojo', 'Événements', 'Stages']
    }
  ];

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDU VERSION ENFANT - Blocs colorés avec contenu détaillé
  // ═══════════════════════════════════════════════════════════════════════════════
  if (isEnfant) {
    return (
      <div className="mb-4" data-testid="visitor-steps-blocks-enfant">
        {/* Titre */}
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
            🎮 Tout ce qui t'attend dans Aikido@Game ! 🎮
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Inscris-toi pour débloquer tout ce contenu ! 🔓
          </p>
        </div>

        {/* Grille des 8 blocs - PRÉSENTATION DU CONTENU */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {blocksEnfant.map((block) => (
            <button
              key={block.id}
              onClick={handleBlockClick}
              data-testid={`visitor-block-${block.slug}`}
              className={`
                relative group rounded-2xl p-4 text-left
                transition-all duration-300 overflow-hidden
                bg-gradient-to-br ${block.gradient} shadow-xl ${block.shadowColor} 
                border-2 border-white/20 hover:border-white/40 hover:scale-[1.02] cursor-pointer
              `}
            >
              {/* Badge "Inscris-toi" */}
              <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Inscris-toi</span>
              </div>

              {/* En-tête avec emoji et titre */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl sm:text-4xl">{block.emoji}</span>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base leading-tight">{block.title}</h3>
                </div>
              </div>

              {/* Description du contenu */}
              <p className="text-white/80 text-xs sm:text-sm mb-3 line-clamp-2">
                {block.content}
              </p>

              {/* Tags/détails */}
              <div className="flex flex-wrap gap-1">
                {block.details.map((detail, idx) => (
                  <span key={idx} className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {detail}
                  </span>
                ))}
              </div>

              {/* Effet brillance au hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          ))}
        </div>

        {/* Message d'incitation */}
        <p className="text-center mt-4 text-amber-400 text-sm font-medium">
          ⭐ Tout ce contenu t'attend ! Crée ton compte pour commencer l'aventure !
        </p>

        {/* CTA inscription */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={handleBlockClick}
            data-testid="cta-start-adventure"
            className="group relative overflow-hidden px-8 sm:px-12 py-4 rounded-2xl font-bold text-lg
              bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 text-slate-900 
              shadow-xl shadow-amber-500/40 hover:shadow-amber-500/60
              transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
              -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative flex items-center gap-3">
              <span className="text-2xl">🥷</span>
              <span>Créer mon compte Ninja</span>
              <span className="text-2xl">🚀</span>
            </span>
          </button>
          <p className="text-slate-500 text-xs">✨ C'est gratuit et ça prend 30 secondes !</p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDU VERSION ADULTE - Blocs sobres avec contenu détaillé
  // ═══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="mb-4" data-testid="visitor-steps-blocks-adulte">
      {/* En-tête sobre */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-1">
          Contenu de la plateforme
        </h2>
        <p className="text-slate-400 text-sm">
          Découvrez tout ce qui vous attend sur Aikido@Game
        </p>
      </div>

      {/* Grille des 8 blocs - PRÉSENTATION DU CONTENU */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {blocksAdulte.map((block) => (
          <button
            key={block.id}
            onClick={handleBlockClick}
            data-testid={`visitor-block-${block.slug}`}
            className={`
              relative group rounded-xl p-4 text-left
              transition-all duration-300
              border-l-4 ${block.accentColor}
              bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg 
              hover:shadow-xl hover:from-slate-700 hover:to-slate-800 cursor-pointer
            `}
          >
            {/* Badge verrouillé */}
            <div className="absolute top-2 right-2 text-slate-500 flex items-center gap-1 text-[10px]">
              <Lock className="w-3 h-3" />
              <span>Inscription requise</span>
            </div>

            {/* Kanji et titre */}
            <div className="flex items-center gap-3 mb-2">
              <span 
                className="text-3xl sm:text-4xl font-bold text-white/80"
                style={{ fontFamily: "'Noto Serif JP', serif" }}
              >
                {block.kanji}
              </span>
              <div>
                <h3 className="font-semibold text-white text-sm">{block.title}</h3>
                <span className="text-slate-500 text-[10px] italic">{block.kanjiMeaning}</span>
              </div>
            </div>

            {/* Description du contenu */}
            <p className="text-slate-300 text-xs mb-3 line-clamp-2">
              {block.content}
            </p>

            {/* Tags/détails */}
            <div className="flex flex-wrap gap-1">
              {block.details.map((detail, idx) => (
                <span key={idx} className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded">
                  {detail}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Statistiques sobres */}
      <div className="mt-6 grid grid-cols-3 gap-4 px-4">
        <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="text-2xl font-bold text-cyan-400">206+</div>
          <div className="text-xs text-slate-400">Techniques</div>
        </div>
        <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="text-2xl font-bold text-amber-400">10</div>
          <div className="text-xs text-slate-400">Grades (6 Kyu + 4 Dan)</div>
        </div>
        <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="text-2xl font-bold text-violet-400">84</div>
          <div className="text-xs text-slate-400">Défis</div>
        </div>
      </div>

      {/* Citation philosophique */}
      <div className="mt-6 text-center px-4">
        <p className="text-slate-400 text-sm italic border-l-2 border-amber-500/50 pl-4 py-2 bg-slate-800/30 rounded-r-lg">
          "L'Aïkido n'est pas seulement un sport, c'est un <span className="text-amber-400 font-semibold">Budo</span> — la Voie du guerrier."
        </p>
      </div>

      {/* CTA sobre */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <button
          onClick={handleBlockClick}
          data-testid="cta-start-adventure-adulte"
          className="group relative overflow-hidden px-8 py-3 rounded-xl font-semibold
            bg-gradient-to-r from-slate-700 to-slate-800 text-white border border-slate-600
            shadow-lg hover:shadow-xl hover:border-cyan-500/50
            transform hover:scale-[1.02] transition-all duration-300"
        >
          <span className="relative flex items-center gap-2">
            <span>Créer mon compte gratuitement</span>
            <span className="text-cyan-400">→</span>
          </span>
        </button>
        
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">✓ 30 jours offerts</span>
          <span className="flex items-center gap-1">✓ Sans publicité</span>
          <span className="flex items-center gap-1">🔒 Conforme RGPD</span>
        </div>
      </div>
    </div>
  );
};

export default VisitorStepsBlocks;
