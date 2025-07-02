import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function initMongoConnection() {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
    process.env;

  const mongoUri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority&appName=Cluster0`;
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Mongo connection successfully established!');
  } catch (error) {
    console.error('❌ Mongo connection error:', error.message);
    process.exit(1);
  }
}
