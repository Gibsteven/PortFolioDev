// This is a new file
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  projectId: "calltranslate-6e940",
  appId: "1:760040948795:web:ad2136d647639c5ecfc81e",
  storageBucket: "calltranslate-6e940.appspot.com",
  apiKey: "AIzaSyBbPfWzqaYuTUUHcU_COZNY1Sjtytq4tWo",
  authDomain: "calltranslate-6e940.firebaseapp.com",
  messagingSenderId: "760040948795",
  databaseURL: "https://calltranslate-6e940-default-rtdb.firebaseio.com", 
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { app, auth, db, database, storage };
