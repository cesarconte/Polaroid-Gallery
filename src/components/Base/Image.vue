<!-- Image.vue -->

<script setup>
  const props = defineProps({
    class: {
      type: String,
      default: '',
    },
    imgSrc: {
      type: String,
      default: '',
    },
    imgAlt: {
      type: String,
      default: '',
    },
    imgWidth: {
      type: String,
      default: '',
    },
    imgHeight: {
      type: String,
      default: '',
    },
  });
</script>

<template>
  <v-img
    :class="class"
    :src="imgSrc"
    :alt="imgAlt"
    :width="imgWidth"
    :height="imgHeight"
  >
    <slot />
  </v-img>
</template>
