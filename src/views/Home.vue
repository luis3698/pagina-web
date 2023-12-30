<template>
  <div>
    <h1 class="text-center">home</h1>


    <p v-if="databaseStore.loadingDoc">Loading docs...</p>

    <a-space direction="vertical" v-if="!databaseStore.loadingDoc" style="width: 100%;">
      <a-card v-for="data in databaseStore.documents" :key="data.id" :title="data.name">
        <template #extra>
          <a-space>
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

const userStore = useUserStore();
const databaseStore = useDatabaseStore();
const router = useRouter();

databaseStore.getNombreRs();





</script>
