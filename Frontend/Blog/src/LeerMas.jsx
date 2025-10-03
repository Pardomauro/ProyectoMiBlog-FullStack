import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApiUrl, getImageUrl } from './config/api';
import './LeerMas.css';

const LeerMas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados del componente
  const [articulo, setArticulo] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingComentarios, setLoadingComentarios] = useState(false);
  
  // Estados del formulario de comentarios
  const [nuevoComentario, setNuevoComentario] = useState({
    nombre: '',
    comentario: ''
  });
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  // Cargar artículo y comentarios al montar el componente
  useEffect(() => {
    if (id) {
      fetchArticulo();
      fetchComentarios();
    }
  }, [id]);

  // Obtener el artículo específico
  const fetchArticulo = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/articulos/${id}`));
      const data = await response.json();
      
      if (data.success) {
        setArticulo(data.articulo);
      } else {
        setError('Artículo no encontrado');
      }
    } catch (error) {
      console.error('Error obteniendo artículo:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Obtener comentarios del artículo
  const fetchComentarios = async () => {
    try {
      setLoadingComentarios(true);
      const response = await fetch(getApiUrl(`/api/comentarios/${id}`));
      const data = await response.json();
      
      if (data.success) {
        setComentarios(data.comentarios);
      }
    } catch (error) {
      console.error('Error obteniendo comentarios:', error);
    } finally {
      setLoadingComentarios(false);
    }
  };

  // Manejar cambios en el formulario de comentarios
  const handleComentarioChange = (e) => {
    const { name, value } = e.target;
    setNuevoComentario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enviar nuevo comentario
  const handleSubmitComentario = async (e) => {
    e.preventDefault();
    
    if (!nuevoComentario.nombre.trim() || !nuevoComentario.comentario.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    setEnviandoComentario(true);

    try {
      const response = await fetch(getApiUrl('/api/comentarios'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articulo_id: parseInt(id),
          nombre: nuevoComentario.nombre,
          comentario: nuevoComentario.comentario
        })
      });

      const data = await response.json();

      if (data.success) {
        // Limpiar formulario
        setNuevoComentario({
          nombre: '',
          comentario: ''
        });
        
        // Recargar comentarios
        fetchComentarios();
      } else {
        alert(data.error || 'Error al enviar comentario');
      }
    } catch (error) {
      console.error('Error enviando comentario:', error);
      alert('Error de conexión');
    } finally {
      setEnviandoComentario(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="leer-mas-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leer-mas-container">
        <div className="error-container">
          <h2>😔 {error}</h2>
          <button 
            className="btn-volver"
            onClick={() => navigate('/inicio')}
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!articulo) {
    return null;
  }

  return (
    <div className="leer-mas-container">
      {/* Header con navegación */}
      <header className="article-header">
        <button 
          className="btn-volver"
          onClick={() => navigate('/inicio')}
        >
          ← Volver al inicio
        </button>
      </header>

      {/* Contenido del artículo */}
      <article className="article-content">
        {/* Imagen del artículo */}
        {articulo.imageUrl && (
          <div className="article-image-container">
            <img 
              src={getImageUrl(articulo.imageUrl)} 
              alt={articulo.titulo}
              className="article-image"
            />
          </div>
        )}

        {/* Información del artículo */}
        <div className="article-info">
          <div className="article-meta">
            <span className="category">{articulo.categoria}</span>
            <span className="date">{formatDate(articulo.createdAt)}</span>
          </div>

          <h1 className="article-title">{articulo.titulo}</h1>
          
          <div className="article-author">
            <span>👤 Por: <strong>{articulo.autor}</strong></span>
          </div>

          {/* Tags */}
          {articulo.tags && articulo.tags.length > 0 && (
            <div className="article-tags">
              {articulo.tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Contenido completo */}
        <div className="article-body">
          <div className="content">
            {articulo.contenido.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>

      {/* Sección de comentarios */}
      <section className="comments-section">
        <h2 className="comments-title">
          💬 Comentarios ({comentarios.length})
        </h2>

        {/* Formulario para nuevo comentario */}
        <div className="new-comment-form">
          <h3>Deja tu comentario</h3>
          <form onSubmit={handleSubmitComentario}>
            <div className="form-group">
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                value={nuevoComentario.nombre}
                onChange={handleComentarioChange}
                required
                maxLength="100"
              />
            </div>
            <div className="form-group">
              <textarea
                name="comentario"
                placeholder="Escribe tu comentario..."
                value={nuevoComentario.comentario}
                onChange={handleComentarioChange}
                required
                rows="4"
              />
            </div>
            <button 
              type="submit" 
              className="btn-comentar"
              disabled={enviandoComentario}
            >
              {enviandoComentario ? '📤 Enviando...' : '💬 Comentar'}
            </button>
          </form>
        </div>

        {/* Lista de comentarios */}
        <div className="comments-list">
          {loadingComentarios ? (
            <div className="loading-comments">
              <p>Cargando comentarios...</p>
            </div>
          ) : comentarios.length === 0 ? (
            <div className="no-comments">
              <p>🤔 Aún no hay comentarios. ¡Sé el primero en comentar!</p>
            </div>
          ) : (
            comentarios.map(comentario => (
              <div key={comentario.id} className="comment-card">
                <div className="comment-header">
                  <span className="comment-author">👤 {comentario.nombre}</span>
                  <span className="comment-date">
                    {formatDate(comentario.createdAt)}
                  </span>
                </div>
                <div className="comment-body">
                  <p>{comentario.comentario}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default LeerMas;