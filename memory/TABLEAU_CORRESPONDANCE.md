# 📋 TABLEAU DE CORRESPONDANCE : Ancien → Nouveau

**Date** : 24 Janvier 2025  
**Règle** : Tout contenu non listé sera considéré comme perdu et invalide

---

## 🎯 STRUCTURE CIBLE : Les 8 Blocs du Parcours

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   1️⃣ BIENVENUE → 2️⃣ PROFIL → 3️⃣ DÉFIS → 4️⃣ VERTUS                          │
│       👋           🥷          🎯         ☯️                                │
│                                                                             │
│   5️⃣ TECHNIQUES → 6️⃣ CEINTURES → 7️⃣ HISTOIRE → 8️⃣ TROPHÉES                │
│       🥋             🎖️            📜           🏆                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 CORRESPONDANCE FICHIERS DE DONNÉES

| Ancien emplacement | Nouveau bloc | Nouveau emplacement | Statut |
|--------------------|--------------|---------------------|--------|
| `/frontend/src/constants/virtuesGamification.js` | 4️⃣ VERTUS | `/wayofdojo/src/constants/virtuesGamification.ts` | ⚠️ À COMPLÉTER |
| `/frontend/src/constants/aikidoBelts.js` | 6️⃣ CEINTURES | `/wayofdojo/src/constants/aikidoBelts.ts` | ✅ CONSERVÉ |
| `/frontend/src/constants/aikidoTechniquesData.js` | 5️⃣ TECHNIQUES | `/wayofdojo/src/data/aikido/techniques/` | ⚠️ PARTIEL |
| `/frontend/src/constants/passagesGrades.js` | 6️⃣ CEINTURES | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/constants/aikidoPhilosophie.js` | 7️⃣ HISTOIRE | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/constants/aikidoMovements.js` | 5️⃣ TECHNIQUES | `/wayofdojo/src/data/aikido/` | ⚠️ À VÉRIFIER |
| `/frontend/src/constants/aikidoCombinaisons.js` | 5️⃣ TECHNIQUES | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/constants/deplacementsData.js` | 5️⃣ TECHNIQUES | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/constants/reglementData.js` | 7️⃣ HISTOIRE | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/constants/techniquesByKyu.js` | 5️⃣ TECHNIQUES | `/wayofdojo/src/constants/techniquesByKyu.ts` | ✅ CONSERVÉ |
| `/frontend/src/constants/masteryLevels.js` | 6️⃣ CEINTURES | ❌ NON CRÉÉ | ❌ À MIGRER |

---

## 🎤 CORRESPONDANCE NARRATION TANAKA

| Ancien emplacement | Nouveau bloc | Nouveau emplacement | Statut |
|--------------------|--------------|---------------------|--------|
| `/frontend/src/services/tanakaVoiceService.js` | 1️⃣ BIENVENUE (+ tous) | `/wayofdojo/src/services/tanakaVoiceService.ts` | ⚠️ PARTIEL |
| `TANAKA_PHRASES.welcome` | 1️⃣ BIENVENUE | ✅ Présent | ✅ CONSERVÉ |
| `TANAKA_PHRASES.hello_morning` | 1️⃣ BIENVENUE | ✅ Présent | ✅ CONSERVÉ |
| `TANAKA_PHRASES.hello_afternoon` | 1️⃣ BIENVENUE | ✅ Présent | ✅ CONSERVÉ |
| `TANAKA_PHRASES.goodbye` | 1️⃣ BIENVENUE | ✅ Présent | ✅ CONSERVÉ |
| `TANAKA_PHRASES.belt_*` (7 phrases) | 6️⃣ CEINTURES | ⚠️ À VÉRIFIER | ⚠️ À VÉRIFIER |
| `TANAKA_PHRASES.streak_*` (4 phrases) | 3️⃣ DÉFIS | ⚠️ À VÉRIFIER | ⚠️ À VÉRIFIER |
| `TANAKA_PHRASES.step_*` (5 phrases) | PARCOURS | ⚠️ À VÉRIFIER | ⚠️ À VÉRIFIER |

---

## 🎮 CORRESPONDANCE DOJO VIRTUEL (11 Jeux)

| Ancien emplacement | Nouveau bloc | Nouveau emplacement | Statut |
|--------------------|--------------|---------------------|--------|
| `/frontend/src/components/VirtualDojo/index.jsx` | 3️⃣ DÉFIS | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/VirtualDojo/games/MessagerDuKi.jsx` | 3️⃣ DÉFIS | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/VirtualDojo/games/ParcoursduSouffle.jsx` | 3️⃣ DÉFIS | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/VirtualDojo/games/SenseiInvisible.jsx` | 3️⃣ DÉFIS | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/VirtualDojo/games/ReflexePacifique.jsx` | 3️⃣ DÉFIS | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/VirtualDojo/games/GardienEspace.jsx` | 3️⃣ DÉFIS | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/VirtualDojo/games/MiroirHarmonie.jsx` | 3️⃣ DÉFIS | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/VirtualDojo/games/CheminEquilibre.jsx` | 3️⃣ DÉFIS | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/VirtualDojo/games/MemorySensei.jsx` | 3️⃣ DÉFIS | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/VirtualDojo/games/RythmeDuDojo.jsx` | 3️⃣ DÉFIS | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/VirtualDojo/games/QueteVertus.jsx` | 4️⃣ VERTUS | ❌ NON CRÉÉ | ❌ À MIGRER |

---

## 👨‍👩‍👧 CORRESPONDANCE PAGES ENFANT

| Ancien emplacement | Nouveau bloc | Nouveau emplacement | Statut |
|--------------------|--------------|---------------------|--------|
| `/frontend/src/pages/enfant/CommencePage.jsx` | 2️⃣ PROFIL | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/pages/enfant/ApprendsPage.jsx` | 5️⃣ TECHNIQUES | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/pages/enfant/EntrainePage.jsx` | 3️⃣ DÉFIS | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/pages/enfant/ValidePage.jsx` | 3️⃣ DÉFIS | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/pages/enfant/ProgressePage.jsx` | 6️⃣ CEINTURES | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/pages/enfant/MaitrisePage.jsx` | 8️⃣ TROPHÉES | ❌ NON CRÉÉ | ❌ À MIGRER |

