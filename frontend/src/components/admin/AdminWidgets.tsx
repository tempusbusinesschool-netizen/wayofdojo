'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════════════════════
// STAT CARD - Widget KPI avec tendance (DARK/LIGHT)
// ═══════════════════════════════════════════════════════════════════════════════════

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: number; positive: boolean };
  variant?: 'default' | 'amber' | 'violet' | 'emerald' | 'blue';
  className?: string;
  theme?: 'dark' | 'light';
}

export function StatCard({ label, value, icon, trend, variant = 'default', className, theme = 'dark' }: StatCardProps) {
  const isDark = theme === 'dark';
  
  const variantStyles = {
    default: isDark ? 'from-slate-800/50 to-transparent' : 'from-slate-100 to-transparent',
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
        "relative overflow-hidden p-6 rounded-xl transition-all duration-300",
        isDark 
          ? "bg-slate-900 border border-slate-800 hover:border-slate-700" 
          : "bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md",
        className
      )}
    >
      {/* Gradient Background */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", variantStyles[variant])} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <span className={cn(
            "text-xs font-semibold uppercase tracking-wider",
            isDark ? "text-slate-500" : "text-slate-500"
          )}>{label}</span>
          <div className={cn(
            "p-2 rounded-lg",
            isDark ? "bg-slate-800/50" : "bg-slate-100",
            iconColors[variant]
          )}>
            {icon}
          </div>
        </div>
        
        {/* Value */}
        <div className="flex items-end justify-between">
          <span className={cn(
            "text-3xl font-bold tracking-tight",
            isDark ? "text-slate-50" : "text-slate-900"
          )}>{value}</span>
          
          {/* Trend */}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              trend.positive 
                ? "text-emerald-500 bg-emerald-500/10" 
                : "text-red-500 bg-red-500/10"
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
// CHART WIDGET - Container pour graphiques (DARK/LIGHT)
// ═══════════════════════════════════════════════════════════════════════════════════

interface ChartWidgetProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  theme?: 'dark' | 'light';
}

export function ChartWidget({ title, subtitle, children, actions, className, theme = 'dark' }: ChartWidgetProps) {
  const isDark = theme === 'dark';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 rounded-xl transition-all duration-300",
        isDark 
          ? "bg-slate-900 border border-slate-800 hover:border-slate-700" 
          : "bg-white border border-slate-200 hover:border-slate-300 shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className={cn(
            "text-lg font-semibold",
            isDark ? "text-slate-100" : "text-slate-900"
          )}>{title}</h3>
          {subtitle && <p className={cn(
            "text-sm mt-1",
            isDark ? "text-slate-500" : "text-slate-500"
          )}>{subtitle}</p>}
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
// ACTIVITY FEED - Liste d'activités récentes (DARK/LIGHT)
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
  theme?: 'dark' | 'light';
}

