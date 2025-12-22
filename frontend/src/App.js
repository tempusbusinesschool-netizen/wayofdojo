import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Swords, Users, BarChart3, LogOut, Baby, User } from "lucide-react";

// Import custom components
import {
  AdminLoginDialog,
  DeplacementsSection,
  TechniqueModal,
  GradeSection,
  MembersList,
  MemberRegistrationForm,
  ReglementInterieur,
  StatisticsDashboard
} from "@/components";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ═══════════════════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════
function App() {
  const [kyuLevels, setKyuLevels] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [membersStats, setMembersStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [selectedKyu, setSelectedKyu] = useState(null);
  const [showStats, setShowStats] = useState(true);
  const [activeTab, setActiveTab] = useState("techniques");
  
  // Admin state
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('aikido_admin') === 'true';
  });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  const handleAdminLogin = () => {
    setIsAdmin(true);
  };
  
  const handleAdminLogout = () => {
    sessionStorage.removeItem('aikido_admin');
    setIsAdmin(false);
    setActiveTab("techniques");
    toast.success("Déconnexion réussie");
  };
  
  // Refs for grade sections to enable scrolling
  const gradeSectionRefs = useRef({});
  
  const handleGradeClick = (gradeName) => {
    const targetKyu = kyuLevels.find(kyu => kyu.name === gradeName);
    if (targetKyu && gradeSectionRefs.current[targetKyu.id]) {
      gradeSectionRefs.current[targetKyu.id].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };
  
  const fetchData = useCallback(async () => {
    try {
      const [kyuResponse, statsResponse, membersStatsResponse, membersResponse] = await Promise.all([
        axios.get(`${API}/kyu-levels`),
        axios.get(`${API}/statistics`),
        axios.get(`${API}/members-stats`),
        axios.get(`${API}/members`)
      ]);
      setKyuLevels(kyuResponse.data);
      setStatistics(statsResponse.data);
      setMembersStats(membersStatsResponse.data);
      setMembers(membersResponse.data);
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
      toast.error("Erreur lors de la mise à jour");
    }
  };
  
  const handlePractice = async (kyuId, techniqueId) => {
    try {
      await axios.post(`${API}/kyu-levels/${kyuId}/techniques/${techniqueId}/practice`);
      toast.success("Session de pratique enregistrée !");
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };
  
  const handleViewTechnique = (kyu, technique) => {
    setSelectedKyu(kyu);
    setSelectedTechnique(technique);
  };
  
  // Registration dialogs state
  const [showChildRegistration, setShowChildRegistration] = useState(false);
  const [showAdultRegistration, setShowAdultRegistration] = useState(false);
  
  // Filter state for technique filtering
  const [techniqueFilter, setTechniqueFilter] = useState('all');
  
  const handleFilterClick = (filter) => {
    setTechniqueFilter(techniqueFilter === filter ? 'all' : filter);
    if (filter !== 'all') {
      toast.info(getFilterMessage(filter));
    }
  };
  
  const getFilterMessage = (filter) => {
    const messages = {
      mastered: `${statistics?.mastered_techniques || 0} technique(s) maîtrisée(s)`,
      in_progress: `${statistics?.in_progress_techniques || 0} technique(s) en cours`,
      practiced: `Techniques avec sessions de pratique`
    };
    return messages[filter] || '';
  };
  
  // Filter techniques based on current filter
  const filterTechniques = (techniques) => {
    if (techniqueFilter === 'all') return techniques;
    if (techniqueFilter === 'mastered') {
      return techniques.filter(t => t.mastery_level === 'mastered');
    }
    if (techniqueFilter === 'in_progress') {
      return techniques.filter(t => t.mastery_level === 'learning' || t.mastery_level === 'practiced');
    }
    if (techniqueFilter === 'practiced') {
      return techniques.filter(t => t.practice_count > 0);
    }
    return techniques;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Chargement...</p>
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
              <img 
                src="/images/logo-aikido.png" 
                alt="Logo Aikido La Rivière" 
                className="h-14 w-auto object-contain"
              />
              <p className="text-xs text-slate-400">68, rue du Docteur Schweitzer 97421 SAINT-LOUIS - RÉUNION</p>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAdminLogout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Déconnexion
                </Button>
              )}
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
        {/* Règlement Intérieur - EN HAUT */}
        <ReglementInterieur 
          onRegister={fetchData} 
          isAdmin={isAdmin}
          onAdminClick={() => setShowAdminLogin(true)}
        />
        
        {/* Tabs for Techniques and Members */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-slate-800 border-slate-700 h-auto">
            <TabsTrigger value="techniques" className="data-[state=active]:bg-slate-700 text-base py-3 px-4">
              <Swords className="w-5 h-5 mr-2" />
              Les différentes techniques en Aïkido
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="members" className="data-[state=active]:bg-slate-700">
                <Users className="w-4 h-4 mr-2" />
                Adhérents ({members.length})
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="techniques" className="mt-6">
            {/* Filter indicator */}
            {techniqueFilter !== 'all' && (
              <div className="mb-4 flex items-center justify-between bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <span className="text-sm text-slate-300">
                  Filtre actif : <span className="font-semibold text-cyan-400">
                    {techniqueFilter === 'mastered' && 'Techniques maîtrisées'}
                    {techniqueFilter === 'in_progress' && 'Techniques en cours'}
                    {techniqueFilter === 'practiced' && 'Techniques pratiquées'}
                  </span>
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setTechniqueFilter('all')}
                  className="text-slate-400 hover:text-white"
                >
                  Effacer le filtre
                </Button>
              </div>
            )}
            
            {/* Statistics Dashboard */}
            {showStats && (
              <StatisticsDashboard 
                statistics={statistics} 
                membersStats={membersStats}
                onGradeClick={handleGradeClick}
                onFilterClick={handleFilterClick}
                activeFilter={techniqueFilter}
                isAdmin={isAdmin}
                onMembersClick={(tab) => {
                  setActiveTab("members");
                  setTimeout(() => {
                    const event = new CustomEvent('setMembersTab', { detail: tab });
                    window.dispatchEvent(event);
                  }, 100);
                }}
                kyuLevels={kyuLevels}
              />
            )}
            
            {/* Section Déplacements - sous Progression par Grade */}
            <DeplacementsSection />
            
            {/* Grade Sections */}
            <div className="space-y-2">
              {kyuLevels.map((kyu) => {
                const filteredTechniques = filterTechniques(kyu.techniques);
                if (techniqueFilter !== 'all' && filteredTechniques.length === 0) {
                  return null;
                }
                return (
                  <div key={kyu.id} ref={el => gradeSectionRefs.current[kyu.id] = el}>
                    <GradeSection
                      kyu={{...kyu, techniques: filteredTechniques}}
                      onViewTechnique={(technique) => handleViewTechnique(kyu, technique)}
                      onUpdateMastery={(techniqueId, level) => handleUpdateMastery(kyu.id, techniqueId, level)}
                      onPractice={(techniqueId) => handlePractice(kyu.id, techniqueId)}
                      isFiltered={techniqueFilter !== 'all'}
                      originalCount={kyu.techniques.length}
                    />
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="members" className="mt-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    Liste des adhérents
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {membersStats?.active || 0} actifs • {membersStats?.pending || 0} en attente de validation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MembersList 
                    members={members} 
                    onRefresh={fetchData}
                    onRegisterChild={() => setShowChildRegistration(true)}
                    onRegisterAdult={() => setShowAdultRegistration(true)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>
      
      {/* Technique Modal */}
      <TechniqueModal
        technique={selectedTechnique}
        kyuName={selectedKyu?.name}
        kyuColor={selectedKyu?.color}
        isOpen={!!selectedTechnique}
        onClose={() => { setSelectedTechnique(null); setSelectedKyu(null); }}
        onUpdateMastery={(techniqueId, level) => {
          if (selectedKyu) handleUpdateMastery(selectedKyu.id, techniqueId, level);
        }}
        onPractice={(techniqueId) => {
          if (selectedKyu) handlePractice(selectedKyu.id, techniqueId);
        }}
      />
      
      {/* Admin Login Dialog */}
      <AdminLoginDialog
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={handleAdminLogin}
      />
      
      {/* Child Registration Dialog */}
      <Dialog open={showChildRegistration} onOpenChange={setShowChildRegistration}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Baby className="w-6 h-6 text-purple-400" />
              Inscription Enfant
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Formulaire d&apos;inscription pour un ou plusieurs enfants
            </DialogDescription>
          </DialogHeader>
          <MemberRegistrationForm
            registrationType="child"
            onSuccess={() => {
              setShowChildRegistration(false);
              fetchData();
            }}
            onCancel={() => setShowChildRegistration(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Adult Registration Dialog */}
      <Dialog open={showAdultRegistration} onOpenChange={setShowAdultRegistration}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <User className="w-6 h-6 text-cyan-400" />
              Inscription Adulte
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Formulaire d&apos;inscription pour un adulte pratiquant
            </DialogDescription>
          </DialogHeader>
          <MemberRegistrationForm
            registrationType="adult"
            onSuccess={() => {
              setShowAdultRegistration(false);
              fetchData();
            }}
            onCancel={() => setShowAdultRegistration(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            Aikido La Rivière • Club affilié FFAAA • {statistics?.total_techniques || 0} techniques
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Instructeurs : Céline ROSETTE (3e Dan) • Yeza LUCAS (2e Dan)
          </p>
          <p className="text-slate-600 text-xs mt-3">
            © humanknowledge.fr - 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
