#!/usr/bin/env python3
"""
Aikido@Game - Mode d'Emploi PDF Generator
Génère un guide utilisateur complet avec captures d'écran et explications
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak, Table, TableStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os
from datetime import datetime

# Output path
OUTPUT_PATH = "/app/frontend/public/Mode_Emploi_AikidoGame.pdf"
IMAGES_PATH = "/app/backend/guide_images"

# Page dimensions
PAGE_WIDTH, PAGE_HEIGHT = A4

# Brand colors
GOLD_COLOR = colors.HexColor("#D4AF37")
DARK_BG = colors.HexColor("#1a1a2e")
CYAN_COLOR = colors.HexColor("#00CED1")

def create_styles():
    """Create custom paragraph styles"""
    styles = getSampleStyleSheet()
    
    # Title style
    styles.add(ParagraphStyle(
        name='GuideTitle',
        parent=styles['Title'],
        fontSize=28,
        textColor=GOLD_COLOR,
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    ))
    
    # Section header
    styles.add(ParagraphStyle(
        name='SectionHeader',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=GOLD_COLOR,
        spaceBefore=20,
        spaceAfter=15,
        fontName='Helvetica-Bold'
    ))
    
    # Subsection header
    styles.add(ParagraphStyle(
        name='SubHeader',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=CYAN_COLOR,
        spaceBefore=15,
        spaceAfter=10,
        fontName='Helvetica-Bold'
    ))
    
    # Body text
    styles.add(ParagraphStyle(
        name='GuideBody',
        parent=styles['Normal'],
        fontSize=11,
        leading=16,
        spaceAfter=12,
        alignment=TA_JUSTIFY,
        fontName='Helvetica'
    ))
    
    # Bullet points
    styles.add(ParagraphStyle(
        name='GuideBullet',
        parent=styles['Normal'],
        fontSize=11,
        leading=14,
        leftIndent=20,
        spaceAfter=6,
        fontName='Helvetica'
    ))
    
    # Footer
    styles.add(ParagraphStyle(
        name='Footer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.gray,
        alignment=TA_CENTER
    ))
    
    # Caption
    styles.add(ParagraphStyle(
        name='Caption',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.gray,
        alignment=TA_CENTER,
        spaceBefore=5,
        spaceAfter=15,
        fontName='Helvetica-Oblique'
    ))
    
    return styles

def add_image(image_name, max_width=16*cm, max_height=10*cm):
    """Add an image with proper sizing"""
    image_path = os.path.join(IMAGES_PATH, image_name)
    if os.path.exists(image_path):
        img = Image(image_path)
        # Calculate aspect ratio
        aspect = img.imageWidth / img.imageHeight
        
        # Fit within bounds while maintaining aspect ratio
        if aspect > (max_width / max_height):
            img.drawWidth = max_width
            img.drawHeight = max_width / aspect
        else:
            img.drawHeight = max_height
            img.drawWidth = max_height * aspect
        
        return img
    return None

def build_cover_page(styles):
    """Build the cover page"""
    elements = []
    
    elements.append(Spacer(1, 4*cm))
    elements.append(Paragraph("Aikido@Game", styles['GuideTitle']))
    elements.append(Spacer(1, 0.5*cm))
    elements.append(Paragraph("Mode d'Emploi", styles['SectionHeader']))
    elements.append(Spacer(1, 1*cm))
    elements.append(Paragraph("Guide complet pour découvrir et utiliser<br/>votre parcours Aikido interactif", styles['GuideBody']))
    elements.append(Spacer(1, 2*cm))
    
    # Stats box
    stats_data = [
        ["206+ Techniques", "10 Grades", "84 Défis"],
        ["À maîtriser", "6 Kyu + 4 Dan", "À relever"]
    ]
    stats_table = Table(stats_data, colWidths=[5*cm, 5*cm, 5*cm])
    stats_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('TEXTCOLOR', (0, 0), (-1, 0), GOLD_COLOR),
        ('FONTSIZE', (0, 1), (-1, 1), 10),
        ('TEXTCOLOR', (0, 1), (-1, 1), colors.gray),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
    ]))
    elements.append(stats_table)
    
    elements.append(Spacer(1, 3*cm))
    elements.append(Paragraph(f"Version 1.0 - {datetime.now().strftime('%B %Y')}", styles['Footer']))
    elements.append(Paragraph("HUMAN KNOWLEDGE", styles['Footer']))
    elements.append(PageBreak())
    
    return elements

def build_toc(styles):
    """Build table of contents"""
    elements = []
    
    elements.append(Paragraph("Table des Matières", styles['SectionHeader']))
    elements.append(Spacer(1, 0.5*cm))
    
    toc_items = [
        ("1. Introduction", "Découvrez Aikido@Game"),
        ("2. Page d'Accueil", "Choisir votre mode (Jeune Ninja / Ninja Confirmé)"),
        ("3. Mode Visiteur", "Explorer le programme sans inscription"),
        ("4. Programme des Techniques", "Parcourir les 206 techniques par grade"),
        ("5. Détails d'une Technique", "Comprendre les informations disponibles"),
        ("6. Inscription", "Créer votre compte"),
        ("7. Tableau de Bord", "Suivre votre progression"),
        ("8. Blocs de Progression", "Les 4 piliers de l'apprentissage"),
        ("9. Espace Enseignant", "Pour les professeurs d'Aikido"),
        ("10. Glossaire", "Termes et définitions"),
    ]
    
    for num, (title, desc) in enumerate(toc_items):
        elements.append(Paragraph(f"<b>{title}</b> - {desc}", styles['GuideBullet']))
    
    elements.append(PageBreak())
    return elements

def build_section_1(styles):
    """Section 1: Introduction"""
    elements = []
    
    elements.append(Paragraph("1. Introduction", styles['SectionHeader']))
    elements.append(Paragraph(
        "Bienvenue dans <b>Aikido@Game</b>, votre compagnon interactif pour progresser dans la pratique de l'Aikido. "
        "Cette application unique combine l'apprentissage traditionnel des arts martiaux japonais avec une approche "
        "ludique et moderne de gamification.",
        styles['GuideBody']
    ))
    
    elements.append(Paragraph("Qu'est-ce qu'Aikido@Game ?", styles['SubHeader']))
    elements.append(Paragraph(
        "Aikido@Game est une plateforme web conçue pour accompagner les pratiquants d'Aikido dans leur parcours. "
        "Que vous soyez un jeune débutant ou un adulte expérimenté, l'application s'adapte à votre profil pour "
        "vous offrir une expérience personnalisée.",
        styles['GuideBody']
    ))
    
    elements.append(Paragraph("Principales fonctionnalités :", styles['SubHeader']))
    features = [
        "• <b>Programme complet</b> : Accédez à plus de 206 techniques réparties sur 10 grades",
        "• <b>Suivi de progression</b> : Visualisez votre avancement et vos accomplissements",
        "• <b>84 défis</b> : Relevez des challenges pour gagner des points et des badges",
        "• <b>Deux modes</b> : Interface adaptée selon l'âge (enfant ou adulte)",
        "• <b>100% gratuit</b> : Accès libre sans publicité, conforme RGPD",
    ]
    for feature in features:
        elements.append(Paragraph(feature, styles['GuideBullet']))
    
    elements.append(PageBreak())
    return elements

def build_section_2(styles):
    """Section 2: Page d'accueil"""
    elements = []
    
    elements.append(Paragraph("2. Page d'Accueil", styles['SectionHeader']))
    
    # Add screenshot
    img = add_image("fresh_01_accueil.jpeg", max_width=16*cm, max_height=9*cm)
    if img:
        elements.append(img)
        elements.append(Paragraph("Figure 1 : Page d'accueil d'Aikido@Game", styles['Caption']))
    
    elements.append(Paragraph(
        "La page d'accueil présente les statistiques principales de l'application et vous invite à choisir "
        "votre mode de navigation. C'est ici que commence votre aventure !",
        styles['GuideBody']
    ))
    
    elements.append(Paragraph("Choisir votre mode", styles['SubHeader']))
    elements.append(Paragraph(
        "<b>Jeune Ninja</b> : Ce mode est conçu pour les enfants de moins de 14 ans. L'interface est colorée, "
        "ludique et utilise un langage adapté aux plus jeunes pratiquants.",
        styles['GuideBody']
    ))
    elements.append(Paragraph(
        "<b>Ninja Confirmé</b> : Ce mode est destiné aux adolescents et adultes. L'interface est plus sobre "
        "et professionnelle, avec des informations détaillées sur les techniques.",
        styles['GuideBody']
    ))
    
    elements.append(Paragraph("En-tête de navigation", styles['SubHeader']))
    elements.append(Paragraph(
        "L'en-tête contient plusieurs boutons importants :",
        styles['GuideBody']
    ))
    nav_items = [
        "• <b>S'inscrire</b> : Créer un nouveau compte utilisateur",
        "• <b>Connexion</b> : Se connecter à un compte existant",
        "• <b>Dojo</b> : Accéder à l'espace du club",
        "• <b>Espace de gestion</b> : Pour les administrateurs",
        "• <b>Enseignant</b> : Accès réservé aux professeurs",
    ]
    for item in nav_items:
        elements.append(Paragraph(item, styles['GuideBullet']))
    
    elements.append(PageBreak())
    return elements

