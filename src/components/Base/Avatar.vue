<!-- Avatar.vue -->

<script setup>
import { computed } from 'vue';

const props = defineProps({
  avatarSize: {
    type: String,
    default: '',
  },
  avatarColor: {
    type: String,
    default: '',
  },
  avatarClass: {
    type: String,
    default: '',
  },
  avatarImage: {
    type: String,
    default: '',
  },
  avatarText: {
    type: String,
    default: '',
  },
});

const useStyles = computed(() => {
  return {
    width: props.size,
    height: props.size,
    backgroundColor: props.color,
  };
});
</script>

<template>
  <v-avatar :class="avatarClass" :size="avatarSize">
    <slot />
  </v-avatar>
</template>


