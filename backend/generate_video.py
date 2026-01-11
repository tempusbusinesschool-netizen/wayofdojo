#!/usr/bin/env python3
"""
Aikido@Game - Video Generator with ElevenLabs French Narration
Generates a promotional video with screenshots and AI voice narration
"""

import os
import io
from pathlib import Path
from elevenlabs import ElevenLabs
from moviepy import ImageClip, AudioFileClip, concatenate_videoclips, CompositeVideoClip, TextClip
from PIL import Image, ImageDraw, ImageFont
import tempfile

# Configuration
ELEVENLABS_API_KEY = os.environ.get('ELEVENLABS_API_KEY', 'sk_6aa387a6c62b497228aca02e3be4468cb31ab90447e23aa9')
IMAGES_PATH = Path("/app/backend/guide_images")
OUTPUT_PATH = Path("/app/frontend/public/Aikido_Game_Video.mp4")

# French voice - Charlotte (dynamic French female voice)
VOICE_ID = "XB0fDUnXU5powFXDhCwa"

# Video sections with narration text (kept short for 2-3 min video)
VIDEO_SECTIONS = [
    {
        "image": "fresh_01_accueil.jpeg",
        "title": "Bienvenue",
        "narration": "Bienvenue dans Aikido at Game, votre parcours Aikido interactif. "
                     "Cette application unique combine l'apprentissage traditionnel des arts martiaux japonais "
                     "avec une approche ludique et moderne. Découvrez plus de 206 techniques, 10 grades et 84 défis à relever.",
        "duration": 12
    },
    {
        "image": "guide_02_visiteur.jpeg",
        "title": "Deux Modes",
        "narration": "Choisissez votre mode de navigation. Le mode Jeune Ninja est conçu pour les enfants "
                     "avec une interface colorée et ludique. Le mode Ninja Confirmé propose une expérience "
                     "plus professionnelle pour les adolescents et adultes.",
        "duration": 10
    },
    {
        "image": "guide_03_programme.jpeg",
        "title": "Le Programme",
        "narration": "Parcourez le programme complet d'Aikido, organisé par grade. "
                     "Des techniques de base aux mouvements avancés, chaque grade vous guide vers la maîtrise.",
        "duration": 8
    },
    {
        "image": "guide_04_technique.jpeg",
        "title": "Détails Techniques",
        "narration": "Chaque technique dispose d'une fiche complète : nom japonais, description détaillée, "
                     "points clés et conseils de pratique. Suivez votre niveau de maîtrise pour chaque mouvement.",
        "duration": 9
    },
    {
        "image": "guide_08_dashboard_main.jpeg",
        "title": "Tableau de Bord",
        "narration": "Votre tableau de bord personnel centralise votre progression. "
                     "Visualisez vos points, vos techniques maîtrisées et vos défis complétés en un coup d'œil.",
        "duration": 8
    },
    {
        "image": "guide_10_blocs.jpeg",
        "title": "Les 4 Blocs",
        "narration": "L'apprentissage est structuré en quatre blocs : Commence, Découvre, Progresse et Maîtrise. "
                     "Chaque étape vous rapproche de l'excellence.",
        "duration": 8
    },
    {
        "image": "guide_11_enseignant.jpeg",
        "title": "Espace Enseignant",
        "narration": "Les professeurs disposent d'un espace dédié pour suivre leurs élèves, "
                     "ajouter des observations et communiquer avec les parents.",
        "duration": 7
    }
]

# Closing section
CLOSING_NARRATION = "Aikido at Game. 100% gratuit, sans publicité et conforme RGPD. " \
                    "Commencez votre parcours dès aujourd'hui ! Rendez-vous sur notre site."


def generate_audio(client, text, output_path):
    """Generate audio file using ElevenLabs TTS"""
    print(f"  Generating audio: {text[:50]}...")
    
    audio = client.text_to_speech.convert(
        text=text,
        voice_id=VOICE_ID,
        model_id="eleven_multilingual_v2"
    )
    
    with open(output_path, 'wb') as f:
        for chunk in audio:
            f.write(chunk)
    
    return output_path


def create_title_overlay(image_path, title, output_path):
    """Add a title overlay to the image"""
    img = Image.open(image_path)
    draw = ImageDraw.Draw(img)
    
    # Try to load a font, fallback to default
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
    except:
        font = ImageFont.load_default()
    
    # Add semi-transparent banner at top
    banner_height = 80
    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rectangle([(0, 0), (img.width, banner_height)], fill=(0, 0, 0, 180))
    
    # Convert to RGBA if needed
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    img = Image.alpha_composite(img, overlay)
    
    # Add title text
    draw = ImageDraw.Draw(img)
    
    # Calculate text position (centered)
    try:
        text_bbox = draw.textbbox((0, 0), title, font=font)
        text_width = text_bbox[2] - text_bbox[0]
    except:
        text_width = len(title) * 25
    
    x = (img.width - text_width) // 2
    y = (banner_height - 48) // 2
    
    # Draw text with golden color
    draw.text((x, y), title, fill=(212, 175, 55), font=font)
    
    # Save as RGB
    img = img.convert('RGB')
    img.save(output_path, 'JPEG', quality=90)
    
    return output_path


