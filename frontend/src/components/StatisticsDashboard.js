import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, BarChart3, Users, FileText, Download, Award, Sparkles, Shield, Clock, BookOpen, FileDown } from "lucide-react";
import { toast } from "sonner";
import VirtueActionsPanel from "./VirtueActionsPanel";
import TimelinePanel from "./TimelinePanel";
import JournalPanel from "./JournalPanel";

// Aikido Belt System - Real grades with KYU equivalence
const AIKIDO_BELTS = {
  "6e_kyu": {
    name: "Ceinture Blanche",
    grade: "6e kyu",
    color: "#E5E7EB",
    gradient: "from-gray-100 to-gray-300",
    textColor: "text-gray-800",
    emoji: "⚪",
    order: 0,
    points: 0, // Starting belt = 0 points
    symbolicRole: null,
    associatedVirtue: "Humilité",
    message: "Bienvenue sur le chemin de l'Aïkido !"
  },
  "5e_kyu": {
    name: "Ceinture Jaune",
    grade: "5e kyu",
    color: "#FCD34D",
    gradient: "from-yellow-300 to-yellow-500",
    textColor: "text-yellow-900",
    emoji: "🟡",
    order: 1,
    points: 10, // 10 points for this belt
    symbolicRole: { name: "Gardien du respect", virtue: "Respect", intention: "Cadre (salut, soin du tatami, posture)" },
    associatedVirtue: "Respect",
    message: "Tu apprends les bases avec sérieux !"
  },
  "4e_kyu": {
    name: "Ceinture Orange",
    grade: "4e kyu",
    color: "#FB923C",
    gradient: "from-orange-400 to-orange-600",
    textColor: "text-orange-900",
    emoji: "🟠",
    order: 2,
    points: 20, // Cumulative: 10 + 10
    symbolicRole: { name: "Pilier de persévérance", virtue: "Persévérance", intention: "Continuité et encouragement" },
    associatedVirtue: "Persévérance",
    message: "Ton engagement grandit !"
  },
  "3e_kyu": {
    name: "Ceinture Verte",
    grade: "3e kyu",
    color: "#22C55E",
    gradient: "from-green-400 to-green-600",
    textColor: "text-green-900",
    emoji: "🟢",
    order: 3,
    points: 30, // Cumulative: 20 + 10
    symbolicRole: { name: "Médiateur du calme", virtue: "Maîtrise de soi", intention: "Régulation de l'intensité, écoute" },
    associatedVirtue: "Maîtrise de soi",
    message: "Tu te stabilises dans ta pratique !"
  },
  "2e_kyu": {
    name: "Ceinture Bleue",
    grade: "2e kyu",
    color: "#3B82F6",
    gradient: "from-blue-400 to-blue-600",
    textColor: "text-blue-100",
    emoji: "🔵",
    order: 4,
    points: 40, // Cumulative: 30 + 10
    symbolicRole: { name: "Soutien du dojo", virtue: "Bienveillance", intention: "Aide aux débutants, soutien logistique" },
    associatedVirtue: "Bienveillance",
    message: "Ta maturité se confirme !"
  },
  "1er_kyu": {
    name: "Ceinture Marron",
    grade: "1er kyu",
    color: "#92400E",
    gradient: "from-amber-700 to-amber-900",
    textColor: "text-amber-100",
    emoji: "🟤",
    order: 5,
    points: 50, // Cumulative: 40 + 10
    symbolicRole: { name: "Passeur de voie", virtue: "Transmission", intention: "Transmettre sans imposer" },
    associatedVirtue: "Responsabilité",
    message: "Tu es prêt à transmettre !"
  },
  "shodan": {
    name: "Ceinture Noire",
    grade: "Shodan (1er Dan)",
    color: "#1F2937",
    gradient: "from-gray-800 to-black",
    textColor: "text-white",
    emoji: "⚫",
    order: 6,
    points: 60, // Cumulative: 50 + 10
    symbolicRole: null,
    associatedVirtue: "Attention",
    message: "Le vrai chemin commence maintenant !"
  }
};

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

