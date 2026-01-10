# Aikido@Game - Product Requirements Document

## 📌 Original Problem Statement
Build a web application for an Aikido club named "Aikido@Game" that serves as a digital reference for the training program, manages club memberships, and allows individual users to create accounts to track their personal training progress with a **heavy emphasis on gamification**.

---

## 🎯 Core Requirements

### 1. Gamification Philosophy
- Motivate users through a personal journey, reflection, and memory of practice
- Implement a comprehensive point system

### 2. User Roles
| Role | Description |
|------|-------------|
| Pratiquant | Regular user/student |
| Parent | Parent account for children validation |
| Enseignant | Teacher role |
| Admin | Club-level admin (Espace Dojo) |
| Super Admin | Platform-level admin |

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

### Landing Page & UI (Jan 2025)
- [x] Age selector with two distinct visitor experiences
- [x] Dark elegant PC design with golden accents
- [x] Mobile-optimized landing page
- [x] Dynamic stats display (206+ Techniques, 10 Grades, 84 Challenges)
- [x] Budo vs Sport explanation modal
- [x] Responsive header for mobile
- [x] Character images with matching gradient backgrounds
- [x] Mobile visitor blocks order: "Ninja Confirmé" on top, "Jeune Ninja" below

### Backend API
- [x] `/api/public-stats` endpoint - Returns total techniques, grades (Kyu/Dan), challenges
- [x] Gamification logic
- [x] Parent-child validation flow

### Dashboard
- [x] Scroll-to-section links for 4 main statistic blocks
- [x] User dashboard with stats and progression

### Security
- [x] Removed auto-fill test password buttons from admin login

### Integration
- [x] Stripe (test keys) for payments
- [x] reportlab for PDF generation

---

## 🚧 In Progress / Pending

### P1 - High Priority
- [ ] Finalize Stripe Integration (live keys + webhooks)
- [ ] Implement "Enseignant" (teacher) user role

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
│   └── server.py              # FastAPI server with /api/public-stats
└── frontend/
    └── src/
        ├── components/
        │   ├── AgeSelector.jsx           # Landing page (PC dark elegant + mobile)
        │   ├── StatisticsDashboard.js    # Visitor page after mode selection
        │   ├── UserDashboardBlocks.jsx   # Dashboard with clickable scroll links
        │   ├── AdminLoginDialog.js       # Secured admin login
        │   └── ...
        ├── constants/
        │   ├── aikidoCharacters.js       # Character image URLs
        │   └── virtuesGamification.js    # Gamification text
        └── App.js                        # Main app with auth event listeners
```

---

## 🔐 Test Credentials
- **User**: `test@aikido.fr` / `test123`
- **Super Admin**: Password `aikido2024`
- **Espace Dojo**: `contact@aikido-lariviere.fr` / `aikido2024`

---

## 📝 Notes
- User frequently iterates on UI details - expect rapid prototyping
- Distinguish between `AgeSelector.jsx` (initial landing) and `StatisticsDashboard.js` (visitor page after mode selection)
- User's preferred language: **French**

---

*Last updated: January 10, 2025*
