const express = require('express');
const { executeQuery } = require('../config/database');

const router = express.Router();

// Get all maintenance tasks
router.get('/', async (req, res) => {
  try {
    const mantenimientos = await executeQuery(`
      SELECT 
        m.*,
        p.nombre as plan_nombre,
        s.nombre as sitio_nombre,
        i.tipo as item_tipo
      FROM Mantenimiento m
      LEFT JOIN PlanMantenimiento p ON m.plan_id = p.id
      LEFT JOIN Sitio s ON m.sitio_id = s.id
      LEFT JOIN InventarioItem i ON m.item_id = i.id
      ORDER BY m.fecha_plan DESC
    `);

    res.json({
      success: true,
      data: mantenimientos
    });

  } catch (error) {
    console.error('Get mantenimientos error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
