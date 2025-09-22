const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { pool } = require('../config/database');
const { upload, handleMulterError } = require('../middleware/upload');

// Función para validar formato de email
const validarEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// En este archivo realizaremos las operaciones CRUD para los usuarios

// Ruta para registro de usuarios
router.post('/registro', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Validar campos obligatorios
        if (!nombre || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios'
            });
        }

        // Validar formato de email
        if (!validarEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'El formato del email no es válido'
            });
        }

        // Verificar si el usuario ya existe
        const [existingUser] = await pool.execute(
            'SELECT id FROM usuarios WHERE email = ?',
            [email.toLowerCase()]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya existe con este email'
            });
        }

        // Hashear contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear usuario
        const [result] = await pool.execute(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre.trim(), email.toLowerCase(), hashedPassword]
        );

        // Obtener datos del usuario creado (sin contraseña)
        const [newUser] = await pool.execute(
            'SELECT id, nombre, email, fecha_creacion FROM usuarios WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            user: newUser[0]
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Ruta para login de usuarios
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar campos obligatorios
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son obligatorios'
            });
        }

        // Buscar usuario por email
        const [users] = await pool.execute(
            'SELECT id, nombre, email, password FROM usuarios WHERE email = ?',
            [email.toLowerCase()]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        const user = users[0];

        // Verificar contraseña
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Remover contraseña de la respuesta
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: 'Login exitoso',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

//Obtenemos todos los usuarios

router.get('/usuarios', async (req, res) => {
    try {
        // Excluir contraseñas por seguridad
        const [usuarios] = await pool.execute(
            'SELECT id, nombre, email, createdAt, updatedAt FROM usuarios ORDER BY createdAt DESC'
        );
        res.json({
            success: true,
            usuarios: usuarios
        });
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Obtenemos un usuario específico por ID 

router.get('/usuarios/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        // Excluir contraseña por seguridad
        const [usuarios] = await pool.execute(
            'SELECT id, nombre, email, createdAt, updatedAt FROM usuarios WHERE id = ?', 
            [id]
        );
        
        if (usuarios.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Usuario no encontrado' 
            });
        }
        
        res.json({
            success: true,
            usuario: usuarios[0]
        });
    } catch (error) {
        console.error('Error obteniendo usuario:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


// Creamos un nuevo usuario 
router.post('/usuarios', upload, handleMulterError, async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Validar campos obligatorios
        if (!nombre || !email || !password) {
            return res.status(400).json({
                success: false, 
                message: 'Faltan campos obligatorios: nombre, email y password son requeridos' 
            });
        }

        // Validar formato de email
        if (!validarEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'El formato del email no es válido'
            });
        }

        // Validar longitud mínima de password
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Verificar si el email ya existe
        const [existingUser] = await pool.execute(
            'SELECT id FROM usuarios WHERE email = ?', 
            [email.toLowerCase()]
        );
        
        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Este email ya está registrado'
            });
        }

        // Encriptar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insertar usuario con contraseña encriptada
        const [result] = await pool.execute(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', 
            [nombre.trim(), email.toLowerCase(), hashedPassword]
        );

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            usuario: {
                id: result.insertId,
                nombre: nombre.trim(),
                email: email.toLowerCase()
                // No retornamos la contraseña por seguridad
            }
        });
    } catch (error) {
        console.error('Error creando usuario:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Actualizamos un usuario existente por ID

router.put('/usuarios/:id', upload, handleMulterError, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nombre, email, password } = req.body;

        // Verificar que el usuario existe
        const [userExists] = await pool.execute(
            'SELECT id FROM usuarios WHERE id = ?', 
            [id]
        );
        
        if (userExists.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Validar campos obligatorios
        if (!nombre || !email) {
            return res.status(400).json({
                success: false, 
                message: 'Nombre y email son requeridos' 
            });
        }

        // Validar formato de email
        if (!validarEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'El formato del email no es válido'
            });
        }

        // Verificar si el email ya existe (excluyendo el usuario actual)
        const [existingUser] = await pool.execute(
            'SELECT id FROM usuarios WHERE email = ? AND id != ?', 
            [email.toLowerCase(), id]
        );
        
        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Este email ya está registrado por otro usuario'
            });
        }

        let updateQuery = 'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?';
        let updateParams = [nombre.trim(), email.toLowerCase(), id];

        // Si se proporciona nueva contraseña, encriptarla
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                });
            }
            
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updateQuery = 'UPDATE usuarios SET nombre = ?, email = ?, password = ? WHERE id = ?';
            updateParams = [nombre.trim(), email.toLowerCase(), hashedPassword, id];
        }

        // Actualizar usuario en la base de datos
        await pool.execute(updateQuery, updateParams);
        
        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            usuario: {
                id,
                nombre: nombre.trim(),
                email: email.toLowerCase()
            }
        });
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Eliminamos un usuario por ID

router.delete('/usuarios/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // Verificamos que el usuario existe
        const [usuarios] = await pool.execute(
            'SELECT * FROM usuarios WHERE id = ?', [id]);
        if (usuarios.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Eliminamos el usuario de la base de datos
        await pool.execute('DELETE FROM usuarios WHERE id = ?', [id]);
        res.json({ success: true, message: 'Usuario eliminado' });
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router; 