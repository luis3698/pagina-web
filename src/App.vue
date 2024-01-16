<template>
  <a-layout>
    <a-layout-header
      v-if="!userStore.loadingSession"
      :style="{ lineHeight: '64px', display: 'flex', justifyContent: 'space-between' }"
      class="fixed-header"
    >
      <a-menu theme="dark" mode="horizontal" v-model:selectedKeys="selectedKeys" :style="{ flex: '1' }">
        <a-menu-item key="home">
          <router-link to="/">Home</router-link>
        </a-menu-item>

        <a-menu-item key="recetas">
          <router-link to="/recetas">Recetas</router-link>
        </a-menu-item>

        <a-menu-item key="#1">
          <router-link to="#">FAQ (Preguntas Frecuentes)</router-link>
        </a-menu-item>

        <a-menu-item key="#2">
          <router-link to="/sobrenosostros">Sobre nosotros</router-link>
        </a-menu-item>

        <a-menu-item key="blog">
          <router-link to="/blog">Blog</router-link>
        </a-menu-item>

    
        <a-menu-item v-if="!userStore.userData" key="login" style="margin-left: auto;">
          <router-link to="/login">Login</router-link>
        </a-menu-item>

        <a-menu-item v-if="!userStore.userData" key="register">
          <router-link to="/register">Register</router-link>
        </a-menu-item>



        <a-sub-menu v-if="userStore.userData" key="additionalOptions" style="margin-left: auto;">
          <template #title>
            <div class="text-center" :href="userStore.userData.profileUrl">{{ userStore.userData.displayName }}
              <a-avatar :src="userStore.userData.photoUrl" :size="40"></a-avatar>
            </div>
          </template>

          <a-menu-item v-if="userStore.userData" key="perfil">
            <router-link to="/perfil">Perfil
              <span style="margin-right: 8%;">👤</span>
            </router-link>
          </a-menu-item>
          <a-menu-item v-if="userStore.userData" key="megusta">
            <router-link to="/megusta"> Me Gusta 
              <span style="margin-right: 8%;">❤️</span>
            </router-link>
          </a-menu-item>
          <a-menu-item v-if="userStore.userData" key="misrecetas">
            <router-link to="/MisRecetas">Mis recetas
              <span style="margin-right: 8%;">🍜</span>
            </router-link>
          </a-menu-item>

          <a-menu-item @click="userStore.logoutUser" v-if="userStore.userData" key="logout">
            <LogoutOutlined :style="{ fontSize: '20px' }"></LogoutOutlined>
            Cerrar Sesión
          </a-menu-item>
        </a-sub-menu>
        
      </a-menu>
    </a-layout-header>

    <!-- Contenido principal -->
    <a-layout-content style="padding: 0 px; margin-top: 64px;">
      
        <div v-if="userStore.loadingSession">Loading ...</div>
        <router-view v-else></router-view>
      
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from './stores/user';
import { useRoute } from 'vue-router';
import { LogoutOutlined } from '@ant-design/icons-vue';






const userStore = useUserStore();

const route = useRoute();

const isHomeView = ref(false); // Agregar esta línea

const selectedKeys = ref(['']);

const searchQuery = ref(''); // Agregar esta línea


watch(() => route.name, () => {
  selectedKeys.value = [route.name];
  isHomeView.value = route.name === 'home'; // Ajusta 'home' según el nombre de tu vista Home
});


</script>

<style>


.fixed-header {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  padding: 0 16px; /* Ajuste del padding del header */
  display: flex;
  justify-content: space-between;
  background-color: #242636; /* Cambio de color de fondo */
  color: #ffffff; /* Cambio de color de texto */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Sombra ligera */
}

.text-center {
  text-align: center;
}

a-menu {
  background-color: #242636; /* Cambio de color de fondo del menú */
  border: none; /* Eliminación del borde */
}

a-menu-item,
a-sub-menu {
  display: block !important;
  width: 100%; /* Ocupa todo el ancho en dispositivos pequeños */
  text-align: center; /* Alinea el texto al centro en dispositivos pequeños */
  margin: 8px 0; /* Añade un margen entre elementos */
}

a-menu-item {
  color: #ffffff; /* Color del texto de los elementos del menú */
}

a-menu-item:hover {
  background-color: #f79f1b; /* Cambio de color de fondo al pasar el ratón */
}

a-sub-menu-title {
  color: #ffffff; /* Color del texto del título del submenú */
}

/* Estilos adicionales para hacer el menú más responsive en dispositivos más pequeños */
@media screen and (max-width: 992px) {
  .fixed-header {
    padding: 0 16px;
    flex-direction: column; /* Cambio de dirección en dispositivos pequeños */
    align-items: center; /* Alineación al centro en dispositivos pequeños */
  }

  a-menu {
    width: 100%;
  }

  
}

/* Estilos adicionales para hacer el menú más responsive en dispositivos más pequeños */
@media screen and (max-width: 576px) {
  .fixed-header {
    padding: 0 8px;
  }
}
</style>
