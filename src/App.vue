<!-- App.vue -->

<script setup>
  import { RouterView, useRouter, RouterLink } from 'vue-router';
  import { ref, provide, watch } from 'vue';
  import { getAuth, signOut } from 'firebase/auth';
  import { useUserInfo } from './services/User/userService';
  import { userData, resetUserData } from './services/User/userDataService';
  import { useTheme, useDisplay } from 'vuetify';
  import Button from './components/Base/Button.vue';
  import PublishCard from './components/Card/PublishCard.vue';
  import Avatar from './components/Base/Avatar.vue';
  import Footer from './components/Footer.vue';

  const { isLoggedIn } = useUserInfo();
  const router = useRouter();
  const isPublishDialogOpen = ref(false);
  provide('isPublishDialogOpen', isPublishDialogOpen);
  const showPublishDialog = () => {
    isPublishDialogOpen.value = true;
  };
  const drawer = ref(false);
  const { xs, smAndUp, smAndDown, mdAndDown, mdAndUp, lgAndUp } = useDisplay();

  let auth = getAuth();

  const handleSignOut = () => {
    const signOutConfirm = confirm(
      `${userData.fullName}, do you really want to log out?`
    );
    if (signOutConfirm) {
      signOut(auth).then(() => {
        resetUserData();
        router.push('/');
      });
    }
  };

  const handleNavItem = (item) => {
    if (item.action) {
      item.action();
    } else if (item.to) {
      navigateTo(item.to);
    }
    drawer.value = false;
  };

  const navigateTo = (route) => {
    if (route) {
      router.push(route);
      drawer.value = false;
    }
  };

  const navItems = [
    {
      label: 'Explore',
      to: '/explore',
      icon: 'mdi-database-search-outline',
    },
    {
      label: 'Users',
      to: '/users',
      icon: 'mdi-account-group-outline',
    },
    {
      label: 'Register',
      to: '/register',
      icon: 'mdi-account-plus-outline',
      showWhenLoggedIn: false,
    },
    {
      label: 'Login',
      to: '/login',
      icon: 'mdi-account-circle-outline',
      showWhenLoggedIn: false,
    },
    {
      label: 'Submit a new polaroid',
      action: showPublishDialog,
      icon: 'mdi-tray-arrow-up',
    },
    {
      label: 'Log out',
      action: handleSignOut,
      icon: 'mdi-account-arrow-right-outline',
      showWhenLoggedIn: true,
    },
  ];

  const items = [
    {
      label: 'Light / Dark mode',
      iconClass: 'toggleMode mr-2',
      icon: 'mdi-theme-light-dark',
      action: toggleTheme,
    },
  ];

  const theme = useTheme();

  function toggleTheme() {
    const currentTheme = theme.global.name.value;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    theme.global.name.value = newTheme;
    localStorage.setItem('darkMode', newTheme === 'dark');
  }

  theme.global.name.value =
    localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light';
</script>

