import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import LegalHeader from "./LegalHeader";
import LegalFooter from "./LegalFooter";

function MentionsLegalesPage({ isOpen, onClose }) {
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
          <LegalHeader title="Mentions Légales" />
          
          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. Éditeur du site</h2>
              <div className="p-4 bg-slate-800 rounded-lg space-y-2">
                <p><strong className="text-white">Raison sociale :</strong> HUMAN KNOWLEDGE SAS</p>
                <p><strong className="text-white">Forme juridique :</strong> Société par Actions Simplifiées (SAS)</p>
                <p><strong className="text-white">Capital social :</strong> [À compléter]</p>
                <p><strong className="text-white">Siège social :</strong> 30, rue de Lattre de Tassigny, 67300 SCHILTIGHEIM - STRASBOURG</p>
                <p><strong className="text-white">SIRET :</strong> 890 798 317 00024</p>
                <p><strong className="text-white">RCS :</strong> Strasbourg</p>
                <p><strong className="text-white">Numéro TVA intracommunautaire :</strong> [À compléter]</p>
              </div>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. Directeur de la publication</h2>
              <div className="p-4 bg-slate-800 rounded-lg space-y-2">
                <p><strong className="text-white">Nom :</strong> Bruno COURTIN</p>
                <p><strong className="text-white">Qualité :</strong> Représentant légal</p>
                <p><strong className="text-white">Email :</strong> contact@humanknowledge.fr</p>
              </div>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. Hébergeur</h2>
              <div className="p-4 bg-slate-800 rounded-lg space-y-2">
                <p><strong className="text-white">Raison sociale :</strong> O2switch</p>
                <p><strong className="text-white">Adresse :</strong> Chemin des Pardiaux, 63000 Clermont-Ferrand, France</p>
                <p><strong className="text-white">Téléphone :</strong> 04 44 44 60 40</p>
                <p><strong className="text-white">Site web :</strong> www.o2switch.fr</p>
              </div>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Propriété intellectuelle</h2>
              <p>
                L'ensemble du contenu du site (textes, images, graphismes, logo, icônes, sons, logiciels, etc.) 
                est la propriété exclusive de HUMAN KNOWLEDGE SAS ou de ses partenaires et est protégé par 
                les lois françaises et internationales relatives à la propriété intellectuelle.
              </p>
              <p className="mt-2">
                Toute reproduction, représentation, modification, publication, adaptation totale ou partielle 
                de ces éléments, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation 
                écrite préalable de HUMAN KNOWLEDGE SAS.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. Données personnelles</h2>
              <p>
                Les informations recueillies sur ce site font l'objet d'un traitement informatique destiné à 
                la gestion des comptes utilisateurs et à l'amélioration des services proposés.
              </p>
              <p className="mt-2">
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi 
                « Informatique et Libertés », vous disposez d'un droit d'accès, de rectification, de suppression 
                et de portabilité de vos données.
              </p>
              <p className="mt-2">
                Pour exercer ces droits, contactez-nous à : contact@humanknowledge.fr
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Cookies</h2>
              <p>
                Ce site utilise des cookies techniques nécessaires au bon fonctionnement de l'Application. 
                Ces cookies ne collectent pas de données personnelles à des fins commerciales.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Limitation de responsabilité</h2>
              <p>
                HUMAN KNOWLEDGE SAS s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise 
                à jour des informations diffusées sur ce site. Toutefois, HUMAN KNOWLEDGE SAS ne peut garantir 
                l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.
              </p>
              <p className="mt-2">
                En conséquence, HUMAN KNOWLEDGE SAS décline toute responsabilité pour toute imprécision, 
                inexactitude ou omission portant sur des informations disponibles sur ce site.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">8. Droit applicable</h2>
              <p>
                Les présentes mentions légales sont soumises au droit français. En cas de litige, 
                les tribunaux de Strasbourg seront seuls compétents.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">9. Contact</h2>
              <p>
                Pour toute question ou réclamation, vous pouvez nous contacter :
              </p>
              <ul className="mt-2 space-y-1">
                <li>• Par email : contact@humanknowledge.fr</li>
                <li>• Par courrier : HUMAN KNOWLEDGE SAS, 30 rue de Lattre de Tassigny, 67300 SCHILTIGHEIM</li>
              </ul>
            </section>
          </div>
          
          <LegalFooter />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default MentionsLegalesPage;
