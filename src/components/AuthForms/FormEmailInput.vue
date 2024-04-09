<!-- FormEmailInput-->

<script setup>
import { userData } from '@/services/User/userDataService';

defineProps({
  divTxt: String,
})
</script>

<template>
  <div class="text-subtitle-1 text-medium-emphasis">{{ divTxt }}</div>
  <v-text-field
    v-model="userData.email"
    density="compact"
    placeholder="Email address"
    prepend-inner-icon="mdi-email-outline"
    variant="outlined"
    type="email"
    clearable></v-text-field>
</template>


  