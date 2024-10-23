// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth/cordova";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWdW_dSHIzq86xiBMbn1ODuWcp4qOHoxA",
  authDomain: "finrack-79464.firebaseapp.com",
  projectId: "finrack-79464",
  storageBucket: "finrack-79464.appspot.com",
  messagingSenderId: "978916891149",
  appId: "1:978916891149:web:d7cda7e3d00c6018615344",
  measurementId: "G-2F3NB0P6X7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);



export { app, auth, db };
