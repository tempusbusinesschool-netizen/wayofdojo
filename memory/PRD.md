# Aikido@Game - Product Requirements Document

## 📋 Original Problem Statement
Application web pour le club "Aikido@Game" servant de référence numérique pour le programme d'entraînement, gestion des adhésions, et suivi de progression individuelle avec gamification et philosophie du Budō.

## 🎯 Core Requirements
1. **Gamification & Philosophie** : Système de points et intégration des principes du Budō
2. **Rôles Utilisateurs** : Pratiquant, Parent, Enseignant, Admin
3. **Validation stricte** : Règles de contenu non-négociables
4. **UX différenciée** : "Jeune Ninja" (enfants) vs "Ninja Confirmé" (adultes)
5. **Animations techniques** : Illustrations et vidéos des techniques d'Aïkido
6. **Contrôle parental** : Validation dans le Dojo Virtuel de l'enfant
7. **Dashboard Admin** : Gestion complète du contenu et utilisateurs
8. **Programme officiel FFAAA** : Passages de grades avec suivi de progression

## 👥 User Personas
- **Enfants (6-12 ans)** : Interface ludique "Jeune Ninja"
- **Adultes/Ados** : Interface "Ninja Confirmé" plus sérieuse
- **Parents** : Suivi et validation de progression
- **Enseignants** : Gestion des élèves et observations
- **Administrateurs** : Gestion plateforme et dojos

## 🏗️ Technical Architecture
```
/app/
├── backend/
│   └── server.py (FastAPI + MongoDB)
└── frontend/
    └── src/
        ├── App.js (Main routing)
        ├── components/
        │   ├── AdminDashboard.jsx
        │   ├── admin/
        │   │   ├── UserCredentialsManager.jsx (NEW - Jan 2026)
        │   │   ├── PassagesGradesViewer.jsx
        │   │   └── TechniquesSectionViewer.jsx
        │   └── ...
        └── pages/
            ├── IllustrationsGallery.jsx
            └── VideosSection.jsx
```

## ✅ Completed Features (as of Jan 18, 2026)

### Session Jan 18, 2026
- [x] **Gestion des comptes par catégorie** : Nouvelle section "Mots de passe" dans Admin
  - Comptes organisés par Dojo, Admin, Adhérent
  - Interface avec onglets colorés et recherche
  - Composant: `/app/frontend/src/components/admin/UserCredentialsManager.jsx`

- [x] **Calendrier Stages FFAAA 2026** : Nouvelle section "Stages & Séminaires"
  - 17 stages référencés (France + La Réunion)
  - Filtres par mois, région, type
  - Sources : FFAAA officiel, LRFFAAA, Ligue IDF
  - Composant: `/app/frontend/src/pages/StagesCalendar.jsx`

### Previous Sessions
- [x] UI/UX Overhaul pour techniques (enfants et admin)
- [x] 6e KYU (ceinture blanche) avec 8 techniques
- [x] 12 illustrations générées pour techniques clés
- [x] Galerie Illustrations dans admin
- [x] Section Vidéos dans admin
- [x] Bouton "Dojo & Clubs" remplaçant "Enseignant"
- [x] Système d'authentification (JWT)
- [x] Intégration Stripe pour paiements
- [x] TTS avec ElevenLabs
- [x] Emails transactionnels avec Resend

## 🚧 In Progress Tasks
1. **P1 - Validation Parent** : Section dans Dojo Virtuel pour validation parentale
   - Fichier: `/app/frontend/src/components/VirtualDojo/index.jsx`

## 📋 Prioritized Backlog

### P0 - Critical
- Persistance de l'état utilisateur lors de la navigation (bug connu)

### P1 - High Priority
- [ ] UI suivi de progression (cocher techniques maîtrisées)
- [ ] Générer illustrations restantes (12/214 faites)
- [ ] Finaliser Validation Parent

### P2 - Medium Priority
- [ ] Nettoyage global du code (refactoring)
- [ ] Différencier "Zone Adultes" avec UX sérieuse
- [ ] Section clés API de production dans admin
- [ ] Corriger lint errors dans StatisticsDashboard.js

### P3 - Future
- [ ] Blocs "Les différentes techniques" et "Défis collectifs"
- [ ] Lecture vidéo sur cartes techniques
- [ ] 2FA pour Super Admin

## 🔐 Credentials
| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@aikido.com | aikido2024 |
| Enfant Test | bill@gmail.com | 123 |
| Dojo | dojo@gmail.com | (dans DB) |

## 🔗 3rd Party Integrations
- **Stripe** : Paiements
- **ElevenLabs** : Text-to-Speech
- **Resend** : Emails transactionnels
- **Emergent LLM Key** : TTS backend
- **framer-motion** : Animations UI

## ⚠️ Known Issues
1. **État non persistant** : sessionStorage perdu lors du reload dans screenshot tool
2. **Lint warnings** : `setIsTimelinePanelOpen` et `setIsJournalPanelOpen` non définis dans StatisticsDashboard.js
