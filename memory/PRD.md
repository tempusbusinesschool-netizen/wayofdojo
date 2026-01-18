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
- ✅ **Menu Admin unifié** : "Techniques d'Aikido" (141 techniques Kyu+Dan)
- ✅ **161 techniques/mouvements** avec données détaillées (noms japonais, points clés, erreurs à éviter)
- ✅ **Passages de Grades** : Visualisation complète du programme officiel

### Passages de Grades - Fonctionnalités
- **10 grades** : 6 Kyu (Blanche → Marron) + 4 Dan (Noires)
- **Onglets** : Grades Kyu / Grades Dan
- **Badges de ceinture** colorés avec étoiles pour les Dan
- **Détails par grade** :
  - Objectifs du grade
  - Mouvements fondamentaux requis
  - Techniques requises par type d'attaque
  - Critères d'évaluation
  - Prérequis
  - Heures minimales de pratique
  - Placeholders vidéo

### Fichiers créés
- `/app/frontend/src/components/admin/PassagesGradesViewer.jsx` - Composant visualisation grades
- `/app/frontend/src/constants/passagesGrades.js` - Données des 10 grades

## Récapitulatif des techniques

| Catégorie | Nombre |
|-----------|--------|
| Techniques Kyu+Dan | 141 |
| Jo (Bâton) | 46 |
| Bokken (Sabre) | 24 |
| Tanto (Couteau) | 21 |
| Tai Sabaki | 10 |
| Ukemi | 9 |
| Kamae | 8 |
| Atemi | 9 |
| Kokyu Waza | 6 |
| Kansetsu Waza | 10 |
| Suwariwaza | 10 |
| Hanmi Handachi | 8 |
| **TOTAL** | **302 éléments** |

## Prioritized Backlog

### P1 (High)
- Filtres niveau Dan dans `CombinaisonsPage.jsx` pour l'affichage utilisateur
- Fonction "Retour à la première étape"
- Analyse globale et nettoyage du code

### P2 (Medium)
- Animations de techniques
- Zone Adultes UX différencié
- Section clés API production

### P3 (Low)
- Lint fixes `StatisticsDashboard.js`
- Blocs "Défis collectifs"
- 2FA Super Admin

## Key Files
- `/app/frontend/src/components/AdminDashboard.jsx` - Menu sidebar
- `/app/frontend/src/components/admin/TechniquesSectionViewer.jsx` - Affichage techniques
- `/app/frontend/src/components/admin/PassagesGradesViewer.jsx` - Affichage grades
- `/app/frontend/src/constants/aikidoTechniquesData.js` - 161 techniques
- `/app/frontend/src/constants/passagesGrades.js` - 10 grades

## Test Credentials
| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Enfant | bill@gmail.com | 123 |
| Parent | parent@gmail.com | parent123 |
| Admin | - | aikido2024 |

## Project Status
- **Broken**: NO
- **Mocked**: NO