export function ActivityFeed({ items, className, theme = 'dark' }: ActivityFeedProps) {
  const isDark = theme === 'dark';
  
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
        "rounded-xl overflow-hidden transition-all duration-300",
        isDark 
          ? "bg-slate-900 border border-slate-800" 
          : "bg-white border border-slate-200 shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        "px-6 py-4 border-b",
        isDark ? "border-slate-800" : "border-slate-200"
      )}>
        <h3 className={cn(
          "text-lg font-semibold",
          isDark ? "text-slate-100" : "text-slate-900"
        )}>Activité Récente</h3>
      </div>
      
      {/* List */}
      <div className={cn(
        "divide-y max-h-[400px] overflow-y-auto",
        isDark ? "divide-slate-800" : "divide-slate-100"
      )}>
        {items.length === 0 ? (
          <div className={cn(
            "px-6 py-8 text-center",
            isDark ? "text-slate-500" : "text-slate-400"
          )}>
            Aucune activité récente
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className={cn(
              "px-6 py-4 transition-colors",
              isDark ? "hover:bg-slate-800/30" : "hover:bg-slate-50"
            )}>
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
                  <p className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                    <span className={cn("font-medium", isDark ? "text-slate-100" : "text-slate-900")}>{item.user.name}</span>
                    {' '}{item.action}
                    {item.target && <span className="text-amber-500"> {item.target}</span>}
                  </p>
                  <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-slate-400")}>{item.timestamp}</p>
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
// TOP USERS TABLE - Classement XP (DARK/LIGHT)
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
  theme?: 'dark' | 'light';
}

export function TopUsersTable({ users, className, theme = 'dark' }: TopUsersTableProps) {
  const isDark = theme === 'dark';
  
  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return 'text-amber-400';
      case 1: return 'text-slate-400';
      case 2: return 'text-orange-400';
      default: return isDark ? 'text-slate-500' : 'text-slate-400';
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
        "rounded-xl overflow-hidden transition-all duration-300",
        isDark 
          ? "bg-slate-900 border border-slate-800" 
          : "bg-white border border-slate-200 shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        "px-6 py-4 border-b flex items-center justify-between",
        isDark ? "border-slate-800" : "border-slate-200"
      )}>
        <h3 className={cn(
          "text-lg font-semibold",
          isDark ? "text-slate-100" : "text-slate-900"
        )}>🏆 Top 10 XP</h3>
        <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>Cette semaine</span>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={cn("border-b", isDark ? "border-slate-800" : "border-slate-200")}>
              <th className={cn(
                "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider",
                isDark ? "text-slate-500" : "text-slate-500"
              )}>#</th>
              <th className={cn(
                "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider",
                isDark ? "text-slate-500" : "text-slate-500"
              )}>Utilisateur</th>
              <th className={cn(
                "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider",
                isDark ? "text-slate-500" : "text-slate-500"
              )}>Grade</th>
              <th className={cn(
                "px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider",
                isDark ? "text-slate-500" : "text-slate-500"
              )}>XP</th>
              <th className={cn(
                "px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider",
                isDark ? "text-slate-500" : "text-slate-500"
              )}>Niveau</th>
            </tr>
          </thead>
          <tbody className={cn("divide-y", isDark ? "divide-slate-800/50" : "divide-slate-100")}>
            {users.map((user, index) => (
              <tr key={user.id} className={cn(
                "transition-colors",
                isDark ? "hover:bg-slate-800/30" : "hover:bg-slate-50"
              )}>
                <td className={cn("px-6 py-4 font-bold", getMedalColor(index))}>
                  {getMedalEmoji(index)}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className={cn("font-medium", isDark ? "text-slate-200" : "text-slate-900")}>{user.name}</p>
                    <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>{user.email}</p>
                  </div>
                </td>
                <td className={cn("px-6 py-4", isDark ? "text-slate-400" : "text-slate-600")}>{user.grade}</td>
                <td className="px-6 py-4 text-right">
                  <span className="font-bold text-amber-500">{user.xp.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={cn(
                    "inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm",
                    isDark ? "bg-violet-500/20 text-violet-400" : "bg-violet-100 text-violet-600"
                  )}>
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
// DISTRIBUTION CARD - Stats de distribution (DARK/LIGHT)
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
  theme?: 'dark' | 'light';
}

export function DistributionCard({ title, items, className, theme = 'dark' }: DistributionCardProps) {
  const isDark = theme === 'dark';
  const total = items.reduce((acc, item) => acc + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 rounded-xl transition-all duration-300",
        isDark 
          ? "bg-slate-900 border border-slate-800" 
          : "bg-white border border-slate-200 shadow-sm",
        className
      )}
    >
      <h3 className={cn(
        "text-lg font-semibold mb-4",
        isDark ? "text-slate-100" : "text-slate-900"
      )}>{title}</h3>
      
      {/* Progress Bar */}
      <div className={cn(
        "h-3 rounded-full overflow-hidden flex mb-4",
        isDark ? "bg-slate-800" : "bg-slate-200"
      )}>
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
              <span className={isDark ? "text-slate-400" : "text-slate-600"}>{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("font-medium", isDark ? "text-slate-200" : "text-slate-900")}>{item.value}</span>
              <span className={isDark ? "text-slate-500" : "text-slate-400"}>
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
// PAGE HEADER - En-tête standard des pages admin (DARK/LIGHT)
// ═══════════════════════════════════════════════════════════════════════════════════

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  theme?: 'dark' | 'light';
}

export function PageHeader({ title, subtitle, actions, breadcrumbs, theme = 'dark' }: PageHeaderProps) {
  const isDark = theme === 'dark';
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className={cn(
            "flex items-center gap-2 text-sm mb-2",
            isDark ? "text-slate-500" : "text-slate-400"
          )}>
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className={cn(
                    "transition-colors",
                    isDark ? "hover:text-slate-300" : "hover:text-slate-600"
                  )}>{crumb.label}</a>
                ) : (
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        )}
        <h1 className={cn(
          "text-3xl font-bold tracking-tight",
          isDark ? "text-slate-50" : "text-slate-900"
        )}>{title}</h1>
        {subtitle && <p className={cn(
          "mt-1",
          isDark ? "text-slate-400" : "text-slate-500"
        )}>{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
