<!-- HomeView.vue -->

<script setup>
  import { useUserInfo } from '@/services/User/userService';
  import { userData } from '@/services/User/userDataService';
  import CardGrid from '@/components/Card/CardGrid.vue';
  import Button from '@/components/Base/Button.vue';
  import { initializeCardListener } from '@/services/Card/cardService';
  import { onMounted, mergeProps } from 'vue';
  import { useGoTo, useDisplay } from 'vuetify';

  const { smAndDown, mdAndUp } = useDisplay();
  const goTo = useGoTo();

  onMounted(async () => {
    await initializeCardListener();
  });

  const { isLoggedIn } = useUserInfo();

  async function backToBottom() {
    goTo('footer', { duration: 500, easing: 'linear' });
  }

  async function backToTop() {
    goTo('app', { duration: 500, easing: 'linear' });
  }
</script>

<template>
  <v-responsive>
    <v-container fluid>
      <v-container
        fluid
        :class="smAndDown ? 'd-block' : 'd-flex justify-space-between'"
      >
        <h1 v-if="isLoggedIn">
          Welcome back to Polaroid Gallery, {{ userData.fullName }}!
        </h1>
        <h1 v-else>Welcome to Polaroid Gallery!</h1>
        <v-tooltip
          v-if="mdAndUp"
          key="goToBottom-tooltip"
          location="bottom"
        >
          <template v-slot:activator="{ props: tooltip }">
            <Button
              v-bind="mergeProps(tooltip)"
              variant="tonal"
              class="pr-0"
              @click="backToBottom"
              icon=""
            >
              <v-icon>mdi-arrow-collapse-down</v-icon>
            </Button>
          </template>
          <span>Go to bottom</span>
        </v-tooltip>
        <Button
          v-else
          variant="tonal"
          :class="smAndDown ? 'd-flex mx-auto mt-4' : ''"
          class="text-none rounded-pill"
          prependIcon="mdi-arrow-collapse-down"
          btnText="Go to bottom"
          @click="backToBottom"
        >
        </Button>
      </v-container>
      <CardGrid />
      <!-- Navigation to top/bottom buttons -->
      <Button
        color="primary"
        variant="elevated"
        class="btnBackToTop"
        icon=""
        @click="backToTop"
      >
        <v-icon>mdi-chevron-up</v-icon>
      </Button>
      <Button
        color="primary"
        variant="elevated"
        class="btnBackToBottom"
        icon=""
        @click="backToBottom"
      >
        <v-icon>mdi-chevron-down</v-icon>
      </Button>
    </v-container>
  </v-responsive>
</template>

<style scoped>
  .btnBackToTop {
    position: fixed;
    bottom: 90px;
    right: 20px;
    z-index: 100;
  }

  .btnBackToBottom {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 100;
  }
</style>
