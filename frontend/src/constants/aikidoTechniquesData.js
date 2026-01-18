/**
 * AIKIDO@GAME — INDEX DES TECHNIQUES
 * 
 * Ce fichier centralise toutes les données des techniques
 * organisées par catégorie pour l'affichage dans l'admin.
 */

// ============================================================================
// ARMES
// ============================================================================

// JO (Bâton)
export const TECHNIQUES_JO = [
  // Jo Suburi - Tsuki (5)
  { id: "jo_suburi_1", nom: "Choku Tsuki", description: "Pique directe vers l'avant", niveau: "5e_kyu", ordre: 1, categorie: "Jo Suburi - Tsuki" },
  { id: "jo_suburi_2", nom: "Kaeshi Tsuki", description: "Pique avec retournement", niveau: "5e_kyu", ordre: 2, categorie: "Jo Suburi - Tsuki" },
  { id: "jo_suburi_3", nom: "Ushiro Tsuki", description: "Pique vers l'arrière", niveau: "5e_kyu", ordre: 3, categorie: "Jo Suburi - Tsuki" },
  { id: "jo_suburi_4", nom: "Tsuki Gedan Gaeshi", description: "Pique avec retour niveau bas", niveau: "4e_kyu", ordre: 4, categorie: "Jo Suburi - Tsuki" },
  { id: "jo_suburi_5", nom: "Tsuki Jodan Gaeshi", description: "Pique avec retour niveau haut", niveau: "4e_kyu", ordre: 5, categorie: "Jo Suburi - Tsuki" },
  
  // Jo Suburi - Uchi (5)
  { id: "jo_suburi_6", nom: "Shomen Uchi Komi", description: "Frappe verticale descendante", niveau: "5e_kyu", ordre: 6, categorie: "Jo Suburi - Uchi" },
  { id: "jo_suburi_7", nom: "Renzoku Uchi Komi", description: "Frappes continues", niveau: "5e_kyu", ordre: 7, categorie: "Jo Suburi - Uchi" },
  { id: "jo_suburi_8", nom: "Menuchi Gedan Gaeshi", description: "Frappe tête avec retour bas", niveau: "4e_kyu", ordre: 8, categorie: "Jo Suburi - Uchi" },
  { id: "jo_suburi_9", nom: "Menuchi Ushiro Tsuki", description: "Frappe tête puis pique arrière", niveau: "4e_kyu", ordre: 9, categorie: "Jo Suburi - Uchi" },
  { id: "jo_suburi_10", nom: "Gyaku Yokomen", description: "Frappe latérale inversée", niveau: "3e_kyu", ordre: 10, categorie: "Jo Suburi - Uchi" },
  
  // Jo Suburi - Katate (3)
  { id: "jo_suburi_11", nom: "Katate Gedan Gaeshi", description: "Une main - retour bas", niveau: "3e_kyu", ordre: 11, categorie: "Jo Suburi - Katate" },
  { id: "jo_suburi_12", nom: "Katate Toma Uchi", description: "Une main - frappe longue distance", niveau: "3e_kyu", ordre: 12, categorie: "Jo Suburi - Katate" },
  { id: "jo_suburi_13", nom: "Katate Hachi No Ji", description: "Une main - mouvement en 8", niveau: "2e_kyu", ordre: 13, categorie: "Jo Suburi - Katate" },
  
  // Jo Suburi - Hasso (5)
  { id: "jo_suburi_14", nom: "Hasso Gaeshi Uchi", description: "Garde hasso puis frappe", niveau: "2e_kyu", ordre: 14, categorie: "Jo Suburi - Hasso" },
  { id: "jo_suburi_15", nom: "Hasso Gaeshi Tsuki", description: "Garde hasso puis pique", niveau: "2e_kyu", ordre: 15, categorie: "Jo Suburi - Hasso" },
  { id: "jo_suburi_16", nom: "Hasso Gaeshi Ushiro Tsuki", description: "Garde hasso puis pique arrière", niveau: "1er_kyu", ordre: 16, categorie: "Jo Suburi - Hasso" },
  { id: "jo_suburi_17", nom: "Hasso Gaeshi Ushiro Uchi", description: "Garde hasso puis frappe arrière", niveau: "1er_kyu", ordre: 17, categorie: "Jo Suburi - Hasso" },
  { id: "jo_suburi_18", nom: "Hasso Gaeshi Ushiro Barai", description: "Garde hasso puis balayage arrière", niveau: "1er_kyu", ordre: 18, categorie: "Jo Suburi - Hasso" },
  
  // Jo Suburi - Nagare (2)
  { id: "jo_suburi_19", nom: "Hidari Nagare Gaeshi", description: "Flux gauche avec retournement", niveau: "1er_kyu", ordre: 19, categorie: "Jo Suburi - Nagare" },
  { id: "jo_suburi_20", nom: "Migi Nagare Gaeshi", description: "Flux droit avec retournement", niveau: "1er_kyu", ordre: 20, categorie: "Jo Suburi - Nagare" },
  
  // Jo Kata
  { id: "jo_kata_13", nom: "13 Jo Kata", description: "Forme codifiée de 13 mouvements", niveau: "4e_kyu", categorie: "Jo Kata" },
  { id: "jo_kata_22", nom: "22 Jo Kata", description: "Forme codifiée de 22 mouvements", niveau: "2e_kyu", categorie: "Jo Kata" },
  { id: "jo_kata_31", nom: "31 Jo Kata", description: "Forme codifiée de 31 mouvements", niveau: "3e_kyu", categorie: "Jo Kata" },
  
  // Kumi Jo
  { id: "kumijo_1", nom: "Kumi Jo Ichi", description: "Premier exercice à deux", niveau: "3e_kyu", ordre: 1, categorie: "Kumi Jo" },
  { id: "kumijo_2", nom: "Kumi Jo Ni", description: "Deuxième exercice à deux", niveau: "3e_kyu", ordre: 2, categorie: "Kumi Jo" },
  { id: "kumijo_3", nom: "Kumi Jo San", description: "Troisième exercice à deux", niveau: "2e_kyu", ordre: 3, categorie: "Kumi Jo" },
  { id: "kumijo_4", nom: "Kumi Jo Yon", description: "Quatrième exercice à deux", niveau: "2e_kyu", ordre: 4, categorie: "Kumi Jo" },
  { id: "kumijo_5", nom: "Kumi Jo Go", description: "Cinquième exercice à deux", niveau: "1er_kyu", ordre: 5, categorie: "Kumi Jo" },
  { id: "kumijo_6", nom: "Kumi Jo Roku", description: "Sixième exercice à deux", niveau: "1er_kyu", ordre: 6, categorie: "Kumi Jo" },
  { id: "kumijo_7", nom: "Kumi Jo Nana", description: "Septième exercice à deux", niveau: "shodan", ordre: 7, categorie: "Kumi Jo" },
  { id: "kumijo_8", nom: "Kumi Jo Hachi", description: "Huitième exercice à deux", niveau: "shodan", ordre: 8, categorie: "Kumi Jo" },
  { id: "kumijo_9", nom: "Kumi Jo Kyu", description: "Neuvième exercice à deux", niveau: "nidan", ordre: 9, categorie: "Kumi Jo" },
  { id: "kumijo_10", nom: "Kumi Jo Ju", description: "Dixième exercice à deux", niveau: "nidan", ordre: 10, categorie: "Kumi Jo" },
  
  // Jo Dori
  { id: "jo_dori_shomen_ikkyo", nom: "Jo Dori Shomen Uchi Ikkyo", description: "Défense contre frappe verticale au bâton", niveau: "2e_kyu", categorie: "Jo Dori" },
  { id: "jo_dori_shomen_nikyo", nom: "Jo Dori Shomen Uchi Nikyo", description: "Défense contre frappe - Nikyo", niveau: "2e_kyu", categorie: "Jo Dori" },
  { id: "jo_dori_shomen_sankyo", nom: "Jo Dori Shomen Uchi Sankyo", description: "Défense contre frappe - Sankyo", niveau: "1er_kyu", categorie: "Jo Dori" },
  { id: "jo_dori_shomen_yonkyo", nom: "Jo Dori Shomen Uchi Yonkyo", description: "Défense contre frappe - Yonkyo", niveau: "1er_kyu", categorie: "Jo Dori" },
  { id: "jo_dori_shomen_gokyo", nom: "Jo Dori Shomen Uchi Gokyo", description: "Défense contre frappe - Gokyo", niveau: "1er_kyu", categorie: "Jo Dori" },
  { id: "jo_dori_tsuki_irimi", nom: "Jo Dori Tsuki Irimi Nage", description: "Défense contre pique - Irimi Nage", niveau: "2e_kyu", categorie: "Jo Dori" },
  { id: "jo_dori_tsuki_kote", nom: "Jo Dori Tsuki Kote Gaeshi", description: "Défense contre pique - Kote Gaeshi", niveau: "2e_kyu", categorie: "Jo Dori" },
  { id: "jo_dori_tsuki_shiho", nom: "Jo Dori Tsuki Shiho Nage", description: "Défense contre pique - Shiho Nage", niveau: "1er_kyu", categorie: "Jo Dori" },
  { id: "jo_dori_yokomen_shiho", nom: "Jo Dori Yokomen Shiho Nage", description: "Défense contre frappe latérale - Shiho Nage", niveau: "1er_kyu", categorie: "Jo Dori" },
  { id: "jo_dori_yokomen_kokyu", nom: "Jo Dori Yokomen Kokyu Nage", description: "Défense contre frappe latérale - Kokyu Nage", niveau: "shodan", categorie: "Jo Dori" },
  
  // Jo Nage
  { id: "jo_nage_tsuki", nom: "Jo Nage Tsuki", description: "Projection avec pique du bâton", niveau: "2e_kyu", categorie: "Jo Nage" },
  { id: "jo_nage_gaeshi", nom: "Jo Nage Gaeshi", description: "Projection avec retournement du bâton", niveau: "1er_kyu", categorie: "Jo Nage" },
  { id: "jo_nage_uchi", nom: "Jo Nage Uchi", description: "Projection avec frappe du bâton", niveau: "1er_kyu", categorie: "Jo Nage" }
];

