
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
// import { getMessaging } from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyCkRgKM5XUGqn2eIPJmTK9eQ9Z6CmbKnB0",
  authDomain: "shi-chat-backend.firebaseapp.com",
  projectId: "shi-chat-backend",
  storageBucket: "shi-chat-backend.appspot.com",
  messagingSenderId: "1034875101511",
  appId: "1:1034875101511:web:01fcb5c9ab8328e9e86c62",
  measurementId: "G-0VXGKBRE02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const functions = getFunctions(app);
const db = getFirestore(app);
// const messaging = getMessaging(app);

export { 
  auth, 
  functions, 
  provider,
  db,
  app
};