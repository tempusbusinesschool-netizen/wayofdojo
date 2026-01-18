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
8. **Programme FFAAA** : Passages de Grades alignés sur le programme officiel de la Fédération Française d'Aïkido

## Tech Stack
- Frontend: React + Tailwind CSS + Framer Motion + Shadcn/UI
- Backend: FastAPI (Python)
- Database: MongoDB
- Integrations: Stripe, ElevenLabs (TTS), Resend (emails)

## What's Been Implemented

### 2025-01-18 - Refonte "Passages de Grades" (FFAAA)
- ✅ **Backend API complète** : `/api/grades/programme` avec 6 grades Kyu
- ✅ **Données FFAAA officielles** : Programme officiel structuré dans `models/passages_grades.py`
- ✅ **Frontend refondu** : `PassagesGradesViewer.jsx` consomme l'API backend
- ✅ **Tests automatisés** : 12 tests backend passés (100%)

### Architecture "Passages de Grades"
```
Backend:
  /app/backend/models/passages_grades.py     # Modèles + données FFAAA (6 Kyu)
  /app/backend/routes/grades_routes.py       # API endpoints
  
Frontend:
  /app/frontend/src/components/admin/PassagesGradesViewer.jsx  # Composant refondu
```

### Endpoints API Grades
| Endpoint | Description |
|----------|-------------|
| `GET /api/grades/programme` | Liste des 6 grades Kyu avec résumé |
| `GET /api/grades/programme/{grade_id}` | Détail complet d'un grade |
| `GET /api/grades/categories` | 8 catégories de techniques |
| `GET /api/grades/attaques` | Types d'attaques avec japonais |
| `GET /api/grades/user/{id}/progress` | Progression utilisateur |
| `POST /api/grades/user/{id}/progress` | Mise à jour progression |

### Données par Grade Kyu
| Grade | Ceinture | Techniques | Mouvements | Heures min |
|-------|----------|------------|------------|------------|
| 6e Kyu | Blanche | 8 | 9 | 20h |
| 5e Kyu | Jaune | 13 | 4 | 30h |
| 4e Kyu | Orange | 17 | 2 | 60h |
| 3e Kyu | Verte | 16 | 1 | 120h |
| 2e Kyu | Bleue | 22 | 0 | 140h |
| 1er Kyu | Marron | 21 | 0 | 160h |

### Fonctionnalités Frontend
- **Liste des grades** avec badges colorés
- **Vue détaillée** par grade :
  - Objectifs du grade
  - Mouvements fondamentaux (expandables avec points clés)
  - Techniques par type d'attaque (groupées)
  - Techniques par catégorie
  - Critères d'évaluation
  - Durée d'examen
- **Data-testid** sur tous les éléments interactifs

## Récapitulatif des techniques (anciennes données statiques)

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

### P0 (Completed ✅)
- ~~Refonte "Passages de Grades" alignée sur FFAAA~~
- ~~API Backend pour les grades~~
- ~~Frontend connecté à l'API~~

### P1 (High Priority)
- **Suivi de progression utilisateur** : UI pour marquer techniques validées
- Fonction "Retour à la première étape" dans le parcours
- Analyse globale et nettoyage du code

### P2 (Medium)
- Zone Adultes ("Ninja Confirmé") UX différencié
- Section clés API production dans admin
- Animations de techniques

### P3 (Low Priority)
- Lint fixes `StatisticsDashboard.js` (setIsTimelinePanelOpen, setIsJournalPanelOpen non définis)
- Blocs "Défis collectifs" et nouvelles techniques
- 2FA Super Admin

## Key Files
- `/app/backend/models/passages_grades.py` - Données FFAAA officielles
- `/app/backend/routes/grades_routes.py` - API grades
- `/app/frontend/src/components/admin/PassagesGradesViewer.jsx` - Viewer grades
- `/app/frontend/src/components/AdminDashboard.jsx` - Menu sidebar admin
- `/app/frontend/src/constants/aikidoTechniquesData.js` - 161 techniques (legacy)

## Test Credentials
| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Enfant | bill@gmail.com | 123 |
| Parent | parent@gmail.com | parent123 |
| Admin | - | aikido2024 |

## Test Reports
- `/app/test_reports/iteration_8.json` - Tests Passages de Grades
- `/app/tests/test_grades_api.py` - Tests API (12 tests)

## Project Status
- **Broken**: NO
- **Mocked**: NO
- **Last Test**: 2025-01-18 - 100% pass rate (backend + frontend)
