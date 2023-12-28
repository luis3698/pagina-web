<!-- VueformMultiselect.vue -->

<template>
    <div>
      <vueform-multiselect
        v-model="selectedValues"
        :options="options"
        :multiple="true"
        :searchable="true"
        :clearOnSelect="false"
        :placeholder="placeholder"
      />
    </div>
  </template>
  
  <script>
  export default {
    props: {
      value: {
        type: Array,
        default: () => [],
      },
      options: {
        type: Array,
        required: true,
      },
      placeholder: {
        type: String,
        default: "Select",
      },
    },
    data() {
      return {
        selectedValues: this.value,
      };
    },
    watch: {
      value(newVal) {
        this.selectedValues = newVal;
      },
    },
    methods: {
      emitInput() {
        this.$emit("input", this.selectedValues);
      },
    },
    watch: {
      selectedValues() {
        this.emitInput();
      },
    },
  };
  </script>
  
  <style scoped>
  /* Agrega estilos según tus necesidades */
  </style>
  