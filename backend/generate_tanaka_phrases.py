"""
Script pour générer les phrases pré-enregistrées de Maître Tanaka
Ces audios seront stockés et réutilisés pour économiser les appels API
"""

import os
import base64
from pathlib import Path
from dotenv import load_dotenv
from elevenlabs import ElevenLabs

load_dotenv()

ELEVENLABS_API_KEY = os.environ.get('ELEVENLABS_API_KEY')
eleven_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

# Voice ID for Maître Tanaka
VOICE_ID = "pNInz6obpgDQGcFmaJgB"  # Adam - deep male voice

# Directory for storing pre-recorded phrases
OUTPUT_DIR = Path(__file__).parent.parent / "frontend" / "public" / "audio" / "tanaka"

# Phrases pré-enregistrées par catégorie
PHRASES = {
    # Bienvenue et salutations
    "welcome": {
        "text": "Bienvenue dans mon dojo virtuel, jeune ninja ! Je suis Maître Tanaka, ton guide sur la Voie de l'Aïkido. Ho ho ho...",
        "filename": "welcome.mp3"
    },
    "hello_morning": {
        "text": "Ohayo gozaimasu, petit guerrier ! Que cette journée soit riche en apprentissages !",
        "filename": "hello_morning.mp3"
    },
    "hello_afternoon": {
        "text": "Konnichiwa, jeune ninja ! Es-tu prêt pour ta pratique aujourd'hui ?",
        "filename": "hello_afternoon.mp3"
    },
    "goodbye": {
        "text": "Sayonara, mon enfant. Continue de pratiquer avec cœur. À bientôt sur le tatami !",
        "filename": "goodbye.mp3"
    },
    
    # Défis complétés
    "challenge_complete": {
        "text": "Bravo, petit guerrier ! Tu as relevé ce défi avec brio ! Comme le bambou qui plie mais ne rompt jamais, tu montres une belle persévérance.",
        "filename": "challenge_complete.mp3"
    },
    "challenge_first": {
        "text": "Ho ho ho ! Ton premier défi est accompli ! C'est le premier pas sur un long chemin. Je suis fier de toi, jeune ninja !",
        "filename": "challenge_first.mp3"
    },
    "challenge_hard": {
        "text": "Incroyable ! Ce défi était difficile, mais tu l'as surmonté ! Comme disait O-Sensei : La vraie victoire est celle sur soi-même.",
        "filename": "challenge_hard.mp3"
    },
    
    # Nouvelles ceintures
    "belt_white": {
        "text": "Bienvenue sur le chemin de l'Aïkido, jeune débutant ! Ta ceinture blanche symbolise la pureté de ton esprit, prêt à apprendre.",
        "filename": "belt_white.mp3"
    },
    "belt_yellow": {
        "text": "Félicitations pour ta ceinture jaune ! Comme le soleil levant, tu commences à briller. Continue ainsi, petit guerrier !",
        "filename": "belt_yellow.mp3"
    },
    "belt_orange": {
        "text": "Ho ho ho ! Ta ceinture orange montre ta progression ! Comme la flamme, tu gagnes en intensité. Magnifique !",
        "filename": "belt_orange.mp3"
    },
    "belt_green": {
        "text": "Ceinture verte ! Comme l'arbre qui grandit, tes racines dans l'Aïkido deviennent profondes. Je suis très fier de toi !",
        "filename": "belt_green.mp3"
    },
    "belt_blue": {
        "text": "La ceinture bleue, comme le ciel infini ! Tes possibilités sont sans limites maintenant. Continue à explorer la Voie !",
        "filename": "belt_blue.mp3"
    },
    "belt_brown": {
        "text": "Ceinture marron ! Tu approches de la maîtrise. Comme la montagne, tu es solide et stable. Quel chemin parcouru !",
        "filename": "belt_brown.mp3"
    },
    "belt_black": {
        "text": "La ceinture noire ! Ho ho ho ! Ce n'est pas la fin, mais un nouveau commencement. Maintenant, le vrai apprentissage commence !",
        "filename": "belt_black.mp3"
    },
    
    # Séries de pratique (streaks)
    "streak_3": {
        "text": "Trois jours consécutifs ! La régularité forge le caractère, jeune ninja. Continue ainsi !",
        "filename": "streak_3.mp3"
    },
    "streak_7": {
        "text": "Une semaine complète de pratique ! Ho ho ho ! Comme l'eau qui sculpte la pierre, ta persévérance porte ses fruits !",
        "filename": "streak_7.mp3"
    },
    "streak_14": {
        "text": "Deux semaines sans relâche ! Tu montres un véritable esprit de Budoka. Ton dévouement m'impressionne, petit guerrier !",
        "filename": "streak_14.mp3"
    },
    "streak_21": {
        "text": "Trois semaines de pratique ! Incroyable ! Comme disait O-Sensei : L'Aïkido n'est pas une technique, c'est une façon de vivre. Tu l'as compris !",
        "filename": "streak_21.mp3"
    },
    
    # Encouragements généraux
    "encourage_practice": {
        "text": "N'oublie pas, jeune ninja : la pratique quotidienne, même courte, vaut mieux qu'une longue séance occasionnelle.",
        "filename": "encourage_practice.mp3"
    },
    "encourage_patience": {
        "text": "Patience, petit guerrier. La maîtrise vient avec le temps. Chaque erreur est un pas vers la perfection.",
        "filename": "encourage_patience.mp3"
    },
    "encourage_comeback": {
        "text": "Te revoilà ! L'important n'est pas de tomber, mais de se relever. Je suis content de te revoir !",
        "filename": "encourage_comeback.mp3"
    },
    
    # XP et niveaux
    "xp_gained": {
        "text": "Bien joué ! Tu gagnes de l'expérience. Chaque point te rapproche de la maîtrise !",
        "filename": "xp_gained.mp3"
    },
    "level_up": {
        "text": "Ho ho ho ! Tu montes de niveau ! Ton esprit grandit, ton corps s'améliore. Continue sur cette voie !",
        "filename": "level_up.mp3"
    },
    
    # Technique maîtrisée
    "technique_mastered": {
        "text": "Cette technique est maintenant gravée dans ton corps ! Comme le dit le proverbe : Pratique dix mille fois, et la technique devient naturelle.",
        "filename": "technique_mastered.mp3"
    },
    
    # Erreurs et échecs (encouragements)
    "fail_encourage": {
        "text": "Ne t'inquiète pas, jeune ninja. L'échec est le meilleur professeur. Essaie encore, tu y arriveras !",
        "filename": "fail_encourage.mp3"
    },
    
    # Badges
    "badge_earned": {
        "text": "Un nouveau badge ! Chaque badge raconte une partie de ton histoire. Collectionne-les avec fierté !",
        "filename": "badge_earned.mp3"
    }
}


