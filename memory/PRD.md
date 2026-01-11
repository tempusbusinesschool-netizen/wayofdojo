# Aikido@Game - Product Requirements Document

## 📌 Original Problem Statement
Build a web application for an Aikido club named "Aikido@Game" that serves as a digital reference for the training program, manages club memberships, and allows individual users to create accounts to track their personal training progress with a **heavy emphasis on gamification**.

---

## 🎯 Core Requirements

### 1. Gamification Philosophy
- Motivate users through a personal journey, reflection, and memory of practice
- Implement a comprehensive point system

### 2. User Roles
| Role | Description | Status |
|------|-------------|--------|
| Pratiquant | Regular user/student | ✅ Implemented |
| Parent | Parent account for children validation | ✅ Implemented |
| Enseignant | Teacher role - observations & messages | ✅ Implemented (Jan 11, 2025) |
| Admin | Club-level admin (Espace Dojo) | ✅ Implemented |
| Super Admin | Platform-level admin | ✅ Implemented |

### 3. Architecture
- Multi-dojo architecture
- Platform-level "Admin" (Super Admin)
- Club-level "Espace Dojo" (Dojo Admin)

### 4. User Experience
- **Jeune Ninja** version: Playful design for children (<14 years)
- **Ninja Confirmé** version: Professional design for adults/teens (≥14 years)

### 5. Compliance
- RGPD-compliant member management

### 6. Branding
- Application name: **Aikido@Game** (never translated)

---

## ✅ Completed Features

### Parent Role System - Jan 11, 2025
- [x] Backend API endpoints:
  - `POST /api/parents/register` - Parent registration
  - `POST /api/parents/login` - Parent authentication
  - `GET /api/parents/me` - Parent profile with children
  - `GET /api/parents/messages` - View messages from teachers
  - `GET /api/parents/observations` - View observations about children
  - `PATCH /api/parents/messages/{id}/read` - Mark message as read
  - `POST /api/parents/link-child` - Link child to parent
- [x] ParentLoginDialog component:
  - Login/Register toggle
  - Form validation
  - "How it works" info section
- [x] ParentDashboard with:
  - Overview tab (children list, recent activity)
  - Messages tab (inbox with read/unread status)
  - Observations tab (categorized by type)
  - Child detail modal
  - Message detail modal
- [x] "Connexion Parent" added to header dropdown
- [x] Purple/pink gradient theme for parent interface

### Enseignant (Teacher) System - Jan 11, 2025
- [x] Backend API endpoints for enseignant management
- [x] Enseignant login with JWT authentication
- [x] Observations system (free comments on students)
- [x] Messaging system (enseignant → parents)
- [x] EnseignantLoginDialog component
- [x] EnseignantDashboard with:
  - Stats cards (students, observations, messages)
  - Student list with quick actions
  - Observation creation with categories
  - Message sending interface
- [x] "Enseignant" button in header (orange)

### Page Programme - Jan 11, 2025
- [x] Uses GradeSection and TechniqueCard components
- [x] Fetches data from /api/kyu-levels (206 techniques)
- [x] Displays full technique details (description, key points, practice tips)
- [x] TechniqueModal with mastery levels

### Landing Page & UI (Jan 2025)
- [x] Age selector with two distinct visitor experiences
- [x] Dark elegant PC design with golden accents
- [x] Mobile-optimized landing page
- [x] Dynamic stats display (206+ Techniques, 10 Grades, 84 Challenges)
- [x] Budo vs Sport explanation modal
- [x] Responsive header for mobile
- [x] Smooth transition animation between modes (Jeune Ninja ↔ Ninja Confirmé)

### Backend API
- [x] `/api/public-stats` - Public statistics
- [x] `/api/enseignants` - Teacher management
- [x] `/api/observations` - Student observations
- [x] `/api/messages` - Parent-teacher messaging
- [x] `/api/users` - User list for teachers
- [x] Gamification logic
- [x] Parent-child validation flow

### Dashboard
- [x] Scroll-to-section links for 4 main statistic blocks
- [x] User dashboard with stats and progression

### Security
- [x] Removed auto-fill test password buttons from admin login
- [x] JWT authentication for enseignants

### Integration
- [x] Stripe (test keys) for payments
- [x] reportlab for PDF generation