def build_section_3(styles):
    """Section 3: Mode visiteur"""
    elements = []
    
    elements.append(Paragraph("3. Mode Visiteur", styles['SectionHeader']))
    
    img = add_image("guide_02_visiteur.jpeg", max_width=16*cm, max_height=9*cm)
    if img:
        elements.append(img)
        elements.append(Paragraph("Figure 2 : Interface du mode visiteur", styles['Caption']))
    
    elements.append(Paragraph(
        "Après avoir choisi votre mode (Jeune Ninja ou Ninja Confirmé), vous accédez à l'interface principale "
        "qui vous permet d'explorer le programme Aikido sans avoir besoin de créer un compte.",
        styles['GuideBody']
    ))
    
    elements.append(Paragraph("Ce que vous pouvez faire en tant que visiteur :", styles['SubHeader']))
    visitor_features = [
        "• <b>Explorer le programme</b> : Parcourir toutes les techniques par grade",
        "• <b>Lire les descriptions</b> : Comprendre chaque technique en détail",
        "• <b>Découvrir le Budo</b> : Apprendre la philosophie de l'Aikido",
        "• <b>Changer de mode</b> : Basculer entre Jeune Ninja et Ninja Confirmé à tout moment",
    ]
    for feature in visitor_features:
        elements.append(Paragraph(feature, styles['GuideBullet']))
    
    elements.append(Paragraph(
        "<b>Note</b> : Pour suivre votre progression et accéder aux défis, vous devrez créer un compte gratuit.",
        styles['GuideBody']
    ))
    
    elements.append(PageBreak())
    return elements

