# Aikido@Game - Product Requirements Document

## Changelog
- **2026-01-17 (Session 5)**:
  - ✅ **DÉPLACEMENT "DÉFIS DU JOUR"**
    - Supprimé de `StatisticsDashboard.js` (dashboard principal)
    - Intégré dans `VirtualDojo/index.jsx` sous l'onglet "Exercices au Dojo Réel"
  - ✅ **ESPACE PARENT - FENÊTRE FLOTTANTE**
    - Supprimé la section "👨‍👩‍👧 Espace Parent" de `StatisticsDashboard.js`
    - Transformé `ParentDashboard` en Dialog flottant dans `App.js`
    - Point d'entrée unique : bouton "Espace Parent" dans le header
  - ✅ **RENOMMAGE "Connexion Parent" → "Espace Parent"** dans ParentLoginDialog.jsx
  - ✅ **BOUTONS HEADER TECHNIQUES CORRIGÉS** - Layout responsive avec flex-wrap
  - ✅ **MESSAGE TANAKA CORRIGÉ** - Supprimé "ton sensei pourra valider tes exercices"
    - Nouveau message audio régénéré via ElevenLabs
  - ✅ **"MON CARNET DE DOJO" - REFONTE COMPLÈTE**
    - Interface ludique avec cartes visuelles pour chaque exercice
    - Bouton **"Je l'ai fait au dojo !"** pour auto-validation par l'enfant
    - Progression du jour avec barre visuelle et Ki gagnés
    - 8 exercices : Salut, Échauffement, Ukemi, Déplacements, Technique partenaire, Écoute, Aide camarade, Rangement
  - ✅ **RÉORGANISATION "PROGRAMME TECHNIQUE" (Étape 2 - Apprends)**
    - Nouveaux onglets : "Ma Progression" / "Fiches Techniques"
    - `BeltProgressCard` + `DeplacementsSection` intégrés dans "Ma Progression"
    - Supprimé l'accordéon "Entrainement - Techniques d'Aikido" du dashboard
  - ✅ **RÉORGANISATION "SUPER-POUVOIRS NINJA" (Étape 5 - Progresse)**
    - Créé nouveau composant `ProgressionDialog.jsx`
    - Nouveaux onglets : "Ma Ceinture" / "Mes Qualités"
    - `VirtuesSection` (7 vertus du Budō) intégré dans onglet "Mes Qualités"
    - Supprimé l'accordéon "Les Super-Pouvoirs Ninja" du dashboard
    - Dashboard significativement simplifié

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
- `/app/frontend/src/components/StatisticsDashboard.js` - Accordéon Histoire masqué
- `/app/frontend/src/components/MaitreTanaka.jsx` - Design cercle orange
- `/app/frontend/src/components/JourneyPath.jsx` - Bouton "Sagesse de Maître Tanaka"
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
