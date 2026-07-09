/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * WAYOFDOJO - QUIZ DE CONNAISSANCES PAR GRADE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Questions théoriques pour valider les connaissances avant chaque passage de grade.
 * Catégories: Vocabulaire japonais, Histoire, Étiquette (Reishiki), Techniques
 * 
 * ⚠️ DONNÉES VERROUILLÉES - Programme officiel FFAAA
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index de la bonne réponse
  explanation: string;
  category: 'vocabulaire' | 'histoire' | 'etiquette' | 'techniques' | 'philosophie';
  difficulty: 'facile' | 'moyen' | 'difficile';
  points: number;
}

export interface QuizGrade {
  gradeId: string;
  gradeName: string;
  description: string;
  passingScore: number; // Pourcentage minimum pour réussir
  questions: QuizQuestion[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ 6E KYU - Débutant (Ceinture Blanche)
// ═══════════════════════════════════════════════════════════════════════════════
export const QUIZ_6E_KYU: QuizGrade = {
  gradeId: '6e_kyu',
  gradeName: '6e Kyu - Rokkyu',
  description: 'Quiz de base sur l\'étiquette du dojo, le vocabulaire fondamental et les premières techniques.',
  passingScore: 70,
  questions: [
    // ÉTIQUETTE
    {
      id: '6k_1',
      question: 'Comment appelle-t-on le salut traditionnel en Aïkido ?',
      options: ['Reishiki', 'Rei', 'Seiza', 'Kamae'],
      correctAnswer: 1,
      explanation: '"Rei" (礼) signifie le salut. "Reishiki" est l\'ensemble des règles d\'étiquette.',
      category: 'etiquette',
      difficulty: 'facile',
      points: 10
    },
    {
      id: '6k_2',
      question: 'Quelle est la position assise traditionnelle sur le tatami ?',
      options: ['Tachi Waza', 'Seiza', 'Hanmi', 'Ukemi'],
      correctAnswer: 1,
      explanation: 'Seiza (正座) est la position assise traditionnelle japonaise, genoux au sol.',
      category: 'etiquette',
      difficulty: 'facile',
      points: 10
    },
    {
      id: '6k_3',
      question: 'Comment s\'appelle le fondateur de l\'Aïkido ?',
      options: ['Jigoro Kano', 'Morihei Ueshiba', 'Gichin Funakoshi', 'Miyamoto Musashi'],
      correctAnswer: 1,
      explanation: 'Morihei Ueshiba (1883-1969), appelé O\'Sensei (Grand Maître), est le fondateur de l\'Aïkido.',
      category: 'histoire',
      difficulty: 'facile',
      points: 10
    },
    // VOCABULAIRE
    {
      id: '6k_4',
      question: 'Que signifie "Ukemi" ?',
      options: ['Technique de projection', 'Chute', 'Déplacement', 'Posture'],
      correctAnswer: 1,
      explanation: 'Ukemi (受身) signifie "recevoir avec le corps" - ce sont les techniques de chute.',
      category: 'vocabulaire',
      difficulty: 'facile',
      points: 10
    },
    {
      id: '6k_5',
      question: 'Que signifie "Tatami" ?',
      options: ['Le kimono', 'Le tapis d\'entraînement', 'La ceinture', 'L\'enseignant'],
      correctAnswer: 1,
      explanation: 'Le tatami est le tapis traditionnel japonais utilisé pour la pratique des arts martiaux.',
      category: 'vocabulaire',
      difficulty: 'facile',
      points: 10
    },
    {
      id: '6k_6',
      question: 'Comment appelle-t-on l\'entrée directe vers le partenaire ?',
      options: ['Tenkan', 'Irimi', 'Kaiten', 'Omote'],
      correctAnswer: 1,
      explanation: 'Irimi (入身) signifie "entrer avec le corps" - c\'est l\'entrée directe vers l\'adversaire.',
      category: 'techniques',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '6k_7',
      question: 'Que signifie "Tenkan" ?',
      options: ['Avancer', 'Tourner/Pivoter', 'Reculer', 'Sauter'],
      correctAnswer: 1,
      explanation: 'Tenkan (転換) signifie "tourner" ou "pivoter" - rotation du corps sur place.',
      category: 'techniques',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '6k_8',
      question: 'Comment s\'appelle la chute avant roulée ?',
      options: ['Ushiro Ukemi', 'Mae Ukemi', 'Zenpo Kaiten Ukemi', 'Yoko Ukemi'],
      correctAnswer: 2,
      explanation: 'Zenpo Kaiten Ukemi (前方回転受身) est la chute avant roulée (rotation vers l\'avant).',
      category: 'techniques',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '6k_9',
      question: 'Que signifie le mot "Aïkido" ?',
      options: [
        'La voie du combat', 
        'La voie de l\'harmonie avec l\'énergie', 
        'L\'art de la guerre', 
        'La voie du sabre'
      ],
      correctAnswer: 1,
      explanation: 'Aïkido (合気道) = Ai (harmonie) + Ki (énergie) + Do (voie) = La voie de l\'harmonie avec l\'énergie.',
      category: 'philosophie',
      difficulty: 'facile',
      points: 10
    },
    {
      id: '6k_10',
      question: 'Comment appelle-t-on la posture de garde en Aïkido ?',
      options: ['Seiza', 'Kamae', 'Ukemi', 'Waza'],
      correctAnswer: 1,
      explanation: 'Kamae (構え) désigne la posture ou garde de base en Aïkido.',
      category: 'vocabulaire',
      difficulty: 'facile',
      points: 10
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ 5E KYU - Ceinture Jaune
// ═══════════════════════════════════════════════════════════════════════════════
export const QUIZ_5E_KYU: QuizGrade = {
  gradeId: '5e_kyu',
  gradeName: '5e Kyu - Gokyu',
  description: 'Quiz sur les techniques de base, les saisies et les projections fondamentales.',
  passingScore: 70,
  questions: [
    {
      id: '5k_1',
      question: 'Que signifie "Katate Dori" ?',
      options: ['Saisie à deux mains', 'Saisie du poignet', 'Saisie du col', 'Frappe au visage'],
      correctAnswer: 1,
      explanation: 'Katate Dori (片手取り) = saisie d\'une main (du poignet).',
      category: 'vocabulaire',
      difficulty: 'facile',
      points: 10
    },
    {
      id: '5k_2',
      question: 'Que signifie "Ikkyo" ?',
      options: ['Première technique', 'Deuxième technique', 'Projection', 'Immobilisation'],
      correctAnswer: 0,
      explanation: 'Ikkyo (一教) signifie "première technique/enseignement" - contrôle du coude.',
      category: 'techniques',
      difficulty: 'facile',
      points: 10
    },
    {
      id: '5k_3',
      question: 'Quelle est la différence entre "Omote" et "Ura" ?',
      options: [
        'Debout et assis',
        'Devant (positif) et Derrière (négatif)',
        'Rapide et lent',
        'Fort et faible'
      ],
      correctAnswer: 1,
      explanation: 'Omote (表) = face avant, Ura (裏) = face arrière. Indique le côté de l\'exécution.',
      category: 'vocabulaire',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '5k_4',
      question: 'Comment s\'appelle la projection dans les 4 directions ?',
      options: ['Irimi Nage', 'Shiho Nage', 'Kote Gaeshi', 'Kaiten Nage'],
      correctAnswer: 1,
      explanation: 'Shiho Nage (四方投げ) = projection dans les 4 directions.',
      category: 'techniques',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '5k_5',
      question: 'Que signifie "Ai Hanmi" ?',
      options: [
        'Garde opposée',
        'Garde identique (même pied avancé)',
        'Position assise',
        'Position de frappe'
      ],
      correctAnswer: 1,
      explanation: 'Ai Hanmi (相半身) = même garde (les deux partenaires ont le même pied avancé).',
      category: 'vocabulaire',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '5k_6',
      question: 'Que signifie "Gyaku Hanmi" ?',
      options: [
        'Garde identique',
        'Garde inversée (pieds opposés)',
        'Position debout',
        'Position de garde haute'
      ],
      correctAnswer: 1,
      explanation: 'Gyaku Hanmi (逆半身) = garde opposée/inversée (pieds différents avancés).',
      category: 'vocabulaire',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '5k_7',
      question: 'Quel est le nom japonais de la technique "entrée et projection" ?',
      options: ['Shiho Nage', 'Irimi Nage', 'Kote Gaeshi', 'Nikyo'],
      correctAnswer: 1,
      explanation: 'Irimi Nage (入身投げ) = projection par entrée directe.',
      category: 'techniques',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '5k_8',
      question: 'Comment appelle-t-on celui qui reçoit la technique ?',
      options: ['Tori', 'Uke', 'Sensei', 'Sempai'],
      correctAnswer: 1,
      explanation: 'Uke (受け) est celui qui reçoit/subit la technique. Tori (取り) est celui qui l\'exécute.',
      category: 'vocabulaire',
      difficulty: 'facile',
      points: 10
    },
    {
      id: '5k_9',
      question: 'Que signifie "Nage" dans les noms de techniques ?',
      options: ['Immobilisation', 'Projection', 'Contrôle', 'Frappe'],
      correctAnswer: 1,
      explanation: 'Nage (投げ) signifie "projection" ou "lancer".',
      category: 'vocabulaire',
      difficulty: 'facile',
      points: 10
    },
    {
      id: '5k_10',
      question: 'Quelle partie du corps contrôle-t-on avec Ikkyo ?',
      options: ['Le poignet', 'Le coude', 'L\'épaule', 'La tête'],
      correctAnswer: 1,
      explanation: 'Ikkyo contrôle principalement le coude pour amener Uke au sol.',
      category: 'techniques',
      difficulty: 'moyen',
      points: 15
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ 4E KYU - Ceinture Orange
// ═══════════════════════════════════════════════════════════════════════════════
export const QUIZ_4E_KYU: QuizGrade = {
  gradeId: '4e_kyu',
  gradeName: '4e Kyu - Yonkyu',
  description: 'Quiz sur les techniques intermédiaires, les immobilisations et les variations.',
  passingScore: 75,
  questions: [
    {
      id: '4k_1',
      question: 'Que signifie "Nikyo" ?',
      options: ['Première technique', 'Deuxième technique', 'Troisième technique', 'Quatrième technique'],
      correctAnswer: 1,
      explanation: 'Nikyo (二教) = deuxième enseignement - contrôle par torsion du poignet.',
      category: 'techniques',
      difficulty: 'facile',
      points: 10
    },
    {
      id: '4k_2',
      question: 'Comment s\'appelle le retournement de poignet vers l\'extérieur ?',
      options: ['Nikyo', 'Sankyo', 'Kote Gaeshi', 'Yonkyo'],
      correctAnswer: 2,
      explanation: 'Kote Gaeshi (小手返し) = retournement du poignet vers l\'extérieur.',
      category: 'techniques',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '4k_3',
      question: 'Que signifie "Sankyo" ?',
      options: ['Deuxième enseignement', 'Troisième enseignement', 'Quatrième enseignement', 'Cinquième enseignement'],
      correctAnswer: 1,
      explanation: 'Sankyo (三教) = troisième enseignement - torsion du poignet en spirale.',
      category: 'techniques',
      difficulty: 'facile',
      points: 10
    },
    {
      id: '4k_4',
      question: 'Comment appelle-t-on la pratique à genoux ?',
      options: ['Tachi Waza', 'Suwari Waza', 'Hanmi Handachi', 'Tanto Dori'],
      correctAnswer: 1,
      explanation: 'Suwari Waza (座り技) = techniques à genoux (assis).',
      category: 'vocabulaire',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '4k_5',
      question: 'Que signifie "Yokomen Uchi" ?',
      options: [
        'Frappe directe à la tête',
        'Frappe latérale à la tempe',
        'Coup de poing au ventre',
        'Saisie du col'
      ],
      correctAnswer: 1,
      explanation: 'Yokomen Uchi (横面打ち) = frappe latérale au côté de la tête/tempe.',
      category: 'vocabulaire',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '4k_6',
      question: 'Que signifie "Shomen Uchi" ?',
      options: [
        'Frappe latérale',
        'Frappe directe verticale à la tête',
        'Coup de pied',
        'Saisie à deux mains'
      ],
      correctAnswer: 1,
      explanation: 'Shomen Uchi (正面打ち) = frappe directe verticale au sommet de la tête.',
      category: 'vocabulaire',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '4k_7',
      question: 'Comment s\'appelle la projection par rotation ?',
      options: ['Irimi Nage', 'Kaiten Nage', 'Shiho Nage', 'Koshi Nage'],
      correctAnswer: 1,
      explanation: 'Kaiten Nage (回転投げ) = projection par rotation/tournoiement.',
      category: 'techniques',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '4k_8',
      question: 'Que signifie "Kokyu" ?',
      options: ['Technique', 'Respiration/Souffle', 'Projection', 'Frappe'],
      correctAnswer: 1,
      explanation: 'Kokyu (呼吸) = respiration/souffle - élément fondamental de l\'Aïkido.',
      category: 'philosophie',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '4k_9',
      question: 'Comment appelle-t-on la saisie des deux poignets ?',
      options: ['Katate Dori', 'Ryote Dori', 'Morote Dori', 'Ushiro Ryote Dori'],
      correctAnswer: 1,
      explanation: 'Ryote Dori (両手取り) = saisie des deux mains/poignets.',
      category: 'vocabulaire',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '4k_10',
      question: 'Quelle est la philosophie centrale de l\'Aïkido selon O\'Sensei ?',
      options: [
        'Vaincre l\'adversaire à tout prix',
        'L\'harmonie et la non-violence',
        'La compétition sportive',
        'La force physique'
      ],
      correctAnswer: 1,
      explanation: 'O\'Sensei a créé l\'Aïkido comme un art de paix, basé sur l\'harmonie et non la destruction.',
      category: 'philosophie',
      difficulty: 'facile',
      points: 10
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ 3E KYU - Ceinture Verte
// ═══════════════════════════════════════════════════════════════════════════════
export const QUIZ_3E_KYU: QuizGrade = {
  gradeId: '3e_kyu',
  gradeName: '3e Kyu - Sankyu',
  description: 'Quiz approfondi sur les techniques avancées, les armes et la philosophie.',
  passingScore: 75,
  questions: [
    {
      id: '3k_1',
      question: 'Que signifie "Yonkyo" ?',
      options: ['Troisième enseignement', 'Quatrième enseignement', 'Cinquième enseignement', 'Premier enseignement'],
      correctAnswer: 1,
      explanation: 'Yonkyo (四教) = quatrième enseignement - pression sur le nerf du poignet.',
      category: 'techniques',
      difficulty: 'facile',
      points: 10
    },
    {
      id: '3k_2',
      question: 'Comment s\'appelle le bâton court utilisé en Aïkido ?',
      options: ['Bokken', 'Jo', 'Tanto', 'Naginata'],
      correctAnswer: 1,
      explanation: 'Le Jo (杖) est le bâton d\'environ 128 cm utilisé en Aïkido.',
      category: 'vocabulaire',
      difficulty: 'facile',
      points: 10
    },
    {
      id: '3k_3',
      question: 'Que signifie "Bokken" ?',
      options: ['Bâton court', 'Sabre en bois', 'Couteau', 'Lance'],
      correctAnswer: 1,
      explanation: 'Bokken (木剣) = sabre en bois, réplique du katana pour l\'entraînement.',
      category: 'vocabulaire',
      difficulty: 'facile',
      points: 10
    },
    {
      id: '3k_4',
      question: 'Que signifie "Tanto" ?',
      options: ['Sabre long', 'Couteau/Poignard', 'Bâton', 'Hallebarde'],
      correctAnswer: 1,
      explanation: 'Tanto (短刀) = couteau court / poignard traditionnel japonais.',
      category: 'vocabulaire',
      difficulty: 'facile',
      points: 10
    },
    {
      id: '3k_5',
      question: 'Comment appelle-t-on les techniques de défense contre le couteau ?',
      options: ['Jo Dori', 'Tanto Dori', 'Tachi Dori', 'Bokken Dori'],
      correctAnswer: 1,
      explanation: 'Tanto Dori (短刀取り) = techniques de défense contre attaques au couteau.',
      category: 'techniques',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '3k_6',
      question: 'Que signifie "Ushiro" dans les noms d\'attaques ?',
      options: ['Devant', 'Côté', 'Derrière', 'Dessus'],
      correctAnswer: 2,
      explanation: 'Ushiro (後ろ) = derrière/arrière. Ex: Ushiro Ryote Dori = saisie des deux mains par derrière.',
      category: 'vocabulaire',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '3k_7',
      question: 'Comment s\'appelle la pratique debout/assis ?',
      options: ['Suwari Waza', 'Tachi Waza', 'Hanmi Handachi', 'Jiyu Waza'],
      correctAnswer: 2,
      explanation: 'Hanmi Handachi (半身半立) = Tori à genoux, Uke debout.',
      category: 'vocabulaire',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '3k_8',
      question: 'Que signifie "Gokyo" ?',
      options: ['Quatrième enseignement', 'Cinquième enseignement', 'Sixième enseignement', 'Premier enseignement'],
      correctAnswer: 1,
      explanation: 'Gokyo (五教) = cinquième enseignement - utilisé notamment contre les attaques au couteau.',
      category: 'techniques',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '3k_9',
      question: 'Comment appelle-t-on le travail libre sans forme imposée ?',
      options: ['Kata', 'Jiyu Waza', 'Kihon', 'Suburi'],
      correctAnswer: 1,
      explanation: 'Jiyu Waza (自由技) = techniques libres, pratique sans forme préétablie.',
      category: 'vocabulaire',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '3k_10',
      question: 'Quel est le dojo historique fondé par O\'Sensei à Tokyo ?',
      options: ['Kodokan', 'Aikikai Hombu Dojo', 'Shotokan', 'Butokuden'],
      correctAnswer: 1,
      explanation: 'L\'Aikikai Hombu Dojo (合気会本部道場) est le dojo central mondial de l\'Aïkido, à Tokyo.',
      category: 'histoire',
      difficulty: 'difficile',
      points: 20
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ 2E KYU - Ceinture Bleue
// ═══════════════════════════════════════════════════════════════════════════════
export const QUIZ_2E_KYU: QuizGrade = {
  gradeId: '2e_kyu',
  gradeName: '2e Kyu - Nikyu',
  description: 'Quiz avancé sur les variations, les contres et l\'histoire approfondie.',
  passingScore: 80,
  questions: [
    {
      id: '2k_1',
      question: 'Comment s\'appelle la projection par la hanche ?',
      options: ['Irimi Nage', 'Koshi Nage', 'Kaiten Nage', 'Tenchi Nage'],
      correctAnswer: 1,
      explanation: 'Koshi Nage (腰投げ) = projection de hanche.',
      category: 'techniques',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '2k_2',
      question: 'Que signifie "Tenchi Nage" ?',
      options: [
        'Projection de hanche',
        'Projection ciel-terre',
        'Projection en rotation',
        'Projection par entrée'
      ],
      correctAnswer: 1,
      explanation: 'Tenchi Nage (天地投げ) = projection ciel-terre (Ten=ciel, Chi=terre).',
      category: 'techniques',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '2k_3',
      question: 'Qui est le fils de O\'Sensei qui a dirigé l\'Aikikai ?',
      options: ['Koichi Tohei', 'Kisshomaru Ueshiba', 'Gozo Shioda', 'Morihiro Saito'],
      correctAnswer: 1,
      explanation: 'Kisshomaru Ueshiba (1921-1999), fils de O\'Sensei, fut le 2e Doshu de l\'Aikikai.',
      category: 'histoire',
      difficulty: 'difficile',
      points: 20
    },
    {
      id: '2k_4',
      question: 'Comment appelle-t-on les exercices de coupe au sabre en solo ?',
      options: ['Kumitachi', 'Suburi', 'Kata', 'Randori'],
      correctAnswer: 1,
      explanation: 'Suburi (素振り) = exercices de coupe/frappe en solo avec le bokken ou le jo.',
      category: 'vocabulaire',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '2k_5',
      question: 'Que signifie "Kaeshi Waza" ?',
      options: ['Techniques de base', 'Techniques de contre', 'Techniques libres', 'Techniques à genoux'],
      correctAnswer: 1,
      explanation: 'Kaeshi Waza (返し技) = techniques de contre/renversement.',
      category: 'vocabulaire',
      difficulty: 'difficile',
      points: 20
    },
    {
      id: '2k_6',
      question: 'Comment s\'appelle l\'exercice respiratoire fondamental ?',
      options: ['Suburi', 'Kokyu Ho', 'Tai Sabaki', 'Ukemi'],
      correctAnswer: 1,
      explanation: 'Kokyu Ho (呼吸法) = méthode de respiration, exercice fondamental assis.',
      category: 'techniques',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '2k_7',
      question: 'Que signifie "Morote Dori" ?',
      options: [
        'Saisie d\'une main',
        'Saisie du poignet à deux mains',
        'Saisie par derrière',
        'Saisie du col'
      ],
      correctAnswer: 1,
      explanation: 'Morote Dori (諸手取り) = saisie d\'un poignet à deux mains.',
      category: 'vocabulaire',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '2k_8',
      question: 'Comment s\'appellent les kata de sabre à deux ?',
      options: ['Suburi', 'Kumitachi', 'Bokken Dori', 'Iaido'],
      correctAnswer: 1,
      explanation: 'Kumitachi (組太刀) = formes de sabre à deux partenaires.',
      category: 'vocabulaire',
      difficulty: 'difficile',
      points: 20
    },
    {
      id: '2k_9',
      question: 'Quelle est l\'année de création officielle de l\'Aïkido ?',
      options: ['1920', '1942', '1960', '1883'],
      correctAnswer: 1,
      explanation: 'Le nom "Aïkido" a été officiellement adopté en 1942.',
      category: 'histoire',
      difficulty: 'difficile',
      points: 20
    },
    {
      id: '2k_10',
      question: 'Que signifie "Randori" ?',
      options: [
        'Pratique formelle',
        'Pratique libre avec plusieurs attaquants',
        'Pratique à genoux',
        'Pratique des armes'
      ],
      correctAnswer: 1,
      explanation: 'Randori (乱取り) = pratique libre face à plusieurs attaquants.',
      category: 'vocabulaire',
      difficulty: 'moyen',
      points: 15
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ 1ER KYU - Ceinture Marron
// ═══════════════════════════════════════════════════════════════════════════════
export const QUIZ_1ER_KYU: QuizGrade = {
  gradeId: '1er_kyu',
  gradeName: '1er Kyu - Ikkyu',
  description: 'Quiz expert préparatoire au passage de la ceinture noire.',
  passingScore: 85,
  questions: [
    {
      id: '1k_1',
      question: 'Que signifie "Doshu" ?',
      options: [
        'Grand Maître',
        'Maître de la Voie (chef héréditaire)',
        'Professeur senior',
        'Fondateur'
      ],
      correctAnswer: 1,
      explanation: 'Doshu (道主) = "Maître de la Voie", titre héréditaire du chef de l\'Aikikai.',
      category: 'vocabulaire',
      difficulty: 'difficile',
      points: 20
    },
    {
      id: '1k_2',
      question: 'Qui est l\'actuel Doshu (3e) de l\'Aïkido ?',
      options: ['Kisshomaru Ueshiba', 'Moriteru Ueshiba', 'Morihei Ueshiba', 'Koichi Tohei'],
      correctAnswer: 1,
      explanation: 'Moriteru Ueshiba (né en 1951) est le 3e Doshu, petit-fils de O\'Sensei.',
      category: 'histoire',
      difficulty: 'difficile',
      points: 20
    },
    {
      id: '1k_3',
      question: 'Quel art martial ancestral a principalement influencé l\'Aïkido ?',
      options: ['Judo', 'Karaté', 'Daito-ryu Aiki-jujutsu', 'Kendo'],
      correctAnswer: 2,
      explanation: 'O\'Sensei a étudié le Daito-ryu Aiki-jujutsu sous Sokaku Takeda avant de créer l\'Aïkido.',
      category: 'histoire',
      difficulty: 'difficile',
      points: 20
    },
    {
      id: '1k_4',
      question: 'Que signifie "Kuzushi" ?',
      options: ['Projection', 'Déséquilibre', 'Contrôle', 'Frappe'],
      correctAnswer: 1,
      explanation: 'Kuzushi (崩し) = déséquilibre, principe fondamental pour toute technique.',
      category: 'vocabulaire',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '1k_5',
      question: 'Que signifie "Zanshin" ?',
      options: [
        'Relaxation',
        'Vigilance maintenue après la technique',
        'Concentration avant l\'attaque',
        'Position finale'
      ],
      correctAnswer: 1,
      explanation: 'Zanshin (残心) = esprit persistant, vigilance maintenue après l\'exécution.',
      category: 'philosophie',
      difficulty: 'difficile',
      points: 20
    },
    {
      id: '1k_6',
      question: 'Que signifie "Maai" ?',
      options: ['Timing', 'Distance correcte', 'Posture', 'Respiration'],
      correctAnswer: 1,
      explanation: 'Maai (間合い) = distance correcte / intervalle spatial avec le partenaire.',
      category: 'vocabulaire',
      difficulty: 'moyen',
      points: 15
    },
    {
      id: '1k_7',
      question: 'Comment s\'appelle le lieu où O\'Sensei s\'est retiré ?',
      options: ['Tokyo', 'Osaka', 'Iwama', 'Kyoto'],
      correctAnswer: 2,
      explanation: 'O\'Sensei s\'est retiré à Iwama où il a approfondi sa pratique et développé le travail des armes.',
      category: 'histoire',
      difficulty: 'difficile',
      points: 20
    },
    {
      id: '1k_8',
      question: 'Que signifie "Musubi" ?',
      options: ['Séparation', 'Connexion/Union', 'Technique', 'Position'],
      correctAnswer: 1,
      explanation: 'Musubi (結び) = connexion, union - concept d\'harmonisation avec le partenaire.',
      category: 'philosophie',
      difficulty: 'difficile',
      points: 20
    },
    {
      id: '1k_9',
      question: 'Que signifie "Awase" ?',
      options: ['Opposition', 'Harmonisation / Accord', 'Résistance', 'Force'],
      correctAnswer: 1,
      explanation: 'Awase (合わせ) = harmonisation, accord - s\'accorder au mouvement du partenaire.',
      category: 'philosophie',
      difficulty: 'difficile',
      points: 20
    },
    {
      id: '1k_10',
      question: 'Quel est le principe spirituel central enseigné par O\'Sensei ?',
      options: [
        'La destruction de l\'ennemi',
        'L\'amour universel (Ai)',
        'La domination',
        'La compétition'
      ],
      correctAnswer: 1,
      explanation: 'O\'Sensei enseignait que l\'Aïkido est l\'expression de l\'amour universel et de la protection de toute vie.',
      category: 'philosophie',
      difficulty: 'moyen',
      points: 15
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT DES QUIZ PAR GRADE
// ═══════════════════════════════════════════════════════════════════════════════
export const QUIZ_BY_GRADE: Record<string, QuizGrade> = {
  '6e_kyu': QUIZ_6E_KYU,
  '5e_kyu': QUIZ_5E_KYU,
  '4e_kyu': QUIZ_4E_KYU,
  '3e_kyu': QUIZ_3E_KYU,
  '2e_kyu': QUIZ_2E_KYU,
  '1er_kyu': QUIZ_1ER_KYU,
};

export const getQuizByGrade = (gradeId: string): QuizGrade | null => {
  return QUIZ_BY_GRADE[gradeId] || null;
};

export const getAllQuizzes = (): QuizGrade[] => {
  return Object.values(QUIZ_BY_GRADE);
};

export default QUIZ_BY_GRADE;
