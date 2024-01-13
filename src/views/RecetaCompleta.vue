<template>
  <div class="recipe-container">
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

    <div class="interactions-section">
      <a-button @click="toggleLike" :loading="databaseStore.loading" :icon="[]">
        {{ receta.likes ? receta.likes.length : 0 }} ❤️
      </a-button>

      <div class="comments-section">
        <h2>Comentarios</h2>
        <div v-for="(comentario, index) in receta.comentarios" :key="index" class="comment-container">
          <div v-if="index !== 0" class="divider"></div>
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

      <div class="add-comment-section">
        <textarea v-model="nuevoComentario" placeholder="Añade un comentario" class="comment-input"></textarea>
        <a-button @click="agregarComentario" class="add-comment-button">Agregar Comentario</a-button>
      </div>
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
.recipe-container {
  max-width: 90%;
  margin: 0 auto;
  padding: 20px;
  
  color: #000000;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
  border-radius: 8px;
}

.recipe-description {
  text-align: justify;
  max-height: 250px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.ingredient-list {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.ingredient-list li {
  width: 30%;
  margin-bottom: 8px;
}

.interactions-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.comments-section {
  margin-top: 20px;
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
  width: 40px;
  height: 40px;
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
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #ffffff;
  color: #242636;
}

.add-comment-button {
  width: 100%;
  background-color: #f79f1b;
  color: #ffffff;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-comment-button:hover {
  background-color: #e88b10;
}

.divider {
  border-top: 1px solid #ddd;
  margin: 15px 0;
}
</style>