# Proyecto Web de Recetas con Vue 3 + Vite y Firebase 🚀

¡Bienvenido al emocionante proyecto web de recetas! 🎉 Esta aplicación responsiva te brinda la oportunidad de descubrir, crear y compartir deliciosas recetas. Desarrollada utilizando Vue 3 y Vite para el desarrollo eficiente, además de Firebase para gestionar la autenticación, almacenamiento de datos y archivos.

## Características Principales 🌟

### Registro y Login de Usuarios 📝
Los usuarios pueden registrar y acceder a sus cuentas, gestionando sus perfiles personalizados.

### Perfil de Usuario 📷
Añade una foto de perfil y un nombre a tu perfil, editándolo en cualquier momento.

### Gestión de Recetas 🍽️
Crea, elimina y edita tus propias recetas. Explora y visualiza recetas de otros usuarios.

### Interacción con Recetas ❤️
Da "me gusta" a las recetas de otros usuarios y filtra las recetas según diferentes criterios.

## Gif Pagina

<img src="./src/assets/gif.gif" alt="Un gif muy divertido" width="500" height="300">


## Estructura de Carpetas 📁

- **src/**
  - **assets/**: Archivos estáticos como imágenes.
  - **components/**: Componentes Vue reutilizables.
  - **router/**: Configuración de las rutas de la aplicación.
  - **store/**
    - **database.js**: Almacén Vuex para gestionar operaciones de la base de datos.
    - **user.js**: Almacén Vuex para gestionar autenticación de usuarios.
  - **views/**: Componentes representando las vistas de la aplicación.
  - **App.vue**: Componente principal de la aplicación.
  - **main.js**: Archivo de entrada principal donde se inicializa la aplicación.
  - **firebaseConfig.js**: Configuración de Firebase, incluyendo la inicialización de servicios necesarios.
- **README.md**: Este archivo.

## Uso de Almacenes Vuex 🗄️

### [userStore](src/store/user.js)
Gestiona el estado relacionado con la autenticación de usuarios y la información del perfil. Permite a los usuarios registrar, iniciar sesión, editar su perfil y cerrar sesión.

### [database](src/store/database.js)
Se encarga de las operaciones relacionadas con la base de datos de Firebase. Incluye funciones para agregar, actualizar, obtener y eliminar recetas. Proporciona funciones para gestionar la interacción con las recetas, como dar "me gusta" y filtrarlas.

## Uso de Firebase 🔥

El proyecto utiliza Firebase para la autenticación de usuarios, almacenamiento de datos y archivos. Se han configurado los servicios de autenticación, Firestore para la base de datos y Storage para el almacenamiento de archivos.

## Dependencias del Proyecto 📦

Las dependencias utilizadas en este proyecto son:

- [**@coreui/vue**](https://www.npmjs.com/package/@coreui/vue) v^4.10.1
- [**@fortawesome/fontawesome-free**](https://www.npmjs.com/package/@fortawesome/fontawesome-free) v^6.5.1
- [**ant-design-vue**](https://www.npmjs.com/package/ant-design-vue) v^3.2.20
- [**firebase**](https://www.npmjs.com/package/firebase) v^9.17.1
- [**lodash**](https://www.npmjs.com/package/lodash) v^4.17.21
- [**nanoid**](https://www.npmjs.com/package/nanoid) v^4.0.1
- [**pinia**](https://www.npmjs.com/package/pinia) v^2.0.32
- [**unplugin-vue-components**](https://www.npmjs.com/package/unplugin-vue-components) v^0.24.0
- [**vue**](https://www.npmjs.com/package/vue) v^3.2.45
- [**vue-router**](https://www.npmjs.com/package/vue-router) v^4.1.6
- [**vue-upload-component**](https://www.npmjs.com/package/vue-upload-component) v^2.8.23

Para más detalles sobre cada dependencia, puedes visitar sus respectivas páginas en [npm](https://www.npmjs.com/).

## Instalación y Configuración ⚙️

1. Clona el repositorio: `git clone <URL_DEL_REPOSITORIO>`
2. Instala las dependencias: `npm install`
3. Crea un proyecto en Firebase y obtén las credenciales.
4. Configura Firebase: Reemplaza las variables de configuración en `firebaseConfig.js` con tus propias credenciales.

## Ejecutar la Aplicación 🚀

```bash
npm run dev
