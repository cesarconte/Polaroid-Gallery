 // userGetUserDataService.js

 import { getFirestore, doc, getDoc } from 'firebase/firestore';

 export async function getUserData(uid) {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', uid);
    const docSnapshot = await getDoc(userDocRef);
  
    if (docSnapshot.exists) {
      return docSnapshot.data();
    } else {
      console.log("Document does not exist");
      return null;
    }
  };