// BOKKEN (Sabre)
export const TECHNIQUES_BOKKEN = [
  // Ken Suburi (7)
  { id: "ken_suburi_1", nom: "Shomen Uchi Ikkyo", description: "Frappe verticale de base", niveau: "5e_kyu", ordre: 1, categorie: "Ken Suburi" },
  { id: "ken_suburi_2", nom: "Shomen Uchi Nikyo (Zenpo)", description: "Frappe verticale avec pas en avant", niveau: "5e_kyu", ordre: 2, categorie: "Ken Suburi" },
  { id: "ken_suburi_3", nom: "Shomen Uchi Sankyo (Kotai)", description: "Frappe verticale avec pas en arrière", niveau: "4e_kyu", ordre: 3, categorie: "Ken Suburi" },
  { id: "ken_suburi_4", nom: "Shomen Uchi Yonkyo (Zenpo Kotai)", description: "Frappe verticale avec pas avant-arrière", niveau: "4e_kyu", ordre: 4, categorie: "Ken Suburi" },
  { id: "ken_suburi_5", nom: "Yokomen Uchi Gokyo (Zenpo)", description: "Frappe latérale avec pas en avant", niveau: "3e_kyu", ordre: 5, categorie: "Ken Suburi" },
  { id: "ken_suburi_6", nom: "Yokomen Uchi Rokkyo (Kotai)", description: "Frappe latérale avec pas en arrière", niveau: "3e_kyu", ordre: 6, categorie: "Ken Suburi" },
  { id: "ken_suburi_7", nom: "Yokomen Uchi Nanakyo (Zenpo Kotai)", description: "Frappe latérale avec pas avant-arrière", niveau: "2e_kyu", ordre: 7, categorie: "Ken Suburi" },
  
  // Kumi Tachi (5)
  { id: "kumitachi_1", nom: "Kumi Tachi Ichi", description: "Premier exercice au sabre à deux", niveau: "3e_kyu", ordre: 1, categorie: "Kumi Tachi" },
  { id: "kumitachi_2", nom: "Kumi Tachi Ni", description: "Deuxième exercice au sabre à deux", niveau: "3e_kyu", ordre: 2, categorie: "Kumi Tachi" },
  { id: "kumitachi_3", nom: "Kumi Tachi San", description: "Troisième exercice au sabre à deux", niveau: "2e_kyu", ordre: 3, categorie: "Kumi Tachi" },
  { id: "kumitachi_4", nom: "Kumi Tachi Yon", description: "Quatrième exercice au sabre à deux", niveau: "2e_kyu", ordre: 4, categorie: "Kumi Tachi" },
  { id: "kumitachi_5", nom: "Kumi Tachi Go", description: "Cinquième exercice au sabre à deux", niveau: "1er_kyu", ordre: 5, categorie: "Kumi Tachi" },
  
  // Tachi Dori (12)
  { id: "tachi_dori_shomen_ikkyo", nom: "Tachi Dori Shomen Uchi Ikkyo", description: "Défense contre frappe verticale au sabre", niveau: "1er_kyu", categorie: "Tachi Dori" },
  { id: "tachi_dori_shomen_nikyo", nom: "Tachi Dori Shomen Uchi Nikyo", description: "Défense contre frappe - Nikyo", niveau: "shodan", categorie: "Tachi Dori" },
  { id: "tachi_dori_shomen_sankyo", nom: "Tachi Dori Shomen Uchi Sankyo", description: "Défense contre frappe - Sankyo", niveau: "shodan", categorie: "Tachi Dori" },
  { id: "tachi_dori_shomen_yonkyo", nom: "Tachi Dori Shomen Uchi Yonkyo", description: "Défense contre frappe - Yonkyo", niveau: "shodan", categorie: "Tachi Dori" },
  { id: "tachi_dori_shomen_gokyo", nom: "Tachi Dori Shomen Uchi Gokyo", description: "Défense contre frappe - Gokyo", niveau: "shodan", categorie: "Tachi Dori" },
  { id: "tachi_dori_shomen_irimi", nom: "Tachi Dori Shomen Uchi Irimi Nage", description: "Défense contre frappe - Irimi Nage", niveau: "1er_kyu", categorie: "Tachi Dori" },
  { id: "tachi_dori_shomen_shiho", nom: "Tachi Dori Shomen Uchi Shiho Nage", description: "Défense contre frappe - Shiho Nage", niveau: "1er_kyu", categorie: "Tachi Dori" },
  { id: "tachi_dori_shomen_kote", nom: "Tachi Dori Shomen Uchi Kote Gaeshi", description: "Défense contre frappe - Kote Gaeshi", niveau: "1er_kyu", categorie: "Tachi Dori" },
  { id: "tachi_dori_yokomen_shiho", nom: "Tachi Dori Yokomen Shiho Nage", description: "Défense contre frappe latérale - Shiho Nage", niveau: "shodan", categorie: "Tachi Dori" },
  { id: "tachi_dori_yokomen_irimi", nom: "Tachi Dori Yokomen Irimi Nage", description: "Défense contre frappe latérale - Irimi Nage", niveau: "shodan", categorie: "Tachi Dori" },
  { id: "tachi_dori_tsuki_irimi", nom: "Tachi Dori Tsuki Irimi Nage", description: "Défense contre piqué - Irimi Nage", niveau: "nidan", categorie: "Tachi Dori" },
  { id: "tachi_dori_tsuki_kote", nom: "Tachi Dori Tsuki Kote Gaeshi", description: "Défense contre piqué - Kote Gaeshi", niveau: "nidan", categorie: "Tachi Dori" }
];