function StatisticsDashboard({ statistics, membersStats, onGradeClick, onFilterClick, activeFilter, isAdmin, onMembersClick, kyuLevels, userBelt, onBeltChange, isAuthenticated, onRefreshData }) {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showBeltDialog, setShowBeltDialog] = useState(false);
  const [showTrophiesDialog, setShowTrophiesDialog] = useState(false);
  const [showVirtuesDialog, setShowVirtuesDialog] = useState(false);
  const [showVirtueActionsPanel, setShowVirtueActionsPanel] = useState(false);
  const [showTimelinePanel, setShowTimelinePanel] = useState(false);
  const [showJournalPanel, setShowJournalPanel] = useState(false);
  const [sending, setSending] = useState(false);
  const [pdfExportStatus, setPdfExportStatus] = useState(null);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [activeSymbolicRole, setActiveSymbolicRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(false);

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
    if (!pdfExportStatus?.can_export) {
      toast.error(pdfExportStatus?.message || "Export non disponible");
      return;
    }
    
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
        ...pdfExportStatus,
        can_export: false,
        days_remaining: 180,
        message: "Prochain export disponible dans 180 jours"
      });
    } catch (error) {
      const message = error.response?.status === 429 
        ? "Export limité à 1 fois par semestre"
        : "Erreur lors de l'export";
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
      { label: 'Maîtrisées', value: statistics.mastered_techniques, color: [34, 197, 94] },
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
        {/* BLOC UNIFIÉ - Hero Section avec Titre, Guide et Vertus */}
        {!isAdmin && (
          <div className="mb-8 md:mb-12 w-full">
            {/* Bloc Principal Unifié */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10">
              
              {/* Fond décoratif avec motifs japonais */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-4 text-8xl text-amber-400">合</div>
                <div className="absolute top-4 right-4 text-8xl text-amber-400">気</div>
                <div className="absolute bottom-4 left-1/4 text-8xl text-amber-400">道</div>
                <div className="absolute bottom-4 right-1/4 text-8xl text-amber-400">武</div>
              </div>
              
              {/* ====== TITRE DE LA PLATEFORME ====== */}
              <div className="relative pt-8 pb-6 px-4 md:px-8 text-center border-b border-amber-500/20">
                
                {/* Titre Principal avec 平常心 à gauche et à droite */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 flex items-center justify-center gap-4 md:gap-8">
                  <span className="text-amber-400 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold animate-pulse">平常心</span>
                  <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                    Techniques d&apos;Aïkido
                  </span>
                  <span className="text-amber-400 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold animate-pulse">平常心</span>
                </h1>
                
                {/* Sous-titre */}
                <p className="text-base md:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto">
                  🥋 S&apos;entraîner à l&apos;aïkido en dehors du dojo,
                  <br />
                  <span className="text-cyan-400 font-semibold">de façon simple et ludique !</span>
                </p>
              </div>
              
              {/* ====== GUIDE EN 4 ÉTAPES ====== */}
              <div className="relative px-4 md:px-8 py-6 border-b border-amber-500/20">
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-5">
                  <span className="text-green-400 font-bold text-lg">💚 C&apos;est Gratuit !</span>
                  <span className="hidden md:inline text-amber-400">•</span>
                  <span className="text-white font-bold text-lg">🎯 Comment ça marche ?</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-3 md:p-4 rounded-xl text-center transform hover:scale-105 hover:-rotate-1 transition-all cursor-pointer shadow-lg shadow-blue-500/30">
                    <div className="text-3xl md:text-4xl mb-2">👆</div>
                    <p className="text-white font-bold text-sm">1. Choisis</p>
                    <p className="text-blue-200 text-xs">une technique</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-600 to-green-800 p-3 md:p-4 rounded-xl text-center transform hover:scale-105 hover:rotate-1 transition-all cursor-pointer shadow-lg shadow-green-500/30">
                    <div className="text-3xl md:text-4xl mb-2">👀</div>
                    <p className="text-white font-bold text-sm">2. Regarde</p>
                    <p className="text-green-200 text-xs">les détails</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-3 md:p-4 rounded-xl text-center transform hover:scale-105 hover:-rotate-1 transition-all cursor-pointer shadow-lg shadow-orange-500/30">
                    <div className="text-3xl md:text-4xl mb-2">🥋</div>
                    <p className="text-white font-bold text-sm">3. Pratique</p>
                    <p className="text-orange-200 text-xs">au dojo</p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-600 to-pink-800 p-3 md:p-4 rounded-xl text-center transform hover:scale-105 hover:rotate-1 transition-all cursor-pointer shadow-lg shadow-pink-500/30">
                    <div className="text-3xl md:text-4xl mb-2">✅</div>
                    <p className="text-white font-bold text-sm">4. Valide</p>
                    <p className="text-pink-200 text-xs">ta progression</p>
                  </div>
                </div>
                
                <p className="text-center text-amber-300/80 text-xs md:text-sm mt-4">
                  💡 Crée ton compte pour sauvegarder ta progression et devenir un vrai maître ! 🏆
                </p>
              </div>
              
              {/* ====== LES 7 VERTUS ====== */}
              <div className="relative px-4 md:px-8 py-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  {/* Logo Yin-Yang */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-20 h-20 md:w-24 md:h-24">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/40 animate-pulse"></div>
                      <div className="absolute inset-1 rounded-full bg-slate-900 flex items-center justify-center">
                        <div className="relative w-12 h-12 md:w-14 md:h-14">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-b from-amber-400 to-yellow-500"></div>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 md:w-7 md:h-7 rounded-full bg-slate-900 border-2 border-amber-500"></div>
                          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-amber-400 font-bold text-sm">合気道</p>
                  </div>
                  
                  {/* Les 7 Vertus */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg md:text-xl font-bold text-cyan-400 mb-3 flex items-center justify-center md:justify-start gap-2">
                      <span className="text-2xl">🎌</span> Les 7 Vertus de l&apos;Aïkido
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm md:text-base">
                      <p className="text-slate-300"><span className="text-red-400 font-bold">義 Gi</span> : Droiture</p>
                      <p className="text-slate-300"><span className="text-orange-400 font-bold">勇 Yu</span> : Courage</p>
                      <p className="text-slate-300"><span className="text-pink-400 font-bold">仁 Jin</span> : Bienveillance</p>
                      <p className="text-slate-300"><span className="text-yellow-400 font-bold">礼 Rei</span> : Respect</p>
                      <p className="text-slate-300"><span className="text-green-400 font-bold">誠 Makoto</span> : Sincérité</p>
                      <p className="text-slate-300"><span className="text-blue-400 font-bold">名誉 Meiyo</span> : Honneur</p>
                      <p className="text-slate-300 md:col-span-2"><span className="text-purple-400 font-bold">忠義 Chugi</span> : Loyauté</p>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        )}

        {/* MA CEINTURE - Real Aikido Belt System (No XP, No Automatic Progression) */}
        {!isAdmin && currentBelt && (
          <div className="mb-8 p-4 md:p-6 bg-gradient-to-r from-slate-800/80 via-slate-900/80 to-slate-800/80 rounded-2xl border-2 border-amber-500/30 shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              
              {/* Current Belt Display */}
              <div className="flex flex-col items-center cursor-pointer transform hover:scale-105 transition-all" onClick={() => setShowBeltDialog(true)}>
                <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br ${currentBelt.gradient} flex items-center justify-center shadow-xl border-4 border-white/20`}>
                  <span className="text-5xl md:text-6xl">{currentBelt.emoji}</span>
                </div>
                <p className="mt-3 font-bold text-lg md:text-xl text-white">{currentBelt.name}</p>
                <p className="text-amber-400 font-medium">{currentBelt.grade}</p>
              </div>

              {/* Belt Info & Message */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-amber-400 mb-2 flex items-center justify-center md:justify-start gap-2">
                  🥋 Mon Parcours Aïkido
                </h3>
                
                <p className="text-slate-300 text-sm md:text-base mb-4">
                  {currentBelt.message}
                </p>

                {/* ACTIVE Symbolic Role Display */}
                {activeSymbolicRole && (
                  <div className="bg-gradient-to-r from-purple-600/60 to-indigo-600/60 rounded-xl p-4 border-2 border-purple-400/50 shadow-lg shadow-purple-500/20 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-purple-300 animate-pulse" />
                        <span className="text-purple-100 font-bold text-sm">🎭 Rôle Actif</span>
                      </div>
                      <Button
                        onClick={() => handleToggleSymbolicRole(false)}
                        disabled={roleLoading}
                        size="sm"
                        variant="ghost"
                        className="text-purple-300 hover:text-red-400 hover:bg-red-900/30 text-xs"
                      >
                        Désactiver
                      </Button>
                    </div>
                    <p className="text-white font-bold text-lg">{activeSymbolicRole.name}</p>
                    <p className="text-purple-200 text-xs mt-1">
                      Vertu : <span className="text-white font-semibold">{activeSymbolicRole.virtue}</span>
                    </p>
                    <p className="text-purple-300/80 text-xs mt-1 italic">
                      {activeSymbolicRole.intention}
                    </p>
                  </div>
                )}

                {/* Symbolic Role Available but not activated */}
                {!activeSymbolicRole && currentBelt.symbolicRole && (
                  <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl p-4 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-400" />
                        <span className="text-purple-300 font-semibold text-sm">Rôle symbolique disponible</span>
                      </div>
                    </div>
                    <p className="text-white font-bold">{currentBelt.symbolicRole.name}</p>
                    <p className="text-purple-300 text-xs mt-1">
                      Vertu : <span className="text-purple-200">{currentBelt.symbolicRole.virtue}</span>
                    </p>
                    <p className="text-slate-400 text-xs mt-1 italic mb-3">
                      {currentBelt.symbolicRole.intention}
                    </p>
                    <Button
                      onClick={() => handleToggleSymbolicRole(true)}
                      disabled={roleLoading}
                      size="sm"
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold"
                    >
                      {roleLoading ? "Activation..." : "🎭 Activer ce rôle"}
                    </Button>
                  </div>
                )}

                {!activeSymbolicRole && !currentBelt.symbolicRole && (
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <p className="text-slate-400 text-sm">
                      🌱 Continue ton chemin pour débloquer un rôle symbolique au prochain grade !
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Info Button */}
              <div className="flex flex-col items-center gap-2">
                <Button 
                  onClick={() => setShowBeltDialog(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-4 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all"
                >
                  <Award className="w-5 h-5 mr-2" />
                  Changer ma ceinture
                </Button>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowTimelinePanel(true)}
                    variant="outline"
                    size="sm"
                    className="border-amber-500/50 text-amber-400 hover:bg-amber-900/30 hover:text-amber-300 font-semibold px-3 py-1.5 rounded-lg"
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Parcours
                  </Button>
                  <Button 
                    onClick={() => setShowJournalPanel(true)}
                    variant="outline"
                    size="sm"
                    className="border-pink-500/50 text-pink-400 hover:bg-pink-900/30 hover:text-pink-300 font-semibold px-3 py-1.5 rounded-lg"
                  >
                    <BookOpen className="w-4 h-4 mr-1" />
                    Journal
                  </Button>
                </div>
              </div>
            </div>

            {/* Technique States Summary with POINTS */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              <div className="bg-amber-900/30 p-3 rounded-xl text-center border border-amber-500/30">
                <p className="text-2xl mb-1">📖</p>
                <p className="text-amber-300 font-bold">{statistics.in_progress_techniques || 0}</p>
                <p className="text-slate-400">En apprentissage</p>
                <p className="text-amber-500 text-[10px] mt-1">+1 pt/technique</p>
              </div>
              <div className="bg-blue-900/30 p-3 rounded-xl text-center border border-blue-500/30">
                <p className="text-2xl mb-1">🎯</p>
                <p className="text-blue-300 font-bold">{points.practicedCount || 0}</p>
                <p className="text-slate-400">Pratiquées</p>
                <p className="text-blue-500 text-[10px] mt-1">+2 pts/technique</p>
              </div>
              <div className="bg-emerald-900/30 p-3 rounded-xl text-center border border-emerald-500/30">
                <p className="text-2xl mb-1">🏆</p>
                <p className="text-emerald-300 font-bold">{statistics.mastered_techniques || 0}</p>
                <p className="text-slate-400">Maîtrisées</p>
                <p className="text-emerald-500 text-[10px] mt-1">+3 pts/technique</p>
              </div>
              {/* Belt Points */}
              <div className="bg-gradient-to-br from-amber-900/40 to-yellow-900/40 p-3 rounded-xl text-center border border-amber-400/40">
                <p className="text-2xl mb-1">{currentBelt.emoji}</p>
                <p className="text-amber-300 font-bold">+{points.belt}</p>
                <p className="text-slate-400">Ceinture</p>
                <p className="text-amber-500 text-[10px] mt-1">+10 pts/grade</p>
              </div>
              {/* Total Points */}
              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-3 rounded-xl text-center border-2 border-purple-500/50 shadow-lg shadow-purple-500/20 col-span-2 md:col-span-1">
                <p className="text-2xl mb-1">⭐</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">{points.total}</p>
                <p className="text-purple-300 font-semibold">Total Points</p>
              </div>
            </div>

            {/* VIRTUE PIE CHART - Camembert des Vertus */}
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-indigo-900/30 rounded-xl border border-indigo-500/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-indigo-300 font-bold flex items-center gap-2">
                  🎯 Mes Vertus Travaillées
                </h4>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowVirtueActionsPanel(true)}
                    size="sm"
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs shadow-lg shadow-amber-500/30"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Gagner des points !
                  </Button>
                  <Button 
                    onClick={() => setShowVirtuesDialog(true)}
                    variant="ghost"
                    size="sm"
                    className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30 text-xs"
                  >
                    Détails →
                  </Button>
                </div>
              </div>
              
              {totalVirtuePoints > 0 ? (
                <VirtuePieChart virtueData={virtueData} />
              ) : (
                <p className="text-slate-400 text-sm text-center py-4">
                  🌱 Commence à pratiquer pour développer tes vertus !
                </p>
              )}
              
              <p className="text-center text-indigo-300/70 text-xs mt-4 italic">
                Répartition de tes vertus basée sur ta progression et ton parcours
              </p>
            </div>

            {/* Trophies Section */}
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-900/30 via-amber-900/30 to-yellow-900/30 rounded-xl border border-yellow-500/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-amber-400 font-bold flex items-center gap-2">
                  🏆 Mes Trophées ({trophies.unlocked.length})
                </h4>
                <Button 
                  onClick={() => setShowTrophiesDialog(true)}
                  variant="ghost"
                  size="sm"
                  className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/30 text-xs"
                >
                  Voir tout →
                </Button>
              </div>
              
              {trophies.unlocked.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-2">
                  🌱 Continue à pratiquer pour débloquer tes premiers trophées !
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {trophies.unlocked.slice(0, 6).map((trophy, idx) => (
                    <div 
                      key={idx}
                      className="bg-slate-800/80 px-3 py-1.5 rounded-full border border-yellow-500/30 flex items-center gap-1.5 text-xs hover:scale-105 transition-all cursor-pointer"
                      title={trophy.desc}
                    >
                      <span className="text-lg">{trophy.icon}</span>
                      <span className="text-yellow-300 font-medium">{trophy.name}</span>
                    </div>
                  ))}
                  {trophies.unlocked.length > 6 && (
                    <div 
                      className="bg-slate-800/80 px-3 py-1.5 rounded-full border border-purple-500/30 text-xs text-purple-300 cursor-pointer hover:bg-purple-900/30"
                      onClick={() => setShowTrophiesDialog(true)}
                    >
                      +{trophies.unlocked.length - 6} autres
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Points explanation */}
            <div className="mt-4 text-center">
              <p className="text-slate-400 text-xs italic">
                🎌 Gagne des points : 📖 1pt • 🎯 2pts • 🏆 3pts • {currentBelt.emoji} +10pts/grade
                <br />Débloque des trophées et développe tes vertus !
              </p>
            </div>
          </div>
        )}

        {/* O Sensei & Hakama Section */}
        <div className="mb-10 p-6 md:p-8 bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-800/80 rounded-2xl border border-amber-500/30 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* O Sensei Image */}
            <div className="flex flex-col items-center lg:items-start gap-3 lg:min-w-[200px]">
              <div className="relative">
                <div className="w-32 h-40 md:w-40 md:h-48 rounded-xl overflow-hidden border-4 border-amber-500/50 shadow-lg shadow-amber-500/20">
                  <img 
                    src="https://customer-assets.emergentagent.com/job_dojo-progress-1/artifacts/dz0s4slt_Sensei%20MoriHei%20Ueshiba.jpg" 
                    alt="O Sensei - Morihei Ueshiba"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                  O Sensei
                </div>
              </div>
              <p className="text-amber-400 font-semibold text-center">Morihei Ueshiba</p>
              <p className="text-slate-400 text-xs text-center">Fondateur de l'Aïkido</p>
            </div>

            {/* Text Content */}
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                🥋 Les Sept Plis du Hakama
              </h3>
              
              <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed">
                <p>
                  O Sensei enseignait que <span className="text-amber-400 font-semibold">« les sept plis du hakama symbolisent les sept vertus du budō »</span>. 
                  Ces vertus, héritées de l'éthique du samouraï d'autrefois, constituent le socle moral du bushidō.
                </p>
                
                <p>
                  Les <span className="text-cyan-400 font-semibold">budō</span> sont les arts martiaux japonais apparus entre le milieu du XIXᵉ et le milieu du XXᵉ siècle. 
                  En japonais, <em>bu</em> signifie la guerre ou le combat, et <em>dō</em> la voie. Le budō désigne ainsi un chemin de formation globale, 
                  à la fois physique, mentale et spirituelle.
                </p>

                <blockquote className="border-l-4 border-amber-500 pl-4 py-2 bg-slate-800/50 rounded-r-lg italic text-slate-200">
                  « Les sept plis du hakama symbolisent les sept vertus du budō. Le hakama nous incite à refléter la vraie nature du bushidō. 
                  L'aïkido nous invite à polir sans cesse ces sept vertus traditionnelles dans notre pratique. »
                  <footer className="text-amber-400 font-semibold mt-2 not-italic">— Morihei Ueshiba</footer>
                </blockquote>
              </div>

              {/* 7 Virtues Grid */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gradient-to-r from-red-900/40 to-red-800/40 p-3 rounded-lg border border-red-500/30">
                  <p className="font-bold text-red-400">仁 JIN – Bienveillance</p>
                  <p className="text-xs text-slate-300">Attention sincère portée à autrui, respect constant des autres.</p>
                </div>
                <div className="bg-gradient-to-r from-blue-900/40 to-blue-800/40 p-3 rounded-lg border border-blue-500/30">
                  <p className="font-bold text-blue-400">義 GI – Justice, honneur</p>
                  <p className="text-xs text-slate-300">Fidélité à la parole donnée et aux engagements pris.</p>
                </div>
                <div className="bg-gradient-to-r from-purple-900/40 to-purple-800/40 p-3 rounded-lg border border-purple-500/30">
                  <p className="font-bold text-purple-400">礼 REI – Courtoisie</p>
                  <p className="text-xs text-slate-300">Expression visible de l'estime portée à autrui.</p>
                </div>
                <div className="bg-gradient-to-r from-green-900/40 to-green-800/40 p-3 rounded-lg border border-green-500/30">
                  <p className="font-bold text-green-400">智 CHI – Sagesse</p>
                  <p className="text-xs text-slate-300">Discerner avec justesse, garder calme et lucidité.</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-900/40 to-yellow-800/40 p-3 rounded-lg border border-yellow-500/30">
                  <p className="font-bold text-yellow-400">信 SHIN – Sincérité</p>
                  <p className="text-xs text-slate-300">Engagement total et constant, sans artifice.</p>
                </div>
                <div className="bg-gradient-to-r from-cyan-900/40 to-cyan-800/40 p-3 rounded-lg border border-cyan-500/30">
                  <p className="font-bold text-cyan-400">忠 CHU – Loyauté</p>
                  <p className="text-xs text-slate-300">Fidélité sincère à son école et son enseignement.</p>
                </div>
                <div className="bg-gradient-to-r from-pink-900/40 to-pink-800/40 p-3 rounded-lg border border-pink-500/30 md:col-span-2">
                  <p className="font-bold text-pink-400">孝 KŌ – Piété, respect des fondements</p>
                  <p className="text-xs text-slate-300">Respect profond des bases techniques, spirituelles et philosophiques des arts martiaux.</p>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400 italic text-center">
                Un hakama est composé de sept plis : cinq à l'avant et deux à l'arrière. Chacun rappelle les valeurs que le pratiquant s'efforce de cultiver sur la voie du budō.
              </p>
            </div>
          </div>
        </div>

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
                🎯 Mes Vertus de l'Aïkido
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

        {/* Statistics blocks - hidden for admin - FUN DESIGN */}
        {!isAdmin && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-12 max-w-6xl mx-auto px-2">
            <Card 
              className={`bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-400 cursor-pointer transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/30 ${activeFilter === 'all' ? 'ring-4 ring-indigo-400 ring-opacity-50' : ''}`}
              onClick={() => onFilterClick && onFilterClick('all')}
            >
              <CardContent className="p-3 md:px-6 md:py-4">
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl md:text-4xl mb-2">📚</div>
                  <p className="text-3xl md:text-4xl font-bold text-white">{statistics.total_techniques}</p>
                  <p className="text-xs md:text-sm text-indigo-200 font-medium">Techniques</p>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className={`bg-gradient-to-br from-emerald-500 to-emerald-700 border-emerald-400 cursor-pointer transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30 ${activeFilter === 'mastered' ? 'ring-4 ring-emerald-400 ring-opacity-50' : ''}`}
              onClick={() => onFilterClick && onFilterClick('mastered')}
            >
              <CardContent className="p-3 md:px-6 md:py-4">
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl md:text-4xl mb-2">🏆</div>
                  <p className="text-3xl md:text-4xl font-bold text-white">{statistics.mastered_techniques}</p>
                  <p className="text-xs md:text-sm text-emerald-100 font-medium">Maîtrisées</p>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className={`bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400 cursor-pointer transition-all hover:scale-105 hover:shadow-xl hover:shadow-amber-500/30 ${activeFilter === 'in_progress' ? 'ring-4 ring-amber-400 ring-opacity-50' : ''}`}
              onClick={() => onFilterClick && onFilterClick('in_progress')}
            >
              <CardContent className="p-3 md:px-6 md:py-4">
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl md:text-4xl mb-2">🔥</div>
                  <p className="text-3xl md:text-4xl font-bold text-white">{statistics.in_progress_techniques}</p>
                  <p className="text-xs md:text-sm text-amber-100 font-medium">En cours</p>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className={`bg-gradient-to-br from-pink-500 to-rose-600 border-pink-400 cursor-pointer transition-all hover:scale-105 hover:shadow-xl hover:shadow-pink-500/30 ${activeFilter === 'practiced' ? 'ring-4 ring-pink-400 ring-opacity-50' : ''}`}
              onClick={() => onFilterClick && onFilterClick('practiced')}
            >
              <CardContent className="p-3 md:px-6 md:py-4">
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl md:text-4xl mb-2">⭐</div>
                  <p className="text-3xl md:text-4xl font-bold text-white">{statistics.total_practice_sessions}</p>
                  <p className="text-xs md:text-sm text-pink-100 font-medium">Sessions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
          
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
        
        {/* FUN PROGRESSION SECTION - Colorful & Kid-Friendly */}
        <div className="bg-gradient-to-br from-indigo-900/60 via-purple-900/60 to-pink-900/60 rounded-2xl border-2 border-purple-500/40 p-4 md:p-6 shadow-xl">
          {/* Header with fun styling */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl animate-bounce">🎯</div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Ma Progression Ninja ! 🥷
                </h3>
                <p className="text-purple-300 text-xs md:text-sm">Clique sur un grade pour voir les techniques</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEmailDialog(true)}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 border-none text-white hover:from-cyan-500 hover:to-blue-500 h-8 text-xs font-bold shadow-lg shadow-cyan-500/30"
              >
                <Download className="w-3 h-3 mr-1" />
                📄 PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                className="bg-gradient-to-r from-green-600 to-emerald-600 border-none text-white hover:from-green-500 hover:to-emerald-500 h-8 text-xs font-bold shadow-lg shadow-green-500/30"
              >
                <Download className="w-3 h-3 mr-1" />
                📊 CSV
              </Button>
            </div>
          </div>

          {/* Grade Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {statistics.techniques_by_level?.map((level, index) => {
              // Fun emojis and colors for each grade type WITH BELT EQUIVALENCE
              const gradeStyles = {
                '5e KYU': { emoji: '🟡', gradient: 'from-yellow-400 to-yellow-600', glow: 'shadow-yellow-500/40', rank: 'Débutant', belt: 'Jaune' },
                '4e KYU': { emoji: '🟠', gradient: 'from-orange-400 to-orange-600', glow: 'shadow-orange-500/40', rank: 'Apprenti', belt: 'Orange' },
                '3e KYU': { emoji: '🟢', gradient: 'from-green-500 to-green-700', glow: 'shadow-green-500/40', rank: 'Avancé', belt: 'Verte' },
                '2e KYU': { emoji: '🔵', gradient: 'from-blue-500 to-blue-700', glow: 'shadow-blue-500/40', rank: 'Expert', belt: 'Bleue' },
                '1er KYU': { emoji: '🟤', gradient: 'from-amber-700 to-amber-900', glow: 'shadow-amber-500/40', rank: 'Pré-Dan', belt: 'Marron' },
                'SHODAN': { emoji: '⚫', gradient: 'from-slate-700 to-slate-900', glow: 'shadow-slate-500/40', rank: '1er Dan', belt: 'Noire' },
                'NIDAN': { emoji: '⚫', gradient: 'from-slate-600 to-slate-800', glow: 'shadow-slate-500/40', rank: '2e Dan', belt: 'Noire' },
                'SANDAN': { emoji: '⚫', gradient: 'from-slate-600 to-slate-800', glow: 'shadow-slate-500/40', rank: '3e Dan', belt: 'Noire' },
                'YONDAN': { emoji: '⚫', gradient: 'from-slate-600 to-slate-800', glow: 'shadow-slate-500/40', rank: '4e Dan', belt: 'Noire' },
                'BOKKEN': { emoji: '⚔️', gradient: 'from-cyan-500 to-blue-600', glow: 'shadow-cyan-500/40', rank: 'Sabre', belt: null },
                'Déplacements': { emoji: '🦶', gradient: 'from-pink-500 to-fuchsia-600', glow: 'shadow-pink-500/40', rank: 'Bases', belt: null },
              };
              
              // Find matching style
              const styleKey = Object.keys(gradeStyles).find(key => level.name.includes(key)) || null;
              const style = styleKey ? gradeStyles[styleKey] : { 
                emoji: '✨', 
                gradient: 'from-indigo-500 to-purple-600', 
                glow: 'shadow-indigo-500/40',
                rank: 'Grade',
                belt: null
              };
              
              const isComplete = level.progress_percentage === 100;
              const isStarted = level.progress_percentage > 0;

              return (
                <div 
                  key={index} 
                  className={`relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${style.glow} shadow-lg`}
                  onClick={() => onGradeClick && onGradeClick(level.name)}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-90`}></div>
                  
                  {/* Completion sparkles */}
                  {isComplete && (
                    <div className="absolute top-2 right-2 text-2xl animate-pulse">🎉</div>
                  )}
                  
                  {/* Content */}
                  <div className="relative p-3 md:p-4">
                    <div className="flex items-center gap-3">
                      {/* Emoji badge */}
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl md:text-3xl ${isComplete ? 'animate-bounce' : ''}`}>
                        {style.emoji}
                      </div>
                      
                      {/* Grade info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <h4 className="font-bold text-white text-sm md:text-base truncate pr-2">
                            {level.name}
                            {style.belt && (
                              <span className="ml-2 text-xs font-normal opacity-90">
                                (Ceinture {style.belt})
                              </span>
                            )}
                          </h4>
                          <span className="text-white/80 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
                            {style.rank}
                          </span>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="mt-2 h-3 md:h-4 bg-black/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-white/80 to-white/60 rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${Math.max(level.progress_percentage, 2)}%` }}
                          >
                            {level.progress_percentage > 10 && (
                              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                            )}
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="mt-1 flex items-center justify-between text-xs">
                          <span className="text-white/90 font-medium">
                            {isComplete ? '✅ Complété !' : isStarted ? '🚀 En cours...' : '💤 À débloquer'}
                          </span>
                          <span className="text-white font-bold bg-white/20 px-2 py-0.5 rounded-full">
                            {level.mastered}/{level.total} • {level.progress_percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fun footer message */}
          <div className="mt-6 text-center">
            <p className="text-purple-300 text-sm">
              🌟 Continue à t'entraîner pour débloquer tous les grades ! 🌟
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
    </>
  );
}

export default StatisticsDashboard;
