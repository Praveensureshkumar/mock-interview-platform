const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const interviewRoutes = require('./routes/interview');
// const adminRoutes = require('./routes/admin');

const app = express();

// Middleware - Configure CORS to allow your Vercel frontend
const corsOptions = {
  origin: [
    'http://localhost:3000', // Local development
    'https://aipowered-interview.vercel.app', // Your Vercel deployment
    'https://mock-interview-platform-w6ic.onrender.com' // Your Render deployment
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
  console.log('🏠 Root endpoint accessed from:', req.ip);
  res.status(200).json({
    message: 'AI Mock Interview Platform API',
    status: 'OK',
    healthy: true,
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint for Render (backup)
app.get('/health', (req, res) => {
  console.log('🏥 Health check requested from:', req.ip, req.get('User-Agent'));
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000
  });
});

// Simple text health check (alternative)
app.get('/healthz', (req, res) => {
  console.log('💊 Simple health check from:', req.ip);
  res.status(200).send('OK');
});

app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
// app.use('/api/admin', adminRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server listening on http://localhost:${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please stop the existing server or use a different port.`);
    console.error(`💡 You can set PORT environment variable to use a different port: PORT=5002 npm run dev`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});
