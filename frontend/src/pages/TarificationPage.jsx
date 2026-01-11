import React, { useState } from 'react';
import { 
  Check, X, Zap, Building2, Crown, Shield, CreditCard, 
  Clock, Users, Award, Target, ChevronRight, Sparkles,
  Calendar, Star, Lock, GraduationCap, Heart, User,
  BookOpen, BarChart3, Headphones, FileText, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import subscriptionService from '@/services/subscriptionService';

const TarificationPage = ({ onBack, onSelectPlan, user, token, onLoginRequired }) => {
  const [selectedClubSize, setSelectedClubSize] = useState('small');
  const [loading, setLoading] = useState(null);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [billingType, setBillingType] = useState('monthly'); // monthly or yearly
  const [quoteForm, setQuoteForm] = useState({
    club_name: '',
    contact_name: '',
    email: '',
    phone: '',
    estimated_members: 200,
    message: ''
  });

  const clubPricing = {
    small: { label: '< 25 adhérents', price: 19.90, planId: 'club_petit' },
    medium: { label: '25 - 50 adhérents', price: 29.90, planId: 'club_moyen' },
    large: { label: '> 50 adhérents', price: 49.90, planId: 'club_grand' }
  };

  const handleSelectPlan = async (planId, withCard = true) => {
    // Check if user is logged in
    if (!user || !token) {
      toast.error('Veuillez vous connecter pour souscrire');
      if (onLoginRequired) onLoginRequired();
      return;
    }

    // Handle quote request for large clubs
    if (planId === 'club_grand') {
      setShowQuoteDialog(true);
      return;
    }

    setLoading(planId);

    try {
      if (withCard) {
        // Checkout with Stripe
        const result = await subscriptionService.checkoutWithCard(planId, token);
        // API returns 'url' not 'checkout_url'
        if (result.url) {
          window.location.href = result.url;
        } else {
          toast.error('Erreur lors de la création de la session de paiement');
        }
      } else {
        // Start trial without card
        const result = await subscriptionService.startTrial(planId, token);
        toast.success(result.message);
        if (onSelectPlan) onSelectPlan(planId, result);
      }
    } catch (error) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(null);
    }
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setLoading('quote');

    try {
      const result = await subscriptionService.requestQuote(quoteForm);
      toast.success(result.message);
      setShowQuoteDialog(false);
      setQuoteForm({
        club_name: '',
        contact_name: '',
        email: '',
        phone: '',
        estimated_members: 200,
        message: ''
      });
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'envoi du devis');
    } finally {
      setLoading(null);
    }
  };

  const getPlanId = (type) => {
    if (type === 'individual') {
      return billingType === 'yearly' ? 'utilisateur_annuel' : 'utilisateur_mensuel';
    }
    return clubPricing[selectedClubSize].planId;
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
              ← Précédent
            </Button>
          )}
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Offres de lancement
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choisissez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">licence</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Un outil professionnel, éthique et respectueux de la tradition martiale
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          
          {/* Licence Utilisateur unique */}
          <div className="relative rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ring-2 ring-amber-500 ring-offset-2 ring-offset-slate-900">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1">
                <Star className="w-3 h-3 mr-1" />
                Particuliers
              </Badge>
            </div>

            {/* Header */}
            <div className="mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4">
                <User className="w-7 h-7 text-white" />
              </div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Utilisateur unique</h2>
                <span className="text-amber-400 font-semibold text-sm">À partir de 5,99 €/mois</span>
              </div>
              <p className="text-slate-400">1 personne = 1 accès</p>
            </div>

            {/* Target audience */}
            <div className="mb-6 p-4 bg-slate-800/50 rounded-xl">
              <p className="text-xs text-amber-400 font-semibold mb-2">PUBLIC CIBLE</p>
              <div className="flex flex-wrap gap-2">
                {['Particuliers', 'Pratiquants', 'Éducateurs', 'Étudiants', 'Coachs'].map((item) => (
                  <span key={item} className="text-xs px-2 py-1 bg-slate-700 rounded-full text-slate-300">{item}</span>
                ))}
              </div>
            </div>

            {/* Pricing options */}
            <div className="space-y-4 mb-6">
              <button
                onClick={() => setBillingType('monthly')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  billingType === 'monthly' 
                    ? 'bg-amber-500/20 border-amber-500' 
                    : 'bg-slate-800/50 border-amber-500/20 hover:border-amber-500/50'
                }`}
              >
                <div className="text-left">
                  <p className="text-white font-semibold">Mensuel</p>
                  <p className="text-slate-400 text-sm">Sans engagement</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-white">5,99</span>
                  <span className="text-slate-400">€/mois</span>
                </div>
              </button>
              
              <button
                onClick={() => setBillingType('yearly')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  billingType === 'yearly' 
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500' 
                    : 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30 hover:border-amber-500/50'
                }`}
              >
                <div className="text-left">
                  <p className="text-white font-semibold">Annuel</p>
                  <p className="text-emerald-400 text-sm">Économisez 26%</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-white">39,90</span>
                  <span className="text-slate-400">€/an</span>
                  <p className="text-xs text-slate-500">soit 3,33€/mois</p>
                </div>
              </button>

              <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-white font-semibold">Tarif solidaire</p>
                    <p className="text-slate-400 text-sm">Étudiants & demandeurs d'emploi</p>
                  </div>
                </div>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  Sur demande
                </Badge>
              </div>
            </div>

            {/* Trial */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mb-6">
              <Clock className="w-4 h-4 text-white" />
              <span className="text-white font-semibold">30 jours gratuits</span>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {[
                { text: 'Accès complet à l\'application', included: true },
                { text: 'Parcours pédagogiques', included: true },
                { text: 'Scénarios Serious Game', included: true },
                { text: 'Mises à jour incluses', included: true },
                { text: 'Support utilisateur', included: true },
                { text: 'Gestion des adhérents', included: false },
                { text: 'Espace administrateur', included: false },
              ].map((feature, index) => (
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

            {/* CTA */}
            <Button
              onClick={() => handleSelectPlan(getPlanId('individual'))}
              disabled={loading === getPlanId('individual')}
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading === getPlanId('individual') ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  Commencer 30 jours gratuits
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Licence Club */}
          <div className="relative rounded-2xl bg-cyan-500/10 border-2 border-cyan-500/30 p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1">
                <Building2 className="w-3 h-3 mr-1" />
                Clubs & Associations
              </Badge>
            </div>

            {/* Header */}
            <div className="mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Club d'Aikido</h2>
                <span className="text-cyan-400 font-semibold text-sm">À partir de 19,90 €/mois</span>
              </div>
              <p className="text-slate-400">Licences illimitées + gestion adhérents</p>
            </div>

            {/* Target audience */}
            <div className="mb-6 p-4 bg-slate-800/50 rounded-xl">
              <p className="text-xs text-cyan-400 font-semibold mb-2">PUBLIC CIBLE</p>
              <div className="flex flex-wrap gap-2">
                {['Clubs d\'aïkido', 'Fédérations', 'Associations', 'Structures éducatives', 'Collectivités'].map((item) => (
                  <span key={item} className="text-xs px-2 py-1 bg-slate-700 rounded-full text-slate-300">{item}</span>
                ))}
              </div>
            </div>

            {/* Club size selector */}
            <div className="mb-6">
              <p className="text-sm text-slate-400 mb-3">Taille de votre structure :</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(clubPricing).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedClubSize(key)}
                    className={`p-3 rounded-lg text-center transition-all ${
                      selectedClubSize === key
                        ? 'bg-cyan-500/20 border-2 border-cyan-500'
                        : 'bg-slate-800/50 border-2 border-transparent hover:border-slate-600'
                    }`}
                  >
                    <p className="text-xs text-slate-400">{value.label}</p>
                    {value.price ? (
                      <p className="text-lg font-bold text-white">{value.price}€</p>
                    ) : (
                      <p className="text-sm font-semibold text-cyan-400">{value.label2}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected price display */}
            <div className="mb-6 p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
              <div className="flex items-baseline gap-1">
                {clubPricing[selectedClubSize].price ? (
                  <>
                    <span className="text-4xl font-bold text-white">
                      {clubPricing[selectedClubSize].price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xl text-slate-400">€</span>
                    <span className="text-slate-400">/mois</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-cyan-400">Contactez-nous pour un devis</span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1">TTC • Engagement 12 mois</p>
            </div>

            {/* Trial */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mb-6">
              <Clock className="w-4 h-4 text-white" />
              <span className="text-white font-semibold">30 jours gratuits</span>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {[
                { text: 'Accès complet à l\'application', included: true },
                { text: 'Accès illimité pour les adhérents', included: true },
                { text: 'Parcours pédagogiques', included: true },
                { text: 'Scénarios Serious Game', included: true },
                { text: 'Espace administrateur', included: true },
                { text: 'Gestion des adhérents', included: true },
                { text: 'Suivi des parcours', included: true },
                { text: 'Statistiques d\'usage', included: true },
                { text: 'Supports pédagogiques', included: true },
                { text: 'Mises à jour incluses', included: true },
                { text: 'Support utilisateur', included: true },
                { text: 'Accompagnement prise en main', included: true },
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-slate-300">{feature.text}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button
              onClick={() => handleSelectPlan(clubPricing[selectedClubSize].planId)}
              disabled={loading === clubPricing[selectedClubSize].planId}
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading === clubPricing[selectedClubSize].planId ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  Essayer 30 jours gratuits
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Value for clubs */}
        <div className="max-w-5xl mx-auto mb-12">
          <h3 className="text-xl font-bold text-center mb-6 text-cyan-400">
            ✨ Valeur ajoutée pour les clubs
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: Sparkles, text: 'Modernisation de l\'offre' },
              { icon: Users, text: 'Attractivité jeunes' },
              { icon: BookOpen, text: 'Outil pédagogique' },
              { icon: Award, text: 'Valorisation institutionnelle' },
              { icon: Target, text: 'Projets éducatifs' },
              { icon: BarChart3, text: 'Reporting financeurs' },
            ].map((item, index) => {
              const IconComp = item.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <IconComp className="w-5 h-5 text-cyan-400" />
                  <span className="text-slate-300 text-sm">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ethical Notice */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Cadre éthique & déontologique</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Chaque utilisateur et club s'engage à respecter les valeurs du Budo :
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-emerald-400 text-sm font-semibold mb-2">✓ Promouvoir</p>
                    <ul className="text-slate-400 text-sm space-y-1">
                      <li>• Non-violence</li>
                      <li>• Respect</li>
                      <li>• Inclusion & égalité</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-red-400 text-sm font-semibold mb-2">✗ Interdit</p>
                    <ul className="text-slate-400 text-sm space-y-1">
                      <li>• Détournement de l'outil</li>
                      <li>• Usage à des fins de domination</li>
                      <li>• Exclusion ou discrimination</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Important</h3>
                <p className="text-slate-400 text-sm">
                  Les abonnements <strong>ne permettent aucune évaluation technique, certification ou délivrance de grade</strong>. 
                  Aikido@Game ne remplace pas la pratique en dojo, mais l'enrichit par une approche contemporaine.
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

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
          <div className="space-y-4">
            <details className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 group">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium">
                Comment fonctionne la période d'essai ?
                <ChevronRight className="w-5 h-5 transform group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-slate-400 mt-4">
                <strong>Utilisateur unique</strong> : Profitez de 30 jours gratuits. Après cette période, 
                choisissez entre l'abonnement mensuel (5,99€/mois) ou annuel (39,90€/an).<br/><br/>
                <strong>Club</strong> : Essayez gratuitement pendant 30 jours. L'engagement de 12 mois 
                démarre après validation.
              </p>
            </details>
            
            <details className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 group">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium">
                Qu'est-ce que le tarif solidaire ?
                <ChevronRight className="w-5 h-5 transform group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-slate-400 mt-4">
                Nous proposons un tarif réduit pour les étudiants et demandeurs d'emploi. 
                Contactez-nous avec un justificatif pour en bénéficier.
              </p>
            </details>
            
            <details className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 group">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium">
                Comment résilier mon abonnement ?
                <ChevronRight className="w-5 h-5 transform group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-slate-400 mt-4">
                <strong>Utilisateur unique (mensuel)</strong> : Résiliez à tout moment depuis votre tableau de bord.<br/><br/>
                <strong>Club</strong> : Envoyez votre demande au moins 30 jours avant l'échéance annuelle 
                par email à contact@aikidoatgame.com.
              </p>
            </details>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-slate-500">
          <p>HUMAN KNOWLEDGE • Aikido@Game</p>
          <p className="mt-1">Un outil professionnel, éthique et au service du vivre ensemble</p>
        </div>
      </div>

      {/* Quote Request Dialog */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-cyan-400">
              Demande de devis personnalisé
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleQuoteSubmit} className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-slate-400">Nom du club / structure *</label>
              <Input
                required
                value={quoteForm.club_name}
                onChange={(e) => setQuoteForm({...quoteForm, club_name: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Ex: Aikido Paris Centre"
              />
            </div>
            
            <div>
              <label className="text-sm text-slate-400">Nom du contact *</label>
              <Input
                required
                value={quoteForm.contact_name}
                onChange={(e) => setQuoteForm({...quoteForm, contact_name: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Ex: Jean Dupont"
              />
            </div>
            
            <div>
              <label className="text-sm text-slate-400">Email *</label>
              <Input
                required
                type="email"
                value={quoteForm.email}
                onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="contact@monclub.fr"
              />
            </div>
            
            <div>
              <label className="text-sm text-slate-400">Téléphone</label>
              <Input
                value={quoteForm.phone}
                onChange={(e) => setQuoteForm({...quoteForm, phone: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="06 12 34 56 78"
              />
            </div>
            
            <div>
              <label className="text-sm text-slate-400">Nombre d'adhérents estimé *</label>
              <Input
                required
                type="number"
                min="150"
                value={quoteForm.estimated_members}
                onChange={(e) => setQuoteForm({...quoteForm, estimated_members: parseInt(e.target.value)})}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div>
              <label className="text-sm text-slate-400">Message (optionnel)</label>
              <Textarea
                value={quoteForm.message}
                onChange={(e) => setQuoteForm({...quoteForm, message: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Précisez vos besoins spécifiques..."
                rows={3}
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading === 'quote'}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90"
            >
              {loading === 'quote' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Envoyer ma demande'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TarificationPage;
