/**
 * 🎓 INTERFACE ENSEIGNANT - Validation des exercices au dojo réel
 * 
 * Permet aux enseignants de :
 * - Voir la liste des élèves présents
 * - Valider les exercices effectués au dojo
 * - Attribuer des points de Ki
 * - Suivre la progression globale
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, Check, X, Search, Award, Clock, 
  CheckCircle2, XCircle, Trophy, Star, 
  UserCheck, BookOpen, Filter
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

// Exercices du dojo réel
const DOJO_EXERCISES = [
  { 
    id: 'tai_sabaki', 
    name: 'Tai Sabaki en groupe', 
    emoji: '🦶', 
    kiReward: 30,
    description: 'Déplacements de base en synchronisation',
    category: 'deplacements'
  },
  { 
    id: 'ukemi_partenaire', 
    name: 'Ukemi avec partenaire', 
    emoji: '🔄', 
    kiReward: 35,
    description: 'Chutes avant et arrière en duo',
    category: 'chutes'
  },
  { 
    id: 'randori_guide', 
    name: 'Randori guidé', 
    emoji: '⚔️', 
    kiReward: 40,
    description: 'Combat libre sous supervision',
    category: 'pratique'
  },
  { 
    id: 'meditation', 
    name: 'Méditation collective', 
    emoji: '🧘', 
    kiReward: 25,
    description: 'Séance de Mokusō au dojo',
    category: 'mental'
  },
  { 
    id: 'kata_duo', 
    name: 'Kata en duo', 
    emoji: '🤝', 
    kiReward: 45,
    description: 'Formes techniques avec partenaire',
    category: 'techniques'
  },
  { 
    id: 'seiza', 
    name: 'Seiza & Salut parfait', 
    emoji: '🙇', 
    kiReward: 20,
    description: 'Position assise traditionnelle et salutation',
    category: 'etiquette'
  },
  { 
    id: 'kokyu_ho', 
    name: 'Kokyu Ho', 
    emoji: '💨', 
    kiReward: 35,
    description: 'Exercice de respiration et d\'extension du Ki',
    category: 'ki'
  },
  { 
    id: 'suwari_waza', 
    name: 'Suwari Waza', 
    emoji: '🧎', 
    kiReward: 40,
    description: 'Techniques à genoux',
    category: 'techniques'
  },
];

// Catégories d'exercices
const CATEGORIES = [
  { id: 'all', name: 'Tous', emoji: '📋' },
  { id: 'deplacements', name: 'Déplacements', emoji: '🦶' },
  { id: 'chutes', name: 'Chutes', emoji: '🔄' },
  { id: 'techniques', name: 'Techniques', emoji: '🥋' },
  { id: 'mental', name: 'Mental', emoji: '🧘' },
  { id: 'etiquette', name: 'Étiquette', emoji: '🙇' },
  { id: 'ki', name: 'Ki', emoji: '✨' },
];

const TeacherValidationInterface = ({ 
  isOpen, 
  onClose,
  dojoId,
  teacherName 
}) => {
  // États
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [validatingExercise, setValidatingExercise] = useState(null);
  const [validationHistory, setValidationHistory] = useState([]);

  // Charger les élèves
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        // Simuler un appel API
        // const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dojo/${dojoId}/students`);
        
        // Données simulées pour la démo
        const mockStudents = [
          { id: '1', name: 'Bill', avatar: '🥷', belt: '6e Kyu', age: 8, ki: 245, todayPresent: true },
          { id: '2', name: 'Emma', avatar: '👧', belt: '5e Kyu', age: 10, ki: 380, todayPresent: true },
          { id: '3', name: 'Lucas', avatar: '👦', belt: '6e Kyu', age: 7, ki: 120, todayPresent: true },
          { id: '4', name: 'Léa', avatar: '👧', belt: '4e Kyu', age: 12, ki: 520, todayPresent: false },
          { id: '5', name: 'Thomas', avatar: '🧒', belt: '5e Kyu', age: 9, ki: 290, todayPresent: true },
          { id: '6', name: 'Chloé', avatar: '👧', belt: '6e Kyu', age: 6, ki: 85, todayPresent: true },
        ];
        
        setStudents(mockStudents);
        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement élèves:', error);
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen, dojoId]);

  // Charger l'historique des validations
  useEffect(() => {
    const saved = localStorage.getItem('aikido_teacher_validations');
    if (saved) {
      setValidationHistory(JSON.parse(saved));
    }
  }, []);

  // Filtrer les élèves
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Filtrer les exercices par catégorie
  const filteredExercises = DOJO_EXERCISES.filter(ex => 
    selectedCategory === 'all' || ex.category === selectedCategory
  );

  // Valider un exercice pour un élève
  const handleValidateExercise = async (studentId, exerciseId) => {
    const exercise = DOJO_EXERCISES.find(e => e.id === exerciseId);
    const student = students.find(s => s.id === studentId);
    
    if (!exercise || !student) return;

    setValidatingExercise(exerciseId);

    try {
      // Simuler l'appel API
      // await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/dojo/validate`, {
      //   studentId,
      //   exerciseId,
      //   teacherId: teacherName,
      //   kiReward: exercise.kiReward
      // });

      // Mettre à jour localement
      const validation = {
        id: Date.now(),
        studentId,
        studentName: student.name,
        exerciseId,
        exerciseName: exercise.name,
        kiReward: exercise.kiReward,
        validatedAt: new Date().toISOString(),
        validatedBy: teacherName
      };

      const newHistory = [validation, ...validationHistory];
      setValidationHistory(newHistory);
      localStorage.setItem('aikido_teacher_validations', JSON.stringify(newHistory));

      // Mettre à jour le Ki de l'élève
      setStudents(current => 
        current.map(s => 
          s.id === studentId 
            ? { ...s, ki: s.ki + exercise.kiReward }
            : s
        )
      );

      toast.success(
        <div className="flex items-center gap-2">
          <span className="text-2xl">{exercise.emoji}</span>
          <div>
            <p className="font-bold">{student.name} +{exercise.kiReward} Ki</p>
            <p className="text-sm text-slate-300">{exercise.name} validé</p>
          </div>
        </div>
      );

      setTimeout(() => setValidatingExercise(null), 500);
    } catch (error) {
      console.error('Erreur validation:', error);
      toast.error('Erreur lors de la validation');
      setValidatingExercise(null);
    }
  };

  // Vérifier si un exercice a déjà été validé aujourd'hui
  const isExerciseValidatedToday = (studentId, exerciseId) => {
    const today = new Date().toDateString();
    return validationHistory.some(v => 
      v.studentId === studentId && 
      v.exerciseId === exerciseId &&
      new Date(v.validatedAt).toDateString() === today
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-emerald-500/30 p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Interface Enseignant - Validation des exercices</DialogTitle>
          <DialogDescription>Validez les exercices effectués par vos élèves au dojo</DialogDescription>
        </VisuallyHidden>

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 p-4 border-b border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <UserCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Interface Enseignant</h2>
                <p className="text-emerald-200 text-sm">Validation des exercices au dojo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-white text-sm">
                  🥋 {teacherName || 'Sensei'}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Corps */}
        <div className="flex h-[calc(90vh-100px)]">
          {/* Liste des élèves */}
          <div className="w-1/3 border-r border-slate-700 p-4 overflow-y-auto">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher un élève..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Élèves présents</h3>
              <span className="text-emerald-400 text-sm">
                {filteredStudents.filter(s => s.todayPresent).length} présent(s)
              </span>
            </div>

            <div className="space-y-2">
              {filteredStudents.map(student => (
                <motion.button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full p-3 rounded-xl text-left transition-all flex items-center gap-3
                    ${selectedStudent?.id === student.id 
                      ? 'bg-emerald-500/20 border-2 border-emerald-500' 
                      : 'bg-slate-800/50 border border-slate-700 hover:border-slate-600'
                    }
                    ${!student.todayPresent ? 'opacity-50' : ''}
                  `}
                >
                  <span className="text-2xl">{student.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{student.name}</span>
                      {student.todayPresent && (
                        <span className="bg-emerald-500 w-2 h-2 rounded-full" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-400">{student.belt}</span>
                      <span className="text-cyan-400">✨ {student.ki} Ki</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Exercices à valider */}
          <div className="flex-1 p-4 overflow-y-auto">
            {selectedStudent ? (
              <>
                {/* Info élève sélectionné */}
                <div className="bg-emerald-500/10 rounded-xl p-4 mb-4 border border-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{selectedStudent.avatar}</span>
                    <div>
                      <h3 className="text-white text-xl font-bold">{selectedStudent.name}</h3>
                      <p className="text-slate-400">{selectedStudent.belt} • {selectedStudent.age} ans</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-cyan-400 text-2xl font-bold">✨ {selectedStudent.ki}</p>
                      <p className="text-slate-400 text-sm">Points de Ki</p>
                    </div>
                  </div>
                </div>

                {/* Filtres par catégorie */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {cat.emoji} {cat.name}
                    </button>
                  ))}
                </div>

                {/* Liste des exercices */}
                <div className="grid grid-cols-2 gap-3">
                  {filteredExercises.map(exercise => {
                    const isValidated = isExerciseValidatedToday(selectedStudent.id, exercise.id);
                    const isValidating = validatingExercise === exercise.id;
                    
                    return (
                      <motion.div
                        key={exercise.id}
                        whileHover={!isValidated ? { scale: 1.02 } : {}}
                        className={`
                          p-4 rounded-xl border-2 transition-all
                          ${isValidated 
                            ? 'bg-emerald-500/20 border-emerald-500/50' 
                            : 'bg-slate-800/50 border-slate-700 hover:border-emerald-500/50'
                          }
                        `}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-3xl">{exercise.emoji}</span>
                          {isValidated && (
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          )}
                        </div>
                        
                        <h4 className="text-white font-bold mb-1">{exercise.name}</h4>
                        <p className="text-slate-400 text-xs mb-3">{exercise.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-cyan-400 font-bold">+{exercise.kiReward} Ki</span>
                          
                          {isValidated ? (
                            <span className="text-emerald-400 text-sm">✅ Validé aujourd'hui</span>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleValidateExercise(selectedStudent.id, exercise.id)}
                              disabled={isValidating || !selectedStudent.todayPresent}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              {isValidating ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: Infinity, duration: 1 }}
                                >
                                  ⏳
                                </motion.div>
                              ) : (
                                <>
                                  <Check className="w-4 h-4 mr-1" />
                                  Valider
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Sélectionnez un élève pour valider ses exercices</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Historique récent (footer) */}
        <div className="border-t border-slate-700 p-3 bg-slate-800/50">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock className="w-4 h-4" />
            <span>Dernières validations :</span>
            <div className="flex gap-2 overflow-x-auto">
              {validationHistory.slice(0, 5).map(v => (
                <span key={v.id} className="bg-slate-700 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                  {v.studentName} - {v.exerciseName}
                </span>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherValidationInterface;
