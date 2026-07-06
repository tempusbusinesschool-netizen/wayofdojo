'use client';

import React from 'react';
import Link from 'next/link';
import { HelpCircle, MessageCircle, Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AdultHeader - Header selon le visuel de référence
 * ═══════════════════════════════════════════════════════════════════════════════
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
  notificationCount = 3,
}) => {
  return (
    <header 
      className="fixed top-0 right-0 left-0 lg:left-[260px] h-[60px] bg-[#0a1628]/95 backdrop-blur-md z-30"
      data-testid="adult-header"
    >
      <div className="h-full px-6 flex items-center justify-end gap-4">
        {/* Navigation droite */}
        <nav className="flex items-center gap-2">
          {/* Guide */}
          <Link href={`/${locale}/${sport}/guide`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-white/10 gap-2"
              data-testid="header-guide-link"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">Guide</span>
            </Button>
          </Link>

          {/* Messages */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-300 hover:text-white hover:bg-white/10 gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Messages</span>
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-300 hover:text-white hover:bg-white/10 gap-2 relative"
          >
            <Bell className="w-4 h-4" />
            <span className="text-sm">Notifications</span>
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </Button>

          {/* Avatar utilisateur */}
          <div className="flex items-center gap-2 ml-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500/50 bg-gradient-to-br from-amber-400 to-orange-500">
              <Image
                src="/images/avatars/default.png"
                alt={userName}
                width={40}
                height={40}
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default AdultHeader;
