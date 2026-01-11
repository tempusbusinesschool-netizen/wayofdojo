from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import resend
import jwt
import bcrypt
import io
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from enum import Enum
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.enums import TA_CENTER, TA_LEFT

# Import email service
from email_service import (
    send_password_reset_email,
    send_parent_observation_notification,
    send_parent_message_notification,
    generate_reset_token,
    get_token_expiry,
    is_token_expired
)


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend configuration
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'aikido-la-riviere-secret-key-2025')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 72

# Security
security = HTTPBearer(auto_error=False)

# Logger
logger = logging.getLogger(__name__)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Super Admin password (for creating dojos)
SUPER_ADMIN_PASSWORD = os.environ.get("SUPER_ADMIN_PASSWORD", "superaikido2024")

# Default dojo
DEFAULT_DOJO = {
    "id": "aikido-la-riviere",
    "name": "Aikido La Rivière",
    "description": "Dojo principal - Club d'Aïkido La Rivière",
    "address": "",
    "city": "",
    "email": "contact@aikido-lariviere.fr",
    "admin_password": "aikido2024",
    "is_default": True,
    "created_at": "2024-01-01T00:00:00+00:00"
}


# ═══════════════════════════════════════════════════════════════════════════════════
# AUTHENTICATION HELPERS
# ═══════════════════════════════════════════════════════════════════════════════════

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        return None
    payload = decode_token(credentials.credentials)
    user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur non trouvé")
    return user

async def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentification requise")
    return await get_current_user(credentials)


# ═══════════════════════════════════════════════════════════════════════════════════
# EMAIL FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════════

async def send_confirmation_email(member: dict, is_adult: bool = False):
    """Send confirmation email to new member"""
    if not resend.api_key or resend.api_key == 're_your_api_key_here':
        logger.warning("Resend API key not configured, skipping email")
        return None
    
    member_name = f"{member.get('parent_first_name', '')} {member.get('parent_last_name', '')}"
    member_id = member.get('member_id', 'N/A')
    email = member.get('email', '')
    
    # Build children list for email
    children_html = ""
    if member.get('children') and len(member['children']) > 0:
        children_items = "".join([
            f"<li>{child.get('first_name', '')} {child.get('last_name', '')}</li>"
            for child in member['children']
        ])
        children_html = f"""
        <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <strong>Enfant(s) inscrit(s) :</strong><br>
                <ul style="margin: 5px 0 0 20px; padding: 0;">{children_items}</ul>
            </td>
        </tr>
        """
    
    adult_mention = ""
    if is_adult:
        adult_mention = """
        <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <strong>Inscription adulte :</strong> Oui
            </td>
        </tr>
        """
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e293b; padding: 20px;">
            <tr>
                <td style="text-align: center;">
                    <h1 style="color: #f59e0b; margin: 0;">Aikido La Rivière</h1>
                    <p style="color: #94a3b8; margin: 5px 0 0 0;">Club affilié FFAAA</p>
                </td>
            </tr>
        </table>
        
        <table width="100%" cellpadding="20" cellspacing="0" style="background-color: #f8fafc;">
            <tr>
                <td>
                    <h2 style="color: #1e293b; margin-top: 0;">Confirmation d'inscription</h2>
                    
                    <p>Bonjour <strong>{member_name}</strong>,</p>
                    
                    <p>Nous avons bien reçu votre demande d'inscription au club <strong>Aikido La Rivière</strong>.</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
                        <tr>
                            <td style="padding: 15px; background-color: #1e293b; color: #fff; border-radius: 8px 8px 0 0;">
                                <strong>Récapitulatif de votre inscription</strong>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 15px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                                            <strong>Numéro d'adhérent :</strong> {member_id}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                                            <strong>Nom :</strong> {member_name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                                            <strong>Email :</strong> {email}
                                        </td>
                                    </tr>
                                    {adult_mention}
                                    {children_html}
                                    <tr>
                                        <td style="padding: 10px 0;">
                                            <strong>Statut :</strong> 
                                            <span style="background-color: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px;">En attente de validation</span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    
                    <p>Votre inscription sera validée par un responsable du club dans les plus brefs délais.</p>
                    
                    <p>En attendant, n'hésitez pas à consulter notre programme d'entraînement sur notre application.</p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                    
                    <p style="color: #64748b; font-size: 14px;">
                        <strong>Aikido La Rivière</strong><br>
                        68, rue du Docteur Schweitzer<br>
                        97421 SAINT-LOUIS - RÉUNION
                    </p>
                </td>
            </tr>
        </table>
        
        <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #1e293b;">
            <tr>
                <td style="text-align: center; color: #94a3b8; font-size: 12px;">
                    © 2024 Aikido La Rivière - Club affilié FFAAA
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    params = {
        "from": SENDER_EMAIL,
        "to": [email],
        "subject": f"Confirmation d'inscription - Aikido La Rivière ({member_id})",
        "html": html_content
    }
    
    try:
        email_response = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Confirmation email sent to {email}")
        return email_response
    except Exception as e:
        logger.error(f"Failed to send confirmation email: {str(e)}")
        return None


# ═══════════════════════════════════════════════════════════════════════════════════
# SEND PROGRESSION PDF BY EMAIL
# ═══════════════════════════════════════════════════════════════════════════════════

class SendProgressionPDFRequest(BaseModel):
    email: EmailStr
    pdf_base64: str
    filename: str = "progression_aikido.pdf"


# ═══════════════════════════════════════════════════════════════════════════════════
# DOJO MODELS
# ═══════════════════════════════════════════════════════════════════════════════════

class DojoCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    email: EmailStr = Field(..., description="Email du dojo pour connexion")
    admin_password: str = Field(..., min_length=6)

class DojoUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    email: Optional[EmailStr] = None
    admin_password: Optional[str] = Field(None, min_length=6)

class DojoResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    email: Optional[str] = None
    is_default: bool = False
    members_count: int = 0
    created_at: str

class DojoLoginRequest(BaseModel):
    email: EmailStr
    password: str


# ═══════════════════════════════════════════════════════════════════════════════════
# DOJO ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════════

@api_router.get("/dojos")
async def get_all_dojos():
    """Récupérer la liste de tous les dojos"""
    dojos = await db.dojos.find({}, {"_id": 0, "admin_password": 0}).to_list(100)
    
    # Add default dojo if not exists
    if not dojos:
        # Create default dojo
        await db.dojos.insert_one(DEFAULT_DOJO)
        dojos = [DEFAULT_DOJO.copy()]
        del dojos[0]["admin_password"]
    
    # Count members for each dojo
    for dojo in dojos:
        members_count = await db.users.count_documents({"dojo_id": dojo["id"]})
        dojo["members_count"] = members_count
    
    return {"dojos": dojos}

@api_router.get("/dojos/{dojo_id}")
async def get_dojo(dojo_id: str):
    """Récupérer un dojo par son ID"""
    dojo = await db.dojos.find_one({"id": dojo_id}, {"_id": 0, "admin_password": 0})
    if not dojo:
        raise HTTPException(status_code=404, detail="Dojo non trouvé")
    
    members_count = await db.users.count_documents({"dojo_id": dojo_id})
    dojo["members_count"] = members_count
    
    return dojo

class SuperAdminAuth(BaseModel):
    super_admin_password: str

