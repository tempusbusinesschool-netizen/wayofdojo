# 📋 INVENTAIRE EXHAUSTIF DES CONTENUS - AIKIDO@GAME

**Date d'inventaire** : 24 Janvier 2025  
**Objectif** : Récupération totale sans perte avant réorganisation  
**Règle** : Aucune suppression, fusion ou modification sans validation explicite

---

## 📁 STRUCTURE DE L'ANCIENNE VERSION (/app/frontend/src)

### STATISTIQUES GLOBALES
- **Fichiers totaux** : 182 fichiers (.js, .jsx)
- **Composants** : 65 fichiers
- **Pages** : 14 fichiers
- **Constantes/Data** : 14 fichiers
- **Services** : 8 fichiers

---

## 🎯 CATÉGORIE 1 : DONNÉES DE JEU (GAMEPLAY)

### 1.1 Système des 7 Vertus (`virtuesGamification.js`)
**Statut** : ⚠️ PARTIELLEMENT MIGRÉ vers `wayofdojo/src/constants/virtuesGamification.ts`

| Vertu | Kanji | Emoji | Animal Gardien | 5 Évolutions | Défis quotidiens | Défis hebdo | Badges |
|-------|-------|-------|----------------|--------------|------------------|-------------|--------|
| Respect | 礼 | 🙏 | 🦁 Lion Noble | ✅ 5 niveaux | 5 défis | 3 défis | 4 badges |
| Courage | 勇 | 💪 | 🐯 Tigre Brave | ✅ 5 niveaux | 5 défis | 3 défis | 4 badges |
| Maîtrise | 克 | 🧘 | 🐢 Tortue Zen | ✅ 5 niveaux | 5 défis | 3 défis | 4 badges |
| Humilité | 謙 | 🌱 | 🐰 Lapin Humble | ✅ 5 niveaux | 5 défis | 3 défis | 4 badges |
| Bienveillance | 仁 | 💝 | 🐼 Panda Gentil | ✅ 5 niveaux | 5 défis | 3 défis | 4 badges |
| Attention | 注 | 👁️ | 🦉 Hibou Vigilant | ✅ 5 niveaux | 5 défis | 3 défis | 4 badges |
| Responsabilité | 責 | ⚖️ | 🦅 Aigle Royal | ✅ 5 niveaux | 5 défis | 3 défis | 4 badges |

**Contenu détaillé par vertu** :
- Messages d'encouragement par niveau (5 par vertu = 35 messages)
- XP requis par niveau : 0, 50, 150, 300, 500
- Badges : Apprenti 🥉, Initié 🥈, Confirmé 🥇, Expert 🏆, Maître 👑

### 1.2 Système des Ceintures (`aikidoBelts.js`)
**Statut** : ✅ MIGRÉ vers `wayofdojo/src/constants/aikidoBelts.ts`

| Grade | Ceinture | Couleur | Emoji | Points | Animal | Vertu associée |
|-------|----------|---------|-------|--------|--------|----------------|
| 6e Kyu | Blanche | #E5E7EB | ⚪ | 0 | 🪲 Petit Scarabée | Humilité |
| 5e Kyu | Jaune | #FCD34D | 🟡 | 10 | 🪲 Scarabée Doré | Respect |
| 4e Kyu | Orange | #FB923C | 🟠 | 20 | 🐯 Tigre Flamboyant | Courage |
| 3e Kyu | Verte | #22C55E | 🟢 | 30 | 🐢 Tortue Sage | Bienveillance |
| 2e Kyu | Bleue | #3B82F6 | 🔵 | 40 | 🐬 Dauphin Serein | Sincérité |
| 1er Kyu | Marron | #92400E | 🟤 | 50 | 🦅 Aigle Royal | Honneur |
| Shodan | Noire | #1F2937 | ⚫ | 100 | 🐉 Dragon Légendaire | Loyauté |

**Messages par ceinture** (14 messages : message + funMessage par grade)

### 1.3 Techniques d'Aïkido (`aikidoTechniquesData.js`)
**Statut** : ⚠️ PARTIELLEMENT MIGRÉ

**TOTAL : 214+ techniques réparties en :**

#### Armes - JO (Bâton) : 46 techniques
- Jo Suburi - Tsuki (Piques) : 5 techniques
- Jo Suburi - Uchi (Frappes) : 5 techniques
- Jo Suburi - Combinés : 10 techniques
- Kumijo (avec partenaire) : 26 techniques

#### Armes - BOKKEN (Sabre en bois) : 30+ techniques
- Suburi de base : 7 techniques
- Kumitachi (avec partenaire) : 23+ techniques

#### Armes - TANTO (Couteau) : 15+ techniques

