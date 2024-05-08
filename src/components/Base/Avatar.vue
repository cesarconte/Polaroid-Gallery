<!-- Avatar.vue -->

<script setup>
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
</script>

<template>
  <v-avatar
    :class="avatarClass"
    :size="avatarSize"
  >
    <slot />
  </v-avatar>
</template>
