const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const { config } = require('./config');
const { testConnection } = require('./config/database');
const authRoutes = require('./routes/auth');
const incidenciasRoutes = require('./routes/incidencias');
const inventarioRoutes = require('./routes/inventario');
const mantenimientoRoutes = require('./routes/mantenimiento');
const sensoresRoutes = require('./routes/sensores');
const iotRoutes = require('./routes/iot');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Compression
app.use(compression());

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Load Swagger documentation
try {
  const swaggerDoc = YAML.load('./swagger.yaml');
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'TFG Mineria API Documentation'
  }));
} catch (error) {
  console.log('Swagger documentation not loaded:', error.message);
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/incidencias', incidenciasRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/mantenimiento', mantenimientoRoutes);
app.use('/api/sensores', sensoresRoutes);
app.use('/api/iot', iotRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.log('⚠️  Database connection failed, but continuing...');
    }

    // Start server
    const server = app.listen(config.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.port}`);
      console.log(`📊 Health check: http://localhost:${config.port}/health`);
      console.log(`📚 API docs: http://localhost:${config.port}/api/docs`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      console.log(`Received ${signal}. Starting graceful shutdown...`);
      
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });

      // Force close after 30 seconds
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