// TANTO (Couteau)
export const TECHNIQUES_TANTO = [
  // Shomen Uchi (9)
  { id: "tanto_shomen_ikkyo_o", nom: "Tanto Dori Shomen Uchi Ikkyo Omote", description: "Défense contre frappe descendante - Ikkyo côté ouvert", niveau: "2e_kyu", categorie: "Tanto Dori - Shomen Uchi", points_cles: ["Contrôle du poignet armé", "Désarmement en fin"] },
  { id: "tanto_shomen_ikkyo_u", nom: "Tanto Dori Shomen Uchi Ikkyo Ura", description: "Défense contre frappe descendante - Ikkyo côté fermé", niveau: "2e_kyu", categorie: "Tanto Dori - Shomen Uchi", points_cles: ["Pivot fluide", "Maintien du contrôle"] },
  { id: "tanto_shomen_nikyo_o", nom: "Tanto Dori Shomen Uchi Nikyo Omote", description: "Défense contre frappe - Nikyo côté ouvert", niveau: "2e_kyu", categorie: "Tanto Dori - Shomen Uchi" },
  { id: "tanto_shomen_nikyo_u", nom: "Tanto Dori Shomen Uchi Nikyo Ura", description: "Défense contre frappe - Nikyo côté fermé", niveau: "2e_kyu", categorie: "Tanto Dori - Shomen Uchi" },
  { id: "tanto_shomen_sankyo", nom: "Tanto Dori Shomen Uchi Sankyo", description: "Défense contre frappe - Sankyo", niveau: "1er_kyu", categorie: "Tanto Dori - Shomen Uchi" },
  { id: "tanto_shomen_gokyo_o", nom: "Tanto Dori Shomen Uchi Gokyo Omote", description: "Défense contre frappe - Gokyo côté ouvert", niveau: "2e_kyu", categorie: "Tanto Dori - Shomen Uchi", points_cles: ["Technique privilégiée contre arme"] },
  { id: "tanto_shomen_gokyo_u", nom: "Tanto Dori Shomen Uchi Gokyo Ura", description: "Défense contre frappe - Gokyo côté fermé", niveau: "2e_kyu", categorie: "Tanto Dori - Shomen Uchi" },
  { id: "tanto_shomen_shiho_o", nom: "Tanto Dori Shomen Uchi Shiho Nage Omote", description: "Défense contre frappe - Shiho Nage côté ouvert", niveau: "1er_kyu", categorie: "Tanto Dori - Shomen Uchi" },
  { id: "tanto_shomen_shiho_u", nom: "Tanto Dori Shomen Uchi Shiho Nage Ura", description: "Défense contre frappe - Shiho Nage côté fermé", niveau: "1er_kyu", categorie: "Tanto Dori - Shomen Uchi" },
  
  // Yokomen Uchi (4)
  { id: "tanto_yokomen_gokyo_o", nom: "Tanto Dori Yokomen Gokyo Omote", description: "Défense contre frappe latérale - Gokyo côté ouvert", niveau: "2e_kyu", categorie: "Tanto Dori - Yokomen Uchi" },
  { id: "tanto_yokomen_gokyo_u", nom: "Tanto Dori Yokomen Gokyo Ura", description: "Défense contre frappe latérale - Gokyo côté fermé", niveau: "2e_kyu", categorie: "Tanto Dori - Yokomen Uchi" },
  { id: "tanto_yokomen_shiho", nom: "Tanto Dori Yokomen Shiho Nage", description: "Défense contre frappe latérale - Shiho Nage", niveau: "1er_kyu", categorie: "Tanto Dori - Yokomen Uchi" },
  { id: "tanto_yokomen_kote", nom: "Tanto Dori Yokomen Kote Gaeshi", description: "Défense contre frappe latérale - Kote Gaeshi", niveau: "1er_kyu", categorie: "Tanto Dori - Yokomen Uchi" },
  
  // Tsuki (8)
  { id: "tanto_tsuki_ikkyo", nom: "Tanto Dori Tsuki Ikkyo", description: "Défense contre piqué - Ikkyo", niveau: "2e_kyu", categorie: "Tanto Dori - Tsuki" },
  { id: "tanto_tsuki_nikyo", nom: "Tanto Dori Tsuki Nikyo", description: "Défense contre piqué - Nikyo", niveau: "2e_kyu", categorie: "Tanto Dori - Tsuki" },
  { id: "tanto_tsuki_sankyo", nom: "Tanto Dori Tsuki Sankyo", description: "Défense contre piqué - Sankyo", niveau: "1er_kyu", categorie: "Tanto Dori - Tsuki" },
  { id: "tanto_tsuki_gokyo", nom: "Tanto Dori Tsuki Gokyo", description: "Défense contre piqué - Gokyo", niveau: "1er_kyu", categorie: "Tanto Dori - Tsuki" },
  { id: "tanto_tsuki_kote", nom: "Tanto Dori Tsuki Kote Gaeshi", description: "Défense contre piqué - Kote Gaeshi", niveau: "2e_kyu", categorie: "Tanto Dori - Tsuki" },
  { id: "tanto_tsuki_irimi", nom: "Tanto Dori Tsuki Irimi Nage", description: "Défense contre piqué - Irimi Nage", niveau: "1er_kyu", categorie: "Tanto Dori - Tsuki" },
  { id: "tanto_tsuki_kaiten", nom: "Tanto Dori Tsuki Kaiten Nage", description: "Défense contre piqué - Kaiten Nage", niveau: "1er_kyu", categorie: "Tanto Dori - Tsuki" },
  { id: "tanto_tsuki_hiji", nom: "Tanto Dori Tsuki Hiji Kime Osae", description: "Défense contre piqué - Contrôle du coude", niveau: "shodan", categorie: "Tanto Dori - Tsuki" }
];

