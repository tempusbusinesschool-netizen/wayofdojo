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

- **REFACTORING & COMPOSANTS LUDIQUES** ✅
  - Découpage de `StatisticsDashboard.js` (1818 → **1345 lignes**, -26%)
  - Nouveaux composants extraits :
    - `BeltProgressCard.jsx` - Section "Mon Parcours Ninja" ludique pour enfants
    - `GradeCardsGrid.jsx` - Grille des grades avec cartes colorées
    - `DeplacementsSection.jsx` - Section déplacements dépliable
    - `VirtuesSection.jsx` - Section "Les 7 Vertus Magiques" ludique ✅
    - `HakamaHistory.jsx` - Section "Histoire de l'Aikido" avec les 7 plis du Hakama ✅ (NEW)
    - `constants/aikidoBelts.js` - Définitions des ceintures avec animaux
  - **Section Mon Parcours Ninja** adaptée aux enfants :
    - Animaux esprits pour chaque ceinture (🐣🐥🐯🐢🐬🦅🐉)
    - Messages d'encouragement ludiques
    - Barre de progression vers le prochain grade
    - Badge avec points actuels
    - Étoiles scintillantes décoratives
  - **Section "Les 7 Vertus Magiques"** adaptée aux enfants ✅ (NEW) :
    - 7 cartes colorées avec gradients (jaune, orange, vert, violet, rose, cyan, teal)
    - Animaux associés à chaque vertu (Lion, Tigre, Tortue, Lapin, Panda, Hibou, Aigle)
    - Kanji japonais pour chaque vertu
    - Messages d'encouragement pour enfants
    - Barres de progression par vertu
    - Section "Mes Points Ninja" avec badge central
    - Section "Mes Trophées" avec état vide encourageant

- **SYSTÈME DE GAMIFICATION COMPLET DES 7 VERTUS** ✅ (NEW)
  - Créé `constants/virtuesGamification.js` avec :
    - 7 vertus avec 5 niveaux de progression chacune (Apprenti → Maître)
    - Animaux gardiens qui évoluent avec les niveaux (ex: 🐱→🦁→👑🦁)
    - Défis quotidiens et hebdomadaires par vertu
    - Badges spéciaux à débloquer
    - Trophées globaux (10 trophées légendaires)
    - Titres spéciaux basés sur le total XP
  - Créé `VirtuesGamification.jsx` :
    - Affichage du titre spécial ("Petit Ninja", "Super Ninja", etc.)
    - Stats rapides (XP Total, Badges, Défis, Streak)
    - Grille interactive des 7 vertus avec niveaux
    - Panel de détail avec défis et badges par vertu
    - Section Trophées Légendaires

### January 2026 - Session 4 (Current) ✅ NEW
- **REMPLACEMENT DE TEXTE** ✅
  - "Pratiquées" → "Techniques enseignées au Dojo" dans :
    - `UserDashboardBlocks.jsx`
    - `GuidedTour.jsx`

- **RÉORGANISATION DU DASHBOARD UTILISATEUR CONNECTÉ** ✅ (MAJOR FIX)
  - **Problème résolu** : Les utilisateurs connectés voyaient à la fois les nouveaux composants interactifs ET les anciens accordéons, créant une duplication confuse.
  - **Solution implémentée** : Masquage de l'accordéon "Ma Progression Ninja" uniquement (les stats sont dans UserDashboardBlocks)
  - **Nouveau comportement** :
    | Composant | Visiteur | Utilisateur connecté |
    |-----------|----------|---------------------|
    | Hero Banner | ✅ | ❌ |
    | Blocs Navigation (5 étapes) | ❌ | ✅ |
    | UserDashboardBlocks | ❌ | ✅ |
    | ProgressionTunnel | ❌ | ✅ |
    | Accordéon "Ma Progression Ninja" | ✅ | ❌ |
    | Accordéon "Entrainement" | ✅ | ✅ |
    | Accordéon "Les Super-Pouvoirs Ninja" | ✅ | ✅ |
    | Accordéon "Histoire de l'Aikido" | ✅ | ✅ |

