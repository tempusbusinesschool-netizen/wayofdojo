import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText } from "lucide-react";

function MentionsLegalesDialog({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-white max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Mentions Légales
          </DialogTitle>
        </DialogHeader>
        
        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-slate-300">
          <p className="text-slate-400 text-sm italic">Dernière mise à jour : 22 décembre 2025</p>
          
          <section>
            <h3 className="text-lg font-semibold text-white">1. Éditeur du site</h3>
            <p>Le site et le service accessibles à l'adresse :</p>
            <p className="text-cyan-400">https://app.emergent.sh/chat</p>
            <p>sont édités par :</p>
            <div className="bg-slate-800/50 p-4 rounded-lg mt-2">
              <p><strong>Éditeur exclusif et responsable de la publication :</strong><br/>Bruno COURTIN</p>
              <p className="mt-2"><strong>Adresse électronique :</strong><br/><a href="mailto:bruno@istas.fr" className="text-cyan-400 hover:underline">bruno@istas.fr</a></p>
            </div>
            <p className="mt-3">L'éditeur est seul responsable du contenu éditorial du service.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">2. Hébergement</h3>
            <p>Le site est hébergé par :</p>
            <div className="bg-slate-800/50 p-4 rounded-lg mt-2">
              <p><strong>Société :</strong> Emergent</p>
              <p><strong>Rôle :</strong> hébergeur et prestataire technique de l'infrastructure applicative</p>
            </div>
            <p className="mt-3">Les données techniques nécessaires au fonctionnement du service sont traitées exclusivement par l'hébergeur dans le cadre de ses obligations légales et contractuelles.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">3. Partenaire pédagogique</h3>
            <p>Le service est proposé en lien pédagogique avec :</p>
            <div className="bg-slate-800/50 p-4 rounded-lg mt-2">
              <p><strong>Association / Club :</strong> Aïkido La Rivière</p>
              <p><strong>Statut :</strong> Association loi 1901</p>
              <p><strong>Rôle :</strong> partenaire pédagogique</p>
            </div>
            <p className="mt-3">L'association Aïkido La Rivière :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>n'est pas éditrice du site ;</li>
              <li>n'intervient pas dans la gestion technique ou numérique du service ;</li>
              <li>conserve une autonomie complète dans l'enseignement dispensé en dojo.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">4. Nature du service</h3>
            <p>Le service consiste en un outil gratuit de consultation de contenus pédagogiques, ayant pour finalité :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>l'accompagnement théorique de la pratique de l'aïkido ;</li>
              <li>l'approfondissement des principes, techniques et de la philosophie de l'aïkido.</li>
            </ul>
            <p className="mt-3">Le service constitue un complément à la pratique en dojo et ne se substitue en aucun cas :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>à l'enseignement dispensé par un professeur qualifié ;</li>
              <li>à un cours pratique en présentiel ;</li>
              <li>à une formation officielle ou fédérale.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">5. Limitation de responsabilité</h3>
            <p className="text-amber-400 font-medium">L'aïkido est un art martial impliquant des techniques physiques pouvant comporter des risques de blessures.</p>
            <p className="mt-2">L'éditeur décline toute responsabilité en cas :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>de mauvaise interprétation des contenus proposés ;</li>
              <li>de mise en pratique hors d'un cadre encadré ;</li>
              <li>d'accident, blessure ou dommage corporel survenu lors de la pratique.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">6. Propriété intellectuelle</h3>
            <p>
              L'ensemble des contenus du service (textes, structure, organisation pédagogique) est protégé par le droit de la propriété intellectuelle.
              Toute reproduction, représentation ou exploitation sans autorisation écrite préalable est interdite.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MentionsLegalesDialog;
