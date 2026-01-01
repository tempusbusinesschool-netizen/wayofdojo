import { Circle, BookOpen, Target, Award } from "lucide-react";

export const MASTERY_LEVELS = {
  not_started: { 
    label: "À découvrir", 
    color: "bg-slate-500", 
    gradient: "from-slate-500 to-slate-600",
    icon: Circle, 
    emoji: "💤",
    weight: 0,
    message: "Prêt à commencer ?"
  },
  learning: { 
    label: "En apprentissage", 
    color: "bg-amber-500", 
    gradient: "from-amber-400 to-orange-500",
    icon: BookOpen, 
    emoji: "📖",
    weight: 33,
    message: "Tu progresses !"
  },
  practiced: { 
    label: "Pratiqué", 
    color: "bg-blue-500", 
    gradient: "from-blue-400 to-indigo-500",
    icon: Target, 
    emoji: "🎯",
    weight: 66,
    message: "Continue comme ça !"
  },
  mastered: { 
    label: "Maîtrisé", 
    color: "bg-emerald-500", 
    gradient: "from-emerald-400 to-green-500",
    icon: Award, 
    emoji: "🏆",
    weight: 100,
    message: "Bravo champion !"
  }
};

// Admin Passwords
export const SUPER_ADMIN_PASSWORD = "aikido2024";  // Super Admin (plateforme)
export const ADMIN_DOJO_PASSWORD = "senseiclub";   // Admin Dojo (club)

// Legacy export for backward compatibility
export const ADMIN_PASSWORD = "aikido2024";
