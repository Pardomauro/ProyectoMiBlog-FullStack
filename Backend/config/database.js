const mysql = require('mysql2/promise');

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'pardomauro2',
  database: 'blog_db',
  charset: 'utf8mb4'
};

// Creamos la conexión
const createConnection = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión a MySQL establecida');
    return connection;
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error.message);
    throw error;
  }
};

// Creamos un pool de conexiones 
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para inicializar la base de datos y crear tablas
const initializeDatabase = async () => {
  try {
    // Crear base de datos si no existe
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await tempConnection.end();

    // Conectar a la base de datos y crear tabla
    const connection = await createConnection();

    // Crear tabla articulos
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS articulos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        contenido TEXT NOT NULL,
        autor VARCHAR(100) NOT NULL,
        categoria ENUM('Tecnología', 'Educación', 'Estilo de vida', 'Negocios y Profesiones', 'Arte y Creatividad', 'Opinión / Comunidad', 'Otro') NOT NULL DEFAULT 'Otro',
        tags JSON,
        imageUrl VARCHAR(500),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Agregar columna categoria si no existe (para actualizar tabla existente)
    try {
      await connection.execute(`
        ALTER TABLE articulos 
        ADD COLUMN categoria ENUM('Tecnología', 'Educación', 'Estilo de vida', 'Negocios y Profesiones', 'Arte y Creatividad', 'Opinión / Comunidad', 'Otro') NOT NULL DEFAULT 'Otro'
      `);
      console.log('✅ Columna categoria agregada a la tabla articulos');
    } catch (alterError) {
      // Si falla es porque la columna ya existe
      console.log('ℹ️ Columna categoria ya existe en la tabla articulos');
    }

    // Crear tabla usuarios
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla comentarios
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS comentarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        articulo_id INT NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        comentario TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (articulo_id) REFERENCES articulos(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Tablas "articulos", "usuarios" y "comentarios" creadas o ya existen');
    await connection.end();

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error.message);
    throw error;
  }
};

module.exports = {
  pool,
  createConnection,
  initializeDatabase
};