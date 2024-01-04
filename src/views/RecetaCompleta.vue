<template>
    <div class="recipe-container">
      <!-- Información del creador en la parte superior -->
      <div v-if="receta.createdBy" class="creator-info">
        <img :src="receta.createdBy.photoUrl" alt="Foto de perfil del usuario" class="creator-avatar">
        <div class="creator-text">
          <p>{{ receta.createdBy.displayName }}</p>
        </div>
      </div>
  
      <h1 class="recipe-title">{{ receta.name }}</h1>
      <img :src="receta.imageUrl" alt="Imagen de la receta" class="recipe-image">
      <div class="recipe-description">
        <p>{{ receta.descripcionR }}</p>
      </div>
      <ul class="ingredient-list">
        <li v-for="(ingrediente, index) in receta.ingredientes" :key="index">{{ ingrediente }}</li>
      </ul>
  
      <!-- Botón de Me gusta -->
      <a-button @click="toggleLike" :loading="databaseStore.loading" :icon="[]">
        {{ receta.likes ? receta.likes.length : 0 }} ❤️
      </a-button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, defineProps } from 'vue';
  import { useDatabaseStore } from '../stores/database';
  
  const props = defineProps(['id']);
  const receta = ref({});
  const databaseStore = useDatabaseStore();
  
  onMounted(async () => {
    try {
      receta.value = await databaseStore.getNombreR(props.id);
  
      if (receta.value && receta.value.user) {
        receta.value.createdBy = await databaseStore.getUserById(receta.value.user);
      }
    } catch (error) {
      console.error('Error al cargar la receta:', error);
    }
  });
  
  const toggleLike = async () => {
    await databaseStore.toggleLike(props.id);
    // Actualiza la propiedad 'liked' en la receta
    receta.value.liked = !receta.value.liked;
  };
  </script>
  
  <style scoped>
  /* Estilos para la vista de RecipeCompleta */
  
  .recipe-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center; /* Para centrar el contenido */
  }
  
  .creator-info {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 20px;
  }
  
  .creator-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .creator-text {
    flex-grow: 1;
  }
  
  .recipe-title {
    margin-bottom: 10px;
  }
  
  .recipe-image {
    max-width: 50%;
    height: auto;
    margin-bottom: 20px;
  }
  
  .recipe-description {
    max-height: 250px; /* Altura máxima antes de activar el scroll */
    overflow-y: auto; /* Activar el scroll si se supera la altura máxima */
    margin-bottom: 20px;
  }
  
  .ingredient-list {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap; /* Hace que los ingredientes se muestren en una fila de 3 */
    justify-content: space-between; /* Espaciado entre los ingredientes */
  }
  
  .ingredient-list li {
    width: 30%; /* Ajustar el ancho para que haya tres elementos por fila */
    margin-bottom: 8px;
  }
  
  /* Estilos responsivos */
  @media screen and (max-width: 768px) {
    .recipe-container {
      padding: 10px;
    }
  
    .creator-avatar {
      width: 40px;
      height: 40px;
      margin-right: 8px;
    }
  
    .ingredient-list li {
      width: 100%; /* Mostrar un elemento por fila en dispositivos móviles */
    }
  }
  </style>