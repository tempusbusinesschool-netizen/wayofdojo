# WayofDojo.com - Product Requirements Document

## Overview
WayofDojo is an interactive guided journey platform for Aikido practitioners featuring a gamified learning experience with two distinct modes: "Jeune Samouraï" (children) and "Samouraï Confirmé" (adults).

## Core Architecture
- **Frontend**: Next.js 14 App Router with React, Tailwind CSS, Framer Motion
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Voice AI**: ElevenLabs TTS + OpenAI Whisper (Emergent LLM Key)

## Key Features Implemented

### Adult Mode Dashboard (`/fr/aikido/dojo`)
- ✅ 3-column layout: Sidebar, Main Content, Notifications
- ✅ Dark/premium aesthetic (Navy background #06101f)
- ✅ AdultSidebar with user profile and navigation
- ✅ AdultHeader with notifications
- ✅ TanakaHero with "vouvoiement" formal tone
- ✅ MaProgression belt timeline component
- ✅ QueFaireAujourdhui daily actions section
- ✅ VertusSection with Japanese Kanji (義勇仁礼誠名誉忠義)

### Techniques Library (`/fr/aikido/techniques`)
- ✅ Technique cards by Kyu level (6e Kyu to 1er Kyu)
- ✅ Category accordion system
- ✅ Mastery tracking (À découvrir, J'apprends, Je pratique, Maîtrisé)
- ✅ Detailed technique modal with illustrations
- ✅ 11 technique illustrations integrated:
  - Mae Ukemi, Ushiro Ukemi, Yoko Ukemi
  - Ikkyo, Ikkyo Omote, Ikkyo Ura
  - Irimi Nage, Shiho Nage, Kokyu Ho
  - Tai Sabaki, Shikko

### Belt Progression (`/fr/aikido/ceintures`)
- ✅ Belt images with #06101f background blending
- ✅ 3 landscape images at bottom section
- ✅ Responsive 3-column layout

### Virtual Dojo (`/fr/aikido/dojo-virtuel`)
- ✅ Maître Tanaka AI assistant
- ✅ Adult-appropriate tone ("vouvoiement")
- ✅ Audio stops on modal close
- ✅ Voice interaction with OpenAI Whisper

## Technical Specifications

### Environment Variables
- `REACT_APP_BACKEND_URL`: Frontend API endpoint
- `MONGO_URL`: MongoDB connection string
- `DB_NAME`: Database name

### File Structure
```
/app/wayofdojo/
├── src/
│   ├── app/[locale]/[sport]/
│   │   ├── dojo/page.tsx
│   │   ├── techniques/page.tsx
│   │   ├── ceintures/page.tsx
│   │   └── dojo-virtuel/page.tsx
│   ├── components/
│   │   ├── adult-layout/
│   │   │   ├── AdultSidebar.tsx
│   │   │   ├── AdultHeader.tsx
│   │   │   ├── VertusSection.tsx
│   │   │   ├── TanakaHero.tsx
│   │   │   ├── MaProgression.tsx
│   │   │   └── QueFaireAujourdhui.tsx
│   │   └── ...
│   └── constants/
│       └── techniquesByKyu.ts
└── public/images/techniques/
    ├── mae-ukemi.png
    ├── ushiro-ukemi.png
    ├── yoko-ukemi.png
    ├── ikkyo.png
    ├── ikkyo-omote.png
    ├── ikkyo-ura.png
    ├── irimi-nage.png
    ├── shiho-nage.png
    ├── kokyu-ho.png
    ├── tai-sabaki.png
    └── shikko.png
```

## Test Credentials
- **Admin**: admin@wayofdojo.com / admin123
- **Adulte**: adulte@wayofdojo.fr / 123456
- **Enfant**: enfant@wayofdojo.fr / 123456

## Known Issues
- P2: Auth desync between Next.js API and FastAPI (some users can't login via Next.js API)
- Legacy SEO architecture needs update
- Minor ESLint warnings

## Completed Work (July 6, 2026)
- ✅ Integrated 11 technique illustrations from user-provided ZIP file
- ✅ Updated VertusSection with Japanese Kanji typography
- ✅ Fixed belt images background blending
- ✅ Updated Maître Tanaka to formal "vouvoiement" tone
- ✅ Audio stops on modal close

## Backlog
- P1: Responsive design verification (tablet/mobile)
- P2: Integrate remaining 47 technique illustrations (blocked - waiting for user files)
- P3: Advanced SEO (sitemap, robots.txt, JSON-LD)
- P3: Clean up temporary files (/proposition-*)
- P4: ESLint pass and supervisor standardization
