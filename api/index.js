const { app } = require('../backend/server');
const { connectDB } = require('../backend/config/db');
const { seedDatabase } = require('../backend/utils/seedData');

let isInitialized = false;

module.exports = async (req, res) => {
  if (!isInitialized) {
    await connectDB();
    await seedDatabase();
    isInitialized = true;
  }
  return app(req, res);
};
