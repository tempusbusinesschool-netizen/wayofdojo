/**
 * AIKIDO@GAME — TECHNIQUES DE GRADES DAN (CEINTURES NOIRES)
 * 
 * Ce fichier contient les 45 techniques requises pour les passages
 * de grades Dan (1er Dan au 4e Dan).
 * 
 * Les techniques Dan représentent un niveau avancé de pratique,
 * avec des variations plus subtiles et des applications martiales
 * plus poussées.
 * 
 * 🎬 Chaque technique dispose d'un emplacement pour une vidéo animée
 */

export const TECHNIQUES_DAN = [
  // ==========================================================================
  // ██╗███████╗██████╗     ██████╗  █████╗ ███╗   ██╗
  // ██║██╔════╝██╔══██╗    ██╔══██╗██╔══██╗████╗  ██║
  // ██║█████╗  ██████╔╝    ██║  ██║███████║██╔██╗ ██║
  // ██║██╔══╝  ██╔══██╗    ██║  ██║██╔══██║██║╚██╗██║
  // ██║███████╗██║  ██║    ██████╔╝██║  ██║██║ ╚████║
  // ╚═╝╚══════╝╚═╝  ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝
  // 1er DAN - SHODAN (12 techniques)
  // ==========================================================================
  
  { 
    id: "shodan_shomen_gokyo_o", 
    nom: "Shomen Uchi Gokyo Omote",
    description: "5e principe contre frappe verticale - Version avancée",
    phase1: { attaque: "shomen_uchi", deplacement: "irimi" }, 
    phase2: { technique: "gokyo", direction: "omote" }, 
    phase3: { final: "gokyo_osae", type: "immobilisation" }, 
    grade: "shodan",
    niveau_requis: "1er Dan",
    video: {
      url: null,
      placeholder: "/videos/dan/shodan/shomen_gokyo_omote.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/dan/shodan/shomen_gokyo_omote/"
    }
  },
  { 
    id: "shodan_shomen_gokyo_u", 
    nom: "Shomen Uchi Gokyo Ura",
    description: "5e principe contre frappe verticale - Côté intérieur",
    phase1: { attaque: "shomen_uchi", deplacement: "irimi_tenkan" }, 
    phase2: { technique: "gokyo", direction: "ura" }, 
    phase3: { final: "gokyo_osae", type: "immobilisation" }, 
    grade: "shodan",
    niveau_requis: "1er Dan",
    video: { url: null, placeholder: "/videos/dan/shodan/shomen_gokyo_ura.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/shodan/shomen_gokyo_ura/" }
  },
  { 
    id: "shodan_yokomen_gokyo", 
    nom: "Yokomen Uchi Gokyo",
    description: "5e principe contre frappe latérale",
    phase1: { attaque: "yokomen_uchi", deplacement: "irimi" }, 
    phase2: { technique: "gokyo", direction: "omote" }, 
    phase3: { final: "gokyo_osae", type: "immobilisation" }, 
    grade: "shodan",
    niveau_requis: "1er Dan",
    video: { url: null, placeholder: "/videos/dan/shodan/yokomen_gokyo.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/shodan/yokomen_gokyo/" }
  },
  { 
    id: "shodan_ushiro_ryote_ikkyo", 
    nom: "Ushiro Ryote Dori Ikkyo",
    description: "1er principe contre saisie arrière des deux mains",
    phase1: { attaque: "ushiro_ryote_dori", deplacement: "irimi_tenkan" }, 
    phase2: { technique: "ikkyo", direction: "omote" }, 
    phase3: { final: "ikkyo_osae", type: "immobilisation" }, 
    grade: "shodan",
    niveau_requis: "1er Dan",
    video: { url: null, placeholder: "/videos/dan/shodan/ushiro_ryote_ikkyo.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/shodan/ushiro_ryote_ikkyo/" }
  },
  { 
    id: "shodan_ushiro_ryote_nikyo", 
    nom: "Ushiro Ryote Dori Nikyo",
    description: "2e principe contre saisie arrière",
    phase1: { attaque: "ushiro_ryote_dori", deplacement: "tenkan" }, 
    phase2: { technique: "nikyo", direction: "ura" }, 
    phase3: { final: "nikyo_osae", type: "immobilisation" }, 
    grade: "shodan",
    niveau_requis: "1er Dan",
    video: { url: null, placeholder: "/videos/dan/shodan/ushiro_ryote_nikyo.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/shodan/ushiro_ryote_nikyo/" }
  },
  { 
    id: "shodan_ushiro_ryote_sankyo", 
    nom: "Ushiro Ryote Dori Sankyo",
    description: "3e principe contre saisie arrière",
    phase1: { attaque: "ushiro_ryote_dori", deplacement: "tenkan" }, 
    phase2: { technique: "sankyo", direction: "ura" }, 
    phase3: { final: "sankyo_osae", type: "immobilisation" }, 
    grade: "shodan",
    niveau_requis: "1er Dan",
    video: { url: null, placeholder: "/videos/dan/shodan/ushiro_ryote_sankyo.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/shodan/ushiro_ryote_sankyo/" }
  },
  { 
    id: "shodan_ushiro_ryote_kote", 
    nom: "Ushiro Ryote Dori Kote Gaeshi",
    description: "Retournement poignet contre saisie arrière",
    phase1: { attaque: "ushiro_ryote_dori", deplacement: "tenkan" }, 
    phase2: { technique: "kote_gaeshi", direction: null }, 
    phase3: { final: "kote_gaeshi_osae", type: "immobilisation" }, 
    grade: "shodan",
    niveau_requis: "1er Dan",
    video: { url: null, placeholder: "/videos/dan/shodan/ushiro_ryote_kote.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/shodan/ushiro_ryote_kote/" }
  },
  { 
    id: "shodan_ushiro_ryote_shiho", 
    nom: "Ushiro Ryote Dori Shiho Nage",
    description: "Projection 4 directions contre saisie arrière",
    phase1: { attaque: "ushiro_ryote_dori", deplacement: "irimi" }, 
    phase2: { technique: "shiho_nage", direction: "omote" }, 
    phase3: { final: "mae_ukemi", type: "chute" }, 
    grade: "shodan",
    niveau_requis: "1er Dan",
    video: { url: null, placeholder: "/videos/dan/shodan/ushiro_ryote_shiho.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/shodan/ushiro_ryote_shiho/" }
  },
  { 
    id: "shodan_ushiro_kubishime_kote", 
    nom: "Ushiro Kubishime Kote Gaeshi",
    description: "Contre étranglement arrière",
    phase1: { attaque: "ushiro_kubishime", deplacement: "sabaki" }, 
    phase2: { technique: "kote_gaeshi", direction: null }, 
    phase3: { final: "kote_gaeshi_osae", type: "immobilisation" }, 
    grade: "shodan",
    niveau_requis: "1er Dan",
    video: { url: null, placeholder: "/videos/dan/shodan/ushiro_kubishime_kote.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/shodan/ushiro_kubishime_kote/" }
  },
  { 
    id: "shodan_jiyu_waza_1", 
    nom: "Jiyu Waza - Techniques libres",
    description: "Application libre contre attaques multiples",
    phase1: { attaque: "jiyu", deplacement: "libre" }, 
    phase2: { technique: "jiyu_waza", direction: null }, 
    phase3: { final: "zanshin", type: "libre" }, 
    grade: "shodan",
    niveau_requis: "1er Dan",
    video: { url: null, placeholder: "/videos/dan/shodan/jiyu_waza.mp4" },
    animation: { phases: 3, images: [null, null, null], placeholder: "/animations/dan/shodan/jiyu_waza/" }
  },
  { 
    id: "shodan_suwari_kokyu_ho", 
    nom: "Suwari Waza Kokyu Ho (avancé)",
    description: "Kokyu Ho à genoux - Version avancée",
    phase1: { attaque: "ryote_dori", deplacement: "kokyu" }, 
    phase2: { technique: "kokyu_ho", direction: null }, 
    phase3: { final: "projection", type: "kokyu" }, 
    grade: "shodan",
    niveau_requis: "1er Dan",
    video: { url: null, placeholder: "/videos/dan/shodan/suwari_kokyu_ho.mp4" },
    animation: { phases: 4, images: [null, null, null, null], placeholder: "/animations/dan/shodan/suwari_kokyu_ho/" }
  },
  { 
    id: "shodan_tanto_dori_gokyo", 
    nom: "Tanto Dori Gokyo",
    description: "Défense contre couteau avec 5e principe",
    phase1: { attaque: "tanto_tsuki", deplacement: "irimi" }, 
    phase2: { technique: "gokyo", direction: "omote" }, 
    phase3: { final: "gokyo_osae", type: "désarmement" }, 
    grade: "shodan",
    niveau_requis: "1er Dan",
    video: { url: null, placeholder: "/videos/dan/shodan/tanto_dori_gokyo.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/shodan/tanto_dori_gokyo/" }
  },

  // ==========================================================================
  // ██████╗ ███████╗    ██████╗  █████╗ ███╗   ██╗
  // ╚════██╗██╔════╝    ██╔══██╗██╔══██╗████╗  ██║
  //  █████╔╝█████╗      ██║  ██║███████║██╔██╗ ██║
  // ██╔═══╝ ██╔══╝      ██║  ██║██╔══██║██║╚██╗██║
  // ███████╗███████╗    ██████╔╝██║  ██║██║ ╚████║
  // ╚══════╝╚══════╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝
  // 2e DAN - NIDAN (12 techniques)
  // ==========================================================================
  
  { 
    id: "nidan_kata_dori_menuchi_ikkyo", 
    nom: "Kata Dori Menuchi Ikkyo",
    description: "Saisie épaule + frappe tête - 1er principe",
    phase1: { attaque: "kata_dori_menuchi", deplacement: "irimi" }, 
    phase2: { technique: "ikkyo", direction: "omote" }, 
    phase3: { final: "ikkyo_osae", type: "immobilisation" }, 
    grade: "nidan",
    niveau_requis: "2e Dan",
    video: { url: null, placeholder: "/videos/dan/nidan/kata_dori_menuchi_ikkyo.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/nidan/kata_dori_menuchi_ikkyo/" }
  },
  { 
    id: "nidan_kata_dori_menuchi_nikyo", 
    nom: "Kata Dori Menuchi Nikyo",
    description: "Saisie épaule + frappe tête - 2e principe",
    phase1: { attaque: "kata_dori_menuchi", deplacement: "irimi" }, 
    phase2: { technique: "nikyo", direction: "omote" }, 
    phase3: { final: "nikyo_osae", type: "immobilisation" }, 
    grade: "nidan",
    niveau_requis: "2e Dan",
    video: { url: null, placeholder: "/videos/dan/nidan/kata_dori_menuchi_nikyo.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/nidan/kata_dori_menuchi_nikyo/" }
  },
  { 
    id: "nidan_kata_dori_menuchi_sankyo", 
    nom: "Kata Dori Menuchi Sankyo",
    description: "Saisie épaule + frappe tête - 3e principe",
    phase1: { attaque: "kata_dori_menuchi", deplacement: "tenkan" }, 
    phase2: { technique: "sankyo", direction: "ura" }, 
    phase3: { final: "sankyo_osae", type: "immobilisation" }, 
    grade: "nidan",
    niveau_requis: "2e Dan",
    video: { url: null, placeholder: "/videos/dan/nidan/kata_dori_menuchi_sankyo.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/nidan/kata_dori_menuchi_sankyo/" }
  },
  { 
    id: "nidan_kata_dori_menuchi_yonkyo", 
    nom: "Kata Dori Menuchi Yonkyo",
    description: "Saisie épaule + frappe tête - 4e principe",
    phase1: { attaque: "kata_dori_menuchi", deplacement: "irimi" }, 
    phase2: { technique: "yonkyo", direction: "omote" }, 
    phase3: { final: "yonkyo_osae", type: "immobilisation" }, 
    grade: "nidan",
    niveau_requis: "2e Dan",
    video: { url: null, placeholder: "/videos/dan/nidan/kata_dori_menuchi_yonkyo.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/nidan/kata_dori_menuchi_yonkyo/" }
  },
  { 
    id: "nidan_kata_dori_menuchi_gokyo", 
    nom: "Kata Dori Menuchi Gokyo",
    description: "Saisie épaule + frappe tête - 5e principe",
    phase1: { attaque: "kata_dori_menuchi", deplacement: "irimi" }, 
    phase2: { technique: "gokyo", direction: "omote" }, 
    phase3: { final: "gokyo_osae", type: "immobilisation" }, 
    grade: "nidan",
    niveau_requis: "2e Dan",
    video: { url: null, placeholder: "/videos/dan/nidan/kata_dori_menuchi_gokyo.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/nidan/kata_dori_menuchi_gokyo/" }
  },
  { 
    id: "nidan_futari_dori_1", 
    nom: "Futari Dori (2 attaquants) - Série 1",
    description: "Défense contre 2 attaquants - Première série",
    phase1: { attaque: "futari_dori", deplacement: "sabaki" }, 
    phase2: { technique: "futari_waza", direction: null }, 
    phase3: { final: "zanshin", type: "multiple" }, 
    grade: "nidan",
    niveau_requis: "2e Dan",
    video: { url: null, placeholder: "/videos/dan/nidan/futari_dori_1.mp4" },
    animation: { phases: 4, images: [null, null, null, null], placeholder: "/animations/dan/nidan/futari_dori_1/" }
  },
  { 
    id: "nidan_futari_dori_2", 
    nom: "Futari Dori (2 attaquants) - Série 2",
    description: "Défense contre 2 attaquants - Deuxième série",
    phase1: { attaque: "futari_dori", deplacement: "irimi" }, 
    phase2: { technique: "futari_waza", direction: null }, 
    phase3: { final: "zanshin", type: "multiple" }, 
    grade: "nidan",
    niveau_requis: "2e Dan",
    video: { url: null, placeholder: "/videos/dan/nidan/futari_dori_2.mp4" },
    animation: { phases: 4, images: [null, null, null, null], placeholder: "/animations/dan/nidan/futari_dori_2/" }
  },
  { 
    id: "nidan_tachi_dori_1", 
    nom: "Tachi Dori - Série 1",
    description: "Défense contre sabre - Première série",
    phase1: { attaque: "tachi_shomen", deplacement: "irimi" }, 
    phase2: { technique: "tachi_dori", direction: "omote" }, 
    phase3: { final: "désarmement", type: "arme" }, 
    grade: "nidan",
    niveau_requis: "2e Dan",
    video: { url: null, placeholder: "/videos/dan/nidan/tachi_dori_1.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/nidan/tachi_dori_1/" }
  },
  { 
    id: "nidan_tachi_dori_2", 
    nom: "Tachi Dori - Série 2",
    description: "Défense contre sabre - Deuxième série",
    phase1: { attaque: "tachi_yokomen", deplacement: "tenkan" }, 
    phase2: { technique: "tachi_dori", direction: "ura" }, 
    phase3: { final: "désarmement", type: "arme" }, 
    grade: "nidan",
    niveau_requis: "2e Dan",
    video: { url: null, placeholder: "/videos/dan/nidan/tachi_dori_2.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/nidan/tachi_dori_2/" }
  },
  { 
    id: "nidan_jo_dori_1", 
    nom: "Jo Dori - Série avancée 1",
    description: "Défense contre bâton - Série avancée",
    phase1: { attaque: "jo_tsuki", deplacement: "irimi" }, 
    phase2: { technique: "jo_dori", direction: "omote" }, 
    phase3: { final: "désarmement", type: "arme" }, 
    grade: "nidan",
    niveau_requis: "2e Dan",
    video: { url: null, placeholder: "/videos/dan/nidan/jo_dori_1.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/nidan/jo_dori_1/" }
  },
  { 
    id: "nidan_jo_nage_1", 
    nom: "Jo Nage - Série avancée",
    description: "Projection avec bâton - Avancée",
    phase1: { attaque: "ryote_dori", deplacement: "jo_sabaki" }, 
    phase2: { technique: "jo_nage", direction: null }, 
    phase3: { final: "projection", type: "arme" }, 
    grade: "nidan",
    niveau_requis: "2e Dan",
    video: { url: null, placeholder: "/videos/dan/nidan/jo_nage_1.mp4" },
    animation: { phases: 4, images: [null, null, null, null], placeholder: "/animations/dan/nidan/jo_nage_1/" }
  },
  { 
    id: "nidan_kaeshi_waza", 
    nom: "Kaeshi Waza (Contre-techniques)",
    description: "Techniques de contre - Retournements",
    phase1: { attaque: "technique", deplacement: "kaeshi" }, 
    phase2: { technique: "kaeshi_waza", direction: null }, 
    phase3: { final: "retournement", type: "avancé" }, 
    grade: "nidan",
    niveau_requis: "2e Dan",
    video: { url: null, placeholder: "/videos/dan/nidan/kaeshi_waza.mp4" },
    animation: { phases: 4, images: [null, null, null, null], placeholder: "/animations/dan/nidan/kaeshi_waza/" }
  },

  // ==========================================================================
  // ██████╗ ███████╗    ██████╗  █████╗ ███╗   ██╗
  // ╚════██╗██╔════╝    ██╔══██╗██╔══██╗████╗  ██║
  //  █████╔╝█████╗      ██║  ██║███████║██╔██╗ ██║
  //  ╚═══██╗██╔══╝      ██║  ██║██╔══██║██║╚██╗██║
  // ██████╔╝███████╗    ██████╔╝██║  ██║██║ ╚████║
  // ╚═════╝ ╚══════╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝
  // 3e DAN - SANDAN (11 techniques)
  // ==========================================================================
  
  { 
    id: "sandan_henka_waza_1", 
    nom: "Henka Waza - Variations 1",
    description: "Enchaînements et variations de techniques",
    phase1: { attaque: "shomen_uchi", deplacement: "variable" }, 
    phase2: { technique: "henka_waza", direction: null }, 
    phase3: { final: "variable", type: "variation" }, 
    grade: "sandan",
    niveau_requis: "3e Dan",
    video: { url: null, placeholder: "/videos/dan/sandan/henka_waza_1.mp4" },
    animation: { phases: 4, images: [null, null, null, null], placeholder: "/animations/dan/sandan/henka_waza_1/" }
  },
  { 
    id: "sandan_henka_waza_2", 
    nom: "Henka Waza - Variations 2",
    description: "Enchaînements complexes",
    phase1: { attaque: "yokomen_uchi", deplacement: "variable" }, 
    phase2: { technique: "henka_waza", direction: null }, 
    phase3: { final: "variable", type: "variation" }, 
    grade: "sandan",
    niveau_requis: "3e Dan",
    video: { url: null, placeholder: "/videos/dan/sandan/henka_waza_2.mp4" },
    animation: { phases: 4, images: [null, null, null, null], placeholder: "/animations/dan/sandan/henka_waza_2/" }
  },
  { 
    id: "sandan_sannin_dori_1", 
    nom: "Sannin Dori (3 attaquants) - Série 1",
    description: "Défense contre 3 attaquants",
    phase1: { attaque: "sannin_dori", deplacement: "sabaki" }, 
    phase2: { technique: "sannin_waza", direction: null }, 
    phase3: { final: "zanshin", type: "multiple" }, 
    grade: "sandan",
    niveau_requis: "3e Dan",
    video: { url: null, placeholder: "/videos/dan/sandan/sannin_dori_1.mp4" },
    animation: { phases: 4, images: [null, null, null, null], placeholder: "/animations/dan/sandan/sannin_dori_1/" }
  },
  { 
    id: "sandan_sannin_dori_2", 
    nom: "Sannin Dori (3 attaquants) - Série 2",
    description: "Défense contre 3 attaquants - Avancée",
    phase1: { attaque: "sannin_dori", deplacement: "irimi" }, 
    phase2: { technique: "sannin_waza", direction: null }, 
    phase3: { final: "zanshin", type: "multiple" }, 
    grade: "sandan",
    niveau_requis: "3e Dan",
    video: { url: null, placeholder: "/videos/dan/sandan/sannin_dori_2.mp4" },
    animation: { phases: 4, images: [null, null, null, null], placeholder: "/animations/dan/sandan/sannin_dori_2/" }
  },
  { 
    id: "sandan_kumitachi_1", 
    nom: "Kumitachi avancé - Série 1",
    description: "Exercices au sabre à deux - Avancé",
    phase1: { attaque: "kumitachi", deplacement: "awase" }, 
    phase2: { technique: "ken_no_ri", direction: null }, 
    phase3: { final: "zanshin", type: "arme" }, 
    grade: "sandan",
    niveau_requis: "3e Dan",
    video: { url: null, placeholder: "/videos/dan/sandan/kumitachi_1.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/sandan/kumitachi_1/" }
  },
  { 
    id: "sandan_kumitachi_2", 
    nom: "Kumitachi avancé - Série 2",
    description: "Exercices au sabre à deux - Variations",
    phase1: { attaque: "kumitachi", deplacement: "henka" }, 
    phase2: { technique: "ken_no_ri", direction: null }, 
    phase3: { final: "zanshin", type: "arme" }, 
    grade: "sandan",
    niveau_requis: "3e Dan",
    video: { url: null, placeholder: "/videos/dan/sandan/kumitachi_2.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/sandan/kumitachi_2/" }
  },
  { 
    id: "sandan_kumijo_1", 
    nom: "Kumijo avancé - Série 1",
    description: "Exercices au bâton à deux - Avancé",
    phase1: { attaque: "kumijo", deplacement: "awase" }, 
    phase2: { technique: "jo_no_ri", direction: null }, 
    phase3: { final: "zanshin", type: "arme" }, 
    grade: "sandan",
    niveau_requis: "3e Dan",
    video: { url: null, placeholder: "/videos/dan/sandan/kumijo_1.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/sandan/kumijo_1/" }
  },
  { 
    id: "sandan_kumijo_2", 
    nom: "Kumijo avancé - Série 2",
    description: "Exercices au bâton à deux - Variations",
    phase1: { attaque: "kumijo", deplacement: "henka" }, 
    phase2: { technique: "jo_no_ri", direction: null }, 
    phase3: { final: "zanshin", type: "arme" }, 
    grade: "sandan",
    niveau_requis: "3e Dan",
    video: { url: null, placeholder: "/videos/dan/sandan/kumijo_2.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/sandan/kumijo_2/" }
  },
  { 
    id: "sandan_tanto_randori", 
    nom: "Tanto Randori",
    description: "Défense libre contre couteau",
    phase1: { attaque: "tanto_jiyu", deplacement: "libre" }, 
    phase2: { technique: "tanto_sabaki", direction: null }, 
    phase3: { final: "désarmement", type: "randori" }, 
    grade: "sandan",
    niveau_requis: "3e Dan",
    video: { url: null, placeholder: "/videos/dan/sandan/tanto_randori.mp4" },
    animation: { phases: 4, images: [null, null, null, null], placeholder: "/animations/dan/sandan/tanto_randori/" }
  },
  { 
    id: "sandan_oyo_waza_1", 
    nom: "Oyo Waza (Applications) - Série 1",
    description: "Applications martiales avancées",
    phase1: { attaque: "variable", deplacement: "oyo" }, 
    phase2: { technique: "oyo_waza", direction: null }, 
    phase3: { final: "application", type: "martial" }, 
    grade: "sandan",
    niveau_requis: "3e Dan",
    video: { url: null, placeholder: "/videos/dan/sandan/oyo_waza_1.mp4" },
    animation: { phases: 4, images: [null, null, null, null], placeholder: "/animations/dan/sandan/oyo_waza_1/" }
  },
  { 
    id: "sandan_oyo_waza_2", 
    nom: "Oyo Waza (Applications) - Série 2",
    description: "Applications self-défense",
    phase1: { attaque: "variable", deplacement: "oyo" }, 
    phase2: { technique: "oyo_waza", direction: null }, 
    phase3: { final: "application", type: "self-defense" }, 
    grade: "sandan",
    niveau_requis: "3e Dan",
    video: { url: null, placeholder: "/videos/dan/sandan/oyo_waza_2.mp4" },
    animation: { phases: 4, images: [null, null, null, null], placeholder: "/animations/dan/sandan/oyo_waza_2/" }
  },

  // ==========================================================================
  // ██╗  ██╗███████╗    ██████╗  █████╗ ███╗   ██╗
  // ██║  ██║██╔════╝    ██╔══██╗██╔══██╗████╗  ██║
  // ███████║█████╗      ██║  ██║███████║██╔██╗ ██║
  // ╚════██║██╔══╝      ██║  ██║██╔══██║██║╚██╗██║
  //      ██║███████╗    ██████╔╝██║  ██║██║ ╚████║
  //      ╚═╝╚══════╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝
  // 4e DAN - YONDAN (10 techniques)
  // ==========================================================================
  
  { 
    id: "yondan_aiki_no_ri_1", 
    nom: "Aiki no Ri - Principes de l'Aiki 1",
    description: "Démonstration des principes fondamentaux de l'Aiki",
    phase1: { attaque: "variable", deplacement: "aiki" }, 
    phase2: { technique: "aiki_no_ri", direction: null }, 
    phase3: { final: "démonstration", type: "principe" }, 
    grade: "yondan",
    niveau_requis: "4e Dan",
    video: { url: null, placeholder: "/videos/dan/yondan/aiki_no_ri_1.mp4" },
    animation: { phases: 4, images: [null, null, null, null], placeholder: "/animations/dan/yondan/aiki_no_ri_1/" }
  },
  { 
    id: "yondan_aiki_no_ri_2", 
    nom: "Aiki no Ri - Principes de l'Aiki 2",
    description: "Applications avancées des principes",
    phase1: { attaque: "variable", deplacement: "aiki" }, 
    phase2: { technique: "aiki_no_ri", direction: null }, 
    phase3: { final: "démonstration", type: "principe" }, 
    grade: "yondan",
    niveau_requis: "4e Dan",
    video: { url: null, placeholder: "/videos/dan/yondan/aiki_no_ri_2.mp4" },
    animation: { phases: 4, images: [null, null, null, null], placeholder: "/animations/dan/yondan/aiki_no_ri_2/" }
  },
  { 
    id: "yondan_yonin_dori", 
    nom: "Yonin Dori (4 attaquants)",
    description: "Défense contre 4 attaquants simultanés",
    phase1: { attaque: "yonin_dori", deplacement: "sabaki" }, 
    phase2: { technique: "yonin_waza", direction: null }, 
    phase3: { final: "zanshin", type: "multiple" }, 
    grade: "yondan",
    niveau_requis: "4e Dan",
    video: { url: null, placeholder: "/videos/dan/yondan/yonin_dori.mp4" },
    animation: { phases: 4, images: [null, null, null, null], placeholder: "/animations/dan/yondan/yonin_dori/" }
  },
  { 
    id: "yondan_buki_waza_synthesis", 
    nom: "Buki Waza - Synthèse des armes",
    description: "Maîtrise intégrée des armes (Jo, Ken, Tanto)",
    phase1: { attaque: "buki", deplacement: "variable" }, 
    phase2: { technique: "buki_synthesis", direction: null }, 
    phase3: { final: "maîtrise", type: "arme" }, 
    grade: "yondan",
    niveau_requis: "4e Dan",
    video: { url: null, placeholder: "/videos/dan/yondan/buki_waza_synthesis.mp4" },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: "/animations/dan/yondan/buki_waza_synthesis/" }
  },
  { 
    id: "yondan_randori_jiyu", 
    nom: "Randori Jiyu (Combat libre)",
    description: "Application libre contre attaques non-chorégraphiées",
    phase1: { attaque: "libre", deplacement: "libre" }, 
    phase2: { technique: "randori", direction: null }, 
    phase3: { final: "zanshin", type: "libre" }, 
    grade: "yondan",
    niveau_requis: "4e Dan",
    video: { url: null, placeholder: "/videos/dan/yondan/randori_jiyu.mp4" },
    animation: { phases: 3, images: [null, null, null], placeholder: "/animations/dan/yondan/randori_jiyu/" }
  },
  { 
    id: "yondan_ki_no_nagare", 
    nom: "Ki no Nagare (Flux du Ki)",
    description: "Techniques en flux continu sans arrêt",
    phase1: { attaque: "continue", deplacement: "nagare" }, 
    phase2: { technique: "ki_no_nagare", direction: null }, 
    phase3: { final: "flux", type: "avancé" }, 
    grade: "yondan",
    niveau_requis: "4e Dan",
    video: { url: null, placeholder: "/videos/dan/yondan/ki_no_nagare.mp4" },
    animation: { phases: 4, images: [null, null, null, null], placeholder: "/animations/dan/yondan/ki_no_nagare/" }
  },
  { 
    id: "yondan_takemusu_aiki_1", 
    nom: "Takemusu Aiki - Création spontanée 1",
    description: "Création spontanée de techniques",
    phase1: { attaque: "spontané", deplacement: "takemusu" }, 
    phase2: { technique: "takemusu_aiki", direction: null }, 
    phase3: { final: "création", type: "spontané" }, 
    grade: "yondan",
    niveau_requis: "4e Dan",
    video: { url: null, placeholder: "/videos/dan/yondan/takemusu_aiki_1.mp4" },
    animation: { phases: 4, images: [null, null, null, null], placeholder: "/animations/dan/yondan/takemusu_aiki_1/" }
  },
  { 
    id: "yondan_takemusu_aiki_2", 
    nom: "Takemusu Aiki - Création spontanée 2",
    description: "Expression personnelle de l'Aïkido",
    phase1: { attaque: "spontané", deplacement: "takemusu" }, 
    phase2: { technique: "takemusu_aiki", direction: null }, 
    phase3: { final: "expression", type: "personnel" }, 
    grade: "yondan",
    niveau_requis: "4e Dan",
    video: { url: null, placeholder: "/videos/dan/yondan/takemusu_aiki_2.mp4" },
    animation: { phases: 4, images: [null, null, null, null], placeholder: "/animations/dan/yondan/takemusu_aiki_2/" }
  },
  { 
    id: "yondan_kuden_1", 
    nom: "Kuden (Enseignement oral) - Transmission 1",
    description: "Techniques transmises oralement - Non codifiées",
    phase1: { attaque: "kuden", deplacement: "variable" }, 
    phase2: { technique: "kuden_waza", direction: null }, 
    phase3: { final: "transmission", type: "oral" }, 
    grade: "yondan",
    niveau_requis: "4e Dan",
    video: { url: null, placeholder: "/videos/dan/yondan/kuden_1.mp4" },
    animation: { phases: 3, images: [null, null, null], placeholder: "/animations/dan/yondan/kuden_1/" }
  },
  { 
    id: "yondan_kuden_2", 
    nom: "Kuden (Enseignement oral) - Transmission 2",
    description: "Secrets de l'école - Transmission directe",
    phase1: { attaque: "kuden", deplacement: "variable" }, 
    phase2: { technique: "kuden_waza", direction: null }, 
    phase3: { final: "secret", type: "transmission" }, 
    grade: "yondan",
    niveau_requis: "4e Dan",
    video: { url: null, placeholder: "/videos/dan/yondan/kuden_2.mp4" },
    animation: { phases: 3, images: [null, null, null], placeholder: "/animations/dan/yondan/kuden_2/" }
  }
];

// =============================================================================
// STATISTIQUES ET UTILITAIRES
// =============================================================================

export const DAN_STATISTICS = {
  total: TECHNIQUES_DAN.length,
  par_grade: {
    shodan: TECHNIQUES_DAN.filter(t => t.grade === "shodan").length,
    nidan: TECHNIQUES_DAN.filter(t => t.grade === "nidan").length,
    sandan: TECHNIQUES_DAN.filter(t => t.grade === "sandan").length,
    yondan: TECHNIQUES_DAN.filter(t => t.grade === "yondan").length,
  },
  videos_disponibles: TECHNIQUES_DAN.filter(t => t.video.url !== null).length,
  animations_disponibles: TECHNIQUES_DAN.filter(t => t.animation.images[0] !== null).length
};

// Obtenir les techniques par grade
export const getTechniquesByGrade = (grade) => {
  return TECHNIQUES_DAN.filter(t => t.grade === grade);
};

export default TECHNIQUES_DAN;
