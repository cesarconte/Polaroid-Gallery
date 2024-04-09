// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, serverTimestamp, FieldValue } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAl31RlxcZoqZ_CxYU4PC_oTlRhjM28icQ",
    authDomain: "testing-firebase-caf0c.firebaseapp.com",
    projectId: "testing-firebase-caf0c",
    storageBucket: "testing-firebase-caf0c.appspot.com",
    messagingSenderId: "960131936857",
    appId: "1:960131936857:web:47d4d54d771a9af8b03748"
  };

const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
const collectionRef = collection(db, 'cards');
const serverTimestampField = serverTimestamp();

export {
  firebaseApp,
  analytics,
  db,
  auth,
  storage,
  collectionRef,
  serverTimestampField,
  FieldValue,
};
