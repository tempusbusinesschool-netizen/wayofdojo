import React, { useEffect, useState, useCallback } from "react";
import "@/App.css";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster, toast } from "sonner";
import { Target, Award, Circle, Eye, TrendingUp, BookOpen, Swords, BarChart3, CheckCircle2, Clock, Flame, ScrollText, ChevronDown, ChevronUp, Shield, Users, Heart, AlertTriangle } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Mastery level configuration
const MASTERY_LEVELS = {
  not_started: { label: "Non démarré", color: "bg-slate-500", icon: Circle, weight: 0 },
  learning: { label: "En apprentissage", color: "bg-amber-500", icon: BookOpen, weight: 33 },
  practiced: { label: "Pratiqué", color: "bg-blue-500", icon: Target, weight: 66 },
  mastered: { label: "Maîtrisé", color: "bg-emerald-500", icon: Award, weight: 100 }
};

// Statistics Dashboard Component
function StatisticsDashboard({ statistics }) {
  if (!statistics) return null;
  
  return (
    <div className="mb-8 animate-fadeIn">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-700">
                <BookOpen className="w-5 h-5 text-slate-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statistics.total_techniques}</p>
                <p className="text-xs text-slate-400">Techniques totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-800 to-emerald-900 border-emerald-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statistics.mastered_techniques}</p>
                <p className="text-xs text-emerald-300">Maîtrisées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-800 to-amber-900 border-amber-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-700">
                <Clock className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statistics.in_progress_techniques}</p>
                <p className="text-xs text-amber-300">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-rose-800 to-rose-900 border-rose-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-700">
                <Flame className="w-5 h-5 text-rose-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statistics.total_practice_sessions}</p>
                <p className="text-xs text-rose-300">Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Overall Progress Bar */}
      <Card className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-medium text-white">Progression Globale</span>
            </div>
            <span className="text-2xl font-bold text-cyan-400">{statistics.overall_progress}%</span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${statistics.overall_progress}%` }}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Progress by Level */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Progression par Grade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {statistics.techniques_by_level?.map((level, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{level.name}</span>
                <span className="text-slate-400">
                  {level.mastered}/{level.total} • {level.progress_percentage}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700"
                  style={{ 
                    width: `${level.progress_percentage}%`,
                    backgroundColor: level.color || '#6366f1'
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Technique Card Component
function TechniqueCard({ technique, kyuName, kyuColor, onView, onUpdateMastery, onPractice }) {
  const mastery = MASTERY_LEVELS[technique.mastery_level] || MASTERY_LEVELS.not_started;
  const MasteryIcon = mastery.icon;
  
  return (
    <Card className="group bg-slate-800/50 border-slate-700 hover:border-slate-500 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white text-sm leading-tight mb-1 truncate">
              {technique.name}
            </h4>
            <div className="flex items-center gap-2">
              <Badge 
                className={`${mastery.color} text-white text-xs px-2 py-0`}
              >
                <MasteryIcon className="w-3 h-3 mr-1" />
                {mastery.label}
              </Badge>
              {technique.practice_count > 0 && (
                <span className="text-xs text-slate-500">
                  {technique.practice_count} sessions
                </span>
              )}
            </div>
          </div>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onView(technique)}
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Technique Modal Component
function TechniqueModal({ technique, kyuName, kyuColor, isOpen, onClose, onUpdateMastery, onPractice }) {
  if (!technique) return null;
  
  const mastery = MASTERY_LEVELS[technique.mastery_level] || MASTERY_LEVELS.not_started;
  const hasImage = technique.image_url && technique.image_url.length > 0;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge style={{ backgroundColor: kyuColor }} className="text-white text-xs">
              {kyuName}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-white">
            {technique.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Image */}
          {hasImage && (
            <div className="rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
              <img 
                src={technique.image_url} 
                alt={technique.name}
                className="w-full h-auto max-h-64 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          {/* Description */}
          {technique.description && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-300 text-sm leading-relaxed">{technique.description}</p>
            </div>
          )}
          
          {/* Key Points */}
          {technique.key_points && technique.key_points.length > 0 && (
            <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-800/50">
              <h4 className="text-cyan-400 font-semibold text-sm mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Points clés d'exécution
              </h4>
              <ul className="space-y-1.5">
                {technique.key_points.map((point, idx) => (
                  <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Practice Tips */}
          {technique.practice_tips && technique.practice_tips.length > 0 && (
            <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-800/50">
              <h4 className="text-emerald-400 font-semibold text-sm mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Conseils de pratique
              </h4>
              <ul className="space-y-1.5">
                {technique.practice_tips.map((tip, idx) => (
                  <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Mastery Level Selector */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h4 className="text-white font-semibold text-sm mb-3">Niveau de maîtrise</h4>
            <Select 
              value={technique.mastery_level || "not_started"} 
              onValueChange={(value) => onUpdateMastery(technique.id, value)}
            >
              <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {Object.entries(MASTERY_LEVELS).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <SelectItem 
                      key={key} 
                      value={key}
                      className="text-white hover:bg-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {config.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {technique.practice_count || 0} session(s) enregistrée(s)
              </span>
              <Button 
                size="sm" 
                onClick={() => onPractice(technique.id)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <Flame className="w-4 h-4 mr-1" />
                +1 Session
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Grade Section Component
function GradeSection({ kyu, onViewTechnique, onUpdateMastery, onPractice }) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const masteredCount = kyu.techniques.filter(t => t.mastery_level === 'mastered').length;
  const progressPercent = kyu.techniques.length > 0 
    ? Math.round((masteredCount / kyu.techniques.length) * 100) 
    : 0;
  
  // Group techniques by category
  const groupedTechniques = {};
  kyu.techniques.forEach(tech => {
    const match = tech.description?.match(/^(SUWARIWAZA|TACHIWAZA|HANMI HANDACHI|USHIRO WAZA|HANMIHANDACHI)/i);
    const category = match ? match[1].toUpperCase() : 'GÉNÉRAL';
    if (!groupedTechniques[category]) groupedTechniques[category] = [];
    groupedTechniques[category].push(tech);
  });
  
  return (
    <div className="mb-8">
      {/* Grade Header */}
      <div 
        className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 py-4 px-4 -mx-4 mb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-12 rounded-full"
              style={{ backgroundColor: kyu.color }}
            />
            <div>
              <h2 className="text-xl font-bold text-white">{kyu.name}</h2>
              <p className="text-sm text-slate-400">
                {kyu.techniques.length} techniques • {progressPercent}% maîtrisé
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 text-xs">
              <span className="px-2 py-1 rounded bg-emerald-900/50 text-emerald-400">
                {masteredCount} maîtrisées
              </span>
            </div>
            <svg 
              className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-2 w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${progressPercent}%`,
              backgroundColor: kyu.color
            }}
          />
        </div>
      </div>
      
      {/* Techniques Grid */}
      {isExpanded && (
        <div className="space-y-6">
          {Object.entries(groupedTechniques).map(([category, techniques]) => (
            <div key={category}>
              {Object.keys(groupedTechniques).length > 1 && (
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
                  {category}
                </h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {techniques.map((technique) => (
                  <TechniqueCard
                    key={technique.id}
                    technique={technique}
                    kyuName={kyu.name}
                    kyuColor={kyu.color}
                    onView={onViewTechnique}
                    onUpdateMastery={onUpdateMastery}
                    onPractice={onPractice}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main App Component
function App() {
  const [kyuLevels, setKyuLevels] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [selectedKyu, setSelectedKyu] = useState(null);
  const [showStats, setShowStats] = useState(true);
  
  const fetchData = useCallback(async () => {
    try {
      const [kyuResponse, statsResponse] = await Promise.all([
        axios.get(`${API}/kyu-levels`),
        axios.get(`${API}/statistics`)
      ]);
      setKyuLevels(kyuResponse.data);
      setStatistics(statsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleUpdateMastery = async (kyuId, techniqueId, masteryLevel) => {
    try {
      await axios.put(`${API}/kyu-levels/${kyuId}/techniques/${techniqueId}`, {
        mastery_level: masteryLevel
      });
      toast.success("Niveau de maîtrise mis à jour");
      fetchData();
    } catch (error) {
      console.error("Error updating mastery:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };
  
  const handlePractice = async (kyuId, techniqueId) => {
    try {
      await axios.post(`${API}/kyu-levels/${kyuId}/techniques/${techniqueId}/practice`);
      toast.success("Session de pratique enregistrée !");
      fetchData();
    } catch (error) {
      console.error("Error recording practice:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };
  
  const handleViewTechnique = (kyu, technique) => {
    setSelectedKyu(kyu);
    setSelectedTechnique(technique);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Chargement des techniques...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-950">
      <Toaster richColors position="top-right" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                <Swords className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Aikido Tracker</h1>
                <p className="text-xs text-slate-400">Programme officiel</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStats(!showStats)}
                className={`text-slate-400 hover:text-white ${showStats ? 'bg-slate-800' : ''}`}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Stats
              </Button>
              {statistics && (
                <Badge className="bg-cyan-600 text-white">
                  {statistics.overall_progress}%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Statistics Dashboard */}
        {showStats && <StatisticsDashboard statistics={statistics} />}
        
        {/* Grade Sections */}
        <div className="space-y-2">
          {kyuLevels.map((kyu) => (
            <GradeSection
              key={kyu.id}
              kyu={kyu}
              onViewTechnique={(technique) => handleViewTechnique(kyu, technique)}
              onUpdateMastery={(techniqueId, level) => handleUpdateMastery(kyu.id, techniqueId, level)}
              onPractice={(techniqueId) => handlePractice(kyu.id, techniqueId)}
            />
          ))}
        </div>
      </main>
      
      {/* Technique Modal */}
      <TechniqueModal
        technique={selectedTechnique}
        kyuName={selectedKyu?.name}
        kyuColor={selectedKyu?.color}
        isOpen={!!selectedTechnique}
        onClose={() => {
          setSelectedTechnique(null);
          setSelectedKyu(null);
        }}
        onUpdateMastery={(techniqueId, level) => {
          if (selectedKyu) {
            handleUpdateMastery(selectedKyu.id, techniqueId, level);
          }
        }}
        onPractice={(techniqueId) => {
          if (selectedKyu) {
            handlePractice(selectedKyu.id, techniqueId);
          }
        }}
      />
      
      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            Aikido Tracker • {statistics?.total_techniques || 0} techniques • Programme officiel
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
