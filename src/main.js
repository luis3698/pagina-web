import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import 'ant-design-vue/es/message/style/css';
import { auth } from './firebaseConfig'; // Asegúrate de importar tu configuración de Firebase
import { useUserStore } from './stores/user';
import 'ant-design-vue/dist/antd.css';

import 'bootstrap/dist/css/bootstrap.css';


const app = createApp(App);
const pinia = createPinia();

app.use(router).use(pinia);


// Manejar el estado del usuario al inicio de la aplicación
const userStore = useUserStore();
app.config.globalProperties.$userStore = userStore; // Hacer la tienda de usuario accesible globalmente

// Verificar el estado de autenticación al cargar la aplicación
auth.onAuthStateChanged((user) => {
  if (user) {
    userStore.setUser(user);
  }
});

app.mount('#app');
