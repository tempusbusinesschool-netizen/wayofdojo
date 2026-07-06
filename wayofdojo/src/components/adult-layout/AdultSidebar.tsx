'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, BookOpen, Award, Gamepad2, 
  Compass, User, HelpCircle, Settings, LogOut
} from 'lucide-react';
import Image from 'next/image';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AdultSidebar - Navigation latérale selon le visuel de référence
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface AdultSidebarProps {
  locale: string;
  sport: string;
  onLogout: () => void;
}

export const AdultSidebar: React.FC<AdultSidebarProps> = ({
  locale,
  sport,
  onLogout,
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

      {/* Carte Tanaka dans sidebar */}
      <div className="px-3 pb-4">
        <div className="bg-[#111d32] rounded-2xl p-4 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-700 border-2 border-orange-500/30">
              <Image
                src="/images/tanaka/portrait.png"
                alt="Maître Tanaka"
                width={56}
                height={56}
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Maître Tanaka</h4>
              <p className="text-orange-400 text-xs">Ton Sensei personnel</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs italic mb-3">
            "La vraie victoire est la victoire sur soi-même."
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