---

## 🧭 CORRESPONDANCE PARCOURS GUIDÉ

| Ancien emplacement | Nouveau bloc | Nouveau emplacement | Statut |
|--------------------|--------------|---------------------|--------|
| `/frontend/src/components/JourneyPath.jsx` | TOUS (1-8) | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/VisitorStepsBlocks.jsx` | TOUS (1-8) | `/wayofdojo/src/components/VisitorStepsBlocks.tsx` | ⚠️ ORDRE INCORRECT |
| Bloc 1 "Bienvenue" | 1️⃣ BIENVENUE | ❌ MANQUANT | ❌ À CRÉER |
| Bloc 2 "Mon Profil" | 2️⃣ PROFIL | ⚠️ id:1 | ⚠️ RENOMMER |
| Bloc 3 "Les Défis" | 3️⃣ DÉFIS | ⚠️ id:3 | ⚠️ RENOMMER |
| Bloc 4 "Les 7 Vertus" | 4️⃣ VERTUS | ⚠️ id:4 | ✅ OK |
| Bloc 5 "Les Techniques" | 5️⃣ TECHNIQUES | ⚠️ id:2 | ⚠️ RÉORDONNER |
| Bloc 6 "Les Ceintures" | 6️⃣ CEINTURES | ⚠️ id:5 | ⚠️ RÉORDONNER |
| Bloc 7 "L'Histoire" | 7️⃣ HISTOIRE | ⚠️ id:6 | ⚠️ RÉORDONNER |
| Bloc 8 "Mes Trophées" | 8️⃣ TROPHÉES | ⚠️ id:7 | ⚠️ RÉORDONNER |

---

## 🔧 CORRESPONDANCE COMPOSANTS UI

| Ancien emplacement | Nouveau bloc | Nouveau emplacement | Statut |
|--------------------|--------------|---------------------|--------|
| `/frontend/src/components/MaitreTanaka.jsx` | TOUS | `/wayofdojo/src/components/MaitreTanaka.tsx` | ⚠️ SIMPLIFIÉ |
| `/frontend/src/components/UserDashboardBlocks.jsx` | 2️⃣ PROFIL | `/wayofdojo/src/components/UserDashboardBlocks.tsx` | ⚠️ SIMPLIFIÉ |
| `/frontend/src/components/StatisticsDashboard.js` | 2️⃣ PROFIL | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/VirtuesGamification.jsx` | 4️⃣ VERTUS | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/ProfileOnboarding.jsx` | 2️⃣ PROFIL | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/ProgressionTunnel.jsx` | 6️⃣ CEINTURES | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/BeltProgressCard.jsx` | 6️⃣ CEINTURES | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/TechniquesByKyuCards.jsx` | 5️⃣ TECHNIQUES | ⚠️ PARTIEL | ⚠️ À COMPLÉTER |
| `/frontend/src/components/DojoLogbookDialog.jsx` | 3️⃣ DÉFIS | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/GuidedTour.jsx` | 1️⃣ BIENVENUE | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/PaywallDialog.js` | TRANSVERSAL | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/WelcomeDialog.jsx` | 1️⃣ BIENVENUE | ❌ NON CRÉÉ | ❌ À MIGRER |
| `/frontend/src/components/ParentDashboard.jsx` | PARENT | ❌ NON CRÉÉ | ❌ À MIGRER |

---

## 📊 SYNTHÈSE DE MIGRATION

### Par bloc cible :

| Bloc | Éléments à migrer | Migrés | Manquants |
|------|-------------------|--------|-----------|
| 1️⃣ BIENVENUE | 5 | 0 | 5 |
| 2️⃣ PROFIL | 8 | 2 | 6 |
| 3️⃣ DÉFIS | 15 | 1 | 14 |
| 4️⃣ VERTUS | 4 | 1 | 3 |
| 5️⃣ TECHNIQUES | 10 | 3 | 7 |
| 6️⃣ CEINTURES | 8 | 2 | 6 |
| 7️⃣ HISTOIRE | 4 | 0 | 4 |
| 8️⃣ TROPHÉES | 3 | 0 | 3 |

### Taux de migration : **~15%**

---

## ✅ ACTIONS REQUISES (par priorité)

### P0 - Structure de base
1. ❌ Créer le bloc 1️⃣ BIENVENUE (introduction Tanaka)
2. ❌ Réordonner les 8 blocs selon la structure originale
3. ❌ Migrer `JourneyPath.jsx` pour le parcours utilisateur connecté

### P1 - Données essentielles
4. ❌ Migrer `aikidoPhilosophie.js` → Section Histoire
5. ❌ Migrer `passagesGrades.js` → Section Ceintures
6. ❌ Compléter `virtuesGamification.ts` avec toutes les données

### P2 - Fonctionnalités
7. ❌ Migrer le Dojo Virtuel (11 jeux)
8. ❌ Migrer les 6 pages Enfant
9. ❌ Migrer l'Espace Parent

### P3 - Composants UI
10. ❌ Migrer `StatisticsDashboard.js`
11. ❌ Migrer `ProfileOnboarding.jsx`
12. ❌ Migrer `ProgressionTunnel.jsx`

---

## ⚠️ RÈGLE STRICTE

> **Tout élément marqué ❌ doit être migré AVANT toute nouvelle fonctionnalité.**
> **Aucune modification des contenus sans validation explicite.**

---

**Document validé par** : _________________  
**Date de validation** : _________________
