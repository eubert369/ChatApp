// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfoX3QsIJHJktehJJCmyH2jG3JtAhZO5k",
  authDomain: "chat-app-47a87.firebaseapp.com",
  projectId: "chat-app-47a87",
  storageBucket: "chat-app-47a87.firebasestorage.app",
  messagingSenderId: "600131482147",
  appId: "1:600131482147:web:523a5c49c13daf94c3f796"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);