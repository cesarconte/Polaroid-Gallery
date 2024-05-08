<!-- FormNameLastNameInput.vue -->

<script setup>
  import { defineModel } from 'vue';

  const [model] = defineModel();

  defineProps({
    labelText: String,
    placeholder: String,
    density: String,
    prependInnerIcon: String,
    variant: String,
    clearable: Boolean,
  });
</script>

<template>
  <div class="text-subtitle-1 text-medium-emphasis">{{ labelText }}</div>
  <v-text-field
    v-model="model"
    :placeholder="placeholder"
    :density="density"
    :prepend-inner-icon="prependInnerIcon"
    :variant="variant"
    :clearable="clearable"
  />
</template>
