<!-- CardText.vue -->

<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  cardText: {
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
  <v-card-text v-if="!hasHtml">
    <slot name="text" v-if="!hasHtml" />
    <!-- <slot v-else /> -->
    <span v-if="!hasHtml">{{ cardText }}</span>
  </v-card-text>
  <v-card-text v-else v-html="html" />
</template>
  

  