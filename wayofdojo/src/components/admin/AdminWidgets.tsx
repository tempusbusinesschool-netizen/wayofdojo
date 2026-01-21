'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════════════════════
// STAT CARD - Widget KPI avec tendance
// ═══════════════════════════════════════════════════════════════════════════════════

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: number; positive: boolean };
  variant?: 'default' | 'amber' | 'violet' | 'emerald' | 'blue';
  className?: string;
}

export function StatCard({ label, value, icon, trend, variant = 'default', className }: StatCardProps) {
  const variantStyles = {
    default: 'from-slate-800/50 to-transparent dark:from-slate-800/50 light:from-slate-200/50',
    amber: 'from-amber-500/10 to-transparent',
    violet: 'from-violet-500/10 to-transparent',
    emerald: 'from-emerald-500/10 to-transparent',
    blue: 'from-blue-500/10 to-transparent',
  };

  const iconColors = {
    default: 'text-slate-400',
    amber: 'text-amber-500',
    violet: 'text-violet-500',
    emerald: 'text-emerald-500',
    blue: 'text-blue-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden p-6 rounded-xl transition-colors duration-200",
        "bg-slate-900 dark:bg-slate-900 border border-slate-800 dark:border-slate-800 hover:border-slate-700",
        "light:bg-white light:border-slate-200 light:hover:border-slate-300 light:shadow-sm",
        className
      )}
    >
      {/* Gradient Background */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", variantStyles[variant])} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500 light:text-slate-600">{label}</span>
          <div className={cn("p-2 rounded-lg bg-slate-800/50 dark:bg-slate-800/50 light:bg-slate-100", iconColors[variant])}>
            {icon}
          </div>
        </div>
        
        {/* Value */}
        <div className="flex items-end justify-between">
          <span className="text-3xl font-bold text-slate-50 dark:text-slate-50 light:text-slate-900 tracking-tight">{value}</span>
          
          {/* Trend */}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              trend.positive 
                ? "text-emerald-400 bg-emerald-400/10" 
                : "text-red-400 bg-red-400/10"
            )}>
              <span>{trend.positive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// CHART WIDGET - Container pour graphiques
// ═══════════════════════════════════════════════════════════════════════════════════

interface ChartWidgetProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function ChartWidget({ title, subtitle, children, actions, className }: ChartWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors duration-200",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      
      {/* Content */}
      <div className="min-h-[200px]">
        {children}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// ACTIVITY FEED - Liste d'activités récentes
// ═══════════════════════════════════════════════════════════════════════════════════

interface ActivityItem {
  id: string;
  user: { name: string; avatar?: string };
  action: string;
  target?: string;
  timestamp: string;
  type: 'user' | 'xp' | 'badge' | 'dojo' | 'login';
}

interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
}

export function ActivityFeed({ items, className }: ActivityFeedProps) {
  const typeColors = {
    user: 'bg-blue-500',
    xp: 'bg-amber-500',
    badge: 'bg-violet-500',
    dojo: 'bg-emerald-500',
    login: 'bg-slate-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-slate-900 border border-slate-800 rounded-xl overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800">
        <h3 className="text-lg font-semibold text-slate-100">Activité Récente</h3>
      </div>
      
      {/* List */}
      <div className="divide-y divide-slate-800 max-h-[400px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-6 py-8 text-center text-slate-500">
            Aucune activité récente
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="px-6 py-4 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0",
                  typeColors[item.type]
                )}>
                  {item.user.name.charAt(0).toUpperCase()}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-slate-100">{item.user.name}</span>
                    {' '}{item.action}
                    {item.target && <span className="text-amber-500"> {item.target}</span>}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{item.timestamp}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// TOP USERS TABLE - Classement XP
// ═══════════════════════════════════════════════════════════════════════════════════

interface TopUser {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  grade: string;
}

interface TopUsersTableProps {
  users: TopUser[];
  className?: string;
}

export function TopUsersTable({ users, className }: TopUsersTableProps) {
  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return 'text-amber-400';
      case 1: return 'text-slate-300';
      case 2: return 'text-orange-400';
      default: return 'text-slate-500';
    }
  };

  const getMedalEmoji = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-slate-900 border border-slate-800 rounded-xl overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">🏆 Top 10 XP</h3>
        <span className="text-xs text-slate-500">Cette semaine</span>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Utilisateur</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">XP</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Niveau</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {users.map((user, index) => (
              <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                <td className={cn("px-6 py-4 font-bold", getMedalColor(index))}>
                  {getMedalEmoji(index)}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-200">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-400">{user.grade}</td>
                <td className="px-6 py-4 text-right">
                  <span className="font-bold text-amber-500">{user.xp.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 font-bold text-sm">
                    {user.level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// DISTRIBUTION CARD - Stats de distribution
// ═══════════════════════════════════════════════════════════════════════════════════

interface DistributionItem {
  label: string;
  value: number;
  color: string;
}

interface DistributionCardProps {
  title: string;
  items: DistributionItem[];
  className?: string;
}

export function DistributionCard({ title, items, className }: DistributionCardProps) {
  const total = items.reduce((acc, item) => acc + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 bg-slate-900 border border-slate-800 rounded-xl",
        className
      )}
    >
      <h3 className="text-lg font-semibold text-slate-100 mb-4">{title}</h3>
      
      {/* Progress Bar */}
      <div className="h-3 rounded-full bg-slate-800 overflow-hidden flex mb-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="h-full transition-all duration-500"
            style={{
              width: `${total > 0 ? (item.value / total) * 100 : 0}%`,
              backgroundColor: item.color,
            }}
          />
        ))}
      </div>
      
      {/* Legend */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-400">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-200">{item.value}</span>
              <span className="text-slate-500">
                ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// PAGE HEADER - En-tête standard des pages admin
// ═══════════════════════════════════════════════════════════════════════════════════

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({ title, subtitle, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-slate-300 transition-colors">{crumb.label}</a>
                ) : (
                  <span className="text-slate-400">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-3xl font-bold text-slate-50 tracking-tight">{title}</h1>
        {subtitle && <p className="text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
