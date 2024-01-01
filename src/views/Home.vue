<template>
    <div>
        <h1>Recetas de Todos los Usuarios</h1>

        <p v-if="databaseStore.loadingDoc">Cargando recetas...</p>

        <a-space direction="vertical" v-if="!databaseStore.loadingDoc" style="width: 100%;">
            <a-card v-for="data in databaseStore.documents" :key="data.id" :title="data.name">
                <!-- Agrega aquí el contenido específico que deseas mostrar en cada tarjeta -->
                <p>{{ data.descripcionR }}</p>
                <p>Ingredientes</p>
                <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
                    <a-col :span="24" :sm="12" :md="8" :lg="6" v-for="ingrediente in data.ingredientes" :key="ingrediente">
                        <a-tag>{{ ingrediente }}</a-tag>
                    </a-col>
                </a-row>
                <img :src="data.imageUrl" alt="Imagen de la receta" style="max-width: 100%; margin-top: 10px;">
            </a-card>
        </a-space>
    </div>
</template>

<script setup>
import { useDatabaseStore } from '../stores/database';
const databaseStore = useDatabaseStore();

// Obtener todas las recetas de todos los usuarios
databaseStore.getAllNombreRs();
</script>