def generate_audio(text: str, output_path: Path) -> bool:
    """Generate audio file from text using ElevenLabs TTS"""
    try:
        audio_generator = eleven_client.text_to_speech.convert(
            text=text,
            voice_id=VOICE_ID,
            model_id="eleven_multilingual_v2",
            voice_settings={
                "stability": 0.6,
                "similarity_boost": 0.8,
                "style": 0.3,
                "use_speaker_boost": True
            }
        )
        
        audio_data = b""
        for chunk in audio_generator:
            audio_data += chunk
        
        with open(output_path, "wb") as f:
            f.write(audio_data)
        
        return True
    except Exception as e:
        print(f"Error generating {output_path}: {e}")
        return False


def main():
    """Generate all pre-recorded phrases"""
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    print(f"🎙️ Generating pre-recorded phrases for Maître Tanaka...")
    print(f"📁 Output directory: {OUTPUT_DIR}")
    print(f"🔑 Using voice ID: {VOICE_ID}")
    print("-" * 50)
    
    success_count = 0
    total = len(PHRASES)
    
    for key, phrase_data in PHRASES.items():
        output_path = OUTPUT_DIR / phrase_data["filename"]
        
        # Skip if already exists
        if output_path.exists():
            print(f"⏭️  Skipping {key} (already exists)")
            success_count += 1
            continue
        
        print(f"🔊 Generating: {key}...")
        print(f"   Text: {phrase_data['text'][:50]}...")
        
        if generate_audio(phrase_data["text"], output_path):
            print(f"   ✅ Saved to {phrase_data['filename']}")
            success_count += 1
        else:
            print(f"   ❌ Failed!")
    
    print("-" * 50)
    print(f"✅ Generated {success_count}/{total} audio files")
    print(f"📁 Files saved in: {OUTPUT_DIR}")
    
    # Generate manifest file
    manifest = {
        "voice_id": VOICE_ID,
        "phrases": {k: {"text": v["text"], "file": f"/audio/tanaka/{v['filename']}"} for k, v in PHRASES.items()}
    }
    
    import json
    manifest_path = OUTPUT_DIR / "manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    
    print(f"📋 Manifest saved to: {manifest_path}")


if __name__ == "__main__":
    main()