// ============================================================================
// MOUVEMENTS FONDAMENTAUX
// ============================================================================

// TAI SABAKI (Déplacements)
export const TAI_SABAKI = [
  { id: "irimi", nom: "Irimi", nom_japonais: "入り身", traduction: "Entrer dans le corps", description: "Mouvement d'entrée directe vers le partenaire", niveau: "6e_kyu", categorie: "deplacement_base", points_cles: ["Pas en avant décisif", "Garder le centre bas", "Regard vers le partenaire"], erreurs_communes: ["Hésitation dans l'entrée", "Perte d'équilibre"] },
  { id: "tenkan", nom: "Tenkan", nom_japonais: "転換", traduction: "Pivot", description: "Mouvement de pivot sur le pied avant avec rotation de 180°", niveau: "6e_kyu", categorie: "deplacement_base", points_cles: ["Pivot sur la plante du pied", "Rotation de 180°", "Maintenir le contact"], erreurs_communes: ["Pivot sur le talon", "Perdre le contact"] },
  { id: "irimi_tenkan", nom: "Irimi Tenkan", nom_japonais: "入り身転換", traduction: "Entrée et pivot", description: "Combinaison d'un pas d'entrée suivi d'un pivot", niveau: "6e_kyu", categorie: "deplacement_base", points_cles: ["Enchaînement fluide", "Pas de temps d'arrêt"], erreurs_communes: ["Saccade entre les mouvements"] },
  { id: "kaiten", nom: "Kaiten", nom_japonais: "回転", traduction: "Rotation", description: "Rotation complète du corps sur place", niveau: "5e_kyu", categorie: "deplacement_avance", points_cles: ["Rotation fluide", "Centre stable"], erreurs_communes: ["Déséquilibre"] },
  { id: "tenshin", nom: "Tenshin", nom_japonais: "転身", traduction: "Changement de corps", description: "Mouvement diagonal d'esquive", niveau: "5e_kyu", categorie: "deplacement_avance", points_cles: ["Déplacement diagonal", "Sortie de la ligne d'attaque"] },
  { id: "sokumen", nom: "Sokumen Irimi", nom_japonais: "側面入り身", traduction: "Entrée latérale", description: "Entrée par le côté du partenaire", niveau: "4e_kyu", categorie: "deplacement_avance", points_cles: ["Angle de 90°", "Position latérale"] },
  { id: "ushiro", nom: "Tsugi Ashi", nom_japonais: "継ぎ足", traduction: "Pas glissé", description: "Déplacement avec pieds qui se suivent sans se croiser", niveau: "4e_kyu", categorie: "deplacement_base", points_cles: ["Pieds glissent", "Distance constante"] },
  { id: "ayumi_ashi", nom: "Ayumi Ashi", nom_japonais: "歩み足", traduction: "Pas de marche", description: "Déplacement naturel en marchant", niveau: "6e_kyu", categorie: "deplacement_base" },
  { id: "tai_no_henka", nom: "Tai No Henka", nom_japonais: "体の変化", traduction: "Changement du corps", description: "Exercice fondamental de connexion et pivot", niveau: "6e_kyu", categorie: "exercice_fondamental", points_cles: ["Connexion avec le partenaire", "Pivot synchronisé"] },
  { id: "hiriki_no_yosei", nom: "Hiriki No Yosei", nom_japonais: "肘力の養成", traduction: "Développement de la force du coude", description: "Exercice de renforcement de la connexion par le coude", niveau: "5e_kyu", categorie: "exercice_fondamental" }
];

