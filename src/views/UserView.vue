<!-- UserView.vue -->

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { useDisplay } from 'vuetify';
import Card from '@/components/Card/Card.vue';
import Avatar from '@/components/Base/Avatar.vue';
import Image from '@/components/Base/Image.vue';
import { useRoute } from 'vue-router';

const db = getFirestore();
const route = useRoute();
const favoriteCardsCount = ref(0);
const userTotalLikes = ref(0);
const users = ref([]);

const fetchData = async () => {
  await fetchUsers();
  await fetchUserData();
};

const fetchUsers = async () => {
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);
  users.value = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const user = () => {
  return users.find(u => u.id === parseInt(route.params.id))
}

const fetchUserData = async () => {
  try {
    const cardsRef = collection(db, "cards");
    const q2 = query(cardsRef, where('userFullName', '==', user.id), where('isFavorite', '==', true));
    const querySnapshot2 = await getDocs(q2);
    favoriteCardsCount.value = querySnapshot2.docs.length;

    const filteredCards = cards.value.filter(card => card.userFullName === user.id);
    userTotalLikes.value = filteredCards.reduce((total, doc) => total + doc.likes, 0);
  } catch (error) {
    console.error('Error fetching user data:', error);
    // Handle any errors gracefully
  }
};

onMounted(() => {
  fetchData();
});

const { sm, smAndDown, mdAndUp } = useDisplay();
</script>

<template>
  <v-responsive>
    <v-container fluid>
      <v-container fluid :class="smAndDown ? 'mx-0 px-0' : ''">
        <template v-if="user">
          <v-row v-for="user in filteredUsers" :key="user.id" :user="user">
            <v-col :cols="smAndDown ? '12' : '9 mx-auto'">
              <v-sheet v-if="smAndDown" class="border rounded-t-xl pa-4">
                <v-row>
                  <v-col :cols="smAndDown ? '12' : 'auto'" class="pb-0">
                    <Avatar avatarSize="96">
                      <Image :imgSrc="user.avatar" cover></Image>
                    </Avatar>
                  </v-col>
                  <v-col :cols="smAndDown ? '12' : 'auto'">
                    <h2 class="mb-4">{{ user }}</h2>
                    <div>
                      <p>
                        <v-icon class="mr-1">mdi-account-heart-outline</v-icon>
                        Total Followers: {{ user.followers.length }}
                      </p>
                      <p class="ml-8 mb-4">Total Users Following: {{ user.following.length }} </p>
                      <p>
                        <v-icon class="mr-1">mdi-bookmark-outline</v-icon>
                        Total Favorites: {{ favoriteCardsCount }}
                      </p>
                      <p class="ml-8 mb-4">Total My Favorites: {{ user.favoriteCards.length }}
                      </p>
                      <p>
                        <v-icon class="mr-1">mdi-thumb-up-outline</v-icon>
                        Total Likes: {{ userTotalLikes }}
                      </p>
                      <p class="ml-8 mb-4">Total My Likes: {{ user.likeCards.length }} </p>
                      <p class="pt-1">
                        <v-icon class="mr-1">mdi-image-outline</v-icon>
                        Total Published Polaroids: {{ user.createdCards.length }}
                      </p>
                    </div>
                  </v-col>
                </v-row>
              </v-sheet>
              <v-sheet v-else class="border rounded-t-xl pa-4">
                <v-row>
                  <v-col :class="smAndDown ? 'text-left' : 'text-right'" :cols="smAndDown ? '12' : '6'">
                    <Avatar avatarSize="96">
                      <Image :imgSrc="user.avatar" cover></Image>
                    </Avatar>
                  </v-col>
                  <v-col :cols="smAndDown ? '12' : '6'">
                    <h2 class="mb-12">{{ user.fullName }}</h2>
                    <div>
                      <p>
                        <v-icon class="mr-1">mdi-account-heart-outline</v-icon>
                        Total Followers: {{ user.followers.length }}
                      </p>
                      <p class="ml-8 mb-4">Total Users Following: {{ user.following.length }} </p>
                      <p>
                        <v-icon class="mr-1">mdi-bookmark-outline</v-icon>
                        Total Favorites: {{ favoriteCardsCount }}
                      </p>
                      <p class="ml-8 mb-4">Total My Favorites: {{ user.favoriteCards.length }}
                      </p>
                      <p>
                        <v-icon class="mr-1">mdi-thumb-up-outline</v-icon>
                        Total Likes: {{ userTotalLikes }}
                      </p>
                      <p class="ml-8 mb-4">Total My Likes: {{ user.likeCards.length }} </p>
                      <p>
                        <v-icon class="mr-1">mdi-image-outline</v-icon>
                        Total Published Polaroids: {{ user.createdCards.length }}
                      </p>
                    </div>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
          </v-row>
        </template>
        <template v-else>
          <v-row>
            <v-col :cols="smAndDown ? '12' : '9 mx-auto'">
              <v-sheet class="border rounded-t-xl pa-4">
                <v-row>
                  <v-col :cols="smAndDown ? '12' : '6'" :class="smAndDown ? 'text-left' : 'text-right'">
                    <Avatar avatarSize="96">
                      <Image src="/Avatar.svg" color="secondary" cover></Image>
                    </Avatar>
                  </v-col>
                  <v-col :cols="smAndDown ? '12' : '6'">
                    <h2 class="mb-12">User Name</h2>
                    <div>
                      <p>
                        <v-icon class="mr-1">mdi-account-heart-outline</v-icon>
                        Total Followers:
                      </p>
                      <p class="ml-8 mb-4">Total Users Following: </p>
                      <p>
                        <v-icon class="mr-1">mdi-bookmark-outline</v-icon>
                        Total Favorites:
                      </p>
                      <p class="ml-8 mb-4">Total My Favorites:</p>
                      <p>
                        <v-icon class="mr-1">mdi-thumb-up-outline</v-icon>
                        Total Likes:
                      </p>
                      <p class="ml-8 mb-4">Total My Likes:</p>
                      <p>
                        <v-icon class="mr-1">mdi-image-outline</v-icon>
                        Total Published Polaroids:
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
            <v-sheet min-height="31.624vh" class="pa-4 border rounded-b-xl">
              <h3 class="pb-4">Published Polaroids</h3>
              <v-row class="d-flex flex-wrap mx-auto">
                <v-col v-show="user" cols="12" sm="8 mx-auto" lg="6" v-for="card in filteredCards" :key="card.id"
                  :card="card">
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