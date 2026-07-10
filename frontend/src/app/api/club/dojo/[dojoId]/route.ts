import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8001';

export async function PUT(
  request: NextRequest,
  { params }: { params: { dojoId: string } }
) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('Authorization');
    
    const response = await fetch(`${BACKEND_URL}/api/club/dojo/${params.dojoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating dojo:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
