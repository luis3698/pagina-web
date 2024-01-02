<template>
  <a-form name="addForm" autocomplete="off" layout="vertical" :model="formState" @finish="onFinish">
    <!-- Expresiones regulares para nombreR -->
    <a-form-item name="nombreR" label="Ingrese una receta"
      :rules="[{ required: true, whitespace: true,  message: 'Ingresa una receta válida' }]">
      <a-input v-model:value="formState.nombreR" placeholder="Nombre de la receta" enter-button>
        <template #prefix>
          <ChromeOutlined/>
        </template>
      </a-input>
    </a-form-item>

    <!-- Expresiones regulares para descripcionR -->
    <a-form-item name="descripcionR" label="Ingrese una descripción"
      :rules="[{ required: true, whitespace: true,  message: 'Ingresa una descripción válida' }]">
      <a-textarea v-model:value="formState.descripcionR" placeholder="Ingrese una descripción" enter-button>
        <!-- Puedes agregar un ícono específico para la descripción si lo deseas -->
      </a-textarea>
    </a-form-item>

    <!-- Nuevo a-form-item para ingredientes -->
    <a-form-item name="ingredientes" label="Agregar ingredientes">
      <a-select
        v-model:value="formState.ingredientes"
        mode="tags"
        placeholder="Selecciona o agrega ingredientes"
      >
        <!-- Aquí puedes cargar dinámicamente la lista de ingredientes si es necesario -->
        <a-select-option v-for="ingrediente in listaDeIngredientes" :key="ingrediente">
          {{ ingrediente }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <!-- Nuevo a-form-item para cargar imágenes -->
    <!-- Nuevo a-form-item para cargar imágenes -->
<a-form-item name="image" label="Selecciona una imagen">
  <a-upload
    :before-upload="beforeUpload"
    :customRequest="customRequest"
    :showUploadList="false"
  >
    <a-button icon="upload">Seleccionar Imagen</a-button>
  </a-upload>
</a-form-item>


    <a-form-item>
      <a-button type="primary" html-type="submit" :loading="databaseStore.loading" :disabled="databaseStore.loading">Agregar post</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useDatabaseStore } from '../stores/database';
import { message } from 'ant-design-vue';
import { ChromeOutlined } from '@ant-design/icons-vue';

const databaseStore = useDatabaseStore();

const formState = reactive({
  nombreR: '',
  descripcionR: '',
  ingredientes: [],
  imageFile: null  // Agrega el campo imageFile al estado del formulario
});

const listaDeIngredientes = [''];

const onFinish = async () => {
  const result = await databaseStore.addNombreRWithImage(formState.nombreR, formState.descripcionR, formState.ingredientes, formState.imageFile);

  if (!result) {
    formState.nombreR = '';
    formState.descripcionR = '';
    formState.ingredientes = [];
    formState.imageFile = null;  // Limpia el campo imageFile después de agregar
    return message.success('Se ha agregado la nombreR con imagen');
  }

  message.error('Ocurrió un error en el servidor');
};

// Función para validar y mostrar un mensaje antes de cargar la imagen
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('Solo puedes subir archivos de imagen!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('La imagen debe ser más pequeña que 2MB!');
  }
  return isImage && isLt2M;
};

// Función personalizada para cargar la imagen
const customRequest = async ({ file, onSuccess, onError }) => {
  try {
    formState.imageFile = file;
    onSuccess();
  } catch (error) {
    console.error(error);
    onError();
  }
};
</script>
