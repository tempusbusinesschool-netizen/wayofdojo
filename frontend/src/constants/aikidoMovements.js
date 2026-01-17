/**
 * AIKIDO@GAME — STRUCTURE DES MOUVEMENTS EN 3 PHASES
 * 
 * Phase 1 : ENTRÉE (Attaque/Saisie + Déplacement)
 * Phase 2 : TECHNIQUE (Technique + Direction Omote/Ura)
 * Phase 3 : FINAL (Immobilisation Osae ou Chute Ukemi)
 * 
 * Note : Omote/Ura est un attribut de la Phase 2 (Technique)
 * mais définit aussi la direction globale du mouvement entier.
 */

// =============================================================================
// PHASE 1 — ENTRÉE
// =============================================================================

/**
 * Attaques et Saisies
 * L'énergie initiale du mouvement - Uke initie le contact
 */
export const ATTAQUES_SAISIES = {
  // Saisies (Statiques)
  saisies: [
    { id: "katate_dori", name: "Katate Dori", description: "Saisie d'un poignet", type: "statique" },
    { id: "ai_hanmi_katate_dori", name: "Ai Hanmi Katate Dori", description: "Saisie en garde identique", type: "statique" },
    { id: "gyaku_hanmi_katate_dori", name: "Gyaku Hanmi Katate Dori", description: "Saisie en garde inverse", type: "statique" },
    { id: "ryote_dori", name: "Ryote Dori", description: "Saisie des deux poignets", type: "statique" },
    { id: "kata_dori", name: "Kata Dori", description: "Saisie de l'épaule", type: "statique" },
    { id: "mune_dori", name: "Mune Dori", description: "Saisie du revers", type: "statique" },
    { id: "ushiro_ryote_dori", name: "Ushiro Ryote Dori", description: "Saisie arrière des deux poignets", type: "statique" },
    { id: "ushiro_kubi_shime", name: "Ushiro Kubi Shime", description: "Étranglement arrière", type: "statique" },
  ],
  
  // Frappes (Dynamiques)
  frappes: [
    { id: "shomen_uchi", name: "Shomen Uchi", description: "Frappe verticale descendante sur la tête", type: "dynamique" },
    { id: "yokomen_uchi", name: "Yokomen Uchi", description: "Frappe latérale à la tempe", type: "dynamique" },
    { id: "chudan_tsuki", name: "Chudan Tsuki", description: "Coup de poing direct au ventre", type: "dynamique" },
    { id: "jodan_tsuki", name: "Jodan Tsuki", description: "Coup de poing direct au visage", type: "dynamique" },
    { id: "mae_geri", name: "Mae Geri", description: "Coup de pied avant", type: "dynamique" },
    { id: "kata_dori_men_uchi", name: "Kata Dori Men Uchi", description: "Saisie épaule + frappe à la tête", type: "dynamique" },
    { id: "mune_dori_tsuki", name: "Mune Dori Tsuki", description: "Saisie revers + coup de poing", type: "dynamique" },
    { id: "tanto_dori", name: "Tanto Dori", description: "Attaque au couteau", type: "dynamique" },
  ]
};

/**
 * Déplacements (Tai Sabaki)
 * Comment Tori se positionne en réponse à l'attaque
 */
export const DEPLACEMENTS = [
  { id: "irimi", name: "Irimi", description: "Entrer directement" },
  { id: "tenkan", name: "Tenkan", description: "Pivoter 180°" },
  { id: "irimi_tenkan", name: "Irimi Tenkan", description: "Entrer puis pivoter" },
];

// =============================================================================
// PHASE 2 — TECHNIQUE
// =============================================================================

/**
 * Techniques principales
 * Le cœur du mouvement - avec direction Omote (devant) ou Ura (derrière)
 */
