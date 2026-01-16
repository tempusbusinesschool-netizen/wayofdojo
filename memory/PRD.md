# Aikido@Game - Product Requirements Document

## Changelog
- **2026-01-16**: Fixed infinite loop bug in Parent Dashboard (`ParentDashboard.jsx`) - Used `useRef` for stable token reference and added guards to prevent multiple API calls

## Nom de l'application
**Aikido@Game** - Ne jamais traduire ce nom

## Entreprise
**HUMAN KNOWLEDGE**

## Vision du produit
Application web gamifiée pour le club d'Aikido permettant aux pratiquants de suivre leur progression de manière ludique.

---

## Dernière mise à jour : 16 janvier 2025

### Travaux effectués cette session :
1. ✅ **Enrichissement des fiches pédagogiques des techniques d'armes** (Tanto, Jo, Bokken)
   - Tanto Dori : Description complète avec 7 points clés et 6 conseils de pratique
   - Jo Waza : Jo Dori et Jo Nage avec katas de référence
   - Tachi Dori (Bokken) : Désarmement contre sabre avec timing critique
   - Kumitachi & Kumijo : Exercices codifiés avec 7 formes de Saito Sensei
   - Fondements Aïkiken : Principes universels et tenue du bokken (prise Tamago)

2. ✅ **Documentation de l'accès au Dojo Virtuel**
   - Étape 3 "Entraîne-toi" du Parcours Guidé
   - Requiert : Étape 1 (profil) + Étape 2 (techniques) complétées

3. ✅ **Modification de la période d'essai de 30 à 7 jours**
   - Mise à jour frontend : TarificationPage, ModeEmploiPage, AgeSelector, VisitorStepsBlocks
   - Mise à jour backend : trial_days passé de 90/10 jours à 7 jours pour tous les plans
   - Cohérence complète sur toute la plateforme

4. ✅ **Vérification de l'espace Parent**
   - Le Dashboard Parent fonctionne correctement
   - Login parent@gmail.com / parent123 OK
   - Affichage des enfants liés et messages/observations OK

5. ✅ **Mise à jour CGV et badges de récompense**
   - CGV : Délais modifiés de 30 à 7 jours (réclamation, notification, force majeure, résiliation club)
   - Badge "Marathonien" : Modifié de 30 à 14 jours d'affilée (adapté à la temporalité Aïkido)
   - Streak badges : 3 jours → 7 jours → 14 jours → 21 jours (progression réaliste)
   - TTS Tanaka : Références streak_30 remplacées par streak_14/streak_21

6. ✅ **Système de badges long terme adapté à l'Aïkido**
   - **Badges de durée** : 1 mois → 3 mois → 6 mois → 1 an → 2 ans → 5 ans
   - **Badges de grades Kyu** : 6e→5e→4e→3e→2e→1er Kyu (ceintures colorées)
   - **Badges de grades Dan** : Shodan → Nidan → Sandan → Yondan
   - **Badges techniques** : 5 → 10 → 25 → 50 → 100 techniques validées
   - **Badges présence dojo** : 10 → 50 → 100 → 200 → 500 séances
   - **Badges spéciaux Aïkido** : Ukemi, Tanto, Jo, Bokken maîtrisés
   - **Système de raretés** : Common, Rare, Epic, Legendary, Mythic
   - **Filtrage par catégorie** : Grades, Ancienneté, Techniques, Régularité, Spéciaux

7. ✅ **10 Mini-jeux du Dojo Virtuel développés**
   - 🌊 **Messager du Ki** : Gestion du stress et équilibre (clavier)
   - 🌬️ **Parcours du Souffle** : Respiration et calme intérieur
   - 👁️ **Sensei Invisible** : Réflexes et anticipation
   - ☯️ **Réflexe Pacifique** : Contrôle et non-violence
   - 🎯 **Gardien de l'Espace** : Ma-ai (distance parfaite)
   - 🪞 **Miroir d'Harmonie** : Imitation et synchronisation
   - ⚖️ **Chemin de l'Équilibre** : Posture et Hara
   - 🎴 **Memory du Sensei** : Vocabulaire japonais techniques
   - 🥁 **Rythme du Dojo** : Timing et tempo (jeu de rythme)
   - 🛡️ **Quête des 7 Vertus** : Éthique et valeurs du Budo

8. ✅ **Interface Enseignant améliorée**
   - Tableau de bord avec statistiques (élèves, actifs, validations)
   - Liste des élèves avec recherche et filtres par niveau
   - Détails par élève (XP, parties jouées, badges)
   - Validation des techniques en attente
   - Envoi de messages d'encouragement (rapides ou personnalisés)
   - Paramètres de configuration des jeux

9. ✅ **Intégration TTS Maître Tanaka dans les jeux**
   - Hook `useTanakaVoice` intégré dans tous les mini-jeux
   - Messages d'encouragement au début, pendant et fin de partie
   - Feedback vocal adapté aux performances

