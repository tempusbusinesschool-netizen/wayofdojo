import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BookOpen, CheckCircle2, Clock, Flame, TrendingUp, BarChart3, Users, Baby, FileText, Download, Mail, Send } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function StatisticsDashboard({ statistics, membersStats, onGradeClick, onFilterClick, activeFilter, isAdmin, onMembersClick, kyuLevels, userEmail }) {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [email, setEmail] = useState(userEmail || '');
  const [sending, setSending] = useState(false);

  // Update email when userEmail prop changes
  React.useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
    }
  }, [userEmail]);

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
    doc.text('68, rue du Docteur Schweitzer 97421 SAINT-LOUIS - RÉUNION', pageWidth / 2, 26, { align: 'center' });
    
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
    doc.text('Aikido La Rivière - Club affilié FFAAA - © humanknowledge.fr', pageWidth / 2, pageHeight - 10, { align: 'center' });

    return doc.output('datauristring');
  };
  
  const handleSendPDF = async () => {
    if (!email || !email.includes('@')) {
      toast.error("Veuillez saisir une adresse email valide");
      return;
    }

    if (!kyuLevels || kyuLevels.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    setSending(true);
    toast.info("Génération et envoi du PDF en cours...");

    try {
      const pdfBase64 = await generatePDFBase64();
      const today = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
      
      await axios.post(`${API}/send-progression-pdf`, {
        email: email,
        pdf_base64: pdfBase64,
        filename: `progression_aikido_${today}.pdf`
      });
      
      toast.success(`PDF envoyé à ${email} !`);
      setShowEmailDialog(false);
      setEmail('');
    } catch (error) {
      console.error('Error sending PDF:', error);
      toast.error(error.response?.data?.detail || "Erreur lors de l'envoi du PDF");
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
        <div className="flex justify-end mb-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEmailDialog(true)}
            className="border-cyan-600 text-cyan-400 hover:bg-cyan-900/30 hover:text-cyan-300"
          >
            <Mail className="w-4 h-4 mr-2" />
            Recevoir mon PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 max-w-6xl mx-auto">
          <Card 
            className={`bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${activeFilter === 'all' ? 'ring-2 ring-slate-400' : ''}`}
            onClick={() => onFilterClick && onFilterClick('all')}
          >
            <CardContent className="px-6 py-4">
              <div className="flex items-center gap-5">
                <div className="p-3 rounded-xl bg-slate-700">
                  <BookOpen className="w-7 h-7 text-slate-300" />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-white">{statistics.total_techniques}</p>
                  <p className="text-sm text-slate-400">Techniques</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`bg-gradient-to-br from-emerald-800 to-emerald-900 border-emerald-700 cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${activeFilter === 'mastered' ? 'ring-2 ring-emerald-400' : ''}`}
            onClick={() => onFilterClick && onFilterClick('mastered')}
          >
            <CardContent className="px-6 py-4">
              <div className="flex items-center gap-5">
                <div className="p-3 rounded-xl bg-emerald-700">
                  <CheckCircle2 className="w-7 h-7 text-emerald-300" />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-white">{statistics.mastered_techniques}</p>
                  <p className="text-sm text-emerald-300">Maîtrisées</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`bg-gradient-to-br from-amber-800 to-amber-900 border-amber-700 cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${activeFilter === 'in_progress' ? 'ring-2 ring-amber-400' : ''}`}
            onClick={() => onFilterClick && onFilterClick('in_progress')}
          >
            <CardContent className="px-6 py-4">
              <div className="flex items-center gap-5">
                <div className="p-3 rounded-xl bg-amber-700">
                  <Clock className="w-7 h-7 text-amber-300" />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-white">{statistics.in_progress_techniques}</p>
                  <p className="text-sm text-amber-300">En cours</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`bg-gradient-to-br from-rose-800 to-rose-900 border-rose-700 cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${activeFilter === 'practiced' ? 'ring-2 ring-rose-400' : ''}`}
            onClick={() => onFilterClick && onFilterClick('practiced')}
          >
            <CardContent className="px-6 py-4">
              <div className="flex items-center gap-5">
                <div className="p-3 rounded-xl bg-rose-700">
                  <Flame className="w-7 h-7 text-rose-300" />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-white">{statistics.total_practice_sessions}</p>
                  <p className="text-sm text-rose-300">Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
          
        {membersStats && isAdmin && (
          <div className="flex justify-center gap-3 mb-6">
            <Card 
              className="bg-gradient-to-br from-cyan-800 to-cyan-900 border-cyan-700 cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
              onClick={() => onMembersClick && onMembersClick('adults')}
            >
              <CardContent className="px-4 py-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-700">
                    <Users className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{membersStats.total_members}</p>
                    <p className="text-xs text-cyan-300">Adhérents</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="bg-gradient-to-br from-purple-800 to-purple-900 border-purple-700 cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
              onClick={() => onMembersClick && onMembersClick('children')}
            >
              <CardContent className="px-4 py-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-700">
                    <Baby className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{membersStats.total_children}</p>
                    <p className="text-xs text-purple-300">Enfants</p>
                  </div>
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
        
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Progression par Grade
              <span className="text-xs text-slate-500 font-normal ml-2">(cliquez pour voir)</span>
            </CardTitle>
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

      {/* Email Dialog for PDF */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Recevoir ma progression en PDF
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Saisissez votre adresse email pour recevoir votre suivi de progression.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-3 bg-cyan-900/30 border border-cyan-700 rounded-lg">
              <Mail className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-sm text-white font-medium">PDF détaillé inclus</p>
                <p className="text-xs text-slate-400">Progression globale, techniques par grade, sessions de pratique</p>
              </div>
            </div>
            
            <div>
              <Label className="text-slate-300">Adresse email *</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="bg-slate-700 border-slate-600 text-white mt-1"
                autoFocus
              />
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
              onClick={handleSendPDF}
              disabled={sending || !email}
              className="flex-1 bg-cyan-600 hover:bg-cyan-500"
            >
              {sending ? (
                <>Envoi en cours...</>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer
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
