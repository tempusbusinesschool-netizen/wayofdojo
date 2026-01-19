# WayofDojo.com - Product Requirements Document

## Project Overview
**Name:** WayofDojo.com  
**Type:** SaaS Platform - International Multi-Sport Gamification  
**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, MongoDB  
**Status:** Phase 2 Complete ✅

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

### Phase 2: User Journey ✅ (Completed - January 19, 2026)
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
- [x] **Techniques page** with:
  - 30+ techniques organized by grade (6e Kyu → 1er Kyu)
  - Search and filtering by grade/category
  - Completion tracking (check/uncheck techniques)
  - Progress visualization (circular chart)
  - Grade-locked content
- [x] **Stages page** with:
  - 8 stages/seminars with full details
  - Search and filtering by level/country
  - Instructor info with grades
  - Pricing display (EUR, JPY)
  - Participant count and availability
  - Alert subscription CTA

---

## Test Data

### Test User Created
- **Email:** kenji.tanaka@wayofdojo.com
- **Password:** ninja123
- **Name:** Kenji Tanaka
- **Grade:** 4e Kyu (Orange belt)
- **Profile:** Ninja Confirmé

### Techniques Database
- 30+ techniques covering grades 6e Kyu to 1er Kyu
- Categories: Tachi Waza, Suwari Waza, Hanmi Handachi, Buki Waza, Ukemi

### Stages Database  
- 8 upcoming stages in France and Japan
- Senseis from 3e Dan to Doshu
- Prices from Free to 15,000 JPY

---

## Prioritized Backlog

### P0 - Critical (Next)
- [ ] Progression tracking page
- [ ] Badge showcase page
- [ ] User profile editing

### P1 - High Priority  
- [ ] Stripe integration for subscriptions
- [ ] Password reset flow
- [ ] Club registration flow
- [ ] Stage registration with payment

### P2 - Medium Priority
- [ ] Leaderboard
- [ ] Club CRM features (Phase 5)
- [ ] Push notifications

### P3 - Future
- [ ] Admin platform (Phase 6)
- [ ] Multi-sport configuration (Judo, Karate, Yoga)
- [ ] 30+ language support
- [ ] Mobile app

---

## Key URLs

| Page | URL |
|------|-----|
| Landing | http://localhost:3001/fr |
| Register | http://localhost:3001/fr/aikido/register |
| Login | http://localhost:3001/fr/aikido/login |
| Dojo | http://localhost:3001/fr/aikido/dojo |
| Techniques | http://localhost:3001/fr/aikido/techniques |
| Stages | http://localhost:3001/fr/aikido/stages |

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
│   │   │       ├── dojo/page.tsx     # Virtual Dojo dashboard
│   │   │       ├── techniques/page.tsx # Techniques list
│   │   │       └── stages/page.tsx   # Seminars calendar
│   │   └── api/
│   │       └── auth/
│   │           ├── register/route.ts
│   │           └── login/route.ts
│   ├── components/ui/               # Shadcn-style components
│   ├── config/sports/
│   │   ├── aikido.config.ts         # Sport config
│   │   ├── aikido-techniques.ts     # 30+ techniques
│   │   └── aikido-stages.ts         # 8 stages
│   ├── lib/
│   │   ├── db.ts                    # MongoDB connection
│   │   ├── auth.ts                  # Auth utilities
│   │   └── models/                  # Mongoose models
│   ├── locales/                     # i18n translations
│   └── types/                       # TypeScript definitions
```

---

## Legacy App (Aikido@Game)
The previous application remains functional:
- Frontend: http://localhost:3000
- Backend API: Port 8001

Test accounts (legacy):
- `usertest0@gmail.com` / `123456` - Premium free
- `dojotest0@gmail.com` / `123456` - Premium free

---

## Next Steps
1. Implement progression tracking page
2. Add badge showcase with animations
3. Integrate Stripe for premium subscriptions
4. Create club registration and CRM features
