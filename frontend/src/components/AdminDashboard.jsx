/**
 * 🛡️ ADMIN DASHBOARD - Espace de gestion
 * 
 * Interface d'administration modernisée avec :
 * - Navigation par sidebar
 * - Sections clairement séparées
 * - Accès rapide aux outils principaux
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Building2, CreditCard, ScrollText, 
  LayoutDashboard, Settings, BookOpen, Swords,
  ChevronRight, ChevronDown, LogOut, Menu, X, FileText,
  BarChart3, UserCog, Bell, Database, HelpCircle,
  FolderOpen, Download, ExternalLink, FileCode, Dumbbell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import CombinaisonsPage from '@/pages/CombinaisonsPage';

// Configuration des sections admin (structure hiérarchique)
const ADMIN_SECTIONS = [
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    color: 'cyan',
    description: 'Vue d\'ensemble de la plateforme'
  },
  {
    id: 'users',
    label: 'Utilisateurs',
    icon: Users,
    color: 'violet',
    description: 'Gestion des comptes et profils'
  },
  {
    id: 'dojos',
    label: 'Gestion Dojos',
    icon: Building2,
    color: 'orange',
    description: 'Configuration des clubs affiliés'
  },
  {
    id: 'subscriptions',
    label: 'Abonnements',
    icon: CreditCard,
    color: 'emerald',
    description: 'Suivi des paiements et formules'
  },
  {
    id: 'sports',
    label: 'Sports',
    icon: Dumbbell,
    color: 'amber',
    description: 'Gestion des disciplines sportives',
    isParent: true,
    children: [
      {
        id: 'aikido',
        label: 'Aikido',
        icon: Swords,
        color: 'amber',
        description: 'Art martial japonais',
        isParent: true,
        children: [
          {
            id: 'techniques',
            label: 'Toutes les techniques',
            icon: FileCode,
            color: 'amber',
            description: '284 combinaisons du programme',
            filePath: 'Sports/Aikido/Techniques d\'aikido/Techniques d\'aikido.js'
          },
          {
            id: 'armes',
            label: 'Armes',
            icon: Swords,
            color: 'orange',
            description: 'Techniques avec armes',
            isParent: true,
            children: [
              {
                id: 'jo',
                label: 'Jo (Bâton)',
                icon: FileCode,
                color: 'orange',
                description: '46 techniques - Suburi, Kata, Kumijo',
                filePath: 'Sports/Aikido/Techniques d\'aikido/Armes/Jo/Techniques_Jo.js'
              },
              {
                id: 'bokken',
                label: 'Bokken (Sabre)',
                icon: FileCode,
                color: 'red',
                description: '32 techniques - Suburi, Kumitachi, Tachi Dori',
                filePath: 'Sports/Aikido/Techniques d\'aikido/Armes/Bokken/Techniques_Bokken.js'
              },
              {
                id: 'tanto',
                label: 'Tanto (Couteau)',
                icon: FileCode,
                color: 'rose',
                description: '38 techniques - Défenses contre couteau',
                filePath: 'Sports/Aikido/Techniques d\'aikido/Armes/Tanto/Techniques_Tanto.js'
              }
            ]
          }
        ]
      }
    ]
  },
        ]
      }
    ]
  },
  {
    id: 'legal',
    label: 'Juridique',
    icon: ScrollText,
    color: 'rose',
    description: 'Documents et conformité RGPD'
  }
];

// Mapping des couleurs Tailwind
const colorClasses = {
  cyan: {
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/50',
    text: 'text-cyan-400',
    gradient: 'from-cyan-600 to-blue-600',
    active: 'bg-gradient-to-r from-cyan-600 to-blue-600'
  },
  violet: {
    bg: 'bg-violet-500/20',
    border: 'border-violet-500/50',
    text: 'text-violet-400',
    gradient: 'from-violet-600 to-purple-600',
    active: 'bg-gradient-to-r from-violet-600 to-purple-600'
  },
  orange: {
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/50',
    text: 'text-orange-400',
    gradient: 'from-orange-600 to-amber-600',
    active: 'bg-gradient-to-r from-orange-600 to-amber-600'
  },
  emerald: {
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/50',
    text: 'text-emerald-400',
    gradient: 'from-emerald-600 to-green-600',
    active: 'bg-gradient-to-r from-emerald-600 to-green-600'
  },
  amber: {
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/50',
    text: 'text-amber-400',
    gradient: 'from-amber-600 to-yellow-600',
    active: 'bg-gradient-to-r from-amber-600 to-yellow-600'
  },
  sky: {
    bg: 'bg-sky-500/20',
    border: 'border-sky-500/50',
    text: 'text-sky-400',
    gradient: 'from-sky-600 to-blue-600',
    active: 'bg-gradient-to-r from-sky-600 to-blue-600'
  },
  rose: {
    bg: 'bg-rose-500/20',
    border: 'border-rose-500/50',
    text: 'text-rose-400',
    gradient: 'from-rose-600 to-pink-600',
    active: 'bg-gradient-to-r from-rose-600 to-pink-600'
  },
  red: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/50',
    text: 'text-red-400',
    gradient: 'from-red-600 to-orange-600',
    active: 'bg-gradient-to-r from-red-600 to-orange-600'
  }
};

/**
 * Composant principal du Dashboard Admin
 */