#### Techniques à mains nues : 100+ techniques
- Immobilisations (Osae Waza) : Ikkyo, Nikyo, Sankyo, Yonkyo, Gokyo
- Projections (Nage Waza) : Shiho Nage, Irimi Nage, Kote Gaeshi, etc.
- Techniques avancées

### 1.4 Passages de Grades (`passagesGrades.js`)
**Statut** : ❌ NON MIGRÉ

**Contenu par grade (6e Kyu au 4e Dan)** :
- Durée minimale de pratique
- Heures minimales requises
- Objectifs pédagogiques
- Mouvements requis (Ukemi, Tai Sabaki, Kamae)
- Techniques requises par attaque
- Emplacements vidéos de démonstration

### 1.5 Déplacements (`deplacementsData.js`)
**Statut** : ⚠️ À VÉRIFIER

### 1.6 Mouvements (`aikidoMovements.js`)
**Statut** : ⚠️ À VÉRIFIER

### 1.7 Combinaisons (`aikidoCombinaisons.js`)
**Statut** : ❌ NON MIGRÉ
- 81 081 octets de données
- Combinaisons de techniques enchaînées

### 1.8 Niveaux de maîtrise (`masteryLevels.js`)
**Statut** : ❌ NON MIGRÉ

---

## 🎤 CATÉGORIE 2 : NARRATION (Maître Tanaka)

### 2.1 Phrases pré-enregistrées (`tanakaVoiceService.js`)
**Statut** : ⚠️ PARTIELLEMENT MIGRÉ vers `wayofdojo/src/services/tanakaVoiceService.ts`

| Catégorie | Nombre | Clés |
|-----------|--------|------|
| Bienvenue/Salutations | 4 | welcome, hello_morning, hello_afternoon, goodbye |
| Défis complétés | 3 | challenge_complete, challenge_first, challenge_hard |
| Nouvelles ceintures | 7 | belt_white, belt_yellow, belt_orange, belt_green, belt_blue, belt_brown, belt_black |
| Séries (Streaks) | 4 | streak_3, streak_7, streak_14, streak_21 |
| Encouragements | 3 | encourage_practice, encourage_patience, encourage_comeback |
| XP/Niveaux | 2 | xp_gained, level_up |
| Technique maîtrisée | 1 | technique_mastered |
| Échecs | 1 | fail_encourage |
| Badges | 1 | badge_earned |
| **Étapes du parcours** | 5 | step_2_techniques, step_3_dojo, step_4_carnet, step_5_progress, step_6_mastery |

**TOTAL : 31 phrases avec texte complet**

### 2.2 Philosophie Aïkido (`aikidoPhilosophie.js`)
**Statut** : ❌ NON MIGRÉ

**Contenus** :
- **3 Phases philosophiques** : La Rencontre, La Transformation, La Responsabilité
  - Chacune avec version ENFANT (métaphore eau) et ADULTE (principes Budō)
  - Messages de Tanaka adaptés

- **Philosophie des déplacements** : Irimi, Tenkan, Irimi Tenkan
  - Essence, métaphores enfant/adulte, messages Tanaka

- **Philosophie des techniques** : Ikkyo, Nikyo, Sankyo, Yonkyo, etc.
  - Essence spirituelle de chaque technique

---

## 🎮 CATÉGORIE 3 : DOJO VIRTUEL (11 Jeux)

### 3.1 Liste des jeux (`VirtualDojo/games/`)
**Statut** : ❌ NON MIGRÉ

| # | Jeu | Sous-titre | Emoji | Compétences | XP | Ki | Niveau requis |
|---|-----|------------|-------|-------------|----|----|---------------|
| 1 | Le Messager du Ki | Gestion du stress | 🌊 | Calme, Patience, Anticipation | 20 | 15 | 0 |
| 2 | Parcours du Souffle | Respiration consciente | 💨 | Respiration, Concentration, Calme | 25 | 20 | 1 |
| 3 | Le Sensei Invisible | Écoute & attention | 👂 | Écoute, Attention, Confiance | 30 | 25 | 2 |
| 4 | Réflexe Pacifique | Intelligence émotionnelle | 🧠 | Gestion émotions, Réflexion, Non-violence | 35 | 30 | 3 |
| 5 | Gardien de l'Espace | Maîtrise du Ma-ai | 🎯 | Distance, Anticipation, Positionnement | 25 | 20 | 2 |
| 6 | Miroir d'Harmonie | Synchronisation | 🪞 | Observation, Coordination, Harmonie | - | - | - |
| 7 | Chemin d'Équilibre | Équilibre physique | ⚖️ | Équilibre, Centre, Stabilité | - | - | - |
| 8 | Memory Sensei | Mémoire visuelle | 🧩 | Mémoire, Concentration, Rapidité | - | - | - |
| 9 | Rythme du Dojo | Rythme et timing | 🥁 | Timing, Coordination, Écoute | - | - | - |
| 10 | Quête des Vertus | Connaissance Budo | ☯️ | Vertus, Sagesse, Connaissance | - | - | - |
| 11 | Placeholder Games | (Jeux en attente) | - | - | - | - | - |

