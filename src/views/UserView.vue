<!-- UserView.vue -->

<script setup>
import { ref, onMounted, computed } from 'vue';
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useDisplay } from 'vuetify';
import Card from '@/components/Card/Card.vue';
import Avatar from '@/components/Base/Avatar.vue';
import Image from '@/components/Base/Image.vue';
import { useRoute } from 'vue-router';

const db = getFirestore();
const route = useRoute();
const { user } = defineProps(['user'])
const users = ref([]);
const cards = ref([]);

const fetchData = async () => {
  await fetchUsers();
  await fetchAllCards();
};

const fetchUsers = async () => {
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);
  users.value = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const fetchAllCards = async () => {
  const cardsCollection = collection(db, 'cards');
  const cardsSnapshot = await getDocs(cardsCollection);
  cards.value = cardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

onMounted(async () => {
  fetchData();
});

const currentUser = computed(() => {
  return users.value.find(user => user.fullName === route.params.fullName);
});

const filteredCards = computed(() => {
  if (!currentUser.value || !currentUser.value.createdCards) return [];
  return cards.value.filter(card => currentUser.value.createdCards.includes(card.id));
});

const userTotalLikes = computed(() => {
  return filteredCards.value.reduce((total, doc) => total + doc.likes, 0);
});

const userTotalFavorites = computed(() => {
  if (!currentUser.value || !currentUser.value.createdCards) return 0;
  return cards.value.filter(card => currentUser.value.createdCards.includes(card.id) && card.isFavorite).length;
});

const { smAndDown } = useDisplay();
</script>

<template>
  <v-responsive>
    <v-container fluid>
      <v-container fluid :class="smAndDown ? 'mx-0 px-0' : ''">
        <template v-if="currentUser">
          <v-row>
            <v-col :cols="smAndDown ? '12' : '9 mx-auto'">
              <v-sheet v-if="smAndDown" class="border rounded-t-xl pa-4">
                <v-row>
                  <v-col :cols="smAndDown ? '12' : 'auto'" class="pb-0">
                    <Avatar avatarSize="96">
                      <Image :imgSrc="currentUser.avatar" cover></Image>
                    </Avatar>
                  </v-col>
                  <v-col :cols="smAndDown ? '12' : 'auto'">
                    <h2 class="mb-4">{{ currentUser.fullName }}</h2>
                    <div>
                      <p>
                        <v-icon class="mr-1">mdi-account-heart-outline</v-icon>
                        Total Followers: {{ currentUser.followers.length }}
                      </p>
                      <p class="ml-8 mb-4">Total Users Following: {{
                        currentUser.following.length }} </p>
                      <p>
                        <v-icon class="mr-1">mdi-bookmark-outline</v-icon>
                        Total Favorites: {{ userTotalFavorites }}
                      </p>
                      <p class="ml-8 mb-4">Total My Favorites: {{
                        currentUser.favoriteCards.length }}
                      </p>
                      <p>
                        <v-icon class="mr-1">mdi-thumb-up-outline</v-icon>
                        Total Likes: {{ userTotalLikes }}
                      </p>
                      <p class="ml-8 mb-4">Total My Likes: {{
                        currentUser.likeCards.length }} </p>
                      <p class="pt-1">
                        <v-icon class="mr-1">mdi-image-outline</v-icon>
                        Total Published Polaroids: {{
                          currentUser.createdCards.length }}
                      </p>
                    </div>
                  </v-col>
                </v-row>
              </v-sheet>
              <v-sheet v-else class="border rounded-t-xl pa-4">
                <v-row>
                  <v-col :class="smAndDown ? 'text-left' : 'text-right'"
                    :cols="smAndDown ? '12' : '6'">
                    <Avatar avatarSize="96">
                      <Image :imgSrc="currentUser.avatar" cover></Image>
                    </Avatar>
                  </v-col>
                  <v-col :cols="smAndDown ? '12' : '6'">
                    <h2 class="mb-12">{{ currentUser.fullName }}</h2>
                    <div>
                      <p>
                        <v-icon class="mr-1">mdi-account-heart-outline</v-icon>
                        Total Followers: {{ currentUser.followers.length }}
                      </p>
                      <p class="ml-8 mb-4">Total Users Following: {{
                        currentUser.following.length }} </p>
                      <p>
                        <v-icon class="mr-1">mdi-bookmark-outline</v-icon>
                        Total Favorites: {{ userTotalFavorites }}
                      </p>
                      <p class="ml-8 mb-4">Total My Favorites: {{
                        currentUser.favoriteCards.length }}
                      </p>
                      <p>
                        <v-icon class="mr-1">mdi-thumb-up-outline</v-icon>
                        Total Likes: {{ userTotalLikes }}
                      </p>
                      <p class="ml-8 mb-4">Total My Likes: {{
                        currentUser.likeCards.length }} </p>
                      <p>
                        <v-icon class="mr-1">mdi-image-outline</v-icon>
                        Total Published Polaroids: {{
                          currentUser.createdCards.length }}
                      </p>
                    </div>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
          </v-row>
        </template>
      </v-container>
      <v-container fluid :class="smAndDown ? 'mx-0 px-0' : ''">
        <v-row>
          <v-col :cols="smAndDown ? '12' : '9 mx-auto'">
            <v-sheet v-if="currentUser && filteredCards.length > 0"
              min-height="31.624vh" class="pa-4 border rounded-b-xl">
              <h3 class="pb-4">Published Polaroids</h3>
              <v-row class="d-flex flex-wrap mx-auto">
                <v-col cols="12" sm="8 mx-auto" lg="6"
                  v-for="card in filteredCards" :key="card.id" :card="card">
                  <Card :card="card" class="mx-0" />
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-responsive>
</template>