def build_section_4(styles):
    """Section 4: Programme des techniques"""
    elements = []
    
    elements.append(Paragraph("4. Programme des Techniques", styles['SectionHeader']))
    
    img = add_image("guide_03_programme.jpeg", max_width=16*cm, max_height=9*cm)
    if img:
        elements.append(img)
        elements.append(Paragraph("Figure 3 : Page du programme avec les grades", styles['Caption']))
    
    elements.append(Paragraph(
        "Le programme complet d'Aikido@Game comprend plus de 206 techniques réparties sur 10 grades : "
        "6 grades Kyu (ceintures colorées) et 4 grades Dan (ceintures noires).",
        styles['GuideBody']
    ))
    
    elements.append(Paragraph("Organisation par grade", styles['SubHeader']))
    elements.append(Paragraph(
        "Chaque grade (Kyu ou Dan) contient une liste de techniques à maîtriser. Les grades Kyu vont du 6e Kyu "
        "(débutant) au 1er Kyu (avancé), puis les grades Dan commencent à partir du Shodan (1er Dan).",
        styles['GuideBody']
    ))
    
    elements.append(Paragraph("Catégories de techniques", styles['SubHeader']))
    categories = [
        "• <b>Techniques de base</b> : Fondamentaux pour chaque niveau",
        "• <b>Projections</b> (Nage Waza) : Techniques pour projeter le partenaire",
        "• <b>Immobilisations</b> (Osae Waza) : Techniques de contrôle au sol",
        "• <b>Armes</b> (Buki Waza) : Techniques avec Jo, Bokken, Tanto",
    ]
    for cat in categories:
        elements.append(Paragraph(cat, styles['GuideBullet']))
    
    elements.append(PageBreak())
    return elements

