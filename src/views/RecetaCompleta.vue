<template>
  <div class="recipe-container">
    <!-- Información del creador en la parte superior -->
    <div v-if="receta.createdBy" class="creator-info">
      <img :src="receta.createdBy.photoUrl" alt="Foto de perfil del creador" class="creator-avatar">
      <div class="creator-text">
        <p><strong>{{ receta.createdBy.displayName }}</strong></p>
      </div>
    </div>

    <h1 class="recipe-title">{{ receta.name }}</h1>
    <img :src="receta.imageUrl" alt="Imagen de la receta" class="recipe-image">
    <div class="recipe-description">
      <p class="justified-text">{{ receta.descripcionR }}</p>
    </div>
    <ul class="ingredient-list">
      <li v-for="(ingrediente, index) in receta.ingredientes" :key="index" class="ingredient-item">{{ ingrediente }}</li>
    </ul>

    <!-- Botón de Me gusta -->
    <a-button @click="toggleLike" :loading="databaseStore.loading" :icon="[]">
      {{ receta.likes ? receta.likes.length : 0 }} ❤️
    </a-button>

    <!-- Mostrar comentarios -->
    <div class="comments-section">
      <h2>Comentarios</h2>
      <div v-for="(comentario, index) in receta.comentarios" :key="index" class="comment-container">
        <!-- Línea divisoria entre comentarios -->
        <div v-if="index !== 0" class="divider"></div>
        <!-- Mostrar la foto del usuario que hizo el comentario -->
        <div class="comment-info">
          <img :src="comentario.usuario.photoUrl" alt="Foto de perfil del usuario" class="comment-avatar">
          <div class="comment-content">
            <div class="comment-header">
              <p class="comment-username"><strong>{{ comentario.usuario.displayName }}</strong></p>
            </div>
            <p class="comment-text">{{ comentario.texto }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Agregar comentario -->
    <div class="add-comment-section">
      <textarea v-model="nuevoComentario" placeholder="Añade un comentario" class="comment-input"></textarea>
      <a-button @click="agregarComentario" class="add-comment-button">Agregar Comentario</a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { useDatabaseStore } from '../stores/database';
import { auth } from '../firebaseConfig'; // Asegúrate de importar auth desde el lugar correcto

const props = defineProps(['id']);
const receta = ref({});
const nuevoComentario = ref('');
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

const agregarComentario = async () => {
  if (nuevoComentario.value.trim() !== '') {
    const usuarioActual = await databaseStore.getUserById(auth.currentUser.uid);
    await databaseStore.addComment(props.id, nuevoComentario.value);

    // Actualiza localmente la propiedad comentarios de la receta
    receta.value.comentarios.push({
      usuario: {
        displayName: usuarioActual.displayName,
        photoUrl: usuarioActual.photoUrl,
      },
      texto: nuevoComentario.value
    });

    // Limpia el área de texto después de agregar el comentario
    nuevoComentario.value = '';
  }
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

.creator-text p {
  margin: 0;
}

.recipe-title {
  margin-bottom: 10px;
}

.recipe-image {
  max-width: 70%;
  height: auto;
  margin-bottom: 20px;
}

.recipe-description {
  text-align: justify;
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

/* Línea divisoria entre comentarios */
.divider {
  border-top: 1px solid #ddd;
  margin: 15px 0;
}

.comments-section {
  margin-top: 30px;
}

.comment-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  padding-bottom: 1px;
}

.comment-info {
  display: flex;
  align-items: flex-start;
}

.comment-avatar {
  border-radius: 50%;
  margin-right: 10px;
  width: 40px; /* Tamaño ajustado */
  height: 40px; /* Tamaño ajustado */
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.comment-username {
  font-weight: bold;
  margin-bottom: 5px;
}

.comment-text {
  margin: 15px;
}


.add-comment-section {
  margin-top: 20px;
}

.comment-input {
  width: 100%;
  margin-bottom: 10px;
  padding: 5px;
}

.add-comment-button {
  width: 20%;
  background-color: primary;
}
</style>