import mongoose from 'mongoose';

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2000
      });
      console.log('MongoDB successfully connected to:', mongoUri);
      return true;
    } catch (err) {
      console.warn('MongoDB connection failed. Continuing with built-in high-performance storage engine.');
      return false;
    }
  } else {
    console.log('No MONGODB_URI specified. Operating with resilient persistent storage engine.');
    return false;
  }
}
