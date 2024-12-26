<!-- CardActions.vue-->

<script setup>
  import {
    toggleLike,
    toggleFavorite,
    toggleFollowUser,
  } from '@/services/Card/cardService';
  import { useUserInfo } from '@/services/User/userService';
  import { userData } from '@/services/User/userDataService';
  import { getUserData } from '@/services/User/userGetData';
  /* import { collection, query, where, getDocs } from 'firebase/firestore';
import { computed } from 'vue'; */

  const { isLoggedIn, userId } = useUserInfo();
  const { card, user } = defineProps(['card', 'user']);
  /* const db = getFirestore();

const users = computed(async () => {
  const q = query(collection(db, 'users'), where('favoriteCards', 'array-contains', card.id));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs;
});

const totalFavorites = computed(() => {
  return users.value.reduce((count, user) => {
    if (user.favoriteCards.includes(card.id)) {
      count++;
    }
    return count;
  }, 0);
}); */

  const isLiked = (card) => {
    if (!isLoggedIn || !userData.following) {
      return false;
    }
    return userData.likeCards.includes(card.id);
  };

  const isFavorite = (card) => {
    if (!isLoggedIn || !userData.following) {
      return false;
    }
    return userData.favoriteCards.includes(card.id);
  };

  const handleToggleLike = async (card) => {
    if (!userId) return;
    await toggleLike(card, userId);
  };

  const handleToggleFavorite = async (card) => {
    if (!userId) return;
    await toggleFavorite(card);
  };

  const isFollowed = () => {
    if (!isLoggedIn || !userData.following) {
      return false;
    }
    return userData.following.includes(card.createdBy);
  };

  const handleToggleFollowUser = async (card) => {
    if (!userId) return;
    try {
      await toggleFollowUser(card, userId);
      const cardUserData = await getUserData(card.createdBy);
      const cardUserFollowersCount = cardUserData.followers;
      card.followers = cardUserFollowersCount;
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };
</script>

<template>
  <v-card-actions>
    <v-btn
      icon
      @click="handleToggleLike(card)"
      :disabled="!isLoggedIn"
    >
      <span
        v-if="card.likes > 0"
        class="text-white"
        >{{ card.likes }}</span
      >
      <v-icon color="white"
        >{{ isLiked(card) ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}
      </v-icon>
      <v-tooltip
        activator="parent"
        location="bottom"
        >{{ isLiked(card) ? 'Unlike' : 'Like' }}</v-tooltip
      >
    </v-btn>
    <v-btn
      icon
      @click="handleToggleFavorite(card)"
      :disabled="!isLoggedIn"
    >
      <!-- <span v-if="totalFavorites > 0">{{ totalFavorites }}</span> -->
      <v-icon color="white">
        {{ isFavorite(card) ? 'mdi-bookmark' : 'mdi-bookmark-outline' }}
      </v-icon>
      <v-tooltip
        activator="parent"
        location="bottom"
        >{{
          isFavorite(card) ? 'Remove from Favorites' : 'Add to Favorites'
        }}</v-tooltip
      >
    </v-btn>
    <v-btn
      icon
      @click="handleToggleFollowUser(card)"
      :disabled="!isLoggedIn"
    >
      <v-icon color="white"
        >{{ isFollowed() ? 'mdi-account-heart' : 'mdi-account-heart-outline' }}
      </v-icon>
      <v-tooltip
        activator="parent"
        location="bottom"
        >{{
          isFollowed(card) ? 'Unfollow this user' : 'Follow this user'
        }}</v-tooltip
      >
    </v-btn>
  </v-card-actions>
</template>
