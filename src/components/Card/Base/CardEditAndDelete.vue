<!-- CardEditAndDelete-->

<script setup>
  import { ref, toRaw, onMounted, watchEffect } from 'vue';
  import {
    getFirestore,
    collection,
    doc,
    getDocs,
    updateDoc,
    deleteDoc,
    arrayRemove,
    serverTimestamp,
  } from 'firebase/firestore';
  import {
    getStorage,
    ref as firebaseStorageRef,
    uploadBytes,
    getDownloadURL,
    deleteObject,
  } from 'firebase/storage';
  import { useDisplay } from 'vuetify';
  import { getUserId } from '@/services/User/userUserId';
  import { useUserInfo } from '@/services/User/userService';
  import { userData } from '@/services/User/userDataService';
  import Button from '@/components/Base/Button.vue';

  const props = defineProps(['card']);
  const card = ref(props.card);
  const { isLoggedIn } = useUserInfo();
  const db = getFirestore();

  const editedCard = ref({
    image: null,
    title: null,
    tag: null,
    updatedAt: serverTimestamp(),
  });
  const { xs, smAndDown, md, lg } = useDisplay();
  const cardSource = ref(card.value);
  const selectedPhrase = ref('');
  const editionPhrases = ref([
    'Is this your new image',
    'Are you completely sure about the change',
    'Will this be the new image for your card',
  ]);
  const tags = ref([]);

  onMounted(async () => {
    const tagsCollection = collection(db, 'tags');
    const tagsSnapshot = await getDocs(tagsCollection);

    tags.value = tagsSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
  });

  const onFileChange = async (event) => {
    const file = event.target.files[0];
    const storage = getStorage();
    const metadata = {
      contentType: file.type,
    };
    const storageRef = firebaseStorageRef(storage, 'images/' + file.name);

    try {
      const snapshot = await uploadBytes(storageRef, file, metadata);

      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log('File uploaded successfully. URL:', downloadURL);

      const previousImageUrl = editedCard.value.image;
      if (previousImageUrl) {
        const storage = getStorage();
        const previousImageRef = firebaseStorageRef(storage, previousImageUrl);
        await deleteObject(previousImageRef);
      }

      editedCard.value.image = downloadURL;

      const randomIndex = Math.floor(
        Math.random() * editionPhrases.value.length
      );
      selectedPhrase.value = editionPhrases.value[randomIndex];
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  async function editCard() {
    try {
      const userId = getUserId();
      if (userId && userId === card.value.createdBy) {
        editedCard.value.title = editedCard.value.title || card.value.title;
        editedCard.value.tag = editedCard.value.tag || card.value.tag;
        editedCard.value.updatedAt = serverTimestamp();

        const cardDocRef = doc(collection(db, 'cards'), card.value.id);

        await updateDoc(cardDocRef, {
          title: editedCard.value.title,
          tag: editedCard.value.tag,
          image: editedCard.value.image,
          updatedAt: editedCard.value.updatedAt,
        });

        card.value.image = editedCard.value.image;
        card.value.title = editedCard.value.title;
        card.value.tag = editedCard.value.tag;

        console.log('Card updated successfully');
      } else {
        console.error('User is not authorized to edit this card');
      }
    } catch (error) {
      console.error('Error updating card:', error);
    }
  }

  async function cancelEdit() {
    /*cardSource.value.image = card.value.image; <== Revisar
  cardSource.value.title = card.value.title;
  cardSource.value.tag = card.value.tag;*/
    cardSource.value = card.value;
  }

  async function deleteCard() {
    try {
      const userId = getUserId();
      if (userId && userId === card.value.createdBy) {
        const userDocRef = doc(collection(db, 'users'), userId);
        const cardDocRef = doc(collection(db, 'cards'), card.value.id);

        const storage = getStorage();
        const imageRef = firebaseStorageRef(storage, card.value.image);
        await deleteObject(imageRef);

        await deleteDoc(cardDocRef);

        await updateDoc(userDocRef, {
          createdCards: arrayRemove(card.value.id),
        });

        console.log('Card deleted successfully');
      } else {
        console.error('User is not authorized to delete this card');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  }

  const displayedImage = ref(card.value.image);
  const selectedImage = ref(null);

  watchEffect(() => {
    if (selectedImage.value) {
      displayedImage.value = editedCard.value.image;
    } else {
      displayedImage.value = card.value.image;
    }
  });

  const showShareDialog = ref(false);

  const openShareDialog = () => {
    showShareDialog.value = true;
  };

  const closeShareDialog = () => {
    showShareDialog.value = false;
  };

  const selectedNetworks = [
    {
      network: 'facebook',
      name: 'Facebook',
      icon: 'mdi-facebook',
      color: 'primary',
    },
    { network: 'twitter', name: 'Twitter', icon: 'mdi-twitter', color: 'blue' },
    {
      network: 'whatsapp',
      name: 'Whatsapp',
      icon: 'mdi-whatsapp',
      color: 'success',
    },
    { network: 'email', name: 'Email', icon: 'mdi-email', color: 'red' },
  ];
</script>

<template>
  <v-card-actions class="right">
    <Button
      icon
      @click="openShareDialog"
    >
      <v-icon>mdi-share-variant-outline</v-icon>
      <v-tooltip
        activator="parent"
        location="bottom"
        >Share Polaroid</v-tooltip
      >
    </Button>
    <v-dialog
      v-model="showShareDialog"
      max-width="fit-content"
    >
      <v-card class="pa-6">
        <v-card-title class="pl-3 pt-0">Share on...</v-card-title>
        <v-card-actions class="flex flex-wrap justify-center mt-6">
          <ShareNetwork
            v-for="network in selectedNetworks"
            :network="network.network"
            :key="network.network"
            :url="toRaw(card).image"
            :title="toRaw(card).title"
          >
            <v-btn-group class="my-2">
              <Button
                :appendIcon="network.icon"
                :href="network.url"
                class="text-none px-4 mx-2 rounded-pill"
                :color="network.color"
                border
                target="_blank"
                :iconClass="'ml-3'"
                :btnText="network.name"
              >
              </Button>
            </v-btn-group>
          </ShareNetwork>
        </v-card-actions>
        <v-divider class="my-3"></v-divider>
        <v-card-actions>
          <Button
            @click="closeShareDialog"
            variant="tonal"
            block
            border
            class="text-none py-3 rounded-pill"
            btnText="Close"
          >
          </Button>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      transition="dialog-top-transition"
      :width="smAndDown ? '90%' : md ? '82.5%' : lg ? '72.25%' : '66%'"
    >
      <template v-slot:activator="{ props }">
        <Button
          icon
          v-bind="props"
          :disabled="!isLoggedIn || card.userFullName !== userData.fullName"
        >
          <v-icon>mdi-pencil-outline</v-icon>
          <v-tooltip
            activator="parent"
            location="bottom"
            >Edit Polaroid</v-tooltip
          >
        </Button>
      </template>

      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-item>
            <v-card-title class="pb-4"
              >Edit "{{ cardSource?.title ? cardSource.title : '' }}"
              polaroid</v-card-title
            >
            <v-form
              ref="form"
              role="form"
            >
              <v-img
                :src="displayedImage"
                alt="Polaroid Image"
                height="250"
              >
              </v-img>
              <v-card-text class="text-center">{{
                selectedPhrase && card.id
                  ? `${selectedPhrase},
                ${card.userFullName}?`
                  : ''
              }}</v-card-text>
              <v-file-input
                v-model="selectedImage"
                type="file"
                name="file"
                label="Select an image"
                id="file"
                accept="image/*"
                required
                @change="onFileChange"
              ></v-file-input>
              <v-text-field
                v-model="card.title"
                label="Títle"
                type="text"
                clearable
              ></v-text-field>
              <v-autocomplete
                v-model="card.tag"
                label="Tag"
                clearable
                :items="tags"
                item-title="name"
                auto-select-first="true"
              ></v-autocomplete>
            </v-form>
            <v-card-actions :class="xs ? 'd-block' : 'd-flex justify-center'">
              <Button
                variant="tonal"
                btnColor="success"
                btnText="Save"
                border
                :block="xs"
                class="text-none rounded-pill"
                :class="xs ? 'ml-0 mb-4' : 'px-10'"
                @click="editCard"
              ></Button>
              <Button
                variant="tonal"
                btnColor="warning"
                btnText="Cancel"
                border
                :block="xs"
                class="text-none rounded-pill"
                :class="xs ? 'ml-0 mb-4' : 'px-10'"
                @click="cancelEdit"
              ></Button>
              <Button
                variant="tonal"
                btnColor="error"
                btnText="Close"
                border
                :block="xs"
                class="text-none rounded-pill"
                :class="xs ? 'ml-0 mb-4' : 'px-10'"
                @click="isActive.value = false"
              ></Button>
            </v-card-actions>
          </v-card-item>
        </v-card>
      </template>
    </v-dialog>
    <Button
      icon
      @click="deleteCard"
      :disabled="!isLoggedIn || card.userFullName !== userData.fullName"
    >
      <v-icon>mdi-delete-outline</v-icon>
      <v-tooltip
        activator="parent"
        location="bottom"
        >Delete Polaroid</v-tooltip
      >
    </Button>
  </v-card-actions>
</template>

<style scoped>
  .right {
    position: absolute;
    bottom: -8px;
    right: 0;
  }
</style>
