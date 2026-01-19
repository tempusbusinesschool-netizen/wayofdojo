# WayofDojo.com - Product Requirements Document

## Project Overview
**Name:** WayofDojo.com  
**Type:** SaaS Platform - International Multi-Sport Gamification  
**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, MongoDB  
**Status:** Phase 2 In Progress

---

## Original Problem Statement
Build an international, multi-sport SaaS platform for martial arts and progression-based sports (Aikido, Judo, Karate, Yoga, etc.). The platform provides gamification features for practitioners, CRM tools for clubs, and admin management for the platform.

---

## What's Been Implemented

### Phase 1: Foundations ✅ (Completed - January 19, 2026)
- [x] Next.js 14 project setup with TypeScript
- [x] Tailwind CSS + Custom theme configuration
- [x] i18n architecture with `next-intl` (FR + EN)
- [x] Routing structure `/[locale]/[sport]/...`
- [x] MongoDB connection setup
- [x] Aikido sport configuration (grades, categories, glossary, virtues)
- [x] Base UI components (Button, Input, Card)
- [x] Type definitions (Sport, User, Club)
- [x] Landing page with features showcase

### Phase 2: User Journey 🔄 (In Progress)
- [x] User model with gamification fields
- [x] Auth utilities (hash, token generation)
- [x] API routes: `/api/auth/register`, `/api/auth/login`
- [x] Multi-step registration flow (profile → info → sport → complete)
- [x] Login page
- [x] Virtual Dojo dashboard with:
  - XP, Level, Streak, Badges stats
  - Grade display with progress bar
  - Quick actions navigation
  - Daily challenges
  - 7 Virtues of Bushido
  - Separate UI for "Jeune Ninja" vs "Ninja Confirmé"

---

## Prioritized Backlog

### P0 - Critical (Next)
- [ ] Fix MongoDB connection in production
- [ ] Add session persistence (localStorage working, need validation)
- [ ] Create techniques page
- [ ] Create stages/seminars page

### P1 - High Priority
- [ ] Stripe integration for subscriptions
- [ ] User profile editing
- [ ] Password reset flow
- [ ] Club registration flow

### P2 - Medium Priority
- [ ] Progression tracking page
- [ ] Badge showcase page
- [ ] Leaderboard
- [ ] Club CRM features (Phase 5)

### P3 - Future
- [ ] Admin platform (Phase 6)
- [ ] Multi-sport configuration (Judo, Karate, Yoga)
- [ ] 30+ language support
- [ ] Mobile app

---

## Architecture

```
/app/wayofdojo/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── layout.tsx            # Locale layout with i18n
│   │   │   └── [sport]/
│   │   │       ├── register/page.tsx # Multi-step registration
│   │   │       ├── login/page.tsx    # Login
│   │   │       └── dojo/page.tsx     # Virtual Dojo dashboard
│   │   └── api/
│   │       └── auth/
│   │           ├── register/route.ts
│   │           └── login/route.ts
│   ├── components/ui/               # Shadcn-style components
│   ├── config/sports/               # Sport configurations
│   ├── lib/
│   │   ├── db.ts                    # MongoDB connection
│   │   ├── auth.ts                  # Auth utilities
│   │   └── models/                  # Mongoose models
│   ├── locales/                     # i18n translations
│   │   ├── core/                    # UI translations
│   │   └── sports/                  # Sport-specific content
│   └── types/                       # TypeScript definitions
```

---

## Key URLs
- Landing: `http://localhost:3001/fr`
- Register: `http://localhost:3001/fr/aikido/register`
- Login: `http://localhost:3001/fr/aikido/login`
- Dojo: `http://localhost:3001/fr/aikido/dojo`

---

## Test Accounts (wayofdojo database)
*None created yet - users register through the new system*

## Legacy App (Aikido@Game)
The previous application remains functional at:
- Frontend: `http://localhost:3000`
- Backend API: Port 8001

Test accounts (legacy):
- `usertest0@gmail.com` / `123456` - Premium free
- `dojotest0@gmail.com` / `123456` - Premium free

---

## Next Steps
1. Test registration flow with MongoDB
2. Implement techniques listing page
3. Add Stripe for premium subscriptions
4. Complete progression tracking
