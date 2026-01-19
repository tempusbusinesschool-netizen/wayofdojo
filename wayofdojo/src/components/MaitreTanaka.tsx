'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

interface MaitreTanakaProps {
  messages?: string[];
  isJeuneNinja?: boolean;
}

const defaultMessages = [
  "Bienvenue sur WayofDojo ! 🥋",
  "Je suis Maître Tanaka, ton guide.",
  "Clique sur une étape pour commencer ton aventure !",
  "L'Aïkido, c'est du jeu ! 🎮",
  "N'oublie pas : le respect est la première vertu.",
];

export default function MaitreTanaka({ messages = defaultMessages, isJeuneNinja = false }: MaitreTanakaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    // Auto rotate messages
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [messages.length]);

  // Auto show bubble after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50" data-testid="maitre-tanaka">
      <AnimatePresence>
        {showBubble && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute bottom-20 right-0 w-64 p-4 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl rounded-br-sm shadow-2xl shadow-violet-500/30"
          >
            <button 
              onClick={() => setShowBubble(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-white text-sm font-medium">{messages[currentMessage]}</p>
            <div className="flex gap-1 mt-3">
              {messages.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full ${i === currentMessage ? 'bg-white' : 'bg-white/30'}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Button */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowBubble(false);
        }}
        className={`relative w-16 h-16 rounded-full shadow-2xl overflow-hidden border-4 ${
          isJeuneNinja 
            ? 'border-amber-400 shadow-amber-500/30' 
            : 'border-violet-500 shadow-violet-500/30'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          y: [0, -5, 0],
        }}
        transition={{ 
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Tanaka Avatar - Gradient placeholder with emoji for now */}
        <div className={`w-full h-full flex items-center justify-center text-3xl ${
          isJeuneNinja 
            ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
            : 'bg-gradient-to-br from-violet-600 to-purple-700'
        }`}>
          🥷
        </div>
        
        {/* Notification dot */}
        {showBubble && (
          <motion.div 
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <MessageCircle className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-80 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden"
          >
            {/* Header */}
            <div className={`p-4 ${
              isJeuneNinja 
                ? 'bg-gradient-to-r from-amber-600 to-orange-600' 
                : 'bg-gradient-to-r from-violet-600 to-purple-600'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                  🥷
                </div>
                <div>
                  <h3 className="font-bold text-white">Maître Tanaka</h3>
                  <p className="text-white/70 text-sm">Ton guide Aikido</p>
                </div>
              </div>
            </div>
            
            {/* Messages */}
            <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-800 rounded-xl rounded-tl-sm p-3"
                >
                  <p className="text-white text-sm">{msg}</p>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-white text-sm font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
