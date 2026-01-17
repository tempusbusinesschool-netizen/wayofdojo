# Aikido@Game - Product Requirements Document

## Changelog
- **2026-01-17 (Session 6)**:
  - ✅ **REFACTORING PARCOURS UTILISATEUR - 6 ÉTAPES**
    - Extraction de "Entraînement Dojo" (Carnet) vers une étape dédiée
    - Nouveau composant `DojoLogbookDialog.jsx`
    - Parcours maintenant à 6 étapes :
      1. Mon Profil 🎭
      2. Mes Techniques 📚
      3. Dojo Virtuel 🎮 (Jeux numériques + Validations uniquement)
      4. **Ma Pratique 🥋** (Mon Carnet de pratique)
      5. Ma Progression 🌟
      6. Mes Trophées 🏆
  - ✅ **VirtualDojo simplifié** - Seulement 2 onglets :
    - "Jeux numériques" (10 mini-jeux)
    - "Validations" (statut des validations parentales)
  - ✅ **Maître Tanaka parle !** - Audio automatique à l'ouverture de chaque étape :
    - DojoLogbookDialog → `step_4_carnet`
    - VirtualDojo → `step_3_dojo`
    - TechniquesByKyuCards → `step_2_techniques`
    - ProgressionDialog → `step_5_progress`
    - JourneyPath dialogs → audio selon l'étape
  - ✅ **Arrêt audio à la fermeture** - Fermeture de fenêtre = arrêt immédiat de la voix
  - ✅ **Contrôles audio** - Boutons Rejouer + Mute dans chaque dialog

- **2026-01-17 (Session 5)**:
  - ✅ **DÉPLACEMENT "DÉFIS DU JOUR"** → Étape 3 "Mon Entraînement"
  - ✅ **ESPACE PARENT** → Fenêtre flottante via bouton header
  - ✅ **RENOMMAGE "Connexion Parent" → "Espace Parent"**
  - ✅ **MESSAGE TANAKA CORRIGÉ** - Supprimé "ton sensei pourra valider"
  - ✅ **"MON CARNET DE DOJO"** - Refonte complète avec 8 exercices
  - ✅ **RÉORGANISATION "PROGRAMME TECHNIQUE"** → Étape 2 "Mes Techniques"
    - Onglets : "Ma Progression" + "Fiches Techniques"
  - ✅ **RÉORGANISATION "SUPER-POUVOIRS NINJA"** → Étape 4 "Ma Progression"
    - Onglets : "Ma Ceinture" + "Mes Qualités"
  - ✅ **SUPPRESSION SECTIONS DASHBOARD** :
    - "Continue comme ça Bill !"
    - "Apprendre l'Aikido"
    - Accordéon "Entrainement"
    - Accordéon "Super-Pouvoirs Ninja"
  - ✅ **FUSION ÉTAPE 4 "VALIDE" → ÉTAPE 3 "MON ENTRAÎNEMENT"**
    - Parcours réduit de 6 à 5 étapes
    - Nouveaux noms d'étapes :
      1. Mon Profil 🎭
      2. Mes Techniques 📚
      3. Mon Entraînement 💪 (inclut Jeux + Carnet + Validations)
      4. Ma Progression 🌟
      5. Mes Trophées 🏆
    - Nouvel onglet "✅ Validations" dans VirtualDojo

- **2026-01-17 (Session 4)**:
  - ✅ **BASE DE DONNÉES TECHNIQUES COMPLÈTE - Structure en 3 Phases**
    - Phase 1 (Entrée) : 16 Attaques/Saisies + 3 Déplacements
    - Phase 2 (Technique) : 14 Techniques avec Omote/Ura
    - Phase 3 (Final) : 9 Immobilisations (Osae) + 7 Chutes (Ukemi)
    - 96 combinaisons valides selon le programme traditionnel
  - ✅ **DIMENSION PHILOSOPHIQUE - Enseignements de Maître Tanaka**
    - Métaphore de l'eau guidée (enfants) vs Principes du Budō (adultes)
    - Paroles de sagesse pour chaque phase, technique et déplacement
    - Intégration dans les animations de techniques
  - ✅ **NOUVELLE PAGE "PHILOSOPHIE"**
    - Section dédiée avec introduction Maître Tanaka
    - Les 3 Phases du Mouvement
    - Les Entrées (Irimi, Tenkan, Irimi-Tenkan)
    - Les Techniques (Immobilisations et Projections)
    - Bouton d'accès "La Sagesse de Maître Tanaka" dans le parcours
  - ✅ **BOUTON "PHILOSOPHIE ET HISTOIRE" - Étape 2 Apprends**
    - Nouveau bouton en haut à droite de la fenêtre techniques
    - Intègre Histoire de l'Aikido + Hakama & O Sensei
    - Réutilisation du contenu existant (HakamaHistory)
  - ✅ **ACCORDÉON "HISTOIRE DE L'AIKIDO" MASQUÉ**
    - Section masquée de l'affichage principal (StatisticsDashboard)
    - Contenu accessible via "Philosophie et histoire" uniquement
  - ✅ **MAÎTRE TANAKA - NOUVEAU DESIGN CERCLE ORANGE**
    - Bouton flottant agrandi (w-20 h-20)
    - Image de Tanaka centrée dans le cercle orange
    - Effet de brillance et animation pulse
  - ✅ **ESPACE PARENT - ACCÈS CONDITIONNEL**
    - Bouton "Espace Parent" visible UNIQUEMENT si Enfant connecté
    - Badge "Parent" dans le header quand parent authentifié
    - Écran "Rattachement requis" si parent sans enfant lié

