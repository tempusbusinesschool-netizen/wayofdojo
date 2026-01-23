'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

interface TanakaAdultProps {
  message: string;
  isVisible?: boolean;
  onClose?: () => void;
}

export function TanakaAdult({ message, isVisible = true, onClose }: TanakaAdultProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (!isVisible || isMinimized) return;
    
    setDisplayedText('');
    setIsTyping(true);
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < message.length) {
        setDisplayedText(prev => prev + message[index]);
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [message, isVisible, isMinimized]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm"
      >
        {isMinimized ? (
          // Minimized state
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMinimized(false)}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-500/50 shadow-xl flex items-center justify-center"
          >
            <span className="text-3xl">🧙‍♂️</span>
          </motion.button>
        ) : (
          // Full message
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🧙‍♂️</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Maître Tanaka</h4>
                  <p className="text-amber-400 text-xs">先生 · Mentor</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-slate-400" />
                </button>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="p-4">
              <p className="text-white text-sm leading-relaxed min-h-[60px]">
                {displayedText}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-2 h-4 bg-amber-400 ml-1"
                  />
                )}
              </p>
            </div>

            {/* Footer with signature */}
            <div className="px-4 pb-3 flex items-center justify-between">
              <p className="text-slate-500 text-xs italic">
                "La sagesse est le fruit de l'expérience."
              </p>
              <div className="text-amber-500/50 text-lg">道</div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default TanakaAdult;
