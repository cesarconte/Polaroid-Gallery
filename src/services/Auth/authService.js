//authService.js

import { ref } from 'vue'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth'
import { userData, resetUserData } from '../User/userDataService'
import { isValidEmail, isValidPassword } from './authValidationsService'
import { userExists } from '../User/userCheckService'
import { setUserDoc } from '../User/userSetDoc'
import { getUserData } from '../User/userGetData'
import { showAlert } from '../alertService'

const auth = getAuth()
const db = getFirestore()
const errMsg = ref('')

const onAvatarChange = (event) => {
  userData.avatar = event.target.files[0]
}

const signUp = async (router) => {
  if (!isValidEmail(userData.email)) {
    showAlert('Invalid email format', 'error');
    return
  }

  if (!isValidPassword(userData.password)) {
    showAlert('Invalid password format', 'error');
    return
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
    const user = userCredential.user

    if (!user) {
      throw new Error('User creation failed.')
    }

    if (await userExists(userData.email)) {
      showAlert('Account already exists for email ' + userData.email, 'warning');
      return
    }

    await setUserDoc(user)

    await getUserData(user.uid)

    if (userData.fullName) {
      showAlert('Welcome, ' + userData.fullName + '! You have successfully signed up.', 'success');
    }
    router.push('/')
  } catch (error) {
    showAlert('Error during sign-up: ' + error.message, 'error');
    switch (error.code) {
      case 'auth/invalid-email':
        errMsg.value = 'Invalid email'
        break
      case 'auth/missing-password':
        errMsg.value = 'Missing password'
        break
      case 'auth/wrong-password':
        errMsg.value = 'Incorrect password'
        break
      case 'auth/invalid-password':
        errMsg.value = 'Invalid password'
        break
      case 'auth/invalid-credential':
        errMsg.value = 'Invalid credentials'
        break
      case 'auth/too-many-requests':
        errMsg.value = 'Too many requests'
        break
    }
  }
}

const signIn = async (router) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, userData.email, userData.password)
    const user = userCredential.user

    await getUserData(user.uid)

    if (userData.fullName) {
      showAlert('Welcome back, ' + userData.fullName + '!', 'success');
    }
    resetUserData();
    router.push('/');
  } catch (error) {
    showAlert('Error during sign-in: ' + error.message, 'error');
    switch (error.code) {
      case 'auth/invalid-email':
        errMsg.value = 'Invalid email'
        break
      case 'auth/missing-password':
        errMsg.value = 'Missing password'
        break
      case 'auth/user-not-found':
        errMsg.value = 'No account with that email was found'
        break
      case 'auth/wrong-password':
        errMsg.value = 'Incorrect password'
        break
      case 'auth/invalid-password':
        errMsg.value = 'Invalid password'
        break
      case 'auth/invalid-credential':
        errMsg.value = 'Invalid credentials'
        break
      case 'auth/invalid-login-credentials':
        errMsg.value = 'Invalid login credentials'
        break
      case 'auth/too-many-requests':
        errMsg.value = 'Too many requests'
        break
    }
  } 
}

const signInWithGoogle = async (router) => {
  const provider = new GoogleAuthProvider()

  try {
    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user

    if (await userExists(user.uid)) {
      console.log('User already exists, logging in...')
      showAlert('Welcome back, ' + user.displayName + '!', 'success');
      router.push('/')
    } else {
      console.log('User does not exist, creating document...')
      const userDocRef = doc(db, 'users', user.uid)
      const displayNameParts = user.displayName.split(' ')
      const name = displayNameParts[0]
      const lastName = displayNameParts.slice(1).join(' ') || ''

      await setDoc(userDocRef, {
        email: user.email,
        firstName: name,
        lastName: lastName,
        fullName: name + ' ' + lastName,
        createdCards: [],
        favoriteCards: [],
        likeCards: [],
        avatar: user.photoURL
      })
      console.log('User created successfully.')
      showAlert('Welcome, ' + user.displayName + '!', 'success');
      resetUserData();
      router.push('/');
    }
  } catch (error) {
    showAlert('Error during Google sign-in: ' + error.message, 'error');
  }
}

const generatePasswordResetEmail = (email, resetLink) => {
  return `
    Dear User,

    You have requested to reset your password. Please click on the following link to reset your password:

    ${resetLink}

    If you did not request this password reset, you can safely ignore this email.

    Regards,
    Your Application Team
  `;
};

const sendPasswordReset = async (email) => {
  try {
    const resetLink = 'https://example.com/reset-password';
    const emailContent = generatePasswordResetEmail(email, resetLink);
    console.log("Contenido del correo electrónico de restablecimiento de contraseña:", emailContent);
    await sendPasswordResetEmail(auth, email)
    console.log(email)
    showAlert('Password reset email sent. Check your inbox.', 'success')
  } catch (error) {
    showAlert('Error sending password reset email: ' + error.message, 'error')
  } 
}

export { errMsg, onAvatarChange, signUp, signIn, signInWithGoogle, sendPasswordReset }
