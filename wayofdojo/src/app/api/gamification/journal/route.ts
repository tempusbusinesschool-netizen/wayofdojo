import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'wayofdojo-secret-key-2024';

interface JWTPayload {
  userId: string;
  email: string;
}

interface JournalEntry {
  id: string;
  cityId: string;
  missionId?: string;
  content: string;
  createdAt: string;
  mood?: 'positive' | 'neutral' | 'challenging';
  tags?: string[];
}

// GET - Fetch journal entries
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('wayofdojo_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    const { db } = await connectToDatabase();
    
    const user = await db.collection('users').findOne(
      { email: decoded.email },
      { projection: { _id: 0, 'progress.adultJourney.journalEntries': 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      entries: user.progress?.adultJourney?.journalEntries || []
    });
  } catch (error) {
    console.error('Error fetching journal:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Add journal entry
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('wayofdojo_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    const { cityId, missionId, content, mood, tags } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Contenu requis' }, { status: 400 });
    }

    const entry: JournalEntry = {
      id: `journal-${Date.now()}`,
      cityId: cityId || 'general',
      missionId,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      mood,
      tags
    };

    const { db } = await connectToDatabase();
    
    await db.collection('users').updateOne(
      { email: decoded.email },
      {
        $push: { 
          'progress.adultJourney.journalEntries': entry 
        }
      }
    );

    // Award XP for journaling (5 XP per entry)
    await db.collection('users').updateOne(
      { email: decoded.email },
      {
        $inc: { 'gamification.xp': 5 }
      }
    );

    return NextResponse.json({
      success: true,
      entry,
      xpAwarded: 5
    });
  } catch (error) {
    console.error('Error adding journal entry:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Remove journal entry
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('wayofdojo_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get('id');

    if (!entryId) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    await db.collection('users').updateOne(
      { email: decoded.email },
      {
        $pull: { 
          'progress.adultJourney.journalEntries': { id: entryId } 
        }
      }
    );

    return NextResponse.json({
      success: true,
      deletedId: entryId
    });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
