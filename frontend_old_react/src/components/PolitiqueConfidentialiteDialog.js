import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield } from "lucide-react";

function PolitiqueConfidentialiteDialog({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-white max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Politique de Confidentialité
          </DialogTitle>
        </DialogHeader>
        
        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-slate-300">
          <p className="text-slate-400 text-sm italic">Dernière mise à jour : 22 décembre 2025</p>
          
          <section>
            <h3 className="text-lg font-semibold text-white">1. Objet</h3>
            <p>
              La présente politique de confidentialité a pour objet d'informer les utilisateurs sur l'absence de collecte de données personnelles et sur les traitements techniques strictement nécessaires au fonctionnement du service accessible à l'adresse :
            </p>
            <p className="text-cyan-400">https://app.emergent.sh/chat</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">2. Responsable du traitement</h3>
            <p>Le responsable du traitement est :</p>
            <div className="bg-slate-800/50 p-4 rounded-lg mt-2">
              <p><strong>Nom :</strong> Bruno COURTIN</p>
              <p><strong>Contact :</strong> <a href="mailto:bruno@istas.fr" className="text-cyan-400 hover:underline">bruno@istas.fr</a></p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">3. Absence de collecte de données personnelles</h3>
            <p>Le service :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>ne propose aucun formulaire de contact ;</li>
              <li>ne propose aucun champ de saisie ;</li>
              <li>ne propose aucun espace d'échange ou de discussion ;</li>
              <li>ne permet aucune création de compte utilisateur.</li>
            </ul>
            <p className="mt-3 bg-emerald-900/30 border border-emerald-700 p-3 rounded-lg">
              En conséquence, <strong>aucune donnée personnelle n'est collectée</strong> directement auprès des utilisateurs par l'éditeur du service.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">4. Données techniques et hébergement</h3>
            <p>
              Dans le cadre du fonctionnement technique du site, des données purement techniques (telles que journaux serveur ou données réseau) peuvent être traitées exclusivement par l'hébergeur Emergent, sous sa responsabilité.
            </p>
            <p className="mt-2">L'éditeur :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>n'a pas accès à ces données ;</li>
              <li>n'en assure ni la conservation ni l'exploitation.</li>
            </ul>
            <p className="mt-3 text-slate-400 text-sm">
              Ces traitements relèvent de l'intérêt légitime de l'hébergeur, au sens de l'article 6.1.f du RGPD, afin d'assurer la sécurité, la stabilité et la maintenance du service.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">5. Durée de conservation</h3>
            <p>
              Les données techniques éventuellement traitées par l'hébergeur sont conservées selon les durées définies par ce dernier, conformément à la réglementation applicable, puis supprimées ou anonymisées.
            </p>
            <p className="mt-2 font-medium">L'éditeur ne conserve aucune donnée.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">6. Cookies et traceurs</h3>
            <div className="bg-emerald-900/30 border border-emerald-700 p-4 rounded-lg">
              <p className="font-medium">Le service n'utilise :</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>aucun cookie</li>
                <li>aucun traceur</li>
                <li>aucun outil de mesure d'audience</li>
                <li>aucun dispositif publicitaire</li>
              </ul>
              <p className="mt-3 text-emerald-300">Aucun bandeau cookies n'est requis ni affiché.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">7. Droits des utilisateurs</h3>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD), toute personne peut exercer ses droits d'information ou poser une question relative à la protection des données en contactant :
            </p>
            <p className="mt-2">
              <a href="mailto:bruno@istas.fr" className="text-cyan-400 hover:underline">bruno@istas.fr</a>
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">8. Données des mineurs</h3>
            <p>
              Le service peut être consulté par des mineurs pratiquant l'aïkido.
              L'utilisation du service par un mineur s'effectue sous la responsabilité exclusive de ses représentants légaux.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">9. Sécurité</h3>
            <p>
              Le service repose sur une infrastructure hébergée par un prestataire professionnel mettant en œuvre des mesures techniques et organisationnelles appropriées afin de garantir la sécurité du site.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">10. Modification</h3>
            <p>
              La présente politique de confidentialité peut être modifiée à tout moment.
              La version applicable est celle publiée en ligne à la date de consultation du service.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PolitiqueConfidentialiteDialog;
