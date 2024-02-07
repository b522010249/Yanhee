// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApIBJWFivkbfLBLw3dl5om3exY1p2x_7g",
  authDomain: "yanhee-1576a.firebaseapp.com",
  projectId: "yanhee-1576a",
  storageBucket: "yanhee-1576a.appspot.com",
  messagingSenderId: "1073896506513",
  appId: "1:1073896506513:web:9abe35ac1d014d91692b30",
  measurementId: "G-KVK8PSZ01W"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)