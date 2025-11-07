import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import morgan from 'morgan';
// Initialize Express app
const app = express();

import recordsRouter from './routes/records.js';

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(morgan('dev')); // Log requests to the console
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/records', recordsRouter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Work Records API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      records: '/api/records',
      stats: '/api/records/stats'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;