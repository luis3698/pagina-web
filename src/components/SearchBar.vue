<template>
  <div class="search-container">
    <a-input :style="{ width: '264px', marginRight: '16px' }" v-model="searchTerm" placeholder="Buscar receta" />
    <a-button type="primary" @click="() => searchRecipes(searchTerm.value)">Buscar</a-button>
  </div>
</template>

<script setup>

</script>
