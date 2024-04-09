<!-- RouterLink.vue -->

<script setup>
import Button from '@/components/Base/Button.vue';

defineProps({
  to: String,
  btnText: String,
});

</script>

<template>
  <RouterLink :to="to">
    <slot />
  </RouterLink>
</template>



  