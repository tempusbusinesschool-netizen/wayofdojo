import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Award, CheckCircle2, FileText, Shield, Lock } from 'lucide-react';

/**
 * CertificationsPage - Validation des acquis (version adulte)
 * Kanji: 証 (preuve, certificat)
 */
const CertificationsPage = ({ onBack, isAuthenticated, onOpenAuth }) => {
  const certificationTypes = [
    {
      icon: '📜',
      title: 'Attestation de grade',
      desc: 'Document officiel attestant votre niveau technique actuel',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: '🏆',
      title: 'Badges de compétence',
      desc: 'Reconnaissance de maîtrise pour chaque technique validée',
      color: 'from-violet-500 to-purple-600'
    },
    {
      icon: '📊',
      title: 'Rapport de progression',
      desc: 'Bilan détaillé de votre parcours et évolution',
      color: 'from-cyan-500 to-blue-600'
    },
  ];

  const validationProcess = [
    { step: 1, title: 'Auto-évaluation', desc: 'Marquez les techniques comme "en apprentissage" ou "maîtrisées"' },
    { step: 2, title: 'Pratique régulière', desc: 'Enregistrez vos sessions d\'entraînement' },
    { step: 3, title: 'Validation enseignant', desc: 'Votre sensei peut valider officiellement vos acquis' },
    { step: 4, title: 'Certification', desc: 'Recevez votre attestation de niveau' },
  ];

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
          Retour
        </Button>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700">
        <div className="absolute top-4 right-4 text-8xl text-slate-700/30 font-serif">証</div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Certifications</h1>
              <p className="text-slate-400">Validez vos acquis</p>
            </div>
          </div>

          <p className="text-lg text-slate-300 max-w-2xl">
            Le système de certification d'Aikido@Game vous permet de valider officiellement 
            votre progression et d'obtenir des attestations reconnues.
          </p>
        </div>
      </div>

      {/* Types de certifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {certificationTypes.map((cert, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center mx-auto mb-4`}>
                <span className="text-3xl">{cert.icon}</span>
              </div>
              <h3 className="font-semibold text-white mb-2">{cert.title}</h3>
              <p className="text-sm text-slate-400">{cert.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Processus de validation */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Processus de validation</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {validationProcess.map((item) => (
              <div key={item.step} className="relative">
                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 h-full">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-3">
                    <span className="text-white font-bold">{item.step}</span>
                  </div>
                  <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sécurité et authenticité */}
      <Card className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-emerald-700/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-2">Authenticité garantie</h3>
              <p className="text-slate-400 text-sm">
                Chaque certification est liée à votre compte personnel et peut être vérifiée. 
                Les validations par les enseignants sont horodatées et signées numériquement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mes certifications (pour utilisateurs connectés) */}
      {isAuthenticated ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">Mes certifications</h3>
            </div>
            <div className="text-center py-8 text-slate-400">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucune certification pour le moment</p>
              <p className="text-sm mt-2">Continuez votre progression pour obtenir vos premières certifications !</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-700/50">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-orange-400" />
              <p className="text-slate-300">Connectez-vous pour accéder à vos certifications</p>
            </div>
            <Button
              onClick={onOpenAuth}
              className="bg-orange-600 hover:bg-orange-500 text-white"
            >
              Créer mon compte
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CertificationsPage;