- **BLOCS CARRÉS DE NAVIGATION** ✅ (NEW)
  - Créé `AppStepsNavigation.jsx` - Navigation visuelle en haut de page pour utilisateurs connectés uniquement
  - 5 blocs carrés colorés représentant les étapes de l'application :
    1. 🥷 **Mon Profil** (vert) - Ceinture & Stats
    2. 🎯 **Défis du Jour** (rose) - 5 défis quotidiens
    3. 🥋 **Techniques** (cyan) - Par grade KYU
    4. ☯️ **Les Vertus** (violet) - 7 super-pouvoirs
    5. 📜 **Histoire** (orange) - Hakama & O Sensei
  - Fonctionnalités :
    - Numérotation des étapes (1-5)
    - Effet hover avec scale et translate
    - Clic pour scroll automatique vers la section
    - Barre de progression arc-en-ciel
    - Message d'aide contextuel

- **ÉCRAN DE SÉLECTION MODE ENFANT/ADULTE** ✅ (NEW - 100% RGPD)
  - Créé `AgeSelector.jsx` - Écran de choix du mode d'affichage
  - 2 gros boutons visuellement distincts :
    - 🧒 **"Je suis un Jeune Ninja"** (- 14 ans) - Gradient rose/violet avec étoiles animées
    - 🧑 **"Je suis un Ninja Confirmé"** (+ 14 ans) - Gradient sombre avec bordure dorée
  - Stockage en **localStorage** (aucune donnée personnelle envoyée au serveur)
  - Note RGPD visible en bas de l'écran
  - Bouton ⚙️ pour changer de mode à tout moment

- **BLOCS VISITEUR ADAPTÉS AU MODE** ✅ (NEW)
  - Créé `VisitorStepsBlocks.jsx` - 6 blocs présentant les étapes du jeu
  - **Version ENFANT** (ludique, coloré) :
    1. 🥷 Deviens un Ninja ! (vert)
    2. 🎮 Joue chaque jour (rose)
    3. ⭐ Gagne des étoiles (orange)
    4. 🦸 Super-pouvoirs (violet)
    5. 🏆 Débloque des badges (cyan)
    6. 🐉 Objectif Dragon ! (rouge)
  - **Version ADULTE** (sobre, professionnel) :
    1. 📝 Inscription
    2. 🥋 Programme
    3. 📊 Progression
    4. ☯️ Les 7 Vertus
    5. 🎯 Objectifs
    6. 📜 Certifications
  - Messages et boutons adaptés au mode (tutoiement/vouvoiement)

---

## Prioritized Backlog

### P0 - Critical
- (Completed) Message d'accueil avec prénom ✅
- (Completed) Réorganisation des 5 blocs ✅
- (Completed) Conversion en accordéons ✅

### P1 - High Priority
- [x] Extraire "Histoire de l'Aikido" dans `HakamaHistory.jsx` ✅ (DONE)
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
- `/app/frontend/src/components/StatisticsDashboard.js` - Dashboard principal (refactorisé, 1345 lignes)
- `/app/frontend/src/components/SimpleAccordion.jsx` - Composant accordéon réutilisable
- `/app/frontend/src/components/BeltProgressCard.jsx` - Section Mon Parcours ludique (enfants)
- `/app/frontend/src/components/GradeCardsGrid.jsx` - Grille des grades
- `/app/frontend/src/components/DeplacementsSection.jsx` - Section déplacements
- `/app/frontend/src/components/VirtuesSection.jsx` - Section 7 Vertus ludique (enfants) ✅
- `/app/frontend/src/components/VirtuesGamification.jsx` - Système gamification complet ✅
- `/app/frontend/src/components/HakamaHistory.jsx` - Section Histoire de l'Aikido (7 plis du Hakama) ✅
- `/app/frontend/src/components/AppStepsNavigation.jsx` - Blocs carrés de navigation (utilisateurs connectés) ✅ NEW
- `/app/frontend/src/constants/aikidoBelts.js` - Définitions ceintures avec animaux
- `/app/frontend/src/constants/virtuesGamification.js` - Données gamification vertus ✅
- `/app/frontend/src/App.js` - Composant principal
- `/app/backend/server.py` - API backend
