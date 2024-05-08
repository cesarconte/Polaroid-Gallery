<!-- LoginForm.vue -->

<script setup>
  import { ref } from 'vue';
  import { userData } from '@/services/User/userDataService';
  import CardTitle from '../Base/CardTitle.vue';
  import CardSubtitle from '../Base/CardSubtitle.vue';
  import CardText from '../Base/CardText.vue';
  import Button from '../Base/Button.vue';
  import FormEmailInput from './FormEmailInput.vue';
  import FormPasswordInput from './FormPasswordInput.vue';
  import FormResetPasswordInput from './FormResetPasswordInput.vue';
  import RouterLink from '../Base/RouterLink.vue';
  import {
    signIn,
    signInWithGoogle,
    errMsg,
    sendPasswordReset,
  } from '@/services/Auth/authService';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const loading = ref(false);
  const showResetPasswordDialog = ref(false);
  const openResetPasswordDialog = () => {
    showResetPasswordDialog.value = true;
  };

  const handleSignIn = () => {
    try {
      loading.value = true;
      signIn(router);
    } finally {
      loading.value = false;
    }
  };

  const handleSignInWithGoogle = () => {
    signInWithGoogle(router);
  };

  const handleResetPassword = () => {
    try {
      loading.value = true;
      const email = userData.email;
      sendPasswordReset(email);
      router.push('/');
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <v-container fluid>
    <v-card
      class="mx-auto pa-8"
      max-width="448"
      rounded="lg"
      toolbar-loader
    >
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        bottom
        color="red-darken-4"
      ></v-progress-linear>
      <CardTitle
        titleText="Log in"
        class="pl-0"
      />
      <CardSubtitle
        subtitleText="Account"
        class="pl-0 mb-4"
      />
      <FormEmailInput div-txt="Email" />
      <FormPasswordInput
        div-txt="Password"
        placeholder="Enter your password"
      />
      <v-alert
        v-if="errMsg"
        dense
        outlined
        type="error"
      >
        {{ errMsg }}
      </v-alert>
      <br v-if="errMsg" />
      <v-divider class="py-3"></v-divider>
      <v-card
        class="mb-6"
        color="surface-variant"
        variant="tonal"
      >
        <CardText
          class="text-medium-emphasis text-caption"
          html="Warning: after 3 consecutive failed login attempts,
                you account will be temporarily locked for three hours. <br>
                If you must login now, or forgot your password,
                you can also click 'Forgot login password?''
                below to reset the login password."
        />
      </v-card>
      <Button
        block
        variant="tonal"
        color="warning"
        size="large"
        btnText="Forgot login password? Click here"
        @click="openResetPasswordDialog"
        class="text-none px-0 mb-4 rounded-pill"
        appendIcon="mdi-cursor-default-click-outline"
      >
      </Button>
      <v-dialog v-model="showResetPasswordDialog">
        <v-card
          width="440"
          class="mx-auto pa-8"
        >
          <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            absolute
            bottom
            color="red-darken-4"
          >
          </v-progress-linear>
          <CardTitle
            title-text="Reset your password"
            class="pl-0"
          ></CardTitle>
          <CardSubtitle
            subtitleText="Account"
            class="pl-0 mb-4"
          />
          <FormEmailInput div-txt="Email" />
          <FormResetPasswordInput
            div-txt="New Password"
            placeholder="Enter your new password"
          />
          <v-divider class="py-3"></v-divider>
          <v-scale-transition>
            <div v-if="!loading">
              <Button
                block
                variant="tonal"
                color="primary"
                size="large"
                btnText="Reset"
                @click="handleResetPassword"
                class="text-none mx-auto rounded-pill"
              >
              </Button>
              <Button
                block
                variant="tonal"
                color="error"
                size="large"
                btnText="Close"
                class="text-none mx-auto mt-8 rounded-pill"
                @click="showResetPasswordDialog = false"
              >
              </Button>
            </div>
          </v-scale-transition>
        </v-card>
      </v-dialog>
      <v-divider class="py-3"></v-divider>
      <v-scale-transition>
        <div v-if="!loading">
          <Button
            block
            color="primary"
            size="large"
            variant="tonal"
            append-icon="mdi-login"
            btnText="Log in"
            @click="handleSignIn"
            class="text-none mb-8 rounded-pill"
          >
          </Button>
          <Button
            block
            color="error"
            size="large"
            variant="tonal"
            btnText="Sign in with Google"
            @click="handleSignInWithGoogle"
            class="text-none mb-8 rounded-pill"
          >
            <v-icon
              size="24"
              class="ml-4"
              icon="mdi-google"
            ></v-icon>
          </Button>
        </div>
      </v-scale-transition>
      <CardText
        class="text-subtitle-1 text-medium-emphasis pl-0 pt-0"
        cardText="Not registered yet? Join now and start exploring!"
      />
      <RouterLink
        to="/register"
        class="text-decoration-none"
      >
        <Button
          block
          size="large"
          color="secondary"
          variant="tonal"
          btnText="Sign up"
          class="text-none rounded-pill"
          prependIcon="mdi-chevron-left"
        >
        </Button>
      </RouterLink>
    </v-card>
  </v-container>
</template>
