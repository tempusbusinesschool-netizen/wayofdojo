'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Tent,
  Map,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  Shield,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';

interface AdminSidebarProps {
  currentUser: { firstName: string; role: string } | null;
  onLogout: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'dojos', label: 'Dojos', icon: Tent },
  { id: 'annuaire', label: 'Annuaire FFAAA', icon: Map },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];

// Theme Toggle Component
function ThemeToggle({ collapsed }: { collapsed: boolean }) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      data-testid="theme-toggle"
      className={cn(
        "w-full transition-all duration-300",
        collapsed ? "px-2 justify-center" : "justify-start",
        theme === 'dark' 
          ? "text-slate-400 hover:text-amber-400 hover:bg-amber-500/10" 
          : "text-slate-600 hover:text-amber-600 hover:bg-amber-500/10"
      )}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-5 h-5" />
          {!collapsed && <span className="ml-2">Mode Clair</span>}
        </>
      ) : (
        <>
          <Moon className="w-5 h-5" />
          {!collapsed && <span className="ml-2">Mode Sombre</span>}
        </>
      )}
    </Button>
  );
}

export function AdminSidebar({ currentUser, onLogout, activeTab, onTabChange }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const params = useParams();
  const locale = params.locale as string;
  const { theme } = useTheme();

  const SidebarContent = () => (
    <>
      {/* Logo Area */}
      <div className={cn(
        "h-16 flex items-center px-4 transition-colors",
        "border-b border-slate-800 dark:border-slate-800",
        theme === 'light' && "border-slate-200",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className={cn(
              "font-bold transition-colors",
              theme === 'dark' ? "text-slate-50" : "text-slate-900"
            )}>WayofDojo</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "hidden lg:flex transition-colors",
            theme === 'dark' 
              ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800" 
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
          )}
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileOpen(false);
              }}
              data-testid={`sidebar-nav-${item.id}`}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? cn(
                      "text-amber-500 border-l-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
                      theme === 'dark' ? "bg-slate-800" : "bg-amber-50"
                    )
                  : cn(
                      theme === 'dark' 
                        ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50" 
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    ),
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-amber-500")} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Theme Toggle & User Profile & Logout */}
      <div className={cn(
        "p-4 mt-auto space-y-3 transition-colors border-t",
        theme === 'dark' ? "border-slate-800" : "border-slate-200"
      )}>
        {/* Theme Toggle */}
        <ThemeToggle collapsed={collapsed} />
        
        {currentUser && !collapsed && (
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {currentUser.firstName?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium truncate transition-colors",
                theme === 'dark' ? "text-slate-200" : "text-slate-800"
              )}>{currentUser.firstName}</p>
              <p className="text-xs text-slate-500 capitalize">{currentUser.role?.replace('_', ' ')}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={onLogout}
          data-testid="sidebar-logout"
          className={cn(
            "w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors",
            collapsed ? "px-2" : "justify-start"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-2">Déconnexion</span>}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100"
        data-testid="mobile-menu-trigger"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 z-50 flex flex-col"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </Button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed left-0 top-0 h-screen bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 z-40 flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
        data-testid="admin-sidebar"
      >
        <SidebarContent />
      </aside>
    </>
  );
}

export default AdminSidebar;
