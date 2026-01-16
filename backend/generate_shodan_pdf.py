#!/usr/bin/env python3
"""
Générateur PDF - Programme du 1er Dan (SHODAN) Aïkido
Aikido@Game - HUMAN KNOWLEDGE
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime
import os

# Couleurs personnalisées
NOIR = colors.HexColor('#1a1a2e')
ROUGE = colors.HexColor('#e63946')
OR = colors.HexColor('#d4a574')
GRIS = colors.HexColor('#4a4a4a')
BLANC = colors.white
BLEU_FONCE = colors.HexColor('#1d3557')

def create_shodan_pdf():
    """Génère le PDF du programme 1er Dan"""
    
    # Créer le document
    output_path = "/app/frontend/public/documents/programme_shodan_1er_dan.pdf"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=1.5*cm,
        leftMargin=1.5*cm,
        topMargin=1.5*cm,
        bottomMargin=1.5*cm
    )
    
    # Styles
    styles = getSampleStyleSheet()
    
    # Style titre principal
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=28,
        textColor=NOIR,
        alignment=TA_CENTER,
        spaceAfter=10,
        fontName='Helvetica-Bold'
    )
    
    # Style sous-titre
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=GRIS,
        alignment=TA_CENTER,
        spaceAfter=20,
        fontName='Helvetica'
    )
    
    # Style section
    section_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=BLANC,
        alignment=TA_LEFT,
        spaceBefore=15,
        spaceAfter=10,
        fontName='Helvetica-Bold',
        backColor=NOIR,
        borderPadding=(8, 8, 8, 8)
    )
    
    # Style sous-section
    subsection_style = ParagraphStyle(
        'SubsectionTitle',
        parent=styles['Heading3'],
        fontSize=13,
        textColor=BLEU_FONCE,
        alignment=TA_LEFT,
        spaceBefore=12,
        spaceAfter=6,
        fontName='Helvetica-Bold'
    )
    
    # Style texte normal
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=10,
        textColor=GRIS,
        alignment=TA_JUSTIFY,
        spaceAfter=6,
        fontName='Helvetica'
    )
    
    # Style citation
    quote_style = ParagraphStyle(
        'Quote',
        parent=styles['Normal'],
        fontSize=11,
        textColor=GRIS,
        alignment=TA_CENTER,
        fontName='Helvetica-Oblique',
        spaceBefore=10,
        spaceAfter=10,
        leftIndent=20,
        rightIndent=20
    )
    
    # Contenu du document
    story = []
    
    # ═══════════════════════════════════════════════════════════════
    # PAGE DE TITRE
    # ═══════════════════════════════════════════════════════════════
    story.append(Spacer(1, 2*cm))
    story.append(Paragraph("⚫ PROGRAMME DU 1er DAN", title_style))
    story.append(Paragraph("SHODAN - 初段", subtitle_style))
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph("Programme Officiel d'Examen", subtitle_style))
    story.append(Spacer(1, 1*cm))
    
    # Infos générales
    info_data = [
        ["Grade", "SHODAN (1er Dan) - Ceinture Noire"],
        ["Prérequis", "Minimum 1 an après le 1er Kyu ou 300 heures"],
        ["Exigence", "Maîtrise complète des grades Kyu (6e au 1er)"],
    ]
    
    info_table = Table(info_data, colWidths=[4*cm, 12*cm])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f0f0')),
        ('TEXTCOLOR', (0, 0), (-1, -1), GRIS),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
    ]))
    story.append(info_table)
    
    story.append(Spacer(1, 1*cm))
    story.append(Paragraph(
        '"SHO est le début, ce qui commence. Le corps commence enfin à répondre aux commandements."',
        quote_style
    ))
    
    story.append(Spacer(1, 2*cm))
    
    # Footer page de titre
    footer_style = ParagraphStyle('Footer', parent=styles['Normal'], fontSize=9, textColor=GRIS, alignment=TA_CENTER)
    story.append(Paragraph("Aikido@Game - HUMAN KNOWLEDGE", footer_style))
    story.append(Paragraph(f"Document généré le {datetime.now().strftime('%d/%m/%Y')}", footer_style))
    
    story.append(PageBreak())
    
    # ═══════════════════════════════════════════════════════════════
    # I. NOTIONS FONDAMENTALES
    # ═══════════════════════════════════════════════════════════════
    story.append(Paragraph("I. NOTIONS FONDAMENTALES À MAÎTRISER", section_style))
    story.append(Spacer(1, 0.3*cm))
    
    notions_data = [
        ["Concept", "Japonais", "Description"],
        ["Posture", "SHISEI", "Posture correcte et stable"],
        ["Garde", "KAMAE", "Position de base, prêt à l'action"],
        ["Énergie", "KIRYOKU", "Puissance vitale, énergie interne"],
        ["État mental", "SEISHIN JOTAI", "Concentration et calme mental"],
        ["Regard", "METSUKE", "Regard physique et mental englobant"],
    ]
    
    notions_table = Table(notions_data, colWidths=[4*cm, 4*cm, 9*cm])
    notions_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NOIR),
        ('TEXTCOLOR', (0, 0), (-1, 0), BLANC),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8f8f8')]),
    ]))
    story.append(notions_table)
    
    # ═══════════════════════════════════════════════════════════════
    # II. QUALITÉS À DÉVELOPPER
    # ═══════════════════════════════════════════════════════════════
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph("II. QUALITÉS À DÉVELOPPER", section_style))
    story.append(Spacer(1, 0.3*cm))
    
    qualites_data = [
        ["Qualité", "Japonais", "Description"],
        ["Distance", "MA AI", "Gestion de l'espace-temps"],
        ["Marche", "ARUKIKATA", "Déplacement correct"],
        ["Placement", "TAI SABAKI", "Déplacements et placements du corps"],
        ["Respiration", "KOKYU", "Respiration coordonnée"],
        ["Puissance", "KOKYU RYOKU", "Coordination puissance + respiration"],
        ["Rapidité", "SOKUDO", "Vitesse d'exécution"],
        ["Efficacité", "KO RYOKU", "Efficacité technique"],
        ["Étiquette", "REIGISAHO", "Respect des règles du dojo"],
    ]
    
    qualites_table = Table(qualites_data, colWidths=[4*cm, 4*cm, 9*cm])
    qualites_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NOIR),
        ('TEXTCOLOR', (0, 0), (-1, 0), BLANC),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8f8f8')]),
    ]))
    story.append(qualites_table)
    
    # ═══════════════════════════════════════════════════════════════
    # III. CONSTRUCTION DES TECHNIQUES
    # ═══════════════════════════════════════════════════════════════
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph("III. CONSTRUCTION DES TECHNIQUES", section_style))
    story.append(Spacer(1, 0.3*cm))
    
    story.append(Paragraph("<b>Les 3 phases de chaque technique :</b>", normal_style))
    phases_data = [
        ["Phase", "Description"],
        ["1. Phase initiale", "Placement correct face à l'attaque"],
        ["2. Phase dynamique", "Création et conduite du déséquilibre"],
        ["3. Phase terminale", "Projection (nage) ou immobilisation (osae)"],
    ]
    
    phases_table = Table(phases_data, colWidths=[4*cm, 13*cm])
    phases_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e63946')),
        ('TEXTCOLOR', (0, 0), (-1, 0), BLANC),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
    ]))
    story.append(phases_table)
    
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph(
        "⚠️ <i>Les trois phases doivent s'enchaîner avec <b>continuité</b> sans rupture du mouvement.</i>",
        normal_style
    ))
    
    story.append(PageBreak())
    
    # ═══════════════════════════════════════════════════════════════
    # IV. SUWARIWAZA
    # ═══════════════════════════════════════════════════════════════
    story.append(Paragraph("IV. SUWARIWAZA (Techniques à genoux)", section_style))
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph("Maîtrise complète de toutes les techniques à genoux avec shikko fluide et hanches stables.", normal_style))
    
    suwari_data = [
        ["Attaque", "Techniques à maîtriser"],
        ["Aihanmi Katate Dori", "Ikkyo, Nikyo, Sankyo, Yonkyo, Irimi Nage, Shiho Nage, Kote Gaeshi"],
        ["Shomen Uchi", "Ikkyo, Nikyo, Sankyo, Yonkyo, Irimi Nage, Kote Gaeshi"],
        ["Yokomen Uchi", "Ikkyo, Nikyo, Sankyo, Yonkyo, Irimi Nage, Kote Gaeshi"],
        ["Ryote Dori", "Kokyu Ho (exercice fondamental)"],
        ["Kata Dori", "Ikkyo, Nikyo"],
    ]
    
    suwari_table = Table(suwari_data, colWidths=[5*cm, 12*cm])
    suwari_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2d6a4f')),
        ('TEXTCOLOR', (0, 0), (-1, 0), BLANC),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0fff0')]),
    ]))
    story.append(suwari_table)
    
    # ═══════════════════════════════════════════════════════════════
    # V. TACHIWAZA
    # ═══════════════════════════════════════════════════════════════
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph("V. TACHIWAZA (Techniques debout)", section_style))
    
    # A. Sur saisies
    story.append(Paragraph("A. Sur saisies (DORI)", subsection_style))
    
    tachi_saisies_data = [
        ["Attaque", "Techniques"],
        ["Aihanmi Katate Dori", "Ikkyo, Nikyo, Sankyo, Yonkyo, Shiho Nage, Irimi Nage, Kote Gaeshi, Kaiten Nage"],
        ["Gyakuhanmi Katate Dori", "Ikkyo, Nikyo, Sankyo, Yonkyo, Tenchi Nage, Shiho Nage, Irimi Nage, Kote Gaeshi, Sumi Otoshi, Hijikime Osae, Kokyu Nage"],
        ["Ryote Dori", "Tenchi Nage, Kokyu Nage, Koshi Nage, Shiho Nage"],
        ["Kata Dori", "Ikkyo, Nikyo"],
        ["Kata Dori Menuchi", "Ikkyo, Nikyo, Sankyo, Yonkyo, Shiho Nage, Irimi Nage"],
        ["Katate Ryote Dori (Morote)", "Ikkyo, Nikyo, Kokyu Nage, Shiho Nage"],
        ["Muna Dori", "Ikkyo, Nikyo"],
        ["Ryokata Dori", "Kokyu Nage"],
    ]
    
    tachi_saisies_table = Table(tachi_saisies_data, colWidths=[5*cm, 12*cm])
    tachi_saisies_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1d3557')),
        ('TEXTCOLOR', (0, 0), (-1, 0), BLANC),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f8ff')]),
    ]))
    story.append(tachi_saisies_table)
    
    # B. Sur frappes
    story.append(Paragraph("B. Sur frappes (UCHI / TSUKI)", subsection_style))
    
    tachi_frappes_data = [
        ["Attaque", "Techniques"],
        ["Shomen Uchi", "Ikkyo, Nikyo, Sankyo, Yonkyo, Irimi Nage, Kote Gaeshi, Shiho Nage"],
        ["Yokomen Uchi", "Ikkyo, Nikyo, Sankyo, Yonkyo, Gokyo, Irimi Nage, Kote Gaeshi, Shiho Nage"],
        ["Chudan Tsuki", "Ikkyo, Irimi Nage, Kote Gaeshi, Uchi Kaiten Nage, Soto Kaiten Nage"],
        ["Jodan Tsuki", "Ikkyo, Irimi Nage, Kote Gaeshi"],
    ]
    
    tachi_frappes_table = Table(tachi_frappes_data, colWidths=[5*cm, 12*cm])
    tachi_frappes_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#457b9d')),
        ('TEXTCOLOR', (0, 0), (-1, 0), BLANC),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f8ff')]),
    ]))
    story.append(tachi_frappes_table)
    
    story.append(PageBreak())
    
    # ═══════════════════════════════════════════════════════════════
    # VI. HANMI HANDACHI WAZA
    # ═══════════════════════════════════════════════════════════════
    story.append(Paragraph("VI. HANMI HANDACHI WAZA (Tori à genoux, Uke debout)", section_style))
    story.append(Spacer(1, 0.3*cm))
    
    hanmi_data = [
        ["Attaque", "Techniques"],
        ["Gyakuhanmi Katate Dori", "Ikkyo, Shiho Nage, Kote Gaeshi"],
        ["Ryote Dori", "Shiho Nage, Kokyu Nage"],
        ["Ushiro Ryokata Dori", "Ikkyo, Nikyo, Sankyo, Kokyu Nage"],
    ]
    
    hanmi_table = Table(hanmi_data, colWidths=[5*cm, 12*cm])
    hanmi_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#9d4edd')),
        ('TEXTCOLOR', (0, 0), (-1, 0), BLANC),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8f0ff')]),
    ]))
    story.append(hanmi_table)
    
    # ═══════════════════════════════════════════════════════════════
    # VII. USHIRO WAZA
    # ═══════════════════════════════════════════════════════════════
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph("VII. USHIRO WAZA (Attaques arrière)", section_style))
    story.append(Spacer(1, 0.3*cm))
    
    ushiro_data = [
        ["Attaque", "Techniques"],
        ["Ryote Dori", "Ikkyo, Sankyo, Kote Gaeshi, Irimi Nage, Shiho Nage, Kokyu Nage"],
        ["Ryokata Dori", "Ikkyo, Nikyo, Sankyo, Kote Gaeshi, Irimi Nage"],
        ["Katate Dori Kubishime", "Ikkyo, Kote Gaeshi, Irimi Nage"],
        ["Ryohiji Dori", "Ikkyo, Kote Gaeshi"],
        ["Ryo Tekubi Dori", "Ikkyo, Shiho Nage, Kote Gaeshi"],
    ]
    
    ushiro_table = Table(ushiro_data, colWidths=[5*cm, 12*cm])
    ushiro_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#212529')),
        ('TEXTCOLOR', (0, 0), (-1, 0), BLANC),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8f8f8')]),
    ]))
    story.append(ushiro_table)
    
    # ═══════════════════════════════════════════════════════════════
    # VIII. BUKI WAZA
    # ═══════════════════════════════════════════════════════════════
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph("VIII. BUKI WAZA (Techniques avec armes)", section_style))
    
    # Tanto Dori
    story.append(Paragraph("A. TANTO DORI (Défense contre couteau)", subsection_style))
    
    tanto_data = [
        ["Attaque", "Techniques"],
        ["Chudan Tsuki", "Gokyo, Kote Gaeshi, Irimi Nage"],
        ["Shomen Uchi", "Gokyo"],
        ["Yokomen Uchi", "Gokyo"],
    ]
    
    tanto_table = Table(tanto_data, colWidths=[5*cm, 12*cm])
    tanto_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#dc2f02')),
        ('TEXTCOLOR', (0, 0), (-1, 0), BLANC),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
    ]))
    story.append(tanto_table)
    
    # Jo
    story.append(Paragraph("B. JO DORI / JO NAGE WAZA (Bâton)", subsection_style))
    story.append(Paragraph("• <b>Jo Dori</b> : Désarmement du bâton (tsuki, shomen, yokomen)", normal_style))
    story.append(Paragraph("• <b>Jo Nage Waza</b> : Projections utilisant le bâton comme levier", normal_style))
    
    # ═══════════════════════════════════════════════════════════════
    # IX. RANDORI
    # ═══════════════════════════════════════════════════════════════
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph("IX. RANDORI (Combat libre)", section_style))
    story.append(Spacer(1, 0.3*cm))
    
    story.append(Paragraph("<b>FUTARI GAKE - Randori contre 2 adversaires</b>", normal_style))
    story.append(Spacer(1, 0.2*cm))
    
    randori_data = [
        ["Critère", "Description"],
        ["Gestion de l'espace", "Ne jamais rester entre les deux attaquants"],
        ["Positionnement", "Toujours se replacer pour n'avoir qu'un adversaire en face"],
        ["Fluidité", "Enchaîner les techniques sans temps mort"],
        ["Mouvement", "Rester en mouvement constant"],
    ]
    
    randori_table = Table(randori_data, colWidths=[4*cm, 13*cm])
    randori_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#ff6b35')),
        ('TEXTCOLOR', (0, 0), (-1, 0), BLANC),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
    ]))
    story.append(randori_table)
    
    story.append(PageBreak())
    
    # ═══════════════════════════════════════════════════════════════
    # X. RÉCAPITULATIF DES TECHNIQUES
    # ═══════════════════════════════════════════════════════════════
    story.append(Paragraph("X. RÉCAPITULATIF DES TECHNIQUES DE BASE", section_style))
    story.append(Spacer(1, 0.3*cm))
    
    recap_data = [
        ["Technique", "Kanji", "Traduction", "Description"],
        ["Ikkyo", "一教", "1ère technique", "Contrôle du coude"],
        ["Nikyo", "二教", "2ème technique", "Contrôle coude + poignet"],
        ["Sankyo", "三教", "3ème technique", "Contrôle coude + poignet + épaule (spirale)"],
        ["Yonkyo", "四教", "4ème technique", "Point de pression sur l'avant-bras"],
        ["Gokyo", "五教", "5ème technique", "Spéciale contre couteau"],
        ["Shiho Nage", "四方投", "4 directions", "Projection dans les 4 directions"],
        ["Irimi Nage", "入身投", "Entrée corps", "Projection en entrant"],
        ["Kote Gaeshi", "小手返", "Retour poignet", "Retournement du poignet"],
        ["Tenchi Nage", "天地投", "Ciel-terre", "Un bras monte, un descend"],
        ["Kaiten Nage", "回転投", "Rotation", "Projection rotative"],
        ["Kokyu Nage", "呼吸投", "Respiration", "Projection par la respiration"],
        ["Koshi Nage", "腰投", "Hanche", "Projection de hanche"],
        ["Sumi Otoshi", "隅落", "Coin tomber", "Projection par le coin"],
    ]
    
    recap_table = Table(recap_data, colWidths=[3*cm, 2*cm, 3.5*cm, 8.5*cm])
    recap_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NOIR),
        ('TEXTCOLOR', (0, 0), (-1, 0), BLANC),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8f8f8')]),
    ]))
    story.append(recap_table)
    
    # ═══════════════════════════════════════════════════════════════
    # XI. CRITÈRES D'ÉVALUATION
    # ═══════════════════════════════════════════════════════════════
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph("XI. CRITÈRES D'ÉVALUATION DU 1er DAN", section_style))
    story.append(Spacer(1, 0.3*cm))
    
    criteres_data = [
        ["N°", "Critère", "Description"],
        ["1", "Principe d'intégrité", "Préserver l'intégrité physique et mentale des deux partenaires"],
        ["2", "Unité du corps", "Centrage, engagement total dans l'action"],
        ["3", "Attitude juste", "Maîtrise du potentiel physique"],
        ["4", "Disponibilité", "Mobilité, capacité de réaction immédiate"],
        ["5", "Attention", "Concentration suffisante et maintenue"],
        ["6", "Vigilance", "Zanshin - Présence tout au long de la situation"],
    ]
    
    criteres_table = Table(criteres_data, colWidths=[1*cm, 4*cm, 12*cm])
    criteres_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#d4a574')),
        ('TEXTCOLOR', (0, 0), (-1, 0), NOIR),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
        ('ALIGN', (1, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#fff8f0')]),
    ]))
    story.append(criteres_table)
    
    # Citation finale
    story.append(Spacer(1, 1*cm))
    story.append(Paragraph(
        '"La vraie victoire est la victoire sur soi-même." - O\'Sensei Morihei Ueshiba',
        quote_style
    ))
    
    # Footer
    story.append(Spacer(1, 1*cm))
    story.append(Paragraph("─" * 60, normal_style))
    story.append(Paragraph("<b>Aikido@Game</b> - Application de suivi de progression", footer_style))
    story.append(Paragraph("HUMAN KNOWLEDGE © 2025", footer_style))
    
    # Générer le PDF
    doc.build(story)
    
    return output_path

if __name__ == "__main__":
    path = create_shodan_pdf()
    print(f"✅ PDF généré avec succès : {path}")
