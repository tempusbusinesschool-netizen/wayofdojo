import React, { useEffect, useState, useCallback, useRef } from "react";
import "@/App.css";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster, toast } from "sonner";
import { Target, Award, Circle, Eye, TrendingUp, BookOpen, Swords, BarChart3, CheckCircle2, Clock, Flame, ScrollText, ChevronDown, ChevronUp, Shield, Users, Heart, AlertTriangle, UserPlus, PenTool, Trash2, Edit, Mail, Phone, MapPin, Baby, User, Lock, LogOut, KeyRound, Plus, Download, FileText } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Admin password (in production, this should be in backend)
const ADMIN_PASSWORD = "aikido2024";

// Mastery level configuration
const MASTERY_LEVELS = {
  not_started: { label: "Non démarré", color: "bg-slate-500", icon: Circle, weight: 0 },
  learning: { label: "En apprentissage", color: "bg-amber-500", icon: BookOpen, weight: 33 },
  practiced: { label: "Pratiqué", color: "bg-blue-500", icon: Target, weight: 66 },
  mastered: { label: "Maîtrisé", color: "bg-emerald-500", icon: Award, weight: 100 }
};

// Règlement Intérieur Data
const REGLEMENT_INTERIEUR = {
  title: "Règlement Intérieur",
  subtitle: "Club d'Aïkido affilié à la FFAAA (Fédération Française d'Aïkido, Aïkibudo et Affinitaires)",
  clubName: "AIKIDO LA RIVIÈRE",
  articles: [
    {
      id: 1,
      title: "Cadre général",
      icon: "Shield",
      content: [
        "Le présent règlement intérieur complète les statuts de l'association et s'inscrit dans le respect :",
        "• Des statuts et règlements de la FFAAA ;",
        "• Des principes et de l'éthique de l'aïkido tels que définis par la fédération ;",
        "• De la législation en vigueur applicable aux associations sportives.",
        "Il est applicable à l'ensemble des adhérents, adultes et mineurs, ainsi qu'à leurs représentants légaux pour ce qui concerne les pratiquants mineurs."
      ]
    },
    {
      id: 2,
      title: "Valeurs et engagement moral",
      icon: "Heart",
      content: [
        "L'aïkido repose sur des principes fondamentaux de respect, de non-violence, de contrôle de soi et de responsabilité individuelle.",
        "Tout adhérent s'engage à :",
        "• Respecter les enseignants, les dirigeants, les pratiquants et les visiteurs ;",
        "• Adopter une attitude conforme à l'éthique martiale de l'aïkido ;",
        "• Se conformer aux décisions pédagogiques et disciplinaires prises dans l'intérêt collectif."
      ]
    },
    {
      id: 3,
      title: "Conditions d'adhésion",
      icon: "Users",
      content: [
        "L'adhésion au club est subordonnée à :",
        "• L'acquittement de la cotisation annuelle ;",
        "• La fourniture d'un certificat médical conforme à la réglementation fédérale ;",
        "• La prise de licence FFAAA en cours de validité ;",
        "• L'acceptation sans réserve du présent règlement intérieur.",
        "Aucune pratique ne peut avoir lieu sans dossier administratif complet."
      ]
    },
    {
      id: 4,
      title: "Organisation des entraînements",
      icon: "Clock",
      content: [
        "4.1 Horaires et assiduité",
        "Les adhérents sont tenus de respecter les horaires des cours. Tout retard doit rester exceptionnel et se faire dans le respect du déroulement du cours.",
        "",
        "4.2 Tenue et équipement",
        "La pratique impose :",
        "• Le port d'un keikogi propre et en bon état ;",
        "• Ongles courts, hygiène corporelle irréprochable ;",
        "• Absence totale de bijoux, montres ou objets dangereux."
      ]
    },
    {
      id: 5,
      title: "Règles de vie collective sur le tatami",
      icon: "Users",
      content: [
        "5.1 Sécurité et responsabilité",
        "Chaque pratiquant est responsable de sa pratique et de celle de ses partenaires. Il est strictement interdit :",
        "• D'exécuter des techniques non maîtrisées ou dangereuses ;",
        "• D'imposer une intensité inadaptée à l'âge, au grade ou à l'état physique du partenaire ;",
        "• De poursuivre un entraînement en cas de blessure non signalée.",
        "",
        "5.2 Respect de l'enseignant",
        "Les consignes de l'enseignant font autorité sur le tatami. Toute contestation ou attitude perturbatrice est proscrite pendant le cours.",
        "",
        "5.3 Respect des lieux",
        "Les adhérents participent au nettoyage, au rangement et au respect des locaux et du matériel mis à disposition."
      ]
    },
    {
      id: 6,
      title: "Dispositions spécifiques aux mineurs",
      icon: "Shield",
      content: [
        "Les pratiquants mineurs :",
        "• Sont placés sous la responsabilité de leurs représentants légaux en dehors des horaires stricts des cours ;",
        "• Doivent adopter un comportement respectueux et attentif, conforme aux règles éducatives du club.",
        "",
        "Les représentants légaux s'engagent à :",
        "• Informer le club de toute situation médicale ou comportementale particulière ;",
        "• Respecter les décisions pédagogiques et disciplinaires prises par les enseignants.",
        "",
        "Le club décline toute responsabilité avant le début et après la fin effective des cours."
      ]
    },
    {
      id: 7,
      title: "Comportements interdits",
      icon: "AlertTriangle",
      content: [
        "Sont formellement interdits au sein du club, pour les adultes comme pour les mineurs :",
        "• Toute forme de violence physique ou verbale ;",
        "• Les propos ou comportements discriminatoires, sexistes, racistes ou humiliants ;",
        "• Le harcèlement, les menaces, les pressions ou toute atteinte à la dignité des personnes ;",
        "• L'usage de substances illicites ou l'état d'ivresse dans l'enceinte du club."
      ]
    },
    {
      id: 8,
      title: "Discipline et sanctions",
      icon: "Shield",
      content: [
        "8.1 Principes",
        "Tout manquement au présent règlement, aux statuts ou aux règles fédérales peut entraîner une sanction disciplinaire.",
        "",
        "8.2 Échelle des sanctions",
        "• Rappel à l'ordre verbal ;",
        "• Avertissement écrit ;",
        "• Exclusion temporaire des entraînements ;",
        "• Exclusion définitive du club, sans remboursement de la cotisation.",
        "",
        "8.3 Procédure disciplinaire",
        "Toute sanction supérieure à l'avertissement écrit implique l'audition de l'adhérent et une décision prise collégialement par le comité directeur."
      ]
    },
    {
      id: 9,
      title: "Comportement hors du dojo",
      icon: "Users",
      content: [
        "Tout comportement portant atteinte à l'image du club, de la FFAAA ou de l'aïkido, y compris en dehors des locaux, peut faire l'objet d'une sanction disciplinaire."
      ]
    },
    {
      id: 10,
      title: "Assurance et responsabilité",
      icon: "Shield",
      content: [
        "Chaque adhérent est couvert par l'assurance fédérale FFAAA dans le cadre de la pratique déclarée.",
        "Le club décline toute responsabilité en cas de non-respect des consignes de sécurité ou du présent règlement."
      ]
    },
    {
      id: 11,
      title: "Entrée en vigueur",
      icon: "ScrollText",
      content: [
        "Le présent règlement intérieur entre en vigueur après validation par le comité directeur et est porté à la connaissance de tous les adhérents."
      ]
    },
    {
      id: 12,
      title: "Prévention et traitement des violences",
      icon: "AlertTriangle",
      content: [
        "12.1 Principe de tolérance zéro",
        "Le club adopte une politique de tolérance zéro à l'égard de toute forme de violence, d'abus ou de comportement inapproprié.",
        "",
        "12.2 Obligation de signalement",
        "Tout membre du club, témoin ou victime, est encouragé à signaler sans délai à un membre du bureau ou à l'enseignant référent.",
        "",
        "12.3 Protection des mineurs",
        "Le club reconnaît une obligation renforcée de protection des mineurs."
      ]
    },
    {
      id: 13,
      title: "Fonctionnement de l'association",
      icon: "Users",
      content: [
        "Activité Sportive : Aïkido affilié à la FFAAA - Adultes et Enfants (à partir de 7 ans)",
        "",
        "Instructeurs :",
        "• Madame Céline ROSETTE - Ceinture noire 3e Dan",
        "• Madame Yeza LUCAS – Ceinture noire 2e Dan"
      ]
    }
  ]
};

