# AIKIDO@GAME - Product Requirements Document

## Original Problem Statement
Application web pour le club d'Aïkido "Aikido@Game" servant de référence digitale pour le programme d'entraînement, gestion des adhésions, et suivi de progression individuelle avec emphase sur la gamification et l'apprentissage philosophique.

## Core Requirements
1. **Gamification & Philosophie** : Motiver les utilisateurs via un parcours personnel avec système de points
2. **Rôles utilisateur** : Pratiquant, Parent, Enseignant, Admin
3. **Programme FFAAA officiel** : Passages de Grades alignés sur la Fédération Française d'Aïkido
4. **Expériences distinctes** : "Jeune Ninja" (enfants) et "Ninja Confirmé" (adultes/teens)

## Tech Stack
- Frontend: React + Tailwind CSS + Framer Motion + Shadcn/UI
- Backend: FastAPI (Python)
- Database: MongoDB

## What's Been Implemented

### 2025-01-18 - Refonte complète "Passages de Grades"

#### Backend API (`/api/grades/*`)
| Endpoint | Description |
|----------|-------------|
| `GET /api/grades/programme` | Tous les 10 grades (6 Kyu + 4 Dan) |
| `GET /api/grades/programme?type=kyu` | 6 grades Kyu uniquement |
| `GET /api/grades/programme?type=dan` | 4 grades Dan uniquement |
| `GET /api/grades/programme/{grade_id}` | Détail complet d'un grade |
| `GET /api/grades/categories` | Catégories de techniques |
| `GET /api/grades/attaques` | Types d'attaques |

#### Grades Disponibles
**GRADES KYU (Mudansha)**
| Grade | Ceinture | Techniques | Mouvements | Heures min |
|-------|----------|------------|------------|------------|
| 6e Kyu | Blanche | 8 | 9 | 20h |
| 5e Kyu | Jaune | 13 | 4 | 30h |
| 4e Kyu | Orange | 17 | 2 | 60h |
| 3e Kyu | Verte | 16 | 1 | 120h |
| 2e Kyu | Bleue | 22 | 0 | 140h |
| 1er Kyu | Marron | 21 | 0 | 160h |

**GRADES DAN (Yudansha)**
| Grade | Ceinture | Techniques | Mouvements | Heures min |
|-------|----------|------------|------------|------------|
| Shodan | Noire | 13 | 2 | 300h |
| Nidan | Noire | 10 | 2 | 500h |
| Sandan | Noire | 7 | 1 | 700h |
| Yondan | Noire | 4 | 1 | 1000h |

#### Frontend - PassagesGradesViewer.jsx

**Navigation & Structure:**
- ✅ Onglets séparés Kyu / Dan
- ✅ Grille de cartes par grade avec badges colorés
- ✅ Page dédiée par grade (au lieu de panel latéral)

**Affichage des techniques:**
- ✅ Tableau structuré par attaque
- ✅ Colonnes: Obligatoire, Technique, Japonais, Catégorie, Détails
- ✅ Lignes expandables avec points clés et erreurs à éviter
- ✅ Badges de catégorie colorés

**Informations par grade:**
- Objectifs du grade
- Mouvements fondamentaux (expandable)
- Programme technique (tableau)
- Critères d'évaluation
- Durée d'examen
- Prérequis

#### Architecture fichiers
```
Backend:
  /app/backend/models/passages_grades.py    # Données FFAAA (10 grades)
  /app/backend/routes/grades_routes.py      # API avec filtre type=kyu|dan

Frontend:
  /app/frontend/src/components/admin/PassagesGradesViewer.jsx
    ├── GradeListCard        # Carte de grade dans la liste
    ├── GradeDetailPage      # Page dédiée par grade
    ├── TechniquesTable      # Tableau structuré par attaque
    └── MouvementsSection    # Section mouvements expandable
```

## Tests
- **Backend**: 17/17 tests passés (100%)
- **Frontend**: 100% fonctionnel
- **Test files**: 
  - `/app/tests/test_grades_api.py`
  - `/app/test_reports/iteration_9.json`

## Prioritized Backlog

### P0 (Completed ✅)
- ~~Refonte "Passages de Grades" avec API backend~~
- ~~Ajout des 4 grades Dan (Shodan → Yondan)~~
- ~~Onglets Kyu/Dan~~
- ~~Page dédiée par grade~~
- ~~Tableau structuré par attaque/technique~~

### P1 (High Priority)
- **Suivi de progression utilisateur**: UI pour marquer techniques validées
- Fonction "Retour à la première étape"
- Nettoyage global du projet

### P2 (Medium)
- Zone Adultes différenciée (moins gamifié)
- Section clés API production

### P3 (Low Priority)
- Fix lint `StatisticsDashboard.js`
- Animations/vidéos techniques

## Test Credentials
| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | - | aikido2024 |
| Enfant | bill@gmail.com | 123 |

## Project Status
- **Broken**: NO
- **Mocked**: NO
- **Last Test**: 2025-01-18 - 100% pass rate
