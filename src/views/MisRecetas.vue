<template>
  <div>
    <h1 class="text-center">Mis recetas</h1>

    <add-form></add-form>

    <p v-if="databaseStore.loadingDoc">Loading docs...</p>

    <a-space direction="vertical" v-if="!databaseStore.loadingDoc" style="width: 100%;">
      <a-card v-for="data in userRecipes" :key="data.id" :title="data.name" class="recipe-card">
        <template #extra>
          <a-space>
            <a-popconfirm title="¿Estás seguro de eliminarlo?" ok-text="Sí" cancel-text="No" @confirm="confirm(data.id)" @cancel="cancel">
              <a-button danger :loading="databaseStore.loading" :disabled="databaseStore.loading" shape="circle">
                <template #icon>
                  <DeleteOutlined />
                </template>
              </a-button>
            </a-popconfirm>
            <a-button type="primary" ghost @click="router.push(`/editar/${data.id}`)" shape="circle">
              <template #icon>
                <EditOutlined />
              </template>
            </a-button>
            <a-button @click="copiarPortapeles(data.id, data.descripcionR, data.ingredientes)" shape="circle">
              <template #icon>
                <CopyOutlined />
              </template>
            </a-button>
          </a-space>
        </template>
        <p class="recipe-description">{{ data.descripcionR }}</p>
        <p>Ingredientes</p>
        <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
          <a-col :span="24" :sm="12" :md="8" :lg="6" v-for="ingrediente in data.ingredientes" :key="ingrediente">
            <a-tag class="ingredient-tag">{{ ingrediente }}</a-tag>
          </a-col>
        </a-row>
        <img :src="data.imageUrl" alt="Imagen de la receta" class="recipe-image">
      </a-card>
    </a-space>
  </div>
</template>

<script setup>

import { computed } from 'vue';
import { useUserStore } from '../stores/user';
import { useDatabaseStore } from '../stores/database';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { DeleteOutlined, EditOutlined, CopyOutlined } from '@ant-design/icons-vue';

const userStore = useUserStore();
const databaseStore = useDatabaseStore();
const router = useRouter();

// Obtener las recetas del usuario actual
databaseStore.getNombreRs();

const userRecipes = computed(() => {
  return databaseStore.documents.filter(doc => doc.user === userStore.userData.uid);
});

const confirm = async (id) => {
  const result = await databaseStore.deleteNombreR(id);

  if (!result) {
    return message.success('Se eliminó con éxito');
  }
  return message.error(result);
};

const cancel = () => {
  message.error('No se eliminó');
};

const copiarPortapeles = async (id, descripcionR, ingredientes) => {
  if (!navigator.clipboard) {
    return message.error('No tiene portapapeles');
  }

  const path = `${window.location.origin}/${id}\n${descripcionR}\nIngredientes: ${ingredientes.join(', ')}`;

  const err = await navigator.clipboard.writeText(path);

  if (err) {
    message.error("Ocurrió un error");
  } else {
    message.success("nombreR, descripcionR e ingredientes copiados");    
  }
};
</script>


<style scoped>
/* Ajustes de estilo para las tarjetas de recetas */
.recipe-card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
  box-sizing: border-box;
  overflow: hidden; /* Evita que el contenido sobresalga */
  height: 100%; /* Hace que las tarjetas tengan la misma altura */
  margin-bottom: 16px; /* Ajuste de margen inferior */
}

.recipe-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Estilo para las imágenes de recetas */
.recipe-image {
  width: 30%; /* Cambiado para ocupar el ancho completo */
  height: auto;
  object-fit: cover; /* Ajusta el tamaño de la imagen sin distorsionarla */
  margin-top: 10px;
}

/* Estilos adicionales para las etiquetas de ingredientes */
.ingredient-tag {
  margin-bottom: 8px;
  font-size: 14px;
  background-color: #f0f0f0;
}

/* Estilo para la descripción de la receta justificada */
.recipe-description {
  text-align: justify;
}
</style>
