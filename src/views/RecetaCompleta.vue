<template>
    <div class="receta-container">
        <!-- Información del creador en la parte superior -->
        <div v-if="receta.createdBy" class="creador-info">
            <img :src="receta.createdBy.photoUrl" alt="Foto de perfil del usuario" class="creador-avatar">
            <div class="creador-text">
                <p>{{ receta.createdBy.displayName }}</p>
            </div>
        </div>

        <h1>{{ receta.name }}</h1>
        <img :src="receta.imageUrl" alt="Imagen de la receta" class="receta-image">
        <p>{{ receta.descripcionR }}</p>
        <ul>
            <li v-for="(ingrediente, index) in receta.ingredientes" :key="index">{{ ingrediente }}</li>
        </ul>
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
</script>

<style scoped>
/* Estilos para la vista de RecetaCompleta */

.receta-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.creador-info {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 20px;
}

.creador-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}

.creador-text {
    flex-grow: 1;
}

.receta-image {
    max-width: 100%;
    height: auto;
    margin-bottom: 20px;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    margin-bottom: 8px;
}

/* Estilos responsivos */
@media screen and (max-width: 768px) {
    .receta-container {
        padding: 10px;
    }

    .creador-avatar {
        width: 40px;
        height: 40px;
        margin-right: 8px;
    }
}
</style>
