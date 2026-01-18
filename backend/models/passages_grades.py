"""
🎓 PASSAGES DE GRADES - MODÈLES ET API
Programme officiel FFAAA (Fédération Française d'Aïkido Aïkibudo et Affinitaires)

Stockage côté serveur avec progression utilisateur.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum


class GradeLevel(str, Enum):
    KYU_6 = "6e_kyu"
    KYU_5 = "5e_kyu"
    KYU_4 = "4e_kyu"
    KYU_3 = "3e_kyu"
    KYU_2 = "2e_kyu"
    KYU_1 = "1er_kyu"
    DAN_1 = "shodan"
    DAN_2 = "nidan"
    DAN_3 = "sandan"
    DAN_4 = "yondan"


class CategorieExamen(str, Enum):
    TACHI_WAZA = "tachi_waza"  # Techniques debout
    SUWARI_WAZA = "suwari_waza"  # Techniques à genoux
    HANMI_HANDACHI = "hanmi_handachi"  # Tori à genoux, Uke debout
    USHIRO_WAZA = "ushiro_waza"  # Attaques par l'arrière
    TANTO_DORI = "tanto_dori"  # Défense contre couteau
    JO_DORI = "jo_dori"  # Défense contre bâton
    TACHI_DORI = "tachi_dori"  # Défense contre sabre
    BUKIWAZA = "bukiwaza"  # Travail aux armes
    JIYU_WAZA = "jiyu_waza"  # Travail libre
    RANDORI = "randori"  # Attaques multiples


class TechniqueExamen(BaseModel):
    """Une technique requise pour un examen de grade"""
    id: str
    nom: str
    nom_japonais: Optional[str] = None
    attaque: str  # Ex: "Ai Hanmi Katate Dori"
    attaque_japonais: Optional[str] = None
    categorie: CategorieExamen
    variantes: List[str] = []  # Ex: ["Omote", "Ura"]
    obligatoire: bool = True
    points_cles: List[str] = []
    erreurs_communes: List[str] = []
    description: Optional[str] = None


class MouvementExamen(BaseModel):
    """Un mouvement/exercice requis pour un examen"""
    id: str
    nom: str
    nom_japonais: Optional[str] = None
    categorie: str  # Ex: "ukemi", "tai_sabaki", "kamae"
    obligatoire: bool = True
    points_cles: List[str] = []
    erreurs_communes: List[str] = []
    description: Optional[str] = None


class GradeExamen(BaseModel):
    """Programme complet d'un grade selon FFAAA"""
    id: str
    grade: GradeLevel
    nom: str
    nom_japonais: str
    couleur_ceinture: str
    
    # Conditions d'accès
    delai_minimum: str  # Ex: "3 mois après 5e Kyu"
    heures_minimum: int  # Heures de pratique
    jours_minimum: int  # Jours de pratique
    prerequis: Optional[str] = None
    
    # Programme
    mouvements: List[MouvementExamen] = []
    techniques: List[TechniqueExamen] = []
    
    # Évaluation
    criteres_evaluation: List[str] = []
    duree_examen: Optional[str] = None
    
    # Méta
    description: Optional[str] = None
    objectifs: List[str] = []


class UserGradeProgress(BaseModel):
    """Progression d'un utilisateur sur un grade"""
    user_id: str
    grade_id: str
    
    # Techniques validées
    techniques_validees: List[str] = []  # IDs des techniques
    mouvements_valides: List[str] = []  # IDs des mouvements
    
    # Stats
    date_debut: Optional[datetime] = None
    date_validation: Optional[datetime] = None
    heures_pratique: int = 0
    notes: Optional[str] = None
    
    # État
    en_cours: bool = False
    valide: bool = False


# ============================================================================
# PROGRAMME OFFICIEL FFAAA - DONNÉES COMPLÈTES
# ============================================================================

