const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
require('dotenv').config();

const { connectDB } = require('./config/db');
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'AI Crop Guardian Backend API',
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

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedDatabase();

  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🌾 AI Crop Guardian Backend Running on Port ${PORT}`);
    console.log(`📡 REST API Endpoint: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Role Accounts Ready (Farmer, Specialist, Admin)`);
    console.log(`======================================================\n`);
  });
};

startServer();
