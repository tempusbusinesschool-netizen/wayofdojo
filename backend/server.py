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


# Seed initial data
@api_router.post("/seed")
async def seed_data():
    """Seed initial Aikido techniques data"""
    # Check if data already exists
    existing = await db.kyu_levels.count_documents({})
    if existing > 0:
        return {"message": "Data already seeded", "count": existing}
    
    # Programme officiel FFAAA - Check-list de préparation aux grades Aïkido
    # Basé sur la nomenclature UFA/FAA et le référentiel de travail FFAAA
    # GIFs réalistes libres de droits depuis Tenor et autres sources
    
    # URLs des GIFs réalistes par catégorie de technique
    # Sources: Tenor - URLs testées et validées (HTTP 200)
    GIF_URLS = {
        # Techniques de base / déplacements
        "base": "https://media.tenor.com/P22Z3iyIhQAAAAAM/aikido-master.gif",
        "deplacement": "https://media.tenor.com/P22Z3iyIhQAAAAAM/aikido-master.gif",
        # Immobilisations (ikkyo, nikyo, sankyo, yonkyo, gokyo)
        "ikkyo": "https://media.tenor.com/jE00NSdUJmAAAAAM/aikido.gif",
        "nikyo": "https://media.tenor.com/jE00NSdUJmAAAAAM/aikido.gif",
        "sankyo": "https://media.tenor.com/jE00NSdUJmAAAAAM/aikido.gif",
        "yonkyo": "https://media.tenor.com/jE00NSdUJmAAAAAM/aikido.gif",
        "gokyo": "https://media.tenor.com/jE00NSdUJmAAAAAM/aikido.gif",
        # Projections
        "shiho_nage": "https://media.tenor.com/ura8QoKWyw8AAAAM/hiromi-matsuoka.gif",
        "irimi_nage": "https://media.tenor.com/ura8QoKWyw8AAAAM/hiromi-matsuoka.gif",
        "kote_gaeshi": "https://media.tenor.com/ura8QoKWyw8AAAAM/hiromi-matsuoka.gif",
        "kaiten_nage": "https://media.tenor.com/ura8QoKWyw8AAAAM/hiromi-matsuoka.gif",
        "tenchi_nage": "https://media.tenor.com/ura8QoKWyw8AAAAM/hiromi-matsuoka.gif",
        "koshi_nage": "https://media.tenor.com/ura8QoKWyw8AAAAM/hiromi-matsuoka.gif",
        "kokyu_nage": "https://media.tenor.com/P22Z3iyIhQAAAAAM/aikido-master.gif",
        "sumi_otoshi": "https://media.tenor.com/ura8QoKWyw8AAAAM/hiromi-matsuoka.gif",
        # Ukemi (chutes)
        "ukemi": "https://media.tenor.com/l9bqdh9K0h0AAAAM/aikido-meme.gif",
        # Suwariwaza (techniques à genoux)
        "suwari": "https://media.tenor.com/jE00NSdUJmAAAAAM/aikido.gif",
        # Ushirowaza (attaques par l'arrière)
        "ushiro": "https://media.tenor.com/P22Z3iyIhQAAAAAM/aikido-master.gif",
        # Bukiwaza (armes)
        "bokken": "https://media.tenor.com/k8Ok5wExDmEAAAAM/aikido.gif",
        "jo": "https://media.tenor.com/k8Ok5wExDmEAAAAM/aikido.gif",
        "tanto": "https://media.tenor.com/k8Ok5wExDmEAAAAM/aikido.gif",
        # Randori / Jiyu waza
        "randori": "https://media.tenor.com/P22Z3iyIhQAAAAAM/aikido-master.gif",
        # Hanmi handachi
        "hanmi_handachi": "https://media.tenor.com/jE00NSdUJmAAAAAM/aikido.gif",
        # Générique aikido
        "generic": "https://media.tenor.com/P22Z3iyIhQAAAAAM/aikido-master.gif"
    }
    
    initial_data = [
        # ═══════════════════════════════════════════════════════════════
        # 🔰 5e KYU - Minimum 2 mois de pratique ou 20 heures
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "5e Kyu",
            "order": 5,
            "color": "#fbbf24",  # Jaune
            "techniques": [
                # SUWARIWAZA
                {"name": "Suwariwaza Aihanmi Katate Dori Ikkyo", "description": "SUWARIWAZA - Première immobilisation depuis saisie main opposée, à genoux", 
                 "key_points": ["Position seiza stable", "Contrôle du coude d'uke", "Déplacement en shikko", "Immobilisation au sol avec pression sur l'épaule"],
                 "practice_tips": ["Pratiquer le shikko régulièrement", "Garder les hanches basses", "Ne pas se relever pendant la technique"]},
                {"name": "Suwariwaza Aihanmi Katate Dori Irimi Nage", "description": "SUWARIWAZA - Projection en entrant depuis saisie main opposée, à genoux",
                 "key_points": ["Entrer profondément derrière uke", "Contrôler la tête d'uke", "Extension vers l'avant pour projeter"],
                 "practice_tips": ["Travailler l'entrée (irimi) à genoux", "Garder le centre stable"]},
                {"name": "Suwariwaza Shomen Uchi Ikkyo", "description": "SUWARIWAZA - Première immobilisation depuis frappe verticale, à genoux",
                 "key_points": ["Intercepter la frappe au moment opportun", "Guider le bras vers le bas", "Contrôle du coude"],
                 "practice_tips": ["Timing essentiel", "Pratiquer lentement d'abord"]},
                {"name": "Suwariwaza Shomen Uchi Irimi Nage", "description": "SUWARIWAZA - Projection en entrant depuis frappe verticale, à genoux",
                 "key_points": ["Esquiver et entrer", "Se placer derrière uke", "Projeter vers l'arrière"],
                 "practice_tips": ["Ne pas bloquer la frappe", "Accompagner le mouvement"]},
                {"name": "Suwariwaza Ryote Dori Kokyu Ho", "description": "SUWARIWAZA - Exercice de respiration depuis saisie des deux poignets, à genoux",
                 "key_points": ["Uke saisit les deux poignets", "Lever les bras en utilisant le centre (hara)", "Projeter uke vers l'arrière"],
                 "practice_tips": ["Ne pas utiliser la force des bras", "Respiration coordonnée", "Exercice fondamental à pratiquer à chaque séance"]},
                # TACHIWAZA
                {"name": "Tachiwaza Aihanmi Katate Dori Ikkyo", "description": "TACHIWAZA - Première immobilisation depuis saisie main opposée, debout",
                 "key_points": ["Contrôler le coude avec la main extérieure", "Guider le bras vers le bas et l'avant", "Avancer en irimi", "Immobiliser au sol"],
                 "practice_tips": ["Ne pas forcer avec les bras", "Utiliser le poids du corps", "Garder uke déséquilibré"]},
                {"name": "Tachiwaza Aihanmi Katate Dori Shiho Nage", "description": "TACHIWAZA - Projection dans les quatre directions depuis saisie main opposée",
                 "key_points": ["Lever le bras d'uke comme un sabre", "Passer sous le bras en pivotant", "Couper vers le bas"],
                 "practice_tips": ["Mouvement circulaire et continu", "Ne pas tordre le poignet excessivement"]},
                {"name": "Tachiwaza Aihanmi Katate Dori Irimi Nage", "description": "TACHIWAZA - Projection en entrant depuis saisie main opposée, debout",
                 "key_points": ["Entrer profondément (irimi)", "Contrôler la tête/nuque d'uke", "Étendre vers l'avant et le bas"],
                 "practice_tips": ["L'entrée est la clé", "Ne pas pousser mais étendre"]},
                {"name": "Tachiwaza Gyakuhanmi Katate Dori Tenchi Nage", "description": "TACHIWAZA - Projection ciel-terre depuis saisie croisée",
                 "key_points": ["Un bras monte vers le ciel", "Un bras descend vers la terre", "Déséquilibrer uke entre les deux directions"],
                 "practice_tips": ["Les deux bras travaillent en opposition", "Avancer au centre d'uke"]},
                {"name": "Tachiwaza Shomen Uchi Ikkyo", "description": "TACHIWAZA - Première immobilisation depuis frappe verticale, debout",
                 "key_points": ["Entrer au moment où uke lève le bras", "Bloquer/guider au niveau du coude", "Couper vers le bas"],
                 "practice_tips": ["Timing crucial", "Sensation de couper avec tout le corps"]},
                {"name": "Tachiwaza Shomen Uchi Irimi Nage", "description": "TACHIWAZA - Projection en entrant depuis frappe verticale, debout",
                 "key_points": ["Esquiver la frappe en entrant", "Se placer derrière uke", "Projeter"],
                 "practice_tips": ["Ne pas bloquer mais accompagner", "Fluidité du mouvement"]}
            ]
        },
        # ═══════════════════════════════════════════════════════════════
        # 🟠 4e KYU - Minimum 3 mois après le 5e Kyu ou 60 heures
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "4e Kyu",
            "order": 4,
            "color": "#f97316",  # Orange
            "techniques": [
                # SUWARIWAZA
                {"name": "Suwariwaza Aihanmi Katate Dori Nikyo", "description": "SUWARIWAZA - Deuxième immobilisation (contrôle poignet) depuis saisie main opposée",
                 "key_points": ["Saisir le poignet d'uke avec les deux mains", "Rotation externe du poignet", "Coude plié à 90°"],
                 "practice_tips": ["Contrôle précis, pas de force excessive", "Uke signale si trop douloureux"]},
                {"name": "Suwariwaza Aihanmi Katate Dori Sankyo", "description": "SUWARIWAZA - Troisième immobilisation (torsion poignet) depuis saisie main opposée",
                 "key_points": ["Contrôle en spirale du poignet", "Rotation vers l'extérieur", "Amener uke au sol"],
                 "practice_tips": ["Mouvement en spirale", "Contrôle progressif"]},
                {"name": "Suwariwaza Aihanmi Katate Dori Yonkyo", "description": "SUWARIWAZA - Quatrième immobilisation (pression point nerveux) depuis saisie main opposée",
                 "key_points": ["Pression sur le point nerveux de l'avant-bras", "Même trajectoire qu'ikkyo", "Contrôle précis"],
                 "practice_tips": ["Trouver le bon point de pression", "Ne pas écraser mais presser"]},
                {"name": "Suwariwaza Kata Dori Ikkyo", "description": "SUWARIWAZA - Première immobilisation depuis saisie de l'épaule",
                 "key_points": ["Contrôler le bras qui saisit", "Guider vers le bas", "Immobilisation classique"],
                 "practice_tips": ["Réagir dès la saisie", "Ne pas laisser uke s'installer"]},
                {"name": "Suwariwaza Kata Dori Nikyo", "description": "SUWARIWAZA - Deuxième immobilisation depuis saisie de l'épaule",
                 "key_points": ["Transition vers nikyo", "Contrôle du poignet", "Rotation externe"],
                 "practice_tips": ["Fluidité de la transition", "Garder le contrôle"]},
                {"name": "Suwariwaza Shomen Uchi Nikyo", "description": "SUWARIWAZA - Deuxième immobilisation depuis frappe verticale, à genoux",
                 "key_points": ["Intercepter la frappe", "Transition vers saisie nikyo", "Contrôle du poignet"],
                 "practice_tips": ["Timing de l'interception", "Transition fluide"]},
                {"name": "Suwariwaza Shomen Uchi Kote Gaeshi", "description": "SUWARIWAZA - Retournement du poignet depuis frappe verticale, à genoux",
                 "key_points": ["Saisir la main d'uke", "Rotation externe du poignet", "Projeter vers le bas"],
                 "practice_tips": ["Saisie de la main, pas du poignet", "Uke doit chuter pour se protéger"]},
                # TACHIWAZA
                {"name": "Tachiwaza Aihanmi Katate Dori Nikyo", "description": "TACHIWAZA - Deuxième immobilisation depuis saisie main opposée, debout",
                 "key_points": ["Contrôle du poignet en rotation", "Coude plié", "Pression précise"],
                 "practice_tips": ["Précision du contrôle", "Communication avec uke"]},
                {"name": "Tachiwaza Aihanmi Katate Dori Sankyo", "description": "TACHIWAZA - Troisième immobilisation depuis saisie main opposée, debout",
                 "key_points": ["Spirale du poignet vers l'extérieur", "Contrôle progressif", "Amener au sol"],
                 "practice_tips": ["Mouvement continu", "Garder uke déséquilibré"]},
                {"name": "Tachiwaza Aihanmi Katate Dori Yonkyo", "description": "TACHIWAZA - Quatrième immobilisation depuis saisie main opposée, debout",
                 "key_points": ["Point de pression sur l'avant-bras", "Trajectoire d'ikkyo", "Précision"],
                 "practice_tips": ["Localiser le point nerveux", "Pression progressive"]},
                {"name": "Tachiwaza Aihanmi Katate Dori Udekime Nage", "description": "TACHIWAZA - Projection par contrôle du coude depuis saisie main opposée",
                 "key_points": ["Contrôle du coude d'uke", "Extension du bras", "Projection"],
                 "practice_tips": ["Ne pas forcer l'articulation", "Mouvement fluide"]},
                {"name": "Tachiwaza Aihanmi Katate Dori Kote Gaeshi", "description": "TACHIWAZA - Retournement du poignet depuis saisie main opposée",
                 "key_points": ["Saisir la main", "Rotation externe", "Projeter"],
                 "practice_tips": ["Contrôle de la main, pas du bras", "Uke apprend à chuter"]},
                {"name": "Tachiwaza Aihanmi Katate Dori Koshi Nage", "description": "TACHIWAZA - Projection de hanche depuis saisie main opposée",
                 "key_points": ["Entrer sous le centre d'uke", "Charger sur la hanche", "Projeter par rotation"],
                 "practice_tips": ["Placement des hanches crucial", "Uke doit maîtriser les chutes"]},
                {"name": "Tachiwaza Gyakuhanmi Katate Dori Ikkyo", "description": "TACHIWAZA - Première immobilisation depuis saisie croisée",
                 "key_points": ["Contrôle du coude", "Guider vers le bas", "Immobilisation au sol"],
                 "practice_tips": ["Adapter à la saisie croisée", "Même principe qu'aihanmi"]},
                {"name": "Tachiwaza Gyakuhanmi Katate Dori Nikyo", "description": "TACHIWAZA - Deuxième immobilisation depuis saisie croisée",
                 "key_points": ["Contrôle du poignet", "Rotation externe", "Précision"],
                 "practice_tips": ["Transition fluide", "Contrôle progressif"]},
                {"name": "Tachiwaza Gyakuhanmi Katate Dori Shiho Nage", "description": "TACHIWAZA - Projection quatre directions depuis saisie croisée",
                 "key_points": ["Lever le bras comme un sabre", "Passer sous le bras", "Couper vers le bas"],
                 "practice_tips": ["Mouvement circulaire", "Ne pas tordre excessivement"]},
                {"name": "Tachiwaza Gyakuhanmi Katate Dori Udekime Nage", "description": "TACHIWAZA - Projection par contrôle du coude depuis saisie croisée",
                 "key_points": ["Extension du bras d'uke", "Contrôle de l'articulation", "Projection"],
                 "practice_tips": ["Respect de l'articulation", "Fluidité"]},
                {"name": "Tachiwaza Gyakuhanmi Katate Dori Kote Gaeshi", "description": "TACHIWAZA - Retournement du poignet depuis saisie croisée",
                 "key_points": ["Saisie de la main", "Rotation externe", "Projection"],
                 "practice_tips": ["Précision de la saisie", "Timing"]},
                {"name": "Tachiwaza Gyakuhanmi Katate Dori Irimi Nage", "description": "TACHIWAZA - Projection en entrant depuis saisie croisée",
                 "key_points": ["Entrer profondément", "Contrôle de la tête", "Extension"],
                 "practice_tips": ["L'entrée est essentielle", "Fluidité"]},
                {"name": "Tachiwaza Gyakuhanmi Katate Dori Uchi Kaiten Nage", "description": "TACHIWAZA - Projection rotative intérieure depuis saisie croisée",
                 "key_points": ["Rotation intérieure", "Guider uke vers l'avant", "Projection rotative"],
                 "practice_tips": ["Accompagner la rotation", "Ne pas bloquer"]},
                {"name": "Tachiwaza Gyakuhanmi Katate Dori Soto Kaiten Nage", "description": "TACHIWAZA - Projection rotative extérieure depuis saisie croisée",
                 "key_points": ["Rotation extérieure", "Guider uke", "Projection"],
                 "practice_tips": ["Différencier uchi et soto kaiten", "Fluidité du mouvement"]},
                {"name": "Tachiwaza Kata Dori Ikkyo", "description": "TACHIWAZA - Première immobilisation depuis saisie de l'épaule",
                 "key_points": ["Réagir à la saisie", "Contrôle du bras", "Immobilisation"],
                 "practice_tips": ["Ne pas laisser uke s'installer", "Réaction immédiate"]},
                {"name": "Tachiwaza Kata Dori Nikyo", "description": "TACHIWAZA - Deuxième immobilisation depuis saisie de l'épaule",
                 "key_points": ["Transition vers nikyo", "Contrôle du poignet", "Rotation"],
                 "practice_tips": ["Fluidité", "Précision du contrôle"]},
                {"name": "Tachiwaza Shomen Uchi Nikyo", "description": "TACHIWAZA - Deuxième immobilisation depuis frappe verticale",
                 "key_points": ["Intercepter la frappe", "Transition vers nikyo", "Contrôle"],
                 "practice_tips": ["Timing", "Transition fluide"]},
                {"name": "Tachiwaza Shomen Uchi Sankyo", "description": "TACHIWAZA - Troisième immobilisation depuis frappe verticale",
                 "key_points": ["Interception", "Spirale du poignet", "Contrôle au sol"],
                 "practice_tips": ["Mouvement en spirale", "Continuité"]},
                {"name": "Tachiwaza Shomen Uchi Yonkyo", "description": "TACHIWAZA - Quatrième immobilisation depuis frappe verticale",
                 "key_points": ["Point de pression", "Trajectoire d'ikkyo", "Précision"],
                 "practice_tips": ["Localiser le point nerveux", "Pression juste"]},
                {"name": "Tachiwaza Shomen Uchi Kote Gaeshi", "description": "TACHIWAZA - Retournement du poignet depuis frappe verticale",
                 "key_points": ["Saisir la main", "Rotation externe", "Projection"],
                 "practice_tips": ["Timing de la saisie", "Accompagner la chute"]},
                {"name": "Tachiwaza Yokomen Uchi Shiho Nage", "description": "TACHIWAZA - Projection quatre directions depuis frappe latérale",
                 "key_points": ["Intercepter la frappe diagonale", "Lever et passer sous le bras", "Couper"],
                 "practice_tips": ["Adapter à la trajectoire de la frappe", "Fluidité"]},
                {"name": "Tachiwaza Yokomen Uchi Udekime Nage", "description": "TACHIWAZA - Projection par contrôle du coude depuis frappe latérale",
                 "key_points": ["Contrôle du coude", "Extension", "Projection"],
                 "practice_tips": ["Intercepter correctement", "Contrôle de l'articulation"]},
                {"name": "Tachiwaza Yokomen Uchi Kokyu Nage", "description": "TACHIWAZA - Projection par la respiration depuis frappe latérale",
                 "key_points": ["Utiliser le kokyu (respiration)", "Accompagner et projeter", "Pas de force"],
                 "practice_tips": ["Respiration coordonnée", "Légèreté du mouvement"]},
                # USHIRO WAZA
                {"name": "Ushiro Waza Katate Dori Kubishime Ikkyo", "description": "USHIRO WAZA - Première immobilisation depuis saisie poignet + étranglement arrière",
                 "key_points": ["Se dégager de l'étranglement", "Contrôler le bras", "Immobiliser"],
                 "practice_tips": ["Réagir immédiatement", "Protéger sa gorge"]},
                {"name": "Ushiro Waza Katate Dori Kubishime Irimi Nage", "description": "USHIRO WAZA - Projection en entrant depuis saisie poignet + étranglement",
                 "key_points": ["Se libérer", "Entrer et contrôler", "Projeter"],
                 "practice_tips": ["Réaction rapide", "Ne pas paniquer"]}
            ]
        },
        # ═══════════════════════════════════════════════════════════════
        # 🟢 3e KYU - Minimum 6 mois après le 4e Kyu ou 120 heures
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "3e Kyu",
            "order": 3,
            "color": "#22c55e",  # Vert
            "techniques": [
                # HANMI HANDACHI WAZA
                {"name": "Hanmi Handachi Gyakuhanmi Katate Dori Ikkyo", "description": "HANMI HANDACHI - Première immobilisation, tori à genoux, uke debout",
                 "key_points": ["Tori reste à genoux", "Contrôle du coude d'uke debout", "Utiliser les hanches"],
                 "practice_tips": ["Compenser la différence de hauteur", "Travail des hanches intense"]},
                {"name": "Hanmi Handachi Gyakuhanmi Katate Dori Shiho Nage", "description": "HANMI HANDACHI - Projection quatre directions, tori à genoux",
                 "key_points": ["Lever le bras d'uke", "Passer sous le bras depuis les genoux", "Couper vers le bas"],
                 "practice_tips": ["Mobilité à genoux essentielle", "Shikko maîtrisé"]},
                # TACHIWAZA
                {"name": "Tachiwaza Ryote Dori Tenchi Nage", "description": "TACHIWAZA - Projection ciel-terre depuis saisie des deux poignets",
                 "key_points": ["Un bras monte (ciel)", "Un bras descend (terre)", "Avancer au centre"],
                 "practice_tips": ["Opposition des deux bras", "Entrer dans le centre d'uke"]},
                {"name": "Tachiwaza Ryote Dori Kokyu Nage", "description": "TACHIWAZA - Projection par la respiration depuis saisie des deux poignets",
                 "key_points": ["Utiliser le kokyu", "Projeter sans force", "Respiration coordonnée"],
                 "practice_tips": ["Légèreté", "Respiration abdominale"]},
                {"name": "Tachiwaza Ryote Dori Koshi Nage", "description": "TACHIWAZA - Projection de hanche depuis saisie des deux poignets",
                 "key_points": ["Entrer sous uke", "Charger sur la hanche", "Projeter"],
                 "practice_tips": ["Placement précis", "Uke maîtrise les chutes"]},
                {"name": "Tachiwaza Chudan Tsuki Ikkyo", "description": "TACHIWAZA - Première immobilisation depuis coup de poing niveau moyen",
                 "key_points": ["Esquiver le coup", "Contrôler le bras qui frappe", "Immobiliser"],
                 "practice_tips": ["Timing de l'esquive", "Ne pas bloquer frontalement"]},
                {"name": "Tachiwaza Chudan Tsuki Kote Gaeshi", "description": "TACHIWAZA - Retournement du poignet depuis coup de poing niveau moyen",
                 "key_points": ["Esquiver", "Saisir la main", "Rotation et projection"],
                 "practice_tips": ["Précision de la saisie", "Fluidité"]},
                {"name": "Tachiwaza Chudan Tsuki Irimi Nage", "description": "TACHIWAZA - Projection en entrant depuis coup de poing niveau moyen",
                 "key_points": ["Esquiver et entrer", "Contrôle de la tête", "Projeter"],
                 "practice_tips": ["Entrer sur le côté", "Ne pas rester sur la ligne d'attaque"]},
                {"name": "Tachiwaza Chudan Tsuki Uchi Kaiten Nage", "description": "TACHIWAZA - Projection rotative intérieure depuis coup de poing",
                 "key_points": ["Rotation intérieure", "Guider uke", "Projection rotative"],
                 "practice_tips": ["Accompagner l'énergie du coup", "Rediriger"]},
                {"name": "Tachiwaza Chudan Tsuki Soto Kaiten Nage", "description": "TACHIWAZA - Projection rotative extérieure depuis coup de poing",
                 "key_points": ["Rotation extérieure", "Projection", "Contrôle"],
                 "practice_tips": ["Esquive latérale", "Fluidité"]},
                {"name": "Tachiwaza Yokomen Uchi Ikkyo", "description": "TACHIWAZA - Première immobilisation depuis frappe diagonale",
                 "key_points": ["Intercepter la frappe", "Contrôle du coude", "Immobiliser"],
                 "practice_tips": ["Timing d'interception", "Angle de la frappe"]},
                {"name": "Tachiwaza Yokomen Uchi Nikyo", "description": "TACHIWAZA - Deuxième immobilisation depuis frappe diagonale",
                 "key_points": ["Interception", "Transition vers nikyo", "Contrôle du poignet"],
                 "practice_tips": ["Fluidité de la transition", "Précision"]},
                {"name": "Tachiwaza Yokomen Uchi Sankyo", "description": "TACHIWAZA - Troisième immobilisation depuis frappe diagonale",
                 "key_points": ["Spirale du poignet", "Contrôle progressif", "Amener au sol"],
                 "practice_tips": ["Mouvement en spirale", "Continuité"]},
                {"name": "Tachiwaza Yokomen Uchi Yonkyo", "description": "TACHIWAZA - Quatrième immobilisation depuis frappe diagonale",
                 "key_points": ["Point de pression", "Trajectoire d'ikkyo", "Précision"],
                 "practice_tips": ["Localiser le point", "Pression juste"]},
                {"name": "Tachiwaza Yokomen Uchi Gokyo", "description": "TACHIWAZA - Cinquième immobilisation depuis frappe diagonale (contrôle couteau)",
                 "key_points": ["Contrôle spécial pour le couteau", "Poignet vers l'extérieur", "Immobilisation sécurisée"],
                 "practice_tips": ["Technique de désarmement", "Sécurité maximale"]},
                {"name": "Tachiwaza Yokomen Uchi Kote Gaeshi", "description": "TACHIWAZA - Retournement du poignet depuis frappe diagonale",
                 "key_points": ["Saisir la main", "Rotation externe", "Projeter"],
                 "practice_tips": ["Adaptation à la frappe diagonale", "Timing"]},
                {"name": "Tachiwaza Yokomen Uchi Irimi Nage", "description": "TACHIWAZA - Projection en entrant depuis frappe diagonale",
                 "key_points": ["Entrer sur le côté de la frappe", "Contrôle de la tête", "Projection"],
                 "practice_tips": ["Ne pas bloquer", "Accompagner"]},
                {"name": "Tachiwaza Kata Dori Menuchi Ikkyo", "description": "TACHIWAZA - Première immobilisation depuis saisie épaule + frappe",
                 "key_points": ["Gérer la double attaque", "Neutraliser la frappe", "Contrôler le bras"],
                 "practice_tips": ["Réaction à deux stimuli", "Priorité à la frappe"]},
                {"name": "Tachiwaza Kata Dori Menuchi Nikyo", "description": "TACHIWAZA - Deuxième immobilisation depuis saisie épaule + frappe",
                 "key_points": ["Gérer la double attaque", "Transition vers nikyo", "Contrôle"],
                 "practice_tips": ["Fluidité sous pression", "Précision"]},
                {"name": "Tachiwaza Katate Ryote Dori Ikkyo", "description": "TACHIWAZA - Première immobilisation depuis saisie d'un poignet à deux mains",
                 "key_points": ["Uke saisit un poignet avec ses deux mains", "Lever en arc", "Contrôle et immobilisation"],
                 "practice_tips": ["Utiliser le centre, pas les bras", "Kokyu"]},
                {"name": "Tachiwaza Katate Ryote Dori Nikyo", "description": "TACHIWAZA - Deuxième immobilisation depuis saisie d'un poignet à deux mains",
                 "key_points": ["Se libérer de la double saisie", "Transition vers nikyo", "Contrôle"],
                 "practice_tips": ["Ne pas forcer", "Utiliser le mouvement"]},
                {"name": "Tachiwaza Katate Ryote Dori Kokyu Nage", "description": "TACHIWAZA - Projection par respiration depuis saisie d'un poignet à deux mains",
                 "key_points": ["Kokyu (respiration)", "Lever en arc de cercle", "Projeter"],
                 "practice_tips": ["Exercice fondamental", "Respiration coordonnée"]},
                # USHIRO WAZA
                {"name": "Ushiro Waza Ryote Dori Ikkyo", "description": "USHIRO WAZA - Première immobilisation depuis saisie arrière des deux poignets",
                 "key_points": ["Se retourner pour faire face", "Contrôler le bras", "Immobiliser"],
                 "practice_tips": ["Pivoter rapidement", "Ne pas tirer"]},
                {"name": "Ushiro Waza Ryote Dori Kote Gaeshi", "description": "USHIRO WAZA - Retournement du poignet depuis saisie arrière des deux poignets",
                 "key_points": ["Pivoter", "Saisir la main", "Rotation et projection"],
                 "practice_tips": ["Pivotement fluide", "Saisie précise"]},
                {"name": "Ushiro Waza Ryote Dori Irimi Nage", "description": "USHIRO WAZA - Projection en entrant depuis saisie arrière des deux poignets",
                 "key_points": ["Se retourner", "Entrer et contrôler", "Projeter"],
                 "practice_tips": ["Réaction immédiate", "Entrer profondément"]}
            ]
        },
        # ═══════════════════════════════════════════════════════════════
        # 🔵 2e KYU - Minimum 7 mois après le 3e Kyu ou 140 heures
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "2e Kyu",
            "order": 2,
            "color": "#3b82f6",  # Bleu
            "techniques": [
                # SUWARIWAZA
                {"name": "Suwariwaza Yokomen Uchi Ikkyo", "description": "SUWARIWAZA - Première immobilisation depuis frappe diagonale, à genoux",
                 "key_points": ["Intercepter à genoux", "Contrôle du coude", "Immobilisation"],
                 "practice_tips": ["Mobilité en shikko", "Timing"]},
                {"name": "Suwariwaza Yokomen Uchi Nikyo", "description": "SUWARIWAZA - Deuxième immobilisation depuis frappe diagonale, à genoux",
                 "key_points": ["Transition vers nikyo", "Contrôle du poignet", "Rotation"],
                 "practice_tips": ["Fluidité à genoux", "Précision"]},
                {"name": "Suwariwaza Yokomen Uchi Sankyo", "description": "SUWARIWAZA - Troisième immobilisation depuis frappe diagonale, à genoux",
                 "key_points": ["Spirale du poignet", "Contrôle progressif"],
                 "practice_tips": ["Mouvement en spirale", "Stabilité des hanches"]},
                {"name": "Suwariwaza Yokomen Uchi Yonkyo", "description": "SUWARIWAZA - Quatrième immobilisation depuis frappe diagonale, à genoux",
                 "key_points": ["Point de pression", "Précision", "Contrôle"],
                 "practice_tips": ["Localiser le point nerveux", "Pression juste"]},
                {"name": "Suwariwaza Yokomen Uchi Kote Gaeshi", "description": "SUWARIWAZA - Retournement du poignet depuis frappe diagonale, à genoux",
                 "key_points": ["Saisir la main", "Rotation", "Projection"],
                 "practice_tips": ["Adaptation à genoux", "Timing"]},
                {"name": "Suwariwaza Yokomen Uchi Irimi Nage", "description": "SUWARIWAZA - Projection en entrant depuis frappe diagonale, à genoux",
                 "key_points": ["Entrer à genoux", "Contrôle de la tête", "Projection"],
                 "practice_tips": ["Shikko fluide", "Entrer profondément"]},
                # HANMI HANDACHI WAZA
                {"name": "Hanmi Handachi Ryote Dori Shiho Nage", "description": "HANMI HANDACHI - Projection quatre directions depuis saisie deux poignets",
                 "key_points": ["Tori à genoux, uke debout", "Lever et passer sous", "Couper"],
                 "practice_tips": ["Compenser la hauteur", "Mobilité à genoux"]},
                {"name": "Hanmi Handachi Ryote Dori Kokyu Nage", "description": "HANMI HANDACHI - Projection par respiration depuis saisie deux poignets",
                 "key_points": ["Utiliser le kokyu", "Projeter vers l'arrière", "Pas de force"],
                 "practice_tips": ["Respiration coordonnée", "Centre stable"]},
                {"name": "Hanmi Handachi Ushiro Ryokata Dori Ikkyo", "description": "HANMI HANDACHI - Première immobilisation depuis saisie arrière des épaules",
                 "key_points": ["Se dégager", "Contrôler le bras", "Immobiliser"],
                 "practice_tips": ["Réaction rapide", "Utiliser les hanches"]},
                {"name": "Hanmi Handachi Ushiro Ryokata Dori Nikyo", "description": "HANMI HANDACHI - Deuxième immobilisation depuis saisie arrière des épaules",
                 "key_points": ["Se libérer", "Transition vers nikyo", "Contrôle"],
                 "practice_tips": ["Fluidité", "Précision du contrôle"]},
                {"name": "Hanmi Handachi Ushiro Ryokata Dori Sankyo", "description": "HANMI HANDACHI - Troisième immobilisation depuis saisie arrière des épaules",
                 "key_points": ["Spirale du poignet", "Contrôle progressif"],
                 "practice_tips": ["Mouvement en spirale", "Continuité"]},
                {"name": "Hanmi Handachi Ushiro Ryokata Dori Kokyu Nage", "description": "HANMI HANDACHI - Projection par respiration depuis saisie arrière des épaules",
                 "key_points": ["Kokyu", "Se libérer et projeter"],
                 "practice_tips": ["Respiration", "Légèreté"]},
                # TACHIWAZA
                {"name": "Tachiwaza Gyakuhanmi Katate Dori Sankyo", "description": "TACHIWAZA - Troisième immobilisation depuis saisie croisée",
                 "key_points": ["Spirale du poignet", "Rotation extérieure", "Amener au sol"],
                 "practice_tips": ["Continuité du mouvement", "Précision"]},
                {"name": "Tachiwaza Gyakuhanmi Katate Dori Yonkyo", "description": "TACHIWAZA - Quatrième immobilisation depuis saisie croisée",
                 "key_points": ["Point de pression", "Trajectoire d'ikkyo", "Précision"],
                 "practice_tips": ["Localiser le point", "Pression progressive"]},
                {"name": "Tachiwaza Gyakuhanmi Katate Dori Kokyu Nage", "description": "TACHIWAZA - Projection par respiration depuis saisie croisée",
                 "key_points": ["Utiliser le kokyu", "Projeter sans force"],
                 "practice_tips": ["Respiration abdominale", "Légèreté"]},
                {"name": "Tachiwaza Gyakuhanmi Katate Dori Sumi Otoshi", "description": "TACHIWAZA - Projection par le coin depuis saisie croisée",
                 "key_points": ["Déséquilibrer vers le coin", "Guider uke vers le bas", "Projection"],
                 "practice_tips": ["Direction du déséquilibre", "Timing"]},
                {"name": "Tachiwaza Gyakuhanmi Katate Dori Hijikime Osae", "description": "TACHIWAZA - Contrôle du coude depuis saisie croisée",
                 "key_points": ["Extension du bras", "Pression sur le coude", "Contrôle au sol"],
                 "practice_tips": ["Respect de l'articulation", "Contrôle précis"]},
                {"name": "Tachiwaza Jodan Tsuki Ikkyo", "description": "TACHIWAZA - Première immobilisation depuis coup de poing haut",
                 "key_points": ["Esquiver le coup haut", "Contrôler le bras", "Immobiliser"],
                 "practice_tips": ["Esquive vers l'extérieur", "Timing"]},
                {"name": "Tachiwaza Jodan Tsuki Irimi Nage", "description": "TACHIWAZA - Projection en entrant depuis coup de poing haut",
                 "key_points": ["Esquiver et entrer", "Contrôle de la tête", "Projeter"],
                 "practice_tips": ["Ne pas rester sur la ligne", "Entrer profondément"]},
                {"name": "Tachiwaza Shomen Uchi Uchi Kaiten Nage", "description": "TACHIWAZA - Projection rotative intérieure depuis frappe verticale",
                 "key_points": ["Rotation intérieure", "Guider uke", "Projection"],
                 "practice_tips": ["Accompagner l'énergie", "Rediriger"]},
                {"name": "Tachiwaza Shomen Uchi Soto Kaiten Nage", "description": "TACHIWAZA - Projection rotative extérieure depuis frappe verticale",
                 "key_points": ["Rotation extérieure", "Projection"],
                 "practice_tips": ["Esquive latérale", "Fluidité"]},
                {"name": "Tachiwaza Shomen Uchi Koshi Nage", "description": "TACHIWAZA - Projection de hanche depuis frappe verticale",
                 "key_points": ["Entrer sous uke", "Charger sur la hanche", "Projeter"],
                 "practice_tips": ["Placement des hanches", "Timing de l'entrée"]},
                {"name": "Tachiwaza Kata Dori Menuchi Shiho Nage", "description": "TACHIWAZA - Projection quatre directions depuis saisie épaule + frappe",
                 "key_points": ["Gérer la double attaque", "Lever et couper"],
                 "practice_tips": ["Priorité à la frappe", "Fluidité"]},
                {"name": "Tachiwaza Kata Dori Menuchi Udekime Nage", "description": "TACHIWAZA - Projection par contrôle du coude depuis saisie épaule + frappe",
                 "key_points": ["Contrôle du coude", "Extension", "Projection"],
                 "practice_tips": ["Réaction rapide", "Fluidité"]},
                {"name": "Tachiwaza Kata Dori Menuchi Kote Gaeshi", "description": "TACHIWAZA - Retournement du poignet depuis saisie épaule + frappe",
                 "key_points": ["Saisir la main", "Rotation", "Projeter"],
                 "practice_tips": ["Timing", "Précision"]},
                {"name": "Tachiwaza Kata Dori Menuchi Irimi Nage", "description": "TACHIWAZA - Projection en entrant depuis saisie épaule + frappe",
                 "key_points": ["Entrer", "Contrôle de la tête", "Projection"],
                 "practice_tips": ["Entrer profondément", "Fluidité"]},
                {"name": "Tachiwaza Katate Ryote Dori Shiho Nage", "description": "TACHIWAZA - Projection quatre directions depuis saisie poignet à deux mains",
                 "key_points": ["Se libérer de la double saisie", "Lever et couper"],
                 "practice_tips": ["Utiliser le kokyu", "Mouvement circulaire"]},
                {"name": "Tachiwaza Katate Ryote Dori Udekime Nage", "description": "TACHIWAZA - Projection par contrôle du coude depuis saisie poignet à deux mains",
                 "key_points": ["Extension du bras", "Contrôle", "Projection"],
                 "practice_tips": ["Se libérer d'abord", "Fluidité"]},
                {"name": "Tachiwaza Katate Ryote Dori Kote Gaeshi", "description": "TACHIWAZA - Retournement du poignet depuis saisie poignet à deux mains",
                 "key_points": ["Saisir la main d'uke", "Rotation", "Projeter"],
                 "practice_tips": ["Se dégager", "Timing"]},
                {"name": "Tachiwaza Katate Ryote Dori Irimi Nage", "description": "TACHIWAZA - Projection en entrant depuis saisie poignet à deux mains",
                 "key_points": ["Se libérer", "Entrer", "Projeter"],
                 "practice_tips": ["Utiliser le centre", "Fluidité"]},
                {"name": "Tachiwaza Katate Ryote Dori Jugi Garami", "description": "TACHIWAZA - Contrôle croisé des bras depuis saisie poignet à deux mains",
                 "key_points": ["Croiser les bras d'uke", "Contrôle", "Immobilisation ou projection"],
                 "practice_tips": ["Technique avancée", "Précision"]},
                {"name": "Tachiwaza Muna Dori Ikkyo", "description": "TACHIWAZA - Première immobilisation depuis saisie du revers",
                 "key_points": ["Contrôler le bras qui saisit", "Guider vers le bas", "Immobiliser"],
                 "practice_tips": ["Réaction immédiate", "Ne pas laisser s'installer"]},
                {"name": "Tachiwaza Muna Dori Nikyo", "description": "TACHIWAZA - Deuxième immobilisation depuis saisie du revers",
                 "key_points": ["Transition vers nikyo", "Contrôle du poignet"],
                 "practice_tips": ["Fluidité", "Précision"]},
                {"name": "Tachiwaza Muna Dori Shiho Nage", "description": "TACHIWAZA - Projection quatre directions depuis saisie du revers",
                 "key_points": ["Lever le bras", "Passer sous", "Couper"],
                 "practice_tips": ["Mouvement circulaire", "Fluidité"]},
                {"name": "Tachiwaza Yokomen Uchi Koshi Nage", "description": "TACHIWAZA - Projection de hanche depuis frappe diagonale",
                 "key_points": ["Entrer sous uke", "Charger sur la hanche", "Projeter"],
                 "practice_tips": ["Timing d'entrée", "Placement des hanches"]},
                {"name": "Tachiwaza Ryote Dori Jugi Garami", "description": "TACHIWAZA - Contrôle croisé des bras depuis saisie deux poignets",
                 "key_points": ["Croiser les bras", "Contrôler", "Immobiliser ou projeter"],
                 "practice_tips": ["Technique avancée", "Coordination"]},
                # USHIRO WAZA
                {"name": "Ushiro Ryote Dori Nikyo", "description": "USHIRO WAZA - Deuxième immobilisation depuis saisie arrière des deux poignets",
                 "key_points": ["Pivoter", "Transition vers nikyo", "Contrôle"],
                 "practice_tips": ["Pivotement fluide", "Précision"]},
                {"name": "Ushiro Ryote Dori Sankyo", "description": "USHIRO WAZA - Troisième immobilisation depuis saisie arrière des deux poignets",
                 "key_points": ["Spirale du poignet", "Contrôle progressif"],
                 "practice_tips": ["Mouvement en spirale", "Continuité"]},
                {"name": "Ushiro Ryote Dori Yonkyo", "description": "USHIRO WAZA - Quatrième immobilisation depuis saisie arrière des deux poignets",
                 "key_points": ["Point de pression", "Précision"],
                 "practice_tips": ["Localiser le point", "Pression juste"]},
                {"name": "Ushiro Ryote Dori Shiho Nage", "description": "USHIRO WAZA - Projection quatre directions depuis saisie arrière des deux poignets",
                 "key_points": ["Pivoter", "Lever et couper"],
                 "practice_tips": ["Se retourner efficacement", "Fluidité"]},
                {"name": "Ushiro Ryokata Dori Ikkyo", "description": "USHIRO WAZA - Première immobilisation depuis saisie arrière des deux épaules",
                 "key_points": ["Se dégager", "Contrôler le bras", "Immobiliser"],
                 "practice_tips": ["Réaction immédiate", "Utiliser les hanches"]},
                {"name": "Ushiro Ryokata Dori Nikyo", "description": "USHIRO WAZA - Deuxième immobilisation depuis saisie arrière des deux épaules",
                 "key_points": ["Se libérer", "Transition vers nikyo"],
                 "practice_tips": ["Fluidité", "Précision"]},
                {"name": "Ushiro Ryokata Dori Irimi Nage", "description": "USHIRO WAZA - Projection en entrant depuis saisie arrière des deux épaules",
                 "key_points": ["Se retourner", "Entrer et projeter"],
                 "practice_tips": ["Pivotement rapide", "Entrer profondément"]}
            ]
        },
        # ═══════════════════════════════════════════════════════════════
        # 🟤 1er KYU - Minimum 8 mois après le 2e Kyu ou 160 heures
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "1er Kyu",
            "order": 1,
            "color": "#92400e",  # Marron
            "techniques": [
                # SUWARIWAZA
                {"name": "Suwariwaza Ryote Dori Ikkyo", "description": "SUWARIWAZA - Première immobilisation depuis saisie des deux poignets, à genoux",
                 "key_points": ["Uke saisit les deux poignets", "Contrôle d'un bras", "Immobiliser"],
                 "practice_tips": ["Travail des hanches à genoux", "Choisir quel bras contrôler"]},
                {"name": "Suwariwaza Ryo Kata Dori Ikkyo", "description": "SUWARIWAZA - Première immobilisation depuis saisie des deux épaules, à genoux",
                 "key_points": ["Se dégager de la double saisie", "Contrôler un bras", "Immobiliser"],
                 "practice_tips": ["Réaction immédiate", "Utiliser le centre"]},
                # HANMI HANDACHI WAZA
                {"name": "Hanmi Handachi Gyakuhanmi Katate Dori Kote Gaeshi", "description": "HANMI HANDACHI - Retournement du poignet depuis saisie croisée",
                 "key_points": ["Tori à genoux", "Saisir la main", "Rotation et projection"],
                 "practice_tips": ["Compenser la hauteur", "Timing"]},
                {"name": "Hanmi Handachi Gyakuhanmi Katate Dori Irimi Nage", "description": "HANMI HANDACHI - Projection en entrant depuis saisie croisée",
                 "key_points": ["Entrer depuis les genoux", "Contrôle de la tête", "Projeter"],
                 "practice_tips": ["Mobilité à genoux", "Shikko fluide"]},
                {"name": "Hanmi Handachi Gyakuhanmi Katate Dori Kaiten Nage", "description": "HANMI HANDACHI - Projection rotative depuis saisie croisée",
                 "key_points": ["Rotation", "Guider uke", "Projeter"],
                 "practice_tips": ["Fluidité", "Accompagner le mouvement"]},
                {"name": "Hanmi Handachi Gyakuhanmi Katate Dori Sumi Otoshi", "description": "HANMI HANDACHI - Projection par le coin depuis saisie croisée",
                 "key_points": ["Déséquilibrer vers le coin", "Projeter vers le bas"],
                 "practice_tips": ["Direction du déséquilibre", "Timing"]},
                {"name": "Hanmi Handachi Shomen Uchi Irimi Nage", "description": "HANMI HANDACHI - Projection en entrant depuis frappe verticale",
                 "key_points": ["Esquiver à genoux", "Entrer et contrôler", "Projeter"],
                 "practice_tips": ["Mobilité en shikko", "Timing"]},
                # TACHIWAZA
                {"name": "Tachiwaza Ryote Dori Ikkyo", "description": "TACHIWAZA - Première immobilisation depuis saisie des deux poignets",
                 "key_points": ["Choisir un bras à contrôler", "Guider vers le bas", "Immobiliser"],
                 "practice_tips": ["Décision rapide", "Contrôle efficace"]},
                {"name": "Tachiwaza Ryo Kata Dori Ikkyo", "description": "TACHIWAZA - Première immobilisation depuis saisie des deux épaules",
                 "key_points": ["Se dégager", "Contrôler un bras", "Immobiliser"],
                 "practice_tips": ["Réaction immédiate", "Ne pas subir"]},
                {"name": "Tachiwaza Shomen Uchi Gokyo", "description": "TACHIWAZA - Cinquième immobilisation depuis frappe verticale",
                 "key_points": ["Contrôle spécial pour couteau", "Poignet vers l'extérieur", "Sécurité"],
                 "practice_tips": ["Technique de désarmement", "Vigilance"]},
                {"name": "Tachiwaza Shomen Uchi Shiho Nage", "description": "TACHIWAZA - Projection quatre directions depuis frappe verticale",
                 "key_points": ["Intercepter", "Lever et passer sous", "Couper"],
                 "practice_tips": ["Timing d'interception", "Fluidité"]},
                {"name": "Tachiwaza Jodan Tsuki Shiho Nage", "description": "TACHIWAZA - Projection quatre directions depuis coup de poing haut",
                 "key_points": ["Esquiver", "Saisir le bras", "Lever et couper"],
                 "practice_tips": ["Esquive latérale", "Ne pas bloquer"]},
                {"name": "Tachiwaza Mae Geri Irimi Nage", "description": "TACHIWAZA - Projection en entrant depuis coup de pied frontal",
                 "key_points": ["Esquiver le coup de pied", "Entrer sur le côté", "Contrôler et projeter"],
                 "practice_tips": ["Timing crucial", "Ne pas rester devant"]},
                # USHIRO WAZA
                {"name": "Ushiro Ryote Dori Kokyu Nage", "description": "USHIRO WAZA - Projection par respiration depuis saisie arrière des deux poignets",
                 "key_points": ["Utiliser le kokyu", "Projeter sans force"],
                 "practice_tips": ["Respiration coordonnée", "Légèreté"]},
                {"name": "Ushiro Ryote Dori Koshi Nage", "description": "USHIRO WAZA - Projection de hanche depuis saisie arrière des deux poignets",
                 "key_points": ["Pivoter", "Charger sur la hanche", "Projeter"],
                 "practice_tips": ["Pivotement rapide", "Placement des hanches"]},
                {"name": "Ushiro Ryote Dori Jiyu Waza", "description": "USHIRO WAZA - Technique libre depuis saisie arrière des deux poignets",
                 "key_points": ["Choisir librement la technique", "Adaptation", "Fluidité"],
                 "practice_tips": ["Varier les réponses", "Spontanéité"]},
                {"name": "Ushiro Ryo Kata Dori Sankyo", "description": "USHIRO WAZA - Troisième immobilisation depuis saisie arrière des deux épaules",
                 "key_points": ["Se dégager", "Spirale du poignet", "Contrôle"],
                 "practice_tips": ["Réaction rapide", "Continuité"]},
                {"name": "Ushiro Ryo Kata Dori Kote Gaeshi", "description": "USHIRO WAZA - Retournement du poignet depuis saisie arrière des deux épaules",
                 "key_points": ["Pivoter", "Saisir la main", "Rotation et projection"],
                 "practice_tips": ["Pivotement fluide", "Timing"]},
                {"name": "Ushiro Ryo Kata Dori Kokyu Nage", "description": "USHIRO WAZA - Projection par respiration depuis saisie arrière des deux épaules",
                 "key_points": ["Utiliser le kokyu", "Se libérer et projeter"],
                 "practice_tips": ["Respiration", "Légèreté"]},
                {"name": "Ushiro Eri Dori Ikkyo", "description": "USHIRO WAZA - Première immobilisation depuis saisie arrière du col",
                 "key_points": ["Se dégager du col", "Contrôler le bras", "Immobiliser"],
                 "practice_tips": ["Protéger le cou", "Réaction immédiate"]},
                {"name": "Ushiro Eri Dori Kote Gaeshi", "description": "USHIRO WAZA - Retournement du poignet depuis saisie arrière du col",
                 "key_points": ["Pivoter", "Saisir la main", "Rotation"],
                 "practice_tips": ["Se libérer d'abord", "Timing"]},
                {"name": "Ushiro Eri Dori Kokyu Nage", "description": "USHIRO WAZA - Projection par respiration depuis saisie arrière du col",
                 "key_points": ["Kokyu", "Se libérer et projeter"],
                 "practice_tips": ["Respiration", "Légèreté"]},
                {"name": "Ushiro Katate Dori Kubishime Shiho Nage", "description": "USHIRO WAZA - Projection quatre directions depuis saisie poignet + étranglement",
                 "key_points": ["Protéger la gorge", "Se libérer", "Lever et couper"],
                 "practice_tips": ["Priorité à l'étranglement", "Réaction rapide"]},
                {"name": "Ushiro Katate Dori Kubishime Kote Gaeshi", "description": "USHIRO WAZA - Retournement du poignet depuis saisie poignet + étranglement",
                 "key_points": ["Se dégager de l'étranglement", "Saisir la main", "Rotation"],
                 "practice_tips": ["Sécurité d'abord", "Timing"]},
                {"name": "Ushiro Katate Dori Kubishime Kokyu Nage", "description": "USHIRO WAZA - Projection par respiration depuis saisie poignet + étranglement",
                 "key_points": ["Protéger la gorge", "Kokyu", "Projeter"],
                 "practice_tips": ["Respiration contrôlée", "Ne pas paniquer"]}
            ]
        },
        # ═══════════════════════════════════════════════════════════════
        # ⬛ SHODAN - Premier Dan
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "Shodan (1er Dan)",
            "order": 0,
            "color": "#1c1917",  # Noir
            "techniques": [
                {"name": "Connaissance formelle des techniques", "description": "Construction des techniques en trois phases : placement initial, création du déséquilibre, finalisation",
                 "key_points": ["Phase initiale de placement", "Phase dynamique de déséquilibre", "Phase terminale (projection/immobilisation)"],
                 "practice_tips": ["Respecter les trois phases", "Continuité du mouvement", "Précision et exactitude"]},
                {"name": "Principe d'intégrité", "description": "Préserver l'intégrité physique et mentale des deux protagonistes",
                 "key_points": ["Unité du corps et centrage", "Attitude juste et maîtrise", "Vigilance constante (zanshin)"],
                 "practice_tips": ["Engagement du corps dans l'action", "Rythme adapté", "Concentration soutenue"]},
                {"name": "Suwariwaza", "description": "Pratique à genoux - maîtrise complète",
                 "key_points": ["Toutes les techniques à genoux", "Shikko fluide", "Hanches stables"],
                 "practice_tips": ["Pratiquer régulièrement à genoux", "Renforcer les hanches"]},
                {"name": "Tachiwaza sur saisies", "description": "Pratique debout sur toutes les saisies",
                 "key_points": ["Katate dori, ryote dori, kata dori, muna dori, ushiro"],
                 "practice_tips": ["Varier les attaques", "Adapter les réponses"]},
                {"name": "Tachiwaza sur coups frappés", "description": "Pratique debout sur frappes",
                 "key_points": ["Shomen uchi, yokomen uchi, tsuki"],
                 "practice_tips": ["Timing d'interception", "Ne pas bloquer"]},
                {"name": "Hanmi Handachi Waza", "description": "Pratique attaquant debout, défenseur à genoux",
                 "key_points": ["Compenser la différence de hauteur", "Mobilité à genoux"],
                 "practice_tips": ["Shikko maîtrisé", "Utiliser les hanches"]},
                {"name": "Ushiro Waza", "description": "Attaques arrière - toutes les formes",
                 "key_points": ["Réaction immédiate", "Pivotement efficace"],
                 "practice_tips": ["Ne pas paniquer", "Sentir l'attaque venir"]},
                {"name": "Randori (2 adversaires)", "description": "Pratique libre contre deux attaquants",
                 "key_points": ["Gestion de l'espace", "Positionnement", "Fluidité"],
                 "practice_tips": ["Ne jamais rester entre les deux", "Mouvement constant"]},
                {"name": "Tanto Dori", "description": "Pratique contre couteau",
                 "key_points": ["Gokyo", "Sécurité maximale", "Désarmement"],
                 "practice_tips": ["Vigilance", "Ne jamais saisir la lame"]},
                {"name": "Jo Dori / Jo Nage Waza", "description": "Pratique contre bâton et projections avec bâton",
                 "key_points": ["Désarmement du jo", "Projections avec le jo"],
                 "practice_tips": ["Distance (ma-ai)", "Contrôle de l'arme"]}
            ]
        },
        # ═══════════════════════════════════════════════════════════════
        # ⬛ NIDAN - Deuxième Dan
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "Nidan (2e Dan)",
            "order": -1,
            "color": "#1c1917",  # Noir
            "techniques": [
                {"name": "Maîtrise des outils du 1er Dan", "description": "Compétence avérée dans tous les domaines du Shodan",
                 "key_points": ["Fluidité dans la construction", "Contrôle parfait de la distance", "Capacité d'anticipation"],
                 "practice_tips": ["Rapidité et puissance", "Détermination mentale"]},
                {"name": "Engagement physique important", "description": "Niveau d'engagement supérieur adapté à l'âge",
                 "key_points": ["Engagement sans excès", "Caractère technique préservé"],
                 "practice_tips": ["Équilibre force/technique", "Adaptation à l'âge"]},
                {"name": "Suwariwaza avancé", "description": "Pratique à genoux avec fluidité accrue",
                 "key_points": ["Enchaînements fluides", "Transitions rapides"],
                 "practice_tips": ["Augmenter la difficulté", "Varier les attaques"]},
                {"name": "Tachiwaza avancé", "description": "Pratique debout avec plus de variations",
                 "key_points": ["Variations sur les techniques de base", "Adaptabilité"],
                 "practice_tips": ["Explorer les variations", "Spontanéité"]},
                {"name": "Hanmi Handachi avancé", "description": "Pratique mixte avec plus d'exigence",
                 "key_points": ["Fluidité", "Efficacité"],
                 "practice_tips": ["Augmenter le rythme", "Varier les attaques"]},
                {"name": "Ushiro Waza avancé", "description": "Attaques arrière plus complexes",
                 "key_points": ["Réactions plus rapides", "Variations"],
                 "practice_tips": ["Travailler les enchaînements", "Anticipation"]},
                {"name": "Randori (2 adversaires) avancé", "description": "Pratique libre plus intense",
                 "key_points": ["Gestion de l'espace améliorée", "Continuité"],
                 "practice_tips": ["Augmenter l'intensité", "Rester calme"]},
                {"name": "Tanto Dori avancé", "description": "Désarmement couteau plus fluide",
                 "key_points": ["Réactions plus naturelles", "Sécurité constante"],
                 "practice_tips": ["Automatiser les réflexes", "Vigilance"]},
                {"name": "Jo Dori / Jo Nage Waza avancé", "description": "Travail au bâton plus élaboré",
                 "key_points": ["Désarmements variés", "Projections multiples"],
                 "practice_tips": ["Explorer les possibilités", "Créativité"]}
            ]
        },
        # ═══════════════════════════════════════════════════════════════
        # ⬛ SANDAN - Troisième Dan
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "Sandan (3e Dan)",
            "order": -2,
            "color": "#1c1917",  # Noir
            "techniques": [
                {"name": "Kokyu Ryoku", "description": "Coordination de la puissance physique et du rythme respiratoire",
                 "key_points": ["Respiration intégrée au mouvement", "Puissance issue du kokyu"],
                 "practice_tips": ["Travailler la respiration abdominale", "Unifier corps et souffle"]},
                {"name": "Dimension spirituelle", "description": "Entrée dans la dimension spirituelle de l'Aïkido",
                 "key_points": ["Au-delà de la technique pure", "Compréhension profonde"],
                 "practice_tips": ["Méditation", "Réflexion sur la voie"]},
                {"name": "Finesse et précision", "description": "Techniques raffinées et précises",
                 "key_points": ["Économie de mouvement", "Efficacité maximale"],
                 "practice_tips": ["Éliminer le superflu", "Affiner chaque geste"]},
                {"name": "Capacité de transmission", "description": "Début de la capacité à transmettre",
                 "key_points": ["Montrer clairement", "Expliquer les principes"],
                 "practice_tips": ["Enseigner pour comprendre", "Patience"]},
                {"name": "Contrôle de soi complet", "description": "Maîtrise totale de ses actes",
                 "key_points": ["Calme en toutes circonstances", "Réponses mesurées"],
                 "practice_tips": ["Gestion des émotions", "Stabilité mentale"]},
                {"name": "Adaptabilité", "description": "Capacité à faire des variations",
                 "key_points": ["S'adapter à chaque situation", "Créativité technique"],
                 "practice_tips": ["Sortir des formes fixes", "Explorer"]},
                {"name": "Disponibilité constante", "description": "Vigilance à tous moments",
                 "key_points": ["Zanshin permanent", "Aucun relâchement"],
                 "practice_tips": ["Attention soutenue", "Présence"]},
                {"name": "Maîtrise d'Irimi", "description": "Grande maîtrise de l'entrée",
                 "key_points": ["Irimi naturel et efficace", "Timing parfait"],
                 "practice_tips": ["Travailler les entrées", "Spontanéité"]},
                {"name": "Ma-ai et timing", "description": "Juste appréciation de la distance et du moment",
                 "key_points": ["Distance correcte", "Interventions au bon moment"],
                 "practice_tips": ["Sentir la distance", "Développer l'intuition"]},
                {"name": "Imposer le rythme", "description": "Capacité à maintenir un rythme",
                 "key_points": ["Contrôler le tempo", "Ne pas subir"],
                 "practice_tips": ["Prendre l'initiative", "Garder le contrôle"]},
                {"name": "Randori (3 adversaires)", "description": "Pratique libre contre trois attaquants",
                 "key_points": ["Gestion de l'espace élargie", "Calme absolu"],
                 "practice_tips": ["Ne jamais s'arrêter", "Mouvement perpétuel"]},
                {"name": "Tachi Dori", "description": "Pratique contre sabre de bois",
                 "key_points": ["Désarmement du bokken", "Sécurité"],
                 "practice_tips": ["Respect de l'arme", "Distance"]},
                {"name": "Kumitachi", "description": "Exercices avec bokken à deux",
                 "key_points": ["Harmonisation avec le partenaire", "Précision des coupes"],
                 "practice_tips": ["Pratiquer les kata", "Zanshin"]},
                {"name": "Kumijo", "description": "Exercices avec jo à deux",
                 "key_points": ["Coordination", "Fluidité"],
                 "practice_tips": ["Maîtriser les 13 jo kata", "Harmonisation"]}
            ]
        },
        # ═══════════════════════════════════════════════════════════════
        # ⬛ YONDAN - Quatrième Dan
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "Yondan (4e Dan)",
            "order": -3,
            "color": "#1c1917",  # Noir
            "techniques": [
                {"name": "Compréhension des principes", "description": "Entrevoir les principes qui régissent les techniques",
                 "key_points": ["Au-delà des formes", "Essence de l'Aïkido"],
                 "practice_tips": ["Réflexion profonde", "Étude continue"]},
                {"name": "Capacité à guider", "description": "Conduire précisément les pratiquants sur la voie du fondateur",
                 "key_points": ["Transmission claire", "Exemple vivant"],
                 "practice_tips": ["Responsabilité d'enseignement", "Humilité"]},
                {"name": "Shisei (Posture)", "description": "Posture parfaite et naturelle",
                 "key_points": ["Alignement corporel", "Stabilité"],
                 "practice_tips": ["Conscience corporelle", "Correction constante"]},
                {"name": "Kamae (Garde)", "description": "Garde efficace et adaptable",
                 "key_points": ["Position de base solide", "Adaptabilité"],
                 "practice_tips": ["Naturel de la garde", "Pas de rigidité"]},
                {"name": "Kiryoku (Puissance vitale)", "description": "Manifestation de l'énergie vitale",
                 "key_points": ["Ki développé", "Présence forte"],
                 "practice_tips": ["Pratique du ki", "Respiration"]},
                {"name": "Seishin Jotai (État mental)", "description": "État mental optimal",
                 "key_points": ["Calme et concentration", "Pas de peur ni d'agressivité"],
                 "practice_tips": ["Méditation", "Travail mental"]},
                {"name": "Metsuke (Regard)", "description": "Regard physique et mental juste",
                 "key_points": ["Vision périphérique", "Perception globale"],
                 "practice_tips": ["Ne pas fixer", "Voir sans regarder"]},
                {"name": "Ma-ai (Espace-temps)", "description": "Maîtrise parfaite de la distance et du timing",
                 "key_points": ["Distance juste", "Moment opportun"],
                 "practice_tips": ["Intuition développée", "Sens du timing"]},
                {"name": "Arukikata (Marche)", "description": "Déplacement naturel et efficace",
                 "key_points": ["Marche fluide", "Centre stable"],
                 "practice_tips": ["Intégrer dans la vie quotidienne", "Conscience du mouvement"]},
                {"name": "Tai Sabaki (Déplacement)", "description": "Déplacements parfaits",
                 "key_points": ["Irimi et tenkan maîtrisés", "Placement optimal"],
                 "practice_tips": ["Pratiquer les déplacements seul", "Automatisation"]},
                {"name": "Kokyu (Respiration)", "description": "Respiration intégrée et naturelle",
                 "key_points": ["Respiration abdominale", "Coordination corps-souffle"],
                 "practice_tips": ["Pratique quotidienne", "Conscience du souffle"]},
                {"name": "Sokudo (Rapidité)", "description": "Rapidité d'exécution sans précipitation",
                 "key_points": ["Vitesse adaptée", "Pas de hâte"],
                 "practice_tips": ["Travailler lentement puis accélérer", "Garder la forme"]},
                {"name": "Ko Ryoku (Efficacité)", "description": "Efficacité maximale avec minimum d'effort",
                 "key_points": ["Économie de mouvement", "Résultat optimal"],
                 "practice_tips": ["Éliminer le superflu", "Affiner"]},
                {"name": "Reigi Saho (Étiquette)", "description": "Respect parfait de l'étiquette",
                 "key_points": ["Saluts corrects", "Comportement approprié"],
                 "practice_tips": ["Connaître les règles", "Les appliquer naturellement"]},
                {"name": "Nichijo no Taido (Attitude quotidienne)", "description": "Attitude juste dans la vie quotidienne",
                 "key_points": ["Aïkido hors du dojo", "Harmonie au quotidien"],
                 "practice_tips": ["Appliquer les principes", "Vivre l'Aïkido"]},
                {"name": "Kokoro no Mochi Kata (Contrôle des émotions)", "description": "Maîtrise parfaite du cœur et des émotions",
                 "key_points": ["Stabilité émotionnelle", "Sérénité"],
                 "practice_tips": ["Travail sur soi", "Patience et persévérance"]}
            ]
        },
        # ═══════════════════════════════════════════════════════════════
        # 🗡️ BOKKEN - Travail au sabre de bois
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "Bokken",
            "order": -10,
            "color": "#78350f",  # Marron foncé
            "techniques": [
                {"name": "Tenue du Bokken (Te no Uchi)", "description": "Apprentissage de la tenue correcte du sabre",
                 "key_points": ["Main droite près de la garde (tsuba)", "Main gauche à l'extrémité", "Petit doigt et annulaire serrent, autres souples"],
                 "practice_tips": ["Vérifier régulièrement la position", "Garder les épaules détendues"]},
                {"name": "Kamae (Gardes)", "description": "Les différentes positions de garde au bokken",
                 "key_points": ["Chudan no kamae (garde moyenne)", "Jodan no kamae (garde haute)", "Gedan no kamae (garde basse)", "Hasso no kamae, Waki no kamae"],
                 "practice_tips": ["Pratiquer chaque garde", "Transitions fluides"]},
                {"name": "Shomen Uchi (Coupe verticale)", "description": "Coupe verticale du haut vers le bas",
                 "key_points": ["Lever le bokken au-dessus de la tête", "Couper avec les hanches", "Extension complète à la fin"],
                 "practice_tips": ["Répéter 50-100 fois", "Garder le rythme régulier"]},
                {"name": "Yokomen Uchi (Coupe diagonale)", "description": "Coupe diagonale vers le cou",
                 "key_points": ["Angle à 45°", "Viser le côté du cou", "Rotation des hanches"],
                 "practice_tips": ["Alterner gauche et droite", "Précision de la trajectoire"]},
                {"name": "Tsuki (Estoc)", "description": "Coup d'estoc vers l'avant",
                 "key_points": ["Pointe vers la gorge ou le plexus", "Extension des bras", "Avancer avec le corps"],
                 "practice_tips": ["Précision de la pointe", "Ne pas s'exposer"]},
                {"name": "Suburi 1-7", "description": "Les 7 exercices fondamentaux de coupe",
                 "key_points": ["Suburi 1-2 : coupes shomen", "Suburi 3-4 : coupes avec pas", "Suburi 5-7 : coupes avec pivot"],
                 "practice_tips": ["Mémoriser chaque suburi", "Pratiquer quotidiennement"]},
                {"name": "Awase (Harmonisation)", "description": "Exercices d'harmonisation avec partenaire",
                 "key_points": ["Go no awase (5 formes)", "Synchronisation avec le partenaire", "Contrôle de la distance"],
                 "practice_tips": ["Communication non-verbale", "Respect du timing"]},
                {"name": "Kumitachi (Kata à deux)", "description": "Formes codifiées à deux partenaires",
                 "key_points": ["Kumitachi 1 à 5 (ou plus selon école)", "Rôles de uchitachi et uketachi", "Précision des mouvements"],
                 "practice_tips": ["Apprendre les deux rôles", "Zanshin à la fin"]},
                {"name": "Ken Tai Jo (Sabre contre bâton)", "description": "Exercices bokken contre jo",
                 "key_points": ["Gérer la différence de longueur", "Adapter la distance", "Timing"],
                 "practice_tips": ["Comprendre les avantages de chaque arme", "Adapter sa stratégie"]},
                {"name": "Tachi Dori (Désarmement)", "description": "Techniques de désarmement du bokken",
                 "key_points": ["Esquiver la coupe", "Entrer et contrôler", "Désarmer en sécurité"],
                 "practice_tips": ["Timing crucial", "Ne jamais saisir la lame"]},
                {"name": "Zanshin", "description": "Vigilance maintenue après la technique",
                 "key_points": ["Rester concentré après la coupe", "Position stable", "Regard sur le partenaire"],
                 "practice_tips": ["Ne pas relâcher l'attention", "Présence constante"]},
                {"name": "Ki Ken Tai Ichi", "description": "Unité de l'esprit, du sabre et du corps",
                 "key_points": ["Synchronisation parfaite", "Esprit, sabre et corps ne font qu'un"],
                 "practice_tips": ["Méditation en mouvement", "Recherche de l'unité"]}
            ]
        }
    ]
        {
            "name": "3e kyu",
            "order": 3,
            "color": "#22c55e",  # Vert
            "techniques": [
                # TACHIWAZA
                {"name": "Shomenuchi sankyo (omote/ura)", "description": "TACHIWAZA - Troisième immobilisation (torsion poignet extérieur) depuis frappe verticale", "image_url": GIF_URLS["sankyo"]},
                {"name": "Katatedori sankyo (omote/ura)", "description": "TACHIWAZA - Troisième immobilisation depuis saisie du poignet - contrôle en spirale", "image_url": GIF_URLS["sankyo"]},
                {"name": "Yokomenuchi shiho nage", "description": "TACHIWAZA - Projection quatre directions depuis frappe diagonale à la tête", "image_url": GIF_URLS["shiho_nage"]},
                {"name": "Ryotedori shiho nage", "description": "TACHIWAZA - Projection quatre directions depuis saisie des deux poignets", "image_url": GIF_URLS["shiho_nage"]},
                {"name": "Tsuki kote gaeshi", "description": "TACHIWAZA - Retournement du poignet depuis coup de poing (chudan ou jodan tsuki)", "image_url": GIF_URLS["kote_gaeshi"]},
                {"name": "Shomenuchi kote gaeshi", "description": "TACHIWAZA - Retournement du poignet depuis frappe verticale", "image_url": GIF_URLS["kote_gaeshi"]},
                {"name": "Katatedori kaiten nage", "description": "TACHIWAZA - Projection rotative depuis saisie - uchi kaiten ou soto kaiten", "image_url": GIF_URLS["kaiten_nage"]},
                # SUWARIWAZA
                {"name": "Suwari waza sankyo (omote/ura)", "description": "SUWARIWAZA - Troisième immobilisation à genoux", "image_url": GIF_URLS["suwari"]},
                {"name": "Suwari waza shomenuchi ikkyo à sankyo", "description": "SUWARIWAZA - Enchaînement des trois premières immobilisations à genoux", "image_url": GIF_URLS["suwari"]},
                # HANMI HANDACHI
                {"name": "Hanmi handachi katatedori shiho nage", "description": "HANMI HANDACHI - Projection quatre directions, tori à genoux contre uke debout", "image_url": GIF_URLS["hanmi_handachi"]},
                # BUKIWAZA
                {"name": "Suburi bokken complets (5-7)", "description": "BUKIWAZA - Ensemble des suburi fondamentaux au sabre selon la ligue (5 à 7)", "image_url": GIF_URLS["bokken"]},
                {"name": "Awase bokken simples", "description": "BUKIWAZA - Exercices d'harmonisation au sabre avec partenaire - go no awase", "image_url": GIF_URLS["bokken"]},
                {"name": "Jo suburi de base", "description": "BUKIWAZA - Exercices fondamentaux au bâton - tsuki, uchikomi, kaeshi", "image_url": GIF_URLS["jo"]}
            ]
        },
        {
            "name": "2e kyu",
            "order": 2,
            "color": "#3b82f6",  # Bleu
            "techniques": [
                # TACHIWAZA
                {"name": "Shomenuchi yonkyo (omote/ura)", "description": "TACHIWAZA - Quatrième immobilisation (pression point nerveux) depuis frappe verticale", "image_url": GIF_URLS["yonkyo"]},
                {"name": "Katatedori yonkyo (omote/ura)", "description": "TACHIWAZA - Quatrième immobilisation depuis saisie du poignet", "image_url": GIF_URLS["yonkyo"]},
                {"name": "Yokomenuchi ikkyo à yonkyo", "description": "TACHIWAZA - Immobilisations 1 à 4 depuis frappe diagonale - enchaînement fluide", "image_url": GIF_URLS["ikkyo"]},
                {"name": "Yokomenuchi irimi nage", "description": "TACHIWAZA - Projection en entrant depuis frappe latérale à la tête", "image_url": GIF_URLS["irimi_nage"]},
                {"name": "Yokomenuchi kote gaeshi", "description": "TACHIWAZA - Retournement du poignet depuis frappe diagonale", "image_url": GIF_URLS["kote_gaeshi"]},
                {"name": "Ushiro ryotedori ikkyo", "description": "USHIROWAZA - Première immobilisation depuis saisie arrière des deux poignets", "image_url": GIF_URLS["ushiro"]},
                {"name": "Ushiro ryotedori shiho nage", "description": "USHIROWAZA - Projection quatre directions depuis saisie arrière", "image_url": GIF_URLS["ushiro"]},
                # SUWARIWAZA
                {"name": "Suwari waza yonkyo", "description": "SUWARIWAZA - Quatrième immobilisation à genoux", "image_url": GIF_URLS["suwari"]},
                {"name": "Suwari waza yokomenuchi ikkyo à yonkyo", "description": "SUWARIWAZA - Immobilisations depuis frappe diagonale à genoux", "image_url": GIF_URLS["suwari"]},
                # HANMI HANDACHI
                {"name": "Hanmi handachi katatedori irimi nage", "description": "HANMI HANDACHI - Projection en entrant, tori à genoux", "image_url": GIF_URLS["hanmi_handachi"]},
                {"name": "Hanmi handachi katatedori kaiten nage", "description": "HANMI HANDACHI - Projection rotative, tori à genoux", "image_url": GIF_URLS["hanmi_handachi"]},
                # BUKIWAZA
                {"name": "Suburi jo 1-13", "description": "BUKIWAZA - 13 exercices de base au bâton", "image_url": GIF_URLS["jo"]},
                {"name": "Awase jo simples", "description": "BUKIWAZA - Exercices d'harmonisation au jo avec partenaire", "image_url": GIF_URLS["jo"]}
            ]
        },
        {
            "name": "1er kyu",
            "order": 1,
            "color": "#7c3aed",  # Violet/Marron
            "techniques": [
                # TACHIWAZA avancé
                {"name": "Yokomenuchi gokyo", "description": "TACHIWAZA - Cinquième immobilisation (contrôle du couteau) depuis frappe diagonale", "image_url": GIF_URLS["gokyo"]},
                {"name": "Katadori menuchi ikkyo à sankyo", "description": "TACHIWAZA - Immobilisations depuis saisie épaule + frappe simultanée", "image_url": GIF_URLS["ikkyo"]},
                {"name": "Ryotedori tenchi nage", "description": "TACHIWAZA - Projection ciel-terre depuis saisie des deux poignets", "image_url": GIF_URLS["tenchi_nage"]},
                {"name": "Katatedori koshi nage", "description": "TACHIWAZA - Projection de hanche depuis saisie du poignet", "image_url": GIF_URLS["koshi_nage"]},
                {"name": "Katatedori sumi otoshi", "description": "TACHIWAZA - Projection par le coin depuis saisie", "image_url": GIF_URLS["sumi_otoshi"]},
                {"name": "Aihanmi katatedori kokyu nage", "description": "TACHIWAZA - Projection par la respiration depuis saisie opposée", "image_url": GIF_URLS["kokyu_nage"]},
                # USHIROWAZA complet
                {"name": "Ushiro ryotedori sankyo", "description": "USHIROWAZA - Troisième immobilisation depuis saisie arrière des poignets", "image_url": GIF_URLS["ushiro"]},
                {"name": "Ushiro ryotedori kote gaeshi", "description": "USHIROWAZA - Retournement du poignet depuis saisie arrière", "image_url": GIF_URLS["ushiro"]},
                {"name": "Ushiro ryokatadori ikkyo à sankyo", "description": "USHIROWAZA - Immobilisations depuis saisie arrière des épaules", "image_url": GIF_URLS["ushiro"]},
                {"name": "Ushiro katatedori kubishime koshi nage", "description": "USHIROWAZA - Projection de hanche depuis saisie poignet + étranglement", "image_url": GIF_URLS["koshi_nage"]},
                # BUKIDORI
                {"name": "Tachi dori (bokken)", "description": "BUKIDORI - Désarmement du sabre - 2-3 formes", "image_url": GIF_URLS["bokken"]},
                {"name": "Jo dori", "description": "BUKIDORI - Désarmement du bâton - 2-3 formes", "image_url": GIF_URLS["jo"]},
                {"name": "Tanken dori (tanto)", "description": "BUKIDORI - Désarmement du couteau - techniques de base", "image_url": GIF_URLS["tanto"]},
                # RANDORI
                {"name": "Jiyu waza simple", "description": "RANDORI - Technique libre simple - réponses spontanées à diverses attaques", "image_url": GIF_URLS["randori"]},
                {"name": "Ninin dori (2 attaquants)", "description": "RANDORI - Travail contre 2 attaquants - gestion de l'espace et timing", "image_url": GIF_URLS["randori"]},
                # BUKIWAZA
                {"name": "Suburi jo 1-20", "description": "BUKIWAZA - 20 exercices de base au bâton", "image_url": GIF_URLS["jo"]},
                {"name": "Kumitachi de base (1-3)", "description": "BUKIWAZA - Premiers kata au sabre avec partenaire", "image_url": GIF_URLS["bokken"]},
                {"name": "Kata jo simples", "description": "BUKIWAZA - Katas de jo : roku no jo, shi no jo", "image_url": GIF_URLS["jo"]}
            ]
        },
        # ═══════════════════════════════════════════════════════════════
        # 🥋 GRADES DAN (1er → 4e Dan)
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "1er Dan (Shodan)",
            "order": 0,
            "color": "#1f2937",  # Noir
            "techniques": [
                # ATTENDUS AIKIDO
                {"name": "Toutes saisies de base maîtrisées", "description": "ATTENDU - Katate dori, ryote dori, kata dori, muna dori, ushiro - réponses adaptées à chaque saisie", "image_url": GIF_URLS["generic"]},
                {"name": "Ikkyo à gokyo (formes maîtrisées)", "description": "ATTENDU - Les 5 immobilisations en omote et ura, contrôles précis et efficaces", "image_url": GIF_URLS["ikkyo"]},
                {"name": "Jiyu waza simple", "description": "RANDORI - Technique libre simple - réponses spontanées à diverses attaques avec continuité", "image_url": GIF_URLS["randori"]},
                {"name": "Suwari waza complet", "description": "SUWARIWAZA - Shomenuchi/yokomenuchi ikkyo à gokyo, iriminage, kotegaeshi à genoux", "image_url": GIF_URLS["suwari"]},
                {"name": "Hanmi handachi waza", "description": "HANMI HANDACHI - Katate dori : shihonage, kaitennage, kokyunage - tori à genoux", "image_url": GIF_URLS["hanmi_handachi"]},
                {"name": "Continuité et stabilité", "description": "ATTENDU - Enchaînements fluides, équilibre constant, centrage maintenu", "image_url": GIF_URLS["generic"]},
                # BUKKEN (Bokken)
                {"name": "Suburi bokken fondamentaux (5-7)", "description": "BUKIWAZA BOKKEN - 5 à 7 suburi selon la ligue, coupes précises", "image_url": GIF_URLS["bokken"]},
                {"name": "Awase bokken simples", "description": "BUKIWAZA BOKKEN - Exercices d'harmonisation de base avec partenaire", "image_url": GIF_URLS["bokken"]},
                {"name": "Kumitachi de base (1-3)", "description": "BUKIWAZA BOKKEN - 1 à 3 premiers kata au sabre avec partenaire", "image_url": GIF_URLS["bokken"]},
                {"name": "Ma-ai et coupe correcte", "description": "BUKIWAZA BOKKEN - Distance juste, trajectoire et timing de coupe", "image_url": GIF_URLS["bokken"]},
                # JO
                {"name": "Suburi jo de base", "description": "BUKIWAZA JO - Exercices fondamentaux au bâton", "image_url": GIF_URLS["jo"]},
                {"name": "Awase jo", "description": "BUKIWAZA JO - Exercices d'harmonisation au jo avec partenaire", "image_url": GIF_URLS["jo"]},
                {"name": "Kata jo simples", "description": "BUKIWAZA JO - Roku no jo, premiers kata", "image_url": GIF_URLS["jo"]},
                {"name": "Déplacements cohérents jo", "description": "BUKIWAZA JO - Unité corps/arme dans les déplacements", "image_url": GIF_URLS["jo"]}
            ]
        },
        {
            "name": "2e Dan (Nidan)",
            "order": -1,
            "color": "#1f2937",  # Noir
            "techniques": [
                # ATTENDUS AIKIDO
                {"name": "Jiyu waza fluide", "description": "RANDORI - Technique libre avec fluidité et adaptation, pas de temps mort", "image_url": GIF_URLS["randori"]},
                {"name": "Variété des attaques", "description": "ATTENDU - Réponses adaptées à toutes formes d'attaques (saisies, frappes, tsuki)", "image_url": GIF_URLS["generic"]},
                {"name": "Déplacements constants", "description": "ATTENDU - Mobilité permanente, pas de positions statiques", "image_url": GIF_URLS["deplacement"]},
                {"name": "Début randori structuré", "description": "RANDORI - Contre plusieurs attaquants, gestion de l'espace et des priorités", "image_url": GIF_URLS["randori"]},
                {"name": "Adaptation à uke", "description": "ATTENDU - Ajustement à la morphologie, au niveau et à l'énergie d'uke", "image_url": GIF_URLS["generic"]},
                # BOKKEN
                {"name": "Ensemble des suburi bokken", "description": "BUKIWAZA BOKKEN - Tous les suburi maîtrisés avec précision", "image_url": GIF_URLS["bokken"]},
                {"name": "Kumitachi jusqu'à 5", "description": "BUKIWAZA BOKKEN - Kumitachi 1 à 5 selon usage local", "image_url": GIF_URLS["bokken"]},
                {"name": "Travail de timing bokken", "description": "BUKIWAZA BOKKEN - Synchronisation et lecture du partenaire", "image_url": GIF_URLS["bokken"]},
                {"name": "Continuité attaque/réponse", "description": "BUKIWAZA BOKKEN - Enchaînements sans rupture de rythme", "image_url": GIF_URLS["bokken"]},
                # JO
                {"name": "Suburi jo complets", "description": "BUKIWAZA JO - 20 suburi maîtrisés", "image_url": GIF_URLS["jo"]},
                {"name": "Kata jo intermédiaires", "description": "BUKIWAZA JO - San jyu ichi no kata (31), kata avancés", "image_url": GIF_URLS["jo"]},
                {"name": "Awase jo en mouvement", "description": "BUKIWAZA JO - Harmonisation dynamique avec déplacements", "image_url": GIF_URLS["jo"]},
                {"name": "Relation corps/arme maîtrisée", "description": "BUKIWAZA JO - Unité totale entre taijutsu et bukiwaza", "image_url": GIF_URLS["jo"]}
            ]
        },
        {
            "name": "3e Dan (Sandan)",
            "order": -2,
            "color": "#1f2937",  # Noir
            "techniques": [
                # ATTENDUS AIKIDO
                {"name": "Jiyu waza libre", "description": "RANDORI - Technique totalement libre, expression personnelle de l'aikido", "image_url": GIF_URLS["randori"]},
                {"name": "Randori lisible", "description": "RANDORI - Contre plusieurs attaquants avec clarté et efficacité", "image_url": GIF_URLS["randori"]},
                {"name": "Réponses spontanées", "description": "ATTENDU - Pas de réflexion, action immédiate et adaptée", "image_url": GIF_URLS["generic"]},
                {"name": "Lecture immédiate de l'attaque", "description": "ATTENDU - Anticipation et perception de l'intention d'uke", "image_url": GIF_URLS["generic"]},
                {"name": "Liberté technique", "description": "ATTENDU - Au-delà des formes, principe intégré, variations personnelles", "image_url": GIF_URLS["generic"]},
                # BOKKEN
                {"name": "Kumitachi complets", "description": "BUKIWAZA BOKKEN - Tous les kumitachi avec variations (henka)", "image_url": GIF_URLS["bokken"]},
                {"name": "Fluidité sans rupture bokken", "description": "BUKIWAZA BOKKEN - Enchaînements naturels, pas de cassure", "image_url": GIF_URLS["bokken"]},
                {"name": "Intention martiale claire", "description": "BUKIWAZA BOKKEN - Zanshin, vigilance, présence martiale", "image_url": GIF_URLS["bokken"]},
                {"name": "Cohérence avec le taijutsu", "description": "BUKIWAZA BOKKEN - Même principes qu'à mains nues", "image_url": GIF_URLS["bokken"]},
                # JO
                {"name": "Kata jo avancés", "description": "BUKIWAZA JO - Tous les kata avec précision et fluidité", "image_url": GIF_URLS["jo"]},
                {"name": "Continuité et précision jo", "description": "BUKIWAZA JO - Enchaînements parfaits", "image_url": GIF_URLS["jo"]},
                {"name": "Gestion de l'espace jo", "description": "BUKIWAZA JO - Maîtrise des distances et angles", "image_url": GIF_URLS["jo"]},
                {"name": "Transposition jo/mains nues", "description": "BUKIWAZA JO - Passage naturel entre arme et taijutsu", "image_url": GIF_URLS["jo"]}
            ]
        },
        {
            "name": "4e Dan (Yondan)",
            "order": -3,
            "color": "#1f2937",  # Noir
            "techniques": [
                # ATTENDUS AIKIDO
                {"name": "Aucune restriction technique", "description": "ATTENDU - Maîtrise totale du répertoire technique, toutes attaques", "image_url": GIF_URLS["generic"]},
                {"name": "Présence et justesse", "description": "ATTENDU - Aura martiale, centrage parfait, timing impeccable", "image_url": GIF_URLS["generic"]},
                {"name": "Simplicité et efficacité", "description": "ATTENDU - Économie de mouvement, effet maximum avec minimum d'effort", "image_url": GIF_URLS["generic"]},
                {"name": "Capacité démonstrative", "description": "ATTENDU - Capable de montrer clairement sans ostentation", "image_url": GIF_URLS["generic"]},
                {"name": "Randori multiple avancé", "description": "RANDORI - Contre 4+ attaquants avec aisance (yonin dori)", "image_url": GIF_URLS["randori"]},
                # ARMES (JO & BOKKEN)
                {"name": "Maîtrise complète armes", "description": "BUKIWAZA - Jo et bokken totalement intégrés à la pratique", "image_url": GIF_URLS["bokken"]},
                {"name": "Absence de démonstration scolaire", "description": "BUKIWAZA - Au-delà des formes, expression naturelle", "image_url": GIF_URLS["bokken"]},
                {"name": "Armes intégrées naturellement", "description": "BUKIWAZA - Passage main nue/arme invisible", "image_url": GIF_URLS["jo"]},
                {"name": "Transmission implicite", "description": "ATTENDU - Capacité à transmettre par la pratique, sans mots", "image_url": GIF_URLS["generic"]}
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

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
