<template>
    <a-form name="addForm" autocomplete="off" layout="vertical" :model="formState" @finish="onFinish">
        <!-- Expresiones regulares para nombreR -->
        <a-form-item name="nombreR" label="Ingrese una RECETA"
            :rules="[{ required: true, whitespace: true,  message: 'Ingresa una RECETA válida' }]">
            <a-input v-model:value="formState.nombreR" placeholder="https://antdv.com/components/icon" enter-button>
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
        

        <a-form-item>
            <a-button type="primary" html-type="submit" :loading="databaseStore.loading"
                :disabled="databaseStore.loading">Agregar post</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup>
import { reactive } from 'vue';
import { useDatabaseStore } from '../stores/database';
import { message } from 'ant-design-vue';
import { ChromeOutlined } from '@ant-design/icons-vue';

const databaseStore = useDatabaseStore();

const formState = reactive({
    nombreR: '',
    descripcionR: '' // Agregamos el campo descripcionR al estado del formulario
});

const onFinish = async (value) => {
    const result = await databaseStore.addNombreR(formState.nombreR, formState.descripcionR);

    if (!result) {
        formState.nombreR = '';
        formState.descripcionR = ''; // Limpiamos el campo descripcionR después de agregar
        return message.success('Se ha agregado la nombreR');
    }

    message.error('Ocurrio un error en el servidor');
}
</script>