// Les déplacements Data
const DEPLACEMENTS_DATA = {
  title: "Les Déplacements",
  subtitle: "Élément fondamental de la pratique de l'Aïkido",
  introduction: `Le déplacement du corps est un élément fondamental de la pratique : il permet de passer d'une garde à une autre, d'une situation à une autre, et d'adapter sa réponse à l'action du partenaire. La façon de poser le pied, de le lever, de pivoter ou de reculer constitue souvent une « signature » propre à chaque école.

Les déplacements révèlent le niveau réel de maîtrise du pratiquant : c'est par eux que se construit la stabilité, puis la liberté de mouvement. Miyamoto Musashi insiste d'ailleurs sur l'importance des manières de se mouvoir sabre en main dans le Gorin no Sho (Traité des Cinq Roues, vers 1645).

Chaque tradition possède ses spécificités : le Katori Shintō Ryū ne se déplace pas comme la Hyōhō Niten Ichi Ryū, et ces approches diffèrent elles-mêmes de celles rencontrées en aïkido. Dans notre pratique, on retrouve néanmoins les déplacements classiques de l'aïkido, adaptés au travail au bokken.`,
  principaux: {
    title: "Les principaux déplacements",
    intro: `À l'origine de toute marche et de tout déplacement, il y a le pas. En japonais, le kanji ashi renvoie au « pied », mais aussi, par extension, au « pas ». Pour exécuter correctement une technique, il est indispensable de savoir se déplacer avec précision, équilibre et intention.

Avant de maîtriser les déplacements complexes, il convient de connaître les pas de base, les appuis et les modes de propulsion. Cet apprentissage implique une réflexion sur :`,
    points: [
      "la répartition du poids sur les pieds",
      "la qualité des appuis",
      "la posture du dos",
      "le placement et l'engagement du bassin"
    ],
    conclusion: "Autrement dit, apprendre à marcher efficacement sabre en main constitue une véritable remise en question : la marche devient un acte technique."
  },
  directions: {
    title: "Directions",
    intro: "Les directions principales sont :",
    items: [
      { name: "mae", description: "vers l'avant" },
      { name: "ushiro", description: "vers l'arrière" },
      { name: "migi", description: "vers la droite" },
      { name: "hidari", description: "vers la gauche" }
    ],
    conclusion: "Mais choisir une direction ne suffit pas : il faut aussi savoir comment poser le pied."
  },
  posePied: {
    title: "Pose du pied",
    content: `De manière générale, la pointe du pied avance d'abord et touche le sol juste avant le talon. En préparation au déplacement, le talon est souvent légèrement décollé afin de maintenir une tension dans les jambes et de conserver des appuis dynamiques sur l'avant du pied.

Cette manière de marcher s'explique historiquement par le port du sabre : une marche trop "lourde" ou un impact trop marqué auraient secoué l'arme au point de la faire sortir du fourreau.`
  },
  troisPas: {
    title: "Trois pas essentiels",
    pas: [
      {
        name: "Ayumi ashi",
        description: "Ayumi ashi est le pas naturel de marche (parfois appelé « pas romain »). Il consiste à avancer comme dans la vie quotidienne, et s'utilise notamment pour progresser directement vers l'adversaire, dans une dynamique simple et lisible."
      },
      {
        name: "Okuri ashi / Tsugi ashi",
        description: `Okuri ashi (pas "envoyé", souvent assimilé à un pas chassé) consiste à faire avancer le pied avant dans la direction choisie, puis à faire suivre le pied arrière comme s'il était relié par un élastique.

La forme inverse est tsugi ashi ("pas qui suit") : le pied arrière propulse le corps et, lorsqu'il rejoint presque le pied avant, celui-ci avance immédiatement.

Ces deux formes sont souvent regroupées sous l'appellation générale de pas chassés, très utiles pour maintenir la distance, conserver l'axe et éviter les ruptures d'équilibre.`
      },
      {
        name: "Hiraki ashi",
        description: `Moins connu, hiraki ashi (pas latéral) sert à "ouvrir" un passage pour déplacer le corps sur le côté. Très utilisé dans le travail au sabre face à un partenaire, il permet de sortir de la ligne d'attaque tout en conservant la capacité de couper : esquiver pour trancher, sans s'exposer inutilement.`
      }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════════
// DÉPLACEMENTS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════
function DeplacementsSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
      <CardHeader 
        className="cursor-pointer hover:bg-slate-800/50 transition-colors rounded-t-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">{DEPLACEMENTS_DATA.title}</CardTitle>
              <CardDescription className="text-slate-400">{DEPLACEMENTS_DATA.subtitle}</CardDescription>
            </div>
          </div>
          <div className="text-slate-400">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Introduction */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {DEPLACEMENTS_DATA.introduction}
            </p>
          </div>

          {/* Principaux déplacements */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Swords className="w-5 h-5 text-orange-400" />
              {DEPLACEMENTS_DATA.principaux.title}
            </h3>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                {DEPLACEMENTS_DATA.principaux.intro}
              </p>
              <ul className="space-y-1 ml-4 mb-3">
                {DEPLACEMENTS_DATA.principaux.points.map((point, idx) => (
                  <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    {point}
                  </li>
                ))}
              </ul>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                {DEPLACEMENTS_DATA.principaux.conclusion}
              </p>
            </div>
          </div>

          {/* Directions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-400" />
              {DEPLACEMENTS_DATA.directions.title}
            </h3>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-300 text-sm mb-3">{DEPLACEMENTS_DATA.directions.intro}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                {DEPLACEMENTS_DATA.directions.items.map((dir, idx) => (
                  <div key={idx} className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <p className="text-orange-400 font-semibold text-lg">{dir.name}</p>
                    <p className="text-slate-400 text-xs">{dir.description}</p>
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-sm italic">{DEPLACEMENTS_DATA.directions.conclusion}</p>
            </div>
          </div>

          {/* Pose du pied */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Circle className="w-5 h-5 text-orange-400" />
              {DEPLACEMENTS_DATA.posePied.title}
            </h3>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {DEPLACEMENTS_DATA.posePied.content}
              </p>
            </div>
          </div>

          {/* Trois pas essentiels */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-400" />
              {DEPLACEMENTS_DATA.troisPas.title}
            </h3>
            <div className="space-y-3">
              {DEPLACEMENTS_DATA.troisPas.pas.map((pas, idx) => (
                <Card key={idx} className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <h4 className="text-orange-400 font-semibold mb-2">{pas.name}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                      {pas.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// SIGNATURE PAD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════
function SignaturePad({ onSignatureChange, label }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (isDrawing && hasSignature) {
      const canvas = canvasRef.current;
      const signatureData = canvas.toDataURL('image/png');
      onSignatureChange(signatureData);
    }
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSignatureChange(null);
  };

  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={300}
          height={100}
          className="border border-slate-600 rounded-lg bg-white cursor-crosshair w-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {hasSignature && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={clearSignature}
            className="absolute top-1 right-1 text-slate-500 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
      <p className="text-xs text-slate-500">Signez dans le cadre ci-dessus</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// ADMIN LOGIN DIALOG
// ═══════════════════════════════════════════════════════════════════════════════════
function AdminLoginDialog({ isOpen, onClose, onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Store admin session
        sessionStorage.setItem('aikido_admin', 'true');
        toast.success("Connexion administrateur réussie");
        onSuccess();
        onClose();
        setPassword('');
      } else {
        setError('Mot de passe incorrect');
        toast.error("Mot de passe incorrect");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            Espace Administrateur
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <p className="text-slate-400 text-sm">
              Veuillez entrer le mot de passe administrateur pour accéder à la gestion des adhérents.
            </p>
          </div>
          
          <div>
            <Label className="text-slate-300">Mot de passe</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez le mot de passe"
              className="bg-slate-700 border-slate-600 text-white"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading || !password}
              className="flex-1 bg-cyan-600 hover:bg-cyan-500"
            >
              {loading ? "Vérification..." : "Se connecter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// MEMBRE REGISTRATION FORM (Enfant ou Adulte)
// ═══════════════════════════════════════════════════════════════════════════════════
function MemberRegistrationForm({ onSuccess, onCancel, registrationType = 'child' }) {
  const isChildRegistration = registrationType === 'child';
  
  const [formData, setFormData] = useState({
    parent_first_name: '',
    parent_last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    emergency_contact: '',
    is_adult_member: !isChildRegistration,
    children: [],
    reglement_accepted: false,
    signature_data: null
  });
  const [loading, setLoading] = useState(false);
  const [newChild, setNewChild] = useState({ first_name: '', last_name: '', birth_date: '' });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addChild = () => {
    if (newChild.first_name && newChild.last_name) {
      setFormData(prev => ({
        ...prev,
        children: [...prev.children, { ...newChild, id: `child-${Date.now()}`, status: 'pending' }]
      }));
      setNewChild({ first_name: '', last_name: '', birth_date: '' });
    }
  };

  const removeChild = (index) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.reglement_accepted) {
      toast.error("Veuillez accepter le règlement intérieur");
      return;
    }
    
    if (!formData.signature_data) {
      toast.error("Veuillez signer le formulaire");
      return;
    }
    
    if (isChildRegistration && formData.children.length === 0) {
      toast.error("Veuillez ajouter au moins un enfant");
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${API}/members`, formData);
      toast.success("Inscription enregistrée avec succès !");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header with registration type */}
      <div className={`p-3 rounded-lg ${isChildRegistration ? 'bg-purple-900/30 border border-purple-700' : 'bg-cyan-900/30 border border-cyan-700'}`}>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          {isChildRegistration ? (
            <>
              <Baby className="w-5 h-5 text-purple-400" />
              Inscription Enfant
            </>
          ) : (
            <>
              <User className="w-5 h-5 text-cyan-400" />
              Inscription Adulte
            </>
          )}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {isChildRegistration 
            ? "Formulaire d'inscription pour un ou plusieurs enfants"
            : "Formulaire d'inscription pour un adulte pratiquant"
          }
        </p>
      </div>

      {/* Parent/Adult Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-400" />
          {isChildRegistration ? "Informations du responsable légal" : "Informations de l'adhérent"}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Prénom *</Label>
            <Input
              value={formData.parent_first_name}
              onChange={(e) => handleChange('parent_first_name', e.target.value)}
              required
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-300">Nom *</Label>
            <Input
              value={formData.parent_last_name}
              onChange={(e) => handleChange('parent_last_name', e.target.value)}
              required
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Email *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-300">Téléphone *</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>
        
        <div>
          <Label className="text-slate-300">Adresse</Label>
          <Input
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Ville</Label>
            <Input
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-300">Code postal</Label>
            <Input
              value={formData.postal_code}
              onChange={(e) => handleChange('postal_code', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>
        
        <div>
          <Label className="text-slate-300">Numéro d&apos;urgence *</Label>
          <Input
            type="tel"
            value={formData.emergency_contact}
            onChange={(e) => handleChange('emergency_contact', e.target.value)}
            placeholder="Numéro à contacter en cas d'urgence"
            required
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>
      
      {/* Children Info - Only for child registration */}
      {isChildRegistration && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Baby className="w-5 h-5 text-purple-400" />
            Enfant(s) à inscrire *
          </h3>
          
          {formData.children.length > 0 && (
            <div className="space-y-2">
              {formData.children.map((child, idx) => (
                <div key={idx} className="flex items-center justify-between bg-purple-900/30 border border-purple-700 p-3 rounded-lg">
                  <span className="text-white flex items-center gap-2">
                    <Baby className="w-4 h-4 text-purple-400" />
                    {child.first_name} {child.last_name}
                    {child.birth_date && ` (né(e) le ${new Date(child.birth_date).toLocaleDateString('fr-FR')})`}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeChild(idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <div className="bg-slate-700/50 p-4 rounded-lg space-y-3">
            <p className="text-sm text-slate-400 mb-2">Ajouter un enfant :</p>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Prénom de l'enfant"
                value={newChild.first_name}
                onChange={(e) => setNewChild(prev => ({ ...prev, first_name: e.target.value }))}
                className="bg-slate-600 border-slate-500 text-white"
              />
              <Input
                placeholder="Nom de l'enfant"
                value={newChild.last_name}
                onChange={(e) => setNewChild(prev => ({ ...prev, last_name: e.target.value }))}
                className="bg-slate-600 border-slate-500 text-white"
              />
            </div>
            <div className="flex gap-3">
              <Input
                type="date"
                placeholder="Date de naissance"
                value={newChild.birth_date}
                onChange={(e) => setNewChild(prev => ({ ...prev, birth_date: e.target.value }))}
                className="bg-slate-600 border-slate-500 text-white flex-1"
              />
              <Button
                type="button"
                onClick={addChild}
                disabled={!newChild.first_name || !newChild.last_name}
                className="bg-purple-600 hover:bg-purple-500"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Signature */}
      <div className="space-y-4 border-t border-slate-700 pt-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="accept_reglement"
            checked={formData.reglement_accepted}
            onCheckedChange={(checked) => handleChange('reglement_accepted', checked)}
          />
          <Label htmlFor="accept_reglement" className="text-slate-300 cursor-pointer">
            J&apos;ai lu et j&apos;accepte le règlement intérieur du club *
          </Label>
        </div>
        
        <SignaturePad
          label="Signature de l'adhérent ou du représentant légal *"
          onSignatureChange={(sig) => handleChange('signature_data', sig)}
        />
      </div>
      
      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500"
        >
          {loading ? "Enregistrement..." : "Valider l'inscription"}
        </Button>
      </div>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// MEMBER CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════
function MemberCard({ member, onValidate, onDelete, onValidateChild, onDeleteChild, isChild = false, parentInfo = null }) {
  const getStatusBadge = (status) => {
    const config = {
      pending: { label: "En attente", color: "bg-amber-500" },
      active: { label: "Actif", color: "bg-emerald-500" },
      inactive: { label: "Inactif", color: "bg-slate-500" }
    };
    const { label, color } = config[status] || config.pending;
    return <Badge className={`${color} text-white text-xs`}>{label}</Badge>;
  };

  if (isChild) {
    const childStatus = member.status || 'pending';
    // Card for a child
    return (
      <Card className="bg-slate-700/50 border-slate-600">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {parentInfo?.member_id && (
                  <Badge className="bg-slate-600 text-cyan-300 text-xs font-mono">
                    {parentInfo.member_id}
                  </Badge>
                )}
                <span className="font-semibold text-white flex items-center gap-2">
                  <Baby className="w-4 h-4 text-purple-400" />
                  {member.first_name} {member.last_name}
                </span>
                {getStatusBadge(childStatus)}
              </div>
              {member.birth_date && (
                <p className="text-sm text-slate-400">
                  Né(e) le : {new Date(member.birth_date).toLocaleDateString('fr-FR')}
                </p>
              )}
              <div className="text-xs text-slate-500 mt-2 p-2 bg-slate-800/50 rounded">
                <p className="font-medium text-slate-400">Responsable :</p>
                <p className="text-slate-300">{parentInfo?.parent_first_name} {parentInfo?.parent_last_name}</p>
                <p className="flex items-center gap-1 mt-1">
                  <Phone className="w-3 h-3" /> {parentInfo?.phone}
                </p>
                {parentInfo?.emergency_contact && (
                  <p className="flex items-center gap-1 text-orange-400">
                    <AlertTriangle className="w-3 h-3" /> Urgence: {parentInfo.emergency_contact}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 ml-2">
              {childStatus === 'pending' && (
                <Button
                  size="sm"
                  onClick={() => onValidateChild && onValidateChild(parentInfo?.id, member.id)}
                  className="bg-emerald-600 hover:bg-emerald-500"
                  title="Valider l'inscription"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteChild && onDeleteChild(parentInfo?.id, member.id, `${member.first_name} ${member.last_name}`)}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                title="Supprimer l'inscription"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Card for an adult member
  return (
    <Card className="bg-slate-700/50 border-slate-600">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {member.member_id && (
                <Badge className="bg-slate-600 text-cyan-300 text-xs font-mono">
                  {member.member_id}
                </Badge>
              )}
              <span className="font-semibold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                {member.parent_first_name} {member.parent_last_name}
              </span>
              {getStatusBadge(member.status)}
              <Badge className="bg-cyan-600 text-white text-xs">Adulte adhérent</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400 flex-wrap">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" /> {member.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> {member.phone}
              </span>
            </div>
            {(member.address || member.city || member.postal_code) && (
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <MapPin className="w-3 h-3" />
                {[member.address, member.postal_code, member.city].filter(Boolean).join(', ')}
              </div>
            )}
            {member.emergency_contact && (
              <div className="flex items-center gap-1 text-sm text-orange-400">
                <AlertTriangle className="w-3 h-3" />
                Urgence: {member.emergency_contact}
              </div>
            )}
            {member.reglement_signed_date && (
              <p className="text-xs text-emerald-400">
                ✓ Règlement signé le {new Date(member.reglement_signed_date).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {member.status === 'pending' && (
              <Button
                size="sm"
                onClick={() => onValidate(member.id)}
                className="bg-emerald-600 hover:bg-emerald-500"
              >
                <CheckCircle2 className="w-4 h-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(member.id)}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// MEMBERS LIST COMPONENT (avec onglets Enfants/Adultes)
// ═══════════════════════════════════════════════════════════════════════════════════
function MembersList({ members, onRefresh, onRegisterChild, onRegisterAdult }) {
  const [activeTab, setActiveTab] = useState("children");

  // Listen for tab change events from stats dashboard
  useEffect(() => {
    const handleTabChange = (event) => {
      if (event.detail === 'children' || event.detail === 'adults') {
        setActiveTab(event.detail);
      }
    };
    window.addEventListener('setMembersTab', handleTabChange);
    return () => window.removeEventListener('setMembersTab', handleTabChange);
  }, []);

  const handleValidate = async (memberId) => {
    try {
      await axios.post(`${API}/members/${memberId}/validate`);
      toast.success("Adhérent validé !");
      onRefresh();
    } catch (error) {
      toast.error("Erreur lors de la validation");
    }
  };

  const handleValidateChild = async (memberId, childId) => {
    try {
      await axios.post(`${API}/members/${memberId}/validate-child/${childId}`);
      toast.success("Enfant validé !");
      onRefresh();
    } catch (error) {
      toast.error("Erreur lors de la validation de l'enfant");
    }
  };

  const handleDeleteChild = async (memberId, childId, childName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'inscription de ${childName} ?`)) return;
    try {
      await axios.delete(`${API}/members/${memberId}/delete-child/${childId}`);
      toast.success("Inscription de l'enfant supprimée");
      onRefresh();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet adhérent ?")) return;
    try {
      await axios.delete(`${API}/members/${memberId}`);
      toast.success("Adhérent supprimé");
      onRefresh();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Extract all children from all members
  const allChildren = members.flatMap(member => 
    (member.children || []).map(child => ({
      ...child,
      parentInfo: member
    }))
  );

  // Filter adult members (those who are adult_member themselves)
  const adultMembers = members.filter(member => member.is_adult_member);

  // Count stats
  const childrenCount = allChildren.length;
  const adultsCount = adultMembers.length;

  return (
    <div className="space-y-4">
      {/* Tabs for Children and Adults */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800 border-slate-700 w-full grid grid-cols-2">
          <TabsTrigger 
            value="children" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Baby className="w-4 h-4 mr-2" />
            Enfants ({childrenCount})
          </TabsTrigger>
          <TabsTrigger 
            value="adults" 
            className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
          >
            <User className="w-4 h-4 mr-2" />
            Adultes ({adultsCount})
          </TabsTrigger>
        </TabsList>

        {/* Children Tab */}
        <TabsContent value="children" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button
              onClick={onRegisterChild}
              className="bg-purple-600 hover:bg-purple-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Inscrire un enfant
            </Button>
          </div>
          {childrenCount === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Baby className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun enfant inscrit</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allChildren.map((child, idx) => (
                <MemberCard
                  key={`child-${child.id || idx}`}
                  member={child}
                  isChild={true}
                  parentInfo={child.parentInfo}
                  onValidate={handleValidate}
                  onValidateChild={handleValidateChild}
                  onDeleteChild={handleDeleteChild}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Adults Tab */}
        <TabsContent value="adults" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button
              onClick={onRegisterAdult}
              className="bg-cyan-600 hover:bg-cyan-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Inscrire un adulte
            </Button>
          </div>
          {adultsCount === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun adulte adhérent</p>
            </div>
          ) : (
            <div className="space-y-3">
              {adultMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  isChild={false}
                  onValidate={handleValidate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Card */}
      <Card className="bg-slate-800/50 border-slate-700 mt-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Résumé des inscriptions</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1 text-purple-400">
                <Baby className="w-4 h-4" /> {childrenCount} enfant(s)
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <User className="w-4 h-4" /> {adultsCount} adulte(s)
              </span>
              <span className="flex items-center gap-1 text-slate-300 font-semibold">
                Total: {childrenCount + adultsCount} adhérent(s)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// RÈGLEMENT INTÉRIEUR COMPONENT (avec signature)
// ═══════════════════════════════════════════════════════════════════════════════════
function ReglementInterieur({ onRegister, isAdmin, onAdminClick }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedArticles, setExpandedArticles] = useState(new Set());
  const [showRegistration, setShowRegistration] = useState(false);

  const toggleArticle = (articleId) => {
    const newExpanded = new Set(expandedArticles);
    if (newExpanded.has(articleId)) {
      newExpanded.delete(articleId);
    } else {
      newExpanded.add(articleId);
    }
    setExpandedArticles(newExpanded);
  };

  const expandAll = () => {
    setExpandedArticles(new Set(REGLEMENT_INTERIEUR.articles.map(a => a.id)));
  };

  const getIconComponent = (iconName) => {
    const icons = { Shield, Heart, Users, Clock, AlertTriangle, ScrollText };
    return icons[iconName] || ScrollText;
  };

  const handleNewInscription = () => {
    if (isAdmin) {
      setShowRegistration(true);
    } else {
      onAdminClick();
    }
  };

  return (
    <>
      <Card className="mb-8 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                <ScrollText className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">{REGLEMENT_INTERIEUR.title}</CardTitle>
                <CardDescription className="text-slate-400">{REGLEMENT_INTERIEUR.subtitle}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleNewInscription}
                className={isAdmin ? "bg-emerald-600 hover:bg-emerald-500" : "bg-slate-600 hover:bg-slate-500"}
              >
                {isAdmin ? (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Nouvelle inscription
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Administrateur
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-white hover:bg-slate-700"
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="space-y-4">
            {/* Club Header */}
            <div className="text-center py-4 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">{REGLEMENT_INTERIEUR.clubName}</h2>
              <p className="text-slate-400 text-sm mt-1">{REGLEMENT_INTERIEUR.subtitle}</p>
              <p className="text-slate-500 text-xs mt-2">Document établi le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            
            {/* Expand All Button */}
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={expandAll}
                className="text-cyan-400 hover:text-cyan-300"
              >
                Tout afficher
              </Button>
            </div>
            
            {/* Articles */}
            {REGLEMENT_INTERIEUR.articles.map((article) => {
              const IconComponent = getIconComponent(article.icon);
              const isArticleExpanded = expandedArticles.has(article.id);
              
              return (
                <Card key={article.id} className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleArticle(article.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-600">
                          <IconComponent className="w-4 h-4 text-cyan-400" />
                        </div>
                        <h3 className="font-semibold text-white text-sm">
                          Article {article.id} - {article.title}
                        </h3>
                      </div>
                      <div className="text-slate-400">
                        {isArticleExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                    
                    {isArticleExpanded && (
                      <div className="mt-4 space-y-2 pl-12">
                        {article.content.map((paragraph, idx) => (
                          <p key={idx} className={`text-slate-300 text-sm leading-relaxed ${!paragraph ? 'h-2' : ''}`}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        )}
      </Card>
      
      {/* Registration Dialog */}
      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-cyan-400" />
              Nouvelle inscription
            </DialogTitle>
          </DialogHeader>
          <MemberRegistrationForm
            onSuccess={() => {
              setShowRegistration(false);
              if (onRegister) onRegister();
            }}
            onCancel={() => setShowRegistration(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// STATISTICS DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════
function StatisticsDashboard({ statistics, membersStats, onGradeClick, onFilterClick, activeFilter, isAdmin, onMembersClick, kyuLevels, onExport }) {
  if (!statistics) return null;
  
  // Export progression to PDF with graphics
  const exportToPDF = async () => {
    if (!kyuLevels || kyuLevels.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    toast.info("Génération du PDF en cours...");

    try {
      // Dynamic import of jspdf
      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = 20;

      // Header
      doc.setFillColor(30, 41, 59); // slate-800
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
      
      // Date
      const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Document généré le ${today}`, pageWidth - margin, yPos, { align: 'right' });
      
      yPos += 10;

      // Global Statistics Box
      doc.setFillColor(241, 245, 249); // slate-100
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'F');
      
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('RÉSUMÉ GLOBAL', margin + 5, yPos + 8);
      
      // Stats in boxes
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

      // Progress bar visualization
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('PROGRESSION PAR GRADE', margin, yPos);
      yPos += 8;

      // Draw progress bars for each grade
      kyuLevels.forEach((kyu, index) => {
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = 20;
        }

        const masteredCount = kyu.techniques.filter(t => t.mastery_level === 'mastered').length;
        const inProgressCount = kyu.techniques.filter(t => t.mastery_level === 'learning' || t.mastery_level === 'practiced').length;
        const progressPercent = kyu.techniques.length > 0 
          ? Math.round((masteredCount / kyu.techniques.length) * 100) 
          : 0;
        
        // Grade name
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text(kyu.name, margin, yPos + 4);
        
        // Stats text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`${masteredCount}/${kyu.techniques.length} (${progressPercent}%)`, pageWidth - margin, yPos + 4, { align: 'right' });
        
        // Progress bar background
        const barX = margin + 35;
        const barWidth = pageWidth - 2 * margin - 70;
        const barHeight = 6;
        
        doc.setFillColor(226, 232, 240); // slate-200
        doc.roundedRect(barX, yPos, barWidth, barHeight, 2, 2, 'F');
        
        // Progress bar fill (mastered in green)
        if (progressPercent > 0) {
          // Parse kyu color or use default
          let r = 34, g = 197, b = 94; // default green
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

      // Detailed techniques table
      doc.addPage();
      yPos = 20;
      
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, pageWidth, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('DÉTAIL DES TECHNIQUES', pageWidth / 2, 15, { align: 'center' });
      
      yPos = 35;

      // Create table data
      kyuLevels.forEach((kyu) => {
        if (yPos > pageHeight - 50) {
          doc.addPage();
          yPos = 20;
        }

        const masteredCount = kyu.techniques.filter(t => t.mastery_level === 'mastered').length;
        const progressPercent = kyu.techniques.length > 0 
          ? Math.round((masteredCount / kyu.techniques.length) * 100) 
          : 0;

        // Grade header
        doc.setFillColor(51, 65, 85); // slate-700
        doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${kyu.name} - ${masteredCount}/${kyu.techniques.length} maîtrisées (${progressPercent}%)`, margin + 3, yPos + 6);
        
        yPos += 12;

        // Techniques table
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

      // Footer on last page
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Aikido La Rivière - Club affilié FFAAA', pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Save the PDF
      doc.save(`progression_aikido_${today.replace(/\//g, '-').replace(/ /g, '_')}.pdf`);
      
      toast.success("PDF généré avec succès !");
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  // Export progression to CSV
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

    // Create and download file
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `progression_aikido_${today.replace(/\//g, '-')}.csv`;
    link.click();
    
    toast.success("Progression exportée avec succès !");
  };

  return (
    <div className="mb-8 animate-fadeIn">
      {/* Export Buttons */}
      <div className="flex justify-end mb-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={exportToPDF}
          className="border-cyan-600 text-cyan-400 hover:bg-cyan-900/30 hover:text-cyan-300"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export PDF
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
      
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <Card 
          className={`bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${activeFilter === 'all' ? 'ring-2 ring-slate-400' : ''}`}
          onClick={() => onFilterClick && onFilterClick('all')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-700">
                <BookOpen className="w-5 h-5 text-slate-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statistics.total_techniques}</p>
                <p className="text-xs text-slate-400">Techniques</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`bg-gradient-to-br from-emerald-800 to-emerald-900 border-emerald-700 cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${activeFilter === 'mastered' ? 'ring-2 ring-emerald-400' : ''}`}
          onClick={() => onFilterClick && onFilterClick('mastered')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statistics.mastered_techniques}</p>
                <p className="text-xs text-emerald-300">Maîtrisées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`bg-gradient-to-br from-amber-800 to-amber-900 border-amber-700 cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${activeFilter === 'in_progress' ? 'ring-2 ring-amber-400' : ''}`}
          onClick={() => onFilterClick && onFilterClick('in_progress')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-700">
                <Clock className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statistics.in_progress_techniques}</p>
                <p className="text-xs text-amber-300">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`bg-gradient-to-br from-rose-800 to-rose-900 border-rose-700 cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${activeFilter === 'practiced' ? 'ring-2 ring-rose-400' : ''}`}
          onClick={() => onFilterClick && onFilterClick('practiced')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-700">
                <Flame className="w-5 h-5 text-rose-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statistics.total_practice_sessions}</p>
                <p className="text-xs text-rose-300">Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {membersStats && isAdmin && (
          <>
            <Card 
              className="bg-gradient-to-br from-cyan-800 to-cyan-900 border-cyan-700 cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
              onClick={() => onMembersClick && onMembersClick('adults')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-700">
                    <Users className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{membersStats.total_members}</p>
                    <p className="text-xs text-cyan-300">Adhérents</p>
                    <p className="text-xs text-cyan-400/60 mt-0.5">Cliquez pour gérer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="bg-gradient-to-br from-purple-800 to-purple-900 border-purple-700 cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
              onClick={() => onMembersClick && onMembersClick('children')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-700">
                    <Baby className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{membersStats.total_children}</p>
                    <p className="text-xs text-purple-300">Enfants</p>
                    <p className="text-xs text-purple-400/60 mt-0.5">Cliquez pour gérer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      {/* Overall Progress Bar */}
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
      
      {/* Progress by Level */}
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
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// TECHNIQUE CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════
function TechniqueCard({ technique, onView }) {
  const mastery = MASTERY_LEVELS[technique.mastery_level] || MASTERY_LEVELS.not_started;
  const MasteryIcon = mastery.icon;
  
  return (
    <Card className="group bg-slate-800/50 border-slate-700 hover:border-slate-500 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white text-sm leading-tight mb-1 truncate">
              {technique.name}
            </h4>
            <div className="flex items-center gap-2">
              <Badge className={`${mastery.color} text-white text-xs px-2 py-0`}>
                <MasteryIcon className="w-3 h-3 mr-1" />
                {mastery.label}
              </Badge>
              {technique.practice_count > 0 && (
                <span className="text-xs text-slate-500">
                  {technique.practice_count} sessions
                </span>
              )}
            </div>
          </div>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onView(technique)}
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// TECHNIQUE MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════
function TechniqueModal({ technique, kyuName, kyuColor, isOpen, onClose, onUpdateMastery, onPractice }) {
  if (!technique) return null;
  
  const mastery = MASTERY_LEVELS[technique.mastery_level] || MASTERY_LEVELS.not_started;
  const hasImage = technique.image_url && technique.image_url.length > 0;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge style={{ backgroundColor: kyuColor }} className="text-white text-xs">
              {kyuName}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-white">
            {technique.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {hasImage && (
            <div className="rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
              <img 
                src={technique.image_url} 
                alt={technique.name}
                className="w-full h-auto max-h-64 object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
          
          {technique.description && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-300 text-sm leading-relaxed">{technique.description}</p>
            </div>
          )}
          
          {technique.key_points && technique.key_points.length > 0 && (
            <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-800/50">
              <h4 className="text-cyan-400 font-semibold text-sm mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Points clés d&apos;exécution
              </h4>
              <ul className="space-y-1.5">
                {technique.key_points.map((point, idx) => (
                  <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {technique.practice_tips && technique.practice_tips.length > 0 && (
            <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-800/50">
              <h4 className="text-emerald-400 font-semibold text-sm mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Conseils de pratique
              </h4>
              <ul className="space-y-1.5">
                {technique.practice_tips.map((tip, idx) => (
                  <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h4 className="text-white font-semibold text-sm mb-3">Niveau de maîtrise</h4>
            <Select 
              value={technique.mastery_level || "not_started"} 
              onValueChange={(value) => onUpdateMastery(technique.id, value)}
            >
              <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {Object.entries(MASTERY_LEVELS).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {config.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {technique.practice_count || 0} session(s) enregistrée(s)
              </span>
              <Button 
                size="sm" 
                onClick={() => onPractice(technique.id)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <Flame className="w-4 h-4 mr-1" />
                +1 Session
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// GRADE SECTION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════
function GradeSection({ kyu, onViewTechnique, onUpdateMastery, onPractice, isFiltered, originalCount }) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const masteredCount = kyu.techniques.filter(t => t.mastery_level === 'mastered').length;
  const progressPercent = kyu.techniques.length > 0 
    ? Math.round((masteredCount / kyu.techniques.length) * 100) 
    : 0;
  
  const groupedTechniques = {};
  kyu.techniques.forEach(tech => {
    const match = tech.description?.match(/^(SUWARIWAZA|TACHIWAZA|HANMI HANDACHI|USHIRO WAZA|HANMIHANDACHI|GÉNÉRAL)/i);
    const category = match ? match[1].toUpperCase() : 'GÉNÉRAL';
    if (!groupedTechniques[category]) groupedTechniques[category] = [];
    groupedTechniques[category].push(tech);
  });
  
  return (
    <div className="mb-8">
      <div 
        className="sticky top-16 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 py-4 px-4 -mx-4 mb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-12 rounded-full" style={{ backgroundColor: kyu.color }} />
            <div>
              <h2 className="text-xl font-bold text-white">{kyu.name}</h2>
              <p className="text-sm text-slate-400">
                {isFiltered ? (
                  <span>{kyu.techniques.length} / {originalCount} techniques affichées</span>
                ) : (
                  <span>{kyu.techniques.length} techniques • {progressPercent}% maîtrisé</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 text-xs">
              <span className="px-2 py-1 rounded bg-emerald-900/50 text-emerald-400">
                {masteredCount} maîtrisées
              </span>
            </div>
            <svg 
              className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div className="mt-2 w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%`, backgroundColor: kyu.color }}
          />
        </div>
      </div>
      
      {isExpanded && (
        <div className="space-y-6">
          {Object.entries(groupedTechniques).map(([category, techniques]) => (
            <div key={category}>
              {Object.keys(groupedTechniques).length > 1 && (
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
                  {category}
                </h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {techniques.map((technique) => (
                  <TechniqueCard
                    key={technique.id}
                    technique={technique}
                    onView={onViewTechnique}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════
function App() {
  const [kyuLevels, setKyuLevels] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [membersStats, setMembersStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [selectedKyu, setSelectedKyu] = useState(null);
  const [showStats, setShowStats] = useState(true);
  const [activeTab, setActiveTab] = useState("techniques");
  
  // Admin state
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('aikido_admin') === 'true';
  });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  const handleAdminLogin = () => {
    setIsAdmin(true);
  };
  
  const handleAdminLogout = () => {
    sessionStorage.removeItem('aikido_admin');
    setIsAdmin(false);
    setActiveTab("techniques");
    toast.success("Déconnexion réussie");
  };
  
  // Refs for grade sections to enable scrolling
  const gradeSectionRefs = useRef({});
  
  const handleGradeClick = (gradeName) => {
    // Find the matching kyu level
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
      const [kyuResponse, statsResponse, membersStatsResponse, membersResponse] = await Promise.all([
        axios.get(`${API}/kyu-levels`),
        axios.get(`${API}/statistics`),
        axios.get(`${API}/members-stats`),
        axios.get(`${API}/members`)
      ]);
      setKyuLevels(kyuResponse.data);
      setStatistics(statsResponse.data);
      setMembersStats(membersStatsResponse.data);
      setMembers(membersResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleUpdateMastery = async (kyuId, techniqueId, masteryLevel) => {
    try {
      await axios.put(`${API}/kyu-levels/${kyuId}/techniques/${techniqueId}`, {
        mastery_level: masteryLevel
      });
      toast.success("Niveau de maîtrise mis à jour");
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };
  
  const handlePractice = async (kyuId, techniqueId) => {
    try {
      await axios.post(`${API}/kyu-levels/${kyuId}/techniques/${techniqueId}/practice`);
      toast.success("Session de pratique enregistrée !");
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };
  
  const handleViewTechnique = (kyu, technique) => {
    setSelectedKyu(kyu);
    setSelectedTechnique(technique);
  };
  
  // Registration dialogs state
  const [showChildRegistration, setShowChildRegistration] = useState(false);
  const [showAdultRegistration, setShowAdultRegistration] = useState(false);
  
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
      mastered: `${statistics?.mastered_techniques || 0} technique(s) maîtrisée(s)`,
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
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Chargement...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-950">
      <Toaster richColors position="top-right" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/images/logo-aikido.png" 
                alt="Logo Aikido La Rivière" 
                className="h-14 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-white">Aikido La Rivière</h1>
                <p className="text-xs text-slate-400">68, rue du Docteur Schweitzer 97421 SAINT-LOUIS - RÉUNION</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAdminLogout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Déconnexion
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStats(!showStats)}
                className={`text-slate-400 hover:text-white ${showStats ? 'bg-slate-800' : ''}`}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Stats
              </Button>
              {statistics && (
                <Badge className="bg-cyan-600 text-white">
                  {statistics.overall_progress}%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Règlement Intérieur - EN HAUT */}
        <ReglementInterieur 
          onRegister={fetchData} 
          isAdmin={isAdmin}
          onAdminClick={() => setShowAdminLogin(true)}
        />
        
        {/* Tabs for Techniques and Members */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="techniques" className="data-[state=active]:bg-slate-700">
              <Swords className="w-4 h-4 mr-2" />
              Techniques
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="members" className="data-[state=active]:bg-slate-700">
                <Users className="w-4 h-4 mr-2" />
                Adhérents ({members.length})
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="techniques" className="mt-6">
            {/* Filter indicator */}
            {techniqueFilter !== 'all' && (
              <div className="mb-4 flex items-center justify-between bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <span className="text-sm text-slate-300">
                  Filtre actif : <span className="font-semibold text-cyan-400">
                    {techniqueFilter === 'mastered' && 'Techniques maîtrisées'}
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
            {showStats && (
              <StatisticsDashboard 
                statistics={statistics} 
                membersStats={membersStats}
                onGradeClick={handleGradeClick}
                onFilterClick={handleFilterClick}
                activeFilter={techniqueFilter}
                isAdmin={isAdmin}
                onMembersClick={(tab) => {
                  setActiveTab("members");
                  // Small delay to ensure tab switch before setting inner tab
                  setTimeout(() => {
                    const event = new CustomEvent('setMembersTab', { detail: tab });
                    window.dispatchEvent(event);
                  }, 100);
                }}
                kyuLevels={kyuLevels}
              />
            )}
            
            {/* Section Déplacements - sous Progression par Grade */}
            <DeplacementsSection />
            
            {/* Grade Sections */}
            <div className="space-y-2">
              {kyuLevels.map((kyu) => {
                const filteredTechniques = filterTechniques(kyu.techniques);
                // Skip empty grades when filter is active
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
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="members" className="mt-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    Liste des adhérents
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {membersStats?.active || 0} actifs • {membersStats?.pending || 0} en attente de validation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MembersList 
                    members={members} 
                    onRefresh={fetchData}
                    onRegisterChild={() => setShowChildRegistration(true)}
                    onRegisterAdult={() => setShowAdultRegistration(true)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>
      
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
      />
      
      {/* Admin Login Dialog */}
      <AdminLoginDialog
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={handleAdminLogin}
      />
      
      {/* Child Registration Dialog */}
      <Dialog open={showChildRegistration} onOpenChange={setShowChildRegistration}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Baby className="w-6 h-6 text-purple-400" />
              Inscription Enfant
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Formulaire d&apos;inscription pour un ou plusieurs enfants
            </DialogDescription>
          </DialogHeader>
          <MemberRegistrationForm
            registrationType="child"
            onSuccess={() => {
              setShowChildRegistration(false);
              fetchData();
            }}
            onCancel={() => setShowChildRegistration(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Adult Registration Dialog */}
      <Dialog open={showAdultRegistration} onOpenChange={setShowAdultRegistration}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <User className="w-6 h-6 text-cyan-400" />
              Inscription Adulte
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Formulaire d&apos;inscription pour un adulte pratiquant
            </DialogDescription>
          </DialogHeader>
          <MemberRegistrationForm
            registrationType="adult"
            onSuccess={() => {
              setShowAdultRegistration(false);
              fetchData();
            }}
            onCancel={() => setShowAdultRegistration(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            Aikido La Rivière • Club affilié FFAAA • {statistics?.total_techniques || 0} techniques
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Instructeurs : Céline ROSETTE (3e Dan) • Yeza LUCAS (2e Dan)
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
