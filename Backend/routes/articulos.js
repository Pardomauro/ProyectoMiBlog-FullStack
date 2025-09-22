const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { upload, handleMulterError } = require('../middleware/upload');

// Función auxiliar para parsear tags de forma segura
const parseTags = (tagsData) => {
  if (!tagsData) return [];
  
  try {
    // Si ya es un array, lo devolvemos
    if (Array.isArray(tagsData)) return tagsData;
    
    // Si es un string, intentamos parsearlo como JSON
    if (typeof tagsData === 'string') {
      // Si empieza con [ significa que es JSON
      if (tagsData.startsWith('[')) {
        return JSON.parse(tagsData);
      }
      // Si no, lo tratamos como string separado por comas
      return tagsData.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    
    return [];
  } catch (error) {
    console.warn('Error parseando tags:', tagsData, error.message);
    // Si falla el parsing, intentamos tratarlo como string
    if (typeof tagsData === 'string') {
      return tagsData.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    return [];
  }
};

// GET /api/articulos/categorias - Obtener todas las categorías disponibles
router.get('/categorias', async (req, res) => {
  try {
    const categorias = ['Tecnología', 'Educación', 'Estilo de vida', 'Negocios y Profesiones', 'Arte y Creatividad', 'Opinión / Comunidad', 'Otro'];
    
    res.json({
      success: true,
      categorias
    });
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/articulos - Obtener todos los artículos (con filtro opcional por categoría)
router.get('/', async (req, res) => {
  try {
    const { categoria } = req.query;
    
    let query = 'SELECT * FROM articulos';
    let params = [];
    
    if (categoria && categoria !== 'Todas') {
      query += ' WHERE categoria = ?';
      params.push(categoria);
    }
    
    query += ' ORDER BY createdAt DESC';
    
    const [articulos] = await pool.execute(query, params);
    
    // Parsear tags de forma segura
    const articulosConTags = articulos.map(articulo => ({
      ...articulo,
      tags: parseTags(articulo.tags)
    }));
    
    res.json({
      success: true,
      articulos: articulosConTags
    });
  } catch (error) {
    console.error('Error obteniendo artículos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/articulos/:id - Obtener un artículo específico
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [articulos] = await pool.execute(
      'SELECT * FROM articulos WHERE id = ?',
      [id]
    );

    if (articulos.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Artículo no encontrado'
      });
    }

    const articulo = {
      ...articulos[0],
      tags: parseTags(articulos[0].tags)
    };

    res.json({ success: true, articulo });
  } catch (error) {
    console.error('Error obteniendo artículo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/articulos - Crear nuevo artículo (con imagen opcional)
router.post('/', upload, handleMulterError, async (req, res) => {
  try {
    const { titulo, contenido, autor, categoria, tags } = req.body;
    
    // Validaciones básicas
    if (!titulo || !contenido || !autor) {
      return res.status(400).json({
        success: false,
        error: 'Título, contenido y autor son requeridos'
      });
    }

    // Validar categoría
    const categoriasValidas = ['Tecnología', 'Educación', 'Estilo de vida', 'Negocios y Profesiones', 'Arte y Creatividad', 'Opinión / Comunidad', 'Otro'];
    const categoriaFinal = categoria && categoriasValidas.includes(categoria) ? categoria : 'Otro';

    // Procesar tags
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
    const tagsJson = JSON.stringify(tagsArray);
    
    // URL de la imagen si se subió
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Insertar en la base de datos
    const [result] = await pool.execute(
      'INSERT INTO articulos (titulo, contenido, autor, categoria, tags, imageUrl) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, contenido, autor, categoriaFinal, tagsJson, imageUrl]
    );

    // Obtener el artículo recién creado
    const [newArticulo] = await pool.execute(
      'SELECT * FROM articulos WHERE id = ?',
      [result.insertId]
    );

    const articuloCreado = {
      ...newArticulo[0],
      tags: tagsArray
    };
    
    res.status(201).json({
      success: true,
      message: 'Artículo creado exitosamente',
      articulo: articuloCreado
    });
  } catch (error) {
    console.error('Error creando artículo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/articulos/:id - Actualizar artículo
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { titulo, contenido, autor, categoria, tags } = req.body;

    // Verificar que el artículo existe
    const [articulos] = await pool.execute(
      'SELECT * FROM articulos WHERE id = ?',
      [id]
    );

    if (articulos.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Artículo no encontrado'
      });
    }

    // Validar categoría
    const categoriasValidas = ['Tecnología', 'Educación', 'Estilo de vida', 'Negocios y Profesiones', 'Arte y Creatividad', 'Opinión / Comunidad', 'Otro'];
    const categoriaFinal = categoria && categoriasValidas.includes(categoria) ? categoria : articulos[0].categoria;

    // Procesar tags
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : parseTags(articulos[0].tags);
    const tagsJson = JSON.stringify(tagsArray);

    // Actualizar artículo
    await pool.execute(
      'UPDATE articulos SET titulo = ?, contenido = ?, autor = ?, categoria = ?, tags = ? WHERE id = ?',
      [
        titulo || articulos[0].titulo,
        contenido || articulos[0].contenido,
        autor || articulos[0].autor,
        categoriaFinal,
        tagsJson,
        id
      ]
    );

    // Obtener artículo actualizado
    const [articuloActualizado] = await pool.execute(
      'SELECT * FROM articulos WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Artículo actualizado exitosamente',
      articulo: {
        ...articuloActualizado[0],
        tags: parseTags(articuloActualizado[0].tags)
      }
    });
  } catch (error) {
    console.error('Error actualizando artículo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/articulos/:id - Eliminar artículo
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Verificar que el artículo existe
    const [articulos] = await pool.execute(
      'SELECT * FROM articulos WHERE id = ?',
      [id]
    );

    if (articulos.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Artículo no encontrado'
      });
    }

    // Eliminar artículo
    await pool.execute(
      'DELETE FROM articulos WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Artículo eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando artículo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;