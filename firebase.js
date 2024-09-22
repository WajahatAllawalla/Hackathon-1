import {
  initializeApp
}
  from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  deleteField,
  documentId
}
  from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

import {
  getStorage,
  ref,
  deleteObject
}
  from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
}
  from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCwdoIuF5g1PaMstkljc2XLmQ5t9tYH9v0",
  authDomain: "wajahat-2024.firebaseapp.com",
  projectId: "wajahat-2024",
  storageBucket: "wajahat-2024.appspot.com",
  messagingSenderId: "843677612028",
  appId: "1:843677612028:web:9bdbe6df8ac0b29c0a2479"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {
    app,
    getFirestore,
    db,
    collection,
    addDoc,
    getDocs,
    getStorage,
    ref,
    deleteObject,
    doc,
    deleteDoc,
    updateDoc,
    deleteField,
    documentId,
    getAuth,
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
};