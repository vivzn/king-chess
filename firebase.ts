// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-86EAkkwYbi5ok9hPwyGYvrLik9pZJ_4",
  authDomain: "king-chess-ae364.firebaseapp.com",
  projectId: "king-chess-ae364",
  storageBucket: "king-chess-ae364.appspot.com",
  messagingSenderId: "633964973061",
  appId: "1:633964973061:web:73a09ddbfb06993e77206c",
  measurementId: "G-Y5M2Z6RLYJ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const provider = new GoogleAuthProvider();

const auth = getAuth();

export { provider, app, auth} 