const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && !mongoUri.includes('username:password')) {
      console.log('🌱 Connecting to MongoDB Atlas / Remote MongoDB URI...');
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }

    console.log('⚡ No active MongoDB Atlas URI provided or placeholder detected.');
    console.log('🚀 Initializing high-speed In-Memory MongoDB Server for seamless zero-setup demo...');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`✅ In-Memory MongoDB Connected at: ${uri}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ Primary MongoDB connection failed (${error.message}). Falling back to In-Memory MongoDB...`);
    try {
      if (!mongod) {
        mongod = await MongoMemoryServer.create();
      }
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ In-Memory MongoDB Connected: ${uri}`);
      return conn;
    } catch (innerError) {
      console.error(`❌ Critical Database Connection Error: ${innerError.message}`);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('Error disconnecting DB:', err);
  }
};

module.exports = { connectDB, disconnectDB };
