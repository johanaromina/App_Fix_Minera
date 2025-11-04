const express = require('express');
const { executeQuery } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get all planes
router.get('/planes', async (req, res) => {
  try {
    const planes = await executeQuery(`
      SELECT * FROM planes_mantenimiento WHERE activo = 1 ORDER BY nombre
    `);

    res.json({
      success: true,
      data: planes
    });

  } catch (error) {
    console.error('Get planes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all sitios
router.get('/sitios', async (req, res) => {
  try {
    const sitios = await executeQuery(`
      SELECT * FROM sitios WHERE activo = 1 ORDER BY nombre
    `);

    res.json({
      success: true,
      data: sitios
    });

  } catch (error) {
    console.error('Get sitios error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all maintenance tasks
router.get('/', async (req, res) => {
  try {
    const mantenimientos = await executeQuery(`
      SELECT 
        m.*,
        p.nombre as plan_nombre,
        s.nombre as sitio_nombre,
        i.tipo as item_tipo,
        i.marca as item_marca,
        i.modelo as item_modelo
      FROM mantenimientos m
      LEFT JOIN planes_mantenimiento p ON m.plan_id = p.id
      LEFT JOIN sitios s ON m.sitio_id = s.id
      LEFT JOIN inventario_items i ON m.item_id = i.id
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

// Get mantenimiento by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const mantenimientos = await executeQuery(`
      SELECT 
        m.*,
        p.nombre as plan_nombre,
        s.nombre as sitio_nombre,
        i.tipo as item_tipo,
        i.marca as item_marca,
        i.modelo as item_modelo
      FROM mantenimientos m
      LEFT JOIN planes_mantenimiento p ON m.plan_id = p.id
      LEFT JOIN sitios s ON m.sitio_id = s.id
      LEFT JOIN inventario_items i ON m.item_id = i.id
      WHERE m.id = ?
    `, [id]);

    if (mantenimientos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mantenimiento not found'
      });
    }

    res.json({
      success: true,
      data: mantenimientos[0]
    });

  } catch (error) {
    console.error('Get mantenimiento error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new mantenimiento
router.post('/', async (req, res) => {
  try {
    const { plan_id, sitio_id, item_id, fecha_plan, observacion } = req.body;

    console.log('Mantenimiento POST body:', req.body);

    // Validar campos requeridos
    if (!plan_id || plan_id.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Plan es requerido'
      });
    }

    if (!fecha_plan || (typeof fecha_plan === 'string' && fecha_plan.trim() === '')) {
      return res.status(400).json({
        success: false,
        message: 'Fecha planificada es requerida'
      });
    }

    // Convertir sitio_id a número (puede venir como string o número)
    let sitioIdNum;
    if (typeof sitio_id === 'number') {
      sitioIdNum = sitio_id;
    } else if (typeof sitio_id === 'string') {
      sitioIdNum = parseInt(sitio_id, 10);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Sitio es requerido'
      });
    }

    if (isNaN(sitioIdNum) || sitioIdNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Sitio ID debe ser un número válido mayor a 0'
      });
    }

    // Validar que el plan existe
    const planes = await executeQuery(
      'SELECT id FROM planes_mantenimiento WHERE id = ?',
      [plan_id]
    );
    
    if (planes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Plan de mantenimiento no encontrado'
      });
    }

    // Validar que el sitio existe
    const sitios = await executeQuery(
      'SELECT id FROM sitios WHERE id = ?',
      [sitioIdNum]
    );
    
    if (sitios.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Sitio no encontrado'
      });
    }

    // Validar item_id si se proporciona
    let validItemId = null;
    if (item_id && item_id.trim() !== '') {
      // Verificar que el item existe
      const items = await executeQuery(
        'SELECT id FROM inventario_items WHERE id = ?',
        [item_id]
      );
      
      if (items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Item de inventario no encontrado'
        });
      }
      
      validItemId = item_id;
    }

    const mantenimientoId = uuidv4();
    
    await executeQuery(
      'INSERT INTO mantenimientos (id, plan_id, sitio_id, item_id, fecha_plan, observacion, resultado, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [mantenimientoId, plan_id, sitioIdNum, validItemId, fecha_plan, observacion || null, 'pendiente']
    );

    // Get the created mantenimiento
    const mantenimientos = await executeQuery(`
      SELECT 
        m.*,
        p.nombre as plan_nombre,
        s.nombre as sitio_nombre,
        i.tipo as item_tipo,
        i.marca as item_marca,
        i.modelo as item_modelo
      FROM mantenimientos m
      LEFT JOIN planes_mantenimiento p ON m.plan_id = p.id
      LEFT JOIN sitios s ON m.sitio_id = s.id
      LEFT JOIN inventario_items i ON m.item_id = i.id
      WHERE m.id = ?
    `, [mantenimientoId]);

    res.status(201).json({
      success: true,
      message: 'Mantenimiento created successfully',
      data: mantenimientos[0]
    });

  } catch (error) {
    console.error('Create mantenimiento error:', error);
    
    // Si es un error de clave foránea, dar mensaje más específico
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        success: false,
        message: 'Error de referencia: Uno de los valores proporcionados no existe en la base de datos'
      });
    }
    
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update mantenimiento
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { plan_id, sitio_id, item_id, fecha_plan, fecha_ejecucion, resultado, observacion } = req.body;

    const updates = [];
    const values = [];

    if (plan_id) {
      updates.push('plan_id = ?');
      values.push(plan_id);
    }
    if (sitio_id) {
      updates.push('sitio_id = ?');
      values.push(sitio_id);
    }
    if (item_id !== undefined) {
      // Validar item_id si se proporciona
      let validItemId = null;
      if (item_id && item_id.trim() !== '') {
        // Verificar que el item existe
        const items = await executeQuery(
          'SELECT id FROM inventario_items WHERE id = ?',
          [item_id]
        );
        
        if (items.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Item de inventario no encontrado'
          });
        }
        
        validItemId = item_id;
      }
      
      updates.push('item_id = ?');
      values.push(validItemId);
    }
    if (fecha_plan) {
      updates.push('fecha_plan = ?');
      values.push(fecha_plan);
    }
    if (fecha_ejecucion !== undefined) {
      updates.push('fecha_ejecucion = ?');
      values.push(fecha_ejecucion);
    }
    if (resultado) {
      updates.push('resultado = ?');
      values.push(resultado);
    }
    if (observacion !== undefined) {
      updates.push('observacion = ?');
      values.push(observacion);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(id);

    await executeQuery(
      `UPDATE mantenimientos SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );

    // Get the updated mantenimiento
    const mantenimientos = await executeQuery(`
      SELECT 
        m.*,
        p.nombre as plan_nombre,
        s.nombre as sitio_nombre,
        i.tipo as item_tipo,
        i.marca as item_marca,
        i.modelo as item_modelo
      FROM mantenimientos m
      LEFT JOIN planes_mantenimiento p ON m.plan_id = p.id
      LEFT JOIN sitios s ON m.sitio_id = s.id
      LEFT JOIN inventario_items i ON m.item_id = i.id
      WHERE m.id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Mantenimiento updated successfully',
      data: mantenimientos[0]
    });

  } catch (error) {
    console.error('Update mantenimiento error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete mantenimiento
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await executeQuery('DELETE FROM mantenimientos WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Mantenimiento deleted successfully'
    });

  } catch (error) {
    console.error('Delete mantenimiento error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
