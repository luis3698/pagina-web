<template>
    <div>
      <h1 class="text-center">Tus Recetas</h1>
  
      <add-form></add-form>
  
      <p v-if="databaseStore.loadingDoc">Loading docs...</p>
  
      <a-space direction="vertical" v-if="!databaseStore.loadingDoc" style="width: 100%;">
        <h1 class="text-center">Nueva Receta</h1>
        <a-card v-for="data in databaseStore.documents" :key="data.id" :title="data.name">
          <template #extra>
            <a-space>
              <a-popconfirm title="¿Estas seguro de eliminarlo?" ok-text="Si" cancel-text="No" @confirm="confirm(data.id)" @cancel="cancel">
                <a-button danger :loading="databaseStore.loading" :disabled="databaseStore.loading" shape="circle">
                  <template #icon>
                    <DeleteOutlined/>
                  </template>
                </a-button>
              </a-popconfirm>
              <a-button type="primary" ghost @click="router.push(`/editar/${data.id}`)" shape="circle">
                <template #icon>
                  <EditOutlined/>
                </template>
              </a-button>
              <a-button @click="copiarPortapeles(data.id, data.descripcionR, data.ingredientes)" shape="circle">
                <template #icon>
                  <CopyOutlined/>
                </template>
              </a-button>
            </a-space>
          </template>
          
          <p>{{ data.descripcionR }}</p>
          <p >Ingredientes</p>
          <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
            <a-col :span="24" :sm="12" :md="8" :lg="6" v-for="ingrediente in data.ingredientes" :key="ingrediente">
              <a-tag>{{ ingrediente }}</a-tag>
            </a-col>
          </a-row>
        </a-card> 
      </a-space>
    </div>
  </template>
  
  
  <script setup>
  import { useUserStore } from '../stores/user';
  import { useDatabaseStore } from '../stores/database';
  import { useRouter } from 'vue-router';
  import { message } from 'ant-design-vue';
  import { DeleteOutlined, EditOutlined, CopyOutlined } from '@ant-design/icons-vue';
  
  const userStore = useUserStore();
  const databaseStore = useDatabaseStore();
  const router = useRouter();
  
  databaseStore.getNombreRs();
  
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
  