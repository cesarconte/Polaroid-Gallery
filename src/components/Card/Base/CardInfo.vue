<!-- CardInfo.vue-->

<script setup>
import { ref } from "vue";
import CardEditAndDelete from "./CardEditAndDelete.vue";

const props = defineProps(["card", "user"]);

const card = ref(props.card);
const user = ref(props.user);
</script>

<template>
    <v-card-item class="pl-0 pb-8" :title="card.title">
        <v-card-subtitle>{{ card.tag }}</v-card-subtitle>
        <v-spacer></v-spacer>
        <CardEditAndDelete :card="card" :user="user" />
    </v-card-item>
</template>