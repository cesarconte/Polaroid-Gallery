<!-- ExploreView.vue -->

<script setup>
import Card from '@/components/Card/Card.vue';
import { useUserInfo } from '@/services/User/userService';
import { userData } from '@/services/User/userDataService';
import { collection, getDocs, query, orderBy, limit, writeBatch, getFirestore } from "firebase/firestore";
import { ref, onMounted, computed, watchEffect } from "vue";
import { useDisplay } from 'vuetify';

const db = getFirestore();
const { isLoggedIn } = useUserInfo();
const tags = ref([]);
const users = ref([]);
const selectedTags = ref([]);
const selectedUsers = ref([]);
const searchTitle = ref('');
const cards = ref([]);
const randomCards = ref([]);

const fetchData = async () => {
  await fetchTags();
  await fetchUsers();
  await fetchRandomCards();
  await fetchAllCards();
};

const fetchTags = async () => {
  const tagsCollection = collection(db, 'tags');
  const tagsSnapshot = await getDocs(tagsCollection);
  tags.value = tagsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
};

const fetchUsers = async () => {
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);
  users.value = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const fetchRandomCards = async () => {
  //await updateRandomOrder(); --> Restablecer en caso de tener problemas
  updateRandomOrder();
  const randomCardsCollection = collection(db, 'cards');
  const randomCardsQuery = query(randomCardsCollection, orderBy('randomOrder'), limit(6));
  const randomCardsSnapshot = await getDocs(randomCardsQuery);
  randomCards.value = randomCardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const fetchAllCards = async () => {
  const cardsCollection = collection(db, 'cards');
  const cardsSnapshot = await getDocs(cardsCollection);
  cards.value = cardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const updateRandomOrder = async () => {
  const cardsCollection = collection(db, 'cards');
  const cardsSnapshot = await getDocs(cardsCollection);
  const batch = writeBatch(db);
  cardsSnapshot.docs.forEach((doc) => {
    const randomOrderValue = Math.random();
    const cardRef = doc.ref;
    batch.update(cardRef, { randomOrder: randomOrderValue });
  });
  await batch.commit();
};

onMounted(fetchData);

 const filteredCards = computed(() => {
  if (!selectedTags.value.length && !selectedUsers.value.length && !searchTitle.value) {
    return randomCards.value;
  } else {
    return cards.value.filter(card => {
      const tagsMatch = !selectedTags.value.length || selectedTags.value.some(tag => card.tag?.toLowerCase() === tag.toLowerCase());
      const usersMatch = !selectedUsers.value.length || selectedUsers.value.some(user => card.userFullName?.toLowerCase() === user.toLowerCase());
      const titleMatch = !searchTitle.value || card.title?.toLowerCase().includes(searchTitle.value.toLowerCase());
      return tagsMatch && usersMatch && titleMatch;
    });
  }
});

watchEffect(selectedTags, filteredCards);
watchEffect(selectedUsers, filteredCards);
watchEffect(searchTitle, filteredCards);

const { xs, sm, md } = useDisplay();
</script>

<template>
  <v-responsive>
    <v-container fluid>
      <h2 class="pb-4">Explore Polaroids</h2>
      <br>
      <p v-if="isLoggedIn" class="mb-10"> We hope you find what are you looking for, {{ userData.fullName }}.</p>
      <p v-else class="mb-10"> We hope you find what are you looking for.</p>
      <div class="d-block mx-auto" :class="xs ? 'w-100' : sm ? 'w-75' : md ? 'w-75' : 'w-50'">
        <v-autocomplete v-model="selectedTags" :items="tags" item-title="name" item-text="name"
          label="Filter by Tag" clearable chips closable-chips multiple hide-details prepend-inner-icon="mdi-tag-search-outline" variant="outlined"
          rounded auto-select-first>
          <template v-slot:chip="{ props, item }">
            <v-chip
              v-bind="props"
              :text="item.raw.name"
            ></v-chip>
          </template>

          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="item.raw.name"
            ></v-list-item>
          </template>
        </v-autocomplete>
        <br>
        <v-autocomplete v-model="selectedUsers" :items="users" item-title="fullName" item-text="fullName"
          label="Filter by User" chips closable-chips multiple hide-details prepend-inner-icon="mdi-account-search-outline" variant="outlined"
          rounded auto-select-first>
          <template v-slot:chip="{ props, item }">
            <v-chip
              v-bind="props"
              :text="item.raw.fullName"
            ></v-chip>
          </template>

          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="item.raw.fullName"
            ></v-list-item>
          </template>
        </v-autocomplete>
        <br>
        <v-text-field v-model="searchTitle" label="Search by Title" hide-details prepend-inner-icon="mdi-text-search"
          variant="outlined" rounded></v-text-field>
      </div>
      <v-row class="my-4">
        <v-col cols="12" sm="9 mx-auto" md="6" lg="4" v-for="card in filteredCards" :key="card.id">
          <Card :card="card" />
        </v-col>
      </v-row>
    </v-container>
  </v-responsive>
</template>

