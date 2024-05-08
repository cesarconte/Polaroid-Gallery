<!-- FormResetPasswordInput.vue -->

<script setup>
  import { ref } from 'vue';

  const newPassword = ref('');
  const visible = ref(false);
  defineProps({
    divTxt: String,
    placeholder: String,
  });
</script>

<template>
  <v-text-field
    v-model="newPassword"
    :append-inner-icon="visible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
    :type="visible ? 'text' : 'password'"
    density="compact"
    :placeholder="placeholder"
    prepend-inner-icon="mdi-lock-outline"
    variant="outlined"
    @click:append-inner="visible = !visible"
    type="password"
    clearable
  ></v-text-field>
</template>
