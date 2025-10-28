import { MongoClient, Db, Collection } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase() {
  if (client && db) {
    return { client, db };
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedit-ai';
  
  try {
    client = new MongoClient(uri);
    await client.connect();
    
    db = client.db('vedit-ai');
    
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('⚠️ MongoDB not available - running without persistent storage');
    return { client: null, db: null };
  }
}

export async function getUserData(email: string) {
  const { db } = await connectToDatabase();
  if (!db) return null;
  
  const collection = db.collection('user-data');
  
  const userData = await collection.findOne({ email });
  return userData || null;
}

export async function saveUserData(email: string, data: any) {
  const { db } = await connectToDatabase();
  if (!db) return;
  
  const collection = db.collection('user-data');
  
  await collection.findOneAndUpdate(
    { email },
    { 
      $set: { 
        email,
        data,
        updatedAt: new Date()
      }
    },
    { upsert: true }
  );
}

export async function getUserVideos(email: string) {
  const userData = await getUserData(email);
  return userData?.data?.videoTracks || [];
}

export async function saveUserVideos(email: string, videoTracks: any[]) {
  await saveUserData(email, { videoTracks });
}

export async function getUserSettings(email: string) {
  const userData = await getUserData(email);
  return userData?.data?.settings || {};
}

export async function saveUserSettings(email: string, settings: any) {
  const userData = await getUserData(email);
  const currentData = userData?.data || {};
  
  await saveUserData(email, {
    ...currentData,
    settings
  });
}