// UKEMI (Chutes)
export const UKEMI = [
  { id: "mae_ukemi", nom: "Mae Ukemi", nom_japonais: "前受身", traduction: "Chute avant", description: "Chute roulée vers l'avant", niveau: "6e_kyu", categorie: "ukemi_base", points_cles: ["Bras en cercle", "Menton rentré", "Rouler sur l'épaule"], erreurs_communes: ["Rouler sur la colonne", "Tête qui touche"] },
  { id: "ushiro_ukemi", nom: "Ushiro Ukemi", nom_japonais: "後受身", traduction: "Chute arrière", description: "Chute roulée vers l'arrière", niveau: "6e_kyu", categorie: "ukemi_base", points_cles: ["S'asseoir d'abord", "Menton rentré", "Frapper le sol avec le bras"], erreurs_communes: ["Tête qui touche", "Rebond"] },
  { id: "yoko_ukemi", nom: "Yoko Ukemi", nom_japonais: "横受身", traduction: "Chute latérale", description: "Chute sur le côté avec frappe au sol", niveau: "5e_kyu", categorie: "ukemi_base", points_cles: ["Frappe avec tout le bras", "Corps en arc"], erreurs_communes: ["Frappe avec le coude"] },
  { id: "mae_kaiten_ukemi", nom: "Mae Kaiten Ukemi", nom_japonais: "前回転受身", traduction: "Chute roulée avant", description: "Roulade avant complète et fluide", niveau: "5e_kyu", categorie: "ukemi_avance", points_cles: ["Trajectoire diagonale", "Relever immédiat"], erreurs_communes: ["Roulade droite"] },
  { id: "ushiro_kaiten_ukemi", nom: "Ushiro Kaiten Ukemi", nom_japonais: "後回転受身", traduction: "Chute roulée arrière", description: "Roulade arrière complète", niveau: "5e_kyu", categorie: "ukemi_avance" },
  { id: "tobi_ukemi", nom: "Tobi Ukemi", nom_japonais: "飛び受身", traduction: "Chute plongeante", description: "Chute avec envol et roulade", niveau: "3e_kyu", categorie: "ukemi_avance", points_cles: ["Impulsion des jambes", "Bras devant pour amortir"], erreurs_communes: ["Atterrir à plat", "Hésitation"] },
  { id: "zenpo_kaiten_ukemi", nom: "Zenpo Kaiten Ukemi", nom_japonais: "前方回転受身", traduction: "Roulade avant haute", description: "Roulade avant avec amplitude", niveau: "4e_kyu", categorie: "ukemi_avance" },
  { id: "koho_kaiten_ukemi", nom: "Koho Kaiten Ukemi", nom_japonais: "後方回転受身", traduction: "Roulade arrière haute", description: "Roulade arrière avec amplitude", niveau: "4e_kyu", categorie: "ukemi_avance" },
  { id: "shikko", nom: "Shikko", nom_japonais: "膝行", traduction: "Marche à genoux", description: "Déplacement à genoux utilisé en Suwariwaza", niveau: "5e_kyu", categorie: "deplacement_genoux", points_cles: ["Genoux glissent", "Hanches basses", "Dos droit"] }
];

