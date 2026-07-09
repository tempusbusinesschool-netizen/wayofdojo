/**
 * 📚 DATABASE CONNECTION
 * Connexion MongoDB avec Mongoose
 */

import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

function getMongoUri(): string {
  // Read at runtime, not at module load
  const uri = process.env.MONGODB_URI || process.env.MONGO_URL || '';
  console.log('MongoDB URI check:', uri ? uri.substring(0, 30) + '...' : 'NOT SET');
  return uri;
}

async function dbConnect(): Promise<typeof mongoose> {
  const MONGODB_URI = getMongoUri();
  
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }
  
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
