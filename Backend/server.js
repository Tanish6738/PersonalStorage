// Load environment variables
import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';
import connectDB from './src/config/database.js';
import http from 'http';
// Connect to database
connectDB();

const server = http.createServer(app);


// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log('\n🚀 Server started successfully!');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`📝 Records API: http://localhost:${PORT}/api/records\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});
