require('dotenv').config();

const config = {
  port: process.env.API_PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.API_CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:8081']
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'cambia-esto-en-produccion-por-algo-muy-seguro',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },
  mqtt: {
    url: process.env.MQTT_URL || 'mqtt://localhost:1883',
    username: process.env.MQTT_USER || '',
    password: process.env.MQTT_PASS || ''
  }
};

module.exports = { config };
