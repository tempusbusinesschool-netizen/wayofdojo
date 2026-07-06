'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle, Bell, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AdultHeader - Header global pour le mode Adulte
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Hauteur : 68px
 * À gauche : Logo WayofDojo + Mode
 * À droite : Guide, Messages, Notifications, Avatar
 * 
 * PAS d'Espace Parent, PAS d'Espace Enseignant
 */

interface AdultHeaderProps {
  locale: string;
  sport: string;
  userName: string;
  avatarUrl?: string;
  notificationCount?: number;
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export const AdultHeader: React.FC<AdultHeaderProps> = ({
  locale,
  sport,
  userName,
  notificationCount = 0,
  onMenuToggle,
  showMenuButton = false,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
    onMenuToggle?.();
  };

  return (
    <header 
      className="fixed top-0 right-0 left-0 lg:left-[280px] h-[68px] bg-[#0d1b31]/95 backdrop-blur-md border-b border-white/10 z-30"
      data-testid="adult-header"
    >
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Mobile: Menu burger + Logo */}
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMenuClick}
              className="lg:hidden text-white/70 hover:text-white"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          )}
          
          {/* Logo mobile uniquement */}
          <Link href={`/${locale}`} className="lg:hidden flex items-center gap-2">
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg"
            >
              <span className="text-lg">⚔️</span>
            </motion.div>
            <div>
              <span className="text-sm font-bold text-white">WayofDojo</span>
              <p className="text-[10px] text-slate-400">Samouraï Confirmé</p>
            </div>
          </Link>

          {/* Desktop: Titre de la page */}
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-white">Mon parcours</h1>
            <p className="text-xs text-slate-400">Votre progression en Aïkido, étape par étape</p>
          </div>
        </div>

        {/* Navigation droite */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Guide */}
          <Link href={`/${locale}/${sport}/guide`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-orange-400 hover:bg-orange-500/10"
              data-testid="header-guide-link"
            >
              <HelpCircle className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline text-sm">Guide</span>
            </Button>
          </Link>

          {/* Messages */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-400 hover:text-white hover:bg-white/10 relative"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-400 hover:text-white hover:bg-white/10 relative"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </Button>

          {/* Avatar utilisateur */}
          <Link href={`/${locale}/${sport}/profil`}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-400 hover:text-white hover:bg-white/10 flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center border-2 border-orange-500/50">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden md:inline text-sm text-white">{userName}</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default AdultHeader;
