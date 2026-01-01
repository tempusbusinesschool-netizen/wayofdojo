import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollText } from "lucide-react";

function CGUDialog({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-white max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-cyan-400" />
            Conditions Générales d'Utilisation (CGU)
          </DialogTitle>
        </DialogHeader>
        
        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-slate-300">
          <p className="text-slate-400 text-sm italic">Dernière mise à jour : 22 décembre 2025</p>
          
          <section>
            <h3 className="text-lg font-semibold text-white">1. Objet</h3>
            <p>
              Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir les modalités d'accès et d'utilisation du service en ligne accessible à l'adresse https://app.emergent.sh/chat (ci-après « le Service »), proposant un contenu gratuit à vocation pédagogique dédié à l'aïkido et à ses techniques, conçu comme un complément à la pratique encadrée en dojo.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">2. Acceptation des CGU</h3>
            <p>
              L'accès au Service et son utilisation impliquent l'acceptation pleine, entière et sans réserve des présentes CGU.
              L'Utilisateur reconnaît avoir pris connaissance des CGU et les accepter avant toute utilisation du Service.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">3. Nature et finalité du Service</h3>
            <p>Le Service propose :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>des contenus pédagogiques relatifs à l'aïkido (principes, techniques, vocabulaire, philosophie) ;</li>
              <li>des échanges informatifs via un système de discussion automatisée.</li>
            </ul>
            <p className="mt-3">
              Le Service est strictement informatif et pédagogique.
              Il est destiné à compléter l'enseignement dispensé en dojo et ne constitue en aucun cas :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>un cours pratique à distance ;</li>
              <li>un enseignement officiel autonome ;</li>
              <li>un remplacement de l'encadrement par un enseignant qualifié.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">4. Lien avec l'association d'aïkido « La Rivière »</h3>
            <p>
              Le Service est proposé en lien avec l'association/club d'aïkido La Rivière, à des fins d'accompagnement pédagogique et de soutien à la pratique.
            </p>
            <p className="mt-2">Toutefois :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>le Service ne se substitue pas aux cours dispensés par l'association ;</li>
              <li>les contenus proposés ne constituent pas des consignes personnalisées ou individualisées ;</li>
              <li>l'association et ses enseignants conservent une autonomie totale dans l'enseignement en dojo.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">5. Accès au Service</h3>
            <p>
              Le Service est accessible gratuitement, sans obligation d'inscription, sauf évolution ultérieure.
              Le Fournisseur se réserve le droit d'interrompre temporairement l'accès pour maintenance, mise à jour ou amélioration du Service, sans préavis.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">6. Responsabilité liée à la pratique de l'aïkido</h3>
            <p>L'Utilisateur reconnaît que :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>l'aïkido est un art martial impliquant des techniques physiques pouvant entraîner des risques de blessures ;</li>
              <li>les informations fournies ne doivent pas être mises en pratique hors d'un cadre encadré.</li>
            </ul>
            <p className="mt-3">
              Toute mise en pratique des techniques évoquées via le Service s'effectue sous la seule responsabilité de l'Utilisateur.
            </p>
            <p className="mt-2">Il est expressément recommandé :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>de pratiquer exclusivement dans un dojo, sous la supervision d'un enseignant qualifié ;</li>
              <li>de ne jamais tenter de reproduire seul ou sans encadrement les techniques décrites.</li>
            </ul>
            <p className="mt-3 text-amber-400 font-medium">
              Le Fournisseur et l'association La Rivière ne sauraient être tenus responsables de tout accident, blessure ou dommage corporel résultant de l'utilisation du Service.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">7. Utilisation par des mineurs – Responsabilité parentale</h3>
            <p>Le Service peut être accessible à des mineurs pratiquant l'aïkido.</p>
            <p className="mt-2">Dans ce cadre :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>l'utilisation du Service par un mineur est placée sous la responsabilité exclusive de ses représentants légaux ;</li>
              <li>les parents ou responsables légaux reconnaissent avoir pris connaissance des présentes CGU et en accepter les termes ;</li>
              <li>ils s'engagent à encadrer l'usage du Service et à veiller à ce qu'aucune pratique physique ne soit réalisée sans supervision en dojo.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">8. Obligations de l'Utilisateur</h3>
            <p>L'Utilisateur s'engage à :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>utiliser le Service de manière conforme à la loi et aux présentes CGU ;</li>
              <li>respecter les valeurs fondamentales de l'aïkido, notamment le respect, la non-violence et la maîtrise de soi ;</li>
              <li>ne pas détourner le Service de sa finalité pédagogique.</li>
            </ul>
            <p className="mt-3">
              Tout usage abusif ou contraire aux CGU pourra entraîner une suspension ou une restriction d'accès.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">9. Propriété intellectuelle</h3>
            <p>
              L'ensemble des contenus du Service (textes, réponses, structure, interface, bases de connaissances) est protégé par le droit de la propriété intellectuelle.
              Toute reproduction, diffusion ou exploitation, totale ou partielle, sans autorisation écrite préalable est interdite.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">10. Données personnelles</h3>
            <p>
              Le Service peut collecter des données techniques ou conversationnelles nécessaires à son fonctionnement.
              Ces données sont traitées conformément à la réglementation applicable en matière de protection des données personnelles.
              L'Utilisateur dispose des droits d'accès, de rectification, de limitation et de suppression dans les conditions prévues par la loi.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">11. Limitation de responsabilité</h3>
            <p>
              Le Fournisseur s'efforce de proposer des contenus exacts et à jour, sans garantir leur exhaustivité ou leur parfaite exactitude.
              Le Service est fourni « en l'état », sans garantie expresse ou implicite.
              Aucune responsabilité ne saurait être engagée en cas de dommages directs ou indirects résultant de l'utilisation du Service.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">12. Modification des CGU</h3>
            <p>
              Le Fournisseur se réserve le droit de modifier les présentes CGU à tout moment.
              Les CGU applicables sont celles en vigueur à la date d'utilisation du Service.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">13. Droit applicable et juridiction compétente</h3>
            <p>
              Les présentes CGU sont régies par le droit français.
              Tout litige relatif à leur interprétation ou à leur exécution relève de la compétence exclusive des juridictions françaises.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CGUDialog;
