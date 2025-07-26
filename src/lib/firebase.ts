
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "echostream-ia2gt",
  appId: "1:1053615411237:web:d1e87a95c0c9edd644efcc",
  storageBucket: "echostream-ia2gt.firebasestorage.app",
  apiKey: "AIzaSyDs988O5BffPwQCSi6zogTjLADLVpVkkbQ",
  authDomain: "echostream-ia2gt.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "1053615411237",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
