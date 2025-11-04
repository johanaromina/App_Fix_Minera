const express = require('express');
const { executeQuery } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get all sensors
router.get('/', async (req, res) => {
  try {
    const sensores = await executeQuery(`
      SELECT 
        s.*,
        sit.nombre as sitio_nombre
      FROM sensores s
      LEFT JOIN sitios sit ON s.sitio_id = sit.id
      ORDER BY s.created_at DESC
    `);

    res.json({
      success: true,
      data: sensores
    });

  } catch (error) {
    console.error('Get sensors error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single sensor by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const sensores = await executeQuery(`
      SELECT 
        s.*,
        sit.nombre as sitio_nombre
      FROM sensores s
      LEFT JOIN sitios sit ON s.sitio_id = sit.id
      WHERE s.id = ?
    `, [id]);

    if (sensores.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sensor no encontrado'
      });
    }

    res.json({
      success: true,
      data: sensores[0]
    });

  } catch (error) {
    console.error('Get sensor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get latest readings for a sensor
router.get('/:id/lecturas', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 100;

    const lecturas = await executeQuery(`
      SELECT *
      FROM lecturas_sensores
      WHERE sensor_id = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `, [id, limit]);

    res.json({
      success: true,
      data: lecturas
    });

  } catch (error) {
    console.error('Get sensor readings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new sensor
router.post('/', async (req, res) => {
  try {
    const { sitio_id, tipo, descripcion, activo } = req.body;

    if (!sitio_id || !tipo) {
      return res.status(400).json({
        success: false,
        message: 'Sitio y tipo son requeridos'
      });
    }

    const id = uuidv4();

    await executeQuery(
      'INSERT INTO sensores (id, sitio_id, tipo, descripcion, activo, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [id, sitio_id, tipo, descripcion || null, activo !== undefined ? activo : true]
    );

    // Obtener el sensor recién creado
    const sensores = await executeQuery(`
      SELECT 
        s.*,
        sit.nombre as sitio_nombre
      FROM sensores s
      LEFT JOIN sitios sit ON s.sitio_id = sit.id
      WHERE s.id = ?
    `, [id]);

    res.status(201).json({
      success: true,
      message: 'Sensor creado exitosamente',
      data: sensores[0]
    });

  } catch (error) {
    console.error('Create sensor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update sensor
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sitio_id, tipo, descripcion, activo } = req.body;

    // Verificar que el sensor existe
    const existing = await executeQuery(
      'SELECT id FROM sensores WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sensor no encontrado'
      });
    }

    // Construir query dinámico
    const updateFields = [];
    const values = [];

    if (sitio_id !== undefined) {
      updateFields.push('sitio_id = ?');
      values.push(sitio_id);
    }
    if (tipo !== undefined) {
      updateFields.push('tipo = ?');
      values.push(tipo);
    }
    if (descripcion !== undefined) {
      updateFields.push('descripcion = ?');
      values.push(descripcion);
    }
    if (activo !== undefined) {
      updateFields.push('activo = ?');
      values.push(activo);
    }

    updateFields.push('updated_at = NOW()');
    values.push(id);

    await executeQuery(
      `UPDATE sensores SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    // Obtener el sensor actualizado
    const sensores = await executeQuery(`
      SELECT 
        s.*,
        sit.nombre as sitio_nombre
      FROM sensores s
      LEFT JOIN sitios sit ON s.sitio_id = sit.id
      WHERE s.id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Sensor actualizado exitosamente',
      data: sensores[0]
    });

  } catch (error) {
    console.error('Update sensor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete sensor
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery(
      'DELETE FROM sensores WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sensor no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Sensor eliminado exitosamente'
    });

  } catch (error) {
    console.error('Delete sensor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;

