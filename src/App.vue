<template>
  <a-layout>
    <a-layout-header
    v-if="!userStore.loadingSession"
    :style="{ lineHeight: '64px', display: 'flex', justifyContent: 'space-between' }"
    class="fixed-header"
  >
      <!-- Menú izquierdo -->
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
          <router-link to="#">Sobre nosostros</router-link>
        </a-menu-item>

        <a-menu-item key="blog">
          <router-link to="/blog">Blog</router-link>
        </a-menu-item>
      </a-menu>


      

      <!-- Menú derecho -->
      <a-menu
        theme="dark"
        mode="horizontal"
        v-model:selectedKeys="selectedKeys"
        :style="{ flex: '1', justifyContent: 'flex-end' }"
      >
        <a-menu-item v-if="!userStore.userData" key="login">
          <router-link to="/login">Login</router-link>
        </a-menu-item>

        <a-menu-item v-if="!userStore.userData" key="register">
          <router-link to="/register">Register</router-link>
        </a-menu-item>

        <a-sub-menu v-if="userStore.userData" key="additionalOptions">
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
  <div class="container">
    <div  v-if="userStore.loadingSession">Loading ...</div>
    <router-view v-else></router-view>
  </div>
//</a-layout-content>


<!--<Footer />-->
   
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

const handleSearch = () => {
  // Implementar la lógica de búsqueda
};
watch(() => route.name, () => {
  selectedKeys.value = [route.name];
  isHomeView.value = route.name === 'home'; // Ajusta 'home' según el nombre de tu vista Home
});


</script>

<style>
.container {
  background-color: #ffffff;
  padding: px;
  min-height: calc(100vh - 64px);
}

.fixed-header {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000; /* Ajusta el valor de z-index según sea necesario para asegurar que la barra esté por encima de otros elementos */
}

.text-center {
  text-align: center;
}

.footer {
  background-color: #333;
  color: white;
  padding: 20px 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; /* Permite que los elementos se envuelvan en varias líneas */
}

.footer-logo img {
  width: 50px; /* Ajusta el tamaño de tu logo */
}

.footer-words span {
  color: white;
  margin: 0 10px;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.footer-words span:hover {
  color: #ccc;
}

.footer-company {
  text-align: center;
  flex-basis: 100%; /* Ocupa el 100% del ancho cuando se envuelve en varias líneas */
  margin-top: 20px; /* Ajusta la separación desde arriba según tus necesidades */
}

/* Estilos adicionales para hacer el menú más responsive */
@media screen and (max-width: 768px) {
  .container {
    padding: 16px;
  }

  a-menu {
    display: block;
  }

  a-menu-item,
  a-sub-menu {
    display: block !important;
  }
}
</style>