def create_intro_image():
    """Create an intro image"""
    img = Image.new('RGB', (1920, 1080), color=(26, 26, 46))
    draw = ImageDraw.Draw(img)
    
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    
    # Title
    title = "Aikido@Game"
    draw.text((960, 400), title, fill=(212, 175, 55), font=title_font, anchor="mm")
    
    # Subtitle
    subtitle = "Votre parcours Aikido interactif"
    draw.text((960, 500), subtitle, fill=(0, 206, 209), font=subtitle_font, anchor="mm")
    
    # Stats
    stats = "206+ Techniques  •  10 Grades  •  84 Défis"
    draw.text((960, 600), stats, fill=(200, 200, 200), font=subtitle_font, anchor="mm")
    
    output_path = IMAGES_PATH / "intro_slide.jpeg"
    img.save(output_path, 'JPEG', quality=90)
    return output_path


def create_outro_image():
    """Create an outro/closing image"""
    img = Image.new('RGB', (1920, 1080), color=(26, 26, 46))
    draw = ImageDraw.Draw(img)
    
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    # Title
    title = "Aikido@Game"
    draw.text((960, 350), title, fill=(212, 175, 55), font=title_font, anchor="mm")
    
    # Tagline
    tagline = "Commencez votre parcours aujourd'hui !"
    draw.text((960, 450), tagline, fill=(0, 206, 209), font=subtitle_font, anchor="mm")
    
    # Features
    features = [
        "✓ 100% Gratuit",
        "✓ Sans publicité", 
        "✓ Conforme RGPD"
    ]
    y_pos = 550
    for feature in features:
        draw.text((960, y_pos), feature, fill=(100, 200, 100), font=small_font, anchor="mm")
        y_pos += 50
    
    # Company
    company = "HUMAN KNOWLEDGE"
    draw.text((960, 750), company, fill=(150, 150, 150), font=small_font, anchor="mm")
    
    output_path = IMAGES_PATH / "outro_slide.jpeg"
    img.save(output_path, 'JPEG', quality=90)
    return output_path


def generate_video():
    """Generate the complete video with narration"""
    print("🎬 Génération de la vidéo Aikido@Game...")
    print("=" * 50)
    
    # Initialize ElevenLabs client
    client = ElevenLabs(api_key=ELEVENLABS_API_KEY)
    
    # Create temp directory for audio files
    temp_dir = tempfile.mkdtemp()
    
    clips = []
    
    # Create intro
    print("\n📌 Création de l'intro...")
    intro_image = create_intro_image()
    intro_audio_path = os.path.join(temp_dir, "intro_audio.mp3")
    generate_audio(client, "Bienvenue dans Aikido at Game.", intro_audio_path)
    
    intro_audio = AudioFileClip(intro_audio_path)
    intro_clip = ImageClip(str(intro_image)).with_duration(intro_audio.duration + 1)
    intro_clip = intro_clip.with_audio(intro_audio)
    intro_clip = intro_clip.resized((1920, 1080))
    clips.append(intro_clip)
    
    # Process each section
    for i, section in enumerate(VIDEO_SECTIONS):
        print(f"\n📌 Section {i+1}/{len(VIDEO_SECTIONS)}: {section['title']}")
        
        image_path = IMAGES_PATH / section['image']
        if not image_path.exists():
            print(f"  ⚠️ Image non trouvée: {image_path}")
            continue
        
        # Create image with title overlay
        overlay_path = os.path.join(temp_dir, f"overlay_{i}.jpeg")
        create_title_overlay(image_path, section['title'], overlay_path)
        
        # Generate audio
        audio_path = os.path.join(temp_dir, f"audio_{i}.mp3")
        generate_audio(client, section['narration'], audio_path)
        
        # Create video clip
        audio_clip = AudioFileClip(audio_path)
        duration = max(audio_clip.duration + 0.5, section['duration'])
        
        image_clip = ImageClip(overlay_path).with_duration(duration)
        image_clip = image_clip.with_audio(audio_clip)
        image_clip = image_clip.resized((1920, 1080))
        
        clips.append(image_clip)
        print(f"  ✅ Durée: {duration:.1f}s")
    
    # Create outro
    print("\n📌 Création de l'outro...")
    outro_image = create_outro_image()
    outro_audio_path = os.path.join(temp_dir, "outro_audio.mp3")
    generate_audio(client, CLOSING_NARRATION, outro_audio_path)
    
    outro_audio = AudioFileClip(outro_audio_path)
    outro_clip = ImageClip(str(outro_image)).with_duration(outro_audio.duration + 2)
    outro_clip = outro_clip.with_audio(outro_audio)
    outro_clip = outro_clip.resized((1920, 1080))
    clips.append(outro_clip)
    
    # Concatenate all clips
    print("\n🎞️ Assemblage de la vidéo...")
    final_video = concatenate_videoclips(clips, method="compose")
    
    # Calculate total duration
    total_duration = sum(clip.duration for clip in clips)
    print(f"📊 Durée totale: {total_duration:.1f} secondes ({total_duration/60:.1f} minutes)")
    
    # Export video
    print("\n💾 Export de la vidéo (cela peut prendre quelques minutes)...")
    final_video.write_videofile(
        str(OUTPUT_PATH),
        fps=24,
        codec='libx264',
        audio_codec='aac',
        threads=4,
        preset='medium',
        logger=None
    )
    
    # Cleanup
    for clip in clips:
        clip.close()
    final_video.close()
    
    print(f"\n✅ Vidéo générée avec succès: {OUTPUT_PATH}")
    print(f"📁 Taille: {os.path.getsize(OUTPUT_PATH) / (1024*1024):.1f} MB")
    
    return OUTPUT_PATH


if __name__ == "__main__":
    generate_video()
