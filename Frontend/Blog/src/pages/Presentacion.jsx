
import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Presentacion.css';

const Presentacion = () => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate("/login");
    };

    return (
        <div className="presentacion-container">
            {/* Elementos decorativos */}
            <div className="presentacion-decorations">
                <div className="decoration-circle"></div>
                <div className="decoration-circle"></div>
                <div className="decoration-circle"></div>
            </div>
            
            {/* Contenido principal */}
            <div className="presentacion-content">
                <h1>Bienvenido a mi Blog</h1>
                <p className="presentacion-subtitle">
                    Explora artículos interesantes y comparte tus pensamientos. 
                    Únete a nuestra comunidad de escritores y lectores apasionados.
                </p>
                <div className="presentacion-buttons">
                    <button className="btn-comenzar" onClick={handleNavigation}>
                        Iniciar Sesión
                    </button>
                    <button 
                        className="btn-registro" 
                        onClick={() => navigate('/registro')}
                    >
                        Crear Cuenta
                    </button>
                </div>
            </div>
        </div>
    );


};

export default Presentacion;