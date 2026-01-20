/**
 * 📅 STAGES API - GET ALL & CREATE
 */

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Stage } from '@/lib/models/stage.model';
import { requireAuth } from '@/lib/auth-middleware';

// GET - Liste des stages (public)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sport = searchParams.get('sport') || 'aikido';
    const level = searchParams.get('level');
    const search = searchParams.get('search') || '';
    const featured = searchParams.get('featured');
    const upcoming = searchParams.get('upcoming');

    // Build query
    const query: Record<string, unknown> = {
      sport,
      status: 'published',
    };

    // Filter by level
    if (level && level !== 'tous') {
      query.$or = [{ level }, { level: 'tous' }];
    }

    // Filter by search
    if (search) {
      query.$text = { $search: search };
    }

    // Filter featured only
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Filter upcoming only (date >= today)
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    const total = await Stage.countDocuments(query);
    const stages = await Stage.find(query)
      .sort({ isFeatured: -1, date: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      success: true,
      stages: stages.map(stage => ({
        id: stage._id.toString(),
        title: stage.title,
        description: stage.description,
        date: stage.date.toISOString(),
        endDate: stage.endDate?.toISOString(),
        location: stage.location,
        city: stage.city,
        country: stage.country,
        sensei: stage.sensei,
        senseiTitle: stage.senseiTitle,
        level: stage.level,
        maxParticipants: stage.maxParticipants,
        currentParticipants: stage.currentParticipants,
        price: stage.price,
        currency: stage.currency,
        tags: stage.tags,
        isFeatured: stage.isFeatured,
        status: stage.status,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get stages error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un stage (admin only)
export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request, ['admin', 'super_admin']);
  
  if ('error' in authResult) {
    return authResult.error;
  }

  try {
    await dbConnect();

    const body = await request.json();
    const {
      title,
      description,
      date,
      endDate,
      location,
      city,
      country,
      sensei,
      senseiTitle,
      level,
      maxParticipants,
      price,
      currency,
      tags,
      isFeatured,
      status,
      sport,
    } = body;

    // Validation
    if (!title || !description || !date || !location || !city || !sensei) {
      return NextResponse.json(
        { error: 'Champs requis manquants: title, description, date, location, city, sensei' },
        { status: 400 }
      );
    }

    const stage = await Stage.create({
      title,
      description,
      date: new Date(date),
      endDate: endDate ? new Date(endDate) : undefined,
      location,
      city,
      country: country || 'France',
      sensei,
      senseiTitle,
      level: level || 'tous',
      maxParticipants: maxParticipants || 50,
      price: price || 0,
      currency: currency || 'EUR',
      tags: tags || [],
      isFeatured: isFeatured || false,
      status: status || 'draft',
      sport: sport || 'aikido',
      createdBy: authResult.user.id,
    });

    return NextResponse.json({
      success: true,
      stage: {
        id: stage._id.toString(),
        title: stage.title,
        date: stage.date.toISOString(),
        status: stage.status,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Create stage error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du stage' },
      { status: 500 }
    );
  }
}
