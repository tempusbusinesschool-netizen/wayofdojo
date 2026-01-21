# 🥋 WayofDojo Platform - Architecture & PRD

## 📋 Document de Référence

**Version:** 1.0  
**Date de création:** 19 Janvier 2025  
**Dernière mise à jour:** 19 Janvier 2025

---

## 🎯 VISION DU PROJET

**WayofDojo** (anciennement Aikido@Game / Dojo Game Platform) est une plateforme SaaS internationale de gamification pour arts martiaux et sports à progression (Aikido, Judo, Karaté, Yoga...).

### Caractéristiques Clés
- 🌍 Multi-langues (30+ langues prévues)
- 🥋 Multi-sports (Aikido, Judo, Karaté, Yoga...)
- 🎮 Gamification complète

---

## 📊 ARCHITECTURE GLOBALE

### Les 3 Portails

| Portail | Cible | Fonctionnalités clés | Status |
|---------|-------|---------------------|--------|
| 👤 **PRATIQUANT** | Utilisateurs isolés | Gamification, Techniques, Progression, Stages | 🟢 En cours (Dashboard, Stages, Défis) |
| 🏯 **CLUB** | Dojos / Clubs | CRM, Adhérents, Planning, Finance, Stages | ⬜ À faire |
| 🛡️ **ADMIN** | Gestionnaires plateforme | Dashboard global, Config, Modération, Billing | 🟢 Implémenté (Stats, Users, Rôles) |

### Segmentation Utilisateurs

| Profil | Âge | Interface | Gamification |
|--------|-----|-----------|--------------|
| 🎒 **Jeune Ninja** | 6-14 ans | Ludique, colorée, mascottes | Stickers, mini-jeux, XP rapide |
| 🥋 **Ninja Confirmé** | 15+ ans | Sobre, professionnelle | Stats, certifications, défis |

---

## 🔧 STACK TECHNIQUE

### Prévu vs Implémenté

| Composant | Prévu | Implémenté | Status |
|-----------|-------|------------|--------|
| **Frontend** | Next.js 14 (App Router) | Next.js 14 (App Router) | ✅ |
| **TypeScript** | Oui | Oui | ✅ |
| **CSS** | Tailwind CSS | Tailwind CSS | ✅ |
| **UI Components** | Shadcn/UI | Shadcn/UI | ✅ |
| **Animations** | Framer Motion | Framer Motion | ✅ |
| **i18n** | next-intl | next-intl | ✅ |
| **Routing** | /[locale]/[sport]/... | /[locale]/[sport]/... | ✅ |
| **Database** | MongoDB + Prisma | MongoDB + Mongoose | 🟡 Mongoose au lieu de Prisma |
| **Auth** | NextAuth.js | JWT Custom | 🟡 Custom au lieu de NextAuth |
| **Paiements** | Stripe | - | ⬜ À faire |
| **Emails** | Resend | - | ⬜ À faire |
| **Hébergement** | Vercel | Vercel | ✅ |

---

## 🚀 FLUX UTILISATEUR

```
VISITEUR
    │
    ▼
┌─────────────────┐
│  LANDING PAGE   │  ✅ Implémenté
└────────┬────────┘
         │
   ┌─────┴─────┐
   ▼           ▼
[S'inscrire]  [Se connecter]  ✅ Implémenté
   │              │
   ▼              │
┌──────────┐      │
│INSCRIPTION│     │  ✅ Implémenté (3 étapes)
│ 3 étapes │      │
└────┬─────┘      │
     ▼            │
┌──────────┐      │
│  CHOIX   │      │  ⬜ À faire (Stripe)
│ABONNEMENT│      │
└────┬─────┘      │
     │            │
     └──────┬─────┘
            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    🎮 DOJO VIRTUEL                                   │  ✅ Implémenté
│   Dashboard personnel avec XP, Streaks, Défis, Navigation           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📦 FONCTIONNALITÉS PAR PORTAIL

### 👤 ESPACE PRATIQUANT

| Section | Status | Notes |
|---------|--------|-------|
| 🏠 Dojo Virtuel | ✅ | Dashboard avec XP, niveau, navigation |
| 📚 Techniques | ✅ | 64 techniques, navigation par grade, maîtrise |
| 🎮 Gamification | 🟡 | XP basique, Vertus définies, Badges à compléter |
| 📈 Progression | 🟡 | Grade affiché, checklist à améliorer |
| 📅 Stages | ⬜ | À créer |
| 👤 Profil | 🟡 | Basique, paramètres à ajouter |

### 🏯 ESPACE CLUB (À faire)

| Section | Status |
|---------|--------|
| 📊 Dashboard | ⬜ |
| 👥 Adhérents | ⬜ |
| 📅 Planning | ⬜ |
| 💰 Finance | ⬜ |
| 📅 Stages | ⬜ |
| 🎓 Grades | ⬜ |
| 📢 Communication | ⬜ |

### 🛡️ ESPACE ADMIN (À faire)

| Section | Status |
|---------|--------|
| 📊 Dashboard | ⬜ |
| 🏯 Clubs | ⬜ |
| 👤 Users | ⬜ |
| 🎮 Gamification | ⬜ |
| 📚 Contenus | ⬜ |
| 📅 Stages | ⬜ |
| 💳 Billing | ⬜ |
| 🌍 i18n | ⬜ |
| ⚙️ Config | ⬜ |

---

## 🌍 ARCHITECTURE i18n

### Status Actuel: ✅ Partiellement implémenté

```
/[locale]/[sport]/...

