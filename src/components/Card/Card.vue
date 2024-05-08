<!-- Card.vue -->

<script setup>
  import CardImage from './Base/CardImage.vue';
  import CardInfo from './Base/CardInfo.vue';

  const { card, user } = defineProps(['card', 'user']);
</script>

<template>
  <v-card
    class="pa-3"
    hover
  >
    <CardImage
      :card="card"
      :user="user"
    />
    <CardInfo
      :card="card"
      :user="user"
    />
  </v-card>
</template>
