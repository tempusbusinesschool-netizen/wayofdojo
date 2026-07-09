'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Trophy, Flame, Star, BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NotificationsColumn - Colonne notifications et récompenses
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface Notification {
  id: string;
  type: 'badge' | 'streak' | 'quest' | 'technique' | 'xp';
  title: string;
  subtitle?: string;
  timestamp: string;
}

interface Reward {
  id: string;
  name: string;
  type: 'badge' | 'xp';
  value?: number;
  date: string;
}

interface NotificationsColumnProps {
  notifications?: Notification[];
  rewards?: Reward[];
  locale: string;
  sport: string;
}

const defaultNotifications: Notification[] = [
  { id: '1', type: 'badge', title: 'Nouveau badge débloqué', subtitle: 'Premier salut', timestamp: 'Il y a 2h' },
  { id: '2', type: 'streak', title: 'Série de 3 jours !', subtitle: 'Continue comme ça', timestamp: 'Aujourd\'hui' },
  { id: '3', type: 'quest', title: 'Quête terminée', subtitle: 'Méditation matinale', timestamp: 'Hier' },
  { id: '4', type: 'technique', title: 'Nouvelle technique', subtitle: 'Ikkyo débloqué', timestamp: 'Il y a 3j' },
];

const defaultRewards: Reward[] = [
  { id: '1', name: 'Premier salut', type: 'badge', date: '12/05' },
  { id: '2', name: 'Bonus quotidien', type: 'xp', value: 50, date: '12/05' },
  { id: '3', name: 'Chute parfaite', type: 'badge', date: '11/05' },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'badge': return <Trophy className="w-4 h-4 text-amber-400" />;
    case 'streak': return <Flame className="w-4 h-4 text-orange-400" />;
    case 'quest': return <Star className="w-4 h-4 text-green-400" />;
    case 'technique': return <BookOpen className="w-4 h-4 text-cyan-400" />;
    case 'xp': return <Star className="w-4 h-4 text-purple-400" />;
    default: return <Bell className="w-4 h-4 text-slate-400" />;
  }
};

const getNotificationBg = (type: Notification['type']) => {
  switch (type) {
    case 'badge': return 'bg-amber-500/10';
    case 'streak': return 'bg-orange-500/10';
    case 'quest': return 'bg-green-500/10';
    case 'technique': return 'bg-cyan-500/10';
    case 'xp': return 'bg-purple-500/10';
    default: return 'bg-slate-500/10';
  }
};

export const NotificationsColumn: React.FC<NotificationsColumnProps> = ({
  notifications = defaultNotifications,
  rewards = defaultRewards,
  locale,
  sport,
}) => {
  return (
    <div className="space-y-6" data-testid="notifications-column">
      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-[#0d1b31] rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-400" />
            Notifications
          </h3>
          <Link 
            href={`/${locale}/${sport}/profil`}
            className="text-xs text-slate-500 hover:text-orange-400 transition-colors"
          >
            Voir tout
          </Link>
        </div>
        
        <div className="divide-y divide-white/5">
          {notifications.slice(0, 4).map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${getNotificationBg(notif.type)} flex items-center justify-center shrink-0`}>
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{notif.title}</p>
                  {notif.subtitle && (
                    <p className="text-slate-500 text-xs truncate">{notif.subtitle}</p>
                  )}
                  <p className="text-slate-600 text-[10px] mt-0.5">{notif.timestamp}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Récompenses récentes */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#0d1b31] rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Récompenses récentes
          </h3>
          <Link 
            href={`/${locale}/${sport}/trophees`}
            className="text-xs text-slate-500 hover:text-orange-400 transition-colors"
          >
            Voir tout
          </Link>
        </div>
        
        <div className="divide-y divide-white/5">
          {rewards.slice(0, 3).map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-3 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${reward.type === 'badge' ? 'bg-amber-500/10' : 'bg-purple-500/10'} flex items-center justify-center`}>
                    {reward.type === 'badge' ? (
                      <Trophy className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Star className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{reward.name}</p>
                    <p className="text-slate-500 text-xs">
                      {reward.type === 'badge' ? 'Badge' : `+${reward.value} XP`} • {reward.date}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationsColumn;
