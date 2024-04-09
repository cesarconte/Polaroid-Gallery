<!-- RegisterForm.vue -->

<script setup>
import { useRouter } from 'vue-router';
import { ref, watch } from "vue";
import CardTitle from '@/components/Base/CardTitle.vue';
import CardSubtitle from '../Base/CardSubtitle.vue';
import FormNameLastNameInput from './FormNameLastNameInput.vue';
import AvatarInput from './FormAvatarInput.vue';
import FormEmailInput from './FormEmailInput.vue';
import FormPasswordInput from './FormPasswordInput.vue';
import RouterLink from '@/components/Base/RouterLink.vue';
import Button from '@/components/Base/Button.vue';
import { signUp, signInWithGoogle } from '@/services/Auth/authService';
import { userData } from '@/services/User/userDataService'
import { isValidEmail, isValidPassword } from '@/services/Auth/authValidationsService';
import CardText from '../Base/CardText.vue';

const router = useRouter();
const loading = ref(false);
const errorMessage = ref(null);

const handleSignUp = async () => {
  if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
    errorMessage.value = "Please fill in all fields"
    return;
  }
  try {
    loading.value = true;
    await signUp(router);
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    watch(loading, val => {
      if (!val) return
      loading.value = false
    })
  }
};

const handleSignInWithGoogle = () => {
  try {
    loading.value = true;
    signInWithGoogle(router);
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    watch(loading, val => {
      if (!val) return
      loading.value = false
    })
  }
};
</script>

<template>
  <v-container fluid>
    <v-card class="mx-auto pa-8" max-width="448" rounded="lg">
      <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom
        color="red-darken-4"></v-progress-linear>
      <CardTitle titleText="Sign up" class="pl-0" />
      <CardSubtitle subtitleText="Contact Information" class="pl-0 mb-4" />
      <FormEmailInput divTxt="Email" />
      <v-alert v-if="!isValidEmail(userData.email)" dense outlined type="warning" variant="tonal" class="mb-3">
        Please, enter a valid email address.
      </v-alert>
      <FormPasswordInput div-txt="Password" placeholder="Enter your password" />
      <v-alert v-if="!isValidPassword(userData.password)" dense outlined type="warning" variant="tonal">
        Password must have at least 8 characters, including an uppercase letter, a lowercase
        letter, and a number.
      </v-alert>
      <br>
      <v-divider class="py-3"></v-divider>
      <CardSubtitle subtitleText="Personal Information" class="pl-0 mb-4" />
      <FormNameLastNameInput v-model="userData.firstName" labelText="Name" placeholder="Enter your name"
        density="compact" prepend-inner-icon="mdi-account-outline" variant="outlined" clearable />
      <FormNameLastNameInput v-model="userData.lastName" labelText="Last Name" placeholder="Enter your last name"
        density="compact" prepend-inner-icon="mdi-account-outline" variant="outlined" clearable />
      <v-alert v-if="errorMessage" dense outlined type="error">{{ errorMessage }}</v-alert>
      <AvatarInput divTxt="Avatar" />
      <v-divider class="py-3"></v-divider>
      <v-card class="mb-6" color="surface-variant" variant="tonal" border>
        <CardText class="text-medium-emphasis text-caption"
          cardText="By signing up, you agree to our Terms of Service and Privacy Policy." />
      </v-card>
      <v-scale-transition>
        <div v-if="!loading">
          <Button block class="text-none mb-8 rounded-pill" color="primary" size="large" variant="tonal"
            btnText="Sign up" appendIcon="mdi-account-box-edit-outline" @click="handleSignUp" />
          <Button block class="text-none mb-8 rounded-pill" color="error" size="large" variant="tonal"
            btnText="Sign in with Google" appendIcon="mdi-google" @click="handleSignInWithGoogle">
          </Button>
        </div>
      </v-scale-transition>
      <CardText class="text-subtitle-1 text-medium-emphasis pl-0 pt-0" cardText="Already have an account?" />
      <RouterLink to="/login" class="text-decoration-none">
        <Button block color="secondary" size="large" variant="tonal" rounded="xl" btnText="Log in" class="text-none">
          <v-icon size="24" class="pl-4" icon="mdi-chevron-right"></v-icon>
        </Button>
      </RouterLink>
    </v-card>
  </v-container>
</template>