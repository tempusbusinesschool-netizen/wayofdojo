import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Swords, Users, BarChart3, LogOut, Baby, User, LogIn, Lock, ScrollText, Eye, Award, Building2, Sparkles } from "lucide-react";

// Aikido Belt System - for display
const AIKIDO_BELTS = {
  "6e_kyu": { name: "Blanche", grade: "6e kyu", emoji: "⚪", color: "#E5E7EB" },
  "5e_kyu": { name: "Jaune", grade: "5e kyu", emoji: "🟡", color: "#FCD34D" },
  "4e_kyu": { name: "Orange", grade: "4e kyu", emoji: "🟠", color: "#FB923C" },
  "3e_kyu": { name: "Verte", grade: "3e kyu", emoji: "🟢", color: "#22C55E" },
  "2e_kyu": { name: "Bleue", grade: "2e kyu", emoji: "🔵", color: "#3B82F6" },
  "1er_kyu": { name: "Marron", grade: "1er kyu", emoji: "🟤", color: "#92400E" },
  "shodan": { name: "Noire", grade: "Shodan", emoji: "⚫", color: "#1F2937" }
};

// Import custom components
import {
  AdminLoginDialog,
  AuthDialog,
  DeplacementsSection,
  TechniqueModal,
  GradeSection,
  MembersList,
  MemberRegistrationForm,
  ReglementInterieur,
  StatisticsDashboard,
  CGUDialog,
  MentionsLegalesDialog,
  PolitiqueConfidentialiteDialog
} from "@/components";

