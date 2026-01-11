"""
Email Service - Resend Integration
Handles password reset and parent notifications
"""

import os
import asyncio
import logging
import secrets
from datetime import datetime, timezone, timedelta
from typing import Optional
import resend
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Configuration
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

# Initialize Resend
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# ═══════════════════════════════════════════════════════════════════════════════════
# EMAIL TEMPLATES
# ═══════════════════════════════════════════════════════════════════════════════════

def get_password_reset_template(user_name: str, reset_link: str) -> str:
    """HTML template for password reset email"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden;">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 30px; text-align: center;">
                                <h1 style="color: white; margin: 0; font-size: 28px;">🥋 Aikido@Game</h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="color: #f8fafc; margin: 0 0 20px 0; font-size: 24px;">
                                    Réinitialisation de mot de passe
                                </h2>
                                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    Bonjour <strong style="color: #f59e0b;">{user_name}</strong>,
                                </p>
                                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                    Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
                                </p>
                                
                                <!-- Button -->
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center">
                                            <a href="{reset_link}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                                                Réinitialiser mon mot de passe
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                                    Ce lien expire dans <strong>1 heure</strong>.<br>
                                    Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #0f172a; padding: 20px 30px; text-align: center;">
                                <p style="color: #475569; font-size: 12px; margin: 0;">
                                    © 2025 Aikido@Game - HUMAN KNOWLEDGE<br>
                                    Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """


