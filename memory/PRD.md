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
1. **Écran de sélection du mode** : "Jeune Ninja" (enfants) ou "Ninja Confirmé" (adultes)
2. **Après sélection** : Affichage des **8 blocs de présentation** du contenu
   - 4 blocs colorés (Bienvenue, Mon Profil, Les Défis, Les 7 Vertus)
   - 4 blocs verrouillés (Les Techniques, Les Ceintures, L'Histoire, Mes Trophées)
   - Objectif : Montrer ce que l'utilisateur va découvrir

### Page d'accueil - Utilisateur CONNECTÉ
- **6 blocs numérotés (1→6)** avec GROS numéros visibles
- **Maître Tanaka animé** comme guide interactif
- Étapes : Commence → Apprends → Entraîne-toi → Valide → Progresse → Maîtrise
- Progression sauvegardée en localStorage
- Bouton "Réinitialiser le parcours" pour les tests

---

## Fonctionnalités principales

### Gamification
- Système de points XP
- 7 Vertus avec animaux gardiens
- Badges et trophées
- Progression par ceintures (Blanche → Noire)

### Rôles utilisateurs
- **Pratiquant** (utilisateur standard)
- **Parent** (suivi des enfants)
- **Enseignant** (gestion des cours)
- **Admin Dojo** (gestion du club)
- **Super Admin** (plateforme HUMAN KNOWLEDGE)

### Abonnements (Stripe)
- Plans individuels et familiaux
- Période d'essai 30 jours
- Intégration webhooks Stripe

---

## Stack technique
- **Frontend** : React + TailwindCSS + Shadcn/UI + Framer Motion
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
- ✅ **Restructuration des écrans d'accueil** :
  - NON connecté : 8 blocs de présentation du contenu
  - Connecté : 6 blocs numérotés du parcours interactif
- ✅ **Ajout de GROS numéros** sur les blocs (demande utilisateur)
- ✅ **JourneyPath.jsx** : Réduit de 8 à 6 étapes pour le parcours connecté
- ✅ **VisitorStepsBlocks.jsx** : Refactorisé pour afficher 8 blocs de présentation

### Sessions précédentes
- ✅ Bug critique de connexion résolu (TypeError emoji)
- ✅ Module Parent debuggé (Invalid salt)
- ✅ Compte enfant "Bill" lié au parent
- ✅ Dialogue d'introduction Tanaka avec demande de prénom
- ✅ Composant StepTransition.jsx créé pour animations

---

## Tâches à venir

### P1 - Priorité haute
- [ ] Intégrer l'animation sphère (StepTransition) entre les étapes
- [ ] Améliorer l'ergonomie PC du parcours guidé

### P2 - Priorité moyenne
- [ ] Configurer clés Stripe live
- [ ] Vérifier domaine Resend pour emails

### P3 - Backlog
- [ ] Migration MongoDB → PostgreSQL
- [ ] Créer blocs "Techniques" et "Défis collectifs"
- [ ] 2FA pour Super Admin
