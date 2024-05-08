<!-- Button.vue -->

<script setup>
  const props = defineProps({
    handleSign: {
      type: Function,
    },
    btnColor: {
      type: String,
      default: '',
    },
    btnText: {
      type: String,
    },
    btnSize: {
      type: String,
      default: 'large',
    },
    iconClass: {
      type: String,
    },
    icon: {
      type: String,
    },
    iconSize: {
      type: Number,
      default: 24,
    },
    prependIcon: {
      type: String,
      default: '',
    },
    appendIcon: {
      type: String,
      default: '',
    },
  });
</script>

<template>
  <v-btn
    :size="btnSize"
    :color="btnColor"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :icon="icon"
    @click="handleSign"
  >
    <template v-slot:prepend>
      <v-icon
        v-if="prependIcon"
        :size="iconSize"
        :class="iconClass"
      >
        {{ prependIcon }}
      </v-icon>
    </template>
    {{ btnText }}
    <template v-slot:append>
      <v-icon
        v-if="appendIcon"
        :size="iconSize"
        :class="iconClass"
      >
        {{ appendIcon }}
      </v-icon>
    </template>
    <slot />
  </v-btn>
</template>
