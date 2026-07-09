import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import LegalHeader from "./LegalHeader";
import LegalFooter from "./LegalFooter";

function ChartePage({ isOpen, onClose }) {
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
          <LegalHeader title="Charte d'Utilisation" />
          
          <div className="space-y-6 text-sm leading-relaxed">
            <p className="text-slate-400 italic">En vigueur au 1er janvier 2026</p>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Préambule</h2>
              <p>
                La présente Charte d'Utilisation a pour objectif de définir les règles de bonne conduite 
                et les valeurs qui guident l'utilisation de l'Application « Techniques d'Aïkido ».
              </p>
              <p className="mt-2">
                En utilisant l'Application, chaque utilisateur s'engage à respecter ces principes, 
                en accord avec l'esprit de l'Aïkido.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 1 - Esprit de l'Application</h2>
              <p>
                L'Application est conçue comme un espace de progression personnelle, de révision 
                et de motivation pour les pratiquants d'Aïkido.
              </p>
              <div className="mt-3 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                <p className="text-purple-300 font-medium">Nos valeurs fondamentales :</p>
                <ul className="mt-2 space-y-2">
                  <li>🎯 <strong>Progression personnelle</strong> : Chaque parcours est unique</li>
                  <li>🤝 <strong>Bienveillance</strong> : Aucune compétition, aucun jugement</li>
                  <li>📚 <strong>Apprentissage</strong> : Révision et mémorisation des techniques</li>
                  <li>🧘 <strong>Régularité</strong> : Constance et engagement dans la pratique</li>
                </ul>
              </div>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 2 - Engagements de l'utilisateur</h2>
              <p>En utilisant l'Application, l'utilisateur s'engage à :</p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>
                  <strong>Utiliser l'Application avec honnêteté</strong> : les progressions déclarées 
                  doivent refléter la réalité de sa pratique.
                </li>
                <li>
                  <strong>Respecter les autres utilisateurs</strong> : dans le cadre des défis 
                  communautaires, adopter une attitude respectueuse et bienveillante.
                </li>
                <li>
                  <strong>Ne pas tricher</strong> : ne pas utiliser de moyens détournés pour obtenir 
                  des points ou des badges de manière frauduleuse.
                </li>
                <li>
                  <strong>Respecter la confidentialité</strong> : ne pas partager les informations 
                  d'autres utilisateurs sans leur consentement.
                </li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 3 - Rappel important</h2>
              <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                <p className="text-amber-300 font-semibold">⚠️ L'Application ne remplace pas l'enseignement</p>
                <p className="mt-2">
                  L'Application est un outil de révision et de motivation. Elle ne remplace en aucun cas 
                  l'enseignement dispensé par un professeur qualifié au sein d'un dojo.
                </p>
                <p className="mt-2">
                  La pratique de l'Aïkido nécessite un encadrement adapté pour garantir la sécurité 
                  et la qualité de l'apprentissage.
                </p>
              </div>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 4 - Contenus interdits</h2>
              <p>Il est strictement interdit de :</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Publier des contenus illicites, diffamatoires, injurieux ou discriminatoires</li>
                <li>Usurper l'identité d'un autre utilisateur</li>
                <li>Utiliser l'Application à des fins commerciales non autorisées</li>
                <li>Tenter de compromettre la sécurité ou le fonctionnement de l'Application</li>
                <li>Collecter des données personnelles d'autres utilisateurs</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 5 - Modération et sanctions</h2>
              <p>
                HUMAN KNOWLEDGE SAS se réserve le droit de suspendre ou supprimer tout compte 
                ne respectant pas la présente Charte, sans préavis ni indemnité.
              </p>
              <p className="mt-2">
                Les comportements contraires à l'esprit de l'Aïkido et aux valeurs de l'Application 
                pourront faire l'objet de sanctions.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 6 - Les 7 Vertus de l'Aïkido</h2>
              <p>
                L'Application encourage la pratique des 7 vertus traditionnelles de l'Aïkido :
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="p-2 bg-slate-800 rounded">🎯 <strong>Gi</strong> - Droiture</div>
                <div className="p-2 bg-slate-800 rounded">💪 <strong>Yu</strong> - Courage</div>
                <div className="p-2 bg-slate-800 rounded">❤️ <strong>Jin</strong> - Bienveillance</div>
                <div className="p-2 bg-slate-800 rounded">🙏 <strong>Rei</strong> - Respect</div>
                <div className="p-2 bg-slate-800 rounded">🎭 <strong>Makoto</strong> - Sincérité</div>
                <div className="p-2 bg-slate-800 rounded">⚖️ <strong>Meiyo</strong> - Honneur</div>
                <div className="p-2 bg-slate-800 rounded">🤝 <strong>Chugi</strong> - Loyauté</div>
              </div>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Article 7 - Contact</h2>
              <p>
                Pour signaler un comportement inapproprié ou pour toute question relative à cette Charte, 
                contactez-nous à : contact@humanknowledge.fr
              </p>
            </section>
          </div>
          
          <LegalFooter />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default ChartePage;