const AdminDashboard = ({ 
  onLogout,
  activeSection = 'dashboard',
  onSectionChange,
  children 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState(['sports', 'aikido']); // Menus dépliés par défaut

  // Fonction pour trouver une section (y compris dans les enfants)
  const findSection = (sections, id) => {
    for (const section of sections) {
      if (section.id === id) return section;
      if (section.children) {
        const found = findSection(section.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const currentSection = findSection(ADMIN_SECTIONS, activeSection) || ADMIN_SECTIONS[0];
  const colors = colorClasses[currentSection.color];

  // Toggle menu parent
  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  // Rendu récursif des items de menu
  const renderMenuItem = (section, depth = 0) => {
    const Icon = section.icon;
    const sectionColors = colorClasses[section.color];
    const isActive = activeSection === section.id;
    const isExpanded = expandedMenus.includes(section.id);
    const hasChildren = section.children && section.children.length > 0;
    const paddingLeft = depth * 12;

    return (
      <div key={section.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleMenu(section.id);
            } else {
              onSectionChange(section.id);
            }
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive && !hasChildren
              ? `${sectionColors.active} text-white shadow-lg` 
              : 'hover:bg-slate-700/50 text-slate-400 hover:text-white'
          }`}
          style={{ paddingLeft: `${16 + paddingLeft}px` }}
        >
          <Icon className={`w-5 h-5 flex-shrink-0 ${isActive && !hasChildren ? 'text-white' : sectionColors.text}`} />
          {sidebarOpen && (
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">{section.label}</div>
              {isActive && !hasChildren && (
                <div className="text-xs opacity-80">{section.description}</div>
              )}
            </div>
          )}
          {sidebarOpen && hasChildren && (
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          )}
          {sidebarOpen && isActive && !hasChildren && (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        {/* Sous-menus */}
        {hasChildren && isExpanded && sidebarOpen && (
          <div className="ml-2 border-l border-slate-700 pl-2 mt-1 space-y-1">
            {section.children.map(child => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Admin */}
      <header className="bg-slate-800/80 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-700 text-slate-400"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${colors.active} flex items-center justify-center shadow-lg`}>
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Espace de gestion</h1>
                <p className="text-xs text-slate-400">Cadre • Contrôle • Conformité</p>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-700 text-slate-400">
              <HelpCircle className="w-5 h-5" />
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className={`hidden lg:block ${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-800/50 border-r border-slate-700 min-h-[calc(100vh-64px)] transition-all duration-300`}>
          <nav className="p-4 space-y-2">
            {ADMIN_SECTIONS.map((section) => renderMenuItem(section))}
          </nav>

          {/* Toggle sidebar */}
          <div className="absolute bottom-4 left-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-700 text-slate-400"
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </aside>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="fixed inset-0 z-40 lg:hidden"
            >
              <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-72 bg-slate-800 border-r border-slate-700 p-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-cyan-400" />
                    <span className="text-white font-bold">Navigation</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-700 rounded-lg">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                
                <nav className="space-y-2">
                  {ADMIN_SECTIONS.map((section) => renderMenuItem(section))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Breadcrumb dynamique */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6 flex-wrap">
            <span>Administration</span>
            {activeSection === 'techniques' && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-amber-400">Sports</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-amber-400">Aikido</span>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className={colors.text}>{currentSection.label}</span>
          </div>

          {/* Section Header */}
          <div className={`${colors.bg} border ${colors.border} rounded-2xl p-6 mb-6`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl ${colors.active} flex items-center justify-center shadow-lg`}>
                <currentSection.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{currentSection.label}</h2>
                <p className="text-slate-400">{currentSection.description}</p>
                {currentSection.filePath && (
                  <p className="text-xs text-sky-400 mt-1 font-mono">📁 {currentSection.filePath}</p>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-slate-800/30 rounded-2xl border border-slate-700 min-h-[500px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

/**
 * Contenu de la section Techniques d'Aïkido
 */
export const AdminTechniquesContent = ({ onBack }) => {
  return (
    <div className="p-0">
      <CombinaisonsPage onBack={onBack} embedded={true} />
    </div>
  );
};

/**
 * Configuration des fichiers de référence
 */
const REFERENCE_FILES = [
  {
    id: 'techniques_aikido',
    name: 'Techniques d\'aikido.js',
    description: '284 combinaisons techniques du programme traditionnel d\'Aïkido',
    path: 'Sports/Aikido/Techniques d\'aikido/Techniques d\'aikido.js',
    category: 'Programme technique',
    size: '42 Ko',
    icon: FileCode,
    color: 'amber',
    details: [
      '6e Kyu → 1er Kyu : 96 techniques',
      '1er Dan → 4e Dan : 45 techniques',
      'Armes (Jo, Bokken, Tanto) : 100+ techniques',
      'Ukemi, Tai Sabaki, Kamae : 40+ techniques'
    ]
  }
];

/**
 * Contenu de la section Fichiers de référence
 */
export const AdminFilesContent = () => {
  const handleDownload = (file) => {
    // Créer un lien de téléchargement
    const link = document.createElement('a');
    link.href = `/files/${file.path}`;
    link.download = file.name;
    link.click();
  };

  const handleViewPath = (file) => {
    // Copier le chemin dans le presse-papiers
    navigator.clipboard.writeText(`/app/${file.path}`);
    alert(`Chemin copié : /app/${file.path}`);
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Fichiers de référence</h3>
          <p className="text-slate-400 text-sm">Documents et ressources techniques du projet</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Database className="w-4 h-4" />
          <span>{REFERENCE_FILES.length} fichier(s)</span>
        </div>
      </div>

      {/* Liste des fichiers */}
      <div className="space-y-4">
        {REFERENCE_FILES.map((file) => {
          const Icon = file.icon;
          const colors = colorClasses[file.color] || colorClasses.sky;
          
          return (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${colors.bg} border ${colors.border} rounded-xl p-5 hover:border-opacity-80 transition-all`}
            >
              <div className="flex items-start gap-4">
                {/* Icône */}
                <div className={`w-14 h-14 rounded-xl ${colors.active} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Informations */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-lg font-bold text-white">{file.name}</h4>
                    <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
                      {file.category}
                    </span>
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-3">{file.description}</p>
                  
                  {/* Chemin du fichier */}
                  <div className="flex items-center gap-2 mb-3 bg-slate-800/50 rounded-lg px-3 py-2">
                    <FolderOpen className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <code className="text-xs text-sky-400 font-mono truncate">{file.path}</code>
                    <button 
                      onClick={() => handleViewPath(file)}
                      className="ml-auto text-slate-400 hover:text-white transition-colors"
                      title="Copier le chemin"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Détails */}
                  {file.details && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {file.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                          {detail}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">Taille : {file.size}</span>
                    <button
                      onClick={() => handleViewPath(file)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Copier chemin
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Information supplémentaire */}
      <div className="mt-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-400">
            <p className="mb-1"><strong className="text-slate-300">À propos des fichiers de référence</strong></p>
            <p>Ces fichiers contiennent les données structurées du programme technique d'Aïkido. 
            Ils sont utilisés par l'application pour afficher les techniques, gérer les progressions 
            et accompagner l'apprentissage des pratiquants.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Placeholder pour les sections non implémentées
 */
export const AdminSectionPlaceholder = ({ section }) => {
  const colors = colorClasses[section.color] || colorClasses.cyan;
  const Icon = section.icon || LayoutDashboard;
  
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className={`w-20 h-20 rounded-2xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-6`}>
        <Icon className={`w-10 h-10 ${colors.text}`} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{section.label}</h3>
      <p className="text-slate-400 max-w-md">
        {section.description}
      </p>
    </div>
  );
};

export { ADMIN_SECTIONS, colorClasses };
export default AdminDashboard;
