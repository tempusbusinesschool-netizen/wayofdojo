import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AccordionBlock = ({ 
  title, 
  emoji, 
  subtitle, 
  gradientFrom, 
  gradientVia, 
  gradientTo, 
  borderColor,
  isOpen: defaultOpen = false,
  children,
  testId
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`mb-4 rounded-2xl border-2 ${borderColor} shadow-xl overflow-hidden`}>
      {/* Header cliquable */}
      <div 
        className={`bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo} p-4 cursor-pointer hover:opacity-90 transition-all`}
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
      
      {/* Contenu */}
      <div 
        className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}
        data-testid={`${testId}-content`}
      >
        {children}
      </div>
    </div>
  );
};

export default AccordionBlock;