def get_parent_observation_template(
    parent_name: str,
    child_name: str,
    teacher_name: str,
    observation_type: str,
    observation_content: str,
    observation_date: str
) -> str:
    """HTML template for parent notification - new observation"""
    
    type_colors = {
        "progress": "#10b981",
        "comportement": "#f59e0b",
        "technique": "#3b82f6",
        "encouragement": "#8b5cf6",
        "autre": "#64748b"
    }
    type_color = type_colors.get(observation_type, "#64748b")
    
    type_labels = {
        "progress": "📈 Progression",
        "comportement": "🎯 Comportement",
        "technique": "🥋 Technique",
        "encouragement": "⭐ Encouragement",
        "autre": "📝 Note"
    }
    type_label = type_labels.get(observation_type, "📝 Note")
    
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden;">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 30px; text-align: center;">
                                <h1 style="color: white; margin: 0; font-size: 28px;">🥋 Aikido@Game</h1>
                                <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px;">Espace Parent</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="color: #f8fafc; margin: 0 0 20px 0; font-size: 24px;">
                                    Nouvelle observation pour {child_name}
                                </h2>
                                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    Bonjour <strong style="color: #ec4899;">{parent_name}</strong>,
                                </p>
                                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                    L'enseignant <strong style="color: #f8fafc;">{teacher_name}</strong> a ajouté une nouvelle observation concernant votre enfant.
                                </p>
                                
                                <!-- Observation Card -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; border-radius: 12px; border-left: 4px solid {type_color};">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <p style="color: {type_color}; font-size: 12px; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase;">
                                                {type_label}
                                            </p>
                                            <p style="color: #f8fafc; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                                                {observation_content}
                                            </p>
                                            <p style="color: #64748b; font-size: 12px; margin: 0;">
                                                {observation_date}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                                    Connectez-vous à votre espace parent pour voir toutes les observations et messages.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #0f172a; padding: 20px 30px; text-align: center;">
                                <p style="color: #475569; font-size: 12px; margin: 0;">
                                    © 2025 Aikido@Game - HUMAN KNOWLEDGE<br>
                                    Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """


def get_parent_message_template(
    parent_name: str,
    child_name: str,
    teacher_name: str,
    message_subject: str,
    message_preview: str
) -> str:
    """HTML template for parent notification - new message"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden;">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 30px; text-align: center;">
                                <h1 style="color: white; margin: 0; font-size: 28px;">🥋 Aikido@Game</h1>
                                <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px;">Espace Parent</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="color: #f8fafc; margin: 0 0 20px 0; font-size: 24px;">
                                    📬 Nouveau message de l'enseignant
                                </h2>
                                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    Bonjour <strong style="color: #ec4899;">{parent_name}</strong>,
                                </p>
                                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                    <strong style="color: #f8fafc;">{teacher_name}</strong> vous a envoyé un message concernant <strong style="color: #f8fafc;">{child_name}</strong>.
                                </p>
                                
                                <!-- Message Card -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; border-radius: 12px;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <p style="color: #f59e0b; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">
                                                {message_subject}
                                            </p>
                                            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0;">
                                                {message_preview}...
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                                    Connectez-vous à votre espace parent pour lire le message complet et y répondre.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #0f172a; padding: 20px 30px; text-align: center;">
                                <p style="color: #475569; font-size: 12px; margin: 0;">
                                    © 2025 Aikido@Game - HUMAN KNOWLEDGE<br>
                                    Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """


# ═══════════════════════════════════════════════════════════════════════════════════
# EMAIL SENDING FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════════

async def send_email(to_email: str, subject: str, html_content: str) -> dict:
    """Send an email using Resend (async, non-blocking)"""
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not configured, skipping email")
        return {"status": "skipped", "message": "Email service not configured"}
    
    params = {
        "from": SENDER_EMAIL,
        "to": [to_email],
        "subject": subject,
        "html": html_content
    }
    
    try:
        # Run sync SDK in thread to keep FastAPI non-blocking
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent to {to_email}: {subject}")
        return {
            "status": "success",
            "message": f"Email sent to {to_email}",
            "email_id": result.get("id") if isinstance(result, dict) else str(result)
        }
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return {
            "status": "error",
            "message": str(e)
        }


async def send_password_reset_email(to_email: str, user_name: str, reset_link: str) -> dict:
    """Send password reset email"""
    html_content = get_password_reset_template(user_name, reset_link)
    return await send_email(
        to_email=to_email,
        subject="🔐 Réinitialisation de votre mot de passe - Aikido@Game",
        html_content=html_content
    )


async def send_parent_observation_notification(
    parent_email: str,
    parent_name: str,
    child_name: str,
    teacher_name: str,
    observation_type: str,
    observation_content: str,
    observation_date: str
) -> dict:
    """Send notification to parent when teacher adds observation"""
    html_content = get_parent_observation_template(
        parent_name=parent_name,
        child_name=child_name,
        teacher_name=teacher_name,
        observation_type=observation_type,
        observation_content=observation_content,
        observation_date=observation_date
    )
    return await send_email(
        to_email=parent_email,
        subject=f"📝 Nouvelle observation pour {child_name} - Aikido@Game",
        html_content=html_content
    )


async def send_parent_message_notification(
    parent_email: str,
    parent_name: str,
    child_name: str,
    teacher_name: str,
    message_subject: str,
    message_preview: str
) -> dict:
    """Send notification to parent when teacher sends message"""
    html_content = get_parent_message_template(
        parent_name=parent_name,
        child_name=child_name,
        teacher_name=teacher_name,
        message_subject=message_subject,
        message_preview=message_preview[:150]  # Limit preview length
    )
    return await send_email(
        to_email=parent_email,
        subject=f"📬 Message de {teacher_name} - Aikido@Game",
        html_content=html_content
    )


# ═══════════════════════════════════════════════════════════════════════════════════
# PASSWORD RESET TOKEN MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════════════

def generate_reset_token() -> str:
    """Generate a secure reset token"""
    return secrets.token_urlsafe(32)


def get_token_expiry() -> datetime:
    """Get token expiry time (1 hour from now)"""
    return datetime.now(timezone.utc) + timedelta(hours=1)


def is_token_expired(expiry: datetime) -> bool:
    """Check if token is expired"""
    if isinstance(expiry, str):
        expiry = datetime.fromisoformat(expiry.replace('Z', '+00:00'))
    return datetime.now(timezone.utc) > expiry