Exemples implémentés:
• /fr/aikido/dojo ✅
• /fr/aikido/techniques ✅
• /fr/aikido/login ✅
• /fr/aikido/register ✅
```

### Structure des Fichiers de Traduction

```
/locales/                          Status
├── core/                          
│   ├── fr.json                    ⬜ À créer (structure complète)
│   ├── en.json                    ⬜ À créer
│   └── ...                        
└── sports/                        
    ├── aikido/                    
    │   ├── fr.json                ⬜ À créer
    │   ├── en.json                ⬜ À créer
    │   └── glossary.json          ⬜ À créer (termes JP)
    └── judo/                      ⬜ À créer
```

### Règles Éditoriales
- ✅ Traduire: descriptions, UI, messages
- ❌ Ne JAMAIS traduire: termes techniques japonais (Ikkyo, Irimi, Tenkan)

### Langues
- **Phase 1:** 🇫🇷 FR (actif) + 🇬🇧 EN (préparé)
- **Phase 2:** 🇯🇵 JA, 🇪🇸 ES, 🇩🇪 DE
- **Phase 3:** 30+ langues

---

## 📅 PLAN D'ACTION & PROGRESSION

### Phase 1: Fondations ✅ COMPLÈTE

- [x] Setup projet Next.js 14
- [x] Configuration TypeScript
- [x] Setup Tailwind + Shadcn/UI
- [x] Structure dossiers
- [x] Installation next-intl
- [x] Routing /[locale]/[sport]/
- [x] Middleware de redirection
- [x] Connexion MongoDB
- [x] Authentification (JWT custom)

### Phase 2: Parcours Utilisateur ✅ COMPLÈTE

- [x] Landing Page responsive
- [x] Inscription 3 étapes
- [ ] Choix Abonnement (Stripe) ⬜
- [x] Connexion
- [x] Redirection vers Dojo Virtuel

### Phase 3: Espace Pratiquant 🟡 EN COURS

- [x] Dojo Virtuel (Dashboard)
- [x] Page Techniques
- [ ] Gamification complète
- [ ] Page Progression
- [ ] Page Profil complète

### Phase 4: Stages & Séminaires ⬜ À FAIRE

- [ ] Calendrier public
- [ ] Inscription stages
- [ ] Mes stages (pratiquant)
- [ ] Base senseis

### Phase 5: Espace Club ⬜ À FAIRE

- [ ] Onboarding Club
- [ ] Dashboard Club
- [ ] Gestion Adhérents
- [ ] Cotisations & Finance
- [ ] Planning & Présences
- [ ] Stages (côté club)
- [ ] Passages de grades
- [ ] Communication

### Phase 6: Espace Admin ⬜ À FAIRE

- [ ] Dashboard global
- [ ] Gestion clubs
- [ ] Gestion utilisateurs
- [ ] Gestion contenus
- [ ] Config gamification
- [ ] Gestion i18n
- [ ] Billing & Config

### Phase 7: Tests & Déploiement ⬜ À FAIRE

- [ ] Tests E2E
- [ ] Migration données
- [ ] Documentation

---

## 📊 RÉSUMÉ DE PROGRESSION

| Phase | Nom | Status | Progression |
|-------|-----|--------|-------------|
| 1 | Fondations | ✅ | 100% |
| 2 | Parcours Utilisateur | 🟡 | 80% (manque Stripe) |
| 3 | Espace Pratiquant | 🟡 | 50% |
| 4 | Stages & Séminaires | ⬜ | 0% |
| 5 | Espace Club | ⬜ | 0% |
| 6 | Espace Admin | ⬜ | 0% |
| 7 | Tests & Déploiement | ⬜ | 0% |

**Progression Globale: ~35%**

---

## 📁 FICHIERS DE RÉFÉRENCE

### Projet Actif: `/app/wayofdojo/`

```
/app/wayofdojo/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx                    # Landing page ✅
│   │   │   └── [sport]/
│   │   │       ├── dojo/page.tsx           # Dashboard ✅
│   │   │       ├── techniques/page.tsx     # Techniques ✅
│   │   │       ├── login/page.tsx          # Connexion ✅
│   │   │       └── register/page.tsx       # Inscription ✅
│   │   └── api/
│   │       └── auth/
│   │           ├── login/route.ts          # API Login ✅
│   │           └── register/route.ts       # API Register ✅
│   ├── components/
│   │   ├── MaitreTanaka.tsx               # Assistant vocal ✅
│   │   ├── NinjaJourney.tsx               # Parcours 6 étapes ✅
│   │   ├── VisitorStepsBlocks.tsx         # 8 blocs visiteurs ✅
│   │   └── UserDashboardBlocks.tsx        # Dashboard user ✅
│   ├── constants/
│   │   ├── aikidoBelts.ts                 # Système ceintures ✅
│   │   ├── techniquesByKyu.ts             # 64 techniques ✅
│   │   └── virtuesGamification.ts         # 7 vertus ✅
│   ├── services/
│   │   └── tanakaVoiceService.ts          # Audio Tanaka ✅
│   └── lib/
│       ├── db.ts                          # Connexion MongoDB ✅
│       └── models/user.model.ts           # Modèle User ✅
├── public/
│   ├── images/                            # Assets images ✅
│   └── audio/tanaka/                      # Voix Tanaka ✅
└── .env.local                             # Variables env ✅
```

### Ancien Projet (Référence): `/app/frontend/`

Utilisé comme source pour le design et les données.

---

## 💰 MODÈLE ÉCONOMIQUE (À implémenter)

### Utilisateurs

| Plan | Prix | Fonctionnalités |
|------|------|-----------------|
| **Gratuit** | 0€ | 5 techniques, badges basiques, streak limité |
| **Premium** | 9€/mois | Toutes techniques, tous badges, streak illimité, stats détaillées |

### Clubs

| Plan | Prix | Fonctionnalités |
|------|------|-----------------|
| **Starter** | 29€/mois | 50 adhérents, CRM basic, 1 admin |
| **Pro** | 99€/mois | 200 adhérents, CRM complet, 3 admins |
| **Premium** | 199€/mois | Illimité, + Stages, + API |
| **Fédération** | Custom | Multi-clubs, White-label, Support VIP |

### Autres Revenus
- Commission stages (5% des inscriptions en ligne)
- Affiliation équipements (partenaires)

---

## ✅ CE QUI EST RÉCUPÉRÉ DE L'ANCIEN PROJET

### Données ✅
- [x] Système de ceintures (aikidoBelts.ts)
- [x] Techniques par Kyu (techniquesByKyu.ts)
- [x] 7 Vertus du Bushido (virtuesGamification.ts)
- [x] Service voix Tanaka (tanakaVoiceService.ts)
- [x] Images et assets
- [x] Fichiers audio Maître Tanaka

### 🆕 MIGRATION AIKIDO@GAME (21 Janvier 2025)

**134 éléments techniques migrés** depuis `/app/Sports/Aikido/` vers `/app/wayofdojo/src/data/aikido/` :

| Catégorie | Fichier | Éléments | Description |
|-----------|---------|----------|-------------|
| **Ukemi** | `mouvements/ukemi.ts` | 9 | Techniques de chute (Mae, Ushiro, Yoko, Tobi...) |
| **Kansetsu Waza** | `mouvements/kansetsu-waza.ts` | 12 | Techniques articulaires (Ikkyo→Rokkyo, Kote Gaeshi...) |
| **Tai Sabaki** | `mouvements/tai-sabaki.ts` | 11 | Déplacements (Irimi, Tenkan, Kaiten...) |
| **Jo** | `armes/jo.ts` | 28 | Bâton: Suburi, Kata, Kumijo, Jo Dori/Nage |
| **Tanto** | `armes/tanto.ts` | 19 | Défense couteau: Shomen, Yokomen, Tsuki |
| **Bokken** | `armes/bokken.ts` | 29 | Sabre: Ken Suburi, Kumitachi, Tachi Dori, Ken Tai Jo |
| **Grades Dan** | `grades/dan.ts` | 26 | Shodan→Nanadan: techniques requises, programmes |

**Nouvelle page créée** : `/[locale]/[sport]/mouvements`
- 6 catégories avec navigation
- Cartes expandables (points clés, erreurs communes)
- Recherche français/japonais
- Design responsive mobile/tablette
- Lien depuis le dashboard Dojo

### Logique ✅
- [x] Système gamification
- [x] Calculs XP/badges (structure définie)
- [x] Programme grades

### Design ✅
- [x] Composants Tailwind/Shadcn
- [x] Palette couleurs
- [x] Animations Framer Motion
- [x] Design Maître Tanaka

---

## 🎯 PROCHAINES ÉTAPES PRIORITAIRES

1. **🔴 Page Stages/Séminaires** - Calendrier et inscriptions
2. **🔴 Améliorer Dashboard Dojo** - Plus de widgets gamification
3. **🟠 Intégrer les animations** - Depuis l'ancien projet Aikido@Game
4. **🟠 Intégrer NextAuth.js** - Remplacer auth custom
5. **🟠 Intégrer Stripe** - Abonnements Premium
6. **🟡 Espace Club** - Premier module CRM

---

*Document généré le 19 Janvier 2025*
