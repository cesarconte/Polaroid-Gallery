<!-- App.vue -->

<script setup>
import { RouterView, useRouter, RouterLink } from 'vue-router';
import { ref, mergeProps, provide } from 'vue';
import { getAuth, signOut } from "firebase/auth";
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
const { smAndUp, smAndDown, mdAndDown, mdAndUp, lgAndUp } = useDisplay();

let auth = getAuth();

const handleSignOut = () => {
  const signOutConfirm = confirm(
    `${userData.fullName}, do you really want to log out?`
  );
  if (signOutConfirm) {
    signOut(auth).then(() => {
      resetUserData();
      router.push("/");
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
  { label: 'Explore', to: '/explore', icon: 'mdi-database-search-outline', btnText: 'Explore' },
  { label: 'Users', to: '/users', icon: 'mdi-account-group-outline', btnText: 'Users' },
  { label: 'Register', to: '/register', icon: 'mdi-account-plus-outline', btnText: 'Register' },
  { label: 'Login', to: '/login', icon: 'mdi-account-circle-outline', btnText: 'Log in' },
  { label: 'Submit a new polaroid', action: showPublishDialog, icon: 'mdi-tray-arrow-up' }
];

const theme = useTheme();

function toggleTheme() {
  const currentTheme = theme.global.name.value;
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  theme.global.name.value = newTheme;
  localStorage.setItem('darkMode', newTheme === 'dark');
}

theme.global.name.value = localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light';
</script>

<template>
  <v-app>
    <v-app-bar flat color="grey-darken-4" class="px-3">
      <RouterLink active-class="activeIcon" to="/" class="text-decoration-none" :class="mdAndDown ? 'rounded-circle' : 'rounded-pill'">
        <v-tooltip key="home-tooltip" location="bottom">
          <template v-slot:activator="{ props: tooltip }">
            <v-app-bar-nav-icon v-bind="mergeProps(tooltip)" icon="mdi-panorama-variant-outline" border class="router">
            </v-app-bar-nav-icon>
          </template>
          <span>Home</span>
        </v-tooltip>
      </RouterLink>
      <v-app-bar-title>Polaroid Gallery</v-app-bar-title>
      <v-spacer v-if="smAndUp"></v-spacer>
      <RouterLink :active-class="mdAndDown ? 'text-black bg-white' :'text-black bg-white'" to="/explore" 
        class="router text-decoration-none mr-2 d-none d-md-block" :class="mdAndDown ? 'rounded-circle' : 'rounded-pill'">
        <v-tooltip v-if="mdAndDown" key="explore-tooltip" location="bottom">
          <template v-slot:activator="{ props: tooltip }">
            <Button v-bind="mergeProps(tooltip)" border btnSize="48" class="rounded-circle">
              <v-icon>mdi-database-search-outline</v-icon>
            </Button>
          </template>
          <span>Explore</span>
        </v-tooltip>
        <Button v-else border :btnText="lgAndUp ? 'Explore' : ''" prependIcon="mdi-database-search-outline"
          :iconClass="lgAndUp ? 'mr-2' : ''" class="text-none rounded-pill">
        </Button>
      </RouterLink>
      <RouterLink :active-class="mdAndDown ? 'text-black bg-white' : 'text-black bg-white'" to="/users"
        class="router text-decoration-none mr-2 d-none d-md-block" :class="mdAndDown ? 'rounded-circle' : 'rounded-pill'">
        <v-tooltip v-if="mdAndDown" key="users-tooltip" location="bottom">
          <template v-slot:activator="{ props: tooltip }">
            <Button v-bind="mergeProps(tooltip)" border btnSize="48" class="btnIcon rounded-circle">
              <v-icon>mdi-account-group-outline</v-icon>
            </Button>
          </template>
          <span>Users</span>
        </v-tooltip>
        <Button v-else :btnText="lgAndUp ? 'Users' : ''" border  prependIcon="mdi-account-group-outline"
          :iconClass="lgAndUp ? 'mr-2' : ''" class="text-none rounded-pill">
        </Button>
      </RouterLink>
      <RouterLink v-if="!isLoggedIn" :active-class="mdAndDown ? 'text-black bg-white' : 'text-black bg-white'" to="/register"
        class="router text-decoration-none d-none d-md-block mr-2" :class="mdAndDown ? 'rounded-circle' : 'rounded-pill'">
        <v-tooltip v-if="mdAndDown" key="register-tooltip" location="bottom">
          <template v-slot:activator="{ props: tooltip }">
            <Button v-bind="mergeProps(tooltip)" border btnSize="48"
             class="btnIcon rounded-circle">
              <v-icon>mdi-account-plus-outline</v-icon>
            </Button>
          </template>
          <span>Register</span>
        </v-tooltip>
        <Button v-else rounded="xl" border :btnText="lgAndUp ? 'Register' : ''" prependIcon="mdi-account-plus-outline"
          :iconClass="lgAndUp ? 'mr-2' : ''" class="text-none rounded-pill">
        </Button>
      </RouterLink>
      <RouterLink v-if="!isLoggedIn" :active-class="mdAndDown ? 'text-black bg-white' : 'active text-black bg-white'" to="/login"
        class="router text-decoration-none mr-2 d-none d-sm-block" :class="mdAndDown ? 'rounded-circle' : 'rounded-pill'">
        <v-tooltip v-if="mdAndDown" key="login-tooltip" location="bottom">
          <template v-slot:activator="{ props: tooltip }">
            <Button v-bind="mergeProps(tooltip)" border btnSize="48" class="btnIcon rounded-circle"
            >
              <v-icon>mdi-account-circle-outline</v-icon>
            </Button>
          </template>
          <span>Log in</span>
        </v-tooltip>
        <Button v-else border :btnText="lgAndUp ? 'Log in' : ''"
          prependIcon="mdi-account-circle-outline" :iconClass="lgAndUp ? 'mr-2' : ''"
          class="text-none rounded-pill">
        </Button>
      </RouterLink>
      <v-app-bar-nav-icon v-if="isLoggedIn" border color="light-blue-lighten-1" :size="smAndDown ? '48' : ''" class="text-none d-none d-sm-block" :class="smAndDown ? 'mr-2' : 'btnAvatar rounded-pill mr-2'">
        <div :class="smAndDown ? '' : 'mr-2'">
          <Avatar :avatarSize="smAndDown ? '44' : '34'">
            <v-img v-if="userData.avatar" cover :src="userData.avatar"
              :alt="isLoggedIn ? `Avatar of ${userData.fullName}` : 'User Avatar'" color="grey-darken-3">
            </v-img>
          </Avatar>
        </div>
        <span v-if="mdAndUp">{{ userData.fullName }}</span>
      </v-app-bar-nav-icon>
      <v-tooltip v-if="isLoggedIn && mdAndDown" key="logout-tooltip" location="bottom">
          <template v-slot:activator="{ props: tooltip }">
            <Button v-bind="mergeProps(tooltip)" border
              class="text-none d-none d-md-block mr-2 rounded-circle" btn-size="48" @click="handleSignOut">
              <v-icon>mdi-account-arrow-right-outline</v-icon>
            </Button>
          </template>
          <span>Log out</span>
        </v-tooltip>
        <Button v-if="isLoggedIn && lgAndUp" border class="mr-2 text-none d-none d-md-block rounded-pill"
          @click="handleSignOut">
          <v-icon :class="lgAndUp ? 'mr-2' : ''">mdi-account-arrow-right-outline</v-icon>
          <span v-if="lgAndUp">Log out</span>
        </Button>
      <PublishCard />
      <v-tooltip key="theme-tooltip" location="bottom">
        <template v-slot:activator="{ props: tooltip }">
          <v-app-bar-nav-icon v-if="smAndUp" v-bind="mergeProps(tooltip)" border icon="mdi-theme-light-dark"
            @click="toggleTheme">
          </v-app-bar-nav-icon>
        </template>
        <span>Switch to Light/Dark mode</span>
      </v-tooltip>
      <!-- Menu Button -->
      <v-tooltip key="menu-tooltip" location="bottom">
        <template v-slot:activator="{ props: tooltip }">
          <v-app-bar-nav-icon v-bind="mergeProps(tooltip)" icon="mdi-menu" @click.stop="drawer = !drawer"
            aria-label="Menu" class="ml-2 d-md-none"></v-app-bar-nav-icon>
        </template>
        <span>Menu</span>
      </v-tooltip>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app :location="'top'" :temporary="true" :class="'h-auto'"
      color="grey-darken-3">
      <v-list>
        <v-list-item v-for="(item, index) in navItems" :key="index" @click="handleNavItem(item)"
          :prepend-icon="item.icon">
          {{ item.label }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
        <RouterView v-slot="{ Component }">
          <transition name="route" mode="out-in">
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
