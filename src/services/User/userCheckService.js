// userCheckService.js

import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();

export async function userExists(uid) {
  const userDocRef = doc(db, 'users', uid);
  const docSnapshot = await getDoc(userDocRef);
  return docSnapshot.exists();
}
