import mongoose from 'mongoose';

interface GlobalWithMongoose {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = (global as GlobalWithMongoose).mongoose;

if (!cached) {
  cached = (global as GlobalWithMongoose).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached = (global as GlobalWithMongoose).mongoose = {
      conn: null,
      promise: mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        return mongoose;
      })
    };
  }

  try {
    await cached.promise;
    cached.conn = await cached.promise;
    console.log('MongoDB Connected Successfully!');
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}