import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BookOpen, CheckCircle2, Clock, Flame, TrendingUp, BarChart3, Users, Baby, FileText, Download, Swords } from "lucide-react";
import { toast } from "sonner";

function StatisticsDashboard({ statistics, membersStats, onGradeClick, onFilterClick, activeFilter, isAdmin, onMembersClick, kyuLevels }) {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [sending, setSending] = useState(false);

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
        {/* Logo and 7 Virtues Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10 p-8 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="flex flex-col items-center gap-2">
            {/* Yin-Yang style logo in yellow/gold - larger version */}
            <div className="relative w-28 h-28">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/30"></div>
              <div className="absolute inset-1.5 rounded-full bg-slate-900 flex items-center justify-center">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-b from-amber-400 to-yellow-500"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-500"></div>
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-900"></div>
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400"></div>
                </div>
              </div>
            </div>
            <p className="text-sm text-amber-400 font-medium">Aikido</p>
            <p className="text-lg font-bold text-white">Techniques d'Aikido</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Les 7 Vertus de l'Aïkido</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 text-base">
              <p className="text-slate-300"><span className="text-amber-400 font-bold text-lg">義 Gi</span> : Droiture</p>
              <p className="text-slate-300"><span className="text-amber-400 font-bold text-lg">勇 Yu</span> : Courage</p>
              <p className="text-slate-300"><span className="text-amber-400 font-bold text-lg">仁 Jin</span> : Bienveillance</p>
              <p className="text-slate-300"><span className="text-amber-400 font-bold text-lg">礼 Rei</span> : Respect</p>
              <p className="text-slate-300"><span className="text-amber-400 font-bold text-lg">誠 Makoto</span> : Sincérité</p>
              <p className="text-slate-300"><span className="text-amber-400 font-bold text-lg">名誉 Meiyo</span> : Honneur</p>
              <p className="text-slate-300"><span className="text-amber-400 font-bold text-lg">忠義 Chugi</span> : Loyauté</p>
            </div>
          </div>
        </div>

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
        
        {/* Title Section - hidden for admin */}
        {!isAdmin && (
          <div className="mb-8 md:mb-12 w-full px-2">
            <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-white flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 md:gap-4 px-2 md:px-4 text-center">
              <span className="text-amber-400 text-lg md:text-xl lg:text-2xl hidden md:block">平常心</span>
              <span className="flex-1 text-center">Entraînement aux techniques Aïkido</span>
              <span className="text-amber-400 text-lg md:text-xl lg:text-2xl hidden md:block">平常心</span>
            </h1>
            <p className="text-amber-400 text-center text-sm mt-1 md:hidden">平常心</p>
            <div className="w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 mt-3 md:mt-4 rounded-full"></div>
            
            {/* Fun Guide Section */}
            <div className="mt-6 p-4 md:p-6 bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 rounded-2xl border border-purple-500/30">
              <h2 className="text-center text-lg md:text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                🎯 Comment ça marche ?
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-3 md:p-4 rounded-xl text-center transform hover:scale-105 transition-all cursor-pointer shadow-lg">
                  <div className="text-3xl md:text-4xl mb-2">👆</div>
                  <p className="text-white font-bold text-sm">1. Choisis</p>
                  <p className="text-blue-200 text-xs">une technique</p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-800 p-3 md:p-4 rounded-xl text-center transform hover:scale-105 transition-all cursor-pointer shadow-lg">
                  <div className="text-3xl md:text-4xl mb-2">👀</div>
                  <p className="text-white font-bold text-sm">2. Regarde</p>
                  <p className="text-green-200 text-xs">les détails</p>
                </div>
                <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-3 md:p-4 rounded-xl text-center transform hover:scale-105 transition-all cursor-pointer shadow-lg">
                  <div className="text-3xl md:text-4xl mb-2">🥋</div>
                  <p className="text-white font-bold text-sm">3. Pratique</p>
                  <p className="text-orange-200 text-xs">au dojo</p>
                </div>
                <div className="bg-gradient-to-br from-pink-600 to-pink-800 p-3 md:p-4 rounded-xl text-center transform hover:scale-105 transition-all cursor-pointer shadow-lg">
                  <div className="text-3xl md:text-4xl mb-2">✅</div>
                  <p className="text-white font-bold text-sm">4. Valide</p>
                  <p className="text-pink-200 text-xs">ta progression</p>
                </div>
              </div>
              <p className="text-center text-purple-300 text-xs md:text-sm mt-4">
                💡 Crée ton compte pour sauvegarder ta progression et devenir un vrai maître ! 🏆
              </p>
            </div>
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
        
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Progression par Grade
                <span className="text-xs text-slate-500 font-normal ml-2">(cliquez pour voir)</span>
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEmailDialog(true)}
                  className="border-cyan-600 text-cyan-400 hover:bg-cyan-900/30 hover:text-cyan-300 h-7 text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToCSV}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white h-7 text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {statistics.techniques_by_level?.map((level, index) => (
              <div 
                key={index} 
                className="space-y-1 p-2 -mx-2 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors"
                onClick={() => onGradeClick && onGradeClick(level.name)}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: level.color || '#6366f1' }}
                    />
                    {level.name}
                  </span>
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
    </>
  );
}

export default StatisticsDashboard;
