// userService.js

import { ref, onMounted, onUnmounted } from 'vue'
import { getFirestore, doc, onSnapshot } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { userData } from '../User/userDataService'

export function useUserInfo() {
  const isLoggedIn = ref(false)
  const userId = ref(null)
  const isLoading = ref(true)
  const auth = getAuth()
  const db = getFirestore()

  let unsubscribe

  onMounted(() => {
    unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        isLoggedIn.value = true
        const uid = user.uid
        const userDocRef = doc(db, 'users', uid)

        await onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists) {
            const userDataSnapshot = docSnapshot.data()
            if (userDataSnapshot) {
                userId.value = userDataSnapshot.uid,
                Object.assign(userData, userDataSnapshot);
                isLoading.value = false
              }
          } else {
            console.log('Document does not exist')
          }
        })
      } else {
        isLoggedIn.value = false
        userId.value = null
        isLoading.value = false 
      }
    })
  })

  onUnmounted(() => {
    unsubscribe()
  })

  return {
    isLoggedIn,
    userId,
    ...userData,
    isLoading
  }
}