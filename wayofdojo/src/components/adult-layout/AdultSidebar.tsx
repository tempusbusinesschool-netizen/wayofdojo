'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Map, BookOpen, Award, Gamepad2, 
  Compass, User, Trophy, Settings, 
  LogOut, HelpCircle, ChevronDown,
  ScrollText, History
} from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AdultSidebar - Navigation latérale gauche pour le mode Adulte
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Ordre strict selon le cahier des charges :
 * - Mon parcours
 * - Techniques  
 * - Ceintures
 * - Dojo virtuel
 * - Approfondir (Vertus, Histoire)
 * - Mon compte (Profil, Trophées)
 * ---
 * - Guide
 * - Paramètres
 * - Déconnexion
 */

interface AdultSidebarProps {
  locale: string;
  sport: string;
  onLogout: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: { label: string; href: string; icon: React.ReactNode }[];
}

export const AdultSidebar: React.FC<AdultSidebarProps> = ({
  locale,
  sport,
  onLogout,
}) => {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>(['approfondir', 'compte']);

  const baseUrl = `/${locale}/${sport}`;

  const navItems: NavItem[] = [
    {
      id: 'parcours',
      label: 'Mon parcours',
      icon: <Map className="w-5 h-5" />,
      href: `${baseUrl}/dojo`,
    },
    {
      id: 'techniques',
      label: 'Techniques',
      icon: <BookOpen className="w-5 h-5" />,
      href: `${baseUrl}/techniques`,
    },
    {
      id: 'ceintures',
      label: 'Ceintures',
      icon: <Award className="w-5 h-5" />,
      href: `${baseUrl}/ceintures`,
    },
    {
      id: 'dojo-virtuel',
      label: 'Dojo virtuel',
      icon: <Gamepad2 className="w-5 h-5" />,
      href: `${baseUrl}/dojo-virtuel`,
    },
    {
      id: 'approfondir',
      label: 'Approfondir',
      icon: <Compass className="w-5 h-5" />,
      children: [
        { label: 'Vertus', href: `${baseUrl}/vertus`, icon: <ScrollText className="w-4 h-4" /> },
        { label: 'Histoire', href: `${baseUrl}/histoire`, icon: <History className="w-4 h-4" /> },
      ],
    },
    {
      id: 'compte',
      label: 'Mon compte',
      icon: <User className="w-5 h-5" />,
      children: [
        { label: 'Profil', href: `${baseUrl}/profil`, icon: <User className="w-4 h-4" /> },
        { label: 'Trophées', href: `${baseUrl}/trophees`, icon: <Trophy className="w-4 h-4" /> },
      ],
    },
  ];

  const bottomItems = [
    { id: 'guide', label: 'Guide', icon: <HelpCircle className="w-5 h-5" />, href: `${baseUrl}/guide` },
    { id: 'settings', label: 'Paramètres', icon: <Settings className="w-5 h-5" />, href: '#' },
  ];

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (children?: { href: string }[]) => 
    children?.some(child => pathname === child.href);

  return (
    <aside 
      className="fixed left-0 top-0 h-screen w-[280px] bg-[#0d1b31] border-r border-white/10 flex flex-col z-40"
      data-testid="adult-sidebar"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <motion.div 
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/30"
          >
            <span className="text-xl">⚔️</span>
          </motion.div>
          <div>
            <span className="text-lg font-bold text-white">WayofDojo</span>
            <p className="text-xs text-slate-400">Samouraï Confirmé</p>
          </div>
        </Link>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              {item.children ? (
                // Menu avec sous-éléments
                <div>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                      isParentActive(item.children)
                        ? 'bg-orange-500/10 text-orange-400'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      expandedMenus.includes(item.id) ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {expandedMenus.includes(item.id) && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-4 mt-1 space-y-1 border-l-2 border-white/10 pl-4"
                    >
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                              isActive(child.href)
                                ? 'bg-orange-500/10 text-orange-400 border-l-2 border-orange-500 -ml-[18px] pl-[14px]'
                                : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {child.icon}
                            <span className="text-sm">{child.label}</span>
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </div>
              ) : (
                // Lien simple
                <Link
                  href={item.href!}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                    isActive(item.href!)
                      ? 'bg-orange-500/10 text-orange-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive(item.href!) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full" />
                  )}
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Navigation secondaire (bas) */}
      <div className="border-t border-white/10 p-3">
        <ul className="space-y-1">
          {bottomItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                  isActive(item.href)
                    ? 'bg-orange-500/10 text-orange-400'
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
              data-testid="sidebar-logout-btn"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default AdultSidebar;