def build_section_5(styles):
    """Section 5: Détails d'une technique"""
    elements = []
    
    elements.append(Paragraph("5. Détails d'une Technique", styles['SectionHeader']))
    
    img = add_image("guide_04_technique.jpeg", max_width=16*cm, max_height=9*cm)
    if img:
        elements.append(img)
        elements.append(Paragraph("Figure 4 : Modal avec les détails d'une technique", styles['Caption']))
    
    elements.append(Paragraph(
        "En cliquant sur une technique, une fenêtre modale s'ouvre avec toutes les informations détaillées "
        "pour vous aider à comprendre et pratiquer correctement.",
        styles['GuideBody']
    ))
    
    elements.append(Paragraph("Informations disponibles :", styles['SubHeader']))
    details = [
        "• <b>Nom en japonais</b> : Terminologie officielle de la technique",
        "• <b>Traduction française</b> : Signification du nom",
        "• <b>Description</b> : Explication détaillée du mouvement",
        "• <b>Points clés</b> : Éléments essentiels à maîtriser",
        "• <b>Conseils de pratique</b> : Astuces pour progresser",
        "• <b>Niveau de maîtrise</b> : Votre progression sur cette technique",
    ]
    for detail in details:
        elements.append(Paragraph(detail, styles['GuideBullet']))
    
    elements.append(Paragraph("Niveaux de maîtrise", styles['SubHeader']))
    elements.append(Paragraph(
        "Chaque technique peut être marquée avec un niveau de maîtrise allant de « Non commencé » à « Maîtrisé ». "
        "Cette fonctionnalité est disponible uniquement pour les utilisateurs connectés.",
        styles['GuideBody']
    ))
    
    elements.append(PageBreak())
    return elements

def build_section_6(styles):
    """Section 6: Inscription"""
    elements = []
    
    elements.append(Paragraph("6. Inscription", styles['SectionHeader']))
    
    img = add_image("guide_05_inscription.jpeg", max_width=16*cm, max_height=9*cm)
    if img:
        elements.append(img)
        elements.append(Paragraph("Figure 5 : Formulaire d'inscription", styles['Caption']))
    
    elements.append(Paragraph(
        "Pour profiter de toutes les fonctionnalités d'Aikido@Game, créez un compte gratuit en quelques étapes simples.",
        styles['GuideBody']
    ))
    
    elements.append(Paragraph("Étapes d'inscription :", styles['SubHeader']))
    steps = [
        "• <b>Étape 1</b> : Cliquez sur « S'inscrire » dans l'en-tête",
        "• <b>Étape 2</b> : Remplissez le formulaire avec vos informations",
        "• <b>Étape 3</b> : Choisissez votre mode préféré (Jeune Ninja ou Ninja Confirmé)",
        "• <b>Étape 4</b> : Validez votre inscription",
    ]
    for step in steps:
        elements.append(Paragraph(step, styles['GuideBullet']))
    
    elements.append(Paragraph("Protection des données (RGPD)", styles['SubHeader']))
    elements.append(Paragraph(
        "Aikido@Game respecte la réglementation européenne sur la protection des données personnelles. "
        "Vos informations ne sont jamais partagées avec des tiers et vous pouvez demander leur suppression à tout moment.",
        styles['GuideBody']
    ))
    
    elements.append(PageBreak())
    return elements

