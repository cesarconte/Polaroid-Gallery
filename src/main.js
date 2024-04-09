// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { firebaseApp } from './firebase.js'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import VueSocialSharing from 'vue-social-sharing';


const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.use(VueSocialSharing);

app.mount('#app');
