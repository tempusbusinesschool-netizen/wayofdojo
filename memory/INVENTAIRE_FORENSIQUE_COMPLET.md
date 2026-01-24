# 📋 INVENTAIRE FORENSIQUE COMPLET - AIKIDO@GAME

**Date d'inventaire** : 24 Janvier 2025  
**Méthode** : Recherche exhaustive et méthodique  
**Règle** : Aucune hypothèse - tout contenu retrouvé est listé et conservé

---

## 📊 STATISTIQUES GLOBALES

| Catégorie | Fichiers | Lignes de code |
|-----------|----------|----------------|
| **constants/** | 14 fichiers | 5 181 lignes |
| **components/** | 63 fichiers | 19 794 lignes |
| **pages/** | 14 fichiers | ~2 000 lignes |
| **services/** | 2 fichiers | ~400 lignes |
| **TOTAL** | **93 fichiers** | **~27 375 lignes** |

---

## 🎮 CATÉGORIE 1 : DONNÉES DE JEU (GAMEPLAY)

### 1.1 Système des 7 Vertus (`virtuesGamification.js` - 32 918 octets)

**Structure par vertu** :
| Vertu | Kanji | Romaji | Emoji | Animal Gardien | Couleurs |
|-------|-------|--------|-------|----------------|----------|
| Respect | 礼 | Rei | 🙏 | 🦁 Lion Noble | from-yellow-500 to-amber-500 |
| Courage | 勇 | Yūki | 💪 | 🐯 Tigre Brave | from-orange-500 to-red-500 |
| Maîtrise | 克 | Koku | 🧘 | 🐢 Tortue Zen | from-green-500 to-emerald-500 |
| Humilité | 謙 | Ken | 🌱 | 🐰 Lapin Humble | from-violet-500 to-purple-500 |
| Bienveillance | 仁 | Jin | 💝 | 🐼 Panda Gentil | from-blue-500 to-cyan-500 |
| Attention | 注 | Chū | 👁️ | 🦉 Hibou Vigilant | from-pink-500 to-rose-500 |
| Responsabilité | 責 | Seki | ⚖️ | 🦅 Aigle Royal | from-teal-500 to-emerald-500 |

**Évolutions des animaux gardiens (5 niveaux par vertu)** :
- Niveau 1 (0 XP) : Animal bébé (ex: 🦁 → 🦁 Lionceau)
- Niveau 2 (50 XP) : Animal jeune
- Niveau 3 (150 XP) : Animal adulte
- Niveau 4 (300 XP) : Animal maître
- Niveau 5 (500 XP) : Animal légendaire

**Défis quotidiens par vertu (5 par vertu = 35 défis)** :
| Vertu | Défi 1 | Défi 2 | Défi 3 | Défi 4 | Défi 5 |
|-------|--------|--------|--------|--------|--------|
| Respect | Saluer un adulte | Dire merci 5 fois | Ranger sa chambre | Écouter sans couper | Aider quelqu'un |
| Courage | Lever la main en classe | Essayer quelque chose de nouveau | Admettre une erreur | Parler à quelqu'un de nouveau | Défendre un ami |
| Maîtrise | Respirer 3x avant de réagir | Méditer 2 minutes | Attendre son tour | Finir une tâche difficile | Rester calme face à une critique |
| Humilité | Accepter une critique | Féliciter un camarade | Reconnaître ses limites | Demander de l'aide | Laisser quelqu'un passer devant |
| Bienveillance | Faire un compliment sincère | Partager quelque chose | Consoler quelqu'un | Inclure un enfant seul | Dire quelque chose de gentil |
| Attention | Observer 1 minute en silence | Écouter attentivement | Remarquer un détail | Regarder avant de parler | Se concentrer 5 minutes |
| Responsabilité | Tenir une promesse | Réparer une erreur | Prendre soin de quelque chose | Arriver à l'heure | Finir ce qu'on a commencé |

**Défis hebdomadaires (3 par vertu = 21 défis)** :
- Défis plus longs et plus complexes
- Récompenses supérieures (50-100 XP)

**Badges par vertu (4 par vertu = 28 badges)** :
- 🥉 Apprenti (10 points)
- 🥈 Initié (30 points)
- 🥇 Confirmé (60 points)
- 🏆 Expert (100 points)

**Messages d'encouragement (5 par vertu = 35 messages)** :
- Messages adaptés au niveau de progression

### 1.2 Système des Ceintures (`aikidoBelts.js` - 5 558 octets)

| Grade | Ceinture | Couleur Hex | Emoji | Points | Animal | Vertu | Message |
|-------|----------|-------------|-------|--------|--------|-------|---------|
| 6e Kyu | Blanche | #E5E7EB | ⚪ | 0 | 🪲 Petit Scarabée | Humilité | "Bienvenue sur le chemin..." |
| 5e Kyu | Jaune | #FCD34D | 🟡 | 10 | 🪲 Scarabée Doré | Respect | "Félicitations pour ta ceinture jaune..." |
| 4e Kyu | Orange | #FB923C | 🟠 | 20 | 🐯 Tigre Flamboyant | Courage | "Ta ceinture orange montre ta progression..." |
| 3e Kyu | Verte | #22C55E | 🟢 | 30 | 🐢 Tortue Sage | Bienveillance | "Ceinture verte ! Comme l'arbre..." |
| 2e Kyu | Bleue | #3B82F6 | 🔵 | 40 | 🐬 Dauphin Serein | Sincérité | "La ceinture bleue, comme le ciel infini..." |
| 1er Kyu | Marron | #92400E | 🟤 | 50 | 🦅 Aigle Royal | Honneur | "Ceinture marron ! Tu approches de la maîtrise..." |
| Shodan | Noire | #1F2937 | ⚫ | 100 | 🐉 Dragon Légendaire | Loyauté | "La ceinture noire ! Ce n'est pas la fin..." |

**Fonctions utilitaires** :
- `getBeltByPoints(points)` : Retourne la ceinture correspondante
- `getNextBelt(currentBelt)` : Retourne la prochaine ceinture
- `getBeltProgress(points)` : Calcule le pourcentage vers la prochaine ceinture

### 1.3 Techniques d'Aïkido (`aikidoTechniquesData.js` - 53 827 octets)

**TOTAL : 214+ techniques**

**Structure par technique** :
```javascript
{
  id: "ikkyo_omote",
  name: "Ikkyo Omote",
  category: "osae_waza", // Catégorie
  level: "6e_kyu",       // Grade requis
  description: "Première technique de contrôle...",
  keyPoints: ["Point 1", "Point 2"],
  commonMistakes: ["Erreur 1", "Erreur 2"],
  video: "/videos/techniques/ikkyo_omote.mp4",
  image: "/images/techniques/ikkyo_omote.jpg"
}
```

**Armes - JO (Bâton)** : 46 techniques
- Jo Suburi Tsuki (Piques) : 5 techniques
- Jo Suburi Uchi (Frappes) : 5 techniques
- Jo Suburi Combinés : 10 techniques
- Kumijo (avec partenaire) : 26 techniques

**Armes - BOKKEN (Sabre)** : 30+ techniques
- Suburi de base : 7 techniques
- Kumitachi : 23+ techniques

**Armes - TANTO (Couteau)** : 15+ techniques

**Techniques à mains nues** : 100+ techniques
- Osae Waza (Immobilisations) : Ikkyo, Nikyo, Sankyo, Yonkyo, Gokyo
- Nage Waza (Projections) : Shiho Nage, Irimi Nage, Kote Gaeshi, etc.

### 1.4 Combinaisons Techniques (`aikidoCombinaisons.js` - 81 081 octets)

**Structure d'une combinaison** :
```javascript
{
  id: "ahkd_ikkyo_omote",
  phase1: { attaque: "ai_hanmi_katate_dori", deplacement: "irimi" },
  phase2: { technique: "ikkyo", direction: "omote" },
  phase3: { final: "ikkyo_osae", type: "immobilisation" },
  kyu: "6e_kyu"
}
```

**Types d'attaques** :
- Ai Hanmi Katate Dori (saisie garde identique)
- Gyaku Hanmi Katate Dori (saisie garde inverse)
- Katate Dori (saisie d'un poignet)
- Shomen Uchi (frappe verticale)
- Yokomen Uchi (frappe latérale)
- Chudan Tsuki (coup au ventre)
- Jodan Tsuki (coup au visage)
- Ryote Dori (saisie deux poignets)
- Kata Dori (saisie épaule)
- Et bien d'autres...

### 1.5 Philosophie Aïkido (`aikidoPhilosophie.js` - 19 387 octets)

**Les 3 Phases Philosophiques** :
| Phase | Nom | Métaphore Enfant | Métaphore Adulte |
|-------|-----|------------------|------------------|
| 1 | La Rencontre | "Comme l'eau qui accueille..." | "L'instant de la rencontre..." |
| 2 | La Transformation | "Comme le tourbillon..." | "Le mouvement est dialogue..." |
| 3 | La Responsabilité | "Comme la cascade qui dépose..." | "Chaque technique est un choix..." |

**Philosophie des déplacements** :
| Déplacement | Essence | Tanaka Enfant | Tanaka Adulte |
|-------------|---------|---------------|---------------|
| Irimi | Entrer dans l'espace | "Irimi, c'est comme l'eau..." | "Irimi enseigne que la distance..." |
| Tenkan | Pivoter avec l'énergie | "Tenkan, c'est tourner..." | "Tenkan représente l'art de..." |
| Irimi Tenkan | Entrer puis pivoter | "Tu entres d'abord..." | "La combinaison irimi-tenkan..." |

**Philosophie des techniques** :
- Ikkyo, Nikyo, Sankyo, Yonkyo (contrôles progressifs)
- Shiho Nage (projection des 4 directions)
- Irimi Nage (projection par entrée)
- Kote Gaeshi (retournement de poignet)
- Kaiten Nage (projection tournante)
- Et chaque chute (Mae, Ushiro, Yoko, Tobi, Kaiten Ukemi)

**Synthèse Tanaka** :
- **Enfant** : "Jeune ninja, l'aïkido c'est comme apprendre à être de l'eau..."
- **Adulte** : "En aïkido, on ne combat pas l'autre. On apprend à bien se tenir..."

### 1.6 Passages de Grades (`passagesGrades.js` - 9 024 octets)

| Grade | Durée min | Heures | Objectifs | Techniques |
|-------|-----------|--------|-----------|------------|
| 6e Kyu | 3 mois | 30h | "Découvrir les bases..." | Ukemi, Tai Sabaki, Kamae + 8 techniques |
| 5e Kyu | 6 mois | 60h | "Consolider les fondamentaux..." | + 12 techniques |
| 4e Kyu | 1 an | 100h | "Développer la fluidité..." | + 16 techniques |
| 3e Kyu | 1.5 ans | 150h | "Approfondir la compréhension..." | + 20 techniques |
| 2e Kyu | 2 ans | 200h | "Affiner la pratique..." | + toutes techniques Kyu |
| 1er Kyu | 2.5 ans | 250h | "Préparer le passage Dan..." | + Armes |
| Shodan | 3 ans | 300h | "Premier grade de maîtrise..." | Programme complet |

### 1.7 Déplacements (`deplacementsData.js` - 1 761 octets)

**Tai Sabaki** (déplacements du corps) :
| Déplacement | Kanji | Description |
|-------------|-------|-------------|
| Irimi | 入り身 | Entrée directe dans l'espace de l'adversaire |
| Tenkan | 転換 | Pivot sur un pied pour rediriger l'énergie |
| Irimi Tenkan | 入り身転換 | Combinaison entrée + pivot |
| Kaiten | 回転 | Rotation complète du corps |
| Tsugi Ashi | 継ぎ足 | Pas glissés, pieds qui se suivent |

### 1.8 Règlement du Dojo (`reglementData.js` - 5 851 octets)

**Sections** :
1. Règles du tatami
2. Étiquette et comportement
3. Tenue vestimentaire
4. Respect de la hiérarchie
5. Sécurité et hygiène

### 1.9 Caractères Aïkido (`aikidoCharacters.js` - 2 733 octets)

**Illustrations/Images pour** :
- Enfants saluant (ENFANT_SALUT)
- Adultes en Seiza (ADULTE_SEIZA)
- Tanaka Avatar
- Animations diverses

### 1.10 Niveaux de Maîtrise (`masteryLevels.js` - 1 467 octets)

| Niveau | Nom | Icône | Couleur | XP Min |
|--------|-----|-------|---------|--------|
| 1 | Débutant | Circle | gray | 0 |
| 2 | Novice | BookOpen | green | 100 |
| 3 | Apprenti | Award | blue | 300 |
| 4 | Confirmé | Star | purple | 600 |
| 5 | Expert | Sparkles | orange | 1000 |
| 6 | Maître | Crown | amber | 2000 |
| 7 | Grand Maître | Flame | red | 5000 |
| 8 | Légende | Medal | gradient | 10000 |

---

## 🎤 CATÉGORIE 2 : NARRATION MAÎTRE TANAKA

### 2.1 Phrases Pré-enregistrées (`tanakaVoiceService.js` - 10 991 octets)

**TOTAL : 31 phrases avec fichiers audio**

| Catégorie | Clé | Texte complet |
|-----------|-----|---------------|
| **Bienvenue** | welcome | "Bienvenue dans mon dojo virtuel, jeune ninja ! Je suis Maître Tanaka, ton guide sur la Voie de l'Aïkido." |
| | hello_morning | "Ohayo gozaimasu, petit guerrier ! Que cette journée soit riche en apprentissages !" |
| | hello_afternoon | "Konnichiwa, jeune ninja ! Es-tu prêt pour ta pratique aujourd'hui ?" |
| | goodbye | "Sayonara, mon enfant. Continue de pratiquer avec cœur. À bientôt sur le tatami !" |
| **Défis** | challenge_complete | "Bravo, petit guerrier ! Tu as relevé ce défi avec brio ! Comme le bambou qui plie mais ne rompt jamais, tu montres une belle persévérance." |
| | challenge_first | "Ton premier défi est accompli ! C'est le premier pas sur un long chemin. Je suis fier de toi, jeune ninja !" |
| | challenge_hard | "Incroyable ! Ce défi était difficile, mais tu l'as surmonté ! Comme disait O-Sensei : La vraie victoire est celle sur soi-même." |
| **Ceintures** | belt_white | "Bienvenue sur le chemin de l'Aïkido, jeune débutant ! Ta ceinture blanche symbolise la pureté de ton esprit, prêt à apprendre." |
| | belt_yellow | "Félicitations pour ta ceinture jaune ! Comme le soleil levant, tu commences à briller. Continue ainsi, petit guerrier !" |
| | belt_orange | "Ta ceinture orange montre ta progression ! Comme la flamme, tu gagnes en intensité. Magnifique !" |
| | belt_green | "Ceinture verte ! Comme l'arbre qui grandit, tes racines dans l'Aïkido deviennent profondes. Je suis très fier de toi !" |
| | belt_blue | "La ceinture bleue, comme le ciel infini ! Tes possibilités sont sans limites maintenant. Continue à explorer la Voie !" |
| | belt_brown | "Ceinture marron ! Tu approches de la maîtrise. Comme la montagne, tu es solide et stable. Quel chemin parcouru !" |
| | belt_black | "La ceinture noire ! Ce n'est pas la fin, mais un nouveau commencement. Maintenant, le vrai apprentissage commence !" |
| **Séries** | streak_3 | "Trois jours consécutifs ! La régularité forge le caractère, jeune ninja. Continue ainsi !" |
| | streak_7 | "Une semaine complète de pratique ! Comme l'eau qui sculpte la pierre, ta persévérance porte ses fruits !" |
| | streak_14 | "Deux semaines sans relâche ! Tu montres un véritable esprit de Budoka. Ton dévouement m'impressionne, petit guerrier !" |
| | streak_21 | "Trois semaines de pratique ! Incroyable ! Comme disait O-Sensei : L'Aïkido n'est pas une technique, c'est une façon de vivre. Tu l'as compris !" |
| **Encouragements** | encourage_practice | "N'oublie pas, jeune ninja : la pratique quotidienne, même courte, vaut mieux qu'une longue séance occasionnelle." |
| | encourage_patience | "Patience, petit guerrier. La maîtrise vient avec le temps. Chaque erreur est un pas vers la perfection." |
| | encourage_comeback | "Te revoilà ! L'important n'est pas de tomber, mais de se relever. Je suis content de te revoir !" |
| **XP/Niveaux** | xp_gained | "Bien joué ! Tu gagnes de l'expérience. Chaque point te rapproche de la maîtrise !" |
| | level_up | "Tu montes de niveau ! Ton esprit grandit, ton corps s'améliore. Continue sur cette voie !" |
| **Technique** | technique_mastered | "Cette technique est maintenant gravée dans ton corps ! Comme le dit le proverbe : Pratique dix mille fois, et la technique devient naturelle." |
| **Échecs** | fail_encourage | "Ne t'inquiète pas, jeune ninja. L'échec est le meilleur professeur. Essaie encore, tu y arriveras !" |
| **Badges** | badge_earned | "Un nouveau badge ! Chaque badge raconte une partie de ton histoire. Collectionne-les avec fierté !" |
| **Étapes Parcours** | step_2_techniques | "Maintenant, passons aux techniques ! Chaque ceinture a ses propres mouvements à maîtriser. Commence par les bases : les déplacements et les chutes." |
| | step_3_dojo | "Bienvenue dans le Dojo Virtuel ! Ici, tu vas jouer à des jeux pour développer ton calme et ta concentration. Quand tu termines un jeu, tes parents diront si tout s'est bien passé." |
| | step_4_carnet | "Bienvenue dans Ma Pratique ! Après ton cours au dojo, reviens ici pour noter ce que tu as pratiqué. C'est ton carnet personnel. Ta parole compte, sois honnête avec toi-même !" |
| | step_4_validation | "Tes parents sont fiers de toi ! Demande-leur de valider tes efforts. Ils peuvent voir tout ce que tu as accompli !" |
| | step_5_progress | "Tu progresses vite ! Chaque point XP te rapproche de la prochaine ceinture. Continue comme ça et tu deviendras un vrai maître !" |
| | step_6_mastery | "Félicitations, jeune ninja ! Tu as parcouru tout le chemin de l'initiation ! Maintenant, ta véritable aventure commence. Vise le titre de Légende du Dojo !" |

---

## 🎮 CATÉGORIE 3 : DOJO VIRTUEL (11 Jeux)

### 3.1 Configuration des 10 Mini-Jeux

| # | ID | Nom | Sous-titre | Emoji | Durée | Âge | XP | Ki | Niveau |
|---|----|----|-----------|-------|-------|-----|----|----|--------|
| 1 | messager_ki | Le Messager du Ki | Gestion du stress | 🌊 | 3-5 min | 5-14 | 20 | 15 | 0 |
| 2 | parcours_souffle | Parcours du Souffle | Respiration consciente | 💨 | 2-4 min | 5-14 | 25 | 20 | 1 |
| 3 | sensei_invisible | Le Sensei Invisible | Écoute & attention | 👂 | 3-5 min | 6-14 | 30 | 25 | 2 |
| 4 | reflexe_pacifique | Réflexe Pacifique | Intelligence émotionnelle | 🧠 | 4-6 min | 7-14 | 35 | 30 | 3 |
| 5 | gardien_espace | Gardien de l'Espace | Maîtrise du Ma-ai | 🎯 | 3-5 min | 6-14 | 25 | 20 | 2 |
| 6 | miroir_harmonie | Miroir d'Harmonie | Synchronisation | 🪞 | 2-4 min | 5-12 | 20 | 15 | 0 |
| 7 | chemin_equilibre | Chemin de l'Équilibre | Posture & centre | ⚖️ | 3-5 min | 5-14 | 25 | 20 | 1 |
| 8 | memory_sensei | Memory du Sensei | Mémoire visuelle | 🎴 | 3-5 min | 5-12 | 20 | 15 | 1 |
| 9 | rythme_dojo | Rythme du Dojo | Tempo & fluidité | 🥁 | 2-4 min | 6-14 | 25 | 20 | 2 |
| 10 | quete_vertus | Quête des 7 Vertus | Valeurs du Budo | 🛡️ | 5-8 min | 7-14 | 50 | 40 | 4 |

**Compétences développées par jeu** :
- Messager du Ki : Calme, Patience, Anticipation
- Parcours du Souffle : Respiration, Concentration, Calme
- Sensei Invisible : Écoute, Attention, Confiance
- Réflexe Pacifique : Gestion émotions, Réflexion, Non-violence
- Gardien de l'Espace : Distance, Anticipation, Positionnement
- Miroir d'Harmonie : Imitation, Observation, Coordination
- Chemin de l'Équilibre : Équilibre, Posture, Centre
- Memory du Sensei : Mémoire, Concentration, Observation
- Rythme du Dojo : Rythme, Timing, Fluidité
- Quête des 7 Vertus : Éthique, Réflexion, Valeurs

**Fichiers des jeux** :
- `/components/VirtualDojo/games/MessagerDuKi.jsx`
- `/components/VirtualDojo/games/ParcoursduSouffle.jsx`
- `/components/VirtualDojo/games/SenseiInvisible.jsx`
- `/components/VirtualDojo/games/ReflexePacifique.jsx`
- `/components/VirtualDojo/games/GardienEspace.jsx`
- `/components/VirtualDojo/games/MiroirHarmonie.jsx`
- `/components/VirtualDojo/games/CheminEquilibre.jsx`
- `/components/VirtualDojo/games/MemorySensei.jsx`
- `/components/VirtualDojo/games/RythmeDuDojo.jsx`
- `/components/VirtualDojo/games/QueteVertus.jsx`

**Règles de validation** :
- ✅ Jeux numériques → **Parents valident**
- ✅ Exercices au dojo → **Auto-validation enfant** (basée sur l'honnêteté)
- ❌ Le sensei n'intervient PAS dans la validation numérique

---

## 🧭 CATÉGORIE 4 : PARCOURS GUIDÉ

### 4.1 Les 8 Blocs Visiteur (`VisitorStepsBlocks.jsx` - 964 lignes)

| # | Bloc | Emoji | But | Destination |
|---|------|-------|-----|-------------|
| 1 | Bienvenue | 👋 | Introduction avec Maître Tanaka | Tableau de bord |
| 2 | Mon Profil | 🥷 | Voir sa ceinture et stats | Section Profil |
| 3 | Les Défis | 🎯 | Découvrir les défis quotidiens | Section Défis/Points |
| 4 | Les 7 Vertus | ☯️ | Apprendre les valeurs du ninja | Section Vertus |
| 5 | Les Techniques | 🥋 | Voir les mouvements d'Aïkido | Section Entraînement |
| 6 | Les Ceintures | 🎖️ | Comprendre la progression de grade | Dialogue Ceintures |
| 7 | L'Histoire | 📜 | Découvrir O'Sensei et l'Aïkido | Section Histoire |
| 8 | Mes Trophées | 🏆 | Voir les badges à collectionner | Dialogue Trophées |

### 4.2 Parcours 6 Étapes Connecté (`JourneyPath.jsx` - 1015 lignes)

| # | ID | Étape | Emoji | Description | XP | Tanaka Audio |
|---|----|----|-------|-------------|----|--------------| 
| 1 | profile | Mon Profil | 🎭 | Crée ton Ninja | 10 | welcome |
| 2 | techniques | Mes Techniques | 📚 | Apprends les mouvements | 15 | step_2_techniques |
| 3 | dojo | Dojo Virtuel | 🎮 | Jeux & Validations | 20 | step_3_dojo |
| 4 | carnet | Ma Pratique | 🥋 | Mon Carnet de pratique | 20 | step_4_carnet |
| 5 | progress | Ma Progression | 🌟 | Ceintures & Vertus | 25 | step_5_progress |
| 6 | trophees | Mes Trophées | 🏆 | Deviens une Légende ! | 30 | step_6_mastery |

**Conditions de déverrouillage** : `step_X_completed`

**Mécanismes** :
- Introduction automatique de Tanaka à la première visite
- Demande du prénom de l'utilisateur
- Audio automatique à chaque étape
- Animation de transition sphère entre étapes
- Stockage localStorage : `aikido_journey_completed_steps`, `aikido_user_firstname`, `aikido_tanaka_intro_seen`

---

## 👨‍👩‍👧 CATÉGORIE 5 : ESPACES UTILISATEURS

### 5.1 Pages ENFANT (6 pages)

| Page | Fichier | Description | Contenu clé |
|------|---------|-------------|-------------|
| **Commence** | CommencePage.jsx | Création profil Ninja | 6 avatars (Dragon, Tigre, Aigle, Panda, Renard, Loup), pseudo, ceinture de départ |
| **Apprends** | ApprendsPage.jsx | Apprentissage techniques | Fiches techniques par niveau |
| **Entraîne** | EntrainePage.jsx | Sessions d'entraînement | Exercices guidés |
| **Valide** | ValidePage.jsx | Validation des acquis | Quiz et tests |
| **Progresse** | ProgressePage.jsx | Suivi progression | Stats, graphiques |
| **Maîtrise** | MaitrisePage.jsx | Niveau maîtrise | Badges, récompenses |

**Avatars enfants** :
- 🐉 Dragon (rouge/orange)
- 🐯 Tigre (ambre/jaune)
- 🦅 Aigle (bleu ciel)
- 🐼 Panda (gris/noir)
- 🦊 Renard (orange/rouge)
- 🐺 Loup (indigo/violet)

### 5.2 Pages ADULTE (6 pages)

| Page | Fichier | Description |
|------|---------|-------------|
| Inscription | InscriptionPage.jsx | Inscription adulte |
| Programme | ProgrammePage.jsx | Programme d'entraînement |
| Progression | ProgressionPage.jsx | Suivi progression adulte |
| Vertus | VertusPage.jsx | Les 7 vertus du Budo |
| Objectifs | ObjectifsPage.jsx | Définition objectifs |
| Certifications | CertificationsPage.jsx | Grades et certifications |

### 5.3 Dashboards (3 types)

| Dashboard | Fichier | Lignes | Description |
|-----------|---------|--------|-------------|
| **Parent** | ParentDashboard.jsx | 632 | Validation activités enfant, suivi progression, historique |
| **Enseignant** | EnseignantDashboard.jsx | 609 | Gestion élèves, validation cours |
| **Admin** | AdminDashboard.jsx | 746 | Gestion globale |

---

## 🔧 CATÉGORIE 6 : COMPOSANTS UI (63 fichiers)

### Composants principaux (par ordre de taille)

| Composant | Lignes | Description |
|-----------|--------|-------------|
| StatisticsDashboard.js | 1850 | Dashboard principal avec toutes les stats |
| JourneyPath.jsx | 1015 | Parcours guidé en 6 étapes |
| VisitorStepsBlocks.jsx | 964 | Les 8 blocs visiteur |
| AdminDashboard.jsx | 746 | Panel administrateur |
| ProgressionTunnel.jsx | 709 | Animation de progression |
| AdminLoginDialog.js | 646 | Dialogue connexion admin |
| DojoManagement.js | 637 | Gestion du dojo |
| ParentDashboard.jsx | 632 | Dashboard parent |
| EnseignantDashboard.jsx | 609 | Dashboard enseignant |
| ProfileOnboarding.jsx | 539 | Onboarding du profil |
| DojoLogbookDialog.jsx | 499 | Carnet de pratique |
| VirtuesGamification.jsx | 475 | Affichage des 7 vertus |
| TechniquesByKyuCards.jsx | 433 | Fiches techniques par grade |
| AgeSelector.jsx | 422 | Sélecteur d'âge enfant/adulte |
| VirtueActionsPanel.js | 393 | Actions des vertus |
| MaitreTanaka.jsx | 392 | Avatar animé de Tanaka |
| GuidedTour.jsx | 384 | Tour guidé de l'application |
| ... | ... | ... |

---

## ✅ TABLEAU DE CORRESPONDANCE FINAL

| Ancien emplacement | Contenu | Bloc cible | Statut |
|--------------------|---------|------------|--------|
| constants/virtuesGamification.js | 7 vertus + évolutions + défis | 4️⃣ VERTUS | ⚠️ PARTIEL |
| constants/aikidoBelts.js | 7 ceintures | 6️⃣ CEINTURES | ✅ MIGRÉ |
| constants/aikidoTechniquesData.js | 214+ techniques | 5️⃣ TECHNIQUES | ⚠️ PARTIEL |
| constants/aikidoCombinaisons.js | Combinaisons techniques | 5️⃣ TECHNIQUES | ❌ NON MIGRÉ |
| constants/aikidoPhilosophie.js | Philosophie enfant/adulte | 7️⃣ HISTOIRE | ❌ NON MIGRÉ |
| constants/passagesGrades.js | Programme par grade | 6️⃣ CEINTURES | ❌ NON MIGRÉ |
| constants/deplacementsData.js | Tai Sabaki | 5️⃣ TECHNIQUES | ❌ NON MIGRÉ |
| constants/reglementData.js | Règlement dojo | 7️⃣ HISTOIRE | ❌ NON MIGRÉ |
| services/tanakaVoiceService.js | 31 phrases Tanaka | TRANSVERSAL | ⚠️ PARTIEL |
| components/VirtualDojo/* | 10 jeux | 3️⃣ DÉFIS | ❌ NON MIGRÉ |
| pages/enfant/* | 6 pages enfant | TRANSVERSAL | ❌ NON MIGRÉ |
| pages/adulte/* | 6 pages adulte | TRANSVERSAL | ❌ NON MIGRÉ |
| components/JourneyPath.jsx | Parcours 6 étapes | TOUS | ❌ NON MIGRÉ |
| components/VisitorStepsBlocks.jsx | 8 blocs visiteur | TOUS | ⚠️ ORDRE INCORRECT |
| components/ParentDashboard.jsx | Espace parent | TRANSVERSAL | ❌ NON MIGRÉ |
| components/StatisticsDashboard.js | Dashboard principal | 2️⃣ PROFIL | ⚠️ PARTIEL |

---

## 📊 SYNTHÈSE FINALE

| Catégorie | Total éléments | Migrés ✅ | Partiels ⚠️ | Non migrés ❌ |
|-----------|---------------|-----------|-------------|---------------|
| Données de jeu | ~30 000 lignes | ~5 000 | ~10 000 | ~15 000 |
| Narration Tanaka | 31 phrases | 15 | 10 | 6 |
| Dojo Virtuel | 10 jeux | 0 | 0 | 10 |
| Pages utilisateurs | 12 pages | 0 | 0 | 12 |
| Parcours guidé | 2 systèmes | 0 | 1 | 1 |
| Composants UI | 63 composants | 5 | 10 | 48 |

**Taux de migration global estimé : ~15-20%**

---

## ⚠️ RÈGLE STRICTE

> **TOUT contenu listé ci-dessus est CONSERVÉ par défaut.**
> **AUCUNE suppression sans validation EXPLICITE.**
> **En cas de doute, le contenu est PRÉSUMÉ EXISTANT.**

---

**Document complet** : 24 Janvier 2025  
**Prochaine étape** : Validation avant toute implémentation