def build_section_7(styles):
    """Section 7: Tableau de bord"""
    elements = []
    
    elements.append(Paragraph("7. Tableau de Bord", styles['SectionHeader']))
    
    img = add_image("guide_08_dashboard_main.jpeg", max_width=16*cm, max_height=9*cm)
    if img:
        elements.append(img)
        elements.append(Paragraph("Figure 6 : Tableau de bord utilisateur", styles['Caption']))
    
    elements.append(Paragraph(
        "Le tableau de bord est votre espace personnel pour suivre votre progression dans l'apprentissage de l'Aikido. "
        "Il affiche vos statistiques, vos défis en cours et vos accomplissements.",
        styles['GuideBody']
    ))
    
    elements.append(Paragraph("Éléments du tableau de bord :", styles['SubHeader']))
    dashboard_items = [
        "• <b>Points totaux</b> : Score accumulé grâce à vos activités",
        "• <b>Grade actuel</b> : Votre niveau dans le programme",
        "• <b>Techniques maîtrisées</b> : Nombre de techniques validées",
        "• <b>Défis complétés</b> : Challenges réussis",
        "• <b>Progression graphique</b> : Visualisation de votre avancement",
    ]
    for item in dashboard_items:
        elements.append(Paragraph(item, styles['GuideBullet']))
    
    elements.append(PageBreak())
    return elements

def build_section_8(styles):
    """Section 8: Blocs de progression"""
    elements = []
    
    elements.append(Paragraph("8. Les 4 Blocs de Progression", styles['SectionHeader']))
    
    img = add_image("guide_10_blocs.jpeg", max_width=16*cm, max_height=9*cm)
    if img:
        elements.append(img)
        elements.append(Paragraph("Figure 7 : Les blocs de progression", styles['Caption']))
    
    elements.append(Paragraph(
        "Aikido@Game structure l'apprentissage autour de 4 blocs fondamentaux qui représentent les piliers "
        "de la pratique de l'Aikido.",
        styles['GuideBody']
    ))
    
    elements.append(Paragraph("Bloc 1 : Commence", styles['SubHeader']))
    elements.append(Paragraph(
        "Premier contact avec l'Aikido. Ce bloc couvre les bases essentielles : postures, déplacements, "
        "chutes et premiers mouvements.",
        styles['GuideBody']
    ))
    
    elements.append(Paragraph("Bloc 2 : Découvre", styles['SubHeader']))
    elements.append(Paragraph(
        "Exploration des techniques fondamentales. Vous apprenez les projections et immobilisations de base "
        "dans différentes situations.",
        styles['GuideBody']
    ))
    
    elements.append(Paragraph("Bloc 3 : Progresse", styles['SubHeader']))
    elements.append(Paragraph(
        "Approfondissement de la pratique. Les techniques deviennent plus complexes et vous travaillez "
        "sur la fluidité et l'efficacité.",
        styles['GuideBody']
    ))
    
    elements.append(Paragraph("Bloc 4 : Maîtrise", styles['SubHeader']))
    elements.append(Paragraph(
        "Niveau avancé où vous perfectionnez votre pratique et commencez à développer votre propre "
        "compréhension de l'Aikido.",
        styles['GuideBody']
    ))
    
    elements.append(PageBreak())
    return elements

