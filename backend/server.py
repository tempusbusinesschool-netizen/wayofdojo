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
    initial_data = [
        # ═══════════════════════════════════════════════════════════════
        # 🔰 GRADES KYŪ (6e → 1er kyū)
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "6e kyu",
            "order": 6,
            "color": "#f1f5f9",  # Blanc
            "techniques": [
                # BASES FONDAMENTALES
                {"name": "Tai no henko (kihon)", "description": "BASE - Exercice fondamental de déplacement, pivotement et connexion avec le partenaire - forme basique", "image_url": "https://media.tenor.com/P22Z3iyIhQAAAAAM/aikido-master.gif"},
                {"name": "Déplacements (irimi/tenkan)", "description": "BASE - Apprentissage des déplacements fondamentaux : irimi (entrée directe) et tenkan (pivot)", "image_url": "https://media.tenor.com/P22Z3iyIhQAAAAAM/aikido-master.gif"},
                {"name": "Ukemi (chutes avant/arrière)", "description": "BASE - Apprentissage des chutes : mae ukemi (avant) et ushiro ukemi (arrière) - protéger son corps", "image_url": "https://media.tenor.com/l9bqdh9K0h0AAAAM/aikido-meme.gif"},
                # TACHIWAZA
                {"name": "Katatedori ikkyo (omote)", "description": "TACHIWAZA - Première immobilisation depuis saisie du poignet - forme directe (omote)", "image_url": "https://media.tenor.com/jE00NSdUJmAAAAAM/aikido.gif"},
                {"name": "Shomenuchi ikkyo (omote)", "description": "TACHIWAZA - Première immobilisation depuis frappe verticale à la tête - forme directe", "image_url": "https://media.tenor.com/jE00NSdUJmAAAAAM/aikido.gif"},
                # BUKIWAZA initiation
                {"name": "Tenue du bokken", "description": "BUKIWAZA - Apprentissage de la tenue correcte du sabre en bois (bokken) - position des mains et posture", "image_url": "https://media.tenor.com/k8Ok5wExDmEAAAAM/aikido.gif"},
                {"name": "Tenue du jo", "description": "BUKIWAZA - Apprentissage de la tenue et des déplacements de base avec le bâton (jo)", "image_url": "https://media.tenor.com/k8Ok5wExDmEAAAAM/aikido.gif"}
            ]
        },
        {
            "name": "5e kyu",
            "order": 5,
            "color": "#fbbf24",  # Jaune
            "techniques": [
                # TACHIWAZA
                {"name": "Tai no henko (kihon/ki no nagare)", "description": "TACHIWAZA - Exercice de connexion - formes basique (kihon) et fluide (ki no nagare)", "image_url": "https://media.tenor.com/P22Z3iyIhQAAAAAM/aikido-master.gif"},
                {"name": "Morote dori kokyu ho", "description": "TACHIWAZA - Exercice de respiration depuis saisie du poignet à deux mains - développer le kokyu", "image_url": "https://media.tenor.com/P22Z3iyIhQAAAAAM/aikido-master.gif"},
                {"name": "Katatedori ikkyo (omote/ura)", "description": "TACHIWAZA - Première immobilisation depuis saisie poignet - formes directe et inversée", "image_url": "https://media.tenor.com/jE00NSdUJmAAAAAM/aikido.gif"},
                {"name": "Shomenuchi ikkyo (omote/ura)", "description": "TACHIWAZA - Première immobilisation depuis frappe verticale - formes directe et inversée", "image_url": "https://media.tenor.com/jE00NSdUJmAAAAAM/aikido.gif"},
                {"name": "Katatedori shiho nage", "description": "TACHIWAZA - Projection dans les quatre directions depuis saisie du poignet", "image_url": "https://media.tenor.com/ura8QoKWyw8AAAAM/hiromi-matsuoka.gif"},
                # SUWARIWAZA bases
                {"name": "Suwari waza ikkyo (omote)", "description": "SUWARIWAZA - Première immobilisation à genoux (shikko) - travail des hanches", "image_url": "https://media.tenor.com/jE00NSdUJmAAAAAM/aikido.gif"},
                # BUKIWAZA
                {"name": "Suburi bokken (shomen/yokomen)", "description": "BUKIWAZA - Coupes fondamentales au sabre : shomen uchi (verticale) et yokomen uchi (diagonale)"},
                {"name": "Jo suburi simples", "description": "BUKIWAZA - Exercices de base au bâton - postures et frappes fondamentales"},
                {"name": "Distance et vigilance (ma-ai)", "description": "BUKIWAZA - Apprentissage du ma-ai : distance correcte et vigilance martiale"}
            ]
        },
        {
            "name": "4e kyu",
            "order": 4,
            "color": "#f97316",  # Orange
            "techniques": [
                # TACHIWAZA
                {"name": "Katatedori nikyo (omote/ura)", "description": "TACHIWAZA - Deuxième immobilisation (contrôle du poignet en rotation) depuis saisie - omote et ura"},
                {"name": "Shomenuchi nikyo (omote/ura)", "description": "TACHIWAZA - Deuxième immobilisation depuis frappe verticale - formes directe et inversée"},
                {"name": "Katatedori irimi nage", "description": "TACHIWAZA - Projection en entrant depuis saisie du poignet - contrôle de la tête d'uke"},
                {"name": "Shomenuchi irimi nage", "description": "TACHIWAZA - Projection en entrant depuis frappe verticale"},
                {"name": "Katatedori kote gaeshi", "description": "TACHIWAZA - Retournement du poignet depuis saisie - projection par torsion externe"},
                # SUWARIWAZA
                {"name": "Suwari waza nikyo (omote/ura)", "description": "SUWARIWAZA - Deuxième immobilisation à genoux - travail en seiza et shikko"},
                {"name": "Suwari waza kokyu ho", "description": "SUWARIWAZA - Exercice de respiration à genoux depuis ryote dori - développement du centre"},
                # BUKIWAZA
                {"name": "Suburi bokken 1-5", "description": "BUKIWAZA - 5 premiers suburi fondamentaux au sabre - coupes et postures"},
                {"name": "Déplacements jo", "description": "BUKIWAZA - Déplacements cohérents avec le jo - irimi et tenkan avec l'arme"}
            ]
        },
        {
            "name": "3e kyu",
            "order": 3,
            "color": "#22c55e",  # Vert
            "techniques": [
                # TACHIWAZA
                {"name": "Shomenuchi sankyo (omote/ura)", "description": "TACHIWAZA - Troisième immobilisation (torsion poignet extérieur) depuis frappe verticale"},
                {"name": "Katatedori sankyo (omote/ura)", "description": "TACHIWAZA - Troisième immobilisation depuis saisie du poignet - contrôle en spirale"},
                {"name": "Yokomenuchi shiho nage", "description": "TACHIWAZA - Projection quatre directions depuis frappe diagonale à la tête"},
                {"name": "Ryotedori shiho nage", "description": "TACHIWAZA - Projection quatre directions depuis saisie des deux poignets"},
                {"name": "Tsuki kote gaeshi", "description": "TACHIWAZA - Retournement du poignet depuis coup de poing (chudan ou jodan tsuki)"},
                {"name": "Shomenuchi kote gaeshi", "description": "TACHIWAZA - Retournement du poignet depuis frappe verticale"},
                {"name": "Katatedori kaiten nage", "description": "TACHIWAZA - Projection rotative depuis saisie - uchi kaiten ou soto kaiten"},
                # SUWARIWAZA
                {"name": "Suwari waza sankyo (omote/ura)", "description": "SUWARIWAZA - Troisième immobilisation à genoux"},
                {"name": "Suwari waza shomenuchi ikkyo à sankyo", "description": "SUWARIWAZA - Enchaînement des trois premières immobilisations à genoux"},
                # HANMI HANDACHI
                {"name": "Hanmi handachi katatedori shiho nage", "description": "HANMI HANDACHI - Projection quatre directions, tori à genoux contre uke debout"},
                # BUKIWAZA
                {"name": "Suburi bokken complets (5-7)", "description": "BUKIWAZA - Ensemble des suburi fondamentaux au sabre selon la ligue (5 à 7)"},
                {"name": "Awase bokken simples", "description": "BUKIWAZA - Exercices d'harmonisation au sabre avec partenaire - go no awase"},
                {"name": "Jo suburi de base", "description": "BUKIWAZA - Exercices fondamentaux au bâton - tsuki, uchikomi, kaeshi"}
            ]
        },
        {
            "name": "2e kyu",
            "order": 2,
            "color": "#3b82f6",  # Bleu
            "techniques": [
                # TACHIWAZA
                {"name": "Shomenuchi yonkyo (omote/ura)", "description": "TACHIWAZA - Quatrième immobilisation (pression point nerveux) depuis frappe verticale"},
                {"name": "Katatedori yonkyo (omote/ura)", "description": "TACHIWAZA - Quatrième immobilisation depuis saisie du poignet"},
                {"name": "Yokomenuchi ikkyo à yonkyo", "description": "TACHIWAZA - Immobilisations 1 à 4 depuis frappe diagonale - enchaînement fluide"},
                {"name": "Yokomenuchi irimi nage", "description": "TACHIWAZA - Projection en entrant depuis frappe latérale à la tête"},
                {"name": "Yokomenuchi kote gaeshi", "description": "TACHIWAZA - Retournement du poignet depuis frappe diagonale"},
                {"name": "Ushiro ryotedori ikkyo", "description": "USHIROWAZA - Première immobilisation depuis saisie arrière des deux poignets"},
                {"name": "Ushiro ryotedori shiho nage", "description": "USHIROWAZA - Projection quatre directions depuis saisie arrière"},
                # SUWARIWAZA
                {"name": "Suwari waza yonkyo", "description": "SUWARIWAZA - Quatrième immobilisation à genoux"},
                {"name": "Suwari waza yokomenuchi ikkyo à yonkyo", "description": "SUWARIWAZA - Immobilisations depuis frappe diagonale à genoux"},
                # HANMI HANDACHI
                {"name": "Hanmi handachi katatedori irimi nage", "description": "HANMI HANDACHI - Projection en entrant, tori à genoux"},
                {"name": "Hanmi handachi katatedori kaiten nage", "description": "HANMI HANDACHI - Projection rotative, tori à genoux"},
                # BUKIWAZA
                {"name": "Suburi jo 1-13", "description": "BUKIWAZA - 13 exercices de base au bâton"},
                {"name": "Awase jo simples", "description": "BUKIWAZA - Exercices d'harmonisation au jo avec partenaire"}
            ]
        },
        {
            "name": "1er kyu",
            "order": 1,
            "color": "#7c3aed",  # Violet/Marron
            "techniques": [
                # TACHIWAZA avancé
                {"name": "Yokomenuchi gokyo", "description": "TACHIWAZA - Cinquième immobilisation (contrôle du couteau) depuis frappe diagonale"},
                {"name": "Katadori menuchi ikkyo à sankyo", "description": "TACHIWAZA - Immobilisations depuis saisie épaule + frappe simultanée"},
                {"name": "Ryotedori tenchi nage", "description": "TACHIWAZA - Projection ciel-terre depuis saisie des deux poignets"},
                {"name": "Katatedori koshi nage", "description": "TACHIWAZA - Projection de hanche depuis saisie du poignet"},
                {"name": "Katatedori sumi otoshi", "description": "TACHIWAZA - Projection par le coin depuis saisie"},
                {"name": "Aihanmi katatedori kokyu nage", "description": "TACHIWAZA - Projection par la respiration depuis saisie opposée"},
                # USHIROWAZA complet
                {"name": "Ushiro ryotedori sankyo", "description": "USHIROWAZA - Troisième immobilisation depuis saisie arrière des poignets"},
                {"name": "Ushiro ryotedori kote gaeshi", "description": "USHIROWAZA - Retournement du poignet depuis saisie arrière"},
                {"name": "Ushiro ryokatadori ikkyo à sankyo", "description": "USHIROWAZA - Immobilisations depuis saisie arrière des épaules"},
                {"name": "Ushiro katatedori kubishime koshi nage", "description": "USHIROWAZA - Projection de hanche depuis saisie poignet + étranglement"},
                # BUKIDORI
                {"name": "Tachi dori (bokken)", "description": "BUKIDORI - Désarmement du sabre - 2-3 formes"},
                {"name": "Jo dori", "description": "BUKIDORI - Désarmement du bâton - 2-3 formes"},
                {"name": "Tanken dori (tanto)", "description": "BUKIDORI - Désarmement du couteau - techniques de base"},
                # RANDORI
                {"name": "Jiyu waza simple", "description": "RANDORI - Technique libre simple - réponses spontanées à diverses attaques"},
                {"name": "Ninin dori (2 attaquants)", "description": "RANDORI - Travail contre 2 attaquants - gestion de l'espace et timing"},
                # BUKIWAZA
                {"name": "Suburi jo 1-20", "description": "BUKIWAZA - 20 exercices de base au bâton"},
                {"name": "Kumitachi de base (1-3)", "description": "BUKIWAZA - Premiers kata au sabre avec partenaire"},
                {"name": "Kata jo simples", "description": "BUKIWAZA - Katas de jo : roku no jo, shi no jo"}
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
                {"name": "Toutes saisies de base maîtrisées", "description": "ATTENDU - Katate dori, ryote dori, kata dori, muna dori, ushiro - réponses adaptées à chaque saisie"},
                {"name": "Ikkyo à gokyo (formes maîtrisées)", "description": "ATTENDU - Les 5 immobilisations en omote et ura, contrôles précis et efficaces"},
                {"name": "Jiyu waza simple", "description": "RANDORI - Technique libre simple - réponses spontanées à diverses attaques avec continuité"},
                {"name": "Suwari waza complet", "description": "SUWARIWAZA - Shomenuchi/yokomenuchi ikkyo à gokyo, iriminage, kotegaeshi à genoux"},
                {"name": "Hanmi handachi waza", "description": "HANMI HANDACHI - Katate dori : shihonage, kaitennage, kokyunage - tori à genoux"},
                {"name": "Continuité et stabilité", "description": "ATTENDU - Enchaînements fluides, équilibre constant, centrage maintenu"},
                # BUKKEN (Bokken)
                {"name": "Suburi bokken fondamentaux (5-7)", "description": "BUKIWAZA BOKKEN - 5 à 7 suburi selon la ligue, coupes précises"},
                {"name": "Awase bokken simples", "description": "BUKIWAZA BOKKEN - Exercices d'harmonisation de base avec partenaire"},
                {"name": "Kumitachi de base (1-3)", "description": "BUKIWAZA BOKKEN - 1 à 3 premiers kata au sabre avec partenaire"},
                {"name": "Ma-ai et coupe correcte", "description": "BUKIWAZA BOKKEN - Distance juste, trajectoire et timing de coupe"},
                # JO
                {"name": "Suburi jo de base", "description": "BUKIWAZA JO - Exercices fondamentaux au bâton"},
                {"name": "Awase jo", "description": "BUKIWAZA JO - Exercices d'harmonisation au jo avec partenaire"},
                {"name": "Kata jo simples", "description": "BUKIWAZA JO - Roku no jo, premiers kata"},
                {"name": "Déplacements cohérents jo", "description": "BUKIWAZA JO - Unité corps/arme dans les déplacements"}
            ]
        },
        {
            "name": "2e Dan (Nidan)",
            "order": -1,
            "color": "#1f2937",  # Noir
            "techniques": [
                # ATTENDUS AIKIDO
                {"name": "Jiyu waza fluide", "description": "RANDORI - Technique libre avec fluidité et adaptation, pas de temps mort"},
                {"name": "Variété des attaques", "description": "ATTENDU - Réponses adaptées à toutes formes d'attaques (saisies, frappes, tsuki)"},
                {"name": "Déplacements constants", "description": "ATTENDU - Mobilité permanente, pas de positions statiques"},
                {"name": "Début randori structuré", "description": "RANDORI - Contre plusieurs attaquants, gestion de l'espace et des priorités"},
                {"name": "Adaptation à uke", "description": "ATTENDU - Ajustement à la morphologie, au niveau et à l'énergie d'uke"},
                # BOKKEN
                {"name": "Ensemble des suburi bokken", "description": "BUKIWAZA BOKKEN - Tous les suburi maîtrisés avec précision"},
                {"name": "Kumitachi jusqu'à 5", "description": "BUKIWAZA BOKKEN - Kumitachi 1 à 5 selon usage local"},
                {"name": "Travail de timing bokken", "description": "BUKIWAZA BOKKEN - Synchronisation et lecture du partenaire"},
                {"name": "Continuité attaque/réponse", "description": "BUKIWAZA BOKKEN - Enchaînements sans rupture de rythme"},
                # JO
                {"name": "Suburi jo complets", "description": "BUKIWAZA JO - 20 suburi maîtrisés"},
                {"name": "Kata jo intermédiaires", "description": "BUKIWAZA JO - San jyu ichi no kata (31), kata avancés"},
                {"name": "Awase jo en mouvement", "description": "BUKIWAZA JO - Harmonisation dynamique avec déplacements"},
                {"name": "Relation corps/arme maîtrisée", "description": "BUKIWAZA JO - Unité totale entre taijutsu et bukiwaza"}
            ]
        },
        {
            "name": "3e Dan (Sandan)",
            "order": -2,
            "color": "#1f2937",  # Noir
            "techniques": [
                # ATTENDUS AIKIDO
                {"name": "Jiyu waza libre", "description": "RANDORI - Technique totalement libre, expression personnelle de l'aikido"},
                {"name": "Randori lisible", "description": "RANDORI - Contre plusieurs attaquants avec clarté et efficacité"},
                {"name": "Réponses spontanées", "description": "ATTENDU - Pas de réflexion, action immédiate et adaptée"},
                {"name": "Lecture immédiate de l'attaque", "description": "ATTENDU - Anticipation et perception de l'intention d'uke"},
                {"name": "Liberté technique", "description": "ATTENDU - Au-delà des formes, principe intégré, variations personnelles"},
                # BOKKEN
                {"name": "Kumitachi complets", "description": "BUKIWAZA BOKKEN - Tous les kumitachi avec variations (henka)"},
                {"name": "Fluidité sans rupture bokken", "description": "BUKIWAZA BOKKEN - Enchaînements naturels, pas de cassure"},
                {"name": "Intention martiale claire", "description": "BUKIWAZA BOKKEN - Zanshin, vigilance, présence martiale"},
                {"name": "Cohérence avec le taijutsu", "description": "BUKIWAZA BOKKEN - Même principes qu'à mains nues"},
                # JO
                {"name": "Kata jo avancés", "description": "BUKIWAZA JO - Tous les kata avec précision et fluidité"},
                {"name": "Continuité et précision jo", "description": "BUKIWAZA JO - Enchaînements parfaits"},
                {"name": "Gestion de l'espace jo", "description": "BUKIWAZA JO - Maîtrise des distances et angles"},
                {"name": "Transposition jo/mains nues", "description": "BUKIWAZA JO - Passage naturel entre arme et taijutsu"}
            ]
        },
        {
            "name": "4e Dan (Yondan)",
            "order": -3,
            "color": "#1f2937",  # Noir
            "techniques": [
                # ATTENDUS AIKIDO
                {"name": "Aucune restriction technique", "description": "ATTENDU - Maîtrise totale du répertoire technique, toutes attaques"},
                {"name": "Présence et justesse", "description": "ATTENDU - Aura martiale, centrage parfait, timing impeccable"},
                {"name": "Simplicité et efficacité", "description": "ATTENDU - Économie de mouvement, effet maximum avec minimum d'effort"},
                {"name": "Capacité démonstrative", "description": "ATTENDU - Capable de montrer clairement sans ostentation"},
                {"name": "Randori multiple avancé", "description": "RANDORI - Contre 4+ attaquants avec aisance (yonin dori)"},
                # ARMES (JO & BOKKEN)
                {"name": "Maîtrise complète armes", "description": "BUKIWAZA - Jo et bokken totalement intégrés à la pratique"},
                {"name": "Absence de démonstration scolaire", "description": "BUKIWAZA - Au-delà des formes, expression naturelle"},
                {"name": "Armes intégrées naturellement", "description": "BUKIWAZA - Passage main nue/arme invisible"},
                {"name": "Transmission implicite", "description": "ATTENDU - Capacité à transmettre par la pratique, sans mots"}
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
