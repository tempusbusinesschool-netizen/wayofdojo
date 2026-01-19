/**
 * 🏥 HEALTH CHECK API
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET() {
  const mongoUri = process.env.MONGODB_URI || '';
  
  const result = {
    status: 'checking',
    mongodb_uri_exists: !!mongoUri,
    mongodb_uri_prefix: mongoUri ? mongoUri.substring(0, 30) + '...' : 'NOT SET',
    mongodb_connected: false,
    error: null as string | null,
  };

  try {
    await dbConnect();
    result.status = 'healthy';
    result.mongodb_connected = true;
  } catch (error) {
    result.status = 'unhealthy';
    result.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json(result);
}
