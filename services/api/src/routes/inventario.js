const express = require('express');
const { executeQuery } = require('../config/database');

const router = express.Router();

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const items = await executeQuery(`
      SELECT 
        i.*,
        s.nombre as sitio_nombre
      FROM InventarioItem i
      LEFT JOIN Sitio s ON i.sitio_id = s.id
      ORDER BY i.id
    `);

    res.json({
      success: true,
      data: items
    });

  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new inventory item
router.post('/', async (req, res) => {
  try {
    const { tipo, marca, modelo, nro_serie, codigo_qr, sitio_id } = req.body;

    if (!tipo || !sitio_id) {
      return res.status(400).json({
        success: false,
        message: 'Type and site are required'
      });
    }

    const result = await executeQuery(
      'INSERT INTO InventarioItem (id, tipo, marca, modelo, nro_serie, codigo_qr, sitio_id) VALUES (UUID(), ?, ?, ?, ?, ?, ?)',
      [tipo, marca || '', modelo || '', nro_serie || '', codigo_qr || '', sitio_id]
    );

    res.status(201).json({
      success: true,
      message: 'Inventory item created successfully',
      data: {
        id: result.insertId
      }
    });

  } catch (error) {
    console.error('Create inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
