# Proyecto Blog Full-Stack (React + Node.js + MySQL)

Este es un proyecto de una aplicación de blog completa, construida con un stack moderno que incluye React para el frontend, Node.js con Express para el backend, y MySQL como base de datos. La aplicación permite a los usuarios registrarse, iniciar sesión, y realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre artículos, además de interactuar a través de comentarios.

## ✨ Características Principales

-   **Gestión de Usuarios:** Sistema de registro e inicio de sesión con almacenamiento seguro de contraseñas (usando bcrypt).
-   **CRUD de Artículos:**
    -   Creación de nuevos artículos con título, contenido, autor, categoría y etiquetas.
    -   Posibilidad de adjuntar una imagen destacada para cada artículo.
    -   Visualización de todos los artículos en la página principal.
    -   Vista detallada para cada artículo.
    -   Edición y eliminación de artículos.
-   **Sistema de Comentarios:** Los usuarios pueden dejar comentarios en las publicaciones.
-   **Filtrado y Búsqueda:**
    -   Filtro de artículos por categorías predefinidas.
    -   Búsqueda dinámica en tiempo real que filtra artículos por título, contenido, autor, categoría o etiquetas.
-   **API RESTful:** Backend robusto y bien estructurado construido con Node.js y Express.
-   **Diseño Responsivo:** Interfaz de usuario moderna y adaptable a diferentes tamaños de pantalla, desde móviles hasta escritorios.

## 🛠️ Tecnologías Utilizadas

### Frontend

-   **React:** Biblioteca para construir interfaces de usuario interactivas.
-   **React Router:** Para la navegación y el enrutamiento del lado del cliente.
-   **React Context API:** Para una gestión de estado simple y eficaz de la autenticación del usuario.
-   **CSS3:** Estilos personalizados con Flexbox, Grid y animaciones para una experiencia de usuario fluida y profesional.

### Backend

-   **Node.js:** Entorno de ejecución para JavaScript del lado del servidor.
-   **Express.js:** Framework minimalista para construir la API REST.
-   **MySQL2 (`mysql2/promise`):** Cliente de MySQL para Node.js que permite el uso de `async/await` y pools de conexiones para un mejor rendimiento.
-   **Bcrypt:** Librería para el hash y la verificación segura de contraseñas.
-   **Multer:** Middleware para manejar la subida de archivos (`multipart/form-data`), utilizado para las imágenes de los artículos.

### Base de Datos

-   **MySQL:** Sistema de gestión de bases de datos relacional para almacenar la información de usuarios, artículos y comentarios.

## 🚀 Puesta en Marcha

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos

-   **Node.js y npm:** Asegúrate de tener instalado Node.js (versión 16 o superior). Puedes descargarlo desde nodejs.org.
-   **Servidor MySQL:** Necesitas una instancia de MySQL en ejecución. Puedes usar herramientas como XAMPP, WAMP, MAMP o instalar MySQL directamente en tu sistema.

---

### 1. Configuración del Backend

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd tu-repositorio
    ```

2.  **Navega a la carpeta del Backend:**
    ```bash
    cd Backend
    ```

3.  **Instala las dependencias:**
    ```bash
    npm install
    ```

4.  **Configura la conexión a la base de datos:**
    -   Abre el archivo `Backend/config/database.js`.
    -   Modifica el objeto `dbConfig` con tus credenciales de MySQL. El script intentará crear la base de datos `blog_db` si no existe.

    ```javascript
    const dbConfig = {
      host: 'localhost',
      user: 'tu_usuario_mysql',      
      password: 'tu_contraseña_mysql', 
      database: 'blog_db',
      charset: 'utf8mb4'
    };
    ```

5.  **Inicia el servidor del Backend:**
    ```bash
    node server.js 
    ```
    *(Nota: Asegúrate de tener un archivo `server.js` en la raíz de `/Backend` que inicialice la base de datos y ponga en marcha el servidor Express. Si tu archivo principal tiene otro nombre, úsalo en su lugar).*

    El servidor se ejecutará en `http://localhost:5000`. Al iniciarse por primera vez, creará automáticamente las tablas `articulos`, `usuarios` y `comentarios` si no existen.

---

### 2. Configuración del Frontend

1.  **Abre una nueva terminal** y navega a la carpeta del Frontend:
    ```bash
    cd Frontend/Blog
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Inicia la aplicación de React:**
    ```bash
    npm run dev
    ```
    *(Este comando es para proyectos creados con Vite. Si usaste Create React App, el comando sería `npm start`)*.

4.  **Abre tu navegador:**
    Visita la URL que te indique la terminal (generalmente `http://localhost:5173` para Vite o `http://localhost:3000` para Create React App) para ver la aplicación en funcionamiento.

¡Y listo! Ahora puedes registrar un nuevo usuario, iniciar sesión y comenzar a explorar todas las funcionalidades del blog.

## 📂 Estructura del Proyecto

```
/
├── Backend/
│   ├── config/         # Configuración de la base de datos
│   ├── middleware/     # Middlewares de Express (ej. upload de archivos)
│   ├── routes/         # Definición de las rutas de la API
│   ├── uploads/        # Carpeta para imágenes subidas
│   └── server.js       # Archivo principal del servidor (punto de entrada)
│
└── Frontend/
    └── Blog/
        ├── public/
        ├── src/
        │   ├── components/ # (Opcional) Componentes reutilizables
        │   ├── contexts/   # Contexto de autenticación
        │   ├── App.jsx     # Componente principal
        │   ├── main.jsx    # Punto de entrada de React
        │   └── ...         # Otros componentes y estilos
        └── package.json
```