// KAMAE (Postures)
export const KAMAE = [
  { id: "ai_hanmi", nom: "Ai Hanmi", nom_japonais: "相半身", traduction: "Garde identique", description: "Les deux partenaires en garde du même côté", niveau: "6e_kyu", categorie: "kamae_base", points_cles: ["Même pied avant", "Distance appropriée"] },
  { id: "gyaku_hanmi", nom: "Gyaku Hanmi", nom_japonais: "逆半身", traduction: "Garde inversée", description: "Les partenaires en garde opposée", niveau: "6e_kyu", categorie: "kamae_base", points_cles: ["Pieds avant opposés", "Maintenir la ligne centrale"] },
  { id: "migi_hanmi", nom: "Migi Hanmi", nom_japonais: "右半身", traduction: "Garde droite", description: "Pied droit en avant", niveau: "6e_kyu", categorie: "kamae_base" },
  { id: "hidari_hanmi", nom: "Hidari Hanmi", nom_japonais: "左半身", traduction: "Garde gauche", description: "Pied gauche en avant", niveau: "6e_kyu", categorie: "kamae_base" },
  { id: "chudan_no_kamae", nom: "Chudan No Kamae", nom_japonais: "中段の構え", traduction: "Garde moyenne", description: "Position de base avec les mains au niveau du centre", niveau: "6e_kyu", categorie: "kamae_arme" },
  { id: "jodan_no_kamae", nom: "Jodan No Kamae", nom_japonais: "上段の構え", traduction: "Garde haute", description: "Arme levée au-dessus de la tête", niveau: "5e_kyu", categorie: "kamae_arme" },
  { id: "gedan_no_kamae", nom: "Gedan No Kamae", nom_japonais: "下段の構え", traduction: "Garde basse", description: "Arme pointée vers le bas", niveau: "5e_kyu", categorie: "kamae_arme" },
  { id: "hasso_no_kamae", nom: "Hasso No Kamae", nom_japonais: "八相の構え", traduction: "Garde à huit directions", description: "Arme tenue verticalement près de l'épaule", niveau: "4e_kyu", categorie: "kamae_arme" }
];

// ATEMI (Frappes)
export const ATEMI = [
  { id: "shomen_uchi", nom: "Shomen Uchi", nom_japonais: "正面打ち", traduction: "Frappe verticale", description: "Frappe descendante sur le sommet du crâne", niveau: "6e_kyu", categorie: "atemi_main", points_cles: ["Main en sabre", "Trajectoire verticale"] },
  { id: "yokomen_uchi", nom: "Yokomen Uchi", nom_japonais: "横面打ち", traduction: "Frappe latérale", description: "Frappe diagonale vers la tempe", niveau: "6e_kyu", categorie: "atemi_main", points_cles: ["Trajectoire diagonale", "Viser la tempe"] },
  { id: "chudan_tsuki", nom: "Chudan Tsuki", nom_japonais: "中段突き", traduction: "Coup de poing au ventre", description: "Frappe de poing direct au niveau du plexus", niveau: "5e_kyu", categorie: "atemi_poing" },
  { id: "jodan_tsuki", nom: "Jodan Tsuki", nom_japonais: "上段突き", traduction: "Coup de poing au visage", description: "Frappe de poing direct au niveau du visage", niveau: "5e_kyu", categorie: "atemi_poing" },
  { id: "gedan_tsuki", nom: "Gedan Tsuki", nom_japonais: "下段突き", traduction: "Coup de poing bas", description: "Frappe de poing au niveau du bas-ventre", niveau: "4e_kyu", categorie: "atemi_poing" },
  { id: "mune_tsuki", nom: "Mune Tsuki", nom_japonais: "胸突き", traduction: "Coup au thorax", description: "Frappe directe à la poitrine", niveau: "4e_kyu", categorie: "atemi_poing" },
  { id: "ushiro_empi", nom: "Ushiro Empi", nom_japonais: "後肘", traduction: "Coup de coude arrière", description: "Frappe de coude vers l'arrière", niveau: "3e_kyu", categorie: "atemi_coude" },
  { id: "mae_geri", nom: "Mae Geri", nom_japonais: "前蹴り", traduction: "Coup de pied avant", description: "Frappe de pied direct vers l'avant", niveau: "3e_kyu", categorie: "atemi_pied" },
  { id: "yoko_geri", nom: "Yoko Geri", nom_japonais: "横蹴り", traduction: "Coup de pied latéral", description: "Frappe de pied sur le côté", niveau: "2e_kyu", categorie: "atemi_pied" }
];

