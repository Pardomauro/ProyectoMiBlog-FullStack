// Configuración de la API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  
  // Endpoints
  ENDPOINTS: {
    articulos: '/api/articulos',
    categorias: '/api/articulos/categorias',
    comentarios: '/api/comentarios',
    login: '/api/login',
    registro: '/api/registro'
  }
};

// Helper function para construir URLs completas
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function para URLs de imágenes
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return `${API_CONFIG.BASE_URL}${imagePath}`;
};