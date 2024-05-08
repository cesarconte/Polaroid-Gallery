// userUpdateService.js

import { getFirestore, doc, setDoc } from 'firebase/firestore';

const db = getFirestore();

export async function updateUser(uid, data) {
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, data, { merge: true });
  } catch (error) {
    console.error('Error updating user:', error);
  }
}
