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
    descripcionR: '',
    ingredientes: [] // Agregamos el campo ingredientes al estado del formulario
  });
  
  const listaDeIngredientes = ['Ingrediente1', 'Ingrediente2', 'Ingrediente3']; // Puedes cargar esta lista dinámicamente
  
  const onFinish = async (value) => {
    const result = await databaseStore.addNombreR(formState.nombreR, formState.descripcionR, formState.ingredientes);
  
    if (!result) {
      formState.nombreR = '';
      formState.descripcionR = '';
      formState.ingredientes = []; // Limpiamos el campo ingredientes después de agregar
      return message.success('Se ha agregado la nombreR');
    }
  
    message.error('Ocurrió un error en el servidor');
  }
  </script>
  