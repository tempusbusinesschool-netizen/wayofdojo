# Aikido@Game - Product Requirements Document

## 📋 Présentation du Projet

**Application web** pour le club "Aikido@Game" servant de référence numérique pour le programme d'entraînement, gestion des adhésions et suivi de progression personnalisé avec gamification et philosophie Budō.

## 🎯 Objectifs Principaux

1. **Gamification & Philosophie** - Motiver via un système de points et intégrer les principes du Budō
2. **Rôles Utilisateurs** - Pratiquant, Parent, Enseignant, Admin
3. **Expérience Différenciée** - "Jeune Ninja" (enfants) vs "Ninja Confirmé" (adultes)
4. **Animations Techniques** - Illustrations/vidéos des techniques d'Aikido
5. **Programme Officiel** - Aligné avec la FFAAA

## 🔐 Identifiants de Test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | `admin@aikido.com` | `aikido2024` |
| Enfant | `bill@gmail.com` | `123` |
| Dojo | `dojo@gmail.com` | `aikido2024` |

## ✅ Fonctionnalités Complétées

### Session Janvier 2026
- [x] **Admin "Mots de passe"** - UI organisée par rôles (Dojo/Admin/Adhérent)
- [x] **Calendrier Stages FFAAA 2026** - Affiches, infos senseis, filtres
- [x] **Annuaire FFAAA** - 136 clubs France + DOM-TOM avec recherche/filtres
- [x] **Formulaire création adhérents** - Dans "Gestion Dojos"
- [x] **Intégration associations sportives** - Vérifiée et fonctionnelle

### Sessions Précédentes
- [x] Interface gamifiée pour enfants
- [x] Système de points et défis
- [x] Passages de grades (structure)
- [x] Galerie d'illustrations
- [x] Espace Dojo
- [x] Tableau de bord admin

## 🔴 Issues Ouvertes

### P0 - Critiques
1. **Persistance de session** - État perdu au rechargement (bloquant tests)
2. **Validation Parent** - Formulaire dans Dojo Virtuel à finaliser (reporté 2x)

### P3 - Mineures
- Erreurs lint dans `StatisticsDashboard.js` (setIsTimelinePanelOpen, setIsJournalPanelOpen non définis)

## 🟠 Tâches En Cours / À Venir

### P1 - Haute Priorité
- [ ] UI suivi progression utilisateur (Passages de Grades)
- [ ] Générer illustrations techniques supplémentaires

### P2 - Moyenne Priorité
- [ ] Cleanup global du projet
- [ ] Différencier UX "Zone Adultes" (moins gamifié)

## 🗂️ Backlog

- Import CSV pour création adhérents en lot
- Coordonnées GPS pour carte interactive des clubs
- Système inscription stages avec notifications email
- Horaires et tarifs dans l'annuaire
- Lecture vidéo sur fiches techniques
- 2FA pour Super Admin

## 🏗️ Architecture Technique

```
/app/
├── backend/
│   └── server.py                  # FastAPI
├── frontend/
│   ├── src/
│   │   ├── App.js                 # Routing principal
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── admin/
│   │   │   │   ├── DojoManagementPanel.jsx
│   │   │   │   └── UserCredentialsManager.jsx
│   │   ├── data/
│   │   │   └── clubsAikidoFrance.js  # Base 136 clubs
│   │   └── pages/
│   │       └── StagesCalendar.jsx
│   └── package.json
└── memory/
    └── PRD.md
```

## 🔌 Intégrations Tierces

- **Stripe** - Paiements
- **ElevenLabs** - Text-to-Speech
- **Resend** - Emails transactionnels
- **Framer Motion** - Animations UI
- **Emergent LLM Key** - TTS backend

## 📊 API Endpoints Clés

- `GET /api/dojos` - Liste des dojos
- `PUT /api/dojos/{id}` - Modifier un dojo
- `GET /api/users` - Liste utilisateurs
- `POST /api/auth/login` - Connexion

## ⚠️ Points d'Attention

1. **Données statiques** - `clubsAikidoFrance.js` alourdit le bundle frontend → migrer vers API backend
2. **Routing** - Rendu conditionnel dans App.js → considérer React Router
3. **State Management** - Problème persistance → implémenter localStorage ou Context robuste

---
*Dernière mise à jour: 18 Janvier 2026*
