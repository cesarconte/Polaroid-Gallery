<!-- UserView.vue -->

<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { collection, getDocs, getFirestore } from 'firebase/firestore';
  import { useDisplay } from 'vuetify';
  import Card from '@/components/Card/Card.vue';
  import Avatar from '@/components/Base/Avatar.vue';
  import Image from '@/components/Base/Image.vue';

  const { user } = defineProps(['user']);
  const db = getFirestore();
  const users = ref([]);
  const cards = ref([]);
  // const filteredUsers = ref([]);
  // const filteredCards = ref([]);
  // const userTotalLikes = ref(0);
  // const userTotalFavorites = ref(0);

  const fetchData = async () => {
    await fetchUsers();
    await fetchAllCards();
  };

  const fetchUsers = async () => {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    users.value = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  const fetchAllCards = async () => {
    const cardsCollection = collection(db, 'cards');
    const cardsSnapshot = await getDocs(cardsCollection);
    cards.value = cardsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  onMounted(() => {
    fetchData();
  });

  const selectedUser = ref(null);

  // Using queries in Firebase instead of computed calculations //
  /* const resetValues = () => {
  filteredCards.value = [];
  filteredUsers.value = [];
  // favoriteCardsCount.value = '';
  // userTotalLikes.value = '';
};

watch(selectedUser, async (newValue) => {
  if (!newValue) {
    resetValues();
    return;
  }

  const usersRef = collection(db, 'users');
  const q1 = query(usersRef, where('fullName', '==', selectedUser.value));
  const querySnapshot1 = await getDocs(q1);
  filteredUsers.value = querySnapshot1.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  const cardsRef = collection(db, 'cards');
  const q2 = query(cardsRef, where('userFullName', '==', selectedUser.value));
  const querySnapshot2 = await getDocs(q2);
  filteredCards.value = querySnapshot2.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

   const cardsRef = collection(db, 'cards');
  const q3 = query(cardsRef, where('userFullName', '==', selectedUser.value), where('isFavorite', '==', true));
  const querySnapshot3 = await getDocs(q3);
  userTotalFavorites.value = querySnapshot3.docs.length;

 userTotalLikes.value = filteredCards.value.reduce((total, doc) => total + doc.likes, 0);

}); */

  const filteredUsers = computed(() => {
    if (!selectedUser.value) return [];
    return users.value.filter((user) => user.fullName === selectedUser.value);
  });

  const filteredCards = computed(() => {
    if (!selectedUser.value) return [];
    return cards.value.filter(
      (card) => card.userFullName === selectedUser.value
    );
  });

  const userTotalFavorites = computed(() => {
    if (!selectedUser.value) return 0;
    return filteredCards.value.filter(
      (card) => card.userFullName === selectedUser.value && card.isFavorite
    ).length;
  });

  const userTotalLikes = computed(() => {
    return filteredCards.value.reduce((total, doc) => total + doc.likes, 0);
  });

  const { sm, smAndDown, mdAndUp } = useDisplay();
</script>

<template>
  <v-responsive>
    <v-container fluid>
      <h2
        class="pb-6 mb-4"
        :class="smAndDown ? 'text-left' : 'text-center'"
      >
        Polaroid Gallery Users Information & Activity
      </h2>
      <v-autocomplete
        v-model.trim="selectedUser"
        label="Search User"
        :items="users"
        item-title="fullName"
        item-text="fullName"
        chips
        closable-chips
        prepend-inner-icon="mdi-account-outline"
        variant="outlined"
        rounded
        auto-select-first="true"
        :class="sm ? 'w-75 mx-auto' : mdAndUp ? 'w-50 mx-auto' : 'w-full'"
      >
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
      <v-container
        fluid
        :class="smAndDown ? 'mx-0 px-0' : ''"
      >
        <template v-if="selectedUser">
          <v-row
            v-for="user in filteredUsers"
            :key="user.id"
            :user="user"
          >
            <v-col :cols="smAndDown ? '12' : '9 mx-auto'">
              <v-sheet
                v-if="smAndDown"
                class="border rounded-t-xl pa-4"
              >
                <v-row>
                  <v-col
                    :cols="smAndDown ? '12' : 'auto'"
                    class="pb-0"
                  >
                    <Avatar avatarSize="96">
                      <Image
                        :imgSrc="user.avatar"
                        cover
                      ></Image>
                    </Avatar>
                  </v-col>
                  <v-col :cols="smAndDown ? '12' : 'auto'">
                    <h2 class="mb-4">{{ selectedUser }}</h2>
                    <div>
                      <p>
                        <v-icon class="mr-1">mdi-account-heart-outline</v-icon>
                        Total Followers: {{ user.followers.length }}
                      </p>
                      <p class="ml-8 mb-4">
                        Total Users Following: {{ user.following.length }}
                      </p>
                      <p>
                        <v-icon class="mr-1">mdi-bookmark-outline</v-icon>
                        Total Favorites: {{ userTotalFavorites }}
                      </p>
                      <p class="ml-8 mb-4">
                        Total My Favorites: {{ user.favoriteCards.length }}
                      </p>
                      <p>
                        <v-icon class="mr-1">mdi-thumb-up-outline</v-icon>
                        Total Likes: {{ userTotalLikes }}
                      </p>
                      <p class="ml-8 mb-4">
                        Total My Likes: {{ user.likeCards.length }}
                      </p>
                      <p class="pt-1">
                        <v-icon class="mr-1">mdi-image-outline</v-icon>
                        Total Published Polaroids:
                        {{ user.createdCards.length }}
                      </p>
                    </div>
                  </v-col>
                </v-row>
              </v-sheet>
              <v-sheet
                v-else
                class="border rounded-t-xl pa-4"
              >
                <v-row>
                  <v-col
                    :class="smAndDown ? 'text-left' : 'text-right'"
                    :cols="smAndDown ? '12' : '6'"
                  >
                    <Avatar avatarSize="96">
                      <Image
                        :imgSrc="user.avatar"
                        cover
                      ></Image>
                    </Avatar>
                  </v-col>
                  <v-col :cols="smAndDown ? '12' : '6'">
                    <h2 class="mb-12">{{ user.fullName }}</h2>
                    <div>
                      <p>
                        <v-icon class="mr-1">mdi-account-heart-outline</v-icon>
                        Total Followers: {{ user.followers.length }}
                      </p>
                      <p class="ml-8 mb-4">
                        Total Users Following: {{ user.following.length }}
                      </p>
                      <p>
                        <v-icon class="mr-1">mdi-bookmark-outline</v-icon>
                        Total Favorites: {{ userTotalFavorites }}
                      </p>
                      <p class="ml-8 mb-4">
                        Total My Favorites: {{ user.favoriteCards.length }}
                      </p>
                      <p>
                        <v-icon class="mr-1">mdi-thumb-up-outline</v-icon>
                        Total Likes: {{ userTotalLikes }}
                      </p>
                      <p class="ml-8 mb-4">
                        Total My Likes: {{ user.likeCards.length }}
                      </p>
                      <p>
                        <v-icon class="mr-1">mdi-image-outline</v-icon>
                        Total Published Polaroids:
                        {{ user.createdCards.length }}
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
                  <v-col
                    :cols="smAndDown ? '12' : '6'"
                    :class="smAndDown ? 'text-left' : 'text-right'"
                  >
                    <Avatar avatarSize="96">
                      <Image
                        src="/Avatar.svg"
                        color="secondary"
                        cover
                      ></Image>
                    </Avatar>
                  </v-col>
                  <v-col :cols="smAndDown ? '12' : '6'">
                    <h2 class="mb-12">User Name</h2>
                    <div>
                      <p>
                        <v-icon class="mr-1">mdi-account-heart-outline</v-icon>
                        Total Followers:
                      </p>
                      <p class="ml-8 mb-4">Total Users Following:</p>
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
      <v-container
        fluid
        :class="smAndDown ? 'mx-0 px-0' : ''"
      >
        <v-row>
          <v-col :cols="smAndDown ? '12' : '9 mx-auto'">
            <v-sheet
              min-height="31.624vh"
              class="pa-4 border rounded-b-xl"
            >
              <h3 class="pb-4">Published Polaroids</h3>
              <v-row class="d-flex flex-wrap mx-auto">
                <v-col
                  v-show="filteredCards.length > 0 && selectedUser"
                  cols="12"
                  sm="8 mx-auto"
                  lg="6"
                  v-for="card in filteredCards"
                  :key="card.id"
                  :card="card"
                >
                  <Card
                    :card="card"
                    class="mx-0"
                  >
                  </Card>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-responsive>
</template>
