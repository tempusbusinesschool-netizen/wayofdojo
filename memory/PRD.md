# AIKIDO@GAME - Product Requirements Document

## Original Problem Statement
Application web pour le club d'Aïkido "Aikido@Game" servant de référence digitale pour le programme d'entraînement, gestion des adhésions, et suivi de progression individuelle avec emphase sur la gamification et l'apprentissage philosophique.

## Core Requirements
1. **Gamification & Philosophie** : Motiver les utilisateurs via un parcours personnel avec système de points, intégration des principes philosophiques (Budō) guidés par Maître Tanaka
2. **Rôles utilisateur** : Pratiquant, Parent, Enseignant, Admin
3. **Validation stricte** : Modes Parent vs Auto-validation
4. **Expériences distinctes** : "Jeune Ninja" (enfants) et "Ninja Confirmé" (adultes/teens)
5. **Animations de techniques** : Illustrations animées avec placeholders pour vidéos futures
6. **Contrôle parental** : "Espace Parent" accessible uniquement avec compte Enfant actif
7. **Dashboard Admin** : Zone admin ergonomique avec structure hiérarchique des techniques

## Tech Stack
- Frontend: React + Tailwind CSS + Framer Motion + Shadcn/UI
- Backend: FastAPI (Python)
- Database: MongoDB
- Integrations: Stripe, ElevenLabs (TTS), Resend (emails)

## What's Been Implemented

### 2025-01-18 (Session actuelle)
- ✅ **Menu Admin unifié** : "Techniques Kyu" + "Grades Dan" → "Techniques d'Aikido" (141 techniques)
- ✅ **Affichage complet des 11 sections** avec données détaillées :
  - **Armes** : Jo (46), Bokken (24), Tanto (21) 
  - **Mouvements** : Tai Sabaki (10), Ukemi (9), Kamae (8), Atemi (9), Kokyu Waza (6), Kansetsu Waza (10), Suwariwaza (10), Hanmi Handachi (8)
- ✅ **161 techniques/mouvements** avec niveau de détail approfondi incluant :
  - Noms japonais (漢字) et traductions
  - Descriptions complètes
  - Points clés d'exécution (section verte)
  - Erreurs courantes à éviter (section orange)
  - Niveaux requis (6ème Kyu → 4ème Dan)
  - Catégorisation hiérarchique

### Nouveaux fichiers créés
- `/app/frontend/src/components/admin/TechniquesSectionViewer.jsx` - Composant d'affichage unifié
- `/app/frontend/src/constants/aikidoTechniquesData.js` - **2000+ lignes** de données détaillées

### Précédent
- ✅ Structure hiérarchique fichiers sous `/app/Sports/Aikido/`
- ✅ Menu sidebar récursif avec navigation multi-niveaux
- ✅ Fil d'Ariane dynamique dans admin
- ✅ Section "Passages de Grades" créée

## Récapitulatif des techniques

| Catégorie | Nombre |
|-----------|--------|
| Jo (Bâton) | 46 |
| Bokken (Sabre) | 24 |
| Tanto (Couteau) | 21 |
| Tai Sabaki (Déplacements) | 10 |
| Ukemi (Chutes) | 9 |
| Kamae (Postures) | 8 |
| Atemi (Frappes) | 9 |
| Kokyu Waza (Respiration) | 6 |
| Kansetsu Waza (Clés) | 10 |
| Suwariwaza (À genoux) | 10 |
| Hanmi Handachi (Semi-debout) | 8 |
| **TOTAL** | **161** |

## Prioritized Backlog

### P1 (High)
- Implémenter filtres niveau Dan dans `CombinaisonsPage.jsx` pour l'affichage utilisateur
- Fonction "Retour à la première étape" dans parcours utilisateur
- Analyse globale et nettoyage du code

### P2 (Medium)
- Prototyper plus d'animations de techniques
- Différencier "Zone Adultes" avec UX moins gamifié
- Section clés API production dans admin

### P3 (Low)
- Corriger erreurs lint dans `StatisticsDashboard.js`
- Nouveaux blocs "Les différentes techniques" et "Défis collectifs"
- 2FA pour Super Admin

## Key Files
- `/app/frontend/src/components/AdminDashboard.jsx` - Menu sidebar hiérarchique
- `/app/frontend/src/components/admin/TechniquesSectionViewer.jsx` - Affichage des techniques
- `/app/frontend/src/constants/aikidoTechniquesData.js` - Données complètes des 161 techniques
- `/app/frontend/src/App.js` - Routage et logique admin

## Test Credentials
| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Enfant | bill@gmail.com | 123 |
| Parent | parent@gmail.com | parent123 |
| Admin | - | aikido2024 |

## Project Status
- **Broken**: NO
- **Mocked**: NO
- **Testing**: Screenshots confirmant le bon fonctionnement
