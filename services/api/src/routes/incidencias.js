const express = require('express');
const { executeQuery } = require('../config/database');

const router = express.Router();

// Get all incidencias
router.get('/', async (req, res) => {
  try {
    const incidencias = await executeQuery(`
      SELECT 
        i.*,
        u1.nombre as reporta_nombre,
        u2.nombre as atiende_nombre,
        s.nombre as sitio_nombre
      FROM Incidencia i
      LEFT JOIN Usuario u1 ON i.usuario_reporta_id = u1.id
      LEFT JOIN Usuario u2 ON i.usuario_atiende_id = u2.id
      LEFT JOIN Sitio s ON i.sitio_id = s.id
      ORDER BY i.fecha_creacion DESC
    `);

    res.json({
      success: true,
      data: incidencias
    });

  } catch (error) {
    console.error('Get incidencias error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new incidencia
router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, prioridad, sitio_id, usuario_reporta_id } = req.body;

    if (!titulo || !sitio_id || !usuario_reporta_id) {
      return res.status(400).json({
        success: false,
        message: 'Title, site and reporter are required'
      });
    }

    const result = await executeQuery(
      'INSERT INTO Incidencia (id, titulo, descripcion, prioridad, sitio_id, usuario_reporta_id) VALUES (UUID(), ?, ?, ?, ?, ?)',
      [titulo, descripcion || '', prioridad || 'media', sitio_id, usuario_reporta_id]
    );

    res.status(201).json({
      success: true,
      message: 'Incidencia created successfully',
      data: {
        id: result.insertId
      }
    });

  } catch (error) {
    console.error('Create incidencia error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
