const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('dotenv').config();

const { connectDB, isDBConnected } = require('./config/db');
const { seedDatabase } = require('./utils/seedData');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const farmRoutes = require('./routes/farmRoutes');
const cropCycleRoutes = require('./routes/cropCycleRoutes');
const aiRiskRoutes = require('./routes/aiRiskRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes');
const historicalRoutes = require('./routes/historicalRoutes');
const financialRoutes = require('./routes/financialRoutes');
const simulatorRoutes = require('./routes/simulatorRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const passportRoutes = require('./routes/passportRoutes');
const adminRoutes = require('./routes/adminRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Store socket io in app for controllers if needed
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads folder
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (err) {
    console.warn('Uploads directory creation notice:', err.message);
  }
}
app.use('/uploads', express.static(uploadsDir));

// Locate Frontend Static Build directory (built at build-time)
const possibleDistPaths = [
  path.join(__dirname, '../frontend/dist'),
  path.join(__dirname, 'frontend/dist'),
  path.join(__dirname, 'dist'),
  path.join(__dirname, 'public'),
  path.join(process.cwd(), 'frontend/dist'),
  path.join(process.cwd(), 'dist'),
];

let frontendDist = possibleDistPaths.find((p) => fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html'))) || null;

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1 || isDBConnected();
  res.json({
    status: 'online',
    service: 'AI Crop Guardian Platform API',
    database: dbConnected ? 'connected' : 'connecting_or_standalone',
    mongoUriConfigured: Boolean(process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('username:password') && !process.env.MONGODB_URI.includes('<password>')),
    frontendMounted: Boolean(frontendDist),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/crop-cycles', cropCycleRoutes);
app.use('/api/ai-risk', aiRiskRoutes);
app.use('/api/disease-detection', diseaseRoutes);
app.use('/api/historical', historicalRoutes);
app.use('/api/financials', financialRoutes);
app.use('/api/simulator', simulatorRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/passport', passportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/weather', weatherRoutes);

// Socket.io real-time connection handler
io.on('connection', (socket) => {
  console.log(`⚡ WebSocket client connected: ${socket.id}`);

  socket.on('join_farmer_room', (farmerId) => {
    socket.join(`farmer_${farmerId}`);
    console.log(`🌾 Farmer ${farmerId} joined real-time alert room`);
  });

  socket.on('join_consultation', (consultationId) => {
    socket.join(`consultation_${consultationId}`);
    console.log(`💬 Joined consultation room: ${consultationId}`);
  });

  socket.on('send_consultation_msg', (data) => {
    io.to(`consultation_${data.consultationId}`).emit('receive_consultation_msg', data);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 WebSocket client disconnected: ${socket.id}`);
  });
});

// Serve frontend static build if available (Image-build time Vite bundle)
if (frontendDist) {
  console.log(`📦 Serving compiled frontend from: ${frontendDist}`);
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  console.log('ℹ️ Frontend dist not detected at startup. Backend running in standalone API mode.');
}

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Bind and open port immediately so cloud container health checks pass instantly
  if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🌾 AI Crop Guardian Service Running on Port ${PORT}`);
      console.log(`📡 Health Check Endpoint: http://localhost:${PORT}/api/health`);
      console.log(`🌐 Frontend Static Serving: ${frontendDist ? 'ENABLED (Production Build)' : 'API Mode Only'}`);
      console.log(`======================================================\n`);
    });
  }

  // Asynchronously initialize database and seeds without delaying port opening
  try {
    await connectDB();
    await seedDatabase();
  } catch (dbErr) {
    console.warn(`⚠️ Database initialization notice: ${dbErr.message}`);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, server, startServer };

