import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Swords, Users, BarChart3, LogOut, Baby, User, LogIn, Lock, ScrollText, Eye, Award, Building2, Sparkles, BookOpen, LayoutDashboard, Settings, AlertTriangle, CreditCard, Shield, KeyRound, Heart } from "lucide-react";

// Import belt utilities for normalization
import { normalizeBeltKey } from "@/constants/aikidoBelts";

// Import session timeout hook and warning component
import useSessionTimeout from "@/hooks/useSessionTimeout";
import SessionTimeoutWarning from "@/components/SessionTimeoutWarning";

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
  ReglementInterieur,
  StatisticsDashboard,
  CGUDialog,
  MentionsLegalesDialog,
  HakamaSection,
  DojoMembersList,
  EnseignantLoginDialog,
  EnseignantDashboard
} from "@/components";
import HeaderNavigation from "@/components/HeaderNavigation";
import LoginTransition from "@/components/LoginTransition";
import ParentLoginDialog from "@/components/ParentLoginDialog";
import ParentDashboard from "@/components/ParentDashboard";
import MaitreTanaka from "@/components/MaitreTanaka";
import TanakaAnimatedLogo from "@/components/TanakaAnimatedLogo";

// Import pages enfant
import {
  CommencePage,
  ApprendsPage,
  EntrainePage,
  ValidePage,
  ProgressePage,
  MaitrisePage
} from "@/pages/enfant";

// Import pages adulte
import {
  InscriptionPage,
  ProgrammePage,
  ProgressionPage,
  VertusPage,
  ObjectifsPage,
  CertificationsPage
} from "@/pages/adulte";

