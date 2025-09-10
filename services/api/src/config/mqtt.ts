import mqtt from 'mqtt';
import { config } from './index';
import { logger } from './logger';

let mqttClient: mqtt.MqttClient | null = null;

export const connectMQTT = async (): Promise<void> => {
  try {
    const options: mqtt.IClientOptions = {
      host: config.mqtt.url,
      port: 1883,
      protocol: 'mqtt',
      keepalive: 60,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      clean: true,
    };

    // Add authentication if provided
    if (config.mqtt.username && config.mqtt.password) {
      options.username = config.mqtt.username;
      options.password = config.mqtt.password;
    }

    mqttClient = mqtt.connect(config.mqtt.url, options);

    mqttClient.on('connect', () => {
      logger.info('MQTT broker connected successfully');
      
      // Subscribe to common topics
      mqttClient?.subscribe('sensores/+/lecturas', (err) => {
        if (err) {
          logger.error('Failed to subscribe to sensor readings:', err);
        } else {
          logger.info('Subscribed to sensor readings topic');
        }
      });

      mqttClient?.subscribe('alertas/+', (err) => {
        if (err) {
          logger.error('Failed to subscribe to alerts topic:', err);
        } else {
          logger.info('Subscribed to alerts topic');
        }
      });
    });

    mqttClient.on('error', (error) => {
      logger.error('MQTT connection error:', error);
    });

    mqttClient.on('close', () => {
      logger.warn('MQTT connection closed');
    });

    mqttClient.on('reconnect', () => {
      logger.info('MQTT reconnecting...');
    });

    mqttClient.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        logger.debug(`MQTT message received on ${topic}:`, data);
        
        // Handle different message types
        if (topic.startsWith('sensores/') && topic.endsWith('/lecturas')) {
          handleSensorReading(topic, data);
        } else if (topic.startsWith('alertas/')) {
          handleAlert(topic, data);
        }
      } catch (error) {
        logger.error('Failed to parse MQTT message:', error);
      }
    });

  } catch (error) {
    logger.error('Failed to connect to MQTT broker:', error);
    throw error;
  }
};

const handleSensorReading = async (topic: string, data: any) => {
  try {
    // Extract sensor ID from topic (e.g., "sensores/sensor-123/lecturas")
    const sensorId = topic.split('/')[1];
    
    // TODO: Save sensor reading to database
    logger.info(`Processing sensor reading for ${sensorId}:`, data);
    
    // Here you would typically:
    // 1. Validate the data
    // 2. Save to database using Prisma
    // 3. Check for alert conditions
    // 4. Send notifications if needed
    
  } catch (error) {
    logger.error('Error handling sensor reading:', error);
  }
};

const handleAlert = async (topic: string, data: any) => {
  try {
    // Extract alert ID from topic
    const alertId = topic.split('/')[1];
    
    // TODO: Process alert
    logger.warn(`Processing alert ${alertId}:`, data);
    
    // Here you would typically:
    // 1. Save alert to database
    // 2. Create incident if needed
    // 3. Send notifications
    // 4. Update dashboard
    
  } catch (error) {
    logger.error('Error handling alert:', error);
  }
};

export const getMQTTClient = (): mqtt.MqttClient | null => {
  return mqttClient;
};

export const publishMQTT = (topic: string, message: any): void => {
  if (mqttClient && mqttClient.connected) {
    mqttClient.publish(topic, JSON.stringify(message), (error) => {
      if (error) {
        logger.error('Failed to publish MQTT message:', error);
      } else {
        logger.debug(`MQTT message published to ${topic}`);
      }
    });
  } else {
    logger.warn('MQTT client not connected, cannot publish message');
  }
};

export const disconnectMQTT = async (): Promise<void> => {
  if (mqttClient) {
    mqttClient.end();
    logger.info('MQTT connection closed');
  }
};
