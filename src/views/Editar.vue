<template>
    <h1>Editar id: {{ route.params.id }}</h1>
    <a-form name="editForm" autocomplete="off" layout="vertical" :model="formState" @finish="onFinish">
        <!-- Expresiones regulares para nombreR -->
        <a-form-item name="nombreR" label="Ingrese una nombreR"
            :rules="[{ required: true, whitespace: true, message: 'Ingresa una nombreR válida' }]">
            <a-input v-model:value="formState.nombreR" placeholder="https://antdv.com/components/icon" enter-button>
                <template #prefix>
                    <ChromeOutlined />
                </template>
            </a-input>
        </a-form-item>
        <!-- Expresiones regulares para descripcionR (agregado) -->
        <a-form-item name="descripcionR" label="Ingrese una descripción">
            <a-input v-model:value="formState.descripcionR" placeholder="Ingrese una descripción" enter-button>
                <!-- Puedes agregar un ícono específico para la descripción si lo deseas -->
            </a-input>
        </a-form-item>
        <!-- Agregado: Multi-Select para ingredientes -->
        <a-form-item name="ingredientes" label="Seleccione ingredientes">
            <a-select
                v-model:value="formState.ingredientes"
                mode="tags"
                placeholder="Seleccione o agregue ingredientes"
            >
                <!-- Puedes cargar dinámicamente la lista de ingredientes si es necesario -->
                <a-select-option v-for="ingrediente in listaDeIngredientes" :key="ingrediente">
                    {{ ingrediente }}
                </a-select-option>
            </a-select>
        </a-form-item>
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
            <a-button type="primary" html-type="submit" :loading="databaseStore.loading"
                :disabled="databaseStore.loading">Editar nombreR</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDatabaseStore } from '../stores/database';
import { reactive } from 'vue';
import { message } from 'ant-design-vue';
import { ChromeOutlined } from '@ant-design/icons-vue';

const route = useRoute();
const databaseStore = useDatabaseStore();
const formState = reactive({
    nombreR: '',
    descripcionR: '',
    ingredientes: [],
    imageFile: null  // Agrega el campo imageFile al estado del formulario
});

const listaDeIngredientes = ['Ingrediente1', 'Ingrediente2', 'Ingrediente3'];

const onFinish = async () => {
    const result = await databaseStore.updateNombreRWithImage(route.params.id, formState.nombreR, formState.descripcionR, formState.ingredientes, formState.imageFile);

    if (!result) {
        formState.nombreR = '';
        formState.descripcionR = '';
        formState.ingredientes = [];
        formState.imageFile = null;  // Limpia el campo imageFile después de editar
        return message.success('Se cambió correctamente ');
    }

    message.error('Ocurrió un error en el servidor');
}

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

const customRequest = async ({ file, onSuccess, onError }) => {
    try {
        formState.imageFile = file;
        onSuccess();
    } catch (error) {
        console.error(error);
        onError();
    }
};

onMounted(async () => {
    const data = await databaseStore.leerNombreR(route.params.id);
    formState.nombreR = data.name;
    formState.descripcionR = data.descripcionR || '';
    formState.ingredientes = data.ingredientes || [];
});
</script>

<style scoped></style>