**Règles de validation** :
- Jeux numériques → Parents valident
- Exercices au dojo → Auto-validation enfant (honnêteté)

---

## 👨‍👩‍👧 CATÉGORIE 4 : ESPACES UTILISATEURS

### 4.1 Pages ENFANT (`pages/enfant/`)
**Statut** : ❌ NON MIGRÉ

| Page | Fichier | Description |
|------|---------|-------------|
| Commence | CommencePage.jsx | Création profil Ninja, choix avatar |
| Apprends | ApprendsPage.jsx | Apprentissage des techniques |
| Entraîne | EntrainePage.jsx | Sessions d'entraînement |
| Valide | ValidePage.jsx | Validation des acquis |
| Progresse | ProgressePage.jsx | Suivi progression |
| Maîtrise | MaitrisePage.jsx | Niveau maîtrise atteint |

**Avatars disponibles** : Dragon 🐉, Tigre 🐯, Aigle 🦅, Panda 🐼, Renard 🦊, Loup 🐺

### 4.2 Pages ADULTE (`pages/adulte/`)
**Statut** : ❌ NON MIGRÉ

| Page | Fichier | Description |
|------|---------|-------------|
| Inscription | InscriptionPage.jsx | Inscription adulte |
| Programme | ProgrammePage.jsx | Programme d'entraînement |
| Progression | ProgressionPage.jsx | Suivi progression adulte |
| Vertus | VertusPage.jsx | Les 7 vertus du Budo |
| Objectifs | ObjectifsPage.jsx | Définition objectifs |
| Certifications | CertificationsPage.jsx | Grades et certifications |

### 4.3 Espace Parent (`ParentDashboard.jsx`)
**Statut** : ❌ NON MIGRÉ
- Validation des activités enfant
- Suivi progression
- Historique des jeux

### 4.4 Espace Enseignant (`EnseignantDashboard.jsx`)
**Statut** : ❌ NON MIGRÉ

### 4.5 Espace Admin (`AdminDashboard.jsx`)
**Statut** : ⚠️ PARTIELLEMENT MIGRÉ

---

## 🧭 CATÉGORIE 5 : PARCOURS GUIDÉ

### 5.1 Les 8 Blocs du Parcours Visiteur (`VisitorStepsBlocks.jsx`)
**Statut** : ⚠️ PARTIELLEMENT MIGRÉ (ordre incorrect)

| # | Bloc Original | Emoji | But | Destination |
|---|--------------|-------|-----|-------------|
| 1 | 👋 Bienvenue | 👋 | Introduction avec Maître Tanaka | Tableau de bord |
| 2 | 🥷 Mon Profil | 🥷 | Voir sa ceinture et stats | Section Profil |
| 3 | 🎯 Les Défis | 🎯 | Découvrir les défis quotidiens | Section Défis/Points |
| 4 | ☯️ Les 7 Vertus | ☯️ | Apprendre les valeurs du ninja | Section Vertus |
| 5 | 🥋 Les Techniques | 🥋 | Voir les mouvements d'Aïkido | Section Entraînement |
| 6 | 🎖️ Les Ceintures | 🎖️ | Comprendre la progression de grade | Dialogue Ceintures |
| 7 | 📜 L'Histoire | 📜 | Découvrir O'Sensei et l'Aïkido | Section Histoire |
| 8 | 🏆 Mes Trophées | 🏆 | Voir les badges à collectionner | Dialogue Trophées |

### 5.2 Parcours Utilisateur Connecté - 6 Étapes (`JourneyPath.jsx`)
**Statut** : ❌ NON MIGRÉ

| # | Étape | Emoji | Description | XP | Message Tanaka |
|---|-------|-------|-------------|----|-----------------| 
| 1 | Mon Profil | 🎭 | Crée ton Ninja | 10 | "Bienvenue dans mon dojo virtuel..." |
| 2 | Mes Techniques | 📚 | Apprends les mouvements | 15 | "Maintenant, passons aux techniques..." |
| 3 | Dojo Virtuel | 🎮 | Jeux & Validations | 20 | "Bienvenue dans le Dojo Virtuel..." |
| 4 | Ma Pratique | 🥋 | Mon Carnet de pratique | 20 | "Après ton cours au dojo..." |
| 5 | Ma Progression | 🌟 | Ceintures & Vertus | 25 | "Tu progresses vite..." |
| 6 | Mes Trophées | 🏆 | Deviens une Légende ! | 30 | "Félicitations, jeune ninja..." |

**Conditions de déverrouillage** : step_X_completed

---

