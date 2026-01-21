'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════════

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  theme?: 'dark' | 'light';
}

// ═══════════════════════════════════════════════════════════════════════════════════
// CHART CONTAINER - Wrapper with title
// ═══════════════════════════════════════════════════════════════════════════════════

export function ChartContainer({ title, subtitle, children, className, theme = 'dark' }: ChartContainerProps) {
  const isDark = theme === 'dark';
  
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
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className={cn(
            "text-lg font-semibold",
            isDark ? "text-slate-100" : "text-slate-900"
          )}>{title}</h3>
          {subtitle && (
            <p className={cn(
              "text-sm mt-1",
              isDark ? "text-slate-500" : "text-slate-500"
            )}>{subtitle}</p>
          )}
        </div>
      </div>
      <div className="h-[280px]">
        {children}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// USER GROWTH CHART - Area chart showing user growth over time
// ═══════════════════════════════════════════════════════════════════════════════════

interface UserGrowthData {
  date: string;
  users: number;
  newUsers: number;
}

interface UserGrowthChartProps {
  data?: UserGrowthData[];
  theme?: 'dark' | 'light';
  className?: string;
}

// Generate mock data for demo
function generateUserGrowthData(): UserGrowthData[] {
  const data: UserGrowthData[] = [];
  const now = new Date();
  let totalUsers = 150;
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const newUsers = Math.floor(Math.random() * 8) + 1;
    totalUsers += newUsers;
    
    data.push({
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      users: totalUsers,
      newUsers
    });
  }
  
  return data;
}

export function UserGrowthChart({ data, theme = 'dark', className }: UserGrowthChartProps) {
  const isDark = theme === 'dark';
  const chartData = data || generateUserGrowthData();
  
  const colors = {
    grid: isDark ? '#334155' : '#e2e8f0',
    text: isDark ? '#94a3b8' : '#64748b',
    area: '#8b5cf6',
    areaGradient: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
    tooltip: {
      bg: isDark ? '#1e293b' : '#ffffff',
      border: isDark ? '#334155' : '#e2e8f0',
      text: isDark ? '#f8fafc' : '#0f172a'
    }
  };

  return (
    <ChartContainer 
      title="📈 Croissance des Utilisateurs" 
      subtitle="30 derniers jours"
      theme={theme}
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.area} stopOpacity={0.4} />
              <stop offset="95%" stopColor={colors.area} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke={colors.text} 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke={colors.text} 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltip.bg,
              border: `1px solid ${colors.tooltip.border}`,
              borderRadius: '8px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
              color: colors.tooltip.text
            }}
            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke={colors.area}
            strokeWidth={2}
            fill="url(#userGradient)"
            name="Total utilisateurs"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// ACTIVITY BAR CHART - Bar chart showing daily activity
// ═══════════════════════════════════════════════════════════════════════════════════

interface ActivityData {
  day: string;
  logins: number;
  challenges: number;
  techniques: number;
}

interface ActivityChartProps {
  data?: ActivityData[];
  theme?: 'dark' | 'light';
  className?: string;
}

// Generate mock data for demo
function generateActivityData(): ActivityData[] {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  return days.map(day => ({
    day,
    logins: Math.floor(Math.random() * 30) + 10,
    challenges: Math.floor(Math.random() * 20) + 5,
    techniques: Math.floor(Math.random() * 15) + 3
  }));
}

