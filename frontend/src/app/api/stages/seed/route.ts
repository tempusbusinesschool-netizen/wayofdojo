/**
 * 📅 SEED STAGES API
 * Endpoint pour initialiser les stages de démonstration
 */

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Stage } from '@/lib/models/stage.model';
import { requireAuth } from '@/lib/auth-middleware';

const SEED_STAGES = [
  {
    title: 'Stage National Printemps',
    description: 'Grand stage national sous la direction de Maître Yamada. Techniques fondamentales et avancées pour tous niveaux.',
    date: new Date('2025-03-15'),
    endDate: new Date('2025-03-16'),
    location: 'Gymnase Municipal de Paris',
    city: 'Paris',
    country: 'France',
    sensei: 'Maître Yamada',
    senseiTitle: '7e Dan Aikikai',
    level: 'tous',
    maxParticipants: 150,
    currentParticipants: 87,
    price: 45,
    currency: 'EUR',
    tags: ['national', 'fondamentaux', 'armes'],
    isFeatured: true,
    status: 'published',
    sport: 'aikido',
  },
  {
    title: 'Stage Armes - Jo et Bokken',
    description: 'Approfondissement des techniques au Jo et au Bokken. Travail sur les kata et les applications.',
    date: new Date('2025-02-22'),
    location: 'Dojo Central Lyon',
    city: 'Lyon',
    country: 'France',
    sensei: 'Sensei Martin',
    senseiTitle: '5e Dan',
    level: 'intermediaire',
    maxParticipants: 40,
    currentParticipants: 28,
    price: 30,
    currency: 'EUR',
    tags: ['armes', 'jo', 'bokken'],
    isFeatured: false,
    status: 'published',
    sport: 'aikido',
  },
  {
    title: 'Stage Débutants - Premiers Pas',
    description: 'Stage d\'initiation pour les nouveaux pratiquants. Découverte des bases de l\'Aïkido.',
    date: new Date('2025-02-08'),
    location: 'Dojo du Soleil Levant',
    city: 'Marseille',
    country: 'France',
    sensei: 'Sensei Dubois',
    senseiTitle: '4e Dan',
    level: 'debutant',
    maxParticipants: 25,
    currentParticipants: 12,
    price: 20,
    currency: 'EUR',
    tags: ['initiation', 'debutant', 'bases'],
    isFeatured: false,
    status: 'published',
    sport: 'aikido',
  },
  {
    title: 'Stage International d\'Été',
    description: 'Stage international annuel avec des maîtres du monde entier. 5 jours intensifs de pratique.',
    date: new Date('2025-07-14'),
    endDate: new Date('2025-07-19'),
    location: 'Centre Sportif International',
    city: 'Nice',
    country: 'France',
    sensei: 'Maîtres Internationaux',
    senseiTitle: 'Multi-experts',
    level: 'tous',
    maxParticipants: 300,
    currentParticipants: 156,
    price: 180,
    currency: 'EUR',
    tags: ['international', 'été', 'intensif'],
    isFeatured: true,
    status: 'published',
    sport: 'aikido',
  },
  {
    title: 'Stage Technique Avancée',
    description: 'Techniques avancées et préparation aux grades Dan. Réservé aux 1er Kyu minimum.',
    date: new Date('2025-04-05'),
    endDate: new Date('2025-04-06'),
    location: 'Dojo Traditionnel',
    city: 'Bordeaux',
    country: 'France',
    sensei: 'Maître Tanaka',
    senseiTitle: '6e Dan Shihan',
    level: 'avance',
    maxParticipants: 30,
    currentParticipants: 22,
    price: 60,
    currency: 'EUR',
    tags: ['avance', 'dan', 'preparation'],
    isFeatured: false,
    status: 'published',
    sport: 'aikido',
  },
  {
    title: 'Stage Jeunes Samouraïs',
    description: 'Stage ludique pour les enfants de 6 à 14 ans. Jeux, techniques adaptées et certificats.',
    date: new Date('2025-02-15'),
    location: 'Complexe Sportif des Enfants',
    city: 'Toulouse',
    country: 'France',
    sensei: 'Sensei Sophie',
    senseiTitle: '3e Dan',
    level: 'debutant',
    maxParticipants: 50,
    currentParticipants: 35,
    price: 15,
    currency: 'EUR',
    tags: ['enfants', 'ludique', 'jeunes'],
    isFeatured: false,
    status: 'published',
    sport: 'aikido',
  },
];

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request, ['admin', 'super_admin']);
  
  if ('error' in authResult) {
    return authResult.error;
  }

  try {
    await dbConnect();

    // Check if stages already exist
    const existingCount = await Stage.countDocuments();
    
    if (existingCount > 0) {
      return NextResponse.json({
        success: false,
        message: `${existingCount} stages existent déjà. Utilisez force=true pour remplacer.`,
        existingCount,
      });
    }

    // Insert seed stages
    const stages = await Stage.insertMany(
      SEED_STAGES.map(stage => ({
        ...stage,
        createdBy: authResult.user.id,
      }))
    );

    return NextResponse.json({
      success: true,
      message: `${stages.length} stages créés avec succès`,
      count: stages.length,
    });
  } catch (error) {
    console.error('Seed stages error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du seeding des stages' },
      { status: 500 }
    );
  }
}
