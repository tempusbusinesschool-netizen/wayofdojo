/**
 * 🥋 BASE DE DONNÉES DES CLUBS D'AÏKIDO FFAAA
 * France métropolitaine et territoires d'outre-mer
 * 
 * Sources: FFAAA, FFAB, Ligues régionales
 */

export const REGIONS_FRANCE = {
  // Métropole
  idf: { name: 'Île-de-France', emoji: '🗼', code: '75-77-78-91-92-93-94-95' },
  ara: { name: 'Auvergne-Rhône-Alpes', emoji: '⛰️', code: '01-03-07-15-26-38-42-43-63-69-73-74' },
  bfc: { name: 'Bourgogne-Franche-Comté', emoji: '🍇', code: '21-25-39-58-70-71-89-90' },
  bretagne: { name: 'Bretagne', emoji: '⚓', code: '22-29-35-56' },
  cvl: { name: 'Centre-Val de Loire', emoji: '🏰', code: '18-28-36-37-41-45' },
  corse: { name: 'Corse', emoji: '🏝️', code: '2A-2B' },
  grand_est: { name: 'Grand Est', emoji: '🏛️', code: '08-10-51-52-54-55-57-67-68-88' },
  hdf: { name: 'Hauts-de-France', emoji: '🏭', code: '02-59-60-62-80' },
  normandie: { name: 'Normandie', emoji: '🍎', code: '14-27-50-61-76' },
  nouvelle_aquitaine: { name: 'Nouvelle-Aquitaine', emoji: '🍷', code: '16-17-19-23-24-33-40-47-64-79-86-87' },
  occitanie: { name: 'Occitanie', emoji: '☀️', code: '09-11-12-30-31-32-34-46-48-65-66-81-82' },
  pdl: { name: 'Pays de la Loire', emoji: '🌊', code: '44-49-53-72-85' },
  paca: { name: 'Provence-Alpes-Côte d\'Azur', emoji: '🌴', code: '04-05-06-13-83-84' },
  
  // DOM-TOM
  reunion: { name: 'La Réunion', emoji: '🌺', code: '974' },
  guadeloupe: { name: 'Guadeloupe', emoji: '🌸', code: '971' },
  martinique: { name: 'Martinique', emoji: '🌺', code: '972' },
  guyane: { name: 'Guyane', emoji: '🌳', code: '973' },
  mayotte: { name: 'Mayotte', emoji: '🐢', code: '976' },
  nouvelle_caledonie: { name: 'Nouvelle-Calédonie', emoji: '🦜', code: '988' },
  polynesie: { name: 'Polynésie française', emoji: '🏝️', code: '987' }
};