// KOKYU WAZA (Techniques de respiration/Ki)
export const KOKYU_WAZA = [
  { id: "kokyu_dosa", nom: "Kokyu Dosa", nom_japonais: "呼吸動作", traduction: "Exercice de respiration", description: "Exercice à genoux de développement du Kokyu", niveau: "6e_kyu", categorie: "kokyu_base", points_cles: ["Extension du Ki", "Coordination avec la respiration"] },
  { id: "kokyu_ho", nom: "Kokyu Ho", nom_japonais: "呼吸法", traduction: "Méthode de respiration", description: "Technique de projection par le souffle", niveau: "5e_kyu", categorie: "kokyu_base" },
  { id: "kokyu_nage", nom: "Kokyu Nage", nom_japonais: "呼吸投げ", traduction: "Projection par le souffle", description: "Projection utilisant principalement le timing et le Kokyu", niveau: "4e_kyu", categorie: "kokyu_projection" },
  { id: "tenchi_nage", nom: "Tenchi Nage", nom_japonais: "天地投げ", traduction: "Projection ciel-terre", description: "Projection avec une main vers le haut, l'autre vers le bas", niveau: "4e_kyu", categorie: "kokyu_projection", points_cles: ["Une main monte", "Une main descend", "Corps unifié"] },
  { id: "sumi_otoshi", nom: "Sumi Otoshi", nom_japonais: "隅落とし", traduction: "Chute dans l'angle", description: "Projection dans l'angle mort du partenaire", niveau: "3e_kyu", categorie: "kokyu_projection" },
  { id: "aiki_otoshi", nom: "Aiki Otoshi", nom_japonais: "合気落とし", traduction: "Chute Aiki", description: "Projection utilisant le principe de l'Aiki", niveau: "3e_kyu", categorie: "kokyu_projection" }
];

// KANSETSU WAZA (Techniques de clés articulaires)
export const KANSETSU_WAZA = [
  { id: "ikkyo", nom: "Ikkyo", nom_japonais: "一教", traduction: "Premier principe", description: "Contrôle du bras en extension avec pression sur le coude", niveau: "6e_kyu", categorie: "osae_waza", points_cles: ["Contrôle du coude", "Extension du bras", "Maintien au sol"] },
  { id: "nikyo", nom: "Nikyo", nom_japonais: "二教", traduction: "Deuxième principe", description: "Contrôle par torsion du poignet vers l'intérieur", niveau: "5e_kyu", categorie: "osae_waza", points_cles: ["Torsion du poignet", "Pression sur le nerf"] },
  { id: "sankyo", nom: "Sankyo", nom_japonais: "三教", traduction: "Troisième principe", description: "Contrôle par torsion du poignet vers l'extérieur", niveau: "4e_kyu", categorie: "osae_waza", points_cles: ["Torsion spirale", "Contrôle du coude"] },
  { id: "yonkyo", nom: "Yonkyo", nom_japonais: "四教", traduction: "Quatrième principe", description: "Contrôle par pression sur un point nerveux de l'avant-bras", niveau: "3e_kyu", categorie: "osae_waza", points_cles: ["Point de pression", "Extension du bras"] },
  { id: "gokyo", nom: "Gokyo", nom_japonais: "五教", traduction: "Cinquième principe", description: "Technique spécifique pour le désarmement (couteau)", niveau: "2e_kyu", categorie: "osae_waza", points_cles: ["Poignet vers l'extérieur", "Immobilisation pour désarmement"] },
  { id: "kote_gaeshi", nom: "Kote Gaeshi", nom_japonais: "小手返し", traduction: "Retournement du poignet", description: "Projection par retournement du poignet vers l'extérieur", niveau: "4e_kyu", categorie: "nage_waza", points_cles: ["Saisie du poignet", "Rotation vers l'extérieur"] },
  { id: "shiho_nage", nom: "Shiho Nage", nom_japonais: "四方投げ", traduction: "Projection dans les quatre directions", description: "Projection en guidant le bras dans un grand arc", niveau: "5e_kyu", categorie: "nage_waza", points_cles: ["Grand arc du bras", "Couper vers le bas"] },
  { id: "irimi_nage", nom: "Irimi Nage", nom_japonais: "入身投げ", traduction: "Projection par entrée", description: "Projection par entrée et contrôle de la nuque", niveau: "5e_kyu", categorie: "nage_waza", points_cles: ["Entrée profonde", "Contrôle de la nuque"] },
  { id: "kaiten_nage", nom: "Kaiten Nage", nom_japonais: "回転投げ", traduction: "Projection rotative", description: "Projection en faisant tourner le partenaire", niveau: "4e_kyu", categorie: "nage_waza" },
  { id: "koshi_nage", nom: "Koshi Nage", nom_japonais: "腰投げ", traduction: "Projection de hanche", description: "Projection en chargeant le partenaire sur la hanche", niveau: "3e_kyu", categorie: "nage_waza", points_cles: ["Charge sur la hanche", "Basculement"] }
];