---

## Architecture des écrans (Mise à jour 16 janvier 2025)

### Page d'accueil - Visiteur NON connecté
- **8 blocs de présentation** avec APERÇU DU VRAI CONTENU ✅ NOUVEAU
- Deux thèmes visuels distincts :
  - **"Jeune Ninja"** : Blocs colorés avec emojis et vraies données (techniques, défis avec XP, vertus avec animaux)
  - **"Ninja Confirmé"** : Blocs sobres avec kanji et données professionnelles (programme FFAAA, grades)
- **Modal d'aperçu** au clic sur chaque bloc montrant le contenu réel
- Gamification DÉSACTIVÉE (incite à s'inscrire)

### Page d'accueil - Utilisateur CONNECTÉ
- **6 blocs numérotés (1→6)** avec GROS numéros + Tanaka animé
- **Animation de transition sphère** entre chaque étape complétée ✅

### Maîtrise de technique
- **Animation de célébration avec confettis et son** quand on maîtrise une technique ✅

---

## Fonctionnalités de Gamification Implémentées

### 1. Blocs visiteurs avec aperçu du vrai contenu ✅ NOUVEAU (16 jan 2025)
- **Mode enfant** : 8 blocs colorés avec vraies données (Ikkyo, Shiho Nage, défis XP, vertus avec animaux 🦁🐯🐢...)
- **Mode adulte** : 8 blocs sobres avec kanji (人技段徳...) et données FFAAA
- **Modal d'aperçu** : Clic sur bloc → aperçu détaillé du contenu → CTA inscription
- **Responsive** : Grille 4 colonnes desktop, 2 colonnes mobile

### 2. Animation de transition sphère (étapes du parcours)
- Sphère turquoise avec emoji et numéro d'étape
- Cercles concentriques animés en arrière-plan
- Message "Bravo [Prénom] ! Étape suivante..."
- 6 points de progression

### 3. Animation de célébration (maîtrise technique) ✅
- **Confettis multicolores** (explosion centrale + tirs latéraux + pluie d'étoiles)
- **Son de victoire** (séquence de notes Do-Mi-Sol-Do aigu)
- **Trophée animé** 🏆 qui rebondit
- Titre doré "TECHNIQUE MAÎTRISÉE !"
- 5 étoiles ⭐ décoratives
- Cercles de lumière en arrière-plan
- Bouton "Continuer 🚀"

---

## Données réelles affichées aux visiteurs

### Techniques (aperçu)
- Ikkyo (6e Kyu), Shiho Nage (5e Kyu), Irimi Nage (4e Kyu), Kote Gaeshi (3e Kyu)...
- Total : 206+ techniques

### Défis quotidiens (aperçu)
- Salut Parfait (+10 XP), Gardien du Tatami (+15 XP), Première Chute (+20 XP)...

### 7 Vertus avec animaux gardiens
- Respect 🙏 → 🦁 Lion Noble
- Courage 💪 → 🐯 Tigre Brave
- Maîtrise 🧘 → 🐢 Tortue Sage
- Humilité 🌱 → 🐘 Éléphant Sage
- Bienveillance 💝 → 🐼 Panda Doux
- Attention 👁️ → 🦉 Hibou Vigilant
- Responsabilité ⚖️ → 🦅 Aigle Fier

### Système de ceintures
- ⚪ Blanche (6e Kyu) → 🟡 Jaune (5e Kyu) → 🟠 Orange (4e Kyu) → 🟢 Verte (3e Kyu) → 🔵 Bleue (2e Kyu) → 🟤 Marron (1er Kyu) → ⚫ Noire (Shodan)

---

## Stack technique
- **Frontend** : React + TailwindCSS + Shadcn/UI + Framer Motion + canvas-confetti + react-confetti
- **Backend** : FastAPI (Python)
- **Base de données** : MongoDB
- **Intégrations** : Stripe, ElevenLabs (TTS), Resend (emails)

---

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Enfant | bill@gmail.com | 123 |
| Parent | parent@gmail.com | parent123 |
| Adulte | adulte@gmail.com | 123 |
| Super Admin | admin@gmail.com | 123 |

---

## Changelog récent

### 16 janvier 2025 (Session 3) - DOJO VIRTUEL 🏯
- ✅ **Étape 3 "Entraîne-toi" - Dojo Virtuel avec 10 mini-jeux**
  - Architecture complète avec 2 espaces : Jeux Numériques + Exercices Dojo Réel
  - **10 mini-jeux éducatifs** pour enfants 5-14 ans :
    1. 🌊 Le Messager du Ki - Gestion du stress (SVG Canvas)
    2. 💨 Parcours du Souffle - Respiration consciente
    3. 👂 Le Sensei Invisible - Écoute audio-guidée
    4. 🧠 Réflexe Pacifique - Intelligence émotionnelle (8 scénarios)
    5. 🎯 Gardien de l'Espace - Maîtrise du Ma-ai (à venir)
    6. 🪞 Miroir d'Harmonie - Synchronisation (à venir)
    7. ⚖️ Chemin de l'Équilibre - Posture & centre (à venir)
    8. 🎴 Memory du Sensei - Mémoire visuelle (à venir)
    9. 🥁 Rythme du Dojo - Tempo & fluidité (à venir)
    10. 🛡️ Quête des 7 Vertus - Valeurs du Budo (à venir)
  - **Maître Tanaka** comme coach virtuel intégré
  - Système de **Points de Ki** et progression par niveaux
  - **Interface Enseignant** pour valider les exercices au dojo réel
  - 8 exercices dojo réel validables par l'enseignant

### 16 janvier 2025 (Session 2)
- ✅ **Étape 2 "Apprends" - TechniquesByKyuCards** 
  - Fiches techniques complètes par niveau de ceinture (5e KYU → GODAN)
  - Données chargées depuis l'API `/api/kyu-levels` (description, key_points, practice_tips)
  - **Maître Tanaka animé** avec messages personnalisés selon la progression
  - **Progression séquentielle** : techniques débloquées une par une
  - 10 onglets de Kyu avec barres de progression
  - Détail technique avec : description, points clés, conseils de pratique
  - Bouton "Marquer comme maîtrisé !" avec sauvegarde dans localStorage
  - Accessibilité : DialogTitle/DialogDescription pour lecteurs d'écran

### 16 janvier 2025 (Session 1)
- ✅ **Blocs visiteurs avec aperçu du VRAI contenu** 
  - Mode enfant : vraies techniques, défis avec XP, vertus avec animaux
  - Mode adulte : programme FFAAA, kanji, données professionnelles
  - Modal d'aperçu au clic sur chaque bloc
  - Design responsive (4 cols desktop, 2 cols mobile)

- ✅ **Étape 1 "Commence" - Formulaire d'onboarding ProfileOnboarding.jsx**
  - Formulaire en 3 étapes : Avatar → Animal gardien → Objectif
  - Maître Tanaka animé avec dialogue contextuel
  - Confettis à la validation du profil
  - Endpoint backend `/api/auth/profile` (GET/PUT)

### 14 janvier 2025
- ✅ Animation de célébration avec confettis pour la maîtrise de techniques
- ✅ Animation de transition sphère intégrée entre les étapes du parcours
- ✅ Restructuration écrans : 8 blocs visiteurs / 6 blocs connectés

---

## Fichiers clés

| Fichier | Description |
|---------|-------------|
| `VirtualDojo/index.jsx` | **NOUVEAU** - Dojo Virtuel principal avec 10 mini-jeux |
| `VirtualDojo/games/*.jsx` | **NOUVEAU** - 4 jeux implémentés + 6 placeholders |
| `VirtualDojo/TeacherValidationInterface.jsx` | **NOUVEAU** - Interface validation enseignant |
| `TechniquesByKyuCards.jsx` | Fiches techniques par Kyu avec Tanaka animé |
| `ProfileOnboarding.jsx` | Formulaire d'onboarding 3 étapes avec Tanaka |
| `VisitorStepsBlocks.jsx` | 8 blocs avec aperçu du vrai contenu (enfant/adulte) |
| `TechniqueCelebration.jsx` | Animation confettis + son pour maîtrise |
| `TechniqueModal.js` | Modal de technique avec célébration |
| `JourneyPath.jsx` | 6 étapes avec animation sphère |
| `StepTransition.jsx` | Animation sphère entre étapes |
| `StatisticsDashboard.js` | Dashboard principal qui orchestre les modals |

---

## Tâches à venir

### P1 - Priorité haute
- [x] ~~Étape 2 "Apprends" avec fiches techniques par Kyu~~ ✅ FAIT
- [x] ~~Étape 3 "Entraîne-toi" - Dojo Virtuel avec 10 mini-jeux~~ ✅ FAIT (4 jeux complets)
- [ ] **Compléter les 6 jeux restants** du Dojo Virtuel (GardienEspace, MiroirHarmonie, CheminEquilibre, MemorySensei, RythmeDuDojo, QueteVertus)
- [ ] Intégrer la **voix TTS de Tanaka** (ElevenLabs) dans les jeux
- [ ] Bouton de téléchargement du PDF Shodan
- [ ] Améliorer l'ergonomie PC du parcours guidé
- [ ] Configurer clés Stripe live
- [ ] Vérifier domaine Resend pour emails

### P2 - Backlog
- [ ] Migration MongoDB → PostgreSQL
- [ ] Créer blocs "Techniques" et "Défis collectifs"
- [ ] 2FA pour Super Admin
- [ ] Ajouter des sons/effets audio aux mini-jeux
- [ ] Système de badges/trophées pour les jeux complétés
