from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Enums
class MasteryLevel(str, Enum):
    NOT_STARTED = "not_started"
    LEARNING = "learning"
    PRACTICED = "practiced"
    MASTERED = "mastered"


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# Technique Models
class TechniqueBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    key_points: Optional[List[str]] = None  # Points clés d'exécution
    practice_tips: Optional[List[str]] = None  # Conseils de pratique

class TechniqueCreate(TechniqueBase):
    pass

class Technique(TechniqueBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    mastery_level: MasteryLevel = MasteryLevel.NOT_STARTED
    practice_count: int = 0
    last_practiced: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Kyu Level Models
class KyuLevelBase(BaseModel):
    name: str
    order: int  # For sorting (6 for 6e kyu, 5 for 5e kyu, etc.)
    color: Optional[str] = "#6366f1"  # Default indigo color
    image_url: Optional[str] = None

class KyuLevelCreate(KyuLevelBase):
    pass

class KyuLevel(KyuLevelBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    techniques: List[Technique] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Update Models
class TechniqueUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    mastery_level: Optional[MasteryLevel] = None
    image_url: Optional[str] = None

class KyuLevelUpdate(BaseModel):
    name: Optional[str] = None
    order: Optional[int] = None
    color: Optional[str] = None
    image_url: Optional[str] = None


# Helper function to serialize datetime
def serialize_doc(doc):
    if doc is None:
        return None
    for key, value in doc.items():
        if isinstance(value, datetime):
            doc[key] = value.isoformat()
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, dict):
                    serialize_doc(item)
    return doc

def deserialize_doc(doc):
    if doc is None:
        return None
    datetime_fields = ['created_at', 'last_practiced', 'timestamp']
    for field in datetime_fields:
        if field in doc and isinstance(doc[field], str):
            try:
                doc[field] = datetime.fromisoformat(doc[field])
            except:
                pass
    if 'techniques' in doc:
        for tech in doc['techniques']:
            deserialize_doc(tech)
    return doc


# Status Routes
@api_router.get("/")
async def root():
    return {"message": "Aikido Practice Tracker API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# Kyu Level Routes
@api_router.get("/kyu-levels", response_model=List[KyuLevel])
async def get_kyu_levels():
    """Get all kyu levels with their techniques, sorted by order"""
    kyu_levels = await db.kyu_levels.find({}, {"_id": 0}).sort("order", -1).to_list(100)
    for kyu in kyu_levels:
        deserialize_doc(kyu)
    return kyu_levels

@api_router.post("/kyu-levels", response_model=KyuLevel)
async def create_kyu_level(input: KyuLevelCreate):
    """Create a new kyu level"""
    kyu_obj = KyuLevel(**input.model_dump())
    doc = kyu_obj.model_dump()
    serialize_doc(doc)
    await db.kyu_levels.insert_one(doc)
    return kyu_obj

@api_router.get("/kyu-levels/{kyu_id}", response_model=KyuLevel)
async def get_kyu_level(kyu_id: str):
    """Get a specific kyu level"""
    kyu = await db.kyu_levels.find_one({"id": kyu_id}, {"_id": 0})
    if not kyu:
        raise HTTPException(status_code=404, detail="Kyu level not found")
    deserialize_doc(kyu)
    return kyu

@api_router.put("/kyu-levels/{kyu_id}", response_model=KyuLevel)
async def update_kyu_level(kyu_id: str, input: KyuLevelUpdate):
    """Update a kyu level"""
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.kyu_levels.update_one({"id": kyu_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Kyu level not found")
    
    kyu = await db.kyu_levels.find_one({"id": kyu_id}, {"_id": 0})
    deserialize_doc(kyu)
    return kyu

@api_router.delete("/kyu-levels/{kyu_id}")
async def delete_kyu_level(kyu_id: str):
    """Delete a kyu level"""
    result = await db.kyu_levels.delete_one({"id": kyu_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Kyu level not found")
    return {"message": "Kyu level deleted successfully"}


# Technique Routes
@api_router.post("/kyu-levels/{kyu_id}/techniques", response_model=Technique)
async def add_technique(kyu_id: str, input: TechniqueCreate):
    """Add a technique to a kyu level"""
    kyu = await db.kyu_levels.find_one({"id": kyu_id})
    if not kyu:
        raise HTTPException(status_code=404, detail="Kyu level not found")
    
    technique = Technique(**input.model_dump())
    tech_doc = technique.model_dump()
    serialize_doc(tech_doc)
    
    await db.kyu_levels.update_one(
        {"id": kyu_id},
        {"$push": {"techniques": tech_doc}}
    )
    return technique

@api_router.put("/kyu-levels/{kyu_id}/techniques/{technique_id}", response_model=Technique)
async def update_technique(kyu_id: str, technique_id: str, input: TechniqueUpdate):
    """Update a technique"""
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    # Build update query for nested array
    set_query = {f"techniques.$.{k}": v for k, v in update_data.items()}
    
    result = await db.kyu_levels.update_one(
        {"id": kyu_id, "techniques.id": technique_id},
        {"$set": set_query}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Technique not found")
    
    # Fetch updated technique
    kyu = await db.kyu_levels.find_one({"id": kyu_id}, {"_id": 0})
    for tech in kyu.get('techniques', []):
        if tech['id'] == technique_id:
            deserialize_doc(tech)
            return Technique(**tech)
    
    raise HTTPException(status_code=404, detail="Technique not found")

@api_router.delete("/kyu-levels/{kyu_id}/techniques/{technique_id}")
async def delete_technique(kyu_id: str, technique_id: str):
    """Delete a technique from a kyu level"""
    result = await db.kyu_levels.update_one(
        {"id": kyu_id},
        {"$pull": {"techniques": {"id": technique_id}}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Kyu level not found")
    return {"message": "Technique deleted successfully"}


# Practice Tracking Routes
@api_router.post("/kyu-levels/{kyu_id}/techniques/{technique_id}/practice")
async def record_practice(kyu_id: str, technique_id: str):
    """Record a practice session for a technique"""
    now = datetime.now(timezone.utc).isoformat()
    
    result = await db.kyu_levels.update_one(
        {"id": kyu_id, "techniques.id": technique_id},
        {
            "$inc": {"techniques.$.practice_count": 1},
            "$set": {"techniques.$.last_practiced": now}
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Technique not found")
    
    # Fetch updated technique
    kyu = await db.kyu_levels.find_one({"id": kyu_id}, {"_id": 0})
    for tech in kyu.get('techniques', []):
        if tech['id'] == technique_id:
            deserialize_doc(tech)
            return Technique(**tech)
    
    raise HTTPException(status_code=404, detail="Technique not found")


# Clear and reseed data
@api_router.post("/reseed")
async def reseed_data():
    """Clear all data and reseed - Use for complete data refresh"""
    await db.kyu_levels.delete_many({})
    return await seed_data()


# Seed initial data
@api_router.post("/seed")
async def seed_data():
    """Seed initial Aikido techniques data - Programme officiel"""
    # Check if data already exists
    existing = await db.kyu_levels.count_documents({})
    if existing > 0:
        # Clear existing data for fresh seed
        await db.kyu_levels.delete_many({})
    
    # ═══════════════════════════════════════════════════════════════════════════════════
    # PROGRAMME OFFICIEL AIKIDO - Données complètes par grade
    # ═══════════════════════════════════════════════════════════════════════════════════
    
    initial_data = [
        # ═══════════════════════════════════════════════════════════════
        # 🔰 5e KYU - Minimum 2 mois de pratique ou 20 heures
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "5e KYU",
            "order": 5,
            "color": "#fbbf24",  # Jaune
            "techniques": [
                # ─── SUWARIWAZA ───
                {"name": "Aihanmi Katate Dori - Ikkyo", 
                 "description": "SUWARIWAZA - Première immobilisation (contrôle du coude) depuis saisie main opposée, à genoux",
                 "key_points": ["Position seiza stable", "Contrôle du coude d'uke", "Poussée vers la tête en arc de cercle", "Immobilisation au sol"],
                 "practice_tips": ["Pratiquer le shikko régulièrement", "Garder les hanches basses", "IK-KYO = 1 point principal de contrôle : coude"]},
                {"name": "Aihanmi Katate Dori - Irimi Nage", 
                 "description": "SUWARIWAZA - Projection en entrant (IRI=centre, MI=corps) depuis saisie main opposée, à genoux",
                 "key_points": ["Saisie de la nuque d'aïte", "Déséquilibre par pivot à 180° (tenkan)", "Contrôle du cou en poussant vers la nuque"],
                 "practice_tips": ["Entrer profondément derrière uke", "Garder le centre stable"]},
                {"name": "Shomen Uchi - Ikkyo", 
                 "description": "SUWARIWAZA - Première immobilisation depuis frappe verticale au front (men=front), à genoux",
                 "key_points": ["Intercepter la frappe au moment opportun", "Guider le bras vers le bas", "Contrôle du coude"],
                 "practice_tips": ["Timing essentiel", "La main doit monter et descendre sur l'axe médian du corps"]},
                {"name": "Shomen Uchi - Irimi Nage", 
                 "description": "SUWARIWAZA - Projection en entrant depuis frappe verticale, à genoux",
                 "key_points": ["Esquiver et entrer", "Se placer derrière uke", "Projeter vers l'arrière"],
                 "practice_tips": ["Ne pas bloquer la frappe", "Accompagner le mouvement"]},
                {"name": "Ryote Dori - Kokyu Ho", 
                 "description": "SUWARIWAZA - Exercice de respiration (KO=expire, KYU=inspire, HO=méthode) depuis saisie des deux poignets",
                 "key_points": ["Uke saisit les deux poignets", "Lever les bras en utilisant le centre (hara)", "Pousser vers les épaules d'uke"],
                 "practice_tips": ["Ne pas utiliser la force des bras", "Respiration coordonnée", "Exercice fondamental à pratiquer à chaque séance"]},
                # ─── TACHIWAZA ───
                {"name": "Aihanmi Katate Dori - Ikkyo", 
                 "description": "TACHIWAZA - Première immobilisation depuis saisie main opposée, debout",
                 "key_points": ["Contrôler le coude avec la main extérieure", "Guider le bras vers le bas et l'avant", "Avancer en irimi", "Immobiliser au sol"],
                 "practice_tips": ["Ne pas forcer avec les bras", "Utiliser le poids du corps"]},
                {"name": "Aihanmi Katate Dori - Shiho Nage", 
                 "description": "TACHIWAZA - Projection dans les quatre directions (SHI=4, HO=direction, NAGE=projection)",
                 "key_points": ["Saisie du poignet", "Déséquilibre et passage sous le bras", "Torsion du poignet du haut vers le bas", "Coupe de sabre"],
                 "practice_tips": ["Mouvement circulaire et continu", "Ne pas tordre le poignet excessivement"]},
                {"name": "Aihanmi Katate Dori - Irimi Nage", 
                 "description": "TACHIWAZA - Projection en entrant depuis saisie main opposée, debout",
                 "key_points": ["Entrer profondément (irimi)", "Contrôler la tête/nuque d'uke", "Étendre vers l'avant et le bas"],
                 "practice_tips": ["L'entrée est la clé", "Ne pas pousser mais étendre"]},
                {"name": "Gyakuhanmi Katate Dori - Tenchi Nage", 
                 "description": "TACHIWAZA - Projection ciel-terre (TEN=ciel, CHI=terre) depuis saisie croisée",
                 "key_points": ["Un bras monte vers le ciel", "Un bras descend vers la terre", "Entrée sur le côté d'aïte"],
                 "practice_tips": ["Les deux bras travaillent en opposition", "Avancer au centre d'uke"]},
                {"name": "Shomen Uchi - Ikkyo", 
                 "description": "TACHIWAZA - Première immobilisation depuis frappe verticale, debout",
                 "key_points": ["Entrer au moment où uke lève le bras", "Bloquer/guider au niveau du coude", "Couper vers le bas"],
                 "practice_tips": ["Timing crucial", "Sensation de couper avec tout le corps"]},
                {"name": "Shomen Uchi - Irimi Nage", 
                 "description": "TACHIWAZA - Projection en entrant depuis frappe verticale, debout",
                 "key_points": ["Esquiver la frappe en entrant", "Se placer derrière uke", "Projeter"],
                 "practice_tips": ["Ne pas bloquer mais accompagner", "Fluidité du mouvement"]}
            ]
        },
        # ═══════════════════════════════════════════════════════════════
        # 🟠 4e KYU - Minimum 3 mois après le 5e Kyu ou 60 heures
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "4e KYU",
            "order": 4,
            "color": "#f97316",  # Orange
            "techniques": [
                # ─── SUWARIWAZA ───
                {"name": "Aihanmi Katate Dori - Nikyo", 
                 "description": "SUWARIWAZA - Deuxième immobilisation (2 points: coude + poignet) depuis saisie main opposée",
                 "key_points": ["Même mouvement de base qu'Ikkyo", "Sollicitation des articulations du poignet et du coude", "Pression sur l'épaule à l'immobilisation"],
                 "practice_tips": ["Contrôle précis, pas de force excessive", "NI-KYO = 2 points principaux de contrôle"]},
                {"name": "Aihanmi Katate Dori - Sankyo", 
                 "description": "SUWARIWAZA - Troisième immobilisation (3 points: coude + poignet + épaule)",
                 "key_points": ["Base de départ = Ikkyo", "Contrôle du tranchant de la main d'aïte", "Mouvement de vrille"],
                 "practice_tips": ["Mouvement en spirale", "SAN-KYO = 3 points principaux de contrôle"]},
                {"name": "Aihanmi Katate Dori - Yonkyo", 
                 "description": "SUWARIWAZA - Quatrième immobilisation (pression point nerveux sur avant-bras)",
                 "key_points": ["Départ Ikkyo", "Pression avec la première phalange de l'index", "Appliqué comme pour une coupe au sabre"],
                 "practice_tips": ["Trouver le bon point de pression sur la face interne de l'avant-bras"]},
                {"name": "Kata Dori - Ikkyo", 
                 "description": "SUWARIWAZA - Première immobilisation depuis saisie de l'épaule du keikogi",
                 "key_points": ["Saisie ferme pour pousser ou tirer", "Contrôler le bras qui saisit", "Réagir dès la saisie"],
                 "practice_tips": ["Ne pas laisser uke s'installer"]},
                {"name": "Kata Dori - Nikyo", 
                 "description": "SUWARIWAZA - Deuxième immobilisation depuis saisie de l'épaule",
                 "key_points": ["Transition vers nikyo", "Contrôle du poignet", "Rotation externe"],
                 "practice_tips": ["Fluidité de la transition"]},
                {"name": "Shomen Uchi - Nikyo", 
                 "description": "SUWARIWAZA - Deuxième immobilisation depuis frappe verticale, à genoux",
                 "key_points": ["Intercepter la frappe", "Transition vers saisie nikyo", "Contrôle du poignet"],
                 "practice_tips": ["Timing de l'interception"]},
                {"name": "Shomen Uchi - Kote Gaeshi", 
                 "description": "SUWARIWAZA - Torsion du poignet (KO=petit, TE=main, GAESHI=torsion) depuis frappe verticale",
                 "key_points": ["Saisir la main d'uke", "Petit cercle autour du poignet", "Enroulement du poignet sur lui-même"],
                 "practice_tips": ["Saisie de la main, pas du poignet", "Uke doit chuter pour se protéger"]},
                # ─── TACHIWAZA ───
                {"name": "Aihanmi Katate Dori - Nikyo", 
                 "description": "TACHIWAZA - Deuxième immobilisation depuis saisie main opposée, debout",
                 "key_points": ["Contrôle du poignet en rotation", "Coude plié", "Pression précise"],
                 "practice_tips": ["Précision du contrôle", "Communication avec uke"]},
                {"name": "Aihanmi Katate Dori - Sankyo", 
                 "description": "TACHIWAZA - Troisième immobilisation depuis saisie main opposée, debout",
                 "key_points": ["Spirale du poignet vers l'extérieur", "Contrôle progressif", "Amener au sol"],
                 "practice_tips": ["Mouvement continu"]},
                {"name": "Aihanmi Katate Dori - Yonkyo", 
                 "description": "TACHIWAZA - Quatrième immobilisation depuis saisie main opposée, debout",
                 "key_points": ["Point de pression sur l'avant-bras", "Trajectoire d'ikkyo"],
                 "practice_tips": ["Localiser le point nerveux"]},
                {"name": "Aihanmi Katate Dori - Udekime Nage", 
                 "description": "TACHIWAZA - Projection par blocage du coude (UDE=bras, KIME=blocage)",
                 "key_points": ["Contrôle du coude d'uke", "Arm-lock au niveau du coude", "Projection"],
                 "practice_tips": ["Ne pas forcer l'articulation"]},
                {"name": "Aihanmi Katate Dori - Kote Gaeshi", 
                 "description": "TACHIWAZA - Retournement du poignet depuis saisie main opposée",
                 "key_points": ["Saisir la main", "Rotation externe", "Projeter"],
                 "practice_tips": ["Contrôle de la main, pas du bras"]},
                {"name": "Aihanmi Katate Dori - Koshi Nage", 
                 "description": "TACHIWAZA - Projection de hanches (KOSHI=hanches)",
                 "key_points": ["Entrer sous le centre d'uke", "Charger sur la hanche", "Projeter par rotation"],
                 "practice_tips": ["Placement des hanches crucial"]},
                {"name": "Gyakuhanmi Katate Dori - Ikkyo", 
                 "description": "TACHIWAZA - Première immobilisation depuis saisie croisée (poignet gauche avec main droite)",
                 "key_points": ["Contrôle du coude", "Guider vers le bas", "Immobilisation au sol"],
                 "practice_tips": ["Adapter à la saisie croisée"]},
                {"name": "Gyakuhanmi Katate Dori - Nikyo", 
                 "description": "TACHIWAZA - Deuxième immobilisation depuis saisie croisée",
                 "key_points": ["Contrôle du poignet", "Rotation externe"],
                 "practice_tips": ["Transition fluide"]},
                {"name": "Gyakuhanmi Katate Dori - Shiho Nage", 
                 "description": "TACHIWAZA - Projection quatre directions depuis saisie croisée",
                 "key_points": ["Lever le bras comme un sabre", "Passer sous le bras", "Couper vers le bas"],
                 "practice_tips": ["Mouvement circulaire"]},
                {"name": "Gyakuhanmi Katate Dori - Udekime Nage", 
                 "description": "TACHIWAZA - Projection par contrôle du coude depuis saisie croisée",
                 "key_points": ["Extension du bras d'uke", "Contrôle de l'articulation"],
                 "practice_tips": ["Respect de l'articulation"]},
                {"name": "Gyakuhanmi Katate Dori - Kote Gaeshi", 
                 "description": "TACHIWAZA - Retournement du poignet depuis saisie croisée",
                 "key_points": ["Saisie de la main", "Rotation externe", "Projection"],
                 "practice_tips": ["Précision de la saisie"]},
                {"name": "Gyakuhanmi Katate Dori - Irimi Nage", 
                 "description": "TACHIWAZA - Projection en entrant depuis saisie croisée",
                 "key_points": ["Entrer profondément", "Contrôle de la tête"],
                 "practice_tips": ["L'entrée est essentielle"]},
                {"name": "Gyakuhanmi Katate Dori - Uchi Kaiten Nage", 
                 "description": "TACHIWAZA - Projection rotative intérieure (UCHI=intérieur, KAITEN=rotation)",
                 "key_points": ["Entrée sur le côté d'aïte", "Passer sous son bras avec atemi", "Pivot avec descente du bras"],
                 "practice_tips": ["Accompagner la rotation"]},
                {"name": "Gyakuhanmi Katate Dori - Soto Kaiten Nage", 
                 "description": "TACHIWAZA - Projection rotative extérieure (SOTO=extérieur)",
                 "key_points": ["Rotation extérieure", "Guider uke", "Projection"],
                 "practice_tips": ["Différencier uchi et soto kaiten"]},
                {"name": "Kata Dori - Ikkyo", 
                 "description": "TACHIWAZA - Première immobilisation depuis saisie de l'épaule",
                 "key_points": ["Réagir à la saisie", "Contrôle du bras"],
                 "practice_tips": ["Réaction immédiate"]},
                {"name": "Kata Dori - Nikyo", 
                 "description": "TACHIWAZA - Deuxième immobilisation depuis saisie de l'épaule",
                 "key_points": ["Transition vers nikyo", "Contrôle du poignet"],
                 "practice_tips": ["Fluidité"]},
                {"name": "Shomen Uchi - Nikyo", 
                 "description": "TACHIWAZA - Deuxième immobilisation depuis frappe verticale",
                 "key_points": ["Intercepter la frappe", "Transition vers nikyo"],
                 "practice_tips": ["Timing"]},
                {"name": "Shomen Uchi - Sankyo (Uchi/Soto Kaiten)", 
                 "description": "TACHIWAZA - Troisième immobilisation depuis frappe verticale avec rotation",
                 "key_points": ["Interception", "Spirale du poignet", "Contrôle au sol"],
                 "practice_tips": ["Mouvement en spirale"]},
                {"name": "Shomen Uchi - Yonkyo", 
                 "description": "TACHIWAZA - Quatrième immobilisation depuis frappe verticale",
                 "key_points": ["Point de pression", "Trajectoire d'ikkyo"],
                 "practice_tips": ["Localiser le point nerveux"]},
                {"name": "Shomen Uchi - Kote Gaeshi", 
                 "description": "TACHIWAZA - Retournement du poignet depuis frappe verticale",
                 "key_points": ["Saisir la main", "Rotation externe", "Projection"],
                 "practice_tips": ["Timing de la saisie"]},
                {"name": "Yokomen Uchi - Shiho Nage", 
                 "description": "TACHIWAZA - Projection quatre directions depuis frappe diagonale à la tempe",
                 "key_points": ["Intercepter la frappe diagonale", "Lever et passer sous le bras", "Couper"],
                 "practice_tips": ["La main monte sur l'axe médian pour protéger le visage"]},
                {"name": "Yokomen Uchi - Udekime Nage", 
                 "description": "TACHIWAZA - Projection par contrôle du coude depuis frappe diagonale",
                 "key_points": ["Contrôle du coude", "Extension", "Projection"],
                 "practice_tips": ["Intercepter correctement"]},
                {"name": "Yokomen Uchi - Kokyu Nage", 
                 "description": "TACHIWAZA - Projection par expansion de l'énergie (KOKYU) depuis frappe diagonale",
                 "key_points": ["Utiliser le dynamisme d'aïte", "Sans sollicitation des techniques de base"],
                 "practice_tips": ["Respiration coordonnée", "Légèreté du mouvement"]},
                # ─── USHIRO WAZA ───
                {"name": "Katate Dori Kubishime - Ikkyo", 
                 "description": "USHIRO WAZA - Première immobilisation depuis saisie poignet + étranglement arrière",
                 "key_points": ["Se dégager de l'étranglement", "Contrôler le bras", "Immobiliser"],
                 "practice_tips": ["Réagir immédiatement", "Protéger sa gorge"]},
                {"name": "Katate Dori Kubishime - Irimi Nage", 
                 "description": "USHIRO WAZA - Projection en entrant depuis saisie poignet + étranglement",
                 "key_points": ["Se libérer", "Entrer et contrôler", "Projeter"],
                 "practice_tips": ["Réaction rapide", "Ne pas paniquer"]}
            ]
        },
        # ═══════════════════════════════════════════════════════════════
        # 🟢 3e KYU - Minimum 6 mois après le 4e Kyu ou 120 heures
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "3e KYU",
            "order": 3,
            "color": "#22c55e",  # Vert
            "techniques": [
                # ─── HANMI HANDACHI WAZA ───
                {"name": "Gyakuhanmi Katate Dori - Ikkyo", 
                 "description": "HANMI HANDACHI WAZA - Tori à genoux, uke debout - Première immobilisation",
                 "key_points": ["Tori reste à genoux", "Contrôle du coude d'uke debout", "Utiliser les hanches"],
                 "practice_tips": ["Compenser la différence de hauteur", "Shikko maîtrisé"]},
                {"name": "Gyakuhanmi Katate Dori - Shiho Nage", 
                 "description": "HANMI HANDACHI WAZA - Projection quatre directions, tori à genoux",
                 "key_points": ["Lever le bras d'uke", "Passer sous le bras depuis les genoux", "Couper vers le bas"],
                 "practice_tips": ["Mobilité à genoux essentielle"]},
                # ─── TACHIWAZA ───
                {"name": "Ryote Dori - Tenchi Nage", 
                 "description": "TACHIWAZA - Projection ciel-terre depuis saisie des deux poignets",
                 "key_points": ["Un bras monte (ciel)", "Un bras descend (terre)", "Avancer au centre"],
                 "practice_tips": ["Opposition des deux bras"]},
                {"name": "Ryote Dori - Kokyu Nage", 
                 "description": "TACHIWAZA - Projection par respiration depuis saisie des deux poignets",
                 "key_points": ["Utiliser le kokyu", "Projeter sans force"],
                 "practice_tips": ["Respiration abdominale"]},
                {"name": "Ryote Dori - Koshi Nage", 
                 "description": "TACHIWAZA - Projection de hanche depuis saisie des deux poignets",
                 "key_points": ["Entrer sous uke", "Charger sur la hanche", "Projeter"],
                 "practice_tips": ["Placement précis"]},
                {"name": "Chudan Tsuki - Ikkyo", 
                 "description": "TACHIWAZA - Première immobilisation depuis coup de poing direct à l'abdomen",
                 "key_points": ["Esquiver le coup", "Contrôler le bras qui frappe", "Le coup est accompagné d'un déplacement du corps vers l'avant"],
                 "practice_tips": ["Timing de l'esquive", "Ne pas bloquer frontalement"]},
                {"name": "Chudan Tsuki - Kote Gaeshi", 
                 "description": "TACHIWAZA - Retournement du poignet depuis coup de poing niveau moyen",
                 "key_points": ["Esquiver", "Saisir la main", "Rotation et projection"],
                 "practice_tips": ["On ne retire pas immédiatement le poing"]},
                {"name": "Chudan Tsuki - Irimi Nage", 
                 "description": "TACHIWAZA - Projection en entrant depuis coup de poing niveau moyen",
                 "key_points": ["Esquiver et entrer", "Contrôle de la tête"],
                 "practice_tips": ["Ne pas rester sur la ligne d'attaque"]},
                {"name": "Chudan Tsuki - Uchi Kaiten Nage", 
                 "description": "TACHIWAZA - Projection rotative intérieure depuis coup de poing",
                 "key_points": ["Rotation intérieure", "Guider uke"],
                 "practice_tips": ["Accompagner l'énergie du coup"]},
                {"name": "Chudan Tsuki - Soto Kaiten Nage", 
                 "description": "TACHIWAZA - Projection rotative extérieure depuis coup de poing",
                 "key_points": ["Rotation extérieure", "Projection"],
                 "practice_tips": ["Esquive latérale"]},
                {"name": "Yokomen Uchi - Ikkyo", 
                 "description": "TACHIWAZA - Première immobilisation depuis frappe diagonale à la tempe",
                 "key_points": ["Intercepter la frappe", "Contrôle du coude"],
                 "practice_tips": ["Timing d'interception"]},
                {"name": "Yokomen Uchi - Nikyo", 
                 "description": "TACHIWAZA - Deuxième immobilisation depuis frappe diagonale",
                 "key_points": ["Interception", "Transition vers nikyo"],
                 "practice_tips": ["Fluidité de la transition"]},
                {"name": "Yokomen Uchi - Sankyo", 
                 "description": "TACHIWAZA - Troisième immobilisation depuis frappe diagonale",
                 "key_points": ["Spirale du poignet", "Contrôle progressif"],
                 "practice_tips": ["Mouvement en spirale"]},
                {"name": "Yokomen Uchi - Yonkyo", 
                 "description": "TACHIWAZA - Quatrième immobilisation depuis frappe diagonale",
                 "key_points": ["Point de pression", "Trajectoire d'ikkyo"],
                 "practice_tips": ["Localiser le point"]},
                {"name": "Yokomen Uchi - Gokyo", 
                 "description": "TACHIWAZA - Cinquième immobilisation (technique spéciale couteau)",
                 "key_points": ["Même principe qu'Ikkyo (ura)", "Contrôle du poignet par en-dessous", "Sécurité pour le couteau"],
                 "practice_tips": ["GO-KYO = technique particulière sur attaque au couteau"]},
                {"name": "Yokomen Uchi - Kote Gaeshi", 
                 "description": "TACHIWAZA - Retournement du poignet depuis frappe diagonale",
                 "key_points": ["Saisir la main", "Rotation externe"],
                 "practice_tips": ["Adaptation à la trajectoire"]},
                {"name": "Yokomen Uchi - Irimi Nage", 
                 "description": "TACHIWAZA - Projection en entrant depuis frappe diagonale",
                 "key_points": ["Entrer sur le côté de la frappe", "Contrôle de la tête"],
                 "practice_tips": ["Accompagner"]},
                {"name": "Kata Dori Menuchi - Ikkyo", 
                 "description": "TACHIWAZA - Première immobilisation depuis saisie épaule + frappe shomen",
                 "key_points": ["Gérer la double attaque", "Neutraliser la frappe", "Contrôler le bras"],
                 "practice_tips": ["Priorité à la frappe"]},
                {"name": "Kata Dori Menuchi - Nikyo", 
                 "description": "TACHIWAZA - Deuxième immobilisation depuis saisie épaule + frappe",
                 "key_points": ["Gérer la double attaque", "Transition vers nikyo"],
                 "practice_tips": ["Fluidité sous pression"]},
                {"name": "Katate Ryote Dori (Morote) - Ikkyo", 
                 "description": "TACHIWAZA - Première immobilisation depuis saisie d'un poignet à deux mains",
                 "key_points": ["Uke saisit un poignet avec ses deux mains", "Uke se trouve à l'extérieur de tori", "Travailler avec le bras saisi dans l'axe du corps"],
                 "practice_tips": ["Utiliser le centre, pas les bras"]},
                {"name": "Katate Ryote Dori (Morote) - Nikyo", 
                 "description": "TACHIWAZA - Deuxième immobilisation depuis saisie d'un poignet à deux mains",
                 "key_points": ["Se libérer de la double saisie", "Transition vers nikyo"],
                 "practice_tips": ["Ne pas forcer"]},
                {"name": "Katate Ryote Dori (Morote) - Kokyu Nage", 
                 "description": "TACHIWAZA - Projection par respiration depuis saisie d'un poignet à deux mains",
                 "key_points": ["Kokyu", "Lever en arc de cercle", "Projeter"],
                 "practice_tips": ["Exercice fondamental"]},
                # ─── USHIRO WAZA ───
                {"name": "Ryote Dori - Ikkyo", 
                 "description": "USHIRO WAZA - Première immobilisation depuis saisie arrière des deux poignets",
                 "key_points": ["Se retourner pour faire face", "Contrôler le bras", "Uke passe derrière tori pour saisir le deuxième poignet"],
                 "practice_tips": ["Pivoter rapidement"]},
                {"name": "Ryote Dori - Kote Gaeshi", 
                 "description": "USHIRO WAZA - Retournement du poignet depuis saisie arrière des deux poignets",
                 "key_points": ["Pivoter", "Saisir la main", "Rotation"],
                 "practice_tips": ["Pivotement fluide"]},
                {"name": "Ryote Dori - Irimi Nage", 
                 "description": "USHIRO WAZA - Projection en entrant depuis saisie arrière des deux poignets",
                 "key_points": ["Se retourner", "Entrer et contrôler"],
                 "practice_tips": ["Réaction immédiate"]}
            ]
        },
        # ═══════════════════════════════════════════════════════════════
        # 🔵 2e KYU - Minimum 7 mois après le 3e Kyu ou 140 heures
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "2e KYU",
            "order": 2,
            "color": "#3b82f6",  # Bleu
            "techniques": [
                # ─── SUWARIWAZA ───
                {"name": "Yokomen Uchi - Ikkyo", 
                 "description": "SUWARIWAZA - Première immobilisation depuis frappe diagonale, à genoux",
                 "key_points": ["Intercepter à genoux", "Contrôle du coude"],
                 "practice_tips": ["Mobilité en shikko"]},
                {"name": "Yokomen Uchi - Nikyo", 
                 "description": "SUWARIWAZA - Deuxième immobilisation depuis frappe diagonale, à genoux",
                 "key_points": ["Transition vers nikyo", "Contrôle du poignet"],
                 "practice_tips": ["Fluidité à genoux"]},
                {"name": "Yokomen Uchi - Sankyo", 
                 "description": "SUWARIWAZA - Troisième immobilisation depuis frappe diagonale, à genoux",
                 "key_points": ["Spirale du poignet", "Contrôle progressif"],
                 "practice_tips": ["Stabilité des hanches"]},
                {"name": "Yokomen Uchi - Yonkyo", 
                 "description": "SUWARIWAZA - Quatrième immobilisation depuis frappe diagonale, à genoux",
                 "key_points": ["Point de pression"],
                 "practice_tips": ["Pression juste"]},
                {"name": "Yokomen Uchi - Kote Gaeshi", 
                 "description": "SUWARIWAZA - Retournement du poignet depuis frappe diagonale, à genoux",
                 "key_points": ["Saisir la main", "Rotation"],
                 "practice_tips": ["Timing"]},
                {"name": "Yokomen Uchi - Irimi Nage", 
                 "description": "SUWARIWAZA - Projection en entrant depuis frappe diagonale, à genoux",
                 "key_points": ["Entrer à genoux", "Contrôle de la tête"],
                 "practice_tips": ["Shikko fluide"]},
                # ─── HANMI HANDACHI WAZA ───
                {"name": "Ryote Dori - Shiho Nage", 
                 "description": "HANMI HANDACHI WAZA - Projection quatre directions depuis saisie deux poignets",
                 "key_points": ["Tori à genoux, uke debout", "Lever et passer sous"],
                 "practice_tips": ["Compenser la hauteur"]},
                {"name": "Ryote Dori - Kokyu Nage", 
                 "description": "HANMI HANDACHI WAZA - Projection par respiration depuis saisie deux poignets",
                 "key_points": ["Utiliser le kokyu", "Projeter vers l'arrière"],
                 "practice_tips": ["Centre stable"]},
                {"name": "Ushiro Ryokata Dori - Ikkyo", 
                 "description": "HANMI HANDACHI WAZA - Première immobilisation depuis saisie arrière des épaules",
                 "key_points": ["Se dégager", "Contrôler le bras"],
                 "practice_tips": ["Réaction rapide"]},
                {"name": "Ushiro Ryokata Dori - Nikyo", 
                 "description": "HANMI HANDACHI WAZA - Deuxième immobilisation depuis saisie arrière des épaules",
                 "key_points": ["Se libérer", "Transition vers nikyo"],
                 "practice_tips": ["Fluidité"]},
                {"name": "Ushiro Ryokata Dori - Sankyo", 
                 "description": "HANMI HANDACHI WAZA - Troisième immobilisation depuis saisie arrière des épaules",
                 "key_points": ["Spirale du poignet"],
                 "practice_tips": ["Continuité"]},
                {"name": "Ushiro Ryokata Dori - Kokyu Nage", 
                 "description": "HANMI HANDACHI WAZA - Projection par respiration depuis saisie arrière des épaules",
                 "key_points": ["Kokyu", "Se libérer et projeter"],
                 "practice_tips": ["Légèreté"]},
                # ─── TACHIWAZA ───
                {"name": "Gyakuhanmi Katate Dori - Sankyo", 
                 "description": "TACHIWAZA - Troisième immobilisation depuis saisie croisée",
                 "key_points": ["Spirale du poignet", "Rotation extérieure"],
                 "practice_tips": ["Continuité du mouvement"]},
                {"name": "Gyakuhanmi Katate Dori - Yonkyo", 
                 "description": "TACHIWAZA - Quatrième immobilisation depuis saisie croisée",
                 "key_points": ["Point de pression", "Trajectoire d'ikkyo"],
                 "practice_tips": ["Pression progressive"]},
                {"name": "Gyakuhanmi Katate Dori - Kokyu Nage", 
                 "description": "TACHIWAZA - Projection par respiration depuis saisie croisée",
                 "key_points": ["Utiliser le kokyu", "Projeter sans force"],
                 "practice_tips": ["Légèreté"]},
                {"name": "Gyakuhanmi Katate Dori - Sumi Otoshi", 
                 "description": "TACHIWAZA - Projection par le coin (SUMI=coin, OTOSHI=tomber)",
                 "key_points": ["Même entrée que tenchi", "Descente sur les genoux", "Balayage des jambes"],
                 "practice_tips": ["Direction du déséquilibre"]},
                {"name": "Gyakuhanmi Katate Dori - Hijikime Osae", 
                 "description": "TACHIWAZA - Immobilisation par blocage du coude (HIJI=coude, OSAE=immobilisation)",
                 "key_points": ["Contrôle du bras tendu", "Arm-lock au niveau du coude", "Descente vers le sol de l'épaule d'aïte"],
                 "practice_tips": ["Contrôle précis"]},
                {"name": "Jodan Tsuki - Ikkyo", 
                 "description": "TACHIWAZA - Première immobilisation depuis coup de poing haut (vers la trachée)",
                 "key_points": ["Esquiver le coup haut", "Contrôler le bras", "Le coup est porté selon un demi-cercle"],
                 "practice_tips": ["Esquive vers l'extérieur"]},
                {"name": "Jodan Tsuki - Irimi Nage", 
                 "description": "TACHIWAZA - Projection en entrant depuis coup de poing haut",
                 "key_points": ["Esquiver et entrer", "Contrôle de la tête"],
                 "practice_tips": ["Entrer profondément"]},
                {"name": "Shomen Uchi - Kaiten Nage (Soto/Uchi)", 
                 "description": "TACHIWAZA - Projection rotative depuis frappe verticale",
                 "key_points": ["Rotation intérieure ou extérieure", "Guider uke"],
                 "practice_tips": ["Rediriger"]},
                {"name": "Shomen Uchi - Koshi Nage", 
                 "description": "TACHIWAZA - Projection de hanche depuis frappe verticale",
                 "key_points": ["Entrer sous uke", "Charger sur la hanche"],
                 "practice_tips": ["Timing de l'entrée"]},
                {"name": "Kata Dori Menuchi - Shiho Nage", 
                 "description": "TACHIWAZA - Projection quatre directions depuis saisie épaule + frappe",
                 "key_points": ["Gérer la double attaque", "Lever et couper"],
                 "practice_tips": ["Priorité à la frappe"]},
                {"name": "Kata Dori Menuchi - Udekime Nage", 
                 "description": "TACHIWAZA - Projection par contrôle du coude depuis saisie épaule + frappe",
                 "key_points": ["Contrôle du coude", "Extension"],
                 "practice_tips": ["Réaction rapide"]},
                {"name": "Kata Dori Menuchi - Kote Gaeshi", 
                 "description": "TACHIWAZA - Retournement du poignet depuis saisie épaule + frappe",
                 "key_points": ["Saisir la main", "Rotation"],
                 "practice_tips": ["Timing"]},
                {"name": "Kata Dori Menuchi - Irimi Nage", 
                 "description": "TACHIWAZA - Projection en entrant depuis saisie épaule + frappe",
                 "key_points": ["Entrer", "Contrôle de la tête"],
                 "practice_tips": ["Entrer profondément"]},
                {"name": "Katate Ryote Dori - Shiho Nage", 
                 "description": "TACHIWAZA - Projection quatre directions depuis saisie poignet à deux mains",
                 "key_points": ["Se libérer de la double saisie", "Lever et couper"],
                 "practice_tips": ["Utiliser le kokyu"]},
                {"name": "Katate Ryote Dori - Udekime Nage", 
                 "description": "TACHIWAZA - Projection par contrôle du coude depuis saisie poignet à deux mains",
                 "key_points": ["Extension du bras", "Contrôle"],
                 "practice_tips": ["Se libérer d'abord"]},
                {"name": "Katate Ryote Dori - Kote Gaeshi", 
                 "description": "TACHIWAZA - Retournement du poignet depuis saisie poignet à deux mains",
                 "key_points": ["Saisir la main d'uke", "Rotation"],
                 "practice_tips": ["Se dégager"]},
                {"name": "Katate Ryote Dori - Irimi Nage", 
                 "description": "TACHIWAZA - Projection en entrant depuis saisie poignet à deux mains",
                 "key_points": ["Se libérer", "Entrer"],
                 "practice_tips": ["Utiliser le centre"]},
                {"name": "Katate Ryote Dori - Juji Garami", 
                 "description": "TACHIWAZA - Projection sur bras liés en croix (JUJI=croix, GARAMI=lier)",
                 "key_points": ["Saisir les bras en les croisant", "Projection en avant"],
                 "practice_tips": ["Technique avancée"]},
                {"name": "Muna Dori - Ikkyo", 
                 "description": "TACHIWAZA - Première immobilisation depuis saisie du revers (doublure du keikogi)",
                 "key_points": ["Contrôler le bras qui saisit", "Guider vers le bas"],
                 "practice_tips": ["Réaction immédiate"]},
                {"name": "Muna Dori - Nikyo", 
                 "description": "TACHIWAZA - Deuxième immobilisation depuis saisie du revers",
                 "key_points": ["Transition vers nikyo", "Contrôle du poignet"],
                 "practice_tips": ["Fluidité"]},
                {"name": "Muna Dori - Shiho Nage", 
                 "description": "TACHIWAZA - Projection quatre directions depuis saisie du revers",
                 "key_points": ["Lever le bras", "Passer sous", "Couper"],
                 "practice_tips": ["Mouvement circulaire"]},
                {"name": "Yokomen Uchi - Koshi Nage", 
                 "description": "TACHIWAZA - Projection de hanche depuis frappe diagonale",
                 "key_points": ["Entrer sous uke", "Charger sur la hanche"],
                 "practice_tips": ["Placement des hanches"]},
                {"name": "Ryote Dori - Juji Garami", 
                 "description": "TACHIWAZA - Contrôle croisé des bras depuis saisie deux poignets",
                 "key_points": ["Croiser les bras", "Contrôler"],
                 "practice_tips": ["Coordination"]},
                # ─── USHIRO WAZA ───
                {"name": "Ushiro Ryote Dori - Nikyo", 
                 "description": "USHIRO WAZA - Deuxième immobilisation depuis saisie arrière des deux poignets",
                 "key_points": ["Pivoter", "Transition vers nikyo"],
                 "practice_tips": ["Pivotement fluide"]},
                {"name": "Ushiro Ryote Dori - Sankyo", 
                 "description": "USHIRO WAZA - Troisième immobilisation depuis saisie arrière des deux poignets",
                 "key_points": ["Spirale du poignet"],
                 "practice_tips": ["Continuité"]},
                {"name": "Ushiro Ryote Dori - Yonkyo", 
                 "description": "USHIRO WAZA - Quatrième immobilisation depuis saisie arrière des deux poignets",
                 "key_points": ["Point de pression"],
                 "practice_tips": ["Pression juste"]},
                {"name": "Ushiro Ryote Dori - Shiho Nage", 
                 "description": "USHIRO WAZA - Projection quatre directions depuis saisie arrière des deux poignets",
                 "key_points": ["Pivoter", "Lever et couper"],
                 "practice_tips": ["Se retourner efficacement"]},
                {"name": "Ushiro Ryokata Dori - Ikkyo", 
                 "description": "USHIRO WAZA - Première immobilisation depuis saisie arrière des deux épaules",
                 "key_points": ["Se dégager", "Contrôler le bras"],
                 "practice_tips": ["Réaction immédiate"]},
                {"name": "Ushiro Ryokata Dori - Nikyo", 
                 "description": "USHIRO WAZA - Deuxième immobilisation depuis saisie arrière des deux épaules",
                 "key_points": ["Se libérer", "Transition vers nikyo"],
                 "practice_tips": ["Fluidité"]},
                {"name": "Ushiro Ryokata Dori - Irimi Nage", 
                 "description": "USHIRO WAZA - Projection en entrant depuis saisie arrière des deux épaules",
                 "key_points": ["Se retourner", "Entrer et projeter"],
                 "practice_tips": ["Pivotement rapide"]}
            ]
        },
        # ═══════════════════════════════════════════════════════════════
        # 🟤 1er KYU - Minimum 8 mois après le 2e Kyu ou 160 heures
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "1er KYU",
            "order": 1,
            "color": "#92400e",  # Marron
            "techniques": [
                # ─── SUWARIWAZA ───
                {"name": "Ryote Dori - Ikkyo", 
                 "description": "SUWARIWAZA - Première immobilisation depuis saisie des deux poignets, à genoux",
                 "key_points": ["Uke saisit les deux poignets", "Contrôle d'un bras"],
                 "practice_tips": ["Travail des hanches à genoux"]},
                {"name": "Ryo Kata Dori - Ikkyo", 
                 "description": "SUWARIWAZA - Première immobilisation depuis saisie des deux épaules face à face",
                 "key_points": ["Se dégager de la double saisie", "Contrôler un bras"],
                 "practice_tips": ["Utiliser le centre"]},
                # ─── HANMI HANDACHI WAZA ───
                {"name": "Gyakuhanmi Katate Dori - Kote Gaeshi", 
                 "description": "HANMI HANDACHI WAZA - Retournement du poignet depuis saisie croisée",
                 "key_points": ["Tori à genoux", "Saisir la main", "Rotation"],
                 "practice_tips": ["Compenser la hauteur"]},
                {"name": "Gyakuhanmi Katate Dori - Irimi Nage", 
                 "description": "HANMI HANDACHI WAZA - Projection en entrant depuis saisie croisée",
                 "key_points": ["Entrer depuis les genoux", "Contrôle de la tête"],
                 "practice_tips": ["Mobilité à genoux"]},
                {"name": "Gyakuhanmi Katate Dori - Kaiten Nage", 
                 "description": "HANMI HANDACHI WAZA - Projection rotative depuis saisie croisée",
                 "key_points": ["Rotation", "Guider uke"],
                 "practice_tips": ["Fluidité"]},
                {"name": "Gyakuhanmi Katate Dori - Sumi Otoshi", 
                 "description": "HANMI HANDACHI WAZA - Projection par le coin depuis saisie croisée",
                 "key_points": ["Déséquilibrer vers le coin"],
                 "practice_tips": ["Direction du déséquilibre"]},
                {"name": "Shomen Uchi - Irimi Nage", 
                 "description": "HANMI HANDACHI WAZA - Projection en entrant depuis frappe verticale",
                 "key_points": ["Esquiver à genoux", "Entrer et contrôler"],
                 "practice_tips": ["Mobilité en shikko"]},
                # ─── TACHIWAZA ───
                {"name": "Ryote Dori - Ikkyo", 
                 "description": "TACHIWAZA - Première immobilisation depuis saisie des deux poignets",
                 "key_points": ["Choisir un bras à contrôler", "Guider vers le bas"],
                 "practice_tips": ["Décision rapide"]},
                {"name": "Ryo Kata Dori - Ikkyo", 
                 "description": "TACHIWAZA - Première immobilisation depuis saisie des deux épaules face à face",
                 "key_points": ["Se dégager", "Contrôler un bras"],
                 "practice_tips": ["Réaction immédiate"]},
                {"name": "Shomen Uchi - Gokyo", 
                 "description": "TACHIWAZA - Cinquième immobilisation (technique couteau) depuis frappe verticale",
                 "key_points": ["Contrôle spécial pour couteau", "Poignet vers l'extérieur", "Sécurité"],
                 "practice_tips": ["Technique de désarmement"]},
                {"name": "Shomen Uchi - Shiho Nage", 
                 "description": "TACHIWAZA - Projection quatre directions depuis frappe verticale",
                 "key_points": ["Intercepter", "Lever et passer sous", "Couper"],
                 "practice_tips": ["Timing d'interception"]},
                {"name": "Jodan Tsuki - Shiho Nage", 
                 "description": "TACHIWAZA - Projection quatre directions depuis coup de poing haut",
                 "key_points": ["Esquiver", "Saisir le bras", "Lever et couper"],
                 "practice_tips": ["Esquive latérale"]},
                {"name": "Mae Geri - Irimi Nage", 
                 "description": "TACHIWAZA - Projection en entrant depuis coup de pied frontal",
                 "key_points": ["Esquiver le coup de pied", "Entrer sur le côté", "Le genou de la jambe arrière est levé puis le coup part en dépliant"],
                 "practice_tips": ["Timing crucial", "Ne pas rester devant"]},
                # ─── USHIRO WAZA ───
                {"name": "Ushiro Ryote Dori - Kokyu Nage", 
                 "description": "USHIRO WAZA - Projection par respiration depuis saisie arrière des deux poignets",
                 "key_points": ["Utiliser le kokyu", "Projeter sans force"],
                 "practice_tips": ["Respiration coordonnée"]},
                {"name": "Ushiro Ryote Dori - Koshi Nage", 
                 "description": "USHIRO WAZA - Projection de hanche depuis saisie arrière des deux poignets",
                 "key_points": ["Pivoter", "Charger sur la hanche"],
                 "practice_tips": ["Pivotement rapide"]},
                {"name": "Ushiro Ryote Dori - Jiyu Waza", 
                 "description": "USHIRO WAZA - Technique libre depuis saisie arrière des deux poignets",
                 "key_points": ["Choisir librement la technique", "Adaptation"],
                 "practice_tips": ["Varier les réponses", "Spontanéité"]},
                {"name": "Ushiro Ryo Kata Dori - Sankyo", 
                 "description": "USHIRO WAZA - Troisième immobilisation depuis saisie arrière des deux épaules",
                 "key_points": ["Se dégager", "Spirale du poignet"],
                 "practice_tips": ["Réaction rapide"]},
                {"name": "Ushiro Ryo Kata Dori - Kote Gaeshi", 
                 "description": "USHIRO WAZA - Retournement du poignet depuis saisie arrière des deux épaules",
                 "key_points": ["Pivoter", "Saisir la main", "Rotation"],
                 "practice_tips": ["Pivotement fluide"]},
                {"name": "Ushiro Ryo Kata Dori - Kokyu Nage", 
                 "description": "USHIRO WAZA - Projection par respiration depuis saisie arrière des deux épaules",
                 "key_points": ["Utiliser le kokyu", "Se libérer et projeter"],
                 "practice_tips": ["Légèreté"]},
                {"name": "Eri Dori - Ikkyo", 
                 "description": "USHIRO WAZA - Première immobilisation depuis saisie arrière du col",
                 "key_points": ["Se dégager du col", "Tori ne sait pas avec quelle main il est saisi", "Contrôler le bras"],
                 "practice_tips": ["Protéger le cou"]},
                {"name": "Eri Dori - Kote Gaeshi", 
                 "description": "USHIRO WAZA - Retournement du poignet depuis saisie arrière du col",
                 "key_points": ["Pivoter", "Saisir la main"],
                 "practice_tips": ["Se libérer d'abord"]},
                {"name": "Eri Dori - Kokyu Nage", 
                 "description": "USHIRO WAZA - Projection par respiration depuis saisie arrière du col",
                 "key_points": ["Kokyu", "Se libérer et projeter"],
                 "practice_tips": ["Légèreté"]},
                {"name": "Katate Dori Kubishime - Shiho Nage", 
                 "description": "USHIRO WAZA - Projection quatre directions depuis saisie poignet + étranglement",
                 "key_points": ["Protéger la gorge", "Se libérer", "Lever et couper"],
                 "practice_tips": ["Priorité à l'étranglement"]},
                {"name": "Katate Dori Kubishime - Kote Gaeshi", 
                 "description": "USHIRO WAZA - Retournement du poignet depuis saisie poignet + étranglement",
                 "key_points": ["Se dégager de l'étranglement", "Saisir la main"],
                 "practice_tips": ["Sécurité d'abord"]},
                {"name": "Katate Dori Kubishime - Kokyu Nage", 
                 "description": "USHIRO WAZA - Projection par respiration depuis saisie poignet + étranglement",
                 "key_points": ["Protéger la gorge", "Kokyu"],
                 "practice_tips": ["Ne pas paniquer"]}
            ]
        },
        # ═══════════════════════════════════════════════════════════════
        # ⬛ SHODAN - Premier Dan
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "SHODAN (1er Dan)",
            "order": 0,
            "color": "#1c1917",  # Noir
            "techniques": [
                {"name": "Notions fondamentales à maîtriser", 
                 "description": "SHO est le début, ce qui commence. Le corps commence enfin à répondre aux commandements.",
                 "key_points": ["SHISEI (posture)", "KAMAE (garde)", "KIRYOKU (puissance vitale)", "SEISHIN JOTAI (état mental)", "METSUKE (regard physique et mental)"],
                 "practice_tips": ["Pratiquer lentement si nécessaire", "S'attacher à la précision et à l'exactitude"]},
                {"name": "Qualités à développer", 
                 "description": "Notions permettant d'apprécier le niveau de Shodan après trois années minimum d'étude.",
                 "key_points": ["MA AI (espace-temps)", "ARUKIKATA (marche)", "TAI SABAKI (déplacement/placement)", "KOKYU (respiration)", "KOKYU RYOKU (coordination puissance physique et rythme respiratoire)"],
                 "practice_tips": ["SOKUDO (rapidité)", "KO RYOKU (efficacité)", "REIGISAHO (étiquette)"]},
                {"name": "Construction des techniques", 
                 "description": "Le candidat doit disposer des outils constitutifs de la pratique de l'aïkido.",
                 "key_points": ["Phase initiale de placement", "Phase dynamique de création et conduite du déséquilibre", "Phase terminale (projection/immobilisation)", "Continuité du mouvement"],
                 "practice_tips": ["Les trois phases ne doivent pas nuire à la continuité"]},
                {"name": "Principe d'intégrité", 
                 "description": "La technique d'aïkido doit préserver et renforcer l'intégrité physique et mentale des deux protagonistes.",
                 "key_points": ["Unité du corps, centrage, engagement dans l'action", "Attitude juste, maîtrise du potentiel physique", "Disponibilité, mobilité, capacité de réaction", "Attention et concentration suffisantes"],
                 "practice_tips": ["Vigilance tout au long de la situation"]},
                {"name": "Suwariwaza - Pratique à genoux", 
                 "description": "Maîtrise complète des techniques à genoux.",
                 "key_points": ["Toutes les techniques à genoux", "Shikko fluide", "Hanches stables"],
                 "practice_tips": ["Pratiquer régulièrement à genoux"]},
                {"name": "Tachiwaza sur saisies et frappes", 
                 "description": "Pratique debout sur toutes les formes d'attaque.",
                 "key_points": ["Saisies: katate dori, ryote dori, kata dori, muna dori", "Frappes: shomen uchi, yokomen uchi, tsuki"],
                 "practice_tips": ["Varier les attaques", "Adapter les réponses"]},
                {"name": "Hanmi Handachi Waza", 
                 "description": "Pratique attaquant debout, défenseur à genoux.",
                 "key_points": ["Compenser la différence de hauteur", "Mobilité à genoux"],
                 "practice_tips": ["Shikko maîtrisé"]},
                {"name": "Ushiro Waza", 
                 "description": "Attaques arrière - toutes les formes.",
                 "key_points": ["Réaction immédiate", "Pivotement efficace"],
                 "practice_tips": ["Sentir l'attaque venir"]},
                {"name": "Randori - 2 adversaires", 
                 "description": "Pratique libre contre deux attaquants.",
                 "key_points": ["Gestion de l'espace", "Positionnement", "Fluidité"],
                 "practice_tips": ["Ne jamais rester entre les deux", "Mouvement constant"]},
                {"name": "Tanto Dori", 
                 "description": "Pratique contre couteau (tanto).",
                 "key_points": ["Gokyo", "Sécurité maximale", "Désarmement"],
                 "practice_tips": ["Vigilance", "Ne jamais saisir la lame"]},
                {"name": "Jo Dori / Jo Nage Waza", 
                 "description": "Pratique contre bâton (jo) et projections avec bâton.",
                 "key_points": ["Désarmement du jo", "Projections avec le jo"],
                 "practice_tips": ["Distance (ma-ai)", "Contrôle de l'arme"]}
            ]
        },
        # ═══════════════════════════════════════════════════════════════
        # ⬛ NIDAN - Deuxième Dan
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "NIDAN (2e Dan)",
            "order": -1,
            "color": "#1c1917",  # Noir
            "techniques": [
                {"name": "Sens et niveau", 
                 "description": "Au travail du 1er Dan on ajoute rapidité et puissance avec une plus grande détermination mentale.",
                 "key_points": ["Clarté de la mise en forme", "Orientation du travail", "Sensation de progression"],
                 "practice_tips": ["Le jury doit ressentir ce progrès"]},
                {"name": "Maîtrise des outils du 1er Dan", 
                 "description": "Compétence avérée et non plus simplement connaissance et compréhension.",
                 "key_points": ["Fluidité dans la construction", "Contrôle parfait de la distance", "Capacité d'anticipation"],
                 "practice_tips": ["Plus d'exigence sur les critères du Shodan"]},
                {"name": "Engagement physique important", 
                 "description": "Niveau d'engagement supérieur adapté à l'âge du candidat.",
                 "key_points": ["Engagement sans excès", "Caractère technique préservé"],
                 "practice_tips": ["Équilibre force/technique"]},
                {"name": "Suwariwaza avancé", 
                 "description": "Pratique à genoux avec fluidité accrue.",
                 "key_points": ["Enchaînements fluides", "Transitions rapides"],
                 "practice_tips": ["Perfection du shikko"]},
                {"name": "Tachiwaza - saisies et frappes", 
                 "description": "Maîtrise complète debout.",
                 "key_points": ["Toutes les saisies", "Toutes les frappes"],
                 "practice_tips": ["Fluidité et puissance"]},
                {"name": "Hanmi Handachi Waza avancé", 
                 "description": "Pratique à genoux contre debout avec aisance.",
                 "key_points": ["Compensation parfaite de la hauteur"],
                 "practice_tips": ["Mobilité maximale"]},
                {"name": "Ushiro Waza complet", 
                 "description": "Toutes les attaques arrière.",
                 "key_points": ["Réactions instinctives"],
                 "practice_tips": ["Anticipation"]},
                {"name": "Randori - 2 adversaires", 
                 "description": "Pratique libre avec engagement.",
                 "key_points": ["Gestion efficace", "Pas de temps mort"],
                 "practice_tips": ["Contrôle de l'espace"]},
                {"name": "Tanto Dori avancé", 
                 "description": "Désarmement avec assurance.",
                 "key_points": ["Techniques variées contre couteau"],
                 "practice_tips": ["Sécurité et efficacité"]},
                {"name": "Jo Dori / Jo Nage Waza avancé", 
                 "description": "Pratique complète avec le bâton.",
                 "key_points": ["Désarmement fluide", "Projections avec bâton"],
                 "practice_tips": ["Intégration naturelle de l'arme"]}
            ]
        },
        # ═══════════════════════════════════════════════════════════════
        # ⬛ SANDAN - Troisième Dan
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "SANDAN (3e Dan)",
            "order": -2,
            "color": "#1c1917",  # Noir
            "techniques": [
                {"name": "Sens et niveau", 
                 "description": "Début de la compréhension du KOKYU RYOKU. Entrée dans la dimension spirituelle de l'Aïkido.",
                 "key_points": ["Coordination puissance physique et rythme respiratoire", "Finesse et précision", "Efficacité technique manifeste"],
                 "practice_tips": ["Il devient possible de transmettre ces qualités"]},
                {"name": "Capacités requises", 
                 "description": "Maîtrise complète des techniques et capacité à les adapter à toutes les situations.",
                 "key_points": ["Complet contrôle de soi et de ses actes", "Capacité à faire des variations si nécessaires", "Disponibilité à tous moments"],
                 "practice_tips": ["Émergence d'une liberté dans l'application"]},
                {"name": "Maîtrise d'Irimi", 
                 "description": "Grande maîtrise du principe d'entrée.",
                 "key_points": ["Irimi profond et juste", "Entrée dans l'angle mort"],
                 "practice_tips": ["Irimi et sabaki sont les deux piliers de l'aïkido"]},
                {"name": "Ma-ai", 
                 "description": "Juste appréciation de la distance et du timing.",
                 "key_points": ["Contrôle parfait de la distance", "Interventions aux bons moments"],
                 "practice_tips": ["Espace-temps maîtrisé"]},
                {"name": "Rythme du mouvement", 
                 "description": "Capacité d'imposer et maintenir un rythme.",
                 "key_points": ["Rythme à l'intérieur du mouvement", "Contrôle du tempo"],
                 "practice_tips": ["Fluidité et puissance"]},
                {"name": "Suwariwaza - maîtrise", 
                 "description": "Pratique à genoux avec liberté.",
                 "key_points": ["Techniques variées", "Adaptations"],
                 "practice_tips": ["Expression personnelle"]},
                {"name": "Tachiwaza - maîtrise", 
                 "description": "Techniques debout avec variations.",
                 "key_points": ["Saisies et frappes", "Henka waza"],
                 "practice_tips": ["Liberté d'expression"]},
                {"name": "Randori - 3 adversaires", 
                 "description": "Pratique libre avec trois attaquants.",
                 "key_points": ["Gestion de l'espace", "Fluidité"],
                 "practice_tips": ["Calme et contrôle"]},
                {"name": "Tachi Dori", 
                 "description": "Pratique avec bokken (sabre de bois) pour les deux partenaires.",
                 "key_points": ["Techniques de sabre", "Désarmement"],
                 "practice_tips": ["Ma-ai du sabre"]},
                {"name": "Kumitachi", 
                 "description": "Exercices avec bokken (sabre de bois).",
                 "key_points": ["Travail en partenaire", "Formes codifiées"],
                 "practice_tips": ["Précision et timing"]},
                {"name": "Kumijo", 
                 "description": "Exercices avec jo (bâton).",
                 "key_points": ["Formes au jo", "Applications"],
                 "practice_tips": ["Intégration corps-arme"]}
            ]
        },
        # ═══════════════════════════════════════════════════════════════
        # ⬛ YONDAN - Quatrième Dan
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "YONDAN (4e Dan)",
            "order": -3,
            "color": "#1c1917",  # Noir
            "techniques": [
                {"name": "Sens et niveau", 
                 "description": "Niveau techniquement avancé. On commence à entrevoir les principes qui régissent les techniques.",
                 "key_points": ["Dominer à tout moment la situation", "Adéquation du travail au partenaire", "Sérénité du candidat"],
                 "practice_tips": ["Il devient possible de conduire plus précisément les pratiquants sur la voie du fondateur"]},
                {"name": "Capacités requises", 
                 "description": "Maîtrise complète des techniques de base et de leurs variantes.",
                 "key_points": ["Qualité de perception", "Degré d'intégration", "Liberté de maniement des principes"],
                 "practice_tips": ["Expression de la compréhension profonde"]},
                {"name": "Techniques demandées", 
                 "description": "L'interrogation équilibre différentes formes.",
                 "key_points": ["Forme d'attaque et technique requise", "Jyu-Waza (pratique libre souple)", "Henka-Waza (différentes formes et enchaînements)"],
                 "practice_tips": ["Adaptabilité totale"]},
                {"name": "Suwariwaza", 
                 "description": "Pratique à genoux avec liberté totale.",
                 "key_points": ["Expression libre"],
                 "practice_tips": ["Au-delà de la forme"]},
                {"name": "Tachiwaza", 
                 "description": "Pratique debout sur saisies et frappes.",
                 "key_points": ["Toutes les attaques"],
                 "practice_tips": ["Réponses appropriées"]},
                {"name": "Hanmi Handachi Waza", 
                 "description": "Pratique à genoux contre debout.",
                 "key_points": ["Maîtrise complète"],
                 "practice_tips": ["Aisance naturelle"]},
                {"name": "Ushiro Waza", 
                 "description": "Attaques arrière.",
                 "key_points": ["Toutes les formes"],
                 "practice_tips": ["Réactions fluides"]},
                {"name": "Randori - 3 adversaires", 
                 "description": "Pratique libre contre trois.",
                 "key_points": ["Sérénité", "Contrôle total"],
                 "practice_tips": ["Domination de la situation"]},
                {"name": "Futari Dori", 
                 "description": "Saisie par deux adversaires simultanément.",
                 "key_points": ["Gestion des deux saisies"],
                 "practice_tips": ["Coordination"]},
                {"name": "Tanto Dori complet", 
                 "description": "Pratique contre couteau - toutes les techniques.",
                 "key_points": ["Désarmement varié"],
                 "practice_tips": ["Sécurité absolue"]},
                {"name": "Jo Dori / Jo Nage Waza complet", 
                 "description": "Pratique avec bâton - maîtrise totale.",
                 "key_points": ["Intégration complète"],
                 "practice_tips": ["Naturel"]},
                {"name": "Tachi Dori / Kumitachi complet", 
                 "description": "Pratique au sabre - maîtrise totale.",
                 "key_points": ["Techniques variées"],
                 "practice_tips": ["Expression libre"]},
                {"name": "Kumijo avancé", 
                 "description": "Exercices au bâton - niveau avancé.",
                 "key_points": ["Formes et variations"],
                 "practice_tips": ["Liberté dans la forme"]}
            ]
        }
    ]
    
    for kyu_data in initial_data:
        techniques = []
        for tech_data in kyu_data['techniques']:
            technique = Technique(**tech_data)
            tech_doc = technique.model_dump()
            serialize_doc(tech_doc)
            techniques.append(tech_doc)
        
        kyu_level = KyuLevel(
            name=kyu_data['name'],
            order=kyu_data['order'],
            color=kyu_data.get('color', '#6366f1'),
            image_url=kyu_data.get('image_url'),
            techniques=[]
        )
        doc = kyu_level.model_dump()
        doc['techniques'] = techniques
        serialize_doc(doc)
        await db.kyu_levels.insert_one(doc)
    
    return {"message": "Data seeded successfully", "count": len(initial_data)}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
