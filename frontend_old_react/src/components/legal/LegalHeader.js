import React from "react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_budo-journey/artifacts/3ob78mpx_Logo%20Human%20Knowledge%20RVB.jpg";

function LegalHeader({ title }) {
  return (
    <div className="mb-8">
      {/* Logo */}
      <div className="flex items-start mb-6">
        <img 
          src={LOGO_URL} 
          alt="Human Knowledge" 
          className="h-16 w-auto object-contain"
        />
      </div>
      
      {/* Title */}
      <h1 className="text-2xl font-bold text-white border-b border-slate-700 pb-4">
        {title}
      </h1>
    </div>
  );
}

export default LegalHeader;
