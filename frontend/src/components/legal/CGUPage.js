import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import LegalHeader from "./LegalHeader";
import LegalFooter from "./LegalFooter";

function CGUPage({ isOpen, onClose }) {
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
          <LegalHeader title="Conditions Générales d'Utilisation (CGU)" />
          
          <div className="space-y-6 text-sm leading-relaxed">
            <p className="text-slate-400 italic">En vigueur au 1er janvier 2026</p>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 1 - Objet</h2>
              <p>
                Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités 
                et conditions d'utilisation de l'application web « Techniques d'Aïkido » (ci-après « l'Application »), 
                éditée par la société HUMAN KNOWLEDGE SAS.
              </p>
              <p className="mt-2">
                L'Application est un outil de gamification et d'apprentissage des techniques d'Aïkido, 
                permettant aux utilisateurs de suivre leur progression personnelle et de réviser les techniques 
                pratiquées au sein de leur dojo.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 2 - Acceptation des CGU</h2>
              <p>
                L'accès et l'utilisation de l'Application impliquent l'acceptation pleine et entière des présentes CGU. 
                L'utilisateur reconnaît avoir pris connaissance des présentes CGU et s'engage à les respecter.
              </p>
              <p className="mt-2">
                HUMAN KNOWLEDGE SAS se réserve le droit de modifier les présentes CGU à tout moment. 
                Les utilisateurs seront informés de toute modification par notification dans l'Application.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 3 - Description des services</h2>
              <p>L'Application propose les services suivants :</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Suivi de la progression personnelle dans l'apprentissage des techniques d'Aïkido</li>
                <li>Journal privé de pratique</li>
                <li>Système de gamification (points, badges, niveaux)</li>
                <li>Défis communautaires non compétitifs</li>
                <li>Parcours autour des valeurs de l'Aïkido</li>
              </ul>
              <p className="mt-3 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg text-amber-300">
                <strong>Important :</strong> L'Application est un outil de révision et de motivation. 
                Elle ne remplace en aucun cas l'enseignement dispensé par un professeur qualifié au sein d'un dojo.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 4 - Inscription et compte utilisateur</h2>
              <p>
                Pour accéder aux fonctionnalités de l'Application, l'utilisateur doit créer un compte personnel 
                en fournissant des informations exactes et à jour (nom, prénom, adresse email).
              </p>
              <p className="mt-2">
                L'utilisateur est responsable de la confidentialité de ses identifiants de connexion et 
                de toutes les actions effectuées depuis son compte.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 5 - Indépendance vis-à-vis des fédérations</h2>
              <p>
                L'Application est totalement indépendante de toute fédération d'Aïkido, organisme de formation 
                ou institution officielle.
              </p>
              <p className="mt-2 font-semibold text-amber-400">
                L'Application ne délivre aucun grade, diplôme ou certification officielle.
              </p>
              <p className="mt-2">
                Les niveaux et badges obtenus dans l'Application ont une valeur purement symbolique et motivationnelle.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 6 - Propriété intellectuelle</h2>
              <p>
                L'ensemble des contenus présents sur l'Application (textes, images, logos, graphismes, icônes) 
                sont la propriété exclusive de HUMAN KNOWLEDGE SAS ou font l'objet d'une autorisation d'utilisation.
              </p>
              <p className="mt-2">
                Toute reproduction, représentation, modification ou exploitation non autorisée est interdite.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 7 - Responsabilité</h2>
              <p>
                HUMAN KNOWLEDGE SAS s'efforce d'assurer la disponibilité et le bon fonctionnement de l'Application, 
                mais ne peut garantir une disponibilité continue et sans interruption.
              </p>
              <p className="mt-2">
                L'utilisateur utilise l'Application sous sa propre responsabilité. HUMAN KNOWLEDGE SAS ne saurait 
                être tenue responsable des dommages directs ou indirects résultant de l'utilisation de l'Application.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 8 - Droit applicable et juridiction</h2>
              <p>
                Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux de Strasbourg 
                seront seuls compétents.
              </p>
            </section>
          </div>
          
          <LegalFooter />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default CGUPage;
