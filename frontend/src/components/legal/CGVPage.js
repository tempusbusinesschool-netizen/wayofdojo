import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import LegalHeader from "./LegalHeader";
import LegalFooter from "./LegalFooter";

function CGVPage({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-900 border-slate-700 text-slate-300 p-0">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white z-10"
        >
          <X className="w-5 h-5" />
        </button>
        
        <ScrollArea className="h-[85vh] p-8">
          <LegalHeader title="Conditions Générales de Vente (CGV)" />
          
          <div className="space-y-6 text-sm leading-relaxed">
            <p className="text-slate-400 italic">En vigueur au 1er janvier 2026</p>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 1 - Objet</h2>
              <p>
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre 
                HUMAN KNOWLEDGE SAS et tout utilisateur souhaitant souscrire à un abonnement payant sur 
                l'Application « Techniques d'Aïkido ».
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 2 - Offres et tarifs</h2>
              <p>L'Application propose deux formules de licence :</p>
              
              <div className="mt-4 p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                <h3 className="font-semibold text-amber-400">🥷 Licence Utilisateur unique</h3>
                <p className="text-slate-400 text-sm mt-1">1 personne = 1 accès (particuliers, pratiquants, éducateurs, étudiants, coachs)</p>
                <ul className="mt-2 space-y-1">
                  <li>• Période d'essai : <strong>3 mois gratuits</strong></li>
                  <li>• Abonnement mensuel : <strong>4,50 € TTC / mois</strong></li>
                  <li>• Abonnement annuel : <strong>39,90 € TTC / an</strong> (soit 3,33€/mois)</li>
                  <li>• Option tarif solidaire : étudiants et demandeurs d'emploi sur demande</li>
                  <li>• <strong>Sans engagement</strong>, résiliable à tout moment</li>
                </ul>
              </div>
              
              <div className="mt-4 p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                <h3 className="font-semibold text-cyan-400">🏯 Licence Club</h3>
                <p className="text-slate-400 text-sm mt-1">Licences illimitées + gestion adhérents (clubs, fédérations, associations, collectivités)</p>
                <ul className="mt-2 space-y-1">
                  <li>• Période d'essai : <strong>10 jours gratuits</strong></li>
                  <li>• Petits clubs (&lt;50 adhérents) : <strong>19,90 € TTC / mois</strong></li>
                  <li>• Clubs moyens (50-150 adhérents) : <strong>29,90 € TTC / mois</strong></li>
                  <li>• Grandes structures (&gt;150 adhérents) : <strong>sur devis</strong></li>
                  <li>• <strong>Engagement 12 mois</strong> avec reconduction tacite annuelle</li>
                </ul>
              </div>
              
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <h3 className="font-semibold text-red-400">⚠️ Important</h3>
                <p className="mt-2">
                  Les abonnements <strong>ne permettent aucune évaluation technique, certification ou délivrance de grade</strong>.
                  Aikido@Game ne remplace pas la pratique en dojo, mais l'enrichit par une approche contemporaine.
                </p>
              </div>
              
              <p className="mt-4">
                Les prix sont indiqués en euros toutes taxes comprises (TTC). 
                HUMAN KNOWLEDGE SAS se réserve le droit de modifier ses tarifs à tout moment, 
                les nouveaux tarifs s'appliquant aux nouveaux abonnements.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 3 - Période d'essai</h2>
              <p>
                <strong>Licence Utilisateur unique :</strong> Période d'essai gratuite de <strong>3 mois</strong>.
              </p>
              <p className="mt-2">
                <strong>Licence Club :</strong> Période d'essai gratuite de <strong>10 jours</strong>.
              </p>
              <p className="mt-2">
                Pendant cette période, l'utilisateur bénéficie de l'ensemble des fonctionnalités de l'offre souscrite.
              </p>
              <p className="mt-2">
                <strong>Annulation pendant l'essai :</strong> L'utilisateur peut annuler son abonnement à tout moment 
                pendant la période d'essai, sans frais ni engagement.
              </p>
              <p className="mt-2">
                <strong>À l'issue de la période d'essai :</strong> L'abonnement est automatiquement converti en abonnement 
                payant si l'utilisateur a enregistré un moyen de paiement. Dans le cas contraire, l'accès 
                aux fonctionnalités premium est suspendu.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 4 - Cadre éthique et déontologique</h2>
              <p>
                Chaque utilisateur et club s'engage à respecter la <strong>charte éthique</strong> et les valeurs du Budo :
              </p>
              <ul className="mt-2 space-y-1">
                <li>• Promouvoir la non-violence, le respect, l'inclusion et l'égalité</li>
                <li>• Usage éducatif et non violent de l'application</li>
                <li>• Interdiction de détourner l'outil à des fins coercitives, de domination ou d'exclusion</li>
              </ul>
              <p className="mt-4">
                En cas de manquement grave à ces engagements, HUMAN KNOWLEDGE SAS se réserve le droit 
                d'appliquer des sanctions : avertissement, suspension ou résiliation de licence.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 4 - Modalités de paiement</h2>
              <p>
                Le paiement s'effectue par carte bancaire via notre prestataire de paiement sécurisé Stripe. 
                Les données bancaires sont traitées de manière sécurisée et ne sont pas stockées par 
                HUMAN KNOWLEDGE SAS.
              </p>
              <p className="mt-2">
                Le prélèvement est effectué mensuellement à la date anniversaire de l'abonnement.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 5 - Droit de rétractation</h2>
              <p>
                Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation 
                ne peut être exercé pour les contrats de fourniture de contenu numérique non fourni 
                sur un support matériel dont l'exécution a commencé avec l'accord du consommateur.
              </p>
              <p className="mt-2">
                En souscrivant à un abonnement et en acceptant l'exécution immédiate du service, 
                l'utilisateur renonce expressément à son droit de rétractation.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 6 - Résiliation</h2>
              <h3 className="font-medium text-slate-200 mt-3">Offre Ninja Individuel :</h3>
              <p>
                L'utilisateur peut résilier son abonnement à tout moment depuis son espace personnel. 
                La résiliation prend effet à la fin de la période de facturation en cours.
              </p>
              
              <h3 className="font-medium text-slate-200 mt-3">Offre Dojo :</h3>
              <p>
                L'abonnement est conclu pour une durée de 12 mois. La résiliation doit être effectuée 
                au moins 30 jours avant la date de reconduction annuelle. À défaut, l'abonnement est 
                automatiquement reconduit pour une nouvelle période de 12 mois.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 7 - Remboursement</h2>
              <p>
                Aucun remboursement ne sera effectué pour les périodes partiellement utilisées. 
                En cas de résiliation anticipée de l'offre Dojo, les mensualités restantes dues 
                jusqu'à la fin de la période d'engagement restent exigibles.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 8 - Service client</h2>
              <p>
                Pour toute question relative à votre abonnement, vous pouvez nous contacter :
              </p>
              <ul className="mt-2">
                <li>• Par email : contact@humanknowledge.fr</li>
                <li>• Via le formulaire de contact de l'Application</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 9 - Litiges</h2>
              <p>
                En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. 
                À défaut d'accord, les tribunaux de Strasbourg seront seuls compétents.
              </p>
              <p className="mt-2">
                Conformément aux dispositions du Code de la consommation, le consommateur peut recourir 
                à un médiateur de la consommation.
              </p>
            </section>
          </div>
          
          <LegalFooter />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default CGVPage;
