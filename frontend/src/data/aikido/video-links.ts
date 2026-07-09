/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * WAYOFDOJO - LIENS VIDÉO YOUTUBE POUR LES TECHNIQUES
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Collection de liens vers des tutoriels YouTube de qualité pour chaque technique.
 * Ces vidéos ont été sélectionnées pour leur qualité pédagogique et leur pertinence.
 */

export interface VideoLink {
  url: string;
  title: string;
  channel: string;
  duration?: string;
  language: 'fr' | 'en' | 'jp';
  description?: string;
}

export interface TechniqueVideos {
  primary: VideoLink;
  alternatives?: VideoLink[];
}

/**
 * Liens vidéo organisés par ID de technique/mouvement
 */
export const VIDEO_LINKS: Record<string, TechniqueVideos> = {
  // ═══════════════════════════════════════════════════════════════
  // UKEMI (CHUTES)
  // ═══════════════════════════════════════════════════════════════
  
  mae_ukemi: {
    primary: {
      url: 'https://www.youtube.com/watch?v=k4pJciQfj0Y',
      title: 'How to do MAE UKEMI (front roll) in AIKIDO [TUTORIAL]',
      channel: 'Mihaly Dobroka',
      duration: '7:15',
      language: 'en',
      description: 'Tutoriel complet avec progression du niveau débutant au niveau avancé'
    },
    alternatives: [
      {
        url: 'https://www.youtube.com/watch?v=1076_X8FBnw',
        title: 'Complete Forward Roll Tutorial',
        channel: 'Aikido',
        language: 'en',
        description: 'Couvre les variantes seiza, genoux et debout'
      },
      {
        url: 'https://www.youtube.com/watch?v=cIiQahBpZrA',
        title: 'Safe Standing Rolls',
        channel: 'Mihaly Dobroka',
        language: 'en'
      }
    ]
  },

  ushiro_ukemi: {
    primary: {
      url: 'https://www.youtube.com/watch?v=yAD0ZsyudkA',
      title: '[TUTORIAL] How to do USHIRO AIKIDO UKEMI',
      channel: 'Mihaly Dobroka',
      language: 'en',
      description: 'Progression détaillée depuis la position assise jusqu\'à debout'
    },
    alternatives: [
      {
        url: 'https://www.youtube.com/watch?v=e4TKYhqUwXk',
        title: 'How to do Ushiro Ukemi Backward Roll',
        channel: 'Aikido Tutorials',
        language: 'en'
      },
      {
        url: 'https://www.youtube.com/watch?v=fgv_SFQVQTo',
        title: 'Ushiro Otoshi (drop-back)',
        channel: 'Aikido',
        language: 'en',
        description: 'Version avancée avec partenaire'
      }
    ]
  },

  yoko_ukemi: {
    primary: {
      url: 'https://www.youtube.com/watch?v=6fPjiEQueCI',
      title: 'UKEMI - Side Fall and Back Fall Exercises',
      channel: 'Castle Rock AIKIDO',
      duration: '14:12',
      language: 'en',
      description: 'Exercices de base à intermédiaire avec accent sur la protection'
    },
    alternatives: [
      {
        url: 'https://www.youtube.com/watch?v=QV0DCUaRIec',
        title: 'Yoko-Ukemi',
        channel: 'Aikido',
        language: 'en',
        description: 'Progression depuis le sol jusqu\'à debout'
      },
      {
        url: 'https://www.youtube.com/watch?v=eg1qD8bLzoc',
        title: 'Yoko Ukemi -- Basic Side Fall',
        channel: 'DC Aikido Martial Arts',
        duration: '1:50',
        language: 'en'
      }
    ]
  },

  zenpo_kaiten_ukemi: {
    primary: {
      url: 'https://www.youtube.com/watch?v=AOrJSFySFzY',
      title: 'Aikido Basic Drills and Variations',
      channel: 'Mihaly Dobroka',
      language: 'en',
      description: 'Exercices de roulade avant continue'
    },
    alternatives: [
      {
        url: 'https://www.youtube.com/watch?v=-mcFX-llYlg',
        title: 'Quick Forward Roll Steps',
        channel: 'Aikido',
        language: 'en'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // TAI SABAKI (DÉPLACEMENTS)
  // ═══════════════════════════════════════════════════════════════

  irimi: {
    primary: {
      url: 'https://www.youtube.com/watch?v=4mk5pT3QB8E',
      title: 'Aikido Drills #5 Tai Sabaki',
      channel: 'Aikido Martial Fusion Zenbu Dojo',
      language: 'en',
      description: 'Déplacements de base avec irimi tenkan'
    },
    alternatives: [
      {
        url: 'https://www.youtube.com/watch?v=5jY2T0v0G3k',
        title: 'Irimi in Realistic Combat',
        channel: 'Aikido',
        language: 'en'
      }
    ]
  },

  tenkan: {
    primary: {
      url: 'https://www.youtube.com/watch?v=oRcRA4zp8mM',
      title: 'Basic Footwork: Tenkan and Irimi',
      channel: 'NOLA Aikido',
      language: 'en',
      description: 'Variations de tenkan avec erreurs communes'
    },
    alternatives: [
      {
        url: 'https://www.youtube.com/watch?v=RzSjODlmSZQ',
        title: 'Basic Step Irimi Tenkan',
        channel: 'Traditional AIKIDO School Rostock',
        language: 'en'
      }
    ]
  },

  irimi_tenkan: {
    primary: {
      url: 'https://www.youtube.com/watch?v=7WUCpsmuIpY',
      title: 'Irimi Tenkan - Young Samurai',
      channel: 'DC Aikido',
      language: 'en',
      description: 'Placement des pieds et pivot depuis le centre'
    },
    alternatives: [
      {
        url: 'https://www.youtube.com/watch?v=4mk5pT3QB8E',
        title: 'Tai Sabaki Drills',
        channel: 'Aikido Martial Fusion',
        language: 'en'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // KAMAE (POSTURES)
  // ═══════════════════════════════════════════════════════════════

  ai_hanmi: {
    primary: {
      url: 'https://www.youtube.com/watch?v=Eu3_bbnE-6g',
      title: 'Aikido the stance structure complete tutorial',
      channel: 'SAA BPM',
      language: 'en',
      description: 'Structure complète avec transfert de poids et préparation'
    },
    alternatives: [
      {
        url: 'https://www.youtube.com/watch?v=Zflds16vfxE',
        title: 'Kamae! Aikido Body Positions',
        channel: 'Hiroaki Izumi Sensei',
        language: 'en'
      }
    ]
  },

  gyaku_hanmi: {
    primary: {
      url: 'https://www.youtube.com/watch?v=13HK7Aa9jb0',
      title: 'Aikido Kamae | Basics',
      channel: 'Aikido',
      language: 'en',
      description: 'Centre (hara) et concept "big belly"'
    },
    alternatives: [
      {
        url: 'https://www.youtube.com/watch?v=puSA5rVoXUQ',
        title: 'Aikido Kamae Instructional',
        channel: 'Aikido',
        language: 'en'
      }
    ]
  },

  seiza: {
    primary: {
      url: 'https://www.youtube.com/watch?v=X7tmao_rlNI',
      title: '[TUTORIAL] Sitting in SEIZA and BOWING in AIKIDO',
      channel: 'Aikido',
      duration: '11:00',
      language: 'en',
      description: 'Processus complet: s\'agenouiller, position, salut'
    },
    alternatives: [
      {
        url: 'https://www.youtube.com/watch?v=fsCf5ayJvtw',
        title: 'How To Sit Seiza Like A Pro',
        channel: 'Japanese Traditions',
        language: 'en',
        description: 'Conseils pour soulager la douleur'
      },
      {
        url: 'https://www.youtube.com/watch?v=PIxA6f9bbGg',
        title: 'SEIZA & SHIKKO - Overlapping big toes explained',
        channel: 'Aikido',
        language: 'en'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // AUTRES TECHNIQUES DE BASE
  // ═══════════════════════════════════════════════════════════════

  shikko: {
    primary: {
      url: 'https://www.youtube.com/watch?v=PIxA6f9bbGg',
      title: 'SEIZA & SHIKKO Tutorial',
      channel: 'Aikido',
      language: 'en',
      description: 'Déplacement à genoux (knee walking)'
    }
  },

  tsugi_ashi: {
    primary: {
      url: 'https://www.youtube.com/watch?v=4mk5pT3QB8E',
      title: 'Aikido Footwork Drills',
      channel: 'Aikido Martial Fusion',
      language: 'en',
      description: 'Pas glissé et autres déplacements de base'
    }
  },

  ayumi_ashi: {
    primary: {
      url: 'https://www.youtube.com/watch?v=4mk5pT3QB8E',
      title: 'Aikido Footwork Drills',
      channel: 'Aikido Martial Fusion',
      language: 'en',
      description: 'Pas de marche naturel en Aikido'
    }
  }
};

/**
 * Récupère les liens vidéo pour une technique donnée
 */
export function getVideoLinks(techniqueId: string): TechniqueVideos | null {
  return VIDEO_LINKS[techniqueId] || null;
}

/**
 * Vérifie si une technique a des vidéos disponibles
 */
export function hasVideoLinks(techniqueId: string): boolean {
  return techniqueId in VIDEO_LINKS;
}

/**
 * Récupère le lien vidéo principal pour une technique
 */
export function getPrimaryVideoUrl(techniqueId: string): string | null {
  const videos = VIDEO_LINKS[techniqueId];
  return videos?.primary.url || null;
}

export default VIDEO_LINKS;
