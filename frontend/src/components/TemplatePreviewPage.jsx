import React from 'react';
import VisitorTemplatePreviewA from './VisitorTemplatePreviewA';
import VisitorTemplatePreviewB from './VisitorTemplatePreviewB';
import VisitorTemplatePreviewC from './VisitorTemplatePreviewC';

/**
 * Page de prévisualisation des 3 templates enfant
 */
const TemplatePreviewPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 p-6 space-y-12">
      {/* Template A */}
      <div>
        <h1 className="text-3xl font-black text-amber-400 mb-4 text-center">
          🗺️ Option A : "Carte au Trésor"
        </h1>
        <VisitorTemplatePreviewA />
      </div>

      <hr className="border-slate-700" />

      {/* Template B */}
      <div>
        <h1 className="text-3xl font-black text-purple-400 mb-4 text-center">
          ✨ Option B : "Constellation Ninja"
        </h1>
        <VisitorTemplatePreviewB />
      </div>

      <hr className="border-slate-700" />

      {/* Template C */}
      <div>
        <h1 className="text-3xl font-black text-rose-400 mb-4 text-center">
          🏯 Option C : "Village Dojo"
        </h1>
        <VisitorTemplatePreviewC />
      </div>
    </div>
  );
};

export default TemplatePreviewPage;