### Documentation - Jan 11, 2025
- [x] Mode d'Emploi (User Manual) PDF generated
  - 10 sections with screenshots and French explanations
  - Covers: Introduction, Homepage, Visitor mode, Programme, Techniques, Registration, Dashboard, Progression blocks, Teacher space, Glossary
  - Available at: `/Mode_Emploi_AikidoGame.pdf`
- [x] Mode d'Emploi Interactive Web Page
  - Colorful, animated 10-section interactive guide
  - Accessible via "Guide" button in header
  - Sidebar navigation with section indicators
- [x] Promotional Video with ElevenLabs AI Voice (French)
  - 2-3 min animated slideshow with screenshots
  - Professional French narration (Charlotte - female voice)
  - Available at: `/Aikido_Game_Video.mp4`
  - Perfect for social media sharing
- [x] Pricing Page (TarificationPage.jsx)
  - Interactive pricing grid with Utilisateur unique and Club plans
  - Accessible via "Tarifs" button in header
  - FAQ section included
  - Stripe checkout integration
  - Quote request system for large clubs

### Stripe Integration - Jan 11, 2025
- [x] Backend subscription plans updated with 5 plans:
  - utilisateur_mensuel (4.50€/month, 90 days trial)
  - utilisateur_annuel (39.90€/year, 90 days trial)
  - club_petit (19.90€/month, 10 days trial)
  - club_moyen (29.90€/month, 10 days trial)
  - club_grand (quote required)
- [x] Checkout endpoints: `/api/subscriptions/checkout` and `/api/subscriptions/checkout-with-card`
- [x] Quote request endpoint: `/api/subscriptions/request-quote`
- [x] Frontend subscription service created
- [x] TarificationPage integrated with Stripe checkout

### UX Improvements - Jan 11, 2025
- [x] Header navigation restructured with dropdown menus:
  - "Créer un compte" → Inscription Adhérent / Inscription Club
  - "Se connecter" → Connexion Adhérent / Connexion Enseignant / **Connexion Parent**
  - "Administration" → Espace de gestion
- [x] Replaced "Retour à l'app" with "Précédent" throughout the app
- [x] Auto-redirect after login based on user profile (subscription status)
- [x] Login transition animation with framer-motion:
  - Animated logo with spring effect
  - Expanding background circles
  - Personalized welcome message
  - Progress bar with gradient
  - Smooth redirect to dashboard or tarification

---

## 🚧 In Progress / Pending

### P1 - High Priority
- [x] Stripe Integration with new pricing plans (COMPLETED)
- [x] Build Parent role interface (read messages/observations) (COMPLETED - Jan 11, 2025)

### P2 - Medium Priority
- [ ] "Forgot Password" flow
- [ ] User profile creation flow (Bloc 1 "Commence")

---

## 💰 Pricing Structure (Updated Jan 11, 2025)

