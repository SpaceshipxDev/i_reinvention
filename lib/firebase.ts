// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBLUvX3sIKQC0a757xAfOo9a_8jaoLkFE",
  authDomain: "eldaline.firebaseapp.com",
  projectId: "eldaline",
  storageBucket: "eldaline.firebasestorage.app",
  messagingSenderId: "48556909421",
  appId: "1:48556909421:web:594fc97ff709ae9b49b064",
  measurementId: "G-70XMNPNVNK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);