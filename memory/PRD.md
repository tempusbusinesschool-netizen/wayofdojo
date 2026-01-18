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

### 2025-01-18 (Session actuelle)
- ✅ **Menu Admin unifié** : "Techniques Kyu" + "Grades Dan" → "Techniques d'Aikido" (141 techniques)
- ✅ **Affichage des sections Armes** : Jo (46 techniques), Bokken (24 techniques), Tanto (21 techniques)
- ✅ **Affichage des sections Mouvements** : Tai Sabaki, Ukemi, Kamae, Atemi, Kokyu Waza, Kansetsu Waza, Suwariwaza, Hanmi Handachi
- ✅ **Nouveau composant TechniquesSectionViewer** : Affiche les techniques avec recherche, filtres par niveau, et groupement par catégorie
- ✅ **Fichier de données centralisé** : `/app/frontend/src/constants/aikidoTechniquesData.js` avec toutes les techniques organisées

### Précédent
- ✅ Structure hiérarchique fichiers sous `/app/Sports/Aikido/`
- ✅ Menu sidebar récursif avec navigation multi-niveaux
- ✅ Fil d'Ariane dynamique dans admin
- ✅ Données pour 45 techniques Dan avec placeholders vidéo
- ✅ Section "Passages de Grades" créée

## Prioritized Backlog

### P0 (Critical)
- Aucun actuellement

### P1 (High)
- Implémenter filtres niveau Dan dans `CombinaisonsPage.jsx` pour l'affichage utilisateur
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
- `/app/frontend/src/components/admin/TechniquesSectionViewer.jsx` - **NOUVEAU** Composant d'affichage des techniques
- `/app/frontend/src/constants/aikidoTechniquesData.js` - **NOUVEAU** Données centralisées des techniques
- `/app/frontend/src/constants/aikidoCombinaisons.js` - Données techniques Kyu+Dan
- `/app/Sports/Aikido/Techniques d'aikido/` - Structure fichiers techniques
- `/app/frontend/src/App.js` - Routage et logique admin

## Test Credentials
| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Enfant | bill@gmail.com | 123 |
| Parent | parent@gmail.com | parent123 |
| Admin | - | aikido2024 |

## Known Issues
- Lint errors dans StatisticsDashboard.js (P3)

## Project Status
- **Broken**: NO
- **Mocked**: NO