### Licence Utilisateur unique
- **Public cible**: Particuliers, pratiquants, éducateurs, étudiants, coachs
- **Trial**: 30 jours gratuits
- **Mensuel**: 4,50 € TTC / mois (sans engagement)
- **Annuel**: 39,90 € TTC / an (soit 3,33€/mois)
- **Option**: Tarif solidaire (étudiants, demandeurs d'emploi)

### Licence Club
- **Public cible**: Clubs d'aïkido, fédérations, associations, collectivités
- **Trial**: 30 jours gratuits
- **Petits clubs** (<50 adhérents): 19,90 € TTC / mois
- **Clubs moyens** (50-150): 29,90 € TTC / mois
- **Grandes structures** (>150): Sur devis
- **Commitment**: Engagement 12 mois avec reconduction tacite annuelle

### Cadre éthique
- Charte déontologique obligatoire
- Respect des valeurs du Budo (non-violence, respect, inclusion)
- Usage éducatif uniquement
- Interdiction de détournement

**Important**: Les abonnements ne permettent aucune évaluation technique, certification ou délivrance de grade.

---

## 📋 Backlog / Future Tasks

### P3 - Low Priority
- [ ] Migrate from MongoDB to PostgreSQL
- [ ] New content blocks: "Les différentes techniques"
- [ ] New content blocks: "Défis collectifs"
- [ ] 2FA for Super Admin
- [ ] Split mobile/desktop components for better maintainability
- [ ] Migrate routing from useState to react-router-dom

---

## 🏗️ Architecture

```
/app/
├── backend/
│   └── server.py              # FastAPI server
│       ├── /api/enseignants   # Teacher management
│       ├── /api/observations  # Student observations
│       ├── /api/messages      # Parent-teacher messaging
│       ├── /api/users         # User list
│       └── /api/public-stats  # Public statistics
└── frontend/
    └── src/
        ├── components/
        │   ├── EnseignantLoginDialog.jsx  # Teacher login modal
        │   ├── EnseignantDashboard.jsx    # Teacher dashboard
        │   ├── GradeSection.js            # Grade display with techniques
        │   ├── TechniqueCard.js           # Technique card with mastery
        │   ├── TechniqueModal.js          # Technique details modal
        │   └── ...
        ├── pages/
        │   ├── adulte/
        │   │   └── ProgrammePage.jsx      # Programme with GradeSection
        │   └── enfant/
        │       └── ApprendsPage.jsx       # Children's learning page
        └── App.js                         # Main app with enseignant routing
```

---

## 🔐 Test Credentials

### Users
- **User**: `test@aikido.fr` / `test123`
- **Élève Test**: `eleve.test@aikido.fr` / `eleve123`

### Admin
- **Super Admin**: Password `aikido2024`
- **Espace Dojo**: `contact@aikido-lariviere.fr` / `aikido2024`

### Enseignant
- **Jean Sensei**: `jean.sensei@aikido.fr` / `sensei123`

### Parent
- **Marie Dupont**: `parent.test@aikido.fr` / `parent123`

---

## 📝 Notes
- User frequently iterates on UI details - expect rapid prototyping
- Distinguish between `AgeSelector.jsx` (initial landing) and `StatisticsDashboard.js` (visitor page after mode selection)
- User's preferred language: **French**

---

*Last updated: January 11, 2025*

## 🐛 Bug Fixes - Jan 11, 2025
- [x] Fixed deployment failure caused by missing `Header` import in `server.py`
  - Error: `NameError: name 'Header' is not defined` at line 902
  - Fix: Added `Header` to FastAPI imports

## 📧 Email Notifications System (Jan 11, 2025)
### Resend Integration
- [x] `/app/backend/email_service.py` - Email service module
- [x] HTML email templates in French:
  - Password reset email (professional design)
  - Parent observation notification
  - Parent message notification

### Password Reset Flow
- [x] Backend endpoints:
  - `POST /api/auth/forgot-password` - Request reset link
  - `POST /api/auth/reset-password` - Reset with token
  - `GET /api/auth/verify-reset-token/{token}` - Verify token validity
- [x] Frontend component: `ForgotPasswordDialog.jsx`
- [x] Integrated in all login dialogs:
  - Adhérent login ✅
  - Parent login ✅
  - Enseignant login ✅
- [x] Token expires after 1 hour
- [x] Secure token generation with `secrets.token_urlsafe(32)`

### Stripe Webhooks (Jan 11, 2025)
- [x] `POST /api/webhook/stripe` - Handle Stripe events
- [x] Events handled:
  - `checkout.session.completed` - Payment successful
  - `customer.subscription.deleted` - Subscription cancelled
  - `invoice.payment_failed` - Recurring payment failed
- [x] Auto-activates subscription on successful payment
- [x] Creates payment history records
- [x] Logs all webhook events

### Email Testing
- [x] Resend API key configured
- [x] Test email sent successfully to `tempusbusinesschool@gmail.com`
- ⚠️ **Note**: Resend in test mode - can only send to owner's email
- 📝 **To enable all recipients**: Verify domain at resend.com/domains

### Parent Notifications
- [x] Auto-notify parents when:
  - Teacher adds observation about their child
  - Teacher sends message about their child
- [x] Email includes child name, teacher name, content preview

## 🎙️ Maître Tanaka - Agent Vocal (Jan 11, 2025)
### Description
Interactive voice agent "Maître Tanaka" - a wise old Aikido master who guides children through voice conversations.

### Technical Stack
- **ElevenLabs STT** (Speech-to-Text): Transcribes child's voice input
- **OpenAI GPT-4o-mini** (via Emergent LLM Key): Generates contextual responses
- **ElevenLabs TTS** (Text-to-Speech): Converts responses to master's voice

### Features
- [x] Backend module: `/app/backend/voice_agent.py`
- [x] API endpoints:
  - `POST /api/voice-agent/stt` - Speech to text
  - `POST /api/voice-agent/tts` - Text to speech  
  - `POST /api/voice-agent/chat` - Text chat with audio response
  - `POST /api/voice-agent/conversation` - Full voice conversation
  - `GET /api/voice-agent/voices` - List available voices
  - `GET /api/voice-agent/health` - Health check
- [x] Frontend component: `/app/frontend/src/components/MaitreTanaka.jsx`
- [x] Floating button visible on child pages (mode "jeune ninja")
- [x] Voice recording and playback
- [x] Conversation history with replay button
- [x] Context-aware responses (child's name, belt level)

### Personality
Maître Tanaka speaks:
- As a 75-year-old wise Japanese master
- With encouragement and patience
- Using metaphors from nature (water, mountain, bamboo)
- In French, accessible to children (8-14 years)

### 3D Visuals (Jan 11, 2025)
- **Portrait**: `/images/tanaka/portrait.png` - Close-up for dialog header
- **Teaching**: `/images/tanaka/teaching.png` - Full body in dojo
- **Congratulating**: `/images/tanaka/congratulating.png` - Celebration pose

### Pre-recorded Phrases (26 audio files)
Stored in `/audio/tanaka/` - No API calls needed for common events:
- **Greetings**: welcome, hello_morning, hello_afternoon, goodbye
- **Challenges**: challenge_complete, challenge_first, challenge_hard
- **Belts**: belt_white → belt_black (7 levels)
- **Streaks**: streak_3, streak_7, streak_14, streak_30
- **Encouragements**: encourage_practice, encourage_patience, encourage_comeback
- **Progress**: xp_gained, level_up, technique_mastered, badge_earned, fail_encourage

### Service Files
- `/app/backend/generate_tanaka_phrases.py` - Script to generate audio
- `/app/frontend/src/services/tanakaVoiceService.js` - Frontend service

### 3D Images Collection (Jan 11, 2025)
8 images 3D de Maître Tanaka pour différentes situations :
| Image | Fichier | Utilisation |
|-------|---------|-------------|
| Portrait | `portrait.png` | Header dialogue, bouton flottant |
| Enseignement | `teaching.png` | Technique maîtrisée |
| Félicitations | `congratulating.png` | Défi complété, ceinture, level up |
| Méditation | `meditation.png` | Encouragements calmes |
| Réflexion | `thinking.png` | En attente de réponse |
| Révérence | `bowing.png` | Bienvenue, bon retour |
| Pointant | `pointing.png` | XP gagné, conseils |
| Pouce levé | `thumbs_up.png` | Séries, badges |

### Gamification Event Integration (Jan 11, 2025)
- [x] `TanakaEventContext.jsx` - React Context pour les événements
- [x] `TanakaEventDemo.jsx` - Panneau de test (bouton 🧪)
- [x] Notifications toast avec image 3D + audio automatique
- [x] **Connected to real gamification system** via `useGamification.js` hook
- [x] Auto-triggers when:
  - Challenge completed → Audio + notification
  - Level up detected → Congratulation
  - Streak milestone (3, 7, 14, 30 days) → Encouragement
- [x] Événements supportés :
  - `challenge_complete` - Défi accompli
  - `challenge_first` - Premier défi
  - `belt_earned` - Nouvelle ceinture (7 niveaux)
  - `streak_milestone` - Série de pratique (3, 7, 14, 30 jours)
  - `level_up` - Montée de niveau
  - `xp_gained` - XP gagnés
  - `technique_mastered` - Technique maîtrisée
  - `badge_earned` - Badge obtenu
  - `welcome_back` - Bon retour

## 📅 Updates - December 2025

### Trial Period Update (Dec 2025)
- [x] Updated all trial period text from "3 mois" / "10 jours" to **"30 jours gratuits"**
- [x] Modified in `TarificationPage.jsx`:
  - Badge "30 jours gratuits" (Utilisateur unique)
  - Badge "30 jours gratuits" (Club d'Aikido)
  - CTA "Commencer 30 jours gratuits"
  - CTA "Essayer 30 jours gratuits"
  - FAQ section updated to reflect 30 days trial
- [x] PRD pricing structure updated

### Production Cleanup (Dec 2025)
- [x] Removed `TanakaEventDemo.jsx` test panel from `App.js`
- [x] Removed unused import of `TanakaEventDemo`

---

*Last updated: December 2025*