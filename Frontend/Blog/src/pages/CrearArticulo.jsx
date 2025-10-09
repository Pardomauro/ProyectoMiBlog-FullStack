import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';
import '../styles/CrearArticulo.css';

const CrearArticulo = () => {
  const navigate = useNavigate();
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    autor: '',
    categoria: 'Otro',
    tags: ''
  });
  const [imagen, setImagen] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewImagen, setPreviewImagen] = useState(null);

  // Obtener categorías al cargar el componente
  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await fetch(getApiUrl('/api/articulos/categorias'));
      const data = await response.json();
      if (data.success) {
        setCategorias(data.categorias);
      } else {
        // Fallback
        setCategorias(['Tecnología', 'Educación', 'Estilo de vida', 'Negocios y Profesiones', 'Arte y Creatividad', 'Opinión / Comunidad', 'Otro']);
      }
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      // Fallback
      setCategorias(['Tecnología', 'Educación', 'Estilo de vida', 'Negocios y Profesiones', 'Arte y Creatividad', 'Opinión / Comunidad', 'Otro']);
    }
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImagen(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Validar formulario
  const validateForm = () => {
    if (!formData.titulo.trim()) {
      setError('El título es requerido');
      return false;
    }
    if (!formData.contenido.trim()) {
      setError('El contenido es requerido');
      return false;
    }
    if (!formData.autor.trim()) {
      setError('El autor es requerido');
      return false;
    }
    return true;
  };

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Crear FormData para enviar archivo e información
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('contenido', formData.contenido);
      formDataToSend.append('autor', formData.autor);
      formDataToSend.append('categoria', formData.categoria);
      formDataToSend.append('tags', formData.tags);
      
      if (imagen) {
        formDataToSend.append('imagen', imagen);
      }

      const response = await fetch(getApiUrl('/api/articulos'), {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        // Redirigir a la página de inicio después de crear el artículo
        navigate("/inicio");
      } else {
        setError(data.error || 'Error al crear el artículo');
      }
    } catch (error) {
      console.error('Error creando artículo:', error);
      setError('Error de conexión. Verifica que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-articulo-container">
      <header className="crear-articulo-header">
        <h1>✍️ Crear Nuevo Artículo</h1>
        <button 
          type="button" 
          className="btn-volver"
          onClick={() => navigate('/inicio')}
        >
          ← Volver al Inicio
        </button>
      </header>

      <form className="crear-articulo-form" onSubmit={handleCreateArticle}>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Título */}
        <div className="form-group">
          <label htmlFor="titulo">Título del Artículo *</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleInputChange}
            placeholder="Escribe un título llamativo..."
            maxLength="255"
            required
          />
        </div>

        {/* Autor */}
        <div className="form-group">
          <label htmlFor="autor">Autor *</label>
          <input
            type="text"
            id="autor"
            name="autor"
            value={formData.autor}
            onChange={handleInputChange}
            placeholder="Tu nombre o seudónimo"
            maxLength="100"
            required
          />
        </div>

        {/* Categoría */}
        <div className="form-group">
          <label htmlFor="categoria">Categoría *</label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleInputChange}
            required
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Contenido */}
        <div className="form-group">
          <label htmlFor="contenido">Contenido del Artículo *</label>
          <textarea
            id="contenido"
            name="contenido"
            value={formData.contenido}
            onChange={handleInputChange}
            placeholder="Escribe el contenido de tu artículo aquí..."
            rows="10"
            required
          />
          <small className="character-count">
            {formData.contenido.length} caracteres
          </small>
        </div>

        {/* Tags */}
        <div className="form-group">
          <label htmlFor="tags">Etiquetas (Tags)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            
          />
          <small className="help-text">
            Separa las etiquetas con comas. Ejemplo: tecnología, programación, web
          </small>
        </div>

        {/* Imagen */}
        <div className="form-group">
          <label htmlFor="imagen">Imagen del Artículo</label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          <small className="help-text">
            Formatos soportados: JPG, PNG, GIF (máximo 5MB)
          </small>
          
          {previewImagen && (
            <div className="image-preview">
              <img src={previewImagen} alt="Preview" />
              <button 
                type="button" 
                className="btn-remove-image"
                onClick={() => {
                  setImagen(null);
                  setPreviewImagen(null);
                  document.getElementById('imagen').value = '';
                }}
              >
                ✕ Eliminar imagen
              </button>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancelar"
            onClick={() => navigate('/inicio')}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-crear"
            disabled={loading}
          >
            {loading ? 'Creando...' : '✨ Publicar Artículo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearArticulo;
