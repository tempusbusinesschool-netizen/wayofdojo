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
  ChevronRight, LogOut, Menu, X, FileText,
  BarChart3, UserCog, Bell, Database, HelpCircle,
  FolderOpen, Download, ExternalLink, FileCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import CombinaisonsPage from '@/pages/CombinaisonsPage';

// Configuration des sections admin
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
    id: 'techniques',
    label: 'Techniques d\'Aïkido',
    icon: Swords,
    color: 'amber',
    description: '141 combinaisons du programme'
  },
  {
    id: 'files',
    label: 'Fichiers de référence',
    icon: FolderOpen,
    color: 'sky',
    description: 'Documents et ressources techniques'
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
  rose: {
    bg: 'bg-rose-500/20',
    border: 'border-rose-500/50',
    text: 'text-rose-400',
    gradient: 'from-rose-600 to-pink-600',
    active: 'bg-gradient-to-r from-rose-600 to-pink-600'
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

  const currentSection = ADMIN_SECTIONS.find(s => s.id === activeSection) || ADMIN_SECTIONS[0];
  const colors = colorClasses[currentSection.color];

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
            {ADMIN_SECTIONS.map((section) => {
              const Icon = section.icon;
              const sectionColors = colorClasses[section.color];
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => onSectionChange(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? `${sectionColors.active} text-white shadow-lg` 
                      : 'hover:bg-slate-700/50 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : sectionColors.text}`} />
                  {sidebarOpen && (
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{section.label}</div>
                      {isActive && (
                        <div className="text-xs opacity-80">{section.description}</div>
                      )}
                    </div>
                  )}
                  {sidebarOpen && isActive && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              );
            })}
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
                  {ADMIN_SECTIONS.map((section) => {
                    const Icon = section.icon;
                    const sectionColors = colorClasses[section.color];
                    const isActive = activeSection === section.id;
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          onSectionChange(section.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive 
                            ? `${sectionColors.active} text-white` 
                            : 'hover:bg-slate-700/50 text-slate-400'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : sectionColors.text}`} />
                        <span className="font-medium">{section.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <span>Administration</span>
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
