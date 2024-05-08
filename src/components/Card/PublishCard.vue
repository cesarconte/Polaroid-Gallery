<!--PublishCard.vue -->

<script setup>
  import {
    ref,
    reactive,
    onMounted,
    watchEffect,
    inject,
    mergeProps,
  } from 'vue';
  import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    serverTimestamp,
  } from 'firebase/firestore';
  import {
    getStorage,
    ref as firebaseStorageRef,
    uploadBytes,
    getDownloadURL,
  } from 'firebase/storage';
  import { getAuth } from 'firebase/auth';
  import { useDisplay } from 'vuetify';
  import { useUserInfo } from '@/services/User/userService';
  import { userData } from '@/services/User/userDataService';
  import CardTitle from '../Base/CardTitle.vue';
  import CardText from '../Base/CardText.vue';
  import Button from '../Base/Button.vue';
  import Image from '../Base/Image.vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const isPublishDialogOpen = inject('isPublishDialogOpen');
  const db = getFirestore();
  const { isLoggedIn } = useUserInfo();
  const { xs, smAndDown, smAndUp, md, mdAndDown, lg, lgAndUp } = useDisplay();

  const imagePhrases = ref([
    'Excellent choice',
    'What a fantastic selection',
    'This is a beautiful image',
    'An exquisite pick',
    'Truly stunning',
  ]);

  const selectedPhrase = ref('');

  const newCard = reactive({
    image: null,
    title: '',
    tag: '',
    userFullName: '',
    createdBy: '',
    isFavorite: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const onFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      newCard.image = file;
    }

    const randomIndex = Math.floor(Math.random() * imagePhrases.value.length);
    selectedPhrase.value = imagePhrases.value[randomIndex];
  };

  const tags = ref([]);

  onMounted(async () => {
    const tagsCollection = collection(db, 'tags');
    const tagsSnapshot = await getDocs(tagsCollection);

    tags.value = tagsSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
  });

  async function addCard() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user ? user.uid : null;

      if (!userId) {
        shoWalert('User is not logged in');
        return;
      } else {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        const userName = userDoc.data().fullName;

        if (newCard.image) {
          const storage = getStorage();
          const metadata = {
            contentType: newCard.image.type,
          };

          const storageRef = firebaseStorageRef(
            storage,
            'images/' + newCard.image.name
          );

          const snapshot = await uploadBytes(
            storageRef,
            newCard.image,
            metadata
          );

          const downloadURL = await getDownloadURL(snapshot.ref);

          newCard.createdBy = userId;
          newCard.userFullName = userName;

          const newDoc = await addDoc(collection(db, 'cards'), {
            image: downloadURL,
            title: newCard.title,
            tag: newCard.tag,
            createdBy: newCard.createdBy,
            userFullName: newCard.userFullName,
            isFavorite: newCard.isFavorite,
            likes: 0,
            likedBy: null,
            createdAt: newCard.createdAt,
            updatedAt: newCard.updatedAt,
          });

          const cardId = newDoc.id;

          const userDocRef = doc(db, 'users', userId);

          const userDoc = await getDoc(userDocRef);
          const userCards = userDoc.data().createdCards || [];
          const userFavorites = userDoc.data().favoriteCards || [];

          userCards.push(cardId);

          await updateDoc(userDocRef, {
            createdCards: userCards,
            favoriteCards: userFavorites,
          });

          if (newDoc.id) {
            newCard.image = null;
            newCard.title = '';
            newCard.tag = '';
            newCard.isFavorite = false;
          }
        }
      }
    } catch (error) {
      console.error('Error adding card:', error);
    }
  }

  const showPublishDialog = () => {
    if (isLoggedIn.value) {
      isPublishDialogOpen.value = true;
    } else {
      if (
        confirm(
          'You need to be logged in to publish a card. \nGo to login page?',
          'auth'
        )
      ) {
        router.push('/login');
      }
    }
  };

  const closePublishDialog = () => {
    isPublishDialogOpen.value = false;
  };

  const displayedImage = ref(null);
  //const selectedImage = ref(null);

  watchEffect(() => {
    if (newCard.image && newCard.image.length > 0) {
      const imageUrl = URL.createObjectURL(newCard.image[0]);
      displayedImage.value = imageUrl;
    }
  });
</script>

<template>
  <v-dialog
    v-model="isPublishDialogOpen"
    :width="smAndDown ? '90%' : md ? '82.5%' : lg ? '66%' : '50%'"
  >
    <template #activator="{ on }">
      <v-tooltip
        v-if="mdAndDown"
        key="submit-tooltip"
        location="bottom"
      >
        <template v-slot:activator="{ props: tooltipOn }">
          <Button
            v-bind="mergeProps(tooltipOn)"
            border
            btnSize="48"
            @click="showPublishDialog"
            class="d-none d-md-block mr-2 rounded-circle"
          >
            <v-icon>mdi-tray-arrow-up</v-icon>
          </Button>
        </template>
        <span>Submit polaroid</span>
      </v-tooltip>
      <Button
        v-else
        border
        :btnText="lgAndUp ? 'Submit polaroid' : ''"
        prependIcon="mdi-tray-arrow-up"
        class="mr-2 text-none rounded-pill"
        @click="showPublishDialog"
      >
      </Button>
    </template>
    <v-card class="pa-4">
      <v-card-item>
        <CardTitle
          class="pb-4"
          titleText="Publish a new polaroid"
        />
        <v-form
          ref="form"
          role="form"
        >
          <Image
            :imgSrc="displayedImage"
            imgAlt="Polaroid Image"
            imgHeight="250"
          >
          </Image>
          <CardText class="text-center">
            <template #text>
              {{
                selectedPhrase && isLoggedIn
                  ? `${selectedPhrase},
              ${userData.fullName}!`
                  : ''
              }}
            </template>
          </CardText>
          <v-file-input
            v-model="newCard.image"
            type="file"
            name="file"
            label="Select an image"
            id="file"
            accept="image/*"
            required
            prepend-inner-icon
            @change="onFileChange"
          ></v-file-input>
          <v-text-field
            v-model="newCard.title"
            clearable
            label="Title"
          ></v-text-field>
          <v-autocomplete
            v-model="newCard.tag"
            label="Tag"
            clearable
            :items="tags"
            item-title="name"
            auto-select-first="true"
          ></v-autocomplete>
        </v-form>
      </v-card-item>
      <v-card-actions :class="xs ? 'd-block' : 'd-flex justify-center'">
        <Button
          variant="tonal"
          border
          btnColor="primary"
          btnSize="large"
          @click="addCard"
          btnText="Publish"
          class="text-none rounded-pill"
          :class="xs ? 'mb-8' : 'mr-8'"
          :width="smAndUp ? '200' : ''"
          :block="xs"
        >
        </Button>
        <Button
          variant="tonal"
          border
          btnColor="error"
          btnSize="large"
          @click="closePublishDialog"
          btnText="Close"
          class="text-none rounded-pill"
          :class="xs ? 'mx-0' : ''"
          :width="smAndUp ? '200' : ''"
          :block="xs"
        >
        </Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
