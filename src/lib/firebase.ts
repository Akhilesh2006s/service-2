// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8W3eAbNvN_SZrL3bG8mAhw0_TkP_50N4",
  authDomain: "netflix-clone-8c38e.firebaseapp.com",
  projectId: "netflix-clone-8c38e",
  storageBucket: "netflix-clone-8c38e.firebasestorage.app",
  messagingSenderId: "154557538985",
  appId: "1:154557538985:web:25b6e566505d09c99b7fb8",
  measurementId: "G-CH67DZJ20F"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 