export const CLUBS_AIKIDO_FRANCE = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ÎLE-DE-FRANCE (75, 77, 78, 91, 92, 93, 94, 95)
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Paris (75)
  { id: 'aspp-paris', name: 'A.S.P.P. Aïkibudo', city: 'Paris 5e', region: 'idf', address: '4 rue des Arènes, 75005 Paris', email: 'contact@aspp.paris', website: 'aspp.paris', federation: 'FFAAA' },
  { id: 'ifa-alesia', name: 'Institut Français d\'Aïkido - Dojo Alésia', city: 'Paris 14e', region: 'idf', address: '3 Villa d\'Orléans, 75014 Paris', phone: '06 01 86 94 64', email: 'aikiryu14@gmail.com', website: 'institut-francais-aikido.org', federation: 'FFAAA' },
  { id: 'ifa-guilleminot', name: 'Institut Français d\'Aïkido - Dojo Guilleminot', city: 'Paris 14e', region: 'idf', address: '22 rue Guilleminot, 75014 Paris', federation: 'FFAAA' },
  { id: 'gcercce-paris', name: 'GCERCCE Aïkido Paris', city: 'Paris 12e', region: 'idf', address: '13 rue des Colonnes du Trône, 75012 Paris', phone: '01 82 09 87 38', federation: 'FFAAA' },
  { id: 'ki-aikido-k2a', name: 'Ki Aikido Association K2A', city: 'Paris 11e', region: 'idf', address: '15 av. Taillebourg, 75011 Paris', federation: 'FFAAA' },
  { id: 'fleur-sabre', name: 'La Fleur et le Sabre - Aïkido ENS', city: 'Paris 5e', region: 'idf', federation: 'FFAAA' },
  { id: 'paris-aikido-club', name: 'Paris Aïkido Club', city: 'Paris 5e', region: 'idf', federation: 'FFAAA' },
  { id: 'tenchi-paris', name: 'Association Tenchi', city: 'Paris 10e', region: 'idf', federation: 'FFAAA' },
  { id: 'ikigai-paris', name: 'Ikigai Aïkido Club', city: 'Paris 13e', region: 'idf', federation: 'FFAAA' },
  { id: 'puc-aikido', name: 'Paris Université Club - Aïkido', city: 'Paris 13e', region: 'idf', federation: 'FFAAA' },
  { id: 'cercle-omnisport', name: 'Cercle Omnisport de Paris Centre', city: 'Paris 1er/3e', region: 'idf', federation: 'FFAAA' },
  { id: 'atheon-paris', name: 'Club Atheon', city: 'Paris 16e', region: 'idf', federation: 'FFAAA' },
  { id: 'ima-iru', name: 'Ima Iru Groupe Daniel Martin', city: 'Paris 19e', region: 'idf', federation: 'FFAAA' },
  { id: 'cercle-parisien', name: 'Le Cercle d\'Aïkido Parisien', city: 'Paris 20e', region: 'idf', federation: 'FFAAA' },
  { id: 'amandiers', name: 'Association des Amandiers', city: 'Paris 20e', region: 'idf', federation: 'FFAAA' },
  { id: 'samouai-club', name: 'ACSEMD Samouai Club', city: 'Paris 14e', region: 'idf', federation: 'FFAAA' },
  { id: 'eta-paris', name: 'Ecole Traditionnelle d\'Aïkido', city: 'Paris 15e', region: 'idf', federation: 'FFAAA' },
  { id: 'acme-sante', name: 'ACME Santé', city: 'Paris 16e', region: 'idf', federation: 'FFAAA' },
  
  // Yvelines (78)
  { id: 'asff-fontenay', name: 'A.S.F.F. Aïkido Fontenay-le-Fleury', city: 'Fontenay-le-Fleury', region: 'idf', address: 'Gymnase Descartes, rue Descartes, 78330 Fontenay-le-Fleury', phone: '01 30 56 16 63', email: 'pat.chassin@laposte.net', website: 'aikidofontenay.fr', federation: 'FFAAA' },
  { id: 'amba78', name: 'AMBA78 Bois-d\'Arcy', city: 'Bois-d\'Arcy', region: 'idf', address: 'Hôtel de Ville, 2 Avenue Paul Vaillant Couturier, 78390 Bois-d\'Arcy', phone: '01 39 63 36 42', email: 'jfrancois-dominique.bo@wanadoo.fr', website: 'amba78.fr', federation: 'FFAAA' },
  { id: 'chatou-aikikai', name: 'Aïkikai de Chatou', city: 'Chatou', region: 'idf', federation: 'FFAAA' },
  
  // Essonne (91)
  { id: 'amam-mennecy', name: 'A.M.AM Aïkibudo Mennecy', city: 'Mennecy', region: 'idf', address: 'Dojo Gérard Pizzonero, Parc des Sports de Villeroy, 91540 Mennecy', phone: '01 64 57 32 49', email: 'amam91540@gmail.com', website: 'mennecy-dojo.com', federation: 'FFAAA' },
  { id: 'mjc-palaiseau', name: 'MJC Palaiseau - Aïkido', city: 'Palaiseau', region: 'idf', federation: 'FFAAA' },
  
  // Seine-et-Marne (77)
  { id: 'ac-chateau-landon', name: 'AC de Château-Landon', city: 'Château-Landon', region: 'idf', address: 'Rue André Gauquelin, Dojo de Château-Landon, 77570 Château-Landon', website: 'acchateaulandon.clubeo.com', federation: 'FFAAA' },
  { id: 'afa-pontault', name: 'Association Francilienne d\'Aïkido', city: 'Pontault-Combault', region: 'idf', federation: 'FFAAA' },
  
  // Hauts-de-Seine (92)
  { id: 'alc-meudon', name: 'ALC Meudon - Aïkido', city: 'Meudon', region: 'idf', federation: 'FFAAA' },
  { id: 'esn-nanterre', name: 'Entente Sportive de Nanterre Aïkido', city: 'Nanterre', region: 'idf', federation: 'FFAAA' },
  { id: 'keaido-puteaux', name: 'KE-AIDO Puteaux', city: 'Puteaux', region: 'idf', federation: 'FFAAA' },
  { id: 'clamart-aikido', name: 'Aïkido Club de Clamart', city: 'Clamart', region: 'idf', federation: 'FFAAA' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // HAUTS-DE-FRANCE (02, 59, 60, 62, 80)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'waka-wavrin', name: 'WAVRIN AIKIBUDO KOBUDO ASSOCIATION (WAKA)', city: 'Wavrin', region: 'hdf', address: 'Halle des Sports - Rue de Verdun, 59136 Wavrin', phone: '06 80 53 47 08', email: 'katori.cslg@outlook.fr', federation: 'FFAAA', instructors: ['Régis Morel (3e Dan)', 'Frédéric Hainaut'] },
  { id: 'jc-annappes', name: 'JC Aïkibudo Annappes', city: 'Villeneuve d\'Ascq', region: 'hdf', address: '55 Bd de Valmy, 59650 Villeneuve d\'Ascq', phone: '06 22 02 26 24', email: 'aikibudo.phalempin@gmail.com', federation: 'FFAAA', instructors: ['Didier Renaud (2e Dan)', 'Frédéric Mathieu (3e Dan)'] },
  { id: 'aikibudo-houdain', name: 'Aïkibudo / Kobudo Houdain', city: 'Houdain', region: 'hdf', address: '8 Rue Roger Salengro, 62150 Houdain', email: 'laiglejf283@gmail.com', federation: 'FFAAA' },
  { id: 'budo-kwai-armentieres', name: 'Budo Kwaï Armentières', city: 'Armentières', region: 'hdf', federation: 'FFAAA' },
  { id: 'aikido-bray-dunes', name: 'Aïkido Bray-Dunes', city: 'Bray-Dunes', region: 'hdf', federation: 'FFAAA' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NORMANDIE (14, 27, 50, 61, 76)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'accaama-cherbourg', name: 'ACCAAMA Cherbourg', city: 'Cherbourg', region: 'normandie', federation: 'FFAAA' },
  { id: 'aikido-agneaux', name: 'Aïkido Agneaux', city: 'Agneaux', region: 'normandie', federation: 'FFAAA' },
  { id: 'aikido-bayeux', name: 'Aïkido Bayeux et Rots', city: 'Bayeux', region: 'normandie', federation: 'FFAAA' },
  { id: 'aikido-cherbourg', name: 'Aïkido Cherbourg', city: 'Cherbourg', region: 'normandie', federation: 'FFAAA' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // BRETAGNE (22, 29, 35, 56)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'aikido-rennes', name: 'Aïkido Club de Rennes', city: 'Rennes', region: 'bretagne', federation: 'FFAAA' },
  { id: 'aikido-brest', name: 'Aïkido Club de Brest', city: 'Brest', region: 'bretagne', federation: 'FFAAA' },
  { id: 'aikido-vannes', name: 'Aïkido Club de Vannes', city: 'Vannes', region: 'bretagne', federation: 'FFAAA' },
  { id: 'aikido-lorient', name: 'Aïkido Club de Lorient', city: 'Lorient', region: 'bretagne', federation: 'FFAAA' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // GRAND EST (08, 10, 51, 52, 54, 55, 57, 67, 68, 88)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'aikido-strasbourg', name: 'Aïkido Club de Strasbourg', city: 'Strasbourg', region: 'grand_est', federation: 'FFAAA' },
  { id: 'aikido-mulhouse', name: 'Aïkido Club de Mulhouse', city: 'Mulhouse', region: 'grand_est', federation: 'FFAAA' },
  { id: 'aikido-nancy', name: 'Aïkido Club de Nancy', city: 'Nancy', region: 'grand_est', federation: 'FFAAA' },
  { id: 'aikido-metz', name: 'Aïkido Club de Metz', city: 'Metz', region: 'grand_est', federation: 'FFAAA' },
  { id: 'aikido-reims', name: 'Aïkido Club de Reims', city: 'Reims', region: 'grand_est', federation: 'FFAAA' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NOUVELLE-AQUITAINE (16, 17, 19, 23, 24, 33, 40, 47, 64, 79, 86, 87)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'cid-aquitaine', name: 'Aïkido CID Aquitaine', city: 'Bordeaux', region: 'nouvelle_aquitaine', website: 'aikido-cid-aquitaine-ffaaa.fr', federation: 'FFAAA' },
  { id: 'aikido-bordeaux', name: 'Aïkido Club de Bordeaux', city: 'Bordeaux', region: 'nouvelle_aquitaine', federation: 'FFAAA' },
  { id: 'aikido-limoges', name: 'Aïkido Club de Limoges', city: 'Limoges', region: 'nouvelle_aquitaine', federation: 'FFAAA' },
  { id: 'aikido-poitiers', name: 'Aïkido Club de Poitiers', city: 'Poitiers', region: 'nouvelle_aquitaine', federation: 'FFAAA' },
  { id: 'aikido-pau', name: 'Aïkido Club de Pau', city: 'Pau', region: 'nouvelle_aquitaine', federation: 'FFAAA' },
  { id: 'aikido-bayonne', name: 'Aïkido Club de Bayonne', city: 'Bayonne', region: 'nouvelle_aquitaine', federation: 'FFAAA' },
  { id: 'aikido-cestas', name: 'Aïkido Club de Cestas', city: 'Cestas', region: 'nouvelle_aquitaine', federation: 'FFAAA' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // OCCITANIE (09, 11, 12, 30, 31, 32, 34, 46, 48, 65, 66, 81, 82)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'aikido-toulouse', name: 'Aïkido Club de Toulouse', city: 'Toulouse', region: 'occitanie', federation: 'FFAAA' },
  { id: 'aikido-montpellier', name: 'Aïkido Club de Montpellier', city: 'Montpellier', region: 'occitanie', federation: 'FFAAA' },
  { id: 'aikido-nimes', name: 'Aïkido Club de Nîmes', city: 'Nîmes', region: 'occitanie', federation: 'FFAAA' },
  { id: 'aikido-perpignan', name: 'Aïkido Club de Perpignan', city: 'Perpignan', region: 'occitanie', federation: 'FFAAA' },
  { id: 'aikido-tarbes', name: 'Aïkido Club de Tarbes', city: 'Tarbes', region: 'occitanie', federation: 'FFAAA' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // AUVERGNE-RHÔNE-ALPES (01, 03, 07, 15, 26, 38, 42, 43, 63, 69, 73, 74)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'aikido-lyon', name: 'Aïkido Club de Lyon', city: 'Lyon', region: 'ara', federation: 'FFAAA' },
  { id: 'aikido-grenoble', name: 'Aïkido Club de Grenoble', city: 'Grenoble', region: 'ara', federation: 'FFAAA' },
  { id: 'aikido-saint-etienne', name: 'Aïkido Club de Saint-Étienne', city: 'Saint-Étienne', region: 'ara', federation: 'FFAAA' },
  { id: 'aikido-clermont', name: 'Aïkido Club de Clermont-Ferrand', city: 'Clermont-Ferrand', region: 'ara', federation: 'FFAAA' },
  { id: 'aikido-annecy', name: 'Aïkido Club d\'Annecy', city: 'Annecy', region: 'ara', federation: 'FFAAA' },
  { id: 'aikido-chambery', name: 'Aïkido Club de Chambéry', city: 'Chambéry', region: 'ara', federation: 'FFAAA' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PROVENCE-ALPES-CÔTE D'AZUR (04, 05, 06, 13, 83, 84)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'aikido-marseille', name: 'Aïkido Club de Marseille', city: 'Marseille', region: 'paca', federation: 'FFAAA' },
  { id: 'aikido-nice', name: 'Aïkido Club de Nice', city: 'Nice', region: 'paca', federation: 'FFAAA' },
  { id: 'aikido-toulon', name: 'Aïkido Club de Toulon', city: 'Toulon', region: 'paca', federation: 'FFAAA' },
  { id: 'aikido-aix', name: 'Aïkido Club d\'Aix-en-Provence', city: 'Aix-en-Provence', region: 'paca', federation: 'FFAAA' },
  { id: 'aikido-avignon', name: 'Aïkido Club d\'Avignon', city: 'Avignon', region: 'paca', federation: 'FFAAA' },
  { id: 'aikido-cannes', name: 'Aïkido Club de Cannes', city: 'Cannes', region: 'paca', federation: 'FFAAA' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PAYS DE LA LOIRE (44, 49, 53, 72, 85)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'aikido-nantes', name: 'Aïkido Club de Nantes', city: 'Nantes', region: 'pdl', federation: 'FFAAA' },
  { id: 'aikido-angers', name: 'Aïkido Club d\'Angers', city: 'Angers', region: 'pdl', federation: 'FFAAA' },
  { id: 'aikido-lemans', name: 'Aïkido Club du Mans', city: 'Le Mans', region: 'pdl', federation: 'FFAAA' },
  { id: 'aikido-larochesuryon', name: 'Aïkido Club de La Roche-sur-Yon', city: 'La Roche-sur-Yon', region: 'pdl', federation: 'FFAAA' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CENTRE-VAL DE LOIRE (18, 28, 36, 37, 41, 45)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'aikido-orleans', name: 'Aïkido Club d\'Orléans', city: 'Orléans', region: 'cvl', federation: 'FFAAA' },
  { id: 'aikido-tours', name: 'Aïkido Club de Tours', city: 'Tours', region: 'cvl', federation: 'FFAAA' },
  { id: 'aikido-blois', name: 'Aïkido Club de Blois', city: 'Blois', region: 'cvl', federation: 'FFAAA' },
  { id: 'aikido-bourges', name: 'Aïkido Club de Bourges', city: 'Bourges', region: 'cvl', federation: 'FFAAA' },
  { id: 'aikido-chartres', name: 'Aïkido Club de Chartres', city: 'Chartres', region: 'cvl', federation: 'FFAAA' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // BOURGOGNE-FRANCHE-COMTÉ (21, 25, 39, 58, 70, 71, 89, 90)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'aikido-dijon', name: 'Aïkido Club de Dijon', city: 'Dijon', region: 'bfc', federation: 'FFAAA' },
  { id: 'aikido-besancon', name: 'Aïkido Club de Besançon', city: 'Besançon', region: 'bfc', federation: 'FFAAA' },
  { id: 'aikido-belfort', name: 'Aïkido Club de Belfort', city: 'Belfort', region: 'bfc', federation: 'FFAAA' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CORSE (2A, 2B)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'aikido-ajaccio', name: 'Aïkido Club d\'Ajaccio', city: 'Ajaccio', region: 'corse', federation: 'FFAAA' },
  { id: 'aikido-bastia', name: 'Aïkido Club de Bastia', city: 'Bastia', region: 'corse', federation: 'FFAAA' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // LA RÉUNION (974)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'abcs-saint-pierre', name: 'Aïkido Budo Club du Sud (ABCS)', city: 'Saint-Pierre', region: 'reunion', website: 'aikido-saint-pierre.fr', federation: 'LRFFAAA', description: 'Fondé en 2014' },
  { id: 'aikido-ouest-leport', name: 'Aïkido Club de l\'Ouest', city: 'Le Port', region: 'reunion', address: 'Dojo Louis Payet, Stade Olivier Manes, Avenue de la Commune de Paris, 97825 Le Port', instructors: ['Jean-François Barbe (5e Dan)'], federation: 'LRFFAAA' },
  { id: 'acsp-saint-pierre', name: 'Aïkido Club de Saint-Pierre (ACSP)', city: 'Saint-Pierre', region: 'reunion', address: 'Dojo Casabona, Saint-Pierre', website: 'aikido-club-de-saint-pierre.pepsup.com', federation: 'LRFFAAA', description: 'Stage vendredi 19h-20h30 aux Grands Bois' },
  { id: 'aikido-dionysien', name: 'Aïkido Club Dionysien', city: 'Saint-Denis', region: 'reunion', website: 'aikidoclubdionysien.wordpress.com', federation: 'LRFFAAA' },
  { id: 'kishinkai-clotilde', name: 'Kishinkai Sainte-Clotilde', city: 'Sainte-Clotilde', region: 'reunion', federation: 'LRFFAAA' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NOUVELLE-CALÉDONIE (988)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'cbc-noumea', name: 'Club Aïkido CBC (Cercle Bushido Calédonien)', city: 'Nouméa', region: 'nouvelle_caledonie', address: 'Salle Marius Jocteur, 71 rue de Sébastopol, 98800 Nouméa', phone: '+687 78.54.92', email: 'cbc.noumea@gmail.com', federation: 'FFAAA NC' },
  { id: 'zanshin-noumea', name: 'Zanshin Dojo', city: 'Nouméa', region: 'nouvelle_caledonie', address: '23 Rue Gallieni, 98800 Nouméa', phone: '+687 79.97.17', email: 'ZanshinDojo.NouvelleCaledonie@gmail.com', federation: 'FFAAA NC' },
  { id: 'kimori-noumea', name: 'Kimori Dojo', city: 'Nouméa', region: 'nouvelle_caledonie', address: 'Complexe sportif Edouard-Pentecost, 25 rue Blaise-Pascal, Anse-Vata', phone: '+687 87.39.93', federation: 'FFAB NC', description: 'Spécialisé armes (Bokken, Jo, Tanto)' },
  { id: 'auteuil-noumea', name: 'Auteuil Aïkido Club', city: 'Nouméa', region: 'nouvelle_caledonie', phone: '+687 76.14.48', email: 'alblnchrd@gmail.com', federation: 'FFAAA NC' },
  { id: 'dojo-aikido-noumea', name: 'Dojo d\'Aïkido Nouméa', city: 'Nouméa', region: 'nouvelle_caledonie', address: 'BP 18183, 98857 Nouméa', phone: '+687 78.79.55', email: 'dojoaikidonoumea@hotmail.fr', website: 'dojoaikidonoumea.com', federation: 'FFAAA NC' },
  { id: 'kimori-boulouparis', name: 'Kimori Dojo Boulouparis', city: 'Boulouparis', region: 'nouvelle_caledonie', address: '156 Lotissement Port Ouenghi Plage', federation: 'FFAB NC' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // GUADELOUPE (971)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'aikido-guadeloupe', name: 'Aïkido Club de Guadeloupe', city: 'Pointe-à-Pitre', region: 'guadeloupe', federation: 'FFAAA', description: 'Contact fédération pour détails' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MARTINIQUE (972)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'aikido-martinique', name: 'Aïkido Club de Martinique', city: 'Fort-de-France', region: 'martinique', federation: 'FFAAA', description: 'Contact fédération pour détails' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // GUYANE (973)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'aikido-guyane', name: 'Aïkido Club de Guyane', city: 'Cayenne', region: 'guyane', federation: 'FFAAA', description: 'Contact fédération pour détails' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MAYOTTE (976)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'aikido-mayotte', name: 'Aïkido Club de Mayotte', city: 'Mamoudzou', region: 'mayotte', federation: 'FFAAA', description: 'Contact fédération pour détails' },
];

// Statistiques par région
export const getRegionStats = () => {
  const stats = {};
  CLUBS_AIKIDO_FRANCE.forEach(club => {
    if (!stats[club.region]) {
      stats[club.region] = { count: 0, clubs: [] };
    }
    stats[club.region].count++;
    stats[club.region].clubs.push(club);
  });
  return stats;
};

export default CLUBS_AIKIDO_FRANCE;
