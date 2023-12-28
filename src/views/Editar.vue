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
    descripcionR: '' // Agregamos el campo descripcionR al estado del formulario
});

const onFinish = async () => {
    const result = await databaseStore.updateNombreR(route.params.id, formState.nombreR, formState.descripcionR);

    if (!result) {
        formState.nombreR = '';
        formState.descripcionR = ''; // Limpiamos el campo descripcionR después de editar
        return message.success('Se cambió correctamente ');
    }

    message.error('Ocurrió un error en el servidor');
}

onMounted(async () => {
    const data = await databaseStore.leerNombreR(route.params.id);
    formState.nombreR = data.name;
    formState.descripcionR = data.descripcionR || ''; // Aseguramos que descripcionR esté presente, incluso si es null
});
</script>

<style scoped></style>
