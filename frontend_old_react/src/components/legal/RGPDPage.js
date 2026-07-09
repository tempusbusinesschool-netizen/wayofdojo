import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import LegalHeader from "./LegalHeader";
import LegalFooter from "./LegalFooter";

function RGPDPage({ isOpen, onClose }) {
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
          <LegalHeader title="Politique de Protection des Données (RGPD)" />
          
          <div className="space-y-6 text-sm leading-relaxed">
            <p className="text-slate-400 italic">En vigueur au 1er janvier 2026</p>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. Responsable du traitement</h2>
              <p>
                Le responsable du traitement des données personnelles est :
              </p>
              <div className="mt-2 p-4 bg-slate-800 rounded-lg">
                <p><strong>HUMAN KNOWLEDGE SAS</strong></p>
                <p>30, rue de Lattre de Tassigny</p>
                <p>67300 SCHILTIGHEIM - STRASBOURG</p>
                <p>Email : contact@humanknowledge.fr</p>
              </div>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. Données collectées</h2>
              <p>Dans le cadre de l'utilisation de l'Application, nous collectons les données suivantes :</p>
              
              <h3 className="font-medium text-slate-200 mt-4">Données d'identification :</h3>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Mot de passe (chiffré)</li>
              </ul>
              
              <h3 className="font-medium text-slate-200 mt-4">Données d'utilisation :</h3>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Progression dans l'apprentissage des techniques</li>
                <li>Journal de pratique personnel</li>
                <li>Points et badges obtenus</li>
                <li>Historique des connexions</li>
              </ul>
              
              <h3 className="font-medium text-slate-200 mt-4">Données de paiement (pour les abonnements) :</h3>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Les données bancaires sont traitées directement par Stripe et ne sont pas stockées par HUMAN KNOWLEDGE SAS</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. Finalités du traitement</h2>
              <p>Vos données personnelles sont collectées pour les finalités suivantes :</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Création et gestion de votre compte utilisateur</li>
                <li>Fourniture des services de l'Application</li>
                <li>Suivi de votre progression personnelle</li>
                <li>Gestion des abonnements et de la facturation</li>
                <li>Communication avec les utilisateurs</li>
                <li>Amélioration de l'Application</li>
                <li>Respect des obligations légales</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Base légale du traitement</h2>
              <p>Le traitement de vos données personnelles repose sur :</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li><strong>L'exécution du contrat</strong> : pour fournir les services auxquels vous avez souscrit</li>
                <li><strong>Le consentement</strong> : pour l'envoi de communications marketing (optionnel)</li>
                <li><strong>L'intérêt légitime</strong> : pour améliorer nos services et assurer la sécurité</li>
                <li><strong>Les obligations légales</strong> : pour respecter nos obligations comptables et fiscales</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. Durée de conservation</h2>
              <div className="p-4 bg-slate-800 rounded-lg space-y-2">
                <p><strong className="text-white">Données de compte :</strong> Conservées pendant toute la durée d'utilisation du service, puis 3 ans après la suppression du compte</p>
                <p><strong className="text-white">Données de facturation :</strong> Conservées 10 ans (obligation légale)</p>
                <p><strong className="text-white">Données de connexion :</strong> Conservées 1 an</p>
              </div>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Destinataires des données</h2>
              <p>Vos données peuvent être transmises aux destinataires suivants :</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li><strong>Stripe</strong> : pour le traitement des paiements</li>
                <li><strong>O2switch</strong> : hébergeur de l'Application</li>
                <li><strong>Autorités compétentes</strong> : en cas d'obligation légale</li>
              </ul>
              <p className="mt-2">
                Aucune donnée n'est vendue ou louée à des tiers à des fins commerciales.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Transferts hors UE</h2>
              <p>
                Les données de paiement traitées par Stripe peuvent être transférées vers les États-Unis. 
                Stripe adhère au Data Privacy Framework et garantit un niveau de protection adéquat.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">8. Vos droits</h2>
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              
              <div className="mt-3 space-y-3">
                <div className="p-3 bg-slate-800 rounded-lg">
                  <strong className="text-emerald-400">✓ Droit d'accès</strong>
                  <p className="text-sm mt-1">Obtenir une copie de vos données personnelles</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg">
                  <strong className="text-emerald-400">✓ Droit de rectification</strong>
                  <p className="text-sm mt-1">Corriger des données inexactes ou incomplètes</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg">
                  <strong className="text-emerald-400">✓ Droit à l'effacement</strong>
                  <p className="text-sm mt-1">Demander la suppression de vos données</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg">
                  <strong className="text-emerald-400">✓ Droit à la limitation</strong>
                  <p className="text-sm mt-1">Limiter le traitement de vos données</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg">
                  <strong className="text-emerald-400">✓ Droit à la portabilité</strong>
                  <p className="text-sm mt-1">Recevoir vos données dans un format structuré</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg">
                  <strong className="text-emerald-400">✓ Droit d'opposition</strong>
                  <p className="text-sm mt-1">Vous opposer au traitement de vos données</p>
                </div>
              </div>
              
              <p className="mt-4">
                Pour exercer ces droits, contactez-nous à : <strong>contact@humanknowledge.fr</strong>
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">9. Sécurité des données</h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger 
                vos données personnelles contre tout accès non autorisé, modification, divulgation ou destruction.
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Chiffrement des mots de passe</li>
                <li>Connexion sécurisée (HTTPS)</li>
                <li>Accès restreint aux données</li>
                <li>Sauvegardes régulières</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">10. Réclamation</h2>
              <p>
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation 
                auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) :
              </p>
              <div className="mt-2 p-4 bg-slate-800 rounded-lg">
                <p>CNIL</p>
                <p>3 Place de Fontenoy</p>
                <p>TSA 80715</p>
                <p>75334 PARIS CEDEX 07</p>
                <p>www.cnil.fr</p>
              </div>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">11. Modification de la politique</h2>
              <p>
                Cette politique de protection des données peut être modifiée à tout moment. 
                Les utilisateurs seront informés de toute modification significative par notification 
                dans l'Application.
              </p>
            </section>
          </div>
          
          <LegalFooter />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default RGPDPage;
