const mongoose = require('mongoose');

let mongod = null;
let isConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  // 1. If MongoDB Atlas / Remote URI is provided and is not a placeholder
  if (mongoUri && !mongoUri.includes('username:password') && !mongoUri.includes('<password>') && mongoUri.trim() !== '') {
    try {
      console.log('🌱 Connecting to MongoDB Atlas / Remote URI...');
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 45000,
      });
      isConnected = true;
      console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
      console.warn('👉 Verify your MONGODB_URI credentials, database name, and Network Access (IP Whitelist: 0.0.0.0/0 on Atlas).');
    }
  } else {
    console.log('\n======================================================================');
    console.log('⚡ NOTICE: No active MongoDB Atlas URI provided or placeholder detected.');
    console.log('----------------------------------------------------------------------');
    console.log('👉 To enable persistent cloud storage on your deployed service:');
    console.log('   1. Create a free cluster on MongoDB Atlas (https://cloud.mongodb.com)');
    console.log('   2. Add MONGODB_URI to your service environment variables:');
    console.log('      MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/cropguardian?retryWrites=true&w=majority');
    console.log('   3. Ensure Network Access whitelist allows 0.0.0.0/0');
    console.log('======================================================================\n');
  }

  // 2. In local development or fallback mode, attempt In-Memory MongoDB if available
  if (process.env.NODE_ENV !== 'production') {
    try {
      console.log('🚀 Attempting to initialize In-Memory MongoDB Server for local demo...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      if (!mongod) {
        mongod = await MongoMemoryServer.create();
      }
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      isConnected = true;
      console.log(`✅ In-Memory MongoDB Connected at: ${uri}`);
      return conn;
    } catch (memErr) {
      console.warn(`⚠️ In-Memory MongoDB unavailable: ${memErr.message}`);
    }
  }

  console.log('🌾 Backend running in Standalone / Live Resilient Mode (Port & APIs Open).');
  return null;
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
    isConnected = false;
  } catch (err) {
    console.error('Error disconnecting DB:', err);
  }
};

const isDBConnected = () => {
  return mongoose.connection.readyState === 1 || isConnected;
};

module.exports = { connectDB, disconnectDB, isDBConnected };

