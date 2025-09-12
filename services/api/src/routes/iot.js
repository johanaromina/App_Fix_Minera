const express = require('express');
const { executeQuery } = require('../config/database');

const router = express.Router();

// Get all sensors
router.get('/sensores', async (req, res) => {
  try {
    const sensores = await executeQuery(`
      SELECT 
        s.*,
        sitio.nombre as sitio_nombre
      FROM Sensor s
      LEFT JOIN Sitio sitio ON s.sitio_id = sitio.id
      ORDER BY s.id
    `);

    res.json({
      success: true,
      data: sensores
    });

  } catch (error) {
    console.error('Get sensores error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get sensor readings
router.get('/lecturas', async (req, res) => {
  try {
    const lecturas = await executeQuery(`
      SELECT 
        l.*,
        s.tipo as sensor_tipo,
        s.descripcion as sensor_descripcion,
        sitio.nombre as sitio_nombre
      FROM LecturaSensor l
      LEFT JOIN Sensor s ON l.sensor_id = s.id
      LEFT JOIN Sitio sitio ON s.sitio_id = sitio.id
      ORDER BY l.timestamp DESC
      LIMIT 100
    `);

    res.json({
      success: true,
      data: lecturas
    });

  } catch (error) {
    console.error('Get lecturas error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get IoT alerts
router.get('/alertas', async (req, res) => {
  try {
    const alertas = await executeQuery(`
      SELECT 
        a.*,
        s.tipo as sensor_tipo,
        sitio.nombre as sitio_nombre
      FROM AlertaIoT a
      LEFT JOIN Sensor s ON a.sensor_id = s.id
      LEFT JOIN Sitio sitio ON s.sitio_id = sitio.id
      ORDER BY a.timestamp DESC
      LIMIT 50
    `);

    res.json({
      success: true,
      data: alertas
    });

  } catch (error) {
    console.error('Get alertas error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
