import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, UserPlus, Shield, CheckCircle2, Sparkles } from 'lucide-react';

/**
 * InscriptionPage - Page d'inscription version adulte
 * Kanji: 登 (monter, s'inscrire)
 */
const InscriptionPage = ({ onBack, isAuthenticated, onOpenAuth }) => {
  const benefits = [
    { icon: '📊', title: 'Suivi personnalisé', desc: 'Suivez votre progression technique' },
    { icon: '🎯', title: 'Objectifs quotidiens', desc: 'Définissez vos propres défis' },
    { icon: '📜', title: 'Certifications', desc: 'Validez vos acquis officiellement' },
    { icon: '☯️', title: 'Philosophie', desc: 'Explorez les 7 vertus du Hakama' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header avec retour */}
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

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700">
        <div className="absolute top-4 right-4 text-8xl text-slate-700/30 font-serif">登</div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Inscription</h1>
              <p className="text-slate-400">Créez votre espace personnel</p>
            </div>
          </div>

          <p className="text-lg text-slate-300 max-w-2xl mb-8">
            Rejoignez la communauté <strong className="text-amber-400">Aikido@Game</strong> et commencez 
            votre parcours vers la maîtrise. Votre progression est sauvegardée et accessible partout.
          </p>

          {isAuthenticated ? (
            <div className="flex items-center gap-3 p-4 bg-emerald-900/30 rounded-xl border border-emerald-700/50">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <span className="text-emerald-300 font-medium">Vous êtes déjà connecté ! Accédez à votre tableau de bord.</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={onOpenAuth}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold px-8 py-6 text-lg rounded-xl"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Créer mon compte gratuitement
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const event = new CustomEvent('openLoginDialog');
                  window.dispatchEvent(event);
                }}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg rounded-xl"
              >
                J'ai déjà un compte
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Avantages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {benefits.map((benefit, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">{benefit.icon}</div>
              <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
              <p className="text-sm text-slate-400">{benefit.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sécurité */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-cyan-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-2">Vos données sont protégées</h3>
              <p className="text-slate-400 text-sm">
                Aikido@Game respecte le RGPD. Vos informations personnelles ne sont jamais partagées 
                et vous pouvez supprimer votre compte à tout moment. Votre progression reste strictement personnelle.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InscriptionPage;
