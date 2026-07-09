import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Simple accordion wrapper that adds a clickable header above any content
 * The content is shown/hidden using CSS display property
 */
const SimpleAccordion = ({ 
  title, 
  emoji, 
  subtitle, 
  headerGradient = "from-indigo-600 via-purple-600 to-pink-600",
  defaultOpen = true,
  children,
  testId = "accordion"
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4">
      {/* Header cliquable */}
      <div 
        className={`bg-gradient-to-r ${headerGradient} rounded-t-2xl p-4 cursor-pointer hover:opacity-90 transition-all border-2 border-b-0 border-white/10`}
        onClick={() => setIsOpen(!isOpen)}
        data-testid={`${testId}-header`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{emoji}</span>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white">{title}</h3>
              {subtitle && <span className="text-white/70 text-xs md:text-sm hidden md:inline">{subtitle}</span>}
            </div>
          </div>
          <div className={`p-2 rounded-full bg-white/20 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      
      {/* Contenu avec animation */}
      <div 
        className={`transition-all duration-300 overflow-hidden ${isOpen ? '' : 'hidden'}`}
        data-testid={`${testId}-content`}
      >
        {children}
      </div>
    </div>
  );
};

export default SimpleAccordion;
