'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, BookOpen, Award, Gamepad2, 
  Compass, User, HelpCircle, Settings, LogOut,
  Flame, Trophy, BookMarked, ChevronDown, 
  Scroll, History, Sparkles, Heart
} from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AdultSidebar - Navigation latérale avec Profil intégré
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface AdultSidebarProps {
  locale: string;
  sport: string;
  onLogout: () => void;
  userName?: string;
  xp?: number;
  maxXp?: number;
  currentGrade?: string;
  streak?: number;
  badgesCount?: number;
  techniquesCount?: number;
}

export const AdultSidebar: React.FC<AdultSidebarProps> = ({
  locale,
  sport,
  onLogout,
  userName = 'Pratiquant',
  xp = 0,
  currentGrade = '6e Kyu',
  streak = 0,
  badgesCount = 0,
  techniquesCount = 0,
}) => {
  const pathname = usePathname();
  const baseUrl = `/${locale}/${sport}`;

  const [approfondirOpen, setApprofondirOpen] = useState(true); // Ouvert par défaut

  const navItems = [
    { id: 'parcours', label: 'Mon parcours', icon: Home, href: `${baseUrl}/dojo` },
    { id: 'techniques', label: 'Techniques', icon: BookOpen, href: `${baseUrl}/techniques` },
    { id: 'ceintures', label: 'Ceintures', icon: Award, href: `${baseUrl}/ceintures` },
    { id: 'dojo-virtuel', label: 'Dojo virtuel', icon: Gamepad2, href: `${baseUrl}/dojo-virtuel` },
    { id: 'compte', label: 'Mon compte', icon: User, href: `${baseUrl}/profil` },
  ];

  const approfondirItems = [
    { id: 'vertus', label: 'Les 7 Vertus', icon: Sparkles, href: `${baseUrl}/vertus` },
    { id: 'histoire', label: 'Histoire', icon: History, href: `${baseUrl}/histoire-aikido` },
    { id: 'hakama', label: 'L\'Hakama', icon: Scroll, href: `${baseUrl}/hakama` },
    { id: 'bienfaits', label: 'Bienfaits', icon: Heart, href: `${baseUrl}/bienfaits` },
  ];

  // Check if any approfondir sub-page is active
  const isApprofondirActive = approfondirItems.some(item => pathname?.startsWith(item.href));

  const bottomItems = [
    { id: 'guide', label: 'Guide', icon: HelpCircle, href: `${baseUrl}/guide` },
    { id: 'settings', label: 'Paramètres', icon: Settings, href: '#' },
  ];

  const isActive = (href: string) => {
    if (href === `${baseUrl}/dojo` && pathname === `${baseUrl}/dojo`) return true;
    if (href !== `${baseUrl}/dojo` && pathname?.startsWith(href)) return true;
    return false;
  };

  return (
    <aside 
      className="fixed left-0 top-0 h-screen w-[260px] bg-[#0a1628] flex flex-col z-40"
      data-testid="adult-sidebar"
    >
      {/* Logo */}
      <div className="p-5">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center text-orange-500">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <text x="5" y="32" fontSize="28" fill="currentColor">⛩️</text>
            </svg>
          </div>
          <div>
            <span className="text-xl font-bold text-white">WayofDojo</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-orange-400">Mode Samouraï Confirmé</span>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-orange-500/10 text-orange-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}

          {/* Sous-menu Approfondir */}
          <li>
            <button
              onClick={() => setApprofondirOpen(!approfondirOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                isApprofondirActive
                  ? 'bg-orange-500/10 text-orange-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5" />
                <span className="font-medium">Approfondir</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${approfondirOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Sous-items */}
            <ul className={`mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${approfondirOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              {approfondirItems.map((subItem) => {
                const SubIcon = subItem.icon;
                const subActive = pathname?.startsWith(subItem.href);
                
                return (
                  <li key={subItem.id}>
                    <Link
                      href={subItem.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm ${
                        subActive
                          ? 'bg-orange-500/10 text-orange-400'
                          : 'text-slate-500 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <SubIcon className="w-4 h-4" />
                      <span>{subItem.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          MINI PROFIL UTILISATEUR (Version compacte)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="px-3 py-3 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shrink-0">
            <span className="text-lg">👤</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">{userName}</h3>
            <div className="flex items-center gap-2">
              <span className="text-orange-400 text-xs font-medium">{currentGrade}</span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-slate-400 text-xs">{xp} XP</span>
            </div>
          </div>
        </div>
        {/* Mini stats */}
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-1 text-xs">
            <Flame className="w-3 h-3 text-orange-400" />
            <span className="text-white">{streak}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span className="text-white">{badgesCount}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <BookMarked className="w-3 h-3 text-cyan-400" />
            <span className="text-white">{techniquesCount}</span>
          </div>
        </div>
      </div>

      {/* Navigation secondaire (bas) */}
      <div className="border-t border-white/5 p-3">
        <ul className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
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
