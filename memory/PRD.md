# Aikido@Game - Product Requirements Document

## Nom de l'application
**Aikido@Game** - Ne jamais traduire ce nom

## Entreprise
**HUMAN KNOWLEDGE**

## Vision du produit
Application web gamifiée pour le club d'Aikido permettant aux pratiquants de suivre leur progression de manière ludique.

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
- **Frontend** : React + TailwindCSS + Shadcn/UI + Framer Motion + canvas-confetti
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

### 16 janvier 2025
- ✅ **Blocs visiteurs avec aperçu du VRAI contenu** 
  - Mode enfant : vraies techniques, défis avec XP, vertus avec animaux
  - Mode adulte : programme FFAAA, kanji, données professionnelles
  - Modal d'aperçu au clic sur chaque bloc
  - Design responsive (4 cols desktop, 2 cols mobile)

### 14 janvier 2025
- ✅ Animation de célébration avec confettis pour la maîtrise de techniques
- ✅ Animation de transition sphère intégrée entre les étapes du parcours
- ✅ Restructuration écrans : 8 blocs visiteurs / 6 blocs connectés

---

## Fichiers clés

| Fichier | Description |
|---------|-------------|
| `VisitorStepsBlocks.jsx` | **MODIFIÉ** - 8 blocs avec aperçu du vrai contenu (enfant/adulte) |
| `TechniqueCelebration.jsx` | Animation confettis + son pour maîtrise |
| `TechniqueModal.js` | Modal de technique avec célébration |
| `JourneyPath.jsx` | 6 étapes avec animation sphère |
| `StepTransition.jsx` | Animation sphère entre étapes |

---

## Tâches à venir

### P1 - Priorité haute
- [ ] Ajouter confetti sur les transitions d'étapes (StepTransition.jsx)
- [ ] Bouton de téléchargement du PDF Shodan
- [ ] Améliorer l'ergonomie PC du parcours guidé
- [ ] Configurer clés Stripe live
- [ ] Vérifier domaine Resend pour emails

### P2 - Backlog
- [ ] Migration MongoDB → PostgreSQL
- [ ] Créer blocs "Techniques" et "Défis collectifs"
- [ ] 2FA pour Super Admin
