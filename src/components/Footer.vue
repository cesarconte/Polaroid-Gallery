<!-- Footer.vue -->

<script setup>
import { ref, computed } from 'vue';

const icons = ref(['linkedin', 'github']);

function getIcon(icon) {
  return `mdi-${icon}`;
}

function getLink(icon) {
  const links = {
    linkedin: 'https://www.linkedin.com/in/cesarconteperez',
    github: 'https://github.com/cesarconte',
  };
  return links[icon];
}

const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
  <v-footer class="bg-grey-darken-4 d-flex flex-column pa-0">
    <div class="text-center pt-2">
      <strong>Get connected with me on social networks!</strong>
    </div>
    <div class="text-center">
      <v-btn v-for="icon in icons" :key="icon" :icon="getIcon(icon)" variant="plain" :href="getLink(icon)"
        target="_blank">
      </v-btn>
    </div>
    <div class="px-4 py-2 bg-navbar text-center">
      {{ currentYear }} - <strong>Polaroid Gallery</strong>
      <v-spacer></v-spacer>
      Powered by:
      <v-btn href="https://vuejs.org/" target="_blank" variant="plain" class="text-none text-green-accent-1 rounded-pill" prepend-icon="mdi-vuejs">
        <strong>Vue</strong>
      </v-btn>
      <span>-</span>
      <v-btn href="https://vuetifyjs.com/" target="_blank" variant="plain" class="text-none text-light-blue-accent-1 rounded-pill" prepend-icon="mdi-vuetify">
        <strong>Vuetify</strong>
      </v-btn>
      <span>-</span>
      <v-btn href="https://firebase.google.com/" target="_blank" variant="plain" class="text-none text-yellow-darken-1 rounded-pill" prepend-icon="mdi-firebase">
        <strong>Firebase</strong>
      </v-btn>
    </div>
  </v-footer>
</template>
