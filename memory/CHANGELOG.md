# 📝 WayofDojo - CHANGELOG

## [2025-01-19] - Session Actuelle

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

### 📋 En cours
- Amélioration du dashboard dojo
- Page Stages/Séminaires
- Intégration animations supplémentaires

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

*Dernière mise à jour: 19 Janvier 2025*
