<template>
    <div class="buscador-filtros">
      <input  type="text" placeholder="Buscar recetas...">
      
      <div class="filtros">
        <button>🍗 Pollo</button>
        <button>🍝 Pasta</button>
        <button>🥩 Carne</button>
        <button>🍚 Arroz</button>
        <button>🐟 Pescado</button>
        <button>🥦 Vegetales</button>
        <button>🍳 Desayuno</button>
        <button>🍲 Almuerzo</button>
        <button>🍛 Cena</button>
        <button>🍰 Postres</button>
      </div>
    </div>
  </template>
  
  <script setup>

  
  
  </script>
  
  <style scoped>
  .buscador-filtros {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background-color: #f0f0f0;
  }
  
  .filtros {
    display: flex;
    gap: 10px;
  }
  </style>