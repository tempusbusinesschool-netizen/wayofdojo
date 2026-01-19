'use client';

import { motion } from 'framer-motion';
import { Rocket, BookOpen, Dumbbell, CheckCircle, Sparkles, Crown } from 'lucide-react';

interface NinjaJourneyProps {
  onStepClick?: (step: number) => void;
  currentStep?: number;
}

const journeySteps = [
  {
    id: 1,
    title: 'Commence',
    subtitle: 'Crée ton compte Ninja',
    icon: Rocket,
    color: 'from-emerald-500 to-green-600',
    bgGlow: 'shadow-emerald-500/30',
    emoji: '🚀',
  },
  {
    id: 2,
    title: 'Apprends',
    subtitle: 'Découvre les techniques',
    icon: BookOpen,
    color: 'from-cyan-500 to-blue-600',
    bgGlow: 'shadow-cyan-500/30',
    emoji: '📚',
  },
  {
    id: 3,
    title: 'Entraîne-toi',
    subtitle: 'Pratique au dojo',
    icon: Dumbbell,
    color: 'from-amber-500 to-orange-600',
    bgGlow: 'shadow-amber-500/30',
    emoji: '💪',
  },
  {
    id: 4,
    title: 'Valide',
    subtitle: 'Fais valider par tes parents',
    icon: CheckCircle,
    color: 'from-pink-500 to-rose-600',
    bgGlow: 'shadow-pink-500/30',
    emoji: '✅',
  },
  {
    id: 5,
    title: 'Progresse',
    subtitle: 'Gagne XP et monte de niveau',
    icon: Sparkles,
    color: 'from-violet-500 to-purple-600',
    bgGlow: 'shadow-violet-500/30',
    emoji: '⭐',
  },
  {
    id: 6,
    title: 'Maîtrise',
    subtitle: 'Deviens un vrai maître',
    icon: Crown,
    color: 'from-red-500 to-orange-600',
    bgGlow: 'shadow-red-500/30',
    emoji: '👑',
  },
];

export default function NinjaJourney({ onStepClick, currentStep = 0 }: NinjaJourneyProps) {
  return (
    <div className="w-full py-8" data-testid="ninja-journey">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
          Ton Parcours Ninja en 6 étapes ! 🥷
        </h2>
        <p className="text-slate-400">Clique sur une étape pour en savoir plus !</p>
      </motion.div>

      {/* Progress Line */}
      <div className="relative max-w-6xl mx-auto px-4">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-slate-800 rounded-full transform -translate-y-1/2 hidden md:block" />
        
        {/* Active Progress Line */}
        <motion.div
          className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 rounded-full transform -translate-y-1/2 hidden md:block"
          initial={{ width: '0%' }}
          animate={{ width: `${Math.max(0, (currentStep / 6) * 100)}%` }}
          transition={{ duration: 0.5 }}
        />

        {/* Steps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {journeySteps.map((step, index) => (
            <motion.button
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStepClick?.(step.id)}
              className={`relative group`}
            >
              {/* Card */}
              <div className={`relative bg-gradient-to-br ${step.color} rounded-2xl p-4 md:p-5 shadow-xl ${step.bgGlow} transition-all duration-300 group-hover:shadow-2xl`}>
                {/* Step Number Badge */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center border-2 border-white text-white font-black text-sm">
                  {step.id}
                </div>

                {/* Icon Container */}
                <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-4xl">{step.emoji}</span>
                </div>

                {/* Text */}
                <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                <p className="text-white/80 text-xs leading-tight">{step.subtitle}</p>

                {/* Decorative Elements */}
                <div className="absolute top-2 right-2 opacity-30">
                  <step.icon className="w-4 h-4 text-white" />
                </div>

                {/* Completed Check */}
                {currentStep >= step.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>

              {/* Connector Line (hidden on small screens) */}
              {index < journeySteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-slate-600" />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
