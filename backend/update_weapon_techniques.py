#!/usr/bin/env python3
"""
Script pour enrichir les fiches pédagogiques des techniques d'armes (Tanto, Jo, Bokken)
avec des descriptions détaillées et des points clés d'exécution.
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Enriched weapon technique data
WEAPON_TECHNIQUE_UPDATES = [
    # TANTO DORI - SHODAN
    {
        "kyu_id": "ef811299-e276-402c-b0b5-1e0ba46ff4d1",
        "technique_id": "e75db03f-4213-4500-94e4-e0fadcc0f50a",
        "update": {
            "description": """TANTO DORI - Techniques de désarmement contre attaque au couteau (tanto).

Le tanto-dori représente l'application martiale directe de l'Aïkido. Le pratiquant apprend à neutraliser une attaque armée tout en préservant l'intégrité physique de l'attaquant.

CARACTÉRISTIQUES DU TANTO:
• Longueur: 25-30 cm (lame courte)
• Utilisé pour les coups d'estoc (tsuki) et les coupes (giri)
• Représente la menace la plus difficile à gérer (distance très courte)

PRINCIPES FONDAMENTAUX:
La distance (ma-ai) et le timing (de-ai) sont absolument cruciaux. L'attaquant peut porter des coups directs (tsuki), des coupes latérales (yokomen) ou des menaces. Le défenseur utilise principalement Gokyo (5e immobilisation) avec prise inversée pour sécuriser le désarmement.""",
            "key_points": [
                "🔪 MA-AI : Maintenir une distance de sécurité maximale - jamais à portée de lame",
                "⚡ DE-AI : Le timing d'interception est vital - trop tôt ou trop tard est dangereux", 
                "🤲 GOKYO : Utiliser la 5e immobilisation (prise inversée) pour contrôler le poignet armé",
                "🔄 TAI SABAKI : Esquive par pivots (tenkan/irimi) pour sortir de la ligne d'attaque",
                "👁️ ZANSHIN : Vigilance constante - l'arme reste dangereuse jusqu'au désarmement complet",
                "🎯 CONTRÔLE DU COUDE : Bloquer l'articulation pour immobiliser le bras armé",
                "⚠️ ATEMI : Frappes de distraction pour créer l'ouverture nécessaire"
            ],
            "practice_tips": [
                "Utiliser un tanto en bois (bokuto) ou en mousse pour l'entraînement",
                "Pratiquer d'abord LENTEMENT pour intégrer les trajectoires et distances",
                "Ne JAMAIS saisir la lame - toujours contrôler le poignet ou l'avant-bras",
                "Garder les yeux sur le tanto jusqu'au désarmement complet",
                "Respiration calme malgré le stress de la situation - maîtrise de soi",
                "Techniques principales: Gokyo, Kote gaeshi, Shiho nage, Irimi nage"
            ]
        }
    },
    # JO DORI / JO NAGE WAZA - SHODAN
    {
        "kyu_id": "ef811299-e276-402c-b0b5-1e0ba46ff4d1",
        "technique_id": "5a929a10-0afa-4a5e-9a08-f803883475d6",
        "update": {
            "description": """JO WAZA - Techniques avec le bâton (jo).

Le jo est un bâton droit d'environ 128 cm (50,4 pouces) utilisé en Aïkido pour développer la distance, la précision et l'extension du mouvement.

DEUX FAMILLES DE TECHNIQUES:
• JO DORI: Désarmement de l'adversaire armé du jo
• JO NAGE WAZA: Projections utilisant le jo comme extension du corps

ORIGINE:
Ces techniques héritées de l'Aïki-jo de Maître Morihiro Saito permettent de comprendre les principes d'Aïkido avec une arme intermédiaire entre le sabre et les mains nues. Le jo développe la notion de distance (ma-ai) et de ligne centrale (seichusen).

LE JO COMME OUTIL PÉDAGOGIQUE:
Le travail au jo renforce la compréhension des hanches, de l'extension et du contrôle du centre. Les mouvements à mains nues trouvent leur origine dans les techniques d'armes.""",
            "key_points": [
                "📏 MA-AI : Distance d'un jo (128 cm) - plus longue qu'à mains nues",
                "🪵 SAISIE : Mains espacées sur le jo, position adaptable selon la technique",
                "🔄 TAI SABAKI : Esquives circulaires en utilisant la longueur du jo",
                "⬇️ JO DORI : Désarmer en contrôlant les deux extrémités ou en pivotant autour du jo",
                "🌀 JO NAGE : Utiliser le jo comme levier pour projeter (hiji-kime, kokyu-nage)",
                "🎯 TSUKI : Coups d'estoc - Chudan (centre) ou Jodan (haut)",
                "⚔️ UCHI : Frappes - Shomen (vertical), Yokomen (diagonal), Gedan (bas)"
            ],
            "practice_tips": [
                "Pratiquer les 20 suburi de base (frappes fondamentales) régulièrement",
                "Le jo est une extension du corps - ne pas serrer excessivement",
                "En jo-dori, ne pas lutter contre la force mais la REDIRIGER",
                "Garder les hanches basses et le centre stable (hara)",
                "Les 31 mouvements de jo (31-no-jo-kata) sont une base essentielle",
                "Katas de référence: 31-jo, 13-jo, kumijo (travail en partenaire)"
            ]
        }
    },
    # TACHI DORI - SANDAN (Bokken)
    {
        "kyu_id": "04c6bf2c-6053-4c01-8f81-b6de04e7dce8",
        "technique_id": "a397ae87-e702-48f5-b6af-cc7d4a3de13e",
        "update": {
            "description": """TACHI DORI - Techniques de désarmement contre attaque au sabre de bois (bokken).

Issu des traditions martiales japonaises (koryu), le tachi-dori enseigne à neutraliser un adversaire armé d'un sabre. La compréhension du ma-ai (distance) du sabre est essentielle car une erreur peut être fatale.

PRINCIPES FONDAMENTAUX:
L'Aïkidoka apprend à entrer dans l'espace de coupe au moment PRÉCIS où l'adversaire s'engage, puis à contrôler et désarmer. C'est le principe d'IRIMI (entrer) poussé à son paroxysme.

LE BOKKEN:
• Sabre en bois (chêne ou autre bois dur)
• Longueur totale: ~101 cm
• Tsuka (poignée): ~25 cm
• Représente le katana pour l'entraînement

LA COUPE DU SABRE:
La trajectoire de coupe suit un arc depuis le haut (jodan), passant par le milieu (chudan) jusqu'en bas (gedan). Le moment optimal d'entrée est AVANT que la coupe n'atteigne sa puissance maximale.""",
            "key_points": [
                "⚔️ MA-AI DU SABRE : Distance de coupe plus longue - environ 1,5 mètre",
                "⏱️ TIMING CRITIQUE : Entrer AVANT que la coupe n'atteigne sa puissance maximale",
                "🔄 IRIMI : Entrer PROFONDÉMENT à l'intérieur de la garde adverse",
                "🤲 CONTRÔLE DES DEUX MAINS : Saisir le tsuka (poignée) ou bloquer les poignets",
                "📐 ANGLE D'ENTRÉE : Éviter la ligne de coupe en entrant en diagonale (45°)",
                "🎯 ATEMI : Frappes de distraction essentielles pour créer l'ouverture",
                "👁️ ZANSHIN : Garder la conscience même après le désarmement"
            ],
            "practice_tips": [
                "Pratiquer d'abord les coupes de base (suburi) pour comprendre la trajectoire",
                "Le bokken doit rester une VRAIE menace pendant l'entraînement",
                "Ne pas hésiter sur l'entrée - la demi-mesure est dangereuse",
                "Étudier les katas de sabre (kumitachi) pour intégrer les distances",
                "Le désarmement n'est possible que si le timing est PARFAIT",
                "Techniques principales: Shiho nage, Kote gaeshi, Irimi nage, Kokyu nage"
            ]
        }
    },
    # KUMITACHI - SANDAN
    {
        "kyu_id": "04c6bf2c-6053-4c01-8f81-b6de04e7dce8",
        "technique_id": "4db7433e-7ab1-47db-aa9c-7ea24c3c561c",
        "update": {
            "description": """KUMITACHI - Exercices codifiés de sabre à deux partenaires.

Le kumitachi (組太刀) signifie littéralement "sabres croisés". Ce sont des formes d'exercice où deux pratiquants armés de bokken exécutent des séquences codifiées de coupes, parades et contre-attaques.

OBJECTIFS PÉDAGOGIQUES:
• Développer le sens du timing (de-ai) et de la distance (ma-ai)
• Comprendre les lignes d'attaque et de défense
• Intégrer les principes d'Aïkido dans le travail armé
• Préparer aux techniques de tachi-dori (désarmement)

LES 7 KUMITACHI DE SAITO SENSEI:
1. Ichi no tachi (première forme)
2. Ni no tachi (deuxième forme)
3. San no tachi (troisième forme)
4. Yon no tachi (quatrième forme)
5. Go no tachi (cinquième forme)
6. Roku no tachi (sixième forme)
7. Nana no tachi (septième forme)""",
            "key_points": [
                "⚔️ AWASE : Synchronisation des mouvements avec le partenaire",
                "📏 MA-AI : Maintenir la distance correcte à chaque phase",
                "🎯 METSUKE : Regard fixé sur le centre du partenaire, pas sur le sabre",
                "🔄 KI-MUSUBI : Connexion énergétique avec le partenaire",
                "⬇️ COUPE CORRECTE : Shomen uchi (verticale), Yokomen (diagonale)",
                "🤝 RESPECT DU KATA : Suivre la forme exacte avant de varier"
            ],
            "practice_tips": [
                "Commencer LENTEMENT pour intégrer les formes",
                "Les deux partenaires doivent connaître leurs rôles respectifs",
                "Le rythme s'accélère uniquement quand la forme est maîtrisée",
                "Les kumitachi révèlent les principes applicables à mains nues",
                "Pratiquer des deux côtés (droite/gauche, attaquant/défenseur)"
            ]
        }
    },
    # KUMIJO - SANDAN
    {
        "kyu_id": "04c6bf2c-6053-4c01-8f81-b6de04e7dce8",
        "technique_id": "c553dfc0-5a21-4a0d-bdce-6f597b8e4872",
        "update": {
            "description": """KUMIJO - Exercices codifiés de bâton (jo) à deux partenaires.

Le kumijo (組杖) représente le travail en partenaire avec le jo. Comme pour le kumitachi, ces formes codifiées développent le sens du timing, de la distance et de la connexion avec le partenaire.

STRUCTURE DES KUMIJO:
Les kumijo de l'Aïki-jo comprennent typiquement:
• 10 kumijo de base (Saito Sensei)
• Variations et henka (adaptations)
• Applications vers le jo-dori (désarmement)

DIFFÉRENCES AVEC LE KUMITACHI:
• Distance légèrement plus grande (jo = 128 cm)
• Plus de possibilités de saisies et contrôles
• Frappes d'estoc (tsuki) plus fréquentes
• Le jo peut être utilisé à deux mains espacées

LIENS AVEC L'AÏKIDO À MAINS NUES:
Les mouvements du jo éclairent directement les techniques comme irimi nage, shiho nage, et kote gaeshi.""",
            "key_points": [
                "🪵 SAISIE ADAPTABLE : Mains mobiles sur le jo selon la technique",
                "📏 MA-AI : Plus grande qu'au sabre - utiliser toute la longueur",
                "🔄 TSUKI et UCHI : Alterner coups d'estoc et frappes",
                "🤝 AWASE : Synchronisation des mouvements",
                "⬇️ CONTRÔLE DES EXTRÉMITÉS : Les deux bouts du jo sont efficaces",
                "🎯 SEICHUSEN : Garder la ligne centrale"
            ],
            "practice_tips": [
                "Maîtriser les 20 suburi de jo avant le kumijo",
                "Le partenaire ne doit pas 'donner' les ouvertures",
                "Progresser du lent vers le rapide",
                "Les 10 kumijo de base sont la fondation",
                "Observer comment le jo 'enseigne' les mouvements à mains nues"
            ]
        }
    },
    # FONDEMENTS BOKKEN - Section Aïkiken
    {
        "kyu_id": "bf2ff7af-372d-4143-9e6a-0eaf2d2fb5a9",
        "technique_id": "40576064-a80a-479a-bf59-56315033a9e2",
        "update": {
            "description": """FONDEMENTS ET PRINCIPES DE BASE DE L'AÏKIKEN

L'enseignement des techniques au bokken constitue un champ d'étude nourri par des sources multiples, anciennes et profondément enracinées dans la tradition martiale japonaise.

SOURCES ET INFLUENCES:
• Nobuyoshi TAMURA Sensei (1933-2010)
• Kazuo CHIBA Sensei (1940-2015)
• Shoji NISHIO Sensei (1927-2005)
• Mitsugi SAOTOME Sensei (né en 1937)
• Morihiro SAITO Sensei (1928-2002) - Aïki-ken d'Iwama

PRINCIPE FONDAMENTAL:
Les principes fondamentaux du maniement du sabre PRIMENT sur les questions de style. Chaque enseignant transmet selon son parcours et ses influences, mais les bases restent universelles.

RELATION ARMES / MAINS NUES:
O-Sensei Morihei Ueshiba considérait que l'Aïkido à mains nues, au sabre et au bâton formaient un TOUT indissociable. Le ken (sabre) enseigne la distance, le timing et la coupe.""",
            "key_points": [
                "📚 ORIGINES : Héritées des koryu (écoles anciennes) et adaptées par O-Sensei",
                "⚔️ UNITÉ : Armes et mains nues forment un ensemble cohérent",
                "🎯 PRINCIPES UNIVERSELS : Distance (ma-ai), timing (de-ai), ligne centrale",
                "🔄 ADAPTABILITÉ : Le style relève de choix personnels, les principes sont fixes",
                "👤 TRANSMISSION : Chaque maître apporte sa compréhension personnelle",
                "📐 GÉOMÉTRIE : Les angles de coupe et d'entrée sont précis et codifiés"
            ],
            "practice_tips": [
                "Les principes fondamentaux sont UNIVERSELS quel que soit le style",
                "Étudier les suburi (frappes de base) avant les formes complexes",
                "Observer comment les coupes de sabre se retrouvent dans les techniques à mains nues",
                "Le bokken n'est pas un 'bâton' - il représente un vrai sabre",
                "Respecter le bokken comme une arme réelle"
            ]
        }
    },
    # TENUE DU BOKKEN - Section Aïkiken  
    {
        "kyu_id": "bf2ff7af-372d-4143-9e6a-0eaf2d2fb5a9",
        "technique_id": "45880e8e-331b-411f-bc32-b30ac538ed75",
        "update": {
            "description": """TENUE DU BOKKEN (SAISIE) - TE NO UCHI

La saisie moderne du sabre repose sur des principes précis et NON intuitifs. Cette prise est appelée TAMAGO (œuf) car elle évoque la délicatesse nécessaire pour tenir un œuf sans l'écraser tout en le gardant fermement.

POSITIONNEMENT DES MAINS:
• Main DROITE (前手 maete): à l'avant, juste derrière la tsuba (garde)
• Main GAUCHE (後手 atote): à l'extrémité, kashira dans la paume

LA PRISE TAMAGO:
• Espace entre la commissure pouce-index et le tsuka (poignée)
• Tenue principalement sur l'ANNULAIRE et l'AURICULAIRE
• Le pouce et l'index restent souples
• Poignets alignés, coudes détendus

PRINCIPES BIOMÉCANIQUES:
• La main BASSE (gauche) donne la PUISSANCE de coupe
• La main HAUTE (droite) assure la PRÉCISION
• Le kissaki (pointe) doit toujours être orienté vers le partenaire en garde""",
            "key_points": [
                "🥚 TAMAGO : Tenir le sabre comme un œuf - ferme mais délicat",
                "👐 ANNULAIRE & AURICULAIRE : Doigts principaux de la prise",
                "⬇️ MAIN BASSE = PUISSANCE : La main gauche génère la force de coupe",
                "⬆️ MAIN HAUTE = PRÉCISION : La main droite guide et oriente",
                "🎯 KISSAKI : La pointe doit toujours menacer le centre du partenaire",
                "🔄 POIGNETS ALIGNÉS : Pas de cassure au niveau des poignets",
                "💪 COUDES DÉTENDUS : Éviter la tension dans les bras"
            ],
            "practice_tips": [
                "Pratiquer la saisie correcte AVANT les suburi",
                "Vérifier régulièrement que les doigts ne se crispent pas",
                "La coupe vient des HANCHES, pas des bras",
                "En garde (kamae), le bokken protège la ligne centrale",
                "Observer les pratiquants avancés pour intégrer la saisie naturelle"
            ]
        }
    },
    # TANTO DORI AVANCÉ - NIDAN
    {
        "kyu_id": "5a7dcbbd-26d1-4434-9aea-e895bd6b1926",
        "technique_id": "9a52eb2e-942c-4430-9f29-34d89d4bcb97",
        "update": {
            "description": """TANTO DORI AVANCÉ - Désarmement avec assurance et fluidité.

Au niveau Nidan, le tanto-dori doit être exécuté avec ASSURANCE et DÉTERMINATION. La technique n'est plus hésitante mais DÉCISIVE. L'entrée est franche, le contrôle immédiat, le désarmement fluide.

ÉVOLUTION DEPUIS SHODAN:
• Shodan: Apprendre les formes de base et la distance
• Nidan: Exécuter avec fluidité et détermination mentale

TECHNIQUES VARIÉES:
Le pratiquant doit maîtriser plusieurs réponses à chaque type d'attaque:
• Tsuki (coup d'estoc): Gokyo, Irimi nage, Kote gaeshi
• Yokomen (coupe latérale): Shiho nage, Ude kime nage
• Shomen (coupe verticale): Irimi nage, Kokyu nage

ATTITUDE MENTALE:
Le Nidan affronte la menace du tanto avec CALME et DÉTERMINATION. Il n'y a plus de peur ni d'hésitation.""",
            "key_points": [
                "⚡ DÉCISION : L'entrée est FRANCHE et sans hésitation",
                "🧠 CLARTÉ MENTALE : Savoir quelle technique appliquer instantanément",
                "🔄 VARIÉTÉ : Plusieurs réponses possibles pour chaque attaque",
                "💪 ASSURANCE : Exécution confiante et déterminée",
                "👁️ ZANSHIN RENFORCÉ : Vigilance maintenue tout au long",
                "🎯 EFFICACITÉ : Le désarmement doit être RÉEL et non simulé"
            ],
            "practice_tips": [
                "Pratiquer contre des attaques RÉALISTES et déterminées",
                "Varier les types d'attaque (tsuki, yokomen, shomen)",
                "Travailler sur la RAPIDITÉ sans perdre la précision",
                "L'uke doit maintenir une menace crédible",
                "Intégrer le tanto-dori dans les randori (travail libre)"
            ]
        }
    },
    # JO DORI AVANCÉ - NIDAN
    {
        "kyu_id": "5a7dcbbd-26d1-4434-9aea-e895bd6b1926",
        "technique_id": "ae3bfd4f-e6f3-4631-abc4-cde6d02216a3",
        "update": {
            "description": """JO DORI / JO NAGE WAZA AVANCÉ - Pratique complète et intégrée.

Au niveau Nidan, le travail au jo devient une expression NATURELLE des principes d'Aïkido. Le pratiquant utilise le jo comme une véritable extension de son corps et de son ki.

PROGRESSION DEPUIS SHODAN:
• Shodan: Apprendre les katas et les principes de distance
• Nidan: Intégration fluide et applications variées

JO DORI AVANCÉ:
Le désarmement devient fluide et naturel. Le pratiquant peut:
• Désarmer en mouvement (pas seulement statique)
• Enchaîner désarmement et projection
• S'adapter à différentes saisies et attaques du jo

JO NAGE WAZA AVANCÉ:
Les projections avec le jo sont exécutées avec précision:
• Utilisation du jo comme levier
• Projections par rotation (kaiten)
• Contrôles articulaires avec le jo""",
            "key_points": [
                "🌊 FLUIDITÉ : Les mouvements s'enchaînent naturellement",
                "🪵 EXTENSION : Le jo est vraiment une extension du corps",
                "🔄 ADAPTABILITÉ : Réponse appropriée à chaque situation",
                "⚡ SPONTANÉITÉ : Plus de réflexion consciente sur la technique",
                "🤝 AWASE : Parfaite synchronisation avec le mouvement du partenaire",
                "🎯 CONTRÔLE : Maîtrise totale du jo jusqu'au désarmement"
            ],
            "practice_tips": [
                "Intégrer le travail de jo dans les séances régulières",
                "Pratiquer le jo-dori en mouvement",
                "Varier les attaques: tsuki, shomen, yokomen, gedan",
                "Le désarmement doit être une conséquence naturelle du mouvement",
                "Étudier les henka (variations) des katas de base"
            ]
        }
    }
]

async def update_techniques():
    """Update weapon techniques with enriched pedagogical data."""
    print("🔄 Mise à jour des fiches pédagogiques des techniques d'armes...")
    
    for item in WEAPON_TECHNIQUE_UPDATES:
        kyu_id = item["kyu_id"]
        tech_id = item["technique_id"]
        update_data = item["update"]
        
        # Build the update query for nested array
        set_query = {f"techniques.$.{k}": v for k, v in update_data.items()}
        
        result = await db.kyu_levels.update_one(
            {"id": kyu_id, "techniques.id": tech_id},
            {"$set": set_query}
        )
        
        if result.matched_count > 0:
            print(f"✅ Mis à jour: {tech_id[:8]}... dans {kyu_id[:8]}...")
        else:
            print(f"⚠️ Non trouvé: {tech_id[:8]}... dans {kyu_id[:8]}...")
    
    print("\n✨ Mise à jour terminée!")

if __name__ == "__main__":
    asyncio.run(update_techniques())