// SUWARIWAZA (Techniques à genoux)
export const SUWARIWAZA = [
  { id: "suwari_ikkyo", nom: "Suwariwaza Ikkyo", nom_japonais: "座り技一教", traduction: "Ikkyo à genoux", description: "Premier principe exécuté à genoux", niveau: "4e_kyu", categorie: "suwariwaza_kihon" },
  { id: "suwari_nikyo", nom: "Suwariwaza Nikyo", nom_japonais: "座り技二教", traduction: "Nikyo à genoux", description: "Deuxième principe exécuté à genoux", niveau: "3e_kyu", categorie: "suwariwaza_kihon" },
  { id: "suwari_sankyo", nom: "Suwariwaza Sankyo", nom_japonais: "座り技三教", traduction: "Sankyo à genoux", description: "Troisième principe exécuté à genoux", niveau: "2e_kyu", categorie: "suwariwaza_kihon" },
  { id: "suwari_yonkyo", nom: "Suwariwaza Yonkyo", nom_japonais: "座り技四教", traduction: "Yonkyo à genoux", description: "Quatrième principe exécuté à genoux", niveau: "1er_kyu", categorie: "suwariwaza_kihon" },
  { id: "suwari_gokyo", nom: "Suwariwaza Gokyo", nom_japonais: "座り技五教", traduction: "Gokyo à genoux", description: "Cinquième principe exécuté à genoux", niveau: "shodan", categorie: "suwariwaza_kihon" },
  { id: "suwari_irimi", nom: "Suwariwaza Irimi Nage", nom_japonais: "座り技入身投げ", traduction: "Irimi Nage à genoux", description: "Projection par entrée à genoux", niveau: "3e_kyu", categorie: "suwariwaza_nage" },
  { id: "suwari_shiho", nom: "Suwariwaza Shiho Nage", nom_japonais: "座り技四方投げ", traduction: "Shiho Nage à genoux", description: "Projection 4 directions à genoux", niveau: "3e_kyu", categorie: "suwariwaza_nage" },
  { id: "suwari_kote", nom: "Suwariwaza Kote Gaeshi", nom_japonais: "座り技小手返し", traduction: "Kote Gaeshi à genoux", description: "Retournement du poignet à genoux", niveau: "2e_kyu", categorie: "suwariwaza_nage" },
  { id: "suwari_kokyu_ho", nom: "Suwariwaza Kokyu Ho", nom_japonais: "座り技呼吸法", traduction: "Kokyu Ho à genoux", description: "Exercice de respiration à genoux", niveau: "6e_kyu", categorie: "suwariwaza_kokyu", points_cles: ["Extension du Ki", "Coordination respiration-mouvement"] },
  { id: "suwari_kokyu_dosa", nom: "Suwariwaza Kokyu Dosa", nom_japonais: "座り技呼吸動作", traduction: "Exercice de respiration à genoux", description: "Exercice fondamental de développement du Kokyu", niveau: "6e_kyu", categorie: "suwariwaza_kokyu" }
];

// HANMI HANDACHI (Semi-debout)
export const HANMI_HANDACHI = [
  { id: "hh_shiho_nage", nom: "Hanmi Handachi Shiho Nage", nom_japonais: "半身半立四方投げ", traduction: "Shiho Nage semi-debout", description: "Projection 4 directions - Tori à genoux, Uke debout", niveau: "3e_kyu", categorie: "hanmi_handachi", points_cles: ["Gestion de la hauteur", "Utilisation du centre bas"] },
  { id: "hh_irimi_nage", nom: "Hanmi Handachi Irimi Nage", nom_japonais: "半身半立入身投げ", traduction: "Irimi Nage semi-debout", description: "Projection par entrée - Tori à genoux", niveau: "3e_kyu", categorie: "hanmi_handachi" },
  { id: "hh_kote_gaeshi", nom: "Hanmi Handachi Kote Gaeshi", nom_japonais: "半身半立小手返し", traduction: "Kote Gaeshi semi-debout", description: "Retournement du poignet - Tori à genoux", niveau: "2e_kyu", categorie: "hanmi_handachi" },
  { id: "hh_kaiten_nage", nom: "Hanmi Handachi Kaiten Nage", nom_japonais: "半身半立回転投げ", traduction: "Kaiten Nage semi-debout", description: "Projection rotative - Tori à genoux", niveau: "2e_kyu", categorie: "hanmi_handachi" },
  { id: "hh_ikkyo", nom: "Hanmi Handachi Ikkyo", nom_japonais: "半身半立一教", traduction: "Ikkyo semi-debout", description: "Premier principe - Tori à genoux", niveau: "2e_kyu", categorie: "hanmi_handachi" },
  { id: "hh_nikyo", nom: "Hanmi Handachi Nikyo", nom_japonais: "半身半立二教", traduction: "Nikyo semi-debout", description: "Deuxième principe - Tori à genoux", niveau: "1er_kyu", categorie: "hanmi_handachi" },
  { id: "hh_sankyo", nom: "Hanmi Handachi Sankyo", nom_japonais: "半身半立三教", traduction: "Sankyo semi-debout", description: "Troisième principe - Tori à genoux", niveau: "1er_kyu", categorie: "hanmi_handachi" },
  { id: "hh_kokyu_nage", nom: "Hanmi Handachi Kokyu Nage", nom_japonais: "半身半立呼吸投げ", traduction: "Kokyu Nage semi-debout", description: "Projection par le souffle - Tori à genoux", niveau: "2e_kyu", categorie: "hanmi_handachi" }
];

export default {
  TECHNIQUES_JO,
  TECHNIQUES_BOKKEN,
  TECHNIQUES_TANTO,
  TAI_SABAKI,
  UKEMI,
  KAMAE,
  ATEMI,
  KOKYU_WAZA,
  KANSETSU_WAZA,
  SUWARIWAZA,
  HANMI_HANDACHI
};
