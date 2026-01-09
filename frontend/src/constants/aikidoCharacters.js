/**
 * AIKIDO CHARACTERS - Personnages 3D Pixar pour Aikido@Game
 * Ces personnages sont utilisés dans différents contextes de l'application
 */

export const AIKIDO_CHARACTERS = {
  // ═══════════════════════════════════════════════════════════════
  // PERSONNAGES PRINCIPAUX (Sélection d'âge)
  // ═══════════════════════════════════════════════════════════════
  
  // Jeune Ninja - Garçon pour les moins de 14 ans
  JEUNE_NINJA: "https://static.prod-images.emergentagent.com/jobs/0861cc2c-f338-47d7-8ee3-39d115cba3cc/images/7a1daf46a57ead9f272f2abfa021b9093277cf586a19a7ccea9471f4461c19ae.png",
  
  // Duo adultes - Femme et homme pour les plus de 14 ans
  NINJA_CONFIRME: "https://static.prod-images.emergentagent.com/jobs/0861cc2c-f338-47d7-8ee3-39d115cba3cc/images/11511822157d76c591ac8107c5dc1cd0fbe68fdec64747472c56fa176ae705d0.png",

  // Homme seul - pour superposition bandeau (fond gradient bleu-cyan assorti)
  HOMME_SEUL: "https://static.prod-images.emergentagent.com/jobs/e17d73c6-86f0-4c7d-be1f-5c1a2a26eb2f/images/d67c33c961c5b2b0f6b82a7f873c67abc96cda02952539c41b54a53f07c946c6.png",
  
  // Femme seule - pour superposition bandeau (fond gradient violet-bleu assorti)
  FEMME_SEULE: "https://static.prod-images.emergentagent.com/jobs/e17d73c6-86f0-4c7d-be1f-5c1a2a26eb2f/images/554b5a071a6815e8e623bf918f7f37018f1095cef2b16278970a0f1206a10624.png",

  // ═══════════════════════════════════════════════════════════════
  // ENFANT - Différentes poses et émotions
  // ═══════════════════════════════════════════════════════════════
  
  // Célébration - Saute de joie avec confettis (succès, +XP, badge)
  ENFANT_CELEBRATION: "https://static.prod-images.emergentagent.com/jobs/0861cc2c-f338-47d7-8ee3-39d115cba3cc/images/260c43bc7fcf8f0e263b936b676dfe30299bb2aab804ce05a8220da61bbe09a1.png",
  
  // Salut - Pose Rei respectueuse (bienvenue, accueil)
  ENFANT_SALUT: "https://static.prod-images.emergentagent.com/jobs/0861cc2c-f338-47d7-8ee3-39d115cba3cc/images/ac804ea2ceb57f0a06edc3f738ae15cc808eaf50425143aa3670c8890c7ac5c7.png",
  
  // Méditation - Position lotus paisible (états vides, chargement)
  ENFANT_MEDITATION: "https://static.prod-images.emergentagent.com/jobs/0861cc2c-f338-47d7-8ee3-39d115cba3cc/images/ed49c539ae7a6bfe6c7c08a192289b3c82e2ccce02207c6f73dd8707050da15e.png",
  
  // Confus - Se gratte la tête avec point d'interrogation (erreur 404, aide)
  ENFANT_CONFUS: "https://static.prod-images.emergentagent.com/jobs/0861cc2c-f338-47d7-8ee3-39d115cba3cc/images/ce4fa670f1e5118240466aba2120396aa295d55b004c34473db7d847f706b571.png",
  
  // Technique - En action sur le tatami (chargement, progression)
  ENFANT_TECHNIQUE: "https://static.prod-images.emergentagent.com/jobs/0861cc2c-f338-47d7-8ee3-39d115cba3cc/images/b6be6b16632a21db9925c7ffc7b3b35e0620f6cd3879bca2cf88e2450de9abe3.png",

  // ═══════════════════════════════════════════════════════════════
  // ADULTES - Duo femme/homme
  // ═══════════════════════════════════════════════════════════════
  
  // Validation - Thumbs up approbateur (validation parent, succès)
  ADULTES_VALIDATION: "https://static.prod-images.emergentagent.com/jobs/0861cc2c-f338-47d7-8ee3-39d115cba3cc/images/ba671f765cb4dca787cfedf303dd0de9a6c6f59e93a101ddd7b61145057b75fc.png",
};

// Helpers pour obtenir le bon personnage selon le contexte
export const getCharacterForContext = (context, mode = 'enfant') => {
  const characters = {
    // Succès et célébrations
    success: AIKIDO_CHARACTERS.ENFANT_CELEBRATION,
    celebration: AIKIDO_CHARACTERS.ENFANT_CELEBRATION,
    xp_gained: AIKIDO_CHARACTERS.ENFANT_CELEBRATION,
    badge_unlocked: AIKIDO_CHARACTERS.ENFANT_CELEBRATION,
    level_up: AIKIDO_CHARACTERS.ENFANT_CELEBRATION,
    
    // Bienvenue et salutations
    welcome: AIKIDO_CHARACTERS.ENFANT_SALUT,
    greeting: AIKIDO_CHARACTERS.ENFANT_SALUT,
    onboarding: AIKIDO_CHARACTERS.ENFANT_SALUT,
    
    // États calmes et vides
    empty: AIKIDO_CHARACTERS.ENFANT_MEDITATION,
    loading: AIKIDO_CHARACTERS.ENFANT_MEDITATION,
    meditation: AIKIDO_CHARACTERS.ENFANT_MEDITATION,
    no_data: AIKIDO_CHARACTERS.ENFANT_MEDITATION,
    
    // Erreurs et confusion
    error: AIKIDO_CHARACTERS.ENFANT_CONFUS,
    not_found: AIKIDO_CHARACTERS.ENFANT_CONFUS,
    help: AIKIDO_CHARACTERS.ENFANT_CONFUS,
    
    // Action et technique
    technique: AIKIDO_CHARACTERS.ENFANT_TECHNIQUE,
    training: AIKIDO_CHARACTERS.ENFANT_TECHNIQUE,
    practice: AIKIDO_CHARACTERS.ENFANT_TECHNIQUE,
    
    // Validation parentale
    parent_validation: AIKIDO_CHARACTERS.ADULTES_VALIDATION,
    approved: AIKIDO_CHARACTERS.ADULTES_VALIDATION,
  };
  
  return characters[context] || AIKIDO_CHARACTERS.ENFANT_SALUT;
};

export default AIKIDO_CHARACTERS;