<template>
  <v-app>
    <v-app-bar
      flat
      color="grey-darken-4"
      scroll-behavior="fade-image"
      scroll-threshold="560"
      image="https://picsum.photos/1920/1080?random"
      alt="app-bar picsum random background photo image"
    >
      <template v-slot:image>
        <v-img
          gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
          alt="app-bar picsum random background photo image"
        ></v-img>
      </template>
      <template v-slot:prepend>
        <RouterLink
          active-class="activeIcon"
          to="/"
          class="text-decoration-none"
          :class="mdAndDown ? 'rounded-circle' : 'rounded-pill'"
        >
          <v-app-bar-nav-icon
            icon="mdi-panorama-variant-outline"
            border
            class="router"
          >
          </v-app-bar-nav-icon>
          <v-tooltip
            activator="parent"
            location="bottom"
            >Home</v-tooltip
          >
        </RouterLink>
      </template>
      <v-app-bar-title>Polaroid Gallery</v-app-bar-title>
      <v-spacer v-if="smAndUp"></v-spacer>
      <template v-slot:append>
        <RouterLink
          :active-class="
            mdAndDown ? 'text-black bg-white' : 'text-black bg-white'
          "
          to="/explore"
          class="router text-decoration-none mr-2 d-none d-md-block"
          :class="mdAndDown ? 'rounded-circle' : 'rounded-pill'"
        >
          <Button
            v-if="mdAndDown"
            border
            btnSize="48"
            class="rounded-circle"
          >
            <v-icon>mdi-database-search-outline</v-icon>
            <v-tooltip
              activator="parent"
              location="bottom"
              >Explore</v-tooltip
            >
          </Button>
          <Button
            v-else
            border
            :btnText="lgAndUp ? 'Explore' : ''"
            prependIcon="mdi-database-search-outline"
            :iconClass="lgAndUp ? 'mr-2' : ''"
            class="text-none rounded-pill"
          >
          </Button>
        </RouterLink>
        <RouterLink
          :active-class="
            mdAndDown ? 'text-black bg-white' : 'text-black bg-white'
          "
          to="/users"
          class="router text-decoration-none mr-2 d-none d-md-block"
          :class="mdAndDown ? 'rounded-circle' : 'rounded-pill'"
        >
          <Button
            v-if="mdAndDown"
            border
            btnSize="48"
            class="btnIcon rounded-circle"
          >
            <v-icon>mdi-account-group-outline</v-icon>
            <v-tooltip
              activator="parent"
              location="bottom"
              >Users</v-tooltip
            >
          </Button>
          <Button
            v-else
            :btnText="lgAndUp ? 'Users' : ''"
            border
            prependIcon="mdi-account-group-outline"
            :iconClass="lgAndUp ? 'mr-2' : ''"
            class="text-none rounded-pill"
          >
          </Button>
        </RouterLink>
        <RouterLink
          v-if="!isLoggedIn"
          :active-class="
            mdAndDown ? 'text-black bg-white' : 'text-black bg-white'
          "
          to="/register"
          class="router text-decoration-none d-none d-md-block mr-2"
          :class="mdAndDown ? 'rounded-circle' : 'rounded-pill'"
        >
          <Button
            v-if="mdAndDown"
            border
            btnSize="48"
            class="btnIcon rounded-circle"
          >
            <v-icon>mdi-account-plus-outline</v-icon>
            <v-tooltip
              activator="parent"
              location="bottom"
              >Register</v-tooltip
            >
          </Button>
          <Button
            v-else
            rounded="xl"
            border
            :btnText="lgAndUp ? 'Register' : ''"
            prependIcon="mdi-account-plus-outline"
            :iconClass="lgAndUp ? 'mr-2' : ''"
            class="text-none rounded-pill"
          >
          </Button>
        </RouterLink>
        <RouterLink
          v-if="!isLoggedIn"
          :active-class="
            mdAndDown ? 'text-black bg-white' : 'active text-black bg-white'
          "
          to="/login"
          class="router text-decoration-none mr-2 d-none d-sm-block"
          :class="mdAndDown ? 'rounded-circle' : 'rounded-pill'"
        >
          <Button
            v-if="mdAndDown"
            border
            btnSize="48"
            class="btnIcon rounded-circle"
          >
            <v-icon>mdi-account-circle-outline</v-icon>
            <v-tooltip
              activator="parent"
              location="bottom"
              >Login</v-tooltip
            >
          </Button>
          <Button
            v-else
            border
            :btnText="lgAndUp ? 'Log in' : ''"
            prependIcon="mdi-account-circle-outline"
            :iconClass="lgAndUp ? 'mr-2' : ''"
            class="text-none rounded-pill"
          >
          </Button>
        </RouterLink>
        <v-app-bar-nav-icon
          v-if="isLoggedIn"
          :variant="smAndDown ? '' : 'outlined'"
          color="white"
          :size="smAndDown ? '48' : ''"
          class="text-none d-none d-sm-block"
          :class="smAndDown ? 'mr-2' : 'btnAvatar rounded-pill mr-2'"
        >
          <div :class="smAndDown ? '' : 'mr-2'">
            <Avatar :avatarSize="smAndDown ? '44' : '34'">
              <v-img
                v-if="userData.avatar"
                cover
                :src="userData.avatar"
                :alt="
                  isLoggedIn ? `Avatar of ${userData.fullName}` : 'User Avatar'
                "
                color="grey-darken-3"
              >
              </v-img>
            </Avatar>
          </div>
          <span v-if="mdAndUp">{{ userData.fullName }}</span>
        </v-app-bar-nav-icon>
        <Button
          v-if="isLoggedIn && mdAndDown"
          border
          class="text-none d-none d-md-block mr-2 rounded-circle"
          btn-size="48"
          @click="handleSignOut"
        >
          <v-icon>mdi-account-arrow-right-outline</v-icon>
          <v-tooltip
            activator="parent"
            location="bottom"
            >Log out</v-tooltip
          >
        </Button>
        <Button
          v-if="isLoggedIn && lgAndUp"
          border
          class="mr-2 text-none d-none d-md-block rounded-pill"
          @click="handleSignOut"
        >
          <v-icon :class="lgAndUp ? 'mr-2' : ''"
            >mdi-account-arrow-right-outline</v-icon
          >
          <span v-if="lgAndUp">Log out</span>
        </Button>
        <PublishCard />
        <v-app-bar-nav-icon
          v-if="smAndUp"
          border
          :class="mdAndUp ? 'mr-2' : ''"
          @click="toggleTheme"
        >
          <v-icon>mdi-theme-light-dark</v-icon>
          <v-tooltip
            activator="parent"
            location="bottom"
            >Switch to Light/Dark mode</v-tooltip
          >
        </v-app-bar-nav-icon>
        <v-app-bar-nav-icon
          @click.stop="drawer = !drawer"
          aria-label="Menu"
          class="mx-2 d-md-none"
        >
          <v-icon>mdi-menu</v-icon>
          <v-tooltip
            activator="parent"
            location="bottom"
            >Menu</v-tooltip
          >
        </v-app-bar-nav-icon>
      </template>

      <v-menu>
        <template
          v-slot:activator="{ props }"
          class="px-0"
        >
          <Button
            class="d-sm-none mr-2 rounded-pill"
            btnSize="48"
            v-bind="props"
          >
            <v-icon>mdi-dots-vertical</v-icon>
            <v-tooltip
              activator="parent"
              location="bottom"
              >Drop Down Menu</v-tooltip
            >
          </Button>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :value="i"
            :prepend-icon="item.icon"
            @click="item.action"
          >
            {{ item.label }}
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      :location="'top'"
      :temporary="true"
      :class="'h-auto'"
    >
      <v-list>
        <v-list-item
          v-for="(item, index) in navItems.filter(
            (item) => !item.showWhenLoggedIn
          )"
          :key="index"
          :prepend-icon="item.icon"
          @click="handleNavItem(item)"
        >
          {{ item.label }}
        </v-list-item>
        <template v-if="isLoggedIn && xs">
          <v-list-item>
            <Avatar
              :avatarSize="'24'"
              class="mr-7"
            >
              <v-img
                v-if="userData.avatar"
                cover
                :src="userData.avatar"
                :alt="
                  isLoggedIn ? `Avatar of ${userData.fullName}` : 'User Avatar'
                "
                color="grey-darken-3"
              >
              </v-img>
            </Avatar>
            {{ userData.fullName }}
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <RouterView v-slot="{ Component }">
        <transition
          name="route"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </RouterView>
    </v-main>
    <Footer />
  </v-app>
</template>

<style scoped>
  main {
    min-height: 100vh;
  }

  .route-enter-active,
  .route-leave-active {
    transition: all 0.5s ease;
  }

  .route-enter-from {
    transform: translateX(100vw);
    opacity: 1;
  }

  .route-leave-to {
    opacity: 0;
    transform: translateX(-100vw);
  }

  .router {
    color: white;
  }

  .activeIcon .router {
    background-color: white;
    color: black;
  }

  .btnAvatar {
    padding: 4px 11px;
  }
</style>