// Import Auth Context
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TanakaEventProvider, useTanakaEvent } from "@/contexts/TanakaEventContext";
import DojoManagement from "@/components/DojoManagement";
import OnboardingFlow from "@/components/OnboardingFlow";
import PaywallDialog from "@/components/PaywallDialog";
import DojoRegistrationDialog from "@/components/DojoRegistrationDialog";
import LoginDialog from "@/components/LoginDialog";
import { CGUPage, CGVPage, ChartePage, MentionsLegalesPage, RGPDPage } from "@/components/legal";
import ModeEmploiPage from "@/pages/ModeEmploiPage";
import TarificationPage from "@/pages/TarificationPage";
import PhilosophiePage from "@/pages/PhilosophiePage";
import CombinaisonsPage from "@/pages/CombinaisonsPage";
import IllustrationsGallery from "@/pages/IllustrationsGallery";
import AdminDashboard, { ADMIN_SECTIONS, AdminTechniquesContent, AdminFilesContent, AdminGalleryContent, AdminVideosContent } from "@/components/AdminDashboard";
import TechniquesSectionViewer from "@/components/admin/TechniquesSectionViewer";
import PassagesGradesViewer from "@/components/admin/PassagesGradesViewer";
import UserCredentialsManager from "@/components/admin/UserCredentialsManager";
import DojoManagementPanel from "@/components/admin/DojoManagementPanel";
import StagesCalendar from "@/pages/StagesCalendar";
import {
  TECHNIQUES_JO,
  TECHNIQUES_BOKKEN,
  TECHNIQUES_TANTO,
  TAI_SABAKI,
  UKEMI,
  KAMAE,
  ATEMI,
  KOKYU_WAZA,
  KANSETSU_WAZA,
  SUWARIWAZA,
  HANMI_HANDACHI
} from "@/constants/aikidoTechniquesData";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ═══════════════════════════════════════════════════════════════════════════════════
// MAIN APP CONTENT (with auth)
// ═══════════════════════════════════════════════════════════════════════════════════
function AppContent() {
  const { user, isAuthenticated, logout, loading: authLoading, token } = useAuth();
  
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
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showCGU, setShowCGU] = useState(false);
  const [showCGV, setShowCGV] = useState(false);
  const [showCharte, setShowCharte] = useState(false);
  const [showMentionsLegales, setShowMentionsLegales] = useState(false);
  const [showRGPD, setShowRGPD] = useState(false);
  const [showDojoManagement, setShowDojoManagement] = useState(false);
  const [dojos, setDojos] = useState([]);
  const [selectedDojoFilter, setSelectedDojoFilter] = useState("all");
  
  // Onboarding & Paywall state - Onboarding désactivé
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showDojoRegistration, setShowDojoRegistration] = useState(false);
  
  // État pour la navigation vers les pages de jeu (enfant)
  const [activePage, setActivePage] = useState(null); // null = accueil, 'commence', 'apprends', etc.
  
  // État pour suivre le mode ninja (jeune/confirmé)
  const [ninjaMode, setNinjaMode] = useState(() => localStorage.getItem('ninja-aikido-mode'));
  
  // Admin state - supports two types: 'admin' (plateforme) and 'espace_dojo' (club)
  // Using localStorage for persistent sessions across page reloads
  const [adminType, setAdminType] = useState(() => {
    const stored = localStorage.getItem('aikido_admin');
    return stored && stored !== 'false' ? stored : null;
  });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminLoginMode, setAdminLoginMode] = useState('choice'); // 'choice', 'admin', 'dojo'
  const [adminSection, setAdminSection] = useState('dashboard'); // Section active dans l'admin
  
  // Computed admin flags
  const isAdminMode = adminType !== null;
  const isAdmin = adminType === 'admin'; // Plateforme - gestion dojos, conformité
  const isEspaceDojo = adminType === 'espace_dojo'; // Club - gestion adhérents
  
  // Legacy compatibility
  const isSuperAdmin = isAdmin;
  const isAdminDojo = isEspaceDojo;
  
  // Enseignant state
  const [showEnseignantLogin, setShowEnseignantLogin] = useState(false);
  const [enseignantMode, setEnseignantMode] = useState(false);
  const [enseignantInfo, setEnseignantInfo] = useState(null);
  const [enseignantToken, setEnseignantToken] = useState(null);
  
  // Mode d'emploi state
  const [showModeEmploi, setShowModeEmploi] = useState(false);
  
  // Tarification state
  const [showTarification, setShowTarification] = useState(false);
  
  // Login transition state
  const [showLoginTransition, setShowLoginTransition] = useState(false);
  const [loginDestination, setLoginDestination] = useState('dashboard');
  const [transitionUserName, setTransitionUserName] = useState('');
  
  // Parent mode state
  const [showParentLogin, setShowParentLogin] = useState(false);
  const [parentMode, setParentMode] = useState(false);
  const [parentInfo, setParentInfo] = useState(null);
  
  // Check if enseignant is already logged in
  useEffect(() => {
    const storedToken = localStorage.getItem('enseignant_token');
    const storedInfo = localStorage.getItem('enseignant_info');
    if (storedToken && storedInfo) {
      setEnseignantToken(storedToken);
      setEnseignantInfo(JSON.parse(storedInfo));
      setEnseignantMode(true);
    }
    
    // Check if parent is already logged in
    const parentToken = localStorage.getItem('parent_token');
    const parentInfoStored = localStorage.getItem('parent_info');
    if (parentToken && parentInfoStored) {
      setParentInfo(JSON.parse(parentInfoStored));
      setParentMode(true);
    }
    
    // Handle URL hash navigation (e.g., #combinaisons)
    const handleHashNavigation = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const validPages = ['combinaisons', 'philosophie', 'tarification', 'mode-emploi', 'inscription', 'illustrations'];
        if (validPages.includes(hash)) {
          setActivePage(hash);
        }
      }
    };
    handleHashNavigation();
    window.addEventListener('hashchange', handleHashNavigation);
    return () => window.removeEventListener('hashchange', handleHashNavigation);
  }, []);
  
  // Handle enseignant login success
  const handleEnseignantLoginSuccess = (info, token) => {
    setEnseignantInfo(info);
    setEnseignantToken(token);
    setEnseignantMode(true);
  };
  
  // Handle parent login success
  const handleParentLoginSuccess = (data) => {
    setParentInfo(data.parent);
    setParentMode(true);
    toast.success(`Bienvenue ${data.parent.first_name} !`);
  };
  
  // Handle parent logout
  const handleParentLogout = () => {
    localStorage.removeItem('parent_token');
    localStorage.removeItem('parent_info');
    setParentInfo(null);
    setParentMode(false);
    toast.success('Déconnexion réussie');
  };
  
  // Handle enseignant logout
  const handleEnseignantLogout = () => {
    localStorage.removeItem('enseignant_token');
    localStorage.removeItem('enseignant_info');
    setEnseignantInfo(null);
    setEnseignantToken(null);
    setEnseignantMode(false);
  };
  
  // Auto-redirect after login based on user profile
  useEffect(() => {
    if (isAuthenticated && user) {
      // Close any open dialogs
      setShowLoginDialog(false);
      setShowAuthDialog(false);
      
      // Set user name for transition
      setTransitionUserName(user.first_name || '');
      
      // Check if user has a subscription
      const hasSubscription = user.subscription_status === 'active' || user.subscription_status === 'trialing';
      
      // Determine destination based on user profile
      if (hasSubscription) {
        setLoginDestination('dashboard');
      } else {
        setLoginDestination('tarification');
      }
      
      // Show transition animation
      setShowLoginTransition(true);
    }
  }, [isAuthenticated, user?.id]);
  
  // Handle login transition complete
  const handleLoginTransitionComplete = () => {
    // Navigate to appropriate page after animation
    if (loginDestination === 'dashboard') {
      setActivePage(null); // Show main dashboard with progress
    } else if (loginDestination === 'tarification') {
      setShowTarification(true);
    }
    
    // Hide transition after a short delay
    setTimeout(() => {
      setShowLoginTransition(false);
    }, 300);
  };
  
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
  
  // Écouteurs d'événements pour ouvrir les dialogues d'authentification depuis les composants enfants
  useEffect(() => {
    const handleOpenAuthDialog = () => {
      setShowAuthDialog(true);
    };
    
    const handleOpenLoginDialog = () => {
      setShowLoginDialog(true);
    };
    
    window.addEventListener('openAuthDialog', handleOpenAuthDialog);
    window.addEventListener('openLoginDialog', handleOpenLoginDialog);
    
    return () => {
      window.removeEventListener('openAuthDialog', handleOpenAuthDialog);
      window.removeEventListener('openLoginDialog', handleOpenLoginDialog);
    };
  }, []);
  
  // Selected dojo for Espace Dojo - using localStorage for persistence
  const [selectedDojoForAdmin, setSelectedDojoForAdmin] = useState(() => {
    const storedId = localStorage.getItem('aikido_dojo_id');
    const storedName = localStorage.getItem('aikido_dojo_name');
    if (storedId && storedName) {
      return { id: storedId, name: storedName };
    }
    return null;
  });
  
  const handleAdminLogin = (type, dojo = null) => {
    setAdminType(type);
    if (dojo) {
      setSelectedDojoForAdmin(dojo);
    }
    // Redirect to appropriate default tab based on admin type
    if (type === 'admin') {
      setActiveTab("dashboard"); // Admin sees platform dashboard
    } else if (type === 'espace_dojo') {
      setActiveTab("dojo-dashboard"); // Espace Dojo sees dojo dashboard
    }
  };
  
  const handleAdminLogout = useCallback(() => {
    localStorage.removeItem('aikido_admin');
    localStorage.removeItem('aikido_dojo_id');
    localStorage.removeItem('aikido_dojo_name');
    setAdminType(null);
    setSelectedDojoForAdmin(null);
    setActiveTab("techniques");
    toast.success("Déconnexion réussie");
  }, []);
  
  // Session timeout for admin/dojo - 30 minutes of inactivity
  const { 
    showWarning: showSessionWarning, 
    remainingTimeFormatted,
    extendSession 
  } = useSessionTimeout({
    isActive: isAdminMode,
    timeout: 30 * 60 * 1000, // 30 minutes
    warningBefore: 5 * 60 * 1000, // Warning 5 min before
    onTimeout: () => {
      handleAdminLogout();
      toast.warning("Session expirée par inactivité", {
        description: "Vous avez été déconnecté pour des raisons de sécurité."
      });
    },
    onWarning: () => {
      // Optional: play a sound or other notification
    }
  });
  
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
          // Normalize belt_level to handle legacy values
          setUserBelt(normalizeBeltKey(beltData.belt_level));
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
      mastered: `${statistics?.mastered_techniques || 0} technique(s) en progression`,
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
      
      {/* Session Timeout Warning for Admin/Dojo */}
      <SessionTimeoutWarning
        isOpen={showSessionWarning}
        remainingTime={remainingTimeFormatted}
        onExtend={extendSession}
        onLogout={handleAdminLogout}
        adminType={adminType}
      />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Logo cliquable - retour à la page d'accueil/sélection */}
              <button
                onClick={() => {
                  // Si on est sur une page de jeu, revenir à l'accueil
                  if (activePage) {
                    setActivePage(null);
                  } else {
                    // Efface le mode pour revenir à l'écran de sélection
                    localStorage.removeItem('ninja-aikido-mode');
                    // Force le rechargement de la page
                    window.location.reload();
                  }
                }}
                className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
                title="Retour à l'accueil"
              >
                {/* Logo animé Tanaka */}
                <TanakaAnimatedLogo size="md" />
                <div className="text-left hidden sm:block">
                  <p className="text-xs sm:text-sm text-amber-400 font-medium group-hover:text-amber-300 transition-colors">Aikido@Game</p>
                  <p className="text-sm sm:text-lg md:text-xl text-white font-bold group-hover:text-slate-200 transition-colors">Votre parcours</p>
                </div>
              </button>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* User Auth Button */}
              {isAuthenticated ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Badge className="bg-emerald-600 text-white hidden sm:flex text-xs">
                    <User className="w-3 h-3 mr-1" />
                    {user?.first_name}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 px-2 sm:px-3"
                  >
                    <LogOut className="w-4 h-4 sm:mr-1" />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </Button>
                  {/* Show upgrade button for users without subscription */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPaywall(true)}
                    className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/20 h-8 px-2"
                    title="Voir les offres"
                  >
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <HeaderNavigation
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={logout}
                  onRegisterUser={() => setShowAuthDialog(true)}
                  onRegisterDojo={() => setShowDojoRegistration(true)}
                  onLoginUser={() => setShowLoginDialog(true)}
                  onLoginDojo={() => { setAdminLoginMode('dojo'); setShowAdminLogin(true); }}
                  onAdminAccess={() => { setAdminLoginMode('admin'); setShowAdminLogin(true); }}
                  isAdmin={isAdmin}
                  isAdminMode={isAdminMode}
                />
              )}
              
              {/* Bouton Espace de gestion - Mobile */}
              {!isAdmin && !isAdminMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdminLogin(true)}
                  className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 px-2 md:hidden"
                >
                  <Lock className="w-4 h-4" />
                </Button>
              )}
              
              {/* Bouton Mode d'Emploi */}
              {!enseignantMode && !isAdminMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModeEmploi(true)}
                  className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20 h-8 px-2 sm:px-3"
                >
                  <ScrollText className="w-4 h-4 sm:mr-1" />
                  <span className="hidden lg:inline">Guide & Questions</span>
                </Button>
              )}
              
              {/* Bouton Abonnements */}
              {!enseignantMode && !isAdminMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTarification(true)}
                  className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20 h-8 px-2 sm:px-3"
                >
                  <CreditCard className="w-4 h-4 sm:mr-1" />
                  <span className="hidden lg:inline">Abonnements</span>
                </Button>
              )}

              {/* Note: Espace Parent supprimé du header - accès via section Validations */}

              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAdminLogout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 px-2 sm:px-3"
                >
                  <LogOut className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStats(!showStats)}
                className={`text-slate-400 hover:text-white ${showStats ? 'bg-slate-800' : ''} hidden`}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Stats</span>
              </Button>
              {displayStatistics && (
                <Badge className="bg-cyan-600 text-white hidden">
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
      
      {/* Mode d'Emploi Page - Affichage plein écran */}
      {showModeEmploi && (
        <ModeEmploiPage onBack={() => setShowModeEmploi(false)} />
      )}
      
      {/* Tarification Page - Affichage plein écran */}
      {showTarification && (
        <TarificationPage 
          onBack={() => setShowTarification(false)}
          user={user}
          token={token}
          onLoginRequired={() => {
            setShowTarification(false);
            setShowAuthDialog(true);
          }}
          onSelectPlan={(planId, result) => {
            console.log('Plan selected:', planId, result);
            // Refresh user data after subscription
            if (result?.subscription) {
              setUser(prev => ({
                ...prev,
                subscription_status: result.subscription.status,
                subscription_plan: planId
              }));
            }
            setShowTarification(false);
          }}
        />
      )}
      
      {/* Parent Dashboard - Fenêtre flottante contextuelle à l'enfant actif */}
      <Dialog open={parentMode && parentInfo} onOpenChange={(open) => { if (!open) handleParentLogout(); }}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-purple-500/30 overflow-hidden">
          <div className="overflow-y-auto max-h-[90vh]">
            <ParentDashboard
              onLogout={handleParentLogout}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Enseignant Dashboard - Affichage complet quand connecté en mode enseignant */}
      {enseignantMode && enseignantInfo && enseignantToken && (
        <EnseignantDashboard
          enseignant={enseignantInfo}
          token={enseignantToken}
          onLogout={handleEnseignantLogout}
        />
      )}
      
      {/* Main Content - Masqué quand en mode enseignant, mode d'emploi ou tarification */}
      {/* Note: parentMode n'empêche plus l'affichage car Espace Parent est maintenant une fenêtre flottante */}
      {!enseignantMode && !showModeEmploi && !showTarification && (
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs for Techniques and Members */}
        {/* ═══════════════════════════════════════════════════════════════════════════ */}
        {/* NOUVEAU DESIGN ADMIN - Sidebar + Content */}
        {/* ═══════════════════════════════════════════════════════════════════════════ */}
        {isAdmin && (
          <AdminDashboard
            activeSection={adminSection}
            onSectionChange={setAdminSection}
            onLogout={() => {
              setAdminType(null);
              localStorage.removeItem('aikido_admin');
              toast.success("Déconnexion réussie");
            }}
          >
            {/* Contenu selon la section active */}
            {adminSection === 'techniques' ? (
              <CombinaisonsPage onBack={() => setAdminSection('dashboard')} embedded={true} />
            ) : adminSection === 'dashboard' ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">{membersStats?.totalUsers || 0}</p>
                          <p className="text-xs text-slate-400">Utilisateurs</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">{membersStats?.totalDojos || 0}</p>
                          <p className="text-xs text-slate-400">Dojos actifs</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">{membersStats?.activeSubscriptions || 0}</p>
                          <p className="text-xs text-slate-400">Abonnements</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                          <Swords className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">96</p>
                          <p className="text-xs text-slate-400">Techniques Kyu</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Actions rapides */}
                <h3 className="text-lg font-semibold text-white mb-4">Actions rapides</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 bg-slate-700/50 border-slate-500 hover:bg-slate-600 hover:border-violet-500 text-white transition-all"
                    onClick={() => setAdminSection('users')}
                  >
                    <Users className="w-6 h-6 text-violet-400" />
                    <span>Gérer les utilisateurs</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 bg-slate-700/50 border-slate-500 hover:bg-slate-600 hover:border-orange-500 text-white transition-all"
                    onClick={() => setAdminSection('dojos')}
                  >
                    <Building2 className="w-6 h-6 text-orange-400" />
                    <span>Gérer les dojos</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 bg-slate-700/50 border-slate-500 hover:bg-slate-600 hover:border-amber-500 text-white transition-all"
                    onClick={() => setAdminSection('techniques')}
                  >
                    <Swords className="w-6 h-6 text-amber-400" />
                    <span>Voir les techniques</span>
                  </Button>
                </div>
              </div>
            ) : adminSection === 'users' || adminSection === 'users_list' ? (
              <div className="p-6">
                <DojoMembersList 
                  isAdmin={true} 
                  onMemberSelect={(member) => console.log('Member selected:', member)}
                />
              </div>
            ) : adminSection === 'users_credentials' ? (
              <UserCredentialsManager />
            ) : adminSection === 'dojos' ? (
              <DojoManagementPanel />
            ) : adminSection === 'stages' ? (
              <StagesCalendar embedded={true} />
            ) : adminSection === 'subscriptions' ? (
              <div className="p-6">
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-emerald-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold text-white mb-2">Gestion des abonnements</h3>
                  <p className="text-slate-400">Module de gestion des paiements et formules</p>
                </div>
              </div>
            ) : adminSection === 'legal' ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-rose-500/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <ScrollText className="w-8 h-8 text-rose-400 mb-3" />
                      <h4 className="font-bold text-white mb-1">CGU</h4>
                      <p className="text-sm text-slate-400">Conditions générales d'utilisation</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-rose-500/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <ScrollText className="w-8 h-8 text-rose-400 mb-3" />
                      <h4 className="font-bold text-white mb-1">CGV</h4>
                      <p className="text-sm text-slate-400">Conditions générales de vente</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-rose-500/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <Shield className="w-8 h-8 text-rose-400 mb-3" />
                      <h4 className="font-bold text-white mb-1">RGPD</h4>
                      <p className="text-sm text-slate-400">Protection des données personnelles</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-rose-500/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <ScrollText className="w-8 h-8 text-rose-400 mb-3" />
                      <h4 className="font-bold text-white mb-1">Mentions légales</h4>
                      <p className="text-sm text-slate-400">Informations légales obligatoires</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : adminSection === 'files' ? (
              <AdminFilesContent />
            ) : adminSection === 'passages_grades' ? (
              <PassagesGradesViewer />
            ) : adminSection === 'galerie' ? (
              <AdminGalleryContent />
            ) : adminSection === 'videos' || adminSection === 'videos_techniques' || adminSection === 'videos_stages' || adminSection === 'videos_cours' || adminSection === 'videos_demonstrations' ? (
              <AdminVideosContent category={adminSection.replace('videos_', '')} />
            ) : adminSection === 'jo' ? (
              <TechniquesSectionViewer
                techniques={TECHNIQUES_JO}
                category="jo"
                title="Techniques au Jo (Bâton)"
                subtitle="Le bâton traditionnel de l'Aïkido - 128 cm"
              />
            ) : adminSection === 'bokken' ? (
              <TechniquesSectionViewer
                techniques={TECHNIQUES_BOKKEN}
                category="bokken"
                title="Techniques au Bokken (Sabre)"
                subtitle="Le sabre en bois traditionnel"
              />
            ) : adminSection === 'tanto' ? (
              <TechniquesSectionViewer
                techniques={TECHNIQUES_TANTO}
                category="tanto"
                title="Techniques au Tanto (Couteau)"
                subtitle="Défense contre couteau - Tanto Dori"
              />
            ) : adminSection === 'tai_sabaki' ? (
              <TechniquesSectionViewer
                techniques={TAI_SABAKI}
                category="tai_sabaki"
                title="Tai Sabaki (Déplacements)"
                subtitle="Les mouvements fondamentaux du corps"
              />
            ) : adminSection === 'ukemi' ? (
              <TechniquesSectionViewer
                techniques={UKEMI}
                category="ukemi"
                title="Ukemi (Chutes)"
                subtitle="L'art de recevoir et de tomber en sécurité"
              />
            ) : adminSection === 'kamae' ? (
              <TechniquesSectionViewer
                techniques={KAMAE}
                category="kamae"
                title="Kamae (Postures)"
                subtitle="Les gardes et positions fondamentales"
              />
            ) : adminSection === 'atemi' ? (
              <TechniquesSectionViewer
                techniques={ATEMI}
                category="atemi"
                title="Atemi (Frappes)"
                subtitle="Les frappes et coups de l'Aïkido"
              />
            ) : adminSection === 'kokyu_waza' ? (
              <TechniquesSectionViewer
                techniques={KOKYU_WAZA}
                category="kokyu_waza"
                title="Kokyu Waza (Techniques de respiration)"
                subtitle="Les techniques utilisant le souffle et le Ki"
              />
            ) : adminSection === 'kansetsu_waza' ? (
              <TechniquesSectionViewer
                techniques={KANSETSU_WAZA}
                category="kansetsu_waza"
                title="Kansetsu Waza (Clés articulaires)"
                subtitle="Les techniques de contrôle et immobilisation"
              />
            ) : adminSection === 'suwariwaza' ? (
              <TechniquesSectionViewer
                techniques={SUWARIWAZA}
                category="suwariwaza"
                title="Suwariwaza (Techniques à genoux)"
                subtitle="Pratique traditionnelle au sol"
              />
            ) : adminSection === 'hanmi_handachi' ? (
              <TechniquesSectionViewer
                techniques={HANMI_HANDACHI}
                category="hanmi_handachi"
                title="Hanmi Handachi (Semi-debout)"
                subtitle="Tori à genoux, Uke debout"
              />
            ) : null}
          </AdminDashboard>
        )}
        
        {/* ═══════════════════════════════════════════════════════════════════════════ */}
        {/* INTERFACE NON-ADMIN (Espace Dojo, Utilisateurs normaux) */}
        {/* ═══════════════════════════════════════════════════════════════════════════ */}
        {!isAdmin && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          {isEspaceDojo && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-orange-400 font-semibold">🏯 Mon Dojo</span>
                <span className="text-xs text-slate-500 hidden sm:inline">Gestion humaine • Locale</span>
              </div>
              <TabsList className="bg-slate-800 border-slate-700 flex flex-wrap gap-1">
                <TabsTrigger value="dojo-dashboard" className="data-[state=active]:bg-orange-700 text-xs sm:text-sm">
                  <LayoutDashboard className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Mon Dojo</span>
                </TabsTrigger>
                <TabsTrigger value="members" className="data-[state=active]:bg-orange-700 text-xs sm:text-sm">
                  <Users className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Adhérents</span>
                </TabsTrigger>
                <TabsTrigger value="animation" className="data-[state=active]:bg-orange-700 text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Animation</span>
                </TabsTrigger>
                <TabsTrigger value="techniques-ref" className="data-[state=active]:bg-orange-700 text-xs sm:text-sm">
                  <Swords className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Techniques</span>
                </TabsTrigger>
              </TabsList>
            </div>
          )}
          
          {/* User Tabs - Navigation utilisateur (non-admin) - Masqué car un seul onglet */}
          
          <TabsContent value="techniques" className="mt-6">
            {/* Filter indicator */}
            {techniqueFilter !== 'all' && (
              <div className="mb-4 flex items-center justify-between bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <span className="text-sm text-slate-300">
                  Filtre actif : <span className="font-semibold text-cyan-400">
                    {techniqueFilter === 'mastered' && 'Progression'}
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
            {showStats && !activePage && (
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
                userId={user?.id}
                userEmail={user?.email}
                userName={user?.first_name}
                userBelt={isAuthenticated ? userBelt : null}
                onBeltChange={handleUserBeltChange}
                isAuthenticated={isAuthenticated}
                onRefreshData={fetchData}
                onNavigate={(pageId) => setActivePage(pageId)}
                onNinjaModeChange={(mode) => setNinjaMode(mode)}
              />
            )}

            {/* Pages de jeu (version enfant) */}
            {activePage === 'commence' && (
              <CommencePage 
                onBack={() => setActivePage(null)} 
                isAuthenticated={isAuthenticated}
                onOpenAuth={() => setShowAuthDialog(true)}
              />
            )}
            {activePage === 'apprends' && (
              <ApprendsPage 
                onBack={() => setActivePage(null)} 
                isAuthenticated={isAuthenticated}
                onOpenAuth={() => setShowAuthDialog(true)}
              />
            )}
            {activePage === 'entraine' && (
              <EntrainePage 
                onBack={() => setActivePage(null)} 
                isAuthenticated={isAuthenticated}
                onOpenAuth={() => setShowAuthDialog(true)}
              />
            )}
            {activePage === 'valide' && (
              <ValidePage 
                onBack={() => setActivePage(null)} 
                isAuthenticated={isAuthenticated}
                onOpenAuth={() => setShowAuthDialog(true)}
              />
            )}
            {activePage === 'progresse' && (
              <ProgressePage 
                onBack={() => setActivePage(null)} 
                isAuthenticated={isAuthenticated}
                onOpenAuth={() => setShowAuthDialog(true)}
              />
            )}
            {activePage === 'maitrise' && (
              <MaitrisePage 
                onBack={() => setActivePage(null)} 
                isAuthenticated={isAuthenticated}
                onOpenAuth={() => setShowAuthDialog(true)}
              />
            )}

            {/* Pages de jeu (version adulte) */}
            {activePage === 'inscription' && (
              <InscriptionPage 
                onBack={() => setActivePage(null)} 
                isAuthenticated={isAuthenticated}
                onOpenAuth={() => setShowAuthDialog(true)}
              />
            )}
            {activePage === 'programme' && (
              <ProgrammePage 
                onBack={() => setActivePage(null)} 
                isAuthenticated={isAuthenticated}
                onOpenAuth={() => setShowAuthDialog(true)}
              />
            )}
            {activePage === 'progression' && (
              <ProgressionPage 
                onBack={() => setActivePage(null)} 
                isAuthenticated={isAuthenticated}
                onOpenAuth={() => setShowAuthDialog(true)}
              />
            )}
            {activePage === 'vertus' && (
              <VertusPage 
                onBack={() => setActivePage(null)} 
              />
            )}
            {activePage === 'objectifs' && (
              <ObjectifsPage 
                onBack={() => setActivePage(null)} 
                isAuthenticated={isAuthenticated}
                onOpenAuth={() => setShowAuthDialog(true)}
              />
            )}
            {activePage === 'certifications' && (
              <CertificationsPage 
                onBack={() => setActivePage(null)} 
                isAuthenticated={isAuthenticated}
                onOpenAuth={() => setShowAuthDialog(true)}
              />
            )}
            {activePage === 'philosophie' && (
              <div className="relative">
                <button
                  onClick={() => setActivePage(null)}
                  className="fixed top-4 left-4 z-50 bg-slate-800/80 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 border border-slate-600 backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
                  </svg>
                  Retour au parcours
                </button>
                <PhilosophiePage 
                  isChildMode={ninjaMode === 'jeune' || ninjaMode === null}
                />
              </div>
            )}
            
            {activePage === 'combinaisons' && (
              <CombinaisonsPage onBack={() => setActivePage(null)} />
            )}
            
            {activePage === 'illustrations' && (
              <IllustrationsGallery />
            )}
            
            {/* Grade Sections - Visible uniquement pour les utilisateurs connectés */}
            {isAuthenticated && (
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
            )}
          </TabsContent>
          
          {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
          {/* ESPACE DOJO - Gestion Adhérents */}
          {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
          
          {/* Onglet Dashboard Dojo */}
          {isEspaceDojo && (
            <TabsContent value="dojo-dashboard" className="mt-6">
              <div className="space-y-6">
                {/* En-tête Dojo */}
                <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {selectedDojoForAdmin?.name || 'Mon Dojo'}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-green-600 text-white">Actif</Badge>
                          <span className="text-slate-400 text-sm">Abonnement Dojo</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Stats rapides */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-orange-400">{members.length}</p>
                      <p className="text-sm text-slate-400">Adhérents actifs</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-green-400">85%</p>
                      <p className="text-sm text-slate-400">Assiduité globale</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-purple-400">12</p>
                      <p className="text-sm text-slate-400">Sessions ce mois</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-amber-400">25j</p>
                      <p className="text-sm text-slate-400">Avant échéance</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Alertes */}
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      Alertes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-amber-900/20 rounded-lg border border-amber-700/30">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-300 text-sm">Échéance abonnement dans 25 jours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
          
          {/* Onglet Adhérents - Espace Dojo (RGPD-compliant) */}
          {isEspaceDojo && (
            <TabsContent value="members" className="mt-6">
              <DojoMembersList 
                dojoId={selectedDojoForAdmin?.id}
                dojoName={selectedDojoForAdmin?.name}
              />
            </TabsContent>
          )}
          
          {/* Onglet Animation - Espace Dojo */}
          {isEspaceDojo && (
            <TabsContent value="animation" className="mt-6">
              <div className="space-y-6">
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      Animation du Dojo
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Défis collectifs non compétitifs et suivi d'assiduité
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Défis collectifs */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl border border-purple-700/30">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                            <span className="text-xl">🎯</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">Défi du Mois</h4>
                            <p className="text-xs text-purple-300">Pratique collective</p>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm">100 chutes ukemi en groupe</p>
                        <div className="mt-3 bg-slate-800 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: '65%'}}></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">65% accompli</p>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-br from-emerald-900/30 to-green-900/30 rounded-xl border border-emerald-700/30">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                            <span className="text-xl">🧘</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">Méditation</h4>
                            <p className="text-xs text-emerald-300">Sérénité collective</p>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm">10 min de mokuso par cours</p>
                        <div className="mt-3 bg-slate-800 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{width: '80%'}}></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">80% accompli</p>
                      </div>
                    </div>
                    
                    {/* Assiduité anonymisée */}
                    <h4 className="text-lg font-semibold text-white mb-3">Assiduité Globale (anonymisée)</h4>
                    <div className="grid grid-cols-7 gap-2">
                      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((jour, i) => (
                        <div key={jour} className="text-center">
                          <p className="text-xs text-slate-500 mb-1">{jour}</p>
                          <div className={`h-8 rounded ${i < 5 ? 'bg-orange-500/50' : 'bg-slate-700'}`}></div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Participation moyenne par jour de la semaine</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
          
          {/* Onglet Techniques - Espace Dojo (référentiel lecture seule) */}
          {isEspaceDojo && (
            <TabsContent value="techniques-ref" className="mt-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Swords className="w-5 h-5 text-orange-400" />
                    Les différentes techniques en Aïkido
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Référentiel des techniques (lecture seule - pas d'évaluation)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Immobilisations */}
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <h4 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                        <span>🔒</span> Immobilisations (Osae Waza)
                      </h4>
                      <ul className="space-y-1 text-sm text-slate-300">
                        <li>• Ikkyo (1ère technique)</li>
                        <li>• Nikyo (2ème technique)</li>
                        <li>• Sankyo (3ème technique)</li>
                        <li>• Yonkyo (4ème technique)</li>
                        <li>• Gokyo (5ème technique)</li>
                      </ul>
                    </div>
                    
                    {/* Projections */}
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <h4 className="font-semibold text-purple-400 mb-3 flex items-center gap-2">
                        <span>🌀</span> Projections (Nage Waza)
                      </h4>
                      <ul className="space-y-1 text-sm text-slate-300">
                        <li>• Irimi Nage (projection en entrant)</li>
                        <li>• Shiho Nage (projection 4 directions)</li>
                        <li>• Kote Gaeshi (retournement poignet)</li>
                        <li>• Kaiten Nage (projection rotative)</li>
                        <li>• Tenchi Nage (ciel et terre)</li>
                      </ul>
                    </div>
                    
                    {/* Attaques */}
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <h4 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
                        <span>⚔️</span> Attaques (Waza)
                      </h4>
                      <ul className="space-y-1 text-sm text-slate-300">
                        <li>• Shomen Uchi (frappe frontale)</li>
                        <li>• Yokomen Uchi (frappe latérale)</li>
                        <li>• Tsuki (coup de poing)</li>
                        <li>• Katate Dori (saisie poignet)</li>
                        <li>• Ryote Dori (saisie deux mains)</li>
                      </ul>
                    </div>
                    
                    {/* Déplacements */}
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                        <span>👣</span> Déplacements (Tai Sabaki)
                      </h4>
                      <ul className="space-y-1 text-sm text-slate-300">
                        <li>• Irimi (entrer)</li>
                        <li>• Tenkan (pivoter)</li>
                        <li>• Kaiten (rotation)</li>
                        <li>• Tsugi Ashi (pas glissé)</li>
                      </ul>
                    </div>
                    
                    {/* Chutes */}
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <h4 className="font-semibold text-rose-400 mb-3 flex items-center gap-2">
                        <span>🔄</span> Chutes (Ukemi)
                      </h4>
                      <ul className="space-y-1 text-sm text-slate-300">
                        <li>• Mae Ukemi (chute avant)</li>
                        <li>• Ushiro Ukemi (chute arrière)</li>
                        <li>• Yoko Ukemi (chute latérale)</li>
                        <li>• Tobu Ukemi (chute projetée)</li>
                      </ul>
                    </div>
                    
                    {/* Armes */}
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <h4 className="font-semibold text-orange-400 mb-3 flex items-center gap-2">
                        <span>🗡️</span> Armes (Buki Waza)
                      </h4>
                      <ul className="space-y-1 text-sm text-slate-300">
                        <li>• Jo (bâton)</li>
                        <li>• Bokken (sabre en bois)</li>
                        <li>• Tanto (couteau)</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-amber-900/20 rounded-lg border border-amber-700/30">
                    <p className="text-amber-300 text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>🚫 <strong>Rappel :</strong> L'Espace Dojo ne permet pas d'évaluer techniquement les adhérents. La progression individuelle reste dans l'espace personnel de chaque pratiquant.</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
          {/* ADMIN - Gestion Plateforme (HUMAN KNOWLEDGE) */}
          {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
          
          {/* Onglet Tableau de Bord Admin */}
          {isAdmin && (
            <TabsContent value="dashboard" className="mt-6">
              <div className="space-y-6">
                {/* Stats globales */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-700/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-cyan-400">{dojos.length}</p>
                      <p className="text-sm text-slate-400">Total Dojos</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-700/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-green-400">
                        {dojos.filter(d => d.subscription_status === 'active').length}
                      </p>
                      <p className="text-sm text-slate-400">Dojos Actifs</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-700/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-amber-400">
                        {dojos.filter(d => d.subscription_status === 'trialing').length}
                      </p>
                      <p className="text-sm text-slate-400">En Essai</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border-purple-700/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-purple-400">{visitors.length}</p>
                      <p className="text-sm text-slate-400">Utilisateurs</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Alertes */}
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      Alertes Plateforme
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {dojos.filter(d => d.subscription_status === 'trialing').length > 0 && (
                        <div className="flex items-center gap-3 p-3 bg-amber-900/20 rounded-lg border border-amber-700/30">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <span className="text-amber-300 text-sm">
                            {dojos.filter(d => d.subscription_status === 'trialing').length} dojo(s) en période d'essai
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400 text-sm">Aucune alerte critique</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Rappel des permissions */}
                <Card className="bg-cyan-900/20 border-cyan-700/30">
                  <CardContent className="p-4">
                    <p className="text-cyan-300 text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span><strong>Rappel :</strong> L'Admin ne gère jamais les adhérents directement. Cette responsabilité appartient à chaque Espace Dojo.</span>
                    </p>
                  </CardContent>
                </Card>
                
                {/* Identifiants de test */}
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-emerald-400" />
                      Identifiants des comptes
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Référence rapide des accès administrateurs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Admin Plateforme */}
                      <div className="p-4 bg-cyan-900/20 rounded-lg border border-cyan-700/30">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="w-5 h-5 text-cyan-400" />
                          <h4 className="font-semibold text-cyan-400">Espace de gestion (Admin)</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="text-slate-300">
                            <span className="text-slate-500">Mot de passe :</span>{' '}
                            <code className="bg-slate-800 px-2 py-1 rounded text-cyan-300">aikido2024</code>
                          </p>
                        </div>
                      </div>
                      
                      {/* Espace Dojo - Email */}
                      <div className="p-4 bg-orange-900/20 rounded-lg border border-orange-700/30">
                        <div className="flex items-center gap-2 mb-3">
                          <Building2 className="w-5 h-5 text-orange-400" />
                          <h4 className="font-semibold text-orange-400">Espace Dojo (Email)</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="text-slate-300">
                            <span className="text-slate-500">Email :</span>{' '}
                            <code className="bg-slate-800 px-2 py-1 rounded text-orange-300">contact@aikido-lariviere.fr</code>
                          </p>
                          <p className="text-slate-300">
                            <span className="text-slate-500">Mot de passe :</span>{' '}
                            <code className="bg-slate-800 px-2 py-1 rounded text-orange-300">aikido2024</code>
                          </p>
                        </div>
                      </div>
                      
                      {/* Espace Dojo - Liste */}
                      <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-700/30 md:col-span-2">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-5 h-5 text-amber-400" />
                          <h4 className="font-semibold text-amber-400">Espace Dojo (Sélection liste)</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="text-slate-300">
                            <span className="text-slate-500">Mot de passe partagé :</span>{' '}
                            <code className="bg-slate-800 px-2 py-1 rounded text-amber-300">senseiclub</code>
                          </p>
                          <p className="text-xs text-slate-500 mt-2">
                            Ce mot de passe permet d'accéder à n'importe quel dojo via la sélection dans la liste.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Onglet Gestion Utilisateurs - Admin */}
          {isAdmin && (
            <TabsContent value="users" className="mt-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    Gestion des Utilisateurs
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Liste des utilisateurs inscrits sur la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Stats utilisateurs */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-700/30 text-center">
                      <p className="text-2xl font-bold text-purple-400">{visitors.length}</p>
                      <p className="text-xs text-slate-400">Total inscrits</p>
                    </div>
                    <div className="p-4 bg-green-900/20 rounded-lg border border-green-700/30 text-center">
                      <p className="text-2xl font-bold text-green-400">
                        {visitors.filter(v => v.subscription?.status === 'active' || v.subscription?.status === 'trialing').length}
                      </p>
                      <p className="text-xs text-slate-400">Abonnés actifs</p>
                    </div>
                    <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-700/30 text-center">
                      <p className="text-2xl font-bold text-amber-400">
                        {visitors.filter(v => v.subscription?.status === 'trialing').length}
                      </p>
                      <p className="text-xs text-slate-400">En essai</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                      <p className="text-2xl font-bold text-slate-400">
                        {visitors.filter(v => !v.subscription || v.subscription?.status === 'inactive').length}
                      </p>
                      <p className="text-xs text-slate-400">Sans abonnement</p>
                    </div>
                  </div>
                  
                  {/* Liste des utilisateurs */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white mb-3">Liste des utilisateurs ({visitors.length})</h3>
                    
                    {visitors.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Aucun utilisateur inscrit</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-700">
                              <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Utilisateur</th>
                              <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Email</th>
                              <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Mot de passe</th>
                              <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Statut</th>
                              <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Inscription</th>
                            </tr>
                          </thead>
                          <tbody>
                            {visitors.map((visitor) => (
                              <tr key={visitor.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                                      {visitor.first_name?.[0]}{visitor.last_name?.[0]}
                                    </div>
                                    <span className="text-white font-medium">
                                      {visitor.first_name} {visitor.last_name}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <code className="text-cyan-400 text-sm bg-slate-800 px-2 py-1 rounded">
                                    {visitor.email}
                                  </code>
                                </td>
                                <td className="py-3 px-4">
                                  <code className="text-amber-400 text-sm bg-slate-800 px-2 py-1 rounded">
                                    {visitor.password_plain || '••••••••'}
                                  </code>
                                </td>
                                <td className="py-3 px-4">
                                  {visitor.subscription?.status === 'active' && (
                                    <Badge className="bg-green-600 text-white">Actif</Badge>
                                  )}
                                  {visitor.subscription?.status === 'trialing' && (
                                    <Badge className="bg-amber-600 text-white">Essai</Badge>
                                  )}
                                  {(!visitor.subscription || visitor.subscription?.status === 'inactive') && (
                                    <Badge className="bg-slate-600 text-white">Gratuit</Badge>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-slate-400 text-sm">
                                  {visitor.created_at ? new Date(visitor.created_at).toLocaleDateString('fr-FR') : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Onglet Gestion Dojos - Admin */}
          {isAdmin && (
            <TabsContent value="dojos" className="mt-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-cyan-400" />
                    Gestion des Dojos
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Créer, activer, suspendre et gérer les dojos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Button
                      onClick={() => setShowDojoManagement(true)}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Créer / Gérer les dojos
                    </Button>
                  </div>
                  
                  {/* Liste des Dojos avec statuts */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white mb-3">Liste des Dojos</h3>
                    {dojos.length === 0 ? (
                      <p className="text-slate-400 text-center py-8">Aucun dojo enregistré</p>
                    ) : (
                      dojos.map((dojo) => (
                        <div 
                          key={dojo.id}
                          className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-white">{dojo.name}</p>
                                <p className="text-sm text-slate-400">
                                  {dojo.city || 'Ville non renseignée'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {dojo.is_default && (
                                <Badge className="bg-cyan-600 text-white text-xs">Par défaut</Badge>
                              )}
                              {dojo.subscription_status === 'trialing' && (
                                <Badge className="bg-amber-600 text-white text-xs">Essai</Badge>
                              )}
                              {dojo.subscription_status === 'active' && (
                                <Badge className="bg-green-600 text-white text-xs">Actif</Badge>
                              )}
                              {!dojo.subscription_status && (
                                <Badge className="bg-slate-600 text-white text-xs">En attente</Badge>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-slate-700">
                            <div className="text-center">
                              <p className="text-xs text-slate-500">ID</p>
                              <p className="text-sm text-slate-300 font-mono">{dojo.id}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-slate-500">Membres</p>
                              <p className="text-sm text-slate-300">{dojo.members_count || 0}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-slate-500">Création</p>
                              <p className="text-sm text-slate-300">
                                {dojo.created_at ? new Date(dojo.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Onglet Abonnements - Admin */}
          {isAdmin && (
            <TabsContent value="subscriptions" className="mt-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-cyan-400" />
                    Gestion des Abonnements
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Vue Stripe : statuts, échéances, historique
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Stats abonnements */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <p className="text-2xl font-bold text-green-400">
                        {dojos.filter(d => d.subscription_status === 'active').length}
                      </p>
                      <p className="text-sm text-slate-400">Abonnements Actifs</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <p className="text-2xl font-bold text-amber-400">
                        {dojos.filter(d => d.subscription_status === 'trialing').length}
                      </p>
                      <p className="text-sm text-slate-400">En Période d'Essai</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <p className="text-2xl font-bold text-red-400">0</p>
                      <p className="text-sm text-slate-400">Impayés</p>
                    </div>
                  </div>
                  
                  {/* Liste des abonnements */}
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-white">Détail par Dojo</h4>
                    {dojos.map((dojo) => (
                      <div key={dojo.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div>
                          <p className="font-medium text-white">{dojo.name}</p>
                          <p className="text-xs text-slate-500">
                            Plan: {dojo.subscription_plan || 'Non défini'}
                          </p>
                        </div>
                        <div className="text-right">
                          {dojo.subscription_status === 'active' && (
                            <Badge className="bg-green-600 text-white">Actif</Badge>
                          )}
                          {dojo.subscription_status === 'trialing' && (
                            <Badge className="bg-amber-600 text-white">Essai</Badge>
                          )}
                          {!dojo.subscription_status && (
                            <Badge className="bg-slate-600 text-white">Aucun</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-slate-400 text-sm">
                      <strong>Note :</strong> L'intégration Stripe est en mode test. Les données bancaires ne sont pas accessibles depuis cette interface.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Onglet Juridique - Admin */}
          {isAdmin && (
            <TabsContent value="legal" className="mt-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ScrollText className="w-5 h-5 text-cyan-400" />
                    Juridique & Conformité
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Gestion des versions CGU, CGV, Charte, RGPD
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">CGU</h4>
                        <Badge className="bg-green-600 text-white text-xs">v1.0</Badge>
                      </div>
                      <p className="text-sm text-slate-400">Conditions Générales d'Utilisation</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 border-slate-600 text-slate-300"
                        onClick={() => setShowCGU(true)}
                      >
                        Voir le document
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">CGV</h4>
                        <Badge className="bg-green-600 text-white text-xs">v1.0</Badge>
                      </div>
                      <p className="text-sm text-slate-400">Conditions Générales de Vente</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 border-slate-600 text-slate-300"
                        onClick={() => setShowCGV(true)}
                      >
                        Voir le document
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">Charte</h4>
                        <Badge className="bg-green-600 text-white text-xs">v1.0</Badge>
                      </div>
                      <p className="text-sm text-slate-400">Charte d'utilisation</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 border-slate-600 text-slate-300"
                        onClick={() => setShowCharte(true)}
                      >
                        Voir le document
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">RGPD</h4>
                        <Badge className="bg-green-600 text-white text-xs">v1.0</Badge>
                      </div>
                      <p className="text-sm text-slate-400">Protection des données</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 border-slate-600 text-slate-300"
                        onClick={() => setShowRGPD(true)}
                      >
                        Voir le document
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-cyan-900/20 rounded-lg border border-cyan-700/30">
                    <p className="text-cyan-300 text-sm">
                      <strong>Export RGPD :</strong> En cas de demande légale, un export global des données peut être généré depuis cette section.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
        )}
      </main>
      )}
      
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
        isAuthenticated={isAuthenticated}
      />
      
      {/* Admin Login Dialog */}
      <AdminLoginDialog
        isOpen={showAdminLogin}
        onClose={() => { setShowAdminLogin(false); setAdminLoginMode('choice'); }}
        onSuccess={handleAdminLogin}
        initialMode={adminLoginMode}
      />
      
      {/* Enseignant Login Dialog */}
      <EnseignantLoginDialog
        isOpen={showEnseignantLogin}
        onClose={() => setShowEnseignantLogin(false)}
        onLoginSuccess={handleEnseignantLoginSuccess}
      />

      {/* Parent Login Dialog */}
      <ParentLoginDialog
        isOpen={showParentLogin}
        onClose={() => setShowParentLogin(false)}
        onSuccess={handleParentLoginSuccess}
      />

      {/* Auth Dialog (Inscription) */}
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={(firstName) => {
          setTransitionUserName(firstName);
          setLoginDestination('tarification');
          setShowLoginTransition(true);
        }}
      />

      {/* Login Dialog (Connexion) */}
      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />

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

      {/* Legal Pages */}
      <CGUPage isOpen={showCGU} onClose={() => setShowCGU(false)} />
      <CGVPage isOpen={showCGV} onClose={() => setShowCGV(false)} />
      <ChartePage isOpen={showCharte} onClose={() => setShowCharte(false)} />
      <MentionsLegalesPage isOpen={showMentionsLegales} onClose={() => setShowMentionsLegales(false)} />
      <RGPDPage isOpen={showRGPD} onClose={() => setShowRGPD(false)} />
      
      {/* Login Transition Animation */}
      <LoginTransition
        isVisible={showLoginTransition}
        userName={transitionUserName}
        destination={loginDestination}
        onComplete={handleLoginTransitionComplete}
      />
      
      {/* Maître Tanaka - Agent Vocal pour les enfants */}
      {/* Visible sur les sous-pages enfant ET sur la page d'accueil en mode enfant */}
      <MaitreTanaka 
        isVisible={
          ninjaMode === 'enfant' ||
          activePage === 'commence' ||
          activePage === 'apprends' ||
          activePage === 'entraine' ||
          activePage === 'valide' ||
          activePage === 'progresse' ||
          activePage === 'maitrise'
        }
        childContext={isAuthenticated ? {
          first_name: user?.first_name,
          belt_level: userBelt
        } : null}
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
            <button 
              onClick={() => setShowCGU(true)}
              className="text-cyan-500 hover:text-cyan-400 text-xs underline cursor-pointer"
            >
              CGU
            </button>
            <span className="text-slate-600 text-xs">•</span>
            <button 
              onClick={() => setShowCGV(true)}
              className="text-cyan-500 hover:text-cyan-400 text-xs underline cursor-pointer"
            >
              CGV
            </button>
            <span className="text-slate-600 text-xs">•</span>
            <button 
              onClick={() => setShowCharte(true)}
              className="text-cyan-500 hover:text-cyan-400 text-xs underline cursor-pointer"
            >
              Charte d&apos;utilisation
            </button>
            <span className="text-slate-600 text-xs">•</span>
            <button 
              onClick={() => setShowMentionsLegales(true)}
              className="text-cyan-500 hover:text-cyan-400 text-xs underline cursor-pointer"
            >
              Mentions légales
            </button>
            <span className="text-slate-600 text-xs">•</span>
            <button 
              onClick={() => setShowRGPD(true)}
              className="text-cyan-500 hover:text-cyan-400 text-xs underline cursor-pointer"
            >
              Politique RGPD
            </button>
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
  // Check if child mode is active for Tanaka events
  const isChildMode = typeof window !== 'undefined' && 
    localStorage.getItem('ninja-aikido-mode') === 'jeune';
  
  return (
    <AuthProvider>
      <TanakaEventProvider enabled={isChildMode}>
        <AppContent />
      </TanakaEventProvider>
    </AuthProvider>
  );
}

export default App;
