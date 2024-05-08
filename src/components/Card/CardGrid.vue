<!-- CardGrid.vue -->

<script setup>
  import Card from '@/components/Card/Card.vue';
  import Button from '../Base/Button.vue';
  import {
    initializeCardListener,
    cards,
    loadMoreCards,
    lastVisible,
    hasMoreCards,
  } from '@/services/Card/cardService';
  import { onMounted } from 'vue';
  import { useGoTo, useDisplay } from 'vuetify';

  const goTo = useGoTo();
  const { smAndDown } = useDisplay();

  onMounted(async () => {
    await initializeCardListener();
  });

  async function handleLoadMoreCards() {
    await loadMoreCards();
    if (!lastVisible.value) {
      hasMoreCards.value = false;
    } else {
      hasMoreCards.value = true;
    }
  }

  async function backToTop() {
    goTo('app', { duration: 500, easing: 'linear' });
  }
</script>

<template>
  <v-row class="my-4">
    <v-col
      cols="12"
      sm="8 mx-auto"
      md="6"
      lg="4"
      v-for="card in cards"
      :key="card.id"
    >
      <Card :card="card" />
    </v-col>
  </v-row>
  <div :class="smAndDown ? 'd-block text-center' : 'd-flex ml-16'">
    <Button
      v-if="hasMoreCards"
      class="text-none mb-4 mx-auto"
      size="x-large"
      variant="tonal"
      rounded="xl"
      appendIcon="mdi-reload"
      btnText="Load more polaroids"
      @click="handleLoadMoreCards"
    >
    </Button>
    <Button
      v-else
      class="text-none mb-4 mx-auto btn-backToTop"
      size="x-large"
      variant="tonal"
      rounded="xl"
      appendIcon="mdi-arrow-collapse-up"
      btnText="No more polaroids, back to top"
      @click="backToTop"
    >
    </Button>

    <div
      v-show="hasMoreCards"
      class="pr-4"
    >
      <Button
        v-if="smAndDown"
        variant="tonal"
        class="text-none rounded-pill"
        :class="smAndDown ? 'd-flex mx-auto mt-4' : ''"
        prependIcon="mdi-arrow-collapse-up"
        btnText="Go to top"
        @click="backToTop"
      >
      </Button>
      <Button
        v-else
        variant="tonal"
        @click="backToTop"
        icon=""
      >
        <v-icon>mdi-arrow-collapse-up</v-icon>
        <v-tooltip
          activator="parent"
          location="bottom"
          >Go to top</v-tooltip
        >
      </Button>
    </div>
  </div>
</template>