export function ActivityChart({ data, theme = 'dark', className }: ActivityChartProps) {
  const isDark = theme === 'dark';
  const chartData = data || generateActivityData();
  
  const colors = {
    grid: isDark ? '#334155' : '#e2e8f0',
    text: isDark ? '#94a3b8' : '#64748b',
    logins: '#f59e0b',
    challenges: '#8b5cf6',
    techniques: '#10b981',
    tooltip: {
      bg: isDark ? '#1e293b' : '#ffffff',
      border: isDark ? '#334155' : '#e2e8f0',
      text: isDark ? '#f8fafc' : '#0f172a'
    }
  };

  return (
    <ChartContainer 
      title="📊 Activité Hebdomadaire" 
      subtitle="Cette semaine"
      theme={theme}
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
          <XAxis 
            dataKey="day" 
            stroke={colors.text} 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke={colors.text} 
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltip.bg,
              border: `1px solid ${colors.tooltip.border}`,
              borderRadius: '8px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
              color: colors.tooltip.text
            }}
            cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            iconType="circle"
            iconSize={8}
          />
          <Bar dataKey="logins" name="Connexions" fill={colors.logins} radius={[4, 4, 0, 0]} />
          <Bar dataKey="challenges" name="Défis" fill={colors.challenges} radius={[4, 4, 0, 0]} />
          <Bar dataKey="techniques" name="Techniques" fill={colors.techniques} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// XP PROGRESS LINE CHART - Line chart showing XP earned over time
// ═══════════════════════════════════════════════════════════════════════════════════

interface XPProgressData {
  date: string;
  xp: number;
}

interface XPProgressChartProps {
  data?: XPProgressData[];
  theme?: 'dark' | 'light';
  className?: string;
}

// Generate mock data
function generateXPProgressData(): XPProgressData[] {
  const data: XPProgressData[] = [];
  const now = new Date();
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      xp: Math.floor(Math.random() * 500) + 200
    });
  }
  
  return data;
}

export function XPProgressChart({ data, theme = 'dark', className }: XPProgressChartProps) {
  const isDark = theme === 'dark';
  const chartData = data || generateXPProgressData();
  
  const colors = {
    grid: isDark ? '#334155' : '#e2e8f0',
    text: isDark ? '#94a3b8' : '#64748b',
    line: '#f59e0b',
    dot: '#f59e0b',
    tooltip: {
      bg: isDark ? '#1e293b' : '#ffffff',
      border: isDark ? '#334155' : '#e2e8f0',
      text: isDark ? '#f8fafc' : '#0f172a'
    }
  };

  return (
    <ChartContainer 
      title="⭐ XP Gagnés" 
      subtitle="14 derniers jours"
      theme={theme}
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke={colors.text} 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke={colors.text} 
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltip.bg,
              border: `1px solid ${colors.tooltip.border}`,
              borderRadius: '8px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
              color: colors.tooltip.text
            }}
            formatter={(value) => [`${Number(value).toLocaleString()} XP`, 'XP gagnés']}
          />
          <Line
            type="monotone"
            dataKey="xp"
            stroke={colors.line}
            strokeWidth={3}
            dot={{ fill: colors.dot, strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: colors.dot }}
            name="XP"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// DISTRIBUTION PIE CHART - Pie chart for distributions
// ═══════════════════════════════════════════════════════════════════════════════════

interface DistributionPieData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface DistributionPieChartProps {
  title: string;
  subtitle?: string;
  data: DistributionPieData[];
  theme?: 'dark' | 'light';
  className?: string;
}

export function DistributionPieChart({ title, subtitle, data, theme = 'dark', className }: DistributionPieChartProps) {
  const isDark = theme === 'dark';
  
  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);
  
  const colors = {
    tooltip: {
      bg: isDark ? '#1e293b' : '#ffffff',
      border: isDark ? '#334155' : '#e2e8f0',
      text: isDark ? '#f8fafc' : '#0f172a'
    }
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ChartContainer 
      title={title} 
      subtitle={subtitle}
      theme={theme}
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={90}
            innerRadius={50}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltip.bg,
              border: `1px solid ${colors.tooltip.border}`,
              borderRadius: '8px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
              color: colors.tooltip.text
            }}
            formatter={(value, name) => [
              `${Number(value)} (${total > 0 ? Math.round((Number(value) / total) * 100) : 0}%)`,
              name
            ]}
          />
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }}
            iconType="circle"
            iconSize={10}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
