<!-- CardSubtitle.vue -->

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    subtitleText: {
      type: String,
      default: '',
    },
    html: {
      type: String,
      default: '',
    },
  });

  const hasHtml = computed(() => props.html.length > 0);
</script>

<template>
  <v-card-subtitle>
    <slot
      name="subtitle"
      v-if="!hasHtml"
    />
    <!-- <slot v-else /> -->
    <span v-if="!hasHtml">{{ subtitleText }}</span>
  </v-card-subtitle>
</template>
