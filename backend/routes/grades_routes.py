"""
🎓 API PASSAGES DE GRADES
Routes pour accéder au programme FFAAA et gérer la progression utilisateur
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timezone
import os

from models.passages_grades import (
    PROGRAMME_FFAAA,
    get_programme_grade,
    get_all_grades,
    count_techniques_by_category
)

router = APIRouter(prefix="/grades", tags=["Passages de Grades"])

# Reference to database - will be set by server.py
db = None

def set_database(database):
    """Set the database reference from server.py"""
    global db
    db = database


# ============================================================================
# MODÈLES DE RÉPONSE
# ============================================================================

class GradeResume(BaseModel):
    """Résumé d'un grade pour la liste"""
    id: str
    nom: str
    nom_japonais: str
    couleur_ceinture: str
    delai_minimum: str
    heures_minimum: int
    nb_techniques: int
    nb_mouvements: int
    categories: dict


class GradeComplet(BaseModel):
    """Données complètes d'un grade"""
    id: str
    nom: str
    nom_japonais: str
    couleur_ceinture: str
    delai_minimum: str
    heures_minimum: int
    jours_minimum: int
    prerequis: Optional[str]
    description: Optional[str]
    objectifs: List[str]
    mouvements: List[dict]
    techniques: List[dict]
    criteres_evaluation: List[str]
    duree_examen: Optional[str]
    # Stats calculées
    nb_techniques: int
    nb_mouvements: int
    techniques_par_categorie: dict
    techniques_par_attaque: dict


class UserProgressUpdate(BaseModel):
    """Mise à jour de progression utilisateur"""
    grade_id: str
    technique_id: Optional[str] = None
    mouvement_id: Optional[str] = None
    action: str  # "validate" ou "invalidate"


# ============================================================================
# ROUTES - PROGRAMME FFAAA
# ============================================================================

@router.get("/programme", response_model=List[GradeResume])
async def get_programme_complet():
    """
    Récupère la liste de tous les grades avec résumé.
    """
    grades = get_all_grades()
    result = []
    
    for g in grades:
        techniques = g.get("techniques", [])
        mouvements = g.get("mouvements", [])
        
        result.append(GradeResume(
            id=g["id"],
            nom=g["nom"],
            nom_japonais=g["nom_japonais"],
            couleur_ceinture=g["couleur_ceinture"],
            delai_minimum=g["delai_minimum"],
            heures_minimum=g["heures_minimum"],
            nb_techniques=len(techniques),
            nb_mouvements=len(mouvements),
            categories=count_techniques_by_category(g["id"])
        ))
    
    return result


@router.get("/programme/{grade_id}", response_model=GradeComplet)
async def get_grade_detail(grade_id: str):
    """
    Récupère le détail complet d'un grade avec toutes ses techniques et mouvements.
    """
    grade = get_programme_grade(grade_id)
    
    if not grade:
        raise HTTPException(status_code=404, detail=f"Grade {grade_id} non trouvé")
    
    techniques = grade.get("techniques", [])
    mouvements = grade.get("mouvements", [])
    
    # Grouper les techniques par catégorie
    techniques_par_categorie = {}
    for t in techniques:
        cat = t.get("categorie", "autre")
        if cat not in techniques_par_categorie:
            techniques_par_categorie[cat] = []
        techniques_par_categorie[cat].append(t)
    
    # Grouper les techniques par attaque
    techniques_par_attaque = {}
    for t in techniques:
        attaque = t.get("attaque", "Autre")
        if attaque not in techniques_par_attaque:
            techniques_par_attaque[attaque] = {
                "attaque": attaque,
                "attaque_japonais": t.get("attaque_japonais", ""),
                "techniques": []
            }
        techniques_par_attaque[attaque]["techniques"].append(t)
    
    return GradeComplet(
        id=grade["id"],
        nom=grade["nom"],
        nom_japonais=grade["nom_japonais"],
        couleur_ceinture=grade["couleur_ceinture"],
        delai_minimum=grade["delai_minimum"],
        heures_minimum=grade["heures_minimum"],
        jours_minimum=grade["jours_minimum"],
        prerequis=grade.get("prerequis"),
        description=grade.get("description"),
        objectifs=grade.get("objectifs", []),
        mouvements=mouvements,
        techniques=techniques,
        criteres_evaluation=grade.get("criteres_evaluation", []),
        duree_examen=grade.get("duree_examen"),
        nb_techniques=len(techniques),
        nb_mouvements=len(mouvements),
        techniques_par_categorie=techniques_par_categorie,
        techniques_par_attaque=list(techniques_par_attaque.values())
    )


@router.get("/categories")
async def get_categories():
    """
    Retourne toutes les catégories de techniques avec leur description.
    """
    return {
        "tachi_waza": {
            "nom": "Tachi Waza",
            "nom_japonais": "立ち技",
            "description": "Techniques debout",
            "icone": "standing"
        },
        "suwari_waza": {
            "nom": "Suwari Waza",
            "nom_japonais": "座り技",
            "description": "Techniques à genoux",
            "icone": "kneeling"
        },
        "hanmi_handachi": {
            "nom": "Hanmi Handachi",
            "nom_japonais": "半身半立",
            "description": "Tori à genoux, Uke debout",
            "icone": "mixed"
        },
        "ushiro_waza": {
            "nom": "Ushiro Waza",
            "nom_japonais": "後ろ技",
            "description": "Attaques par l'arrière",
            "icone": "back"
        },
        "tanto_dori": {
            "nom": "Tanto Dori",
            "nom_japonais": "短刀取り",
            "description": "Défense contre couteau",
            "icone": "knife"
        },
        "jo_dori": {
            "nom": "Jo Dori",
            "nom_japonais": "杖取り",
            "description": "Défense contre bâton",
            "icone": "staff"
        },
        "tachi_dori": {
            "nom": "Tachi Dori",
            "nom_japonais": "太刀取り",
            "description": "Défense contre sabre",
            "icone": "sword"
        },
        "jiyu_waza": {
            "nom": "Jiyu Waza",
            "nom_japonais": "自由技",
            "description": "Travail libre",
            "icone": "free"
        }
    }


