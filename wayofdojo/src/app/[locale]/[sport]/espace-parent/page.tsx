'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Users, Check, X, Clock, Award, Shield, 
  AlertCircle, Bell, Calendar, TrendingUp, Star, Eye,
  CheckCircle, XCircle, MessageSquare, BarChart3
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ESPACE PARENT — Dashboard de validation des activités enfants
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Fonctionnalités :
 * - Vue d'ensemble des enfants liés au compte
 * - Validation des activités complétées
 * - Suivi de la progression
 * - Notifications des accomplissements
 */

// Types
interface ChildActivity {
  id: string;
  type: 'technique' | 'game' | 'quiz' | 'challenge';
  name: string;
  description: string;
  completedAt: string;
  xpEarned: number;
  status: 'pending' | 'validated' | 'rejected';
  proof?: string;
}

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  avatar: string;
  grade: string;
  gradeColor: string;
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  pendingValidations: number;
  activities: ChildActivity[];
}

// Données de démonstration
const DEMO_CHILDREN: Child[] = [
  {
    id: 'child-1',
    firstName: 'Lucas',
    lastName: 'Dupont',
    age: 10,
    avatar: '🧒',
    grade: '6e Kyu',
    gradeColor: '#FFFFFF',
    xp: 450,
    level: 4,
    streak: 5,
    lastActive: "Aujourd'hui",
    pendingValidations: 3,
    activities: [
      {
        id: 'act-1',
        type: 'technique',
        name: 'Mae Ukemi',
        description: 'A pratiqué la chute avant 10 fois',
        completedAt: "Aujourd'hui à 14:30",
        xpEarned: 25,
        status: 'pending',
      },
      {
        id: 'act-2',
        type: 'game',
        name: 'Le Gardien du Temple',
        description: 'Score: 850 points - Niveau Expert',
        completedAt: "Aujourd'hui à 15:45",
        xpEarned: 50,
        status: 'pending',
      },
      {
        id: 'act-3',
        type: 'quiz',
        name: 'Quiz des Vertus',
        description: '7/7 bonnes réponses',
        completedAt: 'Hier à 18:00',
        xpEarned: 30,
        status: 'pending',
      },
      {
        id: 'act-4',
        type: 'challenge',
        name: 'Défi du Jour',
        description: 'Pratiquer 3 techniques différentes',
        completedAt: 'Hier à 17:30',
        xpEarned: 40,
        status: 'validated',
      },
    ],
  },
  {
    id: 'child-2',
    firstName: 'Emma',
    lastName: 'Dupont',
    age: 8,
    avatar: '👧',
    grade: '6e Kyu',
    gradeColor: '#FFFFFF',
    xp: 280,
    level: 3,
    streak: 3,
    lastActive: 'Hier',
    pendingValidations: 1,
    activities: [
      {
        id: 'act-5',
        type: 'technique',
        name: 'Seiza',
        description: 'A maintenu la posture 2 minutes',
        completedAt: 'Hier à 16:00',
        xpEarned: 20,
        status: 'pending',
      },
      {
        id: 'act-6',
        type: 'game',
        name: 'Messager du Ki',
        description: 'Score: 520 points',
        completedAt: 'Il y a 2 jours',
        xpEarned: 35,
        status: 'validated',
      },
    ],
  },
];

// Icône par type d'activité
const getActivityIcon = (type: ChildActivity['type']) => {
  switch (type) {
    case 'technique': return '🥋';
    case 'game': return '🎮';
    case 'quiz': return '📝';
    case 'challenge': return '🎯';
    default: return '⭐';
  }
};

// Couleur par type
const getActivityColor = (type: ChildActivity['type']) => {
  switch (type) {
    case 'technique': return 'from-blue-600 to-cyan-600';
    case 'game': return 'from-purple-600 to-pink-600';
    case 'quiz': return 'from-amber-600 to-orange-600';
    case 'challenge': return 'from-emerald-600 to-teal-600';
    default: return 'from-slate-600 to-slate-700';
  }
};