// Import Auth Context
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import DojoManagement from "@/components/DojoManagement";
import OnboardingFlow from "@/components/OnboardingFlow";
import PaywallDialog from "@/components/PaywallDialog";
import DojoRegistrationDialog from "@/components/DojoRegistrationDialog";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ═══════════════════════════════════════════════════════════════════════════════════
// MAIN APP CONTENT (with auth)
// ═══════════════════════════════════════════════════════════════════════════════════
function AppContent() {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  
  const [kyuLevels, setKyuLevels] = useState([]);
  const [userProgression, setUserProgression] = useState({});
  const [userBelt, setUserBelt] = useState("6e_kyu"); // Default: white belt
  const [statistics, setStatistics] = useState(null);
  const [membersStats, setMembersStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [selectedKyu, setSelectedKyu] = useState(null);
  const [showStats, setShowStats] = useState(true);
  const [activeTab, setActiveTab] = useState("techniques");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showCGU, setShowCGU] = useState(false);
  const [showMentionsLegales, setShowMentionsLegales] = useState(false);
  const [showPolitiqueConfidentialite, setShowPolitiqueConfidentialite] = useState(false);
  const [showDojoManagement, setShowDojoManagement] = useState(false);
  const [dojos, setDojos] = useState([]);
  const [selectedDojoFilter, setSelectedDojoFilter] = useState("all");
  
  // Onboarding & Paywall state
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('aikido_onboarding_seen');
  });
  const [showPaywall, setShowPaywall] = useState(false);
  const [showDojoRegistration, setShowDojoRegistration] = useState(false);
  
  // Admin state
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('aikido_admin') === 'true';
  });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    localStorage.setItem('aikido_onboarding_seen', 'true');
    setShowOnboarding(false);
    // Show paywall after onboarding if not authenticated
    // Use setTimeout to ensure onboarding dialog closes first
    setTimeout(() => {
      if (!isAuthenticated) {
        setShowPaywall(true);
      }
    }, 300);
  };
  
  // Handle subscription
  const handleSubscribe = (planId) => {
    toast.success(`🎉 Abonnement ${planId} activé !`);
    setShowPaywall(false);
  };
  
  // Fetch dojos list
  useEffect(() => {
    const fetchDojos = async () => {
      try {
        const response = await axios.get(`${API}/dojos`);
        setDojos(response.data.dojos || []);
      } catch (error) {
        console.error("Error fetching dojos:", error);
      }
    };
    fetchDojos();
  }, [showDojoManagement]);
  
  const handleAdminLogin = () => {
    setIsAdmin(true);
  };
  
  const handleAdminLogout = () => {
    sessionStorage.removeItem('aikido_admin');
    setIsAdmin(false);
    setActiveTab("techniques");
    toast.success("Déconnexion admin réussie");
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
      const requests = [
        axios.get(`${API}/kyu-levels`),
        axios.get(`${API}/statistics`),
        axios.get(`${API}/members-stats`),
        axios.get(`${API}/members`),
        axios.get(`${API}/visitors`)
      ];
      
      // If authenticated, also fetch user progression and belt
      if (isAuthenticated) {
        requests.push(axios.get(`${API}/auth/progression`));
        requests.push(axios.get(`${API}/auth/belt`));
      }
      
      const responses = await Promise.all(requests);
      
      let kyuData = responses[0].data;
      const statsData = responses[1].data;
      const membersStatsData = responses[2].data;
      const membersData = responses[3].data;
      const visitorsData = responses[4].data;
      
      // If user is authenticated, merge their progression and belt
      if (isAuthenticated && responses[5]) {
        const progression = responses[5].data;
        setUserProgression(progression);
        
        // Get user belt
        if (responses[6]) {
          const beltData = responses[6].data;
          setUserBelt(beltData.belt_level || "6e_kyu");
        }
        
        // Merge user progression into kyu levels
        kyuData = kyuData.map(kyu => ({
          ...kyu,
          techniques: kyu.techniques.map(tech => {
            const userProgress = progression[tech.id];
            if (userProgress) {
              return {
                ...tech,
                mastery_level: userProgress.mastery_level || tech.mastery_level,
                practice_count: userProgress.practice_count || tech.practice_count,
                last_practiced: userProgress.last_practiced || tech.last_practiced
              };
            }
            return tech;
          })
        }));
      }
      
      setKyuLevels(kyuData);
      setStatistics(statsData);
      setMembersStats(membersStatsData);
      setMembers(membersData);
      setVisitors(visitorsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Don't show error toast for progression endpoint if user just registered
      if (error.response?.status !== 401) {
        toast.error("Erreur lors du chargement des données");
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);
  
  useEffect(() => {
    if (!authLoading) {
      // Small delay to ensure axios headers are set after authentication
      const timer = setTimeout(() => {
        fetchData();
      }, isAuthenticated ? 100 : 0);
      return () => clearTimeout(timer);
    }
  }, [fetchData, authLoading, isAuthenticated]);
  
  const handleUpdateMastery = async (kyuId, techniqueId, masteryLevel) => {
    try {
      if (isAuthenticated) {
        // Save to user's personal progression
        await axios.put(`${API}/auth/progression/${techniqueId}`, {
          technique_id: techniqueId,
          mastery_level: masteryLevel
        });
        toast.success("Progression sauvegardée !");
      } else {
        // Old behavior - update global
        await axios.put(`${API}/kyu-levels/${kyuId}/techniques/${techniqueId}`, {
          mastery_level: masteryLevel
        });
        toast.success("Niveau de maîtrise mis à jour");
      }
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };
  
  const handlePractice = async (kyuId, techniqueId) => {
    try {
      if (isAuthenticated) {
        // Save to user's personal progression
        await axios.post(`${API}/auth/progression/${techniqueId}/practice`);
        toast.success("Session enregistrée !");
      } else {
        // Old behavior - update global
        await axios.post(`${API}/kyu-levels/${kyuId}/techniques/${techniqueId}/practice`);
        toast.success("Session de pratique enregistrée !");
      }
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

  // Calculate user-specific statistics
  const getUserStatistics = () => {
    if (!isAuthenticated || !kyuLevels.length) return statistics;
    
    let totalTechniques = 0;
    let masteredTechniques = 0;
    let inProgressTechniques = 0;
    let totalPracticeSessions = 0;
    
    kyuLevels.forEach(kyu => {
      kyu.techniques.forEach(tech => {
        totalTechniques++;
        if (tech.mastery_level === 'mastered') masteredTechniques++;
        if (tech.mastery_level === 'learning' || tech.mastery_level === 'practiced') inProgressTechniques++;
        totalPracticeSessions += tech.practice_count || 0;
      });
    });
    
    const overallProgress = totalTechniques > 0 
      ? Math.round((masteredTechniques / totalTechniques) * 100) 
      : 0;
    
    return {
      ...statistics,
      total_techniques: totalTechniques,
      mastered_techniques: masteredTechniques,
      in_progress_techniques: inProgressTechniques,
      total_practice_sessions: totalPracticeSessions,
      overall_progress: overallProgress,
      techniques_by_level: kyuLevels.map(kyu => {
        const mastered = kyu.techniques.filter(t => t.mastery_level === 'mastered').length;
        return {
          name: kyu.name,
          color: kyu.color,
          total: kyu.techniques.length,
          mastered: mastered,
          progress_percentage: kyu.techniques.length > 0 
            ? Math.round((mastered / kyu.techniques.length) * 100) 
            : 0
        };
      })
    };
  };

  // Function to assign belt to a visitor (admin only)
  const handleAssignBelt = async (userId, beltLevel) => {
    try {
      await axios.post(`${API}/admin/assign-belt`, {
        user_id: userId,
        belt_level: beltLevel
      });
      toast.success(`Ceinture ${AIKIDO_BELTS[beltLevel]?.name || beltLevel} attribuée avec succès !`);
      // Refresh visitors list
      fetchData();
    } catch (error) {
      console.error("Error assigning belt:", error);
      toast.error("Erreur lors de l'attribution de la ceinture");
    }
  };

  // Function for user to change their own belt (self-declaration)
  const handleUserBeltChange = async (newBeltLevel) => {
    if (!isAuthenticated) {
      toast.error("Connecte-toi pour enregistrer ta ceinture !");
      return;
    }
    
    try {
      const response = await axios.put(`${API}/auth/belt`, {
        belt_level: newBeltLevel
      });
      
      setUserBelt(newBeltLevel);
      toast.success(`${AIKIDO_BELTS[newBeltLevel]?.emoji} ${response.data.message}`);
    } catch (error) {
      console.error("Error updating belt:", error);
      toast.error("Erreur lors de la mise à jour de ta ceinture");
    }
  };
  
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Chargement...</p>
        </div>
      </div>
    );
  }

  const displayStatistics = isAuthenticated ? getUserStatistics() : statistics;
  
  return (
    <div className="min-h-screen bg-slate-950">
      <Toaster richColors position="top-right" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16">
                  {/* Yin-Yang style logo in yellow/gold */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/30"></div>
                  <div className="absolute inset-1 rounded-full bg-slate-900 flex items-center justify-center">
                    <div className="relative w-10 h-10">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-b from-amber-400 to-yellow-500"></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-slate-900 border-2 border-amber-500"></div>
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-amber-400 font-medium">Aikido</p>
                  <p className="text-lg md:text-xl text-white font-bold">Techniques d'Aikido</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* User Auth Button */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-600 text-white hidden sm:flex">
                    <User className="w-3 h-3 mr-1" />
                    {user?.first_name}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-slate-400 hover:text-white hover:bg-slate-700"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAuthDialog(true)}
                    className="border-amber-600 text-amber-400 hover:bg-amber-900/30"
                  >
                    🥷 S&apos;inscrire
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDojoRegistration(true)}
                    className="border-cyan-600 text-cyan-400 hover:bg-cyan-900/30 hidden sm:flex"
                  >
                    🏯 Espace Dojo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPaywall(true)}
                    className="text-slate-400 hover:text-amber-400"
                  >
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              {!isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdminLogin(true)}
                  className="text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <Lock className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              )}

              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAdminLogout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStats(!showStats)}
                className={`text-slate-400 hover:text-white ${showStats ? 'bg-slate-800' : ''}`}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Stats</span>
              </Button>
              {displayStatistics && (
                <Badge className="bg-cyan-600 text-white">
                  {displayStatistics.overall_progress}%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* User welcome banner */}
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-emerald-900/50 to-cyan-900/50 border-b border-emerald-700/50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <p className="text-sm text-emerald-300 text-center">
              👋 Bienvenue <strong>{user?.first_name} {user?.last_name}</strong> ! Votre progression est automatiquement sauvegardée.
            </p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs for Techniques and Members */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          {isAdmin && (
            <TabsList className="bg-slate-800 border-slate-700 flex flex-wrap gap-1">
              <TabsTrigger value="techniques" className="data-[state=active]:bg-slate-700 text-xs sm:text-sm">
                <Swords className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Techniques</span>
              </TabsTrigger>
              <TabsTrigger value="members" className="data-[state=active]:bg-slate-700 text-xs sm:text-sm">
                <Users className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Adhérents</span> ({members.length})
              </TabsTrigger>
              <TabsTrigger value="visitors" className="data-[state=active]:bg-slate-700 text-xs sm:text-sm">
                <Eye className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Visiteurs</span> ({visitors.length})
              </TabsTrigger>
              <TabsTrigger value="reglement" className="data-[state=active]:bg-slate-700 text-xs sm:text-sm">
                <ScrollText className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Règlement Intérieur</span>
              </TabsTrigger>
            </TabsList>
          )}
          
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
                statistics={displayStatistics} 
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
                userEmail={user?.email}
                userBelt={isAuthenticated ? userBelt : null}
                onBeltChange={handleUserBeltChange}
                isAuthenticated={isAuthenticated}
                onRefreshData={fetchData}
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
              <div className="mb-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("techniques")}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  ← Retour aux techniques
                </Button>
              </div>
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

          {isAdmin && (
            <TabsContent value="visitors" className="mt-6">
              <div className="mb-4 flex flex-col sm:flex-row gap-3 justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("techniques")}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  ← Retour aux techniques
                </Button>
                <div className="flex gap-2">
                  {/* Dojo Filter */}
                  <Select 
                    value={selectedDojoFilter} 
                    onValueChange={setSelectedDojoFilter}
                  >
                    <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
                      <Building2 className="w-4 h-4 mr-2 text-blue-400" />
                      <SelectValue placeholder="Filtrer par dojo" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all" className="text-white hover:bg-slate-700">
                        Tous les dojos
                      </SelectItem>
                      {dojos.map((dojo) => (
                        <SelectItem key={dojo.id} value={dojo.id} className="text-white hover:bg-slate-700">
                          {dojo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Manage Dojos Button */}
                  <Button
                    onClick={() => setShowDojoManagement(true)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Gérer les dojos
                  </Button>
                </div>
              </div>
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-400" />
                    Visiteurs inscrits
                    {selectedDojoFilter !== "all" && (
                      <span className="text-sm font-normal text-blue-400">
                        ({dojos.find(d => d.id === selectedDojoFilter)?.name})
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Utilisateurs qui suivent leur progression sur la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {visitors.filter(v => selectedDojoFilter === "all" || v.dojo_id === selectedDojoFilter).length === 0 ? (
                    <p className="text-slate-400 text-center py-8">Aucun visiteur inscrit {selectedDojoFilter !== "all" ? "dans ce dojo" : "pour le moment"}</p>
                  ) : (
                    <div className="space-y-3">
                      {visitors.filter(v => selectedDojoFilter === "all" || v.dojo_id === selectedDojoFilter).map((visitor) => {
                        const visitorBelt = visitor.belt_level || "6e_kyu";
                        const beltInfo = visitor.belt_info || AIKIDO_BELTS[visitorBelt] || AIKIDO_BELTS["6e_kyu"];
                        
                        return (
                          <div 
                            key={visitor.id} 
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 gap-4"
                          >
                            <div className="flex items-center gap-3">
                              {/* Belt indicator */}
                              <div 
                                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2"
                                style={{ 
                                  backgroundColor: beltInfo.color + '20',
                                  borderColor: beltInfo.color
                                }}
                              >
                                {beltInfo.emoji}
                              </div>
                              <div>
                                <p className="font-medium text-white">
                                  {visitor.first_name} {visitor.last_name}
                                </p>
                                <p className="text-sm text-slate-400">{visitor.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-xs text-slate-500">
                                    Inscrit le {new Date(visitor.created_at).toLocaleDateString('fr-FR')}
                                  </p>
                                  {visitor.dojo_name && (
                                    <span className="text-xs bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <Building2 className="w-3 h-3" />
                                      {visitor.dojo_name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4">
                              {/* Stats */}
                              <div className="flex items-center gap-4 text-sm">
                                <div className="text-center">
                                  <p className="text-emerald-400 font-bold">{visitor.techniques_mastered || 0}</p>
                                  <p className="text-slate-500 text-xs">🏆 Maîtrisées</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-amber-400 font-bold">{visitor.techniques_in_progress || 0}</p>
                                  <p className="text-slate-500 text-xs">📖 En cours</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-cyan-400 font-bold">{visitor.total_sessions || 0}</p>
                                  <p className="text-slate-500 text-xs">🔥 Sessions</p>
                                </div>
                              </div>
                              
                              {/* Belt selector for admin */}
                              <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-amber-400" />
                                <Select 
                                  key={`belt-select-${visitor.id}-${visitorBelt}`}
                                  value={visitorBelt}
                                  onValueChange={(value) => handleAssignBelt(visitor.id, value)}
                                >
                                  <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white text-sm">
                                    <SelectValue placeholder="Sélectionner" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-800 border-slate-700">
                                    {Object.entries(AIKIDO_BELTS).map(([key, belt]) => (
                                      <SelectItem 
                                        key={key} 
                                        value={key} 
                                        className="text-white hover:bg-slate-700 cursor-pointer"
                                      >
                                        <span className="flex items-center gap-2">
                                          <span>{belt.emoji}</span>
                                          <span>{belt.name} ({belt.grade})</span>
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="reglement" className="mt-6">
              <ReglementInterieur 
                onRegister={fetchData} 
                isAdmin={isAdmin}
                onAdminClick={() => {}}
              />
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

      {/* Auth Dialog */}
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
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

      {/* CGU Dialog */}
      <CGUDialog
        isOpen={showCGU}
        onClose={() => setShowCGU(false)}
      />

      {/* Mentions Légales Dialog */}
      <MentionsLegalesDialog
        isOpen={showMentionsLegales}
        onClose={() => setShowMentionsLegales(false)}
      />

      {/* Politique de Confidentialité Dialog */}
      <PolitiqueConfidentialiteDialog
        isOpen={showPolitiqueConfidentialite}
        onClose={() => setShowPolitiqueConfidentialite(false)}
      />

      {/* Dojo Management Dialog */}
      <DojoManagement
        isOpen={showDojoManagement}
        onClose={() => setShowDojoManagement(false)}
      />

      {/* Onboarding Flow */}
      <OnboardingFlow
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />

      {/* Paywall Dialog */}
      <PaywallDialog
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSubscribe={handleSubscribe}
        userEmail={user?.email}
      />

      {/* Dojo Registration Dialog */}
      <DojoRegistrationDialog
        isOpen={showDojoRegistration}
        onClose={() => setShowDojoRegistration(false)}
        onSuccess={() => {
          setShowDojoRegistration(false);
          toast.success("🏯 Dojo créé ! Connectez-vous pour continuer.");
        }}
      />
      
      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            Gamification &amp; apprentissage des techniques d&apos;Aikido affilié à un Dojo
          </p>
          <p className="text-slate-600 text-xs mt-3">
            © humanknowledge.fr - 2025
          </p>
          <div className="flex justify-center gap-3 mt-3 flex-wrap">
            <a 
              href="https://customer-assets.emergentagent.com/job_budo-journey/artifacts/ye93af5u_CGU_HUMAN_KNOWLEDGE-V2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-500 hover:text-cyan-400 text-xs underline"
            >
              CGU
            </a>
            <span className="text-slate-600 text-xs">•</span>
            <a 
              href="https://customer-assets.emergentagent.com/job_budo-journey/artifacts/60zyegcd_CGV_FINALES_HUMAN_KNOWLEDGE-V2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-500 hover:text-cyan-400 text-xs underline"
            >
              CGV
            </a>
            <span className="text-slate-600 text-xs">•</span>
            <a 
              href="https://customer-assets.emergentagent.com/job_budo-journey/artifacts/jqas0i5r_CHARTE_UTILISATION_HUMAN_KNOWLEDGE-V2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-500 hover:text-cyan-400 text-xs underline"
            >
              Charte d&apos;utilisation
            </a>
            <span className="text-slate-600 text-xs">•</span>
            <a 
              href="https://customer-assets.emergentagent.com/job_budo-journey/artifacts/r5qdgcym_MENTIONS_LEGALES_HUMAN_KNOWLEDGE-V2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-500 hover:text-cyan-400 text-xs underline"
            >
              Mentions légales
            </a>
            <span className="text-slate-600 text-xs">•</span>
            <a 
              href="https://customer-assets.emergentagent.com/job_budo-journey/artifacts/r92am4eo_POLITIQUE_RGPD_HUMAN_KNOWLEDGE-V2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-500 hover:text-cyan-400 text-xs underline"
            >
              Politique RGPD
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// APP WRAPPER WITH AUTH PROVIDER
// ═══════════════════════════════════════════════════════════════════════════════════
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