@router.get("/attaques")
async def get_attaques():
    """
    Retourne toutes les attaques avec leur traduction.
    """
    return {
        "ai_hanmi_katate_dori": {"nom": "Ai Hanmi Katate Dori", "japonais": "相半身片手取り", "description": "Saisie du poignet en garde identique"},
        "gyaku_hanmi_katate_dori": {"nom": "Gyaku Hanmi Katate Dori", "japonais": "逆半身片手取り", "description": "Saisie du poignet en garde inversée"},
        "ryote_dori": {"nom": "Ryote Dori", "japonais": "両手取り", "description": "Saisie des deux poignets"},
        "katate_ryote_dori": {"nom": "Katate Ryote Dori", "japonais": "片手両手取り", "description": "Saisie d'un poignet à deux mains"},
        "shomen_uchi": {"nom": "Shomen Uchi", "japonais": "正面打ち", "description": "Frappe verticale à la tête"},
        "yokomen_uchi": {"nom": "Yokomen Uchi", "japonais": "横面打ち", "description": "Frappe latérale à la tempe"},
        "chudan_tsuki": {"nom": "Chudan Tsuki", "japonais": "中段突き", "description": "Coup de poing au ventre"},
        "ushiro_ryote_dori": {"nom": "Ushiro Ryote Dori", "japonais": "後ろ両手取り", "description": "Saisie des deux poignets par l'arrière"},
        "ushiro_katate_dori_kubishime": {"nom": "Ushiro Katate Dori Kubishime", "japonais": "後ろ片手取り首絞め", "description": "Saisie poignet + étranglement par l'arrière"},
        "tanto_shomen_uchi": {"nom": "Tanto Shomen Uchi", "japonais": "短刀正面打ち", "description": "Frappe verticale au couteau"},
        "tanto_yokomen_uchi": {"nom": "Tanto Yokomen Uchi", "japonais": "短刀横面打ち", "description": "Frappe latérale au couteau"},
        "tanto_tsuki": {"nom": "Tanto Tsuki", "japonais": "短刀突き", "description": "Piqué au couteau"},
        "jo_shomen_uchi": {"nom": "Jo Shomen Uchi", "japonais": "杖正面打ち", "description": "Frappe verticale au bâton"},
        "jo_tsuki": {"nom": "Jo Tsuki", "japonais": "杖突き", "description": "Piqué au bâton"},
        "tachi_shomen_uchi": {"nom": "Tachi Shomen Uchi", "japonais": "太刀正面打ち", "description": "Frappe verticale au sabre"}
    }


# ============================================================================
# ROUTES - PROGRESSION UTILISATEUR
# ============================================================================

@router.get("/user/{user_id}/progress")
async def get_user_progress(user_id: str):
    """
    Récupère la progression d'un utilisateur sur tous les grades.
    """
    if db is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    
    progress = await db.user_grade_progress.find({"user_id": user_id}).to_list(None)
    
    # Formater les résultats
    result = {}
    for p in progress:
        p.pop("_id", None)
        result[p["grade_id"]] = p
    
    return result


@router.post("/user/{user_id}/progress")
async def update_user_progress(user_id: str, update: UserProgressUpdate):
    """
    Met à jour la progression d'un utilisateur (valider/invalider une technique).
    """
    from server import db
    
    # Récupérer ou créer la progression
    progress = await db.user_grade_progress.find_one({
        "user_id": user_id,
        "grade_id": update.grade_id
    })
    
    if not progress:
        progress = {
            "user_id": user_id,
            "grade_id": update.grade_id,
            "techniques_validees": [],
            "mouvements_valides": [],
            "date_debut": datetime.utcnow(),
            "heures_pratique": 0,
            "en_cours": True,
            "valide": False
        }
    
    # Mettre à jour selon l'action
    if update.technique_id:
        if update.action == "validate":
            if update.technique_id not in progress["techniques_validees"]:
                progress["techniques_validees"].append(update.technique_id)
        else:
            if update.technique_id in progress["techniques_validees"]:
                progress["techniques_validees"].remove(update.technique_id)
    
    if update.mouvement_id:
        if update.action == "validate":
            if update.mouvement_id not in progress["mouvements_valides"]:
                progress["mouvements_valides"].append(update.mouvement_id)
        else:
            if update.mouvement_id in progress["mouvements_valides"]:
                progress["mouvements_valides"].remove(update.mouvement_id)
    
    progress["updated_at"] = datetime.utcnow()
    
    # Sauvegarder
    await db.user_grade_progress.update_one(
        {"user_id": user_id, "grade_id": update.grade_id},
        {"$set": progress},
        upsert=True
    )
    
    progress.pop("_id", None)
    return progress


@router.post("/user/{user_id}/validate-grade/{grade_id}")
async def validate_user_grade(user_id: str, grade_id: str):
    """
    Valide un grade complet pour un utilisateur.
    """
    from server import db
    
    await db.user_grade_progress.update_one(
        {"user_id": user_id, "grade_id": grade_id},
        {
            "$set": {
                "valide": True,
                "en_cours": False,
                "date_validation": datetime.utcnow()
            }
        }
    )
    
    return {"success": True, "message": f"Grade {grade_id} validé pour l'utilisateur"}
