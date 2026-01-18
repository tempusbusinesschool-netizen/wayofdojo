# AIKIDO@GAME - Product Requirements Document

## Original Problem Statement
Application web pour le club d'Aïkido "Aikido@Game" servant de référence digitale pour le programme d'entraînement, gestion des adhésions, et suivi de progression individuelle avec emphase sur la gamification et l'apprentissage philosophique.

## Core Requirements
1. **Gamification & Philosophie** : Motiver les utilisateurs via un parcours personnel avec système de points, intégration des principes philosophiques (Budō) guidés par Maître Tanaka
2. **Rôles utilisateur** : Pratiquant, Parent, Enseignant, Admin
3. **Validation stricte** : Modes Parent vs Auto-validation
4. **Expériences distinctes** : "Jeune Ninja" (enfants) et "Ninja Confirmé" (adultes/teens)
5. **Animations de techniques** : Illustrations animées avec placeholders pour vidéos futures
6. **Contrôle parental** : "Espace Parent" accessible uniquement avec compte Enfant actif
7. **Dashboard Admin** : Zone admin ergonomique avec structure hiérarchique des techniques

## Tech Stack
- Frontend: React + Tailwind CSS + Framer Motion + Shadcn/UI
- Backend: FastAPI (Python)
- Database: MongoDB
- Integrations: Stripe, ElevenLabs (TTS), Resend (emails)

## What's Been Implemented

### 2025-01-18
- ✅ Fusion menu admin : "Techniques Kyu" + "Grades Dan" → "Techniques d'Aikido" (141 techniques)
- ✅ Structure hiérarchique fichiers sous `/app/Sports/Aikido/`
- ✅ Menu sidebar récursif avec navigation multi-niveaux
- ✅ Fil d'Ariane dynamique dans admin
- ✅ Données étendues : Armes (Jo, Bokken, Tanto), Mouvements (Tai Sabaki, Ukemi, etc.)

### Précédent
- ✅ Système de fichiers hiérarchique pour techniques
- ✅ Dashboard Admin avec sidebar collapsible
- ✅ Données pour 45 techniques Dan avec placeholders vidéo
- ✅ Section "Passages de Grades" créée

## Prioritized Backlog

### P0 (Critical)
- Aucun actuellement

### P1 (High)
- Afficher contenu des nouvelles sections Admin (Jo, Bokken, Tanto, Tai Sabaki, etc.)
- Implémenter filtres niveau Dan dans `CombinaisonsPage.jsx`
- Fonction "Retour à la première étape" dans parcours utilisateur
- Analyse globale et nettoyage du code

### P2 (Medium)
- Prototyper plus d'animations de techniques (bloqué: attente choix utilisateur)
- Différencier "Zone Adultes" avec UX moins gamifié
- Section clés API production dans admin

### P3 (Low)
- Corriger erreurs lint dans `StatisticsDashboard.js` (setIsTimelinePanelOpen, setIsJournalPanelOpen)
- Nouveaux blocs "Les différentes techniques" et "Défis collectifs"
- 2FA pour Super Admin

## Key Files
- `/app/frontend/src/components/AdminDashboard.jsx` - Menu sidebar hiérarchique
- `/app/frontend/src/constants/aikidoCombinaisons.js` - Données techniques
- `/app/Sports/Aikido/Techniques d'aikido/` - Structure fichiers techniques
- `/app/frontend/src/App.js` - Routage et logique admin

## Test Credentials
| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Enfant | bill@gmail.com | 123 |
| Parent | parent@gmail.com | parent123 |
| Admin | admin@aikido.com | admin123 |

## Known Issues
- Contenu des nouvelles sections admin (armes, mouvements) : pages vides
- Lint errors dans StatisticsDashboard.js (P3)

## Project Status
- **Broken**: NO
- **Mocked**: NO
