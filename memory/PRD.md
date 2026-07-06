# WayofDojo — Product Requirements Document

## 1. Vision
WayofDojo est une plateforme SaaS gamifiée d'apprentissage de l'Aïkido, combinant un système de progression par ceintures, un assistant vocal IA (Maître Tanaka), et des mini-jeux interactifs.

## 2. Architecture Technique
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Framer Motion
- **Backend**: FastAPI (Python)
- **Base de données**: MongoDB
- **Intégrations**: ElevenLabs TTS, OpenAI Whisper/GPT

## 3. Modes Utilisateurs
- **Mode Enfant (Petit Ninja)**: Tutoiement, design coloré
- **Mode Adulte (Samouraï Confirmé)**: Vouvoiement, design premium sombre

## 4. Structure des Pages (Mode Adulte)
```
/fr/aikido/
├── dojo           # Dashboard principal adulte
├── techniques     # Bibliothèque des techniques
├── ceintures      # Progression des grades
└── dojo-virtuel   # Mini-jeux interactifs
```

## 5. Fonctionnalités Complétées

### 5.1 Refonte UX/UI Mode Adulte (Juillet 2026)
- ✅ Layout 3 colonnes (Sidebar, Central, Notifications)
- ✅ Design premium sombre (#06101f)
- ✅ Sidebar avec profil utilisateur intégré
- ✅ Section "Ma progression de ceinture" avec image ceintures-progression.png
- ✅ Section "Les 7 vertus du Budo"
- ✅ Cartes "Que faire aujourd'hui" avec images personnalisées

### 5.2 Page Techniques
- ✅ Grille de techniques par catégorie
- ✅ Modales de détail avec descriptions
- ✅ Image pédagogique Ikkyo intégrée
- ✅ Remplacement vidéo par images

### 5.3 Page Ceintures
- ✅ Onglets (Mon parcours, Grades Kyu, Grades Dan, Comprendre)
- ✅ Images de ceintures individuelles avec fond #06101f
- ✅ 7 images générées (blanc, jaune, orange, vert, bleu, marron, noir)
- ✅ 3 images de fond personnalisées en bas de page

### 5.4 Textes Tanaka Mode Adulte
- ✅ Vouvoiement dans tous les messages
- ✅ "Votre Sensei personnel" au lieu de "Ton Sensei personnel"
- ✅ Messages Dojo Virtuel avec vouvoiement
- ✅ System prompt backend modifié
- ✅ TANAKA_MESSAGES_ADULT créé

## 6. Assets Images
```
/public/images/
├── belts/
│   ├── ceintures-progression.png   # Image principale progression
│   ├── 6e-kyu-white.png           # Ceinture blanche
│   ├── 5e-kyu-yellow.png          # Ceinture jaune
│   ├── 4e-kyu-orange.png          # Ceinture orange
│   ├── 3e-kyu-green.png           # Ceinture verte
│   ├── 2e-kyu-blue.png            # Ceinture bleue
│   ├── 1er-kyu-brown.png          # Ceinture marron
│   └── 1er-dan-black.png          # Ceinture noire
├── ceintures/
│   ├── castle-sunset.png          # Château japonais
│   ├── fuji-sunset.png            # Mont Fuji
│   └── street-sunset.png          # Rue traditionnelle
├── backgrounds/
│   └── dojo-virtuel-sunset.png    # Fond carte Dojo Virtuel
└── techniques/
    └── ikkyo.png                  # Animation pédagogique Ikkyo
```

## 7. Illustrations Techniques à Ajouter
58 techniques nécessitent encore une illustration pédagogique :
- Ukemi (5) : Mae, Ushiro, Yoko, Mae Debout, Tobu
- Tai Sabaki (3) : Irimi, Tenkan, Irimi Tenkan
- Techniques de base (7) : Nikyo, Sankyo, Yonkyo, Gokyo
- Projections (10) : Shiho Nage, Irimi Nage, Kote Gaeshi, etc.
- Saisies (8) : Katate Dori, Ryote Dori, etc.
- Attaques (7) : Shomen Uchi, Yokomen Uchi, etc.
- Et autres catégories...

## 8. Backlog
- P2: Correction désync auth Next.js vs FastAPI
- P3: SEO avancé (sitemap, robots.txt, JSON-LD)
- P3: Nettoyage fichiers temporaires /proposition-*
- P3: Configuration supervisor standardisée

## 9. Credentials Test
Voir /app/memory/test_credentials.md
