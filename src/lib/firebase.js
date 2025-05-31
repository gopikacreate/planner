// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
 apiKey: "AIzaSyBck0UThr590GLrlYt9n9ModrDlA4RS4XQ",
  authDomain: "wedding-planner-1d8d1.firebaseapp.com",
  projectId: "wedding-planner-1d8d1",
  storageBucket: "wedding-planner-1d8d1.firebasestorage.app",
  messagingSenderId: "1030713708541",
  appId: "1:1030713708541:web:113ca7bd7de29ed0c01394"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
