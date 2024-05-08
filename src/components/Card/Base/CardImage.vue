<!--CardImage.vue-->

<script setup>
  import { ref, computed, watchEffect } from 'vue';
  import { getFirestore, doc, getDoc } from 'firebase/firestore';
  import { RouterLink } from 'vue-router';
  import { useDisplay } from 'vuetify';
  import CardActions from './CardActions.vue';
  import Avatar from '@/components/Base/Avatar.vue';
  import Image from '@/components/Base/Image.vue';
  import Button from '@/components/Base/Button.vue';

  const { card, user } = defineProps(['card', 'user']);
  const db = getFirestore();

  const overlay = ref(false);
  const { xs } = useDisplay();

  const imageSource = computed(() => {
    return card.image;
  });

  const avatarSource = ref('');

  watchEffect(async () => {
    if (card.createdBy) {
      const userDocRef = doc(db, 'users', card.createdBy);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const user = userDoc.data();
        const avatarURL = user.avatar;
        avatarSource.value = avatarURL;
      }
    }
  });

  const scaleAvatar = (isHovering) => {
    scaleAvatar.value = isHovering;
  };
</script>

<template>
  <v-hover v-slot="{ isHovering, props }">
    <Image
      :key="card.id"
      aspect-ratio="1.5"
      cover
      :imgSrc="imageSource"
      :lazy-src="imageSource"
      imgAlt="Image of Polaroid"
      :class="{ 'on-hover': isHovering }"
      v-bind="props"
      sizes="(min-width: 1335px) 410.6666666666667px, (min-width: 992px) calc(calc(100vw - 88px) / 3), (min-width: 768px) calc(calc(100vw - 64px) / 2), 100vw"
    >
      <v-sheet
        v-show="isHovering"
        class="cardItem h-100 pb-0"
      >
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <Button
            icon
            @click="overlay = !overlay"
          >
            <v-icon color="white">mdi-open-in-new</v-icon>
            <v-tooltip
              activator="parent"
              location="bottom"
              >Zoom In</v-tooltip
            >
          </Button>
          <v-overlay
            v-model="overlay"
            scrim="#000000"
            class="align-center justify-center"
          >
            <Image
              :imgSrc="imageSource"
              :lazy-src="imageSource"
              imgAlt="Polaroid Image"
              imgWidth="95dvw"
              max-height="95dvh"
              :class="{ 'on-hover': isHovering }"
            >
              <v-card-actions>
                <v-spacer></v-spacer>
                <Button
                  icon
                  color="white"
                  variant="flat"
                  elevation-24
                  @click="overlay = false"
                >
                  <v-icon color="black">mdi-close</v-icon>
                  <v-tooltip
                    activator="parent"
                    location="bottom"
                    >Zoom Out</v-tooltip
                  >
                </Button>
              </v-card-actions>
            </Image>
          </v-overlay>
        </v-card-actions>
        <RouterLink
          :to="{ name: 'User', params: { fullName: card.userFullName } }"
          class="d-flex align-baseline pl-4"
          :class="xs ? 'leftXs' : 'left'"
        >
          <Avatar
            avatarSize="32"
            avatarClass="avatar-container mr-n1"
            @mouseover="scaleAvatar(true)"
          >
            <Image
              imgClass="avatar-image"
              :imgSrc="avatarSource"
              :imgAlt="`${card.userFullName}'s avatar'`"
              cover
            >
            </Image>
          </Avatar>
          <v-card-text class="text-decoration-none text-white">
            {{ card.userFullName }}
          </v-card-text>
          <v-tooltip
            activator="parent"
            location="bottom"
            ><v-icon class="mr-1">mdi-cursor-default-click-outline</v-icon>User
            Information</v-tooltip
          >
        </RouterLink>
        <v-spacer></v-spacer>
        <CardActions
          :card="card"
          :user="user"
          :class="xs ? 'bottomXs' : 'bottom'"
        />
      </v-sheet>
    </Image>
  </v-hover>
</template>

<style scoped>
  .cardItem {
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0) 15%,
      rgba(0, 0, 0, 0) 85%,
      rgba(0, 0, 0, 0.5)
    );
  }

  .left {
    position: absolute;
    bottom: 4px;
  }

  .leftXs {
    position: absolute;
    bottom: 40px;
    left: -8px;
  }

  .bottom {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .bottomXs {
    position: absolute;
    bottom: -8px;
    left: -8px;
  }

  .avatar-container {
    transition: transform 0.3s;
  }

  .avatar-container:hover {
    transform: scale(1.5);
  }
</style>