## 📄 CATÉGORIE 6 : PAGES ANNEXES

### 6.1 Pages principales (`pages/`)
**Statut** : Variable

| Page | Fichier | Statut |
|------|---------|--------|
| Mode d'emploi | ModeEmploiPage.jsx | ❌ NON MIGRÉ |
| Tarification | TarificationPage.jsx | ❌ NON MIGRÉ |
| CGV Détaillées | CGVDetailedPage.jsx | ❌ NON MIGRÉ |
| Philosophie | PhilosophiePage.jsx | ❌ NON MIGRÉ |
| Combinaisons | CombinaisonsPage.jsx | ❌ NON MIGRÉ |
| Stages/Calendrier | StagesCalendar.jsx | ⚠️ PARTIELLEMENT |
| Galerie Illustrations | IllustrationsGallery.jsx | ❌ NON MIGRÉ |
| Section Vidéos | VideosSection.jsx | ❌ NON MIGRÉ |

---

## 🔧 CATÉGORIE 7 : COMPOSANTS UI

### 7.1 Composants principaux
**Statut** : Variable

| Composant | Fichier | Statut |
|-----------|---------|--------|
| MaitreTanaka | MaitreTanaka.jsx | ⚠️ MIGRÉ (simplifié) |
| UserDashboardBlocks | UserDashboardBlocks.jsx | ⚠️ MIGRÉ (simplifié) |
| StatisticsDashboard | StatisticsDashboard.js | ❌ NON MIGRÉ (88 561 octets) |
| JourneyPath | JourneyPath.jsx | ❌ NON MIGRÉ |
| VisitorStepsBlocks | VisitorStepsBlocks.jsx | ⚠️ PARTIELLEMENT |
| VirtuesGamification | VirtuesGamification.jsx | ❌ NON MIGRÉ |
| ProfileOnboarding | ProfileOnboarding.jsx | ❌ NON MIGRÉ |
| ProgressionTunnel | ProgressionTunnel.jsx | ❌ NON MIGRÉ |
| BeltProgressCard | BeltProgressCard.jsx | ❌ NON MIGRÉ |
| TechniquesByKyuCards | TechniquesByKyuCards.jsx | ⚠️ PARTIELLEMENT |
| DojoLogbookDialog | DojoLogbookDialog.jsx | ❌ NON MIGRÉ |
| GuidedTour | GuidedTour.jsx | ❌ NON MIGRÉ |

### 7.2 Animations
| Composant | Fichier | Statut |
|-----------|---------|--------|
| StepTransition | StepTransition.jsx | ✅ MIGRÉ |
| TechniqueCelebration | TechniqueCelebration.jsx | ✅ MIGRÉ |
| TanakaAnimatedLogo | TanakaAnimatedLogo.jsx | ✅ MIGRÉ |
| LoginTransition | LoginTransition.jsx | ❌ NON MIGRÉ |

### 7.3 Dialogues/Modals
| Composant | Fichier | Statut |
|-----------|---------|--------|
| AuthDialog | AuthDialog.js | ⚠️ REMPLACÉ |
| PaywallDialog | PaywallDialog.js | ❌ NON MIGRÉ |
| WelcomeDialog | WelcomeDialog.jsx | ❌ NON MIGRÉ |
| ProgressionDialog | ProgressionDialog.jsx | ❌ NON MIGRÉ |
| CGUDialog | CGUDialog.js | ❌ NON MIGRÉ |
| MentionsLegalesDialog | MentionsLegalesDialog.js | ❌ NON MIGRÉ |

---

## 📊 TABLEAU RÉCAPITULATIF

| Catégorie | Total éléments | Migrés ✅ | Partiels ⚠️ | Non migrés ❌ |
|-----------|---------------|-----------|-------------|---------------|
| Données de jeu | 14 fichiers | 1 | 3 | 10 |
| Narration Tanaka | 31 phrases | 15 | 10 | 6 |
| Dojo Virtuel | 11 jeux | 0 | 0 | 11 |
| Pages Enfant | 6 pages | 0 | 0 | 6 |
| Pages Adulte | 6 pages | 0 | 0 | 6 |
| Parcours guidé | 2 systèmes | 0 | 1 | 1 |
| Pages annexes | 8 pages | 0 | 1 | 7 |
| Composants UI | 25+ comp. | 3 | 5 | 17+ |

---

## ✅ RÈGLE DE CONSERVATION

> **Tout contenu listé ci-dessus DOIT être conservé.**
> **Toute suppression nécessite une validation EXPLICITE.**
> **En cas de doute, le contenu est conservé par défaut.**

---

## 📍 PROCHAINE ÉTAPE

Création du **tableau de correspondance** :
`Ancien emplacement → Nouveau bloc → Statut (conservé à l'identique)`

**En attente de validation avant implémentation.**
