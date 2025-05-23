// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEYudE2CwLE4qQRrS8f2aLqA6hXQmYqXw",
  authDomain: "project-cost-tracker-665de.firebaseapp.com",
  projectId: "project-cost-tracker-665de",
  storageBucket: "project-cost-tracker-665de.firebasestorage.app",
  messagingSenderId: "37846585654",
  appId: "1:37846585654:web:bce92f2d741142b73e6397",
  measurementId: "G-DWWN1VRHEZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }