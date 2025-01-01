import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

declare global {
  var mongoose: { conn: any; promise: any };
}

let cached = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
    maxPoolSize: 10
  });

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
