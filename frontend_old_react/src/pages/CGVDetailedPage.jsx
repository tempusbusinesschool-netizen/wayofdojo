import React from 'react';
import { ArrowLeft, Scale, FileText, Shield, CreditCard, RefreshCw, AlertTriangle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * CGVPage - Conditions Générales de Vente
 * Conforme au droit français et européen (RGPD, DSP2, Code de la consommation)
 */
const CGVPage = ({ onBack }) => {
  const lastUpdate = "11 janvier 2025";
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-500" />
            <h1 className="text-lg font-bold">Conditions Générales de Vente</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8 space-y-8">
          
          {/* En-tête */}
          <div className="text-center pb-6 border-b border-slate-700">
            <h1 className="text-3xl font-bold text-amber-500 mb-2">
              Conditions Générales de Vente
            </h1>
            <p className="text-slate-400">
              Application Aikido@Game - HUMAN KNOWLEDGE
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Dernière mise à jour : {lastUpdate}
            </p>
          </div>

          {/* Article 1 */}
          <section>
            <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Article 1 - Objet et Champ d'Application
            </h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong>1.1.</strong> Les présentes Conditions Générales de Vente (ci-après "CGV") régissent l'ensemble des relations contractuelles entre :
              </p>
              <div className="bg-slate-700/50 p-4 rounded-lg ml-4">
                <p><strong>Le Prestataire :</strong></p>
                <p>HUMAN KNOWLEDGE</p>
                <p>Éditeur de l'application Aikido@Game</p>
                <p>Email : contact@aikidoatgame.com</p>
              </div>
              <p className="mt-3">
                Et toute personne physique ou morale (ci-après "le Client") souscrivant à un abonnement ou utilisant les services de l'application Aikido@Game.
              </p>
              <p>
                <strong>1.2.</strong> Les présentes CGV sont accessibles à tout moment sur l'application et prévaudront sur toutes autres conditions générales ou particulières non expressément agréées par le Prestataire.
              </p>
              <p>
                <strong>1.3.</strong> Le Client déclare avoir pris connaissance des présentes CGV et les accepter sans réserve avant toute souscription.
              </p>
            </div>
          </section>

          {/* Article 2 */}
          <section>
            <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Article 2 - Description des Services
            </h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong>2.1.</strong> Aikido@Game est une application web de suivi pédagogique et de gamification dédiée à la pratique de l'Aïkido, proposant :
              </p>
              <ul className="list-disc ml-8 space-y-2">
                <li>Un parcours pédagogique structuré par niveau de ceinture</li>
                <li>Des scénarios de type "Serious Game" pour l'apprentissage</li>
                <li>Un système de gamification (XP, défis, badges, niveaux)</li>
                <li>Un suivi de progression personnalisé</li>
                <li>Un espace enseignant pour le suivi des élèves</li>
                <li>Un espace parent pour le suivi des enfants</li>
                <li>Des outils de gestion pour les clubs (offre Club)</li>
              </ul>
              <p>
                <strong>2.2.</strong> Le Prestataire se réserve le droit de faire évoluer les fonctionnalités de l'application dans le cadre de son amélioration continue, sans que cela ne puisse donner lieu à indemnisation.
              </p>
            </div>
          </section>

          {/* Article 3 */}
          <section>
            <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Article 3 - Tarifs et Modalités de Paiement
            </h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p><strong>3.1. Offres et Tarifs en vigueur :</strong></p>
              
              <div className="bg-slate-700/50 p-4 rounded-lg space-y-4">
                <div>
                  <p className="font-semibold text-amber-400">Licence Utilisateur Unique :</p>
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>• Abonnement mensuel : 4,50 € TTC / mois</li>
                    <li>• Abonnement annuel : 39,90 € TTC / an (soit 3,33 €/mois)</li>
                    <li>• Période d'essai : 90 jours gratuits (avec enregistrement de carte bancaire)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-cyan-400">Licence Club d'Aikido :</p>
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>• Club {"<"} 30 adhérents : 19,90 € TTC / mois</li>
                    <li>• Club 30-100 adhérents : 29,90 € TTC / mois</li>
                    <li>• Club {">"} 100 adhérents : Sur devis personnalisé</li>
                    <li>• Période d'essai : 10 jours gratuits</li>
                  </ul>
                </div>
              </div>

              <p>
                <strong>3.2.</strong> Les prix sont indiqués en euros, toutes taxes comprises (TTC). Le Prestataire se réserve le droit de modifier ses tarifs à tout moment. Les nouveaux tarifs s'appliqueront aux nouvelles souscriptions et aux renouvellements suivant la modification.
              </p>
              <p>
                <strong>3.3.</strong> Le paiement s'effectue par carte bancaire via la plateforme sécurisée Stripe. Les moyens de paiement acceptés sont : Visa, Mastercard, American Express, et prélèvement SEPA.
              </p>
              <p>
                <strong>3.4.</strong> La transaction est sécurisée par le protocole 3D Secure conformément à la directive européenne DSP2 sur les services de paiement.
              </p>
              <p>
                <strong>3.5.</strong> En cas d'échec de paiement, le Prestataire effectuera jusqu'à 3 tentatives de prélèvement sur une période de 7 jours. En cas d'échec définitif, l'accès au service sera suspendu.
              </p>
            </div>
          </section>

          {/* Article 4 */}
          <section>
            <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Article 4 - Durée, Renouvellement et Résiliation
            </h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong>4.1. Durée de l'abonnement :</strong> L'abonnement est souscrit pour la durée choisie (mensuelle ou annuelle) à compter de la date de souscription effective.
              </p>
              <p>
                <strong>4.2. Période d'essai :</strong>
              </p>
              <ul className="list-disc ml-8 space-y-2">
                <li>La période d'essai permet de tester gratuitement l'ensemble des fonctionnalités.</li>
                <li>L'enregistrement d'une carte bancaire est requis pour activer la période d'essai.</li>
                <li>Aucun prélèvement n'est effectué pendant la période d'essai.</li>
                <li>Le Client peut annuler à tout moment avant la fin de l'essai sans être débité.</li>
                <li>À défaut d'annulation, l'abonnement payant démarre automatiquement.</li>
              </ul>
              <p>
                <strong>4.3. Renouvellement :</strong> L'abonnement est reconduit tacitement pour une durée identique à la période initiale, sauf résiliation par le Client avant la date de renouvellement.
              </p>
              <p>
                <strong>4.4. Résiliation par le Client :</strong>
              </p>
              <ul className="list-disc ml-8 space-y-2">
                <li>Le Client peut résilier son abonnement à tout moment depuis son espace personnel ou par email.</li>
                <li>La résiliation prend effet à la fin de la période en cours déjà payée.</li>
                <li>L'accès aux services est maintenu jusqu'à la fin de la période payée.</li>
                <li>Aucun remboursement prorata temporis ne sera effectué.</li>
              </ul>
              <p>
                <strong>4.5. Résiliation par le Prestataire :</strong> Le Prestataire peut résilier l'abonnement de plein droit, sans préavis ni indemnité, en cas de :
              </p>
              <ul className="list-disc ml-8 space-y-1">
                <li>Non-paiement après les relances prévues</li>
                <li>Violation des présentes CGV</li>
                <li>Utilisation frauduleuse ou abusive du service</li>
                <li>Comportement contraire à l'éthique de l'Aïkido</li>
              </ul>
            </div>
          </section>

          {/* Article 5 */}
          <section>
            <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Article 5 - Droit de Rétractation
            </h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong>5.1.</strong> Conformément à l'article L221-18 du Code de la consommation, le Client consommateur dispose d'un délai de <strong>14 jours</strong> à compter de la souscription pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
              </p>
              <p>
                <strong>5.2.</strong> Pour exercer ce droit, le Client doit notifier sa décision par :
              </p>
              <ul className="list-disc ml-8 space-y-1">
                <li>Email à : contact@aikidoatgame.com</li>
                <li>Formulaire de contact dans l'application</li>
                <li>Courrier recommandé avec accusé de réception</li>
              </ul>
              <p>
                <strong>5.3.</strong> En cas de rétractation, le Prestataire remboursera le Client dans un délai maximum de 14 jours suivant la notification, via le même moyen de paiement que celui utilisé pour la transaction initiale.
              </p>
              <p>
                <strong>5.4. Exception :</strong> Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé si le Client a expressément demandé le commencement de l'exécution du service avant la fin du délai de rétractation et a reconnu perdre son droit de rétractation.
              </p>
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg mt-4">
                <p className="text-amber-400 font-semibold">📋 Modèle de formulaire de rétractation :</p>
                <p className="text-slate-400 mt-2 text-xs italic">
                  "Je soussigné(e) [Nom Prénom], notifie par la présente ma rétractation du contrat d'abonnement Aikido@Game souscrit le [date]. 
                  Email du compte : [email]. Date : [date]. Signature."
                </p>
              </div>
            </div>
          </section>

          {/* Article 6 */}
          <section>
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Article 6 - Obligations du Client
            </h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p><strong>6.1.</strong> Le Client s'engage à :</p>
              <ul className="list-disc ml-8 space-y-2">
                <li>Fournir des informations exactes et à jour lors de l'inscription</li>
                <li>Maintenir la confidentialité de ses identifiants de connexion</li>
                <li>Ne pas partager son compte avec des tiers</li>
                <li>Utiliser le service conformément à son objet pédagogique</li>
                <li>Respecter les droits de propriété intellectuelle du Prestataire</li>
                <li>Ne pas tenter d'accéder aux systèmes de manière non autorisée</li>
                <li>Ne pas reproduire, copier ou distribuer le contenu de l'application</li>
              </ul>
              <p>
                <strong>6.2.</strong> Le Client est seul responsable de l'utilisation faite de son compte et des conséquences qui en découlent.
              </p>
            </div>
          </section>

          {/* Article 7 */}
          <section>
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Article 7 - Propriété Intellectuelle
            </h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong>7.1.</strong> L'ensemble des éléments de l'application Aikido@Game (textes, images, vidéos, sons, logiciels, bases de données, marques, logos, parcours pédagogiques, personnages, design) sont la propriété exclusive de HUMAN KNOWLEDGE ou de ses partenaires.
              </p>
              <p>
                <strong>7.2.</strong> La marque "Aikido@Game" est une marque déposée. Toute reproduction ou utilisation non autorisée est interdite.
              </p>
              <p>
                <strong>7.3.</strong> L'abonnement confère au Client un droit d'utilisation personnel, non exclusif et non transférable, limité à la durée de l'abonnement.
              </p>
              <p>
                <strong>7.4.</strong> Toute reproduction, représentation, modification, publication, transmission, ou exploitation non autorisée de tout ou partie des éléments de l'application est strictement interdite et constitue un délit de contrefaçon sanctionné par les articles L335-2 et suivants du Code de la propriété intellectuelle.
              </p>
            </div>
          </section>

          {/* Article 8 */}
          <section>
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Article 8 - Responsabilité et Garanties
            </h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong>8.1.</strong> Le Prestataire s'engage à fournir ses services avec diligence et dans le respect des règles de l'art, étant précisé qu'il s'agit d'une obligation de moyens et non de résultat.
              </p>
              <p>
                <strong>8.2.</strong> Le Prestataire ne saurait être tenu responsable :
              </p>
              <ul className="list-disc ml-8 space-y-2">
                <li>Des interruptions temporaires du service pour maintenance ou mise à jour</li>
                <li>Des dysfonctionnements liés à l'équipement ou à la connexion du Client</li>
                <li>Des dommages indirects (perte de données, préjudice commercial, etc.)</li>
                <li>De l'utilisation faite par le Client du contenu pédagogique</li>
                <li>Des blessures survenant lors de la pratique physique de l'Aïkido</li>
              </ul>
              <p>
                <strong>8.3.</strong> L'application Aikido@Game est un outil pédagogique complémentaire et ne remplace en aucun cas l'enseignement dispensé par un professeur qualifié dans un dojo.
              </p>
              <p>
                <strong>8.4.</strong> En tout état de cause, la responsabilité du Prestataire est limitée au montant des sommes effectivement versées par le Client au cours des 12 derniers mois.
              </p>
            </div>
          </section>

          {/* Article 9 */}
          <section>
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Article 9 - Protection des Données Personnelles
            </h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong>9.1.</strong> Le Prestataire collecte et traite les données personnelles des Clients conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
              </p>
              <p>
                <strong>9.2.</strong> Les données collectées sont nécessaires à :
              </p>
              <ul className="list-disc ml-8 space-y-1">
                <li>La gestion du compte et de l'abonnement</li>
                <li>La fourniture des services personnalisés</li>
                <li>Le suivi de la progression pédagogique</li>
                <li>L'amélioration de l'application</li>
                <li>La communication avec le Client</li>
              </ul>
              <p>
                <strong>9.3.</strong> Le Client dispose des droits suivants sur ses données :
              </p>
              <ul className="list-disc ml-8 space-y-1">
                <li>Droit d'accès, de rectification et d'effacement</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d'opposition et de limitation du traitement</li>
                <li>Droit de retirer son consentement à tout moment</li>
              </ul>
              <p>
                <strong>9.4.</strong> Pour exercer ces droits, le Client peut contacter : <span className="text-amber-400">dpo@aikidoatgame.com</span>
              </p>
              <p>
                <strong>9.5.</strong> Pour plus d'informations, le Client est invité à consulter notre Politique de Confidentialité accessible dans l'application.
              </p>
            </div>
          </section>

          {/* Article 10 */}
          <section>
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Article 10 - Données des Mineurs
            </h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong>10.1.</strong> L'application peut être utilisée par des mineurs dans le cadre de leur apprentissage de l'Aïkido.
              </p>
              <p>
                <strong>10.2.</strong> La souscription d'un abonnement pour un mineur doit être effectuée par un parent ou représentant légal.
              </p>
              <p>
                <strong>10.3.</strong> Le traitement des données des mineurs de moins de 15 ans nécessite le consentement du titulaire de l'autorité parentale, conformément à l'article 8 du RGPD et à l'article 45 de la loi Informatique et Libertés.
              </p>
              <p>
                <strong>10.4.</strong> Les parents peuvent suivre la progression de leur enfant via l'espace Parent dédié et valider les activités numériques accomplies par leur enfant.
              </p>
            </div>
          </section>

          {/* Article 11 */}
          <section>
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Article 11 - Force Majeure
            </h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong>11.1.</strong> Le Prestataire ne pourra être tenu responsable de l'inexécution de ses obligations en cas de survenance d'un événement de force majeure tel que défini par l'article 1218 du Code civil, notamment : catastrophe naturelle, pandémie, guerre, grève, panne généralisée d'internet, cyberattaque majeure.
              </p>
              <p>
                <strong>11.2.</strong> En cas de force majeure d'une durée supérieure à 7 jours, chaque partie pourra résilier le contrat sans indemnité, le Client étant remboursé au prorata des services non fournis.
              </p>
            </div>
          </section>

          {/* Article 12 */}
          <section>
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Article 12 - Service Client et Réclamations
            </h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong>12.1.</strong> Pour toute question ou réclamation, le Client peut contacter le service client :
              </p>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p>📧 Email : <span className="text-amber-400">support@aikidoatgame.com</span></p>
                <p>📝 Formulaire de contact dans l'application</p>
                <p>⏱️ Délai de réponse : 48 heures ouvrées</p>
              </div>
              <p>
                <strong>12.2.</strong> Toute réclamation doit être formulée dans un délai de 7 jours suivant le fait générateur.
              </p>
            </div>
          </section>

          {/* Article 13 */}
          <section>
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Article 13 - Médiation et Litiges
            </h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong>13.1.</strong> En cas de litige, le Client peut recourir gratuitement à un médiateur de la consommation conformément aux articles L611-1 et suivants du Code de la consommation.
              </p>
              <p>
                <strong>13.2.</strong> Le Client peut également utiliser la plateforme européenne de Règlement en Ligne des Litiges (RLL) : <span className="text-amber-400">https://ec.europa.eu/consumers/odr</span>
              </p>
              <p>
                <strong>13.3.</strong> À défaut de résolution amiable, tout litige relatif à l'interprétation ou l'exécution des présentes CGV relèvera de la compétence exclusive des tribunaux français, conformément aux règles de compétence en vigueur.
              </p>
            </div>
          </section>

          {/* Article 14 */}
          <section>
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Article 14 - Droit Applicable
            </h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong>14.1.</strong> Les présentes CGV sont soumises au droit français.
              </p>
              <p>
                <strong>14.2.</strong> La langue des présentes CGV est le français. En cas de traduction, seule la version française fera foi.
              </p>
              <p>
                <strong>14.3.</strong> Si l'une des clauses des présentes CGV était déclarée nulle ou inapplicable, les autres clauses conserveraient leur pleine validité.
              </p>
            </div>
          </section>

          {/* Article 15 */}
          <section>
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Article 15 - Modification des CGV
            </h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong>15.1.</strong> Le Prestataire se réserve le droit de modifier les présentes CGV à tout moment.
              </p>
              <p>
                <strong>15.2.</strong> Les Clients seront informés de toute modification substantielle par email ou notification dans l'application, au moins 7 jours avant leur entrée en vigueur.
              </p>
              <p>
                <strong>15.3.</strong> La poursuite de l'utilisation du service après l'entrée en vigueur des nouvelles CGV vaut acceptation de celles-ci.
              </p>
            </div>
          </section>

          {/* Signature */}
          <div className="mt-12 pt-8 border-t border-slate-700 text-center">
            <p className="text-slate-400 text-sm">
              En souscrivant à un abonnement Aikido@Game, vous reconnaissez avoir lu, compris et accepté les présentes Conditions Générales de Vente.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <div className="text-center">
                <p className="text-2xl">🥋</p>
                <p className="text-xs text-slate-500 mt-1">Aikido@Game</p>
              </div>
              <div className="text-center">
                <p className="text-2xl">⚖️</p>
                <p className="text-xs text-slate-500 mt-1">HUMAN KNOWLEDGE</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-6">
              Version 1.0 - {lastUpdate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CGVPage;
