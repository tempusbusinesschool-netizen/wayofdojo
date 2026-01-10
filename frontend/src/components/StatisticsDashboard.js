import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, BarChart3, Users, FileText, Download, Award, Sparkles, Shield, Clock, BookOpen, FileDown, ChevronDown, HelpCircle, Settings } from "lucide-react";
import { toast } from "sonner";
import VirtueActionsPanel from "./VirtueActionsPanel";
import TimelinePanel from "./TimelinePanel";
import JournalPanel from "./JournalPanel";
import SimpleAccordion from "./SimpleAccordion";
import BeltProgressCard from "./BeltProgressCard";
import GradeCardsGrid from "./GradeCardsGrid";
import DeplacementsSection from "./DeplacementsSection";
import VirtuesSection from "./VirtuesSection";
import HakamaHistory from "./HakamaHistory";
import UserDashboardBlocks from "./UserDashboardBlocks";
import ProgressionTunnel from "./ProgressionTunnel";
import ParentDashboard from "./ParentDashboard";
import GuidedTour, { TourTriggerButton } from "./GuidedTour";
import AppStepsNavigation from "./AppStepsNavigation";
import AgeSelector from "./AgeSelector";
import VisitorStepsBlocks from "./VisitorStepsBlocks";
import { AIKIDO_BELTS, getBeltByPoints } from "@/constants/aikidoBelts";
import { DEPLACEMENTS_DATA } from "@/constants";
import { AIKIDO_CHARACTERS } from "@/constants/aikidoCharacters";

// 7 Virtues of Aikido with colors for pie chart
const AIKIDO_VIRTUES = [
  { name: "Respect", kanji: "礼", emoji: "🙏", color: "#FCD34D", colorClass: "bg-yellow-400" },
  { name: "Persévérance", kanji: "忍", emoji: "💪", color: "#FB923C", colorClass: "bg-orange-400" },
  { name: "Maîtrise de soi", kanji: "克", emoji: "🧘", color: "#22C55E", colorClass: "bg-green-500" },
  { name: "Humilité", kanji: "謙", emoji: "🌱", color: "#A78BFA", colorClass: "bg-violet-400" },
  { name: "Bienveillance", kanji: "仁", emoji: "💝", color: "#3B82F6", colorClass: "bg-blue-500" },
  { name: "Attention", kanji: "注", emoji: "👁️", color: "#EC4899", colorClass: "bg-pink-500" },
  { name: "Responsabilité", kanji: "責", emoji: "⚖️", color: "#14B8A6", colorClass: "bg-teal-500" }
];

