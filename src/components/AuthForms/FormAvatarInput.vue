<!--AvatarInput.vue-->

<script setup>
  import { onAvatarChange } from '@/services/Auth/authService';

  defineProps({
    divTxt: String,
  });

  const rules = [
    (value) => {
      return (
        !value ||
        !value.length ||
        value[0].size < 2000000 ||
        'Avatar size should be less than 2 MB!'
      );
    },
  ];
</script>

<template>
  <div class="text-subtitle-1 text-medium-emphasis">{{ divTxt }}</div>
  <v-file-input
    :rules="rules"
    type="file"
    name="file"
    label="Select an image"
    id="file"
    accept="image/*"
    required
    show-size
    prepend-icon="mdi-camera"
    @change="onAvatarChange"
  ></v-file-input>
</template>
