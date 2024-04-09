// setUserDoc.js

import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { getDefaultAvatarURL, uploadAvatar } from './userAvatarService'
import { userData } from './userDataService'

export async function setUserDoc(user) {
  const db = getFirestore()
  const userDocRef = doc(db, 'users', user.uid)

  try {
    let avatarURL = userData.avatar

    if (!avatarURL) {
      avatarURL = await getDefaultAvatarURL()
    } else {
      avatarURL = await uploadAvatar(user, userData.avatar)
    }

    // Actualizar el documento del usuario con la URL del avatar
    await setDoc(userDocRef, {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      fullName: userData.firstName + ' ' + userData.lastName,
      avatar: avatarURL,
      createdCards: [],
      favoriteCards: [],
      likeCards: [],
      followers: [],
      following: []
    })
  } catch (error) {
    console.error('Error setting user document:', error)
  }
}
