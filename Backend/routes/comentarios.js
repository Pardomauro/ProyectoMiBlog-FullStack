const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/comentarios/:articulo_id - Obtener comentarios de un artículo
router.get('/:articulo_id', async (req, res) => {
  try {
    const articulo_id = parseInt(req.params.articulo_id);
    
    const [comentarios] = await pool.execute(
      'SELECT * FROM comentarios WHERE articulo_id = ? ORDER BY createdAt DESC',
      [articulo_id]
    );
    
    res.json({
      success: true,
      comentarios
    });
  } catch (error) {
    console.error('Error obteniendo comentarios:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/comentarios - Crear nuevo comentario
router.post('/', async (req, res) => {
  try {
    const { articulo_id, nombre, comentario } = req.body;
    
    // Validaciones básicas
    if (!articulo_id || !nombre || !comentario) {
      return res.status(400).json({
        success: false,
        error: 'Artículo ID, nombre y comentario son requeridos'
      });
    }

    // Verificar que el artículo existe
    const [articulos] = await pool.execute(
      'SELECT id FROM articulos WHERE id = ?',
      [articulo_id]
    );

    if (articulos.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Artículo no encontrado'
      });
    }

    // Insertar comentario
    const [result] = await pool.execute(
      'INSERT INTO comentarios (articulo_id, nombre, comentario) VALUES (?, ?, ?)',
      [articulo_id, nombre.trim(), comentario.trim()]
    );

    // Obtener el comentario recién creado
    const [nuevoComentario] = await pool.execute(
      'SELECT * FROM comentarios WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Comentario creado exitosamente',
      comentario: nuevoComentario[0]
    });
  } catch (error) {
    console.error('Error creando comentario:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/comentarios/:id - Eliminar comentario (opcional)
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const [result] = await pool.execute(
      'DELETE FROM comentarios WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Comentario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Comentario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando comentario:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;