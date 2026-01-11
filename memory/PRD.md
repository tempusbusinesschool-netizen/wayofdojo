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

---

## 🚧 In Progress / Pending

### P1 - High Priority
- [ ] Finalize Stripe Integration (live keys + webhooks)
- [ ] Build Parent role interface (read messages/observations)

### P2 - Medium Priority
- [ ] "Forgot Password" flow
- [ ] User profile creation flow (Bloc 1 "Commence")

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

---

## 📝 Notes
- User frequently iterates on UI details - expect rapid prototyping
- Distinguish between `AgeSelector.jsx` (initial landing) and `StatisticsDashboard.js` (visitor page after mode selection)
- User's preferred language: **French**

---

*Last updated: January 11, 2025*
