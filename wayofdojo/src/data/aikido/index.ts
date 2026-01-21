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
// MOUVEMENTS
// =============================================================================
export { 
  UKEMI, 
  UKEMI_STATS, 
  getUkemiByNiveau, 
  getUkemiByCategorie 
} from './mouvements/ukemi';

export { 
  KANSETSU_WAZA, 
  KANSETSU_WAZA_STATS, 
  getKansetsuByNiveau, 
  getKansetsuByCategorie 
} from './mouvements/kansetsu-waza';

export { 
  TAI_SABAKI, 
  TAI_SABAKI_STATS, 
  getTaiSabakiByNiveau, 
  getTaiSabakiByCategorie 
} from './mouvements/tai-sabaki';

// =============================================================================
// ARMES
// =============================================================================
export { 
  TECHNIQUES_JO, 
  JO_STATISTICS, 
  getJoByNiveau, 
  getJoByType,
  default as Jo 
} from './armes/jo';

export { 
  TECHNIQUES_TANTO, 
  TANTO_STATISTICS, 
  getTantoByNiveau, 
  getTantoByAttaque,
  default as Tanto 
} from './armes/tanto';

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
// STATISTIQUES GLOBALES
// =============================================================================
import { UKEMI } from './mouvements/ukemi';
import { KANSETSU_WAZA } from './mouvements/kansetsu-waza';
import { TAI_SABAKI } from './mouvements/tai-sabaki';
import { TECHNIQUES_JO } from './armes/jo';
import { TECHNIQUES_TANTO } from './armes/tanto';
import { TECHNIQUES_BOKKEN } from './armes/bokken';
import { getAllDanTechniques } from './grades/dan';

export const AIKIDO_GLOBAL_STATS = {
  mouvements: {
    ukemi: UKEMI.length,
    kansetsu_waza: KANSETSU_WAZA.length,
    tai_sabaki: TAI_SABAKI.length,
    total: UKEMI.length + KANSETSU_WAZA.length + TAI_SABAKI.length,
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
    TECHNIQUES_JO.length + 
    TECHNIQUES_TANTO.length + 
    TECHNIQUES_BOKKEN.length +
    getAllDanTechniques().length
  ),
};
