import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';
import GradeSection from '@/components/GradeSection';
import TechniqueModal from '@/components/TechniqueModal';

/**
 * ProgrammePage - Programme technique par grade (version adulte)
 * Utilise GradeSection et TechniqueCard pour l'affichage des techniques
 * avec la possibilité de voir les détails et marquer comme maîtrisée
 */
const ProgrammePage = ({ onBack, isAuthenticated, onOpenAuth }) => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [showTechniqueModal, setShowTechniqueModal] = useState(false);

  // Récupérer les données depuis l'API
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/kyu-levels`);
        if (response.ok) {
          const data = await response.json();
          // Trier par order décroissant (5e KYU en premier)
          const sortedGrades = data.sort((a, b) => b.order - a.order);
          setGrades(sortedGrades);
        }
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  const handleViewTechnique = (technique) => {
    setSelectedTechnique(technique);
    setShowTechniqueModal(true);
  };

  const handleUpdateMastery = async (techniqueId, newLevel) => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    // TODO: Implémenter la mise à jour de la maîtrise
    console.log('Update mastery:', techniqueId, newLevel);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Précédent
        </Button>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700">
        <div className="absolute top-4 right-4 text-8xl text-slate-700/30 font-serif">技</div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl">
              🥋
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Programme Technique</h1>
              <p className="text-slate-400">
                {grades.reduce((sum, g) => sum + (g.techniques?.length || 0), 0)} techniques • {grades.length} niveaux
              </p>
            </div>
          </div>

          <p className="text-lg text-slate-300 max-w-2xl">
            Le programme technique d'Aikido est structuré en grades (kyu), du 5ème kyu (débutant) 
            jusqu'au 1er kyu, puis les grades Dan (ceinture noire).
          </p>
        </div>
      </div>

      {/* Message pour les visiteurs */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-700/50 rounded-xl p-4 flex items-center gap-3">
          <Lock className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <p className="text-slate-300 text-sm">
            <button onClick={onOpenAuth} className="text-cyan-400 hover:text-cyan-300 font-medium underline">
              Connectez-vous
            </button> pour suivre votre progression et marquer les techniques comme maîtrisées.
          </p>
        </div>
      )}

      {/* Grades avec GradeSection */}
      <div className="space-y-4">
        {grades.map((grade) => (
          <GradeSection
            key={grade.id}
            kyu={grade}
            onViewTechnique={handleViewTechnique}
            onUpdateMastery={handleUpdateMastery}
            isFiltered={false}
            originalCount={grade.techniques?.length || 0}
          />
        ))}
      </div>

      {/* Modal technique */}
      {showTechniqueModal && selectedTechnique && (
        <TechniqueModal
          technique={selectedTechnique}
          isOpen={showTechniqueModal}
          onClose={() => {
            setShowTechniqueModal(false);
            setSelectedTechnique(null);
          }}
          onUpdateMastery={handleUpdateMastery}
          isAuthenticated={isAuthenticated}
          onOpenAuth={onOpenAuth}
        />
      )}
    </div>
  );
};

export default ProgrammePage;
