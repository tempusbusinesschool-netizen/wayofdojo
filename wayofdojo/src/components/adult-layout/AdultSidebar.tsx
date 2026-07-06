'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, BookOpen, Award, Gamepad2, 
  Compass, User, HelpCircle, Settings, LogOut,
  Flame, Trophy, BookMarked
} from 'lucide-react';
import Image from 'next/image';

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
  maxXp = 400,
  currentGrade = '6e Kyu',
  streak = 0,
  badgesCount = 0,
  techniquesCount = 0,
}) => {
  const pathname = usePathname();
  const baseUrl = `/${locale}/${sport}`;

  const navItems = [
    { id: 'parcours', label: 'Mon parcours', icon: Home, href: `${baseUrl}/dojo` },
    { id: 'techniques', label: 'Techniques', icon: BookOpen, href: `${baseUrl}/techniques` },
    { id: 'ceintures', label: 'Ceintures', icon: Award, href: `${baseUrl}/ceintures` },
    { id: 'dojo-virtuel', label: 'Dojo virtuel', icon: Gamepad2, href: `${baseUrl}/dojo-virtuel` },
    { id: 'approfondir', label: 'Approfondir', icon: Compass, href: `${baseUrl}/vertus` },
    { id: 'compte', label: 'Mon compte', icon: User, href: `${baseUrl}/profil` },
  ];

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
      <nav className="flex-1 px-3 py-4">
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
        </ul>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          CARTE PROFIL UTILISATEUR
          ═══════════════════════════════════════════════════════════════ */}
      <div className="px-3 pb-2">
        <div className="bg-[#111d32] rounded-2xl p-4 border border-white/5">
          {/* Avatar et nom */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mb-2 relative">
              <span className="text-3xl">👤</span>
              <button className="absolute bottom-0 right-0 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center border-2 border-[#111d32]">
                <span className="text-xs">✏️</span>
              </button>
            </div>
            <h3 className="text-white font-bold text-lg">{userName}</h3>
          </div>

          {/* Badge de grade */}
          <div className="flex justify-center mb-4">
            <div className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-lg flex items-center gap-2">
              <span>🥋</span>
              <span className="font-bold">{currentGrade}</span>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">XP</span>
              <span className="text-white font-medium">{xp} / {maxXp}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all"
                style={{ width: `${Math.min((xp / maxXp) * 100, 100)}%` }}
              />
            </div>
            <p className="text-slate-500 text-xs mt-1">Prochain palier : {maxXp} XP</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-800/50 rounded-lg p-2">
              <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <div className="text-white font-bold text-sm">{streak}</div>
              <div className="text-slate-500 text-[10px]">Série de jours</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2">
              <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <div className="text-white font-bold text-sm">{badgesCount}</div>
              <div className="text-slate-500 text-[10px]">Badges obtenus</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2">
              <BookMarked className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <div className="text-white font-bold text-sm">{techniquesCount}</div>
              <div className="text-slate-500 text-[10px]">Techniques apprises</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CARTE MAÎTRE TANAKA
          ═══════════════════════════════════════════════════════════════ */}
      <div className="px-3 pb-4">
        <div className="bg-[#111d32] rounded-2xl p-4 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700 border-2 border-orange-500/30">
              <Image
                src="/images/tanaka/portrait.png"
                alt="Maître Tanaka"
                width={48}
                height={48}
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Maître Tanaka</h4>
              <p className="text-orange-400 text-xs">Votre Sensei personnel</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs italic mb-2">
            &quot;La vraie victoire est la victoire sur soi-même.&quot;
          </p>
          <Link 
            href="#"
            className="text-orange-400 hover:text-orange-300 text-xs font-medium flex items-center gap-1"
          >
            Voir son message →
          </Link>
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
