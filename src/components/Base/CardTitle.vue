<!-- CardTitle.vue -->

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  titleText: {
    type: String,
    default: "",
  },
  html: {
    type: String,
    default: "",
  },
});

const hasHtml = computed(() => props.html.length > 0);
</script>

<template>
  <v-card-title>
    <slot name="title" v-if="!hasHtml" />
    <!-- <slot v-else /> -->
    <span v-if="!hasHtml">{{ titleText }}</span>
  </v-card-title>
</template>