export const TECHNIQUES = {
  // Immobilisations (Osae Waza) - techniques de contrôle
  immobilisations: [
    { id: "ikkyo", name: "Ikkyo", description: "1ère technique - contrôle du coude et épaule", hasOmoteUra: true },
    { id: "nikyo", name: "Nikyo", description: "2e technique - torsion du poignet, contrôle nerveux", hasOmoteUra: true },
    { id: "sankyo", name: "Sankyo", description: "3e technique - contrôle spiralé du poignet", hasOmoteUra: true },
    { id: "yonkyo", name: "Yonkyo", description: "4e technique - pression sur l'avant-bras, contrôle nerveux", hasOmoteUra: true },
    { id: "gokyo", name: "Gokyo", description: "5e technique - tension structurelle contrôlée (articulaire : épaule, coude, poignet). Pas de compression nerveuse.", hasOmoteUra: true },
  ],
  
  // Projections (Nage Waza) - techniques de projection
  projections: [
    { id: "shiho_nage", name: "Shiho Nage", description: "Projection dans les 4 directions", hasOmoteUra: true },
    { id: "irimi_nage", name: "Irimi Nage", description: "Projection en entrant", hasOmoteUra: true },
    { id: "kote_gaeshi", name: "Kote Gaeshi", description: "Retournement du poignet", hasOmoteUra: false },
    { id: "kaiten_nage", name: "Kaiten Nage", description: "Projection rotative", hasOmoteUra: false, variants: ["uchi", "soto"] },
    { id: "tenchi_nage", name: "Tenchi Nage", description: "Projection ciel-terre", hasOmoteUra: false },
    { id: "koshi_nage", name: "Koshi Nage", description: "Projection de hanche", hasOmoteUra: false },
    { id: "sumi_otoshi", name: "Sumi Otoshi", description: "Projection dans l'angle", hasOmoteUra: false },
    { id: "aiki_otoshi", name: "Aiki Otoshi", description: "Projection Aiki", hasOmoteUra: false },
    { id: "kokyu_nage", name: "Kokyu Nage", description: "Projection par le souffle", hasOmoteUra: false },
  ]
};

/**
 * Directions du mouvement
 * Définit où Tori termine par rapport à sa position de départ
 */
export const DIRECTIONS = [
  { id: "omote", name: "Omote", kanji: "表", description: "Devant - Tori termine devant sa position de départ" },
  { id: "ura", name: "Ura", kanji: "裏", description: "Derrière - Tori termine derrière sa position de départ" },
];

// =============================================================================
// PHASE 3 — FINAL
// =============================================================================

/**
 * Immobilisations finales (Osae-waza)
 * Contrôle et sécurisation de Uke au sol
 */
export const IMMOBILISATIONS_FINALES = {
  // Fondamentales
  fondamentales: [
    { id: "ikkyo_osae", name: "Ikkyo Osae", description: "Contrôle du bras par levier sur le coude et l'épaule" },
    { id: "nikyo_osae", name: "Nikyo Osae", description: "Immobilisation par torsion du poignet, contrôle nerveux" },
    { id: "sankyo_osae", name: "Sankyo Osae", description: "Contrôle spiralé du poignet et de l'avant-bras" },
    { id: "yonkyo_osae", name: "Yonkyo Osae", description: "Pression ciblée sur l'avant-bras, contrôle nerveux" },
    { id: "gokyo_osae", name: "Gokyo Osae", description: "Tension structurelle contrôlée (articulaire : épaule, coude, poignet en extension). Pas de compression nerveuse." },
  ],
  
  // Complémentaires / Variantes
  complementaires: [
    { id: "hijikime_osae", name: "Hijikime Osae", description: "Immobilisation par contrôle du coude" },
    { id: "udekime_osae", name: "Udekime Osae", description: "Immobilisation par contrôle de l'avant-bras" },
    { id: "kote_gaeshi_osae", name: "Kote Gaeshi Osae", description: "Immobilisation après projection par torsion du poignet" },
    { id: "shiho_nage_osae", name: "Shiho Nage Osae", description: "Immobilisation après projection 4 directions" },
  ]
};

/**
 * Chutes (Ukemi)
 * Comment Uke reçoit la technique et se protège
 */
