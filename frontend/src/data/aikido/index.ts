/**
 * 🥋 WAYOFDOJO — INDEX DES DONNÉES AIKIDO
 * 
 * Point d'entrée central pour toutes les données techniques
 * de l'Aïkido migrées depuis AIKIDO@GAME.
 * 
 * Usage:
 * import { UKEMI, KANSETSU_WAZA, TECHNIQUES_JO, ... } from '@/data/aikido';
 */

// =============================================================================
// TYPES
// =============================================================================
export * from './types';

// =============================================================================
// MOUVEMENTS - UKEMI (CHUTES)
// =============================================================================
export { 
  UKEMI, 
  UKEMI_STATS, 
  getUkemiByNiveau, 
  getUkemiByCategorie 
} from './mouvements/ukemi';

// =============================================================================
// MOUVEMENTS - KANSETSU WAZA (TECHNIQUES ARTICULAIRES)
// =============================================================================
export { 
  KANSETSU_WAZA, 
  KANSETSU_WAZA_STATS, 
  getKansetsuByNiveau, 
  getKansetsuByCategorie 
} from './mouvements/kansetsu-waza';

// =============================================================================
// MOUVEMENTS - TAI SABAKI (DÉPLACEMENTS)
// =============================================================================
export { 
  TAI_SABAKI, 
  TAI_SABAKI_STATS, 
  getTaiSabakiByNiveau, 
  getTaiSabakiByCategorie 
} from './mouvements/tai-sabaki';

// =============================================================================
// MOUVEMENTS - KAMAE (POSTURES)
// =============================================================================
export {
  KAMAE,
  KAMAE_STATS,
  getKamaeById,
  getKamaeByNiveau,
  getKamaeByCategorie,
} from './mouvements/kamae';

// =============================================================================
// MOUVEMENTS - SUWARIWAZA (TECHNIQUES À GENOUX) - NOUVEAU
// =============================================================================
export {
  SUWARIWAZA,
  SUWARIWAZA_STATS,
  getSuwariwazaByNiveau,
  getSuwariwazaByCategorie,
} from './mouvements/suwariwaza';

// =============================================================================
// MOUVEMENTS - ATEMI (TECHNIQUES DE FRAPPE) - NOUVEAU
// =============================================================================
export {
  ATEMI,
  ATEMI_STATS,
  getAtemiByNiveau,
  getAtemiByCategorie,
} from './mouvements/atemi';

// =============================================================================
// MOUVEMENTS - HANMI HANDACHI (SEMI-DEBOUT) - NOUVEAU
// =============================================================================
export {
  HANMI_HANDACHI,
  HANMI_HANDACHI_STATS,
  getHanmiHandachiByNiveau,
  getHanmiHandachiByCategorie,
} from './mouvements/hanmi-handachi';

// =============================================================================
// MOUVEMENTS - KOKYU WAZA (TECHNIQUES DE RESPIRATION) - NOUVEAU
// =============================================================================
export {
  KOKYU_WAZA,
  KOKYU_WAZA_STATS,
  getKokyuWazaByNiveau,
  getKokyuWazaByCategorie,
} from './mouvements/kokyu-waza';

// =============================================================================
// ARMES - JO (BÂTON)
// =============================================================================
export { 
  TECHNIQUES_JO, 
  JO_STATISTICS, 
  getJoByNiveau, 
  getJoByType,
  default as Jo 
} from './armes/jo';

// =============================================================================
// ARMES - TANTO (COUTEAU)
// =============================================================================
export { 
  TECHNIQUES_TANTO, 
  TANTO_STATISTICS, 
  getTantoByNiveau, 
  getTantoByAttaque,
  default as Tanto 
} from './armes/tanto';

// =============================================================================
// ARMES - BOKKEN (SABRE)
// =============================================================================
export { 
  TECHNIQUES_BOKKEN, 
  BOKKEN_STATISTICS, 
  getBokkenByNiveau, 
  getBokkenByType,
  default as Bokken 
} from './armes/bokken';

// =============================================================================
// GRADES DAN
// =============================================================================
export {
  GRADES_DAN,
  TECHNIQUES_SHODAN,
  TECHNIQUES_NIDAN,
  TECHNIQUES_SANDAN,
  getGradeInfo,
  getTechniquesByDan,
  getAllDanTechniques,
} from './grades/dan';

// =============================================================================
// PASSAGES DE GRADES (PROGRAMME COMPLET) - NOUVEAU
// =============================================================================
export {
  PASSAGES_DE_GRADES,
  getProgrammeGrade,
  getGradesKyu,
  getGradesDan,
  getNombreTechniquesGrade,
  GRADES_STATISTICS,
} from './grades/passages-de-grades';

export type {
  ElementProgramme,
  CategorieProgramme,
  TechniqueRequise,
  ProgrammeGrade,
} from './grades/passages-de-grades';

// =============================================================================
// STATISTIQUES GLOBALES
// =============================================================================
import { UKEMI } from './mouvements/ukemi';
import { KANSETSU_WAZA } from './mouvements/kansetsu-waza';
import { TAI_SABAKI } from './mouvements/tai-sabaki';
import { KAMAE } from './mouvements/kamae';
import { SUWARIWAZA } from './mouvements/suwariwaza';
import { ATEMI } from './mouvements/atemi';
import { HANMI_HANDACHI } from './mouvements/hanmi-handachi';
import { KOKYU_WAZA } from './mouvements/kokyu-waza';
import { TECHNIQUES_JO } from './armes/jo';
import { TECHNIQUES_TANTO } from './armes/tanto';
import { TECHNIQUES_BOKKEN } from './armes/bokken';
import { getAllDanTechniques } from './grades/dan';

export const AIKIDO_GLOBAL_STATS = {
  mouvements: {
    ukemi: UKEMI.length,
    kansetsu_waza: KANSETSU_WAZA.length,
    tai_sabaki: TAI_SABAKI.length,
    kamae: KAMAE.length,
    suwariwaza: SUWARIWAZA.length,
    atemi: ATEMI.length,
    hanmi_handachi: HANMI_HANDACHI.length,
    kokyu_waza: KOKYU_WAZA.length,
    total: UKEMI.length + KANSETSU_WAZA.length + TAI_SABAKI.length + KAMAE.length + 
           SUWARIWAZA.length + ATEMI.length + HANMI_HANDACHI.length + KOKYU_WAZA.length,
  },
  armes: {
    jo: TECHNIQUES_JO.length,
    tanto: TECHNIQUES_TANTO.length,
    bokken: TECHNIQUES_BOKKEN.length,
    total: TECHNIQUES_JO.length + TECHNIQUES_TANTO.length + TECHNIQUES_BOKKEN.length,
  },
  grades_dan: getAllDanTechniques().length,
  total_general: (
    UKEMI.length + 
    KANSETSU_WAZA.length + 
    TAI_SABAKI.length + 
    KAMAE.length +
    SUWARIWAZA.length +
    ATEMI.length +
    HANMI_HANDACHI.length +
    KOKYU_WAZA.length +
    TECHNIQUES_JO.length + 
    TECHNIQUES_TANTO.length + 
    TECHNIQUES_BOKKEN.length +
    getAllDanTechniques().length
  ),
};
