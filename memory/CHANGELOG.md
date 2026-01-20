# 📝 WayofDojo - CHANGELOG

## [2025-01-20] - Session Actuelle

### ✅ Ajouté

#### 🛡️ Système de Rôles Admin
- Ajout du champ `role` au modèle User (`user`, `club_admin`, `admin`, `super_admin`)
- API `/api/auth/me` - Récupération de l'utilisateur connecté
- API `/api/admin/stats` - Statistiques globales (utilisateurs, activité, distribution)
- API `/api/admin/users` - Gestion des utilisateurs (liste, recherche, modification rôle)
- API `/api/admin/promote` - Promotion d'un utilisateur en admin (avec secret)
- Middleware d'authentification avec RBAC (`auth-middleware.ts`)
- Service API centralisé (`api.service.ts`) avec gestion automatique du préfixe

#### 🎮 Page Admin Panel (`/[locale]/admin`)
- Dashboard avec statistiques : Total utilisateurs, Nouveaux (7j), Actifs (7j), Admins
- Top 10 utilisateurs par XP avec classement
- Distribution par profil (Jeune Ninja / Ninja Confirmé)
- Distribution par abonnement (free, trial, active, etc.)
- Distribution par grade (6e Kyu → Dan)
- Onglet **Utilisateurs** : Liste paginée, recherche, changement de rôle
- Onglet **Paramètres** : Placeholders pour fonctionnalités futures

#### 📅 Page Stages (`/[locale]/[sport]/stages`)
- 3 modes de vue : Grille, Liste, Calendrier
- 6 stages mockés avec données réalistes
- Filtres par niveau (Tous niveaux, Débutant, Intermédiaire, Avancé)
- Barre de recherche (ville, sensei, titre)
- Section "Stages à la Une" mise en avant
- Modal de détail avec infos complètes et bouton inscription
- Calendrier mensuel avec navigation et événements
- Indicateurs de disponibilité (places restantes)

#### 🏠 Dashboard Dojo Amélioré (`/[locale]/[sport]/dojo`)
- **Stats de la semaine** : Entraînements, Techniques, XP gagnés, Streak
- **Actions rapides** : Cards colorées vers Techniques, Progression, Stages, Badges
- **Défis du jour** : 6 défis avec XP, vertu associée, état (complété/à faire)
- Barre de progression des défis quotidiens
- **Les 7 Vertus du Budo** : Cards cliquables avec progression individuelle
  - Respect (礼), Courage (勇), Maîtrise (克), Humilité (謙), Bienveillance (仁), Attention (注), Responsabilité (責)
  - Détails expandables avec défis associés
- **Derniers accomplissements** : Premier Pas, Premiers XP, Curieux, Fidèle
- Animation XP lors de la complétion d'un défi
- Lien Admin visible pour les utilisateurs admin/super_admin

### 🔧 Corrigé
- Configuration middleware i18n pour exclure `/next-api/` du routing
- Réécriture Next.js `/next-api/*` → `/api/*` pour contourner le routing Kubernetes

### 📋 Notes techniques
- Stages data MOCKED dans le frontend (MOCK_STAGES array)
- API Routes Next.js utilisent `/next-api/` en environnement preview Emergent

---

## [2025-01-19] - Session Précédente

### ✅ Ajouté

#### Page d'accueil
- Header avec logo Maître Tanaka animé
- Hero section "Deviens un vrai Ninja !"
- Badge "L'Aïkido, c'est du jeu !"
- Boutons CTA (inscription/connexion)
- Parcours en 6 étapes (NinjaJourney)
- 8 blocs visiteurs avec modals d'aperçu animés (VisitorStepsBlocks)
- Footer avec liens légaux
- Maître Tanaka flottant "Parle-moi !"

#### Page Techniques
- Bibliothèque de 64 techniques
- Navigation entre les 6 grades (6e Kyu → 1er Kyu)
- Sélecteur de ceinture avec emojis
- Barre de recherche
- Filtres par niveau de maîtrise (À découvrir, J'apprends, Je pratique, Maîtrisé)
- Sauvegarde progression en localStorage
- Catégories : Ukemi, Tai Sabaki, Techniques, Postures, Attaques

#### Authentification
- API `/api/auth/register` fonctionnelle
- API `/api/auth/login` fonctionnelle
- Formulaire d'inscription multi-étapes
- Redirection automatique vers /dojo après connexion
- Stockage token JWT en localStorage

#### Données migrées
- `aikidoBelts.ts` - Système de ceintures complet
- `techniquesByKyu.ts` - Programme technique par grade
- `virtuesGamification.ts` - 7 vertus avec défis et badges
- `tanakaVoiceService.ts` - Service audio Maître Tanaka
- Assets images et audio copiés

#### Composants
- `MaitreTanaka.tsx` - Assistant vocal avec dialogue
- `NinjaJourney.tsx` - Parcours en 6 étapes
- `VisitorStepsBlocks.tsx` - 8 blocs avec modals animés
- `UserDashboardBlocks.tsx` - Dashboard utilisateur

### 🔧 Corrigé
- Création `.env.local` avec MONGODB_URI
- Redirection post-connexion vers /dojo

---

## [Sessions Précédentes]

### Déploiement Vercel
- Configuration projet Vercel
- Connexion MongoDB Atlas
- Résolution erreur ECONNREFUSED
- Endpoint `/api/health` pour debug

### Structure Next.js
- Création projet `/app/wayofdojo/`
- Configuration next-intl
- Routing /[locale]/[sport]/
- Middleware i18n

---

*Dernière mise à jour: 20 Janvier 2025*
