import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Registro.css';

const Registro = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Si ya está autenticado, redirigir al inicio
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/inicio');
    }
  }, [isAuthenticated, navigate]);

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  // Validar formulario
  const validateForm = () => {
    // Validar nombre
    if (!formData.nombre.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (formData.nombre.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return false;
    }

    // Validar email
    if (!formData.email.trim()) {
      setError('El email es requerido');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('El formato del email no es válido');
      return false;
    }

    // Validar contraseña
    if (!formData.password) {
      setError('La contraseña es requerida');
      return false;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      setError('Debe confirmar la contraseña');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Usar la función register del contexto
      await register(formData.nombre.trim(), formData.email.toLowerCase(), formData.password);
      
      // Si llegamos aquí, el registro fue exitoso
      setSuccess(true);
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Redirigir automáticamente al inicio (ya autenticado)
      setTimeout(() => {
        navigate('/inicio');
      }, 1500);
      
    } catch (error) {
      setError(error.message || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="registro-container">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>¡Registro Exitoso!</h2>
          <p>Tu cuenta ha sido creada correctamente.</p>
          <p>Serás redirigido al blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="registro-container">
      <div className="registro-card">
        <header className="registro-header">
          <h1>📝 Crear Cuenta</h1>
          <p>Únete a nuestra comunidad de escritores</p>
        </header>

        <form className="registro-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Nombre */}
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ingresa tu nombre completo"
              maxLength="100"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ejemplo@gmail.com"
              maxLength="255"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Mínimo 6 caracteres"
              minLength="6"
              required
            />
            <small className="help-text">
              La contraseña debe tener al menos 6 caracteres
            </small>
          </div>

          {/* Confirmar Contraseña */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Repite tu contraseña"
              required
            />
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancelar"
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              ← Volver al Login
            </button>
            <button 
              type="submit" 
              className="btn-registrar"
              disabled={loading}
            >
              {loading ? 'Registrando...' : '🚀 Crear Cuenta'}
            </button>
          </div>
        </form>

        <div className="registro-footer">
          <p>
            ¿Ya tienes cuenta? 
            <button 
              type="button"
              className="link-button"
              onClick={() => navigate('/login')}
            >
              Inicia Sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;