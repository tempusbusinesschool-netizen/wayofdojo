import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "WayofDojo - La Voie du Dojo",
  description: "Plateforme internationale de gamification pour arts martiaux et sports à progression",
  keywords: ["aikido", "martial arts", "gamification", "dojo", "training"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