PROGRAMME_FFAAA = {
    "6e_kyu": {
        "id": "6e_kyu",
        "grade": "6e_kyu",
        "nom": "6e Kyu",
        "nom_japonais": "六級",
        "couleur_ceinture": "#FFFFFF",
        "delai_minimum": "Début de pratique",
        "heures_minimum": 20,
        "jours_minimum": 15,
        "prerequis": None,
        "description": "Premier grade. Découverte des fondamentaux de l'Aïkido.",
        "objectifs": [
            "Connaître l'étiquette du dojo (Reishiki)",
            "Maîtriser les chutes de base (Ukemi)",
            "Exécuter les déplacements fondamentaux (Tai Sabaki)",
            "Comprendre les positions de base (Kamae)"
        ],
        "mouvements": [
            # UKEMI
            {"id": "mae_ukemi", "nom": "Mae Ukemi", "nom_japonais": "前受身", "categorie": "ukemi", "obligatoire": True,
             "description": "Chute roulée avant", "points_cles": ["Bras en cercle", "Menton rentré", "Rouler sur l'épaule"], "erreurs_communes": ["Rouler sur la colonne", "Tête qui touche"]},
            {"id": "ushiro_ukemi", "nom": "Ushiro Ukemi", "nom_japonais": "後受身", "categorie": "ukemi", "obligatoire": True,
             "description": "Chute roulée arrière", "points_cles": ["S'asseoir d'abord", "Menton rentré", "Frapper le sol"], "erreurs_communes": ["Tomber à plat", "Tête qui touche"]},
            # TAI SABAKI
            {"id": "irimi", "nom": "Irimi", "nom_japonais": "入り身", "categorie": "tai_sabaki", "obligatoire": True,
             "description": "Entrée directe", "points_cles": ["Pas décisif", "Centre bas", "Regard vers partenaire"], "erreurs_communes": ["Hésitation", "Déséquilibre"]},
            {"id": "tenkan", "nom": "Tenkan", "nom_japonais": "転換", "categorie": "tai_sabaki", "obligatoire": True,
             "description": "Pivot 180°", "points_cles": ["Pivot sur plante du pied", "Maintenir contact"], "erreurs_communes": ["Pivot sur talon", "Perdre contact"]},
            {"id": "irimi_tenkan", "nom": "Irimi Tenkan", "nom_japonais": "入り身転換", "categorie": "tai_sabaki", "obligatoire": True,
             "description": "Entrée + Pivot", "points_cles": ["Enchaînement fluide", "Pas de temps d'arrêt"], "erreurs_communes": ["Saccade entre mouvements"]},
            # KAMAE
            {"id": "ai_hanmi", "nom": "Ai Hanmi", "nom_japonais": "相半身", "categorie": "kamae", "obligatoire": True,
             "description": "Garde identique", "points_cles": ["Même pied avant que partenaire"], "erreurs_communes": ["Mauvaise identification"]},
            {"id": "gyaku_hanmi", "nom": "Gyaku Hanmi", "nom_japonais": "逆半身", "categorie": "kamae", "obligatoire": True,
             "description": "Garde inversée", "points_cles": ["Pieds avant opposés"], "erreurs_communes": ["Confusion avec Ai Hanmi"]},
            # SEIZA / REISHIKI
            {"id": "seiza", "nom": "Seiza", "nom_japonais": "正座", "categorie": "reishiki", "obligatoire": True,
             "description": "Position assise formelle", "points_cles": ["Dos droit", "Mains sur cuisses"], "erreurs_communes": ["Dos courbé"]},
            {"id": "rei", "nom": "Rei", "nom_japonais": "礼", "categorie": "reishiki", "obligatoire": True,
             "description": "Salut", "points_cles": ["Incliner le buste", "Regard baissé"], "erreurs_communes": ["Salut trop rapide"]}
        ],
        "techniques": [
            # TACHI WAZA - Ai Hanmi Katate Dori
            {"id": "ahkd_ikkyo_o", "nom": "Ikkyo Omote", "nom_japonais": "一教表", "attaque": "Ai Hanmi Katate Dori", "attaque_japonais": "相半身片手取り", "categorie": "tachi_waza", "variantes": ["Omote"], "obligatoire": True,
             "description": "Contrôle du coude, côté ouvert", "points_cles": ["Contrôle du coude", "Extension du bras", "Maintien au sol"], "erreurs_communes": ["Perdre le coude", "Tirer au lieu de pousser"]},
            {"id": "ahkd_ikkyo_u", "nom": "Ikkyo Ura", "nom_japonais": "一教裏", "attaque": "Ai Hanmi Katate Dori", "attaque_japonais": "相半身片手取り", "categorie": "tachi_waza", "variantes": ["Ura"], "obligatoire": True,
             "description": "Contrôle du coude, côté fermé avec pivot", "points_cles": ["Tenkan fluide", "Garder connexion"], "erreurs_communes": ["Pivot incomplet"]},
            {"id": "ahkd_shiho_o", "nom": "Shiho Nage Omote", "nom_japonais": "四方投げ表", "attaque": "Ai Hanmi Katate Dori", "attaque_japonais": "相半身片手取り", "categorie": "tachi_waza", "variantes": ["Omote"], "obligatoire": True,
             "description": "Projection 4 directions, côté ouvert", "points_cles": ["Grand arc du bras", "Passer sous le bras", "Couper vers le bas"], "erreurs_communes": ["Arc trop petit", "Ne pas couper"]},
            {"id": "ahkd_shiho_u", "nom": "Shiho Nage Ura", "nom_japonais": "四方投げ裏", "attaque": "Ai Hanmi Katate Dori", "attaque_japonais": "相半身片手取り", "categorie": "tachi_waza", "variantes": ["Ura"], "obligatoire": True,
             "description": "Projection 4 directions, côté fermé", "points_cles": ["Tenkan puis projection"], "erreurs_communes": ["Perdre contact pendant pivot"]},
            # TACHI WAZA - Gyaku Hanmi Katate Dori
            {"id": "ghkd_ikkyo_o", "nom": "Ikkyo Omote", "nom_japonais": "一教表", "attaque": "Gyaku Hanmi Katate Dori", "attaque_japonais": "逆半身片手取り", "categorie": "tachi_waza", "variantes": ["Omote"], "obligatoire": True,
             "description": "Contrôle du coude depuis garde inversée", "points_cles": ["Atemi possible", "Contrôle coude"], "erreurs_communes": ["Angle d'entrée incorrect"]},
            {"id": "ghkd_ikkyo_u", "nom": "Ikkyo Ura", "nom_japonais": "一教裏", "attaque": "Gyaku Hanmi Katate Dori", "attaque_japonais": "逆半身片手取り", "categorie": "tachi_waza", "variantes": ["Ura"], "obligatoire": True,
             "description": "Ikkyo avec pivot", "points_cles": ["Rotation fluide"], "erreurs_communes": ["Perdre la connexion"]},
            {"id": "ghkd_tenchi", "nom": "Tenchi Nage", "nom_japonais": "天地投げ", "attaque": "Gyaku Hanmi Katate Dori", "attaque_japonais": "逆半身片手取り", "categorie": "tachi_waza", "obligatoire": True,
             "description": "Projection ciel-terre", "points_cles": ["Une main monte, une descend", "Avancer dans le centre"], "erreurs_communes": ["Mains désynchronisées"]},
            # SUWARI WAZA
            {"id": "sw_kokyu_dosa", "nom": "Kokyu Dosa", "nom_japonais": "呼吸動作", "attaque": "Ryote Dori", "attaque_japonais": "両手取り", "categorie": "suwari_waza", "obligatoire": True,
             "description": "Exercice de respiration à genoux", "points_cles": ["Extension du Ki", "Utiliser le centre"], "erreurs_communes": ["Pousser avec les bras"]}
        ],
        "criteres_evaluation": [
            "Attitude correcte et respect de l'étiquette",
            "Chutes de base maîtrisées (avant/arrière)",
            "Déplacements fondamentaux corrects",
            "Techniques de base reconnaissables"
        ],
        "duree_examen": "10-15 minutes"
    },
    
    "5e_kyu": {
        "id": "5e_kyu",
        "grade": "5e_kyu",
        "nom": "5e Kyu",
        "nom_japonais": "五級",
        "couleur_ceinture": "#FFEB3B",
        "delai_minimum": "2 mois après début",
        "heures_minimum": 30,
        "jours_minimum": 20,
        "prerequis": "6e Kyu validé",
        "description": "Consolidation des bases. Introduction aux attaques de frappe.",
        "objectifs": [
            "Améliorer la qualité des chutes",
            "Découvrir les attaques en frappe (Shomen, Yokomen)",
            "Maîtriser Ikkyo et Nikyo sur plusieurs attaques",
            "Introduire le travail à genoux (Suwari Waza)"
        ],
        "mouvements": [
            {"id": "mae_kaiten", "nom": "Mae Kaiten Ukemi", "nom_japonais": "前回転受身", "categorie": "ukemi", "obligatoire": True,
             "description": "Roulade avant dynamique", "points_cles": ["Trajectoire diagonale", "Se relever immédiatement"], "erreurs_communes": ["Roulade droite"]},
            {"id": "yoko_ukemi", "nom": "Yoko Ukemi", "nom_japonais": "横受身", "categorie": "ukemi", "obligatoire": True,
             "description": "Chute latérale", "points_cles": ["Frapper avec tout le bras", "Corps en arc"], "erreurs_communes": ["Frapper avec le coude"]},
            {"id": "shikko", "nom": "Shikko", "nom_japonais": "膝行", "categorie": "tai_sabaki", "obligatoire": True,
             "description": "Marche à genoux", "points_cles": ["Genoux glissent", "Hanches basses", "Dos droit"], "erreurs_communes": ["Se relever", "Dos courbé"]},
            {"id": "kaiten", "nom": "Kaiten", "nom_japonais": "回転", "categorie": "tai_sabaki", "obligatoire": True,
             "description": "Rotation sur place", "points_cles": ["Rotation fluide", "Centre stable"], "erreurs_communes": ["Déséquilibre"]}
        ],
        "techniques": [
            # SHOMEN UCHI
            {"id": "su_ikkyo_o", "nom": "Ikkyo Omote", "nom_japonais": "一教表", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "tachi_waza", "obligatoire": True,
             "description": "Ikkyo sur frappe verticale", "points_cles": ["Bloquer et rediriger", "Contrôle du coude"], "erreurs_communes": ["Bloquer trop tard"]},
            {"id": "su_ikkyo_u", "nom": "Ikkyo Ura", "nom_japonais": "一教裏", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "su_irimi", "nom": "Irimi Nage", "nom_japonais": "入身投げ", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "tachi_waza", "obligatoire": True,
             "description": "Projection par entrée", "points_cles": ["Entrée profonde", "Contrôle de la nuque"], "erreurs_communes": ["Entrée insuffisante"]},
            # YOKOMEN UCHI
            {"id": "yu_ikkyo_o", "nom": "Ikkyo Omote", "nom_japonais": "一教表", "attaque": "Yokomen Uchi", "attaque_japonais": "横面打ち", "categorie": "tachi_waza", "obligatoire": True,
             "description": "Ikkyo sur frappe latérale", "points_cles": ["Timing d'interception"], "erreurs_communes": ["Interception trop tardive"]},
            {"id": "yu_ikkyo_u", "nom": "Ikkyo Ura", "nom_japonais": "一教裏", "attaque": "Yokomen Uchi", "attaque_japonais": "横面打ち", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "yu_shiho_o", "nom": "Shiho Nage Omote", "nom_japonais": "四方投げ表", "attaque": "Yokomen Uchi", "attaque_japonais": "横面打ち", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "yu_shiho_u", "nom": "Shiho Nage Ura", "nom_japonais": "四方投げ裏", "attaque": "Yokomen Uchi", "attaque_japonais": "横面打ち", "categorie": "tachi_waza", "obligatoire": True},
            # KATATE DORI - Nikyo
            {"id": "ahkd_nikyo_o", "nom": "Nikyo Omote", "nom_japonais": "二教表", "attaque": "Ai Hanmi Katate Dori", "attaque_japonais": "相半身片手取り", "categorie": "tachi_waza", "obligatoire": True,
             "description": "Torsion du poignet vers l'intérieur", "points_cles": ["Torsion contrôlée", "Pression sur nerf radial"], "erreurs_communes": ["Torsion excessive"]},
            {"id": "ahkd_nikyo_u", "nom": "Nikyo Ura", "nom_japonais": "二教裏", "attaque": "Ai Hanmi Katate Dori", "attaque_japonais": "相半身片手取り", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "ghkd_nikyo_o", "nom": "Nikyo Omote", "nom_japonais": "二教表", "attaque": "Gyaku Hanmi Katate Dori", "attaque_japonais": "逆半身片手取り", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "ghkd_nikyo_u", "nom": "Nikyo Ura", "nom_japonais": "二教裏", "attaque": "Gyaku Hanmi Katate Dori", "attaque_japonais": "逆半身片手取り", "categorie": "tachi_waza", "obligatoire": True},
            # SUWARI WAZA
            {"id": "sw_ahkd_ikkyo_o", "nom": "Ikkyo Omote", "nom_japonais": "一教表", "attaque": "Ai Hanmi Katate Dori", "attaque_japonais": "相半身片手取り", "categorie": "suwari_waza", "obligatoire": True,
             "description": "Ikkyo à genoux", "points_cles": ["Shikko pour déplacements", "Centre bas"], "erreurs_communes": ["Se relever"]},
            {"id": "sw_ahkd_ikkyo_u", "nom": "Ikkyo Ura", "nom_japonais": "一教裏", "attaque": "Ai Hanmi Katate Dori", "attaque_japonais": "相半身片手取り", "categorie": "suwari_waza", "obligatoire": True}
        ],
        "criteres_evaluation": [
            "Chutes dynamiques maîtrisées",
            "Déplacements à genoux corrects (Shikko)",
            "Ikkyo et Nikyo reconnaissables sur différentes attaques",
            "Timing correct sur les attaques en frappe"
        ],
        "duree_examen": "15-20 minutes"
    },
    
    "4e_kyu": {
        "id": "4e_kyu",
        "grade": "4e_kyu",
        "nom": "4e Kyu",
        "nom_japonais": "四級",
        "couleur_ceinture": "#FF9800",
        "delai_minimum": "3 mois après 5e Kyu",
        "heures_minimum": 60,
        "jours_minimum": 40,
        "prerequis": "5e Kyu validé",
        "description": "Élargissement du répertoire technique. Introduction de Sankyo et Kote Gaeshi.",
        "objectifs": [
            "Maîtriser Sankyo et Yonkyo",
            "Introduire Kote Gaeshi et Kaiten Nage",
            "Développer le travail Suwari Waza",
            "Améliorer la fluidité des enchaînements"
        ],
        "mouvements": [
            {"id": "ushiro_kaiten", "nom": "Ushiro Kaiten Ukemi", "nom_japonais": "後回転受身", "categorie": "ukemi", "obligatoire": True,
             "description": "Roulade arrière dynamique", "points_cles": ["Menton rentré", "Pousser pour sortir"], "erreurs_communes": ["Tête qui touche"]},
            {"id": "tenshin", "nom": "Tenshin", "nom_japonais": "転身", "categorie": "tai_sabaki", "obligatoire": True,
             "description": "Esquive diagonale", "points_cles": ["Sortir de la ligne", "Rester connecté"], "erreurs_communes": ["Fuite au lieu d'esquive"]}
        ],
        "techniques": [
            # SANKYO
            {"id": "ahkd_sankyo_o", "nom": "Sankyo Omote", "nom_japonais": "三教表", "attaque": "Ai Hanmi Katate Dori", "attaque_japonais": "相半身片手取り", "categorie": "tachi_waza", "obligatoire": True,
             "description": "Torsion spirale vers l'extérieur", "points_cles": ["Spirale continue", "Contrôle du coude"], "erreurs_communes": ["Torsion plate"]},
            {"id": "ahkd_sankyo_u", "nom": "Sankyo Ura", "nom_japonais": "三教裏", "attaque": "Ai Hanmi Katate Dori", "attaque_japonais": "相半身片手取り", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "su_sankyo_o", "nom": "Sankyo Omote", "nom_japonais": "三教表", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "su_sankyo_u", "nom": "Sankyo Ura", "nom_japonais": "三教裏", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "tachi_waza", "obligatoire": True},
            # YONKYO
            {"id": "ahkd_yonkyo_o", "nom": "Yonkyo Omote", "nom_japonais": "四教表", "attaque": "Ai Hanmi Katate Dori", "attaque_japonais": "相半身片手取り", "categorie": "tachi_waza", "obligatoire": True,
             "description": "Pression sur point nerveux", "points_cles": ["Trouver le point exact", "Pression avec base de l'index"], "erreurs_communes": ["Mauvais point de pression"]},
            {"id": "ahkd_yonkyo_u", "nom": "Yonkyo Ura", "nom_japonais": "四教裏", "attaque": "Ai Hanmi Katate Dori", "attaque_japonais": "相半身片手取り", "categorie": "tachi_waza", "obligatoire": True},
            # KOTE GAESHI
            {"id": "ahkd_kote", "nom": "Kote Gaeshi", "nom_japonais": "小手返し", "attaque": "Ai Hanmi Katate Dori", "attaque_japonais": "相半身片手取り", "categorie": "tachi_waza", "obligatoire": True,
             "description": "Retournement du poignet", "points_cles": ["Saisie correcte", "Rotation vers extérieur", "Projection vers le bas"], "erreurs_communes": ["Tordre au lieu de retourner"]},
            {"id": "ghkd_kote", "nom": "Kote Gaeshi", "nom_japonais": "小手返し", "attaque": "Gyaku Hanmi Katate Dori", "attaque_japonais": "逆半身片手取り", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "su_kote", "nom": "Kote Gaeshi", "nom_japonais": "小手返し", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "yu_kote", "nom": "Kote Gaeshi", "nom_japonais": "小手返し", "attaque": "Yokomen Uchi", "attaque_japonais": "横面打ち", "categorie": "tachi_waza", "obligatoire": True},
            # KAITEN NAGE
            {"id": "ahkd_kaiten", "nom": "Kaiten Nage", "nom_japonais": "回転投げ", "attaque": "Ai Hanmi Katate Dori", "attaque_japonais": "相半身片手取り", "categorie": "tachi_waza", "obligatoire": True,
             "description": "Projection rotative", "points_cles": ["Contrôle bras et tête", "Rotation continue"], "erreurs_communes": ["Rotation insuffisante"]},
            {"id": "yu_kaiten_uchi", "nom": "Uchi Kaiten Nage", "nom_japonais": "内回転投げ", "attaque": "Yokomen Uchi", "attaque_japonais": "横面打ち", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "yu_kaiten_soto", "nom": "Soto Kaiten Nage", "nom_japonais": "外回転投げ", "attaque": "Yokomen Uchi", "attaque_japonais": "横面打ち", "categorie": "tachi_waza", "obligatoire": True},
            # SUWARI WAZA élargi
            {"id": "sw_ahkd_nikyo_o", "nom": "Nikyo Omote", "nom_japonais": "二教表", "attaque": "Ai Hanmi Katate Dori", "attaque_japonais": "相半身片手取り", "categorie": "suwari_waza", "obligatoire": True},
            {"id": "sw_ahkd_nikyo_u", "nom": "Nikyo Ura", "nom_japonais": "二教裏", "attaque": "Ai Hanmi Katate Dori", "attaque_japonais": "相半身片手取り", "categorie": "suwari_waza", "obligatoire": True},
            {"id": "sw_su_ikkyo_o", "nom": "Ikkyo Omote", "nom_japonais": "一教表", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "suwari_waza", "obligatoire": True},
            {"id": "sw_su_ikkyo_u", "nom": "Ikkyo Ura", "nom_japonais": "一教裏", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "suwari_waza", "obligatoire": True}
        ],
        "criteres_evaluation": [
            "Sankyo et Yonkyo techniquement corrects",
            "Kote Gaeshi avec projection propre",
            "Fluidité dans les enchaînements",
            "Suwari Waza stable et contrôlé"
        ],
        "duree_examen": "20-25 minutes"
    },
    
    "3e_kyu": {
        "id": "3e_kyu",
        "grade": "3e_kyu",
        "nom": "3e Kyu",
        "nom_japonais": "三級",
        "couleur_ceinture": "#4CAF50",
        "delai_minimum": "6 mois après 4e Kyu",
        "heures_minimum": 120,
        "jours_minimum": 50,
        "prerequis": "4e Kyu validé",
        "description": "Approfondissement. Introduction aux attaques Ushiro et au Hanmi Handachi.",
        "objectifs": [
            "Maîtriser les attaques par l'arrière (Ushiro Waza)",
            "Développer le travail Hanmi Handachi",
            "Introduire les saisies à deux mains (Ryote Dori)",
            "Améliorer la qualité de l'Ukemi avancé"
        ],
        "mouvements": [
            {"id": "tobi_ukemi", "nom": "Tobi Ukemi", "nom_japonais": "飛び受身", "categorie": "ukemi", "obligatoire": True,
             "description": "Chute plongeante", "points_cles": ["Impulsion jambes", "Bras devant", "Engagement total"], "erreurs_communes": ["Hésitation", "Atterrir à plat"]}
        ],
        "techniques": [
            # RYOTE DORI
            {"id": "rd_tenchi", "nom": "Tenchi Nage", "nom_japonais": "天地投げ", "attaque": "Ryote Dori", "attaque_japonais": "両手取り", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "rd_kokyu", "nom": "Kokyu Nage", "nom_japonais": "呼吸投げ", "attaque": "Ryote Dori", "attaque_japonais": "両手取り", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "rd_ikkyo_o", "nom": "Ikkyo Omote", "nom_japonais": "一教表", "attaque": "Ryote Dori", "attaque_japonais": "両手取り", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "rd_ikkyo_u", "nom": "Ikkyo Ura", "nom_japonais": "一教裏", "attaque": "Ryote Dori", "attaque_japonais": "両手取り", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "rd_nikyo_o", "nom": "Nikyo Omote", "nom_japonais": "二教表", "attaque": "Ryote Dori", "attaque_japonais": "両手取り", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "rd_nikyo_u", "nom": "Nikyo Ura", "nom_japonais": "二教裏", "attaque": "Ryote Dori", "attaque_japonais": "両手取り", "categorie": "tachi_waza", "obligatoire": True},
            # KATATE RYOTE DORI (Morote Dori)
            {"id": "krd_ikkyo_o", "nom": "Ikkyo Omote", "nom_japonais": "一教表", "attaque": "Katate Ryote Dori", "attaque_japonais": "片手両手取り", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "krd_ikkyo_u", "nom": "Ikkyo Ura", "nom_japonais": "一教裏", "attaque": "Katate Ryote Dori", "attaque_japonais": "片手両手取り", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "krd_nikyo_o", "nom": "Nikyo Omote", "nom_japonais": "二教表", "attaque": "Katate Ryote Dori", "attaque_japonais": "片手両手取り", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "krd_nikyo_u", "nom": "Nikyo Ura", "nom_japonais": "二教裏", "attaque": "Katate Ryote Dori", "attaque_japonais": "片手両手取り", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "krd_kokyu", "nom": "Kokyu Nage", "nom_japonais": "呼吸投げ", "attaque": "Katate Ryote Dori", "attaque_japonais": "片手両手取り", "categorie": "tachi_waza", "obligatoire": True},
            # USHIRO WAZA
            {"id": "urd_ikkyo_o", "nom": "Ikkyo Omote", "nom_japonais": "一教表", "attaque": "Ushiro Ryote Dori", "attaque_japonais": "後ろ両手取り", "categorie": "ushiro_waza", "obligatoire": True,
             "description": "Ikkyo sur saisie arrière", "points_cles": ["Tourner avant la saisie complète", "Créer de l'espace"], "erreurs_communes": ["Attendre d'être saisi"]},
            {"id": "urd_ikkyo_u", "nom": "Ikkyo Ura", "nom_japonais": "一教裏", "attaque": "Ushiro Ryote Dori", "attaque_japonais": "後ろ両手取り", "categorie": "ushiro_waza", "obligatoire": True},
            {"id": "urd_kote", "nom": "Kote Gaeshi", "nom_japonais": "小手返し", "attaque": "Ushiro Ryote Dori", "attaque_japonais": "後ろ両手取り", "categorie": "ushiro_waza", "obligatoire": True},
            {"id": "urd_irimi", "nom": "Irimi Nage", "nom_japonais": "入身投げ", "attaque": "Ushiro Ryote Dori", "attaque_japonais": "後ろ両手取り", "categorie": "ushiro_waza", "obligatoire": True},
            # HANMI HANDACHI
            {"id": "hh_ghkd_ikkyo_o", "nom": "Ikkyo Omote", "nom_japonais": "一教表", "attaque": "Gyaku Hanmi Katate Dori", "attaque_japonais": "逆半身片手取り", "categorie": "hanmi_handachi", "obligatoire": True,
             "description": "Ikkyo semi-debout", "points_cles": ["Utiliser le centre bas", "Ne pas se relever"], "erreurs_communes": ["Se relever", "Perdre l'équilibre"]},
            {"id": "hh_ghkd_ikkyo_u", "nom": "Ikkyo Ura", "nom_japonais": "一教裏", "attaque": "Gyaku Hanmi Katate Dori", "attaque_japonais": "逆半身片手取り", "categorie": "hanmi_handachi", "obligatoire": True},
            {"id": "hh_ghkd_shiho_o", "nom": "Shiho Nage Omote", "nom_japonais": "四方投げ表", "attaque": "Gyaku Hanmi Katate Dori", "attaque_japonais": "逆半身片手取り", "categorie": "hanmi_handachi", "obligatoire": True},
            {"id": "hh_ghkd_shiho_u", "nom": "Shiho Nage Ura", "nom_japonais": "四方投げ裏", "attaque": "Gyaku Hanmi Katate Dori", "attaque_japonais": "逆半身片手取り", "categorie": "hanmi_handachi", "obligatoire": True}
        ],
        "criteres_evaluation": [
            "Ushiro Waza fluide avec bonne anticipation",
            "Hanmi Handachi stable et efficace",
            "Ukemi avancé (Tobi Ukemi) maîtrisé",
            "Réponse adaptée aux attaques à deux mains"
        ],
        "duree_examen": "25-30 minutes"
    },
    
    "2e_kyu": {
        "id": "2e_kyu",
        "grade": "2e_kyu",
        "nom": "2e Kyu",
        "nom_japonais": "二級",
        "couleur_ceinture": "#2196F3",
        "delai_minimum": "7 mois après 3e Kyu",
        "heures_minimum": 140,
        "jours_minimum": 50,
        "prerequis": "3e Kyu validé",
        "description": "Préparation au 1er Kyu. Introduction aux armes (Tanto Dori).",
        "objectifs": [
            "Maîtriser Gokyo (désarmement)",
            "Introduire le Tanto Dori",
            "Approfondir toutes les attaques Ushiro",
            "Développer Koshi Nage"
        ],
        "techniques": [
            # GOKYO
            {"id": "su_gokyo_o", "nom": "Gokyo Omote", "nom_japonais": "五教表", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "tachi_waza", "obligatoire": True,
             "description": "5e principe - désarmement", "points_cles": ["Poignet vers extérieur", "Contrôle total"], "erreurs_communes": ["Confusion avec Nikyo"]},
            {"id": "su_gokyo_u", "nom": "Gokyo Ura", "nom_japonais": "五教裏", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "yu_gokyo_o", "nom": "Gokyo Omote", "nom_japonais": "五教表", "attaque": "Yokomen Uchi", "attaque_japonais": "横面打ち", "categorie": "tachi_waza", "obligatoire": True},
            {"id": "yu_gokyo_u", "nom": "Gokyo Ura", "nom_japonais": "五教裏", "attaque": "Yokomen Uchi", "attaque_japonais": "横面打ち", "categorie": "tachi_waza", "obligatoire": True},
            # KOSHI NAGE
            {"id": "ahkd_koshi", "nom": "Koshi Nage", "nom_japonais": "腰投げ", "attaque": "Ai Hanmi Katate Dori", "attaque_japonais": "相半身片手取り", "categorie": "tachi_waza", "obligatoire": True,
             "description": "Projection de hanche", "points_cles": ["Entrer sous le centre", "Charger sur la hanche", "Basculer"], "erreurs_communes": ["Pas assez bas", "Tirer au lieu de basculer"]},
            {"id": "rd_koshi", "nom": "Koshi Nage", "nom_japonais": "腰投げ", "attaque": "Ryote Dori", "attaque_japonais": "両手取り", "categorie": "tachi_waza", "obligatoire": True},
            # USHIRO WAZA élargi
            {"id": "ukd_ikkyo_o", "nom": "Ikkyo Omote", "nom_japonais": "一教表", "attaque": "Ushiro Katate Dori Kubishime", "attaque_japonais": "後ろ片手取り首絞め", "categorie": "ushiro_waza", "obligatoire": True},
            {"id": "ukd_ikkyo_u", "nom": "Ikkyo Ura", "nom_japonais": "一教裏", "attaque": "Ushiro Katate Dori Kubishime", "attaque_japonais": "後ろ片手取り首絞め", "categorie": "ushiro_waza", "obligatoire": True},
            {"id": "ukd_kote", "nom": "Kote Gaeshi", "nom_japonais": "小手返し", "attaque": "Ushiro Katate Dori Kubishime", "attaque_japonais": "後ろ片手取り首絞め", "categorie": "ushiro_waza", "obligatoire": True},
            {"id": "urd_shiho_o", "nom": "Shiho Nage Omote", "nom_japonais": "四方投げ表", "attaque": "Ushiro Ryote Dori", "attaque_japonais": "後ろ両手取り", "categorie": "ushiro_waza", "obligatoire": True},
            {"id": "urd_shiho_u", "nom": "Shiho Nage Ura", "nom_japonais": "四方投げ裏", "attaque": "Ushiro Ryote Dori", "attaque_japonais": "後ろ両手取り", "categorie": "ushiro_waza", "obligatoire": True},
            # TANTO DORI
            {"id": "td_su_gokyo_o", "nom": "Gokyo Omote", "nom_japonais": "五教表", "attaque": "Tanto Shomen Uchi", "attaque_japonais": "短刀正面打ち", "categorie": "tanto_dori", "obligatoire": True,
             "description": "Gokyo contre couteau", "points_cles": ["Ne jamais croiser la lame", "Désarmement final"], "erreurs_communes": ["Saisir la lame"]},
            {"id": "td_su_gokyo_u", "nom": "Gokyo Ura", "nom_japonais": "五教裏", "attaque": "Tanto Shomen Uchi", "attaque_japonais": "短刀正面打ち", "categorie": "tanto_dori", "obligatoire": True},
            {"id": "td_tsuki_kote", "nom": "Kote Gaeshi", "nom_japonais": "小手返し", "attaque": "Tanto Tsuki", "attaque_japonais": "短刀突き", "categorie": "tanto_dori", "obligatoire": True},
            {"id": "td_tsuki_irimi", "nom": "Irimi Nage", "nom_japonais": "入身投げ", "attaque": "Tanto Tsuki", "attaque_japonais": "短刀突き", "categorie": "tanto_dori", "obligatoire": True},
            # HANMI HANDACHI élargi
            {"id": "hh_ghkd_kote", "nom": "Kote Gaeshi", "nom_japonais": "小手返し", "attaque": "Gyaku Hanmi Katate Dori", "attaque_japonais": "逆半身片手取り", "categorie": "hanmi_handachi", "obligatoire": True},
            {"id": "hh_ghkd_kaiten_uchi", "nom": "Uchi Kaiten Nage", "nom_japonais": "内回転投げ", "attaque": "Gyaku Hanmi Katate Dori", "attaque_japonais": "逆半身片手取り", "categorie": "hanmi_handachi", "obligatoire": True},
            {"id": "hh_ghkd_kaiten_soto", "nom": "Soto Kaiten Nage", "nom_japonais": "外回転投げ", "attaque": "Gyaku Hanmi Katate Dori", "attaque_japonais": "逆半身片手取り", "categorie": "hanmi_handachi", "obligatoire": True},
            # SUWARI WAZA avancé
            {"id": "sw_su_nikyo_o", "nom": "Nikyo Omote", "nom_japonais": "二教表", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "suwari_waza", "obligatoire": True},
            {"id": "sw_su_nikyo_u", "nom": "Nikyo Ura", "nom_japonais": "二教裏", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "suwari_waza", "obligatoire": True},
            {"id": "sw_su_sankyo_o", "nom": "Sankyo Omote", "nom_japonais": "三教表", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "suwari_waza", "obligatoire": True},
            {"id": "sw_su_sankyo_u", "nom": "Sankyo Ura", "nom_japonais": "三教裏", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "suwari_waza", "obligatoire": True}
        ],
        "criteres_evaluation": [
            "Gokyo correct et adapté au désarmement",
            "Tanto Dori sécurisé avec contrôle de l'arme",
            "Koshi Nage techniquement correct",
            "Ushiro Waza varié et fluide"
        ],
        "duree_examen": "30-35 minutes"
    },
    
    "1er_kyu": {
        "id": "1er_kyu",
        "grade": "1er_kyu",
        "nom": "1er Kyu",
        "nom_japonais": "一級",
        "couleur_ceinture": "#795548",
        "delai_minimum": "8 mois après 2e Kyu",
        "heures_minimum": 160,
        "jours_minimum": 60,
        "prerequis": "2e Kyu validé",
        "description": "Dernier grade avant ceinture noire. Maîtrise complète du programme Kyu.",
        "objectifs": [
            "Maîtrise complète de toutes les techniques Kyu",
            "Tanto Dori et Tachi Dori basiques",
            "Introduction au Jo Dori",
            "Jiyu Waza (travail libre)"
        ],
        "techniques": [
            # TACHI DORI (début)
            {"id": "tad_su_ikkyo_o", "nom": "Ikkyo Omote", "nom_japonais": "一教表", "attaque": "Tachi Shomen Uchi", "attaque_japonais": "太刀正面打ち", "categorie": "tachi_dori", "obligatoire": True,
             "description": "Défense contre sabre", "points_cles": ["Timing crucial", "Entrée décisive"], "erreurs_communes": ["Entrée tardive"]},
            {"id": "tad_su_ikkyo_u", "nom": "Ikkyo Ura", "nom_japonais": "一教裏", "attaque": "Tachi Shomen Uchi", "attaque_japonais": "太刀正面打ち", "categorie": "tachi_dori", "obligatoire": True},
            {"id": "tad_su_irimi", "nom": "Irimi Nage", "nom_japonais": "入身投げ", "attaque": "Tachi Shomen Uchi", "attaque_japonais": "太刀正面打ち", "categorie": "tachi_dori", "obligatoire": True},
            {"id": "tad_su_shiho", "nom": "Shiho Nage", "nom_japonais": "四方投げ", "attaque": "Tachi Shomen Uchi", "attaque_japonais": "太刀正面打ち", "categorie": "tachi_dori", "obligatoire": True},
            {"id": "tad_su_kote", "nom": "Kote Gaeshi", "nom_japonais": "小手返し", "attaque": "Tachi Shomen Uchi", "attaque_japonais": "太刀正面打ち", "categorie": "tachi_dori", "obligatoire": True},
            # JO DORI (début)
            {"id": "jod_su_ikkyo_o", "nom": "Ikkyo Omote", "nom_japonais": "一教表", "attaque": "Jo Shomen Uchi", "attaque_japonais": "杖正面打ち", "categorie": "jo_dori", "obligatoire": True},
            {"id": "jod_su_ikkyo_u", "nom": "Ikkyo Ura", "nom_japonais": "一教裏", "attaque": "Jo Shomen Uchi", "attaque_japonais": "杖正面打ち", "categorie": "jo_dori", "obligatoire": True},
            {"id": "jod_tsuki_irimi", "nom": "Irimi Nage", "nom_japonais": "入身投げ", "attaque": "Jo Tsuki", "attaque_japonais": "杖突き", "categorie": "jo_dori", "obligatoire": True},
            {"id": "jod_tsuki_kote", "nom": "Kote Gaeshi", "nom_japonais": "小手返し", "attaque": "Jo Tsuki", "attaque_japonais": "杖突き", "categorie": "jo_dori", "obligatoire": True},
            # TANTO DORI complet
            {"id": "td_yu_gokyo_o", "nom": "Gokyo Omote", "nom_japonais": "五教表", "attaque": "Tanto Yokomen Uchi", "attaque_japonais": "短刀横面打ち", "categorie": "tanto_dori", "obligatoire": True},
            {"id": "td_yu_gokyo_u", "nom": "Gokyo Ura", "nom_japonais": "五教裏", "attaque": "Tanto Yokomen Uchi", "attaque_japonais": "短刀横面打ち", "categorie": "tanto_dori", "obligatoire": True},
            {"id": "td_su_ikkyo_o", "nom": "Ikkyo Omote", "nom_japonais": "一教表", "attaque": "Tanto Shomen Uchi", "attaque_japonais": "短刀正面打ち", "categorie": "tanto_dori", "obligatoire": True},
            {"id": "td_su_ikkyo_u", "nom": "Ikkyo Ura", "nom_japonais": "一教裏", "attaque": "Tanto Shomen Uchi", "attaque_japonais": "短刀正面打ち", "categorie": "tanto_dori", "obligatoire": True},
            {"id": "td_su_shiho", "nom": "Shiho Nage", "nom_japonais": "四方投げ", "attaque": "Tanto Shomen Uchi", "attaque_japonais": "短刀正面打ち", "categorie": "tanto_dori", "obligatoire": True},
            {"id": "td_tsuki_ikkyo", "nom": "Ikkyo", "nom_japonais": "一教", "attaque": "Tanto Tsuki", "attaque_japonais": "短刀突き", "categorie": "tanto_dori", "obligatoire": True},
            {"id": "td_tsuki_sankyo", "nom": "Sankyo", "nom_japonais": "三教", "attaque": "Tanto Tsuki", "attaque_japonais": "短刀突き", "categorie": "tanto_dori", "obligatoire": True},
            {"id": "td_tsuki_gokyo", "nom": "Gokyo", "nom_japonais": "五教", "attaque": "Tanto Tsuki", "attaque_japonais": "短刀突き", "categorie": "tanto_dori", "obligatoire": True},
            # JIYU WAZA
            {"id": "jiyu_su", "nom": "Jiyu Waza", "nom_japonais": "自由技", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "jiyu_waza", "obligatoire": True,
             "description": "Travail libre sur Shomen Uchi", "points_cles": ["Adapter les techniques", "Fluidité", "Zanshin"], "erreurs_communes": ["Techniques rigides"]},
            {"id": "jiyu_yu", "nom": "Jiyu Waza", "nom_japonais": "自由技", "attaque": "Yokomen Uchi", "attaque_japonais": "横面打ち", "categorie": "jiyu_waza", "obligatoire": True},
            {"id": "jiyu_rd", "nom": "Jiyu Waza", "nom_japonais": "自由技", "attaque": "Ryote Dori", "attaque_japonais": "両手取り", "categorie": "jiyu_waza", "obligatoire": True},
            # SUWARI WAZA complet
            {"id": "sw_su_yonkyo_o", "nom": "Yonkyo Omote", "nom_japonais": "四教表", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "suwari_waza", "obligatoire": True},
            {"id": "sw_su_yonkyo_u", "nom": "Yonkyo Ura", "nom_japonais": "四教裏", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "suwari_waza", "obligatoire": True},
            {"id": "sw_su_irimi", "nom": "Irimi Nage", "nom_japonais": "入身投げ", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "suwari_waza", "obligatoire": True},
            {"id": "sw_su_kote", "nom": "Kote Gaeshi", "nom_japonais": "小手返し", "attaque": "Shomen Uchi", "attaque_japonais": "正面打ち", "categorie": "suwari_waza", "obligatoire": True}
        ],
        "criteres_evaluation": [
            "Maîtrise complète du répertoire Kyu",
            "Travail aux armes (Tanto, Tachi, Jo) sécurisé",
            "Jiyu Waza fluide et varié",
            "Prêt pour le passage Shodan"
        ],
        "duree_examen": "35-40 minutes"
    }
}

# Fonction pour obtenir le programme complet
def get_programme_grade(grade_id: str) -> dict:
    """Retourne le programme complet d'un grade"""
    return PROGRAMME_FFAAA.get(grade_id)

def get_all_grades() -> list:
    """Retourne tous les grades dans l'ordre"""
    ordre = ["6e_kyu", "5e_kyu", "4e_kyu", "3e_kyu", "2e_kyu", "1er_kyu"]
    return [PROGRAMME_FFAAA[g] for g in ordre if g in PROGRAMME_FFAAA]

def count_techniques_by_category(grade_id: str) -> dict:
    """Compte les techniques par catégorie pour un grade"""
    grade = PROGRAMME_FFAAA.get(grade_id, {})
    techniques = grade.get("techniques", [])
    counts = {}
    for t in techniques:
        cat = t.get("categorie", "autre")
        counts[cat] = counts.get(cat, 0) + 1
    return counts
