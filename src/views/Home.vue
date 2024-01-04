<template>
  <div>
    <h1>Recetas de Todos los Usuarios</h1>

    <p v-if="databaseStore.loadingDoc">Cargando recetas...</p>

    <div class="recipe-grid" v-if="!databaseStore.loadingDoc">
      <a-card v-for="data in databaseStore.documents" :key="data.id" :title="data.name" class="recipe-card">
        <div class="recipe-content">
          <img :src="data.imageUrl" alt="Imagen de la receta" class="recipe-image">
          <a-button type="primary" @click="verRecetaCompleta(data)">Ver más</a-button>

          <!-- Botón de Me gusta -->
          <a class="like-button" @click="() => toggleLike(data.id)" :loading="databaseStore.loading" :icon="[]">
            {{ data.likes ? data.likes.length : 0 }} ❤️
          </a>
        </div>
      </a-card>
    </div>
  </div>
</template>


<script setup>
import { useDatabaseStore } from '../stores/database';
import { useRouter } from 'vue-router';
const databaseStore = useDatabaseStore();

// Obtener todas las recetas de todos los usuarios
databaseStore.getAllNombreRs();

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


const router = useRouter();
</script>



<style scoped>
/* Contenedor principal */
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Cambia a cuatro columnas por fila */
  gap: 20px; /* Espacio entre tarjetas */
  padding: 20px; /* Espacio extra en el contenedor principal */
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
.like-button {
  border: none; /* Elimina el borde del botón */
  background-color: transparent; /* Fondo transparente */
  cursor: pointer; /* Cambia el cursor al pasar sobre el botón */

  /* Agrega transiciones para efectos visuales */
  transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;
}

.like-button:hover {
  transform: scale(1.2); /* Efecto de escala al pasar sobre el botón */
  color: red; /* Cambia el color al pasar sobre el botón */
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
