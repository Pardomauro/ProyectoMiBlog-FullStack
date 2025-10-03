# Blog Frontend - React + Vite

Este es el frontend del proyecto de blog desarrollado con React y Vite.

## 🚀 Configuración para Desarrollo

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn

### Instalación
```bash
npm install
```

### Variables de Entorno
1. Copia el archivo `.env.example` como `.env`
2. Configura la URL de tu backend:
```bash
VITE_API_URL=http://localhost:5000
```

### Ejecutar en Desarrollo
```bash
# Solo frontend
npm run frontend

# Frontend + Backend simultáneamente
npm run dev
```

## 📦 Deployment en Vercel

### Opción 1: Desde GitHub (Recomendado)
1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com) e inicia sesión
3. Click en "New Project"
4. Selecciona tu repositorio
5. Configuración:
   - **Root Directory**: `Frontend/Blog`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Opción 2: Vercel CLI
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### Variables de Entorno en Vercel
En el dashboard de Vercel, agrega:
- `VITE_API_URL`: URL de tu backend en producción

## 🛠️ Scripts Disponibles

- `npm run dev` - Ejecuta frontend + backend
- `npm run frontend` - Solo frontend
- `npm run backend` - Solo backend
- `npm run build` - Construir para producción
- `npm run preview` - Preview del build de producción

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── contexts/           # Contextos de React (Auth)
├── config/            # Configuración (API URLs)
├── assets/           # Recursos estáticos
└── *.jsx            # Páginas principales
```

## 🔧 Configuración de API

Todas las URLs de la API están centralizadas en `src/config/api.js`. 
Para cambiar el endpoint, solo modifica la variable de entorno `VITE_API_URL`.

## 🎯 Funcionalidades

- ✅ Autenticación de usuarios
- ✅ CRUD de artículos
- ✅ Sistema de comentarios
- ✅ Búsqueda en tiempo real
- ✅ Categorización de artículos
- ✅ Upload de imágenes
- ✅ Diseño responsive

## 📝 Notas de Deployment

- El backend debe estar desplegado antes que el frontend
- Asegúrate de configurar CORS en el backend para permitir el dominio de Vercel
- Las imágenes se sirven desde el backend, asegúrate que la URL sea accesible+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
