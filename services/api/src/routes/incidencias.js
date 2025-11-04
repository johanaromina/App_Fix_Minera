const express = require('express');
const { executeQuery } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

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
      FROM incidencias i
      LEFT JOIN usuarios u1 ON i.usuario_reporta_id = u1.id
      LEFT JOIN usuarios u2 ON i.usuario_atiende_id = u2.id
      LEFT JOIN sitios s ON i.sitio_id = s.id
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

// Get incidencia by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const incidencias = await executeQuery(`
      SELECT 
        i.*,
        u1.nombre as reporta_nombre,
        u2.nombre as atiende_nombre,
        s.nombre as sitio_nombre
      FROM incidencias i
      LEFT JOIN usuarios u1 ON i.usuario_reporta_id = u1.id
      LEFT JOIN usuarios u2 ON i.usuario_atiende_id = u2.id
      LEFT JOIN sitios s ON i.sitio_id = s.id
      WHERE i.id = ?
    `, [id]);

    if (incidencias.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Incidencia not found'
      });
    }

    res.json({
      success: true,
      data: incidencias[0]
    });

  } catch (error) {
    console.error('Get incidencia error:', error);
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

    const incidenciaId = uuidv4();
    
    await executeQuery(
      'INSERT INTO incidencias (id, titulo, descripcion, prioridad, sitio_id, usuario_reporta_id) VALUES (?, ?, ?, ?, ?, ?)',
      [incidenciaId, titulo, descripcion || '', prioridad || 'media', sitio_id, usuario_reporta_id]
    );

    // Get the created incidencia
    const incidencias = await executeQuery(`
      SELECT 
        i.*,
        u1.nombre as reporta_nombre,
        u2.nombre as atiende_nombre,
        s.nombre as sitio_nombre
      FROM incidencias i
      LEFT JOIN usuarios u1 ON i.usuario_reporta_id = u1.id
      LEFT JOIN usuarios u2 ON i.usuario_atiende_id = u2.id
      LEFT JOIN sitios s ON i.sitio_id = s.id
      WHERE i.id = ?
    `, [incidenciaId]);

    res.status(201).json({
      success: true,
      message: 'Incidencia created successfully',
      data: incidencias[0]
    });

  } catch (error) {
    console.error('Create incidencia error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update incidencia
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, prioridad, estado, sitio_id, usuario_atiende_id } = req.body;

    const updates = [];
    const values = [];

    if (titulo) {
      updates.push('titulo = ?');
      values.push(titulo);
    }
    if (descripcion !== undefined) {
      updates.push('descripcion = ?');
      values.push(descripcion);
    }
    if (prioridad) {
      updates.push('prioridad = ?');
      values.push(prioridad);
    }
    if (estado) {
      updates.push('estado = ?');
      values.push(estado);
    }
    if (sitio_id) {
      updates.push('sitio_id = ?');
      values.push(sitio_id);
    }
    if (usuario_atiende_id !== undefined) {
      updates.push('usuario_atiende_id = ?');
      values.push(usuario_atiende_id);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(id);

    await executeQuery(
      `UPDATE incidencias SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );

    // Get the updated incidencia
    const incidencias = await executeQuery(`
      SELECT 
        i.*,
        u1.nombre as reporta_nombre,
        u2.nombre as atiende_nombre,
        s.nombre as sitio_nombre
      FROM incidencias i
      LEFT JOIN usuarios u1 ON i.usuario_reporta_id = u1.id
      LEFT JOIN usuarios u2 ON i.usuario_atiende_id = u2.id
      LEFT JOIN sitios s ON i.sitio_id = s.id
      WHERE i.id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Incidencia updated successfully',
      data: incidencias[0]
    });

  } catch (error) {
    console.error('Update incidencia error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete incidencia
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await executeQuery('DELETE FROM incidencias WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Incidencia deleted successfully'
    });

  } catch (error) {
    console.error('Delete incidencia error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
