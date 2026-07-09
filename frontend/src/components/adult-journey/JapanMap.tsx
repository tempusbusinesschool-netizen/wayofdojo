'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ADULT_JOURNEY_CITIES, City } from '@/data/musashi/journey';
import { Lock, Check } from 'lucide-react';

interface JapanMapProps {
  completedMissions: string[];
  onCitySelect: (city: City) => void;
  selectedCityId?: string;
}

export function JapanMap({ completedMissions, onCitySelect, selectedCityId }: JapanMapProps) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const isCityUnlocked = (city: City): boolean => {
    if (!city.unlockRequirement) return true;
    
    const { previousCity, missionsCompleted } = city.unlockRequirement;
    if (previousCity) {
      const prevCity = ADULT_JOURNEY_CITIES.find(c => c.id === previousCity);
      if (prevCity) {
        const prevCompleted = prevCity.missions.filter(m => completedMissions.includes(m.id)).length;
        return prevCompleted >= (missionsCompleted || prevCity.missions.length);
      }
    }
    return true;
  };

  const getCityProgress = (city: City): number => {
    const completed = city.missions.filter(m => completedMissions.includes(m.id)).length;
    return Math.round((completed / city.missions.length) * 100);
  };

  // Simplified Japan outline (viewBox coordinates)
  const mapWidth = 400;
  const mapHeight = 500;

  // Convert lat/lng to SVG coordinates (simplified)
  const toSvgCoords = (lat: number, lng: number) => {
    const x = ((lng - 128) / 15) * mapWidth;
    const y = ((38 - lat) / 8) * mapHeight;
    return { x: Math.max(20, Math.min(mapWidth - 20, x)), y: Math.max(20, Math.min(mapHeight - 20, y)) };
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-4 border border-slate-700">
        {/* Title */}
        <div className="text-center mb-4">
          <h3 className="text-white font-bold text-lg">日本 Carte du Japon</h3>
          <p className="text-slate-400 text-xs">Le voyage de Musashi</p>
        </div>

        {/* SVG Map */}
        <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="w-full h-auto">
          {/* Background */}
          <defs>
            <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0c1445" />
              <stop offset="100%" stopColor="#1a237e" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <rect x="0" y="0" width={mapWidth} height={mapHeight} fill="url(#seaGradient)" rx="16" />

          {/* Simplified Japan outline */}
          <path
            d="M200,50 Q250,80 280,120 Q300,160 290,200 Q280,250 260,280 
               Q240,320 220,350 Q200,380 180,400 Q160,420 140,430
               Q120,420 100,400 Q80,380 70,350 Q60,320 70,280
               Q80,240 100,200 Q120,160 150,120 Q180,80 200,50"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="2"
            opacity="0.8"
          />

          {/* Connection lines between cities */}
          {ADULT_JOURNEY_CITIES.slice(0, -1).map((city, index) => {
            const nextCity = ADULT_JOURNEY_CITIES[index + 1];
            const from = toSvgCoords(city.latitude, city.longitude);
            const to = toSvgCoords(nextCity.latitude, nextCity.longitude);
            const unlocked = isCityUnlocked(city) && isCityUnlocked(nextCity);
            const completed = getCityProgress(city) === 100;
            
            return (
              <line
                key={`line-${city.id}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={completed ? '#10b981' : unlocked ? '#475569' : '#1e293b'}
                strokeWidth="2"
                strokeDasharray={unlocked ? '0' : '5,5'}
                opacity={unlocked ? 0.8 : 0.3}
              />
            );
          })}

          {/* City markers */}
          {ADULT_JOURNEY_CITIES.map((city) => {
            const coords = toSvgCoords(city.latitude, city.longitude);
            const unlocked = isCityUnlocked(city);
            const progress = getCityProgress(city);
            const isCompleted = progress === 100;
            const isSelected = selectedCityId === city.id;
            const isHovered = hoveredCity === city.id;

            return (
              <g
                key={city.id}
                className="cursor-pointer"
                onClick={() => unlocked && onCitySelect(city)}
                onMouseEnter={() => setHoveredCity(city.id)}
                onMouseLeave={() => setHoveredCity(null)}
              >
                {/* Glow effect for selected/hovered */}
                {(isSelected || isHovered) && unlocked && (
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r="24"
                    fill={city.color}
                    opacity="0.3"
                    filter="url(#glow)"
                  />
                )}

                {/* Progress ring */}
                {unlocked && progress > 0 && progress < 100 && (
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r="18"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray={`${(progress / 100) * 113} 113`}
                    transform={`rotate(-90 ${coords.x} ${coords.y})`}
                    opacity="0.8"
                  />
                )}

                {/* Main marker */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="14"
                  fill={unlocked ? (isCompleted ? '#10b981' : city.color) : '#374151'}
                  stroke={isSelected ? '#fff' : isCompleted ? '#34d399' : '#475569'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all duration-200"
                />

                {/* Icon */}
                <text
                  x={coords.x}
                  y={coords.y + 5}
                  textAnchor="middle"
                  fontSize="14"
                  className="select-none"
                >
                  {!unlocked ? '🔒' : isCompleted ? '✓' : city.icon}
                </text>

                {/* Label */}
                {(isHovered || isSelected) && (
                  <g>
                    <rect
                      x={coords.x - 35}
                      y={coords.y + 20}
                      width="70"
                      height="24"
                      rx="4"
                      fill="#1e293b"
                      stroke="#475569"
                    />
                    <text
                      x={coords.x}
                      y={coords.y + 36}
                      textAnchor="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {city.name}
                    </text>
                  </g>
                )}

                {/* Level badge */}
                <circle
                  cx={coords.x + 12}
                  cy={coords.y - 10}
                  r="8"
                  fill="#0f172a"
                  stroke={city.color}
                  strokeWidth="1"
                />
                <text
                  x={coords.x + 12}
                  y={coords.y - 7}
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                  fontWeight="bold"
                >
                  {city.level}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-400">Complété</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-400">En cours</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-slate-600" />
            <span className="text-slate-400">Verrouillé</span>
          </div>
        </div>
      </div>

      {/* City List (Mobile friendly) */}
      <div className="mt-4 space-y-2">
        {ADULT_JOURNEY_CITIES.map((city) => {
          const unlocked = isCityUnlocked(city);
          const progress = getCityProgress(city);
          const isCompleted = progress === 100;
          const isSelected = selectedCityId === city.id;

          return (
            <motion.div
              key={city.id}
              whileHover={{ scale: unlocked ? 1.02 : 1 }}
              whileTap={{ scale: unlocked ? 0.98 : 1 }}
              onClick={() => unlocked && onCitySelect(city)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-slate-800 to-slate-700 border-white/30'
                  : unlocked
                    ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    : 'bg-slate-900/50 border-slate-800 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                    isCompleted 
                      ? 'bg-emerald-500/20' 
                      : unlocked 
                        ? `bg-gradient-to-br ${city.gradient}` 
                        : 'bg-slate-700'
                  }`}
                >
                  {!unlocked ? <Lock className="w-4 h-4 text-slate-500" /> : isCompleted ? <Check className="w-5 h-5 text-emerald-400" /> : city.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold ${isCompleted ? 'text-emerald-400' : unlocked ? 'text-white' : 'text-slate-500'}`}>
                      {city.name}
                    </h4>
                    <span className="text-slate-500 text-xs">{city.nameJp}</span>
                  </div>
                  <p className="text-slate-400 text-xs">{city.theme}</p>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${isCompleted ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {progress}%
                  </div>
                  <div className="text-xs text-slate-500">Niveau {city.level}</div>
                </div>
              </div>
              
              {/* Progress bar */}
              {unlocked && (
                <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r ' + city.gradient}`}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default JapanMap;