def build_section_9(styles):
    """Section 9: Espace enseignant"""
    elements = []
    
    elements.append(Paragraph("9. Espace Enseignant", styles['SectionHeader']))
    
    img = add_image("guide_11_enseignant.jpeg", max_width=16*cm, max_height=9*cm)
    if img:
        elements.append(img)
        elements.append(Paragraph("Figure 8 : Tableau de bord enseignant", styles['Caption']))
    
    elements.append(Paragraph(
        "L'espace enseignant est réservé aux professeurs d'Aikido. Il permet de suivre les élèves, "
        "d'ajouter des observations et de communiquer avec les parents.",
        styles['GuideBody']
    ))
    
    elements.append(Paragraph("Fonctionnalités enseignant :", styles['SubHeader']))
    teacher_features = [
        "• <b>Liste des élèves</b> : Voir tous les membres du dojo",
        "• <b>Observations</b> : Ajouter des commentaires sur la progression des élèves",
        "• <b>Messages</b> : Communiquer avec les parents",
        "• <b>Statistiques</b> : Voir les statistiques globales du dojo",
    ]
    for feature in teacher_features:
        elements.append(Paragraph(feature, styles['GuideBullet']))
    
    elements.append(Paragraph("Accès enseignant", styles['SubHeader']))
    elements.append(Paragraph(
        "Pour accéder à l'espace enseignant, cliquez sur le bouton orange « Enseignant » dans l'en-tête "
        "et connectez-vous avec vos identifiants fournis par l'administrateur du dojo.",
        styles['GuideBody']
    ))
    
    elements.append(PageBreak())
    return elements

def build_glossary(styles):
    """Section 10: Glossary"""
    elements = []
    
    elements.append(Paragraph("10. Glossaire", styles['SectionHeader']))
    elements.append(Paragraph(
        "Voici les termes couramment utilisés dans Aikido@Game et leur signification :",
        styles['GuideBody']
    ))
    
    terms = [
        ("Aikido", "Art martial japonais signifiant « la voie de l'harmonie »"),
        ("Budo", "Voie martiale japonaise, philosophie des arts martiaux"),
        ("Dan", "Grade avancé (ceinture noire)"),
        ("Dojo", "Lieu où l'on pratique les arts martiaux"),
        ("Kyu", "Grade de débutant à avancé (avant le Dan)"),
        ("Nage Waza", "Techniques de projection"),
        ("Osae Waza", "Techniques d'immobilisation"),
        ("Sensei", "Professeur, enseignant"),
        ("Uke", "Celui qui reçoit la technique (attaquant)"),
        ("Tori/Nage", "Celui qui exécute la technique (défenseur)"),
    ]
    
    for term, definition in terms:
        elements.append(Paragraph(f"<b>{term}</b> : {definition}", styles['GuideBullet']))
    
    elements.append(Spacer(1, 1*cm))
    elements.append(Paragraph("© 2025 HUMAN KNOWLEDGE - Aikido@Game", styles['Footer']))
    elements.append(Paragraph("Ce guide est fourni gratuitement avec l'application.", styles['Footer']))
    
    return elements

def generate_pdf():
    """Generate the complete PDF guide"""
    print("Génération du Mode d'Emploi Aikido@Game...")
    
    # Create document
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm
    )
    
    # Get styles
    styles = create_styles()
    
    # Build content
    elements = []
    elements.extend(build_cover_page(styles))
    elements.extend(build_toc(styles))
    elements.extend(build_section_1(styles))
    elements.extend(build_section_2(styles))
    elements.extend(build_section_3(styles))
    elements.extend(build_section_4(styles))
    elements.extend(build_section_5(styles))
    elements.extend(build_section_6(styles))
    elements.extend(build_section_7(styles))
    elements.extend(build_section_8(styles))
    elements.extend(build_section_9(styles))
    elements.extend(build_glossary(styles))
    
    # Build PDF
    doc.build(elements)
    
    print(f"✅ Mode d'emploi généré avec succès : {OUTPUT_PATH}")
    return OUTPUT_PATH

if __name__ == "__main__":
    generate_pdf()