// Simple Pie Chart Component
const VirtuePieChart = ({ virtueData }) => {
  const total = virtueData.reduce((sum, v) => sum + v.value, 0);
  if (total === 0) return null;
  
  let cumulativePercent = 0;
  const segments = virtueData.filter(v => v.value > 0).map((virtue, index) => {
    const percent = (virtue.value / total) * 100;
    const startAngle = cumulativePercent * 3.6; // Convert to degrees
    cumulativePercent += percent;
    const endAngle = cumulativePercent * 3.6;
    
    // Calculate SVG arc path
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);
    const largeArc = percent > 50 ? 1 : 0;
    
    return {
      ...virtue,
      percent: Math.round(percent),
      path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`
    };
  });
  
  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <svg viewBox="0 0 100 100" className="w-32 h-32 md:w-40 md:h-40">
        {segments.map((segment, idx) => (
          <path
            key={idx}
            d={segment.path}
            fill={segment.color}
            stroke="#1e293b"
            strokeWidth="1"
            className="hover:opacity-80 transition-opacity cursor-pointer"
          />
        ))}
        <circle cx="50" cy="50" r="20" fill="#1e293b" />
        <text x="50" y="52" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
          {total}
        </text>
        <text x="50" y="60" textAnchor="middle" fill="#94a3b8" fontSize="5">
          points
        </text>
      </svg>
      <div className="grid grid-cols-2 gap-1 text-xs">
        {segments.map((segment, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: segment.color }}></div>
            <span className="text-slate-300">{segment.emoji} {segment.name}</span>
            <span className="text-slate-500 ml-auto">{segment.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function StatisticsDashboard({ statistics, membersStats, onGradeClick, onFilterClick, activeFilter, isAdmin, onMembersClick, kyuLevels, userId, userName, userBelt, onBeltChange, isAuthenticated, onRefreshData, onNavigate }) {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showBeltDialog, setShowBeltDialog] = useState(false);
  const [showTrophiesDialog, setShowTrophiesDialog] = useState(false);
  const [showVirtuesDialog, setShowVirtuesDialog] = useState(false);
  const [showVirtueActionsPanel, setShowVirtueActionsPanel] = useState(false);
  const [showTimelinePanel, setShowTimelinePanel] = useState(false);
  const [showJournalPanel, setShowJournalPanel] = useState(false);
  const [showDeplacementsExpanded, setShowDeplacementsExpanded] = useState(false);
  const [sending, setSending] = useState(false);
  const [pdfExportStatus, setPdfExportStatus] = useState(null);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [activeSymbolicRole, setActiveSymbolicRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  
  // État pour le mode visiteur (enfant/adulte) - stocké en localStorage
  const [visitorMode, setVisitorMode] = useState(() => {
    return localStorage.getItem('ninja-aikido-mode') || null;
  });

  // Handler pour changer de mode
  const handleModeChange = (mode) => {
    setVisitorMode(mode);
    localStorage.setItem('ninja-aikido-mode', mode);
  };

  // Handler pour réinitialiser le mode (changer de mode)
  const handleResetMode = () => {
    localStorage.removeItem('ninja-aikido-mode');
    setVisitorMode(null);
  };
  
  // Vérifier si l'utilisateur a déjà vu le tutoriel
  useEffect(() => {
    if (isAuthenticated) {
      const tourCompleted = localStorage.getItem('aikido_tour_completed');
      if (!tourCompleted) {
        // Afficher le tutoriel après un court délai
        const timer = setTimeout(() => {
          setShowGuidedTour(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated]);
  
  // États pour les accordéons
  const [accordionOpen, setAccordionOpen] = useState({
    progression: true,
    entrainement: false,
    valeurs: false,
    histoire: false
  });
  
  const toggleAccordion = (key) => {
    setAccordionOpen(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Fetch user's active symbolic role
  useEffect(() => {
    const fetchSymbolicRole = async () => {
      if (!isAuthenticated) {
        setActiveSymbolicRole(null);
        return;
      }
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/symbolic-role`);
        setActiveSymbolicRole(response.data.active_role);
      } catch (error) {
        console.error("Error fetching symbolic role:", error);
      }
    };
    fetchSymbolicRole();
  }, [isAuthenticated, userBelt]);

  // Toggle symbolic role activation
  const handleToggleSymbolicRole = async (activate) => {
    setRoleLoading(true);
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/auth/symbolic-role`, {
        activate: activate
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setActiveSymbolicRole(activate ? response.data.role : null);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur lors de l'activation du rôle");
    } finally {
      setRoleLoading(false);
    }
  };

  // Fetch PDF export status
  useEffect(() => {
    const fetchPdfStatus = async () => {
      if (!isAuthenticated) {
        setPdfExportStatus(null);
        return;
      }
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/export-pdf/status`);
        setPdfExportStatus(response.data);
      } catch (error) {
        console.error("Error fetching PDF status:", error);
      }
    };
    fetchPdfStatus();
  }, [isAuthenticated]);

  // Handle PDF export
  const handleExportPdf = async () => {
    setExportingPdf(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/export-pdf`,
        { responseType: 'blob' }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `parcours_aikido_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("📄 PDF téléchargé avec succès !");
      
      // Update status
      setPdfExportStatus({
        can_export: false,
        days_remaining: 180,
        message: "Prochain export disponible dans 180 jours"
      });
    } catch (error) {
      console.error("PDF export error:", error);
      const message = error.response?.status === 429 
        ? "Export limité à 1 fois par semestre"
        : "Erreur lors de l'export PDF";
      toast.error(message);
    } finally {
      setExportingPdf(false);
    }
  };

  // Get current belt info from userBelt prop
  const currentBelt = userBelt ? AIKIDO_BELTS[userBelt] : AIKIDO_BELTS["6e_kyu"];

  // Calculate points based on technique mastery AND belt
  // En apprentissage = 1 point, Pratiqué = 2 points, Maîtrisé = 3 points
  // + 10 points per belt grade acquired
  const calculatePoints = () => {
    if (!statistics) return { total: 0, learning: 0, practiced: 0, mastered: 0, belt: 0 };
    
    const learningPoints = (statistics.in_progress_techniques || 0) * 1;
    const practicedTechniques = kyuLevels?.reduce((acc, kyu) => {
      return acc + kyu.techniques.filter(t => t.mastery_level === 'practiced').length;
    }, 0) || 0;
    const practicedPoints = practicedTechniques * 2;
    const masteredPoints = (statistics.mastered_techniques || 0) * 3;
    
    // Belt points: 10 points per grade (cumulative based on belt order)
    const beltPoints = currentBelt?.points || 0;
    
    return {
      total: learningPoints + practicedPoints + masteredPoints + beltPoints,
      learning: learningPoints,
      practiced: practicedPoints,
      mastered: masteredPoints,
      belt: beltPoints,
      learningCount: statistics.in_progress_techniques || 0,
      practicedCount: practicedTechniques,
      masteredCount: statistics.mastered_techniques || 0
    };
  };

  const points = calculatePoints();

  // Calculate virtues based on progression, belt, and techniques
  const calculateVirtues = () => {
    const virtueScores = {};
    AIKIDO_VIRTUES.forEach(v => {
      virtueScores[v.name] = 0;
    });
    
    // Add points from belt's associated virtue
    if (currentBelt?.associatedVirtue) {
      virtueScores[currentBelt.associatedVirtue] = (virtueScores[currentBelt.associatedVirtue] || 0) + (currentBelt.points || 0);
    }
    
    // Add points from symbolic role's virtue
    if (currentBelt?.symbolicRole?.virtue) {
      virtueScores[currentBelt.symbolicRole.virtue] = (virtueScores[currentBelt.symbolicRole.virtue] || 0) + 5;
    }
    
    // Distribute technique points across virtues based on mastery level
    // Learning: Humilité (learning to be humble)
    // Practiced: Persévérance (practicing regularly)
    // Mastered: Maîtrise de soi (self-control achieved)
    virtueScores["Humilité"] += points.learning;
    virtueScores["Persévérance"] += points.practiced;
    virtueScores["Maîtrise de soi"] += points.mastered;
    
    // Add points for sessions (Attention - being present at dojo)
    const sessions = statistics?.total_practice_sessions || 0;
    virtueScores["Attention"] += Math.min(sessions, 50); // Cap at 50
    
    // Bienveillance grows with helping others (approximated by total techniques)
    const totalTechniques = points.learningCount + points.practicedCount + points.masteredCount;
    virtueScores["Bienveillance"] += Math.floor(totalTechniques / 5);
    
    // Responsabilité grows with higher belt levels
    virtueScores["Responsabilité"] += (currentBelt?.order || 0) * 3;
    
    // Respect is foundational - grows with everything
    virtueScores["Respect"] += Math.floor((points.total) / 10) + 5;
    
    // Convert to array format for pie chart
    return AIKIDO_VIRTUES.map(virtue => ({
      ...virtue,
      value: virtueScores[virtue.name] || 0
    })).filter(v => v.value > 0);
  };

  const virtueData = calculateVirtues();
  const totalVirtuePoints = virtueData.reduce((sum, v) => sum + v.value, 0);

  // Trophies/Badges based on points and achievements
  const getTrophies = () => {
    const trophies = [];
    
    // Points-based trophies (now includes belt points)
    if (points.total >= 10) trophies.push({ icon: "🌟", name: "Première Étoile", desc: "10 points atteints", unlocked: true });
    if (points.total >= 25) trophies.push({ icon: "⭐", name: "Étoile Montante", desc: "25 points atteints", unlocked: true });
    if (points.total >= 50) trophies.push({ icon: "🌟", name: "Constellation", desc: "50 points atteints", unlocked: true });
    if (points.total >= 100) trophies.push({ icon: "💫", name: "Galaxie", desc: "100 points atteints", unlocked: true });
    if (points.total >= 200) trophies.push({ icon: "🌌", name: "Univers", desc: "200 points atteints", unlocked: true });
    
    // Mastery-based trophies
    if (points.masteredCount >= 1) trophies.push({ icon: "🎯", name: "Première Maîtrise", desc: "1 technique maîtrisée", unlocked: true });
    if (points.masteredCount >= 5) trophies.push({ icon: "🏅", name: "Apprenti Confirmé", desc: "5 techniques maîtrisées", unlocked: true });
    if (points.masteredCount >= 10) trophies.push({ icon: "🥉", name: "Pratiquant Bronze", desc: "10 techniques maîtrisées", unlocked: true });
    if (points.masteredCount >= 25) trophies.push({ icon: "🥈", name: "Pratiquant Argent", desc: "25 techniques maîtrisées", unlocked: true });
    if (points.masteredCount >= 50) trophies.push({ icon: "🥇", name: "Pratiquant Or", desc: "50 techniques maîtrisées", unlocked: true });
    if (points.masteredCount >= 100) trophies.push({ icon: "🏆", name: "Maître Technique", desc: "100 techniques maîtrisées", unlocked: true });
    
    // Learning-based trophies
    if (points.learningCount >= 5) trophies.push({ icon: "📚", name: "Curieux", desc: "5 techniques en apprentissage", unlocked: true });
    if (points.learningCount >= 15) trophies.push({ icon: "🎓", name: "Étudiant Assidu", desc: "15 techniques en apprentissage", unlocked: true });
    
    // Session-based trophies
    const totalSessions = statistics.total_practice_sessions || 0;
    if (totalSessions >= 10) trophies.push({ icon: "🔥", name: "Flamme Naissante", desc: "10 séances au dojo", unlocked: true });
    if (totalSessions >= 50) trophies.push({ icon: "🔥", name: "Feu Ardent", desc: "50 séances au dojo", unlocked: true });
    if (totalSessions >= 100) trophies.push({ icon: "🌋", name: "Volcan", desc: "100 séances au dojo", unlocked: true });
    
    // Belt-based trophies
    const beltOrder = currentBelt?.order || 0;
    if (beltOrder >= 1) trophies.push({ icon: "🟡", name: "Ceinture Jaune", desc: "5e kyu atteint", unlocked: true });
    if (beltOrder >= 2) trophies.push({ icon: "🟠", name: "Ceinture Orange", desc: "4e kyu atteint", unlocked: true });
    if (beltOrder >= 3) trophies.push({ icon: "🟢", name: "Ceinture Verte", desc: "3e kyu atteint", unlocked: true });
    if (beltOrder >= 4) trophies.push({ icon: "🔵", name: "Ceinture Bleue", desc: "2e kyu atteint", unlocked: true });
    if (beltOrder >= 5) trophies.push({ icon: "🟤", name: "Ceinture Marron", desc: "1er kyu atteint", unlocked: true });
    if (beltOrder >= 6) trophies.push({ icon: "⚫", name: "Ceinture Noire", desc: "Shodan atteint", unlocked: true });
    
    // Add locked trophies for motivation
    const lockedTrophies = [];
    if (points.total < 10) lockedTrophies.push({ icon: "🔒", name: "Première Étoile", desc: "10 points requis", unlocked: false });
    if (points.total < 50 && points.total >= 10) lockedTrophies.push({ icon: "🔒", name: "Constellation", desc: "50 points requis", unlocked: false });
    if (points.masteredCount < 10 && points.masteredCount >= 1) lockedTrophies.push({ icon: "🔒", name: "Pratiquant Bronze", desc: "10 techniques maîtrisées requises", unlocked: false });
    
    return { unlocked: trophies, locked: lockedTrophies.slice(0, 3) };
  };

  const trophies = getTrophies();

  // Handle belt change by user
  const handleBeltChange = (newBeltLevel) => {
    if (onBeltChange) {
      onBeltChange(newBeltLevel);
    }
    setShowBeltDialog(false);
  };

  if (!statistics) return null;

  const generatePDFBase64 = async () => {
    const { jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = 20;

    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('AIKIDO LA RIVIÈRE', pageWidth / 2, 18, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Techniques Aikido', pageWidth / 2, 26, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SUIVI DE PROGRESSION', pageWidth / 2, 38, { align: 'center' });
    
    yPos = 55;
    
    const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Document généré le ${today}`, pageWidth - margin, yPos, { align: 'right' });
    
    yPos += 10;

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'F');
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('RÉSUMÉ GLOBAL', margin + 5, yPos + 8);
    
    const statsData = [
      { label: 'Techniques', value: statistics.total_techniques, color: [100, 116, 139] },
      { label: 'Progression', value: statistics.mastered_techniques, color: [34, 197, 94] },
      { label: 'En cours', value: statistics.in_progress_techniques, color: [245, 158, 11] },
      { label: 'Sessions', value: statistics.total_practice_sessions, color: [239, 68, 68] },
      { label: 'Progression', value: `${statistics.overall_progress}%`, color: [6, 182, 212] }
    ];
    
    const boxWidth = (pageWidth - 2 * margin - 40) / 5;
    statsData.forEach((stat, idx) => {
      const xPos = margin + 5 + idx * (boxWidth + 5);
      doc.setFillColor(...stat.color);
      doc.roundedRect(xPos, yPos + 12, boxWidth, 18, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(String(stat.value), xPos + boxWidth / 2, yPos + 22, { align: 'center' });
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(stat.label, xPos + boxWidth / 2, yPos + 27, { align: 'center' });
    });
    
    yPos += 45;

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PROGRESSION PAR GRADE', margin, yPos);
    yPos += 8;

    kyuLevels.forEach((kyu) => {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }

      const masteredCount = kyu.techniques.filter(t => t.mastery_level === 'mastered').length;
      const progressPercent = kyu.techniques.length > 0 
        ? Math.round((masteredCount / kyu.techniques.length) * 100) 
        : 0;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text(kyu.name, margin, yPos + 4);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`${masteredCount}/${kyu.techniques.length} (${progressPercent}%)`, pageWidth - margin, yPos + 4, { align: 'right' });
      
      const barX = margin + 35;
      const barWidth = pageWidth - 2 * margin - 70;
      const barHeight = 6;
      
      doc.setFillColor(226, 232, 240);
      doc.roundedRect(barX, yPos, barWidth, barHeight, 2, 2, 'F');
      
      if (progressPercent > 0) {
        let r = 34, g = 197, b = 94;
        if (kyu.color) {
          const hex = kyu.color.replace('#', '');
          r = parseInt(hex.substr(0, 2), 16);
          g = parseInt(hex.substr(2, 2), 16);
          b = parseInt(hex.substr(4, 2), 16);
        }
        doc.setFillColor(r, g, b);
        doc.roundedRect(barX, yPos, barWidth * (progressPercent / 100), barHeight, 2, 2, 'F');
      }
      
      yPos += 12;
    });

    yPos += 10;

    doc.addPage();
    yPos = 20;
    
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DÉTAIL DES TECHNIQUES', pageWidth / 2, 15, { align: 'center' });
    
    yPos = 35;

    kyuLevels.forEach((kyu) => {
      if (yPos > pageHeight - 50) {
        doc.addPage();
        yPos = 20;
      }

      const masteredCount = kyu.techniques.filter(t => t.mastery_level === 'mastered').length;
      const progressPercent = kyu.techniques.length > 0 
        ? Math.round((masteredCount / kyu.techniques.length) * 100) 
        : 0;

      doc.setFillColor(51, 65, 85);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${kyu.name} - ${masteredCount}/${kyu.techniques.length} maîtrisées (${progressPercent}%)`, margin + 3, yPos + 6);
      
      yPos += 12;

      const tableData = kyu.techniques.map((tech, idx) => {
        const masteryLabels = {
          'not_started': '○ Non commencé',
          'learning': '◐ En apprentissage', 
          'practiced': '◑ Pratiqué',
          'mastered': '● Maîtrisé'
        };
        return [
          (idx + 1).toString(),
          tech.name,
          masteryLabels[tech.mastery_level] || '○ Non commencé',
          (tech.practice_count || 0).toString()
        ];
      });

      autoTable(doc, {
        startY: yPos,
        head: [['#', 'Technique', 'Niveau', 'Sessions']],
        body: tableData,
        margin: { left: margin, right: margin },
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [100, 116, 139], textColor: 255 },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 35 },
          3: { cellWidth: 18 }
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        didDrawPage: function(data) {
          yPos = data.cursor.y;
        }
      });
      
      yPos = doc.lastAutoTable.finalY + 10;
    });

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Techniques Aikido - © humanknowledge.fr', pageWidth / 2, pageHeight - 10, { align: 'center' });

    return doc.output('datauristring');
  };
  
  const handleDownloadPDF = async () => {
    if (!kyuLevels || kyuLevels.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    setSending(true);
    toast.info("Génération du PDF en cours...");

    try {
      const pdfBase64 = await generatePDFBase64();
      const today = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
      
      // Convert base64 to blob and download
      const byteCharacters = atob(pdfBase64.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `progression_aikido_${today}.pdf`;
      link.click();
      
      toast.success("PDF téléchargé avec succès !");
      setShowEmailDialog(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setSending(false);
    }
  };

  const exportToCSV = () => {
    if (!kyuLevels || kyuLevels.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    const today = new Date().toLocaleDateString('fr-FR');
    let csvContent = "Grade,Technique,Description,Niveau de Maîtrise,Sessions de Pratique,Dernière Pratique\n";
    
    kyuLevels.forEach(kyu => {
      kyu.techniques.forEach(tech => {
        const masteryLabels = {
          'not_started': 'Non commencé',
          'learning': 'En apprentissage', 
          'practiced': 'Pratiqué',
          'mastered': 'Maîtrisé'
        };
        const mastery = masteryLabels[tech.mastery_level] || 'Non commencé';
        const sessions = tech.practice_count || 0;
        const lastPractice = tech.last_practiced ? new Date(tech.last_practiced).toLocaleDateString('fr-FR') : 'Jamais';
        const description = (tech.description || '').replace(/,/g, ';').replace(/\n/g, ' ');
        
        csvContent += `"${kyu.name}","${tech.name}","${description}","${mastery}",${sessions},"${lastPractice}"\n`;
      });
    });

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `progression_aikido_${today.replace(/\//g, '-')}.csv`;
    link.click();
    
    toast.success("Progression exportée avec succès !");
  };

  return (
    <>
      <div className="mb-8 animate-fadeIn">
        {/* ========== HERO SECTION - DIFFÉRENT SI CONNECTÉ OU NON ========== */}
        {!isAdmin && (
          <div className="mb-8 md:mb-12 w-full">
            
            {/* ===== HERO POUR UTILISATEUR NON CONNECTÉ ===== */}
            {!isAuthenticated && (
              <>
                {/* Écran de sélection du mode (si pas encore choisi) */}
                {!visitorMode && (
                  <AgeSelector onSelect={handleModeChange} />
                )}

                {/* Contenu après sélection du mode */}
                {visitorMode && (
                  <>
                    {/* Hero Banner - Version responsive */}
                    {/* Sur mobile: landing page commerciale claire, sur desktop: rectangle avec gradient */}
                    <div className="relative overflow-hidden mb-4 sm:mb-6">
                      {/* Version MOBILE - Landing page commerciale */}
                      <div className="block sm:hidden">
                        {/* Header commercial avec gradient subtil */}
                        <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl mx-2 p-6 border border-slate-700/50">
                          
                          {/* Bouton changer de mode */}
                          <button
                            onClick={handleResetMode}
                            className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-700/50"
                            title="Changer de mode"
                          >
                            <Settings className="w-4 h-4" />
                          </button>

                          {/* Logo et titre */}
                          <div className="text-center mb-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 mb-3">
                              <span className="text-3xl">🥋</span>
                            </div>
                            <h1 className="text-2xl font-black text-white">
                              Aikido@Game
                            </h1>
                            <p className="text-amber-400 text-sm font-medium mt-1">
                              {visitorMode === 'enfant' ? 'Édition Jeune Ninja' : 'Édition Confirmé'}
                            </p>
                          </div>

                          {/* Proposition de valeur */}
                          <div className="text-center mb-5">
                            <p className="text-white text-base font-semibold mb-2">
                              {visitorMode === 'enfant' 
                                ? 'Apprends l\'Aikido en t\'amusant !' 
                                : 'Progressez dans votre pratique'}
                            </p>
                            <p className="text-slate-400 text-sm">
                              {visitorMode === 'enfant' 
                                ? 'Gagne des points, débloque des niveaux et deviens un vrai Ninja !' 
                                : 'Suivez votre progression, maîtrisez les techniques, atteignez vos objectifs.'}
                            </p>
                          </div>

                          {/* Points clés - version compacte */}
                          <div className="grid grid-cols-3 gap-2 mb-5">
                            <div className="text-center p-2 bg-slate-800/50 rounded-xl">
                              <span className="text-lg">📊</span>
                              <p className="text-[10px] text-slate-400 mt-1">Progression</p>
                            </div>
                            <div className="text-center p-2 bg-slate-800/50 rounded-xl">
                              <span className="text-lg">🎯</span>
                              <p className="text-[10px] text-slate-400 mt-1">Défis</p>
                            </div>
                            <div className="text-center p-2 bg-slate-800/50 rounded-xl">
                              <span className="text-lg">🏆</span>
                              <p className="text-[10px] text-slate-400 mt-1">Récompenses</p>
                            </div>
                          </div>

                          {/* CTA Principal */}
                          <Button
                            onClick={() => {
                              const event = new CustomEvent('openAuthDialog');
                              window.dispatchEvent(event);
                            }}
                            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-900 font-bold py-4 rounded-xl text-base shadow-lg shadow-amber-500/30 mb-3"
                          >
                            {visitorMode === 'enfant' ? '🚀 Commencer l\'aventure' : '📝 Créer mon compte gratuit'}
                          </Button>

                          {/* CTA Secondaire */}
                          <Button
                            variant="ghost"
                            onClick={() => {
                              const event = new CustomEvent('openLoginDialog');
                              window.dispatchEvent(event);
                            }}
                            className="w-full text-slate-400 hover:text-white hover:bg-slate-700/50 font-medium py-3 rounded-xl text-sm"
                          >
                            Déjà inscrit ? Se connecter
                          </Button>

                          {/* Badge de confiance */}
                          <p className="text-center text-slate-500 text-[10px] mt-3">
                            ✓ Gratuit • ✓ Sans engagement • ✓ Conforme RGPD
                          </p>
                        </div>
                      </div>

                      {/* Version DESKTOP - rectangle avec gradient et personnages */}
                      <div className="hidden sm:block relative overflow-hidden bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-orange-400/60">
                        
                        {/* Femme à gauche - taille +10%, fondu progressif vers le centre */}
                        <div className="absolute left-0 bottom-0 hidden md:block z-20 pointer-events-none overflow-hidden rounded-bl-3xl">
                          <img 
                            src={AIKIDO_CHARACTERS.FEMME_SEULE} 
                            alt="Sensei Femme" 
                            className="h-44 lg:h-52 xl:h-60 object-cover object-top"
                            style={{
                              maskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
                              WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)'
                            }}
                          />
                        </div>
                        
                        {/* Homme à droite - taille +10%, fondu progressif vers le centre */}
                        <div className="absolute right-0 bottom-0 hidden md:block z-20 pointer-events-none overflow-hidden rounded-br-3xl">
                          <img 
                            src={AIKIDO_CHARACTERS.HOMME_SEUL} 
                            alt="Sensei Homme" 
                            className="h-44 lg:h-52 xl:h-60 object-cover object-top"
                            style={{
                              maskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
                              WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)'
                            }}
                          />
                        </div>
                        
                        {/* Idéogrammes japonais en arrière-plan */}
                        <div className="absolute inset-0 overflow-hidden opacity-[0.06] pointer-events-none select-none">
                          <div 
                            className="absolute inset-0 text-white font-serif whitespace-nowrap"
                            style={{ 
                              fontFamily: "'Noto Serif JP', serif",
                              fontSize: '4rem',
                              lineHeight: '1.2',
                              letterSpacing: '0.5rem'
                            }}
                          >
                            <div className="absolute top-0 left-0 transform -rotate-12">
                              合気道 武道 氣 和 心 道 技 礼 仁 義
                            </div>
                            <div className="absolute bottom-0 right-10 transform rotate-6">
                              武士道 精神 修行 稽古 先生 道場
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative text-center z-10">
                          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                            Aikido@Game
                          </h1>
                          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-6">
                            {visitorMode === 'enfant' 
                              ? <><strong>Deviens un vrai Ninja !</strong> Apprends l'Aikido en t'amusant 🎮</>
                              : <><strong>Développez votre maîtrise de l'Aikido</strong> avec un entraînement structuré</>
                            }
                          </p>
                          <div className="flex flex-wrap gap-3 justify-center">
                            <Button
                              onClick={() => {
                                const event = new CustomEvent('openAuthDialog');
                                window.dispatchEvent(event);
                              }}
                              className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-6 py-3 rounded-xl text-lg shadow-lg"
                            >
                              {visitorMode === 'enfant' ? '🥷 Créer mon compte Ninja' : '📝 S\'inscrire gratuitement'}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                const event = new CustomEvent('openLoginDialog');
                                window.dispatchEvent(event);
                              }}
                              className="border-2 border-white text-white hover:bg-white/20 font-bold px-6 py-3 rounded-xl text-lg"
                            >
                              Se connecter
                            </Button>
                          </div>
                        </div>

                        {/* Bouton changer de mode - desktop */}
                        <button
                          onClick={handleResetMode}
                          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                          title="Changer de mode"
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Blocs d'étapes selon le mode */}
                    <VisitorStepsBlocks mode={visitorMode} onStepClick={onNavigate} />
                  </>
                )}
              </>
            )}

            {/* ===== ÉCRAN DE BIENVENUE POUR UTILISATEUR CONNECTÉ - CARTES FLOTTANTES ===== */}
            {isAuthenticated && (
              <>
                {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
                {/* SECTION 1 : NAVIGATION RAPIDE - Blocs carrés colorés */}
                {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
                <section className="mb-8" data-testid="section-navigation">
                  <AppStepsNavigation />
                </section>

                {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
                {/* SECTION 2 : MON PROFIL - Carte de bienvenue avec stats */}
                {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
                <section className="mb-6 sm:mb-8 relative" data-testid="section-profil">
                  {/* Titre de section */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="h-0.5 sm:h-1 flex-1 bg-gradient-to-r from-transparent via-emerald-500 to-emerald-500 rounded-full" />
                    <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                      <span className="text-xl sm:text-2xl">🥷</span>
                      <span className="hidden xs:inline">Mon </span>Profil Ninja
                    </h2>
                    <div className="h-0.5 sm:h-1 flex-1 bg-gradient-to-l from-transparent via-emerald-500 to-emerald-500 rounded-full" />
                  </div>
                  
                  {/* Bouton d'aide */}
                  <div className="absolute top-0 right-0">
                    <Button
                      onClick={() => setShowGuidedTour(true)}
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white hover:bg-slate-800 gap-1 sm:gap-2 h-8 px-2 sm:px-3"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Aide</span>
                    </Button>
                  </div>

                  <UserDashboardBlocks 
                    userName={userName}
                    statistics={statistics}
                    currentBelt={getBeltByPoints(statistics.total_points || 0)}
                    totalPoints={statistics.total_points || 0}
                    onOpenTimeline={() => setIsTimelinePanelOpen(true)}
                    onOpenJournal={() => setIsJournalPanelOpen(true)}
                    onDownloadPDF={handleDownloadPDF}
                    onDownloadCSV={exportToCSV}
                  />
                </section>

                {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
                {/* SECTION 3 : DÉFIS DU JOUR - Tunnel de progression (gagne des points !) */}
                {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
                <section id="section-points" className="mb-6 sm:mb-8" data-testid="section-defis">
                  {/* Titre de section */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="h-0.5 sm:h-1 flex-1 bg-gradient-to-r from-transparent via-pink-500 to-pink-500 rounded-full" />
                    <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                      <span className="text-xl sm:text-2xl">🎯</span>
                      <span className="hidden xs:inline">Mes </span>Défis du Jour
                    </h2>
                    <div className="h-0.5 sm:h-1 flex-1 bg-gradient-to-l from-transparent via-pink-500 to-pink-500 rounded-full" />
                  </div>

                  <ProgressionTunnel
                    currentBelt={getBeltByPoints(statistics.total_points || 0)}
                    statistics={statistics}
                    virtueData={virtueData}
                    userName={userName}
                    userId={userId}
                    isAuthenticated={isAuthenticated}
                    onRefreshStats={onRefreshData}
                    onCompleteChallenge={(challenge) => {
                      console.log("Challenge completed:", challenge);
                      onRefreshData?.();
                    }}
                    onRequestParentValidation={(challenge) => {
                      console.log("Parent validation requested:", challenge);
                    }}
                  />
                </section>

                {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
                {/* SECTION 4 : ESPACE PARENT - Validation des défis des enfants */}
                {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
                <section className="mb-6 sm:mb-8" data-testid="section-parent">
                  {/* Titre de section */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="h-0.5 sm:h-1 flex-1 bg-gradient-to-r from-purple-500 via-purple-500 to-transparent rounded-full" />
                    <h2 className="text-base sm:text-lg font-black text-white whitespace-nowrap flex items-center gap-2">
                      <span className="text-lg sm:text-xl">👨‍👩‍👧</span>
                      <span className="hidden xs:inline">Espace </span>Parent
                    </h2>
                    <div className="h-0.5 sm:h-1 flex-1 bg-gradient-to-l from-transparent via-purple-500 to-purple-500 rounded-full" />
                  </div>

                  <ParentDashboard
                    isAuthenticated={isAuthenticated}
                    onRefreshData={onRefreshData}
                  />
                </section>
              </>
            )}

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
        {/* ACCORDÉON 1 : Ma Progression Ninja + Stats + Grades KYU */}
        {/* MASQUÉ pour tous les visiteurs - page d'accueil épurée avec 6 blocs uniquement */}
        {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
        {false && (
        <SimpleAccordion
          title="Ma Progression Ninja !"
          emoji="🎯"
          subtitle="Stats & Grades KYU"
          headerGradient="from-indigo-600 via-purple-600 to-pink-600"
          defaultOpen={true}
          testId="accordion-progression"
        >
          <div id="bloc1-progression" className="bg-gradient-to-br from-indigo-900/60 via-purple-900/60 to-pink-900/60 rounded-b-2xl border-2 border-t-0 border-purple-500/40 p-4 md:p-6 shadow-xl">
            
            {/* EN HAUT : Titre Ma Progression Ninja + boutons */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="text-4xl animate-bounce">🎯</div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    Ma Progression Ninja ! 🥷
                  </h3>
                  <p className="text-purple-300 text-xs md:text-sm">Tableau de bord général</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error("🔒 Inscrivez-vous pour télécharger votre progression en PDF");
                      return;
                    }
                    setShowEmailDialog(true);
                  }}
                  className={`bg-gradient-to-r from-cyan-600 to-blue-600 border-none text-white hover:from-cyan-500 hover:to-blue-500 h-8 text-xs font-bold shadow-lg shadow-cyan-500/30 ${!isAuthenticated ? 'opacity-50' : ''}`}
                >
                  <Download className="w-3 h-3 mr-1" />
                  📄 PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error("🔒 Inscrivez-vous pour télécharger votre progression en CSV");
                      return;
                    }
                    exportToCSV();
                  }}
                  className={`bg-gradient-to-r from-green-600 to-emerald-600 border-none text-white hover:from-green-500 hover:to-emerald-500 h-8 text-xs font-bold shadow-lg shadow-green-500/30 ${!isAuthenticated ? 'opacity-50' : ''}`}
                >
                  <Download className="w-3 h-3 mr-1" />
                  📊 CSV
                </Button>
              </div>
            </div>

            {/* AU MILIEU : Statistiques (8 cartes sur 2 lignes) */}
            {/* LIGNE 1 : Statistiques générales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="bg-gradient-to-br from-indigo-500/30 to-indigo-600/30 border border-indigo-500/40 rounded-xl p-4 text-center hover:scale-105 transition-all cursor-pointer">
                <div className="text-2xl mb-1">📚</div>
                <p className="text-2xl font-bold text-indigo-300">{statistics.total_techniques}</p>
                <p className="text-sm text-slate-400">Techniques</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 border border-emerald-500/40 rounded-xl p-4 text-center hover:scale-105 transition-all cursor-pointer">
                <div className="text-2xl mb-1">🎯</div>
                <p className="text-2xl font-bold text-emerald-300">10</p>
                <p className="text-sm text-slate-400">Niveaux</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500/30 to-amber-600/30 border border-amber-500/40 rounded-xl p-4 text-center hover:scale-105 transition-all cursor-pointer">
                <div className="text-2xl mb-1">🏆</div>
                <p className="text-2xl font-bold text-amber-300">15</p>
                <p className="text-sm text-slate-400">Trophées</p>
              </div>
              <div className="bg-gradient-to-br from-pink-500/30 to-pink-600/30 border border-pink-500/40 rounded-xl p-4 text-center hover:scale-105 transition-all cursor-pointer">
                <div className="text-2xl mb-1">☯️</div>
                <p className="text-2xl font-bold text-pink-300">7</p>
                <p className="text-sm text-slate-400">Vertus</p>
              </div>
            </div>

            {/* LIGNE 2 : Progression personnelle */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl p-4 text-center hover:scale-105 transition-all cursor-pointer">
                <div className="text-2xl mb-1">🏆</div>
                <p className="text-2xl font-bold text-white">{statistics.mastered_techniques}</p>
                <p className="text-sm text-emerald-100">Progression</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-center hover:scale-105 transition-all cursor-pointer">
                <div className="text-2xl mb-1">🔥</div>
                <p className="text-2xl font-bold text-white">{statistics.in_progress_techniques}</p>
                <p className="text-sm text-amber-100">En cours</p>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-4 text-center hover:scale-105 transition-all cursor-pointer">
                <div className="text-2xl mb-1">⭐</div>
                <p className="text-2xl font-bold text-white">{statistics.total_practice_sessions}</p>
                <p className="text-sm text-pink-100">Sessions</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-600 to-teal-700 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">📈</div>
                <p className="text-2xl font-bold text-white">{statistics.overall_progress}%</p>
                <p className="text-sm text-cyan-100">Progression</p>
                <div className="mt-2 h-2 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white/80 rounded-full transition-all"
                    style={{ width: `${statistics.overall_progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* EN BAS : Grades KYU (badges colorés) */}
            <div className="pt-4 border-t border-purple-500/30">
              <h4 className="text-white font-bold text-lg mb-4">📋 Grades KYU</h4>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <span className="bg-yellow-400 text-slate-900 px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-all cursor-pointer">5e KYU</span>
                <span className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-all cursor-pointer">4e KYU</span>
                <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-all cursor-pointer">3e KYU</span>
                <span className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-all cursor-pointer">2e KYU</span>
                <span className="bg-amber-700 text-white px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-all cursor-pointer">1er KYU</span>
                <span className="bg-slate-800 text-white px-4 py-2 rounded-full font-bold text-sm border-2 border-slate-600 hover:scale-105 transition-all cursor-pointer">SHODAN</span>
              </div>
            </div>

            {/* Section Prochaine Étape (intégrée en bas) */}
            <div className="mt-6 pt-4 border-t border-purple-500/30 bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-purple-500/20 rounded-xl p-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl animate-pulse">🎯</div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Prochaine étape</h3>
                    <p className="text-slate-300 text-xs">Continue ton parcours vers la maîtrise !</p>
                    <p className="text-purple-300 text-xs mt-1">
                      Commence par le <strong className="text-yellow-400">5e KYU</strong> - Clique sur un grade ci-dessus !
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.error("🔒 Inscrivez-vous pour télécharger");
                        return;
                      }
                      setShowEmailDialog(true);
                    }}
                    className={`bg-gradient-to-r from-cyan-600 to-blue-600 border-none text-white hover:from-cyan-500 hover:to-blue-500 text-xs h-8 ${!isAuthenticated ? 'opacity-50' : ''}`}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.error("🔒 Inscrivez-vous pour exporter");
                        return;
                      }
                      exportToCSV();
                    }}
                    className={`bg-gradient-to-r from-emerald-600 to-green-600 border-none text-white hover:from-emerald-500 hover:to-green-500 text-xs h-8 ${!isAuthenticated ? 'opacity-50' : ''}`}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTimelinePanel(true)}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 border-none text-white hover:from-amber-500 hover:to-orange-500 text-xs h-8"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Timeline
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowJournalPanel(true)}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 border-none text-white hover:from-violet-500 hover:to-purple-500 text-xs h-8"
                  >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Journal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SimpleAccordion>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
        {/* SECTION 4 : CONTENU PÉDAGOGIQUE - Accordéons */}
        {/* VISIBLE UNIQUEMENT POUR LES UTILISATEURS CONNECTÉS */}
        {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
        
        {isAuthenticated && (
          <>
            {/* Titre de section pour utilisateurs connectés */}
            <section className="mb-4 sm:mb-6 mt-2 sm:mt-4" data-testid="section-pedagogique">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                <div className="h-0.5 sm:h-1 flex-1 bg-gradient-to-r from-transparent via-cyan-500 to-cyan-500 rounded-full" />
                <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                  <span className="text-xl sm:text-2xl">📚</span>
                  Apprendre l'Aikido
                </h2>
                <div className="h-0.5 sm:h-1 flex-1 bg-gradient-to-l from-transparent via-cyan-500 to-cyan-500 rounded-full" />
              </div>
              <p className="text-center text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4">
                Explore les techniques, les vertus et l'histoire 🥋
              </p>
            </section>

            {/* ACCORDÉON 2 : Entrainement + Grades détaillés */}
            <SimpleAccordion
          title="Entrainement - Techniques d'Aikido"
          emoji="🥋"
          subtitle="Parcours & Déplacements"
          headerGradient="from-cyan-600 via-blue-600 to-indigo-600"
          defaultOpen={true}
          testId="accordion-entrainement"
        >
          <div id="bloc2-entrainement" className="bg-gradient-to-br from-cyan-900/40 via-blue-900/40 to-indigo-900/40 rounded-b-2xl border-2 border-t-0 border-cyan-500/40 p-4 md:p-6 shadow-xl">
            
            {/* EN HAUT : Titre Entrainement */}
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">🥋</div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-cyan-400">
                  Entrainement - Techniques d&apos;Aikido
                </h2>
                <p className="text-slate-400 text-sm">Les ceintures, ton parcours et les déplacements</p>
              </div>
            </div>

            {/* Section Mon Parcours Aïkido - Version ludique pour enfants */}
            {currentBelt && (
              <div id="section-techniques-maitrisees">
                <BeltProgressCard 
                  currentBelt={currentBelt}
                  totalPoints={statistics.total_points || 0}
                  onBeltClick={() => setShowBeltDialog(true)}
                />
              </div>
            )}

            {/* Grade Cards Grid (détails des techniques par niveau) - Section Dojo */}
            <div id="section-techniques-dojo">
              <GradeCardsGrid 
                techniquesByLevel={statistics.techniques_by_level}
                onGradeClick={onGradeClick}
              />
            </div>

          {/* Section Déplacements - Techniques en cours */}
          <div id="section-techniques-encours">
            <DeplacementsSection />
          </div>

          {/* Fun footer message */}
          <div className="mt-6 text-center">
            <p className="text-cyan-300 text-sm">
              🌟 Continue à t&apos;entraîner pour débloquer tous les grades ! 🌟
            </p>
            <div className="flex justify-center gap-2 mt-2 text-2xl">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🥋</span>
              <span className="animate-bounce" style={{ animationDelay: '100ms' }}>💪</span>
              <span className="animate-bounce" style={{ animationDelay: '200ms' }}>⭐</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>🎯</span>
              <span className="animate-bounce" style={{ animationDelay: '400ms' }}>🔥</span>
            </div>
          </div>
          </div>
        </SimpleAccordion>

        {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
        {/* ACCORDÉON 3 : LES VALEURS DE L'AIKIDO - Version ludique enfant */}
        {/* Visible pour tous (visiteurs et utilisateurs connectés) */}
        {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
        {currentBelt && (
          <SimpleAccordion
            title="Les Super-Pouvoirs Ninja !"
            emoji="☯️"
            subtitle="7 Vertus & Trophées"
            headerGradient="from-violet-600 via-purple-600 to-fuchsia-600"
            defaultOpen={true}
            testId="accordion-valeurs"
          >
          <div id="bloc3-valeurs" className="bg-gradient-to-br from-violet-900/40 via-purple-900/40 to-indigo-900/40 rounded-b-2xl border-2 border-t-0 border-violet-500/40 p-4 md:p-6 shadow-xl">
            <VirtuesSection
              virtueData={virtueData}
              totalPoints={points.total}
              trophies={trophies}
              statistics={statistics}
              currentBelt={currentBelt}
              onOpenVirtueActions={() => setShowVirtueActionsPanel(true)}
              onOpenVirtuesDialog={() => setShowVirtuesDialog(true)}
              onOpenTrophiesDialog={() => setShowTrophiesDialog(true)}
            />
          </div>
        </SimpleAccordion>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
        {/* ACCORDÉON 4 : HISTOIRE DE L'AIKIDO - Les Sept Plis du Hakama */}
        {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
        <SimpleAccordion
          title="Histoire de l'Aikido"
          emoji="📜"
          subtitle="Hakama & O Sensei"
          headerGradient="from-amber-600 via-orange-600 to-yellow-600"
          defaultOpen={true}
          testId="accordion-histoire"
        >
          <div id="bloc4-histoire" className="bg-gradient-to-br from-amber-900/30 via-slate-900/40 to-amber-900/30 rounded-b-2xl border-2 border-t-0 border-amber-500/40 p-4 md:p-6 shadow-xl">
            <HakamaHistory />
          </div>
        </SimpleAccordion>
          </>
        )}

        {/* Trophies Dialog */}
        <Dialog open={showTrophiesDialog} onOpenChange={setShowTrophiesDialog}>
          <DialogContent className="max-w-lg bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2 text-amber-400">
                🏆 Mes Trophées & Badges
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Tu as débloqué {trophies.unlocked.length} trophée{trophies.unlocked.length > 1 ? 's' : ''} !
              </DialogDescription>
            </DialogHeader>
            
            {/* Points summary with belt */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 rounded-xl border border-purple-500/30 mb-4">
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  {points.total} Points
                </p>
                <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
                  <span className="text-amber-300">📖 {points.learning}pts</span>
                  <span className="text-blue-300">🎯 {points.practiced}pts</span>
                  <span className="text-emerald-300">🏆 {points.mastered}pts</span>
                  <span className="text-yellow-300">{currentBelt.emoji} {points.belt}pts</span>
                </div>
              </div>
            </div>
            
            {/* Unlocked trophies */}
            {trophies.unlocked.length > 0 && (
              <div className="mb-4">
                <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                  ✅ Trophées débloqués ({trophies.unlocked.length})
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {trophies.unlocked.map((trophy, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-emerald-900/20 rounded-lg border border-emerald-500/30"
                    >
                      <span className="text-3xl">{trophy.icon}</span>
                      <div>
                        <p className="text-white font-bold">{trophy.name}</p>
                        <p className="text-emerald-300 text-xs">{trophy.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Locked trophies (next to unlock) */}
            {trophies.locked.length > 0 && (
              <div>
                <h4 className="text-slate-400 font-semibold mb-3 flex items-center gap-2">
                  🔒 Prochains trophées à débloquer
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {trophies.locked.map((trophy, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700 opacity-60"
                    >
                      <span className="text-3xl">{trophy.icon}</span>
                      <div>
                        <p className="text-slate-300 font-bold">{trophy.name}</p>
                        <p className="text-slate-500 text-xs">{trophy.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {trophies.unlocked.length === 0 && trophies.locked.length === 0 && (
              <p className="text-center text-slate-400 py-4">
                🌱 Continue à pratiquer pour débloquer tes premiers trophées !
              </p>
            )}
          </DialogContent>
        </Dialog>

        {/* Virtues Detail Dialog */}
        <Dialog open={showVirtuesDialog} onOpenChange={setShowVirtuesDialog}>
          <DialogContent className="max-w-lg bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2 text-indigo-400">
                🎯 Mes Vertus de l&apos;Aïkido
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Répartition de tes vertus travaillées sur ton parcours
              </DialogDescription>
            </DialogHeader>
            
            {/* Pie Chart */}
            <div className="flex justify-center py-4">
              {totalVirtuePoints > 0 ? (
                <VirtuePieChart virtueData={virtueData} />
              ) : (
                <p className="text-slate-400 text-center">Aucune donnée disponible</p>
              )}
            </div>
            
            {/* Virtue Details */}
            <div className="space-y-3 mt-4">
              <h4 className="text-slate-300 font-semibold mb-3">Détail des vertus :</h4>
              {virtueData.sort((a, b) => b.value - a.value).map((virtue, idx) => {
                const percent = totalVirtuePoints > 0 ? Math.round((virtue.value / totalVirtuePoints) * 100) : 0;
                return (
                  <div key={idx} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{virtue.emoji}</span>
                        <div>
                          <p className="text-white font-bold">{virtue.name}</p>
                          <p className="text-slate-500 text-xs">{virtue.kanji}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold" style={{ color: virtue.color }}>{virtue.value} pts</p>
                        <p className="text-slate-400 text-xs">{percent}%</p>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: virtue.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Explanation */}
            <div className="mt-6 bg-indigo-900/20 rounded-lg p-4 border border-indigo-500/30">
              <h4 className="text-indigo-300 font-semibold mb-2">Comment ça marche ?</h4>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• <strong>Humilité</strong> : Points des techniques en apprentissage</li>
                <li>• <strong>Persévérance</strong> : Points des techniques pratiquées</li>
                <li>• <strong>Maîtrise de soi</strong> : Points des techniques maîtrisées</li>
                <li>• <strong>Attention</strong> : Séances au dojo</li>
                <li>• <strong>Ceinture</strong> : Chaque grade renforce sa vertu associée</li>
                <li>• <strong>Rôle symbolique</strong> : Bonus pour la vertu du rôle</li>
              </ul>
            </div>
            
            <p className="text-center text-slate-500 text-xs mt-4 italic">
              Ce graphique nourrit ta réflexion personnelle et donne du sens à ta pratique.
              <br />Il reste strictement personnel. 🥋
            </p>
          </DialogContent>
        </Dialog>

        {/* Belt Selection Dialog */}
        <Dialog open={showBeltDialog} onOpenChange={setShowBeltDialog}>
          <DialogContent className="max-w-lg bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2 text-amber-400">
                🥋 Choisis ta Ceinture
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Clique sur ta ceinture actuelle pour enregistrer ton grade
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 py-4">
              {Object.entries(AIKIDO_BELTS).map(([key, belt]) => {
                const isCurrentBelt = userBelt === key;
                const isPassed = belt.order < (AIKIDO_BELTS[userBelt]?.order || 0);
                const beltPoints = (belt.order + 1) * 10; // 10 pts per grade level
                
                return (
                  <div 
                    key={key}
                    onClick={() => handleBeltChange(key)}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer hover:scale-[1.02] hover:shadow-lg ${
                      isCurrentBelt 
                        ? 'border-amber-500 bg-amber-900/30 ring-2 ring-amber-500/50' 
                        : isPassed 
                          ? 'border-emerald-500/50 bg-emerald-900/20 hover:border-emerald-400' 
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{belt.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white">{belt.name}</p>
                          {isCurrentBelt && <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full animate-pulse">✓ Actuelle</span>}
                          {isPassed && !isCurrentBelt && <span className="text-xs text-emerald-400">✓ Passée</span>}
                        </div>
                        <p className="text-slate-400 text-xs">{belt.grade}</p>
                        {belt.symbolicRole && (
                          <p className="text-purple-300 text-xs mt-1">
                            🎭 Rôle disponible : {belt.symbolicRole.name}
                          </p>
                        )}
                      </div>
                      {/* Points badge */}
                      <div className="flex flex-col items-end gap-1">
                        <div className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded-lg text-xs font-bold">
                          +{beltPoints} pts
                        </div>
                        {!isCurrentBelt && (
                          <span className="text-slate-500 text-[10px]">Sélectionner →</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-sm text-slate-300 text-center">
                🎌 <strong>Rappel :</strong> Indique ta ceinture actuelle obtenue au dojo.
                <br />Ta progression sera sauvegardée automatiquement.
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Admin block - Adhérents (adults + children) centered full width */}
        {membersStats && isAdmin && (
          <div className="flex justify-center mb-12 w-full">
            <Card 
              className="bg-gradient-to-br from-cyan-800 to-cyan-900 border-cyan-700 max-w-2xl w-full"
            >
              <CardContent className="px-8 py-6">
                <div className="flex items-center justify-center gap-8">
                  <div className="p-4 rounded-xl bg-cyan-700">
                    <Users className="w-10 h-10 text-cyan-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">{(membersStats.adult_members || 0) + (membersStats.total_children || 0)}</p>
                    <p className="text-lg text-cyan-300">Adhérents</p>
                    <p className="text-sm text-cyan-400/70 mt-1">
                      {membersStats.adult_members || 0} adultes • {membersStats.total_children || 0} enfants
                    </p>
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={() => onMembersClick && onMembersClick('adults')}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Gérer les inscriptions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* PDF Download Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Télécharger ma progression en PDF
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Obtenez votre suivi de progression détaillé.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-3 bg-cyan-900/30 border border-cyan-700 rounded-lg">
              <Download className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-sm text-white font-medium">PDF détaillé inclus</p>
                <p className="text-xs text-slate-400">Progression globale, techniques par grade, sessions de pratique</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowEmailDialog(false)}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Annuler
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={sending}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500"
            >
              {sending ? (
                <>Génération en cours...</>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Virtue Actions Panel */}
      <VirtueActionsPanel 
        isOpen={showVirtueActionsPanel}
        onClose={() => setShowVirtueActionsPanel(false)}
        isAuthenticated={isAuthenticated}
        onPointsUpdate={onRefreshData}
      />

      {/* Timeline Panel */}
      <TimelinePanel 
        isOpen={showTimelinePanel}
        onClose={() => setShowTimelinePanel(false)}
        isAuthenticated={isAuthenticated}
      />

      {/* Journal Panel */}
      <JournalPanel 
        isOpen={showJournalPanel}
        onClose={() => setShowJournalPanel(false)}
        isAuthenticated={isAuthenticated}
      />

      {/* Guided Tour - Tutoriel interactif */}
      <GuidedTour
        isOpen={showGuidedTour}
        onClose={() => setShowGuidedTour(false)}
        onComplete={() => {
          toast.success("🎉 Super ! Tu es prêt à commencer ton aventure !");
        }}
        userName={userName}
      />
    </>
  );
}

export default StatisticsDashboard;
