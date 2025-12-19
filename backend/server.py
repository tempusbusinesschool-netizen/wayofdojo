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
    
    # Programme officiel FAA - Données extraites du document "Les grades en Aikido"
    initial_data = [
        {
            "name": "5e kyu",
            "order": 5,
            "color": "#fbbf24",
            "techniques": [
                {"name": "Shomenuchi ikkyo (omote)", "description": "Première immobilisation depuis frappe verticale - forme omote (tachiwaza)"},
                {"name": "Katatedori ikkyo (omote)", "description": "Première immobilisation depuis saisie au poignet - forme omote (tachiwaza)"},
                {"name": "Katatedori shihonage (ura)", "description": "Projection dans les quatre directions depuis saisie au poignet - forme ura (tachiwaza)"},
                {"name": "Bukiwaza - Suburi ken 1 à 7", "description": "7 exercices de coupes au sabre (bokken)"},
                {"name": "Bukiwaza - Roku no jo", "description": "Kata de 6 mouvements au bâton (jo)"}
            ]
        },
        {
            "name": "4e kyu",
            "order": 4,
            "color": "#f97316",
            "techniques": [
                {"name": "Shomenuchi nikyo (omote)", "description": "Deuxième immobilisation depuis frappe verticale - forme omote (tachiwaza)"},
                {"name": "Katatedori nikyo (omote)", "description": "Deuxième immobilisation depuis saisie au poignet - forme omote (tachiwaza)"},
                {"name": "Tai no henko (kihon/ki no nagare)", "description": "Exercice fondamental de déplacement et connexion"},
                {"name": "Morotedori kokyuho", "description": "Exercice de respiration depuis saisie à deux mains (tachiwaza)"},
                {"name": "Bukiwaza - Jo kata 31", "description": "Kata de 31 mouvements au bâton"}
            ]
        },
        {
            "name": "3e kyu",
            "order": 3,
            "color": "#22c55e",
            "techniques": [
                {"name": "Shomenuchi sankyo (omote)", "description": "Troisième immobilisation depuis frappe verticale (tachiwaza)"},
                {"name": "Shomenuchi kotegaeshi (ura)", "description": "Retournement du poignet depuis frappe verticale (tachiwaza)"},
                {"name": "Tsuki kotegaeshi (ura)", "description": "Retournement du poignet depuis coup de poing (tachiwaza)"},
                {"name": "Ryotedori shihonage (ura)", "description": "Projection quatre directions depuis saisie des deux poignets"},
                {"name": "Yokomenuchi shihonage (ura)", "description": "Projection quatre directions depuis frappe latérale"},
                {"name": "Katatedori kaiten nage (ura)", "description": "Projection rotative depuis saisie au poignet"},
                {"name": "Shomenuchi iriminage (ura)", "description": "Projection en entrant depuis frappe verticale"},
                {"name": "Suwariwaza kokyuho", "description": "Exercice de respiration à genoux"},
                {"name": "Bukiwaza - Go no awase", "description": "5 exercices d'harmonisation au sabre"},
                {"name": "Bukiwaza - Sichi no awase", "description": "7 exercices d'harmonisation au sabre"}
            ]
        },
        {
            "name": "2e kyu",
            "order": 2,
            "color": "#3b82f6",
            "techniques": [
                {"name": "Shomenuchi yonkyo (omote)", "description": "Quatrième immobilisation depuis frappe verticale (tachiwaza)"},
                {"name": "Katatedori yonkyo (omote)", "description": "Quatrième immobilisation depuis saisie au poignet (tachiwaza)"},
                {"name": "Yokomenuchi (diverses techniques)", "description": "Techniques variées depuis frappe latérale à la tête"},
                {"name": "Bukiwaza - Jo suburi 1 à 13", "description": "13 exercices de base au bâton (jo)"}
            ]
        },
        {
            "name": "1er kyu",
            "order": 1,
            "color": "#7c3aed",
            "techniques": [
                {"name": "Yokomenuchi ikkyo à yonkyo", "description": "Immobilisations 1 à 4 depuis frappe latérale (tachiwaza)"},
                {"name": "Yokomenuchi gokyo (ura)", "description": "Cinquième immobilisation - contrôle du couteau (tachiwaza)"},
                {"name": "Shihonage (2 formes d'attaque)", "description": "Projection quatre directions depuis différentes attaques"},
                {"name": "Kotegaeshi (2 formes d'attaque)", "description": "Retournement du poignet depuis différentes attaques"},
                {"name": "Kokyunage (2 formes d'attaque)", "description": "Projection par la respiration depuis différentes attaques"},
                {"name": "Iriminage (2 formes d'attaque)", "description": "Projection en entrant depuis différentes attaques"},
                {"name": "Koshinage (2 formes d'attaque)", "description": "Projection de hanche depuis différentes attaques"},
                {"name": "Ushirowaza (2 formes d'attaque)", "description": "Techniques depuis attaques par l'arrière"},
                {"name": "Tachi dori", "description": "Désarmement du sabre"},
                {"name": "Jo dori", "description": "Désarmement du bâton"},
                {"name": "Tanken dori", "description": "Désarmement du couteau"},
                {"name": "Ninin dori - Jiyuwaza", "description": "Technique libre contre 2 attaquants"},
                {"name": "Bukiwaza - Jo suburi 1 à 20", "description": "20 exercices de base au bâton"}
            ]
        },
        {
            "name": "1er Dan (Shodan)",
            "order": 0,
            "color": "#1f2937",
            "techniques": [
                {"name": "Suwariwaza - Yokomenuchi ikkyo (omote/ura)", "description": "Première immobilisation à genoux depuis frappe latérale"},
                {"name": "Suwariwaza - Yokomenuchi nikyo (omote/ura)", "description": "Deuxième immobilisation à genoux depuis frappe latérale"},
                {"name": "Suwariwaza - Yokomenuchi sankyo (omote/ura)", "description": "Troisième immobilisation à genoux depuis frappe latérale"},
                {"name": "Suwariwaza - Yokomenuchi yonkyo (omote/ura)", "description": "Quatrième immobilisation à genoux depuis frappe latérale"},
                {"name": "Suwariwaza - Yokomenuchi gokyo (ura)", "description": "Cinquième immobilisation à genoux"},
                {"name": "Hanmi handachi waza (3 techniques/3 attaques)", "description": "Techniques assis contre debout - 3 formes différentes"},
                {"name": "Tachiwaza - Shihonage (3 attaques)", "description": "Projection quatre directions depuis 3 attaques différentes"},
                {"name": "Tachiwaza - Kotegaeshi (3 attaques)", "description": "Retournement du poignet depuis 3 attaques différentes"},
                {"name": "Tachiwaza - Iriminage (3 attaques)", "description": "Projection en entrant depuis 3 attaques différentes"},
                {"name": "Tachiwaza - Koshinage (3 attaques)", "description": "Projection de hanche depuis 3 attaques différentes"},
                {"name": "Tachiwaza - Kokyunage (3 attaques)", "description": "Projection par la respiration depuis 3 attaques différentes"},
                {"name": "Tachiwaza - Ushirowaza (3 attaques)", "description": "Techniques arrière depuis 3 attaques différentes"},
                {"name": "Ninin dori (3 attaques, kihon/ki no nagare)", "description": "Contre 2 attaquants - formes basique et fluide"},
                {"name": "Bukidori - Tankendori/Tachidori/Jodori", "description": "Désarmements couteau, sabre et bâton (3 techniques chacun)"},
                {"name": "Aikiken - 7 suburi + Happo giri", "description": "7 coupes de base + coupe dans 8 directions"},
                {"name": "Aikiken - Awase (migi/hidari/go/sichi)", "description": "Exercices d'harmonisation au sabre"},
                {"name": "Aikijo - 20 suburi + Roku no jo", "description": "20 exercices de base + kata de 6 au bâton"},
                {"name": "Aikijo - San jyu ichi no kata", "description": "Kata de 31 mouvements au bâton"},
                {"name": "Aikijo - 7 contrôles de base", "description": "7 contrôles fondamentaux au bâton"}
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
            color=kyu_data['color'],
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
