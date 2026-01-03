# BUDO JOURNEY - Product Requirements Document

## Original Problem Statement
Application web pour le club d'Aikido "Aikido La Rivière". L'application doit servir de référence digitale pour le programme d'entraînement, gérer les adhésions du club et permettre aux utilisateurs de suivre leur progression personnelle avec une forte emphase sur la gamification.

## User Personas
1. **Pratiquant** - Utilisateur standard qui suit sa progression
2. **Parent** - Gère le compte de son enfant (à implémenter)
3. **Enseignant** - Gère les cours et valide les progressions (à implémenter)
4. **Admin (Super Admin)** - Gère la plateforme, dojos, conformité
5. **Espace Dojo (Dojo Admin)** - Gère les adhérents de son dojo

## Core Requirements
- Gamification avec système de points
- Architecture multi-dojo
- Conformité RGPD
- Interface moderne, sombre, ludique et colorée

## Tech Stack
- **Frontend**: React, TailwindCSS, Shadcn UI
- **Backend**: FastAPI, Motor (async MongoDB), JWT
- **Database**: MongoDB

---

## What's Been Implemented

### December 2025 - Session 1
- Application full-stack stable et fonctionnelle
- Dashboard conditionnel (guest vs logged-in)
- Panneaux Admin et Espace Dojo opérationnels
- Données des niveaux Kyu correctement affichées
- Message d'accueil avec prénom utilisateur
- Quick-login buttons pour tests
- ErrorBoundary pour prévenir les crashs
- Dialogs séparés pour inscription et connexion

### January 2026 - Session 2
- **REORGANISATION DES MODULES UTILISATEUR CONNECTÉ**
  - Structure en 5 blocs distincts :
    1. **BLOC 1** - Tableau de bord général ("Ma Progression Ninja !")
    2. **BLOC 2** - Entrainement Techniques d'Aikido (ceintures, Mon Parcours Aïkido, Les Déplacements)
    3. **BLOC 3** - Comprendre les Valeurs de l'Aikido (7 vertus, camembert, trophées)
    4. **BLOC 4** - Histoire de l'Aikido (Les Sept Plis du Hakama, O Sensei)
    5. **BLOC 5** - Prochaine étape (boutons PDF, CSV, Timeline, Journal)

### January 2026 - Session 3 (Actuelle)
- **CONVERSION DES BLOCS EN ACCORDÉONS** ✅
  - Création du composant `SimpleAccordion.jsx` réutilisable
  - 4 accordéons sur la page visiteur :
    1. **Ma Progression Ninja !** (gradient violet/rose) - Stats & Grades KYU
    2. **Entrainement - Techniques d'Aikido** (gradient cyan/bleu) - Parcours & Déplacements
    3. **Les Valeurs de l'Aikido** (gradient violet/fuchsia) - 7 Vertus & Trophées
    4. **Histoire de l'Aikido** (gradient orange/ambre) - Hakama & O Sensei
  - Fonctionnalités des accordéons :
    - Header coloré cliquable avec emoji et titre
    - Chevron animé (↑ ouvert, ↓ fermé)
    - Contenu repliable/dépliable avec animation CSS
    - data-testid pour les tests automatisés
  - Tests passés à 100% (frontend)

---

## Prioritized Backlog

### P0 - Critical
- (Completed) Message d'accueil avec prénom ✅
- (Completed) Réorganisation des 5 blocs ✅
- (Completed) Conversion en accordéons ✅

### P1 - High Priority
- [ ] Nouveau design du Header (Options A, B, C, D à choisir)
- [ ] Page de présentation principale (style "Grille Colorée")
- [ ] Finalisation Stripe (webhooks & paiements réels)

### P2 - Medium Priority
- [ ] Migration vers PostgreSQL
- [ ] Rôles avancés (Parent, Enseignant)
- [ ] Mot de passe oublié
- [ ] Nouveaux blocs de contenu (techniques aikido, défis collectifs)

### P3 - Low Priority
- [ ] Améliorations sécurité (2FA Admin)
- [ ] Mise à jour des PDFs (logo, infos entreprise)

---

## Test Credentials
- **User**: `test@aikido.fr` / `test123`
- **Super Admin**: Password `aikido2024`
- **Espace Dojo (Email)**: `contact@aikido-lariviere.fr` / `aikido2024`
- **Espace Dojo (Liste)**: Password `senseiclub`

---

## Key Files
- `/app/frontend/src/components/StatisticsDashboard.js` - Dashboard principal avec les 4 accordéons
- `/app/frontend/src/components/SimpleAccordion.jsx` - Composant accordéon réutilisable
- `/app/frontend/src/App.js` - Composant principal
- `/app/backend/server.py` - API backend
