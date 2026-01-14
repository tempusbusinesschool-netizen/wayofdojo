# Aikido@Game - Product Requirements Document

## Nom de l'application
**Aikido@Game** - Ne jamais traduire ce nom

## Entreprise
**HUMAN KNOWLEDGE**

## Vision du produit
Application web gamifiée pour le club d'Aikido permettant aux pratiquants de suivre leur progression de manière ludique.

---

## Architecture des écrans (Mise à jour 14 janvier 2025)

### Page d'accueil - Visiteur NON connecté
- **8 blocs de présentation** du contenu (4 colorés + 4 verrouillés)

### Page d'accueil - Utilisateur CONNECTÉ
- **6 blocs numérotés (1→6)** avec GROS numéros + Tanaka animé
- **Animation de transition sphère** entre chaque étape complétée ✅

### Maîtrise de technique
- **Animation de célébration avec confettis et son** quand on maîtrise une technique ✅

---

## Fonctionnalités de Gamification Implémentées

### 1. Animation de transition sphère (étapes du parcours)
- Sphère turquoise avec emoji et numéro d'étape
- Cercles concentriques animés en arrière-plan
- Message "Bravo [Prénom] ! Étape suivante..."
- 6 points de progression

### 2. Animation de célébration (maîtrise technique) ✅ NOUVEAU
- **Confettis multicolores** (explosion centrale + tirs latéraux + pluie d'étoiles)
- **Son de victoire** (séquence de notes Do-Mi-Sol-Do aigu)
- **Trophée animé** 🏆 qui rebondit
- Titre doré "TECHNIQUE MAÎTRISÉE !"
- 5 étoiles ⭐ décoratives
- Cercles de lumière en arrière-plan
- Bouton "Continuer 🚀"

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

### 14 janvier 2025
- ✅ **Animation de célébration avec confettis** pour la maîtrise de techniques
  - Composant `TechniqueCelebration.jsx` créé
  - Intégré dans `TechniqueModal.js`
  - Bibliothèque `canvas-confetti` installée
  - Son de victoire synthétisé avec Web Audio API
- ✅ **Animation de transition sphère** intégrée entre les étapes du parcours
- ✅ **Restructuration écrans** : 8 blocs visiteurs / 6 blocs connectés

---

## Fichiers clés

| Fichier | Description |
|---------|-------------|
| `TechniqueCelebration.jsx` | Animation confettis + son pour maîtrise |
| `TechniqueModal.js` | Modal de technique avec célébration |
| `JourneyPath.jsx` | 6 étapes avec animation sphère |
| `StepTransition.jsx` | Animation sphère entre étapes |
| `VisitorStepsBlocks.jsx` | 8 blocs pour visiteurs |

---

## Tâches à venir

### P1 - Priorité haute
- [ ] Améliorer l'ergonomie PC du parcours guidé
- [ ] Configurer clés Stripe live
- [ ] Vérifier domaine Resend pour emails

### P2 - Backlog
- [ ] Migration MongoDB → PostgreSQL
- [ ] Créer blocs "Techniques" et "Défis collectifs"
- [ ] 2FA pour Super Admin
