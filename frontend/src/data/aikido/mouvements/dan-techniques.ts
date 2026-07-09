/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🥋 WAYOFDOJO - TECHNIQUES AVANCÉES POUR GRADES DAN
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Programme officiel des grades Dan enrichi avec détails pédagogiques
 * (points clés, erreurs communes, applications)
 */

import type { Mouvement } from '../types';

// =============================================================================
// SHODAN (1er DAN) - Programme officiel enrichi
// =============================================================================

export const TECHNIQUES_SHODAN: Mouvement[] = [
  // Programme Kyu complet - Révision
  {
    id: 'programme_kyu_complet',
    nom: 'Programme Kyu Complet',
    nom_japonais: '級のプログラム全体',
    traduction: 'Maîtrise de tout le programme des grades Kyu',
    description: 'Démonstration de la maîtrise complète de toutes les techniques apprises du 6e Kyu au 1er Kyu. Le candidat doit montrer une exécution fluide et précise.',
    niveau: 'shodan',
    categorie: 'programme_complet',
    points_cles: [
      'Fluidité dans l\'enchaînement des techniques',
      'Précision des formes omote et ura',
      'Contrôle constant du centre de Uke',
      'Zanshin (vigilance) maintenu après chaque technique',
      'Ukemi maîtrisé dans toutes les situations'
    ],
    erreurs_communes: [
      'Techniques mécaniques sans connexion',
      'Perte de centre entre les techniques',
      'Manque de fluidité dans les transitions',
      'Oubli du zanshin'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/shodan/programme_kyu.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/shodan/' }
  },

  // Randori 2 personnes
  {
    id: 'futari_dori',
    nom: 'Futari Dori / Randori 2 personnes',
    nom_japonais: '二人取り',
    traduction: 'Défense contre deux attaquants',
    description: 'Pratique libre contre deux partenaires attaquant simultanément ou en alternance. Développe la vision périphérique et la gestion de l\'espace.',
    niveau: 'shodan',
    categorie: 'randori',
    points_cles: [
      'Ne jamais faire face aux deux attaquants en même temps',
      'Utiliser un attaquant comme bouclier contre l\'autre',
      'Déplacements constants et fluides (tai sabaki)',
      'Techniques courtes et efficaces',
      'Garder la vision périphérique active',
      'Utiliser l\'espace disponible'
    ],
    erreurs_communes: [
      'Se fixer sur un seul attaquant',
      'Techniques trop longues ou complexes',
      'Rester statique entre les techniques',
      'Panique et perte de centre',
      'Se laisser encercler'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/shodan/futari_dori.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/shodan/' }
  },

  // Ushiro Waza complet
  {
    id: 'ushiro_waza_complet',
    nom: 'Ushiro Waza Complet',
    nom_japonais: '後ろ技',
    traduction: 'Toutes techniques sur attaques arrière',
    description: 'Maîtrise complète des techniques depuis les saisies par l\'arrière : Ushiro Ryote Dori, Ushiro Ryokata Dori, Ushiro Kubi Shime, etc.',
    niveau: 'shodan',
    categorie: 'ushiro_waza',
    points_cles: [
      'Réagir AVANT que la saisie soit établie (anticipation)',
      'Maintenir le centre bas et stable',
      'Utiliser le pivot du corps (tenkan) pour créer l\'ouverture',
      'Ne pas chercher à se dégager par la force',
      'Entrer dans l\'espace de Uke plutôt que de fuir'
    ],
    erreurs_communes: [
      'Attendre que la saisie soit complètement établie',
      'Lever les épaules sous la pression',
      'Utiliser la force des bras plutôt que le corps',
      'Tirer vers l\'avant au lieu de tourner',
      'Perdre sa posture (se pencher en avant)'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/shodan/ushiro_waza.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/shodan/' }
  },

  // Kaeshi Waza
  {
    id: 'kaeshi_waza',
    nom: 'Kaeshi Waza',
    nom_japonais: '返し技',
    traduction: 'Contre-techniques',
    description: 'Capacité à renverser une technique en cours d\'application. Requiert une grande sensibilité et un timing précis pour sentir le moment où Tori perd le contrôle.',
    niveau: 'shodan',
    categorie: 'kaeshi_waza',
    points_cles: [
      'Sentir le moment où Tori perd le contrôle ou l\'équilibre',
      'Ne pas résister frontalement à la technique',
      'Utiliser l\'énergie de Tori pour le retournement',
      'Reprendre le centre immédiatement',
      'Rester connecté tout au long du mouvement'
    ],
    erreurs_communes: [
      'Forcer contre la technique (résistance)',
      'Retard dans la réaction (timing)',
      'Perdre sa propre stabilité en voulant contrer',
      'Anticipation visible qui permet à Tori de s\'adapter'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/shodan/kaeshi_waza.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/shodan/' }
  },

  // Henka Waza
  {
    id: 'henka_waza',
    nom: 'Henka Waza',
    nom_japonais: '変化技',
    traduction: 'Enchaînements et variations',
    description: 'Capacité à changer de technique en cours d\'exécution quand la première ne fonctionne pas, ou à enchaîner plusieurs techniques de manière fluide.',
    niveau: 'shodan',
    categorie: 'henka_waza',
    points_cles: [
      'Sentir la résistance de Uke et s\'adapter',
      'Utiliser cette résistance pour changer de technique',
      'Transition fluide sans perte de contrôle',
      'Garder Uke en déséquilibre constant',
      'Ne pas forcer une technique qui ne marche pas'
    ],
    erreurs_communes: [
      'S\'obstiner sur une technique malgré la résistance',
      'Pause entre les deux techniques (perte de connexion)',
      'Perte du centre de Uke pendant la transition',
      'Changements prévisibles et télégraphiés'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/shodan/henka_waza.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/shodan/' }
  },

  // Gokyo complet
  {
    id: 'gokyo_complet',
    nom: 'Gokyo Complet',
    nom_japonais: '五教',
    traduction: 'Les cinq principes d\'immobilisation',
    description: 'Maîtrise des cinq techniques fondamentales d\'immobilisation (Ikkyo, Nikkyo, Sankyo, Yonkyo, Gokyo) depuis toutes les attaques.',
    niveau: 'shodan',
    categorie: 'osae_waza',
    points_cles: [
      'Comprendre le principe de chaque technique',
      'Adapter l\'application selon la morphologie de Uke',
      'Contrôle précis des articulations',
      'Immobilisation efficace sans force excessive',
      'Transitions entre les différents osae waza'
    ],
    erreurs_communes: [
      'Application mécanique sans adaptation',
      'Force excessive causant des blessures',
      'Perte de contrôle pendant l\'immobilisation au sol',
      'Négliger le déséquilibre initial'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/shodan/gokyo.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/shodan/' }
  },

  // Tanto Dori
  {
    id: 'tanto_dori_shodan',
    nom: 'Tanto Dori',
    nom_japonais: '短刀取り',
    traduction: 'Défense contre couteau',
    description: 'Techniques de défense contre attaque au couteau (tanto). Inclut les défenses contre tsuki (pique), shomen (coupe verticale) et yokomen (coupe latérale).',
    niveau: 'shodan',
    categorie: 'tanto_dori',
    points_cles: [
      'Tai sabaki décisif pour éviter la lame',
      'Contrôle du poignet armé en priorité',
      'Désarmement intégré à la technique',
      'Distance de sécurité constante',
      'Ne jamais bloquer la lame directement'
    ],
    erreurs_communes: [
      'Entrer trop tôt (avant l\'attaque)',
      'Négliger le contrôle de la main armée',
      'Projeter sans désarmer',
      'Sous-estimer le danger de la lame',
      'Mouvements trop larges exposant le corps'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/shodan/tanto_dori.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/shodan/' }
  },

  // Tachi Dori
  {
    id: 'tachi_dori_shodan',
    nom: 'Tachi Dori',
    nom_japonais: '太刀取り',
    traduction: 'Défense contre sabre',
    description: 'Défense à mains nues contre attaque au sabre (bokken). Requiert un timing parfait et une entrée décisive.',
    niveau: 'shodan',
    categorie: 'tachi_dori',
    points_cles: [
      'Irimi au moment précis de la coupe',
      'Contrôle des deux mains de l\'attaquant',
      'Désarmement fluide et sécurisé',
      'Rester hors de la ligne de coupe',
      'Timing crucial - ni trop tôt, ni trop tard'
    ],
    erreurs_communes: [
      'Entrer trop tard (dans la coupe)',
      'Saisir le sabre au lieu des mains',
      'Négliger le zanshin après désarmement',
      'Distance incorrecte'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/shodan/tachi_dori.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/shodan/' }
  },

  // Jo Dori
  {
    id: 'jo_dori_shodan',
    nom: 'Jo Dori',
    nom_japonais: '杖取り',
    traduction: 'Défense contre bâton',
    description: 'Défense à mains nues contre attaque au jo (bâton). Techniques de contrôle et désarmement.',
    niveau: 'shodan',
    categorie: 'jo_dori',
    points_cles: [
      'Esquive latérale précise',
      'Saisie du jo dans le mouvement',
      'Utiliser le jo comme levier contre Uke',
      'Désarmement par rotation ou projection',
      'Contrôler la distance (portée du jo)'
    ],
    erreurs_communes: [
      'Esquive insuffisante',
      'Tirer sur le jo au lieu de rediriger',
      'Perdre le contrôle du centre',
      'Oublier que le jo peut pivoter dans les mains de Uke'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/shodan/jo_dori.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/shodan/' }
  },

  // Jo et Ken complets
  {
    id: 'buki_waza_shodan',
    nom: 'Jo et Ken Complets',
    nom_japonais: '武器技',
    traduction: 'Techniques d\'armes',
    description: 'Maîtrise des kata de jo (13, 31 mouvements) et des suburi de ken. Travail avec partenaire (kumijo, kumitachi).',
    niveau: 'shodan',
    categorie: 'buki_waza',
    points_cles: [
      'Posture correcte avec l\'arme',
      'Coordination corps-arme (ken tai icchi)',
      'Rythme et respiration appropriés',
      'Précision des coupes et des frappes',
      'Maîtrise des kata de base'
    ],
    erreurs_communes: [
      'Utiliser les bras au lieu du corps',
      'Mauvaise distance (maai)',
      'Rythme haché ou précipité',
      'Négliger le zanshin à la fin des kata'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/shodan/buki_waza.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/shodan/' }
  },

  // Ken Tai Jo
  {
    id: 'ken_tai_jo_shodan',
    nom: 'Ken Tai Jo',
    nom_japonais: '剣対杖',
    traduction: 'Sabre contre bâton',
    description: 'Travail d\'opposition sabre/bâton. Développe la compréhension des distances et du timing avec armes.',
    niveau: 'shodan',
    categorie: 'ken_tai_jo',
    points_cles: [
      'Comprendre les avantages de chaque arme',
      'Exploiter la portée du jo face au ken',
      'Timing d\'entrée contre le sabre',
      'Variations omote et ura',
      'Maintenir la distance appropriée'
    ],
    erreurs_communes: [
      'Ignorer la distance de sécurité',
      'Mouvements prévisibles',
      'Blocages au lieu de redirections',
      'Oublier que le sabre peut changer de direction'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/shodan/ken_tai_jo.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/shodan/' }
  }
];

// =============================================================================
// NIDAN (2e DAN) - Programme officiel enrichi
// =============================================================================

export const TECHNIQUES_NIDAN: Mouvement[] = [
  // Kata Dori Menuchi
  {
    id: 'kata_dori_menuchi',
    nom: 'Kata Dori Menuchi',
    nom_japonais: '肩取り面打ち',
    traduction: 'Saisie épaule avec frappe à la tête',
    description: 'Attaque combinée : saisie de l\'épaule (ou du revers) suivie d\'une frappe à la tête. Technique complexe nécessitant de gérer deux actions simultanées.',
    niveau: 'nidan',
    categorie: 'attaques_combinees',
    points_cles: [
      'Neutraliser la saisie ET la frappe simultanément',
      'Entrer avant que la frappe ne soit complète',
      'Utiliser la connexion de la saisie pour contrôler',
      'Ne pas se concentrer sur un seul danger',
      'Tai sabaki immédiat dès le contact'
    ],
    erreurs_communes: [
      'Se focaliser uniquement sur la frappe',
      'Oublier que l\'épaule est saisie',
      'Réaction tardive permettant les deux actions',
      'Mouvement de recul au lieu d\'entrer'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/nidan/kata_dori_menuchi.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/nidan/' }
  },

  // Futari Dori avancé
  {
    id: 'futari_dori_avance',
    nom: 'Futari Dori Avancé',
    nom_japonais: '二人取り上級',
    traduction: 'Défense contre 2 attaquants - variations',
    description: 'Niveau avancé du travail contre deux attaquants avec des variations et situations plus complexes.',
    niveau: 'nidan',
    categorie: 'randori',
    points_cles: [
      'Gestion de l\'espace en trois dimensions',
      'Utilisation créative des projections',
      'Enchaînements sans temps mort',
      'Adaptation instantanée aux changements',
      'Économie de mouvement et d\'énergie'
    ],
    erreurs_communes: [
      'Techniques répétitives et prévisibles',
      'Fatigue due à des mouvements inefficients',
      'Perte du contrôle de la situation',
      'Techniques incomplètes laissant Uke dangereux'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/nidan/futari_dori_avance.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/nidan/' }
  },

  // Kaeshi Waza avancé
  {
    id: 'kaeshi_waza_avance',
    nom: 'Kaeshi Waza Avancé',
    nom_japonais: '返し技上級',
    traduction: 'Contre-techniques complexes',
    description: 'Contre-techniques de niveau avancé, incluant les retournements sur des techniques plus élaborées et les contre-contres.',
    niveau: 'nidan',
    categorie: 'kaeshi_waza',
    points_cles: [
      'Sensibilité accrue au ki de Tori',
      'Capacité à contrer des techniques avancées',
      'Fluidité dans le retournement',
      'Anticipation sans télégraphier',
      'Contre-contre (re-retournement)'
    ],
    erreurs_communes: [
      'Contre trop prévisible',
      'Rigidité empêchant la sensibilité',
      'Force au lieu de timing',
      'Incapacité à s\'adapter si Tori réagit'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/nidan/kaeshi_waza_avance.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/nidan/' }
  },

  // Buki Waza avancé
  {
    id: 'buki_waza_avance',
    nom: 'Buki Waza Avancé',
    nom_japonais: '武器技上級',
    traduction: 'Armes niveau expert',
    description: 'Niveau expert du travail avec armes : kata complexes, variations libres, travail avec partenaire avancé.',
    niveau: 'nidan',
    categorie: 'buki_waza',
    points_cles: [
      'Kata longs et complexes maîtrisés',
      'Variations personnelles sur les kata',
      'Kumijo et kumitachi avec variations',
      'Compréhension profonde des principes',
      'Application martiale des mouvements'
    ],
    erreurs_communes: [
      'Exécution mécanique sans esprit',
      'Variations qui perdent l\'essence',
      'Manque de précision dans les kata longs',
      'Oubli des principes fondamentaux'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/nidan/buki_waza_avance.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/nidan/' }
  }
];

// =============================================================================
// SANDAN (3e DAN) - Programme officiel enrichi
// =============================================================================

export const TECHNIQUES_SANDAN: Mouvement[] = [
  // Sannin Dori
  {
    id: 'sannin_dori',
    nom: 'Sannin Dori',
    nom_japonais: '三人取り',
    traduction: 'Défense contre 3 attaquants',
    description: 'Pratique libre contre trois partenaires. Exige une maîtrise totale de l\'espace, du timing et une endurance mentale.',
    niveau: 'sandan',
    categorie: 'randori',
    points_cles: [
      'Vision périphérique complète (360°)',
      'Techniques instantanées sans préparation visible',
      'Fluidité absolue entre les attaquants',
      'Zanshin permanent sur tous les attaquants',
      'Gestion triangulaire de l\'espace',
      'Calme intérieur malgré la pression'
    ],
    erreurs_communes: [
      'Se faire encercler',
      'Techniques trop longues ou complexes',
      'Perte de la vision globale',
      'Essoufflement par manque d\'efficience',
      'Panique sous la pression'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/sandan/sannin_dori.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/sandan/' }
  },

  // Henka Waza libre
  {
    id: 'henka_waza_libre',
    nom: 'Henka Waza Libre',
    nom_japonais: '変化技自由',
    traduction: 'Enchaînements spontanés',
    description: 'Enchaînements de techniques complètement libres et spontanés, démontrant une maîtrise permettant la créativité.',
    niveau: 'sandan',
    categorie: 'henka_waza',
    points_cles: [
      'Spontanéité totale sans réflexion',
      'Flux continu sans interruption',
      'Adaptation instantanée à Uke',
      'Expression personnelle de l\'Aïkido',
      'Aucune technique planifiée à l\'avance'
    ],
    erreurs_communes: [
      'Enchaînements préparés à l\'avance',
      'Pauses entre les techniques',
      'Répétition des mêmes schémas',
      'Perte de connexion avec Uke'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/sandan/henka_waza_libre.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/sandan/' }
  },

  // Oyo Waza
  {
    id: 'oyo_waza',
    nom: 'Oyo Waza',
    nom_japonais: '応用技',
    traduction: 'Applications martiales',
    description: 'Applications libres et créatives des principes de l\'Aïkido dans un contexte martial réaliste.',
    niveau: 'sandan',
    categorie: 'oyo_waza',
    points_cles: [
      'Intégration de tous les principes appris',
      'Créativité dans l\'application',
      'Efficacité martiale démontrée',
      'Adaptation à des situations variées',
      'Expression personnelle tout en restant martial'
    ],
    erreurs_communes: [
      'Techniques spectaculaires mais inefficaces',
      'Perte de l\'essence martiale',
      'Copier au lieu de créer',
      'Danger pour le partenaire'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/sandan/oyo_waza.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/sandan/' }
  },

  // Tanto Randori
  {
    id: 'tanto_randori',
    nom: 'Tanto Randori',
    nom_japonais: '短刀乱取り',
    traduction: 'Défense libre contre couteau',
    description: 'Travail libre contre attaquant armé d\'un couteau. Combinaison de toutes les techniques de tanto dori en situation dynamique.',
    niveau: 'sandan',
    categorie: 'tanto_dori',
    points_cles: [
      'Vigilance constante sur l\'arme',
      'Variété des techniques utilisées',
      'Désarmement systématique',
      'Gestion du stress de l\'arme',
      'Techniques courtes et décisives'
    ],
    erreurs_communes: [
      'Oublier que l\'attaquant est armé',
      'Techniques risquées exposant au danger',
      'Projeter sans désarmer',
      'Perdre son calme face à l\'arme'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/sandan/tanto_randori.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/sandan/' }
  }
];

// =============================================================================
// YONDAN (4e DAN) - Programme officiel enrichi
// =============================================================================

export const TECHNIQUES_YONDAN: Mouvement[] = [
  // Yonin Dori
  {
    id: 'yonin_dori',
    nom: 'Yonin Dori',
    nom_japonais: '四人取り以上',
    traduction: 'Défense contre 4+ attaquants',
    description: 'Démonstration de maîtrise contre quatre attaquants ou plus. Le summum du randori en Aïkido.',
    niveau: 'yondan',
    categorie: 'randori',
    points_cles: [
      'Déplacements circulaires constants',
      'Aucune technique ne dure plus de 2 secondes',
      'Utilisation totale de l\'espace',
      'État méditatif malgré l\'action intense',
      'Endurance physique et mentale',
      'Chaque projection crée un obstacle pour les autres'
    ],
    erreurs_communes: [
      'Se laisser encercler',
      'Fatigue mentale avant la fatigue physique',
      'Techniques trop élaborées',
      'Perte de la sérénité intérieure'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/yondan/yonin_dori.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/yondan/' }
  },

  // Takemusu Aiki
  {
    id: 'takemusu_aiki',
    nom: 'Takemusu Aiki',
    nom_japonais: '武産合気',
    traduction: 'Création spontanée de techniques',
    description: 'Le niveau ultime selon O-Sensei : la capacité de créer spontanément des techniques infinies, parfaitement adaptées à chaque situation.',
    niveau: 'yondan',
    categorie: 'takemusu',
    points_cles: [
      'Aucune technique préconçue',
      'Réponse parfaitement adaptée à chaque instant',
      'Union complète avec le partenaire',
      'Expression du Ki sans effort conscient',
      'Harmonie totale corps-esprit',
      'Transcendance de la forme technique'
    ],
    erreurs_communes: [
      'Confondre improvisation et Takemusu',
      'Techniques chaotiques sans principes',
      'Forcer la créativité',
      'Perdre l\'efficacité martiale'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/yondan/takemusu.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/yondan/' }
  },

  // Ki no Nagare
  {
    id: 'ki_no_nagare',
    nom: 'Ki no Nagare',
    nom_japonais: '気の流れ',
    traduction: 'Flux continu du Ki',
    description: 'Pratique en flux continu où Tori et Uke sont en mouvement permanent, sans arrêt ni saisie statique.',
    niveau: 'yondan',
    categorie: 'ki_no_nagare',
    points_cles: [
      'Mouvement perpétuel sans interruption',
      'Connexion énergétique constante',
      'Techniques naissant du mouvement',
      'Respiration unifiée avec le mouvement',
      'Aucune force ni résistance',
      'Harmonie parfaite entre Tori et Uke'
    ],
    erreurs_communes: [
      'Forcer le flux au lieu de le suivre',
      'Perdre la connexion',
      'Mouvement chaotique sans direction',
      'Techniques mécaniques dans le flux'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/yondan/ki_no_nagare.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/yondan/' }
  },

  // Kuden
  {
    id: 'kuden',
    nom: 'Kuden',
    nom_japonais: '口伝',
    traduction: 'Enseignement oral - secrets de l\'école',
    description: 'Transmission orale des enseignements profonds de l\'école, réservée aux pratiquants avancés. Comprend les principes subtils et l\'essence spirituelle de l\'art.',
    niveau: 'yondan',
    categorie: 'kuden',
    points_cles: [
      'Compréhension des principes cachés',
      'Transmission fidèle de l\'enseignement reçu',
      'Capacité à transmettre l\'essence',
      'Maturité spirituelle',
      'Responsabilité de la lignée'
    ],
    erreurs_communes: [
      'Interprétation personnelle erronée',
      'Transmission incomplète ou déformée',
      'Confondre secret et mystère',
      'Élitisme au lieu de transmission juste'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/yondan/kuden.mp4' },
    animation: { phases: 1, images: [null], placeholder: '/animations/yondan/' }
  }
];

// =============================================================================
// EXPORTS
// =============================================================================

// Toutes les techniques Dan combinées
export const ALL_TECHNIQUES_DAN: Mouvement[] = [
  ...TECHNIQUES_SHODAN,
  ...TECHNIQUES_NIDAN,
  ...TECHNIQUES_SANDAN,
  ...TECHNIQUES_YONDAN,
];

// Export par niveau
export function getTechniquesDan(niveau: string): Mouvement[] {
  switch(niveau) {
    case 'shodan': return TECHNIQUES_SHODAN;
    case 'nidan': return TECHNIQUES_NIDAN;
    case 'sandan': return TECHNIQUES_SANDAN;
    case 'yondan': return TECHNIQUES_YONDAN;
    default: return [];
  }
}

export default ALL_TECHNIQUES_DAN;
