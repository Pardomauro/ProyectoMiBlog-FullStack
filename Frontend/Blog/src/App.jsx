import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Presentacion from './Presentacion'
import Login from './Login'
import Registro from './Registro'
import Inicio from './Inicio'
import CrearArticulo from './CrearArticulo'
import LeerMas from './LeerMas'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Presentacion />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          
          {/* Rutas protegidas */}
          <Route path="/inicio" element={
            <ProtectedRoute>
              <Inicio />
            </ProtectedRoute>
          } />
          <Route path="/crearArticulo" element={
            <ProtectedRoute>
              <CrearArticulo />
            </ProtectedRoute>
          } />
          <Route path="/articulo/:id" element={
            <ProtectedRoute>
              <LeerMas />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;
