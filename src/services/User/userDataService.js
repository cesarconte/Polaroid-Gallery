// userDataService.js

import { reactive } from 'vue'

export const userData = reactive({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  fullName: '',
  avatar: '',
  createdCards: null,
  favoriteCards: null,
  likeCards: null
})

export function resetUserData() {
  for (const email in userData) {
    userData[email] = '';
  }
}
