/**
 * 📅 STAGES API - GET, UPDATE, DELETE BY ID
 */

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Stage } from '@/lib/models/stage.model';
import { requireAuth } from '@/lib/auth-middleware';

interface RouteParams {
  params: { id: string };
}

// GET - Détail d'un stage (public)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();

    const stage = await Stage.findById(params.id);

    if (!stage) {
      return NextResponse.json(
        { error: 'Stage non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      stage: {
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
        sport: stage.sport,
      },
    });
  } catch (error) {
    console.error('Get stage error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour un stage (admin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authResult = await requireAuth(request, ['admin', 'super_admin']);
  
  if ('error' in authResult) {
    return authResult.error;
  }

  try {
    await dbConnect();

    const body = await request.json();
    
    // Remove fields that shouldn't be updated directly
    delete body.id;
    delete body._id;
    delete body.createdBy;
    delete body.createdAt;

    // Convert date strings to Date objects
    if (body.date) body.date = new Date(body.date);
    if (body.endDate) body.endDate = new Date(body.endDate);

    const stage = await Stage.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    );

    if (!stage) {
      return NextResponse.json(
        { error: 'Stage non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      stage: {
        id: stage._id.toString(),
        title: stage.title,
        status: stage.status,
      },
    });
  } catch (error) {
    console.error('Update stage error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un stage (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authResult = await requireAuth(request, ['admin', 'super_admin']);
  
  if ('error' in authResult) {
    return authResult.error;
  }

  try {
    await dbConnect();

    const stage = await Stage.findByIdAndDelete(params.id);

    if (!stage) {
      return NextResponse.json(
        { error: 'Stage non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Stage supprimé',
    });
  } catch (error) {
    console.error('Delete stage error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
