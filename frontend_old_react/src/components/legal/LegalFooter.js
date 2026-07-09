import React from "react";

function LegalFooter() {
  return (
    <div className="mt-8 pt-6 border-t border-slate-700 text-xs text-slate-500 space-y-2">
      <div className="font-semibold text-slate-400">HUMAN KNOWLEDGE SAS</div>
      <div>Société par Actions Simplifiées (SAS)</div>
      <div>30, rue de Lattre de Tassigny</div>
      <div>67300 SCHILTIGHEIM - STRASBOURG</div>
      <div className="pt-2">
        <span className="font-medium">SIRET :</span> 890 798 317 00024
      </div>
      <div>
        <span className="font-medium">Contact :</span> contact@humanknowledge.fr
      </div>
    </div>
  );
}

export default LegalFooter;
