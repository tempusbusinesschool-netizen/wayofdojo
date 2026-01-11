import React, { useState } from 'react';
import { 
  Check, X, Zap, Building2, Crown, Shield, CreditCard, 
  Clock, Users, Award, Target, ChevronRight, Sparkles,
  Calendar, Star, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const TarificationPage = ({ onBack, onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'ninja',
      name: 'Ninja',
      subtitle: 'Abonnement individuel',
      description: 'Parcours personnel de révision et de motivation',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      price: 4.50,
      currency: '€',
      period: '/mois',
      trial: '3 mois gratuits',
      trialDays: 90,
      commitment: 'Sans engagement',
      commitmentDetail: 'Résiliable à tout moment',
      features: [
        { text: 'Accès à 206+ techniques', included: true },
        { text: 'Suivi de progression personnel', included: true },
        { text: '84 défis à relever', included: true },
        { text: 'Tableau de bord personnalisé', included: true },
        { text: 'Système de points et badges', included: true },
        { text: 'Mode Jeune Ninja / Ninja Confirmé', included: true },
        { text: 'Sauvegarde automatique', included: true },
        { text: 'Support par email', included: true },
        { text: 'Gestion de club', included: false },
        { text: 'Multi-utilisateurs', included: false },
      ],
      cta: 'Commencer 3 mois gratuits',
      popular: true
    },
    {
      id: 'dojo',
      name: 'Dojo',
      subtitle: 'Abonnement club',
      description: 'Outil de gestion et d\'animation de club',
      icon: Building2,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      price: 19.90,
      currency: '€',
      period: '/mois',
      trial: '10 jours gratuits',
      trialDays: 10,
      commitment: 'Engagement 12 mois',
      commitmentDetail: 'Reconduction tacite annuelle',
      features: [
        { text: 'Toutes les fonctionnalités Ninja', included: true },
        { text: 'Gestion des adhérents illimitée', included: true },
        { text: 'Espace Enseignant dédié', included: true },
        { text: 'Observations sur les élèves', included: true },
        { text: 'Messagerie Parents/Enseignants', included: true },
        { text: 'Statistiques du club', included: true },
        { text: 'Export des données', included: true },
        { text: 'Support prioritaire', included: true },
        { text: 'Formation personnalisée', included: true },
        { text: 'Logo personnalisé', included: true },
      ],
      cta: 'Essayer 10 jours gratuits',
      popular: false
    }
  ];

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    if (onSelectPlan) {
      onSelectPlan(planId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-6 text-slate-400 hover:text-white"
            >
              ← Retour
            </Button>
          )}
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Offres spéciales lancement
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choisissez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">parcours</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Commencez gratuitement et progressez à votre rythme dans l'apprentissage de l'Aikido
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl ${plan.bgColor} ${plan.borderColor} border-2 p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                  plan.popular ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-slate-900' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Le plus populaire
                    </Badge>
                  </div>
                )}

                {/* Plan Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                    <p className="text-slate-400">{plan.subtitle}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-white">{plan.price.toFixed(2).replace('.', ',')}</span>
                    <span className="text-xl text-slate-400">{plan.currency}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">TTC</p>
                </div>

                {/* Trial Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${plan.color} mb-6`}>
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-white font-semibold">{plan.trial}</span>
                </div>

                {/* Description */}
                <p className="text-slate-300 mb-6">{plan.description}</p>

                {/* Commitment */}
                <div className="flex items-center gap-2 mb-6 text-sm">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400">{plan.commitment}</span>
                  <span className="text-slate-500">• {plan.commitmentDetail}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-700/50 flex items-center justify-center">
                          <X className="w-3 h-3 text-slate-500" />
                        </div>
                      )}
                      <span className={feature.included ? 'text-slate-300' : 'text-slate-500'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-6 text-lg font-semibold bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity`}
                >
                  {plan.cta}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Important Notice */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Important</h3>
                <p className="text-slate-400 text-sm">
                  Les abonnements ne permettent aucune évaluation technique, certification ou délivrance de grade. 
                  Aikido@Game est un outil de révision et de motivation complémentaire à la pratique en dojo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center gap-2 text-slate-400">
            <CreditCard className="w-5 h-5" />
            <span>Paiement sécurisé via Stripe</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Lock className="w-5 h-5" />
            <span>Données protégées (RGPD)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Shield className="w-5 h-5" />
            <span>Droit français applicable</span>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
          <div className="space-y-4">
            <details className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 group">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium">
                Comment fonctionne la période d'essai ?
                <ChevronRight className="w-5 h-5 transform group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-slate-400 mt-4">
                <strong>Ninja</strong> : Profitez de 3 mois complets sans frais. Après cette période, vous serez facturé 4,50€/mois. 
                Vous pouvez annuler à tout moment.<br/><br/>
                <strong>Dojo</strong> : Essayez gratuitement pendant 10 jours. Sans annulation, l'abonnement de 19,90€/mois 
                démarre avec un engagement de 12 mois.
              </p>
            </details>
            
            <details className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 group">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium">
                Puis-je changer d'offre ?
                <ChevronRight className="w-5 h-5 transform group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-slate-400 mt-4">
                Oui, vous pouvez passer de Ninja à Dojo à tout moment. La différence de tarif sera calculée au prorata. 
                Le passage de Dojo à Ninja est possible à l'échéance de votre engagement.
              </p>
            </details>
            
            <details className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 group">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium">
                Comment résilier mon abonnement ?
                <ChevronRight className="w-5 h-5 transform group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-slate-400 mt-4">
                <strong>Ninja</strong> : Résiliez à tout moment depuis votre tableau de bord. L'accès reste actif jusqu'à la fin 
                de la période payée.<br/><br/>
                <strong>Dojo</strong> : Envoyez votre demande de résiliation au moins 30 jours avant l'échéance annuelle 
                par email à contact@aikidoatgame.com.
              </p>
            </details>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-slate-500">
          <p>HUMAN KNOWLEDGE • Aikido@Game</p>
          <p className="mt-1">Tous les prix sont en euros TTC</p>
        </div>
      </div>
    </div>
  );
};

export default TarificationPage;