@api_router.post("/dojos")
async def create_dojo(dojo: DojoCreate, auth: SuperAdminAuth):
    """Créer un nouveau dojo (Super Admin uniquement)"""
    # Verify super admin password
    if auth.super_admin_password != SUPER_ADMIN_PASSWORD:
        raise HTTPException(status_code=403, detail="Mot de passe Super Admin incorrect")
    
    # Check if dojo name already exists
    existing = await db.dojos.find_one({"name": dojo.name})
    if existing:
        raise HTTPException(status_code=400, detail="Un dojo avec ce nom existe déjà")
    
    # Generate dojo ID from name
    dojo_id = dojo.name.lower().replace(" ", "-").replace("'", "")
    dojo_id = ''.join(c for c in dojo_id if c.isalnum() or c == '-')
    
    # Check if ID already exists
    existing_id = await db.dojos.find_one({"id": dojo_id})
    if existing_id:
        dojo_id = f"{dojo_id}-{str(uuid.uuid4())[:8]}"
    
    new_dojo = {
        "id": dojo_id,
        "name": dojo.name,
        "description": dojo.description or f"Dojo {dojo.name}",
        "address": dojo.address or "",
        "city": dojo.city or "",
        "email": dojo.email,
        "admin_password": dojo.admin_password,
        "is_default": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.dojos.insert_one(new_dojo)
    logger.info(f"New dojo created: {dojo.name} ({dojo_id})")
    
    # Create response dojo without MongoDB ObjectId and password
    response_dojo = {
        "id": new_dojo["id"],
        "name": new_dojo["name"],
        "description": new_dojo["description"],
        "address": new_dojo["address"],
        "city": new_dojo["city"],
        "email": new_dojo["email"],
        "is_default": new_dojo["is_default"],
        "created_at": new_dojo["created_at"],
        "members_count": 0
    }
    
    return {
        "success": True,
        "message": f"Dojo '{dojo.name}' créé avec succès !",
        "dojo": response_dojo
    }

@api_router.put("/dojos/{dojo_id}")
async def update_dojo(dojo_id: str, dojo: DojoUpdate, auth: SuperAdminAuth):
    """Modifier un dojo (Super Admin uniquement)"""
    if auth.super_admin_password != SUPER_ADMIN_PASSWORD:
        raise HTTPException(status_code=403, detail="Mot de passe Super Admin incorrect")
    
    existing = await db.dojos.find_one({"id": dojo_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Dojo non trouvé")
    
    update_data = {k: v for k, v in dojo.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
    
    await db.dojos.update_one({"id": dojo_id}, {"$set": update_data})
    
    return {"success": True, "message": "Dojo mis à jour"}

@api_router.delete("/dojos/{dojo_id}")
async def delete_dojo(dojo_id: str, auth: SuperAdminAuth):
    """Supprimer un dojo (Super Admin uniquement)"""
    if auth.super_admin_password != SUPER_ADMIN_PASSWORD:
        raise HTTPException(status_code=403, detail="Mot de passe Super Admin incorrect")
    
    dojo = await db.dojos.find_one({"id": dojo_id})
    if not dojo:
        raise HTTPException(status_code=404, detail="Dojo non trouvé")
    
    if dojo.get("is_default"):
        raise HTTPException(status_code=400, detail="Impossible de supprimer le dojo par défaut")
    
    # Move all users to default dojo
    await db.users.update_many(
        {"dojo_id": dojo_id},
        {"$set": {"dojo_id": "aikido-la-riviere", "dojo_name": "Aikido La Rivière"}}
    )
    
    await db.dojos.delete_one({"id": dojo_id})
    logger.info(f"Dojo deleted: {dojo_id}")
    
    return {"success": True, "message": "Dojo supprimé, les membres ont été transférés au dojo par défaut"}

# ═══════════════════════════════════════════════════════════════════════════════════
# DOJO LOGIN ENDPOINT
# ═══════════════════════════════════════════════════════════════════════════════════

@api_router.post("/dojos/login")
async def dojo_login(login_data: DojoLoginRequest):
    """Connexion à l'Espace Dojo avec email et mot de passe"""
    # Find dojo by email
    dojo = await db.dojos.find_one({"email": login_data.email.lower()})
    
    if not dojo:
        raise HTTPException(status_code=401, detail="Email non trouvé")
    
    # Verify password (plain text comparison for now, could be hashed later)
    if dojo.get("admin_password") != login_data.password:
        raise HTTPException(status_code=401, detail="Mot de passe incorrect")
    
    # Create a token for the dojo
    token = jwt.encode({
        "dojo_id": dojo["id"],
        "dojo_name": dojo["name"],
        "type": "dojo_admin",
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)
    }, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    return {
        "success": True,
        "message": f"Connexion réussie à {dojo['name']}",
        "dojo": {
            "id": dojo["id"],
            "name": dojo["name"],
            "email": dojo.get("email"),
            "city": dojo.get("city", ""),
            "description": dojo.get("description", "")
        },
        "token": token
    }

# ═══════════════════════════════════════════════════════════════════════════════════
# DOJO MEMBERS (ADHERENTS) ENDPOINTS - RGPD COMPLIANT
# ═══════════════════════════════════════════════════════════════════════════════════

class DojoMemberCreate(BaseModel):
    display_name: str = Field(..., min_length=2, max_length=100)
    use_pseudonym: bool = False
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    pseudonym: Optional[str] = None
    status: str = "active"  # active, inactive
    email: Optional[EmailStr] = None
    internal_note: Optional[str] = None
    dojo_id: str
    # Grade and progression
    belt_level: Optional[str] = "6e_kyu"
    progression_percentage: Optional[int] = 0

class DojoMemberUpdate(BaseModel):
    display_name: Optional[str] = None
    status: Optional[str] = None
    email: Optional[EmailStr] = None
    internal_note: Optional[str] = None
    belt_level: Optional[str] = None
    progression_percentage: Optional[int] = None

@api_router.get("/dojo-members")
async def get_dojo_members(dojo_id: Optional[str] = None):
    """Récupérer les adhérents d'un dojo"""
    query = {}
    if dojo_id:
        query["dojo_id"] = dojo_id
    
    members = await db.dojo_members.find(query, {"_id": 0}).to_list(500)
    return {"members": members}

@api_router.post("/dojo-members")
async def create_dojo_member(member: DojoMemberCreate):
    """Créer un nouvel adhérent (RGPD-compliant)"""
    # Verify dojo exists
    dojo = await db.dojos.find_one({"id": member.dojo_id})
    if not dojo:
        raise HTTPException(status_code=404, detail="Dojo non trouvé")
    
    new_member = {
        "id": str(uuid.uuid4()),
        "display_name": member.display_name,
        "use_pseudonym": member.use_pseudonym,
        "first_name": member.first_name,
        "last_name": member.last_name,
        "pseudonym": member.pseudonym,
        "status": member.status,
        "email": member.email,
        "internal_note": member.internal_note,
        "dojo_id": member.dojo_id,
        "belt_level": member.belt_level or "6e_kyu",
        "progression_percentage": member.progression_percentage or 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.dojo_members.insert_one(new_member)
    logger.info(f"New dojo member created: {member.display_name} for dojo {member.dojo_id}")
    
    return {"success": True, "member": {k: v for k, v in new_member.items() if k != "_id"}}

@api_router.patch("/dojo-members/{member_id}")
async def update_dojo_member(member_id: str, update: DojoMemberUpdate):
    """Modifier un adhérent"""
    existing = await db.dojo_members.find_one({"id": member_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Adhérent non trouvé")
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
    
    await db.dojo_members.update_one({"id": member_id}, {"$set": update_data})
    
    return {"success": True, "message": "Adhérent mis à jour"}

@api_router.delete("/dojo-members/{member_id}")
async def delete_dojo_member(member_id: str):
    """Supprimer un adhérent"""
    existing = await db.dojo_members.find_one({"id": member_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Adhérent non trouvé")
    
    await db.dojo_members.delete_one({"id": member_id})
    logger.info(f"Dojo member deleted: {member_id}")
    
    return {"success": True, "message": "Adhérent supprimé"}


# ═══════════════════════════════════════════════════════════════════════════════════
# ENSEIGNANT (TEACHER) SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════════

class EnseignantCreate(BaseModel):
    """Modèle pour créer un enseignant"""
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    dojo_id: str

class EnseignantLogin(BaseModel):
    """Login enseignant"""
    email: EmailStr
    password: str

class MessageCreate(BaseModel):
    """Message de l'enseignant vers un parent"""
    recipient_id: str  # ID du parent ou de l'utilisateur
    subject: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1, max_length=2000)

class ObservationCreate(BaseModel):
    """Observation sur un élève"""
    student_id: str  # ID de l'élève (user ou dojo_member)
    student_type: str = "user"  # "user" ou "dojo_member"
    content: str = Field(..., min_length=1, max_length=2000)
    category: Optional[str] = "general"  # general, technique, comportement, progression


@api_router.post("/enseignants")
async def create_enseignant(data: EnseignantCreate, dojo_password: str = None):
    """Créer un enseignant (Admin du Dojo uniquement)"""
    # Vérifier que le dojo existe
    dojo = await db.dojos.find_one({"id": data.dojo_id})
    if not dojo:
        raise HTTPException(status_code=404, detail="Dojo non trouvé")
    
    # Vérifier le mot de passe admin du dojo
    if dojo_password != dojo.get("admin_password"):
        raise HTTPException(status_code=403, detail="Mot de passe admin du dojo incorrect")
    
    # Vérifier si l'email existe déjà
    existing = await db.enseignants.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Un enseignant avec cet email existe déjà")
    
    new_enseignant = {
        "id": str(uuid.uuid4()),
        "first_name": data.first_name,
        "last_name": data.last_name,
        "email": data.email,
        "password_hash": hash_password(data.password),
        "dojo_id": data.dojo_id,
        "dojo_name": dojo.get("name"),
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.enseignants.insert_one(new_enseignant)
    logger.info(f"Nouvel enseignant créé: {data.first_name} {data.last_name} pour dojo {data.dojo_id}")
    
    return {
        "success": True, 
        "enseignant": {
            "id": new_enseignant["id"],
            "first_name": new_enseignant["first_name"],
            "last_name": new_enseignant["last_name"],
            "email": new_enseignant["email"],
            "dojo_id": new_enseignant["dojo_id"],
            "dojo_name": new_enseignant["dojo_name"]
        }
    }


@api_router.post("/enseignants/login")
async def login_enseignant(data: EnseignantLogin):
    """Connexion enseignant"""
    enseignant = await db.enseignants.find_one({"email": data.email})
    if not enseignant:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    if not verify_password(data.password, enseignant["password_hash"]):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    if not enseignant.get("is_active", True):
        raise HTTPException(status_code=403, detail="Compte enseignant désactivé")
    
    # Générer un token JWT
    token_data = {
        "id": enseignant["id"],
        "email": enseignant["email"],
        "role": "enseignant",
        "dojo_id": enseignant["dojo_id"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    token = jwt.encode(token_data, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    return {
        "success": True,
        "token": token,
        "enseignant": {
            "id": enseignant["id"],
            "first_name": enseignant["first_name"],
            "last_name": enseignant["last_name"],
            "email": enseignant["email"],
            "dojo_id": enseignant["dojo_id"],
            "dojo_name": enseignant.get("dojo_name")
        }
    }


@api_router.get("/enseignants/{dojo_id}")
async def get_dojo_enseignants(dojo_id: str):
    """Récupérer les enseignants d'un dojo"""
    enseignants = await db.enseignants.find(
        {"dojo_id": dojo_id, "is_active": True},
        {"_id": 0, "password_hash": 0}
    ).to_list(50)
    return {"enseignants": enseignants}


async def require_enseignant_auth(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Middleware pour vérifier l'authentification enseignant"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Token manquant")
    
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("role") != "enseignant":
            raise HTTPException(status_code=403, detail="Accès réservé aux enseignants")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")


# ═══════════════════════════════════════════════════════════════════════════════════
# MESSAGES (ENSEIGNANT <-> PARENTS)
# ═══════════════════════════════════════════════════════════════════════════════════

@api_router.post("/messages")
async def send_message(data: MessageCreate, enseignant: dict = Depends(require_enseignant_auth)):
    """Envoyer un message à un parent (Enseignant uniquement)"""
    # Vérifier que le destinataire existe
    recipient = await db.users.find_one({"id": data.recipient_id})
    if not recipient:
        raise HTTPException(status_code=404, detail="Destinataire non trouvé")
    
    # Récupérer les infos de l'enseignant
    enseignant_info = await db.enseignants.find_one({"id": enseignant["id"]})
    enseignant_name = f"{enseignant_info['first_name']} {enseignant_info['last_name']}" if enseignant_info else "Enseignant"
    
    new_message = {
        "id": str(uuid.uuid4()),
        "sender_id": enseignant["id"],
        "sender_type": "enseignant",
        "sender_name": enseignant_name,
        "recipient_id": data.recipient_id,
        "recipient_type": "user",
        "subject": data.subject,
        "content": data.content,
        "is_read": False,
        "dojo_id": enseignant["dojo_id"],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.messages.insert_one(new_message)
    logger.info(f"Message envoyé par enseignant {enseignant['id']} à {data.recipient_id}")
    
    # Send email notification to parent(s) if the recipient has linked parents
    try:
        # Find parents who have this user as their child
        parents = await db.parents.find(
            {"child_user_ids": data.recipient_id},
            {"_id": 0, "email": 1, "first_name": 1, "last_name": 1}
        ).to_list(10)
        
        child_name = f"{recipient.get('first_name', '')} {recipient.get('last_name', '')}".strip() or "votre enfant"
        
        for parent in parents:
            parent_name = f"{parent.get('first_name', '')} {parent.get('last_name', '')}".strip() or "Parent"
            await send_parent_message_notification(
                parent_email=parent["email"],
                parent_name=parent_name,
                child_name=child_name,
                teacher_name=enseignant_name,
                message_subject=data.subject,
                message_preview=data.content[:150]
            )
            logger.info(f"Notification message envoyée au parent {parent['email']}")
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi de notification parent: {e}")
    
    return {"success": True, "message_id": new_message["id"]}


@api_router.get("/messages/inbox")
async def get_inbox(user: dict = Depends(require_auth)):
    """Récupérer les messages reçus (pour un parent/utilisateur)"""
    messages = await db.messages.find(
        {"recipient_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return {"messages": messages}


@api_router.get("/messages/sent")
async def get_sent_messages(enseignant: dict = Depends(require_enseignant_auth)):
    """Récupérer les messages envoyés (pour un enseignant)"""
    messages = await db.messages.find(
        {"sender_id": enseignant["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return {"messages": messages}


@api_router.patch("/messages/{message_id}/read")
async def mark_message_read(message_id: str, user: dict = Depends(require_auth)):
    """Marquer un message comme lu"""
    result = await db.messages.update_one(
        {"id": message_id, "recipient_id": user["id"]},
        {"$set": {"is_read": True, "read_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Message non trouvé")
    
    return {"success": True}


# ═══════════════════════════════════════════════════════════════════════════════════
# OBSERVATIONS (ENSEIGNANT -> ÉLÈVES)
# ═══════════════════════════════════════════════════════════════════════════════════

@api_router.post("/observations")
async def create_observation(data: ObservationCreate, enseignant: dict = Depends(require_enseignant_auth)):
    """Ajouter une observation sur un élève (Enseignant uniquement)"""
    # Vérifier que l'élève existe
    if data.student_type == "user":
        student = await db.users.find_one({"id": data.student_id})
    else:
        student = await db.dojo_members.find_one({"id": data.student_id})
    
    if not student:
        raise HTTPException(status_code=404, detail="Élève non trouvé")
    
    # Récupérer les infos de l'enseignant pour le nom
    enseignant_info = await db.enseignants.find_one({"id": enseignant["id"]})
    enseignant_name = f"{enseignant_info['first_name']} {enseignant_info['last_name']}" if enseignant_info else "Enseignant"
    
    new_observation = {
        "id": str(uuid.uuid4()),
        "enseignant_id": enseignant["id"],
        "enseignant_name": enseignant_name,
        "student_id": data.student_id,
        "student_type": data.student_type,
        "student_name": student.get("display_name") or student.get("first_name") or student.get("email", "Élève"),
        "content": data.content,
        "category": data.category,
        "dojo_id": enseignant["dojo_id"],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.observations.insert_one(new_observation)
    logger.info(f"Observation créée par enseignant {enseignant['id']} pour élève {data.student_id}")
    
    # Send email notification to parent(s) if the student has linked parents
    try:
        # Find parents who have this student as their child
        parents = await db.parents.find(
            {"child_user_ids": data.student_id},
            {"_id": 0, "email": 1, "first_name": 1, "last_name": 1}
        ).to_list(10)
        
        for parent in parents:
            parent_name = f"{parent.get('first_name', '')} {parent.get('last_name', '')}".strip() or "Parent"
            await send_parent_observation_notification(
                parent_email=parent["email"],
                parent_name=parent_name,
                child_name=new_observation["student_name"],
                teacher_name=enseignant_name,
                observation_type=data.category,
                observation_content=data.content,
                observation_date=datetime.now(timezone.utc).strftime("%d/%m/%Y à %H:%M")
            )
            logger.info(f"Notification envoyée au parent {parent['email']} pour observation")
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi de notification parent: {e}")
    
    return {"success": True, "observation": {k: v for k, v in new_observation.items() if k != "_id"}}


@api_router.get("/observations/student/{student_id}")
async def get_student_observations(student_id: str, user: dict = Depends(require_auth)):
    """Récupérer les observations d'un élève (visible par le parent et l'élève lui-même)"""
    # Vérifier que l'utilisateur a le droit de voir les observations
    # (soit c'est l'élève lui-même, soit c'est le parent)
    is_self = user["id"] == student_id
    is_parent = student_id in user.get("children", [])
    
    if not is_self and not is_parent:
        # Vérifier aussi si c'est un dojo_member lié à cet utilisateur
        member = await db.dojo_members.find_one({"id": student_id})
        if not member or member.get("linked_user_id") != user["id"]:
            raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    observations = await db.observations.find(
        {"student_id": student_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return {"observations": observations}


@api_router.get("/observations/dojo/{dojo_id}")
async def get_dojo_observations(dojo_id: str, enseignant: dict = Depends(require_enseignant_auth)):
    """Récupérer toutes les observations d'un dojo (Enseignant uniquement)"""
    if enseignant["dojo_id"] != dojo_id:
        raise HTTPException(status_code=403, detail="Accès non autorisé à ce dojo")
    
    observations = await db.observations.find(
        {"dojo_id": dojo_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(500)
    
    return {"observations": observations}


@api_router.delete("/observations/{observation_id}")
async def delete_observation(observation_id: str, enseignant: dict = Depends(require_enseignant_auth)):
    """Supprimer une observation (Enseignant uniquement, ses propres observations)"""
    result = await db.observations.delete_one({
        "id": observation_id,
        "enseignant_id": enseignant["id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Observation non trouvée ou non autorisé")
    
    return {"success": True}


# ============================================
# PARENT ROLE ENDPOINTS
# ============================================

class ParentRegister(BaseModel):
    """Inscription Parent"""
    first_name: str = Field(..., min_length=2)
    last_name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: Optional[str] = None

class ParentLogin(BaseModel):
    """Connexion Parent"""
    email: EmailStr
    password: str

class LinkChildRequest(BaseModel):
    """Lier un enfant au compte parent"""
    child_email: str  # Email de l'enfant (utilisateur existant)
    # OU
    child_first_name: Optional[str] = None
    child_last_name: Optional[str] = None
    dojo_id: Optional[str] = None

def create_parent_token(parent: dict) -> str:
    """Créer un token JWT pour un parent"""
    payload = {
        "parent_id": parent["id"],
        "email": parent["email"],
        "role": "parent",
        "exp": datetime.now(timezone.utc) + timedelta(days=30)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

async def require_parent_auth(authorization: str = Header(None)):
    """Middleware d'authentification pour les parents"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token d'authentification requis")
    
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        if payload.get("role") != "parent":
            raise HTTPException(status_code=403, detail="Accès réservé aux parents")
        
        parent = await db.parents.find_one({"id": payload["parent_id"]}, {"_id": 0, "password_hash": 0})
        if not parent:
            raise HTTPException(status_code=404, detail="Parent non trouvé")
        
        return parent
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")

@api_router.post("/parents/register")
async def register_parent(data: ParentRegister):
    """Inscription d'un nouveau compte parent"""
    # Vérifier si l'email existe déjà
    existing = await db.parents.find_one({"email": data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Un compte parent avec cet email existe déjà")
    
    # Vérifier aussi dans les utilisateurs normaux
    existing_user = await db.users.find_one({"email": data.email.lower()})
    if existing_user:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé par un compte adhérent")
    
    new_parent = {
        "id": str(uuid.uuid4()),
        "first_name": data.first_name,
        "last_name": data.last_name,
        "email": data.email.lower(),
        "password_hash": hash_password(data.password),
        "phone": data.phone,
        "children": [],  # Liste des IDs des enfants liés
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.parents.insert_one(new_parent)
    
    token = create_parent_token(new_parent)
    
    logger.info(f"Nouveau parent inscrit: {data.first_name} {data.last_name}")
    
    return {
        "success": True,
        "token": token,
        "parent": {
            "id": new_parent["id"],
            "first_name": new_parent["first_name"],
            "last_name": new_parent["last_name"],
            "email": new_parent["email"],
            "children": []
        }
    }

@api_router.post("/parents/login")
async def login_parent(data: ParentLogin):
    """Connexion parent"""
    parent = await db.parents.find_one({"email": data.email.lower()})
    if not parent:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    if not verify_password(data.password, parent["password_hash"]):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    if not parent.get("is_active", True):
        raise HTTPException(status_code=403, detail="Compte désactivé")
    
    token = create_parent_token(parent)
    
    # Récupérer les informations des enfants
    children = []
    for child_id in parent.get("children", []):
        child = await db.users.find_one({"id": child_id}, {"_id": 0, "password_hash": 0})
        if child:
            children.append({
                "id": child["id"],
                "first_name": child.get("first_name", ""),
                "last_name": child.get("last_name", ""),
                "belt_level": child.get("belt_level", "6e_kyu"),
                "dojo_name": child.get("dojo_name", "")
            })
    
    return {
        "success": True,
        "token": token,
        "parent": {
            "id": parent["id"],
            "first_name": parent["first_name"],
            "last_name": parent["last_name"],
            "email": parent["email"],
            "children": children
        }
    }

@api_router.get("/parents/me")
async def get_parent_profile(parent: dict = Depends(require_parent_auth)):
    """Récupérer le profil du parent connecté"""
    # Récupérer les informations complètes des enfants
    children = []
    for child_id in parent.get("children", []):
        child = await db.users.find_one({"id": child_id}, {"_id": 0, "password_hash": 0})
        if child:
            children.append({
                "id": child["id"],
                "first_name": child.get("first_name", ""),
                "last_name": child.get("last_name", ""),
                "email": child.get("email", ""),
                "belt_level": child.get("belt_level", "6e_kyu"),
                "dojo_id": child.get("dojo_id", ""),
                "dojo_name": child.get("dojo_name", "")
            })
    
    return {
        "parent": parent,
        "children": children
    }

@api_router.post("/parents/link-child")
async def link_child_to_parent(data: LinkChildRequest, parent: dict = Depends(require_parent_auth)):
    """Lier un enfant (utilisateur existant) au compte parent"""
    
    # Rechercher l'enfant par email
    if data.child_email:
        child = await db.users.find_one({"email": data.child_email.lower()})
        if not child:
            raise HTTPException(status_code=404, detail="Aucun adhérent trouvé avec cet email")
    else:
        # Rechercher par nom dans un dojo spécifique
        if not data.child_first_name or not data.child_last_name:
            raise HTTPException(status_code=400, detail="Email ou nom/prénom requis")
        
        query = {
            "first_name": {"$regex": data.child_first_name, "$options": "i"},
            "last_name": {"$regex": data.child_last_name, "$options": "i"}
        }
        if data.dojo_id:
            query["dojo_id"] = data.dojo_id
        
        child = await db.users.find_one(query)
        if not child:
            raise HTTPException(status_code=404, detail="Aucun adhérent trouvé avec ces informations")
    
    child_id = child["id"]
    
    # Vérifier si déjà lié
    if child_id in parent.get("children", []):
        raise HTTPException(status_code=400, detail="Cet enfant est déjà lié à votre compte")
    
    # Vérifier si l'enfant n'est pas déjà lié à un autre parent
    other_parent = await db.parents.find_one({
        "id": {"$ne": parent["id"]},
        "children": child_id
    })
    if other_parent:
        raise HTTPException(status_code=400, detail="Cet adhérent est déjà lié à un autre compte parent")
    
    # Lier l'enfant
    await db.parents.update_one(
        {"id": parent["id"]},
        {"$push": {"children": child_id}}
    )
    
    # Mettre à jour l'utilisateur enfant avec la référence du parent
    await db.users.update_one(
        {"id": child_id},
        {"$set": {"parent_id": parent["id"]}}
    )
    
    logger.info(f"Enfant {child['first_name']} {child['last_name']} lié au parent {parent['first_name']} {parent['last_name']}")
    
    return {
        "success": True,
        "message": f"{child['first_name']} a été ajouté à votre compte",
        "child": {
            "id": child["id"],
            "first_name": child.get("first_name", ""),
            "last_name": child.get("last_name", ""),
            "belt_level": child.get("belt_level", "6e_kyu"),
            "dojo_name": child.get("dojo_name", "")
        }
    }

@api_router.delete("/parents/unlink-child/{child_id}")
async def unlink_child_from_parent(child_id: str, parent: dict = Depends(require_parent_auth)):
    """Délier un enfant du compte parent"""
    
    if child_id not in parent.get("children", []):
        raise HTTPException(status_code=404, detail="Cet enfant n'est pas lié à votre compte")
    
    # Retirer l'enfant de la liste
    await db.parents.update_one(
        {"id": parent["id"]},
        {"$pull": {"children": child_id}}
    )
    
    # Retirer la référence du parent chez l'enfant
    await db.users.update_one(
        {"id": child_id},
        {"$unset": {"parent_id": ""}}
    )
    
    return {"success": True, "message": "Enfant retiré de votre compte"}

@api_router.get("/parents/messages")
async def get_parent_messages(parent: dict = Depends(require_parent_auth)):
    """Récupérer tous les messages reçus par le parent"""
    
    # Messages adressés directement au parent
    messages = await db.messages.find(
        {"recipient_id": parent["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    # Compter les non-lus
    unread_count = sum(1 for m in messages if not m.get("read", False))
    
    return {
        "messages": messages,
        "unread_count": unread_count
    }

@api_router.get("/parents/observations")
async def get_parent_observations(parent: dict = Depends(require_parent_auth)):
    """Récupérer toutes les observations des enfants du parent"""
    
    children_ids = parent.get("children", [])
    if not children_ids:
        return {"observations": [], "children_data": {}}
    
    # Récupérer les observations de tous les enfants
    observations = await db.observations.find(
        {"student_id": {"$in": children_ids}},
        {"_id": 0}
    ).sort("created_at", -1).to_list(200)
    
    # Récupérer les informations des enfants
    children_data = {}
    for child_id in children_ids:
        child = await db.users.find_one({"id": child_id}, {"_id": 0, "password_hash": 0})
        if child:
            children_data[child_id] = {
                "first_name": child.get("first_name", ""),
                "last_name": child.get("last_name", ""),
                "belt_level": child.get("belt_level", "6e_kyu")
            }
    
    return {
        "observations": observations,
        "children_data": children_data
    }

@api_router.get("/parents/child/{child_id}/progress")
async def get_child_progress(child_id: str, parent: dict = Depends(require_parent_auth)):
    """Récupérer la progression d'un enfant spécifique"""
    
    if child_id not in parent.get("children", []):
        raise HTTPException(status_code=403, detail="Vous n'avez pas accès aux données de cet enfant")
    
    child = await db.users.find_one({"id": child_id}, {"_id": 0, "password_hash": 0})
    if not child:
        raise HTTPException(status_code=404, detail="Enfant non trouvé")
    
    # Récupérer les observations de l'enfant
    observations = await db.observations.find(
        {"student_id": child_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(50)
    
    # Calculer les statistiques de progression
    progression = child.get("progression", {})
    techniques_mastered = sum(1 for p in progression.values() if p.get("mastery_level", 0) >= 3)
    techniques_in_progress = sum(1 for p in progression.values() if 0 < p.get("mastery_level", 0) < 3)
    
    return {
        "child": {
            "id": child["id"],
            "first_name": child.get("first_name", ""),
            "last_name": child.get("last_name", ""),
            "belt_level": child.get("belt_level", "6e_kyu"),
            "dojo_name": child.get("dojo_name", ""),
            "created_at": child.get("created_at", "")
        },
        "observations": observations,
        "stats": {
            "techniques_mastered": techniques_mastered,
            "techniques_in_progress": techniques_in_progress,
            "total_observations": len(observations)
        }
    }

@api_router.patch("/parents/messages/{message_id}/read")
async def mark_message_as_read(message_id: str, parent: dict = Depends(require_parent_auth)):
    """Marquer un message comme lu"""
    result = await db.messages.update_one(
        {"id": message_id, "recipient_id": parent["id"]},
        {"$set": {"read": True, "read_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Message non trouvé")
    
    return {"success": True}


@api_router.post("/dojos/{dojo_id}/assign-user/{user_id}")
async def assign_user_to_dojo(dojo_id: str, user_id: str, auth: SuperAdminAuth):
    """Assigner un utilisateur à un dojo (Super Admin uniquement)"""
    if auth.super_admin_password != SUPER_ADMIN_PASSWORD:
        raise HTTPException(status_code=403, detail="Mot de passe Super Admin incorrect")
    
    dojo = await db.dojos.find_one({"id": dojo_id}, {"_id": 0})
    if not dojo:
        raise HTTPException(status_code=404, detail="Dojo non trouvé")
    
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    await db.users.update_one(
        {"id": user_id},
        {"$set": {"dojo_id": dojo_id, "dojo_name": dojo["name"]}}
    )
    
    return {"success": True, "message": f"Utilisateur assigné au dojo {dojo['name']}"}


@api_router.post("/send-progression-pdf")
async def send_progression_pdf(request: SendProgressionPDFRequest):
    """Send progression PDF by email"""
    if not resend.api_key or resend.api_key == 're_your_api_key_here':
        raise HTTPException(status_code=500, detail="Service email non configuré")
    
    import base64
    
    try:
        # Decode base64 PDF
        pdf_data = base64.b64decode(request.pdf_base64.split(',')[1] if ',' in request.pdf_base64 else request.pdf_base64)
        
        today = datetime.now().strftime("%d/%m/%Y")
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e293b; padding: 20px;">
                <tr>
                    <td style="text-align: center;">
                        <h1 style="color: #f59e0b; margin: 0;">Aikido La Rivière</h1>
                        <p style="color: #94a3b8; margin: 5px 0 0 0;">Club affilié FFAAA</p>
                    </td>
                </tr>
            </table>
            
            <table width="100%" cellpadding="20" cellspacing="0" style="background-color: #f8fafc;">
                <tr>
                    <td>
                        <h2 style="color: #1e293b; margin-top: 0;">Votre suivi de progression</h2>
                        
                        <p>Bonjour,</p>
                        
                        <p>Vous trouverez ci-joint votre <strong>suivi de progression en Aïkido</strong> généré le {today}.</p>
                        
                        <p>Ce document récapitule :</p>
                        <ul>
                            <li>Votre progression globale</li>
                            <li>Les techniques maîtrisées par grade</li>
                            <li>Le détail de vos sessions de pratique</li>
                        </ul>
                        
                        <p>Continuez votre pratique avec assiduité !</p>
                        
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                        
                        <p style="color: #64748b; font-size: 14px;">
                            <strong>Aikido La Rivière</strong><br>
                            68, rue du Docteur Schweitzer<br>
                            97421 SAINT-LOUIS - RÉUNION
                        </p>
                    </td>
                </tr>
            </table>
            
            <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #1e293b;">
                <tr>
                    <td style="text-align: center; color: #94a3b8; font-size: 12px;">
                        © humanknowledge.fr - 2025
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        params = {
            "from": SENDER_EMAIL,
            "to": [request.email],
            "subject": f"Votre progression Aïkido - {today}",
            "html": html_content,
            "attachments": [
                {
                    "filename": request.filename,
                    "content": list(pdf_data)
                }
            ]
        }
        
        email_response = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Progression PDF sent to {request.email}")
        return {"success": True, "message": f"PDF envoyé à {request.email}"}
        
    except Exception as e:
        logger.error(f"Failed to send progression PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'envoi: {str(e)}")


# Enums
class MasteryLevel(str, Enum):
    NOT_STARTED = "not_started"
    LEARNING = "learning"
    PRACTICED = "practiced"
    MASTERED = "mastered"

class MemberStatus(str, Enum):
    PENDING = "pending"  # En attente de validation
    ACTIVE = "active"    # Adhérent actif
    INACTIVE = "inactive"  # Adhérent inactif


# ═══════════════════════════════════════════════════════════════════════════════════
# USER AUTHENTICATION MODELS
# ═══════════════════════════════════════════════════════════════════════════════════

class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    created_at: str

class UserProgressionUpdate(BaseModel):
    technique_id: str
    mastery_level: str
    practice_count: Optional[int] = None


# ═══════════════════════════════════════════════════════════════════════════════════
# AIKIDO BELT SYSTEM (Real Grades - No XP)
# ═══════════════════════════════════════════════════════════════════════════════════

# Belt levels following real Aikido progression
AIKIDO_BELTS = {
    "6e_kyu": {
        "name": "Ceinture Blanche",
        "grade": "6e kyu",
        "color": "#FFFFFF",
        "emoji": "⚪",
        "order": 0,
        "symbolic_role": None,
        "message": "Bienvenue sur le chemin de l'Aïkido !"
    },
    "5e_kyu": {
        "name": "Ceinture Jaune", 
        "grade": "5e kyu",
        "color": "#FCD34D",
        "emoji": "🟡",
        "order": 1,
        "symbolic_role": {"name": "Gardien du respect", "virtue": "Respect", "intention": "Cadre (salut, soin du tatami, posture)"},
        "message": "Tu apprends les bases avec sérieux !"
    },
    "4e_kyu": {
        "name": "Ceinture Orange",
        "grade": "4e kyu", 
        "color": "#FB923C",
        "emoji": "🟠",
        "order": 2,
        "symbolic_role": {"name": "Pilier de persévérance", "virtue": "Persévérance", "intention": "Continuité et encouragement"},
        "message": "Ton engagement grandit !"
    },
    "3e_kyu": {
        "name": "Ceinture Verte",
        "grade": "3e kyu",
        "color": "#22C55E", 
        "emoji": "🟢",
        "order": 3,
        "symbolic_role": {"name": "Médiateur du calme", "virtue": "Maîtrise de soi", "intention": "Régulation de l'intensité, écoute"},
        "message": "Tu te stabilises dans ta pratique !"
    },
    "2e_kyu": {
        "name": "Ceinture Bleue",
        "grade": "2e kyu",
        "color": "#3B82F6",
        "emoji": "🔵", 
        "order": 4,
        "symbolic_role": {"name": "Soutien du dojo", "virtue": "Bienveillance", "intention": "Aide aux débutants, soutien logistique"},
        "message": "Ta maturité se confirme !"
    },
    "1er_kyu": {
        "name": "Ceinture Marron",
        "grade": "1er kyu",
        "color": "#92400E",
        "emoji": "🟤",
        "order": 5,
        "symbolic_role": {"name": "Passeur de voie", "virtue": "Transmission", "intention": "Transmettre sans imposer"},
        "message": "Tu es prêt à transmettre !"
    },
    "shodan": {
        "name": "Ceinture Noire",
        "grade": "Shodan (1er Dan)",
        "color": "#1F2937",
        "emoji": "⚫",
        "order": 6,
        "symbolic_role": None,
        "message": "Le vrai chemin commence maintenant !"
    }
}

class BeltAssignment(BaseModel):
    user_id: str
    belt_level: str  # e.g., "5e_kyu", "4e_kyu", etc.


# ═══════════════════════════════════════════════════════════════════════════════════
# VIRTUE ACTIONS SYSTEM (7 Virtues with Individual & Collective Actions)
# ═══════════════════════════════════════════════════════════════════════════════════

VIRTUE_ACTIONS = {
    "jin": {
        "name": "Bienveillance",
        "kanji": "仁",
        "romaji": "JIN",
        "emoji": "💝",
        "color": "#3B82F6",
        "individual_actions": [
            {"id": "jin_aide", "name": "Aide spontanée à un autre pratiquant", "points": 20},
            {"id": "jin_accueil", "name": "Accueil actif d'un nouveau", "points": 20},
            {"id": "jin_journal", "name": "Journal réflexif sur un acte de bienveillance", "points": 20},
        ],
        "collective_actions": [
            {"id": "jin_cycle", "name": "Participation à un cycle « dojo bienveillant »", "points": 20},
            {"id": "jin_soutien", "name": "Action collective de soutien (événement, solidarité)", "points": 20},
        ]
    },
    "gi": {
        "name": "Justice / Honneur",
        "kanji": "義",
        "romaji": "GI",
        "emoji": "⚖️",
        "color": "#8B5CF6",
        "individual_actions": [
            {"id": "gi_engagement", "name": "Engagement personnel tenu sur une période définie", "points": 20},
            {"id": "gi_reconnaissance", "name": "Reconnaissance honnête d'un manquement", "points": 20},
            {"id": "gi_temoignage", "name": "Témoignage écrit/audio sur la parole donnée", "points": 20},
        ],
        "collective_actions": [
            {"id": "gi_collectif", "name": "Engagement collectif respecté (règle, cadre)", "points": 20},
            {"id": "gi_cycle", "name": "Cycle dojo « honneur et parole »", "points": 20},
        ]
    },
    "rei": {
        "name": "Courtoisie",
        "kanji": "礼",
        "romaji": "REI",
        "emoji": "🙏",
        "color": "#FCD34D",
        "individual_actions": [
            {"id": "rei_rituels", "name": "Travail conscient des rituels et postures", "points": 20},
            {"id": "rei_journal", "name": "Journal sur l'impact de la courtoisie", "points": 20},
        ],
        "collective_actions": [
            {"id": "rei_rituel", "name": "Rituel collectif maintenu sur une période", "points": 20},
            {"id": "rei_cycle", "name": "Cycle dojo « courtoisie et respect »", "points": 20},
        ]
    },
    "chi": {
        "name": "Sagesse",
        "kanji": "智",
        "romaji": "CHI",
        "emoji": "🧘",
        "color": "#22C55E",
        "individual_actions": [
            {"id": "chi_analyse", "name": "Analyse réflexive d'une situation de tension", "points": 20},
            {"id": "chi_calme", "name": "Choix volontaire du calme dans une difficulté", "points": 20},
        ],
        "collective_actions": [
            {"id": "chi_reflexion", "name": "Temps collectif de réflexion (hors tatami)", "points": 20},
            {"id": "chi_cycle", "name": "Cycle dojo « lenteur et justesse »", "points": 20},
        ]
    },
    "shin": {
        "name": "Sincérité",
        "kanji": "誠",
        "romaji": "SHIN",
        "emoji": "💎",
        "color": "#EC4899",
        "individual_actions": [
            {"id": "shin_journal", "name": "Journal sincère sur ses motivations", "points": 20},
            {"id": "shin_limite", "name": "Reconnaissance d'une limite ou d'un doute", "points": 20},
        ],
        "collective_actions": [
            {"id": "shin_cycle", "name": "Cycle collectif « pratique authentique »", "points": 20},
            {"id": "shin_partage", "name": "Partage volontaire d'expérience", "points": 20},
        ]
    },
    "chu": {
        "name": "Loyauté",
        "kanji": "忠",
        "romaji": "CHU",
        "emoji": "🛡️",
        "color": "#F97316",
        "individual_actions": [
            {"id": "chu_representer", "name": "Engagement à représenter le dojo", "points": 20},
            {"id": "chu_gratitude", "name": "Témoignage de gratitude envers l'enseignement", "points": 20},
        ],
        "collective_actions": [
            {"id": "chu_valoriser", "name": "Action collective valorisant le dojo", "points": 20},
            {"id": "chu_cycle", "name": "Cycle dojo « identité et transmission »", "points": 20},
        ]
    },
    "ko": {
        "name": "Respect des fondements",
        "kanji": "孝",
        "romaji": "KŌ",
        "emoji": "🌳",
        "color": "#14B8A6",
        "individual_actions": [
            {"id": "ko_bases", "name": "Travail approfondi d'une base technique", "points": 20},
            {"id": "ko_journal", "name": "Journal sur le sens des fondements", "points": 20},
        ],
        "collective_actions": [
            {"id": "ko_cycle", "name": "Cycle collectif « retour aux bases »", "points": 20},
            {"id": "ko_transmission", "name": "Transmission intergénérationnelle", "points": 20},
        ]
    }
}

class VirtueActionLog(BaseModel):
    virtue_id: str  # e.g., "jin", "gi", "rei", etc.
    action_id: str  # e.g., "jin_aide", "gi_engagement", etc.
    action_type: str  # "individual" or "collective"
    note: Optional[str] = None  # Optional personal note


# ═══════════════════════════════════════════════════════════════════════════════════
# AUTHENTICATION ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════════

@api_router.post("/auth/register")
async def register(data: UserRegister):
    """Créer un nouveau compte utilisateur"""
    # Check if email already exists
    existing = await db.users.find_one({"email": data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Un compte avec cet email existe déjà")
    
    # Ensure default dojo exists
    default_dojo = await db.dojos.find_one({"id": "aikido-la-riviere"})
    if not default_dojo:
        await db.dojos.insert_one(DEFAULT_DOJO)
    
    # Create user with default belt (6e kyu - white belt) and default dojo
    user = {
        "id": str(uuid.uuid4()),
        "first_name": data.first_name,
        "last_name": data.last_name,
        "email": data.email.lower(),
        "password_hash": hash_password(data.password),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "progression": {},  # Will store technique_id -> {mastery_level, practice_count, last_practiced}
        "belt_level": "6e_kyu",  # Default: white belt (6e kyu)
        "belt_awarded_at": datetime.now(timezone.utc).isoformat(),
        "belt_awarded_by": "system",  # Initial belt is system-assigned
        "dojo_id": "aikido-la-riviere",  # Default dojo
        "dojo_name": "Aikido La Rivière"
    }
    
    await db.users.insert_one(user)
    
    # Generate token
    token = create_token(user["id"], user["email"])
    
    logger.info(f"New user registered: {user['email']} in dojo: {user['dojo_name']}")
    
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "email": user["email"],
            "dojo_id": user["dojo_id"],
            "dojo_name": user["dojo_name"]
        }
    }

@api_router.post("/auth/login")
async def login(data: UserLogin):
    """Connexion utilisateur"""
    user = await db.users.find_one({"email": data.email.lower()}, {"_id": 0})
    
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    token = create_token(user["id"], user["email"])
    
    logger.info(f"User logged in: {user['email']}")
    
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "email": user["email"]
        }
    }

@api_router.get("/auth/me")
async def get_me(user: dict = Depends(require_auth)):
    """Récupérer les informations de l'utilisateur connecté"""
    return {
        "id": user["id"],
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "email": user["email"],
        "created_at": user.get("created_at")
    }


# ═══════════════════════════════════════════════════════════════════════════════════
# PASSWORD RESET ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════════

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    user_type: str = "user"  # user, parent, enseignant

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@api_router.post("/auth/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    """Demander un lien de réinitialisation de mot de passe"""
    user = None
    user_name = "Utilisateur"
    collection_name = "users"
    
    # Find user based on type
    if data.user_type == "parent":
        user = await db.parents.find_one({"email": data.email}, {"_id": 0})
        collection_name = "parents"
    elif data.user_type == "enseignant":
        user = await db.enseignants.find_one({"email": data.email}, {"_id": 0})
        collection_name = "enseignants"
    else:
        user = await db.users.find_one({"email": data.email}, {"_id": 0})
        collection_name = "users"
    
    if not user:
        # Don't reveal if email exists for security
        return {"success": True, "message": "Si cet email existe, un lien de réinitialisation a été envoyé."}
    
    user_name = f"{user.get('first_name', '')} {user.get('last_name', '')}".strip() or "Utilisateur"
    
    # Generate reset token
    reset_token = generate_reset_token()
    token_expiry = get_token_expiry()
    
    # Store token in database
    await db.password_resets.delete_many({"email": data.email})  # Remove old tokens
    await db.password_resets.insert_one({
        "email": data.email,
        "user_type": data.user_type,
        "collection": collection_name,
        "token": reset_token,
        "expires_at": token_expiry.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Generate reset link (frontend will handle this route)
    frontend_url = os.environ.get("FRONTEND_URL", "https://dojo-tracker-2.preview.emergentagent.com")
    reset_link = f"{frontend_url}?reset_token={reset_token}&email={data.email}"
    
    # Send email
    await send_password_reset_email(
        to_email=data.email,
        user_name=user_name,
        reset_link=reset_link
    )
    
    logger.info(f"Password reset email sent to {data.email}")
    return {"success": True, "message": "Si cet email existe, un lien de réinitialisation a été envoyé."}


@api_router.post("/auth/reset-password")
async def reset_password(data: ResetPasswordRequest):
    """Réinitialiser le mot de passe avec un token"""
    # Find reset token
    reset_record = await db.password_resets.find_one({"token": data.token}, {"_id": 0})
    
    if not reset_record:
        raise HTTPException(status_code=400, detail="Token invalide ou expiré")
    
    # Check if token is expired
    if is_token_expired(reset_record["expires_at"]):
        await db.password_resets.delete_one({"token": data.token})
        raise HTTPException(status_code=400, detail="Token expiré. Veuillez refaire une demande.")
    
    # Validate password
    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="Le mot de passe doit contenir au moins 6 caractères")
    
    # Hash new password
    new_hash = hash_password(data.new_password)
    
    # Update password in the appropriate collection
    collection = reset_record["collection"]
    if collection == "parents":
        await db.parents.update_one(
            {"email": reset_record["email"]},
            {"$set": {"password_hash": new_hash}}
        )
    elif collection == "enseignants":
        await db.enseignants.update_one(
            {"email": reset_record["email"]},
            {"$set": {"password_hash": new_hash}}
        )
    else:
        await db.users.update_one(
            {"email": reset_record["email"]},
            {"$set": {"password_hash": new_hash}}
        )
    
    # Delete used token
    await db.password_resets.delete_one({"token": data.token})
    
    logger.info(f"Password reset completed for {reset_record['email']}")
    return {"success": True, "message": "Mot de passe réinitialisé avec succès"}


@api_router.get("/auth/verify-reset-token/{token}")
async def verify_reset_token(token: str):
    """Vérifier si un token de réinitialisation est valide"""
    reset_record = await db.password_resets.find_one({"token": token}, {"_id": 0})
    
    if not reset_record:
        return {"valid": False, "message": "Token invalide"}
    
    if is_token_expired(reset_record["expires_at"]):
        return {"valid": False, "message": "Token expiré"}
    
    return {"valid": True, "email": reset_record["email"]}


@api_router.get("/users")
async def get_users(dojo_id: Optional[str] = None):
    """Récupérer la liste des utilisateurs (pour les enseignants)"""
    query = {}
    if dojo_id:
        query["dojo_id"] = dojo_id
    
    users = await db.users.find(query, {"_id": 0, "password_hash": 0}).to_list(500)
    return {"users": users}


@api_router.put("/auth/progression/{technique_id}")
async def update_user_progression(technique_id: str, data: UserProgressionUpdate, user: dict = Depends(require_auth)):
    """Mettre à jour la progression d'un utilisateur pour une technique"""
    progression_key = f"progression.{technique_id}"
    
    update_data = {
        f"{progression_key}.mastery_level": data.mastery_level,
        f"{progression_key}.last_updated": datetime.now(timezone.utc).isoformat()
    }
    
    if data.practice_count is not None:
        update_data[f"{progression_key}.practice_count"] = data.practice_count
    
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": update_data}
    )
    
    return {"success": True}

@api_router.post("/auth/progression/{technique_id}/practice")
async def add_practice_session(technique_id: str, user: dict = Depends(require_auth)):
    """Ajouter une session de pratique pour une technique"""
    progression_key = f"progression.{technique_id}"
    
    await db.users.update_one(
        {"id": user["id"]},
        {
            "$inc": {f"{progression_key}.practice_count": 1},
            "$set": {f"{progression_key}.last_practiced": datetime.now(timezone.utc).isoformat()}
        }
    )
    
    return {"success": True}

@api_router.get("/auth/progression")
async def get_user_progression(user: dict = Depends(require_auth)):
    """Récupérer la progression complète de l'utilisateur"""
    return user.get("progression", {})


# ═══════════════════════════════════════════════════════════════════════════════════
# VIRTUE ACTIONS ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════════

@api_router.get("/virtues")
async def get_virtue_actions():
    """Récupérer le référentiel des vertus et leurs actions"""
    return VIRTUE_ACTIONS

@api_router.get("/auth/virtue-actions")
async def get_user_virtue_actions(user: dict = Depends(require_auth)):
    """Récupérer les actions de vertu de l'utilisateur"""
    virtue_actions = user.get("virtue_actions", [])
    
    # Calculate totals per virtue
    virtue_totals = {}
    for virtue_id in VIRTUE_ACTIONS.keys():
        virtue_totals[virtue_id] = {
            "individual_points": 0,
            "collective_points": 0,
            "total_points": 0,
            "action_count": 0
        }
    
    for action in virtue_actions:
        vid = action.get("virtue_id")
        if vid in virtue_totals:
            points = action.get("points", 0)
            if action.get("action_type") == "individual":
                virtue_totals[vid]["individual_points"] += points
            else:
                virtue_totals[vid]["collective_points"] += points
            virtue_totals[vid]["total_points"] += points
            virtue_totals[vid]["action_count"] += 1
    
    return {
        "actions": virtue_actions,
        "totals": virtue_totals,
        "total_pv": sum(v["individual_points"] for v in virtue_totals.values()),
        "total_pc": sum(v["collective_points"] for v in virtue_totals.values()),
        "total_points": sum(v["total_points"] for v in virtue_totals.values())
    }

@api_router.post("/auth/virtue-actions")
async def log_virtue_action(data: VirtueActionLog, user: dict = Depends(require_auth)):
    """Enregistrer une action de vertu pour l'utilisateur (max 1 fois par mois par action)"""
    # Validate virtue exists
    if data.virtue_id not in VIRTUE_ACTIONS:
        raise HTTPException(status_code=400, detail=f"Vertu invalide: {data.virtue_id}")
    
    virtue = VIRTUE_ACTIONS[data.virtue_id]
    
    # Find the action and get points
    action_list = virtue["individual_actions"] if data.action_type == "individual" else virtue["collective_actions"]
    action = next((a for a in action_list if a["id"] == data.action_id), None)
    
    if not action:
        raise HTTPException(status_code=400, detail=f"Action invalide: {data.action_id}")
    
    # Check if action was already logged this month (limit: 1 per month per action)
    now = datetime.now(timezone.utc)
    current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    user_actions = user.get("virtue_actions", [])
    for logged_action in user_actions:
        if logged_action.get("action_id") == data.action_id:
            logged_at_str = logged_action.get("logged_at", "")
            try:
                logged_at = datetime.fromisoformat(logged_at_str.replace('Z', '+00:00'))
                if logged_at >= current_month_start:
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Tu as déjà validé cette action ce mois-ci ! Reviens le mois prochain 🗓️"
                    )
            except (ValueError, TypeError):
                continue
    
    # Create action log entry
    action_entry = {
        "id": str(uuid.uuid4()),
        "virtue_id": data.virtue_id,
        "action_id": data.action_id,
        "action_type": data.action_type,
        "action_name": action["name"],
        "points": action["points"],
        "note": data.note,
        "logged_at": now.isoformat()
    }
    
    # Update user's virtue actions
    await db.users.update_one(
        {"id": user["id"]},
        {"$push": {"virtue_actions": action_entry}}
    )
    
    logger.info(f"User {user['id']} logged virtue action: {data.virtue_id}/{data.action_id} (+{action['points']} pts)")
    
    return {
        "success": True,
        "message": f"+{action['points']} points pour {virtue['name']} !",
        "action": action_entry
    }


# ═══════════════════════════════════════════════════════════════════════════════════
# BELT SYSTEM ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════════

@api_router.get("/belts")
async def get_belt_levels():
    """Récupérer le référentiel des ceintures Aïkido"""
    return AIKIDO_BELTS

@api_router.get("/auth/belt")
async def get_user_belt(user: dict = Depends(require_auth)):
    """Récupérer la ceinture actuelle de l'utilisateur"""
    belt_level = user.get("belt_level", "6e_kyu")
    belt_info = AIKIDO_BELTS.get(belt_level, AIKIDO_BELTS["6e_kyu"])
    return {
        "belt_level": belt_level,
        "belt_info": belt_info,
        "awarded_at": user.get("belt_awarded_at"),
        "awarded_by": user.get("belt_awarded_by")
    }

@api_router.post("/admin/assign-belt")
async def assign_belt(data: BeltAssignment):
    """Attribuer une ceinture à un utilisateur (Admin/Enseignant seulement)"""
    # Validate belt level exists
    if data.belt_level not in AIKIDO_BELTS:
        raise HTTPException(status_code=400, detail=f"Niveau de ceinture invalide: {data.belt_level}")
    
    # Find the user
    user = await db.users.find_one({"id": data.user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    # Update belt level
    await db.users.update_one(
        {"id": data.user_id},
        {
            "$set": {
                "belt_level": data.belt_level,
                "belt_awarded_at": datetime.now(timezone.utc).isoformat(),
                "belt_awarded_by": "admin"
            }
        }
    )
    
    belt_info = AIKIDO_BELTS[data.belt_level]
    logger.info(f"Belt {data.belt_level} assigned to user {data.user_id}")
    
    return {
        "success": True,
        "message": f"Ceinture {belt_info['name']} attribuée avec succès",
        "belt_info": belt_info
    }

class UserBeltUpdate(BaseModel):
    belt_level: str

@api_router.put("/auth/belt")
async def update_user_belt(data: UserBeltUpdate, user: dict = Depends(require_auth)):
    """Permet à l'utilisateur de mettre à jour sa propre ceinture (auto-déclaration)"""
    # Validate belt level exists
    if data.belt_level not in AIKIDO_BELTS:
        raise HTTPException(status_code=400, detail=f"Niveau de ceinture invalide: {data.belt_level}")
    
    # Update user's belt level
    await db.users.update_one(
        {"id": user["id"]},
        {
            "$set": {
                "belt_level": data.belt_level,
                "belt_awarded_at": datetime.now(timezone.utc).isoformat(),
                "belt_awarded_by": "self"  # Auto-déclaration
            }
        }
    )
    
    belt_info = AIKIDO_BELTS[data.belt_level]
    logger.info(f"User {user['id']} updated their belt to {data.belt_level}")
    
    return {
        "success": True,
        "message": f"Ceinture {belt_info['name']} sélectionnée !",
        "belt_level": data.belt_level,
        "belt_info": belt_info
    }


# ═══════════════════════════════════════════════════════════════════════════════════
# SYMBOLIC ROLE ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════════

class SymbolicRoleActivation(BaseModel):
    activate: bool = True  # True to activate, False to deactivate

@api_router.put("/auth/symbolic-role")
async def toggle_symbolic_role(data: SymbolicRoleActivation, user: dict = Depends(require_auth)):
    """Activer ou désactiver le rôle symbolique de l'utilisateur"""
    belt_level = user.get("belt_level", "6e_kyu")
    belt_info = AIKIDO_BELTS.get(belt_level)
    
    if not belt_info:
        raise HTTPException(status_code=400, detail="Niveau de ceinture invalide")
    
    symbolic_role = belt_info.get("symbolic_role")
    
    if data.activate and not symbolic_role:
        raise HTTPException(
            status_code=400, 
            detail="Aucun rôle symbolique disponible pour ta ceinture actuelle. Continue ton chemin ! 🌱"
        )
    
    # Update user's active symbolic role
    if data.activate:
        await db.users.update_one(
            {"id": user["id"]},
            {
                "$set": {
                    "active_symbolic_role": {
                        "name": symbolic_role["name"],
                        "virtue": symbolic_role["virtue"],
                        "intention": symbolic_role["intention"],
                        "activated_at": datetime.now(timezone.utc).isoformat(),
                        "belt_level": belt_level
                    }
                }
            }
        )
        logger.info(f"User {user['id']} activated symbolic role: {symbolic_role['name']}")
        return {
            "success": True,
            "message": f"🎭 Tu es maintenant {symbolic_role['name']} !",
            "role": symbolic_role
        }
    else:
        await db.users.update_one(
            {"id": user["id"]},
            {"$unset": {"active_symbolic_role": ""}}
        )
        logger.info(f"User {user['id']} deactivated their symbolic role")
        return {
            "success": True,
            "message": "Rôle symbolique désactivé",
            "role": None
        }

@api_router.get("/auth/symbolic-role")
async def get_user_symbolic_role(user: dict = Depends(require_auth)):
    """Récupérer le rôle symbolique actif de l'utilisateur"""
    active_role = user.get("active_symbolic_role")
    belt_level = user.get("belt_level", "6e_kyu")
    belt_info = AIKIDO_BELTS.get(belt_level, AIKIDO_BELTS["6e_kyu"])
    available_role = belt_info.get("symbolic_role")
    
    return {
        "active_role": active_role,
        "available_role": available_role,
        "belt_level": belt_level,
        "can_activate": available_role is not None and active_role is None
    }


# ═══════════════════════════════════════════════════════════════════════════════════
# PARCOURS / TIMELINE ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════════

@api_router.get("/auth/timeline")
async def get_user_timeline(user: dict = Depends(require_auth)):
    """Récupérer le parcours chronologique de l'utilisateur"""
    events = []
    
    # 1. Account creation event
    created_at = user.get("created_at")
    if created_at:
        events.append({
            "type": "account_created",
            "icon": "🌟",
            "title": "Début du parcours",
            "description": "Bienvenue sur le chemin de l'Aïkido !",
            "date": created_at,
            "color": "amber"
        })
    
    # 2. Belt changes
    belt_level = user.get("belt_level", "6e_kyu")
    belt_awarded_at = user.get("belt_awarded_at")
    if belt_level != "6e_kyu" and belt_awarded_at:
        belt_info = AIKIDO_BELTS.get(belt_level, {})
        events.append({
            "type": "belt_change",
            "icon": belt_info.get("emoji", "🥋"),
            "title": f"Ceinture obtenue : {belt_info.get('name', belt_level)}",
            "description": f"Grade : {belt_info.get('grade', '')}",
            "date": belt_awarded_at,
            "color": "yellow"
        })
    
    # 3. Symbolic role activation
    active_role = user.get("active_symbolic_role")
    if active_role and active_role.get("activated_at"):
        events.append({
            "type": "role_activated",
            "icon": "🎭",
            "title": f"Rôle activé : {active_role.get('name', '')}",
            "description": f"Vertu : {active_role.get('virtue', '')}",
            "date": active_role.get("activated_at"),
            "color": "purple"
        })
    
    # 4. Virtue actions logged
    virtue_actions = user.get("virtue_actions", [])
    for action in virtue_actions:
        virtue_id = action.get("virtue_id", "")
        virtue_info = VIRTUE_ACTIONS.get(virtue_id, {})
        events.append({
            "type": "virtue_action",
            "icon": virtue_info.get("emoji", "🎯"),
            "title": f"Action de vertu : {action.get('action_name', '')}",
            "description": f"+{action.get('points', 0)} points ({virtue_info.get('name', '')})",
            "date": action.get("logged_at"),
            "color": "indigo"
        })
    
    # 5. Technique progression (mastered techniques)
    progression = user.get("progression", [])
    for prog in progression:
        if prog.get("status") == "mastered":
            events.append({
                "type": "technique_mastered",
                "icon": "🏆",
                "title": f"Technique maîtrisée",
                "description": prog.get("technique_name", prog.get("technique_id", "")),
                "date": prog.get("updated_at", prog.get("started_at")),
                "color": "emerald"
            })
        elif prog.get("status") == "practiced":
            events.append({
                "type": "technique_practiced",
                "icon": "🎯",
                "title": f"Technique pratiquée",
                "description": prog.get("technique_name", prog.get("technique_id", "")),
                "date": prog.get("updated_at", prog.get("started_at")),
                "color": "blue"
            })
    
    # Sort events by date (most recent first)
    def parse_date(event):
        date_str = event.get("date")
        if not date_str:
            return datetime.min
        try:
            return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        except:
            return datetime.min
    
    events.sort(key=parse_date, reverse=True)
    
    return {
        "events": events,
        "total_events": len(events),
        "user_name": f"{user.get('first_name', '')} {user.get('last_name', '')}".strip()
    }


# ═══════════════════════════════════════════════════════════════════════════════════
# JOURNAL PRIVÉ ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════════

class JournalEntry(BaseModel):
    content: str = Field(..., min_length=1, max_length=5000)
    mood: Optional[str] = None  # emoji or mood indicator
    tags: Optional[List[str]] = None

class JournalEntryUpdate(BaseModel):
    content: Optional[str] = Field(None, min_length=1, max_length=5000)
    mood: Optional[str] = None
    tags: Optional[List[str]] = None

@api_router.get("/auth/journal")
async def get_journal_entries(user: dict = Depends(require_auth), limit: int = 50):
    """Récupérer les entrées du journal de l'utilisateur"""
    journal = user.get("journal", [])
    
    # Sort by date (most recent first)
    sorted_journal = sorted(
        journal, 
        key=lambda x: x.get("created_at", ""), 
        reverse=True
    )[:limit]
    
    return {
        "entries": sorted_journal,
        "total_entries": len(journal)
    }

@api_router.post("/auth/journal")
async def create_journal_entry(data: JournalEntry, user: dict = Depends(require_auth)):
    """Créer une nouvelle entrée dans le journal"""
    entry = {
        "id": str(uuid.uuid4()),
        "content": data.content,
        "mood": data.mood,
        "tags": data.tags or [],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": None
    }
    
    await db.users.update_one(
        {"id": user["id"]},
        {"$push": {"journal": entry}}
    )
    
    logger.info(f"User {user['id']} created journal entry")
    
    return {
        "success": True,
        "message": "Réflexion enregistrée 📝",
        "entry": entry
    }

@api_router.put("/auth/journal/{entry_id}")
async def update_journal_entry(entry_id: str, data: JournalEntryUpdate, user: dict = Depends(require_auth)):
    """Modifier une entrée du journal"""
    journal = user.get("journal", [])
    entry_index = next((i for i, e in enumerate(journal) if e.get("id") == entry_id), None)
    
    if entry_index is None:
        raise HTTPException(status_code=404, detail="Entrée non trouvée")
    
    # Update the entry
    update_fields = {}
    if data.content is not None:
        update_fields[f"journal.{entry_index}.content"] = data.content
    if data.mood is not None:
        update_fields[f"journal.{entry_index}.mood"] = data.mood
    if data.tags is not None:
        update_fields[f"journal.{entry_index}.tags"] = data.tags
    update_fields[f"journal.{entry_index}.updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": update_fields}
    )
    
    return {
        "success": True,
        "message": "Réflexion mise à jour"
    }

@api_router.delete("/auth/journal/{entry_id}")
async def delete_journal_entry(entry_id: str, user: dict = Depends(require_auth)):
    """Supprimer une entrée du journal"""
    await db.users.update_one(
        {"id": user["id"]},
        {"$pull": {"journal": {"id": entry_id}}}
    )
    
    logger.info(f"User {user['id']} deleted journal entry {entry_id}")
    
    return {
        "success": True,
        "message": "Réflexion supprimée"
    }


# ═══════════════════════════════════════════════════════════════════════════════════
# EXPORT PDF ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════════

@api_router.get("/auth/export-pdf/status")
async def get_export_pdf_status(user: dict = Depends(require_auth)):
    """Vérifier si l'utilisateur peut exporter son PDF (limite 6 mois)"""
    last_export = user.get("last_pdf_export")
    
    if not last_export:
        return {
            "can_export": True,
            "last_export": None,
            "next_available": None,
            "message": "Tu peux exporter ton parcours en PDF !"
        }
    
    try:
        last_export_date = datetime.fromisoformat(last_export.replace('Z', '+00:00'))
        next_available = last_export_date + timedelta(days=180)  # 6 months
        now = datetime.now(timezone.utc)
        
        if now >= next_available:
            return {
                "can_export": True,
                "last_export": last_export,
                "next_available": None,
                "message": "Tu peux exporter ton parcours en PDF !"
            }
        else:
            days_remaining = (next_available - now).days
            return {
                "can_export": False,
                "last_export": last_export,
                "next_available": next_available.isoformat(),
                "days_remaining": days_remaining,
                "message": f"Prochain export disponible dans {days_remaining} jours"
            }
    except:
        return {
            "can_export": True,
            "last_export": None,
            "next_available": None,
            "message": "Tu peux exporter ton parcours en PDF !"
        }


@api_router.get("/auth/export-pdf")
async def export_user_pdf(user: dict = Depends(require_auth)):
    """Générer et télécharger le PDF du parcours utilisateur"""
    
    # Check if user can export (6 month limit)
    last_export = user.get("last_pdf_export")
    if last_export:
        try:
            last_export_date = datetime.fromisoformat(last_export.replace('Z', '+00:00'))
            next_available = last_export_date + timedelta(days=180)
            if datetime.now(timezone.utc) < next_available:
                days_remaining = (next_available - datetime.now(timezone.utc)).days
                raise HTTPException(
                    status_code=429,
                    detail=f"Export limité à 1 fois par semestre. Prochain export dans {days_remaining} jours."
                )
        except HTTPException:
            raise
        except:
            pass
    
    # Get user data
    user_name = f"{user.get('first_name', '')} {user.get('last_name', '')}".strip() or "Pratiquant"
    belt_level = user.get("belt_level", "6e_kyu")
    belt_info = AIKIDO_BELTS.get(belt_level, AIKIDO_BELTS["6e_kyu"])
    progression = user.get("progression", [])
    virtue_actions = user.get("virtue_actions", [])
    active_role = user.get("active_symbolic_role")
    created_at = user.get("created_at", "")
    
    # Calculate stats
    mastered_count = sum(1 for p in progression if p.get("status") == "mastered")
    practiced_count = sum(1 for p in progression if p.get("status") == "practiced")
    learning_count = sum(1 for p in progression if p.get("status") == "in_progress")
    
    # Calculate points
    technique_points = learning_count * 1 + practiced_count * 2 + mastered_count * 3
    belt_points = (belt_info.get("order", 0) + 1) * 10
    virtue_points = sum(a.get("points", 0) for a in virtue_actions)
    total_points = technique_points + belt_points + virtue_points
    
    # Create PDF buffer
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=1.5*cm, bottomMargin=1.5*cm)
    
    # Styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#D97706'),
        alignment=TA_CENTER,
        spaceAfter=20
    )
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#64748B'),
        alignment=TA_CENTER,
        spaceAfter=30
    )
    section_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=20,
        spaceAfter=10
    )
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )
    
    # Build PDF content
    story = []
    
    # Header
    story.append(Paragraph("平常心 Techniques d'Aïkido 平常心", title_style))
    story.append(Paragraph("Synthèse du Parcours", subtitle_style))
    story.append(Spacer(1, 10))
    
    # User info
    story.append(Paragraph(f"<b>Pratiquant :</b> {user_name}", body_style))
    story.append(Paragraph(f"<b>Email :</b> {user.get('email', 'N/A')}", body_style))
    if created_at:
        try:
            created_date = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
            story.append(Paragraph(f"<b>Membre depuis :</b> {created_date.strftime('%d/%m/%Y')}", body_style))
        except:
            pass
    story.append(Paragraph(f"<b>Date d'export :</b> {datetime.now().strftime('%d/%m/%Y à %H:%M')}", body_style))
    story.append(Spacer(1, 20))
    
    # Belt section
    story.append(Paragraph("🥋 Ma Ceinture", section_style))
    belt_data = [
        ["Ceinture", "Grade", "Points"],
        [f"{belt_info.get('emoji', '')} {belt_info.get('name', belt_level)}", belt_info.get('grade', ''), f"+{belt_points} pts"]
    ]
    belt_table = Table(belt_data, colWidths=[8*cm, 5*cm, 3*cm])
    belt_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F59E0B')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#FEF3C7')),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#D97706')),
    ]))
    story.append(belt_table)
    
    # Symbolic role if active
    if active_role:
        story.append(Spacer(1, 10))
        story.append(Paragraph(f"🎭 <b>Rôle symbolique actif :</b> {active_role.get('name', '')} (Vertu: {active_role.get('virtue', '')})", body_style))
    
    story.append(Spacer(1, 20))
    
    # Techniques section
    story.append(Paragraph("🎯 Progression Techniques", section_style))
    tech_data = [
        ["Statut", "Nombre", "Points"],
        ["📖 En apprentissage", str(learning_count), f"+{learning_count * 1} pts"],
        ["🎯 Pratiquées", str(practiced_count), f"+{practiced_count * 2} pts"],
        ["🏆 Maîtrisées", str(mastered_count), f"+{mastered_count * 3} pts"],
    ]
    tech_table = Table(tech_data, colWidths=[8*cm, 4*cm, 4*cm])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3B82F6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#EFF6FF')),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#3B82F6')),
    ]))
    story.append(tech_table)
    story.append(Spacer(1, 20))
    
    # Virtues section
    story.append(Paragraph("🎌 Points de Vertu", section_style))
    if virtue_actions:
        virtue_summary = {}
        for action in virtue_actions:
            vid = action.get("virtue_id", "unknown")
            if vid not in virtue_summary:
                virtue_info = VIRTUE_ACTIONS.get(vid, {})
                virtue_summary[vid] = {
                    "name": virtue_info.get("name", vid),
                    "emoji": virtue_info.get("emoji", "🎯"),
                    "points": 0,
                    "count": 0
                }
            virtue_summary[vid]["points"] += action.get("points", 0)
            virtue_summary[vid]["count"] += 1
        
        virtue_data = [["Vertu", "Actions", "Points"]]
        for vid, data in virtue_summary.items():
            virtue_data.append([f"{data['emoji']} {data['name']}", str(data['count']), f"+{data['points']} pts"])
        virtue_data.append(["<b>Total</b>", "", f"<b>+{virtue_points} pts</b>"])
        
        virtue_table = Table(virtue_data, colWidths=[8*cm, 4*cm, 4*cm])
        virtue_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8B5CF6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -2), colors.HexColor('#F5F3FF')),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#DDD6FE')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#8B5CF6')),
        ]))
        story.append(virtue_table)
    else:
        story.append(Paragraph("Aucune action de vertu enregistrée pour le moment.", body_style))
    
    story.append(Spacer(1, 30))
    
    # Total points
    story.append(Paragraph("⭐ Total des Points", section_style))
    total_data = [
        ["Catégorie", "Points"],
        ["Techniques", f"+{technique_points} pts"],
        ["Ceinture", f"+{belt_points} pts"],
        ["Vertus", f"+{virtue_points} pts"],
        ["<b>TOTAL</b>", f"<b>{total_points} pts</b>"],
    ]
    total_table = Table(total_data, colWidths=[10*cm, 6*cm])
    total_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#10B981')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -2), colors.HexColor('#ECFDF5')),
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#A7F3D0')),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#10B981')),
    ]))
    story.append(total_table)
    
    # Footer
    story.append(Spacer(1, 40))
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#94A3B8'),
        alignment=TA_CENTER
    )
    story.append(Paragraph("─" * 50, footer_style))
    story.append(Paragraph("Aïkido La Rivière - Techniques d'Aïkido", footer_style))
    story.append(Paragraph("Ce document est généré automatiquement. Prochain export disponible dans 6 mois.", footer_style))
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    
    # Update last export date
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"last_pdf_export": datetime.now(timezone.utc).isoformat()}}
    )
    
    logger.info(f"User {user['id']} exported their PDF")
    
    # Return PDF file
    filename = f"parcours_aikido_{user_name.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d')}.pdf"
    
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@api_router.get("/visitors")
async def get_visitors(dojo_id: Optional[str] = None):
    """Récupérer la liste des utilisateurs inscrits (visiteurs) avec stats de progression"""
    # Build query - filter by dojo if specified
    query = {}
    if dojo_id:
        query["dojo_id"] = dojo_id
    
    users = await db.users.find(query, {"_id": 0, "password_hash": 0}).to_list(1000)
    
    # Add belt info and progression stats to each user
    for user in users:
        belt_level = user.get("belt_level", "6e_kyu")
        user["belt_info"] = AIKIDO_BELTS.get(belt_level, AIKIDO_BELTS["6e_kyu"])
        
        # Add default dojo info if missing
        if "dojo_id" not in user:
            user["dojo_id"] = "aikido-la-riviere"
            user["dojo_name"] = "Aikido La Rivière"
        
        # Calculate progression stats
        progression = user.get("progression", {})
        user["techniques_mastered"] = sum(1 for p in progression.values() if p.get("mastery_level") == "mastered")
        user["techniques_in_progress"] = sum(1 for p in progression.values() if p.get("mastery_level") in ["learning", "practiced"])
        user["total_sessions"] = sum(p.get("practice_count", 0) for p in progression.values())
        
        # Remove progression dict from response (too heavy)
        if "progression" in user:
            del user["progression"]
    
    return users


# ═══════════════════════════════════════════════════════════════════════════════════
# ADHÉRENTS MODELS
# ═══════════════════════════════════════════════════════════════════════════════════

class ChildInfo(BaseModel):
    """Information sur un enfant adhérent"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    first_name: str
    last_name: str
    birth_date: Optional[str] = None
    status: str = "pending"  # pending, active, inactive

class MemberBase(BaseModel):
    """Modèle de base pour un adhérent"""
    # Informations parent/adulte
    parent_first_name: str
    parent_last_name: str
    email: str
    phone: str
    
    # Informations enfants (optionnel si adulte seul)
    children: Optional[List[ChildInfo]] = []
    
    # Type d'adhérent
    is_adult_member: bool = False  # True si l'adulte est lui-même adhérent
    
    # Adresse (optionnel)
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    
    # Contact d'urgence
    emergency_contact: Optional[str] = None

class MemberCreate(MemberBase):
    """Modèle pour créer un nouvel adhérent"""
    reglement_accepted: bool = False
    signature_data: Optional[str] = None  # Base64 de la signature

class Member(MemberBase):
    """Modèle complet d'un adhérent"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    member_id: Optional[str] = None  # Numéro d'adhérent (AR-001, AR-002, etc.)
    status: MemberStatus = MemberStatus.PENDING
    reglement_accepted: bool = False
    reglement_signed_date: Optional[str] = None
    signature_data: Optional[str] = None  # Base64 de la signature
    club_signature: Optional[str] = None  # Signature du club (validation)
    club_signed_date: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None
    notes: Optional[str] = None

class MemberUpdate(BaseModel):
    """Modèle pour mettre à jour un adhérent"""
    parent_first_name: Optional[str] = None
    parent_last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    children: Optional[List[ChildInfo]] = None
    is_adult_member: Optional[bool] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    emergency_contact: Optional[str] = None
    status: Optional[MemberStatus] = None
    club_signature: Optional[str] = None
    club_signed_date: Optional[str] = None
    notes: Optional[str] = None


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
            except ValueError:
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


# Statistics API
@api_router.get("/statistics")
async def get_statistics():
    """Get overall statistics - returns zero progression for non-authenticated requests"""
    kyu_levels = await db.kyu_levels.find({}, {"_id": 0}).to_list(100)
    
    total_techniques = 0
    techniques_by_level = []
    
    for kyu in kyu_levels:
        kyu_total = len(kyu.get('techniques', []))
        total_techniques += kyu_total
        
        techniques_by_level.append({
            "name": kyu.get('name'),
            "color": kyu.get('color'),
            "total": kyu_total,
            "mastered": 0,
            "in_progress": 0,
            "not_started": kyu_total,
            "practice_sessions": 0,
            "progress_percentage": 0
        })
    
    # Return zero progression for non-authenticated users
    return {
        "total_techniques": total_techniques,
        "mastered_techniques": 0,
        "in_progress_techniques": 0,
        "not_started_techniques": total_techniques,
        "total_practice_sessions": 0,
        "overall_progress": 0,
        "techniques_by_level": techniques_by_level
    }

@api_router.get("/public-stats")
async def get_public_stats():
    """Get public statistics for landing page - total techniques, grades count, challenges"""
    kyu_levels = await db.kyu_levels.find({}, {"_id": 0}).to_list(100)
    
    total_techniques = 0
    total_grades = len(kyu_levels)
    
    # Count Kyu and Dan separately
    kyu_count = 0
    dan_count = 0
    
    for kyu in kyu_levels:
        kyu_total = len(kyu.get('techniques', []))
        total_techniques += kyu_total
        
        name = kyu.get('name', '').lower()
        if 'dan' in name or 'shodan' in name:
            dan_count += 1
        else:
            kyu_count += 1
    
    # Number of challenges (7 virtues x 5 daily + 3 weekly each = ~56 + badges)
    total_challenges = 84  # Based on virtuesGamification.js count
    
    return {
        "total_techniques": total_techniques,
        "total_grades": total_grades,
        "kyu_count": kyu_count,
        "dan_count": dan_count,
        "grades_label": f"{kyu_count} Kyu + {dan_count} Dan" if dan_count > 0 else f"{kyu_count} Kyu",
        "total_challenges": total_challenges
    }


# ═══════════════════════════════════════════════════════════════════════════════════
# ADHÉRENTS API ROUTES
# ═══════════════════════════════════════════════════════════════════════════════════

@api_router.get("/members", response_model=List[Member])
async def get_members():
    """Get all members"""
    members = await db.members.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for member in members:
        deserialize_doc(member)
    return members

@api_router.get("/members/{member_id}", response_model=Member)
async def get_member(member_id: str):
    """Get a specific member"""
    member = await db.members.find_one({"id": member_id}, {"_id": 0})
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    deserialize_doc(member)
    return member

@api_router.post("/members", response_model=Member)
async def create_member(input: MemberCreate):
    """Create a new member with signed règlement"""
    # Check if email already exists
    existing = await db.members.find_one({"email": input.email})
    if existing:
        raise HTTPException(status_code=400, detail="Un adhérent avec cet email existe déjà")
    
    # Generate member_id (AR-001, AR-002, etc.)
    last_member = await db.members.find_one(
        {"member_id": {"$exists": True, "$ne": None}},
        sort=[("member_id", -1)]
    )
    if last_member and last_member.get("member_id"):
        try:
            last_num = int(last_member["member_id"].split("-")[1])
            new_num = last_num + 1
        except (ValueError, IndexError):
            new_num = 1
    else:
        new_num = 1
    new_member_id = f"AR-{new_num:03d}"
    
    member_data = input.model_dump()
    member_obj = Member(**member_data)
    member_obj.member_id = new_member_id
    
    # Set signature date if règlement accepted
    if input.reglement_accepted and input.signature_data:
        member_obj.reglement_signed_date = datetime.now(timezone.utc).isoformat()
    
    doc = member_obj.model_dump()
    serialize_doc(doc)
    
    # Convert children list to dict format for MongoDB
    if doc.get('children'):
        doc['children'] = [child if isinstance(child, dict) else child.model_dump() for child in doc['children']]
    
    await db.members.insert_one(doc)
    
    # Send confirmation email (non-blocking)
    try:
        await send_confirmation_email(
            member=member_obj.model_dump(),
            is_adult=input.is_adult_member
        )
    except Exception as e:
        logger.error(f"Failed to send confirmation email: {str(e)}")
        # Don't fail the registration if email fails
    
    return member_obj

@api_router.put("/members/{member_id}", response_model=Member)
async def update_member(member_id: str, input: MemberUpdate):
    """Update a member"""
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    # Handle children update
    if 'children' in update_data and update_data['children']:
        update_data['children'] = [
            child if isinstance(child, dict) else child.model_dump() 
            for child in update_data['children']
        ]
    
    result = await db.members.update_one({"id": member_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")
    
    member = await db.members.find_one({"id": member_id}, {"_id": 0})
    deserialize_doc(member)
    return Member(**member)

@api_router.delete("/members/{member_id}")
async def delete_member(member_id: str):
    """Delete a member"""
    result = await db.members.delete_one({"id": member_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")
    return {"message": "Member deleted successfully"}

@api_router.post("/members/{member_id}/validate-child/{child_id}")
async def validate_child(member_id: str, child_id: str):
    """Validate a specific child"""
    member = await db.members.find_one({"id": member_id}, {"_id": 0})
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    children = member.get("children", [])
    child_found = False
    for child in children:
        if child.get("id") == child_id:
            child["status"] = "active"
            child_found = True
            break
    
    if not child_found:
        raise HTTPException(status_code=404, detail="Child not found")
    
    await db.members.update_one(
        {"id": member_id},
        {"$set": {"children": children, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Child validated successfully"}

@api_router.delete("/members/{member_id}/delete-child/{child_id}")
async def delete_child(member_id: str, child_id: str):
    """Delete a specific child from a member"""
    member = await db.members.find_one({"id": member_id}, {"_id": 0})
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    children = member.get("children", [])
    original_count = len(children)
    children = [c for c in children if c.get("id") != child_id]
    
    if len(children) == original_count:
        raise HTTPException(status_code=404, detail="Child not found")
    
    await db.members.update_one(
        {"id": member_id},
        {"$set": {"children": children, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Child deleted successfully"}

@api_router.post("/members/{member_id}/validate")
async def validate_member(member_id: str, club_signature: str = None):
    """Validate a member (club signature)"""
    update_data = {
        "status": MemberStatus.ACTIVE.value,
        "club_signed_date": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    if club_signature:
        update_data["club_signature"] = club_signature
    
    result = await db.members.update_one({"id": member_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")
    
    member = await db.members.find_one({"id": member_id}, {"_id": 0})
    deserialize_doc(member)
    return Member(**member)

@api_router.get("/members-stats")
async def get_members_stats():
    """Get members statistics"""
    total = await db.members.count_documents({})
    pending = await db.members.count_documents({"status": "pending"})
    active = await db.members.count_documents({"status": "active"})
    inactive = await db.members.count_documents({"status": "inactive"})
    
    # Count children
    pipeline = [
        {"$project": {"children_count": {"$size": {"$ifNull": ["$children", []]}}}},
        {"$group": {"_id": None, "total_children": {"$sum": "$children_count"}}}
    ]
    result = await db.members.aggregate(pipeline).to_list(1)
    total_children = result[0]["total_children"] if result else 0
    
    # Count adult members
    adult_members = await db.members.count_documents({"is_adult_member": True})
    
    return {
        "total_members": total,
        "pending": pending,
        "active": active,
        "inactive": inactive,
        "total_children": total_children,
        "adult_members": adult_members
    }


@api_router.get("/visitors-stats")
async def get_visitors_stats():
    """Get visitors statistics"""
    total_visitors = await db.users.count_documents({})
    return {
        "total_visitors": total_visitors
    }


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
        },
        # ═══════════════════════════════════════════════════════════════
        # ⚔️ BOKKEN - Le Sabre en Bois (Aïkiken)
        # ═══════════════════════════════════════════════════════════════
        {
            "name": "BOKKEN (Aïkiken)",
            "order": -4,
            "color": "#7c2d12",  # Brun bois
            "techniques": [
                # ─── FONDEMENTS ET PRINCIPES ───
                {"name": "Fondements et principes de base", 
                 "description": "L'enseignement des techniques au bokken constitue un champ d'étude nourri par des sources multiples, anciennes et profondément enracinées dans la tradition martiale japonaise.",
                 "image_url": "/images/bokken/image2.jpg",
                 "key_points": ["Sources: Sensei Nobuyoshi Tamura, Kazuo Chiba, Shoji Nishio, Mitsugi Saotome", "Les principes fondamentaux du maniement du sabre priment sur les questions de style", "Chaque enseignant transmet selon son parcours et ses influences"],
                 "practice_tips": ["Les principes fondamentaux sont universels", "Le style relève de choix personnels"]},
                {"name": "L'Aïkiken - Présentation", 
                 "description": "Ensemble de techniques codifiées par Sensei Morihiro Saitō, disciple proche de O-Sensei et responsable de l'enseignement au dōjō d'Iwama.",
                 "image_url": "/images/bokken/image3.jpg",
                 "key_points": ["Système structuré pour faire reconnaître le sabre comme composante de l'aïkido", "Inspiré des écoles classiques de kenjutsu (notamment Kashima Shintō Ryū)", "Parenté étroite avec le taijutsu et l'aï-jō"],
                 "practice_tips": ["Le corpus comprend: suburi, exercices awase, kumitachi"]},
                {"name": "Équipement", 
                 "description": "L'entraînement (keiko) s'effectue principalement avec des armes en bois, en particulier le bokken.",
                 "image_url": "/images/bokken/image1.jpg",
                 "key_points": ["Bokken (sabre en bois de chêne)", "Jō (bâton court) pour certains katas", "Le choix dépend du contenu de l'enseignement et du niveau"],
                 "practice_tips": ["Vérifier l'état du bokken avant chaque pratique", "Choisir un bokken adapté à sa morphologie"]},
                # ─── TENUE DU BOKKEN ───
                {"name": "Tenue du bokken (Saisie)", 
                 "description": "La saisie moderne du sabre repose sur des principes précis et non intuitifs. Cette prise est appelée tamago (œuf).",
                 "image_url": "/images/bokken/image5.jpg",
                 "key_points": ["Main droite à l'avant, derrière la tsuba", "Main gauche à l'extrémité, kashira dans la paume", "Espace entre commissure pouce-index et tsuka (prise tamago)", "Tenue sur annulaire et auriculaire principalement"],
                 "practice_tips": ["La main basse donne la puissance de coupe", "La main haute assure la précision", "Kissaki (pointe) toujours orientée vers le partenaire"]},
                {"name": "Te no Uchi / Shibori", 
                 "description": "Positionnement correct des mains sur le dessus de la poignée garantissant efficacité, relâchement et sécurité articulaire.",
                 "image_url": "/images/bokken/image7.jpg",
                 "key_points": ["Les autres doigts accompagnent sans crispation", "Principe de te no uchi (intérieur de la main)", "Shibori: action de serrer/essorer"],
                 "practice_tips": ["Éviter toute crispation des mains", "Garder les poignets souples"]},
                # ─── LES 5 COUPES PRINCIPALES ───
                {"name": "Shōmen Giri", 
                 "description": "Coupe verticale descendante. Coupe fondamentale du ken.",
                 "image_url": "/images/bokken/image8.jpg",
                 "key_points": ["Trajectoire verticale du haut vers le bas", "Le sabre monte et descend sur l'axe médian", "Coupe comme si on tranchait jusqu'au bassin"],
                 "practice_tips": ["Engagement de tout le corps", "Garder l'axe vertical"]},
                {"name": "Kesa Giri", 
                 "description": "Coupe diagonale descendante. De l'épaule à la hanche opposée.",
                 "image_url": "/images/bokken/image9.jpg",
                 "key_points": ["Trajectoire diagonale", "De l'épaule vers la hanche opposée", "Mouvement des hanches pour la trajectoire"],
                 "practice_tips": ["Impulsion des hanches dès le début de la descente", "Coupe franche et continue"]},
                {"name": "Yoko Giri / Dō Giri / Ichimonji", 
                 "description": "Coupe horizontale au niveau du tronc.",
                 "image_url": "/images/bokken/image9.jpg",
                 "key_points": ["Trajectoire horizontale", "Niveau du tronc (dō)", "Mouvement appelé aussi ichimonji"],
                 "practice_tips": ["Rotation des hanches", "Garder le sabre parallèle au sol"]},
                {"name": "Gyaku Kesa Giri", 
                 "description": "Coupe diagonale montante. De la hanche vers l'épaule opposée.",
                 "image_url": "/images/bokken/image9.jpg",
                 "key_points": ["Trajectoire diagonale montante", "De bas en haut", "Inverse du kesa giri"],
                 "practice_tips": ["Puissance des jambes et des hanches", "Coordination du mouvement montant"]},
                {"name": "Tsuki", 
                 "description": "Coup d'estoc. Pointe du sabre vers l'adversaire.",
                 "image_url": "/images/bokken/image10.jpg",
                 "key_points": ["Coup d'estoc, pénétrant", "Garde seigan no kamae (sabre pointant devant)", "Pousser avec tout le corps"],
                 "practice_tips": ["Garder l'alignement du corps", "Ne pas uniquement utiliser les bras"]},
                # ─── PARADES ET CONTRES ───
                {"name": "Parades et Contres - Ukeru", 
                 "description": "En escrime japonaise, il ne s'agit pas de bloquer la lame adverse mais de la recevoir (ukeru).",
                 "image_url": "/images/bokken/image11.jpg",
                 "key_points": ["Défense = esquive + contrôle de la lame", "Les sabres glissent l'un contre l'autre", "Empêcher toute reprise d'attaque"],
                 "practice_tips": ["Ne jamais bloquer frontalement", "Recevoir et rediriger"]},
                {"name": "Gonosen - Contre simultané", 
                 "description": "Réponse simultanée à l'attaque, intégrant esquive et contre-attaque dans un même mouvement.",
                 "image_url": "/images/bokken/image11.jpg",
                 "key_points": ["Esquive et contre-attaque simultanées", "Pas de temps mort entre défense et attaque", "Esprit gonosen"],
                 "practice_tips": ["Timing parfait requis", "Anticipation de l'attaque"]},
                # ─── KEN SUBURI - LES 7 SUBURI ───
                {"name": "Ken Suburi - Introduction", 
                 "description": "Les suburi constituent la base du travail au sabre. Ils développent l'axe, la coordination, le placement du corps et la continuité du mouvement.",
                 "image_url": "/images/bokken/image12.jpg",
                 "key_points": ["7 suburi au bokken", "Chaque suburi engage le centre et les hanches", "Gestion du ma-ai (distance)", "Sabre parallèle au sol à la fin de chaque coupe"],
                 "practice_tips": ["Pratiquer quotidiennement", "Qualité plutôt que quantité"]},
                {"name": "Suburi Ichi (1er Suburi)", 
                 "description": "Premier exercice de coupe fondamental.",
                 "image_url": "/images/bokken/image13.jpg",
                 "key_points": ["Coupe shōmen de base", "Lever-couper", "Position de départ et d'arrivée identiques"],
                 "practice_tips": ["Attention à l'axe vertical", "Engagement du centre"]},
                {"name": "Suburi Ni (2e Suburi)", 
                 "description": "Deuxième exercice de coupe avec avancée.",
                 "image_url": "/images/bokken/image14.jpg",
                 "key_points": ["Coupe avec déplacement avant", "Coordination jambes-bras", "Garder le centre stable"],
                 "practice_tips": ["Le pied et le sabre arrivent ensemble", "Pas de déséquilibre"]},
                {"name": "Suburi San (3e Suburi)", 
                 "description": "Troisième exercice avec reculée.",
                 "image_url": "/images/bokken/image15.jpg",
                 "key_points": ["Coupe avec déplacement arrière", "Défense et attaque combinées"],
                 "practice_tips": ["Garder la garde même en reculant"]},
                {"name": "Suburi Yon (4e Suburi)", 
                 "description": "Quatrième exercice - coupe latérale.",
                 "image_url": "/images/bokken/image15.jpg",
                 "key_points": ["Intègre le yokomen ou kesa", "Travail des diagonales"],
                 "practice_tips": ["Rotation des hanches essentielle"]},
                {"name": "Suburi Go (5e Suburi)", 
                 "description": "Cinquième exercice - tsuki.",
                 "image_url": "/images/bokken/image15.jpg",
                 "key_points": ["Coup d'estoc", "Extension et pénétration"],
                 "practice_tips": ["Alignement du corps"]},
                {"name": "Suburi Roku (6e Suburi)", 
                 "description": "Sixième exercice - combinaison.",
                 "image_url": "/images/bokken/image15.jpg",
                 "key_points": ["Enchaînement de coupes", "Fluidité"],
                 "practice_tips": ["Continuité du mouvement"]},
                {"name": "Suburi Nana (7e Suburi)", 
                 "description": "Septième exercice - forme complète.",
                 "image_url": "/images/bokken/image15.jpg",
                 "key_points": ["Synthèse des mouvements précédents", "Expression personnelle"],
                 "practice_tips": ["Maîtrise globale"]},
                # ─── LES 5 GARDES (KAMAE) ───
                {"name": "Les Gardes (Kamae) - Introduction", 
                 "description": "La garde (kamae) est une position transitoire reflétant l'intention, l'équilibre et l'état d'esprit du pratiquant. Elle n'est jamais figée.",
                 "image_url": "/images/bokken/image16.jpg",
                 "key_points": ["5 gardes principales", "Position reflétant l'intention", "Équilibre et état d'esprit", "Jamais statique"],
                 "practice_tips": ["La garde vit et s'adapte", "Rester disponible pour toute action"]},
                {"name": "Seigan no Kamae (Garde moyenne)", 
                 "description": "Garde moyenne offrant l'équilibre optimal entre attaque et défense. Position de référence.",
                 "image_url": "/images/bokken/image17.jpg",
                 "key_points": ["Pointe du sabre vers les yeux de l'adversaire", "Équilibre attaque/défense", "Position neutre et adaptable"],
                 "practice_tips": ["Garde la plus utilisée", "Point de départ pour toutes les actions"]},
                {"name": "Hassō no Kamae (Garde d'attente)", 
                 "description": "Garde d'attente qui fausse la distance. Sabre tenu verticalement près de l'épaule.",
                 "image_url": "/images/bokken/image18.jpg",
                 "key_points": ["Sabre vertical près de l'épaule droite", "Dissimule l'intention", "Fausse l'appréciation de la distance"],
                 "practice_tips": ["Permet des attaques surprises", "Garde de préparation"]},
                {"name": "Jōdan no Kamae (Garde haute)", 
                 "description": "Garde haute, très offensive. Sabre levé au-dessus de la tête.",
                 "image_url": "/images/bokken/image19.jpg",
                 "key_points": ["Sabre au-dessus de la tête", "Position très offensive", "Menace constante de coupe"],
                 "practice_tips": ["Engagement total", "Ne laisse que peu de place à la défense"]},
                {"name": "Gedan no Kamae (Garde basse)", 
                 "description": "Garde basse, exigeante et menaçante. Pointe vers le bas.",
                 "image_url": "/images/bokken/image21.jpg",
                 "key_points": ["Pointe du sabre vers le bas", "Protège le bas du corps", "Invite l'attaque haute"],
                 "practice_tips": ["Garde défensive avec potentiel offensif", "Exige une grande vigilance"]},
                {"name": "Waki no Kamae (Garde dissimulée)", 
                 "description": "Garde dissimulée jouant sur l'incertitude. Sabre caché derrière le corps.",
                 "image_url": "/images/bokken/image22.jpg",
                 "key_points": ["Sabre dissimulé derrière le corps", "L'adversaire ne voit pas la lame", "Joue sur l'incertitude et la surprise"],
                 "practice_tips": ["Garde de tromperie", "Nécessite timing et sens du moment"]}
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


# ═══════════════════════════════════════════════════════════════════════════════════
# SUBSCRIPTION SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════════

from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

# Subscription Plans - Updated Jan 2025
SUBSCRIPTION_PLANS = {
    # Licence Utilisateur unique
    "utilisateur_mensuel": {
        "id": "utilisateur_mensuel",
        "name": "Utilisateur unique - Mensuel",
        "display_name": "Utilisateur unique",
        "price": 4.50,
        "currency": "eur",
        "billing_period": "monthly",
        "trial_days": 90,  # 3 mois d'essai gratuit
        "commitment_months": 0,  # Sans engagement
        "description": "Parcours personnel de révision et de motivation",
        "cancellation_info": "Sans engagement, résiliable à tout moment",
        "target_audience": ["Particuliers", "Pratiquants", "Éducateurs", "Étudiants", "Coachs"],
        "features": [
            "Accès complet à l'application",
            "Parcours pédagogiques",
            "Scénarios Serious Game",
            "Mises à jour incluses",
            "Support utilisateur"
        ]
    },
    "utilisateur_annuel": {
        "id": "utilisateur_annuel",
        "name": "Utilisateur unique - Annuel",
        "display_name": "Utilisateur unique",
        "price": 39.90,
        "currency": "eur",
        "billing_period": "yearly",
        "trial_days": 90,  # 3 mois d'essai gratuit
        "commitment_months": 12,  # 1 an
        "description": "Parcours personnel - Économisez 26%",
        "cancellation_info": "Résiliable à l'échéance annuelle",
        "savings_percent": 26,
        "target_audience": ["Particuliers", "Pratiquants", "Éducateurs", "Étudiants", "Coachs"],
        "features": [
            "Accès complet à l'application",
            "Parcours pédagogiques",
            "Scénarios Serious Game",
            "Mises à jour incluses",
            "Support utilisateur"
        ]
    },
    # Licence Club
    "club_petit": {
        "id": "club_petit",
        "name": "Club - Petit (<50 adhérents)",
        "display_name": "Club",
        "price": 19.90,
        "currency": "eur",
        "billing_period": "monthly",
        "trial_days": 10,  # 10 jours d'essai gratuit
        "commitment_months": 12,  # Engagement 12 mois
        "max_members": 50,
        "description": "Licences illimitées + gestion adhérents",
        "cancellation_info": "Engagement 12 mois avec reconduction tacite annuelle",
        "target_audience": ["Clubs d'aïkido", "Associations sportives", "Petites structures"],
        "features": [
            "Accès illimité pour les adhérents",
            "Espace administrateur",
            "Gestion des adhérents",
            "Suivi des parcours",
            "Statistiques d'usage",
            "Accompagnement prise en main"
        ]
    },
    "club_moyen": {
        "id": "club_moyen",
        "name": "Club - Moyen (50-150 adhérents)",
        "display_name": "Club",
        "price": 29.90,
        "currency": "eur",
        "billing_period": "monthly",
        "trial_days": 10,  # 10 jours d'essai gratuit
        "commitment_months": 12,  # Engagement 12 mois
        "min_members": 50,
        "max_members": 150,
        "description": "Licences illimitées + gestion adhérents",
        "cancellation_info": "Engagement 12 mois avec reconduction tacite annuelle",
        "target_audience": ["Clubs moyens", "Fédérations locales", "Associations"],
        "features": [
            "Accès illimité pour les adhérents",
            "Espace administrateur",
            "Gestion des adhérents",
            "Suivi des parcours",
            "Statistiques d'usage",
            "Supports pédagogiques",
            "Accompagnement prise en main"
        ]
    },
    "club_grand": {
        "id": "club_grand",
        "name": "Club - Grand (>150 adhérents)",
        "display_name": "Club",
        "price": 0.0,  # Sur devis
        "currency": "eur",
        "billing_period": "yearly",
        "trial_days": 10,
        "commitment_months": 12,
        "min_members": 150,
        "max_members": None,  # Illimité
        "description": "Sur devis - Contactez-nous",
        "cancellation_info": "Engagement 12 mois avec reconduction tacite annuelle",
        "requires_quote": True,
        "target_audience": ["Grandes structures", "Fédérations", "Collectivités"],
        "features": [
            "Accès illimité pour les adhérents",
            "Espace administrateur",
            "Gestion des adhérents",
            "Suivi des parcours",
            "Statistiques d'usage",
            "Supports pédagogiques",
            "Accompagnement personnalisé",
            "Formation sur site"
        ]
    }
}

class SubscriptionCheckoutRequest(BaseModel):
    plan_id: str
    origin_url: str

class DojoRegistrationRequest(BaseModel):
    # Dojo info
    dojo_name: str
    dojo_address: Optional[str] = None
    dojo_city: str
    dojo_phone: Optional[str] = None
    dojo_description: Optional[str] = None
    # Admin info
    first_name: str
    last_name: str
    email: EmailStr
    password: str

@api_router.get("/subscription-plans")
async def get_subscription_plans():
    """Récupérer les plans d'abonnement disponibles"""
    # Return plans organized by category
    individual_plans = {k: v for k, v in SUBSCRIPTION_PLANS.items() if k.startswith("utilisateur")}
    club_plans = {k: v for k, v in SUBSCRIPTION_PLANS.items() if k.startswith("club")}
    
    return {
        "individual": individual_plans,
        "club": club_plans,
        "all": SUBSCRIPTION_PLANS
    }

@api_router.post("/subscriptions/checkout")
async def create_subscription_checkout(data: SubscriptionCheckoutRequest, user: dict = Depends(require_auth)):
    """Créer une session de checkout pour un abonnement"""
    
    if data.plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=400, detail="Plan invalide")
    
    plan = SUBSCRIPTION_PLANS[data.plan_id]
    
    # Check if plan requires a quote (club_grand)
    if plan.get("requires_quote", False):
        raise HTTPException(
            status_code=400, 
            detail="Ce plan nécessite un devis personnalisé. Contactez-nous à contact@aikidoatgame.com"
        )
    
    # Check if user already has an active subscription
    existing_sub = await db.subscriptions.find_one({
        "user_id": user["id"],
        "status": {"$in": ["active", "trialing"]}
    })
    
    if existing_sub:
        raise HTTPException(status_code=400, detail="Vous avez déjà un abonnement actif")
    
    # For trial period without card, we create the subscription directly
    trial_end = datetime.now(timezone.utc) + timedelta(days=plan["trial_days"])
    
    subscription = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "user_email": user["email"],
        "plan_id": data.plan_id,
        "plan_name": plan["name"],
        "display_name": plan.get("display_name", plan["name"]),
        "billing_period": plan.get("billing_period", "monthly"),
        "status": "trialing",
        "trial_start": datetime.now(timezone.utc).isoformat(),
        "trial_end": trial_end.isoformat(),
        "price": plan["price"],
        "currency": plan["currency"],
        "commitment_months": plan["commitment_months"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "stripe_session_id": None,
        "card_added": False,
        "features": plan.get("features", [])
    }
    
    await db.subscriptions.insert_one(subscription)
    
    # Update user with subscription info
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {
            "subscription_id": subscription["id"],
            "subscription_plan": data.plan_id,
            "subscription_status": "trialing",
            "trial_end": trial_end.isoformat()
        }}
    )
    
    logger.info(f"User {user['id']} started trial for plan {data.plan_id}")
    
    # Determine trial message based on plan
    if plan["trial_days"] >= 30:
        trial_msg = f"{plan['trial_days'] // 30} mois"
    else:
        trial_msg = f"{plan['trial_days']} jours"
    
    return {
        "trial_started": True,
        "message": f"🎉 Votre essai gratuit de {trial_msg} a commencé !",
        "subscription": {
            "id": subscription["id"],
            "plan": plan["name"],
            "display_name": plan.get("display_name", plan["name"]),
            "trial_end": trial_end.isoformat(),
            "status": "trialing",
            "price": plan["price"],
            "billing_period": plan.get("billing_period", "monthly")
        }
    }

class SubscriptionCheckoutWithCardRequest(BaseModel):
    plan_id: str
    origin_url: str

class QuoteRequest(BaseModel):
    club_name: str
    contact_name: str
    email: EmailStr
    phone: Optional[str] = None
    estimated_members: int
    message: Optional[str] = None

@api_router.post("/subscriptions/request-quote")
async def request_quote(data: QuoteRequest):
    """Demander un devis pour les grandes structures (>150 adhérents)"""
    
    quote_request = {
        "id": str(uuid.uuid4()),
        "club_name": data.club_name,
        "contact_name": data.contact_name,
        "email": data.email,
        "phone": data.phone,
        "estimated_members": data.estimated_members,
        "message": data.message,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.quote_requests.insert_one(quote_request)
    
    logger.info(f"New quote request from {data.club_name} ({data.email})")
    
    return {
        "success": True,
        "message": "Votre demande de devis a été envoyée. Nous vous contacterons sous 48h.",
        "quote_id": quote_request["id"]
    }

@api_router.post("/subscriptions/checkout-with-card")
async def create_subscription_checkout_with_card(data: SubscriptionCheckoutWithCardRequest, user: dict = Depends(require_auth)):
    """Créer une session de checkout Stripe avec carte bancaire pour un abonnement"""
    
    if data.plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=400, detail="Plan invalide")
    
    plan = SUBSCRIPTION_PLANS[data.plan_id]
    
    # Check if plan requires a quote
    if plan.get("requires_quote", False):
        raise HTTPException(
            status_code=400, 
            detail="Ce plan nécessite un devis personnalisé. Utilisez /subscriptions/request-quote"
        )
    
    # Check if user already has an active subscription
    existing_sub = await db.subscriptions.find_one({
        "user_id": user["id"],
        "status": {"$in": ["active", "trialing"]}
    })
    
    if existing_sub:
        raise HTTPException(status_code=400, detail="Vous avez déjà un abonnement actif")
    
    # Get Stripe API key
    stripe_api_key = os.environ.get("STRIPE_API_KEY")
    if not stripe_api_key:
        raise HTTPException(status_code=500, detail="Configuration Stripe manquante")
    
    # Create webhook URL
    webhook_url = f"{data.origin_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    # Create checkout session with session_id placeholder
    success_url = f"{data.origin_url}?subscription=success&plan={data.plan_id}&session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{data.origin_url}?subscription=cancelled"
    
    # Calculate trial end date
    trial_end = datetime.now(timezone.utc) + timedelta(days=plan["trial_days"])
    
    # Determine billing description
    billing_period = plan.get("billing_period", "monthly")
    if billing_period == "yearly":
        billing_desc = "Abonnement annuel"
    else:
        billing_desc = "Abonnement mensuel"
    
    checkout_request = CheckoutSessionRequest(
        amount=float(plan["price"]),
        currency=plan["currency"],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "user_id": user["id"],
            "user_email": user["email"],
            "plan_id": data.plan_id,
            "plan_name": plan["name"],
            "display_name": plan.get("display_name", plan["name"]),
            "billing_period": billing_period,
            "trial_days": str(plan["trial_days"]),
            "commitment_months": str(plan["commitment_months"]),
            "type": "subscription_with_trial"
        }
    )
    
    try:
        session = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Create pending subscription record
        subscription = {
            "id": str(uuid.uuid4()),
            "user_id": user["id"],
            "user_email": user["email"],
            "plan_id": data.plan_id,
            "plan_name": plan["name"],
            "display_name": plan.get("display_name", plan["name"]),
            "billing_period": billing_period,
            "status": "pending_payment",
            "trial_start": datetime.now(timezone.utc).isoformat(),
            "trial_end": trial_end.isoformat(),
            "price": plan["price"],
            "currency": plan["currency"],
            "commitment_months": plan["commitment_months"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "stripe_session_id": session.session_id,
            "card_added": True,
            "payment_method": "card",
            "features": plan.get("features", [])
        }
        
        await db.subscriptions.insert_one(subscription)
        
        # Create payment transaction record
        transaction = {
            "id": str(uuid.uuid4()),
            "session_id": session.session_id,
            "user_id": user["id"],
            "user_email": user["email"],
            "plan_id": data.plan_id,
            "amount": plan["price"],
            "currency": plan["currency"],
            "payment_status": "pending",
            "type": "subscription_setup",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.payment_transactions.insert_one(transaction)
        
        logger.info(f"User {user['id']} started checkout with card for plan {data.plan_id}")
        
        return {
            "url": session.url,
            "session_id": session.session_id,
            "trial_days": plan["trial_days"]
        }
        
    except Exception as e:
        logger.error(f"Stripe checkout error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur Stripe: {str(e)}")

@api_router.post("/subscriptions/add-payment-method")
async def add_payment_method(data: SubscriptionCheckoutRequest, user: dict = Depends(require_auth)):
    """Ajouter une méthode de paiement à la fin de l'essai"""
    
    if data.plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=400, detail="Plan invalide")
    
    plan = SUBSCRIPTION_PLANS[data.plan_id]
    
    # Get Stripe API key
    stripe_api_key = os.environ.get("STRIPE_API_KEY")
    if not stripe_api_key:
        raise HTTPException(status_code=500, detail="Configuration Stripe manquante")
    
    # Create webhook URL
    webhook_url = f"{data.origin_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    # Create checkout session
    success_url = f"{data.origin_url}/subscription/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{data.origin_url}/subscription/cancel"
    
    checkout_request = CheckoutSessionRequest(
        amount=float(plan["price"]),
        currency=plan["currency"],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "user_id": user["id"],
            "user_email": user["email"],
            "plan_id": data.plan_id,
            "type": "subscription"
        }
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction record
    transaction = {
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "user_id": user["id"],
        "user_email": user["email"],
        "plan_id": data.plan_id,
        "amount": plan["price"],
        "currency": plan["currency"],
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.payment_transactions.insert_one(transaction)
    
    return {
        "url": session.url,
        "session_id": session.session_id
    }

@api_router.get("/subscriptions/status/{session_id}")
async def get_subscription_status(session_id: str, user: dict = Depends(require_auth)):
    """Vérifier le statut d'un paiement d'abonnement"""
    
    stripe_api_key = os.environ.get("STRIPE_API_KEY")
    if not stripe_api_key:
        raise HTTPException(status_code=500, detail="Configuration Stripe manquante")
    
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url="")
    
    status = await stripe_checkout.get_checkout_status(session_id)
    
    # Update transaction
    await db.payment_transactions.update_one(
        {"session_id": session_id},
        {"$set": {
            "payment_status": status.payment_status,
            "status": status.status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    if status.payment_status == "paid":
        # Activate subscription
        transaction = await db.payment_transactions.find_one({"session_id": session_id})
        if transaction:
            await db.subscriptions.update_one(
                {"user_id": transaction["user_id"], "status": "trialing"},
                {"$set": {
                    "status": "active",
                    "card_added": True,
                    "stripe_session_id": session_id,
                    "activated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
            
            await db.users.update_one(
                {"id": transaction["user_id"]},
                {"$set": {"subscription_status": "active"}}
            )
    
    return {
        "status": status.status,
        "payment_status": status.payment_status
    }

@api_router.get("/auth/subscription")
async def get_user_subscription(user: dict = Depends(require_auth)):
    """Récupérer l'abonnement de l'utilisateur"""
    
    subscription = await db.subscriptions.find_one(
        {"user_id": user["id"], "status": {"$in": ["active", "trialing"]}},
        {"_id": 0}
    )
    
    if not subscription:
        return {"has_subscription": False, "subscription": None}
    
    # Check if trial has expired
    if subscription["status"] == "trialing":
        trial_end = datetime.fromisoformat(subscription["trial_end"].replace('Z', '+00:00'))
        if datetime.now(timezone.utc) > trial_end:
            # Trial expired
            await db.subscriptions.update_one(
                {"id": subscription["id"]},
                {"$set": {"status": "trial_expired"}}
            )
            await db.users.update_one(
                {"id": user["id"]},
                {"$set": {"subscription_status": "trial_expired"}}
            )
            subscription["status"] = "trial_expired"
    
    return {
        "has_subscription": subscription["status"] in ["active", "trialing"],
        "subscription": subscription
    }

@api_router.post("/auth/register-dojo")
async def register_dojo(data: DojoRegistrationRequest):
    """Inscription d'un nouveau dojo avec son administrateur"""
    
    # Check if email already exists
    existing = await db.users.find_one({"email": data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Un compte avec cet email existe déjà")
    
    # Check if dojo name already exists
    existing_dojo = await db.dojos.find_one({"name": data.dojo_name})
    if existing_dojo:
        raise HTTPException(status_code=400, detail="Un dojo avec ce nom existe déjà")
    
    # Generate dojo ID
    dojo_id = data.dojo_name.lower().replace(" ", "-").replace("'", "")
    dojo_id = ''.join(c for c in dojo_id if c.isalnum() or c == '-')
    
    # Check if ID already exists
    existing_id = await db.dojos.find_one({"id": dojo_id})
    if existing_id:
        dojo_id = f"{dojo_id}-{str(uuid.uuid4())[:8]}"
    
    # Create dojo
    new_dojo = {
        "id": dojo_id,
        "name": data.dojo_name,
        "description": data.dojo_description or f"Dojo {data.dojo_name}",
        "address": data.dojo_address or "",
        "city": data.dojo_city,
        "phone": data.dojo_phone or "",
        "admin_password": hash_password(str(uuid.uuid4())[:12]),  # Random password, admin uses personal login
        "is_default": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "subscription_plan": "dojo",
        "subscription_status": "trialing",
        "trial_end": (datetime.now(timezone.utc) + timedelta(days=14)).isoformat()
    }
    
    await db.dojos.insert_one(new_dojo)
    
    # Create admin user
    user = {
        "id": str(uuid.uuid4()),
        "first_name": data.first_name,
        "last_name": data.last_name,
        "email": data.email.lower(),
        "password_hash": hash_password(data.password),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "progression": {},
        "belt_level": "6e_kyu",
        "belt_awarded_at": datetime.now(timezone.utc).isoformat(),
        "belt_awarded_by": "system",
        "dojo_id": dojo_id,
        "dojo_name": data.dojo_name,
        "role": "dojo_admin",  # Special role for dojo administrators
        "subscription_plan": "dojo",
        "subscription_status": "trialing",
        "trial_end": (datetime.now(timezone.utc) + timedelta(days=14)).isoformat()
    }
    
    await db.users.insert_one(user)
    
    # Create subscription
    subscription = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "dojo_id": dojo_id,
        "user_email": user["email"],
        "plan_id": "dojo",
        "plan_name": "Offre Dojo",
        "status": "trialing",
        "trial_start": datetime.now(timezone.utc).isoformat(),
        "trial_end": (datetime.now(timezone.utc) + timedelta(days=14)).isoformat(),
        "price": 65.00,
        "currency": "eur",
        "commitment_months": 12,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "card_added": False
    }
    
    await db.subscriptions.insert_one(subscription)
    
    logger.info(f"New dojo registered: {data.dojo_name} by {data.email}")
    
    return {
        "success": True,
        "message": f"Dojo '{data.dojo_name}' créé avec succès !",
        "dojo_id": dojo_id,
        "trial_days": 14
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """
    Handle Stripe webhooks
    Events handled:
    - checkout.session.completed - Payment successful
    - customer.subscription.created - New subscription
    - customer.subscription.updated - Subscription changed
    - customer.subscription.deleted - Subscription cancelled
    - invoice.payment_succeeded - Recurring payment successful
    - invoice.payment_failed - Recurring payment failed
    """
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    stripe_api_key = os.environ.get("STRIPE_API_KEY")
    if not stripe_api_key:
        raise HTTPException(status_code=500, detail="Configuration Stripe manquante")
    
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url="")
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        event_type = webhook_response.event_type
        session_id = webhook_response.session_id
        
        logger.info(f"Stripe webhook received: {event_type} for session {session_id}")
        
        if webhook_response.payment_status == "paid":
            # Update transaction status
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {
                    "payment_status": "paid",
                    "event_type": event_type,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
            
            # Find transaction and activate subscription
            transaction = await db.payment_transactions.find_one({"session_id": session_id})
            if transaction:
                user_id = transaction.get("user_id")
                plan_id = transaction.get("plan_id")
                
                # Update subscription to active
                await db.subscriptions.update_one(
                    {"user_id": user_id},
                    {"$set": {
                        "status": "active",
                        "card_added": True,
                        "plan_id": plan_id,
                        "activated_at": datetime.now(timezone.utc).isoformat(),
                        "stripe_session_id": session_id
                    }},
                    upsert=True
                )
                
                # Log successful payment
                logger.info(f"✅ Payment successful for user {user_id}, plan {plan_id}")
                
                # Create payment history record
                await db.payment_history.insert_one({
                    "id": str(uuid.uuid4()),
                    "user_id": user_id,
                    "plan_id": plan_id,
                    "amount": transaction.get("amount"),
                    "currency": transaction.get("currency", "eur"),
                    "status": "succeeded",
                    "stripe_session_id": session_id,
                    "event_type": event_type,
                    "created_at": datetime.now(timezone.utc).isoformat()
                })
        
        elif event_type == "customer.subscription.deleted":
            # Handle subscription cancellation
            if session_id:
                transaction = await db.payment_transactions.find_one({"session_id": session_id})
                if transaction:
                    await db.subscriptions.update_one(
                        {"user_id": transaction["user_id"]},
                        {"$set": {
                            "status": "cancelled",
                            "cancelled_at": datetime.now(timezone.utc).isoformat()
                        }}
                    )
                    logger.info(f"Subscription cancelled for user {transaction['user_id']}")
        
        elif event_type == "invoice.payment_failed":
            # Handle failed recurring payment
            logger.warning(f"Payment failed for session {session_id}")
            if session_id:
                transaction = await db.payment_transactions.find_one({"session_id": session_id})
                if transaction:
                    await db.subscriptions.update_one(
                        {"user_id": transaction["user_id"]},
                        {"$set": {
                            "status": "payment_failed",
                            "payment_failed_at": datetime.now(timezone.utc).isoformat()
                        }}
                    )
        
        logger.info(f"Stripe webhook processed successfully: {event_type}")
        return {"status": "success", "event": event_type}
        
    except Exception as e:
        logger.error(f"Stripe webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# GAMIFICATION ROUTES - Défis, XP, Badges
# ============================================================================

class ChallengeStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    VALIDATED = "validated"
    REJECTED = "rejected"

class ChallengeType(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    TECHNIQUE = "technique"
    VIRTUE = "virtue"
    ATTENDANCE = "attendance"

class DailyChallengeCompletion(BaseModel):
    challenge_id: str
    challenge_type: ChallengeType
    challenge_name: str
    xp_reward: int = 10
    needs_parent_validation: bool = False

class UserGamificationStats(BaseModel):
    user_id: str
    total_xp: int = 0
    level: int = 1
    level_name: str = "Petit Scarabée"
    streak_days: int = 0
    last_activity_date: Optional[str] = None
    badges: List[dict] = []
    completed_challenges: List[dict] = []
    pending_validations: List[dict] = []
    attendance_count: int = 0
    techniques_validated: int = 0

class BadgeAward(BaseModel):
    badge_id: str
    badge_name: str
    badge_icon: str
    badge_description: str
    awarded_at: Optional[str] = None

class AttendanceRecord(BaseModel):
    date: str  # YYYY-MM-DD
    attended: bool = True

# XP par niveau
LEVEL_THRESHOLDS = [
    {"level": 1, "name": "Petit Scarabée", "xp": 0},
    {"level": 2, "name": "Jeune Poussin", "xp": 200},
    {"level": 3, "name": "Apprenti Ninja", "xp": 500},
    {"level": 4, "name": "Ninja Agile", "xp": 1000},
    {"level": 5, "name": "Ninja Rapide", "xp": 2000},
    {"level": 6, "name": "Super Ninja", "xp": 4000},
    {"level": 7, "name": "Maître Ninja", "xp": 8000},
    {"level": 8, "name": "Grand Maître", "xp": 15000},
    {"level": 9, "name": "Légende Ninja", "xp": 30000},
    {"level": 10, "name": "Dragon Suprême", "xp": 50000},
]

def get_level_from_xp(total_xp: int) -> dict:
    """Calculate level and level name from total XP"""
    current_level = LEVEL_THRESHOLDS[0]
    for threshold in LEVEL_THRESHOLDS:
        if total_xp >= threshold["xp"]:
            current_level = threshold
        else:
            break
    return current_level

@api_router.get("/gamification/stats/{user_id}")
async def get_user_gamification_stats(user_id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get gamification stats for a user"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # Fetch or create gamification stats
    stats = await db.gamification_stats.find_one({"user_id": user_id}, {"_id": 0})
    
    if not stats:
        # Create default stats for new user
        stats = {
            "user_id": user_id,
            "total_xp": 0,
            "level": 1,
            "level_name": "Petit Scarabée",
            "streak_days": 0,
            "last_activity_date": None,
            "badges": [],
            "completed_challenges": [],
            "pending_validations": [],
            "attendance_count": 0,
            "techniques_validated": 0,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.gamification_stats.insert_one(stats)
        if "_id" in stats:
            del stats["_id"]
    
    return stats

@api_router.post("/gamification/challenge/complete")
async def complete_challenge(
    completion: DailyChallengeCompletion,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Complete a daily challenge and earn XP"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # Verify token and get user
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")
    
    # Check if challenge already completed today
    existing = await db.gamification_stats.find_one({
        "user_id": user_id,
        "completed_challenges": {
            "$elemMatch": {
                "challenge_id": completion.challenge_id,
                "completed_date": today
            }
        }
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Challenge already completed today")
    
    # Prepare challenge record
    challenge_record = {
        "challenge_id": completion.challenge_id,
        "challenge_type": completion.challenge_type,
        "challenge_name": completion.challenge_name,
        "xp_reward": completion.xp_reward,
        "completed_date": today,
        "completed_at": now.isoformat(),
        "status": ChallengeStatus.VALIDATED if not completion.needs_parent_validation else ChallengeStatus.PENDING
    }
    
    # Calculate XP to award
    xp_to_award = completion.xp_reward if not completion.needs_parent_validation else 0
    
    # Update or create gamification stats
    stats = await db.gamification_stats.find_one({"user_id": user_id})
    
    if not stats:
        # Create new stats
        new_total_xp = xp_to_award
        level_info = get_level_from_xp(new_total_xp)
        
        stats = {
            "user_id": user_id,
            "total_xp": new_total_xp,
            "level": level_info["level"],
            "level_name": level_info["name"],
            "streak_days": 1,
            "last_activity_date": today,
            "badges": [],
            "completed_challenges": [challenge_record],
            "pending_validations": [challenge_record] if completion.needs_parent_validation else [],
            "attendance_count": 0,
            "techniques_validated": 0,
            "created_at": now.isoformat()
        }
        await db.gamification_stats.insert_one(stats)
    else:
        # Update existing stats
        current_xp = stats.get("total_xp", 0)
        new_total_xp = current_xp + xp_to_award
        level_info = get_level_from_xp(new_total_xp)
        
        # Calculate streak
        last_date = stats.get("last_activity_date")
        current_streak = stats.get("streak_days", 0)
        
        if last_date:
            last_datetime = datetime.strptime(last_date, "%Y-%m-%d")
            days_diff = (now.date() - last_datetime.date()).days
            
            if days_diff == 1:
                current_streak += 1
            elif days_diff > 1:
                current_streak = 1
            # If same day, keep streak
        else:
            current_streak = 1
        
        # Update
        update_query = {
            "$set": {
                "total_xp": new_total_xp,
                "level": level_info["level"],
                "level_name": level_info["name"],
                "streak_days": current_streak,
                "last_activity_date": today
            },
            "$push": {
                "completed_challenges": challenge_record
            }
        }
        
        if completion.needs_parent_validation:
            update_query["$push"]["pending_validations"] = challenge_record
        
        await db.gamification_stats.update_one(
            {"user_id": user_id},
            update_query
        )
        
        stats["total_xp"] = new_total_xp
        stats["level"] = level_info["level"]
        stats["level_name"] = level_info["name"]
        stats["streak_days"] = current_streak
    
    # Check for new badges
    new_badges = await check_and_award_badges(user_id, stats)
    
    return {
        "success": True,
        "xp_awarded": xp_to_award,
        "total_xp": stats.get("total_xp", 0) + xp_to_award,
        "level": level_info["level"],
        "level_name": level_info["name"],
        "streak_days": stats.get("streak_days", 1),
        "new_badges": new_badges,
        "needs_validation": completion.needs_parent_validation
    }

async def check_and_award_badges(user_id: str, stats: dict) -> List[dict]:
    """Check and award badges based on achievements"""
    new_badges = []
    current_badges = [b.get("badge_id") for b in stats.get("badges", [])]
    
    badges_to_check = [
        {"badge_id": "first_step", "badge_name": "Premier Pas", "badge_icon": "👣", "badge_description": "Premier entraînement", "condition": lambda s: s.get("attendance_count", 0) >= 1},
        {"badge_id": "streak_3", "badge_name": "Persévérant", "badge_icon": "🔥", "badge_description": "3 jours d'affilée", "condition": lambda s: s.get("streak_days", 0) >= 3},
        {"badge_id": "streak_7", "badge_name": "Assidu", "badge_icon": "💪", "badge_description": "7 jours d'affilée", "condition": lambda s: s.get("streak_days", 0) >= 7},
        {"badge_id": "streak_30", "badge_name": "Marathonien", "badge_icon": "🏃", "badge_description": "30 jours d'affilée", "condition": lambda s: s.get("streak_days", 0) >= 30},
        {"badge_id": "xp_100", "badge_name": "Débutant", "badge_icon": "⭐", "badge_description": "100 XP gagnés", "condition": lambda s: s.get("total_xp", 0) >= 100},
        {"badge_id": "xp_500", "badge_name": "Apprenti", "badge_icon": "🌟", "badge_description": "500 XP gagnés", "condition": lambda s: s.get("total_xp", 0) >= 500},
        {"badge_id": "xp_1000", "badge_name": "Confirmé", "badge_icon": "✨", "badge_description": "1000 XP gagnés", "condition": lambda s: s.get("total_xp", 0) >= 1000},
        {"badge_id": "level_5", "badge_name": "Ninja Rapide", "badge_icon": "🥷", "badge_description": "Niveau 5 atteint", "condition": lambda s: s.get("level", 1) >= 5},
        {"badge_id": "level_10", "badge_name": "Dragon Suprême", "badge_icon": "🐉", "badge_description": "Niveau 10 atteint", "condition": lambda s: s.get("level", 1) >= 10},
        {"badge_id": "tech_5", "badge_name": "Technicien", "badge_icon": "🥋", "badge_description": "5 techniques validées", "condition": lambda s: s.get("techniques_validated", 0) >= 5},
        {"badge_id": "tech_10", "badge_name": "Expert", "badge_icon": "🎯", "badge_description": "10 techniques validées", "condition": lambda s: s.get("techniques_validated", 0) >= 10},
    ]
    
    now = datetime.now(timezone.utc).isoformat()
    
    for badge in badges_to_check:
        if badge["badge_id"] not in current_badges and badge["condition"](stats):
            badge_award = {
                "badge_id": badge["badge_id"],
                "badge_name": badge["badge_name"],
                "badge_icon": badge["badge_icon"],
                "badge_description": badge["badge_description"],
                "awarded_at": now
            }
            new_badges.append(badge_award)
            
            # Award badge in database
            await db.gamification_stats.update_one(
                {"user_id": user_id},
                {"$push": {"badges": badge_award}}
            )
    
    return new_badges

@api_router.post("/gamification/attendance")
async def record_attendance(
    record: AttendanceRecord,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Record attendance at dojo training"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # Verify token and get user
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    now = datetime.now(timezone.utc)
    
    # Check if already recorded for this date
    existing = await db.attendance_records.find_one({
        "user_id": user_id,
        "date": record.date
    })
    
    if existing:
        return {"success": True, "message": "Attendance already recorded", "already_exists": True}
    
    # Record attendance
    attendance_doc = {
        "user_id": user_id,
        "date": record.date,
        "attended": record.attended,
        "recorded_at": now.isoformat()
    }
    await db.attendance_records.insert_one(attendance_doc)
    
    # Update gamification stats
    xp_reward = 25  # XP for attending class
    
    stats = await db.gamification_stats.find_one({"user_id": user_id})
    
    if stats:
        new_total_xp = stats.get("total_xp", 0) + xp_reward
        level_info = get_level_from_xp(new_total_xp)
        
        await db.gamification_stats.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "total_xp": new_total_xp,
                    "level": level_info["level"],
                    "level_name": level_info["name"]
                },
                "$inc": {"attendance_count": 1}
            }
        )
    else:
        # Create new stats
        level_info = get_level_from_xp(xp_reward)
        new_stats = {
            "user_id": user_id,
            "total_xp": xp_reward,
            "level": level_info["level"],
            "level_name": level_info["name"],
            "streak_days": 1,
            "last_activity_date": record.date,
            "badges": [],
            "completed_challenges": [],
            "pending_validations": [],
            "attendance_count": 1,
            "techniques_validated": 0,
            "created_at": now.isoformat()
        }
        await db.gamification_stats.insert_one(new_stats)
    
    # Check for attendance badges
    updated_stats = await db.gamification_stats.find_one({"user_id": user_id}, {"_id": 0})
    new_badges = await check_and_award_badges(user_id, updated_stats)
    
    return {
        "success": True,
        "xp_awarded": xp_reward,
        "attendance_count": updated_stats.get("attendance_count", 1),
        "new_badges": new_badges
    }

@api_router.post("/gamification/validate-challenge/{challenge_id}")
async def validate_challenge_by_parent(
    challenge_id: str,
    user_id: str,
    approved: bool = True,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Parent validates a pending challenge"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # TODO: Verify parent has permission to validate this user's challenges
    
    now = datetime.now(timezone.utc)
    
    # Find the pending validation
    stats = await db.gamification_stats.find_one({"user_id": user_id})
    
    if not stats:
        raise HTTPException(status_code=404, detail="User stats not found")
    
    pending = None
    for p in stats.get("pending_validations", []):
        if p.get("challenge_id") == challenge_id:
            pending = p
            break
    
    if not pending:
        raise HTTPException(status_code=404, detail="Pending validation not found")
    
    # Update the challenge status
    new_status = ChallengeStatus.VALIDATED if approved else ChallengeStatus.REJECTED
    xp_to_award = pending.get("xp_reward", 0) if approved else 0
    
    # Remove from pending validations
    await db.gamification_stats.update_one(
        {"user_id": user_id},
        {
            "$pull": {"pending_validations": {"challenge_id": challenge_id}},
            "$set": {
                "completed_challenges.$[elem].status": new_status,
                "completed_challenges.$[elem].validated_at": now.isoformat()
            }
        },
        array_filters=[{"elem.challenge_id": challenge_id}]
    )
    
    # Award XP if approved
    if approved and xp_to_award > 0:
        current_xp = stats.get("total_xp", 0)
        new_total_xp = current_xp + xp_to_award
        level_info = get_level_from_xp(new_total_xp)
        
        await db.gamification_stats.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "total_xp": new_total_xp,
                    "level": level_info["level"],
                    "level_name": level_info["name"]
                }
            }
        )
    
    return {
        "success": True,
        "approved": approved,
        "xp_awarded": xp_to_award if approved else 0
    }

@api_router.get("/gamification/leaderboard")
async def get_leaderboard(limit: int = 10):
    """Get top players leaderboard"""
    leaderboard = await db.gamification_stats.find(
        {},
        {"_id": 0, "user_id": 1, "total_xp": 1, "level": 1, "level_name": 1}
    ).sort("total_xp", -1).limit(limit).to_list(length=limit)
    
    # Add user names
    for i, entry in enumerate(leaderboard):
        user = await db.users.find_one(
            {"id": entry["user_id"]},
            {"_id": 0, "first_name": 1}
        )
        entry["rank"] = i + 1
        entry["name"] = user.get("first_name", "Ninja") if user else "Ninja"
    
    return leaderboard

@api_router.get("/gamification/daily-challenges")
async def get_daily_challenges():
    """Get available daily challenges"""
    # These could be stored in DB and rotated daily
    challenges = [
        {
            "id": "salut",
            "name": "Salut Parfait",
            "description": "Fais un salut (REI) parfait au début et à la fin du cours",
            "xp_reward": 10,
            "type": "daily",
            "icon": "🙏",
            "virtue": "Respect",
            "needs_parent_validation": False
        },
        {
            "id": "tai_sabaki",
            "name": "Tai Sabaki",
            "description": "Pratique un déplacement tai sabaki",
            "xp_reward": 15,
            "type": "daily",
            "icon": "🦶",
            "virtue": "Agilité",
            "needs_parent_validation": True
        },
        {
            "id": "ukemi_mae",
            "name": "Chute Avant",
            "description": "Réalise 5 chutes avant (mae ukemi) correctes",
            "xp_reward": 20,
            "type": "daily",
            "icon": "🔄",
            "virtue": "Courage",
            "needs_parent_validation": True
        },
        {
            "id": "aide",
            "name": "Coup de Main",
            "description": "Aide un camarade moins expérimenté",
            "xp_reward": 25,
            "type": "daily",
            "icon": "🤝",
            "virtue": "Bienveillance",
            "needs_parent_validation": False
        },
        {
            "id": "attention",
            "name": "Main Levée",
            "description": "Pose une question au sensei pendant le cours",
            "xp_reward": 15,
            "type": "daily",
            "icon": "✋",
            "virtue": "Attention",
            "needs_parent_validation": False
        }
    ]
    
    return challenges


# ═══════════════════════════════════════════════════════════════════════════════════
# PARENT-CHILD RELATIONSHIP ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════════

class LinkChildRequest(BaseModel):
    """Request to link a child to a parent account"""
    child_email: str
    
class ParentValidationRequest(BaseModel):
    """Request to validate/reject a child's challenge"""
    approved: bool
    comment: Optional[str] = None

@api_router.post("/parent/link-child")
async def link_child_to_parent(
    request: LinkChildRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Link a child account to the parent's account"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # Get parent from token
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        parent_id = payload.get("user_id")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    parent = await db.users.find_one({"id": parent_id}, {"_id": 0})
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")
    
    # Find child by email
    child = await db.users.find_one({"email": request.child_email.lower()}, {"_id": 0})
    if not child:
        raise HTTPException(status_code=404, detail="Compte enfant non trouvé avec cet email")
    
    # Check if child already has a parent
    if child.get("parent_id") and child["parent_id"] != parent_id:
        raise HTTPException(status_code=400, detail="Cet enfant est déjà lié à un autre parent")
    
    # Prevent self-linking
    if child["id"] == parent_id:
        raise HTTPException(status_code=400, detail="Vous ne pouvez pas vous lier à vous-même")
    
    # Update child with parent_id
    await db.users.update_one(
        {"id": child["id"]},
        {"$set": {"parent_id": parent_id}}
    )
    
    # Update parent with child_id (add to list)
    await db.users.update_one(
        {"id": parent_id},
        {"$addToSet": {"children_ids": child["id"]}}
    )
    
    return {
        "success": True,
        "message": f"Enfant {child['first_name']} lié avec succès",
        "child": {
            "id": child["id"],
            "first_name": child["first_name"],
            "last_name": child["last_name"],
            "email": child["email"]
        }
    }

@api_router.delete("/parent/unlink-child/{child_id}")
async def unlink_child_from_parent(
    child_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Unlink a child from parent's account"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        parent_id = payload.get("user_id")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Remove parent_id from child
    await db.users.update_one(
        {"id": child_id, "parent_id": parent_id},
        {"$unset": {"parent_id": ""}}
    )
    
    # Remove child from parent's list
    await db.users.update_one(
        {"id": parent_id},
        {"$pull": {"children_ids": child_id}}
    )
    
    return {"success": True, "message": "Enfant délié avec succès"}

@api_router.get("/parent/children")
async def get_parent_children(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get list of children linked to parent account"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        parent_id = payload.get("user_id")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    parent = await db.users.find_one({"id": parent_id}, {"_id": 0})
    if not parent:
        raise HTTPException(status_code=404, detail="User not found")
    
    children_ids = parent.get("children_ids", [])
    
    children = []
    for child_id in children_ids:
        child = await db.users.find_one({"id": child_id}, {"_id": 0, "password_hash": 0})
        if child:
            # Get child's gamification stats
            stats = await db.gamification_stats.find_one({"user_id": child_id}, {"_id": 0})
            children.append({
                "id": child["id"],
                "first_name": child["first_name"],
                "last_name": child["last_name"],
                "email": child["email"],
                "belt_level": child.get("belt_level", "6e_kyu"),
                "gamification": {
                    "total_xp": stats.get("total_xp", 0) if stats else 0,
                    "level": stats.get("level", 1) if stats else 1,
                    "level_name": stats.get("level_name", "Petit Scarabée") if stats else "Petit Scarabée",
                    "pending_validations": stats.get("pending_validations", []) if stats else []
                }
            })
    
    return {"children": children}

@api_router.get("/parent/pending-validations")
async def get_parent_pending_validations(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get all pending validations for parent's children"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        parent_id = payload.get("user_id")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    parent = await db.users.find_one({"id": parent_id}, {"_id": 0})
    if not parent:
        raise HTTPException(status_code=404, detail="User not found")
    
    children_ids = parent.get("children_ids", [])
    
    all_pending = []
    for child_id in children_ids:
        child = await db.users.find_one({"id": child_id}, {"_id": 0})
        stats = await db.gamification_stats.find_one({"user_id": child_id}, {"_id": 0})
        
        if stats and stats.get("pending_validations"):
            for pending in stats["pending_validations"]:
                all_pending.append({
                    "child_id": child_id,
                    "child_name": f"{child['first_name']} {child['last_name']}" if child else "Inconnu",
                    "challenge_id": pending.get("challenge_id"),
                    "challenge_name": pending.get("challenge_name"),
                    "challenge_type": pending.get("challenge_type"),
                    "xp_reward": pending.get("xp_reward", 0),
                    "completed_at": pending.get("completed_at"),
                    "status": pending.get("status", "pending")
                })
    
    # Sort by completed_at (most recent first)
    all_pending.sort(key=lambda x: x.get("completed_at", ""), reverse=True)
    
    return {"pending_validations": all_pending, "count": len(all_pending)}

@api_router.post("/parent/validate/{child_id}/{challenge_id}")
async def parent_validate_challenge(
    child_id: str,
    challenge_id: str,
    request: ParentValidationRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Parent validates or rejects a child's challenge"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        parent_id = payload.get("user_id")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Verify parent-child relationship
    parent = await db.users.find_one({"id": parent_id}, {"_id": 0})
    if not parent or child_id not in parent.get("children_ids", []):
        raise HTTPException(status_code=403, detail="Vous n'êtes pas autorisé à valider les défis de cet enfant")
    
    child = await db.users.find_one({"id": child_id}, {"_id": 0})
    if not child:
        raise HTTPException(status_code=404, detail="Enfant non trouvé")
    
    # Find the pending validation
    stats = await db.gamification_stats.find_one({"user_id": child_id})
    if not stats:
        raise HTTPException(status_code=404, detail="Stats non trouvées pour cet enfant")
    
    pending = None
    for p in stats.get("pending_validations", []):
        if p.get("challenge_id") == challenge_id:
            pending = p
            break
    
    if not pending:
        raise HTTPException(status_code=404, detail="Défi en attente non trouvé")
    
    now = datetime.now(timezone.utc)
    new_status = ChallengeStatus.VALIDATED if request.approved else ChallengeStatus.REJECTED
    xp_to_award = pending.get("xp_reward", 0) if request.approved else 0
    
    # Update challenge status in completed_challenges
    await db.gamification_stats.update_one(
        {"user_id": child_id},
        {
            "$pull": {"pending_validations": {"challenge_id": challenge_id}},
            "$set": {
                "completed_challenges.$[elem].status": new_status,
                "completed_challenges.$[elem].validated_at": now.isoformat(),
                "completed_challenges.$[elem].validated_by": parent_id,
                "completed_challenges.$[elem].validation_comment": request.comment
            }
        },
        array_filters=[{"elem.challenge_id": challenge_id}]
    )
    
    # Award XP if approved
    if request.approved and xp_to_award > 0:
        current_xp = stats.get("total_xp", 0)
        new_total_xp = current_xp + xp_to_award
        level_info = get_level_from_xp(new_total_xp)
        
        await db.gamification_stats.update_one(
            {"user_id": child_id},
            {
                "$set": {
                    "total_xp": new_total_xp,
                    "level": level_info["level"],
                    "level_name": level_info["name"]
                }
            }
        )
        
        # Check for badges
        new_badges = []
        existing_badges = [b.get("badge_id") for b in stats.get("badges", [])]
        
        if "parent_approved" not in existing_badges:
            new_badge = {
                "badge_id": "parent_approved",
                "badge_name": "Validé par les parents",
                "badge_icon": "👨‍👩‍👧",
                "badge_description": "Premier défi validé par un parent",
                "awarded_at": now.isoformat()
            }
            new_badges.append(new_badge)
            await db.gamification_stats.update_one(
                {"user_id": child_id},
                {"$push": {"badges": new_badge}}
            )
    
    return {
        "success": True,
        "approved": request.approved,
        "child_name": f"{child['first_name']} {child['last_name']}",
        "challenge_name": pending.get("challenge_name"),
        "xp_awarded": xp_to_award if request.approved else 0,
        "message": f"Défi {'validé' if request.approved else 'refusé'} pour {child['first_name']}"
    }

@api_router.get("/parent/child-stats/{child_id}")
async def get_child_stats_for_parent(
    child_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get detailed stats for a specific child"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        parent_id = payload.get("user_id")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Verify parent-child relationship
    parent = await db.users.find_one({"id": parent_id}, {"_id": 0})
    if not parent or child_id not in parent.get("children_ids", []):
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    child = await db.users.find_one({"id": child_id}, {"_id": 0, "password_hash": 0})
    if not child:
        raise HTTPException(status_code=404, detail="Enfant non trouvé")
    
    stats = await db.gamification_stats.find_one({"user_id": child_id}, {"_id": 0})
    
    return {
        "child": {
            "id": child["id"],
            "first_name": child["first_name"],
            "last_name": child["last_name"],
            "belt_level": child.get("belt_level", "6e_kyu")
        },
        "stats": stats or {
            "total_xp": 0,
            "level": 1,
            "level_name": "Petit Scarabée",
            "streak_days": 0,
            "badges": [],
            "completed_challenges": [],
            "pending_validations": [],
            "attendance_count": 0
        }
    }


# Include the router in the main app
app.include_router(api_router)

# Import and include voice agent router
from voice_agent import voice_router
app.include_router(voice_router)

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
