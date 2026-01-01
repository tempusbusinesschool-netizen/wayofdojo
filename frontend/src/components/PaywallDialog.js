import React, { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, X, Sparkles, Building2, CreditCard } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

const PLANS = {
  ninja: {
    id: "ninja",
    name: "Ninja individuel",
    emoji: "🥷",
    tagline: "Ton parcours personnel, sans engagement",
    price: "4,50 €",
    period: "/mois",
    trial: "3 mois gratuits",
    features: [
      { text: "Accès complet aux techniques de révision", included: true },
      { text: "Suivi personnel de progression", included: true },
      { text: "Journal privé de pratique", included: true },
      { text: "Défis communautaires non évaluatifs", included: true },
      { text: "Parcours autour des valeurs", included: true },
      { text: "Gamification douce (régularité, engagement)", included: true }
    ],
    conditions: [
      "3 mois gratuits",
      "Puis 4,50 € / mois",
      "Sans engagement",
      "Résiliable à tout moment"
    ],
    cta: "Commencer mon parcours Ninja",
    footer: "Un outil pour rester aligné avec ta pratique, pas pour te juger.",
    gradient: "from-amber-500 to-orange-500",
    borderColor: "border-amber-500/50",
    bgColor: "bg-amber-900/20"
  },
  dojo: {
    id: "dojo",
    name: "Offre Dojo",
    emoji: "🏯",
    tagline: "Un outil de gestion et d'animation pour les clubs",
    badge: "Réservé aux clubs et enseignants",
    price: "65 €",
    period: "/mois",
    trial: "10 jours gratuits",
    features: [
      { text: "Espace de gestion du dojo", included: true },
      { text: "Gestion des adhérents (nombre illimité)", included: true },
      { text: "Suivi de l'assiduité et de l'engagement", included: true },
      { text: "Défis collectifs internes", included: true },
      { text: "Validation symbolique « dojo-friendly »", included: true },
      { text: "Statistiques globales du club", included: true },
      { text: "Aucune évaluation technique", included: false },
      { text: "Aucun grade, diplôme ou certification", included: false }
    ],
    conditions: [
      "10 jours gratuits",
      "Puis 65 € / mois",
      "Engagement 12 mois",
      "Reconduction tacite annuelle"
    ],
    cta: "Activer l'espace Dojo",
    footer: "Un outil pour structurer et animer, sans interférer avec l'enseignement.",
    gradient: "from-cyan-500 to-blue-500",
    borderColor: "border-cyan-500/50",
    bgColor: "bg-cyan-900/20"
  }
};

function PlanCard({ plan, onSelect, loading, selected }) {
  return (
    <div
      className={`relative p-6 rounded-2xl border-2 transition-all ${
        selected
          ? `${plan.borderColor} ${plan.bgColor} scale-[1.02]`
          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
      }`}
    >
      {/* Badge */}
      {plan.badge && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-600 text-white text-xs">
          {plan.badge}
        </Badge>
      )}
      
      {/* Header */}
      <div className="text-center mb-4">
        <span className="text-4xl mb-2 block">{plan.emoji}</span>
        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
        <p className="text-slate-400 text-sm mt-1">{plan.tagline}</p>
      </div>
      
      {/* Price */}
      <div className="text-center mb-4">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl font-bold text-white">{plan.price}</span>
          <span className="text-slate-400">{plan.period}</span>
        </div>
        <Badge className={`mt-2 bg-gradient-to-r ${plan.gradient} text-white`}>
          {plan.trial}
        </Badge>
      </div>
      
      {/* Features */}
      <ul className="space-y-2 mb-4">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            {feature.included ? (
              <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            ) : (
              <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            )}
            <span className={feature.included ? 'text-slate-300' : 'text-slate-500'}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      
      {/* Conditions */}
      <div className="text-xs text-slate-500 mb-4 space-y-1">
        {plan.conditions.map((condition, idx) => (
          <p key={idx}>• {condition}</p>
        ))}
      </div>
      
      {/* CTA */}
      <Button
        onClick={() => onSelect(plan.id)}
        disabled={loading}
        className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white font-semibold py-3`}
      >
        {loading && selected ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Chargement...
          </span>
        ) : (
          <>👉 {plan.cta}</>
        )}
      </Button>
      
      {/* Footer */}
      <p className="text-center text-xs text-slate-500 mt-3 italic">
        {plan.footer}
      </p>
    </div>
  );
}

function PaywallDialog({ isOpen, onClose, onSubscribe, userEmail }) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const handleSelectPlan = async (planId) => {
    if (!userEmail) {
      toast.error("Connecte-toi pour souscrire à un abonnement");
      return;
    }
    
    setSelectedPlan(planId);
    setLoading(true);
    
    try {
      const originUrl = window.location.origin;
      
      const response = await axios.post(`${API}/subscriptions/checkout`, {
        plan_id: planId,
        origin_url: originUrl
      });
      
      if (response.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } else if (response.data.trial_started) {
        // Trial started without payment
        toast.success(response.data.message);
        onSubscribe(planId);
        onClose();
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(error.response?.data?.detail || "Erreur lors de la souscription");
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-2 border-slate-700 text-white p-0 overflow-hidden max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center pt-8 pb-4 px-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Choisis ton parcours
          </h2>
          <p className="text-slate-400">
            Commence gratuitement, sans carte bancaire
          </p>
        </div>
        
        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 px-6 pb-6">
          <PlanCard
            plan={PLANS.ninja}
            onSelect={handleSelectPlan}
            loading={loading}
            selected={selectedPlan === 'ninja'}
          />
          <PlanCard
            plan={PLANS.dojo}
            onSelect={handleSelectPlan}
            loading={loading}
            selected={selectedPlan === 'dojo'}
          />
        </div>
        
        {/* Footer mentions */}
        <div className="bg-slate-900/80 border-t border-slate-700 px-6 py-4">
          <div className="text-center text-xs text-slate-500 space-y-1">
            <p>🔒 L'application est indépendante de toute fédération.</p>
            <p>Elle ne délivre aucun grade, diplôme ou certification.</p>
            <p>Les abonnements sont gérés de manière sécurisée via Stripe.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PaywallDialog;
