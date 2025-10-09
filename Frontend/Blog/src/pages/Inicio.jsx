
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { getApiUrl, getImageUrl } from '../config/api';

const Inicio = () => {
    const [articulos, setArticulos] = useState([]);
    const [filtroArticulos, setFiltroArticulos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [buscador, setBuscador] = useState('');
    const [seleccionarCategoria, setSeleccionarCategoria] = useState('Todas');
    const [loading, setLoading] = useState(true);
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
    const [mostrandoBusqueda, setMostrandoBusqueda] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Obtener artículos y categorías del backend
    useEffect(() => {
        fetchArticulos();
        fetchCategorias();
    }, []);

    // Solución definitiva: Prevenir CUALQUIER navegación hacia atrás con Backspace
    useEffect(() => {
        const disableBackspaceNavigation = (e) => {
            // Si es Backspace y no estamos en un elemento editable
            if (e.keyCode === 8) { // 8 es el código de Backspace
                const element = e.target || e.srcElement;
                const name = element.nodeName.toUpperCase();
                const type = element.type ? element.type.toUpperCase() : '';
                const readonly = element.readOnly;
                const disabled = element.disabled;

                // Permitir Backspace solo en elementos editables no deshabilitados
                if (name !== 'INPUT' && name !== 'TEXTAREA') {
                    e.preventDefault();
                    return false;
                } else if (readonly || disabled) {
                    e.preventDefault();
                    return false;
                }
            }
        };

        // Usar keydown con captura
        document.addEventListener('keydown', disableBackspaceNavigation, true);

        // Limpiar al desmontar
        return () => {
            document.removeEventListener('keydown', disableBackspaceNavigation, true);
        };
    }, []);



    const fetchArticulos = async (categoria = null) => {
        try {
            const url = categoria && categoria !== 'Todas' 
                ? `${getApiUrl('/api/articulos')}?categoria=${encodeURIComponent(categoria)}`
                : getApiUrl('/api/articulos');            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setArticulos(data.articulos);
                setFiltroArticulos(data.articulos);
            }
        } catch (error) {
            console.error('Error obteniendo artículos:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategorias = async () => {
        try {
            const response = await fetch(getApiUrl('/api/articulos/categorias'));
            const data = await response.json();
            if (data.success) {
                setCategorias(['Todas', ...data.categorias]);
                console.log('Categorías establecidas:', ['Todas', ...data.categorias]);
            } else {
                // Fallback si la API falla
                setCategorias(['Todas', 'Tecnología', 'Educación', 'Estilo de vida', 'Negocios y Profesiones', 'Arte y Creatividad', 'Opinión / Comunidad', 'Otro']);
            }
        } catch (error) {
            console.error('Error obteniendo categorías:', error);
            // Fallback en caso de error de conexión
            setCategorias(['Todas', 'Tecnología', 'Educación', 'Estilo de vida', 'Negocios y Profesiones', 'Arte y Creatividad', 'Opinión / Comunidad', 'Otro']);
        }
    };

    // Manejar búsqueda dinámica
    useEffect(() => {

        console.log('useEffect filtrado ejecutado:', { buscador, articulosLength: articulos.length, categoria: seleccionarCategoria, mostrandoBusquedaActual: mostrandoBusqueda });

        if (buscador.trim()) {
            // Filtrar artículos que coinciden con la búsqueda
            const resultados = articulos.filter(articulo =>
                articulo.titulo.toLowerCase().includes(buscador.toLowerCase()) ||
                articulo.contenido.toLowerCase().includes(buscador.toLowerCase()) ||
                articulo.autor.toLowerCase().includes(buscador.toLowerCase()) ||
                articulo.categoria.toLowerCase().includes(buscador.toLowerCase()) ||
                (articulo.tags && articulo.tags.some(tag =>
                    tag.toLowerCase().includes(buscador.toLowerCase())
                ))
            );
            setResultadosBusqueda(resultados);

            console.log('Búsqueda activa, resultados:', resultados.length);

            setMostrandoBusqueda(true);
        }  /* else { 

        
            setResultadosBusqueda([]);
            setMostrandoBusqueda(false);
            Restaurar filtroArticulos al estado según categoría
            if (seleccionarCategoria === 'Todas') {


                setFiltroArticulos(articulos);
            } else {
                const filtradosPorCategoria = articulos.filter(a => a.categoria === seleccionarCategoria);

             
                setFiltroArticulos(filtradosPorCategoria);
            } 
        } */
    }, [buscador, articulos, seleccionarCategoria]);

    // Nuevo handler para onChange del input (reemplaza el onChange inline)
    const handleBuscadorChange = (e) => {
        const nuevoValor = e.target.value;
        setBuscador(nuevoValor);
 

        // Si se vacía, restaurar inmediatamente (síncrono en este ciclo)
        if (!nuevoValor.trim()) {
            console.log('Borrado completo: restaurando inmediatamente');
            setMostrandoBusqueda(false);
            setResultadosBusqueda([]);
            if (seleccionarCategoria === 'Todas') {
                setFiltroArticulos(articulos);
            } else {
                const filtradosPorCategoria = articulos.filter(a => a.categoria === seleccionarCategoria);
                setFiltroArticulos(filtradosPorCategoria);
            }
        }
    };

    // Manejar cambio de categoría
    const handleCategoriaChange = (categoria) => {
        setSeleccionarCategoria(categoria);
        setLoading(true);
        fetchArticulos(categoria);
    };

    const handleCreateArticle = () => {
        navigate('/crearArticulo');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const limpiarBusqueda = () => {
        setBuscador('');
        setMostrandoBusqueda(false);
        setResultadosBusqueda([]);
    };



    return (
        <div className="inicio-container">
            {/* Barra de Usuario */}
            <div className="user-bar">
                <div className="user-info">
                    <span className="user-welcome">👋 Bienvenido, {user?.nombre || 'Usuario'}</span>
                </div>
                <div className="user-actions">
                    <button className="btn-logout" onClick={handleLogout}>
                        🚪 Cerrar Sesión
                    </button>
                </div>
            </div>

            <header className="inicio-header">
                <h1>Blog de Artículos</h1>

                {/* Buscador */}
                <div className="search-section">
                    <div className="search-input-container">
                        <input
                            type="text"
                            className="buscador"
                            placeholder="Buscar artículos, tags, categorías..."
                            value={buscador}
                            onChange={handleBuscadorChange}  // <-- Nuevo handler, reemplaza a --> onChange={(e) => setBuscador(e.target.value)}
                            autoComplete="off"
                        />
                        {buscador && (
                            <button
                                className="btn-limpiar-busqueda"
                                onClick={limpiarBusqueda}
                                title="Limpiar búsqueda"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Resultados de búsqueda */}
                    {mostrandoBusqueda && (
                        <div className="search-results">
                            <div className="search-results-header">
                                <h4>Resultados de búsqueda para "{buscador}" ({resultadosBusqueda.length} encontrados)</h4>
                            </div>
                            {resultadosBusqueda.length > 0 ? (
                                <div className="search-results-grid">
                                    {resultadosBusqueda.map(articulo => (
                                        <div key={articulo.id} className="search-result-card">
                                            {articulo.imageUrl && (
                                                <div className="search-result-image">
                                                    <img
                                                        src={getImageUrl(articulo.imageUrl)}
                                                        alt={articulo.titulo}
                                                    />
                                                </div>
                                            )}
                                            <div className="search-result-content">
                                                <h5>{articulo.titulo}</h5>
                                                <p className="search-result-excerpt">
                                                    {articulo.contenido.length > 100
                                                        ? articulo.contenido.substring(0, 100) + '...'
                                                        : articulo.contenido
                                                    }
                                                </p>
                                                <div className="search-result-meta">
                                                    <span className="categoria">{articulo.categoria}</span>
                                                    <span className="autor">Por {articulo.autor}</span>
                                                </div>
                                                <button
                                                    className="btn-leer-mas-search"
                                                    onClick={() => navigate(`/articulo/${articulo.id}`)}
                                                >
                                                    Leer más
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-results">
                                    <p>No se encontraron artículos que coincidan con tu búsqueda.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Botón Crear Artículo */}
                <div className="create-section">
                    <button
                        className="btn-crear-articulo"
                        onClick={handleCreateArticle}
                    >
                        + Crear Nuevo Artículo
                    </button>
                </div>
            </header>

            <main className="inicio-main">
                {/* Solo mostrar filtros y artículos cuando no hay búsqueda activa */}
                {!mostrandoBusqueda && (
                    <>
                        {/* Filtros por Categoría */}
                        <div className="category-filters">
                            <h3>Filtrar por Categoría:</h3>
                            <div className="category-buttons">
                                {categorias.length === 0 ? (
                                    <p>Cargando categorías...</p>
                                ) : (
                                    categorias.map(categoria => (
                                        <button
                                            key={categoria}
                                            className={seleccionarCategoria === categoria ? 'active' : ''}
                                            onClick={() => handleCategoriaChange(categoria)}
                                        >
                                            {categoria}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Lista de Artículos */}
                        <div className="articles-section">
                            <h3>
                                {seleccionarCategoria === 'Todas'
                                    ? `Todos los Artículos (${filtroArticulos.length})`
                                    : `Categoría: ${seleccionarCategoria} (${filtroArticulos.length})`
                                }
                            </h3>

                            {loading ? (
                                <p>Cargando artículos...</p>
                            ) : filtroArticulos.length === 0 ? (
                                <p>No se encontraron artículos.</p>
                            ) : (
                                <div className="articles-grid">
                                    {filtroArticulos.map(articulo => (
                                        <div key={articulo.id} className="article-card">
                                            {articulo.imageUrl && (
                                                <div className="article-image-container">
                                                    <img
                                                        src={getImageUrl(articulo.imageUrl)}
                                                        alt={articulo.titulo}
                                                        className="article-image"
                                                        onError={(e) => {
                                                            console.log('Error cargando imagen:', articulo.imageUrl);
                                                            e.target.parentElement.style.display = 'none';
                                                        }}
                                                        onLoad={() => {
                                                            console.log('Imagen cargada correctamente:', articulo.imageUrl);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <div className="article-content">
                                                <h4>{articulo.titulo}</h4>
                                                <p className="article-preview">
                                                    {articulo.contenido.length > 150
                                                        ? articulo.contenido.substring(0, 150) + '...'
                                                        : articulo.contenido
                                                    }
                                                </p>
                                                <div className="article-meta">
                                                    <span className="author">Por: {articulo.autor}</span>
                                                    <span className="date">
                                                        {new Date(articulo.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="category">{articulo.categoria}</span>
                                                </div>
                                                <div className="article-tags">
                                                    {articulo.tags.map(tag => (
                                                        <span key={tag} className="tag">#{tag}</span>
                                                    ))}
                                                </div>
                                                <button
                                                    className="btn-leer-mas"
                                                    onClick={() => navigate(`/articulo/${articulo.id}`)}
                                                >
                                                    Leer más
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Inicio;