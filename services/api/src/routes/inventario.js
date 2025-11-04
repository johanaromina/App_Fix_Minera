const express = require('express');
const { executeQuery } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const items = await executeQuery(`
      SELECT 
        i.*,
        s.nombre as sitio_nombre
      FROM inventario_items i
      LEFT JOIN sitios s ON i.sitio_id = s.id
      ORDER BY i.created_at DESC
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

// Get single inventory item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const items = await executeQuery(`
      SELECT 
        i.*,
        s.nombre as sitio_nombre
      FROM inventario_items i
      LEFT JOIN sitios s ON i.sitio_id = s.id
      WHERE i.id = ?
    `, [id]);

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    res.json({
      success: true,
      data: items[0]
    });

  } catch (error) {
    console.error('Get inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new inventory item
router.post('/', async (req, res) => {
  try {
    const { tipo, marca, modelo, nro_serie, codigo_qr, sitio_id, estado } = req.body;

    if (!tipo || !sitio_id || !codigo_qr) {
      return res.status(400).json({
        success: false,
        message: 'Tipo, sitio y código QR son requeridos'
      });
    }

    // Verificar que el código QR no exista
    const existing = await executeQuery(
      'SELECT id FROM inventario_items WHERE codigo_qr = ?',
      [codigo_qr]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El código QR ya existe'
      });
    }

    const id = uuidv4();

    await executeQuery(
      'INSERT INTO inventario_items (id, tipo, marca, modelo, nro_serie, codigo_qr, sitio_id, estado, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [id, tipo, marca || null, modelo || null, nro_serie || null, codigo_qr, sitio_id, estado || 'operativo']
    );

    // Obtener el item recién creado
    const items = await executeQuery(`
      SELECT 
        i.*,
        s.nombre as sitio_nombre
      FROM inventario_items i
      LEFT JOIN sitios s ON i.sitio_id = s.id
      WHERE i.id = ?
    `, [id]);

    res.status(201).json({
      success: true,
      message: 'Item de inventario creado exitosamente',
      data: items[0]
    });

  } catch (error) {
    console.error('Create inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update inventory item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, marca, modelo, nro_serie, codigo_qr, sitio_id, estado } = req.body;

    // Verificar que el item existe
    const existing = await executeQuery(
      'SELECT id FROM inventario_items WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item de inventario no encontrado'
      });
    }

    // Si se está cambiando el código QR, verificar que no exista
    if (codigo_qr) {
      const duplicateQR = await executeQuery(
        'SELECT id FROM inventario_items WHERE codigo_qr = ? AND id != ?',
        [codigo_qr, id]
      );

      if (duplicateQR.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'El código QR ya existe'
        });
      }
    }

    // Construir query dinámico solo con campos proporcionados
    const updateFields = [];
    const values = [];

    if (tipo !== undefined) {
      updateFields.push('tipo = ?');
      values.push(tipo);
    }
    if (marca !== undefined) {
      updateFields.push('marca = ?');
      values.push(marca);
    }
    if (modelo !== undefined) {
      updateFields.push('modelo = ?');
      values.push(modelo);
    }
    if (nro_serie !== undefined) {
      updateFields.push('nro_serie = ?');
      values.push(nro_serie);
    }
    if (codigo_qr !== undefined) {
      updateFields.push('codigo_qr = ?');
      values.push(codigo_qr);
    }
    if (sitio_id !== undefined) {
      updateFields.push('sitio_id = ?');
      values.push(sitio_id);
    }
    if (estado !== undefined) {
      updateFields.push('estado = ?');
      values.push(estado);
    }

    updateFields.push('updated_at = NOW()');
    values.push(id);

    await executeQuery(
      `UPDATE inventario_items SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    // Obtener el item actualizado
    const items = await executeQuery(`
      SELECT 
        i.*,
        s.nombre as sitio_nombre
      FROM inventario_items i
      LEFT JOIN sitios s ON i.sitio_id = s.id
      WHERE i.id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Item de inventario actualizado exitosamente',
      data: items[0]
    });

  } catch (error) {
    console.error('Update inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery(
      'DELETE FROM inventario_items WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item de inventario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Item de inventario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Delete inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
