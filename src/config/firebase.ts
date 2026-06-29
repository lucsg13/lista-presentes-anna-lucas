import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDZGnZoQ6MjT6Yy9PivUZfxhqvRpAOIT4M",
  authDomain: "anna-e-lucas.firebaseapp.com",
  projectId: "anna-e-lucas",
  storageBucket: "anna-e-lucas.firebasestorage.app",
  messagingSenderId: "110983745757",
  appId: "1:110983745757:web:3fea4eacf586b89785cb34",
  measurementId: "G-VWMY31DZK3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