export const CHUTES = {
  // Chutes de base
  base: [
    { id: "mae_ukemi", name: "Mae Ukemi", description: "Chute avant roulée" },
    { id: "ushiro_ukemi", name: "Ushiro Ukemi", description: "Chute arrière" },
  ],
  
  // Chutes latérales
  laterales: [
    { id: "yoko_ukemi", name: "Yoko Ukemi", description: "Chute sur le côté" },
  ],
  
  // Chutes de projection
  projection: [
    { id: "tobi_ukemi", name: "Tobi Ukemi", description: "Chute avec envol (projection haute)" },
    { id: "kaiten_ukemi", name: "Kaiten Ukemi", description: "Chute roulée circulaire après projection" },
  ],
  
  // Chutes contrôlées
  controlees: [
    { id: "chute_assise", name: "Chute Assise", description: "Absorption d'une projection sans roulade" },
    { id: "chute_amortie", name: "Chute Amortie", description: "Chute basse (débutants/enfants)" },
  ]
};

// =============================================================================
// STRUCTURE COMPLÈTE D'UN MOUVEMENT
// =============================================================================

/**
 * Exemple de structure d'un mouvement complet
 * 
 * {
 *   id: "ai_hanmi_katate_dori_ikkyo_omote",
 *   phase1: {
 *     attaque: "ai_hanmi_katate_dori",
 *     deplacement: "irimi"
 *   },
 *   phase2: {
 *     technique: "ikkyo",
 *     direction: "omote"
 *   },
 *   phase3: {
 *     final: "ikkyo_osae",
 *     type: "immobilisation"
 *   }
 * }
 */

// =============================================================================
// FONCTIONS UTILITAIRES
// =============================================================================

/**
 * Récupère toutes les attaques/saisies
 */
export const getAllAttaquesSaisies = () => {
  return [...ATTAQUES_SAISIES.saisies, ...ATTAQUES_SAISIES.frappes];
};

/**
 * Récupère toutes les techniques
 */
export const getAllTechniques = () => {
  return [...TECHNIQUES.immobilisations, ...TECHNIQUES.projections];
};

/**
 * Récupère toutes les immobilisations finales
 */
export const getAllImmobilisationsFinales = () => {
  return [...IMMOBILISATIONS_FINALES.fondamentales, ...IMMOBILISATIONS_FINALES.complementaires];
};

/**
 * Récupère toutes les chutes
 */
export const getAllChutes = () => {
  return [
    ...CHUTES.base,
    ...CHUTES.laterales,
    ...CHUTES.projection,
    ...CHUTES.controlees
  ];
};

/**
 * Récupère tous les éléments de la Phase 3 (Final)
 */
export const getAllFinaux = () => {
  return [
    ...getAllImmobilisationsFinales().map(i => ({ ...i, type: "immobilisation" })),
    ...getAllChutes().map(c => ({ ...c, type: "chute" }))
  ];
};

/**
 * Génère le nom complet d'un mouvement
 */
export const generateMovementName = (attaqueId, techniqueId, direction) => {
  const attaque = getAllAttaquesSaisies().find(a => a.id === attaqueId);
  const technique = getAllTechniques().find(t => t.id === techniqueId);
  const dir = DIRECTIONS.find(d => d.id === direction);
  
  if (!attaque || !technique) return null;
  
  let name = `${attaque.name} → ${technique.name}`;
  if (technique.hasOmoteUra && dir) {
    name += ` ${dir.name}`;
  }
  
  return name;
};

/**
 * Statistiques de la base
 */
export const getStatistics = () => {
  return {
    phase1: {
      attaques_saisies: getAllAttaquesSaisies().length,
      deplacements: DEPLACEMENTS.length,
    },
    phase2: {
      techniques: getAllTechniques().length,
      directions: DIRECTIONS.length,
    },
    phase3: {
      immobilisations: getAllImmobilisationsFinales().length,
      chutes: getAllChutes().length,
    },
    total: {
      phase1: getAllAttaquesSaisies().length + DEPLACEMENTS.length,
      phase2: getAllTechniques().length,
      phase3: getAllFinaux().length,
    }
  };
};

export default {
  ATTAQUES_SAISIES,
  DEPLACEMENTS,
  TECHNIQUES,
  DIRECTIONS,
  IMMOBILISATIONS_FINALES,
  CHUTES,
  getAllAttaquesSaisies,
  getAllTechniques,
  getAllImmobilisationsFinales,
  getAllChutes,
  getAllFinaux,
  generateMovementName,
  getStatistics,
};
