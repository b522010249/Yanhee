// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkwdHhhpPNOVyY4KfrpZyH51IFFmb6qa0",
  authDomain: "yanhee-7fbf8.firebaseapp.com",
  databaseURL: "https://yanhee-7fbf8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "yanhee-7fbf8",
  storageBucket: "yanhee-7fbf8.appspot.com",
  messagingSenderId: "818034118969",
  appId: "1:818034118969:web:c8ec60146b5d86c1f358e8",
  measurementId: "G-YE3HV7PRND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)