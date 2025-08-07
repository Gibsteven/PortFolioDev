// This is a new file
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  projectId: "dev-showcase-2thoo",
  appId: "1:46213438407:web:1d770784d41455913c17e2",
  storageBucket: "dev-showcase-2thoo.appspot.com",
  apiKey: "AIzaSyCL_Hi2ZVImTU2wvsB2WwVX_4gSGzCM3lk",
  authDomain: "dev-showcase-2thoo.firebaseapp.com",
  messagingSenderId: "46213438407",
  databaseURL: "https://dev-showcase-2thoo-default-rtdb.firebaseio.com",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { app, auth, db, database, storage };
