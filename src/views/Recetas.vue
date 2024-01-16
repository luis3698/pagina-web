<template>
    <div class="recipe-app">

      <header class="app-header">
        <h1>Recetas de la Comunidad</h1>
        <div class="search-container">
          <input v-model="searchTerm" placeholder="Buscar receta" class="search-input" />
          <button @click="searchRecipes" class="search-button">Buscar</button>
        </div>
      </header>
  
      <section class="recipe-container">
        <div v-if="databaseStore.loadingDoc" class="loading-message">Cargando recetas...</div>
        <div v-else>
          <div v-if="filteredRecipes.length === 0" class="no-results-message">No se encontraron recetas.</div>
          <div class="recipe-grid" v-else>
            <div v-for="recipe in filteredRecipes" :key="recipe.id" class="recipe-card">
              <img :src="recipe.imageUrl" alt="Imagen de la receta" class="recipe-image" />
              <div class="recipe-details">
                <div class="title-container">
                  <h2>{{ recipe.name }}</h2>
                </div>
                <p>{{ recipe.description }}</p>
              </div>
              <div class="recipe-actions">
                <button @click="toggleLike(recipe.id)" :class="{ liked: recipe.liked }" class="like-button">
                  <i class="heart-icon">❤️</i> {{ recipe.likes ? recipe.likes.length : 0 }}
                </button>
  
                
                <router-link :to="{ name: 'recetaCompleta', params: { id: recipe.id }}" class="view-button">Ver más</router-link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { useDatabaseStore } from '../stores/database';
  import { useRouter } from 'vue-router';
  
  
  const databaseStore = useDatabaseStore();
  const router = useRouter();
  
  const searchTerm = ref('');
  const filteredRecipes = ref([]);
  
  const searchRecipes = () => {
    const term = searchTerm.value.toLowerCase();
    if (term) {
      filteredRecipes.value = databaseStore.searchRecipesInStore(term);
    } else {
      filteredRecipes.value = databaseStore.documents;
    }
  };
  
  databaseStore.getAllNombreRs();
  
  watch(() => databaseStore.documents, () => {
    searchRecipes();
  });
  
  const toggleLike = async (id) => {
    await databaseStore.toggleLike(id);
    const index = databaseStore.documents.findIndex(item => item.id === id);
    databaseStore.documents[index].liked = !databaseStore.documents[index].liked;
  };
  </script>
  
  <style scoped>
  .recipe-app {
    font-family: 'Arial', sans-serif;
    max-width: 100%;
    margin: 0 auto;
    background-color: #ffffff00; /* Cambia este color según tus preferencias */
  }
  
  .app-header {
    background-color: #f79f1b;
    color: #242636;
    padding: 20px;
    text-align: center;
  }
  
  .search-container {
    margin-top: 20px;
  }
  
  .search-input {
    padding: 10px;
    width: 70%;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
  }
  
  .search-button {
    padding: 10px 20px;
    background-color: #242636;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .recipe-container {
    padding: 20px;
  }
  
  .loading-message, .no-results-message {
    text-align: center;
    margin-top: 20px;
  }
  
  .recipe-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .recipe-card {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .recipe-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 10px; /* Bordes redondos */
  }
  
  .recipe-details {
    flex: 1;
    padding: 15px;
    max-height: 100px; /* ajusta este valor según sea necesario */
    overflow: hidden;
  }
  
  .title-container {
    margin-bottom: 10px;
  }
  
  .title-container h2 {
    font-size: 1.2rem;
    margin: 0;
  }
  
  .recipe-details p {
    font-size: 1rem;
    color: #555;
    margin-bottom: 15px;
  }
  
  .recipe-actions {
    display: flex;
    justify-content: space-between;
    align-items: center; /* Centra verticalmente el contenido */
    margin-top: 10px; /* Añade espacio entre el contenido y los botones */
  }
  
  .view-button {
    padding: 10px 20px;
    background-color: #242636;
    color: #fff;
    border: none;
    border-radius: 5px;
    text-decoration: none;
    cursor: pointer;
  }
  
  .like-button {
    display: flex;
    align-items: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
  
  .like-button i {
    margin-right: 5px;
    color: red;
  }
  
  .like-button.liked i {
    color: #ff4500;
  }
  </style>
  
