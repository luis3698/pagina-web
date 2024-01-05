<template>
  <div>
    <!-- Encabezado -->
    <h1>Recetas de Todos los Usuarios</h1>

    <!-- Barra de búsqueda -->
    <div class="search-container">
      <input type="text" v-model="searchTerm" placeholder="Buscar receta" class="search-input">
      <button type="primary" @click="searchRecipes" class="search-button">Buscar</button>
    </div>

  <p v-if="databaseStore.loadingDoc">Cargando recetas...</p>
    <!-- Contenedor de recetas -->
    <div class="recipe-grid" v-if="!databaseStore.loadingDoc">
      <!-- Tarjetas de receta -->
      <a-card v-for="data in filteredRecipes" :key="data.id" :title="data.name" class="recipe-card">
        <div class="recipe-content">
          <!-- Imagen de la receta -->
          <img :src="data.imageUrl" alt="Imagen de la receta" class="recipe-image">

          <!-- Botón para ver más detalles de la receta -->
          <a-button type="primary" @click="verRecetaCompleta(data)">Ver más</a-button>

          <!-- Botón de Me gusta -->
          <a class="like-button" @click="() => toggleLike(data.id)" :loading="databaseStore.loading" :icon="[]">
            <i class="heart-icon">❤️</i> {{ data.likes ? data.likes.length : 0 }}
          </a>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useDatabaseStore } from '../stores/database';
import { useRouter } from 'vue-router';

const databaseStore = useDatabaseStore();
const router = useRouter();

// Configuración para la búsqueda
const searchTerm = ref('');

// Filtrar recetas según el término de búsqueda
const filteredRecipes = ref([]);

// Función para buscar recetas
const searchRecipes = () => {
  const term = searchTerm.value.toLowerCase();
  if (term) {
    filteredRecipes.value = databaseStore.searchRecipesInStore(term);
  } else {
    filteredRecipes.value = databaseStore.documents;
  }
};

// Obtener todas las recetas de todos los usuarios
databaseStore.getAllNombreRs();

// Actualizar la lista filtrada cuando cambia la lista completa
watch(() => databaseStore.documents, () => {
  searchRecipes();
});

// Función para ver la receta completa
const verRecetaCompleta = (receta) => {
  // Implementa la lógica para mostrar la receta completa
  router.push({ name: 'recetaCompleta', params: { id: receta.id } });
};

// Asigna toggleLike del almacén a una variable local
const toggleLike = async (id) => {
  await databaseStore.toggleLike(id);
  // Actualiza la propiedad 'liked' en la receta correspondiente
  const index = databaseStore.documents.findIndex(item => item.id === id);
  databaseStore.documents[index].liked = !databaseStore.documents[index].liked;
};
</script>

<style scoped>
/* Contenedor principal */
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Cuatro columnas por fila por defecto */
  gap: 20px; /* Espacio entre tarjetas */
  padding: 20px; /* Espacio extra en el contenedor principal */
}
/* Barra de búsqueda */
.search-input {
  flex: 1; /* El input ocupa todo el espacio disponible */
  padding: 8px; /* Ajusta según sea necesario */
  border: 1px solid #ccc; /* Borde del input */
  border-radius: 4px; /* Bordes redondeados */
}

/* Botón de búsqueda */
.search-button {
  padding: 8px 16px; /* Ajusta según sea necesario */
  border: none; /* Elimina el borde del botón */
  border-radius: 4px; /* Bordes redondeados */
  background-color: #007bff; /* Color del botón */
  color: #fff; /* Color del texto del botón */
  cursor: pointer; /* Cambia el cursor al pasar sobre el botón */
}
.search-container {
  display: flex;
  gap: 10px; /* Espacio entre el input y el botón */
  margin-bottom: 20px; /* Ajusta según sea necesario */
}
/* Tarjeta de receta */
.recipe-card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
  box-sizing: border-box;
  overflow: hidden; /* Evita que el contenido sobresalga */
}

.recipe-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Contenido de la receta */
.recipe-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  box-sizing: border-box;
}

/* Imagen de la receta */
.recipe-image {
  width: 100%;
  height: auto;
  max-height: 100%; /* Ajusta según sea necesario */
  object-fit: cover; /* Ajusta el tamaño de la imagen sin distorsionarla */
}

/* Botón de ver receta completa */
a-button {
  width: 100%;
  margin-top: 10px; /* Ajusta según sea necesario */
}

/* Estilo para el botón de Me gusta */
.like-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px; /* Ancho del botón */
  height: 30px; /* Altura del botón */
  border-radius: 50%; /* Hace el botón redondo */
  border: none; /* Elimina el borde del botón */
  background-color: transparent; /* Fondo transparente */
  cursor: pointer; /* Cambia el cursor al pasar sobre el botón */
  transition: transform 0.2s ease-in-out, color 0.2s ease-in-out; /* Agrega transiciones para efectos visuales */
}

.like-button:hover {
  transform: scale(1.2); /* Efecto de escala al pasar sobre el botón */
  color: red; /* Cambia el color al pasar sobre el botón */
}

/* Estilo para el ícono del corazón */
.heart-icon {
  font-size: 16px; /* Tamaño del ícono del corazón */
}

</style>

<style scoped>
/* Estilos adicionales para hacerlo más responsive en tablets y celulares */
@media screen and (max-width: 768px) {
  .recipe-grid {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr)); /* Cambia a una columna en dispositivos más pequeños */
  }

  /* Botón de Me gusta */
  .like-button {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  /* Icono de Me gusta */
  .like-icon {
    color: red;  /* Color cuando está seleccionado */
  }

  .recipe-card {
    margin-bottom: 20px; /* Añade espacio entre tarjetas en dispositivos más pequeños */
  }
}
</style>
