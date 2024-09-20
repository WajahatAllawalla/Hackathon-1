import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { 
  getauth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  db,
  doc,
  setDoc,
  getDoc,


  } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {}

const firebaseConfig = {
  apiKey: "AIzaSyCwdoIuF5g1PaMstkljc2XLmQ5t9tYH9v0",
  authDomain: "wajahat-2024.firebaseapp.com",
  projectId: "wajahat-2024",
  storageBucket: "wajahat-2024.appspot.com",
  messagingSenderId: "843677612028",
  appId: "1:843677612028:web:9bdbe6df8ac0b29c0a2479"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export{
    auth,
    createUserWithEmailAndPassword,
    onAuthStateChanged 
};