export default function EspaceParentPage() {
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>(DEMO_CHILDREN);
  const [selectedChild, setSelectedChild] = useState<string | null>(DEMO_CHILDREN[0]?.id || null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'validated'>('pending');
  const [showConfirmModal, setShowConfirmModal] = useState<{activityId: string; action: 'validate' | 'reject'} | null>(null);

  const currentChild = children.find(c => c.id === selectedChild);
  const totalPending = children.reduce((sum, c) => sum + c.pendingValidations, 0);

  // Valider ou rejeter une activité
  const handleActivityAction = (childId: string, activityId: string, action: 'validate' | 'reject') => {
    setChildren(prev => prev.map(child => {
      if (child.id !== childId) return child;
      
      return {
        ...child,
        pendingValidations: child.pendingValidations - 1,
        activities: child.activities.map(act => {
          if (act.id !== activityId) return act;
          return { ...act, status: action === 'validate' ? 'validated' : 'rejected' };
        })
      };
    }));
    setShowConfirmModal(null);
  };

  // Filtrer les activités
  const getFilteredActivities = (activities: ChildActivity[]) => {
    if (filter === 'all') return activities;
    if (filter === 'pending') return activities.filter(a => a.status === 'pending');
    return activities.filter(a => a.status === 'validated');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-slate-800"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Espace Parent
            </h1>
            <p className="text-sm text-slate-400">
              Validez les activités de vos enfants
            </p>
          </div>
          {/* Badge notifications */}
          {totalPending > 0 && (
            <div className="relative">
              <Bell className="w-6 h-6 text-slate-400" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                {totalPending}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Liste des enfants */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="font-bold text-slate-400 uppercase text-xs tracking-wider px-2">
              Mes Enfants
            </h2>
            
            <div className="space-y-2">
              {children.map((child) => (
                <motion.button
                  key={child.id}
                  onClick={() => setSelectedChild(child.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid={`child-${child.id}`}
                  className={`w-full p-4 rounded-2xl border transition-all text-left ${
                    selectedChild === child.id
                      ? 'bg-emerald-600/20 border-emerald-500/50'
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{child.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{child.firstName}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span 
                          className="px-2 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: `${child.gradeColor}20`,
                            color: child.gradeColor === '#FFFFFF' ? '#94a3b8' : child.gradeColor,
                            border: child.gradeColor === '#FFFFFF' ? '1px solid #475569' : 'none'
                          }}
                        >
                          {child.grade}
                        </span>
                        <span className="text-slate-500">{child.age} ans</span>
                      </div>
                    </div>
                    {child.pendingValidations > 0 && (
                      <span className="w-6 h-6 bg-amber-500 rounded-full text-xs flex items-center justify-center font-bold text-slate-900">
                        {child.pendingValidations}
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Ajouter un enfant */}
            <Button
              variant="outline"
              className="w-full border-dashed border-slate-600 hover:border-emerald-500 hover:bg-emerald-500/10"
              data-testid="add-child-btn"
            >
              + Ajouter un enfant
            </Button>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-6">
            {currentChild ? (
              <>
                {/* Stats de l'enfant */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                    <div className="text-5xl">{currentChild.avatar}</div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">{currentChild.firstName} {currentChild.lastName}</h2>
                      <p className="text-slate-400">{currentChild.age} ans • Dernière activité: {currentChild.lastActive}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔥</span>
                      <span className="text-xl font-bold text-amber-400">{currentChild.streak} jours</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                      <Award className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{currentChild.xp}</p>
                      <p className="text-xs text-slate-400">XP Total</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                      <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">Niv. {currentChild.level}</p>
                      <p className="text-xs text-slate-400">Niveau</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                      <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{currentChild.grade}</p>
                      <p className="text-xs text-slate-400">Ceinture</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                      <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{currentChild.activities.length}</p>
                      <p className="text-xs text-slate-400">Activités</p>
                    </div>
                  </div>
                </motion.div>

                {/* Filtres */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {[
                    { id: 'pending', label: 'En attente', icon: Clock, count: currentChild.pendingValidations },
                    { id: 'validated', label: 'Validées', icon: CheckCircle, count: currentChild.activities.filter(a => a.status === 'validated').length },
                    { id: 'all', label: 'Toutes', icon: BarChart3, count: currentChild.activities.length },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id as 'pending' | 'validated' | 'all')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                        filter === f.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <f.icon className="w-4 h-4" />
                      <span>{f.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        filter === f.id ? 'bg-white/20' : 'bg-slate-700'
                      }`}>
                        {f.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Liste des activités */}
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {getFilteredActivities(currentChild.activities).length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-slate-500"
                      >
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Aucune activité {filter === 'pending' ? 'en attente' : ''}</p>
                      </motion.div>
                    ) : (
                      getFilteredActivities(currentChild.activities).map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ delay: index * 0.05 }}
                          layout
                          className={`bg-gradient-to-r ${getActivityColor(activity.type)} p-[1px] rounded-2xl`}
                        >
                          <div className="bg-slate-900 rounded-2xl p-4">
                            <div className="flex items-start gap-4">
                              {/* Icône */}
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getActivityColor(activity.type)} flex items-center justify-center text-2xl flex-shrink-0`}>
                                {getActivityIcon(activity.type)}
                              </div>
                              
                              {/* Contenu */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-bold text-white">{activity.name}</h3>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    activity.status === 'pending' 
                                      ? 'bg-amber-500/20 text-amber-400'
                                      : activity.status === 'validated'
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-red-500/20 text-red-400'
                                  }`}>
                                    {activity.status === 'pending' ? 'En attente' : activity.status === 'validated' ? 'Validé' : 'Rejeté'}
                                  </span>
                                </div>
                                <p className="text-slate-400 text-sm mt-1">{activity.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {activity.completedAt}
                                  </span>
                                  <span className="flex items-center gap-1 text-amber-400">
                                    <Star className="w-3 h-3" />
                                    +{activity.xpEarned} XP
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              {activity.status === 'pending' && (
                                <div className="flex gap-2 flex-shrink-0">
                                  <Button
                                    size="sm"
                                    onClick={() => handleActivityAction(currentChild.id, activity.id, 'validate')}
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                    data-testid={`validate-${activity.id}`}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleActivityAction(currentChild.id, activity.id, 'reject')}
                                    className="border-red-500/50 hover:bg-red-500/20 text-red-400"
                                    data-testid={`reject-${activity.id}`}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}

                              {/* Icône de statut */}
                              {activity.status !== 'pending' && (
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  activity.status === 'validated' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                                }`}>
                                  {activity.status === 'validated' 
                                    ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    : <XCircle className="w-5 h-5 text-red-400" />
                                  }
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                {/* Actions globales */}
                {currentChild.pendingValidations > 0 && (
                  <div className="flex gap-3 justify-center pt-4">
                    <Button
                      onClick={() => {
                        // Valider toutes les activités en attente
                        currentChild.activities
                          .filter(a => a.status === 'pending')
                          .forEach(a => handleActivityAction(currentChild.id, a.id, 'validate'));
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Tout valider ({currentChild.pendingValidations})
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 text-slate-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Sélectionnez un enfant pour voir ses activités</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
