import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Home, Users, Award, Target, GraduationCap, 
  ChevronRight, ChevronLeft, Menu, X, Play, CheckCircle,
  Sparkles, Shield, Star, Zap, Eye, MessageSquare
} from 'lucide-react';

const ModeEmploiPage = ({ onBack }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [animateContent, setAnimateContent] = useState(true);

  const sections = [
    {
      id: 'intro',
      title: 'Introduction',
      icon: BookOpen,
      color: 'from-amber-500 to-yellow-400',
      content: {
        title: "Bienvenue dans Aikido@Game",
        subtitle: "Votre parcours Aikido interactif",
        description: "Aikido@Game est une plateforme unique qui combine l'apprentissage traditionnel des arts martiaux japonais avec une approche ludique et moderne de gamification. Que vous soyez débutant ou expert, cette application vous accompagne dans votre progression.",
        features: [
          { icon: Star, text: "206+ techniques à maîtriser", color: "text-amber-400" },
          { icon: Award, text: "10 grades (6 Kyu + 4 Dan)", color: "text-cyan-400" },
          { icon: Target, text: "84 défis à relever", color: "text-emerald-400" },
          { icon: Shield, text: "100% gratuit et conforme RGPD", color: "text-purple-400" }
        ],
        tip: "L'Aikido n'est pas seulement un sport, c'est un Budo - une voie martiale qui développe le corps et l'esprit."
      }
    },
    {
      id: 'accueil',
      title: "Page d'Accueil",
      icon: Home,
      color: 'from-cyan-500 to-blue-400',
      content: {
        title: "Choisissez votre mode",
        subtitle: "Deux expériences adaptées à votre profil",
        description: "La page d'accueil vous présente deux modes de navigation distincts pour s'adapter à tous les pratiquants.",
        modes: [
          {
            name: "Jeune Ninja",
            age: "< 14 ans",
            description: "Interface colorée et ludique avec un langage adapté aux enfants",
            color: "from-orange-500 to-amber-400",
            icon: Sparkles
          },
          {
            name: "Ninja Confirmé", 
            age: "≥ 14 ans",
            description: "Interface sobre et professionnelle avec des informations détaillées",
            color: "from-purple-500 to-indigo-400",
            icon: GraduationCap
          }
        ],
        navigation: [
          { name: "S'inscrire", desc: "Créer un compte gratuit" },
          { name: "Connexion", desc: "Accéder à votre espace" },
          { name: "Dojo", desc: "Espace du club" },
          { name: "Enseignant", desc: "Accès professeur" }
        ]
      }
    },
    {
      id: 'visiteur',
      title: 'Mode Visiteur',
      icon: Eye,
      color: 'from-emerald-500 to-teal-400',
      content: {
        title: "Explorez librement",
        subtitle: "Découvrez le programme sans inscription",
        description: "En tant que visiteur, vous pouvez parcourir l'ensemble du programme Aikido pour découvrir ce qui vous attend.",
        allowed: [
          "Explorer toutes les techniques par grade",
          "Lire les descriptions détaillées",
          "Découvrir la philosophie du Budo",
          "Changer de mode à tout moment"
        ],
        restricted: [
          "Suivre votre progression personnelle",
          "Participer aux défis",
          "Gagner des points et badges",
          "Sauvegarder vos favoris"
        ],
        cta: "Pour débloquer toutes les fonctionnalités, créez un compte gratuit !"
      }
    },
    {
      id: 'programme',
      title: 'Programme',
      icon: Award,
      color: 'from-violet-500 to-purple-400',
      content: {
        title: "206+ Techniques",
        subtitle: "Un programme complet et structuré",
        description: "Le programme Aikido@Game couvre l'ensemble des techniques réparties sur 10 grades, du débutant au plus avancé.",
        grades: [
          { name: "6e au 1er Kyu", desc: "Ceintures colorées - Fondamentaux", color: "bg-gradient-to-r from-white via-yellow-300 to-orange-500" },
          { name: "1er au 4e Dan", desc: "Ceintures noires - Maîtrise", color: "bg-black" }
        ],
        categories: [
          { name: "Techniques de base", icon: "🥋", desc: "Fondamentaux pour chaque niveau" },
          { name: "Nage Waza", icon: "🌀", desc: "Techniques de projection" },
          { name: "Osae Waza", icon: "🔒", desc: "Techniques d'immobilisation" },
          { name: "Buki Waza", icon: "⚔️", desc: "Techniques avec armes (Jo, Bokken, Tanto)" }
        ]
      }
    },
    {
      id: 'technique',
      title: 'Détail Technique',
      icon: Target,
      color: 'from-rose-500 to-pink-400',
      content: {
        title: "Informations détaillées",
        subtitle: "Tout ce qu'il faut pour progresser",
        description: "Chaque technique dispose d'une fiche complète avec toutes les informations nécessaires à votre apprentissage.",
        details: [
          { label: "Nom japonais", value: "Terminologie officielle", icon: "🇯🇵" },
          { label: "Traduction", value: "Signification en français", icon: "🇫🇷" },
          { label: "Description", value: "Explication du mouvement", icon: "📝" },
          { label: "Points clés", value: "Éléments essentiels", icon: "🎯" },
          { label: "Conseils", value: "Astuces de pratique", icon: "💡" },
          { label: "Maîtrise", value: "Votre niveau actuel", icon: "📊" }
        ],
        levels: ["Non commencé", "En cours", "Acquis", "Maîtrisé"]
      }
    },
    {
      id: 'inscription',
      title: 'Inscription',
      icon: Users,
      color: 'from-blue-500 to-indigo-400',
      content: {
        title: "Créez votre compte",
        subtitle: "Gratuit et en quelques secondes",
        description: "L'inscription est simple, rapide et totalement gratuite. Vos données sont protégées conformément au RGPD.",
        steps: [
          { num: 1, text: "Cliquez sur « S'inscrire »" },
          { num: 2, text: "Remplissez vos informations" },
          { num: 3, text: "Choisissez votre mode préféré" },
          { num: 4, text: "Validez et commencez !" }
        ],
        benefits: [
          "Suivi de progression personnalisé",
          "Accès aux 84 défis",
          "Système de points et badges",
          "Sauvegarde automatique"
        ]
      }
    },
    {
      id: 'dashboard',
      title: 'Tableau de Bord',
      icon: Zap,
      color: 'from-amber-500 to-orange-400',
      content: {
        title: "Votre espace personnel",
        subtitle: "Suivez votre progression",
        description: "Le tableau de bord centralise toutes vos statistiques et vous permet de visualiser votre avancement dans l'apprentissage.",
        stats: [
          { label: "Points", desc: "Score total accumulé", icon: "⭐" },
          { label: "Grade", desc: "Votre niveau actuel", icon: "🎖️" },
          { label: "Techniques", desc: "Nombre validées", icon: "✅" },
          { label: "Défis", desc: "Challenges réussis", icon: "🏆" }
        ],
        features: [
          "Graphiques de progression",
          "Historique des activités",
          "Objectifs personnalisés",
          "Badges et récompenses"
        ]
      }
    },
    {
      id: 'blocs',
      title: 'Les 4 Blocs',
      icon: CheckCircle,
      color: 'from-teal-500 to-emerald-400',
      content: {
        title: "Structure d'apprentissage",
        subtitle: "Les 4 piliers de la progression",
        description: "Aikido@Game structure votre apprentissage autour de 4 blocs fondamentaux qui représentent les étapes de votre parcours.",
        blocs: [
          { 
            num: 1, 
            name: "Commence", 
            desc: "Bases essentielles : postures, déplacements, chutes",
            color: "from-green-400 to-emerald-500"
          },
          { 
            num: 2, 
            name: "Découvre", 
            desc: "Techniques fondamentales : projections et immobilisations",
            color: "from-blue-400 to-cyan-500"
          },
          { 
            num: 3, 
            name: "Progresse", 
            desc: "Approfondissement : fluidité et efficacité",
            color: "from-purple-400 to-violet-500"
          },
          { 
            num: 4, 
            name: "Maîtrise", 
            desc: "Niveau avancé : perfectionnement personnel",
            color: "from-amber-400 to-orange-500"
          }
        ]
      }
    },
    {
      id: 'enseignant',
      title: 'Espace Enseignant',
      icon: GraduationCap,
      color: 'from-orange-500 to-red-400',
      content: {
        title: "Pour les professeurs",
        subtitle: "Gérez vos élèves efficacement",
        description: "L'espace enseignant offre des outils dédiés aux professeurs d'Aikido pour suivre et accompagner leurs élèves.",
        features: [
          { name: "Liste des élèves", desc: "Voir tous les membres du dojo", icon: Users },
          { name: "Observations", desc: "Ajouter des commentaires de progression", icon: MessageSquare },
          { name: "Messages", desc: "Communiquer avec les parents", icon: MessageSquare },
          { name: "Statistiques", desc: "Vue globale du dojo", icon: Award }
        ],
        access: "Cliquez sur le bouton orange « Enseignant » et connectez-vous avec vos identifiants fournis par l'administrateur."
      }
    },
    {
      id: 'glossaire',
      title: 'Glossaire',
      icon: BookOpen,
      color: 'from-slate-500 to-gray-400',
      content: {
        title: "Termes essentiels",
        subtitle: "Vocabulaire de l'Aikido",
        description: "Familiarisez-vous avec les termes japonais couramment utilisés dans la pratique de l'Aikido.",
        terms: [
          { term: "Aikido", def: "La voie de l'harmonie" },
          { term: "Budo", def: "Voie martiale japonaise" },
          { term: "Dan", def: "Grade avancé (ceinture noire)" },
          { term: "Dojo", def: "Lieu de pratique" },
          { term: "Kyu", def: "Grade débutant à avancé" },
          { term: "Sensei", def: "Professeur, enseignant" },
          { term: "Uke", def: "Celui qui reçoit (attaquant)" },
          { term: "Tori/Nage", def: "Celui qui exécute (défenseur)" }
        ]
      }
    }
  ];

  const handleSectionChange = (index) => {
    setAnimateContent(false);
    setTimeout(() => {
      setCurrentSection(index);
      setAnimateContent(true);
    }, 150);
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      handleSectionChange(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      handleSectionChange(currentSection - 1);
    }
  };

  const section = sections[currentSection];
  const IconComponent = section.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-2">
              <BookOpen className="text-amber-400" size={28} />
              <span className="font-bold text-lg">Mode d'Emploi</span>
            </div>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-all hover:scale-105"
          >
            Retour à l'app
          </button>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} pt-16 lg:pt-0`}>
          <nav className="p-4 space-y-2 h-full overflow-y-auto">
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-4 px-3">
              Sections du guide
            </div>
            {sections.map((sec, index) => {
              const SectionIcon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => handleSectionChange(index)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentSection === index 
                      ? `bg-gradient-to-r ${sec.color} text-white shadow-lg shadow-amber-500/20` 
                      : 'hover:bg-slate-700/50 text-slate-300'
                  }`}
                >
                  <SectionIcon size={20} />
                  <span className="font-medium">{sec.title}</span>
                  {currentSection === index && (
                    <ChevronRight size={16} className="ml-auto" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen p-6 lg:p-10">
          <div className={`max-w-4xl mx-auto transition-all duration-300 ${animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Section Header */}
            <div className={`bg-gradient-to-r ${section.color} p-6 rounded-2xl mb-8 shadow-xl`}>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                  <IconComponent size={40} className="text-white" />
                </div>
                <div>
                  <span className="text-white/70 text-sm">Section {currentSection + 1}/{sections.length}</span>
                  <h1 className="text-3xl font-bold text-white">{section.content.title}</h1>
                  <p className="text-white/80">{section.content.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-800/50 rounded-2xl p-6 mb-6 border border-slate-700">
              <p className="text-lg text-slate-300 leading-relaxed">
                {section.content.description}
              </p>
            </div>

            {/* Dynamic Content based on section */}
            {section.id === 'intro' && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {section.content.features.map((feature, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-amber-500/50 transition-colors">
                      <feature.icon className={`${feature.color} mb-3`} size={28} />
                      <p className="text-white font-medium">{feature.text}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-5 border border-amber-500/30">
                  <p className="text-amber-200 italic">💡 {section.content.tip}</p>
                </div>
              </>
            )}

            {section.id === 'accueil' && (
              <>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {section.content.modes.map((mode, i) => (
                    <div key={i} className={`bg-gradient-to-br ${mode.color} rounded-2xl p-6 shadow-xl`}>
                      <mode.icon className="text-white mb-3" size={32} />
                      <h3 className="text-xl font-bold text-white">{mode.name}</h3>
                      <span className="text-white/70 text-sm">{mode.age}</span>
                      <p className="text-white/90 mt-3">{mode.description}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                  <h4 className="text-amber-400 font-semibold mb-3">Navigation principale</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {section.content.navigation.map((nav, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-300">
                        <ChevronRight size={16} className="text-cyan-400" />
                        <span><strong>{nav.name}</strong> - {nav.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {section.id === 'visiteur' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-emerald-500/10 rounded-xl p-5 border border-emerald-500/30">
                  <h4 className="text-emerald-400 font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle size={20} /> Accessible en visiteur
                  </h4>
                  <ul className="space-y-2">
                    {section.content.allowed.map((item, i) => (
                      <li key={i} className="text-slate-300 flex items-center gap-2">
                        <span className="text-emerald-400">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-500/10 rounded-xl p-5 border border-red-500/30">
                  <h4 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
                    <X size={20} /> Nécessite un compte
                  </h4>
                  <ul className="space-y-2">
                    {section.content.restricted.map((item, i) => (
                      <li key={i} className="text-slate-300 flex items-center gap-2">
                        <span className="text-red-400">✗</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl p-5 border border-cyan-500/30 text-center">
                  <p className="text-cyan-200 text-lg">{section.content.cta}</p>
                </div>
              </div>
            )}

            {section.id === 'programme' && (
              <>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {section.content.grades.map((grade, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                      <div className={`w-full h-3 ${grade.color} rounded-full mb-3`}></div>
                      <h4 className="text-white font-bold">{grade.name}</h4>
                      <p className="text-slate-400">{grade.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {section.content.categories.map((cat, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center hover:border-amber-500/50 transition-colors">
                      <span className="text-3xl mb-2 block">{cat.icon}</span>
                      <h5 className="text-white font-semibold">{cat.name}</h5>
                      <p className="text-slate-400 text-sm">{cat.desc}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {section.id === 'technique' && (
              <>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {section.content.details.map((detail, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex items-center gap-4">
                      <span className="text-2xl">{detail.icon}</span>
                      <div>
                        <h5 className="text-white font-semibold">{detail.label}</h5>
                        <p className="text-slate-400 text-sm">{detail.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                  <h4 className="text-amber-400 font-semibold mb-3">Niveaux de maîtrise</h4>
                  <div className="flex flex-wrap gap-2">
                    {section.content.levels.map((level, i) => (
                      <span key={i} className={`px-4 py-2 rounded-full text-sm font-medium ${
                        i === 0 ? 'bg-slate-600 text-slate-300' :
                        i === 1 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        i === 2 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {level}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {section.id === 'inscription' && (
              <>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
                  <h4 className="text-amber-400 font-semibold mb-4">Étapes d'inscription</h4>
                  <div className="space-y-4">
                    {section.content.steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center font-bold text-slate-900">
                          {step.num}
                        </div>
                        <p className="text-white">{step.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-5 border border-emerald-500/30">
                  <h4 className="text-emerald-400 font-semibold mb-3">Avantages du compte gratuit</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {section.content.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-300">
                        <CheckCircle size={16} className="text-emerald-400" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {section.id === 'dashboard' && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {section.content.stats.map((stat, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
                      <span className="text-3xl mb-2 block">{stat.icon}</span>
                      <h5 className="text-white font-bold">{stat.label}</h5>
                      <p className="text-slate-400 text-sm">{stat.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                  <h4 className="text-amber-400 font-semibold mb-3">Fonctionnalités du tableau de bord</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {section.content.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-300">
                        <Zap size={16} className="text-amber-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {section.id === 'blocs' && (
              <div className="space-y-4">
                {section.content.blocs.map((bloc, i) => (
                  <div key={i} className={`bg-gradient-to-r ${bloc.color} rounded-xl p-5 shadow-lg`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-2xl text-white">
                        {bloc.num}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">{bloc.name}</h4>
                        <p className="text-white/80">{bloc.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.id === 'enseignant' && (
              <>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {section.content.features.map((feature, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-orange-500/50 transition-colors">
                      <feature.icon className="text-orange-400 mb-3" size={28} />
                      <h5 className="text-white font-bold">{feature.name}</h5>
                      <p className="text-slate-400">{feature.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-5 border border-orange-500/30">
                  <h4 className="text-orange-400 font-semibold mb-2">Comment accéder ?</h4>
                  <p className="text-slate-300">{section.content.access}</p>
                </div>
              </>
            )}

            {section.id === 'glossaire' && (
              <div className="grid md:grid-cols-2 gap-3">
                {section.content.terms.map((item, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex items-center gap-3">
                    <span className="text-amber-400 font-bold text-lg">{item.term}</span>
                    <span className="text-slate-400">-</span>
                    <span className="text-slate-300">{item.def}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-700">
              <button
                onClick={prevSection}
                disabled={currentSection === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  currentSection === 0 
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                <ChevronLeft size={20} />
                Précédent
              </button>
              
              <div className="flex gap-2">
                {sections.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSectionChange(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentSection === i ? 'bg-amber-400 scale-125' : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSection}
                disabled={currentSection === sections.length - 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  currentSection === sections.length - 1 
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900'
                }`}
              >
                Suivant
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ModeEmploiPage;