- **2026-01-17 (Session 3)**:
  - ✅ **AMÉLIORATION PÉDAGOGIQUE MAJEURE - Dojo Virtuel / Jeux numériques**
    - Nouveau message d'accueil pédagogique complet, rassurant, adapté aux enfants 6-14 ans
    - Ton chaleureux et encourageant avec phrases courtes
    - Explication claire de la validation parentale pour les jeux numériques
  - ✅ **Règles de validation strictes implémentées** :
    - Jeux numériques → Validation exclusive par les **PARENTS**
    - Exercices au dojo → **AUTO-VALIDATION** par l'enfant uniquement
    - Le sensei n'intervient PAS dans la validation numérique
  - ✅ **Tests automatisés passés à 100%** (iteration_7.json)

- **2026-01-16 (Session 2)**: 
  - ✅ Fixed infinite loop bug in Parent Dashboard
  - ✅ Implemented technique mastery level selector
  - ✅ Full TTS integration in all 10 VirtualDojo mini-games

## Nom de l'application
**Aikido@Game** - Ne jamais traduire ce nom

## Entreprise
**HUMAN KNOWLEDGE**

## Vision du produit
Application web gamifiée pour le club d'Aikido permettant aux pratiquants de suivre leur progression de manière ludique.

---

## Architecture des fichiers clés

### Constants (Techniques et Philosophie)
- `/app/frontend/src/constants/aikidoMovements.js` - Structure des 3 phases
- `/app/frontend/src/constants/aikidoCombinaisons.js` - 96 combinaisons valides
- `/app/frontend/src/constants/aikidoPhilosophie.js` - Enseignements Maître Tanaka
- `/app/frontend/src/constants/techniquesByKyu.js` - Techniques par niveau de Kyu

### Pages principales
- `/app/frontend/src/pages/PhilosophiePage.jsx` - Section Philosophie dédiée
- `/app/frontend/src/pages/enfant/*` - Pages zone enfants
- `/app/frontend/src/pages/adulte/*` - Pages zone adultes

### Composants clés modifiés
- `/app/frontend/src/components/TechniquesByKyuCards.jsx` - Bouton "Philosophie et histoire"
- `/app/frontend/src/components/animations/TechniqueAnimationPhilosophie.jsx` - Animation avec philosophie
- `/app/frontend/src/components/StatisticsDashboard.js` - Gestion navigation parcours 6 étapes
- `/app/frontend/src/components/MaitreTanaka.jsx` - Design cercle orange
- `/app/frontend/src/components/JourneyPath.jsx` - Parcours 6 étapes avec "Entraînement au Dojo"
- `/app/frontend/src/components/DojoLogbookDialog.jsx` - **NOUVEAU** Carnet de pratique au dojo
- `/app/frontend/src/components/VirtualDojo/index.jsx` - Dojo Virtuel (Jeux + Validations)
- `/app/frontend/src/components/ParentDashboard.jsx` - Écran rattachement amélioré
- `/app/frontend/src/App.js` - Bouton Espace Parent conditionnel

---

## Règles métier strictes

### Rôles et accès
| Rôle | Accès |
|:-----|:------|
| Enfant | Parcours gamifié, techniques, philosophie |
| Parent | Espace Parent (rattaché à un enfant uniquement) |
| Enseignant | Suivi des élèves |
| Admin | Gestion plateforme |

### Bouton "Espace Parent"
- Visible **UNIQUEMENT** si un Enfant est connecté
- Clic → Connexion parent ou Espace Parent selon état
- Parent sans enfant → Écran "Rattachement requis"

### Validation des techniques
- **Jeux numériques** → Validation par PARENTS uniquement
- **Exercices au dojo** → AUTO-VALIDATION par l'enfant

---

## Prochaines tâches (Backlog)

### P2 - Priorité moyenne
- [ ] Différencier le ton/UX de la "Zone Adultes" (plus professionnel)
- [ ] Simplifier `StatisticsDashboard.js` en composants plus petits
- [ ] Ajouter section configuration clés API Stripe/Resend

### P3 - Priorité basse
- [ ] Améliorer l'UX du `ParentDashboard.jsx`
- [ ] Factoriser `TarificationPage.jsx`

### Future
- [ ] Créer blocs "Les différentes techniques" et "Défis collectifs"
- [ ] Implémenter 2FA pour Super Admin
- [ ] Animations de techniques avec phases visuelles

---

## Credentials de test
| Rôle | Email | Mot de passe |
|:-----|:------|:-------------|
| Enfant | bill@gmail.com | 123 |
| Parent | parent@gmail.com | parent123 |
