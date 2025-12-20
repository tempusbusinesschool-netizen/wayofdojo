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
        # 🔰 GRADES KYŪ (6e → 1er kyū)
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "6e kyu",
            "order": 6,
            "color": "#e2e8f0",  # Blanc/Gris clair
            "techniques": [
                # BASES FONDAMENTALES
                {
                    "name": "Tai no henko (kihon)", 
                    "description": "Exercice fondamental de déplacement, pivotement et connexion avec le partenaire - forme basique",
                    "key_points": [
                        "Garder le centre (hara) stable pendant le pivot",
                        "Main avant reste connectée au poignet d'uke",
                        "Rotation des hanches à 180° (tenkan)",
                        "Terminer aligné avec uke, épaule contre épaule"
                    ],
                    "practice_tips": [
                        "Pratiquer lentement pour sentir la connexion",
                        "Ne pas tirer avec les bras, utiliser les hanches",
                        "Respirer naturellement pendant le mouvement"
                    ]
                },
                {
                    "name": "Déplacements (irimi/tenkan)", 
                    "description": "Apprentissage des déplacements fondamentaux : irimi (entrée directe) et tenkan (pivot)",
                    "key_points": [
                        "Irimi : entrer en diagonale vers l'extérieur d'uke",
                        "Tenkan : pivoter sur le pied avant à 180°",
                        "Garder les genoux légèrement fléchis",
                        "Maintenir la posture droite (shisei)"
                    ],
                    "practice_tips": [
                        "S'entraîner seul face à un miroir",
                        "Visualiser un partenaire pendant la pratique solo",
                        "Varier la vitesse : lent puis rapide"
                    ]
                },
                {
                    "name": "Ukemi (chutes avant/arrière)", 
                    "description": "Apprentissage des chutes : mae ukemi (avant) et ushiro ukemi (arrière) - protéger son corps",
                    "key_points": [
                        "Rentrer le menton vers la poitrine",
                        "Arrondir le dos pour rouler",
                        "Frapper le tatami avec le bras pour absorber",
                        "Ne jamais poser la main à plat au sol"
                    ],
                    "practice_tips": [
                        "Commencer depuis la position accroupie",
                        "Progresser vers la position debout",
                        "Pratiquer des deux côtés également"
                    ]
                },
                {
                    "name": "Katatedori ikkyo (omote)", 
                    "description": "Première immobilisation depuis saisie du poignet - forme directe (omote)",
                    "key_points": [
                        "Contrôler le coude d'uke avec la main extérieure",
                        "Guider le bras vers le bas et l'avant",
                        "Avancer en irimi pour déséquilibrer",
                        "Immobiliser au sol : coude plié, pression sur l'épaule"
                    ],
                    "practice_tips": [
                        "Ne pas forcer avec les bras",
                        "Utiliser le poids du corps en avançant",
                        "Garder uke déséquilibré tout au long"
                    ]
                },
                {
                    "name": "Shomenuchi ikkyo (omote)", 
                    "description": "Première immobilisation depuis frappe verticale à la tête - forme directe",
                    "key_points": [
                        "Entrer au moment où uke lève le bras",
                        "Bloquer/guider le bras au niveau du coude",
                        "Couper vers le bas comme avec un sabre",
                        "Contrôle final identique à katatedori ikkyo"
                    ],
                    "practice_tips": [
                        "Timing crucial : ni trop tôt, ni trop tard",
                        "Pratiquer le timing avec attaques lentes",
                        "Sensation de 'couper' avec tout le corps"
                    ]
                },
                {
                    "name": "Tenue du bokken", 
                    "description": "Apprentissage de la tenue correcte du sabre en bois (bokken) - position des mains et posture",
                    "key_points": [
                        "Main droite près de la garde (tsuba)",
                        "Main gauche à l'extrémité de la poignée",
                        "Petit doigt et annulaire serrent, autres doigts souples",
                        "Pointe (kissaki) dirigée vers la gorge de l'adversaire"
                    ],
                    "practice_tips": [
                        "Vérifier régulièrement la position des mains",
                        "Pratiquer les suburi pour renforcer la prise",
                        "Garder les épaules détendues"
                    ]
                },
                {
                    "name": "Tenue du jo", 
                    "description": "Apprentissage de la tenue et des déplacements de base avec le bâton (jo)",
                    "key_points": [
                        "Tenue à deux mains, écartées d'environ 30cm",
                        "Mains peuvent glisser selon la technique",
                        "Jo parallèle au sol ou pointe vers le bas",
                        "Posture stable, pieds écartés largeur d'épaules"
                    ],
                    "practice_tips": [
                        "Commencer par les postures de base (kamae)",
                        "S'habituer au poids et à la longueur",
                        "Pratiquer les déplacements avec le jo"
                    ]
                }
            ]
        },
        {
            "name": "5e kyu",
            "order": 5,
            "color": "#fbbf24",  # Jaune
            "techniques": [
                {
                    "name": "Tai no henko (kihon/ki no nagare)", 
                    "description": "Exercice de connexion - formes basique (kihon) et fluide (ki no nagare)",
                    "key_points": [
                        "Kihon : uke saisit fermement, tori pivote",
                        "Ki no nagare : mouvement continu sans pause",
                        "Maintenir la connexion tout au long",
                        "Finir avec extension vers l'avant"
                    ],
                    "practice_tips": [
                        "Alterner entre les deux formes",
                        "Ki no nagare demande plus de timing",
                        "Chercher la fluidité, pas la force"
                    ]
                },
                {
                    "name": "Morote dori kokyu ho", 
                    "description": "Exercice de respiration depuis saisie du poignet à deux mains - développer le kokyu",
                    "key_points": [
                        "Uke saisit un poignet à deux mains",
                        "Lever le bras en arc de cercle",
                        "Utiliser la respiration (kokyu) pas la force musculaire",
                        "Projeter ou déséquilibrer uke vers l'arrière"
                    ],
                    "practice_tips": [
                        "Inspirer en levant, expirer en projetant",
                        "Garder le coude légèrement plié",
                        "Sentir l'énergie partir du centre (hara)"
                    ]
                },
                {
                    "name": "Katatedori ikkyo (omote/ura)", 
                    "description": "Première immobilisation depuis saisie poignet - formes directe et inversée",
                    "key_points": [
                        "Omote : entrer devant uke",
                        "Ura : pivoter derrière uke (tenkan)",
                        "Même contrôle du coude dans les deux cas",
                        "Ura : tourner uke autour de son propre axe"
                    ],
                    "practice_tips": [
                        "Maîtriser omote avant de passer à ura",
                        "En ura, ne pas reculer mais tourner",
                        "Pratiquer les deux côtés"
                    ]
                },
                {
                    "name": "Shomenuchi ikkyo (omote/ura)", 
                    "description": "Première immobilisation depuis frappe verticale - formes directe et inversée",
                    "key_points": [
                        "Intercepter la frappe au point haut",
                        "Omote : avancer en coupant vers le bas",
                        "Ura : pivoter en guidant le bras",
                        "Immobilisation identique au sol"
                    ],
                    "practice_tips": [
                        "Le timing est essentiel",
                        "Pratiquer d'abord avec attaques lentes",
                        "Visualiser une coupe de sabre"
                    ]
                },
                {
                    "name": "Katatedori shiho nage", 
                    "description": "Projection dans les quatre directions depuis saisie du poignet",
                    "key_points": [
                        "Lever le bras d'uke comme un sabre",
                        "Passer sous le bras en pivotant",
                        "Couper vers le bas en direction des 4 coins",
                        "Garder le poignet d'uke près de votre épaule"
                    ],
                    "practice_tips": [
                        "Ne pas tordre le poignet d'uke excessivement",
                        "Le mouvement est circulaire et continu",
                        "Uke doit apprendre à chuter correctement"
                    ]
                },
                {
                    "name": "Suwari waza ikkyo (omote)", 
                    "description": "Première immobilisation à genoux (shikko) - travail des hanches",
                    "key_points": [
                        "Position seiza puis shikko (déplacement à genoux)",
                        "Hanches basses et stables",
                        "Même principe qu'en tachi waza",
                        "Plus de travail des hanches car pas de jambes"
                    ],
                    "practice_tips": [
                        "Pratiquer le shikko séparément",
                        "Renforcer les genoux progressivement",
                        "Protéger les genoux avec des genouillères"
                    ]
                },
                {
                    "name": "Suburi bokken (shomen/yokomen)", 
                    "description": "Coupes fondamentales au sabre : shomen uchi (verticale) et yokomen uchi (diagonale)",
                    "key_points": [
                        "Shomen : coupe verticale du haut vers le bas",
                        "Yokomen : coupe diagonale (45°) vers le cou",
                        "Lever le sabre au-dessus de la tête",
                        "Couper avec les hanches, pas seulement les bras"
                    ],
                    "practice_tips": [
                        "Répéter chaque suburi 50-100 fois",
                        "Garder le rythme régulier",
                        "Finir chaque coupe avec extension"
                    ]
                },
                {
                    "name": "Jo suburi simples", 
                    "description": "Exercices de base au bâton - postures et frappes fondamentales",
                    "key_points": [
                        "Choku tsuki : frappe directe vers l'avant",
                        "Kaeshi tsuki : frappe en retournant le jo",
                        "Uchi komi : frappe vers le bas",
                        "Coordination des mains et des hanches"
                    ],
                    "practice_tips": [
                        "Commencer très lentement",
                        "Vérifier la trajectoire du jo",
                        "Pratiquer face à un miroir"
                    ]
                },
                {
                    "name": "Distance et vigilance (ma-ai)", 
                    "description": "Apprentissage du ma-ai : distance correcte et vigilance martiale",
                    "key_points": [
                        "Ma-ai : distance où une attaque peut toucher",
                        "Trop proche = danger, trop loin = inefficace",
                        "Vigilance constante (zanshin)",
                        "Observer les mouvements du partenaire"
                    ],
                    "practice_tips": [
                        "Pratiquer avec différents partenaires",
                        "Adapter la distance à la taille de chacun",
                        "Rester alerte même après la technique"
                    ]
                }
            ]
        },
        {
            "name": "4e kyu",
            "order": 4,
            "color": "#f97316",  # Orange
            "techniques": [
                {
                    "name": "Katatedori nikyo (omote/ura)", 
                    "description": "Deuxième immobilisation (contrôle du poignet en rotation) depuis saisie - omote et ura",
                    "key_points": [
                        "Saisir le poignet d'uke avec les deux mains",
                        "Appliquer une rotation vers l'extérieur",
                        "Coude d'uke plié à 90°",
                        "Pression sur le poignet, pas sur le bras"
                    ],
                    "practice_tips": [
                        "Contrôle précis, pas de force excessive",
                        "Uke doit signaler si trop douloureux",
                        "Pratiquer la clé lentement d'abord"
                    ]
                },
                {
                    "name": "Shomenuchi nikyo (omote/ura)", 
                    "description": "Deuxième immobilisation depuis frappe verticale - formes directe et inversée",
                    "key_points": [
                        "Intercepter comme pour ikkyo",
                        "Transition vers la saisie nikyo",
                        "Guider uke vers le bas avec la rotation",
                        "Immobilisation finale avec contrôle du poignet"
                    ],
                    "practice_tips": [
                        "La transition ikkyo→nikyo doit être fluide",
                        "Ne pas perdre le contrôle pendant la transition",
                        "Pratiquer la clé isolément d'abord"
                    ]
                },
                {
                    "name": "Katatedori irimi nage", 
                    "description": "Projection en entrant depuis saisie du poignet - contrôle de la tête d'uke",
                    "key_points": [
                        "Entrer profondément derrière uke (irimi)",
                        "Contrôler la tête/nuque d'uke avec le bras",
                        "Étendre vers l'avant et le bas pour projeter",
                        "Uke tombe vers l'arrière"
                    ],
                    "practice_tips": [
                        "L'entrée (irimi) est la clé",
                        "Ne pas pousser mais étendre",
                        "Garder le contact avec uke tout au long"
                    ]
                },
                {
                    "name": "Shomenuchi irimi nage", 
                    "description": "Projection en entrant depuis frappe verticale",
                    "key_points": [
                        "Esquiver la frappe en entrant",
                        "Se placer derrière uke",
                        "Même finale qu'avec katatedori",
                        "Timing crucial pour l'entrée"
                    ],
                    "practice_tips": [
                        "Ne pas bloquer la frappe, l'accompagner",
                        "Entrer au moment où uke est engagé",
                        "Fluidité du début à la fin"
                    ]
                },
                {
                    "name": "Katatedori kote gaeshi", 
                    "description": "Retournement du poignet depuis saisie - projection par torsion externe",
                    "key_points": [
                        "Saisir la main d'uke (pas le poignet)",
                        "Appliquer une rotation externe du poignet",
                        "Le pouce d'uke pointe vers lui-même",
                        "Projeter vers le bas et l'extérieur"
                    ],
                    "practice_tips": [
                        "Contrôle précis de la main, pas du bras",
                        "Uke doit chuter pour protéger son poignet",
                        "Pratiquer la saisie correcte"
                    ]
                },
                {
                    "name": "Suwari waza nikyo (omote/ura)", 
                    "description": "Deuxième immobilisation à genoux - travail en seiza et shikko",
                    "key_points": [
                        "Mêmes principes qu'en tachi waza",
                        "Déplacement en shikko",
                        "Hanches stables et basses",
                        "Contrôle du poignet identique"
                    ],
                    "practice_tips": [
                        "Le travail à genoux renforce les hanches",
                        "Protéger les genoux",
                        "Pratiquer le shikko régulièrement"
                    ]
                },
                {
                    "name": "Suwari waza kokyu ho", 
                    "description": "Exercice de respiration à genoux depuis ryote dori - développement du centre",
                    "key_points": [
                        "Uke saisit les deux poignets",
                        "Lever les bras en utilisant le centre",
                        "Projeter uke vers l'arrière",
                        "Exercice fondamental du kokyu"
                    ],
                    "practice_tips": [
                        "Ne pas utiliser la force des bras",
                        "Respiration coordonnée avec le mouvement",
                        "Pratiquer à chaque entraînement"
                    ]
                },
                {
                    "name": "Suburi bokken 1-5", 
                    "description": "5 premiers suburi fondamentaux au sabre - coupes et postures",
                    "key_points": [
                        "Suburi 1-2 : coupes shomen",
                        "Suburi 3-4 : coupes avec pas",
                        "Suburi 5 : coupe avec pivot",
                        "Chaque suburi a un rythme spécifique"
                    ],
                    "practice_tips": [
                        "Mémoriser la séquence exacte",
                        "Pratiquer chaque suburi séparément",
                        "Puis enchaîner les 5"
                    ]
                },
                {
                    "name": "Déplacements jo", 
                    "description": "Déplacements cohérents avec le jo - irimi et tenkan avec l'arme",
                    "key_points": [
                        "Le jo est une extension du corps",
                        "Déplacements identiques à mains nues",
                        "Garder le jo dans l'axe central",
                        "Coordination corps-arme"
                    ],
                    "practice_tips": [
                        "Pratiquer les déplacements sans technique",
                        "Puis ajouter des frappes simples",
                        "Garder les épaules détendues"
                    ]
                }
            ]
        },
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
