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
    
    # Programme officiel UFA/FAA - Nomenclature des techniques d'Aikido
    # Basé sur les documents "Les grades en Aikido" et "Nomenclature pour passage de grades"
    initial_data = [
        {
            "name": "5e kyu",
            "order": 5,
            "color": "#fbbf24",
            "techniques": [
                # TACHIWAZA - Techniques debout
                {"name": "Shomenuchi ikkyo (omote)", "description": "TACHIWAZA - Première immobilisation depuis coup de face à la tête avec le tranchant de la main - forme directe"},
                {"name": "Katatedori ikkyo (omote)", "description": "TACHIWAZA - Première immobilisation depuis prise d'un poignet correspondant à une main - forme directe"},
                {"name": "Katatedori shihonage (ura)", "description": "TACHIWAZA - Projection dans les quatre directions depuis prise du poignet - forme inversée"},
                # BUKIWAZA - Techniques avec armes
                {"name": "Suburi ken 1 à 7", "description": "BUKIWAZA - 7 exercices fondamentaux de coupes au sabre (bokken)"},
                {"name": "Roku no jo", "description": "BUKIWAZA - Kata de 6 mouvements au bâton (jo)"}
            ]
        },
        {
            "name": "4e kyu",
            "order": 4,
            "color": "#f97316",
            "techniques": [
                # TACHIWAZA
                {"name": "Shomenuchi nikyo (omote)", "description": "TACHIWAZA - Deuxième immobilisation (contrôle du poignet) depuis frappe verticale - forme directe"},
                {"name": "Katatedori nikyo (omote)", "description": "TACHIWAZA - Deuxième immobilisation depuis saisie du poignet - forme directe"},
                {"name": "Tai no henko", "description": "TACHIWAZA - Exercice fondamental de déplacement et connexion (kihon et ki no nagare)"},
                {"name": "Morotedori kokyuho", "description": "TACHIWAZA - Exercice de respiration depuis saisie d'un poignet à deux mains (katate ryote dori)"},
                # BUKIWAZA
                {"name": "Jo kata 31", "description": "BUKIWAZA - San jyu ichi no kata - Kata de 31 mouvements au bâton"}
            ]
        },
        {
            "name": "3e kyu",
            "order": 3,
            "color": "#22c55e",
            "techniques": [
                # TACHIWAZA
                {"name": "Shomenuchi sankyo (omote)", "description": "TACHIWAZA - Troisième immobilisation (torsion du poignet vers l'extérieur) depuis frappe verticale"},
                {"name": "Shomenuchi kotegaeshi (ura)", "description": "TACHIWAZA - Retournement du poignet depuis coup de face à la tête"},
                {"name": "Chudan tsuki kotegaeshi", "description": "TACHIWAZA - Retournement du poignet depuis coup de poing à l'abdomen"},
                {"name": "Ryotedori shihonage (ura)", "description": "TACHIWAZA - Projection quatre directions depuis prise des deux poignets"},
                {"name": "Yokomenuchi shihonage (ura)", "description": "TACHIWAZA - Projection quatre directions depuis coup de côté à la tête"},
                {"name": "Katatedori kaitennage (ura)", "description": "TACHIWAZA - Projection rotative depuis saisie au poignet"},
                {"name": "Shomenuchi iriminage", "description": "TACHIWAZA - Projection en entrant depuis frappe verticale à la tête"},
                # SUWARIWAZA
                {"name": "Suwariwaza kokyuho", "description": "SUWARIWAZA - Exercice de respiration à genoux depuis prise des deux poignets (ryotedori)"},
                # BUKIWAZA
                {"name": "Go no awase", "description": "BUKIWAZA - 5 exercices d'harmonisation au sabre avec partenaire"},
                {"name": "Sichi no awase", "description": "BUKIWAZA - 7 exercices d'harmonisation au sabre avec partenaire"}
            ]
        },
        {
            "name": "2e kyu",
            "order": 2,
            "color": "#3b82f6",
            "techniques": [
                # TACHIWAZA
                {"name": "Shomenuchi yonkyo (omote)", "description": "TACHIWAZA - Quatrième immobilisation (pression sur le nerf du poignet) depuis frappe verticale"},
                {"name": "Katatedori yonkyo (omote)", "description": "TACHIWAZA - Quatrième immobilisation depuis saisie au poignet"},
                {"name": "Yokomenuchi ikkyo", "description": "TACHIWAZA - Première immobilisation depuis coup de côté à la tête avec tranchant de la main"},
                {"name": "Yokomenuchi nikyo", "description": "TACHIWAZA - Deuxième immobilisation depuis frappe latérale"},
                {"name": "Yokomenuchi iriminage", "description": "TACHIWAZA - Projection en entrant depuis frappe latérale à la tête"},
                {"name": "Yokomenuchi kotegaeshi", "description": "TACHIWAZA - Retournement du poignet depuis frappe latérale"},
                # BUKIWAZA
                {"name": "Jo suburi 1 à 13", "description": "BUKIWAZA - 13 exercices de base au bâton (jo)"}
            ]
        },
        {
            "name": "1er kyu",
            "order": 1,
            "color": "#7c3aed",
            "techniques": [
                # TACHIWAZA
                {"name": "Yokomenuchi ikkyo à yonkyo", "description": "TACHIWAZA - Immobilisations 1 à 4 depuis frappe latérale (omote et ura)"},
                {"name": "Yokomenuchi gokyo", "description": "TACHIWAZA - Cinquième immobilisation (contrôle du couteau) depuis frappe latérale"},
                {"name": "Aihanmi katatedori koshinage", "description": "TACHIWAZA - Projection de hanche depuis prise du poignet opposé"},
                {"name": "Ryotedori tenchinage", "description": "TACHIWAZA - Projection ciel-terre depuis prise des deux poignets"},
                {"name": "Katatedori sumiotoshi", "description": "TACHIWAZA - Projection par le coin depuis saisie du poignet"},
                # USHIROWAZA - Techniques arrière
                {"name": "Ushiro ryotedori ikkyo", "description": "USHIROWAZA - Première immobilisation depuis saisie arrière des deux poignets"},
                {"name": "Ushiro ryotedori kotegaeshi", "description": "USHIROWAZA - Retournement du poignet depuis saisie arrière des deux poignets"},
                {"name": "Ushiro ryotedori shihonage", "description": "USHIROWAZA - Projection quatre directions depuis saisie arrière"},
                {"name": "Ushiro ryokatadori kokyunage", "description": "USHIROWAZA - Projection par la respiration depuis saisie arrière des épaules"},
                {"name": "Ushiro katatedori kubishime koshinage", "description": "USHIROWAZA - Projection de hanche depuis saisie arrière poignet et étranglement"},
                # BUKIDORI - Désarmements
                {"name": "Tachi dori", "description": "BUKIDORI - Désarmement du sabre (bokken)"},
                {"name": "Jo dori", "description": "BUKIDORI - Désarmement du bâton (jo)"},
                {"name": "Tanken dori", "description": "BUKIDORI - Désarmement du couteau (tanto)"},
                # Randori
                {"name": "Ninin dori - Jiyuwaza", "description": "RANDORI - Technique libre contre 2 attaquants"},
                # BUKIWAZA
                {"name": "Jo suburi 1 à 20", "description": "BUKIWAZA - 20 exercices de base au bâton"}
            ]
        },
        {
            "name": "1er Dan (Shodan)",
            "order": 0,
            "color": "#1f2937",
            "techniques": [
                # SUWARIWAZA - Techniques à genoux
                {"name": "Suwariwaza shomenuchi ikkyo", "description": "SUWARIWAZA - Première immobilisation à genoux depuis frappe verticale (omote/ura)"},
                {"name": "Suwariwaza shomenuchi nikyo", "description": "SUWARIWAZA - Deuxième immobilisation à genoux (omote/ura)"},
                {"name": "Suwariwaza shomenuchi sankyo", "description": "SUWARIWAZA - Troisième immobilisation à genoux (omote/ura)"},
                {"name": "Suwariwaza shomenuchi yonkyo", "description": "SUWARIWAZA - Quatrième immobilisation à genoux (omote/ura)"},
                {"name": "Suwariwaza shomenuchi gokyo", "description": "SUWARIWAZA - Cinquième immobilisation à genoux (ura)"},
                {"name": "Suwariwaza shomenuchi iriminage", "description": "SUWARIWAZA - Projection en entrant à genoux"},
                {"name": "Suwariwaza shomenuchi kotegaeshi", "description": "SUWARIWAZA - Retournement du poignet à genoux"},
                {"name": "Suwariwaza yokomenuchi ikkyo à gokyo", "description": "SUWARIWAZA - Immobilisations 1 à 5 depuis frappe latérale à genoux"},
                {"name": "Suwariwaza katadori ikkyo à yonkyo", "description": "SUWARIWAZA - Immobilisations depuis prise de l'épaule à genoux"},
                {"name": "Suwariwaza ryotedori kokyuho", "description": "SUWARIWAZA - Exercice de respiration depuis prise des deux poignets"},
                # HANMIHANDACHIWAZA - Assis contre debout
                {"name": "Hanmihandachi katatedori shihonage", "description": "HANMIHANDACHIWAZA - Projection quatre directions assis contre debout"},
                {"name": "Hanmihandachi katatedori kaitennage", "description": "HANMIHANDACHIWAZA - Projection rotative assis contre debout"},
                {"name": "Hanmihandachi katatedori kokyunage", "description": "HANMIHANDACHIWAZA - Projection respiration assis contre debout"},
                {"name": "Hanmihandachi ryotedori shihonage", "description": "HANMIHANDACHIWAZA - Projection depuis prise des deux poignets"},
                {"name": "Hanmihandachi ushiro ryokatadori kokyunage", "description": "HANMIHANDACHIWAZA - Projection depuis saisie arrière des épaules"},
                # TACHIWAZA complet
                {"name": "Tachiwaza aihanmi katatedori - toutes techniques", "description": "TACHIWAZA - Depuis prise poignet opposé : ikkyo, nikyo, sankyo, yonkyo, iriminage, kotegaeshi, shihonage, udekimenage, koshinage, sumiotoshi, kokyunage"},
                {"name": "Tachiwaza katatedori - toutes techniques", "description": "TACHIWAZA - Depuis prise poignet : ikkyo à yonkyo, iriminage, kotegaeshi, shihonage, kaitennage, sumiotoshi, hijikimeosae, udekimenage, kokyunage"},
                {"name": "Tachiwaza chudan/jodan tsuki - toutes techniques", "description": "TACHIWAZA - Depuis coup de poing : ikkyo, sankyo uchikaiten, iriminage, kotegaeshi, shihonage, kaitennage, kokyunage, udekimenage, hijikimeosae"},
                {"name": "Tachiwaza katadori menuchi - toutes techniques", "description": "TACHIWAZA - Depuis saisie épaule + frappe : ikkyo à sankyo, shihonage, udekimenage, koshinage, kotegaeshi, iriminage, kokyunage"},
                # USHIROWAZA complet
                {"name": "Ushiro ryotedori - toutes techniques", "description": "USHIROWAZA - Depuis saisie arrière 2 poignets : ikkyo à yonkyo, hijikimeosae, iriminage, kotegaeshi, shihonage, jujigarami, koshinage, kokyunage"},
                {"name": "Ushiro ryokatadori - toutes techniques", "description": "USHIROWAZA - Depuis saisie arrière épaules : ikkyo à yonkyo, aikiotoshi, kokyunage"},
                {"name": "Ushiro eridori - toutes techniques", "description": "USHIROWAZA - Depuis saisie arrière du col : ikkyo à yonkyo"},
                {"name": "Ushiro katatedori kubishime - toutes techniques", "description": "USHIROWAZA - Depuis saisie poignet + étranglement : ikkyo, sankyo, koshinage, kotegaeshi, shihonage, kokyunage"},
                # BUKIDORI
                {"name": "Tachi dori (3 formes)", "description": "BUKIDORI - 3 techniques de désarmement du sabre"},
                {"name": "Jo dori (3 formes)", "description": "BUKIDORI - 3 techniques de désarmement du bâton"},
                {"name": "Tanken dori (3 formes)", "description": "BUKIDORI - 3 techniques de désarmement du couteau"},
                # RANDORI
                {"name": "Ninin dori (kihon + ki no nagare)", "description": "RANDORI - Contre 2 attaquants en forme basique et fluide"},
                # BUKIWAZA
                {"name": "Aikiken - 7 suburi + Happo giri", "description": "BUKIWAZA - 7 coupes de base + coupe dans 8 directions"},
                {"name": "Aikiken - Migi/Hidari/Go/Sichi no awase", "description": "BUKIWAZA - Exercices d'harmonisation au sabre avec partenaire"},
                {"name": "Aikijo - 20 suburi", "description": "BUKIWAZA - 20 exercices de base au bâton"},
                {"name": "Aikijo - Roku no jo + San jyu ichi no kata", "description": "BUKIWAZA - Kata de 6 et 31 mouvements au bâton"},
                {"name": "Aikijo - 7 contrôles de base", "description": "BUKIWAZA - 7 contrôles fondamentaux au bâton"}
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
