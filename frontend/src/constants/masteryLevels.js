import { Circle, BookOpen, Target, Award } from "lucide-react";

export const MASTERY_LEVELS = {
  not_started: { label: "Non démarré", color: "bg-slate-500", icon: Circle, weight: 0 },
  learning: { label: "En apprentissage", color: "bg-amber-500", icon: BookOpen, weight: 33 },
  practiced: { label: "Pratiqué", color: "bg-blue-500", icon: Target, weight: 66 },
  mastered: { label: "Maîtrisé", color: "bg-emerald-500", icon: Award, weight: 100 }
};

export const ADMIN_PASSWORD = "aikido2024";
