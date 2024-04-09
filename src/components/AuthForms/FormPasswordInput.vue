<!-- FormPasswordInput.vue -->

<script setup>
import { ref } from 'vue';
import { userData } from '@/services/User/userDataService';

const visible = ref(false);
defineProps({
  divTxt: String,
  placeholder: String,
})
</script>

<template>
  <div class="text-subtitle-1 text-medium-emphasis">{{ divTxt }}</div>
  <v-text-field v-model="userData.password" :append-inner-icon="visible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
    :type="visible ? 'text' : 'password'" density="compact" :placeholder="placeholder"
    prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible" type="password"
    clearable></v-text-field>
</template>
