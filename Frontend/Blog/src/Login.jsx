

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from './contexts/AuthContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    // Si ya está autenticado, redirigir al inicio
    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/inicio');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Por favor completa todos los campos');
            return;
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Por favor, ingresa un email válido");
            return;
        }

        setLoading(true);

        try {
            const result = await login(email, password);
            
            if (result.success) {
                // Redirigir a la página de inicio
                navigate("/inicio");
            } else {
                setError(result.error || 'Error al iniciar sesión');
            }
        } catch (error) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Elementos decorativos */}
            <div className="login-decorations">
                <div className="decoration-circle"></div>
                <div className="decoration-circle"></div>
                <div className="decoration-circle"></div>
            </div>
            
            {/* Formulario principal */}
            <div className="login-form-container">
                <h2 className="login-title">Bienvenido</h2>
                <p className="login-subtitle">Ingresa tu cuenta, si no la tienes crea una nueva</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    
                    <div className="input-group">
                        <input
                            type="email"
                            className="login-input"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <input
                            type="password"
                            className="login-input"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        ¿No tienes cuenta?{' '}
                        <button 
                            type="button"
                            className="link-button"
                            onClick={() => navigate('/registro')}
                        >
                            Regístrate aquí
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;